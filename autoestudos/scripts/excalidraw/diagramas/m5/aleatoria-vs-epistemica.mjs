import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(300, -80, 'Duas fontes de incerteza, dois remédios');

// coluna aleatória
d.box('ale', 0, 0, 540, 90, 'INCERTEZA ALEATÓRIA\n(ruído do mundo)', 'cinza', {strokeWidth: 3});
d.box('ale-ex', 0, 130, 540, 120,
  'O mesmo Short, publicado "de novo",\nteria outro resultado: quem viu primeiro,\no que o algoritmo testou, o que mais saiu no dia.', 'cinza', {fontSize: 18});
d.box('ale-dados', 0, 290, 540, 80, 'Mais dados NÃO a reduzem:\nela é propriedade do fenômeno.', 'cinza', {fontSize: 18});
d.arrow('ale', 'ale-ex');
d.arrow('ale-ex', 'ale-dados');

// coluna epistêmica
d.box('epi', 700, 0, 560, 90, 'INCERTEZA EPISTÊMICA\n(o que o modelo não viu)', 'vermelho', {strokeWidth: 3});
d.box('epi-ex', 700, 130, 560, 120,
  'Canal com 4 posts, setor raro,\nestilo visual que não existe no treino,\ndata muito depois do fim dos dados.', 'vermelho', {fontSize: 18});
d.box('epi-dados', 700, 290, 560, 80, 'Mais dados parecidos a reduzem.\nAté lá: sinal de baixa confiança (aula 5.4).', 'vermelho', {fontSize: 18});
d.arrow('epi', 'epi-ex');
d.arrow('epi-ex', 'epi-dados');

// soma
d.box('ip', 330, 450, 600, 100,
  'INTERVALO DE PREDIÇÃO\nprecisa refletir as duas: largura mínima pelo ruído,\nmais largo onde o modelo sabe menos', 'verde', {strokeWidth: 3, fontSize: 18});
d.arrow('ale-dados', 'ip', {from: 'bottom', to: 'top', via: [[270, 410], [500, 410]]});
d.arrow('epi-dados', 'ip', {from: 'bottom', to: 'top', via: [[980, 410], [760, 410]]});

export default d.elements;
