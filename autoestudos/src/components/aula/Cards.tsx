import React from 'react';
import Link from '@docusaurus/Link';
import {inline} from './inline';
import styles from './aula.module.css';
import Icon from './Icon';

type PaperProps = {
  titulo: string;
  referencia: string;
  link: string;
  resumo: React.ReactNode;
  numeros?: string[];
  usar?: React.ReactNode[];
  criticar?: React.ReactNode[];
};

/** Leitura comentada: o que o paper faz, números-chave, o que aproveitar e o que criticar. */
export function PaperCard({titulo, referencia, link, resumo, numeros, usar, criticar}: PaperProps): React.ReactElement {
  return (
    <article className={styles.card}>
      <header>
        <a href={link} target="_blank" rel="noopener noreferrer" className={styles.cardTitle}>
          {titulo}
        </a>
        <div className={styles.cardSub}>{referencia}</div>
      </header>
      <p>{inline(resumo)}</p>
      {numeros && numeros.length > 0 && (
        <div className={styles.numbers}>
          {numeros.map((n) => (
            <span key={n} className={styles.number}>
              {inline(n)}
            </span>
          ))}
        </div>
      )}
      <div className={styles.cardCols}>
        {usar && (
          <div>
            <strong className={styles.good}>Aproveite</strong>
            <ul>
              {usar.map((u, i) => (
                <li key={i}>{inline(u)}</li>
              ))}
            </ul>
          </div>
        )}
        {criticar && (
          <div>
            <strong className={styles.warn}>Olhe com senso crítico</strong>
            <ul>
              {criticar.map((c, i) => (
                <li key={i}>{inline(c)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

type ToolProps = {
  nome: string;
  papel: React.ReactNode;
  versao?: string;
  licenca?: string;
  custo?: string;
  link?: string;
  alerta?: React.ReactNode;
};

/** Link interno (começa com "/") abre no próprio site; externo abre em nova aba. */
function SmartLink({href, className, children}: {href: string; className?: string; children: React.ReactNode}) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

/** Ficha de ferramenta: para que serve, versão verificada, licença, custo e pegadinhas. */
export function ToolCard({nome, papel, versao, licenca, custo, link, alerta}: ToolProps): React.ReactElement {
  return (
    <article className={styles.card}>
      <header className={styles.toolHeader}>
        {link ? (
          <SmartLink href={link} className={styles.cardTitle}>
            {nome}
          </SmartLink>
        ) : (
          <span className={styles.cardTitle}>{nome}</span>
        )}
        <span className={styles.toolTags}>
          {versao && <span className={styles.tag}>{/^\d/.test(versao) ? `v${versao}` : versao}</span>}
          {licenca && <span className={styles.tag}>{licenca}</span>}
          {custo && <span className={styles.tag}>{custo}</span>}
        </span>
      </header>
      <p>{inline(papel)}</p>
      {alerta && (
        <p className={styles.toolAlert}>
          <Icon nome="alerta" /> {inline(alerta)}
        </p>
      )}
    </article>
  );
}

export function CardGrid({children}: {children: React.ReactNode}): React.ReactElement {
  return <div className={styles.cardGrid}>{children}</div>;
}

/** Caixa do fio condutor: o que a aula muda na decisão entre os Shorts A e B da Lumina. */
export function NoProjeto({titulo = 'No projeto: Lumina A vs. B', children}: {titulo?: string; children: React.ReactNode}): React.ReactElement {
  return (
    <aside className={styles.projeto}>
      <strong className={styles.projetoTitle}>
        <Icon nome="losango" peso={2} /> {titulo}
      </strong>
      <div>{children}</div>
    </aside>
  );
}
