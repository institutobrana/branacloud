# Fase G.2B.1B - Dry-run de classificacao de origem dos simbolos graficos

Data: 2026-08-03

## Resultado
- CONCLUIDA COMO RESULTADO PRELIMINAR, NAO AUTORIZADO PARA BACKFILL.
- a referencia canonical desta trilha foi consolidada em `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`.

## Objetivo
Executar uma classificacao preliminar 100% somente leitura dos 1113 registros historicos de simbolos graficos, sem escrever em banco, sem backfill e sem alterar o campo `origem`.

## Regras observadas
- nenhuma escrita em PostgreSQL;
- nenhuma atualizacao da coluna `origem`;
- nenhum POST, PUT, PATCH ou seed foi alterado;
- nenhum `scope=grade` foi criado;
- o fluxo permaneceu fora do React.

## Fontes de prova usadas
- snapshot oficial: `backend/scripts/easy_simbolos_catalogo_atual_snapshot.json`
- seed complementar: `backend/seeds/simbolos_graficos.py`
- classificador puro: `backend/services/simbolos_graficos_origem_classifier.py`
- dry-run executado: `backend/scripts/dry_run_classificar_origem_simbolos_graficos.py`

## Regra de classificacao
- `catalogo_oficial`: registro com codigo e referencia de legado reconhecidos no snapshot oficial
- `seed_interno`: registro com codigo presente no seed complementar e sem `legacy_id`
- `fixture_teste`: registros de teste manual identificados posteriormente na consolidacao final
- `asset_auxiliar`: registros auxiliares visualmente comprovados posteriormente na consolidacao final
- `indefinido`: ausencia de prova forte suficiente

## Resultado consolidado
- total de registros lidos: `1113`
- `catalogo_oficial`: `636`
- `seed_interno`: `464`
- `fixture_teste`: `2`
- `asset_auxiliar`: `11`
- `indefinido`: `0`
- conflitos: `0`

## Observacao de qualidade
- a contagem de `catalogo_oficial` permaneceu coerente com as linhas fisicas oficiais;
- os registros de teste/asset foram separados formalmente em categorias positivas;
- a conclusao continua read-only, mas nao e suficiente para liberar escrita;
- a reconciliacao funcional foi detalhada em `docs/fase_g2b1b1_reconciliacao_81_catalogo_636_registros.md`;
- a amostragem estratificada foi detalhada em `docs/fase_g2b1b2_amostragem_estratificada_grupos_fisicos.md`;
- o fechamento canonico e a consolidacao final em `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`.

## Relatorios gerados
- JSON: `docs/audits/g2b1b_dry_run_origem_simbolos_20260803_163258.json`
- CSV: `docs/audits/g2b1b_dry_run_origem_simbolos_20260803_163258.csv`

## Testes executados
- `python -m unittest backend.tests.test_simbolos_graficos_origem_dry_run backend.tests.test_simbolos_graficos_origem_migration backend.tests.test_simbolo_grafico_origem_model`
- resultado: `6/6` aprovados

## Confirmacoes
- o dry-run leu dados e gerou relatorio;
- nenhum valor foi persistido na coluna `origem`;
- a rotina nao introduziu escrita acidental em banco;
- o resultado foi totalmente deterministico com base nas fontes locais.

## Proximo passo
- a fase seguinte permitida e apenas documental, via planejamento reversivel de `G.2B.1C.0`;
- nao executar backfill nem alterar banco sem novo plano aprovado.
