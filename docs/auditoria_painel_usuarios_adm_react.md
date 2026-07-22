# Auditoria do painel ADM Usuarios para React

Data: 2026-07-21

Diretorio auditado: `D:\BRANA ARQUIVOS\BRANA CLOUD`

Branch auditada: `modularizacao-segura-fase-1`

HEAD auditado: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`

Remote esperado confirmado: `https://github.com/institutobrana/branacloud.git`

## 1. Contexto

Esta auditoria inicia a frente `ADM -> Usuarios` no frontend React do Brana Cloude. A frente `ADM -> Clinicas` fica temporariamente concluida, com `Excluir conta` deliberadamente pendente por exigir atualizacao previa do mecanismo de exclusao definitiva.

Esta rodada foi exclusivamente de leitura e documentacao. Nenhum codigo funcional, rota, model, schema, teste, dado, banco ou storage foi alterado.

## 2. Relacao com ADM Clinicas

`ADM -> Clinicas` ja incorporou listagem real, selecao, busca, filtros por coluna, ordenacao, rodape e acoes administrativas como `+Teste`, `Suspender/Ativar`, `Demo`, `Mensal`, `Anual`, `Super Admin` e `Nova conta`.

O antigo botao `Novo usuario` de `ADM -> Clinicas` foi removido conceitualmente porque sua funcao real era criar um usuario administrador dentro de uma clinica existente, e nao criar uma nova conta. Essa funcao pertence a uma frente de usuarios.

`Excluir conta` permanece fora de escopo e pendente.

## 3. Relacao com Novo usuario

Documento base: `docs/auditoria_botao_novo_usuario_adm_clinicas.md`.

Contrato confirmado:

- funcao legado: `saCriarUsuarioClinica(clinicaId)`;
- endpoint: `POST /superadmin/usuarios`;
- payload: `clinica_id`, `nome`, `email`, `senha`, `is_admin=true`, `ativar_clinica=true`;
- cria usuario em clinica existente;
- nao cria clinica, tenant, assinatura, MASTER ou convite;
- senha e informada pelo operador;
- `setup_completed=True`;
- pode ativar a clinica quando `ativar_clinica=true`.

Esse fluxo deve ser preservado como referencia para uma fase futura de `ADM -> Usuarios`, mas nao deve ser confundido com `Nova conta`.

## 4. Documentacao auditada

| Documento | Regra encontrada | Estado | Divergencia com codigo |
|---|---|---|---|
| `docs/auditoria_botao_novo_usuario_adm_clinicas.md` | `Novo usuario` cria admin em clinica existente via `POST /superadmin/usuarios`. | Atual. | Nenhuma relevante. |
| `docs/contrato_nova_conta_adm_clinicas.md` | `Nova conta` cria tenant completo e `Novo usuario` pertence a futura tela Usuarios. | Atual. | Nenhuma relevante. |
| `docs/implementacao_nova_conta_adm_clinicas.md` | `Nova conta` Owner-only, cria admin inicial com `setup_completed=False`; `Novo usuario` removido de Clinicas. | Atual. | Nenhuma relevante. |
| `docs/auditoria_exclusao_definitiva_conta_adm_clinicas.md` | Exclusao definitiva de conta precisa atualizar script antes de painel. | Atual. | Nenhuma relevante. |
| `docs/pre_contrato_funcional_usuarios_novas_contas.md` | Usuarios comuns/admins, tipos de usuario, prestador, perfis e permissoes sao conceitos do modulo Usuarios. | Pre-contrato. | Complementa codigo; nao fecha contrato definitivo. |
| `docs/04_funcionalidades.md` | Usuarios/perfis/permissoes usam `backend/routes/user_admin_routes.py`; Superadmin cruza clinicas. | Atual em alto nivel. | Nao detalha UX React futura. |
| `docs/07_fluxos.md` | Criacao administrativa em `/admin/users`; primeiro acesso e senha interna separados. | Atual em alto nivel. | Nao cobre painel ADM global de usuarios. |
| `docs/auditoria_primeiro_acesso_frontend_react.md` | `setup_completed=False` aciona primeiro acesso; senha interna vai para `senha_interna_hash`. | Atual. | Codigo atual confirma. |
| `docs/correcao_orientacao_senha_interna_primeiro_acesso_react.md` | Senha interna protege acoes sensiveis e nao substitui senha de login. | Atual. | Nenhuma relevante. |

