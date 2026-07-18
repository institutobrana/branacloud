# 08 - Setup e Execucao

## Requisitos

- Windows com PowerShell.
- Python 3.10 ou superior.
- PostgreSQL acessivel localmente ou por rede.
- Credenciais validas para `DATABASE_URL`.

## Criar ambiente virtual

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD"
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

## Configurar ambiente

Crie `backend/.env` a partir do exemplo:

```powershell
Copy-Item .env.example backend\.env
notepad backend\.env
```

Obrigatorias:

```text
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/BANCO
JWT_SECRET_KEY=uma_chave_longa_aleatoria_com_32_ou_mais_caracteres
```

Recomendadas para local:

```text
BRANA_RUNTIME_PROFILE=local
BRANA_ENABLE_SCHEMA_BOOTSTRAP=1
BRANA_ENABLE_RUNTIME_BOOTSTRAP=1
BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP=0
BRANA_ALLOW_SCHEMA_COMPAT_APPLY=0
BRANA_SKIP_BOOTSTRAP=1
```

## Iniciar backend

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD\backend"
..\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Acesse:

- `http://127.0.0.1:8000/app`
- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/docs`

## Como o `.env` e carregado

`backend/main.py` carrega automaticamente `backend/.env` antes de importar o banco e as rotas. Nao e necessario usar `set DATABASE_URL=...` ou `set JWT_SECRET_KEY=...` quando `backend/.env` esta correto.

## Teste minimo

Com o servidor rodando:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/health -UseBasicParsing
```

Depois teste no navegador:

1. Abra `/app`.
2. Faca login com usuario valido do banco.
3. Confirme que `/me` retorna usuario autenticado.
4. Abra uma tela operacional, como pacientes ou agenda.
5. Confirme que nao ha erro 500 em login, `/me` e chamadas basicas.

## Implantacao one-shot de schema

Para banco vazio ou descartavel, o fluxo oficial agora e separado do startup:

```powershell
python backend\scripts\apply_schema_baseline.py --plan
python backend\scripts\apply_schema_baseline.py --apply
python backend\scripts\apply_schema_baseline.py --validate
```

O comando exige:

- `BRANA_RUNTIME_PROFILE` em perfil permitido;
- `BRANA_SCHEMA_DEPLOYMENT_ACK=BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED`;
- autorizacao explicita para localhost quando aplicavel;
- banco vazio ou reconhecido.

O backend permanente continua com bootstrap e compatibilidade automáticos desativados.

## Provisionamento do tenant inicial

Depois da baseline de schema, o primeiro tenant de homologacao deve ser criado por comando separado:

```powershell
python -m backend.scripts.provision_initial_tenant --plan
python -m backend.scripts.provision_initial_tenant --apply
python -m backend.scripts.provision_initial_tenant --validate
```

O contrato do fluxo esta em `docs/contrato_provisionamento_tenant_inicial_aws.md`.

### Contrato por modo

- `--plan`: exige somente os seis identificadores do tenant inicial, nao le senha e nao exige ACK.
- `--apply`: exige os seis identificadores, senha inicial via variavel/secret e ACK explicito.
- `--validate`: exige os seis identificadores, mas nao exige senha original nem ACK.

## Dependencias principais

`backend/requirements.txt` inclui FastAPI, Uvicorn, SQLAlchemy, psycopg2, python-dotenv, Pydantic, python-jose, Passlib, bcrypt, python-multipart, requests, pyHanko, ReportLab, Pillow e pypdf.

## Variaveis opcionais

Autenticacao/codigos: `SIGNUP_CODE_EXP_MINUTES`, `RESET_CODE_EXP_MINUTES`, `PROTECTED_GRANT_EXPIRE_MINUTES`, `OWNER_BYPASS_EMAILS`, `OWNER_MASTER_EMAIL`.

Email: `EMAIL_PROVIDER`, `RESEND_API_KEY`, `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_TLS`, `EMAIL_ATTACHMENT_MAX_MB`.

Integracoes: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GOOGLE_CALENDAR_REDIRECT_URI`, `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_API_BASE`, `MERCADOPAGO_WEBHOOK_URL`, `MERCADOPAGO_BACK_URL`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`.

Assinatura PDF: `BRANA_PDF_SIGN_TSA_URL`, `BRANA_PDF_SIGN_MD_ALG`, `BRANA_PDF_SIGN_REASON`, `BRANA_PDF_SIGN_LOCATION`, `BRANA_PDF_SIGN_CONTACT`, `BRANA_PDF_SIGN_TIMESTAMP_FORMAT`, `BRANA_PDF_SIGN_PROFILE`.

## Antes de commitar

```powershell
git status --short
```

Confirme que nao aparecem `backend/.env`, `.venv/`, `venv/`, dumps, bancos, backups ou arquivos reais de clinica.
