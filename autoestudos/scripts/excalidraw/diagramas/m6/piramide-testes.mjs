import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(180, -90, 'Pirâmide de testes do agente preditivo');

// camadas da pirâmide, de baixo (muitos, baratos) para cima (poucos, caros)
const camadas = [
  ['c5', 320, 0, 360, 80, '5 · trajetória e fidelidade\ntools certas? texto fiel?', 'roxo'],
  ['c4', 240, 100, 520, 80, '4 · golden set "de-para"\nprevisão vs. real, canais fora do treino', 'amarelo'],
  ['c3', 160, 200, 680, 80, '3 · invariante: número do agente == número do modelo\ngrafo, função, MCP e ReAct devolvem o MESMO valor', 'verde'],
  ['c2', 80, 300, 840, 80, '2 · contrato: todo pedido válido gera PredictionResponse válida\nlow ≤ pred ≤ high, versão do modelo, features_used', 'ciano'],
  ['c1', 0, 400, 1000, 80, '1 · unidade: schemas recusam o que devem, hora local,\nfeatures, métricas, roteamento do grafo', 'azul'],
];
camadas.forEach(([id, x, y, w, h, txt, cor]) => d.box(id, x, y, w, h, txt, cor, {fontSize: 18}));

d.arrowXY(-40, 470, -40, 10, {strokeWidth: 3});
d.text(-200, 200, 'mais lento,\nmais caro,\nmais perto\ndo usuário', {size: 18, color: '#495057'});
d.text(1030, 410, 'ms, sem LLM,\nroda em todo\ncommit', {size: 18, color: '#495057'});
d.text(700, 10, 'com LLM real:\nroda antes da\nentrega/demo', {size: 18, color: '#6741d9'});

d.box('trace', 0, 530, 1000, 70, 'Transversal: MLflow tracing (mlflow.langchain.autolog)\nregistra cada nó, com entrada, saída e tempo, para inspeção', 'cinza', {dashed: true, fontSize: 18});

export default d.elements;
