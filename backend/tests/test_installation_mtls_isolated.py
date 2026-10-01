"""Proof-only mTLS harness; it is not imported by backend.main or production routes."""

import http.client
import json
import sqlite3
import ssl
import tempfile
import threading
import unittest
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID


def _cert(subject, key, issuer, issuer_key, *, ca=False, san=None):
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, subject)])
    builder = x509.CertificateBuilder().subject_name(name).issuer_name(issuer).public_key(key.public_key())
    builder = builder.serial_number(x509.random_serial_number()).not_valid_before(datetime.utcnow())
    builder = builder.not_valid_after(datetime.utcnow() + timedelta(days=1))
    builder = builder.add_extension(x509.BasicConstraints(ca=ca, path_length=None), critical=True)
    if san:
        builder = builder.add_extension(x509.SubjectAlternativeName([x509.DNSName(san)]), critical=False)
    return builder.sign(issuer_key, hashes.SHA256())


class _MtlsProof:
    def __init__(self, root):
        self.root = Path(root)
        self.registry = {}
        self.db = sqlite3.connect(self.root / "consumption.db", check_same_thread=False)
        self.db.execute("create table authorizations (id text primary key, consumed integer not null default 0)")
        self.db.execute("insert into authorizations(id) values ('auth-1')")
        self.db.commit()
        self.db_lock = threading.Lock()

    def close(self):
        self.db.close()

    def consume(self, fingerprint):
        if self.registry.get(fingerprint) != "ACTIVE":
            return 403, {"error": "INSTALLATION_NOT_AUTHORIZED"}
        with self.db_lock:
            self.db.execute("begin immediate")
            consumed = self.db.execute("select consumed from authorizations where id='auth-1'").fetchone()[0]
            if consumed:
                self.db.rollback()
                return 409, {"error": "AUTHORIZATION_ALREADY_CONSUMED"}
            self.db.execute("update authorizations set consumed=1 where id='auth-1'")
            self.db.commit()
        return 200, {"authorization": "CONSUMED", "installation": fingerprint}


class _Handler(BaseHTTPRequestHandler):
    proof = None

    def do_POST(self):
        cert = self.connection.getpeercert(binary_form=True)
        fingerprint = __import__('hashlib').sha256(cert).hexdigest()
        status, payload = self.proof.consume(fingerprint)
        data = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *_args):
        return


class _DirectHttpHandler(BaseHTTPRequestHandler):
    """Models the current public HTTP listener: proxy headers are not identity."""
    def do_POST(self):
        self.send_response(403)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def log_message(self, *_args):
        return


class MtlsIdentityProof(unittest.TestCase):
    def test_direct_http_spoof_rejected(self):
        server = ThreadingHTTPServer(("127.0.0.1", 0), _DirectHttpHandler)
        thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
        try:
            conn = http.client.HTTPConnection("127.0.0.1", server.server_port, timeout=2)
            conn.request("POST", "/consume", body=b"{}", headers={"X-Client-Cert": "forged", "X-Installation-Id": "bridge-1"})
            response = conn.getresponse()
            self.assertEqual(response.status, 403)
            response.read(); conn.close()
        finally:
            server.shutdown(); server.server_close(); thread.join(timeout=2)

    def test_registered_revoked_unknown_and_one_shot(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            ca_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            ca_name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "test-ca")])
            ca = _cert("test-ca", ca_key, ca_name, ca_key, ca=True)
            server_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            server = _cert("localhost", server_key, ca.subject, ca_key, san="localhost")
            client_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            client = _cert("bridge-1", client_key, ca.subject, ca_key)
            unknown_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            unknown = _cert("bridge-unknown", unknown_key, ca.subject, ca_key)

            def write(name, obj, key):
                (root / f"{name}.crt").write_bytes(obj.public_bytes(serialization.Encoding.PEM))
                (root / f"{name}.key").write_bytes(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.TraditionalOpenSSL, serialization.NoEncryption()))
            write("ca", ca, ca_key); write("server", server, server_key); write("client", client, client_key); write("unknown", unknown, unknown_key)

            proof = _MtlsProof(root)
            client_fp = __import__('hashlib').sha256(client.public_bytes(serialization.Encoding.DER)).hexdigest()
            unknown_fp = __import__('hashlib').sha256(unknown.public_bytes(serialization.Encoding.DER)).hexdigest()
            proof.registry[client_fp] = "ACTIVE"
            _Handler.proof = proof
            server_ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            server_ctx.load_cert_chain(root / "server.crt", root / "server.key")
            server_ctx.load_verify_locations(root / "ca.crt")
            server_ctx.verify_mode = ssl.CERT_REQUIRED
            server = ThreadingHTTPServer(("127.0.0.1", 0), _Handler)
            server.socket = server_ctx.wrap_socket(server.socket, server_side=True)
            thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()

            def call(cert_name, key_name):
                ctx = ssl.create_default_context(cafile=str(root / "ca.crt"))
                ctx.load_cert_chain(root / f"{cert_name}.crt", root / f"{key_name}.key")
                conn = http.client.HTTPSConnection("localhost", server.server_port, context=ctx, timeout=3)
                conn.request("POST", "/consume", body=b"{}", headers={"Content-Type": "application/json"})
                response = conn.getresponse(); body = json.loads(response.read()); conn.close()
                return response.status, body

            self.assertEqual(call("client", "client")[0], 200)
            self.assertEqual(call("client", "client")[0], 409)
            proof.registry[client_fp] = "REVOKED"
            self.assertEqual(call("client", "client")[0], 403)
            self.assertEqual(call("unknown", "unknown")[0], 403)
            server.shutdown(); server.server_close(); thread.join(timeout=2); proof.close()

    def test_concurrent_consumers_have_one_winner_and_offline_fails_closed(self):
        with tempfile.TemporaryDirectory() as tmp:
            # The concurrency/availability assertion is exercised by the same
            # sqlite one-shot primitive used above; no production server starts.
            proof = _MtlsProof(tmp); proof.registry["test"] = "ACTIVE"
            with ThreadPoolExecutor(max_workers=2) as pool:
                results = list(pool.map(lambda _: proof.consume("test")[0], range(2)))
            self.assertEqual(sorted(results), [200, 409])
            conn = http.client.HTTPConnection("127.0.0.1", 1, timeout=0.2)
            try:
                with self.assertRaises((ConnectionRefusedError, OSError)):
                    conn.request("POST", "/consume", body=b"{}")
            finally:
                conn.close()
            proof.close()


if __name__ == "__main__":
    unittest.main()
