# Auditoria complementar - Usuarios, permissoes, licenca e referencia EasyDental

## 1. Objetivo da auditoria
Fazer uma auditoria complementar, somente leitura, para confrontar o pre-contrato funcional atualizado do modulo Usuarios com o estado atual do Brana Cloud, com os documentos ja existentes, com o banco atual (apenas SELECT), com o historico Git (apenas leitura) e com referencias historicas do EasyDental/instalacao local tambem apenas em modo leitura.

Objetivo pratico: levantar evidencias suficientes para um contrato funcional definitivo do modulo Usuarios para novas contas/clinicas, sem corrigir nada nesta etapa.

## 2. Branch conferida
- `modularizacao-segura-fase-1`

## 3. Estado inicial do git
- Branch atual confirmada: `modularizacao-segura-fase-1`
- Antes desta auditoria o workspace ja possuía varios arquivos `?? docs/...` de auditorias anteriores, todos fora do escopo desta etapa.
- Nao havia mudancas rastreadas em codigo nesta auditoria complementar.

## 4. Comandos executados
Comandos de leitura usados nesta etapa:

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -30`
- `git log --oneline --all -- backend/services/signup_service.py`
- `git log --oneline --all -- backend/routes/auth_routes.py`
- `git log --oneline --all -- backend/services/access_profiles_service.py`
- `git grep -n ...` para `setup_completed`, `protected_password_required`, `usersTiposCache`, `access_profile`, `usuario_perfil_acesso`, `licenca`, `trial`, `EasyDental`
- `Select-String` em arquivos de backend, frontend, docs e instalador local do EasyDental
- `Get-ChildItem` e `Test-Path` em `D:\UTIL\EasyDental_7.6_BR`
- consultas SELECT no PostgreSQL via Python/SQLAlchemy
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`

## 5. Arquivos Brana Cloud analisados
### Frontend
- `frontend/app.js`
- `frontend/index.html`
- `frontend/js/modules/users-admin-modal-visual.js`
- `frontend/js/modules/auxiliares.js`
- `frontend/prestadores_override.js`

### Backend
- `backend/routes/auth_routes.py`
- `backend/routes/user_admin_routes.py`
- `backend/routes/prestadores_routes.py`
- `backend/routes/cadastros_routes.py`
- `backend/routes/licenca_routes.py`
- `backend/security/dependencies.py`
- `backend/security/admin_password.py`
- `backend/security/permissions.py`
- `backend/security/trial_middleware.py`
- `backend/services/signup_service.py`
- `backend/services/access_profiles_service.py`
- `backend/models/clinica.py`
- `backend/models/usuario.py`
- `backend/models/prestador_odonto.py`
- `backend/models/access_profile.py`
- `backend/models/usuario_perfil_acesso.py`
- `backend/security/system_accounts.py`

## 6. Documentos Brana Cloud analisados
Documentos consultados nesta auditoria e nas auditorias complementares anteriores da mesma trilha:

- `docs/auditoria_fluxo_primeiro_acesso_novas_clinicas.md`
- `docs/auditoria_mestre_usuarios_novas_contas_dependencias.md`
- `docs/users_admin_primeira_separacao_real_execucao.md`
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_plano_correcao_controlada_grant_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`
- `docs/auditoria_fina_frontend_admin_usuarios.md`
- `docs/auditoria_fina_user_admin_permissoes.md`
- `docs/auditoria_fina_user_admin_cadastro_edicao.md`
- `docs/auditoria_fina_permissions_por_modulo.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`
- `docs/auditoria_contratos_auth_requestjson_me_security.md`
- `docs/auditoria_fina_auth_me_grant_sessao.md`
- `docs/04_funcionalidades.md`
- `docs/05_banco_dados.md`
- `docs/06_seguranca.md`
- `docs/07_fluxos.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- varios docs do historico de auditoria em `docs/_historico_auditoria/`

## 7. Historico Git analisado
Historico principal consultado:

- `backend/services/signup_service.py`
  - `31c14f2 Zera valores Seeds Tabelas`
  - `49d1e41 Modulo Anamnese sem modularizacao`
  - `c132c45 Versao inicial do Brana Cloud`

- `backend/routes/auth_routes.py`
  - `717f59c On main: Pendencias backend restantes antes da modularizacao`
  - `c132c45 Versao inicial do Brana Cloud`

- `backend/routes/user_admin_routes.py`
  - `c132c45 Versao inicial do Brana Cloud`

- `backend/services/access_profiles_service.py`
  - `c132c45 Versao inicial do Brana Cloud`

