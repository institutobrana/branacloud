# Subetapa 0 - Mapeamento monolitico de Procedimentos genericos

## 1. Contexto
Esta etapa e exclusivamente documental e faz parte da modularizacao segura.

Informacoes de base:

- branch esperada: `modularizacao-segura-fase-1`
- ultimo commit funcional/documental consolidado: `18b25aa`
- relatorio de recomendacao usado: `docs/recomendacao_proximo_modulo_pos_etiquetas.md`
- modulo escolhido: `Procedimentos genericos`
- motivo da escolha: fronteira mais clara, painel proprio e risco relativo menor

## 2. Comandos iniciais executados
Saidas registradas:

```text
git branch --show-current
modularizacao-segura-fase-1

git status --short
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md

git diff --stat

git log --oneline -10
18b25aa feat(frontend): encerra ciclo seguro dos helpers de etiquetas
1f7ed77 docs: registra varredura do proximo modulo pos-medicamentos
38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares
59da421 feat(frontend): encerra ciclo seguro dos helpers de medicamentos
8a1b799 feat(frontend): encerra ciclo seguro dos helpers de cid
39330d3 feat(frontend): encerra ciclo seguro dos helpers de plano de contas
b415b5c Encerra ciclo seguro de helpers de Unidades
ab102c8 Audita helpers modulares de Unidades
91b65e9 Usa helper modular de telefone em Unidades com fallback
45419a5 Usa helper modular de codigo em Unidades com fallback
```

`docs/recomendacao_proximo_modulo_pos_etiquetas.md` apareceu como pendencia documental pre-existente e foi apenas lido.

## 3. Arquivos lidos
Documentos obrigatorios encontrados e analisados:

- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md`
- `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

Documentos relacionados a Procedimentos, Procedimentos genericos, Materiais e Financeiro:

- nenhum documento dedicado encontrado em `docs/` para esses nomes no momento da analise

Documentos ausentes conhecidos:

- nenhum documento adicional obrigatorio foi identificado como ausente para esta etapa

## 4. Arquivos de codigo analisados
Arquivos analisados:

- `frontend/app.js`
- `frontend/index.html`

## 5. Localizacao do modulo no app.js
O modulo de Procedimentos genericos aparece em mais de um bloco de evolucao dentro de `frontend/app.js`.

Referencia pratica:

- menu action em `frontend/index.html:2636` usa `data-menu-action="tabelas-procedimentos-genericos"`
- dispatcher do menu em `frontend/app.js` chama `pgenAbrir()` em torno de `22895`
- bloco legado com `pgenEnsureUI_LEGACY` / `pgenAbrir_LEGACY` fica entre aproximadamente `3297-3554`
- bloco atual com UI mais rica fica entre aproximadamente `3786-4576`
- o nome `pgenAbrir` e reatribuido novamente em torno de `23175`, o que indica que a versao ativa hoje e a reassignment posterior, nao o primeiro esqueleto legado

Observacao:

- ha duas geracoes do mesmo modulo no arquivo: uma mais simples/legada e outra atual, mais rica e com abas de custos, fases e materiais
- para a navegacao real do sistema, o que vale hoje e a ultima definicao de `pgenAbrir`

## 6. Funcao principal de abertura
Nome provavel da funcao principal de abertura do modulo:

- `pgenAbrir()`

## 7. Funcoes relacionadas
O bloco de Procedimentos genericos e grande e possui dois conjuntos de funcoes: um legado e um atual.

### Abertura / fechamento
- `pgenAbrir_LEGACY()`
- `pgenAbrir()`
- `pgenFecharEditor()`
- `pgenFasesFechar()`
- `pgenFaseEditFechar()`
- `pgenMateriaisFechar()`
- `pgenMaterialEditFechar()`
- `pgenPararArrasteEditor()`

### Renderizacao / listagem
- `pgenRender_LEGACY()`
- `pgenRender()`
- `pgenCarregar_LEGACY()`
- `pgenCarregar()`
- `pgenSelecionado()`
- `pgenSelecionar()`
- `pgenStatusDot()`
- `pgenCorrigirRotulos()`

