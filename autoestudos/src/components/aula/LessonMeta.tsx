import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './aula.module.css';
import Icon from './Icon';

export const ETAPAS = [
  {id: 'dados', label: 'Dados'},
  {id: 'avaliacao', label: 'Avaliação'},
  {id: 'modelo', label: 'Modelo'},
  {id: 'multimodal', label: 'Multimodal'},
  {id: 'incerteza', label: 'Incerteza'},
  {id: 'explicacao', label: 'Explicação'},
  {id: 'agente', label: 'Agente'},
  {id: 'mcp', label: 'MCP'},
] as const;

export type Etapa = (typeof ETAPAS)[number]['id'];

type Prereq = string | {label: string; to: string};

type Props = {
  objetivos: string[];
  prerequisitos?: Prereq[];
  /** Ex.: "40 min" */
  tempo: string;
  /** Etapa(s) do pipeline do projeto em que a aula se encaixa. */
  etapa: Etapa | Etapa[];
  /** Semana do projeto (1–4) em que o conteúdo é necessário. */
  semana?: number | string;
  opcional?: boolean;
};

/** Cabeçalho padrão das aulas da trilha: objetivos, pré-requisitos e onde a aula entra no pipeline. */
export default function LessonMeta({objetivos, prerequisitos, tempo, etapa, semana, opcional}: Props): React.ReactElement {
  const ativas = new Set(Array.isArray(etapa) ? etapa : [etapa]);
  return (
    <aside className={styles.meta} aria-label="Sobre esta aula">
      <div className={styles.metaTop}>
        <span className={styles.pill}>
          <Icon nome="relogio" peso={2} /> {tempo}
        </span>
        {semana !== undefined && <span className={styles.pill}>Semana {semana} do projeto</span>}
        {opcional && <span className={clsx(styles.pill, styles.pillOpt)}>Opcional · ir além</span>}
      </div>
      <ol className={styles.pipeline} aria-label="Etapas do pipeline do projeto">
        {ETAPAS.map((e) => (
          <li key={e.id} className={clsx(styles.stage, ativas.has(e.id) && styles.stageOn)} aria-current={ativas.has(e.id) ? 'step' : undefined}>
            {e.label}
          </li>
        ))}
      </ol>
      <div className={styles.metaCols}>
        <div>
          <strong>Ao final desta aula você vai conseguir:</strong>
          <ul>
            {objetivos.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
        {prerequisitos && prerequisitos.length > 0 && (
          <div>
            <strong>Antes, vale ter visto:</strong>
            <ul>
              {prerequisitos.map((p) =>
                typeof p === 'string' ? (
                  <li key={p}>{p}</li>
                ) : (
                  <li key={p.to}>
                    <Link to={p.to}>{p.label}</Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
