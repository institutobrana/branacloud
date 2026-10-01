$ErrorActionPreference = 'Stop'
$tmp = Join-Path ([IO.Path]::GetTempPath()) ('mtls-audit-' + [guid]::NewGuid().ToString('N'))
try {
    $logs = Join-Path $tmp 'logs'
    New-Item -ItemType Directory -Path $logs -Force | Out-Null
    $xml = Join-Path $tmp 'service.xml'
    Set-Content -LiteralPath $xml -Value '<service><logpath>logs</logpath></service>' -Encoding UTF8
    $log = Join-Path $logs 'winsw.log'
    Set-Content -LiteralPath $log -Value 'python.exe child process pid 42' -Encoding UTF8
    (Get-Item $log).LastWriteTime = [datetime]'2026-10-01T10:59:00'
    $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'audit_mtls_startup_window.ps1') -XmlPath $xml -WindowStart ([datetime]'2026-10-01T10:58:00') -WindowEnd ([datetime]'2026-10-01T11:01:00')
    if (($out -join "`n") -notmatch 'PYTHON_STARTED=False' -or ($out -join "`n") -notmatch 'WRAPPER_STARTED=False') { throw 'CONTRADICTORY_PYTHON_EVIDENCE' }
    Set-Content -LiteralPath $log -Value 'python exception' -Encoding UTF8
    (Get-Item $log).LastWriteTime = [datetime]'2026-10-01T10:59:00'
    $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'audit_mtls_startup_window.ps1') -XmlPath $xml -WindowStart ([datetime]'2026-10-01T10:58:00') -WindowEnd ([datetime]'2026-10-01T11:01:00')
    if (($out -join "`n") -notmatch 'PYTHON_STARTED=False') { throw 'PYTHON_FALSE_POSITIVE' }
    Remove-Item -LiteralPath $log -Force
    foreach($name in @('BranaCloudeMtls-wrapper.log','stdout.log','stderr-error.log')) {
        $p=Join-Path $logs $name
        $value = if($name -eq 'stderr-error.log') { 'ERROR ValueError HRESULT 0x80070005' } else { 'informational' }
        Set-Content -LiteralPath $p -Value $value -Encoding UTF8
        (Get-Item $p).LastWriteTime=[datetime]'2026-10-01T10:59:11'
    }
    $out = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'audit_mtls_startup_window.ps1') -XmlPath $xml -WindowStart ([datetime]'2026-10-01T10:58:00') -WindowEnd ([datetime]'2026-10-01T11:01:00')
    if (($out -join "`n") -notmatch 'LOG_FILE_COUNT=3') { throw 'LOG_COUNT_FAILED' }
    if (($out -join "`n") -notmatch 'FIRST_LOG_ERROR_SOURCE=STDERR') { throw 'LOG_SOURCE_FAILED' }
    if (($out -join "`n") -notmatch 'FIRST_LOG_ERROR_CODE=0X80070005') { throw 'LOG_CODE_FAILED' }
    'MTLS_AUDIT_SYNTHETIC_TEST=PASS'
} finally {
    if (Test-Path $tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force }
}
