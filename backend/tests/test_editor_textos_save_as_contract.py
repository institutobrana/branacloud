import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest.mock import Mock, patch

from fastapi import HTTPException


class EditorTextosSaveAsContractTests(unittest.TestCase):
    @staticmethod
    def _route():
        from routes import editor_textos_routes as route
        return route

    def test_save_as_collision_returns_conflict_before_any_create(self):
        route = self._route()
        model = SimpleNamespace(id=63, clinica_id=1, nome_exibicao="ATESTADO_TEL_BRANA", tipo_modelo="atestados", nome_arquivo="ATESTADO_TEL_BRANA.mod", extensao=".mod", origem="clinica")
        query = Mock()
        query.filter.return_value = query
        query.order_by.return_value = query
        query.all.return_value = [model]
        db = Mock()
        db.query.return_value = query
        user = SimpleNamespace(clinica_id=1)
        payload = route.ModeloTextoSaveAsPayload(nome="ATESTADO_TEL_BRANA", tipo_modelo="outros", conteudo="payload")

        with patch.object(route, "criar_modelo_editor_textos") as create:
            with self.assertRaises(HTTPException) as raised:
                route.salvar_como_modelo_editor_textos(payload, user, db)

        self.assertEqual(raised.exception.status_code, 409)
        self.assertEqual(raised.exception.detail["code"], "MODEL_NAME_COLLISION")
        self.assertEqual(raised.exception.detail["models"][0]["id"], 63)
        create.assert_not_called()

    def test_replace_uses_chosen_clinic_id_and_existing_category(self):
        route = self._route()
        model = SimpleNamespace(id=63, clinica_id=1, ativo=True, nome_exibicao="ATESTADO_TEL_BRANA", tipo_modelo="atestados")
        query = Mock()
        query.filter.return_value = query
        query.first.return_value = model
        db = Mock()
        db.query.return_value = query
        user = SimpleNamespace(clinica_id=1)
        payload = route.ModeloTextoSaveAsPayload(
            nome="ATESTADO_TEL_BRANA", tipo_modelo="outros", conteudo="oasis", conteudo_formato="oasis_json",
            extensao=".txt", replace_model_id=63,
        )
        expected = {"id": 63, "tipo_modelo": "atestados"}

        with patch.object(route, "salvar_modelo_editor_textos", return_value=expected) as replace:
            result = route.salvar_como_modelo_editor_textos(payload, user, db)

        self.assertEqual(result, expected)
        args = replace.call_args.args
        self.assertEqual(args[0], 63)
        self.assertEqual(args[1].tipo_modelo, "atestados")
        self.assertEqual(args[1].extensao, ".txt")
        self.assertEqual(args[1].conteudo_formato, "oasis_json")

    def test_replace_rejects_base_models_to_preserve_their_identity_and_shared_storage(self):
        route = self._route()
        query = Mock()
        query.filter.return_value = query
        query.first.return_value = None
        db = Mock()
        db.query.return_value = query
        payload = route.ModeloTextoSaveAsPayload(nome="Base", replace_model_id=1)

        with self.assertRaises(HTTPException) as raised:
            route.salvar_como_modelo_editor_textos(payload, SimpleNamespace(clinica_id=1), db)

        self.assertEqual(raised.exception.status_code, 409)

    def test_legacy_file_path_is_not_reused_when_oasis_txt_target_already_exists(self):
        route = self._route()
        with TemporaryDirectory() as temp_dir:
            storage = Path(temp_dir)
            model_dir = storage / "clinicas" / "1" / "atestados"
            model_dir.mkdir(parents=True)
            (model_dir / "ATESTADO_TEL_BRANA.mod").write_bytes(b"legacy")
            (model_dir / "ATESTADO_TEL_BRANA.txt").write_text("unrelated existing file", encoding="utf-8")
            query = Mock()
            query.filter.return_value = query
            query.first.return_value = None
            db = Mock()
            db.query.return_value = query

            with patch.object(route, "MODEL_STORAGE_DIR", storage):
                filename = route._next_available_storage_filename(
                    db, 1, "atestados", "ATESTADO_TEL_BRANA.txt", exclude_id=63
                )

            self.assertEqual(filename, "ATESTADO_TEL_BRANA 2.txt")
            self.assertEqual((model_dir / "ATESTADO_TEL_BRANA.mod").read_bytes(), b"legacy")
            self.assertEqual((model_dir / "ATESTADO_TEL_BRANA.txt").read_text(encoding="utf-8"), "unrelated existing file")


if __name__ == "__main__":
    unittest.main()
