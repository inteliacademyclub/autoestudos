import {Diagram} from '../../dsl.mjs';

// Resultados reais da simulação da aula 4.8 (dados sintéticos, efeitos conhecidos).
const passos = [
  ['A: meta + canal', 0.564, '', 'azul'],
  ['+ texto', 0.543, 'Δ −0,020\n[−0,050; +0,009]', 'cinza'],
  ['+ visual', 0.587, 'Δ +0,046\n[+0,008; +0,084]', 'verde'],
  ['+ áudio', 0.591, 'Δ +0,004\n[−0,012; +0,018]', 'cinza'],
  ['+ detectores', 0.600, 'Δ +0,009\n[−0,003; +0,021]', 'cinza'],
  ['+ VLM', 0.597, 'Δ −0,004\n[−0,018; +0,010]', 'cinza'],
];
const d = new Diagram();
d.title(200, -110, 'Escada de ablação: o que cada bloco acrescenta?');
d.text(200, -62, 'Spearman no teste temporal (eixo começa em 0,50) · Δ e IC 95% por bootstrap pareado por canal', {size: 16, color: '#495057'});

const BASE = 420, ESCALA = 4000, W = 160, GAP = 45, X0 = 40;
d.line([[X0 - 20, BASE], [X0 + passos.length * (W + GAP), BASE]], {strokeWidth: 2});
passos.forEach(([nome, rho, delta, cor], i) => {
  const h = (rho - 0.5) * ESCALA;
  const x = X0 + i * (W + GAP);
  d.box(`b${i}`, x, BASE - h, W, h, '', cor, {round: false, fill: cor === 'verde' ? 'solid' : 'hachure'});
  d.text(x + 45, BASE - h - 34, rho.toFixed(3).replace('.', ','), {size: 22});
  d.text(x + 8, BASE + 14, nome, {size: 18});
  if (delta) d.text(x + 8, BASE + 44, delta, {size: 16, color: cor === 'verde' ? '#2f9e44' : '#495057'});
});

d.note('leitura', 40, 560, 1190, 70,
  'Só o bloco visual tem IC do Δ inteiro acima de zero. Os blocos seguintes repetem informação que o visual já trouxe:\nredundância não é defeito do extrator, é o que a ablação existe para mostrar.',
  'verde', {textColor: '#2f9e44', fontSize: 18});

export default d.elements;
