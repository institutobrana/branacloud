# Ãndice oficial de contratos e regras vigentes â€” Brana Cloud

## 1. Objetivo
Este Ã­ndice Ã© o mapa oficial para localizar as fontes de verdade do projeto Brana Cloud.

Ele nÃ£o substitui os contratos originais.

Ele apenas aponta quais documentos devem ser consultados antes de alteraÃ§Ãµes.

## 2. Regra de uso
Antes de qualquer alteraÃ§Ã£o em uma Ã¡rea do sistema, o Codex deve:

1. localizar a Ã¡rea neste Ã­ndice;
2. ler os documentos vigentes indicados;
3. respeitar contratos, regras e blindagens;
4. nÃ£o usar documentos histÃ³ricos como fonte principal quando houver contrato vigente;
5. documentar quais contratos foram consultados na etapa.

## 3. Contratos e regras globais obrigatÃ³rios

### `docs/contrato_fechamento_agenda_contatos_frontend_react.md`
- Funcao: registrar o contrato final do modulo React Agenda de contatos.
- Quando consultar: antes de alterar a rota, toolbar, listagem, modal ou CRUD
  de contatos de agenda.
- Status: vigente.
- Observacao: Imprime e Relatorio permanecem placeholders desabilitados ate
  definicao futura de produto.

### `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- FunÃ§Ã£o: blindar correÃ§Ãµes textuais, acentuaÃ§Ã£o, mojibake, labels e strings visÃ­veis.
- Quando consultar: antes de qualquer ajuste de UI, texto, placeholder, mensagem ou sÃ­mbolo.
- Status: vigente.
- ObservaÃ§Ã£o: documento de proteÃ§Ã£o; nÃ£o corrige nada por si sÃ³.

### `docs/00_master_guide.md`
- FunÃ§Ã£o: ponto de entrada oficial do projeto e guia mestre de leitura.
- Quando consultar: no inÃ­cio de qualquer tarefa relevante.
- Status: vigente.
- ObservaÃ§Ã£o: define ordem de leitura e regras de ouro do projeto.

### `docs/02_arquitetura.md`
- FunÃ§Ã£o: descrever arquitetura, backend, frontend, banco e fluxo geral.
- Quando consultar: antes de mudanÃ§as de estrutura, integraÃ§Ã£o ou entendimento macro.
- Status: vigente.
- ObservaÃ§Ã£o: Ãºtil para localizar limites entre camadas.

### `docs/03_mapa_codigo.md`
- FunÃ§Ã£o: mapear arquivos principais e onde mexer por tipo de tarefa.
- Quando consultar: antes de alterar qualquer mÃ³dulo funcional.
- Status: vigente.
- ObservaÃ§Ã£o: aponta rotas, modelos, serviÃ§os e Ã¡reas sensÃ­veis.

### `docs/05_banco_dados.md`
- FunÃ§Ã£o: consolidar visÃ£o de tabelas, relaÃ§Ãµes, multi-tenant e bootstrap.
- Quando consultar: antes de mexer em modelos, queries, scripts ou persistÃªncia.
- Status: vigente.
- ObservaÃ§Ã£o: orienta o uso correto de `clinica_id` e a leitura do schema.

### `docs/06_seguranca.md`
- FunÃ§Ã£o: regras de seguranÃ§a, JWT, autenticaÃ§Ã£o, arquivos sensÃ­veis e isolamento.
- Quando consultar: antes de qualquer alteraÃ§Ã£o em auth, permissÃµes ou rotas protegidas.
- Status: vigente.
- ObservaÃ§Ã£o: documento crÃ­tico para evitar regressÃµes de seguranÃ§a.

### `docs/07_fluxos.md`
- FunÃ§Ã£o: documentar fluxos de login, `/me`, signup e uso autenticado.
- Quando consultar: antes de alteraÃ§Ãµes em endpoints, frontend ou validaÃ§Ãµes de fluxo.
- Status: vigente.
- ObservaÃ§Ã£o: Ãºtil para entender o que pode quebrar em cada rota.

