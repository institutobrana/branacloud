# Fase 2B - Preferencias remanescentes - Contrato profundo do primeiro recorte medio controlado

- Data: 26/05/2026
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- Referencias obrigatorias:
  - `docs/fase_2b_organizacao_recortes_medios_controlados.md`
  - `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## 1. Escopo da etapa

- Esta etapa e exclusivamente documental.
- Nenhuma implementacao foi feita agora.
- Nenhum recorte foi aplicado ainda.
- Nenhum helper foi criado, movido ou renomeado.
- Nenhum fluxo de salvamento foi alterado.
- O objetivo e preparar uma futura subetapa de implementacao segura, com fronteira menor e rollback mental simples.
- O foco desta auditoria e `Preferencias / Configuracoes remanescentes`, tratado aqui como modulo comum/core do sistema, e nao como area profissional especifica.

## 2. Mapa das funcoes atuais

### 2.1. Ponto de entrada e roteamento

- `usersAbrirPreferencias()` em `frontend/app.js:12048`
  - Abre o fluxo de preferencias a partir do painel de usuarios.
  - Apenas valida selecao e chama `prefAbrir({ targetUser, origin: "usuarios" })`.
- `executarAcaoMenu()` / bloco de rotas em `frontend/app.js:22231` e `frontend/app.js:22239`
  - `config-preferencias` chama `prefAbrir()`.
  - `config-opcoes-sistema` chama `sysOptAbrir()`.
- `menuActionModule()` e `menuActionAccessLevel()` em `frontend/app.js:21972` e `frontend/app.js:21975`
  - Classificam ambos os pontos como `configuracao`.
  - Servem como gate de acesso, sem alterar o comportamento do fluxo.
- `closeModalByBackdropId()` e `modalTitleByBackdropId()` em `frontend/app.js:614` e `frontend/app.js:615`
  - Registram `config-preferencias-backdrop` e `config-opcoes-sistema-backdrop`.
  - Sao infraestruturas globais de modal e devem ser tratadas como area delicada.

### 2.2. Fluxo de Preferencias remanescentes (`pref*`)

- Contexto/base:
  - `prefContextoPadrao()`
  - `prefResolverContexto(user, origin)`
  - `prefContextoAtual()`
  - `prefTituloAtual()`
- Valores padrao e helpers puros:
  - `prefValoresPadrao()`
  - `prefValoresPadraoModelos()`
  - `prefAmbEstiloPadrao()`
  - `prefValoresPadraoAmbiente()`
  - `prefValoresPadraoDados()`
  - `prefValoresPadraoOdontograma()`
- Renderizacao e montagem visual:
  - `prefAtualizarTitulo()`
  - `prefSelecionarAba(tabId)`
  - `prefRenderCombos()`
  - `prefRenderCombosModelos()`
  - `prefRenderCombosDados()`
  - `prefRenderListaAmbiente()`
  - `prefAplicarEstiloAmbiente(el, style)`
  - `prefAplicarPreviewAmbiente()`
  - `prefEnsureAmbienteOverrides()`
  - `prefRebuildAmbientePreview()`
  - `prefRenderCombosAmbiente()`
  - `prefRenderCombosOdontograma()`
  - `prefOdontoEnsureColorDropdowns()`
  - `prefOdontoRenderList(...)`
  - `prefOdontoCloseLists(...)`
- Montagem de dialogo e abertura:
  - `prefAbrirDialogoFonteAmbiente()`
  - `prefEnsureUI()`
  - `prefAbrir(opts)`
- Leitura de DOM e escrita em DOM:
  - Todas as rotinas `prefRender*`, `prefAplicar*`, `prefColetarPayload*` e `prefSalvar*`
  - Atualizam `textContent`, `value`, `checked`, `classList`, `innerHTML` e estilos inline
- Persistencia/salvamento:
  - `prefColetarPayload()`
  - `prefColetarPayloadModelos()`
  - `prefColetarPayloadAmbiente()`
  - `prefColetarPayloadDados()`
  - `prefColetarPayloadOdontograma()`
  - `prefCarregarDados()`
  - `prefSalvarGeral()`
  - `prefSalvarModelos()`
  - `prefSalvarAmbiente()`
  - `prefSalvarDados()`
  - `prefSalvarOdontograma()`

### 2.3. Fluxo de Opcoes do sistema (`sysOpt*`)

- Montagem e abertura:
  - `sysOptEnsureUI()`
  - `sysOptAbrir()`
  - `sysOptFechar()`
- Navegacao e renderizacao:
  - `sysOptSelecionarAba(tabId)`
  - `sysOptRenderSelects()`
  - `sysOptSyncUI()`
- Persistencia:
  - `sysOptColetarPayload()`
  - `sysOptCarregar()`
  - `sysOptSalvar()`
- Interacao sensivel:
  - `sysOptCfg.btnSegPermissoes`
    - Abre a configuracao de permissoes de usuarios.
    - Nao deve ser movido nem redesenhado nesta etapa.
  - `sysOptCfg.chkAvDebug`
    - Participa do debug do editor de textos em `editorTextosParagrafoDebugAtivo()`.
    - E um ponto perigoso para qualquer alteracao futura.

### 2.4. Modulo passivo existente em `frontend/js/modules`

- Existe o arquivo `frontend/js/modules/preferencias-opcoes-sistema.js`.
- Ele e passivo e exporta apenas helpers puros e defaults:
  - `prefOdontoNorm`
  - `prefValoresPadraoModelos`
  - `prefValoresPadraoDados`
  - `prefValoresPadraoOdontograma`
  - `prefAmbEstiloPadrao`
  - `prefAmbienteDialogoValor`
  - `prefAmbienteEstiloDeDialogo`
  - `prefAmbienteTextoExemplo`
  - `prefAmbienteSecoesAtuais`
  - `prefOdontoFindByLabel`
- Nenhum outro modulo especifico de Preferencias/Configuracoes remanescentes foi identificado em `frontend/js/modules` durante esta leitura.

## 3. Mapa de DOM

### 3.1. DOM principal de Preferencias

- Backdrop e chrome:
  - `#config-preferencias-backdrop`
  - `.pref-modal`
  - `.pref-tabs`
  - `.pref-tab`
  - `.pref-pane`
  - `.pref-footer`
