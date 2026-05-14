# Subetapa 3-A — Extração conservadora do helper pgenStatusDot

## 1. Contexto
Esta etapa extraiu somente o helper puro `pgenStatusDot(inativo)` para o namespace passivo/controlado de Procedimentos Genéricos, mantendo o wrapper/fallback em `frontend/app.js` e sem mover o fluxo principal do módulo.

Referências usadas:
- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md`
- `docs/etiquetas_subetapa_3b_helper_etqformatnumero.md`
- `docs/etiquetas_subetapa_3c_helper_etqlayoutfromitem.md`
- `docs/auxiliares_subetapa_3_helpers_puros.md`
- `docs/auxiliares_subetapa_4_integracao_helpers_puros.md`
- `docs/plano_contas_subetapa_3_helpers_puros.md`
- `docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`

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
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
?? frontend/js/modules/procedimentos-genericos.js
```

`git diff --stat`
```text
 frontend/app.js     | 6 +++++-
 frontend/index.html | 1 +
 2 files changed, 6 insertions(+), 1 deletion(-)
```

`git log --oneline -10`
```text
18b25aa feat(frontend): encerra ciclo seguro dos helpers de etiquetas
1f7ed77 docs: registra varredura do próximo módulo pós-medicamentos
38bfc8a feat(frontend): encerra ciclo seguro dos helpers de auxiliares
59da421 feat(frontend): encerra ciclo seguro dos helpers de medicamentos
8a1b799 feat(frontend): encerra ciclo seguro dos helpers de cid
39330d3 feat(frontend): encerra ciclo seguro dos helpers de plano de contas
b415b5c Encerra ciclo seguro de helpers de Unidades
ab102c8 Audita helpers modulares de Unidades
91b65e9 Usa helper modular de telefone em Unidades com fallback
45419a5 Usa helper modular de codigo em Unidades com fallback
```

## 3. Documentos consultados
Documentos encontrados e analisados:
- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md`
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md`
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md`
- `docs/procedimentos_genericos_correcao_valores_monetarios_dependencias.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/recomendacao_proximo_modulo_pos_etiquetas.md`
- `docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md`
- `docs/etiquetas_subetapa_3b_helper_etqformatnumero.md`
- `docs/etiquetas_subetapa_3c_helper_etqlayoutfromitem.md`
- `docs/auxiliares_subetapa_3_helpers_puros.md`
- `docs/auxiliares_subetapa_4_integracao_helpers_puros.md`
- `docs/plano_contas_subetapa_3_helpers_puros.md`
- `docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md`
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md`
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md`
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md`

Documentos ausentes:
- `docs/etiquetas_subetapa_3a_helper_etqnumero.md`

## 4. Arquivos analisados
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/procedimentos-genericos.js`

## 5. Arquivos alterados
Arquivos alterados nesta subetapa:
- `frontend/app.js`
- `frontend/js/modules/procedimentos-genericos.js`

Arquivos que não receberam alteração funcional nesta subetapa:
- `frontend/index.html`

## 6. Helper extraído
O helper extraído foi `pgenStatusDot(inativo)`, com implementação equivalente no módulo como `statusDot(inativo)`.

Responsabilidade:
- converter o estado `inativo` em um fragmento HTML de indicador visual de status.

Entrada:
- um valor booleano ou truthy/falsy representando se o item está inativo.

Saída:
- uma string HTML com `<span class="pgen-status-dot on|off"></span>`.

Condições observadas:
- não acessa DOM
- não chama API
- não usa `requestJson`
- não depende de estado global
- não altera estado global
- não mexe em custos, materiais, payload ou financeiro

Uso atual:
- o fluxo funcional continua chamando `pgenStatusDot(inativo)` em `frontend/app.js`
- o wrapper delega para `window.BranaProcedimentosGenericosModule.statusDot(inativo)` quando disponível

## 7. Wrapper/fallback preservado no app.js
`pgenStatusDot(inativo)` continua existindo em `frontend/app.js` como wrapper/fallback.

Comportamento do wrapper:
- tenta chamar `window.BranaProcedimentosGenericosModule.statusDot(inativo)`
- se o namespace não existir, se o método não for função ou se ocorrer erro, cai no HTML local original
- preserva a assinatura
- preserva o retorno visual anterior
- não altera chamadas já existentes

## 8. Chamador preservado
Chamador verificado:
- `pgenSelecionar(id)` / renderização da lista, que usa `pgenStatusDot(item.inativo)`

Confirmado:
- somente `pgenStatusDot` foi integrado nesta subetapa
- `pgenPayloadFromState` não foi alterado
- `pgenDetalheParaEstado` não foi alterado
- `pgenAbrir` não foi alterado

## 9. O que não foi alterado
Confirmado nesta subetapa:
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
- nenhuma nova modularização funcional foi feita

## 10. Riscos observados
Riscos preservados e acompanhados:
- coexistência de bloco legado e bloco atual em Procedimentos Genéricos
- dependência de custos e materiais continua no `app.js`
- o fluxo principal ainda está no `app.js`
- o namespace passivo agora expõe um helper funcional mínimo, mas não controla fluxo
- qualquer alteração posterior em custos ou materiais deve continuar separada desta etapa

## 11. Checks executados
`node --check frontend/app.js`
- OK

`node --check frontend/js/modules/procedimentos-genericos.js`
- OK

Spot test controlado do helper:
- entradas avaliadas: `true`, `false`, `1`, `0`, `"1"`, `"0"`, `null`, `undefined`
- retorno observado para a lógica de status visual: mesmo mapeamento original de `off/on`

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
?? docs/recomendacao_proximo_modulo_pos_etiquetas.md
?? frontend/js/modules/procedimentos-genericos.js
```

## 12. Instruções de teste manual
1. Fazer `Ctrl+F5`.
2. Abrir `Procedimentos Genéricos`.
3. Confirmar que a lista abre normalmente.
4. Confirmar que os indicadores/status visuais continuam iguais.
5. Selecionar um procedimento ativo.
6. Selecionar um procedimento inativo, se existir.
7. Abrir alteração.
8. Confirmar que a aba Custos continua correta.
9. Confirmar que `Custo da hora clínica` segue em `R$ 138,89`, quando aplicável.
10. Confirmar que `Custo de materiais` não explode mais para valores absurdos.
11. Confirmar que listar, selecionar, novo, alterar e cancelar/fechar continuam iguais.
12. Confirmar console sem `ReferenceError` ou `TypeError`.
13. Conferir no console:
    - `window.BranaProcedimentosGenericosModule`
    - `window.BranaProcedimentosGenericosModule.getStatus()`
    - `window.BranaProcedimentosGenericosModule.statusDot`

## 13. Confirmação final
- Apenas `pgenStatusDot(inativo)` foi integrado nesta subetapa.
- `frontend/app.js` manteve wrapper/fallback local.
- `pgenPayloadFromState` não foi alterado.
- `pgenDetalheParaEstado` não foi alterado.
- `pgenAbrir` não foi alterado.
- Custos, materiais e financeiro não foram alterados.
- `procFmtMoeda`, `procParse` e `toFloat` não foram alterados.
- Backend, banco e endpoints não foram alterados.
- Nenhuma nova modularização ampla foi feita.
- Nenhum commit foi feito nesta etapa.
