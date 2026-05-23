# Diagnostico pos-teste de usuarios: protecao, refresh e permissoes/perfis

## 1. Objetivo da verificacao
Verificar, sem alterar codigo, o fluxo do `403 protected_password_required`, o refresh repetido de usuarios e o comportamento da tela de `Permissões de acesso / Perfis de acesso`, distinguindo:
- protecao esperada;
- loop/refresh problematico;
- regressao da extracao visual `22e7652`;
- diferenca de layout entre web e legado;
- falha de carregamento/renderizacao;
- perda real de dados;
- efeito de cache ou de seed ausente.

## 2. Data / etapa
- Data: `2026-05-20`
- Etapa: diagnostico pos-teste documental, somente leitura

## 3. Branch conferida
- `modularizacao-segura-fase-1`

## 4. Commit de referencia analisado
- `22e7652` - `Extrai visual do modal admin de usuarios`

## 5. Comandos de leitura executados
- `git branch --show-current`
- `git status --short`
- `git log --oneline -20`
- `git show --stat 22e7652`
- `git show --name-only 22e7652`
- `git show 22e7652 -- frontend/app.js frontend/index.html frontend/js/modules/users-admin-modal-visual.js`
- `git grep -n "protected_password_required"`
- `git grep -n "module_code"`
- `git grep -n "usuarios"`
- `git grep -n "admin/users"`
- `git grep -n "permissions"`
- `git grep -n "usersStartRefresh"`
- `git grep -n "carregarUsuarios"`
- `git grep -n "requestJsonBase"`
- `git grep -n "requestJson"`
- `git grep -n "usersSalvarPermissoes"`
- `git grep -n "Perfis de acesso"`
- `git grep -n "Permissões de Acesso"`
- `git grep -n "perfis"`
- `git grep -n "prestadores"`
- `git grep -n "profiles"`
- `git grep -n "access"`
- `Get-Content frontend/app.js` em trechos relevantes
- `Get-Content frontend/index.html` em trechos relevantes
- `Get-Content backend/routes/user_admin_routes.py` em trechos relevantes
- `Get-Content backend/security/dependencies.py` em trechos relevantes
- `Get-Content backend/services/access_profiles_service.py`
- `Get-Content backend/models/access_profile.py`
- `Select-String` em docs relevantes de auditoria fina e pós-reversao

## 6. Estado inicial do git
- Branch: `modularizacao-segura-fase-1`
- `git status --short` mostrava somente arquivos untracked antigos do workspace e os relatórios criados nesta trilha.
- Nenhum arquivo de codigo foi alterado nesta verificacao.

## 7. Resumo do diagnostico do `403 protected_password_required`
O fluxo atual de frontend trata corretamente o erro protegido:
- `requestJsonBase()` faz a chamada bruta com `fetch`;
- `requestJson()` intercepta o `403` estruturado;
- `parseProtectedError()` identifica `detail.error = protected_password_required`;
- `ensureProtectedGrant()` abre o prompt de senha protegida;
- `unlockProtectedGrant()` chama `POST /auth/protected/unlock`;
- se houver grant valido, `requestJson()` reexecuta a chamada original com `X-Protected-Grant`.

Conclusao deste ponto:
- o `403` em `GET /admin/users` nao parece ser apenas “sem permissao da conta ADM”;
- ele bate com o mecanismo esperado de protecao do modulo `usuarios`;
- isso esta consistente com o backend, que protege o router com `require_module_access("usuarios")` e `require_admin_password_if_user_control_enabled("usuarios")`.

## 8. Cadeia `requestJsonBase -> requestJson -> carregarUsuarios -> GET /admin/users`
E a cadeia real observada no codigo:
1. `usersStartRefresh()` agenda `carregarUsuarios(true)` com `setInterval`.
2. `carregarUsuarios()` faz `requestJson("GET", "/admin/users", undefined, true)`.
3. `requestJson()` chama `requestJsonBase()`.
4. `requestJson()` trata `403 protected_password_required` via grant protegido.
5. Se o grant nao for obtido ou nao for aceito, a chamada continua retornando 403.

## 9. Onde o refresh repetido e iniciado
O refresh vem de:
- `usersStartRefresh()`
- `showUsersPanel(true)` chama `usersStartRefresh()`
- `abrirPainelAdministradorToolbar()` chama `showUsersPanel(true)` e depois `carregarUsuarios()`
- `abrirPainelUsuariosConfig()` tambem chama `showUsersPanel(true)` e depois `carregarUsuarios()`

## 10. Intervalo / frequencia do refresh
O intervalo identificavel no codigo e:
- `3000ms` em `usersStartRefresh()`

