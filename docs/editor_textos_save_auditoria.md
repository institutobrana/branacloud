# Auditoria Forense — Salvar / Salvar Como

## Escopo

Auditoria estática dirigida, com crosscheck do runtime legado autenticado. Nenhum botão, API, backend, CSS ou fluxo foi alterado.

## 1. Distinção de contratos

```text
LEGACY_EDITOR_HAS_SAVE_COMMAND = SIM
LEGACY_DIRTY_GUARD_HAS_SAVE = NÃO
```

## EDITOR_TEXTOS_SAVE_AUDIT_R3_NEW_DOCUMENT_CLOSURE

### Contrato legado extraído da R1/R2

```text
LEGACY_NEW_DOCUMENT_SAVE_ENTRY = Arquivo → Salvar / Ctrl+S / toolbar Salva
LEGACY_NEW_DOCUMENT_SAVE_HANDLER = editorTextosSalvarAtual(false)
LEGACY_NEW_DOCUMENT_SAVE_UI = prompt de nome somente quando editorTextosCfg.nome está vazio
LEGACY_NEW_DOCUMENT_SAVE_REQUIRED_FIELDS = nome, conteudo, conteudo_formato, tipoAtual, extensaoAtual, paginaConfig
LEGACY_NEW_DOCUMENT_SAVE_CREATE_ACTION = POST /editor-textos/modelos
LEGACY_NEW_DOCUMENT_SAVE_POST_SUCCESS = recebe resposta, atualiza identidade/estado, aplica conteúdo e define alterado=false
LEGACY_NEW_DOCUMENT_SAVE_IDENTITY_RESULT = data.id + data.nome_arquivo + nome/tipo/extensão retornados
```

Esse é Salvar novo, não um redirecionamento para Salvar como. `Salvar como` continua sendo `editorTextosSalvarComoAtual()` com nome explicitamente diferente e `forceNew=true`.

### Buraco exato no React

```text
REACT_SAVE_HANDLER = useEditorDocumentLifecycle.saveDocument
REACT_SAVE_BRANCH_CONDITION = if (!documentState.id || documentState.saving) return false
REACT_SAVE_EXISTING_BRANCH_SYMBOL = editorTextosApi.updateDocument(documentState.id, documentModelToPayload(...))
REACT_SAVE_NEW_BRANCH_SYMBOL = inexistente após a condição de retorno
REACT_SAVE_NEW_BRANCH_CURRENT_BEHAVIOR = não executa POST, não coleta nome e retorna false quando id é ausente
```

O evento e o botão já chegam ao handler; a ausência é exclusivamente a ramificação de documento novo.

### Links faltantes, nominalmente

```text
REACT_SAVE_NEW_MISSING_LINKS = [
  {
    file: frontend-react/src/features/editorTextos/hooks/useEditorDocumentLifecycle.js,
    symbol: saveDocument,
    current_behavior: retorna false para documentState.id ausente,
    required_behavior: coletar nome pelo diálogo próprio/reutilizável e executar createDocument com o mesmo payload
  },
  {
    file: frontend-react/src/features/editorTextos/EditorTextosPage.jsx,
    symbol: lifecycle action wiring,
    current_behavior: ação salvar apenas invoca saveDocument; não abre UI para documento novo,
    required_behavior: encaminhar o branch novo mantendo o comando Salvar distinto de Salvar como
  }
]
```

### UI necessária

`REACT_NEW_SAVE_REQUIRED_UI = diálogo de coleta de nome do documento`. O componente `EditorTextosSaveAsDialog` é reutilizável apenas como apresentação/coleta de nome se seus campos forem mantidos; a ação chamada continua sendo Salvar novo e o destino é `createDocument`, não um redirecionamento semântico para o comando Salvar como.

`EXISTING_COMPONENT_REUSABLE = SIM`.

### Matriz Save novo × Save como

| Campo/comportamento | Salvar novo | Salvar como |
|---|---|---|
| Nome | solicitado se ausente | solicitado sempre; deve diferir do atual |
| Tipo | usa tipo atual | usa tipo atual |
| Origem | criação do documento em branco atual | criação de nova cópia |
| Novo ID | Sim | Sim |
| Duplicação | Não; persiste o documento corrente | Sim, por novo recurso |
| Substituição | Não existente; cria | Não substitui o atual |
| Método | POST | POST |
| Identidade | passa a ser a identidade do documento corrente | passa a ser a identidade da nova cópia |
| Documento aberto | permanece aberto | permanece aberto como novo recurso |