## 5. Painel legado localizado

Ha dois paineis/fluxos relevantes:

1. Painel operacional de usuarios da clinica:
   - arquivo: `frontend/index.html`;
   - container: `#users-panel`;
   - titulo: `Configuracao de usuarios do sistema`;
   - item de menu legado: `data-menu-action="usuarios"` / `Usuarios...`;
   - abertura por menu: `showUsersPanel(true)` e `carregarUsuarios()`;
   - botao de toolbar superior: `#btn-open-users`, que abre `users-panel` para admin comum e `superadmin-panel` para Super Admin.

2. Painel ADM/Super Admin:
   - arquivo: `frontend/index.html`;
   - container: `#superadmin-panel`;
   - item de menu: `#menu-superadmin-action`, texto `Painel ADM`;
   - dentro dele existe uma sub-listagem de usuarios da plataforma em `#sa-usuarios-tbody`;
   - carregamento: `saCarregarUsuarios()`;
   - endpoint: `GET /superadmin/usuarios`.

Para a frente `ADM -> Usuarios`, o alvo correto e a listagem global de usuarios da plataforma do `superadmin-panel`, nao o modulo operacional completo `#users-panel` de uma clinica especifica.

## 6. Finalidade

Classificacao: **A. Gestao global de todos os usuarios da plataforma.**

Evidencias:

- O endpoint `GET /superadmin/usuarios` consulta usuarios sem restringir por `current_user.clinica_id`.
- O payload inclui dados de clinica, plano, status de clinica e marcador `is_owner_account`.
- O CSV se chama `usuarios_plataforma_YYYYMMDD_HHMMSS.csv`.
- O acesso exige `_require_superadmin`.

Observacao: o repositorio tambem possui `#users-panel` e `/admin/users`, que representam gestao de usuarios dentro da propria clinica. Isso e outro modulo, com outro escopo e outra autorizacao.

## 7. Menu e rota

Legado:

- menu operacional: `Configurar -> Usuarios...`, `data-menu-action="usuarios"`;
- painel ADM: `Sobre -> Painel ADM`, `data-menu-action="superadmin"`;
- sub-listagem de usuarios dentro do `#superadmin-panel`.

React recomendado:

- rota: `/app/adm/usuarios`;
- menu: submenu de `ADM`, item `Usuarios`;
- autorizacao: mesma guarda de `ADM`, com usuario de plataforma Super Admin; acoes sensiveis futuras devem distinguir Owner quando necessario.

## 8. Tabela global de ADM Usuarios

Colunas reais renderizadas em `saRenderUsuarios()`:

| Ordem | Coluna | Fonte backend | Tipo | Filtro | Ordenacao | Sensivel |
|---:|---|---|---|---:|---:|---:|
| 1 | ID | `id` | numero | Nao | Nao no frontend | Nao |
| 2 | Nome | `nome`, `is_owner_account` | texto/flag | Busca global | Ordem backend por nome/id | Sim |
| 3 | E-mail | `email` | texto | Busca global | Nao no frontend | Sim |
| 4 | Clinica | `clinica_nome`, `clinica_id` | texto/numero | `clinica_id` no backend; sem combo no legado | Nao no frontend | Nao |
| 5 | E-mail clinica | `clinica_email` | texto | Busca global por clinica em backend indireto nao existe; exibicao somente | Nao no frontend | Sim |
| 6 | Plano | `clinica_plano` / `clinica_tipo_conta` | texto | Sim | Nao no frontend | Nao |
| 7 | Status clinica | `clinica_status` | texto | Sim | Nao no frontend | Nao |
| 8 | Trial ate | `clinica_trial_ate` | data | Nao | Nao no frontend | Nao |
| 9 | Perfil | `is_admin` | enum `Admin`/`Usuario` | Sim | Nao no frontend | Nao |
| 10 | Status usuario | `ativo` | enum `Ativo`/`Inativo` | Sim | Nao no frontend | Nao |
| 11 | Acoes | `is_owner_account`, `ativo`, `is_admin` | botoes | Nao | Nao | Sim |

