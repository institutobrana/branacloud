# Subetapa 6F - Execucao Controlada do Runner para Clinica 1

## Branch
`modularizacao-segura-fase-1`

## Commit base
`d86e88d - Adiciona runner controlado para clinicas existentes`

## Objetivo da execucao
Executar o runner controlado somente para `clinica_id = 1` no banco principal `brana_saas`, com autorizacao explicita, para criar os 10 `access_profile` base ausentes.

## Clinica autorizada
- `clinica_id = 1`

## Arquivos analisados
- `backend/seeds/access_profiles_existing_clinics_runner.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/models/access_profile.py`
- `backend/models/clinica.py`
- `backend/database.py`
- `backend/.env`
- `docs/access_profile_subetapa_6c_dry_run_atualizado_clinicas_existentes.md`
- `docs/access_profile_subetapa_6d_decisao_plano_correcao_clinicas_existentes.md`
- `docs/access_profile_subetapa_6e_runner_controlado_clinicas_existentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Confirmacao de `current_database` antes da execucao
- `current_database = brana_saas`

## Resultado pre-execucao da clinica 1
- Dry-run da clinica 1 antes da execucao:
  - `existing = 0`
  - `missing = 10`
  - `would_create_count = 10`
- `total_expected = 10`

## Comando/forma de execucao do runner
- Comando executado no diretorio `backend`:
  - `& "D:\\BRANA ARQUIVOS\\BRANA CLOUD\\.venv\\Scripts\\python.exe" seeds/access_profiles_existing_clinics_runner.py 1 --execute`

## Resumo retornado pelo runner
- `clinica_id = 1`
- `current_database = brana_saas`
- `execute = true`
- `status = committed`
- `total_expected = 10`
- `created_count = 10`
- `skipped_count = 0`
- `existing = []`
- `skipped = []`

## Lista de `access_profile` criados
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

## Resultado pos-execucao da clinica 1
- `access_profile_count = 10`
- Perfis confirmados por leitura:
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

## Confirmacoes de escopo
- `usuario_perfil_acesso` nao foi alterado.
- Clinica 4 nao foi alterada por esta execucao.
- Clinica 8 nao foi alterada por esta execucao.
- O banco foi alterado somente em `access_profile` da clinica 1.
- `backend/.env` nao foi alterado.
- Nenhum codigo funcional foi alterado.
- `frontend`, `UI` e rotas/endpoints nao foram alterados.

## Riscos pendentes
- Clinicas 4 e 8 continuam pendentes de correcao controlada futura.
- A clinica 8 ainda exige preservacao cuidadosa dos perfis existentes por nome.
- A UI da aba `Perfis de acesso` ainda deve ser validada somente depois da estrategia para as demais clinicas.

## Proxima etapa recomendada
- Subetapa 6G: validacao pos-correcao da clinica 1 via dry-run/leitura.

## Ponto de validacao
PONTO DE EXECUCAO CONTROLADA — runner executado somente para clinica_id=1 no banco brana_saas.

