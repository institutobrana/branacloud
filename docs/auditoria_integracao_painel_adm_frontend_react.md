# Auditoria técnica da integração do painel ADM legado ao frontend React

## 1. Objetivo

Auditar tecnicamente o caminho atual do acesso ADM no frontend legado, no backend e no frontend React, para planejar uma futura integração segura do item `ADM` no menu do React sem alterar comportamento funcional nesta etapa.

## 2. Escopo

- Auditoria somente leitura do Git, documentos, frontend legado, backend, modelos e frontend React.
- Sem alteração de código funcional.
- Sem alteração de banco.
- Sem migration.
- Sem criação de rota.
- Sem commit.
- Sem push.
- Somente documentação nova pode ser criada ou alterada nesta etapa.

## 3. Estado inicial do Git

- Diretório usado: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch atual: `modularizacao-segura-fase-1`
- Remote confirmado: `origin https://github.com/institutobrana/branacloud.git`
- HEAD inicial: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`
- `git status --short`: worktree sujo, com múltiplos arquivos modificados, excluídos e não rastreados já existentes antes desta etapa
- `git diff --cached --name-only`: vazio
- `git rev-list --left-right --count origin/modularizacao-segura-fase-1...modularizacao-segura-fase-1`: `0 0`

Observação: o worktree já estava bastante alterado por outras frentes. Nenhuma dessas alterações foi limpa, revertida ou sobrescrita.

## 4. Documentos consultados

Leitura inicial obrigatória:

- `[README.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/README.md)`
- `[docs/00_master_guide.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/00_master_guide.md)`
- `[docs/02_arquitetura.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/02_arquitetura.md)`
- `[docs/03_mapa_codigo.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/03_mapa_codigo.md)`
- `[docs/06_seguranca.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/06_seguranca.md)`
- `[docs/10_continuidade.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/10_continuidade.md)`

Documentos adicionais relevantes:

- `[docs/11_roadmap_desenvolvimento.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)`

## 5. Arquivos auditados

### Frontend legado

- `[frontend/index.html](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/index.html)`
- `[frontend/app.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)`

### Backend

- `[backend/routes/auth_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/auth_routes.py)`
- `[backend/security/dependencies.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/dependencies.py)`
- `[backend/security/permissions.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/permissions.py)`
- `[backend/security/superadmin.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/superadmin.py)`
- `[backend/security/user_context.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/user_context.py)`
- `[backend/routes/user_admin_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/user_admin_routes.py)`
- `[backend/routes/superadmin_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/superadmin_routes.py)`
- `[backend/routes/system_options_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/system_options_routes.py)`
- `[backend/routes/odontograma_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/odontograma_routes.py)`

### Frontend React

- `[frontend-react/src/app/App.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/app/App.jsx)`
- `[frontend-react/src/app/basePath.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/app/basePath.js)`
- `[frontend-react/src/features/auth/AuthProvider.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/AuthProvider.jsx)`
- `[frontend-react/src/features/auth/authApi.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authApi.js)`
- `[frontend-react/src/features/auth/authStorage.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authStorage.js)`
- `[frontend-react/src/features/auth/authBrowserSessionSync.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authBrowserSessionSync.js)`
- `[frontend-react/src/features/auth/authProviderSession.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authProviderSession.js)`
- `[frontend-react/src/features/auth/authRenewalController.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authRenewalController.js)`
- `[frontend-react/src/features/auth/LoginPage.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/LoginPage.jsx)`
- `[frontend-react/src/layout/branaTopbarIcons.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/layout/branaTopbarIcons.jsx)`

## 6. Funcionamento atual do acesso ADM no legado

O painel ADM já existe no frontend legado e é exposto como um painel interno da aplicação, não como uma rota nova dedicada.

Elementos encontrados:

- Texto do item no menu: `Painel ADM`
- Seletor: `#menu-superadmin-action`
- Classe de ocultação: `hidden`
- Evento de acionamento: clique do menu superior "Sobre" e do botão de atalho no topo

No HTML legado:

- O item aparece em `[frontend/index.html](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/index.html)` como `<button id="menu-superadmin-action" ... data-menu-action="superadmin">Painel ADM</button>`.
- Há também um botão no canto superior direito com `id="btn-open-users"` e título `Painel administrador`.

No JavaScript legado:

- O botão de topo chama `abrirPainelAdministradorToolbar()`.
- Essa função decide entre abrir o painel `superadmin-panel` ou o painel de usuários, dependendo do usuário atual.
- Não foi encontrada navegação para uma URL separada do tipo `/adm` ou `/admin`; a abertura é interna, dentro do shell atual.

## 7. Rota real do painel ADM

Não foi encontrada rota HTTP dedicada do painel ADM no frontend legado.

O que existe hoje é:

- painel interno `superadmin-panel` dentro da tela principal do legado;
- ação de menu `data-menu-action="superadmin"`;
- atalho de toolbar `#btn-open-users`.

Conclusão técnica:

- A “rota” real do painel ADM hoje é um painel interno da página `/app` do legado, e não uma URL própria.
- Portanto, a futura integração no React provavelmente deverá disparar uma transição para o legado em `/app`, ou abrir uma entrada de tela equivalente no shell legado, em vez de inventar uma rota nova.

## 8. Estrutura principal do painel legado

Arquivos principais relacionados ao painel administrativo legado:

- `[frontend/index.html](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/index.html)`
- `[frontend/app.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)`
- `[backend/routes/user_admin_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/user_admin_routes.py)`
- `[backend/routes/superadmin_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/superadmin_routes.py)`
- `[backend/routes/system_options_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/system_options_routes.py)`

Componentes visuais no HTML legado:

- `#superadmin-panel`
- `#menu-superadmin-action`
- `#btn-open-users`
- `#menu-superadmin-sep`
- `#user-role`

## 9. Regra real de visibilidade no legado

A visibilidade do item `Painel ADM` no legado não depende apenas de e-mail na interface. Há uma combinação de regras:

- `current_user.is_superadmin` mostra o painel de superadmin.
- `current_user.is_admin` permite abrir o painel de usuários.
- O backend reconhece `is_admin` também em conjunto com e-mail proprietário e tipo da clínica.

No frontend legado, a abertura do painel é controlada por `sessaoAtual?.is_superadmin` e `sessaoAtual?.is_admin`.

No backend, o usuário proprietário reconhecido por e-mail é tratado como `is_admin = True` e com acesso total.

## 10. Regra real de autorização no backend

### 10.1 Autenticação e sessão

- `POST /login` autentica por e-mail e senha.
- `GET /me` expõe o contexto do usuário autenticado.
- `POST /logout` e `POST /auth/renew` fazem parte do ciclo de sessão.

### 10.2 Fonte da autorização

O backend usa principalmente:

- token JWT com `user_id`, `clinica_id` e `is_admin`;
- recuperação do usuário real no banco;
- `current_user.is_admin`;
- `is_owner_email()` para o e-mail proprietário;
- `is_platform_superadmin_user()` para superadmin de plataforma;
- `require_module_access(module_code)` para autorização por módulo;
- `require_admin_password_if_user_control_enabled(module_code)` para proteção adicional em módulos protegidos.

### 10.3 Comportamento do `get_current_user`

- token inválido ou ausente: `401`
- usuário não encontrado: `401`
- conta sistêmica: `403`
- usuário inativo: `403`
- setup incompleto fora das exceções permitidas: `403`
- e-mail proprietário: o usuário é promovido em memória para `active=True` e `is_admin=True`

### 10.4 Superadmin de plataforma

O superadmin de plataforma é decidido por:

- e-mail proprietário listado em `OWNER_BYPASS_EMAILS` ou `OWNER_MASTER_EMAIL`, com fallback para `gleissontel@gmail.com`;
- ou usuário com `is_admin=True` e clínica marcada como conta `SUPERADMIN`, `MASTER`, `OWNER` ou equivalente.

### 10.5 Autorização por módulo

`require_module_access()` consulta o nível de acesso do módulo:

- `habilitado`: libera
- `protegido`: exige senha administrativa ou grant temporário
- `desabilitado`: nega com `403`

