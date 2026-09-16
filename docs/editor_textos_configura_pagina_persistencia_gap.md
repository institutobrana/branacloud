# Editor de Textos — auditoria do gap de persistência de Configura página

## Escopo e restrições

Auditoria somente leitura da falha observada: PageConfig muda na sessão atual,
mas não permanece após sair do módulo e retornar. Nenhum código, backend, banco,
runtime ou configuração foi alterado nesta rodada.

## Resultado observado

```text
PAGECONFIG_SESSION_APPLY = PASS
PAGECONFIG_MODULE_REENTRY_PERSISTENCE = FAIL
```

## RUNTIME_ROUNDTRIP_R6

### Escopo executado

Foi usado somente o botão `ABRE`, sem acionar `NOVO`, sem criar recurso e sem
usar API direta ou banco. O objetivo era localizar o recurso sintético já
existente `ID = 190`, nome `TESTE_EDITOR_REACT_ET3C_1788703615565`.

### Bloqueio observado

Após o clique em `ABRE`, o runtime exibiu apenas um contêiner com o texto
`Abre`. Não foram renderizados campo de pesquisa, grade, registros, seleção ou
botões de confirmação. O screenshot confirmou ausência visual do seletor.

Assim, não foi possível localizar o recurso pelo nome/ID e nenhuma operação
de PageConfig ou SALVAR foi executada.

```text
EDITOR_TEXTOS_PAGE_SETUP_PERSISTENCE_RUNTIME_R6_STATUS = BLOCKED
NEW_FLOW_USED = NÃO
SAFE_EXISTING_RESOURCE_FOUND = NÃO CONFIRMADO
SAFE_EXISTING_RESOURCE_ID = NÃO CAPTURADO
SAFE_EXISTING_RESOURCE_NAME = NÃO CAPTURADO
DOCUMENT_ID_BEFORE = NÃO CAPTURADO
DOCUMENT_ID_AFTER = NÃO CAPTURADO
PAGECONFIG_BEFORE = NÃO CAPTURADO
PAGECONFIG_AFTER_OK = NÃO EXECUTADO
DIRTY_AFTER_OK = NÃO EXECUTADO
SAVE_EXECUTED = NÃO
EXPLICIT_REOPEN_SAME_DOCUMENT = NOT_RUN
EXPLICIT_REOPEN_PAGECONFIG = NOT_RUN
PAGE_CONFIG_METADATA_ROUNDTRIP = NOT_RUN
SAFE_RESOURCE_RESTORED = NOT_NEEDED
ROOT_CAUSE_SCOPE = NOT_DETERMINED
ROOT_CAUSE_PROVEN = NÃO
NEW_FLOW_ISSUE = KNOWN_BUT_OUT_OF_SCOPE
READY_FOR_PAGE_SETUP_PERSISTENCE_FIX = NÃO
```

```text
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
COMMIT = NÃO
PUSH = NÃO
```

## RUNTIME_ROUNDTRIP_R5

### Resultado

Foi autorizada a criação de um único recurso sintético persistente pelo fluxo
normal do Editor. A tentativa foi feita no runtime HTTPS existente, sem
reiniciar Vite ou alterar configuração.

O botão `Novo` foi acionado, porém o fluxo não apresentou um formulário de
criação utilizável. Após a ação, a árvore de acessibilidade exibiu somente um
contêiner com o texto `Novo`, sem campos, opções ou ações de confirmação; o
 screenshot também não exibiu controles de criação.

Não foi usado endpoint direto, console, banco ou documento real como
substituto. Assim, nenhum recurso sintético foi criado e nenhum dado foi
alterado.

```text
EDITOR_TEXTOS_PAGE_SETUP_PERSISTENCE_RUNTIME_R5_STATUS = BLOCKED
SAFE_TEST_RESOURCE_CREATED = NÃO
SAFE_TEST_RESOURCE_ID = NÃO EXISTE
SAFE_TEST_RESOURCE_NAME = NÃO EXISTE
DOCUMENT_ID_BEFORE = NÃO CAPTURADO
AUTO_DOCUMENT_ID_AFTER_REENTRY = NÃO CAPTURADO
SAME_DOCUMENT_ID_BEFORE_AFTER = NÃO CONFIRMADO
```

