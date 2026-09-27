import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(240, -90, 'Três detectores baratos, um resumo por vídeo');

d.box('frames', 0, 110, 210, 180, 'keyframes\n(aula 4.3)\n3 no gancho:\n0,5 · 1,5 · 2,5 s\n+ 5 no resto', 'azul');

d.box('face', 290, 0, 340, 100, 'MediaPipe FaceDetector\nrosto? quantos? área', 'laranja');
d.box('ocr', 290, 150, 340, 100, 'PaddleOCR (PP-OCRv6)\ntexto, área, no gancho?', 'laranja');
d.box('owl', 290, 300, 340, 100, 'OWLv2 (vocabulário aberto)\n"a lipstick", "a car", "a dress"', 'laranja');

d.box('agg', 710, 110, 300, 180, 'AGREGAÇÃO det_*\n% de frames com rosto\nárea máx. do rosto\nárea média de texto\nscore máx. por objeto', 'azul');

d.box('vlm', 1070, 0, 220, 110, 'VLM (aula 4.7)\ntem_rosto,\ntexto_na_tela', 'laranja', {dashed: true});
d.box('kappa', 1070, 190, 220, 110, 'concordância\ndetector × VLM\n(kappa)', 'amarelo');

d.arrow('frames', 'face', {from: 'right', to: 'left', via: [[250, 200], [250, 50]]});
d.arrow('frames', 'ocr', {from: 'right', to: 'left'});
d.arrow('frames', 'owl', {from: 'right', to: 'left', via: [[250, 200], [250, 350]]});
d.arrow('face', 'agg', {from: 'right', to: 'left', via: [[670, 50], [670, 200]]});
d.arrow('ocr', 'agg', {from: 'right', to: 'left'});
d.arrow('owl', 'agg', {from: 'right', to: 'left', via: [[670, 350], [670, 200]]});
d.arrow('agg', 'kappa', {from: 'right', to: 'left', via: [[1040, 200], [1040, 245]]});
d.arrow('vlm', 'kappa', {from: 'bottom', to: 'top', dashed: true});

d.note('lic', 710, 360, 580, 80,
  'Ultralytics YOLO é AGPL-3.0: prefira RT-DETR ou OWLv2\n(Apache-2.0) se o código puder virar produto fechado.',
  'vermelho', {textColor: '#e03131', fontSize: 18});

export default d.elements;
