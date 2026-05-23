# Backend

This folder contains the FastAPI backend for Brana Cloud.

## Sensitive areas
- authentication and JWT
- internal password / protected modules
- signup
- seeds for new accounts
- canonical Brana seed
- safe clinic deletion
- multi-tenant filtering by `clinica_id`

## Current rules
- Brana uses the versioned canonical seed.
- Signup does not depend at runtime on clinic 1 / table 18.
- Brana starts with code, name, and required technical fields only.
- Brana does not receive materials, phases, compositions, or `procedimento_generico_id` at birth.
- Old accounts may keep PARTICULAR.

## Safe scripts
- Deletion runners must follow the safe deletion contract.
- Never run `--execute` without backup, dry-run, and explicit authorization.

## Official references
- `docs/contrato_seeds_novas_contas_minimos_nome_codigo.md`
- `docs/contrato_funcional_usuarios_novas_contas.md`
- `docs/contrato_exclusao_segura_contas_clinicas.md`
- `docs/regras_blindagem_correcoes_textuais_mojibake.md`

## Basic checks already used in this repo
- `python -m py_compile ...`
- `python -m compileall backend`

## Notes
- This README does not duplicate the contracts.
- Use the docs for the detailed rules.
- Keep backend changes aligned with the current documentation state.