- Abas e areas:
  - `data-tab="geral"`
  - `data-tab="modelos"`
  - `data-tab="ambiente"`
  - `data-tab="dados"`
  - `data-tab="odontograma"`
- Campos principais:
  - `#pref-geral-pesquisa`
  - `#pref-geral-tabela`
  - `#pref-geral-convenio`
  - `#pref-geral-msg`
  - `#pref-geral-historico`
  - `#pref-geral-quadro`
  - `#pref-geral-busca`
  - `#pref-geral-alarme`
  - `#pref-geral-alarme-min`
  - `#pref-modelo-atestado`
  - `#pref-modelo-receita`
  - `#pref-modelo-recibo`
  - `#pref-modelo-etiqueta`
  - `#pref-modelo-email`
  - `#pref-modelo-orcamento`
  - `#pref-modelo-whatsapp`
  - `#pref-amb-lista`
  - `#pref-amb-alterar`
  - `#pref-amb-restaurar`
  - `#pref-ambiente-fonte`
  - `#pref-ambiente-tamanho`
  - `#pref-ambiente-cor`
  - `#pref-dados-nome`
  - `#pref-dados-apelido`
  - `#pref-dados-email`
  - `#pref-dados-endereco`
  - `#pref-dados-bairro`
  - `#pref-dados-cidade`
  - `#pref-dados-cep`
  - `#pref-dados-uf`
  - `#pref-dados-pais`
  - `#pref-dados-telefones`
  - `#pref-dados-cro`
  - `#pref-dados-cpf`
  - `#pref-odonto-especialidade`
  - `#pref-odonto-filtro`
  - `#pref-odonto-anamnese`
  - `#pref-odonto-icones`
  - `#pref-odonto-imagens`
  - `#pref-odonto-cirurgiao`
  - `#pref-odonto-historico-desc`
  - `#pref-odonto-dados-paciente`
  - `#pref-odonto-dados-tratamento`
  - `#pref-odonto-observacoes`
  - `#pref-odonto-documentos`
  - `#pref-odonto-agenda-dia`
  - `#pref-odonto-cor-realizar`
  - `#pref-odonto-cor-realizado`
  - `#pref-odonto-cor-observada`
  - `#pref-odonto-cor-anomalia`
  - `#pref-odonto-hint`
  - `#pref-btn-ok`
  - `#pref-btn-cancel`

