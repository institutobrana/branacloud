# Incidente de disponibilidade no deploy ECS CANARY - 2026-07-29

## 1. Objetivo

Formalizar o incidente recorrente de disponibilidade observado no deploy do Brana Cloud em AWS, registrar o contrato operacional real do servico ECS e consolidar a conclusao da analise sem alterar backend, frontend, infraestrutura ou banco.

## 2. Escopo

Incluido nesta nota:

- Confirmacao do estado do repositorio local e do branch.
- Confirmacao do contrato ECS observado no ambiente AWS.
- Linha do tempo do incidente e do rollback.
- Evidencias sobre ALB, listener, target groups, health check e metricas.
- Conclusao operacional e recomendacao conservadora.

Fora de escopo:

- Alterar codigo, Docker, banco, IAM, ALB ou ECS.
- Executar deploy, commit, push ou qualquer escrita em AWS.
- Reabrir auditoria completa do modulo de anamnese.

## 3. Estado local confirmado

- Diretorio de trabalho: `D:\BRANA ARQUIVOS\BRANA CLOUD DEPLOY CLEAN\anamnese-build-fix-a3ae0608`
- Branch: `modularizacao-segura-fase-1`
- Remote: `origin https://github.com/institutobrana/branacloud.git`
- HEAD inicial e final desta etapa: `a3ae0608cf78c66d737d0f62593443e3dd2057a0`
- Stage inicial e final: vazio
- Status inicial observado: apenas `frontend-react/node_modules/` como untracked, sem relacao com esta analise

## 4. Fontes e evidencias usadas

Fontes locais consultadas nesta etapa:

- `README.md`
- `docs/00_master_guide.md`
- `docs/02_arquitetura.md`
- `docs/03_mapa_codigo.md`
- `docs/06_seguranca.md`
- `docs/10_continuidade.md`
- `docs/auditoria_prontidao_publicacao_aws.md`
- `docs/contrato_docker_backend_aws.md`
- `docs/validacao_frontend_react_principal_aws.md`
- `docs/validacao_frontend_react_rota_paralela_aws.md`
- `docs/correcao_painel_financeiro_procedimentos_dashboard_preview.md`
- `docs/encerramento_questionarios_anamnese_frontend_react.md`

Evidencias AWS coletadas durante a investigacao anterior, mantidas aqui como registro:

- `describe-services` do ECS.
- `describe-task-definition` das revisoes `default-brana-hml-backend:16`, `:17` e `:18`.
- `describe-rules` e `describe-target-groups` do ALB.
- `describe-target-health` do target group da rota publica.
- `get-metric-statistics` de CloudWatch para `HTTPCode_ELB_5XX_Count`, `HealthyHostCount`, `UnHealthyHostCount` e `HTTPCode_Target_5XX_Count`.

## 5. Contrato ECS observado

Servico:

- Cluster: `default`
- Service: `brana-hml-backend`
- Launch type: `FARGATE`
- Deployment controller: `ECS`
- Scheduling strategy: `REPLICA`

Configuracao de rollout:

- `deploymentCircuitBreaker.enable = true`
- `deploymentCircuitBreaker.rollback = true`
- `deploymentConfiguration.strategy = CANARY`
- `deploymentConfiguration.canaryConfiguration.canaryPercent = 5.0`
- `deploymentConfiguration.canaryConfiguration.canaryBakeTimeInMinutes = 3`
- `deploymentConfiguration.bakeTimeInMinutes = 3`
- `deploymentConfiguration.maximumPercent = 200`
- `deploymentConfiguration.minimumHealthyPercent = 100`
- `alarms.enable = true`
- `alarms.rollback = true`
- Alarm associado: `default/brana-hml-backend/RollbackAlarm`
- `healthCheckGracePeriodSeconds = 0`

Conclusao deste contrato:

- O ambiente nao estava em rollout linear simples.
- Havia CANARY ativo, com janela de bake e rollback automatico habilitados.
- O service controller continuou sendo ECS nativo, nao houve evidencia de CodeDeploy nesta investigacao.

