# Auditoria técnica do frontend - app.js

## Escopo e premissas

- Auditoria realizada apenas por leitura do frontend em `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`.
- Nenhum arquivo de código foi modificado nesta fase.
- Nenhuma função foi movida, refatorada ou corrigida.
- Backend, banco, autenticação e `index.html` permaneceram fora de escopo.

## 1. Quantidade aproximada de linhas do `app.js`

- Tamanho em disco: aproximadamente 2,1 MB.
- Contagem observada por leitura: entre 31.358 e 31.537 linhas, dependendo do método de medição.
- Referência prática para esta auditoria: considerar `app.js` com cerca de 31,4 mil linhas.

## 2. Mapa dos principais blocos funcionais encontrados no `app.js`

### Bootstrap, sessão e infraestrutura base

- Linhas iniciais ~2-357.
- Inicialização de DOM principal, login, sessão, heartbeat, proteção de módulos, helpers numéricos e request wrapper.
- Estado global concentrado logo no início, especialmente em uma grande declaração na linha ~98.

### Infraestrutura visual comum

- Faixa ~573-639.
- Controle de painéis/modais, chrome visual, drag de painéis, padronização de cabeçalhos e fechamento.
- Base compartilhada por praticamente todos os módulos.

### Materiais

- Faixa principal ~640-671.
- CRUD, filtros, listas, modal e tabelas de materiais.

### Procedimentos

- Faixa principal ~672-942 e trechos finais ~29753-29988.
- Lista, editor, vínculo com materiais, filtros, cálculos financeiros, tabelas e relatórios.
- Forte acoplamento com símbolos gráficos e cenário financeiro.

### Relatórios e etiquetas

- Faixa ~1271-2064.
- Configuração de relatórios, fontes, impressoras, testes e modelos de etiquetas.

### Preferências e opções de sistema

- Faixa ~2076-3188.
- Preferências gerais, dados do usuário, ambiente, odonto e opções sistêmicas.

### Procedimentos genéricos (`pgen`)

- Faixa ~3250-4517.
- Editor próprio com fases, materiais e seleção de símbolo.

### Ficha do paciente

- Faixa ~4576-6153 e extensões posteriores.
- Cadastro, navegação, integrações auxiliares e anamnese do paciente.

### Financeiro

- Conta corrente: ~6238-6502.
- Protéticos e controle protético: ~6503-6723.
- Fluxo de caixa e dashboard: ~12404-12854.
- Plano de contas e auxiliares aparecem em outros blocos.

### Convênios, prestadores e unidades

- Convênios/planos: ~6725-6806.
- Prestadores: final ~29672-29681.
- Unidades: ~29682-29727.

### Agenda

- Agenda de contatos: ~6807-7347.
- Agenda legado: ~7360-8980+.
- Agenda semana: ~8322-10844.
- Módulo grande, com bastante estado e comportamento visual.

### CID, Símbolos Gráficos, Anamnese, Auxiliares

- CID: ~10853-10984.
- Símbolos gráficos: núcleo inicial ~10994-11147 e núcleo mais novo ~30097-30512.
- Auxiliares: ~11180-11610.
- Anamnese administrativa: ~30541-31000.
- Medicamentos: ~31024-31449.

### Editor de Textos

- Início estrutural: variáveis/configurações na linha ~99 e constantes específicas ~108-157.
- Núcleo funcional intenso: ~12855-29257.
- É o maior subsistema isolado do arquivo e o mais sensível para modularização.

### Menu global e logout

- Faixa ~29281-29735.
- Permissões por menu, proteção de ações, fechamento de dropdowns e reset de sessão.

## 3. Lista das funções principais agrupadas por possível módulo

### Núcleo / sessão / infraestrutura

- `requestJsonBase`, `requestJson`, `postJson`
- `carregarSessao`, `startSessionHeartbeat`, `stopSessionHeartbeat`
- `parseSessionIssue`, `enforceSessionIssue`, `hardResetSessionState`
- `hideAllPanels`, `closeWorkspacePanel`, `closeModalByBackdropId`
- `ensurePanelChrome`, `ensureModalChrome`, `bindStandardGridActivation`

### Usuários e permissões

- `carregarUsuarios`
- `usersCarregarCombos`
- `usersAtualizarAcoesToolbar`
- `usersFecharPermissoes`
- `usersPermSelecionarModulo`
- `usersPermRenderPerfilPreview`
- `usersAbrirSenhaSessaoAtual`

