# Embeddings

## A ideia central: significado como posição no espaço

Para que um computador consiga comparar o significado de dois textos, ele precisa primeiro representar esses textos de uma forma que permita comparação matemática. É exatamente isso que os embeddings fazem: transformam texto em vetores numéricos, listas de centenas ou milhares de números, de forma que textos com significados similares produzam vetores próximos no espaço multidimensional, e textos com significados diferentes produzam vetores distantes.

A intuição geométrica é poderosa: imagine um espaço onde cada texto ocupa uma posição. Documentos sobre culinária ficam agrupados numa região; documentos sobre tecnologia ficam em outra; documentos sobre medicina ficam em outra ainda. Uma consulta sobre "receitas veganas" vai aterrissar num ponto próximo a outros textos sobre alimentação vegetal, mesmo que esses textos usem palavras completamente diferentes da consulta. É essa capacidade de capturar similaridade semântica além da correspondência lexical que torna os embeddings fundamentais para sistemas RAG.

<img src={require('@site/static/img/espacoembeddings2dcachorroebanco.png').default} alt="Espaço de embeddings 2D" style={{width: '100%'}} />

O que torna isso possível é que os modelos de embedding são treinados em grandes volumes de texto com o objetivo de aprender quais palavras, frases e conceitos tendem a aparecer em contextos similares. "Cachorro" e "cão" aparecem em contextos parecidos na linguagem real, então seus embeddings ficam próximos. "Banco financeiro" e "banco de praça" têm contextos diferentes, então acabam em regiões distintas do espaço, mesmo sendo a mesma palavra. Modelos modernos capturam esse tipo de ambiguidade de forma sofisticada.

## O processo de embedding

Quando um texto passa por um modelo de embedding, o processo acontece em etapas. Primeiro, o texto é tokenizado, dividido em unidades menores (palavras, subpalavras, ou caracteres, dependendo do modelo). Em seguida, cada token é convertido em um vetor numérico inicial baseado em tabelas de lookup. O transformer então processa esses vetores em camadas de atenção, onde cada token "olha" para todos os outros e ajusta sua representação com base no contexto. Por fim, os vetores de todos os tokens são combinados em um único vetor representativo do texto inteiro, geralmente por uma operação de pooling, como a média.

O ponto crucial é a etapa de contextualização. Ao contrário de representações mais antigas como word2vec, onde cada palavra tinha sempre o mesmo vetor independentemente do contexto, os transformers modernos produzem vetores dinâmicos que mudam conforme o contexto ao redor. A palavra "banco" num texto sobre finanças produz um vetor diferente do que num texto sobre parques públicos.

<img src={require('@site/static/img/fluxodeembediing.png').default} alt="Fluxo de embedding" style={{width: '100%'}} />

## Modelos de embedding: como escolher

O mercado de modelos de embedding é rico e competitivo. A OpenAI oferece os modelos `text-embedding-3-small` e `text-embedding-3-large`, que são fáceis de usar via API e têm bom desempenho geral, mas envolvem custo por uso e dependência de infraestrutura externa.

Para quem prefere modelos open-source, o ecossistema do Hugging Face oferece excelentes opções. O `all-MiniLM-L6-v2` é um modelo compacto e rápido, excelente para protótipos ou para casos onde a latência de inferência é crítica. O `bge-large` da BAAI e o `multilingual-e5-large` da Microsoft estão consistentemente no topo dos benchmarks de retrieval. Para texto em português e outros idiomas não-ingleses, modelos com "multilingual" ou "m3" no nome são especialmente importantes, modelos treinados apenas em inglês têm performance significativamente pior em outras línguas.

Existe também uma categoria de modelos especializados para retrieval. O ColBERT, por exemplo, não produz um único vetor por documento, mas um vetor por token, uma abordagem que permite matching muito mais fino entre os tokens da query e os tokens do documento, ao custo de maior uso de armazenamento. O SPLADE produz embeddings esparsos que se comportam de forma similar ao BM25 lexical, mas com a capacidade de generalização dos modelos neurais.

| Modelo | Dimensões | Pontos fortes |
|--------|-----------|---------------|
| `text-embedding-3-large` | 3072 | Uso geral, fácil de usar |
| `bge-large` | 1024 | Excelente para retrieval |
| `multilingual-e5-large` | 1024 | Multilíngue |
| `all-MiniLM-L6-v2` | 384 | Rápido, protótipos |
| `bge-m3` | 1024 | Multilíngue + híbrido |

A referência mais confiável para comparar modelos é o [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard), que avalia centenas de modelos em tarefas de retrieval, clustering, classificação e similaridade semântica.

## Métricas de similaridade

Uma vez que documentos e consultas estão representados como vetores, a comparação entre eles é feita através de métricas de similaridade. A mais comum em sistemas RAG é a **similaridade por cosseno**, que mede o cosseno do ângulo entre dois vetores.

