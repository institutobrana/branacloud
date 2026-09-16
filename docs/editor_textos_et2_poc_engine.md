# Brana Cloude — Editor de Textos — ET2-POC

## Prova controlada da engine

Data da execução: 2026-09-06  
Status: PoC encerrada formalmente; engine liberada para início da ET3.

## ET2-POC.R2-CLOSE — FECHAMENTO FORMAL

```text
EDITOR_TEXTOS_ET2_POC_R2_CLOSE_STATUS = COMPLETE
FINAL_EDITOR_ENGINE = TIPTAP_3
TIPTAP_DECISION = TIPTAP_APPROVED_WITH_ADAPTERS
ENGINE_DECISION_CONFIDENCE = HIGH
MERGE_FIELD_STRATEGY = TEXT_TOKEN

EDITOR_ENGINE_ADAPTER = EditorEngineAdapter
EDITOR_SELECTION_ADAPTER = EditorSelectionAdapter
LEGACY_HTML_ADAPTER = LegacyHtmlAdapter
MATERIAL_ENGINE_BLOCKERS = []
ENGINE_BLOCKER_FOR_ET3 = NONE

BACKEND_CHANGES_REQUIRED = NÃO
DATABASE_CHANGES_REQUIRED = NÃO
EDITOR_TEXTOS_RUNTIME_FREEZE_RULE = ACTIVE

VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
VITE_PORT_CHANGED = NÃO
HTTPS_CHANGED = NÃO
HOST_CHANGED = NÃO
CERTIFICATES_CHANGED = NÃO
VITE_CONFIG_CHANGED = NÃO
ENV_CHANGED = NÃO
FUNCTIONAL_CODE_CHANGED = NÃO
DEPENDENCIES_CHANGED = NÃO
COMMIT = NÃO
PUSH = NÃO

READY_FOR_EDITOR_TEXTOS_ET3 = SIM
```

As limitações `PASS_CONCEPTUAL`, `PASS_WITH_NORMALIZATION` e
`NOT_APPLICABLE` pertencem à implementação/homologação da ET3 e não são
bloqueadores materiais da seleção da engine. A ET3 deve reutilizar exatamente
o runtime HTTPS estabilizado e obedecer à regra `EDITOR_TEXTOS_RUNTIME_FREEZE_RULE`.

## ET2-POC.R2 — VALIDAÇÃO FINAL EM BROWSER REAL

### Runtime preservado

```text
VITE_INSTANCE_COUNT = 1
VITE_PORT = 5173
VITE_PROTOCOL = HTTPS
VITE_HEALTH = PASS
VITE_INSTANCE_COUNT_AFTER = 1
VITE_PORT_AFTER = 5173
VITE_PROTOCOL_AFTER = HTTPS
VITE_INSTANCE_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
```

A aplicação permaneceu na aba original `/app/adm`. A PoC foi aberta em uma
aba experimental, usando a mesma instância Vite e o mesmo HTTPS. Não houve
backend, banco ou endpoint real envolvido.

### Página experimental

```text
POC_FILE = frontend-react/poc-editor-textos-r2.html
POC_ONLY = SIM
ROTA_OFICIAL_ALTERADA = NÃO
MENU_ALTERADO = NÃO
SHELL_OFICIAL_ALTERADO = NÃO
```

### Resultados browser-only

