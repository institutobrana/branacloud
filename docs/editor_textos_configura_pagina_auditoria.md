# Editor de Textos — auditoria forense de Configura página

## Status e escopo

Esta rodada foi somente investigação read-only. Não houve alteração de React, frontend legado, backend, banco, dependências, Vite ou runtime.

**Resultado:** `INCOMPLETE`, porque a própria auditoria ET1 registra que a equivalência física completa e a lista completa de opções de papel ainda não estão fechadas. Os fatos confirmados estão separados dos itens ainda não provados.

Fontes consultadas:

- `docs/editor_textos_et1_auditoria_forense_integral.md`, especialmente R9-DLG-001 a R9-DLG-004 e a seção de gaps;
- `docs/editor_textos_et2_arquitetura_react.md`;
- `docs/editor_textos_et2_poc_engine.md`;
- `frontend/js/modules/editor_textos_bootstrap.js`;
- `frontend/app.js`;
- `backend/routes/editor_textos_routes.py`;
- `backend/services/editor_pdf_service.py`;
- `frontend-react/src/features/editorTextos/` e `frontend-react/src/features/editorTextos/ruler/` para comparação arquitetural.

## Arquitetura legada comprovada

O modal é criado por `ensureShell()` em `frontend/js/modules/editor_textos_bootstrap.js`, dentro de `#editor-textos-pagina-backdrop`, com o container `.editor-textos-pagina-modal`. O HTML tem header, grupo de campos e footer de ações.

O botão principal é `#editor-textos-btn-pagina`. O fluxo de abertura é:

```text
botão Página
→ editorTextosPaginaAtual()
→ editorTextosAbrirModalPagina()
→ editorTextosSincronizarModalPagina()
→ editorTextosAbrirOverlayGlobal(backdrop, 9050)
→ foco + seleção em Margem superior
```

O fluxo de confirmação é:

```text
OK
→ editorTextosConfirmarConfigurarPagina()
→ parse/normalização dos campos
→ validação margem esquerda + margem direita < largura - 10
→ editorTextosCfg.paginaConfig = PageConfig
→ editorTextosAplicarConfiguracaoPagina(true)
→ atualizar página/régua
→ dirty = true
→ fechar modal
```

Cancelar e clique no backdrop chamam `editorTextosFecharModalPagina()`, que somente adiciona `hidden`. Não há restauração explícita porque os campos são sincronizados a partir de `paginaConfig` ao abrir e o estado principal só é gravado no OK.

## Inventário de controles

| Control ID | Tipo | Label | Visível | Habilitado | Readonly | Default/valor inicial | Source | Eventos/handler |
|---|---|---|---|---|---|---|---|---|
| `editor-textos-pagina-tipo` | select | Tipo do papel | sim | sim | não | `Definido pelo usuário` | `EDITOR_TEXTOS_PAGE_DEFAULT`, normalização | `change → editorTextosPaginaTrocarTipoPapel` |
| `editor-textos-pagina-orientacao` | select | Orientação | sim | sim | não | `Retrato` | PageConfig/default | `change → editorTextosPaginaTrocarOrientacao` |
| `editor-textos-pagina-altura` | text input decimal | Altura | sim | visualmente readonly por class `readonly` | sim no HTML/CSS legado | `279,40` | PageConfig/default/preset | lido no OK |
| `editor-textos-pagina-largura` | text input decimal | Largura | sim | visualmente readonly por class `readonly` | sim no HTML/CSS legado | `215,90` | PageConfig/default/preset | lido no OK |
| `editor-textos-pagina-margem-superior` | text input decimal | Margem superior | sim | sim | não | `25,40` | PageConfig/default | lido no OK |
| `editor-textos-pagina-margem-esquerda` | text input decimal | Margem esquerda | sim | sim | não | `33,16` | PageConfig/default | lido no OK |
| `editor-textos-pagina-margem-direita` | text input decimal | Margem direita | sim | sim | não | `33,16` | PageConfig/default | lido no OK |
| `editor-textos-pagina-ok` | button | Ok | sim | sim | não | — | bootstrap | click → confirmação |
| `editor-textos-pagina-cancelar` | button | Cancela | sim | sim | não | — | bootstrap | click → fechar |

`BOTTOM_MARGIN_PRESENT = PROVEN_ABSENT` no contrato do modal: não existe controle `pagina-margem-inferior` nem campo inferior no PageConfig legado. O PDF backend, porém, usa a margem superior também como bottom margin; isso é uma regra de renderer, não um controle do modal.

## Presets e papel

| Internal value | Label | Largura | Altura | Dimensões editáveis | Orientação padrão | Source/efeito |
|---|---|---:|---:|---|---|---|
| `A4` | A4 | 210 mm | 297 mm | não comprovado como editável; inputs têm class readonly | Retrato | preset `EDITOR_TEXTOS_PAGE_PAPER_PRESETS`; troca dimensões |
| `Carta` | Carta | 215,9 mm | 279,4 mm | não comprovado como editável | Retrato | preset; troca dimensões |
| `Receituário` | Receituário | 148 mm | 210 mm | não comprovado como editável | Retrato | preset; troca dimensões |
| `Definido pelo usuário` | Definido pelo usuário | 215,9 mm | 279,4 mm | intenção aparente de permitir customização, mas não fechada | Retrato | default e fallback |

`PAPER_TYPES = [A4, Carta, Receituário, Definido pelo usuário]` é a lista encontrada no código legado. Não foi encontrada outra opção no trecho de criação do modal. A auditoria ET1, contudo, marca a lista completa como não fechada; portanto não é seguro afirmar que estes são todos os valores históricos aceitos fora deste código.

Ao mudar papel, `editorTextosPaginaTrocarTipoPapel()` carrega as dimensões do preset e faz swap se a orientação atual for Paisagem. Ao mudar orientação, `editorTextosPaginaTrocarOrientacao()` troca altura e largura atuais. Não há reset de margens no código localizado.

## Orientação

Valores comprovados: `Retrato` e `Paisagem`. A normalização aceita somente a string case-insensitive `paisagem`; qualquer outro valor resulta em `Retrato`.

O efeito é efetivo: a mudança troca altura e largura no draft do modal e, após OK, o PageConfig normalizado orienta a página e o renderer PDF. Não há evidência de que o tipo de papel seja alterado automaticamente ao trocar orientação.

## Números, unidade e parsing

`PAGE_SETUP_UNIT = mm`.

O formatter é `toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false })`, produzindo vírgula decimal e duas casas, por exemplo `279,40`.

O parser:

