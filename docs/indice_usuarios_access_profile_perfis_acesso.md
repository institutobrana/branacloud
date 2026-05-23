# Índice do módulo Usuários, access_profile e Perfis de acesso — Brana Cloud

## 1. Objetivo
Este índice organiza as fontes de verdade e documentos de apoio do módulo Usuários antes de qualquer ajuste funcional.

Ele não substitui contratos originais.

Ele serve para orientar o Codex/assistente sobre quais documentos ler antes de mexer em Usuários, access_profile, signup ou UI Perfis de acesso.

## 2. Regra de uso
Antes de qualquer ajuste em Usuários ou Perfis de acesso, o Codex deve:

1. consultar este índice;
2. consultar o índice oficial geral:
   `docs/indice_oficial_contratos_regras_vigentes.md`
3. ler:
   - `docs/regras_blindagem_correcoes_textuais_mojibake.md`
   - `docs/contrato_funcional_usuarios_novas_contas.md`
   - `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
4. se o ajuste envolver seeds/nova clínica, ler:
   - `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
5. se envolver UI, ler os documentos `users_admin` relacionados;
6. documentar na etapa quais contratos foram consultados.

## 3. Contratos e fontes de verdade vigentes do módulo

### `docs/contrato_funcional_usuarios_novas_contas.md`
- Função: contrato funcional definitivo do módulo Usuários para novas contas, incluindo nascimento da clínica, primeiro usuário, senha protegida, perfis e regras de acesso.
- Status: vigente.
- Quando consultar: antes de qualquer alteração em Usuários, signup, novo cadastro, perfis, licença ou comportamento do primeiro acesso.
- Regras principais que define: nova conta nasce com clínica, primeiro usuário ADM/dono, prestador sistemico `ClÃ­nica`, primeiro acesso com setup, senha protegida, tipos de usuário, baseline de permissões, relação com `access_profile` e `usuario_perfil_acesso`.

### `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- Função: plano técnico base para alinhar `access_profile`, bootstrap e aba Perfis de acesso.
- Status: vigente / plano técnico base.
- Quando consultar: antes de qualquer ajuste em `access_profile`, bootstrap, signup ou UI Perfis de acesso.
- Relação com os 10 perfis padrão e UI Perfis de acesso: documenta a base funcional dos perfis, a fonte versionada e o comportamento esperado da UI quando a base existir.

### `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- Função: contrato vigente para seeds mínimos no nascimento de novas contas.
- Status: vigente para seeds/nascimento de novas contas.
- Quando consultar: antes de qualquer alteração em seeds, nascimento de nova clínica, signup ou carregamento inicial de dados.

### `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- Função: regra obrigatória global de blindagem para textos, acentos, placeholders, mojibake e strings visíveis.
- Status: obrigatório global.
- Quando consultar: antes de qualquer ajuste textual, de UI, de labels ou de mensagens visíveis.

## 4. Regras consolidadas do módulo Usuários/access_profile
Com base nos documentos vigentes, as regras já consolidadas são:

- novas clínicas devem nascer com 10 `access_profile` padrão;
- a lista oficial dos 10 perfis deve manter grafia exata:
  - Agenda de horarios
  - Controle de estoque
  - Controle de protetico
  - Controle de recibos
  - Creditos na conta corrente
  - Debitos na conta corrente
  - Intervencoes
  - Pacientes
  - Relatorios estatisticos
  - Relatorios financeiros
- não corrigir acentos/grafia desses nomes sem autorização explícita;
- signup deve chamar o bootstrap oficial de `access_profile`;
- bootstrap deve ser idempotente;
- bootstrap não deve duplicar perfis;
- bootstrap não deve sobrescrever vínculos de usuário;
- `usuario_perfil_acesso` não deve ser populado automaticamente sem regra validada;
- clínicas antigas podem ser saneadas por runner controlado;
- clínicas 1 e 4 já foram saneadas para 10/10;
- clínica 8 foi conta de teste excluída;
- clínica 9 foi criada automaticamente e depois excluída para liberar teste manual;
- admin/dono/protegido devem ser respeitados;
- senha protegida deve ser respeitada;
- licença/permissões devem ser respeitadas;
- UI não deve alterar regra de seed/signup;
- correções de UI não devem mexer em bootstrap, seeds ou signup sem etapa específica.

## 5. Trilha access_profile — documentos de apoio

### `docs/access_profile_subetapa_1_fonte_versionada_passiva.md`
- Papel: registrar a fonte versionada passiva de perfis.
- Status: apoio/histórico.
- Quando consultar: ao investigar a origem oficial dos perfis e a ideia de fonte versionada.

### `docs/access_profile_subetapa_2_bootstrap_idempotente_controlado.md`
- Papel: documentar o bootstrap idempotente e controlado.
- Status: apoio/histórico.
- Quando consultar: ao revisar o mecanismo de criação dos 10 perfis em novas clínicas.

