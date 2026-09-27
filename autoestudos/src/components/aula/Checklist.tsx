import React from 'react';
import {inline} from './inline';
import {usePersistent} from './usePersistent';
import styles from './aula.module.css';

type Item = {texto: React.ReactNode; detalhe?: React.ReactNode};

type Props = {
  /** Identificador único e estável: usado para salvar o progresso no navegador. */
  id: string;
  titulo?: string;
  itens: (Item | string)[];
};

/** Lista de verificação com progresso salvo no navegador. */
export default function Checklist({id, titulo, itens}: Props): React.ReactElement {
  const [feitos, setFeitos] = usePersistent<number[]>(`checklist:${id}`, []);
  const normal = itens.map((it) => (typeof it === 'string' ? {texto: it} : it));
  const pct = Math.round((feitos.length / normal.length) * 100);
  return (
    <section className={styles.checklist} aria-label={titulo ?? 'Checklist'}>
      <header className={styles.checklistHeader}>
        {titulo && <strong>{titulo}</strong>}
        <span className={styles.progressLabel}>
          {feitos.length}/{normal.length}
        </span>
      </header>
      <div className={styles.progress} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={styles.progressBar} style={{width: `${pct}%`}} />
      </div>
      <ul className={styles.checkItems}>
        {normal.map((it, i) => {
          const on = feitos.includes(i);
          return (
            <li key={i} className={on ? styles.checkDone : undefined}>
              <label>
                <input type="checkbox" checked={on} onChange={() => setFeitos(on ? feitos.filter((x) => x !== i) : [...feitos, i])} />
                <span>
                  {inline(it.texto)}
                  {it.detalhe && <small className={styles.checkDetail}>{inline(it.detalhe)}</small>}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
