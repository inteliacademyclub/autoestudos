import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(250, -70, 'Duas perguntas diferentes, duas ferramentas diferentes');

// coluna LLM
d.box('llm-in', 0, 20, 300, 90, '"Quantas curtidas esse\nShort vai ter?"', 'cinza');
d.box('llm', 0, 170, 300, 110, 'LLM\n(aprendeu a continuar texto)', 'roxo', {strokeWidth: 3});
d.box('llm-out', 0, 340, 300, 110, '"Entre 3 e 5 mil."\n(plausível, sem régua,\nmuda a cada pergunta)', 'vermelho');
d.arrow('llm-in', 'llm');
d.arrow('llm', 'llm-out');

// coluna modelo
d.box('m-in', 520, 20, 360, 90, 'features conhecidas ANTES de postar\n(canal, horário, gancho, legenda...)', 'azul');
d.box('m', 520, 170, 360, 110, 'MODELO PREDITIVO\n(aprendeu com milhares de\npares criativo → resultado real)', 'verde', {strokeWidth: 3});
d.box('m-out', 520, 340, 360, 110, '3.900 curtidas\nintervalo 80%: 2.100 a 7.400\nerro medido no teste', 'verde');
d.arrow('m-in', 'm');
d.arrow('m', 'm-out');

d.box('real', 1010, 340, 230, 110, 'Resultado real\n(30 dias depois)', 'amarelo');
d.arrow('real', 'm-out', {from: 'left', to: 'right', label: 'compara', dashed: true, cor: 'laranja'});

d.note('n1', 0, 490, 300, 90, 'Ótimo para interpretar,\nexplicar e orquestrar.', 'roxo', {textColor: '#6741d9'});
d.note('n2', 520, 490, 360, 90, 'Ótimo para prever um número\ne dizer o quanto erra.', 'verde', {textColor: '#2f9e44'});

export default d.elements;
