Set-StrictMode -Version Latest

Import-Module (Join-Path $PSScriptRoot 'Brana.Release.Common.psm1') -Force -Scope Global -ErrorAction Stop
Import-Module (Join-Path $PSScriptRoot 'Brana.Release.Config.psm1') -Force -Scope Global -ErrorAction Stop
Import-Module (Join-Path $PSScriptRoot 'Brana.Release.Canary.psm1') -Force -Scope Global -ErrorAction Stop
Import-Module (Join-Path $PSScriptRoot 'Brana.Release.Telemetry.psm1') -Force -Scope Global -ErrorAction Stop

function Get-BranaDeploymentStateRoot {
    [CmdletBinding()]
    param(
        [string]$RootPath
    )

    if (-not [string]::IsNullOrWhiteSpace($RootPath)) {
        return ([System.IO.Path]::GetFullPath($RootPath) -replace '\\','/')
    }

    $base = if ($env:LOCALAPPDATA) {
        Join-Path $env:LOCALAPPDATA 'BranaCloud\release'
    }
    else {
        Join-Path ([System.IO.Path]::GetTempPath()) 'BranaCloud\release'
    }
    return ([System.IO.Path]::GetFullPath($base) -replace '\\','/')
}

function New-BranaDeploymentReleaseId {
    [CmdletBinding()]
    param(
        [string]$Environment
    )

    $prefix = if ([string]::IsNullOrWhiteSpace($Environment)) { 'release' } else { $Environment.Trim().ToLowerInvariant() }
    return ('{0}-{1}' -f $prefix, ([guid]::NewGuid().ToString('N')))
}

function Get-BranaDeploymentStatePath {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$ReleaseId,
        [string]$RootPath
    )

    $root = Get-BranaDeploymentStateRoot -RootPath $RootPath
    return (Join-Path $root ($ReleaseId + '.json'))
}

function Get-BranaDeploymentWriteWhitelist {
    [CmdletBinding()]
    param()

    return [ordered]@{
        ECS = @('register-task-definition','update-service','stop-service-deployment','deregister-task-definition')
    }
}

function Get-BranaDeploymentObjectPropertyValue {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][object]$InputObject,
        [Parameter(Mandatory)][string]$Name
    )

    if ($InputObject -is [System.Collections.IDictionary]) {
        if ($InputObject.Contains($Name)) { return $InputObject[$Name] }
        return $null
    }
    $property = $InputObject.PSObject.Properties[$Name]
    if ($null -eq $property) { return $null }
    return $property.Value
}

function ConvertTo-BranaDeploymentPlainObject {
    [CmdletBinding()]
    param(
        [AllowNull()][object]$InputObject
    )

    if ($null -eq $InputObject) {
        return $null
    }
    if ($InputObject -is [string] -or $InputObject -is [ValueType]) {
        return $InputObject
    }
    if ($InputObject -is [System.Collections.IDictionary]) {
        $ordered = [ordered]@{}
        foreach ($key in $InputObject.Keys) {
            $ordered[$key] = ConvertTo-BranaDeploymentPlainObject -InputObject $InputObject[$key]
        }
        return $ordered
    }
    if ($InputObject -is [System.Collections.IEnumerable] -and -not ($InputObject -is [string])) {
        $list = @()
        foreach ($item in $InputObject) {
            $list += ,(ConvertTo-BranaDeploymentPlainObject -InputObject $item)
        }
        return ,$list
    }
    $orderedObject = [ordered]@{}
    foreach ($property in $InputObject.PSObject.Properties) {
        $orderedObject[$property.Name] = ConvertTo-BranaDeploymentPlainObject -InputObject $property.Value
    }
    return $orderedObject
}

function Read-BranaDeploymentJson {
    [CmdletBinding()]
    param([Parameter(Mandatory)][string]$Path)

    return (ConvertFrom-Json -InputObject (Get-Content -LiteralPath $Path -Raw) -ErrorAction Stop)
}

