# Fase G.2B.1C.1 - Implementacao do script read-only, manifesto de teste e testes automatizados do backfill

Data: 2026-08-03

## 1. Resultado
- status: `IMPLEMENTACAO DOCUMENTAL E TESTAVEL; --apply BLOQUEADO`
- nenhuma escrita foi executada nesta fase
- a fonte canonica de classificacao continua sendo `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`
- o plano reversivel continua sendo `docs/fase_g2b1c0_plano_reversivel_backfill_origem.md`

## 2. Escopo entregue
- script importavel e testavel para backfill de origem;
- modo padrao read-only;
- validacao de manifesto;
- travas de seguranca para `--apply`;
- manifesto de teste pequeno e controlado;
- testes automatizados de manifesto, dry-run e gate de apply.

## 3. Arquivos criados
- `backend/scripts/backfill_origem_simbolos_graficos.py`
- `backend/tests/test_backfill_origem_simbolos_graficos.py`
- `backend/tests/fixtures/simbolos_graficos_origem_manifest_test.json`

## 4. Contrato do script
- exige manifesto explícito;
- valida ambiente, banco, tabela e totais;
- valida categorias, assinaturas e checksums;
- calcula plano de atualização sem escrever por padrao;
- possui modo `--apply` protegido por gate temporario;
- recusa `--apply` nesta fase;
- gera relatorio em dry-run;
- permite futura evolucao para apply sob nova autorizacao.

## 5. Modo padrao
- sem flag de escrita = dry-run;
- `--dry-run` explicito = dry-run;
- transacao read-only quando possivel;
- rollback ao final;
- nenhum `UPDATE` emitido.

## 6. Flags de seguranca
- `--manifest <arquivo>`
- `--dry-run`
- `--apply`
- `--environment <local|hml|prod>`
- `--expected-database brana_saas`
- `--expected-schema public`
- `--expected-table simbolo_grafico_catalogo`
- `--expected-total 1113`
- `--confirm-backfill-origem`

## 7. Gate de apply
- `APPLY_ENABLED = False`;
- a fase nao autoriza escrita real;
- o erro esperado e: `Modo --apply nao autorizado na Fase G.2B.1C.1.`

## 8. Manifesto de teste
- fixture pequena: 6 registros;
- categorias cobertas: `catalogo_oficial`, `seed_interno`, `fixture_teste`, `asset_auxiliar`;
- IDs ficticios;
- checksum valido;
- nomeado como `TEST FIXTURE`.

## 9. Testes automatizados
- validaçao do manifesto de teste;
- dry-run com banco isolado e sem escrita;
- gate de `--apply` bloqueado;
- checksum invalido rejeitado.

## 10. Matriz de cobertura
| Requisito G.2B.1C.1 | Implementado | Testado | Evidencia |
|---|---:|---:|---|
| modo padrao dry-run | sim | sim | `parse_args()` sem `--apply`; `main()` executado em modo leitura |
| apply bloqueado | sim | sim | `APPLY_ENABLED = False` e `optionally_apply()` levanta erro |
| manifesto obrigatorio | sim | sim | `--manifest` requerido pelo parser |
| checksum | sim | sim | `compute_manifest_checksum()` e rejeicao de checksum invalido |
| assinatura | sim | sim | `build_record_signature()` e comparacao no plano |
| IDs duplicados | sim | sim | `validate_manifest()` rejeita IDs repetidos |
| categorias invalidas | sim | sim | validacao de categorias permitidas no manifesto |
| total divergente | sim | sim | `--expected-total` e totais do manifesto validados |
| banco/schema/tabela | sim | sim | validacao de `database`, `schema` e `table` no manifesto e CLI |
| plano em memoria | sim | sim | `build_update_plan()` retorna update/skip/conflict sem SQL de escrita |
| relatorio | sim | sim | `dry_run_report()` e escrita JSON de relatorio |
| zero commit | sim | parcial | o script nao possui caminho de commit em dry-run; nao houve commit em testes |
| zero flush | sim | parcial | nao ha chamada de flush na implementacao; sem escrita valida por leitura |
| zero UPDATE | sim | sim | o caminho validado nao executa UPDATE nem apply real |
| exit codes | sim | sim | `main()` retorna `0` em sucesso e `2` em divergencia |
| rollback em teste | nao aplica | nao aplica | apply segue bloqueado; rollback operacional fica para fase posterior |

## 11. Resultado esperado
- dry-run passa em banco isolado;
- apply permanece bloqueado nesta fase;
- nenhuma alteracao em `brana_saas`;
- nenhuma alteracao em React, POST, model, migration, seeds ou schema publico.

## 12. Encerramento
- a G.2B.1C.1 fica concluida com validação integrada do script read-only;
- a implementação operacional de `--apply` continua bloqueada;
- a próxima etapa, se autorizada, é apenas evolutiva e documental.
