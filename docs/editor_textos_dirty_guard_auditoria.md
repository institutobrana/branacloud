# Auditoria de Dirty Guard — Editor de Textos

## Escopo e conclusão

Esta auditoria compara o comportamento observado no frontend legado com o comportamento atual do frontend React. Nenhuma implementação foi feita nesta rodada.

Conclusão: o contrato funcional legado está suficientemente identificado para Novo, Abrir, Configura página e saída do editor. O React atual ainda não possui um guard equivalente com modal Brana, ação pendente e continuação após salvamento. O contrato de salvamento de documento novo dentro do guard não foi executado em runtime seguro; portanto a implementação não está liberada.

## 1. Comportamento runtime do legado

| Cenário | Resultado observado |
|---|---|
| Documento limpo + Novo | Abre diretamente o modal `Novo texto`; não há guard. |
| Texto dirty + Novo | Exibe `window.confirm` antes do modal Novo. Mensagem: `Existem alteracoes nao salvas. Deseja descartar?`. Cancelar/Escape mantém o documento e o texto alterado. |
| Texto dirty + Abrir | Exibe o mesmo confirm antes do diálogo Abrir. A seleção/abertura não prossegue quando o confirm é cancelado. |
| PageConfig alterado + Novo/Abrir | O código marca o mesmo estado dirty (`editorTextosCfg.alterado`); as ações passam pelo mesmo `editorTextosConfirmarDescartar`. |
| Dirty + saída do módulo/editor | O fechamento/saída chama o mesmo guard antes de ocultar o editor. |

O confirm legado tem semântica booleana do navegador: OK aceita o descarte e Cancelar interrompe a ação. Não foi observado um botão independente de `Descartar` no produto legado.

### Evidência runtime

- `Novo` limpo abriu `Novo texto` diretamente.
- Após digitar um caractere, o editor exibiu `Alteracoes pendentes...`.
- `Novo` dirty exibiu o confirm com a mensagem acima; Escape preservou o caractere e o editor.
- `Abrir` dirty exibiu novamente o mesmo confirm.

## 2. Contrato no código legado

### Dirty e guard

- `markDirty()` define `editorTextosCfg.alterado = true` e atualiza o status visual.
- `editorTextosConfirmarDescartar()` retorna `true` quando limpo; quando dirty chama `window.confirm("Existem alteracoes nao salvas. Deseja descartar?")`.
- A função é chamada antes de `Novo`, antes de `Abrir`, antes da abertura de item selecionado e na saída/fechamento do editor.
- `editorTextosConfirmarConfigurarPagina()` aplica a configuração e `editorTextosAplicarConfiguracaoPagina(true)` marca `editorTextosCfg.alterado = true`; portanto PageConfig usa o mesmo dirty guard.

### Salvamento

`editorTextosSalvarAtual(forceNew, forcedName)` monta payload com `nome`, conteúdo, tipo, extensão e `pagina_config`. Para documento existente usa `PUT /editor-textos/modelos/{id}`; para documento sem identidade usa `POST /editor-textos/modelos`; conflitos de nome podem ser resolvidos pelo modelo existente. Após resposta de sucesso, atualiza identidade e `pagina_config`, aplica conteúdo, define `alterado = false` e atualiza a lista.

`editorTextosSalvarComoAtual()` solicita nome e chama o fluxo de salvar como novo. O caminho runtime completo de um documento novo dirty salvando dentro do guard não foi executado para não alterar dados reais.

## 3. Comportamento atual do React

### Ownership do dirty

O owner é `useEditorDocumentLifecycle`, usado por `EditorTextosPage`.

- Campo: `documentState.dirty`.
- Setters principais: assinatura do engine/editor, `updatePageConfig`, aplicação de mudanças no documento.
- Resetters: abertura de documento, criação de documento limpo, sucesso de `saveDocument` e sucesso de `saveDocumentAs`.
- `updatePageConfig` normaliza PageConfig e define `dirty: true`.
- O estado é local ao lifecycle; ao desmontar `EditorTextosPage`, ele não é preservado por um coordenador global.

### Novo e Abrir