### Roundtrip não executado

Como o recurso seguro não pôde ser criado, não foram executadas alterações de
PageConfig, SALVAR, readback, saída/reentrada ou ABRE explícito.

```text
PAGECONFIG_BEFORE = NÃO CAPTURADO
PAGECONFIG_AFTER_OK = NÃO EXECUTADO NESTA RODADA
DIRTY_AFTER_OK = NÃO EXECUTADO NESTA RODADA
SAVE_REQUEST_CONTAINS_PAGINA_CONFIG = NÃO CAPTURADO
SAVE_REQUEST_PAGINA_CONFIG = NÃO CAPTURADO
SAVE_RESPONSE_STATUS = NÃO CAPTURADO
READBACK_CONTAINS_PAGINA_CONFIG = NÃO CAPTURADO
READBACK_PAGINA_CONFIG = NÃO CAPTURADO
EXPLICIT_OPEN_RESPONSE_CONTAINS_PAGINA_CONFIG = NOT_RUN
EXPLICIT_OPEN_RESPONSE_PAGINA_CONFIG = NÃO CAPTURADO
PAGESETUP_AFTER_EXPLICIT_REOPEN = NÃO CAPTURADO
EXPLICIT_REOPEN_PAGECONFIG = NOT_RUN
RAW_RESPONSE_PAGECONFIG = NÃO CAPTURADO
NORMALIZED_PAGECONFIG = NÃO CAPTURADO
DOCUMENT_STATE_PAGECONFIG = NÃO CAPTURADO
DIALOG_INITIAL_PAGECONFIG = NÃO CAPTURADO
```

### Classificação e bloqueio

Não há evidência suficiente para escolher qualquer causa-raiz entre payload,
persistência, leitura, normalização ou identidade de documento. A falha
manual de reentrada continua registrada, mas a causa não foi provada.

```text
ROOT_CAUSE = NÃO PROVADA
ROOT_CAUSE_PROVEN = NÃO
MATERIAL_PERSISTENCE_GAPS = [
  NOVO_FLOW_USABLE_CREATION_FORM,
  SAFE_TEST_RESOURCE_ID,
  SAVE_REQUEST_CAPTURE,
  READBACK_CAPTURE,
  EXPLICIT_REOPEN_CAPTURE
]
READY_FOR_PAGE_SETUP_PERSISTENCE_FIX = NÃO
```

```text
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_SCHEMA_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
COMMIT = NÃO
PUSH = NÃO
```

### R5 — repetição autorizada

Na repetição com autorização explícita, o resultado foi idêntico: o clique no
botão `Novo` deixou apenas o contêiner `Novo` sem formulário ou controles
visíveis na árvore de acessibilidade, e o screenshot não mostrou opções de
criação. Não foi possível nomear, confirmar ou salvar o recurso sintético.

```text
R5_RETRY = EXECUTED
SAFE_TEST_RESOURCE_CREATED = NÃO
R5_BLOCKER = NOVO_FORM_UNAVAILABLE_IN_RUNTIME
SAVE_REQUEST_CAPTURED = NÃO
ROOT_CAUSE_PROVEN = NÃO
READY_FOR_PAGE_SETUP_PERSISTENCE_FIX = NÃO
```

## RUNTIME_ROUNDTRIP_R4

### Resultado da tentativa de captura objetiva

O Editor foi observado no runtime aberto, mas a tela não expõe um documento
sintético/seguro identificável nem o ID do documento atualmente carregado. Há
modelos listados, porém nenhum está nominalmente marcado como recurso seguro
para alteração e salvamento. O pedido também proíbe criar um recurso novo sem
autorização.

Por segurança, não foram executados OK, SALVAR, saída/reentrada ou ABRE sobre
documento real. Não houve captura de Network, request/response ou metadata.

