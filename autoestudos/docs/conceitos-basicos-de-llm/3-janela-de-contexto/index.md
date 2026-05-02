---
sidebar_position: 3
sidebar_label: 'Janela de Contexto'
---

# Janela de Contexto: A Memória de Curto Prazo

Sabe aquela sensação de chegar na cozinha, abrir a geladeira e pensar: *"Espera... o que eu vim fazer aqui mesmo?"*? 

Adivinha só: a Inteligência Artificial sofre exatamente desse mesmo mal!

No capítulo passado nós descobrimos que a IA não lê palavras, ela "mastiga" Tokens. E que para prever qual é o próximo token, ela junta a sua pergunta com tudo o que ela já respondeu até ali num ciclo infinito.

Mas aí vem a pergunta de um milhão de dólares: **quantos tokens a IA consegue segurar na cabeça ao mesmo tempo?** A memória dela é infinita?

A resposta é não. E o nome desse limite de memória é **Janela de Contexto** (ou *Context Window*, em inglês).

## O Efeito "Peixinho Dourado" 

Imagine que a IA é um funcionário genial, mas que trabalha numa **mesinha de escritório minúscula**. 

Toda vez que você manda uma mensagem no chat, é como se colocasse uma folha de papel nessa mesa. O funcionário lê, entende e escreve a resposta em outra folha, deixando as duas lá em cima para usar como contexto. 

O problema é que a mesa tem um limite físico rígido. Conforme a conversa avança, as folhas vão se acumulando até a mesa ficar completamente lotada. O que ele faz quando você entrega mais uma folha nova? Ele é obrigado a empurrar a folha mais antiga (a primeira mensagem do chat) para fora da mesa, direto pro lixo, para abrir espaço!

Tudo o que está em cima da mesa, ele "lembra" perfeitamente para tomar a decisão da próxima palavra. Tudo o que caiu no chão... puf. Deixou de existir. O modelo vira a Dory, a peixinha com problema de memória recente do *Procurando Nemo*.

<div align="center">

![Peixinho dourado com memória curta](/img/goldenfish.jpg)

</div>

Isso explica o maior pesadelo de quem tenta programar usando o ChatGPT:

1. Você joga o código do seu banco de dados no chat e avisa: *"Lembre-se que minha tabela de usuários usa a coluna `user_id`"*.
2. Vocês começam a programar novas telas e funções por horas a fio.
3. De repente, lá pela mensagem de número 50, a IA te devolve um código quebrado usando `id_usuario`.

**O que rolou? A IA emburreceu?** 
Não! A conversa ficou tão longa (consumiu tantos tokens) que aquela sua primeira mensagem sobre o banco de dados foi "empurrada" para fora da mesa de trabalho dela para abrir espaço. Como a instrução não está mais visível, para o motor matemático, a variável `user_id` simplesmente deixou de existir na linha do tempo!

:::info[O Instinto Dev: "Vou abrir um chat novo"]
Se você programa com ChatGPT ou Claude, já desenvolveu esse instinto de sobrevivência: você tá lá há 40 minutos tentando resolver um bug. A IA te dá 3 soluções erradas, você corrige, ela pede desculpas e erra de novo. Você desiste, **abre um "Novo Chat"**, cola o código do zero, explica o problema e... *bum*, ela acerta de primeira!

Por que fazemos isso instintivamente? Porque no chat antigo a Janela de Contexto tinha virado um lixo. Todas aquelas tentativas fracassadas, as mensagens de "desculpe" e o código quebrado estavam poluindo o cálculo matemático do motor. Começar um chat limpo zera a "poluição" estatística e devolve a clareza pro modelo focar só no código bom!
:::

## O Espaço é Dividido 

Um erro muito comum é achar que a Janela de Contexto serve apenas para você mandar coisas (o *Input*). Mas ela é a "mesa inteira" onde o trabalho acontece. A mesa precisa acomodar **simultaneamente**:

1. As instruções do sistema (ex: "Você é um assistente útil...").
2. O histórico inteiro da conversa (tudo o que você mandou e tudo o que ela já respondeu até ali).
3. A sua nova pergunta (o Prompt atual).
4. **O espaço reservado para a nova resposta que ela vai gerar!**

<div align="center">

![Diagrama dividindo a Janela de Contexto](/img/Context-Window.jpg)

</div>

:::warning[Cuidado com textos gigantes!]
Se você usa um modelo com uma Janela de Contexto de 8.000 tokens e envia um PDF de 7.800 tokens pedindo um resumo, a IA vai travar ou dar um erro. Por quê? Porque sobrou só um "espacinho" de 200 tokens na mesa inteira para ela tentar formular a resposta. Não tem espaço físico pra ela escrever de volta!
:::

## O Tamanho da Janela no Mundo Real

Nos primórdios (o tal do GPT-3 lá de 2020), a janela de contexto era minúscula. Cerca de 4.000 tokens, o tamanho de um artigo de blog. Hoje, a briga das grandes empresas é justamente para construir mesas de trabalho cada vez maiores!

| Modelo | Lançamento | Janela de Contexto | O que cabe dentro |
|:---|:---:|:---:|:---|
| GPT-3 | 2020 | ~4.000 tokens | Um artigo de blog longo |
| GPT-5.5 | abr/2026 | ~400.000 tokens | ~3 livros + espaço para respostas longas |
| Claude Opus 4.7 | abr/2026 | 1.000.000 tokens | ~10 livros de 300 páginas |
| Gemini 3.1 Pro | fev/2026 | 1.000.000 tokens | ~10 livros ou 1h de vídeo inteiro |

## O Problema do "Meio Esquecido"

Ter uma janela de contexto gigante não significa que a IA presta atenção **igualmente** em tudo o que está dentro dela. Pesquisas mostraram que os modelos tendem a lembrar muito bem do **início** e do **fim** da conversa, mas frequentemente "negligenciam" informações enterradas no meio.

Pense assim: se você colar um contrato de 50 páginas e a cláusula mais importante estiver na página 25, a IA tem uma chance maior de ignorar aquele trecho do que se ele estivesse na primeira ou última página. Esse fenômeno ficou conhecido entre os pesquisadores como o efeito **"Lost in the Middle"** (Perdido no Meio).



## Resumindo: A Regra do "Recadinho na Geladeira"

Sempre que a sua conversa ficar muito longa e você perceber que a IA está "esquecendo" como agir ou ignorando arquivos antigos, a culpa é da Janela de Contexto. O texto velho caiu para fora da mesa. 

A solução? Lembre-a! Assim como deixamos um recadinho colado na geladeira pra não esquecer de comprar leite, em conversas muito longas, vale a pena reenviar um resumo das regras principais para trazer a instrução de volta para a "mesa de trabalho" da IA.
:::tip[Mas e o que ela já sabe desde o começo?]
Beleza, acabamos de ver como funciona a memória *de curto prazo*. Mas espera aí... quando eu abro um chat zerado (com a "mesa" totalmente vazia) e pergunto: *"Qual é a capital do Brasil?"*, ela acerta de primeira: *"Brasília"*. 

Como ela sabe disso se não tava no meu texto e a janela tava limpa? Onde fica guardada a memória de *longo prazo* dela? Onde mora o "conhecimento" da IA? 

Guarde essa curiosidade, porque é exatamente isso que vamos explorar no nosso próximo assunto: os famosos e misteriosos **Parâmetros**! Bora lá?
:::
