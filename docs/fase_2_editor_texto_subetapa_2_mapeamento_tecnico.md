# Fase 2 - Editor de texto - Subetapa 2 - Mapeamento tecnico por leitura

## 1. Contexto da Fase 2
A Fase 2 continua apos o fechamento parcial da frente Tabela de proteticos e apos a correcao de trilha documentada em torno do commit `ae98032`.

A trilha correta permanece voltada para o Editor de texto, que foi consolidado como a proxima frente recomendada da Fase 2.

Esta subetapa e exclusivamente documental e faz o mapeamento tecnico por leitura antes de qualquer mudanca de codigo, recorte ou modularizacao.

## 2. Frente atual
Frente atual: Editor de texto.

## 3. Tabela de proteticos permanece pausada/consolidada
A Tabela de proteticos permanece pausada/consolidada e nao deve ser reaberta por esta etapa.

Essa frente continua fora do escopo funcional desta subetapa.

## 4. Classificacao multiarea
Classificacao preliminar mantida: comum/core.

Justificativa: o Editor de texto continua parecendo transversal e reutilizavel por varias areas profissionais.

Nesta etapa nao sera implementado controle multiarea.

## 5. Referencia a Subetapa 1
A Subetapa 1 foi concluida corretamente no documento:

- `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`

Commit de referencia:

- `4839177` - `Documenta contrato funcional do editor de texto`

## 6. Arquivos lidos

