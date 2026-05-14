# Subetapa 3-C — Extração conservadora do helper etqLayoutFromItem

## 1. Contexto
Esta etapa extraiu somente o helper puro `etqLayoutFromItem(item)`, mantendo wrapper/fallback no `app.js`.

Referências consultadas:
- `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
- `docs/etiquetas_subetapa_1_namespace_passivo.md`
- `docs/etiquetas_subetapa_2_fronteiras_contratos.md`
- `docs/etiquetas_subetapa_3a_helper_etqnumero.md` (não encontrado)
- `docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md`
- `docs/etiquetas_subetapa_3b_helper_etqformatnumero.md`
- `docs/etiquetas_subetapa_3b_correcao_formatnumber_virgula.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

## 2. Comandos iniciais executados
`git branch --show-current`
```text
modularizacao-segura-fase-1
```

`git status --short`
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

`git diff --stat`
```text
 frontend/app.js     | 27 +++++++++++++++++++++++++--
 frontend/index.html |  1 +
 2 files changed, 26 insertions(+), 2 deletions(-)
```

`git log --oneline -10`
```text
1f7ed77 docs: registra varredura do próximo módulo pós-medicamentos
38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares
59da421 feat(frontend): encerra ciclo seguro dos helpers de medicamentos
8a1b799 feat(frontend): encerra ciclo seguro dos helpers de cid
39330d3 feat(frontend): encerra ciclo seguro dos helpers de plano de contas
b415b5c Encerra ciclo seguro de helpers de Unidades
ab102c8 Audita helpers modulares de Unidades
91b65e9 Usa helper modular de telefone em Unidades com fallback
45419a5 Usa helper modular de codigo em Unidades com fallback
795c664 Usa helper modular de status em Unidades com fallback
```

## 3. Arquivos lidos
Documentos obrigatórios encontrados e analisados:
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
- `docs/etiquetas_subetapa_1_namespace_passivo.md`
- `docs/etiquetas_subetapa_2_fronteiras_contratos.md`
- `docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md`
- `docs/etiquetas_subetapa_3b_helper_etqformatnumero.md`
- `docs/etiquetas_subetapa_3b_correcao_formatnumber_virgula.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

Documentos obrigatórios ausentes:
- `docs/etiquetas_subetapa_3a_helper_etqnumero.md`

## 4. Arquivos de código analisados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/etiquetas.js`

## 5. Arquivos alterados
Arquivos realmente alterados nesta etapa:
- `frontend/js/modules/etiquetas.js`
- `frontend/app.js`
- `docs/etiquetas_subetapa_3c_helper_etqlayoutfromitem.md`

`frontend/index.html` não foi alterado nesta etapa.

## 6. Helper extraído
- Helper original: `etqLayoutFromItem(item)`
- Método no módulo: `layoutFromItem(item)`
- Motivo da extração: classificado como `PURO` na Subetapa 2
- Entradas:
  - `item.nro_colunas`
  - `item.nro_linhas`
  - `item.margem_esq`
  - `item.margem_sup`
  - `item.esp_horizontal`
  - `item.esp_vertical`
  - `item.padrao_nome`
  - `item.nome`
- Saída:
  - objeto com `pageW`, `pageH` e `labels`
  - ou `null` quando `item` é ausente
- Campos considerados:
  - colunas e linhas do modelo
  - margens esquerda e superior
  - espaçamento horizontal e vertical
  - nome do padrão/modelo para detectar envelope
- Padrões aplicados:
  - `nro_colunas` limitado entre 1 e 20
  - `nro_linhas` limitado entre 1 e 40
  - página A4 de `210 x 297`
  - envelope especial quando `cols === 1`, `rows === 1` e o rótulo bate em `/envelope/i`
  - labels gerados com posições em milímetros
- Comportamento preservado:
  - cálculo de layout continua determinístico
  - item ausente retorna `null`
  - valores ausentes ou inválidos seguem a mesma conversão numérica do fluxo original
- Relação com `normalizeNumber`:
  - `layoutFromItem(item)` usa `normalizeNumber` internamente para margens e espaçamentos
  - não usa `etqNumero` do `app.js`

## 7. Wrapper/fallback preservado no app.js
`etqLayoutFromItem(item)` continua existindo em `frontend/app.js` como wrapper.

O wrapper:
- chama `window.BranaEtiquetasModule.layoutFromItem(item)` quando disponível
- mantém fallback local com a lógica original
- preserva a assinatura
- preserva a chamada existente em `etqTesteImprimir()`
- evita quebra se o script do módulo não carregar

