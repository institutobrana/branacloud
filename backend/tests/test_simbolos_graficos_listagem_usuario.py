import os
import sys
import unittest
from types import SimpleNamespace

from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-symbols-tests")

from routes import cadastros_routes


class FakeRow(SimpleNamespace):
    pass


class FakeQuery:
    def __init__(self, rows):
        self.rows = rows

    def filter(self, *args, **kwargs):
        return self

    def order_by(self, *args, **kwargs):
        return self

    def all(self):
        return self.rows


class FakeDb:
    def __init__(self, rows):
        self.rows = rows

    def query(self, model):
        return FakeQuery(self.rows)


class SimbolosGraficosListagemTests(unittest.TestCase):
    def test_catalogo_inclui_somente_legacy_oficial_e_origem_usuario_explicita(self):
        rows = [
            FakeRow(id=1, clinica_id=1, legacy_id=1, origem=None, codigo='oficial.bmp', descricao='Oficial', ativo=True, especialidade=1, tipo_marca=2, tipo_simbolo=1, icone='oficial.bmp', bitmap1=None, bitmap2=None, bitmap3=None, imagem_custom=None),
            FakeRow(id=2, clinica_id=1, legacy_id=None, origem='simbolo_usuario', codigo='usuario.bmp', descricao='Usuario', ativo=True, especialidade=2, tipo_marca=2, tipo_simbolo=2, icone='usuario.bmp', bitmap1=None, bitmap2=None, bitmap3=None, imagem_custom=None),
            FakeRow(id=3, clinica_id=1, legacy_id=None, origem=None, codigo='tecnico.bmp', descricao='Tecnico', ativo=True, especialidade=3, tipo_marca=2, tipo_simbolo=2, icone='tecnico.bmp', bitmap1=None, bitmap2=None, bitmap3=None, imagem_custom=None),
        ]
        fake_db = FakeDb(rows)
        fake_user = SimpleNamespace(clinica_id=1)
        original = cadastros_routes.carregar_legacy_ids_catalogo_oficial
        cadastros_routes.carregar_legacy_ids_catalogo_oficial = lambda: {1}
        try:
            result = cadastros_routes.listar_simbolos_graficos(q='', scope='catalogo', current_user=fake_user, db=fake_db)
        finally:
            cadastros_routes.carregar_legacy_ids_catalogo_oficial = original

        self.assertEqual([item['id'] for item in result], [1, 2])
        self.assertEqual(result[1]['codigo'], 'usuario.bmp')
        self.assertEqual(result[1]['descricao'], 'Usuario')
        self.assertEqual(result[1]['tipo_simbolo'], 2)
        self.assertNotIn(3, [item['id'] for item in result])


if __name__ == '__main__':
    unittest.main()
