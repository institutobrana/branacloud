# Migração local seletiva - Brana Cloude

## Resumo executivo

A migração local seletiva foi executada para `D:\BRANA ARQUIVOS\BRANA CLOUD` copiando apenas o núcleo web atual do Brana Cloude e a documentação técnica consolidada. O projeto antigo em `D:\BRANA ARQUIVOS\PROJETO_PRECIFICACAO` não foi movido, apagado ou reorganizado.

A nova pasta está preparada para teste local, desde que o PostgreSQL esteja disponível e as variáveis `DATABASE_URL` e `JWT_SECRET_KEY` sejam configuradas em ambiente local seguro.

## O que foi copiado

- Backend FastAPI a partir de `saas/backend/`, com exclusão de caches, backups, relatórios, temporários e arquivos de ambiente.
- Frontend estático a partir de `saas/frontend/`, com exclusão de protótipos, mocks e arquivos de backup.
- Assets necessários a partir de `saas/assets/`.
- Ponte local a partir de `saas/local_bridge/`, sem arquivos `.env`.
- Modelos base em `saas/storage/modelos/base/`.
- Documentação técnica `docs_v2/`, consolidada no destino como `docs/`.
- Arquivos de orientação e segurança: `README.md`, `AGENTS.md`, `.env.example`, `.gitignore`.
- `saas/.env.example` foi copiado como `config.web.env.example` para preservar o exemplo específico do núcleo web.
- `saas/README.md` foi copiado como `README_WEB.md`.

## O que ficou fora

- Nenhum arquivo `.env` foi copiado.
- Nenhum banco local `.db`, `.sqlite`, `.sqlite3`, `.mdf` ou `.ldf` foi copiado.
- Nenhum dump ou backup de banco foi copiado.
- Nenhuma virtualenv foi copiada.
- Nenhuma pasta `Dados/` foi copiada.
- A pasta `saas/storage/modelos/clinicas/` não foi copiada.
- Pastas `__pycache__`, `tmp`, `reports`, `backups` e equivalentes ficaram fora.
- Protótipos, mocks e backups do frontend ficaram fora.
- Diretórios de exportação/migração legado em `backend/scripts/_export_eds70`, `backend/scripts/_migracao_eds70` e SQLs gerados de correção ficaram fora da cópia final.
- Snapshots JSON operacionais em `backend/data/` ficaram fora; foi mantido apenas o template PDF usado pelo serviço de receituário.

## Ajustes feitos no destino

- A estrutura foi achatada para ficar clara no novo local:
  - `backend/`
  - `frontend/`
  - `assets/`
  - `local_bridge/`
  - `storage/modelos/base/`
  - `docs/`
- Referências documentais ao caminho antigo foram ajustadas nos arquivos principais do destino.
- A documentação `docs_v2/` foi mantida como documentação técnica, mas no novo destino fica sob `docs/`.
- Foi feita limpeza pós-cópia no destino para remover scripts de backup/restauração, diretórios de exportação legado e snapshots de dados.

## Riscos pendentes

- O sistema depende de PostgreSQL via `DATABASE_URL`; sem banco configurado, o backend pode iniciar parcialmente ou falhar em rotas que acessam dados.
- O JWT depende obrigatoriamente de `JWT_SECRET_KEY`; sem essa variável, a aplicação deve falhar por segurança.
- Algumas rotas e scripts ainda fazem referência histórica a arquivos fora do núcleo web, especialmente fontes legadas como `Dados/` e CSVs auxiliares de permissões. Esses arquivos não foram copiados porque não fazem parte da estrutura limpa para GitHub.
- O projeto ainda não possui migrations formais versionadas; a criação de migrations continua como próxima etapa técnica recomendada.
- O frontend principal ainda é monolítico e deve ser separado por módulos em fase posterior.

## Como rodar o projeto no novo local

No PowerShell:

```powershell
cd "D:\BRANA ARQUIVOS\BRANA CLOUD"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
$env:DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/BANCO"
$env:JWT_SECRET_KEY="troque-por-uma-chave-longa-e-segura"
python backend\main.py
```

Depois acesse no navegador:

```text
http://127.0.0.1:8000
```

Endpoints mínimos para validar:

- `GET /health`
- Login pela tela web
- `GET /me` com token válido
- Carregamento do frontend estático

## Checklist de validação pós-migração

- [x] `backend/main.py` existe.
- [x] `frontend/index.html` existe.
- [x] `frontend/app.js` existe.
- [x] `.env.example` existe.
- [x] `.gitignore` existe.
- [x] `docs/16_migracao_local.md` existe.
- [x] Não há `.env` no destino.
- [x] Não há bancos locais `.db`, `.sqlite`, `.sqlite3`, `.mdf` ou `.ldf` no destino.
- [x] Não há dumps ou backups de banco no destino.
- [x] Não há virtualenv copiada no destino.
- [x] Não há pasta `Dados/` no destino.
- [x] Não há `storage/modelos/clinicas/` no destino.
- [x] Não foram encontrados os segredos conhecidos da auditoria anterior.

## Recomendação final

Pode testar localmente a nova pasta. Ela está adequada como base limpa para desenvolvimento e preparação posterior para GitHub, desde que o teste use um PostgreSQL controlado e variáveis locais seguras. Antes de publicar no GitHub, rode novamente a checklist de segurança e confirme que nenhum arquivo local novo, como `.env` ou `.venv/`, foi criado para commit.
