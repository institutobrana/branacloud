# Fase 2 - Editor de texto - Subetapa 6D - Correcao seletiva da tela de receitas e localizacao do modelo RECEITA_TEL_BRANA

## Contexto
A Subetapa 6 executou o primeiro recorte real minimo do Bootstrap/abertura do Editor de texto.
A Subetapa 6A corrigiu a tela vazia/cinza no modo standalone.
A Subetapa 6B fez diagnostico documental das regressões pos-teste.
A Subetapa 6C corrigiu seletivamente o combo/lista de medicamentos do assistente de receitas.

Commits relacionados:
- `3d36720` - Extrai bootstrap minimo do editor de texto
- `bb2d3c8` - Corrige abertura standalone do editor de texto
- `74ca368` - Diagnostica regressoes pos recorte do editor
- `0c18046` - Corrige combo de medicamentos em receitas

## Sintomas relatados pelo usuario
- Campo `Uso:` vazio ao selecionar uma medicação.
- Mensagem inferior indevida: `Selecione o medicamento e preencha a prescricao. Fonte: cadastro de medicamentos. Itens: 67.`
- Modelo/template `RECEITA_TEL_BRANA` em branco, com backup em posse do usuario.

## Comparacao com o estado anterior ao recorte
Foi comparado o estado atual com o estado anterior ao recorte `3d36720` por leitura de:
- `git show 3d36720^:frontend/app.js`
- `git show 3d36720^:frontend/index.html`
- `git diff 3d36720^..HEAD -- frontend/app.js frontend/index.html frontend/js/modules/editor_textos_bootstrap.js`

Resultado da comparacao:
- antes do recorte, o assistente de receitas usava `#editor-textos-assist-uso` como `select`;
- antes do recorte, nao havia o bloco visivel `#editor-textos-assist-status` no DOM do assistente;
- o recorte Bootstrap introduziu o DOM de receitas no shell separado e, nesta parte, o `Uso` havia passado a `input`, o que impedia o preenchimento esperado;
- o status visivel voltou a aparecer por existir um elemento proprio de status no shell recriado.

## Causa confirmada ou hipotese tecnica final para o campo Uso
A causa foi confirmada como DOM incompatível no shell bootstrap.
O campo `Uso` havia sido recriado como `input`, mas o codigo existente do assistente de receitas trata esse campo como `HTMLSelectElement`, preenchendo as opcoes via `editorTextosAssistSetSelectOptions(...)` e restaurando o valor em `editorTextosAssistAplicarMedicamentoSelecionado(...)`.

Correcao aplicada:
- restaurado `#editor-textos-assist-uso` como `select`.

## Causa confirmada ou hipotese tecnica final para a mensagem inferior indevida
A mensagem inferior era reexibida porque o shell bootstrap recriado passou a conter o elemento `#editor-textos-assist-status`, fazendo a rotina `editorTextosAssistStatus(...)` voltar a renderizar a mensagem na tela.

Comparando com o estado anterior ao recorte, o comportamento visual anterior era nao exibir essa faixa inferior no assistente.

Correcao aplicada:
- removido `#editor-textos-assist-status` do shell bootstrap.

## Localizacao do armazenamento do RECEITA_TEL_BRANA
O modelo foi localizado como arquivo fisico.

Localizacao identificada:
- `D:\BRANA ARQUIVOS\BRANA CLOUD\storage\modelos\clinicas\1\RECEITA_TEL_BRANA.mod`

Confirmacao:
- nesta etapa, o `RECEITA_TEL_BRANA` nao foi restaurado.
- o conteudo nao foi sobrescrito.
- nenhuma operacao de UPDATE, INSERT ou DELETE foi executada.

## Orientacao segura para restauracao futura
Como o armazenamento identificado e arquivo fisico, a restauracao manual futura deve ser feita por copia do backup do usuario para:
- `D:\BRANA ARQUIVOS\BRANA CLOUD\storage\modelos\clinicas\1\RECEITA_TEL_BRANA.mod`

Isso deve ocorrer em etapa propria, com backup/dry-run ou confirmacao manual, sem automatizar a restauracao nesta subetapa.

