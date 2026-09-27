import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {VizFrame, Nota, vizStyles as s} from './lib/ui';
import {COR, RoughRect, usePrefersReducedMotion} from './lib/svg';
import Icon from '../aula/Icon';

type Msg = {de: 'cliente' | 'servidor'; tipo: 'request' | 'response' | 'notification'; metodo: string; explica: string; json: unknown};

const MSGS: Msg[] = [
  {
    de: 'cliente',
    tipo: 'request',
    metodo: 'initialize',
    explica: 'O host (o agente da persona) abre a sessão e diz qual versão do protocolo e quais capacidades ele suporta.',
    json: {jsonrpc: '2.0', id: 1, method: 'initialize', params: {protocolVersion: '2025-11-25', capabilities: {}, clientInfo: {name: 'persona-galaxies', version: '1.0'}}},
  },
  {
    de: 'servidor',
    tipo: 'response',
    metodo: 'initialize',
    explica: 'O seu servidor responde com as capacidades dele: aqui, tools e resources.',
    json: {jsonrpc: '2.0', id: 1, result: {protocolVersion: '2025-11-25', capabilities: {tools: {}, resources: {}}, serverInfo: {name: 'galaxies-preditor', version: '0.1.0'}}},
  },
  {
    de: 'cliente',
    tipo: 'notification',
    metodo: 'notifications/initialized',
    explica: 'Notificação (sem id, sem resposta): o cliente está pronto.',
    json: {jsonrpc: '2.0', method: 'notifications/initialized'},
  },
  {
    de: 'cliente',
    tipo: 'request',
    metodo: 'tools/list',
    explica: 'O cliente descobre as tools. O LLM da persona decide quando chamá-las lendo nome, descrição e schema.',
    json: {jsonrpc: '2.0', id: 2, method: 'tools/list'},
  },
  {
    de: 'servidor',
    tipo: 'response',
    metodo: 'tools/list',
    explica: 'O schema vem direto dos modelos Pydantic da sua função: é o contrato da tool.',
    json: {
      jsonrpc: '2.0',
      id: 2,
      result: {
        tools: [
          {
            name: 'prever_criativo',
            description: 'Prevê curtidas de um Short antes da publicação, com intervalo de 80%, fatores (SHAP) e comparáveis.',
            inputSchema: {type: 'object', required: ['pedido'], properties: {pedido: {$ref: '#/$defs/PredictionRequest'}}},
            outputSchema: {$ref: '#/$defs/PredictionResponse'},
          },
          {
            name: 'comparar_criativos',
            description: 'Ordena criativos do mesmo canal e estima P(A > B) a partir dos quantis.',
            inputSchema: {type: 'object', required: ['criativos'], properties: {criativos: {type: 'object'}}},
          },
        ],
      },
    },
  },
  {
    de: 'cliente',
    tipo: 'request',
    metodo: 'tools/call',
    explica: 'A persona chama a tool para o Short B da Lumina.',
    json: {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'prever_criativo',
        arguments: {pedido: {creative: 'lumina_b.mp4', caption: '1 produto, 20 segundos #antesedepois', planned_datetime: '2026-10-01T19:00:00-03:00', channel_id: 'UC_lumina_beauty', sector: 'beleza'}},
      },
    },
  },
  {
    de: 'servidor',
    tipo: 'response',
    metodo: 'tools/call',
    explica: 'O servidor roda a sua função Python (a mesma que os testes cobrem) e devolve o resultado estruturado.',
    json: {
      jsonrpc: '2.0',
      id: 3,
      result: {
        structuredContent: {
          predicted_metric: 4237,
          interval_low: 1655,
          interval_high: 9180,
          relative_to_channel: 1.84,
          confidence_flag: {baixa_confianca: false, motivos: []},
          top_drivers: ['…'],
          explanation: {resumo: 'Previsão de 4.237 curtidas, 1,84 vez a mediana recente do canal…'},
          comparables: ['…'],
          model_version: 'gbm-quantil-20260927-f9e6dda',
        },
        isError: false,
      },
    },
  },
];

const W = 640;
const H = 60 + MSGS.length * 34;
const XC = 120;
const XS = 520;

