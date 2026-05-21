# Auditoria do fluxo de nascimento de nova conta, primeiro acesso, senha administrativa, prestador Clinica e perfis de acesso

## 1. Objetivo da auditoria
Auditar, somente por leitura, se o Brana Cloud ainda possui hoje o fluxo herdado para nascimento de nova conta/clinica, primeiro acesso, senha administrativa interna, protecao de modulos, criacao automatica do prestador sistemico Clinica e populacao de perfis de acesso.

## 2. Branch conferida
- Branch atual: `modularizacao-segura-fase-1`

## 3. Estado inicial do git
- O workspace ja estava com varios `untracked` antigos de trabalhos anteriores.
- Nao havia alteracao rastreada desta auditoria antes da escrita deste relatorio.
- Esta auditoria nao alterou codigo, banco, seed, migration ou backend.

## 4. Comandos de leitura executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git grep -n "setup_completed|abrirTelaSetup|setupComplete|panel-setup|protectedPassDialog|ensureProtectedGrant|unlockProtectedGrant|usersStartRefresh|usersPerfLoad|usersPerfRenderProfiles|usersPerfRenderPrestadores|requestJsonBase|requestJson|protected_password_required" frontend/app.js backend/routes/auth_routes.py backend/security/dependencies.py backend/routes/user_admin_routes.py backend/services/signup_service.py backend/services/access_profiles_service.py backend/security/permissions.py`
- `git grep -n "sis_perfil_sql.csv|access_profile|usuario_perfil_acesso|perfis de acesso|Perfis de acesso|signup|signup/request-code|signup/confirm|auth/setup/complete|auth/protected/unlock|first_access|primeiro_acesso|configuracao_inicial|setup_completed" docs backend frontend`
- `Get-Content backend/database.py`
- `Get-Content backend/services/signup_service.py`
- `Get-Content backend/services/access_profiles_service.py`
- `Get-Content backend/routes/user_admin_routes.py`
- `Get-Content backend/routes/auth_routes.py`
- `Get-Content backend/security/dependencies.py`
- `Get-Content backend/models/prestador_odonto.py`
- `Get-Content backend/security/system_accounts.py`
- `Get-Content backend/security/permissions.py`
- `Get-Content backend/models/usuario.py`
- `Get-Content backend/routes/prestadores_routes.py`
- `Get-Content backend/scripts/migrar_perfis_acesso_easy.py`
- `git log --oneline --all -- backend/services/signup_service.py`
- `git log --oneline --all -- backend/routes/auth_routes.py`
- `git log --oneline --all -- backend/routes/user_admin_routes.py`
- `git log --oneline --all -- backend/services/access_profiles_service.py`
- `git log --oneline --all -- backend/security/dependencies.py`
- `git log --oneline --all -- frontend/app.js`
- `Test-Path D:\BRANA ARQUIVOS\BRANA CLOUD\sis_perfil_sql.csv`
- `Get-ChildItem -Path D:\BRANA ARQUIVOS\BRANA CLOUD -Recurse -File -Include sis_perfil*.csv,perfil*.csv,access_profile*.csv,profiles*.csv`
- Consultas `SELECT` somente leitura no PostgreSQL usando o Python do `.venv` do projeto
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`

## 5. Arquivos de codigo analisados
- `frontend/app.js`
- `frontend/index.html`
- `backend/routes/auth_routes.py`
- `backend/security/dependencies.py`
- `backend/security/admin_password.py`
- `backend/security/permissions.py`
- `backend/security/system_accounts.py`
- `backend/services/signup_service.py`
- `backend/services/access_profiles_service.py`
- `backend/routes/user_admin_routes.py`
- `backend/routes/prestadores_routes.py`
- `backend/models/usuario.py`
- `backend/models/prestador_odonto.py`
- `backend/models/access_profile.py`
- `backend/models/usuario_perfil_acesso.py`
- `backend/database.py`
- `backend/scripts/migrar_perfis_acesso_easy.py`

## 6. Documentos analisados
- `docs/04_funcionalidades.md`
- `docs/05_banco_dados.md`
- `docs/06_seguranca.md`
- `docs/07_fluxos.md`
- `docs/auditoria_contratos_auth_requestjson_me_security.md`
- `docs/auditoria_fina_auth_me_grant_sessao.md`
- `docs/auditoria_fina_permissions_por_modulo.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/seeds_procedimentos_genericos_subetapa_3a_planejamento_sanitizacao_nome_codigo.md`
- `docs/seeds_procedimentos_genericos_subetapa_3a_sanitizacao_nome_codigo.md`
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_plano_correcao_controlada_grant_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`

