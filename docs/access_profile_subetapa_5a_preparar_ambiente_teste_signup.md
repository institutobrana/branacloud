# Subetapa 5A - Preparar ambiente isolado para validar signup real sem sujar banco real

## Objetivo
Documentar a avaliacao tecnica para preparar um ambiente isolado/test database confiavel antes de validar o signup real com o bootstrap de `access_profile`.

## Branch
- `modularizacao-segura-fase-1`

## Commit base
- `f7c8091 - Acopla perfis de acesso ao signup de novas clinicas`

## Estado atual do git
- O workspace permanece com alteracoes pendentes nas entregas anteriores da trilha `access_profile`.
- Nesta subetapa nao houve alteracao de codigo funcional nem criacao de banco.

## Arquivos analisados
- `backend/database.py`
- `backend/.env`
- `backend/services/signup_service.py`
- `backend/routes/auth_routes.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_dry_run.py`
- `docs/access_profile_subetapa_4_acoplamento_signup_novas_clinicas.md`
- `docs/access_profile_subetapa_4a_validacao_signup_sem_sujar_banco.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `README.md`
- `README_WEB.md`

## Por que o teste no banco real nao e seguro
- `criar_conta_saas()` executa `db.commit()` internamente.
- Um rollback externo nao e confiavel para desfazer a persistencia da nova clinica e dos seeds do signup.
- O banco local identificado e um PostgreSQL real do projeto, nao um banco efemero ou descartavel.
- Nao foi localizado banco SQLite copiavel para teste isolado.
- Nao foi localizado test database separado ja configurado.
- Nao foi localizado teste automatizado seguro que permita validar o signup sem persistencia.

## Como o projeto le `DATABASE_URL`
- `backend/database.py` le `DATABASE_URL` do ambiente via `os.getenv("DATABASE_URL")`.
- Em seguida cria `engine = create_engine(DATABASE_URL)`.
- Depois cria `SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)`.

## Banco real atual identificado
- PostgreSQL local:
  - `postgresql://postgres:***@localhost:5432/brana_saas`
- O arquivo `backend/.env` foi apenas lido.
- O arquivo `backend/.env` nao foi alterado.

## Existe test database configurado?
- Nao.
- Nao foi encontrado banco de teste separado configurado no projeto.

## Existe migracao/Alembic/estrutura para criar banco de teste?
- Nao foi localizado `alembic.ini`.
- Nao foi localizado diretorio `alembic/` no workspace principal.
- Nao foi localizado `backend/alembic/`.
- Nao foi identificado mecanismo Alembic pronto para criar um banco de teste nesta base.

## Existe script seguro de setup?
- Existem scripts auxiliares em `backend/scripts/`, mas eles sao orientados a rotinas operacionais, migracoes, backfills ou auditorias.
- Nao foi localizado um script seguro e dedicado especificamente para criar um banco de teste isolado para esse signup sem risco de persistencia indevida.

## Existe teste automatizado de signup?
- Nao foi localizado teste automatizado dedicado ao signup que permita validar esse fluxo de forma segura e isolada.

## Estrategia recomendada para ambiente isolado
Recomendacao para a futura Subetapa 5B:
1. Criar um banco PostgreSQL separado, por exemplo `brana_saas_test`.
2. Apontar `DATABASE_URL` temporariamente para esse banco isolado apenas no processo de teste.
3. Criar a estrutura nesse banco isolado por mecanismo seguro e aprovado.
4. Executar `criar_conta_saas()` somente nesse ambiente isolado.
5. Verificar que a nova clinica nasce com os 10 `access_profile` base.
6. Confirmar que `usuario_perfil_acesso` permanece vazio, salvo fluxo independente.
7. Descartar o banco de teste ou mantê-lo conforme decisao do usuario.

## Comandos sugeridos para etapa futura
Somente depois de autorizacao explicita do usuario e em ambiente isolado:
- apontar `DATABASE_URL` temporariamente para o banco de teste;
- iniciar a aplicacao ou script de validacao nesse ambiente;
- executar apenas o signup de teste;
- conferir os `access_profile` da nova clinica;
- validar e entao descartar ou manter o ambiente de teste.

## Riscos
- Persistencia indevida no banco real se o signup for executado fora de ambiente isolado.
- Falha de rollback por causa do `db.commit()` interno do fluxo.
- Dificuldade de repetir o teste se a base isolada nao for criada de forma controlada.

## Ponto de parada
PONTO DE PARADA — requer autorizacao do usuario antes de criar ambiente de teste, rodar migration ou executar signup real.

## Quando sera necessario pedir autorizacao
Antes de qualquer acao que:
- crie banco de teste;
- rode migracao no ambiente isolado;
- execute signup real, mesmo que em ambiente isolado;
- ou altere qualquer `DATABASE_URL` de execucao.

## Critérios de sucesso da futura Subetapa 5B
- banco real nao tocado;
- nova conta/clinica criada apenas no ambiente isolado;
- nova clinica criada com sucesso;
- 10 `access_profile` base criados;
- `usuario_perfil_acesso` vazio, salvo fluxo independente;
- clinicas reais antigas nao tocadas;
- UI nao alterada.

## Resposta tecnica da avaliacao
Nao ha, neste momento, caminho comprovadamente seguro para executar o signup real no banco atual sem risco de persistencia. A estrategia correta e preparar um ambiente isolado/test database e parar antes da criacao da conta.

## Confirmações de escopo
- Nenhuma conta ou clinica foi criada.
- `criar_conta_saas` nao foi executada.
- Banco real nao foi alterado.
- `backend/.env` nao foi alterado.
- Codigo funcional nao foi alterado nesta subetapa.
- Frontend, UI, rotas/endpoints e `usuario_perfil_acesso` nao foram alterados.
- Clinicas existentes nao foram corrigidas.

## Checks executados
- `node --check frontend/app.js` -> ok
- `node --check frontend/js/modules/users-admin-modal-visual.js` -> ok
- `python -m py_compile backend/seeds/access_profiles_default.py` -> ok
- `python -m py_compile backend/seeds/access_profiles_bootstrap.py` -> ok
- `python -m py_compile backend/seeds/access_profiles_dry_run.py` -> ok
- `python -m py_compile backend/services/signup_service.py` -> ok
- `python -m py_compile backend/database.py` -> ok

## Proxima etapa recomendada
- Se o usuario autorizar, preparar um ambiente isolado/test database para a futura Subetapa 5B.
- Sem isso, nao executar signup real no banco atual.

