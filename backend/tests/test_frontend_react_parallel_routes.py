import os
import sys
import unittest
from pathlib import Path

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-react-parallel-route")
os.environ["BRANA_ENABLE_SCHEMA_BOOTSTRAP"] = "0"
os.environ["BRANA_ENABLE_RUNTIME_BOOTSTRAP"] = "0"
os.environ["BRANA_SKIP_BOOTSTRAP"] = "1"

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient  # noqa: E402

from main import app  # noqa: E402


client = TestClient(app)


def _react_asset_names():
    dist_dir = Path(__file__).resolve().parents[2] / "frontend-react" / "dist" / "assets"
    js_asset = next(dist_dir.glob("index-*.js"), None)
    css_asset = next(dist_dir.glob("index-*.css"), None)
    assert js_asset is not None
    assert css_asset is not None
    return js_asset.name, css_asset.name


class FrontendReactParallelRoutesTest(unittest.TestCase):
    def _text(self, path: str):
        response = client.get(path)
        return response, response.text

    def test_frontend_legacy_and_react_parallel_routes(self):
        health = client.get("/health")
        self.assertEqual(health.status_code, 200)

        app_response, app_html = self._text("/app")
        self.assertEqual(app_response.status_code, 200)
        self.assertIn("/frontend/app.js", app_html)
        self.assertNotIn("/react/assets/", app_html)

        frontend_response, frontend_html = self._text("/frontend/")
        self.assertEqual(frontend_response.status_code, 200)
        self.assertIn("/frontend/app.js", frontend_html)
        self.assertNotIn("/react/assets/", frontend_html)

        react_response, react_html = self._text("/react")
        self.assertEqual(react_response.status_code, 200)
        self.assertIn("/react/assets/", react_html)
        self.assertNotIn("/frontend/app.js", react_html)

        react_slash_response, react_slash_html = self._text("/react/")
        self.assertEqual(react_slash_response.status_code, 200)
        self.assertIn("/react/assets/", react_slash_html)

        internal_response, internal_html = self._text("/react/tabelas/procedimentos")
        self.assertEqual(internal_response.status_code, 200)
        self.assertIn("/react/assets/", internal_html)

    def test_react_assets_and_missing_paths_do_not_mask_errors(self):
        js_asset, css_asset = _react_asset_names()

        js_response = client.get(f"/react/assets/{js_asset}")
        self.assertEqual(js_response.status_code, 200)
        self.assertIn("javascript", js_response.headers.get("content-type", "").lower())

        css_response = client.get(f"/react/assets/{css_asset}")
        self.assertEqual(css_response.status_code, 200)
        self.assertIn("text/css", css_response.headers.get("content-type", "").lower())

        missing_asset = client.get("/react/assets/arquivo-inexistente.js")
        self.assertEqual(missing_asset.status_code, 404)
        self.assertNotIn("/react/assets/", missing_asset.text)

        missing_api = client.get("/api/rota-inexistente")
        self.assertNotEqual(missing_api.status_code, 200)
        self.assertNotIn("/react/assets/", missing_api.text)

    def test_api_prefix_reaches_backend_routes(self):
        login_response = client.post("/api/login")
        self.assertEqual(login_response.status_code, 422)
        self.assertNotIn("/react/assets/", login_response.text)


if __name__ == "__main__":
    unittest.main()
