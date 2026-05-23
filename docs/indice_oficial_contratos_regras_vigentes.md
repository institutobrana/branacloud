# Índice oficial de contratos e regras vigentes — Brana Cloud

## 1. Objetivo
Este índice é o mapa oficial para localizar as fontes de verdade do projeto Brana Cloud.

Ele não substitui os contratos originais.

Ele apenas aponta quais documentos devem ser consultados antes de alterações.

## 2. Regra de uso
Antes de qualquer alteração em uma área do sistema, o Codex deve:

1. localizar a área neste índice;
2. ler os documentos vigentes indicados;
3. respeitar contratos, regras e blindagens;
4. não usar documentos históricos como fonte principal quando houver contrato vigente;
5. documentar quais contratos foram consultados na etapa.

## 3. Contratos e regras globais obrigatórios

### `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- Função: blindar correções textuais, acentuação, mojibake, labels e strings visíveis.
- Quando consultar: antes de qualquer ajuste de UI, texto, placeholder, mensagem ou símbolo.
- Status: vigente.
- Observação: documento de proteção; não corrige nada por si só.

### `docs/00_master_guide.md`
- Função: ponto de entrada oficial do projeto e guia mestre de leitura.
- Quando consultar: no início de qualquer tarefa relevante.
- Status: vigente.
- Observação: define ordem de leitura e regras de ouro do projeto.

### `docs/02_arquitetura.md`
- Função: descrever arquitetura, backend, frontend, banco e fluxo geral.
- Quando consultar: antes de mudanças de estrutura, integração ou entendimento macro.
- Status: vigente.
- Observação: útil para localizar limites entre camadas.

### `docs/03_mapa_codigo.md`
- Função: mapear arquivos principais e onde mexer por tipo de tarefa.
- Quando consultar: antes de alterar qualquer módulo funcional.
- Status: vigente.
- Observação: aponta rotas, modelos, serviços e áreas sensíveis.

### `docs/05_banco_dados.md`
- Função: consolidar visão de tabelas, relações, multi-tenant e bootstrap.
- Quando consultar: antes de mexer em modelos, queries, scripts ou persistência.
- Status: vigente.
- Observação: orienta o uso correto de `clinica_id` e a leitura do schema.

### `docs/06_seguranca.md`
- Função: regras de segurança, JWT, autenticação, arquivos sensíveis e isolamento.
- Quando consultar: antes de qualquer alteração em auth, permissões ou rotas protegidas.
- Status: vigente.
- Observação: documento crítico para evitar regressões de segurança.

### `docs/07_fluxos.md`
- Função: documentar fluxos de login, `/me`, signup e uso autenticado.
- Quando consultar: antes de alterações em endpoints, frontend ou validações de fluxo.
- Status: vigente.
- Observação: útil para entender o que pode quebrar em cada rota.

### `docs/08_setup_execucao.md`
- Função: registrar setup local, execução e checks mínimos.
- Quando consultar: antes de iniciar ambiente, validar bootstrap ou orientar execução local.
- Status: vigente.
- Observação: ajuda a evitar diagnósticos com ambiente incompleto.

### `docs/10_continuidade.md`
- Função: orientar novos desenvolvedores e listar regras para não quebrar o sistema.
- Quando consultar: antes de qualquer contribuição relevante.
- Status: vigente.
- Observação: bom resumo de prioridades, limites e pontos sensíveis.

### `docs/11_roadmap_desenvolvimento.md`
- Função: registrar estado atual dos módulos e próximos passos.
- Quando consultar: antes de escolher o próximo módulo ou entender status funcional.
- Status: vigente.
- Observação: mapa operacional de evolução.

### `docs/matriz_mestre_prioridade_risco_refatoracao.md`
- Função: orientar prioridade e risco para refatorações.
- Quando consultar: antes de modularização, extrações ou cortes de escopo.
- Status: vigente.
- Observação: documento de decisão para redução de risco.

