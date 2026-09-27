import React from 'react';
import clsx from 'clsx';
import {inline} from './inline';
import {usePersistent} from './usePersistent';
import styles from './aula.module.css';
import Icon from './Icon';

export type Opcao = {
  texto: React.ReactNode;
  correta?: boolean;
  /** Por que essa alternativa está certa ou errada. Aparece depois da resposta. */
  explicacao?: React.ReactNode;
};

export type Pergunta = {
  pergunta: React.ReactNode;
  opcoes: Opcao[];
  /** Mais de uma alternativa correta (checkbox). */
  multipla?: boolean;
};

type Props = {
  /** Identificador único e estável (ex.: "m2-a3"): usado para salvar o progresso no navegador. */
  id: string;
  titulo?: string;
  perguntas: Pergunta[];
};

type Estado = Record<number, {sel: number[]; enviada: boolean}>;

function acertou(p: Pergunta, sel: number[]): boolean {
  const certas = p.opcoes.map((o, i) => (o.correta ? i : -1)).filter((i) => i >= 0);
  return certas.length === sel.length && certas.every((i) => sel.includes(i));
}

function Questao({
  p,
  idx,
  qid,
  estado,
  onChange,
}: {
  p: Pergunta;
  idx: number;
  qid: string;
  estado: {sel: number[]; enviada: boolean};
  onChange: (next: {sel: number[]; enviada: boolean}) => void;
}) {
  const {sel, enviada} = estado;
  const ok = enviada && acertou(p, sel);
  const toggle = (i: number) => {
    if (enviada) return;
    if (p.multipla) onChange({sel: sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i], enviada});
    else onChange({sel: [i], enviada});
  };
  return (
    <fieldset className={styles.question}>
      <legend className={styles.questionTitle}>
        <span className={styles.questionNum}>{idx + 1}</span> {inline(p.pergunta)}
        {p.multipla && !(typeof p.pergunta === 'string' && /marque/i.test(p.pergunta)) && (
          <span className={styles.questionHint}> (marque todas as corretas)</span>
        )}
      </legend>
      <div className={styles.options}>
        {p.opcoes.map((o, i) => {
          const marcada = sel.includes(i);
          const estadoOpcao = !enviada ? undefined : o.correta ? 'certa' : marcada ? 'errada' : undefined;
          return (
            <div key={i} className={clsx(styles.option, estadoOpcao === 'certa' && styles.optionOk, estadoOpcao === 'errada' && styles.optionBad)}>
              <label>
                <input
                  type={p.multipla ? 'checkbox' : 'radio'}
                  name={`${qid}-${idx}`}
                  checked={marcada}
                  disabled={enviada}
                  onChange={() => toggle(i)}
                />
                <span>{inline(o.texto)}</span>
              </label>
              {enviada && (marcada || o.correta) && o.explicacao && <div className={styles.explain}>{inline(o.explicacao)}</div>}
            </div>
          );
        })}
      </div>
      <div className={styles.questionActions}>
        {!enviada ? (
          <button className="button button--primary button--sm" disabled={sel.length === 0} onClick={() => onChange({sel, enviada: true})}>
            Conferir
          </button>
        ) : (
          <>
            <span className={ok ? styles.verdictOk : styles.verdictBad}>
              <Icon nome={ok ? 'check' : 'x'} peso={2} /> {ok ? 'Correto' : 'Ainda não'}
            </span>
            <button className="button button--secondary button--sm" onClick={() => onChange({sel: [], enviada: false})}>
              Tentar de novo
            </button>
          </>
        )}
      </div>
    </fieldset>
  );
}

/** Checkpoint de fim de aula. O progresso fica salvo no navegador do aluno. */
export default function Quiz({id, titulo = 'Checkpoint', perguntas}: Props): React.ReactElement {
  const [estado, setEstado, reset] = usePersistent<Estado>(`quiz:${id}`, {});
  const enviadas = perguntas.filter((_, i) => estado[i]?.enviada).length;
  const certas = perguntas.filter((p, i) => estado[i]?.enviada && acertou(p, estado[i].sel)).length;
  return (
    <section className={styles.quiz} aria-label={titulo}>
      <header className={styles.quizHeader}>
        <strong className={styles.quizTitle}>
          <Icon nome="lapis" peso={2} /> {titulo}
        </strong>
        <span className={styles.quizScore}>
          {enviadas === 0 ? `${perguntas.length} perguntas` : `${certas}/${perguntas.length} corretas`}
          {enviadas > 0 && (
            <button className={styles.linkButton} onClick={reset}>
              recomeçar
            </button>
          )}
        </span>
      </header>
      {perguntas.map((p, i) => (
        <Questao
          key={i}
          p={p}
          idx={i}
          qid={id}
          estado={estado[i] ?? {sel: [], enviada: false}}
          onChange={(next) => setEstado({...estado, [i]: next})}
        />
      ))}
    </section>
  );
}
