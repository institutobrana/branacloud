from __future__ import annotations

import ast
import sys
from pathlib import Path
import unittest

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import Base
from models.model_registry import import_all_models


def _tables_from_model_files() -> set[str]:
    tables = set()
    models_dir = BACKEND_DIR / "models"
    for path in models_dir.glob("*.py"):
        if path.name in {"__init__.py", "model_registry.py"}:
            continue
        tree = ast.parse(path.read_text(encoding="utf-8"))
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                for stmt in node.body:
                    if (
                        isinstance(stmt, ast.Assign)
                        and len(stmt.targets) == 1
                        and isinstance(stmt.targets[0], ast.Name)
                        and stmt.targets[0].id == "__tablename__"
                        and isinstance(stmt.value, ast.Constant)
                        and isinstance(stmt.value.value, str)
                    ):
                        tables.add(stmt.value.value)
    return tables


class ModelRegistryTests(unittest.TestCase):
    def test_all_model_tables_are_registered_in_metadata(self):
        import_all_models()
        expected = _tables_from_model_files()
        registered = set(Base.metadata.tables.keys())
        self.assertTrue(expected.issubset(registered), sorted(expected - registered))