### `docs/access_profile_subetapa_3a_dry_run_controlado.md`
- Papel: registrar dry-run controlado da trilha.
- Status: validação.
- Quando consultar: antes de qualquer materialização ou execução real.

### `docs/access_profile_subetapa_3b_execucao_dry_run_somente_leitura.md`
- Papel: detalhar a execução do dry-run em modo somente leitura.
- Status: validação.
- Quando consultar: para validar o comportamento sem alterar banco.

### `docs/access_profile_subetapa_4_acoplamento_signup_novas_clinicas.md`
- Papel: documentar o acoplamento do bootstrap ao signup de novas clínicas.
- Status: apoio/histórico.
- Quando consultar: ao estudar o nascimento de novas contas e a integração com signup.

### `docs/access_profile_subetapa_4a_validacao_signup_sem_sujar_banco.md`
- Papel: validar signup sem sujar banco.
- Status: validação.
- Quando consultar: antes de qualquer teste real em ambiente isolado.

### `docs/access_profile_subetapa_5d_signup_real_banco_isolado.md`
- Papel: registrar signup real em banco isolado.
- Status: validação.
- Quando consultar: ao revisar a trilha de nascimento real de conta em ambiente seguro.

### `docs/access_profile_subetapa_5f_corrige_bootstrap_materializacao.md`
- Papel: registrar correção do bootstrap/materialização.
- Status: apoio/histórico.
- Quando consultar: ao entender ajustes que tornaram o bootstrap materializável.

### `docs/access_profile_subetapa_5g_signup_real_apos_correcao_bootstrap.md`
- Papel: documentar signup real após a correção do bootstrap.
- Status: validação.
- Quando consultar: para confirmar o fluxo validado após ajuste.

### `docs/access_profile_subetapa_6a_consolidacao_trilha_validada.md`
- Papel: consolidar a trilha validada.
- Status: apoio/histórico.
- Quando consultar: quando for preciso revisar a trilha já validada e fechada.

### `docs/access_profile_subetapa_6b_estrategia_clinicas_existentes.md`
- Papel: registrar a estratégia para clínicas existentes.
- Status: apoio/histórico.
- Quando consultar: ao tratar clínicas que já existiam sem base funcional completa.

### `docs/access_profile_subetapa_6e_runner_controlado_clinicas_existentes.md`
- Papel: documentar runner controlado para clínicas existentes.
- Status: apoio/histórico.
- Quando consultar: ao revisar a execução controlada em bases já existentes.

### `docs/access_profile_subetapa_6f_execucao_runner_clinica_1.md`
- Papel: registrar a execução do runner na clínica 1.
- Status: validação.
- Quando consultar: quando a clínica 1 for referência de saneamento.

### `docs/access_profile_subetapa_6g_validacao_pos_correcao_clinica_1.md`
- Papel: validar o pós-correção da clínica 1.
- Status: validação.
- Quando consultar: antes de usar a clínica 1 como referência funcional.

### `docs/access_profile_subetapa_6i_execucao_runner_clinica_4.md`
- Papel: registrar a execução do runner na clínica 4.
- Status: validação.
- Quando consultar: quando a clínica 4 for referência de saneamento.

### `docs/access_profile_subetapa_6j_validacao_pos_correcao_clinica_4.md`
- Papel: validar o pós-correção da clínica 4.
- Status: validação.
- Quando consultar: antes de usar a clínica 4 como referência funcional.

## 6. Trilha UI Usuários / Perfis de acesso

### `docs/users_admin_diagnostico_fluxo_protegido_seed_perfis.md`
- Papel: diagnóstico do fluxo protegido envolvendo seed e perfis.
- Status: apoio.
- Relação com UI: útil para entender o estado protegido e o carregamento de perfis.
- Deve ser lido antes da próxima correção: sim, se o ajuste envolver fluxo protegido ou renderização da aba.

### `docs/users_admin_diagnostico_protecao_permissoes_perfis.md`
- Papel: diagnóstico da proteção de permissões e perfis.
- Status: apoio.
- Relação com UI: explica proteção, grant e permissões na tela.
- Deve ser lido antes da próxima correção: sim, se o problema envolver permissão ou bloqueio.

### `docs/users_admin_correcao_refresh_protected_grant.md`
- Papel: correção do refresh protegido.
- Status: apoio/execução.
- Relação com UI: ligado ao comportamento de refresh da tela Usuários.
- Deve ser lido antes da próxima correção: sim, se a falha for de refresh/grant.

### `docs/users_admin_plano_correcao_controlada_grant_perfis.md`
- Papel: plano de correção controlada de grant e perfis.
- Status: apoio.
- Relação com UI: descreve abordagem controlada para a tela.
- Deve ser lido antes da próxima correção: sim, se houver mudança no grant protegido.

