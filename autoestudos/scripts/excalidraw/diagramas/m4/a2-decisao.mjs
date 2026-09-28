import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(360, -110, 'Preciso baixar o vídeo?');
d.text(250, -60, 'siga as setas e pare na primeira caixa colorida que resolver o seu caso', {size: 18, color: '#495057'});

// perguntas
d.diamond('q0', 0, 0, 290, 170, 'Precisa de algo\nalém de canal,\ntempo e texto?', 'cinza', {fontSize: 18});
d.diamond('q1', 360, 0, 290, 170, 'Basta a\nimagem de capa?', 'cinza', {fontSize: 18});
d.diamond('q2', 720, 0, 290, 170, 'Bastam atributos\nde um VLM?', 'cinza', {fontSize: 18});
d.arrow('q0', 'q1', {label: 'sim'});
d.arrow('q1', 'q2', {label: 'não'});

// respostas
d.box('r0', -5, 260, 300, 130, 'Não baixe nada:\nfeatures de canal, tempo\ne texto (módulo 3)', 'verde');
d.box('r1', 355, 260, 300, 130, 'Thumbnail pela API\n(snippet.thumbnails)\nsem cota extra', 'azul');
d.box('r2', 715, 260, 300, 130, 'Gemini lê a URL\ndo YouTube (público)\nsem baixar nada', 'laranja');
d.box('r3', 1075, 15, 250, 140, 'yt-dlp em 360p\nIP residencial,\npausas de 5–10 s,\napague depois', 'laranja', {strokeWidth: 3});
d.arrow('q0', 'r0', {from: 'bottom', to: 'top', label: 'não'});
d.arrow('q1', 'r1', {from: 'bottom', to: 'top', label: 'sim'});
d.arrow('q2', 'r2', {from: 'bottom', to: 'top', label: 'sim'});
d.arrow('q2', 'r3', {label: 'não'});

// alertas
d.note('bot', 1075, 260, 250, 130, '"Sign in to confirm\nyou\'re not a bot"?\nPare o lote, troque\nde rede, não insista.', 'vermelho', {textColor: '#e03131'});
d.arrow('r3', 'bot', {from: 'bottom', to: 'top', dashed: true, cor: 'vermelho'});
d.note('marca', -5, 430, 1330, 90, 'Na hora da PREVISÃO (Lumina A e B) o vídeo ainda não está no YouTube: a marca entrega o MP4 e você extrai tudo localmente,\ndo mesmo jeito (360p, mesmos instantes de frame) que fez com a base de treino. A URL e o yt-dlp servem para montar a BASE.', 'azul', {textColor: '#1971c2'});

export default d.elements;
