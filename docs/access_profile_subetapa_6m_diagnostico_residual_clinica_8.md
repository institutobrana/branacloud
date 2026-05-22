# Subetapa 6M - Diagnostico residual da clinica 8 apos execucao parcial

Branch: `modularizacao-segura-fase-1`

Commit base: `ada701f - Documenta decisao para tratamento da clinica 8`

Objetivo do diagnostico: entender, somente por leitura, por que a clinica 8 ficou em estado residual apos a execucao parcial da Subetapa 6L, com `access_profile_count` bruto acima do esperado e `Agenda de horarios` ainda pendente.

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
- `docs/access_profile_subetapa_6k_decisao_tratamento_clinica_8.md`
- `docs/access_profile_subetapa_6l_execucao_runner_clinica_8.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

Confirmacao de `current_database`:
- `brana_saas`

Confirmacao de que o runner nao foi executado nesta etapa:
- confirmado

Confirmacao de que `--execute` nao foi usado:
- confirmado

PONTO DE DIAGNÓSTICO — clínica 8 ficou em estado residual após execução parcial: dry-run reconhece 9/10, com Agenda de horarios ainda pendente, e access_profile_count bruto superior ao esperado.

Resultado bruto atual de `access_profile` da clinica 8:
- `access_profile_count` bruto = `16`

Tabela bruta dos registros da clinica 8:

| id | clinica_id | source_id | nome | nome_normalizado | nome_sem_acentos | criado_em | atualizado_em |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| 51 | 8 | 1 | Pacientes | pacientes | Pacientes | 2026-04-13 21:20:57.360549-03:00 | 2026-04-13 21:20:57.360549-03:00 |
| 52 | 8 | 2 | Intervenções | intervenções | Intervencoes | 2026-04-13 21:20:57.360549-03:00 | 2026-04-13 21:20:57.360549-03:00 |
| 53 | 8 | 3 | Agenda de horários | agenda de horários | Agenda de horarios | 2026-04-13 21:20:57.360549-03:00 | 2026-04-13 21:20:57.360549-03:00 |
| 54 | 8 | 4 | Créditos na conta corrente | créditos na conta corrente | Creditos na conta corrente | 2026-04-13 21:20:57.360549-03:00 | 2026-04-13 21:20:57.360549-03:00 |
| 55 | 8 | 5 | Débitos na conta corrente | débitos na conta corrente | Debitos na conta corrente | 2026-04-13 21:20:57.360549-03:00 | 2026-04-13 21:20:57.360549-03:00 |
| 56 | 8 | 6 | Controle de estoque | controle de estoque | Controle de estoque | 2026-04-13 21:20:57.360549-03:00 | 2026-04-13 21:20:57.360549-03:00 |
| 57 | 8 | 7 | Controle de protético | controle de protético | Controle de protetico | 2026-04-13 21:20:57.360549-03:00 | 2026-04-13 21:20:57.360549-03:00 |
| 58 | 8 | 8 | Controle de recibos | controle de recibos | Controle de recibos | 2026-04-13 21:20:57.360549-03:00 | 2026-04-13 21:20:57.360549-03:00 |
| 59 | 8 | 9 | Relatórios estatísticos | relatórios estatísticos | Relatorios estatisticos | 2026-04-13 21:20:57.360549-03:00 | 2026-04-13 21:20:57.360549-03:00 |
| 60 | 8 | 10 | Relatórios financeiros | relatórios financeiros | Relatorios financeiros | 2026-04-13 21:20:57.360549-03:00 | 2026-04-13 21:20:57.360549-03:00 |
| 81 | 8 | 30 | Controle de protetico | controle de protetico | Controle de protetico | 2026-05-22 16:42:53.449428-03:00 | 2026-05-22 16:42:53.449428-03:00 |
| 82 | 8 | 50 | Creditos na conta corrente | creditos na conta corrente | Creditos na conta corrente | 2026-05-22 16:42:53.449428-03:00 | 2026-05-22 16:42:53.449428-03:00 |
| 83 | 8 | 60 | Debitos na conta corrente | debitos na conta corrente | Debitos na conta corrente | 2026-05-22 16:42:53.449428-03:00 | 2026-05-22 16:42:53.449428-03:00 |
| 84 | 8 | 70 | Intervencoes | intervencoes | Intervencoes | 2026-05-22 16:42:53.449428-03:00 | 2026-05-22 16:42:53.449428-03:00 |
| 85 | 8 | 90 | Relatorios estatisticos | relatorios estatisticos | Relatorios estatisticos | 2026-05-22 16:42:53.449428-03:00 | 2026-05-22 16:42:53.449428-03:00 |
| 86 | 8 | 100 | Relatorios financeiros | relatorios financeiros | Relatorios financeiros | 2026-05-22 16:42:53.449428-03:00 | 2026-05-22 16:42:53.449428-03:00 |

Agrupamento por nome normalizado:
- `pacientes`: id 51
- `intervenções`: id 52
- `agenda de horários`: id 53
- `créditos na conta corrente`: id 54
- `débitos na conta corrente`: id 55
- `controle de estoque`: id 56
- `controle de protético`: ids 57 e 81
- `controle de recibos`: id 58
- `relatórios estatísticos`: id 59
- `relatórios financeiros`: id 60
- `controle de protetico`: id 81
- `creditos na conta corrente`: id 82
- `debitos na conta corrente`: id 83
- `intervencoes`: id 84
- `relatorios estatisticos`: id 85
- `relatorios financeiros`: id 86

Agrupamento por source_id:
- `1`: id 51
- `2`: id 52
- `3`: id 53
- `4`: id 54
- `5`: id 55
- `6`: id 56
- `7`: id 57
- `8`: id 58
- `9`: id 59
- `10`: id 60
- `30`: id 81
- `50`: id 82
- `60`: id 83
- `70`: id 84
- `90`: id 85
- `100`: id 86

Resultado do dry-run atual da clinica 8:
- `total_expected = 10`
- `existing = 9`
- `missing = 1`
- `would_create_count = 1`

Perfis reconhecidos como existing pelo dry-run:
- Controle de estoque
- Controle de protetico
- Controle de recibos
- Creditos na conta corrente
- Debitos na conta corrente
- Intervencoes
- Pacientes
- Relatorios estatisticos
- Relatorios financeiros

Perfis ainda missing:
- Agenda de horarios

Explicacao provavel para `access_profile_count` bruto = 16:
- a clinica 8 ja possuia 10 registros legados com nomes acentuados e source_id 1..10
- a execucao parcial da Subetapa 6L criou 6 novos registros sem acento e com source_id 30, 50, 60, 70, 90 e 100
- isso levou o total bruto para 16 sem apagar os registros antigos

Explicacao provavel para `Agenda de horarios` continuar pendente:
- o dry-run identifica perfis por nome normalizado sem remover acentos
- o bootstrap privilegia `source_id` e depois nome
- na clinica 8 existe um registro legado com `source_id = 10` e nome `Relatórios financeiros`, que bloqueou a criacao da nova entrada esperada para `Agenda de horarios`
- como o registro legado de `Agenda de horários` usa acento e o nome oficial da base usa grafia sem acento, o dry-run nao o reconhece como correspondente
- resultado: a clinica ficou com um caso residual misturando heranca legada, correspondencia por `source_id` e correspondencia por nome sem acento

Resultado de `usuario_perfil_acesso` da clinica 8:
- `usuario_perfil_acesso_count = 0`

Confirmacoes:
- a clinica 1 continua `10/10`
- a clinica 4 continua `10/10`
- nenhuma escrita foi feita nesta subetapa
- `backend/.env` nao foi alterado
- codigo funcional nao foi alterado
- frontend, UI, rotas e endpoints nao foram alterados

Recomendacao para a proxima etapa:
- nao executar nova correcao agora
- primeiro decidir uma estrategia especifica para o legado da clinica 8, porque o residual nao e mais apenas ausencia de perfis, mas uma divergencia entre nomes acentuados, `source_id` legado e o criterio de reconhecimento do dry-run

