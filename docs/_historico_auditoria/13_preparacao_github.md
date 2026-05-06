# Preparacao para GitHub - Brana Cloude

Data: 2026-05-01.

Objetivo: preparar o projeto local para um futuro envio ao GitHub, desconsiderando Render e Supabase.

## O que deve subir

Codigo atual essencial:

- `saas/backend/` sem `.env`, backups, tmp e dados sensiveis.
- `saas/frontend/index.html`
- `saas/frontend/app.js`
- `saas/frontend/easy_font_dialog.js`
- `saas/frontend/prestadores_override.js`
- `saas/assets/` se nao contiver dados sensiveis.
- `saas/local_bridge/` se for parte do fluxo de assinatura local.
- `saas/.env.example`
- `saas/backend/requirements.txt`

Documentacao e operacao:

- `README.md`
- `AGENTS.md`
- `.env.example`
- `.gitignore`
- `docs_v2/`
- `docs/` somente se o CEO aprovar subir historico de migracao.

Legado, se a decisao for preservar no mesmo repositorio:

- `app/`
- `ui/`
- `main.py`
- `splash.py`
- `requirements.txt`
- `assets/` da raiz
- arquivos `.spec`

## O que nao deve subir

- `venv_py310/`, `venv_qt5/`, `venv_saas/`, `.venv/`, `venv/`
- `.env`, `.env.*`, exceto `.env.example`
- `*.db`, `*.sqlite`, `*.sqlite3`, `*.mdf`, `*.ldf`
- `BACKUP_2/`, `backup_estavel_saas_*/`, `backups/`, `saas/backups/`, `saas/backend/backups/`
- `build/`, `dist/`, `instalador/`
- `tmp_*`, `temp_*`, `tmp_front_debug*/`, `stdout`, `*.log`
- `__pycache__/`, `*.pyc`
- `Dados/`, `output/`, CSVs com dados reais
- `*.docx`, `*.xls`, `*.xlsm`, `*.pdf`, salvo templates comprovadamente publicos
- `saas/storage/modelos/clinicas/`
- `saas/backend/tmp/`

## Arquivos sensiveis proibidos

Proibido subir:

- `saas/backend/.env`
- qualquer `.env.render` ou `.env.local`
- `DATABASE_URL` real
- `JWT_SECRET_KEY` real
- credenciais SMTP
- tokens Google
- tokens Mercado Pago
- backups de banco
- PDFs/documentos de pacientes ou profissionais
- bancos SQLite locais
- dumps PostgreSQL

## Checklist antes do commit

1. Confirmar que `README.md` e `AGENTS.md` existem na raiz.
2. Confirmar que `.env.example` nao tem segredo real.
3. Confirmar que `.gitignore` cobre ambientes, bancos, backups, tmp, logs e `.env`.
4. Rodar busca por segredos.
5. Revisar `git status --short`.
6. Verificar arquivos grandes.
7. Garantir que `Dados/`, bancos, backups e venvs nao estao staged.
8. Garantir que `docs_v2/12_organizacao_local.md` foi lido.
9. Rodar ao menos validacao basica do JWT/local se backend for incluido.
10. Fazer commit inicial pequeno o suficiente para revisar.

Comandos de apoio:

```powershell
Select-String -Path .\* -Pattern "DATABASE_URL=postgresql://|JWT_SECRET_KEY=|PASSWORD|SECRET|TOKEN" -Recurse
Get-ChildItem -Recurse -File | Sort-Object Length -Descending | Select-Object FullName,Length -First 50
```

## Comandos sugeridos

Inicializar Git na raiz, se a decisao for transformar a raiz no repositorio principal:

```powershell
cd "D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO"
git init
git status --short
git add README.md AGENTS.md .gitignore .env.example docs_v2
git add saas/backend saas/frontend saas/assets saas/local_bridge saas/.env.example
git status --short
git commit -m "Organiza projeto Brana Cloude para GitHub"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

Se o CEO decidir manter o Git apenas dentro de `saas/`:

```powershell
cd "D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO\saas"
git status --short
git add .env.example backend frontend assets local_bridge
git status --short
git commit -m "Prepara Brana Cloude local para GitHub"
```

## Arquivos que dependem de aprovacao antes de subir

- `Dados/`
- `docs/`
- `scripts/`
- `output/`
- `app/`, `ui/`, desktop legado
- `saas/storage/modelos/base/`
- `saas/storage/modelos/clinicas/`
- `saas/backend/data/`
- `saas/frontend/prototipos/`

## Estrategia recomendada

Primeiro commit recomendado:

- README/AGENTS/gitignore/env examples.
- `docs_v2/`.
- Codigo web essencial.
- Scripts de backend realmente usados.

Segundo commit, apos aprovacao:

- Desktop legado, se for manter no mesmo repositorio.
- Docs historicos filtrados.
- Scripts de migracao filtrados.

Nunca commitar dados reais, bancos, backups ou credenciais.
