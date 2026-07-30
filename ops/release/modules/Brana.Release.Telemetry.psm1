Set-StrictMode -Version Latest

$script:BranaAwsReadWhitelist = [ordered]@{
    ECS = @('describe-services','list-service-deployments','describe-service-deployments','describe-service-revisions','list-tasks','describe-tasks','describe-task-definition')
    ELBV2 = @('describe-rules','describe-target-health','describe-target-groups','describe-target-group-attributes')
    CloudWatch = @('get-metric-data','get-metric-statistics')
    STS = @('get-caller-identity')
}

function Get-BranaAwsReadWhitelist {
    [CmdletBinding()]
    param()

    return $script:BranaAwsReadWhitelist
}

function Test-BranaAwsReadCommandAllowed {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Service,
        [Parameter(Mandatory)][string]$Command
    )

    $serviceName = $Service.Trim()
    $commandName = $Command.Trim()
    if (-not $script:BranaAwsReadWhitelist.Contains($serviceName)) {
        return $false
    }
    return ($script:BranaAwsReadWhitelist[$serviceName] -contains $commandName)
}

function ConvertFrom-BranaJsonSafe {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Json
    )

    return (ConvertFrom-Json -InputObject $Json -ErrorAction Stop)
}

function Invoke-BranaAwsReadCommand {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Service,
        [Parameter(Mandatory)][string]$Command,
        [object[]]$Arguments = @(),
        [int]$TimeoutSeconds = 30,
        [scriptblock]$Invoker = $null
    )

    if (-not (Test-BranaAwsReadCommandAllowed -Service $Service -Command $Command)) {
        throw "AWS read command not allowed: $Service $Command"
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
            $stdout = New-Object System.Text.StringBuilder
            $stderr = New-Object System.Text.StringBuilder
            $process.Start() | Out-Null
            $started = [DateTime]::UtcNow
            $stdout.Append($process.StandardOutput.ReadToEnd()) | Out-Null
            $stderr.Append($process.StandardError.ReadToEnd()) | Out-Null
            $exited = $process.WaitForExit($TimeoutSeconds * 1000)
            $exitCode = if ($exited) { $process.ExitCode } else { -1 }
            if (-not $exited) { try { $process.Kill() } catch { } }
            $duration = [int]([DateTime]::UtcNow - $started).TotalMilliseconds
            $result = [pscustomobject]@{
                ExitCode = $exitCode
                StdOut = $stdout.ToString()
                StdErr = $stderr.ToString()
                TimedOut = -not $exited
                DurationMs = $duration
            }
            $process.Dispose()
            return $result
        }
    }

    $fullArguments = @($Service, $Command) + @($Arguments)
    return & $Invoker $fullArguments $TimeoutSeconds
}

function Invoke-BranaHttpProbe {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Uri,
        [int]$TimeoutSeconds = 10,
        [scriptblock]$Invoker = $null
    )

    if ($null -eq $Invoker) {
        $Invoker = {
            param([string]$ProbeUri, [int]$TimeoutSeconds)
            $sw = [System.Diagnostics.Stopwatch]::StartNew()
            try {
                $response = Invoke-WebRequest -Uri $ProbeUri -Method Head -MaximumRedirection 0 -TimeoutSec $TimeoutSeconds -ErrorAction Stop
                $status = [int]$response.StatusCode
                return [pscustomobject]@{
                    StatusCode = $status
                    DurationMs = [int]$sw.ElapsedMilliseconds
                    Error = $null
                }
            }
            catch {
                $status = $null
                if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
                    try { $status = [int]$_.Exception.Response.StatusCode } catch { }
                }
                return [pscustomobject]@{
                    StatusCode = $status
                    DurationMs = [int]$sw.ElapsedMilliseconds
                    Error = $_.Exception.Message
                }
            }
            finally {
                $sw.Stop()
            }
        }
    }

    return & $Invoker $Uri $TimeoutSeconds
}

