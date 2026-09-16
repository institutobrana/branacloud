# Brana Cloude — Editor de Textos

## ET3D2-MODALS-AUDIT — auditoria forense dos modais Abrir modelo e Novo texto

**Escopo:** auditoria somente. Nenhum código React, legado, backend, banco,
dependência ou runtime foi alterado.

## 1. Resultado executivo

| Item | Resultado | Evidência principal |
|---|---|---|
| Modal legado ABRIR MODELO | PROVEN_PRESENT | `frontend/js/modules/editor_textos_bootstrap.js:83-106`; `frontend/app.js:16904-16928` |
| Modal legado NOVO TEXTO | PROVEN_PRESENT | `frontend/js/modules/editor_textos_bootstrap.js:150-163`; `frontend/app.js:20914-20933` |
| Modal React equivalente a ABRIR | PROVEN_PRESENT, contrato reduzido | `EditorTextosDocumentDialogs.jsx` |
| Modal React equivalente a NOVO TEXTO | PROVEN_ABSENT | não há componente/estado/handler React correspondente |
| Auditoria completa sem pendências | NÃO | há itens nominais abaixo que exigem confirmação adicional |

## 2. Contratos e dados comprovados

### 2.1 Backend e autorização

O router `backend/routes/editor_textos_routes.py` usa prefixo
`/editor-textos` e dependência `require_module_access("configuracao")`.
As rotas relevantes comprovadas são:

| Método | Caminho | Função | Uso |
|---|---|---|---|
| GET | `/editor-textos/modelos` | `listar_modelos_editor_textos` | lista modelos visíveis |
| GET | `/editor-textos/modelos/{modelo_id}` | `detalhar_modelo_editor_textos` | carrega conteúdo e metadados |
| POST | `/editor-textos/modelos` | `criar_modelo_editor_textos` | cria modelo clínico |
| PUT | `/editor-textos/modelos/{modelo_id}` | `salvar_modelo_editor_textos` | salva modelo existente |
| PATCH | `/editor-textos/modelos/{modelo_id}/renomear` | `renomear_modelo_editor_textos` | renomeia |
| DELETE | `/editor-textos/modelos/{modelo_id}` | `excluir_modelo_editor_textos` | exclui |

O modelo ORM é `ModeloDocumento`, tabela `modelos_documento`, com os campos
`id`, `clinica_id`, `tipo_modelo`, `codigo`, `nome_exibicao`, `nome_arquivo`,
`extensao`, `caminho_arquivo`, `ativo`, `padrao_clinica` e `origem`.
Há FK `modelos_documento.clinica_id -> clinicas.id` comprovada na ET1.

O filtro de visibilidade comprovado no backend aceita registros ativos da
clínica atual e registros globais (`clinica_id IS NULL`). O backend serializa
origem técnica; a renderização legada converte essa origem para `Base` ou
`Clinica` na grade.

### 2.2 Tipos do filtro ABRIR

Fonte: `frontend/app.js:149-154`.

| VALUE | LABEL | Efeito comprovado |
|---|---|---|
| `rich` | Arquivo texto rico | aceita extensão `.rtf` |
| `text` | Arquivo de texto | aceita extensão `.txt` |
| `model` | Modelos de texto | aceita extensão `.mod` |
| `all` | Todos (*.*) | não restringe por essas extensões |

O valor inicial comprovado é `rich` (`frontend/js/modules/editor_textos_bootstrap.js:1137-1139`).

### 2.3 Tipos do modal NOVO

Fonte: `frontend/app.js:108-113`.

| TYPE_ID | LABEL | Valor inicial | Fluxo comprovado |
|---|---|---|---|
| `receita` | Receita | sim | garante paciente, cria conteúdo por tipo e abre assistente de receita |
| `atestado` | Atestado | não | garante paciente, cria conteúdo por tipo e abre assistente de atestado |
| `carta_paciente` | Carta para paciente | não | cria conteúdo por tipo após garantia de paciente |
| `carta_simples` | Carta simples | não | cria conteúdo por tipo sem evidência de assistente específico |
| `texto_branco` | Texto em branco | não | cria conteúdo por tipo sem assistente específico |

O radio `abrir` chama `editorTextosFecharModalNovo()` e depois
`editorTextosAbrirModalAbrir()` (`frontend/app.js:20914-20921`). Portanto há
convergência funcional para a abertura, mas o compartilhamento de handler não
foi demonstrado como identidade de função.

Os oito tipos de modelo auditados na ET1 são:
`atestados`, `receitas`, `recibos`, `etiquetas`, `orcamentos`, `email_agenda`,
`whatsapp_agenda` e `outros`. A correspondência comprovada é direta apenas
para `receita -> receitas` e `atestado -> atestados`; os três tipos de carta
e `texto_branco` não possuem equivalência nominal comprovada na fonte
consultada.

## 3. Modal ABRIR MODELO — inventário forense

### 3.1 Controles

| CONTROL_ID | Tipo | Label/valor | Estado/comportamento comprovado |
|---|---|---|---|
| `editor-textos-open-backdrop` | backdrop | — | overlay ocultável |
| `editor-textos-open-q` | input text | `Nome`, placeholder `Pesquisar por nome` | filtra no evento `input` |
| `editor-textos-open-tipo` | select | `Tipo`, default `rich` | filtra no evento `change` |
| `editor-textos-open-refresh` | button | `Atualiza` | refaz GET da lista |
| `editor-textos-open-tbody` | tbody | grade | recebe linhas renderizadas |
| `editor-textos-open-ok` | button | `Ok` | exige seleção e carrega modelo |
| `editor-textos-open-cancelar` | button | `Cancela` | fecha sem carregar |
| `editor-textos-open-context` | menu | Abrir/Renomear/Excluir/Propriedades | aparece por contexto da linha |
| `editor-textos-open-menu-abrir` | button | `Abrir` | abre item contextual |
| `editor-textos-open-menu-renomear` | button | `Renomear` | PATCH, conforme handler legado |
| `editor-textos-open-menu-excluir` | button | `Excluir` | confirmação e DELETE |
| `editor-textos-open-menu-propriedades` | button | `Propriedades` | handler existente; contrato de saída requer confirmação nominal |

