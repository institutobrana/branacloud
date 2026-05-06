# 06 - Seguranca

## Principios

- Segredo nunca fica hardcoded.
- `JWT_SECRET_KEY` e obrigatoria e deve vir do ambiente.
- `DATABASE_URL` real nunca deve ser versionada.
- Frontend nao e barreira de seguranca.
- Toda rota operacional deve autenticar usuario.
- Toda rota operacional deve filtrar por `current_user.clinica_id`.

## JWT

Codigo: `backend/security/jwt_handler.py`.

O JWT usa algoritmo `HS256`. O segredo vem de `os.getenv("JWT_SECRET_KEY")`. Se a variavel estiver ausente ou vazia, o codigo levanta erro. Isso e intencional e seguro.

O token de login contem `user_id`, `clinica_id`, `is_admin` e `exp`.

## Carregamento de ambiente

Codigo: `backend/main.py`.

O backend carrega `backend/.env` no inicio:

```python
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
```

Isso precisa acontecer antes de importar `database.py`, rotas e seguranca.

## Autenticacao

Codigo: `backend/routes/auth_routes.py`, `backend/security/dependencies.py`.

`POST /login` valida email/senha, bloqueia usuario inativo, bloqueia conta sistemica e gera token. `GET /me` retorna contexto do usuario autenticado.

`get_current_user` decodifica token, busca usuario no banco, valida status, bloqueia conta sistemica e aplica regra de setup incompleto.

## Controle de acesso

Codigo: `backend/security/permissions.py`, `backend/security/dependencies.py`.

Rotas usam `require_module_access("modulo")`. Niveis relevantes:

- `habilitado`: acesso liberado.
- `protegido`: exige senha administrativa ou grant temporario.
- `desabilitado`: acesso negado.

Quando controle de usuarios esta ativo na clinica, algumas rotas usam `require_admin_password_if_user_control_enabled`.

## Multi-tenant

A separacao de clinicas e feita por `clinica_id`. O middleware `TenantMiddleware` captura `X-Tenant-ID`, mas o isolamento efetivo das rotas deve vir do usuario autenticado: `current_user.clinica_id`.

Regra obrigatoria para novas rotas:

1. Exigir `get_current_user` ou dependencia de modulo.
2. Filtrar leituras por `Model.clinica_id == current_user.clinica_id`.
3. Ao criar registros, gravar `clinica_id=current_user.clinica_id`.
4. Ao editar/excluir, carregar o registro com filtro de `id` e `clinica_id`.
5. Nunca confiar em `clinica_id` vindo do frontend.

## Superadmin

Rotas de `backend/routes/superadmin_routes.py` podem consultar informacoes de multiplas clinicas. Elas exigem validacao de superadmin/plataforma e devem ser revisadas com cuidado antes de qualquer alteracao.

## Arquivos sensiveis

Nao versionar:

- `backend/.env`
- `.env` e `.env.*`
- `.venv/`, `venv/`
- dumps, backups e bancos locais
- `Dados/`
- `storage/modelos/clinicas/`
- PDFs, DOCX, XLS, imagens e documentos com dados reais

## Integracoes externas

Variaveis opcionais sensiveis:

- SMTP: `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
- Resend: `RESEND_API_KEY`.
- Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GOOGLE_CALENDAR_REDIRECT_URI`.
- Mercado Pago: `MERCADOPAGO_ACCESS_TOKEN`.
- WhatsApp: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`.
- Assinatura PDF: variaveis `BRANA_PDF_SIGN_*`.

## Riscos atuais

- Nao ha migrations formais.
- `frontend/app.js` e monolitico.
- Existem referencias historicas a nomes/caminhos antigos.
- Webhooks precisam de protecao quando expostos publicamente.