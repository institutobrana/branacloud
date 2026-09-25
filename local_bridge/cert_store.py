import base64
import json
import os
import re
import subprocess
import tempfile
import ctypes
from ctypes import wintypes
import hashlib
import base64
from datetime import datetime

try:
    from cryptography import x509
    from cryptography.hazmat.backends import default_backend
except Exception:  # pragma: no cover - optional Windows inspection dependency
    x509 = None
    default_backend = None


class WindowsCertificateStoreError(Exception):
    """Erro controlado ao consultar certificados instalados no Windows."""
    def __init__(self, message, *, diagnostic=None):
        super().__init__(message)
        self.diagnostic = diagnostic


class PublicCertificateProvider:
    """Fonte injetável de metadados públicos; nunca abre chaves."""

    def list_public_certificates(self) -> list[dict]:
        raise NotImplementedError


CERT_KEY_PROV_INFO_PROP_ID = 2


class NativeCertificateContext:
    """Owned PCCERT_CONTEXT wrapper; no private-key API is involved."""

    def __init__(self, context, *, crypt32, store=None):
        self.context = context
        self._crypt32 = crypt32
        self._store = store
        self._closed = False

    def duplicate(self):
        if self._closed:
            raise WindowsCertificateStoreError("CERTIFICATE_CONTEXT_CLOSED")
        duplicate = self._crypt32.CertDuplicateCertificateContext(self.context)
        if not duplicate:
            raise WindowsCertificateStoreError("CERTIFICATE_CONTEXT_DUPLICATE_FAILED")
        return NativeCertificateContext(duplicate, crypt32=self._crypt32)

    def close(self):
        if self._closed:
            return
        self._closed = True
        if self.context:
            self._crypt32.CertFreeCertificateContext(self.context)
        if self._store:
            self._crypt32.CertCloseStore(self._store, 0)
            self._store = None
        self.context = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        self.close()
        return False

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        self.close()
        return False


class PublicCertificateContextFactory:
    """Deferred public Store lookup returning an owned native context."""

    def __init__(self, *, store_name="My", crypt32=None, identity_resolver=None):
        self.store_name = store_name
        self.crypt32 = crypt32
        self.identity_resolver = identity_resolver

    def open(self, stable_identity: str):
        if self.store_name != "My":
            raise WindowsCertificateStoreError("CERTIFICATE_STORE_INVALID")
        if self.crypt32 is None:
            self.crypt32 = _load_public_crypt32()
        store = self.crypt32.CertOpenSystemStoreW(None, self.store_name)
        if not store:
            raise WindowsCertificateStoreError("CERTIFICATE_STORE_OPEN_FAILED")
        previous = None
        try:
            while True:
                context = self.crypt32.CertEnumCertificatesInStore(store, previous)
                if not context:
                    raise WindowsCertificateStoreError("CERTIFICATE_SELECTION_REQUIRED")
                previous = context
                identity = self.identity_resolver(context) if self.identity_resolver else None
                if identity == stable_identity:
                    duplicate = self.crypt32.CertDuplicateCertificateContext(context)
                    if not duplicate:
                        raise WindowsCertificateStoreError("CERTIFICATE_CONTEXT_DUPLICATE_FAILED")
                    self.crypt32.CertCloseStore(store, 0)
                    return NativeCertificateContext(duplicate, crypt32=self.crypt32)
        except Exception:
            self.crypt32.CertCloseStore(store, 0)
            raise


class _CERT_CONTEXT(ctypes.Structure):
    _fields_ = [("dwCertEncodingType", wintypes.DWORD), ("pbCertEncoded", ctypes.POINTER(ctypes.c_ubyte)), ("cbCertEncoded", wintypes.DWORD)]


