import {Diagram} from '../../dsl.mjs';

const d = new Diagram();
d.title(250, -80, 'Um pipeline, muitos clientes: treinar_para_cliente()');

// entradas
d.box('mcp', 0, 0, 270, 100, 'tool MCP treinar_modelo\n(devolve um job_id)', 'roxo', {strokeWidth: 3});
d.box('base', 0, 175, 270, 90, 'base do cliente\n(CSV ou Parquet)', 'azul');
d.box('cfg', 0, 300, 270, 90, 'config.yaml\n(alvo, blocos, quantis)', 'azul');

// linha de cima: validar -> features -> modelos
d.box('valida', 360, 160, 260, 120, '1. validar\nesquema: pandera\nconfig: Pydantic', 'cinza');
d.box('feat', 700, 160, 270, 120, '2. features que as\ncolunas permitem', 'verde');
d.box('modelos', 1050, 160, 270, 120, '3. split temporal\nbaseline vs. GBM\n+ quantis', 'verde', {strokeWidth: 3});

d.arrow('mcp', 'valida', {from: 'right', to: 'top', via: [[490, 50]]});
d.arrow('base', 'valida');
d.arrow('cfg', 'valida', {from: 'right', to: 'left', via: [[315, 345], [315, 220]]});
d.arrow('valida', 'feat');
d.arrow('feat', 'modelos');

// blocos de features sob "features"
d.box('b1', 700, 320, 80, 50, 'canal', 'azul', {fontSize: 16});
d.box('b2', 795, 320, 80, 50, 'tempo', 'azul', {fontSize: 16});
d.box('b3', 890, 320, 80, 50, 'texto', 'azul', {fontSize: 16});
d.box('b4', 700, 385, 270, 50, 'vídeo: só se as colunas existirem', 'laranja', {fontSize: 16, dashed: true});

d.note('erro', 360, 330, 260, 90, 'base inválida? erro legível:\ncoluna, regra e valor.\nNada é treinado.', 'vermelho', {textColor: '#e03131'});
d.arrow('valida', 'erro', {dashed: true, cor: 'vermelho'});

// linha de baixo: artefatos -> MLflow -> humano -> produção
d.box('art', 1050, 500, 270, 110, '4. artefatos versionados\nhash(base + config)\nmodelos, métricas, card', 'cinza');
d.box('mlflow', 700, 500, 270, 110, '5. MLflow: nova versão\ncom tag "candidato"', 'cinza');
d.box('humano', 360, 500, 260, 110, '6. uma pessoa lê o\nmodel card e promove\no alias @champion', 'amarelo', {strokeWidth: 3});
d.box('prever', 0, 500, 270, 110, 'tool prever_curtidas\ncarrega só @champion', 'roxo');

d.arrow('modelos', 'art', {from: 'bottom', to: 'top'});
d.arrow('art', 'mlflow');
d.arrow('mlflow', 'humano');
d.arrow('humano', 'prever');

d.note('regra', 0, 660, 1320, 60, 'A tool de treino nunca sobrescreve o modelo em produção: ela só cria candidatos. Promover é decisão humana.', 'roxo', {textColor: '#6741d9'});

export default d.elements;
