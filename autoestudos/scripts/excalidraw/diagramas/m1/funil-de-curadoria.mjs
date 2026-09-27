import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(330, -80, 'Do "canal que eu conheço" à planilha');

// 1. fontes de candidatos
d.box(
  'fontes',
  0,
  0,
  300,
  250,
  'CANDIDATOS\n\nlistas manuais (marcas,\nagências, rankings)\n@ citados em descrições\ne colabs\ncanais em destaque\n(channelSections)\nsearch.list: pouco',
  'azul',
  {fontSize: 18},
);

// 2. resolver
d.box('resolver', 360, 50, 260, 150, 'RESOLVER\n@handle → channel_id\nchannels.list(forHandle)\n1 unidade por handle', 'cinza', {fontSize: 18});

// 3. filtros
d.box(
  'filtros',
  680,
  20,
  280,
  210,
  'FILTRAR\nidioma/país do recorte\npostou nos últimos 90 dias\n≥ 30 Shorts no histórico\ncurtidas visíveis\nnão é reupload/compilação',
  'laranja',
  {fontSize: 18},
);

// 4. estratificar
d.box(
  'estratos',
  1020,
  30,
  260,
  190,
  'ESTRATIFICAR\nsetor × faixa de\ninscritos × tipo\n(marca oficial\nou criador)',
  'ciano',
  {fontSize: 18},
);

d.arrow('fontes', 'resolver');
d.arrow('resolver', 'filtros');
d.arrow('filtros', 'estratos');

// 5. planilha
d.box(
  'planilha',
  340,
  330,
  620,
  110,
  'PLANILHA DE CURADORIA  (60+ canais, ≥ 2 setores)\nchannel_id · handle · setor · tipo · faixa · país · idioma\nincluído? · motivo · fonte · data de verificação',
  'verde',
  {strokeWidth: 3, fontSize: 18},
);
d.arrow('estratos', 'planilha', {from: 'bottom', to: 'right', via: [[1150, 385]]});

// alertas
d.note(
  'vies',
  0,
  330,
  300,
  150,
  'Viés de sobrevivência:\ncanais que você "conhece"\nsão os que deram certo.\nInclua canais medianos\ne pequenos de propósito.',
  'vermelho',
  {textColor: '#e03131', fontSize: 16},
);
d.note(
  'motivo',
  1000,
  440,
  280,
  150,
  'Registre também os\nEXCLUÍDOS e o motivo:\né o que torna a seleção\nauditável no data card.',
  'amarelo',
  {textColor: '#f08c00', fontSize: 16},
);

export default d.elements;
