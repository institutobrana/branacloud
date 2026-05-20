# Auditoria documental — Usuários, permissões, login e sessão

## 1. Resumo executivo

Esta auditoria é exclusivamente documental e aprofunda as áreas críticas de usuários, perfis, permissões, login, sessão, autenticação, token, tenant, licença e superadmin no Brana Cloud.

A auditoria geral anterior (`docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`, commit `b4aef99`) indicou que essas áreas concentram alto risco porque atravessam frontend, backend, banco, sessão, permissões, licença e rotas protegidas. Esta etapa confirma que a modularização funcional deve permanecer pausada até revisão humana deste documento.

Conclusão principal: o fluxo de usuários/permissões/login/sessão está funcionalmente concentrado no `frontend/app.js` e distribuído no backend entre rotas de autenticação, administração de usuários, superadmin, licença e arquivos de segurança. Não há arquivo JS próprio em `frontend/js/modules` para usuários, permissões, login ou sessão. Qualquer refatoração prematura pode quebrar autenticação, bloqueio de licença, controle de acesso, grant de senha protegida, menu dinâmico ou operações administrativas.

## 2. Confirmação de escopo, branch e estado inicial

- Diretório auditado: `D:\BRANA ARQUIVOS\BRANA CLOUD`.
- Branch confirmada: `modularizacao-segura-fase-1`.
- Commit anterior relevante confirmado no log: `b4aef99 Audita inventario mestre para refatoracao`.
- Escopo desta etapa: somente leitura e criação deste documento.
- Modularização funcional: pausada.
- Código funcional: não deve ser alterado nesta etapa.
- Git inicial: havia diversas pendências `untracked` antigas em `docs/`, além de itens `?? git` e `?? modularizacao-segura-fase-1`; elas foram apenas observadas e não foram limpas, movidas ou adicionadas.
- `git diff --stat` inicial: sem alterações rastreadas.

## 3. Blindagem textual e mojibake

Foi consultado `docs/regras_blindagem_correcoes_textuais_mojibake.md`. A regra foi respeitada: textos, acentos, labels, mensagens, placeholders, strings visíveis e mojibake encontrados em arquivos funcionais foram apenas observados como risco documental. Nenhum arquivo funcional foi corrigido por esse motivo.

## 4. Arquivos e pastas analisados

Frontend analisado:

- `frontend/index.html`
- `frontend/app.js`
- `frontend/js/modules/*.js`
- `frontend/js/utils/*.js`

Backend analisado:

- `backend/main.py`
- `backend/routes/auth_routes.py`
- `backend/routes/user_admin_routes.py`
- `backend/routes/superadmin_routes.py`
- `backend/routes/licenca_routes.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`
- `backend/security/jwt_handler.py`
- `backend/security/tenant.py`
- `backend/security/tenant_context.py`
- `backend/security/trial_middleware.py`
- `backend/security/trial_validator.py`
- `backend/security/superadmin.py`
- `backend/security/admin_password.py`
- `backend/security/user_context.py`
- `backend/security/hash.py`
- `backend/security/system_accounts.py`
- `backend/models/usuario.py`
- `backend/models/access_profile.py`
- `backend/models/usuario_perfil_acesso.py`
- `backend/models/clinica.py`
- `backend/models/email_code.py`
- `backend/models/plataforma.py`
- `backend/services/access_profiles_service.py`
- `backend/services/platform_admin_service.py`
- `backend/services/signup_service.py`

Confirmação documental:

- `frontend/app.js` não foi alterado.
- `frontend/index.html` não foi alterado.
- `frontend/js/modules` não foi alterado.
- `frontend/js/utils` não foi alterado.
- `backend` não foi alterado.
- Banco, schema, migrations e endpoints não foram alterados.

## 5. Menus, telas, painéis e ações encontrados no frontend

Login, cadastro, recuperação e setup inicial em `frontend/index.html`:

- `login-wrap`
- `panel-login`
- `panel-signup`
- `panel-forgot`
- `panel-setup`
- `email`
- `senha`
- `btn-login`
- `btn-google-login`
- `btn-open-signup`
- `btn-open-forgot`
- `btn-signup-code`
- `btn-signup-confirm`
- `btn-forgot-code`
- `btn-forgot-reset`
- `btn-setup-complete`
- `btn-setup-logout`

`data-menu-action` relacionados:

- `cadastro-conectar`
- `cadastro-desconectar`
- `cadastro-sair`
- `config-alterar-senha`
- `ferr-usuarios-conectados`
- `licenca`
- `superadmin`
- `usuarios`

Painel de usuários:

- `users-panel`
- `users-status`
- `users-tbody`
- `users-btn-novo`
- `users-btn-editar`
- `users-btn-excluir`
- `users-btn-impressos`
- `users-btn-preferencias`
- `users-btn-permissoes`
- `users-btn-fechar`

