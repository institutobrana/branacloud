# Consolidação - Recuperação EDS70 e seed obrigatório de Anamnese

## 1. Contexto

A modularização de Anamnese foi interrompida e revertida.
A etapa atual foi de correção de dados e seed obrigatório, sem modularização.

## 2. Problema diagnosticado

- o frontend não era a causa;
- o endpoint não era a causa;
- o PostgreSQL da clínica 1 estava incompleto;
- o EDS70 era fonte confiável dos dados ausentes.

## 3. Recuperação realizada

- 4 questionários inseridos;
- 95 perguntas inseridas;
- `Principal` preservado;
- respostas não importadas;
- validação no navegador: `GET /anamnese/questionarios` com status `200` e quantidade `5`.

## 4. Seed obrigatório implementado

- `Principal`;
- `Implante`;
- `Ficha complementar`;
- novas clínicas via `backend/services/signup_service.py`;
- backfill em clínicas existentes;
- idempotência confirmada.

## 5. Backups

- backup pré-importação EDS70 CSV-only;
- backup pré-backfill CSV-only;
- `pg_dump` indisponível nesta máquina.

## 6. Arquivos funcionais alterados

- `backend/services/signup_service.py`
- scripts criados em `backend/scripts/`

## 7. Arquivos de auditoria/documentação

Arquivos relevantes criados durante a auditoria e recuperação:
- `docs/anamnese_importacao_eds70_gleisson_resultado.md`
- `docs/anamnese_validacao_final_pos_importacao_eds70_gleisson.md`
- `docs/anamnese_seed_obrigatorio_plano.md`
- `docs/anamnese_seed_obrigatorio_implementacao_resultado.md`
- `docs/anamnese_seed_obrigatorio_plano_por_clinica.json`
- `docs/anamnese_seed_obrigatorio_dry_run_resultado.txt`
- `docs/anamnese_seed_auditoria_clinicas_pos_backfill.csv`

## 8. Testes e validações

- `node --check frontend/app.js`;
- `py_compile` dos scripts de importação e seed;
- validação no banco PostgreSQL;
- validação no navegador;
- dry-run pós-backfill retornando `0/0`, confirmando idempotência.

## 9. Pendências futuras

- retomar modularização de Anamnese do zero, em nova etapa;
- analisar `Principal` EDS70 com `35` perguntas separadamente;
- analisar resposta órfã separadamente;
- decidir sobre migração de respostas EDS70.

## 10. Onde testar novamente

- conta `gleissontel@gmail.com`;
- outra clínica existente;
- nova clínica/conta de teste.
