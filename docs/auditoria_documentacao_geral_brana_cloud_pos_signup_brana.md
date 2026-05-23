# Auditoria documental geral do Brana Cloud pós-signup Brana

## 1. Objetivo da auditoria
Mapear a documentação existente do Brana Cloud, classificar os arquivos por função documental e indicar o que hoje parece fonte de verdade, histórico, desatualizado ou pendente de consolidação, sem alterar qualquer arquivo além deste relatório.

## 2. Escopo
Esta auditoria cobre:
- READMEs;
- guias-base e visões gerais;
- contratos vigentes e regras permanentes;
- índices e inventários;
- roadmaps e recomendações de continuidade;
- docs de módulos;
- docs de seeds, novas contas e Brana;
- docs de usuários/login/senha interna/perfis;
- docs de Intervenções/Procedimentos/Brana;
- docs de Materiais/Procedimentos Genéricos/vínculos;
- docs de exclusão segura;
- docs de anamnese / SQLServer / restauração;
- docs históricos e legados.

## 3. Fora de escopo
- alteração de código;
- alteração de README;
- alteração de docs existentes;
- movimentação/renomeação/exclusão de arquivos;
- alteração de banco;
- signup/seed/runner/exclusão real;
- correção textual/mojibake;
- reorganização física da documentação.

## 4. Branch e estado Git
- branch atual: `modularizacao-segura-fase-1`
- o workspace está sem tracked modificados neste momento desta auditoria, mas com muitos `untracked` antigos e fora da trilha atual
- os commits principais já versionados antes desta auditoria são:
  - `5c8ef7a` - Corrige login, senha interna e perfis de usuarios
  - `8c1f7c5` - Corrige seed canonico Brana no signup
  - `cb20715` - Documenta exclusao segura da clinica 15
  - `9c4df78` - Documenta exclusoes seguras de clinicas de teste
  - `680749d` - Documenta validacao final do signup com Brana

## 5. Metodologia de busca
Foi feita leitura somente de arquivos e classificação por nome/padrão e por conteúdo introdutório dos documentos principais. Também foram usados inventários de arquivo e busca textual por termos como:
- `contrato`
- `roadmap`
- `seed` / `seeds`
- `nova conta` / `novas contas`
- `usuarios` / `usuários`
- `senha interna`
- `perfis`
- `Brana`
- `PARTICULAR`
- `Tabela exemplo`
- `Intervencoes` / `Intervenções`
- `Procedimentos`
- `Materiais`
- `Genericos` / `Genéricos`
- `vinculos` / `vínculos`
- `mojibake`
- `blindagem`
- `exclusao segura` / `exclusão segura`
- `anamnese`
- `SQLServer`
- `restauracao` / `restauração`

## 6. READMEs encontrados
Encontrados 4:
- [README.md](../README.md)
- [README_WEB.md](../README_WEB.md)
- [backend/README.md](../backend/README.md)
- [local_bridge/README.md](../local_bridge/README.md)

### Classificação
- [README.md](../README.md): guia operacional geral; parece atual, mas precisa revisão de nomenclatura e consistência textual
- [README_WEB.md](../README_WEB.md): guia operacional do produto web; útil, mas com estrutura que parece anterior a algumas reorganizações
- [backend/README.md](../backend/README.md): guia/descrição do backend; tem mojibake e linguagem mais antiga, então está mais perto de histórico/legado
- [local_bridge/README.md](../local_bridge/README.md): guia operacional específico e aparentemente vigente para a ponte local

## 7. Guias-base encontrados
Principais guias-base:
- [docs/00_master_guide.md](./00_master_guide.md)
- [docs/01_visao_produto.md](./01_visao_produto.md)
- [docs/02_arquitetura.md](./02_arquitetura.md)
- [docs/03_mapa_codigo.md](./03_mapa_codigo.md)
- [docs/04_funcionalidades.md](./04_funcionalidades.md)
- [docs/05_banco_dados.md](./05_banco_dados.md)
- [docs/06_seguranca.md](./06_seguranca.md)
- [docs/07_fluxos.md](./07_fluxos.md)
- [docs/08_setup_execucao.md](./08_setup_execucao.md)
- [docs/09_problemas_e_riscos.md](./09_problemas_e_riscos.md)
- [docs/10_continuidade.md](./10_continuidade.md)
- [docs/11_roadmap_desenvolvimento.md](./11_roadmap_desenvolvimento.md)

