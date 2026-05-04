---
sidebar_position: 6
sidebar_label: 'Prompting'
---

# Prompting: A Arte de Dirigir a IA

No capítulo anterior, nós comparamos a IA a um carrão potente. Você já sabe qual é o combustível (Tokens), o limite do tanque (Janela de Contexto), onde fica a potência do motor (Parâmetros) e como controlar o volante da criatividade (Temperatura). 

Mas cá entre nós: de que adianta você ter a chave de uma Ferrari na mão se você não sabe dirigir? 

É aqui que entra o **Prompting** (ou Engenharia de Prompts). 

## A Síndrome do Passageiro de Táxi

Imagine que você entra num táxi, senta no banco de trás, olha pro motorista e diz: *"Me leva pra comer alguma coisa"*. 

O que vai acontecer? O taxista pode te levar num podrão na esquina, num restaurante vegano caríssimo do outro lado da cidade ou numa pizzaria que você odeia. Ele adivinhou errado? Não! A culpa foi sua. A sua instrução foi péssima.

Com a Inteligência Artificial, acontece exatamente a mesma coisa. O **Prompt** nada mais é do que a instrução que você digita na caixinha de texto. E existe uma regra de ouro na ciência da computação que se aplica perfeitamente aqui: **Lixo entra, lixo sai** (*Garbage in, garbage out*).

Se você dá uma instrução preguiçosa, a IA vai te dar uma resposta preguiçosa, genérica e com cara de robô.

<div align="center">

<img src="/autoestudos/img/prompt.jpg" alt="Prompt image" width="100%" />

</div>

## O Condicionamento Probabilístico

Para entender o Prompting de forma mais profunda, precisamos voltar à matemática do modelo. A IA não "entende" os seus desejos; ela calcula probabilidades.

Quando a Janela de Contexto está vazia, as opções da IA são infinitamente amplas. Ela pode gerar qualquer coisa. O ato de escrever um Prompt é, na verdade, o ato de **condicionar probabilidades**. Cada palavra que você insere na Janela de Contexto atua como um filtro matemático que restringe drasticamente as rotas que a rede neural pode seguir.

- Se você diz apenas *"Escreva sobre maçãs"*, as palavras prováveis que se seguem podem ir para nutrição, tecnologia (a empresa Apple) ou agricultura. A distribuição de probabilidade é vasta e difusa.
- Se você diz *"Aja como um nutricionista e escreva sobre maçãs"*, você acabou de ativar parâmetros completamente diferentes na rede neural. Você "forçou" a eletricidade a correr pelas estradas da biologia e da saúde, reduzindo a chance da IA falar sobre iPhones a quase zero.

A estrutura comum de dicas da internet (definir Papel, Tarefa e Contexto) funciona bem não porque é um truque de mágica, mas porque é a forma semântica mais eficiente de "cercar" a matemática do modelo, eliminando ambiguidades do espaço latente.


:::tip[O Instinto Dev: A carteirada do "Staff Engineer"]
Antes de pedir para a IA revisar um código complexo, todo dev tem a mania de mandar um: *"Aja como um Staff Software Engineer do Google especialista em Clean Code..."*.

Por que instintivamente sabemos que isso funciona? Não é porque a IA gosta de elogio. É porque essas palavras-chave específicas ativam as conexões neurais que foram treinadas nos repositórios de mais alto nível do GitHub e em livros de arquitetura sênior. Você usa o Prompt para "filtrar" a probabilidade matemática, evitando que ela puxe respostas daquele tutorial ruim de 2012 de um desenvolvedor júnior.
:::

## A Teoria: Zero-Shot vs Few-Shot

Na engenharia de Inteligência Artificial, existem termos técnicos para definir como nos comunicamos com os parâmetros do modelo, dependendo do nível de "ancoragem" que fornecemos na entrada:

### 1. Zero-Shot Prompting (Tiro no Escuro)
É quando você pede para a IA realizar uma tarefa sem dar nenhum exemplo de como ela deve ser feita (Ex: *"Traduza 'bom dia' para francês"*). Modelos gigantescos (como vimos no capítulo de Parâmetros) são excelentes em Zero-Shot porque têm bilhões de conexões e conseguem deduzir a regra implícita instantaneamente a partir do seu treinamento global.

### 2. Few-Shot Prompting (Ancoragem por Exemplos)
É quando você insere exemplos de entrada e saída no próprio prompt antes de fazer o pedido final. Matematicamente, isso é incrivelmente poderoso. 

Ao fornecer exemplos prévios, você não está apenas dando uma "dica" de formatação. Você está forçando um alinhamento temporário de padrões (*pattern recognition*) na memória de curto prazo (Janela de Contexto). 

Para quem programa, isso é ouro: se você quer que a IA te devolva dados formatados, em vez de implorar *"por favor, use aspas duplas e retorne chaves minúsculas"*, basta colar um exemplo como `[{"nome": "João"}]` dentro do prompt. A rede neural "engata" no padrão estatístico daquele JSON e continua gerando a resposta na exata mesma frequência sintática, reduzindo a quase zero o risco dela quebrar o seu código com formatações malucas.

:::info[O Idioma do Código]
Isso explica algo que todo programador já percebeu na prática: **se você pedir para a IA gerar um código em inglês, o resultado costuma ser muito melhor e com menos bugs do que em português**. 

Por quê? Porque 90% do código fonte (GitHub, StackOverflow) que a IA leu durante o treinamento estava em inglês. As "estradas matemáticas" ligando palavras em inglês a códigos limpos são rodovias perfeitamente asfaltadas. Quando você faz um prompt complexo de programação em português, a IA é obrigada a percorrer um caminho de terra esburacado no espaço de probabilidade para tentar chegar ao mesmo código.
:::


## Resumindo

A IA é a máquina de prever palavras mais poderosa do mundo. Mas o *Prompt* é o trilho por onde esse trem vai andar. Quanto mais estreito, específico e detalhado for o seu trilho, mais rápido e certeiro o trem vai chegar no destino que você quer.

:::warning[Mas e se o trilho levar para um abismo?]
Agora, uma pergunta perigosa: o que acontece se você der um prompt perfeito para o motorista de táxi... mas pedir para ele te levar para **"Nárnia"** ou para **"Hogwarts"**? 

O motorista humano viraria pra você e diria: *"Chefe, esse lugar não existe"*. 

Mas a IA? Lembra que ela é apenas um motor estatístico focado em prever a próxima palavra? Ela está tão desesperada para te dar uma resposta fluida que, em vez de dizer "eu não sei"... ela vai **inventar** um caminho para Nárnia com a maior confiança do mundo! 

E é esse erro de percurso que nos leva ao nosso próximo e assustador capítulo: a **Alucinação**! 
:::