[CmdletBinding()]
param(
    [string] $ServiceName = 'BranaCloudeMtls',
    [string] $ServiceRoot = 'C:\ProgramData\BranaCloude\mtls',
    [string] $PackageRoot,
    [string] $PackageInstallRoot = 'C:\Program Files\BranaCloude\package',
    [string] $ApplicationRoot = 'C:\Program Files\BranaCloude\app',
    [string] $PythonRoot = 'C:\Program Files\BranaCloude\runtime',
    [string] $ExpectedXmlSha256
)
$ErrorActionPreference = 'Stop'
$failures = [System.Collections.Generic.List[string]]::new()
$service = Get-CimInstance Win32_Service -Filter "Name='$ServiceName'" -ErrorAction SilentlyContinue
if ($service) { $service | Select-Object Name,StartName,State,StartMode,PathName }
else { 'SERVICE=MISSING' }
foreach ($path in @($PackageRoot,$PackageInstallRoot,$ApplicationRoot,$PythonRoot)) {
    if ($path) { "PATH=$path EXISTS=$(Test-Path -LiteralPath $path)" }
}
foreach ($path in @(
    (Join-Path $ApplicationRoot 'backend\isolated_mtls_service.py'),
    (Join-Path $ApplicationRoot 'backend\database.py'),
    (Join-Path $PythonRoot 'Scripts\python.exe'),
    (Join-Path $ServiceRoot "$ServiceName.xml"),
    (Join-Path $ServiceRoot 'bootstrap-state.json')
)) { "REQUIRED_FILE=$path EXISTS=$(Test-Path -LiteralPath $path)" }
$xmlPath = Join-Path $ServiceRoot "$ServiceName.xml"
$xmlConfigDir = $null; $xmlLogDir = $null
if (Test-Path -LiteralPath $xmlPath -PathType Leaf) {
    try {
        [xml]$installedXml = Get-Content -LiteralPath $xmlPath -Raw
        $configNode = @($installedXml.service.env) | Where-Object { $_.name -eq 'BRANA_MTLS_CONFIG_FILE' } | Select-Object -First 1
        if ($configNode.value) { $xmlConfigDir = [IO.Path]::GetDirectoryName([IO.Path]::GetFullPath([string]$configNode.value)) }
        if ($installedXml.service.logpath) { $xmlLogDir = [IO.Path]::GetFullPath([string]$installedXml.service.logpath) }
    } catch { $failures.Add('XML_PATH_CONTRACT_INVALID') }
}
foreach ($path in @(
    (Join-Path $ServiceRoot 'ca'),
    (Join-Path $ServiceRoot 'server'),
    (Join-Path $ServiceRoot 'client')
)) {
    if (-not (Test-Path -LiteralPath $path)) { "MISSING=$path"; continue }
    $acl = Get-Acl -LiteralPath $path
    [pscustomobject]@{
        Path = $path
        Owner = [string]$acl.Owner
        InheritanceDisabled = [bool]$acl.AreAccessRulesProtected
        Access = @($acl.Access | ForEach-Object {
            "$($_.IdentityReference)|$($_.FileSystemRights)|$($_.AccessControlType)|$($_.InheritanceFlags)|$($_.PropagationFlags)"
        })
    } | ConvertTo-Json -Depth 5
}
function Check-SecureAcl($Path) {
    if (-not (Test-Path -LiteralPath $Path)) { $failures.Add("MISSING:$Path"); return }
    $acl = Get-Acl -LiteralPath $Path
    if (-not $acl.AreAccessRulesProtected) { $failures.Add("INHERITED:$Path") }
    foreach ($rule in $acl.Access) {
        $name = [string]$rule.IdentityReference
        if ($name -match '(?i)(BUILTIN\\Users|\\Usuários)$' -and (($rule.FileSystemRights.ToString()) -match '(?i)(Write|Modify|FullControl)')) {
            $failures.Add("USERS_WRITE:$Path")
        }
    }
}
$securePaths = @(
    (Join-Path $ServiceRoot 'ca'),
    (Join-Path $ServiceRoot 'server'),
    (Join-Path $ServiceRoot 'client'),
    $PackageInstallRoot,
    $ApplicationRoot,
    $PythonRoot,
    (Join-Path $ServiceRoot "$ServiceName.xml"),
    $xmlConfigDir,
    $xmlLogDir
)
foreach ($path in ($securePaths | Where-Object { $_ })) { Check-SecureAcl $path }
if ($ExpectedXmlSha256 -and (Test-Path -LiteralPath $xmlPath)) {
    $actualXmlSha256 = (Get-FileHash -LiteralPath $xmlPath -Algorithm SHA256).Hash.ToLower()
    if ($actualXmlSha256 -ne $ExpectedXmlSha256.ToLower()) { $failures.Add("XML_HASH_MISMATCH:$xmlPath") }
}
if ($failures.Count -gt 0) {
    'ACL_SECURITY=FAIL'
    $failures | ForEach-Object { "FAIL=$_" }
    exit 1
}
'ACL_SECURITY=PASS'