- `Novo`: a ação do lifecycle verifica dirty antes de mostrar o diálogo, mas o runtime observado após digitar mostrou o contêiner Novo sem um confirm. Isso não reproduz o contrato legado e requer validação durante a implementação.
- `Abrir`: `showOpen()` retorna sem abrir quando dirty, sem modal React e sem permitir salvar/continuar. A ação é silenciosamente bloqueada.
- Saída do módulo: `App` troca `screen` e desmonta a página; não há guard de navegação integrado.

### Save atual

- Documento existente: `saveDocument()` usa o fluxo de atualização e limpa dirty no sucesso.
- Documento novo sem ID: `saveDocument()` retorna sem salvar; o caminho funcional disponível é `saveDocumentAs()`.
- Não existe coordenador de ação pendente que aguarde o sucesso e depois execute Novo, Abrir ou saída.

### Confirm nativo atual

`CURRENT_NATIVE_CONFIRM_PRESENT = NÃO` para o fluxo dirty + Novo observado no React. Não foi encontrado um confirm React/nativo equivalente ao guard legado nesse fluxo. O uso de `window.confirm` identificado no React é de exclusão, não de abandono de documento.

## 4. Matriz legado × React

| Cenário | Legado | React atual | Match | Diferença material |
|---|---|---|---|---|
| Limpo + Novo | Abre Novo | Abre Novo | Sim | — |
| Dirty texto + Novo | Guard antes de Novo | Sem guard equivalente no runtime; contêiner Novo apareceu | Não | Pode perder/abandonar documento sem decisão explícita |
| Dirty existente + Novo | Mesmo guard | Sem guard React completo | Não | Falta Salvar/Cancelar e continuação |
| Limpo + Abrir | Abre Abrir | Abre Abrir | Sim | — |
| Dirty texto + Abrir | Guard antes de Abrir | Retorno silencioso sem modal | Não | Usuário não pode salvar nem cancelar por UI Brana |
| Dirty PageConfig + Novo | Mesmo guard | PageConfig marca dirty, mas não há guard completo | Não | Integração de abandono ausente |
| Dirty PageConfig + Abrir | Mesmo guard | Bloqueio silencioso | Não | Falta guard coordenado |
| Dirty + sair módulo | Guard | Nenhum guard de navegação | Não | Estado local é desmontado |
| Cancelar guard | Preserva documento e ação não ocorre | Não há guard equivalente | Não aplicável | Falta implementação |
| Salvar guard em documento existente | Contrato de salvar antes de continuar | Save existente existe, mas não há continuação pendente | Parcial | Falta coordenação |
| Salvar guard em documento novo | Necessita fluxo de salvar como/nome | Save direto não atende documento sem ID | Não provado | Contrato runtime ainda aberto |

## 5. Pontos de abandono

Os pontos comprovados ou diretamente identificados são:

1. `Novo` na toolbar/ação do Editor.
2. `Abrir` na toolbar/ação do Editor.
3. Abertura de documento selecionado no diálogo Abrir.
4. Fechamento/saída do Editor legado.
5. Navegação para outro módulo no React.

`beforeunload`/refresh do navegador não foi homologado; não há, nesta auditoria, contrato runtime suficiente para classificá-lo como comportamento comum do guard.

## 6. Arquitetura React recomendada para fase posterior

O guard deve ser coordenado pelo domínio do Editor, com integração explícita na navegação:

- owner principal: `useEditorDocumentLifecycle`/coordenador do `EditorTextosPage`;
- pontos de interceptação: Novo, Abrir, abertura de documento selecionado e saída do módulo;
- ação pendente: `{ type: 'new' | 'open' | 'leave-editor', documentId?, route? }`;
- documento limpo: executar imediatamente;
- documento dirty: abrir modal React/Brana;
- Salvar/OK: salvar, aguardar sucesso e só então executar a ação pendente;
- falha de salvar: manter documento e dirty, fechar/encerrar o guard sem executar a ação;
- Cancelar: descartar apenas a ação pendente e permanecer no documento atual;
- não usar `window.confirm` para a implementação futura.

Essa arquitetura preserva o comportamento funcional legado sem portar sua implementação imperativa.

## 7. Gaps e gate

### Itens ainda não comprovados

- fluxo runtime completo de Salvar dentro do guard para documento novo sem ID;
- fluxo runtime completo de Salvar dentro do guard para documento existente;
- comportamento exato do legado após sucesso de salvar e continuação da ação pendente;
- comportamento de browser unload/refresh;
- reconciliação definitiva entre o bloqueio estático de Novo no React e o contêiner Novo observado em runtime.