## 8. Chamador preservado
O chamador existente não foi alterado:
- `etqTesteImprimir()`

## 9. O que NÃO foi alterado
Confirmado explicitamente:
- `etqTesteImprimir` não foi alterado
- fluxo de impressão não foi alterado
- `etqNumero` não teve comportamento alterado
- `normalizeNumber` não teve comportamento alterado
- `etqFormatNumero` não teve comportamento alterado
- `formatNumber` não teve comportamento alterado
- fluxo de abertura não foi alterado
- fluxo de listagem não foi alterado
- fluxo de seleção não foi alterado
- fluxo de edição não foi alterado
- fluxo de salvamento não foi alterado
- fluxo de exclusão não foi alterado
- `pref-modelo-etiqueta` não foi alterado
- `frontend/index.html` não foi alterado nesta etapa
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados

## 10. Riscos e mitigação
Riscos observados:
- diferença no objeto de layout retornado
- campos ausentes no item
- valores vazios
- `null`
- `undefined`
- valores inválidos
- vírgula/ponto decimal
- impacto no teste de impressão
- fallback em caso de módulo indisponível

Mitigação aplicada:
- wrapper preservado
- fallback local
- assinatura preservada
- `etqTesteImprimir` preservado
- lógica original preservada
- `node --check` executado

## 11. Checks finais
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
{"pageW":210,"pageH":297,"labels":[{"x":10,"y":5,"w":94,"h":142},{"x":106,"y":5,"w":94,"h":142},{"x":10,"y":150,"w":94,"h":142},{"x":106,"y":150,"w":94,"h":142}]}
```

Validação direta de status do namespace:

```js
{"loaded":true,"passive":true,"functionalDelegation":true,"appJsModified":true,"canMoveHelpers":false,"stage":"Subetapa 3-C"}
```

Validação direta do contrato do helper:

```js
{"classificacao":"PURO","risco":"baixo","observacao":"Extracao conservadora do helper etqLayoutFromItem com fallback no app.js."}
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
?? docs/etiquetas_subetapa_3c_helper_etqlayoutfromitem.md
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
?? frontend/js/modules/etiquetas.js
```

`git diff --stat` atual:

```text
 frontend/app.js     | 34 ++++++++++++++++++++++++++++++++--
 frontend/index.html |  1 +
 2 files changed, 33 insertions(+), 2 deletions(-)
```

## 12. Onde testar antes de avançar
1. Abrir o sistema com `Ctrl+F5`.
2. Abrir `Etiquetas / Configuração de modelos de etiqueta`.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Selecionar um item.
6. Abrir edição.
7. Conferir se campos numéricos aparecem formatados corretamente.
8. Conferir se o preview continua coerente.
9. Executar teste de impressão somente se for seguro.
10. Confirmar que a impressão/preview usa o mesmo layout esperado.
11. Fechar e reabrir o modal/painel.
12. Confirmar console sem `ReferenceError` ou `TypeError`.

Teste opcional no console:

```js
window.BranaEtiquetasModule
window.BranaEtiquetasModule.getInfo && window.BranaEtiquetasModule.getInfo()
window.BranaEtiquetasModule.getStatus && window.BranaEtiquetasModule.getStatus()
window.BranaEtiquetasModule.getContracts && window.BranaEtiquetasModule.getContracts()
```

Testar `normalizeNumber`:

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

Testar `formatNumber`:

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

Testar `layoutFromItem` apenas com objeto controlado e campos reais confirmados no app.js.

## 13. Recomendação para próxima etapa
Após testar Etiquetas no navegador, seguir para uma Subetapa 4 de validação/integração mínima ou encerramento dos helpers, sem mover fluxo principal.

Não recomendar mover abertura, listagem, edição, salvamento, exclusão ou impressão.

## 14. Confirmação final
Confirma-se explicitamente:
- Subetapa 3-C concluída
- apenas `etqLayoutFromItem` foi extraído
- `etqLayoutFromItem` continua existindo no `app.js` como wrapper/fallback
- `etqTesteImprimir` não foi alterado
- `etqNumero` não teve comportamento alterado
- `etqFormatNumero` não teve comportamento alterado
- nenhum fluxo funcional foi alterado intencionalmente
- `frontend/index.html` não foi alterado nesta etapa
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados
- nenhum commit foi feito
