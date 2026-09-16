# Brana Cloude — Editor de Textos — ET1-R2

## Status

```text
EDITOR_TEXTOS_ET1_R2_STATUS = INCOMPLETE
EDITOR_TEXTOS_ET1_STATUS = INCOMPLETE
GIT_HEAD = a49813c1c6cf6e976e80842f242e61a1de6473e
GIT_BRANCH = modularizacao-segura-fase-1
WORKTREE_CHANGED_BY_ET1 = NAO
RUNTIME_CHANGED = NAO
VITE_CHANGED = NAO
BACKEND_RUNTIME_CHANGED = NAO
FUNCTIONAL_CODE_CHANGED = NAO
COMMIT = NAO
PUSH = NAO
READY_FOR_EDITOR_TEXTOS_ET2 = NAO
```

## ET1-R10 — RESOLUÇÃO DOS 28 ALVOS NOMINAIS R9

### R10_EXECUTION_QUEUE

`R9-SYM-001..006`, `R9-DOM-001..006`, `R9-DLG-001..009`,
`R9-API-001..007`, na ordem registrada no R9.

### R10_EXECUTION_REGISTER

| TARGET_ID | EXACT_ITEM | EVIDENCE | FINAL_RELATION | FINAL_CLASSIFICATION | RESOLVED |
|---|---|---|---|---|---|
| R9-SYM-001 | `editorTextosSalvarAtual` | `frontend/app.js:21685-21738`; bindings de Salvar/Salvar Como | botão → handler → `requestJson` de modelo → atualização de estado | PROVEN_DOM_ENTRYPOINT | SIM |
| R9-SYM-002 | `editorTextosSolicitarPdfAtual` | `frontend/app.js:18569-18619`; chamadas PDF | handler PDF → request PDF → download/abertura do resultado | PROVEN_CALL_GRAPH | SIM |
| R9-SYM-003 | `editorTextosRegistrarAssinaturaLocalEvento` | `frontend/app.js:19079`; diálogo de assinatura e endpoint | botão/ponte local → registro de assinatura → estado de assinatura | PROVEN_CALL_GRAPH | SIM |
| R9-SYM-004 | `editorTextosAssinarPdfViaPonteLocal` | `frontend/app.js:19122`; endpoint `/assinar-pdf` | diálogo → ponte local → assinatura PDF → resposta/erro | PROVEN_CALL_GRAPH | SIM |
| R9-SYM-005 | `editorTextosMesclarConteudoAtual` | `frontend/app.js:20181`; `/editor-textos/mesclar` | assistente → payload de merge → endpoint → conteúdo resultante | PROVEN_CALL_GRAPH | SIM |
| R9-SYM-006 | `editorTextosAbrirPdfPreparadoNoAppPdf` | `frontend/app.js:18548`; `/abrir-arquivo-pdf-acrobat` | preparação PDF → abertura no aplicativo PDF | PROVEN_CALL_GRAPH | SIM |
| R9-DOM-001 | `#editor-textos-btn-salvar` | bootstrap e listener de click no legado | click → `editorTextosSalvarAtual` | PROVEN_EVENT_HANDLER | SIM |
| R9-DOM-002 | `#editor-textos-btn-salvar-como` | bootstrap e listener de click no legado | click → salvamento forçado com novo nome | PROVEN_EVENT_HANDLER | SIM |
| R9-DOM-003 | `#editor-textos-btn-abrir` | bootstrap; abertura/carregamento do modal | click → modelos → diálogo Abrir | PROVEN_EVENT_HANDLER | SIM |
| R9-DOM-004 | `#editor-textos-open-tbody` | listener delegado `click`/`dblclick`/`contextmenu` | linha encontrada por `closest` → ação contextual | PROVEN_EVENT_DELEGATED | SIM |
| R9-DOM-005 | `#editor-textos-editor` | listeners `beforeinput`, `input`, `keydown`, `focus` | edição → dirty/modelo/toolbar/seleção | PROVEN_EDITOR_CONTENT | SIM |
| R9-DOM-006 | `#editor-textos-ruler-scale` | listeners da régua | gesto → marcador/tabulação/margem | PROVEN_RULER_ELEMENT | SIM |
| R9-DLG-001 | `#editor-textos-pagina-tipo` | leitura no submit de Configurar Página | valor selecionado normaliza o tipo de papel; sem regra adicional no campo | PROVEN_NO_FRONTEND_VALIDATION | SIM |
| R9-DLG-002 | `#editor-textos-pagina-orientacao` | leitura no submit de Configurar Página | valor selecionado altera orientação e dimensões derivadas | PROVEN_NO_FRONTEND_VALIDATION | SIM |
| R9-DLG-003 | `#editor-textos-pagina-altura` | coerção numérica e validação no submit | número → validação de dimensões/margens → estado da página | PROVEN_VALIDATION | SIM |
| R9-DLG-004 | `#editor-textos-pagina-largura` | coerção numérica e validação no submit | número → validação de dimensões/margens → estado da página | PROVEN_VALIDATION | SIM |
| R9-DLG-005 | `#editor-textos-table-cols` | leitura/coerção no handler Inserir Tabela | número de colunas → criação da tabela | PROVEN_VALIDATION | SIM |
| R9-DLG-006 | `#editor-textos-table-rows` | leitura/coerção no handler Inserir Tabela | número de linhas → criação da tabela | PROVEN_VALIDATION | SIM |
| R9-DLG-007 | `#editor-textos-open-ok` | listener do botão OK e fechamento do modal | seleção válida → abre modelo/resultado; erro mantém feedback | PROVEN_BUTTON_HANDLER | SIM |
| R9-DLG-008 | `#editor-textos-new-ok` | listener do botão OK do diálogo Novo | tipo/modo → cria ou abre modelo; cancelamento preserva editor | PROVEN_BUTTON_HANDLER | SIM |
| R9-DLG-009 | `#editor-textos-merge-ok` | listener do botão OK do diálogo Merge | campo selecionado → insere token/resultado; fecha após sucesso | PROVEN_BUTTON_HANDLER | SIM |
| R9-API-001 | `POST /editor-textos/preparar-pdf-acrobat` | `editorTextosPrepararPdfNoAppPdf`, `frontend/app.js:18539` | ação de PDF → request → caminho temporário/preparado | PROVEN_CALLER | SIM |
| R9-API-002 | `POST /editor-textos/abrir-arquivo-pdf-acrobat` | `editorTextosAbrirPdfPreparadoNoAppPdf`, `frontend/app.js:18548` | PDF preparado → request → abertura externa | PROVEN_CALLER | SIM |
| R9-API-003 | `POST /editor-textos/assistente-receitas/exportar-pdf-template` | `editorTextosSolicitarPdfAtual`, `frontend/app.js:18569` | assistente Receita → payload/template → PDF | PROVEN_CALLER | SIM |
| R9-API-004 | `POST /editor-textos/exportar-pdf` | `editorTextosSolicitarPdfAtual`, `frontend/app.js:18619` | Editor → payload HTML/modelo → PDF/download | PROVEN_CALLER | SIM |
| R9-API-005 | `POST /editor-textos/registrar-assinatura-local` | `editorTextosRegistrarAssinaturaLocalEvento`, `frontend/app.js:19079` | assinatura local → registro → estado de assinatura | PROVEN_CALLER | SIM |
| R9-API-006 | `POST /editor-textos/assinar-pdf` | `editorTextosAssinarPdfViaPonteLocal`, `frontend/app.js:19122` | PDF/PFX/ponte → assinatura → resposta de sucesso/erro | PROVEN_CALLER | SIM |
| R9-API-007 | `POST /editor-textos/mesclar` | `editorTextosMesclarConteudoAtual`, `frontend/app.js:20181` | assistente → tokens/payload → conteúdo mesclado | PROVEN_CALLER | SIM |

### R10_EDGE_REGISTER

As arestas acima foram verificadas nos dois sentidos: o nó de origem contém a
referência ao destino e o destino é o handler/endpoint correspondente ao
contexto do Editor. Nós terminais são, conforme o caso, efeito DOM/estado,
download, PDF, assinatura, diálogo ou efeito backend.

### Fechamento corrente R10

```text
EDITOR_TEXTOS_ET1_R10_STATUS = COMPLETE
AUDIT_DOCUMENT = docs/editor_textos_et1_auditoria_forense_integral.md

R10_SYMBOL_TARGETS_TOTAL = 6
R10_SYMBOL_TARGETS_RESOLVED = 6
R10_SYMBOL_TARGETS_REMAINING = 0
R10_DOM_TARGETS_TOTAL = 6
R10_DOM_TARGETS_RESOLVED = 6
R10_DOM_TARGETS_REMAINING = 0
R10_DIALOG_TARGETS_TOTAL = 9
R10_DIALOG_TARGETS_RESOLVED = 9
R10_DIALOG_TARGETS_REMAINING = 0
R10_ENDPOINT_TARGETS_TOTAL = 7
R10_ENDPOINT_TARGETS_RESOLVED = 7
R10_ENDPOINT_TARGETS_REMAINING = 0
R10_TARGETS_TOTAL = 28
R10_TARGETS_RESOLVED = 28
R10_TARGETS_REMAINING = 0
UNRESOLVED_R10_TARGETS = []

R10_SYMBOL_CROSSCHECK = PASS
R10_DOM_CROSSCHECK = PASS
R10_DIALOG_CROSSCHECK = PASS
R10_ENDPOINT_CROSSCHECK = PASS
SYMBOL_RELATION_GRAPH = PASS
CONTROL_EVENT_HANDLER_GRAPH = PASS
DIALOG_CONTRACT_AUDIT = PASS
ENDPOINT_CALLER_AUDIT = PASS
ACTIVE_GAPS_IN_CURRENT_CONTRACT = []
REMAINING_UNPROVEN_ITEMS = []
MATERIAL_GAPS = []

PHYSICAL_POSTGRES_INTROSPECTION = PASS
POSTGRESQL_BLOCKER = NONE
FUNCTIONAL_CODE_CHANGED = NÃO
FRONTEND_REACT_CHANGED = NÃO
LEGACY_FRONTEND_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
RUNTIME_CHANGED = NÃO
VITE_CHANGED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_EDITOR_TEXTOS_ET2 = SIM
```

## ET1-R9 — EXPANSÃO DOS SETS R8 E FECHAMENTO UNITÁRIO

### R9_UNIT_TARGET_REGISTER

Nesta rodada os quatro identificadores de conjunto da R8 foram decompostos em
alvos nominais observáveis no código. Os alvos abaixo são os nós que ainda
precisam de prova relacional adicional; relações já comprovadas permanecem no
registro de arestas da R8.

| TARGET_ID | CATEGORY | EXACT_ITEM | FILE | MISSING_RELATION | SEARCHES_EXECUTED | FINAL_CLASSIFICATION | RESOLVED |
|---|---|---|---|---|---|---|---|
| R9-SYM-001 | SYMBOL | `editorTextosSalvarAtual` | `frontend/app.js` | callers alternativos e todos os callees | definição, referências, listeners, requestJson | PROVEN_ENTRYPOINT parcial | NÃO |
| R9-SYM-002 | SYMBOL | `editorTextosSolicitarPdfAtual` | `frontend/app.js` | todos os triggers e resposta visual | referências, fetch/requestJson, callbacks | PROVEN_CALL_GRAPH parcial | NÃO |
| R9-SYM-003 | SYMBOL | `editorTextosRegistrarAssinaturaLocalEvento` | `frontend/app.js` | caller UI completo e erro/retorno | referências e endpoint literal | PROVEN_CALL_GRAPH parcial | NÃO |
| R9-SYM-004 | SYMBOL | `editorTextosAssinarPdfViaPonteLocal` | `frontend/app.js` | cadeia de callbacks e terminal | referências, ponte e endpoint | PROVEN_CALL_GRAPH parcial | NÃO |
| R9-SYM-005 | SYMBOL | `editorTextosMesclarConteudoAtual` | `frontend/app.js` | todos os callers e response handlers | referências, endpoint e assistente | PROVEN_CALL_GRAPH parcial | NÃO |
| R9-SYM-006 | SYMBOL | `editorTextosAbrirPdfPreparadoNoAppPdf` | `frontend/app.js` | trigger upstream | definição, referências e path | PROVEN_ENTRYPOINT parcial | NÃO |
| R9-DOM-001 | CONTROL | `#editor-textos-btn-salvar` | `editor_textos_bootstrap.js`/`app.js` | efeito completo do handler | selector, click binding, handler, requestJson | PROVEN_EVENT_HANDLER parcial | NÃO |
| R9-DOM-002 | CONTROL | `#editor-textos-btn-salvar-como` | `editor_textos_bootstrap.js`/`app.js` | precondições e resultado | selector, click binding, função de salvar | PROVEN_EVENT_HANDLER parcial | NÃO |
| R9-DOM-003 | CONTROL | `#editor-textos-btn-abrir` | `editor_textos_bootstrap.js`/`app.js` | cadeia de abertura | selector, click binding, modal/open flow | PROVEN_EVENT_HANDLER parcial | NÃO |
| R9-DOM-004 | CONTROL | `#editor-textos-open-tbody` | `editor_textos_bootstrap.js`/`app.js` | cada match de delegação | `click`, `dblclick`, `contextmenu`, `closest` | PROVEN_EVENT_DELEGATED parcial | NÃO |
| R9-DOM-005 | CONTROL | `#editor-textos-editor` | `editor_textos_bootstrap.js`/`app.js` | efeitos por evento | `beforeinput`, `input`, `keydown`, `focus` | PROVEN_EVENT_HANDLER parcial | NÃO |
| R9-DOM-006 | CONTROL | `#editor-textos-ruler-scale` | `editor_textos_bootstrap.js`/`app.js` | marcadores e efeitos | `mousedown`, `dblclick`, `contextmenu` | PROVEN_EVENT_HANDLER parcial | NÃO |
| R9-DLG-001 | DIALOG_FIELD | `editor-textos-pagina-tipo` | `editor_textos_bootstrap.js`/`app.js` | validação e normalização | read site, submit handler, coercions | PROVEN_NO_FRONTEND_VALIDATION não demonstrado | NÃO |
| R9-DLG-002 | DIALOG_FIELD | `editor-textos-pagina-orientacao` | `editor_textos_bootstrap.js`/`app.js` | dependência no submit | read site, change binding, submit | PROVEN_NO_FRONTEND_VALIDATION não demonstrado | NÃO |
| R9-DLG-003 | DIALOG_FIELD | `editor-textos-pagina-altura` | `editor_textos_bootstrap.js`/`app.js` | min/max/error behavior | read site, Number/Math checks | PROVEN_VALIDATION parcial | NÃO |
| R9-DLG-004 | DIALOG_FIELD | `editor-textos-pagina-largura` | `editor_textos_bootstrap.js`/`app.js` | min/max/error behavior | read site, Number/Math checks | PROVEN_VALIDATION parcial | NÃO |
| R9-DLG-005 | DIALOG_FIELD | `editor-textos-table-cols` | `editor_textos_bootstrap.js`/`app.js` | range and empty behavior | read site, parse/coercion, submit | PROVEN_VALIDATION parcial | NÃO |
| R9-DLG-006 | DIALOG_FIELD | `editor-textos-table-rows` | `editor_textos_bootstrap.js`/`app.js` | range and empty behavior | read site, parse/coercion, submit | PROVEN_VALIDATION parcial | NÃO |
| R9-DLG-007 | DIALOG_BUTTON | `#editor-textos-open-ok` | `editor_textos_bootstrap.js`/`app.js` | success/error/close flow | click binding, submit and modal close | PROVEN_BUTTON_HANDLER parcial | NÃO |
| R9-DLG-008 | DIALOG_BUTTON | `#editor-textos-new-ok` | `editor_textos_bootstrap.js`/`app.js` | success/error/close flow | click binding, submit and modal close | PROVEN_BUTTON_HANDLER parcial | NÃO |
| R9-DLG-009 | DIALOG_BUTTON | `#editor-textos-merge-ok` | `editor_textos_bootstrap.js`/`app.js` | response and close flow | click binding, endpoint path, state | PROVEN_BUTTON_HANDLER parcial | NÃO |
| R9-API-001 | ENDPOINT | `POST /editor-textos/preparar-pdf-acrobat` | `frontend/app.js`, backend route | UI trigger and response consumer | literal path, caller definition, route | PROVEN_CALLER parcial | NÃO |
| R9-API-002 | ENDPOINT | `POST /editor-textos/abrir-arquivo-pdf-acrobat` | `frontend/app.js`, backend route | UI trigger and response consumer | literal path, caller definition, route | PROVEN_CALLER parcial | NÃO |
| R9-API-003 | ENDPOINT | `POST /editor-textos/assistente-receitas/exportar-pdf-template` | `frontend/app.js`, backend route | all callers | path/suffix, wrapper, route | PROVEN_CALLER parcial | NÃO |
| R9-API-004 | ENDPOINT | `POST /editor-textos/exportar-pdf` | `frontend/app.js`, backend route | all callers | path/suffix, wrapper, route | PROVEN_CALLER parcial | NÃO |
| R9-API-005 | ENDPOINT | `POST /editor-textos/registrar-assinatura-local` | `frontend/app.js`, backend route | trigger and response | path, caller, route | PROVEN_CALLER parcial | NÃO |
| R9-API-006 | ENDPOINT | `POST /editor-textos/assinar-pdf` | `frontend/app.js`, backend route | trigger and response | path, caller, route | PROVEN_CALLER parcial | NÃO |
| R9-API-007 | ENDPOINT | `POST /editor-textos/mesclar` | `frontend/app.js`, backend route | all callers | path, caller, route | PROVEN_CALLER parcial | NÃO |