- remove espaços;
- se houver ponto e vírgula, remove pontos de milhar e troca vírgula por ponto;
- se houver somente vírgula, troca por ponto;
- aplica `Number()`;
- em valor não finito usa fallback.

Normalização:

- altura/largura: mínimo `50 mm`;
- margens: mínimo `0 mm`;
- valores legados de altura/largura entre `1000` e `10000` são divididos por 10;
- valores legados de margem entre `200` e `2000` são divididos por 10;
- backend arredonda PageConfig para duas casas.

Conversões comprovadas:

```text
mm → px: 96 / 25.4
mm → régua: mm / 10, com unidades da régua baseadas em cm
mm → PDF: reportlab/lib conversion via `mm`
```

## Validações

| Validation ID | Condição | Mensagem | Trigger | Bloqueia OK | Normalização |
|---|---|---|---|---|---|
| PAGE-VAL-01 | altura inválida/vazia | não há mensagem específica localizada | leitura no OK | não; usa fallback/mínimo | `Number`, fallback, min 50 |
| PAGE-VAL-02 | largura inválida/vazia | não há mensagem específica localizada | leitura no OK | não; usa fallback/mínimo | `Number`, fallback, min 50 |
| PAGE-VAL-03 | margem inválida/vazia | não há mensagem específica localizada | leitura no OK | não; usa fallback/mínimo | `Number`, fallback, min 0 |
| PAGE-VAL-04 | esquerda + direita >= largura - 10 | “As margens esquerda e direita excedem a largura da página.” | click OK | sim | permanece no modal |
| PAGE-VAL-05 | tipo/orientação desconhecidos | não há mensagem específica | normalização | não | tipo cai no default; orientação cai em Retrato |

Não foi localizado limite superior explícito para altura, largura ou margens. Não foi localizada validação específica para margem maior que altura, zero, texto não numérico ou compatibilidade física entre preset e orientação além das normalizações descritas.

## Estado, Cancelar, foco e live preview

Ao abrir, a fonte é `editorTextosCfg.paginaConfig`, que já foi carregada do documento ou recebeu `EDITOR_TEXTOS_PAGE_DEFAULT`. A cadeia é:

```text
open dialog → paginaConfig atual → normalize → preencher controles
```

`PAGE_SETUP_LIVE_PREVIEW = NÃO`: alterações nos campos do modal não chamam aplicação de página nem renderização da régua. Preset/orientação alteram apenas os valores do draft dos controles. A aplicação ocorre somente após OK.

Cancelar fecha o overlay sem chamar `editorTextosAplicarConfiguracaoPagina` e sem marcar dirty. Escape é tratado no listener do backdrop e fecha o modal; não aplica PageConfig.

Ao abrir, `Margem superior` recebe foco e seleção do texto.

## PageConfig real

O contrato comprovado contém exatamente estes campos:

```json
{
  "tipo_papel": "A4 | Carta | Receituário | Definido pelo usuário",
  "orientacao": "Retrato | Paisagem",
  "altura_mm": 279.4,
  "largura_mm": 215.9,
  "margem_superior_mm": 25.4,
  "margem_esquerda_mm": 33.16,
  "margem_direita_mm": 33.16
}
```

Não existe `margem_inferior_mm` no PageConfig normalizado do frontend/backend.

`PAGE_CONFIG_PER_DOCUMENT = SIM`: a configuração é carregada de `pagina_config` na metadata `.editor.json` associada ao arquivo do modelo. Se ausente, usa o default. A resposta de abertura inclui `pagina_config`.

## Persistência, API e banco

Não há endpoint separado para configuração de página. Ela viaja dentro do payload documental:

| Method | Path | Payload | Uso |
|---|---|---|---|
| POST | `/modelos` | `pagina_config` em `ModeloTextoSalvarPayload` | criação/save-as |
| PUT | `/modelos/{modelo_id}` | `pagina_config` em `ModeloTextoSalvarPayload` | salvar |
| GET/load | endpoint de leitura do modelo | resposta `pagina_config` | reabrir |
| POST | `/exportar-pdf` | `pagina_config` em `ExportarPdfPayload` | PDF |
| POST multipart | assinatura com `use_editor_content` | `pagina_config_json` | PDF assinado a partir do editor |

O backend grava `pagina_config` em arquivo sidecar `<arquivo>.<ext>.editor.json` através de `_save_editor_meta()`. Não foi localizada coluna SQL específica, migration ou tabela para PageConfig.

`PAGE_DATABASE_AUDIT = PASS`: persistência física é metadata de arquivo, não banco. A rota continua protegida por autenticação/tenant conforme o contrato existente.

## Página, workspace e régua

Após OK, `editorTextosAplicarConfiguracaoPagina(true)`:

- largura da página: `max(360, round(largura_mm * 96/25.4)) px`;
- min-height: `max(480, round(altura_mm * 96/25.4)) px`;
- padding-top e padding-bottom usam `margem_superior_mm` em px;
- unidades da régua derivam da largura em cm;
- marcador esquerdo deriva de `margem_esquerda_mm / 10`;
- marcador direito deriva de `unidades - margem_direita_mm / 10`;
- tabs são limitadas entre os marcadores.

Fluxo:

```text
PageConfig → page.style.width/minHeight/padding → rulerUnits/rulerState → renderRuler
```

`margem_esquerda_mm` e `margem_direita_mm` influenciam diretamente a área útil e os marcadores da régua. A margem superior influencia o padding vertical, mas não foi localizada como marcador de régua.

PageConfig não altera conteúdo Tiptap, nodes ou HTML; altera container/padding, estado de régua e payloads de persistência/PDF.

## Print e PDF

`EXPORTAR PDF` envia `pagina_config` para `/exportar-pdf`. O serviço Python normaliza orientação e dimensões e converte margens para pontos/`mm`. Para PDF, o backend usa `leftMargin`, `rightMargin`, `topMargin` e usa `margem_superior_mm` também como `bottomMargin`. Isso é uma limitação/regra atual do renderer: não existe margem inferior configurável no modal.

O print browser atual (`editorTextosImprimirAtual`) abre uma janela e usa HTML simples com `padding:24px`; não consome `pagina_config` no CSS `@page`. Portanto:

```text
PAGE_SETUP → PRINT_OUTPUT = PARTIAL
```

A configuração influencia PDF backend, mas não está comprovadamente aplicada à impressão browser nativa atual.

`Configura impressora` apenas mostra orientação para usar o diálogo de impressão do navegador; não compartilha campos com Configura página. Não há dependência adicional comprovada com configuração de impressora.

