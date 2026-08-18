---
sidebar_position: 3
sidebar_label: 'Métricas Determinísticas'
---

# Métricas Determinísticas e Heurísticas: A Primeira Linha de Defesa

Quando as pessoas pensam em avaliar sistemas de Inteligência Artificial Generativa, a primeira ideia que vem à mente costuma ser algo futurista: *"Vamos usar outro modelo de IA para julgar as respostas!"*.

Embora os juízes neurais sejam fundamentais (como veremos no próximo capítulo), começar por eles é um erro clássico de engenharia. Antes de gastar centavos de dólar e esperar segundos por uma resposta de LLM para cada teste, você deve sempre construir a sua **primeira linha de defesa**: as **métricas determinísticas e heurísticas baseadas em código**.

:::info[A Vantagem das Métricas Determinísticas]
* **Custo**: R$ 0,00 por teste.
* **Velocidade**: Execução em microssegundos no seu próprio processador.
* **Reprodutibilidade**: 100% determinísticas (se você rodar 1 milhão de vezes, o resultado será rigorosamente o mesmo).
* **Previsibilidade**: Se um JSON falhar no schema, o teste falha na hora sem ambiguidades.
:::

<div align="center">

![Pirâmide de Avaliação de GenAI](/img/piramideavaliacao.png)

</div>

---

## 1. Validação Estrutural e de Esquemas

Grande parte das aplicações profissionais com LLMs precisa devolver dados estruturados para alimentar APIs, bancos de dados ou front-ends (por exemplo, extrair dados de uma nota fiscal ou emitir comandos para um agente).

Se o modelo gerar um texto bonito, mas esquecer uma vírgula no JSON ou trocar o tipo de um campo de `int` para `string`, toda a sua aplicação vai quebrar.

### Validação com Pydantic e JSON Schema

Em Python, a ferramenta padrão da indústria para essa validação é o **Pydantic**:

```python
from pydantic import BaseModel, Field, ValidationError
import json

class ExtracaoFatura(BaseModel):
    valor_total: float = Field(gt=0, description="Valor total da fatura em reais")
    vencimento: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$", description="Data no formato AAAA-MM-DD")
    itens: list[str] = Field(min_length=1, description="Lista de itens cobrados")

def testar_saida_estruturada(resposta_llm_texto: str) -> bool:
    try:
        dados = json.loads(resposta_llm_texto)
        fatura = ExtracaoFatura(**dados)
        return True
    except (json.JSONDecodeError, ValidationError) as e:
        print(f"Falha estrutural: {e}")
        return False
```

Nesse teste unitário, avaliamos instantaneamente se a saída é um JSON válido, se a data segue o formato internacional ISO e se o valor é estritamente maior que zero.

---

## 2. Métricas Léxicas Tradicionais (Processamento de Linguagem Natural Clássico)

Antes da ascensão dos Transformers e das LLMs, a área de NLP (Processamento de Linguagem Natural) já havia desenvolvido métricas estatísticas para comparar dois textos: a resposta gerada pela máquina (*Prediction*) e a resposta de referência (*Ground Truth*).

> **Texto Predito:** *"O prazo de cancelamento é de até 7 dias corridos."*  
> **Texto Esperado:** *"O cliente tem 7 dias corridos para solicitar o cancelamento."*

### Exact Match (EM)
* **Como funciona**: Compara se a resposta gerada é 100% idêntica à resposta esperada (caractere por caractere, ignorando apenas espaços extras ou maiúsculas/minúsculas).
* **Quando usar**: Excelente para saídas objetivas e curtas, como extração de entidades, códigos de produtos, siglas ou respostas binárias ("SIM" / "NÃO").

### ROUGE (Recall-Oriented Understudy for Gisting Evaluation)
O ROUGE mede a sobreposição de palavras entre a predição e o texto esperado, sendo muito comum em tarefas de sumarização:
* **ROUGE-1**: Mede a sobreposição de palavras individuais (unigramas).
* **ROUGE-2**: Mede a sobreposição de pares consecutivos de palavras (bigramas).
* **ROUGE-L**: Mede a maior subsequência comum de palavras preservando a ordem original (*Longest Common Subsequence*).