### Materiais

- `materiaisCarregar`
- `materiaisRender`
- `materiaisSalvarModal`
- `materiaisExcluirSelecionado`
- `materiaisTabelaAbrirModal`
- `materiaisTabelaSalvarModal`
- `materiaisExcluirTabela`

### Procedimentos

- `procCarregarFiltros`
- `procCarregarLista`
- `procAbrirEditor`
- `procAplicarDadosEditor`
- `procSalvar`
- `procExcluirSelecionado`
- `procRecarregarLinks`
- `procAtualizarFinanceiro`
- `procTabelaAbrirModal`
- `procTabelaSalvarModal`

### Procedimentos genéricos

- `pgenEnsureUI_LEGACY`
- `pgenCarregar_LEGACY`
- `pgenCarregarSimbolos`
- `pgenAtualizarPreviewSimbolo`
- `pgenRenderFases_LEGACY`
- `pgenRenderMateriais_LEGACY`

### Ficha do paciente

- `fichaEnsureUI`
- `fichaAbrir`
- `fichaSalvar`
- `fichaNovo`
- `fichaEliminar`
- `fichaMenuPacFechar`

### Agenda

- `agendaContatosReconstruirModalBody`
- `agendaContatosCarregar`
- `agendaLegadoCarregar`
- `agendaLegadoSalvar`
- `agendaSemanaAbrir`
- `agendaSemanaRender`
- `agendaSemanaDesconectarResizeObserver`

### Editor de Textos

- `editorTextosEnsureUI`
- `editorTextosAbrir`
- `editorTextosSalvar`
- `editorTextosSalvarComo`
- `editorTextosAbrirModalMesclagem`
- `editorTextosAbrirModalPagina`
- `editorTextosAtualizarLayoutPaginado`
- `editorTextosDocumentoModelAtualizar`
- `editorTextosSincronizarToolbarFormato`
- `editorTextosMesclarConteudoAtual`

### Símbolos gráficos

- `simbolosEnsureUI`
- `simbolosCarregar`
- `simbolosRender`
- `simbolosRenderBiblioteca`
- `simbolosAbrir`
- `simbolosAbrirModal`
- `simbolosSalvarModal`
- `simbolosPersistirEdicao`
- `simbolosAbrirEditor`
- `simbolosFecharEditor`
- `simbolosEditorNotificar`

### Anamnese e medicamentos

- `anamneseAbrir`, `anamneseSalvarQuestionario`, `anamneseSalvarPergunta`
- `medicamentosAbrir`, `medicamentosCarregarLista`, `medicamentosSalvarModal`

## 4. Lista das variáveis globais importantes

### Sessão e infraestrutura

- `baseUrl`
- `sessaoAtual`
- `mpReturnPaymentId`
- `sessionHeartbeatTimer`
- `protectedGrantCache`
- `protectedGrantPending`
- `preserveProtectedGrantOnHide`

### Estado central de módulos

- `proc`
- `m`
- `sa`
- `ficha`
- `agendaContatos`
- `agendaLegado`
- `agendaSemana`
- `simbolosCfg`
- `anamneseCfg`
- `editorTextosCfg`

### Caches e seleções relevantes

- `usersCache`, `usersSelecionadoId`
- `materiaisCache`, `materialSelecionadoId`
- `procedimentosCache`, `procedimentoSelecionadoId`, `procedimentoAtualId`
- `procFiltros`, `procSimbolosCache`, `procCenario`
- `fichaPacienteAtualId`, `fichaPacientesBuscaCache`
- `simbolosCache`, `simbolosBibliotecaCache`, `simbolosSelId`
- `anamneseQuestionariosCache`, `anamneseCache`

### Estado crítico do Editor de Textos

- `editorTextosCfg`
- `editorTextosProtegendoCursor`
- `editorTextosFontesCache`
- `editorTextosFontesPromise`
- `editorTextosAssistMedMenuFiltroTimer`
- `editorTextosAssistAtestadoCidMenuFiltroTimer`
- `editorTextosStandaloneId`
- `editorTextosStandaloneHeartbeatTimer`
- `editorTextosStandaloneLockInit`
- `EDITOR_TEXTOS_PAGE_DEFAULT`
- `EDITOR_TEXTOS_PAGE_PAPER_PRESETS`
- `EDITOR_TEXTOS_PAGE_BREAK_GAP_PX`
- `EDITOR_TEXTOS_PAGE_BREAK_TOLERANCE_PX`
- `EDITOR_TEXTOS_DOCUMENT_MODEL_FLAG_KEY`
- `EDITOR_TEXTOS_DOCUMENT_MODEL_BLOCK_TYPES`

