# Contrato Docker do Backend para AWS

## Objetivo

Definir a fundacao Docker de producao do backend FastAPI do Brana Cloude para futura publicacao em AWS, sem publicar nada na AWS nesta fase.

## Escopo

Incluido:

- Empacotar o backend FastAPI em imagem Linux.
- Preservar o funcionamento do frontend legado servido pelo backend.
- Excluir o frontend React da imagem.
- Excluir segredos, backups, dumps, logs e dados clinicos.
- Documentar variaveis, portas, health check e limitacoes.
- Validar importacao, startup e health check de forma segura.

Excluido:

- ECR, RDS, App Runner, S3, VPC, Route 53 e qualquer recurso AWS.
- Alteracao de banco, migrations, bootstrap destrutivo ou hotfix de schema.
- Alteracao de frontend React.
- Alteracao funcional do frontend legado.

## Documentos consultados

- `README.md`
- `docs/auditoria_prontidao_publicacao_aws.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/05_banco_dados.md`
- `docs/06_seguranca.md`
- `docs/08_setup_execucao.md`
- `docs/10_continuidade.md`
- `docs/11_roadmap_desenvolvimento.md`

## Arquitetura considerada

- Backend real: `backend/main.py`
- ASGI app real: `main:app`
- Frontend legado real: `frontend/`
- Frontend React: `frontend-react/` nao entra na imagem desta fase
- Banco: PostgreSQL via `DATABASE_URL`

## Contexto de build escolhido

Contexto escolhido: **raiz do repositorio**

## Justificativa do contexto

O backend monta e serve artefatos que vivem na raiz do projeto:

- `frontend/`
- `assets/`
- `storage/modelos/base/`
- `scripts/`
- `backend/data/`

Se o contexto fosse apenas `backend/`, o runtime perderia acesso ao frontend legado e a outros arquivos de apoio que o proprio codigo referencia.

## Versao Python

- Base escolhida: Python 3.10
- Justificativa: compatibilidade com o ambiente local observado e com as dependencias atuais do projeto

## Imagem-base

- `python:3.10-slim-bookworm`

## Comparacao local de bases

Foram comparadas localmente as variantes:

- `python:3.10-slim-trixie`
- `python:3.10-slim-bookworm`

Resultado resumido:

- ambas mantiveram `os=linux`, `architecture=amd64`, usuario `brana`, `WORKDIR=/app/backend` e comando Uvicorn sem `--reload`;
- `bookworm` ficou com bibliotecas base mais conservadoras para `perl`, `libc6` e `libsqlite3-0`;
- `bookworm` gerou imagem um pouco maior;
- a imagem final validada ficou em `bookworm` por ser a base mais segura nesta comparacao local.

## Arquivos incluidos

- `backend/`
- `frontend/`
- `assets/`
- `storage/modelos/base/`
- `backend/scripts/` copiado para `/app/scripts`

## Arquivos e diretórios excluidos

- `.git`
- `.github`
- `.env`
- `.env.*`
- `.venv/`
- `venv/`
- `node_modules/`
- `frontend-react/node_modules/`
- `frontend-react/dist/`
- backups, dumps, logs e caches
- `storage/modelos/clinicas/`

## Dependencia do frontend legado

O frontend legado continua necessario porque o backend o serve em `/app` e `/frontend`. Ele deve ser empacotado na imagem.

O frontend React nao entra na imagem porque e uma aplicacao separada de build estatico.

## Comando de build

```bash
docker build -t brana-backend:aws-foundation-local .
```

## Comando de execucao local

```bash
docker run --rm -p 8080:8080 --env-file backend/.env.production.example brana-backend:aws-foundation-local
```

Observacao:

- Este comando exige um `DATABASE_URL` real de homologacao ou um banco de testes seguro.
- Nao deve apontar para banco de producao.

## Comando de producao

```bash
sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"
```

## Porta

- Porta exposta: `8080`
- Porta configuravel por ambiente: `PORT`
- Fallback seguro: `8080`

## Health check

- Endpoint existente: `GET /health`
- Requisitos atendidos: sem auth, sem bootstrap, sem dependencia de servicos externos

## Usuario do contêiner

- Usuario nao root: `brana`

## Variaveis obrigatorias

- `DATABASE_URL`
- `JWT_SECRET_KEY`

## Variaveis recomendadas

- `PORT`
- `BRANA_RUNTIME_PROFILE=production`
- `BRANA_ENABLE_SCHEMA_BOOTSTRAP=false`
- `BRANA_ENABLE_RUNTIME_BOOTSTRAP=false`
- `BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP=false`
- `BRANA_ALLOW_SCHEMA_COMPAT_APPLY=false`
- `BRANA_SKIP_BOOTSTRAP=true`

## Variaveis opcionais

