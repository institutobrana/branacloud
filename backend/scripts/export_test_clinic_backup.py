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


FIXED_CLINICA_ID = 8
FIXED_EXPECTED_EMAIL = "institutobrana@gmail.com"
EXPECTED_DATABASE = "brana_saas"
BACKUP_DIR = PROJECT_ROOT / "backups" / "clinica_8_pre_exclusao"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Backup/export somente leitura da clinica 8 antes de exclusao segura."
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


def get_current_database(db) -> str:
    return db.execute(text("select current_database()")).scalar_one()


def load_clinic(db, clinica_id: int) -> dict[str, Any] | None:
    row = db.execute(
        text(
            """
            select id, nome, email, cnpj, tipo_conta, licenca_usuario, chave_licenca,
                   data_ativacao, nome_tabela_procedimentos, opcoes_sistema_json,
                   trial_ate, ativo, criado_em
            from clinicas
            where id = :clinica_id
            """
        ),
        {"clinica_id": clinica_id},
    ).mappings().first()
    return dict(row) if row else None


def load_expected_users(db, clinica_id: int, expected_email: str) -> list[dict[str, Any]]:
    rows = db.execute(
        text(
            """
            select id, codigo, nome, apelido, tipo_usuario, email, ativo, online,
                   forcar_troca_senha, setup_completed, is_system_user, is_admin,
                   prestador_id, unidade_atendimento_id, clinica_id
            from usuarios
            where clinica_id = :clinica_id or email = :expected_email
            order by id
            """
        ),
        {"clinica_id": clinica_id, "expected_email": expected_email},
    ).mappings().all()
    return [dict(row) for row in rows]


def load_prestador(db, clinica_id: int) -> dict[str, Any] | None:
    row = db.execute(
        text(
            """
            select id, clinica_id, source_id, usuario_id, codigo, nome, apelido,
                   tipo_prestador, data_inicio, data_termino, inativo,
                   executa_procedimento, is_system_prestador, cro, uf_cro, cpf, rg,
                   inss, ccm, contrato, cnes, cbos, nascimento, sexo, estado_civil,
                   prefixo, data_inclusao, data_alteracao, id_interno, email,
                   homepage, observacoes
            from prestador_odonto
            where clinica_id = :clinica_id
            order by id
            limit 1
            """
        ),
        {"clinica_id": clinica_id},
    ).mappings().first()
    return dict(row) if row else None


def load_assinatura(db, clinica_id: int) -> dict[str, Any] | None:
    row = db.execute(
        text(
            """
            select id, clinica_id, plano, status, inicio_em, fim_em,
                   proxima_cobranca_em, bloqueada, atualizado_em
            from plataforma_assinaturas
            where clinica_id = :clinica_id
            order by id
            limit 1
            """
        ),
        {"clinica_id": clinica_id},
    ).mappings().first()
    return dict(row) if row else None


def load_etiqueta_modelo(db, clinica_id: int) -> list[dict[str, Any]]:
    rows = db.execute(
        text(
            """
            select id, clinica_id, padrao_id, nome, reservado, margem_esq, margem_sup,
                   esp_horizontal, esp_vertical, nro_colunas, nro_linhas,
                   modelo_documento_id, ativo, criado_em, atualizado_em
            from etiqueta_modelo
            where clinica_id = :clinica_id
            order by id
            """
        ),
        {"clinica_id": clinica_id},
    ).mappings().all()
    return [dict(row) for row in rows]


def dump_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, default=str, indent=2)
        handle.write("\n")


def export_query(db, sql: str, params: dict[str, Any]) -> list[dict[str, Any]]:
    rows = db.execute(text(sql), params).mappings().all()
    return [dict(row) for row in rows]


