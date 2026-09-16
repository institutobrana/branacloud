# Brana Cloude — Auditoria do botão Imagem

## EDITOR_TEXTOS_IMAGE_AUDIT_R1

Status: INCOMPLETE. A observação runtime do legado não foi possível porque a aba autenticada disponível apresenta “Sessão expirada, faça login novamente!”. Nenhum login, alteração de dados ou bypass foi executado.

## Evidência runtime

- Legado: bloqueado na tela de autenticação; o botão Imagem não pôde ser observado.
- React: não foi alterado nem usado para inserir imagem nesta auditoria.
- Runtime, backend, banco e worktree funcional: não alterados.

## Evidência estática do legado

Arquivo principal: `frontend/js/modules/editor_textos_bootstrap.js` e handlers em `frontend/app.js`.

- Botão: `#editor-textos-btn-imagem`, rótulo visual por ícone `▧`, tooltip `Imagem`.
- Entrada: `editorTextosInserirImagem()` abre o modal `#editor-textos-image-backdrop`.
- Seleção: `editorTextosAbrirModalImagem()` salva o range atual por `editorTextosSalvarRangeAtual()`.
- Escolha: file input `#editor-textos-image-file`, seleção única.
- Formatos declarados: BMP, JPG/JPEG, PNG, GIF e WEBP.
- Limite estático: `EDITOR_TEXTOS_IMAGEM_MAX_BYTES = 4 * 1024 * 1024`.
- Leitura: `FileReader.readAsDataURL()`.
- Inserção: `<img>` inline no cursor, com `data-editor-img-data`, classe `editor-textos-inline-image` e `alt="Imagem"`.
- Opção de inserção: “Ajustar à largura da página”.
- Redimensionamento: overlay com handles; tamanho persistido em pixels, com altura normalizada para `auto` ao finalizar.
- Remoção, duplo clique, menu contextual, drag-and-drop e colagem de imagem: não comprovados runtime nem localizados como contrato fechado nesta auditoria.

## Persistência observada no código

O legado converte imagens válidas do HTML para tokens `[[IMGDATA:<data-url>|w=<px>|h=<px>]]` em `editorTextosSerializarHtmlComImagens()`. Na leitura, `editorTextosExpandirTokensImagemHtml()` reconstrói imagens com `data:` URL base64. O save envia o conteúdo serializado junto ao payload do modelo.

Conclusão estática: há evidência de armazenamento embutido no conteúdo/metadata do documento, não de endpoint separado de upload. Save/reopen efetivo permanece não comprovado runtime nesta rodada.

## React/Tiptap atual

- Botão: `EditorTextosPrimaryToolbar.jsx`, ação `image`, ícone `PictureOutlined`.
- Handler: não localizado; a ação `image` não é encaminhada por `formatCommand()` e não há comando de imagem no `EditorTextosPage.jsx`.
- Status atual: `NONE`/não conectado funcionalmente.
- Extensão Tiptap de imagem: não presente na lista de extensões de `EditorTextosPage.jsx`.
- Comandos de imagem: não disponíveis no editor atual.
- `LegacyHtmlAdapter` atual apenas normaliza HTML como string; não há adaptação específica de imagens.

## Gaps materiais

1. Observação runtime do legado bloqueada por sessão expirada.
2. Contrato visual e comportamento exato após clicar Imagem não confirmados runtime.
3. Save/reopen, PDF/print, seleção, remoção, clipboard, drag-and-drop, EXIF e menu contextual não fechados por prova runtime.
4. React não possui extensão, handler ou adapter de imagem conectado.
5. Compatibilidade completa entre tokens legados e o modelo Tiptap ainda não comprovada.

## Proposta preliminar — não autorizada para implementação

Somente após autenticação do legado e fechamento dos gaps:

1. manter inserção por arquivo único, com os formatos e limite comprovados;
2. reutilizar a estratégia base64/token apenas se o contrato runtime confirmar essa persistência;
3. adicionar extensão Tiptap de imagem somente se compatível com o HTML persistido;
4. criar diálogo React modular e adapter de imagem, com inserção no cursor, dirty e undo/redo;
5. reutilizar o serializer/save pipeline existente;
6. validar explicitamente reopen, PDF e print antes de qualquer implementação.

`NEW_BACKEND_REQUIRED = UNPROVEN`.

## Controle de alterações

