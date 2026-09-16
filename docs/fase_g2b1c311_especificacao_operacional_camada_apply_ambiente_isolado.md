# Fase G.2B.1C.3.1.1 - Especificacao operacional da camada apply para ambiente isolado

Data: 2026-08-04

## 1. Resultado
- APROVADA PARA ESPECIFICACAO DOCUMENTAL;
- nenhuma implementacao foi feita;
- nenhum banco foi criado;
- nenhum teste de persistencia foi executado;
- o banco operacional `brana_saas` permanece proibido.

## 2. Base documental canonica
- contrato tecnico: `docs/fase_g2b1c310_contrato_tecnico_camada_apply_ambiente_isolado.md`
- plano documental: `docs/fase_g2b1c30_plano_documental_pre_aplicacao_backup_rollback_ambiente_isolado.md`
- classificacao historica: `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`
- plano reversivel: `docs/fase_g2b1c0_plano_reversivel_backfill_origem.md`
- script read-only: `docs/fase_g2b1c1_script_read_only_manifesto_testes.md`
- manifesto operacional: `docs/fase_g2b1c2_manifesto_operacional_dry_run_local.md`
- encerramento: `docs/fase_g2b1c21_encerramento_final_manifesto_operacional.md`
- provas negativas: `docs/fase_g2b1c22_complemento_provas_negativas_manifesto.md`

## 3. Tabela de decisao
| Decisao | Ja definida | Ainda ambigua | Acao documental |
|---|---:|---:|---|
| arquitetura | sim | nao | manter CLI, manifesto, snapshot, apply e relatorio como camadas conceituais |
| gates | sim | nao | definir gate runtime, ambiente, banco, checksum, confirmacao e estado parcial |
| funcoes | sim | parcialmente | especificar assinaturas, efeitos e responsabilidades |
| transacao | sim | nao | exigir begin, validate, update, post-check, commit ou rollback |
| SQL | sim | nao | padronizar UPDATE parametrizado com bind de `:id` e `:origem` |
| rollback | sim | nao | obrigar rollback integral em qualquer erro ou divergencia |
| relatorios | sim | parcialmente | documentar JSON, resumo textual e paths de saida |
| testes | sim | parcialmente | listar unitarios, isolamento e casos de recusa |

## 4. Estrutura recomendada
### Script CLI
- parse de argumentos;
- carregamento de ambiente;
- validacao de modo;
- chamada para validacao de manifesto;
- chamada para autorizacao runtime;
- chamada para execucao transacional quando permitido;
- emissao de exit code e mensagens.

### Helper apply
- valida autorizacao;
- valida o plano;
- executa transacao;
- faz conferencia final;
- produz resultado e relatorio;
- nunca e chamado pelo CLI sem gates satisfeitos.

## 5. Estruturas de entrada e saida
### 5.1 `ApplyAuthorization`
Campos:
- `environment`;
- `expected_database`;
- `expected_schema`;
- `expected_table`;
- `expected_manifest_checksum`;
- `runtime_authorized`;
- `confirmation_present`;
- `isolated_database_confirmed`.

### 5.2 `PlannedRecord`
Campos:
- `id`;
- `origem_atual`;
- `origem_esperada`;
- `assinatura_atual`;
- `assinatura_esperada`;
- `rule_id`;
- `action`;
- `reason`.

### 5.3 `ApplyPlan`
Campos:
- `records`;
- `planned_updates`;
- `skips`;
- `conflicts`;
- `missing`;
- `signature_mismatches`;
- `partial_state`;
- `category_totals`.

### 5.4 `ApplyExecutionResult`
Campos:
- `attempted`;
- `updated`;
- `skipped`;
- `committed`;
- `rolled_back`;
- `rollback_reason`;
- `category_totals`;
- `duration`;
- `report_paths`.

## 6. Funcoes futuras
### 6.1 `validate_apply_authorization(...) -> ApplyAuthorization`
- entrada: args, manifesto, identidade do banco, ambiente runtime;
- saida: estrutura de autorizacao;
- efeitos colaterais: nenhum;
- excecoes: autorizacao ausente, banco divergente, ambiente nao permitido;
- pode chamar commit: nao;
- pode chamar rollback: nao;
- pode emitir SQL: nao.

