# Materiais - Subetapa 0 - Mapeamento Monolitico

## 0. Contexto, blindagem e escopo

Este documento e somente documental.
Nenhum codigo funcional foi alterado.
Nenhum arquivo de `frontend/app.js`, `frontend/index.html`, `frontend/js/modules`, `backend`, banco ou endpoints foi modificado.

Diretorio real de trabalho confirmado:

- `D:\BRANA ARQUIVOS\BRANA CLOUD`

Arquivos analisados nesta etapa:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html`

Documentos de apoio consultados quando presentes no `docs/`:

- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\regras_blindagem_correcoes_textuais_mojibake.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\recomendacao_proximo_modulo_pos_simbolos_graficos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\simbolos_graficos_subetapa_0_mapeamento_monolitico.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\simbolos_graficos_subetapa_7_consolidacao_helpers.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\convenios_planos_subetapa_5_encerramento_ciclo.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\recomendacao_proximo_modulo_pos_convenios_planos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\recomendacao_proximo_modulo_pos_procedimentos_genericos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\recomendacao_proximo_modulo_pos_prestadores.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\recomendacao_proximo_modulo_pos_etiquetas.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\recomendacao_proximo_modulo_pos_auxiliares.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\varredura_proximo_modulo_pos_medicamentos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\varredura_proximo_modulo_pos_cid.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\varredura_proximo_modulo_pos_plano_contas.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\frontend_auditoria_appjs.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\11_roadmap_desenvolvimento.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\04_funcionalidades.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\07_fluxos.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\10_continuidade.md`
- `D:\BRANA ARQUIVOS\BRANA CLOUD\docs\03_mapa_codigo.md`

No recorte verificado, nao identifiquei documento obrigatorio ausente dentre os itens listados acima.

## 1. Escopo do modulo Materiais

### O que parece fazer parte do modulo

- Tela principal de listagem/tabela de materiais.
- Filtro por tabela/lista de materiais.
- Filtro por classificacao.
- Busca textual.
- Modal principal de cadastro/edicao de material.
- Modal auxiliar de cadastro/edicao de tabela de materiais.
- Calculo de custo unitario a partir de preco e relacao.
- CRUD de material.
- CRUD de tabela de materiais.
- Carregamento de combos auxiliares para classificacao, unidades, fabricantes e apresentacao.

### O que nao deve ser considerado parte do modulo nesta fase

- Procedimentos e vinculacao de materiais a procedimentos.
- Procedimentos genericos e seus materiais vinculados.
- Unidades de atendimento, mesmo que consumam o helper auxiliar de logradouro.
- Qualquer extracao de namespace, helper ou modulo novo.
- Qualquer ajuste textual, acento, label ou mojibake.
- Qualquer alteracao em `index.html`, `app.js`, `backend`, banco ou endpoints.

### Relacoes aparentes com outros modulos

- Procedimentos consome listas de materiais e usa materiais vinculados.
- Procedimentos genericos tambem consomem listas de materiais e persistem materiais vinculados.
- Unidades consome `materiaisCarregarAuxTipo()` para completar tipos de logradouro.
- Auxiliares/Tabelas auxiliares fornecem os dados de classificacao, unidades, fabricantes e apresentacao.
- Relacao indireta com cenarios e financeiro existe por causa de custo/preco, mas nao ha chamada direta do bloco Materiais para esses modulos.

## 2. Funcao principal de abertura

### Funcao identificada

- `abrirMateriais()` em `frontend/app.js:668`

### Como e chamada

- Pelo botao de toolbar `#btn-open-materiais` em `frontend/index.html:2693`
- Pelo bind `m.btnOpen.addEventListener("click",abrirMateriais)` em `frontend/app.js:23157`
- Pelo dispatcher do menu/acao em `frontend/app.js`:
  - `if(action==="materiais"||action==="tabelas-materiais"){ await abrirMateriais(); }` em torno de `frontend/app.js:22888`

### Dependencia de tela/painel

- A abertura depende de painel proprio, nao de aba interna.
- O fluxo chama `showMateriaisPanel(true)`, que usa `hideAllPanels()` e exibe `materiaisPanel`.
- A tela principal e um painel, e o modal de edicao e separado.

