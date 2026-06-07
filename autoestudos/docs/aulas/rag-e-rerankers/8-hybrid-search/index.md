# Hybrid Search

## Por que nenhuma abordagem isolada é suficiente

Ao longo das seções anteriores, exploramos dois paradigmas de busca fundamentalmente diferentes: a busca vetorial (semântica) e a busca lexical (baseada em palavras-chave). Cada uma resolve uma parte do problema de retrieval, e cada uma tem falhas estruturais que a outra resolve. O hybrid search não é apenas uma otimização, é o reconhecimento de que essas falhas são complementares, e que combiná-las produz um sistema mais robusto do que qualquer abordagem isolada.

A busca vetorial é extraordinariamente boa em capturar semântica. Uma query sobre "como reduzir o consumo de energia em servidores" vai encontrar documentos sobre "otimização de eficiência energética em data centers" mesmo sem nenhuma palavra em comum, porque os embeddings de ambos ficam próximos no espaço semântico. Isso é poder real, especialmente para usuários que descrevem seus problemas em linguagem natural informal.

O ponto fraco da busca vetorial aparece quando a query contém informação que não tem semântica no sentido que os embeddings capturam. Um número de processo judicial ("processo 0001234-56.2023.8.26.0100"), uma sigla específica ("EBITDA ajustado"), um nome próprio ("João da Silva Pereira"), ou um código de erro ("ECONNREFUSED") não têm vizinhos semânticos óbvios no espaço vetorial. O modelo de embedding não aprendeu nada útil sobre esses termos porque eles são únicos ou raros demais nos dados de treinamento.

A busca lexical, por sua vez, é excelente exatamente nesses casos. O BM25 não tenta entender o significado de "ECONNREFUSED", ele simplesmente encontra documentos que contêm essa string. Para termos técnicos, nomes próprios, identificadores e qualquer coisa que deva ser correspondida exatamente, o BM25 é muito mais confiável do que embeddings.

<img src={require('@site/static/img/duasforçascomplementares.png').default} alt="Forças complementares: Semântica vs Exata" style={{width: '100%'}} />

Mas o BM25 falha completamente em semântica. "Cachorro" e "cão" são, para o BM25, strings completamente diferentes. Uma query formulada informalmente pode não encontrar documentos que usam terminologia técnica formal, e vice-versa. Usuários que escrevem "não consigo fazer login" podem não encontrar documentos que falam sobre "falha de autenticação".

## Como o hybrid search combina as duas abordagens

A implementação básica do hybrid search executa as duas buscas em paralelo e funde os resultados. A query é enviada simultaneamente para o motor de busca vetorial e para o motor de busca lexical (BM25), cada um retorna sua lista de candidatos, e um algoritmo de fusão produz uma lista unificada e ordenada.

O desafio da fusão é não trivial: os scores das duas buscas estão em escalas completamente diferentes e não são diretamente comparáveis. Um score de similaridade cosseno varia de 0 a 1; um score BM25 pode variar de 0 a dezenas, dependendo da coleção. Normalizar esses scores para a mesma escala antes de combiná-los é uma opção, mas introduz instabilidade quando os scores extremos variam entre queries.

```
# Weighted sum com normalização
score_vetorial_norm = (s_v - min_v) / (max_v - min_v)
score_lexical_norm  = (s_l - min_l) / (max_l - min_l)
score_final = α × score_vetorial_norm + β × score_lexical_norm
```

O método que ganhou ampla adoção por sua robustez e simplicidade é o **Reciprocal Rank Fusion (RRF)**, que ignora completamente os scores absolutos e trabalha apenas com as posições dos documentos em cada lista:

```
RRF(d) = Σ  1 / (k + rank_i(d))
```

A constante `k` (tipicamente 60) suaviza o impacto das posições muito altas, a diferença entre estar na posição 1 e na posição 2 é menor do que a fórmula pura sugeriria. O RRF funciona bem porque a posição num ranking de retrieval de qualidade é um sinal confiável de relevância, e combinar posições de múltiplas fontes robustas tende a produzir um ranking melhor do que qualquer fonte isolada. Não requer hiperparâmetros além de `k`, não requer normalização, e é resistente a outliers de score.

## O parâmetro alpha e quando ajustá-lo

Alguns sistemas de hybrid search oferecem um parâmetro `alpha` que controla o peso relativo das duas abordagens, geralmente definido como a fração do score vetorial no resultado final. Alpha igual a 1.0 significa busca puramente vetorial; alpha igual a 0.0 significa busca puramente lexical; alpha de 0.5 dá peso igual às duas.

A intuição para ajustar alpha é direta: se o domínio é rico em terminologia específica, siglas, nomes e códigos (como direito, medicina, ou engenharia de software), vale a pena aumentar o peso lexical (alpha menor). Se o domínio envolve principalmente linguagem natural e conceitos que podem ser expressos de muitas formas diferentes, o peso vetorial deve ser maior (alpha maior).

| Tipo de Query | Alpha Recomendado | Justificativa |
|---------------|-------------------|---------------|
| Linguagem natural / perguntas abertas | 0.7–1.0 | Semântica domina |
| Termos técnicos mistos | 0.4–0.7 | Equilíbrio |
| Identificadores, códigos, nomes exatos | 0.0–0.3 | Correspondência exata domina |

