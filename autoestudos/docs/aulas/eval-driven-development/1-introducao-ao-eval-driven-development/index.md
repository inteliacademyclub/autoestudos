---
sidebar_position: 1
sidebar_label: 'Introdução ao EDD'
---

# Introdução ao Eval-Driven Development: Da Intuição à Engenharia

Imagine a seguinte cena: você acabou de passar duas semanas ajustando o *system prompt* do assistente de atendimento da sua empresa. Você abre o playground da OpenAI ou do Claude, digita três perguntas difíceis, lê as respostas, acha o resultado incrível e pensa: *"Pronto! Está perfeito, pode subir para produção!"*.

Três dias depois, o suporte está em chamas: o bot começou a prometer descontos de 90% para clientes irritados, esqueceu de formatar o JSON que a API interna precisa para registrar pedidos e começou a responder em espanhol para usuários do Brasil.

O que deu errado? Você foi vítima do infame **"Vibe Check"** (avaliação na base do "parece bom").

:::danger[O Perigo do Vibe Check]
No início do desenvolvimento com LLMs, quase todo mundo avalia prompts no "olhômetro": testando manualmente 3 a 5 variações no chat. Essa abordagem funciona para protótipos de fim de semana, mas é uma receita para o desastre em escala. Sem testes quantitativos e repetíveis, qualquer melhoria que você faz para o "Caso A" pode destruir silenciosamente a performance nos "Casos B, C e D".
:::

<div align="center">

![Vibe Check vs Eval-Driven Development](/img/2devs.png)

</div>

---

## Por que desenvolver com LLMs é tão diferente do software tradicional?

Na engenharia de software tradicional, você escreve código determinístico: se você passar `2 + 2`, a função **sempre** retornará `4`. Um teste unitário convencional simplesmente faz:

```python
assert somar(2, 2) == 4
```

Com Large Language Models, tudo muda:
1. **Estocasticidade e Probabilidade**: LLMs são motores probabilísticos de predição de tokens. A mesma pergunta feita duas vezes pode gerar duas respostas semanticamente equivalentes, mas com palavras completamente diferentes.
2. **Saídas em Linguagem Natural Aberta**: Não existe apenas uma "resposta certa" em texto livre. Como comparar se a explicação da IA foi concisa, empática e tecnicamente correta sem ler uma por uma?
3. **Fragilidade do Prompting**: Mudar uma única palavra no prompt do sistema ou atualizar a versão do modelo (por exemplo, de `gpt-4o` para `gpt-5.6` ou de `claude-3-5-sonnet` para `claude-3-7-sonnet`) pode alterar sutilmente o tom, o raciocínio ou a taxa de adesão a regras de negócio.

É aqui que surge o **Eval-Driven Development (EDD)**.

---

## TDD vs. EDD: O Paralelo Essencial

Se você já conhece o **Test-Driven Development (TDD)**, entender o **EDD** é muito natural. Eles compartilham a mesma filosofia fundamental: **defina o critério de sucesso antes de implementar a solução**.

| Dimensão | TDD (Software Tradicional) | EDD (Sistemas GenAI) |
| :--- | :--- | :--- |
| **Natureza** | Binária e Determinística (Passa / Falha) | Estatística e Probabilística (Score de 0.0 a 1.0) |
| **Objeto de Teste** | Funções, classes, rotas de API | Prompts, arquiteturas RAG, agentes, modelos |
| **Entrada do Teste** | Mock data, parâmetros de função | Queries de usuários reais, documentos de contexto |
| **Mecanismo de Checagem** | Asserções de código (`assert x == y`) | Juízes neurais (LLM-as-a-Judge), validação de schemas, métricas semânticas |
| **Objetivo Principal** | Garantir que o código cumpra o contrato de requisitos | Medir precisão factual, relevância, segurança, custo e latência em escala |

---

## O Ciclo de Vida do Eval-Driven Development

O fluxo do EDD transforma o desenvolvimento de aplicações com LLM em um processo de engenharia rigoroso e mensurável:

<div align="center">

![Ciclo de Vida do Eval-Driven Development](/img/ciclodevida.png)

</div>

1. **Definição de Métricas**: O que define uma "boa resposta" no seu caso de uso? Não alucinar? Seguir um JSON específico? Não vazar dados confidenciais?
2. **Construção do Golden Dataset**: Um conjunto de 50 a 500 exemplos representativos com perguntas, contextos e respostas ideais.
3. **Linha de Base (Baseline)**: Rodar o pipeline atual contra o dataset para obter uma nota inicial (ex: 78% de precisão factual).
4. **Iteração Guiada por Dados**: Testar uma nova técnica (ex: adicionar um Reranker ou mudar o prompt) e medir o impacto exato.
5. **Prevenção de Regressão**: Se a nova alteração aumentou a assertividade de 78% para 89% sem estourar o orçamento de tokens, a mudança é aprovada para merge!

---

## O Trilema de Sistemas GenAI em Produção

Ao avaliar sistemas baseados em LLMs, qualidade não é a única métrica que importa. Engenharia de GenAI envolve equilibrar três forças concorrentes:

<div align="center">

![Trilema de Sistemas GenAI em Produção](/img/trilema.png)

</div>

:::info[O Equilíbrio do Trilema]
- **Modelo Gigante de Raciocínio (ex: Claude 3.7 Sonnet / Claude Opus / GPT-5.6 / o3)**: Acurácia máxima e raciocínio profundo, mas custo por milhão de tokens mais alto e latência na casa de segundos.
- **Modelo Compacto de Alta Velocidade (ex: Claude 3.5 Haiku / GPT-4o-mini / Gemini 2.0 Flash)**: Latência de milissegundos e custo de centavos de dólar, mas exige engenharia de prompts refinada e evals rigorosos para garantir que a qualidade se mantenha aceitável.
- **Pipeline RAG Complexo com Rerankers neurais e múltiplos passos**: Alta precisão em documentos complexos, com impacto cumulativo em latência.
:::

Com **EDD**, você não precisa "adivinhar" qual modelo usar. Você roda seu dataset de avaliação em três modelos diferentes e descobre exatamente: *"O modelo menor e 10x mais barato atinge 94% da acurácia do modelo topo de linha no meu caso de uso específico?"*. Se a resposta for sim, você economiza milhares de dólares por mês com total segurança técnica.

---

## Resumo

* O **Vibe Check** é perigoso porque não escala, não detecta regressões silenciosas e depende de impressões subjetivas.
* O **Eval-Driven Development (EDD)** é a evolução do TDD para a era probabilística das LLMs.
* Em vez de `True` ou `False`, as avaliações medem distribuições estatísticas de conformidade, precisão factual, relevância e segurança.
* Os evals fornecem a bússola quantitativa necessária para iterar em prompts, chunking, modelos e guardrails.

No próximo capítulo, vamos aprender o alicerce de qualquer sistema de avaliação: **como criar, curar e versionar Golden Datasets de alta qualidade**.