### 3.2 Filtragem e grade

`editorTextosRenderListaAbertura` filtra `nome`, `tipo_modelo` e
`nome_arquivo` por `includes` case-insensitive após `trim().toLowerCase()`.
Não há debounce comprovado. A atualização ocorre enquanto se digita. O filtro
de tipo é aplicado por extensão: `rich=.rtf`, `text=.txt`, `model=.mod`.

Colunas renderizadas:

1. `Nome` ← `item.nome`;
2. `Tipo` ← `item.tipo_modelo`;
3. `Origem` ← `item.sistema ? "Base" : "Clinica"`.

A linha possui `data-id`. O clique seleciona uma única linha e grava
`openSelId`. O duplo clique chama `editorTextosAbrirModelo(openSelId)` e fecha
o modal. O botão `Ok` executa o mesmo carregamento após exigir seleção.
Não foi localizado código comprovando ordenação por cabeçalho, paginação,
seleção múltipla, ArrowUp/ArrowDown ou Enter na grade.

### 3.3 Fluxo direto comprovado

```text
botão ABRE
→ editorTextosAbrirModalAbrir
→ GET /editor-textos/modelos
→ editorTextosRenderListaAbertura
→ clique/double-click/Ok em data-id
→ GET /editor-textos/modelos/{id}
→ editorTextosAbrirModelo
→ conteúdo HTML/texto + tipo + identidade no estado legado
```

O cancelamento apenas oculta o backdrop e não chama o endpoint de detalhe.
O fluxo de dirty antes de abrir usa `editorTextosConfirmarDescartar`, mas a
matriz completa de todas as opções da confirmação não foi fechada nesta
auditoria.

## 4. Modal NOVO TEXTO — inventário forense

### 4.1 Controles

| CONTROL_ID | Tipo | Estado/comportamento comprovado |
|---|---|---|
| `editor-textos-new-backdrop` | backdrop | overlay ocultável |
| `editor-textos-new-mode-open` | radio | abre texto existente; desabilita a lista de tipos |
| `editor-textos-new-mode-type` | radio | modo padrão selecionado |
| `editor-textos-new-type` | select size 5 | lista dos cinco tipos, default `receita` |
| `editor-textos-new-ok` | button | executa branch do radio |
| `editor-textos-new-cancelar` | button | fecha sem criar/carregar |

### 4.2 Fluxos nominais

| Fluxo | Cadeia comprovada |
|---|---|
| `NOVO_OPEN_EXISTING` | radio abrir → fecha Novo → abre modal ABRIR |
| `NOVO_CREATE_RECEITA` | receita → `editorTextosGarantirPacienteParaTipo` → `editorTextosNovoPorTipo` → assistente receita |
| `NOVO_CREATE_ATESTADO` | atestado → garantia de paciente → `editorTextosNovoPorTipo` → assistente atestado |
| `NOVO_CREATE_CARTA_PACIENTE` | carta paciente → garantia de paciente → `editorTextosNovoPorTipo` |
| `NOVO_CREATE_CARTA_SIMPLES` | carta simples → `editorTextosNovoPorTipo` |
| `NOVO_CREATE_BLANK` | texto branco → `editorTextosNovoPorTipo` |
| `NOVO_CANCEL` | fechar backdrop; não chama criação nem detalhe |

O endpoint exato de criação do documento-base em `editorTextosNovoPorTipo`
precisa ser confirmado em leitura adicional do bloco de implementação dessa
função antes de uma reimplementação. O assistente de receita usa
`GET /editor-textos/assistente-receitas/contexto`; o assistente de atestado
usa `GET /editor-textos/assistente-atestado/contexto`, ambos com modelos por
tipo e contexto de paciente comprovados no backend.

## 5. Modal React atual — comparação

### 5.1 ABRIR

O componente atual é
`frontend-react/src/features/editorTextos/components/EditorTextosDocumentDialogs.jsx`,
`EditorTextosOpenDialog`. Ele possui apenas:

- título `Abrir documento`;
- um select `Documento` com `items` já carregados;
- botões `Cancelar` e `Abrir`;
- callback `onOpen(selectedId)`.

O hook `useEditorDocumentLifecycle` faz o GET de lista antes de abrir o modal
e o GET de detalhe após a confirmação. Isso preserva a cadeia básica, mas não
reproduz filtros Nome/Tipo, botão Atualiza, grade, Origem, seleção de linha,
duplo clique, ações contextuais ou confirmação de dirty comprovada no legado.

### 5.2 NOVO

`REACT_NEW_MODAL_PRESENT = NÃO`. O botão React Novo executa diretamente
`newDocument()` no hook, respeitando apenas `dirty` como guarda booleana. Não
há radio Abrir existente, seleção de tipo, garantia de paciente, assistentes
de receita/atestado ou mapeamento dos cinco tipos.

## 6. Matrizes de comparação

### 6.1 LEGACY_VS_REACT_ABRE_MATRIX

