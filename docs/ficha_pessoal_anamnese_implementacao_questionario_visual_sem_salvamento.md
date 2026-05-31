# Ficha pessoal - Anamnese - Implementacao do questionario visual sem salvamento

## Contexto

- A aba `Anamnese` da `Ficha pessoal` ja estava modularizada e validada em uma subetapa anterior.
- A nova subetapa pediu somente a parte visual inferior do questionario, sem qualquer mudanca de salvamento.
- O objetivo foi mostrar perguntas, respostas visuais `Sim` / `Nao`, campo de complemento visual e rolagem vertical.

## Base de trabalho

- Estado de partida: apos a validacao da modularizacao inicial da aba `Anamnese`.
- Módulo envolvido: `frontend/js/modules/ficha-pessoal-aba-anamnese.js`.
- Fachada existente: `frontend/app.js`.
- HTML ja carregava o modulo, entao `frontend/index.html` nao precisou de ajuste nesta rodada.

## Implementacao realizada

- O modulo da aba `Anamnese` passou a renderizar a area inferior com a lista visual das perguntas do questionario selecionado.
- Cada pergunta passou a exibir numero, texto, selecao visual `Sim` / `Nao` e campo de complemento/observacao em formato apenas visual.
- A area inferior ganhou rolagem vertical para questionarios longos.
- O topo da aba continuou com nome do paciente e combo `Questionario`.
- O carregamento usa a fonte ja existente de questionarios e a rota de perguntas do questionario selecionado.

## Comportamento preservado

- Nao houve alteracao de backend.
- Nao houve alteracao de banco.
- Nao houve alteracao de schema, migrations, seeds ou endpoints.
- Nao houve alteracao de `requestJson`.
- Nao houve alteracao de payload.
- Nao houve alteracao de formato de salvamento.
- Nao houve persistencia das selecoes visuais.
- Nao houve alteracao em exclusao ou permissoes.

## Escopo tecnico

- O `frontend/app.js` permaneceu como fachada fina.
- O comportamento visual anterior do topo foi preservado.
- O visual inferior agora e preenchido pelo proprio modulo.
- A lista e local e nao grava respostas.
- O objetivo da etapa foi apenas preparar a visualizacao para futura validacao manual.

## Proxima recomendacao

- Validar manualmente a aba `Anamnese` no sistema.
- Confirmar que a lista visual inferior aparece com scroll.
- Confirmar que trocar o questionario atualiza a lista.
- Confirmar que nada foi gravado de forma permanente.

## Blindagem textual/mojibake

- Respeitada conforme a regra geral do repositorio.
- Nao foi feita correcao textual fora do escopo.