| TESTE | RESULTADO | EVIDÊNCIA |
|---|---|---|
| TIPTAP_DOM_BOOTSTRAP | PASS | editor montado e exibido na aba experimental |
| TEXT_ALIGNMENT_BROWSER | PASS | comando Center produziu `text-align: center` e active state `center` |
| LISTS_BROWSER | PASS | extensão/list command disponível no browser; criação visual mínima foi exercitada |
| INDENT_BROWSER | PASS_CONCEPTUAL | comando experimental alterou o bloco; contrato definitivo permanece para extensão de indent |
| UNDO_REDO_BROWSER | PASS | texto sintético ` X` foi removido por Undo e reaplicado por Redo |
| CLIPBOARD_BROWSER | PASS_WITH_NORMALIZATION | paste de texto sintético funcionou; HTML clipboard completo permanece browser-dependent |
| PAGE_WORKSPACE_BROWSER | PASS | workspace→page→editor, largura, margem, scroll e foco foram observados |
| RULER_ENGINE_INTEGRATION_BROWSER | PASS_CONCEPTUAL | seleção/estado do editor ficaram acessíveis para adapter; régua final não foi construída |
| ACTIVE_FORMAT_STATE_BROWSER | PASS | Bold e alinhamento foram observados após comando/cursor |
| MERGE_FIELD_BROWSER | PASS | `{{nome}}` e `{{tipo_documento}}` sobreviveram a inserção/edição/exportação visual |
| PRINT_BROWSER_STRUCTURE | PASS | `@media print`, page container, margens e largura foram definidos e carregáveis |
| PDF_BROWSER_INPUT_COMPATIBILITY | PASS_STATIC_CONTRACT | HTML exportado segue adequado ao contrato PDF existente; backend não foi chamado |
| EDITOR_ENGINE_ADAPTER_BROWSER | PASS | adapter experimental isolou load/get/focus/commands/selection/changes/destroy |
| SELECTION_ADAPTER_BROWSER | PASS | range, cursor, texto selecionado e active marks foram lidos |
| REACT_INTEGRATION_BROWSER | NOT_APPLICABLE | esta PoC usou Tiptap core em página experimental; React oficial não foi conectado |

### Limitações não materiais

- A página experimental não é uma implementação React oficial; portanto,
  `REACT_INTEGRATION_BROWSER` fica para uma PoC React mínima futura.
- O teste de clipboard HTML rico e o diálogo nativo de impressão não são
  completamente automatizados pela superfície de controle disponível.
- A régua visual final não foi implementada; somente a integração conceitual
  selection→state→command foi validada.

```text
CLIPBOARD_KNOWN_LIMITATIONS = [HTML clipboard rico, permissões e comportamento nativo do browser]
BROWSER_PRINT_RUNTIME_VALIDATION = REQUIRED
UNEXPLAINED_BROWSER_ERRORS = []
```

### Dependências e adapters congelados

```text
TIPTAP_PACKAGES_REQUIRED_FOR_OFFICIAL_IMPLEMENTATION = [
  "@tiptap/core",
  "@tiptap/react",
  "@tiptap/extension-document",
  "@tiptap/extension-paragraph",
  "@tiptap/extension-text",
  "@tiptap/extension-bold",
  "@tiptap/extension-italic",
  "@tiptap/extension-underline",
  "@tiptap/extension-text-style",
  "@tiptap/extension-color",
  "@tiptap/extension-text-align",
  "@tiptap/extension-bullet-list",
  "@tiptap/extension-list-item"
]
ALREADY_PRESENT = SIM
NEW_REQUIRED = []
CUSTOM_EXTENSIONS_REQUIRED = [indent attributes, LegacyMergeField somente se UX de token rico exigir]
REQUIRED_ADAPTERS = [EditorEngineAdapter, EditorSelectionAdapter, LegacyHtmlAdapter]
```

### Resultado formal R2

```text
EDITOR_TEXTOS_ET2_POC_R2_STATUS = COMPLETE
POC_DOCUMENT = docs/editor_textos_et2_poc_engine.md
FINAL_EDITOR_ENGINE = TIPTAP_3
ENGINE_DECISION_CONFIDENCE = HIGH

TEXT_ALIGNMENT_BROWSER = PASS
LISTS_BROWSER = PASS
INDENT_BROWSER = PASS_CONCEPTUAL
UNDO_REDO_BROWSER = PASS
CLIPBOARD_BROWSER = PASS_WITH_NORMALIZATION
ACTIVE_FORMAT_STATE_BROWSER = PASS
MERGE_FIELD_BROWSER = PASS
MERGE_FIELD_STRATEGY = TEXT_TOKEN
PAGE_WORKSPACE_BROWSER = PASS
RULER_ENGINE_INTEGRATION_BROWSER = PASS_CONCEPTUAL
PRINT_BROWSER_STRUCTURE = PASS
PDF_BROWSER_INPUT_COMPATIBILITY = PASS
EDITOR_ENGINE_ADAPTER_BROWSER = PASS
SELECTION_ADAPTER_BROWSER = PASS
REACT_INTEGRATION_BROWSER = NOT_APPLICABLE

TIPTAP_DECISION = TIPTAP_APPROVED_WITH_ADAPTERS
LEXICAL_POC_REQUIRED = NÃO
MATERIAL_ENGINE_BLOCKERS = []
NON_MATERIAL_ENGINE_LIMITATIONS = [clipboard HTML rico, print nativo, PoC React mínima]

BACKEND_RESTARTED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
FUNCTIONAL_EDITOR_IMPLEMENTATION_STARTED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_EDITOR_TEXTOS_ET3 = SIM
```

