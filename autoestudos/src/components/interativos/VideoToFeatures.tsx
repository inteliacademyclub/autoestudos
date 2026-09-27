import React, {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {VizFrame, Nota, vizStyles as s} from './lib/ui';
import {COR, RoughRect, RoughCircle, linear, fmt, usePrefersReducedMotion} from './lib/svg';
import st from './interativos.module.css';
import Icon from '../aula/Icon';

const DUR = 22;

type Cena = {ini: number; fim: number; nome: string; rosto?: 'metade' | 'cheio' | 'split'; texto?: string; produto?: boolean};
const CENAS: Cena[] = [
  {ini: 0, fim: 2, nome: 'gancho: metade do rosto sem make', rosto: 'metade', texto: 'ANTES'},
  {ini: 2, fim: 5.5, nome: 'close do produto', produto: true, texto: '1 produto'},
  {ini: 5.5, fim: 9, nome: 'aplicação', rosto: 'cheio'},
  {ini: 9, fim: 14, nome: 'antes | depois', rosto: 'split'},
  {ini: 14, fim: 19, nome: 'resultado', rosto: 'cheio', texto: '20 segundos'},
  {ini: 19, fim: 22, nome: 'packshot + CTA', produto: true, texto: 'link na bio'},
];
// segmentos da transcrição (Whisper devolve trechos com início e fim)
const SEGMENTOS = [
  {ini: 0.3, fim: 1.0, txt: 'olha isso'},
  {ini: 3.0, fim: 4.1, txt: 'um produto só'},
  {ini: 15.1, fim: 16.3, txt: 'vinte segundos'},
  {ini: 20.0, fim: 21.0, txt: 'link na bio'},
];
const AMOSTRAS = [0.5, 1.5, 2.5, 6, 11, 16, 21];

type Linha = {t: number; bloco: string; nome: string; valor: string};
const LINHAS: Linha[] = [
  {t: 0, bloco: 'meta', nome: 'duracao_s', valor: '22'},
  {t: 0, bloco: 'meta', nome: 'proporcao', valor: '9:16'},
  {t: 0.5, bloco: 'vis', nome: 'siglip_frame_0.5s', valor: 'vetor 768-d'},
  {t: 0.9, bloco: 'aud', nome: 'fala_no_gancho', valor: 'sim'},
  {t: 1.5, bloco: 'det', nome: 'rosto_no_gancho', valor: 'sim (área 38%)'},
  {t: 1.8, bloco: 'det', nome: 'texto_no_gancho', valor: 'sim ("ANTES")'},
  {t: 2, bloco: 'vis', nome: 'cortes_no_gancho', valor: '1'},
  {t: 3, bloco: 'vis', nome: 'brilho_medio_gancho', valor: '0,61'},
  {t: 5.5, bloco: 'det', nome: 'produto_em_destaque', valor: 'sim (OWLv2: "base")'},
  {t: 14, bloco: 'vis', nome: 'movimento_medio', valor: '2,3 px/frame'},
  {t: 22, bloco: 'vis', nome: 'cortes_por_s', valor: '0,23'},
  {t: 22, bloco: 'aud', nome: 'palavras_por_s', valor: '0,45'},
  {t: 22, bloco: 'aud', nome: 'energia_rms_media', valor: '0,72'},
  {t: 22, bloco: 'vis', nome: 'siglip_pca_1..16', valor: 'média dos 7 frames → PCA'},
];

const VLM_JSON = `{
  "hook_primeiros_3s": "metade do rosto sem maquiagem + 'ANTES'",
  "forca_hook_0a10": 8,
  "tem_rosto": true,
  "before_after_ou_transformacao": true,
  "texto_na_tela": true,
  "ritmo_cortes_0a10": 6,
  "energia_musica_0a10": 7,
  "tom_narracao": "animado",
  "clareza_beneficio_produto_0a10": 8
}`;

const cenaEm = (t: number) => CENAS.find((c) => t >= c.ini && t < c.fim) ?? CENAS[CENAS.length - 1];

function Tela({t, deteccoes}: {t: number; deteccoes: boolean}) {
  const c = cenaEm(t);
  const W = 180;
  const H = 320;
  const pele = '#f3c9a8';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={st.phone} role="img" aria-label={`Frame em ${fmt(t, 1)} s: ${c.nome}`}>
      <rect x={1} y={1} width={W - 2} height={H - 2} rx={18} style={{fill: '#fdf6f0', stroke: 'var(--viz-tinta)', strokeWidth: 2}} />
      {c.rosto && (
        <g>
          {c.rosto === 'split' ? (
            <>
              <circle cx={62} cy={140} r={36} style={{fill: '#d9a88a'}} />
              <circle cx={118} cy={140} r={36} style={{fill: pele}} />
              <line x1={90} x2={90} y1={70} y2={220} style={{stroke: '#555', strokeWidth: 2}} />
              <text x={62} y={205} fontSize={11} textAnchor="middle" style={{fill: '#333'}}>
                antes
              </text>
              <text x={118} y={205} fontSize={11} textAnchor="middle" style={{fill: '#333'}}>
                depois
              </text>
            </>
          ) : (
            <>
              <circle cx={90} cy={140} r={58} style={{fill: pele}} />
              {c.rosto === 'metade' && <path d="M90,82 A58,58 0 0,0 90,198 Z" style={{fill: '#d9a88a'}} />}
              <circle cx={70} cy={128} r={5} style={{fill: '#333'}} />
              <circle cx={110} cy={128} r={5} style={{fill: '#333'}} />
              <path d="M72,162 Q90,176 108,162" style={{fill: 'none', stroke: '#c0392b', strokeWidth: 3}} />
            </>
          )}
          {deteccoes && c.rosto !== 'split' && <RoughRect x={28} y={76} w={124} h={130} stroke={COR.verde} strokeWidth={2} seed={Math.round(c.ini) + 1} dashed />}
          {deteccoes && c.rosto === 'split' && (
            <>
              <RoughRect x={22} y={100} w={80} h={82} stroke={COR.verde} strokeWidth={2} seed={11} dashed />
              <RoughRect x={80} y={100} w={80} h={82} stroke={COR.verde} strokeWidth={2} seed={12} dashed />
            </>
          )}
        </g>
      )}
      {c.produto && (
        <g>
          <rect x={62} y={100} width={56} height={110} rx={10} style={{fill: '#c8a2c8', stroke: '#6b4f6b', strokeWidth: 2}} />
          <rect x={72} y={86} width={36} height={18} rx={4} style={{fill: '#6b4f6b'}} />
          <text x={90} y={160} fontSize={11} textAnchor="middle" style={{fill: '#fff', fontWeight: 700}}>
            LUMINA
          </text>
          {deteccoes && <RoughRect x={54} y={80} w={72} h={138} stroke={COR.laranja} strokeWidth={2} seed={21} dashed />}
        </g>
      )}
      {c.texto && (
        <g>
          <rect x={20} y={240} width={140} height={34} rx={8} style={{fill: '#111', opacity: 0.85}} />
          <text x={90} y={262} fontSize={15} textAnchor="middle" style={{fill: '#fff', fontWeight: 800}}>
            {c.texto}
          </text>
          {deteccoes && <RoughRect x={14} y={234} w={152} h={46} stroke={COR.azul} strokeWidth={2} seed={31} dashed />}
        </g>
      )}
      <text x={W - 14} y={24} fontSize={11} textAnchor="end" style={{fill: '#777'}}>
        {fmt(t, 1)}s
      </text>
    </svg>
  );
}

