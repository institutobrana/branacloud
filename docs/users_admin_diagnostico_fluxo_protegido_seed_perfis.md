# Diagnostico objetivo do fluxo protegido de usuarios e seed/perfis de acesso

## 1. Objetivo da verificacao
Confirmar tecnicamente, sem alterar codigo, se:
- o fluxo `protected_password_required` realmente abre o prompt de senha protegida;
- o retry com `X-Protected-Grant` esta previsto;
- o refresh de usuarios continua rodando mesmo apos o bloqueio/protecao;
- o seed `sis_perfil_sql.csv` existe e onde deveria estar;
- a ausencia desse seed explica a lista vazia em `Perfis de acesso`;
- existem dados reais de perfis e vinculos no banco, usando somente leitura.

## 2. Data / etapa
- Data: `2026-05-20`
- Etapa: diagnostico objetivo, somente leitura

## 3. Branch conferida
- `modularizacao-segura-fase-1`

## 4. Commit de referencia
- `22e7652` - `Extrai visual do modal admin de usuarios`

## 5. Estado inicial do git
- Branch correta confirmada.
- `git status --short` mostrava apenas untracked antigos do workspace e os relatorios ja criados nesta trilha.
- Nenhum codigo foi alterado nesta verificacao.

## 6. Comandos de leitura executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -30`
- `git show --stat 22e7652`
- `git show --name-only 22e7652`
- `git show 22e7652 -- frontend/app.js frontend/index.html frontend/js/modules/users-admin-modal-visual.js`
- `git grep -n "protected_password_required"`
- `git grep -n "ensureProtectedGrant"`
- `git grep -n "unlockProtectedGrant"`
- `git grep -n "X-Protected-Grant"`
- `git grep -n "requestJsonBase"`
- `git grep -n "requestJson"`
- `git grep -n "usersStartRefresh"`
- `git grep -n "setInterval"`
- `git grep -n "carregarUsuarios"`
- `git grep -n "admin/users"`
- `git grep -n "permissions/schema"`
- `git grep -n "profiles"`
- `git grep -n "access_profiles_service"`
- `git grep -n "sis_perfil_sql.csv"`
- `git grep -n "sis_perfil"`
- `git grep -n "perfil"`
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
- `Select-String` em documentos de auditoria anteriores
- `Test-Path sis_perfil_sql.csv`
- `Get-ChildItem` recursivo para localizar seeds parecidos
- consultas `SELECT` read-only no PostgreSQL via `backend/.env`

## 7. Mapeamento do fluxo `protected_password_required`
O fluxo atual esta implementado assim:
1. `requestJsonBase()` executa o `fetch` bruto.
2. `requestJson()` interpreta o retorno.
3. Se vier `403` com `detail.error = protected_password_required`, `parseProtectedError()` identifica o caso.
4. `ensureProtectedGrant()` abre o prompt de senha protegida.
5. `unlockProtectedGrant()` chama `POST /auth/protected/unlock`.
6. Se o backend devolver `grant_token`, `requestJson()` refaz a chamada original com `X-Protected-Grant`.

Conclusao objetiva:
- o prompt **deveria abrir** quando o `403` estruturado chega em `requestJson()`.
- o retry com `X-Protected-Grant` **esta previsto** no codigo.

## 8. Funcoes envolvidas no prompt de senha protegida
- `requestJsonBase()`
- `requestJson()`
- `parseProtectedError()`
- `ensureProtectedGrant()`
- `unlockProtectedGrant()`
- `protectedPassDialog()`
- `protectedPassSubmit()`
- `require_module_access()`
- `require_admin_password_if_user_control_enabled()`

## 9. Confirmacao sobre o prompt
Sim, o prompt deveria abrir no caminho protegido do modulo `usuarios`, porque `ensureProtectedGrant()` chama o dialogo de senha ao detectar o erro protegido.

O prompt e especifico ao contexto do modulo protegido:
- a mensagem inclui o modulo corrente;
- o caso observado foi `usuarios`.

