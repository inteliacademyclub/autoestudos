import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(330, -80, 'Uma função no centro, adaptadores nas bordas');

// camada 1: quem consome
d.text(0, 0, 'QUEM CHAMA', {size: 18, color: '#495057'});
d.box('persona', 0, 30, 330, 90, 'Persona sintética da Galaxies\n(LLM de outro time)', 'roxo');
d.box('claude', 380, 30, 330, 90, 'Claude Desktop / Claude Code\n(host MCP de teste)', 'roxo');
d.box('humano', 760, 30, 330, 90, 'Você: notebook, testes,\ndemo em Streamlit', 'cinza');

// camada 2: adaptadores
d.text(0, 160, 'ADAPTADORES (finos)', {size: 18, color: '#495057'});
d.box('mcp', 0, 190, 520, 90, 'servidor_mcp.py (FastMCP)\ntools + resources: model://card', 'cinza');
d.box('agente', 570, 190, 520, 90, 'agente.py (LangGraph)\ngrafo determinístico + agente ReAct', 'roxo');
d.arrow('persona', 'mcp', {from: 'bottom', to: 'top'});
d.arrow('claude', 'mcp', {from: 'bottom', to: 'top'});
d.arrow('humano', 'agente', {from: 'bottom', to: 'top'});

// camada 3: a API
d.text(0, 320, 'API PRINCIPAL', {size: 18, color: '#495057'});
d.box('api', 0, 350, 1090, 90, 'api.prever_criativo(pedido: PredictionRequest) -> PredictionResponse\nfunção Python pura, determinística, sem LLM no caminho do número', 'verde', {strokeWidth: 3});
d.arrow('mcp', 'api', {from: 'bottom', to: 'top'});
d.arrow('agente', 'api', {from: 'bottom', to: 'top'});
d.arrow('humano', 'api', {from: 'right', to: 'right', via: [[1150, 75], [1150, 395]]});

// camada 4: tools
d.text(0, 480, 'AS CINCO TOOLS (tools.py)', {size: 18, color: '#495057'});
const tools = [
  ['t1', '1 extrair\natributos', 'laranja'],
  ['t2', '2 histórico e\ncomparáveis', 'ciano'],
  ['t3', '3 prever\nGBM + intervalo', 'verde'],
  ['t4', '4 explicar\nSHAP (+ LLM)', 'amarelo'],
  ['t5', '5 ordenar\nP(A > B)', 'azul'],
];
tools.forEach(([id, txt, cor], i) => {
  d.box(id, i * 222, 510, 202, 80, txt, cor, {strokeWidth: id === 't3' ? 3 : 2});
});
d.arrow('api', 't3', {from: 'bottom', to: 'top'});
d.text(580, 460, 'chama 1 → 2 → 3 → 4', {size: 16, color: '#2f9e44'});

// camada 5: artefatos
d.box('modelo', 0, 650, 520, 80, 'modelo.py: Bundle carregado 1 vez\n(lru_cache) + versão do modelo', 'verde');
d.box('disco', 570, 650, 520, 80, 'artefatos/: modelo.joblib + base.parquet\n(gerados pelo treino offline)', 'cinza');
d.arrow('t3', 'modelo', {from: 'bottom', to: 'top'});
d.arrow('disco', 'modelo', {from: 'left', to: 'right'});

d.box('contrato', 1150, 480, 150, 250, 'schemas.py\n\no contrato\nPydantic\nvale em\ntodas as\ncamadas', 'azul');
d.note('regra', 0, 770, 1090, 60, 'O LLM só aparece nas bordas (agente e texto da explicação). O número nasce na Tool 3 e atravessa as camadas intacto.', 'vermelho', {textColor: '#e03131'});

export default d.elements;
