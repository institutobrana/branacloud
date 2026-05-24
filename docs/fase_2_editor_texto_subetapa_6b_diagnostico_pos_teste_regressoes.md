# Fase 2 - Editor de texto - Subetapa 6B - Diagnostico pos-teste das regressões apos recorte Bootstrap

## Contexto
A Subetapa 6 criou o primeiro recorte real minimo do Bootstrap/abertura do Editor de texto.
A Subetapa 6A corrigiu a tela vazia/cinza no modo standalone, permitindo que o painel voltasse a abrir em `/app?editor_textos=1`.
Depois do teste humano apos a 6A, surgiram sintomas funcionais que precisam ser diagnosticados por leitura antes de qualquer correção.

Commits relacionados:
- `3d36720` - Extrai bootstrap minimo do editor de texto
- `bb2d3c8` - Corrige abertura standalone do editor de texto

## Sintomas relatados pelo usuario
1. A tecla TAB apresenta problema.
2. Ao selecionar um texto e mudar a cor, a cor nao muda.
3. Ao tentar gerar uma receita, o combo/lista de medicamentos nao apareceu na tela.

## Classificacao dos sintomas
- TAB: pre-existente, conforme informado pelo usuario, sem evidencias suficientes nesta leitura para atribuir regressao direta ao recorte 6/6A.
- Cor do texto selecionado: provavel regressao ou problema exposto pelo recorte Bootstrap, com necessidade de nova confirmacao humana.
- Receita sem combo/lista de medicamentos: provavel regressao ou problema exposto pelo recorte Bootstrap, com forte indicio de DOM recriado incompleto.

## Arquivos lidos
- `docs/fase_2_editor_texto_subetapa_6_primeiro_recorte_bootstrap.md`
- `docs/fase_2_editor_texto_subetapa_6a_correcao_standalone_blank.md`
- `docs/fase_2_editor_texto_subetapa_5_plano_cirurgico_bootstrap.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `frontend/js/modules`
- `backend/routes/editor_textos_routes.py`

## Diagnostico da tecla TAB
A rotina de TAB continua concentrada em `editorTextosPageKeyDown(ev)` em `frontend/app.js`.
Essa funcao:
- captura selecao raw no keydown;
- registra `pendingTabSelectionRaw`;
- tenta a navegacao semantica com `editorTextosParagrafoTabAvancar()` e `editorTextosParagrafoTabRecuar()`;
- faz fallback para logica estrutural de blocos, recuo, quebra de linha e manipulacao textual.

Classificacao:
- problema informado como pre-existente;
- nao ha evidencia nesta leitura de que a Subetapa 6 ou 6A tenham introduzido a falha;
- a leitura sugere que a area ja era sensivel antes do recorte Bootstrap.

Hipotese tecnica mais provavel:
- a TAB depende de um motor semantico/textual grande e de estado de selecao/cursor;
- o comportamento pode falhar por fragilidade historica da propria rotina, nao necessariamente por regressao recente.

## Diagnostico da cor do texto selecionado
A mudanca de cor passa por:
- `editorTextosCfg.color.addEventListener("change", ...)`
- `runCmd("foreColor", color)`
- `editorTextosRestaurarRangeAtual()`
- `editorTextosCfg.page.focus()`
- `document.execCommand("styleWithCSS", false, true)`
- `document.execCommand("foreColor", false, val)`
- fallback `editorTextosAplicarCorSelecaoFallback(...)`
- sincronizacao posterior em `editorTextosAgendarSincronizarToolbar()` e `editorTextosSincronizarToolbarFormato()`

Funcoes/seletores/DOM envolvidos:
- `#editor-textos-color`
- `#editor-textos-color-swatch`
- `editorTextosCfg.color`
- `editorTextosCfg.colorSwatch`
- `editorTextosCfg.page`
- `editorTextosAplicarCorSelecaoFallback()`
- `editorTextosAgendarSincronizarToolbar()`
- `editorTextosSincronizarToolbarFormato()`

