# Master Guide - Brana Cloude

## Leia primeiro

Brana Cloude e o nome oficial. "SaaS" e apenas apelido interno e tambem aparece em caminhos historicos como `saas/`.

Fonte da verdade: codigo atual.

Ordem recomendada:

1. `docs_v2/01_visao_geral.md`
2. `docs_v2/02_arquitetura.md`
3. `docs_v2/03_mapa_codigo.md`
4. `docs_v2/06_seguranca.md`
5. `docs_v2/07_deploy.md`
6. `docs_v2/08_problemas.md`

## Como se orientar no projeto

O produto web esta em `saas/`. Trabalhe dentro dessa pasta para Git:

```powershell
cd "D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO\saas"
git status --short
```

O workspace raiz contem tambem desktop legado, dados, scripts, backups e docs historicos. Nao confunda arquivos da raiz com runtime principal web.

## Como rodar

```powershell
cd "D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO\saas"
.\venv_saas\Scripts\pip.exe install -r backend\requirements.txt
cd backend
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
..\venv_saas\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Abrir `http://127.0.0.1:8000/app`.

## Como modificar backend

1. Identifique rota em `saas/backend/routes/`.
2. Verifique modelo em `saas/backend/models/`.
3. Reuse servico em `saas/backend/services/` quando existir.
4. Garanta autenticacao e permissao com `Depends`.
5. Filtre dados por `current_user.clinica_id`.
6. Se mudar schema, crie script/migration explicito; nao dependa de hotfix invisivel.
7. Atualize `docs_v2` se a regra mudar.

## Como modificar frontend

Frontend ativo:

- `saas/frontend/index.html`
- `saas/frontend/app.js`

Cuidados:

- `app.js` e grande; edite com escopo pequeno.
- Preserve chamadas existentes de `requestJson`.
- Nao use frontend como barreira de seguranca.
- Verifique telas em desktop e resolucao menor quando alterar layout.
- Evite mexer em `.bak_*` e patches historicos sem motivo.

## Como criar nova funcionalidade

Checklist:

- Qual modulo de permissao protege a funcionalidade?
- Quais tabelas entram?
- Existe `clinica_id` em todas as entidades?
- Ha dados EasyDental legados envolvidos?
- Precisa de script de migracao?
- Precisa de storage local?
- Precisa de variavel de ambiente?
- Como testar manualmente?
- Que documento em `docs_v2` precisa mudar?

## Como lidar com banco

Nao execute scripts destrutivos sem backup.

Antes de schema/dados:

```powershell
cd "D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO\saas\backend"
python scripts\backup_saas_db.py
```

Depois, execute apenas o script necessario. Em producao, registrar data, operador, objetivo, dry-run/aplicado e impacto.

## Como lidar com documentacao antiga

`docs/` e historico. Use para entender decisoes e evidencias da migracao EasyDental.

`docs_v2/` e documentacao operacional atual. Se houver conflito, valide no codigo e atualize `docs_v2`.

## Nao fazer

- Nao chamar o produto oficialmente de "SaaS".
- Nao commitar `.env`, `.env.render`, dumps ou credenciais.
- Nao adicionar rota sem permissao e filtro de tenant.
- Nao rodar scripts de migracao em producao sem backup.
- Nao confiar que storage local sera persistente no deploy.
- Nao editar backups como se fossem codigo ativo.

## Pontos de atencao imediatos

- Externalizar `SECRET_KEY` JWT.
- Rotacionar credencial exposta em `.env.render`.
- Formalizar migrations.
- Criar testes minimos.
- Modularizar frontend.
