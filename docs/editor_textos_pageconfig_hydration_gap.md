# Editor de Textos — gap de hidratação do PageConfig

## Status

```text
EDITOR_TEXTOS_PAGECONFIG_HYDRATION_AUDIT_STATUS = INCOMPLETE
DOCUMENT_PAGECONFIG_HYDRATION_ROOT_CAUSE_PROVEN = NÃO
LAST_PAGE_CONFIG_IMPLEMENTATION = PAUSED
```

## Evidência de entrada

O usuário relatou que documento salvo com medidas próprias reabre com medidas
diferentes. A falha runtime é aceita, mas o documento, ID, valores esperados
e response correspondente não foram identificados nesta auditoria.

```text
DOCUMENT_ID = NÃO INFORMADO
DOCUMENT_NAME = NÃO INFORMADO
EXPECTED_SAVED_PAGECONFIG = NÃO INFORMADO
CURRENT_RUNTIME_PAGECONFIG = NÃO CAPTURADO
```

## Caminho estático comprovado

Documento em branco:

```text
EditorTextosPage
→ useEditorDocumentLifecycle()
→ useState(createEmptyEditorDocument)
→ createEmptyEditorDocument()
→ DEFAULT_PAGE_CONFIG
```

Documento salvo:

```text
openDocument(id)
→ editorTextosApi.getDocument(id)
→ documentDtoToModel(dto)
→ normalizePageConfig(dto.pagina_config || DEFAULT_PAGE_CONFIG)
→ applyDocument(document)
→ setDocumentState(... pageConfig: normalizePageConfig(document.pageConfig))
→ Workspace / Ruler / PageSetupDialog recebem documentState.pageConfig
```

Símbolos:

```text
DEFAULT_PAGE_CONFIG = frontend-react/src/features/editorTextos/models/pageConfig.js
createEmptyEditorDocument = frontend-react/src/features/editorTextos/models/editorTextosState.js
documentDtoToModel = frontend-react/src/features/editorTextos/models/documentModel.js
normalizePageConfig = frontend-react/src/features/editorTextos/models/pageConfig.js
applyDocument/openDocument = frontend-react/src/features/editorTextos/hooks/useEditorDocumentLifecycle.js
```

## Captura runtime pendente

Não houve documento real identificado nem captura de response de ABRE nesta
rodada. Os valores abaixo permanecem deliberadamente sem preenchimento.

```text
OPEN_RESPONSE_CONTAINS_PAGINA_CONFIG = NÃO CAPTURADO
OPEN_RESPONSE_PAGINA_CONFIG = NÃO CAPTURADO
RAW_PAGECONFIG = NÃO CAPTURADO
NORMALIZED_PAGECONFIG = NÃO CAPTURADO
DOCUMENT_MODEL_PAGECONFIG = NÃO CAPTURADO
LIFECYCLE_PAGECONFIG = NÃO CAPTURADO
DOCUMENT_STATE_PAGECONFIG = NÃO CAPTURADO
DIALOG_INITIAL_PAGECONFIG = NÃO CAPTURADO
WORKSPACE_PAGECONFIG = NÃO CAPTURADO
RULER_PAGECONFIG = NÃO CAPTURADO
```

## Default e precedência

Estaticamente, `DEFAULT_PAGE_CONFIG` aparece como fallback em
`documentDtoToModel`; não foi encontrado overwrite posterior comprovado. O
caminho de `openDocument()` também não chama `createEmptyEditorDocument()`.

```text
DEFAULT_PAGE_CONFIG_OVERRIDES_SAVED_DOCUMENT = PROVEN_NO (prova estática)
SAVED_DOCUMENT_PRECEDENCE_PROTECTION_POINT = documentDtoToModel(dto.pagina_config || DEFAULT_PAGE_CONFIG)
SAVED_DOCUMENT_PAGECONFIG_PRECEDENCE = UNPROVEN EM RUNTIME
```

## Causa-raiz e gate

```text
ROOT_CAUSE = NÃO PROVADA
ROOT_CAUSE_PROVEN = NÃO
MATERIAL_GAPS = [
  response real de ABRE,
  comparação raw → normalized → documentState → dialog,
  identidade do documento,
  confirmação runtime de workspace/ruler
]
LAST_PAGE_CONFIG_ARCHITECTURE_STILL_VALID = REQUIRES_ADJUSTMENT
READY_FOR_COMBINED_PAGECONFIG_FIX = NÃO
```

`LAST_PAGE_CONFIG` não deve ser implementado enquanto a hidratação de
documento salvo não for comprovada no runtime.

## Alterações

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
