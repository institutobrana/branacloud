# Implementação - Convênios e Planos renderização de listas

## Contexto

- Contrato profundo inicial concluído.
- Contrato específico `CONVPLAN-ESPEC-A` concluído.
- Microcontrato `CONVPLAN-MICRO-C` concluído.
- O recorte mínimo implementado foi a renderização visual das listas de `Convênios e Planos`.

## Escopo implementado

- `convPlanRenderConvenios` permaneceu como orquestrador em [`frontend/app.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js).
- `convPlanRenderPlanos` permaneceu como orquestrador em [`frontend/app.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js).
- As duas funções passaram a usar helpers passivos do namespace `window.BranaConveniosPlanosModule` quando disponíveis.
- A delegação usada foi para `montarLinhasConvenios` e `montarLinhasPlanos`.
- O fallback local equivalente foi preservado dentro do próprio `frontend/app.js`.
- O comportamento visual foi preservado, incluindo a equivalência das listas.

## Arquivos alterados

- [`frontend/app.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\app.js)
- [`docs/fase_2b_convenios_planos_implementacao_render_listas.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\fase_2b_convenios_planos_implementacao_render_listas.md)
- [`docs/11_roadmap_desenvolvimento.md`](D:\BRANA ARQUIVOS\BRANA CLOUD\docs\11_roadmap_desenvolvimento.md)

## O que não foi alterado

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
- permissões
- backend
- banco
- schema/migrations/seeds/endpoints
- [`frontend/index.html`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html)
- textos/labels fora do escopo
- PostgreSQL 18

## Checks executados

- `node --check frontend/app.js`
- `node --check frontend/js/modules/convenios-planos.js`
- `git diff --stat`

## Onde testar no sistema

- Tela `Convênios e Planos`.
- Lista de convênios.
- Lista de planos.
- Renderização visual.
- Lista vazia, se possível.
- Recarregar sem salvar.
- Seleção apenas como não-regressão visual.
- Calendário/faturamento apenas como não-regressão visual.

## Próxima etapa recomendada

- Validação manual pós-implementação do recorte de renderização de listas.

## Confirmações de escopo

- Código alterado somente nos arquivos permitidos.
- [`frontend/index.html`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\index.html) não foi alterado.
- Backend não foi alterado.
- `.env` não foi alterado.
- Banco/schema/migrations/seeds/endpoints não foram alterados.
- Dados de banco não foram alterados.
- PostgreSQL 18 não foi excluído/desativado.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap

- A renderização visual de listas de `Convênios e Planos` foi implementada com delegação mínima para helpers passivos.
- O fallback local foi preservado e o recorte segue sem tocar em seleção, shell, eventos, `requestJson`, payload, salvamento, exclusão ou calendário/faturamento.
