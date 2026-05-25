# Prestadores - Subetapa 3 - Reavaliacao documental do bloco restante apos a extracao minima de `prestSelecionado`

## Objetivo da reavaliacao
Reavaliar, apenas por leitura, o bloco restante de Prestadores apos a validacao de `prestSelecionado`, para decidir se ainda existe algum helper pequeno e seguro ou se a frente deve ser pausada/consolidada nesta rodada.

## Historico dos helpers ja extraidos e validados
- `prestFmtCodigo`
- `prestStatusHtml`
- `prestSelecionado`

## Estado atual do modulo
- Arquivo: `frontend/js/modules/prestadores.js`
- Namespace global: `window.BranaPrestadoresModule`
- Estado: passivo
- Meta: `status: "passivo"`, `ativo: false`, `controlaFluxo: false`, `subetapa: "1_namespace_passivo"`
- Carregamento: o modulo continua carregado em `frontend/index.html` antes de `frontend/app.js`
- O modulo continua sem DOM, `requestJson`, payload, salvamento ou permissões

## Candidatos/funcoes restantes reavaliados
- `prestFiltrarLista`
- `prestRender`
- `prestSelecionarLinha`
- `prestCarregar`
- `prestAcoesPlaceholder`
- `prestEnsureUI`
- `prestAbrir`
- trechos de integracao da tela de Prestadores diretamente ligados ao bloco acima

## Analise tecnica individual
### `prestFiltrarLista`
- Tipo: helper quase puro
- Usa DOM: sim, indiretamente via `prestCfg.cboEspecialidade` e `prestCfg.txtNome`
- Usa estado global: sim, `prestadoresCache`
- Usa requestJson: nao
- Monta payload: nao
- Depende de tenant/clinica/user_id/contexto: nao diretamente
- Altera texto visivel: nao diretamente
- Altera selecao visual: nao
- Altera renderizacao: sim, influencia a lista exibida
- Depende de cache: sim
- Depende de helpers ja extraidos: nao
- Pode ser extraido com fallback local equivalente: teoricamente sim, mas exige contrato com `prestCfg`
- Destino futuro: `frontend/js/modules/prestadores.js` somente com contrato mais amplo e cautela
- Risco real de extracao: medio
- Seguro implementar agora: nao

### `prestRender`
- Tipo: DOM/renderizacao
- Usa DOM: sim
- Usa window/document: sim
- Usa estado global: sim, `prestCfg`, `prestadoresCache`, `prestadorSelId`
- Usa requestJson: nao diretamente
- Monta payload: nao
- Depende de tenant/clinica/user_id/contexto: nao diretamente
- Altera texto visivel: sim, inclusive o conteudo da grade e total
- Altera selecao visual: sim, destaca a linha selecionada
- Altera renderizacao: sim, e o centro visual do modulo
- Depende de cache: sim
- Depende de helpers ja extraidos: sim, `prestFmtCodigo`, `prestStatusHtml`, `prestSelecionado` indiretamente
- Pode ser extraido com fallback local equivalente: nao de forma minima neste momento
- Destino futuro: possivelmente outro arquivo maior ou uma reestruturação mais ampla
- Risco real de extracao: medio-alto
- Seguro implementar agora: nao

### `prestSelecionarLinha`
- Tipo: evento/click e selecao visual
- Usa DOM: sim, recebe `tr`
- Usa estado global: sim, `prestadorSelId`
- Usa requestJson: nao
- Monta payload: nao
- Depende de tenant/clinica/user_id/contexto: nao
- Altera texto visivel: nao diretamente
- Altera selecao visual: sim, altera a linha ativa
- Altera renderizacao: sim, porque chama `prestRender()`
- Depende de cache: nao diretamente, mas depende da lista renderizada
- Depende de helpers ja extraidos: nao
- Pode ser extraido com fallback local equivalente: nao de forma pequena
- Destino futuro: bloco de orquestracao visual, nao helper passivo
- Risco real de extracao: medio-alto
- Seguro implementar agora: nao

### `prestCarregar`
- Tipo: integracao/request
- Usa DOM: indireto, via UI e filtro
- Usa estado global: sim, `prestadoresCache`, `prestadorSelId`, `sessaoAtual`
- Usa requestJson: sim
- Monta payload: nao, mas consome dados remotos e fallback local
- Depende de tenant/clinica/user_id/contexto: sim, parcialmente via `sessaoAtual.user_id`
- Altera texto visivel: sim, via listagem e mensagens de fallback
- Altera selecao visual: sim, ao validar selecao atual
- Altera renderizacao: sim, popula a grade e o filtro
- Depende de cache: sim
- Depende de helpers ja extraidos: nao diretamente
- Pode ser extraido com fallback local equivalente: nao de forma minima
- Destino futuro: fluxo de carga maior, fora do namespace passivo nesta rodada
- Risco real de extracao: alto
- Seguro implementar agora: nao