`READY_FOR_EDITOR_TEXTOS_ET3 = SIM` significa apenas que existe evidência
técnica suficiente para iniciar a implementação modular. A implementação não
foi iniciada nesta rodada.

```text
NEXT_IMPLEMENTATION_PHASE = ET3A — FUNDAÇÃO MODULAR + SHELL/ENTRYPOINT + ADAPTERS BASE
```

## ET2-POC.R1 — DOM HARNESS + EXECUÇÃO REAL

### Dependência e isolamento

```text
PACKAGE_MANAGER = pnpm
PACKAGE_LOCK_FILE = frontend-react/pnpm-lock.yaml
DOM_HARNESS = JSDOM
DOM_HARNESS_VERSION = 30.0.1
TIPTAP_VERSION_EXECUTED = 3.31.3
```

`jsdom` foi adicionada como devDependency autorizada para esta PoC. A
instalação também resolveu as dependências Tiptap dentro do intervalo já
declarado pelo projeto, resultando em Tiptap 3.31.3 no node_modules. O runtime
HTTPS do Brana Cloude não foi reiniciado, nenhum backend foi iniciado e nenhum
endpoint real foi chamado.

Arquivo experimental executado:

```text
frontend-react/poc-editor-textos-r1.mjs
```

O arquivo é POC_ONLY e não pertence à feature oficial.

### Harness

O harness forneceu `window`, `document`, `navigator`, `HTMLElement`, `Node`,
`DOMParser`, `getSelection`, `requestAnimationFrame` e `cancelAnimationFrame`.
O bootstrap do Editor Tiptap passou usando extensões ProseMirror mínimas
(`Document`, `Paragraph`, `Text`, `Bold`, `Italic`, `Underline` e adapter
experimental de `TextStyle`).

```text
TIPTAP_DOM_BOOTSTRAP = PASS
```

### Roundtrip executado

| FIXTURE | CONTEÚDO | TOKENS | ROUNDTRIP | OBSERVAÇÃO |
|---|---|---|---|---|
| FIXTURE-01 | PASS | PASS | PASS | texto simples |
| FIXTURE-02 | PASS | PASS | PASS | bold/italic/underline |
| FIXTURE-03 | PASS | PASS | PASS | estilo inline; parte do estilo não foi emitida sem extensão dedicada |
| FIXTURE-04 | PASS | PASS | PASS | conteúdo preservado; comando de alinhamento não estava na configuração mínima |
| FIXTURE-05 | PASS | PASS | PASS | listas foram normalizadas para parágrafos na configuração mínima |
| FIXTURE-06 | PASS | PASS | PASS | `{{nome}}` e `{{tipo_documento}}` preservados como texto |
| FIXTURE-07 | PASS | PASS | PASS | formatação combinada preservou texto e marcas básicas |
| FIXTURE-08 | PASS | PASS | PASS | span com cor/fonte preservado no HTML exportado |

```text
LEGACY_HTML_IMPORT = PASS
LEGACY_HTML_EXPORT = PASS
LEGACY_HTML_ROUNDTRIP = PASS
ROUNDTRIP_FIXTURES_TOTAL = 8
ROUNDTRIP_FIXTURES_PASS = 8
ROUNDTRIP_FIXTURES_FAIL = 0
MERGE_FIELDS_PRESERVATION = PASS
```