### Leitura rápida
- [docs/00_master_guide.md](./00_master_guide.md) é o ponto de entrada mais próximo de um guia geral vigente
- [docs/11_roadmap_desenvolvimento.md](./11_roadmap_desenvolvimento.md) ainda existe como roadmap, mas parece mais histórico/aberto do que fechado
- [docs/10_continuidade.md](./10_continuidade.md) e [docs/09_problemas_e_riscos.md](./09_problemas_e_riscos.md) funcionam como guias de continuidade, porém precisam ser confrontados com os commits recentes antes de virar fonte principal

## 8. Contratos vigentes encontrados
Contratos mais relevantes:
- [docs/contrato_funcional_usuarios_novas_contas.md](./contrato_funcional_usuarios_novas_contas.md)
- [docs/contrato_seeds_novas_contas_minimos_nome_codigo.md](./contrato_seeds_novas_contas_minimos_nome_codigo.md)
- [docs/contrato_funcional_regras_materiais_genericos_intervencoes.md](./contrato_funcional_regras_materiais_genericos_intervencoes.md)
- [docs/contrato_exclusao_segura_contas_clinicas.md](./contrato_exclusao_segura_contas_clinicas.md)

### Classificação
- [docs/contrato_funcional_usuarios_novas_contas.md](./contrato_funcional_usuarios_novas_contas.md): contrato funcional vigente para novas contas e usuários
- [docs/contrato_seeds_novas_contas_minimos_nome_codigo.md](./contrato_seeds_novas_contas_minimos_nome_codigo.md): contrato vigente para seed mínimo/sanitizado de novas contas
- [docs/contrato_funcional_regras_materiais_genericos_intervencoes.md](./contrato_funcional_regras_materiais_genericos_intervencoes.md): contrato funcional vigente para Materiais / Procedimentos Genéricos / Intervenções
- [docs/contrato_exclusao_segura_contas_clinicas.md](./contrato_exclusao_segura_contas_clinicas.md): contrato permanente de exclusão segura

## 9. Regras permanentes encontradas
Regras permanentes relevantes:
- [docs/regras_blindagem_correcoes_textuais_mojibake.md](./regras_blindagem_correcoes_textuais_mojibake.md)
- contrato de exclusão segura
- contrato de seeds míninos para novas contas
- contrato funcional de usuários/novas contas
- contrato funcional de materiais/genéricos/intervenções

### Observação
As regras de blindagem textual/mojibake devem permanecer separadas de qualquer reorganização funcional. Elas não devem ser misturadas com refatoração estrutural de módulos.

## 10. Roadmaps encontrados
Principais roadmaps e documentos de continuidade:
- [docs/11_roadmap_desenvolvimento.md](./11_roadmap_desenvolvimento.md)
- [docs/matriz_mestre_prioridade_risco_refatoracao.md](./matriz_mestre_prioridade_risco_refatoracao.md)
- [docs/recomendacao_proximo_modulo_pos_anamnese.md](./recomendacao_proximo_modulo_pos_anamnese.md)
- [docs/recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md](./recomendacao_proximo_modulo_pos_anamnese_helpers_textuais.md)
- [docs/recomendacao_proximo_modulo_pos_auxiliares.md](./recomendacao_proximo_modulo_pos_auxiliares.md)
- [docs/recomendacao_proximo_modulo_pos_intervencoes_procedimentos.md](./recomendacao_proximo_modulo_pos_intervencoes_procedimentos.md)
- [docs/recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md](./recomendacao_proximo_modulo_pos_intervencoes_reavaliado.md)
- [docs/recomendacao_proximo_modulo_pos_materiais.md](./recomendacao_proximo_modulo_pos_materiais.md)
- [docs/recomendacao_proximo_modulo_pos_prestadores.md](./recomendacao_proximo_modulo_pos_prestadores.md)
- [docs/recomendacao_proximo_modulo_pos_procedimentos_genericos.md](./recomendacao_proximo_modulo_pos_procedimentos_genericos.md)
- [docs/recomendacao_proximo_modulo_pos_simbolos_graficos.md](./recomendacao_proximo_modulo_pos_simbolos_graficos.md)
- [docs/reavaliacao_rigida_proximo_modulo_menor_risco.md](./reavaliacao_rigida_proximo_modulo_menor_risco.md)
- [docs/varredura_modulos_nao_iniciados_pos_simbolos_graficos.md](./varredura_modulos_nao_iniciados_pos_simbolos_graficos.md)
- [docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md](./varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md)
- [docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md](./varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md)