## 3.1 Estado validado recente
- `docs/validacao_manual_final_signup_brana_pos_correcoes.md`
- `docs/auditoria_documentacao_geral_brana_cloud_pos_signup_brana.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3g_contrato_seed_canonico_brana.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3h_seed_canonico_brana_336.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3i_signup_consumindo_seed_canonico_brana.md`
- `docs/clinica_15_exclusao_segura_etapa_3_execucao_real_controlada.md`
- Estado validado: login/senha interna/perfis corrigidos, signup com Brana validado, Brana com seed canonico de 336 procedimentos, Tabela exemplo separada, PARTICULAR restrito a contas antigas e exclusoes seguras de teste documentadas.

## 4. Usuários, novas contas, access_profile e perfis de acesso

### Documentos vigentes principais
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`

### Documentos de apoio da trilha
- `docs/pre_contrato_funcional_usuarios_novas_contas.md`
- `docs/access_profile_subetapa_1_fonte_versionada_passiva.md`
- `docs/access_profile_subetapa_2_bootstrap_idempotente_controlado.md`
- `docs/access_profile_subetapa_3a_dry_run_controlado.md`
- `docs/access_profile_subetapa_3b_execucao_dry_run_somente_leitura.md`
- `docs/access_profile_subetapa_4_acoplamento_signup_novas_clinicas.md`
- `docs/access_profile_subetapa_4a_validacao_signup_sem_sujar_banco.md`
- `docs/access_profile_subetapa_5d_signup_real_banco_isolado.md`
- `docs/access_profile_subetapa_5f_corrige_bootstrap_materializacao.md`
- `docs/access_profile_subetapa_5g_signup_real_apos_correcao_bootstrap.md`
- `docs/access_profile_subetapa_6a_consolidacao_trilha_validada.md`
- `docs/access_profile_subetapa_6b_estrategia_clinicas_existentes.md`
- `docs/access_profile_subetapa_6e_runner_controlado_clinicas_existentes.md`
- `docs/access_profile_subetapa_6f_execucao_runner_clinica_1.md`
- `docs/access_profile_subetapa_6g_validacao_pos_correcao_clinica_1.md`
- `docs/access_profile_subetapa_6i_execucao_runner_clinica_4.md`
- `docs/access_profile_subetapa_6j_validacao_pos_correcao_clinica_4.md`
- `docs/validacao_manual_final_signup_brana_pos_correcoes.md`

### Documentos relacionados à UI Usuários/Perfis
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`
- `docs/users_admin_plano_correcao_controlada_grant_perfis.md`
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- `docs/users_admin_primeira_separacao_real_execucao.md`
- `docs/sintese_primeira_separacao_real_usuarios_admin.md`

### Regra de consulta
Antes de qualquer ajuste em Usuários/Perfis de acesso, consultar obrigatoriamente:
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- documentos da trilha `users_admin` quando o ajuste envolver frontend.

## 5. Seeds e nascimento de novas contas

### Contrato vigente principal
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`

### Documentos de apoio
- `docs/seeds_procedimentos_e_genericos_nao_sobrescrever_existentes.md`
- `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md`
- `docs/seeds_procedimentos_genericos_subetapa_3a_planejamento_sanitizacao_nome_codigo.md`
- `docs/seeds_procedimentos_genericos_subetapa_3a_sanitizacao_nome_codigo.md`
- `docs/seeds_materiais_subetapa_2a_planejamento_sanitizacao_nome_codigo.md`
- `docs/seeds_materiais_subetapa_2a_sanitizacao_nome_codigo.md`
- `docs/seeds_particular_zerar_valores_financeiros_novas_contas.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/auditoria_profunda_easydental_manual_instalacao_seeds_usuarios.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3g_contrato_seed_canonico_brana.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3h_seed_canonico_brana_336.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3i_signup_consumindo_seed_canonico_brana.md`
- `docs/validacao_manual_final_signup_brana_pos_correcoes.md`
- `docs/anamnese_seed_obrigatorio_plano.md`
- `docs/anamnese_seed_obrigatorio_implementacao_resultado.md`

### Regra de consulta
Antes de qualquer alteração em seeds ou nascimento de novas contas, consultar obrigatoriamente:
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_usuarios_novas_contas.md` quando envolver signup;
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

