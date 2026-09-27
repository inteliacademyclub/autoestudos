import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(330, -90, 'confidence_flag: regras simples, motivos legíveis');

const regras = [
  ['r1', 'Intervalo largo\nlargura em log > p80', 'verde'],
  ['r2', 'Canal novo\n< 10 posts anteriores', 'ciano'],
  ['r3', 'Setor ou canal\nfora do treino', 'ciano'],
  ['r4', 'Criativo "estranho"\ndistância kNN > p99', 'laranja'],
  ['r5', 'Extração falhou\nvídeo ou VLM', 'laranja'],
  ['r6', 'Data fora do período\ndos dados', 'azul'],
];
regras.forEach(([id, txt, cor], i) => {
  d.box(id, 0, i * 95, 300, 78, txt, cor, {fontSize: 18});
});

d.diamond('ou', 420, 170, 200, 170, 'alguma\nregra\ndisparou?', 'cinza', {fontSize: 18});
regras.forEach(([id]) => d.arrow(id, 'ou', {to: 'left'}));

d.box('sim', 720, 60, 510, 130,
  'baixa_confianca = true\nmotivos = [{codigo, texto}, ...]\n"Baixa confiança porque o canal\ntem só 4 posts anteriores."', 'vermelho', {fontSize: 18, strokeWidth: 3});
d.box('nao', 720, 320, 510, 90, 'baixa_confianca = false\nmotivos = []', 'verde', {fontSize: 18});
d.arrow('ou', 'sim', {from: 'top', to: 'left', via: [[520, 125]], label: 'sim'});
d.arrow('ou', 'nao', {from: 'bottom', to: 'left', via: [[520, 365]], label: 'não'});

d.note('n1', 720, 450, 510, 100,
  'Validação: o erro médio dos casos sinalizados\nprecisa ser MAIOR que o dos não sinalizados.\nSe não for, o flag é só ruído.', 'vermelho', {textColor: '#e03131', fontSize: 18});

export default d.elements;
