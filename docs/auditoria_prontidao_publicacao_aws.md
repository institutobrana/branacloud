# Auditoria de Prontidao para Publicacao na AWS

## 1. Objetivo

Auditar a prontidao do Brana Cloude para publicacao definitiva na AWS, sem alterar comportamento funcional, infraestrutura, banco, migrations, frontend ou backend.

O foco desta auditoria e identificar exatamente o que existe hoje, o que depende de filesystem local, o que depende de variaveis de ambiente, o que quebraria em App Runner/EC2/Linux e o que precisa ser planejado antes de uma publicacao segura.

## 2. Escopo

Incluido nesta auditoria:

- Documentacao atual do repositorio.
- Estrutura real de backend, frontend legado e frontend React.
- Comando real de inicializacao e build.
- Variaveis de ambiente encontradas.
- Banco PostgreSQL e bootstrap atual.
- Uploads, PDFs, arquivos temporarios e armazenamento persistente.
- Integracoes externas.
- Riscos de seguranca, Linux e deploy.
- Recomendacao de estrategia AWS.

Fora de escopo nesta etapa:

- Implementar AWS.
- Alterar backend, frontend, banco, migrations ou Docker.
- Fazer commit ou push.
- Expor valores reais de segredos.

## 3. Documentos existentes consultados

Documentacao principal lida primeiro, conforme orientacao do repositorio:

- `README.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/05_banco_dados.md`
- `docs/06_seguranca.md`
- `docs/08_setup_execucao.md`
- `docs/10_continuidade.md`
- `docs/11_roadmap_desenvolvimento.md`

Documentos adicionais relevantes encontrados durante a varredura:

- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`
- `docs/validacao_manual_final_signup_brana_pos_correcoes.md`
- `docs/auditoria_documentacao_geral_brana_cloud_pos_signup_brana.md`

Nao foram encontrados arquivos de deploy formal como `render.yaml`, `Dockerfile`, `docker-compose.yml` ou workflows em `.github/workflows/`.

## 4. Estado inicial do Git

- Diretorio utilizado: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch atual: `modularizacao-segura-fase-1`
- Remote origin: `https://github.com/institutobrana/branacloud.git`
- Hash inicial do HEAD: `494bccbba1eb49d2f34a418947a16bc888bb28dd`
- Branch upstream: `origin/modularizacao-segura-fase-1`
- Status inicial resumido: worktree sujo com multiplos arquivos modificados, deletados e nao rastreados, inclusive em `backend/`, `frontend/`, `frontend-react/` e `docs/`
- Stage inicial: vazio
- Ahead/behind: `git status` nao mostrou divergencia numerica; apenas o tracking com `origin/modularizacao-segura-fase-1`

Observacao: havia muitas alteracoes preexistentes fora do escopo desta auditoria. Nenhuma foi revertida, removida ou formatada.

## 5. Arquitetura atual encontrada

### 5.1 Backend real

- Diretorio real: `backend/`
- Entrada real: `backend/main.py`
- Aplicacao FastAPI real: `app`
- Objeto real para Uvicorn: `main:app`
- Banco: PostgreSQL via SQLAlchemy
- Autenticacao: JWT via `python-jose`
- Servidor atual: Uvicorn
- Middleware de tenant: `TenantMiddleware`
- Middleware de trial: `TrialMiddleware`
- Servico de frontend legado: `frontend/` montado pelo backend

### 5.2 Frontend React real

- Diretorio real: `frontend-react/`
- Stack: React 19 + Vite + Ant Design
- Comando de dev: `npm run dev`
- Comando de build: `npm run build`
- Pasta final gerada: `frontend-react/dist`

### 5.3 Frontend legado

- Diretorio real: `frontend/`
- E servido pelo backend em `/app` e `/frontend`
- Continua funcional e nao pode ser tratado como removido nesta etapa

## 6. Backend FastAPI

### 6.1 Modulo de aplicacao e start

Arquivo de entrada: `backend/main.py`

No codigo atual:

- A aplicacao e criada em `app = FastAPI(...)`.
- O startup carrega `backend/.env`.
- O backend registra routers em `backend/routes/`.
- O backend monta `frontend/` em `/frontend`.
- O backend expoe `/app`, `/`, `/favicon.ico` e `/health`.

Comando real usado hoje no guia local:

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD\backend"
..\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Porta local atual:

- `8000`

Porta de producao:

- Nao esta formalmente configurada no repo.
- Para AWS, o backend precisara ouvir em porta dinamica fornecida pelo runtime ou ser adaptado para `0.0.0.0` e porta de ambiente.

### 6.2 Versao esperada de Python

- O repositorio nao fixa de forma explicita a versao de Python em um arquivo de runtime.
- O ambiente local usa `.venv` com Python 3.10 conforme os artefatos presentes.
- Inference segura: o projeto deve ser tratado como compativel com Python 3.10+.

### 6.3 Dependencias

Arquivo principal: `backend/requirements.txt`

Pacotes relevantes:

- `fastapi`
- `uvicorn[standard]`
- `sqlalchemy`
- `psycopg2-binary`
- `python-dotenv`
- `pydantic`
- `python-jose[cryptography]`
- `passlib[bcrypt]`
- `bcrypt`
- `python-multipart`
- `requests`
- `pyHanko`
- `reportlab`
- `pillow`
- `pypdf`

### 6.4 Startup e tarefas executadas

Em `backend/main.py`, o startup faz:

