# Cadastros auxiliares - Conferencia do contrato documental existente antes de qualquer implementacao

Data: 26/05/2026

Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`

Branch: `modularizacao-segura-fase-1`

## Objetivo

Conferir o contrato documental ja criado para Cadastros auxiliares antes de qualquer implementacao futura, garantindo continuidade segura da Fase 2.

## Contexto

Esta etapa vem da normalizacao documental apos a consolidacao de Etiquetas e da aceitação de Cadastros auxiliares como frente documental de continuidade.

## Contrato conferido

`docs/fase_2_cadastros_auxiliares_contrato_helper_leve_seguro.md`

## Classificacao do modulo

Cadastros auxiliares deve ser tratado como modulo comum/core administrativo/transversal.

Essa classificacao serve apenas para documentacao e orientacao futura. Ela nao altera permissao, tenant, backend ou controle multi-area.

## Resumo do contrato existente

O contrato existente define como candidato mais seguro o helper `auxNormalizarHexCor(value)`.

O contrato propoe:

- responsabilidade: normalizar valor bruto de cor para hexadecimal seguro;
- assinatura conceitual: `auxNormalizarHexCor(value)`;
- entradas: valor bruto de cor;
- saidas: cor normalizada em hexadecimal ou string vazia;
- funcoes de `frontend/app.js` que poderiam delegar futuramente: `auxNormalizarHexCor`, `auxCorApresentacaoOpcoesHtml`, `auxCorApresentacaoCorLabel`, `auxCorApresentacaoHexPorLabel`;
- fallback equivalente em `frontend/app.js`;
- limites claros sem DOM, preview, modal, eventos, `requestJson`, payload, salvamento, backend, banco, endpoints, permissoes, textos visiveis ou mojibake.

## Avaliacao de completude do contrato

O contrato esta completo e apto para implementacao minima futura.

## Lacunas encontradas

Nao foram identificadas lacunas impeditivas para a futura implementacao minima.

## Decisao conservadora

O contrato e considerado suficiente para continuidade documental e para eventual implementacao minima futura, se e somente se o passo for aprovado depois de nova conferencia pontual.

## Justificativa tecnica

- o helper indicado e puro e passivo;
- a fronteira esta clara;
- o risco e baixo;
- o uso futuro pode manter fallback equivalente;
- o contrato evita DOM, preview, modal e persistencia;
- a trilha documental agora fica alinhada para continuidade segura.

## Proxima subetapa recomendada

`Cadastros auxiliares - Implementacao minima futura de auxNormalizarHexCor(value) com teste manual obrigatorio`

Antes de qualquer implementacao, conferir novamente o contrato existente e confirmar que o escopo continua completo.

## Onde testar futuramente se houver implementacao

Se houver implementacao futura, o teste manual obrigatorio deve ser em:

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

Esta etapa e exclusivamente documental. Nenhuma alteracao de codigo foi feita.

## Confirmacao de blindagem textual/mojibake

A blindagem textual/mojibake foi respeitada. Nenhum texto visivel foi corrigido.

## Commit seletivo obrigatorio

O commit desta etapa deve incluir somente:

- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_cadastros_auxiliares_conferencia_contrato_helper_leve.md`

## Registro para roadmap

Esta etapa registra a conferencia do contrato documental existente de Cadastros auxiliares e confirma que o helper recomendado esta apto para continuidade documental antes de qualquer implementacao.
