import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(290, -80, 'Uma fonte principal, três de apoio');

// fonte principal
d.box(
  'api',
  320,
  0,
  640,
  130,
  'YouTube Data API v3  (a SUA base)\nShorts de moda, beleza e automotivo dos seus canais,\ncom data de coleta. Treino e teste saem daqui.',
  'azul',
  {strokeWidth: 3},
);

d.box('treino', 330, 200, 620, 80, 'modelo final: treino, validação temporal e teste', 'verde', {fill: 'solid', bg: '#ebfbee'});
d.arrow('api', 'treino', {label: 'obrigatório'});

// fontes auxiliares
const y = 380;
d.box('smtpd', 0, y, 400, 150, 'SMTPD (CVPR 2025)\n282 mil vídeos do YouTube, 30 dias\nde popularidade diária; duração média\nde ~30 min: majoritariamente long-form', 'cinza');
d.box('smp', 440, y, 400, 150, 'SMP-Video (SMP Challenge)\n~6 mil vídeos curtos anonimizados,\n~4,5 mil usuários; acesso gated\n(licença comunitária do SMP)', 'cinza');
d.box('ml', 880, y, 400, 150, 'MicroLens-100K\n19.738 microvídeos com mídia bruta\n(vídeo, áudio, capa, texto);\nfeito para recomendação', 'cinza');

d.note('u1', 0, y + 170, 400, 70, 'aquecimento: testar alvo em log,\nfeatures de canal e de texto', 'cinza', {fontSize: 16});
d.note('u2', 440, y + 170, 400, 70, 'comparar com a literatura:\nmétricas e soluções vencedoras', 'cinza', {fontSize: 16});
d.note('u3', 880, y + 170, 400, 70, 'ensaiar o pipeline multimodal\nantes de ter os seus vídeos', 'cinza', {fontSize: 16});
d.arrow('smtpd', 'u1');
d.arrow('smp', 'u2');
d.arrow('ml', 'u3');

d.arrow('smtpd', 'treino', {from: 'top', to: 'left', via: [[200, 240]], dashed: true, cor: 'vermelho', label: 'não substitui'});
d.arrow('ml', 'treino', {from: 'top', to: 'right', via: [[1080, 240]], dashed: true, cor: 'vermelho', label: 'não substitui'});

d.note(
  'regra',
  250,
  y + 270,
  780,
  60,
  'Nenhuma fonte de apoio tem Shorts de marcas no seu recorte. Elas ajudam a pensar,\nmas o número que você apresenta vem da SUA base.',
  'vermelho',
  {textColor: '#e03131'},
);

export default d.elements;