### Leitura crítica
- há muito material de continuidade/recomendação que parece útil como roadmap interno, mas parte dele já foi superada pelos commits recentes
- [docs/11_roadmap_desenvolvimento.md](./11_roadmap_desenvolvimento.md) precisa de revisão para refletir o estado pós-commit 1/2/3/4/5

## 11. Índices e inventários encontrados
Principais:
- [docs/indice_oficial_contratos_regras_vigentes.md](./indice_oficial_contratos_regras_vigentes.md)
- [docs/inventario_organizacional_contratos_regras_seeds_usuarios.md](./inventario_organizacional_contratos_regras_seeds_usuarios.md)
- [docs/indice_usuarios_access_profile_perfis_acesso.md](./indice_usuarios_access_profile_perfis_acesso.md)
- [docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md](./auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md)
- [docs/anamnese_legado_inventario_fontes_id1.txt](./anamnese_legado_inventario_fontes_id1.txt)

### Classificação
- [docs/indice_oficial_contratos_regras_vigentes.md](./indice_oficial_contratos_regras_vigentes.md): índice vigente de contratos e regras
- [docs/inventario_organizacional_contratos_regras_seeds_usuarios.md](./inventario_organizacional_contratos_regras_seeds_usuarios.md): inventário organizacional útil e provavelmente vigente
- [docs/indice_usuarios_access_profile_perfis_acesso.md](./indice_usuarios_access_profile_perfis_acesso.md): índice específico e relevante para a trilha de usuários/perfis
- [docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md](./auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md): inventário/relatório amplo, útil como apoio, mas não como contrato

## 12. Documentos por módulo

### Usuários / Login / Senha interna / Perfis
Principais:
- [docs/primeiro_acesso_senha_interna_subetapa_0_diagnostico_login.md](./primeiro_acesso_senha_interna_subetapa_0_diagnostico_login.md)
- [docs/primeiro_acesso_senha_interna_subetapa_1_correcao_separacao_login.md](./primeiro_acesso_senha_interna_subetapa_1_correcao_separacao_login.md)
- [docs/primeiro_acesso_senha_interna_subetapa_1b_correcao_regressao_login.md](./primeiro_acesso_senha_interna_subetapa_1b_correcao_regressao_login.md)
- [docs/usuarios_perfis_acesso_subetapa_0_diagnostico_ui_contas_existentes.md](./usuarios_perfis_acesso_subetapa_0_diagnostico_ui_contas_existentes.md)
- [docs/usuarios_perfis_acesso_subetapa_1_correcao_carregamento_aba_perfis.md](./usuarios_perfis_acesso_subetapa_1_correcao_carregamento_aba_perfis.md)
- [docs/usuarios_perfis_acesso_subetapa_1b_ajuste_visual_layout_easydental.md](./usuarios_perfis_acesso_subetapa_1b_ajuste_visual_layout_easydental.md)
- [docs/usuarios_perfis_acesso_subetapa_1c_validacao_manual_funcional_visual.md](./usuarios_perfis_acesso_subetapa_1c_validacao_manual_funcional_visual.md)
- [docs/usuarios_perfis_acesso_subetapa_1d_fechamento_correcao_ui.md](./usuarios_perfis_acesso_subetapa_1d_fechamento_correcao_ui.md)
- [docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md](./users_admin_diagnostico_fluxo_protegido_seed_perfis.md)
- [docs/users_admin_diagnostico_protecao_permissoes_perfis.md](./users_admin_diagnostico_protecao_permissoes_perfis.md)
- [docs/users_admin_plano_correcao_controlada_grant_perfis.md](./users_admin_plano_correcao_controlada_grant_perfis.md)
- [docs/users_admin_pos_teste_403_forbidden_diagnostico.md](./users_admin_pos_teste_403_forbidden_diagnostico.md)
- [docs/users_admin_primeira_separacao_real_execucao.md](./users_admin_primeira_separacao_real_execucao.md)
- [docs/users_admin_correcao_refresh_protected_grant.md](./users_admin_correcao_refresh_protected_grant.md)