class _PublicCrypt32:
    def __init__(self):
        if os.name != "nt":
            raise WindowsCertificateStoreError("PUBLIC_CONTEXT_PROVIDER_UNAVAILABLE")
        self._dll = ctypes.WinDLL("crypt32", use_last_error=True)
        self.CertOpenSystemStoreW = self._dll.CertOpenSystemStoreW
        self.CertOpenSystemStoreW.argtypes = [ctypes.c_void_p, ctypes.c_wchar_p]
        self.CertOpenSystemStoreW.restype = ctypes.c_void_p
        self.CertEnumCertificatesInStore = self._dll.CertEnumCertificatesInStore
        self.CertEnumCertificatesInStore.argtypes = [ctypes.c_void_p, ctypes.c_void_p]
        self.CertEnumCertificatesInStore.restype = ctypes.c_void_p
        self.CertDuplicateCertificateContext = self._dll.CertDuplicateCertificateContext
        self.CertDuplicateCertificateContext.argtypes = [ctypes.c_void_p]
        self.CertDuplicateCertificateContext.restype = ctypes.c_void_p
        self.CertFreeCertificateContext = self._dll.CertFreeCertificateContext
        self.CertFreeCertificateContext.argtypes = [ctypes.c_void_p]
        self.CertFreeCertificateContext.restype = ctypes.c_int
        self.CertCloseStore = self._dll.CertCloseStore
        self.CertCloseStore.argtypes = [ctypes.c_void_p, wintypes.DWORD]
        self.CertCloseStore.restype = ctypes.c_int

    @staticmethod
    def der(context):
        cert = ctypes.cast(context, ctypes.POINTER(_CERT_CONTEXT)).contents
        return ctypes.string_at(cert.pbCertEncoded, cert.cbCertEncoded)


def _load_public_crypt32():
    return _PublicCrypt32()


def _public_context_identity(context):
    return hashlib.sha256(_PublicCrypt32.der(context)).hexdigest()


def _sanitize_provider_name(value):
    text = str(value or "").strip()
    if not text:
        return None
    text = re.sub(r"[\r\n\x00]", "", text)
    return text[:96]


def _decode_cert_key_prov_info_buffer(raw: bytes) -> dict:
    pointer_size = ctypes.sizeof(ctypes.c_void_p)
    header_size = pointer_size * 2 + ctypes.sizeof(wintypes.DWORD) * 3
    if not isinstance(raw, (bytes, bytearray)) or len(raw) < header_size:
        raise ValueError("CERT_KEY_PROV_INFO_BUFFER_INVALID")
    values = (ctypes.c_void_p * 2).from_buffer_copy(raw[: pointer_size * 2])
    offset = pointer_size * 2
    prov_type, flags, key_spec = (wintypes.DWORD * 3).from_buffer_copy(raw[offset: offset + 12])
    def read_wide(pointer):
        if not pointer:
            return None
        try:
            return ctypes.wstring_at(pointer)
        except (ValueError, OSError):
            return None
    provider_name = _sanitize_provider_name(read_wide(values[1]))
    container_present = bool(read_wide(values[0]))
    kind = None
    lower = (provider_name or "").lower()
    if "smart card" in lower or "token" in lower:
        kind = "TOKEN_OR_SMARTCARD"
    elif "key storage" in lower or "ksp" in lower:
        kind = "KSP"
    elif "cryptographic provider" in lower or "csp" in lower:
        kind = "CSP"
    return {"provider_name_sanitized": provider_name, "container_present": container_present, "key_spec": int(key_spec), "provider_type": int(prov_type), "flags": int(flags), "provider_kind": kind or "PROVIDER_UNKNOWN", "smartcard_or_token": True if kind == "TOKEN_OR_SMARTCARD" else (False if kind else None), "middleware_required": True if kind == "TOKEN_OR_SMARTCARD" else None}


