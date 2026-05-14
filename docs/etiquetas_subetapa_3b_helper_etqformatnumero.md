# Subetapa 3-B — Extração conservadora do helper etqFormatNumero

## 1. Contexto
Esta etapa extraiu somente o helper puro `etqFormatNumero(valor)`, mantendo wrapper/fallback no `app.js`.

Referências consultadas:
- `docs/etiquetas_subetapa_0_mapeamento_monolitico.md`
- `docs/etiquetas_subetapa_1_namespace_passivo.md`
- `docs/etiquetas_subetapa_2_fronteiras_contratos.md`
- `docs/etiquetas_subetapa_3a_helper_etqnumero.md` (não encontrado no disco nesta execução)
- `docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md`

## 2. Comandos iniciais executados
Saída de:

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
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
?? frontend/js/modules/etiquetas.js
```

`git diff --stat`
```text
 frontend/app.js     | 13 ++++++++++++-
 frontend/index.html |  1 +
 2 files changed, 13 insertions(+), 1 deletion(-)
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
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`

Documentos obrigatórios ausentes:
- `docs/etiquetas_subetapa_3a_helper_etqnumero.md`

## 4. Arquivos alterados
Arquivos realmente alterados nesta etapa:
- `frontend/js/modules/etiquetas.js`
- `frontend/app.js`
- `docs/etiquetas_subetapa_3b_helper_etqformatnumero.md`

`frontend/index.html` não foi alterado nesta etapa.

## 5. Helper extraído
- Helper original: `etqFormatNumero(valor)`
- Método no módulo: `formatNumber(valor)`
- Motivo da extração: classificado como `PURO` na Subetapa 2
- Entradas: qualquer valor recebido pelo fluxo do modal/padrão
- Saída: string formatada com duas casas decimais e vírgula decimal, ou string vazia para valores inválidos
- Comportamento preservado:
  - `12.5` -> `"12,50"`
  - `""` -> `"0,00"`
  - `null` -> `"0,00"`
  - `undefined` -> `""`
  - `"abc"` -> `""`
  - `0` -> `"0,00"`
  - `"0"` -> `"0,00"`
  - `"0,5"` -> `"0,50"`

## 6. Wrapper/fallback preservado no app.js
`etqFormatNumero(valor)` continua existindo em `frontend/app.js` como wrapper.

O wrapper:
- chama `window.BranaEtiquetasModule.formatNumber(valor)` quando disponível
- mantém fallback local com a lógica original
- preserva a assinatura
- preserva chamadas existentes
- evita quebra se o script do módulo não carregar

## 7. Chamadores preservados
Os chamadores existentes não foram alterados:
- `etqAplicarPadraoSelecionado()`
- `etqAbrirModal()`

## 8. O que NÃO foi alterado
Confirmado explicitamente:
- `etqLayoutFromItem` não foi movido
- `etqNumero` já extraído na Subetapa 3-A não teve comportamento alterado
- `normalizeNumber` não teve comportamento alterado
- fluxo de abertura não foi alterado
- fluxo de listagem não foi alterado
- fluxo de seleção não foi alterado
- fluxo de edição não foi alterado
- fluxo de salvamento não foi alterado
- fluxo de exclusão não foi alterado
- teste de impressão não foi alterado
- `pref-modelo-etiqueta` não foi alterado
- `frontend/index.html` não foi alterado nesta etapa
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados

## 9. Riscos e mitigação
Riscos observados:
- diferença de formatação numérica
- vírgula/ponto decimal
- string vazia
- `null`
- `undefined`
- zero
- valores inválidos
- fallback em caso de módulo indisponível
- impacto indireto em seleção de padrão e abertura do modal

Mitigação aplicada:
- wrapper preservado
- fallback local
- assinatura preservada
- chamadores preservados
- lógica original preservada
- `node --check` executado

## 10. Checks finais
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
["12,50","0,00","0,00","","","0,00","0,00",""]
```

Estado atual do git:

```text
 M frontend/app.js
 M frontend/index.html
?? docs/etiquetas_subetapa_0_mapeamento_monolitico.md
?? docs/etiquetas_subetapa_1_namespace_passivo.md
?? docs/etiquetas_subetapa_2_fronteiras_contratos.md
?? docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md
?? docs/etiquetas_subetapa_3b_helper_etqformatnumero.md
?? docs/recomendacao_proximo_modulo_pos_auxiliares.md
?? frontend/js/modules/etiquetas.js
```

`git diff --stat` atual:

```text
 frontend/app.js     | 24 ++++++++++++++++++++++--
 frontend/index.html |  1 +
 2 files changed, 23 insertions(+), 2 deletions(-)
```

## 11. Onde testar antes de avançar
1. Abrir o sistema com `Ctrl+F5`.
2. Abrir `Etiquetas / Configuração de modelos de etiqueta`.
3. Confirmar que o painel abre.
4. Confirmar que a lista carrega.
5. Selecionar um item.
6. Abrir edição.
7. Conferir se campos numéricos aparecem formatados corretamente.
8. Aplicar padrão selecionado, se essa opção existir e for segura.
9. Confirmar se valores continuam aparecendo no mesmo formato anterior.
10. Fechar e reabrir o modal/painel.
11. Confirmar console sem `ReferenceError` ou `TypeError`.

Teste opcional no console:

```js
window.BranaEtiquetasModule
window.BranaEtiquetasModule.getInfo && window.BranaEtiquetasModule.getInfo()
window.BranaEtiquetasModule.getStatus && window.BranaEtiquetasModule.getStatus()
window.BranaEtiquetasModule.getContracts && window.BranaEtiquetasModule.getContracts()
window.BranaEtiquetasModule.normalizeNumber && window.BranaEtiquetasModule.normalizeNumber("12,5", 0)
window.BranaEtiquetasModule.normalizeNumber && window.BranaEtiquetasModule.normalizeNumber("", 7)
window.BranaEtiquetasModule.normalizeNumber && window.BranaEtiquetasModule.normalizeNumber(null, 9)
window.BranaEtiquetasModule.normalizeNumber && window.BranaEtiquetasModule.normalizeNumber(undefined, 11)
window.BranaEtiquetasModule.normalizeNumber && window.BranaEtiquetasModule.normalizeNumber("abc", 3)
window.BranaEtiquetasModule.normalizeNumber && window.BranaEtiquetasModule.normalizeNumber(0, 5)
window.BranaEtiquetasModule.normalizeNumber && window.BranaEtiquetasModule.normalizeNumber("0", 5)
window.BranaEtiquetasModule.normalizeNumber && window.BranaEtiquetasModule.normalizeNumber("0,5", 1)
window.BranaEtiquetasModule.formatNumber && window.BranaEtiquetasModule.formatNumber(12.5)
window.BranaEtiquetasModule.formatNumber && window.BranaEtiquetasModule.formatNumber("")
window.BranaEtiquetasModule.formatNumber && window.BranaEtiquetasModule.formatNumber(null)
```

Resultado esperado dos testes de `normalizeNumber`:

```js
[12.5, 7, 9, 11, 3, 0, 0, 0.5]
```

## 12. Recomendação para Subetapa 3-C
Só avançar para `etqLayoutFromItem` depois de testar Etiquetas no navegador.

Na Subetapa 3-C, extrair apenas `etqLayoutFromItem`, mantendo wrapper/fallback no `app.js`, com atenção especial ao teste de impressão.

## 13. Confirmação final
Confirma-se explicitamente:
- Subetapa 3-B concluída
- apenas `etqFormatNumero` foi extraído
- `etqFormatNumero` continua existindo no `app.js` como wrapper/fallback
- `etqLayoutFromItem` não foi movido
- `etqNumero` não teve comportamento alterado
- `normalizeNumber` não teve comportamento alterado
- nenhum fluxo funcional foi alterado intencionalmente
- `frontend/index.html` não foi alterado nesta etapa
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados
- nenhum commit foi feito

