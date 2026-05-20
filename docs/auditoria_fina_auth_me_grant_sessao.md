# Auditoria fina documental — auth, /me, grant protegido e sessão

## 1. Resumo executivo

Esta auditoria fina detalha o núcleo que sustenta toda a aplicação: login, logout, carregamento de sessão, heartbeat de sessão, `/me`, grant protegido e desbloqueio administrativo. O objetivo é documentar o fluxo real e os pontos frágeis antes de qualquer refatoração futura.

A leitura consolidada é simples e importante: este núcleo não é apenas um conjunto de helpers de autenticação. Ele controla a entrada no sistema, a manutenção da sessão, a leitura do perfil ativo, a visibilidade do menu, o desbloqueio de módulos protegidos e a transição entre login, setup e uso normal da aplicação.

Qualquer mudança pequena nesse fluxo pode quebrar o acesso global ao Brana Cloud.

## 2. Escopo e branch

- Branch confirmada: `modularizacao-segura-fase-1`
- Projeto: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Etapa: exclusivamente documental e de leitura
- Nenhuma alteração de código foi feita

## 3. Arquivos analisados

Frontend e contrato de sessão:

- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules`
- `frontend/js/utils`

Backend e segurança:

- `backend/main.py`
- `backend/routes/auth_routes.py`
- `backend/security/dependencies.py`
- `backend/security/permissions.py`
- `backend/security/trial_middleware.py`
- `backend/security/user_context.py`
- `backend/services/signup_service.py`
- arquivos correlatos de `backend/routes` ligados a auth e admin

Auditorias anteriores usadas apenas como contexto:

- inventário mestre
- usuários/permissões/login/sessão
- contratos auth/requestJson/me/security
- matriz de endpoints autenticados
- requestJson por categorias
- matriz mestre de prioridade e risco

## 4. Blocos e funções do frontend envolvidos

As funções e blocos mais diretamente envolvidos no núcleo são:

- `setToken()`
- `getToken()`
- `clearAuth`/limpeza de token e sessão no fluxo de saída
- `handleSessionIssue()`
- `startSessionHeartbeat()`
- `stopSessionHeartbeat()`
- `requestJsonBase()`
- `requestJson()`
- `unlockProtectedGrant()`
- `ensureProtectedGrant()`
- `login()`
- `signupConfirm()`
- `setupComplete()`
- `setupLogout()`
- `carregarSessao()`
- o handler do botão `btn-sair`
- a lógica de `menuApplyPermissions()` acionada após sessão
- `abrirTelaSetup()`
- `abrirPainelAdministradorToolbar()` quando depende de sessão/visibilidade

## 5. Fluxo sequencial do login até o carregamento de sessão

### 5.1 Login

1. O usuário preenche email e senha.
2. `login()` monta `URLSearchParams` com `username` e `password`.
3. O frontend faz `POST /login` via `fetch()` direto, não via `requestJson()`.
4. Se a resposta é válida, o frontend grava o `access_token` em `localStorage` com a chave `brana_token`.
5. Em seguida chama `carregarSessao()`.

### 5.2 Carregamento de sessão

1. `carregarSessao()` lê o token salvo por `getToken()`.
2. Se não houver token, o sistema permanece na tela de login.
3. Se houver token, o frontend chama `GET /me` usando `requestJson(..., auth=true)`.
4. Se `/me` falhar por sessão inválida, o fluxo cai em `handleSessionIssue()`.
5. Se `/me` retornar com sucesso, `sessaoAtual` é preenchida.
6. O frontend atualiza `userEmail`, `userRole`, visibilidade de usuários, estado de superadmin e permissões do menu.
7. O fluxo então chama `menuApplyPermissions()`.
8. Também chama `licCarregarInfo()` quando a licença precisa ser sincronizada com a sessão.
9. Por fim, `startSessionHeartbeat()` é ativado para manter o vínculo com `/me`.

## 6. Fluxo sequencial do `/me` até menu, setup e permissões

### 6.1 `/me` como leitura central de sessão

O endpoint `/me` é a fonte de verdade do perfil autenticado. Ele alimenta o estado global com dados do usuário e da clínica ativa.

### 6.2 Efeitos diretos no frontend

1. `carregarSessao()` preenche `sessaoAtual`.
2. `sessaoAtual.permissoes` é usada por `menuApplyPermissions()`.
3. `sessaoAtual.is_admin` e `sessaoAtual.is_superadmin` controlam a visibilidade de áreas administrativas.
4. `sessaoAtual.setup_completed` determina se o usuário deve seguir para a tela de setup ou para a aplicação normal.
5. `sessaoAtual.clinica_id` entra em chaves de storage e contexto por clínica.
6. `sessaoAtual.prestador_id` e `sessaoAtual.unidade_atendimento_id` afetam filtros e escolhas padrão em áreas como agenda, prestadores e formulários correlatos.
7. `sessaoAtual.email`, `nome`, `apelido` e `codigo` são usados em rótulos, contexto e salvamento de preferências.
8. `sessaoAtual.is_superadmin` libera o painel de superadmin e oculta áreas que não fazem sentido para essa conta.

### 6.3 Impacto em setup

Se o retorno de `/me` ou o estado carregado indicar setup incompleto, o frontend chama `abrirTelaSetup()`. Esse fluxo bloqueia a navegação normal até que a senha interna seja definida.

## 7. Fluxo sequencial do erro protegido e grant protegido

### 7.1 Detecção do erro protegido

1. `requestJson()` executa uma chamada autenticada.
2. Se a resposta indica erro protegido, `requestJson()` identifica o contrato de desbloqueio.
3. O erro protegido contém módulo e mensagem suficientes para orientar o prompt.

### 7.2 Desbloqueio

1. `ensureProtectedGrant()` procura um grant já cacheado para o módulo atual.
2. Se não houver grant válido, exibe o diálogo de senha administrativa.
3. `unlockProtectedGrant()` envia `POST /auth/protected/unlock`.
4. A requisição inclui o módulo e a senha administrativa.
5. Se o backend valida, retorna `grant_token`.
6. O frontend guarda o grant em cache.
7. `requestJson()` refaz a chamada original com o header `X-Protected-Grant`.

### 7.3 Regras de fallback observadas

- `configuracao` pode servir como grant reaproveitável para `usuarios` em um caso específico.
- O grant fica em cache por módulo e por chave global `*`.
- O fluxo é sensível a mesma conta, mesma clínica e módulo compatível.

## 8. Token / localStorage: onde grava, onde lê, onde limpa

### 8.1 Onde grava

- `setToken()` grava em `localStorage` com a chave `brana_token`.
- O login e o fluxo de confirmação de cadastro usam `setToken()` com o token retornado.

### 8.2 Onde lê

- `getToken()` lê `brana_token` de `localStorage`.
- `requestJsonBase()` usa o token para montar o header `Authorization: Bearer <token>` quando `auth=true`.
- `licConfirmarPagamentoRetorno()` também depende de token existente para seguir com a confirmação.

### 8.3 Onde limpa

- `setupLogout()` remove `brana_token` de `localStorage` e `sessionStorage`.
- O botão de sair (`btn-sair`) também chama `setToken("")` e limpa `sessaoAtual`.
- Em logout, o frontend limpa caches e reseta a interface.

## 9. Endpoints exatos envolvidos

### Núcleo principal

- `POST /login`
- `GET /me`
- `POST /logout`
- `POST /auth/setup/complete`
- `POST /auth/protected/unlock`

### Correlatos de primeiro acesso / cadastro guiado

- `POST /signup/confirm`
- `POST /signup/request-code`
- `POST /password/forgot`
- `POST /password/reset`

### Correlatos de licença e estado da sessão

- `GET /licenca/info`
- `POST /licenca/confirmar`
- `POST /licenca/checkout`
- `POST /licenca/sincronizar`

## 10. Dependências backend exatas envolvidas

### `backend/security/dependencies.py`

- `oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")`
- `get_current_user()`
- `require_module_access()`
- `require_admin_password_if_user_control_enabled()`