function Test-BranaDeploymentPreflight {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$RepositoryPath,
        [Parameter(Mandatory)][object]$Config,
        [AllowNull()][object]$Signals
    )

    $serviceType = [string]$Config.serviceType
    $deploymentStrategy = [string]$Config.deploymentStrategy
    if ($serviceType -eq 'EXPRESS_GATEWAY' -or $deploymentStrategy -eq 'CANARY') {
        return (Brana.Release.Canary\Test-BranaCanaryDeploymentReadiness -Config $Config -Signals $Signals)
    }
    return [pscustomobject]@{
        IsValid = $false
        Errors = @('Only Express Gateway + CANARY is supported by deployment mode.')
        Plan = $null
        Signals = $Signals
    }
}

function Test-BranaAwsWriteCommandAllowed {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Service,
        [Parameter(Mandatory)][string]$Command
    )

    $serviceName = $Service.Trim()
    $commandName = $Command.Trim()
    $whitelist = Get-BranaDeploymentWriteWhitelist
    if (-not $whitelist.Contains($serviceName)) { return $false }
    return ($whitelist[$serviceName] -contains $commandName)
}

function Invoke-BranaAwsWriteCommand {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Service,
        [Parameter(Mandatory)][string]$Command,
        [object[]]$Arguments = @(),
        [int]$TimeoutSeconds = 30,
        [switch]$DryRun,
        [scriptblock]$Invoker = $null
    )

    if ($DryRun) {
        throw 'DryRun blocks AWS write commands.'
    }
    if (-not (Test-BranaAwsWriteCommandAllowed -Service $Service -Command $Command)) {
        throw "AWS write command not allowed: $Service $Command"
    }

    if ($null -eq $Invoker) {
        $Invoker = {
            param([string[]]$FullArguments, [int]$TimeoutSeconds)
            $psi = New-Object System.Diagnostics.ProcessStartInfo
            $psi.FileName = 'aws.exe'
            $psi.UseShellExecute = $false
            $psi.RedirectStandardOutput = $true
            $psi.RedirectStandardError = $true
            $psi.CreateNoWindow = $true
            $psi.Arguments = ($FullArguments -join ' ')
            $process = New-Object System.Diagnostics.Process
            $process.StartInfo = $psi
            $process.Start() | Out-Null
            $stdout = $process.StandardOutput.ReadToEnd()
            $stderr = $process.StandardError.ReadToEnd()
            $exited = $process.WaitForExit($TimeoutSeconds * 1000)
            if (-not $exited) { try { $process.Kill() } catch { } }
            $result = [pscustomobject]@{
                ExitCode = if ($exited) { $process.ExitCode } else { -1 }
                StdOut = $stdout
                StdErr = $stderr
                TimedOut = (-not $exited)
                DurationMs = 0
            }
            $process.Dispose()
            return $result
        }
    }

    $fullArguments = @($Service.Trim().ToLowerInvariant(), $Command.Trim()) + @($Arguments)
    return & $Invoker $fullArguments $TimeoutSeconds
}

function ConvertFrom-BranaEcsTaskDefinition {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][object]$InputObject
    )

    return (ConvertTo-BranaDeploymentPlainObject -InputObject $InputObject)
}

