# Access Profile - Subetapa 5E: diagnostico do signup sem materializacao de access_profile

## Objetivo
Diagnosticar por que o signup criado no banco isolado `brana_saas_test` nao materializou os 10 `access_profile` base.

## Status
Diagnostico concluido. Nenhuma correcao de codigo foi aplicada nesta etapa.

## Branch
`modularizacao-segura-fase-1`

## Commit base
`1a8a31f - Documenta banco de teste isolado para signup`

## Estado inicial
- Branch correta confirmada.
- Documento da Subetapa 5D estava como `untracked`.
- Banco principal `brana_saas` nao foi alterado.
- `backend/.env` nao foi alterado.

## Resultado da 5D
- `current_database` antes do signup: `brana_saas_test`
- `criar_conta_saas` foi executada somente no banco isolado.
- `clinica_id` criado: `2`
- `access_profile` encontrados para a nova clinica: `0`
- `usuario_perfil_acesso` para a nova clinica: `0`

## Arquivos analisados
- `backend/services/signup_service.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/models/access_profile.py`
- `backend/database.py`
- `docs/access_profile_subetapa_5d_signup_real_banco_isolado.md`
- `docs/access_profile_subetapa_5c_banco_teste_isolado_preparado.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Causa provavel identificada
A causa mais provavel e que o helper `_aplicar_bootstrap_access_profiles_clinica(db, clinica_id)` chama `ensure_default_access_profiles_for_clinic(db, clinica_id)`, mas o helper em `backend/seeds/access_profiles_bootstrap.py` ainda se comporta como um calculador de resumo passivo:

- ele le a lista versionada;
- monta `created`, `existing` e `skipped`;
- mas nao faz `db.add()` para materializar `AccessProfile`;
- nao faz `flush` nem `commit`;
- por isso o signup termina sem persistir os 10 perfis base.

Tambem foi observado que:
- o signup chama o helper depois de `clinica.id` ja estar disponivel;
- nao ha `try/except` engolindo erro nesse ponto;
- nao houve duplicacao de logica de criacao direta de `AccessProfile` dentro do signup;
- o retorno do helper foi ignorado porque ele nao produz escrita;
- o modelo `AccessProfile` usa `source_id` inteiro;
- a lista versionada usa `codigo` textual e `ordem` numerica, mas o helper nao materializa os registros.

## Se houve correcao
Nao houve correcao de codigo nesta etapa.

## Se nao houve correcao, por que
A causa foi identificada no helper de bootstrap passivo, mas a correção real exigiria alterar `backend/seeds/access_profiles_bootstrap.py`, fora do escopo minimo permitido para esta subetapa diagnostica.

## Confirmacoes obrigatorias
- Banco principal `brana_saas` nao foi alterado.
- `backend/.env` nao foi alterado.
- `frontend`, `UI`, `rotas/endpoints` nao foram alterados.
- Clinicas existentes nao foram alteradas.
- `usuario_perfil_acesso` do banco principal nao foi alterado.

## Consulta em `brana_saas_test`
- `current_database` confirmado como `brana_saas_test` durante a investigacao.
- A consulta direta ao banco de teste confirmou:
  - `clinicas_count = 1`
  - `usuarios_count = 2`
  - `access_profile_count = 0`
  - `usuario_perfil_acesso_count = 0`

## Proximo passo recomendado
Corrigir o helper de bootstrap para materializar os `access_profile` base antes de repetir o signup real no banco isolado `brana_saas_test`.

