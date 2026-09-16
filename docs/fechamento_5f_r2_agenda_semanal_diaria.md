# Fechamento 5F.R2 — Agenda Semanal e Diária

Status: **CONCLUÍDO** (28/08/2026)

## Contrato homologado

- Semanal: `/app/atendimento/agenda-semanal`, `timeGridWeek`, `semana_horarios`.
- Diária: `/app/atendimento/agenda-diaria`, `timeGridDay`, `dia_horarios`.
- Scheduler: `AgendaScheduler`, compartilhado.
- Renderer: `AgendaEventContent`, compartilhado.
- API: `GET /api/agenda-legado`.
- FullCalendar fornece `end` exclusivo; o backend interpreta `end` inclusivo.
- Conversão: `API end = calendarEndExclusive - 1 dia`.

Exemplos homologados:

```text
Diária: 28/08 → 29/08 exclusivo  => API 28/08 → 28/08 inclusivo
Semanal: 24/08 → 30/08 exclusivo => API 24/08 → 29/08 inclusivo
```

## Homologação

Na Diária, em 28/08/2026, com Gleisson Tel, Especialidade Todas e Unidade Todas:

- fonte: 3 eventos;
- legado: 3 eventos;
- React: 3 eventos;
- eventos: 08:00 sem paciente, 14:00 Ester Mirley da Silva Arruda e 16:00 Jessica Maria da Conceição dos Santos.

Semanal e Diária renderizaram régua, grade e cards sem overlap ou clipping observado. A R2B da régua semanal permanece aprovada.

Os cards homologados preservam a escala temporal: H12 5 minutos = 42px; H8 5 minutos = 63px. A folga inferior do card curto permanece perceptível e o telefone permanece integralmente visível.

Validações registradas: `44 PASS / 0 FAIL`, build `PASS`, runtime semanal `PASS` e runtime diário `PASS`.

## Episódio transitório de zero cards

Houve um cenário transitório em que a grade montava sem cards. A causa histórica exata não foi comprovada e o cenário não se reproduziu nas homologações controladas posteriores. Não foi aplicada correção baseada exclusivamente nesse episódio.

## Proteção contra placeholder

`frontend-react/tests/agendaDiariaPage.test.mjs` é um teste estrutural/contratual, não um teste de DOM. Ele protege a ligação `AgendaDiariaPage → AgendaScheduler → initialMode="dia" → events={agenda.events}` e falha se a página voltar a um placeholder sem scheduler.

## Inventário da frente

Arquivos candidatos ao futuro commit seletivo 5F.R2:

- `frontend-react/src/features/agendaDiaria/AgendaDiariaPage.jsx`
- `frontend-react/src/features/agendaSemanal/components/AgendaScheduler.jsx`
- `frontend-react/src/features/agendaSemanal/hooks/useAgendaSemanalReal.js`
- `frontend-react/src/features/agendaSemanal/utils/agendaApiRange.js`
- `frontend-react/src/features/agendaSemanal/components/agendaScheduler.css`
- `frontend-react/tests/agendaApiRange.test.mjs`
- `frontend-react/tests/agendaDiariaPage.test.mjs`

No estado atual, esses arquivos aparecem como untracked e devem ser revisados individualmente antes de qualquer staging. A classificação funcional é:

| Arquivo | Classe | Observação |
|---|---|---|
| `AgendaDiariaPage.jsx` | A | implementação da Diária |
| `AgendaScheduler.jsx` | B | contém contrato compartilhado da agenda |
| `useAgendaSemanalReal.js` | B | contém cálculo compartilhado de intervalo |
| `agendaApiRange.js` | A | regra pura do intervalo |
| `agendaScheduler.css` | B | contém R2B e alterações visuais anteriores |
| `agendaApiRange.test.mjs` | A | testes diário/semanal |
| `agendaDiariaPage.test.mjs` | A | proteção estrutural contra placeholder |

Arquivos do worktree fora do commit 5F.R2 incluem as demais alterações modificadas, deletadas ou untracked listadas por `git status`, especialmente backend, assets, documentação de outras frentes, configuração, autenticação e módulos não relacionados à Agenda.

## Pendências fora da frente

- origem vertical histórica de 83px;
- smoke histórico da Agenda Clínica;
- fragilidade potencial do seletor R2B com `.fc-Qo`.

Esses itens não alteram o fechamento funcional da 5F.R2 e permanecem congelados para avaliação futura.

## Estado de congelamento

Nesta fase não houve alteração funcional, commit, push ou deploy. A frente 5F.R2 está encerrada; qualquer nova mudança deve iniciar uma frente separada.