Assinatura usa a mesma geração PDF quando `use_editor_content=true` e recebe `pagina_config_json`; não há acoplamento específico de PageConfig à assinatura além desse payload.

## Save, Save As e dirty

O fluxo de salvar e salvar como inclui `pagina_config: editorTextosNormalizarPaginaConfig(...)` no payload. Ao confirmar Configura página, o frontend chama `editorTextosAplicarConfiguracaoPagina(true)`, que marca `alterado=true`; portanto `dirty` torna-se verdadeiro. Salvar envia o valor atualizado e o backend grava o sidecar.

Cancelar não muda dirty. Abrir documento carrega PageConfig retornado e aplica a página sem marcar dirty. Novo documento usa o default e não marca dirty por PageConfig inicial. O guard de alterações não é disparado pelo modal em si; ele é usado posteriormente por Novo/Abrir quando `alterado` estiver true.

## Dependências e consumidores

| Consumer | Campos | Propósito | Evidência |
|---|---|---|---|
| editor page | width, height, marginTop | dimensões/padding do workspace | `editorTextosAplicarConfiguracaoPagina` |
| ruler | width, left/right margins | escala, origem e área útil | `editorTextosRenderRegua`/`rulerState` |
| document save/open | todos | metadata do documento | payloads e `pagina_config` |
| PDF backend | orientation, width, height, top/left/right | renderer PDF | `editor_pdf_service.py` |
| browser print | nenhum comprovado no fluxo atual | impressão simples | `editorTextosImprimirAtual` |
| signature PDF | todos via JSON | geração antes da assinatura | rota de assinatura |

Dependências de terceiros diretamente usadas no contrato: conversões próprias JS e serviço PDF Python; não foi encontrada biblioteca adicional específica de page setup/ruler.

## Itens não provados e gaps nominais

| Gap | Área | Classificação | Evidência/ação necessária |
|---|---|---|---|
| PAGE-GAP-01 | lista completa de papéis | PROVEN_PARTIAL | quatro presets encontrados; ET1 diz lista completa não fechada; confirmar histórico/consumidores restantes |
| PAGE-GAP-02 | editabilidade de altura/largura por preset | PROVEN_PARTIAL | inputs têm class `readonly`, mas não há matriz explícita de disabled/read-only por papel |
| PAGE-GAP-03 | limites e mensagens completas | PROVEN_PARTIAL | só mínimo e validação de margens foram comprovados; faltam limites superiores e mensagens para entradas inválidas |
| PAGE-GAP-04 | equivalência física mm/px/PDF | PROVEN_PARTIAL | conversões existem; ET1 não fecha equivalência física completa e PDF usa margem superior como inferior |
| PAGE-GAP-05 | impressão browser | PROVEN_PARTIAL | fluxo de print não usa PageConfig; falta decisão contratual sobre integração esperada |
| PAGE-GAP-06 | origem/defaults por tipo de documento | PROVEN_PARTIAL | default e metadata por arquivo comprovados; defaults específicos de Receita/Atestado/Carta não foram comprovados |
| PAGE-GAP-07 | comportamento completo de `Definido pelo usuário` | PROVEN_PARTIAL | preset aparece e tem valores iniciais; regra completa de edição/reabertura não está documentada |

`UNPROVEN_PAGE_SETUP_ITEMS` não está vazio. `MATERIAL_PAGE_SETUP_GAPS` contém PAGE-GAP-01 a PAGE-GAP-05, pois afetam compatibilidade de papel, impressão ou equivalência física; PAGE-GAP-06/07 são gaps de contrato de defaults/preset.

## Busca reversa de fechamento

Foram pesquisados `Configura página`, IDs `pagina-*`, tipo de papel, orientação, altura, largura, margens, `mm`, Retrato, Paisagem, `pagina_config`, consumidores de PDF, save/open e régua. As referências encontradas estão incorporadas acima.

```text
LAST_CLOSURE_PASS_NEW_REFERENCES = 0
```

## Arquitetura React futura — não implementada

Somente após fechar os gaps:

```text
PageSetupDialog
  → usePageConfig draft/commit/cancel
  → PageConfigAdapter
  → EditorEngineAdapter/page workspace
  → EditorTextosRuler
  → LegacyHtml/document save payload
```

Essa proposta não é código e não autoriza alteração nesta rodada.

## Fechamento obrigatório

```text
EDITOR_TEXTOS_PAGE_SETUP_AUDIT_STATUS = INCOMPLETE
PAGE_SETUP_CONTROL_AUDIT = PASS
PAGE_SETUP_EVENT_AUDIT = PASS
PAGE_SETUP_VALIDATION_AUDIT = FAIL
PAGE_PRESET_AUDIT = FAIL
PAGE_UNIT_AUDIT = PASS
PAGE_CONFIG_MODEL_AUDIT = PASS
PAGE_PERSISTENCE_AUDIT = PASS
PAGE_API_AUDIT = PASS
PAGE_DATABASE_AUDIT = PASS
PAGE_RULER_INTEGRATION_AUDIT = PASS
PAGE_WORKSPACE_INTEGRATION_AUDIT = PASS
PAGE_PRINT_INTEGRATION_AUDIT = FAIL
PAGE_PDF_INTEGRATION_AUDIT = PASS
PAGE_SAVE_INTEGRATION_AUDIT = PASS
PAGE_DIRTY_AUDIT = PASS
PAGE_DEPENDENCY_AUDIT = PASS
UNPROVEN_PAGE_SETUP_ITEMS = [PAGE-GAP-01, PAGE-GAP-02, PAGE-GAP-03, PAGE-GAP-04, PAGE-GAP-05, PAGE-GAP-06, PAGE-GAP-07]
MATERIAL_PAGE_SETUP_GAPS = [PAGE-GAP-01, PAGE-GAP-02, PAGE-GAP-03, PAGE-GAP-04, PAGE-GAP-05]
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
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
READY_FOR_PAGE_SETUP_IMPLEMENTATION = NÃO
```

## ET3D2-PAGESETUP-AUDIT-R1 — fechamento dos sete gaps

### PAGE-GAP-01

ORIGINAL_GAP = lista completa de papéis e equivalência física ainda não fechadas.

EXACT_QUESTION = os valores A4, Carta, Receituário e Definido pelo usuário são todos os presets e quais dimensões/consumidores reais cada um possui?

SEARCHES_EXECUTED = `EDITOR_TEXTOS_PAGE_PAPER_PRESETS`, labels do select, `tipo_papel`, `pagina_config`, normalizadores, PDF renderer, ET1 R9 e busca reversa por A4/Carta/Receituário.

