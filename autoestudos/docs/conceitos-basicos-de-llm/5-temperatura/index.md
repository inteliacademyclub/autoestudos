---
sidebar_position: 5
sidebar_label: 'Temperatura'
---

# Temperatura: O Termômetro da Criatividade

Lembra do desafio que deixamos no final do último capítulo? Se as estradas (Parâmetros) da IA já estão todas calculadas, e a matemática é exata (2+2 sempre será 4), por que diabos a IA dá uma resposta diferente cada vez que você faz a mesmíssima pergunta?

A resposta para esse mistério está em um botão "invisível" que todas as ferramentas de IA têm nos bastidores, chamado **Temperatura**.

## A Roleta de Palavras

No primeiro capítulo, a gente viu que a IA lista as palavras mais prováveis para continuar uma frase. Lembra do nosso exemplo? *"Paris is the city..."*

- `of` (80% de chance)
- `where` (10% de chance)
- `with` (5% de chance)
- `in` (2% de chance)
- `flying` (0,001% de chance)

Se a IA fosse um computador tradicional e sem graça, ela **sempre** escolheria a palavra nº 1 da lista (`of`), sem pestanejar. Acontece que, se ela fizesse isso, ela viraria um robô absurdamente previsível e robótico. Ela sempre escreveria a mesma redação, com as mesmas palavras, exatamente do mesmo jeito.

Para que ela consiga ser criativa, escrever poesias, inventar histórias ou conversar como um humano, os criadores colocaram nela a capacidade de **arriscar**. De vez em quando, ela escolhe a opção nº 2. Às vezes, joga tudo pro alto e escolhe a opção nº 4!

O que a Temperatura faz, matematicamente, é **distorcer essa lista de probabilidades**. 

- **Temperatura muito baixa:** Ela "afila" a curva. A opção nº 1 sobe para 99% de chance, e o resto vira quase zero. A IA fica forçada a escolher o caminho mais óbvio.
- **Temperatura muito alta:** Ela "achata" a curva. A opção nº 1 cai para 35%, a nº 2 vai para 25%, a nº 3 para 18%... e de repente, opções bizarras viram alternativas viáveis, forçando a IA a ser criativa.

E é exatamente você quem decide o quão "arriscada" ou "careta" a IA vai ser usando o botão de Temperatura!

<div align="center">

![Termômetro mostrando o nível de criatividade](/img/temperatura.png)

</div>

## Como o Termômetro funciona na prática

Na maioria dos sistemas (como as APIs do ChatGPT ou Gemini), a Temperatura é um número que vai de **0.0 a 1.0** (ou 2.0 em alguns casos).

### Temperatura 0.0 (O Contador Careta)
A IA vira o funcionário mais metódico e chato do escritório. Ela **nunca** arrisca. Ela pega a lista de probabilidades e sempre escolhe a primeira opção (a de maior porcentagem). As respostas ficam secas, diretas e, acima de tudo, **consistentes**. Se você perguntar a mesma coisa 10 vezes, ela te dará 10 vezes a exata mesma resposta.

### Temperatura 0.7 ou 0.8 (O Escritor Inspirado)
É a temperatura padrão do ChatGPT. A IA está "aquecida". Ela escolhe a primeira opção quase sempre, mas de vez em quando dá uma espiadinha na opção nº 2 ou nº 3 para deixar o texto mais rico, com sinônimos interessantes e uma estrutura de frase mais humana. Ela se permite ser criativa.

### Temperatura 1.0+ (O Artista Maluco)
O botão foi girado para o máximo. A IA entra no modo "caos criativo". Ela ignora completamente a palavra mais provável (`of`) e começa a puxar palavras obscuras do fundo da lista (`flying`, `neon`). 

:::warning[O perigo de esquentar demais]
Se você colocar a temperatura muito alta (tipo 1.5 ou 2.0), a IA vai tentar ser tão criativa, escolhendo palavras tão raras na lista, que o texto vai virar uma salada de palavras sem sentido. Ela vai começar a falar grego, inventar palavras que não existem e perder totalmente a coerência. 
:::

