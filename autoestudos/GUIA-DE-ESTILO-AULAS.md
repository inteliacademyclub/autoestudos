# Guia de estilo: trilha "ML Preditivo e Agentes"

Este guia vale para todas as aulas em `docs/aulas/ml-preditivo-e-agentes/` e para o hub `docs/projetos/galaxies/`. Ele existe para que aulas escritas por pessoas (ou agentes) diferentes pareçam um único curso.

**Aula-modelo:** `docs/aulas/ml-preditivo-e-agentes/1-formulacao-e-dados/1-do-llm-ao-modelo-preditivo/index.mdx`. Na dúvida, imite ela.

---

## 1. Público e tom

- **Quem lê:** membros da liga que já dominam LLMs, prompting, RAG e agentes, mas têm pouca prática em ML clássico, validação e estatística. Eles têm **4 semanas** (23/09 a 23/10/2026) para entregar o projeto Galaxies e vão consultar as aulas **enquanto constroem**.
- **Português do Brasil**, tratando o leitor por "você". Tom profissional e envolvente, como no módulo EDD: nada de gírias como "tá" ou "cuspir", e nada de tom acadêmico seco.
- **Termos técnicos em inglês:** mantenha o termo em inglês quando é o que a literatura e as bibliotecas usam (*feature*, *baseline*, *early stopping*, *leakage*). Na primeira ocorrência de cada aula, escreva em itálico e, se ajudar, dê a tradução.
- **Profundidade:** explique o *porquê*, não só o *como*. Toda afirmação quantitativa precisa de fonte (link) ou de demonstração (código ou componente interativo).
- **Honestidade:** diga o que não se sabe, onde a literatura discorda e quais números são ilustrativos. Nunca invente autores, números, APIs ou versões. Se não conseguir verificar, não afirme.
- **Sem emojis no texto corrido.** Os ícones dos componentes já cumprem esse papel.

## 2. Estrutura obrigatória de cada aula

Tamanho alvo: **1.500 a 2.500 palavras** de prosa, sem contar código.

```mdx
---
sidebar_position: N
sidebar_label: 'Título curto'
title: 'Título curto'
description: 'Uma frase sobre o que a aula ensina (vai para SEO e para os cards).'
tags: [ml-preditivo, <tema>]
---

# Título Longo: Subtítulo Que Promete Algo

<LessonMeta tempo="40 min" semana={2} etapa="modelo" objetivos={[...]} prerequisitos={[...]} />

Gancho: 2–4 parágrafos com uma pergunta, um erro real ou um paradoxo.

:::info[Definição / ideia central]
...
:::

---

## Seções de conceito (H2), separadas por ---

(diagrama <Sketch>, fórmulas em KaTeX, componente interativo, tabelas)

## Na prática (código)

## No projeto Galaxies  ← usar <NoProjeto> (o que muda em Lumina A vs. B)

## Erros comuns  ← :::warning[...] com lista numerada

<Quiz id="mX-aY" perguntas={[...]} />   ← 3 a 5 perguntas

## Exercício  ← :::tip[Exercício: ...] + <details> com solução/dica

## Resumo  ← 3 a 5 bullets com **termos-chave** em negrito

## Referências  ← links reais e verificados

**Próxima aula:** [Título](/aulas/ml-preditivo-e-agentes/<modulo>/<aula>) — uma frase.
```

- O H1 segue o padrão `Tema: Subtítulo`.
- **Os H2 ficam separados por `---`**, como no módulo EDD.
- Admonitions sempre com título: `:::info[Título]`, `:::tip[...]`, `:::warning[...]`, `:::danger[...]`.
- A **última aula de um módulo** aponta como próxima aula a primeira do módulo seguinte.

## 3. Componentes disponíveis

### Globais: use sem import

```mdx
<LessonMeta
  tempo="40 min"                    // obrigatório
  semana={2}                        // semana do projeto em que o conteúdo é necessário (1–4)
  etapa="modelo"                    // ou lista: ['incerteza','explicacao']
  objetivos={['...', '...']}        // 3 a 5, começando com verbo
  prerequisitos={[{label: 'Nome da aula', to: '/aulas/...'}]}
  opcional                          // só no módulo 7
/>
```

Etapas válidas: `dados`, `avaliacao`, `modelo`, `multimodal`, `incerteza`, `explicacao`, `agente`, `mcp`.

