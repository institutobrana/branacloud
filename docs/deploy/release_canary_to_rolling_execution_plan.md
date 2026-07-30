# Plano tecnico de transicao de CANARY para ROLLING

## Contexto

Este documento registra o bloqueio tecnico encontrado ao tentar migrar o service ECS `default / brana-hml-backend` de `CANARY` para `ROLLING`.

A finalidade e deixar explicitado que o contrato local do runner admite ROLLING como alvo conceitual, mas a plataforma AWS rejeita essa mudanca para o service real observado.

## Fonte da verdade consultada

Documentos lidos e usados como base:

- `docs/deploy/release_contract.md`
- `docs/deploy/release_configuration.md`
- `docs/deploy/release_runner.md`
- `docs/deploy/release_canary_promotion_audit_20260729.md`
- `docs/deploy/release_runner_post_publish_audit_283748a5.md`
- `docs/10_continuidade.md`
- `docs/incidente_deploy_ecs_canary_20260729.md`

Leituras locais adicionais:

- `ops/release/brana-release.ps1`
- `ops/release/Brana.Release.psm1`
- `ops/release/config/hml.json`
- `ops/release/config/environments.schema.json`
- `ops/release/schemas/release-contract.schema.json`

## Estado atual confirmado

### Git

- Branch local: `modularizacao-segura-fase-1`
- HEAD local: `3d68b1870ff106d05f5ec2505e8e87d75d27f9cb`
- HEAD remoto da branch: `3d68b1870ff106d05f5ec2505e8e87d75d27f9cb`
- Stage: vazio
- Worktree: sujo por outras frentes, sem stage nesta etapa

### AWS

Leituras somente de consulta confirmaram:

- cluster: `default`
- service: `brana-hml-backend`
- deployment controller: `ECS`
- deployment strategy atual: `CANARY`
- desired count: `1`
- running count: `1`
- pending count: `0`
- task definition ativa: `default-brana-hml-backend:16`
- rollout state: `COMPLETED`
- circuit breaker: habilitado com rollback
- alarms: habilitadas com rollback
- canary percent: `5`
- canary bake time: `3`
- target group publico: `ecs-gateway-tg-755fef69195f7dbe3`
- target group alternativo: `ecs-gateway-tg-e9a92e7d6f31c7aaa`

### Estado observado em 2026-07-30 - HML

- ALB correto: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:loadbalancer/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd`
- DNS do ALB: `ecs-express-gateway-alb-cc2efd45-1405877640.sa-east-1.elb.amazonaws.com`
- listener HTTPS 443: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38`
- regra tecnica: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener-rule/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38/0ed547532de2e6e6`
- regra publica: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener-rule/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38/da864f476e9f5b28`
- target group publico: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-755fef69195f7dbe3/570f304e06f75054`
- target group alternativo: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-e9a92e7d6f31c7aaa/93b9db17c258ebe0`
- regra publica: `app.institutobrana.com.br` -> TG publico, peso `100`
- regra tecnica: `br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws` -> TG publico `100`, TG alternativo `0`
- health do TG publico: `healthy`
- health do TG alternativo: sem targets registrados

## Diagnostico tecnico

O service real continua operando em `CANARY`. A topologia AWS observada confirma a configuracao gradual com canary percentual e bake time.

O contrato local do runner e o arquivo `ops/release/config/hml.json` ainda modelam ROLLING como objetivo, mas isso nao e suficiente para autorizar a escrita na AWS.

Durante a tentativa formal, o ECS rejeitou a migracao com:

`Updating to ROLLING deployment strategy is not supported for ExpressGatewayServices.`

Isso encerra a possibilidade de tratar ROLLING como estado executavel para este service nesta arquitetura.

## Classificacao

Classificacao da topologia e do plano: `F` - bloqueio confirmado por incompatibilidade do tipo de service com `ROLLING`.

## Conclusao operacional

**NAO EXECUTAR - OPERACAO NAO SUPORTADA PELO TIPO DO SERVICO.**

Conclusao pratica:

- o contrato local pode continuar existindo como referencia tecnica;
- o plano nao deve ser tratado como executavel para este service;
- a medida segura e manter o service atual em `CANARY` ate que exista redefinicao arquitetural separada.

## O que permanece valido

- cluster
- service
- desired count
- task definition ativa
- circuit breaker
- rollback
- monitoramento
- Portao 3 continua bloqueado

## O que nao pode ser concluido

- migracao CANARY -> ROLLING neste service
- execucao do comando de escrita
- Portao 3
- publicacao da Anamnese

## Referencias

- [Resultado da tentativa](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/deploy/release_canary_to_rolling_execution_result.md)
- [Decisao executiva](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/deploy/release_canary_to_rolling_executive_decision.md)
- [Contrato de release](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/deploy/release_contract.md)
- [Runner de release](/D:/BRANA%20ARQUIVOS/BRANA%20CLOUD/docs/deploy/release_runner.md)