function Test-BranaDeploymentTaskDefinitionSemanticEquivalence {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][object]$Source,
        [Parameter(Mandatory)][object]$Target
    )

    $differences = New-Object System.Collections.Generic.List[string]
    $sourceObj = ConvertFrom-BranaEcsTaskDefinition -InputObject $Source
    $targetObj = ConvertFrom-BranaEcsTaskDefinition -InputObject $Target
    foreach ($field in @('family','taskRoleArn','executionRoleArn','networkMode','cpu','memory','runtimePlatform','ephemeralStorage','proxyConfiguration','ipcMode','pidMode')) {
        $sourceValue = Get-BranaDeploymentObjectPropertyValue -InputObject $sourceObj -Name $field
        $targetValue = Get-BranaDeploymentObjectPropertyValue -InputObject $targetObj -Name $field
        if ((ConvertTo-Json -Depth 16 -InputObject $sourceValue) -ne (ConvertTo-Json -Depth 16 -InputObject $targetValue)) {
            $differences.Add($field)
        }
    }
    $sourceContainers = @($sourceObj.containerDefinitions)
    $targetContainers = @($targetObj.containerDefinitions)
    if ($sourceContainers.Count -ne $targetContainers.Count) {
        $differences.Add('containerDefinitions.count')
    }
    else {
        for ($i = 0; $i -lt $sourceContainers.Count; $i++) {
            $s = $sourceContainers[$i]
            $t = $targetContainers[$i]
            foreach ($field in @('name','image','cpu','memory','memoryReservation','essential','command','entryPoint','environment','secrets','mountPoints','volumesFrom','portMappings','healthCheck','logConfiguration','systemControls')) {
                $sv = Get-BranaDeploymentObjectPropertyValue -InputObject $s -Name $field
                $tv = Get-BranaDeploymentObjectPropertyValue -InputObject $t -Name $field
                if ((ConvertTo-Json -Depth 16 -InputObject $sv) -ne (ConvertTo-Json -Depth 16 -InputObject $tv)) {
                    $differences.Add(("containerDefinitions[{0}].{1}" -f $i, $field))
                }
            }
        }
    }
    return [pscustomobject]@{
        IsValid = ($differences.Count -eq 0)
        Differences = @($differences)
    }
}

function Read-BranaDeploymentState {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path)) { return $null }
    return (Read-BranaDeploymentJson -Path $Path)
}

function Write-BranaDeploymentStateAtomic {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Path,
        [Parameter(Mandatory)][object]$State
    )

    $directory = Split-Path -Parent $Path
    if ($directory -and -not (Test-Path -LiteralPath $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }
    $tempPath = Join-Path $directory ('.' + [guid]::NewGuid().ToString('N') + '.tmp')
    try {
        Set-Content -LiteralPath $tempPath -Value ($State | ConvertTo-Json -Depth 16) -Encoding UTF8
        Move-Item -LiteralPath $tempPath -Destination $Path -Force
    }
    finally {
        if (Test-Path $tempPath) {
            Remove-Item -LiteralPath $tempPath -Force -ErrorAction SilentlyContinue
        }
    }
}

function New-BranaDeploymentState {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$ReleaseId,
        [Parameter(Mandatory)][string]$Environment,
        [Parameter(Mandatory)][string]$AccountId,
        [Parameter(Mandatory)][string]$Region,
        [Parameter(Mandatory)][string]$Cluster,
        [Parameter(Mandatory)][string]$Service,
        [Parameter(Mandatory)][string]$GitHead,
        [Parameter(Mandatory)][string]$SourceTaskDefinition,
        [Parameter(Mandatory)][string]$TargetTaskDefinition,
        [Parameter(Mandatory)][string]$SourceServiceRevision,
        [Parameter(Mandatory)][string]$TargetServiceRevision,
        [Parameter(Mandatory)][string]$Strategy,
        [Parameter(Mandatory)][int]$CanaryPercent,
        [Parameter(Mandatory)][int]$BakeTimeInMinutes,
        [Parameter(Mandatory)][string]$Phase,
        [string]$Decision = $null,
        [string]$RollbackStatus = $null,
        [AllowNull()][object[]]$Warnings = @(),
        [AllowNull()][object[]]$Errors = @()
    )

    return [ordered]@{
        releaseId = $ReleaseId
        environment = $Environment
        accountId = $AccountId
        region = $Region
        cluster = $Cluster
        service = $Service
        gitHead = $GitHead
        startedAtUtc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
        sourceTaskDefinition = $SourceTaskDefinition
        targetTaskDefinition = $TargetTaskDefinition
        sourceServiceRevision = $SourceServiceRevision
        targetServiceRevision = $TargetServiceRevision
        serviceDeploymentArn = $null
        strategy = $Strategy
        canaryPercent = [int]$CanaryPercent
        bakeTime = [int]$BakeTimeInMinutes
        phase = $Phase
        lastTelemetryAtUtc = $null
        decision = $Decision
        rollbackStatus = $RollbackStatus
        completedAtUtc = $null
        errors = @($Errors)
        warnings = @($Warnings)
    }
}

