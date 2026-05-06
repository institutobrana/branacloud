# Deploy e execucao - Brana Cloude

## Execucao local do web

Requisitos:

- Python 3.10+.
- PostgreSQL acessivel.
- Variavel `DATABASE_URL`.

Passos:

```powershell
cd "D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO\saas"
python -m venv venv_saas
.\venv_saas\Scripts\pip.exe install -r backend\requirements.txt
cd backend
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
.\..\venv_saas\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Acessos:

- App: `http://127.0.0.1:8000/app`
- Docs API: `http://127.0.0.1:8000/docs`
- Healthcheck: `http://127.0.0.1:8000/health`

## Execucao via arquivo de import

Na raiz existe `saas_app.py`, que adiciona `saas/backend` ao `sys.path` e importa `main.app`. Ele serve como entrada alternativa para ambientes que esperam `app` importavel.

## Deploy Render

Arquivo: `saas/render.yaml`.

Configuracao atual:

- Service name: `brana-saas` (nome historico; ideal renomear para Brana Cloude quando conveniente).
- Runtime: Python.
- Build: `pip install -r backend/requirements.txt`.
- Start: `cd backend && python scripts/aplicar_compatibilidade_schema.py && uvicorn main:app --host 0.0.0.0 --port ${PORT}`.
- Healthcheck: `/health`.
- Python: `3.10.13`.

## Variaveis obrigatorias

- `DATABASE_URL`
- `JWT_SECRET_KEY`

## Variaveis recomendadas

- `BRANA_RUNTIME_PROFILE=prod`
- `BRANA_ENABLE_SCHEMA_BOOTSTRAP=0`
- `BRANA_ENABLE_RUNTIME_BOOTSTRAP=0`
- `BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP=0`
- `BRANA_ALLOW_SCHEMA_COMPAT_APPLY=0`
- `BRANA_SKIP_BOOTSTRAP=1`
- `SIGNUP_CODE_EXP_MINUTES`
- `RESET_CODE_EXP_MINUTES`
- `PROTECTED_GRANT_EXPIRE_MINUTES`
- `OWNER_BYPASS_EMAILS` ou `OWNER_MASTER_EMAIL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_TLS`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- `MERCADOPAGO_ACCESS_TOKEN` e variaveis Mercado Pago

`saas/render.yaml` deve declarar `JWT_SECRET_KEY` com `sync: false`, sem valor real no arquivo.

## `JWT_SECRET_KEY`

Obrigatoria em todos os ambientes.

Regras:

- Deve ser um valor longo, aleatorio e secreto.
- Nao deve ficar em `.env.example`, README, print, chat, commit ou arquivo de deploy.
- Deve ser configurada como secret/env var no Render.
- Ao trocar o valor, todos os tokens JWT emitidos anteriormente deixam de ser validos.

Exemplo para desenvolvimento local:

```powershell
$env:JWT_SECRET_KEY="valor_local_longo_e_aleatorio_com_32_ou_mais_caracteres"
```

## Bootstrap e schema

Politica atual:

- Local: pode rodar `create_all` e bootstrap se flags permitirem.
- Staging/prod: bootstrap automatico deve ficar desativado.
- Migracoes/compatibilidade devem ser scripts manuais, com janela de manutencao.

Scripts importantes:

```powershell
cd "D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO\saas\backend"
python scripts\aplicar_compatibilidade_schema.py
python scripts\executar_bootstrap_runtime_global.py
```

Antes de rodar em producao, confirmar flags, backup e impacto.

## Backups

Scripts:

- `saas/backend/scripts/backup_saas_db.py`
- `saas/backend/scripts/restore_saas_db_backup.py`
- `saas/backend/scripts/restaurar_backup_saas.bat`

Backups e auditorias ficam em `saas/backend/backups/` e `saas/backups/`.

## Storage persistente

`saas/storage/modelos/` guarda modelos e documentos por clinica. Em Render, disco local pode ser efemero se nao houver persistent disk. Confirmar configuracao antes de usar documentos/modelos em producao.

## Execucao desktop legado

O desktop legado roda pela raiz:

```powershell
cd "D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO"
.\venv_py310\Scripts\python.exe main.py
```

Ele usa PySide2, SQLite/Peewee e assets locais. Nao e o deploy web principal.

## Checklist de deploy

1. Verificar `git status` dentro de `saas/`.
2. Remover credenciais locais de arquivos versionados.
3. Garantir `DATABASE_URL`, `JWT_SECRET_KEY` e demais secrets no Render.
4. Rodar backup antes de scripts de schema/dados.
5. Executar scripts manuais apenas com flags corretas.
6. Subir deploy.
7. Validar `/health`.
8. Validar login, `/me`, modulo de licenca e uma rota por modulo critico.
