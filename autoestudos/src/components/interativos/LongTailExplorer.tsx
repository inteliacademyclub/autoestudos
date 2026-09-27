import React, {useMemo, useState} from 'react';
import {VizFrame, Segmented, Stat, Nota, vizStyles as s} from './lib/ui';
import {RoughRect, RoughLine, COR, linear, ticks, fmt, fmtInt, Eixo} from './lib/svg';
import {gerarBase, mediana, media, type Setor} from './lib/simulador';

type Visao = 'bruto' | 'log' | 'relativo';
type FiltroSetor = 'todos' | Setor;

const W = 640;
const H = 250;
const M = {t: 16, r: 16, b: 46, l: 56};

function quantil(xs: number[], q: number): number {
  const v = [...xs].sort((a, b) => a - b);
  const i = (v.length - 1) * q;
  const lo = Math.floor(i);
  return v[lo] + (v[Math.ceil(i)] - v[lo]) * (i - lo);
}

/** Distribuição de curtidas: bruta, em log1p e relativa ao histórico do canal. */
export default function LongTailExplorer(): React.ReactElement {
  const [visao, setVisao] = useState<Visao>('bruto');
  const [setor, setSetor] = useState<FiltroSetor>('todos');
  const base = useMemo(() => gerarBase(), []);

  // alvo relativo: log((curtidas+1)/(mediana das curtidas ANTERIORES do canal + 1))
  const relativos = useMemo(() => {
    const hist = new Map<string, number[]>();
    const out = new Map<string, number>();
    for (const p of base.posts) {
      const h = hist.get(p.canal) ?? [];
      if (h.length >= 5) out.set(p.id, Math.log((p.curtidas + 1) / (mediana(h) + 1)));
      h.push(p.curtidas);
      hist.set(p.canal, h);
    }
    return out;
  }, [base]);

  const posts = base.posts.filter((p) => setor === 'todos' || p.setor === setor);
  const valores =
    visao === 'bruto'
      ? posts.map((p) => p.curtidas)
      : visao === 'log'
        ? posts.map((p) => Math.log1p(p.curtidas))
        : posts.filter((p) => relativos.has(p.id)).map((p) => relativos.get(p.id)!);

  const lo = visao === 'bruto' ? 0 : quantil(valores, 0.005);
  const hi = visao === 'bruto' ? quantil(valores, 0.97) : quantil(valores, 0.995);
  const nb = 32;
  const bins = new Array<number>(nb).fill(0);
  let foraDireita = 0;
  for (const v of valores) {
    if (v > hi) {
      foraDireita++;
      bins[nb - 1]++;
      continue;
    }
    const b = Math.min(nb - 1, Math.max(0, Math.floor(((v - lo) / (hi - lo)) * nb)));
    bins[b]++;
  }
  const x = linear([lo, hi], [M.l, W - M.r]);
  const y = linear([0, Math.max(...bins)], [H - M.b, M.t]);
  const bw = (W - M.l - M.r) / nb;

  const med = media(valores);
  const mdn = mediana(valores);
  const ordenados = [...valores].sort((a, b) => b - a);
  const top = Math.max(1, Math.round(ordenados.length * 0.05));
  const somaTop = ordenados.slice(0, top).reduce((a, b) => a + b, 0);
  const somaTotal = ordenados.reduce((a, b) => a + b, 0);
  const abaixoMedia = valores.filter((v) => v < med).length / valores.length;

  const rotuloX =
    visao === 'bruto' ? 'curtidas' : visao === 'log' ? 'log(1 + curtidas)' : 'log(curtidas / mediana anterior do canal)';

  return (
    <VizFrame
      titulo="Engajamento é cauda longa"
      subtitulo="Troque a escala e veja a média deixar de mentir. Dados de ~1.000 Shorts simulados de 24 canais."
    >
      <div className={s.controls}>
        <Segmented<Visao>
          rotulo="Escala"
          valor={visao}
          onChange={setVisao}
          opcoes={[
            {valor: 'bruto', rotulo: 'curtidas (bruto)'},
            {valor: 'log', rotulo: 'log1p'},
            {valor: 'relativo', rotulo: 'relativo ao canal'},
          ]}
        />
        <Segmented<FiltroSetor>
          rotulo="Setor"
          valor={setor}
          onChange={setSetor}
          opcoes={[
            {valor: 'todos', rotulo: 'todos'},
            {valor: 'moda', rotulo: 'moda'},
            {valor: 'beleza', rotulo: 'beleza'},
            {valor: 'automotivo', rotulo: 'automotivo'},
          ]}
        />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label={`Histograma de ${rotuloX}`}>
        {bins.map((c, i) =>
          c > 0 ? (
            <RoughRect
              key={`${visao}-${setor}-${i}`}
              x={M.l + i * bw + 1}
              y={y(c)}
              w={bw - 2}
              h={H - M.b - y(c)}
              fill={i === nb - 1 && foraDireita > 0 ? COR.laranja : COR.azul}
              stroke={i === nb - 1 && foraDireita > 0 ? COR.laranja : COR.azul}
              seed={i + 1}
              roughness={0.8}
              strokeWidth={1.2}
            />
          ) : null,
        )}
        {[
          {v: med, cor: COR.vermelho, t: 'média'},
          {v: mdn, cor: COR.verde, t: 'mediana'},
        ].map((m, k) =>
          m.v >= lo && m.v <= hi ? (
            <g key={m.t}>
              <RoughLine x1={x(m.v)} y1={M.t} x2={x(m.v)} y2={H - M.b} stroke={m.cor} strokeWidth={2.2} seed={40 + k} />
              <text x={x(m.v) + 4} y={M.t + 12 + k * 15} fontSize={13} style={{fill: m.cor}} className={s.sketchText}>
                {m.t}
              </text>
            </g>
          ) : null,
        )}
        <Eixo
          orient="x"
          scale={x}
          valores={ticks(lo, hi, 6)}
          pos={H - M.b}
          comprimento={[M.l, W - M.r]}
          rotulo={rotuloX}
          format={(v) => (visao === 'bruto' ? fmtInt(v) : fmt(v, 1))}
        />
        <Eixo orient="y" scale={y} valores={ticks(0, Math.max(...bins), 4)} pos={M.l} comprimento={[M.t, H - M.b]} rotulo="nº de posts" format={(v) => fmt(v, 0)} />
      </svg>

      <div className={s.stats}>
        <Stat rotulo="Média" valor={visao === 'bruto' ? fmtInt(med) : fmt(med, 2)} />
        <Stat rotulo="Mediana" valor={visao === 'bruto' ? fmtInt(mdn) : fmt(mdn, 2)} />
        <Stat rotulo="Abaixo da média" valor={`${fmt(100 * abaixoMedia, 0)}%`} tom={abaixoMedia > 0.62 ? 'bad' : undefined} />
        {visao === 'bruto' ? (
          <Stat rotulo="Top 5% dos posts" valor={`${fmt((100 * somaTop) / somaTotal, 0)}%`} dica="das curtidas totais" tom="warn" />
        ) : (
          <Stat rotulo="Posts no gráfico" valor={fmt(valores.length, 0)} dica={visao === 'relativo' ? 'só com ≥ 5 posts anteriores' : undefined} />
        )}
      </div>

      {visao === 'bruto' && (
        <Nota tom="bad">
          Em escala bruta, a maioria dos posts fica abaixo da média, porque meia dúzia de virais puxa a média para cima (a barra laranja junta
          tudo acima do percentil 97). Um modelo treinado com erro quadrático aqui gasta quase todo o esforço tentando acertar os virais.
        </Nota>
      )}
      {visao === 'log' && (
        <Nota>
          Com <code>log1p</code>, a distribuição fica quase simétrica e média e mediana se aproximam. Um erro de 0,69 nessa escala significa errar
          por um fator de 2×, seja o post pequeno ou grande.
        </Nota>
      )}
      {visao === 'relativo' && (
        <Nota tom="good">
          Relativo ao canal, o zero significa "igual à mediana dos posts anteriores do canal". O tamanho do canal sai da conta e sobra o que o
          conteúdo, o horário e o momento fizeram. É essa variação que distingue o Short A do B.
        </Nota>
      )}
    </VizFrame>
  );
}
