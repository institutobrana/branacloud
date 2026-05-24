# Fase 2 - Editor de texto - Subetapa 6E - Diagnostico e correcao seletiva da cor do texto selecionado

## Contexto
A Subetapa 6 executou o primeiro recorte real minimo do Bootstrap/abertura do Editor de texto.
A Subetapa 6A corrigiu a tela vazia/cinza no modo standalone.
A Subetapa 6B diagnosticou regressões pos-teste.
A Subetapa 6C corrigiu o combo/lista de medicamentos em receitas.
A Subetapa 6D corrigiu seletivamente a tela/funcoes do assistente de receitas e localizou o armazenamento do `RECEITA_TEL_BRANA`.

Commits relacionados:
- `3d36720` - Extrai bootstrap minimo do editor de texto
- `bb2d3c8` - Corrige abertura standalone do editor de texto
- `74ca368` - Diagnostica regressoes pos recorte do editor
- `0c18046` - Corrige combo de medicamentos em receitas
- `ace1fbe` - Restaura tela de receitas do editor

## Sintoma relatado pelo usuario
Texto selecionado nao muda de cor.

## Comparacao com o estado anterior ao recorte
Foi comparado o estado atual com o estado anterior ao recorte `3d36720` por leitura de:
- `git show 3d36720^:frontend/app.js`
- `git show 3d36720^:frontend/index.html`
- `git diff 3d36720^..HEAD -- frontend/app.js frontend/index.html frontend/js/modules/editor_textos_bootstrap.js`

Resultado da comparacao:
- o controle de cor continua existindo com os mesmos IDs principais (`#editor-textos-color` e `#editor-textos-color-swatch`);
- o handler de cor continua chamando `runCmd("foreColor", color)`;
- a diferenca relevante ficou no fluxo de salvamento/restauracao de range antes da aplicacao da cor, para preservar a selecao quando a toolbar recebe foco.

## Causa confirmada ou hipotese tecnica final
A causa foi diagnosticada como perda/fragilidade do range selecionado quando o foco migra para a toolbar de cor.

Hipotese validada pela leitura:
- o clique/acao sobre o controle de cor pode fazer a selecao ser recriada ou reavaliada pelo navegador antes do `change`;
- sem um snapshot antecipado do range da selecao, `runCmd("foreColor", ...)` pode operar sobre um range errado ou insuficiente;
- a aplicacao de cor precisava de um range preservado no instante do clique da toolbar.

Correcao aplicada:
- guardar uma copia do range no `pointerdown`/`mousedown` do controle de cor;
- usar essa copia ao executar `foreColor`;
- manter o caminho de fallback existente.

## Arquivos lidos
- `docs/fase_2_editor_texto_subetapa_6b_diagnostico_pos_teste_regressoes.md`
- `docs/fase_2_editor_texto_subetapa_6d_correcao_receitas_localizacao_modelo.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `frontend/js/modules`
- `docs/fase_2_editor_texto_subetapa_6_primeiro_recorte_bootstrap.md`
- `docs/fase_2_editor_texto_subetapa_6a_correcao_standalone_blank.md`
- `docs/fase_2_editor_texto_subetapa_6c_correcao_receitas_combo_medicamentos.md`
- `docs/fase_2_editor_texto_subetapa_5_plano_cirurgico_bootstrap.md`

## Arquivos alterados
- `frontend/app.js`

## Descricao exata da correcao
No fluxo do Editor de texto:
- foi adicionado um snapshot de range para a toolbar de cor;
- o range selecionado e preservado ao acionar o controle de cor;
- `runCmd("foreColor", ...)` passa a restaurar o range salvo para a toolbar de cor antes de aplicar o comando;
- o snapshot e limpo apos a aplicacao;
- nenhuma outra area da toolbar foi alterada.

## Confirmacoes
- TAB nao foi tratado.
- Receitas nao foram tratadas.
- `RECEITA_TEL_BRANA` nao foi tratado.
- `frontend/js/modules/editor_textos_bootstrap.js` nao precisou ser alterado nesta etapa.
- Backend e endpoints nao foram alterados.
- Banco, schema, migrations e seeds nao foram alterados.
- Nenhuma correção textual ampla/mojibake foi feita.

## Checks executados
- `git show 3d36720^:frontend/app.js`
- `git show 3d36720^:frontend/index.html`
- `git diff 3d36720^..HEAD -- frontend/app.js frontend/index.html frontend/js/modules/editor_textos_bootstrap.js`
- `git log --oneline -7`
- `git status --short`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- backend`
- `git diff -- docs/fase_2_editor_texto_subetapa_6e_correcao_cor_texto_selecionado.md`

Resultado observado:
- `frontend/app.js`: diff pequeno e auditavel, restrito ao salvamento/restauracao de range da toolbar de cor.
- `frontend/index.html`: sem diff.
- `frontend/js/modules/editor_textos_bootstrap.js`: sem diff.
- `backend`: sem diff.

## Plano de teste humano obrigatorio
Testar em `Ferramentas > Editor de textos`.
Tambem testar em `http://127.0.0.1:8000/app?editor_textos=1`.

Validar especialmente:
- selecionar texto e mudar a cor;
- confirmar que a cor aplicada aparece no texto selecionado;
- repetir com mais de uma cor;
- confirmar que a selecao/foco do editor continua funcionando;
- confirmar que a toolbar nao quebrou;
- console sem erros.

Tambem conferir rapidamente:
- abertura do editor;
- abertura de modelo;
- criacao de novo texto/modelo;
- edicao;
- salvar;
- salvar como;
- assistente de receitas continua funcionando;
- campo Uso em receitas continua funcionando;
- mensagem inferior indevida em receitas nao voltou;
- PDF/exportacao, se aplicavel.

## Proxima subetapa recomendada
Somente apos novo teste humano em `Ferramentas > Editor de textos` e em `/app?editor_textos=1`, avaliar se resta algum ajuste fino de toolbar ou se a frente volta ao estado de estabilizacao documental.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- A Subetapa 6 foi concluida no commit `3d36720`.
- A Subetapa 6A foi concluida no commit `bb2d3c8`.
- A Subetapa 6B foi concluida no commit `74ca368`.
- A Subetapa 6C foi concluida no commit `0c18046`.
- A Subetapa 6D foi concluida no commit `ace1fbe`.
- Esta Subetapa 6E diagnostica e corrige seletivamente a cor do texto selecionado.
- TAB permanece registrado como problema pre-existente e fora desta correção.
- Receitas permanecem fora desta correção.
- `RECEITA_TEL_BRANA` permanece fora desta correção.
- Editor de texto continua classificado como comum/core.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario deve ser alterado.
- Nenhuma correção textual ampla/mojibake deve ser feita.
- A próxima etapa so pode avancar depois de novo teste humano em Ferramentas > Editor de textos e em `/app?editor_textos=1`.

## Commit seletivo obrigatorio
- Somente os arquivos desta etapa devem entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para os arquivos realmente alterados/criados.
- Confirmar antes do commit que nao ha alteracoes indevidas.
- Confirmar depois do commit quais arquivos entraram.
