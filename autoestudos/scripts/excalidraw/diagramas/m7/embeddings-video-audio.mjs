import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(230, -80, 'Do Short ao vetor: três caminhos, uma régua');

// entrada
d.box('short', 0, 170, 220, 120, 'Short B\n22 s, vertical\nframes + áudio', 'azul', {strokeWidth: 3});

// extratores
d.box('frames', 290, 10, 280, 100, 'CLIP / SigLIP por frame\n→ média dos frames\n(aula 4.4)', 'laranja');
d.box('video', 290, 170, 280, 120, 'vídeo completo\nX-CLIP · VideoMAE\nQwen3-VL-Embedding', 'laranja', {strokeWidth: 3});
d.box('audio', 290, 350, 280, 100, 'áudio mono 48 kHz\n→ CLAP\n(janelas de 10 s)', 'laranja');

d.arrow('short', 'frames', {from: 'right', to: 'left'});
d.arrow('short', 'video', {from: 'right', to: 'left'});
d.arrow('short', 'audio', {from: 'right', to: 'left'});

// redução e modelo
d.box('pca', 700, 170, 230, 120, 'PCA ajustada\nSÓ no treino\n16–32 colunas\npor bloco', 'cinza');
d.arrow('frames', 'pca', {from: 'right', to: 'top', via: [[815, 60]]});
d.arrow('video', 'pca', {from: 'right', to: 'left', label: '512 dims'});
d.arrow('audio', 'pca', {from: 'right', to: 'bottom', via: [[815, 400]]});

d.box('gbm', 1030, 170, 250, 120, 'GBM\ncamadas 1 + 2\n+ blocos novos', 'verde', {strokeWidth: 3});
d.arrow('pca', 'gbm', {from: 'right', to: 'left'});

d.box('ablacao', 1030, 350, 250, 100, 'ablação +\nbootstrap pareado:\no IC do ganho > 0?', 'amarelo');
d.arrow('gbm', 'ablacao', {from: 'bottom', to: 'top'});

// notas
d.note('n1', 0, 500, 400, 80, 'A média ignora a ordem:\nantes→depois = depois→antes.', 'vermelho', {textColor: '#e03131'});
d.note('n2', 440, 500, 420, 80, 'X-CLIP troca contexto entre frames, mas quase\nnão vê a ordem. VideoMAE vê movimento.', 'laranja', {textColor: '#e8590c'});
d.note('n3', 900, 500, 380, 80, 'Só depois da camada 2 estável.\nEsperado: +0,02 a +0,04 de Spearman.', 'verde', {textColor: '#2f9e44'});

export default d.elements;
