from __future__ import annotations

import argparse
import json
import os
from datetime import datetime
from pathlib import Path

from sqlalchemy import create_engine, text


SUSPICIOUS_LIKE = ["%Ã%", "%Â%", "%ï¿½%", "%�%"]


def _load_database_url(root: Path) -> str | None:
    env_url = os.getenv("DATABASE_URL", "").strip()
    if env_url:
        return env_url
    env_path = root / "backend" / ".env"
    if not env_path.exists():
        return None
    for raw in env_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        if key.strip() == "DATABASE_URL":
            return value.strip().strip("'").strip('"')
    return None


def _quote_ident(name: str) -> str:
    return '"' + name.replace('"', '""') + '"'


def _condition_sql(col_ident: str) -> str:
    return (
        f"{col_ident} LIKE '%Ã%' OR "
        f"{col_ident} LIKE '%Â%' OR "
        f"{col_ident} LIKE '%ï¿½%' OR "
        f"{col_ident} LIKE '%�%'"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera SQL de correção de encoding (sem executar).")
    parser.add_argument(
        "--root",
        default=str(Path(__file__).resolve().parents[2]),
        help="Raiz do projeto saas.",
    )
    args = parser.parse_args()

    root = Path(args.root).resolve()
    db_url = _load_database_url(root)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    sql_dir = root / "backend" / "scripts" / "sql"
    sql_dir.mkdir(parents=True, exist_ok=True)
    reports_dir = root / "backend" / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)

    sql_path = sql_dir / f"correcao_encoding_{timestamp}.sql"
    report_path = reports_dir / f"encoding_db_report_{timestamp}.json"

    report = {
        "generated_at": datetime.now().isoformat(),
        "database_url_present": bool(db_url),
        "server_encoding": None,
        "database_name": None,
        "affected_columns": [],
        "sql_path": str(sql_path),
        "notes": [],
    }

    if not db_url:
        report["notes"].append("DATABASE_URL não encontrado no ambiente nem em backend/.env.")
        sql_path.write_text(
            "-- DATABASE_URL não encontrado. Ajuste variável e rode novamente.\n",
            encoding="utf-8",
        )
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print("[encoding-sql] DATABASE_URL não encontrado.")
        print("[encoding-sql] relatório:", report_path)
        return

    engine = create_engine(db_url, pool_pre_ping=True)
    affected: list[dict] = []

    try:
        with engine.connect() as conn:
            report["server_encoding"] = conn.execute(text("SHOW SERVER_ENCODING")).scalar()
            report["database_name"] = conn.execute(text("SELECT current_database()")).scalar()
            cols = conn.execute(
                text(
                    """
                    SELECT table_schema, table_name, column_name, data_type
                    FROM information_schema.columns
                    WHERE table_schema = 'public'
                      AND data_type IN ('text', 'character varying', 'character')
                    ORDER BY table_name, ordinal_position
                    """
                )
            ).fetchall()

            for row in cols:
                schema = row.table_schema
                table = row.table_name
                column = row.column_name
                table_ident = f"{_quote_ident(schema)}.{_quote_ident(table)}"
                col_ident = _quote_ident(column)
                sql_count = text(
                    f"""
                    SELECT COUNT(*) AS c
                    FROM {table_ident}
                    WHERE {col_ident} IS NOT NULL
                      AND ({_condition_sql(col_ident)})
                    """
                )
                count = int(conn.execute(sql_count).scalar() or 0)
                if count > 0:
                    affected.append(
                        {
                            "schema": schema,
                            "table": table,
                            "column": column,
                            "rows_suspeitas": count,
                        }
                    )
    except Exception as exc:
        report["notes"].append(f"Falha ao consultar banco: {exc}")
        sql_path.write_text(
            "-- Falha ao consultar banco.\n-- Ajuste conexão e rode novamente.\n",
            encoding="utf-8",
        )
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print("[encoding-sql] falha ao consultar banco:", exc)
        print("[encoding-sql] relatório:", report_path)
        return
    finally:
        engine.dispose()

    report["affected_columns"] = affected

    lines: list[str] = []
    lines.append("-- SQL gerado automaticamente para correção de encoding mojibake")
    lines.append("-- EXECUÇÃO MANUAL: revisar antes de aplicar em produção")
    lines.append(f"-- Gerado em: {datetime.now().isoformat()}")
    lines.append(f"-- Server encoding: {report['server_encoding']}")
    lines.append("")
    lines.append("BEGIN;")
    lines.append("")

    if not affected:
        lines.append("-- Nenhuma coluna suspeita encontrada com padrões Ã/Â/ï¿½/�.")
    else:
        for item in affected:
            table_ident = f"{_quote_ident(item['schema'])}.{_quote_ident(item['table'])}"
            col_ident = _quote_ident(item["column"])
            lines.append(
                f"-- {item['schema']}.{item['table']}.{item['column']} | linhas suspeitas: {item['rows_suspeitas']}"
            )
            lines.append(
                f"UPDATE {table_ident}\n"
                f"SET {col_ident} = convert_from(convert_to({col_ident}, 'WIN1252'), 'UTF8')\n"
                f"WHERE {col_ident} IS NOT NULL\n"
                f"  AND ({_condition_sql(col_ident)});"
            )
            lines.append("")

    lines.append("COMMIT;")
    lines.append("")
    lines.append("-- Pós-validação (manual):")
    lines.append("-- SELECT COUNT(*) FROM <tabela> WHERE <coluna> LIKE '%Ã%' OR <coluna> LIKE '%Â%';")

    sql_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print("[encoding-sql] server_encoding:", report["server_encoding"])
    print("[encoding-sql] colunas afetadas:", len(affected))
    print("[encoding-sql] SQL:", sql_path)
    print("[encoding-sql] relatório:", report_path)


if __name__ == "__main__":
    main()