### `backend/security/permissions.py`

- níveis de acesso por módulo
- sanitização e leitura de permissões
- mapeamento entre permissões internas e compatibilidade antiga

### `backend/security/trial_middleware.py`

- validação de token no header `Authorization`
- bloqueio de rotas autenticadas sem Bearer válido
- checagem de tenant/clínica e trial/ licença
- bypass apenas para rotas públicas e alguns prefixos conhecidos

### `backend/security/user_context.py`

- monta o payload de `/me`
- consolida identidade, flags administrativas, setup e permissões

### `backend/routes/auth_routes.py`

- login
- logout
- proteção/unlock
- setup inicial
- integração de sessão e token

### `backend/services/signup_service.py`

- fluxo de primeiro acesso e criação/ativação de conta
- marcação de `setup_completed`
- composição inicial de permissões

## 11. Campos exatos de `/me` consumidos pelo frontend

Campos identificados como consumidos direta ou indiretamente:

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

Campos também inferidos no fluxo de sessão e interface:

- `user_id` ou equivalente usado em alguns pontos do frontend como alias prático do identificador
- valores de contexto derivados de nome/apelido/email para exibição e storage keys

## 12. Pontos de acoplamento mais frágeis

1. `requestJson()` decide quando reexecutar chamadas com `X-Protected-Grant`.
2. `getToken()` e `setToken()` definem a persistência central de autenticação.
3. `carregarSessao()` controla menu, setup, permissões e visibilidade administrativa.
4. `startSessionHeartbeat()` mantém a sessão viva e detecta queda de contrato com `/me`.
5. `handleSessionIssue()` decide se o sistema volta ao login, ao setup ou a uma tela de bloqueio.
6. `ensureProtectedGrant()` possui cache e fallback entre módulos, o que é frágil por design.
7. `TrialMiddleware` bloqueia o sistema logo no início e qualquer ajuste errado pode derrubar toda a aplicação.
8. `permissions.py` define o que é desabilitado, protegido ou habilitado, e isso impacta todo o menu.

