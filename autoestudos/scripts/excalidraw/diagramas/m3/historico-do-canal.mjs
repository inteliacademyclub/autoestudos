import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(300, 20, 'Features do canal: só o que veio antes');

const x = (i) => 40 + i * 54;
const Y = 240;
const ATUAL = 16;
const LACUNA = 15;

// linha do tempo
d.line([[0, Y], [1230, Y]], {strokeWidth: 3});
d.arrowXY(1220, Y, 1280, Y, {strokeWidth: 3});
d.text(1200, Y + 20, 'tempo', {size: 18, color: '#495057'});

for (let i = 0; i < 22; i++) {
  if (i === ATUAL) {
    d.ellipse(`p${i}`, x(i) - 20, Y - 20, 40, 40, '', 'roxo', {fill: 'solid', strokeWidth: 3});
  } else {
    const cor = i < LACUNA ? 'ciano' : i === LACUNA ? 'cinza' : 'vermelho';
    d.ellipse(`p${i}`, x(i) - 13, Y - 13, 26, 26, '', cor, {fill: 'solid'});
  }
}

// janelas
const colchete = (a, b, y, rot) => {
  d.line([[x(a) - 14, y + 12], [x(a) - 14, y], [x(b) + 14, y], [x(b) + 14, y + 12]], {cor: 'ciano', strokeWidth: 2});
  d.text(x(a) - 14, y - 28, rot, {size: 17, color: '#0c8599'});
};
colchete(0, LACUNA - 1, 120, 'todo o passado (expanding) e últimos 20 (rolling)');
colchete(LACUNA - 5, LACUNA - 1, 180, 'últimos 5');

d.text(x(LACUNA) - 24, 192, 'lacuna', {size: 16, color: '#495057'});
d.text(x(ATUAL + 1) - 10, 170, 'futuro: nunca entra', {size: 17, color: '#e03131'});
d.text(x(ATUAL) - 70, Y + 30, 'post a prever\n(published_at = t)', {size: 17, color: '#6741d9', align: 'center'});

// famílias de features
d.box('f1', 0, 340, 390, 100, 'TODO o passado (expanding)\nhist_mediana, hist_media,\nhist_desvio, hist_n', 'ciano', {fontSize: 18});
d.box('f2', 430, 340, 390, 100, 'janelas recentes (rolling)\nhist_med5, hist_med20,\ntendência = med5 − med20', 'ciano', {fontSize: 18});
d.box('f3', 860, 340, 400, 100, 'cadência e calendário\ndias_desde_ultimo, posts_30d,\nhora local, feriado, idade do canal', 'azul', {fontSize: 18});

d.note('regra', 0, 480, 1260, 70, 'shift(1) ou searchsorted: o próprio post e os posts futuros nunca entram na conta.\nTeste: embaralhar o alvo do futuro não pode mudar nenhuma feature do passado.', 'vermelho', {textColor: '#e03131', fontSize: 18});

export default d.elements;
