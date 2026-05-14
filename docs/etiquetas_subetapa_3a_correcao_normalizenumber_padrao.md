# Subetapa 3-A — Correção do helper `normalizeNumber`

## 1. Contexto
Esta etapa corrige a extração do helper puro `etqNumero(valor, padrao)` já movido para `window.BranaEtiquetasModule.normalizeNumber(valor, padrao)` na Subetapa 3-A.

O problema foi identificado no navegador: valores vazios e nulos estavam retornando `0` em vez do padrão informado.

Esta correção mantém:
- o wrapper/fallback no `app.js`
- a assinatura original de `etqNumero`
- o comportamento de `etqFormatNumero`
- o comportamento de `etqLayoutFromItem`

## 2. Teste que falhou
Teste executado no navegador:

```js
[
  window.BranaEtiquetasModule.normalizeNumber("12,5", 0),
  window.BranaEtiquetasModule.normalizeNumber("", 7),
  window.BranaEtiquetasModule.normalizeNumber(null, 9),
  window.BranaEtiquetasModule.normalizeNumber("abc", 3)
]
```

Resultado obtido antes da correção:

```js
[12.5, 0, 0, 3]
```

Resultado esperado:

```js
[12.5, 7, 9, 3]
```

## 3. Causa provável
A implementação anterior usava conversão numérica direta sobre `String(valor || "")`.

Isso fazia com que:
- `""` virasse `0`
- `null` virasse `0`
- `undefined` virasse `0`

Ou seja, o fallback para `padrao` nunca era alcançado nesses casos.

## 4. Arquivos alterados
Arquivos realmente alterados nesta correção:

- `frontend/js/modules/etiquetas.js`
- `frontend/app.js`
- `docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md`

`frontend/index.html` não foi alterado nesta etapa.

## 5. Correção aplicada
A correção foi pequena e localizada:

- em `frontend/js/modules/etiquetas.js`, `normalizeNumber(valor, padrao)` passou a tratar explicitamente:
  - `""`
  - `null`
  - `undefined`

Antes da conversão numérica.

- em `frontend/app.js`, o wrapper/fallback de `etqNumero(valor, padrao)` recebeu a mesma proteção explícita antes de converter o valor.

Com isso:
- `normalizeNumber("12,5", 0) -> 12.5`
- `normalizeNumber("", 7) -> 7`
- `normalizeNumber(null, 9) -> 9`
- `normalizeNumber(undefined, 11) -> 11`
- `normalizeNumber("abc", 3) -> 3`
- `normalizeNumber(0, 5) -> 0`
- `normalizeNumber("0", 5) -> 0`
- `normalizeNumber("0,5", 1) -> 0.5`

## 6. Confirmação de que app.js manteve wrapper/fallback
`etqNumero(valor, padrao)` continua existindo em `frontend/app.js` como wrapper/fallback.

Ele:
- chama `window.BranaEtiquetasModule.normalizeNumber(valor, padrao)` quando disponível
- preserva a assinatura original
- mantém fallback local equivalente
- não altera os chamadores

## 7. Confirmação de que não houve alteração em `etqFormatNumero` nem `etqLayoutFromItem`
Nesta correção:

- `etqFormatNumero(valor)` não foi alterado
- `etqLayoutFromItem(item)` não foi alterado
- nenhum chamador dessas funções foi alterado

## 8. Checks finais
Checks executados:

- `node --check frontend/app.js`
- `node --check frontend/js/modules/etiquetas.js`
- `git status --short`
- `git diff --stat`

Resultado dos checks:

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/etiquetas.js`: OK

Teste direto do helper executado no Node:

```js
[12.5,7,9,11,3,0,0,0.5]
```

Estado atual do git:

```text
 M frontend/app.js
 M frontend/index.html
?? docs/etiquetas_subetapa_0_mapeamento_monolitico.md
?? docs/etiquetas_subetapa_1_namespace_passivo.md
?? docs/etiquetas_subetapa_2_fronteiras_contratos.md
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
?? frontend/js/modules/etiquetas.js
```

`git diff --stat` atual:

```text
 frontend/app.js     | 13 ++++++++++++-
 frontend/index.html |  1 +
 2 files changed, 13 insertions(+), 1 deletion(-)
```

## 9. Onde testar antes de avançar
Teste no navegador:

1. Abrir o sistema com `Ctrl+F5`.
2. Abrir `Etiquetas / Configuração de modelos de etiqueta`.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Abrir edição.
6. Conferir o preview.
7. Fechar e reabrir.
8. Confirmar console sem `ReferenceError` ou `TypeError`.

Teste opcional no console:

```js
[
  window.BranaEtiquetasModule.normalizeNumber("12,5", 0),
  window.BranaEtiquetasModule.normalizeNumber("", 7),
  window.BranaEtiquetasModule.normalizeNumber(null, 9),
  window.BranaEtiquetasModule.normalizeNumber(undefined, 11),
  window.BranaEtiquetasModule.normalizeNumber("abc", 3),
  window.BranaEtiquetasModule.normalizeNumber(0, 5),
  window.BranaEtiquetasModule.normalizeNumber("0", 5),
  window.BranaEtiquetasModule.normalizeNumber("0,5", 1)
]
```

Resultado esperado:

```js
[12.5, 7, 9, 11, 3, 0, 0, 0.5]
```