## 7. Historico Git analisado
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
- `backend/security/dependencies.py`
  - `717f59c On main: Pendencias backend restantes antes da modularizacao`
  - `c132c45 Versao inicial do Brana Cloud`
- `frontend/app.js`
  - `d9b3673 Corrige refresh protegido em usuarios admin`
  - `22e7652 Extrai visual do modal admin de usuarios`
  - outros commits de modularizacao parcial do frontend

## 8. Fluxo atual de cadastro de nova conta
O fluxo atual de cadastro existe e comeca em `POST /signup/request-code` e `POST /signup/confirm` em `backend/routes/auth_routes.py`.

Fluxo observado:
- o usuario informa nome, e-mail e senha na tela de cadastro;
- o backend gera e envia um codigo de verificacao por e-mail;
- o confirmatorio chama `criar_conta_saas(db, nome, email, senha)` em `backend/services/signup_service.py`;
- ao confirmar, o backend devolve `access_token` e o frontend chama `carregarSessao()`;
- o cadastro cria a clinica, o usuario owner/admin e seeds iniciais;
- o fluxo de setup pode aparecer depois se `setup_completed` vier falso.

## 9. Fluxo atual de criacao de clinica
O nascimento da clinica acontece dentro de `criar_conta_saas(db, nome, email, senha)` em `backend/services/signup_service.py`.

O que a funcao faz hoje:
- cria `Clinica` nova;
- define `tipo_conta="DEMO 7 dias"` e `trial_ate`;
- garante diretorios/modelos da clinica;
- chama seeds iniciais de etiquetas e outros dominios;
- cria o prestador sistemico `Clinica`;
- cria o usuario sistemico `Clinica`;
- chama `ensure_access_profiles(db, clinica.id)`;
- cria o usuario owner/admin da conta com `codigo=1`, `is_admin=True` e `setup_completed=False`;
- continua com outros seeds de bootstrap da nova conta.

## 10. Fluxo atual de criacao do primeiro usuario ADM
O primeiro usuario da nova clinica nasce dentro de `criar_conta_saas(...)` como:
- `codigo=1`
- `tipo_usuario="Clínica"`
- `is_admin=True`
- `setup_completed=False`
- `is_system_user=False`
- `permissoes_json` baseado em `sanitize_permissions({}, tipo_usuario="Clínica", is_admin=True)`

O snapshot do banco mostrou que os usuarios atuais das clinicas existentes estao com `setup_completed=true`, mas o contrato de criacao inicial continua presente no codigo.

## 11. Se existe ou nao tela de primeiro acesso
Existe.

No frontend:
- `frontend/app.js` possui `panelSetup`;
- `carregarSessao()` verifica `data.setup_completed === false`;
- quando isso acontece, o codigo chama `abrirTelaSetup(...)`.

## 12. Onde essa tela esta no frontend
- `frontend/index.html` contem o painel `panel-setup`
- `frontend/app.js` contem a logica de exibicao com `abrirTelaSetup(user)` e `setupComplete()`

## 13. Qual condicao faz essa tela aparecer
- a condicao observada e `setup_completed === false` no payload da sessao/`/me`
- se a condicao vier falsa, o frontend interrompe o fluxo normal e abre o painel de setup

## 14. Se essa tela aparece so uma vez
Em termos de contrato de codigo, ela deve aparecer so enquanto `setup_completed` estiver falso.

Depois de `POST /auth/setup/complete`:
- o backend grava `usuario.setup_completed = True`
- o frontend chama `carregarSessao()` novamente

Portanto, a tela e teoricamente unica por conta, a menos que o dado seja revertido manualmente no banco ou por bug externo.

