# Auditoria Git pré-organização de commits após clínica 15

## 1. Objetivo
Classificar o estado atual do Git por trilhas lógicas para preparar commits seletivos futuros sem misturar correções de Problema 1, Problema 2, exclusões seguras e documentação histórica.

## 2. Data / contexto
Data de referência: `2026-05-23`.

Contexto funcional consolidado:
- Problema 1: login / senha interna / perfis já foi testado e considerado resolvido.
- Problema 2: seed canônico Brana / procedimentos já foi corrigido e validado na trilha funcional.
- A clínica 15 contaminada já foi excluída com segurança.
- O workspace segue com tracked modificados antigos e muitos untracked.

## 3. Branch atual
- `modularizacao-segura-fase-1`

## 4. Resumo do git status
Estado atual observado:
- 8 arquivos tracked modificados
- muitos arquivos untracked
- nenhum arquivo staged

Arquivos tracked modificados:
- `backend/database.py`
- `backend/models/usuario.py`
- `backend/routes/auth_routes.py`
- `backend/security/admin_password.py`
- `backend/seeds/procedimentos_padrao.py`
- `backend/services/signup_service.py`
- `frontend/app.js`
- `frontend/index.html`

## 5. Lista de tracked modificados
### Tracked modificados já observados
- `backend/database.py`
- `backend/models/usuario.py`
- `backend/routes/auth_routes.py`
- `backend/security/admin_password.py`
- `backend/seeds/procedimentos_padrao.py`
- `backend/services/signup_service.py`
- `frontend/app.js`
- `frontend/index.html`

### Arquivos já alterados e ainda não staged
Todos os 8 arquivos acima permanecem apenas modificados no working tree.

## 6. Lista de untracked classificados por grupo
### Grupo A — Problema 1: login / senha interna / perfis
Prováveis untracked relacionados:
- `docs/primeiro_acesso_senha_interna_subetapa_0_diagnostico_login.md`
- `docs/primeiro_acesso_senha_interna_subetapa_1_correcao_separacao_login.md`
- `docs/primeiro_acesso_senha_interna_subetapa_1b_correcao_regressao_login.md`
- `docs/usuarios_perfis_acesso_subetapa_0_diagnostico_ui_contas_existentes.md`
- `docs/usuarios_perfis_acesso_subetapa_1_correcao_carregamento_aba_perfis.md`
- `docs/usuarios_perfis_acesso_subetapa_1b_ajuste_visual_layout_easydental.md`
- `docs/usuarios_perfis_acesso_subetapa_1c_validacao_manual_funcional_visual.md`
- `docs/usuarios_perfis_acesso_subetapa_1d_fechamento_correcao_ui.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_plano_correcao_controlada_grant_perfis.md`
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`

### Grupo B — Problema 2: seed Brana / procedimentos / signup
Prováveis untracked relacionados:
- `backend/seeds/procedimentos_brana.py`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_2_validacao_tecnica_sem_gravacao.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3a_correcao_duplicidade_signup.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_limpeza_email_codes_teste_abortado.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_c_auditoria_pos_execucao_email_codes.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3d_correcao_duplicidade_codigo_1010_signup.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3e_diagnostico_pos_teste_manual.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3f_correcao_roteamento_brana.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3g_contrato_seed_canonico_brana.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3h_seed_canonico_brana_336.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3i_signup_consumindo_seed_canonico_brana.md`
- `docs/auditoria_git_pos_problemas_1_2_pre_teste_manual.md`

### Grupo C — Exclusão segura clínica 15
Prováveis untracked relacionados:
- `backend/scripts/export_test_clinic_15_backup.py`
- `backend/scripts/delete_test_clinic_15_runner.py`
- `docs/clinica_15_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_15_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_15_exclusao_segura_etapa_3_execucao_real_controlada.md`

### Grupo D — Exclusões seguras clínicas 8, 9 e 10
Prováveis untracked relacionados:
- `backend/scripts/delete_test_clinic_runner.py`
- `backend/scripts/delete_test_clinic_9_runner.py`
- `backend/scripts/delete_test_clinic_10_runner.py`
- `backend/scripts/export_test_clinic_backup.py`
- `backend/scripts/export_test_clinic_9_backup.py`
- `backend/scripts/export_test_clinic_10_backup.py`
- `docs/clinica_8_exclusao_segura_*.md`
- `docs/clinica_9_exclusao_segura_*.md`
- `docs/clinica_10_exclusao_segura_*.md`
- `docs/contrato_exclusao_segura_contas_clinicas.md`

