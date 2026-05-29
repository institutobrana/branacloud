# Auditoria - Bancos PostgreSQL existentes e banco ativo do Brana Cloud

## Contexto
- Havia duvida sobre existir mais de um banco PostgreSQL local e sobre qual banco o backend/Uvicorn usa atualmente.
- Auditorias recentes citaram `brana_saas`, `saas_local` e `postgres`.
- O objetivo desta leitura foi confirmar bancos e instancias sem alterar nada.

## Escopo
- Somente leitura.
- Nenhum codigo foi alterado.
- Nenhum dado de banco foi alterado.
- Nenhum backup foi restaurado.
- Nenhum service foi reiniciado.

## Configuracao atual do backend
- `backend/.env` define `DATABASE_URL=postgresql://postgres:1234@localhost:5432/brana_saas`.
- Banco configurado pelo backend: `brana_saas`.
- Usuario: `postgres`.
- Host: `localhost`.
- Porta: `5432`.
- `backend/main.py` carrega o `.env` por caminho absoluto: `Path(__file__).resolve().parent / ".env"`.
- `backend/database.py` usa `load_dotenv()` e le `DATABASE_URL` do ambiente.

## Bancos encontrados
- `brana_saas`
- `postgres`
- `saas_local`

## Identidade do PostgreSQL atual
- `current_database()`: `brana_saas`
- `current_user()`: `postgres`
- `inet_server_addr()`: `::1`
- `inet_server_port()`: `5432`
- `version()`: `PostgreSQL 18.3 on x86_64-windows, compiled by msvc-19.44.35225, 64-bit`
- `data_directory`: `C:/Program Files/PostgreSQL/18/data`
- `config_file`: `C:/Program Files/PostgreSQL/18/data/postgresql.conf`
- `pg_postmaster_start_time()`: `2026-05-29 09:46:11.904635-03`

## Bancos com tabelas do Brana
- `brana_saas` tem tabelas da aplicacao.
- `saas_local` tem tabelas da aplicacao.
- `postgres` nao tem tabelas da aplicacao.

## Comparacao entre bancos

| Banco | tem tabelas Brana | total tabelas | total clinicas | max clinica | total usuarios | max usuario | Paulo ID13 | ID17 | ID18 | mileneflor17 | mileneflor99 | observacao |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `brana_saas` | sim | 56 | 4 | 15 | 14 | 36 | sim | nao | nao | nao | nao | Banco ativo do backend; contem Paulo Gustavo e nao contem 17/18 nem os usuarios de teste. |
| `saas_local` | sim | 51 | 3 | 4 | 11 | 12 | nao | nao | nao | sim | nao | Banco separado/antigo; contem `mileneflor17@gmail.com`, mas nao explica Paulo nem 17/18. |
| `postgres` | nao | 0 | n/a | n/a | n/a | n/a | nao | nao | nao | nao | nao | Banco padrao, sem tabelas da aplicacao. |

## Instancias PostgreSQL
- Porta `5432` esta ativa e escutando no PID `6600`.
- `postgresql-x64-18` esta `Running`.
- `postgresql-x64-17` esta `Stopped`.
- O processo `uvicorn` atual escuta na porta `8000` no PID `9980`.
- `netstat` nao mostrou outra porta PostgreSQL ativa alem de `5432`.
- Ha multiplos processos `postgres.exe`, mas todos pertencem ao mesmo cluster/instancia PostgreSQL 18; nao houve evidência de duas instancias PostgreSQL ativas ao mesmo tempo.

## Conclusao
- Existem tres bancos PostgreSQL locais listados: `brana_saas`, `postgres` e `saas_local`.
- O backend usa `brana_saas`.
- O banco `brana_saas` parece ser o banco oficial aparente agora.
- `saas_local` e um banco separado/antigo.
- `postgres` e apenas o banco padrao, sem tabelas do Brana.
- Nao ha evidência de mais de uma instancia PostgreSQL ativa.

## Proxima etapa recomendada
- Se `brana_saas` e de fato o banco oficial, documentar essa decisao e manter o estado atual.
- Se `saas_local` precisar ser preservado por historico, nao apagar agora; abrir etapa separada de inventario/backup/remoção autorizada se necessario.
- Se surgir suspeita de segunda instancia, abrir auditoria especifica.

## Confirmacoes de escopo
- Nenhum codigo alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- `backend` nao alterado.
- `banco`, schema, migrations, seeds e endpoints nao alterados.
- Permissoes e seeds nao alteradas.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Auditoria dos bancos PostgreSQL existentes concluida com `brana_saas` como banco ativo do backend, `saas_local` como banco separado/antigo e `postgres` como banco padrao sem tabelas da aplicacao.