def read_cert_key_prov_info(get_property, context) -> dict:
    """Read CERT_KEY_PROV_INFO metadata only; never acquires a key."""
    size = wintypes.DWORD(0)
    ctypes.set_last_error(0)
    present = get_property(context, CERT_KEY_PROV_INFO_PROP_ID, None, ctypes.byref(size))
    if not present:
        return {"provider_metadata_read": False, "win32_error_code": ctypes.get_last_error() or None}
    if size.value <= 0 or size.value > 64 * 1024:
        return {"provider_metadata_read": False, "win32_error_code": None, "error": "CERT_KEY_PROV_INFO_BUFFER_INVALID"}
    buffer = ctypes.create_string_buffer(size.value)
    ctypes.set_last_error(0)
    ok = get_property(context, CERT_KEY_PROV_INFO_PROP_ID, buffer, ctypes.byref(size))
    if not ok:
        return {"provider_metadata_read": False, "win32_error_code": ctypes.get_last_error() or None}
    try:
        return {"provider_metadata_read": True, **_decode_cert_key_prov_info_buffer(buffer.raw[:size.value])}
    except ValueError as exc:
        return {"provider_metadata_read": False, "win32_error_code": None, "error": str(exc)}


def _native_diagnostic(api_name, phase, result, *, error_code=None):
    """Return only immediately captured native status; never fabricates HRESULTs."""
    code = error_code if isinstance(error_code, int) else None
    return {
        "api": api_name,
        "phase": phase,
        "success": bool(result),
        "error_code": code,
        "error_code_available": code is not None,
    }


def _parse_powershell_diagnostic(raw: str, *, phase: str) -> dict:
    """Parse only the dedicated JSON marker; never expose command output verbatim."""
    marker = "BRANA_DIAGNOSTIC_JSON:"
    encoded_marker = "BRANA_NATIVE_DIAGNOSTIC_JSON="
    line = next((item.strip() for item in str(raw or "").splitlines() if item.strip().startswith(marker) or item.strip().startswith(encoded_marker)), "")
    base = {"phase": phase, "hresult": None, "win32_error": None, "exception_class": None, "cause_chain": [], "pin_required": None, "retryable": None}
    if not line:
        base["native_error"] = "NATIVE_ERROR_UNAVAILABLE"
        return base
    try:
        payload = line[len(encoded_marker):] if line.startswith(encoded_marker) else line[len(marker):]
        if line.startswith(encoded_marker):
            payload += "=" * (-len(payload) % 4)
            item = json.loads(base64.urlsafe_b64decode(payload).decode("utf-8"))
        else:
            item = json.loads(payload)
    except (TypeError, ValueError):
        base["native_error"] = "NATIVE_ERROR_UNAVAILABLE"
        return base
    if not isinstance(item, dict):
        base["native_error"] = "NATIVE_ERROR_UNAVAILABLE"
        return base
    if isinstance(item.get("hresult"), str) and re.fullmatch(r"0x[0-9A-Fa-f]{8}", item["hresult"]):
        base["hresult"] = item["hresult"].upper()
    if isinstance(item.get("win32_error"), int) and 0 <= item["win32_error"] <= 0xFFFFFFFF:
        base["win32_error"] = item["win32_error"]
    if isinstance(item.get("exception_class"), str) and re.fullmatch(r"[A-Za-z_][A-Za-z0-9_.]*", item["exception_class"]):
        base["exception_class"] = item["exception_class"]
    if isinstance(item.get("cause_chain"), list):
        base["cause_chain"] = [x for x in item["cause_chain"] if isinstance(x, str) and re.fullmatch(r"[A-Za-z_][A-Za-z0-9_.]*", x)][:8]
    base["native_error"] = None if base["hresult"] or base["win32_error"] is not None else "NATIVE_ERROR_UNAVAILABLE"
    return base


