---
sidebar_position: 1
sidebar_label: APIs Grátis do OpenRouter
title: "Guia: APIs de Modelos Grátis do OpenRouter"
---

# Guia para Pegar APIs de Modelos Grátis do OpenRouter

O **OpenRouter** é um excelente agregador de modelos de Inteligência Artificial que facilita bastante o acesso a diversas opções do mercado usando uma mesma API. Além de modelos pagos de ponta, eles também oferecem acesso a **vários modelos totalmente gratuitos**, que são ótimos para testes, estudos e pequenos projetos.

Neste guia, você verá o passo a passo de como criar a sua conta e gerar a sua API Key para começar a usar os modelos gratuitos.

## Passo 1: Criando sua conta

1. Acesse o site oficial do OpenRouter: [https://openrouter.ai/](https://openrouter.ai/)
2. No canto superior direito, clique em **Sign in** ou **Sign up**.
3. Crie a sua conta utilizando a sua conta Google, Github ou uma carteira de criptomoedas compatível.

![Tela inicial do OpenRouter](/img/telainicial.png)

## Passo 2: Gerando sua API Key

1. Dentro da página de Keys, procure pelo botão **Create Key** (Criar chave).
2. Dê um nome para a sua chave, por exemplo: `Chave de Testes - Modelos Gratis`.
3. Você pode configurar um limite de créditos de gasto, mas como o foco é usar os modelos gratuitos, isso não é obrigatório para começar.
4. Clique em **Create** para finalizar.

![Criação da API Key](/img/criarapi.png)

⚠️ **Importante**: A chave só será exibida por completo **uma única vez**. Copie e salve-a em um lugar seguro. Se você perder, terá que deletar e criar uma nova.

## Passo 3: Encontrando os Modelos Gratuitos

Nem todos os modelos no OpenRouter são gratuitos, mas filtrar os gratuitos é bem simples:

1. Acesse a página de [Modelos (Models)](https://openrouter.ai/models).
2. Na parte de filtros e preços, busque ou confira aqueles que indicam "$0" ou a tag **"Free"**.
3. Selecione o modelo de sua preferência (como as variações gratuitas do Llama ou Gemma) 

![Lista de modelos gratuitos](/img/modelosfree.png)

Ao clicar no modelo escolhido, você será levado à página de detalhes dele. É nessa página que você encontrará o ID exato que deverá usar no seu código!

![Exemplo de página de modelo](/img/modeloexemplo.png)

---

## Como utilizar a API na prática

A API do OpenRouter é padronizada para ser compatível com a da OpenAI. Isso significa que você pode usar a biblioteca oficial do Python da OpenAI alterando apenas a `base_url` e o `model`.

### Exemplo de código (Python)

Você pode testar usando o pacote `openai` (`pip install openai`):

```python
from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="SUA_CHAVE_AQUI", # Substitua pela chave que você copiou no Passo 3
)

completion = client.chat.completions.create(
  # Escolha um dos modelos gratuitos disponíveis com a tag :free no final
  model="meta-llama/llama-3-8b-instruct:free",
  messages=[
    {
      "role": "user",
      "content": "Explique o que é Inteligência Artificial de forma simples, em um parágrafo."
    }
  ]
)

print(completion.choices[0].message.content)
```

Agora você já está pronto para integrar inteligência artificial de forma gratuita nos seus projetos!