## 15. Onde e criada a senha interna administrativa
Nao foi encontrado um campo separado de "senha interna" no banco ou no modelo do usuario.

O que existe hoje:
- `POST /auth/setup/complete` grava em `usuario.senha_hash`
- `verify_admin_password(db, clinica_id, senha)` valida a senha do admin usando `senha_hash` do usuario admin resolvido por clinica

Conclusao objetiva:
- a senha interna administrativa existe como contrato funcional;
- mas ela nao aparece como armazenamento separado da senha de login;
- o codigo usa a mesma coluna `senha_hash` para login e para desbloqueio administrativo/protegido.

## 16. Onde a senha interna e salva
- `backend/routes/auth_routes.py`, em `setup_complete()`, grava `usuario.senha_hash = hash_password(senha)`
- `backend/security/admin_password.py` valida essa mesma `senha_hash` do admin da clinica

## 17. Se ela e diferente da senha de login
No estado atual do codigo, nao ha evidencia de uma senha interna separada em outra coluna.

O que o codigo faz:
- o login usa `verify_password(form_data.password, usuario.senha_hash)`
- o setup inicial tambem grava em `usuario.senha_hash`
- o protected grant usa `verify_admin_password(...)`, que tambem confere `senha_hash`

Conclusao objetiva:
- existe um fluxo de primeiro acesso;
- nao existe, no codigo auditado, uma separacao persistida entre "senha de login" e "senha interna" como dois segredos distintos;
- o segredo efetivo e o mesmo `senha_hash` do usuario admin.

## 18. Como ela se relaciona com protected_password_required
O mesmo segredo do admin e reutilizado para liberar modulos protegidos.

O fluxo observado:
- `require_module_access("usuarios")`
- `require_admin_password_if_user_control_enabled("usuarios")`
- se o modulo estiver protegido e o header `X-Protected-Password` ou `X-Protected-Grant` nao for valido, o backend responde `403` com `detail.error = "protected_password_required"`
- o frontend trata isso com `requestJson() -> ensureProtectedGrant() -> unlockProtectedGrant() -> retry com X-Protected-Grant`

## 19. Se Usuarios e Opcoes do sistema nascem protegidos
Sim, o contrato de permissao atual mostra isso.

Evidencias:
- `default_permissions("Clínica", is_admin=True)` da admin acesso total
- para tipo `Clínica`, `default_permissions(...)` marca `usuarios`, `prestadores` e `configuracao` como `protegido`
- `backend/routes/user_admin_routes.py` tem dependencias:
  - `require_module_access("usuarios")`
  - `require_admin_password_if_user_control_enabled("usuarios")`
- `backend/routes/system_options_routes.py` usa a mesma protecao para `configuracao`

## 20. Onde essa protecao e definida
- `backend/security/permissions.py`
- `backend/security/dependencies.py`
- `backend/routes/user_admin_routes.py`
- `backend/routes/system_options_routes.py`
- `frontend/app.js` consome esse contrato via `requestJson()`

## 21. Se nova clinica cria prestador "Clinica"
Sim.

Em `backend/services/signup_service.py`:
- `_garantir_prestador_sistemico_clinica(db, clinica.id)` cria ou normaliza o prestador sistemico
- esse prestador usa `SYSTEM_PRESTADOR_SOURCE_ID = 255`
- usa `SYSTEM_PRESTADOR_CODIGO = "001"`
- usa `SYSTEM_USER_NOME = "Clínica"`
- fica com `is_system_prestador=True`

O banco confirmou prestador sistemico em todas as clinicas existentes:
- clinica 1
- clinica 4
- clinica 8

## 22. Se esse prestador tem agenda
Existe suporte de agenda para o prestador, mas nao foi encontrado um booleano explicito `tem_agenda`.

Evidencias:
- `PrestadorOdonto` possui `agenda_config_json`
- as rotas de prestador leem e gravam `agenda_config_json`
- a rota de agenda le config do prestador a partir desse campo

Conclusao objetiva:
- o prestador sistemico tem estrutura de agenda/configuracao de agenda;
- nao foi encontrado um campo separado e explicito que diga "tem_agenda = true";
- por contrato funcional, ele e tratado como prestador sistemico apto a participar da agenda.

