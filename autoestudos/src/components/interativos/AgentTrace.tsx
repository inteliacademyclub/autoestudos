import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {VizFrame, Nota, vizStyles as s} from './lib/ui';
import {COR, RoughRect, usePrefersReducedMotion} from './lib/svg';
import st from './interativos.module.css';
import Icon from '../aula/Icon';

type Tipo = 'entrada' | 'no' | 'tool' | 'llm' | 'saida';
type Passo = {tipo: Tipo; no: string; titulo: string; detalhe: string; json: unknown};

const COR_TIPO: Record<Tipo, string> = {entrada: COR.azul, no: COR.roxo, tool: COR.verde, llm: COR.laranja, saida: COR.roxo};
const ROTULO_TIPO: Record<Tipo, string> = {entrada: 'entrada', no: 'nó', tool: 'tool', llm: 'LLM', saida: 'saída'};

// Execução real do grafo da aula 6.2 (modelo treinado em dados sintéticos),
// com o Short B da Lumina. JSON resumido para caber na tela.
const PASSOS: Passo[] = [
  {
    tipo: 'entrada',
    no: 'START',
    titulo: 'Pedido chega (via função ou MCP)',
    detalhe: 'A persona da Galaxies chama a tool com o criativo e o contexto. O Pydantic valida antes de qualquer coisa (inclusive o fuso horário da data).',
    json: {
      creative: 'lumina_b.mp4',
      caption: '1 produto, 20 segundos #antesedepois #maquiagem',
      planned_datetime: '2026-10-01T19:00:00-03:00',
      channel_id: 'UC_lumina_beauty',
      sector: 'beleza',
    },
  },
  {
    tipo: 'tool',
    no: 'extrair',
    titulo: 'extrair: atributos do vídeo',
    detalhe: 'Pipeline multimodal com cache por video_id: frames, embeddings, áudio, detectores e a rubrica do VLM viram colunas.',
    json: {
      atributos: {tipo: 'video', duracao_s: 22, gancho: 8, rosto: true, texto_na_tela: true, energia_musica: 7, embedding: '<32 floats>'},
    },
  },
  {
    tipo: 'tool',
    no: 'contexto',
    titulo: 'contexto: histórico do canal + comparáveis',
    detalhe: 'Só entram posts publicados ANTES da data planejada: mediana recente do canal e os criativos mais parecidos.',
    json: {
      contexto: {
        subscribers: 180000,
        mediana_curtidas: 2305,
        posts_anteriores: 47,
        comparables: [
          {post_id: 'UC_beleza_07_011', relativo_canal: 1.96, similaridade: 0.982},
          {post_id: 'UC_beleza_04_048', relativo_canal: 0.96, similaridade: 0.981},
        ],
        rel_vizinhos: 0.506,
      },
    },
  },
  {
    tipo: 'tool',
    no: 'prever',
    titulo: 'prever  ← o número nasce aqui',
    detalhe: 'Os modelos quantílicos (10%, 50%, 90%) do GBM produzem previsão e intervalo. Nenhum LLM participa.',
    json: {
      previsao: {q10: 1655, q50: 4237, q90: 9180, confidence_flag: {baixa_confianca: false, motivos: []}, model_version: 'gbm-quantil-20260927-f9e6dda'},
    },
  },
  {
    tipo: 'tool',
    no: 'explicar',
    titulo: 'explicar: SHAP → top_drivers',
    detalhe: 'O TreeExplainer calcula as contribuições e a função top_drivers (aula 5.6) devolve o top 5 em JSON estruturado.',
    json: {
      top_drivers: [
        {feature: 'gancho', valor: 8, contribuicao_log: 0.156, multiplicador: 1.17, direcao: 'aumenta'},
        {feature: 'energia_musica', valor: 7, contribuicao_log: 0.102, multiplicador: 1.11, direcao: 'aumenta'},
        {feature: 'duracao_s', valor: 22, contribuicao_log: 0.05, multiplicador: 1.05, direcao: 'aumenta'},
      ],
    },
  },
  {
    tipo: 'llm',
    no: 'explicar',
    titulo: 'subagente explicador + validador',
    detalhe:
      'Com chave de API, um LLM escreve a explicação usando SÓ o JSON acima, e um validador determinístico confere números e fatores. Sem chave (como nesta execução), cai num template: falha fechada, nunca inventa.',
    json: {
      explanation: {
        resumo: 'Previsão de 4.237 curtidas, 1,84 vez a mediana recente do canal (2.305). Em 80% dos cenários, fica entre 1.655 e 9.180 curtidas.',
        fatores: [
          {fator: 'gancho', efeito: 'cerca de 17% a mais (x1,17)', evidencia: 'gancho com nota 8'},
          {fator: 'energia_musica', efeito: 'cerca de 11% a mais (x1,11)', evidencia: 'música com energia 7'},
        ],
        ressalvas: ['Os fatores são associações aprendidas pelo modelo, não causas comprovadas.'],
      },
    },
  },
  {
    tipo: 'saida',
    no: 'responder',
    titulo: 'responder: PredictionResponse',
    detalhe: 'A resposta completa volta para quem chamou, com evidências inspecionáveis e a versão do modelo.',
    json: {
      metric: 'likes',
      predicted_metric: 4237,
      interval_low: 1655,
      interval_high: 9180,
      interval_level: 0.8,
      confidence_flag: {baixa_confianca: false, motivos: []},
      relative_to_channel: 1.84,
      top_drivers: '[5 itens]',
      explanation: '{resumo, fatores, ressalvas}',
      comparables: '[5 itens]',
      model_version: 'gbm-quantil-20260927-f9e6dda',
    },
  },
];