/** Sequência JSON-RPC entre a persona (cliente MCP) e o seu servidor. */
export default function McpFlow(): React.ReactElement {
  const [i, setI] = useState(0);
  const [tocando, setTocando] = useState(false);
  const reduzido = usePrefersReducedMotion();
  useEffect(() => {
    if (!tocando) return;
    const id = window.setInterval(
      () =>
        setI((v) => {
          if (v >= MSGS.length - 1) {
            setTocando(false);
            return v;
          }
          return v + 1;
        }),
      reduzido ? 3000 : 2000,
    );
    return () => window.clearInterval(id);
  }, [tocando, reduzido]);
  const m = MSGS[i];

  return (
    <VizFrame
      titulo="Uma conversa MCP, mensagem por mensagem"
      subtitulo="O protocolo é JSON-RPC 2.0. Clique numa seta para ver a mensagem exata que trafega entre a persona e o seu servidor."
      simulado={false}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className={s.chart} role="img" aria-label={`Diagrama de sequência MCP, mensagem ${i + 1}: ${m.metodo}`}>
        <rect x={XC - 90} y={4} width={180} height={36} rx={6} style={{fill: 'var(--viz-roxo-bg)'}} />
        <RoughRect x={XC - 90} y={4} w={180} h={36} stroke={COR.roxo} strokeWidth={2.4} seed={2} />
        <text x={XC} y={27} textAnchor="middle" fontSize={13} className={s.sketchText}>
          cliente: persona Galaxies
        </text>
        <rect x={XS - 90} y={4} width={180} height={36} rx={6} style={{fill: 'var(--viz-verde-bg)'}} />
        <RoughRect x={XS - 90} y={4} w={180} h={36} stroke={COR.verde} strokeWidth={2.4} seed={4} />
        <text x={XS} y={27} textAnchor="middle" fontSize={13} className={s.sketchText}>
          servidor: sua tool
        </text>
        <line x1={XC} x2={XC} y1={42} y2={H - 4} style={{stroke: COR.cinza, strokeDasharray: '4 4'}} />
        <line x1={XS} x2={XS} y1={42} y2={H - 4} style={{stroke: COR.cinza, strokeDasharray: '4 4'}} />
        <defs>
          <marker id="mcpSeta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" style={{fill: 'context-stroke'}} />
          </marker>
        </defs>
        {MSGS.map((q, k) => {
          const y = 62 + k * 34;
          const ida = q.de === 'cliente';
          const ativo = k === i;
          const visivel = k <= i;
          const cor = q.tipo === 'response' ? COR.verde : q.tipo === 'notification' ? COR.cinza : COR.roxo;
          return (
            <g key={k} onClick={() => setI(k)} style={{cursor: 'pointer', opacity: visivel ? 1 : 0.2, transition: 'opacity 0.3s'}}>
              <rect x={XC} y={y - 16} width={XS - XC} height={30} style={{fill: ativo ? 'var(--viz-roxo-bg)' : 'transparent'}} />
              <line
                x1={ida ? XC + 4 : XS - 4}
                x2={ida ? XS - 6 : XC + 6}
                y1={y}
                y2={y}
                markerEnd="url(#mcpSeta)"
                style={{stroke: cor, strokeWidth: ativo ? 2.6 : 1.6, strokeDasharray: q.tipo === 'response' ? '6 4' : undefined}}
              />
              <text x={(XC + XS) / 2} y={y - 5} textAnchor="middle" fontSize={12} fontWeight={ativo ? 700 : 400}>
                {q.metodo} {q.tipo === 'response' ? '(resposta)' : q.tipo === 'notification' ? '(notificação)' : ''}
              </text>
            </g>
          );
        })}
      </svg>
      <div key={i} className={s.fadeIn}>
        <p style={{fontSize: '0.9rem', margin: '0.3rem 0'}}>
          <strong>
            {i + 1}. {m.metodo}
          </strong>
          : {m.explica}
        </p>
        <pre className={s.code}>{JSON.stringify(m.json, null, 2)}</pre>
      </div>
      <div className={s.controls} style={{marginTop: '0.6rem'}}>
        <button type="button" className={s.btn} disabled={i === 0} onClick={() => setI(i - 1)}>
          <Icon nome="esquerda" /> anterior
        </button>
        <button type="button" className={clsx(s.btn, s.btnPrimary)} onClick={() => (i >= MSGS.length - 1 ? (setI(0), setTocando(true)) : setTocando(!tocando))}>
          <Icon nome={tocando ? 'pause' : i >= MSGS.length - 1 ? 'repetir' : 'play'} peso={2} />
          {tocando ? 'pausar' : i >= MSGS.length - 1 ? 'de novo' : 'reproduzir'}
        </button>
        <button type="button" className={s.btn} disabled={i === MSGS.length - 1} onClick={() => setI(i + 1)}>
          próximo <Icon nome="direita" />
        </button>
      </div>
      <Nota>
        Você quase nunca escreve essas mensagens à mão: o FastMCP gera o schema a partir dos type hints e faz o JSON-RPC por você. Mas saber o que
        trafega ajuda a depurar no <strong>MCP Inspector</strong>, onde é exatamente isso que aparece. Esta é a conversa do <code>mcp</code> 1.30
        (protocolo <code>2025-11-25</code>), a versão compatível com o <code>langchain-mcp-adapters</code>. Na revisão <code>2026-07-28</code> da spec,
        o protocolo passou a ser sem estado: sai o <code>initialize</code> e a versão e as capacidades viajam em cada mensagem (detalhes na aula 6.5).
      </Nota>
    </VizFrame>
  );
}
