// Simulador de canais e Shorts usado pelos componentes interativos da trilha.
//
// Tudo é sintético, com efeitos CONHECIDOS: isso permite mostrar, por exemplo,
// se um método de validação é honesto ou se o SHAP recupera o efeito real.
// Os números foram calibrados para lembrar dados reais de Shorts (cauda longa,
// canal dominando o nível, conteúdo mexendo ±50%), mas não são dados reais.

import {makeRng} from './rng';

export type Setor = 'moda' | 'beleza' | 'automotivo';

export type Canal = {
  id: string;
  nome: string;
  setor: Setor;
  inscritos: number;
  /** Nível base (log de curtidas) do canal no início do período. */
  nivel: number;
};

export type Post = {
  id: string;
  canal: string;
  setor: Setor;
  /** Dias desde 01/01/2024. */
  dia: number;
  hora: number;
  duracao: number;
  gancho: number; // 0–10
  rosto: boolean;
  textoTela: boolean;
  energia: number; // 0–10
  legenda: number; // caracteres
  /** log(1 + curtidas) sem ruído (o "sinal" verdadeiro). */
  sinal: number;
  curtidas: number;
  views: number;
};

export const INICIO = new Date(Date.UTC(2024, 0, 1));
export const DIAS_TOTAL = 900; // ~jan/2024 a jun/2026
/** Mudança na contagem de views de Shorts (31/03/2025). */
export const DIA_REGIME_VIEWS = 455;

export function diaParaData(dia: number): Date {
  return new Date(INICIO.getTime() + dia * 86_400_000);
}

export function formatarData(dia: number): string {
  return diaParaData(dia).toLocaleDateString('pt-BR', {month: 'short', year: '2-digit', timeZone: 'UTC'});
}

/** Efeitos verdadeiros do conteúdo, em escala log (somam no log de curtidas). */
export const EFEITOS = {
  gancho: 0.09, // por ponto acima de 5
  rosto: {moda: 0.15, beleza: 0.35, automotivo: 0.05},
  textoTela: 0.15,
  energia: 0.05, // por ponto acima de 5
  duracaoPor10s: -0.05, // por 10 s acima de 30 s
  horarioNobre: 0.12, // 18h–22h
};

const NOMES: Record<Setor, string[]> = {
  moda: ['Ateliê Norte', 'Vitrine 55', 'Look do Dia BR', 'Brechó Sol', 'Moda Rua', 'Closet Leve', 'Alfaiataria J', 'Street SP'],
  beleza: ['Lumina Beauty', 'Pele de Vidro', 'Make em 1min', 'Salão Ana', 'Glow Lab', 'Cachos & Co', 'Derma Fácil', 'Batom Vermelho'],
  automotivo: ['Garagem 22', 'Motor & Pista', 'Auto Review BR', 'Oficina do Zé', 'EV Brasil', 'Clássicos 70', 'Pick-up Pro', 'Rota 116'],
};

/** Componente determinístico (sem ruído) do log de curtidas. */
export function sinalConteudo(p: Pick<Post, 'setor' | 'gancho' | 'rosto' | 'textoTela' | 'energia' | 'duracao' | 'hora'>): number {
  return (
    EFEITOS.gancho * (p.gancho - 5) +
    (p.rosto ? EFEITOS.rosto[p.setor] : 0) +
    (p.textoTela ? EFEITOS.textoTela : 0) +
    EFEITOS.energia * (p.energia - 5) +
    EFEITOS.duracaoPor10s * ((p.duracao - 30) / 10) +
    (p.hora >= 18 && p.hora <= 22 ? EFEITOS.horarioNobre : 0)
  );
}

export type Base = {canais: Canal[]; posts: Post[]};

const cache = new Map<string, Base>();

/**
 * Gera canais e posts. Cada canal tem uma tendência própria que muda devagar
 * (random walk mensal): é isso que faz o split aleatório "trapacear".
 */