## 23. Se esse prestador e nao apagavel/sistemico
Sim.

Evidencias:
- `is_system_prestador(item)` identifica o prestador sistemico
- `_buscar_prestador_ou_none(...)` devolve `None` se o item for sistemico
- `DELETE /cadastros/prestadores/{row_id}` em `backend/routes/prestadores_routes.py` retorna `400` com mensagem de que a conta Clinica nao pode ser eliminada

## 24. Como novos dentistas/secretarias/prestadores sao criados depois
O fluxo posterior existe, mas e misturado entre usuarios e prestadores.

Evidencias:
- `backend/routes/user_admin_routes.py` cria e edita usuarios com vinculo de prestador e unidade
- `backend/routes/prestadores_routes.py` tem `_sync_default_prestadores(db, clinica_id)` que converte usuarios em prestadores quando o tipo de usuario pede isso
- tipos observados como prestador:
  - `Cirurgião dentista`
  - `Protético`
  - `Perito`
  - `THD`

Conclusao objetiva:
- o codigo permite que novos usuarios criados depois sejam vinculados a prestador e agenda;
- para dentistas, a rota de prestadores consegue criar/sincronizar o prestador correspondente;
- nao foi encontrado um fluxo separado e simples apenas para secretarias com regra especial unica.

## 25. Se perfis de acesso sao criados no nascimento
Sim, o fluxo tenta criar.

Evidencias:
- `backend/services/signup_service.py` chama `ensure_access_profiles(db, clinica.id)` durante `criar_conta_saas(...)`
- `backend/routes/user_admin_routes.py` chama `_ensure_access_profiles(db, current_user.clinica_id)` quando carrega/edita a aba de perfis

## 25.1 Relação Usuários x Conta Corrente
Nao encontrei, nos arquivos auditados de Usuários/Admin, uma tabela ou campo que vincule diretamente o usuario a conta corrente.

O que existe no codigo auditado e:
- permissao de modulo `financeiro` em `backend/security/permissions.py`;
- uso de `financeiro` como modulo protegido em varias regras;
- possiveis relacoes indiretas por prestador, agenda e dominio financeiro fora do modulo de usuarios.

Conclusao provisoria:
- o acesso a conta corrente parece ser indireto e dependente de permissao de modulo/contexto de prestador;
- nao foi identificado um vinculo direto usuario-conta corrente no contrato atual do modulo Usuários.

## 26. Se usuario_perfil_acesso e populado no nascimento
Nao foi encontrado preenchimento automatico nesse nascimento.

O que existe:
- `ensure_access_profiles(...)` cria ou normaliza `access_profile`
- `usuario_perfil_acesso` e lido e gravado pela rota de perfis, mas nao apareceu populacao automatica no bootstrap observado

O banco confirmou:
- `usuario_perfil_acesso` tem `0` linhas

## 27. Papel do seed sis_perfil_sql.csv
O seed e a origem esperada dos perfis de acesso do Easy.

Evidencias:
- `backend/services/access_profiles_service.py` define `EASY_PERFIS_CSV = ROOT_DIR / "sis_perfil_sql.csv"`
- `_read_easy_profiles(path)` devolve lista vazia se o arquivo nao existir
- `ensure_access_profiles(db, clinica_id)` usa esse seed para criar `AccessProfile`
- `backend/scripts/migrar_perfis_acesso_easy.py` tambem usa `PROJECT_DIR / "sis_perfil_sql.csv"` como padrao

Conclusao objetiva:
- o arquivo e esperado na raiz do projeto `D:\BRANA ARQUIVOS\BRANA CLOUD\sis_perfil_sql.csv`
- ele nao existe no workspace atual

## 28. O que acontece hoje quando esse seed esta ausente
- `ensure_access_profiles(...)` nao cria perfis novos a partir do seed
- a lista retornada fica limitada aos `AccessProfile` ja existentes na clinica
- no banco atual, a clinica 1 nao tem `access_profile`

Resultado pratico:
- `GET /admin/users/{id}/profiles` retorna `profiles: []` para a clinica 1