def _diagnostic_marker(item: dict) -> str:
    safe = {
        "phase": item.get("phase"),
        "returncode": item.get("returncode"),
        "hresult": item.get("hresult"),
        "win32_error": item.get("win32_error"),
        "exception_class": item.get("exception_class"),
        "cause_chain": item.get("cause_chain", []),
        "native_error": item.get("native_error", "NATIVE_ERROR_UNAVAILABLE"),
    }
    raw = json.dumps(safe, separators=(",", ":"), ensure_ascii=True).encode("utf-8")
    return "BRANA_NATIVE_DIAGNOSTIC_JSON=" + base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


class InMemoryPublicCertificateProvider(PublicCertificateProvider):
    def __init__(self, inventory: list[dict]):
        self._inventory = [dict(item) for item in inventory]

    def list_public_certificates(self) -> list[dict]:
        return [dict(item) for item in self._inventory]


class PowerShellPublicCertificateProvider(PublicCertificateProvider):
    def list_public_certificates(self) -> list[dict]:
        return _list_windows_user_certificates_powershell()


class _Win32TrustStatus(ctypes.Structure):
    _fields_ = [("dwErrorStatus", wintypes.DWORD), ("dwInfoStatus", wintypes.DWORD)]


class _Win32ChainPara(ctypes.Structure):
    _fields_ = [("cbSize", wintypes.DWORD), ("RequestedUsage", ctypes.c_ubyte * 40)]


class _Win32SimpleChain(ctypes.Structure):
    _fields_ = [("cbSize", wintypes.DWORD), ("TrustStatus", _Win32TrustStatus)]


class _Win32ChainContext(ctypes.Structure):
    _fields_ = [
        ("cbSize", wintypes.DWORD),
        ("TrustStatus", _Win32TrustStatus),
        ("cChain", wintypes.DWORD),
        ("rgpChain", ctypes.POINTER(ctypes.POINTER(_Win32SimpleChain))),
    ]


