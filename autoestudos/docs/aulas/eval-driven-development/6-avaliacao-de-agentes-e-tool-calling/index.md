---
sidebar_position: 6
sidebar_label: 'Avaliação de Agentes'
---

# Avaliação de Agentes e Tool Calling: Medindo Ações no Mundo Real

Avaliar um chatbot que apenas responde texto é como avaliar a redação de um aluno. Mas avaliar um **Agente de IA** é como avaliar um piloto de avião: ele precisa tomar decisões em tempo real, interagir com instrumentos (APIs, bancos de dados, navegadores), corrigir rotas diante de erros e pousar em segurança.

Com o surgimento de agentes autônomos e sistemas que utilizam **Function Calling / Tool Calling**, a avaliação deixa de focar apenas no *texto final* e passa a avaliar a **trajetória de decisões e os efeitos no mundo real**.

:::danger[O Risco dos Agentes em Produção]
Um erro de alucinação em um chat comum gera apenas um texto feio. Um erro de alucinação em um agente com permissão de escrita em banco de dados pode cancelar assinaturas indevidas, transferir fundos para contas erradas ou deletar tabelas de produção. A avaliação de agentes exige tolerância zero a falhas críticas.
:::

---

## 1. Métricas de Chamada de Ferramentas (Tool Calling)

Para que um agente funcione, cada chamada individual de ferramenta deve ser avaliada em três dimensões essenciais:

| Métrica de Tool Calling | Pergunta que a Métrica Responde | Exemplo de Falha Crítica |
| :--- | :--- | :--- |
| **1. Tool Selection Accuracy** | O modelo escolheu a ferramenta correta para a intenção do usuário? | Chamar `busca_web` em vez de `calculadora` para somar 15 + 27. |
| **2. Parameter Validity** | Os argumentos respeitam os tipos de dados e limites do schema? | Passar uma `string` quando a API exigia um `float` ou omitir campo obrigatório. |
| **3. Call Sequence & Dependencies** | A ordem lógica das chamadas faz sentido no fluxo? | Tentar transferir dinheiro antes de consultar o saldo disponível. |

### Exemplo de Teste de Acurácia de Tool Calling em Python:

```python
def testar_escolha_e_argumentos_de_ferramenta():
    caso_de_teste = {
        "usuario": "Transfira 150 reais para o João pelo Pix na chave joao@email.com",
        "ferramenta_esperada": "executar_pix",
        "argumentos_esperados": {
            "valor": 150.0,
            "chave_pix": "joao@email.com",
            "tipo_chave": "email"
        }
    }
    
    # Chamada real ao agente
    acao_gerada = agente.decidir_acao(caso_de_teste["usuario"])
    
    # 1. Validação de escolha da ferramenta
    assert acao_gerada.tool_name == caso_de_teste["ferramenta_esperada"], \
        f"Ferramenta incorreta: esperava {caso_de_teste['ferramenta_esperada']}, obteve {acao_gerada.tool_name}"
        
    # 2. Validação dos parâmetros
    for chave, valor_esperado in caso_de_teste["argumentos_esperados"].items():
        assert acao_gerada.tool_args.get(chave) == valor_esperado, \
            f"Parâmetro '{chave}' incorreto: esperava {valor_esperado}, obteve {acao_gerada.tool_args.get(chave)}"
```

---

## 2. Avaliação de Trajetória (Trajectory Evaluation)

Em tarefas complexas, o agente precisa executar múltiplos passos encadeados: buscar dados, analisar o resultado, corrigir erros e tentar novamente. A avaliação de trajetória analisa o **caminho** que o agente percorreu até a conclusão:

> **Meta do Usuário:** *"Analise o relatório de vendas de julho e envie um resumo no Slack."*

#### ✅ Trajetória Ótima (3 passos diretos):
1. `ler_arquivo("relatorio_julho.csv")`
2. `gerar_sumario(dados)`
3. `enviar_slack(canal="#vendas", mensagem=sumario)`

#### ❌ Trajetória Ineficiente / Degenerada (7 passos com loops e desperdício de tokens):
1. `ler_arquivo("relatorio_julho.csv")`
2. `ler_arquivo("relatorio_julho.csv")` *(⚠️ Loop inútil repetido)*
3. `ler_arquivo("relatorio_julho.csv")` *(⚠️ Loop inútil repetido)*
4. `pesquisar_google("como resumir csv")`
5. `gerar_sumario(dados)`
6. `enviar_slack(canal="#geral")` *(⚠️ Destino incorreto)*

:::info[Métricas de Trajetória]
* **Taxa de Sucesso da Tarefa (*Task Success Rate*)**: O agente cumpriu 100% da meta final com precisão?
* **Eficiência de Passos (*Step Efficiency*)**: Quantos passos o agente levou em comparação com a trajetória humana de referência?
* **Detecção de Loops Infinitos**: Identificar se o agente ficou preso chamando a mesma ferramenta com os mesmos parâmetros repetidamente.
* **Resiliência a Erros (*Self-Correction Rate*)**: Quando uma API retornou `HTTP 500` ou `404 Not Found`, o agente soube tentar uma estratégia alternativa ou travou completamente?
:::

---

## 3. Ambientes de Teste Isolados (Sandboxes e Mocks)

Como testar um agente que cria instâncias na AWS, envia e-mails ou deleta arquivos sem causar prejuízos no ambiente real?

A regra de ouro em engenharia de agentes é o **isolamento estrito**:
1. **Mock de APIs**: Substitua APIs externas por servidores locais que retornam respostas pré-gravadas estáticas.
2. **Sandboxes efêmeros (Containers Docker)**: Para agentes que executam código Python ou comandos no terminal bash, execute cada teste dentro de um container Docker temporário que é destruído logo após a finalização do teste.
3. **Validação do Estado Final do Banco de Dados**:
   ```python
   # Antes do teste: Saldo de R$ 1.000,00
   agente.executar_tarefa("Transferir R$ 200 para a conta B")
   # Após o teste: Verificar se o saldo na base de teste ficou exatamente R$ 800,00
   assert banco_de_teste.obter_saldo("conta_A") == 800.00
   ```

---

## Benchmarks Famosos de Avaliação de Agentes

Se você quiser comparar seus modelos com o estado da arte acadêmico, estes são os principais benchmarks da indústria:
* **SWE-bench**: Avalia a capacidade de agentes de IA de resolver issues e bugs reais do GitHub em repositórios open-source populares (como Django, SymPy e scikit-learn).
* **WebArena**: Avalia agentes navegando na web em interfaces reais (e-commerce, Reddit, Gitlab).
* **AgentBench**: Avalia agentes em múltiplos ambientes interativos (jogos de texto, sistemas operacionais e bancos de dados).

---

## Resumo

* Avaliar agentes exige ir além do texto e monitorar o ciclo de decisões, chamadas de ferramentas e efeitos colaterais.
* As métricas fundamentais de **Tool Calling** avaliam acurácia da escolha, validação de tipos de argumentos e sequenciamento lógico.
* A **Avaliação de Trajetória** mede a eficiência de passos, capacidade de autocorreção diante de erros e ausência de loops infinitos.
* Todos os testes de agentes devem ser executados em ambientes isolados (Mocks, Sandboxes Docker) com validação do estado final do sistema.

Agora que dominamos todas as métricas teóricas, quais ferramentas open-source e bibliotecas Python podemos usar para automatizar tudo isso? Vamos explorar os **Frameworks de Avaliação (Ragas, DeepEval, Promptfoo)** no próximo capítulo!
