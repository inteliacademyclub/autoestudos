# Introdução ao RAG

## O que é Retrieval-Augmented Generation?

Retrieval-Augmented Generation, ou simplesmente RAG, é uma arquitetura que resolve um dos problemas mais fundamentais dos grandes modelos de linguagem: o fato de que eles sabem muito, mas não sabem de tudo, e o que sabem pode estar desatualizado.

A ideia central é simples, mas poderosa. Em vez de depender exclusivamente do conhecimento que o modelo absorveu durante o treinamento, o RAG permite que o modelo consulte uma base de conhecimento externa antes de responder. Essa base pode conter documentos internos de uma empresa, artigos técnicos, manuais de produto, bases de dados legais, qualquer fonte de informação que o modelo precisaria conhecer para responder com precisão.

Pense desta forma: um LLM sem RAG é como um especialista brilhante que passou anos estudando, mas que foi isolado do mundo desde então. Ele responde com segurança e fluência, mas suas respostas refletem o que ele sabia no momento do "isolamento", a data de corte do treinamento. Com o RAG, esse mesmo especialista ganha acesso a uma biblioteca atualizada. Antes de responder, ele consulta as fontes mais recentes e confiáveis e só então formula sua resposta, fundamentada em evidências concretas.

<img src={require('@site/static/img/basicpipelinerag.webp').default} alt="Fluxo básico RAG" style={{width: '100%'}} />

## Por que os LLMs precisam de ajuda?

Para entender a motivação do RAG, é importante conhecer as limitações intrínsecas dos modelos de linguagem. Os LLMs são treinados em grandes volumes de dados coletados até uma determinada data, o chamado *knowledge cutoff*. Qualquer evento, descoberta ou mudança que ocorra após essa data simplesmente não existe para o modelo. Isso é problemático para aplicações que precisam de informações atualizadas, como notícias, dados financeiros ou políticas corporativas em constante mudança.

Além disso, os LLMs têm uma tendência bem documentada de "alucinar", ou seja, de gerar informações que parecem plausíveis, mas que são factualmente incorretas. Isso acontece porque o modelo não tem acesso à verdade; ele apenas aprende padrões estatísticos de texto e os reproduz de forma convincente. Quanto menos o modelo sabe sobre um assunto específico, maior o risco de alucinação. Ainda assim, o tom confiante da resposta raramente muda, o que torna as alucinações difíceis de detectar sem verificação independente.

Há também o problema do domínio. Um LLM genérico treinado na internet pública simplesmente não tem acesso ao manual interno de procedimentos da sua empresa, aos contratos assinados no último trimestre ou à documentação técnica proprietária dos seus produtos. Retreinar um modelo do zero com esses dados é financeiramente inviável para a grande maioria das organizações, custa dezenas de milhões de dólares e leva meses. O RAG oferece uma alternativa: em vez de incorporar o conhecimento no modelo, conectamos o modelo ao conhecimento de forma dinâmica.

## Como o RAG resolve esses problemas

O RAG funciona inserindo uma etapa de recuperação entre a pergunta do usuário e a geração da resposta. Quando o usuário faz uma pergunta, o sistema primeiro busca os documentos mais relevantes na base de conhecimento, usando técnicas de busca semântica que exploraremos nas próximas seções, e então entrega esses documentos ao LLM junto com a pergunta original. O modelo, agora equipado com contexto relevante e atualizado, gera uma resposta fundamentada no que foi recuperado.

Isso muda completamente a dinâmica do problema. As alucinações se tornam muito menos frequentes porque o modelo tem uma âncora factual concreta para suas respostas. A desatualização deixa de ser um obstáculo porque a base de conhecimento pode ser atualizada independentemente do modelo, basta adicionar novos documentos. E o problema do domínio é resolvido de forma elegante: a organização mantém controle total sobre as fontes que o modelo pode consultar, garantindo que ele responda apenas com base em informações aprovadas e confiáveis.