## 3. Funcoes relacionadas

### Abertura

- `abrirMateriais()`
- `showMateriaisPanel(s)`

### Fechamento

- `materiaisFecharModal()`
- `materiaisTabelaFecharModal()`
- `closeModalByBackdropId()` tem roteamento para `materiais-modal-backdrop` e `materiais-tabela-modal-backdrop`

### Criacao de UI

- `showMateriaisPanel(s)` usa o painel ja existente.
- A estrutura visual de Materiais e criada no HTML estatico do `index.html`.
- `ensurePanelChrome()` e `ensureModalChrome()` padronizam o chrome visual do painel e dos modais.

### Carregamento / listagem

- `materiaisCarregarAuxTipo(tipo)`
- `materiaisCarregarFiltroClassificacao(prefer)`
- `materiaisCarregarCombosModal()`
- `materiaisCarregarIndicesTabela(prefer)`
- `materiaisCarregarListas(preferId)`
- `materiaisCarregar()`
- `materiaisNovoCodigo(listaId)`

### Renderizacao

- `materiaisRender()`
- `materiaisSetTotal()`

### Selecao

- `materiaisSelecionar(id)`
- `materiaisSelecionadoAtual()`
- `materiaisListaIdAtual()`
- `materiaisListaAtual()`

### Novo cadastro

- `materiaisAbrirModal(item)` quando `item` e nulo
- `materiaisNovoCodigo(listaId)`

### Edicao

- `materiaisAbrirModal(item)` quando `item` existe
- `materiaisTabelaAbrirModal(modo)` quando o modo e `altera`

### Salvar

- `materiaisSalvarModal()`
- `materiaisTabelaSalvarModal()`

### Excluir / inativar

- `materiaisExcluirSelecionado()`
- `materiaisExcluirTabela()`

### Filtros / buscas

- `materiaisFiltroClassificacaoAtual()`
- `materiaisCarregarFiltroClassificacao()`
- `materiaisCarregar()`
- `materiaisCarregarListas()`

### Eventos / binds

- `bindStandardGridActivation(...)` nao e usado no bloco Materiais; o bloco usa binds diretos na grade.
- Binds diretos no `tbody` de Materiais para `click` e `dblclick`.
- Binds diretos em botao, tabs e inputs.

### Formatacao / conversao

- `parseMaterialNumber(v)`
- `formatDec2(v)`
- `formatDec2Dot(v)`

### Validacao

- Validacao de codigo e nome obrigatorios em `materiaisSalvarModal()`
- Validacao numerica de preco, relacao e custo em `materiaisSalvarModal()`
- Validacao numerica da quantidade de linhas e indice em `materiaisTabelaSalvarModal()`
- Validacao de selecao de item em `materiaisExcluirSelecionado()` e `materiaisExcluirTabela()`

### Helpers internos

- `materiaisSetSelectValue(el,val)`
- `materiaisUniqueAuxDescricoes(arr)`
- `materiaisCalcularCustoModal()`
- `materiaisTabelaAtualNome()`
- `materiaisTabelaAtualIndice()`
- `materiaisSetModalTab(tab)`
- `materiaisLimparTabela()`

## 4. UI e DOM

### Contratos DOM principais do painel

- Painel: `#materiais-panel`
- Botao de abertura: `#btn-open-materiais`
- Combo de listas: `#materiais-cbo-listas`
- Combo de classificacao: `#materiais-cbo-classificacao`
- Botao nova tabela: `#materiais-btn-nova-tabela`
- Botao alterar tabela: `#materiais-btn-altera-tabela`
- Botao excluir tabela: `#materiais-btn-excluir-tabela`
- Botao fechar painel: `#materiais-btn-fechar`
- Botao novo material: `#materiais-btn-novo`
- Botao editar material: `#materiais-btn-editar`
- Botao excluir material: `#materiais-btn-excluir`
- Campo de pesquisa: `#materiais-txt-pesquisar`
- Tbody da grade: `#materiais-tbody`
- Total: `#materiais-total`

### Contratos DOM do modal principal

