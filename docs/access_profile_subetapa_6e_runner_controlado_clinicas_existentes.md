# Subetapa 6E - Runner Controlado para Clinicas Existentes

## Branch
`modularizacao-segura-fase-1`

## Commit base
`8306817 - Documenta plano seguro para corrigir clinicas existentes`

## Objetivo da subetapa
Criar um runner controlado e idempotente para aplicar o bootstrap oficial de `access_profile` em clinicas existentes, sem executar qualquer correcao nesta etapa.

## Arquivos criados
- `backend/seeds/access_profiles_existing_clinics_runner.py`
- `docs/access_profile_subetapa_6e_runner_controlado_clinicas_existentes.md`

## Arquivos analisados
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/services/signup_service.py`
- `backend/models/access_profile.py`
- `backend/models/clinica.py`
- `backend/database.py`
- `backend/.env`
- `docs/access_profile_subetapa_6a_consolidacao_trilha_validada.md`
- `docs/access_profile_subetapa_6b_estrategia_clinicas_existentes.md`
- `docs/access_profile_subetapa_6c_dry_run_atualizado_clinicas_existentes.md`
- `docs/access_profile_subetapa_6d_decisao_plano_correcao_clinicas_existentes.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Explicacao do runner criado
- O runner foi criado em `backend/seeds/access_profiles_existing_clinics_runner.py`.
- Ele nao executa nada no import.
- Ele exige `clinica_id` explicito.
- Ele exige a flag `--execute` para qualquer execucao real.
- Sem `--execute`, o runner apenas faz dry-run e retorna orientacao sem escrita.
- Com `--execute`, o runner confirma `current_database = brana_saas`, chama a funcao oficial `ensure_default_access_profiles_for_clinic(db, clinica_id)` e faz commit somente se tudo ocorrer corretamente.
- Em erro, o runner faz rollback.

## Confirmacoes de comportamento
- O runner nao roda automaticamente no import.
- O runner exige `clinica_id` explicito.
- A execucao real exige `--execute`.
- O runner usa `ensure_default_access_profiles_for_clinic(db, clinica_id)`.
- O runner nao duplica logica de criacao de `access_profile`.
- O runner nao altera `usuario_perfil_acesso`.
- O runner nao apaga perfis existentes.
- O runner nao sobrescreve perfis existentes.
- O runner nao foi executado nesta subetapa.
- Nenhuma clinica foi corrigida nesta etapa.
- Nenhum banco foi alterado.
- `backend/.env` nao foi alterado.

## Como devera ser testado na Subetapa 6F
- Selecionar uma clinica especifica autorizada.
- Confirmar `current_database = brana_saas`.
- Executar o runner com `--execute` apenas quando houver autorizacao explicita.
- Validar o resumo retornado.
- Repetir dry-run/leitura pos-correcao para confirmar os perfis criados.

## Clinica sugerida para primeira execucao futura
- Clinica 1.

## Riscos pendentes
- Clinicas existentes ainda podem continuar sem `access_profile` ou com acesso incompleto.
- A clinica 8 exige cuidado extra para preservar `Pacientes`, `Controle de estoque` e `Controle de recibos`.
- A execucao real futura deve continuar sendo incremental para reduzir risco operacional.

## Proxima etapa recomendada
- Subetapa 6F: executar o runner somente para uma clinica especifica autorizada.