- Functional code changed: NÃO nesta auditoria.
- React changed: NÃO nesta auditoria.
- CSS changed: NÃO nesta auditoria.
- Backend/database changed: NÃO.
- Vite restarted: NÃO.
- Commit/push: NÃO.

`READY_FOR_IMAGE_IMPLEMENTATION = NÃO`.

## EDITOR_TEXTOS_IMAGE_AUDIT_R4

Retomada com sessão legada autenticada. O documento atualmente aberto contém a
imagem de teste temporária, mas permanece novo/sem identidade persistida. Para
evitar repetir o cenário inválido da R3, foi aberta a lista de modelos e feita
busca pelos termos `TESTE_EDITOR_REACT_ET3C_1788703615565` e `TESTE`; nenhum
recurso sintético persistido foi localizado.

Como não foi encontrado documento seguro existente, não foi possível provar o
baseline `texto mínimo → salvar → sucesso/reabertura`. A imagem temporária não
foi salva, nenhum documento clínico foi usado e nenhum dado persistente foi
alterado.

Resultados R4:

`PREVIOUS_SAVE_TEST_INVALID_FOR_IMAGE_PERSISTENCE = SIM`
`LEGACY_RUNTIME_AUTHENTICATED = SIM`
`LEGACY_TEST_DOCUMENT_IDENTITY_PROVEN = NÃO`
`LEGACY_TEST_DOCUMENT_SAVE_BASELINE = NOT_RUN`
`IMAGE_INSERTED_IN_PERSISTED_TEST_DOCUMENT = NÃO`
`LEGACY_IMAGE_SAVE_RUNTIME = NOT_RUN`
`LEGACY_IMAGE_SAVE_REOPEN = NOT_RUN`
`LEGACY_IMAGE_IN_PDF_RUNTIME = NOT_RUN`
`LEGACY_IMAGE_IN_PRINT_RUNTIME = NOT_RUN`
`READY_FOR_IMAGE_IMPLEMENTATION = NÃO`

## EDITOR_TEXTOS_IMAGE_AUDIT_R5

A sessão legada estava autenticada e o documento temporário com imagem foi
descartado sem salvamento, para não reutilizar o cenário anônimo da R3/R4.

Foi aberta a lista de modelos e não foi localizado recurso sintético persistido
seguro. Em seguida, pelo fluxo normal, foi iniciado `Novo` para criar o único
recurso autorizado `TESTE_IMAGEM_LEGADO_BRANA`, mas a aba legada deixou de
responder durante o clique e não permitiu confirmar o formulário nem inspecionar
o resultado.

Não houve criação confirmada, identidade, baseline de save, inserção em
documento persistido, save/reopen, PDF, impressão ou remoção. Não foi usado
endpoint direto, banco, documento clínico ou reinício de runtime.

Resultados R5:

`EDITOR_TEXTOS_IMAGE_AUDIT_R5_STATUS = BLOCKED`
`LEGACY_RUNTIME_AUTHENTICATED = SIM`
`LEGACY_SYNTHETIC_DOCUMENT_CREATED = NÃO`
`LEGACY_SYNTHETIC_DOCUMENT_NAME = TESTE_IMAGEM_LEGADO_BRANA`
`LEGACY_SYNTHETIC_DOCUMENT_ID = não disponível`
`LEGACY_SYNTHETIC_DOCUMENT_SAVE_REOPEN_BASELINE = NOT_RUN`
`IMAGE_INSERTED_IN_PERSISTED_TEST_DOCUMENT = NÃO`
`LEGACY_IMAGE_SAVE_RUNTIME = NOT_RUN`
`LEGACY_IMAGE_SAVE_REOPEN = NOT_RUN`
`LEGACY_IMAGE_IN_PDF_RUNTIME = NOT_RUN`
`LEGACY_IMAGE_IN_PRINT_RUNTIME = NOT_RUN`
`READY_FOR_IMAGE_IMPLEMENTATION = NÃO`

Nenhum código, CSS, React, backend ou banco foi alterado; não houve commit ou
push.

## EDITOR_TEXTOS_IMAGE_AUDIT_R7

Fechamento estático exclusivo dos três gaps remanescentes. Não houve novas
tentativas de runtime legado e nenhum código funcional foi alterado.

### A — Delete e dirty

O elemento de edição é `contenteditable` e a imagem não recebe um handler
especial de exclusão. `editorTextosPageKeyDown()` trata `Backspace`/`Delete`
somente para marcadores de tabulação; não há ramo para
`editorTextosCfg.imageSelectedEl`, `removeChild()` ou `remove()` da imagem.
Logo, o mecanismo aplicável é o comportamento nativo do contenteditable:

