"""Isolated direct-CSP design; no Windows provider is loaded at import time."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Protocol
import ctypes
import os
import hashlib

from pyhanko.sign.signers.pdf_cms import Signer
from asn1crypto import algos


class DirectCspError(RuntimeError):
    def __init__(self, code: str, *, phase: str, retryable: bool | None = None, key_spec: int | None = None):
        super().__init__(code)
        self.code = code
        self.phase = phase
        self.retryable = retryable
        self.key_spec = key_spec


@dataclass(frozen=True)
class PublicCspMetadata:
    store: str
    provider_name: str
    provider_kind: str
    key_algorithm: str
    key_size: int
    has_private_key: bool
    certificate_context: int | None = None


class PrivateKeyAcquirer(Protocol):
    def __call__(self, metadata: PublicCspMetadata): ...


class RsaSigner(Protocol):
    def __call__(self, key_handle, digest: bytes) -> bytes: ...


class NativeCspBoundary(Protocol):
    """Injection point for a future Win32/.NET CSP implementation."""

    def acquire_rsa_key(self, metadata: PublicCspMetadata): ...

    def sign_digest(self, key_handle, digest: bytes) -> bytes: ...


@dataclass(frozen=True)
class CspKeyHandle:
    provider_handle: int
    key_handle: int
    key_spec: int
    caller_must_free_provider: bool = True


class Win32CspBoundary:
    """Late-bound CryptoAPI seam; no DLL or certificate is touched at import."""

    def __init__(self, *, certificate_context: int, key_spec: int | None = None, api=None):
        self._context_owner = certificate_context if hasattr(certificate_context, "close") else None
        self._context = int(getattr(certificate_context, "context", certificate_context))
        self._key_spec = None if key_spec is None else int(key_spec)
        self._api = api

    @classmethod
    def from_public_metadata(cls, metadata: PublicCspMetadata, *, context_resolver, key_spec: int | None = None, api=None):
        if metadata.store != "CurrentUser\\My" or metadata.provider_kind != "CSP" or metadata.key_algorithm != "RSA" or metadata.key_size != 2048:
            raise DirectCspError("CERTIFICATE_CONTEXT_INVALID", phase="certificate_resolution", retryable=False)
        context = metadata.certificate_context
        if context is None:
            context = context_resolver(metadata)
        if not context:
            raise DirectCspError("CERTIFICATE_CONTEXT_UNAVAILABLE", phase="certificate_resolution", retryable=False)
        return cls(certificate_context=context, key_spec=key_spec, api=api)

    def _native(self):
        if self._api is not None:
            return self._api
        if os.name != "nt":
            raise DirectCspError("WINDOWS_CRYPTOAPI_UNAVAILABLE", phase="certificate_resolution", retryable=False)
        self._api = _CtypesCryptoApi()
        return self._api

    def acquire_rsa_key(self, metadata: PublicCspMetadata):
        if metadata.provider_kind != "CSP" or metadata.provider_name != "Microsoft Enhanced Cryptographic Provider v1.0":
            raise DirectCspError("CSP_PROVIDER_UNSUPPORTED", phase="certificate_resolution", retryable=False)
        if metadata.key_algorithm != "RSA" or metadata.key_size != 2048 or not metadata.has_private_key:
            raise DirectCspError("CSP_KEY_INVALID", phase="certificate_resolution", retryable=False)
        try:
            acquired = self._native().acquire(self._context, self._key_spec)
            if len(acquired) == 4:
                provider, key, returned_spec, caller_must_free = acquired
            elif len(acquired) == 3:
                provider, key, returned_spec = acquired
                caller_must_free = True
            else:
                raise DirectCspError("CSP_KEY_SPEC_UNAVAILABLE", phase="key_acquisition", retryable=False)
            if int(returned_spec) not in (1, 2):
                raise DirectCspError("CSP_KEY_SPEC_MISMATCH", phase="key_acquisition", retryable=False)
            return CspKeyHandle(provider, key, returned_spec, bool(caller_must_free))
        except DirectCspError:
            raise
        except Exception as exc:
            raise DirectCspError("CSP_KEY_ACQUISITION_FAILED", phase="key_acquisition") from exc

    def sign_digest(self, key_handle: CspKeyHandle, digest: bytes) -> bytes:
        if not isinstance(key_handle, CspKeyHandle) or not digest:
            raise DirectCspError("CSP_SIGN_INPUT_INVALID", phase="provider_sign", retryable=False)
        try:
            return self._native().sign_hash(key_handle, bytes(digest))
        except DirectCspError:
            raise
        except Exception as exc:
            raise DirectCspError("CSP_SIGN_FAILED", phase="provider_sign") from exc

    def release(self, key_handle: CspKeyHandle):
        try:
            self._native().release(key_handle)
        finally:
            if self._context_owner is not None:
                self._context_owner.close()


class _CtypesCryptoApi:
    """Deferred CryptoAPI implementation; instantiated only after approval."""

    def __init__(self):
        self.crypt32 = ctypes.WinDLL("crypt32", use_last_error=True)
        self.advapi32 = ctypes.WinDLL("advapi32", use_last_error=True)
        self.crypt32.CryptAcquireCertificatePrivateKey.argtypes = [ctypes.c_void_p, ctypes.c_uint32, ctypes.c_void_p, ctypes.POINTER(ctypes.c_void_p), ctypes.POINTER(ctypes.c_uint32), ctypes.POINTER(ctypes.c_int)]
        self.crypt32.CryptAcquireCertificatePrivateKey.restype = ctypes.c_int
        self.advapi32.CryptCreateHash.argtypes = [ctypes.c_void_p, ctypes.c_uint32, ctypes.c_void_p, ctypes.c_uint32, ctypes.POINTER(ctypes.c_void_p)]
        self.advapi32.CryptCreateHash.restype = ctypes.c_int
        self.advapi32.CryptGetUserKey.argtypes = [ctypes.c_void_p, ctypes.c_uint32, ctypes.POINTER(ctypes.c_void_p)]
        self.advapi32.CryptGetUserKey.restype = ctypes.c_int
        self.advapi32.CryptSetHashParam.argtypes = [ctypes.c_void_p, ctypes.c_uint32, ctypes.c_void_p, ctypes.c_uint32]
        self.advapi32.CryptSetHashParam.restype = ctypes.c_int
        self.advapi32.CryptSignHashW.argtypes = [ctypes.c_void_p, ctypes.c_uint32, ctypes.c_wchar_p, ctypes.c_uint32, ctypes.c_void_p, ctypes.POINTER(ctypes.c_uint32)]
        self.advapi32.CryptSignHashW.restype = ctypes.c_int
        self.advapi32.CryptDestroyHash.argtypes = [ctypes.c_void_p]
        self.advapi32.CryptDestroyHash.restype = ctypes.c_int
        self.advapi32.CryptDestroyKey.argtypes = [ctypes.c_void_p]
        self.advapi32.CryptDestroyKey.restype = ctypes.c_int
        self.advapi32.CryptReleaseContext.argtypes = [ctypes.c_void_p, ctypes.c_uint32]
        self.advapi32.CryptReleaseContext.restype = ctypes.c_int

    @staticmethod
    def _fail(code, phase):
        raise DirectCspError(code, phase=phase, retryable=None)

    def enumerate_algorithms(self, provider_handle: int) -> list[dict]:
        """Read public provider algorithms using the documented FIRST/NEXT flags."""
        class ProvEnumAlgsEx(ctypes.Structure):
            _fields_ = [
                ("aiAlgid", ctypes.c_uint32), ("dwDefaultLen", ctypes.c_uint32),
                ("dwMinLen", ctypes.c_uint32), ("dwMaxLen", ctypes.c_uint32),
                ("dwProtocols", ctypes.c_uint32), ("dwNameLen", ctypes.c_uint32),
                ("szName", ctypes.c_char * 20),
                ("dwLongNameLen", ctypes.c_uint32),
                ("szLongName", ctypes.c_char * 40),
            ]
        PP_ENUMALGS_EX = 22
        CRYPT_FIRST, CRYPT_NEXT = 1, 2
        result = []
        flag = CRYPT_FIRST
        while True:
            item = ProvEnumAlgsEx()
            size = ctypes.c_uint32(ctypes.sizeof(item))
            ctypes.set_last_error(0)
            ok = self.advapi32.CryptGetProvParam(
                ctypes.c_void_p(provider_handle), PP_ENUMALGS_EX,
                ctypes.byref(item), ctypes.byref(size), flag
            )
            if not ok:
                error = ctypes.get_last_error() & 0xFFFFFFFF
                if error == 259:  # ERROR_NO_MORE_ITEMS
                    break
                raise DirectCspError("CSP_ALGORITHM_ENUMERATION_FAILED", phase="public_provider_metadata", retryable=False) from OSError(error, "CryptGetProvParam")
            name = bytes(item.szName).split(b"\x00", 1)[0].decode("ascii", errors="replace")
            long_name = bytes(item.szLongName).split(b"\x00", 1)[0].decode("ascii", errors="replace")
            result.append({"alg_id": int(item.aiAlgid), "name": name, "long_name": long_name})
            flag = CRYPT_NEXT
        return result

    def acquire(self, certificate_context: int, key_spec: int | None):
        provider = ctypes.c_void_p()
        returned_spec = ctypes.c_uint32(0)
        must_free = ctypes.c_int(0)
        ctypes.set_last_error(0)
        ok = self.crypt32.CryptAcquireCertificatePrivateKey(
            ctypes.c_void_p(certificate_context), 0, None,
            ctypes.byref(provider), ctypes.byref(returned_spec), ctypes.byref(must_free)
        )
        if not ok:
            code = ctypes.get_last_error()
            raise DirectCspError("CSP_KEY_ACQUISITION_FAILED", phase="key_acquisition", retryable=None) from OSError(code, "CryptoAPI")
        if int(returned_spec.value) not in (1, 2):
            self.release(CspKeyHandle(int(provider.value), 0, int(returned_spec.value)))
            self._fail("CSP_KEY_SPEC_MISMATCH", "key_acquisition")
        key = ctypes.c_void_p()
        ctypes.set_last_error(0)
        if not self.advapi32.CryptGetUserKey(provider, int(returned_spec.value), ctypes.byref(key)):
            code = ctypes.get_last_error()
            self.advapi32.CryptReleaseContext(provider, 0)
            raise DirectCspError("CSP_KEY_ACQUISITION_FAILED", phase="key_acquisition", retryable=None) from OSError(code, "CryptoAPI")
        return int(provider.value), int(key.value), int(returned_spec.value), bool(must_free.value)

    def sign_hash(self, key_handle: CspKeyHandle, digest: bytes) -> bytes:
        hash_handle = ctypes.c_void_p()
        CALG_SHA_256 = 0x0000800C
        HP_HASHVAL = 0x00000002
        ctypes.set_last_error(0)
        if not self.advapi32.CryptCreateHash(ctypes.c_void_p(key_handle.provider_handle), CALG_SHA_256, None, 0, ctypes.byref(hash_handle)):
            code = ctypes.get_last_error()
            raise DirectCspError("CSP_HASH_CREATE_FAILED", phase="hash_creation", key_spec=key_handle.key_spec) from OSError(code, "CryptoAPI")
        try:
            digest_buf = ctypes.create_string_buffer(digest)
            ctypes.set_last_error(0)
            if not self.advapi32.CryptSetHashParam(hash_handle, HP_HASHVAL, digest_buf, len(digest)):
                code = ctypes.get_last_error()
                raise DirectCspError("CSP_HASH_SET_FAILED", phase="hash_setup", key_spec=key_handle.key_spec) from OSError(code, "CryptoAPI")
            size = ctypes.c_uint32(0)
            ctypes.set_last_error(0)
            if not self.advapi32.CryptSignHashW(hash_handle, key_handle.key_spec, None, 0, None, ctypes.byref(size)):
                code = ctypes.get_last_error()
                raise DirectCspError("CSP_SIGN_HASH_FAILED", phase="provider_sign", key_spec=key_handle.key_spec) from OSError(code, "CryptoAPI")
            signature = ctypes.create_string_buffer(size.value)
            ctypes.set_last_error(0)
            if not self.advapi32.CryptSignHashW(hash_handle, key_handle.key_spec, None, 0, signature, ctypes.byref(size)):
                code = ctypes.get_last_error()
                raise DirectCspError("CSP_SIGN_HASH_FAILED", phase="provider_sign", key_spec=key_handle.key_spec) from OSError(code, "CryptoAPI")
            return bytes(signature.raw[:size.value])
        finally:
            self.advapi32.CryptDestroyHash(hash_handle)

    acquire_rsa_key = acquire
    sign_digest = sign_hash

    def release(self, key_handle: CspKeyHandle):
        if key_handle.key_handle:
            self.advapi32.CryptDestroyKey(ctypes.c_void_p(key_handle.key_handle))
        if key_handle.provider_handle and key_handle.caller_must_free_provider:
            self.advapi32.CryptReleaseContext(ctypes.c_void_p(key_handle.provider_handle), 0)


class RawRsaSignatureAdapter:
    """Small adapter that exposes raw RSA output without persisting key material."""

    def __init__(self, boundary: Win32CspBoundary, metadata: PublicCspMetadata):
        self._boundary = boundary
        self._metadata = metadata

    def sign_digest_after_approval(self, *, approved: bool, digest: bytes) -> bytes:
        if approved is not True:
            raise DirectCspError("APPROVAL_REQUIRED", phase="authorization", retryable=False)
        key = self._boundary.acquire_rsa_key(self._metadata)
        try:
            return self._boundary.sign_digest(key, digest)
        finally:
            self._boundary.release(key)


class PyHankoNativeCspSigner:
    """pyHanko 0.26-compatible raw signer facade for a prepared SHA-256 digest."""

    def __init__(self, *, boundary: Win32CspBoundary, metadata: PublicCspMetadata,
                 approved: bool, signature_length: int = 256):
        self._raw = RawRsaSignatureAdapter(boundary, metadata)
        self._approved = approved
        self._signature_length = signature_length

    async def async_sign_raw(self, data: bytes, digest_algorithm: str, dry_run=False) -> bytes:
        if self._approved is not True:
            raise DirectCspError("APPROVAL_REQUIRED", phase="authorization", retryable=False)
        if str(digest_algorithm).lower() != "sha256" or not isinstance(data, bytes) or len(data) != 32:
            raise DirectCspError("RSA_SHA256_DIGEST_INVALID", phase="pyhanko_setup", retryable=False)
        if dry_run:
            return b"\x00" * self._signature_length
        signature = self._raw.sign_digest_after_approval(approved=True, digest=data)
        if len(signature) != self._signature_length:
            raise DirectCspError("RSA_SIGNATURE_LENGTH_INVALID", phase="provider_sign", retryable=False)
        return signature


class PyHankoCspSigner(Signer):
    """Concrete pyHanko Signer; only the native CSP seam is replaceable."""

    def __init__(self, *, signing_cert, cert_registry, boundary, metadata, context_owner=None, signature_length=256):
        super().__init__(signing_cert=signing_cert, cert_registry=cert_registry,
                         signature_mechanism=algos.SignedDigestAlgorithm({"algorithm": "sha256_rsa"}),
                         prefer_pss=False, embed_roots=True)
        self._boundary = boundary
        self._metadata = metadata
        self._context_owner = context_owner
        self._signature_length = signature_length

    async def async_sign_raw(self, data: bytes, digest_algorithm: str, dry_run=False) -> bytes:
        if not isinstance(data, bytes) or not data:
            raise DirectCspError("PYHANKO_SIGN_INPUT_INVALID", phase="pyhanko_setup", retryable=False)
        algorithm = str(digest_algorithm).lower().replace("-", "")
        if algorithm != "sha256":
            raise DirectCspError("RSA_SHA256_REQUIRED", phase="pyhanko_setup", retryable=False)
        if dry_run:
            return b"\x00" * self._signature_length
        digest = hashlib.sha256(data).digest()
        key = self._boundary.acquire_rsa_key(self._metadata)
        try:
            # CryptoAPI returns RSA signatures little-endian; CMS expects big-endian.
            signature = bytes(self._boundary.sign_digest(key, digest))[::-1]
            if len(signature) != self._signature_length:
                raise DirectCspError("RSA_SIGNATURE_LENGTH_INVALID", phase="provider_sign", retryable=False)
            return signature
        finally:
            self._boundary.release(key)


class DirectCspAdapter:
    """Prepared-contract adapter; acquisition is possible only after approval."""

    def __init__(self, *, metadata: PublicCspMetadata,
                 acquire_private_key: PrivateKeyAcquirer | None = None,
                 sign_digest: RsaSigner | None = None,
                 native_boundary: NativeCspBoundary | None = None):
        self.metadata = metadata
        self._native_boundary = native_boundary
        if native_boundary is not None:
            self._acquire_private_key = native_boundary.acquire_rsa_key
            self._sign_digest = native_boundary.sign_digest
        elif acquire_private_key is not None and sign_digest is not None:
            self._acquire_private_key = acquire_private_key
            self._sign_digest = sign_digest
        else:
            raise DirectCspError("NATIVE_CSP_BOUNDARY_REQUIRED", phase="initialization", retryable=False)

    def sign_prepared(self, *, approved: bool, pdf_bytes: bytes,
                      field_name: str, use_existing_field: bool,
                      new_field_spec, signature_profile: str,
                      policy_oid: str, allow_fetching: bool,
                      digest: bytes) -> bytes:
        if not approved:
            raise DirectCspError("APPROVAL_REQUIRED", phase="authorization", retryable=False)
        if self.metadata.store != "CurrentUser\\My":
            raise DirectCspError("CSP_STORE_INVALID", phase="certificate_resolution", retryable=False)
        if self.metadata.provider_kind != "CSP" or self.metadata.provider_name != "Microsoft Enhanced Cryptographic Provider v1.0":
            raise DirectCspError("CSP_PROVIDER_UNSUPPORTED", phase="certificate_resolution", retryable=False)
        if self.metadata.key_algorithm != "RSA" or self.metadata.key_size != 2048 or not self.metadata.has_private_key:
            raise DirectCspError("CSP_KEY_INVALID", phase="certificate_resolution", retryable=False)
        if field_name != "BranaSignature_1" or use_existing_field is not True or new_field_spec is not None:
            raise DirectCspError("PREPARED_FIELD_CONTRACT_INVALID", phase="preflight", retryable=False)
        if signature_profile != "pades-ad-rb-1.3" or policy_oid != "2.16.76.1.7.1.11.1.3" or allow_fetching is not False:
            raise DirectCspError("PREPARED_POLICY_CONTRACT_INVALID", phase="preflight", retryable=False)
        if not pdf_bytes or not isinstance(digest, bytes) or not digest:
            raise DirectCspError("PREPARED_INPUT_INVALID", phase="preflight", retryable=False)
        try:
            key_handle = self._acquire_private_key(self.metadata)
            try:
                return bytes(self._sign_digest(key_handle, digest))
            finally:
                release = getattr(self._native_boundary, "release", None)
                if release is not None:
                    release(key_handle)
        except DirectCspError:
            raise
        except Exception as exc:
            code = "PIN_REQUIRED" if getattr(exc, "pin_required", False) else "CSP_SIGN_FAILED"
            raise DirectCspError(code, phase="provider_sign", retryable=None) from exc