## 11. Modelos e campos relacionados

Modelos/entidades relevantes observados:

- `Usuario`
- `Clinica`
- `AccessProfile`
- `UsuarioPerfilAcesso`

Campos/chaves relevantes:

- `Usuario.email`
- `Usuario.is_admin`
- `Usuario.clinica_id`
- `Usuario.tipo_usuario`
- `Usuario.permissoes_json`
- `Usuario.preferencias_usuario_json`
- `Usuario.setup_completed`
- `Clinica.opcoes_sistema_json`
- `Clinica.tipo_conta`
- `AccessProfile.id`
- `AccessProfile.nome`
- `AccessProfile.is_admin`

Achado importante:

- `gleissontel@gmail.com` aparece como e-mail proprietário no fallback de `security/superadmin.py`.
- Isso é uma regra configurável por variável de ambiente, mas com fallback hardcoded para esse e-mail.

## 12. Dados administrativos já disponíveis no React

O React já recebe, via `/me`, um contexto que contém:

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
- `preferencias_usuario_json`
- `preferencias_gerais`

Conclusão:

- O React já possui informação suficiente para distinguir um `is_admin` e um `is_superadmin` sem depender apenas de e-mail.
- Isso permite futura exibição condicional do item `ADM` sem novo endpoint, desde que a regra de visibilidade siga o contrato real do backend.

## 13. Componente do menu superior direito do React

O componente do canto superior direito do React está em:

- `[frontend-react/src/app/App.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/app/App.jsx)`

Elementos observados:

- `BranaActionTopbar` e a área de topo da aplicação
- `useAuth()` para `user`, `isAuthenticated`, `loading`, `signOut`
- navegação baseada em `appPath()`
- login separado em `[frontend-react/src/features/auth/LoginPage.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/LoginPage.jsx)`

Não foi encontrado, nesta etapa, um item `ADM` já implementado no menu do React.

## 14. Funcionamento atual da sessão entre React e legado

### 14.1 Mecanismo de sessão

- O token fica no `localStorage` com a chave `brana_token`.
- As chamadas autenticadas usam `Authorization: Bearer <token>`.
- O React faz `POST /login`, depois `GET /me`.
- Há renovação automática via `POST /auth/renew`.
- Há sincronização entre abas via eventos de `storage`, `visibilitychange` e `focus`.

### 14.2 Compartilhamento com o legado

O legado também usa o mesmo token JWT e a mesma origem/aplicação.

Conclusão prática:

- A navegação do React para o legado tende a preservar a sessão desde que continue na mesma origem e o token no `localStorage` permaneça válido.
- Não foram encontrados sinais de cookie de sessão como mecanismo principal.
- Não foi identificada barreira de autenticação entre React e legado que impeça a reaproveitação do mesmo token no navegador.

### 14.3 Cookies, SameSite e Secure

- Não identifiquei cookies de sessão como fonte principal do fluxo atual.
- Não foi possível confirmar atributos `SameSite` e `Secure` como base do compartilhamento porque a sessão operacional observada é centrada em JWT no `localStorage`.

## 15. Diferenças relevantes entre local e AWS

Baseada na documentação e no código consultado:

- Em local, o sistema usa `/app`, `/frontend`, `/legado` e `/react` com o backend servindo os assets da aplicação.
- O React usa `appPath()` para respeitar a base atual.
- O `README` e a arquitetura reforçam que o backend serve o legado em `/app` e o React em `/react`.
- A URL de produção citada em documentos anteriores usa `app.institutobrana.com.br`, então a navegação entre surfaces precisa preservar origem e token.

Risco técnico observado:

- qualquer divergência entre base path local e AWS pode quebrar redirecionamento, fallback ou navegação do React para o legado.

## 16. Endpoints administrativos encontrados

Endpoints relevantes encontrados durante a auditoria:

- `POST /login`
- `GET /me`
- `POST /logout`
- `POST /auth/renew`
- `/admin/users/*`
- `/superadmin/*`
- `/system-options`
- `/odontograma/*`

Observação:

