# Fase 2 - Preferencias / Configuracoes comuns - Subetapa 8 - Reavaliacao documental da proxima fila de helpers seguros

## Objetivo

Reavaliar apenas por leitura a proxima fila de helpers restantes de menor risco, depois da validacao do odontograma, para escolher o proximo candidato com menor blast radius antes de qualquer implementacao futura.

## Historico dos helpers ja validados

- `prefAmbEstiloPadrao` foi implementado e validado nas Subetapas 4 e 4B.
- `prefValoresPadraoDados` foi implementado e validado nas Subetapas 5 e 5B.
- `prefValoresPadraoOdontograma` foi implementado e validado nas Subetapas 6 e 7.

O modulo passivo atual continua em:

- `frontend/js/modules/preferencias-opcoes-sistema.js`
- exposto em `window.BranaPreferenciasOpcoesSistemaModule`
- carregado antes de `frontend/app.js`
- ainda parcial
- sem DOM, sem `requestJson`, sem payload e sem salvamento

## Confirmacao do ambiente

- Diretorio usado: `D:\\BRANA ARQUIVOS\\BRANA CLOUD`.
- Branch usada: `modularizacao-segura-fase-1`.
- `git status --short` inicial mostrou apenas `untracked` antigos em `docs/`, sem alteracao de codigo nesta etapa.

## Candidatos reavaliados nesta etapa

### 1) `prefAmbienteTextoExemplo`

- Helper puro: sim.
- Usa DOM: nao.
- Usa `window`/`document`: nao.
- Usa estado global: nao.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Depende de `tenant`/`clinica`/`user_id`/contexto: nao.
- Altera texto visivel: nao diretamente; apenas retorna texto de preview.
- Altera preview: sim, indiretamente, porque alimenta o preview do dialogo de fonte.
- Depende de helper ja extraido: nao.
- Depende de normalize: nao.
- Depende de base de estilo: nao.
- Pode ser extraido com fallback local equivalente: sim.
- Deve ir para `frontend/js/modules/preferencias-opcoes-sistema.js`: sim, e continua adequado como destino futuro.
- Risco real de extracao: baixo.
- Observacao de compatibilidade: e o menor recorte da fila restante, com funcao de retorno simples e blast radius reduzido.

### 2) `prefAmbienteDialogoValor`

- Helper puro ou quase puro: quase puro.
- Usa DOM: nao.
- Usa `window`/`document`: apenas leitura condicional de `window.easyFontNormalizeStyleId`.
- Usa estado global: nao.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Depende de `tenant`/`clinica`/`user_id`/contexto: nao.
- Altera texto visivel: nao diretamente.
- Altera preview: sim, porque monta o valor inicial do dialogo de fonte.
- Depende de helper ja extraido: nao.
- Depende de normalize: sim, opcionalmente para `styleId`.
- Depende de base de estilo: nao, mas usa defaults locais do proprio helper de dialogo.
- Pode ser extraido com fallback local equivalente: sim.
- Deve ir para `frontend/js/modules/preferencias-opcoes-sistema.js`: sim, mas com prioridade menor que `prefAmbienteTextoExemplo`.
- Risco real de extracao: baixo-medio.
- Observacao de compatibilidade: continua seguro, mas ja conversa com a integracao de fonte e com a normalizacao do `styleId`.

### 3) `prefAmbienteEstiloDeDialogo`

- Helper puro ou quase puro: quase puro.
- Usa DOM: nao.
- Usa `window`/`document`: apenas leitura condicional de `window.easyFontNormalizeStyleId`.
- Usa estado global: nao.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Depende de `tenant`/`clinica`/`user_id`/contexto: nao.
- Altera texto visivel: nao diretamente.
- Altera preview: sim, porque converte a saida do dialogo em estilo persistido do preview.
- Depende de helper ja extraido: sim, de `prefAmbEstiloPadrao`.
- Depende de normalize: sim.
- Depende de base de estilo: sim, explicitamente.
- Pode ser extraido com fallback local equivalente: sim.
- Deve ir para `frontend/js/modules/preferencias-opcoes-sistema.js`: sim, mas nao e o melhor primeiro recorte da fila restante.
- Risco real de extracao: baixo-medio.
- Observacao de compatibilidade: permanece seguro, mas a dependencia de base de estilo e da ponte com o preview elevam um pouco o acoplamento.

## Candidato recomendado para proxima implementacao

`prefAmbienteTextoExemplo`

### Justificativa

