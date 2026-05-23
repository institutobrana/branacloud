# Clínica 8 — Exclusão segura — Etapa 8I — Execução final controlada da clínica remanescente

## Autorização explícita registrada
Houve autorização humana explícita para executar a remoção final da clínica remanescente `clinica_id = 8`, `expected_email = institutobrana@gmail.com`, usando o comando autorizado com `--execute`.

## Contexto
- A Etapa 8F removeu os vínculos dependentes, mas deixou `clinicas.id = 8`.
- A Etapa 8G corrigiu o DELETE final da clínica.
- A Etapa 8H bloqueou por validação antiga de `etiqueta_modelo = 8`.
- A Etapa 8H ajustou o runner para aceitar o estado parcial com `etiqueta_modelo = 0`.

## Comando de dry-run pré-execução
`python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com`

## Resultado do dry-run pré-execução
- `DATABASE_ATUAL = brana_saas`
- `clinicas.id = 8` ainda existia
- `email = institutobrana@gmail.com`
- `CLINICA_REMANESCENTE = True`
- `usuarios 19/20` ausentes e tratados como OK
- `prestador 13` ausente e tratado como OK
- `access_profile = 0`
- `etiqueta_modelo = 0`
- `usuario_perfil_acesso = 0`
- `plataforma_assinaturas = 0`
- todas as tabelas remanescentes por `clinica_id = 8` estavam zeradas
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
A execução real concluiu com sucesso e removeu a linha remanescente da clínica 8.

## Rowcount / commit / rollback
- `rowcount = 1` no DELETE de `clinicas`
- commit de banco ocorreu ao final da rotina
- não houve rollback

## Validações pós-exclusão
- `clinicas.id = 8` não existe
- `institutobrana@gmail.com` foi liberado
- `institutobrana@gmail.com` não está preso na tabela de usuários/autenticação
- `usuarios.id 19 e 20` não existem
- `prestador_odonto.id 13` não existe
- `access_profile da clínica 8 = 0`
- `etiqueta_modelo da clínica 8 = 0`
- `usuario_perfil_acesso da clínica 8 = 0`
- `plataforma_assinaturas da clínica 8 = 0`
- tabelas por `clinica_id = 8` continuam zeradas
- `modelos_documento` não foi apagado
- `etiqueta_padrao` não foi apagada
- clínicas `1` e `4` não foram afetadas
- banco continua `brana_saas`

## Confirmação de integridade
- `frontend` não foi alterado
- `seeds/signup` não foram alterados
- não houve `git add`, `commit` ou `push`

## Resultado do dry-run pós-exclusão
- o runner aborta controladamente com `clinica nao encontrada: 8`, confirmando a ausência esperada da clínica 8

## Checks executados
- `git status --short`
- `git diff --stat`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py`
- `python -m py_compile backend/scripts/export_test_clinic_backup.py`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

## Estado final do `git status --short`
O workspace permanece com os untracked preexistentes do repositório e com este documento da Etapa 8I. Não houve diff em arquivos versionados.

## Próxima etapa recomendada
Etapa 9 — validação do novo cadastro limpo com `institutobrana@gmail.com`, sem mexer em seeds/access_profile salvo necessidade diagnosticada.
