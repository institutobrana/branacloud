Set-StrictMode -Version Latest

function New-BranaUtcTimestamp {
    return ([DateTime]::UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"))
}

function New-BranaReleaseId {
    param(
        [string]$Environment
    )

    $prefix = if ([string]::IsNullOrWhiteSpace($Environment)) { "release" } else { $Environment.Trim().ToLowerInvariant() }
    return ("{0}-{1}" -f $prefix, ([guid]::NewGuid().ToString("N")))
}

function New-BranaBuildId {
    param(
        [string]$GitCommitShort,
        [string]$Environment
    )

    $short = if ([string]::IsNullOrWhiteSpace($GitCommitShort)) { "unknown" } else { $GitCommitShort.Trim() }
    $env = if ([string]::IsNullOrWhiteSpace($Environment)) { "env" } else { $Environment.Trim().ToLowerInvariant() }
    return ("{0}-{1}-{2}" -f $env, $short, ([DateTime]::UtcNow.ToString("yyyyMMddHHmmss")))
}

function New-BranaOrderedContract {
    return [ordered]@{}
}

function Protect-BranaSensitiveText {
    [CmdletBinding()]
    param(
        [AllowNull()]
        [object]$Text
    )

    if ($null -eq $Text) {
        return $null
    }

    $value = [string]$Text
    if ([string]::IsNullOrEmpty($value)) {
        return $value
    }

    $value = [regex]::Replace($value, '(?i)\b(password|pass|token|secret|apikey|api_key|client_secret)\s*[:=]\s*([^\s;,&]+)', '$1=<redacted>')
    $value = [regex]::Replace($value, '(?i)(authorization\s*:\s*bearer)\s+[A-Za-z0-9\-._~+/]+=*', '$1 <redacted>')
    $value = [regex]::Replace($value, '(?i)\b(AKIA|ASIA)[A-Z0-9]{16}\b', '<redacted-aws-access-key>')
    $value = [regex]::Replace($value, '(?i)\b(?:eyJ[A-Za-z0-9_\-]{8,}\.[A-Za-z0-9_\-]{8,}\.[A-Za-z0-9_\-]{8,})\b', '<redacted-jwt>')
    $value = [regex]::Replace($value, '(?i)\b(jdbc|postgres(?:ql)?|mysql|sqlserver)://[^@\s]+:(.*?)@', '$1://<redacted>:<redacted>@')
    return $value
}

function Get-BranaAllowedStateTransitions {
    [CmdletBinding()]
    param()

    return [ordered]@{
        CREATED        = @('PREFLIGHT_OK', 'FAILED', 'CANCELLED')
        PREFLIGHT_OK   = @('BUILT', 'FAILED', 'CANCELLED')
        BUILT          = @('PUSHED', 'FAILED', 'CANCELLED')
        PUSHED         = @('MIGRATED', 'DEPLOYING', 'FAILED', 'CANCELLED')
        MIGRATED       = @('DEPLOYING', 'FAILED', 'CANCELLED')
        DEPLOYING      = @('VALIDATING', 'SUCCEEDED', 'FAILED', 'ROLLING_BACK', 'CANCELLED')
        VALIDATING     = @('SUCCEEDED', 'FAILED', 'ROLLING_BACK', 'CANCELLED')
        SUCCEEDED      = @()
        FAILED         = @('ROLLING_BACK', 'ROLLED_BACK', 'ROLLBACK_FAILED')
        ROLLING_BACK   = @('ROLLED_BACK', 'ROLLBACK_FAILED')
        ROLLED_BACK    = @()
        ROLLBACK_FAILED = @()
        CANCELLED      = @()
    }
}

function Test-BranaReleaseTransitionAllowed {
    param(
        [Parameter(Mandatory)]
        [string]$FromState,
        [Parameter(Mandatory)]
        [string]$ToState
    )

    $transitions = Get-BranaAllowedStateTransitions
    if (-not $transitions.Contains($FromState)) { return $false }
    return ($transitions[$FromState] -contains $ToState)
}

function New-BranaReleaseHistoryEntry {
    param(
        [string]$FromState,
        [string]$ToState,
        [string]$Result,
        [string]$Stage,
        [string]$Message,
        [string]$Operator,
        [string]$Evidence
    )

    return [ordered]@{
        timestamp    = New-BranaUtcTimestamp
        from_state   = $FromState
        to_state     = $ToState
        result       = $Result
        stage        = $Stage
        message      = $Message
        operator     = $Operator
        evidence     = $Evidence
    }
}

function ConvertTo-BranaPlainObject {
    param(
        [Parameter(Mandatory)]
        [object]$InputObject
    )

    if ($InputObject -is [string] -or $InputObject -is [ValueType]) {
        return $InputObject
    }

    if ($InputObject -is [System.Collections.IDictionary]) {
        $ordered = [ordered]@{}
        foreach ($key in $InputObject.Keys) {
            $ordered[$key] = ConvertTo-BranaPlainObject -InputObject $InputObject[$key]
        }
        return $ordered
    }

    if ($InputObject -is [System.Collections.IEnumerable] -and -not ($InputObject -is [string])) {
        $list = @()
        foreach ($item in $InputObject) {
            $list += ,(ConvertTo-BranaPlainObject -InputObject $item)
        }
        return ,$list
    }

    $orderedObject = [ordered]@{}
    foreach ($property in $InputObject.PSObject.Properties) {
        $orderedObject[$property.Name] = ConvertTo-BranaPlainObject -InputObject $property.Value
    }
    return $orderedObject
}

function Get-BranaObjectPropertyValue {
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

function Set-BranaObjectPropertyValue {
    param(
        [Parameter(Mandatory)]
        [object]$InputObject,
        [Parameter(Mandatory)]
        [string]$Name,
        [Parameter(Mandatory)]
        [object]$Value
    )

    if ($InputObject -is [System.Collections.IDictionary]) {
        $InputObject[$Name] = $Value
        return $InputObject
    }

    if ($null -eq $InputObject.PSObject.Properties[$Name]) {
        $InputObject | Add-Member -NotePropertyName $Name -NotePropertyValue $Value -Force
    }
    else {
        $InputObject.$Name = $Value
    }
    return $InputObject
}

function Test-BranaReleaseContractObject {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [object]$Contract,
        [string]$SchemaPath
    )

    $errors = New-Object System.Collections.Generic.List[string]
    $allowedStates = @(
        'CREATED','PREFLIGHT_OK','BUILT','PUSHED','MIGRATED','DEPLOYING','VALIDATING',
        'SUCCEEDED','FAILED','ROLLING_BACK','ROLLED_BACK','ROLLBACK_FAILED'
    )
    $allowedResults = @('PENDING','SUCCEEDED','FAILED','ROLLED_BACK','ROLLBACK_FAILED','CANCELLED')
    $terminalStates = @('SUCCEEDED','FAILED','ROLLED_BACK','ROLLBACK_FAILED')
    $rootRequired = @(
        'schema_version','release_id','environment','result','state','started_at','operator',
        'git_repository','git_branch','git_commit','git_commit_short','build_id',
        'image_repository','ecs_cluster','ecs_service','domain','history'
    )
    foreach ($name in $rootRequired) {
        $value = Get-BranaObjectPropertyValue -InputObject $Contract -Name $name
        if ($null -eq $value -or ($value -is [string] -and [string]::IsNullOrWhiteSpace($value))) {
            $errors.Add("Missing required property: $name")
        }
    }
    $stateValue = Get-BranaObjectPropertyValue -InputObject $Contract -Name 'state'
    $resultValue = Get-BranaObjectPropertyValue -InputObject $Contract -Name 'result'
    $historyValue = Get-BranaObjectPropertyValue -InputObject $Contract -Name 'history'
    if ($stateValue -and ($allowedStates -notcontains [string]$stateValue)) { $errors.Add("Invalid state: $stateValue") }
    if ($resultValue -and ($allowedResults -notcontains [string]$resultValue)) { $errors.Add("Invalid result: $resultValue") }
    if ($null -ne $historyValue -and @($historyValue).Count -lt 1) { $errors.Add("History must contain at least one entry") }
    if ($historyValue) {
        foreach ($entry in @($historyValue)) {
            foreach ($field in @('timestamp','from_state','to_state','result','stage','message','operator','evidence')) {
                $entryValue = Get-BranaObjectPropertyValue -InputObject $entry -Name $field
                $hasField = $false
                if ($entry -is [System.Collections.IDictionary]) {
                    $hasField = $entry.Contains($field)
                }
                else {
                    $hasField = ($null -ne $entry.PSObject.Properties[$field])
                }
                if (-not $hasField) {
                    $errors.Add("History entry missing field: $field")
                }
                elseif ($field -in @('timestamp','to_state') -and $null -eq $entryValue) {
                    $errors.Add("History entry field cannot be null: $field")
                }
            }
        }
    }
    if ($stateValue -in @('CREATED','PREFLIGHT_OK','BUILT','PUSHED','MIGRATED','DEPLOYING','VALIDATING') -and $resultValue -ne 'PENDING') {
        $errors.Add("Non-terminal state must have PENDING result")
    }
    if ($stateValue -eq 'SUCCEEDED' -and $resultValue -ne 'SUCCEEDED') {
        $errors.Add("SUCCEEDED must have SUCCEEDED result")
    }
    if ($stateValue -eq 'FAILED') {
        if ($resultValue -ne 'FAILED') { $errors.Add("FAILED must have FAILED result") }
        $failureStage = Get-BranaObjectPropertyValue -InputObject $Contract -Name 'failure_stage'
        $failureReason = Get-BranaObjectPropertyValue -InputObject $Contract -Name 'failure_reason'
        if ([string]::IsNullOrWhiteSpace([string]$failureStage) -or [string]::IsNullOrWhiteSpace([string]$failureReason)) {
            $errors.Add("FAILED state requires failure_stage and failure_reason")
        }
    }
    if ($stateValue -eq 'ROLLED_BACK' -and $resultValue -ne 'ROLLED_BACK') {
        $errors.Add("ROLLED_BACK must have ROLLED_BACK result")
    }
    if ($stateValue -eq 'ROLLBACK_FAILED' -and $resultValue -ne 'ROLLBACK_FAILED') {
        $errors.Add("ROLLBACK_FAILED must have ROLLBACK_FAILED result")
    }
    if ($stateValue -eq 'ROLLING_BACK') {
        $rollbackTaskDefinition = Get-BranaObjectPropertyValue -InputObject $Contract -Name 'rollback_task_definition'
        $rollbackImageDigest = Get-BranaObjectPropertyValue -InputObject $Contract -Name 'rollback_image_digest'
        $rollbackTargetGroup = Get-BranaObjectPropertyValue -InputObject $Contract -Name 'rollback_target_group'
        $rollbackResult = Get-BranaObjectPropertyValue -InputObject $Contract -Name 'rollback_result'
        if ([string]::IsNullOrWhiteSpace([string]$rollbackTaskDefinition) -or [string]::IsNullOrWhiteSpace([string]$rollbackImageDigest) -or [string]::IsNullOrWhiteSpace([string]$rollbackTargetGroup) -or [string]::IsNullOrWhiteSpace([string]$rollbackResult)) {
            $errors.Add("ROLLING_BACK requires rollback_task_definition, rollback_image_digest, rollback_target_group and rollback_result")
        }
    }
    if ($stateValue -in $terminalStates -and [string]::IsNullOrWhiteSpace([string](Get-BranaObjectPropertyValue -InputObject $Contract -Name 'finished_at'))) {
        $errors.Add("Terminal states must populate finished_at")
    }
    if ($SchemaPath -and (Test-Path $SchemaPath)) {
        $schemaText = Get-Content -LiteralPath $SchemaPath -Raw
        if ([string]::IsNullOrWhiteSpace($schemaText)) { $errors.Add("Schema file is empty") }
    }
    return [pscustomobject]@{
        IsValid = ($errors.Count -eq 0)
        Errors  = @($errors)
    }
}

function Test-BranaReleaseContract {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path,
        [string]$SchemaPath
    )

    $contract = Read-BranaJson -Path $Path
    return Test-BranaReleaseContractObject -Contract $contract -SchemaPath $SchemaPath
}

