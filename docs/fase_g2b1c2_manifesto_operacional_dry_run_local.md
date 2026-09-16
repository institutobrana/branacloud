# Fase G.2B.1C.2 - Geracao do manifesto operacional real e dry-run local

Data: 2026-08-03

## 1. Resultado
- APROVADA EM MODO READ-ONLY.
- `APPLY_ENABLED` permaneceu `False`.
- nenhum `UPDATE` foi executado.

## 2. Artefatos
- manifesto operacional real: `backend/manifests/simbolos_graficos_origem_g2b1c2_v1.json`
- script validado: `backend/scripts/backfill_origem_simbolos_graficos.py`
- teste base: `backend/tests/test_backfill_origem_simbolos_graficos.py`

## 3. Fonte canonica usada
- classificacao historica: `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`
- plano reversivel: `docs/fase_g2b1c0_plano_reversivel_backfill_origem.md`
- encerramento anterior: `docs/fase_g2b1c12_alinhamento_encerramento_g2b1c1.md`

## 4. Manifesto operacional
- version: `g2b1c2-v1`
- database: `brana_saas`
- schema: `public`
- table: `simbolo_grafico_catalogo`
- expected_total: `1113`
- expected_origin_null: `1113`
- apply_authorized: `false`
- checksum: `dd01ca096842b69385f5e16e4d84057b33c43daf08a3cbccb7d8783012077f7a`

## 5. Categorias do manifesto
- `catalogo_oficial`: `636`
- `seed_interno`: `464`
- `fixture_teste`: `2`
- `asset_auxiliar`: `11`

## 6. Dry-run local
- comando executado: `python backend/scripts/backfill_origem_simbolos_graficos.py --manifest backend/manifests/simbolos_graficos_origem_g2b1c2_v1.json --environment local --dry-run --expected-total 1113`
- total atual: `1113`
- origem nula: `1113`
- origem preenchida: `0`
- planned_updates: `1113`
- skips: `0`
- conflicts: `0`
- missing: `0`
- signature_mismatches: `0`
- exit_status: `0`

## 7. Garantias validadas
- manifesto obrigatorio;
- checksum validado;
- assinaturas validadas;
- categorias validadas;
- plano calculado em memoria;
- relatorio JSON gerado;
- modo padrao read-only;
- trava de apply ativa.

## 8. Banco
- estado preservado;
- total: `1113`;
- origem nula: `1113`;
- origem preenchida: `0`.

## 9. Limitacao
- `--apply` continua bloqueado por `APPLY_ENABLED = False`;
- rollback real de escrita continua nao testado;
- nenhuma escrita foi autorizada.

## 10. Conclusao
- a G.2B.1C.2 fica concluida como fase de manifesto operacional e dry-run local;
- a trilha permanece read-only;
- a proxima decisao, se houver, e documental e posterior a esta validacao.
