# Auditoria documental e técnica - sessao, autenticacao e renovacao no frontend React

## 1. Objetivo

Mapear o funcionamento atual da autenticacao, expiracao de sessao e logout no Brana Cloude, com foco no frontend React, no backend atual e no frontend legado, para avaliar a melhor estrategia futura de renovacao automatica sem criar token eterno, sem remover a expiracao de seguranca e sem alterar o codigo funcional nesta etapa.

## 2. Documentacao preexistente encontrada

Documentacao diretamente relevante ja existente:

- [README.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/README.md)
- [docs/00_master_guide.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/00_master_guide.md)
- [docs/02_arquitetura.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/02_arquitetura.md)
- [docs/03_mapa_codigo.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/03_mapa_codigo.md)
- [docs/06_seguranca.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/06_seguranca.md)
- [docs/10_continuidade.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/10_continuidade.md)
- [docs/auditoria_fina_auth_me_grant_sessao.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/auditoria_fina_auth_me_grant_sessao.md)
- [docs/auditoria_usuarios_permissoes_login_sessao.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/auditoria_usuarios_permissoes_login_sessao.md)
- [docs/auditoria_contratos_auth_requestjson_me_security.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/auditoria_contratos_auth_requestjson_me_security.md)
- [docs/frontend_react_contrato_autenticacao.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/frontend_react_contrato_autenticacao.md)

Conclusao documental: havia base suficiente para evitar duplicacao de entendimento sobre login, `/me`, logout, token e session bootstrap. Nao havia, porem, um documento especifico com este recorte de "expiracao de sessao e renovacao enquanto o frontend React esta aberto".

## 3. Verificacoes de Git e estado inicial

- Diretorio confirmado: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch confirmada: `modularizacao-segura-fase-1`
- Remote confirmado: `origin https://github.com/institutobrana/branacloud.git`
- Status inicial resumido: o worktree ja estava sujo antes desta auditoria, com varias alteracoes e arquivos nao rastreados preexistentes em outras frentes; nenhuma delas foi modificada por esta etapa
- Ultimos commits registrados:
  - `d9b839d6 feat(cid): integra módulo ao shell e atualiza roadmap`
  - `740ed771 feat(cid): conclui módulo de doenças no frontend React`
  - `f79268d7 feat(theme): complete dark mode bootstrapping`
  - `e5a51968 Finalize global theme foundation`
  - `41894c03 docs: encerra temporariamente materiais`

## 4. Arquitetura atual

O Brana Cloude segue uma arquitetura monolitica com:

- backend FastAPI em `backend/`
- frontend legado estatico em `frontend/`
- frontend React separado em `frontend-react/`
- banco PostgreSQL via SQLAlchemy
- autenticacao via JWT Bearer

O token de acesso atual e salvo no navegador em `localStorage` como `brana_token`.

## 5. Fluxo atual do login

### Backend

Arquivo principal:

- [backend/routes/auth_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/auth_routes.py)

Pontos relevantes:

- `POST /login` em `login()`
- gera token com `create_access_token(...)`
- usa `user_id`, `clinica_id` e `is_admin` nas claims principais
- retorna `access_token` e `token_type`

Arquivos de suporte:

- [backend/security/jwt_handler.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/jwt_handler.py)
- [backend/security/dependencies.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/dependencies.py)
- [backend/security/user_context.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/user_context.py)

Detalhes observados:

- algoritmo JWT: `HS256`
- segredo: `JWT_SECRET_KEY` obrigatoria no ambiente
- expiracao padrao do access token: `60` minutos
- `decode_token()` retorna `None` quando o JWT e invalido ou expirado

### Frontend React

Arquivos relevantes:

- [frontend-react/src/features/auth/LoginPage.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/LoginPage.jsx)
- [frontend-react/src/features/auth/AuthProvider.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/AuthProvider.jsx)
- [frontend-react/src/features/auth/authApi.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authApi.js)
- [frontend-react/src/features/auth/authStorage.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authStorage.js)

Fluxo:

