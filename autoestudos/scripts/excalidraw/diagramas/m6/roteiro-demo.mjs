import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(300, -90, 'Roteiro da demo: 7 minutos, 8 blocos');

const blocos = [
  ['b1', '0:00', 'Problema\ne recorte', 'azul', 1],
  ['b2', '0:40', 'Base\n(data card)', 'cinza', 1],
  ['b3', '1:20', 'Baseline\nvs. modelo', 'verde', 1],
  ['b4', '2:00', 'Ganho\nmultimodal', 'laranja', 1],
  ['b5', '2:40', 'Agente ao vivo:\n3 criativos\nprevisto vs. real', 'roxo', 2],
  ['b6', '4:10', 'Explicação\n(SHAP + texto)', 'amarelo', 1],
  ['b7', '4:50', 'MCP num\ncliente real', 'roxo', 1],
  ['b8', '5:40', 'Limitações\ne próximos\npassos', 'vermelho', 1],
];
let x = 0;
blocos.forEach(([id, t, txt, cor, peso]) => {
  const w = peso === 2 ? 250 : 140;
  d.box(id, x, 40, w, 120, txt, cor, {strokeWidth: id === 'b5' ? 3 : 2, fontSize: 18});
  d.text(x, 0, t, {size: 18, color: '#495057'});
  x += w + 16;
});
d.text(x - 10, 0, '7:00', {size: 18, color: '#495057'});
d.line([[0, 190], [x - 16, 190]], {strokeWidth: 2});

d.box('plano-b', 0, 240, 600, 100, 'PLANO B: gravação da demo inteira\n+ prints do Inspector e do trace MLflow\n(se a rede, a chave ou o modelo falharem)', 'vermelho', {dashed: true});
d.box('regra', 640, 240, 620, 100, 'Regra de ouro: cada número dito em voz alta\naparece na tela com a fonte\n(tabela, trace ou JSON da tool)', 'amarelo');

export default d.elements;