- e o menor helper restante da fila segura;
- nao depende de DOM;
- nao depende de `requestJson`;
- nao monta payload;
- nao depende de `tenant`/`clinica`/`user_id`;
- nao depende de helper previamente extraido;
- nao depende de normalize;
- nao depende de base de estilo;
- tem fallback local extremamente simples;
- tem o menor blast radius entre os candidatos reavaliados.

## Escopo exato recomendado para a proxima implementacao futura

Se houver uma proxima implementacao, o recorte recomendado deve ser apenas o helper `prefAmbienteTextoExemplo`.

### Arquivo de destino

- `frontend/js/modules/preferencias-opcoes-sistema.js`.

### Exposicao esperada

- o helper deve ser exportado em `window.BranaPreferenciasOpcoesSistemaModule`;
- o modulo deve continuar passivo;
- a implementacao deve permanecer pequena e sem UI.

### Como `frontend/app.js` preservaria fallback

- `frontend/app.js` deve consultar primeiro o helper exposto no modulo passivo;
- em ausencia da exportacao, deve continuar usando a implementacao local equivalente;
- o comportamento do preview da fonte nao deve mudar.

### Arquivos provavelmente alterados na futura implementacao

- `frontend/js/modules/preferencias-opcoes-sistema.js`.
- `frontend/app.js` apenas para consultar a exportacao e manter fallback.
- `docs/11_roadmap_desenvolvimento.md`.
- documento especifico da nova subetapa.

### Arquivos que nao devem ser alterados na futura implementacao

- backend.
- banco.
- schema.
- migrations.
- seeds.
- endpoints.
- permissoes.
- `frontend/index.html`.
- `package.json`.
- arquivos de configuracao.
- salvamento.
- `requestJson`.
- payload.
- senha administrativa.
- `tenant`/`clinica`/`user_id`.
- abas.
- preview complexo.
- renderizacao sensivel.
- qualquer texto visivel ou mojibake.

### Checks futuros recomendados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/preferencias-opcoes-sistema.js`
- validacao manual do modal de preferencias na aba `Ambiente`
- conferir o preview da fonte e o comportamento do dialogo

### Teste manual futuro

Abrir `Preferencias / Configuracoes comuns`, entrar na aba `Ambiente`, usar o dialogo de fonte e confirmar que o texto de preview continua aparecendo e que o comportamento visual permanece igual.

## O que continua proibido agora

- nao mexer em salvamento;
- nao mexer em `requestJson`;
- nao mexer em payload;
- nao mexer em endpoints;
- nao mexer em senha administrativa;
- nao mexer em permissoes;
- nao mexer em `tenant`/`clinica`/`user_id`;
- nao mexer em renderizacao visual complexa;
- nao mexer em abas;
- nao corrigir textos/mojibake;
- nao alterar backend, banco, schema, migrations ou seeds;
- nao reabrir `Agenda de contatos`;
- nao continuar `Agenda principal`.

## Riscos remanescentes

- o modulo passivo ainda e parcial;
- existe duplicidade controlada entre `frontend/app.js` e o modulo passivo;
- `prefAmbienteDialogoValor` e `prefAmbienteEstiloDeDialogo` continuam sendo candidatos seguros, mas com um pouco mais de acoplamento.

## Pendencias futuras registradas

- qualquer texto quebrado ou mojibake ja existente segue apenas como pendencia documental;
- a fila seguinte deve continuar sendo tratada com recorte pequeno e validacao clara;
- a extracao futura deve preservar a paridade entre fallback e exportacao.

## Proxima subetapa recomendada

`Preferencias / Configuracoes comuns - Subetapa 9 - Implementacao minima do helper puro prefAmbienteTextoExemplo`

## Registro para roadmap

- A Subetapa 8 foi concluida como etapa exclusivamente documental.
- Os tres helpers anteriores permanecem validados.
- A fila restante de helpers seguros foi reavaliada.
- O proximo candidato recomendado foi `prefAmbienteTextoExemplo`.
- `Preferencias / Configuracoes comuns` continua como `core / comum`.
- `Agenda principal` permanece pausada temporariamente.
- `Agenda de contatos` permanece pausada/consolidada.
- A blindagem textual/mojibake foi respeitada.

## Commit seletivo obrigatorio

Quando consolidada, esta etapa deve ser commitada apenas com:

- `docs/fase_2_preferencias_configuracoes_subetapa_8_reavaliacao_proxima_fila_helpers.md`
- `docs/11_roadmap_desenvolvimento.md`