- `LoginPage` chama `signIn()`
- `signIn()` chama `POST /login`
- o token retornado e salvo em `localStorage`
- em seguida o React chama `GET /me`
- se `/me` der certo, o usuario fica autenticado no contexto

### Frontend legado

Arquivo principal:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)

Fluxo:

- `login()` faz `POST /login`
- salva `brana_token` em `localStorage`
- chama `carregarSessao()`
- `carregarSessao()` chama `GET /me`
- o shell, menus e permissoes sao liberados apos a validacao

## 6. Fluxo atual do `/me`

### Backend

Pontos relevantes:

- `GET /me` em `login_routes.py`
- protegido por `get_current_user()`
- retorna `build_user_context(...)`

`build_user_context()` retorna, entre outros:

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

### Frontend React

Arquivos:

- [frontend-react/src/features/auth/AuthProvider.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/AuthProvider.jsx)
- [frontend-react/src/features/auth/authApi.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authApi.js)

Comportamento:

- `AuthProvider` chama `getMe(token)` no boot via `useEffect(() => syncSession(token), [])`
- quando o login acontece, o React chama `getMe()` logo apos receber o token
- o estado `user` vem do retorno de `/me`

### Frontend legado

Arquivo:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)

Comportamento:

- `carregarSessao()` chama `GET /me`
- o retorno alimenta `sessaoAtual`, `userEmail`, `userRole`, visibilidade do menu e permissao de modulos
- o legacy tambem usa `startSessionHeartbeat()` para repetir `GET /me` a cada 60 segundos enquanto houver token

## 7. Fluxo atual do logout

### Backend

Arquivo:

- [backend/routes/auth_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/auth_routes.py)

`POST /logout`:

- carrega o usuario autenticado via `get_current_user()`
- se o usuario existir e estiver `online`, grava `online = False`
- nao ha revogacao global de JWT
- nao ha blacklist de token
- nao ha invalidacao de refresh token porque refresh token nao existe

### Frontend React

Arquivo:

- [frontend-react/src/features/auth/AuthProvider.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/AuthProvider.jsx)

`signOut()`:

- chama `POST /logout`
- se o backend falhar, o logout visual segue mesmo assim
- apaga `brana_token` do `localStorage`
- limpa `user`, `token` e `error`

### Frontend legado

Arquivo:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)

`btn-sair` e `setupLogout()`:

- chamam `POST /logout`
- param o heartbeat
- limpam `brana_token`
- limpam `sessaoAtual`
- escondem o shell e voltam para a tela de login

## 8. Mecanismo e prazo de expiracao

### Mecanismo atual

O mecanismo atual e JWT Bearer com expiracao embutida no claim `exp`.

### Prazo atual

- `ACCESS_TOKEN_EXPIRE_MINUTES = 60`
- em `create_access_token(...)` o `exp` e calculado com esse TTL
- alguns fluxos de grant protegido usam TTL proprio, por exemplo `PROTECTED_GRANT_EXPIRE_MINUTES = 20`, mas isso nao e sessao de usuario

### Onde isso e configurado

- [backend/security/jwt_handler.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/jwt_handler.py)
- [backend/routes/auth_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/auth_routes.py) para grant protegido

## 9. Claims presentes no token

Claims observadas no access token principal:

- `user_id`
- `clinica_id`
- `is_admin`
- `exp`

Claims observadas no grant protegido:

- `type = protected_grant`
- `user_id`
- `clinica_id`
- `module_code`
- `exp`

## 10. Refresh token e rotacao

- refresh token: ausente
- rotacao de refresh token: inexistente
- revogacao de refresh token: inexistente
- endpoint de refresh: inexistente

Conclusao: o sistema atual nao possui mecanismo de refresh token.

## 11. Sessao no banco e revogacao

### Existe tabela de sessao/token/dispositivo?

Nao foi identificada tabela dedicada a sessao, refresh token ou dispositivo de autenticacao.

### Existe controle por `jti`, versao de senha ou equivalente?

- `jti`: nao encontrado
- versao de senha: nao encontrada
- carimbo de alteracao de senha como invalidacao global de JWT: nao identificado como mecanismo atual

