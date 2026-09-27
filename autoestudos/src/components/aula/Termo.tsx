import React, {useId} from 'react';
import Link from '@docusaurus/Link';
import {GLOSSARIO} from '@site/src/data/glossario';
import styles from './aula.module.css';

/** Termo com definição em tooltip (hover/foco), vinda do glossário da trilha. */
export default function Termo({id, children}: {id: string; children?: React.ReactNode}): React.ReactElement {
  const v = GLOSSARIO[id];
  const tipId = useId();
  if (!v) {
    if (process.env.NODE_ENV !== 'production') console.warn(`Termo desconhecido no glossário: ${id}`);
    return <>{children}</>;
  }
  return (
    <span className={styles.termo} tabIndex={0} aria-describedby={tipId}>
      {children ?? v.termo}
      <span role="tooltip" id={tipId} className={styles.termoTip}>
        <strong>{v.termo}</strong>
        {v.en && <em> ({v.en})</em>}: {v.definicao}
      </span>
    </span>
  );
}

/** Lista completa do glossário, em ordem alfabética. */
export function Glossario(): React.ReactElement {
  const itens = Object.entries(GLOSSARIO).sort(([, a], [, b]) => a.termo.localeCompare(b.termo, 'pt-BR'));
  return (
    <dl className={styles.glossario}>
      {itens.map(([id, v]) => (
        <div key={id} id={id} className={styles.glossarioItem}>
          <dt>
            {v.termo}
            {v.en && <span className={styles.glossarioEn}> · {v.en}</span>}
          </dt>
          <dd>
            {v.definicao}
            {v.aula && (
              <>
                {' '}
                <Link to={v.aula}>Aprofundar →</Link>
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
