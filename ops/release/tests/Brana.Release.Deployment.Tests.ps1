Import-Module "$PSScriptRoot\..\modules\Brana.Release.Common.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Config.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Canary.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Telemetry.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Deployment.psm1" -Force

function New-TestDeploymentConfig {
    $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
    $config | Add-Member -NotePropertyName rollbackTaskDefinition -NotePropertyValue 'default-brana-hml-backend:15' -Force
    return $config
}

function New-TestHealthyTelemetry {
    param([string]$RollbackTaskDefinition = 'default-brana-hml-backend:15')
    return [pscustomobject]@{
        serviceStable = $true
        deploymentConcurrent = $false
        publicTargetHealthy = $true
        alternateTargetHealthy = $true
        rollbackServiceRevision = $RollbackTaskDefinition
        healthyHostCount = 1
        elb5xxCount = 0
        target5xxCount = 0
        observed503Count = 0
        lifecycleStage = 'OBSERVING'
        allowed503 = 0
        Http = [pscustomobject]@{
            HealthStatusCode = 200
            AppStatusCode = 200
            HealthOk = $true
            AppOk = $true
            Observed503 = $false
            ProbeErrors = @()
        }
        Metrics = [pscustomobject]@{
            HTTPCode_ELB_5XX_Count = 0
            HTTPCode_Target_5XX_Count = 0
            HealthyHostCount = 1
            UnHealthyHostCount = 0
        }
    }
}

function Copy-TestObjectDeep {
    param([object]$InputObject)
    return (ConvertFrom-Json -InputObject (ConvertTo-Json -Depth 32 -InputObject $InputObject))
}