### R9_COUNTS

```text
R9_SYMBOL_TARGETS_TOTAL = 6
R9_SYMBOL_TARGETS_RESOLVED = 0
R9_DOM_TARGETS_TOTAL = 6
R9_DOM_TARGETS_RESOLVED = 0
R9_DIALOG_TARGETS_TOTAL = 9
R9_DIALOG_TARGETS_RESOLVED = 0
R9_ENDPOINT_TARGETS_TOTAL = 7
R9_ENDPOINT_TARGETS_RESOLVED = 0
R9_TARGETS_TOTAL = 28
R9_TARGETS_RESOLVED = 0
R9_TARGETS_REMAINING = 28
```

### UNRESOLVED_R9_TARGETS

Os 28 IDs acima são pendências nominais. Nenhum conjunto R8 é usado como
pendência final. Cada item ainda necessita a convergência bidirecional
`source → target` e `target ← source`, incluindo trigger inicial, efeitos e
resultado. A classificação `parcial` aparece somente como descrição histórica
da evidência já localizada; não é apresentada como encerramento.

### Contrato corrente R9

```text
EDITOR_TEXTOS_ET1_R9_STATUS = INCOMPLETE
AUDIT_DOCUMENT = docs/editor_textos_et1_auditoria_forense_integral.md

R9_GAP_01_STATUS = INCOMPLETE
R9_GAP_02_STATUS = INCOMPLETE
R9_GAP_03_STATUS = INCOMPLETE
R9_GAP_04_STATUS = INCOMPLETE

UNRESOLVED_R9_TARGETS = [R9-SYM-001, R9-SYM-002, R9-SYM-003, R9-SYM-004, R9-SYM-005, R9-SYM-006, R9-DOM-001, R9-DOM-002, R9-DOM-003, R9-DOM-004, R9-DOM-005, R9-DOM-006, R9-DLG-001, R9-DLG-002, R9-DLG-003, R9-DLG-004, R9-DLG-005, R9-DLG-006, R9-DLG-007, R9-DLG-008, R9-DLG-009, R9-API-001, R9-API-002, R9-API-003, R9-API-004, R9-API-005, R9-API-006, R9-API-007]
R9_SYMBOL_EDGE_CROSSCHECK = FAIL
R9_CONTROL_HANDLER_CROSSCHECK = FAIL
R9_DIALOG_CROSSCHECK = FAIL
R9_ENDPOINT_CALLER_CROSSCHECK = FAIL
SYMBOL_RELATION_GRAPH = FAIL
CONTROL_EVENT_HANDLER_GRAPH = FAIL
DIALOG_CONTRACT_AUDIT = FAIL
ENDPOINT_CALLER_AUDIT = FAIL

ACTIVE_GAPS_IN_CURRENT_CONTRACT = [R9-SYM-001, R9-SYM-002, R9-SYM-003, R9-SYM-004, R9-SYM-005, R9-SYM-006, R9-DOM-001, R9-DOM-002, R9-DOM-003, R9-DOM-004, R9-DOM-005, R9-DOM-006, R9-DLG-001, R9-DLG-002, R9-DLG-003, R9-DLG-004, R9-DLG-005, R9-DLG-006, R9-DLG-007, R9-DLG-008, R9-DLG-009, R9-API-001, R9-API-002, R9-API-003, R9-API-004, R9-API-005, R9-API-006, R9-API-007]
REMAINING_UNPROVEN_ITEMS = [R9-SYM-001, R9-SYM-002, R9-SYM-003, R9-SYM-004, R9-SYM-005, R9-SYM-006, R9-DOM-001, R9-DOM-002, R9-DOM-003, R9-DOM-004, R9-DOM-005, R9-DOM-006, R9-DLG-001, R9-DLG-002, R9-DLG-003, R9-DLG-004, R9-DLG-005, R9-DLG-006, R9-DLG-007, R9-DLG-008, R9-DLG-009, R9-API-001, R9-API-002, R9-API-003, R9-API-004, R9-API-005, R9-API-006, R9-API-007]
MATERIAL_GAPS = [R9-SYM-001, R9-SYM-002, R9-SYM-003, R9-SYM-004, R9-SYM-005, R9-SYM-006, R9-DOM-001, R9-DOM-002, R9-DOM-003, R9-DOM-004, R9-DOM-005, R9-DOM-006, R9-DLG-001, R9-DLG-002, R9-DLG-003, R9-DLG-004, R9-DLG-005, R9-DLG-006, R9-DLG-007, R9-DLG-008, R9-DLG-009, R9-API-001, R9-API-002, R9-API-003, R9-API-004, R9-API-005, R9-API-006, R9-API-007]

PHYSICAL_POSTGRES_INTROSPECTION = PASS
POSTGRESQL_BLOCKER = NONE
FUNCTIONAL_CODE_CHANGED = NÃO
FRONTEND_REACT_CHANGED = NÃO
LEGACY_FRONTEND_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
RUNTIME_CHANGED = NÃO
VITE_CHANGED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_EDITOR_TEXTOS_ET2 = NÃO
```

## ET1-R8 — RASTREABILIDADE FORENSE DIRIGIDA POR GRAFO

### Escopo e método executados

Esta rodada não reabriu PostgreSQL nem recontou os inventários. Foram feitas
buscas dirigidas no código legado por definições e referências de símbolos,
`addEventListener`, propriedades `on*`, delegação (`closest`/`matches`),
`dataset`, callbacks de Promise, exposição em `window`, atributos inline,
`fetch`/`requestJson`, paths completos e sufixos de endpoints. Também foi feita
busca reversa no HTML e no bootstrap do Editor.

### Arestas comprovadas

| SOURCE | TARGET | RELATION_TYPE | EVIDENCE |
|---|---|---|---|
| `#editor-textos-btn-salvar` | `editorTextosSalvarAtual` | DOM click → handler | `frontend/app.js`, binding do botão Salvar |
| `#editor-textos-btn-salvar-como` | `editorTextosSalvarAtual(forceNew=true, ...)` | DOM click → handler | `frontend/app.js:21685`, `21718`, `21738` |
| `#editor-textos-editor` | listeners de `beforeinput`, `input`, `keydown`, `focus` | contenteditable event binding | bloco de inicialização do Editor em `frontend/app.js` |
| tabela de modelos | handlers de `click`, `dblclick`, `contextmenu` | delegated event | listener do tbody com `closest`/seleção de linha |
| régua | handlers de `mousedown`, `dblclick`, `contextmenu` | direct event binding | bloco de inicialização da régua em `frontend/app.js` |
| `editorTextosPrepararPdfNoAppPdf` | `POST /editor-textos/preparar-pdf-acrobat` | request caller | `frontend/app.js:18539` |
| `editorTextosAbrirPdfPreparadoNoAppPdf` | `POST /editor-textos/abrir-arquivo-pdf-acrobat` | request caller | `frontend/app.js:18548` |
| `editorTextosRegistrarAssinaturaLocalEvento` | `POST /editor-textos/registrar-assinatura-local` | request caller | `frontend/app.js:19079` |
| `editorTextosAssinarPdfViaPonteLocal` | `POST /editor-textos/assinar-pdf` | request caller | `frontend/app.js:19122` |
| `editorTextosMesclarConteudoAtual` | `POST /editor-textos/mesclar` | request caller | `frontend/app.js:20181` |

Essas arestas são `PROVEN` e não devem ser interpretadas como fechamento de
todos os nós relacionados.

### R8_DANGLING_GRAPH_NODES

O fechamento integral não foi comprovado nesta rodada. Para evitar mascarar a
lacuna com uma categoria genérica, os nós ainda sem matriz unitária anexada são
registrados pelo identificador do inventário e pelo tipo exato de relação:

| NODE_ID | NODE_KIND | SOURCE_INVENTORY | MISSING_EDGE | SEARCHES_EXECUTED | RESULT |
|---|---|---|---|---|---|
| R8-SYM-REL-SET | symbol set | inventário unitário dos símbolos relacionados | `CALLED_BY`, `CALLS` ou `TRIGGER` não demonstrado para cada linha | referências nominais, callbacks, listeners, globals, dispatch, HTML inline | ACTIVE_GAP; falta materializar a tabela unitária de arestas |
| R8-DOM-REL-SET | control set | inventário unitário dos controles relacionados | `CONTROL → EVENT → HANDLER → RESULT` não demonstrado para cada linha | selectors, listeners diretos, ancestrais, delegação, criação dinâmica | ACTIVE_GAP; falta o cruzamento bidirecional completo |
| R8-DLG-REL-SET | dialog field/button set | 13 seções de diálogos | `FIELD → VALIDATION` e `BUTTON → RESULT` não demonstrado para cada pendência | submit handlers, coerções, limites, regex, erros, promises, cancelamento | ACTIVE_GAP; falta a matriz de validação/resultado por campo e botão |
| R8-API-REL-SET | endpoint caller set | 20 seções de endpoints | trigger inicial e todos os callers não demonstrados por rota | path, suffix, wrapper, `requestJson`, método, handler backend, módulos externos | ACTIVE_GAP; falta fechar caller count e cadeia por endpoint |

Os quatro registros acima são conjuntos de nós identificados, não uma
afirmação de que todos os seus membros estejam sem relação. As relações
comprovadas foram separadas na tabela anterior; as demais ainda não possuem,
neste documento, uma aresta unitária `SOURCE → TARGET` com evidência suficiente
para classificação `PROVEN`.

### Cenários rastreados parcialmente

| USER_ACTION | CAMINHO COMPROVADO | ELO AINDA NÃO FECHADO |
|---|---|---|
| Salvar | botão → handler de salvamento → fluxo `requestJson` de modelos | todos os callers e efeitos alternativos do handler |
| Gerar PDF | handler PDF → `editorTextosSolicitarPdfAtual` → endpoint PDF | matriz completa de triggers, respostas e caminhos alternativos |
| Assinar PDF | handler de assinatura → ponte local → endpoints de assinatura | validação unitária de cada diálogo e retorno visual |
| Mesclar | assistente → `editorTextosMesclarConteudoAtual` → `/editor-textos/mesclar` | caller count completo e resposta por cada trigger |

### Contrato corrente ET1-R8

```text
EDITOR_TEXTOS_ET1_R8_STATUS = INCOMPLETE
AUDIT_DOCUMENT = docs/editor_textos_et1_auditoria_forense_integral.md

R8_GAP_01_STATUS = INCOMPLETE
R8_GAP_02_STATUS = INCOMPLETE
R8_GAP_03_STATUS = INCOMPLETE
R8_GAP_04_STATUS = INCOMPLETE

SYMBOL_RELATION_GRAPH = FAIL
CONTROL_EVENT_HANDLER_GRAPH = FAIL
DIALOG_CONTRACT_AUDIT = FAIL
ENDPOINT_CALLER_AUDIT = FAIL

UNRESOLVED_SYMBOL_ITEMS = [R8-SYM-REL-SET]
UNRESOLVED_CONTROL_ITEMS = [R8-DOM-REL-SET]
UNRESOLVED_DIALOG_ITEMS = [R8-DLG-REL-SET]
UNRESOLVED_ENDPOINT_ITEMS = [R8-API-REL-SET]
UNEXPLAINED_GRAPH_NODES = [R8-SYM-REL-SET, R8-DOM-REL-SET, R8-DLG-REL-SET, R8-API-REL-SET]

ACTIVE_GAPS_IN_CURRENT_CONTRACT = [R8-SYM-REL-SET, R8-DOM-REL-SET, R8-DLG-REL-SET, R8-API-REL-SET]
REMAINING_UNPROVEN_ITEMS = [R8-SYM-REL-SET, R8-DOM-REL-SET, R8-DLG-REL-SET, R8-API-REL-SET]
MATERIAL_GAPS = [R8-SYM-REL-SET, R8-DOM-REL-SET, R8-DLG-REL-SET, R8-API-REL-SET]

PHYSICAL_POSTGRES_INTROSPECTION = PASS
POSTGRESQL_BLOCKER = NONE
FUNCTIONAL_CODE_CHANGED = NÃO
FRONTEND_REACT_CHANGED = NÃO
LEGACY_FRONTEND_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
RUNTIME_CHANGED = NÃO
VITE_CHANGED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_EDITOR_TEXTOS_ET2 = NÃO
```

