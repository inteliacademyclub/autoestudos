import React, {useMemo, useState} from 'react';
import {VizFrame, Segmented, Stat, Nota, vizStyles as s} from './lib/ui';
import {COR, linear, fmt, RoughLine} from './lib/svg';
import {gerarBase, DIAS_TOTAL, formatarData, type Post} from './lib/simulador';
import {makeRng} from './lib/rng';
import {mae, spearman} from './lib/metricas';

type Estrategia = 'aleatorio' | 'temporal' | 'canal' | 'canalFuturo';
type Papel = 'treino' | 'teste' | 'fora';

const CORTE = 700; // dia de corte do split temporal (~dez/2025)
const K = 4;

function atribuir(posts: Post[], estr: Estrategia, canaisTeste: Set<string>): Map<string, Papel> {
  const r = makeRng(11);
  const m = new Map<string, Papel>();
  for (const p of posts) {
    let papel: Papel;
    if (estr === 'aleatorio') papel = r.u() < 0.2 ? 'teste' : 'treino';
    else if (estr === 'temporal') papel = p.dia >= CORTE ? 'teste' : 'treino';
    else if (estr === 'canal') papel = canaisTeste.has(p.canal) ? 'teste' : 'treino';
    else papel = canaisTeste.has(p.canal) ? (p.dia >= CORTE ? 'teste' : 'fora') : p.dia < CORTE ? 'treino' : 'fora';
    m.set(p.id, papel);
  }
  return m;
}

/**
 * "Modelo" propositalmente simples: média do log de curtidas dos K posts de
 * treino do mesmo canal mais próximos no tempo; se o canal não tem treino,
 * regressão linear em log(inscritos).
 */
function avaliar(posts: Post[], papeis: Map<string, Papel>, inscritos: Map<string, number>) {
  const treino = posts.filter((p) => papeis.get(p.id) === 'treino');
  const teste = posts.filter((p) => papeis.get(p.id) === 'teste');
  const porCanal = new Map<string, Post[]>();
  treino.forEach((p) => porCanal.set(p.canal, [...(porCanal.get(p.canal) ?? []), p]));
  // regressão log1p(curtidas) ~ log(inscritos)
  const xs = treino.map((p) => Math.log(inscritos.get(p.canal)!));
  const ys = treino.map((p) => Math.log1p(p.curtidas));
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let num = 0;
  let den = 0;
  xs.forEach((x, i) => {
    num += (x - mx) * (ys[i] - my);
    den += (x - mx) ** 2;
  });
  const b = den ? num / den : 0;
  const a = my - b * mx;

  let usaramFuturo = 0;
  const y: number[] = [];
  const yhat: number[] = [];
  for (const p of teste) {
    const hist = porCanal.get(p.canal);
    let pred: number;
    if (hist && hist.length) {
      const viz = [...hist].sort((u, v) => Math.abs(u.dia - p.dia) - Math.abs(v.dia - p.dia)).slice(0, K);
      pred = viz.reduce((acc, v) => acc + Math.log1p(v.curtidas), 0) / viz.length;
      if (viz.some((v) => v.dia > p.dia)) usaramFuturo++;
    } else {
      pred = a + b * Math.log(inscritos.get(p.canal)!);
    }
    y.push(Math.log1p(p.curtidas));
    yhat.push(pred);
  }
  return {
    mae: mae(y, yhat),
    rho: spearman(y, yhat),
    nTeste: teste.length,
    nTreino: treino.length,
    futuro: teste.length ? usaramFuturo / teste.length : 0,
  };
}

const W = 660;
const ROW = 22;
const M = {t: 12, r: 14, b: 34, l: 118};