### `docs/users_admin_pos_teste_403_forbidden_diagnostico.md`
- Papel: diagnóstico após teste 403 Forbidden.
- Status: apoio.
- Relação com UI: registra o comportamento esperado de acesso negado.
- Deve ser lido antes da próxima correção: sim, quando o problema for autorização/bloqueio.

### `docs/users_admin_primeira_separacao_real_execucao.md`
- Papel: registrar a primeira separação real do modal visual.
- Status: execução.
- Relação com UI: mostra o recorte visual já feito.
- Deve ser lido antes da próxima correção: sim, para não recuar o recorte já validado.

### `docs/sintese_primeira_separacao_real_usuarios_admin.md`
- Papel: síntese da primeira separação real.
- Status: apoio/fechamento.
- Relação com UI: resume a separação do modal de usuários.
- Deve ser lido antes da próxima correção: sim, como referência rápida do que já foi separado.

## 7. Fluxo de nascimento de nova clínica
Fluxo consolidado, sem alterar código:

- signup;
- criação da clínica;
- criação do usuário sistema;
- criação do usuário admin/dono;
- criação de prestador, se aplicável;
- assinatura/trial/DEMO, se aplicável;
- bootstrap dos 10 `access_profile`;
- seeds mínimas conforme contrato de seeds;
- validação posterior no banco.

Documentos que fundamentam esse fluxo:
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/plano_tecnico_access_profile_perfis_acesso_usuarios.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/07_fluxos.md`
- `docs/05_banco_dados.md`
- `docs/06_seguranca.md`
- `docs/access_profile_subetapa_4_acoplamento_signup_novas_clinicas.md`
- `docs/access_profile_subetapa_5d_signup_real_banco_isolado.md`
- `docs/access_profile_subetapa_5g_signup_real_apos_correcao_bootstrap.md`

## 8. Arquivos de código relacionados, apenas como referência

### Seeds
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/seeds/access_profiles_existing_clinics_runner.py`

### Signup
- `backend/services/signup_service.py`
- `backend/schemas/signup_schema.py`
- `backend/routes/auth_routes.py`
- `backend/services/runtime_bootstrap_service.py`

### Usuários
- `backend/routes/user_admin_routes.py`
- `backend/models/access_profile.py`
- `backend/models/usuario_perfil_acesso.py`
- `backend/services/access_profiles_service.py`
- `backend/security/user_context.py`
- `backend/security/permissions.py`
- `backend/security/dependencies.py`

### Frontend
- `frontend/app.js`
- `frontend/js/modules/users-admin-modal-visual.js`

Papel geral por grupo:
- Seeds: origem dos perfis padrão e dos fluxos controlados de novas clínicas.
- Signup: ponto de nascimento da clínica e gatilho da base inicial.
- Usuários: persistência, acesso e vínculo entre usuário, perfil e prestador.
- Frontend: tela, modal, refresh, combos e experiência do Usuário.

## 9. O que NÃO fazer em ajustes futuros de UI
- não mexer em signup ao corrigir UI, salvo etapa específica;
- não mexer em seeds ao corrigir UI, salvo etapa específica;
- não alterar nomes dos 10 perfis;
- não corrigir acentos dos perfis;
- não criar perfis duplicados;
- não popular `usuario_perfil_acesso` sem regra;
- não alterar admin/dono/protegido sem diagnóstico;
- não alterar senha protegida sem diagnóstico;
- não corrigir textos/mojibake junto com lógica;
- não misturar exclusão de clínicas com UI;
- não usar clínica 9, pois ela foi excluída;
- não recriar `institutobrana@gmail.com` até a UI estar pronta para teste manual.

## 10. Como retomar a UI Perfis de acesso depois deste índice
Próxima etapa recomendada:

**Usuários / Perfis de acesso — Subetapa 0 — diagnóstico da UI em contas existentes, sem alterar código.**

Essa próxima etapa deve:
- consultar este índice;
- consultar os contratos vigentes;
- usar clínicas 1 e 4 como referência;
- confirmar 10 `access_profile` no banco;
- mapear frontend/backend/endpoints;
- identificar se o problema é frontend, endpoint, payload, cache, refresh ou permissão;
- não alterar código ainda.

## 11. Limites deste índice
- não altera contratos;
- não consolida documentos em um só;
- não renomeia arquivos;
- não move documentos;
- não substitui documentos originais;
- deve ser atualizado se novos contratos de Usuários forem criados.

## 12. Confirmações da etapa
- somente este documento foi criado;
- nenhum código foi alterado;
- banco não foi alterado;
- nenhum `DELETE`, `UPDATE` ou `INSERT`;
- nenhum arquivo foi renomeado;
- nenhum documento foi movido;
- nenhum documento foi apagado;
- `signup`, `seeds` e `access_profile` não foram alterados;
- `frontend` e `backend` não foram alterados;
- pastas proibidas não foram tocadas;
- blindagem textual/mojibake respeitada;
- sem `git add`, `git commit` ou `git push`.
