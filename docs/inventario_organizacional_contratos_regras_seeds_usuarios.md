# Inventário organizacional de contratos, regras, seeds e usuários — Brana Cloud

## 1. Contexto
- O projeto acumula documentos normativos, auditorias, planos, execuções e fechamentos ao longo de várias fases.
- Antes de retomar a UI de "Perfis de acesso", o objetivo aqui foi localizar as fontes de verdade, separar contratos vigentes de material de apoio e identificar o que pode ser consolidado no futuro.
- Esta etapa é somente organizacional: inventário, classificação e proposta de padronização futura.

## 2. Escopo
- Somente inventário documental.
- Sem alteração de código.
- Sem alteração de banco.
- Sem renomear arquivos.
- Sem mover documentos.
- Sem excluir documentos.
- Sem signup.
- Sem seeds.
- Sem UI.

## 3. Metodologia
Comandos usados, sempre em leitura:
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -30`
- `Get-ChildItem docs -Recurse -File`
- `Get-ChildItem docs -Recurse -File | Where-Object { $_.Name -match "..." }`
- `Select-String -Path docs\*.md -Pattern ...`
- `Get-ChildItem backend -Recurse -File | Where-Object { $_.Name -match "seed|seeds|access|profile|signup|user|usuario|auth|clinic|clinica|bootstrap|runner" }`
- `Get-ChildItem frontend -Recurse -File | Where-Object { $_.Name -match "user|usuario|usuarios|perfil|perfis|access|admin|modal" }`
- `Get-ChildItem docs\_historico_auditoria -Recurse -File`
- `Get-Content` nos documentos-base e nos documentos âncora de contratos, segurança, fluxo, banco e access_profile.

Termos pesquisados:
- `contrato`, `regra`, `regras`, `blindagem`, `seed`, `seeds`, `signup`, `nova clínica`, `nova clinica`, `access_profile`, `usuario_perfil_acesso`, `bootstrap`, `dry-run`, `dry run`, `runner`, `modularização`, `modularizacao`, `refatoração`, `refatoracao`, `blindagem`, `mojibake`, `exclusão segura`, `exclusao segura`, `pastas proibidas`, `git add`, `commit`, `push`.

Limitações do levantamento:
- O recorte principal foi organizado por palavras-chave e por trilhas com títulos claramente normativos.
- Documentos adjacentes de anamnese e importação histórica foram tratados como apoio/legado e não entraram no inventário principal, para manter o foco no problema solicitado.
- Não houve tentativa de validar comportamento funcional, apenas de classificar documentos e mapear referências de código.

## 4. Resumo executivo
- Quantidade de documentos relevantes no recorte deste inventário: **139**.
- Desse total:
  - 11 guias/documentos-base permanentes;
  - 113 documentos do recorte principal por palavras-chave;
  - 15 documentos históricos em `docs/_historico_auditoria/`.
- Conclusão curta: a trilha mais importante para o usuário está em `contrato_funcional_usuarios_novas_contas.md`, `contrato_seeds_novas_contas_minimos_nome_codigo.md`, `plano_tecnico_access_profile_perfis_acesso_usuarios.md`, `regras_blindagem_correcoes_textuais_mojibake.md`, `contrato_exclusao_segura_contas_clinicas.md`, `users_admin_*`, `access_profile_*`, `clinica_8_*`, `clinica_9_*` e nos guias-base do projeto.

## 5. Lista completa dos documentos encontrados

### 5.1 Documentos-base permanentes e de fonte de verdade geral
- `docs/00_master_guide.md` | assunto: ponto de entrada oficial do projeto; grupo: contratos e regras permanentes; tipo: regra/guia; status: vigente; relação: contexto geral, onboarding, onde mexer e onde não mexer.
- `docs/01_visao_produto.md` | assunto: visão de produto; grupo: contratos e regras permanentes; tipo: apoio; status: vigente; relação: contexto geral de produto.
- `docs/02_arquitetura.md` | assunto: arquitetura do monólito web; grupo: contratos e regras permanentes; tipo: apoio; status: vigente; relação: contexto geral, banco, frontend, backend, segurança.
- `docs/03_mapa_codigo.md` | assunto: mapa de código e pontos sensíveis; grupo: contratos e regras permanentes; tipo: apoio; status: vigente; relação: referência para users, signup, access_profile, frontend e segurança.
- `docs/04_funcionalidades.md` | assunto: inventário funcional dos módulos; grupo: contratos e regras permanentes; tipo: apoio; status: vigente; relação: usuários, perfis, permissões, signup, licenças e fluxo geral.
- `docs/05_banco_dados.md` | assunto: modelo e regras de banco; grupo: contratos e regras permanentes; tipo: apoio; status: vigente; relação: usuários, access_profile, clinicas e multi-tenant.
- `docs/06_seguranca.md` | assunto: segurança, JWT, multi-tenant e arquivos sensíveis; grupo: contratos e regras permanentes; tipo: regra; status: vigente; relação: validação, isolamento por clínica, regras de não versionar dados.
- `docs/07_fluxos.md` | assunto: fluxos de login, `/me`, cadastro e uso autenticado; grupo: contratos e regras permanentes; tipo: apoio; status: vigente; relação: signup, users, auth, frontend e tenant.
- `docs/08_setup_execucao.md` | assunto: setup local e execução; grupo: contratos e regras permanentes; tipo: apoio; status: vigente; relação: bootstrap local, variáveis de ambiente, checks mínimos.
- `docs/09_problemas_e_riscos.md` | assunto: riscos estruturais do projeto; grupo: contratos e regras permanentes; tipo: regra/apoio; status: vigente; relação: risco de refatoração, tenant, banco, frontend monolítico.
- `docs/10_continuidade.md` | assunto: continuidade operacional e regras para novos devs; grupo: contratos e regras permanentes; tipo: regra; status: vigente; relação: ordem de leitura, pontos sensíveis e checklist de alteração.
- `docs/11_roadmap_desenvolvimento.md` | assunto: roadmap operacional por módulo; grupo: contratos e regras permanentes; tipo: apoio; status: vigente; relação: status de módulos, próximos passos e dependências.

### 5.2 Contratos e regras permanentes
- `docs/regras_blindagem_correcoes_textuais_mojibake.md` | assunto: blindagem textual, mojibake e correções visuais; grupo: contratos e regras permanentes; tipo: regra; status: vigente; relação: proíbe correção textual sem auditoria, protege UI e strings.
- `docs/contrato_funcional_usuarios_novas_contas.md` | assunto: contrato funcional definitivo do módulo Usuários para novas contas; grupo: usuários/access_profile/perfis de acesso; tipo: contrato; status: vigente; relação: signup, nascimento de nova clínica, primeiro usuário, senha protegida, acesso e perfis.
- `docs/pre_contrato_funcional_usuarios_novas_contas.md` | assunto: rascunho/precursor do contrato funcional de usuários; grupo: usuários/access_profile/perfis de acesso; tipo: histórico/apoio; status: parcial; relação: antecessor do contrato definitivo.
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md` | assunto: seeds mínimos para novas contas; grupo: seeds e nascimento de nova clínica; tipo: contrato; status: vigente; relação: seeds, signup, nova clínica, sanitização de dados.
- `docs/contrato_exclusao_segura_contas_clinicas.md` | assunto: exclusão segura de contas e clínicas; grupo: exclusões seguras; tipo: contrato; status: vigente; relação: runner, dry-run, backup, validação, proibição de DELETE manual.
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md` | assunto: regras funcionais dos módulos materiais/genericos/intervenções; grupo: modularização/refatoração segura geral; tipo: contrato; status: vigente; relação: fonte de verdade funcional de outro eixo do sistema.
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md` | assunto: plano técnico de `access_profile` e aba Perfis de acesso; grupo: usuários/access_profile/perfis de acesso; tipo: plano; status: apoio; relação: base da UI, bootstrap, clínicas existentes, signup e futura consolidação.

