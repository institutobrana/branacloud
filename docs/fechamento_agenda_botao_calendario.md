# Fechamento — Agenda — Botão Calendário

## 1. Objetivo

Registrar o fechamento da frente da barra horizontal da Agenda relativa ao botão **Calendário**. O fechamento não encerra o módulo Agenda.

## 2. Status

- `AGENDA_CALENDAR_BUTTON`: COMPLETE
- `FUNCTIONAL`: COMPLETE
- `VISUAL`: COMPLETE
- `RUNTIME`: PASS
- `DAILY`: PASS
- `WEEKLY`: PASS
- `LIGHT_MODE`: PASS
- `DARK_MODE`: PASS
- `LOCALE_PT_BR`: PASS
- `MANUAL_HOMOLOGATION`: PASS
- `CONTRACT_FROZEN`: SIM

## 3. Comportamento funcional

O primeiro botão da barra horizontal da Agenda, identificado como “Calendário”, abre um calendário mensal React. O calendário permite navegar entre meses e anos, selecionar uma data e navegar a Agenda para a data selecionada. A implementação é compartilhada pela Agenda Diária e pela Agenda Semanal.

## 4. Regra da data focal

O contrato congelado é `CURRENT_DATE_RULE = FOCAL_DATE, NOT WEEK_START`.

`TODAY` é o dia vigente local; `FOCAL_DATE` é a data focal selecionada na Agenda; `VISIBLE_WEEK_START` é o primeiro dia do intervalo semanal. Esses conceitos não devem ser confundidos.

No caso de regressão documentado, a data local era `2026-09-01`, enquanto o intervalo semanal era `2026-08-31` a `2026-09-05`. Antes da correção, o calendário selecionava `2026-08-31` e mostrava agosto. A causa foi o uso de `datesSet.info.startStr` como data selecionada, confundindo o início do range com a data focal. Após a correção, o calendário seleciona `2026-09-01` e mostra setembro.

O mapeamento legado confirmou que o calendário acompanha a data focal atual, e não automaticamente o primeiro dia da semana. É válido manter `FOCAL_DATE = 2026-09-01` e `VISIBLE_WEEK_START = 2026-08-31`.

## 5. Agenda Diária e Semanal

Na Agenda Diária, selecionar `D` torna `D` a data focal e navega a Agenda para `D`, preservando essa seleção na reabertura.

Na Agenda Semanal, selecionar `D` navega para a semana correspondente, mas mantém `D` como data focal e selecionada no calendário. A semana não é deslocada artificialmente para transformar seu início na seleção.

## 6. Navegação e seleção

Estão concluídos e homologados: mês anterior, mês seguinte, transição de ano, seleção de data e reabertura preservando o estado previsto pelo contrato.

## 7. Localização

O componente usa Ant Design Calendar com `antd/locale/pt_BR`. O contrato textual é português: `Mês`, `Ano`, `Dom`, `Seg`, `Ter`, `Qua`, `Qui`, `Sex`, `Sáb`. Strings `Month` e `Year` não devem reaparecer.

## 8. Data local e timezone

A data focal é formatada como data civil local, sem depender de conversão UTC que possa deslocar o dia. Não reintroduzir uso cego de `toISOString().slice(0, 10)` para determinar o dia local.

## 9. Integração FullCalendar

O componente de navegação fornece a data focal ao Scheduler. A navegação programática permanece delegada à API existente `FullCalendar.gotoDate()`, sem criar um segundo calendário funcional, estado concorrente ou fetch paralelo.

## 10. Arquitetura

- `frontend-react/src/features/agendaSemanal/components/AgendaDateNavigator.jsx`: interface e seleção de data.
- `frontend-react/src/features/agendaSemanal/components/AgendaSemanalToolbar.jsx`: integração do botão da barra.
- `frontend-react/src/features/agendaSemanal/components/AgendaScheduler.jsx`: data focal e navegação do FullCalendar.
- `frontend-react/tests/agendaDateNavigator.test.mjs`: testes do contrato do navegador.

## 11. Visual React

O calendário usa o padrão React/Ant Design do produto, não uma cópia literal do popup legado. A validação registrou Inter 14px, raio 12px, seleção visível, navegação legível e popup aproximadamente 320×321px. A medida é informativa e não um requisito rígido de layout.

O componente permanece integrado aos temas claro e escuro. Não introduzir CSS futuro que quebre o modo escuro.

## 12. Testes, build e runtime

- Testes automatizados: `3/3 PASS`.
- Build: `PASS`, exit code `0`.
- Homologação manual do operador: `PASS`.
- Infra da sessão de homologação: Vite PID `15820`, backend PID `18224`, HTTPS localhost/LAN `200`, backend health `200`.

Os PIDs são evidência da sessão e não contrato permanente de infraestrutura.

## 13. Zero writes

Para esta frente: `POST_PERSISTENT = 0`, `PUT_PERSISTENT = 0`, `PATCH_PERSISTENT = 0`, `DELETE_PERSISTENT = 0` e `SQL_WRITE = 0`. Nenhum dado de negócio foi criado, alterado ou removido para homologar o botão.

## 14. Contrato congelado

`AGENDA_CALENDAR_CONTRACT_FROZEN = SIM`.

Sem nova decisão explícita, as próximas frentes não devem alterar a função do botão, popup mensal, locale pt-BR, navegação de mês/ano, seleção, regra da data focal, separação entre `FOCAL_DATE` e `WEEK_START`, integração diária/semanal, `FullCalendar.gotoDate()`, reabertura/estado ou os temas claro/escuro.

## 15. Fora de escopo

Este fechamento não conclui o módulo Agenda inteiro, não altera outros botões da barra, não modifica o menu contextual, não altera backend, API, escala, repetição, CSS funcional, testes, Vite, certificados ou configuração de ambiente.
