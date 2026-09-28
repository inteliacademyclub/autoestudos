import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(330, -90, 'Cinco jeitos de o futuro entrar no treino');

d.box('raiz', 320, 0, 590, 90, 'VAZAMENTO\ninformação que não existe no momento da previsão', 'vermelho', {strokeWidth: 3});

const tipos = [
  ['alvo', '1. DE ALVO\nviews, comentários e\ncompartilhamentos\ndo próprio post', 'sintoma: métrica boa\ndemais e uma feature\ndomina a importância'],
  ['temp', '2. TEMPORAL\nstats do canal com\nposts futuros;\ninscritos de hoje;\nalvo imaturo', 'teste: altere o futuro\ne veja se a feature\ndo passado muda'],
  ['grupo', '3. DE GRUPO\nmesmo canal no\ntreino e no teste,\nquando a meta é\ncanal novo', 'compare split por\ncanal com split\naleatório'],
  ['prep', '4. PRÉ-PROCESSAMENTO\nscaler, PCA, TF-IDF\nou encoder ajustados\nna base inteira', 'fit só no treino,\ndentro de um\nPipeline'],
  ['dup', '5. DUPLICATAS\nreupload do mesmo\nvídeo nos dois\nlados do split', 'agrupe por hash de\ntítulo + duração ou\nembedding quase igual'],
];
tipos.forEach(([id, txt, det], i) => {
  const x = i * 255;
  d.box(id, x, 180, 245, 170, txt, 'vermelho', {fontSize: 17});
  d.arrow('raiz', id, {from: 'bottom', to: 'top', cor: 'vermelho'});
  d.note(`${id}-d`, x, 400, 245, 100, det, 'verde', {textColor: '#2f9e44'});
  d.arrow(id, `${id}-d`, {from: 'bottom', to: 'top', dashed: true, cor: 'verde'});
});
d.text(0, 520, 'em verde: como detectar ou evitar', {size: 18, color: '#2f9e44'});

export default d.elements;