## 6. Linha do tempo resumida

Horario local observado nas evidencias da AWS:

- `18:35:42` - inicio da task da revisao `default-brana-hml-backend:18`.
- `18:36:11` - target registrado como saudavel no target group historico `e9...`.
- `18:43:31` - inicio do drenagem/parada da task da revisao anterior.
- `18:43:41` - deregistration no target group publico `755...`.
- `18:45` a `18:51` - metricas CloudWatch mostraram `HTTPCode_ELB_5XX_Count` no ALB.
- `18:51:11` - inicio do rollback para `default-brana-hml-backend:16`.
- `18:51:55` - subida da task de rollback.
- `18:52:24` - target novamente registrado e saudavel.
- `19:00:57` - estado final estabilizado com rollout concluido.

## 7. Estado final apurado

Depois do rollback:

- `desiredCount = 1`
- `runningCount = 1`
- `pendingCount = 0`
- `rolloutState = COMPLETED`
- `/health = 200`

Task definition efetivamente estabilizada:

- `default-brana-hml-backend:16`

Revisoes problematizadas no ciclo:

- `default-brana-hml-backend:17`
- `default-brana-hml-backend:18`

## 8. Balanceamento, ALB e target groups

ALB:

- Nome: `ecs-express-gateway-alb-cc2efd45`
- Listener 443 ativo
- A regra default do listener retornava `404` fixo
- Nao foi encontrada regra fixa de `503` no listener

Regras relevantes:

- Host publico `app.institutobrana.com.br` apontando 100% para o target group `755...`
- Host tecnico `br-5c882cb2d9e6485f9cfbbac844ac550a.ecs.sa-east-1.on.aws` com pesos `100/0` entre `755...` e `e9...`

Target group publico:

- ARN: `ecs-gateway-tg-755fef69195f7dbe3`
- Protocolo: HTTP
- Porta: 8080
- Health check: `/health`
- Matcher: `200`

Sinais observados:

- `HealthyHostCount` permaneceu em `1`
- `UnHealthyHostCount` permaneceu em `0`
- `HTTPCode_Target_5XX_Count` nao trouxe datapoints no intervalo consultado
- `HTTPCode_ELB_5XX_Count` exibiu ocorrencias no ALB no periodo do incidente

Leitura operacional:

- O 503 publico nao apareceu como erro de target unhealthy no grupo principal.
- A evidencia aponta para erro na camada do ALB/roteamento/ciclo de substituicao durante a promocao canary, nao para falha persistente de saude do target publico.
- Esta conclusao e uma inferencia a partir dos dados coletados, nao uma prova absoluta de causa unica.

## 9. Conclusao tecnica

O deploy em AWS estava configurado com CANARY nativo do ECS, rollbacks automaticos e alarms. Durante a transicao, o ambiente expos brevemente 5xx no ALB, embora o target group publico nao tenha registrado falha sustentada de saude. O rollback para `default-brana-hml-backend:16` restaurou o estado funcional.

O padrao mais seguro, ate haver entendimento completo da estrategia de promocao canary no ambiente, e tratar este fluxo como sensivel e validar cada nova revisao em janela controlada antes da promocao total.

## 10. Recomendacao conservadora

1. Manter o deploy em ambiente de teste/validacao antes de qualquer promocao publica.
2. Documentar explicitamente a politica de canary e rollback para o servico `brana-hml-backend`.
3. Monitorar `HTTPCode_ELB_5XX_Count` e eventos de drenagem/registro de target como sinais primarios.
4. Evitar inferir que `HealthyHostCount = 1` elimina todo risco de 5xx no ALB.
5. Tratar o evento como resolvido pela reversao, mas ainda sem causa raiz definitivamente estabelecida em uma unica variavel.

## 11. Limites desta auditoria