- Leitura de `backend/.env`.
- Bootstrap de schema quando habilitado.
- Criacao de tabelas via `Base.metadata.create_all` quando `BRANA_ENABLE_SCHEMA_BOOTSTRAP` permite.
- Seed de `tiss_tipo_atendimento`.
- Garantia de diretorios em `storage/modelos/base/` e `storage/modelos/clinicas/`.
- Hotfixes aditivos em tabelas legadas de usuarios, simbolos e anamnese.
- Criacao da tabela `quadro_avisos` se faltar.
- Subida de thread de runtime bootstrap quando habilitada.

Isso e aceitavel para ambiente local, mas e um risco operacional em producao AWS se continuar rodando bootstrap pesado ou escrita local no startup.

### 6.5 Health check

Existe:

- `GET /health`

Resposta inclui:

- `status`
- `service`
- `runtime_profile`
- `schema_bootstrap_enabled`
- `runtime_bootstrap_enabled`

### 6.6 CORS atual

O backend permite apenas origens locais:

- `http://127.0.0.1:8000`
- `http://localhost:8000`
- `http://127.0.0.1:5173`
- `http://localhost:5173`

Conclusao:

- Isso e suficiente para dev local.
- Para AWS, essas origens precisarao ser substituidas pelas origens reais do dominio final.

### 6.7 Cookies, sessao e JWT

O projeto usa token Bearer em `Authorization` e guarda token em `localStorage` no frontend React.

O JWT:

- usa `HS256`
- depende de `JWT_SECRET_KEY`
- expira com `exp`
- carrega `user_id`, `clinica_id` e `is_admin`

Nao ha cookie de autenticacao como barreira principal hoje. O risco principal para AWS e localStorage mais CORS permissivo mal configurado.

### 6.8 Comando de producao recomendado

Com base no codigo real, a opcao mais conservadora hoje e usar Uvicorn com porta dinamica do ambiente:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Observacao:

- Isto e uma recomendacao derivada do codigo e do padrao AWS.
- O repo nao traz `gunicorn`, entao nao e possivel recomendar Gunicorn como comando real sem mudar dependencias.

## 7. Variaveis de ambiente encontradas

### 7.1 Backend e runtime

| Variavel | Area | Arquivo | Obrigatoria | Finalidade | Fallback inseguro | Hardcoded | AWS | Secrets Manager/Parameter Store | Build ou runtime | Risco frontend |
|---|---|---|---|---|---|---|---|---|---|---|
| `DATABASE_URL` | backend | `backend/database.py`, `backend/main.py`, scripts | Sim | Conexao PostgreSQL | Nao, sem ela o backend falha | Nao | Nao diretamente no app runner build; sim em runtime | Secrets Manager | Runtime | Nenhum direto |
| `JWT_SECRET_KEY` | backend | `backend/security/jwt_handler.py` | Sim | Assinar/validar JWT | Nao, falha se ausente | Nao | Sim | Secrets Manager | Runtime | Nenhum direto |
| `BRANA_RUNTIME_PROFILE` | backend | `backend/services/runtime_profile_service.py` | Nao | Perfil de execucao | Sim, `local` por padrao | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_ENABLE_SCHEMA_BOOTSTRAP` | backend | `backend/services/runtime_profile_service.py` | Nao | Bootstrap de schema | Sim, depende do default do perfil | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_ENABLE_RUNTIME_BOOTSTRAP` | backend | `backend/services/runtime_profile_service.py` | Nao | Runtime bootstrap | Sim, depende do default do perfil | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP` | backend | `backend/services/runtime_profile_service.py` | Nao | Permitir bootstrap via HTTP | Sim, depende do default do perfil | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_ALLOW_SCHEMA_COMPAT_APPLY` | backend | `backend/services/runtime_profile_service.py` | Nao | Aplicar compatibilidade de schema | Sim, depende do default do perfil | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_SKIP_BOOTSTRAP` | backend | `backend/main.py` | Nao | Pular bootstrap no startup | Sim | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_RUNTIME_BOOTSTRAP_AUDIT_PATH` | backend | `backend/services/runtime_bootstrap_service.py` | Nao | Arquivo de auditoria do bootstrap | Sim, usa caminho default local | Nao | Nao recomendado | Parameter Store | Runtime | Nenhum |
| `EDITOR_TEXTOS_DEBUG` | backend | `backend/routes/editor_textos_routes.py` | Nao | Debug do editor de textos | Sim, `false` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `EMAIL_ATTACHMENT_MAX_MB` | backend | `backend/routes/relatorios_routes.py` | Nao | Limite de anexo por email | Sim, `10` | Nao | Pode | Parameter Store | Runtime | Nenhum |

### 7.2 Autenticacao e codigos

| Variavel | Area | Arquivo | Obrigatoria | Finalidade | Fallback inseguro | Hardcoded | AWS | Secrets Manager/Parameter Store | Build ou runtime | Risco frontend |
|---|---|---|---|---|---|---|---|---|---|---|
| `SIGNUP_CODE_EXP_MINUTES` | backend | `backend/routes/auth_routes.py`, `backend/services/email_service.py` | Nao | Expiracao do codigo de signup | Sim, `10` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `RESET_CODE_EXP_MINUTES` | backend | `backend/routes/auth_routes.py`, `backend/services/email_service.py` | Nao | Expiracao do reset | Sim, `10` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `PROTECTED_GRANT_EXPIRE_MINUTES` | backend | `backend/routes/auth_routes.py` | Nao | Grant temporario de modulo protegido | Sim, `20` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `OWNER_BYPASS_EMAILS` | backend | `backend/security/superadmin.py` | Nao | Lista de emails com bypass | Sim, vazio | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `OWNER_MASTER_EMAIL` | backend | `backend/security/superadmin.py` | Nao | Email mestre proprietario | Sim, vazio | Nao | Pode | Parameter Store | Runtime | Nenhum |

