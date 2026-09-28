// Glossário da trilha "ML Preditivo e Agentes". Usado pela página de glossário
// do projeto Galaxies e pelos tooltips <Termo id="..."> nas aulas.

export type Verbete = {
  termo: string;
  /** Termo em inglês, quando a literatura usa o nome original. */
  en?: string;
  definicao: string;
  /** Aula onde o conceito é aprofundado (caminho do doc, sem baseUrl). */
  aula?: string;
};

const T = '/aulas/ml-preditivo-e-agentes';

export const GLOSSARIO: Record<string, Verbete> = {
  'ablacao': {
    termo: 'Ablação',
    en: 'ablation',
    definicao:
      'Experimento em que você remove (ou adiciona) um bloco de features ou componente por vez e mede quanto a métrica muda. É como se prova que a camada multimodal “vale a pena”.',
    aula: `${T}/avaliacao-honesta/analise-de-erros-e-ablacao`,
  },
  'alvo': {
    termo: 'Alvo',
    en: 'target / label',
    definicao:
      'A variável que o modelo aprende a prever. Neste projeto, tipicamente log(1 + curtidas) ou o log da razão entre as curtidas do post e a mediana do canal.',
    aula: `${T}/formulacao-e-dados/engajamento-e-cauda-longa`,
  },
  'alvo-relativo': {
    termo: 'Alvo relativo ao canal',
    definicao:
      'Desempenho do post dividido pelo desempenho típico (mediana) dos posts anteriores do mesmo canal, em escala log. Remove o efeito do “tamanho” do canal e isola o efeito do conteúdo.',
    aula: `${T}/formulacao-e-dados/engajamento-e-cauda-longa`,
  },
  'baseline': {
    termo: 'Baseline',
    definicao:
      'Modelo propositalmente simples (ex.: mediana histórica do canal) usado como régua. Se o seu modelo não vence o baseline com validação honesta, ele não está aprendendo nada útil.',
    aula: `${T}/avaliacao-honesta/baselines`,
  },
  'bootstrap': {
    termo: 'Bootstrap',
    definicao:
      'Técnica de reamostragem com reposição para estimar a incerteza de uma métrica. O bootstrap pareado compara dois modelos nos mesmos exemplos reamostrados e diz se a diferença é real ou ruído.',
    aula: `${T}/avaliacao-honesta/analise-de-erros-e-ablacao`,
  },
  'cauda-longa': {
    termo: 'Cauda longa',
    en: 'heavy tail',
    definicao:
      'Distribuição em que poucos valores são enormes e a maioria é pequena. Curtidas e views seguem esse padrão (aproximadamente log-normal): a média é puxada pelos virais e engana.',
    aula: `${T}/formulacao-e-dados/engajamento-e-cauda-longa`,
  },
  'clip': {
    termo: 'CLIP / SigLIP',
    definicao:
      'Modelos treinados para colocar imagens e textos no mesmo espaço vetorial. Usados aqui como extratores congelados: transformam frames e thumbnails em vetores (embeddings).',
    aula: `${T}/do-video-as-features/embeddings-visuais`,
  },
  'cobertura': {
    termo: 'Cobertura',
    en: 'coverage',
    definicao:
      'Fração dos casos de teste cujo valor real caiu dentro do intervalo de predição. Um intervalo de 80% deveria cobrir cerca de 80% dos casos.',
    aula: `${T}/incerteza-e-explicabilidade/predicao-conformal`,
  },
  'conformal': {
    termo: 'Predição conformal',
    en: 'conformal prediction',
    definicao:
      'Família de métodos que calibra intervalos de predição usando os erros de um conjunto separado (calibração), com garantia de cobertura sob a hipótese de que os dados futuros se parecem com os de calibração.',
    aula: `${T}/incerteza-e-explicabilidade/predicao-conformal`,
  },
  'cota': {
    termo: 'Cota da YouTube Data API',
    en: 'quota',
    definicao:
      'Orçamento diário de “unidades” por projeto do Google Cloud (10.000/dia por padrão). Cada método custa unidades; listar playlists e vídeos custa 1 unidade por chamada de até 50 itens.',
    aula: `${T}/formulacao-e-dados/construindo-o-coletor`,
  },
  'data-card': {
    termo: 'Data card',
    en: 'datasheet for datasets',
    definicao:
      'Documento que descreve a base: origem, período, volume, licença/termos, como foi coletada, setores e — principalmente — o que ela NÃO representa.',
    aula: `${T}/formulacao-e-dados/documentacao-etica-e-termos`,
  },
  'drift': {
    termo: 'Drift',
    definicao:
      'Mudança, ao longo do tempo, na distribuição dos dados ou na relação entre features e alvo (ex.: o algoritmo da plataforma muda, uma trend passa). É um dos motivos para validar no futuro.',
    aula: `${T}/formulacao-e-dados/o-tempo-mente`,
  },
  'early-stopping': {
    termo: 'Early stopping',
    definicao:
      'Parar de adicionar árvores quando a métrica no conjunto de validação para de melhorar. Evita overfitting e escolhe o número de iterações automaticamente.',
    aula: `${T}/gradient-boosting/gradient-boosting-passo-a-passo`,
  },
  'embedding': {
    termo: 'Embedding',
    definicao:
      'Vetor numérico que representa um texto, imagem ou áudio de forma que itens parecidos fiquem próximos. Vira colunas de entrada do modelo (quase sempre depois de reduzir com PCA).',
    aula: `${T}/gradient-boosting/features-de-texto`,
  },
  'feature': {
    termo: 'Feature',
    definicao:
      'Uma coluna de entrada do modelo: algo que se sabe ANTES da publicação (inscritos, hora planejada, tamanho da legenda, rosto no gancho…).',
    aula: `${T}/formulacao-e-dados/anatomia-de-um-problema-supervisionado`,
  },
  'gbm': {
    termo: 'Gradient boosting',
    en: 'GBM',
    definicao:
      'Modelo que soma centenas de árvores pequenas, cada uma corrigindo os erros (resíduos) das anteriores. LightGBM, CatBoost e XGBoost são implementações. É o estado da arte para dados tabulares.',
    aula: `${T}/gradient-boosting/gradient-boosting-passo-a-passo`,
  },
  'gancho': {
    termo: 'Gancho',
    en: 'hook',
    definicao:
      'O que acontece nos primeiros ~3 segundos do vídeo para impedir o usuário de deslizar para o próximo. Em Shorts, é um dos atributos de conteúdo mais citados.',
    aula: `${T}/do-video-as-features/frames-cortes-e-sinais`,
  },
  'intervalo-predicao': {
    termo: 'Intervalo de predição',
    definicao:
      'Faixa onde se espera que o valor real de UM novo caso caia com certa probabilidade (ex.: 80%). Diferente do intervalo de confiança, que é sobre a incerteza de um parâmetro ou de uma média.',
    aula: `${T}/incerteza-e-explicabilidade/por-que-um-numero-so-nao-basta`,
  },
  'leakage': {
    termo: 'Vazamento de dados',
    en: 'data leakage',
    definicao:
      'Quando informação que não estaria disponível no momento da previsão entra no treino ou nas features (ex.: usar views para prever curtidas, ou a média do canal calculada com posts futuros). Produz métricas lindas e um modelo inútil.',
    aula: `${T}/avaliacao-honesta/vazamento-de-dados`,
  },
  'log1p': {
    termo: 'log1p',
    definicao:
      'log(1 + x). Transforma contagens de cauda longa em uma escala onde diferenças são relativas (dobrar curtidas soma ~0,69) e lida com zero sem erro.',
    aula: `${T}/formulacao-e-dados/engajamento-e-cauda-longa`,
  },
  'mae': {
    termo: 'MAE',
    en: 'mean absolute error',
    definicao:
      'Erro absoluto médio. Em escala log, um MAE de 0,5 significa errar, tipicamente, por um fator de e^0,5 ≈ 1,65× para cima ou para baixo.',
    aula: `${T}/avaliacao-honesta/metricas-de-erro-e-ordenacao`,
  },
  'mape': {
    termo: 'MAPE',
    definicao:
      'Erro percentual absoluto médio. Explode quando o valor real é pequeno e, calculado sobre o log, mede algo difícil de interpretar. Use como métrica complementar, não principal.',
    aula: `${T}/avaliacao-honesta/metricas-de-erro-e-ordenacao`,
  },
  'mcp': {
    termo: 'MCP',
    en: 'Model Context Protocol',
    definicao:
      'Protocolo aberto para expor ferramentas, recursos e prompts a aplicações com LLM. É como a persona da Galaxies vai consumir a sua tool de previsão.',
    aula: `${T}/agente-preditivo-e-mcp/mcp-do-zero`,
  },
  'overfitting': {
    termo: 'Overfitting',
    definicao:
      'Quando o modelo decora o treino (inclusive o ruído) e piora em dados novos. Sinal típico: erro de treino caindo enquanto o de validação sobe.',
    aula: `${T}/formulacao-e-dados/anatomia-de-um-problema-supervisionado`,
  },
  'pairwise': {
    termo: 'Acurácia par-a-par',
    en: 'pairwise accuracy',
    definicao:
      'Entre todos os pares de criativos, a fração em que o modelo acerta qual dos dois performou melhor. É a métrica que mais se parece com a decisão real da Galaxies (“A ou B?”).',
    aula: `${T}/avaliacao-honesta/metricas-de-erro-e-ordenacao`,
  },
  'pca': {
    termo: 'PCA',
    definicao:
      'Análise de componentes principais: comprime vetores longos (ex.: 768 dimensões) em poucas dimensões (16–32) que preservam a maior parte da variação. Deve ser ajustada só no treino.',
    aula: `${T}/gradient-boosting/features-de-texto`,
  },
  'pinball': {
    termo: 'Pinball loss',
    en: 'quantile loss',
    definicao:
      'Função de perda assimétrica que faz o modelo prever um quantil (ex.: 10% ou 90%) em vez da média. Base da regressão quantílica.',
    aula: `${T}/incerteza-e-explicabilidade/regressao-quantilica`,
  },
  'quantil': {
    termo: 'Quantil',
    definicao:
      'Valor abaixo do qual está uma fração dos dados. O quantil 0,9 é o valor que 90% das observações não ultrapassam. A mediana é o quantil 0,5.',
    aula: `${T}/incerteza-e-explicabilidade/regressao-quantilica`,
  },
  'residuo': {
    termo: 'Resíduo',
    definicao: 'Diferença entre o valor real e o previsto. No gradient boosting, cada nova árvore é treinada para prever os resíduos das anteriores.',
    aula: `${T}/gradient-boosting/gradient-boosting-passo-a-passo`,
  },
  'shap': {
    termo: 'SHAP',
    definicao:
      'Método que distribui uma previsão entre as features, baseado em valores de Shapley da teoria dos jogos. Cada feature ganha uma contribuição (positiva ou negativa) em relação à previsão média.',
    aula: `${T}/incerteza-e-explicabilidade/shap-na-pratica`,
  },
  'shorts': {
    termo: 'YouTube Shorts',
    definicao:
      'Vídeos verticais curtos do YouTube (até 3 minutos desde out/2024). A API não tem um campo “isShort”: é preciso inferir pela duração/proporção ou por outros sinais.',
    aula: `${T}/formulacao-e-dados/construindo-o-coletor`,
  },
  'spearman': {
    termo: 'Correlação de Spearman',
    definicao:
      'Correlação entre as ORDENS (rankings) de previsão e valor real, de −1 a 1. Mede se o modelo ordena bem, independentemente de acertar o número absoluto.',
    aula: `${T}/avaliacao-honesta/metricas-de-erro-e-ordenacao`,
  },
  'split-temporal': {
    termo: 'Split temporal',
    definicao:
      'Separar treino e teste pela data: treina no passado, testa no futuro. Simula o uso real (prever posts que ainda não existem) e evita vazamento temporal.',
    aula: `${T}/avaliacao-honesta/validacao-temporal-e-por-canal`,
  },
  'vlm': {
    termo: 'VLM',
    en: 'vision-language model',
    definicao:
      'Modelo de linguagem que também “enxerga” imagens ou vídeos (Gemini, Qwen3-VL, Gemma 4). Aqui ele responde uma rubrica fixa em JSON, que vira colunas para o modelo preditivo.',
    aula: `${T}/do-video-as-features/vlm-como-extrator-estruturado`,
  },
  'walk-forward': {
    termo: 'Walk-forward',
    definicao:
      'Validação temporal repetida: treina até a data t, testa na janela seguinte, avança t e repete. Dá várias medições “no futuro” em vez de uma só.',
    aula: `${T}/avaliacao-honesta/validacao-temporal-e-por-canal`,
  },
  'aci': {
    termo: 'ACI (Adaptive Conformal Inference)',
    definicao:
      'Variante online da predição conformal que ajusta o nível do intervalo a cada novo resultado: se errou, alarga; se acertou, estreita um pouco. Recupera a cobertura quando os dados mudam com o tempo.',
    aula: `${T}/ir-alem/conformal-adaptativo`,
  },
  'aprendizado-contrastivo': {
    termo: 'Aprendizado contrastivo',
    en: 'contrastive learning',
    definicao:
      'Forma de treinar encoders aproximando pares que combinam (uma imagem e sua legenda) e afastando os que não combinam. É assim que CLIP e SigLIP aprendem um espaço comum para imagem e texto.',
    aula: `${T}/do-video-as-features/embeddings-visuais`,
  },
  'background-shap': {
    termo: 'Background (SHAP)',
    definicao:
      'Conjunto de exemplos usado como referência para "remover" uma feature no cálculo do SHAP. A escolha do background muda o valor base e as contribuições.',
    aula: `${T}/incerteza-e-explicabilidade/shapley-values`,
  },
  'calibracao': {
    termo: 'Calibração',
    definicao:
      'Quando as probabilidades ou intervalos do modelo batem com a frequência real: intervalos de 80% cobrem ~80% dos casos. Também é o nome do conjunto de dados separado usado para ajustar isso.',
    aula: `${T}/incerteza-e-explicabilidade/predicao-conformal`,
  },
  'codec-container': {
    termo: 'Codec e container',
    definicao:
      'O codec (H.264, VP9, AV1) comprime a imagem e o áudio; o container (MP4, WebM) empacota as faixas e os metadados. O ffprobe mostra os dois.',
    aula: `${T}/do-video-as-features/anatomia-de-um-short`,
  },
  'corte-de-conhecimento': {
    termo: 'Corte de conhecimento',
    en: 'knowledge cutoff',
    definicao:
      'Data até onde vão os dados de pré-treino de um LLM. Vídeos anteriores a ela podem ter sido "vistos" pelo modelo, o que contamina comparações com LLM zero-shot.',
    aula: `${T}/ir-alem/llm-zero-shot-vs-modelo`,
  },
  'cqr': {
    termo: 'CQR',
    en: 'Conformalized Quantile Regression',
    definicao:
      'Combina regressão quantílica (intervalos que se adaptam à dificuldade do caso) com calibração conformal (cobertura garantida).',
    aula: `${T}/incerteza-e-explicabilidade/predicao-conformal`,
  },
  'data-snapshot': {
    termo: 'Snapshot',
    definicao:
      'Foto dos valores num instante (ex.: inscritos e curtidas no dia da coleta). Estatísticas do canal na base são snapshots da coleta, não do dia em que o post foi publicado.',
    aula: `${T}/formulacao-e-dados/o-tempo-mente`,
  },
  'encoder-congelado': {
    termo: 'Encoder congelado',
    en: 'frozen encoder',
    definicao:
      'Modelo pré-treinado usado só para gerar embeddings, sem ajuste fino. É a receita das soluções vencedoras: encoders congelados transformam o vídeo em colunas e um GBM faz a previsão.',
    aula: `${T}/do-video-as-features/anatomia-de-um-short`,
  },
  'epistemica-aleatoria': {
    termo: 'Incerteza aleatória vs. epistêmica',
    definicao:
      'Aleatória: ruído irredutível (o mesmo criativo poderia render diferente). Epistêmica: falta de dados ou conhecimento (canal novo, setor raro), que diminui com mais exemplos.',
    aula: `${T}/incerteza-e-explicabilidade/por-que-um-numero-so-nao-basta`,
  },
  'estratificacao': {
    termo: 'Estratificação',
    definicao: 'Garantir que cada grupo relevante (setor, faixa de inscritos) esteja representado em proporção controlada na amostra ou na base.',
    aula: `${T}/formulacao-e-dados/curadoria-de-canais`,
  },
  'fidelidade': {
    termo: 'Fidelidade da explicação',
    en: 'faithfulness',
    definicao:
      'Uma explicação é fiel quando só afirma o que está na evidência (os números e fatores devolvidos pelo modelo). Verificada por checagem determinística e por LLM-as-a-judge.',
    aula: `${T}/incerteza-e-explicabilidade/da-explicacao-a-narrativa`,
  },
  'heterocedasticidade': {
    termo: 'Heterocedasticidade',
    definicao:
      'Quando a variância do erro muda de caso para caso (ex.: ganchos fortes têm resultado mais imprevisível). Pede intervalos de largura adaptativa.',
    aula: `${T}/incerteza-e-explicabilidade/regressao-quantilica`,
  },
  'huber': {
    termo: 'Perda Huber',
    en: 'Huber loss',
    definicao:
      'Função de perda quadrática para erros pequenos e linear para erros grandes: menos sensível a virais e outliers que o erro quadrático. Usada pelo vencedor do SMP 2025.',
    aula: `${T}/gradient-boosting/lightgbm-catboost-xgboost`,
  },
  'idempotencia': {
    termo: 'Idempotência',
    definicao: 'Rodar a mesma operação duas vezes dá o mesmo resultado que rodar uma. Um coletor idempotente não duplica vídeos se for executado de novo.',
    aula: `${T}/formulacao-e-dados/construindo-o-coletor`,
  },
  'iid': {
    termo: 'i.i.d.',
    definicao:
      'Independentes e identicamente distribuídos: a suposição por trás do split aleatório. Posts de um mesmo canal ao longo do tempo não são i.i.d., e por isso a validação precisa ser temporal.',
    aula: `${T}/formulacao-e-dados/anatomia-de-um-problema-supervisionado`,
  },
  'model-card': {
    termo: 'Model card',
    definicao:
      'Documento curto sobre um modelo treinado: dados, período, features, métricas, uso pretendido e não pretendido, limitações.',
    aula: `${T}/ir-alem/pipeline-agnostico`,
  },
  'nao-conformidade': {
    termo: 'Escore de não conformidade',
    definicao:
      'Medida de quão "estranho" um caso é para o modelo, por exemplo o erro absoluto. A predição conformal usa o quantil desses escores na calibração para montar o intervalo.',
    aula: `${T}/incerteza-e-explicabilidade/predicao-conformal`,
  },
  'ood': {
    termo: 'Fora da distribuição',
    en: 'out-of-distribution, OOD',
    definicao:
      'Caso muito diferente do que o modelo viu no treino (ex.: distância grande até os vizinhos mais próximos). Previsões OOD merecem sinal de baixa confiança.',
    aula: `${T}/incerteza-e-explicabilidade/sinal-de-baixa-confianca`,
  },
  'optical-flow': {
    termo: 'Optical flow',
    definicao: 'Estimativa do movimento dos pixels entre frames consecutivos. A magnitude média vira uma feature de "quanto o vídeo se mexe".',
    aula: `${T}/do-video-as-features/frames-cortes-e-sinais`,
  },
  'permutabilidade': {
    termo: 'Permutabilidade',
    en: 'exchangeability',
    definicao:
      'Hipótese de que a ordem dos exemplos não importa (calibração e futuro "se parecem"). É o que garante a cobertura da predição conformal, e é quebrada por drift temporal.',
    aula: `${T}/incerteza-e-explicabilidade/predicao-conformal`,
  },
  'playlist-uploads': {
    termo: 'Playlist de uploads',
    definicao:
      'Playlist automática de cada canal com todos os vídeos enviados. O ID é o do canal com "UU" no lugar de "UC". Listar por ela custa 1 unidade a cada 50 vídeos.',
    aula: `${T}/formulacao-e-dados/construindo-o-coletor`,
  },
  'pooling': {
    termo: 'Pooling',
    definicao: 'Combinar vários vetores num só, por exemplo a média dos embeddings de 7 frames para representar o vídeo inteiro.',
    aula: `${T}/do-video-as-features/embeddings-visuais`,
  },
  'quebra-regime': {
    termo: 'Quebra de regime',
    definicao:
      'Mudança abrupta na forma como os dados são gerados ou medidos, como a mudança na contagem de views de Shorts em 31/03/2025. Valores antes e depois não são diretamente comparáveis.',
    aula: `${T}/formulacao-e-dados/o-tempo-mente`,
  },
  'stacking': {
    termo: 'Stacking',
    definicao: 'Combinar modelos usando as previsões de uns como features de outro, treinado num conjunto separado (ex.: a probabilidade do LLM como feature do GBM).',
    aula: `${T}/ir-alem/llm-zero-shot-vs-modelo`,
  },
  'suporte-dados': {
    termo: 'Suporte dos dados',
    definicao:
      'Região de valores de features em que existem exemplos suficientes no treino. Fora dela o modelo extrapola, e what-ifs e previsões merecem desconfiança.',
    aula: `${T}/ir-alem/what-if`,
  },
  'training-serving-skew': {
    termo: 'Training-serving skew',
    definicao:
      'Diferença entre como uma feature é calculada no treino e na hora de prever (ex.: inscritos de hoje no treino, inscritos do dia na previsão). Faz o modelo errar em produção mesmo com boas métricas.',
    aula: `${T}/formulacao-e-dados/o-tempo-mente`,
  },
  'tree-shap': {
    termo: 'TreeSHAP',
    definicao: 'Algoritmo que calcula valores SHAP exatos e rápidos para modelos de árvore (LightGBM, CatBoost, XGBoost). É o que o TreeExplainer usa.',
    aula: `${T}/incerteza-e-explicabilidade/shap-na-pratica`,
  },
  'underfitting': {
    termo: 'Underfitting',
    definicao: 'Quando o modelo é simples demais para capturar o padrão: erra muito no treino e na validação.',
    aula: `${T}/formulacao-e-dados/anatomia-de-um-problema-supervisionado`,
  },
  'valor-base': {
    termo: 'Valor base (SHAP)',
    en: 'expected value',
    definicao: 'A previsão média do modelo sobre o background. As contribuições SHAP somadas ao valor base dão exatamente a previsão do caso.',
    aula: `${T}/incerteza-e-explicabilidade/shap-na-pratica`,
  },
  'vies-selecao': {
    termo: 'Viés de seleção e de sobrevivência',
    definicao:
      'Quando a amostra não representa a população de interesse; por exemplo, só incluir canais que deram certo (sobrevivência). O modelo aprende um mundo mais otimista que o real.',
    aula: `${T}/formulacao-e-dados/curadoria-de-canais`,
  },
  'vies-variancia': {
    termo: 'Viés e variância',
    en: 'bias-variance',
    definicao:
      'Dois tipos de erro: viés (modelo simples demais, erra sistematicamente) e variância (modelo sensível demais aos dados de treino). Aumentar a complexidade troca um pelo outro.',
    aula: `${T}/formulacao-e-dados/anatomia-de-um-problema-supervisionado`,
  },
  'what-if': {
    termo: 'What-if',
    definicao:
      'Re-pontuar uma variação de um criativo (outro horário, gancho mais forte) com o modelo. Responde sobre o modelo, não sobre causa, e só vale dentro do suporte dos dados.',
    aula: `${T}/ir-alem/what-if`,
  },
  'zero-shot': {
    termo: 'Zero-shot',
    definicao: 'Usar um modelo numa tarefa sem nenhum treino específico nela, só com instruções (ex.: pedir a um LLM qual de dois vídeos vai performar melhor).',
    aula: `${T}/ir-alem/llm-zero-shot-vs-modelo`,
  },
  'cold-start': {
    termo: 'Cold start',
    definicao: 'Previsão para um canal (ou cliente) sem histórico. O modelo só conta com features gerais, como inscritos e setor, e o erro esperado é maior.',
    aula: `${T}/avaliacao-honesta/baselines`,
  },
  'embargo': {
    termo: 'Gap / embargo',
    definicao:
      'Intervalo de tempo deixado de fora entre o fim do treino e o início do teste, para que informação "vizinha" (métricas ainda amadurecendo, tendências) não vaze de um lado para o outro.',
    aula: `${T}/avaliacao-honesta/validacao-temporal-e-por-canal`,
  },
  'target-encoding': {
    termo: 'Target encoding',
    definicao:
      'Substituir uma categoria (ex.: canal) pela média do alvo nessa categoria. Se calculado com o próprio exemplo ou com o futuro, vaza o alvo. O CatBoost faz uma versão ordenada que evita isso.',
    aula: `${T}/avaliacao-honesta/vazamento-de-dados`,
  },
  'kendall': {
    termo: 'Tau de Kendall',
    definicao: 'Correlação de ordem baseada na fração de pares concordantes menos discordantes. É parente direta da acurácia par-a-par.',
    aula: `${T}/avaliacao-honesta/metricas-de-erro-e-ordenacao`,
  },
  'rmse': {
    termo: 'RMSE',
    definicao: 'Raiz do erro quadrático médio. Pune erros grandes mais que o MAE, por isso é mais sensível a virais e outliers.',
    aula: `${T}/avaliacao-honesta/metricas-de-erro-e-ordenacao`,
  },
  'f1-macro': {
    termo: 'F1 macro',
    definicao: 'Média do F1 de cada classe, com o mesmo peso para todas. Usado para as faixas (abaixo / na média / acima / viral), em que as classes raras importam.',
    aula: `${T}/avaliacao-honesta/metricas-de-erro-e-ordenacao`,
  },
  'skill-score': {
    termo: 'Ganho sobre o baseline',
    en: 'skill score',
    definicao: 'Quanto o modelo melhora uma métrica em relação ao baseline, por exemplo 1 − MAE_modelo / MAE_baseline. É o número que prova que o modelo aprendeu algo.',
    aula: `${T}/avaliacao-honesta/baselines`,
  },
  'bootstrap-pareado': {
    termo: 'Bootstrap pareado por canal',
    definicao:
      'Reamostra canais inteiros (com reposição) e recalcula a diferença entre dois modelos nos mesmos dados a cada rodada. Dá o intervalo de confiança do ganho respeitando a dependência dentro do canal.',
    aula: `${T}/avaliacao-honesta/analise-de-erros-e-ablacao`,
  },
  'regressao-media': {
    termo: 'Regressão à média',
    definicao: 'Resultados extremos tendem a ser seguidos por resultados mais próximos da média. Um viral raramente é seguido de outro viral do mesmo tamanho.',
    aula: `${T}/avaliacao-honesta/baselines`,
  },
  'bagging': {
    termo: 'Bagging e random forest',
    definicao:
      'Treinar muitas árvores em reamostragens dos dados e tirar a média. Reduz a variância de árvores profundas. A random forest ainda sorteia features a cada split, para descorrelacionar as árvores.',
    aula: `${T}/gradient-boosting/bagging-vs-boosting`,
  },
  'oob': {
    termo: 'Out-of-bag (OOB)',
    definicao: 'Exemplos que ficaram fora da reamostragem de uma árvore do bagging e podem avaliá-la. Útil, mas é uma validação aleatória: não substitui o split temporal.',
    aula: `${T}/gradient-boosting/bagging-vs-boosting`,
  },
  'learning-rate': {
    termo: 'Learning rate (shrinkage)',
    definicao: 'Fator que multiplica a contribuição de cada nova árvore no boosting. Menor = mais árvores necessárias, mas costuma generalizar melhor.',
    aula: `${T}/gradient-boosting/gradient-boosting-passo-a-passo`,
  },
  'split-arvore': {
    termo: 'Split (árvore)',
    definicao: 'Pergunta do tipo "feature ≤ limiar?" que divide os dados em dois grupos. A árvore escolhe o split que mais reduz o erro dentro dos grupos.',
    aula: `${T}/gradient-boosting/arvores-de-decisao`,
  },
  'monotonica': {
    termo: 'Restrição monotônica',
    definicao:
      'Obriga o modelo a só aumentar (ou só diminuir) a previsão quando uma feature cresce, como mais inscritos → mais curtidas. Pode custar um pouco nos canais conhecidos e ajudar nos canais novos.',
    aula: `${T}/gradient-boosting/lightgbm-catboost-xgboost`,
  },
  'merge-asof': {
    termo: 'Join as-of',
    en: 'merge_asof',
    definicao: 'Junta a cada linha o registro mais recente ANTERIOR à sua data (ex.: o snapshot do canal mais próximo antes do post). É a ferramenta para juntar dados temporais sem vazar o futuro.',
    aula: `${T}/gradient-boosting/features-do-canal-e-do-tempo`,
  },
  'tf-idf': {
    termo: 'TF-IDF',
    definicao:
      'Representação de texto que pesa cada palavra pela frequência no documento e pela raridade na coleção. Com TruncatedSVD, vira poucas colunas densas; é uma alternativa leve aos embeddings.',
    aula: `${T}/gradient-boosting/features-de-texto`,
  },
  'vad': {
    termo: 'VAD',
    en: 'voice activity detection',
    definicao: 'Detecção dos trechos do áudio em que há fala. O faster-whisper usa VAD para pular silêncio e música, o que também dá a feature "% do vídeo com fala".',
    aula: `${T}/do-video-as-features/audio-e-fala`,
  },
  'rms': {
    termo: 'Energia RMS',
    definicao: 'Raiz da média dos quadrados da amplitude do áudio em janelas curtas. É uma medida simples de "volume" e energia do som, calculada pela librosa.',
    aula: `${T}/do-video-as-features/audio-e-fala`,
  },
  'kappa': {
    termo: 'Kappa de Cohen (teste-reteste)',
    definicao:
      'Concordância entre duas rodadas de rotulação (ou entre VLM e detector) descontando o acaso. Usado para medir se o VLM responde a mesma rubrica de forma estável.',
    aula: `${T}/do-video-as-features/vlm-como-extrator-estruturado`,
  },
  'structured-output': {
    termo: 'Structured output',
    definicao: 'Forçar o LLM ou VLM a responder num JSON que segue um schema (aqui, um modelo Pydantic). As respostas viram colunas sem parsing frágil de texto livre.',
    aula: `${T}/do-video-as-features/vlm-como-extrator-estruturado`,
  },
  'backoff': {
    termo: 'Backoff exponencial',
    definicao: 'Esperar cada vez mais (1 s, 2 s, 4 s…, com um pouco de aleatoriedade) antes de repetir uma requisição que falhou por limite de taxa (erro 429).',
    aula: `${T}/do-video-as-features/vlm-como-extrator-estruturado`,
  },
  'early-fusion': {
    termo: 'Early fusion',
    definicao: 'Juntar as features de todas as modalidades (metadados, texto, visual, áudio, VLM) numa única tabela antes do modelo. Late fusion combina previsões de modelos separados.',
    aula: `${T}/do-video-as-features/fusao-e-ablacao`,
  },
  'ocr': {
    termo: 'OCR',
    definicao: 'Reconhecimento óptico de caracteres: lê o texto que aparece na imagem. Aqui vira "tem texto na tela?", área de texto e texto no gancho.',
    aula: `${T}/do-video-as-features/detectores-leves`,
  },
  'open-vocabulary': {
    termo: 'Detecção de vocabulário aberto',
    definicao: 'Detector de objetos que aceita classes escritas em texto na hora ("batom", "volante"), como o OWLv2, em vez de uma lista fixa de classes de treino.',
    aula: `${T}/do-video-as-features/detectores-leves`,
  },
  'agpl': {
    termo: 'AGPL-3.0',
    definicao: 'Licença copyleft forte: quem usa o software modificado num serviço em rede precisa abrir o código. É a licença da Ultralytics (YOLO), o que pesa em uso comercial.',
    aula: `${T}/do-video-as-features/detectores-leves`,
  },
  'sonda-zero-shot': {
    termo: 'Sonda zero-shot',
    en: 'zero-shot probe',
    definicao: 'Comparar o embedding de uma imagem com frases como "um close de batom" para gerar uma feature interpretável sem treino. Funciona melhor com escores relativos à média das sondas.',
    aula: `${T}/do-video-as-features/embeddings-visuais`,
  },
  'fps': {
    termo: 'fps e keyframe',
    definicao: 'Frames por segundo do vídeo; keyframes são os quadros completos a partir dos quais os outros são reconstruídos. Buscar um instante exato no vídeo depende deles.',
    aula: `${T}/do-video-as-features/anatomia-de-um-short`,
  },
  'stategraph': {
    termo: 'StateGraph',
    definicao: 'Grafo do LangGraph em que nós (funções) leem e atualizam um estado compartilhado, com arestas fixas ou condicionais. Ideal para o fluxo determinístico de previsão.',
    aula: `${T}/agente-preditivo-e-mcp/langgraph-em-2026`,
  },
  'react': {
    termo: 'ReAct',
    definicao: 'Padrão de agente em que o LLM alterna raciocínio e chamadas de tool até responder. Útil para perguntas abertas ("compare estes três criativos"); no LangChain 1.x, via `create_agent`.',
    aula: `${T}/agente-preditivo-e-mcp/langgraph-em-2026`,
  },
  'checkpointer': {
    termo: 'Checkpointer',
    definicao: 'Componente do LangGraph que salva o estado do grafo a cada passo, permitindo retomar, inspecionar e depurar execuções.',
    aula: `${T}/agente-preditivo-e-mcp/langgraph-em-2026`,
  },
  'json-rpc': {
    termo: 'JSON-RPC',
    definicao: 'Protocolo simples de chamadas remotas em JSON (método, parâmetros, id, resultado). É o formato das mensagens do MCP.',
    aula: `${T}/agente-preditivo-e-mcp/mcp-do-zero`,
  },
  'transporte-mcp': {
    termo: 'Transporte MCP (stdio / Streamable HTTP)',
    definicao: 'Como cliente e servidor MCP trocam mensagens: stdio para um processo local iniciado pelo cliente; Streamable HTTP para um servidor remoto.',
    aula: `${T}/agente-preditivo-e-mcp/mcp-do-zero`,
  },
  'resource-mcp': {
    termo: 'Resource (MCP)',
    definicao: 'Conteúdo somente leitura que um servidor MCP expõe por URI, como o model card ou o esquema da base, para o cliente consultar sem chamar uma tool.',
    aula: `${T}/agente-preditivo-e-mcp/mcp-do-zero`,
  },
  'golden-set': {
    termo: 'Golden set "de-para"',
    definicao: 'Conjunto fixo de criativos de canais fora do treino, com a métrica real conhecida, usado para testar o agente de ponta a ponta e para a demo (previsto vs. real).',
    aula: `${T}/agente-preditivo-e-mcp/testando-o-agente`,
  },
  'avaliacao-trajetoria': {
    termo: 'Avaliação de trajetória',
    definicao: 'Verificar não só a resposta final do agente, mas a sequência de tools que ele chamou (e com quais argumentos).',
    aula: `${T}/agente-preditivo-e-mcp/testando-o-agente`,
  },
  'tracing': {
    termo: 'Tracing',
    definicao: 'Registro de cada passo de uma execução (spans com entradas, saídas e tempos). O MLflow faz isso para LangChain/LangGraph com `mlflow.langchain.autolog()`.',
    aula: `${T}/agente-preditivo-e-mcp/testando-o-agente`,
  },
  'walking-skeleton': {
    termo: 'Esqueleto andante',
    en: 'walking skeleton',
    definicao: 'Versão mínima que já liga todas as pontas (base → modelo → função → MCP) de verdade, ainda que simples. Depois, cada peça é melhorada sem quebrar o todo.',
    aula: `${T}/agente-preditivo-e-mcp/o-llm-orquestra-o-modelo-preve`,
  },
};