### 3.2. DOM dinamico e visual do preview

- `#pref-amb-example`
- `#pref-amb-enunciado`
- `#pref-amb-campo-label`
- `#pref-amb-campo-input`
- `#pref-amb-botao-funcao`
- `#pref-amb-lista-1`
- `#pref-amb-lista-2`
- `#pref-amb-lista-3`
- `#pref-amb-lista-4`
- `.pref-amb-choice`
- `.pref-amb-list-item`
- `.pref-odonto-color-dropdown`
- `.pref-odonto-color-list`
- `.pref-odonto-color-item`
- `.pref-odonto-color-hidden`
- `.pref-odonto-color-native-hidden`
- `.pref-odonto-hint`

### 3.3. DOM principal de Opcoes do sistema

- Backdrop e chrome:
  - `#config-opcoes-sistema-backdrop`
  - `.sysopt-modal`
  - `.sysopt-tabs`
  - `.sysopt-tab`
  - `.sysopt-pane`
- Campos e controles principais:
  - blocos de clinica, financeiro, seguranca, data e avanco tecnico montados em `sysOptCfg`
  - `sysOptCfg.btnSegPermissoes`
  - `sysOptCfg.chkAvDebug`
  - `sysOptCfg.btnOk`
  - `sysOptCfg.btnCancel`

### 3.4. DOM apenas visual

- `#pref-amb-example`
- `#pref-amb-lista-1`
- `#pref-amb-lista-2`
- `#pref-amb-lista-3`
- `#pref-amb-lista-4`
- `.pref-odonto-color-list`
- `.pref-odonto-color-item`
- qualquer estilo injetado por `prefEnsureAmbienteOverrides()`
- qualquer estilo injetado por `prefOdontoEnsureColorDropdowns()`

### 3.5. DOM que dispara eventos

- `.pref-tab`
- `#pref-amb-alterar`
- `#pref-amb-restaurar`
- `#pref-btn-ok`
- `#pref-btn-cancel`
- `#pref-geral-alarme`
- `#pref-amb-lista [data-secao]`
- `.pref-odonto-color-item`
- `#config-opcoes-sistema-backdrop .sysopt-tab`
- `sysOptCfg.btnSegPermissoes`
- `sysOptCfg.btnOk`
- `sysOptCfg.btnCancel`

### 3.6. DOM que participa de salvamento

- Todos os campos da aba Geral:
  - `#pref-geral-*`
- Todos os campos da aba Modelos:
  - `#pref-modelo-*`
- Todos os campos da aba Ambiente:
  - `#pref-amb-*`
- Todos os campos da aba Dados do usuario:
  - `#pref-dados-*`
- Todos os campos da aba Odontograma:
  - `#pref-odonto-*`
- Todos os campos do painel `sysOptCfg`

### 3.7. DOM que participa de carregamento de dados

- Os mesmos campos listados acima, pois sao preenchidos por `prefCarregarDados()` e `sysOptCarregar()`.

