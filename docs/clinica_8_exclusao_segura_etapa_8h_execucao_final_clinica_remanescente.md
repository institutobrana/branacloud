# Clínica 8 — Exclusão segura — Etapa 8H — Execução final controlada da clínica remanescente

## Autorização explícita registrada
Houve autorização humana explícita para executar a remoção final da clínica remanescente `clinica_id = 8`, `expected_email = institutobrana@gmail.com`, usando o comando autorizado com `--execute`.

## Contexto
- A Etapa 8F removeu os vínculos dependentes, mas deixou `clinicas.id = 8`.
- A Etapa 8G corrigiu o runner para tratar corretamente a clínica remanescente.
- Nesta etapa, o dry-run pré-execução confirmou o estado parcial esperado.
- A execução real autorizada foi tentada uma única vez, mas o runner bloqueou por validação conservadora de `etiqueta_modelo` antes de qualquer DELETE final.

## Comando de dry-run pré-execução
`python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com`

## Resultado do dry-run pré-execução
- `DATABASE_ATUAL = brana_saas`
- `clinicas.id = 8` ainda existe
- `email = institutobrana@gmail.com`
- `CLINICA_REMANESCENTE = True`
- `usuarios 19/20` ausentes e tratados como OK
- `prestador 13` ausente e tratado como OK
- `access_profile = 0`
- `etiqueta_modelo = 0`
- `usuario_perfil_acesso = 0`
- `plataforma_assinaturas = 0`
- todas as tabelas remanescentes por `clinica_id = 8` ficaram zeradas
- `VINCULOS_NAO_MAPEADOS = []`
- `AUDITORIA_EMAIL = []`
- `VINCULOS_USUARIO_EXTRA = []`
- `VINCULOS_PRESTADOR_EXTRA = []`
- `PROXIMO_PASSO_EXECUTE = DELETE FROM clinicas WHERE id = :clinica_id AND email = :expected_email`
- nada foi alterado no dry-run

## Comando real executado com `--execute`
`python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com --execute`

## Confirmação de tentativa única
O comando real foi executado uma única vez.

## Resultado da execução real
A execução real não concluiu a remoção final nesta etapa. O runner bloqueou por validação conservadora antes do DELETE final de `clinicas`.

## Motivo do bloqueio
O runner ainda estava com uma validação conservadora que exigia `etiqueta_modelo` no formato anterior. Como o estado parcial atual já estava zerado em `etiqueta_modelo`, a validação bloqueou a execução real antes do DELETE final.

## Rowcount / commit / rollback
- Não houve `rowcount = 1` no DELETE final de `clinicas`, porque a etapa foi bloqueada antes do fechamento final.
- Não houve commit desta etapa.
- Não houve rollback necessário nesta etapa, porque nenhum DELETE final foi concluído.

## Correção aplicada para o próximo passo
O runner foi ajustado para aceitar o estado parcial atual sem travar apenas por `etiqueta_modelo = 0`, mantendo o caminho futuro de:

`DELETE FROM clinicas WHERE id = :clinica_id AND email = :expected_email`

## Validações pós-bloqueio
- `clinicas.id = 8` continua existindo.
- `institutobrana@gmail.com` continua preso à clínica 8.
- `usuarios 19 e 20` continuam ausentes.
- `prestador_odonto.id 13` continua ausente.
- `access_profile = 0`
- `etiqueta_modelo = 0`
- `usuario_perfil_acesso = 0`
- `plataforma_assinaturas = 0`
- `modelos_documento` não foi apagado.
- `etiqueta_padrao` não foi apagada.
- clínicas `1` e `4` não foram afetadas.

## Confirmação de integridade
- `frontend` não foi alterado.
- `seeds/signup` não foram alterados.
- Não houve `git add`, `commit` ou `push`.

## Resultados dos checks
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py`
- `python -m py_compile backend/scripts/export_test_clinic_backup.py`
- `python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

## Estado final do `git status --short`
O workspace permanece com os untracked preexistentes do repositório e com este documento da Etapa 8H. Não houve diff em arquivos versionados.

## Próxima etapa recomendada
Nova etapa específica de correção/retentativa apenas se houver autorização explícita, porque a tentativa desta etapa foi bloqueada antes do fechamento final da clínica.
