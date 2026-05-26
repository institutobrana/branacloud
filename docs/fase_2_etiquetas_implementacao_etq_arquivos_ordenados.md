# Etiquetas - Implementacao minima de etqArquivosOrdenados(lista)

Data: 25/05/2026

Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`

Branch: `modularizacao-segura-fase-1`

## Objetivo

Registrar a implementacao minima e conservadora de `etqArquivosOrdenados(lista)` no bloco de Etiquetas, mantendo o comportamento atual e preservando a estrategia de delegacao segura da Fase 2.

## Contexto

Esta etapa vem do contrato documental de Etiquetas, apos a selecao documental de bloco leve realizada depois da consolidacao de CID.

O helper recomendado foi `etqArquivosOrdenados(lista)`, por ser a transformacao mais pura e segura entre os candidatos remanescentes.

## Classificacao do modulo

Etiquetas continua classificado como modulo comum/core administrativo/transversal.

Essa classificacao e apenas documental e nao altera permissao, tenant, backend ou controle multi-area.

## Arquivos alterados

- `frontend/app.js`
- `frontend/js/modules/etiquetas.js`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_etiquetas_implementacao_etq_arquivos_ordenados.md`

## Descricao exata da alteracao

- `frontend/js/modules/etiquetas.js` passou a expor `ns.etqArquivosOrdenados`.
- `frontend/app.js` passou a delegar a ordenacao/deduplicacao para `window.BranaEtiquetasModule.etqArquivosOrdenados(...)` quando disponivel.
- Foi mantido fallback local equivalente em `frontend/app.js`.
- A logica atual de ordenacao, deduplicacao e prioridade por clinica foi preservada.

## Confirmacao de alteracao minima

A alteracao foi minima. O fluxo de Etiquetas continua concentrado em `frontend/app.js`, sem mudanca de preview, modal, selecao visual ou persistencia.

## Confirmacao de helper passivo

`etqArquivosOrdenados(lista)` ficou passivo e puro, sem dependencias externas e sem efeitos colaterais.

## Confirmacao de preservacao da ordenacao/deduplicacao

A ordenacao e a deduplicacao foram preservadas exatamente conforme o comportamento atual.

## Confirmacao de nao alteracao de DOM/renderizacao/selecao/modal/preview/eventos

Nenhuma alteracao foi feita em DOM, renderizacao, selecao, modal, preview ou eventos.

## Confirmacao de nao alteracao de requestJson/payload/salvamento/endpoints

Nenhuma alteracao foi feita em `requestJson`, payload efetivo, salvamento ou endpoints.

## Confirmacao de nao alteracao de backend/banco/permissoes

Nenhuma alteracao foi feita em backend, banco, permissões ou configuracoes relacionadas.

## Confirmacao de nao alteracao de textos visiveis/mojibake

Nenhum texto visivel foi corrigido e nenhum mojibake foi alterado.

## Riscos remanescentes

- `frontend/app.js` ainda concentra o fluxo principal de Etiquetas.
- Preview e modal continuam no fluxo central.
- Mudancas futuras na regra de ordenacao podem afetar a escolha do arquivo padrao se nao preservarem a logica atual.
- O bloco ainda depende de `requestJson` e salvamento no fluxo principal.

## Onde testar manualmente

Se necessario validar visualmente, o teste manual futuro deve ocorrer em:

`Etiquetas / Configuracao de modelos de etiqueta`

Teste futuro provavel:

- abrir a tela de Etiquetas / Configuracao de modelos de etiqueta;
- validar abertura da tela;
- validar listagem;
- validar aplicacao de padroes;
- validar comportamento do preview;
- validar modal, se houver no fluxo atual;
- confirmar console limpo;
- fazer regressao rapida em `Plano de Contas`, `CID` e `Medicamentos`;
- confirmar que nao houve mudanca visual nem comportamental.

## Commit seletivo obrigatorio

O commit desta etapa deve incluir somente:

- `frontend/app.js`
- `frontend/js/modules/etiquetas.js`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/fase_2_etiquetas_implementacao_etq_arquivos_ordenados.md`

## Registro para roadmap

Esta etapa registra a implementacao minima de `etqArquivosOrdenados(lista)`, mantendo Etiquetas como modulo comum/core administrativo/transversal, com helper passivo, fallback equivalente e preservacao total do comportamento atual.