function Get-BranaTelemetryTimestampUtc {
    [CmdletBinding()]
    param()

    return ([DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ss.fffZ'))
}

function New-BranaCanaryTelemetryBase {
    [CmdletBinding()]
    param()

    return [ordered]@{
        TimestampUtc = Get-BranaTelemetryTimestampUtc
        Source = 'aws-readonly'
        Complete = $false
        Errors = @()
        Warnings = @()
        AwsIdentity = [ordered]@{}
        Service = [ordered]@{}
        Deployment = [ordered]@{}
        Revisions = [ordered]@{}
        Targets = [ordered]@{}
        Metrics = [ordered]@{}
        Http = [ordered]@{}
        Alarms = [ordered]@{}
    }
}

function ConvertFrom-BranaTelemetryFixture {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$Path
    )

    $content = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    return (ConvertFrom-Json -InputObject $content -ErrorAction Stop)
}

function Get-BranaTelemetryValue {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [object]$InputObject,
        [Parameter(Mandatory)]
        [string]$Name
    )

    if ($InputObject -is [System.Collections.IDictionary]) {
        if ($InputObject.Contains($Name)) {
            return $InputObject[$Name]
        }
        return $null
    }

    $property = $InputObject.PSObject.Properties[$Name]
    if ($null -eq $property) {
        return $null
    }
    return $property.Value
}

function Invoke-BranaTelemetryReadCommand {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][object]$Config,
        [Parameter(Mandatory)][string]$Service,
        [Parameter(Mandatory)][string]$Command,
        [object[]]$Arguments = @(),
        [scriptblock]$AwsInvoker = $null
    )

    $attempts = [Math]::Max(1, [int]$Config.telemetryMaxAttempts)
    $backoffSeconds = [Math]::Max(0, [int]$Config.telemetryBackoffSeconds)
    $lastResult = $null
    for ($attempt = 1; $attempt -le $attempts; $attempt++) {
        $lastResult = Invoke-BranaAwsReadCommand -Service $Service -Command $Command -Arguments $Arguments -TimeoutSeconds ([int]$Config.httpProbeTimeoutSeconds) -Invoker $AwsInvoker
        if ($lastResult.ExitCode -eq 0) {
            return $lastResult
        }
        $stderr = [string]$lastResult.StdErr
        $stdout = [string]$lastResult.StdOut
        if ($attempt -lt $attempts -and (($stderr -match 'Throttl') -or ($stdout -match 'Throttl'))) {
            if ($backoffSeconds -gt 0) {
                Start-Sleep -Seconds $backoffSeconds
            }
            continue
        }
        break
    }
    return $lastResult
}