### Infraestrutura React reutilizável

```text
REACT_CREATE_SERVICE = editorTextosApi.createDocument
REACT_SERIALIZER = documentModelToPayload + LegacyHtmlAdapter.serializeToLegacyHtml
REACT_RESPONSE_MAPPER = documentDtoToModel
REACT_IDENTITY_HYDRATION_SYMBOL = setDocumentState({ ...documentDtoToModel(dto), dirty: false, ... })
POST_RESPONSE_ID_FIELD = dto.id
POST_RESPONSE_NAME_FIELD = dto.nome_exibicao || dto.nome
POST_RESPONSE_TYPE_FIELD = dto.tipo_modelo
REACT_NEW_SAVE_SUCCESS_DIRTY_RESET = saveDocumentAs existente define dirty=false; novo branch deve reutilizar o mesmo transition
REACT_NEW_SAVE_FAILURE_DIRTY_PRESERVE = requestJson lança; sem dirty=false, documentState atual permanece
REACT_SAVE_REUSES_PAGECONFIG_SERIALIZATION = SIM
SAVE_COMMAND_RETURNS_SUCCESS_FAILURE_SIGNAL = SIM
```

### Fluxo React futuro, sem implementação

```text
toolbar Salvar
→ ação salvar
→ saveDocument()
→ documentState.id ausente
→ diálogo de nome do Salvar novo
→ documentModelToPayload(...)
→ editorTextosApi.createDocument(payload)
→ documentDtoToModel(response)
→ identidade atribuída
→ dirty=false
→ documento permanece aberto
→ Promise retorna sucesso/erro ao caller
```

`DIRTY_GUARD_NEW_SAVE_TARGET = o mesmo comando/serviço de Salvar novo após sua implementação; o guard não terá POST próprio.`

### Status R3

```text
EDITOR_TEXTOS_SAVE_AUDIT_R3_STATUS = COMPLETE
REACT_SAVE_NEW_BRANCH_ARCHITECTURE_PROVEN = SIM
REACT_NEW_SAVE_ROUTING = PROVEN
REACT_SAVE_BUTTON_FINAL_WIRING = PROVEN
REACT_SAVE_AS_BUTTON_FINAL_WIRING = PROVEN
UNPROVEN_SAVE_ITEMS = []
MATERIAL_SAVE_GAPS = []
RUNTIME_SAVE_HOMOLOGATION = POST_IMPLEMENTATION
READY_FOR_SAVE_IMPLEMENTATION = SIM
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
CSS_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
COMMIT = NÃO
PUSH = NÃO
```

## EDITOR_TEXTOS_SAVE_AUDIT_R2 — fechamento do wiring

### Contrato exato do Salvar novo no legado

```text
LEGACY_NEW_DOCUMENT_SAVE_ENTRY = Arquivo → Salvar / Ctrl+S / toolbar Salva
LEGACY_NEW_DOCUMENT_SAVE_HANDLER = editorTextosSalvarAtual(false)
LEGACY_NEW_DOCUMENT_SAVE_UI = prompt("Nome do modelo:", "Novo modelo") quando nome ausente
LEGACY_NEW_DOCUMENT_SAVE_REQUIRED_FIELDS = nome, conteudo, conteudo_formato, tipo_modelo, extensao, pagina_config
LEGACY_NEW_DOCUMENT_SAVE_CREATE_ACTION = POST /editor-textos/modelos
LEGACY_NEW_DOCUMENT_SAVE_POST_SUCCESS = atualiza modeloAtualId/arquivo/tipo/extensão/nome/paginaConfig, aplica conteúdo e alterado=false
LEGACY_NEW_DOCUMENT_SAVE_IDENTITY_RESULT = data.id e data.nome_arquivo retornados pelo POST
```

O Salvar novo não redireciona para o comando Salvar como (`LEGACY_SAVE_NEW_REDIRECTS_TO_SAVE_AS = NÃO`). Salvar como é comando separado e força criação de novo recurso.

### Matriz Salvar × Salvar como