### Logout invalida algo no backend?

Sim, mas de forma limitada:

- marca `Usuario.online = False` quando possivel
- nao revoga JWT ja emitido
- nao invalida token futuro por si so

### Logout limpa apenas frontend?

Nao apenas frontend. O backend tambem e chamado, mas a invalidacao real do JWT nao existe; a limpeza do token no navegador e feita no frontend.

## 12. Como `401` e `403` sao produzidos

### Backend

Arquivo:

- [backend/security/dependencies.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/dependencies.py)

`get_current_user()`:

- `401` quando o token e invalido/expirado
- `403` para conta sistemica, usuario inativo ou setup nao concluido fora das rotas permitidas

### Frontend React

Arquivo:

- [frontend-react/src/features/auth/AuthProvider.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/AuthProvider.jsx)

Tratamento atual:

- erro `401` ou `403` em `/me` vira mensagem de falha de validacao da sessao
- o token pode ser mantido em caso de falha do `/me` durante `syncSession(..., { preserveTokenOnFailure: true })`, mas nao existe renovacao automatica

### Frontend legado

Arquivo:

- [frontend/app.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)

Tratamento atual:

- `parseSessionIssue()` interpreta `401` como sessao expirada
- `403` pode significar `setup_required`, `license_expired` ou `account_suspended`
- `enforceSessionIssue()` decide entre abrir setup, bloquear tela ou resetar tudo

## 13. Arquivos e funcoes principais de autenticacao

### Backend

- [backend/routes/auth_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/auth_routes.py)
  - `login()`
  - `logout()`
  - `me()`
  - `setup_complete()`
- [backend/security/jwt_handler.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/jwt_handler.py)
  - `create_access_token()`
  - `decode_token()`
- [backend/security/dependencies.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/dependencies.py)
  - `get_current_user()`
  - `require_module_access()`

### Frontend React

- [frontend-react/src/features/auth/AuthProvider.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/AuthProvider.jsx)
  - `AuthProvider`
  - `syncSession()`
  - `signIn()`
  - `signOut()`
  - `refreshSession()`
- [frontend-react/src/features/auth/authApi.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authApi.js)
  - `login()`
  - `getMe()`
  - `logout()`
- [frontend-react/src/features/auth/authStorage.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authStorage.js)
  - `getToken()`
  - `setToken()`
  - `clearToken()`

### Frontend legado

- [frontend/app.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)
  - `setToken()`
  - `getToken()`
  - `bootstrapOauthFromUrl()`
  - `startSessionHeartbeat()`
  - `stopSessionHeartbeat()`
  - `requestJsonBase()`
  - `requestJson()`
  - `carregarSessao()`
  - `login()`
  - `setupLogout()`
  - `btn-sair` handler

## 14. Uso de `/me` no React e no legado

### React

- restaura sessao no boot com `syncSession(token)` no `useEffect`
- valida novamente depois de `signIn()`
- oferece `refreshSession()`, mas ele apenas repete a validacao de `/me`

### Legado

- chama `/me` no boot em `carregarSessao()`
- chama `/me` periodicamente a cada 60s em `startSessionHeartbeat()`
- usa `/me` para decidir shell, setup, permissao e status de licenca

## 15. Comportamento atual nos cenarios auditados

### 1. Usuario faz login e continua navegando normalmente

Funciona ate o JWT expirar.

- React: navega enquanto o token existir e `/me` continuar respondendo
- Legado: o heartbeat tenta manter o contexto atualizado, mas nao renova o JWT; so revalida `/me`

### 2. Usuario fica parado na mesma tela ate o token vencer

- React: na proxima chamada autenticada ou no proximo boot, a sessao falha; nao ha renovacao silenciosa
- Legado: o heartbeat continua chamando `/me`; se o token expirar, a tela pode ser tratada como sessao expirada

### 3. Usuario mantem a aba aberta por varias horas

- React: ao expirar, a proxima validacao ou requisicao autenticada tende a falhar
- Legado: o heartbeat roda a cada 60 segundos, mas nao reemite token