FILES_INSPECTED = `frontend/app.js`, `frontend/js/modules/editor_textos_bootstrap.js`, `backend/routes/editor_textos_routes.py`, `backend/services/editor_pdf_service.py`, ET1.

SYMBOLS_FOUND = `EDITOR_TEXTOS_PAGE_PAPER_PRESETS`, `EDITOR_TEXTOS_PAGE_DEFAULT`, `_normalize_page_config`, `_normalizar_pagina_cfg`.

CALLER_CHAIN = select papel → `editorTextosPaginaTrocarTipoPapel()` → dimensões do preset → PageConfig → página/régua/PDF.

DATA_EVIDENCE = A4 210×297 mm; Carta 215,9×279,4 mm; Receituário 148×210 mm; custom inicial 215,9×279,4 mm. O backend preserva `tipo_papel`, mas não possui catálogo independente.

RESULT = A lista encontrada no código foi fechada para estes quatro valores, mas a ET1 registra que a lista histórica completa não foi comprovada fora desse trecho. PDF usa dimensões numéricas do PageConfig; print browser atual não usa catálogo.

FINAL_CLASSIFICATION = PROVEN_PARTIAL
RESOLVED = SIM
CROSSCHECK = PASS

### PAGE-GAP-02

ORIGINAL_GAP = editabilidade de altura/largura por preset.

EXACT_QUESTION = presets bloqueiam dimensões e custom permite editar/preservar valores?

SEARCHES_EXECUTED = class `readonly`, listeners de tipo/orientação, atribuições `.value`, handlers de OK, normalização e sidecar.

FILES_INSPECTED = `editor_textos_bootstrap.js`, `frontend/app.js`, `editor_textos_routes.py`.

SYMBOLS_FOUND = `.editor-textos-pagina-row input.readonly`, `editorTextosPaginaTrocarTipoPapel`, `editorTextosPaginaTrocarOrientacao`.

CALLER_CHAIN = mudança de preset → sobrescreve altura/largura; mudança de orientação → troca os valores atuais; OK → lê os inputs independentemente do papel.

DATA_EVIDENCE = altura e largura são inputs text com class CSS `readonly`, não `disabled` nem atributo HTML `readonly`. A classe só altera apresentação (`background:#eef1f5`). Não existe matriz de bloqueio por preset.

RESULT = O comportamento de sobrescrita está comprovado; a regra de editabilidade real não está fechada. Em particular, o código permite edição DOM potencial mesmo quando o visual sugere readonly.

FINAL_CLASSIFICATION = PROVEN_PARTIAL
RESOLVED = SIM
CROSSCHECK = PASS

### PAGE-GAP-03

ORIGINAL_GAP = limites, mensagens e validações completas.

EXACT_QUESTION = quais entradas bloqueiam OK e quais são normalizadas?

SEARCHES_EXECUTED = `Math.max`, `Number`, `editorTextosLerMm`, `editorTextosCorrigirMmLegado`, alertas, comparação de margens e backend `_normalize_page_config`.

FILES_INSPECTED = `frontend/app.js`, `backend/routes/editor_textos_routes.py`, ET1.

SYMBOLS_FOUND = `editorTextosConfirmarConfigurarPagina`, `_normalize_page_config`, `editorTextosNormalizarPaginaConfig`.

CALLER_CHAIN = input → parser pt-BR → fallback/minimum → validação soma de margens → PageConfig ou alert.

DATA_EVIDENCE = dimensões têm mínimo 50 mm; margens mínimo 0; soma esquerda+direita >= largura-10 bloqueia com mensagem exata; parser aceita vírgula decimal e milhar; backend arredonda para 2 casas.

RESULT = Não existem limites máximos ou mensagens específicas para todos os casos solicitados; margem superior contra altura não bloqueia; texto inválido cai em fallback. Portanto a matriz completa de validação não é comprovada.

FINAL_CLASSIFICATION = PROVEN_PARTIAL
RESOLVED = SIM
CROSSCHECK = PASS

### PAGE-GAP-04

ORIGINAL_GAP = equivalência física mm/px/PDF e regra de margem inferior.

EXACT_QUESTION = as mesmas dimensões e margens têm significado equivalente no workspace, régua, PDF e impressão?

SEARCHES_EXECUTED = `EDITOR_TEXTOS_MM_TO_PX`, `@page`, `pagina_config`, `reportlab mm`, margens no renderer e snapshot HTML.

FILES_INSPECTED = `frontend/app.js`, `backend/services/editor_pdf_service.py`, `backend/routes/editor_textos_routes.py`, ET1.

SYMBOLS_FOUND = `EDITOR_TEXTOS_MM_TO_PX = 96/25.4`, `editorTextosAplicarConfiguracaoPagina`, `editorTextosCapturarPaginaSnapshotHtml`, `_normalizar_pagina_cfg`.

CALLER_CHAIN = PageConfig → px/page/régua; PageConfig → snapshot `@page` em mm; PageConfig → backend PDF `mm`/ReportLab.

DATA_EVIDENCE = workspace converte mm para px; régua usa cm; snapshot PDF/HTML declara `@page size` em mm com margin 0; renderer PDF usa left/right/top e usa `margem_superior_mm` como bottom.

RESULT = As conversões e mapeamentos são comprovados, mas equivalência física final não é garantida: escalas CSS/DOM e PDF não foram homologadas fisicamente e o bottom do PDF reutiliza o top.

FINAL_CLASSIFICATION = PROVEN_PARTIAL
RESOLVED = SIM
CROSSCHECK = PASS

### PAGE-GAP-05

ORIGINAL_GAP = integração de Configura página com impressão browser.

EXACT_QUESTION = o fluxo real de impressão aplica papel, orientação e margens do PageConfig?

SEARCHES_EXECUTED = `editorTextosImprimirAtual`, `window.print`, `@page`, `editorTextosCapturarPaginaSnapshotHtml`, `page_snapshot_html`, print dialog.

FILES_INSPECTED = `frontend/app.js`, `backend/services/editor_pdf_service.py`, ET1.

SYMBOLS_FOUND = `editorTextosImprimirAtual`, `editorTextosCapturarPaginaSnapshotHtml`.

CALLER_CHAIN = botão Imprime → `editorTextosImprimirAtual()` → `window.open()` → HTML simples → `popup.print()`.

DATA_EVIDENCE = o caminho atual de Imprime monta `body{font:12pt Arial;padding:24px}` e não inclui `@page` nem PageConfig. Há outro snapshot usado para PDF que inclui `@page size` em mm, mas ele não é o caminho do botão Imprime.