function Get-BranaCanaryTelemetry {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][object]$Config,
        [string]$TelemetryPath,
        [scriptblock]$AwsInvoker = $null,
        [scriptblock]$HttpInvoker = $null
    )

    if (-not [string]::IsNullOrWhiteSpace($TelemetryPath)) {
        return (ConvertFrom-BranaTelemetryFixture -Path $TelemetryPath)
    }

    $telemetry = New-BranaCanaryTelemetryBase
    $errors = New-Object System.Collections.Generic.List[string]

    try {
        $identityResult = Invoke-BranaTelemetryReadCommand -Config $Config -Service 'STS' -Command 'get-caller-identity' -Arguments @('--output','json') -AwsInvoker $AwsInvoker
        if ($identityResult.ExitCode -ne 0) { throw "Unable to read AWS identity: $($identityResult.StdErr)" }
        $identity = ConvertFrom-BranaJsonSafe -Json $identityResult.StdOut
        $telemetry.AwsIdentity = [ordered]@{
            AccountId = [string]$identity.Account
            Arn = [string]$identity.Arn
            UserId = [string]$identity.UserId
        }
    }
    catch {
        $errors.Add(('aws identity unavailable: {0}' -f $_.Exception.Message))
    }

    try {
        $serviceResult = Invoke-BranaTelemetryReadCommand -Config $Config -Service 'ECS' -Command 'describe-services' -Arguments @('--cluster', $Config.ecsCluster, '--services', $Config.ecsService, '--region', $Config.awsRegion, '--output', 'json') -AwsInvoker $AwsInvoker
        if ($serviceResult.ExitCode -ne 0) { throw "Unable to read ECS service: $($serviceResult.StdErr)" }
        $serviceDoc = ConvertFrom-BranaJsonSafe -Json $serviceResult.StdOut
        $service = @($serviceDoc.services)[0]
        if ($null -eq $service) { throw 'service not found' }
        $currentDeployment = @($service.deployments)[0]
        $telemetry.Service = [ordered]@{
            AccountId = [string]$telemetry.AwsIdentity.AccountId
            Region = [string]$Config.awsRegion
            Cluster = [string]$Config.ecsCluster
            ServiceName = [string]$Config.ecsService
            ServiceArn = [string]$service.serviceArn
            ServiceType = [string]$Config.serviceType
            Strategy = [string]$Config.deploymentStrategy
            TaskDefinition = [string]$service.taskDefinition
            DesiredCount = [int]$service.desiredCount
            RunningCount = [int]$service.runningCount
            PendingCount = [int]$service.pendingCount
            RolloutState = [string]$currentDeployment.rolloutState
            ActiveDeploymentCount = @($service.deployments).Count
            ConcurrentDeployment = (@($service.deployments).Count -gt 1)
            CurrentServiceDeploymentArn = [string]$currentDeployment.id
            CurrentServiceRevisionArn = [string]$currentDeployment.taskDefinition
            PreviousStableServiceRevisionArn = [string]$Config.rollbackTaskDefinition
            LifecycleStage = 'OBSERVING'
            RollbackAvailable = [bool]$Config.rollbackTaskDefinition
            CircuitBreakerEnabled = [bool]$service.deploymentConfiguration.deploymentCircuitBreaker.enable
            AlarmsEnabled = $true
        }
        $telemetry.Deployment = [ordered]@{
            CurrentDeploymentId = [string]$currentDeployment.id
            CurrentTaskDefinition = [string]$service.taskDefinition
            CurrentRolloutState = [string]$currentDeployment.rolloutState
            ConcurrentDeployment = (@($service.deployments).Count -gt 1)
        }
        $telemetry.Revisions = [ordered]@{
            Current = [string]$service.taskDefinition
            PreviousStable = [string]$Config.rollbackTaskDefinition
        }
    }
    catch {
        $errors.Add(('service telemetry unavailable: {0}' -f $_.Exception.Message))
    }

    try {
        $tgResult = Invoke-BranaTelemetryReadCommand -Config $Config -Service 'ELBV2' -Command 'describe-target-health' -Arguments @('--target-group-arn', $Config.productionTargetGroupArn, '--region', $Config.awsRegion, '--output', 'json') -AwsInvoker $AwsInvoker
        if ($tgResult.ExitCode -ne 0) { throw "Unable to read target health: $($tgResult.StdErr)" }
        $tgDoc = ConvertFrom-BranaJsonSafe -Json $tgResult.StdOut
        $targets = @($tgDoc.TargetHealthDescriptions)
        $healthy = @($targets | Where-Object { $_.TargetHealth.State -eq 'healthy' }).Count
        $unhealthy = @($targets | Where-Object { $_.TargetHealth.State -ne 'healthy' }).Count
        $telemetry.Targets = [ordered]@{
            PublicTargetGroupArn = [string]$Config.productionTargetGroupArn
            AlternateTargetGroupArn = $null
            PublicHealthyHostCount = [int]$healthy
            PublicUnhealthyHostCount = [int]$unhealthy
            AlternateHealthyHostCount = $null
            AlternateUnhealthyHostCount = $null
            States = @($targets | ForEach-Object { $_.TargetHealth.State })
            Reasons = @($targets | ForEach-Object { $_.TargetHealth.Reason })
            TargetGroupWithoutTargets = ($targets.Count -eq 0)
            TargetGroupNotFound = $false
        }
        $telemetry.Metrics.HealthyHostCount = [int]$healthy
        $telemetry.Metrics.UnHealthyHostCount = [int]$unhealthy
    }
    catch {
        $errors.Add(('target health unavailable: {0}' -f $_.Exception.Message))
    }

    try {
        $windowMinutes = [int]$Config.telemetryWindowMinutes
        $periodSeconds = [int]$Config.telemetryPeriodSeconds
        $endTime = [DateTime]::UtcNow
        $startTime = $endTime.AddMinutes(-1 * [Math]::Max(1, $windowMinutes))
        $metricData = Invoke-BranaTelemetryReadCommand -Config $Config -Service 'CloudWatch' -Command 'get-metric-statistics' -Arguments @('--namespace','AWS/ApplicationELB','--metric-name','HTTPCode_ELB_5XX_Count','--statistics','Sum','--period',$periodSeconds,'--start-time',$startTime.ToString('o'),'--end-time',$endTime.ToString('o'),'--region',$Config.awsRegion,'--output','json') -AwsInvoker $AwsInvoker
        if ($metricData.ExitCode -ne 0) { throw "Unable to read CloudWatch metrics: $($metricData.StdErr)" }
        $metricDoc = ConvertFrom-BranaJsonSafe -Json $metricData.StdOut
        $telemetry.Metrics = [ordered]@{
            HealthyHostCount = [int]($telemetry.Metrics.HealthyHostCount)
            UnHealthyHostCount = [int]($telemetry.Metrics.UnHealthyHostCount)
            HTTPCode_ELB_5XX_Count = $null
            HTTPCode_Target_5XX_Count = $null
            DatapointStatus = 'incomplete'
            Source = 'cloudwatch'
        }
        $telemetry.Alarms = [ordered]@{
            Relevant = @()
        }
        if ($metricDoc.Datapoints) {
            $telemetry.Metrics.HTTPCode_ELB_5XX_Count = [int]($metricDoc.Datapoints | Select-Object -First 1).Sum
        }
        else {
            $telemetry.Metrics.DatapointStatus = 'missing'
            $errors.Add('métrica obrigatória ausente')
        }
        $target5xxResult = Invoke-BranaTelemetryReadCommand -Config $Config -Service 'CloudWatch' -Command 'get-metric-statistics' -Arguments @('--namespace','AWS/ApplicationELB','--metric-name','HTTPCode_Target_5XX_Count','--statistics','Sum','--period',$periodSeconds,'--start-time',$startTime.ToString('o'),'--end-time',$endTime.ToString('o'),'--region',$Config.awsRegion,'--output','json') -AwsInvoker $AwsInvoker
        if ($target5xxResult.ExitCode -eq 0) {
            $target5xxDoc = ConvertFrom-BranaJsonSafe -Json $target5xxResult.StdOut
            if ($target5xxDoc.Datapoints) {
                $telemetry.Metrics.HTTPCode_Target_5XX_Count = [int]($target5xxDoc.Datapoints | Select-Object -First 1).Sum
            }
            else {
                $telemetry.Metrics.DatapointStatus = 'missing'
                $errors.Add('métrica obrigatória ausente')
            }
        }
        else {
            $errors.Add(('cloudwatch unavailable: {0}' -f $target5xxResult.StdErr))
        }
    }
    catch {
        $errors.Add(('cloudwatch unavailable: {0}' -f $_.Exception.Message))
    }

    try {
        $health = Invoke-BranaHttpProbe -Uri $Config.publicHealthUrl -TimeoutSeconds ([int]$Config.httpProbeTimeoutSeconds) -Invoker $HttpInvoker
        $app = Invoke-BranaHttpProbe -Uri $Config.publicAppUrl -TimeoutSeconds ([int]$Config.httpProbeTimeoutSeconds) -Invoker $HttpInvoker
        $telemetry.Http = [ordered]@{
            HealthStatusCode = $health.StatusCode
            AppStatusCode = $app.StatusCode
            HealthOk = ($health.StatusCode -eq 200)
            AppOk = ($app.StatusCode -eq 200)
            Observed503 = ($health.StatusCode -eq 503 -or $app.StatusCode -eq 503)
            ProbeErrors = @($health.Error, $app.Error | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_) })
        }
        if (-not $telemetry.Http.HealthOk) { $errors.Add('/health probe failed') }
        if (-not $telemetry.Http.AppOk) { $errors.Add('/app probe failed') }
        if ($telemetry.Http.Observed503) { $errors.Add('HTTP 503 observed') }
    }
    catch {
        $errors.Add(('http probe unavailable: {0}' -f $_.Exception.Message))
    }

    $telemetry.Errors = @($errors)
    if ($telemetry.Complete -ne $true) { $telemetry.Complete = ($errors.Count -eq 0) }
    if (-not $telemetry.Service.Contains('ConcurrentDeployment')) { $telemetry.Service.ConcurrentDeployment = $false }
    $telemetry | Add-Member -NotePropertyName serviceStable -NotePropertyValue (([string](Get-BranaTelemetryValue -InputObject $telemetry.Service -Name 'RolloutState')) -in @('COMPLETED','PRIMARY_TRAFFIC','OBSERVING')) -Force
    $telemetry | Add-Member -NotePropertyName deploymentConcurrent -NotePropertyValue ([bool](Get-BranaTelemetryValue -InputObject $telemetry.Service -Name 'ConcurrentDeployment')) -Force
    $telemetry | Add-Member -NotePropertyName publicTargetHealthy -NotePropertyValue (([int](Get-BranaTelemetryValue -InputObject $telemetry.Targets -Name 'PublicHealthyHostCount') -ge 1) -and (-not $telemetry.Http.Observed503)) -Force
    $telemetry | Add-Member -NotePropertyName alternateTargetHealthy -NotePropertyValue ($null -ne (Get-BranaTelemetryValue -InputObject $telemetry.Targets -Name 'AlternateTargetGroupArn') -and [int](Get-BranaTelemetryValue -InputObject $telemetry.Targets -Name 'AlternateHealthyHostCount') -ge 1) -Force
    $telemetry | Add-Member -NotePropertyName rollbackServiceRevision -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $telemetry.Revisions -Name 'PreviousStable')) -Force
    $telemetry | Add-Member -NotePropertyName healthyHostCount -NotePropertyValue ([int](Get-BranaTelemetryValue -InputObject $telemetry.Targets -Name 'PublicHealthyHostCount')) -Force
    $telemetry | Add-Member -NotePropertyName elb5xxCount -NotePropertyValue ([int](Get-BranaTelemetryValue -InputObject $telemetry.Metrics -Name 'HTTPCode_ELB_5XX_Count')) -Force
    $telemetry | Add-Member -NotePropertyName target5xxCount -NotePropertyValue ([int](Get-BranaTelemetryValue -InputObject $telemetry.Metrics -Name 'HTTPCode_Target_5XX_Count')) -Force
    $telemetry | Add-Member -NotePropertyName observed503Count -NotePropertyValue ($(if ($telemetry.Http.Observed503) { 1 } else { 0 })) -Force
    $telemetry | Add-Member -NotePropertyName lifecycleStage -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $telemetry.Service -Name 'LifecycleStage')) -Force
    $telemetry | Add-Member -NotePropertyName allowed503 -NotePropertyValue 0 -Force

    return [pscustomobject]$telemetry
}

Export-ModuleMember -Function Get-BranaAwsReadWhitelist,Test-BranaAwsReadCommandAllowed,Invoke-BranaAwsReadCommand,Invoke-BranaTelemetryReadCommand,Invoke-BranaHttpProbe,Get-BranaCanaryTelemetry,ConvertFrom-BranaTelemetryFixture
