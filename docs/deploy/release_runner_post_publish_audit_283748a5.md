# Auditoria final de reprodutibilidade do runner de release

## Escopo

Auditoria do HEAD publicado `283748a5269a72ad4d55b6d5270325d6330d7fc1`, feita em clone novo e limpo, sem reaproveitar o clone anterior corrigido manualmente.

## Referências

- Commit base: `d4537a1c2a8de049c6c68977d8213952bdd6a038`
- Commit corretivo: `283748a5269a72ad4d55b6d5270325d6330d7fc1`
- Clone auditado: `D:\BRANA ARQUIVOS\BRANA CLOUD RELEASE AUDIT\283748a5`

## Estado inicial do clone

- Clone criado a partir de `https://github.com/institutobrana/branacloud.git`
- HEAD validado após `checkout`: `283748a5269a72ad4d55b6d5270325d6330d7fc1`
- Worktree limpo
- Stage vazio
- Nenhum arquivo copiado do repositório principal
- Nenhum patch manual aplicado
- Nenhum `node_modules`
- Nenhum artefato externo

## Árvore completa de release confirmada

Arquivos presentes em `ops/release/`:

- `ops/release/brana-release.ps1`
- `ops/release/Brana.Release.psm1`
- `ops/release/modules/Brana.Release.Common.psm1`
- `ops/release/modules/Brana.Release.Git.psm1`
- `ops/release/modules/Brana.Release.Config.psm1`
- `ops/release/config/hml.json`
- `ops/release/config/prod.example.json`
- `ops/release/config/environments.schema.json`
- `ops/release/schemas/release-contract.schema.json`
- `ops/release/examples/release-contract.example.json`
- `ops/release/tests/Brana.Release.Common.Tests.ps1`
- `ops/release/tests/Brana.Release.Git.Tests.ps1`
- `ops/release/tests/Brana.Release.Config.Tests.ps1`
- `ops/release/tests/Brana.Release.Tests.ps1`
- `ops/release/tests/Brana.Release.Runner.Tests.ps1`

## Dependências e helper

- Nenhuma dependência ausente permaneceu no HEAD publicado
- `Get-BranaPlaceholderValue` existe em `Brana.Release.Common.psm1`
- O helper é compatível com o contrato esperado e é exportado pelo módulo
- Não foi encontrada dependência de current working directory
- Os imports usam caminhos seguros com `$PSScriptRoot`

## Imports em sessão nova

Importados com sucesso:

- `Brana.Release.Common.psm1`
- `Brana.Release.Git.psm1`
- `Brana.Release.Config.psm1`
- `Brana.Release.psm1`

Resultado:

- imports resolvem
- exportações existem
- `Get-BranaPlaceholderValue` disponível
- sem erro de helper ausente
- sem import circular observado

## Parser PowerShell

- Total de arquivos `.ps1` / `.psm1` em `ops/release`: 10
- Erros de parser: 0

## JSON e schemas

JSON válidos:

- `ops/release/config/hml.json`
- `ops/release/config/prod.example.json`
- `ops/release/config/environments.schema.json`
- `ops/release/schemas/release-contract.schema.json`
- `ops/release/examples/release-contract.example.json`

Validações observadas:

- `hml.json` compatível com o schema de environments
- `prod.example.json` válido como exemplo documental
- `release-contract.example.json` válido contra o schema de release contract
- `minimumHealthyPercent = 100`
- `maximumPercent = 200`
- rollout rolling mantido
- sem segredo detectado

Observação:

- o example JSON ainda apresenta aviso de linha em branco final, sem impacto funcional

## Suítes executadas

Ambiente:

- PowerShell: `5.1.26100.8875`
- Pester: `3.4.0`

Resultados:

- `Brana.Release.Common.Tests.ps1`
  - total: 8
  - passed: 8
  - failed: 0
  - skipped: 0

- `Brana.Release.Git.Tests.ps1`
  - total: 5
  - passed: 5
  - failed: 0
  - skipped: 0

- `Brana.Release.Config.Tests.ps1`
  - total: 7
  - passed: 7
  - failed: 0
  - skipped: 0

- `Brana.Release.Tests.ps1`
  - total: 11
  - passed: 11
  - failed: 0
  - skipped: 0

- `Brana.Release.Runner.Tests.ps1`
  - total: 12
  - passed: 12
  - failed: 0
  - skipped: 0