- Nem todo endpoint listado acima é “ADM puro”, mas todos entram na trilha de autorização/gestão administrativa.

## 17. Matriz resumida de proteção dos endpoints

| Endpoint | Finalidade | Mecanismo de proteção | Comportamento sem autorização | Risco encontrado |
|---|---|---|---|---|
| `POST /login` | Autenticação inicial | valida e-mail/senha, bloqueia conta sistêmica e inativo | `400`/`403` | baixo |
| `GET /me` | Retorna contexto do usuário | `get_current_user` com JWT | `401`/`403` | baixo |
| `POST /logout` | Encerra sessão | JWT atual | `401` se token inválido; senão resposta de saída | baixo |
| `POST /auth/renew` | Renova token | JWT atual | `401`/`403` quando sessão inválida | baixo |
| `/admin/users/*` | CRUD de usuários/perfis/permissões | `require_module_access("usuarios")` + senha administrativa quando módulo protegido + `_require_admin` em várias ações | `403` | médio |
| `/superadmin/*` | Administração da plataforma | `is_platform_superadmin_user()` | `403` | médio-alto |
| `/system-options` | Preferências da clínica | `require_module_access("configuracao")` + senha administrativa se controle ativado + `is_admin` | `403` | médio |
| `/odontograma/*` | Leitura clínica | `get_current_user` + verificação de clínica para alvos fora do usuário | `403` | baixo-médio |

## 18. Riscos de segurança

- Regra proprietária baseada em e-mail com fallback hardcoded para `gleissontel@gmail.com`.
- Superadmin de plataforma depende de combinação de e-mail e estado da clínica.
- Módulos “protegidos” aceitam senha administrativa ou grant temporário via header.
- O frontend não é barreira de segurança.
- O React já possui dados suficientes para exibir papel administrativo, mas isso não substitui validação server-side.
- A navegação entre React e legado pode expor divergência de base path se o roteamento não respeitar `/app` e `/react`.

## 19. Lacunas encontradas

- Não existe item `ADM` ainda no React.
- Não existe rota própria do painel ADM; ele é um painel interno do legado.
- A regra do e-mail proprietário usa fallback hardcoded no código.
- Não há uma documentação única consolidando a integração React -> painel ADM legado.
- Não foi encontrada evidência de que o React já redirecione automaticamente para o painel ADM legado.

## 20. Arquivos candidatos para futura alteração

Arquivos que provavelmente serão alterados numa implementação futura:

- `[frontend-react/src/app/App.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/app/App.jsx)`
- `[frontend-react/src/layout/BranaActionTopbar.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/layout/BranaActionTopbar.jsx)`
- `[frontend-react/src/features/auth/AuthProvider.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/AuthProvider.jsx)`
- `[frontend-react/src/app/basePath.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/app/basePath.js)`
- `[frontend/index.html](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/index.html)`
- `[frontend/app.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)`

## 21. Estratégia recomendada para implementação

1. Expor o item `ADM` apenas para usuários com `is_admin` ou `is_superadmin` reais, preferindo a informação vinda de `/me`.
2. Ao clicar, abrir o painel legado em uma navegação controlada para manter sessão e evitar inventar nova rota.
3. Preservar o backend como fonte de verdade para autorização.
4. Não depender só do e-mail no React.
5. Se o objetivo for acesso ao painel legado, tratar a integração como ponte de navegação, não como duplicação do painel.

## 22. Etapas recomendadas

1. Definir o contrato de visibilidade do item `ADM` no React.
2. Definir a ação de navegação segura para o legado.
3. Implementar apenas o item de menu.
4. Validar que `is_admin` e `is_superadmin` vêm corretos em `/me`.
5. Validar manutenção de sessão ao transitar entre React e legado.
6. Só depois considerar migração futura do conteúdo administrativo para React.

## 23. Testes obrigatórios

- Login válido.
- Login sem permissão administrativa.
- Login como usuário não autorizado para verificar ocultação do item `ADM`.
- Acesso direto ao painel legado sem sessão válida.
- Acesso direto ao painel legado com sessão válida.
- Transição React -> legado preservando token/sessão.
- Verificação de respostas `401` e `403` no backend para módulos administrativos.