Modais e formulários de usuários:

- `users-modal-backdrop`, `users-modal-codigo`, `users-modal-nome`, `users-modal-apelido`, `users-modal-tipo`, `users-modal-email`, `users-modal-prestador`, `users-modal-unidade`, `users-modal-ativo`, `users-modal-admin`, `users-modal-forcar-senha`, `users-modal-senha`, `users-modal-confirma`, `users-modal-senha-atual`, `users-modal-show-senha`, `users-modal-ok`, `users-modal-cancelar`.
- `users-pass-backdrop`, `users-pass-title`, `users-pass-codigo`, `users-pass-usuario`, `users-pass-atual`, `users-pass-nova`, `users-pass-confirma`, `users-pass-ok`, `users-pass-cancelar`.
- `protected-pass-backdrop`, `protected-pass-input`, `protected-pass-ok`, `protected-pass-cancelar`.
- `users-perm-backdrop`, `users-perm-title-name`, `users-perm-nome`, `users-perm-tipo`, `users-perm-tbody`, `users-perm-func-tbody`, `users-perm-ok`, `users-perm-cancelar`, `users-perm-fechar`, `users-perm-tab-acesso-btn`, `users-perm-tab-perfis-btn`, `users-perm-profile-select`, `users-perm-profile-apply`, `users-perm-profile-preview-tbody`, `users-perf-profile-tbody`, `users-perf-prestadores`.

Superadmin e licença:

- `menu-superadmin-action`, `menu-superadmin-sep`, `superadmin-panel`, `superadmin-status`, `superadmin-btn-refresh` e vários campos `sa-*` para visão geral, clínicas, usuários, cobranças e auditoria.
- `licenca-backdrop`, `licenca-machine-id`, `licenca-usuario`, `licenca-status` e botões `licenca-btn-*`.

## 6. Arquivos JS próprios e namespaces frontend

Em `frontend/js/modules`, existem 14 arquivos JS:

- `anamnese.js`
- `auxiliares.js`
- `cid.js`
- `convenios-planos.js`
- `etiquetas.js`
- `intervencoes-procedimentos.js`
- `materiais.js`
- `medicamentos.js`
- `plano-contas.js`
- `preferencias-opcoes-sistema.js`
- `prestadores.js`
- `procedimentos-genericos.js`
- `simbolos-graficos.js`
- `unidades.js`

Achado específico: não há arquivo JS próprio para usuários, permissões, login, sessão, autenticação, token, superadmin ou licença em `frontend/js/modules`. A busca em módulos JS não encontrou namespace próprio para usuários/login/sessão; a única ocorrência pontual de termo relacionado apareceu em `simbolos-graficos.js`, sem configurar módulo de usuários.

Status frontend:

- Usuários: concentrado no `frontend/app.js`.
- Permissões/perfis: concentrado no `frontend/app.js`.
- Login/sessão/autenticação/token: concentrado no `frontend/app.js`.
- Superadmin/licença: concentrado no `frontend/app.js`.
- Namespace próprio: não identificado para esses domínios.

## 7. Blocos e funções no `frontend/app.js`

Estado global e DOM ligados ao domínio:

- `loginWrap`, `shell`, `loginStatus`, `footerMsg`, `userEmail`, `userRole`, `userLicense`.
- `panelLogin`, `panelSignup`, `panelForgot`, `panelSetup`.
- `emailEl`, `senhaEl`, campos `signup*`, `forgot*`, `setup*`.
- `usersPanel`, `btnOpenUsers`, `menuSuperAdminAction`, `menuSuperAdminSep`.
- Objetos/variáveis `users*`, `usersPerm*`, `usersPerf*`, `protectedPass*`, `sa`, `licDlg`.
- Estado `sessaoAtual`.
- Estado de usuários: `usersCache`, `usersSelecionadoId`, `usersRefreshTimer`, `usersModalMode`, `usersModalEditId`, `usersTiposCache`, `usersPrestadoresLookup`, `usersUnidadesLookup`.
- Estado de permissões: `usersPermSchema`, `usersPermEditId`, `usersPermModules`, `usersPermLevels`, `usersPermCurrent`, `usersPermSelectedModule`, `usersPermProfiles`, `usersPermSelectedProfileCode`, `usersPermFunctionsByModule`, `usersPermActiveTab`, `usersPermFuncLevels`, `usersPermSelectedFuncId`, `usersPermEasyMode`, `usersPermAutosaveTimer`, `usersPermSelectionScope`.
- Estado de perfis/prestadores: `usersPerfProfiles`, `usersPerfPrestadores`, `usersPerfAssignments`, `usersPerfSelectedPerfilId`.
- Estado de grant protegido: `usersGrantOverride`, `protectedGrantCache`, `protectedGrantPending`, `protectedPassPending`, `protectedPassResolver`, `preserveProtectedGrantOnHide`.
- Estado de sessão: `SESSION_HEARTBEAT_MS`, `sessionHeartbeatTimer`, `sessionGuardInProgress`.
- Estado de licença/superadmin: `licInfoCache`, `mpReturnPaymentId`, `saClinicasCache`, `saUsuariosCache`.

