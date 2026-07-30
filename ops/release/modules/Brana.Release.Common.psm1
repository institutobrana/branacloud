Set-StrictMode -Version Latest

function Test-BranaNullOrWhiteSpace {
    [CmdletBinding()]
    param(
        [AllowNull()]
        [object]$Value
    )

    return [string]::IsNullOrWhiteSpace([string]$Value)
}

function New-BranaCheckResult {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Name,
        [Parameter(Mandatory)]
        [string]$Category,
        [Parameter(Mandatory)]
        [string]$Status,
        [Parameter(Mandatory)]
        [string]$Severity,
        [Parameter(Mandatory)]
        [string]$Message,
        [object[]]$Evidence = @(),
        [int]$DurationMs = 0
    )

    $allowedStatuses = @('PASS','FAIL','WARN','SKIP','BLOCKED')
    $allowedSeverities = @('BLOCKING','NON_BLOCKING','INFO')
    if ($allowedStatuses -notcontains $Status) { throw "Invalid status: $Status" }
    if ($allowedSeverities -notcontains $Severity) { throw "Invalid severity: $Severity" }
    if ($DurationMs -lt 0) { throw 'DurationMs must be greater than or equal to zero' }
    if ($null -eq $Evidence) { $Evidence = @() }

    return [pscustomobject]@{
        Name = $Name
        Category = $Category
        Status = $Status
        Severity = $Severity
        Message = $Message
        Evidence = @($Evidence)
        DurationMs = [int]$DurationMs
    }
}

function Get-BranaExitCodes {
    [CmdletBinding()]
    param()

    return [ordered]@{
        SUCCESS = 0
        GENERIC_FAILURE = 1
        INVALID_PARAMETERS = 2
        INVALID_CONFIGURATION = 3
        INVALID_GIT_STATE = 4
        MISSING_TOOL = 5
        INVALID_AWS_IDENTITY = 6
        AWS_INFRASTRUCTURE_MISMATCH = 7
        INVALID_RELEASE_CONTRACT = 8
        MODE_NOT_IMPLEMENTED = 9
        RECOVERABLE_BLOCK = 10
    }
}

function Get-BranaExitCode {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Name
    )

    $codes = Get-BranaExitCodes
    if (-not $codes.Contains($Name)) {
        throw "Unknown exit code name: $Name"
    }
    return [int]$codes[$Name]
}

function ConvertTo-BranaNormalizedPath {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Path,
        [switch]$RequireExists
    )

    $resolved = $Path
    if (Test-Path -LiteralPath $Path) {
        $resolved = (Resolve-Path -LiteralPath $Path).Path
    }
    elseif ($RequireExists) {
        throw "Path not found: $Path"
    }
    else {
        $resolved = [System.IO.Path]::GetFullPath($Path)
    }
    return ($resolved -replace '\\','/')
}

function Test-BranaPlaceholderValue {
    [CmdletBinding()]
    param(
        [AllowNull()]
        [object]$Value
    )

    if ($null -eq $Value) { return $false }
    $text = [string]$Value
    if ([string]::IsNullOrWhiteSpace($text)) { return $false }
    $patterns = @(
        '(?i)\bTODO\b',
        '(?i)\bCHANGE_ME\b',
        '(?i)\bCHANGEME\b',
        '(?i)\bREPLACE_ME\b',
        '(?i)\bEXAMPLE\b',
        '(?i)\b000000000000\b',
        '(?i)\bTBD\b',
        '(?i)\bYOUR_[A-Z0-9_]*\b',
        '^\<.*\>$',
        '^\$\{[^}]+\}$'
    )
    foreach ($pattern in $patterns) {
        if ($text -match $pattern) { return $true }
    }
    return $false
}

function Get-BranaPlaceholderValue {
    [CmdletBinding()]
    param(
        [AllowNull()]
        [object]$Value
    )

    return (Test-BranaPlaceholderValue -Value $Value)
}

function Protect-BranaObject {
    [CmdletBinding()]
    param(
        [AllowNull()]
        [object]$InputObject,
        [int]$Depth = 0
    )

    if ($null -eq $InputObject) { return $null }
    if ($Depth -gt 16) { return '<max-depth-reached>' }
    if ($InputObject -is [string]) {
        try {
            if (Get-Command Protect-BranaSensitiveText -ErrorAction SilentlyContinue) {
                return (Protect-BranaSensitiveText -Text $InputObject)
            }
        } catch { }
        return $InputObject
    }
    if ($InputObject -is [System.Collections.IDictionary]) {
        $clone = [ordered]@{}
        foreach ($key in $InputObject.Keys) {
            $value = $InputObject[$key]
            if ($key -match '(?i)password|passwd|token|secret|authorization|access_key|secret_key|connection_string|database_url') {
                $clone[$key] = '<redacted>'
            }
            else {
                $clone[$key] = Protect-BranaObject -InputObject $value -Depth ($Depth + 1)
            }
        }
        return $clone
    }
    if ($InputObject -is [System.Collections.IEnumerable] -and -not ($InputObject -is [string])) {
        $items = @()
        foreach ($item in $InputObject) {
            $items += ,(Protect-BranaObject -InputObject $item -Depth ($Depth + 1))
        }
        return ,$items
    }
    $properties = $InputObject.PSObject.Properties
    if (@($properties).Count -gt 0) {
        $clone = [ordered]@{}
        foreach ($property in $properties) {
            $name = $property.Name
            $value = $property.Value
            if ($name -match '(?i)password|passwd|token|secret|authorization|access_key|secret_key|connection_string|database_url') {
                $clone[$name] = '<redacted>'
            }
            else {
                $clone[$name] = Protect-BranaObject -InputObject $value -Depth ($Depth + 1)
            }
        }
        return [pscustomobject]$clone
    }
    return $InputObject
}

Export-ModuleMember -Function New-BranaCheckResult,Test-BranaNullOrWhiteSpace,Get-BranaExitCodes,Get-BranaExitCode,ConvertTo-BranaNormalizedPath,Test-BranaPlaceholderValue,Get-BranaPlaceholderValue,Protect-BranaObject
