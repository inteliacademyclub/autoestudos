import {Diagram} from '../../dsl.mjs';

// Eixo de curtidas em escala log: x(v) = X0 + (log10(v) - log10(500)) * PX
const X0 = 200;
const PX = 797;
const x = (v) => X0 + (Math.log10(v) - Math.log10(500)) * PX;

const d = new Diagram();
d.title(250, -110, 'Lumina: dois intervalos de 80% que se sobrepõem');

// mediana do canal (linha tracejada)
d.line([[x(2300), -40], [x(2300), 250]], {dashed: true, cor: 'ciano'});
d.text(x(2300) - 120, -75, 'Short típico do canal: 2.300', {size: 18, color: '#0c8599'});

// zona de sobreposição
d.box('sobre', x(2300), 20, x(2800) - x(2300), 170, '', 'amarelo', {dashed: true, fill: 'solid', bg: '#fff9db'});

// Short A
d.text(0, 45, 'Short A', {size: 22});
d.box('barA', x(780), 40, x(2800) - x(780), 40, '', 'verde');
d.ellipse('pA', x(1480) - 12, 48, 24, 24, '', 'verde', {fill: 'solid', bg: '#2f9e44'});
d.text(x(780) - 20, 88, '780', {size: 18});
d.text(x(1480) - 25, 88, '1.480', {size: 18, color: '#2f9e44'});
d.text(x(2800) + 10, 88, '2.800', {size: 18});

// Short B
d.text(0, 135, 'Short B', {size: 22});
d.box('barB', x(2300), 130, x(8300) - x(2300), 40, '', 'verde', {fill: 'cross-hatch'});
d.ellipse('pB', x(4380) - 12, 138, 24, 24, '', 'verde', {fill: 'solid', bg: '#2f9e44'});
d.text(x(2300) - 75, 178, '2.300', {size: 18});
d.text(x(4380) - 25, 178, '4.380', {size: 18, color: '#2f9e44'});
d.text(x(8300) - 25, 178, '8.300', {size: 18});

// eixo
d.line([[X0, 250], [x(12000), 250]], {strokeWidth: 2});
[500, 1000, 2000, 5000, 10000].forEach((v) => {
  d.line([[x(v), 242], [x(v), 258]]);
  const rot = v >= 1000 ? `${v / 1000} mil` : String(v);
  d.text(x(v) - rot.length * 5, 266, rot, {size: 18, color: '#495057'});
});
d.text(x(12000) - 250, 300, 'curtidas em 30 dias (escala log)', {size: 18, color: '#495057'});

// notas
d.note('n1', 0, 350, 560, 100,
  'Em log, cada intervalo é simétrico.\nEm curtidas, a cauda de cima é mais longa:\nB vai de −2.080 a +3.920 em torno de 4.380.', 'verde', {textColor: '#2f9e44', fontSize: 18});
d.note('n2', 620, 350, 640, 100,
  'Os intervalos se tocam entre 2.300 e 2.800.\nMesmo assim, P(B > A) ≈ 0,94 com erros independentes:\nsobreposição não significa empate.', 'amarelo', {textColor: '#e67700', fontSize: 18});

export default d.elements;