/** Linha do tempo de posts por canal com diferentes estratégias de split. */
export default function SplitExplorer(): React.ReactElement {
  const [estr, setEstr] = useState<Estrategia>('aleatorio');
  const base = useMemo(() => gerarBase(), []);
  const inscritos = useMemo(() => new Map(base.canais.map((c) => [c.id, c.inscritos])), [base]);
  const canaisTeste = useMemo(() => new Set(base.canais.filter((_, i) => i % 5 === 2).map((c) => c.id)), [base]);

  const resultados = useMemo(() => {
    const out = {} as Record<Estrategia, ReturnType<typeof avaliar>>;
    (['aleatorio', 'temporal', 'canal', 'canalFuturo'] as Estrategia[]).forEach((e) => {
      out[e] = avaliar(base.posts, atribuir(base.posts, e, canaisTeste), inscritos);
    });
    return out;
  }, [base, canaisTeste, inscritos]);

  const papeis = useMemo(() => atribuir(base.posts, estr, canaisTeste), [base, estr, canaisTeste]);

  // canais exibidos: 3 por setor, incluindo canais de teste
  const exibidos = useMemo(() => {
    const out: typeof base.canais = [];
    for (const setor of ['beleza', 'moda', 'automotivo'] as const) {
      const cs = base.canais.filter((c) => c.setor === setor);
      const t = cs.filter((c) => canaisTeste.has(c.id)).slice(0, 1);
      out.push(...t, ...cs.filter((c) => !canaisTeste.has(c.id)).slice(0, 3 - t.length));
    }
    return out;
  }, [base, canaisTeste]);

  const H = M.t + exibidos.length * ROW + M.b;
  const x = linear([0, DIAS_TOTAL], [M.l, W - M.r]);
  const r = resultados[estr];
  const honesto = resultados.temporal;
  const otimismo = (100 * (honesto.mae - r.mae)) / honesto.mae;

  const corPapel: Record<Papel, string> = {treino: COR.azul, teste: COR.laranja, fora: COR.suave};

  return (
    <VizFrame
      titulo="Como você divide os dados muda a nota do modelo"
      subtitulo="Cada ponto é um Short. O modelo prevê as curtidas de um post de teste pela média dos posts de treino do mesmo canal mais próximos no tempo."
    >
      <div className={s.controls}>
        <Segmented<Estrategia>
          rotulo="Estratégia de split"
          valor={estr}
          onChange={setEstr}
          opcoes={[
            {valor: 'aleatorio', rotulo: 'aleatório'},
            {valor: 'temporal', rotulo: 'temporal'},
            {valor: 'canal', rotulo: 'por canal'},
            {valor: 'canalFuturo', rotulo: 'canal novo no futuro'},
          ]}
        />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label="Linha do tempo de posts por canal, coloridos por treino e teste">
        {exibidos.map((c, i) => {
          const yRow = M.t + i * ROW + ROW / 2;
          return (
            <g key={c.id}>
              <text x={M.l - 8} y={yRow} dy="0.32em" textAnchor="end" fontSize={11}>
                {c.nome}
              </text>
              <line x1={M.l} x2={W - M.r} y1={yRow} y2={yRow} style={{stroke: COR.suave}} />
              {base.posts
                .filter((p) => p.canal === c.id)
                .map((p) => {
                  const papel = papeis.get(p.id)!;
                  return (
                    <circle
                      key={p.id}
                      cx={x(p.dia)}
                      cy={yRow}
                      r={papel === 'teste' ? 4.2 : 3.4}
                      style={{fill: corPapel[papel], stroke: 'var(--viz-fundo)', strokeWidth: 0.8, transition: 'fill 0.35s, r 0.35s'}}
                    />
                  );
                })}
            </g>
          );
        })}
        {(estr === 'temporal' || estr === 'canalFuturo') && (
          <g>
            <RoughLine x1={x(CORTE)} y1={M.t - 4} x2={x(CORTE)} y2={H - M.b + 4} stroke={COR.vermelho} strokeWidth={2} seed={9} />
            <text x={x(CORTE) + 4} y={H - M.b + 16} fontSize={11} style={{fill: COR.vermelho}}>
              data de corte
            </text>
          </g>
        )}
        {[0, 182, 365, 547, 730, 900].map((d) => (
          <text key={d} x={x(d)} y={H - 6} fontSize={10} textAnchor="middle" style={{fill: 'var(--ifm-color-emphasis-700)'}}>
            {formatarData(d)}
          </text>
        ))}
      </svg>
      <div className={s.legend}>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.azul}} /> treino
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.laranja}} /> teste
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.suave}} /> não usado
        </span>
      </div>

      <div className={s.stats}>
        <Stat rotulo="MAE (log)" valor={fmt(r.mae, 3)} dica={`${r.nTeste} posts de teste`} />
        <Stat rotulo="Spearman" valor={fmt(r.rho, 3)} />
        <Stat
          rotulo="Previsões que usaram o futuro"
          valor={`${fmt(100 * r.futuro, 0)}%`}
          dica="vizinhos de treino depois do post"
          tom={r.futuro > 0.05 ? 'bad' : 'good'}
        />
        <Stat
          rotulo="vs. split temporal"
          valor={estr === 'temporal' ? 'referência' : `${otimismo > 0 ? '−' : '+'}${fmt(Math.abs(otimismo), 0)}% MAE`}
          dica={estr === 'temporal' ? 'como o modelo será usado' : otimismo > 0 ? 'otimista demais' : 'mais difícil'}
          tom={estr === 'temporal' ? undefined : otimismo > 5 ? 'bad' : 'warn'}
        />
      </div>

      {estr === 'aleatorio' && (
        <Nota tom="bad">
          No split aleatório, quase toda previsão de teste "enxerga" posts do mesmo canal publicados <strong>depois</strong> dela. Como os canais
          mudam devagar ao longo do tempo, o modelo só interpola e o erro fica artificialmente baixo. Em produção você nunca terá o futuro.
        </Nota>
      )}
      {estr === 'temporal' && (
        <Nota tom="good">
          Treino antes da data de corte, teste depois: é exatamente a situação real (prever posts que ainda não existem). Esta é a métrica que vai
          para o README.
        </Nota>
      )}
      {estr === 'canal' && (
        <Nota>
          Canais inteiros ficam de fora do treino. Isso mede se o modelo generaliza para um <strong>cliente novo</strong>, sem histórico. O erro
          sobe porque o modelo só tem os inscritos para se apoiar.
        </Nota>
      )}
      {estr === 'canalFuturo' && (
        <Nota>
          O cenário mais exigente: canal nunca visto <em>e</em> período futuro. É o teste de estresse para a pergunta "e se a Galaxies plugar um
          cliente novo amanhã?".
        </Nota>
      )}
    </VizFrame>
  );
}
