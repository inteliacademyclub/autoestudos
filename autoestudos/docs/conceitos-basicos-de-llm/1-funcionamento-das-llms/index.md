---
sidebar_position: 1
sidebar_label: 'Funcionamento das LLMs'
---

# Funcionamento das LLMs: O Conceito

Sabe quando você tá digitando uma mensagem no WhatsApp, escreve "Bom" e o teclado já sugere "dia"? E se você apertar "dia", ele sugere "tudo", e depois "bem"? 

Acredite se quiser, mas é **exatamente** isso que o ChatGPT, o Claude, o Gemini e outras Inteligências Artificiais fazem. Eles são, na sua essência, teclados de celular aprimorados! 


<div align="center">

![Teclado do celular sugerindo palavras](/img/tecladopredicao.avif)

</div>

Você acha que a IA tá lá pensando profundamente, suando frio pra resolver o seu problema e tendo crises existenciais? Que nada! O que uma LLM (Large Language Model, ou Grande Modelo de Linguagem) faz é simplesmente brincar de adivinhação. É um gigantesco e absurdamente complexo motor de previsão de texto.


:::info[O Autocomplete do Programador]
Se você programa usando ferramentas como o **GitHub Copilot** no VS Code ou o editor **Cursor**, você já vê isso acontecendo em tempo real todo dia. 

Aquele texto cinza "fantasma" que aparece sugerindo o resto da sua função nada mais é do que a IA lendo as variáveis e o código que você já digitou e calculando em milissegundos: *"Qual é o próximo pedaço de texto mais provável para fechar essa lógica?"*. É literalmente a mesma mecânica do corretor do WhatsApp, mas treinado para cuspir lógica de programação em vez de mensagens de bom dia!


:::


## Como a IA consegue fazer tanta coisa?

Aí é que entra o "Large" (Grande) do nome LLM. O seu teclado do celular aprendeu com as mensagens que você manda pra sua mãe e pros seus amigos. Já uma LLM "leu" praticamente toda a internet pública antes de ser lançada. Estamos falando de milhões de livros, artigos da Wikipédia inteira em vários idiomas, receitas de bolo, fóruns do Reddit, manuais de instrução e bilhões de linhas de código de programação.

<div align="center">

![Robô lendo livros](/img/robolendo.png)

</div>

Se eu virar pra você e disser: "O rato roeu a roupa do rei de...", qual é a próxima palavra? Você grita "Roma!", certo? 

A IA faz a mesma coisa, só que num nível absurdamente mais profundo. Ela não entende o que é um rato, não sabe que ele tem pelo, nem sabe o que é Roma (que é uma cidade na Itália). Ela apenas aprendeu estatisticamente, depois de ler montanhas de texto, que a palavra "Roma" tem 99,9% de chance de aparecer depois daquela sequência exata de palavras. 

## Como a conversa realmente acontece

Tem uma coisa muito doida sobre como a gente interage com essas IAs. Quando você manda uma pergunta no chat, tipo: *"Qual a capital da França?"*, você imagina que a IA recebe a mensagem de um lado da mesa, pensa, e te devolve uma resposta do outro lado, como uma conversa normal de humanos, certo? 

Errado! 

Na cabeça da LLM, não existe "eu" e "você". O que ela faz é pegar a sua pergunta e colar no topo de um "documento em branco" invisível. Pra IA, a tarefa é apenas continuar escrevendo esse documento de forma que faça sentido. É o que o pessoal de tecnologia chama de "concatenar".

Ela olha para a frase: *"Paris is the city"* e o motor estatístico calcula: "Se eu estivesse lendo um texto na internet com esse começo, qual seria a próxima palavra mais provável?". 

Aí o modelo levanta as probabilidades matemáticas. Como você pode ver na imagem, ele descobre que a palavra **"of"** tem a maior chance de aparecer, seguida por **"where"**, **"with"** e **"in"**.

<div align="center">

![Concatenação e probabilidade](/img/concatenacaoprobabilidade.png)

</div>

