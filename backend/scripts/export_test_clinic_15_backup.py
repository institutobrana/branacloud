from __future__ import annotations

import argparse
import json
import sys
from collections import OrderedDict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = PROJECT_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from database import SessionLocal


FIXED_CLINICA_ID = 15
FIXED_EXPECTED_EMAIL = "institutobrana@gmail.com"
EXPECTED_DATABASE = "brana_saas"
BACKUP_DIR = PROJECT_ROOT / "backups" / "clinica_15_pre_exclusao"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Backup/export somente leitura da clinica 15 antes de exclusao segura."
    )
    parser.add_argument("--clinica-id", type=int, required=True)
    parser.add_argument("--expected-email", required=True)
    return parser.parse_args()


def validate_fixed_safety_args(args: argparse.Namespace) -> None:
    if args.clinica_id != FIXED_CLINICA_ID:
        raise ValueError(f"runner travado para clinica_id={FIXED_CLINICA_ID}, recebido={args.clinica_id}")
    if args.expected_email != FIXED_EXPECTED_EMAIL:
        raise ValueError(
            "runner travado para expected_email="
            f"{FIXED_EXPECTED_EMAIL}, recebido={args.expected_email}"
        )


def dump_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, default=str, indent=2)
        handle.write("\n")


def get_current_database(db) -> str:
    return db.execute(text("select current_database()")).scalar_one()


def table_exists(db, table_name: str) -> bool:
    return bool(
        db.execute(text("select to_regclass(:t) is not null"), {"t": table_name}).scalar_one()
    )


def table_columns(db, table_name: str) -> set[str]:
    if not table_exists(db, table_name):
        return set()
    rows = db.execute(
        text(
            """
            select column_name
            from information_schema.columns
            where table_schema = current_schema() and table_name = :table_name
            order by ordinal_position
            """
        ),
        {"table_name": table_name},
    ).scalars().all()
    return {str(row) for row in rows}


def select_existing_columns(db, table_name: str, wanted: list[str]) -> list[str]:
    existing = table_columns(db, table_name)
    selected: list[str] = []
    for column in wanted:
        if column in existing and column not in selected:
            selected.append(column)
    return selected


def export_query(db, sql: str, params: dict[str, Any]) -> list[dict[str, Any]]:
    rows = db.execute(text(sql), params).mappings().all()
    return [dict(row) for row in rows]


def export_single_table(db, table_name: str, clinica_id: int) -> list[dict[str, Any]]:
    if not table_exists(db, table_name):
        return []
    if "clinica_id" not in table_columns(db, table_name):
        return []
    columns = select_existing_columns(
        db,
        table_name,
        [
            "id",
            "clinica_id",
            "source_id",
            "usuario_id",
            "codigo",
            "nome",
            "apelido",
            "tipo_prestador",
            "tipo_usuario",
            "email",
            "ativo",
            "online",
            "forcar_troca_senha",
            "setup_completed",
            "is_system_user",
            "is_admin",
            "prestador_id",
            "unidade_atendimento_id",
            "plano",
            "status",
            "inicio_em",
            "fim_em",
            "proxima_cobranca_em",
            "bloqueada",
            "atualizado_em",
            "reservado",
            "padrao_id",
            "margem_esq",
            "margem_sup",
            "esp_horizontal",
            "esp_vertical",
            "nro_colunas",
            "nro_linhas",
            "modelo_documento_id",
            "ativo",
            "criado_em",
            "atualizado_em",
        ],
    )
    sql = f"select {', '.join(columns)} from {table_name} where clinica_id = :clinica_id order by id"
    return export_query(db, sql, {"clinica_id": clinica_id})


def export_email_codes(db, expected_email: str) -> list[dict[str, Any]]:
    if not table_exists(db, "email_codes") or "email" not in table_columns(db, "email_codes"):
        return []
    columns = select_existing_columns(
        db,
        "email_codes",
        ["id", "email", "purpose", "code_hash", "expires_at", "used", "created_at"],
    )
    sql = f"""
        select {', '.join(columns)}
        from email_codes
        where email = :expected_email
        order by id
    """
    return export_query(db, sql, {"expected_email": expected_email})


def export_material_by_lista_material(db, clinica_id: int) -> list[dict[str, Any]]:
    if not table_exists(db, "material") or not table_exists(db, "lista_material"):
        return []
    sql = """
        select m.*
        from material m
        join lista_material l on l.id = m.lista_id
        where l.clinica_id = :clinica_id
        order by m.id
    """
    return export_query(db, sql, {"clinica_id": clinica_id})