### Status dos gates

```text
LEGACY_RUNTIME_BEHAVIOR_MAPPED = PASS
LEGACY_CODE_CONTRACT_MAPPED = PASS
REACT_CURRENT_BEHAVIOR_MAPPED = FAIL
SAVE_FLOW_CONTRACT_PROVEN = NÃO
NEW_UNSAVED_SAVE_CONTRACT_PROVEN = NÃO
DOCUMENT_ABANDONMENT_POINTS_PROVEN = SIM
DIRTY_GUARD_ARCHITECTURE_PROVEN = NÃO
UNPROVEN_DIRTY_GUARD_ITEMS = [
  SAVE_GUARD_EXISTING_DOCUMENT_RUNTIME,
  SAVE_GUARD_NEW_DOCUMENT_RUNTIME,
  PENDING_ACTION_CONTINUATION_AFTER_SAVE,
  REACT_NEW_RUNTIME_STATIC_DISCREPANCY,
  BROWSER_UNLOAD_CONTRACT
]
MATERIAL_DIRTY_GUARD_GAPS = [
  REACT_GUARD_MISSING_OR_INCONSISTENT,
  SAVE_FLOW_CONTRACT,
  PENDING_ACTION_COORDINATION
]
READY_FOR_DIRTY_GUARD_IMPLEMENTATION = NÃO
```

## 12. R5 — fechamento por contrato estático dirigido

### SAVE_GUARD_EXISTING_DOCUMENT_RUNTIME

`UNPROVEN` como runtime de “Salvar dentro do guard”. A cadeia estática de save normal é completa: o legado entra em `editorTextosSalvarAtual(false)`, usa `PUT /editor-textos/modelos/{id}` para documento existente, envia `pagina_config`, trata resposta não-OK com status/alert e só em sucesso atualiza identidade/conteúdo e define `editorTextosCfg.alterado = false`. O React equivalente é `saveDocument()` → `editorTextosApi.updateDocument(documentState.id, documentModelToPayload(...))`; sucesso limpa dirty e erro mantém o documento e `dirty`.

O elo específico “guard oferece Salvar e continua a ação” não existe no legado: `editorTextosConfirmarDescartar()` chama apenas `window.confirm`, cujo OK significa descartar, não salvar. Portanto não há handler legado de `Salvar no guard` nem ponto de continuação após esse save.

### SAVE_GUARD_NEW_DOCUMENT_RUNTIME

`UNPROVEN` como fluxo de guard. A cadeia normal de criação estática é completa: `editorTextosSalvarComoAtual()` solicita nome e chama `editorTextosSalvarAtual(true, nome)`, que usa `POST /editor-textos/modelos`, recebe identidade e limpa dirty em sucesso; erro mostra alerta e preserva dirty. No React, `saveDocumentAs(name)` chama `editorTextosApi.createDocument(documentModelToPayload({ ...documentState, id: null, name }, content))` e limpa dirty em sucesso.

Assim, `SAVE_AS_REQUIRED_FOR_NEW_DOCUMENT = SIM` no React. O guard legado, porém, não contém ramo Save As; seu confirm somente descarta ou cancela. O comportamento “Salvar dentro do guard e depois continuar” permanece ausente, não presumido.

### PENDING_ACTION_CONTINUATION_AFTER_SAVE

`PROVEN_BY_STATIC_CONTRACT` com boundary de ausência: o legado não armazena `pendingAction`, não possui botão Salvar no guard e não possui trigger de continuação após salvamento no guard. A ação original prossegue somente quando o confirm retorna verdadeiro (descarte), ou é interrompida quando retorna falso. No React também não existe `pendingAction`; a arquitetura futura recomendada continua sendo uma intent tipada `{ type: 'NEW' | 'OPEN_DOCUMENT' | 'LEAVE_EDITOR', payload? }`, executada somente após sucesso de save.

### SAVE_FAILURE_CONTRACT

`PROVEN_BY_STATIC_CONTRACT` para o save normal: no legado, respostas não-OK interrompem o fluxo, exibem status/alert e não executam `alterado = false`; no React, o `catch` de `saveDocument()` mantém o estado do documento e `dirty`, chama `onError` e retorna `false`. Como o guard legado não tem ramo Save, não há estado adicional de guard a ser fechado. A implementação futura deve manter a ação pendente sem execução quando o save falhar.