| Propriedade | Salvar novo | Salvar existente | Salvar como |
|---|---|---|---|
| Cria recurso | Sim, quando não há ID | Não | Sim |
| Atualiza recurso | Não | Sim | Não; cria cópia |
| Solicita nome | Sim, se vazio | Não | Sim |
| Solicita tipo | Não em diálogo separado; usa tipo atual | Não | Não em diálogo separado; usa tipo atual |
| Abre modal | Não; prompt nativo se necessário | Não | Não; prompt nativo |
| Preserva ID | Recebe novo ID | Sim | Não; recebe novo ID |
| Gera novo ID | Sim | Não | Sim |
| Método | POST | PUT | POST |
| Dirty após sucesso | false | false | false |
| Mantém documento aberto | Sim | Sim | Sim, como novo recurso |

### Wiring React localizado

```text
toolbar: EditorTextosPrimaryToolbar
→ onAction('salvar') no App.jsx
→ CustomEvent brana-editor-textos-action
→ listener de useEditorDocumentLifecycle
→ saveDocument()
→ documentModelToPayload()
→ editorTextosApi.updateDocument(id, payload)
```

Para `salvar-como`:

```text
toolbar
→ onAction('salvar-como')
→ setSaveAsVisible(true)
→ EditorTextosSaveAsDialog
→ saveDocumentAs(name)
→ documentModelToPayload({ ...documentState, id: null, name }, content)
→ editorTextosApi.createDocument(payload)
```

### Classificação de cada elo

| Elo | Estado | Evidência |
|---|---|---|
| Botão Salvar → command id | IMPLEMENTED | `EditorTextosPrimaryToolbar.jsx`, key `salvar` |
| command → evento | IMPLEMENTED | `App.jsx` despacha `brana-editor-textos-action` |
| evento → handler existente | IMPLEMENTED | lifecycle chama `saveDocument()` |
| Save existing → PUT | IMPLEMENTED | `editorTextosApi.updateDocument` |
| Save new → criação | MISSING no botão Salvar | `saveDocument()` retorna false sem `documentState.id` |
| Botão Salvar como → diálogo | IMPLEMENTED | `saveAsVisible` + `EditorTextosSaveAsDialog` |
| Salvar como → POST | IMPLEMENTED | `saveDocumentAs` + `createDocument` |
| resposta → identidade/dirty | IMPLEMENTED | `documentDtoToModel`, `dirty: false` |

### Gaps concretos do React

```text
REACT_SAVE_MISSING_LINKS = [
  {
    FILE: frontend-react/src/features/editorTextos/hooks/useEditorDocumentLifecycle.js,
    SYMBOL: saveDocument,
    CURRENT_BEHAVIOR: retorna false quando documentState.id é ausente,
    REQUIRED_BEHAVIOR: encaminhar o contrato de Salvar novo comprovado pelo legado para criação e identidade
  }
]

REACT_SAVE_AS_MISSING_LINKS = [
  {
    FILE: frontend-react/src/features/editorTextos/components/EditorTextosDocumentDialogs.jsx,
    SYMBOL: EditorTextosSaveAsDialog,
    CURRENT_BEHAVIOR: diálogo simples coleta somente nome,
    REQUIRED_BEHAVIOR: somente se o contrato legado exigir campos adicionais; R1/R2 não comprovou campos extras
  }
]
```

Logo, `REACT_NEW_SAVE_ROUTING_TARGET = OTHER_PROVEN`: criação direta pelo handler de Salvar, com coleta de nome necessária no próprio fluxo, não redirecionamento para `Salvar como`.

### Serviços reutilizados

```text
REACT_CREATE_SERVICE = editorTextosApi.createDocument
REACT_UPDATE_SERVICE = editorTextosApi.updateDocument
REACT_GET_SERVICE = editorTextosApi.getDocument
REACT_SERIALIZER = documentModelToPayload + LegacyHtmlAdapter.serializeToLegacyHtml
REACT_RESPONSE_MAPPER = documentDtoToModel
REACT_SAVE_REUSES_PAGECONFIG_SERIALIZATION = SIM
REACT_DIRTY_RESET_AFTER_SAVE_SYMBOL = setDocumentState(... dirty: false) em saveDocument/saveDocumentAs
REACT_SAVE_ERROR_PRESERVES_DIRTY_PATH = catch de saveDocument; saving=false, onError, sem dirty=false
SAVE_COMMAND_RETURNS_SUCCESS_FAILURE_SIGNAL = SIM para saveDocument; Save As propaga sucesso/erro por Promise
```

