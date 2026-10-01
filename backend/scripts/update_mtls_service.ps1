[CmdletBinding(DefaultParameterSetName = 'Inspect')]
param(
    [Parameter(Mandatory = $true)] [string] $PackageRoot,
    [switch] $Apply,
    [string] $ServiceName = 'BranaCloudeMtls',
    [string] $ServiceXmlPath = 'C:\ProgramData\BranaCloude\mtls\BranaCloudeMtls.xml',
    [string] $ApplicationRoot = 'C:\Program Files\BranaCloude\app',
    [string] $PackageInstallRoot = 'C:\Program Files\BranaCloude\package',
    [string] $ServiceRoot = 'C:\ProgramData\BranaCloude\mtls',
    [string] $ExpectedOldXmlSha256 = '035f5adda089719a77bf912456d9e2b0c84ce4e99bc5d6688155c226deb8acc9',
    [string] $SimulationRoot
)
$ErrorActionPreference = 'Stop'
$script:LockName = 'requirements-mtls-windows-py310.lock'
$script:AdminAccount = (New-Object System.Security.Principal.SecurityIdentifier('S-1-5-32-544')).Translate([System.Security.Principal.NTAccount]).Value

function Hash-File([string]$Path) { (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLower() }
function Assert-File([string]$Path, [string]$Code) { if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) { throw $Code } }
function Validate-Package {
    Assert-File (Join-Path $PackageRoot 'MANIFEST.json') 'MTLS_UPDATE_MANIFEST_MISSING'
    $m = Get-Content -LiteralPath (Join-Path $PackageRoot 'MANIFEST.json') -Raw | ConvertFrom-Json
    foreach ($p in @('WinSW-x64.exe','BranaCloudeMtls.xml',$script:LockName)) { Assert-File (Join-Path $PackageRoot $p) "MTLS_UPDATE_PACKAGE_MISSING:$p" }
    if ((Hash-File (Join-Path $PackageRoot 'BranaCloudeMtls.xml')) -ne $m.xml_sha256.ToLower()) { throw 'MTLS_UPDATE_XML_HASH_MISMATCH' }
    if ((Hash-File (Join-Path $PackageRoot $script:LockName)) -ne $m.python_lock_sha256.ToLower()) { throw 'MTLS_UPDATE_LOCK_HASH_MISMATCH' }
    foreach ($e in @($m.application_files)) {
        if ($e.path -notmatch '^application/backend/(?!.*\.\.)[^/]+(?:/[^/]+)*$') { throw "MTLS_UPDATE_APPLICATION_PATH_INVALID:$($e.path)" }
        $p = Join-Path $PackageRoot $e.path; Assert-File $p "MTLS_UPDATE_APPLICATION_MISSING:$($e.path)"
        if ((Hash-File $p) -ne $e.sha256.ToLower()) { throw "MTLS_UPDATE_APPLICATION_HASH_MISMATCH:$($e.path)" }
    }
    return $m
}
function Get-XmlRequiredPaths([string]$XmlPath) {
    [xml]$xml = Get-Content -LiteralPath $XmlPath -Raw
    $configNode = @($xml.service.env) | Where-Object { $_.name -eq 'BRANA_MTLS_CONFIG_FILE' } | Select-Object -First 1
    $logPath = [string]$xml.service.logpath
    if (-not $configNode.value -or [string]::IsNullOrWhiteSpace($logPath)) { throw 'MTLS_UPDATE_XML_PATHS_MISSING' }
    $configFile = [IO.Path]::GetFullPath([string]$configNode.value)
    $configDir = [IO.Path]::GetDirectoryName($configFile)
    $logDir = [IO.Path]::GetFullPath($logPath)
    if (-not [IO.Path]::IsPathRooted($configDir) -or -not [IO.Path]::IsPathRooted($logDir)) { throw 'MTLS_UPDATE_XML_PATHS_NOT_ABSOLUTE' }
    return [pscustomobject]@{ ConfigDir = $configDir; LogDir = $logDir }
}
function Get-State {
    if ($SimulationRoot) { return (Get-Content (Join-Path $SimulationRoot 'service-state.json') -Raw | ConvertFrom-Json) }
    $s = Get-CimInstance Win32_Service -Filter "Name='$ServiceName'" -ErrorAction Stop
    return [pscustomobject]@{ State = $s.State; StartMode = $s.StartMode }
}
function Set-Tree([string]$Path, [string]$ServiceRights) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
    if ($SimulationRoot) { return }
    $rules = @('SYSTEM:(OI)(CI)(F)', "${script:AdminAccount}:(OI)(CI)(F)")
    if ($ServiceRights) { $rules += "NT SERVICE\BranaCloudeMtls:(OI)(CI)($ServiceRights)" }
    & icacls.exe $Path /inheritance:r /grant:r $rules | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'MTLS_UPDATE_ACL_FAILED' }
}
function Test-TreeReady([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path -PathType Container)) { return $false }
    if ($SimulationRoot) { return $true }
    try {
        $acl = Get-Acl -LiteralPath $Path
        if (-not $acl.AreAccessRulesProtected) { return $false }
        foreach ($rule in $acl.Access) {
            if ([string]$rule.IdentityReference -match '(?i)(\\Users$|Everyone|Authenticated Users|Todos|Usuários$)') { return $false }
        }
        return $true
    } catch { return $false }
}
function Invoke-Update {
    $m = Validate-Package
    $state = Get-State
    if ($state.State -ne 'Stopped' -or $state.StartMode -ne 'Disabled') { throw 'MTLS_UPDATE_SERVICE_NOT_STOPPED_DISABLED' }
    Assert-File $ServiceXmlPath 'MTLS_UPDATE_INSTALLED_XML_MISSING'
    $xmlPaths = Get-XmlRequiredPaths $ServiceXmlPath
    $installedHash = Hash-File $ServiceXmlPath
    $alreadyCurrent = $installedHash -eq $m.xml_sha256.ToLower()
    $configPath = $xmlPaths.ConfigDir
    $logsPath = $xmlPaths.LogDir
    if ($alreadyCurrent -and (Test-TreeReady $configPath) -and (Test-TreeReady $logsPath)) { return 'UPDATE_ALREADY_CURRENT=PASS' }
    if ($alreadyCurrent -and -not $Apply) { return 'UPDATE_RECOVERY_REQUIRED=CONFIG_OR_LOGS_ACL' }
    if (-not $alreadyCurrent -and $installedHash -ne $ExpectedOldXmlSha256.ToLower()) { throw 'MTLS_UPDATE_INSTALLED_XML_HASH_MISMATCH' }
    if (-not $Apply) { return 'UPDATE_PREFLIGHT=PASS' }
    $stamp = Get-Date -Format 'yyyyMMddHHmmss'
    $backup = Join-Path $ServiceRoot "updates\$stamp"
    New-Item -ItemType Directory -Path $backup -Force | Out-Null
    Copy-Item -LiteralPath $ServiceXmlPath -Destination (Join-Path $backup 'BranaCloudeMtls.xml')
    if (Test-Path -LiteralPath $ApplicationRoot) { Copy-Item -LiteralPath $ApplicationRoot -Destination (Join-Path $backup 'app') -Recurse -Force }
    Set-Content -LiteralPath (Join-Path $backup 'backup-manifest.json') -Value (@{ xml_sha256 = Hash-File $ServiceXmlPath; created = (Get-Date).ToUniversalTime().ToString('o') } | ConvertTo-Json)
    Set-Tree $configPath 'RX'; Set-Tree $logsPath 'M'
    if ($alreadyCurrent) {
        if (-not (Test-TreeReady $configPath) -or -not (Test-TreeReady $logsPath)) { throw 'MTLS_UPDATE_POSTCOPY_ACL_MISMATCH' }
        return "UPDATE_RECOVERED=PASS BACKUP=$backup"
    }
    New-Item -ItemType Directory -Path (Join-Path $ApplicationRoot 'backend') -Force | Out-Null
    foreach ($e in @($m.application_files)) {
        $destination = Join-Path $ApplicationRoot ($e.path -replace '^application/','')
        New-Item -ItemType Directory -Path (Split-Path $destination) -Force | Out-Null
        Copy-Item -LiteralPath (Join-Path $PackageRoot $e.path) -Destination $destination -Force
    }
    Copy-Item -LiteralPath (Join-Path $PackageRoot $script:LockName) -Destination (Join-Path $PackageInstallRoot $script:LockName) -Force
    Copy-Item -LiteralPath (Join-Path $PackageRoot 'BranaCloudeMtls.xml') -Destination $ServiceXmlPath -Force
    if ((Hash-File $ServiceXmlPath) -ne $m.xml_sha256.ToLower()) { throw 'MTLS_UPDATE_POSTCOPY_HASH_MISMATCH' }
    return "UPDATE_APPLIED=PASS BACKUP=$backup"
}
if ($SimulationRoot -or $Apply) { Invoke-Update } else { Validate-Package | Out-Null; 'PACKAGE_VALID=PASS' }
