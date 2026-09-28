import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(330, -80, 'Três caminhos do texto até as colunas do modelo');

d.box('txt', 0, 165, 210, 120, 'título\ndescrição\ntags', 'azul', {strokeWidth: 3});

d.box('m1', 290, 10, 340, 90, 'features manuais\n(#, emoji, ?, CTA, CAIXA ALTA)', 'laranja', {fontSize: 18});
d.box('m2', 290, 180, 340, 90, 'TF-IDF\n(vocabulário aprendido no treino)', 'laranja', {fontSize: 18});
d.box('m3', 290, 350, 340, 100, 'embedding multilíngue\n(MiniLM, 384 dimensões)\ncache por video_id + hash', 'laranja', {fontSize: 18});

d.box('o1', 700, 10, 250, 90, '9 colunas\ninterpretáveis', 'cinza', {fontSize: 18});
d.box('o2', 700, 180, 250, 90, 'TruncatedSVD\n→ 16 colunas', 'cinza', {fontSize: 18});
d.box('o3', 700, 355, 250, 90, 'PCA\n→ 16 colunas', 'cinza', {fontSize: 18});

d.box('modelo', 1030, 160, 250, 130, 'Pipeline:\nColumnTransformer\n+ LightGBM', 'verde', {strokeWidth: 3});

d.arrow('txt', 'm1', {from: 'right', to: 'left'});
d.arrow('txt', 'm2', {from: 'right', to: 'left'});
d.arrow('txt', 'm3', {from: 'right', to: 'left'});
d.arrow('m1', 'o1');
d.arrow('m2', 'o2');
d.arrow('m3', 'o3');
d.arrow('o1', 'modelo', {from: 'right', to: 'left'});
d.arrow('o2', 'modelo', {from: 'right', to: 'left'});
d.arrow('o3', 'modelo', {from: 'right', to: 'left'});

d.note('n-vaz', 0, 500, 620, 80, 'TF-IDF, SVD e PCA são ajustados SÓ no treino,\ndentro do Pipeline. Ajustar em treino + teste é vazamento.', 'vermelho', {textColor: '#e03131', fontSize: 18});
d.note('n-shap', 660, 500, 620, 80, 'Uma dimensão de embedding não tem significado.\nNo SHAP, some as 16 colunas num grupo "texto".', 'amarelo', {textColor: '#f08c00', fontSize: 18});

export default d.elements;