Funções de autenticação, sessão e token:

- `setToken`
- `getToken`
- `requestJsonBase`
- `requestJson`
- `parseSessionIssue`
- `enforceSessionIssue`
- `hardResetSessionState`
- `blockAppAndShowLogin`
- `startSessionHeartbeat`
- `stopSessionHeartbeat`
- `login`
- `signupRequestCode`
- `signupConfirm`
- `forgotRequestCode`
- `forgotResetPassword`
- `abrirTelaSetup`
- `setupComplete`
- `setupLogout`
- `carregarSessao`

Achados relevantes:

- `login()` usa `fetch(baseUrl + "/login")` com `application/x-www-form-urlencoded`, fora do wrapper `requestJson`.
- `requestJson()` centraliza chamadas autenticadas e intercepta erros de sessão, licença, conta suspensa e senha protegida.
- `startSessionHeartbeat()` chama `GET /me` a cada 60 segundos e atualiza `sessaoAtual`.
- `btn-sair` limpa token, caches e estados de muitos módulos, não apenas sessão.
- `carregarSessao()` faz `GET /me`, atualiza UI, permissões de menu e visibilidade de superadmin/usuários.

Funções de usuários:

- `carregarUsuarios`, `abrirPainelAdministradorToolbar`, `showUsersPanel`, `usersNormalizeText`, `usersIsContaMasterBase`, `usersCanManageSelected`, `usersAtualizarAcoesToolbar`, `usersSelecionar`, `usersOptions`, `usersCarregarCombos`, `usersPopularModalCombos`, `usersPreencherModal`, `usersRenderAdvanced`, `usersStartRefresh`, `usersStopRefresh`, `usersAbrirModalNovo`, `usersAbrirModalEditar`, `usersFecharModal`, `usersSalvarEstrutural`, `usersSalvarNovo`, `usersSolicitarSenhaAtual`, `usersAbrirModalSenha`, `usersFecharModalSenha`, `usersSalvarSenha`, `usersAbrirSenhaSessaoAtual`, `usersEditarSelecionado`, `usersExcluirSelecionado`, `usersAbrirImpressos`, `usersAbrirPreferencias`.

Funções de permissões e perfis:

- `usersCarregarPermissoesSchema`, `usersPermNormalizeLevel`, `usersPermIcon`, `usersPermModuleCode`, `usersPermModuleName`, `usersPermFunctionCode`, `usersPermFunctionName`, `usersPermNormalizeFunctionsByModule`, `usersPermBuildPayload`, `usersPermAutoSave`, `usersPermScheduleAutoSave`, `usersPermFlushAutoSave`, `usersPermSetModuleLevel`, `usersPermSetFuncLevel`, `usersBuildFallbackProfiles`, `usersBuildFallbackFunctionsByModule`, `usersPermConfirmPassword`, `usersPermSetTab`, `usersPermGetProfileByCode`, `usersPermSelecionarFuncao`, `usersPermRenderFuncoes`, `usersPermSelecionarModulo`, `usersPermMoveSelection`, `usersPermHandleModuleKeydown`, `usersPermHandleFunctionKeydown`, `usersPermRenderPerfilPreview`, `usersPermRenderProfiles`, `usersPerfSelectPerfil`, `usersPerfRenderProfiles`, `usersPerfRenderPrestadores`, `usersPerfHandlePrestadorChange`, `usersPerfLoad`, `usersPermAplicarPerfilSelecionado`, `usersFecharPermissoes`, `usersRenderPermissoes`, `usersAbrirPermissoes`, `usersSalvarPermissoes`.

Funções de superadmin e licença relacionadas:

- `licCarregarInfo`, `licPreencherSobre`, `licConfirmarPagamentoRetorno`, `licIniciarCheckout`, `licSincronizarStatus`.
- `saRenderOverview`, `saRenderClinicas`, `saRenderUsuarios`, `saRenderCobrancas`, `saRenderAuditoria`, `saCarregarOverview`, `saCarregarClinicas`, `saUsuariosQueryParams`, `saCarregarUsuarios`, `saExportarUsuariosCsv`, `saCarregarCobrancas`, `saCarregarAuditoria`, `saRecarregarTudo`, `saAbrir`, `saAlterarStatusClinica`, `saAlterarPlanoClinica`, `saProrrogarTesteClinica`, `saExcluirClinica`, `saCriarUsuarioClinica`, `saAlterarStatusUsuario`, `saAlterarPerfilUsuario`, `saResetarSenhaUsuario`.

