# Plano tecnico de transicao de CANARY para ROLLING

## Contexto

Este documento descreve o plano tecnico seguro para migrar o service ECS `default / brana-hml-backend` de `CANARY` para `ROLLING`, sem executar escrita na AWS nesta etapa.

A finalidade e preparar uma execucao posterior com rastreabilidade completa, preservando:

- o worktree local;
- o estado atual do service em AWS;
- a configuracao de rollback;
- o bloqueio do Portao 3;
- o padrao de observacao ja adotado no repositorio.

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
- deployment ativo: `ecs-svc/1459565635392831848`
- rollout state: `COMPLETED`
- circuit breaker: habilitado com rollback
- alarms: habilitadas com rollback
- canary percent: `5`
- canary bake time: `3`
- bake time total exposto pela API: `3`
- health check grace period: `0`
- availability zone rebalancing: `ENABLED`
- target groups publicos observados:
  - `ecs-gateway-tg-755fef69195f7dbe3`
  - `ecs-gateway-tg-e9a92e7d6f31c7aaa`

### Estado observado em 2026-07-30 - HML

- ALB correto: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:loadbalancer/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd`
- DNS do ALB: `ecs-express-gateway-alb-cc2efd45-1405877640.sa-east-1.elb.amazonaws.com`
- listener HTTPS 443: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38`
- regra tecnica: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener-rule/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38/0ed547532de2e6e6`
- regra publica: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener-rule/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38/da864f476e9f5b28`
- regra default: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener-rule/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38/b3480eadd30b2d02`
- target group publico: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-755fef69195f7dbe3/570f304e06f75054`
- target group alternativo: `arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-e9a92e7d6f31c7aaa/93b9db17c258ebe0`
- regra publica: `app.institutobrana.com.br` -> TG publico, peso `100`, stickiness `false`
- regra tecnica: `br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws` -> TG publico `100`, TG alternativo `0`, stickiness `false`
- health do TG publico: `healthy`
- health do TG alternativo: sem targets registrados
- atributos relevantes dos TGs:
  - `deregistration_delay.timeout_seconds = 300`
  - `stickiness.enabled = false`
  - `load_balancing.algorithm.type = round_robin`
  - `load_balancing.cross_zone.enabled = use_load_balancer_configuration`
  - `target_group_health.unhealthy_state_routing.minimum_healthy_targets.count = 1`
  - `target_group_health.dns_failover.minimum_healthy_targets.count = 1`
- service revision carregando a topologia formal:
  - `default-brana-hml-backend:16` -> revision `1459565635392831848`
  - `default-brana-hml-backend:17` -> revision `9232782161335382813`
  - `default-brana-hml-backend:18` -> revision `3406948940064210535`
- service deployments observados:
  - `ecs-svc/1459565635392831848` -> `SUCCESSFUL`
  - `ecs-svc/3406948940064210535` -> `SUCCESSFUL`
  - `ecs-svc/2775590457312235937` -> `SUCCESSFUL`
  - `ecs-svc/9232782161335382813` -> `SUCCESSFUL`
  - `ecs-svc/1620998403242191170` -> `SUCCESSFUL`
  - `ecs-svc/4802945567806349679` -> `ROLLBACK_SUCCESSFUL`

## Diagnostico tecnico

O service ainda opera em modo canary com uma configuracao coerente com blue/green de operacao gradual:

- existe estrategia `CANARY`;
- existe configuracao de canary com `5%`;
- existe bake time de `3` minutos;
- existe rollback por deployment circuit breaker e por alarmes;
- o runtime atual ja esta estabilizado e entregue.

O caminho de migracao para rolling deve remover a semantica de canary da configuracao operacional e manter apenas o necessario para o rolling update do ECS.

O host tecnico e a regra tecnica ainda existem, mas hoje apenas encaminham 100% para o target group publico; isso significa que os recursos de roteamento estao presentes e podem ser mantidos como parte da topologia observada, desde que nao sejam alterados nesta etapa.

A configuracao formal da topologia CANARY nao ficou visivel em `describe-services`, mas apareceu de forma completa em `describe-service-revisions`, com:

- `loadBalancers`
- `advancedConfiguration`
- `alternateTargetGroupArn`
- `productionListenerRule`
- `roleArn`

O `describe-services` bruto confirma apenas o contrato resumido:

- `deploymentConfiguration.strategy = CANARY`
- `deploymentConfiguration.canaryConfiguration`
- `deploymentConfiguration.bakeTimeInMinutes`
- `deploymentConfiguration.maximumPercent`
- `deploymentConfiguration.minimumHealthyPercent`

Classificacao da topologia: `A` - configuracao formal do serviço ECS encontrada nas service revisions.