### BLEU (Bilingual Evaluation Understudy)
Originalmente criado para tradução automática, o BLEU mede a precisão de n-gramas penalizando respostas excessivamente curtas (*Brevity Penalty*).

### Distância de Levenshtein (Fuzzy Matching)
Calcula o número mínimo de inserções, remoções ou substituições de caracteres necessárias para transformar uma string em outra. Excelente para medir pequenas variações de digitação.

---

## O Limite Crítico das Métricas Léxicas: A Armadilha da Semântica

Embora úteis e rápidas, as métricas léxicas têm uma falha fatal: **elas avaliam a forma das palavras, e não o significado real da frase**.

:::warning[O Paradoxo Léxico]
Analise estes dois exemplos clássicos:

1. **Mesmo significado, palavras diferentes (Falso Negativo no ROUGE/BLEU):**
   * *Referência:* "O voo foi cancelado devido ao mau tempo."
   * *Predição:* "Por conta das fortes chuvas, a aeronave não decolou."
   * *Score ROUGE:* Muito baixo (pouquíssimas palavras idênticas).
   * *Avaliação Real:* Resposta perfeita!

2. **Palavras idênticas, significado oposto (Falso Positivo no ROUGE/BLEU):**
   * *Referência:* "Eu adorei o produto, funcionou muito bem."
   * *Predição:* "Eu **não** adorei o produto, **não** funcionou muito bem."
   * *Score ROUGE:* Altíssimo (~85% das palavras são idênticas!).
   * *Avaliação Real:* Erro gravíssimo de inversão de sentido!
:::

<div align="center">

![A Cegueira das Métricas Léxicas](/img/cegueirametricas.png)

</div>

---

## 3. Asserções de Negócio e Testes Negativos

Você pode (e deve) usar funções em Python simples para validar regras de compliance e segurança da sua aplicação:

```python
def testar_regras_de_compliance(resposta_texto: str) -> dict:
    palavras_proibidas = ["garantia de 100% de lucro", "criptomoeda milagrosa", "concorrente_x"]
    links_esperados = ["https://meubanco.com.br/termos"]
    
    erros = []
    
    # 1. Checagem de palavras proibidas (Testes Negativos)
    for proibida in palavras_proibidas:
        if proibida.lower() in resposta_texto.lower():
            erros.append(f"Contém termo proibido: '{proibida}'")
            
    # 2. Checagem de links de suporte obrigatórios
    for link in links_esperados:
        if link not in resposta_texto:
            erros.append(f"Faltou citar o link oficial obrigatório: '{link}'")
            
    # 3. Checagem de tamanho mínimo/máximo
    if len(resposta_texto) < 20:
        erros.append("Resposta excessivamente curta (possível recusa injustificada)")
        
    return {
        "passou": len(erros) == 0,
        "detalhes": erros
    }
```

---

## Tabela Resumo: Quando Usar Cada Abordagem

| Métrica / Técnica | Tipo | Velocidade | Custo | Melhor Caso de Uso |
| :--- | :--- | :--- | :--- | :--- |
| **JSON Schema / Pydantic** | Estrutural | Microssegundos | Zero | Function calling, extração de entidades e APIs |
| **Exact Match** | Léxica | Microssegundos | Zero | Respostas curtas, números de pedido, classificações |
| **Regex** | Padrão | Microssegundos | Zero | Validação de CPF, datas, cartões e links |
| **ROUGE / BLEU** | Sobreposição | Milissegundos | Zero | Sumarização e tradução com vocabulário fixo |
| **Asserções de Negócio** | Regra lógica | Microssegundos | Zero | Blacklists de palavras, restrições regulatórias |

---

## Resumo

* As **métricas determinísticas** são a fundação da pirâmide de testes: são rápidas, gratuitas e inequívocas.
* Use **Pydantic** e validações de esquema sempre que sua LLM precisar se comunicar com sistemas de backend.
* Métricas como **Exact Match** e **ROUGE** são úteis para tarefas específicas, mas cegas para nuances semânticas e negações.
* Integre regras de negócio e testes negativos via código para capturar falhas óbvias antes de acionar avaliadores mais caros.

Agora que entendemos os limites das regras baseadas em código puro, como avaliamos a sutileza, o tom e a correção semântica de respostas abertas? É o momento de conhecer os **Juízes Neurais e o G-Eval** no próximo capítulo!