function Read-BranaJson {
    param([Parameter(Mandatory)][string]$Path)
    $json = Get-Content -LiteralPath $Path -Raw
    return (ConvertFrom-Json -InputObject $json -ErrorAction Stop)
}

function Write-BranaJsonAtomic {
    param(
        [Parameter(Mandatory)]
        [string]$Path,
        [Parameter(Mandatory)]
        [object]$Object
        ,
        [switch]$AllowOverwrite
    )

    $directory = Split-Path -Parent $Path
    if ($directory -and -not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }
    $tempPath = Join-Path $directory ('.' + [guid]::NewGuid().ToString('N') + '.tmp')
    try {
        if ((Test-Path $Path) -and -not $AllowOverwrite) {
            throw "Destination already exists: $Path"
        }
        $json = $Object | ConvertTo-Json -Depth 32
        Set-Content -LiteralPath $tempPath -Value $json -Encoding UTF8
        $roundTrip = Read-BranaJson -Path $tempPath
        $validation = Test-BranaReleaseContractObject -Contract $roundTrip
        if (-not $validation.IsValid) {
            throw ("Contract validation failed: " + ($validation.Errors -join '; '))
        }
        Move-Item -LiteralPath $tempPath -Destination $Path -Force
    }
    finally {
        if (Test-Path $tempPath) {
            Remove-Item -LiteralPath $tempPath -Force -ErrorAction SilentlyContinue
        }
    }
}

