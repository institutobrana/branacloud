# Access Profile - Subetapa 5B: roteiro operacional para criar ambiente isolado de teste

## Objetivo
Documentar o roteiro operacional seguro para preparar um ambiente PostgreSQL isolado de teste que permita, em etapa futura, validar o signup real sem sujar o banco real.

## Status
Documento tecnico de planejamento. Nenhum ambiente foi criado nesta etapa.

## Branch confirmada
`modularizacao-segura-fase-1`

## Commit base
`a98e8b1 - Documenta ambiente isolado para validar signup`

## Estado atual do git
- `git status --short` mostra apenas arquivos `??` antigos do workspace e este documento como novo.
- Nao houve alteracao de banco, seed real, migration, frontend ou rotas.

## Arquivos analisados
- `backend/database.py`
- `backend/.env`
- `backend/services/signup_service.py`
- `backend/routes/auth_routes.py`
- `backend/seeds/access_profiles_bootstrap.py`
- `backend/seeds/access_profiles_default.py`
- `backend/seeds/access_profiles_dry_run.py`
- `docs/access_profile_subetapa_5a_preparar_ambiente_teste_signup.md`
- `docs/access_profile_subetapa_4_acoplamento_signup_novas_clinicas.md`
- `docs/access_profile_subetapa_4a_validacao_signup_sem_sujar_banco.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `README.md`
- `README_WEB.md`
- `requirements.txt`
- `pyproject.toml` nao foi encontrado
- `alembic.ini` nao foi encontrado
- `backend/alembic` nao foi encontrado
- `migrations` nao foi encontrada

## Confirmacoes de escopo
- Nenhum banco foi criado.
- Nenhuma conta ou clinica foi criada.
- `criar_conta_saas` nao foi executada.
- `backend/.env` nao foi alterado.
- Codigo funcional nao foi alterado.

## Como o projeto le DATABASE_URL
O arquivo `backend/database.py` carrega o ambiente com `load_dotenv()` e instancia o engine a partir de `DATABASE_URL`:

```python
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

## Banco real identificado
O banco real local identificado na configuracao atual e:

`postgresql://postgres:***@localhost:5432/brana_saas`

## Situacao de Alembic / migrations / setup
- Nao foi localizado `alembic.ini`.
- Nao foi localizado diretorio `backend/alembic`.
- Nao foi localizado diretorio `migrations`.
- Nao foi localizado script seguro de setup de banco.
- Nao foi localizado teste automatizado seguro de signup.

## Estrategia recomendada para o ambiente isolado
1. Criar um PostgreSQL separado para teste, por exemplo `brana_saas_test`.
2. Apontar `DATABASE_URL` temporariamente para esse banco isolado apenas no processo de teste.
3. Preparar a estrutura do banco isolado por mecanismo aprovado para a base de dados do projeto.
4. Executar `criar_conta_saas()` apenas no ambiente isolado na futura Subetapa 5B.
5. Validar que a nova clinica nasce com os 10 `access_profile` base.
6. Confirmar que `usuario_perfil_acesso` continua vazio, salvo fluxo independente.
7. Descartar ou manter o banco de teste conforme decisao do usuario.

## Como configurar DATABASE_URL temporaria sem alterar backend/.env
Usar variavel de ambiente apenas no processo de execucao da etapa futura, sem editar `backend/.env`.

Exemplo conceitual para a etapa futura:

```powershell
$env:DATABASE_URL="postgresql://postgres:***@localhost:5432/brana_saas_test"
```

## Comandos sugeridos para a proxima etapa
Estes comandos sao apenas sugeridos para futura autorizacao e nao foram executados nesta subetapa:

```powershell
$env:DATABASE_URL="postgresql://postgres:***@localhost:5432/brana_saas_test"
cd "D:\BRANA ARQUIVOS\BRANA CLOUD\backend"
..\venv_saas\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Antes de qualquer execucao real na proxima etapa, sera preciso preparar o banco isolado aprovado pelo usuario.

## Riscos
- O banco real `brana_saas` nao deve ser usado para o teste real de signup.
- `criar_conta_saas()` faz `db.commit()` interno, entao o teste em banco real nao e rollback-safe.
- Sem um banco isolado, existe risco de persistir dados de teste no ambiente real.
- A ausencia de Alembic/migrations/seed de setup visiveis neste repo exige validacao cuidadosa da estrutura do banco de teste.

## Criterios de sucesso do ambiente isolado futuro
- Banco real `brana_saas` nao tocado.
- Nova conta criada somente no banco isolado.
- Nova clinica criada com sucesso.
- 10 `access_profile` base criados.
- `usuario_perfil_acesso` vazio, salvo fluxo independente.
- Clinicas reais antigas nao tocadas.
- UI nao alterada.

## Criterios de sucesso da validacao futura do signup
- O signup real executado apenas no ambiente isolado.
- A nova clinica nasce com os 10 perfis base.
- O bootstrap oficial e idempotente.
- Nenhum dado vaza para o banco real.

## Ponto de parada
PONTO DE PARADA — requer autorizacao do usuario antes de criar o banco de teste, preparar estrutura, rodar migration/setup ou executar signup real.

## Ponto exato de parada para autorizacao
Antes de qualquer comando que crie banco, aplique estrutura, rode migration/setup ou execute `criar_conta_saas()` em ambiente isolado.

## Proxima etapa recomendada
Aguardar autorizacao do usuario para montar o banco isolado e, somente depois, seguir para a validacao futura da Subetapa 5B.

