# Auditoria documental — Contratos de autenticação e autorização: requestJson, /me e security

## 1. Resumo executivo

Esta auditoria é exclusivamente documental e aprofunda os contratos centrais de autenticação/autorização entre `frontend/app.js` e o backend do Brana Cloud, com foco em `requestJson`, `/me`, `security/dependencies.py`, `security/permissions.py` e `security/trial_middleware.py`.

Conclusão principal: `requestJson` é um contrato transversal e crítico. Ele não é apenas um helper HTTP; ele injeta token Bearer, normaliza respostas, trata dados JSON/text/blob/raw, interpreta erros de sessão/licença, aciona redirecionamento de sessão, desbloqueia módulos protegidos com grant e reexecuta requisições. O endpoint `/me` é o contrato que alimenta `sessaoAtual`, permissões de menu, visibilidade de usuários/superadmin, setup obrigatório e parte da rotina de heartbeat. No backend, `/me` depende de `get_current_user()` e retorna `build_user_context()`, enquanto `TrialMiddleware` intercepta praticamente todas as rotas autenticadas antes mesmo da rota final.

Classificação geral: crítico / não mexer agora. Não há recomendação de modularização funcional nesta etapa.

## 2. Confirmação de escopo e branch

- Diretório auditado: `D:\BRANA ARQUIVOS\BRANA CLOUD`.
- Branch confirmada: `modularizacao-segura-fase-1`.
- Commits de contexto confirmados no log:
- `b4aef99 Audita inventario mestre para refatoracao`.
- `3bd85f4 Audita usuarios permissoes login e sessao`.
- Escopo: somente leitura e criação deste documento.
- `git diff --stat` inicial: vazio.
- `git status --short` inicial: apenas untracked antigos/preexistentes em `docs/`, além de `?? git` e `?? modularizacao-segura-fase-1`; nada disso foi limpo, movido ou adicionado.

## 3. Blindagem textual/mojibake

Foi consultado `docs/regras_blindagem_correcoes_textuais_mojibake.md`. A regra foi respeitada. Foram observados textos e mojibake em arquivos funcionais, inclusive em áreas sensíveis como `requestJson`, mensagens de sessão e permissões, mas nada foi corrigido. Qualquer correção textual futura nesses pontos deve ser tratada como alteração de alto risco porque pode afetar parsing de erro, modais, endpoints, payloads e fluxo de sessão.

## 4. Arquivos analisados

