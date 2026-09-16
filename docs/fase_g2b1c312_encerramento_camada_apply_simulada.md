# Fase G.2B.1C.3.1.2 - Encerramento da camada apply simulada

Data: 2026-08-04

## 1. Resultado
- APROVADA;
- nenhuma persistencia real foi executada;
- `brana_saas` permaneceu intocado;
- a camada apply simulada ficou coberta por testes criticos e encerrada formalmente.

## 2. Matriz completa de cobertura
| Requisito | Implementado | Testado | Teste |
|---|---:|---:|---|
| autorização runtime | sim | sim | `test_backup_and_runtime_flags_are_required` |
| ambiente isolated | sim | sim | `test_authorization_gate_requires_isolated_allowed_database_and_checksum` |
| brana_saas bloqueado | sim | sim | `test_execute_apply_transaction_blocks_branasaas` |
| checksum permitido | sim | sim | `test_authorization_gate_requires_isolated_allowed_database_and_checksum` |
| backup validado | sim | sim | `test_backup_and_runtime_flags_are_required` |
| EMPTY | sim | sim | `test_empty_state_updates_every_record_in_deterministic_order` |
| COMPLETE_MATCH | sim | sim | `test_complete_match_yields_no_sql_and_no_updates` |
| PARTIAL | sim | sim | `test_partial_and_divergent_states_are_rejected_before_write` |
| DIVERGENT | sim | sim | `test_partial_and_divergent_states_are_rejected_before_write` |
| conflito | sim | sim | `test_partial_and_divergent_states_are_rejected_before_write` |
| missing | sim | sim | `test_partial_and_divergent_states_are_rejected_before_write` |
| assinatura divergente | sim | sim | `test_partial_and_divergent_states_are_rejected_before_write` |
| lock | sim | sim | `test_execute_apply_transaction_commits_in_simulated_session` e falhas simuladas em `FakeSession` |
| SQL parametrizado | sim | sim | `test_sql_is_parametrized_and_never_updates_other_columns` |
| rowcount | sim | sim | `test_execute_apply_transaction_rolls_back_on_rowcount_error` e `test_execute_apply_transaction_rolls_back_on_late_rowcount_error` |
| commit | sim | sim | `test_execute_apply_transaction_commits_in_simulated_session` |
| rollback | sim | sim | `test_execute_apply_transaction_rolls_back_on_rowcount_error`, `test_execute_apply_transaction_rolls_back_on_late_rowcount_error`, `test_execute_apply_transaction_rolls_back_on_post_validation_error` |
| pós-validação | sim | sim | `test_execute_apply_transaction_rolls_back_on_post_validation_error` |
| relatórios | sim | sim | `test_write_apply_report_creates_paths` |
| proteção de campos | sim | sim | `test_sql_is_parametrized_and_never_updates_other_columns` |

## 3. Testes individuais da camada apply
- comando: `python -m unittest backend.tests.test_simbolos_graficos_origem_apply`
- resultado: `13/13` aprovados

## 4. Testes individuais do backfill read-only
- comando: `python -m unittest backend.tests.test_backfill_origem_simbolos_graficos`
- resultado: `7/7` aprovados

## 5. Bateria completa
- comando:
  - `python -m unittest`
  - `backend.tests.test_simbolos_graficos_origem_apply`
  - `backend.tests.test_backfill_origem_simbolos_graficos`
  - `backend.tests.test_simbolos_graficos_origem_dry_run`
  - `backend.tests.test_simbolos_graficos_origem_migration`
  - `backend.tests.test_simbolo_grafico_origem_model`
- total: `26`
- aprovados: `26`
- falhas: `0`
- erros: `0`
- skips: `0`

## 6. Snapshot do banco antes
- database: `brana_saas`
- schema: `public`
- total: `1113`
- origem nula: `1113`
- origem preenchida: `0`
- origens distintas: `0`

## 7. Snapshot do banco depois
- database: `brana_saas`
- schema: `public`
- total: `1113`
- origem nula: `1113`
- origem preenchida: `0`
- origens distintas: `0`

## 8. Conclusao
- a camada apply simulada esta validada com cobertura critica completa;
- o comportamento de commit, rollback, rowcount, bloqueio de `brana_saas`, SQL parametrizado e validacoes previas foi provado em mocks e fakes;
- nenhuma escrita real foi executada;
- o banco operacional permaneceu inalterado.
