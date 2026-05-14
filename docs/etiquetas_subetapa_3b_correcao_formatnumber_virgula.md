# Subetapa 3-B — Correção do helper `formatNumber`

## 1. Contexto
Esta correção ajusta a extração conservadora do helper `etqFormatNumero(valor)` para o namespace `window.BranaEtiquetasModule`, mantendo wrapper/fallback no `app.js`.

O objetivo foi preservar o comportamento esperado com decimal brasileiro usando vírgula, sem alterar:
- `etqNumero`
- `normalizeNumber`
- `etqLayoutFromItem`

## 2. Teste que falhou
Teste executado no navegador antes da correção:

```js
[
  window.BranaEtiquetasModule.formatNumber(12.5),
  window.BranaEtiquetasModule.formatNumber(""),
  window.BranaEtiquetasModule.formatNumber(null),
  window.BranaEtiquetasModule.formatNumber(undefined),
  window.BranaEtiquetasModule.formatNumber("abc"),
  window.BranaEtiquetasModule.formatNumber(0),
  window.BranaEtiquetasModule.formatNumber("0"),
  window.BranaEtiquetasModule.formatNumber("0,5")
]
```

Resultado obtido antes da correção:

```js
["12,50", "0,00", "0,00", "", "", "0,00", "0,00", ""]
```

Resultado esperado:

```js
["12,50", "0,00", "0,00", "", "", "0,00", "0,00", "0,50"]
```

## 3. Causa provável
A implementação extraída de `formatNumber` estava convertendo a string diretamente com `Number(valor)`.

Isso fazia com que:
- `"0,5"` fosse convertido em `NaN`
- o helper retornasse `""`

Ou seja, a vírgula decimal precisava ser normalizada antes da conversão numérica.

## 4. Arquivos alterados
Arquivos realmente alterados nesta correção:

- `frontend/js/modules/etiquetas.js`
- `frontend/app.js`
- `docs/etiquetas_subetapa_3b_correcao_formatnumber_virgula.md`

`frontend/index.html` não foi alterado nesta etapa.

## 5. Correção aplicada
Ajuste aplicado de forma mínima:

- em `frontend/js/modules/etiquetas.js`, `formatNumber(valor)` agora:
  - retorna `""` para `undefined`
  - preserva `null` e string vazia pelo fluxo numérico normal
  - converte strings com vírgula decimal usando `replace(",", ".")` antes de `Number(...)`

- em `frontend/app.js`, o wrapper/fallback de `etqFormatNumero(valor)` recebeu a mesma normalização de vírgula decimal no fallback local.

Com isso, o comportamento esperado foi restabelecido:

```js
formatNumber(12.5) -> "12,50"
formatNumber("") -> "0,00"
formatNumber(null) -> "0,00"
formatNumber(undefined) -> ""
formatNumber("abc") -> ""
formatNumber(0) -> "0,00"
formatNumber("0") -> "0,00"
formatNumber("0,5") -> "0,50"
```

## 6. Confirmação de que app.js manteve wrapper/fallback
`etqFormatNumero(valor)` continua existindo em `frontend/app.js` como wrapper/fallback.

Ele:
- chama `window.BranaEtiquetasModule.formatNumber(valor)` quando disponível
- mantém fallback local com a lógica atualizada
- preserva a assinatura
- preserva os chamadores existentes
- evita quebra se o script do módulo não carregar

## 7. Confirmação de que não houve alteração em `etqNumero`, `normalizeNumber` nem `etqLayoutFromItem`
Nesta correção:
- `etqNumero` não foi alterado
- `normalizeNumber` não foi alterado
- `etqLayoutFromItem` não foi alterado

Os testes da Subetapa 3-A continuam válidos:

```js
[12.5, 7, 9, 11, 3, 0, 0, 0.5]
```

## 8. Checks finais
Checks executados:

- `node --check frontend/app.js`
- `node --check frontend/js/modules/etiquetas.js`
- `git status --short`
- `git diff --stat`

Resultado dos checks:

- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/etiquetas.js`: OK

Validação direta do helper no módulo:

```js
["12,50","0,00","0,00","","","0,00","0,00","0,50"]
```

Validação direta de `normalizeNumber` após a correção:

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
?? docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md
?? docs/etiquetas_subetapa_3b_correcao_formatnumber_virgula.md
?? docs/etiquetas_subetapa_3b_helper_etqformatnumero.md
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
?? frontend/js/modules/etiquetas.js
```

`git diff --stat` atual:

```text
 frontend/app.js     | 27 +++++++++++++++++++++++++--
 frontend/index.html |  1 +
 2 files changed, 26 insertions(+), 2 deletions(-)
```

## 9. Onde testar antes de avançar
1. Abrir o sistema com `Ctrl+F5`.
2. Abrir `Etiquetas / Configuração de modelos de etiqueta`.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Abrir edição.
6. Conferir se campos numéricos aparecem formatados corretamente.
7. Fechar e reabrir.
8. Confirmar console sem `ReferenceError` ou `TypeError`.

Teste opcional no console:

```js
[
  window.BranaEtiquetasModule.formatNumber(12.5),
  window.BranaEtiquetasModule.formatNumber(""),
  window.BranaEtiquetasModule.formatNumber(null),
  window.BranaEtiquetasModule.formatNumber(undefined),
  window.BranaEtiquetasModule.formatNumber("abc"),
  window.BranaEtiquetasModule.formatNumber(0),
  window.BranaEtiquetasModule.formatNumber("0"),
  window.BranaEtiquetasModule.formatNumber("0,5")
]
```

Resultado esperado:

```js
["12,50", "0,00", "0,00", "", "", "0,00", "0,00", "0,50"]
```

Também retestar `normalizeNumber` para garantir que a correção não quebrou a Subetapa 3-A:

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