- Nao houve escrita em AWS.
- Nao houve alteracao de backend, frontend, banco ou configuracao de infraestrutura.
- Nao houve commit nem push.
- O diretorio `frontend-react/node_modules/` permaneceu como alteracao preexistente nao relacionada.

## 12. Documentacao comparada

Documentos do repositorio principal que tratam do contexto de publicacao AWS, rollback e validacao:

- `docs/auditoria_prontidao_publicacao_aws.md`
- `docs/contrato_docker_backend_aws.md`
- `docs/validacao_frontend_react_principal_aws.md`
- `docs/validacao_frontend_react_rota_paralela_aws.md`
- `docs/correcao_painel_financeiro_procedimentos_dashboard_preview.md`
- `docs/encerramento_questionarios_anamnese_frontend_react.md`
- `docs/revalidacao_runtime_pos_rollback_novo_tratamento.md`
- `docs/plano_retomada_modularizacao_segura_pos_reversao.md`

Leitura comparativa resumida:

- Os documentos de publicacao anterior descrevem rollback, revisao de task definition e validacao publica, mas em cenarios que nao deixam a estrategia CANARY atual claramente contratada.
- Os documentos de continuidade e prontidao tratam de deploy conservador, mas nao registram de forma operacional a promocao entre os target groups `e9...` e `755...`.
- Os documentos funcionais do React e de encerramento de frentes validam comportamento de produto, mas nao funcionam como guia suficiente para seguranca do deploy ECS.
- Em conjunto, a base documental era util, porem nao cobria de forma fechada a promocao canary e a janela de drenagem observadas neste incidente.

## 13. Por que a documentacao nao evitou o incidente

### A. Falha de execucao

- Havia material de orientacao suficiente para exigir prudencia, mas a validacao operacional da promocao canary nao foi tratada como etapa separada e obrigatoria.
- A leitura dos sinais de saude do target group nao foi suficiente para confirmar a ausencia de indisponibilidade no ALB.
- O estado publico foi inferido a partir de health checks e registro de target, em vez de uma validacao completa de ponta a ponta no host publico.
- O processo pratico de deploy parece ter confiado demais em um resultado final de `runningCount` e `HealthyHostCount`, sem isolar a janela de troca de trafego.

### B. Falha documental

- A estrategia ECS `CANARY` atual nao estava descrita com o mesmo nivel de detalhe operacional desta investigacao.
- A promocao entre os target groups `e9...` e `755...` nao estava explicitada como sequencia critica do deploy.
- A documentacao anterior parecia mais alinhada a rollback ou publicacao direta do que a uma promocao de trafego com canary e bake time.
- Nao havia, de forma clara e operacional, um bloqueio textual exigindo ensaio em clone limpo com imagem idempotente antes da promocao publica.

## 14. Causa imediata, provavel e limites

- Causa imediata: indisponibilidade publica 503/5xx durante a janela de promocao/rollback do deploy ECS.
- Causa provavel: transicao de trafego entre target groups com canary e drenagem do target anterior em momento sensivel.
- Confirmado: houve `HTTPCode_ELB_5XX_Count` no ALB durante o incidente.
- Confirmado: o rollback para `default-brana-hml-backend:16` restaurou o estado funcional.
- Nao comprovado: uma unica falha de aplicacao na task nova como origem exclusiva do 503.
- Nao comprovado: uma regra fixa de `503` no listener.
- Descartado: falha sustentada do target group publico como explicacao unica, pois `HealthyHostCount` permaneceu em `1` e `UnHealthyHostCount` em `0`.

## 15. Plano de correcao documental

1. Manter este documento como registro oficial do incidente.
2. Acrescentar, nas proximas publicacoes AWS, um passo explicito de validacao do host publico antes de qualquer promocao total.
3. Registrar a sequencia real de canary, bake time, drenagem e rollback sempre que houver nova publicacao.
4. Garantir que os documentos de deploy deixem claro qual target group e qual regra de host estao em uso.
5. Usar este incidente como referencia para evitar novas inferencias baseadas somente em health check do target.
