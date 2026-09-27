/** PRNG determinístico (mulberry32): mesma seed → mesmos dados no SSR e no navegador. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = {
  u: () => number;
  normal: (mu?: number, sd?: number) => number;
  int: (min: number, maxInclusive: number) => number;
  pick: <T>(xs: readonly T[]) => T;
  bool: (p: number) => boolean;
};

export function makeRng(seed: number): Rng {
  const u = mulberry32(seed);
  const normal = (mu = 0, sd = 1) => {
    const u1 = Math.max(u(), 1e-12);
    const u2 = u();
    return mu + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
  return {
    u,
    normal,
    int: (min, max) => Math.floor(min + u() * (max - min + 1)),
    pick: (xs) => xs[Math.floor(u() * xs.length)],
    bool: (p) => u() < p,
  };
}