def export_backup_bundle(db, clinica_id: int) -> tuple[OrderedDict[str, int], list[str]]:
    exported_files: list[str] = []
    counts: OrderedDict[str, int] = OrderedDict()

    def write_dataset(filename: str, payload: Any, count_key: str | None = None) -> None:
        dump_json(BACKUP_DIR / filename, payload)
        exported_files.append(filename)
        if count_key is not None:
            if isinstance(payload, list):
                counts[count_key] = len(payload)
            elif isinstance(payload, dict) and "count" in payload:
                counts[count_key] = int(payload["count"])

    clinic = export_query(
        db,
        """
        select id, nome, email, cnpj, tipo_conta, licenca_usuario, chave_licenca,
               data_ativacao, nome_tabela_procedimentos, opcoes_sistema_json,
               trial_ate, ativo, criado_em
        from clinicas
        where id = :clinica_id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("clinica_8_core.json", clinic, "clinicas")

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
        {"clinica_id": clinica_id, "expected_email": FIXED_EXPECTED_EMAIL},
    )
    write_dataset("usuarios_19_20.json", users, "usuarios")

    prestador = export_query(
        db,
        """
        select id, clinica_id, source_id, usuario_id, codigo, nome, apelido,
               tipo_prestador, data_inicio, data_termino, inativo,
               executa_procedimento, is_system_prestador, cro, uf_cro, cpf, rg,
               inss, ccm, contrato, cnes, cbos, nascimento, sexo, estado_civil,
               prefixo, data_inclusao, data_alteracao, id_interno, email,
               homepage, observacoes
        from prestador_odonto
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("prestador_13.json", prestador, "prestador_odonto")

    assinatura = export_query(
        db,
        """
        select id, clinica_id, plano, status, inicio_em, fim_em,
               proxima_cobranca_em, bloqueada, atualizado_em
        from plataforma_assinaturas
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("plataforma_assinaturas_11.json", assinatura, "plataforma_assinaturas")

    access_profile = export_query(
        db,
        """
        select id, clinica_id, source_id, nome, reservado, criado_em, atualizado_em
        from access_profile
        where clinica_id = :clinica_id
        order by source_id, id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("access_profile_clinica_8.json", access_profile, "access_profile")

    etiqueta_modelo = load_etiqueta_modelo(db, clinica_id)
    write_dataset("etiqueta_modelo_clinica_8.json", etiqueta_modelo, "etiqueta_modelo")

    convenio = export_query(
        db,
        """
        select *
        from convenio_odonto
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("convenio_odonto_clinica_8.json", convenio, "convenio_odonto")

    plano = export_query(
        db,
        """
        select *
        from plano_odonto
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("plano_odonto_clinica_8.json", plano, "plano_odonto")

    proc_tabela = export_query(
        db,
        """
        select *
        from procedimento_tabela
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("procedimento_tabela_clinica_8.json", proc_tabela, "procedimento_tabela")

    procedimento_generico = export_query(
        db,
        """
        select *
        from procedimento_generico
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("procedimento_generico_clinica_8.json", procedimento_generico, "procedimento_generico")

    procedimento = export_query(
        db,
        """
        select *
        from procedimento
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("procedimento_clinica_8.json", procedimento, "procedimento")

    lista_material = export_query(
        db,
        """
        select *
        from lista_material
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("lista_material_clinica_8.json", lista_material, "lista_material")

    material = export_query(
        db,
        """
        select m.*
        from material m
        join lista_material l on l.id = m.lista_id
        where l.clinica_id = :clinica_id
        order by m.id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("material_lista_25.json", material, "material")

    questionarios = export_query(
        db,
        """
        select *
        from anamnese_questionarios
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("anamnese_questionarios_clinica_8.json", questionarios, "anamnese_questionarios")

    perguntas = export_query(
        db,
        """
        select *
        from anamnese_perguntas
        where clinica_id = :clinica_id
        order by questionario_id, numero, id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("anamnese_perguntas_clinica_8.json", perguntas, "anamnese_perguntas")

    def count_only(table_name: str) -> int:
        return int(
            db.execute(
                text(f"select count(*) from {table_name} where clinica_id = :clinica_id"),
                {"clinica_id": clinica_id},
            ).scalar_one()
        )

    zero_tables = [
        "assinaturas",
        "plataforma_cobrancas",
        "pacientes",
        "tratamento",
        "anamnese_respostas",
        "lancamento",
        "agenda_legado_evento",
        "agenda_legado_bloqueio",
        "relatorio_config",
        "usuario_perfil_acesso",
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
    ]
    zero_counts = OrderedDict((table, count_only(table)) for table in zero_tables)
    counts.update(zero_counts)

    counts.update(
        OrderedDict(
            [
                ("categoria_financeira", count_only("categoria_financeira")),
                ("grupo_financeiro", count_only("grupo_financeiro")),
                ("indice_financeiro", count_only("indice_financeiro")),
                ("item_auxiliar", count_only("item_auxiliar")),
                ("simbolo_grafico_catalogo", count_only("simbolo_grafico_catalogo")),
                ("doenca_cid", count_only("doenca_cid")),
                ("etiqueta_modelo", count_only("etiqueta_modelo")),
            ]
        )
    )

    category_financeira = export_query(
        db,
        """
        select *
        from categoria_financeira
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("categoria_financeira_clinica_8.json", category_financeira, "categoria_financeira")

    grupo_financeiro = export_query(
        db,
        """
        select *
        from grupo_financeiro
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("grupo_financeiro_clinica_8.json", grupo_financeiro, "grupo_financeiro")

    indice_financeiro = export_query(
        db,
        """
        select *
        from indice_financeiro
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("indice_financeiro_clinica_8.json", indice_financeiro, "indice_financeiro")

    item_auxiliar = export_query(
        db,
        """
        select *
        from item_auxiliar
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("item_auxiliar_clinica_8.json", item_auxiliar, "item_auxiliar")

    simbolo_grafico = export_query(
        db,
        """
        select *
        from simbolo_grafico_catalogo
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("simbolo_grafico_catalogo_clinica_8.json", simbolo_grafico, "simbolo_grafico_catalogo")

    doenca_cid = export_query(
        db,
        """
        select *
        from doenca_cid
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("doenca_cid_clinica_8.json", doenca_cid, "doenca_cid")

    return counts, exported_files


def build_manifest(
    *,
    current_database: str,
    clinic: dict[str, Any] | None,
    users: list[dict[str, Any]],
    prestador: dict[str, Any] | None,
    assinatura: dict[str, Any] | None,
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
            "doenca_cid foi exportada integralmente por ser reversibilidade util e ainda segura no volume atual",
            "etiqueta_modelo foi exportada integralmente por ser exclusivo da clinica 8 e necessitar reversibilidade adicional",
            "Nenhuma escrita foi feita no banco",
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

        clinic = load_clinic(db, args.clinica_id)
        if not clinic:
            raise RuntimeError(f"clinica nao encontrada: {args.clinica_id}")
        if clinic["email"] != args.expected_email:
            raise RuntimeError(
                f"email da clinica nao confere: esperado={args.expected_email} recebido={clinic['email']}"
            )

        users = load_expected_users(db, args.clinica_id, args.expected_email)
        prestador = load_prestador(db, args.clinica_id)
        assinatura = load_assinatura(db, args.clinica_id)
        counts, exported_files = export_backup_bundle(db, args.clinica_id)
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
        print(f"ARQUIVOS_GERADOS: {json.dumps(exported_files, ensure_ascii=False, indent=2)}")
        print("AVISO: nenhuma alteracao foi feita no banco.")
        print("AVISO: nenhum DELETE/UPDATE/INSERT/ALTER foi executado.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, SQLAlchemyError) as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