function New-BranaReleaseContract {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Environment,
        [Parameter(Mandatory)]
        [string]$GitRepository,
        [Parameter(Mandatory)]
        [string]$GitBranch,
        [Parameter(Mandatory)]
        [string]$GitCommit,
        [Parameter(Mandatory)]
        [string]$Operator,
        [Parameter(Mandatory)]
        [string]$ImageRepository,
        [Parameter(Mandatory)]
        [string]$EcsCluster,
        [Parameter(Mandatory)]
        [string]$EcsService,
        [Parameter(Mandatory)]
        [string]$Domain,
        [Parameter(Mandatory)]
        [string]$OutputPath,
        [string]$GitRemoteStatus = $null,
        [string]$SnapshotPath = $null,
        [string]$ImageTag = $null,
        [string]$ImageDigest = $null,
        [string]$ImageArchitecture = $null,
        [string]$TaskDefinitionBefore = $null,
        [string]$TaskDefinitionAfter = $null,
        [string]$DeploymentId = $null,
        [string]$TargetGroupBefore = $null,
        [string]$TargetGroupAfter = $null,
        [string]$ListenerRule = $null,
        [string]$MigrationVersionBefore = $null,
        [string]$MigrationVersionAfter = $null,
        [string]$HealthStatus = $null,
        [string]$PublicSmokeStatus = $null,
        [string]$AuthenticatedSmokeStatus = $null,
        [string]$AuthorizationPositiveStatus = $null,
        [string]$AuthorizationNegativeStatus = $null,
        [string]$RollbackTaskDefinition = $null,
        [string]$RollbackImageDigest = $null,
        [string]$RollbackTargetGroup = $null,
        [string]$RollbackResult = $null,
        [string]$FailureStage = $null,
        [string]$FailureReason = $null,
        [string]$LogsPath = $null,
        [string]$AwsAccount = $null,
        [string]$AwsRegion = $null,
        [string]$ReleaseNotes = $null,
        [switch]$DryRun,
        [string]$CreatedByToolVersion = "Brana.Release/1.0.0"
    )

    if ($Environment -notmatch '^(homologacao|producao|desenvolvimento|staging|teste)$') {
        throw "Invalid environment: $Environment"
    }
    if ($GitCommit -notmatch '^[0-9a-fA-F]{7,40}$') {
        throw "Invalid git commit SHA: $GitCommit"
    }
    if ($Domain -match '://') {
        throw "Domain must not include a protocol: $Domain"
    }
    if ($Domain -match '/') {
        throw "Domain must be a bare host name: $Domain"
    }

    $releaseId = New-BranaReleaseId -Environment $Environment
    $shortCommit = if ($GitCommit.Length -ge 7) { $GitCommit.Substring(0, 7) } else { $GitCommit }
    $buildId = New-BranaBuildId -GitCommitShort $shortCommit -Environment $Environment
    $now = New-BranaUtcTimestamp

    $contract = [ordered]@{
        schema_version = '1.0.0'
        release_id = $releaseId
        environment = $Environment
        result = 'PENDING'
        state = 'CREATED'
        started_at = $now
        finished_at = $null
        operator = $Operator
        git_repository = $GitRepository
        git_branch = $GitBranch
        git_commit = $GitCommit
        git_commit_short = $shortCommit
        git_remote_status = $GitRemoteStatus
        build_id = $buildId
        snapshot_path = $SnapshotPath
        image_repository = $ImageRepository
        image_tag = $ImageTag
        image_digest = $ImageDigest
        image_architecture = $ImageArchitecture
        ecs_cluster = $EcsCluster
        ecs_service = $EcsService
        task_definition_before = $TaskDefinitionBefore
        task_definition_after = $TaskDefinitionAfter
        deployment_id = $DeploymentId
        target_group_before = $TargetGroupBefore
        target_group_after = $TargetGroupAfter
        listener_rule = $ListenerRule
        domain = $Domain
        migration_version_before = $MigrationVersionBefore
        migration_version_after = $MigrationVersionAfter
        health_status = $HealthStatus
        public_smoke_status = $PublicSmokeStatus
        authenticated_smoke_status = $AuthenticatedSmokeStatus
        authorization_positive_status = $AuthorizationPositiveStatus
        authorization_negative_status = $AuthorizationNegativeStatus
        rollback_task_definition = $RollbackTaskDefinition
        rollback_image_digest = $RollbackImageDigest
        rollback_target_group = $RollbackTargetGroup
        rollback_result = $RollbackResult
        failure_stage = $FailureStage
        failure_reason = $FailureReason
        logs_path = $LogsPath
        aws_account = $AwsAccount
        aws_region = $AwsRegion
        release_notes = $ReleaseNotes
        dry_run = [bool]$DryRun
        created_by_tool_version = $CreatedByToolVersion
        updated_at = $now
        history = @(
            New-BranaReleaseHistoryEntry -FromState $null -ToState 'CREATED' -Result 'PENDING' -Stage 'bootstrap' -Message 'Release contract created' -Operator $Operator -Evidence $SnapshotPath
        )
    }

    $validation = Test-BranaReleaseContractObject -Contract ([pscustomobject]$contract)
    if (-not $validation.IsValid) {
        throw ("Contract validation failed: " + ($validation.Errors -join '; '))
    }

    if (-not $DryRun) {
        Write-BranaJsonAtomic -Path $OutputPath -Object $contract
    }

    return [pscustomobject]$contract
}