O usuario percebeu repeticao “como ping” perto de 1 segundo, mas o codigo nao mostra um `setInterval` de 1 segundo no fluxo de usuarios. Isso sugere:
- percepcao visual do Network/console;
- multiplas chamadas empilhadas por fluxo normal de abertura + refresh;
- ou navegador/tela exibindo varias tentativas seguidas.

## 11. Existe pausa quando `protected_password_required` ocorre?
Nao ha pausa especifica para esse caso.
O refresh continua enquanto o painel estiver aberto, porque:
- `usersStartRefresh()` nao verifica erro anterior;
- `carregarUsuarios(true)` nao desabilita o timer quando a resposta e 403 protegido;
- nao existe backoff nem suspendao do refresh nesse trecho.

## 12. Indicio de regressao causada pelo commit `22e7652`
Nao ha indicio concreto.
O commit `22e7652` nao alterou:
- `requestJsonBase()`;
- `requestJson()`;
- `carregarUsuarios()`;
- `usersStartRefresh()`;
- `usersSalvarPermissoes()`;
- endpoints de usuarios/permissoes;
- auth / sessao / grant;
- backend.

O novo modulo visual nao faz request de rede.

## 13. Resumo do diagnostico da tela de permissões
A tela de permissões atual esta montada por:
- `usersAbrirPermissoes()`
- `usersCarregarPermissoesSchema()`
- `usersRenderPermissoes()`
- `usersPermSetTab("acesso")`
- `usersPermRenderPerfilPreview()`
- `usersPermRenderProfiles()`
- `usersPerfLoad()`
- `usersPerfRenderProfiles()`
- `usersPerfRenderPrestadores()`
- `usersPermAplicarPerfilSelecionado()`
- `usersSalvarPermissoes()`

Ela usa duas areas distintas:
- aba `Permissões de Acesso`: leitura do esquema + permissões internas + preview de perfis;
- aba `Perfis de acesso`: lista de perfis e checklist de prestadores vinculaveis.

## 14. Resumo do diagnostico da aba `Perfis de acesso`
O HTML atual da aba `Perfis de acesso` mostra:
- coluna esquerda: tabela de perfis em `users-perf-profile-tbody`;
- coluna direita: checklist de prestadores em `users-perf-prestadores`.

Isso significa que a tela web atual nao replica o print legado descrito pelo usuario, que mostrava uma composicao mais antiga com lista superior e area inferior diferente.

Conclusao pratica:
- ha forte indicio de que a diferenca visual e de layout e nao uma regressao do commit `22e7652`;
- o recorte visual nao tocou essa tela;
- se a lista de perfis aparece vazia, a causa mais provavel e ausencia de dados/seed ou falha de carregamento, nao o corte visual do modal de usuarios.

## 15. Mapeamento das funcoes frontend relacionadas
### Permissoes de acesso
- `usersAbrirPermissoes()`
- `usersCarregarPermissoesSchema()`
- `usersRenderPermissoes()`
- `usersPermSetTab()`
- `usersPermRenderPerfilPreview()`
- `usersPermRenderProfiles()`
- `usersPermAplicarPerfilSelecionado()`
- `usersPermBuildPayload()`
- `usersPermAutoSave()`
- `usersSalvarPermissoes()`

### Perfis de acesso
- `usersPermSetTab("perfis")`
- `usersPerfLoad()`
- `usersPerfRenderProfiles()`
- `usersPerfRenderPrestadores()`
- `usersPerfHandlePrestadorChange()`
- `usersPerfSelectPerfil()`

### Refresh / listagem de usuarios
- `carregarUsuarios()`
- `usersStartRefresh()`
- `usersStopRefresh()`
- `showUsersPanel()`

## 16. Mapeamento dos endpoints relacionados
### Leitura / listagem
- `GET /admin/users`
- `GET /admin/users/permissions/schema`
- `GET /admin/users/{user_id}/permissions`
- `GET /admin/users/{user_id}/profiles`

### Gravação
- `PATCH /admin/users/{user_id}/permissions`
- `PATCH /admin/users/{user_id}/profiles`
- `POST /admin/users/{user_id}/verify-password`

### Protecao
- `POST /auth/protected/unlock`

## 17. Indicios sobre perda real de permissões ou apenas falha de carregamento/renderizacao
O diagnostico fica assim:
- permissões individuais: nao ha prova de perda real de dados; o contrato de leitura/gravação continua apontando para `permissoes_json`;
- perfis de acesso: ha possibilidade de falha de carregamento/renderizacao ou de seed ausente;
- o arquivo de seed `sis_perfil_sql.csv` nao existe neste workspace (`Test-Path` retornou `False`), o que pode explicar lista vazia se o banco tambem nao tiver registros preexistentes;
- sem leitura direta do banco, nao da para afirmar perda real de dados.

