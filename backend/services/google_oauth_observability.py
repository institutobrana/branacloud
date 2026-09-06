"""Temporary, allowlisted sink for sanitized Google OAuth diagnostics."""

import logging
from pathlib import Path


SINK_PATH = Path(__file__).resolve().parents[2] / ".runtime_tmp" / "google" / "oauth.log"
_MARKER_PREFIXES = ("calendar_oauth_", "google_oauth_probe_")


class _OAuthMarkerFilter(logging.Filter):
    def filter(self, record):
        return record.getMessage().startswith(_MARKER_PREFIXES)


def get_oauth_logger():
    logger = logging.getLogger("brana.google.oauth")
    logger.setLevel(logging.INFO)
    logger.propagate = False
    if not any(getattr(handler, "_brana_oauth_sink", False) for handler in logger.handlers):
        SINK_PATH.parent.mkdir(parents=True, exist_ok=True)
        handler = logging.FileHandler(SINK_PATH, encoding="utf-8")
        handler._brana_oauth_sink = True
        handler.setFormatter(logging.Formatter("%(asctime)s %(message)s"))
        handler.addFilter(_OAuthMarkerFilter())
        logger.addHandler(handler)
    return logger


oauth_logger = get_oauth_logger()