### REACT_NEW_RUNTIME_STATIC_DISCREPANCY

`STILL_UNPROVEN`. A cadeia estática é: toolbar → evento `brana-editor-textos-action` → listener do lifecycle → `setNewVisible(true)` somente quando `documentState.dirty` é falso → `EditorTextosPage` renderiza `EditorTextosNewTextDialog` quando `newVisible` é verdadeiro. O diálogo contém título, rádios, select, opções e botões `Cancela`/`Ok` em `EditorTextosDocumentDialogs.jsx`. A observação anterior mostrou um contêiner Novo após edição, mas a nova tentativa não produziu interação/snapshot válido; não é possível classificar como automação resolvida nem como bug de renderização.

### R5_STATIC_CONTRACT_CLOSURE

```text
EDITOR_TEXTOS_DIRTY_GUARD_AUDIT_R5_STATUS = INCOMPLETE
SAVE_GUARD_EXISTING_DOCUMENT_RUNTIME = UNPROVEN
SAVE_GUARD_NEW_DOCUMENT_RUNTIME = UNPROVEN
PENDING_ACTION_CONTINUATION_AFTER_SAVE = PROVEN_BY_STATIC_CONTRACT
SAVE_FAILURE_CONTRACT = PROVEN_BY_STATIC_CONTRACT
REACT_NEW_RUNTIME_STATIC_DISCREPANCY = STILL_UNPROVEN
LEGACY_EXISTING_SAVE_GUARD_HANDLER = editorTextosConfirmarDescartar (sem ramo Salvar)
LEGACY_EXISTING_SAVE_HANDLER = editorTextosSalvarAtual(false)
LEGACY_EXISTING_SAVE_SUCCESS = atualiza dados/identidade e alterado=false
LEGACY_EXISTING_SAVE_FAILURE = status/alert; mantém dirty; sem continuação
LEGACY_EXISTING_CONTINUATION = não existe após Save no guard; confirm true descarta
LEGACY_NEW_SAVE_GUARD_HANDLER = editorTextosConfirmarDescartar (sem ramo Salvar)
LEGACY_SAVE_AS_HANDLER = editorTextosSalvarComoAtual
LEGACY_NEW_DOCUMENT_CREATE_HANDLER = editorTextosSalvarAtual(true, nome)
LEGACY_NEW_SAVE_SUCCESS = cria identidade e alterado=false
LEGACY_NEW_SAVE_FAILURE = alert/status; mantém dirty; sem continuação
LEGACY_NEW_CONTINUATION = não existe após Save no guard
LEGACY_PENDING_ACTION_STORAGE = inexistente
LEGACY_CONTINUATION_TRIGGER = retorno booleano do confirm; não é Save
REACT_EXISTING_SAVE_HANDLER = saveDocument
REACT_SAVE_AS_HANDLER = saveDocumentAs
REACT_NEW_CREATE_API = editorTextosApi.createDocument
CONTRACT_CHAIN_COMPLETE = NÃO
UNPROVEN_DIRTY_GUARD_ITEMS = [
  SAVE_GUARD_EXISTING_DOCUMENT_RUNTIME,
  SAVE_GUARD_NEW_DOCUMENT_RUNTIME,
  REACT_NEW_RUNTIME_STATIC_DISCREPANCY
]
MATERIAL_DIRTY_GUARD_GAPS = [
  REACT_GUARD_MISSING_OR_INCONSISTENT,
  SAVE_FLOW_CONTRACT,
  PENDING_ACTION_COORDINATION,
  REACT_NEW_RUNTIME_STATIC_DISCREPANCY
]
READY_FOR_DIRTY_GUARD_IMPLEMENTATION = NÃO
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

## 11. R4 — fechamento dos cinco gaps remanescentes

### SAVE_GUARD_EXISTING_DOCUMENT_RUNTIME

`UNPROVEN`. O runtime legado confirmou o guard, mas a etapa `guard → Salvar → continuação` não foi executada com documento seguro identificado nesta rodada. O código legado prova o handler de salvamento existente (`editorTextosSalvarAtual`), o uso de `PUT /editor-textos/modelos/{id}` para identidade existente, inclusão de `pagina_config` e limpeza de dirty após resposta de sucesso. O React possui `saveDocument()` para documento com ID, mas não possui guard coordenador nem ponto de continuação.

### SAVE_GUARD_NEW_DOCUMENT_RUNTIME

`UNPROVEN`. O legado possui criação por `POST /editor-textos/modelos` e fluxo `editorTextosSalvarComoAtual()` com nome; o React exige `saveDocumentAs(name)` quando o documento não tem ID. Não foi executado o fluxo interativo completo dentro do guard, pois não havia recurso seguro previamente identificado para gravação.

`SAVE_AS_REQUIRED_FOR_NEW_DOCUMENT = SIM`.

### PENDING_ACTION_CONTINUATION_AFTER_SAVE

`UNPROVEN`. O legado usa o retorno booleano de `editorTextosConfirmarDescartar()` para permitir ou interromper a ação, mas não houve prova runtime de que Salvar dentro do guard retoma automaticamente Novo ou Abrir. No React não existe `pendingAction` nem continuação após sucesso.

Contrato recomendado para implementação posterior:

```text
pendingAction =
  { type: 'NEW' }
  | { type: 'OPEN_DOCUMENT', payload: { id } }
  | { type: 'LEAVE_EDITOR', payload: { route } }
  | null