class Win32PublicCertificateProvider(PublicCertificateProvider):
    """Enumerate public certificate contexts through Crypt32 only."""

    CERT_KEY_PROV_INFO_PROP_ID = 2

    def __init__(self, stores=("CurrentUser\\My", "LocalMachine\\My")):
        self.stores = tuple(stores)
        self.native_diagnostics = []

    def list_public_certificates(self) -> list[dict]:
        if os.name != "nt" or x509 is None:
            raise WindowsCertificateStoreError("PUBLIC_PROVIDER_UNAVAILABLE")
        crypt32 = ctypes.WinDLL("crypt32", use_last_error=True)
        crypt32.CertOpenSystemStoreW.argtypes = [wintypes.HANDLE, wintypes.LPCWSTR]
        crypt32.CertOpenSystemStoreW.restype = wintypes.HANDLE
        crypt32.CertEnumCertificatesInStore.argtypes = [wintypes.HANDLE, ctypes.c_void_p]
        crypt32.CertGetCertificateContextProperty.argtypes = [ctypes.c_void_p, wintypes.DWORD, ctypes.c_void_p, ctypes.POINTER(wintypes.DWORD)]
        crypt32.CertGetCertificateContextProperty.restype = wintypes.BOOL
        crypt32.CertGetCertificateChain.argtypes = [ctypes.c_void_p, ctypes.c_void_p, ctypes.c_void_p, wintypes.HANDLE, ctypes.c_void_p, wintypes.DWORD, ctypes.c_void_p, ctypes.POINTER(ctypes.c_void_p)]
        crypt32.CertGetCertificateChain.restype = wintypes.BOOL
        crypt32.CertFreeCertificateChain.argtypes = [ctypes.c_void_p]
        crypt32.CertCloseStore.argtypes = [wintypes.HANDLE, wintypes.DWORD]
        crypt32.CertOpenStore.restype = wintypes.HANDLE
        crypt32.CertEnumCertificatesInStore.restype = ctypes.c_void_p
        crypt32.CertCloseStore.restype = wintypes.BOOL
        rows = []
        for store_name in self.stores:
            location, name = store_name.split("\\", 1)
            flags = 0x00010000 if location == "LocalMachine" else 0x00000000
            ctypes.set_last_error(0)
            handle = crypt32.CertOpenSystemStoreW(None, name)
            open_error = ctypes.get_last_error() if not handle else None
            if not handle:
                self.native_diagnostics.append(_native_diagnostic("CertOpenSystemStoreW", "store_open", handle, error_code=open_error))
            if not handle:
                continue
            context = ctypes.c_void_p()
            try:
                while True:
                    ctypes.set_last_error(0)
                    next_context = crypt32.CertEnumCertificatesInStore(handle, context)
                    enum_error = ctypes.get_last_error() if not next_context else None
                    context = ctypes.c_void_p(next_context)
                    if not context:
                        self.native_diagnostics.append(_native_diagnostic("CertEnumCertificatesInStore", "certificate_enumeration", context, error_code=enum_error))
                        break
                    class CERT_CONTEXT(ctypes.Structure):
                        _fields_ = [
                            ("dwCertEncodingType", wintypes.DWORD),
                            ("pbCertEncoded", ctypes.POINTER(ctypes.c_ubyte)),
                            ("cbCertEncoded", wintypes.DWORD),
                            ("pCertInfo", ctypes.c_void_p),
                            ("hCertStore", wintypes.HANDLE),
                        ]
                    cert = ctypes.cast(context, ctypes.POINTER(CERT_CONTEXT)).contents
                    der = ctypes.string_at(cert.pbCertEncoded, cert.cbCertEncoded)
                    try:
                        parsed = x509.load_der_x509_certificate(der, default_backend())
                        subject = parsed.subject.rfc4514_string()
                        issuer = parsed.issuer.rfc4514_string()
                        cn = next((a.value for a in parsed.subject if a.oid == x509.NameOID.COMMON_NAME), "")
                        issuer_cn = next((a.value for a in parsed.issuer if a.oid == x509.NameOID.COMMON_NAME), "")
                        public_key = parsed.public_key()
                        algorithm = "RSA" if public_key.__class__.__name__.lower().startswith("rs") else public_key.__class__.__name__
                        key_size = getattr(public_key, "key_size", None)
                        try:
                            eku = [x.dotted_string for x in parsed.extensions.get_extension_for_class(x509.ExtendedKeyUsage).value]
                        except x509.ExtensionNotFound:
                            eku = []
                        try:
                            usage = parsed.extensions.get_extension_for_class(x509.KeyUsage).value
                            key_usage = [name for name in ("digital_signature", "content_commitment", "key_encipherment", "key_agreement") if getattr(usage, name)]
                        except x509.ExtensionNotFound:
                            key_usage = []
                        ctypes.set_last_error(0)
                        has_private_result = crypt32.CertGetCertificateContextProperty(
                            context, self.CERT_KEY_PROV_INFO_PROP_ID, None, ctypes.byref(wintypes.DWORD(0))
                        )
                        has_private = bool(has_private_result)
                        if not has_private_result:
                            self.native_diagnostics.append(_native_diagnostic("CertGetCertificateContextProperty", "public_property_read", has_private_result, error_code=ctypes.get_last_error()))
                        provider_info = read_cert_key_prov_info(
                            crypt32.CertGetCertificateContextProperty, context
                        )
                        stable_identity = hashlib.sha256(der).hexdigest()
                        chain_valid = None
                        chain_context = ctypes.c_void_p()
                        chain_para = _Win32ChainPara()
                        chain_para.cbSize = ctypes.sizeof(_Win32ChainPara)
                        ctypes.set_last_error(0)
                        chain_result = crypt32.CertGetCertificateChain(None, context, None, None, ctypes.byref(chain_para), 0, None, ctypes.byref(chain_context))
                        chain_error = ctypes.get_last_error() if not chain_result else None
                        if not chain_result:
                            self.native_diagnostics.append(_native_diagnostic("CertGetCertificateChain", "chain_validation", chain_result, error_code=chain_error))
                        if chain_result:
                            try:
                                chain = ctypes.cast(chain_context, ctypes.POINTER(_Win32ChainContext)).contents
                                chain_valid = chain.TrustStatus.dwErrorStatus == 0
                            finally:
                                crypt32.CertFreeCertificateChain(chain_context)
                        candidate_id = stable_identity[:12]
                        rows.append({
                            "candidate_id": candidate_id,
                            "_stable_identity": stable_identity,
                            "certificate_der": der,
                            "store": store_name,
                            "subject": cn,
                            "issuer": issuer_cn,
                            "thumbprint": hashlib.sha1(der).hexdigest().upper(),
                            "serial_number": format(parsed.serial_number, "X"),
                            "not_before": parsed.not_valid_before_utc.isoformat(),
                            "not_after": parsed.not_valid_after_utc.isoformat(),
                            "has_private_key": has_private,
                            "key_algorithm": algorithm,
                            "key_size": key_size,
                            "eku": eku,
                            "key_usage": key_usage,
                            "status": "PUBLIC_METADATA_VALID" if chain_valid is True else ("CHAIN_INVALID" if chain_valid is False else "UNPROVEN_CHAIN"),
                            "chain_valid": chain_valid,
                            "private_key_usable": False,
                            "provider_metadata_read": provider_info.get("provider_metadata_read", False),
                            "provider_name_sanitized": provider_info.get("provider_name_sanitized"),
                            "container_present": provider_info.get("container_present"),
                            "provider_type": provider_info.get("provider_type"),
                            "key_spec": provider_info.get("key_spec"),
                            "provider_flags": provider_info.get("flags"),
                            "provider_kind": provider_info.get("provider_kind"),
                            "smartcard_or_token_indication": provider_info.get("smartcard_or_token"),
                            "middleware_required": provider_info.get("middleware_required"),
                            "provider_win32_error_code": provider_info.get("win32_error_code"),
                            "provider_metadata_error": provider_info.get("error"),
                        })
                    except Exception:
                        stable_identity = hashlib.sha256(der).hexdigest()
                        rows.append({"candidate_id": stable_identity[:12], "_stable_identity": stable_identity, "store": store_name, "status": "PUBLIC_METADATA_INVALID", "chain_valid": None, "private_key_usable": False})
            finally:
                ctypes.set_last_error(0)
                close_result = crypt32.CertCloseStore(handle, 0)
                if not close_result:
                    self.native_diagnostics.append(_native_diagnostic("CertCloseStore", "store_close", close_result, error_code=ctypes.get_last_error()))
        return rows


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
    if len(thumb) != 40 or not _THUMBPRINT_RE.fullmatch(thumb):
        raise WindowsCertificateStoreError("Thumbprint do certificado inválido.")
    return thumb


