[CmdletBinding(DefaultParameterSetName='Preflight')]
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('Preflight','Apply','Revert','TestOnly')]
    [string]$Mode = 'Preflight',
    [string]$ArchivePath = 'D:\BRANA ARQUIVOS\BRANA CLOUD ARQUIVO MORTO\assinatura-editor-checkpoint-20261001',
    [string]$BackupPath = '',
    [string]$TelSid = ''
)

$ErrorActionPreference = 'Stop'
$BroadSids = @('S-1-1-0','S-1-5-11','S-1-5-32-545')
$SystemSid = 'S-1-5-18'
$AdministratorsSid = 'S-1-5-32-544'

function Resolve-TelSid {
    if ($TelSid -and $TelSid -match '^S-1-5-21-(\d+-){3}\d+$') { return $TelSid }
    $identity = [System.Security.Principal.WindowsIdentity]::GetCurrent()
    if (-not $identity.User) { throw 'ARCHIVE_ACL_TEL_SID_UNRESOLVED' }
    return $identity.User.Value
}

function Get-ArchiveFiles {
    param([string]$Root)
    if (-not (Test-Path -LiteralPath $Root -PathType Container)) { throw 'ARCHIVE_ACL_ARCHIVE_MISSING' }
    return @(Get-ChildItem -LiteralPath $Root -Recurse -Force | Where-Object { $_.FullName -ne $Root })
}

function Get-RelativeArchivePath {
    param([string]$Root,[string]$Path)
    $prefix = $Root.TrimEnd('\') + '\'
    return $Path.Substring($prefix.Length).Replace('\','/')
}

function Get-DescriptorRecord {
    param([string]$Root,[System.IO.FileSystemInfo]$Item)
    $acl = Get-Acl -LiteralPath $Item.FullName
    [pscustomobject]@{
        Path = Get-RelativeArchivePath $Root $Item.FullName
        Sddl = $acl.GetSecurityDescriptorSddlForm([System.Security.AccessControl.AccessControlSections]::Access)
        IsDirectory = [bool]($Item.PSIsContainer)
    }
}

function Get-SidValue {
    param($IdentityReference)
    try { return $IdentityReference.Translate([System.Security.Principal.SecurityIdentifier]).Value }
    catch { return [string]$IdentityReference.Value }
}

function Set-RestrictedAcl {
    param([string]$Path,[string]$TelAccountSid)
    $acl = Get-Acl -LiteralPath $Path
    $acl.SetAccessRuleProtection($true, $true)
    foreach ($rule in @($acl.Access)) {
        $sid = Get-SidValue $rule.IdentityReference
        if ($BroadSids -contains $sid) { [void]$acl.RemoveAccessRule($rule) }
    }
    $full = [System.Security.AccessControl.FileSystemRights]::FullControl
    $inherit = [System.Security.AccessControl.InheritanceFlags]::None
    $propagation = [System.Security.AccessControl.PropagationFlags]::None
    foreach ($sid in @($SystemSid,$AdministratorsSid,$TelAccountSid)) {
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            (New-Object System.Security.Principal.SecurityIdentifier($sid)), $full,
            $inherit, $propagation, [System.Security.AccessControl.AccessControlType]::Allow)
        [void]$acl.SetAccessRule($rule)
    }
    Set-Acl -LiteralPath $Path -AclObject $acl
    $after = Get-Acl -LiteralPath $Path
    if (-not $after.AreAccessRulesProtected) { throw "ARCHIVE_ACL_INHERITANCE_REMAINS:$Path" }
    foreach ($rule in @($after.Access)) {
        if ($BroadSids -contains (Get-SidValue $rule.IdentityReference)) { throw "ARCHIVE_ACL_BROAD_ACCESS_REMAINS:$Path" }
    }
}

function Save-Backup {
    param([string]$Root,[string]$Destination,[string]$TelAccountSid)
    if (Test-Path -LiteralPath $Destination) { throw 'ARCHIVE_ACL_BACKUP_EXISTS' }
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    $records = @(Get-ArchiveFiles $Root | ForEach-Object { Get-DescriptorRecord $Root $_ })
    $manifest = [pscustomobject]@{ ArchivePath=$Root; TelSid=$TelAccountSid; Records=$records }
    $manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $Destination 'ACL-SDDL.json') -Encoding UTF8
    Set-RestrictedAcl -Path $Destination -TelAccountSid $TelAccountSid
    return (Join-Path $Destination 'ACL-SDDL.json')
}

