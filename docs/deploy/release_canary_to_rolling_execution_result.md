# Resultado da tentativa de migracao CANARY -> ROLLING

## Resumo

Data: `2026-07-30`

A tentativa foi executada com autorizacao expressa apenas para a migracao controlada do service ECS `default / brana-hml-backend`.

O comando foi rejeitado pelo proprio ECS com a mensagem:

`Updating to ROLLING deployment strategy is not supported for ExpressGatewayServices.`

Conclusao: a migracao nao foi aplicada.

## Estado antes da tentativa

- Account AWS: `810204249111`
- Regiao: `sa-east-1`
- Cluster: `default`
- Service: `brana-hml-backend`
- Task definition ativa: `default-brana-hml-backend:16`
- Strategy inicial: `CANARY`
- `canaryPercent`: `5`
- `bakeTimeInMinutes`: `3`
- `desiredCount`: `1`
- `minimumHealthyPercent`: `100`
- `maximumPercent`: `200`
- Target group publico: `ecs-gateway-tg-755fef69195f7dbe3`
- Target group alternativo: `ecs-gateway-tg-e9a92e7d6f31c7aaa`

## Baseline

Foram coletadas 5 amostras consecutivas com:

- `/health` = `200`
- `/app` = `200`
- target publico = `healthy`

Todos os samples permaneceram estaveis durante a baseline.

## Comando executado

```powershell
aws ecs update-service --cli-input-json file://D:/BRANA ARQUIVOS/BRANA CLOUD RELEASE AUDIT/canary-to-rolling-plan/update-service-rolling.json --region sa-east-1
```

## Resposta AWS

- Tipo de erro: `InvalidParameterException`
- Motivo: o ECS informou que a estrategia `ROLLING` nao e suportada para `ExpressGatewayServices`

## Efeito observado

- Nenhuma alteracao foi aplicada ao service
- Strategy permaneceu `CANARY`
- Task definition permaneceu `default-brana-hml-backend:16`
- Imagem e digest permaneceram inalterados
- Target publico permaneceu healthy
- Nao houve necessidade de rollback

## Estado final AWS

- Strategy: `CANARY`
- Task definition: `default-brana-hml-backend:16`
- `desiredCount`: `1`
- `runningCount`: `1`
- `pendingCount`: `0`
- `rolloutState`: `COMPLETED`
- `/health`: `200`
- `/app`: `200`
- ELB 5XX: nao observado na baseline desta tentativa
- Target 5XX: nao observado na baseline desta tentativa

## Conclusao

A autorizacao foi aplicada e a baseline foi cumprida, mas a migracao foi bloqueada por limitacao funcional do ECS para `ExpressGatewayServices`.

O Portao 3 permanece bloqueado.
A Anamnese nao foi publicada.

## Proximo passo seguro

- Manter a topologia atual em `CANARY`
- Registrar a limitacao no plano tecnico e na decisao executiva
- Nao executar Portao 3
- Nao publicar Anamnese