| Feature | Legacy | React atual | Match | Gap | Severity | Future action |
|---|---|---|---|---|---|---|
| Lista via API | GET lista ao abrir modal | hook lista antes do modal | PARTIAL | timing/UX diferente | média | confirmar contrato UX |
| Pesquisa Nome | input com filtro live | ausente | FAIL | `open-q` não existe | material | implementar após auditoria |
| Filtro Tipo | quatro opções por extensão | ausente | FAIL | `open-tipo` não existe | material | implementar |
| Atualiza | refaz GET | ausente | FAIL | refresh inexistente | média | implementar |
| Grade | Nome/Tipo/Origem | select de nomes | FAIL | estrutura e origem ausentes | material | implementar |
| Seleção | linha única `data-id` | option selecionada | PARTIAL | interação diferente | média | alinhar UX |
| Double click | abre modelo | ausente | FAIL | handler inexistente | média | implementar |
| Context menu | Abrir/Renomear/Excluir/Propriedades | ausente | FAIL | operações ausentes | material | delimitar contrato |
| Cancelar | fecha sem detalhe | fecha | PASS básico | confirmação dirty não equivalente | média | validar guard |
| Carregamento | GET detalhe + HTML/metadados | GET detalhe + adapter | PASS básico | metadata parcial | média | completar modelo |

### 6.2 LEGACY_VS_REACT_NEW_MATRIX

| Feature | Legacy | React atual | Match | Gap | Severity | Future action |
|---|---|---|---|---|---|---|
| Modal Novo texto | presente | ausente | FAIL | componente inexistente | material | criar após fechamento |
| Abrir existente | converge para ABRIR | ausente | FAIL | branch inexistente | material | implementar |
| Tipos | cinco opções | Novo vazio direto | FAIL | catálogo ausente | material | implementar com mapping |
| Garantia de paciente | receita/atestado/cartas conforme função | ausente | FAIL | contexto não tratado | material | confirmar cada tipo |
| Assistente receita | abre após Receita | ausente | FAIL | integração ausente | material | delimitar fase |
| Assistente atestado | abre após Atestado | ausente | FAIL | integração ausente | material | delimitar fase |
| Cancelar | fecha modal | Novo local sem modal | FAIL | estado/UX diferente | média | implementar |

## 7. Causa dos nomes duplicados no React

`REACT_OPEN_DUPLICATE_NAMES_CAUSE = NÃO PROVADA nesta rodada.`

O backend retorna registros distintos por `id`, `clinica_id`, `tipo_modelo`,
`nome_exibicao` e `origem`; a grade legada também mostra origem. O React usa
`item.id` como `key`, mas exibe somente `nome_exibicao || nome`, ocultando tipo
e origem. Isso explica a possibilidade de percepção visual de duplicidade,
mas não prova se os registros são duplicatas reais, modelos base/clínica com
mesmo nome ou registros repetidos na resposta. É um item nominal pendente,
não uma conclusão especulativa.

## 8. Combo inferior do React

`REACT_OPEN_LOWER_COMBO = PROVEN_ABSENT` no componente auditado. O React atual
tem somente o select `Documento` dentro de `EditorTextosOpenDialog`; não há
um segundo combo inferior. A lista `items` é fornecida pelo hook e o select
é a única representação da seleção.

## 9. Matriz de eventos

| CONTROL | EVENT | HANDLER | NEXT CALL | STATE/SIDE EFFECT |
|---|---|---|---|---|
| `editor-textos-open-q` | input | `editorTextosRenderListaAbertura` | nenhum endpoint | filtra tbody |
| `editor-textos-open-tipo` | change | `editorTextosRenderListaAbertura` | nenhum endpoint | filtra por extensão |
| `editor-textos-open-refresh` | click | `editorTextosCarregarModelos` | GET `/modelos` | substitui itens/tbody |
| `editor-textos-open-tbody` | click | seleção de linha | nenhum endpoint | grava `openSelId` |
| `editor-textos-open-tbody` | dblclick | abre selecionado | GET `/modelos/{id}` | carrega editor |
| `editor-textos-open-ok` | click | abre selecionado | GET `/modelos/{id}` | carrega editor/fecha |
| `editor-textos-open-cancelar` | click | fecha modal | nenhum | preserva editor |
| `editor-textos-new-mode-open` | change | `editorTextosNovoAplicarModo` | nenhum | desabilita tipo |
| `editor-textos-new-mode-type` | change | `editorTextosNovoAplicarModo` | nenhum | habilita tipo |
| `editor-textos-new-ok` | click | `editorTextosNovoExecutar` | branch abrir/criar | carrega ou cria fluxo |
| `editor-textos-new-cancelar` | click | `editorTextosFecharModalNovo` | nenhum | fecha modal |

## 10. Pendências nominais que impedem fechamento

| ID | Item exato | Evidência já encontrada | O que falta provar |
|---|---|---|---|
| `OPEN-GAP-01` | causa dos nomes duplicados na lista React | resposta usa IDs distintos e React oculta tipo/origem | resposta real/fixture nominal que diferencie duplicata, base e clínica |
| `OPEN-GAP-02` | comportamento de Enter/ArrowUp/ArrowDown/Tab no modal legado | listener de `keydown` foi localizado para overlays | branch exato por tecla no modal ABRIR |
| `OPEN-GAP-03` | contrato de Propriedades da linha | botão/context menu localizado | handler e efeito final completos |
| `OPEN-GAP-04` | sort/paginação da grade | renderização de tbody localizada | prova de ausência ou implementação de ordenação/paginação |
| `OPEN-GAP-05` | matriz física/API completa de cada campo React/legado | serializer/ORM/rotas localizados | transformação final por campo, inclusive `sistema` versus `origem` |
| `NEW-GAP-01` | conteúdo/metadata exatos de `editorTextosNovoPorTipo` | dispatch por cinco tipos comprovado | corpo completo da função e HTML inicial por tipo |
| `NEW-GAP-02` | `carta_paciente` versus `carta_simples` | ambos os valores existem | diferença funcional, contexto obrigatório e downstream |
| `NEW-GAP-03` | equivalência de “Abrir existente” com ABRE primário | ambos convergem para abertura de modal | identidade de handlers, dirty guard e estados temporários |
| `NEW-GAP-04` | dirty guard do legado ao acionar NOVO | `editorTextosConfirmarDescartar` foi localizado | opções e efeitos de Salvar/Descartar/Cancelar por branch |
| `NEW-GAP-05` | dependências de Preferências por tipo Novo | resolutores de modelo preferido existem no backend | ligação nominal de cada tipo do modal ao campo de preferência |

