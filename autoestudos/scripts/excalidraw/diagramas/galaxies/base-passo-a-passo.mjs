import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(360, -70, 'Montando a sua base em 7 passos');

const passos = [
  ['p1', 'Chave da API\n(Google Cloud)', 'cinza'],
  ['p2', 'Curadoria\n60+ canais', 'azul'],
  ['p3', 'Coletor\nplaylist → videos', 'azul'],
  ['p4', 'Filtros\nShorts, ≥30 dias', 'ciano'],
  ['p5', 'Parquet\n+ collected_at', 'verde'],
  ['p6', 'Atualização\ndas estatísticas', 'amarelo'],
  ['p7', 'Data card', 'roxo'],
];
passos.forEach(([id, txt, cor], i) => {
  const row = i < 4 ? 0 : 1;
  const col = i < 4 ? i : 6 - i;
  const x = col * 300 + (row ? 150 : 0);
  const y = row * 200;
  d.box(id, x, y, 230, 100, txt, cor);
  d.badge(`b${id}`, x + 10, y + 10, i + 1, cor);
});
d.arrow('p1', 'p2');
d.arrow('p2', 'p3');
d.arrow('p3', 'p4');
d.arrow('p4', 'p5', {from: 'bottom', to: 'top'});
d.arrow('p5', 'p6');
d.arrow('p6', 'p7');
d.arrow('p6', 'p3', {from: 'top', to: 'bottom', dashed: true, cor: 'laranja', label: 'todo dia, até a cota'});

d.note('n', 0, 340, 1130, 60, 'Comece no dia 1: a cota é DIÁRIA (10.000 unidades). Pela playlist de uploads, 50 vídeos custam ~1 unidade.', 'vermelho', {textColor: '#e03131', fontSize: 18});

export default d.elements;
