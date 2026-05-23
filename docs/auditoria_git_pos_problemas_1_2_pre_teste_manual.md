# Auditoria Git pós-correções dos Problemas 1 e 2 — antes do teste manual

## 1. Objetivo
Mapear o estado atual do Git no projeto `D:\BRANA ARQUIVOS\BRANA CLOUD`, separar as alterações por trilha lógica e registrar um plano futuro de organização/commit seletivo sem executar qualquer ação de versionamento agora.

## 2. Escopo
- Leitura somente do estado do Git.
- Classificação das alterações por trilha.
- Separação de tracked modificados e untracked.
- Identificação de riscos de mistura entre Problema 1, Problema 2, exclusões seguras e documentação auxiliar.
- Nenhuma alteração de código, documento, banco ou versionamento.

## 3. Branch atual
`modularizacao-segura-fase-1`

## 4. Resumo do git status
- `git status --short` mostra 8 arquivos tracked modificados e muitos untracked.
- `git diff --name-only` confirma os 8 arquivos tracked modificados.
- `git diff --stat` confirma um conjunto de alterações concentrado em 8 arquivos tracked.
- `git log --oneline -15` mostra que o topo recente do histórico já estava ligado a trilhas de exclusão segura e perfis de acesso.

## 5. Arquivos tracked modificados
Arquivos tracked modificados atualmente:
- `backend/database.py`
- `backend/models/usuario.py`
- `backend/routes/auth_routes.py`
- `backend/security/admin_password.py`
- `backend/seeds/procedimentos_padrao.py`
- `backend/services/signup_service.py`
- `frontend/app.js`
- `frontend/index.html`

## 6. Arquivos untracked
Untracked atuais observados no workspace:
- scripts de exclusão segura das clínicas 8, 9 e 10;
- documentos de exclusão segura das clínicas 8, 9 e 10;
- documentos das trilhas de Problema 1;
- documentos das trilhas de Problema 2;
- documentos de limpeza/auditoria de `email_codes`;
- vários documentos antigos ou auxiliares fora das trilhas atuais.

## 7. Grupo A — Problema 1: login / senha interna / Perfis
Arquivos tracked modificados que pertencem claramente ao Problema 1:
- `backend/database.py`
- `backend/models/usuario.py`
- `backend/routes/auth_routes.py`
- `backend/security/admin_password.py`
- `frontend/app.js`
- `frontend/index.html`

Documentos relacionados ao Problema 1:
- `docs/primeiro_acesso_senha_interna_subetapa_0_diagnostico_login.md`
- `docs/primeiro_acesso_senha_interna_subetapa_1_correcao_separacao_login.md`
- `docs/primeiro_acesso_senha_interna_subetapa_1b_correcao_regressao_login.md`
- `docs/usuarios_perfis_acesso_subetapa_0_diagnostico_ui_contas_existentes.md`
- `docs/usuarios_perfis_acesso_subetapa_1_correcao_carregamento_aba_perfis.md`
- `docs/usuarios_perfis_acesso_subetapa_1b_ajuste_visual_layout_easydental.md`
- `docs/usuarios_perfis_acesso_subetapa_1c_validacao_manual_funcional_visual.md`
- `docs/usuarios_perfis_acesso_subetapa_1d_fechamento_correcao_ui.md`

Conclusão do grupo A:
- esses arquivos parecem pertencer ao Problema 1;
- a mistura mais sensível aqui é `frontend/app.js` + `frontend/index.html` com backend de senha interna e perfis.

## 8. Grupo B — Problema 2: Intervenções / Procedimentos / Brana
Arquivos tracked modificados que pertencem claramente ao Problema 2:
- `backend/services/signup_service.py`
- `backend/seeds/procedimentos_padrao.py`

Documentos relacionados ao Problema 2:
- `docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_2_validacao_tecnica_sem_gravacao.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3a_correcao_duplicidade_signup.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_limpeza_email_codes_teste_abortado.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_c_auditoria_pos_execucao_email_codes.md`

Conclusão do grupo B:
- esses arquivos parecem pertencer ao Problema 2;
- a mistura mais sensível aqui é `signup_service.py` com `procedimentos_padrao.py` e as subetapas 0-3B-C.

