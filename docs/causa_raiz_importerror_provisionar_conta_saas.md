# Causa raiz do ImportError em `provisionar_conta_saas`

## Resumo

O rollback da task `default-brana-hml-backend:12` ocorreu porque o `HEAD` publicado em `3285eb57ce94e4090bd337d3815f060765a15743` ainda não continha a função `provisionar_conta_saas` em `backend/services/signup_service.py`.

## Diagnóstico

- O arquivo `backend/routes/superadmin_routes.py` passou a importar `provisionar_conta_saas`.
- No `HEAD` publicado, `backend/services/signup_service.py` expunha apenas `criar_conta_saas`.
- No worktree local, a implementação completa de `provisionar_conta_saas` já existia, mas ainda não havia sido publicada no GitHub.
- O boot da task `:12` falhou com `ImportError`, o processo encerrou com `exitCode: 1` e o ECS fez rollback automático para a task `:10`.

## Correção adotada

- Publicar a implementação legítima de `provisionar_conta_saas` em `backend/services/signup_service.py`.
- Manter `criar_conta_saas` como wrapper compatível.
- Não criar stub, fallback ou `try/except` para mascarar o problema.

## Validações

- Import direto da função validado no ambiente local do projeto.
- Import do módulo `routes.superadmin_routes` validado no ambiente local do projeto.
- `APP_IMPORT_OK` validado no ambiente local do projeto.

## Impacto

- Remove o `ImportError` de startup.
- Restaura o contrato esperado por `superadmin_routes.py`.
- Não exige migration nem alteração de banco.
