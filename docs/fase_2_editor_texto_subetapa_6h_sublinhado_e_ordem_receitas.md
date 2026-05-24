# Fase 2 - Editor de texto - Subetapa 6H - Correção do sublinhado colorido e ajuste visual Paciente/Medicamento

## Contexto
Esta subetapa continua a Fase 2 do Editor de texto, ainda classificado preliminarmente como modulo comum/core.
A Subetapa 6 criou o primeiro recorte real minimo do Bootstrap/abertura.
A Subetapa 6A corrigiu a tela vazia/cinza no standalone.
A Subetapa 6B diagnosticou regressões pos-teste.
A Subetapa 6C corrigiu o combo/lista de medicamentos em receitas.
A Subetapa 6D corrigiu seletivamente a tela/funções do assistente de receitas e localizou o armazenamento do RECEITA_TEL_BRANA.
A Subetapa 6E tentou corrigir a cor do texto selecionado.
A Subetapa 6F corrigiu a aplicação de cor em texto selecionado e o residuo inicial/mojibake da toolbar de cor.
A Subetapa 6G tentou corrigir a cor do sublinhado.

## Commits relacionados
- `3d36720` - Extrai bootstrap minimo do editor de texto
- `bb2d3c8` - Corrige abertura standalone do editor de texto
- `74ca368` - Diagnostica regressoes pos recorte do editor
- `0c18046` - Corrige combo de medicamentos em receitas
- `ace1fbe` - Restaura tela de receitas do editor
- `bd6c6e0` - Corrige cor do texto selecionado no editor
- `af8c823` - Corrige cor selecionada e residuo da toolbar
- `221e8c3` - Corrige cor do sublinhado no editor

## Sintomas/ajustes relatados pelo usuario
- O texto muda de cor, mas o sublinhado continua preto.
- No Assistente de receitas, Paciente deve aparecer acima de Medicamento.

## Comparacao feita
Foi feita comparacao com o estado anterior ao recorte `3d36720` e com a Subetapa 6G no commit `221e8c3`.
A leitura mostrou que o fallback de aplicacao de cor precisa propagar `textDecorationColor` tambem para elementos descendentes do trecho selecionado, e que a ordem visual do assistente de receitas estava definida no shell/DOM bootstrap.

## Causa confirmada ou hipotese tecnica final
### Sublinhado
A causa mais provavel era que a cor vinha sendo aplicada ao texto, mas o sublinhado permanecia preto porque o `textDecorationColor` nao alcançava todos os elementos do trecho selecionado, especialmente quando havia estrutura interna sublinhada preservada pelo navegador.

### Ordem Paciente/Medicamento
A ordem visual vinha da sequência dos blocos no shell do assistente de receitas em `frontend/js/modules/editor_textos_bootstrap.js`, onde Medicamento aparecia antes de Paciente.