Describe 'Brana.Release.Deployment' {
    It 'exposes a closed write whitelist' {
        $whitelist = Get-BranaDeploymentWriteWhitelist
        ($whitelist.ECS -join ' ') | Should Match 'register-task-definition'
        ($whitelist.ECS -join ' ') | Should Match 'update-service'
        Test-BranaAwsWriteCommandAllowed -Service 'ECS' -Command 'register-task-definition' | Should Be $true
        Test-BranaAwsWriteCommandAllowed -Service 'ECS' -Command 'modify-listener' | Should Be $false
    }

    It 'blocks dry run and missing confirmation before writing' {
        $config = New-TestDeploymentConfig
        $telemetryPath = Join-Path $PSScriptRoot 'fixtures\canary-telemetry-healthy.json'
        $awsRead = {
            param($Args, $Timeout)
            switch ($Args[0]) {
                'sts' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"Account":"810204249111","Arn":"arn","UserId":"U"}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
                'ecs' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"services":[{"serviceArn":"arn","taskDefinition":"default-brana-hml-backend:16","desiredCount":1,"runningCount":1,"pendingCount":0,"deployments":[{"id":"ecs-svc/1","taskDefinition":"default-brana-hml-backend:16","rolloutState":"COMPLETED"}],"deploymentConfiguration":{"deploymentCircuitBreaker":{"enable":true}}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
                'elbv2' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetHealthDescriptions":[{"TargetHealth":{"State":"healthy"}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
                'cloudwatch' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[{"Sum":0}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
            }
        }
        $http = { param($Uri, $Timeout) [pscustomobject]@{ StatusCode = 200; DurationMs = 1; Error = $null } }
        $write = { param($Args, $Timeout) [pscustomobject]@{ ExitCode = 0; StdOut = '{}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
        $dryRun = Invoke-BranaDeploymentMode -RepositoryPath $PSScriptRoot -Environment 'hml' -Config $config -TelemetryPath $telemetryPath -ReleaseId 'hml-test' -TaskDefinitionArn 'default-brana-hml-backend:17' -DryRun -GitHead 'c3ea78b1d5f4b12c2a4e3d8269ae0251446f1a06' -AwsReadInvoker $awsRead -AwsWriteInvoker $write -HttpInvoker $http
        $dryRun.ExitCode | Should Be 10
        $dryRun.Message | Should Match 'DryRun blocks deployment'

        $missingConfirm = Invoke-BranaDeploymentMode -RepositoryPath $PSScriptRoot -Environment 'hml' -Config $config -TelemetryPath $telemetryPath -ReleaseId 'hml-test' -TaskDefinitionArn 'default-brana-hml-backend:17' -GitHead 'c3ea78b1d5f4b12c2a4e3d8269ae0251446f1a06' -AwsReadInvoker $awsRead -AwsWriteInvoker $write -HttpInvoker $http
        $missingConfirm.ExitCode | Should Be 20
        $missingConfirm.Message | Should Match 'Confirmation required'
    }

    It 'compares semantic equivalence and blocks divergence' {
        $source = [pscustomobject]@{
            family = 'default-brana-hml-backend'
            taskRoleArn = 'arn:task'
            executionRoleArn = 'arn:exec'
            networkMode = 'awsvpc'
            cpu = '512'
            memory = '1024'
            runtimePlatform = [pscustomobject]@{ operatingSystemFamily = 'LINUX'; cpuArchitecture = 'X86_64' }
            containerDefinitions = @(
                [pscustomobject]@{
                    name = 'Main'
                    image = 'image:1'
                    cpu = 512
                    memory = 1024
                    memoryReservation = 1024
                    essential = $true
                    command = @()
                    entryPoint = @()
                    environment = @(@{ name = 'PORT'; value = '8080' })
                    secrets = @()
                    mountPoints = @()
                    volumesFrom = @()
                    portMappings = @(@{ containerPort = 8080; hostPort = 8080; protocol = 'tcp' })
                    healthCheck = $null
                    logConfiguration = [pscustomobject]@{ logDriver = 'awslogs' }
                    systemControls = @()
                }
            )
        }
        $same = Copy-TestObjectDeep -InputObject $source
        $result = Test-BranaDeploymentTaskDefinitionSemanticEquivalence -Source $source -Target $same
        $result.IsValid | Should Be $true
        $different = Copy-TestObjectDeep -InputObject $source
        $different.containerDefinitions[0].image = 'image:2'
        (Test-BranaDeploymentTaskDefinitionSemanticEquivalence -Source $source -Target $different).IsValid | Should Be $false
    }

    It 'persists sanitized state atomically' {
        $tempDir = Join-Path $env:TEMP ('brana-deploy-state-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        try {
            $path = Join-Path $tempDir 'state.json'
            $state = New-BranaDeploymentState -ReleaseId 'hml-1' -Environment 'hml' -AccountId '810204249111' -Region 'sa-east-1' -Cluster 'default' -Service 'brana-hml-backend' -GitHead 'c3ea78b1d5f4b12c2a4e3d8269ae0251446f1a06' -SourceTaskDefinition 'default-brana-hml-backend:16' -TargetTaskDefinition 'default-brana-hml-backend:17' -SourceServiceRevision 'default-brana-hml-backend:16' -TargetServiceRevision 'default-brana-hml-backend:17' -Strategy 'CANARY' -CanaryPercent 5 -BakeTimeInMinutes 3 -Phase 'PREPARED' -Warnings @('ok') -Errors @()
            Write-BranaDeploymentStateAtomic -Path $path -State $state
            $read = Read-BranaDeploymentState -Path $path
            $read.releaseId | Should Be 'hml-1'
            $read.errors.Count | Should Be 0
            (Get-Content -LiteralPath $path -Raw) | Should Not Match 'secret|token|password'
        }
        finally {
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }

    It 'executes deploy, rollback and resume with mocks' {
        $config = New-TestDeploymentConfig
        $telemetryPath = Join-Path $PSScriptRoot 'fixtures\canary-telemetry-healthy.json'
        $awsRead = {
            param($Args, $Timeout)
            switch ($Args[0]) {
                'sts' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"Account":"810204249111","Arn":"arn","UserId":"U"}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
                'ecs' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"services":[{"serviceArn":"arn","taskDefinition":"default-brana-hml-backend:16","desiredCount":1,"runningCount":1,"pendingCount":0,"deployments":[{"id":"ecs-svc/1","taskDefinition":"default-brana-hml-backend:16","rolloutState":"COMPLETED"}],"deploymentConfiguration":{"deploymentCircuitBreaker":{"enable":true}}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
                'elbv2' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetHealthDescriptions":[{"TargetHealth":{"State":"healthy"}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
                'cloudwatch' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[{"Sum":0}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
            }
        }
        $http = { param($Uri, $Timeout) [pscustomobject]@{ StatusCode = 200; DurationMs = 1; Error = $null } }
        $write = {
            param($Args, $Timeout)
            if ($Args[1] -eq 'register-task-definition') {
                return [pscustomobject]@{ ExitCode = 0; StdOut = '{"taskDefinition":{"taskDefinitionArn":"arn:aws:ecs:...:17","revision":17}}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
            }
            return [pscustomobject]@{ ExitCode = 0; StdOut = '{"service":{"serviceArn":"arn","deployments":[{"id":"ecs-svc/2"}]}}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
        }
        $confirm = '810204249111:sa-east-1:c3ea78b1d5f4b12c2a4e3d8269ae0251446f1a06:default-brana-hml-backend:17'
        $deploy = Invoke-BranaDeploymentMode -RepositoryPath $PSScriptRoot -Environment 'hml' -Config $config -TelemetryPath $telemetryPath -ReleaseId 'hml-17' -TaskDefinitionArn 'default-brana-hml-backend:17' -ConfirmDeployment -ConfirmationToken $confirm -GitHead 'c3ea78b1d5f4b12c2a4e3d8269ae0251446f1a06' -AwsReadInvoker $awsRead -AwsWriteInvoker $write -HttpInvoker $http
        $deploy.ExitCode | Should Be 0
        $deploy.Data.State.phase | Should Be 'COMPLETED'
        $deploy.Data.StabilizationTelemetry.Count | Should Be 3
        $deploy.Message | Should Match 'public target stabilization'

        $statePath = Join-Path $env:TEMP ('brana-deploy-state-' + [guid]::NewGuid().ToString('N') + '.json')
        Write-BranaDeploymentStateAtomic -Path $statePath -State $deploy.Data.State
        $rollback = Invoke-BranaRollbackMode -RepositoryPath $PSScriptRoot -Environment 'hml' -Config $config -StatePath $statePath -TelemetryPath $telemetryPath -ConfirmRollback -AwsReadInvoker $awsRead -AwsWriteInvoker $write -HttpInvoker $http
        $rollback.ExitCode | Should Be 50

        $resume = Invoke-BranaResumeMode -StatePath $statePath -Config $config -TelemetryPath $telemetryPath -AwsReadInvoker $awsRead -HttpInvoker $http
        $resume.ExitCode | Should Be 0
        if (Test-Path $statePath) { Remove-Item -LiteralPath $statePath -Force }
    }

    It 'rejects promotion when the public target is empty or unhealthy' {
        $config = New-TestDeploymentConfig
        $telemetryPath = Join-Path $PSScriptRoot 'fixtures\canary-telemetry-public-target-empty-503.json'
        $awsRead = {
            param($Args, $Timeout)
            switch ($Args[0]) {
                'sts' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"Account":"810204249111","Arn":"arn","UserId":"U"}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
                'ecs' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"services":[{"serviceArn":"arn","taskDefinition":"default-brana-hml-backend:19","desiredCount":1,"runningCount":1,"pendingCount":0,"deployments":[{"id":"ecs-svc/2","taskDefinition":"default-brana-hml-backend:19","rolloutState":"COMPLETED"}],"deploymentConfiguration":{"deploymentCircuitBreaker":{"enable":true}}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
                'elbv2' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetHealthDescriptions":[]}' ; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
                'cloudwatch' { [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[{"Sum":0}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
            }
        }
        $http = { param($Uri, $Timeout) [pscustomobject]@{ StatusCode = 503; DurationMs = 1; Error = '503' } }
        $write = { param($Args, $Timeout) [pscustomobject]@{ ExitCode = 0; StdOut = '{}'; StdErr = ''; TimedOut = $false; DurationMs = 1 } }
        $confirm = '810204249111:sa-east-1:c3ea78b1d5f4b12c2a4e3d8269ae0251446f1a06:default-brana-hml-backend:19'
        $deploy = Invoke-BranaDeploymentMode -RepositoryPath $PSScriptRoot -Environment 'hml' -Config $config -TelemetryPath $telemetryPath -ReleaseId 'hml-19' -TaskDefinitionArn 'default-brana-hml-backend:19' -ConfirmDeployment -ConfirmationToken $confirm -GitHead 'c3ea78b1d5f4b12c2a4e3d8269ae0251446f1a06' -AwsReadInvoker $awsRead -AwsWriteInvoker $write -HttpInvoker $http
        $deploy.Success | Should Be $false
        $deploy.ExitCode | Should Be 40
        $deploy.Message | Should Match 'Rollback recommended'
        $deploy.Data.State.phase | Should Be 'ROLLBACK_RECOMMENDED'
    }
}