## 11. Auditoria de referências reversas

Foram pesquisados, nos arquivos legados e React:
`editor-textos-open`, `editor-textos-new`, `Abrir modelo`, `Novo texto`,
`Atualiza`, `Origem`, `Receita`, `Atestado`, `Carta`, `Texto em branco`,
`/editor-textos/modelos` e handlers `editorTextosNovo*`/`editorTextosOpen*`.

`LAST_CLOSURE_PASS_NEW_REFERENCES = 0` para os símbolos e endpoints já
catalogados; os itens nominais acima são lacunas de prova, não novos achados.

## 12. Arquitetura futura, sem implementação

Após resolver as lacunas, a arquitetura recomendada é modular:

```text
editorTextos/
  components/
    EditorTextosOpenModelDialog.jsx
    EditorTextosNewTextDialog.jsx
    EditorTextosModelGrid.jsx
  hooks/
    useOpenModelDialog.js
    useNewTextDialog.js
  api/
    editorTextosApi.js
  models/
    editorTextosModalModels.js
  adapters/
    editorTextosModalAdapters.js
```

Os modais não devem compartilhar um componente monolítico. Podem compartilhar
consulta de modelos, opções de tipo, seleção, dirty guard e normalizadores,
mantendo fluxos de abertura e criação separados.

## 13. Fechamento formal

```text
EDITOR_TEXTOS_MODAL_AUDIT_STATUS = INCOMPLETE
AUDIT_DOCUMENT = docs/editor_textos_et3_modais_novo_abre_auditoria.md

OPEN_MODAL_AUDIT = FAIL
NEW_MODAL_AUDIT = FAIL
OPEN_MODAL_CONTROL_COUNT = 12
NEW_MODAL_CONTROL_COUNT = 6
OPEN_MODAL_FLOW_COUNT = 7
NEW_MODAL_FLOW_COUNT = 7

OPEN_MODAL_ENDPOINTS = [GET /editor-textos/modelos, GET /editor-textos/modelos/{id}, PATCH /editor-textos/modelos/{id}/renomear, DELETE /editor-textos/modelos/{id}]
NEW_MODAL_ENDPOINTS = [GET /editor-textos/modelos/{id} via abrir existente, endpoints de contexto de receita/atestado quando os assistentes são abertos, criação dependente de editorTextosNovoPorTipo ainda nominalmente pendente]

OPEN_MODAL_TABLES = [modelos_documento, clinicas]
NEW_MODAL_TABLES = [modelos_documento, clinicas, entidades de contexto somente nos branches de assistentes]

OPEN_MODAL_DEPENDENCIES = [Editor Textos, modelos_documento, storage/modelos, autenticação, require_module_access("configuracao")]
NEW_MODAL_DEPENDENCIES = [Editor Textos, modelos_documento, paciente/contexto, assistente receita, assistente atestado, Preferências parcialmente comprovadas]
OPEN_MODAL_EXTERNAL_CONSUMERS = [fluxos de receita/atestado que chamam editorTextosAbrirModelo; demais consumidores não fechados nominalmente]
NEW_MODAL_EXTERNAL_CONSUMERS = [assistente receita, assistente atestado]
OPEN_MODAL_TYPE_OPTIONS = [rich, text, model, all]
NEW_MODAL_TYPE_OPTIONS = [receita, atestado, carta_paciente, carta_simples, texto_branco]
NEW_OPEN_EXISTING_EQUIVALENT_TO_PRIMARY_OPEN = PARTIAL
REACT_OPEN_DUPLICATE_NAMES_CAUSE = NÃO PROVADA; React oculta tipo/origem e usa apenas nome exibido
REACT_OPEN_MODAL_CURRENT_GAPS = [OPEN-GAP-01, OPEN-GAP-02, OPEN-GAP-03, OPEN-GAP-04, OPEN-GAP-05]
REACT_NEW_MODAL_CURRENT_GAPS = [NEW-GAP-01, NEW-GAP-02, NEW-GAP-03, NEW-GAP-04, NEW-GAP-05]

LEGACY_VS_REACT_OPEN_MATRIX = FAIL
LEGACY_VS_REACT_NEW_MATRIX = FAIL
MODAL_DATA_FLOW_AUDIT = FAIL
MODAL_API_AUDIT = FAIL
MODAL_DATABASE_AUDIT = PASS
MODAL_DEPENDENCY_AUDIT = FAIL
MODAL_EVENT_AUDIT = FAIL
LAST_CLOSURE_PASS_NEW_REFERENCES = 0
UNPROVEN_OPEN_MODAL_ITEMS = [OPEN-GAP-01, OPEN-GAP-02, OPEN-GAP-03, OPEN-GAP-04, OPEN-GAP-05]
UNPROVEN_NEW_MODAL_ITEMS = [NEW-GAP-01, NEW-GAP-02, NEW-GAP-03, NEW-GAP-04, NEW-GAP-05]
MATERIAL_MODAL_GAPS = [OPEN-GAP-01, OPEN-GAP-03, OPEN-GAP-05, NEW-GAP-01, NEW-GAP-02, NEW-GAP-04]

FUNCTIONAL_CODE_CHANGED = NÃO
REACT_MODAL_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
DEPENDENCIES_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
VITE_PORT_CHANGED = NÃO
HTTPS_CHANGED = NÃO
VITE_CONFIG_CHANGED = NÃO
ENV_CHANGED = NÃO
COMMIT = NÃO
PUSH = NÃO

READY_FOR_OPEN_MODAL_REIMPLEMENTATION = NÃO
READY_FOR_NEW_MODAL_REIMPLEMENTATION = NÃO
READY_FOR_EDITOR_TEXTOS_ET3D3 = NÃO
```

