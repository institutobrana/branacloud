# Auditoria - alternancia de banco apos reinicio com Paulo ID 13 e sumico das contas 17/18

## Contexto
- Antes desta auditoria, a validacao documental registrou que as clinicas `ID 17` e `ID 18` existiam em `brana_saas`, com os usuarios `mileneflor17@gmail.com` e `mileneflor99@gmail.com` persistidos.
- Depois do reinicio do PC e da nova subida do Uvicorn, a interface voltou a mostrar `Paulo Gustavo` com `ID 13`.
- Ao mesmo tempo, as contas recentes `ID 17` e `ID 18` deixaram de aparecer visualmente.
- A hipotese principal era alternancia entre bancos, instancias PostgreSQL, backend/API, porta, `.env`, working directory ou estado de dados diferente.

## Escopo
- Somente leitura.
- Nenhum codigo foi alterado.
- Nenhum dado de banco foi alterado.
- Nenhum script com `--execute` foi executado.
- Nenhuma migration, seed, restore, backup ou reinicio automatico foi feito.

## Processo Uvicorn ativo
- PID ativo na porta `8000`: `9980`.
- Processo ouvido em `8000`: `python.exe` com `uvicorn`.
- Caminho do executavel Python do processo ativo: `C:\Users\Tel\AppData\Local\Programs\Python\Python310\python.exe`.
- Comando observado no processo ativo:
  - `"C:\Users\Tel\AppData\Local\Programs\Python\Python310\python.exe" "D:\BRANA ARQUIVOS\BRANA CLOUD\venv\Scripts\uvicorn.exe" main:app --host 0.0.0.0 --port 8000 --reload`
- Processo filho observado pelo `--reload`: `9852` (`python.exe` com `spawn_main`).
- Porta usada: `8000`.
- Diretorio de trabalho: nao foi exposto diretamente pelos comandos somente leitura disponiveis; o ponto relevante e que o bootstrap de ambiente e resolvido por caminho absoluto em `backend/main.py`.
- Variaveis relevantes observadas/confirmadas pela leitura do repositorio:
  - `DATABASE_URL` em `backend/.env`
  - `GOOGLE_REDIRECT_URI` em `backend/.env`
  - `MERCADOPAGO_*` em `backend/.env`
- Observacao importante: `backend/main.py` carrega `backend/.env` por caminho absoluto relativo ao proprio arquivo, entao a carga do `.env` nao depende do working directory. `backend/database.py` faz `load_dotenv()` generico, mas o processo ja recebeu o `.env` em `main.py` antes da importacao do banco.

## Backend/API acessado
- O frontend usa `window.location.origin` como `baseUrl` e faz `fetch(baseUrl + path)` para as rotas normais.
- Nao foi identificado listener ativo em `5173`; o backend exposto para a UI nesta sessao e o de `8000`.
- Nao foi encontrada evidência de proxy para outro backend na trilha normal de CRUD.
- Existe `LOCAL_BRIDGE_BASE_URL = "http://127.0.0.1:8765"` em `frontend/app.js`, mas ele e usado por funcoes especificas de bridge local, nao pelo fluxo principal de API/CRUD auditado aqui.

## Banco configurado e banco conectado
- URL configurada no backend: `postgresql://postgres:***@localhost:5432/brana_saas`
- Banco efetivamente conectado agora: `brana_saas`
- Usuario do banco: `postgres`
- Host do servidor: `::1`
- Porta do servidor: `5432`
- Versao do servidor: `PostgreSQL 18.3 on x86_64-windows`
- `data_directory`: `C:/Program Files/PostgreSQL/18/data`
- `config_file`: `C:/Program Files/PostgreSQL/18/data/postgresql.conf`
- Timezone: `America/Sao_Paulo`
- Horario da leitura: `2026-05-29 11:19:53-03:00`

## Estado atual do banco ativo

### Clinica ID 13
- Encontrada em `brana_saas`.
- `id`: `13`
- `nome`: `Paulo Gustavo`
- `email`: `pagamentosccb@gmail.com`
- `ativo`: `true`
- `trial_ate`: `2027-05-27 21:12:09.601728`
- `criado_em`: `2026-05-27 14:36:36.671179-03:00`
- `opcoes_sistema_json`: `null`

### Clinica ID 17
- Nao encontrada em `brana_saas`.

### Clinica ID 18
- Nao encontrada em `brana_saas`.

### Usuarios com e-mails de teste
- `mileneflor17@gmail.com`: nao encontrado em `brana_saas`.
- `mileneflor99@gmail.com`: nao encontrado em `brana_saas`.

### Usuario/conta Paulo Gustavo
- Busca por `Paulo`, `Gustavo`, `Paulo Gustavo` e `clinica_id = 13` encontrou:
  - `usuario id 31`, `nome Paulo Gustavo`, `email pagamentosccb@gmail.com`, `clinica_id 13`, `is_admin true`, `setup_completed true`.
- Isso confirma a conta visualmente reaparecida.

