# Fase 2 - Preferencias / Configuracoes comuns - Contrato funcional e fronteiras para o proximo recorte medio controlado

## Objetivo

Retomar `Preferencias / Configuracoes comuns` apenas em modo documental para definir o contrato funcional e as fronteiras do proximo possivel recorte de risco medio controlado, sem alterar codigo.

## Contexto pos-Prestadores

A selecao documental anterior apos a validacao de `prestFiltrarLista` concluiu que a melhor proxima frente documental ainda e `Preferencias / Configuracoes comuns`, sem implementar nada nesta rodada.

O estado atual de `Prestadores` permanece consolidado:

- helpers extraidos e validados: `prestFmtCodigo`, `prestStatusHtml`, `prestSelecionado`, `prestFiltrarLista`;
- frente consolidada apos o primeiro recorte medio controlado validado;
- sem novas implementacoes nesta rodada;
- recomendacao anterior: nova selecao documental antes de qualquer novo recorte.

## Estado atual do modulo de Preferencias

O arquivo [frontend/js/modules/preferencias-opcoes-sistema.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/js/modules/preferencias-opcoes-sistema.js):

- existe;
- permanece passivo;
- e carregado antes de [frontend/app.js](D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/frontend/app.js);
- expõe `window.BranaPreferenciasOpcoesSistemaModule`;
- continua parcial;
- nao contem DOM;
- nao contem `requestJson`;
- nao contem payload;
- nao contem salvamento;
- nao contem endpoints;
- nao contem permissoes;
- mantem fallback/duplicidade controlada com `frontend/app.js`.

## Helpers ja extraidos e validados

- `prefAmbEstiloPadrao`
- `prefValoresPadraoDados`
- `prefValoresPadraoOdontograma`
- `prefAmbienteTextoExemplo`
- `prefAmbienteDialogoValor`
- `prefAmbienteEstiloDeDialogo`

## Remanescentes reavaliados

### `prefContextoPadrao`
- Tipo: helper de contexto.
- Dependencias: `sessaoAtual`.
- Usa DOM: nao.
- Usa `window/document`: nao.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Envolve backend/banco/schema/migrations/seeds: nao diretamente.
- Altera texto visivel: nao.
- Altera abas: nao.
- Altera preview: nao.
- Altera renderizacao: nao.
- Depende de contexto/clinica/user_id: sim.
- Impacto visual: baixo.
- Ganho estimado no `frontend/app.js`: medio.
- Teste manual futuro: abrir preferencias a partir de contexto de usuario.
- Risco: medio.
- Aceitavel como contrato agora: nao como primeira opcao.

### `prefResolverContexto`
- Tipo: helper de contexto/normalizacao.
- Dependencias: `user`, `origin`, `prefContextoPadrao`.
- Usa DOM: nao.
- Usa `window/document`: nao.
- Usa estado global: sim, por fallback.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Envolve backend/banco/schema/migrations/seeds: nao diretamente.
- Altera texto visivel: nao.
- Altera abas: nao.
- Altera preview: nao.
- Altera renderizacao: nao.
- Depende de contexto/clinica/user_id: sim.
- Impacto visual: baixo.
- Ganho estimado no `frontend/app.js`: medio.
- Teste manual futuro: abrir preferencias para usuario selecionado e confirmar titulo/contexto.
- Risco: medio.
- Aceitavel como contrato agora: nao como primeira opcao.

### `prefContextoAtual`
- Tipo: consulta de contexto.
- Dependencias: `prefCfg`.
- Usa DOM: nao diretamente.
- Usa `window/document`: nao.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Envolve backend/banco/schema/migrations/seeds: nao diretamente.
- Altera texto visivel: nao.
- Altera abas: nao.
- Altera preview: nao.
- Altera renderizacao: nao.
- Depende de contexto/clinica/user_id: sim, de forma indireta.
- Impacto visual: baixo.
- Ganho estimado no `frontend/app.js`: baixo/medio.
- Teste manual futuro: fluxo de abertura/salvamento de preferencias.
- Risco: medio.
- Aceitavel como contrato agora: nao como primeira opcao.

