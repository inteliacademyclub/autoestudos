import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(400, -130, 'LLM vs. modelo: um duelo justo');

// linha do tempo: treino, validação e teste
d.box('treino', 0, 0, 560, 70, 'TREINO do GBM (fev/24 – jun/25)', 'verde');
d.box('valid', 580, 0, 330, 70, 'VALIDAÇÃO (jul – dez/25)\nσ do erro e combinador', 'cinza');
d.box('teste', 930, 0, 340, 70, 'TESTE (jan – jun/26)\no placar sai daqui', 'azul');
d.line([[570, -40], [570, 90]], {dashed: true, strokeWidth: 3, cor: 'vermelho'});
d.text(335, -66, 'corte de conhecimento do LLM', {size: 18, color: '#e03131'});

// o mesmo par, a mesma entrada, duas abordagens
d.box('par', 0, 150, 280, 120, 'Par (A, B) do\nmesmo canal, os dois\ndepois do corte', 'azul');
d.box('entrada', 330, 150, 310, 120, 'MESMA ENTRADA\ndescrição textual\n+ metadados', 'azul', {strokeWidth: 3});
d.box('llm', 710, 130, 290, 90, 'LLM zero-shot\n2 ordens × k execuções', 'roxo');
d.box('gbm', 710, 250, 290, 90, 'GBM treinado\nΦ((ŷA − ŷB) / σ√2)', 'verde');
d.box('pa', 1070, 170, 200, 120, 'P(A > B)\nde cada\nabordagem', 'cinza');
d.arrow('teste', 'par', {from: 'bottom', to: 'top', via: [[1100, 105], [140, 105]]});
d.arrow('par', 'entrada');
d.arrow('entrada', 'llm', {from: 'right', to: 'left'});
d.arrow('entrada', 'gbm', {from: 'right', to: 'left'});
d.arrow('llm', 'pa', {from: 'right', to: 'left'});
d.arrow('gbm', 'pa', {from: 'right', to: 'left'});

// a régua comum
d.box('regua', 600, 410, 670, 120,
  'MESMA RÉGUA\nacurácia par-a-par · Spearman intra-canal\ndesvio entre execuções · custo e latência por par\nIC por bootstrap de canais', 'amarelo', {strokeWidth: 3});
d.arrow('pa', 'regua', {from: 'bottom', to: 'top'});

d.note('vaz', 0, 320, 540, 90,
  'VAZAMENTO PELO PRÉ-TREINO: se o Short saiu antes\ndo corte, o LLM pode "lembrar" o resultado.', 'vermelho', {textColor: '#e03131', fontSize: 18});
d.note('stack', 0, 440, 540, 90,
  'BÔNUS: a P(A > B) do LLM vira feature de um\ncombinador treinado na validação (stacking).', 'verde', {textColor: '#2f9e44', fontSize: 18});

export default d.elements;
