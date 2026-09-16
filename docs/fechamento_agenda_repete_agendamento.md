# Fechamento — Repete agendamento

## 1. Escopo e status

Frente: Agenda → Repete agendamento.

Status: concluída e homologada manualmente pelo operador. A implementação funcional real permanece no frontend React e no backend legado. O laboratório temporário C2/R12/R12E foi removido e não integra a arquitetura final.

## 2. Arquitetura funcional

O fluxo real é:

`AgendaEventModal.jsx` → `RepeatTab` → `agendaRepeatConfig.js` → `repeatAgendaEvent` → `POST /agenda-legado/repetir` → `repetir_agendamento`.

Arquivos funcionais relevantes:

- `frontend-react/src/features/agendaSemanal/components/AgendaEventModal.jsx`
- `frontend-react/src/features/agendaSemanal/utils/agendaRepeatConfig.js`
- `frontend-react/src/features/agendaSemanal/api/agendaSemanalApi.js`
- `backend/routes/agenda_legado_routes.py`

## 3. Contrato frontend

A repetição é ativada pela opção visual `Repete horário`. O estado usa `mode` com os valores `dias`, `semanas` ou `meses`, além de `overwrite`.

O payload sempre contém `item_id`, `modo` e `sobrepor`. Dependendo do modo, contém também:

- diário: `qtd_dias`, de 1 a 60;
- semanal: `qtd_semanas`, de 1 a 60, e `dia_semana` de 1 a 6;
- mensal: `dia_mes` de 1 a 31 e `qtd_meses`, de 1 a 60.

Campos de outros modos não são enviados.

## 4. Contrato backend

O schema real é `AgendaRepeticaoPayload`, em `backend/routes/agenda_legado_routes.py`. A rota é autenticada e o evento-base é carregado dentro da clínica do usuário.

A rota `POST /agenda-legado/repetir` herda do evento-base a data de referência, horário, prestador, unidade e os demais campos clonados. A data-base não é movida.

O retorno estruturado contém `datas_avaliadas`, `criados`, `removidos`, `ajustados`, `segmentos`, `conflitos`, `datas_conflito` e `datas_aplicadas`.

## 5. Regras de repetição

### Diário

São gerados os próximos dias conforme `qtd_dias`; o evento-base não conta. Uma ocorrência gerada em domingo é normalizada para a segunda-feira seguinte.

### Semanal

São geradas as próximas semanas conforme `qtd_semanas`, usando `dia_semana` de segunda-feira a sábado. O evento-base não conta.

### Mensal

São gerados os próximos meses conforme `qtd_meses` e `dia_mes`. Datas inexistentes usam o último dia disponível do mês. Uma ocorrência gerada em domingo é normalizada para a segunda-feira seguinte.

Essa normalização não proíbe agendamento manual no domingo; ela se aplica às ocorrências geradas pela repetição.

## 6. Conflitos e sobreposição

O conflito considera a mesma clínica, prestador, unidade e data, com sobreposição estrita de intervalo:

`existing.start < new.end` e `existing.end > new.start`.

Intervalos que apenas encostam não são conflito.

Com `sobrepor = false`, a ocorrência conflitante não é criada e é registrada no resumo.

Com `sobrepor = true`, a implementação trata os casos de intervalo coberto por remoção, cobertura parcial por ajuste do início ou fim e intervalo interno por ajuste mais criação do segmento direito. Esses efeitos são contabilizados como `removidos`, `ajustados` e `segmentos`.

## 7. Persistência e falhas

No fluxo de novo agendamento, a base é salva primeiro; o ID retornado é usado na repetição. No fluxo de edição, a base existente é salva e seu ID é usado.

Falha ao salvar a base impede a repetição. Falha na repetição é propagada e não há retry automático no cliente.

Não existe vínculo permanente de série documentado entre as ocorrências. Edição e exclusão continuam sendo operações individuais do fluxo normal.

## 8. Homologação manual

Resultados informados pelo operador:

- diário: PASS;
- semanal: PASS;
- mensal: PASS;
- sobreposição: PASS;
- ocorrência gerada em domingo deslocada para segunda-feira: PASS;
- erros funcionais encontrados: NÃO.

Essa validação foi manual. Ela não deve ser confundida com execução automatizada do laboratório C2.

## 9. Testes automatizados e build

Testes permanentes registrados:

- `frontend-react/tests/agendaRepeatConfig.test.mjs`;
- `frontend-react/tests/agendaRepeatApi.test.mjs`;
- `frontend-react/tests/agendaEventModal.test.mjs`.

Resultado comprovado na F2: 15 PASS, 0 FAIL. Build comprovado na F2: PASS.

## 10. Laboratório temporário

O laboratório C2/R12/R12E foi criado exclusivamente para investigação e validação controlada. Seus harnesses, orchestrator, executor, teste específico, rota DEV, import e diretório foram removidos. Não há artefatos executáveis residuais nem participação na arquitetura funcional final.

## 11. Restrições conhecidas

Este documento registra o contrato comprovado no código atual e a homologação informada pelo operador. Não substitui testes de integração futuros nem altera o contrato do backend.

## 12. Critérios de encerramento

A frente é considerada encerrada porque:

- os três modos funcionais estão implementados;
- sobreposição e conflito estão representados no backend;
- o fluxo de persistência está coberto pelos testes permanentes;
- a homologação manual foi concluída sem erro reportado;
- o laboratório temporário foi completamente removido;
- o código funcional e os testes permanentes foram preservados.

Status final: CONCLUÍDA, pronta para auditoria de fechamento Git posterior.
