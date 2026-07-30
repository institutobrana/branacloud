Set-StrictMode -Version Latest

function Get-BranaCanaryPropertyValue {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [object]$InputObject,
        [Parameter(Mandatory)]
        [string]$Name
    )

    $property = $InputObject.PSObject.Properties[$Name]
    if ($null -eq $property) {
        return $null
    }
    return $property.Value
}

function Get-BranaCanaryLifecycleStages {
    [CmdletBinding()]
    param()

    return @(
        'PREFLIGHT'
        'BASELINE'
        'DEPLOYMENT_REQUESTED'
        'CANARY_TRAFFIC'
        'BAKE'
        'PROMOTING'
        'PRIMARY_TRAFFIC'
        'OBSERVING'
        'COMPLETED'
        'ROLLING_BACK'
        'FAILED'
    )
}

function Get-BranaCanaryDeploymentPlan {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [object]$Config
    )

    $baselineMinutes = [int](Get-BranaCanaryPropertyValue -InputObject $Config -Name 'baselineMinutes')
    $observationMinutes = [int](Get-BranaCanaryPropertyValue -InputObject $Config -Name 'observationMinutes')
    $canaryPercent = [int](Get-BranaCanaryPropertyValue -InputObject $Config -Name 'canaryPercent')
    $bakeTimeInMinutes = [int](Get-BranaCanaryPropertyValue -InputObject $Config -Name 'bakeTimeInMinutes')
    $rollbackTaskDefinition = [string](Get-BranaCanaryPropertyValue -InputObject $Config -Name 'rollbackTaskDefinition')
    $publicHealthUrl = [string](Get-BranaCanaryPropertyValue -InputObject $Config -Name 'publicHealthUrl')
    $publicAppUrl = [string](Get-BranaCanaryPropertyValue -InputObject $Config -Name 'publicAppUrl')

    return [pscustomobject]@{
        DeploymentStrategy = 'CANARY'
        ServiceType = [string](Get-BranaCanaryPropertyValue -InputObject $Config -Name 'serviceType')
        CurrentTaskDefinition = $rollbackTaskDefinition
        BaselineMinutes = $baselineMinutes
        ObservationMinutes = $observationMinutes
        CanaryPercent = $canaryPercent
        BakeTimeInMinutes = $bakeTimeInMinutes
        PublicHealthUrl = $publicHealthUrl
        PublicAppUrl = $publicAppUrl
        RequiredHealthyHosts = 1
        AllowedElb5xx = 0
        AllowedTarget5xx = 0
        Allowed503 = 0
        RollbackTaskDefinition = $rollbackTaskDefinition
        LifecycleStages = @(Get-BranaCanaryLifecycleStages)
        RollbackTriggers = @(
            '503 during observation'
            'HealthyHostCount below 1'
            'ELB 5xx above zero'
            'target unhealthy'
            'deployment concurrent'
            'unknown lifecycle stage'
        )
        MonitorCommands = @(
            ('aws ecs describe-services --cluster {0} --services {1} --region {2}' -f $Config.ecsCluster, $Config.ecsService, $Config.awsRegion),
            ('aws ecs list-service-deployments --service {0} --region {1}' -f $Config.ecsService, $Config.awsRegion),
            ('curl.exe -s -o NUL -w "%{{http_code}}" {0}' -f $publicHealthUrl),
            ('curl.exe -s -o NUL -w "%{{http_code}}" {0}' -f $publicAppUrl)
        )
    }
}

function Test-BranaCanaryDeploymentReadiness {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [object]$Config,
        [AllowNull()]
        [object]$Signals
    )

    $errors = New-Object System.Collections.Generic.List[string]
    if ([string](Get-BranaCanaryPropertyValue -InputObject $Config -Name 'serviceType') -ne 'EXPRESS_GATEWAY') {
        $errors.Add('serviceType must be EXPRESS_GATEWAY for canary')
    }
    if ([string](Get-BranaCanaryPropertyValue -InputObject $Config -Name 'deploymentStrategy') -ne 'CANARY') {
        $errors.Add('deploymentStrategy must be CANARY')
    }

    $plan = Get-BranaCanaryDeploymentPlan -Config $Config
    if ($plan.BaselineMinutes -lt 15) { $errors.Add('baselineMinutes must be at least 15 for canary') }
    if ($plan.ObservationMinutes -lt 15) { $errors.Add('observationMinutes must be at least 15 for canary') }
    if ($plan.CanaryPercent -lt 1 -or $plan.CanaryPercent -gt 100) { $errors.Add('canaryPercent must be between 1 and 100 for canary') }
    if ($plan.BakeTimeInMinutes -lt 1) { $errors.Add('bakeTimeInMinutes must be positive for canary') }
    if ($plan.Allowed503 -ne 0) { $errors.Add('allowed503 must be zero for canary') }

    if ($null -eq $Signals) {
        $errors.Add('canary telemetry signals are required')
    }
    else {
        $lifecycleStage = [string](Get-BranaCanaryPropertyValue -InputObject $Signals -Name 'lifecycleStage')
        $serviceStable = [bool](Get-BranaCanaryPropertyValue -InputObject $Signals -Name 'serviceStable')
        $deploymentConcurrent = [bool](Get-BranaCanaryPropertyValue -InputObject $Signals -Name 'deploymentConcurrent')
        $publicTargetHealthy = [bool](Get-BranaCanaryPropertyValue -InputObject $Signals -Name 'publicTargetHealthy')
        $alternateTargetHealthy = [bool](Get-BranaCanaryPropertyValue -InputObject $Signals -Name 'alternateTargetHealthy')
        $rollbackServiceRevision = [string](Get-BranaCanaryPropertyValue -InputObject $Signals -Name 'rollbackServiceRevision')
        $healthyHostCount = [int](Get-BranaCanaryPropertyValue -InputObject $Signals -Name 'healthyHostCount')
        $elb5xxCount = [int](Get-BranaCanaryPropertyValue -InputObject $Signals -Name 'elb5xxCount')
        $target5xxCount = [int](Get-BranaCanaryPropertyValue -InputObject $Signals -Name 'target5xxCount')
        $observed503Count = [int](Get-BranaCanaryPropertyValue -InputObject $Signals -Name 'observed503Count')

        if (-not $serviceStable) { $errors.Add('service must be stable before canary') }
        if ($deploymentConcurrent) { $errors.Add('deployment concurrent blocks canary') }
        if ([string]::IsNullOrWhiteSpace($rollbackServiceRevision)) { $errors.Add('rollback service revision is required') }
        if (-not $publicTargetHealthy) { $errors.Add('public target must be healthy') }
        if ($alternateTargetHealthy -eq $false) { $errors.Add('alternate target must be identified and healthy') }
        if ($healthyHostCount -lt 1) { $errors.Add('HealthyHostCount below 1 blocks canary') }
        if ($elb5xxCount -gt 0) { $errors.Add('ELB 5xx above zero blocks canary') }
        if ($target5xxCount -gt 0) { $errors.Add('target 5xx above zero blocks canary') }
        if ($observed503Count -gt 0) { $errors.Add('503 during observation triggers rollback') }
        if ($lifecycleStage -notin @(Get-BranaCanaryLifecycleStages)) { $errors.Add('lifecycle stage unknown') }
    }

    return [pscustomobject]@{
        IsValid = ($errors.Count -eq 0)
        Errors = @($errors)
        Plan = $plan
        Signals = $Signals
    }
}

Export-ModuleMember -Function Get-BranaCanaryLifecycleStages,Get-BranaCanaryDeploymentPlan,Test-BranaCanaryDeploymentReadiness
