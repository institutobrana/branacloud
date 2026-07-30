Set-StrictMode -Version Latest

$script:BranaReleaseConfigSchema = $null

function Get-BranaConfigPropertyValue {
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

function Get-BranaEnvironmentConfigSchema {
    [CmdletBinding()]
    param()

    if ($null -eq $script:BranaReleaseConfigSchema) {
        $schemaPath = Join-Path $PSScriptRoot '..\config\environments.schema.json'
        $script:BranaReleaseConfigSchema = Get-Content -LiteralPath $schemaPath -Raw | ConvertFrom-Json -ErrorAction Stop
    }
    return $script:BranaReleaseConfigSchema
}

function Compare-BranaEnvironmentName {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$RequestedEnvironment,
        [Parameter(Mandatory)]
        [string]$FileEnvironment
    )

    $requested = $RequestedEnvironment.Trim().ToLowerInvariant()
    $fileEnv = $FileEnvironment.Trim().ToLowerInvariant()
    if ($requested -notin @('hml','prod') -or $fileEnv -notin @('hml','prod')) {
        throw "Invalid environment comparison: $RequestedEnvironment / $FileEnvironment"
    }
    if ($requested -ne $fileEnv) {
        throw "Environment mismatch: requested=$requested file=$fileEnv"
    }
    return $true
}

function Test-BranaEnvironmentContainsSensitiveData {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [object]$Config
    )

    $forbidden = @(
        'password','passwd','secret','token','jwt','access_key','secret_key',
        'session_token','database_url','connection_string','smoke_password',
        'smoke_token','owner_bypass_emails'
    )
    $found = @()
    foreach ($property in $Config.PSObject.Properties) {
        if ($forbidden -contains $property.Name.ToLowerInvariant()) {
            $found += $property.Name
        }
        if ($property.Value -is [string]) {
            if ($property.Value -match '(?i)eyJ[A-Za-z0-9_\-]{8,}\.[A-Za-z0-9_\-]{8,}\.[A-Za-z0-9_\-]{8,}') { $found += $property.Name }
            if ($property.Value -match '(?i)\b(AKIA|ASIA)[A-Z0-9]{16}\b') { $found += $property.Name }
            if ($property.Value -match '(?i)bearer\s+[A-Za-z0-9\-._~+/]+=*') { $found += $property.Name }
            if ($property.Value -match '(?i)://[^@\s]+:[^@\s]+@') { $found += $property.Name }
        }
    }
    return [pscustomobject]@{
        IsSensitive = ($found.Count -gt 0)
        Properties = @($found | Select-Object -Unique)
    }
}

