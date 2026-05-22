# Subetapa 6C - Dry-Run Atualizado para Clinicas Existentes

## Branch
`modularizacao-segura-fase-1`

## Commit base
`aa7f6f4 - Documenta estrategia para clinicas existentes`

## Objetivo
Executar um dry-run atualizado, somente leitura, contra o banco principal `brana_saas` para clinicas existentes, usando a logica atualizada pos-correcao do bootstrap/dry-run, sem materializar nada.

## Arquivos analisados
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/services/signup_service.py`
- `backend/models/access_profile.py`
- `backend/database.py`
- `backend/.env`
- `docs/access_profile_subetapa_3b_execucao_dry_run_somente_leitura.md`
- `docs/access_profile_subetapa_6a_consolidacao_trilha_validada.md`
- `docs/access_profile_subetapa_6b_estrategia_clinicas_existentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Banco consultado
- Banco principal `brana_saas`
- Consulta de leitura confirmada com `current_database = brana_saas`

## Confirmacao de leitura
- A consulta foi somente leitura.
- Nao houve `INSERT`, `UPDATE`, `DELETE`, `DROP`, `TRUNCATE`, `ALTER`, `CREATE`, seed real, migration ou bootstrap real.
- Nao houve alteracao de `access_profile`.
- Nao houve alteracao de `usuario_perfil_acesso`.

## Clinicas analisadas
- Clinica 1
- Clinica 4
- Clinica 8

## Resultado por clinica

### Clinica 1
- `total_expected = 10`
- `existing = 0`
- `missing = 10`
- `skipped = 0`
- `would_create_count = 10`
- Perfis existentes: nenhum
- Perfis faltantes:
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

### Clinica 4
- `total_expected = 10`
- `existing = 0`
- `missing = 10`
- `skipped = 0`
- `would_create_count = 10`
- Perfis existentes: nenhum
- Perfis faltantes:
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

### Clinica 8
- `total_expected = 10`
- `existing = 3`
- `missing = 7`
- `skipped = 0`
- `would_create_count = 7`
- Perfis existentes:
  - Pacientes
  - Controle de estoque
  - Controle de recibos
- Perfis faltantes:
  - Agenda de horarios
  - Controle de protetico
  - Creditos na conta corrente
  - Debitos na conta corrente
  - Intervencoes
  - Relatorios estatisticos
  - Relatorios financeiros

## Observacao da clinica 8
- A clinica 8 deve ser tratada preservando os perfis existentes por nome.
- O dry-run atualizado indica que nao haveria duplicacao dos perfis `Pacientes`, `Controle de estoque` e `Controle de recibos`.
- Se uma correcao real vier a ser autorizada no futuro, a clinica 8 deveria receber apenas os 7 perfis faltantes.

## Confirmacoes de escopo
- Nenhuma clinica foi corrigida.
- `access_profile` nao foi alterado.
- `usuario_perfil_acesso` nao foi alterado.
- `frontend`, `UI` e rotas/endpoints nao foram alterados.
- Nenhum codigo funcional foi alterado.
- Nenhum banco foi alterado.
- Nenhum signup real foi executado.
- Nenhuma conta ou clinica foi criada.

## Riscos identificados
- Clinicas existentes podem continuar sem `access_profile` ou com acesso incompleto.
- A UI da aba `Perfis de acesso` pode continuar vazia ou inconsistente nessas clinicas.
- Qualquer correcao real de dados existentes precisa de etapa propria e autorizacao explicita.
- A clinica 8 requer tratamento cuidadoso para preservar nomes ja presentes e evitar duplicacao.

## Proxima etapa recomendada
- Subetapa 6D: decidir se sera criada uma rotina controlada de correcao para clinicas existentes ou se sera corrigida uma clinica especifica primeiro.