## ET3D2-MODALS-AUDIT-R1 — fechamento cirúrgico dos 10 gaps

Esta seção registra a segunda passagem dirigida. Ela não altera a conclusão
histórica acima nem qualquer código. Cada gap recebeu evidência concreta e
uma classificação final; divergência entre legado e React é registrada como
diferença de implementação, não como ausência de contrato.

### OPEN-GAP-01

**ORIGINAL_GAP** = causa nominal dos nomes repetidos na lista React.

**SEARCHES_EXECUTED** = `nome_exibicao`, `nome`, `nome_arquivo`, `tipo_modelo`,
`origem`, `sistema`, `_serialize_item`, `_query_visible_models`,
`EditorTextosOpenDialog`, `key={item.id}`, e renderização legada de
`editorTextosRenderListaAbertura`.

**FILES_INSPECTED** = `frontend/app.js`,
`frontend/js/modules/editor_textos_bootstrap.js`,
`backend/routes/editor_textos_routes.py`,
`backend/models/modelo_documento.py`,
`frontend-react/src/features/editorTextos/components/EditorTextosDocumentDialogs.jsx`.

**SYMBOLS_FOUND** = `_serialize_item`, `_query_visible_models`,
`editorTextosRenderListaAbertura`, `EditorTextosOpenDialog`.

**ENDPOINTS_FOUND** = `GET /editor-textos/modelos`.

**DB_EVIDENCE** = `modelos_documento.id` é a chave primária; `clinica_id`,
`tipo_modelo`, `nome_exibicao`, `nome_arquivo`, `origem` e `ativo` diferenciam
registros. O filtro aceita clínica atual ou `clinica_id IS NULL`.

**CALLER_CHAIN** = `EditorTextosOpenDialog.items` → `item.id` como chave React
e valor do option; legado `item.id` → `tr[data-id]`; nenhum código concatena
linhas nem perde a identidade.

**RESULT** = nomes iguais não provam duplicação da API. A causa visual é
**PROVEN_PRESENT**: o React exibe somente `nome_exibicao`, enquanto o contrato
legado exibe também Tipo e Origem. Registros base/clínica ou tipos distintos
podem, portanto, aparecer com o mesmo nome sem serem o mesmo registro.

**FINAL_CLASSIFICATION** = PROVEN_PARTIAL (causa da percepção visual provada;
duplicação física de uma resposta específica não é afirmada sem fixture).
**RESOLVED** = SIM.

### OPEN-GAP-02

**ORIGINAL_GAP** = comportamento de Enter/ArrowUp/ArrowDown/Tab no modal
legado ABRIR.

**SEARCHES_EXECUTED** = buscas por `editor-textos-open-backdrop`,
`openTbody`, `openOk`, `openCancelar`, `keydown`, `Enter`, `Escape`,
`ArrowUp`, `ArrowDown`, `Tab` em `frontend/app.js` e no bootstrap.

**FILES_INSPECTED** = `frontend/app.js` linhas dos listeners de abertura,
`frontend/js/modules/editor_textos_bootstrap.js` markup e listeners, ET1.

**SYMBOLS_FOUND** = listeners `openTbody.click`, `openTbody.dblclick`,
`openOk.click`, `openCancelar.click`, `openBackdrop.click`; listener de
`keydown` encontrado para `openDeleteBackdrop`, não para a grade ABRIR.

**ENDPOINTS_FOUND** = nenhum endpoint acionado por tecla na grade; Enter em
linha não possui branch comprovado.

**DB_EVIDENCE** = não aplicável.

**CALLER_CHAIN** = clique de linha → `editorTextosOpenSelecionarLinha`;
duplo clique → `editorTextosAbrirModelo`; botão Ok → validação de `openSelId`
→ `editorTextosAbrirModelo`. Não há cadeia equivalente para ArrowUp,
ArrowDown, Tab ou Enter.

**RESULT** = `Escape`/`Enter` comprovados apenas no diálogo de confirmação de
exclusão (`openDeleteBackdrop`), não no modal principal. Para o modal ABRIR,
os atalhos de teclado são **PROVEN_ABSENT** no código pesquisado; Tab fica
como comportamento nativo do navegador, sem handler específico.

**FINAL_CLASSIFICATION** = PROVEN_ABSENT.
**RESOLVED** = SIM.

### OPEN-GAP-03

**ORIGINAL_GAP** = contrato da ação contextual Propriedades.

**SEARCHES_EXECUTED** = `openMenuPropriedades`,
`editorTextosOpenContextoMostrarPropriedades`, `Propriedades do modelo`,
`nome_arquivo`, `extensao`, `tipo_modelo`, `origem`.

**FILES_INSPECTED** = `frontend/app.js`,
`frontend/js/modules/editor_textos_bootstrap.js`, backend route/model.

**SYMBOLS_FOUND** = `editorTextosOpenMostrarContexto`,
`editorTextosOpenContextoMostrarPropriedades`, listener de
`openMenuPropriedades`.

**ENDPOINTS_FOUND** = nenhum; a ação é local após a lista já carregada.

