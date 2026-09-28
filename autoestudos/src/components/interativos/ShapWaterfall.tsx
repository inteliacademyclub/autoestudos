import React, {useMemo, useState} from 'react';
import {VizFrame, Segmented, Slider, Stat, Nota, vizStyles as s} from './lib/ui';
import {COR, RoughRect, linear, fmt, fmtInt} from './lib/svg';
import {gerarBase, LUMINA, sinalConteudo, type Post} from './lib/simulador';
import st from './interativos.module.css';

type Criativo = {gancho: number; rosto: boolean; textoTela: boolean; energia: number; duracao: number; hora: number};
type Feat = keyof Criativo;

const FEATS: {id: Feat; rotulo: (c: Criativo) => string}[] = [
  {id: 'gancho', rotulo: (c) => `gancho = ${c.gancho}`},
  {id: 'textoTela', rotulo: (c) => `texto na tela = ${c.textoTela ? 'sim' : 'não'}`},
  {id: 'energia', rotulo: (c) => `energia da música = ${c.energia}`},
  {id: 'duracao', rotulo: (c) => `duração = ${c.duracao} s`},
  {id: 'hora', rotulo: (c) => `hora = ${c.hora}h`},
  {id: 'rosto', rotulo: (c) => `rosto = ${c.rosto ? 'sim' : 'não'}`},
];

// Lumina: um Short típico do canal rende ≈ 2.300 curtidas. O nível é ajustado
// para que a previsão média sobre o fundo (Shorts de beleza) caia nesse valor.
let NIVEL = Math.log1p(2300);

function modelo(c: Criativo): number {
  return NIVEL + sinalConteudo({...c, setor: 'beleza'});
}

function calibrarNivel(fundo: Criativo[]) {
  const media = fundo.reduce((a, b) => a + sinalConteudo({...b, setor: 'beleza'}), 0) / fundo.length;
  NIVEL = Math.log1p(2300) - media;
}

/** SHAP exato (interventional) por força bruta: 2^6 coalizões × fundo. */
function shap(c: Criativo, fundo: Criativo[]): {base: number; phi: Record<Feat, number>} {
  const ids = FEATS.map((f) => f.id);
  const n = ids.length;
  const cache = new Map<number, number>();
  const v = (mask: number) => {
    const hit = cache.get(mask);
    if (hit !== undefined) return hit;
    let soma = 0;
    for (const b of fundo) {
      const z = {...b};
      ids.forEach((id, k) => {
        if (mask & (1 << k)) (z as Record<Feat, unknown>)[id] = c[id];
      });
      soma += modelo(z);
    }
    const val = soma / fundo.length;
    cache.set(mask, val);
    return val;
  };
  const fat = (k: number): number => (k <= 1 ? 1 : k * fat(k - 1));
  const phi = {} as Record<Feat, number>;
  ids.forEach((id, j) => {
    let acc = 0;
    for (let mask = 0; mask < 1 << n; mask++) {
      if (mask & (1 << j)) continue;
      const size = mask.toString(2).split('1').length - 1;
      const w = (fat(size) * fat(n - size - 1)) / fat(n);
      acc += w * (v(mask | (1 << j)) - v(mask));
    }
    phi[id] = acc;
  });
  return {base: v(0), phi};
}

const W = 640;
const ROW = 30;

