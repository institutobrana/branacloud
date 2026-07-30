Import-Module "$PSScriptRoot\..\modules\Brana.Release.Common.psm1" -Force
Import-Module "$PSScriptRoot\..\modules\Brana.Release.Config.psm1" -Force
Import-Module "$PSScriptRoot\..\Brana.Release.psm1" -Force

Describe 'Brana.Release.Config' {
    It 'loads and validates hml.json' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $result = Test-BranaEnvironmentConfig -Config $config
        $result.IsValid | Should Be $true
    }

    It 'parses the schema and example files' {
        Get-Content "$PSScriptRoot\..\config\environments.schema.json" -Raw | ConvertFrom-Json -ErrorAction Stop | Out-Null
        Get-Content "$PSScriptRoot\..\config\prod.example.json" -Raw | ConvertFrom-Json -ErrorAction Stop | Out-Null
        $schema = Get-BranaEnvironmentConfigSchema
        $schema.title | Should Be 'Brana Cloud Release Environment Configuration'
    }

    It 'rejects missing file and corrupted JSON' {
        { Get-BranaEnvironmentConfig -Path "$env:TEMP\missing-config.json" } | Should Throw
        $tempDir = Join-Path $env:TEMP ('brana-config-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        try {
            $bad = Join-Path $tempDir 'bad.json'
            Set-Content -LiteralPath $bad -Value '{'
            { Get-BranaEnvironmentConfig -Path $bad } | Should Throw
        }
        finally {
            if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
        }
    }

    It 'rejects divergent and invalid configuration data' {
        $base = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $bad = [pscustomobject]@{
            schema_version = '1.0.0'
            environment = 'prod'
            awsAccountId = '123'
            awsRegion = 'invalid'
            ecsCluster = $base.ecsCluster
            ecsService = $base.ecsService
            taskFamily = $base.taskFamily
            deploymentStrategy = 'BLUEGREEN'
            desiredCount = 0
            minimumHealthyPercent = 80
            maximumPercent = 50
            productionTargetGroupArn = 'arn:aws:elasticloadbalancing:sa-east-1:999999999999:targetgroup/x/y'
            publicHealthUrl = 'ftp://app.example.invalid/health'
            publicAppUrl = 'https://app.example.invalid/app'
            observationMinutes = 10
            requestIntervalSeconds = 5
            rollbackTaskDefinition = 'default-brana-hml-backend:15'
            requireCleanClone = $false
            requireImageDigest = $false
            requireZeroElb503 = $false
            requirePublicTargetHealthy = $false
            requireOldTaskUntilNewHealthy = $false
            logGroup = '/aws/ecs/default/brana'
            runtimePlatform = [pscustomobject]@{ operatingSystemFamily = 'WINDOWS'; cpuArchitecture = 'SPARC' }
            password = 'secret'
        }
        $result = Test-BranaEnvironmentConfig -Config $bad
        $result.IsValid | Should Be $false
        $result.Errors.Count | Should BeGreaterThan 0
    }

    It 'compares environment names and detects sensitive properties' {
        Compare-BranaEnvironmentName -RequestedEnvironment 'HML' -FileEnvironment 'hml' | Should Be $true
        { Compare-BranaEnvironmentName -RequestedEnvironment 'hml' -FileEnvironment 'prod' } | Should Throw
        $sens = Test-BranaEnvironmentContainsSensitiveData -Config ([pscustomobject]@{ token = 'abc'; domain = 'example' })
        $sens.IsSensitive | Should Be $true
    }

    It 'rejects prod example as active configuration' {
        $prod = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\prod.example.json"
        $result = Test-BranaEnvironmentConfig -Config $prod
        $result.IsValid | Should Be $false
    }

    It 'accepts rolling config values' {
        $config = Get-BranaEnvironmentConfig -Path "$PSScriptRoot\..\config\hml.json"
        $rolling = Test-BranaRollingReleaseConfig -Config $config
        $rolling.IsValid | Should Be $true
    }
}
