// Kit mínimo para gráficos em SVG com traço "desenhado à mão" (rough.js).
// O gerador do rough.js é puramente computacional, então funciona no SSR.
import React, {useMemo} from 'react';
import rough from 'roughjs';
import type {Options} from 'roughjs/bin/core';

const gen = rough.generator();

/** Cores da trilha como variáveis CSS (definidas em interativos.module.css → .viz). */
export const COR = {
  roxo: 'var(--viz-roxo)',
  verde: 'var(--viz-verde)',
  azul: 'var(--viz-azul)',
  laranja: 'var(--viz-laranja)',
  vermelho: 'var(--viz-vermelho)',
  amarelo: 'var(--viz-amarelo)',
  cinza: 'var(--viz-cinza)',
  ciano: 'var(--viz-ciano)',
  tinta: 'var(--viz-tinta)',
  suave: 'var(--viz-suave)',
} as const;

export type Cor = keyof typeof COR;

export function linear(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  const f = (x: number) => r0 + (x - d0) * k;
  f.invert = (y: number) => (k === 0 ? d0 : d0 + (y - r0) / k);
  return f as ((x: number) => number) & {invert: (y: number) => number};
}

/** Ticks "bonitos" (1, 2, 5 × 10^k). */
export function ticks(min: number, max: number, count = 5): number[] {
  if (max === min) return [min];
  const span = max - min;
  const step0 = span / count;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const err = step0 / mag;
  const step = (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1) * mag;
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

export function fmt(x: number, casas = 2): string {
  if (!Number.isFinite(x)) return '—';
  return x.toLocaleString('pt-BR', {maximumFractionDigits: casas, minimumFractionDigits: 0});
}

export function fmtInt(x: number): string {
  if (!Number.isFinite(x)) return '—';
  if (Math.abs(x) >= 1e6) return `${fmt(x / 1e6, 1)} mi`;
  if (Math.abs(x) >= 1e3) return `${fmt(x / 1e3, 1)} mil`;
  return fmt(x, 0);
}

type RoughProps = {
  seed?: number;
  stroke?: string;
  fill?: string;
  fillStyle?: Options['fillStyle'];
  strokeWidth?: number;
  roughness?: number;
  opacity?: number;
  className?: string;
  dashed?: boolean;
};

const STROKE_SENTINEL = '#000001';
const FILL_SENTINEL = '#000002';

function Paths({drawable, stroke, fill, strokeWidth, opacity, className, dashed}: {drawable: ReturnType<typeof gen.rectangle>} & RoughProps) {
  const paths = gen.toPaths(drawable);
  return (
    <g opacity={opacity} className={className}>
      {paths.map((p, i) => {
        // rough.js marca cada path com as cores de opts(); trocamos pelas variáveis CSS.
        const hachura = p.stroke === FILL_SENTINEL;
        const solido = p.fill === FILL_SENTINEL;
        return (
          <path
            key={i}
            d={p.d}
            className={hachura ? 'hachura' : undefined}
            style={{
              stroke: hachura ? fill : solido ? 'none' : stroke,
              fill: solido ? fill : 'none',
              strokeWidth: hachura ? 1.1 : strokeWidth,
              strokeDasharray: dashed && !hachura && !solido ? '6 5' : undefined,
            }}
          />
        );
      })}
    </g>
  );
}

function opts({seed = 1, roughness = 1.1, fillStyle = 'hachure', fill}: RoughProps): Options {
  return {
    seed,
    roughness,
    fillStyle,
    fill: fill ? FILL_SENTINEL : undefined,
    hachureGap: 5,
    fillWeight: 1,
    bowing: 1,
    stroke: STROKE_SENTINEL,
  };
}

export function RoughRect({x, y, w, h, ...p}: {x: number; y: number; w: number; h: number} & RoughProps) {
  const drawable = useMemo(
    () => gen.rectangle(x, y, Math.max(w, 0.5), Math.max(h, 0.5), opts(p)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [x, y, w, h, p.seed, p.roughness, p.fillStyle, !!p.fill],
  );
  return <Paths drawable={drawable} strokeWidth={p.strokeWidth ?? 1.6} stroke={p.stroke ?? COR.tinta} {...p} />;
}

export function RoughLine({x1, y1, x2, y2, ...p}: {x1: number; y1: number; x2: number; y2: number} & RoughProps) {
  const drawable = useMemo(
    () => gen.line(x1, y1, x2, y2, opts(p)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [x1, y1, x2, y2, p.seed, p.roughness],
  );
  return <Paths drawable={drawable} strokeWidth={p.strokeWidth ?? 1.6} stroke={p.stroke ?? COR.tinta} {...p} />;
}

export function RoughCircle({cx, cy, d, ...p}: {cx: number; cy: number; d: number} & RoughProps) {
  const drawable = useMemo(
    () => gen.circle(cx, cy, d, opts(p)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cx, cy, d, p.seed, p.roughness, p.fillStyle, !!p.fill],
  );
  return <Paths drawable={drawable} strokeWidth={p.strokeWidth ?? 1.5} stroke={p.stroke ?? COR.tinta} {...p} />;
}

export function RoughPath({d, ...p}: {d: string} & RoughProps) {
  const drawable = useMemo(
    () => gen.path(d, opts(p)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [d, p.seed, p.roughness, !!p.fill],
  );
  return <Paths drawable={drawable} strokeWidth={p.strokeWidth ?? 1.6} stroke={p.stroke ?? COR.tinta} {...p} />;
}

/** Eixo simples (x embaixo ou y à esquerda) com ticks. */
export function Eixo({
  orient,
  scale,
  valores,
  pos,
  rotulo,
  format = (v: number) => fmt(v),
  comprimento,
}: {
  orient: 'x' | 'y';
  scale: (v: number) => number;
  valores: number[];
  /** y do eixo x, ou x do eixo y. */
  pos: number;
  rotulo?: string;
  format?: (v: number) => string;
  comprimento: [number, number];
}) {
  if (orient === 'x') {
    return (
      <g className="eixo">
        <line x1={comprimento[0]} x2={comprimento[1]} y1={pos} y2={pos} />
        {valores.map((v) => (
          <g key={v} transform={`translate(${scale(v)},${pos})`}>
            <line y2={5} />
            <text y={18} textAnchor="middle">
              {format(v)}
            </text>
          </g>
        ))}
        {rotulo && (
          <text x={(comprimento[0] + comprimento[1]) / 2} y={pos + 36} textAnchor="middle" className="eixoRotulo">
            {rotulo}
          </text>
        )}
      </g>
    );
  }
  return (
    <g className="eixo">
      <line y1={comprimento[0]} y2={comprimento[1]} x1={pos} x2={pos} />
      {valores.map((v) => (
        <g key={v} transform={`translate(${pos},${scale(v)})`}>
          <line x2={-5} />
          <text x={-8} dy="0.32em" textAnchor="end">
            {format(v)}
          </text>
        </g>
      ))}
      {rotulo && (
        <text
          transform={`translate(${pos - 44},${(comprimento[0] + comprimento[1]) / 2}) rotate(-90)`}
          textAnchor="middle"
          className="eixoRotulo"
        >
          {rotulo}
        </text>
      )}
    </g>
  );
}

/** Respeita prefers-reduced-motion nas animações dos componentes. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}
