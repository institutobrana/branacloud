# Brana Cloud Web

This file is the quick entry point for the web UI and the frontend/backend flow.

## What it covers
- `frontend/index.html`
- `frontend/app.js`
- backend routes served by `backend/main.py`
- login, protected modules, and the expected 403 behavior before internal password grant

## Current behavior to keep in mind
- The web UI talks to the FastAPI backend.
- Some admin/protected modules may return 403 on the first request until the internal password flow is completed.
- After the protected grant, the same flow should return data normally.

## Official links
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/indice_oficial_contratos_regras_vigentes.md`
- `docs/11_roadmap_desenvolvimento.md`

## Care points
- Avoid large frontend changes without a small substep.
- Respect the safe modularization track.
- Do not mix mojibake cleanup with functional refactors.
- Keep historical documentation separate from current contracts.

## What this README does not cover
- Historical documentation
- Anamnese / SQLServer / restoration tracks
- The full contract set, which lives in `docs/`
