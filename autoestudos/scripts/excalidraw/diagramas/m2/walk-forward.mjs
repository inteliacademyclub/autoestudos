import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(200, -100, 'Walk-forward com gap, e onde fica a calibração');

const X0 = 150; // início do eixo do tempo
const W = 1050; // largura do eixo
const px = (f) => X0 + f * W; // f = fração do período
const H = 44;

function barra(id, a, b, y, texto, cor, bg, dashed = false) {
  d.box(id, px(a), y, px(b) - px(a) - 4, H, texto, cor, {fill: 'solid', bg, round: false, dashed, fontSize: 16});
}

const folds = [0.6, 0.7, 0.8, 0.9];
folds.forEach((ini, k) => {
  const y = k * 64;
  d.text(0, y + 10, `fold ${k + 1}`, {size: 20});
  barra(`tr${k}`, 0, ini - 0.04, y, k === 0 ? 'treino (janela expansiva)' : 'treino', 'verde', '#b2f2bb');
  barra(`gap${k}`, ini - 0.04, ini, y, '', 'cinza', '#f1f3f5', true);
  barra(`te${k}`, ini, ini + 0.1, y, 'teste', 'amarelo', '#ffec99');
});

// eixo
d.line([[X0, 275], [X0 + W, 275]], {strokeWidth: 2});
d.arrowXY(X0 + W - 10, 275, X0 + W + 40, 275);
d.text(X0, 285, 'jan/2024', {size: 16, color: '#495057'});
d.text(px(0.6) - 40, 285, 'início do teste', {size: 16, color: '#495057'});
d.text(X0 + W - 60, 285, 'hoje', {size: 16, color: '#495057'});

d.note('gapnota', px(0.35), 330, 470, 70, 'gap (cinza) = 30 dias: o alvo dos posts\nmais recentes ainda não amadureceu', 'cinza', {textColor: '#495057'});
d.arrow('gapnota', 'gap3', {from: 'right', to: 'bottom', via: [[px(0.88), 365]], dashed: true, cor: 'cinza'});

// entrega final: treino | calibração | teste
const y = 440;
d.text(0, y + 10, 'entrega', {size: 20});
barra('ftr', 0, 0.7, y, 'treino do modelo final', 'verde', '#b2f2bb');
barra('fcal', 0.7, 0.85, y, 'calibração', 'rosa', '#fcc2d7');
barra('fte', 0.85, 1.0, y, 'teste final', 'amarelo', '#ffec99');
d.note('calnota', px(0.4), 520, 640, 70, 'a calibração (módulo 5, conformal) fica ENTRE o treino e o\nteste, também por data: nunca sorteada aleatoriamente', 'rosa', {textColor: '#c2255c'});

export default d.elements;
