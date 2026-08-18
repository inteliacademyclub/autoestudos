---
sidebar_position: 5
sidebar_label: 'A Tríade do RAG'
---

# Avaliando Pipelines RAG: A Tríade do RAG e Diagnóstico de Falhas

Quando um usuário faz uma pergunta para um sistema RAG (Retrieval-Augmented Generation) e recebe uma resposta errada ou incompleta, surge uma dúvida crucial de engenharia:

> *"O sistema errou porque o motor de busca (Retriever) não encontrou os documentos certos, ou porque o modelo de linguagem (LLM) alucinou mesmo recebendo as informações corretas?"*

Se você avaliar o pipeline RAG apenas como uma "caixa-preta" olhando apenas a resposta final, você nunca saberá se deve mexer nos embeddings, na estratégia de chunking, no reranker ou no prompt do modelo.

Para resolver esse mistério, a indústria desenvolveu o framework da **Tríade do RAG (RAG Triad)**.

<div align="center">

![A Tríade do RAG](/img/triaderag.png)

</div>

---

## Os Três Pilares da Tríade do RAG

A Tríade avalia as três relações fundamentais de qualquer consulta RAG:
* **Context Relevance & Context Recall**: Entre a **Pergunta do Usuário** e o **Contexto Recuperado**.
* **Faithfulness / Groundedness**: Entre o **Contexto Recuperado** e a **Resposta Gerada** (medindo ausência de alucinação).
* **Answer Relevance**: Entre a **Pergunta do Usuário** e a **Resposta Gerada** (medindo se a resposta atende à intenção original).

---

### 1. Métricas de Retrieval (Avaliando o Motor de Busca)

Antes de gerar qualquer palavra, o sistema precisa buscar informações de qualidade. Aqui medimos duas dimensões:

#### A. Context Relevance / Context Precision
* **O que mede**: Dos 10 pedaços de texto (chunks) que o seu banco vetorial recuperou, quantos realmente tinham a ver com a pergunta do usuário?
* **O problema do ruído**: Se você trouxer 8 chunks inúteis e apenas 2 relevantes, o modelo pode sofrer com distração de atenção e gerar respostas confusas (o fenômeno conhecido como *Lost in the Middle*).
* **Meta**: Maximizar a precisão para enviar ao LLM apenas o contexto estritamente necessário.

#### B. Context Recall
* **O que mede**: O sistema de busca conseguiu recuperar **todas** as informações essenciais necessárias para responder à pergunta por completo?
* **Exemplo**: Se o usuário perguntou *"Quais as 3 condições para cancelamento?"* e o retriever só encontrou 2 das 3 regras no banco, o recall falhou.

---

### 2. Métricas de Geração (Avaliando o Modelo de Linguagem)

Com o contexto em mãos, avaliamos o comportamento do modelo gerador:

#### C. Faithfulness / Groundedness (Fidelidade Factual)
* **O que mede**: A resposta gerada é **100% suportada** pelas evidências presentes no contexto recuperado?
* **A métrica anti-alucinação**: Se o modelo afirmar algo que é factualmente verdade no mundo real, mas que **não estava** no documento fornecido, isso é considerado uma falha de faithfulness no RAG fechado.

:::info[Como medir Faithfulness matematicamente?]
1. A LLM avaliadora quebra a resposta gerada em declarações atômicas (*atomic claims*).
2. Para cada declaração, o avaliador verifica se há evidência textual direta no contexto recuperado.
3. O score é a proporção de declarações verificadas:
```
Score de Faithfulness = (Número de declarações suportadas) / (Total de declarações da resposta)
```
:::

#### D. Answer Relevance (Relevância da Resposta)
* **O que mede**: A resposta respondeu diretamente ao que o usuário perguntou, ou o modelo se esquivou, enrolou ou falou de outro assunto?
* **Exemplo de falha**: Pergunta: *"Qual o horário de funcionamento da agência Paulista?"* $\rightarrow$ Resposta: *"A agência Paulista fica localizada na Avenida Paulista, 1000 e possui estacionamento conveniado."* (A informação é verdadeira e está no contexto, mas não respondeu à pergunta!).

---

## Matriz de Diagnóstico: Onde Está o Problema?

Com a Tríade do RAG configurada, você consegue diagnosticar qualquer falha no seu sistema como um médico lendo um exame de sangue:

| Context Precision/Recall | Faithfulness (Groundedness) | Answer Relevance | Diagnóstico do Sistema | Ação de Engenharia Recomendada |
| :---: | :---: | :---: | :--- | :--- |
| ❌ Baixo | ❌ Baixa | ❌ Baixa | **Falha Crítica de Retrieval** | Ajustar tamanho de chunks, modelo de embedding ou adicionar busca híbrida (BM25 + Reranker). |
| ❌ Baixo | ✅ Alta | ❌ Baixa | **Alucinação Evitada, mas Busca Inútil** | O retriever trouxe lixo, mas o prompt foi seguro e disse "não sei". Melhorar o retriever. |
| ✅ Alto | ❌ Baixa | ✅ Alta | **Alucinação do Gerador** | O retrieval acertou, mas a LLM inventou dados. Baixar a temperatura para 0.0 e reforçar o prompt do sistema. |
| ✅ Alto | ✅ Alta | ❌ Baixa | **Falta de Foco / Evasiva** | A LLM pegou o contexto certo, mas não entendeu a intenção da query. Refinar o prompt para focar na pergunta. |
| ✅ Alto | ✅ Alta | ✅ Alta | **Pipeline Perfeito** | Sistema funcionando no estado da arte em produção! |

---

## O Fenômeno "Lost in the Middle" e a Sensibilidade ao Ruído

Pesquisadores de Stanford e da UC Berkeley descobriram um padrão comportamental fascinante em modelos de linguagem: **as LLMs prestam muito mais atenção no início e no final do prompt, tendendo a ignorar ou esquecer informações posicionadas no meio do texto**.

<div align="center">

![Curva de Atenção: O Efeito Lost in the Middle](/img/curvadeatencao.png)

</div>

Por isso, simplesmente aumentar o seu `top_k` de 5 para 30 documentos não melhora o seu sistema: apenas adiciona ruído, degrada a atenção da LLM e aumenta a sua fatura de tokens. A Tríade do RAG ajuda você a encontrar o equilíbrio cirúrgico de quantos documentos recuperar.

---

## Resumo

* Avaliar pipelines RAG de ponta a ponta sem separar as camadas impede a correção eficiente de bugs.
* **Context Relevance e Recall** medem se o seu motor de busca (Retriever) é preciso e completo.
* **Faithfulness (Groundedness)** mede se o gerador respeita os fatos fornecidos sem inventar nada.
* **Answer Relevance** mede se a resposta atende à dúvida real do usuário final.
* A matriz de diagnóstico permite identificar instantaneamente se a correção deve ser feita nos embeddings/reranker ou no prompt do gerador.

Mas e quando a IA não apenas responde perguntas, mas também toma decisões, navega na web e executa código? No próximo capítulo, vamos aprender a **avaliar Agentes Autônomos e Chamadas de Ferramentas (Tool Calling)**!
