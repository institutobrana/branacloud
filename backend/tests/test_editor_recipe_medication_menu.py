import unittest
from types import SimpleNamespace


class _FakeQuery:
    def __init__(self, *, first=None, rows=None):
        self.first_value = first
        self.rows = list(rows or [])

    def filter(self, *_args, **_kwargs):
        return self

    def order_by(self, *_args, **_kwargs):
        return self

    def limit(self, *_args, **_kwargs):
        return self

    def first(self):
        return self.first_value

    def all(self):
        return self.rows


class _FakeDb:
    def __init__(self, *queries):
        self.queries = iter(queries)

    def query(self, *_args, **_kwargs):
        return next(self.queries)


class EditorRecipeMedicationMenuTests(unittest.TestCase):
    @staticmethod
    def _route():
        from routes import editor_textos_routes as route
        return route

    def test_medicine_response_uses_text_name_and_actual_presentation(self):
        route = self._route()
        db = _FakeDb(
            _FakeQuery(first=SimpleNamespace(id=12)),
            _FakeQuery(rows=[SimpleNamespace(
                id=12,
                nome="Amoxicilina",
                grupo="Antibiótico",
                apresentacao="500 mg · cápsula",
                posologia_adulto="Tomar conforme orientação",
                posologia_crianca="",
                quantidade_padrao_adulto="21 cápsulas",
                quantidade_padrao_crianca="",
                uso="Oral",
                observacoes="",
            )]),
        )
        items, source = route._listar_medicamentos_contexto(db, SimpleNamespace(clinica_id=3), limit=1000)
        self.assertEqual(source, "medicamento")
        self.assertEqual(items[0]["nome"], "Amoxicilina")
        self.assertEqual(items[0]["apresentacao"], "500 mg · cápsula")
        self.assertNotEqual(items[0]["nome"], str(items[0]["id"]))

    def test_auxiliary_fallback_does_not_invent_a_presentation(self):
        route = self._route()
        db = _FakeDb(
            _FakeQuery(first=None),
            _FakeQuery(rows=[SimpleNamespace(
                id=44,
                tipo="Grupo de medicamento",
                codigo="007",
                descricao="Amoxicilina",
                inativo=False,
            )]),
        )
        items, source = route._listar_medicamentos_contexto(db, SimpleNamespace(clinica_id=3), limit=1000)
        self.assertEqual(source, "item_auxiliar_grupo_medicamento")
        self.assertEqual(items[0]["nome"], "Amoxicilina")
        self.assertEqual(items[0]["codigo"], "007")
        self.assertEqual(items[0]["apresentacao"], "")


if __name__ == "__main__":
    unittest.main()