### 3.8. DOM perigoso de alterar

- `#config-preferencias-backdrop`
- `#config-opcoes-sistema-backdrop`
- `.pref-modal`
- `.sysopt-modal`
- `.pref-tab`
- `.sysopt-tab`
- `#pref-odonto-*` por causa do dropdown customizado e do fechamento global de listas
- `sysOptCfg.chkAvDebug`
- `sysOptCfg.btnSegPermissoes`
- qualquer seletor usado por `closeModalByBackdropId()` e `modalTitleByBackdropId()`

## 4. Mapa de eventos

### 4.1. Eventos apenas visuais

- Clique nas tabs da modal de preferencias:
  - chama `prefSelecionarAba(tabId)`
- Clique nos itens da lista de ambiente:
  - atualiza `secao_ativa` em memoria e chama `prefSincronizarUI()`
- Clique nos itens do dropdown de cores odontogramas:
  - atualiza somente a visualizacao local
- Clique nas tabs de opcoes do sistema:
  - chama `sysOptSelecionarAba(tabId)`

### 4.2. Eventos com efeito local

- `#pref-amb-alterar`
  - abre `easyFontAbrir(...)`
  - altera apenas a visualizacao local da secao ativa
- `#pref-amb-restaurar`
  - restaura somente a secao visual ativa para o padrao
- `#pref-geral-alarme`
  - habilita/desabilita `#pref-geral-alarme-min`
- `document.addEventListener("click", ... prefOdontoCloseLists())`
  - fecha listas visuais de cor sem salvar nada
- `#pref-btn-cancel`
  - apenas oculta a modal
- `#config-opcoes-sistema-backdrop .sysopt-tab`
  - troca de aba na modal
- `sysOptCfg.btnSegPermissoes`
  - abre o painel de usuarios para ajustar permissoes

### 4.3. Eventos que disparam `requestJson`

- `#pref-btn-ok`
  - chama `prefSalvarGeral()`, `prefSalvarModelos()`, `prefSalvarAmbiente()`, `prefSalvarDados()` ou `prefSalvarOdontograma()` conforme a aba ativa
- `sysOptCfg.btnOk`
  - chama `sysOptSalvar()`
- `prefAbrir()`
  - dispara `prefCarregarDados()`
- `sysOptAbrir()`
  - dispara `sysOptCarregar()`
- `usersAbrirPreferencias()`
  - dispara a abertura do modal de preferencias e, por tabela, os GETs de carregamento

### 4.4. Eventos que salvam dados

- `prefSalvarGeral()`
- `prefSalvarModelos()`
- `prefSalvarAmbiente()`
- `prefSalvarDados()`
- `prefSalvarOdontograma()`
- `sysOptSalvar()`

### 4.5. Eventos que afetam outras telas

- `prefSalvarDados()`
  - atualiza `sessaoAtual.nome` e `sessaoAtual.apelido` quando o usuario salvo e o usuario logado sao o mesmo
- `sysOptCfg.btnSegPermissoes`
  - abre a tela de permissoes do painel de usuarios
- `sysOptCfg.chkAvDebug`
  - altera comportamento de debug do editor de textos em outro modulo
- `usersAbrirPreferencias()`
  - sai do painel de usuarios e entra no fluxo de preferencias

### 4.6. Inicializacoes e listeners de carregamento

- `prefEnsureUI()`
  - cria estilo, DOM e listeners da modal de preferencias
- `sysOptEnsureUI()`
  - cria estilo, DOM e listeners da modal de opcoes do sistema
- `prefRebuildAmbientePreview()`
  - monta a area visual de preview na hora da construcao da UI
- `prefOdontoEnsureColorDropdowns()`
  - monta os dropdowns customizados de cor
- `backdrop.addEventListener("click", ...)`
  - em ambas as modais, fecha quando o clique e no fundo

## 5. Mapa de `requestJson` / payload / salvamento

