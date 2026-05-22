# Access Profile - Subetapa 5G: signup real repetido somente no banco isolado brana_saas_test apos correcao do bootstrap

## Objetivo
Validar novamente o signup real somente no banco isolado `brana_saas_test` apos a correcao do bootstrap, confirmando que a nova clinica agora recebe os 10 `access_profile` base.

## Status
Validacao concluida no banco isolado. Nenhum banco principal foi tocado.

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
- `backend/models/access_profile.py`
- `docs/access_profile_subetapa_5d_signup_real_banco_isolado.md`
- `docs/access_profile_subetapa_5e_diagnostico_signup_sem_access_profile.md`
- `docs/access_profile_subetapa_5f_corrige_bootstrap_materializacao.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Banco usado no teste
- Banco principal proibido: `postgresql://postgres:***@localhost:5432/brana_saas`
- Banco isolado usado: `postgresql://postgres:***@localhost:5432/brana_saas_test`

## Confirmacao de current_database antes do signup
`current_database()` retornou `brana_saas_test` antes da execucao do signup.

## Dados ficticios usados
- Nome da clinica/conta: `Clinica Teste Access Profile 5G`
- Nome do responsavel/usuario: `Admin Teste Access Profile 5G`
- E-mail: `teste.accessprofile.5g@branacloud.local`
- Senha: utilizada apenas no processo local e nao registrada aqui

## Se `criar_conta_saas` foi executada
Sim. A funcao `criar_conta_saas(db, nome, email, senha)` foi executada somente no banco isolado `brana_saas_test`.

## Novo `clinica_id` criado no banco de teste
`3`

## Usuario ADM/dono criado no banco de teste
Sim.

Usuario ADM id:
`6`

## Quantidade de `access_profile` criada para a nova clinica
`10`

## Lista dos `access_profile` encontrados
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

## Resultado de `usuario_perfil_acesso` para a nova clinica
`0` registros

## Comparacao com a falha da 5D
- Na 5D, a mesma validacao no banco isolado retornou `0` `access_profile`.
- Na 5G, apos a correcao do bootstrap, a nova clinica recebeu os 10 perfis base esperados.

## Confirmacoes obrigatorias
- Banco principal `brana_saas` nao foi alterado.
- `backend/.env` nao foi alterado.
- Codigo funcional nao foi alterado nesta subetapa.
- `frontend`, `UI`, `rotas/endpoints` nao foram alterados.
- Clinicas reais existentes nao foram alteradas.

## Resultado dos checks
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok
- `python -m py_compile backend/seeds/access_profiles_default.py` -> ok
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py` -> ok
- `python -m py_compile backend/seeds/access_profiles_dry_run.py` -> ok
- `python -m py_compile backend/services/signup_service.py` -> ok
- `python -m py_compile backend/database.py` -> ok

## Riscos pendentes
- O banco isolado recebeu a nova clinica e os 10 perfis base, mas ainda nao houve qualquer validacao de UI ou de fluxo adicional de usuario_perfil_acesso.
- O banco principal continua intocado e nao deve ser usado para essa validacao final.

## Ponto de validacao
PONTO DE VALIDAÇÃO — signup real repetido somente no banco isolado brana_saas_test após correção do bootstrap.

## Proxima etapa recomendada
Se necessario, manter apenas a documentacao e seguir para estabilizacao final do fluxo, sem tocar no banco principal `brana_saas`.

