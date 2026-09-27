import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(300, -80, 'O momento da previsão');

// linha do tempo
d.line([[0, 150], [1250, 150]], {strokeWidth: 3});
d.arrowXY(1240, 150, 1300, 150, {strokeWidth: 3});

d.ellipse('t0', 250, 130, 40, 40, '', 'roxo', {fill: 'solid'});
d.text(245, 185, 'previsão aqui', {size: 20, color: '#6741d9'});
d.ellipse('t1', 600, 130, 40, 40, '', 'azul', {fill: 'solid'});
d.text(555, 185, 'publicação', {size: 20, color: '#1971c2'});
d.ellipse('t2', 1110, 130, 40, 40, '', 'verde', {fill: 'solid'});
d.text(1070, 185, '≥ 30 dias depois', {size: 20, color: '#2f9e44'});

d.box('antes', 0, -10, 420, 110, 'O QUE VOCÊ SABE\nhistórico do canal, inscritos, vídeo,\nlegenda, horário planejado, setor', 'azul');
d.box('depois', 720, -10, 520, 110, 'O QUE SÓ EXISTE DEPOIS\nviews, curtidas, comentários, compartilhamentos,\nposts futuros do canal, inscritos ganhos', 'vermelho');

d.box('features', 0, 260, 420, 90, 'pode virar FEATURE', 'azul', {fill: 'solid', bg: '#e7f5ff'});
d.box('alvo', 720, 260, 520, 90, 'só pode ser ALVO (nunca feature)', 'vermelho', {fill: 'solid', bg: '#fff5f5'});
d.arrow('antes', 'features', {from: 'bottom', to: 'top', via: [[210, 230]]});
d.arrow('depois', 'alvo', {from: 'bottom', to: 'top', via: [[980, 230]]});

d.note('regra', 330, 390, 560, 70, 'Se uma coluna não existe no momento da previsão,\nusá-la é VAZAMENTO — mesmo que melhore a métrica.', 'vermelho', {textColor: '#e03131'});

export default d.elements;