- Backdrop: `#materiais-modal-backdrop`
- Titulo: `#materiais-modal-title`
- Tabs: `#materiais-modal-tab-principal-btn`, `#materiais-modal-tab-detalhes-btn`
- Painel principal: `#materiais-modal-tab-principal`
- Painel detalhes: `#materiais-modal-tab-detalhes`
- Codigo: `#materiais-modal-codigo`
- Nome: `#materiais-modal-nome`
- Preco: `#materiais-modal-preco`
- Relacao: `#materiais-modal-relacao`
- Custo: `#materiais-modal-custo`
- Classificacao: `#materiais-modal-classificacao`
- Unidade de compra: `#materiais-modal-und-compra`
- Unidade de consumo: `#materiais-modal-und-consumo`
- Validade: `#materiais-modal-validade`
- Preferido: `#materiais-modal-preferido`
- Fabricante: `#materiais-modal-fabricante`
- Apresentacao: `#materiais-modal-apresentacao`
- Observacao: `#materiais-modal-observacao`
- Cancelar: `#materiais-modal-cancelar`
- Gravar: `#materiais-modal-gravar`

### Contratos DOM do modal de tabela

- Backdrop: `#materiais-tabela-modal-backdrop`
- Titulo: `#materiais-tabela-modal-title`
- Label: `#materiais-tabela-modal-label`
- Nome: `#materiais-tabela-modal-nome`
- Indice: `#materiais-tabela-modal-indice`
- OK: `#materiais-tabela-modal-ok`
- Cancelar: `#materiais-tabela-modal-cancelar`
- Fechar: `#materiais-tabela-modal-close`
- Hotkeys: `.materiais-tabela-hotkey`

### Classes relevantes

- `.materiais-btn`
- `.materiais-panel`
- `.materiais-lista-select`
- `.materiais-top-group`
- `.materiais-top-actions`
- `.materiais-action-row`
- `.materiais-divider`
- `.materiais-filters`
- `.materiais-head`
- `.materiais-table-wrap`
- `.materiais-table`
- `.materiais-modal-stack`
- `.materiais-modal-top`
- `.materiais-modal-name`
- `.materiais-modal-line`
- `.materiais-modal-form-row`
- `.materiais-modal-detail`
- `.materiais-modal-preferido`
- `.materiais-tabela-modal-body`
- `.materiais-tabela-modal-frame`
- `.materiais-tabela-modal-grid`

### Contratos DOM observados no HTML

- O botao de abertura aparece no toolbar principal em `frontend/index.html:2693`.
- O painel de Materiais aparece em `frontend/index.html:2903`.
- O modal principal aparece em `frontend/index.html:3421`.
- O modal de tabela aparece em `frontend/index.html:3495`.

## 5. Eventos e binds

### Binds do modulo Materiais

- `m.btnOpen.addEventListener("click",abrirMateriais)`
- `m.btnFechar.addEventListener("click",()=>showMateriaisPanel(false))`
- `m.cboListas.addEventListener("change",materiaisCarregar)`
- `m.cboClassificacao.addEventListener("change",materiaisCarregar)` quando existe
- `m.txtPesquisar.addEventListener("input",materiaisCarregar)`
- `m.btnNovaTabela.addEventListener("click",materiaisCriarTabela)`
- `m.btnAlteraTabela.addEventListener("click",materiaisAlterarTabela)`
- `m.btnExcluirTabela.addEventListener("click",materiaisExcluirTabela)`
- `m.btnNovo.addEventListener("click",()=>materiaisAbrirModal(null))`
- `m.btnEditar.addEventListener("click",...)`
- `m.btnExcluir.addEventListener("click",materiaisExcluirSelecionado)`
- `m.btnModalCancelar.addEventListener("click",materiaisFecharModal)`
- `m.btnModalGravar.addEventListener("click",materiaisSalvarModal)`
- `m.tabBtnPrincipal.addEventListener("click",()=>materiaisSetModalTab("principal"))`
- `m.tabBtnDetalhes.addEventListener("click",()=>materiaisSetModalTab("detalhes"))`
- `m.txtPreco.addEventListener("input",materiaisCalcularCustoModal)`
- `m.txtRelacao.addEventListener("input",materiaisCalcularCustoModal)`
- `m.tbody.addEventListener("click",...)`
- `m.tbody.addEventListener("dblclick",...)`
- `materiaisTabelaModal.btnOk.addEventListener("click",materiaisTabelaSalvarModal)`
- `materiaisTabelaModal.btnCancelar.addEventListener("click",materiaisTabelaFecharModal)`
- `materiaisTabelaModal.btnClose.addEventListener("click",materiaisTabelaFecharModal)`
- `materiaisTabelaModal.backdrop.addEventListener("click",...)`
- `materiaisTabelaModal.hotkeys.forEach(...keydown...)`