## 9. Grupo C — Exclusões seguras clínicas 8, 9 e 10
Untracked principais relacionados às exclusões seguras:
- `backend/scripts/delete_test_clinic_runner.py`
- `backend/scripts/delete_test_clinic_9_runner.py`
- `backend/scripts/delete_test_clinic_10_runner.py`
- `backend/scripts/export_test_clinic_backup.py`
- `backend/scripts/export_test_clinic_9_backup.py`
- `backend/scripts/export_test_clinic_10_backup.py`

Documentos relacionados:
- `docs/clinica_8_exclusao_segura*.md`
- `docs/clinica_9_exclusao_segura*.md`
- `docs/clinica_10_exclusao_segura*.md`

Classificação:
- novos/untracked: sim, os scripts e os documentos desta trilha aparecem como `??`;
- modificados: nenhum arquivo dessa trilha aparece como tracked modificado agora.

## 10. Grupo D — Limpeza email_codes / teste abortado
Documentos relacionados:
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_limpeza_email_codes_teste_abortado.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3b_c_auditoria_pos_execucao_email_codes.md`

Conclusão do grupo D:
- trata-se de documentação complementar da limpeza já executada;
- não há código novo relacionado a essa limpeza;
- o escopo ficou restrito a documentos, sem alteração de backend para essa etapa.

## 11. Grupo E — Untracked antigos / fora das trilhas atuais
Principais untracked que parecem antigos, legados ou fora das trilhas atuais:
- `docs/anamnese_*`
- `docs/anamnese_legado_*`
- `docs/sqlserver_anamnese_descoberta_eds70.sql`
- `docs/sqlserver_restore_eds70_anamnese_readonly.sql`
- `docs/restauracao_pre_anamnese*`
- `docs/revisao_humana_md_anamnese_pendentes.md`
- `docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.csv`
- `docs/caso_5000_detalhamento_vinculos_materiais_vs_generico_00205.csv`
- `docs/plano_isolamento_pendencias_anamnese_restauracao.md`
- `docs/frontend_correcao_mojibake_textos_interface.md`
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`
- `docs/users_admin_*`
- `docs/` contendo arquivos de apoio e planejamento fora do recorte mais recente
- `git`
- `modularizacao-segura-fase-1`

Classificação sugerida:
- possivelmente relacionado: documentos de contrato/regras/usuários que sustentam as trilhas atuais;
- possivelmente antigo: arquivos de anamnese, SQLServer e inventários legados;
- precisa de decisão posterior: os auxiliares e documentos de apoio que ainda não entraram numa trilha de commit clara;
- não mexer agora: tudo que não pertence diretamente ao teste manual combinado dos Problemas 1 e 2.

## 12. Riscos de misturar commits
- Misturar Problema 1 com Problema 2 no mesmo commit pode esconder regressões de login/senha interna ou de nascimento de novas contas.
- Misturar documentação de exclusão segura com correções de runtime pode dificultar rollback seletivo.
- Misturar untracked antigos com trilhas recentes pode poluir o histórico e dificultar auditoria futura.
- Misturar frontend com backend sem separação por tema aumenta o risco de revisão incompleta.

## 13. Plano sugerido de commits seletivos futuros
Ordem conservadora sugerida:
1. Commit separado para Problema 1, somente depois do teste manual combinado passar.
2. Commit separado para Problema 2, somente depois do teste manual combinado passar.
3. Commit separado para documentação/limpeza de `email_codes`, se fizer sentido.
4. Commit separado para exclusões seguras das clínicas 8, 9 e 10, se ainda não estiverem commitadas.
5. Manter untracked antigos fora até decisão explícita.

## 14. O que não deve ser commitado ainda
- Qualquer arquivo antes do teste manual combinado dos Problemas 1 e 2.
- Qualquer untracked antigo fora das trilhas ativas.
- Qualquer documento auxiliar sem decisão explícita de inclusão.
- Qualquer arquivo de exclusão segura que ainda precise de revisão final.

## 15. Onde testar antes de qualquer commit
Antes de qualquer commit, o usuário deve executar o teste manual combinado:

Problema 1:
- confirmar cadastro sem erro 500;
- login com senha de login;
- senha interna não entra no login comum;
- senha interna funciona em ação sensível;
- nova clínica nasce com 10 perfis padrão;
- tela Perfis de acesso abre;
- layout mostra Perfis em cima e Prestadores abaixo.

Problema 2:
- módulo Intervenções / Procedimentos mostra Tabela exemplo;
- módulo Intervenções / Procedimentos mostra Brana;
- nova conta não mostra PARTICULAR;
- Brana contém 336 procedimentos.
