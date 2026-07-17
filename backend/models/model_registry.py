from __future__ import annotations

import importlib
import pkgutil


def import_all_models() -> None:
    import models as models_pkg

    for module in pkgutil.iter_modules(models_pkg.__path__):
        if module.ispkg or module.name.startswith("__") or module.name in {"model_registry"}:
            continue
        importlib.import_module(f"models.{module.name}")
