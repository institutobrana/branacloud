from __future__ import annotations

import argparse
import importlib
import pkgutil
import sys
import unicodedata
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from sqlalchemy import func

try:
    import pyodbc  # type: ignore
except ModuleNotFoundError:  # pragma: no cover
    pyodbc = None


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from database import SessionLocal  # noqa: E402
import models  # noqa: E402
from models.clinica import Clinica  # noqa: E402
from models.medicamento import Medicamento  # noqa: E402
from models.usuario import Usuario  # noqa: E402


DEFAULT_EMAIL = "gleissontel@gmail.com"
DEFAULT_SOURCE_SERVER = r".\SQLEXPRESS2008R2"
DEFAULT_SOURCE_DATABASE = "EDS70"
DEFAULT_SOURCE_USER = "easy"
DEFAULT_SOURCE_PASSWORD = "ysae"


def _norm(value: str | None) -> str:
    base = str(value or "").strip().lower()
    if not base:
        return ""
    base = unicodedata.normalize("NFKD", base)
    return "".join(ch for ch in base if not unicodedata.combining(ch))


def _clean_short(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).replace("\x00", "").strip()
    if not text:
        return None
    return " ".join(text.split())


def _clean_long(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).replace("\x00", "").replace("\r\n", "\n").strip()
    return text or None


def _as_bool(value: Any) -> bool:
    if value is None:
        return False
    text = str(value).strip().lower()
    return text in {"1", "-1", "true", "t", "sim", "s", "yes", "y"}


def _connect_source(
    *,
    server: str,
    database: str,
    user: str,
    password: str,
    trusted: bool,
):
    if pyodbc is None:
        raise RuntimeError("pyodbc nao esta instalado no ambiente.")

    errors: list[str] = []
    if trusted:
        try:
            conn_str = (
                "DRIVER={SQL Server};"
                f"SERVER={server};"
                f"DATABASE={database};"
                "Trusted_Connection=yes;"
                "Connection Timeout=15;"
            )
            return pyodbc.connect(conn_str)
        except Exception as exc:  # pragma: no cover - depende de ambiente
            errors.append(f"trusted: {exc}")

    if user and password:
        try:
            conn_str = (
                "DRIVER={SQL Server};"
                f"SERVER={server};"
                f"DATABASE={database};"
                f"UID={user};"
                f"PWD={password};"
                "Trusted_Connection=no;"
                "Connection Timeout=15;"
            )
            return pyodbc.connect(conn_str)
        except Exception as exc:  # pragma: no cover - depende de ambiente
            errors.append(f"sql-auth: {exc}")

    raise RuntimeError("Falha ao conectar no SQL Server origem. " + " | ".join(errors))


def _load_source_rows(connection) -> list[dict[str, Any]]:
    query = """
    SELECT
        item.REGISTRO AS source_id,
        LTRIM(RTRIM(item.NOME)) AS nome,
        item.GRUPO AS grupo_id,
        LTRIM(RTRIM(gr.NOME)) AS grupo_nome,
        LTRIM(RTRIM(item.INDICACAO)) AS descricao_substancia,
        LTRIM(RTRIM(item.APRESENTA)) AS apresentacao,
        LTRIM(RTRIM(item.USO)) AS uso,
        CAST(item.POSADULTO AS NVARCHAR(MAX)) AS posologia_adulto,
        LTRIM(RTRIM(item.QTDADULTO)) AS quantidade_padrao_adulto,
        CAST(item.POSCRIANCA AS NVARCHAR(MAX)) AS posologia_crianca,
        LTRIM(RTRIM(item.QTDCRIANCA)) AS quantidade_padrao_crianca,
        LTRIM(RTRIM(item.LABORATORIO)) AS laboratorio,
        CAST(item.OBSERV AS NVARCHAR(MAX)) AS observacoes,
        CAST(item.ADVERT AS NVARCHAR(MAX)) AS advertencias,
        CASE WHEN ISNULL(item.PREFERIDO, 0) <> 0 THEN 1 ELSE 0 END AS preferido
    FROM DEF_ITEM item
    LEFT JOIN DEF_GRUPO gr
      ON gr.NROGRUPO = item.GRUPO
    ORDER BY item.NOME ASC, item.REGISTRO ASC
    """
    cursor = connection.cursor()
    cursor.execute(query)
    columns = [str(col[0]).strip().lower() for col in cursor.description]
    out: list[dict[str, Any]] = []
    for row in cursor.fetchall():
        out.append({columns[idx]: row[idx] for idx in range(len(columns))})
    return out


