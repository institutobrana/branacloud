"""
Relatorio read-only de contas (usuarios + clinicas).

Requisitos atendidos:
- Nao altera dados (somente SELECT)
- Lista usuarios e clinicas
- Mostra vinculo usuario -> clinica
- Marca possiveis contas de teste
- Exibe contagens gerais
"""

from __future__ import annotations

import os
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from sqlalchemy import inspect, text


# Garante import de "database.py" no backend/
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import SessionLocal, engine  # noqa: E402


SEM_LOGIN_DIAS = int(os.getenv("RELATORIO_SEM_LOGIN_DIAS", "90"))
TOKENS_TESTE_EMAIL = ("test", "exemplo", "gmail", "admin")


@dataclass
class QueryInfo:
    sql: str
    created_col: str | None
    last_login_col: str | None
    setup_col: str | None
    is_admin_col: str | None
    ativo_col: str | None


def _has_table(table_name: str) -> bool:
    return inspect(engine).has_table(table_name)


def _table_columns(table_name: str) -> set[str]:
    insp = inspect(engine)
    return {str(col.get("name")) for col in insp.get_columns(table_name)}


def _first_existing(cols: set[str], candidates: list[str]) -> str | None:
    for name in candidates:
        if name in cols:
            return name
    return None


def _fmt_dt(value: Any) -> str:
    if value is None:
        return "-"
    if isinstance(value, datetime):
        return value.strftime("%Y-%m-%d %H:%M:%S")
    return str(value)


def _fmt_bool(value: Any) -> str:
    if value is None:
        return "-"
    return "Sim" if bool(value) else "Nao"


def _parse_dt(value: Any) -> datetime | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    txt = str(value).strip()
    if not txt:
        return None
    # formatos comuns
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d/%m/%Y %H:%M:%S", "%d/%m/%Y"):
        try:
            return datetime.strptime(txt, fmt)
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(txt.replace("Z", "+00:00"))
    except Exception:
        return None


def _is_possible_test_email(email: str) -> bool:
    low = (email or "").lower()
    return any(token in low for token in TOKENS_TESTE_EMAIL)


def _print_title(title: str) -> None:
    print("\n" + "=" * len(title))
    print(title)
    print("=" * len(title))


def _print_table(rows: list[dict[str, Any]], columns: list[tuple[str, str]]) -> None:
    if not rows:
        print("(sem dados)")
        return

    widths: dict[str, int] = {}
    for key, label in columns:
        width = len(label)
        for row in rows:
            width = max(width, len(str(row.get(key, ""))))
        widths[key] = width

    header = " | ".join(label.ljust(widths[key]) for key, label in columns)
    sep = "-+-".join("-" * widths[key] for key, _ in columns)
    print(header)
    print(sep)
    for row in rows:
        line = " | ".join(str(row.get(key, "")).ljust(widths[key]) for key, _ in columns)
        print(line)


