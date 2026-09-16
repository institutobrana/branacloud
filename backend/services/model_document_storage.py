from pathlib import Path
import unicodedata


PROJECT_DIR = Path(__file__).resolve().parents[2]
MODEL_STORAGE_DIR = PROJECT_DIR / "storage" / "modelos"
ALLOWED_EXTENSIONS = {".mod", ".rtf", ".txt", ".html", ".htm", ".doc", ".docx"}


def visible_model_overrides(items, clinic_id: int) -> list:
    """Select active global/clinic models, with clinic overriding global."""
    chosen = {}
    for item in items:
        scope = getattr(item, "clinica_id", None)
        if scope is not None and int(scope) != int(clinic_id):
            continue
        tipo = str(getattr(item, "tipo_modelo", "") or "").strip().casefold()
        filename = _normalize_filename_key(getattr(item, "nome_arquivo", ""))
        key = (tipo, filename)
        previous = chosen.get(key)
        if previous is None or (scope is not None and getattr(previous, "clinica_id", None) is None):
            chosen[key] = item
    return sorted(
        chosen.values(),
        key=lambda item: (
            str(getattr(item, "nome_exibicao", "") or "").casefold(),
            int(getattr(item, "id", 0) or 0),
        ),
    )


def _normalize_filename_key(value) -> str:
    raw = unicodedata.normalize("NFD", str(value or "").strip().casefold())
    return "".join(ch for ch in raw if unicodedata.category(ch) != "Mn")


def _realpath_inside(path: Path, root: Path) -> bool:
    try:
        path_real = path.resolve(strict=False)
        root_real = root.resolve(strict=False)
        path_real.relative_to(root_real)
        return True
    except (OSError, ValueError):
        return False


def _safe_relative_path(value: str | None) -> Path | None:
    raw = str(value or "").strip().replace("\\", "/")
    if not raw:
        return None
    candidates = [raw]
    lower = raw.lower()
    for marker in ("saas/storage/modelos/", "storage/modelos/"):
        pos = lower.find(marker)
        if pos >= 0:
            tail = raw[pos + len(marker):]
            candidates.extend([f"storage/modelos/{tail}", f"saas/storage/modelos/{tail}"])
            break
    for candidate in candidates:
        path = Path(candidate)
        resolved = path.resolve() if path.is_absolute() else (PROJECT_DIR / path).resolve()
        if _realpath_inside(resolved, PROJECT_DIR) and resolved.exists():
            return resolved
    first = Path(candidates[0])
    resolved = first.resolve() if first.is_absolute() else (PROJECT_DIR / first).resolve()
    return resolved if _realpath_inside(resolved, PROJECT_DIR) else None


def _normalize_filename(value: str | None) -> str:
    raw = unicodedata.normalize("NFD", str(value or "").strip().lower())
    raw = "".join(ch for ch in raw if unicodedata.category(ch) != "Mn")
    return "".join(ch for ch in raw if ch.isalnum())


def _candidate(item, path: Path, source: str, reason: str = "") -> dict | None:
    ext = path.suffix.lower()
    if ext not in ALLOWED_EXTENSIONS or not path.is_file() or path.stat().st_size <= 0:
        return None
    clinic_root = MODEL_STORAGE_DIR / "clinicas" / str(int(item.clinica_id)) if item.clinica_id is not None else MODEL_STORAGE_DIR / "base"
    if not _realpath_inside(path, clinic_root):
        return None
    return {"path": path, "original_path": _safe_relative_path(getattr(item, "caminho_arquivo", "")), "original_size": 0, "source": source, "fallback_reason": reason, "recursive_candidates": [], "chosen_recursive_candidate": None}


def resolve_model_file_info(item) -> dict:
    original = _safe_relative_path(getattr(item, "caminho_arquivo", ""))
    reason = "arquivo_original_inexistente" if original and not original.exists() else "caminho_original_vazio"
    if original:
        result = _candidate(item, original, "exact")
        if result:
            result["original_size"] = original.stat().st_size
            result["original_path"] = original
            result["fallback_reason"] = ""
            return result
    name = str(getattr(item, "nome_arquivo", "") or "").strip()
    tipo = str(getattr(item, "tipo_modelo", "outros") or "outros").strip()
    roots = []
    if item.clinica_id is not None:
        roots.append(MODEL_STORAGE_DIR / "clinicas" / str(int(item.clinica_id)))
    if item.clinica_id is None or str(getattr(item, "origem", "") or "").lower() == "base":
        roots.append(MODEL_STORAGE_DIR / "base" / tipo)
    matches = []
    normalized = _normalize_filename(name)
    for root in roots:
        if not root.exists():
            continue
        for path in root.rglob("*"):
            if path.is_file() and _normalize_filename(path.name) == normalized:
                matches.append(path.resolve())
    matches.sort(key=lambda p: (p.suffix.lower() not in {".mod", ".rtf", ".txt"}, len(p.parts), str(p).lower()))
    for path in matches:
        result = _candidate(item, path, "recursive", reason)
        if result:
            result["recursive_candidates"] = [{"path": p} for p in matches]
            result["chosen_recursive_candidate"] = {"path": path}
            return result
    base = MODEL_STORAGE_DIR / "base" / tipo / name
    result = _candidate(item, base.resolve(), "base", reason) if base.exists() else None
    return result or {"path": original, "original_path": original, "original_size": 0, "source": "none", "fallback_reason": reason, "recursive_candidates": [{"path": p} for p in matches], "chosen_recursive_candidate": None}