```text
EDITOR_TEXTOS_PAGE_SETUP_PERSISTENCE_RUNTIME_R4_STATUS = INCOMPLETE
DOCUMENT_ID_BEFORE = NÃO CAPTURADO
DOCUMENT_ID_AFTER = NÃO CAPTURADO
SAME_DOCUMENT_ID_BEFORE_AFTER = NÃO CONFIRMADO
MODULE_REENTRY_OPENS_DIFFERENT_DOCUMENT = NÃO CONFIRMADO
```

### Valores e identidade

```text
PAGECONFIG_BEFORE = NÃO CAPTURADO
PAGECONFIG_AFTER_OK = PASS (já confirmado manualmente; não repetido nesta rodada)
```

O valor de teste solicitado, `margem_esquerda_mm: 33.16 → 34.16`, não foi
aplicado nesta rodada porque não havia recurso seguro autorizado.

### Captura de SALVAR

```text
SAVE_METHOD = NÃO CAPTURADO
SAVE_URL = NÃO CAPTURADO
SAVE_RESPONSE_STATUS = NÃO CAPTURADO
SAVE_REQUEST_CONTAINS_PAGINA_CONFIG = NÃO CAPTURADO
SAVE_REQUEST_PAGINA_CONFIG = NÃO CAPTURADO
SAVE_RESPONSE_BODY = NÃO CAPTURADO
```

### Readback e reabertura explícita

```text
READBACK_DOCUMENT_ID = NÃO CAPTURADO
READBACK_CONTAINS_PAGINA_CONFIG = NÃO CAPTURADO
READBACK_PAGINA_CONFIG = NÃO CAPTURADO
EXPLICIT_OPEN_REQUEST_ID = NÃO CAPTURADO
EXPLICIT_OPEN_RESPONSE_STATUS = NÃO CAPTURADO
EXPLICIT_OPEN_RESPONSE = NÃO CAPTURADO
EXPLICIT_OPEN_RESPONSE_CONTAINS_PAGINA_CONFIG = NOT_RUN
EXPLICIT_OPEN_RESPONSE_PAGINA_CONFIG = NÃO CAPTURADO
PAGESETUP_AFTER_EXPLICIT_REOPEN = NÃO CAPTURADO
EXPLICIT_REOPEN_PAGECONFIG = NOT_RUN
```

### Normalização

Não houve response real para comparar com o estado final. Portanto os campos
abaixo permanecem sem captura runtime; a prova estática anterior não é elevada
a evidência do roundtrip desta sessão.

```text
RAW_RESPONSE_PAGECONFIG = NÃO CAPTURADO
NORMALIZED_PAGECONFIG = NÃO CAPTURADO
FINAL_DOCUMENT_STATE_PAGECONFIG = NÃO CAPTURADO
```

### Classificação

A falha de reentrada continua comprovada pela observação manual anterior. A
causa-raiz não pode ser escolhida entre omissão do payload, descarte na
persistência, omissão na reabertura, hidratação ou identidade de documento
sem as capturas solicitadas.

```text
ROOT_CAUSE = NÃO PROVADA POR AUSÊNCIA DE RECURSO SEGURO/CAPTURA DE NETWORK
ROOT_CAUSE_PROVEN = NÃO
MATERIAL_PERSISTENCE_GAPS = [
  SAFE_DOCUMENT_ID,
  SAVE_REQUEST_CAPTURE,
  SAVE_RESPONSE_CAPTURE,
  PERSISTED_METADATA_OR_READBACK_CAPTURE,
  REENTRY_DOCUMENT_ID_CAPTURE,
  EXPLICIT_SAME_DOCUMENT_REOPEN
]
READY_FOR_PAGE_SETUP_PERSISTENCE_FIX = NÃO
```

```text
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
COMMIT = NÃO
PUSH = NÃO
```

O sintoma é compatível com alteração local confirmada via OK seguida de saída
sem SALVAR. O estado React do Editor é destruído no unmount; o metadata não é
gravado automaticamente pelo OK.

## 1. Fluxo do OK

