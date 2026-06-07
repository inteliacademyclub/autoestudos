# Retrieval

## O coração do sistema RAG

Se o chunking e os embeddings são a preparação, e o LLM é o desfecho, o retrieval é o momento crítico que conecta os dois. É aqui que o sistema decide quais informações serão entregues ao modelo, e essa decisão determina, em grande medida, a qualidade da resposta final. Um LLM excelente com contexto ruim vai produzir respostas ruins. Um LLM razoável com contexto excelente pode produzir respostas muito boas. O retrieval não é um detalhe de implementação, é a etapa mais impactante do pipeline.

O problema central é deceptivamente simples: dado um conjunto potencialmente enorme de documentos e uma pergunta do usuário, encontre os documentos mais relevantes. A dificuldade está em que "relevância" é um conceito sutil e multidimensional, e as técnicas disponíveis capturam aspectos distintos dela de maneiras complementares.

## O trade-off entre recall e precision

Antes de explorar as técnicas, é fundamental entender as duas métricas que definem o espaço de trade-offs do retrieval.

**Recall** mede quantos dos documentos relevantes foram de fato recuperados. Um sistema com alto recall não perde documentos importantes, se a resposta está em algum lugar da base de conhecimento, o sistema vai encontrá-la. O custo de um recall baixo é grave: se o documento com a informação correta não foi recuperado, o LLM simplesmente não tem como responder corretamente, independentemente de quão bom ele seja.

**Precision** mede qual proporção dos documentos recuperados é de fato relevante. Um sistema com alta precision retorna pouco ruído, a maioria dos documentos no resultado é genuinamente útil para a query. O custo de uma precision baixa é mais sutil: o LLM recebe muita informação irrelevante, o que desperdiça tokens da janela de contexto, aumenta o custo de inferência, e, criticamente, degrada a qualidade da resposta, porque LLMs têm dificuldade em ignorar completamente informação irrelevante que foi colocada no contexto.

```
recall@K    = (# docs relevantes no top K) / (# total de docs relevantes)
precision@K = (# docs relevantes no top K) / K
```

<img src={require('@site/static/img/diagrama_venn.png').default} alt="Diagrama de Venn da precisão e do recall" style={{width: '100%'}} />

Existe um trade-off natural entre as duas métricas. Aumentar o número de documentos recuperados (top_k maior) tende a melhorar o recall, você está sendo mais generoso na busca, mas piora a precision, porque mais documentos irrelevantes entram no conjunto. A solução para esse dilema é um sistema de duas etapas: retrieval com alto recall seguido de reranking com alta precision. Mas chegamos lá.

## Busca vetorial: semântica em escala

A técnica de retrieval mais fundamental em sistemas RAG modernos é a busca vetorial (também chamada de dense retrieval ou semantic search). Ela funciona convertendo a query do usuário em um embedding e buscando no banco de dados vetorial os chunks cujos embeddings estão mais próximos da query.

A grande vantagem da busca vetorial é que ela captura similaridade semântica além da correspondência de palavras. Uma query sobre "efeitos colaterais de antidepressivos" pode recuperar um documento que fala sobre "reações adversas a inibidores de recaptação de serotonina" sem nenhuma palavra em comum, porque os embeddings de ambos os textos ficam próximos no espaço vetorial.

```python
query_embedding = embedding_model.encode("Como cuidar de cachorros?")
results = vector_db.search(query_embedding, top_k=20)
```

A limitação, no entanto, é real: como discutido na seção de embeddings, os vetores são compressões com perda de informação. Nuances semânticas finas podem se perder, e a busca vetorial é notoriamente ruim para correspondências exatas de termos técnicos, nomes próprios, códigos e identificadores que simplesmente não têm "semântica" no sentido em que os embeddings a capturam.

## Busca lexical: o poder das palavras-chave

A busca lexical, representada principalmente pelo algoritmo BM25 (Best Match 25), é uma abordagem muito mais antiga, mas que permanece extremamente eficaz e complementar à busca vetorial. Em vez de comparar vetores, ela compara as palavras presentes na query com as palavras presentes nos documentos, ponderando pela frequência do termo no documento e pela raridade do termo na coleção (TF-IDF ponderado).

O BM25 é especialmente forte exatamente onde a busca vetorial é fraca. Para queries com termos técnicos muito específicos, siglas, nomes de pessoas, códigos de produto, ou qualquer situação onde a correspondência exata da palavra importa mais do que a similaridade semântica, o BM25 costuma superar a busca vetorial. Um usuário que digita "erro ECONNREFUSED" quer documentos que falem sobre esse erro específico, não documentos semanticamente próximos de "problema de conexão".

```python
results = bm25_index.search("cachorro cuidado alimentação vacinação", top_k=20)
```

A limitação do BM25 é o inverso da busca vetorial: ele não entende semântica. "Cão" e "cachorro" são, para o BM25, palavras completamente diferentes. Uma query em linguagem natural informal pode não encontrar documentos técnicos que usem terminologia formal, e vice-versa.