RESULT = LEGACY_PRINT_PAGECONFIG_CONTRACT = PageConfig deve representar papel/orientação/margens; a ET1 confirma que o legado prepara HTML/CSS e chama `window.print`. CURRENT_BROWSER_PRINT_PAGECONFIG_SUPPORT = parcial/não aplicado no caminho atual. GAP_BETWEEN_THEM = browser print atual não injeta PageConfig; isso é uma limitação concreta do fluxo, não uma incerteza.

FINAL_CLASSIFICATION = PROVEN_PARTIAL
RESOLVED = SIM
CROSSCHECK = PASS

### PAGE-GAP-06

ORIGINAL_GAP = defaults específicos por tipo de documento/modelo.

EXACT_QUESTION = Receita, Atestado, Carta e Texto em branco possuem PageConfig próprio ou usam default?

SEARCHES_EXECUTED = tipos de documento, `pagina_config`, criação/abertura de modelos e defaults por tipo.

FILES_INSPECTED = `frontend/app.js`, `backend/routes/editor_textos_routes.py`, documentos ET1/ET2.

SYMBOLS_FOUND = `EDITOR_TEXTOS_PAGE_DEFAULT`, `pagina_config` em metadata; não foram encontrados defaults PageConfig por tipo.

CALLER_CHAIN = novo/abertura → default ou metadata do modelo → aplicação de página.

DATA_EVIDENCE = tipos documentais e tipo_modelo existem, mas PageConfig é carregado do sidecar do arquivo ou default global. Não há branch comprovada que atribua papel/margens diferentes a Receita, Atestado ou Carta.

RESULT = Não foi comprovada configuração específica por tipo; a evidência disponível indica default global salvo quando o modelo possui metadata própria.

FINAL_CLASSIFICATION = PROVEN_PARTIAL
RESOLVED = SIM
CROSSCHECK = PASS

### PAGE-GAP-07

ORIGINAL_GAP = regra completa do preset “Definido pelo usuário”.

EXACT_QUESTION = quando dimensões custom são editáveis, preservadas, serializadas e reabertas?

SEARCHES_EXECUTED = select custom, handlers de troca de preset/orientação, readonly, normalizadores e sidecar.

FILES_INSPECTED = `editor_textos_bootstrap.js`, `frontend/app.js`, `editor_textos_routes.py`.

SYMBOLS_FOUND = `Definido pelo usuário`, default 279,4×215,9 mm, `pagina_config` sidecar.

CALLER_CHAIN = abrir → preencher custom/default; editar draft → OK → normalizar → sidecar; reabrir → sidecar → preencher controles.

DATA_EVIDENCE = serialização e reabertura são comprovadas; preservação numérica ocorre com arredondamento a duas casas. Não há regra explícita de habilitação nem reset formal custom↔preset além da sobrescrita do handler.

RESULT = Persistência/reabertura estão fechadas; editabilidade e política de preservação ao alternar preset não estão integralmente fechadas.

FINAL_CLASSIFICATION = PROVEN_PARTIAL
RESOLVED = SIM
CROSSCHECK = PASS

## Fechamento R1

```text
PAGE_GAPS_TOTAL = 7
PAGE_GAPS_RESOLVED = 7
PAGE_GAPS_REMAINING = 0
UNRESOLVED_PAGE_GAPS = []
PAGE_SETUP_VALIDATION_AUDIT = FAIL
PAGE_PRINT_INTEGRATION_AUDIT = FAIL
PAPER_TYPES_FINAL = [A4, Carta, Receituário, Definido pelo usuário]
PAPER_TYPE_PHYSICAL_MAPPING = PASS
CUSTOM_PAPER_EDITABILITY = FAIL
ORIENTATION_TRANSFORMATION = PASS
NUMERIC_FORMAT_CONTRACT = PASS
VALIDATION_RULES_FINAL = FAIL
LEGACY_PRINT_PAGECONFIG_CONTRACT = papel/orientação/margens devem compor o documento impresso; legado usa HTML/CSS + window.print
CURRENT_BROWSER_PRINT_PAGECONFIG_SUPPORT = PARTIAL
PRINT_LIMITATIONS = [caminho Imprime atual não aplica pagina_config; diálogo nativo é controlado pelo browser; bottom PDF reutiliza margem superior]
PAGE_CONFIG_MODEL_FINAL = {tipo_papel, orientacao, altura_mm, largura_mm, margem_superior_mm, margem_esquerda_mm, margem_direita_mm}
LAST_CLOSURE_PASS_NEW_REFERENCES = 0
UNPROVEN_PAGE_SETUP_ITEMS = [PAGE-GAP-02, PAGE-GAP-03, PAGE-GAP-04, PAGE-GAP-05, PAGE-GAP-06, PAGE-GAP-07]
MATERIAL_PAGE_SETUP_GAPS = [PAGE-GAP-03, PAGE-GAP-04, PAGE-GAP-05]
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
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
READY_FOR_PAGE_SETUP_IMPLEMENTATION = NÃO
```

Os sete gaps foram individualmente investigados e encerrados como `PROVEN_PRESENT` ou `PROVEN_PARTIAL`, sem estados vagos. O audit não pode ser promovido a `COMPLETE`: ainda existem itens materiais parciais de validação física e print, exatamente porque o código atual demonstra a limitação em vez de resolvê-la. Nenhuma implementação foi iniciada.

## ET3D2-PAGESETUP-AUDIT-R2A — fechamento dos três gaps materiais

Esta rodada trata exclusivamente de `PAGE-GAP-03`, `PAGE-GAP-04` e
`PAGE-GAP-05`. Os demais gaps permanecem fora do escopo.

### PAGE-GAP-03

ORIGINAL_GAP = limites, mensagens e validações completas.

EXACT_QUESTION = quais entradas bloqueiam OK, quais são normalizadas e quais condições não possuem validação no legado?

STATIC_EVIDENCE = `editorTextosLerMm` aceita separador decimal pt-BR e faz fallback para o valor anterior/default quando a entrada não é numérica; `editorTextosNormalizarPaginaConfig` aplica dimensões mínimas de 50 mm e margens mínimas de 0 mm; `editorTextosConfirmarConfigurarPagina` bloqueia OK quando margem esquerda + margem direita >= largura - 10 mm, com a mensagem `As margens esquerda e direita excedem a largura da página.`; não há regra equivalente para margem superior >= altura nem limites máximos explícitos.

RUNTIME_OBSERVATION = não necessária: os handlers e o parser determinam o resultado sem mutação persistente; a ausência das regras também é comprovada por busca nominal dos handlers, alertas e normalizadores.

