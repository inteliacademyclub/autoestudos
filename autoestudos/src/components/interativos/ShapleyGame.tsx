import React, {useState} from 'react';
import clsx from 'clsx';
import {VizFrame, Stat, Nota, vizStyles as s} from './lib/ui';
import {COR, RoughRect, fmt, linear} from './lib/svg';
import st from './interativos.module.css';

type Jog = 'g' | 't' | 'h';
const JOG: {id: Jog; nome: string; cor: string}[] = [
  {id: 'g', nome: 'gancho forte', cor: COR.roxo},
  {id: 't', nome: 'texto na tela', cor: COR.laranja},
  {id: 'h', nome: 'horário nobre', cor: COR.azul},
];
// frequência de cada atributo nos Shorts do canal (o "fundo" de comparação)
const P: Record<Jog, number> = {g: 0.4, t: 0.5, h: 0.4};

// modelo de brinquedo em escala log, com uma interação: texto na tela ajuda
// mais quando o gancho é forte
const f = (z: Record<Jog, number>) => 0.4 * z.g + 0.12 * z.t + 0.12 * z.h + 0.24 * z.g * z.t;

/** v(S): previsão com os jogadores de S "ligados" (valor do Short B) e os demais na média do canal. */
function v(S: Jog[]): number {
  const z = {g: P.g, t: P.t, h: P.h};
  S.forEach((j) => (z[j] = 1));
  return f(z);
}

const ORDENS: Jog[][] = [
  ['g', 't', 'h'],
  ['g', 'h', 't'],
  ['t', 'g', 'h'],
  ['t', 'h', 'g'],
  ['h', 'g', 't'],
  ['h', 't', 'g'],
];

function marginais(ordem: Jog[]): Record<Jog, number> {
  const out = {} as Record<Jog, number>;
  const S: Jog[] = [];
  for (const j of ordem) {
    const antes = v(S);
    S.push(j);
    out[j] = v(S) - antes;
  }
  return out;
}

const shapley: Record<Jog, number> = {g: 0, t: 0, h: 0};
ORDENS.forEach((o) => {
  const m = marginais(o);
  (Object.keys(m) as Jog[]).forEach((j) => (shapley[j] += m[j] / ORDENS.length));
});

const COALIZOES: Jog[][] = [[], ['g'], ['t'], ['h'], ['g', 't'], ['g', 'h'], ['t', 'h'], ['g', 't', 'h']];
const nome = (j: Jog) => JOG.find((x) => x.id === j)!.nome;

const W = 640;
const H = 170;

/** O jogo de Shapley com 3 features: ordens, contribuições marginais e média. */
export default function ShapleyGame(): React.ReactElement {
  const [ordem, setOrdem] = useState(0);
  const [vistas, setVistas] = useState<Set<number>>(new Set([0]));
  const m = marginais(ORDENS[ordem]);
  const total = v(['g', 't', 'h']) - v([]);
  const x = linear([0, 0.8], [150, W - 20]);

  const escolher = (i: number) => {
    setOrdem(i);
    setVistas((prev) => new Set(prev).add(i));
  };

  return (
    <VizFrame
      titulo="Shapley: quem merece o crédito pelo Short B?"
      subtitulo="Três atributos do Short B. Em quanto cada um aumenta a previsão (em log) em relação a um Short típico do canal?"
    >
      <table className={st.coalizoes}>
        <thead>
          <tr>
            <th>coalizão S</th>
            {COALIZOES.map((c, i) => (
              <th key={i}>{c.length ? `{${c.join(',')}}` : '∅'}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>v(S)</td>
            {COALIZOES.map((c, i) => (
              <td key={i}>{fmt(v(c), 3)}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className={s.subtitle}>
        g = gancho forte, t = texto na tela, h = horário nobre. Quem está fora de S fica "na média do canal".
      </p>

      <div className={s.controls}>
        <span>Ordem de chegada:</span>
        <div className={st.toggleRow}>
          {ORDENS.map((o, i) => (
            <button key={i} type="button" className={st.chip} aria-pressed={ordem === i} onClick={() => escolher(i)}>
              {o.join(' → ')}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label="Contribuições marginais na ordem escolhida e valores de Shapley">
        <text x={0} y={22} fontSize={13} className={s.sketchText}>
          nesta ordem
        </text>
        {(() => {
          let acc = 0;
          return ORDENS[ordem].map((j, k) => {
            const w = x(acc + m[j]) - x(acc);
            const el = (
              <g key={`${ordem}-${j}`} className={s.fadeIn}>
                <RoughRect x={x(acc)} y={8} w={Math.max(w, 1)} h={26} fill={JOG.find((q) => q.id === j)!.cor} stroke={JOG.find((q) => q.id === j)!.cor} seed={k + 2} />
                <text x={x(acc) + w / 2} y={50} fontSize={11} textAnchor="middle">
                  {j}: +{fmt(m[j], 3)}
                </text>
              </g>
            );
            acc += m[j];
            return el;
          });
        })()}
        <text x={0} y={100} fontSize={13} className={s.sketchText}>
          Shapley (média
        </text>
        <text x={0} y={116} fontSize={13} className={s.sketchText}>
          das 6 ordens)
        </text>
        {(() => {
          let acc = 0;
          return JOG.map((j, k) => {
            const w = x(acc + shapley[j.id]) - x(acc);
            const el = (
              <g key={j.id}>
                <RoughRect x={x(acc)} y={86} w={w} h={26} fill={j.cor} stroke={j.cor} seed={k + 10} />
                <text x={x(acc) + w / 2} y={128} fontSize={11} textAnchor="middle">
                  {j.id}: +{fmt(shapley[j.id], 3)}
                </text>
              </g>
            );
            acc += shapley[j.id];
            return el;
          });
        })()}
        <text x={x(total) + 6} y={104} fontSize={12} style={{fill: COR.verde}}>
          = {fmt(total, 3)}
        </text>
        <text x={150} y={158} fontSize={11} style={{fill: 'var(--ifm-color-emphasis-700)'}}>
          a soma sempre dá v(tudo) − v(∅) = {fmt(total, 3)} (eficiência)
        </text>
      </svg>

      <div className={s.stats}>
        {JOG.map((j) => (
          <Stat key={j.id} rotulo={nome(j.id)} valor={`+${fmt(m[j.id], 3)}`} dica={`Shapley: +${fmt(shapley[j.id], 3)} (×${fmt(Math.exp(shapley[j.id]), 2)})`} />
        ))}
        <Stat rotulo="Ordens exploradas" valor={`${vistas.size}/6`} tom={vistas.size === 6 ? 'good' : undefined} />
      </div>
      <Nota tom={vistas.size === 6 ? 'good' : undefined}>
        Troque a ordem e veja o crédito do <strong>texto na tela</strong> mudar: chegando depois do gancho forte, ele vale mais, porque os dois
        interagem no modelo. O valor de Shapley resolve a briga fazendo a <strong>média justa sobre todas as ordens</strong>. É isso que o SHAP
        calcula, de forma eficiente, para cada previsão do seu GBM.
      </Nota>
      <p className={clsx(s.subtitle)} style={{marginTop: '0.5rem'}}>
        Modelo de brinquedo: previsão (log) = 0,40·g + 0,12·t + 0,12·h + 0,24·g·t, com o fundo na média do canal (g = 0,4; t = 0,5; h = 0,4).
      </p>
    </VizFrame>
  );
}
