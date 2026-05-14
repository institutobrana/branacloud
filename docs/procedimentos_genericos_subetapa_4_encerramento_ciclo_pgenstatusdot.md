# Subetapa 4 - Encerramento documental do ciclo seguro do helper pgenStatusDot

## 1. Contexto
Esta etapa encerra documentalmente o ciclo seguro do helper `pgenStatusDot(inativo)` de Procedimentos Genericos.

O ciclo foi conduzido em sequencia conservadora:
- Subetapa 0: mapeamento monolitico documental
- Subetapa 1: namespace passivo/controlado em `window.BranaProcedimentosGenericosModule`
- correcao monetaria: ajuste minimo em `procFmtMoeda(v)`, preservando numeros ja numericos
- Subetapa 2: fronteiras, contratos e dependencias monetarias
- Subetapa 3-A: extracao conservadora de `pgenStatusDot(inativo)` para `window.BranaProcedimentosGenericosModule.statusDot(inativo)`
- Subetapa 3-B: validacao conservadora do helper `pgenStatusDot/statusDot`

O encerramento desta etapa registra que o helper visual de status ficou estabilizado e que nao e recomendavel avançar automaticamente para `pgenPayloadFromState(state)` sem uma nova subetapa especifica de auditoria.

## 2. Comandos iniciais executados
Saidas registradas:

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
?? docs/procedimentos_genericos_subetapa_3b_validacao_pgenstatusdot.md
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
- `docs/procedimentos_genericos_subetapa_3b_validacao_pgenstatusdot.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/03_mapa_codigo.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/10_continuidade.md`
- `docs/frontend_auditoria_appjs.md`
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md`

Documentos ausentes:
- `docs/etiquetas_subetapa_3a_helper_etqnumero.md`

## 4. Arquivos analisados
- `frontend/app.js`
- `frontend/js/modules/procedimentos-genericos.js`
- `frontend/index.html`

## 5. Arquivos criados/alterados
Arquivos criados nesta etapa:
- `docs/procedimentos_genericos_subetapa_4_encerramento_ciclo_pgenstatusdot.md`

Arquivos alterados nesta etapa:
- nenhum arquivo de codigo foi alterado nesta etapa

Arquivos que ja estavam modificados antes desta etapa e permanecem fora do escopo desta consolidacao:
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/procedimentos-genericos.js`
- os documentos documentais ja existentes no git status

## 6. Estado final do modulo
Confirmado:
- `window.BranaProcedimentosGenericosModule` existe
- `window.BranaProcedimentosGenericosModule.getInfo()` existe
- `window.BranaProcedimentosGenericosModule.getStatus()` existe
- `window.BranaProcedimentosGenericosModule.statusDot(inativo)` existe

Estado observado do namespace:
- `loaded: true`
- `passive: true`
- `functionalDelegation: true`
- `appJsModified: true`
- `canMoveHelpers: false`
- `moveuLogicaFuncional: true`
- `helpersExtraidos: ["pgenStatusDot(inativo)"]`
- `controlsMainFlow: false`
- `controlsDom: false`
- `controlsApi: false`
- `controlsPayload: false`
- `controlsCosts: false`
- `controlsMaterials: false`
- `controlsFinance: false`
- `stage: "Subetapa 3-A"`

## 7. Wrapper/fallback preservado
Confirmado por inspecao:
- `frontend/app.js` mantem `pgenStatusDot(inativo)` como wrapper/fallback
- o wrapper tenta usar `window.BranaProcedimentosGenericosModule.statusDot(inativo)`
- se o namespace nao existir, se o metodo nao for funcao ou se houver erro, o HTML local original e usado
- as chamadas existentes nao foram alteradas

## 8. Resumo das etapas
- Subetapa 0: mapeamento monolitico do bloco de Procedimentos Genericos
- Subetapa 1: namespace passivo/controlado em `frontend/js/modules/procedimentos-genericos.js`
- correcao monetaria: ajuste minimo em `procFmtMoeda(v)` para evitar reinterpretaçao de numeros ja numericos
- Subetapa 2: fronteiras, contratos e dependencias monetarias documentadas
- Subetapa 3-A: extracao de `pgenStatusDot(inativo)` para o namespace passivo como `statusDot(inativo)`
- Subetapa 3-B: validacao conservadora do helper e do wrapper/fallback

## 9. Spot tests registrados
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