## 13. Riscos críticos

- Quebrar login ou logout e impedir entrada/saída do sistema.
- Romper o carregamento de `/me` e deixar o frontend sem sessão válida.
- Bloquear o setup inicial e travar novos acessos.
- Exigir grant protegido errado ou aceitar grant indevido.
- Perder sincronização entre token local e validação no backend.
- Desfazer a integração entre permissões, menu e visibilidade administrativa.
- Alterar o contrato de erro protegido e quebrar o retry automático de `requestJson()`.
- Interromper o `TrialMiddleware` e bloquear todas as rotas autenticadas.

## 14. O que não deve ser modularizado ainda

Não modularizar ainda:

- login, logout e setup inicial
- `/me` e o carregamento inicial de sessão
- token, `Authorization` e persistência de autenticação
- grant protegido e unlock administrativo
- `TrialMiddleware`
- `get_current_user`
- permissões e visibilidade de menu
- usuários e superadmin enquanto dependerem diretamente de sessão e grant

## 15. Subtemas que exigirão auditoria fina separada depois

- fluxo completo de `requestJson()` por tipos de erro
- variações de `handleSessionIssue()` e redirecionamentos
- detalhes de `permissions.py` por módulo
- `user_context.py` e a composição do payload de `/me`
- comportamento do grant cache por módulo
- integração entre licença, trial e sessão no `TrialMiddleware`
- diferenças entre primeiro acesso, login normal e retomada de sessão

## 16. Próxima etapa documental recomendada

A próxima auditoria fina recomendada é uma análise separada de `requestJson()` em três eixos:

1. tratamento de erro e retry protegido
2. contrato de sessão e expiração
3. comportamento de headers e fallback de grant

Depois disso, vale uma auditoria de `permissions.py` por módulo e uma auditoria de `TrialMiddleware` por condição de bloqueio.

## 17. Conclusão

Este núcleo deve permanecer congelado. Ele é o eixo que conecta entrada, identidade, autorização, menu, setup e proteção de módulos. Antes de qualquer refatoração funcional futura, é necessário manter este contrato estável e documentado em detalhe suficiente para suportar o restante do sistema.
