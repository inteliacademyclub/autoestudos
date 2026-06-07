# Chunking

## O problema de indexar documentos inteiros

Antes de qualquer documento entrar na base de conhecimento de um sistema RAG, ele precisa passar por um pré-processamento fundamental: ser dividido em pedaços menores, chamados de *chunks*. Essa etapa parece simples à primeira vista, mas tem um impacto desproporcional na qualidade final do sistema. Uma estratégia de chunking mal calibrada é capaz de sabotar um pipeline RAG mesmo que todos os outros componentes sejam excelentes.

A razão pela qual não indexamos documentos inteiros é dupla. Primeiro, os modelos de embedding têm limites de tokens, um documento de 50 páginas simplesmente não pode ser comprimido em um único vetor sem perda massiva de informação. Segundo, mesmo que pudéssemos criar um embedding para um documento inteiro, ele seria uma representação extremamente genérica, uma espécie de média semântica de todas as ideias contidas no texto. Quando o usuário faz uma pergunta específica, esse embedding genérico raramente vai aparecer entre os mais similares, porque é específico demais para qualquer coisa e geral demais para qualquer pergunta concreta.

O chunking resolve isso criando unidades menores e semanticamente mais coesas, que produzem embeddings muito mais precisos e, consequentemente, resultados de retrieval muito mais relevantes.

<img src={require('@site/static/img/chunksendodividido.png').default} alt="Documento sendo dividido em chunks" style={{width: '100%'}} />

## Fixed-Size Chunking: o ponto de partida

A estratégia mais simples e direta é dividir o texto em pedaços de tamanho fixo, medido em tokens ou caracteres. Você define um tamanho, digamos, 512 tokens, e o texto é cortado em pedaços de exatamente esse tamanho, sequencialmente.

Essa abordagem tem o mérito da simplicidade. É fácil de implementar, previsível, e exige zero conhecimento sobre a estrutura interna do documento. Para um protótipo inicial ou para casos onde a natureza do documento é homogênea e bem comportada, pode funcionar bem o suficiente.

O problema é que o texto não respeita fronteiras arbitrárias de tokens. Um corte fixo pode separar uma sentença ao meio, cortar um parágrafo no meio de um argumento, ou juntar em um mesmo chunk o final de um tópico com o início de outro completamente diferente. O embedding resultante tenta capturar o significado de um texto incoerente, o que naturalmente degrada a qualidade do retrieval.

## Chunking por estrutura natural do texto

Uma melhoria imediata é usar as fronteiras naturais do próprio texto como guias de divisão. Parágrafos, sentenças, títulos de seção, todas essas estruturas existem porque o autor as usou deliberadamente para organizar o conteúdo. Respeitar essas fronteiras produz chunks muito mais coesos.

O chunking por parágrafo, por exemplo, garante que cada chunk contenha uma ideia completa. Parágrafos são unidades naturais de pensamento na escrita ocidental, e chunks que respeitam essas fronteiras tendem a produzir embeddings mais precisos. O custo é a variabilidade: parágrafos podem ser muito curtos (uma frase) ou muito longos (várias páginas), e ambos os extremos criam problemas para o sistema de retrieval.

O chunking por sentença resolve a variabilidade ao custo da granularidade: cada chunk fica muito pequeno, o que pode ser bom para documentos técnicos onde cada sentença carrega informação densa, mas problemático quando o contexto de uma sentença depende das que vieram antes.

## Recursive Chunking: a abordagem mais usada na prática

O chunking recursivo, popularizado pelo LangChain com seu `RecursiveCharacterTextSplitter`, representa um bom equilíbrio entre as abordagens anteriores. A ideia é usar uma hierarquia de separadores: o algoritmo tenta primeiro dividir por parágrafos (`\n\n`); se o chunk resultante ainda for grande demais, divide por linhas (`\n`); se ainda for grande, por espaços; e assim por diante.

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""]
)
```

O resultado é que o algoritmo sempre tenta respeitar a estrutura mais natural possível do documento, recorrendo a cortes mais granulares apenas quando necessário. Na maioria dos casos, os chunks saem com fronteiras razoavelmente coesas, sem exigir nenhum conhecimento prévio sobre o documento.

## Semantic Chunking: dividir por mudança de tema

Uma abordagem mais sofisticada é o chunking semântico, que usa os próprios embeddings para detectar onde ocorrem mudanças de tema no texto. O algoritmo calcula a similaridade semântica entre sentenças consecutivas e corta o texto onde essa similaridade cai abruptamente, sinal de que um novo tópico está começando.

A qualidade dos chunks produzidos por essa abordagem tende a ser superior porque as fronteiras são semanticamente motivadas, não arbitrárias. Um chunk de chunking semântico contém exatamente o que "faz sentido junto". O custo, porém, é real: calcular embeddings para cada sentença do documento durante a ingestão é computacionalmente caro, especialmente em coleções grandes. Para bases de conhecimento estáticas e documentos longos e bem estruturados, o custo pode valer a pena. Para ingestão contínua de documentos curtos, talvez não.

## Chunking baseado em estrutura do documento

Para documentos que possuem estrutura explícita, como arquivos Markdown com títulos e subtítulos, PDFs com seções identificáveis, ou páginas HTML, faz muito mais sentido usar essa estrutura como guia de divisão. Cada seção delimitada por um título `##` vira um chunk, por exemplo.

