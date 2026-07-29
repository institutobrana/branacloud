# Contrato de Release Brana Cloude

Este documento e a norma oficial da publicacao.

## Finalidade

Definir o que precisa estar comprovado antes de um release, quais estados bloqueiam a publicacao, quais artefatos e evidencias sao obrigatorios, quais operacoes sao proibidas, quando o deploy deve ser abortado, quando rollback e obrigatorio e quando o release pode ser declarado concluido.

## Hierarquia documental

Em caso de conflito, a ordem de autoridade e:

1. `docs/deploy/release_contract.md`
2. `docs/deploy/release_runner.md`
3. `docs/deploy/release_configuration.md`
4. `docs/10_continuidade.md`
5. `docs/incidente_deploy_ecs_canary_20260729.md`

Regras de precedencia:

- o contrato prevalece sobre o runner;
- o runner prevalece sobre exemplos historicos;
- configuracao nao autoriza deploy por si so;
- documentos de incidente nao substituem o contrato.

## Portao 1 - Reprodutibilidade Git

Antes de qualquer escrita em AWS, o release exige:

- commit funcional publicado;
- hash exato identificado;
- local e remoto sincronizados;
- clone novo e isolado;
- checkout do hash exato;
- worktree limpo;
- stage vazio;
- ausencia de arquivos copiados do worktree principal;
- `npm ci`;
- build React;
- build Docker;
- teste local quando disponivel;
- artefato rastreavel por commit.

Bloqueios obrigatorios:

- build que so passa no worktree sujo;
- imports dependentes de arquivos untracked;
- clone limpo que nao reproduz;
- lockfile alterado sem intencao;
- build dependente de arquivos externos nao versionados;
- imagem sem vinculo claro ao commit.

## Portao 2 - Infraestrutura compreendida

O release exige captura e validacao de:

- conta AWS;
- regiao;
- cluster;
- servico;
- task ativa;
- imagem ativa;
- desiredCount;
- runningCount;
- pendingCount;
- rolloutState;
- deployment controller;
- deployment strategy;
- minimumHealthyPercent;
- maximumPercent;
- circuit breaker;
- alarm rollback;
- bake time;
- production target group;
- alternate target group;
- production listener;
- test listener;
- mecanismo de promocao;
- mecanismo de drain;
- rollback;
- health check;
- deregistration delay.

Bloqueios obrigatorios:

- estrategia real nao identificada;
- CANARY tratado como rolling;
- target group publico nao confirmado;
- promocao nao comprovada;
- listener publico nao mapeado;
- servico instavel;
- rollback nao preparado.

## Portao 3 - Ensaio de infraestrutura

Quando houver mudanca de estrategia, alteracao de target group ou listener, duvida sobre promocao, incidente recente ou divergencia documental, o deploy funcional fica bloqueado ate um ensaio previo.

O ensaio deve comprovar:

- uso da mesma imagem saudavel atualmente ativa;
- nenhuma mudanca funcional;
- nova revisao apenas para testar a transicao;
- monitoramento continuo do host publico;
- zero 503;
- target novo util antes do drain;
- rollback comprovado.

## Portao 4 - Deploy funcional

O deploy funcional so pode ocorrer depois de:

- Portao 1 aprovado;
- Portao 2 aprovado;
- Portao 3 aprovado quando aplicavel;
- imagem publicada no ECR;
- digest registrado;
- task definition revisada;
- diferencas limitadas ao escopo autorizado;
- rollback preparado.

Durante a execucao, e obrigatorio registrar:

- monitoramento ECS;
- monitoramento dos target groups;
- metricas ALB;
- logs;
- `/health`;
- `/app`;
- host publico;
- periodo de observacao;
- smoke test.

## Regras para CANARY

Enquanto o servico estiver em CANARY, o release fica bloqueado sem resposta comprovada para:

- qual target group recebe producao;
- qual target group recebe teste;
- qual regra e publica;
- qual regra e tecnica;
- quem altera os pesos;
- como ocorre promocao;
- quando comeca o bake;
- quando termina o bake;
- quando a task antiga pode drenar;
- como rollback restaura o trafego;
- qual metrica comprova disponibilidade publica.

`aws ecs update-service` isoladamente nao constitui procedimento CANARY completo se houver etapa adicional de promocao de trafego.

## Regras para rolling