## 10. Confirmacao sobre retry com `X-Protected-Grant`
Sim, o retry esta previsto.
O frontend monta o header `X-Protected-Grant` no segundo intento quando recebe grant valido.

## 11. Evidencia de retry retornando `200`
Nesta verificacao documental, nao foi feita captura do Network em tempo real.
Portanto:
- ha confirmacao de que o retry esta implementado;
- **nao houve evidencia direta desta rodada de que o retry efetivamente retornou 200**.

Esse ponto ainda requer confirmacao manual no Network, se o usuario quiser validar o ciclo completo ponta a ponta.

## 12. Refresh e `usersStartRefresh`
O refresh continua vindo de:
- `usersStartRefresh()`
- `showUsersPanel(true)`
- `abrirPainelAdministradorToolbar()`
- `abrirPainelUsuariosConfig()`

O intervalo esta definido em:
- `window.setInterval(..., 3000)`

Conclusao:
- o refresh **continua rodando** mesmo com o fluxo protegido;
- nao existe pausa especifica para `protected_password_required`;
- se a protecao nao for resolvida, a lista pode continuar tentando carregar e repetir o 403.

## 13. Risco de loop / multiplos prompts / multiplos retries
Existe risco operacional, mas o codigo tem algumas protecoes:
- `protectedGrantPending` evita prompts duplicados simultaneos para o mesmo modulo;
- `protectedGrantCache` tenta reaproveitar o grant;
- porem o `setInterval` continua vivo enquanto o painel estiver aberto.

Conclusao pratica:
- **sim, ha risco de repeticao de chamadas e possivel loop de refresh/prompt se o grant nao for concedido ou nao for reaproveitado**;
- isso parece um comportamento preexistente do fluxo, nao regressao do commit `22e7652`.

## 14. Local esperado do seed `sis_perfil_sql.csv`
O local esperado e o projeto raiz:
- `D:\BRANA ARQUIVOS\BRANA CLOUD\sis_perfil_sql.csv`

Base tecnica:
- `backend/services/access_profiles_service.py` define `ROOT_DIR = Path(__file__).resolve().parents[3]` e usa `ROOT_DIR / "sis_perfil_sql.csv"`.
- `backend/scripts/migrar_perfis_acesso_easy.py` usa o mesmo padrao: `PROJECT_DIR / "sis_perfil_sql.csv"`.
- `backend/estrutura_precificacao.txt` tambem registra `sis_perfil.csv` e `sis_perfil_sql.csv` no inventario historico.

## 15. Resultado da busca pelo seed no workspace
Resultado:
- `Test-Path sis_perfil_sql.csv` -> `False`
- busca recursiva por `sis_perfil*.csv`, `perfil*.csv`, `access_profile*.csv`, `profiles*.csv` -> nenhum arquivo equivalente encontrado no workspace do projeto

## 16. Resultado da busca por seeds equivalentes / parecidos
Nao foi encontrado arquivo equivalente util no workspace.

## 17. Como `backend/services/access_profiles_service.py` usa esse seed
O servico:
1. tenta ler `sis_perfil_sql.csv`;
2. se o arquivo nao existe, `_read_easy_profiles()` retorna lista vazia;
3. `ensure_access_profiles()` nao cria perfis novos sem seed;
4. ele apenas retorna os `AccessProfile` que ja existirem no banco para a clinica;
5. ordena por `source_id` e `id`.

Conclusao:
- se o seed estiver ausente e a clinica ainda nao tiver `access_profile` persistido, a lista fica vazia.

## 18. A ausencia do seed explica a lista vazia em `Perfis de acesso`?
Para a clinica ativa observada neste banco, **sim, explica muito bem**:
- o banco contem `access_profile` somente para `clinica_id = 8`;
- a clinica do usuario amostrado no banco e `clinica_id = 1`;
- `access_profile` para `clinica_id = 1` -> `0`;
- `usuario_perfil_acesso` para `clinica_id = 1` -> `0`.

Entao, para a clinica 1, a ausencia do seed + ausencia de perfis locais persistidos explica a aba vazia.