### `prefAmbienteSecoesAtuais`
- Tipo: helper de merge de estado.
- Dependencias: base de secoes e secoes atuais.
- Usa DOM: nao.
- Usa `window/document`: nao.
- Usa estado global: pode usar no modelo atual, mas pode ser explicitado.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao diretamente.
- Envolve permissões: nao.
- Envolve backend/banco/schema/migrations/seeds: nao.
- Altera texto visivel: nao diretamente.
- Altera abas: nao.
- Altera preview: sim, por alimentar o estado do ambiente.
- Altera renderizacao: nao diretamente.
- Depende de contexto/clinica/user_id: nao.
- Impacto visual: medio.
- Ganho estimado no `frontend/app.js`: medio.
- Teste manual futuro: aba `Ambiente`, dialogo de fonte e preview do estilo.
- Risco: medio controlado.
- Aceitavel como contrato agora: **sim, e o melhor candidato desta rodada**.

### `prefAmbienteSecaoAtiva`
- Tipo: helper de selecao de secao.
- Dependencias: estado atual e opcoes de ambiente.
- Usa DOM: nao diretamente.
- Usa `window/document`: nao.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Envolve backend/banco/schema/migrations/seeds: nao.
- Altera texto visivel: nao diretamente.
- Altera abas: nao.
- Altera preview: sim, indiretamente.
- Altera renderizacao: nao.
- Depende de contexto/clinica/user_id: nao.
- Impacto visual: medio.
- Ganho estimado no `frontend/app.js`: medio.
- Teste manual futuro: alternar seccao no ambiente e validar preview.
- Risco: medio.
- Aceitavel como contrato agora: talvez, mas menos claro que `prefAmbienteSecoesAtuais`.

### `prefAmbienteEstiloAtual`
- Tipo: agregador de estado.
- Dependencias: `prefAmbienteSecoesAtuais`, `prefAmbienteSecaoAtiva`, `prefAmbEstiloPadrao`.
- Usa DOM: nao.
- Usa `window/document`: nao.
- Usa estado global: sim, de forma indireta.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Envolve backend/banco/schema/migrations/seeds: nao.
- Altera texto visivel: nao diretamente.
- Altera abas: nao.
- Altera preview: sim.
- Altera renderizacao: nao.
- Depende de contexto/clinica/user_id: nao.
- Impacto visual: medio.
- Ganho estimado no `frontend/app.js`: medio.
- Teste manual futuro: abrir dialogo de fonte e conferir estilo atual.
- Risco: medio.
- Aceitavel como contrato agora: nao como primeira escolha.

### `prefAtualizarTitulo`
- Tipo: DOM / texto visivel.
- Dependencias: `prefCfg`, `prefTituloAtual`.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: nao.
- Altera preview: nao.
- Altera renderizacao: nao.
- Risco: medio-alto.
- Aceitavel como contrato agora: nao.

### `prefRenderCombos`
- Tipo: renderizacao visual.
- Dependencias: `prefCfg`, options de geral.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao diretamente.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: nao.
- Altera preview: nao diretamente.
- Altera renderizacao: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `prefRenderCombosModelos`
- Tipo: renderizacao visual.
- Dependencias: `prefCfg`, options de modelos.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao diretamente.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: nao.
- Altera preview: nao diretamente.
- Altera renderizacao: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `prefRenderCombosDados`
- Tipo: renderizacao visual.
- Dependencias: `prefCfg`, campo UF.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: nao.
- Altera preview: nao diretamente.
- Altera renderizacao: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `prefAbrirDialogoFonteAmbiente`
- Tipo: fluxo visual / dialogo.
- Dependencias: `prefAmbienteSecaoAtiva`, `prefAmbienteSecoesAtuais`, `prefAmbienteDialogoValor`, `prefAmbienteTextoExemplo`, `prefAmbienteEstiloDeDialogo`, `prefSincronizarUI`.
- Usa DOM: sim, de forma indireta.
- Usa `window/document`: sim, por dialogo e preview.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao diretamente.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: nao.
- Altera preview: sim.
- Altera renderizacao: sim, indiretamente.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `usersAbrirPreferencias`
- Tipo: evento / fluxo de abertura.
- Dependencias: usuario selecionado e `prefAbrir`.
- Usa DOM: sim, de forma indireta.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: sim, no fluxo de acesso/gestao de usuarios.
- Altera texto visivel: sim, por abertura da tela.
- Altera abas: sim, indiretamente.
- Altera preview: nao.
- Altera renderizacao: sim, indiretamente.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `prefSelecionarAba`
- Tipo: fluxo visual / abas.
- Dependencias: `prefCfg`, `footerMsg`.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: sim.
- Altera preview: sim, indiretamente.
- Altera renderizacao: sim.
- Risco: medio-alto.
- Aceitavel como contrato agora: nao.

