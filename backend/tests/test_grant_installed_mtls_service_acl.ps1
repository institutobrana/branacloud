$ErrorActionPreference = 'Stop'
$scriptPath = Join-Path $PSScriptRoot '..\scripts\grant_installed_mtls_service_acl.ps1'
. $scriptPath
$tmp = Join-Path ([IO.Path]::GetTempPath()) ('mtls-acl-test-' + [guid]::NewGuid().ToString('N'))
try {
    $root = Join-Path $tmp 'mtls'
    New-Item -ItemType Directory -Path $root -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $root 'ca') -Force | Out-Null
    $exe = Join-Path $root 'BranaCloudeMtls.exe'
    [IO.File]::WriteAllBytes($exe, [byte[]](0x4d,0x5a))
    $beforeRoot = (Get-Acl $root).Sddl
    $beforeExe = (Get-Acl $exe).Sddl
    Add-MtlsServiceAcl $root Directory
    Add-MtlsServiceAcl $exe File
    Assert-MtlsServiceAcl $root
    Assert-MtlsServiceAcl $exe
    Add-MtlsServiceAcl $root Directory
    Assert-MtlsServiceAcl $root
    $childAcl = Get-Acl (Join-Path $root 'ca')
    if (@(Get-ServiceSidRule $childAcl.Access).Count -ne 0) { throw 'MTLS_ACL_CHILD_INHERITED' }
    $backup = Join-Path $tmp 'backup'
    New-Item -ItemType Directory -Path $backup | Out-Null
    [IO.File]::WriteAllText((Join-Path $backup 'root.sddl'), $beforeRoot)
    [IO.File]::WriteAllText((Join-Path $backup 'exe.sddl'), $beforeExe)
    Restore-MtlsAclSnapshot $root (Join-Path $backup 'root.sddl')
    Restore-MtlsAclSnapshot $exe (Join-Path $backup 'exe.sddl')
    if ((Get-Acl $root).Sddl -ne $beforeRoot -or (Get-Acl $exe).Sddl -ne $beforeExe) { throw 'MTLS_ACL_RESTORE_FAILED' }
    'MTLS_ACL_FUNCTION_TEST=PASS'
} finally {
    if (Test-Path $tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force }
}