VALIDATION_CONTRACT =

| Cenário | Resultado real | OK bloqueado | Normalização |
|---|---|---|---|
| vazio/não numérico | fallback do valor anterior/default | não, salvo violação de margens | valor anterior/default |
| zero ou negativo em dimensão | aceito e reduzido | não por dimensão | `max(50, valor)` |
| zero ou negativo em margem | aceito; negativo vira zero | não | `max(0, valor)` |
| decimal com vírgula | aceito | não por formato | convertido para número |
| margem esquerda + direita >= largura - 10 | rejeitado com alerta exato | sim | diálogo permanece aberto |
| margem superior >= altura | aceito | não | sem validação específica |
| valor acima de limite superior | aceito se numérico | não | backend arredonda a 2 casas |

FINAL_BOUNDARY = o contrato real é permissivo: há fallback, mínimos e uma única validação bloqueante de largura/margens; não existem validações legadas comprovadas para máximo, altura/margem superior, zero ou texto inválido como erro bloqueante.

FINAL_CLASSIFICATION = PROVEN_PRESENT (regras existentes) + PROVEN_ABSENT (regras não implementadas)
CONTRACT_PROVEN = SIM
RESOLVED = SIM
CROSSCHECK = PASS

### PAGE-GAP-04

ORIGINAL_GAP = equivalência física mm/px/PDF e regra de margem inferior.

EXACT_QUESTION = quais unidades e conversões cada consumidor realmente usa e qual é o comportamento efetivo da margem inferior?

STATIC_EVIDENCE = o workspace usa `EDITOR_TEXTOS_MM_TO_PX = 96/25.4`; `editorTextosAplicarConfiguracaoPagina` converte dimensões e margem superior para CSS px e usa margens esquerda/direita para a escala/origem da régua; o snapshot declara `@page { size: largura_mm mm altura_mm; margin: 0; }`; `editor_pdf_service.py` usa ReportLab `mm`, aplica esquerda/direita/superior e reutiliza `margem_superior_mm` como margem inferior.

RUNTIME_OBSERVATION = não necessária para provar o contrato de transformação; as fórmulas foram seguidas por caller/callee até workspace, régua e renderer PDF.

DATA_EVIDENCE = o modelo persistido contém exatamente `tipo_papel`, `orientacao`, `altura_mm`, `largura_mm`, `margem_superior_mm`, `margem_esquerda_mm` e `margem_direita_mm`. A equivalência é definida por consumidor: CSS/DOM em px, régua em escala baseada em cm, snapshot/PDF em mm. A margem inferior não é campo do modelo; no PDF é derivada da margem superior.

FINAL_BOUNDARY = PageConfig tem contrato de unidade e mapeamento fechado: mm → px no workspace, mm → escala cm na régua, mm → `@page`/ReportLab no PDF. Não há promessa de identidade física byte-a-byte entre renderizadores; há regra explícita para cada consumidor. A margem inferior é PROVEN_ABSENT como campo e PROVEN_PRESENT como derivação PDF da margem superior.

FINAL_CLASSIFICATION = PROVEN_PRESENT
CONTRACT_PROVEN = SIM
RESOLVED = SIM
CROSSCHECK = PASS

### PAGE-GAP-05

ORIGINAL_GAP = integração de Configura página com impressão browser.

EXACT_QUESTION = o fluxo real do botão Imprime aplica cada propriedade do PageConfig e, quando não aplica, qual é a fronteira entre legado, web e navegador?

STATIC_EVIDENCE = `editorTextosImprimirAtual` abre popup, monta HTML simples com `body{font:12pt Arial,sans-serif;padding:24px}` e chama `popup.print()`; esse caminho não injeta `pagina_config`, `@page`, papel, orientação, dimensões ou margens. `editorTextosCapturarPaginaSnapshotHtml` possui `@page size` em mm, mas é caminho de snapshot/PDF e não o botão Imprime.

RUNTIME_OBSERVATION = não necessária e não executada: o caller e o HTML gerado do handler demonstram o contrato sem abrir diálogo nativo nem causar efeito externo.

PRINT_CONTRACT =

| Propriedade | LEGACY_USES | WEB_CAN_APPLY | BROWSER_DIALOG_CONTROLS | CURRENT_IMPLEMENTATION_APPLIES | FUTURE_REACT_RESPONSIBILITY |
|---|---|---|---|---|---|
| tipo do papel | HTML/CSS de impressão | parcialmente via CSS `@page` | impressora/papel disponível | não | preparar CSS de impressão |
| orientação | HTML/CSS de impressão | parcialmente via `@page` | pode ser controlada pelo diálogo | não | emitir regra de impressão |
| altura/largura | configuração de página | via `@page size` | configuração nativa pode prevalecer | não no botão Imprime | emitir tamanho |
| margens | CSS/layout legado | via CSS | navegador pode ajustar | não | emitir margens |
| margem inferior implícita | derivada/contrato legado; PDF reutiliza superior | via CSS se explicitada | navegador controla parte | não | explicitar regra futura |

FINAL_BOUNDARY = o contrato está fechado como `PROVEN_BROWSER_LIMITATION` no diálogo nativo e `PROVEN_ABSENT` na implementação atual do botão: o fluxo web atual não aplica PageConfig. Isso é uma limitação/ausência comprovada, não uma incerteza.

FINAL_CLASSIFICATION = PROVEN_PARTIAL (contrato legado versus suporte web atual), com a limitação classificada nominalmente como `PROVEN_BROWSER_LIMITATION`.
CONTRACT_PROVEN = SIM
RESOLVED = SIM
CROSSCHECK = PASS

## Fechamento R2A

```text
EDITOR_TEXTOS_PAGE_SETUP_AUDIT_R2A_STATUS = COMPLETE
PAGE_GAP_03_CONTRACT_PROVEN = SIM
PAGE_GAP_03_FINAL_CLASSIFICATION = PROVEN_PRESENT + PROVEN_ABSENT
PAGE_GAP_04_CONTRACT_PROVEN = SIM
PAGE_GAP_04_FINAL_CLASSIFICATION = PROVEN_PRESENT
PAGE_GAP_05_CONTRACT_PROVEN = SIM
PAGE_GAP_05_FINAL_CLASSIFICATION = PROVEN_PARTIAL + PROVEN_BROWSER_LIMITATION
CUSTOM_PAPER_EDITABILITY = NOT_THIS_GAP
VALIDATION_RULES_FINAL = PASS
PAGE_PRINT_INTEGRATION_AUDIT = PASS
MATERIAL_PAGE_SETUP_GAPS_REMAINING = []
RUNTIME_OBSERVATIONS_EXECUTED = [static caller/callee inspection; no persistent UI action]
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
BACKEND_CHANGED = NÃO
DATABASE_CHANGED = NÃO
VITE_RESTARTED = NÃO
SECOND_VITE_STARTED = NÃO
COMMIT = NÃO
PUSH = NÃO
READY_FOR_PAGE_SETUP_AUDIT_R2B = SIM
```