### Carregamento / lookup / apoio
- `pgenCarregarEspecialidades()`
- `pgenPreencherEspecialidades()`
- `pgenEspecialidadeNome()`
- `pgenTabelaNomePorId()`
- `pgenSimboloDescricao()`
- `pgenCarregarSimbolos()`
- `pgenCarregarAuxFases()`
- `pgenCarregarListasMateriais_LEGACY()`
- `pgenCarregarListasMateriais()`

### Criacao / edicao / salvamento
- `pgenAbrirEditor_LEGACY()`
- `pgenAbrirEditor()`
- `pgenSalvarEditor_LEGACY()`
- `pgenSalvarEditor()`
- `pgenPayloadFromState()`
- `pgenDetalheParaEstado()`
- `pgenEnsureTabData()`

### Exclusao
- `pgenExcluirSelecionado_LEGACY()`
- `pgenExcluirSelecionado()`
- `pgenFaseExcluirSelecionada()`
- `pgenMaterialExcluirSelecionado()`

### Fases
- `pgenFasesSelecionar()`
- `pgenFasesRender()`
- `pgenAbrirFases()`
- `pgenFaseEditAbrir()`
- `pgenFaseEditSalvar()`

### Materiais vinculados
- `pgenMateriaisSelecionar()`
- `pgenMateriaisRender()`
- `pgenAbrirMateriais()`
- `pgenMaterialEditAbrir()`
- `pgenMaterialEditSalvar()`
- `pgenAtualizarCustoMaterialEditor()`

### Calculos / valores / layout
- `pgenTempoTotalExecucao()`
- `pgenCalcularCustos()`
- `pgenPosicionarEditorCentralizado()`
- `pgenMoverEditor()`
- `pgenArrastarEditor()`
- `pgenIniciarArrasteEditor()`

### Binds / eventos
- os binds sao feitos principalmente dentro de `pgenEnsureUI()` e no bloco legado `pgenEnsureUI_LEGACY()`

## 8. Fluxo funcional observado
Fluxo atual de uso:

1. O menu aciona `pgenAbrir()`.
2. O painel e montado por `pgenEnsureUI()`.
3. As especialidades sao carregadas por `pgenCarregarEspecialidades()`.
4. O seletor de especialidade e preenchido e os rotulos sao corrigidos por `pgenCorrigirRotulos()`.
5. O resto da tela e ocultado com `hideAllPanels()`.
6. O painel principal e exibido e `pgenCarregar()` traz a lista.
7. O usuario seleciona um item na grade.
8. Novo ou editar abre o editor principal por `pgenAbrirEditor()`.
9. O editor busca cenario, simbolos, proximo codigo ou detalhe do item.
10. O editor principal suporta abas de principal, custos e vinculos.
11. O salvamento monta payload e envia `POST` ou `PUT` para `procedimentos-genericos`.
12. A exclusao remove o item com confirmacao.
13. O fluxo de fases abre submodal por `pgenAbrirFases()` e persiste via `pgenPersistirFases()`.
14. O fluxo de materiais abre submodal por `pgenAbrirMateriais()` e persiste via `pgenPersistirMateriais()`.
15. O fechamento retorna o workspace ao estado vazio.

Fluxos legados ainda presentes no arquivo:

- `pgenAbrir_LEGACY()` abre uma versao anterior do mesmo modulo
- `pgenMigrar_LEGACY()` aparece apenas no bloco legado e nao faz parte do fluxo ativo atual

Fluxos relacionados a valor, material, financeiro e procedimento:

- custo do procedimento e recalculado com base em `procCenario`
- materiais vinculados afetam o custo total
- fases vinculadas afetam tempo e custo
- simbolo grafico e especialidade entram como lookup e exibicao

## 9. Estado, variaveis globais e caches
Variaveis globais, estados e caches relacionados:

- `pgen`
- `pgenCache`
- `pgenSelId`
- `pgenEditorId`
- `pgenEditorState`
- `pgenEditorBuscaMateriais`
- `pgenFasesAuxCache`
- `pgenFasesSelecionadaIdx`
- `pgenFasesState`
- `pgenFaseEditIdx`
- `pgenMaterialSelecionadoIdx`
- `pgenMaterialEditIdx`
- `pgenDragState`

Dependencias de estado compartilhado:

- `procFiltros`
- `procSimbolosCache`
- `procCenario`
- `workspaceEmpty`
- `footerMsg`

Campos importantes de `pgenEditorState`:

- `id`
- `codigo`
- `descricao`
- `especialidade`
- `tempo`
- `custo_lab`
- `peso`
- `simbolo_grafico`
- `mostrar_simbolo`
- `inativo`
- `observacoes`
- `data_inclusao`
- `data_alteracao`
- `fases`
- `materiais`
- `vinculos`

## 10. DOM, IDs e seletores
IDs e seletores usados pelo modulo:

### Painel principal
- `pgen-panel`
- `pgen-btn-novo`
- `pgen-btn-editar`
- `pgen-btn-excluir`
- `pgen-btn-fases`
- `pgen-btn-materiais`
- `pgen-btn-fechar`
- `pgen-cbo-especialidade`
- `pgen-txt-pesquisar`
- `pgen-tbody`
- `pgen-total`

### Editor principal
- `pgen-editor-backdrop`
- `pgen-editor-modal`
- `pgen-editor-head`
- `pgen-editor-title`
- `pgen-editor-close`
- `pgen-preview`
- `pgen-editor-codigo`
- `pgen-editor-descricao`
- `pgen-editor-especialidade`
- `pgen-editor-peso`
- `pgen-editor-simbolo`
- `pgen-editor-inativo`
- `pgen-editor-obs`
- `pgen-editor-inclusao`
- `pgen-editor-alteracao`
- `pgen-tab-principal`
- `pgen-tab-custos`
- `pgen-tab-vinculos`
- `pgen-pane-principal`
- `pgen-pane-custos`
- `pgen-pane-vinculos`
- `pgen-vinculos-tbody`
- `pgen-vinculos-total`
- `pgen-cd-hora`
- `pgen-cd-tempo-input`
- `pgen-cd-fixo`
- `pgen-cd-protetico-input`
- `pgen-cd-materiais`
- `pgen-cd-total`
- `pgen-editor-cancelar`
- `pgen-editor-gravar`

### Fases
- `pgen-fases-backdrop`
- `pgen-fases-close`
- `pgen-fases-btn-novo`
- `pgen-fases-btn-editar`
- `pgen-fases-btn-excluir`
- `pgen-fases-btn-fechar`
- `pgen-fases-list-tbody`
- `pgen-fases-total`
- `pgen-fase-edit-backdrop`
- `pgen-fase-edit-title`
- `pgen-fase-edit-close`
- `pgen-fase-select`
- `pgen-fase-tempo`
- `pgen-fase-edit-ok`
- `pgen-fase-edit-cancelar`

### Materiais
- `pgen-mats-backdrop`
- `pgen-mats-close`
- `pgen-mats-btn-novo`
- `pgen-mats-btn-editar`
- `pgen-mats-btn-excluir`
- `pgen-mats-btn-fechar`
- `pgen-mats-list-tbody`
- `pgen-mats-total`
- `pgen-mat-edit-backdrop`
- `pgen-mat-edit-title`
- `pgen-mat-edit-close`
- `pgen-mat-lista`
- `pgen-mat-q`
- `pgen-mat-select`
- `pgen-mat-custo-unit`
- `pgen-mat-quantidade`
- `pgen-mat-custo-total`
- `pgen-mat-edit-ok`
- `pgen-mat-edit-cancelar`

Seletores de contexto e estilo observados:

- `.pgen-editor-head`
- `.pgen-editor-tab`
- `.pgen-fases-backdrop`
- `.pgen-mats-backdrop`
- `.pgen-mat-edit-backdrop`
- `.pgen-status-dot`

## 11. Eventos e binds
Eventos observados no modulo:

- `click`
- `dblclick`
- `change`
- `input`
- `blur`
- `mousedown`
- `mousemove`
- `mouseup`

Binds principais:

- toolbar do painel principal
- grade de resultados com click e double click
- tabs do editor principal
- campo de simbolo grafico
- campos numericos de custo/tempo
- buttons do editor principal
- backdrop do editor principal
- cabecalho do editor principal para arraste
- modal de fases e seus botoes
- modal de materiais e seus botoes
- modal de edicao de fase
- modal de edicao de material

## 12. Endpoints/API
Endpoints observados, com funcao e metodo aparente:

- `GET /procedimentos/filtros`
  - funcoes: `pgenCarregarEspecialidades()`, `pgenCarregarFiltros` do bloco de procedimentos
  - finalidade: carregar especialidades e tabelas usadas como apoio
  - retorno esperado: listas de especialidades e tabelas

