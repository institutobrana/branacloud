# Encerramento da migracao integral banco local -> RDS

## Resultado final

- Corte real executado com sucesso em `2026-07-18`.
- Snapshot pre-corte criado com sucesso: `brana-hml-postgres-pre-cut-20260718-073104`.
- Dump final do banco local gerado com `pg_dump -Fc`.
- Dump transportado temporariamente para S3 criptografado e removido apos o uso.
- Restore executado em task ECS one-shot separada, sem alterar o servico permanente.
- Validacao read-only posterior confirmada:
  - `65` tabelas publicas;
  - `tiss_tipo_atendimento = 5`;
  - `clinicas = 4`;
  - `usuarios = 14`;
  - `pacientes = 1629`;
  - `brana_schema_versions = 1`.

## Smoke funcional

- `GET /health = 200`
- `GET /app = 200`
- `GET /frontend/ = 200`
- `POST /auth/renew = 401`
- `POST /login = 200`
- `GET /me = 200`

## Credencial funcional validada

- Usuario sanitizado: `gleissontel@gmail.com`
- Contexto retornado:
  - `usuario_id = 1`
  - `clinica_id = 1`
  - `unidade_id = null`
  - `prestador_id = 1`
  - `is_admin = true`
  - `ativo = true`

## Servico permanente

- `brana-hml-backend` permaneceu `ACTIVE`.
- `desiredCount = 1`.
- `runningCount = 1`.
- A task definition ativa do servico nao foi alterada nesta etapa.

## Cleanup

- O objeto S3 temporario foi removido.
- Os arquivos temporarios locais da sessao foram apagados.
- As tasks ECS one-shot encerraram com `exit code 0` nas execucoes finais.
- O marcador final da baseline foi restabelecido de forma idempotente no RDS, mantendo `brana_schema_versions = 1`.
- O diretorio local `storage/modelos/clinicas/` permanece com 260 arquivos e segue como pendencia de persistencia externa para a proxima frente.

## Observacao final

- O snapshot pre-corte pode ser mantido para rollback ate a aceitacao final do corte.
- O fechamento definitivo continua dependente da revisao humana do operador antes do commit final.
