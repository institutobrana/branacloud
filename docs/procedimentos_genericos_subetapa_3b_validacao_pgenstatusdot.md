# Subetapa 3-B — Validação conservadora do helper pgenStatusDot

## 1. Contexto
Esta etapa validou de forma conservadora o helper `pgenStatusDot(inativo)` já extraído na Subetapa 3-A, sem avançar para `pgenPayloadFromState` e sem mexer em custos, materiais, financeiro ou payload.

Referências usadas:
- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `docs/procedimentos_genericos_subetapa_3a_helper_pgenstatusdot.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/etiquetas_subetapa_4_validacao_helpers.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`

## 2. Comandos iniciais executados
Saída registrada:

`git branch --show-current`
```text
modularizacao-segura-fase-1
```

`git status --short`
```text
 M frontend/app.js
 M frontend/index.html
?? docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md
?? docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md
?? docs/procedimentos_genericos_subetapa_1_namespace_passivo.md
?? docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md
?? docs/procedimentos_genericos_subetapa_3a_helper_pgenstatusdot.md
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
?? frontend/js/modules/procedimentos-genericos.js
```

`git diff --stat`
```text
 frontend/app.js     | 6 +++++-
 frontend/index.html | 1 +
 2 files changed, 6 insertions(+), 1 deletion(-)
```

## 3. Documentos consultados
Documentos encontrados e analisados:
- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `docs/procedimentos_genericos_subetapa_3a_helper_pgenstatusdot.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/etiquetas_subetapa_4_validacao_helpers.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`

Documentos ausentes dentre os consultados nesta etapa:
- nenhum

## 4. Arquivos analisados
- `frontend/app.js`
- `frontend/js/modules/procedimentos-genericos.js`

## 5. Arquivos alterados
Arquivos alterados nesta subetapa:
- `docs/procedimentos_genericos_subetapa_3b_validacao_pgenstatusdot.md`

Arquivos que não foram alterados nesta subetapa:
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/procedimentos-genericos.js`

## 6. Helper validado
Helper validado:
- `pgenStatusDot(inativo)` no `frontend/app.js`
- `statusDot(inativo)` no `frontend/js/modules/procedimentos-genericos.js`

Responsabilidade:
- converter o estado `inativo` em um marcador visual de status.

Entrada:
- `true`, `false`, `1`, `0`, `"1"`, `"0"`, `""`, `null`, `undefined`

Saída observada:
- o mesmo HTML de status visual já usado pelo fluxo original, com `on/off` preservado.

Ausência confirmada:
- sem DOM
- sem API
- sem `requestJson`
- sem estado global mutável
- sem payload
- sem custos
- sem materiais
- sem financeiro

## 7. Wrapper/fallback preservado no app.js
Confirmado por inspeção do código:
- `pgenStatusDot(inativo)` continua no `app.js` como wrapper/fallback
- o wrapper tenta usar `window.BranaProcedimentosGenericosModule.statusDot(inativo)`
- se o namespace não existir, se o método não for função ou se houver erro, usa o HTML local original
- as chamadas existentes não foram alteradas

## 8. Chamadores preservados
Confirmado:
- `pgenStatusDot` continua sendo usado na renderização da lista de Procedimentos Genéricos
- `pgenPayloadFromState` não foi alterado
- `pgenDetalheParaEstado` não foi alterado
- `pgenAbrir` não foi alterado

## 9. O que não foi alterado
Confirmado nesta etapa:
- custos não foram alterados
- materiais não foram alterados
- financeiro não foi alterado
- `procFmtMoeda` não foi alterado
- `procParse` não foi alterado
- `toFloat` não foi alterado
- `pgenPayloadFromState` não foi alterado
- `pgenDetalheParaEstado` não foi alterado
- `pgenAbrir` não foi alterado
- backend não foi alterado
- banco não foi alterado
- endpoints não foram alterados
- nenhuma nova modularização foi feita

## 10. Resultados dos spot tests
Spot test controlado executado com:
- `true`
- `false`
- `1`
- `0`
- `"1"`
- `"0"`
- `""`
- `null`
- `undefined`

Resultado observado no helper modular:
```text
["<span class=\"pgen-status-dot off\"></span>","<span class=\"pgen-status-dot on\"></span>","<span class=\"pgen-status-dot off\"></span>","<span class=\"pgen-status-dot on\"></span>","<span class=\"pgen-status-dot off\"></span>","<span class=\"pgen-status-dot off\"></span>","<span class=\"pgen-status-dot on\"></span>","<span class=\"pgen-status-dot on\"></span>","<span class=\"pgen-status-dot on\"></span>"]
```

Interpretação:
- a lógica visual permanece equivalente à original
- valores truthy/falsy continuam mapeados para os mesmos estados visuais esperados

## 11. Checks executados
`node --check frontend/app.js`
- OK

`node --check frontend/js/modules/procedimentos-genericos.js`
- OK

`git diff --stat`
```text
 frontend/app.js     | 6 +++++-
 frontend/index.html | 1 +
 2 files changed, 6 insertions(+), 1 deletion(-)
```

`git status --short`
```text
 M frontend/app.js
 M frontend/index.html
?? docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md
?? docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md
?? docs/procedimentos_genericos_subetapa_1_namespace_passivo.md
?? docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md
?? docs/procedimentos_genericos_subetapa_3a_helper_pgenstatusdot.md
?? docs/procedimentos_genericos_subetapa_3b_validacao_pgenstatusdot.md
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
?? frontend/js/modules/procedimentos-genericos.js
```

## 12. Onde testar no navegador
1. Fazer `Ctrl+F5`.
2. Abrir `Procedimentos Genéricos`.
3. Confirmar que a lista abre normalmente.
4. Confirmar que os indicadores/status visuais continuam iguais.
5. Selecionar procedimento ativo e inativo, se existir.
6. Abrir alteração.
7. Conferir a aba Custos.
8. Confirmar que `Custo da hora clínica` continua correto.
9. Confirmar que `Custo de materiais` não explode.
10. Confirmar que listar, selecionar, novo, alterar, cancelar/fechar continuam iguais.
11. Confirmar console sem `ReferenceError` ou `TypeError`.
12. Conferir:
    - `window.BranaProcedimentosGenericosModule`
    - `window.BranaProcedimentosGenericosModule.getStatus()`
    - `window.BranaProcedimentosGenericosModule.statusDot`

## 13. Recomendação objetiva para a próxima subetapa
Recomendação conservadora:
- avançar apenas se quiser validar a próxima fronteira documental ou preparar a Subetapa 4 sem tocar em `pgenPayloadFromState`, custos, materiais, financeiro ou `pgenDetalheParaEstado`.

## 14. Confirmação final
- `pgenPayloadFromState` não foi alterado
- `pgenDetalheParaEstado` não foi alterado
- `pgenAbrir` não foi alterado
- custos, materiais e financeiro não foram alterados
- `procFmtMoeda`, `procParse` e `toFloat` não foram alterados
- backend, banco e endpoints não foram alterados
- o wrapper/fallback de `pgenStatusDot` permanece ativo
- nenhum novo helper foi extraído nesta etapa
- nenhum commit foi feito nesta etapa