def _build_users_query(cols: set[str]) -> QueryInfo:
    created_col = _first_existing(cols, ["criado_em", "created_at", "data_inclusao"])
    last_login_col = _first_existing(cols, ["ultimo_login", "last_login", "data_ultimo_login"])
    setup_col = "setup_completed" if "setup_completed" in cols else None
    is_admin_col = "is_admin" if "is_admin" in cols else None
    ativo_col = "ativo" if "ativo" in cols else None
    tipo_col = "tipo_usuario" if "tipo_usuario" in cols else None

    created_expr = f"u.{created_col}" if created_col else "NULL"
    last_login_expr = f"u.{last_login_col}" if last_login_col else "NULL"
    setup_expr = f"u.{setup_col}" if setup_col else "NULL"
    admin_expr = f"u.{is_admin_col}" if is_admin_col else "NULL"
    ativo_expr = f"u.{ativo_col}" if ativo_col else "NULL"
    tipo_expr = f"u.{tipo_col}" if tipo_col else "NULL"

    if is_admin_col and tipo_col:
        perfil_expr = (
            f"CASE WHEN u.{is_admin_col} THEN 'Admin' "
            f"ELSE COALESCE(NULLIF(u.{tipo_col}, ''), 'Usuario') END"
        )
    elif is_admin_col:
        perfil_expr = f"CASE WHEN u.{is_admin_col} THEN 'Admin' ELSE 'Usuario' END"
    elif tipo_col:
        perfil_expr = f"COALESCE(NULLIF(u.{tipo_col}, ''), 'Usuario')"
    else:
        perfil_expr = "'Usuario'"

    if created_col:
        order_clause = f"ORDER BY u.{created_col} DESC NULLS LAST, u.id DESC"
    else:
        order_clause = "ORDER BY u.id DESC"

    sql = f"""
        SELECT
            u.id,
            u.nome,
            u.email,
            {created_expr} AS criado_em,
            {setup_expr} AS setup_completed,
            {last_login_expr} AS ultimo_login,
            {perfil_expr} AS perfil,
            {admin_expr} AS is_admin,
            {ativo_expr} AS ativo,
            u.clinica_id,
            c.nome AS clinica_nome,
            c.email AS clinica_email
        FROM usuarios u
        LEFT JOIN clinicas c ON c.id = u.clinica_id
        {order_clause}
    """

    return QueryInfo(
        sql=sql,
        created_col=created_col,
        last_login_col=last_login_col,
        setup_col=setup_col,
        is_admin_col=is_admin_col,
        ativo_col=ativo_col,
    )


def _build_clinicas_query(cols: set[str]) -> tuple[str, str | None]:
    created_col = _first_existing(cols, ["criado_em", "created_at", "data_ativacao"])
    created_expr = f"c.{created_col}" if created_col else "NULL"
    if created_col:
        order_clause = f"ORDER BY c.{created_col} DESC NULLS LAST, c.id DESC"
    else:
        order_clause = "ORDER BY c.id DESC"

    sql = f"""
        SELECT
            c.id,
            c.nome,
            c.email,
            {created_expr} AS criado_em
        FROM clinicas c
        {order_clause}
    """
    return sql, created_col


