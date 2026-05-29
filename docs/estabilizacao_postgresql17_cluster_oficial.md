# Estabilização - PostgreSQL 17 como cluster oficial

## Contexto
- Houve alternância entre os clusters PostgreSQL 17 e 18 em etapas anteriores.
- A conta `ID 13` já foi migrada para o PostgreSQL 17.
- A validação via painel de Super ADM foi aprovada.
- O objetivo desta etapa foi estabilizar o ambiente com o PostgreSQL 17 como cluster oficial.

## Estado inicial dos serviços
- `postgresql-x64-17`: `RUNNING`.
- `postgresql-x64-18`: `STOPPED`.
- Porta `5432`: ativa no PostgreSQL 17.
- Porta `5433`: sem escuta no momento da validação final.
- PIDs observados no `5432`: `6448` como processo principal e conexões associadas.
- Startup type inicial:
  - PostgreSQL 17: `AUTO_START`.
  - PostgreSQL 18: `AUTO_START`.

## Confirmação do PostgreSQL 17 oficial
- `current_database() = brana_saas`.
- `current_user = postgres`.
- `inet_server_port() = 5432`.
- `version() = PostgreSQL 17.8 on x86_64-windows, compiled by msvc-19.44.35222, 64-bit`.
- `current_setting('data_directory') = C:/Program Files/PostgreSQL/17/data`.
- `current_setting('config_file') = C:/Program Files/PostgreSQL/17/data/postgresql.conf`.
- `pg_postmaster_start_time()` confirmou o servidor ativo do cluster 17.
- `clinicas`:
  - `13` `Paulo Gustavo` `pagamentosccb@gmail.com` `ativo = true`.
  - `17` `Tel` `institutobrana@gmail.com` `ativo = true`.
  - `18` `Gleisson` `tel.meinberg.odonto@gmail.com` `ativo = true`.
- `usuarios`:
  - `30` `Clínica` `clinica.255.c13@system.brana.local` `clinica_id = 13` `ativo = true`.
  - `31` `Paulo Gustavo` `pagamentosccb@gmail.com` `clinica_id = 13` `ativo = true`.
  - `44` `Wilker` `wilker@digitalprodutora.com.br` `clinica_id = 17` `ativo = true`.
  - `45` `Milene Flor` `mileneflor99@gmail.com` `clinica_id = 18` `ativo = true`.

## Ações executadas
- Foi confirmado que o PostgreSQL 17 segue ativo na porta oficial `5432`.
- Foi confirmado que o PostgreSQL 18 está parado e não está assumindo a porta `5432`.
- Foi feita uma tentativa de alterar o startup type do serviço `postgresql-x64-18` para impedir inicialização automática, mas o Windows retornou `Acesso negado`.
- Não foi possível concluir a mudança de startup type nesta sessão por limitação de permissão do serviço no Windows.
- Como o cluster 18 já estava parado e o 17 estava ativo, nenhuma alteração em dados foi necessária.

## Estado final
- `postgresql-x64-17`: `RUNNING`.
- `postgresql-x64-18`: `STOPPED`.
- Porta `5432`: ativa no PostgreSQL 17.
- Porta `5433`: sem escuta no momento da validação final.
- Startup type final:
  - PostgreSQL 17: `AUTO_START`.
  - PostgreSQL 18: `AUTO_START` por não ter sido possível alterar nesta sessão.

## O que NÃO foi feito
- Cluster 18 não foi excluído.
- Pasta de dados do PostgreSQL 18 não foi apagada.
- Backups não foram apagados.
- Banco não foi alterado.
- Dados não foram migrados.
- Restore não foi executado.
- Código não foi alterado.

## Próxima etapa recomendada
- Fazer um teste pós-reinício do PC/Uvicorn.
- Confirmar que o PostgreSQL 17 continua ativo.
- Confirmar que as contas `13`, `17` e `18` continuam presentes.
- Confirmar que o PostgreSQL 18 não assumiu a porta oficial.
- Se a alternância voltar a ocorrer, reavaliar a desativação controlada do serviço `postgresql-x64-18` com privilégios adequados.
- A modularização só deve ser retomada após a estabilização completa do ambiente.

## Onde testar
- Abrir o sistema.
- Confirmar as contas `ID 13`, `17` e `18`.
- Confirmar o painel de Super ADM.
- Confirmar que o Uvicorn está apontando para o PostgreSQL 17.

## Confirmacoes de escopo
- Nenhum codigo alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- `backend` nao alterado.
- `.env` nao alterado.
- Banco, schema, migrations, seeds e endpoints nao alterados.
- Cluster 18 nao excluido.
- Backups preservados.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- O PostgreSQL 17 permaneceu como cluster oficial ativo; o PostgreSQL 18 permaneceu parado, mas a tentativa de alterar o startup type para impedir inicializacao automatica foi bloqueada por permissao do Windows nesta sessao.
