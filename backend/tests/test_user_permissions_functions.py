from security.permissions import (
    get_module_function_schema,
    merge_function_permissions,
    merge_permissions_payload,
    sanitize_function_permissions,
)


def test_modern_function_schema_has_57_stable_codes():
    schema = get_module_function_schema()
    entries = [item for items in schema.values() for item in items]
    assert len(entries) == 57
    assert all(item["codigo"] and item["nome"] for item in entries)
    for items in schema.values():
        codes = [item["codigo"] for item in items]
        assert len(codes) == len(set(codes))


def test_function_patch_merges_without_losing_related_data():
    raw = {
        "modules": {"agenda": "protegido"},
        "functions": {"agenda": {"f1": "habilitado", "f2": "protegido"}, "financeiro": {"f3": "desabilitado"}},
        "easy_modules": {"1": "habilitado"},
        "easy_funcoes": {"2": "protegido"},
    }
    merged = merge_function_permissions(raw, {"agenda": {"inserir_agendamento": "desabilitado"}})
    assert merged["agenda"]["f1"] == "habilitado"
    assert merged["agenda"]["f2"] == "protegido"
    assert merged["financeiro"]["f3"] == "desabilitado"
    assert merged["agenda"]["inserir_agendamento"] == "desabilitado"
    preserved = merge_permissions_payload(raw, {"agenda": "habilitado"})
    assert preserved["functions"] == raw["functions"]
    assert preserved["easy_modules"] == raw["easy_modules"]
    assert preserved["easy_funcoes"] == raw["easy_funcoes"]


def test_unknown_function_and_level_are_rejected():
    for payload in (
        {"agenda": {"function_unknown": "habilitado"}},
        {"agenda": {"inserir_agendamento": "unknown"}},
        {"module_unknown": {"inserir_agendamento": "habilitado"}},
    ):
        try:
            sanitize_function_permissions(payload)
        except ValueError:
            pass
        else:
            raise AssertionError("invalid function permission accepted")