### `prefRenderListaAmbiente`
- Tipo: renderizacao visual / lista de secoes.
- Dependencias: `prefCfg`, secoes de ambiente.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: sim, indiretamente.
- Altera preview: sim, por troca de secao.
- Altera renderizacao: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `prefAplicarPreviewAmbiente`
- Tipo: renderizacao/preview.
- Dependencias: `prefCfg`, estilos do ambiente, helpers de preview.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: nao.
- Altera preview: sim.
- Altera renderizacao: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `prefRebuildAmbientePreview`
- Tipo: orquestracao visual.
- Dependencias: helpers de preview e estado do ambiente.
- Usa DOM: sim, indiretamente.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: nao.
- Altera preview: sim.
- Altera renderizacao: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `prefOdontoEnsureColorDropdowns`
- Tipo: renderizacao / dropdowns.
- Dependencias: estado de odontograma.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: nao.
- Altera preview: nao diretamente.
- Altera renderizacao: sim.
- Risco: medio-alto.
- Aceitavel como contrato agora: nao.

### `prefSincronizarUI`
- Tipo: orquestracao visual.
- Dependencias: muitos helpers e `prefCfg`.
- Usa DOM: sim.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: sim, indiretamente.
- Altera preview: sim.
- Altera renderizacao: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `prefEnsureUI`
- Tipo: inicializacao / montagem da UI.
- Dependencias: DOM e estrutura de tela.
- Usa DOM: sim.
- Usa `window/document`: sim.
- Usa estado global: sim.
- Usa `requestJson`: nao.
- Monta payload: nao.
- Envolve salvamento: nao.
- Envolve permissões: nao.
- Altera texto visivel: sim.
- Altera abas: sim.
- Altera preview: sim.
- Altera renderizacao: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `prefColetarPayload*`
- Tipo: montagem de payload.
- Dependencias: `prefCfg`, contexto, campos da UI.
- Usa DOM: sim, para ler campos.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: nao diretamente, mas prepara uso.
- Monta payload: sim.
- Envolve salvamento: sim, por consequencia.
- Envolve permissões: nao diretamente.
- Envolve backend/banco/schema/migrations/seeds: sim, via patches de preferencias.
- Altera texto visivel: nao diretamente.
- Altera abas: nao.
- Altera preview: nao.
- Altera renderizacao: nao.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `prefCarregarDados`
- Tipo: integracao / carga.
- Dependencias: `requestJson`, contexto, defaults e UI.
- Usa DOM: sim, indiretamente.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: sim.
- Monta payload: nao diretamente.
- Envolve salvamento: nao.
- Envolve permissões: nao diretamente.
- Envolve backend/banco/schema/migrations/seeds: sim.
- Altera texto visivel: sim, por mensagens e carregamento.
- Altera abas: sim, indiretamente.
- Altera preview: sim.
- Altera renderizacao: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `prefSalvar*`
- Tipo: salvamento.
- Dependencias: `requestJson`, payloads, contexto e UI.
- Usa DOM: sim, indiretamente.
- Usa `window/document`: sim, indireto.
- Usa estado global: sim.
- Usa `requestJson`: sim.
- Monta payload: sim.
- Envolve salvamento: sim.
- Envolve permissões: nao diretamente, mas opera sobre preferencias do usuario.
- Envolve backend/banco/schema/migrations/seeds: sim.
- Altera texto visivel: sim, via status e mensagens.
- Altera abas: sim, indiretamente.
- Altera preview: sim, por sincronizacao posterior.
- Altera renderizacao: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `sysOptColetarPayload`
- Tipo: coleta de payload.
- Dependencias: DOM, contexto e formulario de configuracoes.
- Usa `requestJson`: nao diretamente.
- Monta payload: sim.
- Envolve salvamento: sim, por uso posterior.
- Envolve backend/banco/schema/migrations/seeds: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `sysOptCarregar`
- Tipo: integracao.
- Dependencias: `requestJson`, UI e estado de sistema.
- Usa DOM: sim.
- Usa `requestJson`: sim.
- Monta payload: nao.
- Envolve salvamento: nao diretamente.
- Envolve backend/banco/schema/migrations/seeds: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `sysOptSalvar`
- Tipo: salvamento.
- Dependencias: payload, UI, `requestJson`.
- Usa DOM: sim.
- Usa `requestJson`: sim.
- Monta payload: sim.
- Envolve salvamento: sim.
- Envolve backend/banco/schema/migrations/seeds: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