### Pontos sensiveis de clique e duplo clique

- Clique em linha da grade seleciona material.
- Duplo clique em linha da grade reabre o item para edicao.
- O comportamento de duplo clique e manual, nao usa `bindStandardGridActivation()`.
- O modal de tabela fecha ao clicar no backdrop.

## 6. Dados, estado e caches

### Variaveis e caches do modulo

- `materiaisCache`
- `materialSelecionadoId`
- `materialModalId`
- `materiaisAuxTiposCache`
- `materiaisAuxUndsCache`
- `materiaisListasCache`
- `materiaisIndicesCache`
- `materiaisTabelaModalModo`
- `materiaisTabelaModalListaId`

### Dependencias em estado compartilhado

- `workspaceEmpty`
- `footerMsg`
- `requestJson`
- `esc`
- `hideAllPanels`
- `ensurePanelChrome`
- `ensureModalChrome`
- `parseMaterialNumber`
- `formatDec2`
- `formatDec2Dot`

### Dependencias em `window`, `localStorage`, `sessionStorage` e caches globais

- Nao foi identificado uso direto de `window.localStorage` ou `window.sessionStorage` no bloco Materiais.
- Nao foi identificado `window.BranaMateriaisModule`.
- Nao foi identificado `window.materiais...` como contrato publico de modulo.
- O estado do modulo e mantido por variaveis globais no monolito.

## 7. requestJson, fetch, endpoints e payloads

### Endpoints encontrados no bloco Materiais

#### Leitura de auxiliares e indices

- `GET /cadastros/auxiliares?tipo=Tipos de material`
- `GET /cadastros/auxiliares?tipo=Unidades de medida`
- `GET /cadastros/auxiliares?tipo=Fabricantes`
- `GET /cadastros/auxiliares?tipo=Tipos de apresentação`
- `GET /materiais/indices`

#### Listas de materiais

- `GET /materiais/listas`
- `POST /materiais/listas`
- `PATCH /materiais/listas/{listaId}`
- `DELETE /materiais/listas/{listaId}`

#### Materiais da lista

- `GET /materiais?lista_id={listaId}&q={q}&classificacao={cls}`
- `GET /materiais/listas/{listaId}/proximo-codigo`
- `POST /materiais`
- `PUT /materiais/{materialId}`
- `DELETE /materiais/{materialId}`

