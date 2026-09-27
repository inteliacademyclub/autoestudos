// Roda dentro do Chromium headless: converte o "esqueleto" de elementos em
// elementos Excalidraw completos e exporta SVG claro/escuro.
import {convertToExcalidrawElements, exportToSvg} from '@excalidraw/excalidraw';

async function toSvg(elements, dark) {
  const svg = await exportToSvg({
    elements,
    appState: {
      exportBackground: false,
      exportWithDarkMode: dark,
      viewBackgroundColor: '#ffffff',
    },
    files: null,
    exportPadding: 20,
  });
  return svg.outerHTML;
}

window.renderDiagram = async (skeleton) => {
  await document.fonts.load('20px Excalifont');
  await document.fonts.ready;
  const elements = convertToExcalidrawElements(skeleton, {regenerateIds: false});
  return {
    elements,
    light: await toSvg(elements, false),
    dark: await toSvg(elements, true),
  };
};

window.__ready = true;