### 4. Usuario deixa a aba em segundo plano

- React: sem timer de renovacao, nada renova a sessao
- Legado: o heartbeat pode ser atenuado pelo navegador em segundo plano, mas nao cria renovacao real

### 5. Usuario fecha somente a aba

- Como o token fica em `localStorage`, ele permanece salvo no navegador
- Ao reabrir, o React tenta `syncSession()` no boot
- Se o token ainda estiver valido, a sessao volta
- Se ja tiver expirado, o login volta a ser exigido

### 6. Usuario fecha todo o navegador

- O token em `localStorage` continua salvo no perfil do navegador
- Ao reabrir o navegador antes da expiracao, a sessao pode voltar
- Apos a expiracao, sera exigido novo login

### 7. Usuario reinicia o computador

- O token continua persistido no perfil do navegador, se o navegador mantiver os dados locais
- O comportamento final depende do tempo restante do JWT:
  - antes de expirar, o React pode restaurar a sessao
  - depois de expirar, o React falha na validacao e pede login

### 8. Usuario reabre o sistema antes do token vencer

- React: restaura o token do `localStorage` e chama `/me`
- se `/me` responder 200, a sessao volta

### 9. Usuario reabre o sistema depois do token vencer

- React: restaura o token do `localStorage`, mas `GET /me` falha
- o usuario volta a precisar autenticar

### 10. Usuario clica em logout

- React e legado chamam `POST /logout`
- o token local e removido
- a interface volta ao login
- nao ha revogacao global de JWT no backend

### 11. Duas abas do Brana Cloud ficam abertas simultaneamente

- ambas podem compartilhar o mesmo `brana_token` do `localStorage`
- se uma aba faz logout, a outra pode continuar com o token local ate a proxima validacao ou requisição
- nao existe mecanismo atual de invalidacao imediata entre abas

### 12. Varias requisicoes sao disparadas no momento em que o token expira

- a primeira resposta `401` ou `403` conforme a rota pode disparar o tratamento de sessao
- no React nao existe deduplicacao de refresh porque nao existe refresh
- no legado, `requestJson()` e `enforceSessionIssue()` podem bloquear ou resetar a sessao de acordo com a leitura do erro

## 16. Diferencas entre frontend legado e React

### Frontend legado

- usa `startSessionHeartbeat()` com `GET /me` a cada 60 segundos
- trata melhor estados de setup, licenca e bloqueio
- possui `requestJson()` com mais contratos de erro e reexecucao
- faz limpeza extensa no logout

### Frontend React

- nao possui heartbeat de sessao
- nao possui refresh automatico
- restaura apenas o token persistido e valida com `/me` no boot
- depende do contexto `AuthProvider`
- tem superficie menor e mais modular para futura insercao de renovacao

### Conclusao da diferenca

O legado ja tem um ciclo de "revalidar sessao continuamente", mas nao de renovar token. O React hoje ainda nao tem nem ciclo de revalidacao periodica nem refresh. Ele so restaura e valida no boot e no login.

## 17. Riscos encontrados

- ausencia de refresh token
- ausencia de revogacao global de JWT
- ausencia de invalidaçao imediata entre abas
- persistencia do token em `localStorage`, o que permite restauracao apos fechar aba ou navegador enquanto o token nao expirar
- falta de tratamento centralizado de `401` em multiplas chamadas concorrentes no React
- possibilidade de `refreshSession()` virar no futuro um ponto de loop se for acoplado sem trava
- dependencia do contrato `/me` para reconhecer a sessao
- no legado, o heartbeat existe, mas sem renovacao real
- o logout atual encerra a experiencia local, mas nao invalida completamente o JWT emitido

## 18. Avaliacao das alternativas

### Alternativa A - apenas aumentar muito o tempo do token

