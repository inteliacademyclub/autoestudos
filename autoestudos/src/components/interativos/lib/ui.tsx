import React from 'react';
import clsx from 'clsx';
import s from './viz.module.css';

export {s as vizStyles};

/** Moldura padrão dos componentes interativos. */
export function VizFrame({
  titulo,
  subtitulo,
  simulado = true,
  children,
}: {
  titulo: string;
  subtitulo?: React.ReactNode;
  simulado?: boolean;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <section className={s.viz} aria-label={titulo}>
      <header className={s.header}>
        <div>
          <h4 className={s.title}>{titulo}</h4>
          {subtitulo && <p className={s.subtitle}>{subtitulo}</p>}
        </div>
        <div className={s.badges}>
          <span className={s.badge}>interativo</span>
          {simulado && (
            <span className={clsx(s.badge, s.badgeSim)} title="Os dados deste componente são gerados por um simulador com efeitos conhecidos.">
              dados simulados
            </span>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}

export function Segmented<T extends string>({
  valor,
  opcoes,
  onChange,
  rotulo,
}: {
  valor: T;
  opcoes: {valor: T; rotulo: string}[];
  onChange: (v: T) => void;
  rotulo: string;
}): React.ReactElement {
  return (
    <div className={s.segmented} role="group" aria-label={rotulo}>
      {opcoes.map((o) => (
        <button key={o.valor} type="button" aria-pressed={valor === o.valor} onClick={() => onChange(o.valor)}>
          {o.rotulo}
        </button>
      ))}
    </div>
  );
}

export function Slider({
  rotulo,
  valor,
  min,
  max,
  passo = 1,
  onChange,
  formato = (v: number) => String(v),
}: {
  rotulo: string;
  valor: number;
  min: number;
  max: number;
  passo?: number;
  onChange: (v: number) => void;
  formato?: (v: number) => string;
}): React.ReactElement {
  return (
    <label className={s.control}>
      <span>{rotulo}</span>
      <input type="range" min={min} max={max} step={passo} value={valor} onChange={(e) => onChange(Number(e.target.value))} />
      <span className={s.value}>{formato(valor)}</span>
    </label>
  );
}

export function Stat({
  rotulo,
  valor,
  dica,
  tom,
}: {
  rotulo: string;
  valor: React.ReactNode;
  dica?: React.ReactNode;
  tom?: 'good' | 'bad' | 'warn';
}): React.ReactElement {
  return (
    <div className={s.stat}>
      <div className={s.statLabel}>{rotulo}</div>
      <div className={clsx(s.statValue, tom && s[tom])}>{valor}</div>
      {dica && <div className={s.statHint}>{dica}</div>}
    </div>
  );
}

export function Nota({children, tom}: {children: React.ReactNode; tom?: 'bad' | 'good'}): React.ReactElement {
  return <p className={clsx(s.note, tom === 'bad' && s.noteBad, tom === 'good' && s.noteGood)}>{children}</p>;
}
