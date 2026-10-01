$ErrorActionPreference = 'Stop'
$script = Join-Path $PSScriptRoot '..\scripts\prepare_admin_database_url.ps1'
. (Resolve-Path $script) -ValidateOnly
$pgBin = 'C:\Program Files\PostgreSQL\18\bin'
$testRoot = Join-Path $env:TEMP ('brana-pg-admin-test-' + [guid]::NewGuid().ToString('N'))
$pgData = Join-Path $testRoot 'data'
$database = 'mtls_admin_' + ([guid]::NewGuid().ToString('N').Substring(0, 12))
$pgPort = 0
$postmasterPid = $null
$clusterStarted = $false
$occupier = $null

function Get-FreePort {
    $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, 0)
    $listener.Start()
    try { return $listener.LocalEndpoint.Port } finally { $listener.Stop() }
}
function Test-PortFree([int]$Port) { return -not (Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue) }
function Normalize-WindowsPath([string]$Path) {
    $normalized = $Path.Replace('/', '\')
    $normalized = [System.IO.Path]::GetFullPath($normalized)
    return $normalized.TrimEnd('\')
}
function Test-PathEquivalent([string]$Left, [string]$Right) {
    return [StringComparer]::OrdinalIgnoreCase.Equals((Normalize-WindowsPath $Left), (Normalize-WindowsPath $Right))
}
function Assert-OwnPostmaster {
    if (-not $postmasterPid -or -not (Test-Path -LiteralPath (Join-Path $pgData 'postmaster.pid'))) { throw 'POSTMASTER_OWNERSHIP_UNKNOWN' }
    $line = (Get-Content -LiteralPath (Join-Path $pgData 'postmaster.pid') -TotalCount 1).Trim()
    if ($line -ne [string]$postmasterPid) { throw 'POSTMASTER_PID_MISMATCH' }
    $process = Get-CimInstance Win32_Process -Filter "ProcessId=$postmasterPid" -ErrorAction SilentlyContinue
    if (-not $process) { throw 'POSTMASTER_DIRECTORY_MISMATCH fixture=' + (Normalize-WindowsPath $pgData) + ' observed=<process-missing>' }
    $match = [regex]::Match($process.CommandLine, '-D\s+"([^"]+)"')
    if (-not $match.Success) { $match = [regex]::Match($process.CommandLine, '-D\s+([^\s]+)') }
    $observed = if ($match.Success) { Normalize-WindowsPath $match.Groups[1].Value } else { '<directory-unavailable>' }
    if (-not $match.Success -or -not (Test-PathEquivalent $pgData $observed)) {
        throw 'POSTMASTER_DIRECTORY_MISMATCH fixture=' + (Normalize-WindowsPath $pgData) + ' observed=' + $observed
    }
}
try {
    if (-not (Test-PathEquivalent 'C:\Temp\Brana\Data\' 'c:/temp/brana/data')) { throw 'PATH_NORMALIZATION_EQUAL_FAILED' }
    if (Test-PathEquivalent 'C:\Temp\Brana\DataA' 'C:\Temp\Brana\DataB') { throw 'PATH_NORMALIZATION_DIFFERENT_FAILED' }
    New-Item -ItemType Directory -Path $testRoot -Force | Out-Null
    $ownershipPath = Join-Path $testRoot 'set_ownership.py'
    @'
import os
import psycopg2
from psycopg2 import sql

connection = psycopg2.connect(host='127.0.0.1', port=int(os.environ['MTLS_TEST_PORT']), dbname=os.environ['MTLS_TEST_DB'], user='postgres')
connection.autocommit = True
cursor = connection.cursor()
tables = ('bridge_installations', 'bridge_installation_events', 'signature_reservation_requests', 'signature_authorizations')
for table in tables:
    cursor.execute(sql.SQL('alter table {} owner to {}').format(sql.Identifier('public', table), sql.Identifier('admin@example')))
cursor.execute("""select distinct n.nspname, s.relname from pg_class t join pg_namespace tn on tn.oid=t.relnamespace join pg_attribute a on a.attrelid=t.oid left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum cross join lateral pg_get_serial_sequence(format('%%I.%%I', tn.nspname, t.relname), a.attname) as q(sequence_name) join pg_class s on s.oid=q.sequence_name::regclass join pg_namespace n on n.oid=s.relnamespace where tn.nspname='public' and t.relname=any(%s) and a.attnum>0 and not a.attisdropped and (a.attidentity in ('a','d') or pg_get_expr(d.adbin,d.adrelid) like 'nextval(%%)') order by n.nspname, s.relname""", (list(tables),))
sequences = cursor.fetchall()
for schema, sequence in sequences:
    cursor.execute(sql.SQL('alter sequence {} owner to {}').format(sql.Identifier(schema, sequence), sql.Identifier('admin@example')))
assert sequences
cursor.close()
connection.close()
'@ | Set-Content -LiteralPath $ownershipPath -Encoding ASCII
    python -m py_compile $ownershipPath
    if ($LASTEXITCODE -ne 0) { throw 'OWNERSHIP_PY_COMPILE_FAILED' }
    $createRolePath = Join-Path $testRoot 'create_role.py'
    @'
import os
import psycopg2
from psycopg2 import sql

connection = psycopg2.connect(host='127.0.0.1', port=int(os.environ['MTLS_TEST_PORT']), dbname='postgres', user='postgres')
connection.autocommit = True
cursor = connection.cursor()
cursor.execute(sql.SQL('create role {} login createrole password %s').format(sql.Identifier('admin@example')), (os.environ['MTLS_TEST_PASSWORD'],))
cursor.close()
connection.close()
'@ | Set-Content -LiteralPath $createRolePath -Encoding ASCII
    $connectionCheckPath = Join-Path $testRoot 'connection_check.py'
    @'
import os
import psycopg2

connection = psycopg2.connect(open(os.environ['ADMIN_URL_TEST_FILE'], encoding='utf-8').read().strip())
cursor = connection.cursor()
cursor.execute('select current_database(), inet_server_port(), current_user')
assert cursor.fetchone() == (os.environ['MTLS_TEST_DB'], int(os.environ['MTLS_TEST_PORT']), 'admin@example')
cursor.execute("select count(*) from pg_tables where schemaname='public' and tablename = any(%s) and tableowner='admin@example'", (['bridge_installations', 'bridge_installation_events', 'signature_reservation_requests', 'signature_authorizations'],))
assert cursor.fetchone()[0] == 4
cursor.execute("select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace join pg_roles r on r.oid=c.relowner where n.nspname='public' and c.relkind='S' and c.relname like %s and r.rolname='admin@example'", ('%_id_seq',))
assert cursor.fetchone()[0] >= 4
cursor.execute('select rolsuper from pg_roles where rolname=current_user')
assert cursor.fetchone()[0] is False
print('ADMIN_URL_CONNECTION=PASS')
cursor.close()
connection.close()
'@ | Set-Content -LiteralPath $connectionCheckPath -Encoding ASCII
    $applyPath = Join-Path $testRoot 'apply_role.py'
    @'
import os
import sys

sys.path.insert(0, os.path.abspath('backend/scripts'))
import configure_mtls_db_role as module

module.getpass.getpass = lambda _: os.environ['MTLS_TEST_PASSWORD']
sys.argv = ['configure_mtls_db_role.py', '--admin-url-file', os.environ['ADMIN_URL_TEST_FILE'], '--role', 'brana_mtls_service', '--apply']
raise SystemExit(module.main())
'@ | Set-Content -LiteralPath $applyPath -Encoding ASCII
    $privilegedPath = Join-Path $testRoot 'privileged_role.py'
    @'
import os
import psycopg2
from psycopg2 import sql

connection = psycopg2.connect(host='127.0.0.1', port=int(os.environ['MTLS_TEST_PORT']), dbname='postgres', user='postgres')
connection.autocommit = True
cursor = connection.cursor()
cursor.execute(sql.SQL('create role {} login superuser').format(sql.Identifier('brana_mtls_service_privileged')))
cursor.close()
connection.close()
'@ | Set-Content -LiteralPath $privilegedPath -Encoding ASCII
    $privilegedApplyPath = Join-Path $testRoot 'apply_privileged_role.py'
    @'
import os
import sys

sys.path.insert(0, os.path.abspath('backend/scripts'))
import configure_mtls_db_role as module

module.getpass.getpass = lambda _: os.environ['MTLS_TEST_PASSWORD']
sys.argv = ['configure_mtls_db_role.py', '--admin-url-file', os.environ['ADMIN_URL_TEST_FILE'], '--role', 'brana_mtls_service_privileged', '--apply']
try:
    module.main()
except RuntimeError as error:
    if str(error) != 'MTLS_DB_ROLE_EXISTING_PRIVILEGED':
        raise
    print('PRIVILEGED_ROLE_REJECTED=PASS')
else:
    raise SystemExit('PRIVILEGED_ROLE_REJECTED=FAIL')
'@ | Set-Content -LiteralPath $privilegedApplyPath -Encoding ASCII
    $cleanupPath = Join-Path $testRoot 'cleanup.py'
    @'
import os
import psycopg2
from psycopg2 import sql

connection = psycopg2.connect(host='127.0.0.1', port=int(os.environ['MTLS_TEST_PORT']), dbname='postgres', user='postgres')
connection.autocommit = True
cursor = connection.cursor()
cursor.execute(sql.SQL('drop database if exists {}').format(sql.Identifier(os.environ['MTLS_TEST_DB'])))
for role in ('admin@example', 'brana_mtls_service', 'brana_mtls_service_privileged'):
    cursor.execute(sql.SQL('drop role if exists {}').format(sql.Identifier(role)))
cursor.execute('select 1 from pg_database where datname=%s', (os.environ['MTLS_TEST_DB'],))
assert cursor.fetchone() is None
cursor.close()
connection.close()
print('DISPOSABLE_CLEANUP=PASS')
'@ | Set-Content -LiteralPath $cleanupPath -Encoding ASCII
    foreach ($pythonFile in @($createRolePath, $ownershipPath, $connectionCheckPath, $applyPath, $privilegedPath, $privilegedApplyPath, $cleanupPath)) {
        python -m py_compile $pythonFile
        if ($LASTEXITCODE -ne 0) { throw 'PY_COMPILE_FAILED' }
    }
    $occupiedPort = Get-FreePort
    $occupier = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $occupiedPort)
    $occupier.Start()
    if (Test-PortFree $occupiedPort) { throw 'OCCUPIED_PORT_NOT_DETECTED' }
    $occupiedData = Join-Path $testRoot 'occupied-data'
    if (Test-Path -LiteralPath $occupiedData) { throw 'OCCUPIED_DATA_UNEXPECTED' }
    $occupier.Stop(); $occupier = $null
    $pgPort = Get-FreePort
    if (-not (Test-PortFree $pgPort)) { throw 'PORT_NOT_FREE_BEFORE_START' }
    & (Join-Path $pgBin 'initdb.exe') -D $pgData -U postgres -A trust --no-locale
    if ($LASTEXITCODE -ne 0) { throw 'INITDB_FAILED' }
    & (Join-Path $pgBin 'pg_ctl.exe') -D $pgData -o "-p $pgPort -h 127.0.0.1" -w start
    if ($LASTEXITCODE -ne 0) { throw 'PG_START_FAILED' }
    $clusterStarted = $true
    $postmasterPid = [int](Get-Content -LiteralPath (Join-Path $pgData 'postmaster.pid') -TotalCount 1)
    Assert-OwnPostmaster
    $psql = Join-Path $pgBin 'psql.exe'
    & $psql -h 127.0.0.1 -p $pgPort -U postgres -d postgres -v ON_ERROR_STOP=1 -c "create database $database"
    if ($LASTEXITCODE -ne 0) { throw 'DATABASE_CREATE_FAILED' }
    $schema = "create table bridge_installations(id serial primary key); create table bridge_installation_events(id serial primary key); create table signature_reservation_requests(id serial primary key); create table signature_authorizations(id serial primary key);"
    & $psql -h 127.0.0.1 -p $pgPort -U postgres -d $database -v ON_ERROR_STOP=1 -c $schema
    if ($LASTEXITCODE -ne 0) { throw 'SCHEMA_FAILED' }
    $special = -join @([char]64, [char]58, [char]47, [char]37)
    $syntheticPassword = 'Synthetic' + $special + 'Pass'
    $env:MTLS_TEST_PORT = [string]$pgPort; $env:MTLS_TEST_DB = $database; $env:MTLS_TEST_PASSWORD = $syntheticPassword
    python $createRolePath
    if ($LASTEXITCODE -ne 0) { throw 'ROLE_CREATE_FAILED' }
    python $ownershipPath
    if ($LASTEXITCODE -ne 0) { throw 'OWNERSHIP_SETUP_FAILED' }
    $hba = Join-Path $pgData 'pg_hba.conf'; $hbaBackup = Join-Path $testRoot 'pg_hba.conf.backup'
    Copy-Item -LiteralPath $hba -Destination $hbaBackup
    @("host $database all 127.0.0.1/32 scram-sha-256") + (Get-Content -LiteralPath $hba) | Set-Content -LiteralPath $hba -Encoding ASCII
    & (Join-Path $pgBin 'pg_ctl.exe') -D $pgData reload
    if ($LASTEXITCODE -ne 0) { throw 'HBA_RELOAD_FAILED' }
    $secure = ConvertTo-SecureString $syntheticPassword -AsPlainText -Force
    $url = New-AdminDatabaseUrl -User 'admin@example' -Password $secure -DatabaseHost '127.0.0.1' -Port $pgPort -Database $database
    $adminFile = Write-ProtectedAdminUrl -Root (Join-Path $testRoot 'admin') -Url $url
    Assert-RestrictedAcl -Path (Split-Path $adminFile); Assert-RestrictedAcl -Path $adminFile
    $bytes = [System.IO.File]::ReadAllBytes($adminFile); $prefix = [System.Text.Encoding]::ASCII.GetBytes('postgresql://')
    for ($i = 0; $i -lt $prefix.Length; $i++) { if ($bytes[$i] -ne $prefix[$i]) { throw 'BOM_OR_PREFIX_INVALID' } }
    $env:ADMIN_URL_TEST_FILE = $adminFile
    python $connectionCheckPath
    if ($LASTEXITCODE -ne 0) { throw 'PASSWORD_CONNECTION_FAILED' }
    python (Join-Path $PSScriptRoot '..\scripts\configure_mtls_db_role.py') --admin-url-file $adminFile --role brana_mtls_service
    if ($LASTEXITCODE -ne 0) { throw 'ROLE_ABSENT_CHECK_FAILED' }
    $env:MTLS_TEST_PASSWORD = $syntheticPassword
    python $applyPath
    if ($LASTEXITCODE -ne 0) { throw 'ROLE_APPLY_FAILED' }
    python $privilegedPath
    if ($LASTEXITCODE -ne 0) { throw 'PRIVILEGED_ROLE_SETUP_FAILED' }
    python $privilegedApplyPath
    if ($LASTEXITCODE -ne 0) { throw 'PRIVILEGED_ROLE_REJECTION_FAILED' }
    python (Join-Path $PSScriptRoot '..\scripts\configure_mtls_db_role.py') --admin-url-file $adminFile --role brana_mtls_service
    if ($LASTEXITCODE -ne 0) { throw 'ROLE_CHECK_FAILED' }
    'ADMIN_URL_HELPER_TEST=PASS'; 'OCCUPIED_CASE=PASS'
}
finally {
    if ($clusterStarted -and (Test-Path -LiteralPath $cleanupPath)) {
        python $cleanupPath
        if ($LASTEXITCODE -ne 0) { Write-Output 'DISPOSABLE_CLEANUP=FAIL' }
    }
    Remove-Item Env:ADMIN_URL_TEST_FILE,MTLS_TEST_DB,MTLS_TEST_PORT,MTLS_TEST_PASSWORD -ErrorAction SilentlyContinue
    if ($occupier) { $occupier.Stop() }
    if ($clusterStarted -and (Test-Path -LiteralPath $pgData)) {
        $current = Get-Content -LiteralPath (Join-Path $pgData 'postmaster.pid') -TotalCount 1 -ErrorAction SilentlyContinue
        if ($current -eq [string]$postmasterPid) { & (Join-Path $pgBin 'pg_ctl.exe') -D $pgData -w stop 2>$null }
    }
    if (Test-Path -LiteralPath $testRoot) { Remove-Item -LiteralPath $testRoot -Recurse -Force -ErrorAction SilentlyContinue }
    if (Get-NetTCPConnection -LocalPort $pgPort -ErrorAction SilentlyContinue) { Write-Output 'PORT_CLEANUP=FAIL' } else { Write-Output 'PORT_CLEANUP=PASS' }
}