:::info[Um detalhe muito legal]
A IA nem sempre escolhe a opção nº 1, a mais óbvia. Se ela sempre fizesse isso, as respostas ficariam chatas, robóticas e sempre iguais. Para dar um toque de criatividade e deixar a conversa mais humana, ela tem uma certa aleatoriedade programada que permite escolher as outras palavras da lista de vez em quando. É isso que chamamos de **Temperatura** (um ajuste que vamos explorar a fundo mais pra frente!).
:::

Mas, para o nosso exemplo, digamos que ela escolheu a mais provável, gerando a palavra **"of"**. 

Mas a mágica real vem agora: ela não guarda a resposta final num baú. Para gerar a *próxima* palavra do texto, ela pega a frase inteira **junto com a nova palavra que acabou de gerar** e joga tudo de volta no motor! 


O cálculo agora roda de novo, mas com um texto maior: *"Paris is the city of"* -> Qual a próxima palavra?
Ela gera, por exemplo, a palavra **"love"**.
E recomeça o ciclo: *"Paris is the city of love"* -> Qual a próxima palavra?
E assim por diante!

:::tip[Alerta de Spoiler]
Eu tenho falado em "palavras" até agora para facilitar o entendimento, mas a IA não enxerga palavras exatamente como nós. Na verdade, ela quebra tudo em pequenos pedacinhos chamados **Tokens**. Mas não esquenta com isso agora, porque é exatamente esse o assunto do nosso próximo capítulo!
:::

Ela está sempre pegando o texto inteiro (seu *prompt* + tudo o que ela já respondeu até agora) e usando como contexto para adivinhar apenas **uma única próxima palavra**. E ela faz esse looping furioso, de recolar o texto e prever mais uma palavrinha, milhares de vezes por segundo. É por isso que chamamos esses modelos de "autorregressivos": eles sempre usam o próprio passado imediato para prever o próximo pedacinho do futuro.

## A ilusão de que a IA pensa (e por que ela parece tão inteligente)

Quando você pede: *"Escreva um poema triste sobre um cachorro"*, a IA não sente tristeza. Ela não sabe o que é um cachorro latindo ou o cheiro de ração. Então, como ela consegue ser tão convincente?

### O Mapa de Conceitos
Imagine que a IA vive dentro de um mapa gigantesco com bilhões de pontos. Nesse mapa, palavras ou ideias com significados parecidos moram perto uma da outra. 
- "Cachorro" mora perto de "Lealdade", "Pelo" e "Amizade".
- "Tristeza" mora perto de "Lágrima", "Chuva" e "Adeus".

Quando você faz um pedido, a IA não está apenas buscando palavras em uma lista; ela está navegando por esse mapa. Ela faz conexões entre os pontos. Para ela, "pensar" é encontrar o caminho matemático mais provável que ligue o ponto "Cachorro" ao ponto "Tristeza" seguindo as regras de um "Poema".

### A Inteligência "Emergente"
O que choca os cientistas é que, ao aprender a prever a próxima palavra trilhões de vezes, a IA acabou aprendendo **lógica** por acidente. 

Se ela leu milhões de manuais de reparo e livros de filosofia, ela aprendeu o padrão de que: *"Se A é maior que B, e B é maior que C, então A é maior que C"*. Ela não sabe o que é A ou B, mas ela aprendeu que esse **padrão de raciocínio** é a forma mais provável de continuar um texto que contenha uma comparação lógica. 

### Raciocínio vs. Cálculo
A grande diferença é:
*   **Nós humanos:** Pensamos para entender o mundo. Temos sentimentos, objetivos e consciência.
*   **A IA:** Calcula para completar o texto. Ela é uma mestra em imitar o resultado final do pensamento humano.

Ela não "sabe" a resposta; ela sabe qual é o **formato** de uma resposta correta. É por isso que ela consegue programar em Python ou explicar física quântica: não porque ela entende as leis do universo, mas porque ela se tornou a maior especialista do mundo em identificar e reproduzir os padrões de como os humanos explicam essas coisas.

## Resumindo

Uma LLM não é um cérebro humano dentro do computador. Não é um banco de dados mágico onde ela vai buscar a resposta pronta numa prateleira. 

Ela é um "papagaio estatístico" hiperativo. Ela mapeou a estrutura da nossa linguagem tão perfeitamente que consegue gerar textos novos, criar conexões e resolver problemas apenas prevendo qual é a próxima pecinha desse enorme quebra-cabeça de palavras.
