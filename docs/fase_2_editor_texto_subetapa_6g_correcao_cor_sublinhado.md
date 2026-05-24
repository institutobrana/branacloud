# Fase 2 - Editor de texto - Subetapa 6G - Correcao seletiva da cor do sublinhado ao aplicar cor no texto selecionado

## Contexto
Esta subetapa continua a linha documental da Fase 2 no Editor de texto, ainda classificado preliminarmente como modulo comum/core.
A Subetapa 6 criou o primeiro recorte real minimo do Bootstrap/abertura.
A Subetapa 6A corrigiu a tela vazia/cinza no standalone.
A Subetapa 6B diagnosticou regressões pos-teste.
A Subetapa 6C corrigiu o combo/lista de medicamentos em receitas.
A Subetapa 6D restaurou a tela de receitas e localizou o armazenamento do RECEITA_TEL_BRANA.
A Subetapa 6E tentou corrigir a cor do texto selecionado.
A Subetapa 6F corrigiu a aplicação de cor em texto selecionado e o resíduo inicial/mojibake da toolbar de cor.

## Commits relacionados
- `3d36720` - Extrai bootstrap minimo do editor de texto
- `bb2d3c8` - Corrige abertura standalone do editor de texto
- `74ca368` - Diagnostica regressoes pos recorte do editor
- `0c18046` - Corrige combo de medicamentos em receitas
- `ace1fbe` - Restaura tela de receitas do editor
- `bd6c6e0` - Corrige cor do texto selecionado no editor
- `af8c823` - Corrige cor selecionada e residuo da toolbar

## Sintoma relatado pelo usuario
- O texto selecionado muda de cor, mas o sublinhado permanece preto.

## Comparacao feita
Foi feita comparacao com o estado anterior ao recorte `3d36720` e com as Subetapas 6E e 6F.
A leitura mostrou que a aplicacao de cor usa `foreColor` com restauracao de range e fallback DOM, enquanto o sublinhado do trecho selecionado pode continuar com sua propria decoracao e cor herdada.

## Causa confirmada ou hipotese tecnica final
A causa mais provavel era que a selecao sublinhada, ao receber a cor, mantinha a decoracao de underline sem herdar a mesma cor do texto.
O fallback DOM aplicava apenas `color`, o que nao era suficiente para o underline acompanhar a cor escolhida em trechos ja sublinhados.

## Arquivos lidos
- `docs/fase_2_editor_texto_subetapa_6f_correcao_cor_selecao_residuo_toolbar.md`
- `docs/fase_2_editor_texto_subetapa_6e_correcao_cor_texto_selecionado.md`
- `docs/fase_2_editor_texto_subetapa_6d_correcao_receitas_localizacao_modelo.md`
- `docs/fase_2_editor_texto_subetapa_6b_diagnostico_pos_teste_regressoes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `frontend/js/modules`

## Arquivos alterados
- `frontend/app.js`
- `docs/fase_2_editor_texto_subetapa_6g_correcao_cor_sublinhado.md`

## Descricao exata da correcao
1. O fallback de cor passou a aplicar `textDecorationColor` junto com `color` tanto no caso colapsado quanto no trecho selecionado.
2. A rotina de `foreColor` passou a detectar selecao sublinhada e a usar o fallback DOM nesse caso, para que o underline acompanhe a cor escolhida.
3. O comportamento de cor em texto sem sublinhado permaneceu inalterado.
4. O comportamento de digitar texto novo apos escolher cor permaneceu inalterado.

## Confirmacoes
- A correcao ficou restrita à cor do sublinhado no texto selecionado.
- TAB nao foi tratado.
- Receitas nao foram tratadas.
- `RECEITA_TEL_BRANA` nao foi tratado.
- Backend e endpoints nao foram alterados.
- Banco, schema, migrations e seeds nao foram alterados.
- Nao houve correção textual ampla nem ajuste de mojibake.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules/editor_textos_bootstrap.js` nao foi alterado.

## Checks executados
- `git show 3d36720^:frontend/app.js`
- `git show 3d36720^:frontend/index.html`
- `git show bd6c6e0 -- frontend/app.js`
- `git show af8c823 -- frontend/app.js`
- `git diff bd6c6e0..af8c823 -- frontend/app.js`
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
- criar ou selecionar texto sublinhado;
- aplicar cor vermelha;
- confirmar que texto e sublinhado ficam vermelhos;
- repetir com outra cor;
- confirmar que texto sem sublinhado continua recebendo cor normalmente;
- alterar cor sem selecao e digitar para confirmar que texto novo continua na cor escolhida;
- confirmar que o sublinhado normal continua funcionando;
- confirmar que a toolbar nao quebrou;
- console sem erros.

## Proxima subetapa recomendada
A proxima etapa so deve ocorrer se o teste humano confirmar o comportamento esperado. Caso haja persistencia de algum detalhe, a correcao seguinte deve continuar pequena e seletiva.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- A Subetapa 6 foi concluída no commit `3d36720`.
- A Subetapa 6A foi concluída no commit `bb2d3c8`.
- A Subetapa 6B foi concluída no commit `74ca368`.
- A Subetapa 6C foi concluída no commit `0c18046`.
- A Subetapa 6D foi concluída no commit `ace1fbe`.
- A Subetapa 6E foi concluída no commit `bd6c6e0`.
- A Subetapa 6F foi concluída no commit `af8c823`.
- Esta Subetapa 6G corrige seletivamente a cor do sublinhado ao aplicar cor em texto selecionado.
- TAB permanece registrado como problema pré-existente e fora desta correção.
- Receitas permanecem fora desta correção.
- `RECEITA_TEL_BRANA` permanece fora desta correção.
- Editor de texto continua classificado como comum/core.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario deve ser alterado.
- Nenhuma correção textual ampla ou de mojibake deve ser feita.
- A próxima etapa só pode avançar depois de novo teste humano em `Ferramentas > Editor de textos` e em `/app?editor_textos=1`.

## Commit seletivo obrigatório
- Somente os arquivos desta etapa devem entrar no commit.
- Não usar `git add .`.
- Não usar `git add docs/`.
- Usar `git add` seletivo somente para os arquivos realmente alterados/criados.
- Confirmar antes do commit que não há alterações indevidas.
- Confirmar depois do commit quais arquivos entraram.
