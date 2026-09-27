import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(250, -90, 'Dois jeitos de usar o LangGraph no projeto');

// ---------- esquerda: StateGraph determinístico ----------
d.text(0, -30, 'StateGraph: o fluxo da previsão (fixo)', {size: 22, color: '#2f9e44'});
d.ellipse('start', 190, 10, 120, 50, 'START', 'cinza');
d.diamond('rota', 150, 90, 200, 110, 'criativo\né texto?', 'cinza');
d.box('extrair', 0, 240, 210, 70, 'extrair\n(VLM + Whisper)', 'laranja');
d.box('texto', 290, 240, 210, 70, 'embutir_texto\n(só embedding)', 'laranja', {dashed: true});
d.box('contexto', 145, 350, 210, 60, 'contexto', 'ciano');
d.box('prever', 145, 440, 210, 60, 'prever', 'verde', {strokeWidth: 3});
d.box('explicar', 145, 530, 210, 60, 'explicar', 'amarelo');
d.box('responder', 145, 620, 210, 60, 'responder', 'roxo');
d.ellipse('end', 190, 710, 120, 50, 'END', 'cinza');
d.arrow('start', 'rota');
d.arrow('rota', 'extrair', {from: 'left', to: 'top', via: [[105, 145]], label: 'não'});
d.arrow('rota', 'texto', {from: 'right', to: 'top', via: [[395, 145]], label: 'sim', dashed: true});
d.arrow('extrair', 'contexto', {from: 'bottom', to: 'left', via: [[105, 380]]});
d.arrow('texto', 'contexto', {from: 'bottom', to: 'right', via: [[395, 380]], dashed: true});
d.arrow('contexto', 'prever');
d.arrow('prever', 'explicar');
d.arrow('explicar', 'responder');
d.arrow('responder', 'end');
d.note('n-llm', 380, 530, 170, 60, 'LLM opcional,\nsó no texto', 'roxo', {textColor: '#6741d9'});
d.note('n-ck', 0, 790, 560, 70, 'InMemorySaver guarda o estado após cada nó;\nstream_mode="updates" mostra o que cada nó produziu.', 'cinza');

// ---------- direita: agente ReAct ----------
d.text(700, -30, 'create_agent: perguntas abertas (ReAct)', {size: 22, color: '#6741d9'});
d.box('user', 760, 20, 440, 80, '"Compare esses 3 Shorts e me diga\nqual impulsionar."', 'azul');
d.box('llm', 760, 180, 440, 100, 'LLM (nó "model")\nescolhe a próxima tool ou responde', 'roxo', {strokeWidth: 3});
d.box('tools', 760, 380, 440, 130, 'nó "tools"\nprever_criativo  → o grafo da esquerda\ncomparar_criativos → Tool 5 + P(A>B)', 'verde');
d.box('resp', 760, 620, 440, 80, 'Resposta em texto, citando\nos números devolvidos pelas tools', 'roxo');
d.arrow('user', 'llm');
d.arrowXY(900, 286, 900, 374, {label: 'tool call'});
d.arrowXY(1060, 374, 1060, 286, {label: 'ToolMessage'});
d.arrow('llm', 'resp', {from: 'right', to: 'right', via: [[1260, 230], [1260, 660]], label: 'fim'});
d.note('n-rec', 700, 790, 560, 70, 'Recomendação: o número segue o grafo fixo;\no LLM decide QUAIS criativos prever e como explicar.', 'vermelho', {textColor: '#e03131'});

d.line([[630, -40], [630, 870]], {dashed: true, cor: 'cinza'});

export default d.elements;
