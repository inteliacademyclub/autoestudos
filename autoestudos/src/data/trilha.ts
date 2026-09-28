// Mapa da trilha "ML Preditivo e Agentes": módulos, aulas e slugs.
// Fonte única usada pelo PipelineMap, pelo roadmap e pelos scripts.

export const BASE_TRILHA = '/aulas/ml-preditivo-e-agentes';

export type Aula = {slug: string; titulo: string};
export type Modulo = {
  n: number;
  slug: string;
  titulo: string;
  semana: string;
  etapas: string[];
  aulas: Aula[];
};

export const MODULOS: Modulo[] = [
  {
    n: 1,
    slug: 'formulacao-e-dados',
    titulo: 'Formulação e Dados',
    semana: '1',
    etapas: ['dados'],
    aulas: [
      {slug: 'do-llm-ao-modelo-preditivo', titulo: 'Do LLM ao modelo preditivo'},
      {slug: 'anatomia-de-um-problema-supervisionado', titulo: 'Anatomia de um problema supervisionado'},
      {slug: 'fontes-de-dados-e-plano-da-base', titulo: 'Fontes de dados e o plano da sua base'},
      {slug: 'curadoria-de-canais', titulo: 'Curadoria de canais'},
      {slug: 'construindo-o-coletor', titulo: 'Construindo o coletor com a YouTube Data API'},
      {slug: 'engajamento-e-cauda-longa', titulo: 'Engajamento é cauda longa'},
      {slug: 'o-tempo-mente', titulo: 'O tempo mente'},
      {slug: 'documentacao-etica-e-termos', titulo: 'Documentação, ética e termos de uso'},
    ],
  },
  {
    n: 2,
    slug: 'avaliacao-honesta',
    titulo: 'Avaliação Honesta',
    semana: '1–2',
    etapas: ['avaliacao'],
    aulas: [
      {slug: 'baselines', titulo: 'Baselines: o modelo burro que você precisa vencer'},
      {slug: 'vazamento-de-dados', titulo: 'Vazamento de dados'},
      {slug: 'validacao-temporal-e-por-canal', titulo: 'Validação temporal e por canal'},
      {slug: 'metricas-de-erro-e-ordenacao', titulo: 'Métricas de erro e de ordenação'},
      {slug: 'experimentos-rastreaveis', titulo: 'Experimentos rastreáveis com MLflow'},
      {slug: 'analise-de-erros-e-ablacao', titulo: 'Análise de erros e ablação'},
    ],
  },
  {
    n: 3,
    slug: 'gradient-boosting',
    titulo: 'Gradient Boosting e Features Tabulares',
    semana: '2',
    etapas: ['modelo'],
    aulas: [
      {slug: 'arvores-de-decisao', titulo: 'Árvores de decisão por dentro'},
      {slug: 'bagging-vs-boosting', titulo: 'Bagging vs. boosting'},
      {slug: 'gradient-boosting-passo-a-passo', titulo: 'Gradient boosting passo a passo'},
      {slug: 'lightgbm-catboost-xgboost', titulo: 'LightGBM, CatBoost e XGBoost na prática'},
      {slug: 'features-do-canal-e-do-tempo', titulo: 'Features do canal e do tempo'},
      {slug: 'features-de-texto', titulo: 'Features de texto'},
    ],
  },
  {
    n: 4,
    slug: 'do-video-as-features',
    titulo: 'Do Vídeo às Features',
    semana: '2–3',
    etapas: ['multimodal'],
    aulas: [
      {slug: 'anatomia-de-um-short', titulo: 'Anatomia de um Short e o pipeline multimodal'},
      {slug: 'obtendo-a-midia', titulo: 'Obtendo a mídia'},
      {slug: 'frames-cortes-e-sinais', titulo: 'Frames, cortes e sinais de baixo nível'},
      {slug: 'embeddings-visuais', titulo: 'Embeddings visuais: CLIP e SigLIP 2'},
      {slug: 'audio-e-fala', titulo: 'Áudio e fala'},
      {slug: 'detectores-leves', titulo: 'Detectores leves: rosto, texto e objetos'},
      {slug: 'vlm-como-extrator-estruturado', titulo: 'VLM como extrator estruturado'},
      {slug: 'fusao-e-ablacao', titulo: 'Fusão e ablação multimodal'},
    ],
  },
  {
    n: 5,
    slug: 'incerteza-e-explicabilidade',
    titulo: 'Incerteza e Explicabilidade',
    semana: '3',
    etapas: ['incerteza', 'explicacao'],
    aulas: [
      {slug: 'por-que-um-numero-so-nao-basta', titulo: 'Por que um número só não basta'},
      {slug: 'regressao-quantilica', titulo: 'Regressão quantílica e pinball loss'},
      {slug: 'predicao-conformal', titulo: 'Predição conformal'},
      {slug: 'sinal-de-baixa-confianca', titulo: 'Sinal de baixa confiança'},
      {slug: 'shapley-values', titulo: 'Shapley values: a intuição'},
      {slug: 'shap-na-pratica', titulo: 'SHAP na prática'},
      {slug: 'da-explicacao-a-narrativa', titulo: 'Da explicação à narrativa'},
    ],
  },
  {
    n: 6,
    slug: 'agente-preditivo-e-mcp',
    titulo: 'Agente Preditivo e MCP',
    semana: '3–4',
    etapas: ['agente', 'mcp'],
    aulas: [
      {slug: 'o-llm-orquestra-o-modelo-preve', titulo: 'O LLM orquestra, o modelo prevê'},
      {slug: 'langgraph-em-2026', titulo: 'LangGraph em 2026'},
      {slug: 'as-cinco-tools', titulo: 'As cinco tools do agente'},
      {slug: 'comparaveis', titulo: 'Comparáveis: retrieval de criativos'},
      {slug: 'mcp-do-zero', titulo: 'MCP do zero'},
      {slug: 'testando-o-agente', titulo: 'Testando e avaliando o agente'},
      {slug: 'demo-e-readme', titulo: 'Demo e README que convencem'},
    ],
  },
  {
    n: 7,
    slug: 'ir-alem',
    titulo: 'Ir Além (opcional)',
    semana: 'extra',
    etapas: [],
    aulas: [
      {slug: 'pipeline-agnostico', titulo: 'Pipeline agnóstico: treinar para a base de um cliente'},
      {slug: 'what-if', titulo: 'What-if: otimizando legenda, horário e gancho'},
      {slug: 'llm-zero-shot-vs-modelo', titulo: 'LLM zero-shot vs. modelo treinado'},
      {slug: 'embeddings-de-video-e-audio', titulo: 'Embeddings de vídeo e áudio'},
      {slug: 'conformal-adaptativo', titulo: 'Conformal adaptativo e drift'},
    ],
  },
];

export function urlAula(modulo: string, aula: string): string {
  return `${BASE_TRILHA}/${modulo}/${aula}`;
}