| Elemento | Evidência |
|---|---|
| OK_HANDLER | `EditorTextosPageSetupDialog.commit` normaliza o draft, valida e chama `onApply(normalized)` |
| PAGECONFIG_STATE_OWNER | `useEditorDocumentLifecycle` em `documentState.pageConfig` |
| DIRTY_OWNER | `useEditorDocumentLifecycle`; `updatePageConfig` define `dirty: true` |
| CALL_CHAIN | botão Configura página → evento `brana-editor-textos-action` (`pagina`) → `EditorTextosPage` abre o diálogo → OK → `lifecycle.updatePageConfig` → `documentState.pageConfig` + `dirty` |
| Sessão atual | `EditorTextosWorkspace` e `EditorTextosRuler` recebem `documentState.pageConfig` e refletem a alteração |

Conclusão: `REACT_OK_APPLIES_SESSION = SIM` e
`REACT_OK_MARKS_DIRTY = SIM`.

## 2. Caminho de escrita de metadata

O estado não é gravado pelo diálogo. A escrita ocorre somente no lifecycle de
documento:

```text
documentState.pageConfig
  → documentModelToPayload()
  → payload.pagina_config
  → editorTextosApi.updateDocument()/createDocument()
  → PUT/POST /editor-textos/modelos
  → _save_editor_meta(..., pagina_config=payload.pagina_config)
  → arquivo .editor.json
```

Evidências:

- `frontend-react/src/features/editorTextos/models/documentModel.js` inclui
  `pagina_config: model.pageConfig || null`.
- `useEditorDocumentLifecycle.saveDocument` chama
  `documentModelToPayload(documentState, content)` antes do PUT.
- `saveDocumentAs` usa o mesmo mapper antes do POST.
- `backend/routes/editor_textos_routes.py` recebe `pagina_config` nos payloads
  POST/PUT e chama `_save_editor_meta`.
- `_save_editor_meta` grava `data["pagina_config"]` no sidecar `.editor.json`.

```text
PAGECONFIG_INCLUDED_IN_SAVE_METADATA = SIM
AUTO_SAVE_AFTER_PAGE_SETUP_OK = NÃO
SAVE_REQUIRED_AFTER_OK = SIM
```

## 3. Caminho de leitura/hidratação

```text
GET /editor-textos/modelos/{id}
  → backend _load_content_bundle()
  → metadata .editor.json
  → response.pagina_config
  → documentDtoToModel()
  → normalizePageConfig()
  → documentState.pageConfig
  → EditorTextosWorkspace / EditorTextosRuler
```

```text
PAGECONFIG_READ_FROM_METADATA = SIM
PAGECONFIG_HYDRATED_ON_MODULE_REENTRY = SIM, quando o documento é reaberto via API
```

A hidratação não ocorre para uma sessão local abandonada antes de SALVAR,
porque não existe nova metadata contendo a alteração.

## 4. Default override

O default é aplicado somente quando não existe `dto.pagina_config` ou quando
um documento novo é criado. `documentDtoToModel` usa
`normalizePageConfig(dto.pagina_config || DEFAULT_PAGE_CONFIG)`.

Quando `dto.pagina_config` existe, ele é a fonte usada na normalização; não há
evidência de que o default substitua um PageConfig persistido válido.

```text
DEFAULT_OVERRIDES_PERSISTED_PAGECONFIG = PROVEN_NO
```

## 5. Unmount e saída do módulo

`App.jsx` renderiza `EditorTextosPage` apenas quando `screen ===
'editor-textos'`. Ao navegar para outra tela, a árvore do Editor é desmontada.

Consequências comprovadas:

- `documentState` local é destruído;
- `pageSetupVisible` e o draft são destruídos;
- `dirty` não é persistido automaticamente;
- não foi encontrado guard global que impeça saída do Editor quando
  `documentState.dirty` é verdadeiro;
- metadata pendente permanece somente em memória e é perdida.

```text
MODULE_EXIT_DIRTY_GUARD = NÃO
PAGECONFIG_CHANGE_MARKS_DIRTY = SIM
```

## 6. Contrato legado versus React