def main() -> None:
    if not _has_table("usuarios"):
        raise RuntimeError("Tabela 'usuarios' nao encontrada no banco atual.")
    if not _has_table("clinicas"):
        raise RuntimeError("Tabela 'clinicas' nao encontrada no banco atual.")

    users_cols = _table_columns("usuarios")
    clinicas_cols = _table_columns("clinicas")

    users_query = _build_users_query(users_cols)
    clinicas_sql, clinicas_created_col = _build_clinicas_query(clinicas_cols)

    with SessionLocal() as db:
        # Read-only defensivo (PostgreSQL). Se nao suportar, segue somente com SELECT.
        try:
            db.execute(text("SET TRANSACTION READ ONLY"))
        except Exception:
            pass

        users_rows = [dict(row._mapping) for row in db.execute(text(users_query.sql)).fetchall()]
        clinicas_rows = [dict(row._mapping) for row in db.execute(text(clinicas_sql)).fetchall()]

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    cutoff = now - timedelta(days=SEM_LOGIN_DIAS)

    rel_users: list[dict[str, Any]] = []
    count_setup_false = 0
    count_sem_login_recente = 0
    sem_login_recente_disponivel = users_query.last_login_col is not None

    for row in users_rows:
        email = str(row.get("email") or "")
        setup_completed = row.get("setup_completed")
        ultimo_login_raw = row.get("ultimo_login")
        ultimo_login_dt = _parse_dt(ultimo_login_raw)

        possivel_teste_email = _is_possible_test_email(email)
        if sem_login_recente_disponivel:
            sem_login_recente = (ultimo_login_dt is None) or (ultimo_login_dt < cutoff)
        else:
            sem_login_recente = None

        if setup_completed is False:
            count_setup_false += 1
        if sem_login_recente is True:
            count_sem_login_recente += 1

        sem_atividade = (
            (setup_completed is False)
            or (sem_login_recente is True)
            or (row.get("ativo") is False)
        )

        rel_users.append(
            {
                "id": row.get("id"),
                "nome": row.get("nome") or "-",
                "email": email or "-",
                "criado_em": _fmt_dt(row.get("criado_em")),
                "setup_completed": _fmt_bool(setup_completed),
                "ultimo_login": _fmt_dt(ultimo_login_raw),
                "perfil": row.get("perfil") or "-",
                "clinica_id": row.get("clinica_id") if row.get("clinica_id") is not None else "-",
                "clinica_nome": row.get("clinica_nome") or "-",
                "teste_email": "Sim" if possivel_teste_email else "Nao",
                "sem_atividade": "Sim" if sem_atividade else "Nao",
                "sem_login_recente": (
                    "Sim" if sem_login_recente is True else ("Nao" if sem_login_recente is False else "N/D")
                ),
            }
        )

    rel_clinicas = [
        {
            "id": row.get("id"),
            "nome": row.get("nome") or "-",
            "email": row.get("email") or "-",
            "criado_em": _fmt_dt(row.get("criado_em")),
        }
        for row in clinicas_rows
    ]

    rel_vinculos = [
        {
            "usuario_id": row.get("id"),
            "usuario_nome": row.get("nome") or "-",
            "usuario_email": row.get("email") or "-",
            "clinica_id": row.get("clinica_id") if row.get("clinica_id") is not None else "-",
            "clinica_nome": row.get("clinica_nome") or "-",
            "clinica_email": row.get("clinica_email") or "-",
        }
        for row in users_rows
    ]

    _print_title("RELATORIO DE CONTAS (READ-ONLY)")
    print(f"Tabela usuarios: {len(users_rows)} registro(s)")
    print(f"Tabela clinicas: {len(clinicas_rows)} registro(s)")
    print(f"Ordenacao usuarios por: {users_query.created_col or 'id'} (desc)")
    print(f"Ordenacao clinicas por: {clinicas_created_col or 'id'} (desc)")

    _print_title("CONTAGEM GERAL")
    print(f"Total de usuarios: {len(users_rows)}")
    print(f"Total de clinicas: {len(clinicas_rows)}")
    if users_query.setup_col:
        print(f"Usuarios com setup_completed = False: {count_setup_false}")
    else:
        print("Usuarios com setup_completed = False: N/D (coluna ausente)")
    if sem_login_recente_disponivel:
        print(
            f"Usuarios sem login recente (>= {SEM_LOGIN_DIAS} dias ou sem login): "
            f"{count_sem_login_recente}"
        )
    else:
        print("Usuarios sem login recente: N/D (coluna de ultimo login ausente)")

    _print_title("CLINICAS")
    _print_table(
        rel_clinicas,
        [
            ("id", "id"),
            ("nome", "nome"),
            ("email", "email"),
            ("criado_em", "criado_em"),
        ],
    )

    _print_title("USUARIOS")
    _print_table(
        rel_users,
        [
            ("id", "id"),
            ("nome", "nome"),
            ("email", "email"),
            ("criado_em", "criado_em"),
            ("setup_completed", "setup_completed"),
            ("ultimo_login", "ultimo_login"),
            ("perfil", "perfil"),
            ("clinica_id", "clinica_id"),
            ("clinica_nome", "clinica_nome"),
            ("teste_email", "possivel_teste_email"),
            ("sem_login_recente", f"sem_login_{SEM_LOGIN_DIAS}d"),
            ("sem_atividade", "sem_atividade"),
        ],
    )

    _print_title("VINCULOS USUARIO -> CLINICA")
    _print_table(
        rel_vinculos,
        [
            ("usuario_id", "usuario_id"),
            ("usuario_nome", "usuario_nome"),
            ("usuario_email", "usuario_email"),
            ("clinica_id", "clinica_id"),
            ("clinica_nome", "clinica_nome"),
            ("clinica_email", "clinica_email"),
        ],
    )


if __name__ == "__main__":
    main()