## Plan e preflight

Comandos executados no clone limpo:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\ops\release\brana-release.ps1 -Mode plan -Environment hml -RepositoryPath "D:\BRANA ARQUIVOS\BRANA CLOUD RELEASE AUDIT\283748a5" -DryRun
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\ops\release\brana-release.ps1 -Mode preflight -Environment hml -RepositoryPath "D:\BRANA ARQUIVOS\BRANA CLOUD RELEASE AUDIT\283748a5"
```

Resultado de ambos:

- código de saída: `10`
- motivo: `git worktree must be clean | git must not be detached`

Interpretação:

- o bloqueio foi contratual e não decorreu de dependência ausente
- não houve escrita AWS
- não houve execução de Portão 3

## Ausência de escrita AWS

- Nenhuma ação de escrita AWS executada
- Nenhum `update-service`
- Nenhum `register-task-definition`
- Nenhum `run-task`
- Nenhuma alteração de listener, target group, weights ou desiredCount

## Conferência dos dois commits

- `d4537a1c2a8de049c6c68977d8213952bdd6a038`
  - contém 12 arquivos
  - prepara o fluxo seguro de rolling ECS

- `283748a5269a72ad4d55b6d5270325d6330d7fc1`
  - contém exatamente 6 arquivos
  - inclui as dependências para clone limpo

## Decisão

- Reprodutibilidade confirmada
- Portão 3 continua bloqueado
- Nenhum commit feito nesta auditoria
- Nenhum push feito nesta auditoria

## Validação final com branch anexada

Motivo da repetição:

- o clone anterior estava em `detached HEAD`
- foi necessário confirmar o comportamento do runner com a branch anexada e sincronizada

Clone usado:

- `D:\BRANA ARQUIVOS\BRANA CLOUD RELEASE AUDIT\283748a5`

Branch e HEAD:

- branch: `modularizacao-segura-fase-1`
- HEAD local: `283748a5269a72ad4d55b6d5270325d6330d7fc1`
- HEAD remoto: `283748a5269a72ad4d55b6d5270325d6330d7fc1`
- ahead/behind: `0 0`

Estado Git final:

- worktree limpo
- stage vazio
- HEAD não detached

Resultado rápido dos imports:

- módulos carregados com sucesso em sessão nova
- `Get-BranaPlaceholderValue` presente

Resultado rápido das cinco suítes:

- todas verdes

`plan`:

- comando executado com `-Mode plan -Environment hml -RepositoryPath "D:\BRANA ARQUIVOS\BRANA CLOUD RELEASE AUDIT\283748a5" -DryRun`
- código de saída: `0`
- validações aprovadas: Git limpo, branch anexada, imports ok, schemas ok
- bloqueio: nenhum

`preflight`:

- comando executado com `-Mode preflight -Environment hml -RepositoryPath "D:\BRANA ARQUIVOS\BRANA CLOUD RELEASE AUDIT\283748a5"`
- código de saída: `0`
- validações aprovadas: Git limpo, branch anexada, imports ok, schemas ok
- bloqueio operacional real: AWS CANARY já ativo no serviço `brana-hml-backend`, enquanto o contrato local do runner permanece rolling
- mensagem observada: `Plano rolling pronto.`

Strategy local:

- `ROLLING`
- `minimumHealthyPercent = 100`
- `maximumPercent = 200`

Strategy AWS encontrada:

- `CANARY`
- `bakeTimeInMinutes = 3`
- `canaryPercent = 5.0`

AWS consultada:

- `aws sts get-caller-identity`
- `aws ecs describe-services --cluster default --services brana-hml-backend --region sa-east-1`

Throttling:

- não ocorreu nesta repetição

Ausência de escrita:

- nenhuma chamada de escrita AWS executada
- nenhum deploy
- nenhum update-service
- nenhum register-task-definition

Avaliação da mensagem `worktree/detached`:

- o bloqueio anterior era compatível com o estado detached e não se repetiu após a branch ser anexada
- com a branch anexada, o runner não acusou condição Git falsa

Classificação:

- **A. Runner reproduzível e bloqueio CANARY correto**

Conclusão definitiva:

- a reprodutibilidade ficou confirmada em condição Git contratualmente válida
- o bloqueio observado agora é operacional e ligado à divergência entre o contrato rolling local e a strategy CANARY real da AWS
- Portão 3 segue bloqueado
