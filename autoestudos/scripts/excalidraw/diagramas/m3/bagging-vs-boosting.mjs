import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(360, -100, 'Bagging vs. boosting: paralelo ou em série');

// ---------- esquerda: bagging ----------
d.text(90, -40, 'BAGGING (ex.: random forest)', {size: 24, color: '#2f9e44'});
d.box('dados', 150, 10, 280, 60, 'dados de treino', 'azul');
const xs = [0, 210, 420];
xs.forEach((x, i) => {
  d.box(`s${i}`, x, 130, 160, 70, `amostra ${i + 1}\n(com reposição)`, 'azul', {fill: 'solid', bg: '#e7f5ff', fontSize: 18});
  d.box(`t${i}`, x, 260, 160, 70, `árvore FUNDA ${i + 1}`, 'verde', {fontSize: 18});
  d.arrow('dados', `s${i}`, {from: 'bottom', to: 'top'});
  d.arrow(`s${i}`, `t${i}`, {from: 'bottom', to: 'top'});
});
d.box('media', 150, 400, 280, 70, 'ŷ = MÉDIA das árvores', 'verde', {strokeWidth: 3});
xs.forEach((_, i) => d.arrow(`t${i}`, 'media', {from: 'bottom', to: 'top'}));
d.note('n-bag', 0, 520, 580, 90, 'Árvores independentes, treinadas em paralelo.\nCada uma erra diferente; a média cancela o ruído.\n→ reduz a VARIÂNCIA', 'verde', {textColor: '#2f9e44'});

// separador
d.line([[640, -40], [640, 610]], {dashed: true, cor: 'cinza'});

// ---------- direita: boosting ----------
d.text(760, -40, 'BOOSTING (ex.: gradient boosting)', {size: 24, color: '#2f9e44'});
d.box('f0', 760, 10, 400, 60, 'F₀ = média de y (ponto de partida)', 'verde', {fill: 'solid', bg: '#ebfbee'});
d.box('h1', 760, 120, 400, 60, 'árvore RASA 1 aprende  y − F₀', 'verde');
d.box('h2', 760, 230, 400, 60, 'árvore RASA 2 aprende  y − F₁', 'verde');
d.box('h3', 760, 340, 400, 60, 'árvore RASA 3 aprende  y − F₂', 'verde');
d.arrow('f0', 'h1', {from: 'bottom', to: 'top', label: 'resíduos', cor: 'vermelho'});
d.arrow('h1', 'h2', {from: 'bottom', to: 'top', label: 'resíduos', cor: 'vermelho'});
d.arrow('h2', 'h3', {from: 'bottom', to: 'top', label: 'resíduos', cor: 'vermelho'});
d.box('soma', 700, 450, 520, 56, 'ŷ = F₀ + ν·h₁ + ν·h₂ + ν·h₃', 'verde', {strokeWidth: 3});
d.arrow('h3', 'soma', {from: 'bottom', to: 'top'});
d.note('n-boost', 700, 540, 520, 70, 'Árvores em série: cada uma corrige o erro da soma anterior.\n→ reduz o VIÉS (e precisa saber a hora de parar)', 'verde', {textColor: '#2f9e44'});

export default d.elements;
