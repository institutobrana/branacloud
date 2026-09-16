# Comparação de schema local x RDS de homologação

Data da análise: 18 de julho de 2026

## Conclusão executiva

O banco local `brana_saas` e o RDS de homologação foram comparados em modo somente leitura.

Conclusões confirmadas:

- ambos expõem `65` tabelas públicas;
- a lista de tabelas públicas coincide;
- o banco local possui `62` sequences;
- o dry-run com `pg_dump -Fc` e `pg_restore` em PostgreSQL `18.3` restaurou com sucesso a estrutura e os dados locais;
- não foram observadas divergências impeditivas para uma estratégia baseada em `pg_dump` e `pg_restore`.

## Classificação prática

Para a migração integral, a estratégia recomendada é:

- `pg_dump -Fc` do banco local;
- restauração controlada em banco PostgreSQL vazio;
- validação por contagem e checksum;
- snapshot pré-importação antes da execução real no RDS;
- rollback por restauração do snapshot, se necessário.

## Estado documentado

- Postgres local: `18.3`
- Postgres RDS: `18.3`
- Tabelas públicas: `65`
- Sequences públicas: `62`
- Views: `0`
- Funções: `0`
- Triggers: `0`

## Artefatos gerados

- `docs/dry_run_migracao_local_aws_contagens.csv`
- `docs/dry_run_migracao_local_aws_checksums.csv`
- `docs/dry_run_migracao_local_aws_integridade.md`
- `docs/inventario_migracao_local_tabelas.csv`
- `docs/inventario_migracao_local_sequences.csv`
- `docs/inventario_migracao_local_relacionamentos.csv`
- `docs/inventario_migracao_local_contagens_por_clinica.csv`
