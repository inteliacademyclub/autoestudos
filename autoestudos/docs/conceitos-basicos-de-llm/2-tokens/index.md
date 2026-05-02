---
sidebar_position: 2
sidebar_label: 'Tokens'
---

# Tokens: Como a IA Quebra o Texto

Lembra do spoiler que deixamos no final do capítulo passado? Toda aquela história de "prever a próxima palavra" foi só para facilitar a explicação inicial. 

Na realidade, a IA não enxerga "palavras" como nós. Ela lê **Tokens**.

Se a IA visse o texto inteiro de uma vez, como um blocão sólido, seria impossível processar matematicamente as probabilidades. Então, a primeira coisa que a IA faz quando você manda uma mensagem é pegar um "machado virtual" e picotar a sua frase em pedacinhos menores. Cada pedacinho desses é um Token.

<div align="center">

![Machado picotando o texto em tokens](/img/machado.png)

</div>


## Mas um Token é uma palavra ou uma sílaba?

Depende! Um token pode ser uma palavra inteira, uma sílaba, ou até mesmo uma única letra. 

Pense nos tokens como as pecinhas de Lego da linguagem. Algumas pecinhas são grandes e prontas (como uma palavra muito comum), outras são pedacinhos pequenos (como prefixos ou sufixos) que a IA vai precisar encaixar.

Olha só como a frase *"Today is a beautiful day outside."* seria quebrada pela IA:

- `To` 
- `day` 
- `is`
- `a`
- `beaut`
- `iful`
- `day`
- `out`
- `side`
- `.`

Reparou? A palavra "Today" foi quebrada em `To` + `day`. E "beautiful" virou `beaut` + `iful`! Isso porque a IA não encontrou um "Lego pronto" para essas palavras inteiras, então teve que montar com peças menores. Já "is" e "a" são tão comuns que viram um token só cada.

:::info[O segredo do espaço e o terror dos programadores]
Você reparou que `day` aparece duas vezes, mas com IDs diferentes (`1452` e `740`)? Isso acontece porque o tokenizador trata o **espaço antes da palavra como parte do token**. Então `day` (sem espaço, colado em "To") é um token diferente de ` day` (com espaço, palavra separada).

É por isso que, às vezes, o GitHub Copilot parece "emburrecer" do nada se você misturar espaços e tabs, ou mudar o padrão de indentação do código. Para você, é o mesmo código. Para a matemática da IA, um `if` com 2 espaços de recuo gera uma sequência de Tokens completamente diferente de um `if` com 4 espaços!
:::

### Como a IA decide onde cortar?

Isso não é aleatório! A IA usa um algoritmo chamado **BPE (Byte Pair Encoding)**. Durante o treinamento, ela analisou bilhões de textos e foi anotando quais sequências de letras aparecem juntas com mais frequência:

- `day` aparece muitíssimo sozinho → vira um token inteiro.
- `beautiful` é rara o suficiente → é quebrada nas peças mais frequentes que a compõem: `beaut` + `iful`.
- `is` e `a` são extremamente comuns → cada uma vira um único token.

Em resumo: **quanto mais comum a palavra, mais chance de ela ter um token só**. Palavras raras ou compostas são fatiadas em pedacinhos que o modelo já conhece.


## A IA não lê letras (e por isso é péssima em matemática!)

Aqui vem um detalhe que a maioria das pessoas nunca para pra pensar: a IA é uma máquina matemática, mas ironicamente, ela não sabe contar letras ou resolver continhas de cabeça. Ela não entende o alfabeto. 

Quando você pergunta *"Quantas letras R tem na palavra Strawberry?"*, ela não enxerga `s-t-r-a-w-b-e-r-r-y`. Ela enxerga um "blocão" indivisível de ID `8945`. Pedir pra IA contar letras dentro de um token é como dar um purê de batatas pra alguém e pedir pra pessoa contar quantas batatas foram usadas. O mesmo vale para números longos: o número `38491` não são cinco algarismos pra ela, ele vira o bloco `38` e o bloco `491`. É por isso que ela inventa e erra resultados em cálculos básicos!

Para resolver o problema, depois de picotar o texto, ela faz mais uma coisa: converte cada token em um **número (ID)**.

Cada token tem um ID único no "dicionário" da IA. Usando o nosso exemplo:

- `To` → `98`
- `day` → `1452`
- `is` → `43`
- `a` → `15`
- `beaut` → `2932`
- `iful` → `1709`
- `day` → `740`
- `out` → `3112`
- `side` → `3823`
- `.` → `74`