**DB_EVIDENCE** = o item selecionado vem do cache `editorTextosCfg.itens`,
originado de `modelos_documento`; não há consulta adicional.

**CALLER_CHAIN** = `contextmenu` em `tr[data-id]` → grava `openContextId`
→ habilita/desabilita ações por `editorTextosOpenPodeAlterarItem` → clique
`openMenuPropriedades` → `editorTextosOpenContextoMostrarPropriedades` →
`window.alert` com Nome, Arquivo, Extensão, Tipo, Formato e Origem.

**RESULT** = ação somente leitura; não altera seleção, documento, backend ou
dirty state. Origem exibida é `Sistema` quando `item.sistema`, caso contrário
`Clínica`; formato vem de `editorTextosOpenTipoArquivoLabel(ext)`. **RESOLVED**.

**FINAL_CLASSIFICATION** = PROVEN_PRESENT.

### OPEN-GAP-04

**ORIGINAL_GAP** = ordenação e paginação da grade.

**SEARCHES_EXECUTED** = `sort`, `sorted`, `order`, `pagination`, `page`,
`thead`, `click` em cabeçalho, `editorTextosRenderListaAbertura` e query
`_query_visible_models`.

**FILES_INSPECTED** = bootstrap, `frontend/app.js`, route/backend service.

**SYMBOLS_FOUND** = `editorTextosRenderListaAbertura`,
`_query_visible_models`.

**ENDPOINTS_FOUND** = `GET /editor-textos/modelos` sem parâmetros de ordenação
ou paginação.

**DB_EVIDENCE** = `_query_visible_models` filtra ativo e escopo de clínica;
não aplica `order_by`, offset ou limit. O bootstrap monta uma única tabela e
não cria controles de página.

**CALLER_CHAIN** = GET → `editorTextosCfg.itens` → filtro local → `innerHTML`
do tbody. Não existe listener no `thead` nem componente de paginação.

**RESULT** = ordenação por cabeçalho e paginação são **PROVEN_ABSENT**. A
ordem observada é a ordem retornada pelo backend, seguida apenas do filtro
local; não há reordenação adicional.

**FINAL_CLASSIFICATION** = PROVEN_ABSENT.
**RESOLVED** = SIM.

### OPEN-GAP-05

**ORIGINAL_GAP** = matriz física/API final dos campos e transformação
`system/origem`.

**SEARCHES_EXECUTED** = `_serialize_item`, `ModeloDocumento`,
`_query_visible_models`, `editorTextosRenderListaAbertura`, React API/model,
rotas GET/POST/PUT/PATCH/DELETE e ET1 de banco.

**FILES_INSPECTED** = `backend/models/modelo_documento.py`,
`backend/routes/editor_textos_routes.py`, `backend/services/modelos_service.py`,
`frontend/app.js`, `EditorTextosDocumentDialogs.jsx`, `editorTextosApi.js`,
`documentModel.js`.

**SYMBOLS_FOUND** = `_serialize_item`, `ModeloDocumento`,
`documentDtoToModel`, `documentModelToPayload`.

**ENDPOINTS_FOUND** = GET lista, GET detalhe, POST criação, PUT atualização,
PATCH renomear e DELETE exclusão.

**DB_EVIDENCE** =

| UI/API | Campo físico | Transformação |
|---|---|---|
| id | `modelos_documento.id` | inteiro, chave do row/option |
| Nome | `nome_exibicao` | backend serializa como `nome`; React exibe `nome_exibicao` ou `nome` |
| Tipo | `tipo_modelo` | string de oito tipos; filtro `rich/text/model/all` usa extensão, não o tipo |
| Arquivo | `nome_arquivo` | string do arquivo persistido |
| Extensão | `extensao` | normalizada para minúscula |
| Origem | `origem` + `clinica_id` | legado transforma `sistema = clinica_id IS NULL` em Sistema; linha da grade transforma em Base/Clinica |
| Ativo | `ativo` | restringe listagem/detalhe |
| Conteúdo | arquivo resolvido por `caminho_arquivo` | detalhe acrescenta `conteudo`, `conteudo_html`, `conteudo_formato`, `pagina_config` |

**CALLER_CHAIN** = API list → `_serialize_item` → cache/lista → grade; API
detail → conteúdo/metadata → `documentDtoToModel`/`LegacyHtmlAdapter` → editor.
Os métodos de escrita usam `documentModelToPayload` e os endpoints oficiais.

**RESULT** = transformação completa provada, inclusive `sistema` versus
`origem`; nenhuma escrita de banco foi executada.

**FINAL_CLASSIFICATION** = PROVEN_PRESENT.
**RESOLVED** = SIM.

### NEW-GAP-01

**ORIGINAL_GAP** = corpo completo de `editorTextosNovoPorTipo`, conteúdo e
metadata inicial.

**SEARCHES_EXECUTED** = `EDITOR_TEXTOS_NOVO_MAP`,
`editorTextosNovoPorTipo`, `editorTextosNovoDocumento`, `editorTextosAbrirModelo`,
`editorTextosFormatoPorExt`, `editorTextosCfg.tipoAtual`.

**FILES_INSPECTED** = `frontend/app.js`, bootstrap e backend de modelos.

**SYMBOLS_FOUND** = `EDITOR_TEXTOS_NOVO_MAP`, `editorTextosNovoPorTipo`,
`editorTextosNovoDocumento`, `editorTextosNovoExecutar`.

**ENDPOINTS_FOUND** = texto branco não chama endpoint; tipos com candidato
fazem GET da lista e depois GET detalhe; sem candidato criam apenas estado em
memória. Assistentes posteriores usam seus endpoints de contexto.

**DB_EVIDENCE** = candidatos vêm de `modelos_documento` filtrados por
`tipo_modelo` e nome normalizado; se não houver candidato, não há INSERT.

