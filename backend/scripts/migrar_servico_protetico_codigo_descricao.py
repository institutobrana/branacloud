from __future__ import annotations

import argparse
import os
from collections import Counter

from sqlalchemy import create_engine, inspect, text


INDEX_NAME = "uq_servico_protetico_clinica_protetico_codigo"
TABLE_NAME = "servico_protetico"


def _clean_text(value) -> str:
    return " ".join(str(value or "").replace("\x00", "").strip().split())


def _column_exists(conn, table_name: str, column_name: str) -> bool:
    inspector = inspect(conn)
    return any(column["name"] == column_name for column in inspector.get_columns(table_name))


def _index_exists(conn, index_name: str) -> bool:
    inspector = inspect(conn)
    return any(index["name"] == index_name for index in inspector.get_indexes(TABLE_NAME))


def _ensure_column(conn, column_name: str, ddl: str) -> None:
    if _column_exists(conn, TABLE_NAME, column_name):
        return
    conn.execute(text(f"ALTER TABLE {TABLE_NAME} ADD COLUMN {ddl}"))


def _fetch_rows(conn) -> list[dict]:
    rows = conn.execute(
        text(
            f"""
            SELECT id, clinica_id, protetico_id, codigo, descricao
            FROM {TABLE_NAME}
            ORDER BY id
            """
        )
    ).mappings().all()
    return [dict(row) for row in rows]


def _normalize_row_code(row: dict) -> str | None:
    raw = _clean_text(row.get("codigo"))
    if raw:
        return raw
    return str(int(row["id"]))


def _find_duplicate_codes(rows: list[dict]) -> list[tuple[int, int, str, int]]:
    counts: Counter[tuple[int, int, str]] = Counter()
    for row in rows:
        codigo = _normalize_row_code(row)
        if not codigo:
            continue
        key = (int(row["clinica_id"]), int(row["protetico_id"]), codigo)
        counts[key] += 1
    return [
        (clinica_id, protetico_id, codigo, count)
        for (clinica_id, protetico_id, codigo), count in counts.items()
        if count > 1
    ]


def upgrade(conn) -> dict:
    _ensure_column(conn, "codigo", "codigo VARCHAR(30)")
    _ensure_column(conn, "descricao", "descricao TEXT")

    rows = _fetch_rows(conn)
    duplicates = _find_duplicate_codes(rows)
    if duplicates:
        raise RuntimeError(
            "Duplicidade encontrada ao preparar backfill de codigo: "
            + ", ".join(
                f"clinica={clinica_id} protetico={protetico_id} codigo={codigo} ({count})"
                for clinica_id, protetico_id, codigo, count in duplicates
            )
        )

    to_update = [
        row
        for row in rows
        if _clean_text(row.get("codigo")) == ""
    ]
    for row in to_update:
        conn.execute(
            text(
                f"UPDATE {TABLE_NAME} SET codigo = :codigo WHERE id = :id"
            ),
            {"codigo": str(int(row["id"])), "id": int(row["id"])},
        )

    if not _index_exists(conn, INDEX_NAME):
        conn.execute(
            text(
                f"CREATE UNIQUE INDEX {INDEX_NAME} ON {TABLE_NAME} (clinica_id, protetico_id, codigo)"
            )
        )

    return {
        "columns_added": ["codigo", "descricao"],
        "backfill_rows": len(to_update),
        "duplicates_checked": len(duplicates) == 0,
        "index_created": True,
    }


def downgrade(conn) -> dict:
    if _index_exists(conn, INDEX_NAME):
        conn.execute(text(f"DROP INDEX {INDEX_NAME}"))

    dialect = conn.dialect.name
    if dialect == "sqlite":
        raise RuntimeError("Downgrade manual nao suportado automaticamente em SQLite.")

    if _column_exists(conn, TABLE_NAME, "descricao"):
        conn.execute(text(f"ALTER TABLE {TABLE_NAME} DROP COLUMN descricao"))
    if _column_exists(conn, TABLE_NAME, "codigo"):
        conn.execute(text(f"ALTER TABLE {TABLE_NAME} DROP COLUMN codigo"))

    return {
        "columns_removed": ["descricao", "codigo"],
        "index_removed": True,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Aplica migracao aditiva em servico_protetico.")
    parser.add_argument("--database-url", default=os.getenv("DATABASE_URL", ""))
    parser.add_argument("--downgrade", action="store_true")
    args = parser.parse_args()

    if not args.database_url:
        raise RuntimeError("DATABASE_URL nao definido.")

    engine = create_engine(args.database_url)
    with engine.begin() as conn:
        result = downgrade(conn) if args.downgrade else upgrade(conn)
        print(result)


if __name__ == "__main__":
    main()