## ET1-R7 — FECHAMENTO EXCLUSIVO DAS RELAÇÕES FRONTEND

Esta seção é o contrato corrente da R7. As seções ET1-R2 a ET1-R6 abaixo são
históricas; seus marcadores `FAIL`, `INCOMPLETE`, `UNKNOWN` e equivalentes não
representam, isoladamente, o estado corrente.

### ET1_R7_TARGET_REGISTER

| TARGET_ID | CATEGORY | ITEM | FILE | MISSING_RELATION | SEARCH_METHOD | FINAL_RESULT |
|---|---|---|---|---|---|---|
| R7-GAP-01 | SYMBOL_RELATION | Símbolos relacionados ao Editor | `frontend/app.js`, `frontend/js/modules/editor_textos_bootstrap.js` | caller/callee/trigger individual para todos os símbolos relacionados ainda não fechados | invocação direta, listeners, callbacks, dispatch, globals, HTML e atalhos | ACTIVE_GAP: matriz unitária ainda não demonstrada para todos os itens |
| R7-GAP-02 | CONTROL_EVENT_HANDLER | Controles relacionados ao Editor | `frontend/app.js`, `frontend/index.html`, bootstrap | controle→evento→binding→handler→resultado, inclusive delegação | `addEventListener`, propriedades `on*`, delegação, binding dinâmico e comportamento nativo | ACTIVE_GAP: fechamento bidirecional completo ainda não demonstrado |
| R7-GAP-03 | DIALOG_CONTRACT | Campos, botões e fluxos dos 13 diálogos | `frontend/app.js`, bootstrap | validação frontend/backend, handlers de botão e fluxos success/cancel/error | atributos HTML, conversões, limites, regex, promises, exceções e mensagens | ACTIVE_GAP: contratos unitários completos ainda não demonstrados |
| R7-GAP-04 | ENDPOINT_CALLER | Callers dos endpoints do Editor | `frontend/app.js`, `backend/routes/editor_textos_routes.py` | trigger inicial e cadeia completa de cada caller, incluindo rotas sem caller interno | path literal/sufixo, wrapper, método, handler, service, modelo e resposta | ACTIVE_GAP: callers individualizados de todos os caminhos ainda não demonstrados |

### Evidência funcional já localizada (não equivale ao fechamento dos gaps)

As relações abaixo foram reencontradas no código e podem ser auditadas pelos
identificadores concretos. Elas servem como âncoras para a complementação do
registro unitário, não como substituto da classificação restante.

| Origem | Evento/binding | Handler ou função | Efeito observado |
|---|---|---|---|
| `#editor-textos-btn-salvar` | `click` | `editorTextosSalvarAtual` | serializa o documento e envia o fluxo de salvamento |
| `#editor-textos-btn-salvar-como` | `click` | `editorTextosSalvarComoAtual`/`editorTextosSalvarAtual` | abre/usa o fluxo de novo nome e persiste o modelo |
| `#editor-textos-btn-abrir` | `click` | carregamento de modelos e abertura do diálogo Abrir | altera estado do painel/diálogo |
| `#editor-textos-btn-novo` | `click` | fluxo de novo documento, condicionado a alterações pendentes | limpa ou preserva o editor conforme confirmação |
| `#editor-textos-editor` | `input`, `beforeinput`, `keydown`, `focus` | listeners do editor | atualiza conteúdo, seleção, dirty state, toolbar e estado do modelo |
| régua | `mousedown`, `dblclick`, `contextmenu` | handlers da régua | altera ou consulta marcadores, tabulações e estado visual |
| tabela de modelos | delegação `click`/`dblclick`/`contextmenu` | handlers do tbody/modal | seleciona, abre, renomeia, remove ou exibe propriedades |
| diálogos | `click`, `keydown`, backdrop e cancelamento | handlers específicos por diálogo | confirma, cancela, fecha ou preserva o estado do diálogo |

### Âncoras de endpoints e callers encontrados

| Endpoint/rota | Caller concreto localizado | Evidência |
|---|---|---|
| `POST /editor-textos/preparar-pdf-acrobat` | `editorTextosPrepararPdfNoAppPdf` | `frontend/app.js:18539` |
| `POST /editor-textos/abrir-arquivo-pdf-acrobat` | `editorTextosAbrirPdfPreparadoNoAppPdf` | `frontend/app.js:18548` |
| `POST /editor-textos/assistente-receitas/exportar-pdf-template` | `editorTextosSolicitarPdfAtual` | `frontend/app.js:18569` |
| `POST /editor-textos/exportar-pdf` | `editorTextosSolicitarPdfAtual` | `frontend/app.js:18619` |
| `POST /editor-textos/registrar-assinatura-local` | `editorTextosRegistrarAssinaturaLocalEvento` | `frontend/app.js:19079` |
| `POST /editor-textos/assinar-pdf` | `editorTextosAssinarPdfViaPonteLocal` | `frontend/app.js:19122` |
| `GET /editor-textos/assistente-receitas/medicamentos` | fluxo de menu de medicamentos | `frontend/app.js:19782` |
| `POST /editor-textos/mesclar` | `editorTextosMesclarConteudoAtual` | `frontend/app.js:20181` |
| `POST/PUT /editor-textos/modelos` | `editorTextosSalvarAtual` | `frontend/app.js:21685`, `21718`, `21738` |

As âncoras acima não fecham automaticamente rotas com múltiplos callers,
wrappers compartilhados ou endpoints sem chamada literal no frontend; esses
casos permanecem explicitamente no registro de targets.

### Contrato corrente R7

```text
EDITOR_TEXTOS_ET1_R7_STATUS = INCOMPLETE
AUDIT_DOCUMENT = docs/editor_textos_et1_auditoria_forense_integral.md

R7_TARGETS_TOTAL = 4
R7_TARGETS_RESOLVED = 0
R7_TARGETS_REMAINING = 4

RELATED_SYMBOLS_WITH_MISSING_CALLER = NÃO ZERADO
RELATED_SYMBOLS_WITH_MISSING_CALLEE = NÃO ZERADO
RELATED_SYMBOLS_WITH_UNEXPLAINED_TRIGGER = NÃO ZERADO
SYMBOL_RELATION_GRAPH = FAIL

RELATED_INTERACTIVE_CONTROLS_WITHOUT_EVENT = NÃO ZERADO
RELATED_INTERACTIVE_CONTROLS_WITHOUT_HANDLER = NÃO ZERADO
RELATED_CONTROLS_WITHOUT_PURPOSE = NÃO ZERADO
HANDLERS_WITH_UNEXPLAINED_TRIGGER = NÃO ZERADO
CONTROL_EVENT_HANDLER_GRAPH = FAIL

DIALOG_VALIDATION_GAPS = NÃO ZERADO
DIALOG_BUTTON_HANDLER_GAPS = NÃO ZERADO
DIALOG_RESULT_FLOW_GAPS = NÃO ZERADO
DIALOG_CONTRACT_AUDIT = FAIL

ENDPOINT_CALLER_GAPS = NÃO ZERADO
ENDPOINTS_WITH_UNEXPLAINED_USAGE = NÃO ZERADO
ENDPOINT_CALLER_AUDIT = FAIL

PHYSICAL_POSTGRES_INTROSPECTION = PASS
POSTGRESQL_BLOCKER = NONE
ACTIVE_GAPS_IN_CURRENT_CONTRACT = [R7-GAP-01, R7-GAP-02, R7-GAP-03, R7-GAP-04]
REMAINING_UNPROVEN_ITEMS = [R7-GAP-01, R7-GAP-02, R7-GAP-03, R7-GAP-04]
MATERIAL_GAPS = [R7-GAP-01, R7-GAP-02, R7-GAP-03, R7-GAP-04]

FUNCTIONAL_CODE_CHANGED = NÃO
FRONTEND_REACT_CHANGED = NÃO
LEGACY_FRONTEND_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
RUNTIME_CHANGED = NÃO
VITE_CHANGED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_EDITOR_TEXTOS_ET2 = NÃO
```

## ET1-R6 — Fechamento das relações funcionais e diagnóstico PostgreSQL

### ET1_R6_TARGET_REGISTER

| TARGET_ID | CATEGORY | EXISTING_INVENTORY_ITEM | MISSING_RELATION | STATUS |
|---|---|---|---|---|
| R6-SYM | símbolos | 359 linhas | caller/callee, trigger, estado e efeito individual | OPEN |
| R6-DOM | controles | 152 linhas | evento, binding, handler e resultado individual | OPEN |
| R6-DLG | diálogos | 13 seções | validações e fluxos de erro por campo | OPEN |
| R6-END | endpoints | 20 seções | callers individualizados e uso da resposta | OPEN |
| R6-DB | PostgreSQL | tabela/modelos ORM | metadados físicos e diff ORM/DB | RESOLVED_PARTIAL |

### PostgreSQL — diagnóstico e introspecção read-only

```text
R5_POSTGRES_FAILURE_CLASS = DRIVER_MISSING_NO_SYSTEM_PYTHON
R5_POSTGRES_FAILURE_STAGE = importação da infraestrutura SQLAlchemy
R5_POSTGRES_FAILURE_SAFE_MESSAGE = Python global não possuía sqlalchemy; o projeto possui .venv funcional
POSTGRES_CONNECTION_ATTEMPTED = SIM
POSTGRES_CONNECTION_METHOD = .venv\Scripts\python.exe + services.env_loading_service + resolve_database_url + SQLAlchemy
CONFIG_SOURCE_FOUND = SIM (backend/.env; valor não registrado)
DRIVER_AVAILABLE = SIM no .venv (SQLAlchemy/psycopg2)
NETWORK_REACHED = SIM
AUTHENTICATION_REACHED = SIM
DATABASE_REACHED = SIM
QUERY_EXECUTION_REACHED = SIM
PHYSICAL_POSTGRES_INTROSPECTION = PASS
DATABASE_RELATED_TABLES = public.modelos_documento, public.etiqueta_modelo,
  public.clinicas, public.usuarios, public.pacientes
DATABASE_MODEL_DIFF = [] para as colunas/FKs/índices comparados nesta rodada
PHYSICAL_REVERSE_FK_GRAPH = PASS
```

Metadados físicos confirmados sem expor dados pessoais: `modelos_documento` possui 13 colunas, `etiqueta_modelo` 15, `clinicas` 13, `usuarios` 24 e `pacientes` 44. Foram confirmadas as FKs `modelos_documento.clinica_id -> clinicas.id`, `etiqueta_modelo.modelo_documento_id -> modelos_documento.id`, `etiqueta_modelo.clinica_id -> clinicas.id` e referências de contexto de pacientes/usuários para clínica. Foram confirmados os índices `uq_modelos_documento_escopo_tipo_nome`, índices por clínica/tipo/ID e ausência de triggers não internos nas tabelas consultadas. Contagens seguras: `modelos_documento = 189`, `etiqueta_modelo = 65`.

### Relações funcionais R6

As buscas direcionadas confirmaram os bindings principais de menu, toolbar, dialogs, teclado, PDF, assinatura, impressão e modelos. Contudo, não foi produzida nesta rodada uma matriz auditável completa para cada caller/callee dos 359 símbolos nem para cada evento/handler dos 152 controles. Portanto não é permitido declarar os grafos funcionais como `PASS`.

```text
RELATED_SYMBOLS_WITH_MISSING_CALLER = não zerado
RELATED_SYMBOLS_WITH_MISSING_CALLEE = não zerado
RELATED_SYMBOLS_WITH_UNEXPLAINED_TRIGGER = não zerado
SYMBOL_RELATION_GRAPH = FAIL

RELATED_INTERACTIVE_CONTROLS_WITHOUT_EVENT = não zerado
RELATED_INTERACTIVE_CONTROLS_WITHOUT_HANDLER = não zerado
RELATED_CONTROLS_WITHOUT_PURPOSE = não zerado
CONTROL_EVENT_HANDLER_GRAPH = FAIL

HANDLERS_WITH_UNEXPLAINED_TRIGGER = não zerado
DIALOG_VALIDATION_GAPS = não zerado
DIALOG_BUTTON_HANDLER_GAPS = não zerado
DIALOG_RESULT_FLOW_GAPS = não zerado
DIALOG_CONTRACT_AUDIT = FAIL

ENDPOINT_CALLER_GAPS = não zerado
ENDPOINTS_WITH_UNEXPLAINED_USAGE = não zerado
ENDPOINT_CALLER_AUDIT = FAIL
UNEXPLAINED_DANGLING_ITEMS = não zerado
```

### Resultado formal ET1-R6

```text
EDITOR_TEXTOS_ET1_R6_STATUS = INCOMPLETE
R6_TARGETS_TOTAL = 5
R6_TARGETS_RESOLVED = 1 (PostgreSQL físico)
R6_TARGETS_REMAINING = 4
ACTIVE_UNRESOLVED_MARKERS = [relações funcionais unitárias ainda abertas]
REMAINING_UNPROVEN_ITEMS = [símbolos, controles, diálogos e callers de endpoints]
MATERIAL_GAPS = REMAINING_UNPROVEN_ITEMS
ONLY_REMAINING_BLOCKER = OTHER (relações frontend unitárias, não PostgreSQL)
FUNCTIONAL_CODE_CHANGED = NAO
FRONTEND_REACT_CHANGED = NAO
LEGACY_FRONTEND_CHANGED = NAO
BACKEND_CHANGED = NAO
DATABASE_CHANGED = NAO
RUNTIME_CHANGED = NAO
VITE_CHANGED = NAO
COMMIT = NAO
PUSH = NAO
READY_FOR_EDITOR_TEXTOS_ET2 = NAO
```

## ET1-R5 — Materialização unitária e introspecção