### 6.1 Frontend
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`

### 6.2 Backend
- `backend/routes/editor_textos_routes.py`
- `backend/main.py`
- `backend/security/permissions.py`

### 6.3 Docs
- `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/auditoria_fina_editor_textos_editor_puro.md`
- `docs/auditoria_fina_editor_textos_resto_domino.md`
- `docs/auditoria_fina_editor_textos_pdf_assinatura.md`
- `docs/modularizacao_segura_fase_1_fechamento_abertura_fase_2.md`

## 7. Funcoes identificadas relacionadas ao Editor de texto

### 7.1 Estado e bootstrap
- `editorTextosCfg`
- `editorTextosFontesCache`
- `editorTextosFontesPromise`
- `editorTextosAssistMedMenuFiltroTimer`
- `editorTextosAssistAtestadoCidMenuFiltroTimer`
- `editorTextosStandaloneId`
- `editorTextosStandaloneHeartbeatTimer`
- `editorTextosStandaloneLockInit`
- `editorTextosEnsureUI()`
- `editorTextosAbrir()`
- `editorTextosAbrirEmAbaUnica()`
- `editorTextosIsStandaloneRequest()`
- `editorTextosBuildStandaloneUrl()`
- `editorTextosAplicarModoStandalone()`
- `editorTextosEnsureStandaloneStyle()`
- `editorTextosIniciarLockStandalone()`
- `editorTextosLiberarOwnerStandalone()`
- `editorTextosPerderPosseStandalone()`
- `editorTextosStorageOwnerChanged()`

### 7.2 Fontes, toolbar e selecao
- `editorTextosNormalizarListaFontes()`
- `editorTextosListarFontesSistema()`
- `editorTextosPreencherComboFonte()`
- `editorTextosAtualizarComboFonte()`
- `editorTextosQueryCommandState()`
- `editorTextosQueryCommandValue()`
- `editorTextosNormalizarFonteNome()`
- `editorTextosCorParaHex()`
- `editorTextosAplicarCorSelecaoFallback()`
- `editorTextosObterElementoSelecao()`
- `editorTextosSincronizarToolbarFormato()`
- `editorTextosAgendarSincronizarToolbar()`

### 7.3 Modelo estrutural do documento
- `editorTextosDocumentoModelFeatureAtiva()`
- `editorTextosDocumentoModelAtivar()`
- `editorTextosDocumentoModelObterEstado()`
- `editorTextosDocumentoModelProximoId()`
- `editorTextosDocumentoModelCriarInline()`
- `editorTextosDocumentoModelCriarBloco()`
- `editorTextosDocumentoModelCriar()`
- `editorTextosDocumentoModelNormalizarMarks()`
- `editorTextosDocumentoModelMarksIguais()`
- `editorTextosDocumentoModelAppendInline()`
- `editorTextosDocumentoModelMarksDoElemento()`
- `editorTextosDocumentoModelExtrairInlinesDeNode()`
- `editorTextosExtrairModeloDoDOM()`
- `editorTextosDocumentoModelRegistrarTab()`
- `editorTextosDocumentoModelClonarTabOperations()`
- `editorTextosDocumentoModelObterBlocoPorId()`
- `editorTextosParagrafoCalcularLineIndexPorOffset()`
- `editorTextosDocumentoModelTabStateKey()`
- `editorTextosDocumentoModelResolverTabContext()`
- `editorTextosDocumentoModelGarantirBlocoParaDOM()`
- `editorTextosDocumentoModelOperacoesPorTabStateKey()`
- `editorTextosDocumentoModelCalcularDoBloco()`
- `editorTextosDocumentoModelClonarTabStates()`
- `editorTextosDocumentoModelNormalizarSnapshotBloco()`
- `editorTextosDocumentoModelMesclarSnapshotBloco()`
- `editorTextosDocumentoModelLogSnapshotTabStates()`
- `editorTextosDocumentoModelSnapshotTabStates()`
- `editorTextosDocumentoModelMesclarTabStatePreservado()`
- `editorTextosDocumentoModelDetectarResetTabStates()`
- `editorTextosDocumentoModelContarPadsDOM()`
- `editorTextosDocumentoModelSincronizarTabState()`
- `editorTextosDocumentoModelRegistrarTabModelFirst()`
- `editorTextosDocumentoModelRemoverTabModelFirst()`
- `editorTextosAplicarTabOperationsNoDOM()`
- `editorTextosParagrafoCalcularDoModelo()`
- `editorTextosParagrafoCalcularDoModeloPorLinha()`
- `editorTextosDocumentoModelEscaparHtml()`
- `editorTextosDocumentoModelGerarInlineHtml()`
- `editorTextosGerarHTMLDoModelo()`
- `editorTextosDocumentoModelRenderizarInlineParaHTML()`
- `editorTextosDocumentoModelRenderizarBlocoParaHTML()`
- `editorTextosDocumentoModelRenderizarParaHTML()`
- `editorTextosDocumentoModelCalcularAssinatura()`
- `editorTextosDocumentoModelObterSandbox()`
- `editorTextosDocumentoModelRenderizarSandbox()`
- `editorTextosDocumentoModelCompararDOM()`
- `editorTextosDocumentoModelCompararComDOM()`
- `editorTextosDocumentoModelAtualizar()`
- `editorTextosDocumentoModelAgendarAtualizacao()`
- `editorTextosDocumentoModelReset()`

### 7.4 Estrutura visual, paragrafos, tabelas, imagens e regua
- `editorTextosSelecaoObterRangeAtivo()`
- `editorTextosNoDentroDaPagina()`
- `editorTextosSelecaoDentroPagina()`
- `editorTextosObterEstadoParagrafos()`
- `editorTextosGarantirIdBloco()`
- `editorTextosLerAlinhamentoBloco()`
- `editorTextosNormalizarNodeParaBloco()`
- `editorTextosResolverBlocoDeNode()`
- `editorTextosGarantirBlocosEstruturais()`
- `editorTextosObterBlocoAtual()`
- `editorTextosCriarModeloParagrafoPadrao()`
- `editorTextosAplicarModeloParagrafo()`
- `editorTextosGarantirModeloParagrafo()`
- `editorTextosSincronizarEstruturaParagrafoAtual()`
- `editorTextosReconstruirModelosParagrafoDoDocumento()`
- `editorTextosParagrafoContextoDetalhe()`
- `editorTextosParagrafoObterModeloAtual()`
- `editorTextosParagrafoGarantirOperacoesTab()`
- `editorTextosParagrafoDebugEstruturadoAtivo()`
- `editorTextosParagrafoDebugEstruturado()`
- `editorTextosParagrafoDebugAtivo()`
- `editorTextosParagrafoSnapshotOperacoes()`
- `editorTextosParagrafoLog()`
- `editorTextosParagrafoNoIgnoravel()`
- `editorTextosParagrafoNormalizarTexto()`
- `editorTextosParagrafoElementoEhBreakLogico()`
- `editorTextosParagrafoElementoEhIgnoravelParaTexto()`
- `editorTextosParagrafoEhCompativelComTabSemantica()`
- `editorTextosParagrafoObterTextoNodesLogicos()`
- `editorTextosParagrafoSomarComprimentoLogicoFilhos()`
- `editorTextosParagrafoComprimentoLogicoNode()`
- `editorTextosParagrafoObterTextoLinear()`
- `editorTextosParagrafoCalcularIndiceTextoBoundary()`
- `editorTextosParagrafoRangeParaIndiceTexto()`
- `editorTextosParagrafoConstruirAnchor()`
- `editorTextosParagrafoResolverAnchorDetalhado()`
- `editorTextosParagrafoResolverAnchor()`
- `editorTextosParagrafoAtualizarAnchorPorIndice()`
- `editorTextosParagrafoResolverPosicaoDomPorIndiceTexto()`
- `editorTextosParagrafoAplicarPosicaoAoRange()`
- `editorTextosResolverPrimeiroTextNode()`
- `editorTextosResolverTextNodePorOffset()`
- `editorTextosMapearOffsetParaNode()`
- `editorTextosParagrafoReancorarCursorDoModelo()`
- `editorTextosParagrafoObterCacheUltimaPosicao()`
- `editorTextosParagrafoObterCacheCursorTextual()`
- `editorTextosParagrafoSalvarCursorTextual()`
- `editorTextosParagrafoLerCursorTextual()`
- `editorTextosParagrafoSalvarUltimaPosicaoBloco()`
- `editorTextosParagrafoLerUltimaPosicaoBloco()`
- `editorTextosParagrafoMemorizarUltimaPosicao()`
- `editorTextosParagrafoAtualizarCursorPorIndice()`
- `editorTextosParagrafoLimparRenderSemantica()`
- `editorTextosParagrafoObterMedidor()`
- `editorTextosParagrafoAplicarEstiloMedidor()`
- `editorTextosParagrafoSerializarNodeDebug()`
- `editorTextosParagrafoRangePorIndiceTexto()`
- `editorTextosParagrafoResolverTabStateAtual()`
- `editorTextosParagrafoResolverRangePeloModelo()`
- `editorTextosParagrafoResolverRangePorOperacaoTab()`
- `editorTextosParagrafoDebugFallbackContexto()`
- `editorTextosParagrafoEncontrarBrAnterior()`
- `editorTextosParagrafoMedirRange()`
- `editorTextosParagrafoTextoNodeDebug()`
- `editorTextosParagrafoCapturarSelectionRawNoKeydown()`
- `editorTextosParagrafoObterRangeSelecaoReal()`
- `editorTextosParagrafoCapturarCursorReal()`
- `editorTextosParagrafoAtualizarCursorTextualPorEvento()`
- `editorTextosParagrafoObterPosicaoLogicaAtual()`
- `editorTextosParagrafoReancorarOperacoesDoBloco()`
- `editorTextosParagrafoCalcularAreaUtil()`
- `editorTextosParagrafoCalcularProximoTabStop()`
- `editorTextosParagrafoCalcularTabStopAnterior()`
- `editorTextosParagrafoCriarPad()`
- `editorTextosParagrafoCriarBreak()`
- `editorTextosParagrafoRenderizarOperacoes()`
- `editorTextosParagrafoObterOperacaoAnteriorPorCursor()`
- `editorTextosParagrafoAtualizarCursorPorOperacao()`
- `editorTextosParagrafoProximoIdOperacao()`
- `editorTextosParagrafoTabAvancar()`
- `editorTextosParagrafoRemoverOperacaoPorId()`
- `editorTextosParagrafoTabRecuar()`
- `editorTextosParagrafoBackspaceSemantico()`
- `editorTextosResolverTamanhoFonteUi()`
- `editorTextosAtualizarVisualComboCor()`
- `editorTextosSetToolbarButtonAtivo()`
- `editorTextosImprimirAtual()`
- `editorTextosPaginaAtual()`
- `editorTextosConfigurarImpressoraAtual()`
- `editorTextosSairAtual()`
- `editorTextosNormalizarTabelasNoDocumento()`
- `editorTextosImagemDataUrlValida()`
- `editorTextosExpandirTokensImagemHtml()`
- `editorTextosSerializarHtmlComImagens()`
- `editorTextosImagemEnsureOverlay()`
- `editorTextosImagemLimparSelecao()`
- `editorTextosImagemSelecionar()`
- `editorTextosImagemAtualizarOverlay()`
- `editorTextosImagemPageClick()`
- `editorTextosImagemDocumentoMouseDown()`
- `editorTextosImagemResizeStart()`
- `editorTextosImagemResizeMove()`
- `editorTextosImagemPersistirTamanho()`
- `editorTextosImagemResizeEnd()`
- `editorTextosImagemLimparEstado()`
- `editorTextosImagemRenderPreview()`
- `editorTextosAbrirModalImagem()`
- `editorTextosFecharModalImagem()`
- `editorTextosSelecionarArquivoImagem()`
- `editorTextosInserirImagemNoCursor()`
- `editorTextosInserirImagem()`
- `editorTextosHandleImagemSelecionada()`
- `editorTextosConfirmarInserirImagemArquivo()`
- `editorTextosSalvarRangeAtual()`
- `editorTextosRestaurarRangeAtual()`
- `editorTextosAbrirModalTabela()`
- `editorTextosFecharModalTabela()`
- `editorTextosMontarHtmlTabela()`
- `editorTextosInserirTabela()`
- `editorTextosConfirmarInserirTabela()`
- `editorTextosFormatarMm()`
- `editorTextosLerMm()`
- `editorTextosCorrigirMmLegado()`
- `editorTextosNormalizarPaginaConfig()`
- `editorTextosAplicarConfiguracaoPagina()`
- `editorTextosSincronizarModalPagina()`
- `editorTextosAbrirModalPagina()`
- `editorTextosFecharModalPagina()`
- `editorTextosPaginaTrocarTipoPapel()`
- `editorTextosPaginaTrocarOrientacao()`
- `editorTextosConfirmarConfigurarPagina()`
- `editorTextosPrepararPdfNoAppPdf()`
- `editorTextosAbrirPdfPreparadoNoAppPdf()`
- `editorTextosSolicitarPdfAtual()`
- `editorTextosExportarPdfAtual()`
- `editorTextosMontarMetadadosAssinaturaLocal()`
- `editorTextosCapturarHintAssinatura()`
- `editorTextosRegexTokenAssinatura()`
- `editorTextosEncontrarFaixaTokenAssinatura()`
- `editorTextosCriarPlaceholderAssinaturaDimensoes()`
- `editorTextosSubstituirTokenAssinaturaNoDom()`
- `editorTextosGerarPdfParaAssinaturaAtual()`
- `editorTextosPrepararClonePaginaSnapshot()`
- `editorTextosMontarCssSnapshot()`
- `editorTextosCriarPlaceholderAssinatura()`
- `editorTextosClonarNoComEstilosComputados()`
- `editorTextosBlobParaDataUrl()`
- `editorTextosConverterImagemParaDataUrl()`
- `editorTextosIncorporarImagensCloneSnapshot()`
- `editorTextosCapturarPaginaSnapshotHtml()`
- `editorTextosCapturarPaginaSnapshotDataUrl()`
- `editorTextosRegistrarAssinaturaLocalEvento()`
- `editorTextosAssinarPdfViaPonteLocal()`
- `editorTextosConfirmarAssinarPdf()`

### 7.5 Abertura, listagem, novo, salvar e mesclagem
- `editorTextosConfirmarDescartar()`
- `editorTextosAtualizarTitulo()`
- `editorTextosRenderRegua()`
- `editorTextosReguaMetricas()`
- `editorTextosNormalizarEstadoRegua()`
- `editorTextosUnidadesRegua()`
- `editorTextosPxPorUnidadeRegua()`
- `editorTextosAplicarFormatacaoRegua()`
- `editorTextosReguaPosicaoParaUnidade()`
- `editorTextosSnapUnidadeRegua()`
- `editorTextosFmtUnidadeRegua()`
- `editorTextosReguaMouseDown()`
- `editorTextosReguaDragMove()`
- `editorTextosReguaDragEnd()`
- `editorTextosReguaDoubleClick()`
- `editorTextosReguaContextMenu()`
- `editorTextosPageKeyDown()`
- `editorTextosNovoDocumento()`
- `editorTextosNovoNormalizarNome()`
- `editorTextosAbrirModalAbrir()`
- `editorTextosNovoAplicarModo()`
- `editorTextosAbrirModalNovo()`
- `editorTextosFecharModalNovo()`
- `editorTextosNovoPorTipo()`
- `editorTextosTipoExigePaciente()`
- `editorTextosTemPacienteSelecionado()`
- `editorTextosGarantirPacienteParaTipo()`
- `editorTextosNovoExecutar()`
- `editorTextosCarregarModelos()`
- `editorTextosFecharModalAbrir()`
- `editorTextosOpenItemPorId()`
- `editorTextosOpenPodeAlterarItem()`
- `editorTextosOpenSelecionarLinha()`
- `editorTextosOpenOcultarContexto()`
- `editorTextosOpenMostrarContexto()`
- `editorTextosOpenTipoArquivoLabel()`
- `editorTextosOpenExcluirConfirmar()`
- `editorTextosOpenConfirmarExclusao()`
- `editorTextosPdfPromptResponder()`
- `editorTextosPerguntarAbrirPdfGerado()`
- `editorTextosOpenContextoAbrirSelecionado()`
- `editorTextosOpenContextoRenomearSelecionado()`
- `editorTextosOpenContextoExcluirSelecionado()`
- `editorTextosOpenContextoMostrarPropriedades()`
- `editorTextosOpenNormalizarExtensao()`
- `editorTextosOpenCorrespondeTipo()`
- `editorTextosRenderListaAbertura()`
- `editorTextosMesclagemNormalizarCategorias()`
- `editorTextosRenderModalMesclagem()`
- `editorTextosAbrirModalMesclagem()`
- `editorTextosFecharModalMesclagem()`
- `editorTextosMesclagemTrocarCategoria()`
- `editorTextosMesclagemSelecionarLinha()`
- `editorTextosConfirmarInserirMesclagem()`
- `editorTextosCarregarCampos()`
- `editorTextosAbrirModelo()`
- `editorTextosFormatoPorExt()`
- `editorTextosNormalizarHTML()`
- `editorTextosAplicarConteudo()`
- `editorTextosTextoAtual()`
- `editorTextosClonarPaginaParaPersistencia()`
- `editorTextosLimparAtributosEstruturaisNoClone()`
- `editorTextosConteudoParaSalvar()`
- `editorTextosNormalizarNomeComparacao()`
- `editorTextosBuscarModeloClinicaPorNomeTipo()`
- `editorTextosBuscarModeloClinicaPorArquivoTipo()`
- `editorTextosSalvarAtual()`
- `editorTextosSalvarComoAtual()`

### 7.6 Assistentes clinicos
- `editorTextosAssistStatus()`
- `editorTextosAssistMenuNormalizar()`
- `editorTextosAssistMenuPrimeiraLetra()`
- `editorTextosAssistRenderMenuMedicamentosAlfabeto()`
- `editorTextosAssistRenderMenuMedicamentosTabela()`
- `editorTextosAssistAplicarFiltrosMenuMedicamentos()`
- `editorTextosAssistFecharMenuMedicamentos()`
- `editorTextosAssistAbrirMenuMedicamentos()`
- `editorTextosAssistConfirmarMenuMedicamentos()`
- `editorTextosAssistSetSelectOptions()`
- `editorTextosAssistMedicamentoAtual()`
- `editorTextosAssistFaixaAtual()`
- `editorTextosAssistAplicarMedicamentoSelecionado()`
- `editorTextosAssistMontarItemAtual()`
- `editorTextosAssistAtualizarAcoes()`
- `editorTextosAssistLimparRascunho()`
- `editorTextosAssistUsoTitulo()`
- `editorTextosAssistLinhaComQuantidade()`
- `editorTextosAssistMontarTextoItens()`
- `editorTextosAssistCapturarConteudoBase()`
- `editorTextosAssistCapturarPreviewBase()`
- `editorTextosAssistRestaurarConteudoBase()`
- `editorTextosInserirTextoNoCursor()`
- `editorTextosAssistAplicarCorpoReceita()`
- `editorTextosAssistAplicarCorpoAtestado()`
- `editorTextosMesclagemPacienteIdAtual()`
- `editorTextosMesclagemCirurgiaoIdAtual()`
- `editorTextosMesclarConteudoAtual()`
- `editorTextosAssistAplicarPreviewItens()`
- `editorTextosAssistCarregarContexto()`
- `editorTextosAssistAbrir()`
- `editorTextosAssistFechar()`
- `editorTextosAssistSelecionarPaciente()`
- `editorTextosAssistIncluirAtual()`
- `editorTextosAssistPrepararDocumentoFinal()`
- `editorTextosAssistFinalizar()`
- `editorTextosAssistAssinarPdf()`
- `editorTextosAssistAtestadoStatus()`
- `editorTextosAssistAtestadoAtualizarAcoes()`
- `editorTextosAssistAtestadoCidMenuRenderAlfabeto()`
- `editorTextosAssistAtestadoCidMenuRenderTabela()`
- `editorTextosAssistAtestadoCidMenuFechar()`
- `editorTextosAssistAtestadoCidMenuCarregar()`
- `editorTextosAssistAtestadoCidMenuAbrir()`
- `editorTextosAssistAtestadoCidMenuSelecionado()`
- `editorTextosAssistAtestadoCidMenuConfirmar()`
- `editorTextosAssistAtestadoCarregarContexto()`
- `editorTextosAssistAtestadoAbrir()`
- `editorTextosAssistAtestadoFechar()`
- `editorTextosAssistAtestadoSelecionarPaciente()`
- `editorTextosAssistAtestadoNormalizarData()`
- `editorTextosAssistAtestadoMaskDataInput()`
- `editorTextosAssistAtestadoNormalizarHora()`
- `editorTextosAssistAtestadoMaskHoraInput()`
- `editorTextosAssistAtestadoMontarPeriodoTexto()`
- `editorTextosAssistAtestadoMontarCorpo()`
- `editorTextosAssistAtestadoConfirmar()`

## 8. IDs, seletores e elementos DOM identificados

### 8.1 Menus e entrada
- `data-menu-action="ferr-editor-textos"`
- `EDITOR_TEXTOS_WINDOW_NAME`
- `EDITOR_TEXTOS_STANDALONE_OWNER_KEY`
- `EDITOR_TEXTOS_STANDALONE_CLASS`
- `editor_textos=1`

### 8.2 Estrutura principal
- `#editor-textos-panel`
- `#editor-textos-page`
- `#editor-textos-status`
- `.editor-textos-panel`
- `.editor-textos-menubar`
- `.editor-textos-toolbar`
- `.editor-textos-toolbar-main`
- `.editor-textos-toolbar-fields`
- `.editor-textos-work`
- `.editor-textos-page`
- `.editor-textos-status`

