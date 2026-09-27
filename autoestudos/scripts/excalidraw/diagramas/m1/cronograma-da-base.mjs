import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(230, -80, 'A cota é diária: comece a coletar no dia 1');

// eixo das 4 semanas
const x0 = 0;
const larg = 300;
const semanas = [
  {n: 'Semana 1', datas: '23/09 a 29/09', cor: 'azul', txt: 'curadoria de canais\n1ª coleta completa\n(metadados + snapshot)'},
  {n: 'Semana 2', datas: '30/09 a 06/10', cor: 'azul', txt: 'coleta incremental diária\nsnapshots dos Shorts jovens\nbaselines no que já tem'},
  {n: 'Semana 3', datas: '07/10 a 13/10', cor: 'verde', txt: 'congela a base de treino\n(Shorts com ≥ 30 dias)\nmodelo + features'},
  {n: 'Semana 4', datas: '14/10 a 23/10', cor: 'roxo', txt: 'última coleta de rótulos\nagente, MCP, README\n(entrega 23/10)'},
];
semanas.forEach((s, i) => {
  const x = x0 + i * (larg + 20);
  d.box(`s${i}`, x, 0, larg, 50, `${s.n}  ·  ${s.datas}`, s.cor, {fill: 'solid', fontSize: 18});
  d.box(`t${i}`, x, 70, larg, 100, s.txt, 'cinza', {fill: 'solid', bg: '#ffffff', fontSize: 18});
});

// coletas diárias (marcas) ao longo do mês
d.text(0, 205, 'coletas (1 por dia de cota):', {size: 18, color: '#1971c2'});
for (let i = 0; i < 31; i++) {
  const x = 250 + i * 32;
  d.ellipse(`c${i}`, x, 205, 18, 18, '', 'azul', {fill: 'solid'});
}

// regra dos 30 dias
d.box(
  'regra',
  0,
  260,
  620,
  120,
  'Regra do rótulo: um Short só entra no treino\ncom ≥ 30 dias de vida. Coleta em 28/09 rotula\nvídeos publicados até 29/08; coleta em 19/10,\nvídeos publicados até 19/09.',
  'amarelo',
);
d.box(
  'cota',
  660,
  260,
  600,
  120,
  'A cota (10.000 unidades) zera à meia-noite do\nPacífico: 04h em Brasília até 01/11/2026 (05h depois).\nUnidade não usada hoje não acumula para amanhã.',
  'cinza',
);

d.note(
  'moral',
  160,
  410,
  940,
  60,
  'Quem começa a coletar só na semana 3 perde duas semanas de cota e de maturação dos rótulos.',
  'vermelho',
  {textColor: '#e03131', fontSize: 18},
);

export default d.elements;