### Seeds / Nova conta / Brana
Principais:
- [docs/intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md](./intervencoes_procedimentos_seed_brana_subetapa_0_diagnostico.md)
- [docs/intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md](./intervencoes_procedimentos_seed_brana_subetapa_1_correcao_controlada.md)
- [docs/intervencoes_procedimentos_seed_brana_subetapa_2_validacao_tecnica_sem_gravacao.md](./intervencoes_procedimentos_seed_brana_subetapa_2_validacao_tecnica_sem_gravacao.md)
- [docs/intervencoes_procedimentos_seed_brana_subetapa_3a_correcao_duplicidade_signup.md](./intervencoes_procedimentos_seed_brana_subetapa_3a_correcao_duplicidade_signup.md)
- [docs/intervencoes_procedimentos_seed_brana_subetapa_3b_limpeza_email_codes_teste_abortado.md](./intervencoes_procedimentos_seed_brana_subetapa_3b_limpeza_email_codes_teste_abortado.md)
- [docs/intervencoes_procedimentos_seed_brana_subetapa_3b_c_auditoria_pos_execucao_email_codes.md](./intervencoes_procedimentos_seed_brana_subetapa_3b_c_auditoria_pos_execucao_email_codes.md)
- [docs/intervencoes_procedimentos_seed_brana_subetapa_3d_correcao_duplicidade_codigo_1010_signup.md](./intervencoes_procedimentos_seed_brana_subetapa_3d_correcao_duplicidade_codigo_1010_signup.md)
- [docs/intervencoes_procedimentos_seed_brana_subetapa_3e_diagnostico_pos_teste_manual.md](./intervencoes_procedimentos_seed_brana_subetapa_3e_diagnostico_pos_teste_manual.md)
- [docs/intervencoes_procedimentos_seed_brana_subetapa_3f_correcao_roteamento_brana.md](./intervencoes_procedimentos_seed_brana_subetapa_3f_correcao_roteamento_brana.md)
- [docs/intervencoes_procedimentos_seed_brana_subetapa_3g_contrato_seed_canonico_brana.md](./intervencoes_procedimentos_seed_brana_subetapa_3g_contrato_seed_canonico_brana.md)
- [docs/intervencoes_procedimentos_seed_brana_subetapa_3h_seed_canonico_brana_336.md](./intervencoes_procedimentos_seed_brana_subetapa_3h_seed_canonico_brana_336.md)
- [docs/intervencoes_procedimentos_seed_brana_subetapa_3i_signup_consumindo_seed_canonico_brana.md](./intervencoes_procedimentos_seed_brana_subetapa_3i_signup_consumindo_seed_canonico_brana.md)
- [docs/validacao_manual_final_signup_brana_pos_correcoes.md](./validacao_manual_final_signup_brana_pos_correcoes.md)

