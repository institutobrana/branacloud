# Access Profile - Subetapa 5D: signup real executado somente no banco isolado brana_saas_test

## Objetivo
Registrar a validacao real do signup executada somente no banco isolado `brana_saas_test`, sem tocar no banco principal.

## Status
Signup real executado no banco de teste isolado. O resultado funcional de `access_profile` nao atingiu o esperado: nao houve criacao dos 10 perfis base.

## Branch
`modularizacao-segura-fase-1`

## Commit base
`1a8a31f - Documenta banco de teste isolado para signup`

## Arquivos analisados
- `backend/database.py`
- `backend/.env`
- `backend/services/signup_service.py`
- `backend/routes/auth_routes.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_dry_run.py`
- `docs/access_profile_subetapa_5a_preparar_ambiente_teste_signup.md`
- `docs/access_profile_subetapa_5b_roteiro_operacional_banco_teste.md`
- `docs/access_profile_subetapa_5c_banco_teste_isolado_preparado.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Banco usado no teste
- Banco principal esperado e proibido: `postgresql://postgres:***@localhost:5432/brana_saas`
- Banco isolado usado no teste: `postgresql://postgres:***@localhost:5432/brana_saas_test`

## Confirmação de current_database antes do signup
Antes de executar o signup, `current_database()` retornou:

`brana_saas_test`

## Dados ficticios usados
- Nome da clinica/conta: `Clinica Teste Access Profile 5D`
- Nome do responsavel/usuario: `Admin Teste Access Profile 5D`
- E-mail: `teste.accessprofile.5d@branacloud.local`
- Senha: usada apenas no processo de teste local e nao registrada aqui

## Se `criar_conta_saas` foi executada
Sim. A funcao `criar_conta_saas(db, nome, email, senha)` foi executada somente no banco isolado `brana_saas_test`.

## Resultado operacional no banco de teste
- `clinica_id` criado: `2`
- Usuario ADM/dono criado: sim
- Usuario ADM id: `4`
- Prestador sistemico criado: `Clínica`

## Quantidade de `access_profile` criada para a nova clinica
`0`

## Lista dos `access_profile` encontrados
Nenhum registro foi encontrado para a nova clinica.

## Resultado de `usuario_perfil_acesso` para a nova clinica
`0` registros

## Resultado de consistencia no banco de teste
- `clinicas_count = 1`
- `usuarios_count = 2`
- `access_profile_count = 0`
- `usuario_perfil_acesso_count = 0`

## Confirmacoes obrigatorias
- Banco principal `brana_saas` nao foi alterado.
- `backend/.env` nao foi alterado.
- Codigo funcional nao foi alterado.
- `frontend` nao foi alterado.
- `UI` nao foi alterada.
- `rotas/endpoints` nao foram alterados.
- Clinicas reais existentes nao foram alteradas.
- `usuario_perfil_acesso` do banco principal nao foi alterado.

## Resultado observado e leitura tecnica
O signup real no banco isolado concluiu a criacao da clinica e do usuario ADM, mas nao materializou os `access_profile` base esperados. O helper de bootstrap chamado no fluxo atual se comporta como retorno de resumo/passivo, e o banco de teste ficou sem os 10 perfis funcionais.

## Checks
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok
- `python -m py_compile backend/seeds/access_profiles_default.py` -> ok
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py` -> ok
- `python -m py_compile backend/seeds/access_profiles_dry_run.py` -> ok
- `python -m py_compile backend/services/signup_service.py` -> ok
- `python -m py_compile backend/database.py` -> ok

## Riscos pendentes
- O banco isolado recebeu a nova clinica, mas nao recebeu os 10 `access_profile` base.
- O resultado indica um gap funcional entre a expectativa do contrato e o comportamento atual do helper de bootstrap.
- Nao houve qualquer tentativa de corrigir o codigo nesta etapa.

## Ponto de validacao
PONTO DE VALIDAÇÃO — signup real executado somente no banco isolado brana_saas_test.

## Ponto exato de validacao
O ponto de validacao foi a execucao de `criar_conta_saas()` com `DATABASE_URL` temporaria apontando para `brana_saas_test` e a posterior leitura direta do banco de teste.

## Proxima etapa recomendada
Revisar a implementacao do bootstrap de `access_profile`, pois o teste real em banco isolado mostrou que os perfis nao foram materializados apesar do signup ter sido concluido.