### Runtime

Não foi executada escrita runtime nesta rodada por ausência de recurso seguro identificado. A observação runtime permanece complementar; o wiring estático dos caminhos existentes foi localizado. O comportamento do modal Novo continua explicitamente fora do escopo desta auditoria.

### Fechamento R2

```text
EDITOR_TEXTOS_SAVE_AUDIT_R2_STATUS = INCOMPLETE
LEGACY_SAVE_EXISTING_CONTRACT_PROVEN = SIM
LEGACY_SAVE_NEW_CONTRACT_PROVEN = SIM
LEGACY_SAVE_AS_CONTRACT_PROVEN = SIM
LEGACY_SAVE_NEW_REDIRECTS_TO_SAVE_AS = NÃO

REACT_SAVE_BUTTON_COMPONENT = EditorTextosPrimaryToolbar
REACT_SAVE_COMMAND_ID = salvar
REACT_SAVE_HANDLER = useEditorDocumentLifecycle.saveDocument
REACT_SAVE_EXISTING_BRANCH = IMPLEMENTED
REACT_SAVE_NEW_BRANCH = MISSING

REACT_SAVE_AS_HANDLER = setSaveAsVisible → EditorTextosSaveAsDialog → saveDocumentAs
REACT_SAVE_AS_DIALOG = EditorTextosSaveAsDialog
REACT_SAVE_AS_CREATE_PATH = POST /editor-textos/modelos via editorTextosApi.createDocument
REACT_SAVE_CURRENT_IMPLEMENTATION = PARTIAL
REACT_SAVE_AS_CURRENT_IMPLEMENTATION = PARTIAL
REACT_NEW_SAVE_ROUTING_TARGET = OTHER_PROVEN
REACT_NEW_SAVE_ROUTING = UNPROVEN
REACT_SAVE_BUTTON_FINAL_WIRING = UNPROVEN
REACT_SAVE_AS_BUTTON_FINAL_WIRING = PROVEN

LEGACY_SAVE_RUNTIME_OBSERVATION = NOT_RUN_SAFE_RESOURCE_UNAVAILABLE
REACT_SAVE_RUNTIME_OBSERVATION = NOT_RUN_SAFE_RESOURCE_UNAVAILABLE
REACT_SAVE_AS_RUNTIME_OBSERVATION = NOT_RUN_SAFE_RESOURCE_UNAVAILABLE
REACT_NEW_RUNTIME_STATIC_DISCREPANCY = OUT_OF_SCOPE_FOR_SAVE_AUDIT

UNPROVEN_SAVE_ITEMS = [
  REACT_SAVE_BUTTON_FINAL_WIRING,
  REACT_NEW_SAVE_ROUTING,
  RUNTIME_SAVE_HOMOLOGATION
]
MATERIAL_SAVE_GAPS = [
  REACT_SAVE_NEW_BRANCH,
  REACT_NEW_SAVE_ROUTING,
  RUNTIME_SAVE_HOMOLOGATION
]
READY_FOR_SAVE_IMPLEMENTATION = NÃO
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
CSS_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
VITE_PORT_CHANGED = NÃO
HTTPS_CHANGED = NÃO
VITE_CONFIG_CHANGED = NÃO
ENV_CHANGED = NÃO
COMMIT = NÃO
PUSH = NÃO
```

O menu legado `Arquivo` contém `Novo...`, `Abrir...`, `Salvar`, `Salvar como...` e os comandos relacionados. O dirty guard é separado: `editorTextosConfirmarDescartar()` somente confirma descarte/cancelamento.

## 2. Legado — handlers e cadeia

### Salvar documento existente

```text
Arquivo → Salvar
→ execMenuAction('salvar')
→ editorTextosSalvarAtual(false)
→ editorTextosConteudoParaSalvar()
→ payload com conteúdo + pagina_config
→ PUT /editor-textos/modelos/{modeloAtualId}
→ resposta OK
→ atualiza id/arquivo/tipo/extensão/nome/paginaConfig
→ editorTextosAplicarConteudo(data)
→ editorTextosCfg.alterado = false
```