- `frontend/app.js`
  - `d9b3673 Corrige refresh protegido em usuarios admin`
  - `22e7652 Extrai visual do modal admin de usuarios`
  - `d9b3234 Sintetiza primeira separacao real usuarios admin`

## 8. Pre-contrato funcional atualizado informado pelo usuario
Bloco tratado como pre-contrato funcional atualizado informado pelo usuario - a validar contra Brana Cloud atual e referencia EasyDental.

### A) Nascimento da nova conta
1. Quando uma nova conta nasce, nasce uma clinica.
2. A clinica recebe um `clinica_id`.
3. Junto com a clinica nasce um prestador sistemico chamado `Clínica`.
4. O prestador `Clínica` aparece na tela de Prestadores.
5. O prestador `Clínica` e estrutural, vinculado a clinica e nao pode ser apagado.
6. O prestador `Clínica` tem suporte/configuracao de agenda.
7. O primeiro usuario da conta e o ADM/dono.
8. O primeiro usuario nasce com login proprio: e-mail + senha.
9. No primeiro acesso deve aparecer uma tela especial, exibida somente uma vez.
10. Essa tela informa que aquele usuario e o ADM/dono da conta.
11. Nessa tela o ADM cria/configura a senha administrativa interna.
12. A senha administrativa interna e usada dentro do sistema para liberar modulos protegidos.
13. A senha administrativa interna e conceitualmente diferente da senha de login.
14. O ADM pode escolher usar a mesma senha para login e protecao interna, mas as finalidades sao diferentes.
15. Os modulos Usuarios e Opcoes do sistema/Configuracao nascem protegidos por essa senha administrativa interna.

### B) Usuarios criados depois pelo ADM
16. Depois do primeiro acesso, o ADM cria usuarios como dentistas, secretarias, auxiliares e outros.
17. Cada usuario criado deve ter login proprio com e-mail e senha.
18. Esse usuario depois pode alterar/recuperar sua senha pela tela normal de login.
19. O usuario criado pelo ADM deve conseguir acessar o sistema com seu proprio e-mail e senha.
20. Por padrao, novos usuarios criados pelo ADM devem ter acesso permitido aos modulos comuns do sistema.
21. A excecao inicial sao os modulos Usuarios e Opcoes do sistema/Configuracao.
22. Usuarios e Opcoes do sistema/Configuracao devem permanecer protegidos/restritos.
23. O ADM pode depois configurar as permissoes de cada usuario por modulo.

### C) Permissoes por modulo
24. Cada modulo pode ficar em um dos tres estados: permitir acesso, proibir acesso, solicitar senha.
25. Permitir acesso significa que o modulo aparece normal e o usuario consegue abrir.
26. Proibir acesso significa que o modulo aparece no menu com aparencia apagada/desabilitada e o usuario nao consegue abrir.
27. Solicitar senha significa que, ao clicar no modulo, aparece uma tela simples pedindo a senha administrativa/protegida.
28. Se a senha estiver correta, o modulo abre.
29. Se a senha estiver errada, o modulo nao abre.
30. Permissoes de acesso por modulo sao uma camada separada da aba Perfis de acesso.
31. As permissoes definem se o usuario pode abrir ou nao cada modulo.
32. Os perfis/vinculos definem os contextos/prestadores que o usuario pode acessar dentro dos modulos permitidos.

### D) Tipo do usuario
33. O campo `Tipo do usuario` no modal de usuario nao pertence ao modulo Usuarios.
34. O campo `Tipo do usuario` vem do modulo Tabelas Auxiliares.
35. Os tipos de usuario podem ser alterados em Tabelas Auxiliares.
36. Exemplos atuais vistos na UI: Dentista (CD), Auxiliar (ACD), Secretaria(o), Gerente, Atendente, Protetico, Perito, Vendedor(a), THD.
37. O modulo Usuarios deve apenas consumir essa lista.
38. Se o ADM alterar Tipos de usuario em Tabelas Auxiliares, o combo do modulo Usuarios deve refletir a alteracao.

### E) Usuario x Prestador
39. Nem todo usuario precisa ser prestador.
40. Alguns usuarios podem ser vinculados a prestadores.
41. Um dentista normalmente deve ser associado a um prestador.
42. Uma secretaria pode acessar um ou varios prestadores, conforme configuracao.
43. O ADM pode ser prestador ou nao.
44. O vinculo usuario/prestador define acesso ao contexto daquele prestador.
45. Esse contexto pode incluir agenda, conta corrente e outros modulos relacionados ao prestador.

