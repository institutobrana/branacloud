# Microcontrato - Convênios e Planos shell visual

## Objetivo

- Registrar o microcontrato documental para avaliar o recorte de shell visual / abrir-fechar da frente `Convênios e Planos`.
- A etapa não implementa nada e não altera código ou banco.
- O foco é separar organização visual local de fluxos funcionais acoplados à abertura do painel.

## Contexto

- A seleção visual foi considerada acoplada demais no microcontrato anterior.
- A frente `Convênios e Planos` segue parcialmente validada apenas para renderização visual das listas.
- A decisão anterior foi `CONVPLAN-SEL-D`.
- O próximo candidato conservador passa a ser shell visual / abrir-fechar.

## Estado consolidado

- Lista de convênios validada.
- Lista de planos validada.
- Renderização visual validada.
- `convPlanRenderConvenios` e `convPlanRenderPlanos` permanecem como orquestradores.
- Fallback local preservado.
- Áreas sensíveis permanecem preservadas fora de qualquer avanço automático.

## Mapeamento técnico

- `convPlanAbrir` é o ponto central de abertura da frente.
- `convPlanEnsureUI` garante a existência dos containers, injeta estilos e monta o shell do painel.
- `convPlanVincularEventos` conecta os eventos da interface visual.
- Há funções auxiliares de organização visual embutidas no próprio `frontend/app.js`, mas sem helpers passivos específicos de shell no módulo [`frontend/js/modules/convenios-planos.js`](D:\BRANA ARQUIVOS\BRANA CLOUD\frontend\js\modules\convenios-planos.js).
- `convPlanAbrir` hoje executa: garantia de UI, vinculação de eventos, ocultação dos outros painéis, mostra do painel de Convênios e Planos, carregamento de dados e atualização de mensagem de rodapé.
- `convPlanEnsureUI` hoje monta o DOM do painel, botões e tabelas de convênios/planos.
- `convPlanVincularEventos` hoje vincula seleção, botões de novo/editar/excluir, calendário e fechamento.

## Análise de acoplamento

- O shell visual puro está parcialmente misturado com carregamento de dados e wiring.
- `convPlanAbrir` não é apenas abrir/fechar visual: ele também chama `convPlanCarregar`.
- `convPlanEnsureUI` é a parte mais próxima de um helper visual passivo, porque garante containers e estrutura DOM.
- `convPlanVincularEventos` já encosta em seleção funcional, calendário e botões de ação, então não é um bom alvo de recorte visual isolado.
- Não há helper passivo já existente para shell visual no módulo passivo.
- Um helper passivo futuro poderia ser extraído apenas para montagem/garantia de containers, preservando fallback no `app.js`.

## Tabela de riscos

| Micro-recorte | Funções | Risco | Benefício | Decisão |
| --- | --- | --- | --- | --- |
| MICRO-SHELL-1 | Documentar e preparar extração futura de helper visual passivo | Baixo | Mantém a frente sem mudar comportamento | Avaliado |
| MICRO-SHELL-2 | Permitir futura implementação mínima de helper passivo para partes visuais do shell | Baixo-médio | Pode reduzir o `app.js` sem tocar em fluxo funcional | **Preferido** |
| MICRO-SHELL-3 | Permitir abertura/fechamento visual mínima se não houver acoplamento com carregamento/eventos | Médio | Avança a UX do painel, mas pode encostar em `convPlanCarregar` | Avaliado com cautela |
| MICRO-SHELL-4 | Não avançar em shell visual; abrir microcontrato de filtros locais | Baixo | Evita o acoplamento observado em `convPlanAbrir` | Rejeitado por ora |
| MICRO-SHELL-5 | Não avançar mais em Convênios e Planos; voltar para matriz comparativa | Baixo | Máxima conservação, mas interrompe a frente | Rejeitado por ora |

## Shell visual permitido

- Abertura/fechamento visual.
- Garantia de existência de containers.
- Organização visual local.
- Apoio visual sem mutação funcional.
- Helpers puros ou passivos, se existirem.
- Fallback no `app.js`.

## Shell funcional proibido

- Carregamento de dados.
- `requestJson`.
- Payload.
- Salvamento.
- Exclusão.
- Edição.
- Seleção funcional.
- `convPlanSelecionarConvenio`.
- `convPlanSelecionarPlano`.
- Calendário/faturamento.
- Permissões.
- Backend.
- Banco.

## Decisão

- A decisão registrada foi `CONVPLAN-SHELL-A`.
- A futura implementação deve limitar-se a helper visual passivo de shell/containers, sem alterar eventos nem carregamento.
- Isso mantém o recorte seguro e evita tocar em fluxos funcionais da frente.

## Recorte futuro permitido

- Extração de helper visual passivo para montagem/garantia de containers.
- Preservação do fallback local em `frontend/app.js`.
- Separação apenas do que for estrutural/visual.

## Fronteira proibida

- `convPlanAbrir`
- `convPlanVincularEventos`
- `convPlanCarregar`
- `convPlanSelecionarConvenio`
- `convPlanSelecionarPlano`
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
- Abertura/fechamento do painel.
- Garantia dos containers visuais.
- Organização visual local.
- Recarregar sem salvar.
- Renderização das listas como não-regressão.
- Seleção apenas como não-regressão visual, se não houver novo contrato específico.
- Calendário/faturamento apenas como não-regressão visual.

## Commit seletivo obrigatório

- Se a etapa for confirmada como somente documental/contrato, o commit deve incluir apenas este documento e o roadmap.

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

- O shell visual de `Convênios e Planos` foi aberto como microcontrato documental.
- O caminho conservador escolhido foi `CONVPLAN-SHELL-A`.
- A próxima implementação futura, se houver, deve limitar-se a helper visual passivo para containers, preservando fallback no `app.js`.
