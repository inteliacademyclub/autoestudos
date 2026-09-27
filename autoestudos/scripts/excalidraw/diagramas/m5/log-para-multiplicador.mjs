import {Diagram} from '../../dsl.mjs';

// Waterfall estático do Short B: soma em log = produto de multiplicadores em curtidas.
const d = new Diagram();
d.title(250, -100, 'Short B: somar em log é multiplicar curtidas');

const passos = [
  ['base', 'Short típico\nda Lumina', '7,74', '2.300', 'ciano'],
  ['g', 'gancho = 8', '+0,28', '×1,33', 'amarelo'],
  ['e', 'energia_musica\n= 7', '+0,10', '×1,11', 'amarelo'],
  ['r', 'rosto = sim', '+0,10', '×1,10', 'amarelo'],
  ['t', 'texto_na_tela\n= sim', '+0,08', '×1,08', 'amarelo'],
  ['h', 'hora = 19h', '+0,05', '×1,06', 'amarelo'],
  ['o', 'duração\n= 22 s', '+0,03', '×1,03', 'amarelo'],
  ['fim', 'Previsão B', '8,38', '4.380', 'verde'],
];

const W = 140;
const GAP = 26;
passos.forEach(([id, nome, log, mult, cor], i) => {
  const x = i * (W + GAP);
  const destaque = id === 'base' || id === 'fim';
  d.box(id, x, 0, W, 90, nome, cor, {fontSize: 16, strokeWidth: destaque ? 3 : 2});
  d.text(x + 10, 110, `log: ${log}`, {size: 18, color: '#495057'});
  d.text(x + 10, 140, destaque ? `${mult} curtidas` : mult, {size: 20, color: destaque ? '#2f9e44' : '#e67700'});
  if (i > 0) d.arrow(passos[i - 1][0], id, {from: 'right', to: 'left'});
});

d.note('n1', 0, 200, 610, 110,
  'Em log (o que o SHAP devolve):\n7,74 + 0,28 + 0,10 + 0,10 + 0,08 + 0,05 + 0,03 = 8,38',
  'cinza', {fontSize: 18});
d.note('n2', 650, 200, 610, 110,
  'Em curtidas (o que o marketing entende):\n2.300 × 1,33 × 1,11 × 1,10 × 1,08 × 1,06 × 1,03 ≈ 4.400\n(4.380 sem arredondar; multiplicador = exp da contribuição)',
  'verde', {fontSize: 18, textColor: '#2f9e44'});

export default d.elements;
