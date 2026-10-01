"""Generate disposable/operational mTLS material and register its public identity."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session


def cert(subject, key, issuer, issuer_key, *, ca=False, server=False, client=False):
    now = datetime.now(timezone.utc)
    b = (x509.CertificateBuilder().subject_name(x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, subject)])).issuer_name(issuer)
         .public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(now - timedelta(minutes=1))
         .not_valid_after(now + timedelta(days=365)).add_extension(x509.BasicConstraints(ca=ca, path_length=None), critical=True))
    if server:
        b = b.add_extension(x509.SubjectAlternativeName([x509.IPAddress(__import__('ipaddress').ip_address('127.0.0.1'))]), critical=False)
        b = b.add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]), critical=False)
    if client:
        b = b.add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.CLIENT_AUTH]), critical=False)
    return b.sign(issuer_key, hashes.SHA256())


def write_pair(root: Path, name: str, certificate, key) -> None:
    (root / f"{name}.crt").write_bytes(certificate.public_bytes(serialization.Encoding.PEM))
    (root / f"{name}.key").write_bytes(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.TraditionalOpenSSL, serialization.NoEncryption()))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--output-root', required=True)
    ap.add_argument('--database-url-file', required=True)
    ap.add_argument('--installation-id', required=True)
    ap.add_argument('--bind', default='127.0.0.1:8766')
    ap.add_argument('--register', action='store_true')
    args = ap.parse_args()
    root = Path(args.output_root).resolve()
    if root.exists() and any(root.iterdir()):
        raise RuntimeError('MTLS_PROVISION_DESTINATION_NOT_EMPTY')
    root.mkdir(parents=True, exist_ok=True)
    ca_dir, server_dir, client_dir = (root / n for n in ('ca', 'server', 'client'))
    # O material fica sob provisioned; o JSON é o único artefato no caminho
    # operacional referenciado pelo XML.
    config_dir = root.parent / 'config'
    for directory in (ca_dir, server_dir, client_dir):
        directory.mkdir()
    config_dir.mkdir(parents=True, exist_ok=True)
    ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'Brana Cloude mTLS CA')])
    ca = cert('Brana Cloude mTLS CA', ca_key, ca_name, ca_key, ca=True)
    server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    server = cert('Brana Cloude mTLS server', server_key, ca.subject, ca_key, server=True)
    client_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    client = cert('Brana Cloude bridge installation', client_key, ca.subject, ca_key, client=True)
    (ca_dir / 'ca.crt').write_bytes(ca.public_bytes(serialization.Encoding.PEM))
    write_pair(server_dir, 'server', server, server_key); write_pair(client_dir, 'client', client, client_key)
    der_hash = hashlib.sha256(client.public_bytes(serialization.Encoding.DER)).hexdigest()
    database_url = Path(args.database_url_file).read_text(encoding='utf-8').strip()
    config = {'database_url': database_url, 'ca_cert': str(ca_dir / 'ca.crt'), 'server_cert': str(server_dir / 'server.crt'), 'server_key': str(server_dir / 'server.key'), 'bind': args.bind}
    (config_dir / 'mtls-service.json').write_text(json.dumps(config, separators=(',', ':')), encoding='utf-8')
    (root / 'provision-recovery.json').write_text(json.dumps({'phase': 'MATERIAL_READY', 'installation_id': args.installation_id}), encoding='utf-8')
    if args.register:
        try:
            os.environ['DATABASE_URL'] = database_url
            import sys
            sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
            from models.bridge_installation import BridgeInstallation, BridgeInstallationEvent
            engine = create_engine(database_url)
            with Session(engine) as session:
                existing = session.scalar(select(BridgeInstallation).where(BridgeInstallation.installation_id == args.installation_id))
                if existing and (existing.certificate_der_sha256 != der_hash or existing.status != 'ACTIVE'):
                    raise RuntimeError('MTLS_PROVISION_INSTALLATION_CONFLICT')
                if not existing:
                    session.add(BridgeInstallation(installation_id=args.installation_id, certificate_der_sha256=der_hash, status='ACTIVE', generation=1))
                    session.add(BridgeInstallationEvent(installation_id=args.installation_id, event_type='REGISTERED', generation=1, detail_code='ADMIN_PROVISION'))
                session.commit()
            (root / 'provision-recovery.json').write_text(json.dumps({'phase': 'SQL_COMMITTED', 'installation_id': args.installation_id, 'generation': 1}), encoding='utf-8')
        except Exception:
            (root / 'provision-recovery.json').write_text(json.dumps({'phase': 'SQL_FAILED', 'installation_id': args.installation_id, 'code': 'MTLS_PROVISION_SQL_FAILED'}), encoding='utf-8')
            raise
    print(json.dumps({'installation_id': args.installation_id, 'certificate_der_sha256_prefix': der_hash[:12], 'generation': 1, 'status': 'ACTIVE'}))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
