# 02 - Arquitetura

## Visao geral

O Brana Cloude e uma aplicacao web monolitica em dois blocos:

- Backend FastAPI em `backend/`.
- Frontend estatico em `frontend/`, servido pelo backend.

O banco e PostgreSQL via SQLAlchemy. A autenticacao usa JWT. A separacao por clinica usa `clinica_id`.

## Backend

Ponto de entrada: `backend/main.py`.

Responsabilidades:

- Carregar `backend/.env` com `python-dotenv` antes de importar modulos internos.
- Criar a aplicacao FastAPI.
- Registrar modelos ORM e executar bootstrap de schema quando habilitado.
- Garantir diretorios em `storage/modelos/`.
- Aplicar hotfixes aditivos de schema para usuarios, simbolos e anamnese.
- Registrar routers de `backend/routes/`.
- Configurar CORS local.
- Adicionar `TenantMiddleware` e `TrialMiddleware`.
- Montar `/frontend` e `/desktop-assets`.
- Servir `/app`, `/`, `/favicon.ico` e `/health`.

## Frontend

Arquivos principais:

- `frontend/index.html`: estrutura da interface.
- `frontend/app.js`: logica principal, chamadas HTTP, estado e renderizacao.
- `frontend/prestadores_override.js` e `frontend/prestadores_agenda_*.js`: complementos de prestadores/agenda.
- `frontend/easy_font_dialog.js`: dialogos de fonte.
- `frontend/preferencias_ambiente_patch.js`: ajustes de preferencias.

O frontend chama a API na mesma origem. O token e salvo em `localStorage` como `brana_token`.

## Banco

`backend/database.py` le `DATABASE_URL`, cria `engine`, `SessionLocal` e `Base`. Nao ha migrations formais. O sistema usa `Base.metadata.create_all` em ambiente local quando habilitado e hotfixes aditivos no startup.

## Fluxo de dados

1. Usuario acessa `/app`.
2. Backend entrega HTML/JS/CSS.
3. Frontend chama `POST /login`.
4. Backend valida usuario no PostgreSQL.
5. Backend gera JWT com `user_id`, `clinica_id` e `is_admin`.
6. Frontend envia token nas chamadas seguintes.
7. Backend resolve usuario atual, valida permissao e filtra dados por `clinica_id`.

## Autenticacao

Arquivos principais:

- `backend/routes/auth_routes.py`
- `backend/security/jwt_handler.py`
- `backend/security/dependencies.py`
- `backend/security/hash.py`

`JWT_SECRET_KEY` e obrigatoria. O codigo nao deve ter fallback inseguro para JWT.

## Middlewares

- `TenantMiddleware`: captura `X-Tenant-ID`, mas o isolamento real deve vir de `current_user.clinica_id`.
- `TrialMiddleware`: valida trial/licenca.
- Middlewares de `main.py`: removem cache do frontend e garantem charset UTF-8.

## Bootstrap runtime

Variaveis relevantes:

- `BRANA_RUNTIME_PROFILE`
- `BRANA_ENABLE_SCHEMA_BOOTSTRAP`
- `BRANA_ENABLE_RUNTIME_BOOTSTRAP`
- `BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP`
- `BRANA_ALLOW_SCHEMA_COMPAT_APPLY`
- `BRANA_SKIP_BOOTSTRAP`

Em desenvolvimento, use `BRANA_SKIP_BOOTSTRAP=1` quando quiser evitar rotinas automaticas demoradas.