### 8.3 Modais e listas
- `.editor-textos-open-modal`
- `.editor-textos-open-grid`
- `#editor-textos-open-context`
- `.editor-textos-open-context`
- `.editor-textos-open-delete-modal`
- `.editor-textos-image-resize-overlay`
- `#editor-textos-standalone-style`

### 8.4 Elementos funcionais recorrentes
- seletores de fonte, tamanho, cor e mesclagem dentro da toolbar
- area editavel principal do documento
- backdrops/modais de abrir, novo, mesclagem, tabela, pagina, imagem, assinatura, assistente de receitas e assistente de atestado
- elementos de lista, contexto e confirmacao na abertura de modelos
- estrutura de regua e marcadores visuais

## 9. Eventos e handlers identificados

- `click`
- `dblclick`
- `change`
- `input`
- `keydown`
- `beforeinput`
- `compositionstart`
- `compositionend`
- `mousemove`
- `mouseleave`
- `mousedown`
- `mouseup`
- `contextmenu`
- `focus`
- `scroll`
- `selectionchange`
- `storage`
- `beforeunload`
- `message`

Handlers observados por leitura:

- eventos na pagina editavel para sincronizar cursor, estrutura, toolbar e atualizacao de modelo;
- eventos da regua para arraste, duplo clique e menu de contexto;
- eventos da area do editor para tabela, imagem e selecao;
- eventos dos menus internos de arquivo, editar e formatar;
- eventos de abrir, novo, salvar, salvar como e imprimir;
- eventos dos modais de abrir, novo, mesclagem, tabela, pagina, imagem, assinatura, assistente de receitas e assistente de atestado;
- eventos globais de `selectionchange`, `storage`, `beforeunload`, `mousemove`, `mouseup`, `mousedown` e `message`.