function Restore-Backup {
    param([string]$Root,[string]$Source)
    $manifest = Get-Content -LiteralPath (Join-Path $Source 'ACL-SDDL.json') -Raw | ConvertFrom-Json
    foreach ($record in @($manifest.Records)) {
        $target = Join-Path $Root ($record.Path.Replace('/','\'))
        if (-not (Test-Path -LiteralPath $target)) { throw "ARCHIVE_ACL_REVERT_TARGET_MISSING:$($record.Path)" }
        if ($record.IsDirectory) { $acl = New-Object System.Security.AccessControl.DirectorySecurity }
        else { $acl = New-Object System.Security.AccessControl.FileSecurity }
        $acl.SetSecurityDescriptorSddlForm($record.Sddl, [System.Security.AccessControl.AccessControlSections]::Access)
        if ($record.IsDirectory) { ([System.IO.DirectoryInfo]$target).SetAccessControl($acl) }
        else { ([System.IO.FileInfo]$target).SetAccessControl($acl) }
    }
}

function Assert-RestrictedArchive {
    param([string]$Root,[string]$TelAccountSid)
    $items = @(Get-ArchiveFiles $Root)
    foreach ($item in $items) {
        $acl = Get-Acl -LiteralPath $item.FullName
        if (-not $acl.AreAccessRulesProtected) { throw "ARCHIVE_ACL_INHERITANCE_REMAINS:$($item.FullName)" }
        foreach ($rule in @($acl.Access)) {
            if ($BroadSids -contains (Get-SidValue $rule.IdentityReference)) { throw "ARCHIVE_ACL_BROAD_ACCESS_REMAINS:$($item.FullName)" }
        }
        $sids = @($acl.Access | ForEach-Object { Get-SidValue $_.IdentityReference })
        foreach ($required in @($SystemSid,$AdministratorsSid,$TelAccountSid)) {
            if ($sids -notcontains $required) { throw "ARCHIVE_ACL_REQUIRED_SID_MISSING:$required" }
        }
    }
    return $items.Count
}

function Invoke-TestOnly {
    $root = Join-Path ([IO.Path]::GetTempPath()) ('archive-acl-test-' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path (Join-Path $root 'nested') -Force | Out-Null
    Set-Content -LiteralPath (Join-Path $root 'one.txt') -Value 'synthetic' -Encoding UTF8
    Set-Content -LiteralPath (Join-Path $root 'nested\two.txt') -Value 'synthetic' -Encoding UTF8
    $sid = Resolve-TelSid
    $backup = Join-Path ([IO.Path]::GetTempPath()) ('archive-acl-backup-' + [guid]::NewGuid().ToString('N'))
    try {
        [void](Save-Backup $root $backup $sid)
        $count = @(Get-ArchiveFiles $root).Count
        foreach ($item in @(Get-ArchiveFiles $root)) { Set-RestrictedAcl $item.FullName $sid }
        $verified = Assert-RestrictedArchive $root $sid
        Restore-Backup $root $backup
        $restored = @(Get-ArchiveFiles $root).Count -eq $count
        if (-not $restored) { throw 'ARCHIVE_ACL_TEST_RESTORE_FAILED' }
        "ARCHIVE_ACL_TEST=PASS;COUNT=$verified"
    } finally {
        Remove-Item -LiteralPath $backup -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue
    }
}

if ($Mode -eq 'TestOnly') { Invoke-TestOnly; exit 0 }
$sid = Resolve-TelSid
if ($Mode -eq 'Preflight') {
    $items = @(Get-ArchiveFiles $ArchivePath)
    "ARCHIVE_ACL_PREFLIGHT=PASS;COUNT=$($items.Count);TEL_SID=$sid"
    exit 0
}
if ($Mode -eq 'Apply') {
    if (-not $BackupPath) { $BackupPath = Join-Path (Split-Path $ArchivePath -Parent) ('archive-acl-backup-' + (Get-Date -Format 'yyyyMMdd-HHmmss')) }
    $manifestPath = Save-Backup $ArchivePath $BackupPath $sid
    try {
        foreach ($item in @(Get-ArchiveFiles $ArchivePath)) { Set-RestrictedAcl $item.FullName $sid }
        $count = Assert-RestrictedArchive $ArchivePath $sid
        "ARCHIVE_ACL=PASS;COUNT=$count;BACKUP=$manifestPath"
    } catch {
        throw
    }
    exit 0
}
if ($Mode -eq 'Revert') {
    if (-not $BackupPath) { throw 'ARCHIVE_ACL_BACKUP_REQUIRED' }
    Restore-Backup $ArchivePath $BackupPath
    'ARCHIVE_ACL_REVERT=PASS'
    exit 0
}
