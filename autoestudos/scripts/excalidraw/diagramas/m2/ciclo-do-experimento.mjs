import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(345, -100, 'O ciclo de um experimento rastreável');

const W = 360;
const H = 130;
d.box('hip', 0, 0, W, H, '1. HIPÓTESE (HIPOTESES.md)\n"o gancho sobe o par-a-par\nintra-canal em ≥ 0,03"', 'azul');
d.box('cfg', 430, 0, W, H, '2. CONFIG (configs/*.yaml)\nfeatures, data de corte,\ngap, seed, hiperparâmetros', 'azul');
d.box('tr', 860, 0, W, H, '3. TREINO\npython -m experimentos.treinar\nsplit temporal + métricas', 'verde', {strokeWidth: 3});
d.box('run', 860, 250, W, H, '4. RUN NO MLFLOW\nparams · metrics · modelo\ntags: commit, corte, base', 'cinza');
d.box('cmp', 430, 250, W, H, '5. COMPARAR\nmlflow ui ou search_runs\n+ IC por bootstrap', 'amarelo');
d.box('dec', 0, 250, W, H, '6. DECISÃO\naceita, rejeita ou refina;\nanota o resultado na hipótese', 'verde');

d.arrow('hip', 'cfg');
d.arrow('cfg', 'tr');
d.arrow('tr', 'run');
d.arrow('run', 'cmp');
d.arrow('cmp', 'dec');
d.arrow('dec', 'hip', {label: 'próxima hipótese'});

d.note('pytest', 860, 440, W, 90, 'pytest roda ANTES do treino:\nmétricas e splits testados', 'cinza');
d.arrow('pytest', 'tr', {from: 'right', to: 'right', via: [[1265, 485], [1265, 65]], dashed: true, cor: 'cinza'});
d.note('regra', 0, 440, 790, 90, 'regra: nenhum número entra no README sem um run_id\nque permita reproduzi-lo (commit + config + versão da base)', 'vermelho', {textColor: '#e03131'});

export default d.elements;
