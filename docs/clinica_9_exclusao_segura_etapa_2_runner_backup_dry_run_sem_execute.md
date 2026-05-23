# Clínica 9 — Exclusão segura — Etapa 2 — Runner, backup e dry-run sem `--execute`

## Contexto
- O contrato oficial de exclusão segura foi criado nesta trilha e deve ser seguido em toda exclusão de clínica/conta.
- A clínica 9 foi criada automaticamente pelo Codex via fluxo local de signup/backend.
- O objetivo futuro é excluir a clínica 9 com segurança para liberar novamente `institutobrana@gmail.com` e permitir teste manual real pela tela.

## Objetivo
- Preparar o runner e o backup/export da clínica 9 para exclusão segura.
- Executar backup/export somente leitura.
- Executar dry-run sem `--execute`.
- Não alterar o banco.
- Não excluir nada nesta etapa.

## Arquivos criados/alterados
- [backend/scripts/delete_test_clinic_9_runner.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/scripts/delete_test_clinic_9_runner.py)
- [backend/scripts/export_test_clinic_9_backup.py](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/backend/scripts/export_test_clinic_9_backup.py)
- [docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md)

## Backup criado
- Pasta: `backups/clinica_9_pre_exclusao/`
- Export somente leitura executado com sucesso.

## Lista de arquivos de backup
- `access_profile_clinica_9.json`
- `anamnese_perguntas_clinica_9.json`
- `anamnese_questionarios_clinica_9.json`
- `categoria_financeira_clinica_9.json`
- `clinica_9_core.json`
- `convenio_odonto_clinica_9.json`
- `counts_pre_exclusao.json`
- `doenca_cid_clinica_9.json`
- `email_codes_institutobrana.json`
- `etiqueta_modelo_clinica_9.json`
- `grupo_financeiro_clinica_9.json`
- `indice_financeiro_clinica_9.json`
- `item_auxiliar_clinica_9.json`
- `lista_material_clinica_9.json`
- `manifest.json`
- `material_lista_26.json`
- `plano_odonto_clinica_9.json`
- `plataforma_assinaturas_clinica_9.json`
- `prestador_14.json`
- `procedimento_clinica_9.json`
- `procedimento_generico_clinica_9.json`
- `procedimento_tabela_clinica_9.json`
- `simbolo_grafico_catalogo_clinica_9.json`
- `usuarios_21_22.json`

## Runner criado/ajustado
- Foi criado o runner específico [backend/scripts/delete_test_clinic_9_runner.py](/D:/BRANA%20ARQUIVOS%20BRANA%20CLOUD/backend/scripts/delete_test_clinic_9_runner.py).
- Ele mantém `dry-run` como padrão.
- Ele exige `--clinica-id 9` e `--expected-email institutobrana@gmail.com`.
- Ele inclui `email_codes` no plano de exclusão futura para liberar o e-mail reutilizável.
- Ele preserva `modelos_documento` e `etiqueta_padrao`.
- Ele não altera o runner da clínica 8.

## Validações implementadas
- `current_database = brana_saas`.
- `clinicas.id = 9` existe.
- `email = institutobrana@gmail.com`.
- `usuarios 21/22` encontrados.
- `prestador 14` encontrado.
- `access_profile = 10`.
- `etiqueta_modelo = 8`.
- `plataforma_assinaturas` presente.
- `email_codes` encontrados.
- dados impeditivos zerados:
  - `pacientes`
  - `tratamento`
  - `lancamento`
  - `agenda_legado_evento`
  - `agenda_legado_bloqueio`
  - `anamnese_respostas`
  - `plataforma_cobrancas`
  - `usuario_perfil_acesso`
- `VINCULOS_NAO_MAPEADOS = []`.
- `VINCULOS_USUARIO_EXTRA = []`.
- `VINCULOS_PRESTADOR_EXTRA = []`.

## Ordem planejada de exclusão
1. `email_codes` relacionados a `institutobrana@gmail.com`
2. `procedimento_material` / `procedimento_fase` / `procedimento_generico_fase` / `procedimento_generico_material`
3. `material` por `lista_material` relacionada
4. `lista_material`
5. `anamnese_perguntas`
6. `anamnese_questionarios`
7. `plano_odonto`
8. `convenio_odonto`
9. `procedimento`
10. `procedimento_generico`
11. `procedimento_tabela`
12. `categoria_financeira`
13. `grupo_financeiro`
14. `indice_financeiro`
15. `item_auxiliar`
16. `simbolo_grafico_catalogo`
17. `doenca_cid`
18. `usuario_perfil_acesso`
19. `access_profile`
20. `etiqueta_modelo`
21. `plataforma_assinaturas`
22. `prestador_odonto`
23. `usuarios.id 21 e 22`
24. `clinicas.id = 9` por último

## Resultado do backup/export
- Executado em modo somente leitura.
- `DATABASE_ATUAL = brana_saas`.
- Arquivos de backup gerados corretamente dentro de `backups/clinica_9_pre_exclusao/`.
- `email_codes_institutobrana.json` foi incluído para rastreabilidade do e-mail reutilizável.

## Resultado do dry-run
- `MODO: DRY-RUN`.
- `DATABASE_ATUAL: brana_saas`.
- `CLINICA_REMANESCENTE: True`.
- `ETIQUETA_MODELO_RELATORIO`:
  - `count = 8`
  - `ids = [83, 84, 85, 86, 87, 88, 89, 90]`
  - `matches_expected = true`
- `EMAIL_CODES_ENCONTRADOS` com 2 registros.
- `PLATAFORMA_AUDITORIA_ENCONTRADA: []`.
- `VINCULOS_NAO_MAPEADOS: []`.
- `VINCULOS_USUARIO_EXTRA: []`.
- `VINCULOS_PRESTADOR_EXTRA: []`.
- `PROXIMO_PASSO_EXECUTE = DELETE FROM clinicas WHERE id = :clinica_id AND email = :expected_email`.
- nada foi alterado no dry-run.

## Confirmações
- `--execute` não foi usado.
- Nada foi excluído.
- O banco não foi alterado.
- Nenhum `DELETE`, `UPDATE` ou `INSERT` foi executado.
- `frontend`, `seeds`, `signup` e `access_profile` não foram alterados.
- `modelos_documento` e `etiqueta_padrao` não serão apagados por este runner.
- Pastas proibidas não foram tocadas.
- Não houve `git add`, `commit` ou `push`.

## Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py`
- `python -m py_compile backend/scripts/export_test_clinic_backup.py`
- `python -m py_compile backend/scripts/delete_test_clinic_9_runner.py`
- `python -m py_compile backend/scripts/export_test_clinic_9_backup.py`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

## Estado final do git status --short
- O workspace continua com os untracked preexistentes do repositório.
- Foram adicionados os novos arquivos desta etapa:
  - `backend/scripts/delete_test_clinic_9_runner.py`
  - `backend/scripts/export_test_clinic_9_backup.py`
  - `docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`

## Próxima etapa recomendada
- Etapa 9D: execução real controlada da exclusão da clínica 9, com autorização explícita, usando `--execute` uma única vez.
