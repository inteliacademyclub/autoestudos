import {Diagram} from '../../dsl.mjs';

const d = new Diagram();

d.box('entrada', 0, 20, 270, 120, 'Criativo + contexto\n(vídeo, legenda, setor,\ncanal, data planejada)', 'azul');
d.box('agente', 400, 0, 440, 160, 'AGENTE ORQUESTRADOR\n(LangGraph)\nrecebe o criativo, chama as\ntools e monta a resposta', 'roxo', {strokeWidth: 3});
d.arrow('entrada', 'agente');

const tools = [
  ['t1', 'Tool 1\nExtração de atributos\n(VLM + Whisper\n+ detectores)', 'laranja'],
  ['t2', 'Tool 2\nHistórico do canal\n+ comparáveis', 'ciano'],
  ['t3', 'Tool 3\nPREDIÇÃO\nGBM + intervalo', 'verde'],
  ['t4', 'Tool 4\nExplicabilidade\n(SHAP + subagente)', 'amarelo'],
  ['t5', 'Tool 5\nOrdenação /\nwhat-if', 'azul'],
];
tools.forEach(([id, txt, cor], i) => {
  d.box(id, i * 250 - 10, 280, 220, 130, txt, cor, {strokeWidth: id === 't3' ? 4 : 2});
  d.arrow('agente', id, {from: 'bottom', to: 'top'});
});

d.box('base', 0, 560, 300, 120, 'SUA BASE\nYouTube Data API v3\nmoda / beleza / automotivo', 'cinza');
d.box('treino', 420, 560, 320, 120, 'PIPELINE DE TREINO (offline)\nfeatures, split temporal,\nGBM, MLflow', 'verde');
d.box('saida', 860, 560, 370, 120, 'SAÍDA\nprevisão + intervalo + ranking\n+ justificativa → função / MCP', 'roxo');

d.arrow('base', 'treino');
d.arrow('treino', 't3', {from: 'top', to: 'bottom', label: 'modelo treinado'});
d.arrow('base', 't2', {from: 'top', to: 'bottom', via: [[150, 480], [345, 480]]});
d.arrow('agente', 'saida', {from: 'right', to: 'top', via: [[1300, 80], [1300, 500], [1045, 500]], label: 'resposta'});

d.note('regra', 880, 720, 350, 70, 'O LLM orquestra e explica.\nO número vem SEMPRE da Tool 3.', 'vermelho', {textColor: '#e03131'});

export default d.elements;