function Test-BranaDeploymentConfirmation {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][object]$Config,
        [switch]$ConfirmDeployment,
        [string]$ConfirmationToken,
        [string]$ExpectedGitHead,
        [string]$TargetTaskDefinition
    )

    if (-not $ConfirmDeployment) { return $false }
    if ([string]::IsNullOrWhiteSpace($ConfirmationToken)) { return $false }
    if ([string]::IsNullOrWhiteSpace($ExpectedGitHead)) { return $false }
    if ([string]::IsNullOrWhiteSpace($TargetTaskDefinition)) { return $false }
    if ($ConfirmationToken -ne ($Config.awsAccountId + ':' + $Config.awsRegion + ':' + $ExpectedGitHead + ':' + $TargetTaskDefinition)) { return $false }
    return $true
}

function Get-BranaDeploymentSummaryLine {
    param([string]$Label, [object]$Value)
    return ('{0}: {1}' -f $Label, $Value)
}

function Invoke-BranaDeploymentMode {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$RepositoryPath,
        [Parameter(Mandatory)][string]$Environment,
        [Parameter(Mandatory)][object]$Config,
        [string]$TelemetryPath,
        [string]$ReleaseId,
        [string]$TaskDefinitionArn,
        [string]$TaskDefinitionJsonPath,
        [switch]$ConfirmDeployment,
        [string]$ConfirmationToken,
        [switch]$DryRun,
        [string]$StateRootPath,
        [string]$GitHead,
        [scriptblock]$AwsReadInvoker = $null,
        [scriptblock]$AwsWriteInvoker = $null,
        [scriptblock]$HttpInvoker = $null,
        [int]$PollIntervalSeconds = 5,
        [int]$TimeoutSeconds = 300
    )

    $signals = if (-not [string]::IsNullOrWhiteSpace($TelemetryPath)) {
        Brana.Release.Telemetry\Get-BranaCanaryTelemetry -Config $Config -TelemetryPath $TelemetryPath
    }
    else {
        Brana.Release.Telemetry\Get-BranaCanaryTelemetry -Config $Config -AwsInvoker $AwsReadInvoker -HttpInvoker $HttpInvoker
    }
    $preflight = Test-BranaDeploymentPreflight -RepositoryPath $RepositoryPath -Config $Config -Signals $signals
    if (-not $preflight.IsValid) {
        return [pscustomobject]@{
            Success = $false
            ExitCode = 10
            Message = 'Deployment blocked by preflight.'
            Data = [pscustomobject]@{ Preflight = $preflight }
            Warnings = @()
            Errors = @($preflight.Errors)
        }
    }

    if ([string]::IsNullOrWhiteSpace($ReleaseId)) {
        $ReleaseId = (New-BranaDeploymentReleaseId -Environment $Environment)
    }
    $statePath = Get-BranaDeploymentStatePath -ReleaseId $ReleaseId -RootPath $StateRootPath
    $sourceTaskDefinition = [string]$Config.rollbackTaskDefinition
    $targetTaskDefinition = $TaskDefinitionArn
    $sourceRevision = $sourceTaskDefinition
    $targetRevision = $TaskDefinitionArn
    if (-not [string]::IsNullOrWhiteSpace($TaskDefinitionJsonPath)) {
        $targetTaskDefinition = $null
        $targetRevision = $null
    }

    $state = New-BranaDeploymentState -ReleaseId $ReleaseId -Environment $Environment -AccountId $Config.awsAccountId -Region $Config.awsRegion -Cluster $Config.ecsCluster -Service $Config.ecsService -GitHead $GitHead -SourceTaskDefinition $sourceTaskDefinition -TargetTaskDefinition ([string]$targetTaskDefinition) -SourceServiceRevision $sourceRevision -TargetServiceRevision ([string]$targetRevision) -Strategy $Config.deploymentStrategy -CanaryPercent ([int]$Config.canaryPercent) -BakeTimeInMinutes ([int]$Config.bakeTimeInMinutes) -Phase 'PREPARED'
    $state | Add-Member -NotePropertyName preflight -NotePropertyValue $preflight -Force

    if ($DryRun) {
        return [pscustomobject]@{ Success = $false; ExitCode = 10; Message = 'DryRun blocks deployment.'; Data = $state; Warnings = @(); Errors = @('DryRun blocks deployment.') }
    }

    if (-not (Test-BranaDeploymentConfirmation -Config $Config -ConfirmDeployment:$ConfirmDeployment -ConfirmationToken $ConfirmationToken -ExpectedGitHead $GitHead -TargetTaskDefinition ([string]$TaskDefinitionArn))) {
        return [pscustomobject]@{ Success = $false; ExitCode = 20; Message = 'Confirmation required.'; Data = $state; Warnings = @(); Errors = @('Confirmation required.') }
    }

    $state.phase = 'REGISTERING_TASK_DEFINITION'
    Write-BranaDeploymentStateAtomic -Path $statePath -State $state

    if (-not [string]::IsNullOrWhiteSpace($TaskDefinitionJsonPath)) {
        $registerArgs = @('register-task-definition','--cli-input-json',("file://{0}" -f $TaskDefinitionJsonPath),'--region',$Config.awsRegion,'--output','json')
        $registerResult = Invoke-BranaAwsWriteCommand -Service 'ECS' -Command 'register-task-definition' -Arguments $registerArgs[1..($registerArgs.Count-1)] -Invoker $AwsWriteInvoker
        if ($registerResult.ExitCode -ne 0) {
            $state.phase = 'FAILED'
            $state.errors += @($registerResult.StdErr)
            Write-BranaDeploymentStateAtomic -Path $statePath -State $state
            return [pscustomobject]@{ Success = $false; ExitCode = 30; Message = 'Task registration failed.'; Data = $state; Warnings = @(); Errors = @($state.errors) }
        }
        $state.phase = 'TASK_DEFINITION_REGISTERED'
        $state.targetServiceRevision = 'registered'
    }

    $state.phase = 'STARTING_DEPLOYMENT'
    $updateArgs = @('--cluster',$Config.ecsCluster,'--service',$Config.ecsService,'--task-definition',([string]$(if ($TaskDefinitionArn) { $TaskDefinitionArn } else { $state.targetTaskDefinition } )),'--region',$Config.awsRegion,'--output','json')
    $startResult = Invoke-BranaAwsWriteCommand -Service 'ECS' -Command 'update-service' -Arguments $updateArgs -Invoker $AwsWriteInvoker
    if ($startResult.ExitCode -ne 0) {
        $state.phase = 'FAILED'
        $state.errors += @($startResult.StdErr)
        Write-BranaDeploymentStateAtomic -Path $statePath -State $state
        return [pscustomobject]@{ Success = $false; ExitCode = 30; Message = 'Deployment start failed.'; Data = $state; Warnings = @(); Errors = @($state.errors) }
    }
    $state.phase = 'DEPLOYMENT_STARTED'
    $state.serviceDeploymentArn = 'aws-managed'
    $state.lastTelemetryAtUtc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
    Write-BranaDeploymentStateAtomic -Path $statePath -State $state

    $telemetry = $signals
    $readiness = Brana.Release.Canary\Test-BranaCanaryDeploymentReadiness -Config $Config -Signals $telemetry
    $state.lastTelemetryAtUtc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
    if (-not $readiness.IsValid) {
        $state.phase = 'ROLLBACK_RECOMMENDED'
        $state.decision = 'rollback-recommended'
        $state.errors = @($readiness.Errors)
        Write-BranaDeploymentStateAtomic -Path $statePath -State $state
        return [pscustomobject]@{ Success = $false; ExitCode = 40; Message = 'Rollback recommended.'; Data = [pscustomobject]@{ State = $state; Telemetry = $telemetry; Readiness = $readiness }; Warnings = @(); Errors = @($readiness.Errors) }
    }

    $state.phase = 'CANARY_BAKE'
    $state.decision = 'continue'
    Write-BranaDeploymentStateAtomic -Path $statePath -State $state
    $state.phase = 'WAITING_FOR_PROMOTION'
    Write-BranaDeploymentStateAtomic -Path $statePath -State $state

    $stabilizationSamples = [Math]::Max(1, [int]$Config.postPromotionStabilizationMinutes)
    $stabilizationTelemetry = @()
    $promotionReadiness = $null
    for ($sample = 1; $sample -le $stabilizationSamples; $sample++) {
        $state.phase = 'VERIFYING_PUBLIC_TARGET'
        $state.lastTelemetryAtUtc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
        Write-BranaDeploymentStateAtomic -Path $statePath -State $state
        $telemetry = if (-not [string]::IsNullOrWhiteSpace($TelemetryPath)) {
            Brana.Release.Telemetry\Get-BranaCanaryTelemetry -Config $Config -TelemetryPath $TelemetryPath
        }
        else {
            Brana.Release.Telemetry\Get-BranaCanaryTelemetry -Config $Config -AwsInvoker $AwsReadInvoker -HttpInvoker $HttpInvoker
        }
        $promotionReadiness = Brana.Release.Canary\Test-BranaCanaryPromotionReadiness -Config $Config -Signals $telemetry
        $stabilizationTelemetry += $telemetry
        if (-not $promotionReadiness.IsValid) {
            $state.phase = 'ROLLBACK_RECOMMENDED'
            $state.decision = 'rollback-recommended'
            $state.errors = @($promotionReadiness.Errors)
            Write-BranaDeploymentStateAtomic -Path $statePath -State $state
            return [pscustomobject]@{ Success = $false; ExitCode = 40; Message = 'Rollback recommended.'; Data = [pscustomobject]@{ State = $state; Telemetry = $telemetry; Readiness = $promotionReadiness; StabilizationTelemetry = $stabilizationTelemetry }; Warnings = @(); Errors = @($promotionReadiness.Errors) }
        }
    }

    $state.phase = 'POST_PROMOTION_STABILIZATION'
    $state.completedAtUtc = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ss.fffZ')
    $state.phase = 'COMPLETED'
    Write-BranaDeploymentStateAtomic -Path $statePath -State $state
    return [pscustomobject]@{ Success = $true; ExitCode = 0; Message = 'Deployment completed after public target stabilization.'; Data = [pscustomobject]@{ State = $state; Telemetry = $telemetry; Readiness = $promotionReadiness; StabilizationTelemetry = $stabilizationTelemetry }; Warnings = @(); Errors = @() }
}