### 6.2 `validate_apply_plan(...) -> None`
- entrada: plano, manifesto, snapshot;
- saida: nenhuma;
- efeitos colaterais: nenhum;
- excecoes: conflito, missing, assinatura divergente, estado parcial;
- pode chamar commit: nao;
- pode chamar rollback: nao;
- pode emitir SQL: nao.

### 6.3 `execute_apply_transaction(...) -> ApplyExecutionResult`
- entrada: sessao, plano, autorizacao;
- saida: resultado de execucao;
- efeitos colaterais: pode atualizar a tabela alvo;
- excecoes: erro de transacao, rowcount divergente, falha de lock, falha de validação;
- pode chamar commit: sim;
- pode chamar rollback: sim;
- pode emitir SQL: sim, apenas nesta funcao.

### 6.4 `validate_post_apply_state(...) -> None`
- entrada: sessao, manifesto;
- saida: nenhuma;
- efeitos colaterais: nenhuma escrita;
- excecoes: contagem final divergente, origem parcial, assinatura divergente;
- pode chamar commit: nao;
- pode chamar rollback: sim, se chamada antes do commit final;
- pode emitir SQL: leitura apenas.

### 6.5 `write_apply_report(...) -> ReportPaths`
- entrada: resultado, diretorio;
- saida: caminhos dos relatorios;
- efeitos colaterais: grava arquivos de relatorio;
- excecoes: falha de escrita de arquivo;
- pode chamar commit: nao;
- pode chamar rollback: nao;
- pode emitir SQL: nao.

## 7. Gates de autorizacao
A escrita futura so pode avancar se todos forem verdadeiros:
1. `--apply` presente;
2. ambiente igual a `isolated`;
3. confirmacao de backfill presente;
4. confirmacao do banco isolado presente;
5. autorizacao runtime verdadeira;
6. banco atual corresponde ao banco isolado permitido;
7. banco atual nao e `brana_saas`;
8. banco atual nao e homologacao;
9. banco atual nao e producao;
10. schema e tabela correspondem;
11. checksum do manifesto e o canonico permitido;
12. manifesto nao e fixture inadequada;
13. backup e restauracao estao documentados;
14. plano nao possui conflito;
15. plano nao possui missing;
16. plano nao possui assinatura divergente;
17. estado nao e parcial.

Falha em qualquer gate:
- zero `UPDATE`;
- zero commit;
- mensagem clara;
- exit code especifico.

## 8. Gate runtime
- `APPLY_IMPLEMENTED` deve existir conceitualmente como gate estrutural;
- autorizacao runtime deve vir de variavel de ambiente;
- lista de ambientes permitidos deve ser restrita a `isolated` para a escrita inicial;
- banco permitido deve ser informado separadamente;
- checksum permitido deve ser informado separadamente;
- confirmacoes CLI devem ser obrigatorias.

Exemplo conceitual:
- `BRANA_SYMBOL_ORIGIN_APPLY_AUTHORIZED=YES`
- `BRANA_SYMBOL_ORIGIN_ALLOWED_DATABASE=<banco isolado>`
- `BRANA_SYMBOL_ORIGIN_ALLOWED_CHECKSUM=<checksum>`

Regras:
- comparacao exata;
- valor ausente = bloqueado;
- valor invalido = bloqueado;
- sem wildcard;
- sem multiplos bancos inicialmente;
- valores sensiveis nunca devem aparecer em relatorios.

## 9. Fluxo de estados
Estados:
1. `CLI_PARSED`
2. `MANIFEST_VALIDATED`
3. `AUTHORIZATION_VALIDATED`
4. `DATABASE_VALIDATED`
5. `PLAN_VALIDATED`
6. `LOCK_ACQUIRED`
7. `TRANSACTION_STARTED`
8. `UPDATES_RUNNING`
9. `POST_STATE_VALIDATED`
10. `COMMITTED`
11. `ROLLED_BACK`
12. `FAILED_BEFORE_WRITE`

