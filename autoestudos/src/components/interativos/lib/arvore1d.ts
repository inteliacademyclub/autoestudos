// Árvore de regressão em 1 dimensão (para os componentes didáticos de árvores e boosting).

export type No = {v: number} | {thr: number; esq: No; dir: No};

export function melhorSplit(xs: number[], ys: number[], minFolha = 3): {thr: number; sse: number} | null {
  const idx = xs.map((_, i) => i).sort((a, b) => xs[a] - xs[b]);
  const n = idx.length;
  if (n < 2 * minFolha) return null;
  let somaE = 0;
  let somaQE = 0;
  const total = ys.reduce((a, b) => a + b, 0);
  const totalQ = ys.reduce((a, b) => a + b * b, 0);
  let melhor: {thr: number; sse: number} | null = null;
  for (let k = 0; k < n - 1; k++) {
    const y = ys[idx[k]];
    somaE += y;
    somaQE += y * y;
    const nE = k + 1;
    const nD = n - nE;
    if (nE < minFolha || nD < minFolha) continue;
    if (xs[idx[k]] === xs[idx[k + 1]]) continue;
    const sseE = somaQE - (somaE * somaE) / nE;
    const somaD = total - somaE;
    const sseD = totalQ - somaQE - (somaD * somaD) / nD;
    const sse = sseE + sseD;
    if (!melhor || sse < melhor.sse) melhor = {thr: (xs[idx[k]] + xs[idx[k + 1]]) / 2, sse};
  }
  return melhor;
}

export function ajustar(xs: number[], ys: number[], prof: number, minFolha = 3): No {
  const media = ys.reduce((a, b) => a + b, 0) / Math.max(ys.length, 1);
  if (prof === 0) return {v: media};
  const s = melhorSplit(xs, ys, minFolha);
  if (!s) return {v: media};
  const e = xs.map((x, i) => i).filter((i) => xs[i] <= s.thr);
  const d = xs.map((x, i) => i).filter((i) => xs[i] > s.thr);
  return {
    thr: s.thr,
    esq: ajustar(
      e.map((i) => xs[i]),
      e.map((i) => ys[i]),
      prof - 1,
      minFolha,
    ),
    dir: ajustar(
      d.map((i) => xs[i]),
      d.map((i) => ys[i]),
      prof - 1,
      minFolha,
    ),
  };
}

export function prever(no: No, x: number): number {
  let n = no;
  while ('thr' in n) n = x <= n.thr ? n.esq : n.dir;
  return n.v;
}

export function sseDe(ys: number[]): number {
  if (!ys.length) return 0;
  const m = ys.reduce((a, b) => a + b, 0) / ys.length;
  return ys.reduce((a, y) => a + (y - m) ** 2, 0);
}
