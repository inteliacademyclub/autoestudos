import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(250, 60, 'Alvo relativo: comparar o post com o passado do canal');

// posts do canal ao longo do tempo (alturas ~ log das curtidas)
const alturas = [60, 90, 45, 110, 70, 95, 55, 120, 80, 100, 150, 85, 130, 105];
const t = 10; // índice do post-alvo
const base = 300;
const x0 = 40;
const passo = 80;

d.line([[0, base], [x0 + alturas.length * passo, base]], {strokeWidth: 3});
d.arrowXY(x0 + alturas.length * passo - 10, base, x0 + alturas.length * passo + 40, base, {strokeWidth: 3});
d.text(x0 + alturas.length * passo - 30, base + 14, 'tempo', {size: 18, color: '#495057'});

alturas.forEach((h, i) => {
  const cor = i < t ? 'ciano' : i === t ? 'amarelo' : 'vermelho';
  const opts = i > t ? {fill: 'solid', bg: '#fff5f5', dashed: true} : {fill: 'solid'};
  d.box(`p${i}`, x0 + i * passo, base - h, 50, h, '', cor, opts);
});

// mediana dos anteriores
const med = 88;
d.line([[x0 - 10, base - med], [x0 + t * passo - 20, base - med]], {dashed: true, cor: 'ciano', strokeWidth: 3});
d.text(x0, base - 150, 'mediana dos posts ANTERIORES (linha tracejada)', {size: 18, color: '#0c8599'});

// rótulos das regiões
d.text(x0 + 60, base + 16, 'histórico: pode entrar no cálculo', {size: 18, color: '#0c8599'});
d.text(x0 + t * passo - 30, base + 16, 'post t', {size: 18, color: '#f08c00'});
d.text(x0 + (t + 1) * passo, base + 16, 'futuro: NÃO entra', {size: 18, color: '#e03131'});

// fórmula
d.box(
  'formula',
  0,
  370,
  620,
  110,
  'y_rel(t) = log( (curtidas_t + 1) / (mediana_anteriores_t + 1) )\n0 = "na mediana do canal";  +0,69 ≈ 2×;  −0,69 ≈ metade',
  'amarelo',
  {fontSize: 18},
);

// faixas
const fx = 680;
const fw = 600;
const cortes = [
  {nome: 'abaixo', w: 0.25, cor: 'vermelho'},
  {nome: 'na média', w: 0.5, cor: 'cinza'},
  {nome: 'acima', w: 0.2, cor: 'verde'},
  {nome: 'viral', w: 0.05, cor: 'roxo'},
];
let acc = fx;
cortes.forEach((c, i) => {
  const w = c.w * fw;
  d.box(`f${i}`, acc, 380, w, 50, '', c.cor, {fill: 'solid'});
  d.text(acc + (i === 3 ? -6 : 8), 440, c.nome, {size: 16, color: '#1e1e1e'});
  acc += w;
});
d.text(fx + 0.25 * fw - 20, 350, 'p25', {size: 16, color: '#495057'});
d.text(fx + 0.75 * fw - 20, 350, 'p75', {size: 16, color: '#495057'});
d.text(fx + 0.95 * fw - 30, 350, 'p95', {size: 16, color: '#495057'});
d.text(fx, 470, 'faixas = quantis das curtidas dos posts anteriores do canal', {size: 16, color: '#495057'});

export default d.elements;
