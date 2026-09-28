import React from 'react';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './aula.module.css';
import Icon from './Icon';

type Props = {
  /** Caminho do diagrama dentro de static/diagramas, sem extensão. Ex.: "galaxies/arquitetura" */
  name: string;
  alt: string;
  caption?: React.ReactNode;
  /** Largura máxima em px (padrão: 100% da coluna). */
  maxWidth?: number;
};

/**
 * Diagrama Excalidraw exportado em SVG (claro/escuro). O arquivo .excalidraw
 * fica ao lado para quem quiser abrir e editar no excalidraw.com.
 */
export default function Sketch({name, alt, caption, maxWidth}: Props): React.ReactElement {
  const light = useBaseUrl(`/diagramas/${name}.light.svg`);
  const dark = useBaseUrl(`/diagramas/${name}.dark.svg`);
  const source = useBaseUrl(`/diagramas/${name}.excalidraw`);
  return (
    <figure className={styles.sketch} style={maxWidth ? {maxWidth} : undefined}>
      <ThemedImage alt={alt} sources={{light, dark}} className={styles.sketchImg} />
      <figcaption className={styles.sketchCaption}>
        {caption && <span>{caption}</span>}
        <a href={source} download className={styles.sketchSource} title="Baixe e arraste para o excalidraw.com para editar">
          <Icon nome="download" tamanho="0.95em" /> .excalidraw
        </a>
      </figcaption>
    </figure>
  );
}