## 5. Lista dos eventos globais registrados

### `document`

- `pointermove`
- `pointerup`
- `pointercancel`
- `click`
- `keydown`
- `selectionchange`
- `mousedown`
- `mousemove`
- `mouseup`

### `window`

- `mousemove`
- `mouseup`
- `resize`
- `scroll`
- `storage`
- `beforeunload`
- `message`

### Observação

- Há centenas de listeners locais em elementos específicos.
- O Editor de Textos e o módulo de Símbolos adicionam listeners de alto impacto no DOM e em `window/document`, o que aumenta o risco de side effects quando extraídos sem isolamento cuidadoso.

## 6. Lista das chamadas `fetch` / API encontradas

### Base de autenticação e sessão

- `/login`
- `/me`
- `/logout`
- `/auth/setup/complete`
- `/auth/protected/unlock`
- `/signup/request-code`
- `/signup/confirm`
- `/password/forgot`
- `/password/reset`

### Preferências e sistema

- `/preferences/general`
- `/preferences/models`
- `/preferences/environment`
- `/preferences/user-data`
- `/preferences/odontogram`
- `/preferences/report-config`
- `/system-options`

### Procedimentos e materiais

- `/materiais/*`
- `/procedimentos/*`
- `/procedimentos/tabelas/*`
- `/procedimentos/dashboard`
- `/procedimentos/relatorio-tabela`
- `/cadastros/procedimentos-genericos*`

### Cadastros e apoio clínico

- `/cadastros/auxiliares*`
- `/cadastros/pacientes*`
- `/cadastros/convenios-planos*`
- `/cadastros/unidades-atendimento*`
- `/cadastros/prestadores`
- `/cadastros/simbolos-graficos*`
- `/cid`
- `/anamnese/*`
- `/medicamentos/*`

### Financeiro

- `/financeiro/lancamentos*`
- `/financeiro/categorias*`
- `/financeiro/formas-pagamento*`
- `/financeiro/relatorio-cc*`
- `/financeiro/fluxo-caixa*`
- `/indices-financeiros*`

### Editor de Textos

- `/editor-textos/preparar-pdf-acrobat`
- `/editor-textos/abrir-arquivo-pdf-acrobat`
- `/editor-textos/assistente-receitas/exportar-pdf-template`
- `/editor-textos/exportar-pdf`
- `/editor-textos/registrar-assinatura-local`
- `/editor-textos/assinar-pdf`
- `/editor-textos/assistente-receitas/medicamentos`
- `/editor-textos/assistente-receitas/contexto`
- `/editor-textos/assistente-atestado/cid`
- `/editor-textos/assistente-atestado/contexto`
- `/editor-textos/modelos`
- `/editor-textos/modelos/{id}/renomear`
- `/editor-textos/campos`
- `/editor-textos/mesclar`

### Outras integrações observadas

- `LOCAL_BRIDGE_BASE_URL = http://127.0.0.1:8765`
- `fetch(url, { credentials: "include" })` em fluxo dinâmico de captura/renderização
- `window.open("https://wa.me/..."...)` para WhatsApp

## 7. Mapeamento específico do módulo Editor de Textos

### Escopo geral

- O Editor de Textos é o maior subsistema isolado do `app.js`.
- Concentra UI, estado, renderização, paginação, toolbar, merge fields, exportação PDF, imagens, tabelas, assistentes e um document model próprio.
- A região funcional pesada começa por volta da linha `12855` e segue até perto de `29257`.

### Subáreas identificadas

- Fontes, cor e snapshots de seleção: ~12855-13966.
- Merge fields e snapshots associados: ~13830-14098.
- Document model e sincronização DOM-modelo: ~14114-18536.
- Toolbar e sincronização visual: ~18553-18870.
- UI do editor, régua e comandos: ~18870-21878.
- Exportação, snapshot visual e PDF: ~22019-22729.
- Tabelas e configuração de página: ~22770-26278.
- Assistentes de receitas/atestados/mesclagem: ~26479-28285.
- Persistência de modelos e fluxo abrir/salvar/salvar como: ~27686-29140.

