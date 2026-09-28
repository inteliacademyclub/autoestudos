import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(250, -90, 'Do vídeo às colunas: o pipeline multimodal de referência');

// entrada
d.box('short', -20, 245, 190, 120, 'Short\n(video_id ou\nMP4 da marca)', 'azul');
d.box('midia', 210, 245, 190, 120, '4.2 · mídia\nMP4 em 360p\n+ thumbnail', 'laranja');
d.arrow('short', 'midia');

// frames amostrados
d.box('frames', 450, 80, 200, 120, '4.3 · frames\n3 no gancho\n+ 5 uniformes', 'laranja');
d.arrow('midia', 'frames', {from: 'top', to: 'left', via: [[305, 140]]});

// cinco ramos de extração
const ramos = [
  ['emb', 0, '4.4 · embeddings visuais\nSigLIP 2 + sondas'],
  ['sinais', 105, '4.3 · cortes, movimento,\nbrilho e cor (OpenCV)'],
  ['det', 210, '4.6 · detectores leves\nrosto e texto na tela'],
  ['aud', 315, '4.5 · áudio e fala\nWhisper + librosa'],
  ['vlm', 420, '4.7 · VLM com rubrica\natributos em JSON'],
];
for (const [id, y, txt] of ramos) d.box(id, 710, y, 280, 80, txt, 'laranja');
d.arrow('frames', 'emb', {from: 'right', to: 'left'});
d.arrow('frames', 'sinais', {from: 'right', to: 'left'});
d.arrow('frames', 'det', {from: 'right', to: 'left'});
d.arrow('midia', 'aud', {from: 'right', to: 'left', label: 'trilha de áudio'});
d.arrow('midia', 'vlm', {from: 'bottom', to: 'left', via: [[305, 460]], label: 'vídeo inteiro (ou URL)'});

// fusão e modelo
d.box('canal', 1060, 0, 240, 100, 'canal, tempo e texto\n(módulo 3)', 'ciano');
d.box('fusao', 1060, 170, 240, 130, '4.8 · fusão\numa linha por vídeo,\numa coluna por sinal', 'azul', {strokeWidth: 3});
d.box('gbm', 1060, 380, 240, 110, 'GBM\nLightGBM/CatBoost\nprevisão + SHAP', 'verde', {strokeWidth: 3});
for (const [id] of ramos) d.arrow(id, 'fusao', {from: 'right', to: 'left'});
d.arrow('canal', 'fusao', {from: 'bottom', to: 'top'});
d.arrow('fusao', 'gbm', {from: 'bottom', to: 'top'});

// cache
d.note('cache', 210, 540, 780, 70, 'cache/<etapa>_v1/<video_id>.json em disco: cada etapa roda UMA vez por vídeo;\nmudou a lógica? suba a versão da etapa, não apague o cache', 'cinza');
d.note('congelado', 1060, 530, 240, 90, 'encoders CONGELADOS:\nnada de rede neural\ntreinada por você', 'verde', {textColor: '#2f9e44'});

export default d.elements;
