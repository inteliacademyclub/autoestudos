// Renderiza SVGs gerados em PNG para revisão visual.
//   node preview.mjs <saida-dir> <arquivo.svg>...
import {chromium} from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [outDir, ...files] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const browser = await chromium.launch({channel: 'chrome'});
const page = await browser.newPage({deviceScaleFactor: 1});
for (const f of files) {
  const dark = f.includes('.dark.');
  const svg = fs.readFileSync(f, 'utf8');
  await page.setContent(
    `<html><body style="margin:0;padding:16px;background:${dark ? '#111116' : '#ffffff'};display:inline-block">${svg}</body></html>`,
  );
  const el = await page.$('svg');
  const out = path.join(outDir, path.basename(f).replace(/\.svg$/, '.png'));
  await el.screenshot({path: out});
  console.log(out);
}
await browser.close();