const NOS = [
  {id: 'START', x: 10, rot: 'START'},
  {id: 'extrair', x: 92, rot: 'extrair'},
  {id: 'contexto', x: 184, rot: 'contexto'},
  {id: 'prever', x: 276, rot: 'prever'},
  {id: 'explicar', x: 368, rot: 'explicar'},
  {id: 'responder', x: 460, rot: 'responder'},
  {id: 'END', x: 552, rot: 'END'},
];

/** Replay passo a passo de uma execução do grafo do agente (LangGraph). */
export default function AgentTrace(): React.ReactElement {
  const [i, setI] = useState(0);
  const [tocando, setTocando] = useState(false);
  const reduzido = usePrefersReducedMotion();
  const p = PASSOS[i];

  useEffect(() => {
    if (!tocando) return;
    const id = window.setInterval(
      () =>
        setI((v) => {
          if (v >= PASSOS.length - 1) {
            setTocando(false);
            return v;
          }
          return v + 1;
        }),
      reduzido ? 3000 : 2200,
    );
    return () => window.clearInterval(id);
  }, [tocando, reduzido]);

  return (
    <VizFrame
      titulo="Replay do agente: Lumina B, do pedido à resposta"
      subtitulo="Execução real do grafo da aula 6.2 (modelo treinado em dados sintéticos). Observe de onde vem o número e onde o LLM entra."
      simulado
    >
      <svg viewBox="0 -16 640 86" className={s.chart} role="img" aria-label={`Grafo do agente, nó atual: ${p.no}`}>
        {NOS.slice(0, -1).map((n, k) => (
          <line key={n.id} x1={n.x + 76} x2={NOS[k + 1].x} y1={32} y2={32} style={{stroke: COR.cinza, strokeWidth: 1.6}} markerEnd="url(#seta)" />
        ))}
        <defs>
          <marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" style={{fill: COR.cinza}} />
          </marker>
        </defs>
        <path d="M86,20 C120,-10 170,-10 184,20" style={{fill: 'none', stroke: COR.cinza, strokeDasharray: '4 4'}} />
        <text x={135} y={-6} fontSize={9} textAnchor="middle" style={{fill: 'var(--ifm-color-emphasis-700)'}}>
          se o criativo for só texto
        </text>
        {NOS.map((n, k) => {
          const ativo = n.id === p.no;
          const cor = n.id === 'prever' ? COR.verde : n.id === 'START' || n.id === 'END' ? COR.cinza : COR.roxo;
          return (
            <g key={n.id}>
              {ativo && <rect x={n.x} y={18} width={76} height={28} rx={4} style={{fill: n.id === 'prever' ? 'var(--viz-verde-bg)' : 'var(--viz-roxo-bg)'}} />}
              <RoughRect x={n.x} y={18} w={76} h={28} stroke={cor} strokeWidth={ativo ? 3 : 1.4} seed={k + 3} />
              <text x={n.x + 38} y={36} fontSize={12} textAnchor="middle" fontWeight={ativo ? 700 : 400} className={s.sketchText}>
                {n.rot}
              </text>
            </g>
          );
        })}
      </svg>

      <div className={st.steps}>
        <ol className={st.stepList}>
          {PASSOS.map((q, k) => (
            <li
              key={k}
              className={st.stepItem}
              role="button"
              aria-current={k === i ? 'step' : undefined}
              data-done={k < i}
              onClick={() => setI(k)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setI(k)}
              tabIndex={0}
            >
              <span className={st.stepDot} style={{background: COR_TIPO[q.tipo]}}>
                {k + 1}
              </span>
              <span>
                <span className={st.kind} style={{color: COR_TIPO[q.tipo]}}>
                  {ROTULO_TIPO[q.tipo]}
                </span>
                <br />
                {q.titulo}
              </span>
            </li>
          ))}
        </ol>
        <div key={i} className={s.fadeIn}>
          <p style={{fontSize: '0.9rem', marginTop: 0}}>{p.detalhe}</p>
          <pre className={s.code}>{JSON.stringify(p.json, null, 2)}</pre>
        </div>
      </div>

      <div className={s.controls} style={{marginTop: '0.8rem'}}>
        <button type="button" className={s.btn} disabled={i === 0} onClick={() => setI(i - 1)}>
          <Icon nome="esquerda" /> anterior
        </button>
        <button type="button" className={clsx(s.btn, s.btnPrimary)} onClick={() => (i >= PASSOS.length - 1 ? (setI(0), setTocando(true)) : setTocando(!tocando))}>
          <Icon nome={tocando ? 'pause' : i >= PASSOS.length - 1 ? 'repetir' : 'play'} peso={2} />
          {tocando ? 'pausar' : i >= PASSOS.length - 1 ? 'de novo' : 'reproduzir'}
        </button>
        <button type="button" className={s.btn} disabled={i === PASSOS.length - 1} onClick={() => setI(i + 1)}>
          próximo <Icon nome="direita" />
        </button>
      </div>
      <Nota tom={p.no === 'prever' ? 'good' : undefined}>
        {p.no === 'prever' ? (
          <>
            <strong>É aqui, e só aqui, que o número nasce.</strong> Se alguém perguntar "de onde veio 4.237?", a resposta é: do modelo{' '}
            <code>gbm-quantil-20260927-f9e6dda</code>, com estas features. O LLM nunca produz esse valor.
          </>
        ) : (
          <>
            O LLM aparece em dois lugares: <strong>dentro</strong> da extração (o VLM respondendo a rubrica) e no <strong>subagente explicador</strong>,
            que só pode usar o JSON que recebeu. O resto é código determinístico e testável.
          </>
        )}
      </Nota>
    </VizFrame>
  );
}
