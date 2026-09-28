import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(230, -90, 'Early fusion: um parquet por bloco, um join por video_id');

const blocos = [
  ['meta', 'meta_  (duração, hora)', 'azul'],
  ['canal', 'canal_  (histórico)', 'ciano'],
  ['txt', 'txt_  (título, legenda)', 'azul'],
  ['vis', 'vis_  (embeddings)', 'laranja'],
  ['aud', 'aud_  (fala, energia)', 'laranja'],
  ['det', 'det_  (rosto, texto)', 'laranja'],
  ['vlm', 'vlm_  (rubrica)', 'laranja'],
];
blocos.forEach(([id, txt, cor], i) => d.box(id, 0, i * 70, 260, 52, txt, cor, {fontSize: 18}));

d.box('join', 350, 150, 230, 150, 'left join\npor video_id\n+ flag midia_ok\n(diagnóstico)', 'cinza', {strokeWidth: 3});
blocos.forEach(([id], i) => d.arrow(id, 'join', {from: 'right', to: 'left', via: [[305, i * 70 + 26], [305, 225]]}));

d.box('split', 660, 150, 220, 150, 'split\ntemporal\ntreino | teste', 'cinza');
d.box('fit', 960, 60, 320, 130, 'ajuste SÓ no treino\nPCA dos embeddings\nKMeans dos descritores', 'verde');
d.box('gbm', 960, 260, 320, 130, 'LightGBM\nNaN = mídia ausente\n(o GBM decide o lado)', 'verde', {strokeWidth: 3});

d.arrow('join', 'split');
d.arrow('split', 'fit', {from: 'right', to: 'left', via: [[920, 225], [920, 125]]});
d.arrow('fit', 'gbm', {from: 'bottom', to: 'top'});

d.note('pref', 350, 400, 930, 70,
  'O prefixo diz de onde veio cada coluna: a ablação vira "selecione por prefixo",\ne o SHAP pode ser somado por bloco. IDs (id_canal) e datas ficam SEM prefixo de feature.',
  'cinza', {textColor: '#495057', fontSize: 18});

export default d.elements;
