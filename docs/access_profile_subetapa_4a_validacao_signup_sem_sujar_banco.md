# Subetapa 4A - Avaliacao de teste seguro do signup sem sujar banco real

## Objetivo
Avaliar se existe forma segura de validar o signup com o bootstrap de `access_profile` sem persistir dados no banco real. Esta subetapa nao executa signup real.

## Branch conferida
- `modularizacao-segura-fase-1`

## Arquivos analisados
- `backend/services/signup_service.py`
- `backend/database.py`
- `backend/.env`
- `backend/routes/auth_routes.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_dry_run.py`
- `backend/services/signup_service.py` (fluxo de `criar_conta_saas`)

## Se `criar_conta_saas` faz commit interno
Sim. O fluxo termina com `db.commit()` dentro de `criar_conta_saas(db, nome, email, senha)`.

## Se rollback externo e confiavel
Nao. Como o fluxo executa `db.commit()` internamente, um rollback externo nao e confiavel para evitar persistencia da nova clinica e dos dados iniciais.

## Banco / conexao local identificado
- Banco PostgreSQL local.
- Conexao lida em `backend/.env`:
  - `postgresql://postgres:***@localhost:5432/brana_saas`
- `backend/database.py` cria `engine = create_engine(DATABASE_URL)` e `SessionLocal` a partir dessa URL.

## Se existe banco copiavel ou ambiente de teste
- Nao foi localizado arquivo SQLite/DB copiavel no workspace.
- Nao foi localizado um test database separado configurado no projeto.
- Nao foi localizado um ambiente temporario/teste claramente separado para este signup.

## Se existe teste automatizado de signup
- Nao foi localizado teste automatizado dedicado ao signup que permita validar este fluxo sem persistencia.
- Os resultados de busca mostraram apenas rotas, scripts e documentacao relacionada ao signup, mas nao um teste isolado pronto para esse proposito.

## Opcao de teste recomendada
- Nao executar.

Motivo:
1. O fluxo de signup faz commit interno.
2. O banco local apontado e o banco real do projeto.
3. Nao foi localizado ambiente isolado, SQLite copiavel ou test database separado.
4. Nao ha teste automatizado seguro que permita confirmar o comportamento sem deixar dados persistidos.

## O que foi executado
- Nenhum signup real foi executado.
- Nenhum banco foi alterado.
- Nenhuma clinica de teste foi criada.
- Nenhum `DELETE`, `INSERT`, `UPDATE`, `TRUNCATE` ou `DROP` foi executado.

## Confirmações de escopo
- `signup_service.py` nao foi alterado nesta subetapa de avaliacao.
- `frontend`, UI, rotas/endpoints e `usuario_perfil_acesso` nao foram alterados.
- Clinicas existentes nao foram alteradas.
- Clinica 1, clinica 4 e clinica 8 nao foram tocadas.

## Resultado tecnico da avaliacao
Nao existe, neste momento, uma forma comprovadamente segura de executar o signup real e depois reverter de forma confiavel sem persistir dados no banco real.

## Recomendacao
- Manter o teste do signup pendente.
- Se for necessario testar criacao de nova clinica com os 10 `access_profile` base, preparar antes um ambiente isolado/test database ou uma copia controlada do banco.
- Sem isso, a validacao deve permanecer documental.

## Checks executados
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok
- `python -m py_compile backend/seeds/access_profiles_default.py` -> ok
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py` -> ok
- `python -m py_compile backend/seeds/access_profiles_dry_run.py` -> ok
- `python -m py_compile backend/services/signup_service.py` -> ok

## Onde testar antes de prosseguir
Somente em ambiente isolado ou test database, caso venha a ser criado futuramente:
1. Abrir o sistema.
2. Acionar o signup de nova conta.
3. Confirmar que a nova clinica nasce com os 10 `access_profile` base.
4. Confirmar que `usuario_perfil_acesso` continua sem alteracoes indevidas.

## Proximo passo recomendado
- Nao executar signup real no banco atual.
- Criar, se autorizado futuramente, um ambiente isolado para teste de signup.
- Depois disso, retomar a estabilizacao da UI da aba `Perfis de acesso`.
