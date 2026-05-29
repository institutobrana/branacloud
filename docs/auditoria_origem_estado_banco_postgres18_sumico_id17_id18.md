# Auditoria - origem do estado do banco PostgreSQL 18 apos sumico de ID 17/18

## Contexto
- Antes desta auditoria, documentos anteriores registraram por `SELECT` que as clinicas `ID 17` e `ID 18` existiam em `brana_saas`, com os usuarios `mileneflor17@gmail.com` e `mileneflor99@gmail.com` persistidos.
- Depois do reinicio do PC e da nova subida do Uvicorn, a interface voltou a mostrar `Paulo Gustavo` com `ID 13`.
- No estado atual, `ID 17` e `ID 18` nao aparecem mais visualmente nem no banco ativo consultado.
- A auditoria anterior ja havia apontado `ALT-D` e `ALT-E`.
- O uso operacional do sistema permanece pausado ate definicao do banco correto e do plano de recuperacao.

## Escopo
- Somente leitura.
- Nenhum codigo foi alterado.
- Nenhum dado de banco foi alterado.
- Nenhum restore, importacao, migration, seed ou reinicio de servico foi executado.

## Contradicao documental
- `docs/validacao_persistencia_usuarios_c17_c18.md` registrou por `SELECT`:
  - clinica `ID 18` com `Gleisson` e `tel.meinberg.odonto@gmail.com`.
  - clinica `ID 17` com o usuario `TESTE` e `mileneflor17@gmail.com`.
  - usuarios `id 44` e `id 45` persistidos no `brana_saas`.
  - classificacao `PERSIST-USERS-A`.
- `docs/validacao_conta_teste_id18_persistencia_signup.md` registrou por `SELECT`:
  - a conta teste `ID 18` em `brana_saas`.
  - usuario ADM `id 43` e usuario sistemico `id 42`.
  - `created_at`/`criado_em` da clinica `ID 18` em `2026-05-29 06:40:53-03:00`.
- `docs/auditoria_banco_pos_reinicio_unicorn_dados_nao_persistidos.md` registrou:
  - `DATABASE_URL=postgresql://postgres:1234@localhost:5432/brana_saas`.
  - o banco alternativo `brana_saas_test`.
- `docs/auditoria_fluxos_persistencia_usuario_signup_opcoes.md` registrou o risco de sobrescrita de `opcoes_sistema_json` por estado local antigo.
- O estado atual contradiz esses documentos porque `brana_saas` nao contem mais `ID 17`, `ID 18`, `id 44` e `id 45`.

## Identidade PostgreSQL atual
- `current_database()`: `brana_saas`
- `current_user`: `postgres`
- `inet_server_addr()`: `::1`
- `inet_server_port()`: `5432`
- `version()`: `PostgreSQL 18.3 on x86_64-windows`
- `now()`: `2026-05-29 11:28:40-03:00` aproximadamente no momento da leitura
- `data_directory`: `C:/Program Files/PostgreSQL/18/data`
- `config_file`: `C:/Program Files/PostgreSQL/18/data/postgresql.conf`
- `hba_file`: `C:/Program Files/PostgreSQL/18/data/pg_hba.conf`
- `external_pid_file`: vazio
- `pg_postmaster_start_time()`: `2026-05-29 09:46:11.904635-03:00`

## Estado atual do `brana_saas`
- Tamanho do banco: `44 MB`
- Tabelas principais encontradas:
  - `access_profile`
  - `clinicas`
  - `plataforma_auditoria`
  - `prestador_odonto`
  - `unidade_atendimento`
  - `usuario_perfil_acesso`
  - `usuarios`
- Contagens:
  - `clinicas = 4`
  - `usuarios = 14`
  - `prestador_odonto = 10`
  - `unidade_atendimento = 3`
  - `usuario_perfil_acesso = 0`
  - `access_profile = 20`
  - `plataforma_auditoria = 46`
