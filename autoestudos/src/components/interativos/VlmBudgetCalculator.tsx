import React, {useState} from 'react';
import {VizFrame, Slider, Segmented, Stat, Nota, vizStyles as s} from './lib/ui';
import {fmt, fmtInt} from './lib/svg';

type Res = 'baixa' | 'padrao';
type Modelo = '3.5-lite' | '2.5-lite';

const TOKENS_FRAME: Record<Res, number> = {baixa: 66, padrao: 258};
const TOKENS_AUDIO_S = 32;
// US$ por 1M tokens (entrada, saída), página de preços da Gemini API, set/2026
const PRECO: Record<Modelo, {nome: string; in: number; out: number}> = {
  '3.5-lite': {nome: 'gemini-3.5-flash-lite', in: 0.3, out: 2.5},
  '2.5-lite': {nome: 'gemini-2.5-flash-lite', in: 0.1, out: 0.4},
};

/** Orçamento de tokens, cota e custo para extrair a rubrica com um VLM. */
export default function VlmBudgetCalculator(): React.ReactElement {
  const [videos, setVideos] = useState(6000);
  const [dur, setDur] = useState(35);
  const [fps, setFps] = useState(1);
  const [res, setRes] = useState<Res>('baixa');
  const [prompt, setPrompt] = useState(1200);
  const [saida, setSaida] = useState(450);
  const [rpd, setRpd] = useState(1000);
  const [modelo, setModelo] = useState<Modelo>('3.5-lite');

  const tokVideo = Math.round(dur * (fps * TOKENS_FRAME[res] + TOKENS_AUDIO_S));
  const tokIn = tokVideo + prompt;
  const totalIn = tokIn * videos;
  const totalOut = saida * videos;
  const diasRpd = Math.ceil(videos / rpd);
  const horasVideo = (videos * dur) / 3600;
  const diasYoutube = Math.ceil(horasVideo / 8); // URL do YouTube: ~8 h de vídeo/dia no free tier
  const custo = (totalIn / 1e6) * PRECO[modelo].in + (totalOut / 1e6) * PRECO[modelo].out;

  return (
    <VizFrame
      titulo="Orçamento do VLM: tokens, cota e custo"
      subtitulo="Quanto custa (em tokens, dias de free tier e dólares) fazer o VLM responder a rubrica para toda a sua base."
      simulado={false}
    >
      <div className={s.controls}>
        <Slider rotulo="Vídeos" valor={videos} min={500} max={15000} passo={500} onChange={setVideos} formato={fmtInt} />
        <Slider rotulo="Duração média" valor={dur} min={10} max={180} passo={5} onChange={setDur} formato={(v) => `${v}s`} />
        <Slider rotulo="Frames por segundo" valor={fps} min={0.25} max={2} passo={0.25} onChange={setFps} formato={(v) => fmt(v, 2)} />
      </div>
      <div className={s.controls}>
        <span className={s.control}>
          resolução de mídia
          <Segmented<Res>
            rotulo="Resolução"
            valor={res}
            onChange={setRes}
            opcoes={[
              {valor: 'baixa', rotulo: 'baixa (66 tok/frame)'},
              {valor: 'padrao', rotulo: 'padrão (258 tok/frame)'},
            ]}
          />
        </span>
        <Slider rotulo="Prompt (tokens)" valor={prompt} min={300} max={4000} passo={100} onChange={setPrompt} />
        <Slider rotulo="Saída (tokens)" valor={saida} min={100} max={2000} passo={50} onChange={setSaida} />
      </div>
      <div className={s.controls}>
        <label className={s.control}>
          requisições/dia do seu projeto
          <input type="number" min={50} max={100000} value={rpd} onChange={(e) => setRpd(Math.max(1, Number(e.target.value)))} />
        </label>
        <Segmented<Modelo>
          rotulo="Modelo"
          valor={modelo}
          onChange={setModelo}
          opcoes={[
            {valor: '3.5-lite', rotulo: PRECO['3.5-lite'].nome},
            {valor: '2.5-lite', rotulo: PRECO['2.5-lite'].nome},
          ]}
        />
      </div>

      <div className={s.stats}>
        <Stat rotulo="Tokens por vídeo" valor={fmtInt(tokIn)} dica={`${fmtInt(tokVideo)} de mídia + ${fmtInt(prompt)} de prompt`} />
        <Stat rotulo="Tokens totais" valor={fmtInt(totalIn + totalOut)} dica={`${fmtInt(totalIn)} entrada · ${fmtInt(totalOut)} saída`} />
        <Stat rotulo="Dias no free tier" valor={Math.max(diasRpd, diasYoutube)} dica={diasYoutube > diasRpd ? `gargalo: ~8 h de vídeo do YouTube/dia (${fmt(horasVideo, 0)} h)` : `gargalo: ${fmtInt(rpd)} req/dia`} tom={Math.max(diasRpd, diasYoutube) > 7 ? 'bad' : 'good'} />
        <Stat rotulo="Se fosse pago" valor={`US$ ${fmt(custo, 2)}`} dica={`Batch API: ~US$ ${fmt(custo / 2, 2)}`} />
      </div>
      <Nota>
        Com resolução baixa, cada segundo de vídeo custa ~{TOKENS_FRAME.baixa * fps + TOKENS_AUDIO_S} tokens (frames a {fmt(fps, 2)} fps + {TOKENS_AUDIO_S}{' '}
        tokens/s de áudio). Para uma rubrica de atributos grossos (tem rosto? tem texto? gancho forte?), baixa resolução costuma bastar: teste num
        subconjunto antes. Os limites do free tier <strong>não são mais publicados em número</strong>, então confira os do seu projeto no AI Studio. E
        lembre: no free tier, o conteúdo enviado pode ser usado pelo Google.
      </Nota>
    </VizFrame>
  );
}
