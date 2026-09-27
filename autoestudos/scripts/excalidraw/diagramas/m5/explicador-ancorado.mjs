import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(300, -90, 'Explicador ancorado: o LLM só narra o que o JSON diz');

d.box('payload', 0, 0, 290, 190,
  'PAYLOAD (JSON)\nprevisão + intervalo\nrelative_to_channel\ntop_drivers (SHAP)\ncomparáveis\nconfidence_flag', 'amarelo', {fontSize: 18, strokeWidth: 3});
d.box('llm', 360, 20, 280, 150,
  'SUBAGENTE EXPLICADOR\nLLM, temperatura 0\nregras + schema\nPydantic', 'roxo', {fontSize: 18, strokeWidth: 3});
d.box('valid', 780, 20, 240, 150,
  'VALIDADOR\nDETERMINÍSTICO\nnúmeros ∈ JSON?\nfatores ∈ top_drivers?', 'cinza', {fontSize: 18});
d.box('saida', 1100, 20, 180, 150, 'explanation\nno contrato\nda tool', 'verde', {fontSize: 18, strokeWidth: 3});

d.arrow('payload', 'llm');
d.arrow('llm', 'valid', {label: 'Explicacao'});
d.arrow('valid', 'saida', {label: 'passou'});
d.arrow('valid', 'llm', {from: 'bottom', to: 'bottom', via: [[900, 240], [500, 240]], label: 'falhou: devolve os problemas', dashed: true, cor: 'vermelho'});

d.box('juiz', 820, 310, 460, 110,
  'LLM-AS-A-JUDGE (offline)\nfaithfulness num golden set:\ncada frase é sustentada pelo JSON?', 'roxo', {fontSize: 18});
d.arrow('saida', 'juiz', {from: 'bottom', to: 'top', via: [[1190, 270], [1190, 290]], dashed: true, cor: 'roxo'});

d.box('persona', 360, 310, 400, 110,
  'PERSONA DA GALAXIES\nleitura pela ótica do público\n("o gancho me prendeu")', 'roxo', {fontSize: 18});
d.note('n1', 0, 310, 300, 110, 'Separação de papéis:\nexplicador = evidência do modelo;\npersona = opinião do público.', 'roxo', {textColor: '#6741d9', fontSize: 18});

export default d.elements;