- `SIGNUP_CODE_EXP_MINUTES`
- `RESET_CODE_EXP_MINUTES`
- `PROTECTED_GRANT_EXPIRE_MINUTES`
- `OWNER_BYPASS_EMAILS`
- `OWNER_MASTER_EMAIL`
- `EMAIL_PROVIDER`
- `SMTP_*`
- `GOOGLE_*`
- `LICENCA_SUPORTE_EMAIL`
- `MERCADOPAGO_*`
- `PAGAMENTO_*`
- `BRANA_PDF_SIGN_*`

## Secrets

Devem ficar fora do repositorio e preferencialmente em Secrets Manager:

- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `SMTP_PASS`
- `SMTP_USER` quando aplicavel
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `MERCADOPAGO_ACCESS_TOKEN`
- `WHATSAPP_TOKEN`

## Configuracoes nao secretas

- `PORT`
- `BRANA_RUNTIME_PROFILE`
- `BRANA_ENABLE_SCHEMA_BOOTSTRAP`
- `BRANA_ENABLE_RUNTIME_BOOTSTRAP`
- `BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP`
- `BRANA_ALLOW_SCHEMA_COMPAT_APPLY`
- `BRANA_SKIP_BOOTSTRAP`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_FROM`
- `SMTP_TLS`
- URLs publicas de redirect e webhook

## Comportamento do bootstrap

- Bootstrap de schema deve ficar desabilitado na configuracao de producao proposta.
- Runtime bootstrap deve ficar desabilitado na configuracao de producao proposta.
- Hotfixes automáticos não devem executar na imagem de producao proposta.

## Compatibilidade Linux

Observado:

- `os.startfile` existe apenas em fluxo explicito de PDF no Windows.
- O import do backend nao depende desse fluxo.
- Caminhos Windows historicos existem em scripts e servicos de apoio.

Conclusao:

- A imagem Linux pode iniciar sem acionar a abertura grafica do PDF.
- Fluxos de PDF local continuam pendentes para uma futura fase de storage adequado.

## Temporarios

- `backend/tmp/editor_textos`
- arquivos transientes de PDF renderizado

Esses diretórios podem existir no contêiner, mas não devem ser tratados como persistencia.

## Storage persistente pendente

Pontos ainda pendentes para a futura fase S3:

- modelos por clinica
- uploads persistentes
- documentos gerados que precisem sobreviver ao ciclo da instancia
- eventuais arquivos salvos pelo editor de textos

## Fluxos ainda incompatíveis

- armazenamento local persistente como verdade final
- dependência de diretórios clínicos na máquina do contêiner
- abertura local de PDFs com interface gráfica

## Limitações conhecidas

- Docker nao estava disponível nesta máquina no momento da validacao.
- Nao foi possivel fazer build real da imagem nesta etapa.
- A validacao ficou estática e documental.

## Riscos

- Expor segredos no build se `.env` ou backups forem copiados por engano
- Quebra de runtime se o frontend legado nao for incluído
- Quebra de runtime se o contexto de build for apenas `backend/`
- Quebra de futuras rotas de apoio se `backend/data/` ou `backend/scripts/` forem omitidos

## Validações executadas

- Revisao documental
- Inspecao de imports e paths do backend
- Confirmacao de que Docker nao estava instalado nesta maquina

## Resultado do build

- Executado com sucesso nesta máquina.
- Tempo observado na última execução: cerca de 1m 42s.

## Tamanho da imagem

- Cerca de 99.9 MB.

## Resultado do startup

- Executado em contêiner Linux.
- Processo subiu como usuário `brana`.
- `BRANA_ENABLE_SCHEMA_BOOTSTRAP=false`.
- `BRANA_ENABLE_RUNTIME_BOOTSTRAP=false`.
- `BRANA_SKIP_BOOTSTRAP=true`.

## Resultado do health check

- Endpoint existente e apropriado: `GET /health`
- Respondeu HTTP 200.
- Não exigiu autenticação.
- Não exibiu traceback.

## Rollback

Se esta base Docker precisar ser revertida:

1. Remover `Dockerfile`
2. Remover `.dockerignore`
3. Remover `backend/.env.production.example`
4. Remover este contrato documental

## Critérios para seguir à próxima fase

- Dockerfile de producao presente
- `.dockerignore` presente
- backend sem secrets na imagem
- frontend legado incluso quando necessario
- frontend React nao incluido
- bootstrap desabilitado na proposta
- startup Linux sem `--reload`
- imagem preparada para ECR/App Runner futuramente

## Arquivos criados

- `Dockerfile`
- `.dockerignore`
- `backend/.env.production.example`
- `docs/contrato_docker_backend_aws.md`

## Arquivos alterados

- `docs/auditoria_prontidao_publicacao_aws.md` apenas se houver necessidade futura de complemento

## Conclusão

A fundacao Docker do backend ficou definida para a raiz do repositorio, com Python 3.10-slim, usuario nao root, porta configuravel por `PORT`, frontend legado incluido e frontend React excluido. A etapa ficou validada de verdade, com build real, startup real, health check e verificacao estrutural do frontend legado.

## Atualizacao scan1 local

Foi produzido e validado localmente um novo artefato de plataforma única para futura leitura do scan básico do ECR.

Motivo:

- a imagem anterior já tinha sido publicada pelo proprietário, mas o manifesto ficou como `application/vnd.oci.image.index.v1+json`;
- esta variante local foi preparada sem provenance e sem SBOM para manter um manifesto simples de imagem.

Comando usado:

```powershell
docker buildx build --platform linux/amd64 --provenance=false --sbom=false --no-cache --progress=plain --load -t brana-backend:aws-foundation-scan1 .
```

Resultado:

- build concluído com sucesso;
- imagem local criada: `brana-backend:aws-foundation-scan1`;
- arquitetura: `amd64`;
- sistema operacional: `linux`;
- usuário: `brana`;
- `WORKDIR`: `/app/backend`;
- `CMD`: `sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"`.