### 5.1. Preferencias remanescentes

- `prefCarregarDados()`
  - Funcoes chamadoras: `prefAbrir()`
  - Endpoints:
    - `GET /preferences/general`
    - `GET /preferences/models`
    - `GET /preferences/environment`
    - `GET /preferences/user-data`
    - `GET /preferences/odontogram`
  - Metodo: GET
  - Monta payload: nao
  - Altera dados: nao
  - Apenas carrega dados: sim
  - Risco: medio, porque agrega varias leituras e popula estado compartilhado

- `prefSalvarGeral()`
  - Funcoes chamadoras: `#pref-btn-ok` na aba Geral
  - Endpoint: `PATCH /preferences/general`
  - Metodo: PATCH
  - Monta payload: sim, via `prefColetarPayload()`
  - Altera dados: sim
  - Apenas carrega dados: nao
  - Risco: alto, porque persiste configuracao de usuario e atualiza cache local

- `prefSalvarModelos()`
  - Funcoes chamadoras: `#pref-btn-ok` na aba Modelos
  - Endpoint: `PATCH /preferences/models`
  - Metodo: PATCH
  - Monta payload: sim, via `prefColetarPayloadModelos()`
  - Altera dados: sim
  - Risco: alto

- `prefSalvarAmbiente()`
  - Funcoes chamadoras: `#pref-btn-ok` na aba Ambiente
  - Endpoint: `PATCH /preferences/environment`
  - Metodo: PATCH
  - Monta payload: sim, via `prefColetarPayloadAmbiente()`
  - Altera dados: sim
  - Risco: alto, embora o efeito visual pareca local

- `prefSalvarDados()`
  - Funcoes chamadoras: `#pref-btn-ok` na aba Dados do usuario
  - Endpoint: `PATCH /preferences/user-data`
  - Metodo: PATCH
  - Monta payload: sim, via `prefColetarPayloadDados()`
  - Altera dados: sim
  - Altera sessao logada: sim, se o usuario salvo for o mesmo da sessao
  - Risco: alto

- `prefSalvarOdontograma()`
  - Funcoes chamadoras: `#pref-btn-ok` na aba Odontograma
  - Endpoint: `PATCH /preferences/odontogram`
  - Metodo: PATCH
  - Monta payload: sim, via `prefColetarPayloadOdontograma()`
  - Altera dados: sim
  - Risco: alto, porque ja carrega hint de integracao futura

### 5.2. Opcoes do sistema

- `sysOptCarregar()`
  - Funcoes chamadoras: `sysOptAbrir()`
  - Endpoint: `GET /system-options`
  - Metodo: GET
  - Monta payload: nao
  - Altera dados: nao
  - Apenas carrega dados: sim
  - Risco: medio-alto, porque retorna configuracao global

- `sysOptSalvar()`
  - Funcoes chamadoras: `#sysopt-btn-ok`
  - Endpoint: `PATCH /system-options`
  - Metodo: PATCH
  - Monta payload: sim, via `sysOptColetarPayload()`
  - Altera dados: sim
  - Risco: alto, porque o payload mistura clinica, financeiro, seguranca, data/hora e avanco tecnico

### 5.3. Bloqueios documentais

- Nenhuma dessas chamadas deve ser alterada nesta etapa.
- Nenhum payload deve ser reescrito.
- Nenhum endpoint deve ser trocado.
- Nenhuma regiao de salvamento deve ser expandida.

## 6. Mapa de backend / endpoints / permissoes