Observacao de divergencia: o HTML do `superadmin-panel` possui cabecalho antigo com 7 colunas, mas `saRenderUsuarios()` renderiza 11 celulas. Isso deve ser corrigido na implementacao React usando a regra real da funcao, nao copiando o cabecalho inconsistente.

## 9. Filtros e busca

Filtros reais do legado ADM global:

- busca global `q`, aplicada por nome/e-mail do usuario em `_listar_usuarios_superadmin`;
- ativo: todos/ativo/inativo;
- admin: todos/admin/usuario;
- plano: todos/demo/mensal/anual/superadmin/owner;
- status da clinica: todas/ativas/trial/expiradas/suspensas;
- limit: 200 no carregamento, 5000 no CSV.

Nao existe no legado global:

- filtro visual por clinica via combo;
- filtro por perfil funcional `access_profile`;
- filtro por primeiro acesso;
- filtro por usuario sistemico;
- filtros por coluna;
- paginacao visual;
- ordenacao clicavel no frontend.

## 10. Toolbar

Toolbar global no `superadmin-panel`:

- `Atualizar`, em `#superadmin-btn-refresh`;
- `Filtrar`, em `#sa-usuarios-filtrar`;
- `Exportar CSV`, em `#sa-usuarios-exportar`.

Acoes por linha em usuarios globais:

- `Desativar` / `Ativar`;
- `Remover admin` / `Tornar admin`;
- `Reset senha`.

Nao existe no painel global legado:

- botao global `Novo usuario` na aba Usuarios;
- botao global `Alterar`;
- botao global `Excluir usuario`.

## 11. Novo usuario

Fluxo global existente:

- legado cria usuario por clinica a partir da linha de `ADM -> Clinicas`, nao da listagem global de usuarios;
- funcao: `saCriarUsuarioClinica(clinicaId)`;
- endpoint: `POST /superadmin/usuarios`;
- cria apenas admin, pois envia `is_admin:true`;
- `ativar_clinica:true`;
- `setup_completed=True`;
- sem convite, email transacional ou senha temporaria;
- senha minima 6;
- e-mail unico globalmente via `Usuario.email` e validacao backend.

Fase React recomendada: nao incluir na Fase 1. Deve entrar como fase propria com selecao explicita da clinica alvo ou acao contextual a partir de uma linha/clinica.

## 12. Alterar usuario

No painel global ADM legado nao ha alteracao ampla de cadastro.

Acoes globais existentes:

- alterar status de usuario: `PATCH /superadmin/usuarios/{user_id}/status`;
- alterar perfil administrativo simples: `PATCH /superadmin/usuarios/{user_id}/perfil`;
- resetar senha de login: `POST /superadmin/usuarios/{user_id}/reset-senha`.

O modulo operacional `/admin/users/{user_id}` permite alterar dados basicos dentro da clinica:

- nome;
- apelido;
- tipo_usuario;
- e-mail;
- `is_admin`;
- ativo;
- `forcar_troca_senha`;
- prestador vinculado;
- unidade de atendimento.

Esse CRUD operacional nao deve ser migrado automaticamente para `ADM -> Usuarios` global sem contrato adicional.

## 13. Ativar/Inativar

ADM global:

- endpoint: `PATCH /superadmin/usuarios/{user_id}/status`;
- payload: `{ "ativo": boolean }`;
- autorizacao: `_require_superadmin`;
- bloqueia Owner por e-mail;
- bloqueia usuario sistemico;
- registra auditoria `usuario_status_update`;
- nao bloqueia explicitamente autoinativacao do operador Super Admin nao-owner;
- nao invalida tokens existentes diretamente; `get_current_user` bloqueia usuario inativo em chamadas futuras, exceto Owner.

