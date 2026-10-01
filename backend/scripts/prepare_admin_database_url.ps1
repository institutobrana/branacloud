[CmdletBinding()]
param(
    [string]$OutputRoot = (Join-Path $env:TEMP ("brana-admin-" + [guid]::NewGuid().ToString("N"))),
    [switch]$ValidateOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Set-RestrictedAcl {
    param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)][bool]$Directory)
    $acl = if ($Directory) { New-Object System.Security.AccessControl.DirectorySecurity } else { New-Object System.Security.AccessControl.FileSecurity }
    $acl.SetAccessRuleProtection($true, $false)
    foreach ($sidText in @("S-1-5-18", "S-1-5-32-544")) {
        $sid = New-Object System.Security.Principal.SecurityIdentifier($sidText)
        $inheritance = if ($Directory) { "ContainerInherit,ObjectInherit" } else { "None" }
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            $sid, "FullControl", $inheritance, "None", "Allow")
        $acl.AddAccessRule($rule)
    }
    Set-Acl -LiteralPath $Path -AclObject $acl
}

function Assert-RestrictedAcl {
    param([Parameter(Mandatory)][string]$Path)
    $acl = Get-Acl -LiteralPath $Path
    if (-not $acl.AreAccessRulesProtected) { throw "MTLS_ADMIN_URL_ACL_INHERITED" }
    $broad = @("S-1-1-0", "S-1-5-11", "S-1-5-32-545")
    foreach ($rule in $acl.Access) {
        try { $sid = $rule.IdentityReference.Translate([System.Security.Principal.SecurityIdentifier]).Value }
        catch { throw "MTLS_ADMIN_URL_ACL_UNRESOLVED" }
        if ($broad -contains $sid) { throw "MTLS_ADMIN_URL_ACL_BROAD" }
    }
}

function New-AdminDatabaseUrl {
    param(
        [Parameter(Mandatory)][string]$User,
        [Parameter(Mandatory)][securestring]$Password,
        [string]$DatabaseHost = "127.0.0.1",
        [int]$Port = 5432,
        [string]$Database = "brana_saas"
    )
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
    try {
        $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
        $userPart = [Uri]::EscapeDataString($User)
        $passwordPart = [Uri]::EscapeDataString($plain)
        return "postgresql://$userPart`:$passwordPart@$DatabaseHost`:$Port/$Database"
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
}

function Write-ProtectedAdminUrl {
    param(
        [Parameter(Mandatory)][string]$Root,
        [Parameter(Mandatory)][string]$Url
    )
    $createdRoot = $false
    $file = Join-Path $Root "admin-url.secret"
    try {
        New-Item -ItemType Directory -Path $Root -Force | Out-Null
        $createdRoot = $true
        Set-RestrictedAcl -Path $Root -Directory $true
        Assert-RestrictedAcl -Path $Root
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($file, $Url, $utf8NoBom)
        Set-RestrictedAcl -Path $file -Directory $false
        Assert-RestrictedAcl -Path $file
        return $file
    } catch {
        if (Test-Path -LiteralPath $file) { Remove-Item -LiteralPath $file -Force -ErrorAction SilentlyContinue }
        if ($createdRoot -and (Test-Path -LiteralPath $Root)) { Remove-Item -LiteralPath $Root -Force -Recurse -ErrorAction SilentlyContinue }
        throw
    }
}

if (-not $ValidateOnly) {
    $user = Read-Host "Usuário administrativo PostgreSQL"
    $password = Read-Host "Senha administrativa PostgreSQL" -AsSecureString
    $url = $null
    try {
        $url = New-AdminDatabaseUrl -User $user -Password $password
        $file = Write-ProtectedAdminUrl -Root $OutputRoot -Url $url
        Write-Output "ADMIN_URL_FILE_CREATED=$file"
    } finally {
        $url = $null
        $user = $null
        $password = $null
    }
}
