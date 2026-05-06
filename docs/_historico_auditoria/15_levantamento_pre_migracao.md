# Levantamento pre-migracao local - Brana Cloude

Data: 2026-05-01.

Destino planejado: `D:\BRANA ARQUIVOS\BRANA CLOUD`.

Este documento e apenas um levantamento. Nenhum arquivo foi movido, apagado ou copiado nesta fase.

## Resumo executivo para o CEO

O Brana Cloude web atual esta concentrado na pasta `saas/`. Para a migracao local, a pasta `saas/` e o nucleo que precisa ser copiado com cuidado.

Mesmo assim, nem tudo dentro de `saas/` deve ir junto. Existem dentro dela arquivos reais do sistema, mas tambem backups, temporarios, ambiente virtual, arquivos de clinica e arquivos sensiveis. Copiar tudo "do jeito que esta" levaria lixo tecnico, dados reais e riscos de seguranca para a nova pasta.

Recomendacao final: **pode migrar, mas somente com copia seletiva e checklist**. Nao recomendo copiar a pasta inteira do projeto atual para `BRANA CLOUD`.

O ponto mais importante: **nao copiar `.env`, bancos, backups, venvs, `Dados/`, storage de clinicas e temporarios**. A nova pasta deve receber codigo, documentacao atual, exemplos de configuracao e modelos base seguros.

## 1. Nucleo real do projeto

### Web atual

O projeto web atual esta dentro de:

```text
saas/
```

Arquivos/pastas essenciais do web:

- `saas/backend/`
- `saas/frontend/`
- `saas/assets/`
- `saas/local_bridge/`
- `saas/storage/modelos/base/`
- `saas/.env.example`
- `saas/README.md`

### Arquivos fora de `saas/` usados pelo web

O runtime principal (`saas/backend/main.py`) calcula:

- `BASE_DIR = saas/backend`
- `SAAS_DIR = saas`
- `PROJECT_DIR = pasta acima de saas`
- `FRONTEND_DIR = saas/frontend`
- `DESKTOP_ASSETS_DIR = saas/assets`
- `MODEL_STORAGE_DIR = saas/storage/modelos`

O app web em si usa `saas/frontend`, `saas/assets` e `saas/storage`. Portanto, para rodar o sistema web normal, ele nao depende do desktop da raiz.

Mas ha riscos/pontos de atencao:

- `saas/backend/routes/cadastros_routes.py` referencia `PROJECT_DIR / "Dados" / "Dist" / "TAB_GEN_ITEM.raw"`. Se essa funcionalidade for usada, a nova pasta precisara desse arquivo ou o codigo precisara ser ajustado.
- `security/permissions.py` procura CSVs na raiz acima de `saas`: `sis_modulo_sql.csv` e `sis_funcao_sql.csv`. Se esses CSVs nao forem copiados ou movidos para dentro de `saas`, o mapeamento EasyDental pode ficar incompleto.
- Muitos scripts de migracao leem `saas/backend/.env` e/ou arquivos da pasta `Dados/`. Eles nao sao necessarios para iniciar o web, mas sao necessarios para migracoes antigas.

### Separacao clara

Web atual:

- `saas/backend/`
- `saas/frontend/`
- `saas/assets/`
- `saas/local_bridge/`
- `saas/storage/modelos/base/`

Desktop legado:

- `app/`
- `ui/`
- `main.py`
- `splash.py`
- `assets/` da raiz
- `requirements.txt` da raiz
- arquivos `.spec`

Documentacao atual:

- `docs_v2/`
- `README.md`
- `AGENTS.md`

Documentacao antiga/legado:

- `docs/`
- `LEVANTAMENTO_AMBIENTE.md`
- `PASSO_A_PASSO_NOVA_MAQUINA_WINDOWS11.md`
- varios `.txt` em `scripts/`

Backup/dados:

- `BACKUP_2/`
- `backup_estavel_saas_20260409_220613/`
- `saas/backups/`
- `saas/backend/backups/`
- `EasyBackup.EBF`
- `Dados/`
- `*.db`, `*.mdf`, `*.ldf`, `*.dump`, `*.backup`

Temporario:

- `tmp_*`
- `temp_*`
- `tmp_front_debug*/`
- `stdout`
- `relatorio_repo.*`
- `__pycache__/`
- `*.pyc`

## 2. Como o sistema roda

Arquivo principal:

```text
saas/backend/main.py
```

Comando recomendado para iniciar o backend local:

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD\saas\backend"
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
$env:JWT_SECRET_KEY="valor_local_longo_e_aleatorio_com_32_ou_mais_caracteres"
..\venv_saas\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Porta padrao:

