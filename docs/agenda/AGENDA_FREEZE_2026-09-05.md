# Agenda Freeze — 2026-09-05

## 1. Identificação

- Produto: Brana Cloude
- Data: 2026-09-05
- Branch alvo: `modularizacao-segura-fase-1`
- Base HEAD: `a49813c1c6cf6e976ea80842f242e61a1de6473e`
- Worktree: `D:\BRANA ARQUIVOS\__AGENDA_FREEZE_TMP`
- Critério canônico: `AUXILIARY_REPRODUCIBLE_DIFF`
- Snapshot reproduzível: 86 entradas lógicas, todas classificadas como Agenda.

### Contagem lógica e física do snapshot

`LOGICAL_SNAPSHOT_ENTRY_COUNT = 86` representa o universo lógico da
auditoria anterior. Algumas pastas untracked eram exibidas de forma
colapsada no status. A enumeração física pré-commit expandiu essas entradas.

`PHYSICAL_COMMIT_FILE_COUNT = 143` representa os arquivos físicos canônicos
para staging e commit. Os 143 arquivos foram classificados e são arquivos
Agenda autorizados. Não houve ampliação funcional de escopo; houve somente
a expansão física da representação lógica anterior.

### Reconciliação física para versionamento

`LOGICAL_SNAPSHOT_ENTRY_COUNT = 86`

`PHYSICAL_ENUMERATED_FILE_COUNT = 143`

`PHYSICAL_EFFECTIVE_DIFF_FILE_COUNT = 121`

`PHYSICAL_NO_DIFF_FILE_COUNT = 22`

`COMMIT_EFFECTIVE_FILE_COUNT = 121`

Os 86 representam entradas lógicas do snapshot anterior. A enumeração
física expandiu diretórios untracked colapsados para 143 arquivos. Desses,
22 arquivos tracked não possuem diferença contra o `FREEZE_BASE_HEAD` e não
devem ser forçados em um commit. O conjunto efetivamente versionável é,
portanto, 121 arquivos. Isso não reduz o escopo funcional; apenas distingue
o universo físico enumerado do conjunto de diferenças Git reais.

## 2. Estado funcional

| Área | Estado | Evidência/limitação |
|---|---|---|
| Agenda semanal React | IMPLEMENTED / RUNTIME_VALIDATED | rota e integração App.jsx presentes |
| Agenda diária React | IMPLEMENTED / RUNTIME_VALIDATED | rota e integração App.jsx presentes |
| Agenda de contatos | IMPLEMENTED | rota, página e toolbar presentes |
| Configuração de Agenda | IMPLEMENTED | modal, regras e rota presentes |
| Agenda legado, bloqueios e status | IMPLEMENTED | código e testes históricos do snapshot |
| Preview Google | IMPLEMENTED / BLOCKED | somente preview; sem escrita real |
| Google OAuth/token exchange | BLOCKED | bloqueado em validação real do ID token |
| Export Google real | NOT_YET_RELEASED | OAuth não fechado |

Rotas: `/app/atendimento/agenda-semanal`, `/app/atendimento/agenda-diaria`,
`/app/atendimento/agenda-contatos` e `/app/configuracoes/agendas`.

## 3. Contratos

O frontend usa shell/banda operacional Brana, locale pt-BR e integração por
toolbar externa. Regras visuais adicionais somente são consideradas contrato
quando confirmadas no código atual.

O backend inclui agenda legado, display, identidade, preview, serviço Google,
reconciliação, mapping, rotas e integração OAuth. A sincronização projetada é
`RECONCILING_SYNC`, com mapping local, identidade por OIDC `sub`, isolamento por
conta/clinic e política privacy-safe. Cancelamentos conhecidos incluem status
2 e 5; saída de filtro e disconnect não autorizam apagar eventos antigos.

## 4. Google/OAuth

```text
GOOGLE_OAUTH_CONNECTION_STATUS = BLOCKED_AT_ID_TOKEN_VALIDATION
GOOGLE_TOKEN_EXCHANGE = PROVEN_WORKING
GOOGLE_TOKEN_RESPONSE = PROVEN_VALID
GOOGLE_ID_TOKEN_REAL_VALIDATION = BLOCKED
GOOGLE_ACCOUNT_SUB_PERSISTED = NÃO
GOOGLE_CONNECTION_PERSISTED = NÃO
GOOGLE_EXPORT_REAL_ENABLED = NÃO
GOOGLE_CALENDAR_REAL_WRITE_AUTHORIZED = NÃO
```

R27 adicionou categorias granulares para a validação do ID token. A troca real
de token e sua resposta JSON foram comprovadas; a causa granular da falha real
do ID token ainda não foi capturada. Nova tentativa OAuth está suspensa.

## 5. EasyDental, legado e persistência

