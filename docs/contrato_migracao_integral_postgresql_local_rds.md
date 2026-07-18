# Contrato de migracao integral PostgreSQL local -> RDS

## Estrategia escolhida

Estrategia A: `pg_dump` + `pg_restore`.

Motivos:

- o schema local e o schema de homologacao usam a mesma versao de PostgreSQL (`18.3`);
- a malha de 65 tabelas publicas coincide;
- o dry-run em PostgreSQL descartavel restaurou com sucesso o dump do banco local;
- os hashes e contagens do dry-run ficaram alinhados com a origem;
- a abordagem preserva IDs, FKs, uniques, checks e sequences.

## Ordem operacional

1. snapshot manual do RDS antes da importacao real;
2. bloqueio de escrita no banco local de origem durante a janela de corte;
3. `pg_dump -Fc` do banco local;
4. restauracao controlada no destino vazio;
5. `ANALYZE`;
6. validacao de contagens e checksums;
7. validacao funcional de login e `/me` no dry-run restaurado;
8. liberacao para trafego;
9. rollback via snapshot se necessario.

## Regras de preservacao

- manter hashes de senha;
- manter IDs e sequences;
- nao restaurar roles locais;
- nao restaurar tablespaces locais;
- nao publicar nada no ECR nesta etapa;
- nao modificar o servico ECS permanente durante a preparacao.

## Evidencia funcional ja confirmada no dry-run

- `POST /login = 200` para a clinica 1;
- `GET /me = 200` para a clinica 1;
- `POST /login = 200` para a clinica 15;
- `GET /me = 200` para a clinica 15;
- a senha local conhecida continuou valida no banco restaurado;
- o hash da senha foi preservado pelo `pg_dump`/`pg_restore`;
- o backend atual verificou corretamente o hash restaurado;
- o contexto retornado confere com a origem para os campos expostos pelo endpoint;
- o isolamento multiclincia foi aprovado com vazamentos zero.

## Rollback

Rollback previsto:

- restaurar o snapshot pre-importacao;
- confirmar contagens e integridade;
- reabrir a aplicacao somente apos a restauracao.