Outro benefício que frequentemente é subestimado é a rastreabilidade. Um sistema RAG bem construído pode citar as fontes que usou para gerar cada resposta, permitindo que o usuário verifique a informação por conta própria. Isso é crítico em contextos jurídicos, médicos, financeiros ou regulatórios, onde a procedência da informação é tão importante quanto a informação em si.

## Prompting, RAG e Fine-Tuning: quando usar cada um

Frequentemente surge a pergunta: como adaptar um modelo de linguagem para um caso de uso específico? Existem três abordagens principais, Engenharia de Prompt (*Prompting*), Retrieval-Augmented Generation (RAG) e *Fine-Tuning* ,, cada uma servindo a propósitos distintos e muitas vezes complementares.

A abordagem mais simples e imediata é o **Prompting**. Consiste em projetar cuidadosamente as instruções e incluir contexto ou exemplos de respostas desejadas (*few-shot prompting*) diretamente na interação com o modelo. É a forma mais barata e rápida de iterar. O grande desafio, no entanto, é a limitação da janela de contexto: não é viável inserir uma biblioteca inteira de documentos no prompt a cada pergunta, e prompts muito extensos encarecem as requisições, aumentam a latência e podem confundir a atenção do modelo.

Para contornar essa limitação e fornecer **conhecimento** dinâmico de forma escalável, usamos o **RAG**. Ele atua como uma ponte de recuperação sob demanda. O RAG não muda como o modelo "pensa", mas muda o que ele "sabe" no momento exato de formular a resposta. A atualização da informação é trivial: basta adicionar ou remover arquivos da sua base de dados externa. O custo de manutenção é consideravelmente menor do que treinar modelos, a flexibilidade é altíssima e o controle sobre as fontes e fatos é total.

Já o **Fine-Tuning** (ajuste fino) é adequado quando o objetivo é enraizar uma mudança de **comportamento** estrutural no modelo: afinar o estilo de escrita, adotar um tom de voz corporativo específico, forçar saídas em formatos rígidos ou ensinar dialetos e terminologias altamente especializadas. O problema é que usar fine-tuning como "banco de dados" para memorizar fatos é ineficiente, além do custo altíssimo para re-treinar o modelo a cada nova atualização documental, modelos finamente ajustados ainda são suscetíveis a alucinar quando confrontados com cenários que não viram no treinamento.

<img src={require('@site/static/img/ragvsfinevsprompt.png').default} alt="Comparativo Prompting, RAG e Fine-tuning" style={{width: '100%'}} />

Na prática, aplicações estado-da-arte frequentemente combinam essas estratégias: um *prompting* refinado estrutura as instruções, o *RAG* alimenta o contexto dinamicamente com informações verdadeiras, e o *fine-tuning* ajusta permanentemente o tom, a síntese e o comportamento geral de resposta.

## Onde o RAG é usado

O RAG encontrou aplicação em praticamente todo setor que lida com grandes volumes de informação estruturada ou não estruturada. Equipes de atendimento ao cliente usam RAG para responder perguntas sobre produtos com base em documentação atualizada, sem precisar que cada atendente memorize centenas de páginas de manuais. Empresas jurídicas usam RAG para consultar contratos, jurisprudência e regulamentações. Equipes de pesquisa usam RAG para navegar em corpora de artigos científicos e sintetizar informações de múltiplas fontes.

O que todos esses casos têm em comum é a necessidade de respostas fundamentadas em fontes confiáveis e atualizadas, com a conveniência da linguagem natural. O RAG entrega exatamente isso.

## Próximos Tópicos

Nas próximas seções, vamos desmontar o RAG peça por peça. Começaremos pelos componentes fundamentais da arquitetura, depois exploraremos em profundidade cada etapa do pipeline, do chunking dos documentos até a geração final da resposta, e terminaremos com as estratégias de reranking e hybrid search que separam sistemas RAG medíocres de sistemas RAG verdadeiramente robustos.
