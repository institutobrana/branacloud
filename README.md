# Brana Cloude

Brana Cloude e um sistema web de gestao odontologica para clinicas. O backend e FastAPI, o frontend e estatico e o banco de dados e PostgreSQL via `DATABASE_URL`.

O nome oficial do projeto e Brana Cloude. Termos como SaaS podem aparecer em codigo antigo, comentarios ou nomes historicos, mas nao devem ser usados como nome oficial.

## Como rodar em 3 passos

1. Entrar na pasta e preparar Python:

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD"
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

2. Criar e editar o ambiente local:

```powershell
Copy-Item .env.example backend\.env
notepad backend\.env
```

Configure no minimo:

```text
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/BANCO
JWT_SECRET_KEY=uma_chave_longa_aleatoria_com_32_ou_mais_caracteres
```

3. Subir o backend:

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD\backend"
..\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Acesse `http://127.0.0.1:8000/app`.

## Links rapidos

- Guia principal: `docs/00_master_guide.md`
- Setup detalhado: `docs/08_setup_execucao.md`
- Mapa do codigo: `docs/03_mapa_codigo.md`
- Seguranca: `docs/06_seguranca.md`
- Continuidade: `docs/10_continuidade.md`

## Estrutura

```text
backend/              API FastAPI, modelos, rotas, servicos e scripts
frontend/             interface web estatica servida pelo backend
assets/               imagens e assets usados pela interface
local_bridge/         ponte local para integracoes com aplicativos locais
storage/modelos/base/ modelos documentais base
docs/                 documentacao oficial atual
```

## Entrypoint

- Aplicacao backend: `backend/main.py`
- Banco: `backend/database.py`
- Frontend: `frontend/index.html` e `frontend/app.js`
- Ambiente local: `backend/.env`

`backend/main.py` carrega automaticamente `backend/.env`. Nao e necessario usar `set DATABASE_URL=...` ou `set JWT_SECRET_KEY=...` quando o arquivo esta configurado corretamente.

## Seguranca basica

Nunca versionar:

- `backend/.env`
- `.env` ou `.env.*`
- `.venv/` ou `venv/`
- bancos, dumps, backups ou logs
- `Dados/`
- `storage/modelos/clinicas/`
- documentos, PDFs, planilhas ou imagens com dados reais

Toda rota operacional deve autenticar usuario, validar permissao e filtrar dados por `current_user.clinica_id`.