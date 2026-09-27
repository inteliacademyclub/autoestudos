import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(70, -120, 'Ablação: quanto cada bloco vale (par-a-par intra-canal, dados sintéticos)');

// ---------- A. cumulativa ----------
d.text(0, -50, 'A. cumulativa, na ordem do briefing', {size: 22});
const BASE_Y = 380; // y do valor 0,45
const ESC = 2400; // px por unidade de métrica (0,01 = 24 px)
const yv = (v) => BASE_Y - (v - 0.45) * ESC;
d.line([[20, BASE_Y], [540, BASE_Y]], {strokeWidth: 2});
d.line([[20, yv(0.5)], [540, yv(0.5)]], {dashed: true, cor: 'vermelho'});
d.text(30, yv(0.5) - 26, 'moeda = 0,50', {size: 16, color: '#e03131'});
const barras = [
  ['canal', 0.472, 'ciano'],
  ['+ tempo', 0.471, 'azul'],
  ['+ texto', 0.486, 'azul'],
  ['+ visual', 0.528, 'laranja'],
  ['+ VLM', 0.55, 'laranja'],
];
barras.forEach(([rot, v, cor], i) => {
  const x = 40 + i * 100;
  d.box(`bar${i}`, x, yv(v), 70, BASE_Y - yv(v), '', cor, {round: false});
  d.text(x + 2, yv(v) - 26, v.toFixed(3).replace('.', ','), {size: 16});
  d.text(x - 4, BASE_Y + 10, rot, {size: 16});
});

d.text(330, BASE_Y + 42, '(eixo começa em 0,45)', {size: 14, color: '#495057'});

// ---------- B. deixa um de fora ----------
const X0 = 620;
d.text(X0, -50, 'B. tirar um bloco do modelo completo: Δ e IC 95%', {size: 22});
const ZERO = 860;
const px = (v) => ZERO + v * 4000; // 0,01 = 40 px
d.line([[ZERO, 0], [ZERO, 340]], {dashed: true, strokeWidth: 2});
d.text(ZERO - 6, 350, '0', {size: 16});
const linhas = [
  ['ruído (controle)', 0.007, -0.01, 0.025, 'cinza'],
  ['tempo', -0.008, -0.024, 0.006, 'cinza'],
  ['texto', -0.004, -0.013, 0.006, 'cinza'],
  ['visual', 0.02, -0.005, 0.049, 'laranja'],
  ['VLM', 0.023, 0.004, 0.043, 'verde'],
];
const fmt = (v) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(3).replace('.', ',');
linhas.forEach(([rot, m, lo, hi, cor], i) => {
  const y = 30 + i * 65;
  d.text(X0, y - 12, rot, {size: 18});
  d.line([[px(lo), y], [px(hi), y]], {strokeWidth: 4, cor});
  d.ellipse(`pt${i}`, px(m) - 8, y - 8, 16, 16, '', cor, {fill: 'solid'});
  d.text(1090, y - 12, `${fmt(m)} [${fmt(lo)}; ${fmt(hi)}]`, {size: 16});
});

d.note('na', 0, 470, 560, 90, 'a ordem importa: "+ texto" parece somar aqui,\nmas o bloco quase não tem efeito real', 'vermelho', {textColor: '#e03131'});
d.note('nb', X0, 470, 680, 90, 'só o VLM tem o IC inteiro acima de zero; o visual fica no limite.\nO controle de ruído mostra o tamanho do acaso neste teste.', 'verde', {textColor: '#2f9e44'});

export default d.elements;