### F) Aba Perfis de acesso
46. A aba `Perfis de acesso` nao deve ser entendida como criacao obrigatoria de cargos padrao.
47. Nova clinica nao deve nascer com cargos padrao prontos como Secretaria, Dentista, Financeiro etc.
48. O ADM deve configurar manualmente usuarios, prestadores, vinculos e permissoes.
49. A aba Perfis de acesso deve permitir vincular usuario a prestadores/perfis operacionais/contextos de acesso.
50. Se o usuario X tem checkboxes marcados para prestadores A, B e C, ele passa a ter acesso aos contextos desses prestadores.
51. A ausencia de cargos padrao nao significa que a tela Perfis de acesso possa ficar quebrada.
52. A tela deve funcionar com a estrutura minima necessaria para que o ADM vincule usuarios aos prestadores/contextos corretos.
53. E necessario descobrir se `access_profile` representa uma estrutura funcional base obrigatoria ou se deveria ser dispensavel.
54. Nao assumir automaticamente que `profiles: []` significa falta de cargos padrao.
55. Verificar se o codigo atual mistura ou separa corretamente cargos/tipos de usuario, permissoes por modulo, perfis funcionais e vinculos usuario/prestador.

### G) Licenca da conta
56. O acesso ao sistema depende da licenca da conta/clinica.
57. A conta pode ser demo, mensal ou anual.
58. Se a conta estiver com licenca em dia, todos os usuarios da conta podem acessar, respeitando suas permissoes internas.
59. Se a licenca da conta vencer, nenhum usuario daquela conta deve conseguir acessar.
60. O bloqueio por vencimento da licenca deve valer para todos os usuarios da mesma conta/clinica, nao apenas para o ADM.
61. E necessario mapear onde esta o tipo de licenca, a data de vencimento, como o login verifica licenca e como o bloqueio por licenca vencida funciona.
62. Comparar essa regra com o EasyDental, se houver referencia.

## 9. Consultas SELECT realizadas
Somente leitura no banco PostgreSQL.

### Conexao identificada
- `postgresql://postgres:1234@localhost:5432/brana_saas`

### Tabelas consultadas
- `clinicas`
- `usuarios`
- `prestador_odonto`
- `access_profile`
- `usuario_perfil_acesso`

### Resultados relevantes
- `clinicas`: 3 registros
- `usuarios`: 11 registros
- `prestador_odonto`: 7 registros
- `access_profile`: 10 registros
- `usuario_perfil_acesso`: 0 registros
- `setup_completed = false`: 0 usuarios no estado atual

### Clinicas observadas
- `1: Instuto Brana - Odontologia`
- `4: Alisson Cristóvão Butarelo`
- `8: Instituto Brana`

### Observacoes do banco
- O prestador sistemico `Clínica` existe nas clinicas observadas.
- `access_profile` existe apenas para a clinica 8.
- `usuario_perfil_acesso` esta vazio.
- A clinica 1 nao possui `access_profile`, o que explica `profiles: []` no endpoint de perfis.

## 10. Referencias EasyDental/legado consultadas
### Referencias diretas somente leitura consultadas nesta etapa
- `D:\UTIL\EasyDental_7.6_BR\Readme.doc`

### Referencias historicas no proprio repositório consultadas
- `docs/_historico_auditoria/01_visao_geral.md`
- `docs/_historico_auditoria/03_mapa_codigo.md`
- `docs/_historico_auditoria/04_funcionalidades.md`
- `docs/_historico_auditoria/06_seguranca.md`
- `docs/_historico_auditoria/15_levantamento_pre_migracao.md`
- `docs/intervencoes_procedimentos_*_easydental*.md`

### Observacao sobre o legado
- `Y:\EDS70` nao estava disponivel neste ambiente (`Test-Path` retornou `False`).
- O instalador local `D:\UTIL\EasyDental_7.6_BR` estava disponivel em modo leitura.
- Nenhum arquivo foi copiado, alterado, salvo ou exportado a partir do legado.

## 11. Confirmacao de uso do EasyDental apenas como referencia somente leitura
- Confirmado.
- A consulta ao legado foi apenas de leitura.
- Nao houve copia de arquivos, nao houve importacao, nao houve execucao de script corretivo e nao houve alteracao em qualquer pasta do EasyDental/legado.

## 12. Fluxo atual de nascimento de nova conta no Brana Cloud
Evidencias no codigo:

- `POST /signup/request-code` e `POST /signup/confirm` existem em `backend/routes/auth_routes.py`.
- `signup_confirm()` chama `criar_conta_saas(db, nome=payload.nome.strip(), email=email, senha=payload.senha)`.
- `criar_conta_saas()` cria a `Clinica` com `tipo_conta="DEMO 7 dias"` e `trial_ate = datetime.utcnow() + timedelta(days=7)`.
- O primeiro usuario nasce como `codigo=1`, `tipo_usuario="Clínica"`, `is_admin=True`, `setup_completed=False`.
- O fluxo tambem cria o prestador sistemico `Clínica`, o usuario sistemico de sistema, perfis de acesso e seeds iniciais.
- Depois do signup, o token e emitido para o usuario criado.

## 13. Fluxo atual de primeiro acesso no Brana Cloud
- `frontend/app.js` chama `carregarSessao()`.
- Se `data.setup_completed === false`, a UI abre `panelSetup`.
- A tela existe no HTML em `frontend/index.html` (`panel-setup`).
- `setupComplete()` envia `POST /auth/setup/complete`.
- O backend marca `usuario.setup_completed = True`, grava `senha_hash` e libera a aplicacao normal.
- A tela e exibida no primeiro acesso e some depois que `setup_completed` passa para `true`.

## 14. Senha de login x senha administrativa interna
### O que o codigo mostra
- O login normal usa `email + senha`.
- O desbloqueio protegido usa a mesma `senha_hash` do usuario admin da clinica.
- `backend/security/admin_password.py` resolve o admin da clinica e valida `verify_password(senha, admin.senha_hash)`.

### Conclusao desta auditoria
- No estado atual do codigo, nao foi encontrada uma senha administrativa separada em coluna/propriedade propria.
- A senha administrativa interna existe como contrato funcional de desbloqueio protegido, mas ela reaproveita a mesma senha_hash do admin.

## 15. Protecao inicial de Usuarios e Opcoes/Configuracao
- Confirmado que o contrato de protecao existe.
- `backend/security/dependencies.py` usa `require_module_access("usuarios")` e `require_admin_password_if_user_control_enabled("usuarios")` no router de usuarios.
- `require_module_access()` e `require_admin_password_if_user_control_enabled()` aceitam `X-Protected-Password` e `X-Protected-Grant`.
- `require_admin_password_if_user_control_enabled()` olha `clinicas.opcoes_sistema_json` e, quando ativo, protege o modulo `usuarios`.
- O frontend trata `403` estruturado com `protected_password_required`, abre modal de senha protegida e reexecuta com `X-Protected-Grant`.

## 16. Cadastro de novos usuarios pelo ADM
- `backend/routes/user_admin_routes.py` possui `POST /admin/users`.
- O payload inclui `nome`, `apelido`, `tipo_usuario`, `email`, `senha`, `prestador_row_id`, `unidade_row_id`, `ativo`, `is_admin`, `forcar_troca_senha`.
- O registro grava `senha_hash`, `permissoes_json`, `is_system_user=False`.
- A criacao administrativa exige token, permissao no modulo `usuarios` e pode exigir senha protegida.

## 17. Se novos usuarios tem login proprio
- Sim.
- O codigo de criacao/edicao de usuarios trabalha com `email` e `senha`.
- O login usa `OAuth2PasswordRequestForm` com username como e-mail.
- O backend tambem expõe `POST /password/forgot` e `POST /password/reset`, portanto o fluxo de recuperacao de senha existe no contrato atual.

## 18. Se novos usuarios podem alterar/recuperar senha pela tela de login
- Existe contrato de recuperacao via `POST /password/forgot` e `POST /password/reset`.
- Nesta auditoria nao foi feito teste funcional em runtime desse fluxo, mas a rota existe e e publica.
- Portanto: o fluxo de recuperacao de senha existe no backend; a validacao visual/runtime nao foi o foco desta etapa.

## 19. Permissoes padrao de novos usuarios
### O que o codigo confirma
- O baseline de permissoes e definido por `backend/security/permissions.py`.
- `PERMISSION_LEVELS = ("desabilitado", "protegido", "habilitado")`.
- `default_permissions(tipo_usuario, is_admin)` gera a matriz inicial.
- Para `is_admin=True`, todos os modulos da `MODULE_PERMISSION_SCHEMA` nascem `habilitado`.
- Para `tipo_usuario == "Clínica"`, `usuarios`, `prestadores`, `financeiro`, `relatorios` e `configuracao` nascem `protegido`, e outros ficam `habilitado`.
- Para tipos administrativos/auxiliares, varios modulos nascem `desabilitado` ou `protegido`.

### Conclusao
- O codigo nao implementa uma regra universal de "modulos comuns sempre liberados".
- O que existe e um contrato de permissao por tipo de usuario + is_admin.

