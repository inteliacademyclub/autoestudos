import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(130, -110, 'A escada de baselines (MAE em log, dados sintéticos da aula)');

const degraus = [
  ['g', 'mediana global\nda base\nMAE 1,54', 'cinza'],
  ['i', 'regressão em\nlog(inscritos)\nMAE 1,24', 'azul'],
  ['m', 'mediana do canal\n(posts anteriores)\nMAE 0,79', 'ciano'],
  ['k', 'média dos\núltimos 5 posts\nMAE 0,73', 'ciano'],
  ['mod', 'seu modelo\nMAE 0,72', 'verde'],
];
degraus.forEach(([id, txt, cor], i) => {
  d.box(id, i * 250, 360 - i * 85, 220, 100, txt, cor, {strokeWidth: id === 'mod' ? 3 : 2});
});
for (let i = 0; i < degraus.length - 1; i++) d.arrow(degraus[i][0], degraus[i + 1][0], {from: 'top', to: 'left', via: [[i * 250 + 110, 360 - (i + 1) * 85 + 50]]});

d.note('cold', 0, 500, 460, 80, 'canal sem histórico (cold start):\no degrau 2 é o melhor que dá para fazer', 'azul', {textColor: '#1971c2'});
d.note('salto', 490, 500, 330, 80, 'o maior salto vem de\nconhecer o CANAL, não o conteúdo', 'ciano', {textColor: '#0c8599'});
d.note('ganho', 850, 500, 420, 80, 'contra o MELHOR baseline: MAE só −0,8%,\nmas Spearman intra-canal −0,13 → +0,16', 'verde', {textColor: '#2f9e44'});

export default d.elements;
