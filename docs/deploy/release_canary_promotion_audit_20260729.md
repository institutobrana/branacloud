# Auditoria de promocao CANARY - brana-hml-backend

## 1. Objetivo

Formalizar a auditoria da promocao CANARY do servico `default / brana-hml-backend` e determinar, a partir do codigo operacional do proprio repositorio e da configuracao AWS observada, qual mecanismo de release foi realmente projetado para o ambiente.

## 2. Escopo

Incluido:

- leitura do runner operacional em `ops/release`;
- leitura do contrato e da configuracao de release;
- confronto com a infraestrutura AWS real observada em leitura;
- classificacao da aderencia entre runner, schema, configuracao e AWS;
- recomendacao de estrategia futura.

Excluido:

- qualquer escrita em AWS;
- deploy;
- registro de task definition;
- alteracao de codigo funcional;
- alteracao de banco;
- commit;
- push;
- alteracao de scripts, schema ou configuracao nesta etapa.

## 3. Estado inicial

### Git

- DiretÃ³rio: `D:\BRANA ARQUIVOS\BRANA CLOUD`
- Branch: `modularizacao-segura-fase-1`
- HEAD local/remoto: `4c6dcb1449f86a1551b1e3d0ab4c72538e6f872a`
- Stage: vazio
- Worktree: sujo por frentes preexistentes nao relacionadas

### AWS

- Conta: `810204249111`
- RegiÃ£o: `sa-east-1`
- Cluster: `default`
- ServiÃ§o: `brana-hml-backend`
- Task ativa: `default-brana-hml-backend:16`
- Estado do serviÃ§o: `desired=1`, `running=1`, `pending=0`, `rolloutState=COMPLETED`
- EstratÃ©gia: `CANARY`
- `canaryPercent=5`
- `bakeTimeInMinutes=3`
- Circuit breaker: habilitado
- Rollback: habilitado
- Alarm rollback: habilitado
- `/health`: `200`

## 4. ConfiguraÃ§Ã£o ECS observada

### Confirmado

- `deploymentController.type = ECS`
- `deploymentConfiguration.strategy = CANARY`
- `deploymentConfiguration.canaryConfiguration.canaryPercent = 5.0`
- `deploymentConfiguration.canaryConfiguration.canaryBakeTimeInMinutes = 3`
- `deploymentConfiguration.bakeTimeInMinutes = 3`
- `deploymentConfiguration.maximumPercent = 200`
- `deploymentConfiguration.minimumHealthyPercent = 100`
- `deploymentCircuitBreaker.enable = true`
- `deploymentCircuitBreaker.rollback = true`
- `alarms.enable = true`
- `alarms.rollback = true`
- alarme associado: `default/brana-hml-backend/RollbackAlarm`

### Observado

- `currentServiceRevisions` apontou para a revisÃ£o `1459565635392831848`
- `serviceDeployments` registrou uma sequÃªncia de deployments e rollback anteriores
- a AWS expÃ´s `serviceDeployments`, mas nao expÃ´s no `describe-services` campos como `advancedConfiguration`, `productionListenerRule` e `testListenerRule`

## 5. EstratÃ©gia CANARY

O serviÃ§o estÃ¡ configurado com CANARY nativo do ECS no plano de controle do serviÃ§o. Isso Ã© confirmado pela propriedade `deploymentConfiguration.strategy = CANARY`.

O que foi observado na prÃ¡tica:

- a task nova entrou como revisao de serviÃ§o;
- o target group alternativo recebeu registro na fase inicial do rollout;
- o target group pÃºblico permaneceu associado ao host pÃºblico;
- o rollback ocorreu por ECS e restaurou a task `:16`.

O que nÃ£o foi comprovado:

- qual regra do ALB o ECS considera "produÃ§Ã£o" e qual considera "teste" como contratos formais do serviÃ§o;
- se o host pÃºblico participa de uma troca explÃ­cita de pesos;
- se hÃ¡ `advancedConfiguration` visÃ­vel no modelo atual do serviÃ§o;
- se a promoÃ§Ã£o Ã© executada por um mecanismo externo, ainda que nÃ£o tenha surgido em CloudTrail.

