import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(300, -90, 'MCP: quem é host, quem é cliente, quem é servidor');

// host
d.box('host', 0, 0, 400, 430, '', 'roxo', {dashed: true, bg: 'transparent'});
d.text(20, 12, 'HOST (app com LLM)', {size: 20, color: '#6741d9'});
d.text(20, 42, 'persona da Galaxies, Claude Desktop,\nClaude Code, seu agente LangGraph', {size: 16, color: '#495057'});
d.box('llm', 40, 120, 320, 80, 'LLM do host\ndecide chamar a tool', 'roxo');
d.box('cliente', 40, 280, 320, 100, 'CLIENTE MCP\n(1 por servidor conectado)', 'roxo', {strokeWidth: 3});
d.arrow('llm', 'cliente');

// servidor
d.box('srv', 820, 0, 440, 430, '', 'cinza', {dashed: true, bg: 'transparent'});
d.text(840, 12, 'SERVIDOR: galaxies-preditor', {size: 20, color: '#495057'});
d.text(840, 42, 'servidor_mcp.py (FastMCP 3.4.7)', {size: 16, color: '#495057'});
d.box('tools', 850, 90, 380, 80, 'tools: prever_criativo,\ncomparar_criativos', 'verde');
d.box('res', 850, 190, 380, 80, 'resources: model://card,\nschema://prediction-request', 'azul');
d.box('prompts', 850, 290, 380, 60, 'prompts: decidir_entre_criativos', 'amarelo');
d.box('api', 850, 370, 380, 50, 'api.prever_criativo()', 'verde', {fill: 'solid', bg: '#ebfbee'});

// mensagens JSON-RPC
d.arrowXY(366, 300, 814, 300, {label: '1. initialize (era legada)'});
d.arrowXY(366, 340, 814, 340, {label: '2. tools/list  →  nomes + JSON Schema'});
d.arrowXY(366, 380, 814, 380, {label: '3. tools/call prever_criativo {pedido}'});
d.arrowXY(814, 420, 366, 420, {label: '4. resultado: PredictionResponse', dashed: true});

// transportes
d.box('stdio', 0, 500, 600, 90, 'stdio: o host INICIA o servidor como subprocesso\n(local; Claude Desktop, Claude Code, testes)', 'cinza');
d.box('http', 660, 500, 600, 90, 'Streamable HTTP: servidor já rodando em /mcp\n(remoto; vários clientes; proteja com auth)', 'cinza');
d.text(470, 460, 'transporte (JSON-RPC 2.0 por baixo dos dois)', {size: 18, color: '#495057'});

d.note('versao', 0, 630, 1260, 100, 'Nosso stack (mcp 1.30 + FastMCP 3.4.7) fala a era LEGADA: initialize, protocolo até 2025-11-25.\nA spec vigente, 2026-07-28, é stateless: sem initialize, versão no _meta de cada requisição e server/discover.\nCliente moderno só fala com servidor legado se tiver fallback. E FastMCP 4.x / mcp 2.x quebram o adapter (mcp<2).', 'vermelho', {textColor: '#e03131'});

export default d.elements;