## 24. Critérios de aceite

- O item `ADM` aparece apenas para o público correto.
- O clique abre o painel legado real.
- A sessão é preservada na transição.
- O backend continua bloqueando acesso indevido.
- Nenhuma regra sensível foi movida para o frontend.
- Nenhum banco, migration ou endpoint novo foi criado nesta etapa.

## 25. Confirmação explícita

Nesta etapa, nenhum código funcional, backend ou banco foi alterado por mim.

## 26. Observação sobre roadmap

Localizei o roadmap oficial aplicável em `[docs/11_roadmap_desenvolvimento.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/11_roadmap_desenvolvimento.md)`, mas não o alterei nesta passagem porque a frente ainda estava em contexto de auditoria e havia documentação concorrente já em andamento no repositório. A dúvida foi registrada aqui para evitar conflito documental.

## 27. Inventário funcional para migração modular

### Visão geral

O painel ADM legado não é uma única tela simples. Ele reúne três blocos principais:

- `Usuarios` para gestão de usuários da clínica.
- `Painel ADM` para visão de plataforma/superadmin.
- `Opções do sistema` e áreas adjacentes de configuração sensível.

### Matriz funcional

| Area/funcao | Finalidade | Arquivos principais do legado | Funcoes JS relacionadas | Elementos HTML relacionados | Endpoints utilizados | Metodos HTTP | Modelos e tabelas | Regra de autorizacao | Exige senha admin | Tipo | Risco | Dependencias em estado global/DOM | Backend reaproveitavel | Possivel ajuste backend | Prioridade de migracao | Testes necessarios |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Usuarios do sistema | listar, criar, editar, excluir, alterar senha, permissao e perfil de usuarios da clinica | `frontend/index.html`, `frontend/app.js`, `backend/routes/user_admin_routes.py` | `abrirPainelAdministradorToolbar`, `showUsersPanel`, `carregarUsuarios`, `usersAtualizarAcoesToolbar`, `usersPermConfirmPassword`, `usersPermAutoSave`, `usersSalvarPermissoes` | `#btn-open-users`, `#users-panel`, `#users-btn-novo`, `#users-btn-editar`, `#users-btn-excluir`, `#users-btn-permissoes`, `#users-btn-preferencias`, `#users-btn-impressos`, `#users-btn-fechar` | `/admin/users`, `/admin/users/permissions/schema`, `/admin/users/{id}`, `/admin/users/{id}/permissions`, `/admin/users/{id}/profiles`, `/admin/users/{id}/status`, `/admin/users/{id}/reset-password`, `/admin/users/{id}/verify-password` | `GET`, `POST`, `PATCH`, `DELETE` | `Usuario`, `AccessProfile`, `UsuarioPerfilAcesso`, `PrestadorOdonto`, `RelatorioConfig`, `ControleProtetico`, `Tratamento` | `require_module_access("usuarios")`, `require_admin_password_if_user_control_enabled("usuarios")`, `_require_admin`, `is_admin` | Sim, para funcoes protegidas e permissao | gestao | alto | depende de `sessaoAtual`, `usersCache`, `usersPermSchema`, `usersSelecionadoId`, DOM legado e modal/overlay | Sim | pequeno/medio, se houver consolidacao de respostas e ajuste de permissao fina | primeira fase apos a fundacao ADM | login, sem auth, admin comum, superadmin, alteracao de permissao, troca de senha, exclusao, tenant, `401`/`403` |
| Painel ADM da plataforma | ver clinics, usuarios, cobrancas, auditoria e assinaturas da plataforma | `frontend/index.html`, `frontend/app.js`, `backend/routes/superadmin_routes.py`, `backend/services/platform_admin_service.py` | `showSuperAdminPanel`, `saRecarregarTudo`, `saCarregarOverview`, `saCarregarClinicas`, `saCarregarUsuarios`, `saCarregarCobrancas`, `saCarregarAuditoria`, `saAlterarStatusClinica`, `saAlterarPlanoClinica`, `saProrrogarTesteClinica`, `saExcluirClinica`, `saCriarUsuarioClinica`, `saAlterarStatusUsuario`, `saAlterarPerfilUsuario`, `saResetarSenhaUsuario` | `#superadmin-panel`, `#menu-superadmin-action`, `#menu-superadmin-sep`, `#sa-clinicas-q`, `#sa-usuarios-q`, `#sa-usuarios-admin`, `#sa-usuarios-plano`, `#sa-online-summary`, `#sa-clinicas-tbody`, `#sa-usuarios-tbody`, `#sa-cobrancas-tbody`, `#sa-auditoria-tbody` | `/superadmin/overview`, `/superadmin/clinicas`, `/superadmin/usuarios`, `/superadmin/usuarios/export.csv`, `/superadmin/usuarios/{id}/reset-senha`, `/superadmin/usuarios/{id}/status`, `/superadmin/usuarios/{id}/perfil`, `/superadmin/clinicas/{id}/status`, `/superadmin/clinicas/{id}/plano`, `/superadmin/clinicas/{id}/trial-extra`, `/superadmin/clinicas/{id}`, `/superadmin/cobrancas`, `/superadmin/auditoria`, `/superadmin/assinaturas` | `GET`, `POST`, `PATCH`, `DELETE` | `Clinica`, `Usuario`, `Assinatura`, `PlataformaAssinatura`, `PlataformaAuditoria`, `PlataformaCobranca` | `is_platform_superadmin_user()`, `is_owner_email()`, `_require_superadmin` | Sim, em varias acoes destrutivas e sensiveis | consulta, alteracao, exclusao, configuracao, diagnostico | critico | depende fortemente de `sessaoAtual.is_superadmin`, `sa*Cache`, filtros, tabelas e modais do DOM legado | Sim | medio/alto, mas requer recorte funcional e separacao por area | segunda frente apos usuarios e fundacao ADM | `401`/`403`, listagem, filtros, exportacao, reset de senha, alteracao de status/plano, exclusao, auditoria |
| Opcoes do sistema | ler e salvar configuracoes da clinica | `frontend/index.html`, `frontend/app.js`, `backend/routes/system_options_routes.py` | `showSystemOptions`, `sysOptCarregar`, `sysOptSalvar`, `closeWorkspacePanel`, `menuApplyPermissions` | `#sysopt-seg-usuarios`, `#config-opcoes-sistema`, `#config-preferencias`, `#config-indices-backdrop` | `/system-options` | `GET`, `PATCH` | `Clinica`, `CategoriaFinanceira`, `ItemAuxiliar` | `require_module_access("configuracao")`, `require_admin_password_if_user_control_enabled("configuracao")`, `_garantir_admin` | Sim, quando controle de usuarios esta ativo | configuracao | medio/alto | depende de `sysOptCfg`, `sessaoAtual`, painel/modal legado e flags de seguranca | Sim | pequeno | fundacao ADM ou area de configuracao compartilhada | leitura, alteracao, sem auth, sem permissao, senha administrativa, tenant errado |
| Licenca e estado de plano | mostrar e validar informacoes de licenca/plano da conta | `frontend/app.js`, `backend/routes/licenca_routes.py`, `backend/security/trial_middleware.py` | `licCarregarInfo`, `licUpdateBadge`, `licConfirmarPagamentoRetorno` | `#user-license`, `#licenca-panel`, `#menu-superadmin-action` | `/licenca/*`, dependendo do fluxo | `GET`, `POST`, `PATCH` | `Clinica`, `Plano`, `Assinatura`, `PlataformaAssinatura` | valida `is_owner_email`, `is_superadmin_account_type`, regras de trial/licenca | nao como regra principal, mas pode exigir senha em fluxos associados | consulta/configuracao/operacional | medio | depende do estado global do app, `licInfoCache` e badge de licenca | Sim | pequeno/medio, se a tela for trazida para contexto administrativo | fase posterior, se houver consolidacao de visao de plataforma | fluxo de licenca, superadmin, owner, expiracao, retorno de pagamento, `401`/`403` |
| Preferencias do usuario vinculadas ao contexto administrativo | salvar preferencias e estados auxiliares exibidos na area administrativa | `frontend/app.js`, `backend/routes/preferences_routes.py`, `frontend/index.html` | `pref*`, `sysOpt*`, `usersAtualizarAcoesToolbar` | `#config-preferencias`, `#preferencias-modal` e modais correlatos | `/preferences/*` | `GET`, `PATCH`, `POST` conforme rota | `Usuario`, `Clinica`, tabelas auxiliares | `require_module_access("configuracao")` e validacoes por usuario | nao necessariamente | configuracao | medio | depende de `preferenciasUsuario` e contexto do usuario atual | Sim | pequeno | pode ser reaproveitado por areas do ADM React | leitura, salvamento, controle de permissao, `401`/`403` |