## 6. Runner operacional

### Arquivos auditados

- `ops/release/brana-release.ps1`
- `ops/release/Brana.Release.psm1`
- `ops/release/modules/Brana.Release.Common.psm1`
- `ops/release/modules/Brana.Release.Config.psm1`
- `ops/release/modules/Brana.Release.Git.psm1`
- `ops/release/config/hml.json`
- `ops/release/schemas/release-contract.schema.json`

### SequÃªncia real do runner

1. O script principal `ops/release/brana-release.ps1` recebe parÃ¢metros de modo, ambiente, caminho do repositÃ³rio, config, contrato, commit, branch, operador, formato e flags.
2. `Invoke-BranaRunner` carrega os mÃ³dulos de release.
3. O modo Ã© validado apenas contra um conjunto fixo de strings.
4. Modos futuros como `preflight`, `build`, `push`, `migrate`, `deploy`, `validate`, `rollback`, `full-release` e `resume` retornam `MODE_NOT_IMPLEMENTED`.
5. O modo `audit` executa leitura local do repositÃ³rio e da configuraÃ§Ã£o.
6. O modo `status` lÃª e valida o contrato de release em disco.
7. NÃ£o existe, neste runner, execuÃ§Ã£o operacional de AWS para CANARY.
8. NÃ£o existe comando de promoÃ§Ã£o de trÃ¡fego.
9. NÃ£o existe espera de bake real de ECS.
10. NÃ£o existe validaÃ§Ã£o de dois target groups por mecanismo de trÃ¡fego.
11. NÃ£o existe loop de monitoramento do host pÃºblico.
12. NÃ£o existe etapa de deploy.

### FunÃ§Ãµes relevantes

- `Invoke-BranaRunner`: despacho principal por modo.
- `Invoke-BranaAuditMode`: auditoria local de Git e configuraÃ§Ã£o.
- `Invoke-BranaStatusMode`: leitura/validaÃ§Ã£o de contrato em disco.
- `Invoke-BranaReservedMode`: retorna modo nao implementado.
- `Resolve-BranaConfigPath`: localiza `hml.json` ou caminho explicito.
- `New-BranaRunnerResult` e `ConvertTo-BranaRunnerText`: formataÃ§Ã£o de saida.
- `Get-BranaContractSummary`: resumo de contrato.

### FunÃ§Ãµes de suporte

- `Protect-BranaSensitiveText`: mascara texto sensivel.
- `Get-BranaAllowedStateTransitions` e `Test-BranaReleaseTransitionAllowed`: maquina de estados do contrato.
- `Test-BranaReleaseContractObject`, `Get-BranaReleaseContract`, `Set-BranaReleaseState`, `Update-BranaReleaseContract`: contrato de release em disco.
- `Get-BranaGitRepositorySummary`, `Invoke-BranaGitReadOnly`: auditoria Git somente leitura.
- `Test-BranaEnvironmentConfig`, `Get-BranaEnvironmentConfig`: leitura e validacao da configuracao.

## 7. Comandos AWS que o runner realmente executa

Nesta base, o runner nao executa AWS. Ele e limitado a:

- validacao de contrato;
- leitura do Git;
- leitura da configuracao;
- formataÃ§Ã£o de saÃ­da.

## 8. ConfiguraÃ§Ã£o HML

Arquivo: `ops/release/config/hml.json`

### ConteÃºdo relevante

- conta AWS: `810204249111`
- regiÃ£o: `sa-east-1`
- cluster ECS: `default`
- serviÃ§o ECS: `brana-hml-backend`
- repositÃ³rio ECR: `brana-cloud/backend`
- domÃ­nio: `app.institutobrana.com.br`
- ALB: `ecs-express-gateway-alb-cc2efd45`
- listener HTTPS: ARN presente
- regra pÃºblica: ARN presente
- target group oficial: `ecs-gateway-tg-755fef69195f7dbe3`
- target group secundÃ¡rio: `ecs-gateway-tg-e9a92e7d6f31c7aaa`
- certificado: ARN presente
- log group: ARN de logs presente
- runtime platform: `LINUX/X86_64`

### Respostas objetivas

