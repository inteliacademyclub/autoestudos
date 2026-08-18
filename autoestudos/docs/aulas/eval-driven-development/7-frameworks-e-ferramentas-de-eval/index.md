---
sidebar_position: 7
sidebar_label: 'Frameworks e Ferramentas'
---

# Frameworks e Ferramentas Práticas: O Ecossistema Moderno de Evals

Você não precisa construir todo o código de avaliação, chamadas de juízes e cálculos estatísticos do zero. O ecossistema de Inteligência Artificial amadureceu rapidamente e hoje conta com frameworks e ferramentas open-source de padrão industrial.

Neste capítulo, vamos analisar as principais ferramentas disponíveis no mercado e aprender a implementar na prática uma bateria de testes automatizada em Python.

---

## Comparativo dos Principais Frameworks da Indústria

| Ferramenta | Tipo Principal | Ponto Forte / Melhor Caso de Uso |
| :--- | :--- | :--- |
| **DeepEval** | Framework Python (Pytest) | Testes unitários para LLMs integrados diretamente ao fluxo de CI/CD em Python. |
| **Ragas** | Biblioteca Python | Especializada em métricas da Tríade do RAG e geração sintética de Golden Datasets. |
| **Promptfoo** | CLI & Configuração YAML | Teste comparativo ultra-rápido de prompts, modelos e testes de segurança / red teaming. |
| **Arize Phoenix** | Plataforma Open-Source | Tracing detalhado, visualização de spans e análise de embeddings em painéis visuais. |

---

## Prática 1: Testes Automatizados em Python com DeepEval

O **DeepEval** é conhecido como o "Pytest para LLMs". Ele permite escrever testes de avaliação exatamente como você escreve testes unitários normais em Python.

### 1. Instalação
```bash
pip install deepeval pytest
```

### 2. Escrevendo o arquivo de teste (`test_rag_pipeline.py`)

```python
import pytest
from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import (
    AnswerRelevancyMetric,
    FaithfulnessMetric,
    HallucinationMetric
)

def test_resposta_plano_de_saude():
    # 1. Definir os dados da interação real
    pergunta_usuario = "O plano cobre cirurgia refrativa para miopia?"
    contexto_recuperado = [
        "Capítulo 8 - Coberturas Oftalmológicas: O plano cobre cirurgia refrativa a laser "
        "para pacientes com miopia a partir de 5 graus e maiores de 21 anos."
    ]
    resposta_gerada_pela_llm = (
        "Sim, o plano cobre cirurgia refrativa a laser para miopia, desde que o paciente "
        "tenha 21 anos ou mais e o grau de miopia seja de pelo menos 5 graus."
    )
    
    # 2. Criar o caso de teste
    caso_de_teste = LLMTestCase(
        input=pergunta_usuario,
        actual_output=resposta_gerada_pela_llm,
        retrieval_context=contexto_recuperado
    )
    
    # 3. Configurar as métricas e notas mínimas de corte (Thresholds)
    metrica_relevancia = AnswerRelevancyMetric(threshold=0.7, model="gpt-4o-mini")
    metrica_fidelidade = FaithfulnessMetric(threshold=0.8, model="gpt-4o-mini")
    
    # 4. Executar as asserções
    assert_test(caso_de_teste, [metrica_relevancia, metrica_fidelidade])
```

### 3. Executando os testes no terminal
```bash
deepeval test run test_rag_pipeline.py
```

O DeepEval gerará uma tabela no terminal indicando se o caso de teste passou ou falhou, acompanhado do raciocínio detalhado do juiz neural para cada métrica avaliada.

---

## Prática 2: Comparação de Prompts e Modelos com Promptfoo

Se você quer comparar rapidamente como diferentes modelos (ex: Claude 3.7 Sonnet vs. GPT-5.6 vs. Gemini 2.0 Flash vs. Llama 3.3) respondem a uma lista de prompts em lote, o **Promptfoo** é a ferramenta ideal via linha de comando.

### Exemplo de Configuração `promptfooconfig.yaml`:

```yaml
description: "Avaliação comparativa de assistente de suporte"

prompts:
  - "Você é um atendente formal e direto. Responda: {{pergunta}}"
  - "Você é um assistente amigável e descontraído. Responda: {{pergunta}}"

providers:
  - openai:gpt-5.6
  - anthropic:claude-3-7-sonnet
  - google:gemini-2.0-flash
  - ollama:llama3.3:70b

tests:
  - vars:
      pergunta: "Como faço para cancelar minha assinatura antes do prazo de 7 dias?"
    assert:
      - type: contains
        value: "reembolso integral"
      - type: llm-rubric
        value: "A resposta deve orientar claramente o usuário sobre o artigo 49 do CDC sem usar jargões excessivos."

  - vars:
      pergunta: "Vocês aceitam Bitcoin como forma de pagamento?"
    assert:
      - type: not-contains
        value: "aceitamos criptomoedas"
      - type: is-json
```

Para rodar a avaliação de toda a matriz e gerar uma interface web com relatórios comparativos, basta executar:

```bash
npx promptfoo@latest eval
npx promptfoo@latest view
```

---

## Qual ferramenta escolher para o seu projeto?

* **Construindo e otimizando pipelines RAG:**
  * Se você precisa de métricas matemáticas automáticas de fidelidade e cobertura de busca: vá de **RAGAS**.
  * Se você precisa de tracing visual em produção e análise de embeddings: vá de **Arize Phoenix**.
* **Testando Prompts, Modelos e Agentes:**
  * Se você já programa em Python e quer testes unitários integrados ao CI: vá de **DeepEval** (`pytest`).
  * Se você quer comparar dezenas de modelos e prompts rapidamente via CLI e arquivos YAML: vá de **Promptfoo**.

---

## Resumo

* O ecossistema de avaliação possui ferramentas maduras que eliminam a necessidade de construir frameworks do zero.
* O **DeepEval** traz a simplicidade e a disciplina do **Pytest** para o mundo dos LLMs, integrando perfeitamente a pipelines de desenvolvimento em Python.
* O **Promptfoo** permite criar matrizes comparativas de múltiplos prompts e modelos de diferentes provedores via arquivos declarativos em YAML.
* Ferramentas como **Ragas** e **Arize Phoenix** especializam-se em métricas aprofundadas da Tríade do RAG e observabilidade de spans.

No próximo e último capítulo, vamos ver como amarrar todas essas peças dentro de uma esteira automatizada: **CI/CD para GenAI e Avaliações Contínuas em Produção**!
