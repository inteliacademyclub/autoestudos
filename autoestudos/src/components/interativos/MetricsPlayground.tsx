import React, {useRef, useState} from 'react';
import {VizFrame, Stat, Nota, vizStyles as s} from './lib/ui';
import {COR, linear, fmt, fmtInt, RoughLine} from './lib/svg';
import {mae, mape, spearman, pairwiseAccuracy} from './lib/metricas';
import st from './interativos.module.css';

// 8 criativos de uma mesma campanha: curtidas reais (30 dias depois)
const REAIS = [420, 780, 1150, 1600, 2300, 3900, 6100, 14800];
const NOMES = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'];
const LOG_REAIS = REAIS.map((v) => Math.log1p(v));

type Preset = {nome: string; f: (y: number[]) => number[]};
const media = LOG_REAIS.reduce((a, b) => a + b, 0) / LOG_REAIS.length;
const PRESETS: Preset[] = [
  {nome: 'quase perfeito', f: (y) => y.map((v, i) => v + [0.1, -0.15, 0.05, 0.12, -0.08, 0.1, -0.1, 0.05][i])},
  {nome: 'erra o nível, acerta a ordem', f: (y) => y.map((v) => v - 1.1)},
  {nome: 'acerta o nível, erra a ordem', f: (y) => [y[3], y[6], y[0], y[5], y[1], y[7], y[2], y[4]]},
  {nome: 'sempre a mediana do canal', f: (y) => y.map(() => media)},
];

const W = 640;
const H = 280;
const M = {t: 14, r: 18, b: 40, l: 64};
const MIN = Math.log1p(100);
const MAX = Math.log1p(40000);

/** Arraste as previsões e veja erro e ordenação se descolarem. */
export default function MetricsPlayground(): React.ReactElement {
  const [pred, setPred] = useState<number[]>(() => PRESETS[1].f(LOG_REAIS));
  const svgRef = useRef<SVGSVGElement>(null);
  const [arrastando, setArrastando] = useState<number | null>(null);

  const x = linear([0, REAIS.length - 1], [M.l + 30, W - M.r - 30]);
  const y = linear([MIN, MAX], [H - M.b, M.t]);

  const clamp = (v: number) => Math.min(MAX, Math.max(MIN, v));
  const mover = (i: number, v: number) => setPred((p) => p.map((pv, j) => (j === i ? clamp(v) : pv)));

  const onPointerMove = (e: React.PointerEvent) => {
    if (arrastando === null || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    mover(arrastando, y.invert(loc.y));
  };

  const maeLog = mae(LOG_REAIS, pred);
  const predCurtidas = pred.map((v) => Math.expm1(v));
  const mp = mape(REAIS, predCurtidas);
  const rho = spearman(LOG_REAIS, pred);
  const pw = pairwiseAccuracy(LOG_REAIS, pred);
  const ticksCurtidas = [100, 300, 1000, 3000, 10000, 30000];

  return (
    <VizFrame
      titulo="Erro vs. ordenação"
      subtitulo="Os círculos vazios são as curtidas reais de 8 criativos. Arraste os pontos cheios (ou use as setas do teclado) para mudar as previsões."
      simulado={false}
    >
      <div className={s.controls}>
        {PRESETS.map((p) => (
          <button key={p.nome} type="button" className={s.btn} onClick={() => setPred(p.f(LOG_REAIS))}>
            {p.nome}
          </button>
        ))}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className={s.chart}
        role="application"
        aria-label="Gráfico de previsões arrastáveis"
        onPointerMove={onPointerMove}
        onPointerUp={() => setArrastando(null)}
        onPointerLeave={() => setArrastando(null)}
      >
        {ticksCurtidas.map((t) => (
          <g key={t} className="eixo">
            <line x1={M.l} x2={W - M.r} y1={y(Math.log1p(t))} y2={y(Math.log1p(t))} style={{stroke: COR.suave, strokeDasharray: '3 4'}} />
            <text x={M.l - 8} y={y(Math.log1p(t))} dy="0.32em" textAnchor="end" fontSize={11}>
              {fmtInt(t)}
            </text>
          </g>
        ))}
        <text transform={`translate(14,${(H - M.b + M.t) / 2}) rotate(-90)`} textAnchor="middle" fontSize={12} style={{fill: 'var(--ifm-color-emphasis-700)'}}>
          curtidas (escala log)
        </text>
        {REAIS.map((_, i) => (
          <g key={i}>
            <RoughLine x1={x(i)} y1={y(LOG_REAIS[i])} x2={x(i)} y2={y(pred[i])} stroke={COR.cinza} strokeWidth={1.3} seed={i + 3} dashed />
            <circle cx={x(i)} cy={y(LOG_REAIS[i])} r={7} style={{fill: 'var(--viz-fundo)', stroke: COR.verde, strokeWidth: 2.5}} />
            <g
              className={st.handle}
              tabIndex={0}
              role="slider"
              aria-label={`Previsão do criativo ${NOMES[i]}`}
              aria-valuenow={Math.round(Math.expm1(pred[i]))}
              aria-valuemin={100}
              aria-valuemax={40000}
              onPointerDown={(e) => {
                (e.target as Element).setPointerCapture?.(e.pointerId);
                setArrastando(i);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') mover(i, pred[i] + 0.1);
                if (e.key === 'ArrowDown') mover(i, pred[i] - 0.1);
              }}
            >
              <circle cx={x(i)} cy={y(pred[i])} r={14} style={{fill: 'transparent'}} />
              <circle cx={x(i)} cy={y(pred[i])} r={7} style={{fill: COR.roxo, stroke: 'var(--viz-fundo)', strokeWidth: 1.5}} />
            </g>
            <text x={x(i)} y={H - M.b + 18} textAnchor="middle" fontSize={12}>
              {NOMES[i]}
            </text>
          </g>
        ))}
      </svg>
      <div className={s.legend}>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{border: `2.5px solid ${COR.verde}`, borderRadius: '50%'}} /> real
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.roxo, borderRadius: '50%'}} /> previsto (arraste)
        </span>
      </div>

      <div className={s.stats}>
        <Stat rotulo="MAE (log)" valor={fmt(maeLog, 2)} dica={`erro típico ×${fmt(Math.exp(maeLog), 2)}`} tom={maeLog > 0.7 ? 'bad' : maeLog < 0.25 ? 'good' : undefined} />
        <Stat rotulo="MAPE (curtidas)" valor={`${fmt(mp, 0)}%`} tom={mp > 60 ? 'bad' : undefined} />
        <Stat rotulo="Spearman" valor={Number.isNaN(rho) ? '—' : fmt(rho, 2)} tom={rho > 0.8 ? 'good' : rho < 0.3 ? 'bad' : undefined} />
        <Stat rotulo="Par-a-par" valor={`${fmt(100 * pw, 0)}%`} dica="dos 28 pares" tom={pw > 0.8 ? 'good' : pw <= 0.55 ? 'bad' : undefined} />
      </div>
      <Nota>
        Teste o preset <strong>"erra o nível, acerta a ordem"</strong>: MAE e MAPE são péssimos, mas Spearman e par-a-par são perfeitos. Para
        escolher entre criativos, isso é tudo o que importa. Agora teste <strong>"sempre a mediana do canal"</strong>: com previsão constante, o
        modelo não ordena nada (50% par-a-par), mesmo com um MAE razoável.
      </Nota>
    </VizFrame>
  );
}
