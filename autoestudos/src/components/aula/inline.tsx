import React from 'react';
import Link from '@docusaurus/Link';

/**
 * Formatação mínima para textos passados como string em props de componentes
 * (quizzes, checklists): `código`, **negrito**, *itálico* e [links](/caminho).
 */
export function inline(text: React.ReactNode): React.ReactNode {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`') && p.length > 1) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith('**') && p.endsWith('**') && p.length > 3) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, rotulo, href] = link;
      return href.startsWith('/') ? (
        <Link key={i} to={href}>
          {rotulo}
        </Link>
      ) : (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer">
          {rotulo}
        </a>
      );
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}
