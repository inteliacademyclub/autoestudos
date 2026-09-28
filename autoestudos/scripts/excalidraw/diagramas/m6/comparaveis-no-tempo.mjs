import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(280, -90, 'Comparáveis sem vazamento: setor certo, passado maduro');

// linha do tempo
d.line([[0, 120], [1180, 120]], {strokeWidth: 3});
d.arrowXY(1170, 120, 1230, 120, {strokeWidth: 3});
d.text(0, 140, 'jan/2025', {size: 16, color: '#495057'});

// posts elegíveis (ciano), maturando (vermelho) e futuros (vermelho)
const elegiveis = [40, 110, 170, 250, 320, 390, 450, 520, 600, 660];
elegiveis.forEach((x, i) => d.ellipse(`p${i}`, x, 106, 28, 28, '', 'ciano', {fill: 'solid'}));
[760, 820].forEach((x, i) => d.ellipse(`m${i}`, x, 106, 28, 28, '', 'vermelho', {fill: 'solid'}));
[1000, 1080].forEach((x, i) => d.ellipse(`f${i}`, x, 106, 28, 28, '', 'vermelho'));

// marcadores
d.line([[720, 40], [720, 200]], {dashed: true, cor: 'vermelho'});
d.line([[900, 30], [900, 210]], {strokeWidth: 3, cor: 'roxo'});
d.text(840, 0, 'data planejada', {size: 20, color: '#6741d9'});
d.text(640, 215, 'data − 30 dias', {size: 18, color: '#e03131'});
d.box('maturando', 730, 250, 230, 70, 'curtidas ainda\nsubindo: FORA', 'vermelho', {dashed: true});
d.box('futuro', 990, 250, 220, 70, 'futuro: FORA', 'vermelho', {dashed: true});
d.box('ok', 180, 250, 420, 70, 'passado maduro do MESMO setor:\npode ser vizinho', 'ciano');

// espaço de embeddings
d.box('espaco', 0, 380, 560, 260, '', 'cinza', {dashed: true, bg: 'transparent'});
d.text(20, 390, 'espaço de embeddings (texto + visual)', {size: 18, color: '#495057'});
d.ellipse('q', 250, 490, 40, 40, '', 'roxo', {fill: 'solid'});
d.text(210, 540, 'criativo novo', {size: 16, color: '#6741d9'});
[[170, 450], [330, 470], [200, 560], [310, 580], [380, 430]].forEach(([x, y], i) =>
  d.ellipse(`v${i}`, x, y, 24, 24, '', 'ciano', {fill: 'solid'}));
[[60, 600], [480, 600], [470, 450]].forEach(([x, y], i) =>
  d.ellipse(`l${i}`, x, y, 24, 24, '', 'ciano'));
d.text(360, 540, 'k vizinhos\n(cosseno)', {size: 16, color: '#0c8599'});

// saídas
d.box('evid', 680, 390, 520, 100, 'EVIDÊNCIA na resposta\npost_id, similaridade, curtidas / mediana do canal', 'amarelo');
d.box('feat', 680, 530, 520, 100, 'FEATURE do modelo: rel_vizinhos\nmediana do alvo relativo dos k vizinhos', 'verde');
d.arrow('espaco', 'evid', {from: 'right', to: 'left'});
d.arrow('espaco', 'feat', {from: 'right', to: 'left'});
d.arrow('ok', 'espaco', {from: 'bottom', to: 'top', label: 'IDSelectorRange(0, n)'});

export default d.elements;