1. ContÃ©m apenas um target group? NÃ£o.
2. ContÃ©m o target group pÃºblico? Sim.
3. ContÃ©m o alternativo? Sim.
4. ContÃ©m regra de produÃ§Ã£o? Sim, como `public_rule_arn`.
5. ContÃ©m regra de teste? NÃ£o explicitamente.
6. ContÃ©m host tÃ©cnico? NÃ£o explicitamente.
7. ContÃ©m configuraÃ§Ã£o CANARY? NÃ£o como bloco formal, apenas referÃªncias de infraestrutura.
8. ContÃ©m promoÃ§Ã£o? NÃ£o.
9. ContÃ©m pesos? NÃ£o.
10. ContÃ©m bake time? NÃ£o.
11. ContÃ©m janela de observaÃ§Ã£o? NÃ£o.
12. ContÃ©m rollback explÃ­cito? NÃ£o.

### ClassificaÃ§Ã£o dos valores

- `official_target_group_arn`: atual
- `secondary_target_group_arn`: atual
- `public_rule_arn`: atual
- `https_listener_arn`: atual
- `alb_arn`: atual
- `domain`: atual
- ausÃªncia de canary formal: incompleto
- ausÃªncia de promoÃ§Ã£o e bake: ausente

## 9. Schema

Arquivo: `ops/release/schemas/release-contract.schema.json`

### O que o schema permite hoje

- contrato de release com estado, resultado, git, imagem, serviÃ§o, domÃ­nio e histÃ³rico
- `task_definition_before/after`
- `deployment_id`
- `target_group_before/after`
- `listener_rule`
- `rollback_task_definition`
- `rollback_image_digest`
- `rollback_target_group`
- `rollback_result`

### O que o schema nÃ£o modela

- deployment strategy
- production target group
- alternate target group
- production listener rule
- test listener rule
- canary percent
- bake time
- promotion controller
- observation window
- zero 503
- host pÃºblico verificado
- acompanhamento dos dois target groups

### ConclusÃ£o do schema

O schema atual Ã© compatÃ­vel com um contrato de release genÃ©rico com rollback, mas nÃ£o descreve o modelo operacional de CANARY em nÃ­vel suficiente para comprovar promoÃ§Ã£o de trÃ¡fego.

## 10. Suporte real a CANARY

### Existe implementaÃ§Ã£o operacional real de CANARY?

Sim, no plano da infraestrutura AWS observada. O serviÃ§o estÃ¡ em `CANARY` com `canaryPercent` e `bakeTimeInMinutes`.

### O runner sabe acompanhar as duas revisÃµes?

NÃ£o de forma operacional. Ele sabe ler contrato, Git e configuraÃ§Ã£o, mas nÃ£o executa o acompanhamento de serviÃ§o, target groups, listeners ou bake.

### O runner sabe qual target atende o host pÃºblico?

NÃ£o. Ele nÃ£o consulta AWS.

### O runner sabe diferenciar target alternativo saudÃ¡vel de host pÃºblico disponÃ­vel?

NÃ£o.

### Existe comando de promoÃ§Ã£o?

NÃ£o neste runner.

### Existe espera pelo bake?

NÃ£o.

### Existe validaÃ§Ã£o do drain?

NÃ£o.

## 11. AusÃªncia de CodeDeploy, Lambda, EventBridge e Step Functions

### CodeDeploy

- NÃ£o houve evidÃªncia operacional de CodeDeploy na infra observada.
- A interface AWS CLI disponÃ­vel nesta sessÃ£o nÃ£o expÃ´s o subcomando `codedeploy`.
- NÃ£o apareceu qualquer artefato local que indicasse uso de CodeDeploy para este serviÃ§o.

### Lambda

- NÃ£o foram encontradas funÃ§Ãµes Lambda relacionadas a canary, promotion, traffic shift ou ECS para este fluxo.

### EventBridge

- NÃ£o foram encontrados gatilhos/rules relevantes associados Ã  promoÃ§Ã£o de trÃ¡fego.

### Step Functions

- NÃ£o foram encontradas state machines relevantes para este fluxo.

## 12. CloudTrail

Janela auditada:

- `2026-07-29T18:30:00Z` a `2026-07-29T19:05:00Z`

Eventos procurados:

- `ModifyRule`
- `ModifyListener`
- `RegisterTargets`
- `DeregisterTargets`
- `UpdateService`
- `CreateServiceDeployment`
- `StartDeployment`
- `StopDeployment`
- `Rollback`

Resultado:

- nenhum evento retornado nessa janela e para esses nomes no CloudTrail consultado.

InterpretaÃ§Ã£o:

- isso nÃ£o prova ausÃªncia total de promoÃ§Ã£o;
- isso nÃ£o prova que o ECS nÃ£o alterou trÃ¡fego;
- isso apenas indica que, na consulta realizada, nÃ£o apareceu mudanÃ§a de trÃ¡fego registrada via CloudTrail para os eventos pesquisados.

## 13. Confronto com a AWS real

### Estado do serviÃ§o

- `deploymentController = ECS`
- `strategy = CANARY`
- `canaryPercent = 5`
- `bakeTimeInMinutes = 3`
- `currentServiceRevisions` aponta uma revisÃ£o Ãºnica ativa
- `serviceDeployments` mostra histÃ³ria de sucesso e rollback

### Target groups

- pÃºblico: `ecs-gateway-tg-755fef69195f7dbe3`
- alternativo: `ecs-gateway-tg-e9a92e7d6f31c7aaa`

### Hosts

- pÃºblico: `app.institutobrana.com.br`
- tÃ©cnico: `br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws`

### DivergÃªncias

- o runner nÃ£o contÃ©m API para observar promoÃ§Ã£o;
- o schema nÃ£o contÃ©m a topologia CANARY formal;
- a configuraÃ§Ã£o HML contÃ©m a topologia AWS, mas nÃ£o o mecanismo de promoÃ§Ã£o;
- a AWS atual confirma canary nativo, porÃ©m nÃ£o expÃµe no `describe-services` campos formais de `advancedConfiguration`.

## 14. ReconstruÃ§Ã£o de `:17` e `:18`

### `:17`

Confirmado/observado:

- houve deployment iniciado em `2026-07-29T18:35:24-03:00`;
- a revisÃ£o nova foi registrada como `3406948940064210535`;
- o target alternativo recebeu registro;
- o host pÃºblico permaneceu no target group `755...`;
- houve rollback posterior para `:16`.

NÃ£o comprovado:

- que o runner tenha promovido trÃ¡fego;
- que o runner tenha acompanhado os dois target groups;
- que exista uma etapa manual ou automatizada de promoÃ§Ã£o pÃºblica visÃ­vel neste repositÃ³rio.

### `:18`

Confirmado/observado:

- houve deployment iniciado em `2026-07-29T18:51:13-03:00`;
- a revisÃ£o nova foi a `1459565635392831848`;
- o target alternativo recebeu registro;
- o rollback posterior drenou a revisÃ£o anterior e retornou para `:16`;
- o service deployment terminou com `SUCCESSFUL`.

NÃ£o comprovado:

- que o host pÃºblico tenha participado corretamente de uma troca explÃ­cita de pesos;
- que o mecanismo de promoÃ§Ã£o pÃºblica tenha sido conduzido por um componente externo identificado.

## 15. Causa do 503 sob a perspectiva do runner

Sob a Ã³tica do runner atual, o 503 Ã© uma consequÃªncia de um fluxo que ele nÃ£o sabe controlar nem observar em nÃ­vel de trÃ¡fego.

Isto Ã©:

- o runner prepara contrato e leitura local;
- a AWS opera o rollout CANARY;
- o runner nÃ£o acompanha a promoÃ§Ã£o;
- o host pÃºblico pode ficar exposto a uma janela de comportamento nÃ£o modelada pelo runner.

Portanto, a falha Ã© melhor classificada como:

- falha de observabilidade do runner;
- falha de modelagem contratual;
- e possivelmente uma topologia CANARY incompleta para o que o operador esperava.

## 16. ClassificaÃ§Ã£o do runner

Escolha: **C. Projetado de forma genÃ©rica, mas incompleto para CANARY.**

Justificativa:

- hÃ¡ validaÃ§Ã£o de Git, contrato e config;
- hÃ¡ maquinÃ¡rio de estado do contrato;
- nÃ£o hÃ¡ motor de deploy;
- nÃ£o hÃ¡ monitoramento de trÃ¡fego;
- nÃ£o hÃ¡ promoÃ§Ã£o;
- nÃ£o hÃ¡ suporte a dois target groups em runtime;
- nÃ£o hÃ¡ no runner qualquer integraÃ§Ã£o operacional com o rollout ECS.

## 17. Runner x ConfiguraÃ§Ã£o x Schema x AWS

| Aspecto | Runner | ConfiguraÃ§Ã£o HML | Schema | AWS atual | SituaÃ§Ã£o |
|---|---|---|---|---|---|
| Strategy | ausente | ausente | ausente | CANARY | contraditÃ³rio |
| Target pÃºblico | ausente | presente | ausente | presente | parcialmente alinhado |
| Target alternativo | ausente | presente | ausente | presente | parcialmente alinhado |
| Listener produÃ§Ã£o | ausente | presente | ausente | presente | parcialmente alinhado |
| Listener teste | ausente | ausente | ausente | presente/implÃ­cito | ausente |
| Canary 5% | ausente | ausente | ausente | presente | ausente |
| Bake 3 min | ausente | ausente | ausente | presente | ausente |
| PromoÃ§Ã£o | ausente | ausente | ausente | nÃ£o comprovada no repositÃ³rio | ausente |
| Drain | ausente | ausente | ausente | presente nos eventos ECS | parcialmente alinhado |
| Rollback | parcial, de contrato | parcial, por referÃªncia | parcial | presente | parcialmente alinhado |
| Zero 503 | ausente | ausente | ausente | exigido operacionalmente | ausente |
| Smoke pÃºblico | ausente | ausente | ausente | observado apenas como health | ausente |
| ObservaÃ§Ã£o 15 min | ausente | ausente | ausente | nÃ£o modelada | ausente |

## 18. CANARY versus rolling

### CANARY corrigido

Vantagens:

- conserva a estratÃ©gia atual;
- preserva a ideia de promoÃ§Ã£o gradual;
- encaixa no histÃ³rico jÃ¡ existente.

Desvantagens:

- precisa de modelagem formal dos dois target groups;
- precisa de observabilidade de promoÃ§Ã£o;
- precisa de contrato e runner muito mais ricos;
- aumenta complexidade operacional.

### Rolling ECS

Vantagens:

- reduz a ambiguidade de promoÃ§Ã£o;
- simplifica o papel dos target groups;
- Ã© mais compatÃ­vel com um serviÃ§o web simples com `desiredCount = 1`;
- combina melhor com observaÃ§Ã£o de `/health` e `zero 503`.

Desvantagens:

- exige alteraÃ§Ã£o de estratÃ©gia;
- exige ensaio controlado;
- ainda requer rollback e monitoramento adequados.

### ComparaÃ§Ã£o resumida

| CritÃ©rio | CANARY corrigido | Rolling ECS |
|---|---|---|
| Complexidade | alta | menor |
| Risco | alto enquanto incompleto | moderado |
| AlteraÃ§Ãµes necessÃ¡rias | muitas | menos |
| Compatibilidade com runner | baixa hoje | melhor |
| Compatibilidade com schema | baixa hoje | melhor |
| Zero downtime | possÃ­vel, mas difÃ­cil de provar | mais direto |
| Observabilidade | exige reforÃ§o | mais simples |
| Rollback | mais complexo | mais direto |
| Custo | maior | menor |
| ManutenÃ§Ã£o | pesada | mais simples |
| AdequaÃ§Ã£o ao Brana Cloud | fraca hoje | melhor |

## 19. RecomendaÃ§Ã£o Ãºnica

**Recomenda-se migrar para rolling ECS.**

Motivos:

- o serviÃ§o tem `desiredCount = 1`;
- hÃ¡ uma aplicaÃ§Ã£o web Ãºnica;
- o trÃ¡fego pÃºblico Ã© concentrado em um host principal;
- o atual CANARY nÃ£o estÃ¡ suficientemente modelado no runner nem no schema;
- a promoÃ§Ã£o pÃºblica nÃ£o foi comprovada de ponta a ponta;
- o histÃ³rico de 503 indica risco operacional na transiÃ§Ã£o;
- rolling simplifica observaÃ§Ã£o, rollback e suporte futuro.