### Ultimas clinicas
- Ultimas clinicas por `id` e por `criado_em` em `brana_saas` mostram apenas `15`, `13`, `4` e `1`.
- `max(clinicas.id) = 15`.

### Ultimos usuarios
- Ultimos usuarios por `id` em `brana_saas` chegam ate `36`.
- `max(usuarios.id) = 36`.
- Nenhum usuario `44` ou `45` existe neste banco.

### Plataforma auditoria recente
- Os eventos mais recentes em `plataforma_auditoria` de `brana_saas` sao historicos de `editor_textos` e algumas operacoes antigas de clinica/usuario.
- Nao apareceu evento recente que explique a reentrada visual de `Paulo Gustavo` como uma criacao nova nesta leitura.
- Nao apareceram eventos de criacao/persistencia dos usuarios de teste `mileneflor17@gmail.com` e `mileneflor99@gmail.com` neste banco atual.

## Comparacao entre bancos disponiveis

| Banco | ID13 Paulo | ID17 | ID18 | Milene 17 | Milene 18 | max clinica_id | max usuario_id | Observacao |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| `brana_saas` | sim | nao | nao | nao | nao | 15 | 36 | Banco ativo da aplicacao; contem Paulo ID 13, mas nao contem 17/18 nem usuarios 44/45. |
| `postgres` | nao | nao | nao | nao | nao | n/a | n/a | Banco padrao sem tabelas da aplicacao. |
| `saas_local` | nao | nao | nao | sim | nao | 4 | 12 | Banco separado e antigo; contem `mileneflor17@gmail.com`, mas nao contem Paulo nem 17/18. |

## Multiplas instancias PostgreSQL
- Servico `postgresql-x64-18` esta `Running`.
- Servico `postgresql-x64-17` esta `Stopped`.
- Porta ativa observada: `5432`.
- Nao foi encontrado listener em `5433` ou `5434`.
- Conclusao: ha apenas uma instancia PostgreSQL ativa nesta auditoria, na versao 18, com um unico `data_directory`.

## Comparacao com documentos anteriores
- `docs/validacao_conta_teste_id18_persistencia_signup.md` dizia que `brana_saas` continha a conta `ID 18` com a estrutura inicial esperada.
- `docs/validacao_persistencia_usuarios_c17_c18.md` dizia que `brana_saas` continha as clinicas `17` e `18` e os usuarios `mileneflor17@gmail.com` e `mileneflor99@gmail.com`.
- O estado atual do `brana_saas` nao bate com esses dois documentos:
  - agora a base vai ate `clinica_id 15`;
  - agora o maximo de `usuarios.id` e `36`;
  - os usuarios `44` e `45` nao existem;
  - as clinicas `17` e `18` nao existem.
- O banco alternativo `saas_local` tambem nao contem `17/18` e nao explica o retorno de `Paulo Gustavo`.

## Classificacao final
- `ALT-D` - mesmo banco/data_directory, mas o estado atual diverge de forma incompatível com os registros anteriores.
- `ALT-E` - o estado anterior documentado nao esta mais acessivel no ambiente atual.
- `ALT-A` nao confirmado.
- `ALT-B` nao confirmado.
- `ALT-C` nao suportado pela evidencia atual.

## Conclusao
- `Paulo Gustavo` voltou porque o backend ativo esta apontando para `brana_saas`, e esse banco atual ainda possui a clinica `ID 13`.
- As contas `ID 17` e `ID 18` sumiram porque o `brana_saas` atualmente conectado nao as contem mais.
- Nao foi encontrado nenhum outro banco acessivel no servidor que contenha o par `17/18` ou os usuarios `44/45`.
- O `saas_local` mostra um estado antigo e separado, mas nao e a origem da conta `Paulo Gustavo` nem das clinicas `17/18`.
- O risco de continuar usando o sistema neste estado e alto, porque a sessao atual parece operar sobre um snapshot diferente do que foi validado anteriormente.

## Proxima etapa recomendada
- Parar o uso operacional ate confirmar oficialmente qual banco e o correto.
- Fazer backup dos bancos envolvidos antes de qualquer nova decisao.
- Decidir se o caso e de restauracao/rollback, unificacao ou investigacao de perda de dados.
- Se a operacao precisar continuar, alinhar primeiro o banco oficial e depois retomar a validacao.

## Confirmacoes de escopo
- Nenhum codigo alterado.
- Nenhum dado de banco alterado.
- `frontend/app.js` nao alterado.
- `frontend/index.html` nao alterado.
- `frontend/js/modules` nao alterado.
- `backend` nao alterado.
- `schema`, migrations, seeds e endpoints nao alterados.
- Permissoes e seeds nao alteradas.
- Blindagem textual/mojibake respeitada.

## Registro para roadmap
- Auditoria de alternancia de banco apos reinicio concluida, com `Paulo Gustavo` `ID 13` visivel no banco ativo `brana_saas`, `ID 17/18` ausentes e sem evidencia de frontend apontando para backend diferente.
