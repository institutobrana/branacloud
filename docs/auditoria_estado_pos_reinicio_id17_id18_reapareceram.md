# Auditoria - estado pós-reinício com ID 17/18 reaparecendo

## Contexto
- O estado-base pré-reinício foi documentado em `docs/teste_estabilidade_banco_pre_reinicio_estado_base.md`.
- Após reiniciar o PC e o Uvicorn, `ID 17` e `ID 18` reapareceram visualmente.
- A conta `ID 15` sumiu visualmente.
- O objetivo desta etapa foi capturar o estado vivo antes de qualquer novo reinício.

## Escopo
- Somente leitura.
- Nenhum código foi alterado.
- Nenhum dado de banco foi alterado.
- Nenhum backup foi restaurado.
- Nenhum serviço foi reiniciado pelo Codex.

## Comando usado pelo usuário
```text
cd /d "D:\BRANA ARQUIVOS\BRANA CLOUD"
venv\Scripts\activate
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Processos e portas
- Uvicorn ativo:
  - PID principal observado: `9344`
  - Processo pai/reloader observado: `16924`
  - Processo filho observado: `4752`
  - Comando principal:
    - `"C:\Users\Tel\AppData\Local\Programs\Python\Python310\python.exe" "D:\BRANA ARQUIVOS\BRANA CLOUD\venv\Scripts\uvicorn.exe" main:app --host 0.0.0.0 --port 8000 --reload`
  - Diretório inferido: `D:\BRANA ARQUIVOS\BRANA CLOUD\backend`
  - Porta: `8000`
  - Há apenas um Uvicorn ativo nesta leitura.
- PostgreSQL ativo:
  - Porta `5432` escutando no PID `6448`
  - Serviço `postgresql-x64-17` em `Running`
  - Serviço `postgresql-x64-18` em `Stopped`
  - Não há evidência de múltiplas instâncias PostgreSQL ativas ao mesmo tempo

## Identidade PostgreSQL atual
- `current_database()`: `brana_saas`
- `current_user`: `postgres`
- `inet_server_addr()`: `::1`
- `inet_server_port()`: `5432`
- `version()`: `PostgreSQL 17.8 on x86_64-windows, compiled by msvc-19.44.35222, 64-bit`
- `data_directory`: `C:/Program Files/PostgreSQL/17/data`
- `config_file`: `C:/Program Files/PostgreSQL/17/data/postgresql.conf`
- `hba_file`: `C:/Program Files/PostgreSQL/17/data/pg_hba.conf`
- `pg_postmaster_start_time()`: `2026-05-29 13:39:29.635738-03`
- `now()`: `2026-05-29 13:47:02.755852-03`

## Estado atual

### Clínica ID 13
- Não encontrada no estado atual.

### Clínica ID 15
- Não encontrada no estado atual.

### Clínica ID 17
- Encontrada.
- `id`: `17`
- `nome`: `Tel`
- `email`: `institutobrana@gmail.com`
- `ativo`: `true`
- `criado_em`: `2026-05-26 18:32:17.857708-03`
- `trial_ate`: `2026-06-02 21:32:17.863133`

### Clínica ID 18
- Encontrada.
- `id`: `18`
- `nome`: `Gleisson`
- `email`: `tel.meinberg.odonto@gmail.com`
- `ativo`: `true`
- `criado_em`: `2026-05-29 06:40:53.676399-03`
- `trial_ate`: `2026-06-05 09:40:53.684724`

### Usuários 44 e 45
- `id 44` encontrado:
  - `nome`: `TESTE`
  - `email`: `mileneflor17@gmail.com`
  - `clinica_id`: `17`
  - `ativo`: `true`
  - `is_admin`: `false`
  - `is_system_user`: `false`
- `id 45` encontrado:
  - `nome`: `Milene Flor`
  - `email`: `mileneflor99@gmail.com`
  - `clinica_id`: `18`
  - `ativo`: `true`
  - `is_admin`: `false`
  - `is_system_user`: `false`

### E-mails buscados
- `mileneflor17@gmail.com`: encontrado no usuário `44`.
- `mileneflor99@gmail.com`: encontrado no usuário `45`.
- `tel.meinberg.odonto@gmail.com`: encontrado na clínica `18` e no usuário `43`.
- `pagamentosccb@gmail.com`: não encontrado.

### Máximos
- `max(clinicas.id) = 18`
- `max(usuarios.id) = 45`

### Contagens
- Total de clínicas: `4`
- Total de usuários: `15`
- Total de prestadores: `9`
- Total de unidade_atendimento: `3`
- Total de access_profile: `40`
- Total de plataforma_auditoria: `57`

### Últimas 20 clínicas por ID
- `18:Gleisson`
- `17:Tel`
- `4:Alisson Cristóvão Butarelo`
- `1:Instuto Brana - Odontologia`

### Últimos 20 usuários por ID
- `45:Milene Flor:mileneflor99@gmail.com`
- `44:TESTE:mileneflor17@gmail.com`
- `43:Gleisson:tel.meinberg.odonto@gmail.com`
- `42:Clínica:clinica.255.c18@system.brana.local`
- `40:Tel:institutobrana@gmail.com`
- `39:Clínica:clinica.255.c17@system.brana.local`
- `12:Adriana Sadôco Ferraz Jascinto:adrianasadocoferrazj.260.c1@local.brana`
- `11:Brenda:brenda.259.c1@local.brana`
- `10:Milene Flor:mileneflor.258.c1@local.brana`
- `9:Jozicler Teodoro Sampaio:joziclerteosampaio1981@gmail.com`
- `8:Alisson Cristovão Butarelo:alissoncristovaobuta.256.c1@local.brana`
- `7:Clínica:clinica.255.c4@system.brana.local`
- `5:Clínica:clinica.255.c1@system.brana.local`
- `4:Alisson Cristóvão Butarelo:a.butarelo@gmail.com`
- `1:Gleisson Tel:gleissontel@gmail.com`

### Últimos 30 eventos em plataforma_auditoria
- `57|1|gleissontel@gmail.com|editor_textos.abrir_pdf_preparado_app|editor_textos_pdf|Adib Miguel Filho 24-05-2026_20260524_151737.pdf|2026-05-24 15:17:37.967224-03`
- `56|1|gleissontel@gmail.com|editor_textos.preparar_pdf_app|editor_textos_pdf|Adib Miguel Filho 24-05-2026_20260524_151737.pdf|2026-05-24 15:17:37.938965-03`
- `55|1|gleissontel@gmail.com|editor_textos.exportar_pdf|editor_textos_pdf|Adib Miguel Filho 24-05-2026.pdf|2026-05-24 15:17:27.220207-03`
- `54|1|gleissontel@gmail.com|editor_textos.abrir_pdf_preparado_app|editor_textos_pdf|Adib Miguel Filho 24-05-2026_20260524_125508.pdf|2026-05-24 12:55:08.302914-03`
- `53|1|gleissontel@gmail.com|editor_textos.preparar_pdf_app|editor_textos_pdf|Adib Miguel Filho 24-05-2026_20260524_125508.pdf|2026-05-24 12:55:08.260034-03`
- `52|1|gleissontel@gmail.com|editor_textos.exportar_pdf|editor_textos_pdf|Adib Miguel Filho 24-05-2026.pdf|2026-05-24 12:54:58.891731-03`
- `51|1|gleissontel@gmail.com|clinica_trial_extend|clinica|8|2026-05-15 12:29:04.838618-03`
- `50|1|gleissontel@gmail.com|editor_textos.abrir_pdf_preparado|editor_textos_pdf|Ademir Cavalaro Junior 26-04-2026_20260426_194015.pdf|2026-04-26 19:40:15.696729-03`
- `49|1|gleissontel@gmail.com|editor_textos.preparar_pdf_acrobat|editor_textos_pdf|Ademir Cavalaro Junior 26-04-2026_20260426_194015.pdf|2026-04-26 19:40:15.655746-03`
- `48|1|gleissontel@gmail.com|editor_textos.exportar_pdf|editor_textos_pdf|Ademir Cavalaro Junior 26-04-2026.pdf|2026-04-26 19:40:09.927821-03`
- `47|1|gleissontel@gmail.com|editor_textos.abrir_pdf_preparado|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026_20260426_184337.pdf|2026-04-26 18:43:37.824778-03`
- `46|1|gleissontel@gmail.com|editor_textos.preparar_pdf_acrobat|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026_20260426_184337.pdf|2026-04-26 18:43:37.791888-03`
- `45|1|gleissontel@gmail.com|editor_textos.exportar_pdf|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026.pdf|2026-04-26 18:43:30.796268-03`
- `44|1|gleissontel@gmail.com|editor_textos.abrir_pdf_preparado|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026_20260426_184143.pdf|2026-04-26 18:41:43.478825-03`
- `43|1|gleissontel@gmail.com|editor_textos.preparar_pdf_acrobat|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026_20260426_184143.pdf|2026-04-26 18:41:43.414222-03`
- `42|1|gleissontel@gmail.com|editor_textos.exportar_pdf|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026.pdf|2026-04-26 18:41:32.213265-03`
- `41|1|gleissontel@gmail.com|editor_textos.abrir_pdf_preparado|editor_textos_pdf|Adilson Aparecido Camargo 26-04-2026_20260426_181533.pdf|2026-04-26 18:15:33.233262-03`
- `40|1|gleissontel@gmail.com|editor_textos.preparar_pdf_acrobat|editor_textos_pdf|Adilson Aparecido Camargo 26-04-2026_20260426_181533.pdf|2026-04-26 18:15:33.19694-03`
- `39|1|gleissontel@gmail.com|editor_textos.exportar_pdf|editor_textos_pdf|Adilson Aparecido Camargo 26-04-2026.pdf|2026-04-26 18:15:27.732003-03`
- `38|1|gleissontel@gmail.com|editor_textos.abrir_pdf_preparado|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026_20260426_170020.pdf|2026-04-26 17:00:20.684153-03`
- `37|1|gleissontel@gmail.com|editor_textos.preparar_pdf_acrobat|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026_20260426_170020.pdf|2026-04-26 17:00:20.650972-03`
- `36|1|gleissontel@gmail.com|editor_textos.exportar_pdf|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026.pdf|2026-04-26 17:00:06.265616-03`
- `35|1|gleissontel@gmail.com|editor_textos.abrir_pdf_preparado|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026_20260426_165216.pdf|2026-04-26 16:52:17.023919-03`
- `34|1|gleissontel@gmail.com|editor_textos.preparar_pdf_acrobat|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026_20260426_165216.pdf|2026-04-26 16:52:16.988556-03`
- `33|1|gleissontel@gmail.com|editor_textos.exportar_pdf|editor_textos_pdf|Ademar Ribeiro de Oliveira 26-04-2026.pdf|2026-04-26 16:52:06.194495-03`
- `32|1|gleissontel@gmail.com|editor_textos.abrir_pdf_preparado|editor_textos_pdf|Adenirce Rocha de Freiria 26-04-2026_20260426_164730.pdf|2026-04-26 16:47:51.663284-03`
- `31|1|gleissontel@gmail.com|editor_textos.preparar_pdf_acrobat|editor_textos_pdf|Adenirce Rocha de Freiria 26-04-2026_20260426_164730.pdf|2026-04-26 16:47:30.851565-03`
- `30|1|gleissontel@gmail.com|editor_textos.exportar_pdf|editor_textos_pdf|Adenirce Rocha de Freiria 26-04-2026.pdf|2026-04-26 16:47:28.76339-03`

## Comparação com o estado-base

| Item | Estado-base pré-reinício | Estado atual pós-reinício |
|---|---|---|
| `current_database` | `brana_saas` | `brana_saas` |
| `data_directory` | `C:/Program Files/PostgreSQL/18/data` | `C:/Program Files/PostgreSQL/17/data` |
| `config_file` | `C:/Program Files/PostgreSQL/18/data/postgresql.conf` | `C:/Program Files/PostgreSQL/17/data/postgresql.conf` |
| `pg_postmaster_start_time` | `2026-05-29 09:46:11.904635-03` | `2026-05-29 13:39:29.635738-03` |
| `ID 13` | presente | ausente |
| `ID 15` | presente | ausente |
| `ID 17` | ausente | presente |
| `ID 18` | ausente | presente |
| `usuários 44/45` | ausentes | presentes |
| `max clinica_id` | `15` | `18` |
| `max usuario_id` | `36` | `45` |
| `total clínicas` | `4` | `4` |
| `total usuários` | `14` | `15` |

## Comparação entre bancos

| Banco | data_directory | total clínicas | max clínica | total usuários | max usuário | ID13 | ID15 | ID17 | ID18 | user44 | user45 | mileneflor17 | mileneflor99 | observação |
|---|---|---:|---:|---:|---:|---|---|---|---|---|---|---|---|---|
| `brana_saas` | `C:/Program Files/PostgreSQL/17/data` | `4` | `18` | `15` | `45` | não | não | sim | sim | sim | sim | sim | sim | Banco atual do backend, agora no PostgreSQL 17; contém o estado reaparecido. |
| `brana_saas_test` | `C:/Program Files/PostgreSQL/17/data` | `2` | `3` | `4` | `6` | não | não | não | não | não | não | não | não | Banco de teste separado; não explica o estado reaparecido. |
| `postgres` | `C:/Program Files/PostgreSQL/17/data` | `0` | n/a | `0` | n/a | não | não | não | não | não | não | não | não | Banco padrão, sem tabelas do Brana. |
| `saas_local` | ausente no cluster atual | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | Não existe neste cluster atual. |

## Teste localhost/127.0.0.1/::1
- `localhost`: `brana_saas`, `::1`, `5432`, `C:/Program Files/PostgreSQL/17/data`
- `127.0.0.1`: `brana_saas`, `127.0.0.1`, `5432`, `C:/Program Files/PostgreSQL/17/data`
- `::1`: `brana_saas`, `::1`, `5432`, `C:/Program Files/PostgreSQL/17/data`
- Conclusão: os três hosts apontam para o mesmo PostgreSQL 17 e para o mesmo `data_directory`.

## Classificação
- `EST-C`: o estado atual pós-reinício difere do estado-base e o `data_directory` / `config_file` mudaram.

## Conclusão
- O estado mudou após o reinício.
- O `data_directory` mudou de PostgreSQL 18 para PostgreSQL 17.
- O backend continua conectando ao banco `brana_saas`, mas agora o banco está no cluster PostgreSQL 17.
- Não existe diferença entre `localhost`, `127.0.0.1` e `::1`; todos levam ao mesmo estado.
- Não é seguro reiniciar novamente sem antes entender por que o cluster ativo passou para PostgreSQL 17.
- A hipótese mais provável é troca de cluster/instância, com o serviço PostgreSQL 17 assumindo o papel do banco ativo.

## Próxima etapa recomendada
- Não reiniciar novamente até entender a causa.
- Investigar por que o PostgreSQL 17 passou a ser o ativo e por que o PostgreSQL 18 ficou parado.
- Se necessário no futuro, capturar cópia lógica com `pg_dump` somente com autorização explícita em etapa separada.

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
- Auditoria pós-reinício concluída com `ID 17/18` reaparecendo visualmente, `ID 15` sumindo visualmente e `data_directory` migrando para PostgreSQL 17.