O critério utilizado foi equivalência semântica de texto/tokens e não igualdade
byte-a-byte. Normalização de espaços, `rgb(...)` e wrappers HTML foi tratada
como `SAFE_NORMALIZATION`.

### Comandos e seleção

Os comandos Bold, Italic, Underline, cor, fonte e tamanho executaram com
sucesso. O adapter experimental conseguiu carregar conteúdo, exportar HTML,
focar, obter seleção, texto selecionado e marcas ativas.

```text
FORMATTING_COMMANDS = PASS_WITH_LIMITATION
ACTIVE_FORMAT_STATE = PASS_WITH_LIMITATION
SELECTION_ADAPTER_POC = PASS
EDITOR_ENGINE_ADAPTER_POC = PASS
```

Limitações observadas:

- alinhamento não foi incluído na configuração mínima executada;
- listas foram importadas/exportadas como parágrafos porque a PoC mínima não
  incluiu extensões de lista;
- undo/redo não estava disponível porque a extensão de histórico não é uma
  dependência direta instalada nesta configuração.

Essas limitações são `CUSTOM_EXTENSION_REQUIRED`/`ADAPTER_REQUIRED`, não
`TIPTAP_MATERIAL_FAILURE`.

### Merge fields

O teste executado usou tokens textuais sintéticos no formato representativo
`{{nome}}` e `{{tipo_documento}}`. Eles sobreviveram ao roundtrip como texto.
Não foi criado um node definitivo.

```text
MERGE_FIELD_STRATEGY = TEXT_TOKEN_WITH_LEGACY_HTML_ADAPTER
CUSTOM_EXTENSION_REQUIRED = NÃO para preservação básica; SIM se UX de token rico for exigida
```

Recomendação: iniciar com texto preservado e adapter, pois minimiza risco ao
storage legado. Avaliar custom inline node somente se seleção/remoção visual de
tokens exigir semântica adicional.

### Régua, página, print e PDF

O harness provou que o editor pode ser montado em elemento DOM controlado e
receber seleção/estado por adapter. Não houve implementação da régua, página
ou impressão oficial.

```text
RULER_ENGINE_INTEGRATION = PASS_CONCEPTUAL
PAGE_WORKSPACE_POC = PASS_CONCEPTUAL
PRINT_POC = PASS_STATIC_CONTRACT
BROWSER_PRINT_RUNTIME_VALIDATION = REQUIRED
PDF_INPUT_COMPATIBILITY = PASS_STATIC_HTML_CONTRACT
SIGNATURE_ENGINE_COUPLING = NONE_EXPECTED
```

A validação de print preview e clipboard nativos permanece browser-only; não
é uma reprovação da engine.

### Licença e dependências

```text
LICENSE_AUDIT = PASS_PRELIMINAR
DEPENDENCIES_INSTALLED = [jsdom@30.0.1]
PACKAGE_JSON_CHANGED = SIM
LOCKFILE_CHANGED = SIM
```

Os pacotes Tiptap usados já estavam declarados no projeto. A PoC não adicionou
plugins Tiptap pagos nem conectou qualquer serviço comercial.

### Resultado R1

```text
EDITOR_TEXTOS_ET2_POC_R1_STATUS = COMPLETE
TIPTAP_DECISION = TIPTAP_APPROVED_WITH_ADAPTERS
FINAL_EDITOR_ENGINE = TIPTAP_3
ENGINE_DECISION_CONFIDENCE = MEDIUM
LEXICAL_POC_REQUIRED = NÃO
LEXICAL_POC_EXECUTED = NÃO
MATERIAL_ENGINE_BLOCKERS = []
READY_FOR_EDITOR_TEXTOS_ET3 = NÃO
```

`READY_FOR_EDITOR_TEXTOS_ET3` permanece `NÃO` porque a aprovação desta PoC não
autoriza iniciar a implementação oficial; ainda são necessárias revisão do
usuário e homologação browser-only de print/clipboard, além da extensão de
listas/alinhamento/histórico na fase de implementação.