### `docs/08_setup_execucao.md`
- FunÃ§Ã£o: registrar setup local, execuÃ§Ã£o e checks mÃ­nimos.
- Quando consultar: antes de iniciar ambiente, validar bootstrap ou orientar execuÃ§Ã£o local.
- Status: vigente.
- ObservaÃ§Ã£o: ajuda a evitar diagnÃ³sticos com ambiente incompleto.

### `docs/10_continuidade.md`
- FunÃ§Ã£o: orientar novos desenvolvedores e listar regras para nÃ£o quebrar o sistema.
- Quando consultar: antes de qualquer contribuiÃ§Ã£o relevante.
- Status: vigente.
- ObservaÃ§Ã£o: bom resumo de prioridades, limites e pontos sensÃ­veis.

### `docs/11_roadmap_desenvolvimento.md`
- FunÃ§Ã£o: registrar estado atual dos mÃ³dulos e prÃ³ximos passos.
- Quando consultar: antes de escolher o prÃ³ximo mÃ³dulo ou entender status funcional.
- Status: vigente.
- ObservaÃ§Ã£o: mapa operacional de evoluÃ§Ã£o.

### `docs/auditoria_tabela_procedimentos_frontend_react.md`
- Função: consolidar a auditoria funcional, visual e arquitetural da frente `Tabelas -> Tabela de procedimentos` no React.
- Quando consultar: antes de implementar a frente ou revisar o contrato extraido do legado.
- Status: vigente.
- Observação: complementa a auditoria anterior e registra evidencias do legado, backend e React.

### `docs/contrato_implementacao_tabela_procedimentos_frontend_react.md`
- Função: definir o contrato de implementacao da frente `Tabelas -> Tabela de procedimentos` no React.
- Quando consultar: antes de escrever componentes, hooks, servicos ou modais dessa frente.
- Status: vigente.
- Observação: documento mestre de implementacao da nova frente.

### `docs/matriz_mestre_prioridade_risco_refatoracao.md`
- FunÃ§Ã£o: orientar prioridade e risco para refatoraÃ§Ãµes.
- Quando consultar: antes de modularizaÃ§Ã£o, extraÃ§Ãµes ou cortes de escopo.
- Status: vigente.
- ObservaÃ§Ã£o: documento de decisÃ£o para reduÃ§Ã£o de risco.

## 3.1 Estado validado recente
- `docs/validacao_manual_final_signup_brana_pos_correcoes.md`
- `docs/auditoria_documentacao_geral_brana_cloud_pos_signup_brana.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3g_contrato_seed_canonico_brana.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3h_seed_canonico_brana_336.md`
- `docs/intervencoes_procedimentos_seed_brana_subetapa_3i_signup_consumindo_seed_canonico_brana.md`
- `docs/clinica_15_exclusao_segura_etapa_3_execucao_real_controlada.md`
- Estado validado: login/senha interna/perfis corrigidos, signup com Brana validado, Brana com seed canonico de 336 procedimentos, Tabela exemplo separada, PARTICULAR restrito a contas antigas e exclusoes seguras de teste documentadas.

## 4. UsuÃ¡rios, novas contas, access_profile e perfis de acesso

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

### Documentos relacionados Ã  UI UsuÃ¡rios/Perfis
- `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- `docs/users_admin_correcao_refresh_protected_grant.md`
- `docs/users_admin_plano_correcao_controlada_grant_perfis.md`
- `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- `docs/users_admin_primeira_separacao_real_execucao.md`
- `docs/sintese_primeira_separacao_real_usuarios_admin.md`

### Regra de consulta
Antes de qualquer ajuste em UsuÃ¡rios/Perfis de acesso, consultar obrigatoriamente:
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
Antes de qualquer alteraÃ§Ã£o em seeds ou nascimento de novas contas, consultar obrigatoriamente:
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_usuarios_novas_contas.md` quando envolver signup;
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`.

## 6. ExclusÃ£o segura de contas e clÃ­nicas

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
Antes de qualquer exclusÃ£o, consultar obrigatoriamente:
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- documentos de diagnÃ³stico da conta/clÃ­nica alvo.

## 7. ModularizaÃ§Ã£o e refatoraÃ§Ã£o segura

