# Organizacao local - Brana Cloude

Data: 2026-05-01.

Objetivo: classificar o workspace local antes de qualquer envio ao GitHub, sem apagar arquivos e sem mover codigo que possa quebrar caminhos atuais.

## Estrutura atual

- `saas/`: produto web atual. Contem backend FastAPI, frontend estatico, assets, storage, local bridge, backups e repositorio Git proprio.
- `app/`, `ui/`, `main.py`, `splash.py`, `requirements.txt`: aplicativo desktop legado em PySide2/Peewee/SQLite.
- `assets/`: assets do desktop legado e fonte de assets copiados para web.
- `Dados/`: bases, SQLs e dados de origem/migracao EasyDental. Muito grande e sensivel.
- `docs/`: documentacao historica de levantamento e migracao.
- `docs_v2/`: documentacao tecnica atual consolidada.
- `scripts/`: scripts de levantamento, migracao e apoio do legado.
- `tools/`: pequenos utilitarios JS para parse/inspecao.
- `output/`: saidas de diagnostico/migracao.
- `build/`, `dist/`, `instalador/`: artefatos de build/empacotamento do desktop.
- `BACKUP_2/`, `backup_estavel_saas_20260409_220613/`: backups/snapshots historicos.
- `venv_py310/`, `venv_qt5/`, `venv_saas/`: ambientes virtuais locais.
- `tmp_*`, `temp_*`, `stdout`, `relatorio_repo.*`: arquivos temporarios, dumps e relatorios gerados.

## Problemas encontrados

- A raiz mistura produto atual, desktop legado, backups, dados sensiveis, builds, ambientes virtuais e temporarios.
- O Git real do produto web esta em `saas/`, mas a organizacao desejada para GitHub deve ser pensada a partir da raiz.
- Existem muitos arquivos `.bak_*`, dumps HTML, PDFs temporarios, logs e snapshots.
- `Dados/` tem mais de 4 GB e provavelmente contem dados/base EasyDental que nao devem subir sem revisao.
- `saas/` contem backups, tmp, storage de clinica e arquivos gerados junto com codigo ativo.
- Ha documentacao antiga util, mas fragmentada e possivelmente desatualizada.
- Existem arquivos vazios/soltos na raiz (`0`, `10`, `30`, `2.0.1`, `bool`, `custo_material`) sem funcao clara.
- Existem bancos locais (`dados.db`, `dados_tel.db`, `daados.db`, `Dados/dados_alisson.db`) e backup `EasyBackup.EBF`.

## Classificacao

### MANTER

- `saas/backend/`
- `saas/frontend/index.html`
- `saas/frontend/app.js`
- `saas/frontend/easy_font_dialog.js`
- `saas/frontend/prestadores_override.js`
- `saas/assets/`
- `saas/local_bridge/`
- `saas/.env.example`
- `docs_v2/`
- `README.md`
- `AGENTS.md`
- `.env.example`
- `.gitignore`
- `app/`, `ui/`, `main.py`, `splash.py`, `assets/`, `requirements.txt` como legado consultavel
- `scripts/`, `tools/`, `compare_desktop_vs_saas_users.py`, `agendamento_bot.py`, `init_db.py`, `saas_app.py`

### MOVER

Proposta futura, nao aplicada nesta fase:

- `app/`, `ui/`, `main.py`, `splash.py`, `assets/` da raiz -> `legacy/desktop/`
- `docs/` -> `docs/archive/` ou `archive/docs_historicas/`
- `output/`, `relatorio_repo.*`, `tmp_*`, `temp_*` -> `archive/generated/`
- `BACKUP_2/`, `backup_estavel_saas_20260409_220613/` -> `archive/backups/`
- `build/`, `dist/`, `instalador/` -> `archive/builds/`

Nenhum desses movimentos foi executado porque podem quebrar caminhos e precisam aprovacao operacional.

### LEGADO

- `app/`
- `ui/`
- `main.py`
- `splash.py`
- `assets/` da raiz
- `Brana.spec`, `build_app.spec`, `GeradorChaves.spec`
- `build/`, `dist/`, `instalador/`
- `requirements.txt` da raiz
- `Dados/` como origem EasyDental/migracao
- `scripts/desktop/`
- `docs/` historico