## 6. Exclusão segura de contas e clínicas

### Contrato vigente principal
- `docs/contrato_exclusao_segura_contas_clinicas.md`

### Documentos de apoio
- `docs/clinica_8_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_8_exclusao_segura_etapa_2_plano_documental.md`
- `docs/clinica_8_exclusao_segura_etapa_3_runner_controlado_sem_execucao.md`
- `docs/clinica_8_exclusao_segura_etapa_4_dry_run_runner.md`
- `docs/clinica_8_exclusao_segura_etapa_5_backup_pre_exclusao.md`
- `docs/clinica_8_exclusao_segura_etapa_6_runner_execucao_controlada_sem_executar.md`
- `docs/clinica_8_exclusao_segura_etapa_7_revisao_final_pre_execucao.md`
- `docs/clinica_8_exclusao_segura_etapa_8_execucao_real_controlada.md`
- `docs/clinica_8_exclusao_segura_etapa_9_validacao_novo_cadastro_limpo.md`
- `docs/clinica_9_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_9_exclusao_segura_etapa_3_execucao_real_controlada.md`
- `docs/clinica_15_exclusao_segura_etapa_1_diagnostico_somente_leitura.md`
- `docs/clinica_15_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
- `docs/clinica_15_exclusao_segura_etapa_3_execucao_real_controlada.md`

### Regra de consulta
Antes de qualquer exclusão, consultar obrigatoriamente:
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- documentos de diagnóstico da conta/clínica alvo.

## 7. Modularização e refatoração segura

### Documentos vigentes ou de orientação
- `docs/matriz_mestre_prioridade_risco_refatoracao.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/reversao_controlada_modularizacao_frontend.md`
- `docs/modularizacao_alerta_recorrente_duplo_clique_binds.md`

### Módulos com trilhas documentadas, como apoio/histórico
- materiais
- intervenções/procedimentos
- convênios/planos
- plano de contas
- medicamentos
- símbolos gráficos
- anamnese
- usuários

Documentos de anamnese, SQLServer e restauracao continuam em trilha separada e nao devem ser usados como fonte principal do estado atual quando houver contrato ou indice vigente.

O inventário completo das trilhas e documentos relacionados está em:
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`

## 8. Documentos históricos e de apoio
Documentos de execução, diagnóstico, dry-run, validação e fechamento são importantes para rastreabilidade, mas não devem substituir contratos vigentes quando houver documento de contrato.

Exemplos de apoio/histórico:
- subetapas de `access_profile`;
- etapas de exclusão clínica 8/9;
- diagnósticos de UI;
- auditorias Easydental;
- documentos de execução pontual.

Esses documentos ajudam a entender o caminho percorrido, mas a consulta principal deve sempre privilegiar os contratos e regras vigentes listados acima.

## 9. Documentos candidatos a padronização futura

### `docs/pre_contrato_funcional_usuarios_novas_contas.md`
- Nome atual: `pre_contrato_funcional_usuarios_novas_contas.md`
- Possível nome futuro: `contrato_usuarios_novas_contas_previa.md`
- Observação: não renomeado nesta etapa.

### `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- Nome atual: `plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- Possível nome futuro: `plano_access_profile_perfis_acesso.md`
- Observação: não renomeado nesta etapa.

### `docs/users_admin_primeira_separacao_real_execucao.md`
- Nome atual: `users_admin_primeira_separacao_real_execucao.md`
- Possível nome futuro: `users_admin_modal_visual_execucao.md`
- Observação: não renomeado nesta etapa.

### `docs/sintese_primeira_separacao_real_usuarios_admin.md`
- Nome atual: `sintese_primeira_separacao_real_usuarios_admin.md`
- Possível nome futuro: `users_admin_modal_visual_fechamento.md`
- Observação: não renomeado nesta etapa.

