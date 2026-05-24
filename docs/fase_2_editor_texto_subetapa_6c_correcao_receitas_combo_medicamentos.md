# Fase 2 - Editor de texto - Subetapa 6C - Correcao seletiva do assistente de receitas apos recorte Bootstrap

## Contexto
A Subetapa 6 executou o primeiro recorte real minimo do Bootstrap/abertura do Editor de texto.
A Subetapa 6A corrigiu a tela vazia/cinza no modo standalone.
A Subetapa 6B registrou, de forma documental, as regressões e hipoteses tecnicas apos o teste humano.

Commits relacionados:
- `3d36720` - Extrai bootstrap minimo do editor de texto
- `bb2d3c8` - Corrige abertura standalone do editor de texto
- `74ca368` - Diagnostica regressoes pos recorte do editor

## Sintoma corrigido
Assistente de receitas sem combo/lista de medicamentos.

## Causa provavel confirmada ou ajustada
A causa provavel diagnosticada na 6B foi confirmada como ausencia do DOM principal do medicamento no shell bootstrap recriado.
O shell estava preservando o assistente de receitas e o menu de medicamentos, mas ainda nao entregava os elementos esperados pelo codigo existente:
- `#editor-textos-assist-medicamento`
- `#editor-textos-assist-medicamento-btn`

## Arquivos lidos
- `docs/fase_2_editor_texto_subetapa_6b_diagnostico_pos_teste_regressoes.md`
- `docs/fase_2_editor_texto_subetapa_6a_correcao_standalone_blank.md`
- `docs/fase_2_editor_texto_subetapa_6_primeiro_recorte_bootstrap.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/editor_textos_bootstrap.js`
- `backend/routes/editor_textos_routes.py`

## Arquivos alterados
- `frontend/js/modules/editor_textos_bootstrap.js`

## Descricao exata da correcao
Foi adicionado ao shell bootstrap do assistente de receitas um bloco minimo com:
- select de medicamento;
- botao de acesso ao menu de medicamentos.

O codigo principal de receitas nao foi alterado.
O assistente voltou a encontrar os elementos que ja esperava, sem mudar a logica de carregamento do contexto, selecao, aplicacao ou confirmacao de medicamentos.

## Confirmacoes
- TAB nao foi tratado.
- Cor do texto selecionado nao foi tratada.
- A correcao ficou restrita ao assistente de receitas e ao DOM do shell bootstrap.
- Backend e endpoints nao foram alterados.
- Textos visiveis e mojibake nao foram alterados.

## Checks executados
- `node --check frontend/app.js`
- `node --check frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- frontend/app.js`
- `git diff -- frontend/index.html`
- `git diff -- frontend/js/modules/editor_textos_bootstrap.js`
- `git diff -- backend`
- `git diff -- docs/fase_2_editor_texto_subetapa_6c_correcao_receitas_combo_medicamentos.md`

Resultado observado:
- `frontend/app.js`: sem diff.
- `frontend/index.html`: sem diff.
- `backend`: sem diff.
- `frontend/js/modules/editor_textos_bootstrap.js`: diff pequeno e auditavel, limitado ao DOM do assistente de receitas.

## Plano de teste humano obrigatorio
Testar em `Ferramentas > Editor de textos` e tambem em `http://127.0.0.1:8000/app?editor_textos=1`.

Validar especialmente:
- assistente de receitas abre corretamente;
- combo/lista de medicamentos aparece;
- selecao de medicamento funciona, se aplicavel;
- geracao/inclusao de receita funciona, se aplicavel;
- tela nao fica vazia/cinza;
- console sem erros.

Validacao rapida de continuidade:
- abertura de modelo;
- criacao de novo texto/modelo;
- edicao;
- salvar;
- salvar como;
- mesclagem;
- PDF/exportacao, se aplicavel.

## Proxima subetapa recomendada
Somente apos novo teste humano em `Ferramentas > Editor de textos` e em `/app?editor_textos=1`, avaliar se ainda resta alguma regressao de cor ou TAB para diagnostico/correcao separada.

## Registro para roadmap
- A frente atual continua sendo Editor de texto.
- A Subetapa 6 foi concluida no commit `3d36720`.
- A Subetapa 6A foi concluida no commit `bb2d3c8`.
- A Subetapa 6B foi concluida no commit `74ca368`.
- Esta Subetapa 6C corrige de forma seletiva o problema do combo/lista de medicamentos no assistente de receitas.
- TAB permanece registrado como problema pre-existente e fora desta correcao.
- Cor do texto selecionado permanece fora desta correcao.
- O Editor de texto continua classificado como comum/core.
- Nenhuma correcao textual/mojibake foi feita.
- Backend, banco, endpoints, permissoes, sessao, clinica e usuario nao foram alterados.
- A proxima etapa so pode avancar depois de teste humano em Ferramentas > Editor de textos e em /app?editor_textos=1.

## Commit seletivo obrigatorio
- Somente os arquivos desta correcao devem entrar no commit.
- Nao usar `git add .`.
- Nao usar `git add docs/`.
- Usar `git add` seletivo somente para os arquivos realmente alterados/criados.
- Confirmar antes do commit que nao ha alteracoes indevidas.
- Confirmar depois do commit quais arquivos entraram.
