# Matriz de origens - simbolos graficos

Data: 2026-08-03

## Finalidade
Concentrar, em uma matriz curta, como o backend futuro deve classificar cada origem possivel de simbolo grafico para suportar `scope=grade`.

## Matriz proposta
| Origem | Entra em `scope=grade` | Tenant | Fonte de verdade | Observacao |
|---|---:|---:|---|---|
| `catalogo_oficial` | sim, se compativel | global ou clinica conforme regra | `legacy_id` + snapshot oficial | simbolo de sistema |
| `simbolo_usuario` | sim | `clinica_id` | registro persistido da clinica | simbolo criado pelo usuario |
| `seed_interno` | somente se marcado | depende do contrato | marca tecnica persistida | apoio tecnico nao e sinônimo de grade |
| `fixture_teste` | nao | qualquer | marca de teste | nunca compoe grade |
| `copia_tecnica` | nao por padrao | qualquer | marca tecnica | pode existir para migracao |
| `asset_auxiliar` | nao por padrao | qualquer | marca tecnica ou arquivo | serve de apoio visual |
| `indefinido` | nao | qualquer | ausencia de classificacao | estado proibido para a grade |

## Regras de leitura
- a matriz nao implementa nada;
- a matriz nao substitui migration;
- a matriz nao substitui o backend;
- a matriz existe para orientar a fase G.2B.1 e seguintes;
- qualquer item sem classificacao explicita deve ser tratado como fora da grade.

## Observacao para a G.2B.1A
- a primeira etapa aditiva deve persistir somente o campo `origem` com estado inicial nullable;
- as flags derivadas podem ficar para a etapa seguinte;
- `catalogo_oficial`, `simbolo_usuario` e `seed_interno` sao as classes com maior chance de futura persistencia;
- `fixture_teste`, `copia_tecnica`, `asset_auxiliar` e `indefinido` podem permanecer como categorias de classificacao/serializacao sem obrigacao de serem gravadas no banco na G.2B.1A.

## Observacao para a G.2B.1B.1
- `catalogo_oficial` precisa ser entendido como identidade funcional, nao como contagem bruta de linhas fisicas;
- a diferenca entre 81 itens funcionais e 636 linhas oficiais fisicas foi reconciliada em `docs/fase_g2b1b1_reconciliacao_81_catalogo_636_registros.md`;
- o dry-run anterior nao autoriza backfill por si so.

## Observacao para a G.2B.1B.3
- a ampliacao de evidencias separou formalmente os casos `fixture_teste` e `asset_auxiliar`;
- o ultimo dry-run somente leitura fechou em `636` `catalogo_oficial`, `464` `seed_interno`, `2` `fixture_teste`, `11` `asset_auxiliar`, `0` `indefinido` e `0` conflitos;
- esse resultado continua sem autorizar backfill ou escrita em banco.

## Observacao para a G.2B.1C.0
- a classificacao consolidada esta em `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`;
- o plano reversivel de escrita esta em `docs/fase_g2b1c0_plano_reversivel_backfill_origem.md`;
- os valores desta matriz continuam sendo classificacao proposta, nao persistencia;
- qualquer escrita futura depende dos gates definidos na G.2B.1C.0.

## Observacao para a G.2B.1C.2.1
- o manifesto operacional real foi validado em leitura;
- `docs/fase_g2b1c21_encerramento_final_manifesto_operacional.md` registra o fechamento formal;
- o caminho ate aqui permanece read-only;
- nenhuma categoria desta matriz foi persistida por esta fase.

## Observacao para a G.2B.1C.3.0
- o novo passo e somente documental;
- `docs/fase_g2b1c30_plano_documental_pre_aplicacao_backup_rollback_ambiente_isolado.md` registra o desenho futuro;
- backup, rollback e ambiente isolado ainda nao foram implementados;
- nenhuma categoria desta matriz foi alterada.

## Observacao para a G.2B.1C.3.1.0
- o contrato tecnico da camada apply esta em `docs/fase_g2b1c310_contrato_tecnico_camada_apply_ambiente_isolado.md`;
- a matriz continua sem persistencia nesta fase;
- a autorizacao de escrita segue proibida;
- nenhuma categoria desta matriz foi consumida em banco real.
