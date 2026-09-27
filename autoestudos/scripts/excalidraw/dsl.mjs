// Mini-DSL para desenhar diagramas Excalidraw com código.
// Gera o "skeleton" aceito por convertToExcalidrawElements (Excalidraw 0.18).
//
// Uso:
//   import {Diagram} from '../../dsl.mjs';
//   const d = new Diagram();
//   d.box('a', 0, 0, 200, 80, 'Coleta', 'roxo');
//   d.box('b', 300, 0, 200, 80, 'Modelo', 'verde');
//   d.arrow('a', 'b', {label: 'features'});
//   export default d.elements;

export const CORES = {
  roxo: {stroke: '#6741d9', bg: '#d0bfff'},
  verde: {stroke: '#2f9e44', bg: '#b2f2bb'},
  azul: {stroke: '#1971c2', bg: '#a5d8ff'},
  laranja: {stroke: '#e8590c', bg: '#ffd8a8'},
  vermelho: {stroke: '#e03131', bg: '#ffc9c9'},
  amarelo: {stroke: '#f08c00', bg: '#ffec99'},
  cinza: {stroke: '#495057', bg: '#e9ecef'},
  ciano: {stroke: '#0c8599', bg: '#99e9f2'},
  rosa: {stroke: '#c2255c', bg: '#fcc2d7'},
  tinta: {stroke: '#1e1e1e', bg: 'transparent'},
};

const FONT = 5; // Excalifont
let seedCounter = 1;

function base(extra = {}) {
  return {
    roughness: 1,
    strokeWidth: 2,
    fillStyle: 'hachure',
    seed: seedCounter++,
    ...extra,
  };
}

export class Diagram {
  constructor() {
    this.elements = [];
    this.byId = {};
    seedCounter = 1;
  }

  _shape(type, id, x, y, w, h, text, cor = 'roxo', opts = {}) {
    const c = CORES[cor] ?? CORES.roxo;
    const el = {
      type,
      id,
      x,
      y,
      width: w,
      height: h,
      strokeColor: opts.stroke ?? c.stroke,
      backgroundColor: opts.bg ?? c.bg,
      ...base({
        fillStyle: opts.fill ?? 'hachure',
        strokeStyle: opts.dashed ? 'dashed' : 'solid',
        strokeWidth: opts.strokeWidth ?? 2,
      }),
      roundness: type === 'rectangle' && opts.round !== false ? {type: 3} : null,
    };
    if (text) {
      el.label = {
        text,
        fontSize: opts.fontSize ?? 20,
        fontFamily: FONT,
        strokeColor: opts.textColor ?? '#1e1e1e',
        textAlign: opts.align ?? 'center',
        verticalAlign: opts.valign ?? 'middle',
      };
    }
    this.elements.push(el);
    this.byId[id] = {x, y, w, h, type};
    return this;
  }

  /** Caixa arredondada com texto centralizado. */
  box(id, x, y, w, h, text, cor, opts) {
    return this._shape('rectangle', id, x, y, w, h, text, cor, opts);
  }

  /** Caixa tracejada (nota, callout, "resumo"). */
  note(id, x, y, w, h, text, cor = 'cinza', opts = {}) {
    return this._shape('rectangle', id, x, y, w, h, text, cor, {
      dashed: true,
      bg: 'transparent',
      fontSize: 16,
      ...opts,
    });
  }

  ellipse(id, x, y, w, h, text, cor, opts) {
    return this._shape('ellipse', id, x, y, w, h, text, cor, opts);
  }

  diamond(id, x, y, w, h, text, cor, opts) {
    return this._shape('diamond', id, x, y, w, h, text, cor, opts);
  }

  /** Círculo numerado (①②③) no estilo dos infográficos das aulas. */
  badge(id, cx, cy, n, cor = 'roxo', r = 18) {
    return this._shape('ellipse', id, cx - r, cy - r, r * 2, r * 2, String(n), cor, {
      fill: 'solid',
      bg: '#ffffff',
      fontSize: 18,
      textColor: (CORES[cor] ?? CORES.roxo).stroke,
    });
  }

  text(x, y, text, opts = {}) {
    const c = CORES[opts.cor ?? 'tinta'];
    this.elements.push({
      type: 'text',
      x,
      y,
      text,
      fontSize: opts.size ?? 20,
      fontFamily: FONT,
      strokeColor: opts.color ?? c.stroke,
      textAlign: opts.align ?? 'left',
      ...base(),
    });
    return this;
  }

