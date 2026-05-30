# Decisao - Convênios e Planos shell visual de containers

## Objetivo da decisao

- Registrar a decisao pos-validacao da implementacao shell visual/containers de `Convênios e Planos`.
- Encerrar a etapa documental definindo o proximo caminho conservador da Fase 2B.

## Contexto da implementacao validada

- A implementacao minima do helper visual/passivo de containers foi concluida em `frontend/js/modules/convenios-planos.js`.
- `frontend/app.js` passou a consumir o helper de forma defensiva com fallback local equivalente.
- A validacao manual foi aprovada pelo usuario.

## Commit da implementacao validada

- `56c188b872ac96156ff267499f1f09d9583dc663`

## Commit da validacao manual

- `c2296fab949563065dca8ffadb7c9396c52a50f3`

## Relato do usuario

> PASSOU ESTA OK

## Estado consolidado da frente Convênios e Planos

- A renderizacao visual das listas ja havia sido validada antes.
- A implementacao do shell visual/containers tambem foi validada manualmente.
- A frente segue parcialmente validada, mas ainda possui areas sensiveis fora do recorte.

## O que ja foi validado

- Renderizacao visual das listas.
- Shell visual/containers basico.
- Fallback local preservado em `frontend/app.js`.
- Estabilidade visual percebida na abertura do painel.

## O que continua fora do recorte

- `convPlanSelecionarConvenio`.
- `convPlanSelecionarPlano`.
- `convPlanCarregar`.
- `convPlanVincularEventos`.
- `convPlanCal*`.
- `requestJson`.
- payload.
- salvamento.
- exclusao.
- permissões.
- backend.
- banco.
- `frontend/index.html`.

## Riscos remanescentes

- O shell ainda esta misturado com carregamento e wiring.
- Qualquer novo passo pode encostar em fluxos funcionais ou calendarios.
- A selecao visual ja foi considerada acoplada demais e nao deve ser reaberta sem novo contrato.

## Avaliacao dos proximos candidatos

- CANDIDATO 1: filtros locais somente visuais. Nao ha trecho seguro claramente isolado sem reabrir areas acopladas.
- CANDIDATO 2: novo helper passivo adicional. Nao ha necessidade clara nem fronteira isolada mais segura do que a ja implementada.
- CANDIDATO 3: pausar Convênios e Planos e voltar para matriz comparativa. Alternativa mais conservadora.
- CANDIDATO 4: abrir contrato profundo para outra frente de menor risco relativo. Pode ser avaliado em nova rodada.
- CANDIDATO 5: nao avancar ate revisao geral documental da Fase 2B. Alternativa mais prudente se a equipe quiser reordenar a trilha.

## Decisao final

- `CONVPLAN-SHELL-DEC-C`
- Convênios e Planos deve ser pausado por ora.
- A proxima etapa deve ser a matriz comparativa da Fase 2B.

## Proxima etapa recomendada

- Voltar para a matriz comparativa da Fase 2B antes de abrir qualquer novo recorte nesta frente.
- Nao iniciar novo contrato de Convênios e Planos automaticamente.

## Commit seletivo obrigatorio

- Se esta etapa for tratada como somente documental, o commit deve incluir apenas este documento e o roadmap.

## Registro para roadmap

- A decisao pos-validacao do shell visual/containers de `Convênios e Planos` foi registrada.
- A validacao manual foi aprovada pelo usuario.
- A decisao final foi `CONVPLAN-SHELL-DEC-C`.
- Nenhum codigo ou banco foi alterado nesta etapa documental.
- A proxima etapa recomendada e voltar para a matriz comparativa da Fase 2B.