## Arquivos lidos
- `docs/fase_2_editor_texto_subetapa_6c_correcao_receitas_combo_medicamentos.md`
- `docs/fase_2_editor_texto_subetapa_6b_diagnostico_pos_teste_regressoes.md`
- `docs/fase_2_editor_texto_subetapa_6a_correcao_standalone_blank.md`
- `docs/fase_2_editor_texto_subetapa_6_primeiro_recorte_bootstrap.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `backend/routes/editor_textos_routes.py`
- `backend/main.py`
- `backend/estrutura_eds70.txt`
- `backend/estrutura_precificacao.txt`
- `docs/relatorio_modelos_clinicos_sem_conteudo.md`
- `docs/relatorio_modelos_clinica_1_mapeamento_arquivos.md`

## Arquivos alterados
- `frontend/js/modules/editor_textos_bootstrap.js`

## Descricao exata da correcao aplicada
No shell bootstrap do assistente de receitas:
- `#editor-textos-assist-uso` foi restaurado para `select`, permitindo o preenchimento por opcoes de uso;
- `#editor-textos-assist-status` foi removido para restaurar o comportamento visual anterior e impedir a exibicao da faixa inferior indevida.

O restante da logica do assistente, incluindo selecao de medicamento, prescricao, quantidade, contexto e menu de medicamentos, permaneceu intacto.

## Confirmacoes
- TAB nao foi tratado.
- Cor do texto selecionado nao foi tratada.
- A correção ficou restrita ao assistente de receitas e ao shell bootstrap.
- Backend e endpoints nao foram alterados.
- Banco, schema, migrations e seeds nao foram alterados.
- Textos visiveis e mojibake nao foram alterados por criterio textual amplo.
- O `RECEITA_TEL_BRANA` foi apenas localizado/investigado, sem restauracao automatica.

## Checks executados
- `git status --short`
- `git show 3d36720^:frontend/app.js`
- `git show 3d36720^:frontend/index.html`
- `git show --stat 3d36720`
- `git show --stat bb2d3c8`
- `git show --stat 0c18046`
- `git diff 3d36720^..HEAD -- frontend/app.js frontend/index.html frontend/js/modules/editor_textos_bootstrap.js`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- backend`
- `git diff -- docs/fase_2_editor_texto_subetapa_6d_correcao_receitas_localizacao_modelo.md`

Resultado observado:
- `frontend/app.js`: sem diff.
- `frontend/index.html`: sem diff.
- `backend`: sem diff.
- `frontend/js/modules/editor_textos_bootstrap.js`: diff pequeno e auditavel, limitado ao DOM do assistente de receitas.

## Plano de teste humano obrigatorio
Testar em `Ferramentas > Editor de textos`.
Tambem testar em `http://127.0.0.1:8000/app?editor_textos=1`.

Validar especialmente:
- assistente de receitas abre corretamente;
- ao selecionar medicamento, campo `Uso` e preenchimento correlato funcionam como antes do recorte;
- a mensagem inferior indevida `Fonte: cadastro de medicamentos. Itens: ...` nao aparece mais como faixa visivel;
- `RECEITA_TEL_BRANA` nao deve ser considerado restaurado por esta etapa;
- selecao de medicamento funciona;
- geracao/inclusao de receita funciona, se aplicavel;
- tela nao fica vazia/cinza;
- console sem erros.

Tambem conferir rapidamente:
- abertura de modelo;
- criacao de novo texto/modelo;
- edicao;
- salvar;
- salvar como;
- mesclagem;
- PDF/exportacao, se aplicavel.

## Proxima subetapa recomendada
Somente apos novo teste humano em `Ferramentas > Editor de textos` e em `/app?editor_textos=1`, avaliar se ha necessidade de diagnostico/correcao separada para TAB ou cor do texto selecionado.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- A Subetapa 6 foi concluida no commit `3d36720`.
- A Subetapa 6A foi concluida no commit `bb2d3c8`.
- A Subetapa 6B foi concluida no commit `74ca368`.
- A Subetapa 6C foi concluida no commit `0c18046`.
- Esta Subetapa 6D corrige seletivamente a tela/funcoes do assistente de receitas e localiza o armazenamento do `RECEITA_TEL_BRANA`.
- Os sintomas tratados sao: campo `Uso` vazio e mensagem inferior indevida sobre fonte/itens.
- `RECEITA_TEL_BRANA` deve ser apenas localizado nesta etapa, sem restauracao automatica.
- TAB permanece registrado como problema pre-existente e fora desta correção.
- Cor do texto selecionado permanece fora desta correção.
- Editor de texto continua classificado como comum/core.
- Nenhum backend, banco, endpoint, permissao, sessao, clinica ou usuario deve ser alterado.
- Nenhum UPDATE, INSERT ou DELETE deve ser executado.
- Nenhuma correção textual ampla/mojibake deve ser feita.
- A próxima etapa so pode avancar depois de novo teste humano em Ferramentas > Editor de textos e em `/app?editor_textos=1`.

## Commit seletivo obrigatorio
- Somente os arquivos desta etapa devem entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para os arquivos realmente alterados/criados.
- Confirmar antes do commit que nao ha alteracoes indevidas.
- Confirmar depois do commit quais arquivos entraram.
