# Clínica 8 — Exclusão segura — Etapa 9 — Validação do novo cadastro limpo com `institutobrana@gmail.com`

## Contexto
- A clínica 8 foi removida na Etapa 8I.
- O e-mail `institutobrana@gmail.com` foi liberado e reutilizado com sucesso no fluxo de cadastro limpo.

## Objetivo
Validar o novo cadastro limpo usando o e-mail `institutobrana@gmail.com` e confirmar que a nova clínica nasce sem herdar vínculos da antiga clínica 8.

## Validação pré-cadastro
As consultas somente leitura confirmaram antes da validação do cadastro:

- `clinicas.id = 8` ausente.
- `institutobrana@gmail.com` ausente em `clinicas`.
- `institutobrana@gmail.com` ausente em `usuarios/autenticação`.
- `usuarios.id 19 e 20` ausentes.
- `prestador_odonto.id 13` ausente.

## Método de teste
A validação foi executada por chamada controlada das rotas de signup no backend local em runtime `uvicorn` (`http://127.0.0.1:8000`), equivalente ao fluxo normal de cadastro, sem alterar código-fonte. O fluxo usado foi:

1. `signup/request-code`
2. confirmação do código de verificação
3. criação da conta

## Resultado do cadastro
- Sucesso.
- Nova clínica criada: `id = 9`.
- Nova clínica vinculada ao e-mail `institutobrana@gmail.com`.
- Novo usuário admin/dono criado: `id = 22`.
- Usuário sistema criado: `id = 21`.
- Novo prestador criado: `id = 14`.
- Assinatura/plano trial ou DEMO: não foi criada nesta validação.
- Mensagens observadas:
  - `Codigo enviado para o e-mail informado.`
  - `Conta criada com sucesso.`

## Validação dos `access_profile` da nova clínica
Para a nova clínica `id = 9`, foram encontrados exatamente 10 perfis padrão, com a grafia oficial:

1. `Agenda de horarios`
2. `Controle de estoque`
3. `Controle de protetico`
4. `Controle de recibos`
5. `Creditos na conta corrente`
6. `Debitos na conta corrente`
7. `Intervencoes`
8. `Pacientes`
9. `Relatorios estatisticos`
10. `Relatorios financeiros`

Contagem confirmada: `10`.

## Confirmação de não herança da clínica 8 antiga
- `clinicas.id = 8` continua ausente.
- `usuarios 19/20` continuam ausentes.
- `prestador 13` continua ausente.
- `etiqueta_modelo` da clínica 8 não reapareceu.
- A nova clínica `id = 9` recebeu novos registros próprios:
  - `usuarios`: `21` e `22`
  - `prestador_odonto`: `14`
  - `etiqueta_modelo`: `83` a `90`

## Confirmações
- Nenhum código foi alterado.
- `frontend` não foi alterado.
- `backend` não foi alterado.
- `seeds` não foram alterados.
- `signup` não foi alterado.
- `access_profile` não foi alterado manualmente.
- Não houve `git add`, `commit` ou `push`.
- Pastas proibidas não foram tocadas.

## Checks executados
- `git branch --show-current`
- `git status --short`
- `git diff --stat`
- `git log --oneline -10`
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
O workspace permanece com os untracked preexistentes do repositório e com este documento da Etapa 9. Não houve diff em arquivos versionados.

## Próxima etapa recomendada
Etapa 10 — fechamento documental da trilha de exclusão segura da clínica 8 e validação do novo cadastro limpo.
