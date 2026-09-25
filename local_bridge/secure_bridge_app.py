"""Importable secure-bridge factory; deliberately not registered by app.py."""
from __future__ import annotations

from .security.bridge_runtime import SecureBridgeRuntime
from .security.http_protocol import HttpProtocolService
from .security.instance_runtime import InMemoryInstanceLockFactory, InstanceLock
from .security.tls_runtime import TLSRuntimeConfig
from .security.ui import ApprovalUI, PendingApprovalUI
import ctypes


class _DeferredOperationalSigner:
    def __init__(self, selector, factory, *, production_mode=False):
        self._selector = selector
        self._factory = factory
        self._signer = None
        self._production_mode = production_mode

    def sign_prepared(self, request):
        if self._signer is None:
            self._signer = self._factory(self._selector)
        return self._signer.sign_prepared(request)

    async def async_sign_prepared(self, request):
        if self._signer is None:
            self._signer = self._factory(self._selector)
        method = getattr(self._signer, "async_sign_prepared", None)
        if method is None:
            if self._production_mode:
                raise RuntimeError("ASYNC_OPERATIONAL_SIGNER_REQUIRED")
            return self._signer.sign_prepared(request)
        return await method(request)


class WindowsNamedMutexAdapter:
    def __init__(self):
        self._handle = None

    def acquire(self) -> None:
        kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
        handle = kernel32.CreateMutexW(None, True, "Global\\BranaCloudeBridgeApproval")
        if not handle:
            raise RuntimeError("INSTANCE_MUTEX_UNAVAILABLE")
        if ctypes.get_last_error() == 183:
            kernel32.CloseHandle(handle)
            raise RuntimeError("INSTANCE_ALREADY_RUNNING")
        self._handle = handle

    def release(self) -> None:
        if self._handle is not None:
            ctypes.WinDLL("kernel32", use_last_error=True).ReleaseMutex(self._handle)
            ctypes.WinDLL("kernel32", use_last_error=True).CloseHandle(self._handle)
            self._handle = None


def _require_real_wiring(candidate_selector, operational_signer_factory):
    if not callable(candidate_selector) or not callable(operational_signer_factory):
        raise RuntimeError("REAL_WIRING_REQUIRED")
    if getattr(candidate_selector, "test_mode", False) or getattr(operational_signer_factory, "test_mode", False):
        raise RuntimeError("REAL_WIRING_REQUIRED")
    if not getattr(operational_signer_factory, "real_wiring", False):
        raise RuntimeError("REAL_WIRING_REQUIRED")


def create_secure_bridge_runtime(*, cert_pem: bytes, key_pem: bytes, signer=None, candidate_selector=None, operational_signer_factory=None, ui: ApprovalUI | None = None, wpf_executable: str | None = None, lock: InstanceLock | None = None, tls_config: TLSRuntimeConfig = TLSRuntimeConfig(), production_mode: bool = False, enable_real_signing: bool = False, dotnet_helper_executable: str | None = None, enable_dotnet_store_helper: bool = False) -> SecureBridgeRuntime:
    if production_mode and operational_signer_factory is None and candidate_selector is not None:
        if enable_dotnet_store_helper:
            if not dotnet_helper_executable:
                raise RuntimeError("DOTNET_HELPER_PATH_REQUIRED")
            from .security.dotnet_sha256_signer import create_explicit_store_only_dotnet_factory
            operational_signer_factory = create_explicit_store_only_dotnet_factory(
                executable=dotnet_helper_executable, enabled=True)
        else:
            from .security.windows_prepared_signer import create_real_operational_windows_prepared_signer
            operational_signer_factory = create_real_operational_windows_prepared_signer()
    elif enable_dotnet_store_helper:
        raise RuntimeError("DOTNET_HELPER_REQUIRES_DEFAULT_OPERATIONAL_FACTORY")
    if production_mode:
        _require_real_wiring(candidate_selector, operational_signer_factory)
        if ui is None and wpf_executable:
            from .security.approval_adapter import launch_wpf_approval_ui
            ui, _wpf_process = launch_wpf_approval_ui(wpf_executable)
        if ui is None:
            raise RuntimeError("REAL_APPROVAL_UI_REQUIRED")
    if signer is None:
        if candidate_selector is not None and operational_signer_factory is not None:
            signer = _DeferredOperationalSigner(candidate_selector, operational_signer_factory, production_mode=production_mode)
        else:
            raise RuntimeError("OPERATIONAL_SIGNER_FACTORY_REQUIRED")
    if lock is None:
        lock = WindowsNamedMutexAdapter()
    service = HttpProtocolService(ui=ui or PendingApprovalUI(), signer=signer, signing_enabled=(not production_mode) or enable_real_signing)
    runtime = SecureBridgeRuntime(cert_pem=cert_pem, key_pem=key_pem, service=service, lock=lock, tls_config=tls_config)
    if '_wpf_process' in locals():
        runtime._wpf_process = _wpf_process
    return runtime


def create_secure_bridge_app(**kwargs):
    return create_secure_bridge_runtime(**kwargs).create_app()
