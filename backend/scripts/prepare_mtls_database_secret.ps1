[CmdletBinding()]
param(
    [string] $Path = 'C:\ProgramData\BranaCloude\mtls\config\database-url.secret',
    [switch] $ValidateOnly
)
$ErrorActionPreference = 'Stop'
$DatabaseUser = 'brana_mtls_service'
$DatabaseHost = '127.0.0.1'
$DatabasePort = 5432
$DatabaseName = 'brana_saas'
$admin = (New-Object System.Security.Principal.SecurityIdentifier('S-1-5-32-544')).Translate([System.Security.Principal.NTAccount]).Value
function New-DatabaseUrl([securestring]$Password) {
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
    try {
        $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
        $encoded = [Uri]::EscapeDataString($plain)
        return "postgresql://$DatabaseUser`:$encoded@$DatabaseHost`:$DatabasePort/$DatabaseName"
    } finally {
        if ($ptr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
    }
}
function Assert-Url([string]$Value) {
    try { $uri = [Uri]$Value } catch { throw 'MTLS_DATABASE_URL_INVALID' }
    if ($uri.Scheme -notin @('postgresql','postgres')) { throw 'MTLS_DATABASE_URL_INVALID' }
    if ([string]::IsNullOrWhiteSpace($uri.Host) -or [string]::IsNullOrWhiteSpace($uri.AbsolutePath.Trim('/'))) { throw 'MTLS_DATABASE_URL_INVALID' }
    if ($uri.Host -ne $DatabaseHost -or $uri.Port -ne $DatabasePort -or $uri.AbsolutePath.Trim('/') -ne $DatabaseName -or $uri.UserInfo -notmatch '^brana_mtls_service:') { throw 'MTLS_DATABASE_URL_TARGET_INVALID' }
    return $uri
}
function Assert-Acl([string]$File) {
    if (-not (Test-Path -LiteralPath $File -PathType Leaf)) { throw 'MTLS_DATABASE_SECRET_MISSING' }
    & icacls.exe $File /verify | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'MTLS_DATABASE_SECRET_ACL_UNAVAILABLE' }
    foreach ($sid in @('*S-1-5-32-545','*S-1-1-0','*S-1-5-11')) {
        $result = & icacls.exe $File /findsid $sid 2>&1
        if ($LASTEXITCODE -notin @(0,1)) { throw 'MTLS_DATABASE_SECRET_ACL_UNAVAILABLE' }
        if (@($result) -match ':\(') { throw 'MTLS_DATABASE_SECRET_ACL_TOO_BROAD' }
    }
}
function Write-MtlsDatabaseSecret([string]$SecretPath, [securestring]$Password) {
    if (Test-Path -LiteralPath $SecretPath) { throw 'MTLS_DATABASE_SECRET_EXISTS' }
    $parent = Split-Path $SecretPath
    $value = New-DatabaseUrl $Password
    Assert-Url $value | Out-Null
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
    [IO.File]::WriteAllText($SecretPath, $value + [Environment]::NewLine, (New-Object Text.UTF8Encoding($false)))
    & icacls.exe $parent /inheritance:r /grant:r "SYSTEM:(OI)(CI)(F)" "${admin}:(OI)(CI)(F)" "NT SERVICE\BranaCloudeMtls:(OI)(CI)(R)" | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'MTLS_DATABASE_SECRET_ACL_FAILED' }
    & icacls.exe $SecretPath /inheritance:r /grant:r 'SYSTEM:F' "${admin}:F" 'NT SERVICE\BranaCloudeMtls:R' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'MTLS_DATABASE_SECRET_ACL_FAILED' }
    Assert-Acl $SecretPath
    $value = $null
    'MTLS_DATABASE_SECRET_CREATED=PASS'
}

if ($MyInvocation.InvocationName -ne '.') {
    if ($ValidateOnly) { Assert-Acl $Path; $value = (Get-Content -LiteralPath $Path -Raw).Trim(); if (-not $value) { throw 'MTLS_DATABASE_SECRET_EMPTY' }; Assert-Url $value | Out-Null; 'MTLS_DATABASE_SECRET_VALID=PASS'; return }
    $secure = Read-Host 'Senha do papel brana_mtls_service' -AsSecureString
    try { Write-MtlsDatabaseSecret -SecretPath $Path -Password $secure }
    finally { $secure = $null }
}