function Invoke-BranaRollbackMode {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$RepositoryPath,
        [Parameter(Mandatory)][string]$Environment,
        [Parameter(Mandatory)][object]$Config,
        [Parameter(Mandatory)][string]$StatePath,
        [string]$TelemetryPath,
        [switch]$ConfirmRollback,
        [string]$ConfirmationToken,
        [switch]$DryRun,
        [scriptblock]$AwsReadInvoker = $null,
        [scriptblock]$AwsWriteInvoker = $null,
        [scriptblock]$HttpInvoker = $null
    )

    $state = Read-BranaDeploymentState -Path $StatePath
    if ($null -eq $state) {
        return [pscustomobject]@{ Success = $false; ExitCode = 60; Message = 'State file not found.'; Data = $null; Warnings = @(); Errors = @('State file not found.') }
    }
    if ($DryRun -or -not $ConfirmRollback) {
        return [pscustomobject]@{ Success = $false; ExitCode = 20; Message = 'Rollback confirmation required.'; Data = $state; Warnings = @(); Errors = @('Rollback confirmation required.') }
    }
    $rollbackTaskDefinition = [string]$Config.rollbackTaskDefinition
    $result = Invoke-BranaAwsWriteCommand -Service 'ECS' -Command 'update-service' -Arguments @('--cluster',$Config.ecsCluster,'--service',$Config.ecsService,'--task-definition',$rollbackTaskDefinition,'--region',$Config.awsRegion,'--output','json') -Invoker $AwsWriteInvoker
    if ($result.ExitCode -ne 0) {
        return [pscustomobject]@{ Success = $false; ExitCode = 30; Message = 'Rollback failed.'; Data = [pscustomobject]@{ State = $state; AwsResult = $result }; Warnings = @(); Errors = @($result.StdErr) }
    }
    $postTelemetry = if (-not [string]::IsNullOrWhiteSpace($TelemetryPath)) {
        Brana.Release.Telemetry\Get-BranaCanaryTelemetry -Config $Config -TelemetryPath $TelemetryPath
    }
    else {
        Brana.Release.Telemetry\Get-BranaCanaryTelemetry -Config $Config -AwsInvoker $AwsReadInvoker -HttpInvoker $HttpInvoker
    }
    return [pscustomobject]@{ Success = $true; ExitCode = 50; Message = 'Rollback completed.'; Data = [pscustomobject]@{ State = $state; AwsResult = $result; Telemetry = $postTelemetry }; Warnings = @(); Errors = @() }
}

