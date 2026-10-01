[CmdletBinding()]
param(
    [switch] $Apply,
    [string] $PythonPath = 'C:\Program Files\BranaCloude\runtime\Scripts\python.exe',
    [string] $ServiceXmlPath = 'C:\ProgramData\BranaCloude\mtls\BranaCloudeMtls.xml',
    [string] $MaterialRoot = 'C:\ProgramData\BranaCloude\mtls',
    [string] $DatabaseUrlFile = 'C:\ProgramData\BranaCloude\mtls\config\database-url.secret',
    [string] $InstallationId = 'brana-bridge-local-1',
    [string] $ExpectedXmlSha256 = '5ad30484bed917816b3439aa1027f6e2df77988e0294b923af9180a39efbded7'
)
$ErrorActionPreference = 'Stop'
$admin = (New-Object System.Security.Principal.SecurityIdentifier('S-1-5-32-544')).Translate([System.Security.Principal.NTAccount]).Value
function Hash([string]$p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant() }
if (-not (Test-Path -LiteralPath $ServiceXmlPath -PathType Leaf)) { throw 'MTLS_PROVISION_XML_MISSING' }
$actualXmlSha256 = (Hash $ServiceXmlPath)
$expectedXmlSha256Normalized = ([string]$ExpectedXmlSha256).ToLowerInvariant()
if ($actualXmlSha256 -notmatch '^[0-9a-f]{64}$' -or $expectedXmlSha256Normalized -notmatch '^[0-9a-f]{64}$') { throw 'MTLS_PROVISION_XML_HASH_INVALID' }
if ($actualXmlSha256 -cne $expectedXmlSha256Normalized) { throw 'MTLS_PROVISION_XML_HASH_MISMATCH' }
$installedXml = [xml](Get-Content -LiteralPath $ServiceXmlPath -Raw)
$configNode = @($installedXml.service.env) | Where-Object { $_.name -eq 'BRANA_MTLS_CONFIG_FILE' } | Select-Object -First 1
$xmlConfigFile = [IO.Path]::GetFullPath([string]$configNode.value)
$xmlConfigDir = [IO.Path]::GetDirectoryName($xmlConfigFile)
$xmlLogDir = [IO.Path]::GetFullPath([string]$installedXml.service.logpath)
if (-not $configNode.value -or -not $installedXml.service.logpath) { throw 'MTLS_PROVISION_XML_PATHS_MISSING' }
if (-not [IO.Path]::IsPathRooted($xmlConfigFile) -or -not [IO.Path]::IsPathRooted($xmlLogDir)) { throw 'MTLS_PROVISION_XML_PATHS_NOT_ABSOLUTE' }
if ($xmlConfigDir -ne ([IO.Path]::GetFullPath((Join-Path $MaterialRoot 'config')))) { throw 'MTLS_PROVISION_CONFIG_PATH_MISMATCH' }
$svc = Get-CimInstance Win32_Service -Filter "Name='BranaCloudeMtls'" -ErrorAction Stop
if ($svc.State -ne 'Stopped' -or $svc.StartMode -ne 'Disabled') { throw 'MTLS_PROVISION_SERVICE_NOT_STOPPED_DISABLED' }
if (-not (Test-Path -LiteralPath $PythonPath -PathType Leaf)) { throw 'MTLS_PROVISION_PYTHON_MISSING' }
if (-not (Test-Path -LiteralPath $DatabaseUrlFile -PathType Leaf)) { throw 'MTLS_PROVISION_DATABASE_CONFIG_MISSING' }
if (-not $Apply) { 'MTLS_PROVISION_PREFLIGHT=PASS'; return }
$material = Join-Path $MaterialRoot 'provisioned'
if (Test-Path -LiteralPath $material) { throw 'MTLS_PROVISION_DESTINATION_EXISTS' }
New-Item -ItemType Directory -Path $material | Out-Null
& $PythonPath (Join-Path $PSScriptRoot 'provision_mtls_material.py') --output-root $material --database-url-file $DatabaseUrlFile --installation-id $InstallationId --bind '127.0.0.1:8766' --register | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'MTLS_PROVISION_GENERATION_FAILED' }
foreach ($d in @('ca','server','client')) {
    $p = Join-Path $material $d
    & icacls.exe $p /inheritance:r /grant:r "SYSTEM:(OI)(CI)(F)" "${admin}:(OI)(CI)(F)" "NT SERVICE\BranaCloudeMtls:(OI)(CI)(RX)" | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "MTLS_PROVISION_ACL_FAILED:$d" }
}
& icacls.exe (Join-Path $MaterialRoot 'config\mtls-service.json') /inheritance:r /grant:r "SYSTEM:F" "${admin}:F" "NT SERVICE\BranaCloudeMtls:R" | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'MTLS_PROVISION_CONFIG_ACL_FAILED' }
foreach ($f in @((Join-Path $material 'ca\ca.crt'),(Join-Path $material 'server\server.crt'),(Join-Path $material 'server\server.key'),(Join-Path $material 'client\client.crt'),(Join-Path $material 'client\client.key'))) {
    & icacls.exe $f /inheritance:r /grant:r "SYSTEM:F" "${admin}:F" "NT SERVICE\BranaCloudeMtls:R" | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'MTLS_PROVISION_FILE_ACL_FAILED' }
}
if ((Get-ChildItem (Join-Path $material 'client') -Filter '*.key').Count -ne 1) { throw 'MTLS_PROVISION_CLIENT_KEY_INVALID' }
'MTLS_PROVISION_APPLY=PASS'