- Compatibilidade com a arquitetura atual: alta
- Arquivos afetados: backend de JWT e possivelmente documentos/contratos
- Necessidade de banco: nao
- Risco de seguranca: alto
- Risco de regressao: baixo a medio
- Comportamento ao fechar o navegador: token continuaria valido por mais tempo
- Comportamento do logout: continua funcional no frontend, mas JWT seguiria valido ate expirar
- Complexidade: baixa
- Recomendacao: **descarte**

Motivo: reduz a dor imediata, mas cria a falsa impressao de "sessao longa" e amplia a janela de risco. Contraria a exigencia de nao manter o usuario conectado indefinidamente.

### Alternativa B - token curto com timer de renovacao enquanto o frontend esta aberto

- Compatibilidade com a arquitetura atual: media a alta
- Arquivos afetados: `frontend-react/src/features/auth/*`, possivelmente `frontend/app.js` se o legado for padronizado depois
- Necessidade de banco: nao
- Risco de seguranca: medio
- Risco de regressao: medio
- Comportamento ao fechar o navegador: a renovacao para, e o token restante expira naturalmente
- Comportamento do logout: bom, desde que o timer seja cancelado no logout
- Complexidade: media
- Recomendacao: **forte candidata**

Motivo: atende melhor ao requisito funcional desejado sem exigir banco novo. O token segue curto, a renovacao so acontece enquanto a aba/app esta aberta e e possivel parar no logout e ao perder foco se necessario.

### Alternativa C - access token curto e refresh token

- Compatibilidade com a arquitetura atual: media
- Arquivos afetados: backend de auth, possivelmente novas rotas, frontend React e talvez frontend legado
- Necessidade de banco: provavelmente sim, se o refresh precisar ser revogavel e auditavel
- Risco de seguranca: medio
- Risco de regressao: medio a alto
- Comportamento ao fechar o navegador: bom, se o refresh ficar em cookie seguro ou armazenamento controlado
- Comportamento do logout: bom, com revogacao real do refresh
- Complexidade: alta
- Recomendacao: **boa arquitetura, mas mais pesada para a fase atual**

Motivo: e o padrao mais robusto em sistemas maduros, mas exige desenho adicional de revogacao, persistencia e protecao contra reutilizacao. Para o estado atual, parece maior do que o necessario para esta etapa.

### Alternativa D - sessao armazenada no backend

- Compatibilidade com a arquitetura atual: media
- Arquivos afetados: backend de auth, banco, middleware, frontend React e legado
- Necessidade de banco: sim
- Risco de seguranca: medio
- Risco de regressao: alto
- Comportamento ao fechar o navegador: controlavel por expiracao server-side e cookie/sessao
- Comportamento do logout: forte, com invalidacao server-side
- Complexidade: alta
- Recomendacao: **so se o projeto migrar para um modelo de sessao centralizado**

Motivo: resolveria a revogacao com mais rigor, mas mudaria bastante a arquitetura atual baseada em JWT stateless.

## 19. Recomendacao tecnica fundamentada

Recomendacao para futura implementacao: **Alternativa B**.

Justificativa:

- preserva o login atual
- preserva `/me`
- nao exige banco novo
- nao cria token eterno
- permite expiracao real quando o frontend para de renovar
- e compativel com a arquitetura atual baseada em JWT
- pode ser aplicada de forma modular no React, sem monolito adicional
- permite expandir depois para backend mais robusto se necessario

Por que nao a A:

- aumenta a janela de risco sem resolver a renovacao real

Por que nao a C agora:

- e segura e mais completa, mas adiciona maior complexidade de backend, revogacao e armazenamento

Por que nao a D agora:

- exige replanejamento de arquitetura e banco

## 20. Arquivos que uma implementacao futura afetaria

### Backend provavel

- [backend/security/jwt_handler.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/jwt_handler.py)
- [backend/routes/auth_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/auth_routes.py)
- [backend/security/dependencies.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/dependencies.py)

### Frontend React provavel

- [frontend-react/src/features/auth/AuthProvider.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/AuthProvider.jsx)
- [frontend-react/src/features/auth/authApi.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authApi.js)
- [frontend-react/src/features/auth/authStorage.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authStorage.js)
- [frontend-react/src/app/App.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/app/App.jsx)