Frontend:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/*.js`
- `frontend/js/utils/*.js`

Backend:

- `backend/main.py`
- `backend/routes/auth_routes.py`
- `backend/routes/user_admin_routes.py`
- `backend/routes/superadmin_routes.py`
- `backend/routes/licenca_routes.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`
- `backend/security/trial_middleware.py`
- `backend/security/user_context.py`
- `backend/security/jwt_handler.py`
- `backend/security/superadmin.py`
- `backend/security/admin_password.py`
- `backend/security/tenant.py`
- `backend/security/tenant_context.py`
- `backend/models/usuario.py`
- `backend/models/clinica.py`

Documentos consultados:

- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`

## 5. Mapa de `requestJson` no frontend

Localização principal em `frontend/app.js`:

- `setToken` e `getToken`: armazenam/leem `brana_token` em `localStorage`.
- `requestJsonBase`: monta headers, payload, `fetch`, parsing da resposta e retorno `{res,data}`.
- `requestJson`: envolve `requestJsonBase`, normaliza mojibake em dados, trata erro protegido, reexecuta com grant e aciona guarda de sessão.
- `postJson`: atalho para `requestJson("POST", ...)`.

Quantidade observada:

- Foram encontradas 256 ocorrências de `requestJson(` em `frontend/app.js`.
- Não foi identificado wrapper equivalente em `frontend/js/utils`.
- Não há módulo JS próprio em `frontend/js/modules` para `requestJson`, auth ou sessão.

### `requestJsonBase`

Comportamentos identificados:

- Recebe `method`, `path`, `payload`, `auth` e `options`.
- Se `auth=true`, injeta `Authorization: Bearer ` + `getToken()`.
- Aceita `options.headers` e mescla headers adicionais.
- Aceita `options.rawBody` para payload já pronto, por exemplo `FormData`.
- Se `payload` existir e não houver `Content-Type`, adiciona `Content-Type: application/json`.
- Executa `fetch(baseUrl + path, {method, headers, body})`.
- Interpreta `responseType` como `json`, `blob`, `text` ou `raw`.
- Retorna sempre objeto `{res,data}`.

### `requestJson`

Comportamentos identificados:

- Chama `requestJsonBase`.
- Normaliza dados retornados quando `canNormalizeMojibake(data)` permite.
- Chama `parseProtectedError(res,data)` para identificar resposta `403` com `detail.error = protected_password_required`.
- Se houver erro protegido e `skipProtectedAutoUnlock` não estiver ativo, chama `ensureProtectedGrant()`.
- Se receber grant, reexecuta a chamada com header `X-Protected-Grant`.
- Se a segunda tentativa ainda retorna erro protegido, remove o grant em cache daquele módulo.
- Se `auth=true` e `skipSessionGuard` não estiver ativo, chama `parseSessionIssue()` e `enforceSessionIssue()`.
- Retorna `{res,data}` para o chamador, mesmo após tratamento de sessão ou erro protegido.

## 6. Contrato de token e headers

Contrato frontend:

- Chave local: `brana_token`.
- Origem do token: `POST /login`, `POST /signup/confirm` e OAuth via query `?token=` em `bootstrapOauthFromUrl()`.
- Header autenticado: `Authorization: Bearer <token>`.
- Header de grant protegido no retry: `X-Protected-Grant: <grant>`.
- O frontend também conhece o conceito de `X-Protected-Password` indiretamente pelo backend, mas o fluxo auditado usa grant gerado por `/auth/protected/unlock`.

Contrato backend:

- `OAuth2PasswordBearer(tokenUrl="login")` extrai Bearer token.
- `decode_token()` valida JWT com `JWT_SECRET_KEY`.
- `TrialMiddleware` também lê manualmente `Authorization` e exige prefixo `Bearer `.
- `require_module_access()` e `require_admin_password_if_user_control_enabled()` aceitam `X-Protected-Grant` e `X-Protected-Password`.

Risco: o token Bearer é exigido por mais de uma camada. Mudar `requestJson`, `getToken`, `setToken`, nome do header ou parsing de token pode quebrar login, `/me`, middleware global e permissões protegidas.

## 7. Mapa de chamadas para `/me`

Foram identificadas duas chamadas diretas a `/me` em `frontend/app.js`:

- `startSessionHeartbeat()`: chama `requestJson("GET","/me",undefined,true,{heartbeat:true})` a cada 60 segundos quando há token.
- `carregarSessao()`: chama `requestJson("GET","/me",undefined,true)` durante boot/validação de sessão.

Fluxo de boot relacionado:

- `bootstrapOauthFromUrl()` pode gravar token vindo de OAuth na URL.
- Ao final da inicialização, `carregarSessao()` é chamado.
- Se não houver token, a tela de login é exibida e permissões de menu são reaplicadas como bloqueadas.
- Se houver token e `/me` responde com sucesso, `sessaoAtual` recebe o payload.

Fluxo de heartbeat:

- `SESSION_HEARTBEAT_MS = 60 * 1000`.
- A cada ciclo, se não houver token, o heartbeat para.
- Se `GET /me` responder `ok`, `sessaoAtual` é mesclado com o retorno.
- Se houver erro de sessão/licença, a guarda de sessão em `requestJson` pode bloquear/redirecionar antes do chamador decidir.

## 8. Dados retornados por `/me`

`GET /me` em `backend/routes/auth_routes.py` chama:

- `get_current_user()` em `backend/security/dependencies.py`.
- `is_platform_superadmin_user(current_user)` em `backend/security/superadmin.py`.
- `build_user_context(current_user, is_superadmin=is_super)` em `backend/security/user_context.py`.

Campos identificados no retorno de `build_user_context()`:

- `id`
- `codigo`
- `nome`
- `apelido`
- `tipo_usuario`
- `email`
- `clinica_id`
- `prestador_id`
- `unidade_atendimento_id`
- `is_system_user`
- `is_admin`
- `is_superadmin`
- `ativo`
- `forcar_troca_senha`
- `setup_completed`
- `permissoes`

Observação: `/me` não retorna diretamente dados completos de licença/trial, mas seu sucesso depende do token, do usuário, da clínica e do middleware de trial/licença. Além disso, depois de `/me`, `carregarSessao()` chama `licCarregarInfo()` para popular badge/estado de licença.

## 9. Como `/me` alimenta estado global e interface

Em `carregarSessao()`, o retorno de `/me` alimenta:

- `sessaoAtual = data`.
- `userEmail.textContent = data.email || "-"`.
- `userRole.textContent` com `Super Admin`, `Administrador` ou `Usuario`.
- Visibilidade de `btnOpenUsers` com base em `data.is_admin || data.is_superadmin`.
- Visibilidade de `menuSuperAdminAction` e `menuSuperAdminSep` com base em `data.is_superadmin`.
- Fechamento do painel de usuários se `!data.is_admin`.
- Fechamento do painel superadmin se `!data.is_superadmin`.
- Abertura do setup se `data.setup_completed === false`.
- Exibição do shell principal após sessão válida.
- Texto de rodapé com `clinica_id`.
- Chamada de `licCarregarInfo()`.
- Chamada de `menuApplyPermissions()`.
- Início de `startSessionHeartbeat()`.
- Abertura de modos standalone de agenda/editor quando aplicável.

No menu, `sessaoAtual.permissoes` alimenta:

- `menuActionAccessLevel(action)`.
- `menuApplyPermissions()`.
- `menuEnsurePermission(action)`.
- Bloqueio visual (`disabled`, `aria-disabled`, `tabindex=-1`).
- Solicitação de grant protegido quando o nível é `protegido`.

## 10. Funções/blocos dependentes de `requestJson` e `/me`

Dependem diretamente de `/me`:

- `carregarSessao()`.
- `startSessionHeartbeat()`.

Dependem diretamente de `sessaoAtual` carregado por `/me`:

- `menuActionAccessLevel()`.
- `menuApplyPermissions()`.
- `menuEnsurePermission()`.
- `executarAcaoMenu()` para ações protegidas por menu.
- Visibilidade de usuários/superadmin em `carregarSessao()`.
- `isSuperAdminSessao()` e funções `sa*` associadas.
- Abertura do painel de usuários por toolbar/menu.
- Fluxos que checam `is_admin`, `is_superadmin` ou `permissoes`.

Dependem de `requestJson` como contrato transversal:

- Licença, usuários, permissões, superadmin, cadastros, agenda, financeiro, editor, materiais, medicamentos e demais módulos que usam endpoints autenticados.
- Foram encontradas 256 ocorrências de `requestJson(`, indicando uso espalhado pelo arquivo central.

## 11. Endpoints backend envolvidos no contrato auth/security

Autenticação e sessão:

- `POST /login`: retorna `access_token` e `token_type`.
- `POST /logout`: marca usuário como offline quando possível.
- `GET /me`: retorna contexto do usuário autenticado.
- `POST /auth/protected/unlock`: retorna `grant_token` para módulo protegido.
- `POST /auth/setup/complete`: conclui primeiro acesso/setup.
- `POST /signup/confirm`: também retorna `access_token`.
- `GET /auth/google/callback`: redireciona para `/app?token=<token>`.

Rotas que dependem do contrato:

- `/admin/users/*`: protegidas por `require_module_access("usuarios")` e `require_admin_password_if_user_control_enabled("usuarios")`.
- `/licenca/*`: acessíveis mesmo com licença expirada em parte do fluxo, por exceção do middleware.
- `/superadmin/*`: dependem de usuário superadmin/owner e token válido.
- `/licenca/mercadopago/webhook`: rota pública por exceção explícita no middleware.

## 12. Análise de `security/dependencies.py`

`get_current_user()`:

- Usa `OAuth2PasswordBearer(tokenUrl="login")`.
- Decodifica token com `decode_token()`.
- Retorna `401` quando token é inválido/expirado.
- Busca `Usuario` por `user_id`.
- Bloqueia usuário inexistente.
- Bloqueia usuário sistêmico.
- Bloqueia usuário inativo, exceto owner.
- Exige `setup_completed`, exceto para `/me`, `/logout` e `/auth/setup/complete`.
- Para owner, força `usuario.ativo = True` e `usuario.is_admin = True` em memória.

`require_module_access(module_code)`:

- Usa `get_module_access_level()`.
- Libera `habilitado`.
- Bloqueia `desabilitado` com `403` textual.
- Para `protegido`, aceita `X-Protected-Password` ou `X-Protected-Grant`.
- Valida grant por `type = protected_grant`, mesmo usuário, mesma clínica e mesmo módulo.
- Permite grant de `configuracao` para `usuarios`.
- Se não validar, retorna `403` com `detail` objeto contendo `error`, `module_code` e `message`.

`require_admin_password_if_user_control_enabled(module_code)`:

- Lê `clinicas.opcoes_sistema_json`.
- Procura `seguranca.ativar_controle_usuarios`.
- Se controle de usuários estiver desativado, libera.
- Se estiver ativo, exige senha protegida ou grant protegido.
- Usa a mesma estrutura de erro `protected_password_required`.

Contrato crítico: o frontend depende da forma estruturada do erro `protected_password_required` para abrir modal de senha protegida e reexecutar a requisição.

## 13. Análise de `security/permissions.py`

Responsabilidades observadas:

- Define níveis aceitos: `desabilitado`, `protegido`, `habilitado`.
- Define módulos internos de permissão:
- `usuarios`
- `prestadores`
- `agenda`
- `financeiro`
- `materiais`
- `procedimentos`
- `anamnese`
- `relatorios`
- `configuracao`
- Define perfis-base: admin, clínica, dentista, auxiliar, funcionário administrativo, gerente administrativo e atendente.
- Define hints de funções por módulo.
- Lê `sis_modulo_sql.csv` e `sis_funcao_sql.csv` para compatibilidade Easy.
- Mapeia módulos legados para módulos internos.
- Normaliza permissões (`sanitize_permissions`).
- Calcula defaults (`default_permissions`) por tipo de usuário e admin.
- `get_module_access_level()` retorna `habilitado` diretamente para `is_admin`.

Contrato com frontend:

- O frontend espera `sessaoAtual.permissoes[moduleCode]` com um dos níveis `desabilitado`, `protegido`, `habilitado`.
- O menu usa os mesmos códigos internos definidos no backend.
- Um nível desconhecido cai para `desabilitado` no frontend.
- Um módulo ausente em `permissoes` também cai para `desabilitado`.

Risco: alterar códigos de módulo, níveis, defaults ou shape de `permissoes` quebra menu, acesso protegido e rotas backend.

## 14. Análise de `trial_middleware.py`

`TrialMiddleware` roda antes das rotas finais e participa do contrato auth/licença:

Rotas públicas identificadas:

- `/`
- `/app`
- `/docs`
- `/docs/oauth2-redirect`
- `/openapi.json`
- `/redoc`
- `/favicon.ico`
- `/login`
- `/auth/google/login`
- `/auth/google/callback`
- `/signup/request-code`
- `/signup/confirm`
- `/password/forgot`
- `/password/reset`

Exceções por prefixo:

- `/frontend`
- `/desktop-assets`
- `/licenca/mercadopago/webhook`

Comportamentos críticos:

- Exige `Authorization: Bearer <token>` para rotas não públicas.
- Decodifica token antes de chegar na rota.
- Busca `Usuario` por `user_id`.
- Valida `clinica_id`.
- Define `tenant_clinica_id` com base na clínica do usuário.
- Busca `Clinica`.
- Bypassa bloqueios para owner de usuário ou clínica.
- Bloqueia clínica inativa fora de `/licenca` com `Conta suspensa...`.
- Bloqueia licença expirada fora de `/licenca` com `Licenca expirada...`.

Contrato com frontend:

- `requestJson` identifica `401` como sessão expirada/necessidade de login.
- `requestJson` identifica texto de `403` contendo licença/trial/conta suspensa para bloquear a aplicação e mostrar login/status.
- `/licenca/*` permanece acessível em cenários de licença para permitir regularização.
- Webhook Mercado Pago fica fora do contrato de token.

Risco: mexer no middleware pode impedir qualquer rota autenticada, quebrar regularização de licença, permitir acesso vencido ou comprometer tenant.

## 15. Contratos implícitos identificados

Contratos de transporte:

- `requestJsonBase` sempre retorna `{res,data}`.
- Chamadores leem `res.ok`, `res.status`, `data.detail` e outros campos específicos.
- Erros podem vir como string, `detail` string, `detail` objeto ou `message`.
- `extractApiDetail()` é usado para normalizar mensagens de erro.

Contratos de token:

- Token fica em `localStorage` como `brana_token`.
- Token é JWT Bearer.
- Backend espera `user_id` no payload.
- Login tradicional retorna `access_token`.
- Signup confirm retorna `access_token`.
- OAuth Google injeta token via query string `token`.

Contratos de sessão:

- `/me` deve responder com dados do usuário no shape de `build_user_context()`.
- `setup_completed=false` aciona tela de setup.
- `is_admin` libera painel/toolbar de usuários.
- `is_superadmin` libera menu/painel superadmin.
- `permissoes` alimenta menu e grant protegido.
- `clinica_id` aparece no rodapé e participa do tenant/backend.

Contratos de permissão:

- Níveis válidos: `desabilitado`, `protegido`, `habilitado`.
- `protegido` exige senha/grant.
- `desabilitado` bloqueia menu e backend.
- Admin/superadmin têm acesso habilitado no frontend e backend.
- Grant de `configuracao` também libera `usuarios` em regras específicas.

Contratos de erro protegido:

- Backend retorna `403` com `detail.error = protected_password_required`.
- Backend retorna `detail.module_code`.
- Backend retorna `detail.message`.
- Frontend usa esses campos em `parseProtectedError()`.
- Frontend chama `/auth/protected/unlock`.
- Backend retorna `grant_token`.
- Frontend reexecuta a chamada original com `X-Protected-Grant`.

Contratos de licença/trial:

- `TrialMiddleware` bloqueia rotas com `403` textual.
- `requestJson` interpreta textos de licença/trial/conta suspensa por normalização.
- `/licenca` é exceção para permitir regularização.
- `licCarregarInfo()` complementa `/me` com status de licença no frontend.

## 16. Pontos de acoplamento frontend x backend

- `requestJson` depende de detalhes estruturais e textuais dos erros do backend.
- `parseSessionIssue()` depende de status HTTP e de trechos textuais como `setup_required`, `licenca expirada`, `trial expirado`, `conta suspensa`.
- `parseProtectedError()` depende de `detail` objeto, não apenas texto.
- `carregarSessao()` depende de `/me` para liberar shell, menus, usuários e superadmin.
- `menuActionAccessLevel()` depende dos códigos de `permissions.py`.
- `TrialMiddleware` depende do mesmo token que `get_current_user()` também valida.
- `require_module_access()` depende do mesmo grant que o frontend guarda em `protectedGrantCache`.
- `require_admin_password_if_user_control_enabled()` depende de `clinicas.opcoes_sistema_json`, mas a UI só vê o efeito como pedido de senha protegida.
- Logout frontend limpa muito mais que sessão; limpa caches de módulos diversos.

## 17. Riscos críticos de mexer em `requestJson`

- Quebrar Authorization Bearer em todos os endpoints autenticados.
- Quebrar parsing de `blob`, `text`, `raw` ou JSON.
- Quebrar upload/envio com `rawBody`.
- Quebrar normalização de mensagens usada por guardas de sessão.
- Quebrar detecção de `protected_password_required`.
- Quebrar reexecução com `X-Protected-Grant`.
- Gerar loop de grant protegido ou reautenticação.
- Ocultar erros reais ao transformar `data.detail`.
- Bloquear o sistema em licença expirada ou conta suspensa.
- Quebrar módulos não relacionados por causa das 256 chamadas espalhadas no `app.js`.

## 18. Riscos críticos de mexer em `/me`

- `sessaoAtual` pode ficar incompleto.
- Menus podem ficar todos bloqueados.
- Usuários/superadmin podem aparecer ou sumir indevidamente.
- Setup inicial pode não abrir.
- Heartbeat pode parar de renovar contexto de sessão.
- `is_admin`/`is_superadmin` podem divergir entre frontend e backend.
- Permissões podem cair para `desabilitado` por shape incompatível.
- `clinica_id` pode deixar de refletir tenant real.
- Fluxos standalone de agenda/editor podem abrir sem sessão validada.

## 19. Riscos críticos em `security/dependencies.py`

- Liberar usuário inativo, sistêmico ou sem setup.
- Bloquear owner/admin indevidamente.
- Tornar `/me`, `/logout` ou `/auth/setup/complete` inacessíveis durante setup.
- Quebrar `require_module_access()` para módulos protegidos.
- Mudar shape do erro protegido e impedir o frontend de abrir modal de senha.
- Invalidar a exceção de grant `configuracao -> usuarios`.
- Introduzir divergência entre senha protegida e grant protegido.
- Quebrar rotas `/admin/users/*`, que têm dependências combinadas.

## 20. Riscos envolvendo permissões, tenant, licença, trial e superadmin

Permissões:

- Mudar módulos internos quebra frontend e backend simultaneamente.
- Mudar defaults pode liberar áreas financeiras/procedimentos/materiais indevidamente.
- Mudar `protegido` altera o contrato de senha administrativa.

Tenant:

- `tenant_clinica_id` é definido no middleware com base no usuário.
- `TenantMiddleware` também pode aceitar `X-Tenant-ID`.
- Auditoria própria ainda é necessária para saber precedência e consumo em todos os endpoints.

Licença/trial:

- Bloqueio acontece antes das rotas finais.
- Mensagens textuais alimentam `parseSessionIssue()`.
- `/licenca` precisa continuar acessível para regularização.
- Webhook Mercado Pago precisa continuar público.

Superadmin:

- `is_superadmin` vem de `is_platform_superadmin_user()`.
- `build_user_context()` força `is_admin=true` se `is_superadmin=true`.
- Frontend usa `is_superadmin` para menu/painel e funções `sa*`.
- Backend usa regras de owner/tipo de conta em rotas sensíveis.

## 21. Lista clara do que NÃO deve ser modularizado ainda

Não modularizar ainda:

- `requestJsonBase`.
- `requestJson`.
- `postJson`.
- `setToken` e `getToken`.
- `bootstrapOauthFromUrl`.
- `parseProtectedError`.
- `ensureProtectedGrant`.
- `unlockProtectedGrant`.
- `protectedPassDialog`, `protectedPassSubmit`, `protectedPassClose`.
- `parseSessionIssue`.
- `enforceSessionIssue`.
- `hardResetSessionState`.
- `blockAppAndShowLogin`.
- `startSessionHeartbeat` e `stopSessionHeartbeat`.
- `carregarSessao`.
- `menuActionAccessLevel`, `menuApplyPermissions`, `menuEnsurePermission`.
- Contrato `/me`.
- `get_current_user()`.
- `require_module_access()`.
- `require_admin_password_if_user_control_enabled()`.
- `sanitize_permissions()` e `get_module_access_level()`.
- `TrialMiddleware`.
- `build_user_context()`.
- Qualquer header/token/grant/sessão/licença/superadmin antes de nova auditoria e revisão humana.

## 22. Lacunas restantes

- Não foi feita auditoria de todas as 256 chamadas `requestJson(` individualmente por domínio.
- Não foi feita matriz completa de endpoints autenticados versus permissões exigidas.
- Não foi feita auditoria profunda de `tenant_context` em todos os serviços/rotas.
- Não foi feita auditoria de todos os middlewares e ordem exata de execução além da leitura de `backend/main.py` e `TrialMiddleware`.
- Não foi feita auditoria de todos os scripts/migrations que alteram usuários, permissões, clínicas ou licença.
- Não foi feita validação em runtime no navegador, por escopo documental.
- Não foi feita consulta a banco real.
- Não foi feita auditoria completa do OAuth Google/Google Calendar.
- Não foi feita auditoria completa de Mercado Pago/webhook além do contrato de exceção e endpoints.
- Não foi feita auditoria textual/correção de mojibake por blindagem obrigatória.

## 23. Sequência documental segura recomendada

1. Auditoria de matriz de endpoints autenticados: endpoint, arquivo, dependência de segurança, módulo de permissão, payload sensível e risco.
2. Auditoria específica de `requestJson` por categorias de uso: JSON normal, blob, rawBody, text/raw, retry protegido e chamadas críticas.
3. Auditoria de tenant: `tenant_context`, `TenantMiddleware`, `TrialMiddleware`, `clinica_id` e uso por rotas/services.
4. Auditoria de permissões Easy versus permissões internas: CSVs, mapeamento, defaults, schema e funções por módulo.
5. Auditoria de licença/trial/superadmin: middleware, `/licenca`, webhook, `platform_admin_service.py` e `superadmin_routes.py`.
6. Somente depois, desenhar plano de testes de contrato antes de qualquer extração funcional.

## 24. Recomendação conservadora

Nenhuma alteração funcional deve ocorrer antes de revisão humana desta auditoria. A próxima etapa mais segura é uma auditoria documental de matriz de endpoints autenticados e dependências de segurança, cruzando todas as rotas com `get_current_user`, `require_module_access`, `TrialMiddleware`, módulos de permissão e risco de payload.

Alternativa igualmente segura: auditoria documental de `requestJson` por categoria de uso, sem mover código, apenas listando padrões e riscos por tipo de chamada.

## 25. Confirmação final desta etapa

- Esta etapa não altera código.
- Esta etapa não altera `frontend/app.js`.
- Esta etapa não altera `frontend/index.html`.
- Esta etapa não altera `frontend/js/modules`.
- Esta etapa não altera `frontend/js/utils`.
- Esta etapa não altera CSS.
- Esta etapa não altera backend.
- Esta etapa não altera banco, schema, migrations ou endpoints.
- Esta etapa não altera `requestJson`, `/me`, login, logout, sessão, autenticação, autorização, token, headers, permissões, tenant, trial, licença, superadmin, grant protegido, senha, CRUD de usuários ou webhook Mercado Pago.
- Esta etapa não acessou pastas proibidas.
- Esta etapa respeitou a blindagem textual/mojibake.