## 20. Plano de mudanÃ§a

### Fase 1 - CorreÃ§Ã£o de scripts e contratos

Arquivos a alterar futuramente:

- `ops/release/brana-release.ps1`
- `ops/release/Brana.Release.psm1`
- `ops/release/config/hml.json`
- `ops/release/schemas/release-contract.schema.json`
- documentaÃ§Ã£o de release em `docs/deploy/`

CorreÃ§Ãµes necessÃ¡rias:

- modelar explicitamente a estratÃ©gia escolhida;
- alinhar config e schema ao fluxo real;
- adicionar preflight de AWS e validaÃ§Ã£o de infraestrutura;
- definir rollback e observaÃ§Ã£o;
- preparar testes locais dos scripts.

### Fase 2 - Ensaio controlado de infraestrutura

Se a migraÃ§Ã£o para rolling for aprovada:

- reutilizar a imagem da task `:16`;
- mudar somente a estratÃ©gia;
- manter um target group pÃºblico Ãºnico;
- aplicar `minimumHealthyPercent = 100`;
- aplicar `maximumPercent = 200`;
- monitorar zero 503;
- preparar rollback claro.

### Fase 3 - Deploy funcional da Anamnese

- somente apÃ³s o ensaio;
- usar a imagem funcional prevista para a frente de Anamnese;
- manter observaÃ§Ã£o e smoke.

## 21. Comandos futuros preparados

Somente para documentaÃ§Ã£o futura, nÃ£o executar nesta etapa:

```powershell
aws ecs describe-services --cluster default --services brana-hml-backend --region sa-east-1
aws ecs describe-task-definition --task-definition default-brana-hml-backend:16 --region sa-east-1
aws elbv2 describe-target-health --target-group-arn <TARGET_GROUP_PUBLICO> --region sa-east-1
aws elbv2 describe-target-health --target-group-arn <TARGET_GROUP_ALTERNATIVO> --region sa-east-1
aws cloudtrail lookup-events --region sa-east-1 --start-time <INICIO> --end-time <FIM> --lookup-attributes AttributeKey=EventName,AttributeValue=ModifyRule
aws ecs update-service --cluster default --service brana-hml-backend --task-definition <TASK_DEFINICAO> --region sa-east-1
```

Esses comandos sÃ£o apenas exemplos futuros e nÃ£o devem ser executados nesta etapa.

## 22. Bloqueios mantidos

- PortÃ£o 3 permanece bloqueado;
- novo ensaio permanece bloqueado;
- publicaÃ§Ã£o da Anamnese permanece bloqueada;
- nova task definition permanece bloqueada;
- `update-service` permanece bloqueado;
- qualquer alteraÃ§Ã£o de trÃ¡fego permanece bloqueada.

## 23. ConclusÃ£o

O repositÃ³rio confirma que o projeto possui um runner de release voltado a leitura de Git, contrato e configuraÃ§Ã£o, mas nÃ£o um orquestrador operacional de promoÃ§Ã£o CANARY.

A AWS atual confirma que o serviÃ§o estÃ¡ em CANARY nativo do ECS, mas a comprovaÃ§Ã£o ponta a ponta do mecanismo de promoÃ§Ã£o pÃºblica nÃ£o estÃ¡ fechada pelo cÃ³digo operacional do repositÃ³rio.

Assim:

- o CANARY existe na infraestrutura;
- o runner nÃ£o o controla;
- o schema nÃ£o o modela;
- a configuraÃ§Ã£o local sÃ³ guarda a topologia;
- a promoÃ§Ã£o pÃºblica segue sem comprovaÃ§Ã£o operacional suficiente.

## 24. PrÃ³ximo passo recomendado

Preparar a correÃ§Ã£o para rolling ECS, com revisÃ£o formal de script, schema e configuraÃ§Ã£o, antes de qualquer novo ensaio ou publicaÃ§Ã£o funcional.
