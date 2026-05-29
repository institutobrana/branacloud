# Teste de estabilidade - estado-base antes do reinício do PC/Uvicorn

## Contexto
- O usuário quer garantir que o banco e o sistema fiquem estáveis após reinício.
- O estado oficial definido anteriormente é `brana_saas`.
- `ID 17/18` não serão recuperadas nesta etapa.
- O objetivo desta etapa é registrar o estado-base antes do reinício para comparação posterior.

## Configuração backend
- `backend/.env` define `DATABASE_URL=postgresql://postgres:1234@localhost:5432/brana_saas`.
- Banco configurado: `brana_saas`.
- Host: `localhost`.
- Porta: `5432`.
- Usuário: `postgres`.
- `backend/main.py` carrega o `.env` por caminho absoluto via `Path(__file__).resolve().parent / ".env"`.

## Identidade PostgreSQL atual
- `current_database()`: `brana_saas`
- `current_user`: `postgres`
- `inet_server_addr()`: `::1`
- `inet_server_port()`: `5432`
- `version()`: `PostgreSQL 18.3 on x86_64-windows, compiled by msvc-19.44.35225, 64-bit`
- `data_directory`: `C:/Program Files/PostgreSQL/18/data`
- `config_file`: `C:/Program Files/PostgreSQL/18/data/postgresql.conf`
- `pg_postmaster_start_time()`: `2026-05-29 09:46:11.904635-03`
- `now()`: `2026-05-29 13:37:02.36765-03`

## Estado-base do `brana_saas`
- Clínica `ID 13`:
  - `id`: `13`
  - `nome`: `Paulo Gustavo`
  - `email`: `pagamentosccb@gmail.com`
  - `ativo`: `true`
  - `criado_em`: `2026-05-27 14:36:36.671179-03`
  - `trial_ate`: `2027-05-27 21:12:09.601728`
  - `opcoes_sistema_json`: `null`
- Clínicas `ID 17` e `ID 18`: ausentes no estado atual.
- Usuários `44` e `45`: ausentes no estado atual.
- `max(clinicas.id) = 15`
- `max(usuarios.id) = 36`
- Contagens atuais:
  - total de clínicas: `4`
  - total de usuários: `14`
  - total de prestadores: `10`
  - total de unidades: `3`
  - total de `access_profile`: `20`
  - total de `plataforma_auditoria`: `46`
- Últimas clínicas por `id`:
  - `15:Gleisson`
  - `13:Paulo Gustavo`
  - `4:Alisson Cristóvão Butarelo`
  - `1:Instuto Brana - Odontologia`
- Últimas clínicas por `created_em`:
  - `15:Gleisson`
  - `13:Paulo Gustavo`
  - `4:Alisson Cristóvão Butarelo`
  - `1:Instuto Brana - Odontologia`
- Últimos usuários por `id`:
  - `36:Wilker:wilker@digitalprodutora.com.br`
  - `35:Gleisson:institutobrana@gmail.com`
  - `34:Clínica:clinica.255.c15@system.brana.local`
  - `31:Paulo Gustavo:pagamentosccb@gmail.com`
  - `30:Clínica:clinica.255.c13@system.brana.local`
  - `12:Adriana Sadôco Ferraz Jascinto:adrianasadocoferrazj.260.c1@local.brana`
  - `11:Brenda:brenda.259.c1@local.brana`
  - `10:Milene Flor:mileneflor.258.c1@local.brana`
  - `9:Jozicler Teodoro Sampaio:joziclerteosampaio1981@gmail.com`
  - `8:Alisson Cristovão Butarelo:alissoncristovaobuta.256.c1@local.brana`
- Busca por marcadores:
  - `Paulo Gustavo`: encontrado.
  - `pagamentosccb@gmail.com`: encontrado.
  - `mileneflor17@gmail.com`: não encontrado.
  - `mileneflor99@gmail.com`: não encontrado.
  - `tel.meinberg.odonto@gmail.com`: não encontrado.

## Serviços e portas
- PostgreSQL 18 ativo.
- Porta PostgreSQL ativa: `5432`.
- Uvicorn ativo na porta `8000`.
- Comando do Uvicorn observado:
  - `"C:\Users\Tel\AppData\Local\Programs\Python\Python310\python.exe" "D:\BRANA ARQUIVOS\BRANA CLOUD\venv\Scripts\uvicorn.exe" main:app --host 0.0.0.0 --port 8000 --reload`
- Serviço `postgresql-x64-18`: `Running`.
- Serviço `postgresql-x64-17`: `Stopped`.
- Não há evidência de múltiplas instâncias PostgreSQL ativas ao mesmo tempo.

## Checklist para o usuário após reiniciar
- Informar se o sistema abriu normalmente.
- Informar se `Paulo Gustavo ID 13` aparece.
- Informar se `ID 17/18` continuam ausentes.
- Informar se a tela visual bate com o estado oficial.
- Informar o horário aproximado do reinício.

## Critério de sucesso pós-reinício
- Backend continua em `brana_saas`.
- PostgreSQL 18 e porta `5432` permanecem.
- `Paulo Gustavo ID 13` continua existindo.
- `ID 17/18` continuam ausentes.
- `max(clinicas.id)` e `max(usuarios.id)` permanecem coerentes.
- A UI mostra o mesmo estado oficial.

## Critério de falha
- Backend aponta para outro banco.
- `data_directory` muda.
- `Paulo Gustavo ID 13` some.
- `ID 17/18` reaparecem.
- `max` de IDs muda de forma inexplicável.
- A UI diverge do `SELECT`.

## Confirmações de escopo
- Nenhum código alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` não alterado.
- `frontend/index.html` não alterado.
- `frontend/js/modules` não alterado.
- `backend` não alterado.
- `banco`, schema, migrations, seeds e endpoints não alterados.
- Permissões e seeds não alteradas.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Estado-base do banco oficial `brana_saas` registrado antes do reinício do PC/Uvicorn para posterior comparação de estabilidade.