Leitura tecnica:
- o shell recriado pela Subetapa 6A inclui os seletores de cor, entao o problema nao parece ser simples ausencia de DOM da toolbar de cor;
- a hipoteses mais provavel e que o recorte tenha exposto fragilidade de selecao/foco ao acionar a mudanca de cor, especialmente se o range nao estiver preservado no momento do `change`;
- outra hipoteses secundaria e que `execCommand("foreColor")` ou o fallback estejam operando sobre a selecao errada apos a restauracao do shell.

Classificacao:
- provavel regressao ou problema exposto pelo recorte Bootstrap;
- precisa de novo teste humano para confirmar se a falha e generalizada ou apenas em certas selecoes.

## Diagnostico da receita sem combo/lista de medicamentos
A leitura do bootstrap recriado mostra que o shell atual inclui:
- `#editor-textos-assist-backdrop`
- `#editor-textos-assist-medmenu-backdrop`
- `#editor-textos-assist-medmenu-filtro`
- `#editor-textos-assist-medmenu-q`
- `#editor-textos-assist-medmenu-alpha`
- `#editor-textos-assist-medmenu-tbody`
- `#editor-textos-assist-medmenu-ok`
- `#editor-textos-assist-medmenu-cancelar`

Mas o codigo principal de receitas continua esperando:
- `editorTextosCfg.assistMedicamento`
- `editorTextosCfg.assistMedicamentoBtn`
- `editorTextosAssistAbrirMenuMedicamentos()`
- `editorTextosAssistCarregarContexto()`
- `editorTextosAssistAplicarMedicamentoSelecionado()`
- `editorTextosAssistAtualizarAcoes()`

Elementos DOM esperados pelo assistente de receitas:
- `#editor-textos-assist-medicamento`
- `#editor-textos-assist-medicamento-btn`
- `#editor-textos-assist-cirurgiao`
- `#editor-textos-assist-modelo`
- `#editor-textos-assist-paciente`
- `#editor-textos-assist-paciente-btn`
- `#editor-textos-assist-prescricao`
- `#editor-textos-assist-quantidade`
- `#editor-textos-assist-uso`
- `#editor-textos-assist-obs`
- `#editor-textos-assist-status`
- `#editor-textos-assist-medmenu-*`

Comparacao entre DOM esperado e DOM recriado no bootstrap:
- o assistente de receitas foi recriado em parte, mas o combo principal de medicamentos nao foi recriado;
- o shell recriado contem o menu de medicamentos, mas nao o select principal que o restante do fluxo usa;
- isso explica a ausencia da lista/combo na tela e tambem o risco de quebra no fluxo de carregar contexto, selecionar medicamento e aplicar prescricao.

Comparacao tecnica consultada:
- `git diff 3d36720..bb2d3c8 -- frontend/js/modules/editor_textos_bootstrap.js`
- `git show 3d36720:frontend/app.js`
- `git show 3d36720:frontend/js/modules/editor_textos_bootstrap.js`
- `git show bb2d3c8:frontend/js/modules/editor_textos_bootstrap.js`

Hipotese tecnica mais provavel:
- regressao exposta pelo recorte Bootstrap devido a DOM recriado incompleto para o assistente de receitas;
- o elemento `assistMedicamento` foi preservado no codigo de orquestracao, mas nao foi materializado no shell recriado;
- o fluxo de medicamentos fica sem a base visual esperada, impedindo a aparicao do combo/lista.

## Funcoes e seletores envolvidos
### Cor
- `editorTextosCfg.color`
- `editorTextosCfg.colorSwatch`
- `runCmd("foreColor", ...)`
- `editorTextosRestaurarRangeAtual()`
- `editorTextosSalvarRangeAtual()`
- `editorTextosAplicarCorSelecaoFallback()`
- `editorTextosAgendarSincronizarToolbar()`
- `editorTextosSincronizarToolbarFormato()`

### TAB
- `editorTextosPageKeyDown(ev)`
- `editorTextosParagrafoCapturarSelectionRawNoKeydown()`
- `editorTextosParagrafoTabAvancar()`
- `editorTextosParagrafoTabRecuar()`
- `editorTextosParagrafoBackspaceSemantico()`
- `editorTextosGarantirBlocosEstruturais()`

