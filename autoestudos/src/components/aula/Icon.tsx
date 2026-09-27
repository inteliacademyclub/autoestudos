import React from 'react';

// Ícones de traço (currentColor), no lugar de glifos Unicode que viram emoji
// colorido em alguns sistemas (▶, ✔, ⏱...). Um só conjunto para toda a trilha.
const PATHS = {
  relogio: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  lapis: <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />,
  losango: <path d="M12 3l9 9-9 9-9-9 9-9z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  alerta: (
    <>
      <path d="M12 3.5L2.5 20h19L12 3.5z" />
      <path d="M12 10v4.5M12 17.5v.01" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5z" />,
  pause: <path d="M9 5.5v13M15 5.5v13" />,
  repetir: (
    <>
      <path d="M4 12a8 8 0 1 0 2.4-5.7" />
      <path d="M4 4.5V9h4.5" />
    </>
  ),
  esquerda: <path d="M19 12H5M11 6l-6 6 6 6" />,
  direita: <path d="M5 12h14M13 6l6 6-6 6" />,
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
} as const;

export type NomeIcone = keyof typeof PATHS;

/**
 * `peso` casa o traço com o texto ao lado: 1.5 para texto regular (400),
 * 2 para semibold/bold (600+).
 */
export default function Icon({
  nome,
  tamanho = '1.05em',
  peso = 1.5,
  className,
  style,
}: {
  nome: NomeIcone;
  tamanho?: number | string;
  peso?: 1.5 | 2;
  className?: string;
  style?: React.CSSProperties;
}): React.ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      fill="none"
      stroke="currentColor"
      strokeWidth={peso}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      // o triângulo do play tem o centro visual à direita do geométrico
      style={{flex: 'none', verticalAlign: '-0.15em', ...(nome === 'play' ? {transform: 'translateX(1px)'} : null), ...style}}
    >
      {PATHS[nome]}
    </svg>
  );
}
