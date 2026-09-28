// Métricas usadas nas aulas, implementadas do jeito que aparecem nos trechos Python.

export function mae(y: number[], p: number[]): number {
  return y.reduce((s, yi, i) => s + Math.abs(yi - p[i]), 0) / y.length;
}

/** MAPE em %, ignorando y = 0 (que faria a métrica explodir). */
export function mape(y: number[], p: number[]): number {
  let s = 0;
  let n = 0;
  y.forEach((yi, i) => {
    if (yi !== 0) {
      s += Math.abs((yi - p[i]) / yi);
      n++;
    }
  });
  return n ? (100 * s) / n : NaN;
}

/** Ranks médios (empates recebem a média das posições). */
export function ranks(xs: number[]): number[] {
  const idx = xs.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0]);
  const r = new Array<number>(xs.length);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) r[idx[k][1]] = avg;
    i = j + 1;
  }
  return r;
}

export function pearson(a: number[], b: number[]): number {
  const n = a.length;
  const ma = a.reduce((s, x) => s + x, 0) / n;
  const mb = b.reduce((s, x) => s + x, 0) / n;
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  return da && db ? num / Math.sqrt(da * db) : 0;
}

export function spearman(y: number[], p: number[]): number {
  return pearson(ranks(y), ranks(p));
}

/** Fração dos pares (i, j) com y_i ≠ y_j em que o modelo acerta quem é maior. */
export function pairwiseAccuracy(y: number[], p: number[]): number {
  let ok = 0;
  let total = 0;
  for (let i = 0; i < y.length; i++) {
    for (let j = i + 1; j < y.length; j++) {
      if (y[i] === y[j]) continue;
      total++;
      if (p[i] === p[j]) ok += 0.5;
      else if (y[i] > y[j] === p[i] > p[j]) ok++;
    }
  }
  return total ? ok / total : NaN;
}

/** Spearman calculado dentro de cada grupo (canal) e ponderado pelo tamanho do grupo. */
export function spearmanPorGrupo(y: number[], p: number[], grupos: string[]): number {
  const por = new Map<string, number[]>();
  grupos.forEach((g, i) => por.set(g, [...(por.get(g) ?? []), i]));
  let soma = 0;
  let peso = 0;
  por.forEach((ids) => {
    if (ids.length < 3) return;
    const rho = spearman(
      ids.map((i) => y[i]),
      ids.map((i) => p[i]),
    );
    soma += rho * ids.length;
    peso += ids.length;
  });
  return peso ? soma / peso : NaN;
}
