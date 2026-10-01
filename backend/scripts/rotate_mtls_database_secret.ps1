[CmdletBinding()]
param(
    [string]$Path = 'C:\ProgramData\BranaCloude\mtls\config\database-url.secret'
)

$ErrorActionPreference = 'Stop'
$helper = Join-Path $PSScriptRoot 'prepare_mtls_database_secret.ps1'
. (Resolve-Path $helper) -ValidateOnly
function Protect-ConfigDirectory([string]$Directory) {
    New-Item -ItemType Directory -Path $Directory -Force | Out-Null
    $admin = (New-Object System.Security.Principal.SecurityIdentifier('S-1-5-32-544')).Translate([System.Security.Principal.NTAccount]).Value
    & icacls.exe $Directory /inheritance:r /grant:r "SYSTEM:(OI)(CI)(F)" "${admin}:(OI)(CI)(F)" 'NT SERVICE\BranaCloudeMtls:(OI)(CI)(R)' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'MTLS_SECRET_ROTATION_DIRECTORY_ACL_FAILED' }
}

function Invoke-MtlsDatabaseSecretRotation([string]$SecretPath, [securestring]$Password, [scriptblock]$ConnectionVerifier = $null) {
$parent = Split-Path -Parent $SecretPath
$candidate = Join-Path $parent ('.database-url.secret.' + [guid]::NewGuid().ToString('N') + '.tmp')
$previous = Join-Path $parent ('.database-url.secret.' + [guid]::NewGuid().ToString('N') + '.previous')
$candidateCreated = $false
$previousMoved = $false
try {
    if ($null -eq $ConnectionVerifier) {
        $ConnectionVerifier = {
            param([string]$CandidatePath)
            $output = @(& python (Join-Path $PSScriptRoot 'verify_mtls_database_connection.py') $CandidatePath 2>$null)
            $allowed = @(
                'SERVICE_DB_CONNECTION_FILE_INACCESSIBLE',
                'SERVICE_DB_CONNECTION_FILE_INVALID',
                'SERVICE_DB_CONNECTION_BOM',
                'SERVICE_DB_CONNECTION_URL_MALFORMED',
                'SERVICE_DB_CONNECTION_AUTH_REJECTED',
                'SERVICE_DB_CONNECTION_ROLE_MISSING',
                'SERVICE_DB_CONNECTION_DATABASE_MISSING',
                'SERVICE_DB_CONNECTION_SERVER_UNAVAILABLE',
                'SERVICE_DB_CONNECTION_USER_MISMATCH',
                'SERVICE_DB_CONNECTION_DATABASE_MISMATCH',
                'SERVICE_DB_CONNECTION_ADDRESS_MISMATCH',
                'SERVICE_DB_CONNECTION_PORT_MISMATCH',
                'SERVICE_DB_CONNECTION_FAILED',
                'UNKNOWN_CONNECTION_FAILURE'
            )
            $exitCode = $LASTEXITCODE
            $lines = @($output | ForEach-Object { ([string]$_).Trim() } | Where-Object { $_ -ne '' })
            $success = @($lines | Where-Object { $_ -eq 'SERVICE_DB_CONNECTION=PASS' })
            $codes = @($lines | Where-Object { $allowed -contains $_ })
            if ($exitCode -eq 0) {
                if ($success.Count -ne 1 -or $codes.Count -ne 0) { throw 'MTLS_SECRET_ROTATION_CONNECTION_OUTPUT_INVALID' }
                return
            }
            if ($success.Count -ne 0 -or $codes.Count -ne 1) { throw 'MTLS_SECRET_ROTATION_CONNECTION_OUTPUT_INVALID' }
            throw ([string]$codes[0])
        }
    }
    Protect-ConfigDirectory $parent
    if (-not (Test-Path -LiteralPath $SecretPath -PathType Leaf)) { throw 'MTLS_SECRET_ROTATION_CURRENT_MISSING' }
    Write-MtlsDatabaseSecret -SecretPath $candidate -Password $Password | Out-Null
    $candidateCreated = $true
    powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File $helper -Path $candidate -ValidateOnly | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'MTLS_SECRET_ROTATION_CANDIDATE_INVALID' }
    try { & $ConnectionVerifier $candidate } catch { if ($_.Exception.Message -ne 'MTLS_SECRET_ROTATION_CONNECTION_FAILED' -and $_.Exception.Message -notmatch '^SERVICE_DB_CONNECTION_[A-Z_]+$' -and $_.Exception.Message -ne 'UNKNOWN_CONNECTION_FAILURE') { throw }; throw }
    Move-Item -LiteralPath $SecretPath -Destination $previous -Force
    $previousMoved = $true
    Move-Item -LiteralPath $candidate -Destination $SecretPath -Force
    $candidateCreated = $false
    powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File $helper -Path $SecretPath -ValidateOnly | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'MTLS_SECRET_ROTATION_FINAL_ACL_FAILED' }
    try { & $ConnectionVerifier $SecretPath } catch { if ($_.Exception.Message -ne 'MTLS_SECRET_ROTATION_CONNECTION_FAILED' -and $_.Exception.Message -notmatch '^SERVICE_DB_CONNECTION_[A-Z_]+$' -and $_.Exception.Message -ne 'UNKNOWN_CONNECTION_FAILURE') { throw }; throw }
    Remove-Item -LiteralPath $previous -Force
    $previousMoved = $false
    'MTLS_SECRET_ROTATION=PASS'
}
catch {
    if ($previousMoved -and (Test-Path -LiteralPath $previous)) {
        if (Test-Path -LiteralPath $SecretPath) { Remove-Item -LiteralPath $SecretPath -Force -ErrorAction SilentlyContinue }
        Move-Item -LiteralPath $previous -Destination $SecretPath -Force -ErrorAction SilentlyContinue
        $previousMoved = $false
    }
    throw
}
finally {
    if ($candidateCreated -and (Test-Path -LiteralPath $candidate)) { Remove-Item -LiteralPath $candidate -Force -ErrorAction SilentlyContinue }
    if ($previousMoved -and (Test-Path -LiteralPath $previous)) { Remove-Item -LiteralPath $previous -Force -ErrorAction SilentlyContinue }
}
}

if ($MyInvocation.InvocationName -ne '.') {
    Invoke-MtlsDatabaseSecretRotation -SecretPath $Path -Password (Read-Host 'Nova senha do papel brana_mtls_service' -AsSecureString)
}