### Grupos funcionais identificados

- Usuarios da clinica.
- Superadmin da plataforma.
- Configuracoes de sistema.
- Licenca e plano.
- Preferencias associadas ao contexto administrativo.

### Dependencias criticas do `app.js`

- `sessaoAtual`
- `usersCache` e demais caches de tabelas
- `sa*` para o painel de plataforma
- `sysOptCfg` para opcoes do sistema
- `menuApplyPermissions`
- `showUsersPanel` e `showSuperAdminPanel`
- `requestJson`
- `protectedGrantCache` e senha administrativa

### Dependencias criticas do DOM legado

- `#menu-superadmin-action`
- `#menu-superadmin-sep`
- `#btn-open-users`
- `#superadmin-panel`
- `#users-panel`
- `#users-panel-backdrop`
- `#users-modal-backdrop`
- `#users-pass-backdrop`
- `#users-perm-backdrop`
- `#sysopt-*`

### Estrategia de desacoplamento

- Usar o legado apenas como fonte de auditoria.
- Migrar por area, sem copiar o monolito.
- Reaproveitar endpoints e validacoes quando o contrato ja for seguro.
- Separar listas, formularios, estados e permissoes por feature.
- Manter o backend como fonte de verdade para autorizacao.

## 28. Mapeamento exaustivo da frente ADM