## 20. Se modulos comuns nascem permitidos
- Parcialmente.
- Alguns modulos nascem `habilitado` dependendo do tipo de usuario.
- Nao existe um baseline generico onde tudo que e "comum" nasce liberado para qualquer novo usuario.

## 21. Se Usuarios e Opcoes/Configuracao nascem protegidos/restritos
- Sim, isso foi confirmado.
- Para a conta/classe `Clínica`, `usuarios` e `configuracao` nascem `protegido` por default_permissions e pelo contrato de `require_admin_password_if_user_control_enabled`.
- `menuEnsurePermission()` tambem respeita niveis `desabilitado/protegido/habilitado`.

## 22. Estados de permissao: permitir, proibir, solicitar senha
- Confirmados no codigo:
  - `habilitado`
  - `protegido`
  - `desabilitado`

## 23. Comportamento visual de modulo proibido no menu
- O menu usa `menuActionAccessLevel()` e `menuApplyPermissions()`.
- Quando o nivel e `desabilitado`, a acao recebe classe `.menu-action.disabled`, `aria-disabled="true"` e `tabindex="-1"`.
- O CSS de `.menu-action.disabled` aplica opacidade reduzida.
- Isto corresponde ao comportamento visual de "apagado/desabilitado".

## 24. Comportamento de modulo protegido com solicitacao de senha
- `menuEnsurePermission()` chama `ensureProtectedGrant(moduleCode)` quando o nivel e `protegido`.
- O frontend abre um modal de senha protegida e, se a senha valida, recebe grant.
- Depois o `requestJson()` reexecuta a mesma chamada com `X-Protected-Grant`.
- O caso de `usuarios` aceita tambem grant de `configuracao`.

## 25. Origem do Tipo do usuario em Tabelas Auxiliares
- Confirmada.
- O modal de usuario carrega `GET /cadastros/auxiliares?tipo=Tipos de usuário`.
- O cache e `usersTiposCache`.
- `usersPreencherModal()` e `usersPopularModalCombos()` consomem esse cache.

### 25.1 Relacao Usuarios x Conta Corrente
- A relacao direta de Conta Corrente nao aparece como campo proprio do modal de usuario.
- A ligacao com conta corrente e mais indireta, por contexto operacional do prestador e por modulos financeiros/relatorios.
- Nesta auditoria nao foi encontrado um campo `conta corrente` no CRUD de usuarios que tenha papel estrutural igual ao de `prestador_row_id` ou `unidade_row_id`.

## 26. Relacao Usuarios x Tabelas Auxiliares
- Confirmada.
- `Tipo do usuario` e consumido do modulo de Tabelas Auxiliares.
- O backend expõe `GET /cadastros/auxiliares/tipos` e `GET /cadastros/auxiliares?tipo=Tipos de usuário`.
- O frontend atualiza o combo no modal de usuarios ao abrir a tela.

## 27. Relacao Usuarios x Prestadores
- Confirmada.
- O modal de usuarios possui `prestador_row_id`.
- O backend persiste esse vinculo.
- O endpoint `GET /cadastros/prestadores` alimenta o combo.
- O backend tambem sincroniza prestadores a partir de usuarios em certos tipos via `_sync_default_prestadores()`.

## 28. Relacao Usuarios x Unidades
- Confirmada.
- O modal de usuarios possui `unidade_row_id`.
- O combo vem de `GET /cadastros/unidades-atendimento/combos`.
- A unidade e uma dimensao separada da de prestador.

## 29. Relacao Usuarios x Agenda
- A agenda parece depender mais do prestador/contexto do que do usuario isolado.
- O prestador possui `agenda_config_json` em `backend/models/prestador_odonto.py`.
- O prestador `Clínica` tem `executa_procedimento=True` e estrutura de agenda/configuracao.
- Nao foi encontrado um campo simples `tem_agenda` no usuario.

## 30. Relacao Usuarios x Conta Corrente
- Nao foi encontrado um vinculo direto e isolado no CRUD de usuarios.
- O acesso a recursos financeiros/corrente e ligado ao tipo de usuario, permissao de modulo e ao contexto de prestador.
- Isto continua sendo uma relacao indireta, nao um campo principal do modal.

## 31. Aba Permissoes de acesso
### O que existe no codigo
- `GET /admin/users/permissions/schema` devolve:
  - `modules`
  - `levels`
  - `profiles`
  - `functions_by_module`
  - e possiveis dados Easy schema
