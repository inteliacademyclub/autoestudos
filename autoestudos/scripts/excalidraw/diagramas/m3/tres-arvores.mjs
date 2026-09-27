import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(340, -110, 'Três jeitos de crescer uma árvore');

const q = (id, x, y, t) => d.box(id, x, y, 130, 46, t, 'azul', {fontSize: 17});
const f = (id, x, y) => d.box(id, x, y, 60, 40, '', 'verde', {fill: 'solid', bg: '#ebfbee'});

// ---- XGBoost: nível a nível ----
d.text(20, -40, 'XGBoost (padrão): nível a nível', {size: 22, color: '#2f9e44'});
q('x0', 125, 20, 'inscritos?');
q('x1', 20, 120, 'gancho?');
q('x2', 230, 120, 'hora?');
d.arrow('x0', 'x1', {from: 'bottom', to: 'top'});
d.arrow('x0', 'x2', {from: 'bottom', to: 'top'});
[[0, 'x1'], [85, 'x1'], [215, 'x2'], [300, 'x2']].forEach(([x, pai], i) => {
  f(`xf${i}`, x, 220);
  d.arrow(pai, `xf${i}`, {from: 'bottom', to: 'top'});
});
d.badge('xb0', 113, 12, 1, 'azul');
d.badge('xb1', 8, 112, 2, 'azul');
d.badge('xb2', 218, 112, 3, 'azul');
d.note('xn', 0, 420, 370, 80, 'Divide todos os nós de um nível antes\nde descer. Árvores equilibradas;\ncontrole principal: max_depth.', 'azul', {textColor: '#1971c2'});

// ---- LightGBM: folha a folha ----
d.line([[410, -40], [410, 500]], {dashed: true, cor: 'cinza'});
d.text(450, -40, 'LightGBM: folha a folha', {size: 22, color: '#2f9e44'});
q('l0', 560, 20, 'inscritos?');
f('lf0', 470, 120);
q('l1', 650, 120, 'gancho?');
f('lf1', 580, 220);
q('l2', 700, 220, 'hora?');
f('lf2', 650, 320);
f('lf3', 780, 320);
d.arrow('l0', 'lf0', {from: 'bottom', to: 'top'});
d.arrow('l0', 'l1', {from: 'bottom', to: 'top'});
d.arrow('l1', 'lf1', {from: 'bottom', to: 'top'});
d.arrow('l1', 'l2', {from: 'bottom', to: 'top'});
d.arrow('l2', 'lf2', {from: 'bottom', to: 'top'});
d.arrow('l2', 'lf3', {from: 'bottom', to: 'top'});
d.badge('lb0', 548, 12, 1, 'azul');
d.badge('lb1', 638, 112, 2, 'azul');
d.badge('lb2', 688, 212, 3, 'azul');
d.note('ln', 440, 420, 400, 80, 'Divide sempre a folha de MAIOR ganho,\nonde quer que ela esteja. Pode ficar funda\nde um lado; controle principal: num_leaves.', 'azul', {textColor: '#1971c2'});

// ---- CatBoost: simétrica ----
d.line([[870, -40], [870, 500]], {dashed: true, cor: 'cinza'});
d.text(900, -40, 'CatBoost: simétrica', {size: 22, color: '#2f9e44'});
q('c0', 1030, 20, 'inscritos?');
q('c1', 920, 120, 'gancho ≤ 5?');
q('c2', 1140, 120, 'gancho ≤ 5?');
d.arrow('c0', 'c1', {from: 'bottom', to: 'top'});
d.arrow('c0', 'c2', {from: 'bottom', to: 'top'});
[[905, 'c1'], [990, 'c1'], [1125, 'c2'], [1210, 'c2']].forEach(([x, pai], i) => {
  f(`cf${i}`, x, 220);
  d.arrow(pai, `cf${i}`, {from: 'bottom', to: 'top'});
});
d.badge('cb0', 1018, 12, 1, 'azul');
d.badge('cb1', 908, 112, 2, 'azul');
d.badge('cb2', 1128, 112, 2, 'azul');
d.note('cn', 900, 420, 400, 80, 'A MESMA pergunta em todo o nível\n(árvore oblivious). Rígida, regulariza\nbem e prevê muito rápido; controle: depth.', 'azul', {textColor: '#1971c2'});

d.text(0, 520, 'Os números mostram a ordem dos splits. Folhas em verde.', {size: 16, color: '#868e96'});

export default d.elements;