## 10. Estados, variaveis globais, caches e dependencias

### 10.1 Estados e caches principais
- `editorTextosCfg`
- `editorTextosFontesCache`
- `editorTextosFontesPromise`
- `editorTextosAssistMedMenuFiltroTimer`
- `editorTextosAssistAtestadoCidMenuFiltroTimer`
- `editorTextosStandaloneId`
- `editorTextosStandaloneHeartbeatTimer`
- `editorTextosStandaloneLockInit`
- caches e contadores do modelo do documento
- caches de assistente de receitas e assistente de atestado

### 10.2 Dependencias de UI e DOM
- `editorTextosCfg.panel`
- `editorTextosCfg.page`
- `editorTextosCfg.status`
- `editorTextosCfg.work`
- `editorTextosCfg.menuPop`
- `editorTextosCfg.openBackdrop`
- `editorTextosCfg.newBackdrop`
- `editorTextosCfg.mergeBackdrop`
- `editorTextosCfg.tableBackdrop`
- `editorTextosCfg.imageBackdrop`
- `editorTextosCfg.signBackdrop`
- `editorTextosCfg.assistBackdrop`
- `editorTextosCfg.assistAtestadoBackdrop`
- `editorTextosCfg.rulerScale`
- `editorTextosCfg.toolbarSelectionHandler`

