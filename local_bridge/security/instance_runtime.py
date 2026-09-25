"""Abstract instance-lock boundary with a deterministic in-memory fake."""
from __future__ import annotations

from typing import Protocol
from .instance import InstanceGuard


class InstanceLock(Protocol):
    def acquire(self) -> None: ...
    def release(self) -> None: ...


class InMemoryInstanceLock:
    def __init__(self, name: str):
        self._guard = InstanceGuard(name)
        self._entered = False

    def acquire(self) -> None:
        self._guard.__enter__()
        self._entered = True

    def release(self) -> None:
        if self._entered:
            self._guard.__exit__(None, None, None)
            self._entered = False


class InstanceLockFactory(Protocol):
    def create(self, name: str) -> InstanceLock: ...


class InMemoryInstanceLockFactory:
    def create(self, name: str) -> InMemoryInstanceLock:
        return InMemoryInstanceLock(name)
