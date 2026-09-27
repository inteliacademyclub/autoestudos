import React, {useEffect, useMemo, useRef, useState} from 'react';
import {VizFrame, Slider, Stat, Nota, Segmented, vizStyles as s} from './lib/ui';
import {COR, linear, ticks, fmt, Eixo, RoughLine, usePrefersReducedMotion} from './lib/svg';
import {makeRng} from './lib/rng';
import {ajustar, prever, type No} from './lib/arvore1d';
import Icon from '../aula/Icon';

const MAX_ARVORES = 300;

// desempenho relativo em função da duração: pico em ~20 s e queda para vídeos longos
const verdade = (x: number) => 0.55 * Math.exp(-(((x - 20) / 11) ** 2)) - 0.012 * Math.max(0, x - 35) + 0.1;

function gerar(seed: number, n: number) {
  const r = makeRng(seed);
  return Array.from({length: n}, () => {
    const x = 8 + r.u() * 82;
    return {x, y: verdade(x) + r.normal(0, 0.22)};
  });
}

const W = 330;
const H = 240;
const M = {t: 12, r: 10, b: 42, l: 44};

/** Gradient boosting passo a passo: cada árvore ajusta os resíduos das anteriores. */
export default function BoostingPlayground(): React.ReactElement {
  const treino = useMemo(() => gerar(5, 90), []);
  const valid = useMemo(() => gerar(99, 90), []);
  const [lr, setLr] = useState(0.1);
  const [prof, setProf] = useState<'1' | '2' | '3'>('2');
  const [n, setN] = useState(1);
  const [tocando, setTocando] = useState(false);
  const reduzido = usePrefersReducedMotion();
  const timer = useRef<number | null>(null);

  const modelo = useMemo(() => {
    const xs = treino.map((d) => d.x);
    const f0 = treino.reduce((a, d) => a + d.y, 0) / treino.length;
    const predT = treino.map(() => f0);
    const predV = valid.map(() => f0);
    const arvores: No[] = [];
    const mseT = [mse(treino.map((d) => d.y), predT)];
    const mseV = [mse(valid.map((d) => d.y), predV)];
    for (let k = 0; k < MAX_ARVORES; k++) {
      const res = treino.map((d, i) => d.y - predT[i]);
      const arv = ajustar(xs, res, Number(prof), 3);
      arvores.push(arv);
      treino.forEach((d, i) => (predT[i] += lr * prever(arv, d.x)));
      valid.forEach((d, i) => (predV[i] += lr * prever(arv, d.x)));
      mseT.push(mse(treino.map((d) => d.y), predT));
      mseV.push(mse(valid.map((d) => d.y), predV));
    }
    const melhor = mseV.indexOf(Math.min(...mseV));
    return {f0, arvores, mseT, mseV, melhor};
  }, [treino, valid, lr, prof]);

  useEffect(() => {
    if (!tocando) return;
    timer.current = window.setInterval(
      () => setN((v) => {
        if (v >= MAX_ARVORES) {
          setTocando(false);
          return v;
        }
        return v + (v < 20 ? 1 : v < 80 ? 2 : 5);
      }),
      reduzido ? 400 : 90,
    );
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [tocando, reduzido]);

  const f = (x: number, k: number) => {
    let v = modelo.f0;
    for (let i = 0; i < k; i++) v += lr * prever(modelo.arvores[i], x);
    return v;
  };

  const grade = Array.from({length: 165}, (_, i) => 8 + (i * 82) / 164);
  const curva = grade.map((x) => [x, f(x, n)] as const);
  // a última árvore ajusta os resíduos: desenhada em torno do zero
  const ultima = n > 0 ? grade.map((x) => [x, prever(modelo.arvores[n - 1], x)] as const) : [];

  const x = linear([8, 90], [M.l, W - M.r]);
  const y = linear([-0.8, 1.2], [H - M.b, M.t]);
  const path = (pts: readonly (readonly [number, number])[]) => pts.map(([a, b], i) => `${i ? 'L' : 'M'}${x(a).toFixed(1)},${y(b).toFixed(1)}`).join('');

  const xi = linear([0, MAX_ARVORES], [M.l, W - M.r]);
  const maxMse = Math.max(modelo.mseT[0], modelo.mseV[0]);
  const yi = linear([0, maxMse * 1.05], [H - M.b, M.t]);
  const linhaMse = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'}${xi(i).toFixed(1)},${yi(v).toFixed(1)}`).join('');

  return (
    <VizFrame
      titulo="Gradient boosting, uma árvore por vez"
      subtitulo="O modelo começa na média e cada nova árvore (rasa) tenta corrigir o que ainda está errado, multiplicada pela learning rate."
    >
      <div className={s.controls}>
        <Slider rotulo="Learning rate" valor={lr} min={0.02} max={1} passo={0.02} onChange={(v) => setLr(v)} formato={(v) => fmt(v, 2)} />
        <span className={s.control}>
          profundidade
          <Segmented
            rotulo="Profundidade das árvores"
            valor={prof}
            onChange={setProf}
            opcoes={[
              {valor: '1', rotulo: '1'},
              {valor: '2', rotulo: '2'},
              {valor: '3', rotulo: '3'},
            ]}
          />
        </span>
      </div>
      <div className={s.controls}>
        <Slider rotulo="Árvores" valor={n} min={0} max={MAX_ARVORES} onChange={(v) => setN(v)} />
        <button type="button" className={s.btn} onClick={() => setN((v) => Math.min(MAX_ARVORES, v + 1))}>
          +1 árvore
        </button>
        <button
          type="button"
          className={s.btn}
          onClick={() => {
            if (n >= MAX_ARVORES) setN(0);
            setTocando((t) => !t);
          }}
        >
          <Icon nome={tocando ? 'pause' : 'play'} /> {tocando ? 'pausar' : 'animar'}
        </button>
        <button type="button" className={s.btn} onClick={() => setN(modelo.melhor)}>
          ir ao early stopping
        </button>
      </div>

      <div className={s.grid2}>
        <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label={`Ajuste do modelo com ${n} árvores`}>
          {treino.map((d, i) => (
            <circle key={i} cx={x(d.x)} cy={y(d.y)} r={2.6} style={{fill: COR.azul, opacity: 0.55}} />
          ))}
          <path d={grade.map((g, i) => `${i ? 'L' : 'M'}${x(g).toFixed(1)},${y(verdade(g)).toFixed(1)}`).join('')} style={{fill: 'none', stroke: COR.verde, strokeWidth: 2, strokeDasharray: '5 5'}} />
          {n > 0 && ultima.length > 0 && <path d={path(ultima)} style={{fill: 'none', stroke: COR.amarelo, strokeWidth: 1.6, opacity: 0.9}} />}
          <path d={path(curva)} style={{fill: 'none', stroke: COR.roxo, strokeWidth: 2.6}} />
          <Eixo orient="x" scale={x} valores={[10, 30, 50, 70, 90]} pos={H - M.b} comprimento={[M.l, W - M.r]} rotulo="duração (s)" />
          <Eixo orient="y" scale={y} valores={[-0.5, 0, 0.5, 1]} pos={M.l} comprimento={[M.t, H - M.b]} format={(v) => fmt(v, 1)} />
        </svg>
        <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label="Erro de treino e validação por número de árvores">
          <path d={linhaMse(modelo.mseT)} style={{fill: 'none', stroke: COR.azul, strokeWidth: 2}} />
          <path d={linhaMse(modelo.mseV)} style={{fill: 'none', stroke: COR.laranja, strokeWidth: 2}} />
          <RoughLine x1={xi(modelo.melhor)} x2={xi(modelo.melhor)} y1={M.t} y2={H - M.b} stroke={COR.verde} strokeWidth={1.8} seed={8} dashed />
          <text x={xi(modelo.melhor) + 4} y={M.t + 10} fontSize={11} className={s.sketchText} style={{fill: COR.verde}}>
            early stopping ({modelo.melhor})
          </text>
          <circle cx={xi(n)} cy={yi(modelo.mseV[n])} r={4.5} style={{fill: COR.roxo}} />
          <Eixo orient="x" scale={xi} valores={ticks(0, MAX_ARVORES, 5)} pos={H - M.b} comprimento={[M.l, W - M.r]} rotulo="nº de árvores" format={(v) => fmt(v, 0)} />
          <Eixo orient="y" scale={yi} valores={ticks(0, maxMse, 4)} pos={M.l} comprimento={[M.t, H - M.b]} format={(v) => fmt(v, 2)} />
        </svg>
      </div>
      <div className={s.legend}>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.roxo}} /> modelo (soma das árvores)
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.verde}} /> relação verdadeira
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.amarelo}} /> última árvore (ajusta os resíduos)
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.laranja}} /> MSE validação
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.azul}} /> MSE treino
        </span>
      </div>
      <div className={s.stats}>
        <Stat rotulo="MSE treino" valor={fmt(modelo.mseT[n], 3)} />
        <Stat rotulo="MSE validação" valor={fmt(modelo.mseV[n], 3)} tom={n > modelo.melhor * 1.6 + 10 ? 'bad' : undefined} />
        <Stat rotulo="Melhor nº de árvores" valor={modelo.melhor} dica={`MSE val ${fmt(modelo.mseV[modelo.melhor], 3)}`} tom="good" />
      </div>
      <Nota>
        Com learning rate alta, o modelo aprende rápido e começa a decorar o ruído logo: a curva laranja volta a subir. Com learning rate baixa,
        são precisas mais árvores, mas o mínimo da validação costuma ser melhor. O <strong>early stopping</strong> escolhe o número de árvores
        olhando a validação, que neste projeto deve ser <strong>temporal</strong>.
      </Nota>
    </VizFrame>
  );
}

function mse(y: number[], p: number[]): number {
  return y.reduce((a, v, i) => a + (v - p[i]) ** 2, 0) / y.length;
}