### Frontend legado eventual

- [frontend/app.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)

## 21. Necessidade de migration

Na linha do que foi auditado, **nao ha necessidade obrigatoria de migration** para a Alternativa B.

Motivo:

- nao exige nova tabela
- nao exige novo campo
- nao exige persistencia de refresh token
- nao exige sessao server-side

Se no futuro houver revogacao persistente, lista de dispositivos ou refresh token auditavel, ai sim pode surgir necessidade de migration.

## 22. Plano de implementacao em etapas pequenas

1. Definir um contrato de renovacao leve no backend, se necessario, mantendo `/me` intacto.
2. Inserir a renovacao apenas no `AuthProvider` do React, sem alterar o legado ainda.
3. Cancelar qualquer timer no logout e na perda de autenticacao.
4. Garantir deduplicacao de renovacao para evitar multiplas chamadas simultaneas.
5. Tratar `401` e `403` sem loop infinito.
6. Validar o comportamento ao fechar aba, fechar navegador e reabrir depois da expiracao.
7. Se tudo estiver consistente, avaliar se o legado deve permanecer apenas com revalidacao manual/heartbeat.

## 23. Plano de rollback

- reverter apenas os arquivos do fluxo de autenticacao futuro
- restaurar o `AuthProvider` e `authApi` para o comportamento atual
- manter backend e banco inalterados se a etapa futura for apenas frontend
- se houver endpoint novo, desativar primeiro o uso no React e depois remover com calma

## 24. Criterios de aceite

- login continua funcionando
- `/me` continua sendo a leitura de sessao
- logout continua encerrando a autenticaçao imediatamente no frontend
- o usuario nao perde a sessao durante uso continuo com o frontend aberto
- fechar aba/navegador interrompe a renovacao
- depois da expiracao, reabrir o sistema exige novo login
- nao existe token eterno
- nao existe renovacao apos logout
- o frontend legado continua operando sem regressao

## 25. Testes regressivos necessarios

- login com credenciais validas
- login com credenciais invalidas
- abertura do sistema com token valido salvo
- abertura do sistema com token expirado salvo
- logout manual
- duas abas abertas simultaneamente
- varios `401` simultaneos quando o token expira
- acesso ao `/me` apos fechamento do navegador
- reabertura depois da expiracao
- verificacao de que o legado nao perdeu o comportamento atual

## 26. Duvidas ou lacunas nao comprovadas

- nao foi feita execucao runtime no navegador nesta etapa
- nao foi validado um refresh real porque o sistema atual nao possui refresh token
- nao foi testado comportamento em navegadores diferentes ou com storage policies restritivas
- nao foi validado se algum proxy ou camada externa altera a politica de expiracao
- nao foi auditado banco real ou dados produtivos

## 27. Confirmacao final

- nenhum codigo funcional foi alterado
- backend nao foi alterado
- banco nao foi alterado
- migrations nao foram alteradas
- variaveis de ambiente nao foram alteradas
- frontend legado nao foi alterado
- frontend React nao foi alterado
- nenhum commit foi feito
- nenhum push foi feito

## 28. Arquivos lidos nesta auditoria

- [backend/routes/auth_routes.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/routes/auth_routes.py)
- [backend/security/jwt_handler.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/jwt_handler.py)
- [backend/security/dependencies.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/dependencies.py)
- [backend/security/user_context.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/security/user_context.py)
- [backend/requirements.txt](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/requirements.txt)
- [frontend-react/src/app/App.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/app/App.jsx)
- [frontend-react/src/features/auth/AuthProvider.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/AuthProvider.jsx)
- [frontend-react/src/features/auth/authApi.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authApi.js)
- [frontend-react/src/features/auth/authStorage.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/authStorage.js)
- [frontend-react/src/features/auth/LoginPage.jsx](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/features/auth/LoginPage.jsx)
- [frontend-react/src/services/api.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend-react/src/services/api.js)
- [frontend/app.js](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/app.js)
- [frontend/index.html](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/frontend/index.html)
