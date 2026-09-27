import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(250, -90, 'Uma árvore de regressão, vista de dois jeitos');

// ---- esquerda: a árvore ----
d.text(150, -40, 'como perguntas de sim/não', {size: 20, color: '#495057'});
d.box('raiz', 150, 20, 300, 70, 'log_inscritos ≤ 11,6 ?', 'azul', {strokeWidth: 3});
d.box('esq', 0, 170, 260, 70, 'gancho ≤ 4,5 ?', 'azul');
d.box('dir', 340, 170, 260, 70, 'gancho ≤ 6,5 ?', 'azul');
d.arrow('raiz', 'esq', {from: 'bottom', to: 'top', label: 'sim'});
d.arrow('raiz', 'dir', {from: 'bottom', to: 'top', label: 'não'});

d.box('f1', 0, 330, 120, 70, 'ŷ = 4,9', 'verde', {fill: 'solid', bg: '#ebfbee'});
d.box('f2', 140, 330, 120, 70, 'ŷ = 5,4', 'verde', {fill: 'solid', bg: '#ebfbee'});
d.box('f3', 340, 330, 120, 70, 'ŷ = 6,6', 'verde', {fill: 'solid', bg: '#ebfbee'});
d.box('f4', 480, 330, 120, 70, 'ŷ = 7,3', 'verde', {fill: 'solid', bg: '#ebfbee'});
d.arrow('esq', 'f1', {from: 'bottom', to: 'top', label: 'sim'});
d.arrow('esq', 'f2', {from: 'bottom', to: 'top', label: 'não'});
d.arrow('dir', 'f3', {from: 'bottom', to: 'top', label: 'sim'});
d.arrow('dir', 'f4', {from: 'bottom', to: 'top', label: 'não'});

d.note('n-folha', 0, 440, 600, 70, 'Cada folha prevê a MÉDIA do alvo dos posts de treino\nque caíram nela (perda quadrática).', 'verde', {textColor: '#2f9e44'});

// ---- direita: o mesmo modelo como retângulos ----
const X0 = 760, X1 = 1220, Y0 = 20, Y1 = 400;
const xCorte = 997; // log_inscritos = 11,6 numa escala de 8 a 15
const yCorteEsq = Y1 - 0.45 * (Y1 - Y0); // gancho 4,5
const yCorteDir = Y1 - 0.65 * (Y1 - Y0); // gancho 6,5
d.text(830, -40, 'como retângulos no espaço das features', {size: 20, color: '#495057'});
const ret = {round: false, fill: 'solid', fontSize: 22};
d.box('r1', X0, yCorteEsq, xCorte - X0, Y1 - yCorteEsq, 'ŷ = 4,9', 'verde', {...ret, bg: '#ebfbee'});
d.box('r2', X0, Y0, xCorte - X0, yCorteEsq - Y0, 'ŷ = 5,4', 'verde', {...ret, bg: '#d3f9d8'});
d.box('r3', xCorte, yCorteDir, X1 - xCorte, Y1 - yCorteDir, 'ŷ = 6,6', 'verde', {...ret, bg: '#b2f2bb'});
d.box('r4', xCorte, Y0, X1 - xCorte, yCorteDir - Y0, 'ŷ = 7,3', 'verde', {...ret, bg: '#8ce99a'});
d.line([[X0, Y1], [X1 + 20, Y1]], {strokeWidth: 3});
d.line([[X0, Y1], [X0, Y0 - 20]], {strokeWidth: 3});
d.text(1080, Y1 + 12, 'log_inscritos', {size: 18});
d.text(X0 - 30, Y0 - 34, 'gancho', {size: 18});
d.text(xCorte - 20, Y1 + 12, '11,6', {size: 16, color: '#1971c2'});
d.text(X0 - 42, yCorteEsq - 10, '4,5', {size: 16, color: '#1971c2'});
d.text(X1 + 8, yCorteDir - 10, '6,5', {size: 16, color: '#1971c2'});

d.note('n-inter', 760, 440, 480, 70, 'O limiar do gancho muda com o tamanho do canal:\numa INTERAÇÃO que a árvore acha sozinha.', 'azul', {textColor: '#1971c2'});

d.text(0, 540, 'Valores ilustrativos, em log1p(curtidas).', {size: 16, color: '#868e96'});

export default d.elements;