Resultado observado para `statusDot(inativo)`:
```text
["<span class=\"pgen-status-dot off\"></span>","<span class=\"pgen-status-dot on\"></span>","<span class=\"pgen-status-dot off\"></span>","<span class=\"pgen-status-dot on\"></span>","<span class=\"pgen-status-dot off\"></span>","<span class=\"pgen-status-dot off\"></span>","<span class=\"pgen-status-dot on\"></span>","<span class=\"pgen-status-dot on\"></span>","<span class=\"pgen-status-dot on\"></span>"]
```

Interpretação:
- o mapeamento visual continua equivalente ao original
- valores truthy/falsy continuam sendo convertidos para os mesmos estados visuais esperados

## 10. Confirmações importantes
Confirmado nesta etapa:
- `pgenPayloadFromState(state)` nao foi alterado
- `pgenDetalheParaEstado(data)` nao foi alterado
- `pgenAbrir()` nao foi alterado
- custos, materiais, financeiro e vinculos nao foram alterados
- `procFmtMoeda`, `procParse` e `toFloat` nao foram alterados nesta etapa
- backend, banco e endpoints nao foram alterados
- nenhum novo helper foi extraido nesta etapa
- nenhum payload foi movido automaticamente

## 11. Riscos remanescentes
Riscos ainda presentes para ciclos futuros:
- payload de Procedimentos Genericos continua sensivel
- custos continuam dependentes de Cenario Financeiro
- materiais continuam dependentes de vinculos e valores monetarios
- `procFmtMoeda` ja teve correcao recente e deve ser preservado
- `pgenPayloadFromState` nao deve ser movido sem nova subetapa especifica de auditoria
- o fluxo principal ainda reside no `app.js`

## 12. Itens que nao devem ser movidos agora
Nao mover nesta sequencia:
- `pgenPayloadFromState(state)`
- `pgenDetalheParaEstado(data)`
- `pgenAbrir()`
- custos e calculos monetarios
- materiais vinculados
- financeiro / cenarios financeiros
- fluxos de salvar, excluir, listar, modal e vinculos

## 13. Checks executados
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
?? docs/procedimentos_genericos_subetapa_4_encerramento_ciclo_pgenstatusdot.md
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
?? frontend/js/modules/procedimentos-genericos.js
```

## 14. Onde testar antes de commitar
1. Fazer `Ctrl+F5`.
2. Abrir `Procedimentos Genenericos`.
3. Confirmar que a lista abre normalmente.
4. Confirmar que os indicadores/status visuais continuam iguais.
5. Selecionar procedimento ativo e inativo, se existir.
6. Abrir alteracao.
7. Conferir a aba Custos.
8. Confirmar que `Custo da hora clinica` continua correto.
9. Confirmar que `Custo de materiais` nao explode.
10. Confirmar que listar, selecionar, novo, alterar e cancelar/fechar continuam iguais.
11. Confirmar console sem `ReferenceError` ou `TypeError`.
12. Conferir:
    - `window.BranaProcedimentosGenericosModule`
    - `window.BranaProcedimentosGenericosModule.getStatus()`
    - `window.BranaProcedimentosGenericosModule.statusDot`

## 15. Recomendacao objetiva para o proximo passo
Recomendacao conservadora:
- nao avancar para `pgenPayloadFromState(state)` sem nova autorizacao e nova subetapa especifica de auditoria
- se houver nova sequencia, ela deve tratar apenas a fronteira de payload, separadamente de custos, materiais e financeiro

## 16. Sugestao de commit
Se os testes manuais passarem, a sugestao de commit para a etapa documental consolidada pode ser:
- `feat(frontend): inicia ciclo seguro de procedimentos genericos`

Ou, de forma mais especifica:
- `feat(frontend): extrai helper seguro de status de procedimentos genericos`

## 17. Confirmacao final
- esta etapa foi somente documental
- nenhum codigo funcional foi alterado nesta etapa
- `frontend/app.js` nao foi alterado nesta etapa
- `frontend/index.html` nao foi alterado nesta etapa
- `frontend/js/modules/procedimentos-genericos.js` nao foi alterado nesta etapa
- backend nao foi alterado
- banco nao foi alterado
- endpoints nao foram alterados
- `pgenPayloadFromState` permanece no `app.js`
- custos, materiais e financeiro nao foram mexidos
- o helper `statusDot` permanece validado
- o wrapper/fallback de `pgenStatusDot` permanece ativo
- nenhum commit foi feito nesta etapa