Essa abordagem é poderosa porque a estrutura do documento foi colocada lá pelo autor com intenção: ela reflete a organização lógica do conteúdo. Chunks estruturais são quase sempre semanticamente coesos porque correspondem a unidades de significado que o autor definiu explicitamente.

O ponto fraco é a dependência da qualidade da estrutura. Documentos mal formatados, PDFs scaneados sem reconhecimento de estrutura, ou textos corridos sem hierarquia alguma tornam essa abordagem inaplicável sem pré-processamento adicional.

## Chunk Overlap: preservando o contexto nas bordas

Independentemente da estratégia de chunking escolhida, existe uma técnica transversal que quase sempre melhora os resultados: o *chunk overlap*. A ideia é fazer com que chunks adjacentes compartilhem uma sobreposição de texto, tipicamente entre 10% e 20% do tamanho do chunk.

```
Chunk 1: [tokens 1 a 1000]
Chunk 2: [tokens 800 a 1800]   ← 200 tokens de overlap com o chunk 1
Chunk 3: [tokens 1600 a 2600]  ← 200 tokens de overlap com o chunk 2
```

O overlap resolve um problema específico: informações importantes às vezes ficam nas "bordas" dos chunks, e sem overlap, uma sentença que começa no fim de um chunk e termina no início do próximo ficaria dividida, nenhum dos dois chunks a contém completa. Com overlap, essa sentença estará inteiramente presente em pelo menos um dos chunks, garantindo que o retrieval possa encontrá-la.

<img src={require('@site/static/img/chunksadjacentescomoverlap.png').default} alt="Chunks adjacentes com overlap" style={{width: '100%'}} />

## Como calibrar o tamanho dos chunks

Não existe um tamanho universal ideal para chunks, a resposta certa depende do domínio, do tipo de documento, do modelo de embedding e do tipo de consulta esperado. Mas existem princípios orientadores.

Chunks muito grandes tendem a produzir embeddings genéricos que representam muitos conceitos ao mesmo tempo. Quando o usuário faz uma pergunta específica, esses embeddings genéricos têm baixa similaridade com a consulta, e os documentos relevantes acabam não sendo recuperados. Chunks muito pequenos, por outro lado, tendem a perder o contexto necessário para que o trecho faça sentido isolado. Um único parágrafo técnico pode ser incompreensível sem o parágrafo anterior que estabelece o contexto.

Como ponto de partida prático: chunks entre 500 e 1000 tokens com overlap de 100 a 200 tokens funcionam bem em uma ampla variedade de domínios. Mas isso deve ser tratado como um ponto de partida a ser validado com dados reais, não como uma regra universal.

## Técnicas avançadas: hierarquia e agentes

Para sistemas de alta performance, existem abordagens mais sofisticadas. O **hierarchical chunking** cria chunks em múltiplos níveis de granularidade simultaneamente: um nível de documento (resumo geral), um nível de seção (ideias principais), e um nível de parágrafo (detalhes específicos). Dependendo do tipo de consulta, o sistema pode recuperar no nível mais adequado, uma pergunta ampla sobre "o que esse documento diz" pode ser respondida com o chunk de nível alto; uma pergunta específica sobre um detalhe técnico precisa do nível mais granular.

O **agentic chunking** usa um LLM para decidir onde fazer os cortes, baseando-se no conteúdo semântico real do documento. É a abordagem mais sofisticada e mais cara, mas pode produzir chunks de qualidade muito superior para documentos complexos ou altamente heterogêneos.

O **metadata-enriched chunking** adiciona metadados a cada chunk durante a ingestão, informações como fonte do documento, número da página, seção, data de criação, autor. Esses metadados não apenas melhoram o retrieval (permitindo filtragem por data ou fonte, por exemplo) como também permitem que o sistema produza citações precisas nas respostas.

```json
{
  "text": "Conteúdo do chunk...",
  "metadata": {
    "source": "politica-ferias-2024.pdf",
    "section": "Regras de Acúmulo",
    "page": 7,
    "date": "2024-03-15"
  }
}
```

## O chunking é iterativo, não definitivo

Uma conclusão importante para quem está construindo sistemas RAG é que a estratégia de chunking raramente é acertada na primeira tentativa. É necessário definir métricas de retrieval (Recall@K, por exemplo), criar um conjunto de perguntas representativas com as respostas esperadas, testar diferentes estratégias e medir o impacto de cada uma sobre essas métricas. A estratégia que funciona para um manual técnico pode ser terrível para um dataset de artigos jornalísticos.

O processo correto é empírico: comece com recursive chunking de 500-1000 tokens, meça, itere, e adicione complexidade apenas quando os dados justificarem.

## Próximos Tópicos

Agora que entendemos como dividir documentos em chunks, o próximo passo é entender como transformar esses chunks em representações numéricas, os embeddings, que permitem a busca por similaridade semântica.