| Comportamento | Legado | React atual | Match |
|---|---|---|---|
| OK aplica na sessão | sim | sim | SIM |
| OK marca documento alterado | sim, via estado alterado | sim, `dirty: true` | SIM |
| OK persiste imediatamente | não comprovado como auto-save; fluxo de documento usa salvar | não | PARCIAL/UNPROVEN no legado |
| Requer SALVAR | comportamento compatível com fluxo documental | sim | SIM |
| Sair sem SALVAR | não deve ser usado para confirmar persistência | descarta estado local | LIMITAÇÃO DE GUARD |
| Reabrir após SALVAR | restaura configuração persistida | restaura `pagina_config` do metadata | SIM |
| Default sobrescreve metadata | não | não | SIM |
| Metadata persistence | sidecar `.editor.json` | POST/PUT → sidecar `.editor.json` | SIM |

Não foi executado teste legado destrutivo nem save real nesta rodada. Portanto,
`LEGACY_OK_AUTO_PERSISTS` não é afirmado como fato runtime; o código e o fluxo
documental não demonstram auto-save no OK.

## 7. Classificação da causa

```text
ROOT_CAUSE = EXPECTED_SAVE_REQUIRED + DIRTY_GUARD_GAP
```

Explicação: a alteração de PageConfig é aplicada corretamente e entra no
payload de SALVAR. A falha ocorre quando o usuário sai do módulo sem SALVAR:
o estado React local é desmontado e não existe guard específico para impedir a
saída ou solicitar salvamento. Não há evidência de `MISSING_SAVE_METADATA_WRITE`,
`MISSING_METADATA_READ` ou `DEFAULT_OVERRIDE`.

## 8. Testes reais

```text
SAFE_SAVE_ROUNDTRIP_TEST = NOT_RUN_SAFE_DATA
LEGACY_OK_AUTO_PERSISTS = UNPROVEN
LEGACY_REQUIRES_DOCUMENT_SAVE = UNPROVEN (contrato de código indica save como etapa necessária)
```

Nenhum documento clínico foi alterado e nenhum save real foi executado nesta
auditoria.

## Fechamento

```text
EDITOR_TEXTOS_PAGE_SETUP_PERSISTENCE_AUDIT_STATUS = COMPLETE
REACT_OK_APPLIES_SESSION = SIM
REACT_OK_MARKS_DIRTY = SIM
REACT_PAGECONFIG_INCLUDED_IN_SAVE_METADATA = SIM
REACT_PAGECONFIG_READ_FROM_METADATA = SIM
REACT_PAGECONFIG_HYDRATED_ON_REENTRY = SIM, após save e reopen
DEFAULT_OVERRIDES_PERSISTED_PAGECONFIG = PROVEN_NO
MODULE_EXIT_DIRTY_GUARD = NÃO
MATERIAL_PERSISTENCE_GAPS = [DIRTY_GUARD_GAP; confirmação segura de save/reentry ainda não executada]
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_PAGE_SETUP_PERSISTENCE_FIX = SIM
```

Este documento libera uma futura correção dirigida, mas não implementa a
correção. A decisão pendente para a próxima etapa é definir o contrato de saída
com dirty: guard/confirmar salvamento ou exigir explicitamente SALVAR antes de
deixar o módulo.

## PAGESETUP-PERSISTENCE-CLOSURE-R2 — fechamento seguro

### Verificação de recurso seguro

Busca dirigida por recursos sintéticos persistidos, identificadores de teste,
`SAFE_RESOURCE`, `SAFE_WRITE`, `TESTE_EDITOR` e registros de homologação
encontrou somente fixtures locais em
`frontend-react/src/features/editorTextos/fixtures/editorTextosFixtures.js`.
Essas fixtures não têm identidade persistida e não exercitam POST/PUT nem
reabertura via API.

```text
SAFE_RESOURCE = NÃO IDENTIFICADO
SAFE_RESOURCE_RESTORED = NOT_APPLICABLE
SAFE_SAVE_ROUNDTRIP_TEST = NOT_RUN_SAFE_DATA
```

### React após SALVAR

O caminho estático permanece comprovado:

```text
documentState.pageConfig
→ documentModelToPayload()
→ pagina_config
→ editorTextosApi.updateDocument()/createDocument()
→ backend _save_editor_meta()
→ .editor.json
→ GET/load
→ documentDtoToModel()
→ normalizePageConfig()
→ documentState.pageConfig
```

```text
REACT_AFTER_SAVE_REENTRY = NOT_RUN_SAFE_DATA
```

Não é permitido converter essa evidência estática em `PASS` sem recurso
persistido seguro.

### Contrato legado OK versus SALVAR

Não foi executado teste de reentrada no legado, pois não havia documento ou
modelo sintético seguro identificado e o teste poderia alterar conteúdo real.

```text
LEGACY_NO_SAVE_REENTRY_VALUE = NOT_TESTED
LEGACY_WITH_SAVE_REENTRY_VALUE = NOT_TESTED
LEGACY_OK_AUTO_PERSISTS = UNPROVEN
LEGACY_REQUIRES_DOCUMENT_SAVE = UNPROVEN
LEGACY_MANUAL_VALIDATION_REQUIRED = SIM
```

Passos manuais seguros necessários:

1. abrir documento sintético ou cópia autorizada;
2. registrar uma margem;
3. alterar a margem e confirmar OK sem SALVAR;
4. sair e reabrir;
5. registrar `PERSISTED` ou `LOST`;
6. restaurar o original;
7. repetir com SALVAR se o primeiro cenário resultar em `LOST`.

### Fechamento R2

```text
EDITOR_TEXTOS_PAGE_SETUP_PERSISTENCE_CLOSURE_STATUS = INCOMPLETE
SAFE_SAVE_ROUNDTRIP_TEST = NOT_RUN_SAFE_DATA
SAFE_RESOURCE = NÃO IDENTIFICADO
SAFE_RESOURCE_RESTORED = NOT_APPLICABLE
REACT_AFTER_SAVE_REENTRY = NOT_RUN_SAFE_DATA
LEGACY_NO_SAVE_REENTRY_VALUE = NOT_TESTED
LEGACY_WITH_SAVE_REENTRY_VALUE = NOT_TESTED
LEGACY_OK_AUTO_PERSISTS = UNPROVEN
LEGACY_REQUIRES_DOCUMENT_SAVE = UNPROVEN
LEGACY_MANUAL_VALIDATION_REQUIRED = SIM
MODULE_EXIT_DIRTY_GUARD = NÃO
FINAL_ROOT_CAUSE = EXPECTED_SAVE_REQUIRED + DIRTY_GUARD_GAP (React); contrato legado ainda não comprovado
REQUIRED_REACT_FIX = [aguardar contrato legado; avaliar guard de saída dirty]
MATERIAL_PERSISTENCE_GAPS = [SAFE_SAVE_ROUNDTRIP_TEST; LEGACY_OK_AUTO_PERSISTS; LEGACY_REQUIRES_DOCUMENT_SAVE]
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_PAGE_SETUP_PERSISTENCE_FIX = NÃO
```

## RUNTIME_ROUNDTRIP_R3

### Evidência de entrada

O usuário confirmou que a alteração foi aplicada na sessão, o documento foi
salvo, o módulo foi abandonado e, ao retornar, os valores reapareceram no
estado anterior/default. Isso comprova a falha observada na reentrada, mas
não identifica sozinho em qual fronteira o valor foi perdido.

```text
REACT_AFTER_SAVE_REENTRY = FAIL (observação manual do usuário)
PAGE_CONFIG_METADATA_ROUNDTRIP = FAIL (observação manual do usuário)
```

### Rastreio estático efetivo

```text
PageSetupDialog OK
→ onApply(normalized)
→ lifecycle.updatePageConfig(config)
→ documentState.pageConfig
→ dirty = true
```

```text
SALVAR
→ saveDocument()
→ documentModelToPayload(documentState, content)
→ payload.pagina_config = model.pageConfig || null
→ editorTextosApi.updateDocument()/createDocument()
→ backend _save_editor_meta(... pagina_config=payload.pagina_config)
→ .editor.json
```