```mdx
<Sketch name="m2/splits" alt="Descrição completa para leitor de tela" caption="Legenda curta." />
```

```mdx
<NoProjeto>                                   // título padrão: "No projeto: Lumina A vs. B"
Texto em markdown normal (listas, **negrito**, código).
</NoProjeto>
<NoProjeto titulo="Garagem 22: POV vs. interior">...</NoProjeto>
```

```mdx
<Quiz
  id="m2-a3"                                   // único: m<módulo>-a<aula>
  perguntas={[
    {
      pergunta: 'Texto com `código`, **negrito**, *itálico* e [link](/aulas/...)',
      opcoes: [
        {texto: 'Errada', explicacao: 'Por que está errada.'},
        {texto: 'Certa', correta: true, explicacao: 'Por que está certa.'},
      ],
    },
    {pergunta: '...', multipla: true, opcoes: [...]},   // mais de uma correta
  ]}
/>
```

Todo quiz precisa ter **explicação em todas as alternativas**. Prefira perguntas de aplicação ("qual destas features vaza?") às de memorização.

```mdx
<Checklist id="galaxies-semana1" titulo="..." itens={['texto', {texto: '...', detalhe: '...'}]} />
<Termo id="leakage">vazamento</Termo>         // tooltip com a definição do glossário
<CardGrid><ToolCard nome="LightGBM" versao="4.7.0" licenca="MIT" custo="grátis" papel="..." link="https://... ou /aulas/... (interno)" alerta="..." /></CardGrid>
<PaperCard titulo="..." referencia="Autores, venue, ano" link="..." resumo="..." numeros={['Spearman 0,71']} usar={[...]} criticar={[...]} />
```

- **IDs do `<Termo>`** estão em `src/data/glossario.ts`. Se precisar de um termo que não existe lá, use texto normal e anote no seu relatório final.

### Interativos: import explícito, sem props obrigatórias

Coloque o import logo abaixo do frontmatter:

```mdx
import SplitExplorer from '@site/src/components/interativos/SplitExplorer';
...
<SplitExplorer />
```

| Componente | Onde entra | O que mostra |
| :--- | :--- | :--- |
| `QuotaCalculator` | 1.5 coletor | unidades da YouTube API por estratégia (playlist vs. search) |
| `LongTailExplorer` | 1.6 cauda longa | histograma bruto → log1p → relativo ao canal, por setor |
| `LeakageDetective` | 2.2 vazamento | o aluno classifica features como "existe antes" ou "vaza" |
| `SplitExplorer` | 2.3 validação | linha do tempo por canal; split aleatório/temporal/por canal; métrica otimista vs. honesta |
| `MetricsPlayground` | 2.4 métricas | arrastar previsões de 8 criativos; MAE, MAPE, Spearman e par-a-par ao vivo |
| `TreeSplitter` | 3.1 árvores | escolher feature e limiar do split; redução de erro |
| `BoostingPlayground` | 3.3 boosting | árvores somando resíduos; lr, profundidade, early stopping |
| `VideoToFeatures` | 4.1 anatomia do Short | scrubber de um Short: frames, gancho, cortes, transcrição, detecções, JSON do VLM |
| `EmbeddingMap` | 4.4 embeddings e 6.4 comparáveis | mapa 2D de criativos; vizinhos mais próximos |
| `VlmBudgetCalculator` | 4.7 VLM | tokens por vídeo, RPD e dias para processar a base |
| `IntervalExplorer` | 5.2 e 5.3 | bandas quantílicas, pinball loss, calibração conformal com cobertura |
| `ShapleyGame` | 5.5 Shapley | coalizões de 3 features, cálculo exato |
| `ShapWaterfall` | 5.6 SHAP | waterfall do caso Lumina com toggles |
| `AgentTrace` | 6.2 LangGraph | replay passo a passo de uma execução do agente |
| `McpFlow` | 6.5 MCP | sequência JSON-RPC: initialize → tools/list → tools/call |
| `WhatIfSimulator` | 7.2 what-if | variações do Short B re-pontuadas |

Os componentes usam um **simulador sintético** (`src/components/interativos/lib/simulador.ts`) com efeitos conhecidos. Na aula, deixe claro que os dados do componente são simulados.

## 4. Diagramas (somente Excalidraw/SVG)

Os diagramas são gerados **por código** a partir de um mini-DSL, e o resultado sai no estilo Excalidraw.

