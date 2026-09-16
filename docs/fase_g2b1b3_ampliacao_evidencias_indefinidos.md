# Fase G.2B.1B.3 - Ampliacao de evidencias positivas e separacao formal dos registros indefinidos

Data: 2026-08-03

## Resultado
- CONCLUIDA.

## Objetivo
Ampliar as evidencias positivas para os registros que ainda pareciam indefinidos no dry-run anterior, sem escrever em banco e sem promover backfill.

## Regras observadas
- nenhuma escrita em PostgreSQL;
- nenhuma atualizacao da coluna `origem`;
- nenhum backfill;
- nenhum `scope=grade`;
- nenhuma alteracao em React, POST, model, migration ou seeds.

## Evidencias positivas confirmadas
- `catalogo_oficial`: linhas oficiais replicadas por clinica com `legacy_id` valido e assinatura funcional identica ao snapshot oficial;
- `seed_interno`: linhas tecnicas de apoio com assinatura positiva de seed complementar;
- `fixture_teste`: registros `sim_simb1.bmp` com descricoes de teste manual registradas em homologacao;
- `asset_auxiliar`: registros `sim_30.bmp` com `imagem_custom` base64 e papel de asset auxiliar visual;
- `indefinido`: nenhuma linha permaneceu indefinida apos a ampliacao.

## Resultado revisado do dry-run
- total de linhas: `1113`
- `catalogo_oficial`: `636`
- `seed_interno`: `464`
- `fixture_teste`: `2`
- `asset_auxiliar`: `11`
- `copia_tecnica`: `0`
- `simbolo_usuario`: `0`
- `indefinido`: `0`
- conflitos: `0`

## Conclusao
- o conjunto agora esta separado por fonte positiva ou categoria tecnica comprovada;
- nao existe base segura para backfill total;
- `catalogo_oficial` segue autorizado apenas como classificacao positiva, nao como permissao de escrita em massa;
- `seed_interno`, `fixture_teste` e `asset_auxiliar` podem ser avaliados em fase posterior por subconjuntos, se houver decisao formal.
