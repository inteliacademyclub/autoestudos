import React, {useMemo, useState} from 'react';
import {VizFrame, Slider, Stat, Nota, vizStyles as s} from './lib/ui';
import {COR, RoughRect, RoughLine, linear, fmt, fmtInt} from './lib/svg';
import {gerarBase, LUMINA, sinalConteudo, type Post} from './lib/simulador';
import st from './interativos.module.css';

type Criativo = {gancho: number; rosto: boolean; textoTela: boolean; energia: number; duracao: number; hora: number};
const MEIA_LARGURA = 1.2816 * 0.5; // intervalo de 80% com ruído ~0,5 em log

function fundoBeleza(): Criativo[] {
  return gerarBase()
    .posts.filter((p: Post) => p.setor === 'beleza')
    .map(({gancho, rosto, textoTela, energia, duracao, hora}) => ({gancho, rosto, textoTela, energia, duracao, hora}));
}

/** Re-pontua variações do Short A com o modelo e avisa quando a variação sai do suporte dos dados. */
export default function WhatIfSimulator(): React.ReactElement {
  const fundo = useMemo(fundoBeleza, []);
  const nivel = useMemo(() => Math.log1p(2300) - fundo.reduce((a, b) => a + sinalConteudo({...b, setor: 'beleza'}), 0) / fundo.length, [fundo]);
  const orig: Criativo = useMemo(() => {
    const {gancho, rosto, textoTela, energia, duracao, hora} = LUMINA.A;
    return {gancho, rosto, textoTela, energia, duracao, hora};
  }, []);
  const [v, setV] = useState<Criativo>(orig);

  const f = (c: Criativo) => nivel + sinalConteudo({...c, setor: 'beleza'});
  const pO = f(orig);
  const pV = f(v);

  // suporte: fração de posts do fundo com valor parecido
  const suporte = (campo: 'gancho' | 'energia' | 'duracao', val: number, tol: number) =>
    fundo.filter((b) => Math.abs(b[campo] - val) <= tol).length / fundo.length;
  const alertas: string[] = [];
  if (suporte('gancho', v.gancho, 0.5) < 0.03) alertas.push(`gancho = ${v.gancho} é raro na base (poucos exemplos para o modelo aprender)`);
  if (suporte('duracao', v.duracao, 3) < 0.03) alertas.push(`duração de ${v.duracao} s quase não aparece na base`);
  if (suporte('energia', v.energia, 0.5) < 0.03) alertas.push(`energia = ${v.energia} é rara na base`);

  // melhor mudança única
  const candidatos: {nome: string; c: Criativo}[] = [
    {nome: 'publicar às 19h', c: {...orig, hora: 19}},
    {nome: 'gancho 3 → 7', c: {...orig, gancho: 7}},
    {nome: 'cortar para 30 s', c: {...orig, duracao: 30}},
    {nome: 'adicionar texto na tela', c: {...orig, textoTela: true}},
    {nome: 'música mais animada (energia 7)', c: {...orig, energia: 7}},
  ];
  const ganhos = candidatos.map((k) => ({nome: k.nome, mult: Math.exp(f(k.c) - pO)})).sort((a, b) => b.mult - a.mult);

  const x = linear([Math.log1p(300), Math.log1p(20000)], [150, 620]);
  const barra = (p: number, yy: number, cor: string, rot: string, seed: number) => (
    <g>
      <text x={140} y={yy + 14} textAnchor="end" fontSize={12} className={s.sketchText}>
        {rot}
      </text>
      <RoughRect x={x(p - MEIA_LARGURA)} y={yy} w={x(p + MEIA_LARGURA) - x(p - MEIA_LARGURA)} h={22} fill={cor} stroke={cor} seed={seed} />
      <RoughLine x1={x(p)} x2={x(p)} y1={yy - 4} y2={yy + 26} stroke={COR.tinta} strokeWidth={2.4} seed={seed + 1} />
      <text x={x(p)} y={yy + 40} textAnchor="middle" fontSize={11}>
        {fmtInt(Math.expm1(p))}
      </text>
    </g>
  );

  return (
    <VizFrame titulo="What-if: dá para salvar o Short A?" subtitulo="Mude atributos do Short A e deixe o modelo re-pontuar. O LLM pode propor variações; quem julga é o modelo.">
      <div className={s.controls}>
        <Slider rotulo="Gancho" valor={v.gancho} min={0} max={10} onChange={(g) => setV({...v, gancho: g})} />
        <Slider rotulo="Energia" valor={v.energia} min={0} max={10} onChange={(g) => setV({...v, energia: g})} />
        <Slider rotulo="Duração" valor={v.duracao} min={8} max={90} onChange={(g) => setV({...v, duracao: g})} formato={(g) => `${g}s`} />
        <Slider rotulo="Hora" valor={v.hora} min={7} max={23} onChange={(g) => setV({...v, hora: g})} formato={(g) => `${g}h`} />
        <div className={st.toggleRow}>
          <button type="button" className={st.chip} aria-pressed={v.textoTela} onClick={() => setV({...v, textoTela: !v.textoTela})}>
            texto na tela
          </button>
          <button type="button" className={s.btn} onClick={() => setV(orig)}>
            voltar ao original
          </button>
        </div>
      </div>

      <svg viewBox="0 0 640 120" className={s.chart} role="img" aria-label={`Original ${fmtInt(Math.expm1(pO))} curtidas; variação ${fmtInt(Math.expm1(pV))}`}>
        {barra(pO, 8, COR.cinza, 'Short A original', 3)}
        {barra(pV, 64, pV >= pO ? COR.verde : COR.vermelho, 'variação', 7)}
      </svg>
      <p className={s.subtitle}>Barras: intervalo de 80%. Traço: previsão pontual. Escala log de curtidas.</p>

      <div className={s.stats}>
        <Stat rotulo="Variação vs. original" valor={`×${fmt(Math.exp(pV - pO), 2)}`} tom={pV > pO + 0.05 ? 'good' : pV < pO - 0.05 ? 'bad' : undefined} />
        <Stat rotulo="vs. Short típico do canal" valor={`×${fmt(Math.exp(pV - Math.log1p(2300)), 2)}`} />
        <Stat rotulo="Melhor mudança única" valor={ganhos[0].nome} dica={`×${fmt(ganhos[0].mult, 2)}`} />
      </div>
      {alertas.length > 0 && (
        <Nota tom="bad">
          <strong>Fora do suporte dos dados:</strong> {alertas.join('; ')}. Nessas regiões o modelo extrapola, e o número merece baixa confiança.
        </Nota>
      )}
      <Nota>
        What-if com modelo preditivo é <strong>correlacional</strong>: "vídeos com gancho forte performam melhor" não garante que <em>forçar</em> um
        gancho no seu vídeo cause o mesmo efeito. Use para priorizar hipóteses e teste as melhores de verdade (A/B), mudando uma coisa por vez e
        dentro da faixa que a base cobre.
      </Nota>
    </VizFrame>
  );
}