- `GET /cadastros/procedimentos-genericos?q=...&especialidade=...`
  - funcao: `pgenCarregar()`
  - metodo: `GET`
  - finalidade: listar procedimentos genericos
  - retorno esperado: lista de itens do catalogo

- `GET /cadastros/procedimentos-genericos/detalhe/:id`
  - funcoes: `pgenAbrirEditor()`, `pgenAbrirFases()`, `pgenAbrirMateriais()`
  - metodo: `GET`
  - finalidade: carregar detalhe do procedimento generico
  - retorno esperado: objeto com campos do procedimento, fases, materiais e vinculos

- `GET /cadastros/procedimentos-genericos/proximo-codigo`
  - funcao: `pgenAbrirEditor()`
  - metodo: `GET`
  - finalidade: sugerir proximo codigo
  - retorno esperado: codigo sugerido

- `POST /cadastros/procedimentos-genericos`
  - funcao: `pgenSalvarEditor()`
  - metodo: `POST`
  - finalidade: criar novo procedimento generico
  - payload aparente: `codigo`, `descricao`, `especialidade`, `tempo`, `custo_lab`, `peso`, `simbolo_grafico`, `mostrar_simbolo`, `inativo`, `observacoes`, `fases`, `materiais`

- `PUT /cadastros/procedimentos-genericos/:id`
  - funcoes: `pgenSalvarEditor()`, `pgenPersistirFases()`, `pgenPersistirMateriais()`
  - metodo: `PUT`
  - finalidade: atualizar procedimento generico, fases e materiais
  - payload aparente: mesmo modelo do POST, com `id` na rota

- `DELETE /cadastros/procedimentos-genericos/:id`
  - funcao: `pgenExcluirSelecionado()`
  - metodo: `DELETE`
  - finalidade: excluir procedimento generico

- `GET /cadastros/simbolos-graficos?scope=genericos`
  - funcao: `pgenCarregarSimbolos()`
  - metodo: `GET`
  - finalidade: carregar simbolos grafico disponiveis para o catalogo

- `GET /cadastros/auxiliares?tipo=Fase procedimento`
  - funcao: `pgenCarregarAuxFases()`
  - metodo: `GET`
  - finalidade: carregar fases auxiliares

- `GET /materiais/listas`
  - funcoes: `pgenCarregarListasMateriais()`, legado `pgenCarregarListasMateriais_LEGACY()`
  - metodo: `GET`
  - finalidade: carregar classificacoes/tabelas de materiais

- `GET /materiais?lista_id=...&q=...&classificacao=__todos__`
  - funcao: `pgenBuscarMateriais()`
  - metodo: `GET`
  - finalidade: buscar materiais para o editor de materiais vinculados

Observacao:

- o bloco legado tambem tinha `POST /cadastros/procedimentos-genericos/migrar`, mas esse caminho nao faz parte do bloco ativo atual e deve continuar sem tocada nesta etapa

## 13. Dependencias compartilhadas
Dependencias globais e utilitarios compartilhados usados pelo modulo:

- `requestJson`
- `hideAllPanels`
- `ensurePanelChrome`
- `workspaceEmpty`
- `footerMsg`
- `esc`
- `procFmtBr`
- `procFmtMoeda`
- `procParse`
- `procPreencherSelect`
- `procGarantirOpcaoSelect`
- `procSetSelectValue`
- `procFmtAuxLabel`
- `procFmtSimboloLabel`
- `procSimbolosCache`
- `procCenario`
- `procFiltros`
- `window.alert`
- `window.confirm`
- `window.addEventListener`

Dependencias com outros modulos / dominios:

- `Procedimentos` real: dependencia forte
- `Materiais`: dependencia forte
- `Financeiro`: dependencia moderada/alta por custo calculado
- `Tabelas auxiliares`: dependencia moderada por `Fase procedimento`
- `Simbolos graficos`: dependencia moderada por lookup visual

## 14. Candidatos a helpers puros
Candidatos realmente seguros identificados nesta Subetapa 0:

### `pgenStatusDot(inativo)`
- responsabilidade: montar o indicador visual de status
- entrada esperada: booleano ou valor convertivel em booleano
- saida esperada: string HTML com a classe do ponto de status
- por que parece seguro: nao acessa DOM, fetch, estado global nem muta nada
- riscos: muito baixo; depende apenas do contrato visual da classe CSS

