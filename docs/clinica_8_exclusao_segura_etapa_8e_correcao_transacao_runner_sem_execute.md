# Clínica 8 — Exclusão segura — Etapa 8E — Correção técnica do controle de transação do runner

## 1. Título da etapa
Etapa 8E — Correção técnica do controle de transação do runner, sem executar `--execute`.

## 2. Contexto
- A Etapa 8D bloqueou por erro técnico de transação.
- Nada foi excluído.
- O banco não foi alterado.

## 3. Objetivo
Corrigir o controle de transação do runner para evitar o erro `A transaction is already begun on this Session.` e manter o caminho de execução real futuro tecnicamente estável.

## 4. Arquivo alterado
- `backend/scripts/delete_test_clinic_runner.py`

## 5. Diagnóstico provável da causa
O erro ocorria porque as consultas de validação iniciavam uma transação implícita na mesma `Session` e o runner tentava abrir uma nova transação explícita com `db.begin()` no mesmo objeto de sessão.

## 6. Correção aplicada
- Foi adicionado `db.rollback()` imediatamente antes do bloco explícito `with db.begin():` no caminho de execução real.
- Isso limpa a transação implícita iniciada pelas leituras de validação antes de abrir a transação de escrita.
- O dry-run permaneceu inalterado como padrão.
- `--execute` continua obrigatório para o caminho real futuro.
- Nenhuma escrita ocorre no import.

## 7. `--execute` não foi usado
`--execute` não foi usado nesta etapa.

## 8. Nada foi excluído
Nada foi excluído nesta etapa.

## 9. Banco não foi alterado
O banco não foi alterado.

## 10. Nenhum `DELETE`, `UPDATE` ou `INSERT` foi executado
Nenhum `DELETE`, `UPDATE` ou `INSERT` foi executado.

## 11. Resultado do dry-run após correção
O dry-run continuou íntegro e confirmou:
- `DATABASE_ATUAL: brana_saas`
- clínica 8 conferida
- e-mail `institutobrana@gmail.com` conferido
- usuários `19` e `20` encontrados
- prestador `13` encontrado
- assinatura `11` encontrada
- `ETIQUETA_MODELO_RELATORIO` com `count = 8`
- `ETIQUETA_MODELO_IDS = [75, 76, 77, 78, 79, 80, 81, 82]`
- `VINCULOS_NAO_MAPEADOS = []`
- `AUDITORIA_EMAIL = []`
- `VINCULOS_USUARIO_EXTRA = []`
- `VINCULOS_PRESTADOR_EXTRA = []`
- aviso final de que nada foi alterado

## 12. O dry-run permaneceu íntegro
Sim. O dry-run permaneceu somente leitura e sem efeitos colaterais.

## 13. Frontend, seeds, signup e access_profile não foram alterados
Confirmado.

## 14. Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
- `python -m py_compile backend/scripts/delete_test_clinic_runner.py`
- `python -m py_compile backend/scripts/export_test_clinic_backup.py`
- `python backend/scripts/delete_test_clinic_runner.py --clinica-id 8 --expected-email institutobrana@gmail.com` com o Python do venv do projeto
- `node --check frontend/app.js`
- `node --check frontend/js/modules/users-admin-modal-visual.js`
- `python -m py_compile backend/seeds/access_profiles_default.py`
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py`
- `python -m py_compile backend/seeds/access_profiles_dry_run.py`
- `python -m py_compile backend/seeds/access_profiles_existing_clinics_runner.py`
- `python -m py_compile backend/services/signup_service.py`
- `python -m py_compile backend/database.py`

## 15. Estado final do git status --short
O repositório continua com os untracked preexistentes e com os artefatos desta trilha, incluindo este documento.

## 16. Próxima etapa recomendada
Etapa 8F — nova revisão final curta e execução real controlada com `--execute`, uma única vez, mediante autorização explícita.