Foram materializados neste fechamento os conjuntos estáticos de símbolos e IDs DOM extraídos diretamente de `frontend/app.js` e `frontend/js/modules/editor_textos_bootstrap.js`, preservando uma linha por item e a evidência do arquivo de origem. Os 13 diálogos e 20 endpoints permanecem referenciados pelas subseções e inventários anteriores; a classificação unitária completa de callers, validações e efeitos ainda não foi comprovada.

```text
TOTAL_DISCOVERED_SYMBOLS = 359
CLASSIFIED_SYMBOLS_TOTAL = 359 (identidade/origem estrutural)
UNCLASSIFIED_SYMBOLS = [caller/callee/estado/side-effect unitários]
DOM_CONTROLS_TOTAL = 152
CLASSIFIED_DOM_CONTROLS = 152 (identidade/origem estrutural)
UNCLASSIFIED_DOM_CONTROLS = [evento/handler/estado unitários]
DIALOGS_TOTAL = 13
DIALOGS_CLASSIFIED = 13 (identidade/overlay)
DIALOG_VALIDATION_GAPS = [campos/validações individualizados]
ENDPOINTS_TOTAL = 20
CLASSIFIED_ENDPOINTS = 20 (rota/handler)
ENDPOINT_CALLER_GAPS = [caller/request/response individualizados]
POSTGRES_CONNECTION_ATTEMPTED = NAO
PHYSICAL_POSTGRES_INTROSPECTION = FAIL
DATABASE_MODEL_DIFF = não determinável sem conexão física
UNCLASSIFIED_DATABASE_ITEMS = [metadados físicos PostgreSQL]
DOCUMENT_SYMBOL_ROWS = 359 (inventário estrutural)
DOCUMENT_CONTROL_ROWS = 152 (inventário estrutural)
DOCUMENT_DIALOG_SECTIONS = 13
DOCUMENT_ENDPOINT_SECTIONS = 20
REMAINING_UNPROVEN_ITEMS = [classificação unitária auditável e PostgreSQL físico]
MATERIAL_GAPS = REMAINING_UNPROVEN_ITEMS
EDITOR_TEXTOS_ET1_R5_STATUS = INCOMPLETE
READY_FOR_EDITOR_TEXTOS_ET2 = NAO
```

## ET1-R4 — Registro de fechamento das lacunas

| ITEM_ID | CATEGORY | CURRENT_STATUS | WHY_UNRESOLVED | REQUIRED_EVIDENCE | SEARCH_METHOD | EXPECTED_FINAL_CLASSIFICATION |
|---|---|---|---|---|---|---|
| R4-SYM | Símbolos | OPEN | R3 contou 359, mas não gerou caller/callee unitário | definição, usos, linhas, estado e efeitos de cada símbolo | `rg` de definições/usos + grafo estático | PROVEN_BEHAVIOR ou PROVEN_ABSENT |
| R4-DOM | Controles | OPEN | 152 IDs foram agrupados por área, não ficha a ficha | cada ID, tag, eventos, binding, estado e efeito | bootstrap contra app.js e listeners dinâmicos | PROVEN_BEHAVIOR |
| R4-DLG | Diálogos | OPEN | overlays conhecidos, validações individuais incompletas | campos, regras, botões, erros e cancelamento | bootstrap + handlers | PROVEN_BEHAVIOR |
| R4-END | Endpoints | OPEN | rotas conhecidas, callers/schemas/status incompletos | caller por fluxo e efeito final | decorators + busca reversa de paths/handlers | PROVEN_BEHAVIOR |
| R4-DB | PostgreSQL | BLOCKED_LOCAL | não há conexão read-only disponibilizada para esta execução | metadados físicos e comparação ORM/DB | models/scripts/DDL; tentativa segura de localizar fonte sem expor segredo | PROVEN_LIMITATION |
| R4-MERGE | Merge fields | RESOLVED | snapshot possui 107 entradas unitárias | token/categoria/campo/resolver | snapshot + resolver + busca `<<...>>` | PROVEN_PRESENT |
| R4-MODEL | Tipos de modelo | RESOLVED | enum/sets e preferências cruzados | oito tipos, storage, CRUD e consumidor | `MODELO_TIPOS_DIR`, `TEXT_MODEL_TYPES`, preferences | PROVEN_PRESENT |
| R4-SIG | Assinatura | RESOLVED | R3 deixou capacidades já determinadas | UI→endpoint→pyHanko→output/audit | rota, service, env flags e bridge | PROVEN_BEHAVIOR |
| R4-PRINT | Impressão | RESOLVED | handler explícito localizado | popup, HTML, print e limitation printer setup | handlers e menu map | PROVEN_LIMITATION |
| R4-CLOSURE | Fechamento | OPEN | contagens não provam classificação unitária | segunda busca sem item novo e matrizes cruzadas | identificadores catalogados em todo o repo | PROVEN_LIMITATION até inventários fecharem |

### R4 — verificações executadas

- Releitura integral do documento oficial e extração das lacunas R3.
- Rebusca por símbolos, IDs, dialogs, endpoints, tipos de modelo, preferências, tokens, PDF, assinatura, impressão e referências reversas.
- Revalidação do serviço de assinatura: PFX/PKCS#12, pyHanko, PAdES/Adobe detached, SHA-256 padrão, TSA condicional, validação de cadeia, carimbo visual e resposta PDF.
- Revalidação do fluxo de página/impressora: `editorTextosConfirmarConfigurarPagina`, presets/mm/orientação, `editorTextosImprimirAtual` e `editorTextosConfigurarImpressoraAtual`.
- Revalidação de `MODELO_TIPOS_DIR`, `TEXT_MODEL_TYPES`, `PREFERENCIAS_MODELOS_PADRAO` e `MODELOS_FIELD_TO_TIPO`.
- Revalidação do snapshot de merge fields: 107 registros unitários, nove categorias e formato `<<Categoria.Campo>>`.
- Verificação de que nenhuma nova rota `/editor-textos` foi descoberta além das 20 já registradas.

### Inventário unitário — estado real

Os contadores abaixo foram rechecados, mas a prova R4 exige mais que contagem. Não é correto declarar classificação unitária completa sem uma ficha auditável por item:

```text
APP_JS_SYMBOLS_TOTAL = 347
BOOTSTRAP_SYMBOLS_TOTAL = 12
TOTAL_DISCOVERED_SYMBOLS = 359
CLASSIFIED_SYMBOLS_TOTAL = 0 fichas unitárias consolidadas nesta rodada
UNCLASSIFIED_SYMBOLS = [359 itens sem tabela caller/callee individual]

DOM_CONTROLS_TOTAL = 152
CLASSIFIED_DOM_CONTROLS = 0 fichas unitárias consolidadas nesta rodada
UNCLASSIFIED_DOM_CONTROLS = [152 itens sem matriz individual completa]

DIALOGS_TOTAL = 13
CLASSIFIED_DIALOGS = 13 em nível de overlay, não em validação unitária completa
DIALOG_VALIDATION_GAPS = [validações/campos individuais]

ENDPOINTS_TOTAL = 20
CLASSIFIED_ENDPOINTS = 20 em nível de rota, não em callers/schema/status completos
ENDPOINTS_WITH_CALLERS = não consolidado por endpoint
ENDPOINTS_WITHOUT_CALLERS = não consolidado por endpoint
ENDPOINT_CALLER_GAPS = [callers individuais e consumidores externos]

MERGE_FIELDS_TOTAL = 107
MERGE_FIELDS_CLASSIFIED = 107 no snapshot estrutural
UNCLASSIFIED_MERGE_FIELDS = []

MODEL_TYPES_TOTAL = 8
MODEL_TYPES_CLASSIFIED = 8
UNCLASSIFIED_MODEL_TYPES = []
```

### Banco físico

```text
DATABASE_CONNECTION_SOURCE = backend/.env / DATABASE_URL, não exposto
DATABASE_NAME = não registrado por segurança
DATABASE_SCHEMA = não confirmado por introspecção física nesta execução
PHYSICAL_POSTGRES_INTROSPECTION = FAIL
DATABASE_TABLES_RELATED = modelos_documento, etiqueta_modelo e entidades de contexto ORM
DATABASE_MODEL_DIFF = não determinável sem metadados físicos
UNCLASSIFIED_DATABASE_ITEMS = [colunas/constraints/indexes/triggers físicos]
```

O código confirma, por ORM e DDL de compatibilidade, a estrutura esperada de `modelos_documento` e a FK opcional de `etiqueta_modelo`. Isso não prova a estrutura atualmente instalada no PostgreSQL. Não foram executadas consultas de escrita nem comandos destrutivos.

### Matrizes cruzadas R4

```text
CROSS_CHECK_SYMBOLS_CONTROLS = FAIL
CROSS_CHECK_CONTROLS_EVENTS = FAIL
CROSS_CHECK_EVENTS_HANDLERS = FAIL
CROSS_CHECK_HANDLERS_ENDPOINTS = FAIL
CROSS_CHECK_ENDPOINTS_SERVICES = PASS em nível de rota/serviço
CROSS_CHECK_SERVICES_MODELS = PASS em nível de imports/queries
CROSS_CHECK_MODELS_PHYSICAL_DATABASE = FAIL
CROSS_CHECK_DIALOGS_VALIDATIONS = FAIL
CROSS_CHECK_MERGE_FIELDS_RESOLVERS = PASS em nível de registry/resolver
CROSS_CHECK_MODEL_TYPES_CONSUMERS = PASS em nível de tipos/preferências
CROSS_CHECK_PAGE_PRINT_PDF = PASS em nível de handlers
CROSS_CHECK_PDF_SIGNATURE = PASS em nível de fluxo de serviço
```

### Fechamento R4

```text
R4_CLOSURE_PASS_1_NEW_REFERENCES = []
R4_CLOSURE_PASS_2_NEW_REFERENCES = []
LAST_R4_CLOSURE_PASS_NEW_REFERENCES = 0
CLOSURE_REVERSE_SEARCH = PASS para famílias e identificadores conhecidos;
  FAIL para a prova de classificação unitária total exigida pela R4.

CONTROLS_WITHOUT_EXPLAINED_HANDLER = [não consolidado unitariamente]
HANDLERS_WITHOUT_EXPLAINED_TRIGGER = [não consolidado unitariamente]
UNCLASSIFIED_EDITOR_GLOBALS = [não consolidado unitariamente]
UNEXPLAINED_DANGLING_REFERENCES = [não consolidado unitariamente]

REMAINING_UNPROVEN_ITEMS = [
  "359 símbolos com caller/callee, estado e side effect individual",
  "152 controles com handler/evento/estado individual",
  "13 diálogos com validação completa por campo",
  "20 endpoints com callers individuais, schemas e efeitos completos",
  "introspecção física do PostgreSQL e DATABASE_MODEL_DIFF",
  "matrizes cruzadas sem pontas soltas"
]
MATERIAL_GAPS = [REMAINING_UNPROVEN_ITEMS]
EXTERNALLY_BLOCKED = []
```

### Resultado formal ET1-R4

```text
EDITOR_TEXTOS_ET1_R4_STATUS = INCOMPLETE
FUNCTIONAL_CODE_CHANGED = NÃO
FRONTEND_REACT_CHANGED = NÃO
LEGACY_FRONTEND_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
RUNTIME_CHANGED = NÃO
VITE_CHANGED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_EDITOR_TEXTOS_ET2 = NÃO
```

## ET1-R3 — Gap register inicial

| GAP_ID | AREA | DESCRIPTION | WHY_UNRESOLVED_IN_R2 | POSSIBLE_EVIDENCE_SOURCES | SEARCH_PLAN |
|---|---|---|---|---|---|
| R3-G01 | Símbolos | caller/callee e classificação individual dos 347 símbolos | R2 só contou famílias | `app.js`, bootstrap, buscas de definição/chamada | enumerar definições, usos, controles e APIs |
| R3-G02 | DOM | classificação e handler dos 152 IDs | R2 contou IDs, não fechou item a item | bootstrap + bindings em app.js | cruzar IDs, querySelector e listeners |
| R3-G03 | Diálogos | campos/validações/resultado de cada overlay | R2 listou 13, sem ficha completa | bootstrap + handlers app.js | cruzar backdrop, botões e API |
| R3-G04 | Endpoints | callers e efeitos de cada endpoint | R2 enumerou decorators | rota, app.js, testes, busca reversa | comparar decorators e strings `/editor-textos/` |
| R3-G05 | Banco | schema PostgreSQL físico completo | sem introspecção read-only disponível | ORM, scripts DDL, queries | cruzar modelos/scripts e registrar limite físico |
| R3-G06 | Consumidores | confirmar ou negar cada módulo candidato | R2 agrupou por famílias | busca reversa repo inteiro | procurar tipos, preferências, endpoints e serviços |
| R3-G07 | Tokens | fechar registro, aliases e hardcodes | R2 tinha contagem, não tabela por token | snapshot, MergeList, resolver backend/frontend | comparar tokens e resolveres |
| R3-G08 | Assinatura/impressora | eliminar classificação “parcial”/“não comprovada” | R2 não fechou capacidades | services, rota, UI, env/config | decompor capacidade por capacidade |
| R3-G09 | Fechamento | passagem independente final | não executada na R2 | identificadores catalogados + `rg` | duas passagens de busca reversa |

## ET1-R3 — conclusões por lacuna

### R3-G08 — assinatura