- Maximos:
  - `max(clinicas.id) = 15`
  - `max(usuarios.id) = 36`
- Sequencias:
  - `clinicas_id_seq`: `last_value = 15`, `is_called = true`
  - `usuarios_id_seq`: `last_value = 37`, `is_called = true`
- Ultimas clinicas por `id` e por `criado_em` mostram apenas `15`, `13`, `4` e `1`.
- Ultimos usuarios por `id` chegam ate `36`.
- Buscas:
  - `Paulo Gustavo` / `pagamentosccb@gmail.com`: encontrado como clinica `ID 13` e usuario `id 31`.
  - `mileneflor17@gmail.com`: nao encontrado no `brana_saas`.
  - `mileneflor99@gmail.com`: nao encontrado no `brana_saas`.
  - `tel.meinberg.odonto@gmail.com`: nao encontrado no `brana_saas`.
  - `institutobrana@gmail.com`: encontrado no `brana_saas` na clinica `ID 15`.
  - `Paulo`, `Gustavo`, `clinica_id = 13`: encontrado.
- `plataforma_auditoria` nao trouxe evento recente que explique o retorno visual de `Paulo Gustavo` como nova criacao nesta leitura.

## Logs PostgreSQL
- Arquivos consultados:
  - `C:/Program Files/PostgreSQL/18/data/log/postgresql-2026-05-29_094611.log`
  - `C:/Program Files/PostgreSQL/18/data/log/postgresql-2026-05-28_000000.log`
  - `C:/Program Files/PostgreSQL/18/data/log/postgresql-2026-04-15_174432.log`
- Achados:
  - `postgresql-2026-05-29_094611.log` mostra apenas checkpoints do cluster ja em execucao.
  - `postgresql-2026-05-28_000000.log` registra `checkpoint starting: shutdown immediate`, indicando desligamento limpo do cluster antes do reinicio.
  - `postgresql-2026-04-15_174432.log` registra o comando `CREATE DATABASE brana_saas;` e tambem erro de banco ja existente em um ponto anterior.
- Nao encontrei prova direta de `restore`, `pg_restore`, `DROP DATABASE`, `ALTER DATABASE`, `recovery` ou importacao nesta leitura dos logs consultados.
- Nao apareceu evidencia textual direta do momento exato em que o estado atual teria sido restaurado ou recriado.

## Dumps, backups e exports encontrados
- Artefatos relevantes localizados em leitura:
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\LEIA_NO_PC_NOVO_ASSISTENTE.txt`
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260313_234848.zip`
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\brana_saas_full_20260313_234848\metadata.json`
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\pre_restore_pg18_brana_saas_20260416_160922.dump`
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\source_pg17_brana_saas_20260416_160922.dump`
  - `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\single_account_cleanup_20260304_203803.json`
  - `C:\Users\Tel\Documents\backup_precificacao_2026-02-12_16-19.db`
- Marcadores observados em leitura textual:
  - `LEIA_NO_PC_NOVO_ASSISTENTE.txt` descreve backup completo, script de restore e comando de restauracao.
  - `metadata.json` dos pacotes antigos cita `restore_order` e orienta usar `restore_saas_db_backup.py`.
  - `single_account_cleanup_20260304_203803.json` contem `mileneflor17@gmail.com` em um snapshot antigo.
- Nao encontrei, nos artefatos textuais lidos, um dump/backup acessivel contendo os marcadores `ID 17`, `ID 18`, `mileneflor99@gmail.com`, `id 44` ou `id 45`.
- Os arquivos `pre_restore_pg18_brana_saas_20260416_160922.dump` e `source_pg17_brana_saas_20260416_160922.dump` existem por nome e sao forte indicio de transicao entre clusters/estados, mas nao foram importados nem abertos para restauracao.

## PostgreSQL 17 parado
- O servico `postgresql-x64-17` esta parado.
- O diretorio `C:\Program Files\PostgreSQL\17\data` existe.
- O diretório possui arquivos de configuracao e log visiveis por listagem.
- O diretorio `C:\Program Files\PostgreSQL\17\data\log` tambem existe e guarda varios logs historicos.
- Nao foi iniciado nenhum servico da versao 17.
- Nao houve copia, restore ou leitura destrutiva dos arquivos binarios do cluster 17.

## Scripts e documentos de restore
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\scripts\restore_saas_db_backup.py`
  - faz load do `.env`, resolve backup `.zip` ou diretorio, carrega `metadata.json`, trunca tabelas, copia CSVs e reajusta sequences.
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\scripts\restaurar_backup_saas.bat`
  - wrapper para restauracao simplificada.
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\scripts\backup_saas_db.py`
  - gerador dos pacotes de backup.