```
cosine_similarity(A, B) = (A · B) / (||A|| × ||B||)
```

O resultado varia de -1 a 1 (e, na prática, de 0 a 1 para embeddings normalizados). Um valor próximo a 1 significa que os vetores apontam na mesma direção, os textos têm significado similar. Um valor próximo a 0 indica ausência de relação semântica. A vantagem da similaridade por cosseno sobre a distância euclidiana é que ela é invariante à magnitude dos vetores, o que a torna mais robusta para textos de tamanhos diferentes.

O **produto escalar** (dot product) é uma alternativa mais rápida, mas requer que os vetores sejam normalizados para produzir resultados equivalentes à similaridade por cosseno. Muitos bancos de dados vetoriais fazem essa normalização automaticamente, então na prática a diferença operacional é mínima.

<img src={require('@site/static/img/similiaridadecosseno2d.png').default} alt="Similaridade cosseno em 2D" style={{width: '100%'}} />

## O problema da compressão: por que embeddings têm limitações

Uma propriedade crucial, e frequentemente subestimada, dos embeddings é que eles são compressões com perda de informação (*lossy compression*). Um documento de três páginas que discute um tema com nuance e detalhamento acaba comprimido em um vetor de 768 ou 1024 números. Por mais poderoso que seja o modelo, inevitavelmente há informação que não cabe nessa representação comprimida.

As consequências práticas são importantes. Primeiro, documentos longos e densos perdem mais informação que documentos curtos e focados, é mais uma razão pela qual chunks menores e semanticamente coesos produzem embeddings mais precisos. Segundo, o embedding de um documento captura uma espécie de "média semântica" de todo o conteúdo, um documento que discute tanto inteligência artificial quanto política pública pode não ser bem recuperado por uma consulta específica sobre nenhum dos dois temas, porque o embedding foi "puxado" para uma região intermediária entre os dois.

Terceiro, e mais importante para entender o papel dos rerankers, os embeddings são criados para os documentos sem saber qual query vai buscá-los. Um bi-encoder (o tipo de modelo usado para embeddings de retrieval) processa query e documento de forma completamente independente. Isso significa que nuances diretamente relevantes para uma query específica podem não estar adequadamente representadas no embedding do documento. Cross-encoders (rerankers) resolvem esse problema processando query e documento juntos, o que exploraremos em detalhe mais adiante.

<img src={require('@site/static/img/informationlosscompressao.png').default} alt="Information loss na compressão" style={{width: '100%'}} />

## Embeddings em sistemas RAG: dois momentos distintos

Em um sistema RAG, os embeddings aparecem em dois momentos distintos do pipeline com propósitos diferentes.

Durante a **indexação**, que acontece uma única vez ou com atualização incremental, cada chunk de texto é convertido em um embedding e armazenado no banco de dados vetorial junto com o texto original e seus metadados. Esse processo pode ser lento e caro computacionalmente, mas acontece offline, antes de qualquer consulta real.

Durante o **retrieval**, que acontece em tempo real a cada consulta, a query do usuário é convertida em um embedding e comparada com todos os embeddings armazenados. Os chunks com maior similaridade são retornados como candidatos. Esse processo precisa ser rápido, idealmente em dezenas de milissegundos, o que coloca exigências sobre tanto o modelo de embedding (que precisa ser eficiente) quanto o banco de dados vetorial (que precisa ter índices otimizados).

Um detalhe técnico importante: o modelo de embedding usado durante a indexação e o modelo usado durante o retrieval precisam ser **o mesmo**. Embeddings de modelos diferentes vivem em espaços vetoriais incompatíveis, comparar um embedding gerado pelo `bge-large` com um gerado pelo `text-embedding-3-small` é matematicamente sem sentido e produziria resultados completamente aleatórios.

## Boas práticas operacionais

Alguns modelos, como a família E5, foram treinados com prefixos distintos para queries e documentos, e é importante usá-los corretamente para obter máxima performance:

```python
# Para indexar documentos
"passage: Os cães são animais domésticos que..."

# Para embeddar a consulta do usuário
"query: Como cuidar de um cachorro?"
```

Usar o prefixo errado, ou nenhum prefixo, pode degradar significativamente a qualidade do retrieval, mesmo com um modelo excelente.

Outro ponto importante é o tratamento de textos que excedem o limite de tokens do modelo. A estratégia mais simples (truncar no final) funciona quando as informações mais importantes estão no início. Mas para documentos onde o conteúdo crítico pode estar em qualquer posição, a solução correta é garantir que o chunking ocorra antes do embedding, nunca deixar um chunk ser grande o suficiente para ultrapassar o limite do modelo.

## Próximos Tópicos

Agora que entendemos como textos são transformados em vetores numéricos, precisamos entender onde esses vetores são armazenados e como são buscados de forma eficiente em escala: os bancos de dados vetoriais.