Na prática, começa-se com alpha = 0.5 e ajusta-se empiricamente com base nas métricas de retrieval medidas no dataset de avaliação. É importante não confiar apenas na intuição, o valor ideal pode ser contraintuitivo para domínios específicos.

## Sparse embeddings: o melhor dos dois mundos em um único vetor

Uma abordagem mais sofisticada que ganhou tração recente é o uso de **sparse embeddings** como alternativa (ou complemento) ao BM25. Modelos como SPLADE (SParse Lexical AnD Expansion) produzem vetores altamente esparsos, a maioria dos valores é zero, e os valores não-zero correspondem a termos relevantes no vocabulário.

A diferença crucial em relação ao BM25 puro é que o SPLADE é um modelo neural treinado para fazer expansão de termos: ele não apenas pondera os termos presentes no documento, mas também "imagina" quais outros termos seriam relevantes e os adiciona ao vetor esparso. Um documento sobre "cão" pode ter valores não-zero para "cachorro", "animal de estimação", "pet", mesmo que essas palavras não apareçam no texto. Isso dá ao SPLADE algo da capacidade semântica dos embeddings densos, mantendo a interpretabilidade e a eficiência dos vetores esparsos.

<img src={require('@site/static/img/sparseembedding.png').default} alt="Sparse Embedding" style={{width: '100%'}} />

O SPLADE pode ser armazenado em bancos de dados vetoriais que suportam índices esparsos (como Qdrant e Milvus) e combinado com busca densa numa única operação de hybrid search dentro do próprio banco de dados.

## Hybrid search + reranking: o pipeline de referência

Quando se combina hybrid search com reranking, chega-se ao pipeline que representa o estado da arte em sistemas RAG de produção:

```
Query
  ↓
Hybrid Search (vetorial + lexical, top 50)
  ↓
Reranker cross-encoder (50 → 5 docs)
  ↓
LLM Generation
```

Cada camada resolve um problema diferente. O hybrid search garante alto recall combinando semântica e correspondência exata. O reranker garante alta precision reordenando os candidatos com a análise profunda de um cross-encoder. O LLM recebe um contexto compacto e altamente relevante, o que maximiza a qualidade da resposta e minimiza o custo de inferência.

Benchmarks em múltiplos datasets de retrieval mostram consistentemente que esse pipeline supera qualquer combinação de duas dessas etapas:

| Configuração | Precision@5 (BEIR) |
|--------------|---------------------|
| Busca vetorial apenas | ~0.45 |
| Busca lexical (BM25) apenas | ~0.42 |
| Hybrid search | ~0.52 |
| Hybrid search + reranker | ~0.65–0.72 |

O ganho acumulado de combinar as três estratégias é substancial, tipicamente 30-40% de melhoria em precision em relação à busca vetorial simples.

<img src={require('@site/static/img/ragsparcecompleto.png').default} alt="Pipeline RAG state-of-the-art" style={{width: '100%'}} />

## Casos de uso onde hybrid search faz diferença

O valor do hybrid search varia com o domínio. Em **atendimento ao cliente**, o híbrido captura tanto a intenção semântica do usuário ("meu produto não funciona") quanto os identificadores específicos que podem aparecer na query (número de pedido, código de produto, SKU). Em **sistemas jurídicos**, a busca vetorial captura conceitos legais similares expressados em diferentes formas, enquanto a lexical garante que citações exatas de leis, números de artigos e nomes de jurisprudência sejam encontrados. Em **sistemas de documentação técnica**, a busca vetorial entende o problema descrito em linguagem natural, enquanto a lexical encontra códigos de erro, nomes de APIs e comandos exatos.

É difícil pensar em um domínio de produção onde hybrid search seja *pior* do que busca pura. O custo de adicionar a dimensão lexical é geralmente baixo, BM25 é extremamente eficiente, e o ganho de recall para queries com termos específicos pode ser enorme.

## Desafios operacionais

O hybrid search adiciona algumas complexidades operacionais que vale mencionar. É necessário manter dois índices sincronizados, o índice vetorial no banco de dados vetorial e o índice invertido para BM25 ,, o que duplica o trabalho de ingestão e atualização. A latência pode aumentar porque duas buscas precisam ser executadas (embora possam ser paralelizadas). E o ajuste do alpha, ou a calibração dos pesos no RRF, requer um dataset de avaliação e um processo de tuning que introduz complexidade adicional ao ciclo de desenvolvimento.

Dito isso, a maioria dos bancos de dados vetoriais modernos oferece hybrid search nativo, abstraindo grande parte dessa complexidade. O Qdrant, o Weaviate e o Milvus, por exemplo, permitem configurar hybrid search em uma única chamada de API, sem precisar gerenciar dois sistemas separados.

## Conclusão

Com todas as peças do pipeline, chunking, embeddings, bancos de dados vetoriais, retrieval, reranking e hybrid search, agora bem compreendidas, você tem o conhecimento fundamental para construir sistemas RAG verdadeiramente robustos e eficientes.
