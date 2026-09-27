import {Diagram} from '../../dsl.mjs';

// Reticulado das 2^3 coalizões de {G, T, H} com v(S) do exemplo da aula 5.5.
const d = new Diagram();
d.title(170, -100, 'As 8 coalizões e as 4 entradas do gancho (G)');

const W = 220;
const H = 80;
const no = (id, cx, y, txt, cor = 'cinza') => d.box(id, cx - W / 2, y, W, H, txt, cor, {fontSize: 18});

no('vazio', 380, 0, '∅\nv = 0,00');
no('G', 60, 170, '{G}   v = 0,24\nG somou +0,24', 'amarelo');
no('T', 380, 170, '{T}\nv = 0,04');
no('H', 700, 170, '{H}\nv = 0,05');
no('TH', 60, 340, '{T, H}\nv = 0,09');
no('GT', 380, 340, '{G, T}   v = 0,36\nG somou +0,32', 'amarelo');
no('GH', 700, 340, '{G, H}   v = 0,29\nG somou +0,24', 'amarelo');
no('GTH', 380, 510, '{G, T, H}  v = 0,41\nG somou +0,32', 'amarelo');

// arestas sem G (neutras)
const neutra = {dashed: true, cor: 'cinza'};
d.arrow('vazio', 'T', {from: 'bottom', to: 'top', ...neutra});
d.arrow('vazio', 'H', {from: 'bottom', to: 'top', ...neutra});
d.arrow('T', 'TH', {from: 'bottom', to: 'top', ...neutra});
d.arrow('H', 'TH', {from: 'bottom', to: 'top', ...neutra});
d.arrow('G', 'GT', {from: 'bottom', to: 'top', ...neutra});
d.arrow('G', 'GH', {from: 'bottom', to: 'top', ...neutra});
d.arrow('GT', 'GTH', {from: 'bottom', to: 'top', ...neutra});
d.arrow('GH', 'GTH', {from: 'bottom', to: 'top', ...neutra});

// arestas em que G entra (contribuição marginal)
const g = {cor: 'amarelo', strokeWidth: 4};
d.arrow('vazio', 'G', {from: 'bottom', to: 'top', ...g});
d.arrow('T', 'GT', {from: 'bottom', to: 'top', ...g});
d.arrow('H', 'GH', {from: 'bottom', to: 'top', ...g});
d.arrow('TH', 'GTH', {from: 'bottom', to: 'top', ...g});

d.note('n1', 900, 150, 380, 330,
  'Shapley de G = média ponderada\ndas 4 contribuições marginais:\n\n+0,24 × 2/6   (G entra 1º)\n+0,32 × 1/6   (depois de T)\n+0,24 × 1/6   (depois de H)\n+0,32 × 2/6   (G entra por último)\n\n= 0,28\n\nO peso = fração das 3! = 6 ordens\nem que G encontra aquela coalizão.',
  'amarelo', {textColor: '#1e1e1e', fontSize: 18, align: 'left'});

export default d.elements;
