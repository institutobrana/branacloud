[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repair = Join-Path $PSScriptRoot '..\scripts\repair_mtls_config_json.ps1'
$root = Join-Path $env:TEMP ('brana-config-repair-test-' + [guid]::NewGuid().ToString('N'))

function Hash([string]$Path) {
    (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant()
}

function Assert-Restricted([string]$Path) {
    $result = & icacls.exe $Path 2>$null
    if ($LASTEXITCODE -ne 0) { throw 'ACL_QUERY_FAILED' }
    $text = ($result -join "`n").ToLowerInvariant()
    if ($text -match 'builtin\\users|authenticated users|everyone|usuários') {
        throw 'ACL_BROAD_ACCESS'
    }
}

function Run-Repair([string]$Source, [string]$Destination) {
    $capture = Join-Path $root ('capture-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $capture -Force | Out-Null
    $stdout = Join-Path $capture 'stdout.txt'
    $stderr = Join-Path $capture 'stderr.txt'
    $quote = { param([string]$Value) '"' + $Value.Replace('"','\"') + '"' }
    $args = @('-NoProfile','-ExecutionPolicy','RemoteSigned','-File',(& $quote $repair),
        '-Source',(& $quote $Source),'-Destination',(& $quote $Destination),'-PythonPath','synthetic-python.exe')
    $process = Start-Process -FilePath 'powershell.exe' -ArgumentList $args `
        -RedirectStandardOutput $stdout -RedirectStandardError $stderr -WindowStyle Hidden -Wait -PassThru
    $stdoutText = if (Test-Path -LiteralPath $stdout) { Get-Content -LiteralPath $stdout -Raw } else { '' }
    $stderrText = if (Test-Path -LiteralPath $stderr) { Get-Content -LiteralPath $stderr -Raw } else { '' }
    $output = @($stdoutText,$stderrText)
    $exitCode = $process.ExitCode
    $allowed = @(
        'MTLS_CONFIG_REPAIR_DESTINATION_EXISTS',
        'MTLS_CONFIG_REPAIR_SOURCE_MISSING',
        'MTLS_CONFIG_REPAIR_ACL_FAILED',
        'MTLS_CONFIG_REPAIR_HASH_MISMATCH',
        'MTLS_CONFIG_REPAIR_DESTINATION_HASH_MISMATCH'
    )
    $formatted = $output -join "`n"
    $tokens = @($allowed | Where-Object { [regex]::IsMatch($formatted, "(?<![A-Z0-9_])$([regex]::Escape($_))(?![A-Z0-9_])") })
    Remove-Item -LiteralPath $capture -Recurse -Force -ErrorAction SilentlyContinue
    [pscustomobject]@{
        ExitCode = $exitCode
        StdoutLines = if($stdoutText){ @($stdoutText -split "`r?`n" | ? { $_ -ne '' }).Count }else{0}
        StderrLines = if($stderrText){ @($stderrText -split "`r?`n" | ? { $_ -ne '' }).Count }else{0}
        Tokens = $tokens
    }
}

try {
    New-Item -ItemType Directory -Path $root -Force | Out-Null

    # Sucesso: origem e destino têm exatamente o mesmo hash.
    $success = Join-Path $root 'success'
    $source = Join-Path $success 'provisioned\config\mtls-service.json'
    $destination = Join-Path $success 'config\mtls-service.json'
    New-Item -ItemType Directory -Path (Split-Path $source) -Force | Out-Null
    [IO.File]::WriteAllText($source, '{"synthetic":true,"bind":"127.0.0.1:8766"}', (New-Object Text.UTF8Encoding($false)))
    $positive = Run-Repair $source $destination
    if ($positive.ExitCode -ne 0 -or @($positive.Tokens).Count -ne 0) { throw 'POSITIVE_REPAIR_FAILED' }
    if ((Hash $source) -ne (Hash $destination)) { throw 'HASH_MISMATCH' }
    Assert-Restricted $destination
    if (@(Get-ChildItem (Split-Path $destination) -Filter '*.tmp' -Force).Count -ne 0) { throw 'TEMPORARY_LEFT_SUCCESS' }
    'CONFIG_REPAIR_SUCCESS=PASS'

    # Destino preexistente: deve falhar sem substituir o conteúdo.
    $existing = Join-Path $root 'existing'
    $existingSource = Join-Path $existing 'source.json'
    $existingDestination = Join-Path $existing 'config\mtls-service.json'
    New-Item -ItemType Directory -Path (Split-Path $existingDestination) -Force | Out-Null
    [IO.File]::WriteAllText($existingSource, '{"synthetic":"new"}')
    [IO.File]::WriteAllText($existingDestination, '{"synthetic":"old"}')
    $oldHash = Hash $existingDestination
    $existingResult = Run-Repair $existingSource $existingDestination
    if ($existingResult.ExitCode -eq 0 -or @($existingResult.Tokens).Count -ne 1 -or $existingResult.Tokens[0] -ne 'MTLS_CONFIG_REPAIR_DESTINATION_EXISTS') { throw 'EXISTING_DESTINATION_CODE_INVALID' }
    "DESTINATION_EXISTING_EXIT=$($existingResult.ExitCode);STDOUT_LINES=$($existingResult.StdoutLines);STDERR_LINES=$($existingResult.StderrLines);TOKEN=MTLS_CONFIG_REPAIR_DESTINATION_EXISTS"
    if ((Hash $existingDestination) -ne $oldHash) { throw 'EXISTING_DESTINATION_CHANGED' }
    'CONFIG_REPAIR_EXISTING_DESTINATION=PASS'

    # Origem ausente.
    $missing = Join-Path $root 'missing\source.json'
    $missingResult = Run-Repair $missing (Join-Path $root 'missing\config\mtls-service.json')
    if ($missingResult.ExitCode -eq 0 -or @($missingResult.Tokens).Count -ne 1 -or $missingResult.Tokens[0] -ne 'MTLS_CONFIG_REPAIR_SOURCE_MISSING') { throw 'MISSING_SOURCE_CODE_INVALID' }
    'CONFIG_REPAIR_MISSING_SOURCE=PASS'

    # Falha antes da cópia: o pai do destino é um arquivo, preservando a origem.
    $copyFailure = Join-Path $root 'copy-failure'
    $copySource = Join-Path $copyFailure 'source.json'
    $blockedParent = Join-Path $copyFailure 'blocked-parent'
    New-Item -ItemType Directory -Path $copyFailure -Force | Out-Null
    [IO.File]::WriteAllText($copySource, '{"synthetic":"preserve"}')
    [IO.File]::WriteAllText($blockedParent, 'not-a-directory')
    $sourceHash = Hash $copySource
    $copyFailureResult = Run-Repair $copySource (Join-Path $blockedParent 'mtls-service.json')
    if ($copyFailureResult.ExitCode -eq 0 -or @($copyFailureResult.Tokens).Count -ne 0) { throw 'COPY_FAILURE_CODE_INVALID' }
    if ((Hash $copySource) -ne $sourceHash) { throw 'SOURCE_CHANGED_AFTER_COPY_FAILURE' }
    if (@(Get-ChildItem $copyFailure -Filter '*.tmp' -Recurse -Force).Count -ne 0) { throw 'TEMPORARY_LEFT_COPY_FAILURE' }
    'CONFIG_REPAIR_COPY_FAILURE=PASS'

    'CONFIG_JSON_REPAIR_TEST=PASS'
}
finally {
    if (Test-Path -LiteralPath $root) {
        Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue
    }
}
