[CmdletBinding()]
param(
    [switch] $Apply,
    [string] $ServiceName = 'BranaCloudeMtls',
    [string] $ServiceRoot = 'C:\ProgramData\BranaCloude\mtls',
    [string] $PackageRoot,
    [string] $PackageInstallRoot = 'C:\Program Files\BranaCloude\package',
    [string] $ApplicationRoot = 'C:\Program Files\BranaCloude\app',
    [string] $PythonRoot = 'C:\Program Files\BranaCloude\runtime',
    [string] $ServiceAccount = 'NT SERVICE\BranaCloudeMtls'
)
$ErrorActionPreference = 'Stop'
$admin = (New-Object System.Security.Principal.SecurityIdentifier('S-1-5-32-544')).Translate([System.Security.Principal.NTAccount]).Value

function Assert-Target {
    if (-not $PackageRoot) { throw 'MTLS_ACL_PACKAGE_REQUIRED' }
    $svc = Get-CimInstance Win32_Service -Filter "Name='$ServiceName'" -ErrorAction SilentlyContinue
    if (-not $svc -or $svc.StartName -ne $ServiceAccount -or $svc.State -ne 'Stopped' -or $svc.StartMode -ne 'Disabled') { throw 'MTLS_ACL_SERVICE_STATE_INVALID' }
    if (-not (Test-Path -LiteralPath $PackageRoot -PathType Container)) { throw 'MTLS_ACL_PACKAGE_MISSING' }
    $manifest = Get-Content -LiteralPath (Join-Path $PackageRoot 'MANIFEST.json') -Raw | ConvertFrom-Json
    foreach ($entry in @($manifest.application_files)) {
        if ($entry.path -notmatch '^application/backend/(.+)$' -or $Matches[1] -match '(^|[\\/])\.\.([\\/]|$)' -or [IO.Path]::IsPathRooted($Matches[1])) { throw "MTLS_ACL_APPLICATION_PATH_INVALID:$($entry.path)" }
        $target = Join-Path $ApplicationRoot ('backend\' + $Matches[1].Replace('/','\'))
        if (-not (Test-Path -LiteralPath $target -PathType Leaf) -or (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLower() -ne $entry.sha256.ToLower()) { throw "MTLS_ACL_APPLICATION_HASH:$($entry.path)" }
    }
    $forbidden = @('*.key','*.pfx','*.p12','*.crt','*.cer','*.env','*.db','*.dump','*.log')
    foreach ($root in @($PackageInstallRoot,$ApplicationRoot,$PythonRoot)) { foreach ($pattern in $forbidden) { if (Get-ChildItem -LiteralPath $root -Recurse -Force -Filter $pattern -ErrorAction SilentlyContinue) { throw "MTLS_ACL_UNEXPECTED_SECRET:$pattern" } } }
    foreach ($dir in @('ca','server','client')) { if (Get-ChildItem -LiteralPath (Join-Path $ServiceRoot $dir) -Recurse -Force -File -ErrorAction SilentlyContinue) { throw "MTLS_ACL_KEY_MATERIAL_PRESENT:$dir" } }
    return $manifest
}
function Set-TreeAcl($Root) {
    $items = @(Get-Item -LiteralPath $Root) + @(Get-ChildItem -LiteralPath $Root -Recurse -Force)
    foreach ($item in $items) {
        $acl = Get-Acl -LiteralPath $item.FullName
        $acl.SetAccessRuleProtection($true, $false)
        foreach ($rule in @($acl.Access)) { $acl.RemoveAccessRuleSpecific($rule) }
        $inherit = if ($item.PSIsContainer) { [System.Security.AccessControl.InheritanceFlags]'ContainerInherit,ObjectInherit' } else { [System.Security.AccessControl.InheritanceFlags]::None }
        $prop = if ($item.PSIsContainer) { [System.Security.AccessControl.PropagationFlags]::None } else { [System.Security.AccessControl.PropagationFlags]::None }
        foreach ($spec in @(@('NT AUTHORITY\SYSTEM','FullControl'),@($admin,'FullControl'),@($ServiceAccount,'ReadAndExecute'))) {
            $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($spec[0],$spec[1],'Allow')
            $acl.AddAccessRule($rule)
        }
        Set-Acl -LiteralPath $item.FullName -AclObject $acl
        $after = Get-Acl -LiteralPath $item.FullName
        if (-not $after.AreAccessRulesProtected -or @($after.Access | Where-Object { ([string]$_.IdentityReference) -match '(?i)(BUILTIN\\Users|\\Usuários|Everyone|Todos)' -and $_.FileSystemRights.ToString() -match '(?i)(Write|Modify|FullControl)' }).Count) { throw "MTLS_ACL_VERIFY_FAILED:$($item.Name)" }
    }
}
$manifest = Assert-Target
$targets = @($PackageInstallRoot,$ApplicationRoot,$PythonRoot,(Join-Path $ServiceRoot "$ServiceName.xml"))
foreach ($target in $targets) { if (-not (Test-Path -LiteralPath $target)) { throw "MTLS_ACL_TARGET_MISSING:$target" } }
if (-not $Apply) { 'INSTALLED_ACL_REPAIR_PREFLIGHT=PASS'; exit 0 }
foreach ($target in $targets) { Set-TreeAcl $target }
'INSTALLED_ACL_REPAIR=PASS'
