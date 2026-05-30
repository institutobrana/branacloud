# Fase 2C - Contrato especifico de toolbar e acoes visuais do Editor de Textos

## 1. Objetivo

- Mapear a toolbar e as acoes visuais do Editor de Textos.
- Separar o que pode ser extraido de forma segura daquilo que continua acoplado a selecao, DOM rico, salvamento e fluxos sensiveis.
- Definir se o proximo recorte real deve continuar no Editor de Textos e, em caso positivo, qual fronteira visual e pequena pode ser atacada primeiro.

## 2. Decisao de origem

- Decisao de origem: `F2C-EDITOR-DEC-B`.

## 3. Contexto da primeira implementacao real ja validada

- A primeira implementacao real da Fase 2C no Editor de Textos ja foi executada e validada manualmente.
- Fluxo validado: `bootstrap/shell visual`.
- Commits relevantes:
  - implementacao: `8e16fd3`
  - validacao manual: `3d5b2c8`
  - decisao pos-validacao: `56e245b`
- O usuario relatou: `testes passaram, tudo ok, nao encontrei problemas`.

## 4. Mapa de arquivos

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `frontend/index.html` apenas leitura para entender os scripts carregados.
- Nenhum outro modulo do Editor de Textos foi necessario para a leitura atual, mas futuros helpers podem viver no proprio bootstrap ou em modulo novo, se tecnicamente justificado.

## 5. Funcoes relacionadas a toolbar e acoes visuais

### 5.1 Atualizacao visual da toolbar

- `editorTextosSincronizarToolbarFormato(force=false)`
  - calcula estado visual de negrito, italico, sublinhado e alinhamento;
  - sincroniza combo de fonte, tamanho e cor;
  - atualiza a toolbar com base na selecao/caret e no elemento foco.

- `editorTextosAgendarSincronizarToolbar(force=false)`
  - agenda a sincronizacao visual da toolbar;
  - usa `requestAnimationFrame` ou `setTimeout`.

- `editorTextosSetToolbarButtonAtivo(btn, ativo)`
  - aplica estado visual ativo/inativo do botao;
  - atualiza `aria-pressed`.

- `editorTextosAtualizarVisualComboCor()`
  - atualiza o texto/estado visual do combo de cor;
  - sincroniza o item ativo do combo.

### 5.2 Criacao/ativacao visual de botões

- Botões da toolbar declarados no shell do Editor de Textos:
  - `btnNegrito`
  - `btnItalico`
  - `btnSublinhado`
  - `btnEsq`
  - `btnCentro`
  - `btnDir`
  - `btnJustificar`
  - `btnLista`
  - `btnImagem`
  - `btnTabela`
  - `btnPagina`
  - `btnAbrir`
  - `btnNovo`
  - `btnSalvar`
  - `btnSalvarComo`
  - `btnImprimir`
  - `btnFechar`
  - `btnInserirCampo`
  - `btnGerarPdf`

### 5.3 Acoes de formatacao visual / comandos de edicao

- `runCmd(cmd, val)`
  - dispara comandos de edicao visual.
- `editorTextosPrepararRangeToolbar()`
  - prepara range para acoes de cor.
- `editorTextosSelecaoTemSublinhado()`
  - verifica underline de forma auxiliar.

### 5.4 Acoes que ja tocam fluxos sensiveis

- `editorTextosSalvarAtual(forceNew=false, forcedName="")`
  - salvamento.
- `editorTextosSalvarComoAtual()`
  - salvamento.
- `editorTextosImprimirAtual()`
  - impressao.
- `editorTextosExportarPdfAtual()`
  - PDF.
- `editorTextosAbrirModalAssinarPdf()`
  - assinatura.
- `editorTextosAbrirModalAbrir()`
  - fluxo de abrir modelos.
- `editorTextosAbrirModelo(modeloId)`
  - carrega modelo e documento.

## 6. Separacao por tipo de acao

### 6.1 Acao puramente visual

- `editorTextosSetToolbarButtonAtivo`
- `editorTextosAtualizarVisualComboCor`
- parte do `editorTextosSincronizarToolbarFormato` que apenas reflete estado.

### 6.2 Acao que altera DOM do editor

- `runCmd(...)` quando usa `document.execCommand`.
- `editorTextosSincronizarToolbarFormato` ao ler DOM para refletir estado.

### 6.3 Acao que altera conteudo do documento

- `runCmd("bold"|"italic"|"underline"|"justify..."|"insertUnorderedList"...)`
- `editorTextosInserirImagem()`
- `editorTextosAbrirModalTabela()`

### 6.4 Acao que depende de selecao/caret

- `editorTextosPrepararRangeToolbar`
- `editorTextosSelecaoTemSublinhado`
- `editorTextosSincronizarToolbarFormato`
- `editorTextosAgendarSincronizarToolbar`

### 6.5 Acao que depende de model-first

- `editorTextosDocumentoModelFeatureAtiva`
- `editorTextosDocumentoModelAtivar`
- `editorTextosDocumentoModelObterEstado`
- sincronizacoes de estrutura e toolbar que convivem com o modelo.

### 6.6 Acao que depende de reancoragem

- `editorTextosParagrafoAtualizarCursorTextualPorEvento`
- `editorTextosSincronizarEstruturaParagrafoAtual`
- fluxos de tab/line/state que convivem com toolbar e caret.

### 6.7 Acao que chama PDF

