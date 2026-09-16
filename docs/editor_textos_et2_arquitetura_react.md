# Brana Cloude — Editor de Textos — ET2

## Arquitetura React, matriz de migração e seleção tecnológica

Status: documento arquitetural; nenhuma implementação da feature foi feita.

## 1. Princípios

- A ET1 é a fonte de verdade funcional e contratual.
- O legado define o que o sistema faz; não define a arquitetura React.
- O backend, os endpoints, os modelos, os tokens, o HTML persistido e a
  persistência existente devem ser reutilizados.
- A implementação será modular, declarativa, testável e compatível com o shell
  Brana Cloude.
- Nenhuma mudança de banco, API, Vite ou frontend legado faz parte da ET2.

## 2. Contrato legado versus implementação moderna

| Camada | Decisão |
|---|---|
| Contrato funcional | Preservar comandos, fluxos, estados, diálogos, PDF, impressão, assinatura, modelos, permissões e resultado visível auditados na ET1. |
| Implementação legada | Usar como evidência de comportamento; não copiar `app.js`, montagem imperativa de DOM ou estado global. |
| Implementação React | Componentes, hooks, serviços, adapters, estado de domínio e engine isolada por interface. |
| Persistência | Continuar enviando o contrato atual de modelos/documentos; não introduzir formato de banco específico da engine. |

## 3. Matriz de migração

| LEGACY_CAPABILITY | FUNCTIONAL_CONTRACT | LEGACY_IMPLEMENTATION | REACT_STRATEGY | DECISION |
|---|---|---|---|---|
| Novo | criar documento no tipo selecionado e respeitar dirty state | diálogo e estado global legado | `newDocument` command + `NewDocumentDialog` | REIMPLEMENT_IN_REACT |
| Abre | listar, selecionar e carregar modelo existente | modal + API de modelos | `modelService` + `OpenDocumentDialog` | REUSE_VIA_ADAPTER |
| Salvar | persistir conteúdo, tipo, nome e estado limpo | `requestJson` + modelo | command idempotente + API adapter | REUSE_VIA_ADAPTER |
| Salvar Como | criar novo modelo sem alterar o original | handler compartilhado | command separado usando o mesmo service | REIMPLEMENT_IN_REACT |
| Fonte/tamanho/cor | alterar formatação da seleção | comandos do editor legado | toolbar → `EditorEngineAdapter` | REIMPLEMENT_WITH_MODERN_ENGINE |
| Negrito/itálico/sublinhado | aplicar/remover marca | comandos de edição | extensions/commands da engine | REIMPLEMENT_WITH_MODERN_ENGINE |
| Alinhamento/listas/recuos | preservar efeito no conteúdo | comandos e estilos HTML | extensions + adapter de estilo | REIMPLEMENT_WITH_MODERN_ENGINE |
| Régua | exibir escala, margens, tabulações e recuos sincronizados | DOM/régua imperativa | componente React + `EditorSelectionAdapter` | CUSTOM_REACT_COMPONENT |
| Merge fields | inserir exatamente os 107 tokens existentes | diálogo/registry legado | `MergeFieldSelector` + token adapter | REIMPLEMENT_IN_REACT |
| Página/margens/orientação | manter configuração comprovada | estado e diálogo de página | `PageWorkspace` + `PageSetupDialog` | CUSTOM_REACT_COMPONENT |
| Imprime | produzir o resultado de impressão do documento | browser print flow | `printService` + print CSS/iframe | BROWSER_NATIVE |
| Configura impressora | respeitar limitação do browser | seleção/configuração limitada | representar limitação sem prometer controle nativo | BROWSER_NATIVE |
| Exportar PDF | usar o contrato PDF existente | endpoint/serviço legado | `pdfService` | BACKEND_ONLY_REUSE |
| Assinar PDF | PFX/P12, PAdES, pyHanko, timestamp e auditoria | fluxo backend | `signatureService` + diálogo React | BACKEND_ONLY_REUSE |
| Undo/redo | desfazer/refazer operações do editor | engine/estado legado | engine history isolada por adapter | REIMPLEMENT_WITH_MODERN_ENGINE |
| Clipboard | paste/copy/cut conforme suporte do editor | eventos browser | engine + normalizer de HTML colado | BROWSER_NATIVE |
| Diálogos | preservar campos, validações e fluxos dos 13 diálogos | overlays imperativos | componentes separados por contrato | CUSTOM_REACT_COMPONENT |
| Modelos | preservar os 8 tipos e seus consumidores | endpoints/modelos | `modelService` e `ModelSelector` | REUSE_VIA_ADAPTER |
| Preferências | consumir seleção de modelos sem acoplamento visual | integração legada | contrato de domínio/API | REUSE_VIA_ADAPTER |

