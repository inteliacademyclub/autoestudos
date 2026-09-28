import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(40, -150, 'O coletor, de ponta a ponta');

// linha 1: chamadas à API (cinza = infraestrutura, azul = dado bruto)
d.box('planilha', 0, 40, 200, 100, 'planilha de\ncuradoria\n(channel_id)', 'cinza', {fontSize: 18});
d.box('uu', 260, 40, 220, 100, 'playlist de uploads\nUC… → UU…\n(0 unidades)', 'azul', {fontSize: 18});
d.box('pi', 540, 40, 300, 100, 'playlistItems.list\n50 IDs por página\npaginação: nextPageToken', 'azul', {fontSize: 18});
d.box('vl', 900, 40, 380, 100, 'videos.list em lotes de 50\nsnippet, contentDetails,\nstatistics, player', 'azul', {fontSize: 18});
d.arrow('planilha', 'uu');
d.arrow('uu', 'pi');
d.arrow('pi', 'vl', {label: 'IDs novos'});

// custos
d.text(560, 150, '1 unidade por página', {size: 16, color: '#e8590c'});
d.text(905, 150, '1 unid./50 vídeos', {size: 16, color: '#e8590c'});

// cliente com cota e retries
d.box(
  'cli',
  540,
  -150,
  740,
  80,
  'Cliente: conta unidades por dia (horário do Pacífico), para antes de estourar,\nrefaz erros 5xx/429 com backoff (tenacity) e NÃO insiste em quotaExceeded',
  'cinza',
  {fill: 'solid', bg: '#f8f9fa', fontSize: 16},
);
d.arrow('cli', 'pi', {from: 'bottom', to: 'top', dashed: true, cor: 'cinza', via: [[690, -40]]});
d.arrow('cli', 'vl', {from: 'bottom', to: 'top', dashed: true, cor: 'cinza', via: [[1090, -40]]});

// linha 2: parse
d.box(
  'parse',
  560,
  230,
  720,
  150,
  'parse_video(item, coletado_em)\nduração ISO 8601 → segundos (isodate)\nShort provável: ≤ 3 min (60 s antes de 15/10/2024) e não horizontal\nlikeCount ausente → nulo  ·  idade no dia da coleta',
  'laranja',
  {fontSize: 18},
);
d.arrowXY(1090, 146, 1090, 224);

// linha 3: armazenamento
d.box(
  'duck',
  560,
  460,
  420,
  140,
  'DuckDB (idempotente)\nvideos: upsert por video_id\nsnapshots: (video_id, data da coleta)',
  'cinza',
  {strokeWidth: 3, fontSize: 18},
);
d.box('pq', 1040, 460, 240, 140, 'Parquet rotulado\n1 linha por Short\n1º snapshot com\n≥ 30 dias', 'verde', {fontSize: 18});
d.arrowXY(770, 386, 770, 454);
d.arrow('duck', 'pq');

// coleta incremental
d.note(
  'incr',
  0,
  230,
  480,
  170,
  'Coleta incremental\nIDs já na base = "conhecidos".\nA paginação para quando uma página\ninteira já é conhecida.\nShorts jovens ganham um snapshot por dia\naté passarem dos 30 dias.',
  'ciano',
  {textColor: '#0c8599', fontSize: 16},
);
d.arrow('duck', 'incr', {from: 'left', to: 'bottom', via: [[240, 530]], dashed: true, cor: 'ciano', label: 'conhecidos'});

export default d.elements;