- `prefCarregarDados()` e `prefSalvar*()` se conectam a endpoints de preferencias por usuario.
- `sysOptCarregar()` e `sysOptSalvar()` se conectam a `/system-options`, que e configuracao global do sistema.
- `executarAcaoMenu("config-preferencias")` depende do fluxo de permissao do menu `configuracao`.
- `executarAcaoMenu("config-opcoes-sistema")` exige `sessaoAtual?.is_admin`.
- `sysOptCfg.btnSegPermissoes` abre o painel de usuarios e conversa indiretamente com permissoes.
- `sysOptCfg.chkAvDebug` altera comportamento de debug do editor de textos.
- `prefSalvarDados()` pode atualizar a sessao logada, logo encosta em dados de usuario.
- Nenhum backend, banco, migration, schema, permission matrix ou endpoint deve ser modificado nesta fase.

## 7. Separacao entre o que pode sair do `app.js` e o que deve ficar

### 7.1. Partes candidatas a sair futuramente do `app.js`

- Helpers puros de defaults:
  - `prefValoresPadraoModelos()`
  - `prefValoresPadraoDados()`
  - `prefValoresPadraoOdontograma()`
  - `prefAmbEstiloPadrao()`
  - parte dos helpers `prefAmbiente*` e `prefOdonto*` que ja sao passivos
- Visualizacao local da aba Ambiente:
  - `prefEnsureAmbienteOverrides()`
  - `prefRebuildAmbientePreview()`
  - `prefRenderListaAmbiente()`
  - `prefAplicarPreviewAmbiente()`
  - `prefAplicarEstiloAmbiente(...)`
- Parte do dropdown visual de cores odontograma:
  - `prefOdontoEnsureColorDropdowns()`
  - `prefOdontoRenderList(...)`
  - `prefOdontoCloseLists(...)`

### 7.2. Partes que devem ficar no `app.js` nesta fase

- `prefCarregarDados()`
- `prefSalvarGeral()`
- `prefSalvarModelos()`
- `prefSalvarAmbiente()`
- `prefSalvarDados()`
- `prefSalvarOdontograma()`
- `sysOptCarregar()`
- `sysOptSalvar()`
- `prefEnsureUI()`
- `sysOptEnsureUI()`
- `prefAbrir()`
- `sysOptAbrir()`
- `prefAbrirDialogoFonteAmbiente()`
- `usersAbrirPreferencias()`
- roteamento de menu, listeners, fechamento de modal e atualizacao de titulo

### 7.3. Partes que so poderiam sair em Fase 3

- Qualquer alteracao que mova `requestJson` ou contratos de endpoint.
- Qualquer reestruturacao que altere o payload efetivo ou o destino de salvamento.
- Qualquer particionamento de backend, permissao, schema ou contract de dados.
- Qualquer mudanca que force novo fluxo de persistencia global.

### 7.4. Partes proibidas na Fase 2B

- Backend.
- Banco.
- Endpoints.
- Permissoes.
- Payload efetivo.
- Salvamento.
- Correcao textual.
- Correcao de acentos.
- Correcao de labels.
- Correcao de placeholders.
- Correcao de mensagens de interface.
- Correcao de mojibake.
- Alteracao em `frontend/app.js` fora da futura subetapa aprovada.
- Alteracao em `frontend/index.html`.
- Alteracao em `frontend/js/modules` fora de uma decisao documental futura.

## 8. Recortes medios possiveis

### 8.1. Recorte possivel 1

- Descricao:
  - Extrair somente a montagem e atualizacao do preview visual da aba Ambiente de Preferencias para o modulo passivo existente.
- Funcoes envolvidas:
  - `prefEnsureAmbienteOverrides()`
  - `prefRebuildAmbientePreview()`
  - `prefRenderListaAmbiente()`
  - `prefAplicarPreviewAmbiente()`
  - `prefAplicarEstiloAmbiente(...)`
- DOM envolvido:
  - `#pref-amb-example`
  - `#pref-amb-enunciado`
  - `#pref-amb-campo-label`
  - `#pref-amb-campo-input`
  - `#pref-amb-botao-funcao`
  - `#pref-amb-lista-1` a `#pref-amb-lista-4`
  - `.pref-amb-list-item`