O snapshot preserva os componentes atuais de agenda legado, identidade,
reconciliação, preview, mapping e migrations/scripts associados. Pacientes
novos do EasyDental devem ser reconciliados antes da sincronização final.
Nenhuma migration foi aplicada durante este freeze.

## 6. Manifesto reproduzível

O manifesto é o conjunto de 86 paths reportado por `git status` no worktree
auxiliar nesta etapa. O conjunto inclui os arquivos de produção, testes,
serviços, componentes e integrações Agenda presentes no snapshot; não inclui
documentação histórica, temporários, screenshots, backups, dumps ou artefatos.

Paths do manifesto reproduzível:

- `ackend/main.py`
- `backend/models/agenda_legado.py`
- `backend/routes/agenda_legado_routes.py`
- `backend/routes/auth_routes.py`
- `backend/services/google_calendar_service.py`
- `backend/tests/test_agenda_legado_bloqueios_crud.py`
- `backend/tests/test_agenda_legado_prestador_system_config.py`
- `backend/tests/test_prestadores_agenda_config_contract.py`
- `frontend-react/src/app/App.jsx`
- `frontend-react/src/features/agendaConfiguracao/AgendaConfiguracaoModal.jsx`
- `frontend-react/src/features/agendaConfiguracao/agendaConfiguracao.css`
- `frontend-react/src/features/agendaConfiguracao/agendaConfiguracaoApi.js`
- `frontend-react/src/features/agendaConfiguracao/agendaConfiguracaoBloqueios.js`
- `frontend-react/src/features/agendaConfiguracao/agendaConfiguracaoColors.js`
- `frontend-react/src/features/agendaConfiguracao/agendaConfiguracaoConstants.js`
- `frontend-react/src/features/agendaConfiguracao/agendaConfiguracaoFonte.js`
- `frontend-react/src/features/agendaConfiguracao/agendaConfiguracaoState.js`
- `frontend-react/src/features/agendaConfiguracao/components/AgendaColorDropdown.jsx`
- `frontend-react/src/features/agendaConfiguracao/components/bloqueios/AgendaBloqueioModal.jsx`
- `frontend-react/src/features/agendaConfiguracao/components/fonte/AgendaFonteModal.jsx`
- `frontend-react/src/features/agendaConfiguracao/components/tabs/AgendaApresentacaoTab.jsx`
- `frontend-react/src/features/agendaConfiguracao/components/tabs/AgendaBloqueiosTab.jsx`
- `frontend-react/src/features/agendaConfiguracao/components/tabs/AgendaEscalaTab.jsx`
- `frontend-react/src/features/agendaConfiguracao/components/tabs/AgendaVisualizacaoTab.jsx`
- `frontend-react/src/features/agendaConfiguracao/hooks/useAgendaConfiguracao.js`
- `frontend-react/src/features/agendaConfiguracao/hooks/useAgendaConfiguracaoDraft.js`
- `frontend-react/src/features/agendaConfiguracao/utils/agendaFontResolver.js`
- `frontend-react/src/features/agendaConfiguracao/utils/agendaHorarioUtils.js`
- `frontend-react/tests/agendaConfiguracaoApi.test.js`
- `frontend-react/tests/agendaConfiguracaoBloqueios.test.js`
- `frontend-react/tests/agendaConfiguracaoContracts.test.js`
- `frontend-react/tests/agendaConfiguracaoDelete.test.js`
- `frontend-react/tests/agendaConfiguracaoEscala.test.js`
- `frontend-react/tests/agendaConfiguracaoFonte.test.js`
- `frontend-react/tests/agendaConfiguracaoPersistence.test.js`
- `backend/models/google_calendar_event_mapping.py`
- `backend/scripts/migrar_agenda_legado_patient_id.py`
- `backend/scripts/migrate_google_calendar_event_mapping.py`
- `backend/services/agenda_display.py`
- `backend/services/agenda_google_preview.py`
- `backend/services/agenda_identity_resolver.py`
- `backend/services/google_calendar_reconciliation_service.py`
- `backend/services/google_oauth_observability.py`
- `backend/tests/test_agenda_identity_resolver.py`
- `backend/tests/test_agenda_legado_display_policy.py`
- `backend/tests/test_agenda_notice_post_contract.py`
- `backend/tests/test_agenda_repeat_dates.py`
- `backend/tests/test_google_calendar_callback_handler.py`
- `backend/tests/test_google_calendar_callback_refresh.py`
- `backend/tests/test_google_calendar_concurrency.py`
- `backend/tests/test_google_calendar_foundation.py`
- `backend/tests/test_google_calendar_h4d5d_contract.py`
- `backend/tests/test_google_calendar_http_matrix.py`
- `backend/tests/test_google_calendar_isolation.py`
- `backend/tests/test_google_calendar_mapping.py`
- `backend/tests/test_google_calendar_preview_h4d2.py`
- `backend/tests/test_google_calendar_r18a_error_paths.py`
- `backend/tests/test_google_calendar_reconciliation.py`
- `backend/tests/test_google_calendar_refresh_real.py`
- `backend/tests/test_google_calendar_status_disconnect.py`
- `backend/tests/test_google_calendar_status_tenant_real.py`
- `backend/tests/test_google_calendar_token_error_observability.py`
- `backend/tests/test_google_oauth_attempt_correlation.py`
- `frontend-react/src/features/agendaContatos/`
- `frontend-react/src/features/agendaDiaria/`
- `frontend-react/src/features/agendaSemanal/`
- `frontend-react/tests/agendaApiRange.test.mjs`
- `frontend-react/tests/agendaContextMenu.test.mjs`
- `frontend-react/tests/agendaDateNavigator.test.mjs`
- `frontend-react/tests/agendaDiariaPage.test.mjs`
- `frontend-react/tests/agendaEventContent.test.mjs`
- `frontend-react/tests/agendaEventModal.test.mjs`
- `frontend-react/tests/agendaEventPayload.test.mjs`
- `frontend-react/tests/agendaEventPresentation.test.mjs`
- `frontend-react/tests/agendaFilters.test.mjs`
- `frontend-react/tests/agendaFreeSlots.test.mjs`
- `frontend-react/tests/agendaInteraction.test.mjs`
- `frontend-react/tests/agendaNotice.test.mjs`
- `frontend-react/tests/agendaPatientSearch.test.mjs`
- `frontend-react/tests/agendaRepeatApi.test.mjs`
- `frontend-react/tests/agendaRepeatConfig.test.mjs`
- `frontend-react/tests/agendaSchedulerScale.test.mjs`
- `frontend-react/tests/agendaSemanalReal.test.mjs`
- `frontend-react/tests/agendaTemporalNavigation.test.mjs`
- `frontend-react/tests/agendaViewScheduleCount.test.mjs`
- `frontend-react/tests/agendaWeeklyDate.test.mjs`

