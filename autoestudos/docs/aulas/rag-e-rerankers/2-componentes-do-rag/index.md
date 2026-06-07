# Componentes do RAG

## A arquitetura por dentro

Um sistema RAG não é um bloco monolítico, é um pipeline com componentes bem definidos que se comunicam entre si. Entender cada um desses componentes individualmente é fundamental porque, na prática, a maior parte do trabalho de engenharia em RAG consiste em ajustar, substituir ou otimizar cada peça de forma independente. Um pipeline RAG que funciona bem em um domínio pode precisar de uma configuração completamente diferente em outro, e saber exatamente onde "mexer" é o que separa uma implementação ingênua de uma implementação de produção.

## A Base de Conhecimento

Tudo começa com a base de conhecimento, o repositório de informações que o sistema RAG pode consultar. Ela é, em essência, a memória externa do sistema. Pode conter PDFs, páginas web, documentos Word, slides, transcrições de reuniões, e-mails, wikis internos, resultados de queries de banco de dados, qualquer fonte de informação textual (e, em sistemas multimodais, também imagens e áudio).

A grande maioria desses dados é **não estruturada**, o que significa que não segue um esquema fixo. Um artigo científico, uma política de RH e um e-mail de suporte técnico são todos "texto", mas têm formatos, vocabulários e densidades de informação completamente diferentes. Um dos desafios centrais do RAG é lidar com essa diversidade de forma que o sistema consiga recuperar informações relevantes independentemente de como elas foram originalmente formatadas.

<img src={require('@site/static/img/fontededados.png').default} alt="Fontes de Dados" style={{width: '100%'}} />

Um aspecto crítico frequentemente negligenciado é a **qualidade dos dados** na base de conhecimento. RAG é, em última análise, uma máquina de recuperação e síntese, se a base de conhecimento contém informações erradas, contraditórias ou desatualizadas, o sistema vai recuperá-las e o LLM vai usá-las para gerar respostas igualmente problemáticas. Garbage in, garbage out. Manter a base de conhecimento atualizada, curada e de alta qualidade é uma responsabilidade operacional permanente, não apenas uma tarefa de configuração inicial.

Antes de entrar no banco de dados vetorial, os documentos da base de conhecimento precisam ser pré-processados: divididos em pedaços menores chamados *chunks*, convertidos em representações numéricas chamadas *embeddings*, e indexados para busca eficiente. Esse processo de ingestão é a primeira grande etapa do pipeline.

## O Recuperador (Retriever)

O recuperador é o componente responsável por encontrar, dentro da base de conhecimento, os documentos mais relevantes para uma determinada consulta. Ele faz isso transformando tanto a consulta quanto os documentos em vetores numéricos, os embeddings, e buscando os documentos cujos vetores estão mais próximos do vetor da consulta no espaço multidimensional.

A intuição por trás disso é que documentos semanticamente similares produzem vetores parecidos, mesmo que usem palavras diferentes. Uma consulta sobre "como alimentar um cachorro" pode recuperar um documento que fala sobre "dieta canina" mesmo sem nenhuma palavra em comum, porque os embeddings capturam o significado subjacente de ambos os textos.

A eficiência do recuperador depende diretamente da qualidade do modelo de embedding utilizado e da estrutura do índice vetorial. Modelos de embedding mais modernos capturam nuances semânticas mais ricas; índices bem configurados permitem buscas rápidas mesmo em coleções com dezenas de milhões de documentos.

<img src={require('@site/static/img/fluxoretriavel.png').default} alt="Fluxo do processo de retrieval" style={{width: '100%'}} />

## A Camada de Integração

A camada de integração é o "maestro" do sistema, ela coordena o fluxo de dados entre todos os outros componentes. Quando o usuário faz uma pergunta, é a camada de integração que aciona o recuperador, recebe os documentos relevantes, e então constrói um novo prompt que combina a pergunta original com o contexto recuperado.

Esse processo de construção do prompt aumentado (*augmented prompt*) é mais sofisticado do que simplesmente colar o texto dos documentos antes da pergunta. Uma boa camada de integração decide quantos documentos incluir (respeitando o limite da janela de contexto do LLM), em que ordem apresentá-los, como formatá-los, e que instruções dar ao LLM sobre como usá-los. Frameworks como LangChain e LlamaIndex oferecem abstrações poderosas para implementar essa lógica, mas a escolha das estratégias específicas é sempre domínio-dependente.

## O Gerador (Generator)

