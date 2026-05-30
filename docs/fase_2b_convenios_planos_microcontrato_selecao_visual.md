# Microcontrato - Convênios e Planos seleção visual

## Contexto

- A renderização visual das listas de Convênios e Planos já foi validada manualmente.
- A frente segue em risco médio controlado.
- Esta etapa existe apenas para avaliar se a próxima fatia segura seria a seleção visual.
- Nenhum código foi alterado nesta etapa.

## Estado consolidado

- Lista de convênios validada.
- Lista de planos validada.
- Renderização visual validada.
- `convPlanRenderConvenios` e `convPlanRenderPlanos` permanecem como orquestradores.
- Fallback local preservado.
- Área sensível preservada.

## Mapeamento técnico

- `convPlanSelecionarConvenio(tr)` altera `convPlanSelConvenioId`, zera `convPlanSelPlanoId` e chama as duas rotinas de renderização.
- `convPlanSelecionarPlano(tr)` altera `convPlanSelPlanoId` e chama a renderização de planos.
- O destaque visual da linha selecionada é aplicado pelas próprias rotinas de renderização, com classe `selected` baseada no estado global.
- A seleção de convênio também impacta a lista de planos, porque limpa a seleção de plano e refiltra a segunda lista.
- Não há helper passivo de seleção no módulo [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js).
- Não há chamada de `requestJson`, payload, salvamento, exclusão ou calendário/faturamento no caminho atual de seleção.

## Separação seleção visual x seleção funcional

- Seleção visual: destacar linha, remover destaque anterior e manter a classe visual.
- Seleção funcional: alterar estado selecionado global, refiltrar planos, sincronizar linha do detalhe e acionar fluxos dependentes.
- No código atual, a seleção visual está acoplada à seleção funcional porque o estado selecionado é o mesmo que governa o destaque e a filtragem.
- Portanto, a seleção visual não está separada de forma limpa o bastante para um recorte isolado seguro nesta etapa.

## Micro-recortes comparados

| Micro-recorte | Funções | Risco | Benefício | Decisão |
| --- | --- | --- | --- | --- |
| MICRO-SEL-1 | Seleção visual de convênio | Médio | Isola o destaque da linha de convênio | Avaliado |
| MICRO-SEL-2 | Seleção visual de plano | Médio | Isola o destaque da linha de plano | Avaliado |
| MICRO-SEL-3 | Seleção visual de convênios e planos juntas | Médio | Mantém simetria visual | Avaliado |
| MICRO-SEL-4 | Shell visual / abrir-fechar | Baixo-médio | Continua a frente sem mexer em seleção acoplada | **Preferido** |
| MICRO-SEL-5 | Não avançar e voltar à matriz comparativa | Baixo | Evita aprofundar em seleção acoplada | Rejeitado por ora |

## Decisão

- A decisão registrada foi `CONVPLAN-SEL-D`.
- A seleção está acoplada demais para um recorte visual isolado neste momento.
- O próximo candidato recomendado é shell visual ou filtros locais com novo contrato.

## Recorte futuro permitido

- Shell visual / abrir-fechar.
- Filtros locais, se vierem como contrato independente.
- Apenas suporte visual local, sem mutação funcional.

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
- permissões
- backend
- banco
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

- Tela Convênios e Planos.
- Lista de convênios.
- Lista de planos.
- Seleção visual, apenas se for retomada em contrato futuro.
- Troca de seleção.
- Recarregar sem salvar.
- Renderização das listas como não-regressão.
- Calendário/faturamento apenas como não-regressão visual.

## Confirmações de escopo

- Nenhum código alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` não alterado.
- `frontend/index.html` não alterado.
- `frontend/js/modules` não alterado.
- Backend não alterado.
- `.env` não alterado.
- Banco/schema/migrations/seeds/endpoints não alterados.
- PostgreSQL 18 não excluído/desativado.
- Backups preservados.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap

- A seleção visual de Convênios e Planos foi avaliada como acoplada demais para um recorte isolado seguro.
- O próximo passo conservador é shell visual ou filtros locais, se houver novo contrato.