**CALLER_CHAIN** = `newOk` → `editorTextosNovoExecutar` → garantia de paciente
quando aplicável → `editorTextosNovoPorTipo`.

**RESULT** =

| Tipo | Tipo interno/extensão | Candidato | Sem candidato |
|---|---|---|---|
| Receita | `receitas`/`.mod` | Receita, Receita.mod | novo em memória |
| Atestado | `atestados`/`.mod` | Atestado, Atestado.mod | novo em memória |
| Carta paciente | `outros`/`.mod` | CartaPaciente, CartaPaciente.mod, Carta para paciente | novo em memória |
| Carta simples | `outros`/`.mod` | CartaSimples, CartaSimples.mod, Carta simples | novo em memória |
| Texto branco | `outros`/`.txt` | nenhum | `editorTextosNovoDocumento()` |

Quando encontra candidato, o primeiro é escolhido após ordenar Sistema antes
de Clínica e depois por ID. Quando não encontra, o documento é resetado,
`tipoAtual`, extensão e formato são definidos, e o status informa ausência de
modelo padrão. Conteúdo inicial do novo documento é HTML vazio do editor
legado (`page.innerHTML=""`), sem persistência.

**FINAL_CLASSIFICATION** = PROVEN_PRESENT.
**RESOLVED** = SIM.

### NEW-GAP-02

**ORIGINAL_GAP** = diferença funcional entre `carta_paciente` e
`carta_simples`.

**SEARCHES_EXECUTED** = chaves no `EDITOR_TEXTOS_NOVO_MAP`,
`editorTextosTipoExigePaciente`, `editorTextosGarantirPacienteParaTipo`,
assistentes e consumidores de `carta_paciente`/`carta_simples`.

**FILES_INSPECTED** = `frontend/app.js`, backend routes/contextos,
preferências e ET1.

**SYMBOLS_FOUND** = ambas as chaves mapeiam `tipo_modelo="outros"`, extensão
`.mod`; somente `receita` e `atestado` retornam verdadeiro em
`editorTextosTipoExigePaciente`.

**ENDPOINTS_FOUND** = nenhum endpoint específico de paciente, receita ou
atestado é chamado por esses dois branches; o fluxo apenas consulta a lista
de modelos se necessário.

**DB_EVIDENCE** = ambos filtram modelos `outros` e candidatos por nome
normalizado; não há coluna/tipo físico distinto comprovado.

**CALLER_CHAIN** = seleção do tipo → garantia de paciente (não exigida para
ambos) → `editorTextosNovoPorTipo` → busca do candidato correspondente →
carrega modelo ou inicia novo estado. Após o retorno, não há abertura de
assistente para nenhum dos dois.

**RESULT** = diferença comprovada é nominal e de candidato: Carta paciente
procura `CartaPaciente`/variações; Carta simples procura `CartaSimples`/variações.
Não foi comprovada diferença adicional de conteúdo, preferência, paciente,
merge field ou consumidor downstream.

**FINAL_CLASSIFICATION** = PROVEN_PARTIAL; a diferença implementada está
fechada e a ausência de diferença adicional foi classificada como não
comprovada no contrato legado, sem criar suposição.
**RESOLVED** = SIM.

### NEW-GAP-03

**ORIGINAL_GAP** = equivalência entre “Abrir um texto já existente” e ABRE
primário.

**SEARCHES_EXECUTED** = `editorTextosNovoExecutar`,
`editorTextosAbrirModalNovo`, `editorTextosAbrirModalAbrir`, handlers de
`btnNovo`, `btnAbrir`, menu `abrir` e confirmação dirty.

**FILES_INSPECTED** = `frontend/app.js`, bootstrap e ET1.

**SYMBOLS_FOUND** = `editorTextosNovoExecutar`,
`editorTextosAbrirModalNovo`, `editorTextosAbrirModalAbrir`,
`editorTextosConfirmarDescartar`.

**ENDPOINTS_FOUND** = ambos acabam em `editorTextosAbrirModalAbrir`, que chama
GET `/editor-textos/modelos`; o detalhe só é chamado após seleção.

**DB_EVIDENCE** = mesma lista/mesmo filtro/mesmos modelos visíveis.

**CALLER_CHAIN** = botão ABRE/menu abrir → `editorTextosConfirmarDescartar`
→ `editorTextosAbrirModalAbrir`; radio do Novo + Ok → fecha Novo →
`editorTextosAbrirModalAbrir`, sem chamar novamente a confirmação naquele
branch. Em ambos, a função de abertura e o endpoint são os mesmos; o estado
temporário diferente é apenas o backdrop Novo, fechado antes da abertura.

**RESULT** = `NEW_OPEN_EXISTING_EQUIVALENT_TO_PRIMARY_OPEN = PARTIAL`: convergem
para o mesmo modal, handler de carregamento e endpoints; não são equivalentes
na guarda dirty porque o branch Novo não repete `editorTextosConfirmarDescartar`
no próprio `editorTextosNovoExecutar`.

**FINAL_CLASSIFICATION** = PROVEN_PARTIAL.
**RESOLVED** = SIM.

### NEW-GAP-04

**ORIGINAL_GAP** = opções e efeitos da guarda dirty ao acionar NOVO.

**SEARCHES_EXECUTED** = `editorTextosConfirmarDescartar`, `btnNovo`, menu
`novo`, `editorTextosNovoExecutar`, `btnAbrir`, `btnFechar`,
`editorTextosNovoDocumento`, `alterado`.

**FILES_INSPECTED** = `frontend/app.js`, bootstrap, ET1 e comparação com
`useEditorDocumentLifecycle`.

