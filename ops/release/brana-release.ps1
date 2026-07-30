<#
.SYNOPSIS
Runner minimo de release do Brana Cloud.

.DESCRIPTION
Entrada de linha de comando fina para auditoria local, preflight e leitura de status
do contrato. Nesta fase, os modos build, push, migrate, deploy, validate, rollback,
full-release e resume sao reconhecidos, mas retornam codigo explicito de modo nao
implementado.

.PARAMETER Mode
Modo de operacao do runner.

.PARAMETER Environment
Ambiente alvo, como hml ou prod.

.PARAMETER RepositoryPath
Caminho do repositorio local.

.PARAMETER ConfigPath
Caminho da configuracao do ambiente.

.PARAMETER ReleaseContractPath
Caminho do contrato de release.

.PARAMETER GitCommit
SHA de commit informativo para normalizacao de parametros.

.PARAMETER GitBranch
Branch informativa para normalizacao de parametros.

.PARAMETER Operator
Operador informativo para normalizacao de parametros.

.PARAMETER OutputFormat
Formato de saida: Text ou Json.

.PARAMETER DryRun
Marca de simulacao sem efeito operacional nesta fase.

.PARAMETER NonInteractive
Executar sem prompts.

.PARAMETER NoColor
Manter saida sem dependencia de cores.

.PARAMETER ReleaseNotes
Notas informativas mascaradas em erros e saida.

.EXAMPLE
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\ops\release\brana-release.ps1 -Mode audit -Environment hml -RepositoryPath 'D:\BRANA ARQUIVOS\BRANA CLOUD'

.EXAMPLE
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\ops\release\brana-release.ps1 -Mode audit -Environment hml -OutputFormat Json

.EXAMPLE
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\ops\release\brana-release.ps1 -Mode status -ReleaseContractPath 'C:\temp\release-contract.json'

.EXAMPLE
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\ops\release\brana-release.ps1 -Mode status -ReleaseContractPath 'C:\temp\release-contract.json' -OutputFormat Json

.EXAMPLE
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\ops\release\brana-release.ps1 -Mode preflight -Environment hml

.NOTES
Compatibilidade alvo: Windows PowerShell 5.1 e Pester 3.4.0.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Mode,
    [string]$Environment,
    [string]$RepositoryPath = (Get-Location).Path,
    [string]$ConfigPath,
    [string]$TelemetryPath,
    [string]$ReleaseContractPath,
    [string]$GitCommit,
    [string]$GitBranch,
    [string]$Operator,
    [string]$OutputFormat = 'Text',
    [switch]$DryRun,
    [switch]$NonInteractive,
    [switch]$NoColor,
    [string]$ReleaseNotes
)

$ErrorActionPreference = 'Stop'

