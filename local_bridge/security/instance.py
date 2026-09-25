"""Process-local single-instance guard; no sockets or files are opened."""
from __future__ import annotations

import threading
from contextlib import AbstractContextManager

_locks: dict[str, threading.Lock] = {}
_registry_lock = threading.Lock()


class InstanceAlreadyRunning(RuntimeError):
    pass


class InstanceGuard(AbstractContextManager):
    def __init__(self, name: str):
        if not name or not isinstance(name, str):
            raise ValueError("INSTANCE_NAME_INVALID")
        self.name = name
        self._lock = None
        self._acquired = False

    def __enter__(self):
        with _registry_lock:
            self._lock = _locks.setdefault(self.name, threading.Lock())
        if not self._lock.acquire(blocking=False):
            raise InstanceAlreadyRunning("INSTANCE_ALREADY_RUNNING")
        self._acquired = True
        return self

    def __exit__(self, exc_type, exc, tb):
        if self._acquired and self._lock:
            self._lock.release()
        self._acquired = False
        return False