/** Scrubber de um Short ilustrado: como o vídeo vira uma linha de features. */
export default function VideoToFeatures(): React.ReactElement {
  const [t, setT] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [det, setDet] = useState(true);
  const reduzido = usePrefersReducedMotion();
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!tocando) return;
    let ultimo = performance.now();
    const loop = (agora: number) => {
      const dt = (agora - ultimo) / 1000;
      ultimo = agora;
      setT((v) => {
        const n = v + dt * (reduzido ? 3 : 1.5);
        if (n >= DUR) {
          setTocando(false);
          return DUR;
        }
        return n;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [tocando, reduzido]);

  const W = 640;
  const x = linear([0, DUR], [16, W - 16]);
  const linhas = LINHAS.filter((l) => l.t <= t + 1e-9);

  return (
    <VizFrame
      titulo="Do vídeo às colunas: o Short B da Lumina"
      subtitulo="Arraste o tempo (ou aperte play). Veja quais frames são amostrados, onde estão os cortes, o que o Whisper transcreve e que colunas vão nascendo."
    >
      <div className={st.videoLayout}>
        <Tela t={t} deteccoes={det} />
        <div>
          <table className={st.featureRows}>
            <thead>
              <tr>
                <th>bloco</th>
                <th>coluna</th>
                <th>valor</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => (
                <tr key={l.nome} className={clsx(t - l.t < 0.8 && st.novo)}>
                  <td className={s.mono}>{l.bloco}_</td>
                  <td className={s.mono}>{l.nome}</td>
                  <td>{l.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {t >= DUR - 1e-6 && (
            <div className={s.fadeIn} style={{marginTop: '0.6rem'}}>
              <strong style={{fontSize: '0.85rem'}}>Resposta do VLM à rubrica (trecho):</strong>
              <pre className={s.code}>{VLM_JSON}</pre>
            </div>
          )}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} 120`} className={s.chart} role="img" aria-label="Linha do tempo do vídeo com cortes, frames amostrados e transcrição">
        <rect x={x(0)} y={8} width={x(3) - x(0)} height={96} style={{fill: 'var(--viz-roxo-bg)'}} />
        <text x={x(1.5)} y={20} fontSize={11} textAnchor="middle" className={s.sketchText} style={{fill: COR.roxo}}>
          gancho (0–3 s)
        </text>
        {CENAS.map((c, i) => (
          <g key={c.ini}>
            <rect x={x(c.ini) + 1} y={28} width={x(c.fim) - x(c.ini) - 2} height={22} rx={4} style={{fill: i % 2 ? 'var(--viz-azul-bg)' : 'var(--viz-amarelo-bg)', stroke: COR.cinza, strokeWidth: 0.6}} />
            {c.ini > 0 && <line x1={x(c.ini)} x2={x(c.ini)} y1={24} y2={54} style={{stroke: COR.vermelho, strokeWidth: 2}} />}
          </g>
        ))}
        {AMOSTRAS.map((a) => (
          <g key={a}>
            <path d={`M${x(a)},72 l-5,-8 h10 z`} style={{fill: COR.verde}} />
          </g>
        ))}
        {SEGMENTOS.map((p) => (
          <g key={p.ini}>
            <rect x={x(p.ini)} y={80} width={x(p.fim) - x(p.ini)} height={6} rx={3} style={{fill: COR.azul}} />
            <text x={x(p.ini)} y={98} fontSize={10} style={{fill: COR.azul}}>
              “{p.txt}”
            </text>
          </g>
        ))}
        <line x1={x(t)} x2={x(t)} y1={4} y2={108} style={{stroke: 'var(--viz-tinta)', strokeWidth: 2}} />
        <RoughCircle cx={x(t)} cy={108} d={10} fill={COR.tinta} stroke={COR.tinta} seed={2} fillStyle="solid" />
      </svg>
      <div className={s.legend}>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.verde}} /> frame amostrado para SigLIP/VLM
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.vermelho}} /> corte (PySceneDetect)
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{background: COR.azul}} /> fala transcrita (Whisper)
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{border: `2px dashed ${COR.verde}`}} /> rosto
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{border: `2px dashed ${COR.azul}`}} /> texto (OCR)
        </span>
        <span className={s.legendItem}>
          <span className={s.swatch} style={{border: `2px dashed ${COR.laranja}`}} /> produto
        </span>
      </div>

      <div className={s.controls} style={{marginTop: '0.6rem'}}>
        <button
          type="button"
          className={clsx(s.btn, s.btnPrimary)}
          onClick={() => {
            if (t >= DUR) setT(0);
            setTocando((v) => !v);
          }}
        >
          <Icon nome={tocando ? 'pause' : 'play'} peso={2} /> {tocando ? 'pausar' : 'play'}
        </button>
        <label className={s.control}>
          tempo
          <input type="range" min={0} max={DUR} step={0.1} value={t} onChange={(e) => setT(Number(e.target.value))} style={{width: 'min(260px, 55vw)'}} />
          <span className={s.value}>{fmt(t, 1)} s</span>
        </label>
        <label className={s.control}>
          <input type="checkbox" checked={det} onChange={(e) => setDet(e.target.checked)} /> mostrar detecções
        </label>
      </div>
      <Nota>
        Repare na densidade de informação dos <strong>3 primeiros segundos</strong>: por isso a amostragem gasta 3 dos 7 frames ali. Cada etapa
        salva o resultado em disco com o <code>video_id</code> como chave, e o VLM entra por último, respondendo uma rubrica fixa em JSON. Tudo
        termina como colunas numa tabela, que é o que o GBM sabe usar.
      </Nota>
    </VizFrame>
  );
}
