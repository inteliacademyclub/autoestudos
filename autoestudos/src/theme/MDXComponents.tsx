// Componentes pedagógicos disponíveis em qualquer .md/.mdx sem import.
// Os componentes interativos (gráficos, simuladores) NÃO entram aqui: são
// importados só nas aulas que os usam, para não pesar todas as páginas.
import MDXComponents from '@theme-original/MDXComponents';
import Sketch from '@site/src/components/aula/Sketch';
import LessonMeta from '@site/src/components/aula/LessonMeta';
import Quiz from '@site/src/components/aula/Quiz';
import Checklist from '@site/src/components/aula/Checklist';
import Termo from '@site/src/components/aula/Termo';
import {PaperCard, ToolCard, CardGrid, NoProjeto} from '@site/src/components/aula/Cards';

export default {
  ...MDXComponents,
  Sketch,
  LessonMeta,
  Quiz,
  Checklist,
  Termo,
  PaperCard,
  ToolCard,
  CardGrid,
  NoProjeto,
};