### 7.3 Email e integracoes

| Variavel | Area | Arquivo | Obrigatoria | Finalidade | Fallback inseguro | Hardcoded | AWS | Secrets Manager/Parameter Store | Build ou runtime | Risco frontend |
|---|---|---|---|---|---|---|---|---|---|---|
| `EMAIL_PROVIDER` | backend | `backend/services/email_service.py` | Nao | Escolha entre SMTP e Resend | Sim, `smtp` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `RESEND_API_KEY` | backend | `backend/services/email_service.py` | Nao | Envio via Resend | Nao | Nao | Sim | Secrets Manager | Runtime | Nenhum |
| `EMAIL_FROM` | backend | `backend/services/email_service.py` | Nao | Remetente Resend | Nao | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `SMTP_HOST` | backend | `backend/services/email_service.py` | Nao | Host SMTP | Nao | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `SMTP_PORT` | backend | `backend/services/email_service.py` | Nao | Porta SMTP | Sim, `587` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `SMTP_USER` | backend | `backend/services/email_service.py` | Nao | Usuario SMTP | Sim, vazio | Nao | Sim | Secrets Manager | Runtime | Nenhum |
| `SMTP_PASS` | backend | `backend/services/email_service.py` | Nao | Senha SMTP | Sim, vazio | Nao | Sim | Secrets Manager | Runtime | Nenhum |
| `SMTP_FROM` | backend | `backend/services/email_service.py` | Nao | Remetente SMTP | Nao | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `SMTP_TLS` | backend | `backend/services/email_service.py` | Nao | TLS SMTP | Sim, `true` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `GOOGLE_CLIENT_ID` | backend | `backend/routes/auth_routes.py`, `backend/services/google_calendar_service.py` | Nao | OAuth Google | Sim, vazio | Nao | Pode | Secrets Manager | Runtime | Nenhum |
| `GOOGLE_CLIENT_SECRET` | backend | `backend/routes/auth_routes.py`, `backend/services/google_calendar_service.py` | Nao | OAuth Google | Sim, vazio | Nao | Pode | Secrets Manager | Runtime | Nenhum |
| `GOOGLE_REDIRECT_URI` | backend | `backend/routes/auth_routes.py` | Nao | Redirect OAuth Google | Sim, `http://127.0.0.1:8000/auth/google/callback` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `GOOGLE_CALENDAR_REDIRECT_URI` | backend | `backend/services/google_calendar_service.py` | Nao | Redirect Google Calendar | Sim, `http://127.0.0.1:8000/auth/google/calendar/callback` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `WHATSAPP_TOKEN` | backend | `backend/routes/agenda_legado_routes.py` | Nao | Integração WhatsApp | Sim, vazio | Nao | Sim | Secrets Manager | Runtime | Nenhum |
| `WHATSAPP_PHONE_NUMBER_ID` | backend | `backend/routes/agenda_legado_routes.py` | Nao | Integração WhatsApp | Sim, vazio | Nao | Sim | Secrets Manager | Runtime | Nenhum |
| `LICENCA_SUPORTE_EMAIL` | backend | `backend/routes/licenca_routes.py` | Nao | Email suporte licenca | Sim, `institutobrana@gmail.com` | Sim, valor legado no codigo | Pode | Parameter Store | Runtime | Nenhum |
| `MERCADOPAGO_ACCESS_TOKEN` | backend | `backend/routes/licenca_routes.py` | Nao | API Mercado Pago | Sim, vazio | Nao | Sim | Secrets Manager | Runtime | Nenhum |
| `MERCADOPAGO_API_BASE` | backend | `backend/routes/licenca_routes.py` | Nao | Base URL Mercado Pago | Sim, `https://api.mercadopago.com` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `MERCADOPAGO_WEBHOOK_URL` | backend | `backend/routes/licenca_routes.py` | Nao | Webhook do pagamento | Sim, vazio | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `MERCADOPAGO_BACK_URL` | backend | `backend/routes/licenca_routes.py` | Nao | URL de retorno | Sim, vazio | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `MERCADOPAGO_USE_SANDBOX` | backend | `backend/routes/licenca_routes.py` | Nao | Alternar sandbox | Sim, `false` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `PAGAMENTO_MENSAL_URL` | backend | `backend/routes/licenca_routes.py` | Nao | Link mensal | Sim, URL legacy fallback no codigo | Sim, fallback legado | Pode | Parameter Store | Runtime | Nenhum |
| `PAGAMENTO_ANUAL_URL` | backend | `backend/routes/licenca_routes.py` | Nao | Link anual | Sim, URL legacy fallback no codigo | Sim, fallback legado | Pode | Parameter Store | Runtime | Nenhum |
| `PLANO_MENSAL_VALOR` | backend | `backend/routes/licenca_routes.py` | Nao | Valor mensal | Sim, valor default no codigo | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `PLANO_ANUAL_VALOR` | backend | `backend/routes/licenca_routes.py` | Nao | Valor anual | Sim, valor default no codigo | Nao | Pode | Parameter Store | Runtime | Nenhum |

### 7.4 Assinatura PDF