def export_backup_bundle(db, clinica_id: int) -> tuple[OrderedDict[str, int], list[str]]:
    exported_files: list[str] = []
    counts: OrderedDict[str, int] = OrderedDict()

    def write_dataset(filename: str, payload: Any, count_key: str | None = None) -> None:
        dump_json(BACKUP_DIR / filename, payload)
        exported_files.append(filename)
        if count_key is not None:
            counts[count_key] = len(payload) if isinstance(payload, list) else int(payload.get("count", 0))

    write_dataset("clinica_15_core.json", export_query(
        db,
        """
        select id, nome, email, cnpj, tipo_conta, licenca_usuario, chave_licenca,
               data_ativacao, nome_tabela_procedimentos, opcoes_sistema_json,
               trial_ate, ativo, criado_em
        from clinicas
        where id = :clinica_id
        """,
        {"clinica_id": clinica_id},
    ), "clinicas")
    write_dataset("usuarios_34_35.json", export_single_table(db, "usuarios", clinica_id), "usuarios")
    write_dataset("prestador_21.json", export_single_table(db, "prestador_odonto", clinica_id), "prestador_odonto")
    write_dataset("access_profile_clinica_15.json", export_single_table(db, "access_profile", clinica_id), "access_profile")
    write_dataset("usuario_perfil_acesso_clinica_15.json", export_single_table(db, "usuario_perfil_acesso", clinica_id), "usuario_perfil_acesso")
    write_dataset("etiqueta_modelo_clinica_15.json", export_single_table(db, "etiqueta_modelo", clinica_id), "etiqueta_modelo")
    write_dataset("email_codes_institutobrana.json", export_email_codes(db, FIXED_EXPECTED_EMAIL), "email_codes")
    write_dataset("convenio_odonto_clinica_15.json", export_single_table(db, "convenio_odonto", clinica_id), "convenio_odonto")
    write_dataset("plano_odonto_clinica_15.json", export_single_table(db, "plano_odonto", clinica_id), "plano_odonto")
    write_dataset("procedimento_tabela_clinica_15.json", export_single_table(db, "procedimento_tabela", clinica_id), "procedimento_tabela")
    write_dataset("procedimento_generico_clinica_15.json", export_single_table(db, "procedimento_generico", clinica_id), "procedimento_generico")
    write_dataset("procedimento_clinica_15.json", export_single_table(db, "procedimento", clinica_id), "procedimento")
    write_dataset("procedimento_material_clinica_15.json", export_single_table(db, "procedimento_material", clinica_id), "procedimento_material")
    write_dataset("procedimento_fase_clinica_15.json", export_single_table(db, "procedimento_fase", clinica_id), "procedimento_fase")
    write_dataset("procedimento_generico_material_clinica_15.json", export_single_table(db, "procedimento_generico_material", clinica_id), "procedimento_generico_material")
    write_dataset("procedimento_generico_fase_clinica_15.json", export_single_table(db, "procedimento_generico_fase", clinica_id), "procedimento_generico_fase")
    write_dataset("lista_material_clinica_15.json", export_single_table(db, "lista_material", clinica_id), "lista_material")
    write_dataset("material_lista_15.json", export_material_by_lista_material(db, clinica_id), "material")
    write_dataset("anamnese_questionarios_clinica_15.json", export_single_table(db, "anamnese_questionarios", clinica_id), "anamnese_questionarios")
    write_dataset("anamnese_perguntas_clinica_15.json", export_single_table(db, "anamnese_perguntas", clinica_id), "anamnese_perguntas")
    write_dataset("categoria_financeira_clinica_15.json", export_single_table(db, "categoria_financeira", clinica_id), "categoria_financeira")
    write_dataset("grupo_financeiro_clinica_15.json", export_single_table(db, "grupo_financeiro", clinica_id), "grupo_financeiro")
    write_dataset("indice_financeiro_clinica_15.json", export_single_table(db, "indice_financeiro", clinica_id), "indice_financeiro")
    write_dataset("item_auxiliar_clinica_15.json", export_single_table(db, "item_auxiliar", clinica_id), "item_auxiliar")
    write_dataset("simbolo_grafico_catalogo_clinica_15.json", export_single_table(db, "simbolo_grafico_catalogo", clinica_id), "simbolo_grafico_catalogo")
    write_dataset("doenca_cid_clinica_15.json", export_single_table(db, "doenca_cid", clinica_id), "doenca_cid")
    write_dataset("assinaturas_clinica_15.json", export_single_table(db, "assinaturas", clinica_id), "assinaturas")
    write_dataset("plataforma_assinaturas_clinica_15.json", export_single_table(db, "plataforma_assinaturas", clinica_id), "plataforma_assinaturas")
    write_dataset("plataforma_cobrancas_clinica_15.json", export_single_table(db, "plataforma_cobrancas", clinica_id), "plataforma_cobrancas")

    return counts, exported_files


def build_manifest(
    *,
    current_database: str,
    clinic: list[dict[str, Any]],
    users: list[dict[str, Any]],
    prestador: list[dict[str, Any]],
    assinatura: list[dict[str, Any]],
    counts: OrderedDict[str, int],
    exported_files: list[str],
) -> dict[str, Any]:
    return {
        "created_at_utc": datetime.now(timezone.utc).isoformat(),
        "database": current_database,
        "clinica_id": FIXED_CLINICA_ID,
        "expected_email": FIXED_EXPECTED_EMAIL,
        "clinica": clinic,
        "usuarios": users,
        "prestador": prestador,
        "assinatura": assinatura,
        "exported_files": exported_files,
        "counts": counts,
        "notes": [
            "Exportacao somente leitura",
            "Nenhuma escrita foi feita no banco",
            "modelos_documento e etiqueta_padrao nao foram alvo de exportacao nem remocao",
            "Os arquivos exportados sao destinados a reversibilidade da exclusao segura da clinica 15",
        ],
    }


