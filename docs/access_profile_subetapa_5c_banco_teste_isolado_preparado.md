# Access Profile - Subetapa 5C: banco de teste isolado preparado

## Objetivo
Preparar um banco PostgreSQL isolado de teste para validar, em etapa futura, o signup real sem sujar o banco principal.

## Status
Banco isolado preparado nesta etapa. Nenhum signup real foi executado.

## Branch
`modularizacao-segura-fase-1`

## Commit base
`a721063 - Documenta roteiro do banco de teste para signup`

## Arquivos analisados
- `backend/database.py`
- `backend/.env`
- `backend/services/signup_service.py`
- `backend/models`
- `backend/routes/auth_routes.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_dry_run.py`
- `docs/access_profile_subetapa_5a_preparar_ambiente_teste_signup.md`
- `docs/access_profile_subetapa_5b_roteiro_operacional_banco_teste.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `README.md`
- `README_WEB.md`
- `requirements.txt`
- `pyproject.toml` nao foi encontrado
- `alembic.ini` nao foi encontrado
- `backend/alembic` nao foi encontrado
- `migrations` nao foi encontrada

## Banco principal identificado
Banco principal atual:

`postgresql://postgres:***@localhost:5432/brana_saas`

## Banco de teste usado/criado
Banco isolado preparado nesta etapa:

`postgresql://postgres:***@localhost:5432/brana_saas_test`

## Como foi garantido que `backend/.env` nao foi alterado
O arquivo `backend/.env` foi apenas lido para diagnostico.
Nao houve edicao, nem gravacao, nem versao alterada.

## Como foi garantido que `DATABASE_URL` temporaria apontou para `brana_saas_test`
A variavel `DATABASE_URL` foi definida apenas no processo de execucao da etapa, em memoria, apontando para `brana_saas_test`.
O arquivo `backend/.env` nao foi modificado.

## Se o banco `brana_saas_test` ja existia ou foi criado nesta etapa
O banco `brana_saas_test` nao existia e foi criado nesta etapa.

## Como a estrutura/tabelas foram preparadas
Foi usado o mecanismo identificado no proprio projeto:

1. criar o banco isolado `brana_saas_test` via conexao administrativa local;
2. carregar todos os modulos de `backend/models` para registrar o metadata completo;
3. executar `Base.metadata.create_all(bind=engine)` apenas contra o banco isolado;
4. confirmar que as tabelas principais ficaram presentes no banco de teste.

## Comandos operacionais executados
Executados apenas no banco isolado:

1. verificacao de existencia do banco `brana_saas_test`;
2. `CREATE DATABASE brana_saas_test` quando o banco nao existia;
3. importacao dos modulos de modelo do backend;
4. `Base.metadata.create_all(bind=engine)`;
5. `select current_database()` para confirmacao do banco ativo.

## Resultado operacional observado
- `brana_saas_test` foi criado.
- 35 modulos de modelo foram importados.
- 56 tabelas foram encontradas no banco de teste apos a preparacao.
- `access_profile` existe no banco de teste.
- `clinicas` existe no banco de teste.
- `usuario_perfil_acesso` existe no banco de teste.
- `current_database()` confirmou `brana_saas_test`.

## Confirmacoes obrigatorias
- Signup real nao foi executado.
- `criar_conta_saas` nao foi executada.
- Nenhuma conta ou clinica foi criada.
- O banco principal `brana_saas` nao foi alterado.
- `frontend` nao foi alterado.
- `UI` nao foi alterada.
- `rotas/endpoints` nao foram alterados.
- `usuario_perfil_acesso` no banco principal nao foi alterado.
- `backend/.env` nao foi alterado.
- Codigo funcional nao foi alterado.

## Riscos pendentes
- O signup real ainda nao foi testado no banco isolado.
- Embora o schema exista, ainda e necessario validar a criacao real da nova clinica no ambiente de teste antes de qualquer conclusao funcional final.
- O banco principal nao deve ser usado para essa validacao.

## Ponto de parada
PONTO DE PARADA — banco de teste preparado; requer autorizacao do usuario antes de executar signup real ou criar nova conta/clínica.

## Ponto exato de parada para autorizacao
Antes de executar `criar_conta_saas()` ou qualquer fluxo de signup real no `brana_saas_test`.

## Criterios para a futura Subetapa 5D
- Executar signup real apenas contra `brana_saas_test`.
- Criar nova conta/clinica de teste.
- Confirmar os 10 `access_profile` base.
- Confirmar `usuario_perfil_acesso` vazio, salvo fluxo independente.
- Confirmar que o banco principal `brana_saas` permanece intocado.
- Confirmar que a UI nao foi alterada.

## Proxima etapa recomendada
Aguardar autorizacao do usuario para executar o signup real apenas no banco isolado `brana_saas_test`.

