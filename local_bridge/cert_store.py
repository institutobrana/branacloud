import base64
import json
import os
import re
import subprocess
import tempfile
from datetime import datetime


class WindowsCertificateStoreError(Exception):
    """Erro controlado ao consultar certificados instalados no Windows."""


_THUMBPRINT_RE = re.compile(r"^[A-F0-9]+$")
_DIGEST_MAP = {
    "sha256": "SHA256",
    "sha384": "SHA384",
    "sha512": "SHA512",
}


def _to_iso(value):
    if isinstance(value, datetime):
        return value.isoformat()
    if value is None:
        return None
    txt = str(value).strip()
    return txt or None


def _sanitize_thumbprint(thumbprint: str) -> str:
    thumb = str(thumbprint or "").strip().upper().replace(" ", "")
    if not thumb or not _THUMBPRINT_RE.fullmatch(thumb):
        raise WindowsCertificateStoreError("Thumbprint do certificado inválido.")
    return thumb


def _run_powershell(command: str, *, timeout: int = 15) -> str:
    try:
        result = subprocess.run(
            [
                "powershell.exe",
                "-NoProfile",
                "-ExecutionPolicy",
                "Bypass",
                "-Command",
                command,
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=False,
            timeout=timeout,
        )
    except Exception as exc:
        raise WindowsCertificateStoreError(
            f"Falha ao consultar o repositório de certificados do Windows: {exc}"
        ) from exc

    if result.returncode != 0:
        stderr = (result.stderr or "").strip()
        raise WindowsCertificateStoreError(
            stderr or "PowerShell retornou erro ao acessar o Windows Certificate Store."
        )
    return (result.stdout or "").strip()


def _run_powershell_json(command: str, *, timeout: int = 15):
    raw = _run_powershell(command, timeout=timeout)
    if not raw:
        return None
    try:
        return json.loads(raw)
    except Exception as exc:
        raise WindowsCertificateStoreError(
            "Falha ao interpretar a resposta do Windows Certificate Store."
        ) from exc


def _normalize_cert_row(item):
    if not isinstance(item, dict):
        return None
    subject = str(item.get("Subject") or "").strip()
    issuer = str(item.get("Issuer") or "").strip()
    thumbprint = str(item.get("Thumbprint") or "").strip().upper()
    serial_number = str(item.get("SerialNumber") or "").strip().upper()
    friendly_name = str(item.get("FriendlyName") or "").strip()
    key_algorithm = str(item.get("KeyAlgorithm") or "").strip()
    key_size = int(item.get("KeySize") or 0)
    has_private_key = bool(item.get("HasPrivateKey"))
    if not subject and not thumbprint:
        return None
    return {
        "subject": subject,
        "issuer": issuer,
        "thumbprint": thumbprint,
        "serial_number": serial_number,
        "friendly_name": friendly_name or None,
        "not_before": _to_iso(item.get("NotBefore")),
        "not_after": _to_iso(item.get("NotAfter")),
        "has_private_key": has_private_key,
        "key_algorithm": key_algorithm or None,
        "key_size": key_size or None,
    }


def list_windows_user_certificates():
    data = _run_powershell_json(
        (
            "Get-ChildItem Cert:\\CurrentUser\\My | "
            "ForEach-Object { "
            "$rsa = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::GetRSAPrivateKey($_); "
            "[pscustomobject]@{ "
            "Subject = $_.Subject; "
            "Issuer = $_.Issuer; "
            "Thumbprint = $_.Thumbprint; "
            "FriendlyName = $_.FriendlyName; "
            "NotBefore = $_.NotBefore; "
            "NotAfter = $_.NotAfter; "
            "HasPrivateKey = $_.HasPrivateKey; "
            "SerialNumber = $_.SerialNumber; "
            "KeyAlgorithm = $_.PublicKey.Oid.FriendlyName; "
            "KeySize = if ($rsa) { $rsa.KeySize } else { $null }; "
            "} } | ConvertTo-Json -Depth 4 -Compress"
        )
    )
    if data is None:
        return []

    rows = data if isinstance(data, list) else [data]
    certs = []
    for row in rows:
        normalized = _normalize_cert_row(row)
        if normalized:
            certs.append(normalized)
    certs.sort(
        key=lambda item: (
            not bool(item.get("has_private_key")),
            str(item.get("subject") or "").lower(),
        )
    )
    return certs


def get_windows_certificate_bundle(thumbprint: str):
    thumb = _sanitize_thumbprint(thumbprint)
    data = _run_powershell_json(
        (
            f"$thumb='{thumb}'; "
            "$cert = Get-Item -Path (\"Cert:\\CurrentUser\\My\\\" + $thumb); "
            "if (-not $cert) { throw 'Certificado não encontrado no Windows Certificate Store.' } "
            "$rsa = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::GetRSAPrivateKey($cert); "
            "$chain = New-Object System.Security.Cryptography.X509Certificates.X509Chain; "
            "$null = $chain.Build($cert); "
            "$chainItems = @(); "
            "foreach ($el in $chain.ChainElements) { "
            "$chainItems += [pscustomobject]@{ "
            "Subject = $el.Certificate.Subject; "
            "Issuer = $el.Certificate.Issuer; "
            "RawData = [Convert]::ToBase64String($el.Certificate.RawData) "
            "} "
            "} "
            "[pscustomobject]@{ "
            "Subject = $cert.Subject; "
            "Issuer = $cert.Issuer; "
            "Thumbprint = $cert.Thumbprint; "
            "FriendlyName = $cert.FriendlyName; "
            "HasPrivateKey = $cert.HasPrivateKey; "
            "SerialNumber = $cert.SerialNumber; "
            "KeyAlgorithm = $cert.PublicKey.Oid.FriendlyName; "
            "KeySize = if ($rsa) { $rsa.KeySize } else { $null }; "
            "RawData = [Convert]::ToBase64String($cert.RawData); "
            "Chain = $chainItems "
            "} | ConvertTo-Json -Depth 6 -Compress"
        ),
        timeout=20,
    )
    if not isinstance(data, dict):
        raise WindowsCertificateStoreError("Falha ao carregar o certificado do Windows.")
    return {
        "subject": str(data.get("Subject") or "").strip(),
        "issuer": str(data.get("Issuer") or "").strip(),
        "thumbprint": str(data.get("Thumbprint") or "").strip().upper(),
        "friendly_name": str(data.get("FriendlyName") or "").strip() or None,
        "serial_number": str(data.get("SerialNumber") or "").strip().upper(),
        "has_private_key": bool(data.get("HasPrivateKey")),
        "key_algorithm": str(data.get("KeyAlgorithm") or "").strip() or None,
        "key_size": int(data.get("KeySize") or 0) or None,
        "raw_data_b64": str(data.get("RawData") or "").strip(),
        "chain": list(data.get("Chain") or []),
    }


def sign_data_with_windows_certificate(
    *,
    thumbprint: str,
    data: bytes,
    digest_algorithm: str = "sha256",
) -> bytes:
    thumb = _sanitize_thumbprint(thumbprint)
    digest_name = _DIGEST_MAP.get(str(digest_algorithm or "").strip().lower())
    if not digest_name:
        raise WindowsCertificateStoreError(
            "Algoritmo de digest não suportado para assinatura no Windows."
        )
    if not isinstance(data, (bytes, bytearray)) or not data:
        raise WindowsCertificateStoreError("Dados vazios para assinatura.")

    temp_path = ""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".bin") as handle:
            handle.write(bytes(data))
            temp_path = handle.name
        temp_path_ps = temp_path.replace("'", "''")

        raw = _run_powershell(
            (
                f"$thumb='{thumb}'; "
                f"$hashName='{digest_name}'; "
                f"$path='{temp_path_ps}'; "
                "$cert = Get-Item -Path (\"Cert:\\CurrentUser\\My\\\" + $thumb); "
                "if (-not $cert) { throw 'Certificado não encontrado no Windows Certificate Store.' } "
                "$rsa = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::GetRSAPrivateKey($cert); "
                "if (-not $rsa) { throw 'A chave privada RSA não está disponível para este certificado.' } "
                "$bytes = [System.IO.File]::ReadAllBytes($path); "
                "$sig = $rsa.SignData($bytes, [System.Security.Cryptography.HashAlgorithmName]::$hashName, [System.Security.Cryptography.RSASignaturePadding]::Pkcs1); "
                "[Convert]::ToBase64String($sig)"
            ),
            timeout=20,
        )
        if not raw:
            raise WindowsCertificateStoreError("O Windows não retornou a assinatura digital.")
        try:
            return base64.b64decode(raw)
        except Exception as exc:
            raise WindowsCertificateStoreError(
                "Falha ao interpretar a assinatura retornada pelo Windows."
            ) from exc
    finally:
        if temp_path:
            try:
                os.remove(temp_path)
            except OSError:
                pass