Rolling e alternativa contratual futura, nao afirmacao de estado ativo:

- um target group publico;
- minimumHealthyPercent = 100;
- maximumPercent = 200;
- capacidade para duas tasks temporarias;
- task nova saudavel antes do drain;
- circuit breaker;
- rollback;
- observacao continua.

A mudanca de CANARY para rolling exige ensaio e deve ser tratada como mudanca de infraestrutura.

## Condicoes de parada

O release deve ser interrompido antes do deploy quando ocorrer:

- branch incorreta;
- remote incorreto;
- clone sujo;
- build React falha;
- build Docker falha;
- imagem sem rastreabilidade;
- conta AWS incorreta;
- regiao incorreta;
- servico instavel;
- estrategia desconhecida;
- target group publico nao confirmado;
- promocao desconhecida;
- rollback nao preparado;
- task definition com alteracoes nao autorizadas;
- stage contaminado;
- dependencia nao versionada.

## Condicoes de rollback

Rollback e obrigatorio quando ocorrer:

- HTTP 503 recorrente;
- ausencia de target util no host publico;
- HealthyHostCount abaixo de 1 no caminho publico;
- task nova parada;
- target novo unhealthy;
- erro bloqueante nos logs;
- perda de `/app`;
- perda de `/health`;
- rolloutState FAILED;
- circuit breaker acionado;
- drain da task antiga antes da promocao confirmada;
- reinicio inesperado;
- diferenca funcional nao autorizada.

## Critério de sucesso

Nao e permitido declarar sucesso apenas com:

- task RUNNING;
- target healthy no grupo alternativo;
- waiter concluido;
- rolloutState COMPLETED;
- uma unica resposta 200.

E obrigatorio comprovar cumulativamente:

- target novo no caminho publico;
- task antiga preservada ate o momento seguro;
- `/health` 200 repetido;
- `/app` disponivel;
- zero 503;
- metricas ALB sem anomalia;
- logs sem erro bloqueante;
- smoke test;
- periodo minimo de 15 minutos;
- rollback nao necessario;
- evidencias registradas.

## Evidencias obrigatorias

O release exige registro de:

- hash do commit;
- clone usado;
- status Git;
- build React;
- build Docker;
- imagem;
- tag;
- digest;
- task anterior;
- task nova;
- diferencas da task;
- target groups;
- listener rules;
- timestamps;
- eventos ECS;
- target health;
- metricas ALB;
- curls;
- logs;
- smoke test;
- rollback preparado;
- estado final;
- HEAD local/remoto.

## Proibicoes permanentes

- build Docker no worktree principal sujo;
- `git add .`;
- `git add -A`;
- `git commit -a`;
- force push;
- merge ou rebase durante release;
- criacao de imagem sem hash rastreavel;
- reutilizacao de tag mutavel;
- alteracao de task definition alem do escopo;
- alteracao improvisada de rede;
- alteracao de banco para corrigir deploy;
- declaracao de sucesso sem observacao;
- novo deploy enquanto houver incidente aberto sem resolucao.

## Excecoes

Se houver suporte a excecoes, o contrato exige:

- justificativa escrita;
- risco;
- aprovador;
- escopo;
- prazo;
- rollback;
- evidencias;
- registro documental.

Nao existe excecao implicita.

## Referencia ao incidente

Referenciar `docs/incidente_deploy_ecs_canary_20260729.md` como evidência historica.

O incidente demonstrou:

- build nao reproduzivel inicialmente;
- dependencias ausentes no Git;
- duas tentativas com 503;
- ausencia de crash comprovado;
- diferenca entre target healthy e disponibilidade publica;
- necessidade dos quatro portoes.

## Contrato e execucao

- `release_runner.md` executa o procedimento em conformidade com este contrato.
- `release_configuration.md` fornece parametros, recursos e valores do ambiente.
- `10_continuidade.md` aponta para a trilha oficial e registra continuidade.
- documentos de incidente registram evidencias historicas e motivam ajustes.

## Registros e implementacao

O contrato referencia a implementacao formal de release em:

- modulo PowerShell: `ops/release/Brana.Release.psm1`
- schema JSON: `ops/release/schemas/release-contract.schema.json`
- exemplo valido: `ops/release/examples/release-contract.example.json`
- testes: `ops/release/tests/Brana.Release.Tests.ps1`
