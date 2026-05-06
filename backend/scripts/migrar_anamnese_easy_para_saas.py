"""Migra questionarios/perguntas de anamnese do Easy para uma clinica no SaaS.

Uso:
    python scripts/migrar_anamnese_easy_para_saas.py

Padrao:
- Origem Easy: .\\SQLEXPRESS2008R2 / EDS70
- Destino SaaS: clinica por email (gleissontel@gmail.com)

Regras de seguranca:
- Nao remove questionarios nem perguntas existentes.
- Faz upsert por (clinica_id, nome_questionario) e (clinica_id, questionario_id, numero).
- Nao altera respostas de anamnese de pacientes.
"""

from __future__ import annotations

import argparse
import importlib
import pkgutil
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

import pyodbc  # type: ignore
from dotenv import load_dotenv
from sqlalchemy import func

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import models  # noqa: E402
from database import SessionLocal  # noqa: E402
from models.anamnese import AnamnesePergunta, AnamneseQuestionario  # noqa: E402
from models.clinica import Clinica  # noqa: E402


def _import_all_models() -> None:
    for module in pkgutil.iter_modules(models.__path__):
        name = module.name
        if name.startswith("_"):
            continue
        importlib.import_module(f"models.{name}")


def _pick_sqlserver_driver() -> str:
    preferred = [
        "ODBC Driver 18 for SQL Server",
        "ODBC Driver 17 for SQL Server",
        "SQL Server",
    ]
    installed = set(pyodbc.drivers())
    for name in preferred:
        if name in installed:
            return name
    if installed:
        return sorted(installed)[-1]
    raise RuntimeError("Nenhum driver ODBC para SQL Server encontrado.")


def _easy_connect(server: str, database: str, user: str | None, password: str | None):
    driver = _pick_sqlserver_driver()
    if user and password:
        conn_str = (
            f"DRIVER={{{driver}}};"
            f"SERVER={server};"
            f"DATABASE={database};"
            f"UID={user};PWD={password};"
            "TrustServerCertificate=yes;"
        )
    else:
        conn_str = (
            f"DRIVER={{{driver}}};"
            f"SERVER={server};"
            f"DATABASE={database};"
            "Trusted_Connection=yes;"
            "TrustServerCertificate=yes;"
        )
    return pyodbc.connect(conn_str, timeout=15)


def _sanitize_tipo(value: Any) -> int:
    try:
        parsed = int(value)
    except Exception:
        parsed = 1
    if parsed not in (1, 2, 3):
        return 1
    return parsed


def _load_easy_data(conn) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    cur = conn.cursor()
    cur.execute("SELECT NROQUE, NOME FROM ANAMNESE_QUEST ORDER BY NOME")
    questionarios = []
    for nroque, nome in cur.fetchall():
        nome_txt = str(nome or "").strip()
        if not nome_txt:
            continue
        questionarios.append(
            {
                "nroque": int(nroque),
                "nome": nome_txt,
            }
        )

    cur.execute(
        """
        SELECT
            q.NOME,
            p.NROPER,
            p.TEXPER,
            p.TIPPER,
            p.TIPRES,
            p.TEXMEN
        FROM ANAMNESE_PERG p
        JOIN ANAMNESE_QUEST q ON q.NROQUE = p.NROQUE
        ORDER BY q.NOME, p.NROPER
        """
    )
    perguntas = []
    for row in cur.fetchall():
        nome_q = str(row[0] or "").strip()
        if not nome_q:
            continue
        numero = int(row[1] or 0)
        if numero <= 0:
            continue
        texto = str(row[2] or "").strip()
        if not texto:
            continue
        perguntas.append(
            {
                "questionario_nome": nome_q,
                "numero": numero,
                "texto": texto,
                "tipo_pergunta": _sanitize_tipo(row[3]),
                "tipo_resposta": _sanitize_tipo(row[4]),
                "mensagem_alerta": str(row[5] or "").strip() or None,
            }
        )
    return questionarios, perguntas


def _find_clinica_id_by_email(db, email: str) -> int:
    clinica = (
        db.query(Clinica)
        .filter(func.lower(Clinica.email) == str(email or "").strip().lower())
        .first()
    )
    if not clinica:
        raise RuntimeError(f"Clinica nao encontrada para email: {email}")
    return int(clinica.id)


