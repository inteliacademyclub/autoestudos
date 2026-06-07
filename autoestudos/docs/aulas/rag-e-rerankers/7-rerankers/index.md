# Rerankers

## O problema que os rerankers resolvem

Vimos na seção anterior que o retrieval enfrenta um trade-off fundamental entre recall e precision. Para garantir que nenhum documento relevante seja perdido, o sistema precisa recuperar um conjunto relativamente amplo de candidatos, digamos, os top 25 ou 50 resultados. Mas o LLM não consegue processar 50 documentos sem degradação de qualidade: a janela de contexto tem limites, e o fenômeno "Lost in the Middle" garante que documentos no meio do contexto sejam parcialmente ignorados.

A solução que se estabeleceu como padrão da indústria é um sistema de duas etapas: recupere muitos candidatos com alta velocidade (priorizando recall), e depois reduza esse conjunto a um punhado de documentos altamente relevantes com alta precisão (priorizando precision). Os rerankers são os responsáveis pela segunda etapa.

A pergunta natural é: por que não simplesmente melhorar o retrieval original para ser mais preciso desde o início? A resposta está na arquitetura fundamental dos modelos de embedding.

## Bi-encoders versus cross-encoders

Os modelos de embedding que usamos no retrieval são chamados de **bi-encoders**: eles processam a query e cada documento de forma completamente independente, produzindo vetores separados que são depois comparados por similaridade cosseno. Essa independência é o que torna a busca vetorial tão rápida, os embeddings dos documentos podem ser pré-computados offline, e na hora da consulta só é necessário computar o embedding da query e realizar a busca no índice.

Mas essa independência tem um custo: ao criar o embedding de um documento, o modelo não sabe qual query vai buscá-lo. O embedding captura uma representação "média" do documento, adequada para queries em geral, mas necessariamente imprecisa para qualquer query específica. Nuances relevantes para uma consulta particular podem estar subrepresentadas no embedding.

Os **cross-encoders**, o tipo de modelo usado como reranker, fazem o oposto: eles recebem a query e o documento concatenados em uma única entrada e os processam juntos através de todas as camadas do transformer. O mecanismo de self-attention pode então pesar diretamente cada token da query em relação a cada token do documento, capturando interações semânticas muito mais ricas e sutis.

<img src={require('@site/static/img/biencodervscrossencoder.png').default} alt="Bi-encoder vs Cross-encoder" style={{width: '100%'}} />

```
# Bi-encoder (retrieval)
embed(query) → vetor Q
embed(documento) → vetor D
score = cosine_similarity(Q, D)

# Cross-encoder (reranking)
score = cross_encoder(query + [SEP] + documento)
```

A diferença de qualidade é substancial. Um cross-encoder entende coisas que um bi-encoder frequentemente erra: a direcionalidade de uma relação ("viagem do Brasil para os EUA" vs. "viagem dos EUA para o Brasil"), negações ("sem efeitos colaterais" vs. "com efeitos colaterais"), e condicionais sutis que só fazem sentido quando query e documento são lidos juntos.

## O trade-off: por que não usar cross-encoders para tudo?

Se cross-encoders são mais precisos, por que não usá-los diretamente para o retrieval inicial, eliminando os bi-encoders? A resposta é latência e escala.

Um bi-encoder pode realizar uma busca em 40 milhões de documentos em menos de 100 milissegundos. Isso é possível porque os embeddings dos documentos foram pré-computados e armazenados, e a busca é uma operação de álgebra linear altamente otimizada. O cross-encoder, por outro lado, precisa processar cada par (query, documento) individualmente, sem possibilidade de pré-computação. Em uma GPU V100, rerankar 40 milhões de documentos levaria mais de 50 horas. Isso é obviamente inaceitável para um sistema de tempo real.

A solução elegante do two-stage retrieval tira proveito das forças de cada abordagem: o bi-encoder faz o trabalho pesado de varrer a coleção inteira rapidamente (retrieval), e o cross-encoder faz o trabalho fino de analisar com profundidade os candidatos já filtrados (reranking). O cross-encoder nunca precisa ver mais do que 50-100 documentos por query, uma operação que leva poucos segundos, não horas.

```
Query → Bi-encoder Retrieval (40M → 50 docs) → Cross-encoder Reranking (50 → 5 docs) → LLM
```

<img src={require('@site/static/img/comparacao_velocidade_precisao.png').default} alt="Comparação de velocidade e precisão" style={{width: '100%'}} />

## Implementando two-stage retrieval

Do ponto de vista de implementação, o fluxo é direto:

```python
# Stage 1: retrieval rápido com alto recall
query_embedding = embed_model.encode(query)
candidates = vector_db.search(query_embedding, top_k=25)

# Stage 2: reranking preciso sobre os candidatos
scores = []
for doc in candidates.documents:
    inputs = tokenizer(query, doc, return_tensors="pt", truncation=True)
    with torch.no_grad():
        score = reranker_model(**inputs).logits[0][0].item()
    scores.append(score)

# Ordenar por score e pegar os top N
ranked = sorted(zip(candidates.documents, scores),
                key=lambda x: x[1], reverse=True)
top_docs = [doc for doc, _ in ranked[:5]]

# Geração
response = llm.generate(query, top_docs)
```

Na prática, frameworks como LlamaIndex e LangChain abstraem esse fluxo em componentes configuráveis, mas é importante entender o que está acontecendo por baixo.

## Modelos de reranker disponíveis

O mercado de rerankers oferece tanto modelos open-source quanto APIs gerenciadas.

Entre os modelos open-source, a família **BGE Reranker** da BAAI é uma das mais populares e bem avaliadas. O `bge-reranker-v2-m3` suporta mais de 100 idiomas e apresenta performance excelente em benchmarks multilíngues, o que o torna uma boa escolha para aplicações em português. A família **Jina Reranker** é outra opção open-source competitiva.

Entre as APIs gerenciadas, o **Cohere Rerank** se destaca pela facilidade de uso, é uma chamada de API simples que recebe a query e uma lista de documentos e retorna os documentos reordenados com scores de relevância. O **Voyage AI** também oferece um reranker de alta performance como serviço.

## Tipos de reranker além do cross-encoder

Embora os cross-encoders sejam a abordagem dominante, existem outras arquiteturas que funcionam como rerankers com diferentes trade-offs.

O **RRF (Reciprocal Rank Fusion)** pode ser usado como um reranker simples quando os documentos vêm de múltiplas fontes de retrieval. Ele não requer um modelo neural, apenas combina as posições dos documentos em cada lista de resultado. É extremamente rápido e pode ser uma solução eficaz quando se quer combinar resultados de busca vetorial e lexical sem a latência de um modelo de reranking.

O **ColBERT** representa uma abordagem híbrida interessante. Em vez de produzir um único embedding por documento (como os bi-encoders), o ColBERT produz um embedding por token. O score de relevância é calculado pela soma das similaridades máximas entre os tokens da query e os tokens do documento (MaxSim). Isso permite um matching muito mais fino do que os bi-encoders, com menos overhead computacional do que os cross-encoders.

Os **LLM-based rerankers** usam um LLM através de prompting para avaliar e ordenar documentos. São a abordagem mais flexível, podem ser instruídos com critérios de relevância muito específicos para o domínio, mas são também os mais caros e lentos. Fazem sentido em casos de uso onde a latência não é crítica e onde os critérios de relevância são complexos demais para capturar com um modelo de reranking convencional.

## O custo do reranking e como justificá-lo

É importante ser realista sobre o custo do reranking. Uma busca vetorial simples pode custar frações de centavo por query em volumes de produção. Um reranker neural operando sobre os top 50 candidatos pode custar dezenas de vezes mais. Para sistemas com alto volume de queries, esse custo se torna um fator significativo.

A justificativa econômica do reranking deve ser feita em dois eixos. Primeiro, o reranking reduz o número de documentos que chegam ao LLM, se passamos de 50 documentos para 5, estamos reduzindo drasticamente o custo do LLM, que é geralmente a parte mais cara do pipeline. O custo do reranker pode ser parcialmente compensado pela economia no LLM.

<img src={require('@site/static/img/custorelativoquery.png').default} alt="Custo relativo por query" style={{width: '100%'}} />

Segundo, e mais importante, o reranking melhora a qualidade das respostas, o que tem um valor de negócio real. Em aplicações de customer service, uma resposta incorreta pode custar um cliente. Em aplicações médicas ou jurídicas, pode ter consequências muito mais sérias. O custo do reranking deve ser comparado não apenas ao custo da infraestrutura alternativa, mas ao custo dos erros que ele previne.

## Quando o reranking não é necessário

Honestidade intelectual exige reconhecer que o reranking nem sempre é a resposta certa. Para sistemas com altíssimo volume de queries (busca em e-commerce, por exemplo), a latência e o custo do reranking podem ser proibitivos. Para bases de conhecimento muito pequenas onde o retrieval já é preciso, o benefício pode ser marginal. E para protótipos e MVPs, adicionar um reranker antes de validar o valor básico do sistema pode ser uma otimização prematura.

A melhor prática é sempre estabelecer um baseline sem reranker, medir a qualidade do retrieval com métricas objetivas, e só então avaliar se o reranking traz um ganho mensurável que justifica o custo adicional.

## Próximos Tópicos

Com a intuição sobre rerankers estabelecida, vamos explorar o hybrid search em profundidade, a estratégia de combinar busca vetorial e lexical que se tornou o gold standard para o primeiro estágio do retrieval.
