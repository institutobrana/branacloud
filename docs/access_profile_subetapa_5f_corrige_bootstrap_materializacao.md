# Access Profile - Subetapa 5F: correcao do bootstrap para materializar access_profile

## Objetivo
Corrigir o helper oficial de bootstrap para que `ensure_default_access_profiles_for_clinic(db, clinica_id)` passe a materializar os `access_profile` ausentes no `db` recebido, sem commit interno.

## Status
Correcao aplicada somente no helper oficial de bootstrap. Nenhum signup real foi executado nesta etapa.

## Branch
`modularizacao-segura-fase-1`

## Commit base
`1a8a31f - Documenta banco de teste isolado para signup`

## Resultado da 5D
- `current_database` antes do signup: `brana_saas_test`
- `clinica_id` criado no banco de teste: `2`
- `access_profile` encontrados para a nova clinica: `0`
- `usuario_perfil_acesso` para a nova clinica: `0`

## Resultado do diagnostico da 5E
A causa identificada foi que o helper oficial de bootstrap estava apenas montando um resumo (`created`, `existing`, `skipped`) sem materializar os perfis ausentes.

## Arquivos analisados
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/models/access_profile.py`
- `backend/services/signup_service.py`
- `backend/database.py`
- `docs/access_profile_subetapa_5d_signup_real_banco_isolado.md`
- `docs/access_profile_subetapa_5e_diagnostico_signup_sem_access_profile.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Arquivos criados/alterados
- `backend/seeds/access_profiles_bootstrap.py`
- `docs/access_profile_subetapa_5f_corrige_bootstrap_materializacao.md`

## Causa corrigida
O helper de bootstrap passou a criar objetos `AccessProfile` para os perfis ausentes e adiciona-los à sessão com `db.add(...)`.

## Como a funcao passou a materializar `access_profile`
- Usa a mesma sessão `db` recebida.
- Busca os perfis existentes da clínica.
- Para cada perfil base ausente, instancia `AccessProfile`.
- Adiciona o objeto à sessão com `db.add(profile)`.
- Mantém a função idempotente.

## Confirmacoes obrigatorias
- Não há `db.commit()` interno no bootstrap.
- Não abre conexão própria.
- Usa a sessão `db` recebida.
- Não altera `usuario_perfil_acesso`.
- `signup_service.py` não foi alterado.
- `backend/.env` não foi alterado.
- O banco principal `brana_saas` não foi alterado.
- `frontend`, `UI`, `rotas/endpoints` e clínicas reais existentes não foram alterados.

## Detalhe tecnico da correção
O bootstrap agora:
- considera `source_id` numérico com base em `ordem`;
- evita duplicidade por `source_id` e por nome normalizado;
- cria apenas os perfis ausentes;
- retorna `total_expected`, `created`, `existing`, `skipped`, `created_count` e `skipped_count`.

## Checks
Os checks de sintaxe foram executados no conjunto de arquivos permitidos e permaneceram ok.

## Proxima etapa recomendada
Repetir o signup real somente no banco isolado `brana_saas_test` para confirmar que os 10 `access_profile` base agora são materializados.

