# Seguranca - Brana Cloude

## Autenticacao

Brana Cloude usa JWT:

- Criacao e leitura em `saas/backend/security/jwt_handler.py`.
- Token enviado por `Authorization: Bearer <token>`.
- `get_current_user` valida token e carrega `Usuario`.
- Senhas usam Passlib com `bcrypt_sha256` e compatibilidade com bcrypt legado.

## JWT e segredo obrigatorio

Status Fase A.2: corrigido.

`security/jwt_handler.py` nao deve conter segredo hardcoded. A assinatura e leitura de tokens devem usar somente a variavel de ambiente `JWT_SECRET_KEY`.

Se `JWT_SECRET_KEY` nao existir, a criacao/decodificacao de token falha com erro explicito. Isso e intencional: ambiente sem segredo JWT nao deve operar login.

Acao recomendada:

1. Criar segredo forte no ambiente.
2. Configurar `JWT_SECRET_KEY` no Render/local antes de subir a API.
3. Invalidar tokens antigos sempre que o segredo for rotacionado.
4. Nunca registrar esse segredo em arquivo versionado.

## Autorizacao

O controle de acesso e por modulo:

- `require_module_access(module_code)`.
- Niveis: `desabilitado`, `protegido`, `habilitado`.
- Modulos definidos em `security/permissions.py`.
- Modulo protegido exige `X-Protected-Password` valido ou `X-Protected-Grant` temporario.

Rotas sensiveis de usuarios e opcoes do sistema tambem usam `require_admin_password_if_user_control_enabled`.

## Tenant

O tenant real deve ser a clinica do usuario autenticado:

- `TrialMiddleware` le JWT, carrega usuario, define `tenant_clinica_id` e valida clinica.
- `TenantMiddleware` aceita `X-Tenant-ID`, mas isso nao deve ser usado como fonte de permissao.

Risco: qualquer rota que use header de tenant ou deixe de filtrar por `current_user.clinica_id` pode vazar dados.

## Trial e licenca

`TrialMiddleware` bloqueia acesso quando:

- Nao ha token em rota protegida.
- Token invalido.
- Usuario/clinica invalidos.
- Clinica inativa.
- Trial/licenca expirado.

Rotas publicas e assets sao liberados. Rotas de licenca ficam parcialmente liberadas para regularizacao.

## Superadmin e owner

Ha bypass para contas owner/superadmin por email/tipo de conta. Variaveis relacionadas:

- `OWNER_BYPASS_EMAILS`
- `OWNER_MASTER_EMAIL`

Essas variaveis devem ser tratadas como sensiveis e revisadas em producao.

## Dados sensiveis encontrados e tratados

- `saas/backend/.env` existe no workspace local e deve continuar ignorado.
- `saas/backend/.env.render` continha `DATABASE_URL` real em texto claro e foi removido na Fase A.2.
- `.env.example` foi atualizado com placeholders e `JWT_SECRET_KEY`.

Acao recomendada imediata:

1. Rotacionar senha do banco exposta.
2. Confirmar que `.env.render` nao existe no repositorio remoto.
3. Garantir `.gitignore` cobrindo `.env*` sensiveis.
4. Usar secrets do Render.

## Integracoes sensiveis

Variaveis que devem ficar somente em secret manager/Render:

- `DATABASE_URL`
- `JWT_SECRET_KEY` quando implementado.
- `GOOGLE_CLIENT_SECRET`
- `SMTP_PASS`
- `MERCADOPAGO_ACCESS_TOKEN`
- `OWNER_BYPASS_EMAILS`
- `OWNER_MASTER_EMAIL`

## Riscos de frontend

- Frontend monolitico dificulta revisar fluxos de autorizacao.
- Toda autorizacao real deve ficar no backend; frontend pode esconder botoes, mas nao pode ser barreira de seguranca.
- Funcoes de correcao de encoding em runtime indicam que dados/textos podem chegar corrompidos.

## Checklist para novas rotas

- Exige usuario autenticado?
- Tem `require_module_access` correto?
- Filtra por `current_user.clinica_id`?
- Impede acesso cross-tenant por IDs enviados pelo cliente?
- Valida payload com Pydantic ou validacao equivalente?
- Nao retorna segredo, hash, token ou dados de outra clinica?
- Registra operacao critica quando necessario?

## Relatorio multi-tenant - Fase A.2

Pontos seguros observados:

- A maioria das rotas funcionais usa `require_module_access` no `APIRouter` ou dependencias por endpoint.
- A maioria das rotas operacionais referencia `current_user.clinica_id` e filtra modelos com `clinica_id`.
- `TrialMiddleware` carrega usuario a partir do JWT e define tenant por `usuario.clinica_id`.
- Rotas superadmin ficam separadas em `superadmin_routes.py` e exigem verificacao propria de superadmin.

Pontos que exigem cuidado:

- `auth_routes.py` nao tem `require_module_access` por ser rota publica/de autenticacao. Deve manter validacoes fortes em cada fluxo.
- `licenca_routes.py` tem rotas que precisam ser acessiveis mesmo com trial/licenca vencido. Deve manter escopo restrito ao usuario/clinica autenticados quando houver dados de conta.
- `cadastros_routes.py` usa dependencias por endpoint em vez de dependencia unica no router. Ao adicionar endpoint novo, revisar permissao explicitamente.
- `relatorios_routes.py` nao consulta banco nem filtra `clinica_id`; envia anexo informado pelo usuario autenticado. O risco de tenant e baixo, mas o endpoint deve continuar autenticado e protegido pelo modulo `relatorios`.
- `TenantMiddleware` aceita `X-Tenant-ID`; esse header nao deve ser usado como fonte de autorizacao. A fonte confiavel e sempre o usuario autenticado.
- Queries globais em `superadmin_routes.py` sao esperadas, mas qualquer endpoint novo nesse arquivo deve manter `_require_superadmin`.

Resultado: nao foi aplicada mudanca de regra de negocio multi-tenant na Fase A.2. O trabalho foi de identificacao e documentacao dos pontos seguros/inseguros.
