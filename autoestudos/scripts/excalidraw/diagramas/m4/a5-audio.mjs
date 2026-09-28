import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(300, -90, 'Do áudio às colunas aud_*');

d.box('mp4', 0, 100, 160, 100, 'Short\n(.mp4)', 'azul');
d.box('ffmpeg', 220, 100, 220, 100, 'ffmpeg\nWAV mono 16 kHz', 'cinza');

d.box('whisper', 510, 0, 280, 120, 'faster-whisper\nVAD + idioma +\npalavras com tempo', 'laranja', {strokeWidth: 3});
d.box('librosa', 510, 190, 280, 120, 'librosa\nRMS, onsets,\nbatida (BPM)', 'laranja', {strokeWidth: 3});

d.box('fala', 870, 0, 400, 120, 'FALA\nidioma, nº de palavras, palavras/s,\n% do vídeo com fala,\nfala nos primeiros 3 s?', 'azul');
d.box('energia', 870, 190, 400, 120, 'ENERGIA E RITMO\nRMS média e no gancho, BPM,\nonsets por segundo,\nclareza do pulso', 'azul');

d.arrow('mp4', 'ffmpeg');
d.arrow('ffmpeg', 'whisper', {from: 'right', to: 'left', via: [[475, 150], [475, 60]]});
d.arrow('ffmpeg', 'librosa', {from: 'right', to: 'left', via: [[475, 150], [475, 250]]});
d.arrow('whisper', 'fala');
d.arrow('librosa', 'energia');

d.note('combo', 510, 370, 760, 100,
  'COMBINAÇÕES\nenergia onde NÃO há fala → música ou efeitos de fundo?\ntranscrição × texto na tela (OCR, aula 4.6) → contraste texto/fala',
  'laranja', {textColor: '#e8590c', fontSize: 18});
d.note('dica', 0, 370, 440, 100,
  'librosa 1.0 não lê .mp4:\nextraia o WAV antes', 'vermelho', {textColor: '#e03131', fontSize: 18});

export default d.elements;