Modulo operacional:

- endpoint: `PATCH /admin/users/{user_id}/active`;
- bloqueia usuario sistemico;
- bloqueia autodesativacao;
- zera `online` quando inativa;
- nao registra auditoria de plataforma.

## 14. Excluir usuario

ADM global:

- nao ha acao global de excluir usuario em `saRenderUsuarios()`;
- nao ha endpoint `DELETE /superadmin/usuarios/{id}` localizado.

Modulo operacional:

- endpoint: `DELETE /admin/users/{user_id}`;
- escopo: mesma clinica do `current_user`;
- bloqueia usuario sistemico;
- bloqueia autoexclusao;
- bloqueia ultimo administrador da clinica;
- desprende vinculos com prestador, perfis, relatorios, controle protetico e campos de tratamento;
- tenta exclusao fisica do usuario;
- retorna 409 em `IntegrityError`;
- se a clinica ficar sem usuarios, arquiva e-mail da clinica e inativa clinica.

Classificacao da exclusao para `ADM -> Usuarios`: **B. Precisa de contrato adicional.**

Nao deve entrar na primeira entrega React.

## 15. Usuario sistemico

Regra conhecida:

- codigo `255`;
- `is_system_user=True` ou inferido por codigo/tipo/nome;
- nome/tipo `Clinica`;
- `setup_completed=True`;
- nao interativo;
- nao admin.

No modulo operacional:

- aparece na listagem de `/admin/users`;
- `usersCanManageSelected()` bloqueia acoes de gerencia no frontend legado;
- backend bloqueia alterar, excluir, status, senha, permissoes e perfis por `_assert_not_system_user`.

No ADM global:

- `_listar_usuarios_superadmin` inclui `is_system_user` no payload;
- `saRenderUsuarios()` nao exibe coluna especifica de usuario sistemico;
- acoes por linha so protegem `is_owner_account` no frontend, mas endpoints de status/perfil/reset tambem bloqueiam `is_system_user`.

Recomendacao para React: **exibir protegido com cadeado/label "Sistemico"**, nao ocultar. Justificativa: a contagem global e auditoria operacional ficam mais transparentes, enquanto as acoes ficam desabilitadas.

## 16. Owner, MASTER e Super Admin

Representacao real:

- Owner e derivado por e-mail em `is_owner_email`;
- `is_master` nao e persistido em `usuarios`;
- Super Admin de plataforma e derivado por Owner ou por admin de clinica cujo `tipo_conta` seja Super Admin/Master/Owner/Vitalicia;
- `is_superadmin` e derivado em contexto de usuario, nao persistido no model `Usuario`;
- `is_admin` e persistido.

Protecoes:

- endpoints globais de usuario bloqueiam Owner por e-mail;
- endpoints globais bloqueiam usuario sistemico;
- nao ha coluna especifica de MASTER/Super Admin no legado global, apenas plano da clinica e Owner no nome.

Matriz:

| Ator | Pode visualizar | Pode criar | Pode alterar | Pode inativar | Pode excluir |
|---|---:|---:|---:|---:|---:|
| Owner | Sim, acesso total de plataforma | Sim, Nova conta Owner-only; novo admin por contrato futuro | Sim, mas nao deve ser alterado por endpoints comuns | Nao pelos endpoints globais auditados | Nao por endpoints comuns |
| MASTER nao-Owner | Pode acessar se admin em clinica Super Admin/Master | Pode criar admin via `POST /superadmin/usuarios` hoje, pois `_require_superadmin` basta | Pode status/perfil/reset em nao protegidos | Pode inativar nao protegidos | Sem delete global |
| Super Admin de clinica | Pode acessar painel global se `is_platform_superadmin_user` | Idem acima | Idem acima | Idem acima | Sem delete global |
| Admin comum | Nao acessa `/superadmin`; acessa `/admin/users` da propria clinica | Sim, dentro da propria clinica | Sim, dentro da propria clinica | Sim, com bloqueios | Sim, com contrato operacional atual |
| Usuario comum | Nao | Nao | Nao | Nao | Nao |