## 8. Eventos, listeners, modais e grids envolvidos

Eventos diretos identificados em `frontend/app.js`:

- `btn-login` chama `login`.
- Campo `email` chama `login` no Enter.
- Campo `senha` chama `login` no Enter.
- `btn-google-login` redireciona para `/auth/google/login`.
- Botões de cadastro e recuperação chamam funções `signup*` e `forgot*`.
- Botões de setup chamam `setupComplete` e `setupLogout`.
- `btn-sair` chama logout e limpa token, caches e estado de múltiplos módulos.
- Todos os elementos `[data-menu-action]` chamam `executarAcaoMenu`.
- `setupMenuBar()` adiciona listeners de menu, submenu, clique global e Escape.
- `users-btn-novo`, `users-btn-editar`, `users-btn-excluir`, `users-btn-impressos`, `users-btn-preferencias`, `users-btn-permissoes`, `users-btn-fechar` acionam funções do domínio usuários.
- `users-modal-ok` salva usuário; `users-modal-cancelar` fecha modal.
- `users-pass-ok` salva senha; `users-pass-cancelar` fecha modal de senha.
- `protected-pass-ok`, `protected-pass-cancelar` e Enter/Escape no input controlam grant protegido.
- `users-perm-ok`, `users-perm-cancelar`, `users-perm-fechar` controlam permissões.
- Tabs de permissões alternam entre acesso e perfis.
- Radios de módulo/função alteram nível `habilitado`, `desabilitado` ou `protegido`.
- Linhas renderizadas em `usersPermTbody` recebem listener de clique em tempo de renderização.
- Backdrops de modais fecham as janelas ao clicar fora.

Risco: os listeners são registrados em bloco central ao final do `app.js` e dependem de IDs fixos do HTML, estado global e funções globais. Separar qualquer função sem preservar ordem de carregamento e estado compartilhado pode quebrar fluxo de login, permissões ou limpeza de sessão.

## 9. Chamadas frontend/API relacionadas

Autenticação e sessão:

- `POST /login` via `fetch` direto.
- `GET /auth/google/login` via redirecionamento `window.location.href`.
- `POST /signup/request-code`.
- `POST /signup/confirm`.
- `POST /password/forgot`.
- `POST /password/reset`.
- `POST /auth/setup/complete`.
- `POST /logout`.
- `POST /auth/protected/unlock`.
- `GET /me`.

Usuários e permissões:

- `GET /admin/users`.
- `GET /admin/users/proximo-codigo`.
- `POST /admin/users`.
- `PATCH /admin/users/{user_id}`.
- `DELETE /admin/users/{user_id}`.
- `POST /admin/users/{user_id}/verify-password`.
- `GET /admin/users/permissions/schema`.
- `GET /admin/users/{user_id}/permissions`.
- `PATCH /admin/users/{user_id}/permissions`.
- `GET /admin/users/{user_id}/profiles`.
- `PATCH /admin/users/{user_id}/profiles`.
- `POST /admin/users/{user_id}/reset-password`.
- `POST /admin/users/change-password`.
- Chamadas auxiliares usadas pelo modal de usuário: `GET /cadastros/auxiliares?tipo=Tipos de usuário`, `GET /cadastros/prestadores`, `GET /cadastros/unidades-atendimento/combos`.

Licença:

- `GET /licenca/info`.
- `POST /licenca/checkout`.
- `POST /licenca/confirmar`.
- `POST /licenca/sincronizar`.

Superadmin:

- `GET /superadmin/overview`.
- `GET /superadmin/clinicas`.
- `GET /superadmin/usuarios`.
- `GET /superadmin/usuarios/export.csv`.
- `GET /superadmin/cobrancas`.
- `GET /superadmin/auditoria`.
- `POST /superadmin/usuarios`.
- `POST /superadmin/usuarios/{user_id}/reset-senha`.
- `PATCH /superadmin/usuarios/{user_id}/status`.
- `PATCH /superadmin/usuarios/{user_id}/perfil`.
- `PATCH /superadmin/clinicas/{clinica_id}/status`.
- `PATCH /superadmin/clinicas/{clinica_id}/plano`.
- `PATCH /superadmin/clinicas/{clinica_id}/trial-extra`.
- `DELETE /superadmin/clinicas/{clinica_id}`.

## 10. Endpoints backend relacionados

### `backend/routes/auth_routes.py`

Router sem prefixo. Endpoints identificados:

- `POST /login`
- `GET /auth/google/login`
- `GET /auth/google/callback`
- `GET /auth/google/calendar/callback`
- `POST /signup/request-code`
- `POST /signup/confirm`
- `POST /password/forgot`
- `POST /password/reset`
- `POST /auth/setup/complete`
- `POST /logout`
- `POST /auth/protected/unlock`
- `GET /me`

