import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(250, -90, 'O VLM como formulário, não como oráculo');

d.box('url', 0, 0, 230, 90, 'URL pública\ndo Short', 'azul');
d.box('prompt', 0, 140, 230, 110, 'prompt\nâncoras 0 / 5 / 10\n+ regras do setor', 'cinza');
d.box('schema', 0, 300, 230, 90, 'schema Pydantic\n(18 campos)', 'cinza');

d.box('gemini', 320, 120, 270, 150, 'Gemini\ntemperature = 0\nresponse_schema\n1 fps, baixa resolução', 'laranja', {strokeWidth: 3});

d.box('valida', 690, 145, 220, 100, 'validação\nPydantic', 'verde');
d.box('parquet', 1010, 145, 270, 100, 'vlm_*.parquet\n1 linha por vídeo', 'azul');
d.box('retry', 330, 340, 250, 90, '429 / 5xx: espera\n(backoff exponencial)\ne tenta de novo', 'vermelho', {fontSize: 18});
d.box('conf', 1010, 310, 270, 140, 'CONFIABILIDADE\nteste-reteste (2x)\nconcordância com\ndetectores', 'amarelo');

d.arrow('url', 'gemini', {from: 'right', to: 'left', via: [[275, 45], [275, 170]]});
d.arrow('prompt', 'gemini', {from: 'right', to: 'left'});
d.arrow('schema', 'gemini', {from: 'right', to: 'left', via: [[275, 345], [275, 220]]});
d.arrow('gemini', 'valida', {label: 'JSON'});
d.arrow('valida', 'parquet');
d.arrow('gemini', 'retry', {from: 'bottom', to: 'top', dashed: true, both: true, cor: 'vermelho'});
d.arrow('parquet', 'conf', {from: 'bottom', to: 'top', dashed: true});

d.note('aviso', 0, 470, 1280, 70,
  'potencial_viral_0a10 é OPINIÃO do modelo, não medida. Só entra no modelo se a ablação mostrar ganho.\nNo free tier, os dados enviados podem ser usados pelo Google e lidos por revisores humanos.',
  'vermelho', {textColor: '#e03131', fontSize: 18});

export default d.elements;