### 5.3 Seeds e nascimento de nova clínica
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md` | assunto: seeds mínimos; grupo: seeds e nascimento de nova clínica; tipo: contrato; status: vigente; relação: regras oficiais para nascimento sanitizado.
- `docs/seeds_procedimentos_e_genericos_nao_sobrescrever_existentes.md` | assunto: não sobrescrever dados existentes; grupo: seeds e nascimento de nova clínica; tipo: regra; status: vigente; relação: proteção de seeds e de clínicas já existentes.
- `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md` | assunto: sanitização de procedimentos; grupo: seeds e nascimento de nova clínica; tipo: execução/plano; status: parcial; relação: seed de procedimentos e nova clínica.
- `docs/seeds_procedimentos_genericos_subetapa_3a_planejamento_sanitizacao_nome_codigo.md` | assunto: planejamento de sanitização de procedimentos genéricos; grupo: seeds e nascimento de nova clínica; tipo: plano; status: parcial; relação: seed, nova conta, redução de dados sensíveis.
- `docs/seeds_procedimentos_genericos_subetapa_3a_sanitizacao_nome_codigo.md` | assunto: sanitização de procedimentos genéricos; grupo: seeds e nascimento de nova clínica; tipo: execução; status: parcial; relação: seed de nascimento.
- `docs/seeds_materiais_subetapa_2a_planejamento_sanitizacao_nome_codigo.md` | assunto: planejamento para materiais; grupo: seeds e nascimento de nova clínica; tipo: plano; status: parcial; relação: seed de materiais em novas contas.
- `docs/seeds_materiais_subetapa_2a_sanitizacao_nome_codigo.md` | assunto: sanitização de materiais; grupo: seeds e nascimento de nova clínica; tipo: execução; status: parcial; relação: seed de materiais em novas contas.
- `docs/seeds_particular_zerar_valores_financeiros_novas_contas.md` | assunto: zerar valores financeiros da tabela PARTICULAR; grupo: seeds e nascimento de nova clínica; tipo: regra/execução; status: vigente; relação: nascimento de nova clínica e proteção financeira.
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md` | assunto: auditoria de seeds novas contas para procedimentos e materiais; grupo: seeds e nascimento de nova clínica; tipo: diagnóstico; status: apoio; relação: origem documental do contrato de seeds.
- `docs/anamnese_seed_obrigatorio_plano.md` | assunto: plano de seed obrigatório de anamnese; grupo: seeds e nascimento de nova clínica; tipo: plano; status: apoio; relação: seeds adjacentes, legado e validação de carga inicial.
- `docs/anamnese_seed_obrigatorio_implementacao_resultado.md` | assunto: resultado da implementação do seed obrigatório; grupo: seeds e nascimento de nova clínica; tipo: validação; status: apoio/histórico; relação: execução real ou validação de seed.
- `docs/anamnese_seed_obrigatorio_dry_run_resultado.txt` | assunto: dry-run do seed obrigatório; grupo: seeds e nascimento de nova clínica; tipo: validação; status: apoio/histórico; relação: checagem sem alterar banco.
- `docs/anamnese_seed_obrigatorio_plano_por_clinica.json` | assunto: plano por clínica do seed obrigatório; grupo: seeds e nascimento de nova clínica; tipo: apoio; status: apoio/histórico; relação: execução por clínica.
- `docs/anamnese_seed_auditoria_clinicas_existentes.csv` | assunto: auditoria de clínicas existentes para seed; grupo: seeds e nascimento de nova clínica; tipo: apoio; status: apoio/histórico; relação: backfill e validação.
- `docs/anamnese_seed_auditoria_clinicas_pos_backfill.csv` | assunto: auditoria pós-backfill; grupo: seeds e nascimento de nova clínica; tipo: validação; status: apoio/histórico; relação: conferência pós-aplicação.
- `docs/anamnese_seed_candidato_perguntas.csv` | assunto: candidatos de perguntas; grupo: seeds e nascimento de nova clínica; tipo: apoio; status: apoio/histórico; relação: insumo documental para importação.
- `docs/anamnese_seed_candidato_questionarios.csv` | assunto: candidatos de questionários; grupo: seeds e nascimento de nova clínica; tipo: apoio; status: apoio/histórico; relação: insumo documental para importação.
- `docs/anamnese_recuperacao_eds70_seed_obrigatorio_consolidacao.md` | assunto: consolidação de recuperação de seed obrigatório; grupo: seeds e nascimento de nova clínica; tipo: fechamento; status: apoio/histórico; relação: recuperação e consolidação.