Responsabilidades misturadas: validação de e-mail/senha, códigos por e-mail, login por senha, Google OAuth, callback Google Calendar, cadastro SaaS, recuperação de senha, setup inicial obrigatório, logout, grant temporário para módulo protegido e contexto `/me`.

### `backend/routes/user_admin_routes.py`

Router com prefixo `/admin/users`, protegido por `require_module_access("usuarios")` e `require_admin_password_if_user_control_enabled("usuarios")`. Endpoints identificados:

- `GET /admin/users`
- `GET /admin/users/proximo-codigo`
- `GET /admin/users/permissions/schema`
- `POST /admin/users`
- `PATCH /admin/users/{user_id}`
- `GET /admin/users/{user_id}/permissions`
- `PATCH /admin/users/{user_id}/permissions`
- `POST /admin/users/{user_id}/verify-password`
- `GET /admin/users/{user_id}/profiles`
- `PATCH /admin/users/{user_id}/profiles`
- `PATCH /admin/users/{user_id}/active`
- `POST /admin/users/{user_id}/reset-password`
- `POST /admin/users/change-password`
- `DELETE /admin/users/{user_id}`
- `PATCH /admin/users/{user_id}/account-type`

Responsabilidades misturadas: CRUD administrativo de usuários, próximo código por clínica, validações de e-mail/senha/nome/unicidade, proteção contra usuário sistêmico, vínculos com prestador/unidade, esquema de permissões, permissões internas e Easy, perfis de acesso, vínculo com prestadores, reset/troca de senha, ativação/inativação e tipo de conta.

### `backend/routes/superadmin_routes.py`

Router com prefixo `/superadmin`. Endpoints identificados:

- `GET /superadmin/overview`
- `GET /superadmin/clinicas`
- `POST /superadmin/usuarios`
- `GET /superadmin/usuarios`
- `GET /superadmin/usuarios/export.csv`
- `POST /superadmin/usuarios/{user_id}/reset-senha`
- `PATCH /superadmin/usuarios/{user_id}/status`
- `PATCH /superadmin/usuarios/{user_id}/perfil`
- `PATCH /superadmin/clinicas/{clinica_id}/status`
- `PATCH /superadmin/clinicas/{clinica_id}/plano`
- `PATCH /superadmin/clinicas/{clinica_id}/trial-extra`
- `DELETE /superadmin/clinicas/{clinica_id}`
- `GET /superadmin/cobrancas`
- `GET /superadmin/auditoria`
- `GET /superadmin/assinaturas`

Responsabilidades misturadas: gestão de clínicas, gestão de usuários de clínicas, reset de senha, status/perfil de usuário em contexto plataforma, alteração de plano/trial/status de clínica, exclusão definitiva de clínica, exportação CSV, auditoria, cobranças, assinaturas e proteções owner/master/superadmin.

### `backend/routes/licenca_routes.py`

Router com prefixo `/licenca`. Endpoints identificados:

- `GET /licenca/info`
- `POST /licenca/checkout`
- `POST /licenca/confirmar`
- `POST /licenca/sincronizar`
- `POST/GET /licenca/mercadopago/webhook`

Responsabilidades misturadas: status de licença, checkout Mercado Pago, confirmação e sincronização de pagamento, webhook Mercado Pago, aplicação de licença em `Clinica`, sincronização com assinatura de plataforma e auditoria de licença.

## 11. Arquivos de segurança/autenticação envolvidos

`backend/security/dependencies.py`:

- `get_current_user` decodifica token, carrega usuário, bloqueia usuário inexistente/inativo/sistêmico e exige setup concluído.
- `SETUP_ALLOWED_PATHS` libera apenas `/me`, `/logout` e `/auth/setup/complete` enquanto setup não terminou.
- `require_module_access` valida permissão por módulo e aceita senha protegida ou grant temporário.
- `require_admin_password_if_user_control_enabled` força senha/admin grant quando controle de usuários está ativo em opções do sistema.

`backend/security/permissions.py`:

- Define módulos: `usuarios`, `prestadores`, `agenda`, `financeiro`, `materiais`, `procedimentos`, `anamnese`, `relatorios`, `configuracao`.
- Define níveis: `desabilitado`, `protegido`, `habilitado`.
- Define perfis-base: admin, clínica, dentista, auxiliar, funcionário administrativo, gerente administrativo e atendente.
- Mapeia módulos/funções Easy por CSV (`sis_modulo_sql.csv`, `sis_funcao_sql.csv`).
- Normaliza permissões internas e permissões Easy.
- Calcula permissões padrão por tipo de usuário.

`backend/security/jwt_handler.py`:

- Cria e decodifica JWT.
- Usa `ACCESS_TOKEN_EXPIRE_MINUTES = 60`.
- Exige `JWT_SECRET_KEY` no ambiente.

`backend/security/trial_middleware.py`:

- Bloqueia rotas sem token, exceto rotas públicas.
- Decodifica token e carrega usuário/clínica.
- Define tenant via `tenant_clinica_id`.
- Permite bypass para owner.
- Bloqueia conta suspensa e licença expirada fora de `/licenca`.

Outros arquivos críticos:

- `backend/security/tenant.py` e `tenant_context.py`: contexto de tenant por header e por `ContextVar`.
- `backend/security/superadmin.py`: owner, tipos superadmin/master/owner/vitalícia e cálculo de superadmin.
- `backend/security/admin_password.py`: resolve administrador principal da clínica e valida senha administrativa.
- `backend/security/user_context.py`: monta payload de `/me` com dados, permissões e flags de sessão.

## 12. Modelos/tabelas de banco relacionados

Identificados por leitura:

- `usuarios`: `backend/models/usuario.py`.
- `clinicas`: `backend/models/clinica.py`.
- `access_profile`: `backend/models/access_profile.py`.
- `usuario_perfil_acesso`: `backend/models/usuario_perfil_acesso.py`.
- `email_codes`: `backend/models/email_code.py`.
- `plataforma_assinaturas`: `backend/models/plataforma.py`.
- `plataforma_cobrancas`: `backend/models/plataforma.py`.
- `plataforma_auditoria`: `backend/models/plataforma.py`.
- Relações auxiliares usadas por usuários: `prestador_odonto`, `unidade_atendimento`.

Campos críticos observados:

- `usuarios.senha_hash`
- `usuarios.ativo`
- `usuarios.online`
- `usuarios.forcar_troca_senha`
- `usuarios.setup_completed`
- `usuarios.is_system_user`
- `usuarios.is_admin`
- `usuarios.permissoes_json`
- `usuarios.clinica_id`
- `usuarios.prestador_id`
- `usuarios.unidade_atendimento_id`
- `clinicas.tipo_conta`
- `clinicas.licenca_usuario`
- `clinicas.chave_licenca`
- `clinicas.trial_ate`
- `clinicas.ativo`
- `clinicas.opcoes_sistema_json`

Nenhuma leitura executou comandos de banco. Nenhum dado foi alterado.

## 13. Acoplamentos frontend x backend

Pontos de acoplamento principais:

- `frontend/app.js` espera `access_token` de `/login` e `/signup/confirm`.
- Token é persistido em `localStorage` com chave `brana_token`.
- `requestJsonBase` injeta `Authorization: Bearer <token>`.
- `TrialMiddleware` exige token para quase todas as rotas não públicas.
- `requestJson` interpreta erros textuais/estruturados de sessão/licença/protected password.
- `/me` retorna payload consumido por `carregarSessao`, `menuApplyPermissions` e visibilidade de admin/superadmin.
- Permissões no frontend usam os mesmos códigos de módulo do backend: `usuarios`, `prestadores`, `agenda`, `financeiro`, `materiais`, `procedimentos`, `anamnese`, `relatorios`, `configuracao`.
- `requestJson` pode solicitar grant protegido e repetir a requisição com `X-Brana-Protected-Grant`.
- Backend aceita `X-Protected-Grant` e também `X-Protected-Password`; o frontend auditado usa grant via `/auth/protected/unlock`.
- User admin routes dependem simultaneamente de permissão do módulo `usuarios` e senha/grant quando controle de usuários está ativo.
- O botão `btn-sair` limpa caches de muitos módulos, criando acoplamento de logout com estado global de todo o app.

## 14. Acoplamentos com superadmin, licença e tenant

- `carregarSessao()` usa `is_superadmin` para mostrar/ocultar o menu superadmin.
- `security.superadmin.is_platform_superadmin_user` depende de `is_admin`, clínica e tipo de conta.
- `TrialMiddleware` bloqueia conta suspensa e licença expirada para rotas fora de `/licenca`.
- `licenca_routes.py` altera campos da clínica usados por middleware e UI.
- `superadmin_routes.py` altera clínica, plano, trial, status, usuários e senha em nível plataforma.
- `platform_admin_service.py` sincroniza assinatura e registra auditoria.
- `tenant_context` é definido no middleware de trial com base no usuário, e `TenantMiddleware` também pode definir tenant por header.
- `owner_email` pode forçar acesso total/bypass em autenticação, middleware e superadmin.

Risco: superadmin/licença/tenant não são domínios isolados neste momento; eles participam da autenticação, bloqueio global de rotas e visibilidade de menus.

## 15. Regras de negócio misturadas no frontend

Responsabilidades misturadas no `frontend/app.js`:

