import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(300, -90, 'O que cada tipo de dado pede de você');

const col = (x, id, titulo, cor) => d.box(id, x, 0, 400, 56, titulo, cor, {fill: 'solid', fontSize: 20});
col(0, 'c1', 'FAÇA (com registro)', 'verde');
col(440, 'c2', 'COM RESSALVAS', 'amarelo');
col(880, 'c3', 'NÃO FAÇA', 'vermelho');

const item = (x, y, id, txt, cor, h = 110) => d.box(id, x, y, 400, h, txt, cor, {fontSize: 16});

// coluna 1
item(0, 80, 'a1', 'Metadados e estatísticas via\nYouTube Data API, com data de coleta\n(collected_at) em cada linha', 'verde');
item(0, 210, 'a2', 'Refresh ou exclusão em até 30 dias\n(Developer Policies III.E.4.d);\nrotina de auditoria semanal', 'verde');
item(0, 340, 'a3', 'Data card: origem, período, volume,\ntermos, vieses e o que a base\nNÃO representa', 'verde');

// coluna 2
item(440, 80, 'b1', 'Alvo relativo, faixas e outras métricas\nderivadas: tensão com III.E.4.h.\nUso interno e educacional, sem exibir\ncomo "métrica do YouTube"', 'amarelo', 110);
item(440, 210, 'b2', 'Gemini no free tier: o Google pode usar\no que você envia e revisores humanos\npodem ler. Nada sensível ou pessoal', 'amarelo');
item(440, 340, 'b3', 'Comentários, rostos e vozes são dados\npessoais (LGPD): colete só se precisar,\nminimize e não publique', 'amarelo');

// coluna 3
item(880, 80, 'c1b', 'Baixar e guardar cópias dos vídeos\n(III.E.1) ou raspar páginas do\nYouTube (III.E.6), ex.: com yt-dlp', 'vermelho');
item(880, 210, 'c2b', 'Redistribuir a base, os vídeos\nou as mídias derivadas\n(repositório público, Drive aberto)', 'vermelho');
item(880, 340, 'c3b', 'Tratar esta aula como\naconselhamento jurídico:\nna dúvida, consulte quem é da área', 'vermelho');

d.note(
  'rodape',
  140,
  480,
  1000,
  60,
  'As políticas mudam (a última revisão das Developer Policies é de 14/09/2026). Releia antes de cada coleta grande.',
  'cinza',
  {fontSize: 16},
);

export default d.elements;
