import {Diagram} from '../../dsl.mjs';

// Linha do tempo de um Short de 22 s (como o B da Lumina): x = X0 + ESC * t
const X0 = 170;
const ESC = 50;
const x = (t) => X0 + ESC * t;
const Y = 250; // altura da linha do tempo

const d = new Diagram();
d.title(300, -100, 'Onde olhar num Short de 22 s: 8 frames, não 660');

// thumbnail, fora da linha do tempo
d.box('thumb', -40, 60, 150, 150, 'thumbnail\n(API, 4.2)', 'azul');

// zona do gancho
d.box('gancho', x(0), 20, ESC * 3, 300, '', 'laranja', {bg: '#fff4e6', fill: 'solid', dashed: true, round: false});
d.text(x(0) + 12, 28, 'gancho\n0–3 s', {size: 18, color: '#e8590c'});

// linha do tempo
d.line([[x(0), Y], [x(22), Y]], {strokeWidth: 3});
d.arrowXY(x(22), Y, x(22) + 40, Y, {strokeWidth: 3});
for (const t of [0, 3, 5, 10, 15, 20, 22]) {
  d.line([[x(t), Y - 8], [x(t), Y + 8]]);
  d.text(x(t) - 10, Y + 14, `${t}s`, {size: 16, color: '#495057'});
}

// frames amostrados: 3 no gancho + 5 uniformes no resto
const noGancho = [0.5, 1.5, 2.5];
const uniformes = [4.9, 8.7, 12.5, 16.3, 20.1];
[...noGancho, ...uniformes].forEach((t, i) => {
  const cor = i < 3 ? 'laranja' : 'cinza';
  d.box(`f${i}`, x(t) - 14, 120, 28, 50, '', cor, {fill: 'solid', bg: i < 3 ? '#ffd8a8' : '#e9ecef'});
  d.arrowXY(x(t), 174, x(t), Y - 6, {strokeWidth: 1});
});
d.text(x(4.9) - 10, 88, '5 uniformes no resto do vídeo (centro de cada fatia)', {size: 18, color: '#495057'});

// cortes (exemplo)
const cortes = [1.2, 2.4, 4.0, 5.6, 7.2, 8.8, 10.4, 13.0, 16.0, 19.0];
for (const c of cortes) d.line([[x(c), Y + 34], [x(c), Y + 74]], {dashed: true, cor: 'vermelho', strokeWidth: 2});
d.text(x(4.3), Y + 84, 'cortes detectados (PySceneDetect)', {size: 18, color: '#e03131'});

// saídas
d.box('out_g', x(0) - 40, 420, 420, 130, 'colunas do GANCHO\nbrilho, cor e movimento no 1º frame,\ncortes_no_gancho, s_ate_primeiro_corte,\nemb_gancho (4.4)', 'laranja');
d.box('out_v', x(8.5), 420, 620, 130, 'colunas do VÍDEO TODO\nmédias de brilho, contraste, saturação, colorfulness;\ncortes_por_s, duração média do plano,\nmovimento médio, variância entre frames', 'cinza');
d.arrow('gancho', 'out_g', {from: 'bottom', to: 'top'});
d.arrowXY(x(15), Y + 84, x(15), 414);

d.note('flow', x(15.5) - 20, 20, 300, 80, 'em cada instante, lê também o\nframe seguinte (+33 ms) para\no optical flow de Farnebäck', 'cinza');

export default d.elements;