- Login tradicional.
- Login Google.
- Cadastro por código.
- Recuperação de senha por código.
- Setup inicial de senha.
- Persistência de token.
- Heartbeat de sessão.
- Interpretação de erro de sessão/licença.
- Controle de menus por permissão.
- Renderização do painel de usuários.
- CRUD de usuários.
- Modal de senha.
- Modal de permissões.
- Perfil de acesso e vínculo com prestadores.
- Grant protegido por senha administrativa.
- Logout e limpeza de caches de muitos módulos.
- Licença e retorno de pagamento.
- Superadmin: clínicas, usuários, cobranças, auditoria, trial e plano.

Classificação: crítico / não mexer agora.

## 16. Regras de negócio misturadas no backend

Responsabilidades misturadas por arquivo:

- `auth_routes.py`: autenticação, cadastro, recuperação de senha, OAuth, setup, grant protegido e `/me`.
- `user_admin_routes.py`: CRUD, senha, permissões, perfis, vínculos, validações e regras de usuário sistêmico.
- `security/permissions.py`: schema moderno, schema Easy, defaults, normalização, perfis e funções.
- `security/dependencies.py`: autenticação atual, setup obrigatório, permissão de módulo e senha protegida.
- `trial_middleware.py`: token global, tenant, licença, conta suspensa e bypass owner.
- `superadmin_routes.py`: operação plataforma, usuários, clínicas, planos, trial, exclusão definitiva e auditoria.
- `licenca_routes.py`: licença, pagamento, webhook, assinatura e auditoria.
- `signup_service.py`: criação de conta SaaS e usuários sistêmicos.

Classificação: crítico / não mexer agora.

## 17. Lacunas encontradas

- Não existe módulo JS próprio para usuários/login/sessão/permissões.
- Não existe namespace frontend próprio para esses domínios.
- `frontend/js/utils` não concentra `requestJson`; o wrapper vive no `frontend/app.js`.
- O botão de logout limpa muitos caches de módulos fora do domínio de autenticação.
- Não foi feita auditoria linha a linha de todas as migrations/scripts de compatibilidade relacionados a usuários.
- Não foi feita auditoria de todos os caminhos de erro textuais por causa da blindagem textual/mojibake.
- Não foi feita auditoria de runtime real no navegador, pois esta etapa é documental.
- Não foi validado banco real nem dados existentes.
- Não foi auditado profundamente o fluxo Google Calendar, embora ele esteja dentro de `auth_routes.py`.
- Não foi auditado profundamente `signup_service.py`, que parece criar conta SaaS, usuário admin e usuário sistêmico.
- Não foi auditado profundamente `platform_admin_service.py`, que impacta assinatura e auditoria.
- Não foi auditado profundamente o uso de `tenant_clinica_id` em todos os endpoints.

## 18. Riscos críticos

- Quebrar login e impedir acesso ao sistema.
- Quebrar `/me` e impedir montagem de sessão/menu.
- Perder ou invalidar token em `localStorage`.
- Liberar módulo protegido sem senha administrativa.
- Bloquear usuários legítimos por erro em permissão ou setup.
- Permitir CRUD de usuários sem regra administrativa correta.
- Quebrar reset/troca de senha.
- Quebrar licença e bloquear todo o sistema via middleware.
- Quebrar visibilidade de superadmin ou liberar superadmin indevidamente.
- Quebrar tenant e vazar dados entre clínicas.
- Quebrar vínculos de usuário com prestador/unidade/perfil.
- Quebrar compatibilidade com permissões Easy.
- Alterar strings/mojibake em área sensível e mascarar regressões.

## 19. O que NÃO deve ser modularizado ainda

Não modularizar ainda:

- `requestJson`.
- `requestJsonBase`.
- `setToken` e `getToken`.
- `login`.
- `carregarSessao`.
- `startSessionHeartbeat` e `stopSessionHeartbeat`.
- `parseSessionIssue` e `enforceSessionIssue`.
- `hardResetSessionState` e `blockAppAndShowLogin`.
- `btn-sair` e limpeza global de caches.
- `menuApplyPermissions`, `menuEnsurePermission`, `executarAcaoMenu`.
- `ensureProtectedGrant`, `unlockProtectedGrant`, `protectedPassDialog`.
- CRUD de usuários.
- Salvamento de permissões e autosave de permissões.
- Perfis de acesso/vínculo com prestadores.
- Superadmin.
- Licença.
- Tenant/middleware de trial.
- Backend de auth/users/superadmin/licença.

Qualquer extração futura precisa começar por documentação, testes de contrato e mapa de dependências, não por movimento de helper.

## 20. Matriz de classificação por subdomínio