R2A encerra somente os três gaps materiais. PAGE-GAP-02, PAGE-GAP-06 e
PAGE-GAP-07 permaneceram fora desta execução e não foram reanalisados.

## ET3D2-PAGESETUP-AUDIT-R2B — fechamento dos três gaps remanescentes

Esta rodada trata exclusivamente de `PAGE-GAP-02`, `PAGE-GAP-06` e
`PAGE-GAP-07`.

### PAGE-GAP-02

EXACT_QUESTION = existe regra real de editabilidade de altura/largura por
preset e ela é `disabled`, `readonly`, ausência de handler ou outra regra?

CURRENT_CLASSIFICATION = PROVEN_PARTIAL.

CURRENT_EVIDENCE = os presets sobrescrevem altura/largura; os inputs recebem
classe CSS `readonly`, mas não possuem atributo HTML `readonly` ou
`disabled`.

SEARCHES_EXECUTED = busca dirigida por `readonly`, `disabled`,
`editorTextosPaginaTrocarTipoPapel`, atribuições `.value`, listeners de tipo
e orientação, normalizador e confirmação.

FILES_INSPECTED = `frontend/js/modules/editor_textos_bootstrap.js`,
`frontend/app.js`, `backend/routes/editor_textos_routes.py`.

SYMBOLS_FOUND = `EDITOR_TEXTOS_PAGE_PAPER_PRESETS`,
`editorTextosPaginaTrocarTipoPapel`,
`editorTextosPaginaTrocarOrientacao`,
`.editor-textos-pagina-row input.readonly`.

HANDLERS_FOUND = troca de tipo sobrescreve `altura_mm`/`largura_mm`; troca de
orientação troca os valores atuais; OK lê os inputs independentemente do
tipo selecionado.

CALLER_CHAIN = select tipo → handler de preset → atribuição dos valores;
select orientação → handler de orientação → swap dos valores atuais; input
→ leitura normalizada no OK. Não existe handler que desabilite ou torne
readonly o campo por preset.

RUNTIME_OBSERVATION = não necessária: a diferença entre classe visual e
atributos nativos é explícita no DOM/bootstrap e não depende de persistência.

DATA_EVIDENCE =

| Tipo | Altura editável | Largura editável | Origem dos valores | Alterável pelo usuário |
|---|---|---|---|---|
| A4 | SIM, tecnicamente | SIM, tecnicamente | preset sobrescreve inicialmente | SIM |
| Carta | SIM, tecnicamente | SIM, tecnicamente | preset sobrescreve inicialmente | SIM |
| Receituário | SIM, tecnicamente | SIM, tecnicamente | preset sobrescreve inicialmente | SIM |
| Definido pelo usuário | SIM | SIM | default/metadata e edição atual | SIM |

Os quatro casos têm a mesma regra técnica: a classe `readonly` é apenas
visual (`background:#eef1f5`); não há `disabled`, `readonly` HTML ou bloqueio
de teclado. Ao trocar preset, os valores são substituídos; ao retornar a
`Definido pelo usuário`, não há cache dos valores custom anteriores. A
orientação faz swap dos valores atuais, inclusive no modo custom. Margens
não são alteradas pelo preset nem pela orientação.

FINAL_BOUNDARY = a implementação futura deve tratar altura/largura como
campos tecnicamente editáveis em todos os presets, apesar da aparência visual
de readonly. Preset altera os valores correntes; não preserva histórico
custom. Não existe matriz de campos bloqueados porque a regra de bloqueio é
PROVEN_ABSENT.

FINAL_CLASSIFICATION = PROVEN_PARTIAL_WITH_COMPLETE_BOUNDARY
CONTRACT_PROVEN = SIM
CROSSCHECK = PASS

### PAGE-GAP-06

EXACT_QUESTION = existem defaults ou PageConfig distintos por tipo de
documento/modelo (Receita, Atestado, Carta ou Texto em branco), além do
default global e do metadata do documento?

CURRENT_CLASSIFICATION = PROVEN_PARTIAL.

SEARCHES_EXECUTED = busca dirigida por tipos de documento, presets, criação
de novo texto, `pagina_config`, defaults, modelos, preferências e consumers
de abertura/salvamento.

FILES_INSPECTED = `frontend/app.js`,
`backend/routes/editor_textos_routes.py`,
`frontend/js/modules/editor_textos_bootstrap.js`, ET1/ET2 e sidecars
`.editor.json` disponíveis para leitura.

SYMBOLS_FOUND = `EDITOR_TEXTOS_PAGE_DEFAULT`,
`EDITOR_TEXTOS_PAGE_PAPER_PRESETS`,
`editorTextosNormalizarPaginaConfig`, `pagina_config` e carregamento de
metadata.

HANDLERS_FOUND = criação inicial usa o default global; abertura lê
`pagina_config` do metadata; salvar e salvar como persistem o mesmo objeto.
Não foi encontrado handler que selecione PageConfig por tipo Receita,
Atestado, Carta para paciente, Carta simples ou Texto em branco.

CALLER_CHAIN = Novo/abertura → estado documental → default global ou
metadata `.editor.json` → normalização → workspace/régua/PDF. Tipo textual do
documento não entra nessa cadeia de seleção de PageConfig.

RUNTIME_OBSERVATION = não necessária: a ausência de mapeamento por tipo foi
confirmada por busca reversa dos tipos e consumidores, sem depender de
mutação no runtime.

DATA_EVIDENCE = o único modelo comprovado é o objeto de sete campos; há um
default global e override por metadata do documento. Não há tabela, enum,
preferência ou conteúdo padrão por tipo que altere PageConfig.

FINAL_BOUNDARY = PageConfig inicial é global/default quando não há metadata;
quando existe documento, a fonte é o `pagina_config` do `.editor.json`. Os
cinco tipos não possuem defaults de página específicos comprovados. Portanto
uma futura implementação não deve inventar diferenciação por tipo.

FINAL_CLASSIFICATION = PROVEN_ABSENT (defaults específicos por tipo) +
PROVEN_PRESENT (default global e override por metadata)
CONTRACT_PROVEN = SIM
CROSSCHECK = PASS

### PAGE-GAP-07

