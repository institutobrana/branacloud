Import-Module "$PSScriptRoot\..\modules\Brana.Release.Common.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Config.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Canary.psm1" -Force

Describe 'Brana.Release.Canary' {
    It 'builds a canary plan from hml configuration' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $plan = Get-BranaCanaryDeploymentPlan -Config $config
        $plan.DeploymentStrategy | Should Be 'CANARY'
        $plan.ServiceType | Should Be 'EXPRESS_GATEWAY'
        $plan.CanaryPercent | Should Be 5
        $plan.BakeTimeInMinutes | Should Be 3
        $plan.BaselineMinutes | Should Be 15
        $plan.Allowed503 | Should Be 0
        $plan.RollbackTaskDefinition | Should Be 'default-brana-hml-backend:16'
        ($plan.LifecycleStages -join ' ') | Should Match 'CANARY_TRAFFIC'
        ($plan.LifecycleStages -join ' ') | Should Match 'ROLLING_BACK'
    }

    It 'accepts healthy canary signals and blocks incomplete telemetry' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $signals = [pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $true
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            healthyHostCount = 1
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
        }
        $ready = Test-BranaCanaryDeploymentReadiness -Config $config -Signals $signals
        $ready.IsValid | Should Be $true

        $blocked = Test-BranaCanaryDeploymentReadiness -Config $config -Signals ([pscustomobject]@{})
        $blocked.IsValid | Should Be $false
        ($blocked.Errors -join ' ') | Should Match 'service must be stable'
        ($blocked.Errors -join ' ') | Should Match 'rollback service revision is required'
    }

    It 'blocks the required negative canary scenarios' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"

        (Test-BranaCanaryDeploymentReadiness -Config $config -Signals ([pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            healthyHostCount = 1
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
        })).IsValid | Should Be $false

        (Test-BranaCanaryDeploymentReadiness -Config $config -Signals ([pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $true
            publicTargetHealthy = $true
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            healthyHostCount = 1
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
        })).Errors -join ' ' | Should Match 'deployment concurrent blocks canary'

        ((Test-BranaCanaryDeploymentReadiness -Config $config -Signals ([pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $true
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            healthyHostCount = 1
            elb5xxCount = 1
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
        })).Errors -join ' ') | Should Match 'ELB 5xx above zero blocks canary'

        ((Test-BranaCanaryDeploymentReadiness -Config $config -Signals ([pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $true
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            healthyHostCount = 0
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 1
            lifecycleStage = 'UNKNOWN_STAGE'
        })).Errors -join ' ') | Should Match 'HealthyHostCount below 1 blocks canary'

        ((Test-BranaCanaryDeploymentReadiness -Config $config -Signals ([pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $true
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            healthyHostCount = 1
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'INVALID_STAGE'
        })).Errors -join ' ') | Should Match 'lifecycle stage unknown'
    }
}
