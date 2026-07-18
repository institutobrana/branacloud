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


class FrontendReactPrimaryRoutesTest(unittest.TestCase):
    def _text(self, path: str):
        response = client.get(path)
        return response, response.text

    def test_root_app_legacy_and_react_redirect_routes(self):
        health = client.get("/health")
        self.assertEqual(health.status_code, 200)

        root_response = client.get("/", follow_redirects=False)
        self.assertEqual(root_response.status_code, 307)
        self.assertEqual(root_response.headers.get("location"), "/app")

        app_response, app_html = self._text("/app")
        self.assertEqual(app_response.status_code, 200)
        self.assertIn("text/html", app_response.headers.get("content-type", "").lower())
        self.assertIn("/app/assets/", app_html)
        self.assertNotIn("/frontend/app.js", app_html)
        self.assertNotIn("/react/assets/", app_html)

        app_slash_response, app_slash_html = self._text("/app/")
        self.assertEqual(app_slash_response.status_code, 200)
        self.assertIn("/app/assets/", app_slash_html)

        login_response, login_html = self._text("/app/login")
        self.assertEqual(login_response.status_code, 200)
        self.assertIn("/app/assets/", login_html)

        internal_response, internal_html = self._text("/app/tabelas/procedimentos")
        self.assertEqual(internal_response.status_code, 200)
        self.assertIn("/app/assets/", internal_html)

        plano_response, plano_html = self._text("/app/configuracoes/plano-de-contas")
        self.assertEqual(plano_response.status_code, 200)
        self.assertIn("/app/assets/", plano_html)

        legado_response, legado_html = self._text("/legado")
        self.assertEqual(legado_response.status_code, 200)
        self.assertIn("/frontend/app.js", legado_html)
        self.assertNotIn("/app/assets/", legado_html)

        legado_slash_response, legado_slash_html = self._text("/legado/")
        self.assertEqual(legado_slash_response.status_code, 200)
        self.assertIn("/frontend/app.js", legado_slash_html)

        frontend_response, frontend_html = self._text("/frontend/")
        self.assertEqual(frontend_response.status_code, 200)
        self.assertIn("/frontend/app.js", frontend_html)
        self.assertNotIn("/app/assets/", frontend_html)

        redirect_cases = {
            "/react": "/app",
            "/react/": "/app",
            "/react/login": "/app/login",
            "/react/tabelas/procedimentos": "/app/tabelas/procedimentos",
            "/react/assets/arquivo.js": "/app/assets/arquivo.js",
        }
        for path, expected_location in redirect_cases.items():
            response = client.get(path, follow_redirects=False)
            self.assertEqual(response.status_code, 307, path)
            self.assertEqual(response.headers.get("location"), expected_location, path)

        query_response = client.get("/react/login?next=/alguma-rota", follow_redirects=False)
        self.assertEqual(query_response.status_code, 307)
        self.assertEqual(query_response.headers.get("location"), "/app/login?next=/alguma-rota")

    def test_app_assets_and_missing_paths_do_not_mask_errors(self):
        js_asset, css_asset = _react_asset_names()

        js_response = client.get(f"/app/assets/{js_asset}")
        self.assertEqual(js_response.status_code, 200)
        self.assertIn("javascript", js_response.headers.get("content-type", "").lower())

        css_response = client.get(f"/app/assets/{css_asset}")
        self.assertEqual(css_response.status_code, 200)
        self.assertIn("text/css", css_response.headers.get("content-type", "").lower())

        missing_asset = client.get("/app/assets/arquivo-inexistente.js")
        self.assertEqual(missing_asset.status_code, 404)
        self.assertNotIn("text/html", missing_asset.headers.get("content-type", "").lower())
        self.assertNotIn("/app/assets/", missing_asset.text)

        me_response = client.get("/api/me")
        self.assertEqual(me_response.status_code, 401)
        self.assertIn("application/json", me_response.headers.get("content-type", "").lower())
        self.assertNotIn("/app/assets/", me_response.text)
        self.assertNotIn("<!doctype html", me_response.text.lower())

        renew_response = client.post("/api/auth/renew")
        self.assertEqual(renew_response.status_code, 401)
        self.assertIn("application/json", renew_response.headers.get("content-type", "").lower())
        self.assertNotIn("/app/assets/", renew_response.text)
        self.assertNotIn("<!doctype html", renew_response.text.lower())

        missing_api = client.get("/api/rota-inexistente")
        self.assertNotEqual(missing_api.status_code, 200)
        self.assertIn("application/json", missing_api.headers.get("content-type", "").lower())
        self.assertNotIn("/app/assets/", missing_api.text)
        self.assertNotIn("<!doctype html", missing_api.text.lower())

    def test_api_prefix_reaches_backend_routes(self):
        login_response = client.post("/api/login")
        self.assertEqual(login_response.status_code, 422)
        self.assertNotIn("/app/assets/", login_response.text)


if __name__ == "__main__":
    unittest.main()