```

O coordenador deve salvar, aguardar sucesso e então executar a intent; em erro deve manter documento/dirty e cancelar a continuação.

### REACT_NEW_RUNTIME_STATIC_DISCREPANCY

`STILL_UNPROVEN`. O código contém a checagem `if (!documentState.dirty) setNewVisible(true)`, enquanto a observação anterior mostrou o contêiner Novo após edição. A tentativa de nova interação nesta rodada não produziu uma observação válida do elemento, portanto não é possível distinguir entre caminho alternativo da toolbar, estado/rerender ou conteúdo vazio da janela de automação.

### SAVE_FAILURE_CONTRACT

`UNPROVEN` em runtime. Staticamente, o legado só limpa `alterado` após resposta bem-sucedida e o React mantém `dirty` quando `saveDocument()` captura erro. Não foi provocada falha de rede/API em recurso seguro. A fronteira necessária para implementação é: erro mantém documento e dirty, mostra erro e não executa ação pendente.

### R4_FINAL_CLOSURE

```text
EDITOR_TEXTOS_DIRTY_GUARD_AUDIT_R4_STATUS = INCOMPLETE
SAVE_GUARD_EXISTING_DOCUMENT_RUNTIME = UNPROVEN
SAVE_GUARD_NEW_DOCUMENT_RUNTIME = UNPROVEN
PENDING_ACTION_CONTINUATION_AFTER_SAVE = UNPROVEN
REACT_NEW_RUNTIME_STATIC_DISCREPANCY = STILL_UNPROVEN
SAVE_FAILURE_CONTRACT = UNPROVEN
LEGACY_EXISTING_SAVE_RUNTIME = "Handler e contrato estático conhecidos; continuação runtime não executada com segurança"
REACT_EXISTING_SAVE_RUNTIME = "saveDocument() atualiza por ID e limpa dirty no sucesso; sem guard/continuação"
LEGACY_NEW_SAVE_RUNTIME = "POST de criação e Save As com nome identificados; guard runtime não executado"
REACT_NEW_SAVE_RUNTIME = "saveDocument() não atende id ausente; saveDocumentAs(name) é o caminho disponível"
LEGACY_PENDING_NEW_CONTINUATION = UNPROVEN
LEGACY_PENDING_OPEN_CONTINUATION = UNPROVEN
REACT_NEW_ACTUAL_RUNTIME_BEHAVIOR = "Não revalidado nesta rodada; observação anterior mostrou contêiner Novo sem guard"
LEGACY_SAVE_FAILURE_BEHAVIOR = "Staticamente mantém dirty após erro; runtime não executado"
REACT_SAVE_FAILURE_CAPABILITY = "Mantém dirty e documento em saveDocument(); continuação pendente inexistente"
SAVE_AS_REQUIRED_FOR_NEW_DOCUMENT = SIM
REACT_GUARD_CURRENT_STATE = INCONSISTENT
UNPROVEN_DIRTY_GUARD_ITEMS = [
  SAVE_GUARD_EXISTING_DOCUMENT_RUNTIME,
  SAVE_GUARD_NEW_DOCUMENT_RUNTIME,
  PENDING_ACTION_CONTINUATION_AFTER_SAVE,
  REACT_NEW_RUNTIME_STATIC_DISCREPANCY,
  SAVE_FAILURE_CONTRACT
]
MATERIAL_DIRTY_GUARD_GAPS = [
  REACT_GUARD_MISSING_OR_INCONSISTENT,
  SAVE_FLOW_CONTRACT,
  PENDING_ACTION_COORDINATION
]
READY_FOR_DIRTY_GUARD_IMPLEMENTATION = NÃO
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