### Observação crítica

- O editor combina duas camadas ao mesmo tempo: DOM editável e modelo semântico interno.
- Isso sugere que boa parte dos bugs sensíveis pode nascer na sincronização entre essas duas camadas, especialmente em cursor, tabulação, paginação e reflow.

## 8. Funções relacionadas à paginação do Editor de Textos

### Núcleo de configuração e atualização

- `editorTextosNormalizarPaginaConfig`
- `editorTextosAplicarConfiguracaoPagina`
- `editorTextosAtualizarLayoutPaginado`
- `editorTextosAgendarAtualizarLayoutPaginado`
- `editorTextosSincronizarModalPagina`
- `editorTextosAbrirModalPagina`
- `editorTextosFecharModalPagina`
- `editorTextosPaginaTrocarTipoPapel`
- `editorTextosPaginaTrocarOrientacao`
- `editorTextosConfirmarConfigurarPagina`
- `editorTextosPaginaAtual`

### Quebras visuais e layout de página

- `editorTextosElementoEhQuebraVisualPagina`
- `editorTextosPaginaRemoverQuebrasVisuais`
- `editorTextosPaginaCriarQuebraVisual`
- `editorTextosPaginaColetarContextoQuebrasVisuais`
- `editorTextosPaginaNormalizarBlocosVaziosAposQuebras`
- `editorTextosPaginaLimparCompactacaoVisualQuebras`
- `editorTextosPaginaCompactarBlocosVaziosVisuaisAposQuebras`

### Auditoria de layout e distribuição

- `editorTextosPaginaColetarDiagnosticoEspacamento`
- `editorTextosPaginaResumirEspacamentoRenderizado`
- `editorTextosPaginaDiffEspacamentoRenderizado`
- `editorTextosPaginaMapearDistribuicao`
- `editorTextosPaginaMapearDistribuicaoGrupos`
- `editorTextosPaginaCriarSnapshotDistribuicao`
- `editorTextosPaginaRenderizarGrupos`
- `editorTextosPaginaMedirItemRenderizado`
- `editorTextosPaginaMedirItemLayout`

## 9. Funções relacionadas a `line-height`, spacing, reflow, quebra de página e document model

### Document model / estrutura semântica

- `editorTextosDocumentoModelCriar`
- `editorTextosExtrairModeloDoDOM`
- `editorTextosDocumentoModelAtualizar`
- `editorTextosDocumentoModelCompararComDOM`
- `editorTextosDocumentoModelRenderizarParaHTML`
- `editorTextosDocumentoModelReset`
- `editorTextosReconstruirModelosParagrafoDoDocumento`

### Parágrafos, cursor e âncoras

- `editorTextosParagrafoObterModeloAtual`
- `editorTextosParagrafoResolverAnchor`
- `editorTextosParagrafoAtualizarAnchorPorIndice`
- `editorTextosParagrafoReancorarCursorDoModelo`
- `editorTextosParagrafoAtualizarCursorTextualPorEvento`
- `editorTextosParagrafoObterPosicaoLogicaAtual`

### Tabs, indentação e espaçamento

- `editorTextosDocumentoModelRegistrarTab`
- `editorTextosDocumentoModelSincronizarTabState`
- `editorTextosAplicarTabOperationsNoDOM`
- `editorTextosReaplicarTabIndentsDOM`
- `editorTextosParagrafoGarantirOperacoesTab`
- `editorTextosParagrafoCalcularProximoTabStop`
- `editorTextosParagrafoCalcularTabStopAnterior`
- `editorTextosParagrafoTabAvancar`
- `editorTextosParagrafoTabRecuar`
- `editorTextosParagrafoBackspaceSemantico`

### Reflow / layout paginado

- `editorTextosPaginaResumoEspacamentoBloco`
- `editorTextosPaginaColetarDiagnosticoEspacamento`
- `editorTextosPaginaSelecionarIndicesEspacamentoRenderizado`
- `editorTextosPaginaResumirSampleEspacamentoRenderizado`
- `editorTextosPaginaResumirEspacamentoRenderizado`
- `editorTextosPaginaDiffEspacamentoRenderizado`
- `editorTextosPaginaCalcularEspacoGrupo`
- `editorTextosPaginaMapearDiagnosticoEspaco`
- `editorTextosPaginaMapearEspacoQuebrasVisuais`

