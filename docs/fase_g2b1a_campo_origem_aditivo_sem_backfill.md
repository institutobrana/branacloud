# Fase G.2B.1A - Campo de origem aditivo sem backfill

Data: 2026-08-03

## Resultado
- APROVADA.

## Objetivo
Validar em runtime local a adicao estrutural do campo `origem` no modelo de simbolos graficos, confirmar a compatibilidade idempotente de startup e do script manual, e encerrar formalmente a G.2B.1A sem iniciar dry-run, backfill ou `scope=grade`.

## Arquivos alterados na implementacao
- `backend/models/simbolo_grafico.py`
- `backend/main.py`
- `backend/scripts/migrar_simbolos_graficos_origem.py`
- `backend/scripts/aplicar_compatibilidade_schema.py`
- `backend/tests/test_simbolo_grafico_origem_model.py`
- `backend/tests/test_simbolos_graficos_origem_migration.py`
- `docs/fase_g2b01_plano_migration_backfill_origem_simbolos.md`

## Campo e tipo
- campo Python: `origem`
- coluna fisica: `origem`
- tipo: `VARCHAR(40)`
- nullable: `True`
- default: nenhum
- `server_default`: inexistente
- indice: postergado

## Mecanismo de startup
- `backend/main.py` ganhou compatibilidade aditiva para `simbolo_grafico_catalogo.origem`
- o startup nao escreve valores na coluna
- o startup nao classifica registros
- o startup nao cria `scope=grade`

## Script manual
- script: `backend/scripts/migrar_simbolos_graficos_origem.py`
- comportamento: add column se ausente, no-op se ja existir
- idempotencia: confirmada
- nenhuma linha e atualizada
- nenhum indice e criado
- nenhuma seed e alterada

## Script geral
- `backend/scripts/aplicar_compatibilidade_schema.py` recebeu o mesmo contrato fisico aditivo
- nao houve criacao de indice para `origem`
- nao houve classificacao automatica

## Inspecao do banco local
- engine: PostgreSQL local
- database: `brana_saas`
- schema: `public`
- tabela: `simbolo_grafico_catalogo`
- coluna `origem`: existe
- tipo fisico: `VARCHAR(40)`
- nullable: `YES`
- column_default: `NULL`
- indice proprio: ausente
- trigger relacionada: ausente

## Contagens observadas
- total de registros: `1113`
- registros ativos: `1113`
- `clinica_id IS NULL`: `0`
- `clinica_id IS NOT NULL`: `1113`
- `origem IS NULL`: `1113`
- `origem IS NOT NULL`: `0`

## Idempotencia
- primeira execucao da migration manual: sem alteracao de linhas
- segunda execucao da migration manual: sem alteracao de linhas
- a coluna permaneceu compatível e sem duplicacao

## Testes backend
- comandos executados no `venv` local:
  - `python -m unittest backend.tests.test_simbolo_grafico_origem_model backend.tests.test_simbolos_graficos_origem_migration`
- resultado:
  - total: 4
  - aprovados: 4
  - falhas: 0

## Regressao dos scopes
- `scope=catalogo`: preservado
- `scope=biblioteca`: preservado
- `scope=grade`: nao existe
- resposta da API: sem flags novas
- frontend atual: preservado

## Frontend
- os testes pertinentes de simbolos graficos permaneceram aprovados na validacao desta linha de trabalho
- nenhuma alteracao foi feita no React nesta fase
- o modal `Novo` da G.1E nao foi reativado nem alterado

## Limitacoes
- nao houve backfill
- nao houve dry-run
- nao houve classificacao de registros historicos
- nao houve alteracao de POST, PUT ou PATCH
- nao houve alteracao de seeds
- nao houve criacao de `scope=grade`

## Resultado final
A G.2B.1A ficou validada em runtime local, com a coluna `origem` presente no banco autorizado, sem valores classificados, sem backfill e sem regressao funcional comprovada.
