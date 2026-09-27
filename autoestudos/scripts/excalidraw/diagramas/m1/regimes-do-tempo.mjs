import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(250, 10, 'As regras de contagem mudam no meio da sua base');

// escala: out/2024 (x=0) a out/2026 (x=1200); ~50 px por mês
const X = (ano, mes, dia = 1) => ((ano - 2024) * 12 + (mes - 10) + (dia - 1) / 30) * 50;
const y = 200;

// faixas de regime de VIEWS
d.box('r0', X(2024, 10, 15), y - 60, X(2025, 3, 31) - X(2024, 10, 15), 40, 'R0: view após alguns segundos', 'cinza', {fill: 'solid', fontSize: 16});
d.box('r1', X(2025, 3, 31), y - 60, X(2026, 8, 24) - X(2025, 3, 31), 40, 'R1: todo play ou replay de Short conta como view', 'azul', {fill: 'solid', fontSize: 16});
d.box('r2', X(2026, 8, 24), y - 60, X(2026, 10, 23) - X(2026, 8, 24), 40, 'R2', 'laranja', {fill: 'solid', fontSize: 16, align: 'left'});
d.text(-10, y - 100, 'VIEWS', {size: 18, color: '#e03131'});

// faixa de LIKES
d.box('likes', X(2024, 10, 15), y + 110, X(2026, 10, 23) - X(2024, 10, 15), 40, 'LIKES: nenhuma mudança de contagem anunciada no período → alvo mais estável', 'verde', {fill: 'solid', fontSize: 16});

// eixo
d.line([[-20, y], [X(2026, 10, 23) + 30, y]], {strokeWidth: 3});
const marcos = [
  {x: X(2024, 10, 15), txt: '15/10/2024\nShorts de até\n3 min', cor: 'roxo', dy: 20},
  {x: X(2025, 3, 31), txt: '31/03/2025\nreplays contam', cor: 'azul', dy: 20},
  {x: X(2026, 8, 24), txt: '24/08/2026\nview no 1º frame', cor: 'laranja', dy: 20, esq: true},
];
marcos.forEach((m, i) => {
  d.ellipse(`m${i}`, m.x - 9, y - 9, 18, 18, '', m.cor, {fill: 'solid'});
  d.text(m.esq ? m.x - 160 : m.x - 50, y + m.dy, m.txt, {size: 16, color: '#1e1e1e'});
});

// hoje e corte dos 30 dias (zoom à direita)
const hoje = X(2026, 9, 27);
d.line([[hoje, y - 110], [hoje, y + 170]], {dashed: true, cor: 'roxo', strokeWidth: 2});
d.text(hoje + 6, y - 140, 'hoje: 27/09/2026', {size: 16, color: '#6741d9'});

// notas
d.note(
  'n1',
  0,
  y + 190,
  560,
  110,
  'Um Short publicado em mar/2025 tem views contadas com\nDUAS regras dentro dos mesmos 30 dias. Views não são\ncomparáveis entre R0, R1 e R2: não use como alvo.',
  'vermelho',
  {textColor: '#e03131', fontSize: 16},
);
d.note(
  'n2',
  600,
  y + 190,
  620,
  110,
  'Inscritos e estatísticas do canal são uma FOTO do dia da coleta,\nnão do dia da publicação. Um Short de 2025 "vê" os inscritos\nde set/2026: isso é informação do futuro.',
  'vermelho',
  {textColor: '#e03131', fontSize: 16},
);

export default d.elements;
