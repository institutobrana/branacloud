# 00 - Master Guide

## Para que serve este arquivo

Este e o ponto de entrada oficial do Brana Cloude. Comece por aqui sempre que for desenvolver, auditar, corrigir bug ou orientar outra IA.

Meta operacional:

- Rodar o sistema em ate 10 minutos, se Python, PostgreSQL e credenciais ja existirem.
- Entender a arquitetura em menos de 1 hora.
- Saber onde mexer e onde nao mexer sem cuidado.

O codigo atual e a fonte da verdade. Documentos antigos ficam em `docs/_historico_auditoria/` apenas para consulta.

## Como comecar em 5 minutos

1. Abra a pasta do projeto:

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD"
```

2. Leia os arquivos certos:

```text
README.md
AGENTS.md
docs/00_master_guide.md
docs/03_mapa_codigo.md
docs/06_seguranca.md
```

3. Localize os pontos principais:

```text
backend/main.py        entrypoint do backend
backend/database.py    conexao PostgreSQL
backend/routes/        endpoints da API
backend/models/        tabelas SQLAlchemy
frontend/app.js        logica principal do frontend
```

4. Confirme ambiente:

```text
backend/.env precisa ter DATABASE_URL e JWT_SECRET_KEY
```

5. Suba o servidor:

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD\backend"
..\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

## Como rodar do zero

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD"
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
Copy-Item .env.example backend\.env
notepad backend\.env
```

Configure no minimo:

```text
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/BANCO
JWT_SECRET_KEY=uma_chave_longa_aleatoria_com_32_ou_mais_caracteres
```

Inicie:

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD\backend"
..\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Acesse:

- App: `http://127.0.0.1:8000/app`
- Healthcheck: `http://127.0.0.1:8000/health`
- Swagger: `http://127.0.0.1:8000/docs`

## Ordem de leitura obrigatoria

Para entender rapido:

1. `README.md`
2. `docs/00_master_guide.md`
3. `docs/03_mapa_codigo.md`
4. `docs/06_seguranca.md`
5. `docs/07_fluxos.md`
6. `docs/10_continuidade.md`

Para mexer no banco:

1. `docs/05_banco_dados.md`
2. `backend/models/`
3. `backend/database.py`
4. scripts relevantes em `backend/scripts/`

Para mexer em funcionalidade:

1. `docs/04_funcionalidades.md`
2. rota em `backend/routes/`
3. modelo em `backend/models/`
4. servico em `backend/services/`, se existir
5. tela/fluxo em `frontend/app.js`

## Mapa mental do sistema

```text
Navegador
  -> GET /app
  -> backend/main.py serve frontend/index.html
  -> frontend/app.js chama API com fetch
  -> POST /login gera JWT
  -> localStorage guarda brana_token
  -> chamadas autenticadas enviam Authorization: Bearer <token>
  -> backend/security/dependencies.py resolve usuario
  -> backend/routes/* valida permissao e clinica_id
  -> backend/database.py abre sessao SQLAlchemy
  -> PostgreSQL persiste dados
```

## Tempo estimado para entender

- 10 minutos: rodar projeto e identificar entrypoints.
- 20 minutos: entender login, token e `/me`.
- 40 minutos: entender rotas, models e `clinica_id`.
- 60 minutos: conseguir implementar uma alteracao pequena com cuidado.

## Fluxo resumido

Login:

```text
frontend/app.js -> POST /login -> auth_routes.py -> usuarios no banco -> jwt_handler.py -> token
```

Uso autenticado:

```text
frontend/app.js -> endpoint com Bearer token -> get_current_user -> require_module_access -> rota -> SQLAlchemy -> PostgreSQL
```

Persistencia:

```text
routes/* -> SessionLocal -> models/* -> commit/refresh -> JSON response
```

## Regras de ouro

- Nunca versionar `backend/.env`, `.env`, `.venv/`, `venv/`, bancos, dumps, backups, `Dados/` ou `storage/modelos/clinicas/`.
- Toda rota operacional deve autenticar, validar permissao e filtrar por `current_user.clinica_id`.
- Nao confiar em `clinica_id` vindo do frontend.
- Nao alterar banco sem plano de migration.
- `frontend/app.js` e monolitico; altere com cuidado.
- Nao mudar autenticacao, JWT, banco ou middleware junto com refatoracao visual.

## Estado atual

A pasta atual esta separada para o projeto web. Ainda existem nomes historicos no codigo, como `Brana SaaS`, `SAAS_DIR` e comentarios sobre SaaS. O nome oficial em documentacao e comunicacao deve ser sempre Brana Cloude.