### Grupo E — Contratos, índices e inventários gerais
Prováveis untracked relacionados:
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/frontend_correcao_mojibake_textos_interface.md`
- `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md`
- `docs/intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md`

### Grupo F — Anamnese / SQLServer / restauração / arquivos antigos
Manter fora dos commits atuais:
- `docs/anamnese_*`
- `docs/sqlserver_*`
- `docs/restauracao_*`
- `docs/plano_isolamento_pendencias_anamnese_restauracao.md`
- `docs/revisao_humana_md_anamnese_pendentes.md`

### Grupo G — Arquivos suspeitos / soltos
Manter fora e não mexer:
- `git`
- `modularizacao-segura-fase-1`

## 7. Análise dos 8 tracked modificados
### `backend/database.py`
- Trilha provável: Problema 1.
- Conteúdo do diff: inclusão de `ensure_user_auth_schema()` e coluna `senha_interna_hash`.
- Mistura de trilhas: não aparente; foco é login/senha interna.
- Seguro para commit com: Grupo A.
- Mensagem sugerida: `Corrige base do login interno com senha separada`

### `backend/models/usuario.py`
- Trilha provável: Problema 1.
- Conteúdo do diff: adiciona `senha_interna_hash`.
- Mistura de trilhas: não aparente.
- Seguro para commit com: Grupo A.
- Mensagem sugerida: `Adiciona suporte a senha interna no modelo de usuário`

### `backend/routes/auth_routes.py`
- Trilha provável: Problema 1.
- Conteúdo do diff: `setup_complete` passa a gravar `senha_interna_hash`.
- Mistura de trilhas: não aparente.
- Seguro para commit com: Grupo A.
- Mensagem sugerida: `Separa senha de login da senha interna no fluxo de setup`

### `backend/security/admin_password.py`
- Trilha provável: Problema 1.
- Conteúdo do diff: verificação de senha interna passa a priorizar `senha_interna_hash`.
- Mistura de trilhas: não aparente.
- Seguro para commit com: Grupo A.
- Mensagem sugerida: `Valida senha interna separada da senha de login`

### `frontend/app.js`
- Trilha provável: Problema 1.
- Conteúdo do diff: ajuste de UI/permissões para perfis.
- Mistura de trilhas: não aparente.
- Seguro para commit com: Grupo A.
- Mensagem sugerida: `Ajusta tela de perfis de acesso e permissões`

### `frontend/index.html`
- Trilha provável: Problema 1.
- Conteúdo do diff: ajuste de layout visual da seção de perfis.
- Mistura de trilhas: não aparente.
- Seguro para commit com: Grupo A.
- Mensagem sugerida: `Corrige layout da tela de perfis de acesso`

### `backend/seeds/procedimentos_padrao.py`
- Trilha provável: Problema 2.
- Conteúdo do diff: troca de `PARTICULAR` por `Brana` no seed base e ajuste de idempotência.
- Mistura de trilhas: sim, envolve seed base e roteamento de nova conta.
- Seguro para commit com: Grupo B, desde que o seed canônico Brana e a trilha do signup estejam fechados.
- Mensagem sugerida: `Ajusta seed base para novas contas com Brana`

### `backend/services/signup_service.py`
- Trilha provável: Problema 2.
- Conteúdo do diff: roteamento do signup para seed canônico Brana e resolução dinâmica da tabela exemplo; também incorpora o fluxo de seed padrão no nascimento da conta.
- Mistura de trilhas: sim, porque afeta seed, signup e materialização da tabela privada.
- Seguro para commit com: Grupo B, preferencialmente junto do seed canônico Brana e da documentação correspondente.
- Mensagem sugerida: `Consome seed canônico da Brana no signup de novas contas`

## 8. Classificação por grupos
### Grupo A — login / senha interna / perfis
Arquivos principais:
- `backend/database.py`
- `backend/models/usuario.py`
- `backend/routes/auth_routes.py`
- `backend/security/admin_password.py`
- `frontend/app.js`
- `frontend/index.html`
- docs da trilha de login / usuários-perfis / users-admin

### Grupo B — seed Brana / procedimentos / signup
Arquivos principais:
- `backend/seeds/procedimentos_padrao.py`
- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_brana.py`
- docs da trilha Brana / procedimentos