O gerador é o LLM em si, o componente que recebe o prompt aumentado e produz a resposta final. Em um sistema RAG bem construído, o LLM não precisa "lembrar" de nada: toda a informação necessária foi fornecida no contexto. O papel do LLM é sintetizar, raciocinar sobre o contexto fornecido, e gerar uma resposta coerente e bem formulada em linguagem natural.

Modelos como GPT-4, Claude, Llama ou Granite podem ser usados como geradores. A escolha do modelo impacta a qualidade da síntese e da linguagem, mas não tem efeito direto sobre o recall do retrieval, essa é uma separação importante que permite otimizar cada componente de forma independente.

## O Reranker: o componente frequentemente esquecido

Entre o recuperador e o gerador, existe um componente opcional mas extremamente valioso: o reranker. O recuperador é otimizado para velocidade e recall, ele busca rapidamente um conjunto grande de candidatos que provavelmente contêm informações relevantes. Mas essa rapidez tem um custo: os documentos recuperados nem sempre estão na melhor ordem de relevância.

O reranker recebe esse conjunto de candidatos e os reavalia com muito mais atenção, considerando a relação semântica precisa entre a consulta e cada documento. Ele é mais lento que o recuperador, mas muito mais preciso, e opera sobre um número muito menor de documentos (tipicamente 20 a 50, não milhões). O resultado é um conjunto pequeno e bem ordenado de documentos que o LLM pode usar com máxima eficiência.

## O fluxo completo

Com todos os componentes em mente, o fluxo completo de uma consulta RAG funciona assim: o usuário submete uma pergunta; a camada de integração aciona o recuperador, que busca os documentos mais relevantes na base de conhecimento (usando busca vetorial, lexical, ou ambas); opcionalmente, o reranker reordena esses documentos por relevância precisa; a camada de integração constrói um prompt aumentado com a pergunta e o contexto; o gerador produz a resposta; e, finalmente, o handler de saída formata a resposta, incluindo, idealmente, as citações das fontes utilizadas.

<img src={require('@site/static/img/ragfullpipeline.png').default} alt="Fluxo completo pipeline RAG" style={{width: '100%'}} />

## As três gerações do RAG

É útil conhecer as variantes arquiteturais que existem, porque elas representam diferentes pontos na curva de complexidade versus qualidade.

O **Naive RAG** é a implementação mais simples: recuperação direta seguida de geração, sem nenhuma otimização. É excelente para provas de conceito e para entender o problema, mas raramente satisfatório em produção. Os erros são frequentes, a ordem dos documentos pode ser subótima, e o sistema não tem mecanismo de feedback para aprender com seus próprios erros.

O **Advanced RAG** adiciona camadas de sofisticação: reranking dos documentos recuperados, híbrido de busca vetorial e lexical, reescrita de queries, e feedback loops que permitem ao sistema melhorar ao longo do tempo. É o padrão esperado para aplicações de produção sérias que exigem alta precisão.

O **Modular RAG** leva a composabilidade ao extremo, tratando cada componente como um módulo independente e intercambiável. Quer trocar o modelo de embedding? Basta substituir o módulo. Quer adicionar um step de validação de fatos antes de retornar a resposta? É só inserir um módulo na pipeline. Essa arquitetura é ideal para organizações que precisam de alta customização e manutenção granular de cada componente.

<img src={require('@site/static/img/3arquiteturasrag.png').default} alt="Comparação das três arquiteturas" style={{width: '100%'}} />

## A janela de contexto como restrição central

Um constraint que permeia toda a arquitetura RAG é a **janela de contexto** do LLM, o limite máximo de tokens que o modelo consegue processar em uma única chamada. Janelas maiores (GPT-4 suporta até 128k tokens; Claude, até 200k) parecem resolver o problema, mas pesquisas mostram que LLMs têm dificuldade em prestar atenção igualmente em todo o contexto: eles tendem a focar mais no início e no final, negligenciando informações no meio, o fenômeno conhecido como "Lost in the Middle".

Isso significa que simplesmente aumentar a janela de contexto não é uma solução completa. O objetivo não é passar mais documentos para o LLM, mas sim passar os documentos **certos**, na **quantidade certa**, na **ordem certa**. É aqui que o reranker se torna indispensável.

## Próximos Tópicos

Com a arquitetura geral em mente, vamos agora mergulhar nos detalhes de cada componente, começando pelo chunking, a etapa de pré-processamento que determina como os documentos são divididos antes de serem indexados.