### Documentos vigentes ou de orientaÃ§Ã£o
- `docs/matriz_mestre_prioridade_risco_refatoracao.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`
- `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- `docs/reversao_controlada_modularizacao_frontend.md`
- `docs/modularizacao_alerta_recorrente_duplo_clique_binds.md`

### MÃ³dulos com trilhas documentadas, como apoio/histÃ³rico
- materiais
- intervenÃ§Ãµes/procedimentos
- convÃªnios/planos
- plano de contas
- medicamentos
- sÃ­mbolos grÃ¡ficos
- anamnese
- usuÃ¡rios

Documentos de anamnese, SQLServer e restauracao continuam em trilha separada e nao devem ser usados como fonte principal do estado atual quando houver contrato ou indice vigente.

O inventÃ¡rio completo das trilhas e documentos relacionados estÃ¡ em:
- `docs/inventario_organizacional_contratos_regras_seeds_usuarios.md`

## 8. Documentos histÃ³ricos e de apoio
Documentos de execuÃ§Ã£o, diagnÃ³stico, dry-run, validaÃ§Ã£o e fechamento sÃ£o importantes para rastreabilidade, mas nÃ£o devem substituir contratos vigentes quando houver documento de contrato.

Exemplos de apoio/histÃ³rico:
- subetapas de `access_profile`;
- etapas de exclusÃ£o clÃ­nica 8/9;
- diagnÃ³sticos de UI;
- auditorias Easydental;
- documentos de execuÃ§Ã£o pontual.

Esses documentos ajudam a entender o caminho percorrido, mas a consulta principal deve sempre privilegiar os contratos e regras vigentes listados acima.

## 9. Documentos candidatos a padronizaÃ§Ã£o futura

### `docs/pre_contrato_funcional_usuarios_novas_contas.md`
- Nome atual: `pre_contrato_funcional_usuarios_novas_contas.md`
- PossÃ­vel nome futuro: `contrato_usuarios_novas_contas_previa.md`
- ObservaÃ§Ã£o: nÃ£o renomeado nesta etapa.

### `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- Nome atual: `plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- PossÃ­vel nome futuro: `plano_access_profile_perfis_acesso.md`
- ObservaÃ§Ã£o: nÃ£o renomeado nesta etapa.

### `docs/users_admin_primeira_separacao_real_execucao.md`
- Nome atual: `users_admin_primeira_separacao_real_execucao.md`
- PossÃ­vel nome futuro: `users_admin_modal_visual_execucao.md`
- ObservaÃ§Ã£o: nÃ£o renomeado nesta etapa.

### `docs/sintese_primeira_separacao_real_usuarios_admin.md`
- Nome atual: `sintese_primeira_separacao_real_usuarios_admin.md`
- PossÃ­vel nome futuro: `users_admin_modal_visual_fechamento.md`
- ObservaÃ§Ã£o: nÃ£o renomeado nesta etapa.

### `docs/auditoria_fechamento_easydental_brana_contrato_usuarios.md`
- Nome atual: `auditoria_fechamento_easydental_brana_contrato_usuarios.md`
- PossÃ­vel nome futuro: `auditoria_contrato_usuarios_origem_easydental.md`
- ObservaÃ§Ã£o: nÃ£o renomeado nesta etapa.

### `docs/auditoria_profunda_easydental_manual_instalacao_seeds_usuarios.md`
- Nome atual: `auditoria_profunda_easydental_manual_instalacao_seeds_usuarios.md`
- PossÃ­vel nome futuro: `auditoria_seeds_usuarios_easydental.md`
- ObservaÃ§Ã£o: nÃ£o renomeado nesta etapa.

### `docs/auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- Nome atual: `auditoria_geral_refatoracao_frontend_backend_inventario_mestre.md`
- PossÃ­vel nome futuro: `inventario_refatoracao_frontend_backend.md`
- ObservaÃ§Ã£o: nÃ£o renomeado nesta etapa.

### `docs/varredura_comparativa_primeiro_modulo_modularizacao.md`
- Nome atual: `varredura_comparativa_primeiro_modulo_modularizacao.md`
- PossÃ­vel nome futuro: `modularizacao_varredura_primeiro_modulo.md`
- ObservaÃ§Ã£o: nÃ£o renomeado nesta etapa.

