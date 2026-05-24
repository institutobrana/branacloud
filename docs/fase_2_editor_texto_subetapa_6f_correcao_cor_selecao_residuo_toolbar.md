# Fase 2 - Editor de texto - Subetapa 6F - Correcao controlada da cor em texto selecionado e residuo inicial na toolbar

## Contexto
Esta subetapa da Fase 2 continua focada no Editor de texto, mantido preliminarmente como modulo comum/core.
A Subetapa 6 criou o primeiro recorte real minimo do Bootstrap/abertura.
A Subetapa 6A corrigiu a tela vazia/cinza no standalone.
A Subetapa 6B diagnosticou as regressões pos-teste.
A Subetapa 6C corrigiu o combo/lista de medicamentos em receitas.
A Subetapa 6D restaurou a tela de receitas e localizou o armazenamento do RECEITA_TEL_BRANA.
A Subetapa 6E tentou corrigir a cor do texto selecionado, mas o teste humano indicou que o caso ainda nao estava fechado.

## Commits relacionados
- `3d36720` - Extrai bootstrap minimo do editor de texto
- `bb2d3c8` - Corrige abertura standalone do editor de texto
- `74ca368` - Diagnostica regressoes pos recorte do editor
- `0c18046` - Corrige combo de medicamentos em receitas
- `ace1fbe` - Restaura tela de receitas do editor
- `bd6c6e0` - Corrige cor do texto selecionado no editor

## Sintomas relatados pelo usuario
- A cor funciona para texto novo digitado apos escolher a cor sem selecao.
- A cor nao era aplicada corretamente sobre texto ja selecionado.
- Um texto estranho/mojibake aparecia ao lado do campo de cor na abertura inicial vazia.
- Esse texto estranho desaparecia depois que um modelo era carregado.

## Comparacao feita
Foi feita comparacao com o estado anterior ao recorte `3d36720` e com a tentativa da Subetapa 6E no commit `bd6c6e0`.
A leitura mostrou que o controle de cor do editor usa um combo auxiliar construido em `auxCorApresentacaoMontarCombo()`, e que o snapshot de selecao precisa ser feito sobre a interacao visivel do combo, nao apenas sobre o `select` oculto.

## Causa confirmada ou hipotese tecnica final
### Cor em texto selecionado
A causa foi a perda do range util quando a interacao com a toolbar de cor passava pelo combo auxiliar visivel. O `select` em si recebe o `change`, mas quem realmente rouba o foco e a selecao e o `button`/lista gerados por `auxCorApresentacaoMontarCombo()`. A cor so passava a funcionar para texto novo porque, nesse caso, o `foreColor` ficava como estado futuro do editor, nao dependente da selecao ja existente.

### Residuo inicial na toolbar
O texto estranho ao lado da cor vinha do indicador visual do combo de cor, montado com um conteudo corrompido no botao auxiliar. Esse residuo aparecia na abertura vazia e desaparecia depois que um modelo era carregado, indicando problema de montagem/estado inicial do DOM da toolbar, nao de texto funcional do editor.

## Arquivos lidos
- `docs/fase_2_editor_texto_subetapa_6e_correcao_cor_texto_selecionado.md`
- `docs/fase_2_editor_texto_subetapa_6d_correcao_receitas_localizacao_modelo.md`
- `docs/fase_2_editor_texto_subetapa_6b_diagnostico_pos_teste_regressoes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/fase_2_editor_texto_subetapa_6_primeiro_recorte_bootstrap.md`
- `docs/fase_2_editor_texto_subetapa_6a_correcao_standalone_blank.md`
- `docs/fase_2_editor_texto_subetapa_6c_correcao_receitas_combo_medicamentos.md`
- `docs/fase_2_editor_texto_subetapa_5_plano_cirurgico_bootstrap.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `frontend/js/modules`

## Arquivos alterados
- `frontend/app.js`
- `docs/fase_2_editor_texto_subetapa_6f_correcao_cor_selecao_residuo_toolbar.md`

## Descricao exata da correcao
1. O snapshot de selecao para a cor passou a ser preparado na interacao real com o combo visivel da toolbar, nao apenas no `select` oculto.
2. O `runCmd("foreColor", ...)` continuou restaurando o range salvo antes de aplicar a cor.
3. O indicador visual do combo de cor foi normalizado para um simbolo simples e correto, removendo o resquicio mojibake que aparecia ao lado do campo.

## Confirmacoes
- TAB nao foi tratado.
- Receitas nao foram tratadas.
- `RECEITA_TEL_BRANA` nao foi tratado.
- `frontend/index.html` nao precisou ser alterado.
- `frontend/js/modules/editor_textos_bootstrap.js` nao precisou ser alterado.
- Backend e endpoints nao foram alterados.
- Banco, schema, migrations e seeds nao foram alterados.
- Nao houve correção textual ampla nem ajuste de mojibake fora do resquicio especifico da toolbar.

## Checks executados
- `git show 3d36720^:frontend/app.js`
- `git show 3d36720^:frontend/index.html`
- `git show bd6c6e0 -- frontend/app.js`
- `git diff ace1fbe..bd6c6e0 -- frontend/app.js`
- `git diff 3d36720^..HEAD -- frontend/app.js frontend/index.html frontend/js/modules/editor_textos_bootstrap.js`
- `git status --short`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- backend`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/editor_textos_bootstrap.js`

## Plano de teste humano obrigatorio
Testar em `Ferramentas > Editor de textos` e em `http://127.0.0.1:8000/app?editor_textos=1`.
Validar especialmente:
- abrir editor vazio e confirmar que o texto estranho ao lado do campo de cor nao aparece;
- selecionar texto existente e mudar a cor;
- confirmar que a cor aplicada aparece no texto selecionado;
- repetir com mais de uma cor;
- alterar cor sem selecao e digitar para confirmar que texto novo continua na cor escolhida;
- confirmar que a selecao/foco do editor continua funcionando;
- confirmar que a toolbar nao quebrou;
- console sem erros.

## Proxima subetapa recomendada
A recomendacao e apenas validacao humana completa desta correcao. Se algum sintoma persistir, a proxima etapa deve ser uma nova correcao pequena e seletiva, sem abrir recorte funcional maior.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- A Subetapa 6 foi concluida no commit `3d36720`.
- A Subetapa 6A foi concluida no commit `bb2d3c8`.
- A Subetapa 6B foi concluida no commit `74ca368`.
- A Subetapa 6C foi concluida no commit `0c18046`.
- A Subetapa 6D foi concluida no commit `ace1fbe`.
- A Subetapa 6E foi concluida no commit `bd6c6e0`, mas o teste humano mostrou que a cor em texto selecionado ainda nao estava fechada.
- Esta Subetapa 6F corrige seletivamente a cor em texto selecionado e o residuo inicial ao lado do campo de cor.
- TAB permanece registrado como problema pre-existente e fora desta correcao.
- Receitas permanecem fora desta correcao.
- `RECEITA_TEL_BRANA` permanece fora desta correcao.
- Editor de texto continua classificado como comum/core.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario deve ser alterado.
- Nenhuma correcao textual ampla ou de mojibake deve ser feita.
- A proxima etapa so pode avancar depois de novo teste humano em `Ferramentas > Editor de textos` e em `/app?editor_textos=1`.

## Commit seletivo obrigatorio
- Somente os arquivos desta etapa devem entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para os arquivos realmente alterados/criados.
- Confirmar antes do commit que nao ha alteracoes indevidas.
- Confirmar depois do commit quais arquivos entraram.