### Grupo C — exclusão segura clínica 15
Arquivos principais:
- `backend/scripts/export_test_clinic_15_backup.py`
- `backend/scripts/delete_test_clinic_15_runner.py`
- docs da trilha da clínica 15

### Grupo D — exclusões seguras 8, 9 e 10
Arquivos principais:
- scripts de backup/runner das clínicas 8, 9 e 10
- docs correspondentes
- contrato de exclusão segura

### Grupo E — contratos / índices / inventários gerais
Arquivos principais:
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/indice_usuarios_access_profile_perfis_acesso.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/frontend_correcao_mojibake_textos_interface.md`
- docs de suporte e validação

### Grupo F — anamnese / SQLServer / restauração
Arquivos principais:
- `docs/anamnese_*`
- `docs/sqlserver_*`
- `docs/restauracao_*`

### Grupo G — suspeitos / soltos
- `git`
- `modularizacao-segura-fase-1`

## 9. Arquivos que devem entrar no primeiro commit
Commit 1 — Problema 1:
- `backend/database.py`
- `backend/models/usuario.py`
- `backend/routes/auth_routes.py`
- `backend/security/admin_password.py`
- `frontend/app.js`
- `frontend/index.html`
- docs da trilha Problema 1 e usuários/perfis

## 10. Arquivos que devem entrar no segundo commit
Commit 2 — Problema 2:
- `backend/seeds/procedimentos_padrao.py`
- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_brana.py`
- docs da trilha Brana / procedimentos / seed canônico

## 11. Arquivos que devem entrar no terceiro commit
Commit 3 — Exclusão segura clínica 15:
- `backend/scripts/export_test_clinic_15_backup.py`
- `backend/scripts/delete_test_clinic_15_runner.py`
- docs da clínica 15

## 12. Arquivos que devem ficar fora por enquanto
Fora por enquanto:
- Grupo D — exclusões seguras clínicas 8, 9 e 10
- Grupo E — contratos / índices / inventários gerais
- Grupo F — anamnese / SQLServer / restauração
- Grupo G — `git` e `modularizacao-segura-fase-1`

## 13. Riscos de misturar commits
- Misturar Problema 1 com Problema 2 dificulta rollback e revisão funcional.
- Misturar seed Brana com exclusão segura da clínica 15 confunde correção com limpeza operacional.
- Misturar exclusões 8/9/10 com 15 cria um commit grande demais e difícil de auditar.
- Incluir anamnese/SQLServer/restauração no mesmo lote polui o histórico com outra trilha técnica.
- Arquivos `backend/services/signup_service.py` e `backend/seeds/procedimentos_padrao.py` são os pontos mais sensíveis de mistura funcional.

## 14. Ordem recomendada de commits
1. Commit Problema 1 — login / senha interna / perfis.
2. Commit Problema 2 — seed canônico Brana / procedimentos / signup.
3. Commit clínica 15 — exclusão segura.
4. Depois decidir sobre clínicas 8/9/10 e contratos gerais.
5. Deixar anamnese / SQLServer / restauração fora por enquanto.

## 15. Mensagens de commit sugeridas
- Commit 1: `Corrige login interno e perfis de acesso`
- Commit 2: `Consolida seed canônico da Brana para novas contas`
- Commit 3: `Remove clínica de teste 15 com exclusão segura`
- Commit 4: `Consolida exclusões seguras das clínicas 8, 9 e 10`

## 16. Confirmação de que nenhum comando destrutivo foi executado
Confirma-se que nesta auditoria não foram executados:
- `git add`
- `git commit`
- `git push`
- `git reset`
- `git restore`
- `git clean`

## 17. Confirmações finais
- nenhum código foi alterado nesta auditoria
- nenhum documento existente foi alterado
- apenas este documento novo foi criado
- Git permaneceu sem staging