```text
8000
```

Como acessar:

- App: `http://127.0.0.1:8000/app`
- Documentacao API: `http://127.0.0.1:8000/docs`
- Healthcheck: `http://127.0.0.1:8000/health`

Frontend:

- Nao ha servidor separado de frontend.
- Nao ha build Vite/React para o app principal.
- O backend serve o frontend estatico.
- `GET /app` entrega `saas/frontend/index.html`.
- `/frontend/*` entrega arquivos de `saas/frontend`.
- `/desktop-assets/*` entrega arquivos de `saas/assets`.

## 3. Dependencias

Arquivo usado pelo web:

```text
saas/backend/requirements.txt
```

Bibliotecas principais:

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

Dependencias suspeitas ou usadas por scripts, nao pelo runtime principal:

- `pyodbc`: aparece em scripts de migracao/levantamento EasyDental. Nao esta no `requirements.txt` do backend web.
- `sqlite3`: biblioteca padrao Python, usada por scripts/legado.
- `psycopg2`: importado por scripts de backup/restore; coberto por `psycopg2-binary`.

Ambientes virtuais que **nao devem ser migrados**:

- `venv_py310/`
- `venv_qt5/`
- `venv_saas/` da raiz
- `saas/venv_saas/`

Na nova pasta, o correto e criar ambiente virtual novo.

## 4. Variaveis de ambiente

### Obrigatorias para rodar o web

- `DATABASE_URL`: URL do PostgreSQL.
- `JWT_SECRET_KEY`: segredo longo e aleatorio para assinar JWT.

Sem `DATABASE_URL`, `database.py` nao consegue criar o engine.

Sem `JWT_SECRET_KEY`, login/token falha de forma intencional.

### Variaveis com fallback ou opcionais

Autenticacao/codigos:

- `SIGNUP_CODE_EXP_MINUTES`, fallback `10`.
- `RESET_CODE_EXP_MINUTES`, fallback `10`.
- `PROTECTED_GRANT_EXPIRE_MINUTES`, fallback `20`.

Owner/superadmin:

- `OWNER_BYPASS_EMAILS`, fallback vazio.
- `OWNER_MASTER_EMAIL`, fallback vazio.

Google:

- `GOOGLE_CLIENT_ID`, fallback vazio.
- `GOOGLE_CLIENT_SECRET`, fallback vazio.
- `GOOGLE_REDIRECT_URI`, fallback `http://127.0.0.1:8000/auth/google/callback`.
- `GOOGLE_CALENDAR_REDIRECT_URI`, fallback `http://127.0.0.1:8000/auth/google/calendar/callback`.

Email:

- `EMAIL_PROVIDER`, fallback `smtp`.
- `RESEND_API_KEY`, fallback vazio.
- `EMAIL_FROM`, fallback vazio.
- `SMTP_HOST`, fallback vazio.
- `SMTP_PORT`, fallback `587`.
- `SMTP_USER`, fallback vazio.
- `SMTP_PASS`, fallback vazio.
- `SMTP_FROM`, fallback vazio.
- `SMTP_TLS`, fallback `true`.
- `EMAIL_ATTACHMENT_MAX_MB`, fallback `10`.

Licenca/pagamento:

- `LICENCA_SUPORTE_EMAIL`, fallback `institutobrana@gmail.com`.
- `MERCADOPAGO_ACCESS_TOKEN`, fallback vazio.
- `MERCADOPAGO_API_BASE`, fallback `https://api.mercadopago.com`.
- `MERCADOPAGO_WEBHOOK_URL`, fallback vazio.
- `MERCADOPAGO_BACK_URL`, fallback vazio.
- `MERCADOPAGO_USE_SANDBOX`, fallback `false`.
- `PAGAMENTO_MENSAL_URL`, fallback para link externo antigo.
- `PAGAMENTO_ANUAL_URL`, fallback para link externo antigo.
- `PLANO_MENSAL_VALOR`, fallback definido no codigo.
- `PLANO_ANUAL_VALOR`, fallback definido no codigo.

WhatsApp:

- `WHATSAPP_TOKEN`, fallback vazio.
- `WHATSAPP_PHONE_NUMBER_ID`, fallback vazio.

Assinatura PDF:

- `BRANA_PDF_SIGN_TSA_URL`, fallback vazio.
- `BRANA_PDF_SIGN_MD_ALG`, fallback `sha256`.
- `BRANA_PDF_SIGN_REASON`, fallback `Assinado digitalmente`.
- `BRANA_PDF_SIGN_LOCATION`, fallback `Brana SaaS` no codigo atual.
- `BRANA_PDF_SIGN_CONTACT`, fallback vazio.
- `BRANA_PDF_SIGN_TIMESTAMP_FORMAT`, fallback `%d/%m/%Y %H:%M:%S`.
- `BRANA_PDF_SIGN_PROFILE`, fallback `pades`.

Runtime/bootstrap:

- `BRANA_RUNTIME_PROFILE`, fallback `local`.
- `BRANA_ENABLE_SCHEMA_BOOTSTRAP`, fallback depende do profile.
- `BRANA_ENABLE_RUNTIME_BOOTSTRAP`, fallback depende do profile.
- `BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP`, fallback geralmente desativado.
- `BRANA_ALLOW_SCHEMA_COMPAT_APPLY`, fallback geralmente desativado.
- `BRANA_SKIP_BOOTSTRAP`, fallback vazio.
- `BRANA_RUNTIME_BOOTSTRAP_AUDIT_PATH`, fallback para caminho interno em backups.

Relatorios/scripts:

- `RELATORIO_SEM_LOGIN_DIAS`, fallback `90`.
- `LICENSE_SECRET`, fallback antigo `BRANA_PRECIFICACAO_2026` em script de geracao de chave. Nao e runtime principal, mas deve ser revisado.

### Devem entrar no `.env.example`

Ja existem no exemplo principal:

- `DATABASE_URL`
- `JWT_SECRET_KEY`
- variaveis de bootstrap
- variaveis de auth/codigos
- owner/superadmin
- Google basico
- SMTP
- licenca/Mercado Pago

Faltam ou merecem entrar no `.env.example` antes da migracao:

- `GOOGLE_CALENDAR_REDIRECT_URI`
- `EMAIL_PROVIDER`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `BRANA_PDF_SIGN_TSA_URL`
- `BRANA_PDF_SIGN_MD_ALG`
- `BRANA_PDF_SIGN_REASON`
- `BRANA_PDF_SIGN_LOCATION`
- `BRANA_PDF_SIGN_CONTACT`
- `BRANA_PDF_SIGN_TIMESTAMP_FORMAT`
- `BRANA_PDF_SIGN_PROFILE`
- `BRANA_RUNTIME_BOOTSTRAP_AUDIT_PATH`
- `RELATORIO_SEM_LOGIN_DIAS`

### Credenciais reais

Nao copiar credenciais reais. Nao copiar:

- `saas/backend/.env`
- qualquer `.env.render`
- qualquer arquivo com `DATABASE_URL` real
- qualquer chave JWT real
- tokens SMTP, Google, WhatsApp, Mercado Pago ou Resend

## 5. Banco de dados

Tipo de banco do web:

```text
PostgreSQL
```

Como conecta:

- `saas/backend/database.py` carrega `.env` com `load_dotenv()`.
- Le `DATABASE_URL` do ambiente.
- Cria `engine = create_engine(DATABASE_URL)`.

O sistema web depende de banco PostgreSQL acessivel por variavel de ambiente. Ele nao usa os `.db` da raiz para rodar o web atual.

Arquivos de banco/dump encontrados que devem ficar fora da migracao normal:

- `dados.db`
- `dados_tel.db`
- `daados.db`
- `Dados/dados_alisson.db`
- `Dados/eds70dat.mdf`
- `Dados/eds70log.ldf`
- `EasyBackup.EBF`
- `BACKUP_2/*.db`
- `instalador/app/dados.db`
- `saas/backend/backups/*.dump`
- `saas/backups/*.backup`
- bancos dentro de backups

Risco de dados reais:

- Alto. `Dados/`, backups, storage de clinicas, PDFs temporarios, `.db`, `.mdf`, `.ldf`, `.dump`, `.backup` e `.env` podem conter dados reais.

## 6. Frontend

Local:

```text
saas/frontend/
```

Tipo:

- Frontend estatico.
- Servido pelo FastAPI.
- Nao precisa de `npm install` para o app principal.

Arquivos necessarios carregados por `index.html`:

- `saas/frontend/index.html`
- `saas/frontend/app.js`
- `saas/frontend/easy_font_dialog.js`
- `saas/frontend/prestadores_override.js`
- `saas/frontend/prestadores_agenda_hotfix.js`
- `saas/frontend/prestadores_agenda_apresentacao_patch.js`
- `saas/frontend/prestadores_agenda_refino.js`
- `saas/frontend/prestadores_agenda_fonte_color_patch.js`
- `saas/frontend/prestadores_agenda_utf_fix.js`