function Get-BranaReleaseContract {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path
    )

    $contract = Read-BranaJson -Path $Path
    $validation = Test-BranaReleaseContractObject -Contract $contract
    if (-not $validation.IsValid) {
        throw ("Invalid release contract: " + ($validation.Errors -join '; '))
    }
    return $contract
}

function Set-BranaReleaseState {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path,
        [Parameter(Mandatory)]
        [string]$State,
        [Parameter(Mandatory)]
        [string]$Result,
        [string]$Stage = $null,
        [string]$Message = $null,
        [string]$Operator = $null,
        [string]$Evidence = $null,
        [string]$FailureStage = $null,
        [string]$FailureReason = $null,
        [string]$RollbackTaskDefinition = $null,
        [string]$RollbackImageDigest = $null,
        [string]$RollbackTargetGroup = $null,
        [string]$RollbackResult = $null
    )

    $contract = Read-BranaJson -Path $Path
    $currentState = [string](Get-BranaObjectPropertyValue -InputObject $contract -Name 'state')
    if (-not (Test-BranaReleaseTransitionAllowed -FromState $currentState -ToState $State)) {
        throw "Transition not allowed: $currentState -> $State"
    }

    $targetResult = $Result
    if ($State -eq 'SUCCEEDED') { $targetResult = 'SUCCEEDED' }
    elseif ($State -eq 'FAILED') { $targetResult = 'FAILED' }
    elseif ($State -eq 'ROLLED_BACK') { $targetResult = 'ROLLED_BACK' }
    elseif ($State -eq 'ROLLBACK_FAILED') { $targetResult = 'ROLLBACK_FAILED' }
    $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'state' -Value $State
    $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'result' -Value $targetResult
    if ($State -eq 'FAILED') {
        $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'failure_stage' -Value $FailureStage
        $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'failure_reason' -Value $FailureReason
    }
    if ($State -eq 'ROLLING_BACK') {
        $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'rollback_task_definition' -Value $RollbackTaskDefinition
        $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'rollback_image_digest' -Value $RollbackImageDigest
        $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'rollback_target_group' -Value $RollbackTargetGroup
        $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'rollback_result' -Value $RollbackResult
    }
    $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'updated_at' -Value (New-BranaUtcTimestamp)
    if ($targetResult -in @('SUCCEEDED', 'FAILED', 'ROLLED_BACK', 'ROLLBACK_FAILED', 'CANCELLED')) {
        $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'finished_at' -Value (Get-BranaObjectPropertyValue -InputObject $contract -Name 'updated_at')
    }
    if (-not $contract.history) {
        $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'history' -Value @()
    }
    $history = @($contract.history)
    $history += New-BranaReleaseHistoryEntry -FromState $currentState -ToState $State -Result $Result -Stage $Stage -Message $Message -Operator $Operator -Evidence $Evidence
    $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'history' -Value $history

    $validation = Test-BranaReleaseContractObject -Contract $contract
    if (-not $validation.IsValid) {
        throw ("Invalid release contract after state update: " + ($validation.Errors -join '; '))
    }

    Write-BranaJsonAtomic -Path $Path -Object $contract -AllowOverwrite
    return $contract
}