## 4. Engine do editor

### Inventário local

`frontend-react/package.json` já contém React 19.1 e Tiptap 3.30.5, incluindo
`@tiptap/react`, StarterKit, cor, tabela, alinhamento, texto e sublinhado. Não
foram instaladas dependências nesta etapa.

### Comparação

| Critério | Tiptap 3 | Lexical | CKEditor 5 | Contenteditable próprio |
|---|---|---|---|---|
| React | integração existente no projeto | integração React forte | integração React oficial | manual |
| HTML import/export | possível via serializer/parser e extensions | possível, exige conversores | forte, com schema próprio | direto, mas frágil |
| Marcas/comandos | extensions e commands | nodes/commands | plugins/schema | implementação manual |
| Tabelas/listas/cores/alinhamento | já há extensões locais para parte do contrato | extensões próprias | amplo, mas avaliar licença | manual |
| Merge fields | custom inline node/mark possível | custom node possível | plugin/modelo customizável | texto/DOM manual |
| Régua/página | fica fora da engine, isolável por adapter | fica fora da engine | fica fora ou depende de plugins | mistura editor e layout |
| Undo/redo/seleção | primitives da engine + adapter | primitives próprias | maduras | responsabilidade da aplicação |
| Compatibilidade HTML legado | requer PoC e `LegacyHtmlAdapter` | requer conversores e PoC | requer schema/GHS e PoC | preserva HTML, mas amplia risco de segurança |
| Acessibilidade/manutenção | boa base; responsabilidade da composição | boa base; maior investimento de integração | madura; avaliar custo/licença | maior risco operacional |
| Licença | MIT para os pacotes usados, confirmar versão/licenças no lockfile | MIT, confirmar versão/licenças | GPL ou comercial conforme distribuição/features | sem licença de engine, alto custo interno |
| Bundle/vendor lock-in | moderado e já parcialmente assumido | nova família de dependências | potencialmente alto | baixo em dependência, alto em manutenção |
| SSR | avaliar somente se rota usar SSR | avaliar | avaliar | browser-dependent |

### Decisão

```text
RECOMMENDED_EDITOR_ENGINE = Tiptap 3 via EditorEngineAdapter
SECOND_CHOICE = Lexical, somente se a PoC demonstrar melhor roundtrip e seleção
EDITOR_ENGINE_POC_REQUIRED = SIM
```

Tiptap é a recomendação inicial porque já está presente no frontend React e as
extensões essenciais já fazem parte do contrato de dependências local. Isso não
é aprovação automática da engine: a PoC deve provar HTML legado, estilos,
tokens, seleção, régua e roundtrip. CKEditor 5 fica condicionado a decisão de
licença: a documentação oficial indica GPL para a distribuição open source e
licença comercial para cenários incompatíveis ou recursos premium. Contenteditable
próprio é rejeitado como implementação principal por repetir o risco do legado.

### PoC futura

```text
POC_OBJECTIVES = [
  "abrir HTML legado real sanitizado e preservar tags/styles suportados",
  "salvar e reabrir sem perda funcional",
  "preservar os tokens dos 107 merge fields",
  "seleção/Range e toolbar",
  "régua sincronizada com parágrafo, recuo e margens",
  "página, print CSS e exportação pelo backend",
  "paste/copy/cut e undo/redo"
]
```

## 5. Compatibilidade HTML