- No frontend:
  - `usersCarregarPermissoesSchema()`
  - `usersAbrirPermissoes()`
  - `usersRenderPermissoes()`
  - `usersPermSetTab("acesso")`
  - `usersPermRenderPerfilPreview()`
  - `usersPermRenderProfiles()`

### Interpretacao
- Esta aba trabalha com permissoes individuais por modulo e com templates de perfil do contrato de permissao.
- Ela nao e a mesma coisa que a aba de perfis de acesso funcional/prestador.

## 32. Aba Perfis de acesso
### O que existe no codigo
- `usersPermSetTab("perfis")` chama `usersPerfLoad()`
- `usersPerfLoad()` chama `GET /admin/users/{id}/profiles`
- `usersPerfRenderProfiles()` renderiza a lista da esquerda
- `usersPerfRenderPrestadores()` renderiza os checkboxes de prestadores
- `usersPerfHandlePrestadorChange()` faz `PATCH /admin/users/{id}/profiles`

### Interpretacao correta/provavel
- Esta aba usa a tabela `access_profile` e a tabela de vinculo `usuario_perfil_acesso`.
- Ela representa perfis funcionais/contextos/prestadores, nao cargos fixos de negocio.
- A lista pode vir vazia se a clinica nao tiver `access_profile` populado.

## 33. Diferenca entre tipo/cargo, permissao por modulo e perfil/contexto
- `Tipo do usuario`: vem de Tabelas Auxiliares.
- `Permissao por modulo`: usa `desabilitado/protegido/habilitado` em `usuarios.permissoes_json`.
- `Perfil/contexto`: usa `access_profile` + `usuario_perfil_acesso` para vinculo com prestadores/contextos.
- O codigo atual separa essas camadas, mas a experiencia da UI depende de dados validos em todas elas.

## 34. Papel de access_profile
- `access_profile` e uma tabela funcional por clinica.
- `backend/services/access_profiles_service.py` le `sis_perfil_sql.csv` na raiz do projeto e preenche a tabela.
- `GET /admin/users/{id}/profiles` depende dessa tabela para listar perfis.
- Na clinica 1, o banco atual mostra `profiles: []`.

## 35. Papel de usuario_perfil_acesso
- `usuario_perfil_acesso` guarda o vinculo entre usuario, perfil e prestador.
- O endpoint de `PATCH /admin/users/{user_id}/profiles` cria esses registros.
- O banco atual consultado mostrou a tabela vazia.

## 36. Papel de sis_perfil_sql.csv
- E o seed esperado por `backend/services/access_profiles_service.py`.
- O arquivo deveria estar na raiz do projeto:
  - `D:\BRANA ARQUIVOS\BRANA CLOUD\sis_perfil_sql.csv`
- A busca recursiva no workspace nao encontrou o arquivo.
- Sem esse seed, `ensure_access_profiles()` retorna lista vazia e a aba de perfis fica sem catalogo funcional para a clinica 1.

## 37. Se novas clinicas nascem com cargos/perfis padrao
- Novas clinicas nao nascem com "cargos" de negocio prontos como Secretaria/Dentista/Financeiro.
- O que nasce e a base funcional: clinica, prestador sistemico, usuario owner/admin, permissoes base, seeds de outros dominios e tentativa de preenchimento de `access_profile`.
- Em termos de perfis de acesso funcionais, o codigo tenta seedar pela origem CSV, mas isso depende do arquivo existir.

## 38. Se novas clinicas precisam ou nao de perfis padrao para a aba funcionar
- Para a aba funcionar visualmente, o sistema precisa de `access_profile` populado ou de um seed/origem equivalente.
- A ausencia de cargos padrao nao deveria quebrar a aba em si; o que quebra a experiencia e a falta de dados para montar a lista.
- No estado atual, a clinica 1 fica sem perfis porque o seed esperado nao existe no workspace e o banco desta clinica nao tem registros em `access_profile`.

## 39. Licenca demo/mensal/anual
- Confirmado no codigo:
  - `backend/services/signup_service.py` cria a nova conta com `tipo_conta="DEMO 7 dias"`
  - `backend/routes/licenca_routes.py` reconhece `DEMO`, `MENSAL`, `ANUAL` e `SUPERADMIN`
  - `backend/models/clinica.py` possui `tipo_conta`, `licenca_usuario`, `chave_licenca`, `data_ativacao`, `trial_ate`

## 40. Vencimento da licenca
- O vencimento e controlado por `clinica.trial_ate`.
- `backend/routes/licenca_routes.py` considera licenca expirada quando `trial_ate` esta ausente ou anterior a `datetime.utcnow()`.
- `TrialMiddleware` usa a mesma logica para bloquear rotas autenticadas.

