# Subetapa 5 — Encerramento do ciclo de helpers de Etiquetas

## 1. Contexto
Esta etapa encerra documentalmente o ciclo seguro de helpers do módulo Etiquetas / Configuração de modelos de etiqueta.

O ciclo foi conduzido em sequência conservadora:
- Subetapa 0: mapeamento monolítico
- Subetapa 1: namespace passivo
- Subetapa 2: fronteiras e contratos
- Subetapa 3-A: extração de `etqNumero` / `normalizeNumber`
- correção da 3-A: padrão para `""`, `null` e `undefined`
- Subetapa 3-B: extração de `etqFormatNumero` / `formatNumber`
- correção da 3-B: suporte a vírgula decimal em `"0,5"`
- Subetapa 3-C: extração de `etqLayoutFromItem` / `layoutFromItem`
- Subetapa 4: validação dos helpers

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
?? docs/etiquetas_subetapa_3c_helper_etqlayoutfromitem.md
?? docs/etiquetas_subetapa_4_validacao_helpers.md
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
?? frontend/js/modules/etiquetas.js
```

`git diff --stat`
```text
 frontend/app.js     | 34 ++++++++++++++++++++++++++++++++--
 frontend/index.html |  1 +
 2 files changed, 33 insertions(+), 2 deletions(-)
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

## 3. Documentos lidos
Documentos encontrados e analisados:
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/recomendacao_proximo_modulo_pos_auxiliares.md`
- `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
- `docs/etiquetas_subetapa_1_namespace_passivo.md`
- `docs/etiquetas_subetapa_2_fronteiras_contratos.md`
- `docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md`
- `docs/etiquetas_subetapa_3b_helper_etqformatnumero.md`
- `docs/etiquetas_subetapa_3b_correcao_formatnumber_virgula.md`
- `docs/etiquetas_subetapa_3c_helper_etqlayoutfromitem.md`
- `docs/etiquetas_subetapa_4_validacao_helpers.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

Documentos ausentes:
- `docs/etiquetas_subetapa_3a_helper_etqnumero.md`

## 4. Resumo das etapas executadas
- Subetapa 0: mapeamento monolítico
- Subetapa 1: namespace passivo
- Subetapa 2: fronteiras e contratos
- Subetapa 3-A: extração de `etqNumero` / `normalizeNumber`
- correção da 3-A: padrão para `""`, `null` e `undefined`
- Subetapa 3-B: extração de `etqFormatNumero` / `formatNumber`
- correção da 3-B: suporte a vírgula decimal em `"0,5"`
- Subetapa 3-C: extração de `etqLayoutFromItem` / `layoutFromItem`
- Subetapa 4: validação dos helpers

## 5. Estado final do módulo
Confirmado que:
- `window.BranaEtiquetasModule` existe
- `getInfo()` existe
- `getStatus()` existe
- `getContracts()` existe
- `normalizeNumber(valor, padrao)` existe
- `formatNumber(valor)` existe
- `layoutFromItem(item)` existe

O fluxo principal continua no `app.js`.

## 6. Wrappers/fallbacks preservados
Continuam no `app.js`:
- `etqNumero(valor, padrao)`
- `etqFormatNumero(valor)`
- `etqLayoutFromItem(item)`

Os wrappers mantêm fallback local para reduzir risco se o módulo não carregar.

## 7. Fluxos não movidos
Continuam no `app.js`:
- `etqAbrir()`
- abertura do painel
- listagem
- seleção
- edição
- salvamento
- exclusão
- preview
- teste de impressão
- `etqTesteImprimir()`
- dependência com `pref-modelo-etiqueta`

## 8. Validações registradas
`normalizeNumber` validado com:
```js
[12.5, 7, 9, 11, 3, 0, 0, 0.5]
```

`formatNumber` validado com:
```js
["12,50", "0,00", "0,00", "", "", "0,00", "0,00", "0,50"]
```

`layoutFromItem` com objeto controlado retornou layout esperado conforme Subetapa 3-C:
```js
{"pageW":210,"pageH":297,"labels":[{"x":10,"y":5,"w":94,"h":142},{"x":106,"y":5,"w":94,"h":142},{"x":10,"y":150,"w":94,"h":142},{"x":106,"y":150,"w":94,"h":142}]}
```

## 9. Riscos preservados
Riscos que continuam para ciclos futuros:
- o fluxo principal ainda está no `app.js`
- impressão continua sensível
- preview deve ser testado em navegador
- salvamento/exclusão não foram modularizados
- dependência com `pref-modelo-etiqueta` não foi movida
- wrappers/fallbacks devem ser mantidos por enquanto
- não remover `app.js` antes de nova etapa específica

## 10. Checks finais
Checks executados:
- `node --check frontend/app.js`
- `node --check frontend/js/modules/etiquetas.js`
- `git status --short`
- `git diff --stat`

Resultado:
- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/etiquetas.js`: OK

## 11. Onde testar antes de considerar o ciclo encerrado
1. Abrir o sistema com `Ctrl+F5`.
2. Abrir `Etiquetas / Configuração de modelos de etiqueta`.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Selecionar um item.
6. Abrir edição.
7. Conferir campos numéricos.
8. Alterar campo numérico com vírgula, por exemplo `0,5` ou `12,5`.
9. Conferir preview.
10. Aplicar padrão selecionado, se existir e for seguro.
11. Executar teste de impressão somente se for seguro.
12. Fechar e reabrir o painel.
13. Confirmar console sem `ReferenceError` ou `TypeError`.

Testes opcionais no console:

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

Esperado:
```js
[12.5, 7, 9, 11, 3, 0, 0, 0.5]
```

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

Esperado:
```js
["12,50", "0,00", "0,00", "", "", "0,00", "0,00", "0,50"]
```

## 12. Recomendação final
Recomenda-se:
- encerrar este ciclo de helpers de Etiquetas após smoke test manual
- não mover fluxo principal de Etiquetas agora
- não mover impressão agora
- não remover wrappers/fallbacks agora
- só avançar para outro módulo ou para nova rodada de Etiquetas após validação manual no navegador

## 13. Confirmação final
Confirmado explicitamente:
- Subetapa 5 concluída
- etapa foi somente documental
- nenhum código funcional foi alterado nesta etapa
- `frontend/app.js` não foi alterado nesta etapa
- `frontend/index.html` não foi alterado nesta etapa
- `frontend/js/modules/etiquetas.js` não foi alterado nesta etapa
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados
- nenhum commit foi feito

