[CmdletBinding()]
param(
    [string]$Source = 'C:\ProgramData\BranaCloude\mtls\provisioned\config\mtls-service.json',
    [string]$Destination = 'C:\ProgramData\BranaCloude\mtls\config\mtls-service.json',
    [string]$PythonPath = 'C:\Program Files\BranaCloude\runtime\Scripts\python.exe'
)
$ErrorActionPreference = 'Stop'
function Hash([string]$p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant() }
if (-not (Test-Path -LiteralPath $Source -PathType Leaf)) { throw 'MTLS_CONFIG_REPAIR_SOURCE_MISSING' }
if (Test-Path -LiteralPath $Destination -PathType Leaf) { throw 'MTLS_CONFIG_REPAIR_DESTINATION_EXISTS' }
$parent = Split-Path -Parent $Destination
New-Item -ItemType Directory -Path $parent -Force | Out-Null
$tmp = Join-Path $parent ('.mtls-service.' + [guid]::NewGuid().ToString('N') + '.tmp')
try {
    Copy-Item -LiteralPath $Source -Destination $tmp -Force
    $admin = (New-Object System.Security.Principal.SecurityIdentifier('S-1-5-32-544')).Translate([System.Security.Principal.NTAccount]).Value
    & icacls.exe $tmp /inheritance:r /grant:r "SYSTEM:F" "${admin}:F" 'NT SERVICE\BranaCloudeMtls:R' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'MTLS_CONFIG_REPAIR_ACL_FAILED' }
    if ((Hash $tmp) -ne (Hash $Source)) { throw 'MTLS_CONFIG_REPAIR_HASH_MISMATCH' }
    Move-Item -LiteralPath $tmp -Destination $Destination
    if ((Hash $Destination) -ne (Hash $Source)) { throw 'MTLS_CONFIG_REPAIR_DESTINATION_HASH_MISMATCH' }
    "MTLS_CONFIG_REPAIR_READY;HASH=$((Hash $Destination))"
}
finally {
    if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue }
}