1. Crie `scripts/excalidraw/diagramas/<mN>/<nome>.mjs`. Use a pasta `m1`…`m7` ou `galaxies`. Veja os exemplos em `diagramas/m1/` e `diagramas/galaxies/arquitetura.mjs`.
2. Gere os arquivos: `cd scripts/excalidraw && node build.mjs <mN>/`. O filtro evita regenerar os diagramas dos outros.
3. **Revise visualmente.** Rode `node preview.mjs <dir-scratch> ../../static/diagramas/<mN>/<nome>.light.svg` e abra o PNG gerado.
   - Nada pode se sobrepor, sair da caixa ou ficar ilegível.
   - As setas precisam apontar para o lugar certo.
4. Use na aula com `<Sketch name="<mN>/<nome>" alt="..." />`.

API do DSL (`scripts/excalidraw/dsl.mjs`):

```js
const d = new Diagram();
d.title(x, y, 'Título');                         // fonte 32
d.box(id, x, y, w, h, 'texto\ncom quebra', 'verde', {strokeWidth: 3, fill: 'solid', bg: '#fff', fontSize: 18});
d.note(id, x, y, w, h, 'nota tracejada', 'vermelho', {textColor: '#e03131'});
d.ellipse(...); d.diamond(...);
d.badge(id, cx, cy, 1, 'roxo');                  // círculo numerado
d.text(x, y, 'texto livre', {size: 20, color: '#6741d9', align: 'left'});
d.arrow('idA', 'idB', {label: 'rótulo', from: 'bottom', to: 'top', via: [[x,y]], dashed: true, cor: 'laranja', both: true});
d.arrowXY(x1, y1, x2, y2, {label});
d.line([[x,y],[x,y]], {dashed: true, strokeWidth: 3});
export default d.elements;
```

- **Texto não quebra sozinho.** Use `\n` e dimensione a caixa para caber: cerca de 11 px por caractere com fonte 20, e cerca de 28 px por linha.
- **Largura** do diagrama até cerca de 1.300 px. Prefira layouts mais largos que altos.

**Semântica das cores** (a mesma em toda a trilha):

| Cor | Significado |
| :--- | :--- |
| `azul` | entrada, dados brutos, o que se sabe antes |
| `verde` | modelo, treino, predição, o que dá certo |
| `roxo` | LLM, agente, orquestração |
| `laranja` | extração multimodal, VLM, vídeo |
| `amarelo` | explicação, SHAP, resultado real |
| `ciano` | histórico do canal, comparáveis, retrieval |
| `vermelho` | vazamento, erro, alerta, o que só existe depois |
| `cinza` | infraestrutura, base, neutro |

**Mermaid** pode ser usado para fluxos simples. O visual *handDrawn* só funciona em flowchart e state. Para diagramas centrais da aula, prefira Excalidraw.

## 5. Matemática

- O KaTeX está habilitado **sem cifrão simples**, para que "R$ 10" não vire fórmula.
  - Fórmula inline: `$$\hat{y} = f(x)$$` dentro da frase.
  - Bloco: `$$` sozinho numa linha, a fórmula, e `$$` sozinho em outra.
- Notação padrão da trilha:
  - $$y$$ = `log1p(curtidas)` ou alvo relativo;
  - $$\hat{y}$$ = previsão;
  - $$x$$ = vetor de features;
  - $$q_\alpha$$ = quantil $$\alpha$$.

## 6. Código

**Não há repositório starter nem notebooks.** Todo código vive nas aulas, e por isso precisa ser **completo, executável e testado**.

- Python **3.12**. Cada módulo abre, na primeira aula dele, com um bloco "Ambiente" (`:::info[Ambiente deste módulo]`) contendo o `uv add ...` com as versões fixadas usadas na aula. Veja a lista em §8.
- **Trechos autocontidos:** imports no topo, dados de exemplo gerados no próprio trecho quando necessário (por exemplo, um DataFrame sintético pequeno) e saída esperada em comentário quando ajudar.
- **Até cerca de 60 linhas por bloco.** Se precisar de mais, quebre em etapas numeradas.
- **Teste tudo** no venv compartilhado:
  - Rode com `/private/tmp/claude-501/-Users-gabriel-inteli-inteli-academy-autoestudos/5e2e0f4b-17e2-41ff-a6a1-23a62bfc2a0b/scratchpad/venv/bin/python`.
  - **Não instale pacotes nesse venv.** Se precisar de algo que não está lá, crie outro com `uv venv --python 3.12` no seu diretório de scratch.