function Update-BranaReleaseContract {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path,
        [Parameter(Mandatory)]
        [hashtable]$Updates
    )

    $contract = Read-BranaJson -Path $Path
    $immutable = @(
        'schema_version','release_id','environment','git_repository','git_branch','git_commit',
        'git_commit_short','started_at','operator','image_repository','ecs_cluster','ecs_service','domain',
        'result','history','finished_at','updated_at'
    )
    $blocked = @('state')
    foreach ($key in $Updates.Keys) {
        if ($blocked -contains $key) {
            throw "Direct state changes are not allowed via Update-BranaReleaseContract: $key"
        }
        if ($immutable -contains $key) {
            throw "Immutable field cannot be updated: $key"
        }
        if (-not $contract.PSObject.Properties.Name.Contains($key)) {
            throw "Unknown contract field: $key"
        }
        $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name $key -Value $Updates[$key]
    }
    $contract = Set-BranaObjectPropertyValue -InputObject $contract -Name 'updated_at' -Value (New-BranaUtcTimestamp)
    $validation = Test-BranaReleaseContractObject -Contract $contract
    if (-not $validation.IsValid) {
        throw ("Invalid release contract after update: " + ($validation.Errors -join '; '))
    }
    Write-BranaJsonAtomic -Path $Path -Object $contract -AllowOverwrite
    return $contract
}

