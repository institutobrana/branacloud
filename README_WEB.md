# Brana Cloude - produto web

Esta pasta contem o produto web atual do Brana Cloude.

## Estrutura

```text
saas/
  backend/        # API FastAPI
  frontend/       # frontend estatico
  assets/         # imagens e icones servidos em /desktop-assets
  local_bridge/   # ponte local para assinatura/arquivos locais
  storage/        # modelos/documentos; pode conter dados de clinica
```

## Runtime local

O frontend nao usa build Vite/React. O backend FastAPI serve:

- `GET /app` -> `frontend/index.html`
- `GET /frontend/*` -> arquivos estaticos do frontend
- `GET /desktop-assets/*` -> arquivos de `saas/assets`

## Requisitos

- Python 3.10+
- PostgreSQL acessivel via `DATABASE_URL`
- `JWT_SECRET_KEY` configurado no ambiente

## Execucao local

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD"
python -m venv venv_saas
.\venv_saas\Scripts\pip.exe install -r backend\requirements.txt
cd backend
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
$env:JWT_SECRET_KEY="valor_local_longo_e_aleatorio_com_32_ou_mais_caracteres"
..\venv_saas\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Acessar:

- App: `http://127.0.0.1:8000/app`
- Docs: `http://127.0.0.1:8000/docs`

## Variaveis obrigatorias

- `DATABASE_URL`
- `JWT_SECRET_KEY`

Use `saas/.env.example` ou a raiz `.env.example` como modelo, sem copiar valores reais para arquivos versionados.