## 10. Funções relacionadas à toolbar do Editor de Textos

### Fontes e tamanho

- `editorTextosPreencherComboFonte`
- `editorTextosAtualizarComboFonte`
- `editorTextosNormalizarFonteNome`
- `editorTextosFonteNormalizarFamilia`
- `editorTextosFonteNormalizarTamanho`
- `editorTextosResolverTamanhoFonteUi`

### Cor e estilo

- `editorTextosCorParaHex`
- `editorTextosAplicarCorSelecao`
- `editorTextosCorAplicarOuPending`
- `editorTextosAplicarEstiloFonteSelecao`
- `editorTextosAplicarEstiloFonteMultiBloco`
- `editorTextosFonteEstadoMistoSelecao`

### Sincronização UI com seleção atual

- `editorTextosSetToolbarButtonAtivo`
- `editorTextosSincronizarToolbarFormato`
- `editorTextosAgendarSincronizarToolbar`
- `editorTextosAtualizarVisualComboCor`
- `editorTextosPendingStyleMarcarInteracaoToolbar`
- `editorTextosPendingStyleContextoToolbarAtivo`

## 11. Funções relacionadas a merge fields

- `editorTextosMergeFieldSelecaoResumo`
- `editorTextosMergeFieldSnapshotResumo`
- `editorTextosMergeFieldSnapshotSalvar`
- `editorTextosMergeFieldSnapshotRestaurar`
- `editorTextosMergeFieldRangeAtualValido`
- `editorTextosMergeFieldsResumoCategorias`
- `editorTextosMesclagemPacienteIdAtual`
- `editorTextosMesclagemCirurgiaoIdAtual`
- `editorTextosMesclarConteudoAtual`
- `editorTextosMesclagemNormalizarCategorias`
- `editorTextosRenderModalMesclagem`
- `editorTextosAbrirModalMesclagem`
- `editorTextosFecharModalMesclagem`
- `editorTextosMesclagemTrocarCategoria`
- `editorTextosMesclagemSelecionarLinha`
- `editorTextosConfirmarInserirMesclagem`
- `editorTextosPayloadCamposConteudo`

### Tokens e assinatura

- `editorTextosRegexTokenAssinatura`
- `editorTextosEncontrarFaixaTokenAssinatura`
- `editorTextosCriarPlaceholderAssinaturaDimensoes`
- `editorTextosSubstituirTokenAssinaturaNoDom`
- `editorTextosCriarPlaceholderAssinatura`
- `editorTextosExpandirTokensImagemHtml`

## 12. Funções relacionadas ao módulo Símbolos Gráficos, incluindo o editor estilo Paint

### Núcleo de listagem e modal

- `simbolosEnsureUI`
- `simbolosCarregarEspecialidades`
- `simbolosCarregar`
- `simbolosRender`
- `simbolosRenderBiblioteca`
- `simbolosSelecionadoNaGrade`
- `simbolosSelecionarLinha`
- `simbolosAbrir`
- `simbolosAbrirModal`
- `simbolosSalvarModal`
- `simbolosExcluirSelecionado`

### Regras de modo sistema x personalizado

- `simbolosEhSistema`
- `simbolosModalEhSistema`
- `simbolosAplicarModoModal`
- `simbolosTipoSelecionado`
- `simbolosPreencherFormas`
- `simbolosSetModalForma`
- `simbolosTipoMarcaSelecionado`

### Biblioteca e preview

- `simbolosBibliotecaOficial`
- `simbolosBibliotecaOculta`
- `simbolosCompararBiblioteca`
- `simbolosSelecionarBiblioteca`
- `simbolosAtualizarSelecaoBiblioteca`
- `simbolosAtualizarPreview`
- `simbolosImagemUrl`

### Editor estilo Paint / iframe / mensageria

- `simbolosAbrirEditor`
- `simbolosFecharEditor`
- `simbolosEditorNotificar`
- `simbolosAplicarImagemEditada`
- `simbolosLimparImagemEditada`
- `simbolosPersistirEdicao`
- `window.addEventListener("message", ...)` na faixa ~30504
- URL do editor: `/frontend/mock_simbolo_editor.html`

### Risco específico da “tela preta”

- O editor é aberto via `iframe` com `src` dinâmico e resetado para `about:blank` ao fechar.
- Há dependência de `postMessage`, `contentWindow`, `origin`, dataset do modal e imagem customizada em `data URL`.
- Isso sugere um ponto frágil de inicialização visual e sincronização entre modal pai e editor embarcado.
- Nesta fase, apenas mapeado; não corrigido.