Assets necessarios:

- `saas/assets/`, servido como `/desktop-assets`.

Arquivos grandes/monoliticos importantes:

- `saas/frontend/app.js`: aproximadamente 1,7 MB. Essencial.
- `saas/frontend/prestadores_override.js`: aproximadamente 271 KB. Essencial para telas de prestadores/agenda.

Nao copiar para runtime limpo:

- `app.js.bak_*`
- `index.html.bak_*`
- `prestadores_override.js.bak_*`
- mocks HTML, salvo se quiser manter em `archive/`
- `frontend/prototipos/` apenas se o CEO quiser manter prototipo Next.js do editor.

## 7. Caminhos e imports com risco

Pontos seguros:

- `main.py` usa caminhos calculados a partir do arquivo atual (`Path(__file__).resolve()`), entao tende a funcionar se a estrutura interna de `saas/` for preservada.
- `frontend`, `assets` e `storage` sao relativos a `saas/`.

Pontos com risco de quebra:

- `PROJECT_DIR = SAAS_DIR.parent` assume que ha uma pasta acima de `saas`.
- `cadastros_routes.py` referencia `PROJECT_DIR / "Dados" / "Dist" / "TAB_GEN_ITEM.raw"`.
- `security/permissions.py` referencia CSVs na raiz acima de `saas`: `sis_modulo_sql.csv` e `sis_funcao_sql.csv`.
- Alguns scripts de migracao leem `saas/backend/.env` diretamente.
- Scripts de migracao antigos podem depender de `Dados/`, SQL Server/EasyDental e arquivos CSV da raiz.
- `saas/README.md` e `README.md` ainda mostram comandos com caminho antigo em exemplos; apos migrar, os comandos devem ser atualizados para `D:\BRANA ARQUIVOS\BRANA CLOUD`.
- Relatorios antigos em `saas/backend/reports/` contem caminhos absolutos antigos. Eles nao devem ser copiados para runtime limpo.

Risco de `../` e `../../`:

- O runtime principal evita muitos `../` no backend usando `Path`.
- O prototipo Next.js e scripts auxiliares podem usar caminhos relativos. Como nao sao runtime principal, nao bloqueiam a migracao.

## 8. Documentacao

Deve ir para a nova pasta:

- `README.md`
- `AGENTS.md`
- `.env.example`
- `.gitignore`
- `docs_v2/`
- `saas/README.md`
- `saas/.env.example`

Pode ir, mas como historico/arquivo:

- `docs/`
- `LEVANTAMENTO_AMBIENTE.md`
- `PASSO_A_PASSO_NOVA_MAQUINA_WINDOWS11.md`
- `scripts/*.txt`

Nao precisa ir para a primeira migracao limpa:

- `relatorio_repo.txt`
- `relatorio_repo.json`
- `output/`
- relatorios antigos em `saas/backend/reports/`
- docs dentro de backups

Documentos que precisam ser atualizados apos migrar:

- `README.md`: atualizar caminho base para `D:\BRANA ARQUIVOS\BRANA CLOUD`.
- `saas/README.md`: atualizar caminho base.
- `AGENTS.md`: atualizar caminho base.
- `docs_v2/07_deploy.md`: hoje fala de deploy; para foco local, pode ganhar uma secao "execucao local apos migracao".
- Este documento, se a estrutura final copiada for diferente da recomendada.

## 9. Teste minimo pos-migracao

Depois de copiar para `D:\BRANA ARQUIVOS\BRANA CLOUD`, fazer:

1. Criar novo ambiente virtual:

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD\saas"
python -m venv venv_saas
.\venv_saas\Scripts\pip.exe install -r backend\requirements.txt
```

2. Configurar variaveis locais:

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD\saas\backend"
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
$env:JWT_SECRET_KEY="valor_local_longo_e_aleatorio_com_32_ou_mais_caracteres"
```

3. Subir API:

```powershell
..\venv_saas\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

4. Testar health:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

5. Abrir navegador:

- `http://127.0.0.1:8000/app`
- confirmar se a tela de login aparece com logo/assets.

6. Testar login:

- Fazer login com usuario valido do banco configurado.
- Confirmar que nao aparece erro 500.

7. Testar `/me`:

Com token retornado no login:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/me -Headers @{ Authorization = "Bearer SEU_TOKEN" }
```

8. Testar frontend:

- Abrir `/app`.
- Confirmar que `app.js` carregou.
- Confirmar que nao ha erro 404 em `/frontend/*.js`.
- Confirmar que imagens `/desktop-assets/*.png` carregam.

Migracao deu certo se:

- Backend sobe sem erro.
- `/health` retorna `status: ok`.
- `/app` abre a tela.
- Login funciona.
- `/me` retorna usuario logado.
- Nao ha erro de arquivo ausente em frontend/assets.

## 10. O que copiar

Copiar para a nova pasta:

- `README.md`
- `AGENTS.md`
- `.env.example`
- `.gitignore`
- `docs_v2/`
- `saas/.env.example`
- `saas/README.md`
- `saas/backend/`, exceto itens proibidos abaixo
- `saas/frontend/`, exceto backups `.bak_*` e mocks se quiser uma copia limpa
- `saas/assets/`
- `saas/local_bridge/`
- `saas/storage/modelos/base/`

Copiar com decisao explicita:

- `docs/` historico
- `scripts/`
- `saas/backend/scripts/` completos ou apenas scripts versionaveis
- `saas/backend/data/`
- `saas/frontend/prototipos/`
- desktop legado (`app/`, `ui/`, `main.py`, `assets/` da raiz)

## 11. O que nao copiar

Nao copiar:

- `saas/backend/.env`
- `saas/venv_saas/`
- `venv_py310/`, `venv_qt5/`, `venv_saas/`
- `Dados/`
- `BACKUP_2/`
- `backup_estavel_saas_20260409_220613/`
- `build/`, `dist/`, `instalador/`
- `output/`
- `tmp_*`, `temp_*`, `tmp_front_debug*/`
- `__pycache__/`, `*.pyc`
- `*.db`, `*.sqlite`, `*.mdf`, `*.ldf`
- `*.dump`, `*.backup`, `EasyBackup.EBF`
- `saas/backups/`
- `saas/backend/backups/`
- `saas/backend/tmp/`
- `saas/backend/reports/`
- `saas/storage/modelos/clinicas/`
- `saas/frontend/*.bak_*`
- `saas/frontend/*backup_check.js`
- `saas/frontend/*from_fullbackup_check.js`

## 12. Riscos encontrados

- `security/permissions.py` depende de CSVs que hoje estao fora de `saas`.
- `cadastros_routes.py` pode depender de `Dados/Dist/TAB_GEN_ITEM.raw`.
- `.env.example` ainda nao lista todas as variaveis opcionais encontradas no codigo.
- Existem muitos arquivos sensiveis e temporarios misturados ao projeto.
- Storage de clinicas pode conter dados reais.
- Backups e bancos locais podem conter dados reais.
- O frontend depende de varios scripts auxiliares alem de `app.js`.
- O nome interno "Brana SaaS" ainda aparece em alguns pontos do codigo, mas isso nao impede a migracao.

## 13. Checklist seguro para executar a migracao depois

Antes de copiar:

- Confirmar que a pasta destino `D:\BRANA ARQUIVOS\BRANA CLOUD` esta vazia ou com backup.
- Decidir se o desktop legado sera migrado agora ou depois.
- Decidir se `docs/` historico sera copiado.
- Atualizar `.env.example` com variaveis opcionais faltantes.
- Separar CSVs `sis_modulo_sql.csv` e `sis_funcao_sql.csv` se permissoes Easy forem necessarias.
- Verificar se `Dados/Dist/TAB_GEN_ITEM.raw` e realmente usado no dia a dia.

Durante a copia:

- Copiar somente itens da lista "O que copiar".
- Nao copiar `.env`.
- Nao copiar venvs.
- Nao copiar bancos/backups.
- Nao copiar storage de clinicas.

Depois da copia:

- Criar venv novo.
- Instalar `saas/backend/requirements.txt`.
- Criar `.env` local novo a partir de `.env.example`.
- Configurar `DATABASE_URL` e `JWT_SECRET_KEY`.
- Rodar backend.
- Testar `/health`, `/app`, login e `/me`.
- Atualizar READMEs com novo caminho.

## Recomendacao final

**Pode migrar, mas nao copiando tudo.**

A migracao e segura se for seletiva: copiar o nucleo web, documentacao atual e modelos base, deixando fora dados reais, backups, bancos, temporarios e ambientes virtuais.

**Nao migrar ainda** se a intencao for copiar a pasta inteira atual para `D:\BRANA ARQUIVOS\BRANA CLOUD`, porque isso levaria junto dados sensiveis, lixo tecnico, backups e arquivos que podem confundir ou expor informacoes.

Proxima fase recomendada: criar um script ou checklist de copia seletiva, revisar `.env.example`, e so entao executar a migracao.