`LEGACY_IMAGE_DELETE_HANDLER = nenhum handler específico`

`LEGACY_IMAGE_DELETE_EVENT = keydown nativo do contenteditable`

`LEGACY_IMAGE_DELETE_TARGET = seleção DOM da imagem no contenteditable`

`LEGACY_IMAGE_DELETE_MECHANISM = NATIVE_CONTENTEDITABLE`

`LEGACY_IMAGE_DELETE_KEY = NO_SPECIAL_HANDLER`

`LEGACY_IMAGE_BACKSPACE = NO_SPECIAL_HANDLER`

Quando a edição nativa produz evento `input`, o listener global
`editorTextosCfg.page.addEventListener("input", markDirty)` marca
`editorTextosCfg.alterado=true`. A cadeia de dirty estática é, portanto,
`native contenteditable edit → input → markDirty → alterado=true`.

`LEGACY_IMAGE_DELETE_MARKS_DIRTY = PROVEN`

`LEGACY_IMAGE_DELETE_CONTRACT_PROVEN = SIM`

O contrato não inclui menu contextual ou toolbar de remoção de imagem.

### B — Undo/redo

Não foram localizados comandos, listeners ou estruturas de histórico
específicos para imagens. As alterações de imagem usam DOM (`insertNode`,
alteração de `style` e comportamento nativo do contenteditable), enquanto o
histórico granular de imagem não é implementado pelo código do módulo.

`LEGACY_IMAGE_INSERT_UNDO = NO_SPECIAL_IMAGE_HISTORY`

`LEGACY_IMAGE_RESIZE_UNDO = NO_SPECIAL_IMAGE_HISTORY`

`LEGACY_IMAGE_DELETE_UNDO = SUPPORTED_ONLY_BY_BROWSER_NATIVE`

`LEGACY_IMAGE_GRANULAR_UNDO_REQUIRED = NÃO`

`LEGACY_IMAGE_UNDO_REDO_CONTRACT_PROVEN = SIM`

Para o React, a política recomendada é usar transações/histórico do Tiptap:
inserção, remoção e alteração de dimensões devem ser operações ProseMirror,
permitindo undo/redo coerente sem depender da ausência de histórico específico
do legado.

### C — Ajustar à largura da página

O controle é criado em `frontend/js/modules/editor_textos_bootstrap.js`:

`<input id="editor-textos-image-fit" type="checkbox" checked>`

O estado é exposto como `editorTextosCfg.imageFit`; a decisão é consumida por
`editorTextosConfirmarInserirImagemArquivo()`, que chama
`editorTextosInserirImagemNoCursor(..., !!editorTextosCfg.imageFit.checked)`.

`LEGACY_FIT_PAGE_CHECKBOX_SYMBOL = #editor-textos-image-fit`

`LEGACY_FIT_PAGE_HANDLER = editorTextosConfirmarInserirImagemArquivo → editorTextosInserirImagemNoCursor`

`LEGACY_FIT_PAGE_DEFAULT = checked`

No branch marcado, a fórmula efetiva não usa `paginaConfig` nem margens em mm:

`LEGACY_FIT_PAGE_WIDTH_FORMULA = CSS max-width:100% relativo ao content box do editor`

`LEGACY_FIT_PAGE_HEIGHT_FORMULA = height:auto; o browser calcula a altura pela razão intrínseca da imagem`

`SOURCE_PAGE_WIDTH = editorTextosCfg.page/client content box via CSS`

`SOURCE_LEFT_MARGIN = não utilizado no cálculo`

`SOURCE_RIGHT_MARGIN = não utilizado no cálculo`

`LEGACY_FIT_PAGE_INPUT_UNIT = CSS layout width`

`LEGACY_FIT_PAGE_OUTPUT_UNIT = CSS width constraint; dimensões persistidas em px`

`LEGACY_FIT_PAGE_MM_TO_PX_FUNCTION = não utilizada pelo branch da imagem`

`LEGACY_FIT_PAGE_PRESERVES_ASPECT_RATIO = SIM`

`LEGACY_FIT_PAGE_CAN_UPSCALE = SIM, se o content box permitir largura maior que a renderização natural`

`LEGACY_FIT_PAGE_MAX_WIDTH_RULE = max-width:100%`

