# Plano de transporte seguro do dump

## Estratégia escolhida

`workstation -> S3 temporário criptografado -> task ECS one-shot dentro da VPC -> RDS`

## Justificativa

- a estação local não alcança o RDS por TCP;
- o dump não deve entrar no Git;
- o dump não deve entrar na imagem Docker;
- o transporte precisa ser temporário e auditável;
- o checksum deve ser validado antes do restore;
- o artefato deve ser removido após uso.

## Requisitos

- bucket/prefixo temporário;
- criptografia SSE-S3 ou SSE-KMS;
- acesso público bloqueado;
- IAM restrito à task;
- limpeza após validação;
- retenção curta.
