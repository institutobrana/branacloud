# Clínica 8 — Exclusão segura — Etapa 5 — Backup/export pré-exclusão

## Objetivo
Preparar backup/export documental e somente leitura da clínica 8, vinculada ao e-mail `institutobrana@gmail.com`, antes de qualquer exclusão futura. Esta etapa cria base de reversibilidade e auditoria sem executar `--execute` e sem alterar o banco.

## Contexto da decisão
A clínica 8 foi consolidada como conta de teste. A estratégia deixou de ser saneamento de `access_profile` e passou a ser exclusão segura futura para liberar `institutobrana@gmail.com` e permitir novo cadastro limpo.

## Arquivos criados
- `backend/scripts/export_test_clinic_backup.py`
- `docs/clinica_8_exclusao_segura_etapa_5_backup_pre_exclusao.md`

## Pasta de backup criada
- `backups/clinica_8_pre_exclusao/`

## Arquivos de backup gerados
- `backups/clinica_8_pre_exclusao/access_profile_clinica_8.json`
- `backups/clinica_8_pre_exclusao/anamnese_perguntas_clinica_8.json`
- `backups/clinica_8_pre_exclusao/anamnese_questionarios_clinica_8.json`
- `backups/clinica_8_pre_exclusao/categoria_financeira_clinica_8.json`
- `backups/clinica_8_pre_exclusao/clinica_8_core.json`
- `backups/clinica_8_pre_exclusao/convenio_odonto_clinica_8.json`
- `backups/clinica_8_pre_exclusao/counts_pre_exclusao.json`
- `backups/clinica_8_pre_exclusao/doenca_cid_clinica_8.json`
- `backups/clinica_8_pre_exclusao/grupo_financeiro_clinica_8.json`
- `backups/clinica_8_pre_exclusao/indice_financeiro_clinica_8.json`
- `backups/clinica_8_pre_exclusao/item_auxiliar_clinica_8.json`
- `backups/clinica_8_pre_exclusao/lista_material_clinica_8.json`
- `backups/clinica_8_pre_exclusao/manifest.json`
- `backups/clinica_8_pre_exclusao/material_lista_25.json`
- `backups/clinica_8_pre_exclusao/plano_odonto_clinica_8.json`
- `backups/clinica_8_pre_exclusao/plataforma_assinaturas_11.json`
- `backups/clinica_8_pre_exclusao/prestador_13.json`
- `backups/clinica_8_pre_exclusao/procedimento_clinica_8.json`
- `backups/clinica_8_pre_exclusao/procedimento_generico_clinica_8.json`
- `backups/clinica_8_pre_exclusao/procedimento_tabela_clinica_8.json`
- `backups/clinica_8_pre_exclusao/simbolo_grafico_catalogo_clinica_8.json`
- `backups/clinica_8_pre_exclusao/usuarios_19_20.json`

## Confirmações de segurança
- Não houve exclusão.
- O banco não foi alterado.
- Nenhum `DELETE`, `UPDATE`, `INSERT`, `TRUNCATE`, `DROP` ou `ALTER` foi executado.
- `--execute` não foi usado.
- O runner de exclusão não foi executado com `--execute`.
- `frontend`, `seeds`, `signup` e `access_profile` não foram alterados.

## Critério usado para exportar tabelas volumosas
As tabelas volumosas foram exportadas de forma somente leitura quando isso ainda era seguro e útil para reversibilidade. No caso de `doenca_cid`, a exportacao integral foi mantida porque o volume observado continuou aceitavel para backup local e reforca a capacidade de restauração futura. Para as demais tabelas volumosas, o export respeitou o recorte da clínica 8 e os vínculos confirmados na etapa anterior.

## Contagens principais confirmadas
- `access_profile: 16`
- `usuarios: 2`
- `prestador_odonto: 1`
- `plataforma_assinaturas: 1`
- `convenio_odonto: 10`
- `plano_odonto: 10`
- `procedimento_tabela: 2`
- `procedimento_generico: 591`
- `procedimento: 56`
- `lista_material: 1`
- `material: 244`
- `anamnese_questionarios: 3`
- `anamnese_perguntas: 41`
- `doenca_cid: 14486`
- `item_auxiliar: 1226`
- `simbolo_grafico_catalogo: 142`
- `categoria_financeira: 86`
- `grupo_financeiro: 13`
- `indice_financeiro: 4`
- `assinaturas: 0`
- `plataforma_cobrancas: 0`
- `pacientes: 0`
- `tratamento: 0`
- `anamnese_respostas: 0`
- `lancamento: 0`
- `agenda_legado_evento: 0`
- `agenda_legado_bloqueio: 0`
- `relatorio_config: 0`
- `usuario_perfil_acesso: 0`

## Validações feitas
- `current_database = brana_saas`
- `clinica_id = 8`
- `expected_email = institutobrana@gmail.com`
- clínica encontrada com nome `Instituto Brana`
- usuários `19` e `20` encontrados
- prestador `13` encontrado
- assinatura/plataforma `11` encontrada

## Limitações do backup
- O backup foi construído para preservar reversibilidade e auditoria, não para executar exclusão.
- A etapa não criou nenhum mecanismo de escrita.
- A etapa não liberou o e-mail para novo cadastro.
- A etapa não testou novo cadastro.

## Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `python -m py_compile backend/scripts/export_test_clinic_backup.py`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

## Recomendação da próxima etapa
Etapa 6 — implementar ou revisar a lógica de exclusão real controlada no runner, ainda sem executar `--execute`.