### `docs/auditoria_fechamento_easydental_brana_contrato_usuarios.md`
- Nome atual: `auditoria_fechamento_easydental_brana_contrato_usuarios.md`
- Possível nome futuro: `auditoria_contrato_usuarios_origem_easydental.md`
- Observação: não renomeado nesta etapa.

### `docs/auditoria_profunda_easydental_manual_instalacao_seeds_usuarios.md`
- Nome atual: `auditoria_profunda_easydental_manual_instalacao_seeds_usuarios.md`
- Possível nome futuro: `auditoria_seeds_usuarios_easydental.md`
- Observação: não renomeado nesta etapa.

### `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- Nome atual: `auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- Possível nome futuro: `inventario_refatoracao_frontend_backend.md`
- Observação: não renomeado nesta etapa.

### `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
- Nome atual: `varredura_comparativa_primeiro_modulo_modularizacao.md`
- Possível nome futuro: `modularizacao_varredura_primeiro_modulo.md`
- Observação: não renomeado nesta etapa.

### `docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md`
- Nome atual: `varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md`
- Possível nome futuro: `modularizacao_varredura_modulos_nao_iniciados.md`
- Observação: não renomeado nesta etapa.

### `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- Nome atual: `users_admin_pos_teste_403_forbidden_diagnostico.md`
- Possível nome futuro: `users_admin_diagnostico_403_forbidden.md`
- Observação: não renomeado nesta etapa.

## 10. Padrão futuro sugerido de nomes
Proposta, sem aplicação nesta etapa:

- `docs/contrato_<area>_<assunto>.md`
- `docs/regras_<area>_<assunto>.md`
- `docs/<modulo>_<assunto>_diagnostico.md`
- `docs/<modulo>_<assunto>_plano.md`
- `docs/<modulo>_<assunto>_execucao.md`
- `docs/<modulo>_<assunto>_fechamento.md`
- `docs/inventario_<area>_<assunto>.md`
- `docs/indice_<area>_<assunto>.md`

## 11. Como usar este índice nas próximas etapas
### Para mexer na tela Perfis de acesso
1. consultar este índice;
2. ler `docs/contrato_funcional_usuarios_novas_contas.md`;
3. ler `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`;
4. ler `docs/regras_blindagem_correcoes_textuais_mojibake.md`;
5. ler os documentos `users_admin` relacionados quando o ajuste envolver frontend;
6. só então criar diagnóstico ou correção.

### Para mexer em seeds
1. consultar este índice;
2. ler `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`;
3. ler os documentos de apoio de seeds;
4. validar banco/dry-run;
5. não alterar strings.

### Para excluir clínica
1. consultar este índice;
2. ler `docs/contrato_exclusao_segura_contas_clinicas.md`;
3. seguir diagnóstico, backup, dry-run, execução única e validação.

## 12. Limites deste índice
- Não renomeia arquivos.
- Não consolida contratos.
- Não substitui contratos originais.
- Não apaga documentos históricos.
- Deve ser atualizado futuramente se novos contratos forem criados.

## 13. Próximas etapas recomendadas
1. Consolidar a trilha de Users / access_profile / perfis de acesso usando os documentos vigentes.
2. Criar ou atualizar um índice específico do módulo Usuários, se necessário.
3. Só depois retomar diagnóstico/correção da UI Perfis de acesso.

## 14. Confirmações
- Somente este documento foi criado.
- Nenhum código foi alterado.
- Banco não foi alterado.
- Nenhum `DELETE`, `UPDATE` ou `INSERT` foi executado.
- Nenhum arquivo foi renomeado.
- Nenhum documento foi movido.
- Nenhum documento foi apagado.
- `signup`, `seeds` e `access_profile` não foram alterados.
- `frontend` e `backend` não foram alterados.
- Pastas proibidas não foram tocadas.
- A blindagem textual/mojibake foi respeitada.
- Sem `git add`, `git commit` ou `git push`.
