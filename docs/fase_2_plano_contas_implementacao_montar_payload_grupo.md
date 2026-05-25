# Plano de Contas - Implementacao minima de montarPayloadGrupo com contrato explicito nome/tipo

- Data: 2026-05-25
- Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`

## Objetivo

Registrar a implementacao minima e conservadora do helper `montarPayloadGrupo(nome, tipo)` em Plano de Contas, mantendo o comportamento atual e a estrutura passiva do modulo.

## Contexto

Esta etapa segue o contrato documental definido em `docs/fase_2_plano_contas_contrato_helper_seguro.md`, que classificou Plano de Contas como modulo comum/core administrativo/transversal e recomendou como proximo passo apenas a extracao segura de `montarPayloadGrupo`.

## Classificacao do modulo

Plano de Contas permanece como modulo comum/core administrativo/transversal.

## Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/plano-contas.js`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_plano_contas_implementacao_montar_payload_grupo.md`

## Descricao exata da alteracao

- `frontend/js/modules/plano-contas.js` passou a expor `ns.montarPayloadGrupo` como alias passivo para `ns.helpers.montarPayloadGrupo`, sem mudar a logica do helper.
- `frontend/app.js` passou a priorizar `window.BranaPlanoContasModule.montarPayloadGrupo(nome, tipo)` no fluxo de grupo, mantendo fallback local equivalente e sem alterar o fluxo de categoria.

## Confirmacoes tecnicas

- O helper permaneceu passivo.
- O payload final foi preservado.
- Nao houve alteracao de salvamento, `requestJson` ou endpoints.
- Nao houve alteracao de DOM, renderizacao, modal, scaffold `cadModalAbrir` ou selecao visual.
- Nao houve alteracao de texto visivel ou mojibake.
- Nao houve alteracao de backend, banco, schema, migrations, seeds, permissos ou configuracoes.

## Riscos remanescentes

- Plano de Contas ainda compartilha scaffold administrativo com outros dialogos e fluxos no `frontend/app.js`.
- Novos recortes continuam dependendo de contrato documental proprio.
- Qualquer alteracao futura deve preservar fallback e o comportamento visual atual.

## Onde testar manualmente

Em `Cadastros > Plano de contas`, abrir o formulario de grupo, salvar criacao/edicao e confirmar que o comportamento, o payload efetivo e a interface permanecem equivalentes ao fluxo anterior.

## Commit seletivo obrigatorio

Seletivamente, esta etapa deve entrar apenas com:

- `frontend/app.js`
- `frontend/js/modules/plano-contas.js`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_plano_contas_implementacao_montar_payload_grupo.md`

## Registro para roadmap

Registrar que `montarPayloadGrupo(nome, tipo)` foi implementado de forma minima em Plano de Contas, que o modulo continua comum/core administrativo/transversal, que o helper ficou passivo, que o payload/salvamento/requestJson/endpoints nao foram alterados, que DOM/renderizacao/modal/scaffold nao foram alterados e que o teste manual do usuario e obrigatorio antes de qualquer proxima etapa documental.