## 17. Perfis de acesso

Entidades:

- `access_profile`: perfis funcionais por clinica;
- `usuario_perfil_acesso`: vinculo `clinica_id + usuario_id + prestador_id + perfil_id`;
- `permissoes_json`: permissoes por modulo/funcoes no usuario.

No painel global ADM legado:

- nao exibe perfis funcionais;
- nao atribui `access_profile`;
- apenas alterna `is_admin`.

No modulo operacional:

- `GET /admin/users/{user_id}/profiles`;
- `PATCH /admin/users/{user_id}/profiles`;
- `GET /admin/users/{user_id}/permissions`;
- `PATCH /admin/users/{user_id}/permissions`;
- admins escondem a aba de perfis no frontend legado;
- perfis sao por clinica e devem validar prestadores da mesma clinica.

Recomendacao: perfis nao entram na Fase 1 de ADM global. Devem entrar depois com contrato de cruzamento plataforma x tenant.

## 18. Senha de login

Senha de login:

- campo: `usuarios.senha_hash`;
- login usa `POST /login`;
- reset global: `POST /superadmin/usuarios/{user_id}/reset-senha`;
- reset operacional: `POST /admin/users/{user_id}/reset-password`;
- troca pelo usuario/admin operacional: `POST /admin/users/change-password`;
- senha minima 6;
- senha original nao e retornada;
- reset nao invalida tokens explicitamente; proximas chamadas dependem de token ainda valido.

Nao confundir com senha interna.

## 19. Senha interna

Senha interna:

- campo: `usuarios.senha_interna_hash`;
- configurada no primeiro acesso por `POST /auth/setup/complete`;
- usada por `verify_admin_password` para liberar modulos protegidos;
- fallback tecnico usa senha de login do admin quando senha interna nao existe;
- nao e alterada pelos endpoints globais de reset de senha de login.

Recomendacao: qualquer acao futura de reset de senha interna em `ADM -> Usuarios` exige contrato proprio.

## 20. Primeiro acesso

Conceito:

- `setup_completed=False` indica usuario inicial pendente de setup;
- `POST /auth/setup/complete` grava `senha_interna_hash`, marca `setup_completed=True`, limpa `forcar_troca_senha` e pode marcar online.

Painel global legado:

- nao exibe coluna `setup_completed`;
- nao filtra primeiro acesso;
- nao possui acao para reabrir setup.

Recomendacao: Fase 1 pode exibir `setup_completed` se o endpoint global for ampliado depois; como o payload atual nao retorna o campo na lista global, nao inventar coluna na primeira implementacao.

## 21. Endpoints inventariados

