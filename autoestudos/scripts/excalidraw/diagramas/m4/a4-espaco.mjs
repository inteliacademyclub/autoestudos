import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(250, -100, 'Imagem e texto no mesmo espaço: de frames a colunas');

// entradas
d.box('frames', 0, 0, 220, 110, 'frames do Short\n+ thumbnail', 'azul');
d.box('frases', 0, 330, 220, 110, 'frases (sondas)\n"um close de batom"\n"um carro andando"', 'azul');

// encoders congelados
d.box('encI', 280, 0, 230, 110, 'encoder de imagem\n(ViT, CONGELADO)', 'laranja', {strokeWidth: 3});
d.box('encT', 280, 330, 230, 110, 'encoder de texto\n(CONGELADO)', 'laranja', {strokeWidth: 3});
d.arrow('frames', 'encI');
d.arrow('frases', 'encT');

// espaço compartilhado
d.ellipse('espaco', 580, 20, 380, 400, '', 'cinza', {fill: 'solid', bg: '#f8f9fa'});
d.text(650, -30, 'espaço de 768 dims (norma 1)', {size: 18, color: '#495057'});
const pontos = [
  ['p1', 680, 140, 'laranja', 'frame: batom', 610, 172],
  ['p2', 770, 175, 'azul', '"close de batom"', 745, 200],
  ['p3', 845, 318, 'laranja', 'frame: estrada', 750, 346],
  ['p4', 800, 285, 'azul', '"carro andando"', 745, 255],
];
for (const [id, px, py, cor, rot, lx, ly] of pontos) {
  d.ellipse(id, px, py, 18, 18, '', cor, {fill: 'solid'});
  d.text(lx, ly, rot, {size: 16, color: cor === 'azul' ? '#1971c2' : '#e8590c'});
}
d.arrow('encI', 'p1', {from: 'right', to: 'left', cor: 'laranja'});
d.arrow('encT', 'p4', {from: 'right', to: 'left', cor: 'azul'});
d.line([[698, 152], [770, 180]], {dashed: true, cor: 'verde'});
d.text(615, 238, 'perto = cosseno alto', {size: 16, color: '#2f9e44'});

// saídas
d.box('pool', 1030, 0, 270, 120, 'média dos frames\n(e do gancho, separada)\n→ PCA 16–32 comps', 'laranja');
d.box('sonda', 1030, 170, 270, 120, 'sondas: cosseno entre\no frame e cada frase\n→ 1 coluna por sonda', 'laranja');
d.box('gbm', 1030, 360, 270, 90, 'colunas no GBM\n(com as do canal)', 'verde', {strokeWidth: 3});
d.arrow('espaco', 'pool', {from: 'right', to: 'left'});
d.arrow('espaco', 'sonda', {from: 'right', to: 'left'});
d.arrow('pool', 'gbm', {from: 'right', to: 'right', via: [[1340, 60], [1340, 405]]});
d.arrow('sonda', 'gbm', {from: 'bottom', to: 'top'});

d.note('treino', 0, 490, 1300, 70, 'Treino contrastivo (feito por quem publicou o modelo, não por você): pares imagem–legenda certos se aproximam, os errados se afastam.\nVocê só usa os encoders prontos. UMAP e t-SNE servem para VISUALIZAR este espaço, nunca como feature.', 'cinza');

export default d.elements;
