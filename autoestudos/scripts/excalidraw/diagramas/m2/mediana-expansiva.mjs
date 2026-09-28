import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(250, -90, 'Baseline do canal: só o que veio antes');

// linha do tempo de UM canal
d.line([[0, 200], [1180, 200]], {strokeWidth: 3});
d.arrowXY(1170, 200, 1230, 200, {strokeWidth: 3});
d.text(1150, 222, 'tempo', {size: 18, color: '#495057'});

const xs = Array.from({length: 10}, (_, i) => 60 + i * 115);
xs.forEach((x, i) => {
  const cor = i < 6 ? 'ciano' : i === 6 ? 'verde' : 'vermelho';
  d.ellipse(`p${i}`, x - 20, 180, 40, 40, '', cor, {fill: 'solid', strokeWidth: i === 6 ? 3 : 2});
});
d.text(782, 232, 'post a prever', {size: 18, color: '#2f9e44'});

// janela expansiva (acima)
d.box('exp', 20, 20, 670, 90, 'mediana expansiva: TODOS os posts anteriores\ngroupby("canal") → shift(1) → expanding().median()', 'ciano');
d.arrow('exp', 'p6', {from: 'right', to: 'top', via: [[750, 65]]});

// últimos k (abaixo)
d.box('ult', 355, 290, 335, 90, 'média dos últimos k = 3\nshift(1) → rolling(3).mean()', 'ciano');
d.arrow('ult', 'p6', {from: 'right', to: 'bottom', via: [[750, 335]]});

// futuro proibido
d.box('fut', 800, 20, 400, 90, 'o próprio post e os futuros\nNUNCA entram na conta', 'vermelho');
d.line([[800, 150], [1200, 150]], {dashed: true, cor: 'vermelho'});

// passos
d.note('n1', 0, 430, 380, 80, 'groupby("canal"): cada canal\ntem a sua própria régua', 'cinza');
d.note('n2', 420, 430, 380, 80, 'shift(1): tira o post atual\n(sem ele, a feature vira o alvo)', 'vermelho', {textColor: '#e03131'});
d.note('n3', 840, 430, 380, 80, 'canal com < 3 posts anteriores:\ncai no baseline de cold start', 'azul', {textColor: '#1971c2'});

export default d.elements;
