import React, {useMemo, useState} from 'react';
import {VizFrame, Segmented, Slider, Stat, Nota, vizStyles as s} from './lib/ui';
import {COR, linear, fmt, Eixo, RoughLine} from './lib/svg';
import {makeRng} from './lib/rng';

type Aba = 'quantil' | 'conformal';
type Metodo = 'split' | 'cqr';

// y = desempenho relativo; a variância cresce com a força do gancho
// (ganchos fortes tanto viralizam quanto afundam).
const mu = (x: number) => 0.12 * (x - 5);
const sd = (x: number) => 0.18 + 0.075 * x;

function gerar(seed: number, n: number) {
  const r = makeRng(seed);
  return Array.from({length: n}, () => {
    const x = r.u() * 10;
    return {x, y: mu(x) + sd(x) * r.normal()};
  });
}

function quantilVetor(v: number[], q: number): number {
  const a = [...v].sort((p, t) => p - t);
  if (!a.length) return NaN;
  const i = Math.min(a.length - 1, Math.max(0, (a.length - 1) * q));
  const lo = Math.floor(i);
  return a[lo] + (a[Math.ceil(i)] - a[lo]) * (i - lo);
}

const NB = 10; // 10 faixas de x ≈ uma árvore com 10 folhas
const faixa = (x: number) => Math.min(NB - 1, Math.floor(x));

/** Quantis por faixa (o que um GBM quantílico raso aproximaria). */
function ajustarQuantil(dados: {x: number; y: number}[], q: number): number[] {
  return Array.from({length: NB}, (_, b) => quantilVetor(dados.filter((d) => faixa(d.x) === b).map((d) => d.y), q));
}
function ajustarMedia(dados: {x: number; y: number}[]): number[] {
  return Array.from({length: NB}, (_, b) => {
    const ys = dados.filter((d) => faixa(d.x) === b).map((d) => d.y);
    return ys.reduce((a, v) => a + v, 0) / ys.length;
  });
}

const W = 330;
const H = 250;
const M = {t: 12, r: 10, b: 42, l: 44};

