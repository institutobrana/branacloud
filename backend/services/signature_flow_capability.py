"""Server-side capability check for the isolated signature flow.

The browser cannot set this value.  A deployment must provide the database
engine, validated mTLS configuration, active installation registry and the
route set mounted by the disposable/operational composition.
"""

from sqlalchemy import inspect


REQUIRED_TABLES = {
    "usuarios_certificados",
    "signature_reservation_requests",
    "signature_authorizations",
    "bridge_installations",
    "bridge_installation_events",
}
REQUIRED_ROUTES = {
    "certificates",
    "reservation_create",
    "reservation_query",
    "reservation_bind",
    "authorization_confirm",
    "authorization_consume",
}


def signature_flow_capability(*, engine, mtls_configured, installation_registry, mounted_routes):
    """Return true only when every server-side prerequisite is observable."""
    if not mtls_configured or not installation_registry or not mounted_routes:
        return False
    if hasattr(installation_registry, "has_active"):
        try:
            if not installation_registry.has_active():
                return False
        except Exception:
            return False
    elif not any(getattr(record, "status", None) == "ACTIVE" for record in getattr(installation_registry, "_records", {}).values()):
        return False
    if not REQUIRED_ROUTES.issubset(set(mounted_routes)):
        return False
    try:
        tables = set(inspect(engine).get_table_names())
    except Exception:
        return False
    return REQUIRED_TABLES.issubset(tables)
