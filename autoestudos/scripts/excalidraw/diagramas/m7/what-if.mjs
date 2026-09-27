import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(170, -90, 'What-if: o LLM propõe, o suporte filtra, o modelo julga');

// quem propõe
d.box('orig', 0, 50, 250, 120, 'Short A original\n(features conhecidas\nantes de postar)', 'azul');
d.box('llm', 330, -10, 280, 100, 'LLM propõe legendas\n(texto livre, mesmo tom)', 'roxo');
d.box('regras', 330, 130, 280, 110, 'você propõe mudanças\ncontroláveis: hora,\ngancho, duração', 'cinza');
d.arrow('orig', 'llm', {from: 'right', to: 'left'});
d.arrow('orig', 'regras', {from: 'right', to: 'left'});

// filtro de suporte
d.box('sup', 690, 35, 240, 150, 'filtro de suporte:\njá vimos posts\nparecidos no\nmesmo setor?', 'vermelho');
d.arrow('llm', 'sup', {from: 'right', to: 'left'});
d.arrow('regras', 'sup', {from: 'right', to: 'left'});
d.note('fora', 690, 300, 240, 90, 'não: descarte ou\nmarque como "fora\ndo suporte"', 'vermelho', {textColor: '#e03131'});
d.arrow('sup', 'fora', {from: 'bottom', to: 'top', dashed: true, cor: 'vermelho', label: 'não'});

// o modelo julga
d.box('modelo', 1020, 50, 260, 130, 'modelo pontua\nq10, q50, q90\n(original e variação)', 'verde', {strokeWidth: 3});
d.arrow('sup', 'modelo', {from: 'right', to: 'left', label: 'sim'});
d.box('tabela', 1020, 260, 260, 120, 'tabela: Δ p50,\nfaixa 80%, P(V > O)\ne suporte', 'amarelo');
d.arrow('modelo', 'tabela', {from: 'bottom', to: 'top'});
d.box('estavel', 1020, 450, 260, 100, 'o efeito é estável?\nbootstrap por canal', 'amarelo');
d.arrow('tabela', 'estavel', {from: 'bottom', to: 'top'});
d.box('sugestao', 600, 450, 330, 100, 'sugestão para a marca,\ncom ressalvas (não é\ngarantia causal)', 'roxo');
d.arrow('estavel', 'sugestao', {from: 'left', to: 'right'});

// alerta de correlação
d.note('causa', 0, 300, 520, 150, 'Correlação não é causa.\nSe o modelo não vê o gancho, "publicar às 19h"\nherda o efeito dos bons ganchos que os criadores\nguardam para o horário nobre:\n+23% previsto contra +13% real (dados simulados).', 'vermelho', {textColor: '#e03131'});

export default d.elements;