- Trechos que dependem de chave de API (YouTube, Gemini, Groq) ou de GPU:
  - Valide ao menos que importam e que as chamadas batem com a API real da versão fixada. Confira assinaturas com `help()` ou `inspect` no venv.
  - Marque no código: `# requer YOUTUBE_API_KEY` ou `# testado em CPU com modelo pequeno`.
- Nunca use APIs descontinuadas. Veja "o que mudou" em §8.
- Blocos de código **sempre** com linguagem: `python`, `bash`, `json`, `toml`, `text`.

## 7. Links

- Links internos são absolutos e sem baseUrl: `/aulas/ml-preditivo-e-agentes/<modulo>/<aula>` e `/projetos/galaxies/<pagina>`.
- O mapa completo de slugs está em `src/data/trilha.ts`. Todas as aulas e páginas já existem, algumas ainda como stub, então linkar para elas é seguro.
- Aulas já existentes que valem link cruzado:
  - `/aulas/rag-e-rerankers/embeddings`
  - `/aulas/rag-e-rerankers/vector-databases`
  - `/aulas/rag-e-rerankers/retrieval`
  - `/aulas/eval-driven-development/llm-as-a-judge-e-g-eval`
  - `/aulas/eval-driven-development/avaliacao-de-agentes-e-tool-calling`
  - `/aulas/eval-driven-development/criacao-e-curadoria-de-golden-datasets`
  - `/aulas/eval-driven-development/metricas-deterministicas-e-heuristicas`
  - `/aulas/conceitos-basicos-de-llm/function-calling`
  - `/aulas/conceitos-basicos-de-llm/alucinacao`
- Hub do projeto:
  - `/projetos/galaxies`
  - `/projetos/galaxies/roadmap`
  - `/projetos/galaxies/monte-sua-base`
  - `/projetos/galaxies/stack-2026`
  - `/projetos/galaxies/leituras`
  - `/projetos/galaxies/templates`
  - `/projetos/galaxies/autoavaliacao`
  - `/projetos/galaxies/troubleshooting`
  - `/projetos/galaxies/glossario`
- Antes de terminar, rode `node scripts/check-mdx.mjs <pasta>` (a partir de `autoestudos/`). **Não rode `npm run build`**: vários autores trabalham em paralelo, e quem roda o build é o revisor.

## 8. Fatos verificados (set/2026)

Use estes fatos; eles foram checados. Qualquer outro número precisa de fonte.

**Versões usadas nos trechos** (resolvidas juntas no venv compartilhado, Python 3.12):

`pandas==3.0.6 numpy==2.5.3 scipy==1.18.1 scikit-learn==1.9.1 lightgbm==4.7.0 catboost==1.2.10 xgboost==3.4.1 shap==0.52.0 mapie==1.5.0 mlflow==3.16.1 optuna==5.0.0 pydantic==2.13.5 pandera==0.33.1 pyarrow==25.0.1 duckdb==1.5.5 google-api-python-client==2.200.0 isodate==0.7.2 tenacity==9.1.4 httpx==0.28.1 google-genai==2.25.0 langgraph==1.2.12 langchain==1.4.2 langchain-core==1.6.5 langchain-mcp-adapters==0.3.2 fastmcp==3.4.7 mcp==1.30.0 sentence-transformers==6.1.0 transformers==5.17.0 torch==2.14.0 opencv-python-headless==5.0.0.93 scenedetect==0.7.1 faster-whisper==1.2.1 librosa==1.0.0 faiss-cpu==1.15.1 yt-dlp==2026.8.19`

**MCP: combinação que funciona num ambiente só.**
- `langchain-mcp-adapters 0.3.2` exige `mcp<2`. Por isso a trilha usa **`fastmcp==3.4.7` + `mcp==1.30.0`**.
- Existem o FastMCP 4.x (PrefectHQ, ago/2026) e o SDK oficial `mcp` 2.x, em que `FastMCP` foi renomeado para `MCPServer`, sem alias. Os dois são incompatíveis com o adapter atual. Mencione isso como pegadinha.
- A spec do MCP em vigor é a revisão 2026-07-28, que é *stateless*: sem `initialize`, com versão e capacidades no `_meta` e um novo `server/discover`. O `mcp` 1.30 fala a versão 2025-11-25, com handshake.
- No macOS, FAISS + LightGBM no mesmo processo dão segfault (use `OMP_NUM_THREADS=1`), e `torch` importado antes do `lightgbm` também.
- O `MultiServerMCPClient` abre uma sessão por chamada se você não usar `client.session(...)`.