function New-BranaRunnerTimestamp {
    return ([DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ss.fffZ'))
}

function New-BranaRunnerResult {
    param(
        [string]$SchemaVersion = '1.0.0',
        [string]$Mode,
        [string]$Environment,
        [bool]$Success,
        [int]$ExitCode,
        [datetime]$StartedAt,
        [datetime]$FinishedAt,
        [string]$Message,
        [object]$Data,
        [object[]]$Warnings,
        [object[]]$Errors
    )

    $durationMs = [int][Math]::Max(0, ($FinishedAt - $StartedAt).TotalMilliseconds)
    return [pscustomobject]@{
        SchemaVersion = $SchemaVersion
        Mode = $Mode
        Environment = $Environment
        Success = $Success
        ExitCode = $ExitCode
        StartedAt = $StartedAt.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
        FinishedAt = $FinishedAt.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
        DurationMs = $durationMs
        Message = $Message
        Data = $Data
        Warnings = @($Warnings)
        Errors = @($Errors)
    }
}

function ConvertTo-BranaRunnerText {
    param([Parameter(Mandatory)][object]$Result)
    $lines = @(
        'Brana Release Runner'
        ('Mode: {0}' -f $Result.Mode)
        ('Environment: {0}' -f $Result.Environment)
        ('Result: {0}' -f ($(if ($Result.Success) { 'SUCCESS' } else { 'FAILURE' })))
        ('Exit code: {0}' -f $Result.ExitCode)
        ''
        ('Message: {0}' -f $Result.Message)
    )
    if ($Result.Data -and $Result.Data.RepositoryPath) {
        $lines += ('Repository: {0}' -f $Result.Data.RepositoryPath)
    }
    if ($Result.Data -and $Result.Data.ConfigValidation) {
        $configState = if ($Result.Data.ConfigValidation.IsValid) { 'valid' } else { 'invalid' }
        $lines += ('Configuration: {0}' -f $configState)
    }
    if ($Result.Data -and $Result.Data.GitSummary) {
        $git = $Result.Data.GitSummary
        if ($git.RepositoryRoot) { $lines += ('Git root: {0}' -f $git.RepositoryRoot) }
        if ($git.Branch) { $lines += ('Git branch: {0}' -f $git.Branch) }
        if ($git.HeadShort) { $lines += ('Git head: {0}' -f $git.HeadShort) }
        $lines += ('Git dirty: {0}' -f ($(if ($git.WorktreeDirty -or $git.StageDirty) { 'yes' } else { 'no' })))
    }
    if ($Result.Data -and $Result.Data.ReleaseId) {
        $lines += ('Release ID: {0}' -f $Result.Data.ReleaseId)
    }
    if ($Result.Warnings.Count -gt 0) {
        $lines += ('Warnings: {0}' -f ($Result.Warnings -join ' | '))
    }
    if ($Result.Errors.Count -gt 0) {
        $lines += ('Errors: {0}' -f ($Result.Errors -join ' | '))
    }
    return ($lines -join [Environment]::NewLine)
}

function Import-BranaReleaseModules {
    $base = $PSScriptRoot
    Import-Module (Join-Path $base 'Brana.Release.psm1') -Force -ErrorAction Stop
    Import-Module (Join-Path $base 'modules\Brana.Release.Common.psm1') -Force -ErrorAction Stop
    Import-Module (Join-Path $base 'modules\Brana.Release.Canary.psm1') -Force -ErrorAction Stop
    Import-Module (Join-Path $base 'modules\Brana.Release.Telemetry.psm1') -Force -ErrorAction Stop
    Import-Module (Join-Path $base 'modules\Brana.Release.Config.psm1') -Force -ErrorAction Stop
    Import-Module (Join-Path $base 'modules\Brana.Release.Git.psm1') -Force -ErrorAction Stop
}

function Test-BranaRunnerModeKnown {
    param([string]$Value)
    return @('audit','status','plan','preflight','build','push','migrate','deploy','validate','rollback','full-release','resume') -contains ($Value.ToLowerInvariant())
}

function Resolve-BranaConfigPath {
    param(
        [string]$Environment,
        [string]$ExplicitConfigPath
    )

    if (-not [string]::IsNullOrWhiteSpace($ExplicitConfigPath)) {
        return (ConvertTo-BranaNormalizedPath -Path $ExplicitConfigPath -RequireExists)
    }
    if ([string]::IsNullOrWhiteSpace($Environment)) {
        throw 'Environment is required to resolve configuration.'
    }
    $candidate = Join-Path $PSScriptRoot ("config\{0}.json" -f $Environment.ToLowerInvariant())
    return (ConvertTo-BranaNormalizedPath -Path $candidate -RequireExists)
}

function Get-BranaContractSummary {
    param([Parameter(Mandatory)][object]$Contract)
    $history = @($Contract.history)
    $last = if ($history.Count -gt 0) { $history[$history.Count - 1] } else { $null }
    return [pscustomobject]@{
        ReleaseId = $Contract.release_id
        Environment = $Contract.environment
        GitCommit = $Contract.git_commit
        GitBranch = $Contract.git_branch
        State = $Contract.state
        Result = $Contract.result
        StartedAt = $Contract.started_at
        UpdatedAt = $Contract.updated_at
        FinishedAt = $Contract.finished_at
        LastTransition = $last
        FailureStage = $Contract.failure_stage
        FailureReason = $Contract.failure_reason
        RollbackResult = $Contract.rollback_result
        HistoryCount = $history.Count
    }
}

function Invoke-BranaAuditMode {
    param(
        [string]$RepositoryPath,
        [string]$Environment,
        [string]$ConfigPath,
        [switch]$DryRun,
        [string]$OutputFormat
    )

    $repoNormalized = ConvertTo-BranaNormalizedPath -Path $RepositoryPath
    if (-not (Test-Path -LiteralPath $repoNormalized)) {
        return [pscustomobject]@{
            Success = $false
            ExitCode = Get-BranaExitCode -Name 'INVALID_PARAMETERS'
            Message = 'Repository path not found.'
            Data = [pscustomobject]@{ RepositoryPath = $repoNormalized }
            Warnings = @()
            Errors = @('Repository path not found.')
        }
    }

    if ([string]::IsNullOrWhiteSpace($Environment)) {
        return [pscustomobject]@{
            Success = $false
            ExitCode = Get-BranaExitCode -Name 'INVALID_PARAMETERS'
            Message = 'Environment is required.'
            Data = [pscustomobject]@{ RepositoryPath = $repoNormalized }
            Warnings = @()
            Errors = @('Environment is required.')
        }
    }

    $resolvedConfigPath = Resolve-BranaConfigPath -Environment $Environment -ExplicitConfigPath $ConfigPath
    if (-not (Test-Path -LiteralPath $resolvedConfigPath)) {
        return [pscustomobject]@{
            Success = $false
            ExitCode = Get-BranaExitCode -Name 'INVALID_PARAMETERS'
            Message = 'Configuration file not found.'
            Data = [pscustomobject]@{ RepositoryPath = $repoNormalized; ConfigPath = $resolvedConfigPath }
            Warnings = @()
            Errors = @('Configuration file not found.')
        }
    }

    $config = Get-BranaEnvironmentConfig -Path $resolvedConfigPath
    $validation = Test-BranaEnvironmentConfig -Config $config
    $success = $validation.IsValid
    $exitCode = if ($success) { Get-BranaExitCode -Name 'SUCCESS' } else { Get-BranaExitCode -Name 'INVALID_CONFIGURATION' }
    $message = if ($success) { 'Auditoria local concluida.' } else { 'Configuracao invalida.' }
    $data = [pscustomobject]@{
        RepositoryPath = $repoNormalized
        RepositoryExists = $true
        ConfigPath = $resolvedConfigPath
        Configuration = $config
        PowerShellVersion = $PSVersionTable.PSVersion.ToString()
        RunnerVersion = '3B.2'
        Modules = @(
        'Brana.Release.psm1',
        'Brana.Release.Common.psm1',
        'Brana.Release.Config.psm1',
        'Brana.Release.Git.psm1'
        )
        ReleaseFiles = @(
            'ops/release/Brana.Release.psm1',
            'ops/release/modules/Brana.Release.Common.psm1',
            'ops/release/modules/Brana.Release.Config.psm1',
            'ops/release/modules/Brana.Release.Git.psm1',
            'ops/release/config/hml.json',
            'ops/release/config/prod.example.json',
            'ops/release/schemas/release-contract.schema.json'
        )
        DryRun = [bool]$DryRun
        OutputFormat = $OutputFormat
        ConfigValidation = $validation
    }
    $gitSummary = $null
    try {
        $gitSummary = Get-BranaGitRepositorySummary -Path $repoNormalized -RequiredPaths @(
            'ops/release/brana-release.ps1',
            'ops/release/modules/Brana.Release.Common.psm1',
            'ops/release/modules/Brana.Release.Config.psm1',
            'ops/release/modules/Brana.Release.Git.psm1',
            'ops/release/tests/Brana.Release.Runner.Tests.ps1'
        )
    }
    catch {
        $validation = [pscustomobject]@{
            IsValid = $false
            Errors = @((Protect-BranaSensitiveText $_.Exception.Message))
            Warnings = @()
        }
        $gitSummary = [pscustomobject]@{
            RepositoryPathRequested = $repoNormalized
            RepositoryRoot = $repoNormalized
            IsRepository = $false
            Errors = @((Protect-BranaSensitiveText $_.Exception.Message))
            Warnings = @()
            IsHealthy = $false
        }
        $success = $false
        $exitCode = Get-BranaExitCode -Name 'INVALID_GIT_STATE'
        $message = 'Git audit invalid.'
    }
    $data | Add-Member -NotePropertyName GitSummary -NotePropertyValue $gitSummary -Force
    $data | Add-Member -NotePropertyName GitAvailable -NotePropertyValue (Test-BranaGitAvailable) -Force
    if ($gitSummary -and $gitSummary.IsHealthy -eq $false -and $success) {
        $success = $false
        $exitCode = Get-BranaExitCode -Name 'INVALID_GIT_STATE'
        $message = 'Git audit invalid.'
    }
    return [pscustomobject]@{
        Success = $success
        ExitCode = $exitCode
        Message = $message
        Data = $data
        Warnings = @($validation.Warnings)
        Errors = @($validation.Errors)
    }
}

function Invoke-BranaStatusMode {
    param(
        [string]$ReleaseContractPath,
        [string]$Environment,
        [switch]$DryRun,
        [string]$OutputFormat
    )

    if ([string]::IsNullOrWhiteSpace($ReleaseContractPath)) {
        return [pscustomobject]@{
            Success = $false
            ExitCode = Get-BranaExitCode -Name 'INVALID_PARAMETERS'
            Message = 'ReleaseContractPath is required.'
            Data = $null
            Warnings = @()
            Errors = @('ReleaseContractPath is required.')
        }
    }

    $contractPath = ConvertTo-BranaNormalizedPath -Path $ReleaseContractPath -RequireExists
    if (-not (Test-Path -LiteralPath $contractPath)) {
        return [pscustomobject]@{
            Success = $false
            ExitCode = Get-BranaExitCode -Name 'INVALID_PARAMETERS'
            Message = 'Release contract not found.'
            Data = [pscustomobject]@{ ReleaseContractPath = $contractPath }
            Warnings = @()
            Errors = @('Release contract not found.')
        }
    }

    try {
        $contract = Get-BranaReleaseContract -Path $contractPath
        $validation = Test-BranaReleaseContract -Path $contractPath
        if (-not $validation.IsValid) {
            return [pscustomobject]@{
                Success = $false
                ExitCode = Get-BranaExitCode -Name 'INVALID_RELEASE_CONTRACT'
                Message = 'Contract invalid.'
                Data = [pscustomobject]@{ ReleaseContractPath = $contractPath; Validation = $validation }
                Warnings = @()
                Errors = @($validation.Errors)
            }
        }
    }
    catch {
        return [pscustomobject]@{
            Success = $false
            ExitCode = Get-BranaExitCode -Name 'INVALID_RELEASE_CONTRACT'
            Message = 'Contract invalid.'
            Data = [pscustomobject]@{ ReleaseContractPath = $contractPath }
            Warnings = @()
            Errors = @(Protect-BranaSensitiveText $_.Exception.Message)
        }
    }

    if (-not [string]::IsNullOrWhiteSpace($Environment) -and ($contract.environment.ToLowerInvariant() -ne $Environment.ToLowerInvariant())) {
        return [pscustomobject]@{
            Success = $false
            ExitCode = Get-BranaExitCode -Name 'INVALID_RELEASE_CONTRACT'
            Message = 'Environment mismatch.'
            Data = [pscustomobject]@{ ReleaseContractPath = $contractPath; ContractEnvironment = $contract.environment; RequestedEnvironment = $Environment }
            Warnings = @()
            Errors = @('Environment mismatch.')
        }
    }

    $hash = Get-FileHash -Algorithm SHA256 -LiteralPath $contractPath
    $summary = Get-BranaContractSummary -Contract $contract
    $data = [pscustomobject]@{
        ReleaseContractPath = $contractPath
        ContractHash = $hash.Hash
        Summary = $summary
        ReleaseId = $summary.ReleaseId
        Environment = $summary.Environment
        GitCommit = $summary.GitCommit
        GitBranch = $summary.GitBranch
        State = $summary.State
        Result = $summary.Result
        StartedAt = $summary.StartedAt
        UpdatedAt = $summary.UpdatedAt
        FinishedAt = $summary.FinishedAt
        LastTransition = $summary.LastTransition
        FailureStage = $summary.FailureStage
        FailureReason = $summary.FailureReason
        RollbackResult = $summary.RollbackResult
        DryRun = [bool]$DryRun
        OutputFormat = $OutputFormat
    }
    return [pscustomobject]@{
        Success = $true
        ExitCode = Get-BranaExitCode -Name 'SUCCESS'
        Message = 'Status local concluido.'
        Data = $data
        Warnings = @()
        Errors = @()
    }
}

function Invoke-BranaPlanMode {
    param(
        [string]$RepositoryPath,
        [string]$Environment,
        [string]$ConfigPath,
        [string]$TelemetryPath,
        [switch]$DryRun,
        [string]$OutputFormat
    )

    $repoNormalized = ConvertTo-BranaNormalizedPath -Path $RepositoryPath
    if ([string]::IsNullOrWhiteSpace($Environment)) {
        return [pscustomobject]@{
            Success = $false
            ExitCode = Get-BranaExitCode -Name 'INVALID_PARAMETERS'
            Message = 'Environment is required.'
            Data = [pscustomobject]@{ RepositoryPath = $repoNormalized }
            Warnings = @()
            Errors = @('Environment is required.')
        }
    }
    $resolvedConfigPath = Resolve-BranaConfigPath -Environment $Environment -ExplicitConfigPath $ConfigPath
    $config = Get-BranaEnvironmentConfig -Path $resolvedConfigPath
    $telemetry = $null
    if (-not [string]::IsNullOrWhiteSpace($TelemetryPath)) {
        $telemetry = Get-BranaCanaryTelemetry -Config $config -TelemetryPath $TelemetryPath
    }
    $preflight = Test-BranaReleaseDeploymentPreflight -RepositoryPath $repoNormalized -Config $config -Signals $telemetry
    $plan = Get-BranaReleaseDeploymentPlan -Config $config
    $success = $preflight.IsValid
    return [pscustomobject]@{
        Success = $success
        ExitCode = if ($success) { Get-BranaExitCode -Name 'SUCCESS' } else { Get-BranaExitCode -Name 'RECOVERABLE_BLOCK' }
        Message = if ($success) { 'Plano canary pronto.' } else { 'Plano canary bloqueado.' }
        Data = [pscustomobject]@{
            RepositoryPath = $repoNormalized
            ConfigPath = $resolvedConfigPath
            Config = $config
            Preflight = $preflight
            Plan = $plan
            DryRun = [bool]$DryRun
            OutputFormat = $OutputFormat
        }
        Warnings = @($preflight.ConfigValidation.Warnings)
        Errors = @($preflight.Errors)
    }
}

function Invoke-BranaPreflightMode {
    param(
        [string]$RepositoryPath,
        [string]$Environment,
        [string]$ConfigPath,
        [string]$TelemetryPath,
        [switch]$DryRun,
        [string]$OutputFormat
    )
    $resolvedConfigPath = Resolve-BranaConfigPath -Environment $Environment -ExplicitConfigPath $ConfigPath
    $config = Get-BranaEnvironmentConfig -Path $resolvedConfigPath
    $telemetry = $null
    if (-not [string]::IsNullOrWhiteSpace($TelemetryPath)) {
        $telemetry = Get-BranaCanaryTelemetry -Config $config -TelemetryPath $TelemetryPath
    }
    else {
        $telemetry = Get-BranaCanaryTelemetry -Config $config
    }
    $preflight = Test-BranaReleaseDeploymentPreflight -RepositoryPath $RepositoryPath -Config $config -Signals $telemetry
    $plan = Get-BranaReleaseDeploymentPlan -Config $config
    return [pscustomobject]@{
        Success = $preflight.IsValid
        ExitCode = if ($preflight.IsValid) { Get-BranaExitCode -Name 'SUCCESS' } else { Get-BranaExitCode -Name 'RECOVERABLE_BLOCK' }
        Message = if ($preflight.IsValid) { 'Plano canary pronto.' } else { 'Plano canary bloqueado.' }
        Data = [pscustomobject]@{
            RepositoryPath = $RepositoryPath
            ConfigPath = $resolvedConfigPath
            Config = $config
            Preflight = $preflight
            Plan = $plan
            Telemetry = $telemetry
            DryRun = [bool]$DryRun
            OutputFormat = $OutputFormat
        }
        Warnings = @()
        Errors = @($preflight.Errors)
    }
}

function Invoke-BranaReservedMode {
    param([string]$Mode)
    return [pscustomobject]@{
        Success = $false
        ExitCode = Get-BranaExitCode -Name 'MODE_NOT_IMPLEMENTED'
        Message = ('Mode not implemented: {0}' -f $Mode)
        Data = [pscustomobject]@{ Mode = $Mode }
        Warnings = @()
        Errors = @('Mode not implemented.')
    }
}

function Invoke-BranaRunner {
    param(
        [string]$Mode,
        [string]$Environment,
        [string]$RepositoryPath,
        [string]$ConfigPath,
        [string]$ReleaseContractPath,
        [string]$GitCommit,
        [string]$GitBranch,
        [string]$Operator,
        [string]$OutputFormat,
        [switch]$DryRun,
        [switch]$NonInteractive,
        [switch]$NoColor,
        [string]$ReleaseNotes
    )

    $started = [DateTime]::UtcNow
    try {
        Import-BranaReleaseModules
        if ($OutputFormat -notin @('Text','Json')) {
            return New-BranaRunnerResult -Mode $Mode -Environment $Environment -Success $false -ExitCode (Get-BranaExitCode -Name 'INVALID_PARAMETERS') -StartedAt $started -FinishedAt ([DateTime]::UtcNow) -Message 'Invalid OutputFormat.' -Data $null -Warnings @() -Errors @('Invalid OutputFormat.')
        }
        if (-not (Test-BranaRunnerModeKnown -Value $Mode)) {
            return New-BranaRunnerResult -Mode $Mode -Environment $Environment -Success $false -ExitCode (Get-BranaExitCode -Name 'INVALID_PARAMETERS') -StartedAt $started -FinishedAt ([DateTime]::UtcNow) -Message 'Unknown mode.' -Data $null -Warnings @() -Errors @('Unknown mode.')
        }
        if ($Mode -in @('build','push','migrate','deploy','validate','rollback','full-release','resume')) {
            $reserved = Invoke-BranaReservedMode -Mode $Mode
            return New-BranaRunnerResult -Mode $Mode -Environment $Environment -Success $reserved.Success -ExitCode $reserved.ExitCode -StartedAt $started -FinishedAt ([DateTime]::UtcNow) -Message $reserved.Message -Data $reserved.Data -Warnings $reserved.Warnings -Errors $reserved.Errors
        }
        if ($Mode -eq 'plan' -or $Mode -eq 'preflight') {
            $result = Invoke-BranaPreflightMode -RepositoryPath $RepositoryPath -Environment $Environment -ConfigPath $ConfigPath -TelemetryPath $TelemetryPath -DryRun:$DryRun -OutputFormat $OutputFormat
            return New-BranaRunnerResult -Mode $Mode -Environment $Environment -Success $result.Success -ExitCode $result.ExitCode -StartedAt $started -FinishedAt ([DateTime]::UtcNow) -Message $result.Message -Data $result.Data -Warnings $result.Warnings -Errors $result.Errors
        }
        if ($Mode -eq 'audit') {
            $result = Invoke-BranaAuditMode -RepositoryPath $RepositoryPath -Environment $Environment -ConfigPath $ConfigPath -DryRun:$DryRun -OutputFormat $OutputFormat
            return New-BranaRunnerResult -Mode $Mode -Environment $Environment -Success $result.Success -ExitCode $result.ExitCode -StartedAt $started -FinishedAt ([DateTime]::UtcNow) -Message $result.Message -Data $result.Data -Warnings $result.Warnings -Errors $result.Errors
        }
        if ($Mode -eq 'status') {
            $result = Invoke-BranaStatusMode -ReleaseContractPath $ReleaseContractPath -Environment $Environment -DryRun:$DryRun -OutputFormat $OutputFormat
            return New-BranaRunnerResult -Mode $Mode -Environment $Environment -Success $result.Success -ExitCode $result.ExitCode -StartedAt $started -FinishedAt ([DateTime]::UtcNow) -Message $result.Message -Data $result.Data -Warnings $result.Warnings -Errors $result.Errors
        }
        return New-BranaRunnerResult -Mode $Mode -Environment $Environment -Success $false -ExitCode (Get-BranaExitCode -Name 'MODE_NOT_IMPLEMENTED') -StartedAt $started -FinishedAt ([DateTime]::UtcNow) -Message 'Mode not implemented.' -Data $null -Warnings @() -Errors @('Mode not implemented.')
    }
    catch {
        $message = Protect-BranaSensitiveText $_.Exception.Message
        return New-BranaRunnerResult -Mode $Mode -Environment $Environment -Success $false -ExitCode (Get-BranaExitCode -Name 'GENERIC_FAILURE') -StartedAt $started -FinishedAt ([DateTime]::UtcNow) -Message $message -Data $null -Warnings @() -Errors @($message)
    }
}

try {
    $result = Invoke-BranaRunner -Mode $Mode -Environment $Environment -RepositoryPath $RepositoryPath -ConfigPath $ConfigPath -ReleaseContractPath $ReleaseContractPath -GitCommit $GitCommit -GitBranch $GitBranch -Operator $Operator -OutputFormat $OutputFormat -DryRun:$DryRun -NonInteractive:$NonInteractive -NoColor:$NoColor -ReleaseNotes $ReleaseNotes
    if ($OutputFormat -eq 'Json') {
        $result | ConvertTo-Json -Depth 8
    }
    else {
        ConvertTo-BranaRunnerText -Result $result
    }
    exit ([int]$result.ExitCode)
}
catch {
    $message = Protect-BranaSensitiveText $_.Exception.Message
    $fallback = New-BranaRunnerResult -Mode $Mode -Environment $Environment -Success $false -ExitCode (Get-BranaExitCode -Name 'GENERIC_FAILURE') -StartedAt ([DateTime]::UtcNow) -FinishedAt ([DateTime]::UtcNow) -Message $message -Data $null -Warnings @() -Errors @($message)
    if ($OutputFormat -eq 'Json') {
        $fallback | ConvertTo-Json -Depth 8
    }
    else {
        ConvertTo-BranaRunnerText -Result $fallback
    }
    exit ([int]$fallback.ExitCode)
}
