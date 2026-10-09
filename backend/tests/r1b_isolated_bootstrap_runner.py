"""Only the disposable R1B container is mutable; never loads production env."""
import json
import os
import secrets
import socket
import subprocess
import sys
import time
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path('C:/Temp/Brana/SEEDS_BOOTSTRAP_R1B_IMPLEMENT_AND_ISOLATED_PROOF')
PORT = 55432
DBNAME = 'brana_r1b_proof'
USER = 'brana_r1b_test'
NAME = 'brana-r1b-proof-' + uuid.uuid4().hex[:12]
LABEL = 'brana.phase=R1B-isolated-proof'
PASSWORD = secrets.token_hex(20)
JWT = secrets.token_hex(32)
TEST_PASSWORD = secrets.token_hex(16)

def scrub(value):
    for secret in (PASSWORD, JWT, TEST_PASSWORD):
        value = value.replace(secret, '[REDACTED]')
    return value

def save(name, value):
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def command(args, env=None):
    return subprocess.run(args, cwd=str(ROOT), env=env, text=True, encoding='utf-8',
                          errors='replace', capture_output=True, stdin=subprocess.DEVNULL)

def inspect_owned():
    check = command(['docker', 'inspect', NAME])
    if check.returncode:
        raise RuntimeError('Disposable container inspection failed')
    detail = json.loads(check.stdout)[0]
    if (detail['Name'] != '/' + NAME or detail['Config']['Labels'].get('brana.phase') != 'R1B-isolated-proof'
            or detail['Config']['Image'] != 'postgres:16-alpine'):
        raise RuntimeError('Refusing unrelated container')
    mapping = detail['HostConfig']['PortBindings'].get('5432/tcp')
    if mapping != [{'HostIp': '127.0.0.1', 'HostPort': str(PORT)}]:
        raise RuntimeError('Unexpected port binding')
    return detail['Id']

with socket.socket() as sock:
    if sock.connect_ex(('127.0.0.1', PORT)) == 0:
        raise RuntimeError('Port 55432 already occupied; refusing existing database')

started = False
result_code = 1
try:
    run = command(['docker', 'run', '-d', '--rm', '--name', NAME, '--label', LABEL,
                   '-p', f'127.0.0.1:{PORT}:5432', '-e', f'POSTGRES_PASSWORD={PASSWORD}',
                   '-e', f'POSTGRES_USER={USER}', '-e', f'POSTGRES_DB={DBNAME}', 'postgres:16-alpine'])
    if run.returncode:
        raise RuntimeError(scrub(run.stderr))
    started = True
    container_id = inspect_owned()
    import psycopg2
    deadline = time.monotonic() + 60
    while True:
        try:
            with psycopg2.connect(host='127.0.0.1', port=PORT, user=USER, password=PASSWORD,
                                  dbname=DBNAME, connect_timeout=2) as conn:
                with conn.cursor() as cur:
                    cur.execute('SELECT current_database(), inet_server_port()')
                    identity = cur.fetchone()
            if identity != (DBNAME, 5432):
                raise RuntimeError('Unexpected disposable database identity')
            break
        except psycopg2.OperationalError:
            if time.monotonic() >= deadline:
                raise RuntimeError('Disposable PostgreSQL did not become ready')
            time.sleep(.5)
    print('Disposable PostgreSQL verified on loopback 55432.', flush=True)
    env = os.environ.copy()
    url = f'postgresql://{USER}:{PASSWORD}@127.0.0.1:{PORT}/{DBNAME}'
    env.update(DATABASE_URL=url, BRANA_RUNTIME_PROFILE='homologation', JWT_SECRET_KEY=JWT,
               BRANA_ENABLE_SCHEMA_BOOTSTRAP='0', BRANA_ENABLE_RUNTIME_BOOTSTRAP='0',
               BRANA_ALLOW_HTTP_RUNTIME_BOOTSTRAP='0', BRANA_ENABLE_SCHEMA_COMPATIBILITY='0',
               BRANA_SCHEMA_DEPLOYMENT_ALLOW_LOCALHOST='1',
               BRANA_SCHEMA_DEPLOYMENT_ACK='BRANA_SCHEMA_DEPLOYMENT_ACKNOWLEDGED',
               BRANA_R1B_ISOLATED_URL=url, BRANA_R1B_TEST_PASSWORD=TEST_PASSWORD,
               BRANA_R1B_ARTIFACT_DIR=str(OUT), PYTHONDONTWRITEBYTECODE='1', PYTHONIOENCODING='utf-8')
    schema = command([sys.executable, '-B', '-m', 'backend.scripts.apply_schema_baseline', '--apply'], env)
    save('isolated_schema_preparation.json', {'returncode': schema.returncode,
        'stdout': scrub(schema.stdout), 'stderr': scrub(schema.stderr),
        'target': {'host': '127.0.0.1', 'port': PORT, 'database': DBNAME},
        'official_env_changed': False, 'container_name': NAME, 'container_id': container_id})
    if schema.returncode:
        raise RuntimeError('Schema preparation failed: ' + scrub(schema.stderr[-5000:]))
    print('Official schema baseline applied only to disposable database.', flush=True)
    tests = command([sys.executable, '-B', '-m', 'unittest',
                     'backend.tests.test_procedimentos_bootstrap_canonical', '-v'], env)
    save('isolated_test_run.json', {'returncode': tests.returncode, 'stdout': scrub(tests.stdout),
                                   'stderr': scrub(tests.stderr)})
    print(scrub(tests.stderr), flush=True)
    result_code = tests.returncode
finally:
    if started:
        inspect_owned()
        cleanup = command(['docker', 'rm', '-f', NAME])
        save('isolated_cleanup.json', {'container_name': NAME, 'removed': cleanup.returncode == 0,
                                      'production_writes': 0, 'official_runtime_stopped': False})
        if cleanup.returncode:
            raise RuntimeError('Disposable container cleanup failed')
        print('Only the owned disposable container was removed.', flush=True)
sys.exit(result_code)
