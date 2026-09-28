import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(340, -90, 'Split conformal com corte temporal');

// linha do tempo
d.box('treino', 0, 0, 560, 70, 'TREINO (passado mais antigo)', 'verde', {strokeWidth: 3});
d.box('calib', 580, 0, 330, 70, 'CALIBRAÇÃO\n(fatia mais recente)', 'amarelo', {strokeWidth: 3});
d.box('teste', 930, 0, 300, 70, 'TESTE / FUTURO', 'cinza', {strokeWidth: 3});
d.arrowXY(0, 100, 1230, 100, {cor: 'cinza'});
d.text(0, 108, 'tempo', {size: 18, color: '#495057'});

// passos
d.box('p1', 0, 170, 360, 110, 'Treina o modelo\n(pontual ou quantílico)\nsó com o treino', 'verde', {fontSize: 18});
d.box('p2', 430, 170, 380, 110, 'Na calibração, mede o quanto\nele erra: nonconformity score\ns = |y − ŷ|  ou  max(q_lo − y, y − q_hi)', 'amarelo', {fontSize: 18});
d.box('p3', 880, 170, 350, 110, 'q̂ = quantil ⌈(n+1)(1−α)⌉/n\ndos scores\n(um pouco acima de 1−α)', 'amarelo', {fontSize: 18});
d.badge('b1', 10, 180, 1, 'verde');
d.badge('b2', 440, 180, 2, 'amarelo');
d.badge('b3', 890, 180, 3, 'amarelo');
d.arrow('treino', 'p1', {from: 'bottom', to: 'top'});
d.arrow('calib', 'p2', {from: 'bottom', to: 'top', via: [[745, 140], [620, 140]]});
d.arrow('p1', 'p2');
d.arrow('p2', 'p3');

d.box('split', 200, 360, 440, 100, 'SPLIT: ŷ ± q̂\nmesma largura para todo mundo', 'verde', {fontSize: 18});
d.box('cqr', 700, 360, 530, 100, 'CQR: [q_lo − q̂ ,  q_hi + q̂]\nlargura acompanha a dificuldade do caso', 'verde', {fontSize: 18});
d.badge('b4', 210, 370, 4, 'verde');
d.arrow('p3', 'split', {from: 'bottom', to: 'top', via: [[1000, 320], [420, 320]]});
d.arrow('p3', 'cqr', {from: 'bottom', to: 'top'});
d.arrow('teste', 'p3', {from: 'bottom', to: 'top', dashed: true, cor: 'cinza', label: 'aplica em'});

d.note('n1', 0, 500, 1230, 70,
  'Garantia: P(y ∈ intervalo) ≥ 1 − α, na MÉDIA, se calibração e futuro forem permutáveis.\nDrift quebra a hipótese; calibrar com a fatia mais recente reduz o estrago, mas não o elimina.',
  'vermelho', {textColor: '#e03131', fontSize: 18});

export default d.elements;