Em caso de erro, o código mantém o estado dirty, atualiza o status e exibe alerta; não executa limpeza de dirty nem continuação de ação de abandono.

`LEGACY_EXISTING_SAVE_DIRECT = SIM` quando existe ID; não abre modal de nome. A identidade é preservada pelo ID do endpoint e pela resposta.

### Salvar documento novo

Sem ID, `editorTextosSalvarAtual(false)` solicita nome por prompt e usa `POST /editor-textos/modelos`. Após sucesso recebe a identidade (`id`, `nome_arquivo` e demais campos), atualiza o estado e limpa `alterado`.

```text
LEGACY_NEW_SAVE_REDIRECTS_TO_SAVE_AS = NÃO
```

O botão Salvar não abre o modal Salvar como; ele compartilha a rotina de criação e solicita nome quando necessário. `editorTextosSalvarComoAtual()` é o fluxo explícito de duplicação/criação com `forceNew=true`, solicita nome diferente e sempre usa POST.

### Salvar como

```text
Arquivo → Salvar como...
→ editorTextosSalvarComoAtual()
→ prompt “Salvar como - nome do modelo:”
→ rejeita cancelamento, nome vazio e nome igual ao atual
→ editorTextosSalvarAtual(true, nomeLimpo)
→ POST /editor-textos/modelos
→ nova identidade retornada
→ pagina_config e conteúdo retornados/aplicados
→ alterado = false
```

Para documento existente, Salvar como cria novo recurso; não renomeia o registro atual. O nome deve ser diferente do nome atual.

### PageConfig e payload

O legado normaliza `editorTextosCfg.paginaConfig` e inclui `pagina_config` no payload tanto no POST quanto no PUT. O contrato contém:

```text
tipo_papel
orientacao
altura_mm
largura_mm
margem_superior_mm
margem_esquerda_mm
margem_direita_mm
```

`LEGACY_SAVE_PERSISTS_PAGE_CONFIG = SIM` e `LEGACY_SAVE_AS_PERSISTS_PAGE_CONFIG = SIM` por cadeia de serialização estática. A reabertura lê `data.pagina_config` e normaliza o valor.

### Save failure

```text
request não OK
→ status de falha
→ alert de falha
→ não define alterado=false
→ documento/identidade permanecem no estado atual
```

Não existe branch de “Salvar dentro do dirty guard”. Logo, não existe continuação de ação pendente após erro de save nesse guard legado.

## 3. React atual

### Infraestrutura existente

- `EditorTextosPrimaryToolbar.jsx`: botões `Salvar` e `Salvar como` são emitidos como ações.
- `EditorTextosPage.jsx`: encaminha a ação para o evento `brana-editor-textos-action`.
- `useEditorDocumentLifecycle.js`: contém `saveDocument()` e `saveDocumentAs(name)`.
- `documentModel.js`: `documentModelToPayload()` serializa HTML, tipo, extensão e `pagina_config`; `documentDtoToModel()` hidrata `pagina_config`.
- `editorTextosApi.js`: `updateDocument(id, payload)` usa PUT; `createDocument(payload)` usa POST; `getDocument(id)` usa GET.
- `LegacyHtmlAdapter`: serializa/deserializa o conteúdo HTML.

### Save existente

```text
ação salvar
→ listener do lifecycle
→ saveDocument()
→ se documentState.id ausente, retorna false
→ serializa conteúdo atual
→ documentModelToPayload(documentState, content)
→ editorTextosApi.updateDocument(id, payload)
→ sucesso: documentDtoToModel(dto), dirty=false
→ erro: saving=false, onError, dirty permanece
```

### Save novo / Salvar como

```text
ação salvar-como
→ setSaveAsVisible(true)
→ EditorTextosSaveAsDialog
→ saveDocumentAs(name)
→ documentModelToPayload({ ...documentState, id:null, name }, content)
→ editorTextosApi.createDocument(payload)
→ sucesso: nova identidade, dirty=false, fecha diálogo
→ erro: exceção propagada; não há coordenador de pending action
```

O botão Salvar atual não encaminha automaticamente documento sem ID para Save As. Portanto a implementação atual é `PARTIAL`.

## 4. Matriz legado × React

