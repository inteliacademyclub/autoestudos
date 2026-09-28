// Gera static/diagramas/<caminho>.{excalidraw,light.svg,dark.svg} a partir de
// scripts/excalidraw/diagramas/<caminho>.mjs.
//
//   cd autoestudos/scripts/excalidraw && npm install && node build.mjs [filtro]
//
// Usa o Google Chrome instalado (playwright-core, channel "chrome").
import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, 'diagramas');
const OUT = path.resolve(HERE, '../../static/diagramas');
// diretório por processo: vários autores podem gerar diagramas ao mesmo tempo
const CACHE = path.join(HERE, '.cache', String(process.pid));
const PROD = path.join(HERE, 'node_modules/@excalidraw/excalidraw/dist/prod');

const filtro = process.argv[2] ?? '';

function listarDiagramas(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return listarDiagramas(p);
    return d.name.endsWith('.mjs') ? [p] : [];
  });
}

// @font-face da Excalifont com os mesmos unicode-range que o Excalidraw usa,
// para que a medição de texto no headless bata com o editor.
function fontFaceCss() {
  const chunk = fs
    .readdirSync(PROD)
    .filter((f) => f.endsWith('.js'))
    .map((f) => fs.readFileSync(path.join(PROD, f), 'utf8'))
    .find((s) => s.includes('./fonts/Excalifont/'));
  const vars = {};
  for (const m of chunk.matchAll(/var (\w+)="(\.\/fonts\/Excalifont\/[^"]+)"/g)) vars[m[1]] = m[2];
  const faces = [];
  for (const m of chunk.matchAll(/\{uri:(\w+),descriptors:\{unicodeRange:"([^"]+)"\}\}/g)) {
    if (vars[m[1]]) {
      faces.push(
        `@font-face{font-family:"Excalifont";src:url("/prod/${vars[m[1]].slice(2)}") format("woff2");unicode-range:${m[2]};}`,
      );
    }
  }
  if (!faces.length) throw new Error('Não encontrei as fontes Excalifont no bundle do Excalidraw');
  return faces.join('\n');
}

async function main() {
  fs.mkdirSync(CACHE, {recursive: true});
  await build({
    entryPoints: [path.join(HERE, 'entry.mjs')],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    outfile: path.join(CACHE, 'bundle.js'),
    define: {'process.env.NODE_ENV': '"production"', 'import.meta.env': '{}'},
    loader: {'.woff2': 'empty', '.css': 'empty'},
    logLevel: 'error',
  });
  fs.writeFileSync(
    path.join(CACHE, 'index.html'),
    `<!doctype html><html><head><meta charset="utf-8"><style>${fontFaceCss()}</style>
<script>window.EXCALIDRAW_ASSET_PATH = "/prod/";</script></head>
<body><span style="font-family:Excalifont">aáçãõ</span><script src="/bundle.js"></script></body></html>`,
  );

  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = url.startsWith('/prod/')
      ? path.join(PROD, url.slice('/prod/'.length))
      : path.join(CACHE, url === '/' ? 'index.html' : url);
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end();
      }
      const types = {'.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2'};
      res.writeHead(200, {'content-type': types[path.extname(file)] ?? 'application/octet-stream'});
      res.end(data);
    });
  });
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;

  const browser = await chromium.launch({channel: 'chrome'});
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('pageerror:', e.message));
  await page.goto(`http://localhost:${port}/`);
  await page.waitForFunction(() => window.__ready === true);

  const arquivos = listarDiagramas(SRC).filter((f) => path.relative(SRC, f).includes(filtro));
  for (const arquivo of arquivos) {
    const rel = path.relative(SRC, arquivo).replace(/\.mjs$/, '');
    const mod = await import(pathToFileURL(arquivo).href + `?t=${Date.now()}`);
    const skeleton = typeof mod.default === 'function' ? mod.default() : mod.default;
    const {elements, light, dark} = await page.evaluate((s) => window.renderDiagram(s), skeleton);
    const destino = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(destino), {recursive: true});
    const cena = {
      type: 'excalidraw',
      version: 2,
      source: 'https://github.com/inteliacademyclub/autoestudos',
      elements,
      appState: {viewBackgroundColor: '#ffffff', gridSize: 20},
      files: {},
    };
    fs.writeFileSync(`${destino}.excalidraw`, JSON.stringify(cena, null, 1));
    fs.writeFileSync(`${destino}.light.svg`, light);
    fs.writeFileSync(`${destino}.dark.svg`, dark);
    console.log(`✓ ${rel}`);
  }

  await browser.close();
  server.close();
  fs.rmSync(CACHE, {recursive: true, force: true});
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
