---
sidebar_position: 2
sidebar_label: 'Golden Datasets'
---

# Criação e Curadoria de Golden Datasets: O Coração dos Evals

Se você já ouviu a frase clássica da ciência da computação *"Garbage in, garbage out"* (entra lixo, sai lixo), no universo de avaliações de GenAI ela ganha uma nova dimensão: **um teste automatizado só é tão confiável quanto o dataset usado para avaliá-lo**.

Não adianta configurar os juízes neurais mais caros do mercado se a sua base de perguntas de teste for superficial, irrealista ou mal formulada. O **Golden Dataset** (ou *Ground Truth Dataset*) é a pedra fundamental sobre a qual toda a sua estratégia de avaliação é construída.

<div align="center">

![Anatomia de um Golden Dataset](/img/goldendataset.png)

</div>

---

## O que é um Golden Dataset?

Um **Golden Dataset** é uma coleção curada e versionada de casos de teste que representam fielmente os cenários reais que a sua aplicação de GenAI enfrentará em produção.

Ele funciona exatamente como o conjunto de testes de regressão de um sistema bancário: sempre que você alterar um prompt, mudar a estratégia de chunking no seu RAG ou trocar o modelo de LLM, você executa toda essa bateria de testes para verificar se a qualidade geral subiu ou caiu.

### Anatomia de um Caso de Teste Completo

Em sistemas GenAI modernos, uma linha do seu dataset de avaliação deve conter muito mais do que apenas uma pergunta e uma resposta. Veja a estrutura ideal:

```json
{
  "id": "eval_fin_042",
  "query": "Qual é a taxa de juros do empréstimo pessoal para clientes PJ no plano Platinum?",
  "ground_truth": "A taxa de juros para clientes PJ no plano Platinum é de 1,49% ao mês, sujeita a análise de crédito.",
  "contexts": [
    "Tabela de Tarifas PJ 2024 - Seção 4.2: O Plano Platinum oferece taxas reduzidas de 1,49% a.m. para crédito pessoal PJ."
  ],
  "metadata": {
    "category": "credito_pj",
    "difficulty": "media",
    "requires_calculation": false,
    "source": "manual_expert_review"
  }
}
```

* **`query`**: O que o usuário final pergunta, incluindo variações de linguagem natural, gírias ou eventuais erros de digitação comuns.
* **`ground_truth`**: A resposta de referência factual e ideal.
* **`contexts`** *(essencial para RAG)*: Os trechos exatos de documentos que contêm as evidências necessárias para responder à pergunta.
* **`metadata`**: Tags que permitem segmentar a avaliação. Se o seu modelo passar em 95% do dataset geral, mas falhar em 100% dos casos de *"credito_pj"*, você sabe exatamente onde está o gargalo.

---

## As 3 Principais Estratégias de Criação de Datasets

Construir um Golden Dataset de alta qualidade exige combinar diferentes abordagens:

<div align="center">

![Origens do Golden Dataset](/img/origemgoldendata.png)

</div>

### 1. Curadoria Manual por Especialistas de Domínio (SMEs)
* **Como funciona**: Especialistas da área de negócio (médicos, advogados, analistas financeiros, agentes de suporte nível 3) escrevem perguntas difíceis e fornecem a resposta esperada perfeita.
* **Vantagens**: Altíssima precisão e confiabilidade clínica/jurídica/técnica.
* **Desvantagens**: Processo lento e caro. Difícil de escalar para milhares de exemplos.

### 2. Mineração e Triagem de Logs de Produção
* **Como funciona**: Extrair perguntas reais feitas por usuários da sua aplicação em produção, especialmente aquelas onde os usuários deram *thumbs down* (deslike) ou abandonaram a conversa.
* **Vantagens**: Reflete com 100% de realismo as dores, gírias e ambiguidades do mundo real.
* **Desvantagens**: Exige higienização rigorosa para remover dados pessoais (PII - CPF, nomes, cartões de crédito) antes de incluir no repositório de testes.

### 3. Geração Sintética com LLMs (*Synthetic Data Generation*)
* **Como funciona**: Usar uma LLM avançada de fronteira (como GPT-5.6, Claude 3.7 Sonnet, Claude Opus ou Gemini 2.0 Pro) para ler a sua base de documentos e gerar automaticamente centenas de pares de perguntas e respostas em diferentes níveis de complexidade (técnica popularizada pelo método **Evol-Instruct**).
* **Vantagens**: Cria centenas de casos de teste em minutos com custo irrisório.
* **Desvantagens**: Risco de "eco cognitivo" (o modelo sintetizador pode ter os mesmos pontos cegos do modelo que será avaliado). Por isso, os dados sintéticos devem sempre passar por uma amostragem de validação humana.

<div align="center">

![Geração Sintética de Dados](/img/geracaosinteticadedados.png)

</div>

---

## O Perigo da Contaminação e Overfitting de Prompts

Existe um fenômeno perigoso conhecido na ciência como a **Lei de Goodhart**:
> *"Quando uma métrica se torna uma meta, ela deixa de ser uma boa métrica."*

Se você ajustar o seu prompt para acertar especificamente as 50 perguntas do seu Golden Dataset, você corre o risco de criar um **overfitting de prompt**: a LLM passa a responder perfeitamente apenas aquelas 50 perguntas, mas perde a capacidade de generalizar para perguntas inéditas dos usuários.

:::warning[Boas Práticas Anti-Contaminação]
1. **Separe Datasets de Treino/Ajuste e Teste (Split Train/Test)**: Mantenha um conjunto de 20% a 30% dos exemplos trancados como *Holdout Set* (conjunto cego). Você só roda esse conjunto antes de grandes releases.
2. **Atualize o Dataset Continuamente**: Adicione novos casos de teste semanalmente com base nas falhas reais observadas em produção.
3. **Varie a Formulação**: Inclua sinônimos, ordens invertidas e perguntas ambíguas para a mesma resposta esperada.
:::

---

## Quantos exemplos você precisa no seu Golden Dataset?

Uma dúvida comum em times de engenharia é o tamanho ideal do dataset de avaliação:

| Fase do Projeto | Tamanho Recomendado | Objetivo Principal | Frequência de Execução |
| :--- | :--- | :--- | :--- |
| **Prototipação / Exploração** | 20 a 50 exemplos | Validação rápida de viabilidade de prompts e modelos | A cada alteração de prompt (segundos) |
| **Desenvolvimento Ativo / PRs** | 100 a 250 exemplos | Evitar regressões em CI/CD durante pull requests | Em todo Pull Request (minutos) |
| **Produção / Release Gating** | 500 a 1.000+ exemplos | Benchmark exaustivo cobrindo todos os casos de borda | Antes de deploys maiores ou troca de modelo |

---

## Resumo

* O **Golden Dataset** é o benchmark factual que torna os seus testes repetíveis e confiáveis.
* Uma amostra robusta deve conter: Pergunta, Contexto de Apoio, Ground Truth e Metadados de categoria e dificuldade.
* A melhor abordagem une curadoria humana de especialistas com geração sintética e filtragem de logs de produção.
* Nunca ajuste seus prompts olhando apenas para um conjunto pequeno e estático, para evitar o overfitting de prompts.

No próximo capítulo, vamos explorar as primeiras ferramentas práticas de medição: **as métricas determinísticas e heurísticas baseadas em código**.
