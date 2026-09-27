import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(310, -100, 'Quatro jeitos de separar treino e teste');

const COR = {T: ['verde', '#b2f2bb'], X: ['amarelo', '#ffec99'], G: ['cinza', '#f1f3f5']};
const CW = 55;
const CH = 34;

// cada painel: 4 canais (linhas) x 8 períodos (colunas). T = treino, X = teste, G = fora
function painel(id, x0, y0, titulo, linhas, legenda, corLegenda) {
  d.text(x0, y0, titulo, {size: 22});
  linhas.forEach((linha, r) => {
    d.text(x0, y0 + 48 + r * (CH + 8), `canal ${r + 1}`, {size: 16, color: '#495057'});
    [...linha].forEach((c, k) => {
      const [cor, bg] = COR[c];
      d.box(`${id}-${r}-${k}`, x0 + 80 + k * CW, y0 + 42 + r * (CH + 8), CW - 6, CH, '', cor, {fill: 'solid', bg, round: false, dashed: c === 'G'});
    });
  });
  d.text(x0 + 80, y0 + 42 + 4 * (CH + 8) + 4, 'tempo →', {size: 16, color: '#495057'});
  d.note(`${id}-n`, x0, y0 + 240, 520, 70, legenda, corLegenda, {textColor: corLegenda === 'vermelho' ? '#e03131' : '#2f9e44'});
}

painel('a', 0, 0, 'A. aleatório (KFold)', ['TXTTTXTT', 'TTXTTTXT', 'XTTTXTTT', 'TTTXTTTX'],
  'OTIMISTA: o treino tem posts DEPOIS do teste,\ndo mesmo canal (vizinhos no tempo se parecem)', 'vermelho');
painel('b', 660, 0, 'B. holdout temporal com gap', ['TTTTTGXX', 'TTTTTGXX', 'TTTTTGXX', 'TTTTTGXX'],
  'HONESTO para "próximo post de canal conhecido";\no gap imita o alvo que ainda não amadureceu', 'verde');
painel('c', 0, 360, 'C. por canal (GroupKFold)', ['TTTTTTTT', 'TTTTTTTT', 'XXXXXXXX', 'TTTTTTTT'],
  'mede "canal que o modelo nunca viu",\nmas ainda deixa o treino ver o futuro', 'vermelho');
painel('d', 660, 360, 'D. canal novo no futuro', ['TTTTTGGG', 'TTTTTGGG', 'GGGGGGXX', 'TTTTTGGG'],
  'o mais exigente: canal fora do treino E datas\ndepois do corte (o caso de um cliente novo)', 'verde');

// legenda
d.box('lt', 0, 700, 40, 26, '', 'verde', {fill: 'solid', bg: '#b2f2bb', round: false});
d.text(50, 700, 'treino', {size: 18});
d.box('lx', 160, 700, 40, 26, '', 'amarelo', {fill: 'solid', bg: '#ffec99', round: false});
d.text(210, 700, 'teste', {size: 18});
d.box('lg', 310, 700, 40, 26, '', 'cinza', {fill: 'solid', bg: '#f1f3f5', round: false, dashed: true});
d.text(360, 700, 'fora (gap ou descartado)', {size: 18});

export default d.elements;
