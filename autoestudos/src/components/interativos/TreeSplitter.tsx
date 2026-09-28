import React, {useMemo, useState} from 'react';
import {VizFrame, Segmented, Slider, Stat, Nota, vizStyles as s} from './lib/ui';
import {COR, linear, ticks, fmt, Eixo, RoughLine} from './lib/svg';
import {makeRng} from './lib/rng';
import {sinalConteudo} from './lib/simulador';
import {melhorSplit, sseDe} from './lib/arvore1d';

type Feat = 'gancho' | 'duracao' | 'hora';
const FEATS: Record<Feat, {rotulo: string; min: number; max: number; passo: number; un: string}> = {
  gancho: {rotulo: 'força do gancho (0–10)', min: 0, max: 10, passo: 0.5, un: ''},
  duracao: {rotulo: 'duração (s)', min: 8, max: 90, passo: 1, un: ' s'},
  hora: {rotulo: 'hora de publicação', min: 7, max: 23, passo: 0.5, un: 'h'},
};

function gerar() {
  const r = makeRng(21);
  return Array.from({length: 160}, () => {
    const p = {
      setor: 'beleza' as const,
      gancho: Math.round(Math.min(10, Math.max(0, r.normal(5, 2.3)))),
      duracao: Math.round(Math.min(90, Math.max(8, r.normal(32, 16)))),
      hora: r.int(7, 23),
      rosto: r.bool(0.7),
      textoTela: r.bool(0.5),
      energia: Math.round(Math.min(10, Math.max(0, r.normal(5, 2)))),
    };
    return {...p, y: sinalConteudo(p) + r.normal(0, 0.3)};
  });
}

const W = 640;
const H = 260;
const M = {t: 14, r: 16, b: 46, l: 56};

/** Escolha a feature e o limiar de um split e veja quanto o erro cai. */
export default function TreeSplitter(): React.ReactElement {
  const dados = useMemo(gerar, []);
  const [feat, setFeat] = useState<Feat>('gancho');
  const cfg = FEATS[feat];
  const [thr, setThr] = useState(4.5);

  const xs = dados.map((d) => d[feat] as number);
  const ys = dados.map((d) => d.y);
  const esq = ys.filter((_, i) => xs[i] <= thr);
  const dir = ys.filter((_, i) => xs[i] > thr);
  const sseTotal = sseDe(ys);
  const sseSplit = sseDe(esq) + sseDe(dir);
  const reducao = sseTotal ? 1 - sseSplit / sseTotal : 0;
  const mE = esq.length ? esq.reduce((a, b) => a + b, 0) / esq.length : NaN;
  const mD = dir.length ? dir.reduce((a, b) => a + b, 0) / dir.length : NaN;

  const melhores = useMemo(
    () =>
      (Object.keys(FEATS) as Feat[]).map((f) => {
        const fx = dados.map((d) => d[f] as number);
        const b = melhorSplit(fx, ys, 8);
        return {f, thr: b?.thr ?? NaN, red: b ? 1 - b.sse / sseTotal : 0};
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dados],
  );
  const campea = [...melhores].sort((a, b) => b.red - a.red)[0];

  const x = linear([cfg.min, cfg.max], [M.l, W - M.r]);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const y = linear([yMin - 0.1, yMax + 0.1], [H - M.b, M.t]);

  return (
    <VizFrame
      titulo="Onde cortar? Construindo o primeiro split de uma árvore"
      subtitulo="Cada ponto é um Short. O eixo vertical é o desempenho relativo ao canal (escala log). Uma árvore escolhe a pergunta que mais reduz o erro."
    >
      <div className={s.controls}>
        <Segmented<Feat>
          rotulo="Feature"
          valor={feat}
          onChange={(f) => {
            setFeat(f);
            setThr((FEATS[f].min + FEATS[f].max) / 2);
          }}
          opcoes={[
            {valor: 'gancho', rotulo: 'gancho'},
            {valor: 'duracao', rotulo: 'duração'},
            {valor: 'hora', rotulo: 'hora'},
          ]}
        />
        <Slider rotulo="Limiar" valor={thr} min={cfg.min} max={cfg.max} passo={cfg.passo} onChange={setThr} formato={(v) => `${fmt(v, 1)}${cfg.un}`} />
        <button type="button" className={s.btn} onClick={() => setThr(melhores.find((m) => m.f === feat)!.thr)}>
          melhor limiar
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label={`Split em ${cfg.rotulo} no limiar ${thr}`}>
        <rect x={M.l} y={M.t} width={Math.max(0, x(thr) - M.l)} height={H - M.b - M.t} style={{fill: 'var(--viz-azul-bg)', opacity: 0.6}} />
        <rect x={x(thr)} y={M.t} width={Math.max(0, W - M.r - x(thr))} height={H - M.b - M.t} style={{fill: 'var(--viz-verde-bg)', opacity: 0.6}} />
        {dados.map((d, i) => (
          <circle key={i} cx={x(xs[i]) + (((i * 7919) % 11) - 5) * 0.9} cy={y(d.y)} r={3.2} style={{fill: xs[i] <= thr ? COR.azul : COR.verde, opacity: 0.75}} />
        ))}
        {esq.length > 0 && <RoughLine x1={M.l} x2={x(thr)} y1={y(mE)} y2={y(mE)} stroke={COR.azul} strokeWidth={3} seed={2} />}
        {dir.length > 0 && <RoughLine x1={x(thr)} x2={W - M.r} y1={y(mD)} y2={y(mD)} stroke={COR.verde} strokeWidth={3} seed={4} />}
        <RoughLine x1={x(thr)} x2={x(thr)} y1={M.t} y2={H - M.b} stroke={COR.vermelho} strokeWidth={2} seed={6} />
        <text x={x(thr) + 5} y={M.t + 12} fontSize={12} className={s.sketchText} style={{fill: COR.vermelho}}>
          {feat} ≤ {fmt(thr, 1)}?
        </text>
        <Eixo orient="x" scale={x} valores={ticks(cfg.min, cfg.max, 8)} pos={H - M.b} comprimento={[M.l, W - M.r]} rotulo={cfg.rotulo} />
        <Eixo orient="y" scale={y} valores={ticks(yMin, yMax, 5)} pos={M.l} comprimento={[M.t, H - M.b]} rotulo="desempenho relativo (log)" format={(v) => fmt(v, 1)} />
      </svg>

      <div className={s.stats}>
        <Stat rotulo="Folha esquerda" valor={Number.isNaN(mE) ? '—' : fmt(mE, 2)} dica={`${esq.length} posts`} />
        <Stat rotulo="Folha direita" valor={Number.isNaN(mD) ? '—' : fmt(mD, 2)} dica={`${dir.length} posts`} />
        <Stat rotulo="Redução do erro (SSE)" valor={`${fmt(100 * reducao, 1)}%`} tom={reducao > 0.15 ? 'good' : undefined} />
        <Stat rotulo="A árvore escolheria" valor={campea.f} dica={`≤ ${fmt(campea.thr, 1)} (−${fmt(100 * campea.red, 1)}%)`} />
      </div>
      <Nota>
        A árvore testa <strong>todas</strong> as features e <strong>todos</strong> os limiares e fica com o que mais reduz a soma dos erros
        quadráticos. Depois repete o processo dentro de cada lado. Repare que "hora" quase não reduz o erro com um corte só: o efeito do horário
        nobre (18h–22h) é uma faixa, e pegá-la exige dois cortes. É para isso que servem árvores mais profundas.
      </Nota>
    </VizFrame>
  );
}
