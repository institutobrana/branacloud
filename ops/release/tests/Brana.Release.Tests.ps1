Import-Module "$PSScriptRoot\..\modules\Brana.Release.Common.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Canary.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Telemetry.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Git.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Config.psm1" -Force
Import-Module "$PSScriptRoot\..\Brana.Release.psm1" -Force

function New-TestReleaseContractPath {
    param(
        [string]$Directory
    )

    return Join-Path $Directory 'release.json'
}

function New-TestReleaseContract {
    param(
        [string]$Path
    )

    return New-BranaReleaseContract -Environment 'homologacao' -GitRepository 'https://github.com/institutobrana/branacloud.git' -GitBranch 'release/teste' -GitCommit '0123456789abcdef0123456789abcdef01234567' -Operator 'tel-admin' -ImageRepository '810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend' -EcsCluster 'default' -EcsService 'brana-hml-backend' -Domain 'app.institutobrana.com.br' -OutputPath $Path
}

Describe 'Brana.Release module' {
    It '01 contrato valido, JSON valido e exemplo valido' {
        $tempDir = Join-Path $env:TEMP ('brana-release-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        try {
            $path = New-TestReleaseContractPath -Directory $tempDir
            $contract = New-TestReleaseContract -Path $path
            $contract.state | Should Be 'CREATED'
            (Test-BranaReleaseContract -Path $path).IsValid | Should Be $true
            (Test-BranaReleaseContract -Path "$PSScriptRoot\..\examples\release-contract.example.json").IsValid | Should Be $true
        }
        finally {
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }

    It '02 SHA invalido, ambiente invalido e dominio com protocolo sao recusados' {
        $tempDir = Join-Path $env:TEMP ('brana-release-invalid-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        try {
            { New-BranaReleaseContract -Environment 'homologacao' -GitRepository 'https://github.com/institutobrana/branacloud.git' -GitBranch 'release/teste' -GitCommit '12345' -Operator 'tel-admin' -ImageRepository '810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend' -EcsCluster 'default' -EcsService 'brana-hml-backend' -Domain 'app.institutobrana.com.br' -OutputPath (New-TestReleaseContractPath -Directory $tempDir) -DryRun } | Should Throw
            { New-BranaReleaseContract -Environment 'PROD' -GitRepository 'https://github.com/institutobrana/branacloud.git' -GitBranch 'release/teste' -GitCommit '0123456789abcdef0123456789abcdef01234567' -Operator 'tel-admin' -ImageRepository '810204249111.dkr.ecr.sa-east-1.amazonaws.com/brana-cloud/backend' -EcsCluster 'default' -EcsService 'brana-hml-backend' -Domain 'https://app.institutobrana.com.br' -OutputPath (New-TestReleaseContractPath -Directory $tempDir) -DryRun } | Should Throw
        }
        finally {
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }

    It '03 sobrescrita recusada, 04 propriedades desconhecidas e 05 campos obrigatorios' {
        $tempDir = Join-Path $env:TEMP ('brana-release-overwrite-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        try {
            $path = New-TestReleaseContractPath -Directory $tempDir
            $original = New-TestReleaseContract -Path $path
            $hashBefore = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash
            { Update-BranaReleaseContract -Path $path -Updates @{ git_commit = 'ffffffffffffffffffffffffffffffffffffffff' } } | Should Throw
            { Update-BranaReleaseContract -Path $path -Updates @{ unknown_field = 'x' } } | Should Throw
            $hashAfter = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash
            $hashAfter | Should Be $hashBefore
            $read = Test-BranaReleaseContract -Path $path
            $read.IsValid | Should Be $true
            Remove-Item -LiteralPath $path -Force
            { Get-BranaReleaseContract -Path $path } | Should Throw
            $original | Out-Null
        }
        finally {
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }

    It '06 CREATED para PREFLIGHT_OK, 07 CREATED para SUCCEEDED recusado e 08 PREFLIGHT_OK para BUILT' {
        $tempDir = Join-Path $env:TEMP ('brana-release-transition-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        try {
            $path = New-TestReleaseContractPath -Directory $tempDir
            New-TestReleaseContract -Path $path | Out-Null
            { Set-BranaReleaseState -Path $path -State 'SUCCEEDED' -Result 'SUCCEEDED' -Stage 'deploy' -Message 'bad jump' -Operator 'tel-admin' } | Should Throw
            $step1 = Set-BranaReleaseState -Path $path -State 'PREFLIGHT_OK' -Result 'PENDING' -Stage 'preflight' -Message 'done' -Operator 'tel-admin'
            $step1.state | Should Be 'PREFLIGHT_OK'
            $step2 = Set-BranaReleaseState -Path $path -State 'BUILT' -Result 'PENDING' -Stage 'build' -Message 'done' -Operator 'tel-admin'
            $step2.state | Should Be 'BUILT'
        }
        finally {
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }

    It '09 FAILED sem motivo recusado e 10 FAILED com motivo aceito' {
        $tempDir = Join-Path $env:TEMP ('brana-release-failed-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        try {
            $path = New-TestReleaseContractPath -Directory $tempDir
            New-TestReleaseContract -Path $path | Out-Null
            Set-BranaReleaseState -Path $path -State 'PREFLIGHT_OK' -Result 'PENDING' -Stage 'preflight' -Message 'done' -Operator 'tel-admin' | Out-Null
            { Set-BranaReleaseState -Path $path -State 'FAILED' -Result 'PENDING' -Stage 'deploy' -Message 'failed' -Operator 'tel-admin' } | Should Throw
            $failed = Set-BranaReleaseState -Path $path -State 'FAILED' -Result 'FAILED' -Stage 'deploy' -Message 'failed' -Operator 'tel-admin' -Evidence 'unit' -FailureStage 'deploy' -FailureReason 'example'
            $failed.state | Should Be 'FAILED'
            $failed.result | Should Be 'FAILED'
            $failed.failure_stage | Should Be 'deploy'
            $failed.failure_reason | Should Be 'example'
        }
        finally {
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }

    It '11 ROLLING_BACK sem dados recusado e 12 estado terminal preenche finished_at' {
        $tempDir = Join-Path $env:TEMP ('brana-release-rollback-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        try {
            $path = New-TestReleaseContractPath -Directory $tempDir
            New-TestReleaseContract -Path $path | Out-Null
            Set-BranaReleaseState -Path $path -State 'PREFLIGHT_OK' -Result 'PENDING' -Stage 'preflight' -Message 'done' -Operator 'tel-admin' | Out-Null
            { Set-BranaReleaseState -Path $path -State 'ROLLING_BACK' -Result 'PENDING' -Stage 'rollback' -Message 'retry' -Operator 'tel-admin' } | Should Throw
            Set-BranaReleaseState -Path $path -State 'FAILED' -Result 'FAILED' -Stage 'deploy' -Message 'failed' -Operator 'tel-admin' -FailureStage 'deploy' -FailureReason 'example' | Out-Null
            $rollbackReady = Update-BranaReleaseContract -Path $path -Updates @{
                rollback_task_definition = 'default-brana-hml-backend:15'
                rollback_image_digest = 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                rollback_target_group = 'ecs-gateway-tg-e9a92e7d6f31c7aaa'
                rollback_result = 'PENDING'
            }
            $rollbackReady.rollback_task_definition | Should Be 'default-brana-hml-backend:15'
            $rollbackState = Set-BranaReleaseState -Path $path -State 'ROLLING_BACK' -Result 'PENDING' -Stage 'rollback' -Message 'retry' -Operator 'tel-admin' -RollbackTaskDefinition 'default-brana-hml-backend:15' -RollbackImageDigest 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' -RollbackTargetGroup 'ecs-gateway-tg-e9a92e7d6f31c7aaa' -RollbackResult 'PENDING'
            $rollbackState.state | Should Be 'ROLLING_BACK'
            $rolled = Set-BranaReleaseState -Path $path -State 'ROLLED_BACK' -Result 'PENDING' -Stage 'rollback' -Message 'done' -Operator 'tel-admin'
            $rolled.result | Should Be 'ROLLED_BACK'
            $rolled.finished_at | Should Not Be $null
        }
        finally {
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }

    It '13 history preservado, 14 imutabilidade, 15 state generic recusado e 16 falha preserva contrato original' {
        $tempDir = Join-Path $env:TEMP ('brana-release-stateguard-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        try {
            $path = New-TestReleaseContractPath -Directory $tempDir
            New-TestReleaseContract -Path $path | Out-Null
            $before = Get-BranaReleaseContract -Path $path
            Set-BranaReleaseState -Path $path -State 'PREFLIGHT_OK' -Result 'PENDING' -Stage 'preflight' -Message 'done' -Operator 'tel-admin' | Out-Null
            $after = Get-BranaReleaseContract -Path $path
            $after.history.Count | Should Be 2
            { Update-BranaReleaseContract -Path $path -Updates @{ environment = 'producao' } } | Should Throw
            { Update-BranaReleaseContract -Path $path -Updates @{ state = 'BUILT' } } | Should Throw
            $hashBefore = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash
            { Update-BranaReleaseContract -Path $path -Updates @{ git_commit = 'badbadbadbadbadbadbadbadbadbadbadbadbadb' } } | Should Throw
            $hashAfter = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash
            $hashAfter | Should Be $hashBefore
            $before.state | Should Be 'CREATED'
        }
        finally {
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }

    It '17 gravação atomica sem residual e duas atualizações sequenciais validas' {
        $tempDir = Join-Path $env:TEMP ('brana-release-atomic-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        try {
            $path = New-TestReleaseContractPath -Directory $tempDir
            New-TestReleaseContract -Path $path | Out-Null
            (Get-ChildItem -LiteralPath $tempDir -Filter '*.tmp' -Force | Measure-Object).Count | Should Be 0
            Update-BranaReleaseContract -Path $path -Updates @{ release_notes = 'nota 1' } | Out-Null
            Update-BranaReleaseContract -Path $path -Updates @{ release_notes = 'nota 2' } | Out-Null
            $final = Get-BranaReleaseContract -Path $path
            $final.release_notes | Should Be 'nota 2'
            (Get-ChildItem -LiteralPath $tempDir -Filter '*.tmp' -Force | Measure-Object).Count | Should Be 0
        }
        finally {
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }

    It '18 mascaramento de bearer, password, token, secret, conexao e texto normal' {
        (Protect-BranaSensitiveText 'Authorization: Bearer eyJabc.def.ghi') | Should Match '<redacted>'
        (Protect-BranaSensitiveText 'password=MinhaSenha') | Should Match '<redacted>'
        (Protect-BranaSensitiveText 'password: MinhaSenha') | Should Match '<redacted>'
        (Protect-BranaSensitiveText 'token=abc123') | Should Match '<redacted>'
        (Protect-BranaSensitiveText 'secret=abc123') | Should Match '<redacted>'
        (Protect-BranaSensitiveText 'postgresql://usuario:senha@host/banco') | Should Match '<redacted>'
        (Protect-BranaSensitiveText 'texto comum') | Should Be 'texto comum'
        { Protect-BranaSensitiveText $null } | Should Not Throw
        { Protect-BranaSensitiveText '' } | Should Not Throw
    }

    It '19 tabela de transicoes inclui as rotas esperadas e estados terminais nao aceitam novas transicoes' {
        $table = Get-BranaAllowedStateTransitions
        ($table['CREATED'] -contains 'PREFLIGHT_OK') | Should Be $true
        ($table['CREATED'] -contains 'FAILED') | Should Be $true
        ($table['PREFLIGHT_OK'] -contains 'BUILT') | Should Be $true
        ($table['BUILT'] -contains 'PUSHED') | Should Be $true
        ($table['PUSHED'] -contains 'MIGRATED') | Should Be $true
        ($table['PUSHED'] -contains 'DEPLOYING') | Should Be $true
        ($table['MIGRATED'] -contains 'DEPLOYING') | Should Be $true
        ($table['DEPLOYING'] -contains 'VALIDATING') | Should Be $true
        ($table['VALIDATING'] -contains 'SUCCEEDED') | Should Be $true
        ($table['FAILED'] -contains 'ROLLING_BACK') | Should Be $true
        ($table['ROLLING_BACK'] -contains 'ROLLED_BACK') | Should Be $true
        ($table['ROLLING_BACK'] -contains 'ROLLBACK_FAILED') | Should Be $true
        $table['SUCCEEDED'].Count | Should Be 0
        $table['ROLLED_BACK'].Count | Should Be 0
        $table['ROLLBACK_FAILED'].Count | Should Be 0
    }

    It '20 hml express gateway produz plano canary e readiness depende de sinais locais' {
        $tempDir = Join-Path $env:TEMP ('brana-release-plan-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        $original = Get-Command Get-BranaGitRepositorySummary -CommandType Function -ErrorAction SilentlyContinue
        function global:Get-BranaGitRepositorySummary {
            param([string]$Path,[string[]]$RequiredPaths)
            [pscustomobject]@{
                IsHealthy = $true
                WorktreeDirty = $false
                StageDirty = $false
                IsDetachedHead = $false
                RepositoryRoot = $Path
                Branch = 'modularizacao-segura-fase-1'
                Head = '4c6dcb1449f86a1551b1e3d0ab4c72538e6f872a'
                HeadShort = '4c6dcb1'
                RequiredPaths = $RequiredPaths
                Errors = @()
                Warnings = @()
            }
        }
        try {
            $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
            $plan = Get-BranaReleaseDeploymentPlan -Config $config
            $plan.DeploymentStrategy | Should Be 'CANARY'
            $plan.ServiceType | Should Be 'EXPRESS_GATEWAY'
            $plan.CanaryPercent | Should Be 5
            $plan.BakeTimeInMinutes | Should Be 3
            $plan.BaselineMinutes | Should Be 15
            $plan.ObservationMinutes | Should Be 15
            $plan.Allowed503 | Should Be 0
            $plan.LifecycleStages.Count | Should BeGreaterThan 0

            $missingSignals = Test-BranaReleaseDeploymentPreflight -RepositoryPath (Resolve-Path "$PSScriptRoot\..\..").Path -Config $config
            $missingSignals.IsValid | Should Be $false
            ($missingSignals.Errors -join ' ') | Should Match 'canary telemetry signals are required'

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

            $telemetry = Get-BranaCanaryTelemetry -Config $config -TelemetryPath "$PSScriptRoot\fixtures\canary-telemetry-healthy.json"
            $telemetry.Complete | Should Be $true
            (Test-BranaCanaryDeploymentReadiness -Config $config -Signals $telemetry).IsValid | Should Be $true

            ($plan.LifecycleStages -join ' ') | Should Match 'BASELINE'
            ($plan.LifecycleStages -join ' ') | Should Match 'BAKE'
            ($plan.RollbackTriggers -join ' ') | Should Match '503 during observation'
        }
        finally {
            if ($original) {
                Remove-Item -Path function:global:Get-BranaGitRepositorySummary -ErrorAction SilentlyContinue
                Set-Item -Path 'function:Get-BranaGitRepositorySummary' -Value $original
            }
            else {
                Remove-Item -Path function:global:Get-BranaGitRepositorySummary -ErrorAction SilentlyContinue
                Remove-Item function:Get-BranaGitRepositorySummary -ErrorAction SilentlyContinue
            }
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }
}