def main() -> None:
    args = parse_args()
    validate_fixed_safety_args(args)

    with SessionLocal() as db:
        current_database = get_current_database(db)
        if current_database != EXPECTED_DATABASE:
            raise RuntimeError(
                f"database incorreto: esperado={EXPECTED_DATABASE} recebido={current_database}"
            )

        clinic = export_query(
            db,
            """
            select id, nome, email, cnpj, tipo_conta, licenca_usuario, chave_licenca,
                   data_ativacao, nome_tabela_procedimentos, opcoes_sistema_json,
                   trial_ate, ativo, criado_em
            from clinicas
            where id = :clinica_id
            """,
            {"clinica_id": args.clinica_id},
        )
        if not clinic:
            raise RuntimeError(f"clinica nao encontrada: {args.clinica_id}")
        if str(clinic[0].get("email", "")) != args.expected_email:
            raise RuntimeError(
                f"email da clinica nao confere: esperado={args.expected_email} recebido={clinic[0].get('email')}"
            )

        users = export_query(
            db,
            """
            select id, codigo, nome, apelido, tipo_usuario, email, ativo, online,
                   forcar_troca_senha, setup_completed, is_system_user, is_admin,
                   prestador_id, unidade_atendimento_id, clinica_id, permissoes_json
            from usuarios
            where clinica_id = :clinica_id or email = :expected_email
            order by id
            """,
            {"clinica_id": args.clinica_id, "expected_email": args.expected_email},
        )
        prestador = export_single_table(db, "prestador_odonto", args.clinica_id)
        assinatura = export_single_table(db, "plataforma_assinaturas", args.clinica_id)

        counts, exported_files = export_backup_bundle(db, args.clinica_id)
        counts["assinaturas"] = len(export_single_table(db, "assinaturas", args.clinica_id))
        counts["plataforma_cobrancas"] = len(export_single_table(db, "plataforma_cobrancas", args.clinica_id))
        counts["usuario_perfil_acesso"] = len(export_single_table(db, "usuario_perfil_acesso", args.clinica_id))

        zero_counts = OrderedDict()
        for table_name in [
            "pacientes",
            "tratamento",
            "lancamento",
            "agenda_legado_evento",
            "agenda_legado_bloqueio",
            "anamnese_respostas",
            "relatorio_config",
            "controle_protetico",
            "calendario_faturamento_odonto",
            "medicamento",
            "restricao_terapeutica",
            "prestador_credenciamento",
            "prestador_comissao",
            "prestador_credenciamento_odonto",
            "prestador_comissao_odonto",
            "cenario",
            "contato",
            "unidade_atendimento",
        ]:
            if table_exists(db, table_name) and "clinica_id" in table_columns(db, table_name):
                zero_counts[table_name] = int(
                    db.execute(
                        text(f"select count(*) from {table_name} where clinica_id = :clinica_id"),
                        {"clinica_id": args.clinica_id},
                    ).scalar_one()
                )
            else:
                zero_counts[table_name] = 0
        counts.update(zero_counts)

        counts_file = BACKUP_DIR / "counts_pre_exclusao.json"
        dump_json(counts_file, counts)
        exported_files.append("counts_pre_exclusao.json")

        manifest = build_manifest(
            current_database=current_database,
            clinic=clinic,
            users=users,
            prestador=prestador,
            assinatura=assinatura,
            counts=counts,
            exported_files=exported_files,
        )
        dump_json(BACKUP_DIR / "manifest.json", manifest)
        exported_files.append("manifest.json")

        print("MODO: BACKUP/EXPORT SOMENTE LEITURA")
        print(f"DATABASE_ATUAL: {current_database}")
        print(f"BACKUP_DIR: {BACKUP_DIR}")
        print(f"CLINICA_ENCONTRADA: {json.dumps(clinic, ensure_ascii=False, default=str)}")
        print(f"USUARIOS_ENCONTRADOS: {json.dumps(users, ensure_ascii=False, default=str)}")
        print(f"PRESTADORES_ENCONTRADOS: {json.dumps(prestador, ensure_ascii=False, default=str)}")
        print(f"ASSINATURA_ENCONTRADA: {json.dumps(assinatura, ensure_ascii=False, default=str)}")
        print(f"ARQUIVOS_EXPORTADOS: {json.dumps(exported_files, ensure_ascii=False)}")
        print(f"CONTAGENS: {json.dumps(counts, ensure_ascii=False, default=str)}")
        print("AVISO: nada foi alterado no banco.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, SQLAlchemyError) as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        sys.exit(1)
