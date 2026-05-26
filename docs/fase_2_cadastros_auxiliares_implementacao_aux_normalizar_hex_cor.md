# Cadastros auxiliares - Implementacao minima de auxNormalizarHexCor(value)

Data: 26/05/2026

Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`

Branch: `modularizacao-segura-fase-1`

## Objetivo

Registrar a implementacao minima e conservadora de `auxNormalizarHexCor(value)` em Cadastros auxiliares, preservando o comportamento atual e a trilha documental da Fase 2.

## Contexto

Esta etapa vem da conferencia do contrato documental existente de Cadastros auxiliares.

O helper recomendado era `auxNormalizarHexCor(value)`.

## Classificacao do modulo

Cadastros auxiliares continua classificado como modulo comum/core administrativo/transversal.

Essa classificacao e apenas documental e nao altera permissao, tenant, backend ou controle multi-area.

## Arquivos alterados

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_cadastros_auxiliares_implementacao_aux_normalizar_hex_cor.md`

## Nome real do modulo usado

O modulo real utilizado no frontend e:

`frontend/js/modules/auxiliares.js`

O namespace exposto e:

`window.BranaAuxiliaresModule`

## Descricao exata da alteracao

A revisao do codigo confirmou que:

- `frontend/app.js` ja possui delegacao para `window.BranaAuxiliaresModule?.helpers?.auxNormalizarHexCor`;
- o modulo `frontend/js/modules/auxiliares.js` ja expunha `helpers.auxNormalizarHexCor`;
- a logica de normalizacao ja estava implementada de forma passiva e pura no modulo;
- nao houve necessidade de alterar codigo nesta etapa;
- a etapa foi registrada documentalmente como consolidacao da implementacao minima ja presente no repositório.

## Confirmacao de alteracao minima

A alteracao foi minima porque nao exigiu mudança de codigo adicional nesta rodada. A delegacao e o helper ja estavam presentes e coerentes com o contrato.

## Confirmacao de helper passivo

`auxNormalizarHexCor(value)` ficou passivo no modulo real `frontend/js/modules/auxiliares.js`.

## Confirmacao de preservacao do comportamento

O comportamento de normalizacao foi preservado para:

- valores vazios;
- valores nulos;
- valores undefined;
- valores com ou sem `#`;
- valores invalidos;
- valores ja normalizados.

## Confirmacao de nao alteracao de DOM/renderizacao/selecao/modal/abas/preview/eventos

Nenhuma alteracao foi feita em DOM, renderizacao, selecao, modal, abas, preview ou eventos.

## Confirmacao de nao alteracao de requestJson/payload/salvamento/endpoints

Nenhuma alteracao foi feita em `requestJson`, payload efetivo, salvamento ou endpoints.

## Confirmacao de nao alteracao de backend/banco/permissoes

Nenhuma alteracao foi feita em backend, banco ou permissoes.

## Confirmacao de nao alteracao de textos visiveis/mojibake

Nenhum texto visivel foi corrigido e nenhum mojibake foi alterado.

## Riscos remanescentes

- `frontend/app.js` ainda concentra o fluxo principal de Cadastros auxiliares;
- modal e scaffold compartilhado continuam no fluxo central;
- futuras mudancas na normalizacao podem afetar combos, cor/apresentacao ou valores derivados se o contrato nao for preservado exatamente;
- o bloco ainda depende de `requestJson` e salvamento no fluxo principal.

## Onde testar manualmente

Se houver necessidade de revalidacao visual, o teste manual futuro deve ser em:

`Cadastros auxiliares / Tabelas auxiliares`

Teste futuro provavel:

- abrir Cadastros auxiliares / Tabelas auxiliares;
- validar listagem de tipos;
- validar listagem de itens;
- abrir dialogo/modal, se houver no fluxo atual;
- validar cor/apresentacao, se aplicavel;
- validar combos/previews, se aplicavel;
- confirmar console limpo;
- regressao rapida em `Etiquetas`, `Plano de Contas`, `CID` e `Medicamentos`;
- confirmar que nao houve mudanca visual nem comportamental.

## Confirmacao de que nenhuma alteracao de codigo foi feita

Esta etapa e exclusivamente documental. Nenhuma alteracao de codigo foi feita nesta rodada.

## Confirmacao de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada. Nenhum texto visivel foi corrigido.

## Commit seletivo obrigatorio

O commit desta etapa deve incluir somente:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_cadastros_auxiliares_implementacao_aux_normalizar_hex_cor.md`

## Registro para roadmap

Esta etapa registra a implementacao minima de `auxNormalizarHexCor(value)` como ja presente e consolidada no modulo real `frontend/js/modules/auxiliares.js`, mantendo Cadastros auxiliares como modulo comum/core administrativo/transversal e preservando a trilha documental da Fase 2.