### 5.4 Usuários / access_profile / perfis de acesso
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md` | assunto: plano técnico de perfis de acesso; grupo: usuários/access_profile/perfis de acesso; tipo: plano; status: apoio; relação: fonte documental da UI e bootstrap.
- `docs/access_profile_subetapa_1_fonte_versionada_passiva.md` | assunto: fonte versionada passiva de perfis; grupo: usuários/access_profile/perfis de acesso; tipo: diagnóstico/plano; status: parcial; relação: bootstrap idempotente e fonte oficial.
- `docs/access_profile_subetapa_2_bootstrap_idempotente_controlado.md` | assunto: bootstrap idempotente e controlado; grupo: usuários/access_profile/perfis de acesso; tipo: plano; status: parcial; relação: novas clínicas, access_profile e fonte versionada.
- `docs/access_profile_subetapa_3a_dry_run_controlado.md` | assunto: dry-run de perfis; grupo: usuários/access_profile/perfis de acesso; tipo: validação; status: parcial; relação: clínicas novas e existentes.
- `docs/access_profile_subetapa_3b_execucao_dry_run_somente_leitura.md` | assunto: execução somente leitura do dry-run; grupo: usuários/access_profile/perfis de acesso; tipo: validação; status: parcial; relação: conferência antes de materializar perfis.
- `docs/access_profile_subetapa_4_acoplamento_signup_novas_clinicas.md` | assunto: acoplamento ao signup; grupo: usuários/access_profile/perfis de acesso; tipo: plano; status: parcial; relação: nascimento de clínica, signup e bootstrap.
- `docs/access_profile_subetapa_4a_validacao_signup_sem_sujar_banco.md` | assunto: validação de signup sem sujar banco; grupo: usuários/access_profile/perfis de acesso; tipo: validação; status: parcial; relação: signup e teste seguro.
- `docs/access_profile_subetapa_5a_preparar_ambiente_teste_signup.md` | assunto: preparação de ambiente de teste; grupo: usuários/access_profile/perfis de acesso; tipo: plano; status: parcial; relação: signup isolado.
- `docs/access_profile_subetapa_5b_roteiro_operacional_banco_teste.md` | assunto: roteiro operacional de banco teste; grupo: usuários/access_profile/perfis de acesso; tipo: plano; status: parcial; relação: validação segura.
- `docs/access_profile_subetapa_5c_banco_teste_isolado_preparado.md` | assunto: banco de teste isolado preparado; grupo: usuários/access_profile/perfis de acesso; tipo: validação; status: parcial; relação: signup e access_profile.
- `docs/access_profile_subetapa_5d_signup_real_banco_isolado.md` | assunto: signup real em banco isolado; grupo: usuários/access_profile/perfis de acesso; tipo: execução; status: parcial; relação: nascimento controlado de clínica.
- `docs/access_profile_subetapa_5e_diagnostico_signup_sem_access_profile.md` | assunto: diagnóstico de signup sem access_profile; grupo: usuários/access_profile/perfis de acesso; tipo: diagnóstico; status: parcial; relação: falha/ausência de base funcional.
- `docs/access_profile_subetapa_5f_corrige_bootstrap_materializacao.md` | assunto: correção de bootstrap/materialização; grupo: usuários/access_profile/perfis de acesso; tipo: execução/correção; status: parcial; relação: novas clínicas e materialização.
- `docs/access_profile_subetapa_5g_signup_real_apos_correcao_bootstrap.md` | assunto: signup real após correção; grupo: usuários/access_profile/perfis de acesso; tipo: validação; status: parcial; relação: confirmação do fluxo.
- `docs/access_profile_subetapa_6a_consolidacao_trilha_validada.md` | assunto: consolidação da trilha validada; grupo: usuários/access_profile/perfis de acesso; tipo: fechamento; status: apoio; relação: caminho validado de signup e perfis.
- `docs/access_profile_subetapa_6b_estrategia_clinicas_existentes.md` | assunto: estratégia para clínicas existentes; grupo: usuários/access_profile/perfis de acesso; tipo: plano; status: apoio; relação: retrofit de base já criada.
- `docs/access_profile_subetapa_6c_dry_run_atualizado_clinicas_existentes.md` | assunto: dry-run atualizado; grupo: usuários/access_profile/perfis de acesso; tipo: validação; status: apoio; relação: clínicas existentes.
- `docs/access_profile_subetapa_6d_decisao_plano_correcao_clinicas_existentes.md` | assunto: decisão do plano de correção; grupo: usuários/access_profile/perfis de acesso; tipo: decisão; status: apoio; relação: clínicas existentes.
- `docs/access_profile_subetapa_6e_runner_controlado_clinicas_existentes.md` | assunto: runner controlado para clínicas existentes; grupo: usuários/access_profile/perfis de acesso; tipo: execução; status: apoio; relação: correção controlada.
- `docs/access_profile_subetapa_6f_execucao_runner_clinica_1.md` | assunto: execução do runner na clínica 1; grupo: usuários/access_profile/perfis de acesso; tipo: execução; status: apoio; relação: clínica 1.
- `docs/access_profile_subetapa_6g_validacao_pos_correcao_clinica_1.md` | assunto: validação pós-correção da clínica 1; grupo: usuários/access_profile/perfis de acesso; tipo: validação; status: apoio; relação: clínica 1.
- `docs/access_profile_subetapa_6h_decisao_demais_clinicas_existentes.md` | assunto: decisão para demais clínicas existentes; grupo: usuários/access_profile/perfis de acesso; tipo: decisão; status: apoio; relação: retrofitting de clínicas.
- `docs/access_profile_subetapa_6i_execucao_runner_clinica_4.md` | assunto: runner na clínica 4; grupo: usuários/access_profile/perfis de acesso; tipo: execução; status: apoio; relação: clínica 4.
- `docs/access_profile_subetapa_6j_validacao_pos_correcao_clinica_4.md` | assunto: validação pós-correção da clínica 4; grupo: usuários/access_profile/perfis de acesso; tipo: validação; status: apoio; relação: clínica 4.
- `docs/access_profile_subetapa_6k_decisao_tratamento_clinica_8.md` | assunto: decisão para clínica 8; grupo: usuários/access_profile/perfis de acesso; tipo: decisão; status: apoio; relação: tratamento da clínica 8.
- `docs/access_profile_subetapa_6l_execucao_runner_clinica_8.md` | assunto: execução na clínica 8; grupo: usuários/access_profile/perfis de acesso; tipo: execução; status: apoio; relação: clínica 8.
- `docs/access_profile_subetapa_6m_diagnostico_residual_clinica_8.md` | assunto: diagnóstico residual da clínica 8; grupo: usuários/access_profile/perfis de acesso; tipo: diagnóstico; status: apoio; relação: resíduo após correção.
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md` | assunto: diagnóstico de fluxo protegido de seed/perfis; grupo: usuários/access_profile/perfis de acesso; tipo: diagnóstico; status: apoio; relação: seed de perfis, grant e proteção.
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md` | assunto: proteção de permissões/perfis; grupo: usuários/access_profile/perfis de acesso; tipo: diagnóstico; status: apoio; relação: permissões, perfis e cadastro de usuários.
- `docs/users_admin_correcao_refresh_protected_grant.md` | assunto: correção do refresh protected grant; grupo: usuários/access_profile/perfis de acesso; tipo: correção; status: apoio; relação: aba usuários, permissões e refresh protegido.
- `docs/users_admin_plano_correcao_controlada_grant_perfis.md` | assunto: plano de correção controlada de grant/perfis; grupo: usuários/access_profile/perfis de acesso; tipo: plano; status: apoio; relação: grant temporário, permissões e perfis.
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md` | assunto: diagnóstico pós-teste 403; grupo: usuários/access_profile/perfis de acesso; tipo: diagnóstico; status: apoio; relação: proteção de acesso e erros esperados.
- `docs/users_admin_primeira_separacao_real_execucao.md` | assunto: primeira separação real do modal visual de usuários; grupo: usuários/access_profile/perfis de acesso; tipo: execução; status: apoio; relação: frontend, modal de usuários e separação visual.
- `docs/sintese_primeira_separacao_real_usuarios_admin.md` | assunto: síntese da primeira separação real; grupo: usuários/access_profile/perfis de acesso; tipo: fechamento; status: apoio; relação: documentação final da separação do modal.
- `docs/auditoria_fechamento_easydental_brana_contrato_usuarios.md` | assunto: fechamento da auditoria EasyDental/Brana do contrato de usuários; grupo: usuários/access_profile/perfis de acesso; tipo: fechamento; status: apoio; relação: origem contratual do módulo usuários.
- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md` | assunto: auditoria complementar de permissões/licença; grupo: usuários/access_profile/perfis de acesso; tipo: diagnóstico; status: apoio; relação: usuários, licença e permissões.
- `docs/auditoria_fluxo_primeiro_acesso_novas_clinicas.md` | assunto: fluxo de primeiro acesso em novas clínicas; grupo: usuários/access_profile/perfis de acesso; tipo: diagnóstico; status: apoio; relação: signup, primeiro login e setup.
- `docs/auditoria_profunda_easydental_manual_instalacao_seeds_usuarios.md` | assunto: auditoria profunda de instalação manual de seeds/usuários; grupo: usuários/access_profile/perfis de acesso; tipo: diagnóstico; status: apoio/histórico; relação: seeds, usuários, licença e instalação.
- `docs/auditoria_usuarios_permissoes_login_sessao.md` | assunto: usuários, permissões, login e sessão; grupo: usuários/access_profile/perfis de acesso; tipo: diagnóstico; status: apoio; relação: autenticação, sessão e controle de acesso.

### 5.5 Documentos de exclusão segura
- `docs/contrato_exclusao_segura_contas_clinicas.md` | assunto: contrato de exclusão segura; grupo: exclusões seguras; tipo: contrato; status: vigente; relação: backup, dry-run, runner, execução real e validação.
- `docs/clinica_8_exclusao_segura_etapa_1_diagnostico_somente_leitura.md` | assunto: diagnóstico da exclusão da clínica 8; grupo: exclusões seguras; tipo: diagnóstico; status: apoio; relação: etapa 1 da trilha de exclusão.
- `docs/clinica_8_exclusao_segura_etapa_2_plano_documental.md` | assunto: plano documental da clínica 8; grupo: exclusões seguras; tipo: plano; status: apoio; relação: exclusão controlada.
- `docs/clinica_8_exclusao_segura_etapa_3_runner_controlado_sem_execucao.md` | assunto: runner controlado sem execução; grupo: exclusões seguras; tipo: execução/planejamento; status: apoio; relação: dry-run de exclusão.
- `docs/clinica_8_exclusao_segura_etapa_3b_auditoria_localizacao_arquivos.md` | assunto: auditoria de localização de arquivos; grupo: exclusões seguras; tipo: diagnóstico; status: apoio; relação: backup e localização.
- `docs/clinica_8_exclusao_segura_etapa_4_dry_run_runner.md` | assunto: dry-run do runner; grupo: exclusões seguras; tipo: validação; status: apoio; relação: validação antes de execução real.
- `docs/clinica_8_exclusao_segura_etapa_5_backup_pre_exclusao.md` | assunto: backup pré-exclusão; grupo: exclusões seguras; tipo: validação; status: apoio; relação: backup obrigatório.
- `docs/clinica_8_exclusao_segura_etapa_5b_auditoria_localizacao_backup.md` | assunto: auditoria da localização do backup; grupo: exclusões seguras; tipo: validação; status: apoio; relação: backup e trilha de auditoria.
- `docs/clinica_8_exclusao_segura_etapa_6_runner_execucao_controlada_sem_executar.md` | assunto: runner de execução controlada sem executar; grupo: exclusões seguras; tipo: execução/planejamento; status: apoio; relação: preparação da execução real.
- `docs/clinica_8_exclusao_segura_etapa_7_revisao_final_pre_execucao.md` | assunto: revisão final antes da execução; grupo: exclusões seguras; tipo: validação; status: apoio; relação: checkpoint antes do `--execute`.
- `docs/clinica_8_exclusao_segura_etapa_8_execucao_real_controlada.md` | assunto: execução real controlada; grupo: exclusões seguras; tipo: execução; status: apoio; relação: exclusão real da clínica 8.
- `docs/clinica_8_exclusao_segura_etapa_8b_auditoria_etiqueta_modelo.md` | assunto: auditoria de etiqueta/modelo; grupo: exclusões seguras; tipo: diagnóstico; status: apoio; relação: validação pós/trilha de exclusão.
- `docs/clinica_8_exclusao_segura_etapa_8c_ajuste_runner_backup_etiqueta_modelo.md` | assunto: ajuste do runner/backup/etiqueta/modelo; grupo: exclusões seguras; tipo: correção; status: apoio; relação: pós-ajuste da trilha.
- `docs/clinica_8_exclusao_segura_etapa_8d_execucao_real_controlada_pos_etiqueta_modelo.md` | assunto: execução real pós-ajuste; grupo: exclusões seguras; tipo: execução; status: apoio; relação: continuação da clínica 8.
- `docs/clinica_8_exclusao_segura_etapa_8e_correcao_transacao_runner_sem_execute.md` | assunto: correção de transação sem execute; grupo: exclusões seguras; tipo: correção; status: apoio; relação: robustez do runner.
- `docs/clinica_8_exclusao_segura_etapa_8f_execucao_real_pos_correcao_transacao.md` | assunto: execução real após correção de transação; grupo: exclusões seguras; tipo: execução; status: apoio; relação: trilha da clínica 8.
- `docs/clinica_8_exclusao_segura_etapa_8g_correcao_final_clinica_remanescente_sem_execute.md` | assunto: correção final da clínica remanescente; grupo: exclusões seguras; tipo: correção; status: apoio; relação: resíduo antes do fechamento.
- `docs/clinica_8_exclusao_segura_etapa_8h_execucao_final_clinica_remanescente.md` | assunto: execução final da clínica remanescente; grupo: exclusões seguras; tipo: execução; status: apoio; relação: conclusão da trilha.
- `docs/clinica_8_exclusao_segura_etapa_8i_execucao_final_clinica_remanescente.md` | assunto: execução final repetida/ajustada; grupo: exclusões seguras; tipo: execução; status: apoio; relação: variante do encerramento.
- `docs/clinica_8_exclusao_segura_etapa_9_validacao_novo_cadastro_limpo.md` | assunto: validação de novo cadastro limpo; grupo: exclusões seguras; tipo: validação; status: apoio; relação: prova de que a exclusão não contaminou o nascimento.
- `docs/clinica_9_exclusao_segura_etapa_1_diagnostico_somente_leitura.md` | assunto: diagnóstico da clínica 9; grupo: exclusões seguras; tipo: diagnóstico; status: apoio; relação: outra trilha de exclusão.
- `docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md` | assunto: runner/backup/dry-run sem execute; grupo: exclusões seguras; tipo: validação; status: apoio; relação: preparação da exclusão.
- `docs/clinica_9_exclusao_segura_etapa_3_execucao_real_controlada.md` | assunto: execução real controlada da clínica 9; grupo: exclusões seguras; tipo: execução; status: apoio; relação: trilha da clínica 9.

### 5.6 Modularização / refatoração segura geral
- `docs/varredura_comparativa_primeiro_modulo_modularizacao.md` | assunto: comparação do primeiro módulo para modularização; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: escolha de próximos recortes.
- `docs/varredura_modulos_nao_iniciados_pos_simbolos_graficos.md` | assunto: varredura de módulos não iniciados; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: seleção de módulos futuros.
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md` | assunto: módulos parciais mais seguros; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: priorização.
- `docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md` | assunto: módulos realmente não iniciados; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: priorização conservadora.
- `docs/varredura_proximo_modulo_pos_cid.md` | assunto: próximo módulo após CID; grupo: modularização/refatoração segura geral; tipo: recomendação; status: apoio; relação: roadmap de modularização.
- `docs/varredura_proximo_modulo_pos_intervencoes_auxiliares.md` | assunto: próximo módulo após intervenções auxiliares; grupo: modularização/refatoração segura geral; tipo: recomendação; status: apoio; relação: roadmap de modularização.
- `docs/varredura_proximo_modulo_pos_medicamentos.md` | assunto: próximo módulo após medicamentos; grupo: modularização/refatoração segura geral; tipo: recomendação; status: apoio; relação: roadmap de modularização.
- `docs/varredura_proximo_modulo_pos_plano_contas.md` | assunto: próximo módulo após plano de contas; grupo: modularização/refatoração segura geral; tipo: recomendação; status: apoio; relação: roadmap de modularização.
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md` | assunto: retomada segura após reversão; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: retomada controlada.
- `docs/fechamento_modularizacao_segura_parcial_materiais.md` | assunto: fechamento parcial de modularização dos materiais; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: encerramento de ciclo parcial.
- `docs/modularizacao_alerta_recorrente_duplo_clique_binds.md` | assunto: alerta recorrente sobre duplo clique e binds; grupo: modularização/refatoração segura geral; tipo: alerta; status: apoio; relação: riscos recorrentes de frontend.
- `docs/retomada_modularizacao_materiais_pos_consolidacao_vinculos.md` | assunto: retomada da modularização de materiais; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: consolidação de vínculos.
- `docs/reversao_controlada_modularizacao_frontend.md` | assunto: reversão controlada da modularização frontend; grupo: modularização/refatoração segura geral; tipo: execução/validação; status: apoio; relação: fallback seguro de UI.
- `docs/refatoracao_backend_subetapa_1_service_vinculos_materiais.md` | assunto: refatoração backend do serviço de vínculos de materiais; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: backend, vinculação e segurança.
- `docs/refatoracao_frontend_subetapa_2_consumo_origem_materiais.md` | assunto: refatoração frontend do consumo da origem de materiais; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: frontend e consumo.
- `docs/refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md` | assunto: refatoração frontend para troca genérico/recompõe materiais; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: frontend e recomposição.
- `docs/matriz_mestre_prioridade_risco_refatoracao.md` | assunto: matriz mestre de prioridade e risco; grupo: modularização/refatoração segura geral; tipo: regra/apoio; status: vigente; relação: decisão de próximos módulos.
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md` | assunto: inventário mestre da refatoração frontend/backend; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: inventário geral de módulos e risco.
- `docs/intervencoes_procedimentos_auditoria_retomada_modularizacao_namespace_passivo.md` | assunto: retomada da modularização em namespace passivo; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: estratégia conservadora.
- `docs/intervencoes_procedimentos_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição segura.
- `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md` | assunto: validação de fluxos sensíveis; grupo: modularização/refatoração segura geral; tipo: validação; status: apoio; relação: proteção do domínio.
- `docs/intervencoes_procedimentos_subetapa_1_namespace_passivo.md` | assunto: namespace passivo; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: modularização conservadora.
- `docs/intervencoes_procedimentos_subetapa_2_plano_primeira_extracao_segura.md` | assunto: plano da primeira extração segura; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração segura de funções.
- `docs/intervencoes_procedimentos_subetapa_2a_helpers_parse_formatacao.md` | assunto: helpers de parse/formatacao; grupo: modularização/refatoração segura geral; tipo: apoio; status: apoio; relação: extração para helpers.
- `docs/intervencoes_procedimentos_subetapa_2b_plano_proximo_helper_seguro.md` | assunto: próximo helper seguro; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: continuidade conservadora.
- `docs/intervencoes_procedimentos_subetapa_2c_helper_procFmtAuxLabel.md` | assunto: helper de label auxiliar; grupo: modularização/refatoração segura geral; tipo: apoio; status: apoio; relação: extração de helper.
- `docs/intervencoes_procedimentos_subetapa_2d_plano_proximo_helper_pos_auxlabel.md` | assunto: próximo helper após auxlabel; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: continuidade.
- `docs/intervencoes_procedimentos_subetapa_2e_helper_procFmtSimboloLabel.md` | assunto: helper de símbolo/label; grupo: modularização/refatoração segura geral; tipo: apoio; status: apoio; relação: extração controlada.
- `docs/intervencoes_procedimentos_subetapa_2f_avaliacao_proximo_bloco_seguro.md` | assunto: avaliação do próximo bloco seguro; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: escolha de próximo recorte.
- `docs/intervencoes_procedimentos_subetapa_2g_mapeamento_normalizacao_forma_cobranca.md` | assunto: normalização de forma de cobrança; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: helper e segurança.
- `docs/intervencoes_procedimentos_subetapa_2h_varredura_helpers_passivos_restantes.md` | assunto: varredura de helpers passivos restantes; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: limpeza sem mexer em lógica.
- `docs/intervencoes_procedimentos_subetapa_2i_helper_procIndiceSiglaFromValor.md` | assunto: helper de sigla a partir do valor; grupo: modularização/refatoração segura geral; tipo: apoio; status: apoio; relação: extração.
- `docs/intervencoes_procedimentos_subetapa_2j_reavaliacao_proximo_bloco.md` | assunto: reavaliação do próximo bloco; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: priorização.
- `docs/intervencoes_procedimentos_subetapa_2k_mapeamento_helpers_select.md` | assunto: helpers de select; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: refatoração segura.
- `docs/intervencoes_procedimentos_subetapa_2l_mapeamento_procSetSelectValue.md` | assunto: helper `procSetSelectValue`; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: refatoração segura.
- `docs/intervencoes_procedimentos_subetapa_2m_mapeamento_procGarantirOpcaoSelect.md` | assunto: helper `procGarantirOpcaoSelect`; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: refatoração segura.
- `docs/intervencoes_procedimentos_subetapa_2n_mapeamento_procPreencherSelect.md` | assunto: helper `procPreencherSelect`; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: refatoração segura.
- `docs/intervencoes_procedimentos_subetapa_2o_fechamento_reavaliacao_modulo.md` | assunto: fechamento da reavaliação do módulo; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: encerramento de ciclo.
- `docs/intervencoes_procedimentos_subetapa_b1_reajuste_tabela_preview_sem_gravacao.md` | assunto: preview sem gravação; grupo: modularização/refatoração segura geral; tipo: validação; status: apoio; relação: preview seguro.
- `docs/intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md` | assunto: plano de aplicação real do reajuste; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: aplicação controlada.
- `docs/intervencoes_procedimentos_subetapa_b2a_aplicacao_real_reajuste_tabela_confirmacao.md` | assunto: confirmação da aplicação real; grupo: modularização/refatoração segura geral; tipo: validação; status: apoio; relação: execução real.
- `docs/intervencoes_procedimentos_fechamento_ciclo_reajuste_tabela_precos.md` | assunto: fechamento do ciclo de reajuste; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: encerramento de ciclo.
- `docs/convenios_planos_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico de convênios/planos; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição do módulo.
- `docs/convenios_planos_subetapa_1_namespace_passivo.md` | assunto: namespace passivo de convênios/planos; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração segura.
- `docs/convenios_planos_subetapa_2_fronteiras_contratos.md` | assunto: fronteiras e contratos; grupo: modularização/refatoração segura geral; tipo: contrato; status: apoio; relação: modularização conservadora.
- `docs/convenios_planos_subetapa_3_helpers_puros.md` | assunto: helpers puros; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração.
- `docs/convenios_planos_subetapa_4_integracao_helpers_fallback.md` | assunto: integração com fallback; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: fallback seguro.
- `docs/convenios_planos_subetapa_5_encerramento_ciclo.md` | assunto: encerramento do ciclo; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão da subtrilha.
- `docs/convenios_planos_subetapa_6_documental_validar_nome_plano.md` | assunto: validação documental do nome do plano; grupo: modularização/refatoração segura geral; tipo: validação; status: apoio; relação: blindagem textual.
- `docs/convenios_planos_subetapa_7_documental_wrappers_fallbacks_appjs.md` | assunto: wrappers/fallbacks em app.js; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: frontend monolítico.
- `docs/convenios_planos_subetapa_8_integracao_wrapper_codigo_registro.md` | assunto: wrapper de código/registro; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: integração.
- `docs/convenios_planos_subetapa_9_integracao_wrapper_nome_convenio.md` | assunto: wrapper do nome convênio; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: integração e nomes.
- `docs/convenios_planos_subetapa_10_integracao_wrapper_nome_plano.md` | assunto: wrapper do nome plano; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: integração.
- `docs/convenios_planos_subetapa_11_integracao_wrapper_validar_nome_convenio.md` | assunto: wrapper para validar nome convênio; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: validação de texto.
- `docs/convenios_planos_subetapa_12_consolidacao_validacoes_wrappers_reais.md` | assunto: consolidação das validações reais; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: encerramento do ciclo.
- `docs/convenios_planos_subetapa_13_fechamento_mini_ciclo_recomendacao_proximo_modulo.md` | assunto: fechamento e recomendação de próximo módulo; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: roadmap.
- `docs/auxiliares_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico de auxiliares; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição.
- `docs/auxiliares_subetapa_1_namespace_passivo.md` | assunto: namespace passivo de auxiliares; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração segura.
- `docs/auxiliares_subetapa_2_fronteiras_contratos.md` | assunto: fronteiras/contratos de auxiliares; grupo: modularização/refatoração segura geral; tipo: contrato; status: apoio; relação: modularização.
- `docs/auxiliares_subetapa_3_helpers_puros.md` | assunto: helpers puros de auxiliares; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração.
- `docs/auxiliares_subetapa_4_integracao_helpers_puros.md` | assunto: integração dos helpers puros; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: integração segura.
- `docs/auxiliares_subetapa_5_encerramento_ciclo_helpers.md` | assunto: encerramento do ciclo de helpers; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão de fase.
- `docs/cid_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico de CID; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição.
- `docs/cid_subetapa_1_estrutura_modular_passiva.md` | assunto: estrutura modular passiva; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: recorte conservador.
- `docs/cid_subetapa_2_fronteiras_contratos.md` | assunto: fronteiras/contratos de CID; grupo: modularização/refatoração segura geral; tipo: contrato; status: apoio; relação: modularização.
- `docs/cid_subetapa_3_helpers_puros.md` | assunto: helpers puros de CID; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração.
- `docs/cid_subetapa_4_integracao_helpers_salvar.md` | assunto: integração de helpers ao salvar; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: fluxo seguro.
- `docs/cid_subetapa_5_encerramento_ciclo_helpers.md` | assunto: encerramento do ciclo de helpers; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão.
- `docs/etiquetas_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico de etiquetas; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição.
- `docs/etiquetas_subetapa_1_namespace_passivo.md` | assunto: namespace passivo de etiquetas; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração segura.
- `docs/etiquetas_subetapa_2_fronteiras_contratos.md` | assunto: fronteiras/contratos de etiquetas; grupo: modularização/refatoração segura geral; tipo: contrato; status: apoio; relação: modularização.
- `docs/etiquetas_subetapa_3a_correcao_normalizenumber_padrao.md` | assunto: correção de `normalizeNumber`; grupo: modularização/refatoração segura geral; tipo: correção; status: apoio; relação: padronização técnica.
- `docs/etiquetas_subetapa_3b_correcao_formatnumber_virgula.md` | assunto: correção de `formatNumber` com vírgula; grupo: modularização/refatoração segura geral; tipo: correção; status: apoio; relação: formatação e interface.
- `docs/etiquetas_subetapa_3b_helper_etqformatnumero.md` | assunto: helper `etqFormatNumero`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: lógica de etiqueta.
- `docs/etiquetas_subetapa_3c_helper_etqlayoutfromitem.md` | assunto: helper `etqLayoutFromItem`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: layout de etiqueta.
- `docs/etiquetas_subetapa_4_validacao_helpers.md` | assunto: validação de helpers; grupo: modularização/refatoração segura geral; tipo: validação; status: apoio; relação: conferência.
- `docs/etiquetas_subetapa_5_encerramento_ciclo_helpers.md` | assunto: encerramento do ciclo; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão.
- `docs/materiais_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico de materiais; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição.
- `docs/materiais_subetapa_1_namespace_passivo.md` | assunto: namespace passivo de materiais; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração segura.
- `docs/materiais_subetapa_2_fronteiras_contratos.md` | assunto: fronteiras/contratos de materiais; grupo: modularização/refatoração segura geral; tipo: contrato; status: apoio; relação: modularização.
- `docs/materiais_subetapa_3_helper_unique_aux_descricoes.md` | assunto: helper unique para descrições auxiliares; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: refatoração de materiais.
- `docs/materiais_subetapa_4_consolidacao_pos_helper.md` | assunto: consolidação pós-helper; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: encerramento de ciclo.
- `docs/materiais_subetapa_5_integracao_helper_unique_aux_descricoes.md` | assunto: integração do helper; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: fluxo seguro.
- `docs/materiais_subetapa_6_consolidacao_pos_integracao.md` | assunto: consolidação pós-integração; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão.
- `docs/materiais_subetapa_funcional_minima_delegacao_helper_unique_aux.md` | assunto: funcional mínima com delegação; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: recorte mínimo.
- `docs/medicamentos_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico de medicamentos; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição.
- `docs/medicamentos_subetapa_0_retomada_estado_atual.md` | assunto: retomada do estado atual; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: continuidade.
- `docs/medicamentos_subetapa_1_estrutura_modular_passiva.md` | assunto: estrutura modular passiva; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: recorte conservador.
- `docs/medicamentos_subetapa_2_fronteiras_contratos.md` | assunto: fronteiras/contratos de medicamentos; grupo: modularização/refatoração segura geral; tipo: contrato; status: apoio; relação: modularização.
- `docs/medicamentos_subetapa_3_helpers_textuais_puros.md` | assunto: helpers textuais puros; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração segura.
- `docs/medicamentos_subetapa_4_integracao_validacao_nome.md` | assunto: integração e validação de nome; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: validação textual.
- `docs/medicamentos_subetapa_5_encerramento_ciclo_helpers.md` | assunto: encerramento do ciclo de helpers; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão.
- `docs/plano_contas_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico do plano de contas; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição.
- `docs/plano_contas_subetapa_1_estrutura_modular_passiva.md` | assunto: estrutura modular passiva; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: recorte conservador.
- `docs/plano_contas_subetapa_2_fronteiras_contratos.md` | assunto: fronteiras/contratos do plano de contas; grupo: modularização/refatoração segura geral; tipo: contrato; status: apoio; relação: modularização.
- `docs/plano_contas_subetapa_3_helpers_puros.md` | assunto: helpers puros; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração.
- `docs/plano_contas_subetapa_4_integracao_helpers_dialogs.md` | assunto: integração de helpers/dialogs; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: UI e lógica.
- `docs/plano_contas_subetapa_5_encerramento_ciclo_helpers.md` | assunto: encerramento do ciclo; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão.
- `docs/preferencias_opcoes_sistema_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico de preferências/opções; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição.
- `docs/preferencias_opcoes_sistema_subetapa_1_namespace_passivo.md` | assunto: namespace passivo; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: recorte conservador.
- `docs/preferencias_opcoes_sistema_subetapa_2_candidatos_helpers_defaults_puros.md` | assunto: candidatos de helpers defaults puros; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: extração segura.
- `docs/preferencias_opcoes_sistema_subetapa_3_prefOdontoNorm.md` | assunto: helper `prefOdontoNorm`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: preferências.
- `docs/preferencias_opcoes_sistema_subetapa_4_reavaliacao_proximo_helper.md` | assunto: reavaliação do próximo helper; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: continuidade.
- `docs/preferencias_opcoes_sistema_subetapa_5_prefValoresPadraoModelos.md` | assunto: valores padrão de modelos; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: preferências e padrões.
- `docs/preferencias_opcoes_sistema_subetapa_6_reavaliacao_proximo_default.md` | assunto: reavaliação do próximo default; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: continuidade.
- `docs/preferencias_opcoes_sistema_subetapa_7_prefOdontoFindByLabel.md` | assunto: helper `prefOdontoFindByLabel`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: preferências.
- `docs/preferencias_opcoes_sistema_subetapa_8_reavaliacao_continuidade.md` | assunto: reavaliação de continuidade; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: continuidade.
- `docs/preferencias_opcoes_sistema_subetapa_9_fechamento_reavaliacao_modulo.md` | assunto: fechamento da reavaliação do módulo; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: encerramento.
- `docs/prestadores_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico de prestadores; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição.
- `docs/prestadores_subetapa_0_retomada_estado_atual.md` | assunto: retomada do estado atual; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: continuidade.
- `docs/prestadores_subetapa_1_namespace_passivo.md` | assunto: namespace passivo; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração segura.
- `docs/prestadores_subetapa_2_fronteiras_contratos.md` | assunto: fronteiras/contratos de prestadores; grupo: modularização/refatoração segura geral; tipo: contrato; status: apoio; relação: modularização.
- `docs/prestadores_subetapa_3_helper_prest_fmt_codigo.md` | assunto: helper `prest_fmt_codigo`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: refatoração de prestadores.
- `docs/prestadores_subetapa_4_integracao_prest_fmt_codigo.md` | assunto: integração do helper; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: fluxo seguro.
- `docs/prestadores_subetapa_5_encerramento_ciclo.md` | assunto: encerramento do ciclo; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão.
- `docs/prestadores_subetapa_6_documental_prest_status_html.md` | assunto: documentação do `prest_status_html`; grupo: modularização/refatoração segura geral; tipo: documentação; status: apoio; relação: refatoração de frontend/backend.
- `docs/prestadores_subetapa_7_integracao_prest_status_html.md` | assunto: integração do `prest_status_html`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: integração.
- `docs/prestadores_subetapa_8_reavaliacao_pos_prest_status_html.md` | assunto: reavaliação pós-`prest_status_html`; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: continuidade.
- `docs/procedimentos_genericos_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico de procedimentos genéricos; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição.
- `docs/procedimentos_genericos_subetapa_1_namespace_passivo.md` | assunto: namespace passivo; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração segura.
- `docs/procedimentos_genericos_subetapa_2_fronteiras_contratos.md` | assunto: fronteiras/contratos; grupo: modularização/refatoração segura geral; tipo: contrato; status: apoio; relação: modularização.
- `docs/procedimentos_genericos_subetapa_3a_helper_pgenstatusdot.md` | assunto: helper `pgenStatusDot`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: lógica de procedimentos genéricos.
- `docs/procedimentos_genericos_subetapa_3b_validacao_pgenstatusdot.md` | assunto: validação de `pgenStatusDot`; grupo: modularização/refatoração segura geral; tipo: validação; status: apoio; relação: qualidade do helper.
- `docs/procedimentos_genericos_subetapa_4_encerramento_ciclo_pgenstatusdot.md` | assunto: encerramento do ciclo `pgenStatusDot`; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão.
- `docs/procedimentos_genericos_subetapa_5a_auditoria_payload_pgenpayloadfromstate.md` | assunto: auditoria de payload `pgenPayloadFromState`; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: backend e payload.
- `docs/procedimentos_genericos_subetapa_5b_fixtures_payload_pgenpayloadfromstate.md` | assunto: fixtures para payload; grupo: modularização/refatoração segura geral; tipo: apoio; status: apoio; relação: testes e estabilidade.
- `docs/unidades_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico de unidades; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição.
- `docs/unidades_subetapa_1_estrutura_modular_controlada.md` | assunto: estrutura modular controlada; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: recorte seguro.
- `docs/unidades_subetapa_2_comparacao_helpers.md` | assunto: comparação de helpers; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: extração.
- `docs/unidades_subetapa_3_carregamento_passivo.md` | assunto: carregamento passivo; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: modularização conservadora.
- `docs/unidades_subetapa_4_wrapper_status_html.md` | assunto: wrapper `status_html`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: interface.
- `docs/unidades_subetapa_5_wrapper_fmt_codigo.md` | assunto: wrapper `fmt_codigo`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: interface/lógica.
- `docs/unidades_subetapa_6_wrapper_telefone_padrao.md` | assunto: wrapper de telefone padrão; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: padronização.
- `docs/unidades_subetapa_7_auditoria_helpers_modulares.md` | assunto: auditoria de helpers modulares; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: validação.
- `docs/unidades_subetapa_8_encerramento_ciclo_helpers.md` | assunto: encerramento do ciclo de helpers; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão.
- `docs/simbolos_graficos_subetapa_0_mapeamento_monolitico.md` | assunto: mapeamento monolítico de símbolos gráficos; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: decomposição.
- `docs/simbolos_graficos_subetapa_1_namespace_passivo.md` | assunto: namespace passivo; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração segura.
- `docs/simbolos_graficos_subetapa_2_fronteiras_contratos.md` | assunto: fronteiras/contratos; grupo: modularização/refatoração segura geral; tipo: contrato; status: apoio; relação: modularização.
- `docs/simbolos_graficos_subetapa_3_helpers_puros_passivos.md` | assunto: helpers puros passivos; grupo: modularização/refatoração segura geral; tipo: plano; status: apoio; relação: extração.
- `docs/simbolos_graficos_subetapa_4_integracao_helper_normalizar_texto.md` | assunto: integração do helper `normalizar_texto`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: texto e visual.
- `docs/simbolos_graficos_subetapa_5_integracao_helper_eh_sistema.md` | assunto: integração do helper `eh_sistema`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: regras de interface.
- `docs/simbolos_graficos_subetapa_6_integracao_helper_url_imagem.md` | assunto: integração do helper `url_imagem`; grupo: modularização/refatoração segura geral; tipo: execução; status: apoio; relação: assets e interface.
- `docs/simbolos_graficos_subetapa_7_consolidacao_helpers.md` | assunto: consolidação de helpers; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão.
- `docs/simbolos_graficos_subetapa_8_biblioteca_helpers_remanescentes.md` | assunto: biblioteca de helpers remanescentes; grupo: modularização/refatoração segura geral; tipo: diagnóstico; status: apoio; relação: limpeza.
- `docs/simbolos_graficos_subetapa_8_documental_helpers_remanescentes.md` | assunto: documentação de helpers remanescentes; grupo: modularização/refatoração segura geral; tipo: documentação; status: apoio; relação: rastreabilidade.
- `docs/simbolos_graficos_subetapa_9_documental_validar_tipo_marca_simbolo.md` | assunto: validação do tipo de marca/símbolo; grupo: modularização/refatoração segura geral; tipo: validação; status: apoio; relação: blindagem de texto.
- `docs/simbolos_graficos_subetapa_10_fechamento_pos_validar_tipo_marca.md` | assunto: fechamento pós validação; grupo: modularização/refatoração segura geral; tipo: fechamento; status: apoio; relação: conclusão.

