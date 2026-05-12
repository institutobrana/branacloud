# Unidades - Subetapa 2 - Comparacao de helpers

## Contexto

- Branch atual: `modularizacao-segura-fase-1`
- Escopo: comparacao formal dos helpers puros entre o monolito e o modulo controlado de Unidades
- Estado inicial confirmado: working tree limpo antes desta etapa

## Arquivos analisados

- `frontend/app.js`
- `frontend/js/modules/unidades.js`
- `frontend/index.html`
- `docs/unidades_subetapa_2_comparacao_helpers.md`

## Confirmacoes de escopo

- `frontend/app.js` nao foi alterado nesta etapa
- `frontend/index.html` nao foi alterado nesta etapa
- `frontend/js/modules/unidades.js` nao estava carregado no `frontend/index.html`
- Nenhum comportamento funcional foi deslocado do `app.js`
- Nenhum evento, DOM, fetch/API ou endpoint foi usado no modulo

## Comparacao dos helpers

| app.js helper | modulo helper | equivalencia | observacao |
|---|---|---|---|
| `unidadeFmtCodigo(valor, idx)` | `BranaUnidadesModule.helpers.fmtCodigo(valor, idx)` | Sim | Mesma regra: numero com 4 digitos, texto trimado e fallback por indice. |
| `unidadeStatusHtml(ativo)` | `BranaUnidadesModule.helpers.statusHtml(ativo)` | Sim | Mesmo span, mesma cor e mesmo simbolo visual de status. |
| `unidadeTelefonePadrao(idx, tipos)` | `BranaUnidadesModule.helpers.telefonePadrao(idx, tipos)` | Sim, apos ajuste no modulo | O modulo foi corrigido para usar a mesma lista de fallback e a mesma busca case-insensitive do monolito. |

## Resultado da comparacao

### `unidadeFmtCodigo` vs `fmtCodigo`

- Equivalentes.
- A regra de `padStart(4, "0")`, trim do texto e fallback por indice foi mantida.

### `unidadeStatusHtml` vs `statusHtml`

- Equivalentes.
- O retorno conserva o mesmo `span` com a mesma cor para ativo e inativo.

### `unidadeTelefonePadrao` vs `telefonePadrao`

- Depois do ajuste no modulo, ficaram equivalentes.
- Antes da correcao, o helper do modulo nao espelhava a mesma selecao de fallback do `app.js`.
- A versao atual do modulo agora aceita `tipos` e reproduz o mesmo criterio do monolito.

## Alteracao no modulo

- `frontend/js/modules/unidades.js` foi alterado somente no helper `telefonePadrao`, para ficar fiel ao `app.js`.
- Nao houve deslocamento de comportamento funcional do monolito para o modulo.

## Validacoes

- `node --check frontend/js/modules/unidades.js`: sem erros
- `node --check frontend/app.js`: sem erros

## Diferenças de git

- `git diff -- frontend/app.js`: sem alteracoes nesta etapa
- `git diff -- frontend/index.html`: sem alteracoes nesta etapa
- `git diff -- frontend/js/modules/unidades.js`: mostra apenas a correcao do helper `telefonePadrao`

## Riscos residuais

- O modulo continua sendo apenas uma estrutura controlada e nao participa do fluxo funcional da tela.
- A proximidade entre o monolito e o modulo ainda depende de comparacao manual enquanto a migracao nao avanca para uma etapa de uso efetivo.

## Teste manual recomendado

- Nao ha teste funcional novo a executar nesta subetapa, porque o modulo ainda nao e carregado pela tela.
- Se quiser validar a fidelidade, comparar manualmente o retorno dos helpers puros com casos simples de codigo, status e telefones padrao.

## Proxima subetapa recomendada

- Subetapa 3: decidir, de forma controlada, se algum helper puro passara a ser consumido apenas em contexto de comparacao interna, sem alterar ainda o fluxo funcional da tela.