| Variavel | Area | Arquivo | Obrigatoria | Finalidade | Fallback inseguro | Hardcoded | AWS | Secrets Manager/Parameter Store | Build ou runtime | Risco frontend |
|---|---|---|---|---|---|---|---|---|---|---|
| `BRANA_PDF_SIGN_TSA_URL` | backend | `backend/services/digital_signature_service.py` | Nao | TSA assinatura PDF | Sim, vazio | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_PDF_SIGN_MD_ALG` | backend | `backend/services/digital_signature_service.py` | Nao | Algoritmo digest | Sim, `sha256` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_PDF_SIGN_REASON` | backend | `backend/services/digital_signature_service.py` | Nao | Motivo assinatura | Sim, `Assinado digitalmente` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_PDF_SIGN_LOCATION` | backend | `backend/services/digital_signature_service.py` | Nao | Local assinatura | Sim, `Brana SaaS` | Sim, nome historico | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_PDF_SIGN_CONTACT` | backend | `backend/services/digital_signature_service.py` | Nao | Contato assinatura | Sim, vazio | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_PDF_SIGN_TIMESTAMP_FORMAT` | backend | `backend/services/digital_signature_service.py` | Nao | Formato timestamp | Sim, `%d/%m/%Y %H:%M:%S` | Nao | Pode | Parameter Store | Runtime | Nenhum |
| `BRANA_PDF_SIGN_PROFILE` | backend | `backend/services/digital_signature_service.py` | Nao | Perfil PAdES | Sim, `pades` | Nao | Pode | Parameter Store | Runtime | Nenhum |

### 7.5 Variaveis de frontend

- Nao foi encontrada variavel `VITE_API_BASE_URL` no codigo atual.
- O React usa `'/api'` como base padrao em `frontend-react/src/services/api.js`.
- Isso significa que, para S3 + CloudFront, a API precisara ser exposta em um dominio separado e a variavel de build devera ser introduzida futuramente.

### 7.6 Variaveis legadas e scripts

Foram encontradas variaveis em scripts operacionais ou integracoes antigas:

- `EDS70_SOURCE_SERVER`
- `EDS70_SOURCE_DATABASE`
- `EDS70_SOURCE_UID`
- `EDS70_SOURCE_PWD`
- `EDS70_ODBC_DRIVER`
- `EASYDENTAL_SERVER`
- `EASYDENTAL_DATABASE`
- `EASYDENTAL_UID`
- `EASYDENTAL_PASSWORD`
- `RELATORIO_SEM_LOGIN_DIAS`
- `LICENSE_SECRET`

Essas variaveis sao relevantes para scripts e migracoes auxiliares, nao para o fluxo web AWS principal.

## 8. Banco PostgreSQL

### 8.1 Situacao atual

- Banco oficial do web atual: PostgreSQL
- Conexao: SQLAlchemy em `backend/database.py`
- Biblioteca de driver: `psycopg2-binary`
- ORM: SQLAlchemy
- Pool: `sessionmaker` com `engine` do SQLAlchemy

### 8.2 Nome do banco e versao

- O nome real do banco depende de `DATABASE_URL`.
- O repositorio nao fixa uma versao de PostgreSQL em arquivo de configuracao.
- Nao ha evidência de recurso PostgreSQL muito especifico ou incompatibilidade grave com RDS na leitura feita.

### 8.3 Migrations e bootstrap

Situacao encontrada:

- Nao ha migrations formais em Alembic.
- O startup usa `Base.metadata.create_all` quando habilitado.
- O startup aplica hotfixes aditivos para manter compatibilidade com bancos legados.
- Existem scripts aditivos e scripts de migracao manual em `backend/scripts/`.

Conclusao:

- A migração para RDS e AWS e viavel, mas precisa de processo controlado e backup.
- O banco nao deve ser tratado como descartavel nem recriado automaticamente em producao.

### 8.4 Compatibilidade com RDS PostgreSQL

Compatibilidade esperada:

- Boa, porque o stack e PostgreSQL + SQLAlchemy.
- Risco principal nao e o banco em si, e sim o bootstrap automatico, os scripts aditivos e o fato de nao haver migrations formais.

### 8.5 Backup e restauracao

Maneira segura sugerida:

1. Gerar backup com `pg_dump` do banco origem.
2. Restaurar em ambiente de homologacao RDS.
3. Validar schema, contagens e rotas criticas.
4. Fazer corte final com janela de manutencao.

Para restauracao no RDS:

- Usar `psql` ou `pg_restore` conforme o formato do dump.
- Manter o RDS privado apos a migracao, se a transferencia inicial usar um canal controlado, VPN, bastion ou IP temporario permitido.

### 8.6 Dependencias de locale e timezone

- O codigo usa principalmente `datetime.utcnow()` ou timestamps em UTC.
- Nao ha forte dependência de locale do sistema observada nesta varredura.
- Ainda assim, a producao AWS deve operar com timezone explicitamente definido e logs em UTC.

## 9. Uploads e armazenamento persistente

Este item e critico porque App Runner nao deve ser tratado como armazenamento permanente.

### 9.1 Pontos encontrados

#### `backend/routes/relatorios_routes.py`

- Funcao: `enviar_email_relatorio`
- Entrada: `UploadFile`
- Uso: le o arquivo inteiro em memoria e envia como anexo por email
- Persistencia local: nao grava em disco
- Risco AWS: baixo para filesystem, medio para limite de memoria/size do anexo

#### `backend/routes/editor_textos_routes.py`

Pontos relevantes:

- `EDITOR_TEXTOS_TMP_DIR = PROJECT_DIR / "backend" / "tmp" / "editor_textos"`
- `_salvar_pdf_temp_local(...)`
- `_resolver_pdf_temp_local(...)`
- `_abrir_pdf_path_no_app_local(...)`
- `_abrir_pdf_no_app_local(...)`

Uso:

- Gera PDF temporario local em disco.
- Abre PDF localmente com `os.startfile` no Windows.

Risco AWS:

- Alto, porque filesystem do App Runner e efemero.
- Abre PDF localmente e depende de Windows, o que nao existe em Linux AWS.

#### `backend/services/editor_pdf_service.py`

- Usa `tempfile.TemporaryDirectory` em `backend/tmp/pdf_render`
- Escreve HTML/PDF temporario durante renderizacao
- Depende de `reportlab`

Risco AWS:

- Moderado para temporarios, porque o fluxo e ok em filesystem efemero se o arquivo for apenas transiente.
- Alto se qualquer caminho temporario for assumido como persistente.

#### `backend/services/modelos_service.py`

- Lê arquivos em `storage/modelos/base/` e `storage/modelos/clinicas/`
- Sincroniza catálogo de modelos a partir de arquivos fisicos
- Armazena `caminho_arquivo` no banco

Risco AWS:

- Alto se o storage permanecer local.
- O sistema precisa de S3 ou outro armazenamento persistente para os modelos/documentos se a producao for desligada do disco local.

#### `backend/services/signup_service.py`

- Dependencia de `Dados/Dist/`
- Dependencia de varios snapshots `scripts/easy_*.json`
- Dependencia de seed CSVs locais

Risco AWS:

- Alto para runtime de producao se esses caminhos nao existirem no container ou host.

### 9.2 Diretórios locais dependentes

Diretorios e caminhos com dependencia local/Windows:

- `storage/modelos/base/`
- `storage/modelos/clinicas/`
- `backend/tmp/editor_textos`
- `backend/tmp/pdf_render`
- `Dados/Dist`
- `Dados/particular_336_procedimentos.csv`
- `Dados/auxiliares_easydental_seed.json`
- `Y:\EDS70`
- `D:\...`

### 9.3 Migração para S3

Recomendacao:

- Tudo que e documento persistente, upload, anexo, imagem e arquivo de modelo deve migrar para S3.
- O banco pode manter apenas metadados e caminhos/keys do objeto.
- Temporarios de renderizacao podem continuar locais, desde que descartaveis.

Impacto esperado:

- Necessario criar camada de abstracao de storage.
- Necessario revisar URLs armazenadas no banco.
- Necessario validar permissao, mime type e tamanho.

## 10. Frontend React

### 10.1 Diretorio e ferramentas

- Diretorio: `frontend-react/`
- Gerenciador de pacotes: npm
- Build system: Vite
- Arquivo de dependencias: `frontend-react/package.json`
- Lockfile: `frontend-react/package-lock.json`

### 10.2 Versao de Node

- Nao existe `.nvmrc` nem `.node-version` no repositorio.
- Nao ha pinagem formal de Node.
- Inference segura: usar Node 20 LTS na AWS e no CI ate haver pinagem melhor.

### 10.3 Comando de instalacao e build

Instalacao:

```bash
npm install
```

Build:

```bash
npm run build
```

Pasta final gerada:

- `frontend-react/dist`

### 10.4 Vite e API

`frontend-react/vite.config.js`:

- Configura proxy apenas para dev.
- `/api` aponta para `http://localhost:8000`
- Faz rewrite removendo o prefixo `/api`