### 5.7 Documentos históricos, parciais, duplicados ou potencialmente obsoletos
#### Histórico principal em `docs/_historico_auditoria/`
- `docs/_historico_auditoria/00_diagnostico.md`
- `docs/_historico_auditoria/01_visao_geral.md`
- `docs/_historico_auditoria/02_arquitetura.md`
- `docs/_historico_auditoria/03_mapa_codigo.md`
- `docs/_historico_auditoria/04_funcionalidades.md`
- `docs/_historico_auditoria/05_banco_dados.md`
- `docs/_historico_auditoria/06_seguranca.md`
- `docs/_historico_auditoria/07_deploy.md`
- `docs/_historico_auditoria/08_problemas.md`
- `docs/_historico_auditoria/09_relatorio_fase_a2.md`
- `docs/_historico_auditoria/12_organizacao_local.md`
- `docs/_historico_auditoria/13_preparacao_github.md`
- `docs/_historico_auditoria/15_levantamento_pre_migracao.md`
- `docs/_historico_auditoria/16_migracao_local.md`
- `docs/_historico_auditoria/CONTINUIDADE.md`
- `docs/_historico_auditoria/MASTER_GUIDE.md`

#### Apoio / histórico fora da pasta histórica
- `docs/comparacao_appjs_legado_vs_github_pos_reversao.md`
- `docs/restauracao_pre_anamnese.md`
- `docs/restauracao_pre_anamnese_diff_antes.patch`
- `docs/restauracao_pre_anamnese_status_antes.txt`
- `docs/relatorio_importacao_textos_clinica_1.md`
- `docs/relatorio_modelos_clinica_1_mapeamento_arquivos.md`
- `docs/relatorio_modelos_clinicos_sem_conteudo.md`
- `docs/revisao_humana_md_anamnese_pendentes.md`
- `docs/retomada_modularizacao_materiais_pos_consolidacao_vinculos.md`
- `docs/reversao_controlada_modularizacao_frontend.md`
- `docs/fechamento_modularizacao_segura_parcial_materiais.md`
- `docs/varredura_modulos_nao_iniciados_pos_simbolos_graficos.md`
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`
- `docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md`

## 6. Documentos que parecem contratos ou fontes de verdade vigentes
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/05_banco_dados.md`
- `docs/06_seguranca.md`
- `docs/07_fluxos.md`
- `docs/08_setup_execucao.md`
- `docs/10_continuidade.md`
- `docs/11_roadmap_desenvolvimento.md`
- `docs/matriz_mestre_prioridade_risco_refatoracao.md`

