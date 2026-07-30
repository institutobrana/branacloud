# Folha executiva de decisao

## Objetivo

Formalizar a decisao executiva apos a tentativa controlada de migrar o service `default / brana-hml-backend` de `CANARY` para `ROLLING`.

## Estado resumido

- Service: `default / brana-hml-backend`
- Task ativa conhecida: `default-brana-hml-backend:16`
- Strategy atual na AWS: `CANARY`
- `canaryPercent`: `5`
- `bakeTimeInMinutes`: `3`
- `desiredCount`: `1`
- `minimumHealthyPercent`: `100`
- `maximumPercent`: `200`
- Portao 3: bloqueado
- Anamnese: ainda nao publicada

## Resultado da tentativa

A tentativa de migracao foi executada com autorizacao expressa, mas o ECS recusou a mudanca com a mensagem:

`Updating to ROLLING deployment strategy is not supported for ExpressGatewayServices.`

Conclusao: a migracao nao foi aplicada e o service permaneceu em `CANARY`.

## Leitura executiva

O bloqueio nao decorre de falha de rede, nem de inconsistencia transitoria do runner. Ele decorre de limitacao funcional da plataforma para este tipo de service.

A reconstrucao em outra arquitetura pode continuar sendo avaliada em etapa separada, mas nao integra esta autorizacao e nao deve ser confundida com uma mudanca operacional imediata.

## Decisao

- [x] MANTER O SERVICO ATUAL EM CANARY.
- [ ] RECONSTRUIR A ARQUITETURA EM OUTRA ETAPA.

## Consequencias

- Nenhuma mudanca foi aplicada na AWS
- A topologia atual continua valida
- Portao 3 continua bloqueado
- A Anamnese continua nao publicada
- Nao existe autorizacao para repetir a tentativa sem nova decisao formal

## Referencias

- [Plano tecnico](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/deploy/release_canary_to_rolling_execution_plan.md)
- [Resultado](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/deploy/release_canary_to_rolling_execution_result.md)
- [Bloqueio tecnico](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/deploy/release_express_gateway_rolling_blocker.md)