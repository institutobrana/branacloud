"""
Auditoria de nova conta (READ-ONLY).

Objetivo:
- Analisar uma conta por email e listar tudo que foi gerado no banco
  para a(s) clinica(s) correspondente(s), sem alterar dados.

Uso:
    python backend/scripts/auditoria_nova_conta.py --email teste@email.com
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Any

from sqlalchemy import inspect, text


# Permite importar database.py em backend/
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import SessionLocal, engine  # noqa: E402


ALTO_VOLUME_LIMITE = 5000


def qident(name: str, dialect_name: str) -> str:
    if dialect_name.startswith("mssql"):
        return f"[{name}]"
    return f'"{name}"'


def sql_int_list(values: list[int]) -> str:
    return ", ".join(str(int(v)) for v in values)


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
        w = len(label)
        for row in rows:
            w = max(w, len(str(row.get(key, ""))))
        widths[key] = w

    header = " | ".join(label.ljust(widths[key]) for key, label in columns)
    sep = "-+-".join("-" * widths[key] for key, _ in columns)
    print(header)
    print(sep)
    for row in rows:
        line = " | ".join(str(row.get(key, "")).ljust(widths[key]) for key, _ in columns)
        print(line)


def _users_query(clinica_ids: list[int]) -> str:
    ids_sql = sql_int_list(clinica_ids)
    return f"""
        SELECT
            id,
            nome,
            email,
            tipo_usuario,
            is_admin
        FROM usuarios
        WHERE clinica_id IN ({ids_sql})
        ORDER BY id
    """


def _clinicas_query() -> str:
    return """
        SELECT id, nome, email
        FROM clinicas
        WHERE LOWER(email) = LOWER(:email)
        ORDER BY id
    """


def _contar_tabelas_relacionadas(clinica_ids: list[int], user_ids: list[int]) -> list[dict[str, Any]]:
    insp = inspect(engine)
    dialect = engine.dialect.name
    clin_ids_sql = sql_int_list(clinica_ids) if clinica_ids else ""
    user_ids_sql = sql_int_list(user_ids) if user_ids else ""

    saida: list[dict[str, Any]] = []

    for table in sorted(insp.get_table_names()):
        if table == "alembic_version":
            continue

        cols = {str(c.get("name")) for c in insp.get_columns(table)}
        has_clinica = "clinica_id" in cols
        has_usuario = "usuario_id" in cols

        if not has_clinica and not has_usuario:
            continue

        conds: list[str] = []
        if has_clinica and clinica_ids:
            conds.append(f"{qident('clinica_id', dialect)} IN ({clin_ids_sql})")
        if has_usuario and user_ids:
            conds.append(f"{qident('usuario_id', dialect)} IN ({user_ids_sql})")

        if not conds:
            count = 0
            err = None
        else:
            where_sql = " OR ".join(f"({c})" for c in conds)
            sql = f"SELECT COUNT(1) FROM {qident(table, dialect)} WHERE {where_sql}"
            try:
                with SessionLocal() as db:
                    count = int(db.execute(text(sql)).scalar() or 0)
                err = None
            except Exception as exc:
                count = 0
                err = str(exc)

        saida.append(
            {
                "tabela": table,
                "quantidade": count,
                "usa_clinica_id": "Sim" if has_clinica else "Nao",
                "usa_usuario_id": "Sim" if has_usuario else "Nao",
                "erro": err,
            }
        )

    saida.sort(key=lambda x: (-int(x.get("quantidade") or 0), str(x.get("tabela") or "")))
    return saida


def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Auditoria de conta (read-only) por email.")
    p.add_argument("--email", required=True, help="Email da conta/clinica para auditoria.")
    return p.parse_args()


def main() -> None:
    args = _parse_args()
    email = str(args.email or "").strip()
    if not email:
        raise RuntimeError("Informe um email valido em --email.")

    with SessionLocal() as db:
        # Read-only defensivo (quando suportado).
        try:
            db.execute(text("SET TRANSACTION READ ONLY"))
        except Exception:
            pass

        clinicas = [dict(r) for r in db.execute(text(_clinicas_query()), {"email": email}).mappings().all()]

    _print_title("AUDITORIA DE CONTA (READ-ONLY)")
    print(f"Email analisado: {email}")

    if not clinicas:
        print("\nNenhuma clinica encontrada com este email na tabela clinicas.")
        print("\nComando de execucao:")
        print(f"python backend/scripts/auditoria_nova_conta.py --email {email}")
        return

    clinica_ids = [int(c["id"]) for c in clinicas if c.get("id") is not None]

    with SessionLocal() as db:
        users = [dict(r) for r in db.execute(text(_users_query(clinica_ids))).mappings().all()]

    for u in users:
        perfil = str(u.get("tipo_usuario") or "").strip() or "Usuario"
        if bool(u.get("is_admin")):
            perfil = "Admin"
        u["perfil"] = perfil

    user_ids = [int(u["id"]) for u in users if u.get("id") is not None]
    tabelas = _contar_tabelas_relacionadas(clinica_ids, user_ids)

    _print_title("CLINICA")
    _print_table(clinicas, [("id", "id"), ("nome", "nome"), ("email", "email")])

    _print_title("USUARIOS")
    _print_table(users, [("id", "id"), ("nome", "nome"), ("email", "email"), ("perfil", "perfil")])

    _print_title("TABELAS RELACIONADAS")
    _print_table(tabelas, [("tabela", "Nome da tabela"), ("quantidade", "Quantidade de registros")])

    with_data = [t for t in tabelas if int(t.get("quantidade") or 0) > 0]
    empty = [t for t in tabelas if int(t.get("quantidade") or 0) == 0]
    high = [t for t in tabelas if int(t.get("quantidade") or 0) > ALTO_VOLUME_LIMITE]
    errors = [t for t in tabelas if t.get("erro")]

    _print_title("ANALISE DE POSSIVEIS PROBLEMAS")
    print("[OK] Tabelas com dados (esperadas):")
    if with_data:
        for t in with_data:
            print(f"- {t['tabela']}: {t['quantidade']}")
    else:
        print("- (nenhuma)")

    print("\n[ATENCAO] Tabelas vazias (talvez devam ter seed):")
    if empty:
        for t in empty:
            print(f"- {t['tabela']}")
    else:
        print("- (nenhuma)")

    print(f"\n[ALTO VOLUME] Tabelas com volume alto (> {ALTO_VOLUME_LIMITE}):")
    if high:
        for t in high:
            print(f"- {t['tabela']}: {t['quantidade']}")
    else:
        print("- (nenhuma)")

    if errors:
        print("\nErros durante leitura de algumas tabelas:")
        for t in errors:
            print(f"- {t['tabela']}: {t['erro']}")

    total_registros = sum(int(t.get("quantidade") or 0) for t in tabelas)
    inconsistencias = len(empty) + len(high) + len(errors)

    _print_title("RESUMO")
    print(f"- total de tabelas com dados: {len(with_data)}")
    print(f"- total de registros: {total_registros}")
    print(f"- possiveis inconsistencias detectadas: {inconsistencias}")

    print("\nComando de execucao:")
    print(f"python backend/scripts/auditoria_nova_conta.py --email {email}")


if __name__ == "__main__":
    main()