`LEGACY_FIT_PAGE_USES_PAGECONFIG = NÃO`

`LEGACY_FIT_PAGE_USES_DOM_WIDTH = SIM`

Assim, o gap R6 foi fechado como contrato real: o legado ajusta ao content box
visual, não à largura útil calculada por `largura_mm - margem_esquerda_mm -
margem_direita_mm`.

`LEGACY_IMAGE_FIT_PAGE_CONTRACT_PROVEN = SIM`

### Proposta React atualizada

`REACT_IMAGE_DELETE_POLICY = Delete/Backspace removem o image node selecionado por transação Tiptap; a mudança dispara dirty; sem confirmação adicional.`

`REACT_IMAGE_UNDO_REDO_POLICY = inserir, remover e resize usam transações do histórico Tiptap; undo restaura o estado anterior.`

`REACT_IMAGE_FIT_PAGE_FORMULA = max-width:100% relativo ao content box visual do editor, height:auto; não descontar PageConfig horizontal porque esse não é o contrato legado.`

Os três pontos da proposta estão definidos, mas a implementação React continua
fora desta rodada.

### Resultado R7

`UNPROVEN_IMAGE_ITEMS = []`

`MATERIAL_IMAGE_GAPS = []`

`EDITOR_TEXTOS_IMAGE_AUDIT_R7_STATUS = COMPLETE`

`READY_FOR_IMAGE_IMPLEMENTATION = SIM`

Nenhum arquivo de código, CSS, React, backend ou banco foi alterado. Não houve
reinício de Vite/backend, commit ou push.

## EDITOR_TEXTOS_IMAGE_AUDIT_R6

Auditoria estática dirigida, sem novas tentativas de runtime legado instável.

### Save, token e reopen

`editorTextosConteudoParaSalvar()` obtém o HTML atual e chama
`editorTextosSerializarHtmlComImagens()` quando há imagens. O serializador lê
`data-editor-img-data` (fallback `src`), valida `data:image/...;base64`, obtém
largura/altura do `style` ou do `getBoundingClientRect()` e substitui cada
imagem por:

`[[IMGDATA:<data-url>|w=<inteiro>|h=<inteiro>]]`

O texto resultante segue no campo `conteudo`, com
`conteudo_formato: "html"`, para `POST /editor-textos/modelos` (novo) ou
`PUT /editor-textos/modelos/{id}` (existente). O carregamento usa
`GET /editor-textos/modelos/{id}` e `editorTextosAplicarConteudo()`; quando
detecta `[[IMGDATA:`, chama `editorTextosExpandirTokensImagemHtml()`.
Esse parser separa o primeiro segmento como data URL, aceita `w=\d+` e
`h=\d+`, escapa o valor e reconstrói `<img>` com `src`,
`data-editor-img-data`, classe de imagem e estilos em pixels.

`LEGACY_IMAGE_SAVE_CONTRACT = PROVEN_BY_STATIC_CHAIN`

`LEGACY_IMAGE_SAVE_REOPEN = PROVEN_BY_STATIC_CHAIN`

`LEGACY_IMAGE_TOKEN_CONTRACT_PROVEN = SIM`

Contrato efetivo: prefixo `[[IMGDATA:`, separador `|`, chaves `w=`/`h=` e
sufixo `]]`. MIME/data URL base64 são preservados; dimensões são inteiros
positivos em pixels e podem ser omitidas.

### Fit page

`editorTextosInserirImagemNoCursor(dataUrl,fileName,fitToPage)` aplica, quando o
checkbox está marcado, `max-width:100%` e `height:auto`; a altura é calculada
pelo navegador mantendo a proporção. `editorTextosAplicarConfiguracaoPagina()`
usa margens horizontais para a régua, mas não as aplica como padding horizontal
do content box. Logo, a regra CSS de ajuste está provada, mas não uma fórmula
de largura útil descontando margens:

`LEGACY_IMAGE_FIT_PAGE_FUNCTION = editorTextosInserirImagemNoCursor`

`LEGACY_IMAGE_FIT_PAGE_WIDTH_FORMULA = max-width:100% relativo ao content box`

`LEGACY_IMAGE_FIT_PAGE_HEIGHT_FORMULA = auto proporcional ao src`

`LEGACY_IMAGE_FIT_PAGE_USES_PAGE_MARGINS = NÃO`

`LEGACY_IMAGE_FIT_PAGE_CONTRACT_PROVEN = NÃO` para a interpretação que exige
desconto das margens.