export function gerarBase({seed = 7, porSetor = 8, postsPorCanal = 45} = {}): Base {
  const key = `${seed}-${porSetor}-${postsPorCanal}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const r = makeRng(seed);
  const canais: Canal[] = [];
  const posts: Post[] = [];
  const setores: Setor[] = ['moda', 'beleza', 'automotivo'];
  for (const setor of setores) {
    for (let i = 0; i < porSetor; i++) {
      const logInscritos = r.normal(11.3, 1.5);
      const inscritos = Math.round(Math.exp(Math.min(Math.max(logInscritos, 7.5), 16)));
      const nivel = 0.85 * Math.log(inscritos) - 4.2 + r.normal(0, 0.55);
      const canal: Canal = {id: `c${canais.length + 1}`, nome: NOMES[setor][i % NOMES[setor].length], setor, inscritos, nivel};
      canais.push(canal);

      // tendência do canal: passeio aleatório por mês
      const meses = Math.ceil(DIAS_TOTAL / 30) + 1;
      const tendencia: number[] = [0];
      const deriva = r.normal(0, 0.04);
      for (let m = 1; m < meses; m++) tendencia.push(tendencia[m - 1] + deriva + r.normal(0, 0.16));

      const n = Math.max(12, Math.round(postsPorCanal * (0.6 + r.u() * 0.8)));
      const inicio = r.int(0, 200);
      for (let k = 0; k < n; k++) {
        const dia = Math.min(DIAS_TOTAL - 1, Math.round(inicio + ((DIAS_TOTAL - inicio) * (k + r.u() * 0.9)) / n));
        const hora = r.bool(0.4) ? r.int(18, 22) : r.int(7, 23);
        const duracao = Math.round(Math.min(90, Math.max(8, r.normal(setor === 'automotivo' ? 38 : 28, 12))));
        const conteudo = {
          setor,
          hora,
          duracao,
          gancho: Math.round(Math.min(10, Math.max(0, r.normal(5, 2)))),
          rosto: r.bool(setor === 'automotivo' ? 0.35 : 0.7),
          textoTela: r.bool(0.5),
          energia: Math.round(Math.min(10, Math.max(0, r.normal(5, 2.2)))),
        };
        const sinal = canal.nivel + tendencia[Math.floor(dia / 30)] + sinalConteudo(conteudo);
        const logCurtidas = sinal + r.normal(0, 0.5);
        const curtidas = Math.max(0, Math.round(Math.exp(logCurtidas) - 1));
        const taxa = Math.exp(r.normal(Math.log(35), 0.35)); // views por curtida
        const regime = dia >= DIA_REGIME_VIEWS ? 1.7 : 1; // replays passaram a contar
        posts.push({
          id: `${canal.id}-p${k + 1}`,
          canal: canal.id,
          dia,
          ...conteudo,
          legenda: Math.round(Math.max(0, r.normal(90, 45))),
          sinal,
          curtidas,
          views: Math.round((curtidas + 1) * taxa * regime),
        });
      }
    }
  }
  posts.sort((a, b) => a.dia - b.dia);
  const base = {canais, posts};
  cache.set(key, base);
  return base;
}

/** Os dois Shorts do fio condutor das aulas (canal Lumina Beauty). */
export const LUMINA = {
  A: {
    nome: 'A · Tutorial calmo com voiceover',
    setor: 'beleza' as Setor,
    gancho: 3,
    rosto: true,
    textoTela: false,
    energia: 3,
    duracao: 55,
    hora: 14,
  },
  B: {
    nome: 'B · Antes/depois com gancho forte',
    setor: 'beleza' as Setor,
    gancho: 8,
    rosto: true,
    textoTela: true,
    energia: 7,
    duracao: 22,
    hora: 19,
  },
};

export function mediana(xs: number[]): number {
  if (xs.length === 0) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function media(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}