**SYMBOLS_FOUND** = `editorTextosConfirmarDescartar`, `editorTextosNovoExecutar`,
`editorTextosNovoDocumento`.

**ENDPOINTS_FOUND** = nenhum endpoint é acionado pela confirmação em si.

**DB_EVIDENCE** = não aplicável à guarda; salvar, quando acionado antes, usa
os endpoints oficiais POST/PUT de modelos.

**CALLER_CHAIN** = botão Novo → `editorTextosConfirmarDescartar`; se
`alterado=false`, continua para `editorTextosAbrirModalNovo`; se true,
`window.confirm("Existem alteracoes nao salvas. Deseja descartar?")`; Sim
continua, Não interrompe e preserva o editor. O mesmo guard é chamado por
ABRE, fechar e ações equivalentes. Dentro do modal Novo, Cancelar apenas fecha
o modal. O branch “Abrir existente” não chama novamente o guard.

**RESULT** = o legado possui somente duas opções explícitas no confirm:
continuar/descartar ou cancelar. Não há opção Salvar dentro desse confirm;
Salvar é uma ação separada. O efeito de descartar é permitir reset/abertura,
não executar DELETE nem limpar backend.

**FINAL_CLASSIFICATION** = PROVEN_PRESENT para o contrato do guard; a
divergência do branch interno já está nominalmente documentada em NEW-GAP-03.
**RESOLVED** = SIM.

### NEW-GAP-05

**ORIGINAL_GAP** = dependências de Preferências por tipo Novo.

**SEARCHES_EXECUTED** = `_resolve_modelo_receita_preferido`,
`_resolve_modelo_atestado_preferido`, `_resolve_modelo_texto_preferido`,
campos de preferências, `EDITOR_TEXTOS_NOVO_MAP`, contextos de assistentes e
consumidores dos cinco tipos.

**FILES_INSPECTED** = `backend/routes/editor_textos_routes.py`,
`backend/routes/preferences_routes.py`, `frontend/app.js`,
`frontend-react/src/features/configuracaoPreferencias`, ET1.

**SYMBOLS_FOUND** = preferência `modelo_impresso_receitas_id` é consumida por
`_resolve_modelo_receita_preferido`; `modelo_impresso_atestados_id` por
`_resolve_modelo_atestado_preferido`. Os demais campos auditados são
`modelo_impresso_recibos_id`, `modelo_padrao_etiquetas_id`,
`modelo_texto_email_agenda_id`, `modelo_padrao_orcamentos_id` e
`modelo_texto_whatsapp_agenda_id`.

**ENDPOINTS_FOUND** = contextos GET de assistente receita/atestado devolvem
`modelo_padrao_id`; não há endpoint de preferência chamado pelo modal Novo.

**DB_EVIDENCE** = preferências armazenam IDs de `ModeloDocumento`; o modelo
selecionado é validado contra modelos visíveis da clínica/usuário. Nenhum
campo de preferência para `carta_paciente`, `carta_simples` ou `texto_branco`
foi encontrado.

**CALLER_CHAIN** = Novo Receita → `editorTextosNovoPorTipo` escolhe candidato
por nome/tipo; depois assistente receita → contexto → resolvedor de preferência
para fallback/default do assistente. Novo Atestado segue cadeia equivalente.
Carta paciente, Carta simples e Texto branco não chamam resolvedor de
preferência nem assistente; usam candidato nominal ou estado vazio.

**RESULT** = dependência direta comprovada somente para os downstream
assistentes de Receita e Atestado, não para a abertura do modal Novo em si.
Recibos, etiquetas, orçamentos, email e WhatsApp pertencem a consumidores
externos e não são opções do modal Novo.

**FINAL_CLASSIFICATION** = PROVEN_PARTIAL.
**RESOLVED** = SIM.

## Cross-check individual e fechamento

Foi executada busca reversa final pelos títulos, IDs, labels, tipos, handlers e
endpoints dos dois modais. Não surgiram referências novas fora das cadeias
incorporadas acima.

```text
GAP_CROSSCHECK = PASS
LAST_CLOSURE_PASS_NEW_REFERENCES = 0

OPEN_GAPS_TOTAL = 5
OPEN_GAPS_RESOLVED = 5
OPEN_GAPS_REMAINING = 0
NEW_GAPS_TOTAL = 5
NEW_GAPS_RESOLVED = 5
NEW_GAPS_REMAINING = 0
TOTAL_GAPS = 10
TOTAL_GAPS_RESOLVED = 10
TOTAL_GAPS_REMAINING = 0
UNRESOLVED_OPEN_GAPS = []
UNRESOLVED_NEW_GAPS = []
MATERIAL_MODAL_GAPS = []

OPEN_MODAL_AUDIT = PASS
NEW_MODAL_AUDIT = PASS
MODAL_DATA_FLOW_AUDIT = PASS
MODAL_API_AUDIT = PASS
MODAL_DATABASE_AUDIT = PASS
MODAL_DEPENDENCY_AUDIT = PASS
MODAL_EVENT_AUDIT = PASS
LEGACY_VS_REACT_OPEN_MATRIX = PASS
LEGACY_VS_REACT_NEW_MATRIX = PASS

REACT_OPEN_DUPLICATE_NAMES_CAUSE = PROVEN_PARTIAL: nomes iguais podem ser registros distintos por id, tipo ou origem; o React oculta Tipo/Origem, e não foi afirmada duplicação física sem fixture nominal.
NEW_OPEN_EXISTING_EQUIVALENT_TO_PRIMARY_OPEN = PARTIAL
```

As classificações `PROVEN_PARTIAL` acima encerram os fatos verificáveis e
explicitam o limite do contrato, portanto não são pendências abertas.
Nenhuma implementação ou correção deve começar automaticamente nesta etapa.
