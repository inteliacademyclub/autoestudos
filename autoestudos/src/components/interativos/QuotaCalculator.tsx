import React, {useState} from 'react';
import {VizFrame, Slider, Stat, Nota, Segmented, vizStyles as s} from './lib/ui';
import {RoughRect, COR, fmt} from './lib/svg';

const COTA_DIA = 10_000;
const SEARCH_DIA = 100; // bucket próprio do search.list desde 01/06/2026

type Estrategia = 'playlist' | 'search';

/** Calculadora de cota da YouTube Data API v3 para montar a base. */
export default function QuotaCalculator(): React.ReactElement {
  const [canais, setCanais] = useState(60);
  const [videos, setVideos] = useState(250);
  const [refresh, setRefresh] = useState(4);
  const [estr, setEstr] = useState<Estrategia>('playlist');

  const total = canais * videos;
  const lotesVideos = Math.ceil(total / 50);
  const channelsList = Math.ceil(canais / 50);
  const playlistItems = canais * Math.ceil(videos / 50);
  const unidadesPlaylist = channelsList + playlistItems + lotesVideos;
  const unidadesRefresh = lotesVideos * refresh;
  const chamadasSearch = canais * Math.ceil(videos / 50);
  const diasSearch = Math.ceil(chamadasSearch / SEARCH_DIA);
  const unidadesSearch = lotesVideos + channelsList; // videos.list continua necessário

  const unidades = estr === 'playlist' ? unidadesPlaylist : unidadesSearch;
  const pctDia = (100 * (unidades + unidadesRefresh)) / COTA_DIA;

  // barras: "dias até ter a base"
  const diasPlaylist = Math.max(1, Math.ceil((unidadesPlaylist + unidadesRefresh) / COTA_DIA));
  const diasBusca = Math.max(diasSearch, Math.ceil((unidadesSearch + unidadesRefresh) / COTA_DIA));
  const maxDias = Math.max(diasPlaylist, diasBusca, 1);
  const W = 560;
  const bw = (d: number) => 20 + ((W - 260) * d) / maxDias;

  return (
    <VizFrame
      titulo="Calculadora de cota da YouTube Data API"
      subtitulo="Quanto custa montar (e manter atualizada) a sua base, dependendo de como você lista os vídeos."
      simulado={false}
    >
      <div className={s.controls}>
        <Slider rotulo="Canais" valor={canais} min={10} max={200} passo={5} onChange={setCanais} />
        <Slider rotulo="Vídeos por canal" valor={videos} min={50} max={1500} passo={50} onChange={setVideos} />
        <Slider rotulo="Atualizações de estatísticas" valor={refresh} min={0} max={30} onChange={setRefresh} formato={(v) => `${v}×`} />
      </div>
      <div className={s.controls}>
        <span>Como listar os vídeos:</span>
        <Segmented<Estrategia>
          rotulo="Estratégia de listagem"
          valor={estr}
          onChange={setEstr}
          opcoes={[
            {valor: 'playlist', rotulo: 'playlist de uploads (UU…)'},
            {valor: 'search', rotulo: 'search.list por canal'},
          ]}
        />
      </div>

      <div className={s.stats}>
        <Stat rotulo="Vídeos varridos" valor={fmt(total, 0)} dica="antes de filtrar Shorts e idade ≥ 30 dias" />
        {estr === 'playlist' ? (
          <Stat rotulo="Unidades (coleta)" valor={fmt(unidadesPlaylist, 0)} dica={`${channelsList} channels + ${playlistItems} playlistItems + ${lotesVideos} videos`} tom="good" />
        ) : (
          <Stat
            rotulo="Chamadas search.list"
            valor={fmt(chamadasSearch, 0)}
            dica={`limite de ${SEARCH_DIA}/dia → ${diasSearch} dia(s)`}
            tom={diasSearch > 3 ? 'bad' : 'warn'}
          />
        )}
        <Stat rotulo="Unidades (atualizações)" valor={fmt(unidadesRefresh, 0)} dica={`${refresh} × ${lotesVideos} chamadas videos.list`} />
        <Stat rotulo="% da cota diária" valor={`${fmt(pctDia, 1)}%`} dica="10.000 unidades/dia por projeto" tom={pctDia > 100 ? 'bad' : 'good'} />
      </div>

      <svg viewBox={`0 0 ${W} 110`} className={s.chart} role="img" aria-label={`Dias até a base ficar pronta: playlist ${diasPlaylist}, search ${diasBusca}`}>
        <text x={0} y={30} className={s.sketchText} fontSize={15}>
          playlist de uploads
        </text>
        <RoughRect x={170} y={14} w={bw(diasPlaylist)} h={24} fill={COR.verde} stroke={COR.verde} seed={3} />
        <text x={180 + bw(diasPlaylist)} y={31} fontSize={13}>
          {diasPlaylist} dia(s)
        </text>
        <text x={0} y={80} className={s.sketchText} fontSize={15}>
          search.list
        </text>
        <RoughRect x={170} y={64} w={bw(diasBusca)} h={24} fill={COR.vermelho} stroke={COR.vermelho} seed={5} />
        <text x={180 + bw(diasBusca)} y={81} fontSize={13}>
          {diasBusca} dia(s)
        </text>
      </svg>

      <Nota>
        <strong>Por que a playlist ganha:</strong> <code>playlistItems.list</code> e <code>videos.list</code> custam 1 unidade por chamada de até 50
        itens. Já o <code>search.list</code> tem, desde 01/06/2026, um balde separado de só {SEARCH_DIA} chamadas por dia. Use a busca apenas para
        descobrir canais, nunca para listar vídeos. Para as <em>atualizações</em>, o <code>videos.batchGetStats</code> (desde 03/06/2026) tem balde próprio e
        não consome a cota geral.
      </Nota>
    </VizFrame>
  );
}