## 29. Diferenca entre permissoes individuais e perfis de acesso
Sao coisas diferentes.

Permissoes individuais:
- ficam em `usuarios.permissoes_json`
- sao tratadas por `backend/security/permissions.py`
- aparecem em `GET /admin/users/{user_id}/permissions`

Perfis de acesso:
- ficam em `access_profile`
- usam `usuario_perfil_acesso` para amarrar usuario + prestador + perfil
- aparecem em `GET /admin/users/{user_id}/profiles`
 
Percepcoes importantes:
- a aba `Permissões de acesso` usa perfis-tipo estaticos de permissao vindos de `get_access_profile_templates()`;
- a aba `Perfis de acesso` usa perfis funcionais da clinica vindos de `access_profile` e vinculacao a prestadores;
- portanto, os dois "perfis" sao conceitos diferentes e nao devem ser confundidos no contrato final.

## 30. O que foi encontrado sobre heranca do EasyDental
Foi encontrado que o sistema preserva varias ideias herdadas:
- `setup_completed`
- `protected_password_required`
- perfis de acesso em formato semelhante ao Easy
- seeds oficiais carregados no signup
- usuario e prestador sistemicos da Clinica

Tambem foi encontrado que:
- a base de perfis do Easy depende de `sis_perfil_sql.csv`
- o contrato de migracao/seed ainda existe em scripts e servicos

## 31. O que ja esta documentado
Documentos ja existentes tratam de:
- login, signup, setup e `/me`
- `protected_password_required`
- `requestJson` e grant protegido
- permissoes por modulo
- seeds de novas contas para outros dominios
- inventario de banco e frontend

## 31.1 Interpretacao correta/provavel da aba Perfis de acesso
Interpretacao mais consistente do conjunto:
- a aba `Permissões de acesso` trabalha com perfis-tipo/templated permissions;
- a aba `Perfis de acesso` trabalha com perfil funcional da clinica e vinculacao a prestadores;
- a tela nao cria cargos padrao automaticamente;
- a tela pode ficar vazia se a clinica nao tiver `access_profile` carregado;
- os prestadores existentes continuam sendo a base operacional da tela.

## 32. O que nao foi encontrado
- nao foi encontrado um campo separado para "senha interna administrativa" diferente do login
- nao foi encontrado um flag distinto de primeiro acesso alem de `setup_completed`
- nao foi encontrado `primeiro_acesso`, `first_access` ou `initial_setup` como flag persistida
- nao foi encontrado `sis_perfil_sql.csv` no workspace atual
- nao foi encontrado preenchimento automatico de `usuario_perfil_acesso` no signup
- nao foi encontrado um booleano explicito `tem_agenda` no modelo do prestador

## 33. O que ficou inconclusivo
- se o produto pretendia uma senha interna completamente separada da senha de login
- se a clinica 1 deveria nascer com perfis de acesso prontos ou vazios por regra de negocio
- se os 10 `access_profile` da clinica 8 vieram de importacao manual ou de rotina anterior

## 34. Estado atual provavel do fluxo hoje
O fluxo atual provavel e:
- cadastro por codigo de e-mail existe
- clinica e usuario owner/admin nascem juntos
- primeiro acesso existe via `setup_completed=false`
- modulos `usuarios` e `configuracao` nascem protegidos para o tipo Clinica
- o prestador sistemico Clinica nasce automaticamente
- perfis de acesso sao previstos no bootstrap, mas a base atual da clinica 1 nao esta populada

## 35. Riscos do estado atual
- o usuario pode esperar uma senha interna separada, mas o codigo usa a mesma `senha_hash`
- a ausencia do `sis_perfil_sql.csv` pode deixar novas clinicas sem perfis de acesso
- a UI de perfis pode parecer quebrada quando na verdade a base esta vazia
- sem contrato de produto, a clinica 1 pode ficar em estado diferente da clinica 8

## 36. Perguntas que precisam virar decisao de produto
- a senha administrativa deve ser a mesma senha de login ou deve existir um segundo segredo separado
- novas clinicas devem nascer com perfis de acesso padrao ou vazios
- o seed `sis_perfil_sql.csv` deve ser versionado no repo ou fornecido externamente
- a clinica 1 deve ser repovoada agora ou apenas servir de exemplo vazio
- o prestador sistemico Clinica deve ter regra de agenda documentada como obrigatoria ou apenas configuravel