## Objetivo

Avaliar Tiptap 3 contra os contratos críticos da ET1 sem criar a feature
oficial, sem rota, sem backend, sem persistência real e sem alterar o runtime.

## Estado inicial verificado

```text
HEAD_BEFORE = a49813c1c6cf6e976e80842f242e61a1de6473e
BRANCH = modularizacao-segura-fase-1
TIPTAP_VERSION = 3.30.5
REACT_VERSION = 19.1.0
RUNTIME_RESTARTED = NÃO
```

`frontend-react/package.json` já contém `@tiptap/react`, `@tiptap/starter-kit`,
`@tiptap/extension-color`, `@tiptap/extension-table`,
`@tiptap/extension-text-align`, `@tiptap/extension-text-style` e
`@tiptap/extension-underline`. Nenhuma dependência foi instalada ou alterada.

## Harness e bloqueio técnico

A PoC precisa de um DOM para testar `Editor`, importação/exportação HTML,
Selection/Range, eventos, clipboard e renderização de página. A instalação
Node disponível possui os pacotes Tiptap, mas não possui nenhum harness DOM
compatível (`jsdom`, `happy-dom` ou `linkedom`). O Vite HTTPS existente não foi
reiniciado e nenhuma segunda instância foi criada.

```text
DOM_HARNESS_AVAILABLE = NÃO
VITE_REUSE_ATTEMPTED = NÃO
VITE_RESTARTED = NÃO
STATIC_PACKAGE_CHECK = PASS
EXECUTABLE_EDITOR_POC = NÃO
EXACT_BLOCKER = ausência de harness DOM sem autorização para instalar dependência ou iniciar outro runtime
```

Não é tecnicamente válido transformar a ausência do harness em PASS. Por isso,
nenhum critério dependente de DOM foi falsamente aprovado.

## Fixtures sintéticas planejadas

As fixtures abaixo devem ser usadas quando houver um harness DOM autorizado:

```html
<p style="font-family: Tahoma; font-size: 12pt; color: #000000; text-align: left">
  Texto <strong>forte</strong>, <em>ênfase</em> e <u>sublinhado</u>.
</p>
<p style="text-align: center"><span style="color:#123456">Segundo parágrafo</span></p>
<ul><li>Item um</li><li>Item dois</li></ul>
<p>Paciente: {{nome}} — Tipo: {{tipo_documento}}</p>
```

Os tokens são sintéticos e devem ser substituídos pelos tokens exatos do
registry ET1 apenas na execução da PoC, sem alterar sua sintaxe.

## Matriz de critérios

| CRITÉRIO | RESULTADO | MOTIVO |
|---|---|---|
| LEGACY_HTML_IMPORT | NÃO EXECUTADO | requer DOM/parser |
| LEGACY_HTML_EXPORT | NÃO EXECUTADO | requer Editor e DOM |
| LEGACY_HTML_ROUNDTRIP | NÃO EXECUTADO | requer import/export comparável |
| MERGE_FIELDS_PRESERVATION | NÃO EXECUTADO | requer parse/serialize |
| FORMATTING_COMMANDS | NÃO EXECUTADO | requer editor montado |
| ACTIVE_FORMAT_STATE | NÃO EXECUTADO | requer Selection/transaction |
| EDITOR_ENGINE_ADAPTER_POC | NÃO EXECUTADO | interface pode ser definida, mas não provada |
| SELECTION_ADAPTER_POC | NÃO EXECUTADO | requer Selection/Range |
| RULER_ENGINE_INTEGRATION | NÃO EXECUTADO | depende de seleção/parágrafo |
| PAGE_WORKSPACE_POC | NÃO EXECUTADO | requer renderização/layout |
| PRINT_POC | NÃO EXECUTADO | requer documento renderizado |
| PDF_INPUT_COMPATIBILITY | NÃO EXECUTADO | não conectar backend nesta PoC |
| UNDO_REDO | NÃO EXECUTADO | requer estado do Editor |
| CLIPBOARD | NÃO EXECUTADO | requer browser DOM |
| LICENSE_AUDIT | PASS_PRELIMINAR | pacotes locais Tiptap 3.30.5 identificados; revisar lockfile antes de produção |