### 28.1 Inventario de campos, filtros, indicadores, tabelas, colunas e acoes

Os elementos abaixo foram extraidos do bloco legado `frontend/index.html` e das funcoes associadas em `frontend/app.js` e `backend/routes/superadmin_routes.py`.

| Categoria | Elemento | Texto/label | Observacao funcional |
|---|---|---|---|
| Entrada | `#menu-superadmin-action` | Painel ADM | Menú/entrada para o painel de plataforma |
| Entrada | `#btn-open-users` | Painel administrador | Acesso rapido para usuarios da clinica |
| Botao | `#superadmin-btn-refresh` | Atualizar | Recarrega todo o painel superadmin |
| Filtro | `#sa-clinicas-q` | Buscar clínicas | Busca por nome/e-mail no servidor |
| Filtro | `#sa-clinicas-status` | Status clínica | Filtra lista de clinicas por status |
| Filtro | `#sa-usuarios-q` | Buscar usuários | Busca por nome/e-mail no servidor |
| Filtro | `#sa-usuarios-ativo` | Ativo | Filtra usuarios por ativo/inativo |
| Filtro | `#sa-usuarios-admin` | Admin | Filtra usuarios por perfil |
| Filtro | `#sa-usuarios-plano` | Plano | Filtra usuarios pela assinatura/plano da clinica |
| Filtro | `#sa-usuarios-clinica-status` | Status clínica | Filtra usuarios pelo status da clinica vinculada |
| Botao | `#sa-clinicas-filtrar` | Filtrar | Recarrega a lista de clínicas |
| Botao | `#sa-usuarios-filtrar` | Filtrar | Recarrega a lista de usuários |
| Botao | `#sa-usuarios-exportar` | Exportar CSV | Exporta usuários da plataforma em CSV |
| Indicador | `#sa-online-summary` | Usuário/Clínica online | Resumo textual de sessões online |
| Indicador | `#sa-total-clinicas` | Total clínicas | Total do overview |
| Indicador | `#sa-total-usuarios` | Total usuários | Total do overview |
| Indicador | `#sa-mrr` | MRR | Valor estimado em BRL |
| Indicador | `#sa-arr` | ARR | Valor estimado em BRL |
| Indicador | `#sa-clinicas-ativas` | Ativas | Contagem de clínicas ativas |
| Indicador | `#sa-clinicas-trial` | Trial | Contagem de clínicas em trial |
| Indicador | `#sa-clinicas-expiradas` | Expiradas | Contagem de clínicas expiradas |
| Indicador | `#sa-clinicas-suspensas` | Suspensas | Contagem de clínicas suspensas |
| Indicador | `#sa-clinicas-sem-usuario` | Sem usuário | Contagem de clínicas sem usuário |
| Indicador | `#sa-clinicas-arquivadas` | Arquivadas | Contagem de contas arquivadas |
| Tabela | `#sa-clinicas-tbody` | Clínicas | Lista principal de clínicas |
| Tabela | `#sa-usuarios-tbody` | Usuários | Lista principal de usuários |
| Tabela | `#sa-cobrancas-tbody` | Cobranças | Lista de cobranças da plataforma |
| Tabela | `#sa-auditoria-tbody` | Auditoria | Lista de auditoria da plataforma |
| Ação de linha | `data-sa-action="trial-extra"` | +Teste | Prorroga o trial da clínica |
| Ação de linha | `data-sa-action="toggle"` | Suspender/Ativar | Alterna estado da clínica |
| Ação de linha | `data-sa-action="demo"` | Demo | Aplica plano demo |
| Ação de linha | `data-sa-action="mensal"` | Mensal | Aplica plano mensal |
| Ação de linha | `data-sa-action="anual"` | Anual | Aplica plano anual |
| Ação de linha | `data-sa-action="superadmin"` | Super Admin | Aplica plano superadmin |
| Ação de linha | `data-sa-action="novo-user"` | Novo usuário | Cria usuário na clínica |
| Ação de linha | `data-sa-action="excluir-clinica"` | Excluir | Remove clínica definitivamente |
| Ação de linha | `data-sa-user-action="toggle-status"` | Desativar/Ativar | Alterna ativo do usuário |
| Ação de linha | `data-sa-user-action="toggle-admin"` | Tornar admin/Remover admin | Alterna perfil administrativo |
| Ação de linha | `data-sa-user-action="reset-senha"` | Reset senha | Redefine senha do usuário |