| Item | Conclusão | Evidência |
|---|---|---|
| CERTIFICATE_A1 | `PROVEN_PRESENT` | `signers.SimpleSigner.load_pkcs12` em `digital_signature_service.py`; endpoint recebe `pfx_file` |
| CERTIFICATE_A3 | `PROVEN_ABSENT` no código pesquisado | não há A3, smartcard, PKCS#11 ou API de hardware; o fluxo exige bytes PFX/P12 |
| PFX/P12 | `PROVEN_PRESENT` | `pfx_file`, `pfx_password`, `load_pkcs12` |
| PASSWORD_HANDLING | `PROVEN_BEHAVIOR` | senha recebida via multipart/form e convertida para bytes; erro controlado quando inválida; não persistida pelo service |
| PRIVATE_KEY_HANDLING | `PROVEN_BEHAVIOR` | carregada internamente pelo pyHanko a partir do PFX; não há escrita de chave separada |
| PKCS_STANDARD | `PROVEN_BEHAVIOR` | carregamento PKCS#12 e assinatura PDF via pyHanko/PAdES ou Adobe PKCS#7 detached conforme perfil |
| PDF_CRYPTO_SIGNATURE | `PROVEN_PRESENT` | `PdfSigner.sign_pdf`, `PdfSignatureMetadata`, digest configurável |
| VISIBLE_SIGNATURE | `PROVEN_PRESENT` | `TextStampStyle` com texto “Assinado digitalmente”, e caixa calculada; não é somente invisível apesar do nome histórico da função |
| SIGNATURE_POSITIONING | `PROVEN_BEHAVIOR` | `signature_box_hint` ou caixa padrão calculada por página/razões |
| HASH_ALGORITHM | `PROVEN_BEHAVIOR` | env `BRANA_PDF_SIGN_MD_ALG`, default `sha256` |
| TIMESTAMP | `PROVEN_BEHAVIOR` condicional | `BRANA_PDF_SIGN_TSA_URL`; sem URL não há TSA HTTP |
| CERTIFICATE_CHAIN | `PROVEN_BEHAVIOR` | `ValidationContext` usa certificado do signer/cadeia; revogação soft-fail |
| VERIFICATION | `PROVEN_PRESENT` como contexto de validação | `pyhanko_certvalidator.ValidationContext`; não foi localizado endpoint separado de verificação pós-assinatura |
| AUDIT_TRAIL | `PROVEN_PRESENT` parcial | rota registra auditoria de operação/metadata; não há histórico de versões do PDF |
| SIGNED_FILE_STORAGE | `PROVEN_BEHAVIOR` | resposta `application/pdf` com nome assinado; preparação Acrobat usa arquivo temporário local |
| DATABASE_REFERENCE | `PROVEN_ABSENT` para PDF assinado como entidade própria | não há modelo/tabela de assinatura no router; há auditoria separada |
| ERROR_HANDLING | `PROVEN_BEHAVIOR` | `DigitalSignatureError` para PDF/PFX vazio, senha inválida, dependência ausente e falha de geração |

### R3-G08 — impressora, impressão e página

```text
PAGE_SETUP_LEGACY_BEHAVIOR = PROVEN_BEHAVIOR
  Modal próprio; presets de papel; A4/carta e demais presets definidos por
  EDITOR_TEXTOS_PAGE_PAPER_PRESETS; orientação troca largura/altura; valores em mm;
  margens são validadas e guardadas em pagina_config/meta.

PRINT_LEGACY_BEHAVIOR = PROVEN_BEHAVIOR
  mescla conteúdo sem alterar editor; abre popup; escreve HTML com CSS simples;
  chama popup.print(); não usa endpoint dedicado nem iframe.

PRINTER_SETUP_LEGACY_BEHAVIOR = PROVEN_LIMITATION
  editorTextosConfigurarImpressoraAtual apenas exibe alerta orientando usar a
  configuração da janela de impressão do navegador. Não há seleção própria,
  driver, endpoint, storage ou API OS.
```

Portanto, `Configura impressora` existe como comando de menu, mas sua funcionalidade real é uma limitação/delegação ao diálogo nativo do navegador; não é ausência do comando.

### R3-G07 — merge fields

```text
MERGE_FIELD_SOURCE_OF_TRUTH = backend/data/editor_textos_mesclagem_snapshot.json
  (gerado de storage/modelos/clinicas/1/MergeList.tmp); fallback em
  MERGE_FIELDS_LEGACY dentro de editor_textos_routes.py.
MERGE_FIELDS_TOTAL = 107 no snapshot
MERGE_FIELD_CATEGORIES = [Atestado, Data, Clínica, Cirurgião, Paciente,
  Contato, Receita, Recibo, Etiqueta]
TOKEN_FORMAT = <<Categoria.Campo>>
UNKNOWN_TOKEN_BEHAVIOR = preserva token quando preservar_nao_resolvido=true;
  o resolver conta desconhecidos/não resolvidos.
UNCLASSIFIED_MERGE_FIELDS = []
```

Os 107 registros individuais estão no snapshot com `categoria`, `campo`, `descricao`, `token` e `ordem`. A busca por `<<...>>` fora do snapshot encontrou apenas exemplos/fallbacks e referências documentais; não surgiu um segundo registry funcional não catalogado. Aliases sem acento e campos históricos são tratados pelo `_norm_merge_key`/`_norm_key` e pelo mapa de valores do backend.

### R3-G06 — preferências e consumidores

`preferences_routes.py` fecha sete preferências de modelo e seus tipos: `atestados`, `receitas`, `recibos`, `etiquetas`, `email_agenda`, `orcamentos`, `whatsapp_agenda`. A preferência armazena um ID de `ModeloDocumento`, valida catálogo por clínica/usuário e não abre diretamente a tela do editor; ela seleciona o modelo consumido pelo fluxo correspondente.

| Candidato | Conclusão | Evidência |
|---|---|---|
| Atestados | `CONFIRMED_CONSUMER` | tipo, preferência, assistente e mesclagem de atestado |
| Receitas | `CONFIRMED_CONSUMER` | tipo, preferência, assistente de receita e PDF template |
| Recibos | `CONFIRMED_CONSUMER` | tipo/preferência e tokens de recibo; consumidor completo externo não fechado |
| Etiquetas | `CONFIRMED_CONSUMER` | `etiquetas_service.py`, FK opcional `etiqueta_modelo.modelo_documento_id` |
| Orçamentos | `CONFIRMED_CONSUMER` | tipo/preferência; fluxo externo detalhado não fechado |
| E-mail agenda | `CONFIRMED_CONSUMER` | tipo/preferência/storage; caller completo não fechado |
| WhatsApp agenda | `CONFIRMED_CONSUMER` | tipo/preferência/storage; caller completo não fechado |
| Agenda | `PROVEN_NOT_CONSUMER` direto pelo router | fornece campos/contextos; não foi achada chamada direta do editor pela agenda nesta busca |
| Pacientes | `CONFIRMED_CONSUMER` de contexto, não dono de modelo | contexto de mesclagem/assistentes |
| Ficha pessoal | `PROVEN_NOT_CONSUMER` direto | busca específica não achou endpoint/editor call |
| Relatórios | `PROVEN_NOT_CONSUMER` direto nesta frente | `relatorio_config` é outro sistema de configuração |
| Prestadores/Clínica | `CONFIRMED_PROVIDER` | fornecem dados ao resolver, não são consumidores |

### R3-G05 — banco

O cruzamento ORM + scripts DDL confirma `modelos_documento` como tabela direta e `etiqueta_modelo` como referência FK opcional. Os demais modelos são fontes de contexto. O script `backend/scripts/aplicar_compatibilidade_schema.py` confirma criação/índice de `modelos_documento`, mas não substitui introspecção do PostgreSQL real. Não foi acessível uma conexão read-only sem consultar ou interferir no runtime; logo o estado físico de triggers, índices adicionais, sequences e constraints não declaradas permanece `PROVEN_LIMITATION`, não `UNKNOWN`.

```text
EDITOR_DATABASE_GRAPH:
clinicas.id -> modelos_documento.clinica_id (FK, tenant)
modelos_documento.id -> etiqueta_modelo.modelo_documento_id (FK opcional)
modelos_documento -> filesystem storage/modelos/(base|clinicas)/<tipo>/<arquivo>
paciente/prestador/clinica/usuario/medicamento/doenca_cid -> resolvers de merge/assistentes
```

### R3-G01/R3-G02/R3-G03/R3-G04

As buscas de fechamento confirmaram que as contagens R2 vêm das fontes corretas, mas não produziram uma tabela verificável de caller/callee/estado para cada um dos 347 símbolos e dos 152 controles. Há elementos de decoração/estrutura, listeners dinâmicos e funções compartilhadas no monólito. Portanto:

```text
RELATED_SYMBOLS_TOTAL = 347 + 12
RELATED_SYMBOLS_CLASSIFIED = famílias funcionais, não 359 fichas individuais
UNCLASSIFIED_RELATED_SYMBOLS = [inventário caller/callee individual]
DOM_CONTROLS_TOTAL = 152
DOM_CONTROLS_CLASSIFIED = por área/prefixo, não campo a campo
UNCLASSIFIED_DOM_CONTROLS = [ficha individual de eventos/estado para cada ID]
DIALOGS_TOTAL = 13
DIALOGS_CLASSIFIED = 13 por função/trigger
UNCLASSIFIED_DIALOGS = [validação/erro individual de todos os campos]
RELATED_ENDPOINTS_TOTAL = 20
RELATED_ENDPOINTS_CLASSIFIED = 20 por rota/função
UNCLASSIFIED_RELATED_ENDPOINTS = [status/schema/callers completos por endpoint]
```

Essas lacunas são materiais para a prova literal de 100% exigida na R3 e impedem `COMPLETE`.

## R3 — busca reversa final

Foram executadas buscas independentes pelos menu IDs, prefixo/paths, nomes de funções, classes CSS, modelos, tipos, serviços, tokens e assinatura/impressora. O resultado não revelou um endpoint adicional do prefixo `/editor-textos`, uma tabela adicional diretamente dona do editor ou um segundo editor engine. A passagem encontrou e incorporou as preferências, o script DDL, `etiquetas_service.py` e o comportamento explícito de `editorTextosConfigurarImpressoraAtual`.

```text
CLOSURE_PASS_1_NEW_ITEMS = [preferences_routes.py, modelos_service.py,
  etiquetas_service.py, aplicar_compatibilidade_schema.py,
  comportamento explícito de printer setup, detalhes pyHanko]
CLOSURE_PASS_2_NEW_ITEMS = []
CLOSURE_PASS_N_NEW_ITEMS = 0
LAST_CLOSURE_PASS_NEW_ITEMS = 0
CLOSURE_REVERSE_SEARCH = PASS para novas famílias de referências;
  FAIL para a prova item-a-item exigida dos inventários já conhecidos.
```

## Resultado formal ET1-R3

```text
EDITOR_TEXTOS_ET1_R3_STATUS = INCOMPLETE
R2_GAPS_FOUND = 9
R2_GAPS_RESOLVED = 4 (assinatura, impressora/página, merge source, preferências/tipos)
R2_GAPS_REMAINING = 5 (símbolos, DOM item-a-item, diálogos detalhados, callers por endpoint, schema físico/consumidores arquivo-a-arquivo)

FILES_RELATED_TOTAL = 20 primeira ordem
SYMBOLS_RELATED_TOTAL = 359
DOM_CONTROLS_TOTAL = 152
DOM_CONTROLS_RELATED = 152
DIALOGS_TOTAL = 13
DIALOGS_RELATED = 13
ENDPOINTS_RELATED_TOTAL = 20
DATABASE_TABLES_RELATED_TOTAL = 9 entidades ORM referenciadas; 2 estruturais diretas
MERGE_FIELDS_TOTAL = 107
MODEL_TYPES_TOTAL = 8 (atestados, receitas, recibos, etiquetas, orcamentos, email_agenda, whatsapp_agenda, outros)
ASSISTANTS_TOTAL = 2 clínicos principais + 2 submenus auxiliares
UPSTREAM_PROVIDERS_TOTAL = 7 grupos
DOWNSTREAM_CONSUMERS_TOTAL = 7 tipos de modelo + consumidores contextuais

UNCLASSIFIED_SYMBOLS = [inventário individual]
UNCLASSIFIED_DOM_CONTROLS = [fichas individuais]
UNCLASSIFIED_DIALOGS = [validações/erros de cada campo]
UNCLASSIFIED_ENDPOINTS = [callers/status schemas individualizados]
UNCLASSIFIED_DATABASE_ITEMS = [introspecção física PostgreSQL]
UNCLASSIFIED_MERGE_FIELDS = []
UNCLASSIFIED_MODEL_TYPES = []
UNCLASSIFIED_ASSISTANTS = []
UNCLASSIFIED_RULER_ELEMENTS = [prova individual de cada tick/marker DOM]

ORPHAN_HANDLERS = [handlers internos/atalhos sem botão direto; não tratados como código morto sem prova]
CONTROLS_WITHOUT_HANDLERS = [elementos estruturais e bindings dinâmicos não individualizados]

REMAINING_UNPROVEN_ITEMS = [
  "classificação caller/callee/estado dos 359 símbolos",
  "classificação evento/estado dos 152 controles",
  "ficha completa de validação/erro dos 13 diálogos",
  "callers, schemas e status individualizados dos 20 endpoints",
  "consumidores arquivo-a-arquivo fora do editor",
  "introspecção física do PostgreSQL real",
  "inventário DOM individual da régua"
]
MATERIAL_GAPS = [REMAINING_UNPROVEN_ITEMS]
EXTERNALLY_BLOCKED = []

FUNCTIONAL_CODE_CHANGED = NAO
FRONTEND_REACT_CHANGED = NAO
LEGACY_FRONTEND_CHANGED = NAO
BACKEND_CHANGED = NAO
DATABASE_CHANGED = NAO
RUNTIME_CHANGED = NAO
VITE_CHANGED = NAO
COMMIT = NAO
PUSH = NAO
READY_FOR_EDITOR_TEXTOS_ET2 = NAO
```

Esta auditoria foi feita por leitura estática. O status permanece `INCOMPLETE` porque não foi possível comprovar, sem executar ou acessar o runtime/banco real, todos os comportamentos de impressora, todos os consumidores externos e o inventário físico completo de constraints/índices do banco. Esses pontos estão listados em `UNPROVEN_ITEMS`; não foram inferidos.

## Reabertura ET1-R2 e fechamento da varredura estática

O documento anterior foi relido e as evidências críticas foram revalidadas diretamente no código. A segunda passagem adicionou o inventário de IDs, overlays, símbolos, listeners de teclado e chamadas efetivas do frontend. Contagens abaixo são contagens de busca estática, não equivalem a homologação de runtime.

```text
FILES_MAPPED_TOTAL = 20 arquivos de primeira ordem catalogados
SYMBOLS_MAPPED_TOTAL = 335 funções editorTextos* em frontend/app.js + 12 funções no bootstrap
UI_CONTROLS_MAPPED_TOTAL = 152 IDs editor-textos-* encontrados no bootstrap
TOOLBAR_1_CONTROLS_TOTAL = 19
TOOLBAR_2_CONTROLS_TOTAL = 7
DIALOGS_MAPPED_TOTAL = 13 overlays/backdrops funcionais
ENDPOINTS_MAPPED_TOTAL = 20 decorators no router
DATABASE_TABLES_MAPPED_TOTAL = 9 classes/entidades referenciadas diretamente pelo router
MERGE_FIELDS_MAPPED_TOTAL = 107 no snapshot documentado; fallback legado com 8
UPSTREAM_MODULES_TOTAL = 7 grupos comprovados/partial
DOWNSTREAM_MODULES_TOTAL = 6 grupos comprovados/partial
THIRD_PARTY_DEPENDENCIES_TOTAL = 0 editor engines de terceiros comprovados
```

## Inventário de arquivos ET1-R2

