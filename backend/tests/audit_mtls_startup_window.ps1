[CmdletBinding()]
param(
    [string] $XmlPath = 'C:\ProgramData\BranaCloude\mtls\BranaCloudeMtls.xml',
    [datetime] $WindowStart = [datetime]'2026-10-01T10:58:00',
    [datetime] $WindowEnd = [datetime]'2026-10-01T11:01:00'
)
$ErrorActionPreference = 'Stop'

function Get-SafeCode {
    param([string] $Text)
    if ([string]::IsNullOrWhiteSpace($Text)) { return $null }
    if ($Text -match '(?i)access denied|permission denied|0x80070005') { return 'ACCESS_DENIED' }
    if ($Text -match '(?i)python.*(start|spawn|created)|process.*python') { return 'PYTHON_STARTED' }
    if ($Text -match '(?i)(entrypoint|python).*(exception|traceback|fatal)') { return 'PYTHON_ENTRYPOINT_FAILURE' }
    if ($Text -match '(?i)(winsw|wrapper).*(start|launch|run)') { return 'WRAPPER_STARTED' }
    if ($Text -match '(?i)(winsw|wrapper).*(stop|exit|terminated|shutdown)') { return 'WRAPPER_EXIT' }
    return $null
}

function Get-SafeExitCode {
    param([string] $Text)
    if ([string]::IsNullOrWhiteSpace($Text)) { return $null }
    $m = [regex]::Match($Text, '(?i)(?:exit(?:ed| code)?|return(?:ed)?)[^0-9a-fx]{0,12}(0x[0-9a-f]+|[0-9]+)')
    if (-not $m.Success) { return $null }
    return ('EXIT_CODE_' + $m.Groups[1].Value.ToUpperInvariant())
}

function Resolve-ConfiguredLogPath {
    param([string] $Path)
    $doc = [xml](Get-Content -LiteralPath $Path -Raw -ErrorAction Stop)
    $value = [string]$doc.service.logpath
    if ([string]::IsNullOrWhiteSpace($value)) { return $null }
    if ([IO.Path]::IsPathRooted($value)) { return [IO.Path]::GetFullPath($value) }
    return [IO.Path]::GetFullPath((Join-Path (Split-Path -Parent $Path) $value))
}

function Get-LogKind {
    param([System.IO.FileInfo] $File)
    $n = $File.Name.ToLowerInvariant()
    if ($n -match 'winsw|wrapper|service') { return 'WRAPPER' }
    if ($n -match 'stderr|error|err') { return 'STDERR' }
    if ($n -match 'stdout|output|out') { return 'STDOUT' }
    return 'UNKNOWN_LOG'
}

function Get-SanitizedError {
    param([string] $Text)
    if ([string]::IsNullOrWhiteSpace($Text)) { return $null }
    $code = $null
    $class = $null
    if ($Text -match '(?i)(0x[0-9a-f]{4,8}|HRESULT\s*[:=]\s*[-0-9]+|Win32\s*(?:error)?\s*[:=]\s*[-0-9]+)') { $code = $Matches[1].ToUpperInvariant() }
    elseif ($Text -match '(?i)(?:exit(?:ed| code)?|return(?:ed)?)[^0-9a-fx]{0,12}(0x[0-9a-f]+|[0-9]+)') { $code = ('EXIT_CODE_' + $Matches[1].ToUpperInvariant()) }
    if ($Text -match '(?i)([A-Za-z_][A-Za-z0-9_.]*Exception)') { $class = $Matches[1] }
    elseif ($Text -match '(?i)\b(FATAL|ERROR)\b') { $class = $Matches[1].ToUpperInvariant() }
    if (-not $code -and -not $class) { return $null }
    if (-not $code) { $code = 'CODE_UNAVAILABLE' }
    if (-not $class) { $class = 'CLASS_UNAVAILABLE' }
    [pscustomobject]@{ Code=$code; Class=$class }
}

$logFound = $false
$wrapperStarted = $false
$pythonStarted = $false
$firstExitCode = $null
$firstFailure = $null
$safeCode = $null
$firstLogErrorSource = 'UNDETERMINED'
$firstLogErrorCode = 'UNDETERMINED'
$wrapperSource = 'UNDETERMINED'
$pythonSource = 'UNDETERMINED'
$failureSource = 'UNDETERMINED'
$pythonIndependent = $false
$logSummary = @()

