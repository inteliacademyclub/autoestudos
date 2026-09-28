import React, {useState} from 'react';
import clsx from 'clsx';
import {VizFrame, Nota, vizStyles as s} from './lib/ui';
import {usePersistent} from '../aula/usePersistent';
import st from './interativos.module.css';
import Icon from '../aula/Icon';

type Veredito = 'ok' | 'vaza';

const FEATURES: {nome: string; certo: Veredito; porque: string}[] = [
  {nome: 'Mediana de curtidas dos posts anteriores do canal', certo: 'ok', porque: 'Existe no momento da previsão, desde que calculada só com posts publicados antes (shift + expanding).'},
  {nome: 'Views do próprio Short após 30 dias', certo: 'vaza', porque: 'Só existe depois da publicação. Views e curtidas são quase a mesma medida: o modelo vira "curtidas ≈ views / 35".'},
  {nome: 'Hora planejada de publicação', certo: 'ok', porque: 'É uma decisão tomada antes de postar.'},
  {nome: 'Média de curtidas do canal calculada com TODOS os posts da base', certo: 'vaza', porque: 'Inclui posts futuros e o próprio post-alvo. É o vazamento mais comum e mais silencioso.'},
  {nome: 'Força do gancho avaliada por um VLM assistindo ao vídeo', certo: 'ok', porque: 'Depende só do conteúdo do criativo, que você tem antes de publicar.'},
  {nome: 'Número de comentários nas primeiras 2 horas', certo: 'vaza', porque: 'É métrica pós-publicação ("early popularity"). Seria outro problema, fora do escopo do briefing.'},
  {nome: 'Inscritos do canal no dia da coleta (1 ano depois do post)', certo: 'vaza', porque: 'Inclui inscritos ganhos por causa do próprio post e dos posteriores. No mínimo, é um vazamento parcial: documente, ou use os inscritos estimados na data do post.'},
  {nome: 'Embedding da thumbnail com PCA ajustado na base inteira', certo: 'vaza', porque: 'O embedding em si é legítimo, mas o PCA "viu" o conjunto de teste. Ajuste o PCA só no treino (dentro de um Pipeline).'},
  {nome: 'Comprimento da legenda planejada', certo: 'ok', porque: 'Você conhece a legenda antes de publicar.'},
  {nome: 'Posição do vídeo no "Em alta" do YouTube', certo: 'vaza', porque: 'É consequência do desempenho, não causa conhecida antes.'},
];

/** Jogo: classificar features como disponíveis antes da publicação ou vazamento. */
export default function LeakageDetective(): React.ReactElement {
  const [resp, setResp, reset] = usePersistent<Record<number, Veredito>>('leakage-detective', {});
  const [mostrar, setMostrar] = useState(false);
  const respondidas = Object.keys(resp).length;
  const acertos = FEATURES.filter((f, i) => resp[i] === f.certo).length;

  return (
    <VizFrame
      titulo="Detetive de vazamento"
      subtitulo="Para cada coluna candidata, decida: ela existe no momento da previsão, ou vaza informação do futuro?"
      simulado={false}
    >
      <ul className={st.leakList}>
        {FEATURES.map((f, i) => {
          const r = resp[i];
          const corrigir = mostrar && r !== undefined;
          return (
            <li key={f.nome} className={clsx(st.leakItem, corrigir && (r === f.certo ? st.leakOk : st.leakBad))}>
              <span className={st.leakNome}>{f.nome}</span>
              <span className={s.segmented} role="group" aria-label={`Veredito para: ${f.nome}`}>
                <button type="button" aria-pressed={r === 'ok'} onClick={() => setResp({...resp, [i]: 'ok'})}>
                  pode usar
                </button>
                <button type="button" aria-pressed={r === 'vaza'} onClick={() => setResp({...resp, [i]: 'vaza'})}>
                  vaza
                </button>
              </span>
              {corrigir && (
                <span className={st.leakPorque}>
                  <Icon nome={r === f.certo ? 'check' : 'x'} peso={2} /> {f.porque}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <div className={s.controls}>
        <button type="button" className={clsx(s.btn, s.btnPrimary)} disabled={respondidas < FEATURES.length} onClick={() => setMostrar(true)}>
          Conferir ({respondidas}/{FEATURES.length})
        </button>
        <button
          type="button"
          className={s.btn}
          onClick={() => {
            reset();
            setMostrar(false);
          }}
        >
          Recomeçar
        </button>
        {mostrar && (
          <strong className={acertos >= 8 ? s.good : s.warn}>
            {acertos}/{FEATURES.length} corretas
          </strong>
        )}
      </div>
      {mostrar && (
        <Nota>
          O teste é sempre o mesmo: <strong>no instante em que a marca pede a previsão, esse valor já existe?</strong> E cuidado com o vazamento que
          não está na coluna, mas no <em>processamento</em>, como PCA, scalers e encoders ajustados com dados de teste.
        </Nota>
      )}
    </VizFrame>
  );
}