### Materiais / Procedimentos Genéricos / Intervenções
Principais:
- [docs/contrato_funcional_regras_materiais_genericos_intervencoes.md](./contrato_funcional_regras_materiais_genericos_intervencoes.md)
- [docs/consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md](./consolidacao_validacao_manual_regras_materiais_genericos_intervencoes.md)
- [docs/auditoria_origem_lista_materiais_troca_generico_intervencoes.md](./auditoria_origem_lista_materiais_troca_generico_intervencoes.md)
- [docs/auditoria_regra_heranca_materiais_generico_para_procedimento.md](./auditoria_regra_heranca_materiais_generico_para_procedimento.md)
- [docs/decisao_tecnica_saneamento_vinculos_legados_materiais.md](./decisao_tecnica_saneamento_vinculos_legados_materiais.md)
- [docs/retomada_modularizacao_materiais_pos_consolidacao_vinculos.md](./retomada_modularizacao_materiais_pos_consolidacao_vinculos.md)
- [docs/refatoracao_backend_subetapa_1_service_vinculos_materiais.md](./refatoracao_backend_subetapa_1_service_vinculos_materiais.md)
- [docs/refatoracao_frontend_subetapa_2_consumo_origem_materiais.md](./refatoracao_frontend_subetapa_2_consumo_origem_materiais.md)
- [docs/refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md](./refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md)
- [docs/relatorio_procedimentos_generico_nulo_com_materiais_vinculados.md](./relatorio_procedimentos_generico_nulo_com_materiais_vinculados.md)
- [docs/registro_pendente_heranca_materiais_procedimento_generico_para_procedimento.md](./registro_pendente_heranca_materiais_procedimento_generico_para_procedimento.md)

### Exclusão segura
Principais:
- [docs/contrato_exclusao_segura_contas_clinicas.md](./contrato_exclusao_segura_contas_clinicas.md)
- [docs/clinica_8_exclusao_segura_etapa_1_diagnostico_somente_leitura.md](./clinica_8_exclusao_segura_etapa_1_diagnostico_somente_leitura.md)
- [docs/clinica_8_exclusao_segura_etapa_2_plano_documental.md](./clinica_8_exclusao_segura_etapa_2_plano_documental.md)
- [docs/clinica_8_exclusao_segura_etapa_3_runner_controlado_sem_execucao.md](./clinica_8_exclusao_segura_etapa_3_runner_controlado_sem_execucao.md)
- [docs/clinica_8_exclusao_segura_etapa_4_dry_run_runner.md](./clinica_8_exclusao_segura_etapa_4_dry_run_runner.md)
- [docs/clinica_8_exclusao_segura_etapa_5_backup_pre_exclusao.md](./clinica_8_exclusao_segura_etapa_5_backup_pre_exclusao.md)
- [docs/clinica_8_exclusao_segura_etapa_8_execucao_real_controlada.md](./clinica_8_exclusao_segura_etapa_8_execucao_real_controlada.md)
- [docs/clinica_8_exclusao_segura_etapa_9_validacao_novo_cadastro_limpo.md](./clinica_8_exclusao_segura_etapa_9_validacao_novo_cadastro_limpo.md)
- [docs/clinica_9_exclusao_segura_etapa_1_diagnostico_somente_leitura.md](./clinica_9_exclusao_segura_etapa_1_diagnostico_somente_leitura.md)
- [docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md](./clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md)
- [docs/clinica_9_exclusao_segura_etapa_3_execucao_real_controlada.md](./clinica_9_exclusao_segura_etapa_3_execucao_real_controlada.md)
- [docs/clinica_10_exclusao_segura_etapa_1_diagnostico_somente_leitura.md](./clinica_10_exclusao_segura_etapa_1_diagnostico_somente_leitura.md)
- [docs/clinica_10_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md](./clinica_10_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md)
- [docs/clinica_10_exclusao_segura_etapa_3_execucao_real_controlada.md](./clinica_10_exclusao_segura_etapa_3_execucao_real_controlada.md)
- [docs/clinica_15_exclusao_segura_etapa_1_diagnostico_somente_leitura.md](./clinica_15_exclusao_segura_etapa_1_diagnostico_somente_leitura.md)
- [docs/clinica_15_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md](./clinica_15_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md)
- [docs/clinica_15_exclusao_segura_etapa_3_execucao_real_controlada.md](./clinica_15_exclusao_segura_etapa_3_execucao_real_controlada.md)