### O Efeito da Temperatura na Vida Real

Imagine pedir para a IA: *"Me dê um slogan para uma pizzaria"*. Veja como o nível de temperatura muda completamente o resultado final:

> 🥶 **Temperatura 0.0:** *"Pizza fresca, sabor garantido. A melhor da cidade."* (Seguro, óbvio, chato).

> 😊 **Temperatura 0.7:** *"Onde cada fatia conta uma história deliciosa."* (Criativo, humano, envolvente).

> 🔥 **Temperatura 1.5:** *"Molho escaldante, existência efêmera, universo redondo de queijo!"* (Um caos poético que beira o sem sentido).

## Qual temperatura eu devo usar?

Se você está apenas conversando no chat normal, você não precisa se preocupar com isso (a ferramenta já vem configurada no meio-termo ideal). Mas se você for criar automações ou programar com IA, essa é a regra de ouro:

| Sua Tarefa | Temperatura Ideal | Por quê? |
| :--- | :--- | :--- |
| **Código de programação e retorno em formato JSON** | `0.0` | Você não quer criatividade num código. Se você pedir pra IA gerar um JSON e a temperatura não for zero, ela vai ser "criativa" inventando chaves e quebrando o seu banco de dados. |
| **Resumir textos, traduzir idiomas ou escrever e-mails formais** | `0.3` a `0.5` | Você quer que ela seja fluida, mas sem fugir dos fatos ou inventar moda. |
| **Escrever posts para blog, criar ideias de marketing, poesias** | `0.7` a `0.9` | Você quer respostas variadas, envolventes e que fujam do senso comum. |

:::info[O irmão da Temperatura: O Top-P]
Se você for usar a API de uma IA para programar, vai notar que junto do botão de Temperatura, existe um outro chamado **`top_p`** (ou *nucleus sampling*). Ambos controlam a criatividade, mas usam estratégias completamente diferentes:

- **Temperatura (A Distorção):** Muda as *porcentagens* de todas as palavras. Uma temperatura alta pega uma palavra rara (0,001% de chance) e infla ela artificialmente para 15%, tornando-a uma opção provável.
- **Top-P (O Segurança da Porta):** Não muda a porcentagem de ninguém. Ele funciona como uma "nota de corte". Se você definir o `top_p` como `0.9` (90%), a IA vai somar as palavras mais prováveis da lista até dar 90%. Tudo o que estiver abaixo dessa linha de corte (os 10% do fundo do poço) é **sumariamente jogado no lixo** e a IA fica proibida de escolher.

**Em resumo:** A Temperatura altera o tamanho das fatias da pizza. O Top-P simplesmente joga as fatias ruins da pizza no lixo antes de você escolher. 

A regra geral recomendada pelas próprias empresas de IA (OpenAI, Anthropic, Google) é: **nunca mude os dois ao mesmo tempo**. Se for brincar de criatividade, ajuste a Temperatura e deixe o `top_p` quieto no padrão (1.0).
:::

## Resumindo

A **Temperatura** não afeta a inteligência da IA (os parâmetros continuam lá), ela afeta apenas a **coragem** dela. É o botão de volume que controla se a IA vai escolher a palavra mais segura ou se vai jogar os dados e escolher uma palavra inusitada para te surpreender.

:::tip[Você está no comando!]
Até agora, nós dissecamos o motor do carro: você sabe como ele engole combustível (Tokens), qual é o tamanho do tanque (Janela de Contexto), onde fica a potência (Parâmetros) e como controlar o volante (Temperatura).

Mas de que adianta um motor V8 incrível se você não sabe dirigir? Como você "conversa" com a máquina para extrair o melhor resultado possível dela? É o que vamos aprender no próximo capítulo: a arte do **Prompting**!
:::