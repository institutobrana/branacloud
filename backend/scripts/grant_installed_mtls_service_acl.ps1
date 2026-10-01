[CmdletBinding()]
param(
    [switch] $Apply,
    [string] $ServiceName = 'BranaCloudeMtls',
    [string] $ServiceRoot = 'C:\ProgramData\BranaCloude\mtls',
    [string] $BackupRoot = ''
)
$ErrorActionPreference = 'Stop'

$script:ServiceSid = 'S-1-5-80-4090967710-1014575511-2566290142-3174294299-2343579137'

function Get-ServiceSidRule {
    param([System.Security.AccessControl.AuthorizationRuleCollection] $Access)
    @($Access | Where-Object {
        $identitySid = $null
        try { $identitySid = $_.IdentityReference.Translate([System.Security.Principal.SecurityIdentifier]).Value } catch { $identitySid = [string]$_.IdentityReference }
        $identitySid -eq $script:ServiceSid -and -not $_.IsInherited
    })
}

function Add-MtlsServiceAcl {
    param(
        [Parameter(Mandatory=$true)][string] $Path,
        [Parameter(Mandatory=$true)][ValidateSet('File','Directory')][string] $Kind
    )
    $acl = Get-Acl -LiteralPath $Path
    $sid = New-Object System.Security.Principal.SecurityIdentifier($script:ServiceSid)
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        $sid,
        [System.Security.AccessControl.FileSystemRights]::ReadAndExecute,
        [System.Security.AccessControl.InheritanceFlags]::None,
        [System.Security.AccessControl.PropagationFlags]::None,
        [System.Security.AccessControl.AccessControlType]::Allow
    )
    $acl.SetAccessRule($rule)
    Set-Acl -LiteralPath $Path -AclObject $acl
}

function Assert-MtlsServiceAcl {
    param([Parameter(Mandatory=$true)][string] $Path)
    $acl = Get-Acl -LiteralPath $Path
    $rules = @(Get-ServiceSidRule $acl.Access)
    if ($rules.Count -ne 1) { throw "MTLS_ACL_SERVICE_RULE_COUNT:$($rules.Count)" }
    $rule = $rules[0]
    if ($rule.AccessControlType -ne 'Allow' -or
        $rule.InheritanceFlags -ne [System.Security.AccessControl.InheritanceFlags]::None -or
        $rule.PropagationFlags -ne [System.Security.AccessControl.PropagationFlags]::None -or
        ([System.Security.AccessControl.FileSystemRights]$rule.FileSystemRights -band [System.Security.AccessControl.FileSystemRights]::Write) -ne 0 -or
        ([System.Security.AccessControl.FileSystemRights]$rule.FileSystemRights -band [System.Security.AccessControl.FileSystemRights]::ReadAndExecute) -ne [System.Security.AccessControl.FileSystemRights]::ReadAndExecute) {
        throw 'MTLS_ACL_SERVICE_RULE_INVALID'
    }
}

function Save-MtlsAclSnapshot {
    param([string] $Path, [string] $Destination)
    $acl = Get-Acl -LiteralPath $Path
    [IO.File]::WriteAllText($Destination, $acl.Sddl, [Text.UTF8Encoding]::new($false))
}

function Restore-MtlsAclSnapshot {
    param([string] $Path, [string] $Snapshot)
    $sddl = [IO.File]::ReadAllText($Snapshot)
    if ([string]::IsNullOrWhiteSpace($sddl)) { throw 'MTLS_ACL_SNAPSHOT_EMPTY' }
    if ((Get-Item -LiteralPath $Path).PSIsContainer) {
        $acl = New-Object System.Security.AccessControl.DirectorySecurity
    } else {
        $acl = New-Object System.Security.AccessControl.FileSecurity
    }
    $acl.SetSecurityDescriptorSddlForm($sddl)
    Set-Acl -LiteralPath $Path -AclObject $acl
}

function Protect-MtlsBackupDirectory {
    param([string] $Path)
    $acl = Get-Acl -LiteralPath $Path
    $acl.SetAccessRuleProtection($true, $false)
    foreach ($rule in @($acl.Access)) { $acl.RemoveAccessRuleSpecific($rule) }
    foreach ($entry in @(
        @('S-1-5-18','FullControl'),
        @('S-1-5-32-544','FullControl')
    )) {
        $sid = New-Object System.Security.Principal.SecurityIdentifier($entry[0])
        $acl.AddAccessRule((New-Object System.Security.AccessControl.FileSystemAccessRule(
            $sid, $entry[1], 'ContainerInherit,ObjectInherit', 'None', 'Allow')))
    }
    Set-Acl -LiteralPath $Path -AclObject $acl
}

