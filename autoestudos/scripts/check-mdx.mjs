// Checa rapidamente se arquivos .md/.mdx compilam como MDX (sem rodar o build
// inteiro do Docusaurus). Uso: node scripts/check-mdx.mjs docs/aulas/ml-preditivo-e-agentes
import {compile} from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import fs from 'node:fs';
import path from 'node:path';

function walk(p) {
  const st = fs.statSync(p);
  if (st.isFile()) return /\.mdx?$/.test(p) ? [p] : [];
  return fs.readdirSync(p).flatMap((f) => walk(path.join(p, f)));
}

const files = process.argv.slice(2).flatMap(walk);
let erros = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
  try {
    await compile(src, {remarkPlugins: [remarkGfm, remarkDirective, [remarkMath, {singleDollarTextMath: false}]]});
  } catch (e) {
    erros++;
    console.error(`✘ ${f}\n  ${e.message}${e.line ? ` (linha ${e.line + (src === fs.readFileSync(f, 'utf8') ? 0 : 0)})` : ''}`);
  }
}
console.log(`${files.length - erros}/${files.length} arquivos OK`);
process.exit(erros ? 1 : 0);
