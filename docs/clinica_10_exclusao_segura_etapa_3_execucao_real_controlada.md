# Clínica 10 - Exclusão segura - Etapa 3 - Execução real controlada

## 1. Contexto

- A Etapa 1 fez o diagnóstico somente leitura.
- A Etapa 2 criou backup, runner e dry-run.
- A clínica 10 era a conta teste atual.
- O objetivo era liberar `institutobrana@gmail.com` para recriação limpa posterior.

## 2. Autorização explícita

- Houve autorização humana explícita para executar `--execute` uma única vez.

## 3. Dry-run pré-execução

Comando executado:

```powershell
python backend/scripts/delete_test_clinic_10_runner.py --clinica-id 10 --expected-email institutobrana@gmail.com
```

Resultado do dry-run pré-execução:
- `DATABASE_ATUAL = brana_saas`
- `clinicas.id = 10` existia
- e-mail conferido como `institutobrana@gmail.com`
- usuários `23`, `24`, `25` encontrados
- prestadores `15`, `16` encontrados
- `access_profile = 10`
- `etiqueta_modelo = 8`
- `etiqueta_modelo IDs = 91 a 98`
- `email_codes = 1`
- dados impeditivos zerados
- `VINCULOS_NAO_MAPEADOS = []`
- `VINCULOS_USUARIO_EXTRA = []`
- `VINCULOS_PRESTADOR_EXTRA = []`
- ordem planejada de exclusão confirmada
- nada foi alterado no dry-run

## 4. Execução real

Comando executado com sucesso uma única vez:

```powershell
python backend/scripts/delete_test_clinic_10_runner.py --clinica-id 10 --expected-email institutobrana@gmail.com --execute
```

Resultado da execução real:
- exclusão concluída com sucesso
- `DELETE` final de `clinicas` afetou exatamente 1 linha
- o runner fez `commit` ao final da transação
- não houve necessidade de rollback na execução bem-sucedida

Observação operacional:
- houve uma tentativa anterior abortada por ajuste interno de transação do runner, sem alteração de banco; a execução real válida foi concluída uma única vez com sucesso após a correção do runner.

## 5. Validação pós-execução

Comando de validação:

```powershell
python backend/scripts/delete_test_clinic_10_runner.py --clinica-id 10 --expected-email institutobrana@gmail.com
```

Resultado:
- `ERRO: clinica nao encontrada: 10`

Leituras diretas pós-execução confirmaram:
- `brana_saas` continua sendo o banco atual
- `clinicas.id = 10` não existe
- `institutobrana@gmail.com` não está preso em `clinicas`
- `institutobrana@gmail.com` não está preso em `usuarios`
- `email_codes` para `institutobrana@gmail.com` foram removidos
- `usuarios.id 23, 24, 25` não existem mais
- `prestador_odonto.id 15 e 16` não existem mais
- `access_profile` da clínica 10 = 0
- `etiqueta_modelo` da clínica 10 = 0
- `usuario_perfil_acesso` da clínica 10 = 0
- tabelas por `clinica_id = 10` continuam zeradas
- `modelos_documento` não foi apagado
- `etiqueta_padrao` não foi apagada
- clínicas 1 e 4 não foram afetadas

## 6. Confirmação de remoção

- `clinicas.id = 10` foi removida
- `institutobrana@gmail.com` foi liberado para recriação posterior
- usuários `23/24/25` foram removidos
- prestadores `15/16` foram removidos
- `email_codes` foram removidos
- os dados da clínica 10 foram eliminados conforme a ordem planejada

## 7. Catálogos preservados

- `modelos_documento` não foi apagado
- `etiqueta_padrao` não foi apagada
- catálogos globais não foram apagados
- clínicas 1 e 4 não foram afetadas

## 8. Decisão vigente PARTICULAR -> Brana

- Para novas contas/clínicas, a tabela atualmente chamada PARTICULAR deve passar a nascer como Brana.
- Novas contas devem nascer com Tabela exemplo e Brana.
- Contas existentes podem manter PARTICULAR.
- Nenhuma alteração disso foi feita nesta etapa.

## 9. O que não foi alterado

- login/senha interna não foi alterado
- signup não foi alterado
- seeds não foram alterados
- Intervenções/Procedimentos não foi alterado
- PARTICULAR/Brana não foi alterado
- frontend/backend de aplicação não foram alterados nesta etapa, exceto scripts/documento da exclusão

## 10. Checks executados

- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -30`
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/scripts/delete_test_clinic_10_runner.py`
- `python -m py_compile backend/scripts/export_test_clinic_10_backup.py`
- `python -m py_compile backend/routes/auth_routes.py`
- `python -m py_compile backend/security/admin_password.py`
- `python -m py_compile backend/models/usuario.py`
- `python -m py_compile backend/database.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/routes/user_admin_routes.py`
- `python -m py_compile backend/services/access_profiles_service.py`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`

## 11. Estado final do git status --short

- `M backend/database.py`
- `M backend/models/usuario.py`
- `M backend/routes/auth_routes.py`
- `M backend/security/admin_password.py`
- `M frontend/app.js`
- `M frontend/index.html`
- novos scripts e documentos da trilha da exclusão da clínica 10 presentes como `??`
- demais `??` preexistentes do ambiente preservados

## 12. Proxima etapa recomendada

- Recriar conta limpa com `institutobrana@gmail.com` para validar o fluxo login/setup/senha interna desde o começo.
- Depois, validar `Intervenções / Procedimentos` e a seed da tabela `Brana` para novas contas.