## Objetivo de configuracao final

A configuracao final pretendida para o service, em termos conceituais, e:

- deployment controller continua `ECS`;
- deployment strategy passa para `ROLLING`;
- `minimumHealthyPercent` permanece em `100`;
- `maximumPercent` permanece em `200`;
- canary configuration deixa de existir na configuracao publicada;
- bake time canary deixa de existir na configuracao publicada;
- a task definition continua sendo a fonte de verdade do deploy;
- o rollback continua disponivel por mecanismo ja suportado pelo runner e pelo ECS;
- a observacao continua ativa, mas alinhada ao fluxo rolling.

## Contrato validado no runner local

O runner local ja expoe suporte conceitual ao rolling por meio de:

- `Get-BranaRollingDeploymentPlan`
- `Test-BranaRollingReleaseConfig`
- `Test-BranaRollingPreflight`

E o help da AWS CLI confirma que `aws ecs update-service` aceita os parametros relevantes para rolling, incluindo:

- `--cluster`
- `--service`
- `--task-definition`
- `--deployment-configuration`
- `--force-new-deployment`

## Campo a campo do que deve mudar

### Manter

- cluster
- service
- desired count
- task definition family
- execution role
- secrets
- network mode `awsvpc`
- subnet list
- security groups
- health check path `/health`
- load balancer publico
- circuit breaker
- rollback
- alarmes
- desired task count

### Remover da publicacao rolling

- `strategy: CANARY`
- `bakeTimeInMinutes`
- `canaryConfiguration`

### Confirmar antes da execucao real

- se a operacao final sera apenas `update-service --task-definition ...` com o service ja configurado para rolling;
- ou se a conversao exigira um update adicional de configuracao do service para explicitar `minimumHealthyPercent=100` e `maximumPercent=200`.

Neste momento, a evidência disponível mostra que a configuracao desejada ja existe no contrato local (`ops/release/config/hml.json`), mas o service em AWS ainda permanece em `CANARY`. Por isso, o plano recomenda primeiro alinhar a publicacao do service ao contrato rolling e, depois, promover a nova revision da task definition.

## Estrutura de validacao antes da escrita

Antes de qualquer escrita AWS, a execucao futura deve passar por:

1. leitura do service com `describe-services`;
2. leitura da task definition ativa com `describe-task-definition`;
3. verificacao do target group publico;
4. verificacao dos listeners associados ao ALB correto;
5. validacao local do comando `update-service` por help/sintaxe;
6. dry-run local do runner quando aplicavel;
7. conferencia de que nao ha dependencias de rede ou de diretório corrente.

### Comandos de leitura executados com sucesso

- `aws elbv2 describe-load-balancers --names ecs-express-gateway-alb-cc2efd45`
- `aws elbv2 describe-listeners --load-balancer-arn <ALB_ARN_CORRETO>`
- `aws elbv2 describe-rules --listener-arn <LISTENER_HTTPS_443_ARN>`
- `aws elbv2 describe-target-groups --target-group-arns <TG_PUBLICO> <TG_ALTERNATIVO>`
- `aws elbv2 describe-target-group-attributes --target-group-arn <TG_PUBLICO>`
- `aws elbv2 describe-target-group-attributes --target-group-arn <TG_ALTERNATIVO>`
- `aws elbv2 describe-target-health --target-group-arn <TG_PUBLICO>`
- `aws elbv2 describe-target-health --target-group-arn <TG_ALTERNATIVO>`
- `aws ecs describe-services --cluster default --services brana-hml-backend`
- `aws ecs list-service-deployments --cluster default --service brana-hml-backend`
- `aws ecs describe-service-deployments --service-deployment-arns <ARNS_RELEVANTES>`
- `aws ecs describe-service-revisions --service-revision-arns <ARNS_RELEVANTES>`

## Comando de migração pretendido

Este comando nao deve ser executado nesta etapa. Ele fica apenas documentado como formato alvo, sujeito a confirmacao final do estado real do service:

```powershell
aws ecs update-service `
  --cluster default `
  --service brana-hml-backend `
  --task-definition default-brana-hml-backend:17 `
  --deployment-configuration "minimumHealthyPercent=100,maximumPercent=200" `
  --region sa-east-1
