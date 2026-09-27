import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import {VizFrame, vizStyles as s} from './lib/ui';
import {COR, RoughRect} from './lib/svg';
import {MODULOS, urlAula} from '@site/src/data/trilha';
import st from './interativos.module.css';

type NoMapa = {
  id: string;
  rotulo: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  cor: string;
  modulo: number;
  entrega: string;
};

const NOS: NoMapa[] = [
  {id: 'dados', rotulo: ['SUA BASE', 'YouTube Data API'], x: 10, y: 190, w: 150, h: 64, cor: COR.cinza, modulo: 1, entrega: 'Base documentada (data card): origem, período, volume, termos, setores e o que ela não representa.'},
  {id: 'avaliacao', rotulo: ['AVALIAÇÃO', 'baseline + splits'], x: 190, y: 190, w: 150, h: 64, cor: COR.vermelho, modulo: 2, entrega: 'Baseline declarado, validação temporal e por canal, métricas de erro e de ordenação no MLflow.'},
  {id: 'modelo', rotulo: ['MODELO GBM', 'features tabulares'], x: 370, y: 190, w: 150, h: 64, cor: COR.verde, modulo: 3, entrega: 'Modelo (Opção A: metadados + texto) que bate o baseline com validação temporal.'},
  {id: 'multimodal', rotulo: ['MULTIMODAL', 'frames, áudio, VLM'], x: 370, y: 60, w: 150, h: 64, cor: COR.laranja, modulo: 4, entrega: 'Camada multimodal leve e ablação medindo o ganho sobre a Opção A.'},
  {id: 'incerteza', rotulo: ['INTERVALO + SHAP', 'confiança e porquê'], x: 550, y: 190, w: 160, h: 64, cor: COR.amarelo, modulo: 5, entrega: 'Intervalo de predição com cobertura medida, confidence_flag e top_drivers via SHAP.'},
  {id: 'agente', rotulo: ['AGENTE + MCP', 'LangGraph, tool'], x: 550, y: 60, w: 160, h: 64, cor: COR.roxo, modulo: 6, entrega: 'Agente em funcionamento, exposto como função e servidor MCP, com demo e README.'},
];

const SETAS: [string, string][] = [
  ['dados', 'avaliacao'],
  ['avaliacao', 'modelo'],
  ['multimodal', 'modelo'],
  ['modelo', 'incerteza'],
  ['incerteza', 'agente'],
];

/** Mapa clicável do projeto: cada etapa leva às aulas do módulo e ao que precisa ser entregue. */
export default function PipelineMap(): React.ReactElement {
  const [sel, setSel] = useState<string>('dados');
  const no = NOS.find((n) => n.id === sel)!;
  const mod = MODULOS.find((m) => m.n === no.modulo)!;
  const centro = (n: NoMapa) => [n.x + n.w / 2, n.y + n.h / 2] as const;

  return (
    <VizFrame titulo="Mapa do projeto" subtitulo="Clique numa etapa para ver as aulas, a semana e o que ela precisa entregar." simulado={false}>
      <svg viewBox="0 0 720 290" className={s.chart} role="group" aria-label="Etapas do projeto">
        <defs>
          <marker id="mapaSeta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" style={{fill: COR.cinza}} />
          </marker>
        </defs>
        {SETAS.map(([a, b]) => {
          const A = NOS.find((n) => n.id === a)!;
          const B = NOS.find((n) => n.id === b)!;
          const [ax, ay] = centro(A);
          const [bx, by] = centro(B);
          const horizontal = Math.abs(ay - by) < 10;
          const x1 = horizontal ? A.x + A.w : ax;
          const y1 = horizontal ? ay : ay > by ? A.y : A.y + A.h;
          const x2 = horizontal ? B.x - 4 : bx;
          const y2 = horizontal ? by : ay > by ? B.y + B.h + 4 : B.y - 4;
          return <line key={a + b} x1={x1} y1={y1} x2={x2} y2={y2} markerEnd="url(#mapaSeta)" style={{stroke: COR.cinza, strokeWidth: 2}} />;
        })}
        {NOS.map((n, k) => {
          const ativo = n.id === sel;
          return (
            <g
              key={n.id}
              className={st.mapNode}
              role="button"
              tabIndex={0}
              aria-pressed={ativo}
              aria-label={`${n.rotulo.join(' ')}: módulo ${n.modulo}`}
              onClick={() => setSel(n.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(n.id))}
            >
              {ativo && <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={6} style={{fill: 'var(--viz-fundo)'}} />}
              <RoughRect x={n.x} y={n.y} w={n.w} h={n.h} stroke={n.cor} fill={ativo ? undefined : n.cor} strokeWidth={ativo ? 3.6 : 1.6} seed={k + 2} />
              <text x={n.x + n.w / 2} y={n.y + 26} textAnchor="middle" fontSize={14} fontWeight={700} className={s.sketchText}>
                {n.rotulo[0]}
              </text>
              <text x={n.x + n.w / 2} y={n.y + 46} textAnchor="middle" fontSize={12} className={s.sketchText}>
                {n.rotulo[1]}
              </text>
              <text x={n.x + n.w / 2} y={n.y + n.h + 15} textAnchor="middle" fontSize={11} style={{fill: 'var(--ifm-color-emphasis-700)'}}>
                módulo {n.modulo} · semana {MODULOS.find((m) => m.n === n.modulo)!.semana}
              </text>
            </g>
          );
        })}
        <text x={10} y={40} fontSize={12} className={s.sketchText} style={{fill: 'var(--ifm-color-emphasis-700)'}}>
          O número sempre sai do modelo;
        </text>
        <text x={10} y={56} fontSize={12} className={s.sketchText} style={{fill: 'var(--ifm-color-emphasis-700)'}}>
          o agente só orquestra e explica.
        </text>
      </svg>
      <div className={st.mapPanel} key={sel}>
        <h5>
          Módulo {mod.n} · {mod.titulo} <small>(semana {mod.semana})</small>
        </h5>
        <p style={{fontSize: '0.9rem', margin: '0 0 0.4rem'}}>
          <strong>Entregável:</strong> {no.entrega}
        </p>
        <ul>
          {mod.aulas.map((a) => (
            <li key={a.slug}>
              <Link to={urlAula(mod.slug, a.slug)}>{a.titulo}</Link>
            </li>
          ))}
        </ul>
      </div>
    </VizFrame>
  );
}
