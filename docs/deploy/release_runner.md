# Runner Minimo de Release

Este documento descreve a entrada CLI minima da trilha oficial de release da Brana Cloude.

## Objetivo

Fornecer um runner PowerShell fino para:

- auditar o ambiente local;
- auditar o Git local em modo somente leitura;
- ler status de um contrato de release;
- preparar um plano rolling local sem escrita em AWS;
- retornar codigos de saida estaveis;
- mascarar erros e manter a saida segura.

## Fonte unica

- contrato de release: `docs/deploy/release_contract.md`
- configuracao do ambiente: `docs/deploy/release_configuration.md`
- auditoria Git: `docs/deploy/release_git_audit.md`
- auditoria CANARY historica: `docs/deploy/release_canary_promotion_audit_20260729.md`
- referencia historica do incidente: `docs/incidente_deploy_ecs_canary_20260729.md`

## Escopo atual

Os modos abaixo sao funcionais:

- `audit`
- `status`
- `plan`
- `preflight`

Os modos abaixo sao reconhecidos, mas retornam `MODE_NOT_IMPLEMENTED`:

- `build`
- `push`
- `migrate`
- `deploy`
- `validate`
- `rollback`
- `full-release`
- `resume`

## Portoes obrigatorios

Antes de qualquer comando AWS, o runner deve exigir:

1. commit publicado;
2. local e remoto sincronizados;
3. novo clone fora do worktree principal;
4. checkout do hash exato;
5. `git status` limpo;
6. stage vazio;
7. `npm ci`;
8. build React;
9. build Docker;
10. teste local disponivel;
11. proibicao de usar worktree principal sujo como contexto Docker.

## Modo rolling

Os modos `plan` e `preflight` preparam o suporte operacional local para rolling ECS:

- carregam a configuracao HML;
- validam o schema e o preflight local;
- montam comandos futuros sem executa-los;
- retornam bloqueio se o clone estiver sujo ou a configuracao nao for compatível.

Esses modos nao escrevem em AWS e nao registram task definition.

## Infraestrutura a confirmar

Antes do deploy, a documentacao operacional deve capturar:

- deployment controller;
- deployment strategy;
- desiredCount;
- minimumHealthyPercent;
- maximumPercent;
- circuit breaker;
- alarms;
- health check;
- deregistration delay.

Em rolling, o contrato local deve considerar um unico target group publico e rejeitar dependencia de target group alternativo, bake ou listener de teste.

## Parametros

- `-Mode`
- `-Environment`
- `-RepositoryPath`
- `-ConfigPath`
- `-ReleaseContractPath`
- `-GitCommit`
- `-GitBranch`
- `-Operator`
- `-OutputFormat`
- `-DryRun`
- `-NonInteractive`
- `-NoColor`
- `-ReleaseNotes`

## Codigos de saida

- `0` sucesso
- `1` falha generica
- `2` parametros invalidos
- `3` configuracao invalida
- `4` git invalido
- `6` identidade AWS invalida
- `7` infraestrutura AWS divergente
- `8` contrato invalido
- `9` modo nao implementado
- `10` bloqueio recuperavel

## Saida Text

Saida curta e legivel para operador humano.

## Saida JSON

Saida estruturada, sem texto extra, para consumo automatizado.

## Seguranca

- executa apenas leitura de Git na auditoria;
- nao executa AWS nesta fase;
- nao executa Docker;
- nao altera contrato;
- nao cria contrato;
- nao imprime secrets;
- nao considera `rolloutState COMPLETED` como prova suficiente de ausencia de 503.

## Compatibilidade

Desenhado para Windows PowerShell 5.1 e Pester 3.4.0.

## Exemplos

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File .\ops\release\brana-release.ps1 `
  -Mode audit `
  -Environment hml `
  -RepositoryPath 'D:\BRANA ARQUIVOS\BRANA CLOUD'
```

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass `
  -File .\ops\release\brana-release.ps1 `
  -Mode plan `
  -Environment hml `
  -RepositoryPath 'D:\BRANA ARQUIVOS\BRANA CLOUD' `
  -DryRun
```

## Limitacoes

- sem execucao de AWS;
- sem escrita de contrato;
- sem logging JSONL persistente;
- sem report de preflight remoto;
- sem validacao de mecanismo de promocao por si so.

## Proximos passos

As proximas subfases devem aprofundar o preflight remoto e a execucao operacional sem alterar a base de contratos e configuracoes ja validada.