**LangGraph 1.x.** `langgraph.prebuilt.create_react_agent` está descontinuado. Use `from langchain.agents import create_agent` para ReAct, ou `StateGraph` para um fluxo determinístico.

**YouTube Data API v3**

Custos em unidades:

| Chamada | Custo | Observação |
| :--- | :--- | :--- |
| `channels.list` | 1 | até 50 IDs |
| `playlistItems.list` | 1 | até 50 itens por página |
| `videos.list` | 1 | até 50 IDs |
| `search.list` | 1 por chamada | **bucket próprio de 100 chamadas/dia** desde 01/06/2026; antes custava 100 unidades da cota geral |

Cota padrão de 10.000 unidades/dia, zerada à meia-noite do horário do Pacífico.

Outros fatos:
- **Uploads:** `channels.list(part=contentDetails)` devolve `relatedPlaylists.uploads`, que é `UU` + ID do canal sem o `UC`.
- **Shorts:** não existe campo `isShort`. Desde out/2024, vídeos verticais de até 3 min são Shorts. Truques não-oficiais: a playlist `UUSH`+ID e o redirect de `youtube.com/shorts/ID`.
- **Contagem de views de Shorts:** mudou em 31/03/2025 (replays passaram a contar) e de novo em 24/08/2026 (view desde o 1º frame). São quebras de regime, por isso prefira **likes** como alvo.
- **`videos.batchGetStats`** existe desde 03/06/2026, com balde próprio de 10.000 unidades/dia: é o jeito barato de atualizar estatísticas.
- **`search.list` por canal** devolve no máximo 500 vídeos. Antes de 15/10/2024, o limite de Short era 60 s.
- **`subscriberCount`** vem arredondado para 3 algarismos significativos.
- **Likes:** `dislikeCount` é privado desde dez/2021. Trate `likeCount` ausente como nulo.
- **Developer Policies:**
  - dados não autorizados guardados por no máximo **30 dias**, com refresh;
  - restrição a *derived metrics* (III.E.4.h e a nova seção III.L, de 01/06/2026);
  - restrição a agregar dados de canais de donos diferentes (III.E.2);
  - scraping proibido (III.E.6), e isso afeta o yt-dlp.

  Trate como discussão ética/legal, não como aconselhamento jurídico.

**Gemini API**
- Modelos atuais: `gemini-3.5-flash-lite` (GA 21/07/2026), `gemini-3.8-flash` e `gemini-2.5-flash-lite` (mais barato). O `gemini-2.0-flash` foi desligado em 01/06/2026.
- Os limites do free tier não são mais publicados em número: veja no AI Studio.
- **No free tier, os dados podem ser usados pelo Google e lidos por revisores humanos.**
- Aceita **URL pública do YouTube** direto (até cerca de 8 h de vídeo/dia no free tier).
- Custo em tokens de vídeo: 1 fps; 66 tokens/frame em resolução baixa, 258 no padrão; mais 32 tokens/s de áudio.
- SDK `google-genai` 2.25.0. Structured output via schema Pydantic. A doc agora lidera com a Interactions API, e `generateContent` segue suportado.

**Groq Whisper (free):** 20 RPM, 2.000 requisições/dia, 28.800 segundos de áudio/dia, arquivo de até 25 MB.

**Modelos abertos**
- SigLIP 2: por exemplo, `google/siglip2-base-patch16-224` (multilíngue, Apache-2.0).
- Qwen3-VL 2B/4B/8B (Apache-2.0).
- Gemma 4 (Apache-2.0, imagem e vídeo; áudio em E2B/E4B/12B).
- SmolVLM2 (256M, 500M, 2.2B).

**Bibliotecas: mudanças e armadilhas**
- `decord` está abandonado; use torchcodec ou ffmpeg/PyAV.
- MediaPipe 1.0 **removeu `mp.solutions`**; use `mp.tasks.vision.FaceDetector`.
- PySceneDetect 0.7 mudou a API de timestamps.
- Ultralytics (YOLO) é **AGPL-3.0**.
- EasyOCR está parado desde 2024; PaddleOCR 3.x (PP-OCRv6) está ativo.