### 10.3 Dependencias de usuario, sessao e tenant
- `sessaoAtual`
- `getCurrentUser` no backend
- `current_user.clinica_id`
- `get_current_user`
- dependencia de permissao via `require_module_access("configuracao")`
- dependencia indireta de `fichaPacienteAtualId` nos assistentes
- dependencia de `prestador_id` / `cirurgiao_id` em fluxos de mesclagem e assistentes

### 10.4 Dependencias de modelo e persistencia
- `EDITOR_TEXTOS_DOCUMENT_MODEL_FLAG_KEY`
- `editorTextosDocumentoModel*`
- `editorTextosMesclarConteudoAtual()`
- `editorTextosConteudoParaSalvar()`
- `editorTextosSalvarAtual()`
- `editorTextosSalvarComoAtual()`
- `editorTextosCarregarModelos()`
- `editorTextosAbrirModelo()`

## 11. Fluxos funcionais mapeados

### 11.1 Abertura do editor
- abre pelo menu `Ferramentas > Editor de textos`
- chama `editorTextosAbrir()`
- prepara UI, carrega fontes, modelos e campos
- atualiza o rodape e foca a pagina editavel

### 11.2 Modo standalone
- detectado por `editor_textos=1`
- abre em aba nomeada por `EDITOR_TEXTOS_WINDOW_NAME`
- aplica classe `editor-textos-standalone-mode`
- usa `localStorage` para posse da aba e heartbeat

