# Backup - Clusters PostgreSQL 17 e 18 antes da migração da conta ID 13

## Contexto
- PostgreSQL 17 foi definido como cluster oficial.
- PostgreSQL 18 fica preservado temporariamente porque contem a conta `Paulo Gustavo ID 13` que sera migrada futuramente.
- Antes de qualquer migracao, foi executada a etapa obrigatoria de backup logistico dos dois clusters.

## Autorizacao do usuario
> "O usuário autorizou preparar e executar o backup lógico dos dois clusters, podendo iniciar/parar serviços PostgreSQL apenas se necessário para acessar o cluster 18, sem alterar dados e sem restaurar nada."

## Escopo
- Somente leitura e backup logistico.
- Nenhuma restauracao foi executada.
- Nenhuma migracao foi executada.
- Nenhum dado foi alterado.
- Nenhum codigo foi alterado.

## Diretorio de backup
- `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\postgres_clusters_20260529_143341`

## Estado do PostgreSQL 17 antes do backup
- Banco atual: `brana_saas`
- Versao: `PostgreSQL 17.8 on x86_64-windows, compiled by msvc-19.44.35222, 64-bit`
- `data_directory`: `C:/Program Files/PostgreSQL/17/data`
- `config_file`: `C:/Program Files/PostgreSQL/17/data/postgresql.conf`
- `pg_postmaster_start_time`: `2026-05-29 13:39:29.635738-03`
- `max(clinicas.id)`: `18`
- `max(usuarios.id)`: `45`
- `clinicas` em `ID 13/17/18`: `17 | Tel | institutobrana@gmail.com` e `18 | Gleisson | tel.meinberg.odonto@gmail.com`; `ID 13` ausente
- `usuarios` em `ID 44/45`: `44 | TESTE | mileneflor17@gmail.com | 17` e `45 | Milene Flor | mileneflor99@gmail.com | 18`

## Backup do PostgreSQL 17
- Arquivo dump: `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\postgres_clusters_20260529_143341\brana_saas_pg17_oficial_20260529_143341.dump`
  - Tamanho: `3047721` bytes
  - Data/hora: `29/05/2026 14:33:53`
  - Exit code: `0`
- Arquivo schema: `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\postgres_clusters_20260529_143341\brana_saas_pg17_oficial_20260529_143341.schema.sql`
  - Tamanho: `162588` bytes
  - Data/hora: `29/05/2026 14:33:53`
  - Exit code: `0`
- Validacao sem restore:
  - `pg_restore -l` funcionou no `.dump`
  - Listagem confirmou formato custom e TOC entries do backup

## Acesso ao PostgreSQL 18
- O servicco Windows do PostgreSQL 18 estava parado no momento inicial.
- A tentativa de alternar servicos via `sc.exe` retornou acesso negado.
- Para nao mexer no cluster 17 oficial, o PostgreSQL 18 foi iniciado temporariamente em `5433` com `pg_ctl`.
- Ao final da etapa, o PostgreSQL 18 foi parado novamente e o PostgreSQL 17 permaneceu ativo como oficial.

## Estado do PostgreSQL 18 antes do backup
- Banco atual: `brana_saas`
- Versao: `PostgreSQL 18.3 on x86_64-windows, compiled by msvc-19.44.35225, 64-bit`
- `data_directory`: `C:/Program Files/PostgreSQL/18/data`
- `config_file`: `C:/Program Files/PostgreSQL/18/data/postgresql.conf`
- `pg_postmaster_start_time`: `2026-05-29 14:35:28.287085-03`
- `max(clinicas.id)`: `15`
- `max(usuarios.id)`: `36`
- `clinicas` em `ID 13/17/18`: apenas `13 | Paulo Gustavo | pagamentosccb@gmail.com`; `ID 17` e `ID 18` ausentes
- `usuarios` para `clinica_id = 13` ou `ID 31/44/45`: `30 | Clínica | clinica.255.c13@system.brana.local | 13` e `31 | Paulo Gustavo | pagamentosccb@gmail.com | 13`; `44` e `45` ausentes

## Backup do PostgreSQL 18
- Arquivo dump: `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\postgres_clusters_20260529_143341\brana_saas_pg18_conta13_20260529_143341.dump`
  - Tamanho: `3044707` bytes
  - Data/hora: `29/05/2026 14:35:47`
  - Exit code: `0`
- Arquivo schema: `D:\BRANA ARQUIVOS\BRANA CLOUD\backups\postgres_clusters_20260529_143341\brana_saas_pg18_conta13_20260529_143341.schema.sql`
  - Tamanho: `162707` bytes
  - Data/hora: `29/05/2026 14:35:47`
  - Exit code: `0`
- Validacao sem restore:
  - `pg_restore -l` funcionou no `.dump`
  - Listagem confirmou formato custom e TOC entries do backup

## Estado final
- PostgreSQL 17 ficou ativo ao final da etapa.
- PostgreSQL 18 foi encerrado apos a coleta do backup.

## Arquivos de backup nao versionados
- Os arquivos `.dump`, `.schema.sql` e o log temporario ficaram fora do Git.
- Nenhum arquivo de backup foi adicionado ao commit.

## Proxima etapa recomendada
- Subetapa B: inventario da conta `Paulo Gustavo ID 13` no cluster 18, sem migrar ainda.

## Confirmacoes de escopo
- Nenhum codigo alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- `backend` nao alterado.
- `.env` nao alterado.
- `banco/schema/migrations/seeds/endpoints` nao alterados.
- `permissoes/seeds` nao alteradas.
- Nenhum restore executado.
- Nenhuma migracao executada.
- Cluster 18 nao excluido.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Esta etapa registra o backup logico dos clusters PostgreSQL 17 e 18 antes da futura migracao da conta ID 13.