function Get-BranaRollingDeploymentPlan {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [object]$Config,
        [string]$CurrentTaskDefinition = $null,
        [string]$CurrentImageDigest = $null
    )

    $updateServiceCommand = @(
        'aws ecs update-service',
        ('--cluster {0}' -f $Config.ecsCluster),
        ('--service {0}' -f $Config.ecsService),
        ('--task-definition <NEW_TASK_DEFINITION>'),
        ('--region {0}' -f $Config.awsRegion)
    ) -join ' '

    $rollbackCommand = @(
        'aws ecs update-service',
        ('--cluster {0}' -f $Config.ecsCluster),
        ('--service {0}' -f $Config.ecsService),
        ('--task-definition {0}' -f $Config.rollbackTaskDefinition),
        ('--region {0}' -f $Config.awsRegion)
    ) -join ' '

    return [pscustomobject]@{
        DeploymentStrategy = 'ROLLING'
        DesiredCount = [int]$Config.desiredCount
        MinimumHealthyPercent = [int]$Config.minimumHealthyPercent
        MaximumPercent = [int]$Config.maximumPercent
        ProductionTargetGroupArn = $Config.productionTargetGroupArn
        PublicHealthUrl = $Config.publicHealthUrl
        PublicAppUrl = $Config.publicAppUrl
        ObservationMinutes = [int]$Config.observationMinutes
        RequestIntervalSeconds = [int]$Config.requestIntervalSeconds
        RequireCleanClone = [bool]$Config.requireCleanClone
        RequireImageDigest = [bool]$Config.requireImageDigest
        RequireZeroElb503 = [bool]$Config.requireZeroElb503
        RequirePublicTargetHealthy = [bool]$Config.requirePublicTargetHealthy
        RequireOldTaskUntilNewHealthy = [bool]$Config.requireOldTaskUntilNewHealthy
        CurrentTaskDefinition = $CurrentTaskDefinition
        CurrentImageDigest = $CurrentImageDigest
        UpdateServiceCommand = $updateServiceCommand
        RollbackCommand = $rollbackCommand
        MonitorCommands = @(
            ('aws ecs describe-services --cluster {0} --services {1} --region {2}' -f $Config.ecsCluster, $Config.ecsService, $Config.awsRegion),
            ('curl.exe -s -o NUL -w "%{{http_code}}" {0}' -f $Config.publicHealthUrl),
            ('curl.exe -s -o NUL -w "%{{http_code}}" {0}' -f $Config.publicAppUrl)
        )
    }
}