### `docs/varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md`
- Nome atual: `varredura_modulos_realmente_nao_iniciados_pos_simbolos_graficos.md`
- PossÃ­vel nome futuro: `modularizacao_varredura_modulos_nao_iniciados.md`
- ObservaÃ§Ã£o: nÃ£o renomeado nesta etapa.

### `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- Nome atual: `users_admin_pos_teste_403_forbidden_diagnostico.md`
- PossÃ­vel nome futuro: `users_admin_diagnostico_403_forbidden.md`
- ObservaÃ§Ã£o: nÃ£o renomeado nesta etapa.

## 10. PadrÃ£o futuro sugerido de nomes
Proposta, sem aplicaÃ§Ã£o nesta etapa:

- `docs/contrato_<area>_<assunto>.md`
- `docs/regras_<area>_<assunto>.md`
- `docs/<modulo>_<assunto>_diagnostico.md`
- `docs/<modulo>_<assunto>_plano.md`
- `docs/<modulo>_<assunto>_execucao.md`
- `docs/<modulo>_<assunto>_fechamento.md`
- `docs/inventario_<area>_<assunto>.md`
- `docs/indice_<area>_<assunto>.md`

## 11. Como usar este Ã­ndice nas prÃ³ximas etapas
### Para mexer na tela Perfis de acesso
1. consultar este Ã­ndice;
2. ler `docs/contrato_funcional_usuarios_novas_contas.md`;
3. ler `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`;
4. ler `docs/regras_blindagem_correcoes_textuais_mojibake.md`;
5. ler os documentos `users_admin` relacionados quando o ajuste envolver frontend;
6. sÃ³ entÃ£o criar diagnÃ³stico ou correÃ§Ã£o.

### Para mexer em seeds
1. consultar este Ã­ndice;
2. ler `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`;
3. ler os documentos de apoio de seeds;
4. validar banco/dry-run;
5. nÃ£o alterar strings.

### Para excluir clÃ­nica
1. consultar este Ã­ndice;
2. ler `docs/contrato_exclusao_segura_contas_clinicas.md`;
3. seguir diagnÃ³stico, backup, dry-run, execuÃ§Ã£o Ãºnica e validaÃ§Ã£o.

## 12. Limites deste Ã­ndice
- NÃ£o renomeia arquivos.
- NÃ£o consolida contratos.
- NÃ£o substitui contratos originais.
- NÃ£o apaga documentos histÃ³ricos.
- Deve ser atualizado futuramente se novos contratos forem criados.

## 13. PrÃ³ximas etapas recomendadas
1. Consolidar a trilha de Users / access_profile / perfis de acesso usando os documentos vigentes.
2. Criar ou atualizar um Ã­ndice especÃ­fico do mÃ³dulo UsuÃ¡rios, se necessÃ¡rio.
3. SÃ³ depois retomar diagnÃ³stico/correÃ§Ã£o da UI Perfis de acesso.

## 14. ConfirmaÃ§Ãµes
- Somente este documento foi criado.
- Nenhum cÃ³digo foi alterado.
- Banco nÃ£o foi alterado.
- Nenhum `DELETE`, `UPDATE` ou `INSERT` foi executado.
- Nenhum arquivo foi renomeado.
- Nenhum documento foi movido.
- Nenhum documento foi apagado.
- `signup`, `seeds` e `access_profile` nÃ£o foram alterados.
- `frontend` e `backend` nÃ£o foram alterados.
- Pastas proibidas nÃ£o foram tocadas.
- A blindagem textual/mojibake foi respeitada.
- Sem `git add`, `git commit` ou `git push`.

## 15. Contratos de shell e toolbar

### `docs/contrato_tecnico_toolbar_principal_brana_cloude.md`
- Funcao: formalizar a substituicao segura da toolbar principal do Brana Cloude com rollback preservado.
- Quando consultar: antes de remover, trocar ou refatorar a toolbar global.
- Status: vigente.
- Observacao: contrato documental para a transicao da toolbar; nao autoriza implementacao por si so.