def run(args: argparse.Namespace) -> int:
    load_dotenv(BACKEND_DIR / ".env")
    _import_all_models()

    with _easy_connect(args.easy_server, args.easy_database, args.easy_user, args.easy_password) as easy_conn:
        src_questionarios, src_perguntas = _load_easy_data(easy_conn)

    if not src_questionarios:
        raise RuntimeError("Nenhum questionario de anamnese encontrado no Easy.")

    db = SessionLocal()
    try:
        clinica_id = _find_clinica_id_by_email(db, args.clinica_email)

        existing_questionarios = (
            db.query(AnamneseQuestionario)
            .filter(AnamneseQuestionario.clinica_id == clinica_id)
            .all()
        )
        by_name = {str(q.nome or "").strip().lower(): q for q in existing_questionarios}

        q_inserted = 0
        q_updated = 0
        target_by_name: dict[str, AnamneseQuestionario] = {}

        # Ordem no Easy: combo ordena por nome.
        ordered_names = sorted({str(q["nome"]).strip() for q in src_questionarios}, key=lambda x: x.lower())
        for ordem, nome in enumerate(ordered_names, start=1):
            key = nome.lower()
            atual = by_name.get(key)
            if atual is None:
                atual = AnamneseQuestionario(
                    clinica_id=clinica_id,
                    nome=nome,
                    ativo=True,
                    ordem=ordem,
                )
                db.add(atual)
                db.flush()
                by_name[key] = atual
                q_inserted += 1
            else:
                changed = False
                if not bool(atual.ativo):
                    atual.ativo = True
                    changed = True
                if int(atual.ordem or 0) != int(ordem):
                    atual.ordem = int(ordem)
                    changed = True
                if changed:
                    q_updated += 1
            target_by_name[key] = atual

        target_q_ids = [int(q.id) for q in target_by_name.values()]
        existing_perguntas = (
            db.query(AnamnesePergunta)
            .filter(
                AnamnesePergunta.clinica_id == clinica_id,
                AnamnesePergunta.questionario_id.in_(target_q_ids or [0]),
            )
            .all()
        )
        by_qnum = {(int(p.questionario_id), int(p.numero)): p for p in existing_perguntas}

        p_inserted = 0
        p_updated = 0
        p_by_questionario = defaultdict(lambda: {"inserted": 0, "updated": 0})

        for row in src_perguntas:
            q_nome = str(row["questionario_nome"]).strip()
            q_obj = target_by_name.get(q_nome.lower())
            if not q_obj:
                continue
            key = (int(q_obj.id), int(row["numero"]))
            atual = by_qnum.get(key)
            if atual is None:
                novo = AnamnesePergunta(
                    clinica_id=clinica_id,
                    questionario_id=int(q_obj.id),
                    numero=int(row["numero"]),
                    tipo_pergunta=int(row["tipo_pergunta"]),
                    tipo_resposta=int(row["tipo_resposta"]),
                    texto=str(row["texto"]).strip(),
                    mensagem_alerta=row["mensagem_alerta"],
                    ativo=True,
                )
                db.add(novo)
                by_qnum[key] = novo
                p_inserted += 1
                p_by_questionario[q_nome]["inserted"] += 1
            else:
                changed = False
                new_text = str(row["texto"]).strip()
                new_tipo_p = int(row["tipo_pergunta"])
                new_tipo_r = int(row["tipo_resposta"])
                new_alerta = row["mensagem_alerta"]
                if str(atual.texto or "").strip() != new_text:
                    atual.texto = new_text
                    changed = True
                if int(getattr(atual, "tipo_pergunta", 1) or 1) != new_tipo_p:
                    atual.tipo_pergunta = new_tipo_p
                    changed = True
                if int(getattr(atual, "tipo_resposta", 1) or 1) != new_tipo_r:
                    atual.tipo_resposta = new_tipo_r
                    changed = True
                if (str(getattr(atual, "mensagem_alerta", "") or "").strip() or None) != new_alerta:
                    atual.mensagem_alerta = new_alerta
                    changed = True
                if not bool(atual.ativo):
                    atual.ativo = True
                    changed = True
                if changed:
                    p_updated += 1
                    p_by_questionario[q_nome]["updated"] += 1

        if args.dry_run:
            db.rollback()
        else:
            db.commit()

        print("[anamnese-etapa4] Clinica alvo:", clinica_id)
        print("[anamnese-etapa4] Questionarios origem:", len(ordered_names))
        print("[anamnese-etapa4] Perguntas origem:", len(src_perguntas))
        print("[anamnese-etapa4] Questionarios inseridos:", q_inserted)
        print("[anamnese-etapa4] Questionarios atualizados:", q_updated)
        print("[anamnese-etapa4] Perguntas inseridas:", p_inserted)
        print("[anamnese-etapa4] Perguntas atualizadas:", p_updated)
        print("[anamnese-etapa4] Modo:", "DRY-RUN (rollback)" if args.dry_run else "APLICADO (commit)")
        print("[anamnese-etapa4] Detalhe por questionario:")
        for nome in ordered_names:
            stats = p_by_questionario[nome]
            print(f"  - {nome}: +{int(stats['inserted'])} inseridas, ~{int(stats['updated'])} atualizadas")
    finally:
        db.close()

    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Migra anamnese do Easy para uma clinica no SaaS (upsert seguro).")
    parser.add_argument("--easy-server", default=r".\SQLEXPRESS2008R2")
    parser.add_argument("--easy-database", default="EDS70")
    parser.add_argument("--easy-user", default=None)
    parser.add_argument("--easy-password", default=None)
    parser.add_argument("--clinica-email", default="gleissontel@gmail.com")
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


if __name__ == "__main__":
    raise SystemExit(run(parse_args()))