`frontend-react/src/services/api.js`:

- Usa `VITE_API_BASE_URL` se definido.
- Caso contrario, usa `'/api'`

Conclusao:

- A variavel que devera apontar para algo como `https://api.dominio.com.br` e `VITE_API_BASE_URL`.
- Hoje ela nao aparece como obrigatoria no repositorio, mas e a variavel correta para a futura publicacao front-end em S3 + CloudFront.

### 10.5 Autenticacao no React

Arquivos:

- `frontend-react/src/features/auth/AuthProvider.jsx`
- `frontend-react/src/features/auth/authApi.js`
- `frontend-react/src/features/auth/authStorage.js`
- `frontend-react/src/features/auth/authRenewalController.js`
- `frontend-react/src/features/auth/authBrowserSessionSync.js`

Comportamento:

- Token fica em `localStorage` como `brana_token`
- `Authorization: Bearer <token>` e enviado nas chamadas
- Renovacao automatica roda a cada 15 minutos
- Existe sincronizacao entre abas via `storage`, `visibilitychange` e `focus`
- Logout limpa token local

### 10.6 Rotas do React

`frontend-react/src/app/routes.jsx` mostra apenas rotas iniciais expostas no mapa principal, mas a navegacao real hoje e mais ampla via `frontend-react/src/app/App.jsx`.

Conclusao:

- O React depende de fallback para `index.html` em qualquer SPA route.
- Em S3 + CloudFront, sera necessario reescrita de rotas para `index.html`.

### 10.7 Riscos de bundle

- Qualquer segredo em `VITE_*` vai para o bundle final.
- Segredos nao podem ser colocados em variaveis de ambiente do frontend.
- Apenas URLs publicas e flags nao sensiveis devem ir para o build.

## 11. Frontend legado

### 11.1 Situacao atual

- Diretorio: `frontend/`
- Servido pelo backend
- Continua referenciado em `backend/main.py`

### 11.2 Necessidade em producao

Conclusao da leitura:

- O frontend legado ainda e necessario para o sistema atual porque o backend o monta em `/frontend` e a home `/app` continua apontando para a interface legacy.
- O React novo existe em paralelo, mas nao substitui completamente o legado nesta base.

### 11.3 Pode ser ignorado na primeira publicacao AWS?

Resposta:

- Nao com segurança, porque o backend ainda o serve e varios fluxos ainda estao acoplados a ele.
- Ele pode ser tratado como camada separada no planejamento, mas nao como inexistente.

## 12. Render

### 12.1 Achados

Nao foram encontrados nesta auditoria:

- `render.yaml`
- config de deploy do Render
- workflows dedicados ao Render
- scripts formais de publicacao no Render