def _run_powershell(command: str, *, timeout: int = 15) -> str:
    phase = "provider_sign" if "SignData" in command else "certificate_resolution"
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
        diagnostic = {"phase": phase, "returncode": None, "hresult": None, "win32_error": None, "native_error": "NATIVE_ERROR_UNAVAILABLE", "marker": None}
        diagnostic["marker"] = _diagnostic_marker(diagnostic)
        raise WindowsCertificateStoreError("POWERSHELL_EXECUTION_FAILED", diagnostic=diagnostic) from exc

    if result.returncode != 0:
        text = " ".join(((result.stdout or ""), (result.stderr or "")))
        envelope = _parse_powershell_diagnostic(text, phase=phase)
        hresult = re.search(r"\b0x[0-9A-Fa-f]{8}\b", text)
        win32 = re.search(r"(?:Win32|error\s*code)\D+(\d+)", text, re.I)
        if envelope["native_error"] == "NATIVE_ERROR_UNAVAILABLE" and hresult:
            envelope["hresult"] = hresult.group(0).upper()
            envelope["native_error"] = None
        if envelope["native_error"] == "NATIVE_ERROR_UNAVAILABLE" and win32:
            envelope["win32_error"] = int(win32.group(1))
            envelope["native_error"] = None
        diagnostic = {"phase": phase, "returncode": int(result.returncode), **envelope}
        diagnostic["marker"] = _diagnostic_marker(diagnostic)
        raise WindowsCertificateStoreError("POWERSHELL_PROVIDER_FAILED", diagnostic=diagnostic)
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
    eku = [str(value).strip() for value in (item.get("Eku") or []) if str(value).strip()]
    key_usage = [str(value).strip() for value in (item.get("KeyUsage") or []) if str(value).strip()]
    if not subject and not thumbprint:
        return None
    return {
        "subject": subject,
        "issuer": issuer,
        "thumbprint": thumbprint,
        "thumbprint_suffix": thumbprint[-4:] if thumbprint else None,
        "serial_number": serial_number,
        "friendly_name": friendly_name or None,
        "not_before": _to_iso(item.get("NotBefore")),
        "not_after": _to_iso(item.get("NotAfter")),
        "has_private_key": has_private_key,
        "key_algorithm": key_algorithm or None,
        "key_size": key_size or None,
        "eku": eku,
        "key_usage": key_usage,
        "status": str(item.get("Status") or "PUBLIC_METADATA_VALID").strip(),
        "private_key_usable": False,
    }


