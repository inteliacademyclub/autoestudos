import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(120, -110, 'Spearman global vs. intra-canal: a mesma nuvem, duas perguntas');

function eixos(x0, titulo) {
  d.text(x0, -40, titulo, {size: 22});
  d.line([[x0 + 40, 480], [x0 + 540, 480]], {strokeWidth: 2});
  d.line([[x0 + 40, 480], [x0 + 40, 20]], {strokeWidth: 2});
  d.text(x0 + 430, 490, 'previsão →', {size: 18, color: '#495057'});
  d.text(x0 - 10, 0, 'real ↑', {size: 18, color: '#495057'});
}

function ponto(id, x, y, cor) {
  d.ellipse(id, x - 7, y - 7, 14, 14, '', cor, {fill: 'solid'});
}

function grupo(id, cx, cy, rotulo) {
  d.ellipse(id, cx - 70, cy - 75, 140, 150, '', 'ciano', {dashed: true, bg: 'transparent'});
  d.text(cx - 50, cy + 80, rotulo, {size: 16, color: '#0c8599'});
}

// painel 1: só o canal -> todos os posts de um canal recebem a MESMA previsão
eixos(0, 'A. modelo que só conhece o canal');
const canais = [[150, 350, 'canal pequeno'], [300, 225, 'canal médio'], [450, 100, 'canal grande']];
canais.forEach(([cx, cy, r], c) => {
  grupo(`g1-${c}`, cx, cy, r);
  [-50, -25, 0, 25, 50].forEach((dy, k) => ponto(`a${c}-${k}`, cx, cy + dy, 'cinza'));
});
d.note('n1', 0, 540, 560, 80, 'Spearman global alto (os canais estão em ordem)\nintra-canal = 0: empate dentro de cada canal', 'vermelho', {textColor: '#e03131'});

// painel 2: vê o conteúdo -> dentro do canal, a ordem também aparece
const X2 = 680;
eixos(X2, 'B. modelo que também vê o conteúdo');
canais.forEach(([cx, cy, r], c) => {
  grupo(`g2-${c}`, X2 + cx, cy, r);
  [[-40, 45], [-20, 10], [0, 25], [20, -20], [40, -45]].forEach(([dx, dy], k) =>
    ponto(`b${c}-${k}`, X2 + cx + dx, cy + dy, 'verde'));
});
d.note('n2', X2, 540, 560, 80, 'Spearman global quase igual...\nmas intra-canal > 0: agora ele sabe dizer A ou B', 'verde', {textColor: '#2f9e44'});

export default d.elements;
