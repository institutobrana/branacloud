# Subetapa 6I - Execucao controlada do runner para clinica 4

Branch: `modularizacao-segura-fase-1`

Commit base: `c3bed5a - Documenta decisao para demais clinicas existentes`

Objetivo da execucao: aplicar o runner controlado somente para `clinica_id = 4` no banco `brana_saas`, criando os 10 perfis base ausentes sem tocar em `usuario_perfil_acesso`, sem alterar a clinica 1, sem alterar a clinica 8 e sem mexer em UI, rotas ou codigo funcional.

Clinica autorizada: `clinica_id = 4`

PONTO DE EXECUÇÃO CONTROLADA — runner executado somente para clinica_id=4 no banco brana_saas.

Arquivos analisados:
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
- `docs/access_profile_subetapa_6f_execucao_runner_clinica_1.md`
- `docs/access_profile_subetapa_6g_validacao_pos_correcao_clinica_1.md`
- `docs/access_profile_subetapa_6h_decisao_demais_clinicas_existentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Confirmacao de `current_database` antes da execucao:
- `brana_saas`

Resultado antes da execucao:
- `total_expected = 10`
- `existing = 0`
- `missing = 10`
- `would_create_count = 10`

Comando do runner executado:
- `& "D:\\BRANA ARQUIVOS\\BRANA CLOUD\\.venv\\Scripts\\python.exe" -c "import importlib, pkgutil, sys, pathlib; sys.path.append(str(pathlib.Path('D:/BRANA ARQUIVOS/BRANA CLOUD/backend').resolve())); import models; [importlib.import_module(f'models.{m.name}') for m in pkgutil.iter_modules(models.__path__)]; import seeds.access_profiles_existing_clinics_runner as r; print(r.main(['4','--execute']))"`

Resumo retornado pelo runner:
- `clinica_id = 4`
- `current_database = brana_saas`
- `execute = true`
- `status = committed`
- `total_expected = 10`
- `created_count = 10`
- `skipped_count = 0`
- `existing = []`
- `skipped = []`

Lista de access_profile criados:
1. Agenda de horarios
2. Controle de estoque
3. Controle de protetico
4. Controle de recibos
5. Creditos na conta corrente
6. Debitos na conta corrente
7. Intervencoes
8. Pacientes
9. Relatorios estatisticos
10. Relatorios financeiros

Resultado pos-execucao da clinica 4:
- `access_profile_count = 10`
- `usuario_perfil_acesso_count = 0`

Confirmacoes:
- `usuario_perfil_acesso` nao foi alterado
- clinica 1 nao foi alterada
- clinica 8 nao foi alterada
- banco principal foi alterado somente em `access_profile` da clinica 4
- `backend/.env` nao foi alterado
- codigo funcional nao foi alterado
- frontend, UI, rotas e endpoints nao foram alterados

Riscos pendentes:
- a clinica 8 continua parcial e exige etapa propria para preservar os 3 perfis existentes e criar apenas os 7 faltantes
- a UI da aba Perfis de acesso ainda deve aguardar a consolidacao das clinicas existentes

Proxima etapa recomendada:
- Subetapa 6J - validacao pos-correcao da clinica 4 via dry-run/leitura