### `pgenPayloadFromState(state)`
- responsabilidade: normalizar um objeto de estado do editor para payload de persistencia
- entrada esperada: objeto com campos de procedimento generico, fases e materiais
- saida esperada: objeto payload pronto para `POST`/`PUT`
- por que parece seguro: e uma transformacao deterministica do argumento recebido
- riscos: medio, porque o formato do estado precisa permanecer estavel; se o contrato de campos mudar, o helper precisa ser ajustado

Helpers aparentados, mas nao seguros o bastante ainda:

- `pgenEspecialidadeNome(codigo)` depende de `procFiltros`
- `pgenTabelaNomePorId(tabelaId)` depende de `procFiltros`
- `pgenSimboloDescricao(codigo)` depende de `procSimbolosCache`
- `pgenDetalheParaEstado(data)` depende de lookup de tabela via cache compartilhado
- `pgenCalcularCustos()` depende de DOM e de `procCenario`

## 15. O que NAO mover por enquanto
Trechos e funcoes que devem permanecer no `app.js` nas proximas subetapas:

- a abertura principal do painel `pgenAbrir()`
- binds do menu, botões e subdialogs
- chamadas de API
- persistencia de fases, materiais e procedimento
- exclusao
- manipulação direta de DOM
- modais e submodais
- valores / calculos monetarios
- vinculos com Procedimentos
- vinculos com Materiais
- qualquer fluxo que converse com outro modulo
- arraste do editor
- correcao de rotulos / textos do editor

## 16. Riscos especificos
Riscos tecnicos observados:

- acoplamento alto com `app.js`
- dependencia de DOM criado dinamicamente
- risco de quebra de bind ao separar o editor principal e seus subdialogos
- risco de item selecionado / caches quando o usuario alterna fases ou materiais
- risco em salvar / excluir por persistir o objeto inteiro do procedimento
- risco de endpoints nao mapeados do bloco legado
- risco de calculo monetario / casas decimais / virgula
- risco de dependencia com Procedimentos reais
- risco de dependencia com Materiais
- risco de dependencia com Financeiro
- risco de encoding / textos acentuados, ja visivel em varios rotulos do arquivo

## 17. Recomendacao conservadora para Subetapa 1
Recomendacao conservadora:

Criar futuramente:

- `frontend/js/modules/procedimentos-genericos.js`

como namespace passivo/controlado.

Na Subetapa 1, permitir apenas:

- criar `window.BranaProcedimentosGenericosModule`
- expor `getInfo()`
- expor `getStatus()`
- opcionalmente expor constantes informativas/documentais
- carregar o script no `frontend/index.html` antes do `app.js`

Na Subetapa 1, nao permitir:

- mover funcoes do `app.js`
- delegar comportamento
- alterar abertura do painel
- alterar listagem
- alterar edicao
- alterar salvamento
- alterar exclusao
- alterar endpoints
- criar wrappers funcionais
- mexer em backend ou banco

## 18. Onde testar antes de avancar
Indicar exatamente onde testar no sistema:

1. Abrir o sistema no navegador com Ctrl+F5.
2. Abrir `Procedimentos genericos` pelo menu correspondente.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Selecionar um item.
6. Abrir edicao.
7. Fechar modal ou painel, se existir.
8. Salvar apenas se for seguro e reversivel.
9. Excluir apenas se for seguro e reversivel; se nao for seguro, nao testar exclusao nesta etapa.
10. Fechar e reabrir o painel.
11. Confirmar console sem `ReferenceError` ou `TypeError`.

## 19. Checks finais
Estado esperado da proxima etapa:

```text
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
?? docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md
```

Nao deve haver alteracao em:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- backend
- banco
- endpoints

## 20. Confirmacao final
- Nenhum codigo funcional foi alterado
- `frontend/app.js` nao foi alterado
- `frontend/index.html` nao foi alterado
- `frontend/js/modules` nao foi alterado
- backend nao foi alterado
- banco nao foi alterado
- endpoints nao foram alterados
- nenhum modulo `frontend/js/modules/procedimentos-genericos.js` foi criado
- nenhum namespace passivo foi criado nesta etapa
- nenhum commit foi feito
- a etapa foi somente documental
