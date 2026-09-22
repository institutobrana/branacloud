from pathlib import Path
import tempfile
import unittest
from types import SimpleNamespace
from unittest.mock import patch

from services.editor_catalog_diagnostics import (
    CATALOG_EXTENSIONS,
    classify_catalog_bytes,
    registered_catalog_path,
)


class EditorCatalogDiagnosticsTests(unittest.TestCase):
    def test_catalog_extension_inventory_includes_requested_formats(self):
        self.assertEqual(CATALOG_EXTENSIONS, {".bmp", ".doc", ".dot", ".dotm", ".mod", ".rec", ".rtf", ".tmp", ".txt"})


    def test_registered_path_requires_tenant_root_exact_name_and_extension(self):
        with tempfile.TemporaryDirectory() as directory:
            tmp_path = Path(directory)
            tenant = tmp_path / "storage" / "modelos" / "clinicas" / "7"
            safe_file = tenant / "modelos" / "exemplo.rec"
            safe_file.parent.mkdir(parents=True)
            safe_file.write_bytes(b"texto")
            self.assertEqual(registered_catalog_path(safe_file, root=tenant, filename="exemplo.rec", extension=".rec"), safe_file.resolve())
            self.assertIsNone(registered_catalog_path(safe_file, root=tenant, filename="outro.rec", extension=".rec"))
            self.assertIsNone(registered_catalog_path(safe_file, root=tenant, filename="exemplo.txt", extension=".txt"))
            self.assertIsNone(registered_catalog_path(tmp_path / "fora.rec", root=tenant, filename="fora.rec", extension=".rec"))


    def test_path_resolver_rejects_symlink_escape_when_supported(self):
        with tempfile.TemporaryDirectory() as directory:
            tmp_path = Path(directory)
            tenant = tmp_path / "storage" / "modelos" / "clinicas" / "7"
            tenant.mkdir(parents=True)
            outside = tmp_path / "outside.rec"
            outside.write_bytes(b"secret")
            link = tenant / "escape.rec"
            try:
                link.symlink_to(outside)
            except (OSError, NotImplementedError):
                self.skipTest("O sistema não permite criar symlink neste ambiente")
            self.assertIsNone(registered_catalog_path(link, root=tenant, filename="escape.rec", extension=".rec"))


    def test_rec_signatures_classify_rtf_text_and_unknown_binary(self):
        self.assertEqual(classify_catalog_bytes(b"{\\rtf1 texto}", ".rec")["kind"], "rtf")
        self.assertEqual(classify_catalog_bytes("Ação\n<<Paciente.NomeCompleto>>".encode(), ".rec")["kind"], "text")
        result = classify_catalog_bytes(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1binary", ".rec")
        self.assertEqual(result["kind"], "diagnostic")
        self.assertEqual(result["preview"], "")


    def test_tmp_is_conservative_and_office_binary_never_has_preview(self):
        self.assertEqual(classify_catalog_bytes(b"arquivo temporario legivel", ".tmp")["kind"], "text")
        result = classify_catalog_bytes(b"BM\x00\x01binary-payload", ".bmp")
        self.assertEqual(result["kind"], "diagnostic")
        self.assertEqual(result["preview"], "")
        self.assertIn("sem conversor", result["reason"])


    def test_declared_oasis_requires_a_valid_envelope(self):
        valid = b'{"format":"oasis","version":1,"document":{}}'
        invalid = b'{"format":"other"}'
        self.assertEqual(classify_catalog_bytes(valid, ".rec", "oasis_json")["kind"], "oasis_json")
        self.assertEqual(classify_catalog_bytes(invalid, ".rec", "oasis_json")["kind"], "diagnostic")

    @staticmethod
    def _model(path, extension, *, clinic_id=7, model_id=321):
        return SimpleNamespace(
            id=model_id,
            clinica_id=clinic_id,
            nome_exibicao="R39B diagnóstico teste",
            nome_arquivo=path.name,
            tipo_modelo="outros",
            extensao=extension,
            origem="clinica",
            caminho_arquivo=str(path),
        )

    def test_office_formats_are_metadata_only_and_never_read_as_text(self):
        from routes import editor_textos_routes as route

        with tempfile.TemporaryDirectory() as directory:
            project = Path(directory)
            root = project / "storage" / "modelos"
            clinic = root / "clinicas" / "7"
            clinic.mkdir(parents=True)
            with patch.object(route, "PROJECT_DIR", project), patch.object(route, "MODEL_STORAGE_DIR", root):
                for extension in (".doc", ".dot", ".dotm", ".bmp"):
                    source = clinic / f"sample{extension}"
                    source.write_bytes(b"binary-private-payload")
                    item = self._model(source, extension)
                    resolved, _ = route._resolve_editor_catalog_file(item)
                    with patch.object(Path, "read_bytes", side_effect=AssertionError("binary must not be read")):
                        result = route._load_catalog_model_detail(item, extension, resolved)
                    self.assertEqual(result["conteudo_formato"], "diagnostic")
                    self.assertEqual(result["conteudo"], "")
                    self.assertEqual(result["diagnostico"]["read_only"], True)
                    self.assertEqual(result["diagnostico"]["file_exists"], True)

    def test_rec_rtf_and_plain_text_are_classified_without_writing_source(self):
        from routes import editor_textos_routes as route

        with tempfile.TemporaryDirectory() as directory:
            project = Path(directory)
            root = project / "storage" / "modelos"
            clinic = root / "clinicas" / "7"
            clinic.mkdir(parents=True)
            rtf = clinic / "source.rec"
            rtf.write_bytes(b"{\\rtf1\\ansi Texto RTF}")
            plain = clinic / "plain.rec"
            plain.write_text("Ação\n<<Paciente.NomeCompleto>>", encoding="utf-8")
            with patch.object(route, "PROJECT_DIR", project), patch.object(route, "MODEL_STORAGE_DIR", root):
                for source, expected_format in ((rtf, "html"), (plain, "text")):
                    before = source.read_bytes()
                    item = self._model(source, ".rec")
                    resolved, _ = route._resolve_editor_catalog_file(item)
                    result = route._load_catalog_model_detail(item, ".rec", resolved)
                    self.assertEqual(result["conteudo_formato"], expected_format)
                    if source == plain:
                        self.assertIn("<<Paciente.NomeCompleto>>", result["conteudo"])
                    self.assertEqual(source.read_bytes(), before)

    def test_missing_file_and_other_tenant_path_return_safe_diagnostics(self):
        from routes import editor_textos_routes as route

        with tempfile.TemporaryDirectory() as directory:
            project = Path(directory)
            root = project / "storage" / "modelos"
            (root / "clinicas" / "1").mkdir(parents=True)
            other = root / "clinicas" / "2" / "other.doc"
            other.parent.mkdir(parents=True)
            other.write_bytes(b"never read")
            missing = root / "clinicas" / "1" / "missing.tmp"
            with patch.object(route, "PROJECT_DIR", project), patch.object(route, "MODEL_STORAGE_DIR", root):
                missing_item = self._model(missing, ".tmp", clinic_id=1)
                missing_path, _ = route._resolve_editor_catalog_file(missing_item)
                missing_result = route._load_catalog_model_detail(missing_item, ".tmp", missing_path)
                self.assertFalse(missing_result["diagnostico"]["file_exists"])
                self.assertEqual(missing_result["diagnostico"]["detected_format"], "missing")

                other_item = self._model(other, ".doc", clinic_id=1)
                unsafe_path, reason = route._resolve_editor_catalog_file(other_item)
                self.assertIsNone(unsafe_path)
                self.assertEqual(reason, "invalid_or_unresolved_registered_path")
                rejected = route._catalog_diagnostic_response(other_item, extension=".doc", path=None, reason="caminho não validado", detected_format="unsafe_or_unresolved_path")
                self.assertFalse(rejected["diagnostico"]["file_exists"])


if __name__ == "__main__":
    unittest.main()
