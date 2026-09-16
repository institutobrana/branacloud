# Fase G.2B.1B.1 - Reconciliacao e qualidade do dry-run

Data: 2026-08-03

## Resultado
- BLOQUEADA POR QUALIDADE.

## Resumo executivo
- O dry-run anterior nao pode ser promovido para backfill.
- A diferenca `81 x 636` nao e um erro de banco: e uma diferenca entre item funcional visivel e linha fisica persistida.
- Os `636` registros classificados como `catalogo_oficial` correspondem a `81` `legacy_id` distintos replicados em varias clinicas.
- Os `477` registros classificados como `seed_interno` sao as linhas sem `legacy_id`, presentes como apoio tecnico persistido.
- A classificacao atual e coerente para leitura, mas ainda nao e prova suficiente para escrita.

## Estado verificado
- total de linhas na tabela: `1113`
- `origem IS NULL`: `1113`
- `origem IS NOT NULL`: `0`
- clinicas distintas: `8`
- `legacy_id` distintos: `81`
- `legacy_id` nao nulo: `636`
- `legacy_id` nulo: `477`

## ReconciliaÃ§Ã£o 81 x 636
| Identidade funcional | Registros fisicos | Scope catalogo | Dry-run | Motivo |
|---|---:|---:|---|---|
| `legacy_id` oficial distinto | `81` | `81` | `636` linhas oficiais | mesma identidade funcional aparece em multiplas clinicas |
| `legacy_id` oficial total | `636` | `81` | `636` | cada item funcional foi replicado fisicamente por clinica |
| apoio tecnico sem `legacy_id` | `477` | `0` | `477` | linhas persistidas como complemento tecnico do conjunto |

## Distribuicao por clinica
| Clinica | Total | Oficiais | Seed tecnico | Legacy distintos |
|---|---:|---:|---:|---:|
| 1 | `143` | `81` | `62` | `81` |
| 4 | `142` | `81` | `61` | `81` |
| 13 | `138` | `79` | `59` | `79` |
| 15 | `138` | `79` | `59` | `79` |
| 16 | `138` | `79` | `59` | `79` |
| 17 | `138` | `79` | `59` | `79` |
| 18 | `138` | `79` | `59` | `79` |
| 19 | `138` | `79` | `59` | `79` |

## Fato relevante
- Dois `legacy_id` aparecem apenas em 2 clinicas:
  - `58` (`sim_outras.bmp`)
  - `81` (`int_raspagem.bmp`)
- Os demais `legacy_id` aparecem em 8 clinicas.

## Leitura contratual
- O `scope=catalogo` do endpoint permanece o conjunto funcional visivel.
- A tabela fisica contem clones por clinica e registros complementares.
- A classificacao do dry-run nao deve ser usada como autorizacao de backfill.
- O fallback seguro permanece: sem prova forte, nao escrever.

## Conclusao
- O resultado preliminar da G.2B.1B permanece historico e nao autoriza backfill.
- A referencia final consolidada desta trilha e `docs/fase_g2b1b4_consolidacao_final_dry_run_origens.md`.