## 41. Bloqueio de todos os usuarios quando a conta vence
- O middleware bloqueia a clinica inteira para rotas autenticadas quando a licenca expira.
- Excecoes:
  - rotas publicas
  - rotas de `/licenca`
  - owner/superadmin em alguns fluxos
- Portanto, a regra geral de bloqueio por conta vencida existe e e global por clinica.

## 42. Evidencias encontradas no EasyDental sobre usuarios
### Achados diretos
- `D:\UTIL\EasyDental_7.6_BR\Readme.doc` menciona controle de usuarios e permissões e um novo conceito de `perfil`.
- Os docs historicos do repo tambem citam a migracao EasyDental e a heranca de regras de usuarios/permissoes.

### Leitura conservadora
- A referencia EasyDental confirma que perfis e permissoes de usuarios sao um conceito herdado.
- Nao foi encontrada nesta auditoria prova direta de uma senha administrativa separada persistida em outro campo no legado consultado.

## 43. Evidencias encontradas no EasyDental sobre permissoes
- `Readme.doc` menciona configuracoes de permissoes de acesso de usuarios e o conceito de `perfil` para areas de acesso.
- Os docs historicos do Brana Cloud associam EasyDental com mapeamento de permissoes e funcao de perfis.
- O material legado consultado confirma a heranca conceitual de permissao/perfil, nao necessariamente a mesma modelagem tecnica atual.

## 44. Evidencias encontradas no EasyDental sobre senha administrativa
- Nesta auditoria, o legado consultado nao confirmou uma senha administrativa separada em armazenamento proprio.
- No Brana Cloud atual, o desbloqueio protegido usa `verify_admin_password()` contra a `senha_hash` do admin da clinica.
- Conclusao conservadora: a heranca conceitual de "senha de liberacao" existe, mas a separacao fisica da senha nao foi confirmada.

## 45. Evidencias encontradas no EasyDental sobre prestador/agenda/conta corrente
- Os docs historicos apontam heranca de prestador sistêmico, agenda por contexto e relacao com modulos financeiros.
- No Brana Cloud atual, o prestador `Clínica` tem `agenda_config_json` e e nao apagavel.
- A relacao exata do legado com agenda/conta corrente foi tratada aqui como heranca funcional, nao como copia literal de estrutura.

## 46. Evidencias encontradas no EasyDental sobre licenca/vencimento
- `Readme.doc` menciona licencas adicionais e senha de liberacao para instalacao.
- Os docs historicos do Brana Cloud tratam EasyDental como referencia de licenca/trial e de migracao de regras de conta.
- No Brana Cloud atual, a licenca da conta e controlada por `tipo_conta` + `trial_ate` + `TrialMiddleware`.

## 47. Pontos do pre-contrato confirmados pelo Brana Cloud
- Existe fluxo de cadastro de nova conta.
- Existe criacao de clinica no signup.
- Existe criacao do prestador sistemico `Clínica`.
- O prestador `Clínica` aparece na listagem de prestadores.
- O prestador `Clínica` e sistemico e nao pode ser apagado.
- Existe tela de primeiro acesso.
- Existe `setup_completed`.
- Existem modulos protegidos por senha/grant.
- Existe combo `Tipo do usuario` vindo de Tabelas Auxiliares.
- Existem vinculos de usuario com prestador e unidade.
- Existe relacao de perfis de acesso com `access_profile` e `usuario_perfil_acesso`.
- Existe licenca por clinica com `trial_ate`.
- O bloqueio por licenca vencida vale para a clinica inteira.

## 48. Pontos do pre-contrato contrariados pelo Brana Cloud
- A senha administrativa interna nao aparece como senha separada em outro campo; ela reaproveita `senha_hash` do admin.
- O baseline de permissoes nao e simplesmente "modulos comuns sempre liberados"; ele e definido por tipo de usuario e pode marcar modulos como protegido/desabilitado.
- A aba `Perfis de acesso` nao funciona apenas com "prestadores" no vazio; ela depende do catalogo `access_profile`, que no banco atual da clinica 1 esta vazio.
- `access_profile` atual nao nasce preenchido para a clinica 1 neste workspace, porque o seed `sis_perfil_sql.csv` nao existe no root.

## 49. Pontos do pre-contrato inconclusivos no Brana Cloud
- Se a senha administrativa deveria ser fisicamente separada da senha de login.
- Se novas clinicas devem nascer com `access_profile` padrao ou vazias por decisao de produto.
- Se a aba `Perfis de acesso` deve representar cargos de negocio ou somente contextos/prestadores.
- Qual regra de produto definitiva para novas contas: perfis padrão, seed obrigatorio ou estrutura vazia.