### 28.2 Quantidades consolidadas

- Campos/entradas mapeados: 10
- Filtros: 5
- Indicadores: 9
- Tabelas principais: 4
- Colunas principais consolidadas: 21
- Ações de linha: 10
- Endpoints de plataforma mapeados: 14

### 28.3 Matriz resumida por area funcional

| Area | Funcoes/elementos | Backend relacionado | Observacao de paridade |
|---|---|---|---|
| Usuarios da clinica | listar, criar, editar, excluir, permissao, preferencia, impressos | `/admin/users/*` | React precisa modularizar por lista, modal, permissao e senha |
| Superadmin da plataforma | overview, clinicas, usuarios, cobrancas, auditoria, assinaturas | `/superadmin/*` | Regra de acesso e `is_owner_email` sao criticas |
| Licenca/assinatura | info, checkout, sincronizacao | `/licenca/*` | Pode compor area administrativa, mas e um fluxo separado |
| Opcões do sistema | leitura/salvamento de configuracoes da clinica | `/system-options` | Depende de tenant e de controle administrativo |

### 28.4 Inconsistencias e pontos a validar

- Existem dois rótulos `Status clínica`, mas com escopos diferentes: um filtra clínicas e outro filtra a clínica vinculada ao usuário.
- `MRR` e `ARR` sao derivados de assumacoes codificadas no backend, nao de um valor manual do frontend.
- O painel de usuários da clínica e o painel superadmin coexistem no mesmo legado, mas tem permissões distintas.
- `MASTER` no legado esta ligado a email/propriedade de clínica, não a simples `is_admin`.
- A exclusão de clínica é definitiva e exige migração/limpeza de dependências.