| Endpoint | Metodo | Finalidade | Autorizacao | Payload | Risco |
|---|---|---|---|---|---|
| `/superadmin/usuarios` | GET | Listar usuarios da plataforma | `_require_superadmin` | query `q`, `clinica_id`, `ativo`, `admin`, `plano`, `clinica_status`, `limit` | Exposicao global de PII; precisa ADM guard |
| `/superadmin/usuarios/export.csv` | GET | Exportar CSV global | `_require_superadmin` | mesmos filtros | Export de PII |
| `/superadmin/usuarios` | POST | Criar usuario em clinica existente | `_require_superadmin` | `clinica_id`, `nome`, `email`, `senha`, `is_admin`, `ativar_clinica` | Cria admin por padrao no legado |
| `/superadmin/usuarios/{id}/status` | PATCH | Ativar/inativar usuario global | `_require_superadmin` | `ativo` | Nao bloqueia autoinativacao global explicitamente |
| `/superadmin/usuarios/{id}/perfil` | PATCH | Alternar `is_admin` | `_require_superadmin` | `is_admin` | Escalada/rebaixamento admin |
| `/superadmin/usuarios/{id}/reset-senha` | POST | Resetar senha de login | `_require_superadmin` | `nova_senha` | Nao invalida tokens explicitamente |
| `/admin/users` | GET | Listar usuarios da clinica atual | `require_module_access("usuarios")` + senha admin se habilitada | nenhum | Tenant local |
| `/admin/users` | POST | Criar usuario na clinica atual | admin e modulo usuarios | dados cadastrais, senha, vinculos | Cria usuarios comuns/admins |
| `/admin/users/{id}` | PATCH | Alterar usuario local | admin e modulo usuarios | dados cadastrais/status/admin/vinculos | Pode alterar `is_admin` local |
| `/admin/users/{id}/active` | PATCH | Ativar/inativar local | admin e modulo usuarios | `ativo` | Bloqueia autodesativacao |
| `/admin/users/{id}` | DELETE | Excluir usuario local | admin e modulo usuarios | nenhum | Hard delete com dependencias |
| `/admin/users/{id}/reset-password` | POST | Reset senha de login local | admin e modulo usuarios | `nova_senha` | Nao invalida tokens explicitamente |
| `/admin/users/change-password` | POST | Trocar senha | usuario autenticado/admin | usuario/codigo/senha atual/nova | Usa nome/codigo para admin |
| `/admin/users/{id}/permissions` | GET/PATCH | Permissoes por modulo | admin e modulo usuarios | permissoes/easy | Escalada de permissao |
| `/admin/users/{id}/profiles` | GET/PATCH | Perfis por prestador | admin e modulo usuarios | perfil/prestadores | Deve validar mesma clinica |
| `/auth/setup/complete` | POST | Primeiro acesso/senha interna | usuario autenticado pendente | senha/confirmacao | Reabre senha interna se chamado de novo |

## 22. Models e vinculos

| Campo/Vinculo | Entidade | Obrigatorio | Editavel | Protegido | Impacto |
|---|---|---:|---:|---:|---|
| `id` | `Usuario` | Sim | Nao | Sim | Identidade tecnica |
| `codigo` | `Usuario` | Nao | Sim no modulo local | Codigo 255 reservado | Integracao com legado |
| `nome` | `Usuario` | Sim | Sim | Sistemico bloqueado | Exibicao/login por nome em troca senha local |
| `email` | `Usuario` | Sim unico | Sim | Owner protegido | Login e unicidade global |
| `senha_hash` | `Usuario` | Sim | Reset/troca | Sistemico protegido | Login |
| `senha_interna_hash` | `Usuario` | Nao | Setup/admin password | Precisa contrato | Modulos protegidos |
| `clinica_id` | `Usuario` | Sim | Nao nos endpoints auditados | Tenant | Isolamento |
| `prestador_id` | `Usuario` | Nao | Sim local | Mesma clinica | Agenda/operacao |
| `unidade_atendimento_id` | `Usuario` | Nao | Sim local | Mesma clinica | Operacao |
| `is_admin` | `Usuario` | Sim | Sim | Owner/sistemico bloqueados | Permissao administrativa |
| `is_system_user` | `Usuario` | Sim | Nao | Sim | Conta base nao interativa |
| `setup_completed` | `Usuario` | Sim | Setup | Precisa contrato para reabrir | Primeiro acesso |
| `ativo` | `Usuario` | Sim | Sim | Owner/sistemico/autodesativacao parcial | Login |
| `permissoes_json` | `Usuario` | Nao | Sim local | Sistemico bloqueado | Modulos |
| `access_profile` | Perfil | Sim por clinica | Via service | Por clinica | Areas funcionais |
| `usuario_perfil_acesso` | Vinculo | Sim | Sim local | Mesma clinica | Perfil x prestador |

## 23. Seguranca

Protecoes existentes:

- `get_current_user` bloqueia usuario inativo, exceto Owner.
- `get_current_user` bloqueia usuario sistemico.
- `setup_completed=False` bloqueia rotas fora da allowlist.
- `/superadmin/*` exige `_require_superadmin`.
- `/admin/users` exige modulo `usuarios` e senha administrativa se controle ativo.
- endpoints globais protegem Owner e usuario sistemico em status/perfil/reset.
- endpoint local bloqueia usuario sistemico, autoexclusao, autodesativacao e ultimo admin em exclusao.

