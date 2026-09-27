import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(130, -90, 'Conformal adaptativo: o intervalo aprende com os próprios erros');

// coluna da esquerda: split conformal congelado
d.text(0, -30, 'SPLIT CONFORMAL (congelado)', {size: 22, color: '#495057'});
d.box('cal', 0, 20, 380, 100, 'calibração uma vez só\n(resíduos de um período\nanterior à produção)', 'azul');
d.box('q', 0, 180, 380, 90, 'quantil congelado\nq = 0,674', 'verde');
d.box('int', 0, 330, 380, 90, 'intervalo = ŷ ± q\n(o mesmo q para sempre)', 'verde');
d.note('quebra', 0, 480, 380, 110, 'depois da quebra de regime:\ncobertura de 80% cai para 54%\ne ninguém percebe', 'vermelho', {textColor: '#e03131', fontSize: 18});
d.arrow('cal', 'q');
d.arrow('q', 'int');
d.arrow('int', 'quebra', {dashed: true, cor: 'vermelho'});

// coluna da direita: laço do ACI
d.text(520, -30, 'ACI (Gibbs e Candès, 2021)', {size: 22, color: '#2f9e44'});
d.box('prev', 520, 20, 330, 100, 'prever o intervalo\nŷ ± quantil (1 − αₜ)\ndos resíduos', 'verde', {strokeWidth: 3});
d.box('espera', 920, 20, 330, 100, 'publicar e esperar\nas curtidas maturarem\n(~30 dias)', 'azul');
d.diamond('dentro', 945, 165, 280, 170, 'o valor real\ncaiu dentro?', 'amarelo');
d.box('acertou', 520, 390, 330, 100, 'acertou: errₜ = 0\nαₜ sobe um pouco\n(intervalo estreita)', 'verde');
d.box('errou', 920, 390, 330, 100, 'errou: errₜ = 1\nαₜ desce bem mais\n(intervalo alarga)', 'vermelho');
d.box('formula', 520, 560, 730, 80, 'αₜ₊₁ = αₜ + γ · (α − errₜ)', 'cinza', {strokeWidth: 3, fontSize: 24});

d.arrow('prev', 'espera');
d.arrow('espera', 'dentro', {from: 'bottom', to: 'top'});
d.arrow('dentro', 'acertou', {from: 'left', to: 'top', via: [[685, 250]]});
d.arrow('dentro', 'errou', {from: 'bottom', to: 'top', label: 'não'});
d.text(770, 218, 'sim', {size: 18});
d.arrowXY(685, 496, 685, 554);
d.arrowXY(1085, 496, 1085, 554);
d.arrow('formula', 'prev', {from: 'left', to: 'left', via: [[460, 600], [460, 70]], cor: 'verde'});
d.text(420, 330, 'próximo\npost', {size: 18, color: '#2f9e44', align: 'center'});

d.note('resumo', 520, 680, 730, 100, 'Na simulação da aula, o ACI volta para ~80% de cobertura\nem poucas semanas, pagando com intervalos ~1,6× mais largos.\nCom o atraso real de 30 dias, a volta é mais lenta.', 'verde', {textColor: '#2f9e44', fontSize: 18});

export default d.elements;