function Test-BranaEnvironmentConfig {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [object]$Config
    )

    $errors = New-Object System.Collections.Generic.List[string]
    $warnings = New-Object System.Collections.Generic.List[string]
    $required = @(
        'schema_version','environment','serviceType','baselineMinutes','awsAccountId','awsRegion','ecsCluster','ecsService',
        'taskFamily','deploymentStrategy','desiredCount','minimumHealthyPercent','maximumPercent',
        'productionTargetGroupArn','publicHealthUrl','publicAppUrl','observationMinutes',
        'requestIntervalSeconds','rollbackTaskDefinition','requireCleanClone','requireImageDigest',
        'requireZeroElb503','requirePublicTargetHealthy','requireOldTaskUntilNewHealthy',
        'logGroup','runtimePlatform'
    )
    foreach ($name in $required) {
        if ($null -eq $Config.PSObject.Properties[$name]) {
            $errors.Add("Missing required property: $name")
        }
    }

    $schemaVersion = [string](Get-BranaConfigPropertyValue -InputObject $Config -Name 'schema_version')
    $environment = [string](Get-BranaConfigPropertyValue -InputObject $Config -Name 'environment')
    $serviceType = [string](Get-BranaConfigPropertyValue -InputObject $Config -Name 'serviceType')
    $baselineMinutes = [int](Get-BranaConfigPropertyValue -InputObject $Config -Name 'baselineMinutes')
    $awsAccountId = [string](Get-BranaConfigPropertyValue -InputObject $Config -Name 'awsAccountId')
    $awsRegion = [string](Get-BranaConfigPropertyValue -InputObject $Config -Name 'awsRegion')
    $deploymentStrategy = [string](Get-BranaConfigPropertyValue -InputObject $Config -Name 'deploymentStrategy')
    $canaryPercent = [int](Get-BranaConfigPropertyValue -InputObject $Config -Name 'canaryPercent')
    $bakeTimeInMinutes = [int](Get-BranaConfigPropertyValue -InputObject $Config -Name 'bakeTimeInMinutes')
    $publicHealthUrl = [string](Get-BranaConfigPropertyValue -InputObject $Config -Name 'publicHealthUrl')
    $publicAppUrl = [string](Get-BranaConfigPropertyValue -InputObject $Config -Name 'publicAppUrl')
    $minimumHealthyPercent = [int](Get-BranaConfigPropertyValue -InputObject $Config -Name 'minimumHealthyPercent')
    $maximumPercent = [int](Get-BranaConfigPropertyValue -InputObject $Config -Name 'maximumPercent')
    $desiredCount = [int](Get-BranaConfigPropertyValue -InputObject $Config -Name 'desiredCount')
    $observationMinutes = [int](Get-BranaConfigPropertyValue -InputObject $Config -Name 'observationMinutes')

    if ($schemaVersion -notin @('1.0.0','2.0.0')) { $errors.Add('schema_version must be 1.0.0 or 2.0.0') }
    if ($environment -notin @('hml','prod')) { $errors.Add('environment must be hml or prod') }
    if ($serviceType -notin @('STANDARD_ECS','EXPRESS_GATEWAY')) { $errors.Add('serviceType must be STANDARD_ECS or EXPRESS_GATEWAY') }
    if ($baselineMinutes -lt 15) { $errors.Add('baselineMinutes must be at least 15') }
    if ($awsAccountId -notmatch '^\d{12}$') { $errors.Add('awsAccountId must be 12 digits') }
    if ($awsRegion -notmatch '^[a-z]{2}-[a-z]+-\d$') { $errors.Add('awsRegion has invalid format') }
    if ($deploymentStrategy -notin @('ROLLING','CANARY')) { $errors.Add('deploymentStrategy must be ROLLING or CANARY') }
    if ($publicHealthUrl -notmatch '^https?://') { $errors.Add('publicHealthUrl must be an URL') }
    if ($publicAppUrl -notmatch '^https?://') { $errors.Add('publicAppUrl must be an URL') }
    if ($minimumHealthyPercent -lt 0 -or $minimumHealthyPercent -gt 100) { $errors.Add('minimumHealthyPercent must be between 0 and 100') }
    if ($maximumPercent -lt 100) { $errors.Add('maximumPercent must be at least 100') }
    if ($desiredCount -lt 1) { $errors.Add('desiredCount must be positive') }
    if ($observationMinutes -lt 15) { $errors.Add('observationMinutes must be at least 15') }
    if ($deploymentStrategy -eq 'CANARY') {
        if ($canaryPercent -lt 1 -or $canaryPercent -gt 100) { $errors.Add('canaryPercent must be between 1 and 100 for canary') }
        if ($bakeTimeInMinutes -lt 1) { $errors.Add('bakeTimeInMinutes must be positive for canary') }
    }
    if ($serviceType -eq 'EXPRESS_GATEWAY' -and $deploymentStrategy -eq 'ROLLING') {
        $errors.Add('ROLLING deployment strategy is not supported for ExpressGatewayServices. Configure CANARY or use a different service architecture.')
    }
    if ($deploymentStrategy -eq 'ROLLING') {
        if ($minimumHealthyPercent -ne 100) { $errors.Add('minimumHealthyPercent must be 100 for rolling') }
        if ($maximumPercent -lt 200 -and $desiredCount -eq 1) { $errors.Add('maximumPercent must be at least 200 for rolling desiredCount 1') }
    }
    foreach ($name in @('ecsCluster','ecsService','taskFamily','productionTargetGroupArn','logGroup')) {
        $value = Get-BranaConfigPropertyValue -InputObject $Config -Name $name
        if ($null -eq $value -or [string]::IsNullOrWhiteSpace([string]$value)) { $errors.Add("$name cannot be null or empty") }
    }
    $runtimePlatform = Get-BranaConfigPropertyValue -InputObject $Config -Name 'runtimePlatform'
    if ($null -eq $runtimePlatform) {
        $errors.Add('runtimePlatform is required')
    }
    else {
        $operatingSystemFamily = Get-BranaConfigPropertyValue -InputObject $runtimePlatform -Name 'operatingSystemFamily'
        $cpuArchitecture = Get-BranaConfigPropertyValue -InputObject $runtimePlatform -Name 'cpuArchitecture'
        if ($operatingSystemFamily -ne 'LINUX') { $errors.Add('runtimePlatform.operatingSystemFamily must be LINUX') }
        if ($cpuArchitecture -notin @('X86_64','ARM64')) { $errors.Add('runtimePlatform.cpuArchitecture invalid') }
    }

    $sens = Test-BranaEnvironmentContainsSensitiveData -Config $Config
    if ($sens.IsSensitive) {
        $errors.Add('Sensitive data detected in configuration')
    }
    if (Test-BranaPlaceholderValue $awsAccountId) { $warnings.Add('Placeholder account detected') }
    if (Test-BranaPlaceholderValue $publicHealthUrl) { $warnings.Add('Placeholder URL detected') }

    return [pscustomobject]@{
        IsValid = ($errors.Count -eq 0)
        Errors = @($errors)
        Warnings = @($warnings)
    }
}

function Get-BranaEnvironmentConfig {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path,
        [switch]$Validate
    )

    $content = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    $config = ConvertFrom-Json -InputObject $content -ErrorAction Stop
    if ($Validate) {
        $result = Test-BranaEnvironmentConfig -Config $config
        if (-not $result.IsValid) {
            throw ("Invalid environment configuration: " + ($result.Errors -join '; '))
        }
    }
    return $config
}

Export-ModuleMember -Function Get-BranaEnvironmentConfig,Test-BranaEnvironmentConfig,Get-BranaEnvironmentConfigSchema,Compare-BranaEnvironmentName,Test-BranaEnvironmentContainsSensitiveData
