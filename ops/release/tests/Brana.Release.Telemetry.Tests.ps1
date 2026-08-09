Import-Module "$PSScriptRoot\..\modules\Brana.Release.Common.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Config.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Telemetry.psm1" -Force

Describe 'Brana.Release.Telemetry' {
    It 'exposes the read-only AWS whitelist' {
        $whitelist = Get-BranaAwsReadWhitelist
        ($whitelist.ECS -join ' ') | Should Match 'describe-services'
        ($whitelist.ELBV2 -join ' ') | Should Match 'describe-listeners'
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
        $telemetry.publicTargetRevisionSource | Should Be 'target-task-ip'
        $telemetry.publicTargetRevisionConfirmed | Should Be $true
        $telemetry.publicTargetRevisionInferred | Should Be $false
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
        $telemetry.publicTargetRevision | Should Be ''
        $telemetry.publicTargetRevisionSource | Should Be 'unavailable'
        $telemetry.publicTargetRevisionConfirmed | Should Be $false
        $telemetry.publicTargetRevisionInferred | Should Be $false
        $telemetry.healthStatusCode | Should Be 503
        $telemetry.appStatusCode | Should Be 503
        $telemetry.Http.Observed503 | Should Be $true
    }

    It 'retries throttled AWS reads at most twice' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $script:throttleCount = 0
        $awsInvoker = {
            param($FullArguments, $Timeout)
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
            param($FullArguments, $Timeout)
            switch ($FullArguments[0]) {
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
                    if ($FullArguments -contains 'HTTPCode_Target_5XX_Count') {
                        return [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                    }
                    return [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[{"Sum":0}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                }
                default {
                    throw "Unexpected command: $($FullArguments[0])"
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

    It 'discovers the live listener topology and confirms the revision even when the configured target group is stale' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $config.productionTargetGroupArn = 'arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-e9a92e7d6f31c7aaa/93b9db17c258ebe0'
        $awsInvoker = {
            param($FullArguments, $Timeout)
            switch ($FullArguments[0]) {
                'sts' {
                    [pscustomobject]@{ ExitCode = 0; StdOut = '{"Account":"810204249111","Arn":"arn:aws:sts::810204249111:assumed-role/role/user","UserId":"A"}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                }
                'ecs' {
                    switch ($FullArguments[1]) {
                        'describe-services' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"services":[{"serviceArn":"arn","taskDefinition":"default-brana-hml-backend:24","desiredCount":1,"runningCount":1,"pendingCount":0,"deployments":[{"id":"ecs-svc/1","taskDefinition":"default-brana-hml-backend:24","rolloutState":"COMPLETED"}],"deploymentConfiguration":{"deploymentCircuitBreaker":{"enable":true}}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'list-tasks' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"taskArns":["arn:aws:ecs:sa-east-1:810204249111:task/default/new"]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-tasks' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"tasks":[{"taskArn":"arn:aws:ecs:sa-east-1:810204249111:task/default/new","taskDefinitionArn":"default-brana-hml-backend:24","lastStatus":"RUNNING","desiredStatus":"RUNNING","healthStatus":"HEALTHY","startedAt":"2026-08-09T11:16:56.622000-03:00","attachments":[{"details":[{"name":"privateIPv4Address","value":"10.20.31.78"}]}],"containers":[{"name":"Main","lastStatus":"RUNNING","healthStatus":"HEALTHY","image":"810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend@sha256:01be1ecf80afd299b13a72554809ef6e41929f2e662db6217d17e65b2a27d770"}]}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        default {
                            throw "Unexpected ECS command: $($FullArguments[1])"
                        }
                    }
                }
                'elbv2' {
                    switch ($FullArguments[1]) {
                        'describe-target-groups' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetGroups":[{"TargetGroupArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-e9a92e7d6f31c7aaa/93b9db17c258ebe0","LoadBalancerArns":["arn:aws:elasticloadbalancing:sa-east-1:810204249111:loadbalancer/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd"]}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-listeners' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"Listeners":[{"ListenerArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38"}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-rules' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"Rules":[{"RuleArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener-rule/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38/0ed547532de2e6e6","Priority":"1","Conditions":[{"Field":"host-header","HostHeaderConfig":{"Values":["app.institutobrana.com.br"]}}],"Actions":[{"Type":"forward","ForwardConfig":{"TargetGroups":[{"TargetGroupArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-755fef69195f7dbe3/570f304e06f75054","Weight":100},{"TargetGroupArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-e9a92e7d6f31c7aaa/93b9db17c258ebe0","Weight":0}]}}]}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-target-health' {
                            if (($FullArguments -join ' ') -like '*ecs-gateway-tg-755fef69195f7dbe3*') {
                                return [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetHealthDescriptions":[{"Target":{"Id":"10.20.31.78","Port":8080,"AvailabilityZone":"sa-east-1b"},"TargetHealth":{"State":"healthy"}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                            }
                            if (($FullArguments -join ' ') -like '*ecs-gateway-tg-e9a92e7d6f31c7aaa*') {
                                return [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetHealthDescriptions":[]}' ; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                            }
                            throw "Unexpected target group: $($FullArguments -join ' ')"
                        }
                        default {
                            throw "Unexpected ELBV2 command: $($FullArguments[1])"
                        }
                    }
                }
                'cloudwatch' {
                    if ($FullArguments -contains 'HTTPCode_Target_5XX_Count') {
                        return [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[]}' ; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                    }
                    return [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[{"Sum":0}]}' ; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                }
                default {
                    throw "Unexpected service: $($FullArguments[0])"
                }
            }
        }
        $httpInvoker = {
            param($Uri, $Timeout)
            [pscustomobject]@{ StatusCode = 200; DurationMs = 1; Error = $null }
        }
        $telemetry = Get-BranaCanaryTelemetry -Config $config -AwsInvoker $awsInvoker -HttpInvoker $httpInvoker
        $telemetry.publicTargetGroupArn | Should Be 'arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-755fef69195f7dbe3/570f304e06f75054'
        $telemetry.publicTargetRevision | Should Be 'default-brana-hml-backend:24'
        $telemetry.publicTargetRevisionConfirmed | Should Be $true
        $telemetry.publicTargetRevisionSource | Should Be 'target-task-ip'
        @($telemetry.warnings | Where-Object { $_ -match 'configured production target group differs from live listener topology' }).Count | Should Be 1
        $telemetry.publicTargetHealthy | Should Be $true
        $telemetry.Http.HealthStatusCode | Should Be 200
        $telemetry.Http.AppStatusCode | Should Be 200
    }

    It 'correlates the new revision even when it lives in the 5 percent canary target group' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $config.productionTargetGroupArn = 'arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-755fef69195f7dbe3/570f304e06f75054'
        $awsInvoker = {
            param($FullArguments, $Timeout)
            switch ($FullArguments[0]) {
                'sts' {
                    [pscustomobject]@{ ExitCode = 0; StdOut = '{"Account":"810204249111","Arn":"arn:aws:sts::810204249111:assumed-role/role/user","UserId":"A"}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                }
                'ecs' {
                    switch ($FullArguments[1]) {
                        'describe-services' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"services":[{"serviceArn":"arn","taskDefinition":"default-brana-hml-backend:24","desiredCount":1,"runningCount":1,"pendingCount":0,"deployments":[{"id":"ecs-svc/1","taskDefinition":"default-brana-hml-backend:24","rolloutState":"COMPLETED"}],"deploymentConfiguration":{"deploymentCircuitBreaker":{"enable":true}}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'list-tasks' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"taskArns":["arn:aws:ecs:sa-east-1:810204249111:task/default/new"]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-tasks' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"tasks":[{"taskArn":"arn:aws:ecs:sa-east-1:810204249111:task/default/new","taskDefinitionArn":"default-brana-hml-backend:24","lastStatus":"RUNNING","desiredStatus":"RUNNING","healthStatus":"HEALTHY","startedAt":"2026-08-09T11:16:56.622000-03:00","attachments":[{"details":[{"name":"privateIPv4Address","value":"10.20.31.79"}]}],"containers":[{"name":"Main","lastStatus":"RUNNING","healthStatus":"HEALTHY","image":"810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend@sha256:01be1ecf80afd299b13a72554809ef6e41929f2e662db6217d17e65b2a27d770"}]}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                    }
                }
                'elbv2' {
                    switch ($FullArguments[1]) {
                        'describe-target-groups' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetGroups":[{"TargetGroupArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-755fef69195f7dbe3/570f304e06f75054","LoadBalancerArns":["arn:aws:elasticloadbalancing:sa-east-1:810204249111:loadbalancer/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd"]}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-listeners' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"Listeners":[{"ListenerArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38"}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-rules' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"Rules":[{"RuleArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener-rule/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38/0ed547532de2e6e6","Priority":"1","Conditions":[{"Field":"host-header","HostHeaderConfig":{"Values":["app.institutobrana.com.br"]}}],"Actions":[{"Type":"forward","ForwardConfig":{"TargetGroups":[{"TargetGroupArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-755fef69195f7dbe3/570f304e06f75054","Weight":95},{"TargetGroupArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-e9a92e7d6f31c7aaa/93b9db17c258ebe0","Weight":5}]}}]}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-target-health' {
                            if (($FullArguments -join ' ') -like '*ecs-gateway-tg-755fef69195f7dbe3*') {
                                return [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetHealthDescriptions":[{"Target":{"Id":"10.20.18.145","Port":8080,"AvailabilityZone":"sa-east-1a"},"TargetHealth":{"State":"healthy"}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                            }
                            if (($FullArguments -join ' ') -like '*ecs-gateway-tg-e9a92e7d6f31c7aaa*') {
                                return [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetHealthDescriptions":[{"Target":{"Id":"10.20.31.79","Port":8080,"AvailabilityZone":"sa-east-1b"},"TargetHealth":{"State":"healthy"}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                            }
                            throw "Unexpected target group: $($FullArguments -join ' ')"
                        }
                    }
                }
                'cloudwatch' {
                    if ($FullArguments -contains 'HTTPCode_Target_5XX_Count') {
                        return [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[]}' ; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                    }
                    return [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[{"Sum":0}]}' ; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                }
                default {
                    throw "Unexpected service: $($FullArguments[0])"
                }
            }
        }
        $httpInvoker = {
            param($Uri, $Timeout)
            [pscustomobject]@{ StatusCode = 200; DurationMs = 1; Error = $null }
        }
        $telemetry = Get-BranaCanaryTelemetry -Config $config -AwsInvoker $awsInvoker -HttpInvoker $httpInvoker
        $telemetry.publicTargetGroupArn | Should Be 'arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-e9a92e7d6f31c7aaa/93b9db17c258ebe0'
        $telemetry.publicTargetRevision | Should Be 'default-brana-hml-backend:24'
        $telemetry.publicTargetRevisionConfirmed | Should Be $true
        $telemetry.publicTargetHealthy | Should Be $true
        $telemetry.publicTargetRevisionSource | Should Be 'target-task-ip'
    }

    It 'correlates the new revision when the listener is flipped to the opposite target group' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $config.productionTargetGroupArn = 'arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-755fef69195f7dbe3/570f304e06f75054'
        $awsInvoker = {
            param($FullArguments, $Timeout)
            switch ($FullArguments[0]) {
                'sts' {
                    [pscustomobject]@{ ExitCode = 0; StdOut = '{"Account":"810204249111","Arn":"arn:aws:sts::810204249111:assumed-role/role/user","UserId":"A"}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                }
                'ecs' {
                    switch ($FullArguments[1]) {
                        'describe-services' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"services":[{"serviceArn":"arn","taskDefinition":"default-brana-hml-backend:24","desiredCount":1,"runningCount":1,"pendingCount":0,"deployments":[{"id":"ecs-svc/1","taskDefinition":"default-brana-hml-backend:24","rolloutState":"COMPLETED"}],"deploymentConfiguration":{"deploymentCircuitBreaker":{"enable":true}}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'list-tasks' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"taskArns":["arn:aws:ecs:sa-east-1:810204249111:task/default/new"]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-tasks' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"tasks":[{"taskArn":"arn:aws:ecs:sa-east-1:810204249111:task/default/new","taskDefinitionArn":"default-brana-hml-backend:24","lastStatus":"RUNNING","desiredStatus":"RUNNING","healthStatus":"HEALTHY","startedAt":"2026-08-09T11:16:56.622000-03:00","attachments":[{"details":[{"name":"privateIPv4Address","value":"10.20.18.145"}]}],"containers":[{"name":"Main","lastStatus":"RUNNING","healthStatus":"HEALTHY","image":"810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend@sha256:01be1ecf80afd299b13a72554809ef6e41929f2e662db6217d17e65b2a27d770"}]}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                    }
                }
                'elbv2' {
                    switch ($FullArguments[1]) {
                        'describe-target-groups' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetGroups":[{"TargetGroupArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-755fef69195f7dbe3/570f304e06f75054","LoadBalancerArns":["arn:aws:elasticloadbalancing:sa-east-1:810204249111:loadbalancer/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd"]}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-listeners' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"Listeners":[{"ListenerArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38"}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-rules' {
                            [pscustomobject]@{ ExitCode = 0; StdOut = '{"Rules":[{"RuleArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:listener-rule/app/ecs-express-gateway-alb-cc2efd45/bf1c5b416fb4e6fd/08036ee6fda55e38/0ed547532de2e6e6","Priority":"1","Conditions":[{"Field":"host-header","HostHeaderConfig":{"Values":["app.institutobrana.com.br"]}}],"Actions":[{"Type":"forward","ForwardConfig":{"TargetGroups":[{"TargetGroupArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-e9a92e7d6f31c7aaa/93b9db17c258ebe0","Weight":100},{"TargetGroupArn":"arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-755fef69195f7dbe3/570f304e06f75054","Weight":0}]}}]}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                        }
                        'describe-target-health' {
                            if (($FullArguments -join ' ') -like '*ecs-gateway-tg-e9a92e7d6f31c7aaa*') {
                                return [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetHealthDescriptions":[{"Target":{"Id":"10.20.18.145","Port":8080,"AvailabilityZone":"sa-east-1b"},"TargetHealth":{"State":"healthy"}}]}'; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                            }
                            if (($FullArguments -join ' ') -like '*ecs-gateway-tg-755fef69195f7dbe3*') {
                                return [pscustomobject]@{ ExitCode = 0; StdOut = '{"TargetHealthDescriptions":[]}' ; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                            }
                            throw "Unexpected target group: $($FullArguments -join ' ')"
                        }
                    }
                }
                'cloudwatch' {
                    if ($FullArguments -contains 'HTTPCode_Target_5XX_Count') {
                        return [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[]}' ; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                    }
                    return [pscustomobject]@{ ExitCode = 0; StdOut = '{"Datapoints":[{"Sum":0}]}' ; StdErr = ''; TimedOut = $false; DurationMs = 1 }
                }
            }
        }
        $httpInvoker = {
            param($Uri, $Timeout)
            [pscustomobject]@{ StatusCode = 200; DurationMs = 1; Error = $null }
        }
        $telemetry = Get-BranaCanaryTelemetry -Config $config -AwsInvoker $awsInvoker -HttpInvoker $httpInvoker
        $telemetry.publicTargetGroupArn | Should Be 'arn:aws:elasticloadbalancing:sa-east-1:810204249111:targetgroup/ecs-gateway-tg-e9a92e7d6f31c7aaa/93b9db17c258ebe0'
        $telemetry.publicTargetRevision | Should Be 'default-brana-hml-backend:24'
        $telemetry.publicTargetRevisionConfirmed | Should Be $true
        $telemetry.publicTargetHealthy | Should Be $true
        $telemetry.publicTargetRevisionSource | Should Be 'target-task-ip'
    }

    It 'rejects non-whitelisted write operations before execution' {
        { Invoke-BranaAwsReadCommand -Service 'ECS' -Command 'register-task-definition' } | Should Throw
    }

    It 'reports timeout and invalid JSON as blocking errors in the live collector path' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $timeoutInvoker = {
            param($FullArguments, $Timeout)
            return [pscustomobject]@{ ExitCode = -1; StdOut = ''; StdErr = 'timeout'; TimedOut = $true; DurationMs = 1000 }
        }
        $timeoutResult = Invoke-BranaTelemetryReadCommand -Config $config -Service 'STS' -Command 'get-caller-identity' -AwsInvoker $timeoutInvoker
        $timeoutResult.TimedOut | Should Be $true
        { '{' | ConvertFrom-Json } | Should Throw
    }
}
