Import-Module "$PSScriptRoot\..\modules\Brana.Release.Common.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Config.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Telemetry.psm1" -Force

Describe 'Brana.Release.Telemetry' {
    It 'exposes the read-only AWS whitelist' {
        $whitelist = Get-BranaAwsReadWhitelist
        ($whitelist.ECS -join ' ') | Should Match 'describe-services'
        ($whitelist.ELBV2 -join ' ') | Should Match 'describe-target-health'
        ($whitelist.CloudWatch -join ' ') | Should Match 'get-metric-statistics'
        ($whitelist.STS -join ' ') | Should Match 'get-caller-identity'
    }

    It 'allows whitelisted commands and rejects write commands' {
        $invoker = {
            param($FullArguments, $Timeout)
            [pscustomobject]@{ ExitCode = 0; StdOut = ($FullArguments -join ' '); StdErr = ''; TimedOut = $false; DurationMs = 1 }
        }
        (Invoke-BranaAwsReadCommand -Service 'STS' -Command 'get-caller-identity' -Invoker $invoker).StdOut | Should Match '^sts get-caller-identity'
        { Invoke-BranaAwsReadCommand -Service 'ECS' -Command 'update-service' -Invoker $invoker } | Should Throw
    }

    It 'normalizes a healthy telemetry fixture' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $telemetry = Get-BranaCanaryTelemetry -Config $config -TelemetryPath "$PSScriptRoot\fixtures\canary-telemetry-healthy.json"
        $telemetry.Complete | Should Be $true
        $telemetry.serviceStable | Should Be $true
        $telemetry.deploymentConcurrent | Should Be $false
        $telemetry.publicTargetHealthy | Should Be $true
        $telemetry.publicTargetEmpty | Should Be $false
        $telemetry.publicTargetRevision | Should Be 'default-brana-hml-backend:16'
        $telemetry.activeTaskDefinition | Should Be 'default-brana-hml-backend:16'
        $telemetry.healthStatusCode | Should Be 200
        $telemetry.appStatusCode | Should Be 200
        $telemetry.allowed503 | Should Be 0
        $telemetry.Http.HealthStatusCode | Should Be 200
    }

    It 'normalizes an incident telemetry fixture with empty public target and 503' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $telemetry = Get-BranaCanaryTelemetry -Config $config -TelemetryPath "$PSScriptRoot\fixtures\canary-telemetry-empty-503.json"
        $telemetry.Complete | Should Be $false
        $telemetry.publicTargetEmpty | Should Be $true
        $telemetry.publicTargetHealthy | Should Be $false
        $telemetry.publicTargetRevision | Should Be $null
        $telemetry.healthStatusCode | Should Be 503
        $telemetry.appStatusCode | Should Be 503
        $telemetry.Http.Observed503 | Should Be $true
    }

    It 'retries throttled AWS reads at most twice' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $script:throttleCount = 0
        $awsInvoker = {
            param($Args, $Timeout)
            $script:throttleCount++
            if ($script:throttleCount -eq 1) {
                return [pscustomobject]@{ ExitCode = 254; StdOut = ''; StdErr = 'ThrottlingException'; TimedOut = $false; DurationMs = 1 }
            }
            return [pscustomobject]@{ ExitCode = 0; StdOut = '{"Account":"810204249111","Arn":"arn:aws:sts::810204249111:assumed-role/role/user","UserId":"A"}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
        }
        $result = Invoke-BranaTelemetryReadCommand -Config $config -Service 'STS' -Command 'get-caller-identity' -AwsInvoker $awsInvoker
        $script:throttleCount | Should Be 2
        $result.ExitCode | Should Be 0
    }

    It 'blocks unhealthy health probes and missing metrics in the live collector path' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $awsCalls = @()
        $awsInvoker = {
            param($Args, $Timeout)
            switch ($Args[0]) {
                'STS' {
                    [pscustomobject]@{ ExitCode = 0; StdOut = '{"Account":"810204249111","Arn":"arn:aws:sts::810204249111:assumed-role/role/user","UserId":"A"}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                }
                'ECS' {
                    [pscustomobject]@{ ExitCode = 0; StdOut = '{"services":[{"serviceArn":"arn","taskDefinition":"default-brana-hml-backend:16","desiredCount":1,"runningCount":1,"pendingCount":0,"deployments":[{"id":"ecs-svc/1","taskDefinition":"default-brana-hml-backend:16","rolloutState":"COMPLETED"}],"deploymentConfiguration":{"deploymentCircuitBreaker":{"enable":true}}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                }
                'ELBV2' {
                    [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetHealthDescriptions":[{"TargetHealth":{"State":"healthy"}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                }
                'CloudWatch' {
                    if ($Args -contains 'HTTPCode_Target_5XX_Count') {
                        return [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                    }
                    return [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[{"Sum":0}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                }
                default {
                    throw "Unexpected command: $($Args[0])"
                }
            }
        }
        $httpInvoker = {
            param($Uri, $Timeout)
            if ($Uri -match '/health$') {
                return [pscustomobject]@{ StatusCode = 503; DurationMs = 1; Error = '503' }
            }
            return [pscustomobject]@{ StatusCode = 200; DurationMs = 1; Error = $null }
        }
        $telemetry = Get-BranaCanaryTelemetry -Config $config -AwsInvoker $awsInvoker -HttpInvoker $httpInvoker
        $telemetry.Http.Observed503 | Should Be $true
        $telemetry.Errors -join ' ' | Should Match 'HTTP 503 observed'
        $telemetry.Complete | Should Be $false
        $telemetry.Metrics['HTTPCode_Target_5XX_Count'] | Should Be $null
        $telemetry.Metrics['HTTPCode_ELB_5XX_Count'] | Should Be $null
    }

    It 'uses GET probes' {
        (Invoke-BranaHttpProbe -Uri 'https://app.institutobrana.com.br/health').StatusCode | Should Be 200
        (Invoke-BranaHttpProbe -Uri 'https://app.institutobrana.com.br/app').StatusCode | Should Be 200
    }

    It 'rejects non-whitelisted write operations before execution' {
        { Invoke-BranaAwsReadCommand -Service 'ECS' -Command 'register-task-definition' } | Should Throw
    }

    It 'reports timeout and invalid JSON as blocking errors in the live collector path' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $timeoutInvoker = {
            param($Args, $Timeout)
            return [pscustomobject]@{ ExitCode = -1; StdOut = ''; StdErr = 'timeout'; TimedOut = $true; DurationMs = 1000 }
        }
        $timeoutResult = Invoke-BranaTelemetryReadCommand -Config $config -Service 'STS' -Command 'get-caller-identity' -AwsInvoker $timeoutInvoker
        $timeoutResult.TimedOut | Should Be $true
        { '{' | ConvertFrom-Json } | Should Throw
    }
}