/** Waterfall de SHAP para os Shorts da Lumina, com atributos editáveis. */
export default function ShapWaterfall(): React.ReactElement {
  const fundo = useMemo<Criativo[]>(() => {
    const posts = gerarBase().posts.filter((p: Post) => p.setor === 'beleza');
    const f = posts.filter((_, i) => i % 3 === 0).slice(0, 120).map(({gancho, rosto, textoTela, energia, duracao, hora}) => ({gancho, rosto, textoTela, energia, duracao, hora}));
    calibrarNivel(f);
    return f;
  }, []);
  const [qual, setQual] = useState<'A' | 'B'>('B');
  const [c, setC] = useState<Criativo>({...LUMINA.B});

  const trocar = (q: 'A' | 'B') => {
    setQual(q);
    const {gancho, rosto, textoTela, energia, duracao, hora} = LUMINA[q];
    setC({gancho, rosto, textoTela, energia, duracao, hora});
  };

  const {base, phi} = useMemo(() => shap(c, fundo), [c, fundo]);
  const pred = modelo(c);
  const ordenadas = [...FEATS].sort((a, b) => Math.abs(phi[b.id]) - Math.abs(phi[a.id]));

  // escala do waterfall
  let acc = base;
  const passos = ordenadas.map((f) => {
    const ini = acc;
    acc += phi[f.id];
    return {f, ini, fim: acc};
  });
  const vals = [base, pred, ...passos.flatMap((p) => [p.ini, p.fim])];
  const lo = Math.min(...vals) - 0.1;
  const hi = Math.max(...vals) + 0.1;
  const x = linear([lo, hi], [210, W - 70]);
  const H = ROW * (passos.length + 2) + 20;

  return (
    <VizFrame
      titulo="Waterfall de SHAP: por que o modelo previu isso?"
      subtitulo="Começa na previsão média do canal e soma a contribuição de cada atributo até chegar à previsão do criativo (escala log)."
    >
      <div className={s.controls}>
        <Segmented<'A' | 'B'>
          rotulo="Criativo"
          valor={qual}
          onChange={trocar}
          opcoes={[
            {valor: 'A', rotulo: 'Lumina A (tutorial)'},
            {valor: 'B', rotulo: 'Lumina B (antes/depois)'},
          ]}
        />
      </div>
      <div className={s.controls}>
        <Slider rotulo="Gancho" valor={c.gancho} min={0} max={10} onChange={(v) => setC({...c, gancho: v})} />
        <Slider rotulo="Energia" valor={c.energia} min={0} max={10} onChange={(v) => setC({...c, energia: v})} />
        <Slider rotulo="Duração" valor={c.duracao} min={8} max={90} onChange={(v) => setC({...c, duracao: v})} formato={(v) => `${v}s`} />
        <Slider rotulo="Hora" valor={c.hora} min={7} max={23} onChange={(v) => setC({...c, hora: v})} formato={(v) => `${v}h`} />
        <div className={st.toggleRow}>
          <button type="button" className={st.chip} aria-pressed={c.textoTela} onClick={() => setC({...c, textoTela: !c.textoTela})}>
            texto na tela
          </button>
          <button type="button" className={st.chip} aria-pressed={c.rosto} onClick={() => setC({...c, rosto: !c.rosto})}>
            rosto
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label={`Waterfall: base ${fmt(base, 2)}, previsão ${fmt(pred, 2)}`}>
        <text x={200} y={ROW * 0.7} textAnchor="end" fontSize={12}>
          média do canal E[f(x)]
        </text>
        <text x={x(base)} y={ROW * 0.7} fontSize={12} textAnchor="middle" style={{fill: COR.cinza}}>
          {fmt(base, 2)} ≈ {fmtInt(Math.expm1(base))}
        </text>
        <line x1={x(base)} x2={x(base)} y1={ROW} y2={H - ROW} style={{stroke: COR.cinza, strokeDasharray: '4 4'}} />
        {passos.map((p, i) => {
          const yy = ROW * (i + 1) + 4;
          const pos = phi[p.f.id] >= 0;
          const x0 = x(Math.min(p.ini, p.fim));
          const w = Math.abs(x(p.fim) - x(p.ini));
          return (
            <g key={p.f.id}>
              <text x={200} y={yy + ROW / 2} dy="0.1em" textAnchor="end" fontSize={12}>
                {p.f.rotulo(c)}
              </text>
              <RoughRect x={x0} y={yy + 3} w={Math.max(w, 1.5)} h={ROW - 10} fill={pos ? COR.verde : COR.vermelho} stroke={pos ? COR.verde : COR.vermelho} seed={i + 4} />
              <text x={Math.max(x(p.ini), x(p.fim)) + 5} y={yy + ROW / 2} dy="0.1em" fontSize={11} style={{fill: pos ? COR.verde : COR.vermelho}}>
                {pos ? '+' : '−'}
                {fmt(Math.abs(phi[p.f.id]), 2)} (×{fmt(Math.exp(phi[p.f.id]), 2)})
              </text>
            </g>
          );
        })}
        <text x={200} y={ROW * (passos.length + 1) + 22} textAnchor="end" fontSize={12} fontWeight={700}>
          previsão f(x)
        </text>
        <text x={x(pred)} y={ROW * (passos.length + 1) + 22} textAnchor="middle" fontSize={12} fontWeight={700} style={{fill: COR.roxo}}>
          {fmt(pred, 2)} ≈ {fmtInt(Math.expm1(pred))}
        </text>
      </svg>

      <div className={s.stats}>
        <Stat rotulo="Previsão" valor={`${fmtInt(Math.expm1(pred))} curtidas`} />
        <Stat rotulo="vs. canal típico" valor={`×${fmt(Math.exp(pred - base), 2)}`} tom={pred > base ? 'good' : 'bad'} />
        <Stat rotulo="Soma dos SHAP" valor={fmt(pred - base, 3)} dica="= previsão − média (sempre)" />
      </div>
      <Nota>
        Leia cada barra como "este atributo multiplica as curtidas previstas por ×…" em relação a um Short típico do canal. Duas ressalvas
        importantes: o SHAP explica o <strong>modelo</strong>, não o mundo (correlação não é causa); e aqui o modelo é o próprio simulador, sem
        ruído. No projeto, você aplica o <code>TreeExplainer</code> ao seu GBM treinado.
      </Nota>
    </VizFrame>
  );
}
