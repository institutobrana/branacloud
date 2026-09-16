"""Side-effect-free contract tests for the protected notice POST."""

from types import SimpleNamespace
from unittest.mock import Mock
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from models.model_registry import import_all_models

import_all_models()

from models.agenda_legado import AgendaLegadoEvento
from models.paciente import Paciente
from models.prestador_odonto import PrestadorOdonto
import routes.agenda_legado_routes as route


class _Query:
    def __init__(self, rows):
        self.rows = rows

    def filter(self, *args, **kwargs):
        return self

    def all(self):
        return list(self.rows)

    def first(self):
        return self.rows[0] if self.rows else None


class _DB:
    def __init__(self, events=(), patients=(), providers=()):
        self.events = list(events)
        self.patients = list(patients)
        self.providers = list(providers)

    def query(self, model):
        if model is AgendaLegadoEvento:
            return _Query(self.events)
        if model is Paciente:
            return _Query(self.patients)
        if model is PrestadorOdonto:
            return _Query(self.providers)
        raise AssertionError(model)


def _event(event_id=1, patient_id=None, nro_pac=None, nome="", clinic=7):
    return SimpleNamespace(
        id=event_id, clinica_id=clinic, patient_id=patient_id, nro_pac=nro_pac,
        nome=nome, data=SimpleNamespace(date=lambda: __import__("datetime").date(2026, 9, 3)),
        hora_inicio=9 * 60 * 60 * 1000, hora_fim=10 * 60 * 60 * 1000,
        id_prestador=10, id_unidade=20, motivo="Consulta", fone1="", fone2="", fone3="",
    )


def _patient(pid, codigo=None, nome="Paciente", email="", fone1="", clinica_id=7):
    return SimpleNamespace(
        id=pid, codigo=codigo or pid, nome=nome, nome_completo=nome,
        email=email, fone1=fone1, fone2="", fone3="", fone4="",
        tipo_fone1="Celular", tipo_fone2="", tipo_fone3="", tipo_fone4="", clinica_id=clinica_id,
        apelido="", nome_profissional=nome,
    )


def _call(events, patients, tipo="email", items=None):
    route._modelo_documento_por_id = Mock(return_value=SimpleNamespace())
    route._ler_texto_modelo = Mock(return_value="Olá <<Paciente.Nome>>")
    route.enviar_email = Mock()
    route._enviar_whatsapp_meta = Mock(return_value={"enviado": True})
    payload = route.AvisoAgendaEnviarPayload(
        tipo_envio=tipo, modelo_id=1,
        itens=items or [route.AvisoAgendaEnviarItemPayload(agenda_id=events[0].id, ok=True)],
    )
    user = SimpleNamespace(clinica_id=7)
    result = route.enviar_avisos_agendamento(payload, user, _DB(events, patients, [_patient(10, nome="Dr.")]))
    return result


def test_canonical_email_rebuilds_recipient_from_server():
    event = _event(patient_id=42, nome="Ana")
    result = _call([event], [_patient(42, nome="Ana", email="ana@example.com")])
    assert result["enviados"] == 1
    route.enviar_email.assert_called_once()
    assert route.enviar_email.call_args.kwargs["destinatario"] == "ana@example.com"


def test_canonical_without_contact_does_not_call_provider():
    event = _event(patient_id=42)
    result = _call([event], [_patient(42)])
    assert result["enviados"] == 0
    route.enviar_email.assert_not_called()


def test_canonical_whatsapp_rebuilds_phone_from_server():
    event = _event(patient_id=42)
    result = _call([event], [_patient(42, nome="Paciente", fone1="(11) 99999-0000")], tipo="whatsapp")
    assert result["enviados"] == 1
    route._enviar_whatsapp_meta.assert_called_once_with("5511999990000", "Olá Paciente")


def test_historical_name_match_is_allowed_and_ambiguous_is_blocked():
    resolved = _event(event_id=1, nro_pac=1631, nome="Nathalya")
    candidates = [_patient(1631, codigo=1629, nome="Nathalya", email="n@example.com"),
                  _patient(1635, codigo=1631, nome="Marcelo", email="m@example.com")]
    result = _call([resolved], candidates)
    assert result["enviados"] == 1
    assert route.enviar_email.call_args.kwargs["destinatario"] == "n@example.com"

    ambiguous = _event(event_id=2, nro_pac=1631, nome="Outra pessoa")
    result = _call([ambiguous], candidates)
    assert result["enviados"] == 0
    route.enviar_email.assert_not_called()


def test_invalid_patient_cross_tenant_and_missing_event_are_blocked():
    invalid = _event(patient_id=999)
    assert _call([invalid], []).get("enviados") == 0
    assert route.enviar_email.call_count == 0

    missing = _event(event_id=999)
    result = _call([], [], items=[route.AvisoAgendaEnviarItemPayload(agenda_id=999, ok=True)])
    assert result["enviados"] == 0
    assert result["falhas"]


def test_forced_ok_is_selection_only_and_duplicate_ids_process_once():
    event = _event(patient_id=42)
    item = route.AvisoAgendaEnviarItemPayload(agenda_id=event.id, ok=True)
    result = _call([event], [_patient(42, email="ana@example.com")], items=[item, item, item])
    assert result["total_selecionados"] == 1
    if result["falhas"]:
        print(result)
    assert result["falhas"] == []
    assert route.enviar_email.call_count == 1

    unresolved = _event(event_id=43, nro_pac=1631, nome="Outra")
    result = _call([unresolved], [_patient(1631, codigo=1629), _patient(1635, codigo=1631)],
                   items=[route.AvisoAgendaEnviarItemPayload(agenda_id=43, ok=True)])
    assert result["enviados"] == 0
    route.enviar_email.assert_not_called()


def test_invalid_type_is_rejected_without_provider():
    try:
        _call([_event(patient_id=42)], [_patient(42, email="a@example.com")], tipo="sms")
    except Exception as exc:
        assert getattr(exc, "status_code", None) == 400
    else:
        raise AssertionError("invalid type was accepted")


if __name__ == "__main__":
    tests = [value for name, value in globals().items() if name.startswith("test_") and callable(value)]
    for test in tests:
        test()
    print(f"{len(tests)} POST contract tests passed")
