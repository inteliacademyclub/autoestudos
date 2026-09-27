import React, {useMemo, useState} from 'react';
import {VizFrame, Slider, Stat, Nota, vizStyles as s} from './lib/ui';
import {COR, RoughCircle, linear, fmt} from './lib/svg';
import {makeRng} from './lib/rng';

// Clusters de "estilo" de criativo; posição 2D = projeção ilustrativa de embeddings
const CLUSTERS = [
  {nome: 'antes/depois', cx: 0.25, cy: 0.72, efeito: 0.35, cor: COR.roxo},
  {nome: 'tutorial passo a passo', cx: 0.2, cy: 0.3, efeito: -0.05, cor: COR.azul},
  {nome: 'try-on / provador', cx: 0.52, cy: 0.82, efeito: 0.2, cor: COR.laranja},
  {nome: 'haul / unboxing', cx: 0.58, cy: 0.5, efeito: 0.0, cor: COR.amarelo},
  {nome: 'POV de direção', cx: 0.82, cy: 0.25, efeito: 0.25, cor: COR.verde},
  {nome: 'close de interior', cx: 0.85, cy: 0.62, efeito: -0.1, cor: COR.ciano},
];

type Ponto = {id: number; x: number; y: number; c: number; perf: number; dia: number};

function gerar(): Ponto[] {
  const r = makeRng(77);
  const pts: Ponto[] = [];
  CLUSTERS.forEach((cl, c) => {
    for (let i = 0; i < 26; i++) {
      pts.push({
        id: pts.length,
        x: cl.cx + r.normal(0, 0.065),
        y: cl.cy + r.normal(0, 0.065),
        c,
        perf: cl.efeito + r.normal(0, 0.4),
        dia: r.int(0, 900),
      });
    }
  });
  return pts;
}

// Os Shorts da Lumina projetados no mesmo espaço
const NOVOS = [
  {nome: 'Lumina A', x: 0.24, y: 0.36},
  {nome: 'Lumina B', x: 0.29, y: 0.66},
];

const W = 640;
const H = 380;

/** Mapa 2D de criativos: vizinhos mais próximos como comparáveis. */
export default function EmbeddingMap(): React.ReactElement {
  const pts = useMemo(gerar, []);
  const [alvo, setAlvo] = useState(1);
  const [k, setK] = useState(8);
  const [soPassado, setSoPassado] = useState(true);
  const DIA_PREVISAO = 700;

  const x = linear([0, 1], [20, W - 20]);
  const y = linear([0, 1], [H - 20, 20]);
  const novo = NOVOS[alvo];
  const candidatos = pts.filter((p) => !soPassado || p.dia < DIA_PREVISAO);
  const vizinhos = [...candidatos]
    .map((p) => ({p, d: Math.hypot(p.x - novo.x, p.y - novo.y)}))
    .sort((a, b) => a.d - b.d)
    .slice(0, k);
  const perfViz = vizinhos.map((v) => v.p.perf).sort((a, b) => a - b);
  const medViz = perfViz.length ? perfViz[Math.floor(perfViz.length / 2)] : NaN;
  const vazados = pts
    .map((p) => ({p, d: Math.hypot(p.x - novo.x, p.y - novo.y)}))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .filter((v) => v.p.dia >= DIA_PREVISAO).length;

  return (
    <VizFrame
      titulo="Espaço de embeddings e criativos comparáveis"
      subtitulo="Cada ponto é um Short já publicado. Criativos parecidos ficam perto no espaço dos embeddings (projeção 2D ilustrativa)."
    >
      <div className={s.controls}>
        <span className={s.segmented} role="group" aria-label="Criativo novo">
          {NOVOS.map((n, i) => (
            <button key={n.nome} type="button" aria-pressed={alvo === i} onClick={() => setAlvo(i)}>
              {n.nome}
            </button>
          ))}
        </span>
        <Slider rotulo="k vizinhos" valor={k} min={3} max={20} onChange={setK} />
        <label className={s.control}>
          <input type="checkbox" checked={soPassado} onChange={(e) => setSoPassado(e.target.checked)} /> só posts anteriores à data planejada
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label={`Mapa de embeddings com os ${k} vizinhos de ${novo.nome}`}>
        {CLUSTERS.map((cl, i) => (
          <text key={cl.nome} x={x(cl.cx)} y={y(cl.cy + 0.15)} textAnchor="middle" fontSize={13} className={s.sketchText} style={{fill: cl.cor}}>
            {cl.nome}
          </text>
        ))}
        {vizinhos.map(({p}) => (
          <line key={`l${p.id}`} x1={x(novo.x)} y1={y(novo.y)} x2={x(p.x)} y2={y(p.y)} style={{stroke: COR.cinza, strokeWidth: 1, strokeDasharray: '3 3'}} />
        ))}
        {pts.map((p) => {
          const ehViz = vizinhos.some((v) => v.p.id === p.id);
          const futuro = p.dia >= DIA_PREVISAO;
          return (
            <circle
              key={p.id}
              cx={x(p.x)}
              cy={y(p.y)}
              r={ehViz ? 6 : 3.6}
              style={{
                fill: CLUSTERS[p.c].cor,
                opacity: soPassado && futuro ? 0.18 : ehViz ? 1 : 0.55,
                stroke: ehViz ? 'var(--viz-tinta)' : 'none',
                strokeWidth: 1.5,
                transition: 'r 0.2s, opacity 0.2s',
              }}
            >
              <title>{`${CLUSTERS[p.c].nome}: desempenho relativo ${fmt(p.perf, 2)}${futuro ? ' (publicado depois da data planejada)' : ''}`}</title>
            </circle>
          );
        })}
        <RoughCircle cx={x(novo.x)} cy={y(novo.y)} d={22} stroke={COR.vermelho} strokeWidth={2.5} seed={4} />
        <text x={x(novo.x) + 16} y={y(novo.y) + 4} fontSize={14} fontWeight={700} style={{fill: COR.vermelho}}>
          {novo.nome}
        </text>
      </svg>

      <div className={s.stats}>
        <Stat rotulo="Mediana dos vizinhos" valor={Number.isNaN(medViz) ? '—' : `${medViz > 0 ? '+' : ''}${fmt(medViz, 2)}`} dica={`≈ ×${fmt(Math.exp(medViz), 2)} vs. canal`} />
        <Stat rotulo="Distância média" valor={fmt(vizinhos.reduce((a, v) => a + v.d, 0) / Math.max(1, vizinhos.length), 3)} dica="alta = criativo fora do padrão (baixa confiança)" />
        <Stat
          rotulo="Vizinhos do futuro (sem filtro)"
          valor={vazados}
          dica="entrariam como evidência se você não filtrar por data"
          tom={vazados > 0 && !soPassado ? 'bad' : undefined}
        />
      </div>
      <Nota>
        Os vizinhos viram duas coisas no agente: <strong>evidência</strong> ("criativos parecidos renderam ×1,4 da mediana do canal") e{' '}
        <strong>feature</strong> (a mediana dos vizinhos). Em ambos os casos, só valem vizinhos publicados <strong>antes</strong> da data
        planejada. Desmarque o filtro e veja posts do futuro entrando na conta.
      </Nota>
    </VizFrame>
  );
}