## 9. Fechamento cirúrgico R3

### SAVE_GUARD_EXISTING_DOCUMENT_RUNTIME

**Classificação:** `UNPROVEN`.

O código permite salvar documento existente por `saveDocument()`/`updateDocument(id, payload)` e limpa `dirty` somente após sucesso. Porém não existe, no React atual, um guard que capture a ação pendente, abra uma confirmação Brana e chame `saveDocument()` antes de continuar. O fluxo legado de Salvar dentro do confirm não foi executado em runtime com recurso seguro nesta rodada.

**SAVE_EXISTING_HANDLER:** legado `editorTextosSalvarAtual(false)`; React `saveDocument()`.

**SAVE_EXISTING_CONTINUATION_POINT:** não há continuação coordenada no React atual; no legado a continuação após o `window.confirm` não foi provada para o caminho Salvar.

### SAVE_GUARD_NEW_DOCUMENT_RUNTIME

**Classificação:** `UNPROVEN`.

No legado, `editorTextosSalvarAtual()` usa `POST /editor-textos/modelos` quando não há identidade atual e solicita nome quando necessário; `editorTextosSalvarComoAtual()` também solicita nome e chama o mesmo fluxo como novo. Isso prova a capacidade estática de criação, mas não prova o comportamento runtime específico `dirty → guard → Salvar → continuar ação`.

No React, `saveDocument()` não salva um documento sem `id`; o caminho disponível é `saveDocumentAs(name)`, que faz criação via API. Portanto, para documento novo, o guard futuro deverá encaminhar para Save As/nome antes de continuar.

**SAVE_AS_REQUIRED_FOR_NEW_DOCUMENT:** `SIM` no React atual.

### PENDING_ACTION_CONTINUATION_AFTER_SAVE

**Classificação:** `UNPROVEN`.

Os callers legados observados usam o retorno booleano do confirm para prosseguir ou parar. Não foi comprovado por execução segura que um salvamento bem-sucedido de documento dirty retoma automaticamente Novo, Abrir ou saída. No React atual não há `pendingAction` nem callback de continuação.

### Arquitetura React recomendada

```text
pendingAction =
  { type: 'NEW' }
  | { type: 'OPEN_DOCUMENT', payload: { id } }
  | { type: 'LEAVE_EDITOR', payload: { route } }
  | null
```

O owner recomendado é um coordenador do domínio do Editor, composto pelo lifecycle e pela integração explícita da navegação. Os intercept points são `Novo`, `Abrir` antes do diálogo/substituição, abertura de documento selecionado e saída do módulo. Após sucesso de Save/Save As, o coordenador executa a intent; após falha, mantém documento e dirty e não executa a intent; Cancelar limpa apenas a intent.

### REACT_NEW_RUNTIME_STATIC_DISCREPANCY

**Classificação:** `STILL_UNPROVEN`.

O código de `useEditorDocumentLifecycle` contém `if (!documentState.dirty) setNewVisible(true)`, mas a observação anterior do runtime mostrou o contêiner Novo depois de uma edição. Não foi possível concluir se isso é efeito de timing/estado, caminho alternativo da toolbar ou conteúdo invisível. O fato objetivo é que não apareceu um guard React Brana/nativo equivalente ao legado.

### Estado atual do guard React

`REACT_GUARD_CURRENT_STATE = INCONSISTENT`.

| Ação | Dirty check | Comportamento atual |
|---|---:|---|
| Novo | Existe no handler estático | Runtime não apresentou guard; discrepância não resolvida |
| Abrir | `showOpen()` retorna sem abrir quando dirty | Bloqueio silencioso, sem modal e sem Save/Cancel |
| Sair do módulo | Não existe integração de guard na navegação | Desmontagem da página pode perder estado local |

### Browser unload

