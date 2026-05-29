# Decisão - PostgreSQL 17 oficial e migração futura da conta ID 13 do cluster 18

## Contexto
- A alternância entre PostgreSQL 17 e 18 foi confirmada pelas auditorias recentes.
- O PostgreSQL 17 contém `ID 17`, `ID 18` e os usuários `44/45`.
- O PostgreSQL 18 contém `Paulo Gustavo ID 13`.
- O usuário decidiu oficializar o cluster 17 e preparar a migração futura da conta `ID 13` do cluster 18 para o cluster 17.

## Decisão do usuário
“O usuário definiu o cluster PostgreSQL 17 como oficial. A conta Paulo Gustavo ID 13 do cluster PostgreSQL 18 deve ser migrada futuramente para o cluster 17. O cluster 18 será excluído/desativado somente depois da migração validada.”

## Estado oficial definido
- Cluster oficial: PostgreSQL 17.
- Banco oficial: `brana_saas` do PostgreSQL 17.
- Cluster não oficial temporariamente preservado: PostgreSQL 18.
- Conta a migrar futuramente: `Paulo Gustavo ID 13` do cluster 18.

## O que NÃO será feito nesta etapa
- Não migrar a conta 13.
- Não executar backup nesta etapa, salvo autorização futura.
- Não apagar o cluster 18.
- Não desativar o cluster 18.
- Não restaurar dump.
- Não alterar `.env`.
- Não alterar código.
- Não alterar dados.

## Regras de segurança
- Backup dos dois clusters antes de migração.
- Inventário da conta 13 antes de qualquer SQL.
- Dry-run obrigatório.
- Aprovação explícita antes de migração.
- Validação funcional após migração.
- Desativação/exclusão do cluster 18 somente em etapa separada.

## Próximas subetapas
- Subetapa A: backup lógico dos dois clusters/bancos.
- Subetapa B: inventário da conta `Paulo Gustavo ID 13` no cluster 18.
- Subetapa C: plano de migração dry-run sem execução.
- Subetapa D: migração controlada somente após aprovação explícita.
- Subetapa E: estabilização definitiva com o cluster 17 como único cluster oficial.
- Subetapa F: desativação/exclusão do cluster 18 somente com autorização explícita posterior.

## Confirmação de estado atual, se SELECT foi executado
- `current_database()`: `brana_saas`
- `current_user`: `postgres`
- `inet_server_addr()`: `::1`
- `inet_server_port()`: `5432`
- `version()`: `PostgreSQL 17.8 on x86_64-windows, compiled by msvc-19.44.35222, 64-bit`
- `data_directory`: `C:/Program Files/PostgreSQL/17/data`
- `config_file`: `C:/Program Files/PostgreSQL/17/data/postgresql.conf`
- `pg_postmaster_start_time()`: `2026-05-29 13:39:29.635738-03`
- `ID 17`: existe.
- `ID 18`: existe.
- Usuário `44`: existe.
- Usuário `45`: existe.
- `ID 13`: não existe neste cluster 17.

## Impacto no desenvolvimento
- A modularização continua pausada até estabilizar o cluster oficial.
- Não retomar desenvolvimento enquanto houver risco de alternância de cluster.
- O primeiro objetivo agora é estabilizar o ambiente/banco.

## Confirmações de escopo
- Nenhum código alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` não alterado.
- `frontend/index.html` não alterado.
- `frontend/js/modules` não alterado.
- `backend` não alterado.
- `.env` não alterado.
- `banco`, schema, migrations, seeds e endpoints não alterados.
- Permissões e seeds não alteradas.
- Nenhum serviço reiniciado.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Decisão registrada para oficializar PostgreSQL 17, manter `brana_saas` do cluster 17 como banco oficial e preparar a migração futura da conta `Paulo Gustavo ID 13` do cluster 18 para o cluster 17, preservando o cluster 18 até a etapa futura autorizada.
