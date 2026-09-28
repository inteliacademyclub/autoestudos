import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(230, -90, 'As cinco tools: contrato, erros e custo de cada uma');

const cols = [
  ['t1', 'laranja', '1 · extrair_atributos', 'vídeo ou imagem\n→ Atributos', 'cache por hash do\nconteúdo; timeout;\nstub nos testes', 'lenta e cara\n(VLM + Whisper)'],
  ['t2', 'ciano', '2 · historico_e_\ncomparaveis', 'pedido + embedding\n→ Contexto', 'só posts ANTES da\ndata; canal fora da\nbase → erro claro', 'ms (FAISS em\nmemória)'],
  ['t3', 'verde', '3 · prever', 'features\n→ Previsao\n(q10, q50, q90)', 'pura e idempotente;\núnica fonte\ndo número', 'ms (GBM\ncarregado 1 vez)'],
  ['t4', 'amarelo', '4 · explicar', 'Previsao\n→ drivers SHAP\n+ texto', 'LLM opcional só\nreescreve; números\nconferidos', 'ms sem LLM;\n~s com LLM'],
  ['t5', 'azul', '5 · ordenar_\ncriativos', 'N respostas\n→ ranking\n+ P(A > B)', 'pura; aproximação\nnormal no log', 'µs'],
];
cols.forEach(([id, cor, nome, io, regras, custo], i) => {
  const x = i * 240;
  d.box(`${id}-n`, x, 0, 222, 80, nome, cor, {strokeWidth: id === 't3' ? 3 : 2, fill: 'solid', bg: '#ffffff'});
  d.box(`${id}-io`, x, 100, 222, 110, io, cor);
  d.box(`${id}-r`, x, 230, 222, 110, regras, 'cinza');
  d.box(`${id}-c`, x, 360, 222, 80, custo, 'cinza', {dashed: true});
});
d.text(-150, 140, 'entrada\n→ saída', {size: 18, color: '#495057'});
d.text(-150, 265, 'regras', {size: 18, color: '#495057'});
d.text(-150, 385, 'custo', {size: 18, color: '#495057'});

d.box('llm', 220, 520, 760, 90, 'O LLM do agente enxerga só DUAS tools de alto nível:\nprever_criativo (1→2→3→4) e comparar_criativos (+5)', 'roxo', {strokeWidth: 3});
d.arrowXY(600, 514, 600, 448, {label: 'embrulham'});
d.note('n', 220, 640, 760, 60, 'Se o LLM pudesse chamar "prever" passando features, ele poderia inventar um gancho = 10.', 'vermelho', {textColor: '#e03131'});

export default d.elements;
