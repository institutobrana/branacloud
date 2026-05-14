# Subetapa 4 — Validação dos helpers extraídos de Etiquetas

## 1. Contexto
Esta etapa valida o ciclo de helpers extraídos de Etiquetas sem mover fluxo principal.

Referências de base:
- `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
- `docs/etiquetas_subetapa_1_namespace_passivo.md`
- `docs/etiquetas_subetapa_2_fronteiras_contratos.md`
- `docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md`
- `docs/etiquetas_subetapa_3b_helper_etqformatnumero.md`
- `docs/etiquetas_subetapa_3b_correcao_formatnumber_virgula.md`
- `docs/etiquetas_subetapa_3c_helper_etqlayoutfromitem.md`

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
- `docs/etiquetas_subetapa_3c_helper_etqlayoutfromitem.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

Documentos obrigatórios ausentes:
- `docs/etiquetas_subetapa_3a_helper_etqnumero.md`

## 4. Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/etiquetas.js`

## 5. Arquivos alterados
Nesta etapa, o único arquivo criado foi:
- `docs/etiquetas_subetapa_4_validacao_helpers.md`

Confirmado que:
- `frontend/app.js` não foi alterado nesta etapa
- `frontend/index.html` não foi alterado nesta etapa

## 6. Estado final dos helpers no módulo
### `normalizeNumber(valor, padrao)`
- Responsabilidade: normalizar valor numérico com fallback para padrão
- Entrada: qualquer valor
- Saída: número finito ou `padrao`
- Ausência de DOM/API/estado: confirmada
- Uso atual via wrapper/fallback no app.js: sim, através de `etqNumero(valor, padrao)`

### `formatNumber(valor)`
- Responsabilidade: formatar número com duas casas e vírgula decimal
- Entrada: qualquer valor
- Saída: string formatada ou string vazia para valor inválido
- Ausência de DOM/API/estado: confirmada
- Uso atual via wrapper/fallback no app.js: sim, através de `etqFormatNumero(valor)`

### `layoutFromItem(item)`
- Responsabilidade: montar o layout de impressão a partir do item recebido
- Entrada: objeto `item`
- Saída: objeto com `pageW`, `pageH` e `labels`, ou `null`
- Ausência de DOM/API/estado: confirmada
- Uso atual via wrapper/fallback no app.js: sim, através de `etqLayoutFromItem(item)`

## 7. Wrappers/fallbacks preservados no app.js
Continuam existindo em `frontend/app.js`:
- `etqNumero(valor, padrao)`
- `etqFormatNumero(valor)`
- `etqLayoutFromItem(item)`

Os três wrappers preservam fallback local e continuam compatíveis com o carregamento do módulo passivo.

## 8. Chamadores preservados
Os fluxos continuam no `app.js` e não foram movidos:
- `etqSyncPreview()`
- `etqSalvarModal()`
- `etqAplicarPadraoSelecionado()`
- `etqAbrirModal()`
- `etqTesteImprimir()`

## 9. Impressão e layout
Confirmado:
- `etqTesteImprimir()` não foi alterado
- o fluxo de impressão continua no `app.js`
- `layoutFromItem` apenas monta o objeto de layout
- nenhum print/preview foi executado pelo módulo
- nenhum acesso a DOM foi adicionado ao módulo

## 10. Status do namespace
O `getStatus()` atual de `window.BranaEtiquetasModule` permanece:

```json
{"loaded":true,"passive":true,"functionalDelegation":true,"appJsModified":true,"canMoveHelpers":false,"stage":"Subetapa 3-C"}
```

Não houve ajuste de metadados nesta etapa.

Significado dos campos:
- `passive`: o namespace não controla o fluxo principal
- `functionalDelegation`: helpers extraídos são chamados via wrapper/fallback
- `appJsModified`: o `app.js` contém as integrações de compatibilidade
- `canMoveHelpers`: nesta fase, não há autorização para mover novos helpers
- `stage`: marca a etapa interna atual do namespace

## 11. O que NÃO foi alterado
Confirmado explicitamente:
- `frontend/app.js` não foi alterado nesta etapa
- `frontend/index.html` não foi alterado nesta etapa
- abertura não foi movida
- listagem não foi movida
- seleção não foi movida
- edição não foi movida
- salvamento não foi movido
- exclusão não foi movida
- impressão não foi movida
- `pref-modelo-etiqueta` não foi alterado
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados
- nenhum commit foi feito

## 12. Checks finais
Checks executados:
- `node --check frontend/app.js`
- `node --check frontend/js/modules/etiquetas.js`
- `git status --short`
- `git diff --stat`

Resultado:
- `node --check frontend/app.js`: OK
- `node --check frontend/js/modules/etiquetas.js`: OK

## 13. Onde testar antes de avançar
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

### `normalizeNumber`
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

### `formatNumber`
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

### `layoutFromItem`
Testar apenas com objeto controlado baseado nos campos reais da função original.

## 14. Recomendação para próxima etapa
Recomendação conservadora:
- encerrar o ciclo de helpers de Etiquetas com uma Subetapa 5 documental

Não recomendar mover abertura, listagem, edição, salvamento, exclusão ou impressão nesta rodada.

## 15. Confirmação final
Confirmado explicitamente:
- Subetapa 4 concluída
- etapa foi de validação dos helpers extraídos
- nenhum novo helper foi extraído
- nenhum fluxo principal foi movido
- wrappers/fallbacks continuam preservados
- `frontend/app.js` não foi alterado nesta etapa
- `frontend/index.html` não foi alterado nesta etapa
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados
- nenhum commit foi feito

