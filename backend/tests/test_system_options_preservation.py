from copy import deepcopy

from routes.system_options_routes import (
    _merge_system_options,
    _sanitize_incoming_changes,
)


def test_no_edit_preserves_special_and_unknown_values():
    existing = {
        "boolFalse": False,
        "zeroValue": 0,
        "nullable": None,
        "emptyText": "",
        "hidden": True,
        "futureUnknown": {"enabled": True},
    }
    assert _merge_system_options(existing, _sanitize_incoming_changes({})) == existing


def test_single_edit_preserves_omitted_nested_values():
    existing = {"nested": {"a": 1, "b": None, "future": "x"}, "other": False}
    result = _merge_system_options(existing, {"nested": {"a": 2}})
    assert result == {"nested": {"a": 2, "b": None, "future": "x"}, "other": False}


def test_hidden_keys_and_unknown_omitted_keys_survive():
    existing = {"avancado": {
        "habilitar_mensagens_depuracao": True,
        "ignorar_copias_driver": False,
        "salvar_arquivos_myeasy": True,
        "habilitar_dente_3d": False,
        "future_unknown_option": {"enabled": True, "mode": "x"},
    }}
    result = _merge_system_options(existing, {"avancado": {"qtd_imagens_odontograma": 41}})
    assert result["avancado"] == existing["avancado"] | {"qtd_imagens_odontograma": 41}


def test_explicit_zero_is_validated_but_omitted_zero_is_not_reprocessed():
    existing = {"financeiro": {"periodo_parcelamento": 0}}
    assert _merge_system_options(existing, {}) == existing
    incoming = _sanitize_incoming_changes({"financeiro": {"periodo_parcelamento": 0}})
    assert incoming["financeiro"]["periodo_parcelamento"] == 1


def test_arrays_replace_only_when_explicitly_received():
    existing = {"future": [1, 2], "nested": {"keep": True}}
    assert _merge_system_options(existing, {}) == existing
    assert _merge_system_options(existing, {"future": [3]}) == {"future": [3], "nested": {"keep": True}}


def test_sanitizing_does_not_mutate_input():
    incoming = {"avancado": {"future": {"enabled": True}}}
    original = deepcopy(incoming)
    _sanitize_incoming_changes(incoming)
    assert incoming == original