## 7. Documentos de seeds e nascimento de nova clínica
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/seeds_procedimentos_e_genericos_nao_sobrescrever_existentes.md`
- `docs/seeds_procedimentos_subetapa_1a_sanitizacao_nome_codigo.md`
- `docs/seeds_procedimentos_genericos_subetapa_3a_planejamento_sanitizacao_nome_codigo.md`
- `docs/seeds_procedimentos_genericos_subetapa_3a_sanitizacao_nome_codigo.md`
- `docs/seeds_materiais_subetapa_2a_planejamento_sanitizacao_nome_codigo.md`
- `docs/seeds_materiais_subetapa_2a_sanitizacao_nome_codigo.md`
- `docs/seeds_particular_zerar_valores_financeiros_novas_contas.md`
- `docs/auditoria_seeds_novas_contas_procedimentos_materiais.md`
- `docs/auditoria_profunda_easydental_manual_instalacao_seeds_usuarios.md`
- `docs/anamnese_seed_obrigatorio_plano.md`
- `docs/anamnese_seed_obrigatorio_implementacao_resultado.md`
- `docs/anamnese_seed_obrigatorio_dry_run_resultado.txt`

## 8. Documentos de Usuários / access_profile / perfis de acesso
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/pre_contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/access_profile_subetapa_1_fonte_versionada_passiva.md`
- `docs/access_profile_subetapa_2_bootstrap_idempotente_controlado.md`
- `docs/access_profile_subetapa_3a_dry_run_controlado.md`
- `docs/access_profile_subetapa_3b_execucao_dry_run_somente_leitura.md`
- `docs/access_profile_subetapa_4_acoplamento_signup_novas_clinicas.md`
- `docs/access_profile_subetapa_4a_validacao_signup_sem_sujar_banco.md`
- `docs/access_profile_subetapa_5a_preparar_ambiente_teste_signup.md`
- `docs/access_profile_subetapa_5b_roteiro_operacional_banco_teste.md`
- `docs/access_profile_subetapa_5c_banco_teste_isolado_preparado.md`
- `docs/access_profile_subetapa_5d_signup_real_banco_isolado.md`
- `docs/access_profile_subetapa_5e_diagnostico_signup_sem_access_profile.md`
- `docs/access_profile_subetapa_5f_corrige_bootstrap_materializacao.md`
- `docs/access_profile_subetapa_5g_signup_real_apos_correcao_bootstrap.md`
- `docs/access_profile_subetapa_6a_consolidacao_trilha_validada.md`
- `docs/access_profile_subetapa_6b_estrategia_clinicas_existentes.md`
- `docs/access_profile_subetapa_6c_dry_run_atualizado_clinicas_existentes.md`
- `docs/access_profile_subetapa_6d_decisao_plano_correcao_clinicas_existentes.md`
- `docs/access_profile_subetapa_6e_runner_controlado_clinicas_existentes.md`
- `docs/access_profile_subetapa_6f_execucao_runner_clinica_1.md`
- `docs/access_profile_subetapa_6g_validacao_pos_correcao_clinica_1.md`
- `docs/access_profile_subetapa_6h_decisao_demais_clinicas_existentes.md`
- `docs/access_profile_subetapa_6i_execucao_runner_clinica_4.md`
- `docs/access_profile_subetapa_6j_validacao_pos_correcao_clinica_4.md`
- `docs/access_profile_subetapa_6k_decisao_tratamento_clinica_8.md`
- `docs/access_profile_subetapa_6l_execucao_runner_clinica_8.md`
- `docs/access_profile_subetapa_6m_diagnostico_residual_clinica_8.md`
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`
- `docs/users_admin_plano_correcao_controlada_grant_perfis.md`
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- `docs/users_admin_primeira_separacao_real_execucao.md`
- `docs/sintese_primeira_separacao_real_usuarios_admin.md`
- `docs/auditoria_fechamento_easydental_brana_contrato_usuarios.md`
- `docs/auditoria_complementar_usuarios_permissoes_licenca_easydental.md`
- `docs/auditoria_fluxo_primeiro_acesso_novas_clinicas.md`
- `docs/auditoria_usuarios_permissoes_login_sessao.md`

## 9. Documentos de exclusão segura
- `docs/contrato_exclusao_segura_contas_clinicas.md`
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

## 10. Documentos de modularização / refatoração segura
- `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
- `docs/varredura_modulos_nao_iniciados_pos_simbolos_graficos.md`
- `docs/varredura_modulos_parciais_mais_seguros_pos_nao_iniciados.md`
- `docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md`
- `docs/varredura_proximo_modulo_pos_cid.md`
- `docs/varredura_proximo_modulo_pos_intervencoes_auxiliares.md`
- `docs/varredura_proximo_modulo_pos_medicamentos.md`
- `docs/varredura_proximo_modulo_pos_plano_contas.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/fechamento_modularizacao_segura_parcial_materiais.md`
- `docs/modularizacao_alerta_recorrente_duplo_clique_binds.md`
- `docs/refatoracao_backend_subetapa_1_service_vinculos_materiais.md`
- `docs/refatoracao_frontend_subetapa_2_consumo_origem_materiais.md`
- `docs/refatoracao_frontend_subetapa_3_troca_generico_recompoe_materiais.md`
- `docs/reversao_controlada_modularizacao_frontend.md`
- `docs/retomada_modularizacao_materiais_pos_consolidacao_vinculos.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/intervencoes_procedimentos_auditoria_retomada_modularizacao_namespace_passivo.md`
- `docs/intervencoes_procedimentos_subetapa_0_mapeamento_monolitico.md`
- `docs/intervencoes_procedimentos_subetapa_0b_validacao_fluxos_sensiveis.md`
- `docs/intervencoes_procedimentos_subetapa_1_namespace_passivo.md`
- `docs/intervencoes_procedimentos_subetapa_2_plano_primeira_extracao_segura.md`
- `docs/intervencoes_procedimentos_subetapa_2a_helpers_parse_formatacao.md`
- `docs/intervencoes_procedimentos_subetapa_2b_plano_proximo_helper_seguro.md`
- `docs/intervencoes_procedimentos_subetapa_2c_helper_procFmtAuxLabel.md`
- `docs/intervencoes_procedimentos_subetapa_2d_plano_proximo_helper_pos_auxlabel.md`
- `docs/intervencoes_procedimentos_subetapa_2e_helper_procFmtSimboloLabel.md`
- `docs/intervencoes_procedimentos_subetapa_2f_avaliacao_proximo_bloco_seguro.md`
- `docs/intervencoes_procedimentos_subetapa_2g_mapeamento_normalizacao_forma_cobranca.md`
- `docs/intervencoes_procedimentos_subetapa_2h_varredura_helpers_passivos_restantes.md`
- `docs/intervencoes_procedimentos_subetapa_2i_helper_procIndiceSiglaFromValor.md`
- `docs/intervencoes_procedimentos_subetapa_2j_reavaliacao_proximo_bloco.md`
- `docs/intervencoes_procedimentos_subetapa_2k_mapeamento_helpers_select.md`
- `docs/intervencoes_procedimentos_subetapa_2l_mapeamento_procSetSelectValue.md`
- `docs/intervencoes_procedimentos_subetapa_2m_mapeamento_procGarantirOpcaoSelect.md`
- `docs/intervencoes_procedimentos_subetapa_2n_mapeamento_procPreencherSelect.md`
- `docs/intervencoes_procedimentos_subetapa_2o_fechamento_reavaliacao_modulo.md`
- `docs/intervencoes_procedimentos_subetapa_b1_reajuste_tabela_preview_sem_gravacao.md`
- `docs/intervencoes_procedimentos_subetapa_b2_plano_aplicacao_real_reajuste_tabela.md`
- `docs/intervencoes_procedimentos_subetapa_b2a_aplicacao_real_reajuste_tabela_confirmacao.md`
- `docs/intervencoes_procedimentos_fechamento_ciclo_reajuste_tabela_precos.md`
- `docs/convenios_planos_subetapa_0_mapeamento_monolitico.md`
- `docs/convenios_planos_subetapa_1_namespace_passivo.md`
- `docs/convenios_planos_subetapa_2_fronteiras_contratos.md`
- `docs/convenios_planos_subetapa_3_correcao_exposicao_helpers.md`
- `docs/convenios_planos_subetapa_3_helpers_puros.md`
- `docs/convenios_planos_subetapa_4_integracao_helpers_fallback.md`
- `docs/convenios_planos_subetapa_5_encerramento_ciclo.md`
- `docs/convenios_planos_subetapa_6_documental_validar_nome_plano.md`
- `docs/convenios_planos_subetapa_7_documental_wrappers_fallbacks_appjs.md`
- `docs/convenios_planos_subetapa_8_integracao_wrapper_codigo_registro.md`
- `docs/convenios_planos_subetapa_9_integracao_wrapper_nome_convenio.md`
- `docs/convenios_planos_subetapa_10_integracao_wrapper_nome_plano.md`
- `docs/convenios_planos_subetapa_11_integracao_wrapper_validar_nome_convenio.md`
- `docs/convenios_planos_subetapa_12_consolidacao_validacoes_wrappers_reais.md`
- `docs/convenios_planos_subetapa_13_fechamento_mini_ciclo_recomendacao_proximo_modulo.md`