| Subdomínio | Frontend | Backend | Banco | Risco | Prioridade documental | Refatoração funcional |
|---|---|---|---|---|---|---|
| Login por senha | `frontend/app.js` | `auth_routes.py`, `jwt_handler.py`, `hash.py` | `usuarios` | Crítico / não mexer agora | Alta | Bloqueada |
| Google login | `frontend/app.js` | `auth_routes.py`, serviços Google | `usuarios`, `clinicas` | Alto risco | Alta | Bloqueada |
| Sessão `/me` | `frontend/app.js` | `auth_routes.py`, `user_context.py`, `dependencies.py` | `usuarios` | Crítico / não mexer agora | Alta | Bloqueada |
| Heartbeat | `frontend/app.js` | `/me`, middleware | `usuarios`, `clinicas` | Alto risco | Alta | Bloqueada |
| Logout | `frontend/app.js` | `auth_routes.py` | `usuarios` | Alto risco | Alta | Bloqueada |
| Cadastro SaaS | `frontend/app.js` | `auth_routes.py`, `signup_service.py` | `clinicas`, `usuarios`, tabelas seed | Crítico / não mexer agora | Alta | Bloqueada |
| Recuperação de senha | `frontend/app.js` | `auth_routes.py`, `email_service`, `email_codes` | `usuarios`, `email_codes` | Alto risco | Alta | Bloqueada |
| Setup obrigatório | `frontend/app.js` | `dependencies.py`, `auth_routes.py` | `usuarios.setup_completed` | Alto risco | Alta | Bloqueada |
| CRUD usuários | `frontend/app.js` | `user_admin_routes.py` | `usuarios`, `prestador_odonto`, `unidade_atendimento` | Crítico / não mexer agora | Alta | Bloqueada |
| Permissões | `frontend/app.js` | `user_admin_routes.py`, `permissions.py` | `usuarios.permissoes_json` | Crítico / não mexer agora | Alta | Bloqueada |
| Perfis de acesso | `frontend/app.js` | `user_admin_routes.py`, `access_profiles_service.py` | `access_profile`, `usuario_perfil_acesso` | Alto risco | Alta | Bloqueada |
| Grant protegido | `frontend/app.js` | `auth_routes.py`, `dependencies.py`, `admin_password.py` | `usuarios` | Crítico / não mexer agora | Alta | Bloqueada |
| Menu por permissão | `frontend/app.js`, `index.html` | `/me`, `permissions.py` | `usuarios.permissoes_json` | Alto risco | Alta | Bloqueada |
| Superadmin | `frontend/app.js` | `superadmin_routes.py`, `superadmin.py`, `platform_admin_service.py` | `clinicas`, `usuarios`, plataforma | Crítico / não mexer agora | Alta | Bloqueada |
| Licença | `frontend/app.js` | `licenca_routes.py`, `trial_middleware.py` | `clinicas`, plataforma | Crítico / não mexer agora | Alta | Bloqueada |
| Tenant | Backend global | `tenant.py`, `tenant_context.py`, `trial_middleware.py` | `clinica_id` em muitas tabelas | Crítico / não mexer agora | Alta | Bloqueada |

## 21. Ordem documental segura recomendada

1. Auditoria linha a linha de `frontend/app.js` apenas nos blocos `requestJson`, sessão, menu/permissões e grant protegido.
2. Auditoria linha a linha de `backend/security/dependencies.py`, `permissions.py`, `trial_middleware.py` e `user_context.py`.
3. Auditoria de contrato `/me`, incluindo payload esperado pelo frontend.
4. Auditoria de contrato de `/admin/users/*`, incluindo payloads de criar/editar/excluir/senha/permissões/perfis.
5. Auditoria de `auth_routes.py`, separando login, signup, forgot/reset, setup, OAuth, grant e `/me` apenas em mapa documental.
6. Auditoria de `signup_service.py` para entender criação de clínica, usuário admin, usuário sistêmico e seeds.
7. Auditoria de superadmin/licença/tenant em documento próprio.
8. Somente depois, desenhar plano de refatoração por contratos estáveis.

## 22. Recomendação conservadora

Nenhuma alteração funcional deve ocorrer antes de revisão humana deste documento. A próxima etapa recomendada é uma auditoria documental de contratos de autenticação/autorização, começando por `requestJson` + `/me` + `security/dependencies.py`, sem mover código.

Alternativa segura: criar um mapa visual de fluxo Login -> Token -> `/me` -> Menu -> Permissão -> Grant protegido -> Endpoint, ainda sem código.

## 23. Confirmação final desta etapa

- Esta auditoria não altera comportamento.
- Esta auditoria não altera payload.
- Esta auditoria não altera endpoints.
- Esta auditoria não altera banco, schema ou migrations.
- Esta auditoria não cria módulo JS.
- Esta auditoria não move helper.
- Esta auditoria respeita a regra anti-mojibake e registra riscos sem corrigir textos funcionais.
- Esta auditoria mantém a modularização funcional pausada.