### LegacyHtmlAdapter

Contrato conceitual:

```text
deserializeLegacyHtml(html) -> DomainDocumentContent
normalizeLegacyHtml(content) -> DomainDocumentContent
serializeToLegacyHtml(content) -> string
preserveMergeFields(html/content) -> content
preserveSupportedStyles(html/content) -> content
reportUnsupportedMarkup(html) -> CompatibilityReport
```

O adapter deve ser o único ponto que conhece diferenças entre HTML persistido
e o modelo interno da engine. Não deve alterar a sintaxe dos tokens. Scripts,
atributos perigosos e HTML não suportado devem gerar relatório e seguir a
política de segurança aprovada; não devem ser silenciosamente descartados.

Critério futuro obrigatório:

```text
LEGACY_HTML -> LOAD -> EDIT -> SAVE -> RELOAD
LEGACY_HTML_ROUNDTRIP = PASS
```

## 6. Arquitetura modular proposta

```text
frontend-react/src/features/editorTextos/
  EditorTextosPage.jsx
  EditorTextosShell.jsx
  api/
    editorTextosApi.js
    modelApi.js
    pdfApi.js
    signatureApi.js
  commands/
    documentCommands.js
    formattingCommands.js
    mergeFieldCommands.js
  components/
    PrimaryEditorToolbar.jsx
    FormatToolbar.jsx
    EditorCanvas.jsx
    EditorStatusBar.jsx
    ModelSelector.jsx
  dialogs/
    OpenDocumentDialog.jsx
    NewDocumentDialog.jsx
    MergeFieldDialog.jsx
    TableDialog.jsx
    PageSetupDialog.jsx
    ImageDialog.jsx
    SignatureDialog.jsx
    dialogContracts.js
  editor/
    EditorEngineAdapter.js
    TiptapEngineAdapter.js
    EditorSelectionAdapter.js
    editorExtensions.js
  ruler/
    Ruler.jsx
    rulerModel.js
    rulerCommands.js
  page/
    PageWorkspace.jsx
    pageConfig.js
    pageLayout.js
  hooks/
    useEditorDocument.js
    useEditorSelection.js
    useDirtyDocument.js
    useEditorOperations.js
  model/
    documentModel.js
    editorState.js
    pageModel.js
    mergeFieldModel.js
  services/
    documentService.js
    pdfService.js
    printService.js
    signatureService.js
    compatibilityService.js
  adapters/
    LegacyHtmlAdapter.js
    BackendDocumentAdapter.js
    PreferencesAdapter.js
  constants/
    editorCommands.js
    modelTypes.js
    mergeFieldCategories.js
  styles/
    editorTextos.css
    editorPage.css
    editorRuler.css
```

### Regras de dependência

- `model` não importa UI, DOM ou engine.
- `api` conhece apenas transporte e payloads.
- `services` orquestram operações, mas não renderizam DOM.
- `editor` isola Tiptap e seleção.
- `components` usam hooks/commands; não fazem `fetch` direto.
- `dialogs` recebem contratos e callbacks; não conhecem detalhes da engine.
- `ruler` comunica por `EditorSelectionAdapter`/`RulerCommands`.
- `page` contém layout e configuração de página, não assinatura/PDF.
- `EditorTextosPage` apenas compõe providers, shell e feature layout.

## 7. Estado

### Document domain state

```text
DocumentModel = {
  id,
  name,
  type,
  content,
  pageConfig,
  metadata
}
```

Somente campos comprovados pela ET1 devem ser materializados. O estado React
separa:

| Estado | Conteúdo |
|---|---|
| Editor internal | engine instance, selection, history, active marks |
| Document domain | id, name, type, content, pageConfig, metadata, dirty |
| UI | dialog aberto, loading local, toolbar/menu, focus |
| Server | modelos, requests pendentes, erros e respostas |

`dirty` torna-se verdadeiro após alteração efetiva do conteúdo/configuração;
volta a falso após abrir/carregar com snapshot estabelecido, salvar ou salvar
como concluído. Novo, abrir e fechar devem usar a confirmação de alterações não
salvas auditada na ET1.