- Eventos envolvidos:
  - clique nas secaoes da lista de ambiente
  - clique em `#pref-amb-alterar`
  - clique em `#pref-amb-restaurar`
- Toca `requestJson`:
  - nao
- Toca payload:
  - nao
- Toca salvamento:
  - nao
- Risco:
  - baixo para medio
- Ganho esperado:
  - reduz o tamanho do bloco visual do `app.js`
  - organiza a aba Ambiente sem mexer em persistencia
- Motivo para aceitar:
  - e local, visual, previsivel e com rollback mental simples

### 8.2. Recorte possivel 2

- Descricao:
  - Extrair a montagem dos dropdowns customizados de cor do odontograma para helper passivo.
- Funcoes envolvidas:
  - `prefOdontoEnsureColorDropdowns()`
  - `prefOdontoRenderList(...)`
  - `prefOdontoCloseLists(...)`
- DOM envolvido:
  - `#pref-odonto-cor-realizar`
  - `#pref-odonto-cor-realizado`
  - `#pref-odonto-cor-observada`
  - `#pref-odonto-cor-anomalia`
  - `.pref-odonto-color-dropdown`
  - `.pref-odonto-color-list`
- Eventos envolvidos:
  - clique em item de cor
  - clique global para fechar lista
- Toca `requestJson`:
  - nao
- Toca payload:
  - nao
- Toca salvamento:
  - nao
- Risco:
  - medio, porque a interacao usa fechamento global de listas
- Ganho esperado:
  - remove logica de dropdown visual do `app.js`
- Motivo para rejeitar como primeiro recorte:
  - maior chance de quebrar interacoes globais e a leitura do estado visual

### 8.3. Recorte possivel 3

- Descricao:
  - Extrair a construcao inteira da modal de Preferencias (`prefEnsureUI`) para um helper modular.
- Funcoes envolvidas:
  - `prefEnsureUI()`
- DOM envolvido:
  - toda a modal `#config-preferencias-backdrop`
- Eventos envolvidos:
  - todos os listeners da modal
- Toca `requestJson`:
  - indiretamente, sim
- Toca payload:
  - indiretamente, sim
- Toca salvamento:
  - indiretamente, sim
- Risco:
  - alto
- Ganho esperado:
  - grande reducao de linhas em `app.js`
- Motivo para rejeitar como primeiro recorte:
  - grande demais para a primeira subetapa da Fase 2B

### 8.4. Recorte possivel 4

- Descricao:
  - Extrair `sysOptEnsureUI()` para helper modular.
- Funcoes envolvidas:
  - `sysOptEnsureUI()`
- DOM envolvido:
  - toda a modal `#config-opcoes-sistema-backdrop`
- Eventos envolvidos:
  - tabs, salvar, fechar e permissao
- Toca `requestJson`:
  - indiretamente, sim
- Toca payload:
  - sim
- Toca salvamento:
  - sim
- Risco:
  - alto
- Ganho esperado:
  - alto, mas com superficie ampla
- Motivo para rejeitar como primeiro recorte:
  - mistura clinica, financeiro, seguranca e debug em uma mesma montagem

## 9. Recomendacao de UM unico recorte medio para futura implementacao

- Recorte recomendado:
  - Extrair a montagem e a atualizacao do preview visual da aba Ambiente de Preferencias para o modulo passivo existente, mantendo em `app.js` apenas a abertura da modal, o carregamento, o salvamento e o roteamento.
- Motivos da escolha:
  - nao toca backend;
  - nao toca banco;
  - nao toca endpoint;
  - nao toca permissoes;
  - nao toca payload efetivo;
  - nao toca salvamento;
  - nao corrige texto;
  - nao corrige mojibake;
  - reduz de forma real o volume de DOM visual em `frontend/app.js`;
  - tem fronteira clara e local;
  - tem rollback mental simples.