### 11.3 Listagem de modelos
- `editorTextosCarregarModelos()`
- `GET /editor-textos/modelos`
- renderizacao em modal/lista de abertura

### 11.4 Abertura e carregamento de modelo
- `editorTextosAbrirModelo(modeloId)`
- `GET /editor-textos/modelos/{modelo_id}`
- aplica `conteudo`, `conteudo_formato`, `tipo_modelo`, `extensao`, `pagina_config` e metadados do modelo

### 11.5 Criacao de novo texto/modelo
- `editorTextosAbrirModalNovo()`
- `editorTextosNovoExecutar()`
- `editorTextosNovoPorTipo()`
- `editorTextosNovoDocumento()`
- pode exigir paciente em certos tipos

### 11.6 Edicao
- ocorre na area contenteditable `#editor-textos-page`
- o DOM e o modelo sao sincronizados continuamente
- a toolbar reage a selecao e formatacao

### 11.7 Salvar e salvar como
- `editorTextosSalvarAtual()`
- `editorTextosSalvarComoAtual()`
- usa `POST /editor-textos/modelos` ou `PUT /editor-textos/modelos/{modelo_id}`
- monta conteudo a partir do DOM/pagina e da configuracao de pagina

### 11.8 Renomear e excluir
- `editorTextosOpenContextoRenomearSelecionado()`
- `editorTextosOpenContextoExcluirSelecionado()`
- `PATCH /editor-textos/modelos/{modelo_id}/renomear`
- `DELETE /editor-textos/modelos/{modelo_id}`