### Anamnese / SQLServer / restauração
Principais:
- [docs/anamnese_*.md](./)
- [docs/anamnese_*.txt](./)
- [docs/anamnese_*.csv](./)
- [docs/anamnese_*.json](./)
- [docs/sqlserver_anamnese_descoberta_eds70.sql](./sqlserver_anamnese_descoberta_eds70.sql)
- [docs/sqlserver_restore_eds70_anamnese_readonly.sql](./sqlserver_restore_eds70_anamnese_readonly.sql)
- [docs/restauracao_pre_anamnese.md](./restauracao_pre_anamnese.md)
- [docs/plano_isolamento_pendencias_anamnese_restauracao.md](./plano_isolamento_pendencias_anamnese_restauracao.md)
- [docs/revisao_humana_md_anamnese_pendentes.md](./revisao_humana_md_anamnese_pendentes.md)

## 13. Classificação por categoria documental

### 13.1 Fonte de verdade vigente
- [docs/00_master_guide.md](./00_master_guide.md)
- [docs/indice_oficial_contratos_regras_vigentes.md](./indice_oficial_contratos_regras_vigentes.md)
- [docs/contrato_funcional_usuarios_novas_contas.md](./contrato_funcional_usuarios_novas_contas.md)
- [docs/contrato_seeds_novas_contas_minimos_nome_codigo.md](./contrato_seeds_novas_contas_minimos_nome_codigo.md)
- [docs/contrato_funcional_regras_materiais_genericos_intervencoes.md](./contrato_funcional_regras_materiais_genericos_intervencoes.md)
- [docs/contrato_exclusao_segura_contas_clinicas.md](./contrato_exclusao_segura_contas_clinicas.md)
- [docs/regras_blindagem_correcoes_textuais_mojibake.md](./regras_blindagem_correcoes_textuais_mojibake.md)

### 13.2 Contrato funcional vigente
- contratos listados acima
- [docs/pre_contrato_funcional_usuarios_novas_contas.md](./pre_contrato_funcional_usuarios_novas_contas.md) como apoio histórico, mas não como fonte final

### 13.3 Regra permanente
- blindagem textual/mojibake
- exclusão segura
- seed mínimo e seed canônico da Brana

### 13.4 Guia operacional
- [README.md](../README.md)
- [README_WEB.md](../README_WEB.md)
- [local_bridge/README.md](../local_bridge/README.md)
- [docs/08_setup_execucao.md](./08_setup_execucao.md)
- [docs/07_fluxos.md](./07_fluxos.md)
- [docs/10_continuidade.md](./10_continuidade.md)

### 13.5 Roadmap
- [docs/11_roadmap_desenvolvimento.md](./11_roadmap_desenvolvimento.md)
- [docs/matriz_mestre_prioridade_risco_refatoracao.md](./matriz_mestre_prioridade_risco_refatoracao.md)
- documentos `recomendacao_proximo_modulo_pos_*.md`
- documentos `varredura_modulos_*.md`
- documentos `reavaliacao_*.md`

### 13.6 Inventário/índice
- [docs/indice_oficial_contratos_regras_vigentes.md](./indice_oficial_contratos_regras_vigentes.md)
- [docs/inventario_organizacional_contratos_regras_seeds_usuarios.md](./inventario_organizacional_contratos_regras_seeds_usuarios.md)
- [docs/indice_usuarios_access_profile_perfis_acesso.md](./indice_usuarios_access_profile_perfis_acesso.md)

### 13.7 Auditoria/diagnóstico
- trilhas `access_profile_*`
- trilhas `primeiro_acesso_senha_interna_*`
- trilhas `usuarios_perfis_acesso_*`
- trilhas `users_admin_*`
- trilhas `intervencoes_procedimentos_seed_brana_*`
- trilhas `auditoria_*`
- trilhas de módulos como `materiais_*`, `procedimentos_genericos_*`, `prestadores_*`, `simbolos_graficos_*`, `unidades_*`, `etiquetas_*`, `convenios_planos_*`, `cid_*`, `auxiliares_*`, `medicamentos_*`

### 13.8 Plano de execução
- documentos com nomes `plano_`, `roteiro_`, `estrategia_`, `subetapa_0`, `subetapa_1`, `subetapa_2`, etc., quando ainda não encerrados por validação final

### 13.9 Execução/correção
- documentos com `correcao`, `execucao`, `runner`, `dry_run`, `backup`

### 13.10 Validação/fechamento
- [docs/validacao_manual_final_signup_brana_pos_correcoes.md](./validacao_manual_final_signup_brana_pos_correcoes.md)
- documentos `fechamento`, `encerramento`, `validacao`, `final`