### Receita
- `editorTextosAssistAbrirMenuMedicamentos()`
- `editorTextosAssistCarregarContexto()`
- `editorTextosAssistAplicarMedicamentoSelecionado()`
- `editorTextosAssistAtualizarAcoes()`
- `editorTextosAssistSelecionarPaciente()`
- `editorTextosAssistMontarItemAtual()`
- `editorTextosAssistIncluirAtual()`

## Elementos DOM e modais esperados
- `#editor-textos-panel`
- `#editor-textos-page`
- `#editor-textos-status`
- `#editor-textos-color`
- `#editor-textos-color-swatch`
- `#editor-textos-assist-backdrop`
- `#editor-textos-assist-medmenu-backdrop`
- `#editor-textos-assist-medicamento`
- `#editor-textos-assist-medicamento-btn`
- `#editor-textos-assist-cirurgiao`
- `#editor-textos-assist-modelo`
- `#editor-textos-assist-paciente`
- `#editor-textos-assist-prescricao`
- `#editor-textos-assist-quantidade`
- `#editor-textos-assist-uso`
- `#editor-textos-assist-obs`
- `#editor-textos-assist-status`
- `#editor-textos-atestado-backdrop`
- `#editor-textos-atestado-cidmenu-backdrop`

## Riscos de corrigir tudo junto
- TAB e cor dependem de interacao direta com selecao e foco no editor rico.
- Receita depende de DOM, contexto clinico e carregamento de medicamentos.
- Corrigir tudo em um unico patch tornaria o diff pouco auditavel e poderia mascarar a causa real de cada sintoma.
- Uma correcao ampla aumentaria o risco de tocar em contenteditable, toolbar, fallback de comando e shell visual ao mesmo tempo.

## Recomendacao de ordem de correcao
1. Confirmar e corrigir o DOM do assistente de receitas, adicionando o combo principal de medicamentos ao shell recriado, se o teste humano confirmar a ausencia atual.
2. Revalidar a mudanca de cor com foco/selecao preservados.
3. Tratar a TAB separadamente, como problema pre-existente, so apos novo teste humano e sem misturar com o recorte Bootstrap.

## Separacao entre problemas
- Pre-existente: TAB.
- Possiveis regressões pos-recorte: cor do texto e ausencia do combo/lista de medicamentos.
- Precisam de novo teste humano: confirmar se a cor falha apenas apos clicar na toolbar e se a receita falha por ausencia de DOM ou por outra condicao de contexto.

## Proxima subetapa recomendada
Subetapa 6C, de correcao seletiva e pequena, priorizando o assistente de receitas e o DOM faltante do medicamento principal, seguida de novo teste humano em `Ferramentas > Editor de textos` e em `/app?editor_textos=1`.

## Onde testar
O teste humano deve começar em `Ferramentas > Editor de textos`.
Tambem deve ser validado o acesso direto em `/app?editor_textos=1`.

Validacoes minimas:
- tecla TAB dentro do editor;
- selecao de texto e troca de cor;
- assistente de receitas;
- presenca do combo/lista de medicamentos;
- abertura standalone em `/app?editor_textos=1`;
- console sem erros.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- A Subetapa 6 foi concluida no commit `3d36720`.
- A Subetapa 6A foi concluida no commit `bb2d3c8`.
- O teste humano apos 6A confirmou que a tela abre, mas encontrou problemas funcionais.
- TAB foi registrado como problema pre-existente informado pelo usuario.
- Cor do texto selecionado e combo de medicamentos em receitas devem ser diagnosticados como possiveis regressões ou problemas expostos pelo recorte Bootstrap.
- Esta Subetapa 6B e exclusivamente documental/diagnostica.
- Nenhum codigo foi alterado.
- Nenhuma correcao textual/mojibake foi feita.
- Nenhum backend/banco/endpoint/permissao/sessao/clinica/usuario foi alterado.
- A proxima correcao deve ser pequena, seletiva e baseada no diagnostico.

## Commit seletivo obrigatorio
- Somente o arquivo `docs/fase_2_editor_texto_subetapa_6b_diagnostico_pos_teste_regressoes.md` deve entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para esse documento.
- Confirmar antes do commit que nao ha alteracoes rastreadas indevidas.
- Confirmar depois do commit quais arquivos entraram.
