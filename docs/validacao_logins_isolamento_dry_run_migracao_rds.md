# Validacao de logins e isolamento no dry-run da migracao integral

## Status

Login real e `/me` aprovados para as clinicas 1 e 15 no banco restaurado. O isolamento multiclincia foi aprovado.

## O que ja foi comprovado

- o dump local foi restaurado com sucesso em PostgreSQL descartavel 18.3;
- as 65 tabelas publicas foram preservadas no dry-run;
- as contagens permaneceram iguais a origem;
- checksums criticos permaneceram iguais;
- o backend e o verificador de autenticacao permanecem compativeis com a arquitetura atual;
- o isolamento por clinica continua dependente de login real para validacao funcional completa.
- `POST /login = 200`;
- `GET /me = 200`;
- `POST /login = 200` para a clinica 15;
- `GET /me = 200` para a clinica 15;
- a senha local conhecida continuou valida no banco restaurado;
- o hash da senha foi preservado pelo `pg_dump`/`pg_restore`;
- o backend atual verificou corretamente o hash restaurado;
- o usuario retornado esta ativo e e administrador;
- o contexto retornado confere com a origem para a clinica 1;
- o usuario retornado para a clinica 15 esta ativo, nao e administrador e tem contexto igual a origem;
- nenhuma senha, hash ou token foi registrada.

## O que falta para fechar o gate

- isolamento multiclincia ja foi comprovado com vazamentos zero;
- filtros cruzados foram bloqueados;
- acesso cruzado por ID foi bloqueado.

## Investigacao de `unidade_id = 0`

- o contrato real do endpoint `/me` expoe `unidade_atendimento_id`, nao `unidade_id`;
- o resultado sanitizado do operador usou o campo `unidade_id`, que nao existe no retorno;
- por isso, o `0` registrado e compativel com leitura de propriedade ausente no script de validacao;
- o retorno do `/me` deve ser conferido pelo nome correto do campo (`unidade_atendimento_id`) antes de tratar como ausencia real de vinculo.

## Classificacao atual

LOGIN E `/me` APROVADOS PARA CLINICAS 1 E 15
ISOLAMENTO MULTICLINICA APROVADO
AUTORIZAVEL