## 19. Banco identificado e arquivo de conexao
Banco identificado:
- PostgreSQL

Arquivo de conexao/configuracao:
- `backend/.env`
- `backend/database.py` faz `load_dotenv()` e usa `DATABASE_URL`

Valor lido em ambiente local:
- `postgresql://postgres:1234@localhost:5432/brana_saas`

## 20. Tabelas relacionadas identificadas
Tabelas relevantes encontradas:
- `access_profile`
- `usuario_perfil_acesso`
- `usuarios`
- `prestador_odonto`
- `clinicas`
- `permissions` nao e tabela de banco aqui; o contrato vive em `backend/security/permissions.py`

## 21. SELECTs executados
SELECTs de leitura executados:
- `select table_schema, table_name from information_schema.tables ...`
- `select count(*) from access_profile`
- `select count(*) from usuario_perfil_acesso`
- `select count(*) from usuarios`
- `select count(*) from prestador_odonto`
- `select count(*) from clinicas`
- `select clinica_id, count(*) from access_profile group by clinica_id`
- `select clinica_id, count(*) from usuario_perfil_acesso group by clinica_id`
- `select id, clinica_id, source_id, nome, reservado from access_profile ... limit 10`
- `select id, clinica_id, usuario_id, prestador_id, perfil_id from usuario_perfil_acesso ... limit 10`
- `select id, codigo, nome, tipo_usuario, is_admin, permissoes_json, clinica_id from usuarios ... limit 5`

## 22. Resultado dos SELECTs
Resultados principais:
- `access_profile = 10`
- `usuario_perfil_acesso = 0`
- `usuarios = 11`
- `prestador_odonto = 7`
- `clinicas = 3`
- `access_profile` por `clinica_id`:
  - somente `clinica_id = 8` com `10` linhas
- `clinica_id = 1`:
  - `access_profile = 0`
  - `usuario_perfil_acesso = 0`

### Amostra de `access_profile`
Os 10 registros encontrados pertencem a `clinica_id = 8` e incluem perfis como:
- Pacientes
- Intervenções
- Agenda de horários
- Créditos na conta corrente
- Débitos na conta corrente
- Controle de estoque
- Controle de protético
- Controle de recibos
- Relatórios estatísticos
- Relatórios financeiros

### Amostra de `usuarios`
O banco tem usuarios com `permissoes_json` preenchido, incluindo a conta base:
- `id=1`, `codigo=1`, `nome=Gleisson Tel`, `is_admin=True`, `clinica_id=1`

Isso indica que:
- permissões individuais existem;
- perfis de acesso vinculados nao existem para a clinica 1 neste banco;
- a tela de perfis vazia nao implica automaticamente perda de `permissoes_json`.

## 23. Ha dados reais de perfis no banco?
Sim, ha dados reais de `access_profile`, mas apenas para `clinica_id = 8`.

Para a clinica 1 do usuario amostrado:
- nao ha perfis reais em `access_profile`.

## 24. Ha vinculos reais usuario/perfil no banco?
Nao foi encontrado nenhum registro em `usuario_perfil_acesso`.

## 25. Indicio de perda real de dados
Conclusao:
- nao ha prova de perda real de dados causada pelo commit `22e7652`;
- ha forte indicio de **ausencia de seed/import para a clinica 1** e de **tabela de vinculos vazia**;
- portanto a interpretacao mais conservadora e **inconclusiva quanto a perda**, com tendencia maior para ausencia de dados carregados do que para regressao do recorte visual.

## 26. Indicio de falha apenas de carregamento / renderizacao
Sim, existe esse indicio:
- o frontend depende de `GET /admin/users/{user_id}/profiles`;
- o backend para essa rota chama `ensure_access_profiles(db, current_user.clinica_id)`;
- sem seed e sem perfis persistidos para a clinica 1, a lista vem vazia;
- a UI atual de `Perfis de acesso` pode parecer “quebrada” porque a lista realmente nao tem itens para renderizar.