Então a frase *"Today is a beautiful day outside."* entra no motor da IA não como texto, mas como uma sequência de números: `[98, 1452, 43, 15, 2932, 1709, 740, 3112, 3823, 74]`. É com esses números que toda a matemática de probabilidade roda por baixo dos panos.

<div align="center">

![Diagrama mostrando tokens sendo convertidos em números](/img/llmtokenizer.jpg)

</div>

E quando a IA termina de "pensar" e quer te responder, ela faz o caminho inverso: pega os números que calculou como resposta e os converte de volta para os tokens de texto correspondentes. É por isso que a resposta aparece na sua tela como palavras normais!


## Por que isso importa pra você? (A matemática do bolso)

Se você já olhou os planos para desenvolvedores do ChatGPT, Claude ou Gemini, deve ter visto preços como *"Custa $0.15 a cada 1 Milhão de tokens"*. 

As empresas não te cobram por "palavra". Elas cobram pelo trabalho braçal do motor: a quantidade de "bloquinhos de Lego" que ele precisou mastigar para ler a sua pergunta e para gerar a resposta. 

:::info[A Regra do Milhão: Input vs Output]
Hoje, o mercado padronizou a cobrança por **Milhões de Tokens**, e sempre divide a conta em duas partes:
- **Input (Entrada):** O texto que você envia para a IA ler (sua pergunta, seus arquivos). Costuma ser bem mais barato.
- **Output (Saída):** O texto que a IA "escreve" de volta pra você. Costuma ser mais caro, porque gerar texto do zero exige muito mais esforço matemático do motor.

E para você ter uma noção do tamanho disso: **1 Milhão de tokens equivale a cerca de 750 mil palavras**. É como se você pudesse processar uns 10 livros inteiros de uma vez por alguns centavos!
:::

Para você ter uma ideia mais concreta do quanto isso significa na prática do dia a dia:

| O que você envia/recebe | Quantidade aproximada |
| :--- | :--- |
| **Uma mensagem curta no chat** | ~50 a 100 tokens |
| **Um artigo de blog completo** | ~1.000 a 2.000 tokens |
| **Um capítulo de livro** | ~5.000 a 10.000 tokens |
| **Um livro inteiro (300 páginas)** | ~100.000 tokens |



## O lado chato: A barreira do idioma

Lembra que eu falei que a IA leu a internet inteira? A esmagadora maioria dessa internet estava em inglês. Isso significa que as LLMs ficaram excelentes em criar "bloquinhos de Lego" perfeitos para palavras em inglês. 

:::warning[A "Taxa" do Português]
A palavra `Hello` em inglês é tão comum lá fora que equivale a **1 token**. 

Já em português, por causa dos acentos e de termos menos comuns no treinamento global, a IA precisa "picotar" muito mais. Uma palavra como `Paralelepípedo` pode virar 4, 5 ou até mais tokens! 

Isso quer dizer que processar textos em português costuma "gastar" mais tokens (e custar um pouquinho mais caro para desenvolvedores) do que em inglês. O motor trabalha mais para ler o nosso idioma.
:::

## Experimente você mesmo!

A melhor forma de entender tokens é vendo na prática. A OpenAI disponibiliza uma ferramenta gratuita chamada **Tokenizer** onde você cola qualquer texto e ela te mostra exatamente como a IA quebra cada pedaço, com cada token em uma cor diferente.

<div align="center">

![Interface do Tokenizer da OpenAI](/img/openaitokenizer.png)

</div>

👉 **[Acesse o Tokenizer da OpenAI aqui](https://platform.openai.com/tokenizer)**

Cole a frase *"Today is a beautiful day outside."* e veja quantos tokens ela vira. Depois tente em português: *"Hoje é um lindo dia lá fora."*. A diferença vai te surpreender!

## Resumindo

Tokens são a moeda de troca e a unidade de pensamento das IAs. Quando você joga um texto lá dentro, o primeiro passo da máquina é transformar tudo numa sopa de pedacinhos (tokens). E depois ela calcula, matematicamente, qual é o próximo **token** que tem que aparecer na tela.

## O Limite da Memória 

Beleza, agora você sabe que a IA engole "tokens" aos milhões. Mas será que a cabeça dela é infinita? Sabe quando você tá conversando com o ChatGPT há horas e, do nada, ele parece "esquecer" uma regra que você deu lá no começo do papo? 

A culpa não é de uma falha no sistema, e sim do fato de que a "memória de curto prazo" da IA tem um limite estrito de tokens que ela consegue segurar de uma vez. Quando o limite estoura, o passado começa a ser apagado. E é exatamente sobre essa memória, a famosa **Janela de Contexto**, que vamos falar agora!