### 13.11 Histórico/legado
- [docs/_historico_auditoria/*](./_historico_auditoria/)
- documentos `anamnese_*`
- documentos `sqlserver_*`
- documentos `restauracao_*`
- [docs/plano_isolamento_pendencias_anamnese_restauracao.md](./plano_isolamento_pendencias_anamnese_restauracao.md)
- [docs/revisao_humana_md_anamnese_pendentes.md](./revisao_humana_md_anamnese_pendentes.md)
- [backend/README.md](../backend/README.md)

### 13.12 Obsoleto ou possivelmente desatualizado
- [README.md](../README.md) por nomenclatura e textos antigos
- [README_WEB.md](../README_WEB.md) por estrutura possivelmente anterior
- [backend/README.md](../backend/README.md) por mojibake e linguagem histórica
- [docs/11_roadmap_desenvolvimento.md](./11_roadmap_desenvolvimento.md) por provável defasagem frente aos commits recentes
- [docs/pre_contrato_funcional_usuarios_novas_contas.md](./pre_contrato_funcional_usuarios_novas_contas.md) por ter sido superado pelo contrato definitivo

### 13.13 Pendente de consolidação
- roadmap documental único e atualizado
- índice mestre com separação clara entre vigente, histórico e legados
- consolidação dos documentos de seed/Brana e de usuários/perfis
- consolidação dos documentos de Materiais / Procedimentos Genéricos / Intervenções
- consolidação da trilha de exclusão segura em um índice operacional mais claro

## 14. Documentos que parecem fonte de verdade hoje
Os mais fortes como referência atual são:
- [docs/00_master_guide.md](./00_master_guide.md)
- [docs/indice_oficial_contratos_regras_vigentes.md](./indice_oficial_contratos_regras_vigentes.md)
- [docs/contrato_funcional_usuarios_novas_contas.md](./contrato_funcional_usuarios_novas_contas.md)
- [docs/contrato_seeds_novas_contas_minimos_nome_codigo.md](./contrato_seeds_novas_contas_minimos_nome_codigo.md)
- [docs/contrato_funcional_regras_materiais_genericos_intervencoes.md](./contrato_funcional_regras_materiais_genericos_intervencoes.md)
- [docs/contrato_exclusao_segura_contas_clinicas.md](./contrato_exclusao_segura_contas_clinicas.md)
- [docs/regras_blindagem_correcoes_textuais_mojibake.md](./regras_blindagem_correcoes_textuais_mojibake.md)
- [docs/validacao_manual_final_signup_brana_pos_correcoes.md](./validacao_manual_final_signup_brana_pos_correcoes.md) como fechamento manual final

## 15. Documentos que parecem históricos
- [docs/_historico_auditoria/*](./_historico_auditoria/)
- [backend/README.md](../backend/README.md)
- docs de anamnese / SQLServer / restauração
- [docs/pre_contrato_funcional_usuarios_novas_contas.md](./pre_contrato_funcional_usuarios_novas_contas.md)
- docs de roadmap e recomendação mais antigos quando contradizem o estado pós-commit 5c8ef7a/8c1f7c5/cb20715/9c4df78/680749d

## 16. Documentos possivelmente desatualizados
- [README.md](../README.md)
- [README_WEB.md](../README_WEB.md)
- [backend/README.md](../backend/README.md)
- [docs/11_roadmap_desenvolvimento.md](./11_roadmap_desenvolvimento.md)
- [docs/pre_contrato_funcional_usuarios_novas_contas.md](./pre_contrato_funcional_usuarios_novas_contas.md)
- alguns roadmaps/recomendações de módulos que ainda não refletem o estado atual pós-correções

## 17. Conflitos encontrados
1. `PARTICULAR` aparece em documentos antigos e históricos, mas a trilha recente consolidou `Brana` como seed esperado para novas contas.
2. Há um volume muito grande de roadmaps paralelos e recomendações por módulo, o que dificulta descobrir qual é o documento mais recente.
3. `README.md`, `README_WEB.md` e `backend/README.md` não estão uniformes entre si e usam linguagens/nomenclaturas diferentes.
4. `docs/11_roadmap_desenvolvimento.md` parece subatualizado diante das decisões e commits mais recentes.
5. Anamnese / SQLServer / restauração formam uma trilha separada e podem contaminar a leitura da documentação principal se não forem isolados.

## 18. Lacunas documentais
- falta um roadmap documental único e moderno
- falta um índice mestre que diferencie explicitamente vigente, histórico, legado e trilhas concluídas
- falta uma visão consolidada da trilha Brana / seed canônico / validação manual final em um documento síntese
- falta um guia curto de onboarding documental para quem chega agora ao repositório

## 19. Proposta de nova estrutura documental
Sem mover nada agora, a estrutura futura sugerida é:

```text
docs/
  00_master_guide.md
  01_visao_produto.md
  02_arquitetura.md
  03_mapa_codigo.md
  04_funcionalidades.md
  05_banco_dados.md
  06_seguranca.md
  07_fluxos.md
  08_setup_execucao.md
  09_problemas_e_riscos.md
  10_continuidade.md
  11_roadmap_desenvolvimento.md
  contratos/
  roadmaps/
  modulos/
  auditorias/
  validacoes/
  historico/
  legados/
```

Observação: isso é apenas proposta de organização futura; nesta etapa nada deve ser movido.

## 20. Proposta de novo roadmap documental
Roadmap documental sugerido:
1. consolidar o índice oficial de contratos e regras vigentes;
2. consolidar o conjunto de contratos funcionais definitivos;
3. consolidar a trilha Brana / seed canônico / novas contas;
4. consolidar a trilha usuários / login / senha interna / perfis;
5. consolidar a trilha Materiais / Procedimentos Genéricos / Intervenções;
6. consolidar a trilha exclusão segura em um índice operacional único;
7. separar claramente histórico/legado de documento vigente;
8. revisar README e roadmap geral para refletir o estado atual.

## 21. Recomendações de próxima etapa
- criar uma síntese documental oficial com os contratos vigentes e os documentos fonte de verdade
- revisar `README.md`, `README_WEB.md` e `docs/11_roadmap_desenvolvimento.md` em etapa própria, sem misturar com código
- atualizar o índice oficial com a separação entre vigente, histórico e legado
- isolar a trilha anamnese / SQLServer / restauração como legado explícito

## 22. Confirmações finais
- nenhum código foi alterado nesta etapa;
- nenhum documento existente foi alterado;
- nenhum arquivo foi movido, renomeado ou apagado;
- nenhum banco foi alterado;
- não houve `git add`, `git commit`, `git push`, `git reset`, `git restore` ou `git clean`.

## 23. GitHub/remoto identificado
- remote configurado: `origin` -> `https://github.com/institutobrana/branacloud.git`
- branch local rastreada: `origin/modularizacao-segura-fase-1`
- `git ls-remote --heads origin` nao concluiu neste ambiente por falha de conexao com `github.com`
- portanto, os heads remotos nao puderam ser revalidados em tempo real daqui

## 24. Metodologia de busca no Google Drive sincronizado
- foi verificada a arvore local em busca de sinais de sincronizacao de Drive
- nao foi identificado um espelho humano-legivel separado do projeto no Drive dentro do ambiente acessivel
- foram encontrados apenas diretorios temporarios do proprio projeto com nome de staging de Drive:
  - `.tmp.driveupload` com 2190 arquivos
  - `.tmp.drivedownload` com 0 arquivos
- esses diretorios parecem artefatos tecnicos de upload/download, nao uma biblioteca documental consolidada

## 25. Documentos encontrados no Drive e nao versionados
- nao foram localizados documentos legiveis em uma arvore separada de Drive que fossem claramente fora do Git local
- os artefatos `.tmp.driveupload` foram considerados staging tecnico e nao foram tratados como docs de verdade

## 26. Documentos versionados e nao encontrados fora do projeto
- nenhum documento versionado com relevancia documental foi identificado em uma arvore externa claramente separada do projeto
- a validacao de Drive ficou restrita aos rastros locais encontrados no proprio ambiente