- Motivo para manter o resto fora:
  - `prefEnsureUI()` e `sysOptEnsureUI()` ainda sao grandes demais para a primeira subetapa.
  - `requestJson` continua totalmente fora do recorte recomendado.

## 10. Teste manual previsto

- Onde testar:
  - menu `Configuracao` / acao `config-preferencias`
  - painel `Preferencias do usuario`
- Acoes:
  - abrir a modal de preferencias;
  - entrar na aba `Ambiente`;
  - clicar em outra secao da lista;
  - clicar em `Altera letra...`;
  - observar o preview;
  - clicar em `Restaura padroes`;
  - trocar para as abas `Geral`, `Modelos`, `Dados do usuario` e `Odontograma`;
  - fechar sem salvar e reabrir;
  - repetir com um usuario alvo a partir do painel de usuarios, se necessario.
- O que observar:
  - o preview visual continua coerente;
  - o seletor de secao continua trocando o destaque;
  - o dialogo de fonte continua abrindo e retornando o estado visual;
  - o botao de restauracao continua afetando somente a secao ativa;
  - as demais abas continuam iguais.
- O que nao pode quebrar:
  - carregamento dos dados;
  - salvamento por aba;
  - fechamento da modal;
  - abertura a partir do painel de usuarios;
  - atualizacao de `footerMsg`;
  - comportamento de `sysOptCfg` e do painel de opcoes do sistema.
- Comportamentos que devem permanecer identicos:
  - `prefSalvar*` continua usando os mesmos endpoints;
  - `prefCarregarDados()` continua buscando os mesmos recursos;
  - `prefSalvarDados()` continua podendo atualizar a sessao logada;
  - nenhuma label, texto ou placeholder deve mudar.

## 11. Riscos e rollback mental

- Riscos principais:
  - mover demais a logica visual e quebrar referencias de DOM criadas em runtime;
  - duplicar listeners quando o preview for reconstruido;
  - perder a sincronizacao entre secao ativa e preview;
  - interferir acidentalmente no dialogo de fonte do `easyFontAbrir`.
- Como perceber quebra:
  - preview em branco;
  - secao ativa nao muda;
  - restauracao nao reflete na tela;
  - modal abre, mas a aba Ambiente fica sem resposta;
  - listeners passam a executar duas vezes.
- Como isolar o problema:
  - verificar primeiro a aba Ambiente;
  - depois testar a abertura por `usersAbrirPreferencias()`;
  - conferir se `prefCarregarDados()` ainda popula tudo antes do preview;
  - validar se os botoes da modal continuam com um unico listener.
- Rollback mental:
  - devolver a montagem visual da aba Ambiente para `app.js`;
  - manter intactos os blocos de `requestJson`;
  - manter intactos os blocos de payload/salvamento;
  - preservar os IDs e classes atuais.
- Porque o recorte e aceitavel:
  - e o primeiro recorte medio controlado em zona visual, com baixo risco funcional;
  - nao mexe em persistencia;
  - nao mexe em backend;
  - nao mexe em permissao;
  - nao mexe em textos;
  - o retorno ao estado anterior e quase imediato caso algo falhe.

## 12. Registro para roadmap

- Esta etapa criou o contrato profundo de `Preferencias remanescentes`.
- A etapa e documental.
- Nenhuma implementacao foi feita.
- O recorte recomendado para futura implementacao foi registrado.
- O teste manual previsto foi definido.
- As pendencias e limites da Fase 2B foram reafirmados:
  - backend fora;
  - banco fora;
  - endpoints fora;
  - permissoes fora;
  - payload efetivo fora;
  - salvamento fora;
  - texto/mojibake fora;
  - `frontend/index.html` fora;
  - `frontend/app.js` ainda nao foi alterado nesta etapa;
  - `frontend/js/modules` ainda nao foi alterado nesta etapa.
- O caminho documentado continua sendo primeiro um recorte visual/local e depois, somente se aprovado, uma subetapa futura de implementacao.
