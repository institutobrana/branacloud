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
        $plan.RollbackTaskDefinition | Should Be 'default-brana-hml-backend:24'
        ($plan.LifecycleStages -join ' ') | Should Match 'WAITING_FOR_PROMOTION'
        ($plan.LifecycleStages -join ' ') | Should Match 'POST_PROMOTION_STABILIZATION'
    }

    It 'accepts healthy canary and promotion telemetry' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $signals = [pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $true
            publicTargetEmpty = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:16'
            rolloutState = 'COMPLETED'
            publicTargetRevision = 'default-brana-hml-backend:16'
            publicTargetRevisionSource = 'target-task-ip'
            publicTargetRevisionConfirmed = $true
            publicTargetRevisionInferred = $false
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 1
            unHealthyHostCount = 0
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
            currentTasks = @(@{ TaskArn = 'arn'; TaskDefinitionArn = 'default-brana-hml-backend:16' })
        }
        (Test-BranaCanaryDeploymentReadiness -Config $config -Signals $signals).IsValid | Should Be $true
        (Test-BranaCanaryPromotionReadiness -Config $config -Signals $signals).IsValid | Should Be $true
        (Test-BranaCanaryStabilizationWindow -Config $config -Signals @($signals, $signals) -MinimumSamples 2).IsValid | Should Be $true
    }

    It 'rejects inferred public target revisions during promotion' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $signals = [pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $true
            publicTargetEmpty = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:16'
            rolloutState = 'IN_PROGRESS'
            publicTargetRevision = 'default-brana-hml-backend:16'
            publicTargetRevisionSource = 'service-active-task-definition'
            publicTargetRevisionConfirmed = $false
            publicTargetRevisionInferred = $true
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 1
            unHealthyHostCount = 0
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
            currentTasks = @(@{ TaskArn = 'arn'; TaskDefinitionArn = 'default-brana-hml-backend:16' })
        }
        $readiness = Test-BranaCanaryPromotionReadiness -Config $config -Signals $signals
        $readiness.IsValid | Should Be $false
        $readiness.Errors -join ' ' | Should Match 'public target revision is inferred and cannot confirm promotion'
    }

    It 'waits when the public target is only inferred' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $signals = [pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $true
            publicTargetEmpty = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:16'
            rolloutState = 'IN_PROGRESS'
            publicTargetRevision = 'default-brana-hml-backend:16'
            publicTargetRevisionSource = 'service-active-task-definition'
            publicTargetRevisionConfirmed = $false
            publicTargetRevisionInferred = $true
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 1
            unHealthyHostCount = 0
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
            currentTasks = @(@{ TaskArn = 'arn'; TaskDefinitionArn = 'default-brana-hml-backend:16' })
        }
        $decision = Get-BranaCanaryPromotionDecision -Config $config -Signals $signals
        $decision.Decision | Should Be 'wait'
        $decision.Reason | Should Match 'not yet confirmed directly'
    }

    It 'waits when the public target is temporarily missing' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $signals = [pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $false
            publicTargetEmpty = $true
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:16'
            publicTargetRevision = 'default-brana-hml-backend:16'
            publicTargetRevisionSource = 'service-active-task-definition'
            publicTargetRevisionConfirmed = $false
            publicTargetRevisionInferred = $true
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 0
            unHealthyHostCount = 0
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
            currentTasks = @()
        }
        $decision = Get-BranaCanaryPromotionDecision -Config $config -Signals $signals
        $decision.Decision | Should Be 'wait'
        $decision.Reason | Should Match 'not yet visible'
    }

    It 'fails when the public target is confirmed on the wrong revision' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $signals = [pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $true
            publicTargetEmpty = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:16'
            rolloutState = 'COMPLETED'
            publicTargetRevision = 'default-brana-hml-backend:15'
            publicTargetRevisionSource = 'target-task-ip'
            publicTargetRevisionConfirmed = $true
            publicTargetRevisionInferred = $false
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 1
            unHealthyHostCount = 0
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
            currentTasks = @(@{ TaskArn = 'arn'; TaskDefinitionArn = 'default-brana-hml-backend:16' })
        }
        $decision = Get-BranaCanaryPromotionDecision -Config $config -Signals $signals
        $decision.Decision | Should Be 'fail'
        $decision.Reason | Should Match 'public target must serve the active task definition'
    }

    It 'waits when the public target is confirmed on the wrong revision while rollout is in progress' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $signals = [pscustomobject]@{
            serviceStable = $false
            deploymentConcurrent = $true
            publicTargetHealthy = $true
            publicTargetEmpty = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:25'
            rolloutState = 'IN_PROGRESS'
            publicTargetRevision = 'default-brana-hml-backend:24'
            publicTargetRevisionSource = 'target-task-ip'
            publicTargetRevisionConfirmed = $true
            publicTargetRevisionInferred = $false
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 1
            unHealthyHostCount = 0
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
            currentTasks = @(@{ TaskArn = 'arn'; TaskDefinitionArn = 'default-brana-hml-backend:25' })
        }
        $decision = Get-BranaCanaryPromotionDecision -Config $config -Signals $signals
        $decision.Decision | Should Be 'wait'
        $decision.Reason | Should Match 'not converged to active task definition yet'
    }

    It 'fails immediately when rollout has failed' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $signals = [pscustomobject]@{
            serviceStable = $false
            deploymentConcurrent = $true
            publicTargetHealthy = $true
            publicTargetEmpty = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:25'
            rolloutState = 'FAILED'
            publicTargetRevision = 'default-brana-hml-backend:24'
            publicTargetRevisionSource = 'service-active-task-definition'
            publicTargetRevisionConfirmed = $false
            publicTargetRevisionInferred = $true
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 1
            unHealthyHostCount = 0
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
            currentTasks = @(@{ TaskArn = 'arn'; TaskDefinitionArn = 'default-brana-hml-backend:25' })
        }
        $decision = Get-BranaCanaryPromotionDecision -Config $config -Signals $signals
        $decision.Decision | Should Be 'fail'
        $decision.Reason | Should Match 'deployment rollout failed'
    }

    It 'blocks the required negative canary scenarios' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"

        (Test-BranaCanaryDeploymentReadiness -Config $config -Signals ([pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $false
            publicTargetEmpty = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:16'
            publicTargetRevision = 'default-brana-hml-backend:16'
            publicTargetRevisionSource = 'target-task-ip'
            publicTargetRevisionConfirmed = $true
            publicTargetRevisionInferred = $false
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 1
            unHealthyHostCount = 0
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
        })).IsValid | Should Be $false

        (Test-BranaCanaryDeploymentReadiness -Config $config -Signals ([pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $true
            publicTargetHealthy = $true
            publicTargetEmpty = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:16'
            publicTargetRevision = 'default-brana-hml-backend:16'
            publicTargetRevisionSource = 'target-task-ip'
            publicTargetRevisionConfirmed = $true
            publicTargetRevisionInferred = $false
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 1
            unHealthyHostCount = 0
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
        })).Errors -join ' ' | Should Match 'deployment concurrent blocks canary'

        ((Test-BranaCanaryDeploymentReadiness -Config $config -Signals ([pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $true
            publicTargetEmpty = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:16'
            publicTargetRevision = 'default-brana-hml-backend:16'
            publicTargetRevisionSource = 'target-task-ip'
            publicTargetRevisionConfirmed = $true
            publicTargetRevisionInferred = $false
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 1
            unHealthyHostCount = 0
            elb5xxCount = 1
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'OBSERVING'
        })).Errors -join ' ') | Should Match 'ELB 5xx above zero blocks canary'

        ((Test-BranaCanaryDeploymentReadiness -Config $config -Signals ([pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $true
            publicTargetEmpty = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:16'
            publicTargetRevision = 'default-brana-hml-backend:16'
            publicTargetRevisionSource = 'service-active-task-definition'
            publicTargetRevisionConfirmed = $false
            publicTargetRevisionInferred = $true
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 0
            unHealthyHostCount = 1
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 1
            lifecycleStage = 'UNKNOWN_STAGE'
        })).Errors -join ' ') | Should Match 'HealthyHostCount below 1 blocks canary'

        ((Test-BranaCanaryDeploymentReadiness -Config $config -Signals ([pscustomobject]@{
            serviceStable = $true
            deploymentConcurrent = $false
            publicTargetHealthy = $true
            publicTargetEmpty = $false
            alternateTargetHealthy = $true
            rollbackServiceRevision = 'default-brana-hml-backend:16'
            activeTaskDefinition = 'default-brana-hml-backend:16'
            publicTargetRevision = 'default-brana-hml-backend:16'
            publicTargetRevisionSource = 'service-active-task-definition'
            publicTargetRevisionConfirmed = $false
            publicTargetRevisionInferred = $true
            healthStatusCode = 200
            appStatusCode = 200
            healthyHostCount = 1
            unHealthyHostCount = 0
            elb5xxCount = 0
            target5xxCount = 0
            observed503Count = 0
            lifecycleStage = 'INVALID_STAGE'
        })).Errors -join ' ') | Should Match 'lifecycle stage unknown'
    }
}
