import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(300, -80, 'Pouca, na medida e complexidade demais');

// ---------- três painéis: os mesmos pontos, três modelos ----------
const pts = [
  [0.03, 0.05], [0.12, 0.62], [0.2, 0.95], [0.31, 0.72], [0.4, 0.35],
  [0.5, -0.1], [0.6, -0.55], [0.7, -0.9], [0.8, -0.62], [0.9, -0.2], [0.97, 0.12],
];
const W = 380;
const H = 270;
const paineis = [
  {x: 0, cor: 'vermelho', nome: 'UNDERFITTING (viés alto)', legenda: 'reta: ignora a curva;\nerra no treino e na validação'},
  {x: 460, cor: 'verde', nome: 'NA MEDIDA', legenda: 'segue o padrão,\nignora o ruído'},
  {x: 920, cor: 'vermelho', nome: 'OVERFITTING (variância alta)', legenda: 'passa por todos os pontos;\ndecorou o ruído do treino'},
];
const px = (p, x) => p.x + 30 + x * (W - 60);
const py = (y) => 50 + (H - 30) / 2 - y * 90;

paineis.forEach((p, i) => {
  d.box(`painel${i}`, p.x, 20, W, H, '', 'cinza', {fill: 'solid', bg: '#ffffff', strokeWidth: 1});
  d.text(p.x + 12, 30, p.nome, {size: 18, color: p.cor === 'verde' ? '#2f9e44' : '#e03131'});
  // pontos de treino
  pts.forEach(([x, y], k) => d.ellipse(`p${i}-${k}`, px(p, x) - 6, py(y) - 6, 12, 12, '', 'azul', {fill: 'solid'}));
  d.text(p.x + 10, 20 + H + 14, p.legenda, {size: 18, color: '#495057'});
});

// 1) reta (underfitting)
d.line([[px(paineis[0], 0), py(0.45)], [px(paineis[0], 1), py(-0.45)]], {cor: 'vermelho', strokeWidth: 3});

// 2) curva suave (seno)
const suave = [];
for (let k = 0; k <= 30; k++) {
  const x = k / 30;
  suave.push([px(paineis[1], x), py(0.9 * Math.sin(2 * Math.PI * x * 0.95))]);
}
d.line(suave, {cor: 'verde', strokeWidth: 3});

// 3) zigue-zague que passa por todos os pontos e oscila entre eles
const zig = [];
pts.forEach(([x, y], k) => {
  zig.push([px(paineis[2], x), py(y)]);
  if (k < pts.length - 1) {
    const [x2, y2] = pts[k + 1];
    const meio = (y + y2) / 2 + (k % 2 === 0 ? 0.35 : -0.35);
    zig.push([px(paineis[2], (x + x2) / 2), py(Math.max(-1.25, Math.min(1.25, meio)))]);
  }
});
d.line(zig, {cor: 'vermelho', strokeWidth: 3});

// ---------- gráfico de erro x complexidade (números do código da aula) ----------
const gx = 120;
const gy = 450;
const gw = 1000;
const gh = 280;
const treino = [0.782, 0.524, 0.454, 0.403, 0.332, 0.268, 0.098, 0.016, 0.0];
const valid = [0.747, 0.574, 0.474, 0.465, 0.43, 0.5, 0.626, 0.709, 0.731];
const profs = ['1', '2', '3', '4', '6', '8', '12', '16', 'sem limite'];
const X = (i) => gx + 40 + (i * (gw - 80)) / (profs.length - 1);
const Y = (v) => gy + gh - (v / 0.85) * gh;

d.line([[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], {strokeWidth: 2});
d.text(gx - 110, gy + 10, 'erro\n(MSE)', {size: 18});
d.text(gx + gw / 2 - 260, gy + gh + 50, 'complexidade: profundidade máxima da árvore →', {size: 18});
profs.forEach((p, i) => d.text(X(i) - (p.length * 5), gy + gh + 12, p, {size: 16, color: '#495057'}));

// ruído irredutível: variância do ruído da base sintética = 0,6² = 0,36
d.line([[gx, Y(0.36)], [gx + gw, Y(0.36)]], {dashed: true, cor: 'cinza'});
d.text(gx + gw - 330, Y(0.36) + 6, 'ruído irredutível (0,36)', {size: 16, color: '#495057'});

d.line(treino.map((v, i) => [X(i), Y(v)]), {cor: 'azul', strokeWidth: 3});
d.line(valid.map((v, i) => [X(i), Y(v)]), {cor: 'laranja', strokeWidth: 3});
d.text(X(6) + 10, Y(0.098) - 30, 'treino', {size: 20, color: '#1971c2'});
d.text(X(5) + 30, Y(0.47), 'validação (futuro)', {size: 20, color: '#e8590c'});

// ponto ótimo
d.ellipse('otimo', X(4) - 10, Y(0.43) - 10, 20, 20, '', 'verde', {fill: 'solid'});
d.text(X(4) - 90, Y(0.43) - 48, 'melhor na validação', {size: 18, color: '#2f9e44'});

// zonas
d.text(gx + 30, gy - 34, '← underfitting', {size: 18, color: '#e03131'});
d.text(gx + gw - 170, gy - 34, 'overfitting →', {size: 18, color: '#e03131'});

export default d.elements;