## 11. Documentos históricos ou de apoio
- `docs/_historico_auditoria/00_diagnostico.md`
- `docs/_historico_auditoria/01_visao_geral.md`
- `docs/_historico_auditoria/02_arquitetura.md`
- `docs/_historico_auditoria/03_mapa_codigo.md`
- `docs/_historico_auditoria/04_funcionalidades.md`
- `docs/_historico_auditoria/05_banco_dados.md`
- `docs/_historico_auditoria/06_seguranca.md`
- `docs/_historico_auditoria/07_deploy.md`
- `docs/_historico_auditoria/08_problemas.md`
- `docs/_historico_auditoria/09_relatorio_fase_a2.md`
- `docs/_historico_auditoria/12_organizacao_local.md`
- `docs/_historico_auditoria/13_preparacao_github.md`
- `docs/_historico_auditoria/15_levantamento_pre_migracao.md`
- `docs/_historico_auditoria/16_migracao_local.md`
- `docs/_historico_auditoria/CONTINUIDADE.md`
- `docs/_historico_auditoria/MASTER_GUIDE.md`
- `docs/comparacao_appjs_legado_vs_github_pos_reversao.md`
- `docs/restauracao_pre_anamnese.md`
- `docs/restauracao_pre_anamnese_diff_antes.patch`
- `docs/restauracao_pre_anamnese_status_antes.txt`
- `docs/relatorio_importacao_textos_clinica_1.md`
- `docs/relatorio_modelos_clinica_1_mapeamento_arquivos.md`
- `docs/relatorio_modelos_clinicos_sem_conteudo.md`
- `docs/revisao_humana_md_anamnese_pendentes.md`