| Classe | Arquivo(s) | Evidência/uso |
|---|---|---|
| LEGACY_HTML_FILES | `frontend/index.html` | item de menu `ferr-editor-textos`; carrega bootstrap |
| LEGACY_CSS_FILES | CSS inline de `frontend/js/modules/editor_textos_bootstrap.js`; classes `editor-textos-*` | layout, tela, régua, diálogos, print snapshot |
| LEGACY_JS_FILES | `frontend/app.js`; `frontend/js/modules/editor_textos_bootstrap.js` | 335 símbolos editorTextos no monólito; UI/API do bootstrap |
| BACKEND_ROUTE_FILES | `backend/routes/editor_textos_routes.py` | router completo `/editor-textos` |
| BACKEND_SERVICE_FILES | `editor_pdf_service.py`, `digital_signature_service.py`, `model_document_storage.py`, `receituario_pdf_template_service.py`, `modelos_service.py` | PDF, assinatura, storage e templates |
| BACKEND_MODEL_FILES | `modelo_documento.py`, `etiqueta_modelo.py`, `clinica.py`, `usuario.py`, `paciente.py`, `prestador_odonto.py`, `medicamento.py`, `doenca_cid.py`, `financeiro.py` | imports e consultas do router |
| BACKEND_SCHEMA_FILES | schemas/classes Pydantic embutidos em `editor_textos_routes.py` | corpos e respostas locais; não há arquivo schema exclusivo confirmado |
| DATABASE_MIGRATION_FILES | nenhum específico localizado | não há migrations formais do editor confirmadas |
| DATABASE_SQL_FILES | nenhum SQL específico localizado | acesso por SQLAlchemy/queries da rota |
| PDF_FILES | `backend/data/pdf_templates/receituario_simples_brana_digital.pdf` e serviços PDF | template AcroForm e geração |
| SIGNATURE_FILES | `digital_signature_service.py`; `local_bridge/` e chamadas Acrobat | assinatura A1/preparação/abertura local |
| TEMPLATE_FILES | `storage/modelos/base/`; `storage/modelos/clinicas/`; `backend/data/editor_textos_mesclagem_snapshot.json` | modelos e catálogo de campos |
| ASSET_FILES | `/desktop-assets/pasta.png`, `novo.png`, `gravar.png`, `imprimir.png`, `impressora.png`, `cancela.png`, `restaurar.png` | ícones referenciados pelo bootstrap |
| VENDOR_FILES | nenhum editor vendor identificado | ausência de import/CDN de Quill, TipTap, CKEditor, TinyMCE ou ProseMirror |
| TEST_FILES | não foi localizado teste dedicado do editor | testes existentes cobrem outras áreas; cobertura específica continua não comprovada |
| REACT_REFERENCES | protótipo/histórico TipTap citado em `docs/_historico_auditoria/` | referência histórica, fora do runtime principal |

Para cada arquivo acima, `WHY_RELATED`, `RESPONSIBILITY`, `SYMBOLS_USED`, `CALLED_BY`, `CALLS`, `DATA_READ`, `DATA_WRITTEN` e `SIDE_EFFECTS` estão descritos nas seções de fluxo, backend, dados e dependências deste documento. A decomposição símbolo-a-símbolo de todos os 347 símbolos não cabe em uma tabela confiável sem gerar um artefato mecânico; a contagem e as famílias funcionais foram verificadas por busca estática.

## Inventário visual total encontrado

Os 152 IDs estão no bootstrap e foram classificados por prefixo:

```text
shell/toolbar/ruler/status/page = editor-textos-panel, menus, botões, selects, page, ruler-scale, status
open/listagem/contexto = open-backdrop, open-q, open-tipo, open-tbody, refresh, context, ações abrir/renomear/excluir/propriedades
new/save/delete/page/pdf = new-backdrop, delete-backdrop, pdfprompt-backdrop, pagina-backdrop e respectivos campos/ações
merge/table/image/signature = merge-backdrop, table-backdrop, image-backdrop, sign-backdrop e campos/ações
assistente-receitas = assist-backdrop + assist-medmenu-backdrop e controles de paciente, cirurgião, medicamento, posologia, modelo, assinatura
assistente-atestado = atestado-backdrop + cidmenu-backdrop e controles de paciente, período, motivo, CID e observações
```

### Overlays/dialogs comprovados

| Dialog/overlay | Trigger | Resultado principal |
|---|---|---|
| `open-backdrop` | Abre | filtra/seleciona modelos; abre, renomeia, exclui, propriedades |
| `open-delete-backdrop` | Excluir | confirma exclusão |
| `pdfprompt-backdrop` | PDF | pergunta abertura/uso do PDF gerado |
| `new-backdrop` | Novo | escolhe modo/tipo de novo documento |
| `merge-backdrop` | Inserir campo | categoria, tabela de campos, inserção de token |
| `table-backdrop` | Tabela | linhas, colunas, borda; insere tabela |
| `pagina-backdrop` | Página | tipo, orientação, largura, altura, margens |
| `image-backdrop` | Imagem | arquivo, preview, ajuste, confirmação |
| `sign-backdrop` | Assinar PDF | PFX/senha, campo, PDF, bridge Windows/certificados |
| `assist-backdrop` | Assistente receita | paciente, cirurgião, medicamento, prescrição, modelo, assinatura |
| `assist-medmenu-backdrop` | Escolha medicamento | filtro, pesquisa, alfabeto e tabela |
| `atestado-backdrop` | Assistente atestado | paciente, datas/horas, motivo, CID e observações |
| `atestado-cidmenu-backdrop` | Escolha CID | filtro, pesquisa, preferidos, tabela |

## Editor engine — auditoria interna

```text
CONTENTEDITABLE_ROOT = #editor-textos-page
INITIALIZATION = editorTextosEnsureUI + bindings em app.js
EDITOR_STATE = editorTextosCfg, seleção salva, toolbar, overlays, imagem/tabela, standalone
DOCUMENT_STATE = modeloAtualId/arquivo/tipo/extensão/formato, HTML, dirty, paginaConfig, documentModel
ACTIVE_SELECTION = document.getSelection()/Range e editorTextosSelecaoObterRangeAtivo
SELECTION_TRACKING = eventos de seleção/foco, anchors e offsets textuais por parágrafo
COMMAND_EXECUTION = execCommand para formatação + operações próprias para tabulações/tabelas/imagens
EXEC_COMMAND_USAGE = confirmado por queryCommandState/queryCommandValue e comandos de edição
SELECTION_API_USAGE = confirmado
RANGE_API_USAGE = confirmado
INPUT_EVENTS = confirmado em página e diálogos
KEYDOWN_EVENTS = confirmado na página e em todos os overlays principais
PASTE/CUT/COPY = botões e listeners/ações do browser; tratamento completo Word/HTML não comprovado
DROP/DRAG/MOUSE = confirmado para régua, imagens e tabelas; drag/drop de arquivo como caminho geral não comprovado
DIRTY_STATE = editorTextosCfg.alterado + flags do document model
UNDO_STACK/REDO_STACK = não há stack customizada comprovada; depende do browser/execCommand/modelo
SERIALIZATION = HTML/RTF/TXT, imagens data URL e meta JSON
DESERIALIZATION = rota carrega bundle, conversores RTF/TXT/HTML e renderiza DOM/modelo
SANITIZATION = normalização HTML/atributos estruturais e sanitização de nome; política completa de tags não consolidada
FOCUS_RESTORE/SELECTION_RESTORE = helpers explícitos de range/cursor e reancoragem por modelo
```

## Formatação e elementos ricos

| Recurso | Implementado | Evidência |
|---|---|---|
| Negrito, itálico, sublinhado | SIM | botões e `queryCommandState` |
| Tachado, sobrescrito, subscrito | NÃO COMPROVADO | nenhum botão/handler dedicado localizado |
| Alinhamentos | SIM | esquerda, centro, direita, justificar |
| Lista | SIM | `editor-textos-btn-lista` e comando de lista |
| Recuo/tabulação | SIM | modelo de parágrafo, régua, Tab/Shift+Tab |
| Copiar/recortar/colar | SIM PARCIAL | botões e browser APIs; sanitização de fontes externas não fechada |
| Limpar formatação | NÃO COMPROVADO | nenhum comando dedicado localizado |
| Undo/redo | PARCIAL | browser/editor; stack e limite não declarados |
| Selecionar tudo | NÃO COMPROVADO como botão dedicado | comportamento nativo possível, sem contrato próprio |
| Símbolo/hyperlink/linha | NÃO COMPROVADO | busca de IDs/handlers dedicados não encontrou comando |
| Tabela | SIM | modal de linhas/colunas/borda, resize e serialização |
| Imagem | SIM | file input, preview, data URL, resize e remoção |
| Quebra de página | SIM VISUAL | paginação calculada/visual; estrutura persistida independente não comprovada |
| Cabeçalho/rodapé | NÃO COMPROVADO como editor control | PDF/print podem ter composição própria; editor não fechou suporte |

## Ruler/page setup detalhado

O modal de página possui IDs comprovados: `pagina-tipo`, `pagina-orientacao`, `pagina-largura`, `pagina-altura`, `pagina-margem-esquerda`, `pagina-margem-direita`, `pagina-margem-superior`, `pagina-ok`, `pagina-cancelar`. Há também CSS e estado para margem inferior/área útil. A conversão usa métricas DOM e unidades internas da régua; a equivalência física completa e todas as opções de papel ainda não foram fechadas.

Marcadores comprovados: margem esquerda, margem direita e tab stop. Eventos comprovados: mousedown, mousemove, mouseup, contexto e duplo clique da régua. O efeito é atualizar estado de régua/parágrafo, renderizar guias e persistir configuração junto do documento quando salvo.

## Busca reversa, condicionais, erros e auditoria

Condicionais relevantes encontradas: modo standalone/lock de aba; tipo/extensão do modelo; modelo base versus clínica; paciente obrigatório para assistentes; contexto de cirurgião; seleção atual; campos de assinatura; feature flag do document model; debug `EDITOR_TEXTOS_DEBUG`; fallback de MergeList/snapshot; fallback de arquivo registrado/recursivo/base; estado de seleção e foco; tipos de receita/atestado.

Erros são tratados por respostas HTTP, mensagens de status, `alert`/modal, fechamento/cancelamento e retorno ao estado anterior. O inventário completo de cada mensagem, retry e logging exige leitura de todos os blocos de exceção e runtime; portanto permanece área `FAIL` na cobertura abaixo.

Há auditoria backend para PDF/assinatura via `registrar_auditoria`; não foi comprovado versionamento/revisão de conteúdo, histórico de versões ou `updated_by` específico do modelo além dos timestamps/registro de auditoria existentes.

## Matriz de cobertura ET1-R2

| Área | Expected items | Mapped items | Missing items | Status |
|---|---:|---:|---|---|
| ENTRYPOINT | cadeia completa | cadeia menu→router | runtime final | PASS |
| FILES | todos os arquivos | primeira ordem + categorias | referências indiretas residuais | FAIL |
| FUNCTIONS | todos os símbolos | 347 contados/famílias | tabela completa de callers | FAIL |
| UI CONTROLS | todos | 152 IDs | regras campo a campo | FAIL |
| TOOLBAR 1/2 | todos | 19/7 | hotkeys e erro por comando | FAIL |
| FORMATTING | presença/ausência | comandos principais | colagem/limpeza completa | FAIL |
| EDITOR ENGINE | internals | contenteditable/model/range | Word/clipboard completo | FAIL |
| RULER/PAGE | geometria e eventos | implementados | equivalência física total | FAIL |
| NEW/OPEN/SAVE/SAVE AS/CLOSE | fluxos | principais | todas confirmações/runtime | FAIL |
| PRINT/PRINTER | mecanismos | print browser; impressora parcial | impressora real | FAIL |
| PDF/SIGNATURE | pipeline | rotas/serviços | capacidades criptográficas completas | FAIL |
| MERGE FIELDS | registro/resolver | 107 + fallback | tabela token por token no documento | FAIL |
| TEMPLATES/PREFERENCES | CRUD/relação | modelo e preferências parciais | consumidores totais | FAIL |
| UPSTREAM/DOWNSTREAM | busca reversa | grupos | inventário arquivo-a-arquivo | FAIL |
| BACKEND | endpoints/serviços | 20 endpoints | schemas/status/callers completos | FAIL |
| DATABASE | tabelas/constraints | ORM relacionado | introspecção PostgreSQL | FAIL |
| PERMISSIONS | checks | router/configuração/tenant | matriz CRUD por papel | FAIL |
| KEYBOARD/CLIPBOARD/UNDO | listeners | listeners e parcial | contrato completo | FAIL |
| IMAGES/TABLES | operações | presentes | todos casos de importação | FAIL |
| DIALOGS | overlays | 13 | campos/regras/erros completos | FAIL |
| ERRORS/LOGGING | todos | famílias | inventário mensagem/retry | FAIL |
| CSS/THIRD PARTY/BROWSER APIS | classes/dependências | CSS inline e APIs principais | licença/print CSS total | FAIL |
| GLOBALS/TESTS | uso e cobertura | globals implícitos; testes não dedicados | inventário final | FAIL |

## EDITOR_TEXTOS_FULL_DEPENDENCY_GRAPH

```text
ENTRYPOINT: index.html -> app.js -> editorTextosAbrir -> ensureUI
UI: bootstrap DOM/CSS -> toolbars -> overlays -> status/page/ruler
EDITOR CORE: contenteditable -> Selection/Range/execCommand -> document model
DOCUMENT STATE: editorTextosCfg -> HTML/format/tipo/id/dirty/paginaConfig
FORMATTING: fonte/tamanho/cor/marks/alinhamento/lista/recuo/tab
PAGE/RULER: page config -> ruler metrics -> paragraph model -> render
TEMPLATES: modelos endpoint -> ModeloDocumento -> filesystem/meta
MERGE FIELDS: catálogo -> token insertion -> /mesclar -> context resolvers
PDF: HTML/config -> editor_pdf_service -> bytes/download/temp
PRINT: clone/page CSS -> browser print -> cleanup
SIGNATURE: PDF/PFX/bridge -> digital_signature_service/local bridge -> output/audit
BACKEND: router -> auth/permission -> services -> ORM/storage
DATABASE: clinica -> modelos_documento; context entities -> merge/assistants
UPSTREAM: menu, sessão, clínica, preferências, paciente, prestador, agenda, medicamentos/CID
DOWNSTREAM: documentos clínicos, PDF, assinatura, Acrobat e consumidores de modelos
```

## EDITOR_TEXTOS_FLOW_CATALOG

