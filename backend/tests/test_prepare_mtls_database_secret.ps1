$ErrorActionPreference = 'Stop'
$script = Join-Path $PSScriptRoot '..\scripts\prepare_mtls_database_secret.ps1'
. (Resolve-Path $script)
$root = Join-Path $env:TEMP ('brana-mtls-secret-test-' + [guid]::NewGuid().ToString('N'))
$file = Join-Path $root 'database-url.secret'
try {
    New-Item -ItemType Directory -Path $root -Force | Out-Null
    $special = -join @([char]64, [char]58, [char]47, [char]37)
    $secure = ConvertTo-SecureString ('Synthetic' + $special + 'Pass') -AsPlainText -Force
    Write-MtlsDatabaseSecret -SecretPath $file -Password $secure | Out-Null
    $bytes = [IO.File]::ReadAllBytes($file)
    $prefix = [Text.Encoding]::ASCII.GetBytes('postgresql://')
    for ($i = 0; $i -lt $prefix.Length; $i++) { if ($bytes[$i] -ne $prefix[$i]) { throw 'BOM_OR_PREFIX_INVALID' } }
    Assert-Acl $file
    try { Write-MtlsDatabaseSecret -SecretPath $file -Password $secure; throw 'EXISTING_FILE_NOT_REJECTED' }
    catch { if ($_.Exception.Message -ne 'MTLS_DATABASE_SECRET_EXISTS') { throw } }
    'SERVICE_DB_SECRET_FUNCTION_TEST=PASS'
}
finally {
    if (Test-Path -LiteralPath $root) { Remove-Item -LiteralPath $root -Recurse -Force -ErrorAction SilentlyContinue }
}