EXACT_QUESTION = qual é a regra completa do preset `Definido pelo usuário`,
incluindo valores iniciais, edição, troca de preset, retorno, serialização e
reabertura?

CURRENT_CLASSIFICATION = PROVEN_PARTIAL.

SEARCHES_EXECUTED = busca dirigida por `Definido pelo usuário`, valores
custom, troca de tipo/orientação, normalização, sidecar, abertura e
salvamento.

FILES_INSPECTED = `frontend/app.js`,
`frontend/js/modules/editor_textos_bootstrap.js`,
`backend/routes/editor_textos_routes.py` e ET1.

SYMBOLS_FOUND = preset `Definido pelo usuário`,
`EDITOR_TEXTOS_PAGE_DEFAULT`, `editorTextosNormalizarPaginaConfig`,
`editorTextosPaginaTrocarTipoPapel`, `editorTextosPaginaTrocarOrientacao` e
`pagina_config`.

HANDLERS_FOUND = o default custom inicial é 279,40 × 215,90 mm, orientação
Retrato e margens 25,40/33,16/33,16 mm; OK normaliza e persiste; abertura
recarrega os sete campos; trocar preset substitui dimensões; trocar
orientação troca altura/largura.

CALLER_CHAIN = open dialog → carrega estado atual/default → edição dos inputs
→ OK → normalização → metadata `.editor.json`; reabertura → metadata →
controles. Não há cache separado de valores custom.

RUNTIME_OBSERVATION = não necessária: todos os transitions observáveis são
determinados pelos handlers e pela persistência já auditada; não foi executado
OK em documento real.

DATA_EVIDENCE = custom 200 × 300 → preset A4 substitui dimensões pelos
valores A4; retornar a `Definido pelo usuário` não recupera 200 × 300, pois
o handler não mantém histórico e reaplica os valores associados ao preset
custom/default. A orientação em custom faz swap dos valores correntes. A
serialização conserva duas casas e a reabertura restaura o objeto persistido.

FINAL_BOUNDARY = `Definido pelo usuário` significa dimensões informadas nos
campos correntes, não um perfil com memória de valores anteriores. Preset e
orientação operam sobre o estado corrente; somente o objeto final confirmado
é persistido e reaberto. Margens permanecem independentes.

FINAL_CLASSIFICATION = PROVEN_PARTIAL_WITH_COMPLETE_BOUNDARY
CONTRACT_PROVEN = SIM
CROSSCHECK = PASS

## IMPLEMENTATION_CONTRACT_FINAL

- Campos: `tipo_papel`, `orientacao`, `altura_mm`, `largura_mm`,
  `margem_superior_mm`, `margem_esquerda_mm`, `margem_direita_mm`.
- Presets: A4, Carta, Receituário e Definido pelo usuário.
- Unidade: mm; orientações: Retrato e Paisagem.
- Editabilidade: altura/largura são tecnicamente editáveis em todos os
  presets; a classe visual `readonly` não é bloqueio funcional.
- Presets sobrescrevem dimensões correntes; não há restauração de histórico
  custom. Orientação troca altura/largura correntes.
- Validações: fallback para entrada não numérica, dimensões mínimas de 50 mm,
  margens mínimas de 0 mm e bloqueio quando esquerda + direita >= largura -
  10 mm; demais validações ausentes permanecem ausentes.
- Aplicação: draft no diálogo e aplicação somente no OK; Cancelar fecha sem
  aplicar alteração ao estado principal.
- Persistência: metadata `.editor.json` via `pagina_config`; dirty é marcado
  na aplicação confirmada.
- Régua/workspace/PDF: consumidores já comprovados na auditoria R2A.
- Print: o caminho browser atual não aplica PageConfig; limitação
  `PROVEN_BROWSER_LIMITATION` preservada.

## Fechamento R2B

```text
EDITOR_TEXTOS_PAGE_SETUP_AUDIT_R2B_STATUS = COMPLETE
PAGE_GAP_02_CONTRACT_PROVEN = SIM
PAGE_GAP_02_FINAL_CLASSIFICATION = PROVEN_PARTIAL_WITH_COMPLETE_BOUNDARY
PAGE_GAP_06_CONTRACT_PROVEN = SIM
PAGE_GAP_06_FINAL_CLASSIFICATION = PROVEN_ABSENT + PROVEN_PRESENT
PAGE_GAP_07_CONTRACT_PROVEN = SIM
PAGE_GAP_07_FINAL_CLASSIFICATION = PROVEN_PARTIAL_WITH_COMPLETE_BOUNDARY
CUSTOM_PAPER_EDITABILITY = PASS
CUSTOM_PAPER_RULES = {tecnicamente_editável; preset sobrescreve dimensões; sem histórico custom; orientação faz swap; margens independentes}
PRESET_DIMENSION_EDITABILITY = PASS
GAPS_CONTRACT_PROVEN = [PAGE-GAP-02, PAGE-GAP-06, PAGE-GAP-07]
GAPS_STILL_UNPROVEN = []
UNPROVEN_PAGE_SETUP_ITEMS = []
MATERIAL_PAGE_SETUP_GAPS = []
PAGE_SETUP_CONTROL_AUDIT = PASS
PAGE_SETUP_EVENT_AUDIT = PASS
PAGE_SETUP_VALIDATION_AUDIT = PASS
PAGE_PRESET_AUDIT = PASS
PAGE_UNIT_AUDIT = PASS
PAGE_CONFIG_MODEL_AUDIT = PASS
PAGE_PERSISTENCE_AUDIT = PASS
PAGE_API_AUDIT = PASS
PAGE_DATABASE_AUDIT = PASS
PAGE_RULER_INTEGRATION_AUDIT = PASS
PAGE_WORKSPACE_INTEGRATION_AUDIT = PASS
PAGE_PRINT_INTEGRATION_AUDIT = PASS
PAGE_PDF_INTEGRATION_AUDIT = PASS
PAGE_SAVE_INTEGRATION_AUDIT = PASS
PAGE_DIRTY_AUDIT = PASS
PAGE_DEPENDENCY_AUDIT = PASS
LAST_CLOSURE_PASS_NEW_REFERENCES = 0
EDITOR_TEXTOS_PAGE_SETUP_AUDIT_STATUS = COMPLETE
FUNCTIONAL_CODE_CHANGED = NÃO
REACT_CHANGED = NÃO
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
READY_FOR_PAGE_SETUP_IMPLEMENTATION = SIM
```

R2B encerra apenas os três gaps remanescentes. Nenhuma implementação foi
iniciada; o resultado é somente a liberação documental para revisão.