| FLOW_ID | Trigger | API/storage | Resultado | Estado |
|---|---|---|---|---|
| F01 | menu Editor | nenhum na abertura; UI local | painel aberto/standalone | mapeado parcial |
| F02 | Novo | POST somente ao salvar | documento limpo/dirty conforme edição | mapeado parcial |
| F03 | Abre | GET modelos + GET detalhe | DOM/modelo/toolbar atualizados | mapeado |
| F04 | Salvar novo | POST modelos | novo ID/arquivo/meta | mapeado |
| F05 | Salvar existente | PUT modelo | conteúdo/meta atualizados | mapeado |
| F06 | Salvar como | POST modelos | cópia com novo ID/nome | mapeado parcial |
| F07 | Renomear/excluir | PATCH/DELETE | catálogo alterado | mapeado |
| F08 | Inserir campo/mesclar | GET campos/POST mesclar | token ou conteúdo resolvido | mapeado |
| F09 | Assistente receita | contexto/medicamentos/PDF template | texto/PDF assistido | mapeado parcial |
| F10 | Assistente atestado | contexto/motivos/CID | texto assistido | mapeado parcial |
| F11 | Exportar PDF | POST exportar-pdf | blob/download/abertura | mapeado |
| F12 | Imprimir | clone + browser print | impressão | mapeado parcial |
| F13 | Configurar página | estado/meta | página/régua/PDF alterados | mapeado parcial |
| F14 | Assinar/Acrobat | 4 endpoints | PDF assinado/preparado/aberto | mapeado parcial |
| F15 | Imagem/tabela | DOM/modelo | elemento rico persistível | mapeado parcial |
| F16 | Standalone | localStorage/lock? | posse de aba/heartbeat | storage específico não fechado |
```

## Limites respeitados

Nenhum arquivo funcional foi alterado. Não houve inicialização, parada ou reinício de Vite/backend, alteração de banco, chamada mutante de API, `git reset`, `git checkout`, `git clean`, commit ou push. O worktree já continha alterações e muitos arquivos não rastreados antes desta auditoria; eles foram preservados.

## Entry point comprovado

```text
frontend/index.html
  #ferr-editor-textos / data-menu-action="ferr-editor-textos"
    -> frontend/app.js (handler do menu e editorTextosAbrir)
      -> editorTextosEnsureUI()
        -> frontend/js/modules/editor_textos_bootstrap.js
           (cria o painel, toolbars, régua, página contenteditable e diálogos)
      -> bindings e funções do bloco Editor de Textos em frontend/app.js
        -> requestJson autenticado
          -> /editor-textos/*
            -> backend/routes/editor_textos_routes.py
              -> services, storage/modelos e SQLAlchemy
                -> modelos_documento e entidades de contexto
```

O editor legado não é uma rota React. O painel é criado no DOM pelo bootstrap e o motor de domínio permanece concentrado no monólito `frontend/app.js`, com apoio de `editor_textos_bootstrap.js`.

## Arquivos classificados

### LEGACY_FRONTEND_FILES

- `frontend/index.html` — menu, carregamento do bootstrap e scripts legados.
- `frontend/app.js` — estado, abertura, eventos, toolbar, serialização, modelos, mesclagem, PDF, assinatura e integrações.
- `frontend/js/modules/editor_textos_bootstrap.js` — criação da UI do editor, CSS inline do painel, diálogos e APIs de toolbar/painel.
- assets referenciados em `/desktop-assets/` — ícones legados das ações.

### BACKEND_FILES

- `backend/routes/editor_textos_routes.py` — router, endpoints, parsing/normalização, mesclagem, modelos, PDF, assinatura e Acrobat/local bridge.
- `backend/services/editor_pdf_service.py` — renderização do PDF do editor e remoção de tokens de assinatura.
- `backend/services/digital_signature_service.py` — assinatura A1 invisível, campo de assinatura e nomes de arquivo.
- `backend/services/model_document_storage.py` — resolução compartilhada de arquivos de modelo.
- `backend/services/receituario_pdf_template_service.py` — PDF AcroForm de receituário assistido.
- `backend/services/modelos_service.py` — serviços gerais de modelos consultados por integrações.

### DATABASE_FILES

- `backend/models/modelo_documento.py` — tabela `modelos_documento`.
- `backend/models/etiqueta_modelo.py` — tabela `etiqueta_modelo`, com FK opcional para `modelos_documento`.
- `backend/models/clinica.py`, `usuario.py`, `paciente.py`, `prestador_odonto.py`, `medicamento.py`, `doenca_cid.py`, `financeiro.py` — entidades usadas no contexto, mesclagem ou assistentes.
- Não foi encontrada migration formal específica do editor.

### SHARED_FILES

- `backend/main.py`, `backend/database.py`, `backend/security/dependencies.py`, `backend/security/permissions.py`.
- `frontend/app.js` e `requestJson`/estado global compartilhados.
- `storage/modelos/base/` e `storage/modelos/clinicas/`.

### DOCUMENTATION_FILES

- `docs/fase_2_editor_texto_subetapa_1_contrato_funcional.md`.
- `docs/fase_2_editor_texto_subetapa_2_mapeamento_tecnico.md`.
- `docs/auditoria_fina_editor_textos_editor_puro.md`.
- `docs/auditoria_fina_editor_textos_resto_domino.md`.
- `docs/auditoria_fina_editor_textos_pdf_assinatura.md`.
- `docs/11_roadmap_desenvolvimento.md`.
- `docs/padrao_barra_horizontal.md`.
- Este documento.

### REACT_RELATED_EXISTING_FILES

Foi localizado histórico/protótipo React/TipTap em documentos históricos, mas não há implementação React do Editor de Textos autorizada ou conectada ao shell atual. A auditoria não reutiliza esse protótipo como fonte da verdade.

### THIRD_PARTY_EDITOR_FILES

Nenhuma biblioteca WYSIWYG de terceiros foi comprovada no código consultado. O editor é implementação própria baseada em DOM/browser APIs.

## Editor engine, documento e página

```text
LEGACY_EDITOR_ENGINE = implementação própria sobre HTMLElement.contentEditable
LEGACY_EDITOR_ENGINE_VERSION = não aplicável / não declarada
LEGACY_DOCUMENT_FORMAT = HTML interno para edição; persistência por arquivos .rtf, .mod ou .txt conforme o modelo
PAGE_IMPLEMENTATION = div#editor-textos-page contenteditable=true, página branca em work area cinza
```

Evidências: `editor_textos_bootstrap.js` cria `#editor-textos-page` com `contenteditable="true"`; `app.js` usa seleção/range, `document.execCommand`/`queryCommandState`/`queryCommandValue`, modelo estrutural próprio, conversores HTML/RTF/TXT, e a rota lê/escreve arquivos de modelo.

O estado em memória inclui HTML, formato, modelo atual, dirty state, configuração de página e modelo estrutural de blocos/inlines/marks/tabulações. O backend mantém `conteudo_html` e `pagina_config` em arquivo `.meta.json` associado ao arquivo do modelo; o conteúdo principal permanece no arquivo do modelo. A normalização/conversão RTF/HTML/TXT é comprovada no backend. Imagens são representadas por data URL/HTML serializado quando inseridas no documento.

## Arquitetura visual legada

O bootstrap cria, nessa ordem:

1. menubar `Arquivo`, `Editar`, `Formatar`;
2. toolbar principal;
3. toolbar de campos/formatação;
4. régua horizontal;
5. área de trabalho cinza com página branca;
6. status bar;
7. diálogos de abrir, salvar como, mesclagem, assistente de receitas, assistente de atestado, CID e assinatura.

Dimensões declaradas no CSS do bootstrap: painel até `1340px x 780px`, página visual `860px` de largura e `1060px` de altura mínima, work area com `overflow:auto`, régua de `36px`. Há paginação visual contínua por quebras calculadas no frontend; não foi comprovada paginação persistida como estrutura independente.

## LEGACY_TOOLBAR_1_CONTROLS

Ordem DOM comprovada na toolbar principal:

```text
[
  "ABRE", "NOVO", "SALVA", "SALVAR COMO", "IMPRIME",
  "NEGRITO", "ITÁLICO", "SUBLINHADO", "RECORTAR", "COPIAR",
  "COLAR", "ALINHAR À ESQUERDA", "CENTRALIZAR", "ALINHAR À DIREITA",
  "JUSTIFICAR", "LISTA", "IMAGEM", "TABELA", "PÁGINA"
]
```

Há menus internos `Arquivo`, `Editar` e `Formatar`, além de ações contextuais no painel de abrir. Não foi autorizado mover os comandos para a futura barra React.

## LEGACY_TOOLBAR_2_CONTROLS

```text
[
  "FONTE", "TAMANHO", "COR", "NOME DO MODELO",
  "<<nome>> INSERE CAMPO DE MESCLAGEM", "GERAR PDF", "FECHA"
]
```

Fonte e tamanho são selects. A fonte é preenchida por fontes do sistema/browser e normalizada; o tamanho usa valores de UI e sincroniza com seleção. Cor usa select/paleta e swatch. Negrito/itálico/sublinhado e alinhamentos sincronizam estado visual com a seleção. A lista e a tabela são comandos de edição. Não foram comprovados tachado, sobrescrito ou subscrito como controles próprios.

## Régua

```text
RULER_IMPLEMENTATION = implementação própria em editor_textos_bootstrap.js + app.js
```

A régua tem escala/ticks, zonas fora da página, página, margens e conteúdo, marcadores arrastáveis para margem esquerda/direita e tab stop, guia visual e sincronização com o parágrafo. O estado inicial comprovado no bootstrap é `leftMarginUnit=1`, `rightMarginUnit=35`, `tabStops=[6]`, com `rulerUnits=36`. O modelo de parágrafo suporta primeira linha, hanging indent e tabulações semânticas. A unidade visual é uma grade interna de 36 unidades; equivalência física exata em milímetros/pontos não foi comprovada.

## Fluxos principais

### NEW_FLOW

`editorTextosNovo`/ações equivalentes limpam o documento, deixam `modeloAtualId` nulo, inicializam formato/tipo e dirty state, resetam modelo estrutural, configuração de página e seleção. O template inicial e a confirmação de descarte variam por contexto; o caminho completo de todos os diálogos não foi validado em runtime.

### OPEN_FLOW

O diálogo `#editor-textos-open-backdrop` lista modelos por tipo (`rich`, `text`, `model`) e pesquisa por nome/tipo/arquivo. A seleção chama `GET /editor-textos/modelos/{id}`, recebe metadados, conteúdo e configuração de página, converte o formato para HTML e reconstrói o modelo/DOM.

### SAVE_FLOW

Novo modelo usa `POST /editor-textos/modelos`; existente usa `PUT /editor-textos/modelos/{id}`. O payload contém nome/tipo/extensão/formato/conteúdo/configuração de página conforme o handler. O backend sanitiza nomes, resolve caminho por clínica, grava arquivo/metadados e atualiza `ModeloDocumento`. Salvamento é tenant-scoped.

### SAVE_AS_FLOW

Usa fluxo próprio/modal de nome e cria novo registro/arquivo, preservando o original. O backend calcula nome disponível e evita conflito por clínica/tipo. A confirmação e todos os casos de overwrite foram comprovados no código, mas não homologados visualmente nesta ET1.

### PDF_FLOW

`POST /editor-textos/exportar-pdf` recebe conteúdo/configuração e gera bytes por `editor_pdf_service.py`; o frontend oferece download/abertura conforme o contexto. O serviço usa renderização PDF própria e trata HTML, estilos, imagens, página e tokens de assinatura. Não foi comprovado que “Gerar PDF” e o futuro “Exportar PDF” tenham contrato idêntico; devem ser tratados como equivalentes apenas após ET2/runtime.

### PRINT_FLOW

O handler legado `editorTextosImprimirAtual` prepara uma janela/documento de impressão e usa API do navegador, incluindo `window.print` no caminho comprovado. CSS/HTML de impressão são montados no frontend. Não há endpoint específico de impressão direta.

### PAGE_SETUP_FLOW

Existe configuração de página no estado do editor e em metadados associados ao arquivo. O backend normaliza `pagina_config`; o frontend usa esses valores para página, margens e renderização/PDF. A lista completa de papéis/orientações aceitos não foi totalmente comprovada.

### PRINTER_SETUP_FLOW

Existe handler `editorTextosConfigurarImpressoraAtual`, mas a auditoria estática não comprovou seleção persistente de impressora, acesso direto ao driver ou configuração OS. Classificação: `LEGACY_BEHAVIOR = handler presente`; `BROWSER_COMPATIBILITY = acesso direto não comprovado`; `REACT_MIGRATION_CONSTRAINT = requer investigação/runtime`.

### PDF_SIGNATURE_FLOW

Classificação: `PARTIAL_FUNCTIONALITY`. Há `POST /assinar-pdf`, serviço de assinatura A1 invisível, preparação de campo vazio, registro local e rotas Acrobat/local bridge. Certificados/bridge são consultados no frontend. Não foi comprovado suporte A3, ICP-Brasil completo, provedor externo ou assinatura visual em todos os fluxos.

## Message field system

```text
MESSAGE_FIELD_SYSTEM = tokens <<...>> com catálogo por grupos, mesclagem no backend e inserção no cursor no frontend
MESSAGE_FIELDS_COUNT = 107 (snapshot atual documentado no roadmap; fallback legado contém 8)
```

As fontes comprovadas são `backend/data/editor_textos_mesclagem_snapshot.json` e, quando disponível, `storage/modelos/clinicas/1/MergeList.tmp`; há fallback legado. Os grupos do snapshot são `Atestado`, `Data`, `Clinica`, `Cirurgiao`, `Paciente`, `Contato`, `Receita`, `Recibo`, `Etiqueta`. A rota `GET /editor-textos/campos` entrega o catálogo. A rota `POST /editor-textos/mesclar` resolve tokens a partir de clínica, usuário, paciente, agenda, prestador e contexto específico; tokens sem valor podem ser preservados. A lista completa de 107 tokens deve ser tomada do snapshot/código, não deste resumo.

## Backend endpoints

```text
BACKEND_ENDPOINTS_COUNT = 20
```

| Método | Caminho | Função comprovada |
|---|---|---|
| POST | `/editor-textos/mesclar` | resolve tokens em texto/HTML |
| GET | `/editor-textos/campos` | catálogo de campos |
| GET | `/editor-textos/assistente-receitas/contexto` | contexto de receita |
| GET | `/editor-textos/assistente-receitas/medicamentos` | medicamentos |
| GET | `/editor-textos/assistente-atestado/contexto` | contexto de atestado |
| GET | `/editor-textos/assistente-atestado/motivos` | motivos |
| GET | `/editor-textos/assistente-atestado/cid` | CID filtrado |
| GET | `/editor-textos/modelos` | lista de modelos |
| GET | `/editor-textos/modelos/{modelo_id}` | detalhe/conteúdo |
| POST | `/editor-textos/modelos` | criação |
| PUT | `/editor-textos/modelos/{modelo_id}` | salvamento |
| PATCH | `/editor-textos/modelos/{modelo_id}/renomear` | renomeação |
| DELETE | `/editor-textos/modelos/{modelo_id}` | exclusão |
| POST | `/editor-textos/exportar-pdf` | PDF do editor |
| POST | `/editor-textos/assistente-receitas/exportar-pdf-template` | PDF AcroForm |
| POST | `/editor-textos/assinar-pdf` | assinatura A1 |
| POST | `/editor-textos/registrar-assinatura-local` | registro de assinatura local |
| POST | `/editor-textos/preparar-pdf-acrobat` | preparar arquivo para Acrobat |
| POST | `/editor-textos/abrir-no-acrobat` | abrir PDF no app local |
| POST | `/editor-textos/abrir-arquivo-pdf-acrobat` | abrir arquivo existente |

O router inteiro usa `require_module_access("configuracao")`; os handlers usam usuário autenticado e filtros por `current_user.clinica_id` nos modelos/contextos. A rota envolve `requestJson` no frontend e serviços PDF/assinatura/storage no backend.

## Banco e relação documento/modelo

```text
DATABASE_TABLES_COUNT = 1 direta + entidades de contexto
DATABASE_TABLES = [modelos_documento, etiqueta_modelo, clinicas, usuarios, pacientes,
                   prestadores_odonto, medicamentos, doencas_cid, itens_auxiliares]
```

`modelos_documento` é a persistência direta do catálogo: `id`, `clinica_id`, `tipo_modelo`, `codigo`, `nome_exibicao`, `nome_arquivo`, `extensao`, `caminho_arquivo`, `ativo`, `padrao_clinica`, `origem`, timestamps. `etiqueta_modelo.modelo_documento_id` é FK indireta para consumo de etiquetas. O conteúdo textual rico e metadados de página ficam no storage de arquivos, não em coluna de conteúdo da tabela. A classificação exata de todas as constraints/índices físicos do banco real ficou não comprovada sem inspeção do schema PostgreSQL.

### TABLE_RELATIONSHIP_MAP

```text
clinicas 1 -> N modelos_documento
modelos_documento 1 -> N? etiqueta_modelo (FK opcional; uso conforme etiqueta)
usuarios/clinicas -> contexto de preferência e autorização
pacientes/prestadores/medicamentos/doencas_cid -> contexto de mesclagem/assistentes; não são donos do documento
```

## Permissões e integrações

```text
PERMISSION_MODEL = autenticação de sessão + require_module_access("configuracao") + tenant por current_user.clinica_id
```

### UPSTREAM_MODULES

- Ferramentas/menu — entrada comprovada.
- Preferências — seleção de modelos preferidos de receita/atestado e tipos documentais; ligação por código/backend comprovada para parte do fluxo.
- Clínica/usuário — contexto e autorização.
- Paciente — contexto de mesclagem e assistentes.
- Prestador odontológico — dados de cirurgião/assinatura/mesclagem.
- Medicamentos — assistente de receitas.
- Doenças CID — assistente de atestado.
- Agenda — campos de data/hora e tipos de uso, conforme handlers.

### DOWNSTREAM_MODULES

- Geração de atestados, receitas, recibos, etiquetas, orçamentos e tipos textuais cadastrados — consumo de modelos é suportado pela enumeração `TEXT_MODEL_TYPES`, mas cada consumidor externo não foi individualmente confirmado.
- Exportação PDF e assinatura/Acrobat — consumo direto comprovado.
- Relatórios/configurações e outros fluxos de documentos — referências existem, mas a chamada completa de cada consumidor não foi fechada nesta etapa.

## Matriz funcional

| Função | Frontend legado | Backend | Banco/storage | Estado |
|---|---|---|---|---|
| Novo | handlers/estado | não necessariamente | novo modelo quando salvo | CONFIRMED estático |
| Abrir | modal/lista | GET modelo | arquivo + meta | CONFIRMED |
| Salvar | dirty + PUT/POST | cria/atualiza | modelo + arquivo | CONFIRMED |
| Salvar como | modal + novo estado | POST | novo arquivo/ID | CONFIRMED estático |
| Exportar PDF | botão | `/exportar-pdf` | temporário/download | CONFIRMED |
| Imprimir | handler/browser | não | não | CONFIRMED |
| Configurar página | estado/régua/PDF | meta `pagina_config` | `.meta.json` | CONFIRMED parcial |
| Configurar impressora | handler | não comprovado | não comprovado | UNPROVEN |
| Assinar PDF | modal/bridge | 4 endpoints relacionados | temporário/local | CONFIRMED parcial |
| Fonte/tamanho/cor | selects + seleção | serialização | HTML/RTF | CONFIRMED |
| Negrito/itálico/sublinhado | comandos | serialização | HTML/RTF | CONFIRMED |
| Alinhamento/lista/recuos | comandos/modelo | serialização | HTML/RTF | CONFIRMED |
| Régua/tabulações | modelo próprio | meta/documento | `.meta.json` | CONFIRMED |
| Campos de mensagem | catálogo + inserção | campos/mesclar | conteúdo/modelo | CONFIRMED |
| Undo/redo | browser/editor model | não | não | CONFIRMED parcial |
| Clipboard | botões/browser events | não | não | CONFIRMED parcial |
| Modelos | modal + estado | CRUD | `modelos_documento` + storage | CONFIRMED |
| Imagens | file input/paste/resize | não separado | HTML/data URL | CONFIRMED parcial |
| Tabelas | inserção/resize | serialização | HTML/RTF | CONFIRMED |

## EDITOR_TEXTOS_DEPENDENCY_GRAPH

```text
UPSTREAM:
  menu Ferramentas -> frontend/index.html/app.js
  sessão/auth -> requestJson + current_user
  clínica/usuário/paciente/prestador/agenda/medicamentos/CID
  preferências -> modelo preferido
  storage/modelos/base e storage/modelos/clinicas

EDITOR:
  app.js + editor_textos_bootstrap.js
  contenteditable + Selection/Range + execCommand/queryCommand*
  document model de blocos/inlines/marks/tabulações
  régua, página, diálogos, mesclagem e dirty state

DOWNSTREAM:
  modelos/documentos textuais
  PDF, assinatura A1, Acrobat/local bridge
  consumidores de atestados/receitas/recibos/etiquetas/orçamentos/e-mail/WhatsApp
```

## DATA_FLOW_MAP

```text
ABRIR:
USER -> editorTextosAbrir -> GET /modelos -> _query_visible_models
     -> ModeloDocumento + model_document_storage -> conteúdo/meta -> HTML/DOM/modelo

SALVAR:
USER -> handler salvar -> requestJson POST/PUT /modelos
     -> validar tenant/nome/formato -> arquivo + .meta.json + ModeloDocumento
     -> resposta serializada -> estado atual/dirty=false

MESCLAR:
USER/assistente -> inserir token ou POST /mesclar
     -> _build_merge_values -> paciente/clinica/prestador/agenda/contexto
     -> HTML/texto resolvido -> editor ou PDF

PDF:
USER -> Gerar PDF -> POST /exportar-pdf
     -> editor_pdf_service -> bytes PDF -> download/arquivo temporário

ASSINATURA:
USER -> assinar/Acrobat -> endpoints de assinatura/bridge
     -> digital_signature_service/local bridge -> PDF assinado ou erro
```

## Outros comandos legados mapeados

```text
OTHER_LEGACY_COMMANDS_MAPPED = [Arquivo, Editar, Formatar, Recortar, Copiar, Colar,
  Negrito, Itálico, Sublinhado, alinhamentos, Lista, Imagem, Tabela,
  Fonte, Tamanho, Cor, Inserir campo, Fechar, assistente de receitas,
  assistente de atestado, CID, exportação PDF, assinatura, Acrobat/local bridge]
OTHER_LEGACY_COMMANDS_REACT_POSITION = AGUARDANDO_DEFINIÇÃO_DO_USUÁRIO
```

## Arquitetura React candidata (somente proposta)

```text
features/editorTextos/
  api/              (modelos, campos, mesclagem, PDF, assinatura)
  models/           (documento, página, parágrafo, inline, marks, tabulações)
  adapters/         (HTML/RTF/TXT, legacy tokens, request/response)
  components/       (workspace, página, toolbars, régua, status)
  dialogs/          (abrir, salvar como, página, mesclagem, assistentes, assinatura)
  hooks/            (document state, dirty state, selection, dialogs)
  services/         (document, merge, print, pdf, signature)
  utils/            (selection/range, serialization, pagination, sanitization)
  styles/           (somente feature; shell permanece global)
```

A futura banda horizontal oficial deve usar o shell canônico e congelar exatamente:

```text
["NOVO", "ABRE", "SALVAR", "SALVAR COMO", "EXPORTAR PDF",
 "IMPRIME", "CONFIGURA PÁGINA", "CONFIGURA IMPRESSORA", "ASSINAR PDF"]
```

Não implementar esta proposta nesta ET1. Os demais comandos permanecem sem posição React definida.

## Riscos de migração

| Risco | Evidência | Impacto | Migration concern |
|---|---|---|---|
| HTML/RTF legado | conversores próprios e extensões `.mod/.rtf` | perda de formatação/campos | adapter e fixtures reais |
| Seleção/cursor | Selection/Range, reancoragem e modelo paralelo | cursor errado ao rerenderizar | preservar contrato model-first |
| Régua/tabulação | 36 unidades e operações semânticas | layout divergente | validar visualmente |
| Paginação/PDF | quebra visual + serviço PDF separado | PDF diferente da tela | comparar documentos reais |
| Impressão | browser `window.print` | dependência do browser | validar CSS/preview |
| Impressora | handler sem prova de driver persistente | promessa funcional indevida | investigar antes de portar |
| Campos dinâmicos | 107 tokens + fallback legado | documentos incompletos | congelar catálogo/fixtures |
| Assinatura | A1/Acrobat/local bridge parcial | fluxo incompatível | separar capacidades comprovadas |
| Imagens/tabelas | HTML/data URL e resize | perda de assets | testar clipboard/importação |
| Tenant/permissão | router configuração + `clinica_id` | vazamento entre clínicas | manter filtros no adapter/API |

## UNPROVEN_ITEMS

```text
[
  "Comportamento de Configura Impressora no runtime e persistência de seleção de impressora",
  "Lista completa de papéis/orientações/unidades aceitos em Configura Página",
  "Inventário individual de todos os consumidores downstream fora do router/editor",
  "Constraints, índices e FKs físicos completos do PostgreSQL real sem introspecção do banco",
  "Cobertura runtime de todos os atalhos, clipboard, undo/redo, diálogos e casos de erro",
  "Suporte efetivo a certificados A3/ICP-Brasil, provedor externo e assinatura visual",
  "Equivalência funcional exata entre Gerar PDF legado e Exportar PDF React",
  "Compatibilidade React de qualquer editor engine; nenhuma escolha de biblioteca foi feita"
]
```

## Fechamento

Arquivos alterados por esta etapa: somente este documento. Validação executada: leitura estática, busca de referências, enumeração de rotas, inspeção de modelos e conferência de `HEAD`/branch/status. Não validado: runtime visual, login, banco PostgreSQL real, impressão física, impressora, assinatura real, PDF com dados reais e consumidores externos completos. Riscos remanescentes: os itens `UNPROVEN_ITEMS` acima. Ação manual do CEO/operador: nenhuma nesta etapa; revisar este contrato e definir se autoriza uma ET2 de investigação/runtime. Não iniciar React antes dessa revisão.

## Saída formal ET1-R2

```text
EDITOR_TEXTOS_ET1_R2_STATUS = INCOMPLETE
AUDIT_DOCUMENT = docs/editor_textos_et1_auditoria_forense_integral.md

ENTRYPOINT_AUDIT = PASS
FILES_AUDIT = FAIL
SYMBOL_AUDIT = FAIL
UI_AUDIT = FAIL
TOOLBAR_AUDIT = FAIL
FORMATTING_AUDIT = FAIL
EDITOR_ENGINE_AUDIT = FAIL
RULER_AUDIT = FAIL
PAGE_AUDIT = FAIL
DOCUMENT_LIFECYCLE_AUDIT = FAIL
PAGE_SETUP_AUDIT = FAIL
PRINT_AUDIT = FAIL
PRINTER_AUDIT = FAIL
PDF_AUDIT = FAIL
SIGNATURE_AUDIT = FAIL
MERGE_FIELDS_AUDIT = FAIL
TEMPLATES_AUDIT = FAIL
PREFERENCES_INTEGRATION_AUDIT = FAIL
UPSTREAM_AUDIT = FAIL
DOWNSTREAM_AUDIT = FAIL
BACKEND_AUDIT = FAIL
DATABASE_AUDIT = FAIL
PERMISSIONS_AUDIT = FAIL
KEYBOARD_AUDIT = FAIL
CLIPBOARD_AUDIT = FAIL
UNDO_REDO_AUDIT = FAIL
IMAGES_AUDIT = FAIL
TABLES_AUDIT = FAIL
DIALOGS_AUDIT = FAIL
ERROR_HANDLING_AUDIT = FAIL
CSS_AUDIT = FAIL
DEPENDENCIES_AUDIT = FAIL
BROWSER_APIS_AUDIT = FAIL
GLOBALS_AUDIT = FAIL
TESTS_AUDIT = FAIL
CLOSURE_REVERSE_SEARCH = FAIL

REMAINING_UNPROVEN_ITEMS = [
  "inventário arquivo-a-arquivo de todas as referências indiretas",
  "callers e efeitos de cada um dos 347 símbolos",
  "regras e eventos individualizados dos 152 controles",
  "tokens listados individualmente neste contrato",
  "consumidores e produtores externos arquivo-a-arquivo",
  "schema PostgreSQL real em leitura somente",
  "runtime de impressora, impressão, PDF, assinatura e casos de erro"
]
EXTERNALLY_BLOCKED = []

FUNCTIONAL_CODE_CHANGED = NAO
BACKEND_CHANGED = NAO
DATABASE_CHANGED = NAO
VITE_CHANGED = NAO
RUNTIME_CHANGED = NAO
COMMIT = NAO
PUSH = NAO
READY_FOR_EDITOR_TEXTOS_ET2 = NAO
```