/** Regressão quantílica, pinball loss e calibração conformal (split e CQR). */
export default function IntervalExplorer(): React.ReactElement {
  const treino = useMemo(() => gerar(31, 500), []);
  const calib = useMemo(() => gerar(32, 200), []);
  const teste = useMemo(() => gerar(33, 300), []);
  const [aba, setAba] = useState<Aba>('quantil');
  const [alpha, setAlpha] = useState(0.9);
  const [nivel, setNivel] = useState(0.8);
  const [metodo, setMetodo] = useState<Metodo>('split');
  const [passo, setPasso] = useState(3);

  const x = linear([0, 10], [M.l, W - M.r]);
  const y = linear([-2.4, 2.4], [H - M.b, M.t]);
  const step = (vals: number[], dy = 0) => vals.map((v, b) => `M${x(b)},${y(v + dy)}H${x(b + 1)}`).join('');

  // ---------- aba quantil ----------
  const qCurva = useMemo(() => ajustarQuantil(treino, alpha), [treino, alpha]);
  const abaixo = teste.filter((d) => d.y <= qCurva[faixa(d.x)]).length / teste.length;
  const pinball = (r: number) => (r >= 0 ? alpha * r : (alpha - 1) * r);
  const xp = linear([-2, 2], [M.l, W - M.r]);
  const yp = linear([0, 2], [H - M.b, M.t]);
  const pinPath = Array.from({length: 81}, (_, i) => -2 + i * 0.05)
    .map((r, i) => `${i ? 'L' : 'M'}${xp(r).toFixed(1)},${yp(pinball(r)).toFixed(1)}`)
    .join('');

  // ---------- aba conformal ----------
  const conf = useMemo(() => {
    const a = 1 - nivel;
    const media = ajustarMedia(treino);
    const qlo = ajustarQuantil(treino, a / 2);
    const qhi = ajustarQuantil(treino, 1 - a / 2);
    const scores =
      metodo === 'split'
        ? calib.map((d) => Math.abs(d.y - media[faixa(d.x)]))
        : calib.map((d) => Math.max(qlo[faixa(d.x)] - d.y, d.y - qhi[faixa(d.x)]));
    const n = scores.length;
    const nivelAjustado = Math.min(1, Math.ceil((n + 1) * (1 - a)) / n);
    const qhat = quantilVetor(scores, nivelAjustado);
    const low = (b: number) => (metodo === 'split' ? media[b] - qhat : qlo[b] - qhat);
    const high = (b: number) => (metodo === 'split' ? media[b] + qhat : qhi[b] + qhat);
    const dentro = teste.map((d) => d.y >= low(faixa(d.x)) && d.y <= high(faixa(d.x)));
    const cob = (f: (x: number) => boolean) => {
      const idx = teste.map((d, i) => i).filter((i) => f(teste[i].x));
      return idx.filter((i) => dentro[i]).length / idx.length;
    };
    const largura = teste.reduce((acc, d) => acc + high(faixa(d.x)) - low(faixa(d.x)), 0) / teste.length;
    return {media, qlo, qhi, scores, qhat, nivelAjustado, low, high, dentro, cobertura: cob(() => true), cobBaixo: cob((v) => v < 5), cobAlto: cob((v) => v >= 5), largura};
  }, [treino, calib, teste, nivel, metodo]);

  const passos = ['1. o modelo prevê', '2. erros na calibração', '3. quantil dos erros', '4. intervalo no teste'];
  const xs = linear([0, Math.max(...conf.scores) * 1.05], [M.l, W - M.r]);
  const nb = 20;
  const hist = new Array<number>(nb).fill(0);
  const maxS = Math.max(...conf.scores) * 1.05;
  conf.scores.forEach((v) => hist[Math.min(nb - 1, Math.floor((v / maxS) * nb))]++);
  const yh = linear([0, Math.max(...hist)], [H - M.b, M.t]);

  return (
    <VizFrame
      titulo="Intervalos: de quantis a predição conformal"
      subtitulo="Eixo x: força do gancho. Eixo y: desempenho relativo ao canal (log). Ganchos fortes têm resultado mais incerto: viralizam ou afundam."
    >
      <div className={s.controls}>
        <Segmented<Aba>
          rotulo="Aba"
          valor={aba}
          onChange={setAba}
          opcoes={[
            {valor: 'quantil', rotulo: 'regressão quantílica'},
            {valor: 'conformal', rotulo: 'predição conformal'},
          ]}
        />
      </div>

      {aba === 'quantil' ? (
        <>
          <div className={s.controls}>
            <Slider rotulo="Quantil α" valor={alpha} min={0.05} max={0.95} passo={0.05} onChange={setAlpha} formato={(v) => fmt(v, 2)} />
          </div>
          <div className={s.grid2}>
            <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label={`Pinball loss para alfa ${alpha}`}>
              <path d={pinPath} style={{fill: 'none', stroke: COR.roxo, strokeWidth: 2.6}} />
              <text x={xp(-1.9)} y={yp(1.85)} fontSize={12} className={s.sketchText}>
                previu alto demais: custo {fmt(1 - alpha, 2)}×
              </text>
              <text x={xp(1.95)} y={yp(0.12)} fontSize={12} textAnchor="end" className={s.sketchText}>
                previu baixo demais: custo {fmt(alpha, 2)}×
              </text>
              <Eixo orient="x" scale={xp} valores={[-2, -1, 0, 1, 2]} pos={H - M.b} comprimento={[M.l, W - M.r]} rotulo="erro = real − previsto" format={(v) => fmt(v, 0)} />
              <Eixo orient="y" scale={yp} valores={[0, 1, 2]} pos={M.l} comprimento={[M.t, H - M.b]} rotulo="pinball loss" format={(v) => fmt(v, 0)} />
            </svg>
            <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label={`Curva do quantil ${alpha}`}>
              {teste.map((d, i) => (
                <circle key={i} cx={x(d.x)} cy={y(d.y)} r={2.3} style={{fill: d.y <= qCurva[faixa(d.x)] ? COR.azul : COR.cinza, opacity: 0.6}} />
              ))}
              <path d={step(qCurva)} style={{fill: 'none', stroke: COR.roxo, strokeWidth: 3}} />
              <Eixo orient="x" scale={x} valores={[0, 2, 4, 6, 8, 10]} pos={H - M.b} comprimento={[M.l, W - M.r]} rotulo="força do gancho" format={(v) => fmt(v, 0)} />
              <Eixo orient="y" scale={y} valores={[-2, -1, 0, 1, 2]} pos={M.l} comprimento={[M.t, H - M.b]} format={(v) => fmt(v, 0)} />
            </svg>
          </div>
          <div className={s.stats}>
            <Stat rotulo="α pedido" valor={`${fmt(100 * alpha, 0)}%`} />
            <Stat rotulo="Pontos de teste abaixo da curva" valor={`${fmt(100 * abaixo, 1)}%`} tom={Math.abs(abaixo - alpha) < 0.04 ? 'good' : 'warn'} />
          </div>
          <Nota>
            A pinball loss pune de forma <strong>assimétrica</strong>. Com α = 0,9, prever baixo demais custa 9 vezes mais do que prever alto
            demais, e por isso o modelo empurra a curva para cima até sobrar ~90% dos pontos abaixo dela. Treinando um modelo com α = 0,1 e outro
            com α = 0,9, você tem um intervalo de 80%. Repare, porém, que a fração no teste raramente bate exatamente com o α pedido: nada{' '}
            <em>garante</em> essa cobertura em dados novos. É isso que a aba conformal resolve.
          </Nota>
        </>
      ) : (
        <>
          <div className={s.controls}>
            <Slider rotulo="Confiança" valor={nivel} min={0.5} max={0.95} passo={0.05} onChange={setNivel} formato={(v) => `${fmt(100 * v, 0)}%`} />
            <Segmented<Metodo>
              rotulo="Método"
              valor={metodo}
              onChange={setMetodo}
              opcoes={[
                {valor: 'split', rotulo: 'split conformal'},
                {valor: 'cqr', rotulo: 'CQR'},
              ]}
            />
          </div>
          <div className={s.controls}>
            {passos.map((p, i) => (
              <button key={p} type="button" className={s.btn} aria-pressed={passo === i} style={passo === i ? {borderColor: 'var(--ifm-color-primary)', fontWeight: 700} : undefined} onClick={() => setPasso(i)}>
                {p}
              </button>
            ))}
          </div>
          <div className={s.grid2}>
            <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label="Modelo, calibração e intervalo conformal">
              {passo === 3 && (
                <path
                  d={Array.from({length: NB}, (_, b) => `M${x(b)},${y(conf.high(b))}H${x(b + 1)}V${y(conf.low(b))}H${x(b)}Z`).join('')}
                  style={{fill: 'var(--viz-verde-bg)', stroke: 'none', opacity: 0.9}}
                />
              )}
              {(passo === 1 || passo === 2 ? calib : teste).map((d, i) => {
                const pred = metodo === 'split' ? conf.media[faixa(d.x)] : d.y < conf.qlo[faixa(d.x)] ? conf.qlo[faixa(d.x)] : d.y > conf.qhi[faixa(d.x)] ? conf.qhi[faixa(d.x)] : d.y;
                return (
                  <g key={i}>
                    {passo === 1 && <line x1={x(d.x)} x2={x(d.x)} y1={y(d.y)} y2={y(pred)} style={{stroke: COR.laranja, strokeWidth: 1, opacity: 0.6}} />}
                    <circle
                      cx={x(d.x)}
                      cy={y(d.y)}
                      r={2.3}
                      style={{fill: passo === 3 ? (conf.dentro[i] ? COR.verde : COR.vermelho) : passo === 0 ? COR.cinza : COR.laranja, opacity: 0.7}}
                    />
                  </g>
                );
              })}
              {metodo === 'split' ? (
                <path d={step(conf.media)} style={{fill: 'none', stroke: COR.roxo, strokeWidth: 3}} />
              ) : (
                <>
                  <path d={step(conf.qlo)} style={{fill: 'none', stroke: COR.roxo, strokeWidth: 2.4}} />
                  <path d={step(conf.qhi)} style={{fill: 'none', stroke: COR.roxo, strokeWidth: 2.4}} />
                </>
              )}
              <Eixo orient="x" scale={x} valores={[0, 2, 4, 6, 8, 10]} pos={H - M.b} comprimento={[M.l, W - M.r]} rotulo="força do gancho" format={(v) => fmt(v, 0)} />
              <Eixo orient="y" scale={y} valores={[-2, -1, 0, 1, 2]} pos={M.l} comprimento={[M.t, H - M.b]} format={(v) => fmt(v, 0)} />
            </svg>
            <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label="Histograma dos escores de não-conformidade na calibração">
              {hist.map((c, i) => (
                <rect
                  key={i}
                  x={xs((i * maxS) / nb) + 1}
                  y={yh(c)}
                  width={Math.max(0, xs(maxS / nb) - xs(0) - 2)}
                  height={H - M.b - yh(c)}
                  style={{fill: (i + 0.5) * (maxS / nb) <= conf.qhat ? COR.laranja : COR.cinza, opacity: passo >= 1 ? 0.8 : 0.25}}
                />
              ))}
              {passo >= 2 && (
                <>
                  <RoughLine x1={xs(conf.qhat)} x2={xs(conf.qhat)} y1={M.t} y2={H - M.b} stroke={COR.vermelho} strokeWidth={2.2} seed={3} />
                  <text x={xs(conf.qhat) + 4} y={M.t + 12} fontSize={12} className={s.sketchText} style={{fill: COR.vermelho}}>
                    q̂ = {fmt(conf.qhat, 2)}
                  </text>
                </>
              )}
              <Eixo
                orient="x"
                scale={xs}
                valores={[0, maxS / 3, (2 * maxS) / 3].map((v) => Number(v.toFixed(1)))}
                pos={H - M.b}
                comprimento={[M.l, W - M.r]}
                rotulo={metodo === 'split' ? 'escore = |real − previsto|' : 'escore = distância para fora da banda'}
                format={(v) => fmt(v, 1)}
              />
            </svg>
          </div>
          <div className={s.stats}>
            <Stat rotulo="Cobertura no teste" valor={`${fmt(100 * conf.cobertura, 1)}%`} dica={`pedido: ${fmt(100 * nivel, 0)}%`} tom={Math.abs(conf.cobertura - nivel) < 0.04 ? 'good' : 'warn'} />
            <Stat rotulo="Gancho fraco (x < 5)" valor={`${fmt(100 * conf.cobBaixo, 0)}%`} tom={Math.abs(conf.cobBaixo - nivel) < 0.06 ? 'good' : 'bad'} />
            <Stat rotulo="Gancho forte (x ≥ 5)" valor={`${fmt(100 * conf.cobAlto, 0)}%`} tom={Math.abs(conf.cobAlto - nivel) < 0.06 ? 'good' : 'bad'} />
            <Stat rotulo="Largura média" valor={fmt(conf.largura, 2)} dica={`nível ajustado ${fmt(conf.nivelAjustado, 3)}`} />
          </div>
          <Nota>
            {metodo === 'split' ? (
              <>
                O <strong>split conformal</strong> pega os erros absolutos num conjunto de calibração e usa o quantil deles como meia-largura. A
                cobertura <em>total</em> fica garantida, mas a largura é igual para todos: o intervalo sobra onde o resultado é previsível e falta
                onde ele é incerto. Compare as duas faixas de gancho e depois troque para CQR.
              </>
            ) : (
              <>
                O <strong>CQR</strong> parte das curvas quantílicas (que já se alargam onde há mais incerteza) e usa a calibração só para corrigi-las.
                O resultado é cobertura garantida <em>e</em> largura adaptativa, com as duas faixas de gancho perto do nível pedido.
              </>
            )}
          </Nota>
        </>
      )}
    </VizFrame>
  );
}
