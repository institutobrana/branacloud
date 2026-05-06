"""
Mapa completo de conta modelo para geracao de seed (READ-ONLY).

Uso:
    python backend/scripts/mapa_conta_modelo.py --email gleissontel@gmail.com
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Any

from sqlalchemy import inspect, text


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import SessionLocal, engine  # noqa: E402


HIGH_VOLUME_LIMIT = 5000

CLASS_ESSENCIAL = "ESSENCIAL"
CLASS_OPERACIONAL = "OPERACIONAL"
CLASS_CONFIG = "CONFIGURACAO"


CONFIG_TABLES = {
    "procedimento",
    "procedimento_generico",
    "procedimento_tabela",
    "simbolo_grafico_catalogo",
    "categoria_financeira",
    "grupo_financeiro",
    "item_auxiliar",
    "material",
    "lista_material",
    "convenio_odonto",
    "plano_odonto",
    "doenca_cid",
    "indice_financeiro",
    "anamnese_questionarios",
    "anamnese_perguntas",
    "prestador_agenda_config",
    "modelo_etiqueta",
    "conta_corrente_alias",
}

ESSENTIAL_TABLES = {
    "usuarios",
    "prestadores_odonto",
    "prestador_odonto",
    "usuario_permissoes",
    "usuario_funcao",
    "usuario_modulo",
    "usuario_perfil",
    "access_profiles",
}

OPERACIONAL_TABLES = {
    "agenda_legado",
    "agendamento",
    "agendamentos",
    "lancamentos",
    "lancamento",
    "caixa_movimento",
    "caixa_movimentos",
    "log_eventos",
    "audit_log",
    "tokens",
    "refresh_tokens",
    "sessions",
    "sessoes",
}

OPER_KEYWORDS = (
    "agenda",
    "agendamento",
    "lanc",
    "pag",
    "receb",
    "caixa",
    "histor",
    "audit",
    "log",
    "token",
    "sess",
    "notific",
    "aviso",
    "mensag",
    "email_queue",
    "whatsapp",
)

CONFIG_KEYWORDS = (
    "proced",
    "simbolo",
    "categoria",
    "grupo_",
    "item_aux",
    "material",
    "lista_",
    "convenio",
    "plano_",
    "indice",
    "auxiliar",
    "config",
    "tipo_",
    "cid",
    "anamnese_question",
    "anamnese_perg",
    "modelo",
)

SENSITIVE_KEYWORDS = (
    "usuario",
    "senha",
    "token",
    "paciente",
    "prontuario",
    "agenda",
    "agendamento",
    "lanc",
    "finance",
    "pag",
    "receb",
)


def _title(text_: str) -> None:
    print("\n" + "=" * len(text_))
    print(text_)
    print("=" * len(text_))


def _print_table(rows: list[dict[str, Any]], cols: list[tuple[str, str]]) -> None:
    if not rows:
        print("(sem dados)")
        return
    widths: dict[str, int] = {}
    for key, label in cols:
        widths[key] = max(len(label), *(len(str(r.get(key, ""))) for r in rows))
    header = " | ".join(label.ljust(widths[key]) for key, label in cols)
    sep = "-+-".join("-" * widths[key] for key, _ in cols)
    print(header)
    print(sep)
    for row in rows:
        print(" | ".join(str(row.get(key, "")).ljust(widths[key]) for key, _ in cols))


def _qident(name: str) -> str:
    if engine.dialect.name.startswith("mssql"):
        return f"[{name}]"
    return f'"{name}"'


def _sql_int_list(values: list[int]) -> str:
    return ", ".join(str(int(v)) for v in values)


def _classify_table(table: str) -> str:
    low = table.lower()
    if low in CONFIG_TABLES:
        return CLASS_CONFIG
    if low in ESSENTIAL_TABLES:
        return CLASS_ESSENCIAL
    if low in OPERACIONAL_TABLES:
        return CLASS_OPERACIONAL
    if any(k in low for k in OPER_KEYWORDS):
        return CLASS_OPERACIONAL
    if any(k in low for k in CONFIG_KEYWORDS):
        return CLASS_CONFIG
    return CLASS_ESSENCIAL


def _has_tenant_unique(insp: Any, table: str) -> bool:
    cols_target = {"clinica_id", "usuario_id"}
    try:
        for uc in insp.get_unique_constraints(table) or []:
            cols = set(str(c) for c in (uc.get("column_names") or []))
            if cols_target & cols:
                return True
    except Exception:
        pass
    try:
        for idx in insp.get_indexes(table) or []:
            if not bool(idx.get("unique")):
                continue
            cols = set(str(c) for c in (idx.get("column_names") or []))
            if cols_target & cols:
                return True
    except Exception:
        pass
    try:
        pk = insp.get_pk_constraint(table) or {}
        cols = set(str(c) for c in (pk.get("constrained_columns") or []))
        if len(cols) > 1 and (cols_target & cols):
            return True
    except Exception:
        pass
    return False


def _risk_flags(table: str, count: int, classification: str, tenant_unique: bool) -> list[str]:
    flags: list[str] = []
    low = table.lower()
    if any(k in low for k in SENSITIVE_KEYWORDS):
        flags.append("dados_sensiveis")
    if count > HIGH_VOLUME_LIMIT:
        flags.append(f"volume_alto>{HIGH_VOLUME_LIMIT}")
    if classification in {CLASS_CONFIG, CLASS_ESSENCIAL} and not tenant_unique:
        flags.append("potencial_duplicacao_seed")
    return flags


def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Mapa completo da conta modelo (read-only).")
    p.add_argument("--email", required=True, help="Email da clinica modelo.")
    return p.parse_args()


def _buscar_clinicas_por_email(email: str) -> list[dict[str, Any]]:
    with SessionLocal() as db:
        try:
            db.execute(text("SET TRANSACTION READ ONLY"))
        except Exception:
            pass
        rows = db.execute(
            text(
                """
                SELECT id, nome, email
                FROM clinicas
                WHERE LOWER(email) = LOWER(:email)
                ORDER BY id
                """
            ),
            {"email": email},
        ).mappings().all()
        return [dict(r) for r in rows]


def _buscar_usuarios_da_clinica(clinica_ids: list[int]) -> list[dict[str, Any]]:
    ids_sql = _sql_int_list(clinica_ids)
    with SessionLocal() as db:
        rows = db.execute(
            text(
                f"""
                SELECT id, nome, email, tipo_usuario, is_admin, clinica_id
                FROM usuarios
                WHERE clinica_id IN ({ids_sql})
                ORDER BY id
                """
            )
        ).mappings().all()
        return [dict(r) for r in rows]


def _contar_tabelas_relacionadas(clinica_ids: list[int], usuario_ids: list[int]) -> list[dict[str, Any]]:
    insp = inspect(engine)
    clinica_sql = _sql_int_list(clinica_ids) if clinica_ids else ""
    usuario_sql = _sql_int_list(usuario_ids) if usuario_ids else ""

    out: list[dict[str, Any]] = []
    for table in sorted(insp.get_table_names()):
        if table == "alembic_version":
            continue
        try:
            cols = {str(c.get("name")) for c in insp.get_columns(table)}
        except Exception:
            continue

        has_clinica = "clinica_id" in cols
        has_usuario = "usuario_id" in cols
        if not has_clinica and not has_usuario:
            continue

        conds: list[str] = []
        if has_clinica and clinica_ids:
            conds.append(f"{_qident('clinica_id')} IN ({clinica_sql})")
        if has_usuario and usuario_ids:
            conds.append(f"{_qident('usuario_id')} IN ({usuario_sql})")
        if not conds:
            continue

        sql = f"SELECT COUNT(1) AS total FROM {_qident(table)} WHERE " + " OR ".join(f"({c})" for c in conds)
        with SessionLocal() as db:
            try:
                total = int(db.execute(text(sql)).scalar() or 0)
            except Exception:
                total = 0

        # Etapa 2: ignorar tabelas com 0 registros.
        if total <= 0:
            continue

        classification = _classify_table(table)
        tenant_unique = _has_tenant_unique(insp, table)
        risks = _risk_flags(table, total, classification, tenant_unique)
        out.append(
            {
                "tabela": table,
                "registros": total,
                "classificacao": classification,
                "tenant_unique": "Sim" if tenant_unique else "Nao",
                "riscos": ", ".join(risks) if risks else "-",
            }
        )

    out.sort(key=lambda x: (-int(x["registros"]), str(x["tabela"])))
    return out


def _sugestao_seed(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    sugestoes: list[dict[str, Any]] = []
    for row in rows:
        if row["classificacao"] != CLASS_CONFIG:
            continue
        if "dados_sensiveis" in str(row.get("riscos", "")):
            continue
        sugestoes.append(
            {
                "tabela": row["tabela"],
                "registros": row["registros"],
                "motivo": "configuracao_base_replicavel",
            }
        )

    # Prioriza o que o usuario citou explicitamente.
    prioridade = [
        "procedimento",
        "procedimento_generico",
        "simbolo_grafico_catalogo",
        "categoria_financeira",
        "grupo_financeiro",
        "item_auxiliar",
    ]
    order = {name: idx for idx, name in enumerate(prioridade)}
    sugestoes.sort(key=lambda x: (order.get(x["tabela"], 9999), -int(x["registros"]), x["tabela"]))
    return sugestoes


def main() -> None:
    args = _parse_args()
    email = str(args.email or "").strip()
    if not email:
        raise RuntimeError("Informe um email valido em --email.")

    clinicas = _buscar_clinicas_por_email(email)
    _title("MAPA COMPLETO DA CONTA MODELO")
    print(f"Email analisado: {email}")

    if not clinicas:
        print("Nenhuma clinica encontrada para este email.")
        print(f"Comando: python backend/scripts/mapa_conta_modelo.py --email {email}")
        return

    clinica_ids = [int(c["id"]) for c in clinicas]
    usuarios = _buscar_usuarios_da_clinica(clinica_ids)
    usuario_ids = [int(u["id"]) for u in usuarios if u.get("id") is not None]

    _title("CONTA MODELO")
    _print_table(clinicas, [("id", "clinica_id"), ("nome", "nome"), ("email", "email")])

    _title("USUARIOS DA CONTA")
    _print_table(
        usuarios,
        [
            ("id", "id"),
            ("nome", "nome"),
            ("email", "email"),
            ("tipo_usuario", "tipo_usuario"),
            ("is_admin", "is_admin"),
            ("clinica_id", "clinica_id"),
        ],
    )

    mapa = _contar_tabelas_relacionadas(clinica_ids, usuario_ids)
    _title("MAPA COMPLETO DA CONTA MODELO")
    _print_table(
        mapa,
        [
            ("tabela", "Tabela"),
            ("registros", "Registros"),
            ("classificacao", "Classificacao"),
            ("tenant_unique", "Tenant unique"),
            ("riscos", "Riscos"),
        ],
    )

    _title("CLASSIFICACAO (RESUMO)")
    by_class = {
        CLASS_ESSENCIAL: [x for x in mapa if x["classificacao"] == CLASS_ESSENCIAL],
        CLASS_CONFIG: [x for x in mapa if x["classificacao"] == CLASS_CONFIG],
        CLASS_OPERACIONAL: [x for x in mapa if x["classificacao"] == CLASS_OPERACIONAL],
    }
    for cls, rows in by_class.items():
        total = sum(int(x["registros"]) for x in rows)
        print(f"- {cls}: {len(rows)} tabela(s), {total} registro(s)")

    sugestoes = _sugestao_seed(mapa)
    _title("TABELAS RECOMENDADAS PARA SEED")
    _print_table(sugestoes, [("tabela", "Tabela"), ("registros", "Registros"), ("motivo", "Motivo")])

    _title("RISCOS IDENTIFICADOS")
    sensiveis = [x for x in mapa if "dados_sensiveis" in str(x.get("riscos", ""))]
    altos = [x for x in mapa if f"volume_alto>{HIGH_VOLUME_LIMIT}" in str(x.get("riscos", ""))]
    duplicaveis = [x for x in mapa if "potencial_duplicacao_seed" in str(x.get("riscos", ""))]

    print("Dados sensiveis (nao seedar sem saneamento):")
    if sensiveis:
        for x in sensiveis:
            print(f"- {x['tabela']} ({x['registros']})")
    else:
        print("- nenhum")

    print(f"\nVolume alto (>{HIGH_VOLUME_LIMIT}):")
    if altos:
        for x in altos:
            print(f"- {x['tabela']} ({x['registros']})")
    else:
        print("- nenhum")

    print("\nPossivel duplicacao em seed (sem chave tenant-unique detectada):")
    if duplicaveis:
        for x in duplicaveis:
            print(f"- {x['tabela']} ({x['registros']})")
    else:
        print("- nenhum")

    _title("RESUMO FINAL")
    total_tabelas = len(mapa)
    total_registros = sum(int(x["registros"]) for x in mapa)
    print(f"- tabelas mapeadas (com dados): {total_tabelas}")
    print(f"- total de registros mapeados: {total_registros}")
    print(f"- sugestoes de seed: {len(sugestoes)}")
    print(f"- conta modelo: clinica_id(s) {clinica_ids}")
    print(f"\nComando: python backend/scripts/mapa_conta_modelo.py --email {email}")


if __name__ == "__main__":
    main()
