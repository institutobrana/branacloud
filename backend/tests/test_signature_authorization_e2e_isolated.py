"""Disposable Etapa 7 proof; no import from backend.main and no real signer."""

import asyncio
import hashlib
import json
import unittest
from datetime import datetime, timedelta, timezone


class _ProofApp:
    def __init__(self):
        self.installation = {"bridge-test": ("ACTIVE", "cert-a")}
        self.auth = {"auth-1": {"status": "ISSUED", "installation": "bridge-test", "operation": "op-1", "pdf": "pdf-a", "der": "der-a", "field": "BranaSignature_1", "policy": "policy-a", "expires": datetime.now(timezone.utc) + timedelta(seconds=2)}}
        self.signer_calls = 0
        self.lock = asyncio.Lock()

    async def sign(self, *, installation_id, peer_cert, authorization_id, operation_id, pdf, der, field, policy):
        # Consume is deliberately completed before the fake signer is touched.
        if self.installation.get(installation_id) != ("ACTIVE", peer_cert):
            return 403, {"error": "INSTALLATION_NOT_AUTHORIZED"}
        async with self.lock:
            row = self.auth.get(authorization_id)
            if not row or row["status"] != "ISSUED":
                return 409, {"error": "AUTHORIZATION_NOT_AVAILABLE"}
            if row["expires"] <= datetime.now(timezone.utc):
                row["status"] = "EXPIRED"
                return 409, {"error": "AUTHORIZATION_EXPIRED"}
            if (row["operation"], row["pdf"], row["der"], row["field"], row["policy"]) != (operation_id, pdf, der, field, policy):
                return 409, {"error": "AUTHORIZATION_BINDING_MISMATCH"}
            row["status"] = "CONSUMED"
        self.signer_calls += 1
        return 200, {"state": "COMPLETED", "result": hashlib.sha256(b"signed-test-pdf").hexdigest()}

    async def __call__(self, scope, receive, send):
        if scope.get("type") != "http" or scope.get("path") != "/sign":
            await send({"type": "http.response.start", "status": 404, "headers": []})
            await send({"type": "http.response.body", "body": b""})
            return
        body = await receive()
        payload = json.loads(body.get("body", b"{}"))
        peer = scope.get("extensions", {}).get("tls.peer_cert_fingerprint")
        status, result = await self.sign(peer_cert=peer, **payload)
        encoded = json.dumps(result).encode()
        await send({"type": "http.response.start", "status": status, "headers": [(b"content-length", str(len(encoded)).encode())]})
        await send({"type": "http.response.body", "body": encoded})


async def _asgi_call(app, payload, peer):
    events = []
    async def receive():
        return {"type": "http.request", "body": json.dumps(payload).encode(), "more_body": False}
    async def send(event):
        events.append(event)
    await app({"type": "http", "path": "/sign", "extensions": {"tls.peer_cert_fingerprint": peer}}, receive, send)
    status = next(e["status"] for e in events if e["type"] == "http.response.start")
    body = next(e["body"] for e in events if e["type"] == "http.response.body")
    return status, json.loads(body)

class SignatureAuthorizationE2E(unittest.IsolatedAsyncioTestCase):
    async def test_success_consumes_online_before_one_fake_sign_and_result(self):
        app = _ProofApp()
        status, body = await _asgi_call(app, dict(installation_id="bridge-test", authorization_id="auth-1", operation_id="op-1", pdf="pdf-a", der="der-a", field="BranaSignature_1", policy="policy-a"), "cert-a")
        self.assertEqual((status, body["state"], app.signer_calls), (200, "COMPLETED", 1))
        self.assertEqual(body["result"], hashlib.sha256(b"signed-test-pdf").hexdigest())

    async def test_all_rejections_happen_before_signer(self):
        for mutate in ("password", "other-clinic", "cert", "pdf", "operation", "missing", "expired", "revoked", "offline"):
            app = _ProofApp()
            if mutate == "cert": app.installation["bridge-test"] = ("ACTIVE", "cert-b")
            if mutate == "expired": app.auth["auth-1"]["expires"] = datetime.now(timezone.utc) - timedelta(seconds=1)
            if mutate == "revoked": app.auth["auth-1"]["status"] = "REVOKED"
            kwargs = dict(installation_id="bridge-test", peer_cert="cert-a", authorization_id="auth-1", operation_id="op-1", pdf="pdf-a", der="der-a", field="BranaSignature_1", policy="policy-a")
            if mutate == "pdf": kwargs["pdf"] = "pdf-b"
            if mutate == "operation": kwargs["operation_id"] = "op-2"
            if mutate == "missing": kwargs["authorization_id"] = "missing"
            if mutate in {"password", "other-clinic", "offline"}: kwargs["installation_id"] = "unknown"
            status, _ = await app.sign(**kwargs)
            self.assertIn(status, (403, 409))
            self.assertEqual(app.signer_calls, 0, mutate)

    async def test_concurrent_one_shot_and_direct_header_spoof(self):
        app = _ProofApp()
        kwargs = dict(installation_id="bridge-test", peer_cert="forged-header-is-not-peer-cert", authorization_id="auth-1", operation_id="op-1", pdf="pdf-a", der="der-a", field="BranaSignature_1", policy="policy-a")
        self.assertEqual((await app.sign(**kwargs))[0], 403)
        app = _ProofApp()
        kwargs["peer_cert"] = "cert-a"
        results = await asyncio.gather(app.sign(**kwargs), app.sign(**kwargs))
        self.assertEqual(sorted(r[0] for r in results), [200, 409])
        self.assertEqual(app.signer_calls, 1)


if __name__ == "__main__":
    unittest.main()
