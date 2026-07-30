# Configuracao de Ambiente da Release

Este documento define a camada de configuracao versionada usada pelo runner de release do Brana Cloude.

## Objetivo

A configuracao de ambiente guarda apenas dados estaveis e nao sensiveis para o modelo rolling:

- conta AWS;
- regiao AWS;
- cluster ECS;
- servico ECS;
- tarefa/base de familia;
- target group publico;
- URLs publicas;
- janela de observacao;
- intervalo de requests;
- criterio de rollback;
- runtime platform.

Ela e diferente do contrato de release:

- o contrato registra o historico de uma execucao;
- a configuracao descreve o ambiente alvo;
- o contrato operacional principal fica em `docs/deploy/release_contract.md`;
- o incidente historico que motivou os portoes adicionais fica em `docs/incidente_deploy_ecs_canary_20260729.md`.

## Schema

O schema vive em `ops/release/schemas/release-contract.schema.json`.

Regras principais:

- `schema_version` suporta a fase atual da configuracao;
- `environment` aceita apenas `hml` ou `prod`;
- `additionalProperties` continua `false`;
- a configuracao nao substitui o checklist de preflight nem a leitura do contrato de release;
- em ambiente com ECS CANARY, nao assumir rolling como estrategia equivalente;
- em ambiente rolling, `productionTargetGroupArn` e `observationMinutes` sao obrigatorios.

## Arquivos

- `ops/release/config/hml.json`
- `ops/release/config/prod.example.json`

## Validacao interna

A validacao usa `Test-BranaEnvironmentConfig` e retorna:

```powershell
[pscustomobject]@{
    IsValid = $true
    Errors = @()
    Warnings = @()
}
```

## Placeholders

Valores como `TODO`, `CHANGE_ME`, `000000000000`, `latest` e exemplos evidentes sao rejeitados quando usados em configuracao ativa.

O template `prod.example.json` existe apenas como referencia estrutural e nao deve ser usado como configuracao ativa.

## Compatibilidade

A base foi desenhada para Windows PowerShell 5.1 e Pester 3.4.0.

## Limites desta fase

- sem runner CLI;
- sem Git operacional;
- sem AWS write;
- sem Docker;
- sem deploy;
- sem rollback;
- sem escrita de contrato;
- sem validar mecanismo de promocao ou rollback por si so.