## 12. Documentos candidatos a padronização de nome futura
- `docs/pre_contrato_funcional_usuarios_novas_contas.md` | problema: título de pré-contrato pode se confundir com o contrato definitivo; sugestão futura: `docs/contrato_usuarios_novas_contas_previa.md`; risco de renomear: médio, porque há links internos e referências cruzadas; observação: nada foi renomeado nesta etapa.
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md` | problema: nome longo e pouco direto; sugestão futura: `docs/plano_access_profile_perfis_acesso.md`; risco de renomear: médio; observação: apenas proposta.
- `docs/users_admin_primeira_separacao_real_execucao.md` | problema: nome mistura ordem, fase e tipo de tarefa; sugestão futura: `docs/users_admin_modal_visual_execucao.md`; risco de renomear: médio; observação: apenas proposta.
- `docs/sintese_primeira_separacao_real_usuarios_admin.md` | problema: "síntese" e "primeira separação real" são nomes muito específicos para histórico interno; sugestão futura: `docs/users_admin_modal_visual_fechamento.md`; risco de renomear: médio; observação: apenas proposta.
- `docs/auditoria_fechamento_easydental_brana_contrato_usuarios.md` | problema: nome longo e misto de contexto EasyDental/Brana; sugestão futura: `docs/auditoria_contrato_usuarios_origem_easydental.md`; risco de renomear: médio; observação: apenas proposta.
- `docs/auditoria_profunda_easydental_manual_instalacao_seeds_usuarios.md` | problema: nome longo e muito específico; sugestão futura: `docs/auditoria_seeds_usuarios_easydental.md`; risco de renomear: médio; observação: apenas proposta.
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md` | problema: nome amplo e pouco escaneável; sugestão futura: `docs/inventario_refatoracao_frontend_backend.md`; risco de renomear: baixo/médio; observação: apenas proposta.
- `docs/varredura_comparativa_primeiro_modulo_modularizacao.md` | problema: nome pouco padronizado para indexação; sugestão futura: `docs/modularizacao_varredura_primeiro_modulo.md`; risco de renomear: baixo; observação: apenas proposta.
- `docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md` | problema: nome longo, redundante e difícil de buscar; sugestão futura: `docs/modularizacao_varredura_modulos_nao_iniciados.md`; risco de renomear: baixo; observação: apenas proposta.
- `docs/clinica_8_exclusao_segura_etapa_8i_execucao_final_clinica_remanescente.md` | problema: possível duplicidade conceitual com `8h`; sugestão futura: `docs/clinica_8_exclusao_segura_execucao_final.md`; risco de renomear: baixo/médio; observação: apenas proposta.
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md` | problema: mistura pós-teste, status HTTP e diagnóstico; sugestão futura: `docs/users_admin_diagnostico_403_forbidden.md`; risco de renomear: baixo; observação: apenas proposta.

## 13. Proposta de padrão futuro de nomes
Proposta, sem aplicação nesta etapa:
- Contratos: `docs/contrato_<area>_<assunto>.md`
- Regras permanentes: `docs/regras_<area>_<assunto>.md`
- Diagnósticos: `docs/<modulo>_<assunto>_diagnostico.md`
- Planos: `docs/<modulo>_<assunto>_plano.md`
- Execuções: `docs/<modulo>_<assunto>_execucao.md`
- Fechamentos: `docs/<modulo>_<assunto>_fechamento.md`
- Inventários: `docs/inventario_<area>_<assunto>.md`

Observação de padronização:
- Para séries longas, manter um prefixo estável por domínio e um sufixo estável por tipo de documento.
- Evitar misturar idioma, causa, etapa, status e resultado no mesmo nome quando isso puder ser separado.
- Evitar duplicidade entre "diagnóstico", "plano", "execução", "validação" e "fechamento" no mesmo arquivo.

## 14. Mapa de arquivos de código relacionados, apenas como referência

### Seeds
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/seeds/access_profiles_existing_clinics_runner.py`
- `backend/seeds/__pycache__/access_profiles_default.cpython-310.pyc`
- `backend/seeds/__pycache__/access_profiles_bootstrap.cpython-310.pyc`
- `backend/seeds/__pycache__/access_profiles_dry_run.cpython-310.pyc`
- `backend/seeds/__pycache__/access_profiles_existing_clinics_runner.cpython-310.pyc`

