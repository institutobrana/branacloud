# Auditoria direcionada - Toolbar ADM Usuarios historico e atual

Data: 2026-07-21

Diretorio: `D:\BRANA ARQUIVOS\BRANA CLOUD`

Branch: `modularizacao-segura-fase-1`

HEAD inicial: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`

Remote esperado: `https://github.com/institutobrana/branacloud.git`

## 1. Escopo

Esta auditoria recupera o historico e o estado atual da toolbar de `ADM -> Usuarios`, separando:

- painel local de usuarios da clinica: `#users-panel`, `showUsersPanel()` e `/admin/users`;
- painel global ADM/Super Admin: `#superadmin-panel`, `saCarregarUsuarios()` e `/superadmin/usuarios`.

Nenhum botao, handler, modal, endpoint, rota, teste funcional, backend, banco, migration ou tela React foi implementado nesta rodada.

## 2. Git inicial

- `git status --short`: worktree ja estava suja com alteracoes preexistentes e muitos arquivos untracked.
- `git branch --show-current`: `modularizacao-segura-fase-1`.
- `git remote -v`: `origin https://github.com/institutobrana/branacloud.git`.
- `git rev-parse HEAD`: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`.
- `git diff --cached --name-only`: vazio.
- `git fetch origin`: executado.
- Divergencia: `0 0`.

## 3. Arquivos e documentos auditados

Codigo:

- `frontend/index.html`
- `frontend/app.js`
- `frontend/js/modules/users-admin-modal-visual.js`
- `frontend-react/src/features/admin/users/`
- `frontend-react/tests/adminUsers.test.js`
- `backend/routes/superadmin_routes.py`
- `backend/routes/user_admin_routes.py`
- `backend/routes/auth_routes.py`
- `backend/security/dependencies.py`
- `backend/security/superadmin.py`
- `backend/security/system_accounts.py`

Documentos:

- `docs/auditoria_painel_usuarios_adm_react.md`
- `docs/auditoria_botao_novo_usuario_adm_clinicas.md`
- `docs/pre_contrato_funcional_usuarios_novas_contas.md`
- `docs/implementacao_adm_usuarios_fase_1_leitura.md`
- `docs/04_funcionalidades.md`
- `docs/07_fluxos.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/auditoria_integracao_painel_adm_frontend_react.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`
- `docs/usuarios_admin_modularizacao_subetapa_2_diagnostico_proximo_helper_visual.md`
- `docs/usuarios_admin_modularizacao_subetapa_3_extracao_toolbar_visual.md`
- `docs/usuarios_admin_modularizacao_subetapa_4_diagnostico_proximo_recorte.md`
- `docs/auditoria_global_modulos_frontend_pos_pausas_usuarios_simbolos_preferencias.md`

## 4. Historico Git pesquisado

Comandos de leitura executados:

- `git log --all -- frontend/index.html frontend/app.js`
- `git log -S"usersAtualizarAcoesToolbar" --all -- frontend/app.js frontend/js/modules/users-admin-modal-visual.js`
- `git log -S"usersRenderAdvanced" --all -- frontend/app.js`
- `git log -S"Novo usuário" --all -- frontend`
- `git log -S"Reset senha" --all -- frontend/app.js frontend/index.html`
- `git log -S"saCarregarUsuarios" --all -- frontend/app.js`
- `git log -S"saCriarUsuarioClinica" --all -- frontend/app.js`
- `git show <commit>:frontend/app.js`
- `git show <commit>:frontend/index.html`
- `git show <commit>:frontend/js/modules/users-admin-modal-visual.js`

## 5. Commits relevantes

| Commit/Data | Painel | Botoes existentes | Alteracao observada |
|---|---|---|---|
| `c132c453` / 2026-05-06 | Local e Global | Local: Novo usuario, Altera, Excluir, Impressos, Preferencias, Permissoes, Fecha. Global: Atualizar, Filtrar, Exportar CSV e acoes por linha Ativar/Desativar, Tornar/Remover admin, Reset senha. | Versao inicial ja continha os dois dominios. |
| `d9b3673e` / 2026-05-21 | Local | Mesma toolbar local. | Corrigiu refresh protegido em usuarios admin; nao adicionou toolbar global. |
| `aab97d75` / 2026-05-23 | Local | Mesma toolbar local. | Extraiu `usersAtualizarAcoesToolbar()` para `frontend/js/modules/users-admin-modal-visual.js`; manteve wrapper fino em `frontend/app.js`. |
| `38dae94b` / 2026-05-16 | Local | Encontrado por `Novo usuário`. | Relacionado a modularizacao de convenios; nao alterou contrato global de Usuarios. |
| `faacccd9` / 2026-05-15 | Local | Encontrado por `Novo usuário`. | Relacionado a prestadores/helper; nao alterou contrato global de Usuarios. |

Nao foi localizado commit posterior que removesse os botoes globais do legado; a reducao da toolbar React para `Atualizar` e `Buscar usuario` ocorreu por decisao de Fase 1 somente leitura, nao por remocao historica do legado.

## 6. Painel local x painel global

| Botao/Acao | Painel local da clinica | ADM global | Funcao | Endpoint | Ainda existe? |
|---|---:|---:|---|---|---:|
| Novo usuario | Sim | Nao na aba global Usuarios | `usersAbrirModalNovo()` / `usersSalvarNovo()` | `POST /admin/users` | Sim local |
| Altera | Sim | Nao | `usersEditarSelecionado()` / `usersSalvarEstrutural()` | `PATCH /admin/users/{id}` | Sim local |
| Excluir | Sim | Nao | `usersExcluirSelecionado()` | `DELETE /admin/users/{id}` | Sim local |
| Impressos | Sim | Nao | `usersAbrirImpressos()` | Configuracoes/relatorios locais | Sim local |
| Preferencias | Sim | Nao | `usersAbrirPreferencias()` | `/preferences/*` | Sim local |
| Permissoes | Sim | Nao | `usersAbrirPermissoes()` / `usersSalvarPermissoes()` | `GET/PATCH /admin/users/{id}/permissions` | Sim local |
| Fecha | Sim | Nao necessario no React | `showUsersPanel(false)` | Nenhum | Sim local |
| Atualizar | Nao na toolbar local principal | Sim | `saRecarregarTudo()` / React `refresh()` | `GET /superadmin/usuarios` | Sim |
| Filtrar | Nao | Sim no legado global | `saCarregarUsuarios()` | `GET /superadmin/usuarios` com query | Sim legado |
| Buscar usuario | Nao | Sim como input no legado e React | `saCarregarUsuarios()` / `useAdminUsers` | `GET /superadmin/usuarios?q=` | Sim |
| Exportar CSV | Nao | Sim | `saExportarUsuariosCsv()` | `GET /superadmin/usuarios/export.csv` | Sim backend/legado |
| Ativar/Desativar | Local por modal/active | Sim por linha | `saAlterarStatusUsuario()` | `PATCH /superadmin/usuarios/{id}/status` | Sim backend/legado |
| Tornar/Remover admin | Local por modal | Sim por linha | `saAlterarPerfilUsuario()` | `PATCH /superadmin/usuarios/{id}/perfil` | Sim backend/legado |
| Reset senha | Local | Sim por linha | `saResetarSenhaUsuario()` | `POST /superadmin/usuarios/{id}/reset-senha` | Sim backend/legado |
| Perfis | Sim local | Nao global | `usersAbrirPermissoes()` aba perfis | `GET/PATCH /admin/users/{id}/profiles` | Sim local |
| Excluir global | Nao | Nao | Nao localizado | Nao localizado | Nao |

## 7. Painel global legado

O painel global fica em `#superadmin-panel` e usa:

- `saAbrir()`
- `saRecarregarTudo()`
- `saCarregarUsuarios()`
- `saRenderUsuarios()`
- `saExportarUsuariosCsv()`
- `saAlterarStatusUsuario()`
- `saAlterarPerfilUsuario()`
- `saResetarSenhaUsuario()`
- `saCriarUsuarioClinica()` a partir da tabela de clinicas, nao da aba Usuarios.

Toolbar global do legado:

- `#superadmin-btn-refresh`: `Atualizar`
- `#sa-usuarios-filtrar`: `Filtrar`
- `#sa-usuarios-exportar`: `Exportar CSV`

Acoes globais por linha em `saRenderUsuarios()`:

- `Desativar` ou `Ativar`
- `Remover admin` ou `Tornar admin`
- `Reset senha`
- Owner aparece como `Protegido`

Nao existem no painel global legado:

- `Novo usuario` na aba global Usuarios;
- `Alterar`;
- `Excluir usuario`;
- `Perfis`;
- `Fechar`.

## 8. Painel local legado

O painel local fica em `#users-panel` e usa:

- `showUsersPanel()`
- `carregarUsuarios()`
- `usersRenderAdvanced()`
- `usersAtualizarAcoesToolbar()`
- `usersPreencherModal()`
- `usersPopularModalCombos()`
- `usersSalvarNovo()`
- `usersSalvarEstrutural()`
- `usersExcluirSelecionado()`
- `usersAbrirPermissoes()`
- `usersAbrirPreferencias()`
- `usersAbrirImpressos()`

Toolbar local:

- `#users-btn-novo`: `Novo usuario...`
- `#users-btn-editar`: `Altera...`
- `#users-btn-excluir`: `Excluir`
- `#users-btn-impressos`: `Impressos...`
- `#users-btn-preferencias`: `Preferencias...`
- `#users-btn-permissoes`: `Permissoes...`
- `#users-btn-fechar`: `Fecha`

Este painel e operacional, por clinica, e nao deve ser copiado automaticamente para `ADM -> Usuarios`.

## 9. Funcoes exigidas

### `usersAtualizarAcoesToolbar()`

Painel: local da clinica.

Estado:

- extraida para `frontend/js/modules/users-admin-modal-visual.js`;
- `frontend/app.js` mantem wrapper fino;
- habilita/desabilita `Altera`, `Excluir`, `Preferencias` e `Permissoes`;
- nao desabilita `Novo usuario`, `Impressos` nem `Fecha`;
- sem selecao: desabilita botoes contextuais;
- usuario sistemico/base `Clinica`: desabilita botoes contextuais e adiciona title de conta protegida;
- nao possui regra de Owner global, conta atual ou ultimo administrador.

### `usersRenderAdvanced()`

Painel: local da clinica.

Responsabilidades:

- renderiza a tabela local de usuarios;
- mostra conectado/status;
- controla selecao visual;
- chama `usersAtualizarAcoesToolbar()`;
- classificado historicamente como risco medio para modularizacao por concentrar selecao e render principal.

### `usersPreencherModal()`

Painel: local da clinica.

Preenche modal local com:

- nome;
- apelido;
- email;
- ativo/inativo;
- admin;
- forcar troca de senha;
- campos de senha;
- combos de tipo, prestador e unidade.

Nao pertence ao ADM global.

### `usersPopularModalCombos()`

Painel: local da clinica.

Popular combos de:

- tipo de usuario;
- prestador;
- unidade de atendimento.

Nao pertence ao ADM global sem contrato de edicao global por tenant.

## 10. Endpoints existentes

| Acao | Endpoint | Metodo | Escopo | Protecoes | Pronto para ADM global? |
|---|---|---|---|---|---:|
| Listar usuarios globais | `/superadmin/usuarios` | GET | Plataforma | `_require_superadmin` | Sim, ja usado |
| Exportar CSV global | `/superadmin/usuarios/export.csv` | GET | Plataforma | `_require_superadmin`; exporta PII | Sim, com confirmacao |
| Criar usuario global | `/superadmin/usuarios` | POST | Plataforma/clinica alvo | `_require_superadmin`; valida clinica/e-mail/senha; auditoria | Parcial, exige contrato |
| Ativar/inativar global | `/superadmin/usuarios/{id}/status` | PATCH | Plataforma | `_require_superadmin`; bloqueia Owner e sistemico; auditoria | Parcial, falta autoinativacao/sessoes/ultimo admin |
| Tornar/remover admin global | `/superadmin/usuarios/{id}/perfil` | PATCH | Plataforma | `_require_superadmin`; bloqueia Owner e sistemico; auditoria | Parcial, falta ultimo admin/escopo |
| Reset senha login global | `/superadmin/usuarios/{id}/reset-senha` | POST | Plataforma | `_require_superadmin`; bloqueia Owner e sistemico; auditoria | Parcial, falta UX/invalidacao de sessao |
| Obter detalhes global | Nao localizado | - | Plataforma | - | Nao |
| Alterar cadastro global | Nao localizado | - | Plataforma | - | Nao |
| Excluir usuario global | Nao localizado | - | Plataforma | - | Nao |
| Listar usuarios locais | `/admin/users` | GET | Clinica atual | `require_module_access("usuarios")` e senha protegida se aplicavel | Nao e ADM global |
| Criar usuario local | `/admin/users` | POST | Clinica atual | Admin local; valida codigo/e-mail/senha; sistemico reservado | Nao e ADM global |
| Alterar usuario local | `/admin/users/{id}` | PATCH | Clinica atual | Admin local; bloqueia sistemico | Nao e ADM global |
| Ativar/inativar local | `/admin/users/{id}/active` | PATCH | Clinica atual | Admin local; bloqueia sistemico e autodesativacao | Nao e ADM global |
| Reset senha local | `/admin/users/{id}/reset-password` | POST | Clinica atual | Admin local; bloqueia sistemico | Nao e ADM global |
| Trocar senha login | `/admin/users/change-password` | POST | Usuario/clinica atual | Senha atual e validacao | Nao e ADM global |
| Permissoes locais | `/admin/users/{id}/permissions` | GET/PATCH | Clinica atual | Admin local; bloqueia sistemico | Nao e ADM global |
| Perfis locais | `/admin/users/{id}/profiles` | GET/PATCH | Clinica atual | Admin local; bloqueia sistemico; prestador/perfil mesma clinica | Nao e ADM global |
| Excluir local | `/admin/users/{id}` | DELETE | Clinica atual | Admin local; bloqueia sistemico, autoexclusao e ultimo admin | Nao e ADM global |
| Primeiro acesso/senha interna | `/auth/setup/complete` | POST | Usuario autenticado | bloqueia sistemico; grava `senha_interna_hash` | Nao e toolbar ADM global |

## 11. Protecoes e lacunas

Owner:

- endpoints globais de status, perfil e reset bloqueiam Owner por e-mail;
- listagem marca `is_owner_account`;
- CSV exporta flag de Owner;
- criacao global nao e Owner-only.

MASTER/Super Admin:

- acesso global usa `_require_superadmin`, derivado por Owner ou admin de clinica Super Admin/Master/Owner/Vitalicia;
- `is_master` nao e campo persistido de usuario;
- acoes futuras sensiveis podem exigir Owner-only.

Usuario sistemico:

- endpoints globais de status, perfil e reset bloqueiam `is_system_user`;
- listagem global retorna `is_system_user`;
- legado global nao destacava sistemico nas acoes por linha, mas backend bloqueava;
- React Fase 1 ja identifica como protegido.

Conta atual:

- endpoint local bloqueia autodesativacao e autoexclusao;
- endpoint global de status nao bloqueia explicitamente autoinativacao de Super Admin nao-Owner;
- contrato futuro deve bloquear a propria conta no frontend e, preferencialmente, no backend.

Ultimo administrador:

- endpoint local de exclusao bloqueia excluir ultimo admin;
- endpoint global de perfil/status nao bloqueia ultimo admin da clinica;
- contrato futuro deve exigir protecao antes de rebaixar/inativar admin.

Sessoes e tokens:

- `get_current_user` bloqueia usuario inativo em chamadas futuras;
- reset de senha nao invalida tokens explicitamente;
- inativacao nao revoga tokens emitidos imediatamente por tabela de sessao.

## 12. Revisao dos botoes candidatos

### Atualizar

- Ja existe no React.
- Deve permanecer.
- Deve preservar filtros, selecao e ordenacao quando possivel.
- Sempre habilitado para usuario autorizado.

### Exportar CSV

- Existe no legado global e no backend.
- E read-only, mas exporta PII.
- Deve entrar antes das mutacoes, com confirmacao e reutilizacao dos filtros atuais.

### Novo usuario

- No legado global nao ficava na aba Usuarios; ficava contextual em `ADM -> Clinicas`.
- Chama `POST /superadmin/usuarios`.
- Cria admin da clinica por padrao no legado (`is_admin=true`).
- Deve ser rotulado como `Novo administrador`, se mantiver o comportamento real.
- Deve exigir clinica alvo explicita.
- `ativar_clinica=true` nao deve ser automatico sem confirmacao especifica.
- Nao abre primeiro acesso: endpoint atual grava `setup_completed=True`.

### Alterar

- Nao existe como acao global ampla.
- O endpoint global nao altera nome/e-mail/clinica/perfis.
- Deve ficar fora ate contrato e endpoint especifico.

### Ativar/Inativar

- Existe no legado global como acao por linha.
- Deve virar botao contextual na barra React.
- Texto deve alternar conforme selecao.
- Precisa contrato para propria conta, ultimo admin e impacto de sessoes.

### Tornar administrador/Remover administrador

- Existe no legado global como acao por linha.
- Deve virar botao contextual unico.
- Texto deve alternar conforme `is_admin`.
- Precisa contrato para ultimo admin, Owner, sistemico e escopo de clinica.

### Redefinir senha

- Existe no legado global.
- E senha de login (`senha_hash`), nao senha interna.
- Rotulo recomendado: `Redefinir senha de login`.
- Deve exigir nova senha informada pelo operador ou contrato de senha temporaria.
- Deve declarar que nao altera `senha_interna_hash`.

### Perfis

- Existe no painel local, nao no global.
- Deve ficar para fase posterior.
- Depende de contrato tenant/perfis/prestadores e nao deve ser copiado para ADM global agora.

### Excluir

- Existe local.
- Nao existe global.
- Deve permanecer fora.
- Para ADM global, preferir inativar ate contrato de exclusao.

### Fechar

- Existe local por ser painel flutuante legado.
- Shell React nao precisa; navegacao lateral substitui.
- Nao deve entrar.

## 13. Matriz contextual futura

| Estado da selecao | Novo | Alterar | Ativar/Inativar | Admin/Usuario | Senha | Perfis | Excluir |
|---|---:|---:|---:|---:|---:|---:|---:|
| Sem selecao | Habilitado se houver fluxo com clinica explicita | Nao | Nao | Nao | Nao | Nao | Nao |
| Usuario comum ativo | Habilitado | Fase futura | `Inativar` | `Tornar administrador` | Habilitado | Fase futura | Nao |
| Usuario comum inativo | Habilitado | Fase futura | `Ativar` | `Tornar administrador` | Habilitado | Fase futura | Nao |
| Administrador | Habilitado | Fase futura | `Inativar` se nao for ultimo admin/atual | `Remover administrador` se nao for ultimo admin | Habilitado | Fase futura | Nao |
| Usuario sistemico | Habilitado | Nao | Nao | Nao | Nao | Nao | Nao |
| Owner | Habilitado se Owner operador | Nao | Nao | Nao | Nao | Nao | Nao |
| Operador atual | Habilitado | Fase futura | Nao | Nao ate contrato | Fase futura controlada | Fase futura | Nao |

## 14. Toolbar recomendada

Ordem visual recomendada para `ADM -> Usuarios`:

1. `Atualizar`
2. `Exportar CSV`
3. `Novo administrador`
4. `Ativar` / `Inativar`
5. `Tornar administrador` / `Remover administrador`
6. `Redefinir senha de login`
7. `Buscar usuario` alinhado a direita

Nao incluir agora:

- `Alterar`;
- `Perfis`;
- `Excluir`;
- `Fechar`;
- `Filtrar` separado, pois React ja tem busca e filtros por coluna.

## 15. Classificacao A/B/C

| Botao | Classificacao A/B/C | Rotulo final | Justificativa | Fase |
|---|---|---|---|---|
| Atualizar | A | Atualizar | Ja existe e e read-only. | Atual |
| Exportar CSV | A | Exportar CSV | Existe no legado global e backend; read-only, com risco PII controlavel por confirmacao. | Proxima |
| Novo usuario | B | Novo administrador | Legado cria admin, nao usuario comum; exige clinica alvo e contrato de ativacao/setup. | Posterior |
| Alterar | C | - | Nao existe endpoint global amplo; risco de misturar CRUD local com ADM global. | Fora ate contrato |
| Ativar/Inativar | B | Ativar/Inativar | Existe global, mas faltam protecoes de conta atual/ultimo admin/sessoes. | Posterior |
| Tornar/Remover administrador | B | Tornar administrador/Remover administrador | Existe global, mas faltam protecoes de ultimo admin e escopo. | Posterior |
| Redefinir senha | B | Redefinir senha de login | Existe global; precisa UX segura e clareza login x senha interna. | Posterior |
| Perfis | B | Perfis | Pertence ao modulo local; so entra se contrato definir operacao global por tenant. | Fase futura |
| Excluir | C | - | Nao existe global; hard delete local exige contrato adicional. | Fora |
| Fechar | C | - | Desnecessario no shell React. | Fora |
| Filtrar | C | - | React usa filtros por coluna e busca; botao separado polui toolbar. | Fora |

## 16. Ordem segura de implementacao

1. Exportar CSV.
2. Novo administrador com clinica alvo explicita.
3. Ativar/Inativar com protecoes adicionais.
4. Tornar/Remover administrador com protecao de ultimo admin.
5. Redefinir senha de login.
6. Alterar cadastro global, somente apos endpoint/contrato.
7. Perfis/permissoes globais, somente apos contrato.
8. Excluir, somente se produto aprovar contrato adicional.

Primeiro botao mutavel recomendado: `Novo administrador`, porque ja tem contrato levantado, endpoint e auditoria, mas deve remover `prompt` e tratar clinica/ativacao/setup com UX explicita.

Segunda acao mutavel recomendada: `Ativar/Inativar`, apos bloquear propria conta e ultimo admin.

Terceira acao mutavel recomendada: `Tornar/Remover administrador`, apos bloquear ultimo admin e Owner/sistemico.

`Exportar CSV` deve entrar antes das mutacoes por ser read-only.

## 17. Decisoes objetivas

1. Botoes globais historicos: Atualizar, Filtrar, Exportar CSV, Ativar/Desativar, Tornar/Remover admin, Reset senha.
2. Botoes apenas locais: Novo usuario, Altera, Excluir, Impressos, Preferencias, Permissoes, Perfis e Fecha.
3. Botoes removidos do React: todos os mutaveis foram omitidos por Fase 1 somente leitura, nao por inexistencia historica.
4. Motivo documentado: Fase 1 leitura concluiu sem acoes mutaveis.
5. Toolbar recomendada hoje: Atualizar, Exportar CSV, Novo administrador, Ativar/Inativar, Tornar/Remover administrador, Redefinir senha de login, Buscar usuario.
6. Primeiro botao mutavel: Novo administrador.
7. Segundo: Ativar/Inativar.
8. Terceiro: Tornar/Remover administrador.
9. Exportar CSV entra antes das mutacoes.
10. Excluir permanece fora.
11. Perfis permanece para fase futura.
12. Redefinir senha e de login, nao interna.
13. Deve existir botao contextual para tornar/remover administrador, mas nao antes das protecoes.
14. `Novo usuario` deve ser `Novo administrador` se usar endpoint atual.
15. Ativacao automatica da clinica deve exigir confirmacao especifica ou ser removida do contrato.
16. Endpoint atual nao abre primeiro acesso; nasce com `setup_completed=True`.
17. Acoes contextuais: Ativar/Inativar, Tornar/Remover admin, Redefinir senha de login.
18. Acoes sempre habilitadas: Atualizar, Buscar usuario e Exportar CSV; Novo administrador somente se houver escolha explicita da clinica alvo.

## 18. Confirmacao de ausencia de implementacao

Nesta rodada:

- nenhum arquivo funcional React foi alterado;
- nenhum frontend legado foi alterado;
- nenhum backend foi alterado;
- nenhuma rota foi alterada;
- nenhum botao foi criado;
- nenhum endpoint foi criado;
- nenhum teste funcional foi alterado;
- nenhum commit foi criado;
- nenhum push foi executado.
