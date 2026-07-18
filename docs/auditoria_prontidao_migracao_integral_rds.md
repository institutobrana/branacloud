# Auditoria de prontidao para migracao integral ao RDS

## Situacao atual

- Banco local: PostgreSQL `18.3`
- RDS de homologacao: PostgreSQL `18.3`
- Tabelas publicas: `65`
- Sequences publicas: `62`
- Views: `0`
- Funcoes: `0`
- Triggers: `0`

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
- `assets/`: 1.519 arquivos, 7.231.009 bytes, recursos estaticos versionados
- `frontend-react/public/assets/`: 424 arquivos, 1.250.820 bytes, recursos estaticos do frontend
- `uploads/`: nao existe nesta arvore local

## IAM observado

- identidade observada atualmente: `arn:aws:iam::810204249111:user/tel-admin`
- perfil AWS CLI usado: `tel-admin`
- policies anexadas: `AdministratorAccess`
- role operacional existente identificada em leitura: `arn:aws:iam::810204249111:role/brana-hml-ecs-task-execution-role`

## Conclusao

Com base no comparativo estrutural, no dry-run e no login real validado na clinica 1 e na clinica 15, a migracao real pode seguir pelo caminho de `pg_dump`/`pg_restore`, com snapshot previo e validacao final antes da virada.

## Bloqueios remanescentes

- a importacao real ainda nao foi executada;
- a janela de corte definitiva ainda precisa ser agendada;
- o snapshot pre-importacao ainda precisa ser criado no momento da virada;
- a formalizacao operacional do corte real ainda depende da revisao final de seguranca.

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
| Snapshot | Planejado | snapshot manual pre-importacao definido como pre-requisito | Sim |
| Rollback | Testado localmente | simulacao em banco descartavel com descarte e restauracao do estado inicial | Nao |
| IAM nao-root | APROVADO | usuario `tel-admin` com permissao efetiva confirmada e sem root | Nao |

## Recomendacao final

AUTORIZAVEL