### `docs/inventario_toolbar_principal_brana_cloude.md`
- Funcao: registrar o inventario tecnico da toolbar atual e da toolbar alvo do Brana Cloude, com mapeamento inicial de comandos e assets.
- Quando consultar: antes de qualquer implementacao, limpeza ou substituicao da toolbar.
- Status: vigente.
- Observacao: inventario documental; complementa o contrato tecnico da toolbar.

### `docs/matriz_toolbar_principal_botoes_alvo_brana_cloude.md`
- Funcao: organizar a lista de botoes alvo da toolbar principal do Brana Cloude, com mapeamento inicial de assets e handlers.
- Quando consultar: antes de montar a primeira onda da nova toolbar.
- Status: vigente.
- Observacao: matriz documental de trabalho; complementa o contrato tecnico e o inventario da toolbar.

### `docs/plano_execucao_toolbar_principal_brana_cloude.md`
- Funcao: definir o roteiro de execucao segura para substituir a toolbar principal do Brana Cloude por etapas com validacao e rollback preservados.
- Quando consultar: antes de iniciar qualquer implementacao da nova toolbar.
- Status: vigente.
- Observacao: plano de execucao; depende do contrato, inventario e matriz da toolbar.

### `docs/contrato_toolbar_primeira_onda_brana_cloude.md`
- Funcao: fechar a primeira onda de implementacao da nova toolbar do Brana Cloude em um conjunto minimo de botoes.
- Quando consultar: antes de implementar a fase inicial da toolbar nova.
- Status: vigente.
- Observacao: limita a primeira implementacao a cinco botoes essenciais e preserva rollback.

### `docs/checklist_execucao_toolbar_primeira_onda_brana_cloude.md`
- Funcao: transformar a primeira onda da toolbar em um checklist operacional para a futura implementacao.
- Quando consultar: no momento de codificar e validar a primeira onda.
- Status: vigente.
- Observacao: checklist de execucao; segue o contrato da primeira onda e o plano da toolbar.

### `docs/implementacao_toolbar_primeira_onda_brana_cloude.md`
- Funcao: registrar a implementacao isolada da primeira onda da nova toolbar do Brana Cloude.
- Quando consultar: apos aplicar a primeira onda no frontend.
- Status: vigente.
- Observacao: documento de implementacao; depende do contrato e do checklist da primeira onda.

### `docs/validacao_toolbar_primeira_onda_brana_cloude.md`
- Funcao: registrar a validacao tecnica da primeira onda da toolbar principal do Brana Cloude.
- Quando consultar: apos os testes manuais ou automatizados da primeira onda.
- Status: vigente.
- Observacao: validaÃ§Ã£o documental; referencia sintaxe, renderizacao e acao funcional testada.

## 16. Toolbar principal do Brana Cloude

### `docs/contrato_toolbar_primeira_onda_brana_cloude.md`
- Funcao: fechar a primeira onda de implementacao da toolbar principal com cinco botoes essenciais.
- Quando consultar: antes de alterar a primeira onda da toolbar.
- Status: vigente.
- Observacao: contrato da fase inicial da nova toolbar.

### `docs/implementacao_toolbar_primeira_onda_brana_cloude.md`
- Funcao: registrar a implementacao isolada da primeira onda da toolbar principal.
- Quando consultar: depois de aplicar a primeira onda no frontend.
- Status: vigente.
- Observacao: trilha de implementacao ja executada.

### `docs/validacao_toolbar_primeira_onda_brana_cloude.md`
- Funcao: registrar a validacao tecnica da primeira onda da toolbar principal.
- Quando consultar: apos testes de renderizacao e acao funcional.
- Status: vigente.
- Observacao: valida a primeira onda ja entregue.

### `docs/inventario_remocao_toolbar_legado_brana_cloude.md`
- Funcao: registrar os residuos da toolbar legada e a ordem segura de remocao.
- Quando consultar: antes de cortar HTML, CSS ou binds remanescentes da toolbar antiga.
- Status: vigente.
- Observacao: documento de apoio para a segunda onda de limpeza da toolbar.
