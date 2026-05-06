"""
Remove uma conta (clinica + dados vinculados) com seguranca.

IMPORTANTE
- Script NAO executa automaticamente: so remove apos confirmacao explicita (y/n).
- Usa transacao unica: rollback automatico em caso de erro.
- Remove apenas dados vinculados a(s) clinica(s) associada(s) ao e-mail informado.

Uso:
    python backend/scripts/remover_conta_teste.py --email institutobrana@gmail.com
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine


# Garante import de "database.py" no backend/
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import engine  # noqa: E402


SKIP_TABLES = {"alembic_version", "clinicas", "usuarios"}


@dataclass
class TableOp:
    table: str
    conditions: list[str] = field(default_factory=list)
    count: int = 0
    phase: str = "dependentes"


def qident(name: str, dialect_name: str) -> str:
    if dialect_name.startswith("mssql"):
        return f"[{name}]"
    return f'"{name}"'


def sql_int_list(values: list[int]) -> str:
    return ", ".join(str(int(v)) for v in values)


def sql_str_list(values: list[str]) -> str:
    safe = []
    for v in values:
        safe.append("'" + str(v).replace("'", "''") + "'")
    return ", ".join(safe)


def table_columns(insp: Any, table: str) -> set[str]:
    return {str(col.get("name")) for col in insp.get_columns(table)}


def fetch_target_clinicas(conn: Any, email: str) -> list[dict[str, Any]]:
    rows = conn.execute(
        text(
            """
            SELECT c.id, c.nome, c.email, c.criado_em
              FROM clinicas c
             WHERE LOWER(c.email) = LOWER(:email)
            """
        ),
        {"email": email},
    ).mappings().all()

    # Fallback: clinica obtida por usuario com este e-mail
    if not rows:
        rows = conn.execute(
            text(
                """
                SELECT DISTINCT c.id, c.nome, c.email, c.criado_em
                  FROM clinicas c
                  JOIN usuarios u ON u.clinica_id = c.id
                 WHERE LOWER(u.email) = LOWER(:email)
                """
            ),
            {"email": email},
        ).mappings().all()

    return [dict(r) for r in rows]


def fetch_users_by_clinica(conn: Any, clinica_ids: list[int]) -> list[dict[str, Any]]:
    if not clinica_ids:
        return []
    ids_sql = sql_int_list(clinica_ids)
    rows = conn.execute(
        text(
            f"""
            SELECT id, nome, email, clinica_id, is_admin, tipo_usuario, ativo
              FROM usuarios
             WHERE clinica_id IN ({ids_sql})
             ORDER BY id
            """
        )
    ).mappings().all()
    return [dict(r) for r in rows]


def _add_condition(op: TableOp, cond_sql: str) -> None:
    if cond_sql not in op.conditions:
        op.conditions.append(cond_sql)


def collect_table_ops(
    conn: Any,
    db_engine: Engine,
    clinica_ids: list[int],
    user_ids: list[int],
) -> dict[str, TableOp]:
    insp = inspect(db_engine)
    dialect = db_engine.dialect.name
    clin_ids_sql = sql_int_list(clinica_ids)
    user_ids_sql = sql_int_list(user_ids) if user_ids else ""
    ops: dict[str, TableOp] = {}

    for table in insp.get_table_names():
        if table in SKIP_TABLES:
            continue

        cols = table_columns(insp, table)
        op = TableOp(table=table, phase="dependentes")
        qt = qident(table, dialect)

        # Regra principal: clinica_id direto.
        if "clinica_id" in cols:
            _add_condition(op, f"{qident('clinica_id', dialect)} IN ({clin_ids_sql})")

        # FK explicita para clinicas / usuarios.
        for fk in insp.get_foreign_keys(table):
            referred = str(fk.get("referred_table") or "")
            constrained = [str(c) for c in (fk.get("constrained_columns") or [])]
            if not constrained:
                continue

            if referred == "clinicas":
                for col in constrained:
                    if col in cols:
                        _add_condition(op, f"{qident(col, dialect)} IN ({clin_ids_sql})")
            elif referred == "usuarios" and user_ids:
                for col in constrained:
                    if col in cols:
                        _add_condition(op, f"{qident(col, dialect)} IN ({user_ids_sql})")

        # Limpeza auxiliar por e-mail de usuario/clinica para codigos temporarios.
        if table == "email_codes" and "email" in cols:
            op.phase = "auxiliares_email"
            # placeholder; condicao sera preenchida no caller para evitar dependencia circular.

        if not op.conditions and op.phase != "auxiliares_email":
            continue

        ops[table] = op

    # Conta linhas afetadas em cada tabela.
    for op in ops.values():
        if not op.conditions:
            continue
        where_sql = " OR ".join(f"({c})" for c in op.conditions)
        qt = qident(op.table, dialect)
        op.count = int(
            conn.execute(text(f"SELECT COUNT(1) FROM {qt} WHERE {where_sql}")).scalar() or 0
        )

    return ops


def topo_delete_order(db_engine: Engine, candidate_tables: set[str]) -> list[str]:
    insp = inspect(db_engine)
    # Grafo: parent -> children (filhas que referenciam a tabela parent)
    # Ordem de exclusao correta: children antes de parent.
    children_of: dict[str, set[str]] = {t: set() for t in candidate_tables}
    for child in candidate_tables:
        for fk in insp.get_foreign_keys(child):
            parent = str(fk.get("referred_table") or "")
            if parent in candidate_tables and parent != child:
                children_of[parent].add(child)

    order: list[str] = []
    state: dict[str, int] = {}  # 0/None=nao visitado, 1=visitando, 2=finalizado
    has_cycle = False

    def dfs(node: str) -> None:
        nonlocal has_cycle
        st = state.get(node, 0)
        if st == 1:
            has_cycle = True
            return
        if st == 2:
            return
        state[node] = 1
        for child in sorted(children_of.get(node, set())):
            dfs(child)
        state[node] = 2
        # Pos-ordem: filhas entram antes do pai.
        if node not in order:
            order.append(node)

    for table in sorted(candidate_tables):
        dfs(table)

    # Fallback deterministico se houver ciclo em FKs.
    if has_cycle:
        for table in sorted(candidate_tables):
            if table not in order:
                order.append(table)

    return order


def build_email_codes_condition(
    db_engine: Engine, emails: list[str], ops: dict[str, TableOp], conn: Any
) -> None:
    if "email_codes" not in ops:
        return
    if not emails:
        return
    dialect = db_engine.dialect.name
    email_sql = sql_str_list(sorted(set(emails)))
    cond = f"{qident('email', dialect)} IN ({email_sql})"
    op = ops["email_codes"]
    op.conditions = [cond]
    op.count = int(
        conn.execute(
            text(f"SELECT COUNT(1) FROM {qident('email_codes', dialect)} WHERE {cond}")
        ).scalar()
        or 0
    )


def print_plan(
    email: str,
    clinicas: list[dict[str, Any]],
    users: list[dict[str, Any]],
    ops: dict[str, TableOp],
    user_count: int,
    clinica_count: int,
) -> None:
    print("\n========================================")
    print("PLANO DE EXCLUSAO (AINDA NAO EXECUTADO)")
    print("========================================")
    print(f"E-mail alvo: {email}")

    print("\nClinica(s) alvo:")
    for c in clinicas:
        print(f"- id={c.get('id')} | nome={c.get('nome')} | email={c.get('email')}")

    print("\nUsuario(s) vinculado(s):")
    if not users:
        print("- (nenhum)")
    for u in users:
        print(
            f"- id={u.get('id')} | nome={u.get('nome')} | "
            f"email={u.get('email')} | clinica_id={u.get('clinica_id')}"
        )

    print("\nDependencias por tabela (clinica_id/usuario_id/FK):")
    total_deps = 0
    for table in sorted(ops):
        op = ops[table]
        if op.count <= 0:
            continue
        total_deps += op.count
        cond_preview = " OR ".join(op.conditions)
        if len(cond_preview) > 140:
            cond_preview = cond_preview[:137] + "..."
        print(f"- {op.table}: {op.count} registro(s) | condicao: {cond_preview}")

    print("\nResumo total a remover:")
    print(f"- Dependencias: {total_deps}")
    print(f"- Usuarios: {user_count}")
    print(f"- Clinicas: {clinica_count}")
    print(f"- Total estimado: {total_deps + user_count + clinica_count}")


def execute_delete(
    conn: Any,
    db_engine: Engine,
    clinica_ids: list[int],
    user_ids: list[int],
    ops: dict[str, TableOp],
) -> None:
    dialect = db_engine.dialect.name
    candidate_tables = {t for t, op in ops.items() if op.count > 0}
    delete_order = topo_delete_order(db_engine, candidate_tables)

    for table in delete_order:
        op = ops[table]
        if op.count <= 0 or not op.conditions:
            continue
        where_sql = " OR ".join(f"({c})" for c in op.conditions)
        sql = f"DELETE FROM {qident(table, dialect)} WHERE {where_sql}"
        conn.execute(text(sql))

    clin_ids_sql = sql_int_list(clinica_ids)
    conn.execute(text(f"DELETE FROM {qident('usuarios', dialect)} WHERE clinica_id IN ({clin_ids_sql})"))
    conn.execute(text(f"DELETE FROM {qident('clinicas', dialect)} WHERE id IN ({clin_ids_sql})"))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Remove conta de teste (clinica + usuarios + dependencias) com confirmacao."
    )
    parser.add_argument(
        "--email",
        required=True,
        help="Email associado a conta/clinica que sera removida.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    email = args.email.strip()
    if not email:
        raise RuntimeError("Informe um email valido em --email.")

    with engine.connect() as conn:
        clinicas = fetch_target_clinicas(conn, email)
        if not clinicas:
            print(f"Nenhuma clinica encontrada para o email: {email}")
            return

        clinica_ids = [int(c["id"]) for c in clinicas if c.get("id") is not None]
        users = fetch_users_by_clinica(conn, clinica_ids)
        user_ids = [int(u["id"]) for u in users if u.get("id") is not None]

        ops = collect_table_ops(conn, engine, clinica_ids, user_ids)

        emails_alvo = {email.lower()}
        for c in clinicas:
            ce = str(c.get("email") or "").strip().lower()
            if ce:
                emails_alvo.add(ce)
        for u in users:
            ue = str(u.get("email") or "").strip().lower()
            if ue:
                emails_alvo.add(ue)
        build_email_codes_condition(engine, sorted(emails_alvo), ops, conn)

        print_plan(
            email=email,
            clinicas=clinicas,
            users=users,
            ops=ops,
            user_count=len(users),
            clinica_count=len(clinicas),
        )

    print("\nATENCAO: esta acao e IRREVERSIVEL para os dados removidos.")
    confirm = input("Digite 'y' para confirmar a exclusao: ").strip().lower()
    if confirm != "y":
        print("Operacao cancelada. Nenhum dado foi alterado.")
        return

    try:
        with engine.begin() as conn:
            # Confirmacao final: garante que ainda existe a clinica alvo no momento da execucao.
            clinicas = fetch_target_clinicas(conn, email)
            if not clinicas:
                raise RuntimeError("Clinica alvo nao encontrada no momento da execucao.")

            clinica_ids = [int(c["id"]) for c in clinicas if c.get("id") is not None]
            users = fetch_users_by_clinica(conn, clinica_ids)
            user_ids = [int(u["id"]) for u in users if u.get("id") is not None]

            ops = collect_table_ops(conn, engine, clinica_ids, user_ids)
            emails_alvo = {email.lower()}
            for c in clinicas:
                ce = str(c.get("email") or "").strip().lower()
                if ce:
                    emails_alvo.add(ce)
            for u in users:
                ue = str(u.get("email") or "").strip().lower()
                if ue:
                    emails_alvo.add(ue)
            build_email_codes_condition(engine, sorted(emails_alvo), ops, conn)

            execute_delete(conn, engine, clinica_ids, user_ids, ops)

        print("Exclusao concluida com sucesso (COMMIT realizado).")
    except Exception as exc:
        print(f"Erro durante exclusao: {exc}")
        print("Transacao revertida (ROLLBACK).")
        raise


if __name__ == "__main__":
    main()