function Get-MtlsChildAclSnapshot {
    param([string] $Root, [string[]] $ExcludePaths = @())
    $items = @(Get-ChildItem -LiteralPath $Root -Recurse -Force -ErrorAction Stop)
    @($items | ForEach-Object {
        if ($ExcludePaths -contains $_.FullName) { return }
        [pscustomobject]@{ Path=$_.FullName; Sddl=(Get-Acl -LiteralPath $_.FullName).Sddl }
    })
}

function Assert-MtlsChildrenUnchanged {
    param([array] $Before)
    foreach ($entry in $Before) {
        $after = (Get-Acl -LiteralPath $entry.Path -ErrorAction Stop).Sddl
        if ($after -ne $entry.Sddl) { throw "MTLS_ACL_CHILD_CHANGED:$([IO.Path]::GetFileName($entry.Path))" }
        $acl = Get-Acl -LiteralPath $entry.Path
        if (@(Get-ServiceSidRule $acl.Access | Where-Object { $_.IsInherited }).Count -gt 0) { throw 'MTLS_ACL_CHILD_INHERITED' }
    }
}

function Assert-MtlsServicePreconditions {
    param([string] $Name, [string] $Root)
    $svc = Get-CimInstance Win32_Service -Filter "Name='$Name'" -ErrorAction Stop
    if ($svc.StartName -ne 'NT SERVICE\BranaCloudeMtls' -or $svc.State -ne 'Stopped' -or $svc.StartMode -ne 'Disabled') { throw 'MTLS_ACL_SERVICE_STATE_INVALID' }
    $actualSid = (New-Object System.Security.Principal.NTAccount($svc.StartName)).Translate([System.Security.Principal.SecurityIdentifier]).Value
    if ($actualSid -ne $script:ServiceSid) { throw 'MTLS_ACL_SERVICE_SID_MISMATCH' }
    $exe = Join-Path $Root 'BranaCloudeMtls.exe'
    if (-not (Test-Path -LiteralPath $Root -PathType Container) -or -not (Test-Path -LiteralPath $exe -PathType Leaf)) { throw 'MTLS_ACL_TARGET_MISSING' }
    [pscustomobject]@{ Root=$Root; Exe=$exe }
}

function Invoke-MtlsAclRepair {
    param([string] $Name, [string] $Root, [string] $Backup)
    $targets = Assert-MtlsServicePreconditions $Name $Root
    # O exe é um alvo autorizado e muda legitimamente; somente os demais filhos
    # devem permanecer byte/ACL-identicos durante a operação.
    $childrenBefore = Get-MtlsChildAclSnapshot $targets.Root @($targets.Exe)
    if (-not $Backup) { $Backup = Join-Path $env:ProgramData ('BranaCloude\mtls\acl-backup-' + (Get-Date -Format 'yyyyMMddHHmmss')) }
    if (-not $Apply) { 'MTLS_ACL_PREFLIGHT=PASS'; return }
    New-Item -ItemType Directory -Path $Backup -Force | Out-Null
    Protect-MtlsBackupDirectory $Backup
    $rootSnapshot = Join-Path $Backup 'service-root.sddl'
    $exeSnapshot = Join-Path $Backup 'service-exe.sddl'
    Save-MtlsAclSnapshot $targets.Root $rootSnapshot
    Save-MtlsAclSnapshot $targets.Exe $exeSnapshot
    try {
        Add-MtlsServiceAcl $targets.Root Directory
        Add-MtlsServiceAcl $targets.Exe File
        Assert-MtlsServiceAcl $targets.Root
        Assert-MtlsServiceAcl $targets.Exe
        Assert-MtlsChildrenUnchanged $childrenBefore
        'MTLS_ACL_APPLY=PASS'
    } catch {
        try { Restore-MtlsAclSnapshot $targets.Root $rootSnapshot; Restore-MtlsAclSnapshot $targets.Exe $exeSnapshot } catch { throw 'MTLS_ACL_ROLLBACK_FAILED' }
        throw
    }
}

if ($MyInvocation.InvocationName -ne '.') { Invoke-MtlsAclRepair $ServiceName $ServiceRoot $BackupRoot }