### `sysOptEnsureUI`
- Tipo: orquestracao visual / montagem de UI.
- Dependencias: DOM, estrutura de tela e eventos.
- Usa DOM: sim.
- Usa `requestJson`: nao diretamente.
- Envolve salvamento: nao diretamente.
- Envolve permissões: nao diretamente.
- Altera texto visivel: sim.
- Altera abas: sim.
- Altera preview: sim, indiretamente.
- Altera renderizacao: sim.
- Risco: alto.
- Aceitavel como contrato agora: nao.

## Matriz comparativa resumida

| Candidato | Tipo | DOM | requestJson | Payload | Salvamento | Aba/Preview | Risco | Aceitavel como proximo contrato? |
|---|---|---|---|---|---|---|---|---|
| `prefAmbienteSecoesAtuais` | Merge de estado | Nao | Nao | Nao | Nao | Preview sim | Medio controlado | **Sim** |
| `prefAmbienteSecaoAtiva` | Selecao de contexto | Nao | Nao | Nao | Nao | Aba/preview indireto | Medio | Possivel, mas secundario |
| `prefContextoPadrao` | Contexto de sessao | Nao | Nao | Nao | Nao | Nao | Medio | Nao como primeira escolha |
| `prefResolverContexto` | Normalizacao de contexto | Nao | Nao | Nao | Nao | Nao | Medio | Nao como primeira escolha |
| `prefContextoAtual` | Consulta de estado | Nao direto | Nao | Nao | Nao | Nao | Medio | Nao |
| `prefAtualizarTitulo` | DOM/texto | Sim | Nao | Nao | Nao | Nao | Medio-alto | Nao |
| `prefRenderCombos*` | Renderizacao | Sim | Nao | Nao | Nao | Sim | Alto | Nao |
| `prefAbrirDialogoFonteAmbiente` | Dialogo/orquestracao | Sim | Nao | Nao | Nao | Sim | Alto | Nao |
| `usersAbrirPreferencias` | Evento/fluxo | Sim | Nao | Nao | Nao | Sim | Alto | Nao |
| `prefCarregarDados` | Integracao/carga | Sim indireto | Sim | Nao | Nao | Sim | Alto | Nao |
| `prefSalvar*` | Salvamento | Sim indireto | Sim | Sim | Sim | Sim | Alto | Nao |
| `sysOpt*` | Integracao/salvamento | Sim/indireto | Sim | Sim | Sim | Sim | Alto | Nao |

## Recomendacao

**A. Recomendar um candidato especifico de Preferencias / Configuracoes comuns para contrato detalhado de recorte medio controlado.**

### Candidato recomendado

`prefAmbienteSecoesAtuais`

### Justificativa

- e o melhor equilibrio entre seguranca e ganho real nesta frente;
- nao usa `requestJson`;
- nao monta payload;
- nao salva;
- nao mexe em permissoes;
- nao depende de backend/banco/schema/migrations/seeds;
- pode receber parametros explicitamente na implementacao futura;
- ajuda a separar regra/estado do restante da UI de ambiente;
- tem teste manual simples e claro na aba `Ambiente`.

### Por que nao e trabalho pesado amplo

- o contrato proposto e apenas um helper de merge de estado;
- a interface continua no `frontend/app.js`;
- a extracao futura pode permanecer pequena e com fallback local;
- nao e uma reescrita do modulo inteiro nem do fluxo de preferencias.

### Limites que nao podem ser ultrapassados

- nao implementar nada nesta rodada;
- nao misturar com salvamento ou `requestJson`;
- nao mover DOM/renderizacao ou abas para o helper;
- nao alterar backend, banco ou permissoes;
- nao corrigir textos visiveis ou mojibake;
- nao reabrir `Agenda de contatos`;
- nao retomar `Agenda principal` nesta rodada;
- nao voltar a `Prestadores` para implementacao imediata.

## Proxima subetapa recomendada

`Preferencias / Configuracoes comuns - Contrato detalhado de prefAmbienteSecoesAtuais como recorte medio controlado`

## Riscos remanescentes

- o modulo passivo continua parcial;
- a duplicidade controlada com `frontend/app.js` continua existindo;
- os helpers de contexto e UI restantes ainda podem subir para risco medio-alto ou alto;
- `prefAmbienteSecoesAtuais` ainda precisa de contrato para separacao clara entre estado base e estado atual.

## Pendencias futuras

- definir os parametros explicitos do helper recomendado;
- manter a validacao manual futura na aba `Ambiente`;
- registrar qualquer mojibake/texto quebrado apenas como pendencia documental futura.

## Registro de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada nesta etapa. Nenhuma string visivel foi corrigida ou reescrita como parte desta selecao documental.
