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

    $fullArguments = @($Service.Trim().ToLowerInvariant(), $Command.Trim()) + @($Arguments)
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
                $rawStatus = & curl.exe -k -s -L --max-redirs 5 -o NUL -w '%{http_code}' $ProbeUri
                $status = $null
                if (-not [string]::IsNullOrWhiteSpace([string]$rawStatus)) {
                    try { $status = [int]$rawStatus } catch { $status = $null }
                }
                return [pscustomobject]@{
                    StatusCode = $status
                    DurationMs = [int]$sw.ElapsedMilliseconds
                    Error = $null
                }
            }
            catch {
                return [pscustomobject]@{
                    StatusCode = $null
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
        Tasks = [ordered]@{}
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

function Get-BranaTelemetryPropertyValue {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [object]$InputObject,
        [Parameter(Mandatory)]
        [string]$Name
    )

    if ($null -eq $InputObject) {
        return $null
    }
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
        $fixture = ConvertFrom-BranaTelemetryFixture -Path $TelemetryPath
        if ($fixture.PSObject.Properties['Targets']) {
            $fixtureTargets = Get-BranaTelemetryValue -InputObject $fixture -Name 'Targets'
            $fixturePublicTargets = @((Get-BranaTelemetryValue -InputObject $fixtureTargets -Name 'PublicTargets'))
            $fixtureRevision = [string](Get-BranaTelemetryValue -InputObject $fixtureTargets -Name 'PublicTargetRevision')
            $fixtureSource = [string](Get-BranaTelemetryValue -InputObject $fixtureTargets -Name 'PublicTargetRevisionSource')
            $fixtureConfirmed = Get-BranaTelemetryValue -InputObject $fixtureTargets -Name 'PublicTargetRevisionConfirmed'
            $fixtureInferred = Get-BranaTelemetryValue -InputObject $fixtureTargets -Name 'PublicTargetRevisionInferred'
            if ($fixturePublicTargets.Count -gt 0) {
                if ([string]::IsNullOrWhiteSpace($fixtureRevision)) {
                    $fixtureRevision = [string]$fixturePublicTargets[0].TaskDefinitionArn
                }
                if ([string]::IsNullOrWhiteSpace($fixtureSource)) {
                    $fixtureSource = 'target-task-ip'
                }
                if ($null -eq $fixtureConfirmed) {
                    $fixtureConfirmed = $true
                }
                if ($null -eq $fixtureInferred) {
                    $fixtureInferred = $false
                }
            }
            elseif ([string]::IsNullOrWhiteSpace($fixtureSource)) {
                if (-not [string]::IsNullOrWhiteSpace($fixtureRevision)) {
                    $fixtureSource = 'service-active-task-definition'
                    if ($null -eq $fixtureConfirmed) {
                        $fixtureConfirmed = $false
                    }
                    if ($null -eq $fixtureInferred) {
                        $fixtureInferred = $true
                    }
                }
                else {
                    $fixtureSource = 'unavailable'
                    if ($null -eq $fixtureConfirmed) {
                        $fixtureConfirmed = $false
                    }
                    if ($null -eq $fixtureInferred) {
                        $fixtureInferred = $false
                    }
                }
            }
            $fixtureTargets | Add-Member -NotePropertyName PublicTargetRevision -NotePropertyValue $fixtureRevision -Force
            $fixtureTargets | Add-Member -NotePropertyName PublicTargetRevisionSource -NotePropertyValue $fixtureSource -Force
            $fixtureTargets | Add-Member -NotePropertyName PublicTargetRevisionConfirmed -NotePropertyValue ([bool]$fixtureConfirmed) -Force
            $fixtureTargets | Add-Member -NotePropertyName PublicTargetRevisionInferred -NotePropertyValue ([bool]$fixtureInferred) -Force
        }
        $fixture | Add-Member -NotePropertyName publicTargetRevision -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $fixture.Targets -Name 'PublicTargetRevision')) -Force
        $fixture | Add-Member -NotePropertyName publicTargetRevisionSource -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $fixture.Targets -Name 'PublicTargetRevisionSource')) -Force
        $fixture | Add-Member -NotePropertyName publicTargetRevisionConfirmed -NotePropertyValue ([bool](Get-BranaTelemetryValue -InputObject $fixture.Targets -Name 'PublicTargetRevisionConfirmed')) -Force
        $fixture | Add-Member -NotePropertyName publicTargetRevisionInferred -NotePropertyValue ([bool](Get-BranaTelemetryValue -InputObject $fixture.Targets -Name 'PublicTargetRevisionInferred')) -Force
        $fixture | Add-Member -NotePropertyName activeTaskDefinition -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $fixture.Service -Name 'TaskDefinition')) -Force
        return $fixture
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
        $serviceTaskDefinition = if ($service.PSObject.Properties['taskDefinition'] -and -not [string]::IsNullOrWhiteSpace([string]$service.taskDefinition)) {
            [string]$service.taskDefinition
        }
        elseif ($service.PSObject.Properties['taskDefinitionArn'] -and -not [string]::IsNullOrWhiteSpace([string]$service.taskDefinitionArn)) {
            [string]$service.taskDefinitionArn
        }
        else {
            [string]$currentDeployment.taskDefinition
        }
        $telemetry.Service = [ordered]@{
            AccountId = [string]$telemetry.AwsIdentity.AccountId
            Region = [string]$Config.awsRegion
            Cluster = [string]$Config.ecsCluster
            ServiceName = [string]$Config.ecsService
            ServiceArn = [string]$service.serviceArn
            ServiceType = [string]$Config.serviceType
            Strategy = [string]$Config.deploymentStrategy
            TaskDefinition = $serviceTaskDefinition
            DesiredCount = [int]$service.desiredCount
            RunningCount = [int]$service.runningCount
            PendingCount = [int]$service.pendingCount
            RolloutState = [string]$currentDeployment.rolloutState
            ActiveDeploymentCount = @($service.deployments).Count
            ConcurrentDeployment = (@($service.deployments).Count -gt 1)
            CurrentServiceDeploymentArn = [string]$currentDeployment.id
            CurrentServiceRevisionArn = $serviceTaskDefinition
            PreviousStableServiceRevisionArn = [string]$Config.rollbackTaskDefinition
            LifecycleStage = 'OBSERVING'
            RollbackAvailable = [bool]$Config.rollbackTaskDefinition
            CircuitBreakerEnabled = [bool]$service.deploymentConfiguration.deploymentCircuitBreaker.enable
            AlarmsEnabled = $true
        }
        $telemetry.Deployment = [ordered]@{
            CurrentDeploymentId = [string]$currentDeployment.id
            CurrentTaskDefinition = $serviceTaskDefinition
            CurrentRolloutState = [string]$currentDeployment.rolloutState
            ConcurrentDeployment = (@($service.deployments).Count -gt 1)
        }
        $telemetry.Revisions = [ordered]@{
            Current = $serviceTaskDefinition
            PreviousStable = [string]$Config.rollbackTaskDefinition
        }
        $telemetry.Tasks = [ordered]@{
            Current = @()
            Previous = @()
        }
    }
    catch {
        $errors.Add(('service telemetry unavailable: {0}' -f $_.Exception.Message))
    }

    try {
        $listTasksResult = Invoke-BranaTelemetryReadCommand -Config $Config -Service 'ECS' -Command 'list-tasks' -Arguments @('--cluster', $Config.ecsCluster, '--service-name', $Config.ecsService, '--region', $Config.awsRegion, '--output', 'json') -AwsInvoker $AwsInvoker
        if ($listTasksResult.ExitCode -ne 0) { throw "Unable to list ECS tasks: $($listTasksResult.StdErr)" }
        $taskDoc = ConvertFrom-BranaJsonSafe -Json $listTasksResult.StdOut
        $taskArns = @($taskDoc.taskArns)
        $currentTasks = @()
        $previousTasks = @()
        $tasksByPrivateIp = @{}
        if ($taskArns.Count -gt 0) {
            $describeTasksResult = Invoke-BranaTelemetryReadCommand -Config $Config -Service 'ECS' -Command 'describe-tasks' -Arguments (@('--cluster', $Config.ecsCluster, '--tasks') + $taskArns + @('--region', $Config.awsRegion, '--output', 'json')) -AwsInvoker $AwsInvoker
            if ($describeTasksResult.ExitCode -ne 0) { throw "Unable to describe ECS tasks: $($describeTasksResult.StdErr)" }
            $taskDetails = ConvertFrom-BranaJsonSafe -Json $describeTasksResult.StdOut
            foreach ($task in @($taskDetails.tasks)) {
                $revision = [string]$task.taskDefinitionArn
                $privateIp = $null
                foreach ($attachment in @($task.attachments)) {
                    foreach ($detail in @($attachment.details)) {
                        if ([string]$detail.name -eq 'privateIPv4Address' -and -not [string]::IsNullOrWhiteSpace([string]$detail.value)) {
                            $privateIp = [string]$detail.value
                            break
                        }
                    }
                    if (-not [string]::IsNullOrWhiteSpace([string]$privateIp)) {
                        break
                    }
                }
                $entry = [ordered]@{
                    TaskArn = [string]$task.taskArn
                    TaskDefinitionArn = $revision
                    LastStatus = [string]$task.lastStatus
                    DesiredStatus = [string]$task.desiredStatus
                    HealthStatus = [string]$task.healthStatus
                    StartedAt = [string]$task.startedAt
                    StopCode = [string](Get-BranaTelemetryPropertyValue -InputObject $task -Name 'stopCode')
                    StoppedReason = [string](Get-BranaTelemetryPropertyValue -InputObject $task -Name 'stoppedReason')
                    StoppedAt = [string](Get-BranaTelemetryPropertyValue -InputObject $task -Name 'stoppedAt')
                    AvailabilityZone = [string]$task.availabilityZone
                    Containers = @($task.containers | ForEach-Object {
                        [ordered]@{
                            Name = [string]$_.name
                            LastStatus = [string]$_.lastStatus
                            HealthStatus = [string]$_.healthStatus
                            ExitCode = Get-BranaTelemetryPropertyValue -InputObject $_ -Name 'exitCode'
                            Reason = [string](Get-BranaTelemetryPropertyValue -InputObject $_ -Name 'reason')
                            Image = [string]$_.image
                        }
                    })
                    Attachments = @($task.attachments)
                }
                if (-not [string]::IsNullOrWhiteSpace([string]$privateIp)) {
                    $entry.PrivateIp = $privateIp
                    $tasksByPrivateIp[$privateIp] = $entry
                }
                if ($revision -like "*$($Config.rollbackTaskDefinition)") { $previousTasks += $entry } else { $currentTasks += $entry }
            }
        }
        $telemetry.Tasks = [ordered]@{
            Current = $currentTasks
            Previous = $previousTasks
            CurrentCount = $currentTasks.Count
            PreviousCount = $previousTasks.Count
            ByPrivateIp = $tasksByPrivateIp
        }
    }
    catch {
        $errors.Add(('task telemetry unavailable: {0}' -f $_.Exception.Message))
    }

    try {
        $tgResult = Invoke-BranaTelemetryReadCommand -Config $Config -Service 'ELBV2' -Command 'describe-target-health' -Arguments @('--target-group-arn', $Config.productionTargetGroupArn, '--region', $Config.awsRegion, '--output', 'json') -AwsInvoker $AwsInvoker
        if ($tgResult.ExitCode -ne 0) { throw "Unable to read target health: $($tgResult.StdErr)" }
        $tgDoc = ConvertFrom-BranaJsonSafe -Json $tgResult.StdOut
        $targets = @($tgDoc.TargetHealthDescriptions)
        $healthy = @($targets | Where-Object { $_.TargetHealth.State -eq 'healthy' }).Count
        $unhealthy = @($targets | Where-Object { $_.TargetHealth.State -ne 'healthy' }).Count
        $publicTargets = @()
        $publicTargetRevision = $null
        $publicTargetRevisionSource = 'unavailable'
        $publicTargetRevisionConfirmed = $false
        $publicTargetRevisionInferred = $false
        $tasksByPrivateIp = @{}
        if ($telemetry.Tasks -and $telemetry.Tasks.PSObject.Properties['ByPrivateIp']) {
            $candidateTasksByPrivateIp = $telemetry.Tasks.ByPrivateIp
            if ($candidateTasksByPrivateIp -is [System.Collections.IDictionary]) {
                $tasksByPrivateIp = $candidateTasksByPrivateIp
            }
        }
        $reasons = @(
            $targets | ForEach-Object {
                if ($_.TargetHealth.PSObject.Properties['Reason'] -and -not [string]::IsNullOrWhiteSpace([string]$_.TargetHealth.Reason)) {
                    $_.TargetHealth.Reason
                }
                elseif ($_.TargetHealth.PSObject.Properties['Description'] -and -not [string]::IsNullOrWhiteSpace([string]$_.TargetHealth.Description)) {
                    $_.TargetHealth.Description
                }
                else {
                    $null
                }
            }
        )
        foreach ($target in @($targets)) {
            $privateIp = [string]$target.Target.Id
            $taskMatch = $null
            if ($tasksByPrivateIp.Contains($privateIp)) {
                $taskMatch = $tasksByPrivateIp[$privateIp]
            }
            if ($null -eq $publicTargetRevision -and $null -ne $taskMatch) {
                $publicTargetRevision = [string]$taskMatch.TaskDefinitionArn
                $publicTargetRevisionSource = 'target-task-ip'
                $publicTargetRevisionConfirmed = $true
                $publicTargetRevisionInferred = $false
            }
            $publicTargets += [ordered]@{
                TargetGroup = [string]$Config.productionTargetGroupArn
                Ip = $privateIp
                Port = [int]$target.Target.Port
                AvailabilityZone = [string]$target.Target.AvailabilityZone
                HealthState = [string]$target.TargetHealth.State
                Reason = if ($target.TargetHealth.PSObject.Properties['Reason']) { [string]$target.TargetHealth.Reason } else { $null }
                Description = if ($target.TargetHealth.PSObject.Properties['Description']) { [string]$target.TargetHealth.Description } else { $null }
                TaskArn = if ($null -ne $taskMatch) { [string]$taskMatch.TaskArn } else { $null }
                TaskDefinitionArn = if ($null -ne $taskMatch) { [string]$taskMatch.TaskDefinitionArn } else { $null }
            }
        }
        if ([string]::IsNullOrWhiteSpace([string]$publicTargetRevision)) {
            $publicTargetRevision = [string]$telemetry.Service.TaskDefinition
            $publicTargetRevisionSource = 'service-active-task-definition'
            $publicTargetRevisionConfirmed = $false
            $publicTargetRevisionInferred = $true
        }
        $telemetry.Targets = [ordered]@{
            PublicTargetGroupArn = [string]$Config.productionTargetGroupArn
            AlternateTargetGroupArn = $null
            PublicHealthyHostCount = [int]$healthy
            PublicUnhealthyHostCount = [int]$unhealthy
            AlternateHealthyHostCount = $null
            AlternateUnhealthyHostCount = $null
            States = @($targets | ForEach-Object { $_.TargetHealth.State })
            Reasons = $reasons
            TargetGroupWithoutTargets = ($targets.Count -eq 0)
            TargetGroupNotFound = $false
            PublicTargets = @($publicTargets)
            AlternateTargets = @()
            PublicTargetRevision = $publicTargetRevision
            PublicTargetRevisionSource = $publicTargetRevisionSource
            PublicTargetRevisionConfirmed = [bool]$publicTargetRevisionConfirmed
            PublicTargetRevisionInferred = [bool]$publicTargetRevisionInferred
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
            DatapointStatus = 'complete'
            Source = 'cloudwatch'
            Elb5xxSparseCounter = $true
            Target5xxSparseCounter = $true
        }
        $telemetry.Alarms = [ordered]@{
            Relevant = @()
        }
        if ($metricDoc.Datapoints) {
            $telemetry.Metrics.HTTPCode_ELB_5XX_Count = [int]($metricDoc.Datapoints | Select-Object -First 1).Sum
        }
        else {
            $telemetry.Metrics.HTTPCode_ELB_5XX_Count = 0
        }
        $target5xxResult = Invoke-BranaTelemetryReadCommand -Config $Config -Service 'CloudWatch' -Command 'get-metric-statistics' -Arguments @('--namespace','AWS/ApplicationELB','--metric-name','HTTPCode_Target_5XX_Count','--statistics','Sum','--period',$periodSeconds,'--start-time',$startTime.ToString('o'),'--end-time',$endTime.ToString('o'),'--region',$Config.awsRegion,'--output','json') -AwsInvoker $AwsInvoker
        if ($target5xxResult.ExitCode -eq 0) {
            $target5xxDoc = ConvertFrom-BranaJsonSafe -Json $target5xxResult.StdOut
            if ($target5xxDoc.Datapoints) {
                $telemetry.Metrics.HTTPCode_Target_5XX_Count = [int]($target5xxDoc.Datapoints | Select-Object -First 1).Sum
            }
            else {
                $telemetry.Metrics.HTTPCode_Target_5XX_Count = 0
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
    $result = [pscustomobject]$telemetry
    $result | Add-Member -NotePropertyName serviceStable -NotePropertyValue (([string](Get-BranaTelemetryValue -InputObject $result.Service -Name 'RolloutState')) -in @('COMPLETED','PRIMARY_TRAFFIC','OBSERVING')) -Force
    $result | Add-Member -NotePropertyName deploymentConcurrent -NotePropertyValue ([bool](Get-BranaTelemetryValue -InputObject $result.Service -Name 'ConcurrentDeployment')) -Force
    $result | Add-Member -NotePropertyName publicTargetHealthy -NotePropertyValue (([int](Get-BranaTelemetryValue -InputObject $result.Targets -Name 'PublicHealthyHostCount') -ge 1) -and (-not $result.Http.Observed503)) -Force
    $alternateTargetGroupArn = Get-BranaTelemetryValue -InputObject $result.Targets -Name 'AlternateTargetGroupArn'
    $alternateHealthyHostCount = Get-BranaTelemetryValue -InputObject $result.Targets -Name 'AlternateHealthyHostCount'
    $result | Add-Member -NotePropertyName alternateTargetHealthy -NotePropertyValue ($(if ($null -eq $alternateTargetGroupArn -or [string]::IsNullOrWhiteSpace([string]$alternateTargetGroupArn)) { $null } else { [int]$alternateHealthyHostCount -ge 1 })) -Force
    $result | Add-Member -NotePropertyName rollbackServiceRevision -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $result.Revisions -Name 'PreviousStable')) -Force
    $result | Add-Member -NotePropertyName healthyHostCount -NotePropertyValue ([int](Get-BranaTelemetryValue -InputObject $result.Targets -Name 'PublicHealthyHostCount')) -Force
    $result | Add-Member -NotePropertyName elb5xxCount -NotePropertyValue ([int](Get-BranaTelemetryValue -InputObject $result.Metrics -Name 'HTTPCode_ELB_5XX_Count')) -Force
    $result | Add-Member -NotePropertyName target5xxCount -NotePropertyValue ([int](Get-BranaTelemetryValue -InputObject $result.Metrics -Name 'HTTPCode_Target_5XX_Count')) -Force
    $result | Add-Member -NotePropertyName observed503Count -NotePropertyValue ($(if ($result.Http.Observed503) { 1 } else { 0 })) -Force
    $result | Add-Member -NotePropertyName lifecycleStage -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $result.Service -Name 'LifecycleStage')) -Force
    $result | Add-Member -NotePropertyName allowed503 -NotePropertyValue 0 -Force
    $currentTasks = Get-BranaTelemetryValue -InputObject $result.Tasks -Name 'Current'
    $previousTasks = Get-BranaTelemetryValue -InputObject $result.Tasks -Name 'Previous'
    $publicTargets = Get-BranaTelemetryValue -InputObject $result.Targets -Name 'PublicTargets'
    $alternateTargets = Get-BranaTelemetryValue -InputObject $result.Targets -Name 'AlternateTargets'
    $result | Add-Member -NotePropertyName currentTasks -NotePropertyValue @($currentTasks) -Force
    $result | Add-Member -NotePropertyName previousTasks -NotePropertyValue @($previousTasks) -Force
    $result | Add-Member -NotePropertyName publicTargets -NotePropertyValue @($publicTargets) -Force
    $result | Add-Member -NotePropertyName alternateTargets -NotePropertyValue @($alternateTargets) -Force
    $result | Add-Member -NotePropertyName publicTargetGroupArn -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $result.Targets -Name 'PublicTargetGroupArn')) -Force
    $result | Add-Member -NotePropertyName alternateTargetGroupArn -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $result.Targets -Name 'AlternateTargetGroupArn')) -Force
    $result | Add-Member -NotePropertyName publicTargetRevision -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $result.Targets -Name 'PublicTargetRevision')) -Force
    $result | Add-Member -NotePropertyName publicTargetRevisionSource -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $result.Targets -Name 'PublicTargetRevisionSource')) -Force
    $result | Add-Member -NotePropertyName publicTargetRevisionConfirmed -NotePropertyValue ([bool](Get-BranaTelemetryValue -InputObject $result.Targets -Name 'PublicTargetRevisionConfirmed')) -Force
    $result | Add-Member -NotePropertyName publicTargetRevisionInferred -NotePropertyValue ([bool](Get-BranaTelemetryValue -InputObject $result.Targets -Name 'PublicTargetRevisionInferred')) -Force
    $result | Add-Member -NotePropertyName activeTaskDefinition -NotePropertyValue ([string](Get-BranaTelemetryValue -InputObject $result.Service -Name 'TaskDefinition')) -Force
    $result | Add-Member -NotePropertyName unHealthyHostCount -NotePropertyValue ([int](Get-BranaTelemetryValue -InputObject $result.Targets -Name 'PublicUnhealthyHostCount')) -Force
    $result | Add-Member -NotePropertyName healthStatusCode -NotePropertyValue ([int](Get-BranaTelemetryValue -InputObject $result.Http -Name 'HealthStatusCode')) -Force
    $result | Add-Member -NotePropertyName appStatusCode -NotePropertyValue ([int](Get-BranaTelemetryValue -InputObject $result.Http -Name 'AppStatusCode')) -Force
    $result | Add-Member -NotePropertyName publicTargetHealthy -NotePropertyValue (([int](Get-BranaTelemetryValue -InputObject $result.Targets -Name 'PublicHealthyHostCount') -ge 1) -and (@($result.publicTargets).Count -ge 1) -and (-not $result.Http.Observed503)) -Force
    $result | Add-Member -NotePropertyName publicTargetEmpty -NotePropertyValue (@($result.publicTargets).Count -eq 0) -Force

    return $result
}

Export-ModuleMember -Function Get-BranaAwsReadWhitelist,Test-BranaAwsReadCommandAllowed,Invoke-BranaAwsReadCommand,Invoke-BranaTelemetryReadCommand,Invoke-BranaHttpProbe,Get-BranaCanaryTelemetry,ConvertFrom-BranaTelemetryFixture