### Signup
- `backend/services/signup_service.py`
- `backend/schemas/signup_schema.py`
- `backend/routes/auth_routes.py`
- `backend/services/runtime_bootstrap_service.py`

### Usuários
- `backend/routes/user_admin_routes.py`
- `backend/models/usuario.py`
- `backend/models/usuario_perfil_acesso.py`
- `backend/models/access_profile.py`
- `backend/services/access_profiles_service.py`
- `backend/security/user_context.py`
- `backend/security/permissions.py`
- `backend/security/dependencies.py`

### Frontend
- `frontend/app.js`
- `frontend/js/modules/users-admin-modal-visual.js`

### Runners
- `backend/scripts/executar_bootstrap_runtime_global.py`
- `backend/scripts/delete_test_clinic_runner.py`
- `backend/scripts/delete_test_clinic_9_runner.py`
- `backend/scripts/export_test_clinic_backup.py`
- `backend/scripts/export_test_clinic_9_backup.py`

### Exclusão
- `backend/scripts/delete_test_clinic_runner.py`
- `backend/scripts/delete_test_clinic_9_runner.py`
- `backend/scripts/export_test_clinic_backup.py`
- `backend/scripts/export_test_clinic_9_backup.py`
- `docs/contrato_exclusao_segura_contas_clinicas.md`

### Base técnica adicional
- `backend/database.py`
- `backend/routes/auth_routes.py`
- `backend/routes/user_admin_routes.py`
- `backend/services/runtime_profile_service.py`

## 15. Recomendações
Próxima etapa mais segura:
1. Criar um índice oficial dos contratos e regras vigentes.
2. Consolidar a trilha de `Users / access_profile / perfis de acesso`.
3. Só depois retomar o diagnóstico/correção da UI de "Perfis de acesso".

Por quê:
- A trilha de contratos já existe, mas está espalhada entre guias-base, contratos e auditorias.
- A base de `access_profile` e `usuario_perfil_acesso` ainda está documentada em várias etapas e merece consolidação antes de nova intervenção de UI.
- A UI deve seguir a regra, e não o contrário.

## 16. Confirmações
- Somente este documento foi criado nesta etapa.
- Nenhum código foi alterado.
- O banco não foi alterado.
- Nenhum `DELETE`, `UPDATE` ou `INSERT` foi executado.
- Nenhum arquivo foi renomeado.
- Nenhum documento foi movido.
- Nenhum documento foi apagado.
- `signup`, `seeds` e `access_profile` não foram alterados.
- `frontend` e `backend` não foram alterados.
- Pastas proibidas não foram tocadas.
- A blindagem textual/mojibake foi respeitada no sentido de não corrigir textos existentes.
- Não houve `git add`, `git commit` ou `git push`.