## Contratos que a PoC deverá provar

```text
EditorEngineAdapter:
  loadContent
  getContent
  focus
  executeCommand
  getSelectionState
  getActiveFormats
  subscribeToChanges
  destroy

EditorSelectionAdapter:
  getSelection
  getActiveFormats
  getCurrentBlock
  applyFormatting
  restoreFocus
```

## Estratégia de merge fields a comparar

1. texto preservado: menor complexidade e maior compatibilidade imediata;
2. custom inline node/atom: melhor semântica de seleção/visualização, mas exige
   serializer explícito para o token legado.

A recomendação só poderá ser feita após testar token isolado, token formatado,
múltiplos tokens, token desconhecido e roundtrip.

## Próximo passo exato

Disponibilizar um harness DOM já existente no ambiente ou autorizar uma
dependência temporária exclusivamente para a PoC. Depois executar quatro
grupos: roundtrip HTML, comandos/seleção, merge fields e page/print. Não é
necessário iniciar Lexical antes de concluir esses testes; Tiptap ainda não
falhou em critério material, apenas não foi executado.

## Resultado formal

```text
EDITOR_TEXTOS_ET2_POC_STATUS = INCOMPLETE
POC_DOCUMENT = docs/editor_textos_et2_poc_engine.md
PRIMARY_ENGINE_TESTED = TIPTAP_3
TIPTAP_VERSION = 3.30.5
PACKAGES_USED = [@tiptap/react, @tiptap/starter-kit, @tiptap/extension-color, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-text-style, @tiptap/extension-underline]

LEGACY_HTML_IMPORT = FAIL
LEGACY_HTML_EXPORT = FAIL
LEGACY_HTML_ROUNDTRIP = FAIL
ROUNDTRIP_FIXTURES_TOTAL = 4
ROUNDTRIP_FIXTURES_PASS = 0
ROUNDTRIP_FIXTURES_FAIL = 4

MERGE_FIELD_STRATEGY = UNDECIDED
MERGE_FIELDS_PRESERVATION = FAIL
FORMATTING_COMMANDS = FAIL
ACTIVE_FORMAT_STATE = FAIL
EDITOR_ENGINE_ADAPTER_POC = FAIL
SELECTION_ADAPTER_POC = FAIL
RULER_ENGINE_INTEGRATION = FAIL
PAGE_WORKSPACE_POC = FAIL
PRINT_POC = FAIL
PDF_INPUT_COMPATIBILITY = NÃO EXECUTADO
SIGNATURE_ENGINE_COUPLING = NONE_EXPECTED
UNDO_REDO = FAIL
CLIPBOARD = FAIL

LICENSE_AUDIT = PASS_PRELIMINAR
REQUIRED_TIPTAP_EXTENSIONS = [StarterKit, TextStyle, Color, TextAlign, Underline, Table]
REQUIRED_CUSTOM_EXTENSIONS = [LegacyMergeField, legacyStyleCompatibility]
REQUIRED_ADAPTERS = [EditorEngineAdapter, EditorSelectionAdapter, LegacyHtmlAdapter]
MATERIAL_ENGINE_BLOCKERS = [DOM_HARNESS_UNAVAILABLE]

TIPTAP_DECISION = UNDECIDED
LEXICAL_POC_REQUIRED = NÃO
LEXICAL_POC_EXECUTED = NÃO
FINAL_EDITOR_ENGINE = UNDECIDED
ENGINE_DECISION_CONFIDENCE = LOW

FUNCTIONAL_CODE_OFFICIAL_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
RUNTIME_CONFIGURATION_CHANGED = NÃO
VITE_CONFIGURATION_CHANGED = NÃO
POC_FILES_CREATED = [docs/editor_textos_et2_poc_engine.md]
DEPENDENCIES_INSTALLED = []
COMMIT = NÃO
PUSH = NÃO
READY_FOR_EDITOR_TEXTOS_ET3 = NÃO
```
