# Clínica 9 — Exclusão segura — Etapa 3 — Execução real controlada

## Autorização explícita registrada
- Autorização humana explícita recebida para executar a exclusão real controlada da clínica 9.
- Comando autorizado:
  - `python backend/scripts/delete_test_clinic_9_runner.py --clinica-id 9 --expected-email institutobrana@gmail.com --execute`

## Contexto
- O contrato oficial de exclusão segura foi criado nesta trilha.
- A clínica 9 foi criada pelo Codex via fluxo local de signup/backend.
- O diagnóstico somente leitura foi concluído.
- O backup/export pré-exclusão foi concluído.
- O dry-run pré-execução passou antes da execução real.

## Comando de dry-run pré-execução
```powershell
python backend/scripts/delete_test_clinic_9_runner.py --clinica-id 9 --expected-email institutobrana@gmail.com
```

## Resultado do dry-run pré-execução
- `DATABASE_ATUAL = brana_saas`
- `clinicas.id = 9` existia
- `email = institutobrana@gmail.com`
- `usuarios = 21 e 22`
- `prestador = 14`
- `plataforma_assinaturas = 12`
- `access_profile = 10`
- `etiqueta_modelo = 8`
- `etiqueta_modelo IDs = 83 a 90`
- `email_codes = 2`
- `VINCULOS_NAO_MAPEADOS = []`
- `VINCULOS_USUARIO_EXTRA = []`
- `VINCULOS_PRESTADOR_EXTRA = []`
- dados impeditivos zerados
- `modelos_documento` e `etiqueta_padrao` não seriam apagados
- ordem planejada de exclusão confirmada
- nada foi alterado no dry-run

## Comando real executado com `--execute`
```powershell
python backend/scripts/delete_test_clinic_9_runner.py --clinica-id 9 --expected-email institutobrana@gmail.com --execute
```

## Confirmação de execução única
- O comando real foi executado uma única vez.

## Resultado da execução real
- A exclusão controlada foi concluída com sucesso.
- O runner executou a ordem planejada.
- O DELETE final de `clinicas` afetou exatamente 1 linha.
- O commit do banco ocorreu ao final da rotina.

## Confirmação de `rowcount = 1`
- `DELETE FROM clinicas WHERE id = :clinica_id AND email = :expected_email` retornou `rowcount = 1`.

## Confirmação de commit
- O runner informou sucesso ao final da rotina com commit concluído.

## Confirmação de rollback
- Não houve rollback nesta execução, porque a rotina concluiu com sucesso.

## Validações pós-exclusão
- `clinicas.id = 9` não existe.
- `institutobrana@gmail.com` foi liberado.
- `institutobrana@gmail.com` não permaneceu preso em clinicas/usuarios.
- `email_codes` de `institutobrana@gmail.com` foram removidos.
- `usuarios.id 21 e 22` não existem.
- `prestador_odonto.id 14` não existe.
- `access_profile` da clínica 9 = 0.
- `etiqueta_modelo` da clínica 9 = 0.
- `usuario_perfil_acesso` da clínica 9 = 0.
- `plataforma_assinaturas` da clínica 9 = 0.
- tabelas por `clinica_id = 9` continuam zeradas.
- `modelos_documento` não foi apagado.
- `etiqueta_padrao` não foi apagada.
- clínicas 1 e 4 não foram afetadas.
- banco continua `brana_saas`.

## Confirmação de preservação
- `frontend` não foi alterado.
- `seeds` não foram alterados.
- `signup` não foi alterado.
- `access_profile` não foi alterado manualmente.
- Não houve `git add`, `commit` ou `push`.

## Resultado dos checks
- `git branch --show-current` -> `modularizacao-segura-fase-1`
- `git status --short` -> conferido
- `git diff --stat` -> sem diff em arquivos versionados
- `git log --oneline -10` -> conferido
- `node --check frontend/app.js` -> OK
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> OK
- `python -m py_compile backend/scripts/delete_test_clinic_9_runner.py` -> OK
- `python -m py_compile backend/scripts/export_test_clinic_9_backup.py` -> OK
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py` -> OK
- `python -m py_compile backend/scripts/export_test_clinic_backup.py` -> OK
- `python -m py_compile backend/seeds/access_profiles_default.py` -> OK
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py` -> OK
- `python -m py_compile backend/seeds/access_profiles_dry_run.py` -> OK
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py` -> OK
- `python -m py_compile backend/services/signup_service.py` -> OK
- `python -m py_compile backend/database.py` -> OK

## Estado final do git status --short
- O workspace continua com os untracked preexistentes do repositório.
- Foram adicionados os artefatos desta etapa:
  - `backend/scripts/delete_test_clinic_9_runner.py`
  - `backend/scripts/export_test_clinic_9_backup.py`
  - `docs/clinica_9_exclusao_segura_etapa_2_runner_backup_dry_run_sem_execute.md`
  - `docs/clinica_9_exclusao_segura_etapa_3_execucao_real_controlada.md`

## Próxima etapa recomendada
- Etapa 9E: teste manual real pela tela de cadastro/login usando `institutobrana@gmail.com`.