### 12.2 Classificacao

- Pode ser reaproveitado na AWS: nenhuma configuracao formal localizada
- Precisa ser adaptado: a estrategia de start/build/host e o dominio
- Deve ser removido futuramente: referencia historica de `Brana SaaS` e eventuais URLs antigas
- Nao interfere: o fato de nao existir arquivo de deploy formal hoje

### 12.3 Referencias historicas

Foram encontrados textos e docs historicos sobre auditoria/deploy, mas sem uma configuracao de Render ativa no repositorio analisado.

## 13. Docker e estrategia de deploy

### 13.1 Situação atual

Nao foram encontrados:

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- build multi-stage

### 13.2 Comparacao das opcoes

#### A. App Runner usando codigo-fonte

Vantagens:

- Menor friccao inicial
- Bom para o backend FastAPI simples
- Integra bem com GitHub

Desvantagens:

- Requer cuidado com comando de start e porta
- Precisa tratar dependencias do sistema
- Nao resolve storage persistente sozinho

#### B. App Runner usando imagem Docker

Vantagens:

- Maior controle do runtime
- Facilita fixar dependencias de sistema
- Pode facilitar rotinas com bibliotecas nativas

Desvantagens:

- Exige Dockerfile bem feito
- Aumenta complexidade operacional

#### C. ECS Fargate

Vantagens:

- Mais flexivel que App Runner
- Bom para arquitetura maior

Desvantagens:

- Mais complexo para a fase atual
- Overhead operacional maior

#### D. EC2

Vantagens:

- Maximo controle

Desvantagens:

- Maior custo operacional e de manutencao
- Mais risco de drift
- Menos simples para o time atual

#### E. Elastic Beanstalk

Vantagens:

- Tradicional e conhecido

Desvantagens:

- Menos alinhado ao stack atual do projeto
- Menos previsivel que App Runner para este caso

### 13.3 Recomendacao principal

Recomendacao para o estagio atual do Brana Cloude:

- **App Runner usando imagem Docker**, depois de um Dockerfile bem definido para o backend.

Justificativa:

- equilibrio entre simplicidade e controle
- facilita acessar RDS privado
- reduz surpresa com dependencias do sistema
- melhor para o backend atual do que EC2/Beanstalk
- evita depender do filesystem efemero como persistencia

Se a prioridade maxima for velocidade e o runtime permanecer extremamente simples, App Runner por codigo-fonte e o caminho mais curto. Porem, para este projeto, a necessidade de bibliotecas nativas, PDFs, assinatura e caminhos locais torna a imagem Docker mais segura como direcao principal.

## 14. Dominio, HTTPS e CORS

### 14.1 Pendencias de dominio

Nao foi inventado dominio. A proprietaria devera fornecer o dominio registrado no Registro.br.

### 14.2 O que sera afetado

No codigo atual, sera afetado quando o dominio real for definido:

- `allow_origins` em `backend/main.py`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_CALENDAR_REDIRECT_URI`
- `MERCADOPAGO_WEBHOOK_URL`
- `MERCADOPAGO_BACK_URL`
- possiveis URLs publicas de API no frontend via `VITE_API_BASE_URL`

### 14.3 Estrutura futura recomendada

- `app.dominio.com.br` para frontend
- `api.dominio.com.br` para backend
- `www` opcional, redirecionando para a raiz
- Route 53 como DNS
- ACM para HTTPS
- CloudFront para o frontend
- App Runner custom domain para API

### 14.4 CORS

Hoje o CORS e local. Em producao:

- permitir apenas dominio web real
- nunca deixar `*` com credenciais
- revisar `allow_credentials`

## 15. Seguranca

### 15.1 Achados classificados

#### Critico

- `DATABASE_URL` real nunca pode entrar no repo.
- `JWT_SECRET_KEY` ausente quebra autenticacao; exposto quebra a seguranca.
- Dependencia de filesystem local para dados persistentes em ambiente efemero.

#### Alto

- `frontend-react` usa `localStorage` para token.
- `backend/main.py` aplica bootstrap e hotfixes no startup.
- `frontend-react` nao tem `VITE_API_BASE_URL` fixado ainda.
- `frontend/` legacy ainda e servido junto e pode esconder fluxos antigos.
- Variaveis sensiveis de email, Google, Mercado Pago e WhatsApp existem e precisam de Secrets Manager.

#### Medio

- CORS atual e local.
- Falta de migrations formais.
- Caminhos Windows e referencias historicas podem quebrar em Linux.
- Rotas e services dependem de arquivos locais de seed e snapshots.

#### Baixo

- Nome historico `Brana SaaS` ainda aparece em strings internas.
- Alguns defaults legados usam email/remetente de compatibilidade.

### 15.2 Outros riscos observados

- Swagger exposto em ambiente de producao sem restricao pode facilitar enumeracao.
- Logs nao devem conter tokens, senhas ou PDFs sensiveis.
- Uploads precisam de validacao de tipo e tamanho.
- Banco publico nao deve ser a configuracao final.

## 16. Logs, monitoramento e backups

### 16.1 Logs atuais

- Backend imprime mensagens de startup e warnings em stdout/stderr.
- Nao foi encontrado sistema formal de logging centralizado.
- Nao ha configuracao de CloudWatch no repositorio.

### 16.2 Monitoramento

- Existe `/health`
- Nao ha alertas ou metricas formais no repo

### 16.3 Backup

- Nao ha automacao formal de backup no repositorio analisado.
- A migracao para AWS deve incluir backup do PostgreSQL e estrategia de restauracao.

### 16.4 Necessidades futuras

- CloudWatch Logs
- Alarmes de erro/latencia
- Alerta de custo/orcamento
- Rotina documentada de backup e restore

## 17. E-mail e servicos externos

Integracoes externas encontradas:

- SMTP
- Resend
- Google OAuth
- Google Calendar API
- Mercado Pago
- WhatsApp API via token/phone number id

Configuracoes AWS necessarias:

- Secrets Manager para tokens e senhas
- URL publica para webhooks
- dominos reais para OAuth redirect

## 18. Compatibilidade com Linux

Riscos importantes:

- Caminhos Windows hardcoded
- Letras de unidade como `D:\` e `Y:\`
- Uso de `os.startfile` no fluxo de PDF local
- Caminhos absolutos com separador Windows
- Dependencia de executaveis e programas de desktop no fluxo editorial
- Possivel diferenca de maiusculas/minusculas no filesystem Linux
- Possivel dependencia de fontes/bibliotecas do sistema para render PDF

Pontos positivos:

- O backend principal e Python/FastAPI.
- A maior parte das chamadas e portavel se os caminhos locais forem abstraidos.

## 19. Checklist minimo de homologaçao antes da publicacao

### Autenticacao

- Login
- Renovacao de sessao
- Logout
- Troca de aba com token sincronizado
- Expiracao e renovacao do token

### Fluxos operacionais

- Plano de contas
- Cenario anual
- Procedimentos
- Procedimentos genericos
- Materiais
- Medicamentos
- CID
- Tabelas auxiliares
- Uploads
- Imagens
- Relatorios
- Impressao
- Exclusoes
- Grupos nativos protegidos
- Tema claro e escuro
- Recarregamento de rotas React
- Backup e restauracao

### Integracao e ambiente

- CORS
- OAuth Google, se habilitado
- Emails transacionais
- Webhooks
- Multi-tenant por clinica

## 20. Plano de implantacao por fases

### Fase 0: seguranca da conta AWS

- MFA
- IAM minimo
- Secrets Manager
- orcamento e alertas

### Fase 1: preparacao do repositorio

- Separar a estrategia do backend e do frontend
- Definir dominios
- Definir variaveis de producao

### Fase 2: RDS PostgreSQL

- Criar RDS privado
- Restaurar backup
- Validar schema e login

### Fase 3: armazenamento persistente

- Migrar modelos/uploads/documentos para S3
- Revisar caminhos gravados no banco

### Fase 4: backend

- Subir FastAPI na AWS
- Ajustar host/porta
- Ajustar CORS

### Fase 5: frontend

- Build em `frontend-react/dist`
- Publicar em S3 + CloudFront
- Configurar `VITE_API_BASE_URL`

### Fase 6: dominio e HTTPS

- Route 53
- ACM
- DNS
- redirecionamentos

### Fase 7: homologacao

- Checklist minimo acima
- Testes de tenant e permissao

### Fase 8: migracao final

- Janela de corte
- Backup final
- Sincronizacao final

### Fase 9: monitoramento e backup

- CloudWatch
- alarmes
- backup recorrente

### Fase 10: encerramento do Render

- Somente depois da validação completa na AWS

## 21. Bloqueadores antes da AWS

- Falta de estrategia formal para storage persistente fora do disco local
- Falta de migrations formais
- Falta de dockerizacao formal
- Falta de configuracao de producao para dominio/HTTPS/CORS
- Falta de pinagem de Node para o frontend React
- Dependencia de arquivos locais de seed e snapshots em alguns fluxos
- Necessidade de separar o que e legado do que e novo

## 22. Riscos principais resumidos

1. Estado local baseado em filesystem efemero nao e seguro para producao.
2. Variaveis sensiveis precisam ir para Secrets Manager.
3. Frontend React ainda nao tem URL de API de producao definida no build.
4. Startup do backend faz bootstrap/hotfix, o que precisa ser reavaliado para AWS.
5. O frontend legado ainda existe e nao pode ser ignorado.

## 23. Proposta de atualizacao futura do roadmap

O arquivo `docs/11_roadmap_desenvolvimento.md` ja possui estrutura e historico adequados para receber novas fases. Nesta etapa nao foi alterado, porque o pedido desta fase era auditoria e documentacao de prontidao, sem mexer em roadmap sem validacao adicional do padrao existente.

Se a frente AWS for iniciada, o roadmap deve ganhar uma secao especifica de:

- infra AWS
- storage S3
- RDS
- dominio
- HTTPS
- CORS de producao
- backup/restore

## 24. Conclusao

O Brana Cloude esta funcional como sistema web em arquitetura local/legada, mas ainda nao esta pronto para AWS sem trabalho adicional. A principal barreira nao e o FastAPI em si, e sim a combinacao de:

- armazenamento local persistente
- bootstrap e hotfix no startup
- ausencia de migrations formais
- falta de dockerizacao formal
- ausencia de configuracao de producao para dominio e CORS
- dependencias de Windows e de caminhos locais em alguns fluxos

Em resumo:

- backend: promissor para AWS, mas precisa de ajuste de producao
- frontend React: pronto como base de build, mas precisa de URL de API de producao e estrategia SPA
- frontend legado: ainda participa da arquitetura real
- banco: compatível com RDS, mas exige migracao e controle
- uploads/storage: ponto mais critico para App Runner

## 25. Arquivos que futuramente precisarao ser alterados ou criados

Provaveis arquivos futuros de infra e producao:

- `backend/main.py`
- `backend/database.py`
- `backend/security/jwt_handler.py`
- `backend/routes/auth_routes.py`
- `backend/routes/editor_textos_routes.py`
- `backend/routes/relatorios_routes.py`
- `backend/services/modelos_service.py`
- `backend/services/editor_pdf_service.py`
- `backend/services/email_service.py`
- `backend/services/digital_signature_service.py`
- `frontend-react/src/services/api.js`
- `frontend-react/vite.config.js`
- `frontend-react/.env.production` ou equivalente
- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml` se necessario
- `render.yaml` nao parece necessario se AWS for a meta
- scripts de migration/restore
- documentacao AWS em `docs/`