Lacunas:

- endpoints globais nao sao Owner-only, aceitam Super Admin derivado por tipo de conta.
- reset de senha nao invalida tokens explicitamente.
- status global nao bloqueia autoinativacao explicitamente.
- painel global nao mostra usuario sistemico como protegido no frontend legado.
- `setup_completed` nao aparece na lista global.
- exclusao local e hard delete e precisa contrato antes de migrar para ADM global.

## 24. Riscos

- Escalada de privilegio ao expor `Tornar admin` sem UX/contrato claro.
- Rebaixar admin de clinica errada em painel global.
- Resetar senha de usuario ativo sem invalidador de sessoes.
- Misturar senha de login e senha interna no mesmo modal.
- Expor PII em CSV sem trilha/confirmacao.
- Migrar hard delete local para ADM global sem contrato.
- Tratar `Novo usuario` como nova conta por engano.

## 25. Arquitetura React recomendada

Estrutura sugerida futura, sem implementacao nesta rodada:

- `frontend-react/src/features/admin/users/UsersPage.jsx`
- `frontend-react/src/features/admin/users/components/UsersTable.jsx`
- `frontend-react/src/features/admin/users/components/UsersToolbarContent.jsx`
- `frontend-react/src/features/admin/users/services/adminUsersApi.js`
- `frontend-react/src/features/admin/users/hooks/useAdminUsers.js`
- `frontend-react/src/features/admin/users/utils/adminUsersNormalizer.js`
- `frontend-react/src/features/admin/users/utils/adminUsersTable.js`
- testes estruturais em `frontend-react/tests/adminUsers.test.js`

Padroes:

- shell em L do ADM;
- toolbar global no `App.jsx`, igual `ADM -> Clinicas`;
- tabela compacta;
- filtros por coluna apenas na fase propria;
- selecao unica;
- rodape;
- tema claro/escuro;
- sem wrappers duplicados.

## 26. Ordem segura de implementacao

Fase 1:

- rota `/app/adm/usuarios`;
- menu ADM `Usuarios`;
- listagem real via `GET /superadmin/usuarios`;
- busca e filtros existentes do legado global;
- selecao unica;
- rodape;
- somente leitura;
- badges protegidos para Owner e usuario sistemico.

Fase 2:

- export CSV ou acao equivalente, com confirmacao e auditoria/UX.

Fase 3:

- Novo administrador em clinica existente, reutilizando contrato `POST /superadmin/usuarios`, com clinica alvo explicita.

Fase 4:

- Ativar/Inativar usuario global, apos contrato de autoinativacao e sessoes.

Fase 5:

- Alternar admin, com protecoes de ultimo admin e escopo por clinica.

Fase 6:

- Reset de senha de login, sem misturar senha interna.

Fase 7:

- Perfis/permissoes, se o produto decidir que ADM global deve operar isso.

Fase 8:

- Excluir usuario, somente com contrato adicional.

## 27. Decisoes finais

1. Nome correto do painel: **Usuarios**.
2. Escopo: **todos os usuarios da plataforma**, com dados de clinica e plano.
3. Quem pode acessar: usuarios que passam em `_require_superadmin`; acoes futuras podem exigir Owner para casos sensiveis.
4. Usuario sistemico: **exibir protegido**, com acoes desabilitadas.
5. Primeira entrega React: **somente leitura**.
6. Exclusao: **precisa contrato adicional**.
7. Painel Clinicas: temporariamente concluido; `Excluir conta` continua pendente.

## 28. Pendencias

- Definir se `ADM -> Usuarios` global deve permitir criar usuario comum ou apenas administrador.
- Definir se `setup_completed` deve entrar no payload global.
- Definir politica de invalidacao de sessoes/tokens apos reset de senha e inativacao.
- Definir contrato para alternar admin globalmente.
- Definir contrato para exclusao de usuario global.
- Definir se perfis/permissoes pertencem ao ADM global ou somente ao modulo local da clinica.