## 8. Command architecture

Comandos de documento: `newDocument`, `openDocument`, `saveDocument`,
`saveDocumentAs`, `exportPdf`, `printDocument`, `pageSetup`, `printerSetup` e
`signPdf`.

Comandos de editor: fonte, tamanho, cor, negrito, itálico, sublinhado,
alinhamento, listas, recuos, tabela, imagem e merge field. Componentes chamam
commands; commands chamam adapters/services.

## 9. Toolbars e layout

### Barra horizontal primária congelada

```text
[ NOVO | ABRE | SALVAR | SALVAR COMO | EXPORTAR PDF | IMPRIME |
  CONFIGURA PÁGINA | CONFIGURA IMPRESSORA | ASSINAR PDF ]
```

### Toolbar de formatação

Separada da barra primária: fonte, tamanho, cor, negrito, itálico,
sublinhado, alinhamentos, listas, recuos e inserção de merge field.

### Espaço visual

```text
Brana shell/sidebar
  → primary toolbar
  → format toolbar
  → ruler
  → page workspace
  → page/editor canvas
  → dialogs/overlays
```

## 10. Régua e página

`Ruler` é um componente React controlado por `RulerState` e
`RulerCommands`. `EditorSelectionAdapter` fornece parágrafo/seleção; a régua
converte px/mm/pt conforme `PageConfig`, margens e largura da página. Drag,
recuo de primeira linha, recuo pendente, tabulações e indicadores só serão
habilitados depois da PoC comprovar a capacidade da engine.

`PageWorkspace` controla papel, orientação, dimensões, margens, scroll e
print mapping. Não inventa paginação múltipla onde a ET1 não a comprovou.

## 11. Merge fields

`MergeFieldSelector` consome o registry/adapter dos 107 tokens auditados.
`InsertMergeFieldCommand` insere o token no formato legado, sem criar nova
sintaxe. O token deve sobreviver a load, edição, save e reload. A engine pode
usar inline node internamente, desde que o adapter serialize para o token
legado.

## 12. Diálogos

Os 13 diálogos serão componentes independentes. `dialogContracts.js` descreve
campos, validações, sucesso, cancelamento, erro e fechamento conforme ET1.
Um coordinator pode controlar abertura, mas não conter toda a lógica dos
diálogos. Page setup, assinatura, abrir, novo, merge, tabela e imagem mantêm
responsabilidades separadas.

## 13. API, PDF, impressão e assinatura

- `editorTextosApi` preserva método, path, payload e resposta dos endpoints.
- `pdfService` chama o fluxo backend existente; não duplica geração no browser.
- `printService` aplica configuração de página/print CSS e abre o diálogo
  nativo do browser; não promete escolher impressora física via web.
- `signatureService` orquestra PFX/P12, PAdES, pyHanko, timestamp e auditoria
  através do backend existente.
- `PreferencesAdapter` consome modelos/preferências sem acoplar componentes.

## 14. Outros comandos

| COMMAND | LEGACY_LOCATION | REACT_CANDIDATE_LOCATION | REQUIRES_USER_DECISION |
|---|---|---|---|
| imagem | toolbar/dialog | `FormatToolbar` + `ImageDialog` | NÃO |
| tabela | toolbar/dialog | `FormatToolbar` + `TableDialog` | NÃO |
| merge field | toolbar/dialog | `MergeFieldSelector` | NÃO |
| menu contextual da tabela/modelo | menu legado | `ModelSelector`/dialog actions | SIM, posição visual |
| atalhos específicos | listeners legados | `commands` + engine keymap | SIM, se houver conflito |

## 15. Testes planejados

- Unit: normalizers, page model, merge-field registry, command payloads.
- Component: toolbar, diálogos, régua, dirty state, keyboard focus.
- API contract: método/path/payload/resposta de cada endpoint reutilizado.
- Legacy HTML compatibility: fixtures sanitizadas e roundtrip.
- Integration: abrir→editar→salvar→reabrir; PDF; impressão; assinatura.
- Visual: página, régua, toolbar, modal, viewport estreito.
- Runtime: somente na homologação controlada, sem alterar dados reais.