**SHAP, MAPIE, MLflow e boosting**
- SHAP 0.52 exige Python ≥3.12.
- MAPIE 1.x:
  - fluxo `fit` → `conformalize(X_cal, y_cal)` → `predict_interval`;
  - classes `SplitConformalRegressor` e `ConformalizedQuantileRegressor`;
  - **`train_conformalize_test_split` é aleatório**, então separe por data à mão.
- MLflow 3: `log_model(..., name=...)` substitui `artifact_path`.
- LightGBM: `objective="quantile", alpha=0.9`. CatBoost: `loss_function="MultiQuantile:alpha=0.1,0.5,0.9"`.

**Literatura** (use estes números; os papers estão em `/projetos/galaxies/leituras`)
- **SMP Challenge**
  - Vencedor de vídeo em 2025: MVP (arXiv:2507.00950). X-CLIP + CatBoost com perda Huber, alvo `log2(views/dias)+1`, MAPE 0,1754.
  - Em 2026, a trilha de vídeo foi vencida com MAPE 0,1529.
  - O HyperFusion (arXiv:2507.00926) é da trilha de **imagem**, 3º lugar.
- **SMTPD** (Xu et al., CVPR 2025, arXiv:2503.04446): 282 mil vídeos do YouTube, popularidade diária por 30 dias. **Duração média de cerca de 30 min, ou seja, majoritariamente long-form.**
- **Understanding Virality** (Gupta et al., arXiv:2512.21402)
  - Base: 11 mil Shorts educativos. Gemini extrai atributos, all-mpnet-base-v2 + K-Means gera 20 clusters, XGBoost prevê.
  - Resultados: Spearman 0,71 e 76,3% par-a-par.
  - SHAP: energia de áudio 12,4%, movimento 10,7%, contraste texto/fala 9,1%, cortes 7,6%.
  - **Críticas:** split aleatório, não temporal; alvo likes/views; sem código nem dados liberados.
- **LLMs Are Natural Video Popularity Predictors** (Kayal et al., Findings ACL 2025): 13.639 vídeos. LLM zero-shot 82% vs. rede supervisionada 80%; combinação 85,5%.
- **MMRA** (SIGIR 2024): retrieval de vídeos similares num memory bank para prever popularidade (MicroLens-100K).
- **Expectativa do briefing:** Spearman de cerca de 0,55–0,85 antes da publicação. Features do canal dominam; o visual soma +0,02 a +0,04. A Galaxies considera cerca de 60% par-a-par uma prova de conceito.

## 9. O fio condutor

A marca **Lumina Beauty** tem cerca de 180 mil inscritos e mediana de cerca de 2.300 curtidas por Short nos últimos 90 dias. Ela escolhe entre dois Shorts:

| | Short A: "Pele natural em 5 passos" | Short B: "1 produto, 20 segundos" |
| :--- | :--- | :--- |
| Formato | tutorial, 55 s | antes/depois, 22 s |
| Início | logo da marca (gancho fraco) | metade do rosto sem maquiagem (gancho forte em 2 s) |
| Áudio | voiceover calmo e explicativo | música animada |
| Visual | rosto o tempo todo, sem texto na tela | rosto, texto grande na tela |
| Publicação planejada | terça, 14h | quinta, 19h |

Exemplo secundário: o canal **Garagem 22** (automotivo) decide entre um POV de direção e um close do interior de um SUV.

Cada aula tem uma seção `<NoProjeto>` dizendo o que aquele conteúdo muda na análise de A vs. B. Seja consistente: por exemplo, B tende a performar melhor em conteúdo, mas **a previsão tem incerteza** e a aula de intervalos mostra que os intervalos se sobrepõem.

## 10. Checklist antes de entregar uma aula

- [ ] Frontmatter completo; `<LessonMeta>` com semana e etapa certas.
- [ ] Prosa entre 1.500 e 2.500 palavras; H2 separados por `---`.
- [ ] Pelo menos 1 diagrama Excalidraw revisado visualmente, ou um componente interativo quando a aula tiver um.
- [ ] Todo código executado no venv (ou marcado e validado contra a API real).
- [ ] `<NoProjeto>`, erros comuns, quiz (3–5 perguntas com explicações), exercício com `<details>`, resumo, referências e próxima aula.
- [ ] Nenhum número sem fonte; nenhuma API descontinuada.
- [ ] `node scripts/check-mdx.mjs <pasta>` passa.