Arquivos compartilhados têm disposição explícita:

- `backend/main.py` — `PARTIAL_SHARED_AGENDA_ONLY`
- `backend/routes/auth_routes.py` — `PARTIAL_SHARED_AGENDA_ONLY`
- `frontend-react/src/app/App.jsx` — `RECONSTRUCTED_SHARED_AGENDA_ONLY`

Alterações não-Agenda desses arquivos não fazem parte do snapshot.

## 7. Testes, build e runtime

- Evidência histórica: H4D5F-R23 = 108/108; testes realistas R27 = PASS.
- Testes não foram executados novamente nesta etapa: `CURRENT_FREEZE_PYTEST_EXECUTED = NÃO`.
- Pytest: `NOT_AVAILABLE_WITH_PROVEN_REASON`.
- Frontend build: `NOT_RUN_WITH_PROVEN_REASON`; dependências não foram instaladas/copied.
- Backend: PID 47084, porta 8000, health 200, listener único.
- Frontend: PID 14424, porta 5173, HTTPS local/LAN 200, listener único.

## 8. Limitação histórica da auditoria de candidatos

```text
HISTORICAL_CANDIDATE_COUNT = 118
HISTORICAL_CANDIDATE_LIST_AVAILABLE = NÃO
HISTORICAL_CANDIDATE_LIST_RECOVERY_ATTEMPTED = SIM
HISTORICAL_CANDIDATE_LIST_RECOVERY_RESULT = NOT_FOUND
HISTORICAL_CANDIDATE_RECONCILIATION = NOT_REPRODUCIBLE
HISTORICAL_118_USED_AS_CURRENT_GATE = NÃO
```

A contagem 118 é apenas evidência contextual. A lista original de paths não
foi preservada de modo recuperável e não foi reconstruída por inferência. O
gate atual é exclusivamente o diff reproduzível de 86 paths.

Use o manifesto e o conjunto de arquivos do commit deste freeze como o
snapshot canônico reproduzível da Agenda; a contagem histórica de 118 é
somente contexto e não deve ser apresentada como lista reconstruída.

## 9. Pendências suspensas

1. Executar futuramente uma única tentativa OAuth real controlada para capturar
   a categoria granular R27 do erro de ID token.
2. Decidir a correção OAuth somente após essa evidência.
3. Manter export e escrita Google não autorizados até o OAuth ser fechado.
4. Validar mudanças futuras a partir do manifesto/commit canônico.

## 10. Ações não autorizadas neste freeze

OAuth real, escrita no Google Calendar, migration operacional, export, deploy,
AWS, alteração do runtime e alterações do worktree principal não foram
executados.
