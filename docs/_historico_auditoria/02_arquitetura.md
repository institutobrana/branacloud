# Arquitetura - Brana Cloude

## Visao em camadas

Brana Cloude e composto por:

- Frontend estatico: `saas/frontend/index.html` e `saas/frontend/app.js`.
- API FastAPI: `saas/backend/main.py`.
- Banco PostgreSQL: configurado por `DATABASE_URL`.
- ORM SQLAlchemy: modelos em `saas/backend/models/`.
- Servicos de dominio: `saas/backend/services/`.
- Rotas HTTP: `saas/backend/routes/`.
- Seguranca: `saas/backend/security/`.
- Armazenamento local de modelos/documentos: `saas/storage/modelos/`.
- Scripts operacionais/migracao: `saas/backend/scripts/`.

## Fluxo de runtime

1. O navegador acessa `/` e e redirecionado para `/app`.
2. `/app` entrega `saas/frontend/index.html`.
3. O HTML carrega `saas/frontend/app.js` e outros arquivos estaticos por `/frontend/*`.
4. O frontend chama a API FastAPI via `fetch`.
5. O login retorna JWT.
6. Requisicoes autenticadas usam `Authorization: Bearer <token>`.
7. Middlewares validam tenant, trial/licenca e charset/cache.
8. Rotas usam SQLAlchemy para ler/escrever no PostgreSQL.
9. Modelos de documento e arquivos temporarios sao lidos/escritos em `saas/storage` e `saas/backend/tmp`.

## Backend

O ponto principal e `saas/backend/main.py`. Ele:

- Cria `FastAPI(title="Brana SaaS", version="1.0.0")`; o titulo deve ser renomeado para Brana Cloude.
- Importa todos os modelos para registrar metadata.
- Decide politicas de bootstrap via `services/runtime_profile_service.py`.
- Executa `Base.metadata.create_all` apenas quando a politica permite.
- Registra rotas de autenticacao, cadastros, agenda, financeiro, materiais, procedimentos, documentos, licenca, administracao e superadmin.
- Monta `/frontend` e `/desktop-assets`.
- Expoe `/health`.

## Frontend

O frontend principal nao usa build Vite/React. E uma aplicacao estatico-monolitica em:

- `saas/frontend/index.html`: estrutura visual, modais, paineis e estilos.
- `saas/frontend/app.js`: estado, chamadas API, renderizacao, validacoes e fluxos de tela.
- `saas/frontend/prestadores_override.js` e patches relacionados: complemento de tela/agenda de prestadores.
- `saas/frontend/prototipos/editor-textos-next/`: prototipo Next.js/TipTap para futuro editor de textos, ainda separado do runtime principal.

## Banco de dados

O banco principal e PostgreSQL. A conexao e criada em `saas/backend/database.py`:

- `DATABASE_URL` vem do ambiente.
- `engine = create_engine(DATABASE_URL)`.
- `SessionLocal` e usado por dependencias e scripts.
- `Base` e a declarative base dos modelos.

Nao ha Alembic. Mudancas de schema estao em scripts manuais, principalmente `saas/backend/scripts/aplicar_compatibilidade_schema.py`, scripts especificos de modulo e, localmente, `Base.metadata.create_all`.

## Seguranca e tenant

- Autenticacao por JWT em `security/jwt_handler.py`.
- Hash de senha com Passlib/bcrypt em `security/hash.py`.
- Usuario atual em `security/dependencies.py`.
- Controle por modulo via `security/permissions.py`.
- Tenant por `clinica_id` associado ao usuario; `TrialMiddleware` popula o contexto a partir do token.
- `TenantMiddleware` tambem aceita `X-Tenant-ID`, mas a seguranca efetiva deve depender do usuario autenticado, nao de header livre.

## Deploy

O deploy descrito e Render, usando `saas/render.yaml`:

- Runtime Python.
- Build: `pip install -r backend/requirements.txt`.
- Start: `cd backend && python scripts/aplicar_compatibilidade_schema.py && uvicorn main:app --host 0.0.0.0 --port ${PORT}`.
- Healthcheck: `/health`.
- Producao bloqueia bootstrap automatico por variaveis `BRANA_ENABLE_SCHEMA_BOOTSTRAP=0`, `BRANA_ENABLE_RUNTIME_BOOTSTRAP=0`, `BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP=0`.

## Arquitetura legado

O desktop legado usa:

- `main.py` na raiz.
- PySide2.
- SQLite/Peewee em `app/database.py` e `app/models.py`.
- Telas `.ui` em `ui/`.
- Servicos em `app/services/`.

Ele nao e o runtime principal do Brana Cloude web, mas ainda orienta regras, dados e migracoes.