Conclusao: **inconclusivo quanto a perda real**, com tendencia maior para **falha de carregamento/seed/dados locais** do que para regressao da extração visual.

## 18. Relacao possivel com `protected_password_required`
Existe relacao indireta:
- o modulo `usuarios` esta protegido;
- a leitura de `GET /admin/users` e `GET /admin/users/{id}/permissions` passa por esse gate;
- se o grant nao for concedido, o refresh continua repetindo o 403;
- isso pode impedir a tela de permissoes/perfis de receber os dados completos.

## 19. Relacao possivel com modularizacoes anteriores
Ha indicio de que o tema e anterior ao recorte visual:
- os docs antigos ja registravam `GET /admin/users 403 Forbidden`;
- a arquitetura de permissao/refresh ja existia antes do commit `22e7652`;
- a nova extracao visual nao mexeu nos fluxos de permissao/perfis.

## 20. O commit `22e7652` tocou em permissões/perfis?
Nao.
O diff do commit mostrou somente:
- remocao de `usersOptions()`, `usersPopularModalCombos()` e `usersPreencherModal()` de `frontend/app.js`;
- wrappers finos em `frontend/app.js`;
- novo modulo visual;
- inclusao do script em `frontend/index.html`;
- documento de execucao.

Nao houve alteracao em:
- `usersAbrirPermissoes()`;
- `usersSalvarPermissoes()`;
- `usersPerfLoad()`;
- `usersPerfRenderProfiles()`;
- `usersPerfRenderPrestadores()`;
- backend de permissões/perfis.

## 21. Conclusao objetiva
- `403 protected_password_required`: **proteção esperada** pelo desenho atual, nao regressao do recorte visual.
- repetição do refresh: **comportamento esperado pelo timer atual**, mas operacionalmente problemático porque nao ha pausa/backoff ao falhar com protecao.
- tela `Permissões de acesso / Perfis de acesso`: **diferente do print legado e possivelmente incompleta em dados**, mas sem prova de regressao do commit `22e7652`.
- perda real de dados: **inconclusivo**, com maior chance de falha de carregamento/seed/local data do que perda de banco confirmada.
- indício de regressão da extração visual: **nao**.

## 22. Recomendacao conservadora do proximo passo
Antes de corrigir qualquer coisa, o passo mais seguro e:
1. confirmar no Network se o `403` vem mesmo com `detail.error = protected_password_required`;
2. verificar se existe retry com `X-Protected-Grant` apos desbloqueio;
3. abrir a tela com hard refresh para evitar cache antigo;
4. checar se a base local tem perfis carregados no backend ou se o seed ausente explica a lista vazia;
5. validar a tela de perfis em uma conta com grant protegido ja concedido.

## 23. Onde o usuario deve testar novamente
1. Abrir o sistema com hard refresh.
2. Abrir o painel de usuarios.
3. Confirmar no Network se `GET /admin/users` retorna `protected_password_required`.
4. Confirmar se o prompt de senha protegida aparece e se o retry usa `X-Protected-Grant`.
5. Abrir a aba `Permissões de acesso`.
6. Abrir a aba `Perfis de acesso`.
7. Verificar se a coluna `Perfil` preenche a lista.
8. Verificar se `Prestadores` preenche os checkboxes.
9. Repetir com uma conta/estado que ja tenha grant protegido desbloqueado.

## 24. Confirmacao de que nenhum codigo foi alterado
- Nenhum codigo foi alterado nesta verificacao.

## 25. Confirmacao sobre `frontend/app.js`
- `frontend/app.js` nao foi alterado nesta verificacao.

## 26. Confirmacao sobre `frontend/index.html`
- `frontend/index.html` nao foi alterado nesta verificacao.

## 27. Confirmacao sobre `frontend/js/modules/users-admin-modal-visual.js`
- `frontend/js/modules/users-admin-modal-visual.js` nao foi alterado nesta verificacao.

## 28. Confirmacao sobre backend, banco, rotas, permissões e endpoints
- Backend, banco, rotas, permissões e endpoints nao foram alterados nesta verificacao.

## 29. Blindagem textual / mojibake
- A blindagem textual/mojibake foi respeitada.
- Nao houve correcao de strings, labels, placeholders ou mensagens.
- Qualquer texto quebrado foi apenas registrado como observacao.

## 30. Pastas proibidas
- Nada foi criado, editado, salvo, copiado, movido ou apagado nas pastas proibidas.

## 31. Resultado dos checks `node --check`
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok

## 32. Estado final do git
- `git status --short` mostra somente untracked antigos do workspace e o novo relatorio desta verificacao.
- `git diff --stat` nao mostra alteracoes em arquivos rastreados nesta etapa, porque nao houve edicao de codigo.
