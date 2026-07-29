# Runner Minimo de Release

Este documento descreve a entrada CLI minima da trilha oficial de release da Brana Cloude.

## Objetivo

Fornecer um runner PowerShell fino para:

- auditar o ambiente local;
- auditar o Git local em modo somente leitura;
- ler status de um contrato de release;
- reconhecer modos futuros sem executa-los;
- retornar codigos de saida estaveis;
- mascarar erros e manter a saida segura.

## Fonte unica

- contrato de release: `docs/deploy/release_contract.md`
- configuracao do ambiente: `docs/deploy/release_configuration.md`
- auditoria Git: `docs/deploy/release_git_audit.md`
- referencia historica do incidente: `docs/incidente_deploy_ecs_canary_20260729.md`

## Escopo atual

Nesta fase, apenas os modos abaixo sao funcionais:

- `audit`
- `status`

Os modos abaixo sao reconhecidos, mas retornam `MODE_NOT_IMPLEMENTED`:

- `preflight`
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

## Infraestrutura a confirmar

Antes do deploy, a documentacao operacional deve capturar:

- deployment controller;
- deployment strategy;
- desiredCount;
- minimumHealthyPercent;
- maximumPercent;
- circuit breaker;
- alarms;
- bake time;
- lifecycle hooks;
- production target group;
- alternate target group;
- production listener rule;
- test listener rule;
- mecanismo de promocao;
- mecanismo de rollback;
- health check;
- deregistration delay.

Se o servico estiver em CANARY, nao assumir rolling.

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
- `8` contrato invalido
- `9` modo nao implementado

## Saida Text

Saida curta e legivel para operador humano.

## Saida JSON

Saida estruturada, sem texto extra, para consumo automatizado.

## Seguranca

- executa apenas leitura de Git na auditoria
- nao executa AWS nesta fase
- nao executa Docker
- nao altera contrato
- nao cria contrato
- nao imprime secrets
- nao considera `rolloutState COMPLETED` como prova suficiente de ausencia de 503

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
  -Mode status `
  -ReleaseContractPath 'C:\temp\release-contract.json' `
  -OutputFormat Json
```

## Limitacoes

- sem preflight Git
- sem preflight ferramentas
- sem preflight AWS
- sem escrita de contrato
- sem logging JSONL persistente
- sem report de preflight
- sem validação de mecanismo de promocao por si so

## Proximos passos

As proximas subfases devem adicionar preflight de Git, ferramentas e AWS sem alterar a base de contratos e configuracoes ja validada.