### CANDIDATO_A_EXCLUSAO

Nao excluir sem aprovacao do CEO:

- `venv_py310/`, `venv_qt5/`, `venv_saas/`
- `build/`, `dist/`
- `__pycache__/` e `*.pyc`
- `tmp_*`, `temp_*`, `tmp_front_debug*/`
- `stdout`
- `relatorio_repo.txt`, `relatorio_repo.json`
- arquivos `.bak_*`
- `0`, `10`, `30`, `2.0.1`, `bool`, `custo_material`
- `~$prompt.docx`
- `tmp_assinado_profissional.pdf`, `tmp_signed_check.pdf`
- dumps HTML de debug

### NAO_MEXER

Nao mover, apagar ou versionar sem decisao explicita:

- `Dados/`
- `*.db`, `*.sqlite`, `*.mdf`, `*.ldf`
- `EasyBackup.EBF`
- `saas/backend/.env`
- `saas/storage/modelos/clinicas/`
- `saas/backend/tmp/editor_textos/`
- `saas/backend/backups/`
- `saas/backups/`
- arquivos PDF/DOC/XLS com possivel dado real
- qualquer arquivo com credencial ou dado real

## Arquivos essenciais

Produto web:

- `saas/backend/main.py`
- `saas/backend/database.py`
- `saas/backend/models/`
- `saas/backend/routes/`
- `saas/backend/security/`
- `saas/backend/services/`
- `saas/backend/requirements.txt`
- `saas/frontend/index.html`
- `saas/frontend/app.js`
- `saas/assets/`
- `saas/storage/modelos/base/`
- `saas/.env.example`

Manutencao:

- `README.md`
- `AGENTS.md`
- `.gitignore`
- `.env.example`
- `docs_v2/`

Legado/consulta:

- `app/`
- `ui/`
- `main.py`
- `assets/`
- `requirements.txt`
- `Dados/` somente como fonte controlada, nao para GitHub normal.

## Documentacao

Util e atual:

- `docs_v2/`
- `AGENTS.md`
- `README.md`

Util, mas historica:

- `docs/`
- `LEVANTAMENTO_AMBIENTE.md`
- `PASSO_A_PASSO_NOVA_MAQUINA_WINDOWS11.md`
- `scripts/*.txt`
- `output/*.json` e `output/*.txt` quando associados a migracao/auditoria.

Desatualizada ou conflitante:

- `saas/backend/README.md` usa nome antigo e estrutura parcialmente historica.
- documentos antigos que chamam o produto de SaaS devem ser tratados como historico, nao especificacao atual.

## Nova estrutura proposta

```text
Brana-Cloude/
  backend/
  frontend/
  assets/
  storage_templates/
  docs/
  docs_v2/
  scripts/
  config/
  tests/
  legacy/
    desktop/
    migration_sources/
  archive/
  README.md
  AGENTS.md
  .env.example
  .gitignore
```

Estrutura aplicada nesta fase:

- Criados/atualizados arquivos de raiz: `README.md`, `.env.example`, `.gitignore`, `AGENTS.md`.
- Mantida a estrutura fisica atual para evitar quebra de caminhos.
- Nenhum arquivo foi apagado.
- Nenhum codigo ativo foi movido.

## Riscos antes de reorganizar

- Mover `saas/backend` ou `saas/frontend` agora quebra imports, caminhos estaticos e scripts.
- Mover `assets/` da raiz pode quebrar desktop legado.
- Mover `Dados/` pode quebrar scripts de migracao e auditoria.
- Mover `docs/` pode quebrar referencias de documentos anteriores.
- Mover `saas/storage/` pode quebrar modelos de documentos e dados de clinica.
- Subir `Dados/`, bancos, backups ou `.env` ao GitHub pode vazar dados sensiveis.
- Apagar temporarios sem aprovacao pode remover evidencias uteis para migracao/debug.

## Recomendacao

Para o primeiro commit no GitHub, manter a estrutura fisica atual, mas usar `.gitignore` forte e documentacao clara. A reorganizacao real de pastas deve ser uma fase propria, com testes e mapa de caminhos antes/depois.