## Arquivos lidos
- `docs/fase_2_editor_texto_subetapa_6g_correcao_cor_sublinhado.md`
- `docs/fase_2_editor_texto_subetapa_6f_correcao_cor_selecao_residuo_toolbar.md`
- `docs/fase_2_editor_texto_subetapa_6e_correcao_cor_texto_selecionado.md`
- `docs/fase_2_editor_texto_subetapa_6d_correcao_receitas_localizacao_modelo.md`
- `docs/fase_2_editor_texto_subetapa_6c_correcao_receitas_combo_medicamentos.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `frontend/js/modules`

## Arquivos alterados
- `frontend/app.js`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `docs/fase_2_editor_texto_subetapa_6h_sublinhado_e_ordem_receitas.md`

## Descricao exata da correção aplicada no sublinhado
1. O fallback de cor passou a propagar `textDecorationColor` para o trecho selecionado e seus descendentes.
2. A cor continua sendo aplicada somente ao trecho afetado.
3. Texto sem sublinhado continua recebendo a cor normalmente.
4. Digitação futura após escolher cor continua funcionando como antes.

## Descricao exata do ajuste visual Paciente/Medicamento
1. O bloco visual de Paciente foi movido para ficar acima do bloco visual de Medicamento no shell do assistente de receitas.
2. Os mesmos IDs, labels, inputs, selects, botões e listeners foram preservados.
3. O fluxo de uso, seleção de paciente, seleção de medicamento, campo Uso e demais comportamentos continuam inalterados.

## Confirmacoes
- TAB nao foi tratado.
- `RECEITA_TEL_BRANA` nao foi tratado.
- Arquivos de storage/modelos nao entraram no commit.
- Backend e endpoints nao foram alterados.
- Banco, schema, migrations e seeds nao foram alterados.
- Nao houve correção textual ampla nem ajuste de mojibake.
- `frontend/index.html` nao foi alterado.
- `frontend/app.js` foi alterado apenas no fluxo de cor do texto selecionado.

## Checks executados
- `git show 3d36720^:frontend/app.js`
- `git show bd6c6e0 -- frontend/app.js`
- `git show af8c823 -- frontend/app.js`
- `git show 221e8c3 -- frontend/app.js`
- `git diff af8c823..221e8c3 -- frontend/app.js`
- `git diff 3d36720^..HEAD -- frontend/app.js frontend/index.html frontend/js/modules/editor_textos_bootstrap.js`
- `git status --short`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- backend`
- `git diff -- storage/modelos/clinicas/1/atestados/ATESTADO_TEL_BRANA.mod.editor.json`
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
- alterar cor sem seleção e digitar para confirmar que texto novo continua na cor escolhida;
- confirmar que o sublinhado normal continua funcionando;
- confirmar que a toolbar nao quebrou;
- abrir Assistente de receitas;
- confirmar que Paciente aparece acima de Medicamento;
- confirmar que Medicamento aparece abaixo de Paciente;
- confirmar que seleção de paciente continua funcionando;
- confirmar que seleção de medicamento continua funcionando;
- confirmar que campo Uso continua funcionando;
- confirmar que a mensagem inferior indevida em receitas nao voltou;
- console sem erros.

## Proxima subetapa recomendada
A proxima etapa so deve ocorrer se o teste humano confirmar o comportamento esperado. Caso persista qualquer detalhe, a correção seguinte deve continuar pequena e seletiva.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- A Subetapa 6 foi concluída no commit `3d36720`.
- A Subetapa 6A foi concluída no commit `bb2d3c8`.
- A Subetapa 6B foi concluída no commit `74ca368`.
- A Subetapa 6C foi concluída no commit `0c18046`.
- A Subetapa 6D foi concluída no commit `ace1fbe`.
- A Subetapa 6E foi concluída no commit `bd6c6e0`.
- A Subetapa 6F foi concluída no commit `af8c823`.
- A Subetapa 6G foi concluída no commit `221e8c3`, mas o teste humano mostrou que o sublinhado ainda nao acompanha a cor.
- Esta Subetapa 6H corrige novamente a cor do sublinhado e ajusta somente a ordem visual Paciente/Medicamento no Assistente de receitas.
- TAB permanece registrado como problema pré-existente e fora desta correção.
- `RECEITA_TEL_BRANA` permanece fora desta correção.
- Arquivos de storage/modelos não devem entrar no commit.
- Editor de texto continua classificado como comum/core.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario deve ser alterado.
- Nenhuma correção textual ampla ou de mojibake deve ser feita.
- A próxima etapa só pode avançar depois de novo teste humano em `Ferramentas > Editor de textos` e em `/app?editor_textos=1`.

## Commit seletivo obrigatório
- Somente os arquivos desta etapa devem entrar no commit.
- Não usar `git add .`.
- Não usar `git add docs/`.
- Não adicionar `storage/modelos/clinicas/1/atestados/ATESTADO_TEL_BRANA.mod.editor.json`.
- Usar `git add` seletivo somente para os arquivos realmente alterados/criados nesta etapa.
- Confirmar antes do commit que não há alterações indevidas.
- Confirmar depois do commit quais arquivos entraram.