`BROWSER_UNLOAD_CONTRACT = PROVEN` como fronteira conhecida: o legado possui `beforeunload` apenas para liberar o lock da aba standalone; essa função não consulta `editorTextosCfg.alterado` e não apresenta proteção de alterações. Não foi identificado mecanismo React de dirty para `beforeunload`.

`BROWSER_UNLOAD_NATIVE_LIMITATION = PROVEN`: confirmação de fechamento/refresh, quando desejada, depende do mecanismo nativo do navegador e é separada do modal React para navegação SPA. Isso não autoriza usar confirm nativo em Novo/Abrir.

### Falha de salvamento

`SAVE_FAILURE_CONTRACT = UNPROVEN` em runtime comparativo. Staticamente, ambos os fluxos mantêm o documento e não limpam dirty quando a request falha; contudo não foi executado um cenário seguro que force erro e confirme a experiência completa. O contrato futuro deve manter documento, dirty e intent quando o save falhar, exibindo erro e sem continuar a ação.

## 10. Registro R3

```text
EDITOR_TEXTOS_DIRTY_GUARD_AUDIT_R3_STATUS = INCOMPLETE
SAVE_GUARD_EXISTING_DOCUMENT_RUNTIME = UNPROVEN
SAVE_GUARD_NEW_DOCUMENT_RUNTIME = UNPROVEN
PENDING_ACTION_CONTINUATION_AFTER_SAVE = UNPROVEN
REACT_NEW_RUNTIME_STATIC_DISCREPANCY = STILL_UNPROVEN
BROWSER_UNLOAD_CONTRACT = PROVEN
SAVE_FAILURE_CONTRACT = UNPROVEN
SAVE_AS_REQUIRED_FOR_NEW_DOCUMENT = SIM
REACT_GUARD_CURRENT_STATE = INCONSISTENT
DIRTY_GUARD_OWNER = EditorTextosPage + useEditorDocumentLifecycle + navigation coordinator
DIRTY_GUARD_INTERCEPT_POINTS = [NEW, OPEN_DIALOG, OPEN_DOCUMENT, LEAVE_EDITOR]
RECOMMENDED_PENDING_ACTION_ARCHITECTURE = tagged pendingAction intent with save-success continuation
UNPROVEN_DIRTY_GUARD_ITEMS = [
  SAVE_GUARD_EXISTING_DOCUMENT_RUNTIME,
  SAVE_GUARD_NEW_DOCUMENT_RUNTIME,
  PENDING_ACTION_CONTINUATION_AFTER_SAVE,
  REACT_NEW_RUNTIME_STATIC_DISCREPANCY,
  SAVE_FAILURE_CONTRACT
]
MATERIAL_DIRTY_GUARD_GAPS = [
  REACT_GUARD_MISSING_OR_INCONSISTENT,
  SAVE_FLOW_CONTRACT,
  PENDING_ACTION_COORDINATION
]
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
CSS_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_DIRTY_GUARD_IMPLEMENTATION = NÃO
```

## 8. Registro final

```text
EDITOR_TEXTOS_DIRTY_GUARD_AUDIT_R2_STATUS = INCOMPLETE
LEGACY_DIRTY_NEW_GUARD = PASS
LEGACY_DIRTY_OPEN_GUARD = PASS
LEGACY_PAGECONFIG_MARKS_DIRTY = SIM
LEGACY_PAGECONFIG_USES_SAME_GUARD = SIM
LEGACY_MODULE_EXIT_GUARD = SIM
LEGACY_CANCEL_PRESERVES_DOCUMENT = PASS
LEGACY_GUARD_MESSAGE = "Existem alteracoes nao salvas. Deseja descartar?"
LEGACY_GUARD_BUTTONS = ["OK (descartar)", "Cancelar"]
CURRENT_NATIVE_CONFIRM_PRESENT = NÃO
DIRTY_STATE_OWNER = useEditorDocumentLifecycle.documentState
DIRTY_FIELD = dirty
SAVE_BUTTON_FUNCTIONAL = PARTIAL
SAVE_EXISTING_DOCUMENT_CONTRACT = PROVEN
NEW_UNSAVED_DOCUMENT_SAVE_CONTRACT = UNPROVEN
SAVE_AS_REQUIRED_FOR_NEW_DOCUMENT = SIM
MODULE_EXIT_GUARD_REQUIRED = SIM
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