Transicoes permitidas:
- `CLI_PARSED -> MANIFEST_VALIDATED -> AUTHORIZATION_VALIDATED -> DATABASE_VALIDATED -> PLAN_VALIDATED -> LOCK_ACQUIRED -> TRANSACTION_STARTED -> UPDATES_RUNNING -> POST_STATE_VALIDATED -> COMMITTED`
- qualquer conflito antes da escrita: `PLAN_VALIDATED` nao e alcancado e o estado final e `FAILED_BEFORE_WRITE`
- erro no meio da escrita: `UPDATES_RUNNING -> ROLLED_BACK`
- qualquer falha antes do primeiro `UPDATE`: `FAILED_BEFORE_WRITE`

## 10. Estado parcial
- inicial totalmente nulo: permitido para primeira aplicacao isolada;
- integralmente preenchido e correspondente: permitido apenas como validacao idempotente, sem `UPDATE`;
- parcial: rejeitado antes da escrita;
- parcial inclui parte nula, parte correta, parte divergente e categorias incompletas;
- estado parcial exige exit code proprio e relatorio obrigatorio.

## 11. SQL parametrizado
Forma conceitual:
```sql
UPDATE public.simbolo_grafico_catalogo
SET origem = :origem
WHERE id = :id
  AND origem IS NULL
```

Regras:
- usar bind parameters;
- nao concatenar valores do manifesto;
- nenhum update fora da funcao exclusiva de escrita;
- rowcount deve ser conferido item a item ou por lote definido.

## 12. Rowcount
- cada update deve ter rowcount esperado;
- rowcount zero em item planejado = divergencia;
- rowcount maior que um = erro grave;
- o total final deve fechar exatamente no planejado;
- divergencia de rowcount gera rollback.

## 13. Transacao
- abrir conexao isolada;
- iniciar transacao;
- validar snapshot pre-apply;
- executar updates apenas apos validacoes totais;
- validar estado final;
- commit somente se tudo corresponder;
- rollback integral em qualquer erro.

## 14. Relatorios
- relatorio de pre-condicoes;
- relatorio de plano;
- relatorio de execucao;
- relatorio de divergencias;
- relatorio de commit ou rollback;
- relatorio final em JSON;
- resumo textual em markdown;
- sem segredos ou credenciais.

## 15. Excecoes e exit codes
### Excecoes conceituais
- autorizacao ausente;
- banco divergente;
- checksum invalido;
- categoria invalida;
- plano com conflito;
- missing;
- assinatura divergente;
- estado parcial;
- rowcount divergente;
- falha de transacao;
- falha de relatorio.

### Exit codes recomendados
- `0`: sucesso;
- `2`: divergencia de manifesto ou plano;
- `3`: banco ou ambiente nao autorizado;
- `4`: aplicacao bloqueada por gate runtime;
- `5`: falha transacional;
- `6`: estado parcial;
- `7`: erro de relatorio.

## 16. Idempotencia
- primeira execucao: pode atualizar apenas o subconjunto previsto;
- segunda execucao: deve resultar em zero updates;
- estado ja aplicado nao pode ser tratado como erro;
- divergencia parcial nao pode ser mascarada como sucesso.

## 17. Limites do ambiente isolado
- somente ambiente descartavel ou temporario;
- nenhuma credencial real reutilizada;
- `brana_saas` proibido;
- `hml` proibido;
- `prod` proibido;
- se o ambiente nao corresponder ao isolado aprovado, a escrita e bloqueada.

## 18. Testes unitarios da implementacao
- validação de gates;
- validação do contrato de autorizacao;
- validação da estrutura de plano;
- validação de SQL parametrizado;
- validação de rowcount;
- validação de commit e rollback;
- validação de idempotencia;
- validação de estado parcial;
- validação de relatorios;
- validação de rejeicao por banco divergente;
- validação de rejeicao por checksum divergente.

## 19. Encerramento futuro da fase de codigo
A futura fase de codigo so pode ser encerrada se:
- apply existir como codigo, mas estiver bloqueado por gates;
- os testes de aplicacao em banco isolado passarem;
- rollback for provado;
- idempotencia for provada;
- relatorios forem emitidos;
- `brana_saas` continuar intocado;
- a mensagem desatualizada tiver sido corrigida;
- nenhuma rota, model, seed, scope ou startup tiver sido alterada fora do contrato.

## 20. Conclusao
- a fase `G.2B.1C.3.1.1` fica encerrada como especificacao operacional;
- a futura implementacao da camada apply fica definida sem ambiguidade relevante;
- nenhuma escrita foi autorizada ou executada nesta rodada.
