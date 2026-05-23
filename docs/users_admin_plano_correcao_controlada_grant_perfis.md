# Plano de correcao controlada para protected grant e perfis de acesso da clinica 1

## 1. Objetivo da etapa
Consolidar um plano de correcao futura, sem alterar codigo, para duas frentes distintas:
- Frente A: fluxo `protected_password_required` / refresh de usuarios;
- Frente B: `Perfis de acesso` da clinica 1 e seed ausente.

O plano deve servir para a proxima etapa de implementacao controlada, mantendo separacao clara entre correcao pontual e correcao estrutural.

## 2. Data / etapa
- Data: `2026-05-20`
- Etapa: plano documental de correcao controlada, somente leitura

## 3. Branch conferida
- `modularizacao-segura-fase-1`

## 4. Commit de referencia
- `22e7652` - `Extrai visual do modal admin de usuarios`

## 5. Estado inicial do git
- Branch correta confirmada.
- `git status --short` continua mostrando apenas untracked antigos do workspace e os relatorios desta trilha.
- Nenhum codigo foi alterado nesta etapa.

## 6. Comandos de leitura executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -30`
- `git show --stat 22e7652`
- `git show --name-only 22e7652`
- `git grep -n "usersStartRefresh"`
- `git grep -n "setInterval"`
- `git grep -n "carregarUsuarios"`
- `git grep -n "protected_password_required"`
- `git grep -n "ensureProtectedGrant"`
- `git grep -n "unlockProtectedGrant"`
- `git grep -n "X-Protected-Grant"`
- `git grep -n "requestJson"`
- `git grep -n "requestJsonBase"`
- `git grep -n "sis_perfil_sql.csv"`
- `git grep -n "access_profiles_service"`
- `git grep -n "access_profile"`
- `git grep -n "usuario_perfil_acesso"`
- `git grep -n "profiles"`
- `git grep -n "usersPerf"`
- `git grep -n "Perfis de acesso"`
- `Get-Content frontend/app.js`
- `Get-Content frontend/index.html`
- `Get-Content backend/routes/user_admin_routes.py`
- `Get-Content backend/security/dependencies.py`
- `Get-Content backend/services/access_profiles_service.py`
- `Get-Content backend/models/access_profile.py`
- `Get-Content backend/models/usuario_perfil_acesso.py`
- `Get-Content backend/models/usuario.py`
- `Get-Content backend/scripts/migrar_perfis_acesso_easy.py`
- `Get-Content docs/auditoria_fina_requestjson.md`
- `Get-Content docs/auditoria_fina_permissions_por_modulo.md`
- `Get-Content docs/auditoria_fina_user_admin_cadastro_edicao.md`
- `Get-Content docs/auditoria_fina_user_admin_permissoes.md`
- `Get-Content docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- `Get-Content docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `Get-Content docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `Test-Path sis_perfil_sql.csv`
- `Get-ChildItem` recursivo para arquivos de seed parecidos
- consultas `SELECT` read-only no PostgreSQL via `backend/.env`

## 7. Evidencias ja confirmadas pelo usuario
- `GET /admin/users` retornou `403` com `protected_password_required`.
- `GET /admin/users` retornou `200` com uso do header `X-Protected-Grant`.
- `GET /admin/users/12/profiles` retornou `200`.
- A resposta de `GET /admin/users/12/profiles` trouxe:
  - `profiles: []`
  - `assignments: {}`
  - `prestadores` preenchido

## 8. Confirmacao de que nao ha indicio de regressao da extracao visual
Nao ha indicio concreto de regressao causada pelo commit `22e7652`.

Motivos:
- o commit nao alterou chamadas para `/admin/users`;
- o commit nao alterou chamadas para `/admin/users/{id}/permissions`;
- o novo modulo visual nao faz request de rede;
- a ponte em `frontend/app.js` continua sendo apenas de delegacao visual.

## 9. Frente A - protected grant / refresh

### 9.1 Causa provavel
O refresh do painel de usuarios continua ativo enquanto a tela esta aberta:
- `usersStartRefresh()` usa `setInterval(..., 3000)`;
- `carregarUsuarios(true)` e chamado periodicamente;
- se o grant nao estiver valido, o refresh reencontra o `403 protected_password_required` e o fluxo repete.

### 9.2 Arquivos envolvidos numa correcao futura
Possiveis arquivos:
- `frontend/app.js`

Possivelmente apenas este arquivo, se a correcao for pontual e conservadora.

### 9.3 Funcoes envolvidas numa correcao futura
Funcoes diretamente ligadas:
- `requestJsonBase()`
- `requestJson()`
- `ensureProtectedGrant()`
- `unlockProtectedGrant()`
- `carregarUsuarios()`
- `usersStartRefresh()`
- `usersStopRefresh()`
- `showUsersPanel()`
- `abrirPainelAdministradorToolbar()`
- `abrirPainelUsuariosConfig()`
- `usersAbrirPermissoes()`

### 9.4 Funcoes que nao devem ser tocadas
Nao devem ser tocadas nesta frente:
- `usersOptions()`
- `usersPopularModalCombos()`
- `usersPreencherModal()`
- `usersSalvarEstrutural()`
- `usersSalvarNovo()`
- `usersSalvarSenha()`
- `usersSalvarPermissoes()`
- `usersExcluirSelecionado()`
- `usersEditarSelecionado()`
- `permissions.py`
- `user_admin_routes.py`
- rotas de backend
- schema de permissao

### 9.5 Opcoes de correcao futura
Opcoes possiveis:
1. pausar refresh quando houver `protected_password_required` pendente;
2. evitar chamadas concorrentes de `carregarUsuarios`;
3. reaproveitar grant valido com mais consistencia;
4. reduzir ruido de 403 esperado no console;
5. reiniciar refresh apenas apos desbloqueio;
6. combinar 1 + 2 + 3 como correcao mais conservadora.

### 9.6 Opcao recomendada
A opcao mais conservadora parece ser:
- pausar o refresh enquanto a protecao estiver pendente;
- evitar concorrencia entre tentativas de `carregarUsuarios`;
- retomar o refresh apenas depois de um grant valido ou de um retorno 200 estavel.

### 9.7 Riscos
- pausar demais pode congelar a lista de usuarios;
- pausar de menos pode manter o ruido de console;
- mudar a estrategia de retry pode afetar o fluxo protegido de outros modulos;
- qualquer alteracao em `requestJson()` tem risco transversal alto.

### 9.8 Testes manuais obrigatorios
1. Abrir painel de usuarios.
2. Verificar se o prompt de senha protegida abre.
3. Confirmar se o retry usa `X-Protected-Grant`.
4. Confirmar se, apos desbloqueio, o painel para de disparar `403` repetidos.
5. Abrir e fechar o painel varias vezes.
6. Confirmar que nao ha multiplos prompts simultaneos.
7. Confirmar que a lista de usuarios volta a atualizar normalmente apos o grant.

## 10. Frente B - Perfis de acesso / seed da clinica 1

### 10.1 Causa provavel
O seed esperado `sis_perfil_sql.csv` nao existe no workspace do projeto e a clinica 1 observada no banco nao tem `access_profile` nem `usuario_perfil_acesso`.

### 10.2 Arquivos envolvidos numa correcao futura
Opcoes de arquivos:
- `sis_perfil_sql.csv` na raiz do projeto, se a estrategia for restaurar o seed esperado;
- eventualmente um novo arquivo de seed versionado em pasta apropriada, se essa for a decisao de produto;
- possivelmente scripts de importacao, mas isso seria uma decisao posterior e separada.

### 10.3 Tabelas envolvidas
- `access_profile`
- `usuario_perfil_acesso`
- `usuarios`
- `prestador_odonto`
- `clinicas`

### 10.4 Como o servico usa o seed
`backend/services/access_profiles_service.py`:
1. tenta ler `sis_perfil_sql.csv`;
2. se o arquivo nao existe, retorna lista vazia de seed;
3. nao cria perfis do zero sem o seed;
4. apenas retorna os perfis ja existentes no banco para a clinica.

### 10.5 Opcoes de correcao futura
Comparacao objetiva:

#### A) Restaurar `sis_perfil_sql.csv` na raiz
- Vantagens: aderencia ao contrato atual do servico; baixo impacto em codigo.
- Riscos: depende de ter o seed correto; nao resolve sozinho vinculos de usuario/perfil.
- Arquivos/tabelas: seed na raiz; possivel importacao posterior.
- Mexe em codigo? Nao.
- Mexe em banco? Nao diretamente.
- Mexe em seed? Sim.
- Adequada para novas clinicas futuras? Sim, se o seed for o contrato oficial.

#### B) Criar seed versionado em pasta apropriada
- Vantagens: mais organizado para manutencao.
- Riscos: exige adaptar expectativa do servico ou dos scripts; pode virar mudanca estrutural.
- Arquivos/tabelas: novo local de seed e possiveis scripts.
- Mexe em codigo? Possivelmente sim, dependendo de como o caminho for consumido.
- Mexe em banco? Nao diretamente.
- Mexe em seed? Sim.
- Adequada para novas clinicas futuras? Sim, se a convencao for adotada de forma ampla.

#### C) Copiar/adaptar perfis da clinica_id = 8 para clinica_id = 1
- Vantagens: soluciona pontualmente a clinica 1.
- Riscos: pode importar modelo que nao corresponde ao negocio da clinica 1; pode mascarar o seed ausente.
- Arquivos/tabelas: tabela `access_profile` e possivelmente `usuario_perfil_acesso`.
- Mexe em codigo? Nao.
- Mexe em banco? Sim.
- Mexe em seed? Nao necessariamente.
- Adequada para novas clinicas futuras? Nao como estrategia geral.

#### D) Criar perfis padrao diretamente por rotina controlada
- Vantagens: resolve de forma automatica e reprodutivel para novas clinicas.
- Riscos: exige decidir a fonte de verdade dos perfis; pode conflitar com legado.
- Arquivos/tabelas: `access_profile`, possivelmente scripts de inicializacao.
- Mexe em codigo? Provavelmente sim.
- Mexe em banco? Sim, via rotina.
- Mexe em seed? Pode depender de seed ou schema fixo.
- Adequada para novas clinicas futuras? Sim, se for a regra oficial de produto.

#### E) Deixar sem perfis e documentar que novas clinicas começam vazias
- Vantagens: zero impacto estrutural imediato.
- Riscos: a tela continua vazia; usuario precisa criar tudo manualmente; pode nao corresponder ao comportamento esperado do legado.
- Arquivos/tabelas: apenas documentacao.
- Mexe em codigo? Nao.
- Mexe em banco? Nao.
- Mexe em seed? Nao.
- Adequada para novas clinicas futuras? So se isso for a regra de negocio desejada.

### 10.6 Opcao recomendada
Para a clinica 1, a opcao mais conservadora parece ser:
- corrigir a origem de perfis/seed primeiro, sem copiar dado aleatorio de outra clinica;
- se a intencao de produto for manter perfis padrao, restaurar o seed esperado ou formalizar o seed versionado.

Para novas clinicas futuras:
- a decisao mais segura e estrutural e definir um contrato claro de provisionamento de perfis, em vez de depender de copia manual.

### 10.7 Separacao entre correcao pontual e estrutural
- Correcao pontual: restaurar/ajustar os perfis da clinica 1.
- Correcao estrutural: definir como novas clinicas recebem perfis padrao daqui para frente.

Recomendacao conservadora:
- tratar a clinica 1 primeiro como caso pontual, mas documentar imediatamente a regra estrutural para novas clinicas.

### 10.8 Riscos
- mexer em dados de outra clinica sem criterio pode gerar inconsistencias;
- restaurar seed sem confirmar a regra de produto pode criar perfis indevidos;
- deixar sem perfis pode perpetuar a tela vazia e a percepcao de bug;
- correcoes em banco sem backup/SELECT de confirmacao sao arriscadas.

### 10.9 Testes manuais obrigatorios
1. Abrir `Permissões de acesso`.
2. Abrir `Perfis de acesso`.
3. Confirmar se a lista `Perfil` deixa de aparecer vazia apos a correcao futura.
4. Confirmar se `Prestadores` continua populando.
5. Confirmar se a leitura de `GET /admin/users/{id}/profiles` continua `200`.
6. Confirmar se `assignments` deixa de vir vazio quando houver dados esperados.

## 11. Decisao entre correcao pontual e estrutural
Separacao recomendada:
- Frente A: correcao pontual de refresh/protected grant.
- Frente B: correcao estrutural de perfis/seed para a clinica 1 e futuras clinicas.

## 12. O que precisa ser decidido pelo usuario antes de qualquer correcao
O usuario precisa decidir:
1. se quer que novas clinicas nascam com perfis padrao;
2. se a clinica 1 deve receber apenas restauracao pontual ou tambem formalizacao estrutural;
3. se o seed oficial deve permanecer na raiz do projeto;
4. se a proxima correcao deve atacar primeiro o refresh/grant ou a camada de perfis/seed.

## 13. Proxima etapa recomendada
A proxima etapa mais segura, antes de qualquer patch, e discutir e escolher a ordem de correcoes:
- primeiro refresh/grant;
- primeiro perfis/seed;
- ou as duas frentes em etapas separadas.

## 14. Lista exata de onde o usuario deve testar depois de uma futura correcao
1. Painel de usuarios.
2. Network de `GET /admin/users`.
3. Prompt de senha protegida.
4. Retry com `X-Protected-Grant`.
5. Tela `Permissões de acesso`.
6. Tela `Perfis de acesso`.
7. Endpoint `GET /admin/users/12/profiles`.
8. Lista de `Perfil` e area de `Prestadores`.

## 15. Confirmacoes finais
- Nenhum codigo foi alterado nesta etapa.
- `frontend/app.js` nao foi alterado.
- `frontend/index.html` nao foi alterado.
- `frontend/js/modules/users-admin-modal-visual.js` nao foi alterado.
- backend, banco, rotas, permissões e endpoints nao foram alterados.
- Nenhum seed foi criado, restaurado, importado ou executado.
- Nenhum token real foi registrado neste documento.
- A blindagem textual/mojibake foi respeitada.
- Nada foi criado, editado, salvo, copiado, movido ou apagado nas pastas proibidas.

## 16. Resultado dos checks `node --check`
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok

## 17. Estado final do git
- `git status --short` mostra apenas os untracked antigos do workspace e os relatorios desta trilha.
- `git diff --stat` nao mostra alteracoes em arquivos rastreados nesta etapa.
