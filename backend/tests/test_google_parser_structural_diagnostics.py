import json
import unittest
from services.google_calendar_service import _safe_json_parse, _classify_json_shape, _safe_url_target


class ParserStructuralDiagnosticsTests(unittest.TestCase):
    def check(self, raw, parsed, message=None):
        text = raw.decode("utf-8", errors="replace")
        value, meta = _safe_json_parse(raw, text)
        self.assertEqual(bool(meta["json_parsed"]), parsed)
        if message: self.assertIn(message, meta["json_error_message"])
        return value, meta

    def test_normal_json(self): self.check(b'{"access_token":"sentinel"}', True)
    def test_bom(self): self.check(b'\xef\xbb\xbf{"x":1}', False, "BOM")
    def test_whitespace(self): self.check(b'  {"x":1}  ', True)
    def test_trailing_data(self): self.check(b'{"x":1}{"y":2}', False, "Extra data")
    def test_html(self): self.check(b'<html>', False, "Expecting value")
    def test_empty(self): self.check(b'', False, "Expecting value")
    def test_invalid_utf8(self):
        _, meta = self.check(b'{"x":"\xff"}', False)
        self.assertFalse(meta["strict_utf8_decode_succeeded"])
        self.assertTrue(meta["replacement_decode_required"])
    def test_unicode(self): self.check(json.dumps({"x":"ação"}, ensure_ascii=False).encode(), True)
    def test_nul(self):
        _, meta = self.check(b'{"x":"a\x00b"}', False)
        self.assertTrue(meta["nul_byte_present"])
    def test_concatenated(self): self.check(b'{"x":1}{"y":2}', False)
    def test_r21_sized_json(self):
        raw = json.dumps({"access_token":"SYNTHETIC_ACCESS_TOKEN_SECRET_SENTINEL", "refresh_token":"SYNTHETIC_REFRESH_TOKEN_SECRET_SENTINEL", "id_token":"SYNTHETIC_ID_TOKEN_SECRET_SENTINEL", "padding":"x"*1700}).encode()
        self.assertGreater(len(raw), 1800); self.check(raw, True)

    def test_shape_classifier_whitelist(self):
        cases = [
            ({"access_token": "x", "token_type": "Bearer"}, "token_success"),
            ({"error": "invalid_grant"}, "token_error"),
            ({"keys": []}, "jwks"),
            ({"issuer": "x", "authorization_endpoint": "x", "token_endpoint": "x", "jwks_uri": "x"}, "oidc_discovery"),
            ({"sub": "x", "email": "x"}, "userinfo"),
            ({"kind": "x", "items": []}, "calendar_api"),
            ({"unexpected": True}, "unknown_json"),
        ]
        for value, expected in cases:
            self.assertEqual(_classify_json_shape(value), expected)

    def test_safe_url_target_omits_query(self):
        self.assertEqual(_safe_url_target("https://oauth2.googleapis.com/token?code=secret"), {
            "scheme": "https", "host": "oauth2.googleapis.com", "path": "/token"
        })


if __name__ == "__main__": unittest.main()
