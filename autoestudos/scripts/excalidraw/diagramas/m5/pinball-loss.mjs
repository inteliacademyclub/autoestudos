import {Diagram} from '../../dsl.mjs';

// Três painéis: perda (eixo y) vs resíduo r = y - q (eixo x), para alpha = 0,1 / 0,5 / 0,9.
const d = new Diagram();
d.title(330, -110, 'Pinball loss: a inclinação decide o quantil');

const W = 340; // largura de cada painel
const H = 200; // altura útil
const R = 150; // meia-largura do eixo r em px (r de -1 a +1)
const paineis = [
  {alpha: 0.1, x0: 0, cor: 'azul', titulo: 'α = 0,1 (quantil baixo)', pe: '0,9', pd: '0,1'},
  {alpha: 0.5, x0: 440, cor: 'verde', titulo: 'α = 0,5 (mediana)', pe: '0,5', pd: '0,5'},
  {alpha: 0.9, x0: 880, cor: 'laranja', titulo: 'α = 0,9 (quantil alto)', pe: '0,1', pd: '0,9'},
];

paineis.forEach(({alpha, x0, cor, titulo, pe, pd}, i) => {
  const cx = x0 + W / 2; // r = 0
  const base = 230; // y do eixo horizontal (perda = 0)
  const escala = 190; // px por unidade de perda
  d.text(x0 + 45, -32, titulo, {size: 20});
  // eixos
  d.line([[x0, base], [x0 + W, base]], {cor: 'cinza'});
  d.line([[cx, base], [cx, base - H]], {cor: 'cinza', dashed: true});
  // perda: r < 0 -> (1 - alpha)|r| ; r > 0 -> alpha * r
  d.line([[cx - R, base - (1 - alpha) * escala], [cx, base], [cx + R, base - alpha * escala]], {cor, strokeWidth: 4});
  d.text(x0 + 5, base + 12, 'previu alto', {size: 16, color: '#495057'});
  d.text(x0 + W - 110, base + 12, 'previu baixo', {size: 16, color: '#495057'});
  d.text(cx - 32, base + 40, 'r = y − q', {size: 16, color: '#495057'});
  d.text(cx - R + 5, base - (1 - alpha) * escala - 32, `peso ${pe}`, {size: 18, color: '#1e1e1e'});
  d.text(cx + R - 75, base - alpha * escala - 32, `peso ${pd}`, {size: 18, color: '#1e1e1e'});
  d.badge(`b${i}`, x0 + 18, -20, i + 1, cor);
});

d.note('n1', 0, 320, 1220, 80,
  'Com α = 0,9, errar por baixo custa 9 vezes mais que errar por cima. O ponto que minimiza a perda média\né aquele com 90% das observações abaixo: o quantil 0,9. Com α = 0,5 a perda é metade do erro absoluto (MAE).',
  'cinza', {fontSize: 18});

export default d.elements;
