import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(250, -80, '"Dados nunca vistos" = o futuro');

const x0 = 250;
const n = 24;
const lado = 34;
const passo = 40;

// legenda de cores
d.box('lt', 0, -10, 150, 36, 'treino', 'azul', {fill: 'solid', fontSize: 16});
d.box('lv', 170, -10, 150, 36, 'validação', 'laranja', {fill: 'solid', fontSize: 16});
d.box('lte', 340, -10, 150, 36, 'teste', 'verde', {fill: 'solid', fontSize: 16});

// linha 1: split aleatório
const aleatorio = 'TVTTETTVTTTETVTTETTVTTET';
const cor = {T: 'azul', V: 'laranja', E: 'verde'};
d.text(0, 75, 'Split aleatório', {size: 20});
for (let i = 0; i < n; i++) {
  d.box(`a${i}`, x0 + i * passo, 64, lado, lado, '', cor[aleatorio[i]], {fill: 'solid'});
}
d.note('na', x0, 115, 960, 60, 'O treino "enxerga" posts publicados DEPOIS dos de teste: tendências, crescimento do canal\ne virais futuros vazam. A métrica fica otimista.', 'vermelho', {textColor: '#e03131'});

// linha 2: split temporal
d.text(0, 225, 'Split temporal', {size: 20});
for (let i = 0; i < n; i++) {
  const c = i < 16 ? 'azul' : i < 20 ? 'laranja' : 'verde';
  d.box(`t${i}`, x0 + i * passo, 214, lado, lado, '', c, {fill: 'solid'});
}
d.note('nt', x0, 265, 960, 60, 'Treina no passado, escolhe hiperparâmetros no "meio", mede UMA vez no período mais recente.\nÉ a mesma situação da Lumina: prever um Short que ainda não foi publicado.', 'verde', {textColor: '#2f9e44'});

// eixo do tempo
d.arrowXY(x0, 360, x0 + n * passo, 360, {strokeWidth: 3});
d.text(x0, 372, 'publicação mais antiga', {size: 16, color: '#495057'});
d.text(x0 + n * passo - 190, 372, 'mais recente', {size: 16, color: '#495057'});
d.box('prod', x0 + n * passo + 20, 336, 140, 50, 'produção:\npróximo Short', 'roxo', {fontSize: 16});

export default d.elements;
