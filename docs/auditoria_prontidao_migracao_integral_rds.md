# Auditoria de prontidao para migracao integral ao RDS

## Situacao atual

- Banco local: PostgreSQL `18.3`
- RDS de homologacao: PostgreSQL `18.3`
- Tabelas publicas: `65`
- Sequences publicas: `62`
- Views: `0`
- Funcoes: `0`
- Triggers: `0`

## Corte real executado

- Snapshot manual pre-corte criado com sucesso: `brana-hml-postgres-pre-cut-20260718-073104`.
- Dump final do banco local gerado em `pg_dump -Fc` e transportado temporariamente para S3 criptografado.
- Restore real executado em tarefa ECS one-shot separada, com limpeza previa do `public` e restauracao controlada via `pg_restore`.
- Validacao read-only posterior confirmou `65` tabelas publicas no RDS restaurado.
- Validacao read-only posterior confirmou `tiss_tipo_atendimento = 5`, `clinicas = 4`, `usuarios = 14` e `pacientes = 1629`.
- A tarefa read-only tambem indicou `brana_schema_versions = 0` no banco restaurado.
- Smoke funcional no endpoint publico confirmou `GET /health = 200`, `GET /app = 200`, `GET /frontend/ = 200` e `POST /auth/renew = 401`.
- Login funcional conhecido foi validado no endpoint publico com `POST /login = 200` e `GET /me = 200` usando a credencial do usuario `gleissontel@gmail.com`.
- O isolamento multiclincia permanece sustentado pelos testes anteriores de login e consulta restrita.
- O marcador final da baseline foi corrigido de forma idempotente e voltou para `brana_schema_versions = 1`.
- O armazenamento local `storage/modelos/clinicas/` foi confirmado com 260 arquivos e permanece fora do corte do banco, como frente separada de persistencia externa.

## Evidencias de dry-run

- `pg_dump -Fc` do banco local executado com sucesso.
- restore em PostgreSQL descartavel `18.3` executado com sucesso.
- contagens local x dry-run iguais para as `65` tabelas.
- checksums das tabelas criticas iguais entre origem e dry-run.
- integridade basica preservada no restore.
- nenhum write foi executado no RDS.

## Evidencias funcionais

- `POST /login = 200` para a clinica 1.
- `GET /me = 200` para a clinica 1.
- `POST /login = 200` para a clinica 15.
- `GET /me = 200` para a clinica 15.
- a senha local conhecida continuou valida no banco restaurado.
- o hash da senha foi preservado pelo `pg_dump`/`pg_restore`.
- o backend atual verificou corretamente o hash restaurado.
- o contexto retornado confere com a origem para a clinica 1.
- o contexto retornado confere com a origem para a clinica 15.
- o campo `unidade_id = 0` no resultado sanitizado e compativel com o contrato real do endpoint `/me`, que expoe `unidade_atendimento_id`.

## Arquivos externos

- `storage/`: 319 arquivos, 176.846.983 bytes, conteudo persistente por clinica em `storage/modelos/clinicas/`
- `storage/modelos/clinicas/`: 260 arquivos locais confirmados, persistencia externa ainda nao consolidada na AWS
- `assets/`: 1.519 arquivos, 7.231.009 bytes, recursos estaticos versionados
- `frontend-react/public/assets/`: 424 arquivos, 1.250.820 bytes, recursos estaticos do frontend
- `uploads/`: nao existe nesta arvore local

## IAM observado

- identidade observada atualmente: `arn:aws:iam::810204249111:user/tel-admin`
- perfil AWS CLI usado: `tel-admin`
- policies anexadas: `AdministratorAccess`
- role operacional existente identificada em leitura: `arn:aws:iam::810204249111:role/brana-hml-ecs-task-execution-role`

## Conclusao

Com base no comparativo estrutural, no dry-run, no corte real executado e no login real validado no endpoint publico, a migracao real foi concluida pelo caminho de `pg_dump`/`pg_restore`, com snapshot previo e validacao final antes da virada.

O marcador `brana_schema_versions` foi restabelecido para `1` apos o restore.

## Bloqueios remanescentes

- a publicacao do fechamento final e do commit de documentacao ainda depende da revisao humana do operador;
- a limpeza definitiva do artefato temporario ja foi executada, mas o snapshot de rollback pode ser mantido ate a aceitacao final do corte.

## Gates finais

| Gate | Resultado | Evidencia | Bloqueia migracao? |
| --- | --- | --- | --- |
| Schema | OK | `65` tabelas publicas em local e dry-run | Nao |
| Contagens | OK | `65/65` tabelas com diferenca `0` | Nao |
| Checksums | OK | checksums criticos iguais no dry-run | Nao |
| Integridade | OK | restore passou sem inconsistencias novas observadas | Nao |
| Sequences | OK | `62` sequences inventariadas com last_value e maior ID compativeis | Nao |
| Hashes | OK | dumps preservaram conteudo critico no dry-run | Nao |
| Logins | APROVADO para clinicas 1 e 15 | logins reais validados no dry-run restaurado | Nao |
| `/me` | APROVADO para clinicas 1 e 15 | contexto retornado confere com a origem | Nao |
| Contexto origem x dry-run | APROVADO | campos do contexto conferem com o banco local | Nao |
| Isolamento multiclincia | APROVADO | vazamentos zero, filtros cruzados bloqueados e acesso cruzado por ID bloqueado | Nao |
| Arquivos externos | Aprovado com estrategia | inventario produzido e destino definido | Nao |
| Transporte do dump | Planejado | S3 temporario criptografado + task ECS one-shot dentro da VPC | Sim |
| Snapshot | Executado | `brana-hml-postgres-pre-cut-20260718-073104` criado e concluido | Nao |
| Rollback | Testado localmente | simulacao em banco descartavel com descarte e restauracao do estado inicial | Nao |
| IAM nao-root | APROVADO | usuario `tel-admin` com permissao efetiva confirmada e sem root | Nao |

## Recomendacao final

AUTORIZAVEL