- `editorTextosExportarPdfAtual`
- `editorTextosGerarPdfParaAssinaturaAtual`

### 6.8 Acao que chama assinatura

- `editorTextosAbrirModalAssinarPdf`
- `editorTextosSalvarAssinaturaAtual` se acionada por fluxo de assinatura.

### 6.9 Acao que chama salvamento

- `editorTextosSalvarAtual`
- `editorTextosSalvarComoAtual`

### 6.10 Acao que chama requestJson/payload/backend

- `editorTextosSalvarAtual`
- `editorTextosSalvarComoAtual`
- `editorTextosAbrirModelo`
- `editorTextosCarregarModelos`
- `editorTextosCarregarCampos`
- qualquer fluxo de abrir/salvar que converse com backend.

## 7. Separacao entre visual, edicao, selecao/caret e fluxos sensiveis

- Visual:
  - estado ativo/inativo;
  - combo de cor;
  - marcacao visual de botões.
- Edicao:
  - `execCommand` e equivalentes.
- Selecao/caret:
  - range atual;
  - selecao no editor;
  - caret e foco.
- Fluxos sensiveis:
  - salvar;
  - PDF;
  - assinatura;
  - payload;
  - requestJson;
  - backend;
  - banco.

## 8. Riscos por area

- DOM: medio.
- Selecao/caret: medio-alto.
- Eventos/wiring: alto.
- Estado global: medio-alto.
- Conteudo rico: alto.
- Model-first: alto.
- Reancoragem: alto.
- TAB/Shift+Tab: medio-alto.
- PDF: alto.
- Assinatura: alto.
- Salvamento: alto.
- Payload: alto.
- requestJson: alto.
- Backend: critico.
- Banco: critico.

## 9. Avaliacao dos micro-recortes

### TOOLBAR-1

- Extrair helper/função de atualizacao visual da toolbar, sem mexer em comandos de edicao.
- Risco: baixo-medio.
- Ganho: bom.
- Observacao: melhor candidato inicial.

### TOOLBAR-2

- Extrair montagem/consulta visual de botões da toolbar, sem mexer nos handlers.
- Risco: medio.
- Ganho: medio.
- Observacao: possivel, mas menos limpo que TOOLBAR-1.

### TOOLBAR-3

- Extrair wrappers visuais de estado ativo/inativo, sem alterar selecao/caret nem conteudo.
- Risco: baixo-medio.
- Ganho: bom.
- Observacao: tambem e um bom candidato, mas fica naturalmente colado ao TOOLBAR-1.

### TOOLBAR-4

- Extrair handlers de acoes visuais simples, somente se nao tocarem salvamento, PDF, assinatura, payload, requestJson, backend ou banco.
- Risco: medio-alto.
- Ganho: medio.
- Observacao: ainda encosta demais em selecao, caret e execCommand.

### TOOLBAR-5

- Nao avancar em toolbar por acoplamento excessivo; voltar para matriz operacional da Fase 2C.
- Risco: baixo.
- Ganho: nenhum imediato.
- Observacao: valida a cautela, mas nao reduz o monolito.

## 10. Decisao final

- Decisao registrada: `F2C-TOOLBAR-A`
- Interpretacao: a futura implementacao deve extrair apenas a atualizacao visual da toolbar.
- Justificativa:
  - `editorTextosSincronizarToolbarFormato` e o conjunto visual de botões/combos sao o ponto mais claro e reversivel;
  - a extracao consegue reduzir `frontend/app.js` sem tocar em salvamento, PDF, assinatura, payload ou backend;
  - manter os handlers e comandos sensiveis em `app.js` evita uma quebra ampla de comportamento.

## 11. Proximo documento recomendado

- Documento de implementacao da atualizacao visual da toolbar.
- Se a fronteira visual ficar maior do que o esperado, criar um novo contrato antes de codar.

## 12. Arquivos provaveis para futura implementacao

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`
- possivelmente um novo modulo especifico apenas se a separacao visual nao couber no bootstrap existente.

## 13. Arquivos proibidos

- `frontend/index.html`
- backend
- banco
- schema
- migrations
- seeds
- endpoints
- `.env`
- scripts de migracao
- dumps/backups fora da pasta controlada da etapa

## 14. Backup futuro necessario

- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`
- qualquer novo modulo apenas se vier a existir para toolbar.

## 15. Onde o usuario devera testar futuramente

- Abrir o sistema normalmente.
- Entrar no Editor de Textos.
- Confirmar que a toolbar visual continua igual.
- Confirmar negrito, italico, sublinhado, alinhamento, cor e combos visuais.
- Reabrir o Editor de Textos apos recarregar a tela.
- Conferir que nao houve regressao visual.

## 16. Commit seletivo obrigatorio

- Arquivos que devem entrar no commit, se alterados:
  - `docs/fase_2c_editor_textos_contrato_toolbar_acoes_visuais.md`
  - `docs/11_roadmap_desenvolvimento.md`

## 17. Registro para roadmap

- Foi aberto o contrato especifico de toolbar/acoes visuais do Editor de Textos.
- A decisao de origem foi `F2C-EDITOR-DEC-B`.
- A decisao final registrada foi `F2C-TOOLBAR-A`.
- A futura implementacao deve extrair apenas a atualizacao visual da toolbar.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- O proximo passo recomendado e o documento de implementacao da atualizacao visual da toolbar.