### 11.9 Mesclagem de campos
- `editorTextosCarregarCampos()`
- `editorTextosAbrirModalMesclagem()`
- `editorTextosConfirmarInserirMesclagem()`
- `POST /editor-textos/mesclar`

### 11.10 Formatacao rica, imagens, pagina e layout
- toolbar de negrito, italico, sublinhado, alinhamento, lista, fonte, tamanho e cor
- insercao de imagens e redimensionamento
- configuracao de pagina e regua
- normalizacao e renderizacao de tabelas

### 11.11 Impressao, exportacao e PDF
- `editorTextosImprimirAtual()`
- `editorTextosExportarPdfAtual()`
- `editorTextosPrepararPdfNoAppPdf()`
- `editorTextosAbrirPdfPreparadoNoAppPdf()`
- `editorTextosAssinarPdfViaPonteLocal()`
- `editorTextosConfirmarAssinarPdf()`
- `POST /editor-textos/exportar-pdf`
- `POST /editor-textos/preparar-pdf-acrobat`
- `POST /editor-textos/abrir-arquivo-pdf-acrobat`
- `POST /editor-textos/assinar-pdf`
- `POST /editor-textos/registrar-assinatura-local`
- `POST /editor-textos/assistente-receitas/exportar-pdf-template`

## 12. Dependencias de backend/endpoints identificadas

### 12.1 Rotas principais do editor
- `GET /editor-textos/modelos`
- `GET /editor-textos/modelos/{modelo_id}`
- `POST /editor-textos/modelos`
- `PUT /editor-textos/modelos/{modelo_id}`
- `PATCH /editor-textos/modelos/{modelo_id}/renomear`
- `DELETE /editor-textos/modelos/{modelo_id}`
- `GET /editor-textos/campos`
- `POST /editor-textos/mesclar`

### 12.2 Assistentes e PDF
- `GET /editor-textos/assistente-receitas/contexto`
- `GET /editor-textos/assistente-receitas/medicamentos`
- `GET /editor-textos/assistente-atestado/contexto`
- `GET /editor-textos/assistente-atestado/motivos`
- `GET /editor-textos/assistente-atestado/cid`
- `POST /editor-textos/exportar-pdf`
- `POST /editor-textos/assistente-receitas/exportar-pdf-template`
- `POST /editor-textos/assinar-pdf`
- `POST /editor-textos/registrar-assinatura-local`
- `POST /editor-textos/preparar-pdf-acrobat`
- `POST /editor-textos/abrir-no-acrobat`
- `POST /editor-textos/abrir-arquivo-pdf-acrobat`

### 12.3 Dependencias backend visiveis
- `backend/main.py` inclui o router do editor
- `backend/routes/editor_textos_routes.py` usa `get_current_user`
- o router e protegido por `require_module_access("configuracao")`
- ha filtros por `current_user.clinica_id`
- ha consultas de paciente, cirurgiao/prestador, CID e medicamentos
- ha tratamento de PDF, assinatura e ponte local