function Invoke-BranaResumeMode {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$StatePath,
        [Parameter(Mandatory)][object]$Config,
        [string]$ReleaseId,
        [string]$TelemetryPath,
        [scriptblock]$AwsReadInvoker = $null,
        [scriptblock]$HttpInvoker = $null
    )

    $state = Read-BranaDeploymentState -Path $StatePath
    if ($null -eq $state) {
        return [pscustomobject]@{ Success = $false; ExitCode = 60; Message = 'State file not found.'; Data = $null; Warnings = @(); Errors = @('State file not found.') }
    }
    if ($state.phase -in @('FAILED','UNKNOWN')) {
        return [pscustomobject]@{ Success = $false; ExitCode = 60; Message = 'Ambiguous state.'; Data = $state; Warnings = @(); Errors = @('Ambiguous state.') }
    }
    $telemetry = if (-not [string]::IsNullOrWhiteSpace($TelemetryPath)) {
        Brana.Release.Telemetry\Get-BranaCanaryTelemetry -Config $Config -TelemetryPath $TelemetryPath
    }
    else {
        Brana.Release.Telemetry\Get-BranaCanaryTelemetry -Config $Config -AwsInvoker $AwsReadInvoker -HttpInvoker $HttpInvoker
    }
    $readiness = Brana.Release.Canary\Test-BranaCanaryDeploymentReadiness -Config $Config -Signals $telemetry
    if (-not $readiness.IsValid) {
        return [pscustomobject]@{ Success = $false; ExitCode = 40; Message = 'Resume blocked.'; Data = [pscustomobject]@{ State = $state; Telemetry = $telemetry; Readiness = $readiness }; Warnings = @(); Errors = @($readiness.Errors) }
    }
    return [pscustomobject]@{ Success = $true; ExitCode = 0; Message = 'Resume completed.'; Data = [pscustomobject]@{ State = $state; Telemetry = $telemetry; Readiness = $readiness }; Warnings = @(); Errors = @() }
}

Export-ModuleMember -Function Get-BranaDeploymentStateRoot,Get-BranaDeploymentStatePath,Get-BranaDeploymentWriteWhitelist,Test-BranaAwsWriteCommandAllowed,Invoke-BranaAwsWriteCommand,Test-BranaDeploymentTaskDefinitionSemanticEquivalence,Read-BranaDeploymentState,Write-BranaDeploymentStateAtomic,New-BranaDeploymentState,Test-BranaDeploymentConfirmation,Invoke-BranaDeploymentMode,Invoke-BranaRollbackMode,Invoke-BranaResumeMode