## 29. Ausencia de implementacao

Confirmado:

- nenhuma rota React criada;
- nenhum item de menu alterado;
- nenhuma pagina criada;
- nenhum hook/service/component funcional criado;
- nenhum endpoint alterado;
- nenhum model/schema/migration alterado;
- nenhum teste funcional alterado;
- nenhum dado persistido criado.

## 30. Git

Antes:

- `git status --short`: worktree ja estava suja com alteracoes preexistentes.
- `git branch --show-current`: `modularizacao-segura-fase-1`.
- `git remote -v`: `origin https://github.com/institutobrana/branacloud.git`.
- `git rev-parse HEAD`: `4372001973b8d364f8dc5c8b7fb5d50b9aa9454c`.
- `git diff --cached --name-only`: vazio.
- `git fetch origin`: executado.
- divergencia com remoto: `0 0`.

Ao final desta auditoria deve permanecer:

- stage vazio;
- sem commit;
- sem push.

## 31. Atualizacao - Fase 1 leitura implementada

Em 2026-07-21, a primeira fase de `ADM -> Usuarios` foi implementada no React com escopo exclusivamente de leitura.

- O item `Usuarios` passou a ficar disponivel no submenu ADM.
- A rota `/app/adm/usuarios` usa a barra global do shell ADM em `App.jsx`.
- A tela consulta o endpoint real `GET /superadmin/usuarios`.
- A implementacao modular ficou isolada em `frontend-react/src/features/admin/users/`.
- A toolbar contem somente `Atualizar` e `Buscar usuario`.
- A tabela possui selecao unica, filtros por coluna, ordenacao, colunas visiveis, rodape e estados de loading/erro/vazio.
- `setup_completed` nao e retornado pelo endpoint atual; quando a coluna opcional e habilitada, o valor e exibido como `Nao disponivel`.
- Nenhuma acao mutavel de usuario foi implementada nesta fase.

## 32. Atualizacao - auditoria da toolbar futura

Em 2026-07-21, a toolbar historica de usuarios foi auditada em leitura e separada por dominio:

- painel local da clinica: `#users-panel`, `showUsersPanel()`, `carregarUsuarios()` e `/admin/users`;
- painel global ADM: `#superadmin-panel`, `saCarregarUsuarios()` e `/superadmin/usuarios`.

Documentos criados:

- `docs/auditoria_toolbar_adm_usuarios_historico_atual.md`;
- `docs/contrato_toolbar_adm_usuarios_react.md`.

Decisao: a Fase 1 continua somente leitura. Nenhum botao mutavel foi implementado. A toolbar funcional futura permanece em contrato.

## 33. Atualizacao - auditoria de presenca online

Em 2026-07-22, foi concluida auditoria tecnica exclusivamente documental para a futura coluna `Online` em `ADM -> Usuarios`.

Documentos criados:

- `docs/auditoria_presenca_online_usuarios.md`;
- `docs/contrato_coluna_online_adm_usuarios.md`.

Decisao tecnica: nao reutilizar `usuarios.online`, `usuarios.ultimo_login_em` ou campos cadastrais como presenca. A opcao recomendada para implementacao futura e criar `usuarios.last_seen_at TIMESTAMP WITH TIME ZONE NULL`, atualizar com throttle backend de 60 segundos por usuario e calcular `is_online` no backend por janela objetiva de 3 minutos.

A coluna nao foi implementada nesta rodada.

## 34. Atualizacao - Ver conta read-only implementado

Em 2026-07-22, foi implementada a acao `Ver conta` na toolbar React de `ADM -> Usuarios`.

- Origem: `/app/adm/usuarios`.
- Destino: `/app/adm/clinicas`.
- Identificador: `clinica_id` do usuario selecionado.
- Mecanismo: estado transitorio controlado por `App.jsx` com `selectedClinicId`.
- Consumo: `ClinicsPage` seleciona a clinica por ID exato e limpa filtros locais se eles ocultarem a linha alvo.

Nao houve backend novo, banco, migration, acao mutavel, commit ou push.
