"""Ephemeral HTTPS ASGI server for the real JS bridge cross-proof."""
from __future__ import annotations
import json, os, subprocess, tempfile, threading, time
from pathlib import Path
from datetime import datetime, timedelta, timezone
import uvicorn
import fitz
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID, ExtendedKeyUsageOID
from local_bridge.secure_bridge_app import create_secure_bridge_runtime
from local_bridge.security.instance_runtime import InMemoryInstanceLock
from local_bridge.security.ui import ApprovalDecision, PendingApprovalUI
from local_bridge.security.tls_runtime import TLSRuntimeConfig
from backend.services.editor_signature_anchor_service import prepare_signature_anchor

ROOT = Path(__file__).resolve().parents[2]
NODE = ROOT / "frontend-react" / "tests" / "js_https_result_crossproof_client.mjs"

class Approve(PendingApprovalUI):
    def approve_pairing(self, request): return ApprovalDecision.APPROVED
    def approve_signature(self, operation): return ApprovalDecision.APPROVED

class EphemeralSigner:
    def __init__(self, result: bytes): self.result, self.calls = result, 0
    async def async_sign_prepared(self, request):
        self.calls += 1
        return self.result

def cert_pair(tmp: Path):
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    now = datetime.now(timezone.utc)
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "localhost")])
    cert = x509.CertificateBuilder().subject_name(name).issuer_name(name).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(now-timedelta(minutes=1)).not_valid_after(now+timedelta(minutes=10)).add_extension(x509.SubjectAlternativeName([x509.DNSName("localhost")]), critical=False).add_extension(x509.ExtendedKeyUsage([ExtendedKeyUsageOID.SERVER_AUTH]), critical=False).sign(key, hashes.SHA256())
    cp, kp = tmp / "cert.pem", tmp / "key.pem"
    cp.write_bytes(cert.public_bytes(serialization.Encoding.PEM))
    kp.write_bytes(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
    return cp, kp

def main():
    with tempfile.TemporaryDirectory(prefix="brana-js-crossproof-") as d:
        tmp = Path(d); cert, key = cert_pair(tmp)
        source = fitz.open(); source.new_page(width=595, height=842).insert_text((100, 300), "<<Cirurgião.AssinaturaDigital>>", fontsize=10)
        pdf = prepare_signature_anchor(source.tobytes()).pdf_bytes
        (tmp / "prepared.pdf").write_bytes(pdf)
        signer = EphemeralSigner(pdf)
        runtime = create_secure_bridge_runtime(cert_pem=cert.read_bytes(), key_pem=key.read_bytes(), signer=signer, ui=Approve(), production_mode=False, enable_real_signing=True, lock=InMemoryInstanceLock("js-crossproof"), tls_config=TLSRuntimeConfig(host="localhost", port=8765))
        config = uvicorn.Config(runtime.create_app(), host="127.0.0.1", port=8765, ssl_keyfile=str(key), ssl_certfile=str(cert), log_level="error")
        server = uvicorn.Server(config)
        thread = threading.Thread(target=server.run, daemon=True); thread.start()
        deadline = time.time() + 10
        while time.time() < deadline:
            try:
                import socket
                with socket.create_connection(("127.0.0.1", 8765), timeout=.2): break
            except OSError: time.sleep(.1)
        env = os.environ.copy(); env["NODE_EXTRA_CA_CERTS"] = str(cert)
        env["BRANA_CROSSPROOF_PDF"] = str(tmp / "prepared.pdf")
        result = subprocess.run(["node", str(NODE)], cwd=ROOT, env=env, capture_output=True, text=True, timeout=30)
        server.should_exit = True; thread.join(timeout=5)
        print(result.stdout, end="")
        if result.returncode:
            print(result.stderr, end="")
            raise SystemExit(result.returncode)
        print(json.dumps({"sign_calls": signer.calls, "tls":"ephemeral", "port":8765}, separators=(",", ":")))

if __name__ == "__main__": main()