```text
reabertura
→ resposta do documento
→ documentDtoToModel(dto)
→ normalizePageConfig(dto.pagina_config || DEFAULT_PAGE_CONFIG)
→ applyDocument()
→ documentState.pageConfig
```

O rastreio prova o contrato previsto no código, mas não é captura do
request/response da sessão que falhou.

### Estado após OK

```text
PAGECONFIG_BEFORE_CHANGE = NÃO CAPTURADO NESTA RODADA
PAGECONFIG_AFTER_OK = PASS (aplicação em sessão confirmada pelo usuário)
DIRTY_AFTER_OK = PASS (updatePageConfig marca dirty no código)
```

### Request real de SALVAR

Não houve captura de Network/telemetria do request da sessão do usuário e não
foi executado novo salvamento em recurso seguro identificado. Portanto o
objeto efetivamente enviado não pode ser inventado.

```text
SAVE_REQUEST_CONTAINS_PAGECONFIG = NÃO CONFIRMADO EM RUNTIME
SAVE_REQUEST_PAGECONFIG = NÃO CAPTURADO
STATIC_SAVE_PAYLOAD_CONTRACT = SIM
STATIC_SAVE_PAYLOAD_FIELD = pagina_config
STATIC_SAVE_PAYLOAD_SOURCE = documentState.pageConfig
```

### Metadata e reabertura

O backend possui caminho estático para escrever `pagina_config` em
`.editor.json`, porém a metadata correspondente ao documento da falha não foi
lida nesta rodada.

```text
PERSISTED_METADATA_CONTAINS_PAGECONFIG = NÃO CONFIRMADO
PERSISTED_PAGECONFIG = NÃO CAPTURADO
REOPEN_RESPONSE_CONTAINS_PAGECONFIG = NÃO CONFIRMADO
REOPEN_RESPONSE_PAGECONFIG = NÃO CAPTURADO
SAME_DOCUMENT_ID_BEFORE_AFTER = NÃO CONFIRMADO
DOCUMENT_ID_BEFORE = NÃO CAPTURADO
DOCUMENT_ID_AFTER = NÃO CAPTURADO
EXPLICIT_REOPEN_PAGECONFIG = NOT_RUN
```

O estado local é destruído ao sair do módulo. Não foi capturado mecanismo de
auto-reabertura do mesmo documento no remount; assim,
`MODULE_REENTRY_OPENS_NEW_DOCUMENT` permanece hipótese, não conclusão.

### Defaults e normalização

A hidratação encontrada usa `DEFAULT_PAGE_CONFIG` como fallback e aplica
`dto.pagina_config` quando presente. Não foi encontrado overwrite posterior
comprovado sobre um `pagina_config` válido.

```text
DEFAULT_OVERWRITES_PAGECONFIG = NÃO (prova estática)
NORMALIZATION_DROP_PROVEN = NÃO
MERGE_OVERWRITE_PROVEN = NÃO
```

### Classificação R3

É possível excluir estaticamente que o mapper não tenha `pagina_config` e que
o default sempre sobrescreva valor carregado. Ainda não é possível escolher
entre omissão no request real, falha de escrita, falha de leitura ou abertura
de outro registro sem capturar request, metadata, response e IDs.

```text
ROOT_CAUSE = [UNRESOLVED_RUNTIME_BOUNDARY]
MATERIAL_PERSISTENCE_GAPS = [
  SAVE_REQUEST_CAPTURE,
  PERSISTED_METADATA_CAPTURE,
  REOPEN_RESPONSE_CAPTURE,
  DOCUMENT_ID_BEFORE_AFTER_CAPTURE,
  EXPLICIT_SAME_DOCUMENT_REOPEN
]
EDITOR_TEXTOS_PAGE_SETUP_PERSISTENCE_RUNTIME_R3_STATUS = INCOMPLETE
READY_FOR_PAGE_SETUP_PERSISTENCE_FIX = NÃO
```

```text
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
COMMIT = NÃO
PUSH = NÃO
```