### Delete e undo

`editorTextosPageKeyDown()` possui ramos `Backspace`/`Delete` para marcadores de
tabulação, mas não há ramo que remova `editorTextosCfg.imageSelectedEl`, nem
comando de remoção de imagem localizado. O overlay seleciona e redimensiona a
imagem. A cadeia estática de remoção, dirty após remoção e undo/redo granular
de imagem permanece ausente:

`LEGACY_IMAGE_DELETE_CONTRACT_PROVEN = NÃO`

`LEGACY_IMAGE_INSERT_UNDO = UNPROVEN`

`LEGACY_IMAGE_RESIZE_UNDO = UNPROVEN`

`LEGACY_IMAGE_DELETE_UNDO = UNPROVEN`

Inserção e resize marcam `editorTextosCfg.alterado=true`; não foi localizado
handler equivalente para delete de imagem.

### PDF e impressão

O PDF normal percorre `editorTextosExportarPdfAtual()` →
`editorTextosSolicitarPdfAtual()` → `POST /editor-textos/exportar-pdf`.
O payload leva `conteudo` com tokens, e o backend usa
`IMG_TOKEN_PATTERN` → `_extract_data_url_image_bytes()` →
`_append_image_story()` → `reportlab.platypus.Image`, lendo data URL e `w`/`h`
e limitando ao `available_width`. Quando snapshot é solicitado, o frontend
materializa as imagens em `page_snapshot_html` e o backend prioriza esse HTML.

`LEGACY_IMAGE_PDF_CONTRACT = PROVEN_BY_STATIC_CHAIN`

`LEGACY_IMAGE_PDF_ENTRY = editorTextosExportarPdfAtual → editorTextosSolicitarPdfAtual → POST /editor-textos/exportar-pdf`

`LEGACY_IMAGE_PDF_HTML_SOURCE = conteudo com IMGDATA ou page_snapshot_html`

`LEGACY_IMAGE_PDF_TOKEN_EXPANSION = IMG_TOKEN_PATTERN + _extract_data_url_image_bytes`

`LEGACY_IMAGE_PDF_RENDERER = ReportLab RLImage ou Chromium para snapshot`

`editorTextosImprimirAtual()` obtém o conteúdo mesclado, expande tokens via
`editorTextosExpandirTokensImagemHtml()`, escreve o HTML em janela própria e
chama `popup.print()`:

`LEGACY_IMAGE_PRINT_CONTRACT = PROVEN_BY_STATIC_CHAIN`

`LEGACY_IMAGE_PRINT_ENTRY = editorTextosImprimirAtual`

`LEGACY_IMAGE_PRINT_HTML_SOURCE = conteúdo mesclado`

`LEGACY_IMAGE_PRINT_TOKEN_EXPANSION = editorTextosExpandirTokensImagemHtml`

### React e proposta

O React possui o item visual `image`/`PictureOutlined` em
`EditorTextosPrimaryToolbar`, mas sem handler conectado. Não há extensão Image,
NodeView, resize ou suporte IMGDATA no `LegacyHtmlAdapter`; este apenas
normaliza HTML. O save atual pode ser reutilizado depois que a imagem for
convertida para o contrato legado.

`REACT_IMAGE_CURRENT_STATE = PLACEHOLDER`

`REACT_TIPTAP_IMAGE_SUPPORT = NÃO PROVEN / não conectado`

`REACT_LEGACY_HTML_IMAGE_SUPPORT = NÃO`

Recomendação: `EditorTextosImageDialog` para arquivo único, formatos
comprovados, limite de 4 MB e checkbox; `EditorImageAdapter` para validação,
`FileReader.readAsDataURL()` e cálculo; extensão/NodeView customizada com
`src`, `width`, `height`, seleção, oito handles e resize proporcional por
transações Tiptap. O `LegacyHtmlAdapter` deve importar/exportar IMGDATA e os
pipelines atuais de save, reopen, PDF e print devem ser reutilizados. Não há
necessidade comprovada de upload, endpoint ou tabela:

`NEW_BACKEND_REQUIRED = NÃO`

### Resultado R6

`REACT_IMPLEMENTATION_PROPOSAL_COMPLETE = SIM`

`MISSING_STATIC_CHAIN_LINK = [remoção/dirty de imagem; undo/redo granular de imagem; fórmula de fit page descontando margens]`

`UNPROVEN_IMAGE_ITEMS = [delete/backspace/context-menu de imagem; undo/redo de imagem; fit-page com margem horizontal]`