## Hybrid search: combinando o melhor dos dois mundos

A solução natural para as limitações de cada abordagem é combiná-las. O hybrid search executa ambas as buscas em paralelo, vetorial e lexical, e funde os resultados em uma única lista ordenada. A pergunta é como fundir os resultados de forma inteligente.

O método mais popular é o **Reciprocal Rank Fusion (RRF)**. Em vez de tentar normalizar e combinar os scores das duas buscas (o que é problemático porque estão em escalas completamente diferentes), o RRF considera apenas a posição de cada documento em cada lista:

```
RRF(d) = Σ 1 / (k + rank(d))
```

Onde `k` é uma constante de suavização (tipicamente 60) e `rank(d)` é a posição do documento em cada lista de resultado. Documentos que aparecem bem posicionados em ambas as listas recebem scores RRF altos; documentos que só aparecem em uma das listas recebem scores menores. A elegância do RRF está na simplicidade: não requer calibração de pesos e funciona surpreendentemente bem em uma ampla variedade de domínios.

Empiricamente, o hybrid search supera consistentemente tanto a busca vetorial quanto a lexical isolada em benchmarks de retrieval. Para a maioria dos sistemas de produção, deve ser considerado o ponto de partida, não uma otimização avançada.

## O problema "Lost in the Middle"

Mesmo com um retrieval de alta qualidade, existe um problema que afeta a qualidade da resposta final: LLMs prestam atenção desigual às diferentes partes do contexto. Pesquisas mostraram que modelos tendem a lembrar melhor de informações colocadas no início e no final do contexto, negligenciando o meio. Para um LLM processando 20 documentos, o documento na posição 10 simplesmente tem menos probabilidade de influenciar a resposta do que os documentos na posição 1 ou 20.

As implicações são diretas. Recuperar mais documentos nem sempre melhora a resposta, às vezes piora, porque empurra informações relevantes para o "meio esquecido" do contexto. É melhor recuperar menos documentos, mas garantir que os mais relevantes estejam nas primeiras posições. Isso reforça a importância do reranking: não basta recuperar os documentos certos; é necessário garantir que os mais importantes sejam apresentados ao LLM em posições privilegiadas.

<img src={require('@site/static/img/lostinthemiddle.png').default} alt="Lost in the Middle" style={{width: '100%'}} />

## Otimizações de retrieval

Além da escolha da técnica de busca, existem várias estratégias de pré-processamento e pós-processamento que podem melhorar significativamente a qualidade do retrieval.

A **query expansion** enriquece a query original com termos relacionados antes de buscar, aumentando a chance de encontrar documentos relevantes que usem vocabulário diferente. Uma query simples como "febre" pode ser expandida para "febre temperatura alta hipertermia sintomas", capturando documentos que usam qualquer uma dessas variantes terminológicas.

O **query rewriting** vai além: usa um LLM para reformular a query do usuário de forma mais clara e mais adequada para o retrieval. Queries conversacionais como "e sobre o prazo de entrega?" (que dependem do contexto da conversa para fazer sentido) podem ser reescritas como "qual é o prazo de entrega para pedidos com frete padrão?" antes de serem enviadas ao sistema de busca.

O **parent-child retrieval** é uma técnica elegante para resolver o dilema entre granularidade fina para retrieval e contexto suficiente para o LLM. O sistema indexa chunks pequenos (filhos) para busca precisa, mas ao recuperar um chunk filho relevante, retorna o documento pai (seção completa ou página inteira) para o LLM. Isso combina a precisão do retrieval granular com o contexto abundante necessário para a geração.

<img src={require('@site/static/img/twostageretriavel.png').default} alt="Two-stage retrieval" style={{width: '100%'}} />

O **metadata filtering** permite restringir a busca por metadados antes de calcular similaridade, reduzindo drasticamente o espaço de busca e eliminando documentos irrelevantes por razões estruturais (data, categoria, fonte, etc.) antes mesmo de considerar o conteúdo.

## Métricas de avaliação

Para saber se o retrieval está funcionando bem, é necessário medir. As métricas mais comuns são o **Recall@K** (quantos dos documentos relevantes aparecem no top K resultados), o **MRR (Mean Reciprocal Rank)** (que privilegia a posição do primeiro resultado relevante), e o **NDCG (Normalized Discounted Cumulative Gain)** (que considera tanto a presença quanto a posição de cada documento relevante, dando mais peso para posições mais altas). Para avaliação rápida, o **Hit Rate** (porcentagem de queries onde pelo menos um documento relevante foi recuperado) é uma métrica simples e informativa.

Construir um pequeno dataset de avaliação com 50-100 pares de (query, documentos relevantes esperados) é um investimento que paga dividendos enormes ao longo do desenvolvimento do sistema, porque permite medir objetivamente o impacto de cada mudança na estratégia de retrieval.

## Próximos Tópicos

Agora que entendemos como os documentos são recuperados, chegamos ao componente que frequentemente faz a maior diferença em sistemas RAG de produção: os rerankers.