| Capability | Legado | React atual | Gap |
|---|---|---|---|
| Save existing | PUT por ID | `updateDocument`/PUT por ID | comando ainda não fechado em runtime |
| Save new | POST e prompt de nome | Save direto retorna sem ID; Save As faz POST | falta encaminhamento Save → Save As |
| Save As new | POST, nome diferente | `createDocument`, diálogo próprio | integração parcial |
| Save As existing | cria novo recurso | `saveDocumentAs` cria novo | contrato equivalente estático |
| PageConfig persistence | `pagina_config` no payload | `pagina_config` em `documentModelToPayload` | infraestrutura existente |
| HTML persistence | conteúdo convertido para payload | `LegacyHtmlAdapter` + payload HTML | infraestrutura existente |
| Dirty reset | somente após sucesso | somente após sucesso | sem serviço único conectado ao guard |
| Save failure | status/alert, dirty preservado | `onError`, dirty preservado | sem pending action |
| Identity | resposta atualiza identidade | DTO hidrata identidade | existente |
| Reopen | GET/lista e hidratação | `getDocument` + `documentDtoToModel` | existente |

## 5. Relação futura com dirty guard

O guard React futuro deve reutilizar os mesmos fluxos de save, sem uma segunda persistência:

```text
toolbar Save ─┐
              ├→ single save pipeline
dirty guard ──┘
```

Para existente, usar `saveDocument()`. Para novo, abrir/usar `saveDocumentAs(name)`. Somente após sucesso deve eventual `pendingAction` continuar. O guard legado não prova esse branch; `REACT_TARGET_GUARD_SAVE_BRANCH = REQUIRED_BY_USER` é requisito futuro autorizado pelo usuário.

## 6. Status da auditoria

```text
EDITOR_TEXTOS_SAVE_AUDIT_R1_STATUS = INCOMPLETE
LEGACY_SAVE_EXISTING_CONTRACT_PROVEN = SIM
LEGACY_SAVE_NEW_CONTRACT_PROVEN = SIM
LEGACY_SAVE_AS_CONTRACT_PROVEN = SIM
PAGECONFIG_SAVE_CONTRACT_PROVEN = SIM
REACT_EXISTING_INFRASTRUCTURE_PROVEN = SIM
SAVE_FAILURE_CONTRACT_PROVEN = SIM

REACT_SAVE_BUTTON_HANDLER = useEditorDocumentLifecycle.saveDocument
REACT_SAVE_CURRENT_IMPLEMENTATION = PARTIAL
REACT_SAVE_AS_BUTTON_HANDLER = setSaveAsVisible → EditorTextosSaveAsDialog → saveDocumentAs
REACT_SAVE_AS_CURRENT_IMPLEMENTATION = PARTIAL

ET3C_CREATE_PATH = POST /editor-textos/modelos
ET3C_UPDATE_PATH = PUT /editor-textos/modelos/{id}
ET3C_REOPEN_PATH = GET /editor-textos/modelos/{id}

SAVE_PAYLOAD_COMPONENTS = [
  nome,
  conteudo,
  conteudo_formato,
  tipo_modelo,
  extensao,
  pagina_config
]

REACT_NEW_RUNTIME_STATIC_DISCREPANCY = OUT_OF_SCOPE_FOR_SAVE_AUDIT
DIRTY_GUARD_IMPLEMENTATION = PAUSED
UNPROVEN_SAVE_ITEMS = [
  LEGACY_SAVE_RUNTIME_OBSERVATION,
  REACT_SAVE_RUNTIME_OBSERVATION,
  REACT_SAVE_BUTTON_FINAL_WIRING,
  REACT_NEW_SAVE_REDIRECT
]
MATERIAL_SAVE_GAPS = [
  REACT_SAVE_COMMAND_NOT_CLOSED,
  REACT_NEW_DOCUMENT_SAVE_ROUTING,
  RUNTIME_SAVE_HOMOLOGATION
]
READY_FOR_SAVE_IMPLEMENTATION = NÃO

FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
CSS_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
VITE_PORT_CHANGED = NÃO
HTTPS_CHANGED = NÃO
VITE_CONFIG_CHANGED = NÃO
ENV_CHANGED = NÃO
COMMIT = NÃO
PUSH = NÃO
```
