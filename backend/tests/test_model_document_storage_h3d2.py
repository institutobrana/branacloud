from pathlib import Path
from types import SimpleNamespace

import pytest

from services import model_document_storage as storage


def item(**kwargs):
    values = {
        "id": 1,
        "clinica_id": None,
        "tipo_modelo": "email_agenda",
        "nome_arquivo": "Modelo.rtf",
        "caminho_arquivo": "storage/modelos/base/email_agenda/Modelo.rtf",
    }
    values.update(kwargs)
    return SimpleNamespace(**values)


def test_visible_model_overrides_global_by_clinic():
    global_item = item(id=2)
    clinic_item = item(id=64, clinica_id=1)
    assert [x.id for x in storage.visible_model_overrides([global_item, clinic_item], 1)] == [64]
    assert [x.id for x in storage.visible_model_overrides([global_item], 1)] == [2]
    assert [x.id for x in storage.visible_model_overrides([global_item, clinic_item], 2)] == [2]


def test_resolver_uses_registered_clinic_file_and_containment(tmp_path, monkeypatch):
    root = tmp_path / "storage" / "modelos"
    target = root / "clinicas" / "1" / "Modelo.rtf"
    target.parent.mkdir(parents=True)
    target.write_text("conteudo", encoding="utf-8")
    monkeypatch.setattr(storage, "PROJECT_DIR", tmp_path)
    monkeypatch.setattr(storage, "MODEL_STORAGE_DIR", root)
    result = storage.resolve_model_file_info(item(clinica_id=1, caminho_arquivo="saas/storage/modelos/clinicas/1/Modelo.rtf"))
    assert result["source"] == "exact"
    assert result["path"] == target.resolve()


def test_resolver_rejects_other_tenant_and_traversal(tmp_path, monkeypatch):
    root = tmp_path / "storage" / "modelos"
    other = root / "clinicas" / "2" / "Modelo.rtf"
    other.parent.mkdir(parents=True)
    other.write_text("outro", encoding="utf-8")
    monkeypatch.setattr(storage, "PROJECT_DIR", tmp_path)
    monkeypatch.setattr(storage, "MODEL_STORAGE_DIR", root)
    result = storage.resolve_model_file_info(item(clinica_id=1, caminho_arquivo="storage/modelos/clinicas/2/Modelo.rtf"))
    assert result["source"] == "none"
    assert result["path"] is None or not str(result["path"]).lower().startswith(str(other).lower())


def test_missing_file_is_closed_failure(tmp_path, monkeypatch):
    root = tmp_path / "storage" / "modelos"
    root.mkdir(parents=True)
    monkeypatch.setattr(storage, "PROJECT_DIR", tmp_path)
    monkeypatch.setattr(storage, "MODEL_STORAGE_DIR", root)
    result = storage.resolve_model_file_info(item())
    assert result["source"] == "none"
    assert result["chosen_recursive_candidate"] is None