  /** Título grande do diagrama. */
  title(x, y, text, opts = {}) {
    return this.text(x, y, text, {size: 32, ...opts});
  }

  _anchor(id, side) {
    const b = this.byId[id];
    if (!b) throw new Error(`Elemento desconhecido: ${id}`);
    switch (side) {
      case 'left':
        return [b.x, b.y + b.h / 2];
      case 'right':
        return [b.x + b.w, b.y + b.h / 2];
      case 'top':
        return [b.x + b.w / 2, b.y];
      case 'bottom':
        return [b.x + b.w / 2, b.y + b.h];
      default:
        throw new Error(`Lado inválido: ${side}`);
    }
  }

  _autoSides(from, to) {
    const a = this.byId[from];
    const b = this.byId[to];
    const dx = b.x + b.w / 2 - (a.x + a.w / 2);
    const dy = b.y + b.h / 2 - (a.y + a.h / 2);
    if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? ['right', 'left'] : ['left', 'right'];
    return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom'];
  }

  /**
   * Seta ligando dois elementos (com binding, então continua conectada se for
   * editada no excalidraw.com).
   * opts: {label, from: 'right'|..., to: 'left'|..., cor, dashed, both, via: [[x,y],...]}
   */
  arrow(from, to, opts = {}) {
    const [autoFrom, autoTo] = this._autoSides(from, to);
    const [x1, y1] = this._anchor(from, opts.from ?? autoFrom);
    const [x2, y2] = this._anchor(to, opts.to ?? autoTo);
    const gap = 6;
    const pts = [[x1, y1], ...(opts.via ?? []), [x2, y2]];
    // afasta levemente as pontas da borda
    const shrink = (p, q) => {
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
      return [p[0] + ((q[0] - p[0]) / len) * gap, p[1] + ((q[1] - p[1]) / len) * gap];
    };
    pts[0] = shrink(pts[0], pts[1]);
    pts[pts.length - 1] = shrink(pts[pts.length - 1], pts[pts.length - 2]);
    const c = CORES[opts.cor ?? 'tinta'];
    const el = {
      type: 'arrow',
      x: pts[0][0],
      y: pts[0][1],
      points: pts.map(([x, y]) => [x - pts[0][0], y - pts[0][1]]),
      strokeColor: c.stroke,
      ...base({strokeStyle: opts.dashed ? 'dashed' : 'solid', strokeWidth: opts.strokeWidth ?? 2}),
      startArrowhead: opts.both ? 'arrow' : null,
      endArrowhead: opts.none ? null : 'arrow',
      start: {id: from},
      end: {id: to},
    };
    if (opts.label) {
      el.label = {text: opts.label, fontSize: opts.labelSize ?? 16, fontFamily: FONT, strokeColor: c.stroke};
    }
    this.elements.push(el);
    return this;
  }

  /** Seta livre entre dois pontos (sem binding). */
  arrowXY(x1, y1, x2, y2, opts = {}) {
    const c = CORES[opts.cor ?? 'tinta'];
    const pts = [[x1, y1], ...(opts.via ?? []), [x2, y2]];
    const el = {
      type: 'arrow',
      x: x1,
      y: y1,
      points: pts.map(([x, y]) => [x - x1, y - y1]),
      strokeColor: c.stroke,
      ...base({strokeStyle: opts.dashed ? 'dashed' : 'solid', strokeWidth: opts.strokeWidth ?? 2}),
      startArrowhead: opts.both ? 'arrow' : null,
      endArrowhead: opts.none ? null : 'arrow',
    };
    if (opts.label) {
      el.label = {text: opts.label, fontSize: opts.labelSize ?? 16, fontFamily: FONT, strokeColor: c.stroke};
    }
    this.elements.push(el);
    return this;
  }

  /** Linha (sem ponta), ex.: eixos de gráfico, separadores. */
  line(points, opts = {}) {
    const c = CORES[opts.cor ?? 'tinta'];
    const [x0, y0] = points[0];
    this.elements.push({
      type: 'line',
      x: x0,
      y: y0,
      points: points.map(([x, y]) => [x - x0, y - y0]),
      strokeColor: c.stroke,
      backgroundColor: opts.bg ?? 'transparent',
      ...base({
        strokeStyle: opts.dashed ? 'dashed' : 'solid',
        strokeWidth: opts.strokeWidth ?? 2,
        fillStyle: opts.fill ?? 'hachure',
      }),
    });
    return this;
  }
}