`MATERIAL_IMAGE_GAPS = [contrato de remoção/histórico; regra exata de largura útil]`

`EDITOR_TEXTOS_IMAGE_AUDIT_R6_STATUS = INCOMPLETE`

`READY_FOR_IMAGE_IMPLEMENTATION = NÃO`

Nenhum código, CSS, React, backend ou banco foi alterado; não houve reinício de
runtime, commit ou push.

Nenhum código, CSS, React, backend ou banco foi alterado; não houve reinício de
runtime, commit ou push.

## EDITOR_TEXTOS_IMAGE_AUDIT_R3

Retomada assistida com a aba legada autenticada e sem repetir o seletor de
arquivo. A imagem `Elevar_sombrancelhas (1).jpg` já estava selecionada no modal
e foi confirmada uma única vez.

Evidências runtime:

- inserção concluída: `Imagem inserida.`;
- imagem original: 720×678 px;
- com “Ajustar à largura da página” marcado, render inicial: 548×516 px;
- seleção da imagem exibiu overlay com oito handles (`nw`, `n`, `ne`, `e`,
  `se`, `s`, `sw`, `w`);
- resize lateral controlado: 548×516 → 568×535 px, mantendo proporção;
- o documento era novo/sem nome visível, portanto não foi atribuído recurso
  persistente durante este teste.

Ao acionar o comando normal `Salva`, o legado respondeu `Token nao informado` e
retornou à tela de autenticação. Não houve save/reopen, alteração persistida em
banco, PDF ou impressão. A aba não foi autenticada novamente nem houve
contorno de sessão.

Resultados R3:

`LEGACY_RUNTIME_AUTHENTICATED = SIM` no início da retomada
`LEGACY_IMAGE_RUNTIME_INSERT = PASS`
`LEGACY_IMAGE_RUNTIME_RESIZE = PASS`
`LEGACY_IMAGE_SAVE_RUNTIME = FAIL — Token nao informado`
`LEGACY_IMAGE_SAVE_REOPEN = NOT_RUN`
`LEGACY_IMAGE_IN_PDF_RUNTIME = NOT_RUN`
`LEGACY_IMAGE_IN_PRINT_RUNTIME = NOT_RUN`
`LEGACY_IMAGE_DELETE_CONTRACT_PROVEN = NÃO`
`LEGACY_IMAGE_TOKEN_CONTRACT_PROVEN = NÃO`
`READY_FOR_IMAGE_IMPLEMENTATION = NÃO`

Nenhum código, CSS, React, backend ou banco foi alterado; não houve commit ou
push.

## EDITOR_TEXTOS_IMAGE_AUDIT_R2

O frontend legado foi confirmado autenticado nesta retomada. O botão real
`#editor-textos-btn-imagem` abriu o modal `Inserir imagem`, com:

- campo `Arquivo:` e botão `Escolher...`;
- seleção de arquivo único;
- checkbox `Ajustar à largura da página`, marcado por padrão;
- indicação de formatos `BMP, JPG, PNG, GIF e WEBP`;
- ações `Ok` e `Cancela`.

Foi selecionado o asset de teste seguro `frontend-react/public/assets/fichaClinica/icon_combo.png`.
A confirmação do modal excedeu o tempo de resposta da aba legada e a operação
não foi considerada concluída. Portanto inserção, resize, remoção, save/reopen,
PDF e impressão continuam sem PASS runtime nesta rodada.

O código legado confirma a cadeia `FileReader.readAsDataURL()` → `<img>` inline
→ serialização para `[[IMGDATA:<data-url>|w=<px>|h=<px>]]`; a leitura do token
reconstrói a imagem `data:`. Não foi impresso conteúdo base64.

`LEGACY_RUNTIME_AUTHENTICATED = SIM`
`LEGACY_IMAGE_RUNTIME_INSERT = NOT_RUN`
`LEGACY_IMAGE_RUNTIME_RESIZE = NOT_RUN`
`LEGACY_IMAGE_SAVE_REOPEN = NOT_RUN`
`LEGACY_IMAGE_IN_PDF_RUNTIME = NOT_RUN`
`LEGACY_IMAGE_IN_PRINT_RUNTIME = NOT_RUN`
`READY_FOR_IMAGE_IMPLEMENTATION = NÃO`

Nenhum código, CSS, backend, banco ou runtime foi alterado; não houve commit ou
push.