## 16. Riscos e mitigação

| RISK | IMPACT | MITIGATION | POC_REQUIRED |
|---|---|---|---|
| HTML roundtrip | perda de conteúdo/estilo | `LegacyHtmlAdapter` + fixtures | SIM |
| seleção/régua | comando aplicado no lugar errado | `EditorSelectionAdapter` + testes | SIM |
| merge fields | token quebrado | inline node/serializer dedicado | SIM |
| fontes/recuos | impressão divergente | normalização de estilos + print fixtures | SIM |
| página/print | layout diferente | `PageConfig` único e visual tests | SIM |
| clipboard | HTML colado inseguro/incompatível | sanitizer/normalizer explícito | SIM |
| assinatura | regressão criptográfica | backend-only reuse + contract tests | NÃO, salvo mudança de contrato |
| licença da engine | risco jurídico/custo | validar lockfile e licença antes de instalar | SIM |
| bundle | carregamento pesado | lazy route e medir build | NÃO nesta etapa |

## 17. Plano de implementação futuro

| Fase | Escopo | Saída |
|---|---|---|
| ET3A | shell, rota e feature boundary | entrada sem editor funcional |
| ET3B | engine adapter + PoC aprovada | carregar conteúdo fixture |
| ET3C | document lifecycle/API/dirty | novo/abrir/salvar/salvar como |
| ET3D | format toolbar e selection adapter | comandos básicos |
| ET3E | merge fields | 107 tokens preservados |
| ET3F | régua e página | layout/seleção/print mapping |
| ET3G | diálogos | 13 contratos migrados |
| ET3H | PDF e impressão | fluxos backend/browser |
| ET3I | assinatura | PFX/P12/PAdES via backend |
| ET3J | integração/homologação | comparação funcional e roundtrip |

Cada fase deve ter escopo, arquivos, testes e critérios de saída próprios. Não
será feito big bang.

## 18. Decisões e limites desta ET2

```text
LEGACY_FUNCTIONAL_CONTRACT_MAPPED_TO_REACT = PASS
EDITOR_ENGINE_EVALUATION = PASS
EDITOR_ENGINE_RECOMMENDATION_DEFINED = SIM
LEGACY_HTML_COMPATIBILITY_STRATEGY = PASS
MERGE_FIELD_COMPATIBILITY_STRATEGY = PASS
EDITOR_ENGINE_ADAPTER = DEFINED
EDITOR_SELECTION_ADAPTER = DEFINED
RULER_ARCHITECTURE = PASS
PAGE_ARCHITECTURE = PASS
FORMAT_TOOLBAR_ARCHITECTURE = PASS
PRIMARY_TOOLBAR_ARCHITECTURE = PASS
DIALOG_ARCHITECTURE = PASS
API_ARCHITECTURE = PASS
PDF_ARCHITECTURE = PASS
PRINT_ARCHITECTURE = PASS
SIGNATURE_ARCHITECTURE = PASS
BACKEND_CHANGES_REQUIRED = NÃO
DATABASE_CHANGES_REQUIRED = NÃO
MODULAR_ARCHITECTURE = PASS
MONOLITH_AVOIDANCE = PASS
IMPLEMENTATION_PHASE_PLAN = PASS
MATERIAL_ARCHITECTURAL_GAPS = [PoC de roundtrip HTML, seleção/régua, tokens e print]
FUNCTIONAL_CODE_CHANGED = NÃO
FRONTEND_REACT_CHANGED = NÃO
LEGACY_FRONTEND_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
RUNTIME_CHANGED = NÃO
VITE_CHANGED = NÃO
DEPENDENCY_INSTALLED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_EDITOR_TEXTOS_IMPLEMENTATION = DEPENDS_ON_POC
EDITOR_TEXTOS_ET2_STATUS = COMPLETE
```

ET2 é considerada completa como arquitetura, mas a implementação só pode
começar depois da PoC de compatibilidade e da revisão do usuário.