## 37. Recomendacao para criar contrato funcional futuro
Formalizar em documento unico:
- como nasce uma conta/clinica
- qual segredo e usado no login e no desbloqueio protegido
- quais modulos nascem protegidos
- como o prestador Clinica nasce e nao pode ser removido
- como perfis de acesso sao populados
- qual seed e fonte oficial do Easy
- o que deve acontecer em clinicas novas e em clinicas ja existentes

## 38. Confirmacao de que nenhum codigo foi alterado
Confirmado.

## 39. Confirmacao de que banco nao foi alterado
Confirmado.

## 40. Confirmacao de que nenhum seed foi criado/importado/executado
Confirmado.

## 41. Confirmacao de que frontend nao foi alterado
Confirmado.

## 42. Confirmacao de que backend nao foi alterado
Confirmado.

## 43. Confirmacao de que pastas proibidas nao foram tocadas
Confirmado.

## 44. Confirmacao de que blindagem textual/mojibake foi respeitada
Confirmado.

## 45. Resultado dos checks
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok

## 46. Estado final do git
- `git status --short` mostra os `untracked` antigos ja existentes no workspace e este novo relatorio.
- `git diff --stat` nao mostra mudanca em arquivo rastreado por esta auditoria.

## Banco de dados: resumo da leitura somente
- Banco identificado: PostgreSQL
- Conexao usada pelo projeto: `DATABASE_URL=postgresql://postgres:1234@localhost:5432/brana_saas`
- `clinicas`: 3
- `usuarios`: 11
- `access_profile`: 10
- `usuario_perfil_acesso`: 0
- `prestador_odonto`: 7
- `setup_completed = false`: 0 usuarios no estado atual
- Clinicas existentes:
  - 1: `Instuto Brana - Odontologia`
  - 4: `Alisson Cristóvão Butarelo`
  - 8: `Instituto Brana`
- Sistema prestador `Clinica` existe nas 3 clinicas
- `access_profile` existe apenas para a clinica 8
- `usuario_perfil_acesso` esta vazio
- `GET /admin/users/{id}/profiles` para a clinica 1 devolve `profiles: []`

## Conclusao objetiva
- O fluxo de primeiro acesso existe? Sim.
- A tela inicial de primeiro acesso existe? Sim.
- A senha interna administrativa existe? Sim, mas nao como armazenamento separado da senha de login.
- Usuarios e Opcoes do sistema nascem protegidos? Sim.
- O prestador `Clinica` nasce automaticamente? Sim.
- Ele tem agenda? Ha suporte de agenda/configuracao de agenda; flag explicita separada nao foi encontrada.
- Ele e nao apagavel? Sim.
- Novos dentistas/secretarias seguem esse fluxo? Sim, ha suporte para criacao/vinculo de usuarios e prestadores depois.
- Perfis de acesso nascem no signup? O codigo tenta criar via `ensure_access_profiles`, mas a base atual da clinica 1 nao esta populada.
- O que depende de `sis_perfil_sql.csv`? A criacao/normalizacao de `access_profile`.
- O que veio/documenta heranca do EasyDental? `setup_completed`, protected grant, perfis de acesso, bootstrap de conta e scripts de migracao.
- O que ficou inconclusivo? A decisao de produto sobre senha separada e perfis iniciais por nova clinica.

## Decisao de produto pendente
Antes de qualquer correcao estrutural futura, o usuario precisa decidir:
- se a senha administrativa sera separada da senha de login ou nao
- se novas clinicas devem nascer com perfis de acesso predefinidos ou vazios
- se o seed de perfis deve ser reintroduzido na raiz do projeto ou tratado como dado externo controlado
- se a clinica 1 deve ser repovoada agora ou apenas documentada como vazia

## Proxima etapa recomendada
Sem correcao automatica neste momento, o proximo passo recomendado e transformar este achado em contrato funcional fechado antes de mexer em seed, banco ou bootstrap de clinicas novas.