try {
    $logPath = Resolve-ConfiguredLogPath $XmlPath
    $logFiles = @()
    if ($logPath -and (Test-Path -LiteralPath $logPath -PathType Container)) {
        $logFiles = @(Get-ChildItem -LiteralPath $logPath -File -Force -ErrorAction Stop | Where-Object {
            $_.LastWriteTime -ge $WindowStart -and $_.LastWriteTime -le $WindowEnd
        } | Sort-Object LastWriteTime | Select-Object -First 3)
    }
    if ($logFiles.Count -gt 0) { $logFound = $true }
    $logSummary = @($logFiles | ForEach-Object {
        [pscustomobject]@{ Type=$_.Extension; Modified=$_.LastWriteTime.ToString('o') }
    })

    $events = @()
    foreach ($name in @('Application','System')) {
        try {
            $events += @(Get-WinEvent -FilterHashtable @{LogName=$name;StartTime=$WindowStart;EndTime=$WindowEnd} -ErrorAction Stop | Where-Object {
                $_.ProviderName -match '(?i)WinSW|Python|Application Error|Windows Error Reporting|Service Control Manager' -or
                $_.Id -in @(7034,7000,1000,1001,1026)
            })
        } catch { }
    }

    foreach ($file in $logFiles) {
        try {
            $kind = Get-LogKind $file
            $lines = @(Get-Content -LiteralPath $file.FullName -Tail 80 -ErrorAction Stop)
            foreach ($line in $lines) {
                $code = Get-SafeCode $line
                if ($code -eq 'WRAPPER_STARTED') { $wrapperStarted = $true; $wrapperSource = "LOG:$($file.Extension)" }
                if ($code -eq 'PYTHON_STARTED' -and $line -match '(?i)(?:python|python\.exe).*(?:pid|process id|spawned|child process)') {
                    $pythonIndependent = $true
                    $pythonSource = "LOG:$($file.Extension)"
                }
                if (-not $firstExitCode) { $firstExitCode = Get-SafeExitCode $line }
                if (-not $firstFailure -and $code -in @('ACCESS_DENIED','PYTHON_ENTRYPOINT_FAILURE','WRAPPER_EXIT')) {
                    $firstFailure = if ($code -eq 'WRAPPER_EXIT') { 'WRAPPER' } elseif ($code -eq 'PYTHON_ENTRYPOINT_FAILURE') { 'PYTHON_ENTRYPOINT' } else { 'ACCESS' }
                    $safeCode = $code
                    $failureSource = "LOG:$($file.Extension)"
                }
                if ($firstLogErrorSource -eq 'UNDETERMINED' -and $line -match '(?i)\b(ERROR|FATAL|exception|traceback)\b') {
                    $err = Get-SanitizedError $line
                    if ($err) {
                        $firstLogErrorSource = $kind
                        $firstLogErrorCode = $err.Code
                    }
                }
            }
        } catch { }
    }

    foreach ($event in ($events | Sort-Object TimeCreated)) {
        $code = Get-SafeCode ([string]$event.Id + ' ' + [string]$event.ProviderName)
        if ($code -eq 'WRAPPER_STARTED') { $wrapperStarted = $true; $wrapperSource = "EVENT:$($event.ProviderName):$($event.Id)" }
        if (-not $firstFailure -and $event.Id -eq 7034) { $safeCode = 'UNEXPECTED_TERMINATION'; $failureSource = "EVENT:$($event.ProviderName):$($event.Id)" }
        if (-not $firstExitCode -and $event.Id -in @(1000,1001,1026)) { $firstExitCode = 'EXIT_CODE_UNAVAILABLE' }
    }
} catch {
    $safeCode = 'AUDIT_READ_FAILED'
}

if (-not $firstFailure) { $firstFailure = 'UNDETERMINED' }
if (-not $safeCode) { $safeCode = 'UNDETERMINED' }
if (-not $firstExitCode) { $firstExitCode = 'UNDETERMINED' }
$pythonStarted = $pythonIndependent

@(
    "LOG_FOUND=$logFound"
    "WRAPPER_STARTED=$wrapperStarted"
    "PYTHON_STARTED=$pythonStarted"
    "FIRST_EXIT_CODE=$firstExitCode"
    "FIRST_FAILURE_PHASE=$firstFailure"
    "SANITIZED_CODE=$safeCode"
    "WRAPPER_SOURCE=$wrapperSource"
    "PYTHON_SOURCE=$pythonSource"
    "FIRST_FAILURE_SOURCE=$failureSource"
    "FIRST_LOG_ERROR_SOURCE=$firstLogErrorSource"
    "FIRST_LOG_ERROR_CODE=$firstLogErrorCode"
    "LOG_FILE_COUNT=$($logSummary.Count)"
    ($logSummary | ForEach-Object { "LOG_FILE_TYPE=$($_.Type);MODIFIED=$($_.Modified)" })
) -join [Environment]::NewLine