### `prestAcoesPlaceholder`
- Tipo: fluxo visual / feedback textual
- Usa DOM: sim, `footerMsg`
- Usa window/document: sim, indiretamente pelo DOM global
- Usa estado global: sim, chama `prestSelecionado()`
- Usa requestJson: nao
- Monta payload: nao
- Depende de tenant/clinica/user_id/contexto: nao diretamente
- Altera texto visivel: sim
- Altera selecao visual: nao
- Altera renderizacao: nao
- Depende de cache: indiretamente
- Depende de helpers ja extraidos: sim, `prestSelecionado`
- Pode ser extraido com fallback local equivalente: nao de forma minima agora
- Destino futuro: orquestracao visual, nao helper passivo pequeno
- Risco real de extracao: medio-alto
- Seguro implementar agora: nao

### `prestEnsureUI`
- Tipo: DOM/orquestracao
- Usa DOM: sim
- Usa window/document: sim
- Usa estado global: sim, `prestCfg`
- Usa requestJson: nao
- Monta payload: nao
- Depende de tenant/clinica/user_id/contexto: nao
- Altera texto visivel: sim, monta a interface
- Altera selecao visual: sim, liga eventos e estrutura a area
- Altera renderizacao: sim, cria o painel
- Depende de cache: nao diretamente
- Depende de helpers ja extraidos: nao
- Pode ser extraido com fallback local equivalente: nao de forma minima
- Destino futuro: reestruturação maior
- Risco real de extracao: alto
- Seguro implementar agora: nao

### `prestAbrir`
- Tipo: fluxo visual / abertura de tela
- Usa DOM: sim, via `prestEnsureUI()` e manipulacao do painel
- Usa estado global: sim
- Usa requestJson: sim, via `prestCarregar()`
- Monta payload: nao
- Depende de tenant/clinica/user_id/contexto: indiretamente
- Altera texto visivel: sim, atualiza o rodape
- Altera selecao visual: sim, ao abrir o painel e carregar a lista
- Altera renderizacao: sim
- Depende de cache: sim, indiretamente via carregamento
- Depende de helpers ja extraidos: nao diretamente
- Pode ser extraido com fallback local equivalente: nao de forma minima
- Destino futuro: fluxo principal de abertura, alto acoplamento
- Risco real de extracao: alto
- Seguro implementar agora: nao

## Comparacao de risco
- Baixo/baixo-medio: nenhum candidato novo e realmente pequeno o suficiente.
- Medio: `prestFiltrarLista`
- Medio-alto: `prestRender`, `prestSelecionarLinha`, `prestAcoesPlaceholder`
- Alto: `prestCarregar`, `prestEnsureUI`, `prestAbrir`

## Recomendacao de continuidade
Nao ha, nesta leitura, novo candidato pequeno e seguro o bastante para implementacao minima imediata. A recomendacao e pausar/consolidar a frente `Prestadores` nesta rodada, preservando as extracoes ja validadas (`prestFmtCodigo`, `prestStatusHtml`, `prestSelecionado`) e evitando avancar para funcoes de renderizacao, selecao visual, carga remota ou orquestracao de UI.

## Justificativa
O restante do bloco e dominado por DOM, selecao visual, carregamento, estado global e feedback textual. Isso amplia demais o risco para o padrao de extracao minima controlada usado nesta fase.

## O que nao deve ser extraido agora
- `prestRender`
- `prestSelecionarLinha`
- `prestCarregar`
- `prestEnsureUI`
- `prestAbrir`
- `prestAcoesPlaceholder`
- `prestFiltrarLista`
- qualquer trecho de DOM, renderizacao, requestJson, payload, selecao visual ou abertura de tela

## Riscos remanescentes
- O modulo de Prestadores continua parcial.
- A maior parte da tela ainda vive em `frontend/app.js`.
- Qualquer nova extracao sem novo contrato pode misturar selecao visual, carregamento e renderizacao.

## Pendencias futuras
- Se a frente for retomada, iniciar por nova comparacao documental, nao por implementacao direta.
- Reavaliar se algum bloco pequeno pode ser isolado em outro ciclo, mas somente com contrato claro.
- Registrar qualquer mojibake/texto quebrado apenas como pendencia documental futura.

## Proxima subetapa recomendada
`Prestadores - Subetapa 4 - Fechamento documental da frente e consolidacao da pausa`, ou, se o projeto exigir nova continuidade, uma reavaliacao comparativa documental antes de qualquer implementacao.

## Blindagem textual/mojibake
Nesta reavaliacao nenhuma string visivel foi corrigida. Qualquer texto quebrado ou mojibake existente permanece apenas como pendencia documental futura, sem ajuste nesta rodada.