### Metodos HTTP identificados

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`

### Payloads enviados

#### Salvar material

Payload de `materiaisSalvarModal()`:

- `codigo`
- `nome`
- `preco`
- `relacao`
- `custo`
- `lista_id`
- `unidade_compra`
- `unidade_consumo`
- `validade_dias`
- `preferido`
- `classificacao`

#### Salvar tabela de materiais

Payload de `materiaisTabelaSalvarModal()`:

- `nome`
- `nro_indice`

### Respostas esperadas

- `materiaisCarregarListas()` espera array de listas.
- `materiaisCarregar()` espera array de materiais.
- `materiaisNovoCodigo()` espera objeto com `codigo`.
- `materiaisCarregarIndicesTabela()` espera array de indices ou usa fallback local.
- `materiaisSalvarModal()` espera retorno com `id` quando for criacao.
- `materiaisTabelaSalvarModal()` espera retorno com `id` da tabela.

### Riscos de payload

- Preco, relacao e custo sao valores numericos sensiveis.
- `validade_dias` e inteiro, entao ha risco de conversao indevida.
- `classificacao`, `unidade_compra` e `unidade_consumo` dependem de combos auxiliares.
- O bloco faz conversao entre texto de entrada e numero usando formatacao brasileira.

## 8. Dependencias com outros modulos

### Procedimentos

Relacoes encontradas:

- `procVinculaCarregarListas()` usa `GET /materiais/listas`
- `procVinculaCarregarMateriais()` usa `GET /materiais?lista_id=...&q=...`
- `procVinculaMaterialSelecionado()` usa o custo do material carregado
- `procVinculaAtualizarCustoTotal()` multiplica custo unitario por quantidade
- `procConfirmarVinculo()` grava material vinculado ao procedimento
- `procDesvincularSelecionado()` remove vinculo por codigo
- `procEditarVinculoSelecionado()` altera quantidade do vinculo

Impacto:

- Materiais alimenta o custo e a composicao do procedimento.
- Materiais nao deve ser separado cedo demais de regras de vinculo, porque o procedimento consome o dado de custo.

### Procedimentos Genericos

Relacoes encontradas:

- `pgenCarregarListasMateriais_LEGACY()` usa `GET /materiais/listas`
- `pgenBuscarMateriais_LEGACY()` usa `GET /materiais?lista_id=...&q=...&classificacao=__todos__`
- `pgenAdicionarMaterial_LEGACY()` monta material vinculado no editor
- `pgenPersistirMateriais()` grava materiais do procedimento generico
- `pgenAbrirMateriais()` usa o fluxo de materiais no editor legado

Impacto:

- Materiais e uma dependencia funcional do editor de procedimentos genericos.
- A extracao prematura do bloco pode quebrar o fluxo de vinculacao de materiais no editor.

### Convênios e Planos

- Nao encontrei chamada direta do bloco Materiais para convênios ou planos.
- Dependencia aparente e indireta, via outros modulos que usam custos e tabelas.

### Cenário financeiro

- Nao encontrei chamada direta do bloco Materiais para o cenário financeiro.
- A relacao e conceitual, por custo e preco, mas nao ha integracao direta no bloco analisado.

### Financeiro

- Nao encontrei endpoint financeiro direto no bloco Materiais.
- O cuidado aqui e apenas documental: preco e custo podem impactar outros calculos, mas nao ha chamada financeira propria do modulo.

### Unidades

- `unidadeAbrirModal()` chama `materiaisCarregarAuxTipo("Tipos de logradouro")`
- O helper de auxiliares de Materiais e compartilhado com o modulo de Unidades

### Auxiliares / Tabelas auxiliares

- Materiais consome os auxiliares por tipo para montar listas e combos.
- O modulo depende de `GET /cadastros/auxiliares?tipo=...`.

### Estoque

- Nao identifiquei modulo de estoque com integracao direta ao bloco Materiais neste recorte.

### Outros modulos encontrados na varredura

- `Procedimentos`
- `Procedimentos genericos`
- `Unidades`
- `Auxiliares`

## 9. Riscos

### Riscos funcionais

- Se `abrirMateriais()` for extraida cedo demais, a listagem deixa de abrir corretamente no painel principal.
- O modal principal depende de selecao, carregamento de combos e calculo de custo.
- A grade depende de selecao de linha e duplo clique.
- O modal de tabela tem um segundo fluxo independente, o que amplia o risco de regressao.

### Riscos de payload

- Payload de material combina strings, inteiros e decimais.
- O backend pode rejeitar codigo ja usado, e o bloco trata isso com mensagem especifica.
- A estrutura de tabela depende de `lista_id` e `nro_indice`.

### Riscos de calculo

- `materiaisCalcularCustoModal()` usa divisao `preco / relacao`.
- `parseMaterialNumber()` aceita conversao simplificada de virgula para ponto.
- O custo unitario pode ficar errado se o usuario digitar formatos inesperados.

### Riscos de formatacao numerica brasileira

- O bloco mistura `formatDec2`, `formatDec2Dot`, `parseMaterialNumber` e conversao de texto numerico.
- Existe risco com virgula, ponto e casas decimais ao editar preco e relacao.
- `formatDec2Dot` e usado para gravar/mostrar valor tecnico com ponto decimal.

### Riscos de texto, mojibake e labels

- Foi observada string textual com problema de escrita em UI, por exemplo `Pesquiar material:` no HTML do painel.
- Tambem ha outros textos do sistema com sinais de mojibake em arquivos e respostas do console.
- Nenhum texto foi corrigido nesta etapa.

### Riscos de integracao com Procedimentos e Procedimentos Genericos

- O vinculo de materiais e usado para custo de procedimentos.
- O editor de procedimentos genericos tambem persiste materiais.
- Isso torna perigosa qualquer extracao prematura do fluxo de salvamento ou exclusao.

## 10. Helpers puros candidatos - somente no papel

### Baixo risco

- `materiaisUniqueAuxDescricoes(arr)`
  - Filtra descricoes unicas de um array simples.
  - Nao depende de DOM, fetch, evento ou estado mutavel sensivel.

### Risco medio

- `formatDec2(v)`
  - E helper puro, mas participa da renderizacao numerica da grade.
  - Deve ser tratado com cautela por causa de padrao numerico e exibicao de valores.

- `formatDec2Dot(v)`
  - E helper puro, mas alimenta o custo tecnico do modal.
  - Tem risco numerico indireto por tocar preco e relacao.

### Risco alto

- `parseMaterialNumber(v)`
  - E puro no sentido tecnico, mas e critico para preco, relacao e custo.
  - Qualquer erro nele afeta calculo, payload e persistencia.

### Fora do recorte de helpers candidatos

- `materiaisSetSelectValue()` nao entra como helper puro porque escreve no DOM.
- `materiaisListaIdAtual()`, `materiaisListaAtual()`, `materiaisSelecionadoAtual()` e `materiaisTabelaAtualNome()` dependem de DOM e estado.
- `materiaisRender()` e `materiaisSetTotal()` mexem na interface.

## 11. O que nao deve ser movido cedo

- `abrirMateriais()`
- `showMateriaisPanel()`
- `materiaisCarregarAuxTipo()`
- `materiaisCarregarFiltroClassificacao()`
- `materiaisCarregarCombosModal()`
- `materiaisCarregarIndicesTabela()`
- `materiaisCarregarListas()`
- `materiaisCarregar()`
- `materiaisNovoCodigo()`
- `materiaisCalcularCustoModal()`
- `materiaisAbrirModal()`
- `materiaisFecharModal()`
- `materiaisSalvarModal()`
- `materiaisExcluirSelecionado()`
- `materiaisTabelaFecharModal()`
- `materiaisTabelaAbrirModal()`
- `materiaisTabelaSalvarModal()`
- `materiaisCriarTabela()`
- `materiaisAlterarTabela()`
- `materiaisExcluirTabela()`
- `materiaisRender()`
- `materiaisSetTotal()`
- `materiaisSelecionar()`
- `bindStandardGridActivation()` e binds de grade relacionados, mesmo que seja helper genérico do arquivo
- qualquer `requestJson()` ou `fetch()`
- qualquer endpoint
- qualquer payload
- qualquer calculo de custo, preco, relacao ou validade
- qualquer fluxo de modal ou selecao de linha
- qualquer integracao com Procedimentos ou Procedimentos Genericos

## 12. Recomendacao para Subetapa 1

Recomendacao tecnica conservadora:

- Criar futuramente o namespace passivo `window.BranaMateriaisModule`.
- Arquivo futuro sugerido: `frontend/js/modules/materiais.js`.
- A Subetapa 1 deve ser passiva:
  - `ativo: false`
  - `controlaFluxo: false`
  - sem DOM
  - sem `requestJson`
  - sem `fetch`
  - sem eventos
  - sem mover logica
  - sem alterar comportamento

Motivo:

- O bloco Materiais depende fortemente de DOM, grade, modais, payload e numericos.
- Por isso, a primeira extracao segura deve ser apenas um contrato passivo e nao a logica funcional.

## 13. Confirmacao final da etapa

- Blindagem textual e mojibake respeitada.
- Nenhum texto, acento, label, mensagem, placeholder ou string visivel foi alterado.
- Nenhum comportamento foi alterado.
- Nenhuma parte de `backend`, banco ou endpoints foi modificada.