```

### JSON de ida temporario

Arquivo fora do repositório:

- `D:\BRANA ARQUIVOS\BRANA CLOUD RELEASE AUDIT\canary-to-rolling-plan\update-service-rolling.json`

Conteudo validado localmente:

- `cluster`: `default`
- `service`: `brana-hml-backend`
- `desiredCount`: `1`
- `taskDefinition`: `default-brana-hml-backend:16`
- `deploymentConfiguration.strategy`: `ROLLING`
- `deploymentConfiguration.minimumHealthyPercent`: `100`
- `deploymentConfiguration.maximumPercent`: `200`
- `deploymentConfiguration.deploymentCircuitBreaker.enable`: `true`
- `deploymentConfiguration.deploymentCircuitBreaker.rollback`: `true`
- `deploymentConfiguration.alarms.enable`: `true`
- `deploymentConfiguration.alarms.rollback`: `true`
- sem `canaryConfiguration`
- sem `bakeTimeInMinutes`
- sem `loadBalancers`
- sem `advancedConfiguration`
- sem `forceNewDeployment`

### JSON de rollback temporario

Arquivo fora do repositório:

- `D:\BRANA ARQUIVOS\BRANA CLOUD RELEASE AUDIT\canary-to-rolling-plan\update-service-canary-rollback.json`

Conteudo validado localmente:

- `cluster`: `default`
- `service`: `brana-hml-backend`
- `desiredCount`: `1`
- `taskDefinition`: `default-brana-hml-backend:16`
- `deploymentConfiguration.strategy`: `CANARY`
- `deploymentConfiguration.minimumHealthyPercent`: `100`
- `deploymentConfiguration.maximumPercent`: `200`
- `deploymentConfiguration.deploymentCircuitBreaker.enable`: `true`
- `deploymentConfiguration.deploymentCircuitBreaker.rollback`: `true`
- `deploymentConfiguration.alarms.enable`: `true`
- `deploymentConfiguration.alarms.rollback`: `true`
- `deploymentConfiguration.bakeTimeInMinutes`: `3`
- `deploymentConfiguration.canaryConfiguration.canaryPercent`: `5`
- `deploymentConfiguration.canaryConfiguration.canaryBakeTimeInMinutes`: `3`
- `loadBalancers[0].targetGroupArn`: TG alternativo observado na service revision
- `loadBalancers[0].advancedConfiguration.alternateTargetGroupArn`: TG publico observado na service revision
- `loadBalancers[0].advancedConfiguration.productionListenerRule`: regra tecnica observada
- `loadBalancers[0].advancedConfiguration.roleArn`: `arn:aws:iam::810204249111:role/service-role/ecsInfrastructureRoleForExpressServices`

Observacao importante:

- o JSON de rollback foi montado apenas como espelho do estado formal observado nas service revisions;
- ele nao deve ser executado nesta etapa;
- ele nao substitui uma restauracao autorizada com verificacao humana.

Observacao:

- o numero da revisao `:17` acima e apenas um exemplo de futura promocao;
- a revisao real deve ser a revision publicada no momento da mudanca;
- nao ha autorizacao para registrar task definition nesta etapa;
- nao ha autorizacao para atualizar service nesta etapa.

## Sequencia tecnica recomendada para a mudanca real

1. Confirmar em AWS o estado final desejado do service.
2. Confirmar qual revision sera promovida.
3. Garantir que a configuracao rolling continua com `minimumHealthyPercent=100` e `maximumPercent=200`.
4. Confirmar que nao existe dependencia operacional de canary bake time.
5. Executar `update-service` com a nova task definition.
6. Acompanhar a estabilizacao ate `steady state`.
7. Validar health checks, target registration e logs.
8. Registrar o resultado em documento de auditoria pos-execucao.

## Rollback de referencia

O rollback de referencia continua sendo a revision `default-brana-hml-backend:16`.

Isso significa que, se a migracao para rolling for concluida e apresentar regressao, a reversao tecnica deve apontar para a revision anterior conhecida como estavel, respeitando o mecanismo de rollback existente.

O rollback topologico observado na AWS hoje e:

- manter o listener HTTPS 443;
- manter as regras publicas e tecnicas;
- manter o TG publico como destino principal;
- manter o TG alternativo e a regra tecnica prontos para reuso se a estrategia canary for reativada no futuro;
- restaurar `strategy: CANARY`;
- restaurar `canaryPercent: 5`;
- restaurar `bakeTimeInMinutes: 3`.

### Sintaxe oficial da CLI instalada

O skeleton de entrada de `aws ecs update-service` confirma os nomes e tipos exatos:

- `deploymentConfiguration`
- `strategy`
- `canaryConfiguration`
- `bakeTimeInMinutes`
- `minimumHealthyPercent`
- `maximumPercent`
- `deploymentCircuitBreaker`
- `alarms`
- `loadBalancers`
- `advancedConfiguration`

Semântica inferida a partir do help e do skeleton:

- omitir `canaryConfiguration` no modo rolling elimina a aplicabilidade do bloco no payload de ida;
- omitir `loadBalancers` no `update-service` nao e adequado para uma conversao que precisa preservar a topologia formal, porque a topologia existe nas service revisions;
- `advancedConfiguration` deve ser reapresentada no rollback para reconstruir o estado CANARY observado;
- `forceNewDeployment` deve permanecer ausente no caminho documentado, porque a alteracao de strategy ja caracteriza a mudanca desejada.

## Monitoracao sugerida

Durante uma futura execucao real, monitorar:

- `describe-services` ate steady state;
- health do target group publico;
- logs do container no grupo `/aws/ecs/default/brana-hml-backend-f5f1`;
- 503 no edge publico;
- eventos de drenagem de conexoes;
- tempo de estabilizacao.

## Riscos conhecidos

- o service atual continua em `CANARY`, portanto a mudanca ainda nao foi aplicada;
- uma transicao direta sem confirmar a configuracao do service pode manter semantica canary residual;
- a API de AWS pode sofrer throttling de autenticacao em leituras repetidas;
- o ALB/listener precisa ser confirmado com o ARN correto antes de qualquer alteracao;
- a task definition nova ainda nao foi publicada nesta etapa;
- nao foi executado Portao 3;
- nao foi feita nenhuma escrita AWS.

## Limitações desta etapa

Nesta etapa nao foi permitido:

- alterar AWS;
- registrar task definition;
- executar deploy;
- executar Portao 3;
- fazer commit;
- fazer push;
- fazer stage.

Logo, o resultado deste documento e um plano tecnico confirmado por leitura, nao uma alteracao de producao.

## Resultado esperado da execucao futura

Quando a mudanca for autorizada, espera-se:

- service em rolling;
- sem canary bake time;
- sem configuracao canary ativa;
- mantida a seguranca de rollback;
- task definition atualizada;
- service em steady state;
- sem 503 no caminho publico;
- sem regressao funcional.

## Pendencias para a proxima etapa

1. Confirmar o ARN correto do load balancer para a leitura de listeners.
2. Confirmar se existe listener rule dependente do target group alternativo.
3. Confirmar a revision futura da task definition.
4. Planejar a execucao real com janela controlada.
5. Registrar auditoria pos-mudanca.

## Respostas objetivas do mapeamento

1. Rolling pode usar somente o target group publico atual?
   - Sim, a topologia observada ja mostra o host publico fixo no TG publico.
2. O target group alternativo precisa ser removido do servico?
   - Nao necessariamente; ele pode permanecer como recurso de rollback ou sem uso.
3. A regra tecnica precisa ser alterada durante a migracao?
   - Nao, com base no estado atual ela ja esta em `100/0` para o TG publico.
4. A regra tecnica pode permanecer sem uso?
   - Sim, ela ja esta sem uso efetivo para entrega de trafego.
5. A regra publica precisa ser alterada?
   - Nao, ela ja esta em 100% para o TG publico.
6. O listener HTTPS pode permanecer intacto?
   - Sim, nao ha necessidade de alterar o listener para a mudanca de estrategia ECS.
7. A mudanca pode ser feita somente via ECS?
   - Sim, a documentacao local e a API consultada indicam que o ajuste de estrategia pode ser feito sem alterar listener.
8. Alguma chamada `modify-rule` seria necessaria?
   - Nao, nao com a topologia observada nesta etapa.
9. Quais campos CANARY precisam ser removidos?
   - `strategy`, `bakeTimeInMinutes`, `canaryConfiguration`.
10. Quais recursos podem permanecer criados para rollback?
   - ALB, listener 443, regras, TG alternativo, circuito de rollback e task `:16`.

## Capacidade para duas tasks

Classificacao observada: `provavel`.

Base da classificacao:

- `minimumHealthyPercent = 100`
- `maximumPercent = 200`
- launch type `FARGATE`
- CPU `512`
- memoria `1024`
- subnets `subnet-0881c465b7bc144cf` e `subnet-0c10e7cdd9977f41b`
- service revision atual e anterior mostram coexistencia historica de revisoes de task sem conflito de topologia
- o serviço atual roda com `desiredCount = 1`, o que reduz a exigencia de simultaneidade, mas a configuracao permite margem para duas tasks temporarias

Limite:

- nao foi feita medicao de capacidade de IPs na subrede nem teste de saturacao;
- portanto, a possibilidade de duas tasks e sustentada pela configuracao e pelo historico, mas nao foi instrumentada por teste de carga aqui.

## Critério de prontidão

Classificacao atual do plano: `A` - completo e pronto para revisao humana, ainda nao autorizado.

Motivos:

- topologia ECS/ALB formal agora esta fechada por service revisions;
- JSON de ida e rollback temporarios foram preparados;
- a sintaxe da CLI instalada foi validada;
- nao ha necessidade demonstrada de alterar listener ou regra neste momento;
- ainda falta autorizacao explicita para execucao real.