## 13. Dependencias clinicas, de sessao e permissao

- paciente: aparece na mesclagem, nos assistentes e em varias rotas de PDF;
- profissional: aparece como `cirurgiao_id` / `prestador_id` na mesclagem e nos assistentes;
- clinica: o backend filtra modelos e entidades por `current_user.clinica_id`;
- usuario: o editor depende do usuario autenticado e do contexto da sessao;
- permissoes: acesso protegido por `require_module_access("configuracao")`;
- sessao: `get_current_user`, `sessaoAtual`, `localStorage` do modo standalone e o fluxo de usuario atual influenciam o comportamento;
- ficha/paciente atual: entra como contexto indireto nos assistentes de receitas e atestado.

## 14. Riscos tecnicos identificados

- bloco unico e grande no `frontend/app.js`;
- dependencia de variaveis globais e caches compartilhados;
- DOM rico e extensivo, com muitas camadas visuais;
- edicao rica baseada em `contenteditable`;
- sincronizacao complexa entre DOM, modelo estrutural e toolbar;
- risco de quebrar formatação, cursor e selecao;
- risco de quebrar imagem, tabela, pagina e regua;
- risco de quebrar abrir/listar/salvar/renomear/excluir;
- risco de quebrar mesclagem de campos e assistentes clinicos;
- risco de quebrar exportacao, PDF, assinatura e ponte local;
- risco de acoplar indevidamente paciente, profissional, clinica ou permissao;
- risco alto de mojibake e alteracao textual indevida.

## 15. Pontos que nao devem ser alterados sem contrato proprio

- controle multiarea;
- cadastro de clinica;
- permissões por area;
- perfis;
- seeds;
- banco;
- schema;
- migrations;
- endpoints;
- textos visiveis;
- labels;
- placeholders;
- mensagens;
- layout;
- autenticacao/sessao;
- usuarios/login;
- agenda;
- conta corrente;
- ficha pessoal;
- tabela de proteticos;
- backend funcional do editor;
- assistentes clinicos do editor sem nova decisao documental.

## 16. Plano conservador sugerido para proximas subetapas

- Subetapa 3: isolamento documental dos blocos candidatos;
- Subetapa 4: primeiro recorte minimo, somente se houver helper ou bloco seguro;
- Subetapa 5: teste manual humano;
- Subetapa 6: documentacao e commit seletivo;
- qualquer recorte futuro deve priorizar helpers puros, sem tocar em fluxo clinico, PDF ou standalone sem contrato previo.

## 17. Critérios para permitir uma futura primeira alteracao de codigo
Antes da primeira alteracao funcional futura, precisa haver:

- mapeamento tecnico fechado das dependencias do bloco alvo;
- delimitacao clara do impacto em DOM, eventos e estados globais;
- confirmacao de que a mudanca nao altera comportamento visivel;
- confirmacao de que nao mexe em texto, mojibake ou labels;
- confirmacao de que o fluxo de abrir, carregar, salvar e exportar continua valido;
- teste manual humano planejado para o fluxo afetado;
- commit seletivo e auditavel.

## 18. Onde testar futuramente antes de qualquer alteracao funcional
O teste humano futuro deve começar em:

- `Ferramentas > Editor de textos`

E validar, antes de qualquer alteracao funcional:

- modo standalone;
- abertura de modelo;
- criacao de novo texto/modelo;
- edicao;
- salvar;
- salvar como;
- renomear;
- excluir quando permitido;
- mesclagem de campos;
- formatacao;
- imagens;
- layout/configuracao de pagina;
- impressao/exportacao/PDF;
- uso em prontuario/documentos/modelos, se aplicavel.

## 19. Registro para roadmap
- A frente atual continua sendo Editor de texto.
- Tabela de proteticos permanece pausada/consolidada.
- A Subetapa 1 foi concluida no commit `4839177`.
- Esta Subetapa 2 cria o mapeamento tecnico por leitura.
- O Editor de texto continua classificado preliminarmente como comum/core.
- Nenhum codigo foi alterado.
- Nenhum comportamento foi alterado.
- Nenhuma correcao textual/mojibake foi feita.
- A proxima subetapa recomendada deve ser documental ou, se tecnicamente seguro, preparar o primeiro recorte minimo sem ainda alterar codigo.
- Agenda, Conta corrente, Usuarios/Login, Seeds/tabelas padrao e Ficha pessoal continuam fora desta frente.

## 20. Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_editor_texto_subetapa_2_mapeamento_tecnico.md` deve entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para o arquivo criado.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.