Smoke test local:

- processo rodando como usuário não root;
- escrita permitida em `/app/backend/tmp/editor_textos`;
- `/health` respondeu HTTP 200;
- `/app` respondeu HTTP 200;
- `/frontend/` respondeu HTTP 200;
- bootstrap de schema desligado;
- bootstrap de runtime desligado;
- `BRANA_SKIP_BOOTSTRAP=true`;
- nenhuma migration executada;
- nenhum `create_all` executado;
- banco utilizado apenas em contêiner PostgreSQL temporário e descartável.

Tag local do ECR preparada:

```powershell
docker tag brana-backend:aws-foundation-scan1 810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend:aws-foundation-d759367e-scan1
```

Publicação e scan ficam pendentes para execução manual do proprietário, fora deste ambiente.

## Validacao real concluida

Nesta etapa o contrato foi validado de verdade com:

- build real da imagem Docker;
- inspeção da imagem gerada;
- startup real em contêiner Linux;
- verificação de usuário não root;
- `GET /health`;
- `GET /app`;
- `GET /frontend/`.

Descobertas materiais registradas:

- o diretório `backend/tmp` precisava liberar escrita para o usuário `brana`;
- o caminho `/frontend/` precisava responder com o índice do frontend legado.

## Apendice de comparacao final

### Base selecionada

- `python:3.10-slim-bookworm`

### Motivo da escolha

- mostrou pacote base mais conservador para `perl`, `libc6` e `libsqlite3-0` em relacao ao `trixie`;
- preservou `os=linux`, `architecture=amd64`, `USER=brana`, `WORKDIR=/app/backend` e comando Uvicorn sem `--reload`;
- passou no smoke test final com `/health`, `/app` e `/frontend/` em HTTP 200.

### Comparacao tecnica registrada

- `python:3.10-slim-trixie`
  - distribuicao: Debian 13 (trixie)
  - `glibc`: `2.41-12+deb13u3`
  - `perl-base`: `5.40.1-6`
  - `libsqlite3-0`: `3.46.1-7+deb13u1`
  - binarios observados: `perl` presente, `sqlite3` ausente

- `python:3.10-slim-bookworm`
  - distribuicao: Debian 12 (bookworm)
  - `glibc`: `2.36-9+deb12u14`
  - `perl-base`: `5.36.0-7+deb12u3`
  - `libsqlite3-0`: `3.40.1-2+deb12u2`
  - binarios observados: `perl` presente, `sqlite3` ausente

- tamanho da imagem:
  - `trixie`: menor
  - `bookworm`: `102122224` bytes na imagem final validada

- justificativa da escolha por `bookworm`:
  - base mais conservadora para as bibliotecas criticas observadas;
  - menor risco de variação de runtime nesta frente;
  - smoke test aprovado com o mesmo comportamento funcional esperado.

- riscos remanescentes:
  - o backend ainda executa tentativas de compatibilidade de schema no startup quando o banco e vazio;
  - o App Runner ainda vai exigir scan e publicação manuais do proprietario;
  - o endpoint de health depende de ser mantido fora do middleware de autenticacao.

### Build final

- imagem local: `brana-backend:aws-foundation-scan1`
- plataforma: `linux/amd64`
- provenance: desabilitada
- SBOM: desabilitado
- sistema operacional: `linux`
- arquitetura: `amd64`
- usuario: `brana`
- `WORKDIR`: `/app/backend`
- comando: `sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"`

### Tamanho final

- `102122224` bytes no `docker image inspect`

### Smoke test final

- contêiner rodou como `brana`
- escrita permitida somente no diretório temporário previsto
- `/health` -> HTTP 200
- `/app` -> HTTP 200
- `/frontend/` -> HTTP 200
- banco temporário e descartável usado apenas para o teste
- nenhum banco real foi acessado
- nenhuma migration foi executada
- nenhum `Base.metadata.create_all` foi executado

### Tag local do ECR

```powershell
docker tag brana-backend:aws-foundation-scan1 810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend:aws-foundation-d759367e-scan1
```

### Observacoes finais

- publicacao e scan continuam pendentes para acao manual do proprietario;
- nenhuma interacao com AWS foi feita por este ambiente;
- nenhum commit foi criado;
- nenhum push Git foi feito.