function Test-BranaRollingReleaseConfig {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [object]$Config
    )

    $errors = New-Object System.Collections.Generic.List[string]
    if ($Config.deploymentStrategy -ne 'ROLLING') { $errors.Add('deploymentStrategy must be ROLLING') }
    if ([int]$Config.desiredCount -lt 1) { $errors.Add('desiredCount must be positive') }
    if ([int]$Config.minimumHealthyPercent -ne 100) { $errors.Add('minimumHealthyPercent must be 100') }
    if ([int]$Config.maximumPercent -lt 200 -and [int]$Config.desiredCount -eq 1) { $errors.Add('maximumPercent must be at least 200 for desiredCount 1') }
    if ([int]$Config.observationMinutes -lt 15) { $errors.Add('observationMinutes must be at least 15') }
    if ([string]::IsNullOrWhiteSpace([string]$Config.productionTargetGroupArn)) { $errors.Add('productionTargetGroupArn is required') }
    if ([string]::IsNullOrWhiteSpace([string]$Config.publicHealthUrl)) { $errors.Add('publicHealthUrl is required') }
    if ([string]::IsNullOrWhiteSpace([string]$Config.publicAppUrl)) { $errors.Add('publicAppUrl is required') }
    return [pscustomobject]@{
        IsValid = ($errors.Count -eq 0)
        Errors = @($errors)
    }
}

function Test-BranaRollingPreflight {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string]$RepositoryPath,
        [Parameter(Mandatory)][object]$Config
    )

    $errors = New-Object System.Collections.Generic.List[string]
    $git = $null
    try {
        $git = Get-BranaGitRepositorySummary -Path $RepositoryPath -RequiredPaths @('ops/release/brana-release.ps1','ops/release/Brana.Release.psm1','ops/release/config/hml.json','ops/release/schemas/release-contract.schema.json')
    }
    catch {
        $errors.Add((Protect-BranaSensitiveText $_.Exception.Message))
    }
    $configResult = Test-BranaEnvironmentConfig -Config $Config
    $rollingResult = Test-BranaRollingReleaseConfig -Config $Config
    if (-not $configResult.IsValid) { $errors.AddRange($configResult.Errors) }
    if (-not $rollingResult.IsValid) { $errors.AddRange($rollingResult.Errors) }
    if ($git) {
        if ($git.WorktreeDirty -or $git.StageDirty) { $errors.Add('git worktree must be clean') }
        if ($git.IsDetachedHead) { $errors.Add('git must not be detached') }
    }
    return [pscustomobject]@{
        IsValid = ($errors.Count -eq 0)
        Errors = @($errors)
        GitSummary = $git
        ConfigValidation = $configResult
        RollingValidation = $rollingResult
    }
}

Export-ModuleMember -Function New-BranaReleaseContract,Get-BranaReleaseContract,Test-BranaReleaseContract,Set-BranaReleaseState,Update-BranaReleaseContract,Get-BranaAllowedStateTransitions,Protect-BranaSensitiveText,Get-BranaRollingDeploymentPlan,Test-BranaRollingReleaseConfig,Test-BranaRollingPreflight
