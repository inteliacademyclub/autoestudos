# Vector Databases

## Por que precisamos de um banco de dados especializado?

Depois de transformar todos os chunks da base de conhecimento em embeddings, precisamos armazená-los em algum lugar que permita busca eficiente por similaridade. Um banco de dados relacional tradicional como PostgreSQL não foi projetado para esse tipo de operação. Ele é otimizado para buscas exatas, "encontre todos os registros onde `status = 'ativo'`", não para buscas do tipo "encontre os vetores mais próximos deste vetor em um espaço de 1024 dimensões".

A busca por similaridade em alta dimensão é computacionalmente desafiadora. A abordagem mais ingênua, calcular a distância entre o vetor da query e cada vetor armazenado, tem complexidade linear no número de documentos. Com mil documentos isso é trivial. Com um milhão de documentos começa a ficar lento. Com cem milhões de documentos se torna completamente inviável para uso em tempo real.

<img src={require('@site/static/img/dbrelacionalvsvectordatabase.png').default} alt="Banco relacional vs Vector database" style={{width: '100%'}} />

Os bancos de dados vetoriais resolvem esse problema através de estruturas de índice especializadas que permitem encontrar os vetores mais próximos de forma muito mais eficiente, sacrificando um grau mínimo de precisão em troca de um ganho imenso em velocidade. Essa troca, chamada de Approximate Nearest Neighbor (ANN), é a base técnica de todo o campo.

## Indexação exata versus aproximada

Na busca exata (ENN), o banco de dados garante que os vetores retornados são matematicamente os mais similares ao vetor da query. Para datasets pequenos, até cerca de 50 mil vetores, isso é perfeitamente viável. Mas conforme o dataset cresce para centenas de milhões de vetores, a busca exata se torna impraticável.

A busca aproximada (ANN) aceita uma pequena margem de erro: em vez de garantir que os resultados são os *mais similares*, garante que são *muito provavelmente os mais similares*. Na prática, algoritmos ANN bem configurados atingem 95-99% de precisão em relação à busca exata, com ganhos de velocidade de uma a três ordens de magnitude. Para sistemas de produção com milhões de documentos, ANN não é uma concessão, é uma necessidade.

## Os principais algoritmos de indexação

O algoritmo mais amplamente adotado em produção é o **HNSW (Hierarchical Navigable Small World)**. Ele constrói um grafo hierárquico de múltiplas camadas sobre o conjunto de vetores: as camadas superiores são grafos esparsos que permitem "saltos longos" pelo espaço vetorial, e as camadas inferiores são grafos mais densos para busca local refinada. Quando uma query chega, o algoritmo começa nas camadas superiores para encontrar a vizinhança aproximada e desce progressivamente para refinar a busca. O HNSW oferece um excelente equilíbrio entre velocidade e qualidade, sendo a escolha padrão para a maioria dos casos.

O **IVF (Inverted File Index)** divide o espaço vetorial em clusters durante uma fase de treinamento offline e, na hora da busca, verifica apenas os clusters mais próximos da query. Isso reduz drasticamente o número de comparações necessárias. O IVF é mais eficiente em memória que o HNSW e funciona bem para datasets muito grandes, mas requer a fase de treinamento e é mais sensível à configuração de hiperparâmetros.

Para situações onde a memória é uma restrição severa, existe a **Product Quantization (PQ)**, que comprime os vetores dividindo-os em subvetores e quantizando cada um independentemente. Um vetor de 1024 dimensões pode ser comprimido em dezenas de bytes, em vez dos 4KB que ocuparia em float32. O preço é uma perda adicional de precisão, mas para cenários com bilhões de vetores onde simplesmente não há RAM suficiente, PQ pode ser a única opção viável.

<img src={require('@site/static/img/algoritmosdeindexação.png').default} alt="Algoritmos de indexação" style={{width: '100%'}} />

## Os principais bancos de dados vetoriais

O ecossistema cresceu rapidamente, e hoje existem muitas opções com características distintas.

**Pinecone** é uma solução totalmente gerenciada em cloud que se destaca pela simplicidade operacional. Não é necessário gerenciar infraestrutura ou configurar índices, tudo é abstraído. É uma excelente escolha para equipes que querem focar na aplicação, não na infraestrutura.

**Qdrant** é open-source, escrito em Rust, focado em performance e filtragem complexa. Seu sistema de "payload filtering" permite combinar busca por similaridade com filtros arbitrários sobre metadados de forma muito eficiente. Está disponível como solução self-hosted ou como serviço gerenciado (Qdrant Cloud).

**Weaviate** se diferencia pela integração nativa com modelos de embedding, é possível configurá-lo para gerar embeddings automaticamente ao indexar documentos. Seu suporte a GraphQL e módulos plugáveis o torna atraente para arquiteturas mais complexas.

**Milvus** é a solução open-source mais robusta para escala massiva, projetado desde o início para bilhões de vetores e suportando os principais algoritmos de indexação. A Zilliz Cloud oferece uma versão gerenciada.

**FAISS** da Meta não é um banco de dados no sentido completo, não tem servidor, não tem API de rede, e não persiste dados automaticamente. É uma biblioteca de busca vetorial extremamente rápida, ideal para protótipos e sistemas embarcados.

**pgvector** é uma extensão do PostgreSQL que adiciona suporte a vetores. Para organizações que já usam PostgreSQL e têm volumes razoáveis de vetores (até alguns milhões), é possível adicionar capacidade vetorial sem introduzir um novo sistema no stack.

## Funcionalidades além da busca básica

A maioria dos bancos de dados vetoriais modernos oferece funcionalidades que vão além da busca por similaridade pura. O **metadata filtering** permite filtrar resultados por metadados antes ou durante a busca:

```json
{
  "vector": [0.23, -0.45, ...],
  "filter": {
    "category": "politica-rh",
    "date": {"$gte": "2024-01-01"}
  },
  "top_k": 10
}
```

Isso é especialmente poderoso em aplicações com múltiplos tenants, múltiplos domínios de documentos, ou quando é necessário restringir o contexto temporalmente. O **hybrid search** nativo, disponível em Weaviate, Milvus, Qdrant e outros, combina busca vetorial e busca lexical (BM25) dentro do próprio banco de dados, simplificando significativamente a arquitetura do sistema.

## Considerações práticas de performance e custo

A performance é determinada por três fatores principais: o algoritmo de indexação escolhido, o hardware disponível (especialmente RAM, já que HNSW carrega o índice em memória), e a dimensionalidade dos vetores.

Um vetor de 1536 dimensões em float32 ocupa 6KB. Um milhão de vetores ocupa cerca de 6GB apenas para os vetores, sem contar o overhead do índice. Para dez milhões de vetores, estamos falando de 60GB de RAM, o que tem implicações diretas sobre a escolha de hardware e custo mensal.

Para escolher entre as soluções, o guia prático é: para prototipação, FAISS ou pgvector oferecem a menor barreira de entrada; para produção de escala média, Qdrant ou Weaviate self-hosted oferecem bom equilíbrio; para escala massiva ou quando a equipe não quer operar infraestrutura, Pinecone ou Zilliz Cloud são as opções mais seguras.

## Próximos Tópicos

Com documentos indexados em um banco de dados vetorial, chegamos à etapa que define a qualidade do sistema RAG: o retrieval. Na próxima seção, exploramos as diferentes técnicas de busca e os trade-offs entre elas.