def _resolve_target_clinica(db, *, email: str, clinica_id: int | None) -> Clinica:
    if clinica_id and clinica_id > 0:
        clinica = db.query(Clinica).filter(Clinica.id == int(clinica_id)).first()
        if clinica:
            return clinica

    owner = db.query(Usuario).filter(func.lower(Usuario.email) == str(email or "").lower()).first()
    if not owner:
        raise RuntimeError(f"Usuario alvo nao encontrado para email={email!r}")

    clinica = db.query(Clinica).filter(Clinica.id == int(owner.clinica_id)).first()
    if not clinica:
        raise RuntimeError(f"Clinica alvo nao encontrada para email={email!r}")
    return clinica


def _set_if_changed(item: Medicamento, field: str, new_value: Any) -> bool:
    old_value = getattr(item, field)
    if old_value != new_value:
        setattr(item, field, new_value)
        return True
    return False


def _import_all_models() -> None:
    for module in pkgutil.iter_modules(models.__path__):
        name = module.name
        if name.startswith("_"):
            continue
        importlib.import_module(f"models.{name}")


def migrar(args: argparse.Namespace) -> None:
    load_dotenv(BACKEND_DIR / ".env")
    _import_all_models()

    source_conn = _connect_source(
        server=str(args.source_server),
        database=str(args.source_database),
        user=str(args.source_user or ""),
        password=str(args.source_password or ""),
        trusted=bool(args.source_trusted),
    )
    try:
        source_rows = _load_source_rows(source_conn)
    finally:
        source_conn.close()

    if not source_rows:
        raise RuntimeError("Origem DEF_ITEM nao retornou registros.")

    db = SessionLocal()
    try:
        clinica = _resolve_target_clinica(
            db,
            email=str(args.email or DEFAULT_EMAIL),
            clinica_id=(int(args.clinica_id) if args.clinica_id else None),
        )

        existentes = (
            db.query(Medicamento)
            .filter(Medicamento.clinica_id == int(clinica.id))
            .order_by(Medicamento.id.asc())
            .all()
        )
        by_nome_norm: dict[str, Medicamento] = {}
        for item in existentes:
            key = _norm(item.nome)
            if key and key not in by_nome_norm:
                by_nome_norm[key] = item

        inseridos = 0
        atualizados = 0
        sem_nome = 0
        duplicados_origem = 0
        vistos: set[str] = set()

        for raw in source_rows:
            nome = _clean_short(raw.get("nome"))
            if not nome:
                sem_nome += 1
                continue

            key = _norm(nome)
            if key in vistos:
                duplicados_origem += 1
                continue
            vistos.add(key)

            grupo = _clean_short(raw.get("grupo_nome"))
            descricao_substancia = _clean_short(raw.get("descricao_substancia"))
            apresentacao = _clean_short(raw.get("apresentacao"))
            uso = _clean_short(raw.get("uso"))
            posologia_adulto = _clean_long(raw.get("posologia_adulto"))
            quantidade_padrao_adulto = _clean_short(raw.get("quantidade_padrao_adulto"))
            posologia_crianca = _clean_long(raw.get("posologia_crianca"))
            quantidade_padrao_crianca = _clean_short(raw.get("quantidade_padrao_crianca"))
            laboratorio = _clean_short(raw.get("laboratorio"))
            observacoes = _clean_long(raw.get("observacoes"))
            advertencias = _clean_long(raw.get("advertencias"))
            preferido = _as_bool(raw.get("preferido"))

            item = by_nome_norm.get(key)
            if item is None:
                item = Medicamento(
                    clinica_id=int(clinica.id),
                    nome=nome,
                    grupo=grupo,
                    descricao_substancia=descricao_substancia,
                    apresentacao=apresentacao,
                    uso=uso,
                    posologia_adulto=posologia_adulto,
                    quantidade_padrao_adulto=quantidade_padrao_adulto,
                    posologia_crianca=posologia_crianca,
                    quantidade_padrao_crianca=quantidade_padrao_crianca,
                    preferido=preferido,
                    laboratorio=laboratorio,
                    observacoes=observacoes,
                    advertencias=advertencias,
                    inativo=False,
                )
                db.add(item)
                by_nome_norm[key] = item
                inseridos += 1
                continue

            changed = False
            changed = _set_if_changed(item, "nome", nome) or changed
            changed = _set_if_changed(item, "grupo", grupo) or changed
            changed = _set_if_changed(item, "descricao_substancia", descricao_substancia) or changed
            changed = _set_if_changed(item, "apresentacao", apresentacao) or changed
            changed = _set_if_changed(item, "uso", uso) or changed
            changed = _set_if_changed(item, "posologia_adulto", posologia_adulto) or changed
            changed = _set_if_changed(item, "quantidade_padrao_adulto", quantidade_padrao_adulto) or changed
            changed = _set_if_changed(item, "posologia_crianca", posologia_crianca) or changed
            changed = _set_if_changed(item, "quantidade_padrao_crianca", quantidade_padrao_crianca) or changed
            changed = _set_if_changed(item, "preferido", preferido) or changed
            changed = _set_if_changed(item, "laboratorio", laboratorio) or changed
            changed = _set_if_changed(item, "observacoes", observacoes) or changed
            changed = _set_if_changed(item, "advertencias", advertencias) or changed
            changed = _set_if_changed(item, "inativo", False) or changed
            if changed:
                atualizados += 1

        if args.apply:
            db.commit()
        else:
            db.rollback()

        total_clinica = (
            db.query(Medicamento.id)
            .filter(Medicamento.clinica_id == int(clinica.id))
            .count()
        )

        print(
            "MIGRACAO_MEDICAMENTOS_OK",
            f"modo={'APPLY' if args.apply else 'DRY_RUN'}",
            f"clinica_id={clinica.id}",
            f"clinica={clinica.nome!r}",
            f"origem={len(source_rows)}",
            f"inseridos={inseridos}",
            f"atualizados={atualizados}",
            f"sem_nome={sem_nome}",
            f"duplicados_origem={duplicados_origem}",
            f"total_clinica={total_clinica if args.apply else 'n/a'}",
        )
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Migra medicamentos do Easy (DEF_ITEM) para uma clinica SaaS.",
    )
    parser.add_argument("--email", default=DEFAULT_EMAIL, help="Email dono da clinica alvo.")
    parser.add_argument("--clinica-id", type=int, default=0, help="Clinica alvo (opcional).")
    parser.add_argument("--source-server", default=DEFAULT_SOURCE_SERVER, help="Servidor SQL Server origem.")
    parser.add_argument("--source-database", default=DEFAULT_SOURCE_DATABASE, help="Banco SQL Server origem.")
    parser.add_argument("--source-user", default=DEFAULT_SOURCE_USER, help="Usuario SQL Server origem.")
    parser.add_argument("--source-password", default=DEFAULT_SOURCE_PASSWORD, help="Senha SQL Server origem.")
    parser.add_argument(
        "--source-trusted",
        action="store_true",
        default=True,
        help="Usa autenticacao integrada (Windows) na origem.",
    )
    parser.add_argument(
        "--no-source-trusted",
        action="store_false",
        dest="source_trusted",
        help="Desativa autenticacao integrada e usa usuario/senha.",
    )
    parser.add_argument("--apply", action="store_true", help="Aplica no banco SaaS (padrao: dry-run).")
    return parser


if __name__ == "__main__":
    migrar(build_parser().parse_args())
