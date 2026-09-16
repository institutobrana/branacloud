# Fase G.2B.1B.2 - Amostragem estratificada dos grupos fisicos

Data: 2026-08-03

## Resultado
- BLOQUEADA POR QUALIDADE.

## Objetivo
Executar amostragem estratificada somente leitura para validar se as linhas com `legacy_id` oficial e as linhas sem `legacy_id` podem ser classificadas com prova positiva suficiente para backfill parcial.

## Metodo
- leitura direta da tabela `public.simbolo_grafico_catalogo`;
- estratificacao por `clinica_id`, `legacy_id`, `imagem_custom`, `ativo`, `descricao` e repeticoes;
- comparacao com snapshot oficial e seed complementar;
- nenhuma escrita em banco;
- nenhuma alteracao de `origem`.

## Revalidacao do banco
- total de linhas: `1113`
- `origem IS NULL`: `1113`
- `origem IS NOT NULL`: `0`
- clinicas distintas: `8`
- `legacy_id` distintos: `81`
- linhas com `legacy_id`: `636`
- linhas sem `legacy_id`: `477`

## Amostragem do Grupo A
### Evidencias positivas
- as linhas com `legacy_id` oficial em cada clinica correspondem a replicacao do catalogo oficial;
- os 81 `legacy_id` distintos aparecem distribuÃ­dos entre 8 clinicas;
- nao foram encontrados duplicados da mesma `legacy_id` na mesma clinica na amostra verificada.

### Conclusao do Grupo A
- `catalogo_oficial` e valido como identificacao funcional de linha oficial por clinica;
- isso nao autoriza backfill em massa sem separar linhas fisicas de item funcional;
- existem excecoes de cobertura por clinica, portanto a escrita continua bloqueada.

## Amostragem do Grupo B
### Evidencias positivas
- os registros sem `legacy_id` incluem linhas tecnicas de apoio e tambem registros com sinais de teste/uso local;
- a presenca em `SIMBOLOS_GRAFICOS_PADRAO` nao basta para provar `seed_interno`;
- a descricao nao pode ser usada como prova final.

### Exemplos observados
- linhas sem `legacy_id` com descricoes tecnicas como `Int Resto`, `Int Escova`, `Int Manut`, `Int Remove`;
- linhas sem `legacy_id` com descricoes de teste como `TESTE SIMBOLO REACT 2D2 20260801-1420`;
- uma parte dos 477 permanece indefinida.

### Conclusao do Grupo B
- `seed_interno` nao pode ser aplicado aos 477 em massa;
- parte deles e seed tecnico comprovado, parte e indefinido, e parte pode ser historico/uso local;
- o fallback seguro precisa ser `indefinido`.

## Resultado do dry-run revisado
- `catalogo_oficial`: `620`
- `seed_interno`: `472`
- `indefinido`: `21`
- conflitos: `0`

## Leitura contratual
- a amostragem confirmou que a classificacao deve ser parcial, nao exaustiva;
- o classificador nao pode depender de exclusao para classificar tudo;
- a fase permanece read-only e nao libera backfill.

## Proxima decisao
- manter o registro historico da etapa como bloqueada por qualidade;
- a consolidacao final da trilha e `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`;
- nao tratar os numeros desta fase como estado atual da trilha.