- `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO_LEGADO\saas\backend\backups\LEIA_NO_PC_NOVO_ASSISTENTE.txt`
  - instrucoes de migracao/restauracao do backup completo.
- A existencia desses artefatos confirma que o projeto ja teve fluxo formal de backup/restore, embora isso nao prove que o estado atual tenha sido restaurado agora.

## Comparacao entre bancos

| Banco | ID13 Paulo | ID17 | ID18 | Milene 17 | Milene 99 | max clinica_id | max usuario_id | Observacao |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| `brana_saas` | sim | nao | nao | nao | nao | 15 | 36 | Banco ativo atual; contem Paulo ID 13 e nao contem 17/18 nem usuarios 44/45. |
| `saas_local` | nao | nao | nao | sim | nao | 4 | 12 | Banco separado e antigo; contem `mileneflor17@gmail.com`, mas nao explica Paulo nem 17/18. |
| `postgres` | nao | nao | nao | nao | nao | n/a | n/a | Banco padrao sem tabelas da aplicacao. |

## Classificacao final
- `REST-B`: snapshot/estado diferente muito provavel, sem prova direta de restore.
- `REST-D`: banco anterior nao localizado no ambiente atual.
- `REST-E`: existem indicios em arquivos do cluster PostgreSQL 17, mas ele nao foi iniciado.
- `USO-PAUSAR`: o uso operacional deve permanecer pausado.

## Conclusao
- Nao ha prova direta de um restore no log consultado, mas ha forte incompatibilidade entre os SELECTs anteriores e o estado atual do `brana_saas`.
- O estado atual mostra `Paulo Gustavo ID 13`, mas nao mostra `ID 17`, `ID 18`, `id 44` ou `id 45`.
- Os arquivos antigos de backup e os nomes de dump sugerem transicao entre estados/versoes, inclusive com material relacionado a `pg17` e `pg18`.
- Nao foi localizado, no ambiente acessivel agora, um banco/dump que reponha os dados documentados de `ID 17/18` e `usuarios 44/45`.
- A hipotese mais provavel e de estado diferente/snapshot/restauracao indireta ou substituicao do ambiente, mas sem prova textual direta do evento.
- O risco de continuar usando o sistema operacionalmente agora e alto.

## Proxima etapa recomendada
- Manter o uso operacional pausado.
- Definir oficialmente qual banco e o correto.
- Fazer backup dos bancos envolvidos antes de qualquer outra decisao.
- Se necessario, investigar logs externos, Event Viewer, backups fora do disco local ou o cluster PostgreSQL 17 em ambiente controlado.
- Nao executar restore nem importacao sem aprovacao explicita.

## Confirmacoes de escopo
- Nenhum codigo alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- `backend` nao alterado.
- `schema`, migrations, seeds, endpoints e permissoes nao alterados.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Auditoria da origem do estado do banco PostgreSQL 18 concluida, com contradicao entre documentos antigos e o `brana_saas` atual, sem prova direta de restore, sem localizacao dos dados `ID 17/18` e com uso operacional mantido em pausa.
