# Microcontrato - Convênios e Planos renderização de listas

## Contexto

- Esta etapa registra apenas a delimitação documental do microcontrato mais seguro para `Convênios e Planos`.
- O contrato profundo anterior já havia mapeado o bloco funcional principal em [`frontend/app.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js) e o módulo passivo [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js).
- O contrato específico anterior já havia reduzido o escopo ao menor núcleo seguro de listas.
- O objetivo agora foi definir se a implementação futura mínima deve tocar somente uma lista ou as duas listas juntas.
- Nenhum código foi alterado e nenhum dado de banco foi modificado nesta etapa.

## Mapeamento técnico

- O bloco principal permanece em [`frontend/app.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js), com funções de lista, seleção, shell, carregamento, wiring e calendário/faturamento.
- O módulo passivo continua em [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js), com helpers puros de normalização, validação e montagem de linhas.
- `convPlanRenderConvenios` e `convPlanRenderPlanos` já estão simétricas na camada de renderização visual.
- A fronteira sensível continua concentrada em `requestJson`, payload, salvamento, exclusão, calendário/faturamento, permissões, backend e banco.

## Micro-recortes comparados

| Micro-recorte | Funções | Risco | Benefício | Decisão |
| --- | --- | --- | --- | --- |
| MICRO 1 | `convPlanRenderConvenios` | Baixo | Menor diff possível, foco apenas na lista de convênios | Avaliado |
| MICRO 2 | `convPlanRenderPlanos` | Baixo | Menor diff possível, foco apenas na lista de planos | Avaliado |
| MICRO 3 | `convPlanRenderConvenios` e `convPlanRenderPlanos` juntos | Baixo | Mantém simetria e reaproveita helpers passivos equivalentes | **Escolhido** |
| MICRO 4 | Não implementar ainda | Alto | Evita qualquer avanço enquanto houver acoplamento sensível | Rejeitado |

## Decisão

- A decisão registrada foi `CONVPLAN-MICRO-C`.
- A implementação futura mínima pode tocar as duas listas juntas, desde que o diff continue mínimo e simétrico.
- A fronteira permitida ficou restrita à renderização visual de `convPlanRenderConvenios` e `convPlanRenderPlanos`.
- Seleção, shell, wiring, `requestJson`, payload, salvamento, exclusão e calendário/faturamento foram mantidos fora do recorte imediato.

## Recorte futuro permitido

- `convPlanRenderConvenios`
- `convPlanRenderPlanos`
- Helpers passivos `montarLinhasConvenios` e `montarLinhasPlanos`
- Apenas suporte visual local, sem mutação funcional

## Fronteira proibida

- `convPlanSelecionarConvenio`
- `convPlanSelecionarPlano`
- `convPlanEnsureUI`
- `convPlanVincularEventos`
- `convPlanCarregar`
- `convPlanCal*`
- `requestJson`
- payload
- salvamento
- exclusão
- calendário/faturamento
- backend
- banco
- permissões
- [`frontend/index.html`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html)

## Arquivos futuros permitidos/proibidos

- Permitidos:
  - [`frontend/app.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js)
  - [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js)
  - [`docs/11_roadmap_desenvolvimento.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\11_roadmap_desenvolvimento.md)
  - documento de implementação futura
- Proibidos:
  - [`frontend/index.html`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html)
  - backend
  - banco/schema/migrations/seeds/endpoints
  - `.env`
  - scripts de migração
  - dumps/backups

## Onde testar futuramente

- Tela de `Convênios e Planos`.
- Lista de convênios.
- Lista de planos.
- Renderização visual.
- Lista vazia.
- Recarregar sem salvar.
- Seleção apenas como não-regressão visual, sem mudança funcional.
- Calendário/faturamento apenas como não-regressão visual.

## Confirmações de escopo

- Nenhum código foi alterado.
- Nenhum dado de banco foi alterado.
- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- Backend não foi alterado.
- `.env` não foi alterado.
- Banco/schema/migrations/seeds/endpoints não foram alterados.
- PostgreSQL 18 não foi excluído/desativado.
- Backups preservados.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap

- `Convênios e Planos` ficou consolidado documentalmente no recorte mais mínimo possível.
- O avanço futuro deve começar pelas duas renderizações visuais juntas, sem abrir seleção, shell ou fluxos sensíveis.
