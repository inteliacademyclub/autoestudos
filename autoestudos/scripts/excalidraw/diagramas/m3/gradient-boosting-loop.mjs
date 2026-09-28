import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(330, -90, 'Gradient boosting: o laço e a tabela das perdas');

// ---- o laço ----
d.box('s1', 0, 20, 240, 90, 'F₀ = constante ótima\n(a média, na perda\nquadrática)', 'verde', {fill: 'solid', bg: '#ebfbee', fontSize: 18});
d.box('s2', 310, 20, 280, 90, 'gradiente negativo\ngᵢ = −∂L/∂F\n(na quadrática: y − F)', 'vermelho', {fontSize: 18});
d.box('s3', 660, 20, 260, 90, 'árvore RASA ajusta gᵢ\n(escolhe as regiões)', 'verde', {fontSize: 18});
d.box('s4', 990, 20, 290, 90, 'cada folha recebe a\nconstante ótima da PERDA\nnos resíduos da folha', 'verde', {fontSize: 18});
d.box('s5', 660, 200, 260, 90, 'F ← F + ν · h\n(ν = learning rate)', 'verde', {strokeWidth: 3, fontSize: 18});
d.diamond('val', 300, 175, 300, 140, 'validação temporal\nainda melhora?', 'cinza', {fontSize: 18});
d.box('pare', 0, 210, 190, 70, 'pare: guarde a\nmelhor iteração', 'verde', {fill: 'solid', bg: '#ebfbee', fontSize: 18});

d.badge('b1', 0, 20, 1, 'verde');
d.badge('b2', 310, 20, 2, 'vermelho');
d.badge('b3', 660, 20, 3, 'verde');
d.badge('b4', 990, 20, 4, 'verde');
d.badge('b5', 660, 200, 5, 'verde');

d.arrow('s1', 's2');
d.arrow('s2', 's3');
d.arrow('s3', 's4');
d.arrow('s4', 's5', {from: 'bottom', to: 'right', via: [[1135, 245]]});
d.arrow('s5', 'val', {from: 'left', to: 'right'});
d.arrow('val', 's2', {from: 'top', to: 'bottom', label: 'sim: mais uma árvore'});
d.arrow('val', 'pare', {from: 'left', to: 'right', label: 'não'});

// ---- a tabela ----
const cols = [60, 400, 830];
const larg = [340, 430, 430];
const y0 = 380;
const h = 50;
const cab = {round: false, fill: 'solid', fontSize: 18};
const cel = {round: false, fill: 'solid', bg: '#ffffff', fontSize: 18};
['perda L', 'gradiente negativo (o que a árvore ajusta)', 'valor da folha'].forEach((t, i) =>
  d.box(`c${i}`, cols[i], y0, larg[i], h, t, 'cinza', {...cab, bg: '#e9ecef'}),
);
const linhas = [
  ['quadrática: ½(y − F)²', 'y − F  (o resíduo)', 'média dos resíduos'],
  ['absoluta: |y − F|', 'sinal(y − F)', 'mediana dos resíduos'],
  ['Huber (δ)', 'resíduo cortado em ±δ', 'mediana + correção robusta'],
  ['quantil α (pinball)', 'α se y > F;  α − 1 se não', 'quantil α dos resíduos'],
];
linhas.forEach((l, r) =>
  l.forEach((t, i) => d.box(`l${r}-${i}`, cols[i], y0 + h * (r + 1), larg[i], h, t, 'cinza', cel)),
);

export default d.elements;