## 13. Pontos de acoplamento entre módulos

- `hideAllPanels` conhece quase todos os painéis do sistema e faz teardown centralizado.
- `closeWorkspacePanel` também conhece o roteamento de fechamento de vários módulos.
- `requestJson` e a lógica de sessão/proteção permeiam todos os módulos.
- `menuApplyPermissions` e `menuEnsurePermission` controlam acesso de diversos recursos a partir de um único núcleo.
- Procedimentos consome materiais, cenário e símbolos.
- Ficha do paciente se conecta com agenda, anamnese e fluxos de mesclagem do editor.
- Editor de Textos consome dados clínicos, campos dinâmicos, medicamentos, CID, assinatura e exportação PDF.
- Símbolos gráficos conversa com procedimentos e procedimentos genéricos via combos e preview.

## 14. Áreas de maior risco para modularização

### Risco muito alto

- Núcleo do Editor de Textos entre ~14114 e ~26278.
- Subnúcleo de document model, cursor, âncoras, tabs, reflow e paginação.
- Mensageria do editor de símbolos via `iframe` + `postMessage`.
- `hideAllPanels`, `closeWorkspacePanel`, `menuApplyPermissions`, `menuEnsurePermission`.

### Risco alto

- Agenda semana e agenda legado, por densidade de estado visual e eventos.
- Ficha do paciente, por ser ponto de convergência de vários recursos.
- Procedimentos, por dependência com materiais, símbolos, cenário e relatórios.

## 15. Áreas mais seguras para extrair primeiro

### Mais seguras

- Helpers puros de formatação e parsing.
- Constantes e catálogos estáticos.
- Wrappers de API por domínio, sem alterar chamadas ainda.
- Infraestrutura visual comum de modal/painel/drag, se extraída sem mudar contrato.
- Módulos menores e mais isolados como `cid`, `medicamentos`, partes de `indices`, partes de `preferencias`.

### Moderadamente seguras

- Relatórios/etiquetas.
- Auxiliares (`aux`).
- Unidades e prestadores, desde que só depois de estabilizar dependências comuns.

## 16. Sugestão de estrutura futura de pastas

```text
frontend/
  index.html
  app.js
  modules/
    core/
      api.js
      session.js
      permissions.js
      panels.js
      modals.js
      menu.js
      format.js
      dom.js
    materiais/
      materiais.js
    procedimentos/
      procedimentos.js
      procedimentos-tabelas.js
      procedimentos-vinculos.js
    editor-textos/
      editor-shell.js
      editor-toolbar.js
      editor-pagination.js
      editor-document-model.js
      editor-merge-fields.js
      editor-page-setup.js
      editor-pdf.js
      editor-assistentes.js
    simbolos/
      simbolos.js
      simbolos-biblioteca.js
      simbolos-editor-bridge.js
    agenda/
      agenda-contatos.js
      agenda-legado.js
      agenda-semana.js
    ficha/
      ficha.js
      ficha-anamnese.js
    admin/
      users.js
      superadmin.js
    shared/
      constants.js
      selectors.js
      state.js
```

### Observação

- Esta estrutura é sugestão de destino, não recomendação para execução imediata integral.
- O Editor de Textos deve ser dividido por subdomínio interno, não como arquivo único separado “do resto”.

## 17. Plano de modularização em fases, começando pelas partes menos arriscadas

### Fase 0 - Preparação sem mudar comportamento

- Congelar contrato do `app.js` atual.
- Documentar dependências globais por módulo.
- Criar inventário de estado global e listeners críticos.
- Adicionar testes manuais mínimos por fluxo antes de qualquer extração.

### Fase 1 - Extrações de baixo risco

- Helpers de formatação/parsing.
- Constantes e listas estáticas.
- Wrappers de API por domínio.
- Infraestrutura comum de modal/painel, mantendo a mesma assinatura pública.

### Fase 2 - Módulos administrativos e menores

- `cid`
- `medicamentos`
- `indices`
- partes de `preferencias`
- `aux`

### Fase 3 - Módulos médios

- `materiais`
- `unidades`
- `prestadores`
- `relatorios/etiquetas`

### Fase 4 - Módulos com acoplamento moderado