## 27. Relacao com `protected_password_required`
Relacao indireta, sim:
- o modulo `usuarios` protege o acesso ao painel;
- se a chamada para `GET /admin/users` nao conseguir grant, o refresh nao estabiliza;
- isso pode atrasar ou impedir a abertura completa da tela de permissoes/perfis.

## 28. Relacao com o commit `22e7652`
Nao ha relacao concreta de regressao:
- o commit nao tocou em permissões, refresh, grants, backend, seed ou rotas.
- ele ficou no recorte visual do modal de usuarios.

## 29. Conclusao objetiva
- O fluxo protegido **deveria abrir o prompt**.
- O retry com `X-Protected-Grant` **esta implementado e previsto**.
- **Nao houve evidencia direta nesta verificacao de que o retry retornou 200**; isso ainda pede confirmacao manual no Network.
- O refresh **continua depois do desbloqueio**, porque o timer nao e pausado.
- O seed `sis_perfil_sql.csv` **esta ausente** no workspace do projeto.
- A ausencia do seed **explica a lista vazia** de `Perfis de acesso` para a clinica 1 observada no banco.
- Ha dados reais de perfis no banco, mas **apenas para outra clinica** (`clinica_id = 8`).
- Nao ha indicio de perda real de `usuario_perfil_acesso`; a tabela esta vazia.
- Nao ha indicio de regressao da extracao visual.

## 30. Recomendacao conservadora do proximo passo
Sem corrigir nada ainda, o melhor proximo passo e:
1. testar manualmente o retry do `protected_password_required` no Network para confirmar o `200` apos grant;
2. confirmar se a clinica usada no teste e `clinica_id = 1` e se realmente nao possui seeds/persistencias de perfis;
3. decidir se a proxima acao deve ser importar/estabilizar dados de perfis ou apenas seguir com outra separacao.

## 31. Onde o usuario deve testar novamente
1. Abrir o sistema com hard refresh.
2. Abrir o painel de usuarios.
3. Confirmar no Network o `403 protected_password_required`.
4. Abrir o prompt de senha protegida quando ele aparecer.
5. Confirmar se o retry de `GET /admin/users` responde `200`.
6. Abrir a aba `Permissões de acesso`.
7. Abrir a aba `Perfis de acesso`.
8. Verificar se a coluna `Perfil` passa a listar itens quando houver seed/dados para a clinica correta.
9. Repetir com a mesma clinica do banco testado (`clinica_id = 1`), se possivel.

## 32. Confirmacao de que nenhum codigo foi alterado
- Nenhum codigo foi alterado nesta verificacao.

## 33. Confirmacao sobre `frontend/app.js`
- `frontend/app.js` nao foi alterado nesta verificacao.

## 34. Confirmacao sobre `frontend/index.html`
- `frontend/index.html` nao foi alterado nesta verificacao.

## 35. Confirmacao sobre `frontend/js/modules/users-admin-modal-visual.js`
- `frontend/js/modules/users-admin-modal-visual.js` nao foi alterado nesta verificacao.

## 36. Confirmacao sobre backend, banco, rotas, permissões e endpoints
- Backend, banco, rotas, permissões e endpoints nao foram alterados nesta verificacao.

## 37. Confirmacao sobre seed
- Nenhum seed foi criado, importado, executado ou alterado nesta verificacao.

## 38. Confirmacao sobre banco read-only
- As consultas ao banco foram somente `SELECT` e leitura de metadados.
- Nao houve `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP`, `TRUNCATE`, migration ou seed.

## 39. Blindagem textual / mojibake
- A blindagem textual/mojibake foi respeitada.
- Nao houve correcao de textos, labels, placeholders ou mensagens.
- Problemas textuais encontrados foram apenas registrados.

## 40. Pastas proibidas
- Nada foi criado, editado, salvo, copiado, movido ou apagado nas pastas proibidas.

## 41. Resultado dos checks `node --check`
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok

## 42. Estado final do git
- `git status --short` mostra apenas untracked antigos do workspace e os relatorios desta trilha.
- `git diff --stat` nao mostra alteracoes em arquivos rastreados nesta etapa.
