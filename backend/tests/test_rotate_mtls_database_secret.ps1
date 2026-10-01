$ErrorActionPreference = 'Stop'
$script = Join-Path $PSScriptRoot '..\scripts\rotate_mtls_database_secret.ps1'
$prepare = Join-Path $PSScriptRoot '..\scripts\prepare_mtls_database_secret.ps1'
. (Resolve-Path $prepare) -ValidateOnly
. (Resolve-Path $script)

$root = Join-Path $env:TEMP ('brana-rotate-secret-test-' + [guid]::NewGuid().ToString('N'))
$target = Join-Path $root 'database-url.secret'
$old = ConvertTo-SecureString 'SyntheticOld' -AsPlainText -Force
$new = ConvertTo-SecureString 'SyntheticNew' -AsPlainText -Force
$calls = New-Object System.Collections.Generic.List[string]

function New-TestVerifier([string]$FailureMode) {
    return {
        param([string]$CandidatePath)
        $calls.Add([IO.Path]::GetFileName($CandidatePath))
        if ($FailureMode -eq 'invalid-password') { throw 'SYNTHETIC_PASSWORD_INVALID' }
        if ($FailureMode -eq 'connection-failure') { throw 'SYNTHETIC_CONNECTION_FAILED' }
        if (-not (Test-Path -LiteralPath $CandidatePath -PathType Leaf)) { throw 'SYNTHETIC_FILE_MISSING' }
    }.GetNewClosure()
}

try {
    New-Item -ItemType Directory -Path $root -Force | Out-Null
    Write-MtlsDatabaseSecret -SecretPath $target -Password $old | Out-Null

    # Exercita o verificador Python real sem alcançar qualquer servidor: o alvo
    # sintético é deliberadamente inválido e deve falhar antes da conexão.
    $realVerifierInput = Join-Path $root 'real-verifier-input.secret'
    [IO.File]::WriteAllText($realVerifierInput, 'postgresql://brana_mtls_service:Synthetic%40%3A%2F%25@192.0.2.1:5432/brana_saas', (New-Object Text.UTF8Encoding($false)))
    $realOutput = @(& python (Join-Path $PSScriptRoot '..\scripts\verify_mtls_database_connection.py') $realVerifierInput 2>$null)
    if ($LASTEXITCODE -eq 0 -or @($realOutput | ? { $_ -eq 'SERVICE_DB_CONNECTION_URL_MALFORMED' }).Count -ne 1) { throw 'REAL_VERIFIER_CONTRACT_FAILED' }
    Remove-Item -LiteralPath $realVerifierInput -Force
    'REAL_VERIFIER_SYNTHETIC=PASS'

    Invoke-MtlsDatabaseSecretRotation -SecretPath $target -Password $new -ConnectionVerifier (New-TestVerifier '') | Out-Null
    if (-not (Test-Path -LiteralPath $target -PathType Leaf)) { throw 'SUCCESS_TARGET_MISSING' }
    if ((Get-ChildItem -LiteralPath $root -Force).Name -match '\.(tmp|previous)$') { throw 'SUCCESS_TEMPORARY_LEFT' }
    'ROTATION_SUCCESS=PASS'

    $before = [IO.File]::ReadAllBytes($target)
    try { Invoke-MtlsDatabaseSecretRotation -SecretPath $target -Password $new -ConnectionVerifier (New-TestVerifier 'invalid-password'); throw 'INVALID_PASSWORD_ACCEPTED' }
    catch { if ($_.Exception.Message -ne 'SYNTHETIC_PASSWORD_INVALID') { throw } }
    if (-not ([Linq.Enumerable]::SequenceEqual($before, [IO.File]::ReadAllBytes($target)))) { throw 'INVALID_PASSWORD_REPLACED_FILE' }
    'ROTATION_INVALID_PASSWORD=PASS'

    $before = [IO.File]::ReadAllBytes($target)
    try { Invoke-MtlsDatabaseSecretRotation -SecretPath $target -Password $new -ConnectionVerifier (New-TestVerifier 'connection-failure'); throw 'CONNECTION_FAILURE_ACCEPTED' }
    catch { if ($_.Exception.Message -ne 'SYNTHETIC_CONNECTION_FAILED') { throw } }
    if (-not ([Linq.Enumerable]::SequenceEqual($before, [IO.File]::ReadAllBytes($target)))) { throw 'CONNECTION_FAILURE_REPLACED_FILE' }
    'ROTATION_RESTORE=PASS'

    Invoke-MtlsDatabaseSecretRotation -SecretPath $target -Password $new -ConnectionVerifier (New-TestVerifier '') | Out-Null
    if ((Get-ChildItem -LiteralPath $root -Force).Name -match '\.(tmp|previous)$') { throw 'REPEAT_TEMPORARY_LEFT' }
    'ROTATION_REPEAT=PASS'
    'ROTATION_TEST=PASS'
}
finally {
    if (Test-Path -LiteralPath $root) { Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue }
}
