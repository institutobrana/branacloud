import sys
import unittest
from pathlib import Path
from types import SimpleNamespace

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from services.agenda_display import resolve_agenda_display_name


class AgendaLegadoDisplayPolicyTest(unittest.TestCase):
    def test_snapshot_first_preserves_historical_name(self):
        evento_vanesa = SimpleNamespace(nome="Vanesa Jovelina Diniz")
        evento_walter = SimpleNamespace(nome="Walter Cury Junior")
        paciente_atual = SimpleNamespace(nome_completo="Walter Cury Junior", nome="Walter Cury Junior")

        self.assertEqual(resolve_agenda_display_name(evento_vanesa, paciente_atual), "Vanesa Jovelina Diniz")
        self.assertEqual(resolve_agenda_display_name(evento_walter, paciente_atual), "Walter Cury Junior")

    def test_fallback_to_current_patient_when_snapshot_is_missing(self):
        evento_sem_nome = SimpleNamespace(nome="   ")
        paciente_atual = SimpleNamespace(nome_completo="Walter Cury Junior", nome="Walter Cury Junior")

        self.assertEqual(resolve_agenda_display_name(evento_sem_nome, paciente_atual), "Walter Cury Junior")

    def test_snapshot_empty_whitespace_uses_current_patient(self):
        evento_vazio = SimpleNamespace(nome="\t  ")
        paciente_atual = SimpleNamespace(nome_completo="Walter Cury Junior", nome="Walter Cury Junior")

        self.assertEqual(resolve_agenda_display_name(evento_vazio, paciente_atual), "Walter Cury Junior")


if __name__ == "__main__":
    unittest.main()