def _list_windows_user_certificates_powershell():
    data = _run_powershell_json(
        (
            "Get-ChildItem Cert:\\CurrentUser\\My | "
            "ForEach-Object { "
            "$now = Get-Date; "
            "$eku = @($_.EnhancedKeyUsageList | ForEach-Object { $_.ObjectId.Value }); "
            "$keyUsageExtension = $_.Extensions | Where-Object { $_.Oid.Value -eq '2.5.29.15' }; "
            "$keyUsage = if ($keyUsageExtension) { @($keyUsageExtension.Format($true) -split ',\\s*') } else { @() }; "
            "$status = if ($_.NotBefore -gt $now -or $_.NotAfter -le $now) { 'EXPIRED' } elseif ($eku.Count -eq 0) { 'EKU_MISSING' } elseif (-not ($eku -contains '1.3.6.1.5.5.7.3.2')) { 'EKU_INCOMPATIBLE' } else { 'PUBLIC_METADATA_VALID' }; "
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
            "KeySize = $_.PublicKey.Key.KeySize; "
            "Eku = $eku; "
            "KeyUsage = $keyUsage; "
            "Status = $status; "
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


def list_windows_user_certificates(*, provider: PublicCertificateProvider | None = None):
    source = provider or PowerShellPublicCertificateProvider()
    rows = source.list_public_certificates()
    normalized = []
    for row in rows:
        if "subject" in row and "thumbprint" in row:
            normalized.append(dict(row))
            continue
        item = _normalize_cert_row(row)
        if item:
            normalized.append(item)
    return normalized


def resolve_windows_user_candidate(candidate_id: str | None = None, *, provider: PublicCertificateProvider | None = None):
    """Resolve the explicitly approved public candidate without opening its key."""
    injected = provider is not None
    source = provider or Win32PublicCertificateProvider(stores=("CurrentUser\\My",))
    matches = [item for item in list_windows_user_certificates(provider=source) if (injected or item.get("store") == "CurrentUser\\My") and "GLEISSON TEL" in item.get("subject", "") and "SyngularID Multipla" in item.get("issuer", "") and item.get("key_algorithm") == "RSA" and item.get("key_size") == 2048 and item.get("has_private_key") and item.get("status") not in {"EXPIRED", "UNPROVEN_CHAIN", "PUBLIC_METADATA_INVALID"} and (injected or item.get("chain_valid") is True)]
    if len(matches) != 1:
        raise WindowsCertificateStoreError("CERTIFICATE_SELECTION_REQUIRED")
    return matches[0]


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
