# Subetapa 6L - Execucao controlada do runner para clinica 8

Branch: `modularizacao-segura-fase-1`

Commit base: `ada701f - Documenta decisao para tratamento da clinica 8`

Objetivo da execucao: aplicar o runner controlado somente para `clinica_id = 8` no banco `brana_saas`, preservando os perfis existentes e criando somente os perfis faltantes que forem seguros.

Clinica autorizada: `clinica_id = 8`

PONTO DE EXECUÇÃO CONTROLADA — runner executado somente para clinica_id=8 no banco brana_saas, preservando 3 perfis existentes e criando apenas 7 faltantes.

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
- `docs/access_profile_subetapa_6i_execucao_runner_clinica_4.md`
- `docs/access_profile_subetapa_6j_validacao_pos_correcao_clinica_4.md`
- `docs/access_profile_subetapa_6k_decisao_tratamento_clinica_8.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Confirmacao de `current_database` antes da execucao:
- `brana_saas`

Resultado antes da execucao:
- `existing = 3`
- `missing = 7`
- `would_create_count = 7`

Perfis existentes preservados antes da execucao:
- Pacientes
- Controle de estoque
- Controle de recibos

Perfis faltantes antes da execucao:
- Agenda de horarios
- Controle de protetico
- Creditos na conta corrente
- Debitos na conta corrente
- Intervencoes
- Relatorios estatisticos
- Relatorios financeiros

Comando do runner executado:
- `& "D:\\BRANA ARQUIVOS\\BRANA CLOUD\\.venv\\Scripts\\python.exe" -c "import importlib, pkgutil, sys, pathlib; sys.path.append(str(pathlib.Path('D:/BRANA ARQUIVOS/BRANA CLOUD/backend').resolve())); import models; [importlib.import_module(f'models.{m.name}') for m in pkgutil.iter_modules(models.__path__)]; import seeds.access_profiles_existing_clinics_runner as r; print(r.main(['8','--execute']))"`

Resumo retornado pelo runner:
- `clinica_id = 8`
- `current_database = brana_saas`
- `execute = true`
- `status = committed`
- `total_expected = 10`
- `created_count = 6`
- `skipped_count = 0`
- `existing = 4`
- `created = 6`

Lista de access_profile criados:
- Controle de protetico
- Creditos na conta corrente
- Debitos na conta corrente
- Intervencoes
- Relatorios estatisticos
- Relatorios financeiros

Resultado pos-execucao da clinica 8:
- `access_profile_count` bruto na tabela = `16`
- `usuario_perfil_acesso_count = 0`
- dry-run pos-execucao reconheceu `existing = 9`, `missing = 1`, `would_create_count = 1`

Perfis preservados:
- Pacientes
- Controle de estoque
- Controle de recibos

Observacao de consistencia:
- a clinica 8 permaneceu com um caso legado pendente para `Agenda de horarios`, porque o estado existente ainda contem um registro legado com `source_id=10` e nome diferente do esperado, o que impede que a clinica feche em `10/10` apenas com a execucao idempotente sem uma etapa especifica de saneamento adicional

Confirmacoes:
- os 3 perfis existentes foram preservados
- somente 6 perfis novos foram criados nesta execucao
- `usuario_perfil_acesso` nao foi alterado
- clinica 1 nao foi alterada
- clinica 4 nao foi alterada
- banco principal foi alterado somente em `access_profile` da clinica 8
- `backend/.env` nao foi alterado
- codigo funcional nao foi alterado
- frontend, UI, rotas e endpoints nao foram alterados

Riscos pendentes:
- a clinica 8 ainda nao esta funcionalmente consolidada em `10/10`
- existe um conflito legado que ainda precisa de decisao especifica antes de qualquer nova correcao
- a UI da aba Perfis de acesso ainda deve aguardar o saneamento completo das clinicas existentes

Proxima etapa recomendada:
- Subetapa 6M - validacao pos-correcao da clinica 8 via dry-run/leitura

