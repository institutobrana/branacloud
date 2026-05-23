# Brana Cloud

Brana Cloud is a web system for dental clinic management with a FastAPI backend and a static frontend.

## Current state
- Login, internal password, and access profiles are validated.
- Signup with Brana is validated.
- Brana uses the canonical seed with 336 procedures.
- Table example stays separate from Brana.
- PARTICULAR remains for old accounts only.
- Safe deletions for test clinics 8, 9, 10, and 15 are documented.
- The documentation audit was completed after the signup validation.

## Start here
1. `docs/00_master_guide.md`
2. `docs/indice_oficial_contratos_regras_vigentes.md`
3. `docs/11_roadmap_desenvolvimento.md`

## Official documents
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_regras_materiais_genericos_intervencoes.md`
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Validation and recent closure
- `docs/validacao_manual_final_signup_brana_pos_correcoes.md`
- `docs/auditoria_documentacao_geral_brana_cloud_pos_signup_brana.md`

## Quick links
- Setup: `docs/08_setup_execucao.md`
- Continuity: `docs/10_continuidade.md`
- Roadmap: `docs/11_roadmap_desenvolvimento.md`

## Notes
- Do not mix mojibake work with functional fixes.
- Do not change seeds without a contract.
- Do not use destructive git commands without explicit authorization.
- Keep commits separated by track.
- Historical material such as anamnese, SQLServer, and restoration stays in its own track.

## Basic layout
```text
backend/              FastAPI API, models, routes, services, and scripts
frontend/             static web UI served by the backend
assets/               images and UI assets
local_bridge/         local bridge for desktop integrations
storage/modelos/base/ base document models
docs/                 current official documentation
```

## Entry points
- Backend app: `backend/main.py`
- Database: `backend/database.py`
- Frontend: `frontend/index.html` and `frontend/app.js`
- Local environment: `backend/.env`

`backend/main.py` loads `backend/.env` automatically.

## Security basics
Never version:
- `backend/.env`
- `.env` or `.env.*`
- virtual environments
- databases, dumps, backups, or logs
- `Dados/`
- `storage/modelos/clinicas/`
- documents, PDFs, spreadsheets, or images with real data

Every operational route must authenticate the user, validate permissions, and filter data by `current_user.clinica_id`.