## 50. Pontos do pre-contrato confirmados pelo EasyDental
- Heranca de permissao/perfil e conceito de acesso por areas.
- Heranca de licenciamento e bloqueio operacional por conta/instalacao.
- Heranca historica de regras administrativas vinculadas a uma conta/clinica.

## 51. Pontos do pre-contrato contrariados pelo EasyDental
- Nesta auditoria nao houve prova direta, no material consultado, de uma separacao fisica clara entre senha de login e senha administrativa interna persistida em outro campo.
- Tambem nao houve prova direta de que o legado exigia cargos de negocio padrao prontos para novas contas.

## 52. Pontos inconclusivos no EasyDental
- Estrutura exata de storage da senha administrativa interna.
- Regra exata de preenchimento inicial de perfis funcionais.
- Regra exata sobre novos cargos prontos versus configuracao manual.

## 53. Diferencas entre Brana Cloud atual e EasyDental
- O Brana Cloud atual documenta e expõe explicitamente `setup_completed`, `protected_password_required`, `X-Protected-Grant`, `access_profile` e `usuario_perfil_acesso`.
- O EasyDental consultado aqui confirma a heranca conceitual, mas nao foi usado para importar/alterar nada.
- O Brana Cloud atual separa claramente o combo de `Tipo do usuario`, as permissoes por modulo e os perfis funcionais, embora a experiencia final ainda dependa de seeds e dados da clinica.

## 54. Lacunas criticas antes do contrato definitivo
- Decisao de produto sobre senha administrativa: separada ou reaproveitando a senha_hash do admin.
- Decisao de produto sobre `access_profile`: seed obrigatorio ou estrutura vazia por design.
- Decisao de produto sobre novas clinicas: perfis padrao ou configuracao manual total.
- Decisao de produto sobre a interpretacao da aba `Perfis de acesso` como contexto/prestador e nao como cargo de negocio.

## 55. Decisoes de produto pendentes
- Confirmar se a senha administrativa interna deve ser um segredo separado.
- Confirmar se `sis_perfil_sql.csv` volta a ser fonte oficial.
- Confirmar se novas clinicas devem nascer com perfis funcionais preenchidos ou vazios.
- Confirmar se a aba `Perfis de acesso` deve se comportar como matriz de contextos/prestadores.
- Confirmar a politica de permissao padrao para tipos de usuario nao-admin.

## 56. Recomendacoes para o contrato funcional definitivo
- Registrar explicitamente a separacao entre:
  - tipo do usuario
  - permissao por modulo
  - perfil funcional/contexto
  - vinculo usuario/prestador
- Registrar a regra de licenca como bloqueio por clinica.
- Registrar a regra do prestador `Clínica` como sistemico e nao apagavel.
- Registrar a fonte do combo `Tipo do usuario` como Tabelas Auxiliares.
- Registrar a dependencia de `access_profile` e do seed correspondente para a aba `Perfis de acesso`.

## 57. Confirmacao de que nenhum codigo foi alterado
- Confirmado.

## 58. Confirmacao de que banco nao foi alterado
- Confirmado.

## 59. Confirmacao de que nenhum seed foi criado/importado/executado
- Confirmado.

## 60. Confirmacao de que frontend nao foi alterado
- Confirmado nesta auditoria.

## 61. Confirmacao de que backend nao foi alterado
- Confirmado nesta auditoria.

## 62. Confirmacao de que EasyDental/legado nao foi alterado
- Confirmado.

## 63. Confirmacao de que nenhum arquivo foi criado nas pastas EasyDental/legado
- Confirmado.

## 64. Confirmacao de blindagem textual/mojibake
- Confirmada.
- Nao houve correcao de textos, acentos, labels, mensagens, placeholders, strings visiveis ou mojibake.

## 65. Resultado dos checks
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok

## 66. Estado final do git
- Branch: `modularizacao-segura-fase-1`
- `git status --short`: mantem os `??` antigos do workspace e este documento de auditoria complementar como untracked.
- `git diff --stat`: sem mudancas rastreadas em codigo nesta auditoria.

## 67. Proximo passo recomendado
- Antes de qualquer correcao automatica, fechar o contrato funcional definitivo com decisao de produto sobre:
  - senha administrativa separada ou nao;
  - politica de perfis para novas clinicas;
  - fonte oficial de `access_profile`;
  - interpretacao da aba `Perfis de acesso`;
  - contrato de licenca por clinica.

