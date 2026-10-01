"""Create/check the least-privilege PostgreSQL role for the isolated mTLS service."""
from __future__ import annotations

import argparse
import getpass
from pathlib import Path
from urllib.parse import urlsplit

import psycopg2
from psycopg2 import sql

TABLES = (
    "bridge_installations", "bridge_installation_events",
    "signature_reservation_requests", "signature_authorizations",
)


def read_url(path: str) -> str:
    value = Path(path).read_text(encoding="utf-8").strip()
    if value.startswith("\ufeff"):
        raise RuntimeError("MTLS_DB_ADMIN_URL_BOM_UNSUPPORTED")
    parsed = urlsplit(value)
    if parsed.scheme not in {"postgres", "postgresql"} or not parsed.hostname or not parsed.path.strip("/"):
        raise RuntimeError("MTLS_DB_ADMIN_URL_INVALID")
    return value


def required_sequences(cur) -> list[tuple[str, str]]:
    """Return only sequences backing generated columns in the authorized tables."""
    cur.execute(
        """
        select distinct n.nspname, s.relname
        from pg_class t
        join pg_namespace tn on tn.oid = t.relnamespace
        join pg_attribute a on a.attrelid = t.oid
        left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
        cross join lateral pg_get_serial_sequence(
            format('%%I.%%I', tn.nspname, t.relname), a.attname
        ) as sequence_name(sequence_name)
        join pg_class s on s.oid = sequence_name::regclass
        join pg_namespace n on n.oid = s.relnamespace
        where tn.nspname = 'public'
          and t.relname = any(%s)
          and a.attnum > 0
          and not a.attisdropped
          and (a.attidentity in ('a', 'd') or pg_get_expr(d.adbin, d.adrelid) like 'nextval(%%')
        order by n.nspname, s.relname
        """,
        (list(TABLES),),
    )
    return [(schema, sequence) for schema, sequence in cur.fetchall()]


def check(conn, role: str) -> int:
    with conn.cursor() as cur:
        cur.execute("select current_user, current_database()")
        current_user, database = cur.fetchone()
        cur.execute("select 1 from pg_roles where rolname=%s", (role,))
        if cur.fetchone() is None:
            print(f"ROLE_ABSENT database={database}")
            return 0
        cur.execute("select has_schema_privilege(%s, 'public', 'USAGE')", (role,))
        schema_usage = cur.fetchone()[0]
        cur.execute("""select table_name, privilege_type from information_schema.role_table_grants
                       where grantee=%s and table_schema='public' and table_name = any(%s)
                       order by table_name, privilege_type""", (role, list(TABLES)))
        grants = cur.fetchall()
        sequences = required_sequences(cur)
        sequence_status = []
        for schema, sequence in sequences:
            cur.execute(
                "select has_sequence_privilege(%s, %s, 'USAGE'), has_sequence_privilege(%s, %s, 'SELECT')",
                (role, f"{schema}.{sequence}", role, f"{schema}.{sequence}"),
            )
            usage, select = cur.fetchone()
            sequence_status.append((schema, sequence, usage, select))
    print(f"ROLE_CHECK database={database} current_user={current_user} schema_usage={schema_usage}")
    for table, privilege in grants:
        print(f"GRANT table={table} privilege={privilege}")
    for schema, sequence, usage, select in sequence_status:
        print(f"SEQUENCE name={schema}.{sequence} usage={usage} select={select}")
    return 0


def apply(conn, role: str) -> int:
    password = getpass.getpass("Senha do papel mTLS: ")
    if not password:
        raise RuntimeError("MTLS_DB_ROLE_PASSWORD_EMPTY")
    with conn:
        with conn.cursor() as cur:
            cur.execute("select 1 from pg_roles where rolname=%s", (role,))
            exists = cur.fetchone() is not None
            if exists:
                cur.execute(
                    "select rolsuper, rolcreatedb, rolcreaterole, rolreplication from pg_roles where rolname=%s",
                    (role,),
                )
                attributes = cur.fetchone()
                if any(attributes):
                    raise RuntimeError("MTLS_DB_ROLE_EXISTING_PRIVILEGED")
                cur.execute(sql.SQL("alter role {} password %s").format(sql.Identifier(role)), (password,))
            else:
                cur.execute(
                    sql.SQL("create role {} login nosuperuser nocreatedb nocreaterole noreplication password %s").format(
                        sql.Identifier(role)
                    ),
                    (password,),
                )
            cur.execute(sql.SQL("grant usage on schema public to {}").format(sql.Identifier(role)))
            for table in TABLES:
                cur.execute(sql.SQL("grant select, insert, update on table public.{} to {}").format(sql.Identifier(table), sql.Identifier(role)))
            for schema, sequence in required_sequences(cur):
                cur.execute(
                    sql.SQL("grant usage, select on {} to {}").format(
                        sql.Identifier(schema, sequence), sql.Identifier(role)
                    )
                )
    print("MTLS_DB_ROLE_APPLY=PASS")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--admin-url-file", required=True)
    ap.add_argument("--role", default="brana_mtls_service")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    conn = psycopg2.connect(read_url(args.admin_url_file))
    try:
        return apply(conn, args.role) if args.apply else check(conn, args.role)
    finally:
        conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