Arquivos de documentacao recomendados:

- `docs/auditoria_prontidao_publicacao_aws.md`
- `docs/11_roadmap_desenvolvimento.md` com secao AWS futura
- documento de arquitetura AWS definitiva
- runbook de backup/restore
- runbook de corte e rollback

## 26. Atualizacao desta validacao

Esta rodada de validacao da imagem Docker trouxe duas descobertas materiais em relacao ao texto anterior:

- o diretório temporário usado pelo backend precisava ficar gravável para o usuário `brana`;
- o caminho `/frontend/` precisava responder com o índice do frontend legado, e não ficar dependente apenas do mount estático.

Além disso, a imagem foi realmente construída e executada em contêiner Linux, com `GET /health` respondendo HTTP 200 e o processo rodando como usuário não root.

## 27. Atualizacao final da comparacao de bases

A comparacao local entre `python:3.10-slim-trixie` e `python:3.10-slim-bookworm` fechou com `bookworm` como base selecionada para a imagem final.

Resumo objetivo:

- ambas as variantes mantiveram `linux/amd64`, usuario `brana`, `WORKDIR=/app/backend` e comando Uvicorn sem `--reload`;
- `bookworm` mostrou bibliotecas base mais conservadoras para `perl`, `libc6` e `libsqlite3-0`;
- a imagem final local ficou em `brana-backend:aws-foundation-scan1`;
- o smoke test final retornou `200` em `/health`, `/app` e `/frontend/`;
- o banco usado foi temporario e descartavel;
- nenhum banco real foi acessado;
- nenhuma migration foi executada;
- nenhum `Base.metadata.create_all` foi executado;
- a tag local do ECR foi aplicada apenas localmente, sem `push`.

### Metadados finais registrados

- imagem local: `brana-backend:aws-foundation-scan1`
- tag local do ECR: `810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend:aws-foundation-d759367e-scan1`
- sistema operacional: `linux`
- arquitetura: `amd64`
- usuario: `brana`
- `WORKDIR`: `/app/backend`
- build sem provenance e sem SBOM
- publicacao e scan pendentes para acao manual do proprietario
- nenhuma interacao com AWS foi feita por este ambiente
- nenhum commit foi criado
- nenhum push Git foi feito

## 28. Bloqueio central de schema-compatibilidade no startup

A etapa atual fechou uma pendencia operacional importante: o backend agora bloqueia automaticamente o DDL/DML de compatibilidade quando `BRANA_ALLOW_SCHEMA_COMPAT_APPLY` nao esta explicitamente habilitada.

### O que mudou

- a decisao foi centralizada em `backend/services/runtime_profile_service.py`;
- `backend/main.py` consulta essa politica antes de executar qualquer rotina aditiva de schema no startup;
- quando bloqueado, o startup registra o aviso e nao executa `ALTER TABLE`, `CREATE TABLE` ou outra escrita automatica de compatibilidade;
- o caminho manual continua sendo o script versionado `backend/scripts/aplicar_compatibilidade_schema.py`.

### Validacoes feitas

- build local com `--platform linux/amd64`;
- `--provenance=false` ativo;
- `--sbom=false` ativo;
- imagem local criada como `brana-backend:aws-foundation-scan1`;
- tag local do ECR criada apenas localmente, sem `push`;
- `/health`, `/app` e `/frontend/` responderam HTTP 200;
- processo executando como usuario nao root `brana`;
- banco temporario e descartavel usado apenas no smoke test;
- nenhum banco real foi acessado;
- nenhuma migration foi executada;
- nenhum `Base.metadata.create_all` foi executado no cenario bloqueado.

### Conclusao operacional

A imagem local ficou pronta para a etapa manual do proprietario. A publicacao no ECR e o scan continuam pendentes e devem ser feitos apenas pelo proprietario no ambiente dele.

### Inventario das rotinas automaticas

- `backend/main.py` -> `Base.metadata.create_all(bind=engine)` e `seed_tiss_tipo_atendimento(conn)`; momento: import do modulo; bloqueio: `RUN_SCHEMA_BOOTSTRAP`;
- `backend/main.py` -> `_garantir_colunas_criticas_usuarios()`;
- `backend/main.py` -> `_garantir_colunas_criticas_simbolos()`;
- `backend/main.py` -> `_garantir_colunas_criticas_anamnese()`;
- `backend/main.py` -> `_garantir_tabela_quadro_avisos()`; todas no startup HTTP e agora bloqueadas por `_garantir_schema_compatibilidade_startup()` + `schema_compat_apply_allowed(...)`;
- `backend/database.py` -> `ensure_user_auth_schema()`; chamada explicita, nao executada quando a protecao central bloqueia;
- `backend/services/runtime_bootstrap_service.py` -> `run_runtime_bootstrap_global()`; thread de bootstrap runtime bloqueada por `BRANA_ENABLE_RUNTIME_BOOTSTRAP`, `BRANA_SKIP_BOOTSTRAP`, `BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP`;
- `backend/scripts/aplicar_compatibilidade_schema.py` -> `aplicar_compatibilidade_schema()`; execucao manual, bloqueada em producao sem `BRANA_ALLOW_SCHEMA_COMPAT_APPLY`.