- `users`
- `superadmin`
- `procedimentos genericos`
- `simbolos` apenas na camada de listagem/modal, ainda sem quebrar a ponte do editor Paint

### Fase 5 - Procedimentos e agenda

- `procedimentos`
- `agenda-contatos`
- `agenda-legado`
- `agenda-semana`

### Fase 6 - Editor de Textos, por subcamadas

- Primeiro: shell/UI de abertura, persistência de modelos e modais periféricos.
- Depois: toolbar e comandos menos sensíveis.
- Depois: merge fields e assistentes.
- Por último: paginação, reflow, tabs, cursor semântico e document model.

## 18. Lista de funções que NÃO devem ser movidas inicialmente

### Núcleo do Editor de Textos

- `editorTextosDocumentoModelAtualizar`
- `editorTextosDocumentoModelCompararComDOM`
- `editorTextosDocumentoModelRenderizarParaHTML`
- `editorTextosDocumentoModelReset`
- `editorTextosReconstruirModelosParagrafoDoDocumento`
- `editorTextosParagrafoResolverAnchor`
- `editorTextosParagrafoReancorarCursorDoModelo`
- `editorTextosParagrafoAtualizarCursorTextualPorEvento`
- `editorTextosParagrafoTabAvancar`
- `editorTextosParagrafoTabRecuar`
- `editorTextosParagrafoBackspaceSemantico`
- `editorTextosAtualizarLayoutPaginado`
- `editorTextosAgendarAtualizarLayoutPaginado`
- `editorTextosAplicarConfiguracaoPagina`
- `editorTextosSincronizarToolbarFormato`
- `editorTextosAgendarSincronizarToolbar`
- `editorTextosMesclarConteudoAtual`

### Infraestrutura transversal

- `hideAllPanels`
- `closeWorkspacePanel`
- `requestJson`
- `menuApplyPermissions`
- `menuEnsurePermission`

### Símbolos gráficos com editor embarcado

- `simbolosAbrirEditor`
- `simbolosFecharEditor`
- `simbolosEditorNotificar`
- `simbolosPersistirEdicao`
- listener global `window.addEventListener("message", ...)`

## Principais riscos encontrados

- Concentração extrema de estado global no topo do arquivo.
- Acoplamento transversal entre menu, sessão, proteção, painéis e módulos de negócio.
- Editor de Textos com alta complexidade algorítmica e forte dependência de sincronização DOM-modelo.
- Paginação e reflow do Editor parecem possuir instrumentação e auditoria próprias, sinal de histórico de instabilidade nessa área.
- Editor de Símbolos com ponte via `iframe` e `postMessage`, potencialmente sensível a ordem de inicialização e estado visual.
- Procedimentos e ficha do paciente funcionam como hubs de integração e tendem a propagar regressões.

## Próxima fase recomendada

- Não começar pelo Editor de Textos.
- Iniciar por um ciclo curto de modularização de baixo risco: helpers puros, constantes, wrappers de API e um módulo pequeno como `cid` ou `medicamentos`.
- Antes disso, definir checklist manual de regressão para: login, abertura/fechamento de painéis, materiais, procedimentos, editor de símbolos, abrir editor de textos, salvar modelo, mesclagem e exportação PDF.
- Depois desse ciclo, reavaliar a extração da camada de listagem/modal de Símbolos Gráficos, mantendo intacto o editor estilo Paint.

## Encerramento solicitado

### 1. Arquivos criados

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_auditoria_appjs.md`

### 2. Arquivos alterados

- Nenhum arquivo de código alterado.
- Apenas criação do relatório de auditoria.

### 3. Confirmação de que `app.js` foi preservado intacto

- Confirmado. `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js` foi apenas lido e não sofreu alteração.

### 4. Confirmação de que nenhum código funcional foi modificado

- Confirmado. Nenhum comportamento funcional foi modificado nesta fase.

### 5. Principais riscos encontrados

- Editor de Textos: paginação, quebra de página, line-height, spacing, reflow, toolbar, merge fields e document model.
- Símbolos Gráficos: editor estilo Paint com `iframe` e mensageria.
- Infraestrutura comum de sessão, menu e painéis com forte acoplamento global.

### 6. Próxima fase recomendada

- Modularização incremental, começando por helpers/constantes/API wrappers e módulos pequenos.
- Adiar a extração do núcleo do Editor de Textos até existir base de isolamento e checklist de regressão.
