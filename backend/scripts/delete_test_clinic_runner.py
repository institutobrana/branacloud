from __future__ import annotations

import argparse
import json
import sys
from collections import OrderedDict
from pathlib import Path
from typing import Any, Iterable


PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = PROJECT_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from sqlalchemy import bindparam, inspect, text
from sqlalchemy.exc import SQLAlchemyError

from database import SessionLocal


FIXED_CLINICA_ID = 8
FIXED_EXPECTED_EMAIL = "institutobrana@gmail.com"
EXPECTED_DATABASE = "brana_saas"
EXPECTED_USER_IDS = {19, 20}
EXPECTED_PRESTADOR_ID = 13
EXPECTED_ASSINATURA_ID = 11
EXPECTED_LISTA_MATERIAL_IDS = {25}
EXPECTED_ETIQUETA_MODELO_COUNT = 8

KNOWN_CLINICA_SCOPED_TABLES = [
    "access_profile",
    "agenda_legado_bloqueio",
    "agenda_legado_evento",
    "anamnese_perguntas",
    "anamnese_questionarios",
    "anamnese_respostas",
    "assinaturas",
    "categoria_financeira",
    "calendario_faturamento_odonto",
    "cenario",
    "clinicas",
    "convenio_odonto",
    "contato",
    "controle_protetico",
    "doenca_cid",
    "grupo_financeiro",
    "indice_cotacao",
    "indice_financeiro",
    "item_auxiliar",
    "lancamento",
    "lista_material",
    "medicamento",
    "plano_odonto",
    "plataforma_assinaturas",
    "plataforma_cobrancas",
    "prestador",
    "prestador_credenciamento",
    "prestador_credenciamento_odonto",
    "prestador_comissao",
    "prestador_comissao_odonto",
    "prestador_odonto",
    "procedimento",
    "procedimento_fase",
    "procedimento_generico",
    "procedimento_generico_fase",
    "procedimento_generico_material",
    "procedimento_material",
    "procedimento_tabela",
    "relatorio_config",
    "restricao_terapeutica",
    "etiqueta_modelo",
    "simbolo_grafico_catalogo",
    "tratamento",
    "unidade_atendimento",
    "usuario_perfil_acesso",
    "usuarios",
]

KNOWN_USUARIO_LINK_TABLES = {
    "prestador_odonto",
    "usuario_perfil_acesso",
}

KNOWN_PRESTADOR_LINK_TABLES = {
    "usuarios",
}

EMAIL_AUDIT_TABLES = {
    "email_codes": "email",
    "plataforma_auditoria": "actor_email",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Runner controlado para diagnostico e futura exclusao segura da clinica 8."
    )
    parser.add_argument(
        "--clinica-id",
        type=int,
        required=True,
        help="ID da clinica a validar. Esta rotina foi travada para a clinica 8.",
    )
    parser.add_argument(
        "--expected-email",
        required=True,
        help="E-mail esperado da clinica. Esta rotina foi travada para institutobrana@gmail.com.",
    )
    parser.add_argument(
        "--execute",
        action="store_true",
        help="Habilita a execucao real no futuro. Nesta etapa, permanece bloqueada.",
    )
    return parser.parse_args()


def validate_fixed_safety_args(args: argparse.Namespace) -> None:
    if args.clinica_id != FIXED_CLINICA_ID:
        raise ValueError(f"runner travado para clinica_id={FIXED_CLINICA_ID}, recebido={args.clinica_id}")
    if args.expected_email != FIXED_EXPECTED_EMAIL:
        raise ValueError(
            "runner travado para expected_email="
            f"{FIXED_EXPECTED_EMAIL}, recebido={args.expected_email}"
        )


def _inspector(db):
    return inspect(db.get_bind())


def table_exists(db, table_name: str) -> bool:
    return table_name in _inspector(db).get_table_names()


def table_columns(db, table_name: str) -> set[str]:
    if not table_exists(db, table_name):
        return set()
    return {column["name"] for column in _inspector(db).get_columns(table_name)}


def table_has_column(db, table_name: str, column_name: str) -> bool:
    return column_name in table_columns(db, table_name)


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


def load_related_counts(db, clinica_id: int) -> OrderedDict[str, int]:
    counts: OrderedDict[str, int] = OrderedDict()
    for table in KNOWN_CLINICA_SCOPED_TABLES:
        try:
            if not table_exists(db, table) or not table_has_column(db, table, "clinica_id"):
                counts[table] = 0
                continue
            count = db.execute(
                text(f"select count(*) from {table} where clinica_id = :clinica_id"),
                {"clinica_id": clinica_id},
            ).scalar_one()
            counts[table] = int(count)
        except Exception:
            counts[table] = 0
    return counts


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
    if not table_exists(db, "etiqueta_modelo"):
        return []
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


def load_etiqueta_modelo_ids(db, clinica_id: int) -> list[int]:
    return [int(row["id"]) for row in load_etiqueta_modelo(db, clinica_id)]


def load_ids_by_clinica(db, table_name: str, clinica_id: int) -> list[int]:
    if not table_exists(db, table_name) or not table_has_column(db, table_name, "clinica_id"):
        return []
    rows = db.execute(
        text(
            f"""
            select id
            from {table_name}
            where clinica_id = :clinica_id
            order by id
            """
        ),
        {"clinica_id": clinica_id},
    ).scalars().all()
    return [int(row_id) for row_id in rows]


def load_email_audit_records(db, expected_email: str) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for table_name, column_name in EMAIL_AUDIT_TABLES.items():
        if not table_exists(db, table_name) or not table_has_column(db, table_name, column_name):
            continue
        count = db.execute(
            text(
                f"""
                select count(*)
                from {table_name}
                where {column_name} = :expected_email
                """
            ),
            {"expected_email": expected_email},
        ).scalar_one()
        if int(count):
            records.append({"table": table_name, "column": column_name, "qtd": int(count)})
    return records


def load_tables_with_unexpected_rows(
    db,
    *,
    column_name: str,
    values: Iterable[int],
    allowed_tables: set[str],
) -> list[dict[str, Any]]:
    inspector = _inspector(db)
    values_list = list(values)
    findings: list[dict[str, Any]] = []
    for table_name in inspector.get_table_names():
        if table_name in allowed_tables:
            continue
        columns = {column["name"] for column in inspector.get_columns(table_name)}
        if column_name not in columns:
            continue
        count = db.execute(
            text(
                f"""
                select count(*)
                from {table_name}
                where {column_name} in :ids
                """
            ).bindparams(bindparam("ids", expanding=True)),
            {"ids": values_list},
        ).scalar_one()
        if int(count):
            findings.append({"table": table_name, "column": column_name, "qtd": int(count)})
    return findings


def delete_where_in(db, table_name: str, column_name: str, values: Iterable[int]) -> int:
    values_list = list(values)
    if not values_list or not table_exists(db, table_name) or not table_has_column(db, table_name, column_name):
        return 0
    result = db.execute(
        text(
            f"""
            delete from {table_name}
            where {column_name} in :ids
            """
        ).bindparams(bindparam("ids", expanding=True)),
        {"ids": values_list},
    )
    return int(result.rowcount or 0)


def delete_where_clinica(db, table_name: str, clinica_id: int) -> int:
    return delete_where_in(db, table_name, "clinica_id", [clinica_id])


def validate_expected_user_rows(users: list[dict[str, Any]]) -> None:
    if not users:
        return
    user_ids = {int(user["id"]) for user in users}
    if user_ids != EXPECTED_USER_IDS:
        raise RuntimeError(
            f"execucao real bloqueada: usuarios inesperados encontrados={sorted(user_ids)} "
            f"esperados={sorted(EXPECTED_USER_IDS)}"
        )
    for user in users:
        if int(user.get("clinica_id") or 0) != FIXED_CLINICA_ID:
            raise RuntimeError(
                "execucao real bloqueada: usuario vinculado fora da clinica 8 "
                f"({json.dumps(user, ensure_ascii=False, default=str)})"
            )


def validate_expected_prestador(prestador: dict[str, Any] | None) -> None:
    if not prestador:
        return
    if int(prestador["id"]) != EXPECTED_PRESTADOR_ID:
        raise RuntimeError(
            f"execucao real bloqueada: prestador inesperado id={prestador['id']} esperado={EXPECTED_PRESTADOR_ID}"
        )
    if int(prestador.get("clinica_id") or 0) != FIXED_CLINICA_ID:
        raise RuntimeError("execucao real bloqueada: prestador nao pertence a clinica 8")
    if int(prestador.get("usuario_id") or 0) not in EXPECTED_USER_IDS:
        raise RuntimeError("execucao real bloqueada: usuario vinculado ao prestador nao confere")


def validate_expected_assinatura(assinatura: dict[str, Any] | None) -> None:
    if not assinatura:
        return
    if int(assinatura["id"]) != EXPECTED_ASSINATURA_ID:
        raise RuntimeError(
            f"execucao real bloqueada: assinatura inesperada id={assinatura['id']} esperado={EXPECTED_ASSINATURA_ID}"
        )
    if int(assinatura.get("clinica_id") or 0) != FIXED_CLINICA_ID:
        raise RuntimeError("execucao real bloqueada: assinatura nao pertence a clinica 8")
    if str(assinatura.get("status", "")).lower() not in {"trial", "ativo", "active"}:
        raise RuntimeError("execucao real bloqueada: status da assinatura nao permitido")


def validate_etiqueta_modelo(records: list[dict[str, Any]], *, strict: bool) -> dict[str, Any]:
    ids = [int(record["id"]) for record in records]
    expected_ids = [75, 76, 77, 78, 79, 80, 81, 82]
    report = {
        "count": len(records),
        "ids": ids,
        "expected_count": EXPECTED_ETIQUETA_MODELO_COUNT,
        "expected_ids": expected_ids,
        "matches_expected": len(records) == EXPECTED_ETIQUETA_MODELO_COUNT and ids == expected_ids,
    }
    if strict and not report["matches_expected"]:
        raise RuntimeError(
            "execucao real bloqueada: etiqueta_modelo divergente "
            f"esperado={expected_ids} recebido={ids}"
        )
    return report


def load_unknown_links(db, clinica_id: int) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    if table_exists(db, "relatorio_config") and table_has_column(db, "relatorio_config", "clinica_id"):
        count = db.execute(
            text(
                """
                select count(*)
                from relatorio_config
                where clinica_id = :clinica_id
                """
            ),
            {"clinica_id": clinica_id},
        ).scalar_one()
        if int(count):
            rows.append({"table_name": "relatorio_config", "column_name": "clinica_id", "qtd": int(count)})
    if table_exists(db, "plataforma_auditoria") and table_has_column(db, "plataforma_auditoria", "actor_email"):
        count = db.execute(
            text(
                """
                select count(*)
                from plataforma_auditoria
                where actor_email = :expected_email
                """
            ),
            {"expected_email": FIXED_EXPECTED_EMAIL},
        ).scalar_one()
        if int(count):
            rows.append({"table_name": "plataforma_auditoria", "column_name": "actor_email", "qtd": int(count)})
    return rows


def print_dry_run_report(
    *,
    db,
    current_database: str,
    clinic: dict[str, Any] | None,
    users: list[dict[str, Any]],
    prestador: dict[str, Any] | None,
    assinatura: dict[str, Any] | None,
    etiqueta_modelo_report: dict[str, Any],
    counts: OrderedDict[str, int],
    email_audit_records: list[dict[str, Any]],
    unknown_links: list[dict[str, Any]],
    user_link_issues: list[dict[str, Any]],
    prestador_link_issues: list[dict[str, Any]],
) -> None:
    print("MODO: DRY-RUN")
    print(f"DATABASE_ATUAL: {current_database}")
    print(f"CLINICA_ENCONTRADA: {json.dumps(clinic, ensure_ascii=False, default=str)}")
    print(f"E_MAIL_ESPERADO: {FIXED_EXPECTED_EMAIL}")
    print(f"USUARIOS_ENCONTRADOS: {json.dumps(users, ensure_ascii=False, default=str)}")
    print(f"PRESTADOR_ENCONTRADO: {json.dumps(prestador, ensure_ascii=False, default=str)}")
    print(f"ASSINATURA_ENCONTRADA: {json.dumps(assinatura, ensure_ascii=False, default=str)}")
    print(f"ETIQUETA_MODELO_RELATORIO: {json.dumps(etiqueta_modelo_report, ensure_ascii=False, default=str)}")
    print(f"ETIQUETA_MODELO_CONTAGEM: {etiqueta_modelo_report.get('count', 0)}")
    print(f"ETIQUETA_MODELO_IDS: {json.dumps(etiqueta_modelo_report.get('ids', []), ensure_ascii=False)}")
    print(f"CLINICA_REMANESCENTE: {bool(clinic)}")
    print("PROXIMO_PASSO_EXECUTE: DELETE FROM clinicas WHERE id = :clinica_id AND email = :expected_email")
    print(f"AUDITORIA_EMAIL: {json.dumps(email_audit_records, ensure_ascii=False, default=str)}")
    print("CONTAGENS_POR_TABELA:")
    for table, count in counts.items():
        print(f"- {table}: {count}")
    print("ORDEM_PLANEJADA_DE_EXCLUSAO:")
    for step in planned_delete_order():
        print(f"- {step}")
    if unknown_links:
        print(f"VINCULOS_NAO_MAPEADOS: {json.dumps(unknown_links, ensure_ascii=False, default=str)}")
    else:
        print("VINCULOS_NAO_MAPEADOS: []")
    if user_link_issues:
        print(f"VINCULOS_USUARIO_EXTRA: {json.dumps(user_link_issues, ensure_ascii=False, default=str)}")
    else:
        print("VINCULOS_USUARIO_EXTRA: []")
    if prestador_link_issues:
        print(f"VINCULOS_PRESTADOR_EXTRA: {json.dumps(prestador_link_issues, ensure_ascii=False, default=str)}")
    else:
        print("VINCULOS_PRESTADOR_EXTRA: []")
    print("AVISO: modelos_documento e etiqueta_padrao nao serao removidos.")
    print("AVISO: dry-run somente leitura; nada foi alterado.")


def planned_delete_order() -> list[str]:
    return [
        "1. procedimento_material / procedimento_fase / procedimento_generico_fase / procedimento_generico_material",
        "2. material por lista_material relacionada",
        "3. lista_material",
        "4. anamnese_perguntas",
        "5. anamnese_questionarios",
        "6. plano_odonto",
        "7. convenio_odonto",
        "8. procedimento",
        "9. procedimento_generico",
        "10. procedimento_tabela",
        "11. categoria_financeira",
        "12. grupo_financeiro",
        "13. indice_financeiro",
        "14. item_auxiliar",
        "15. simbolo_grafico_catalogo",
        "16. doenca_cid",
        "17. usuario_perfil_acesso",
        "18. access_profile",
        "19. etiqueta_modelo",
        "20. plataforma_assinaturas",
        "21. prestador_odonto",
        "22. usuarios.id 19 e 20",
        "23. clinicas.id 8 por ultimo (DELETE por id/email)",
    ]


def execute_delete_plan(
    *,
    db,
    current_database: str,
    clinic: dict[str, Any] | None,
    users: list[dict[str, Any]],
    prestador: dict[str, Any] | None,
    assinatura: dict[str, Any] | None,
    etiqueta_modelo_report: dict[str, Any],
    counts: OrderedDict[str, int],
    unknown_links: list[dict[str, Any]],
    email_audit_records: list[dict[str, Any]],
) -> None:
    validate_expected_user_rows(users)
    validate_expected_prestador(prestador)
    validate_expected_assinatura(assinatura)

    if current_database != EXPECTED_DATABASE:
        raise RuntimeError(
            f"execucao real bloqueada: database incorreto esperado={EXPECTED_DATABASE} recebido={current_database}"
        )
    if not clinic:
        raise RuntimeError("execucao real bloqueada: clinica nao encontrada")
    if str(clinic.get("email", "")) != FIXED_EXPECTED_EMAIL:
        raise RuntimeError("execucao real bloqueada: e-mail da clinica nao confere")
    if counts.get("pacientes", 0) or counts.get("tratamento", 0) or counts.get("lancamento", 0):
        raise RuntimeError("execucao real bloqueada: existem pacientes/tratamentos/lancamentos")
    if counts.get("agenda_legado_evento", 0) or counts.get("agenda_legado_bloqueio", 0):
        raise RuntimeError("execucao real bloqueada: existem dados de agenda legada")
    if counts.get("plataforma_cobrancas", 0) or counts.get("anamnese_respostas", 0):
        raise RuntimeError("execucao real bloqueada: existem cobranças/anamneses reais")
    if counts.get("usuario_perfil_acesso", 0):
        raise RuntimeError("execucao real bloqueada: usuario_perfil_acesso ainda possui registros")
    etiqueta_modelo_count = int(etiqueta_modelo_report.get("count", 0) or 0)
    if etiqueta_modelo_count not in {0, EXPECTED_ETIQUETA_MODELO_COUNT}:
        raise RuntimeError(
            "execucao real bloqueada: etiqueta_modelo divergente do esperado "
            f"{json.dumps(etiqueta_modelo_report, ensure_ascii=False)}"
        )
    if unknown_links:
        raise RuntimeError("execucao real bloqueada: existem vinculos nao mapeados")
    if email_audit_records:
        raise RuntimeError("execucao real bloqueada: existem registros de auditoria de e-mail que exigem revisao manual")

    unexpected_clinic_links = load_tables_with_unexpected_rows(
        db,
        column_name="clinica_id",
        values=[FIXED_CLINICA_ID],
        allowed_tables=set(KNOWN_CLINICA_SCOPED_TABLES),
    )
    user_link_issues = load_tables_with_unexpected_rows(
        db,
        column_name="usuario_id",
        values=EXPECTED_USER_IDS,
        allowed_tables=KNOWN_USUARIO_LINK_TABLES,
    )
    prestador_link_issues = load_tables_with_unexpected_rows(
        db,
        column_name="prestador_id",
        values=[EXPECTED_PRESTADOR_ID],
        allowed_tables=KNOWN_PRESTADOR_LINK_TABLES,
    )
    if unexpected_clinic_links:
        raise RuntimeError(
            f"execucao real bloqueada: tabelas adicionais com clinica_id=8 encontradas {json.dumps(unexpected_clinic_links, ensure_ascii=False)}"
        )
    if user_link_issues:
        raise RuntimeError(
            f"execucao real bloqueada: vinculos extras por usuario_id encontrados {json.dumps(user_link_issues, ensure_ascii=False)}"
        )
    if prestador_link_issues:
        raise RuntimeError(
            f"execucao real bloqueada: vinculos extras por prestador_id encontrados {json.dumps(prestador_link_issues, ensure_ascii=False)}"
        )

    lista_material_ids = load_ids_by_clinica(db, "lista_material", FIXED_CLINICA_ID)
    if lista_material_ids and not set(lista_material_ids).issubset(EXPECTED_LISTA_MATERIAL_IDS):
        raise RuntimeError(
            f"execucao real bloqueada: lista_material inesperada encontrada ids={sorted(lista_material_ids)}"
        )

    ids_by_table = {
        table_name: load_ids_by_clinica(db, table_name, FIXED_CLINICA_ID)
        for table_name in KNOWN_CLINICA_SCOPED_TABLES
    }

    print("MODO: EXECUTE")
    print(f"DATABASE_ATUAL: {current_database}")
    print("CONTAGENS_ANTES:")
    for table, count in counts.items():
        print(f"- {table}: {count}")
    print(f"LISTA_MATERIAL_IDS: {json.dumps(lista_material_ids, ensure_ascii=False)}")
    print(f"ETIQUETA_MODELO_RELATORIO: {json.dumps(etiqueta_modelo_report, ensure_ascii=False, default=str)}")
    print("ORDEM_EXECUCAO:")
    for step in planned_delete_order():
        print(f"- {step}")

    # Clear the read-only transaction started by validation queries before opening
    # the explicit write transaction below.
    db.rollback()

    def _delete_special_children() -> None:
        procedure_ids = ids_by_table.get("procedimento", [])
        procedimento_generico_ids = ids_by_table.get("procedimento_generico", [])
        material_ids = ids_by_table.get("material", [])

        child_specs = [
            ("procedimento_material", [
                ("procedimento_id", procedure_ids),
                ("procedimento_generico_id", procedimento_generico_ids),
                ("material_id", material_ids),
            ]),
            ("procedimento_fase", [("procedimento_id", procedure_ids)]),
            ("procedimento_generico_fase", [("procedimento_generico_id", procedimento_generico_ids)]),
            ("procedimento_generico_material", [
                ("procedimento_generico_id", procedimento_generico_ids),
                ("material_id", material_ids),
            ]),
        ]

        for table_name, candidates in child_specs:
            if not table_exists(db, table_name):
                print(f"- tabela ausente ignorada: {table_name}")
                continue
            if table_has_column(db, table_name, "clinica_id"):
                deleted = delete_where_clinica(db, table_name, FIXED_CLINICA_ID)
                print(f"- DELETE {table_name} por clinica_id: {deleted}")
                continue
            deleted = 0
            for column_name, values in candidates:
                if not values or not table_has_column(db, table_name, column_name):
                    continue
                deleted = delete_where_in(db, table_name, column_name, values)
                print(f"- DELETE {table_name} por {column_name}: {deleted}")
                if deleted:
                    break
            if deleted == 0:
                print(f"- nenhum registro elegivel em {table_name}")

    with db.begin():
        _delete_special_children()

        if table_exists(db, "material"):
            if table_has_column(db, "material", "clinica_id"):
                deleted = delete_where_clinica(db, "material", FIXED_CLINICA_ID)
            elif table_has_column(db, "material", "lista_material_id"):
                deleted = delete_where_in(db, "material", "lista_material_id", lista_material_ids)
            else:
                deleted = 0
            print(f"- DELETE material: {deleted}")

        ordered_scoped_tables = [
            "lista_material",
            "anamnese_perguntas",
            "anamnese_questionarios",
            "plano_odonto",
            "convenio_odonto",
            "procedimento",
            "procedimento_generico",
            "procedimento_tabela",
            "categoria_financeira",
            "grupo_financeiro",
            "indice_financeiro",
            "item_auxiliar",
            "simbolo_grafico_catalogo",
            "doenca_cid",
            "usuario_perfil_acesso",
            "access_profile",
            "etiqueta_modelo",
            "plataforma_assinaturas",
            "prestador_odonto",
            "usuarios",
            "clinicas",
        ]

        for table_name in ordered_scoped_tables:
            if table_name == "clinicas":
                continue
            if not table_exists(db, table_name):
                print(f"- tabela ausente ignorada: {table_name}")
                continue
            if table_name == "etiqueta_modelo":
                deleted = delete_where_clinica(db, table_name, FIXED_CLINICA_ID)
            elif table_name == "usuarios":
                deleted = delete_where_in(db, table_name, "id", sorted(EXPECTED_USER_IDS))
            elif table_name == "prestador_odonto":
                deleted = delete_where_in(db, table_name, "id", [EXPECTED_PRESTADOR_ID])
            elif table_name == "plataforma_assinaturas":
                deleted = delete_where_in(db, table_name, "id", [EXPECTED_ASSINATURA_ID])
            else:
                deleted = delete_where_clinica(db, table_name, FIXED_CLINICA_ID)
            print(f"- DELETE {table_name}: {deleted}")

        if table_exists(db, "clinicas"):
            deleted_clinic = int(
                db.execute(
                    text(
                        """
                        delete from clinicas
                        where id = :clinica_id
                          and email = :expected_email
                        """
                    ),
                    {"clinica_id": FIXED_CLINICA_ID, "expected_email": FIXED_EXPECTED_EMAIL},
                ).rowcount
                or 0
            )
            print(f"- DELETE clinicas por id/email: {deleted_clinic}")
            if deleted_clinic != 1:
                raise RuntimeError(
                    "execucao real bloqueada: DELETE final de clinicas nao afetou exatamente 1 linha"
                )
        else:
            raise RuntimeError("execucao real bloqueada: tabela clinicas nao foi encontrada")

    counts_after = load_related_counts(db, FIXED_CLINICA_ID)
    print("CONTAGENS_DEPOIS:")
    for table, count in counts_after.items():
        print(f"- {table}: {count}")
    clinic_after = load_clinic(db, FIXED_CLINICA_ID)
    print(f"CLINICA_DEPOIS: {json.dumps(clinic_after, ensure_ascii=False, default=str)}")
    if clinic_after is not None:
        raise RuntimeError("execucao real bloqueada: clinica 8 permaneceu apos o DELETE final")
    print("AVISO: execute controlado concluido em transacao; commit ocorreu somente ao final da rotina.")


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
        etiqueta_modelo = load_etiqueta_modelo(db, args.clinica_id)
        etiqueta_modelo_report = validate_etiqueta_modelo(etiqueta_modelo, strict=False)
        counts = load_related_counts(db, args.clinica_id)
        unknown_links = load_unknown_links(db, args.clinica_id)
        email_audit_records = load_email_audit_records(db, args.expected_email)
        user_link_issues = load_tables_with_unexpected_rows(
            db,
            column_name="usuario_id",
            values=EXPECTED_USER_IDS,
            allowed_tables=KNOWN_USUARIO_LINK_TABLES,
        )
        prestador_link_issues = load_tables_with_unexpected_rows(
            db,
            column_name="prestador_id",
            values=[EXPECTED_PRESTADOR_ID],
            allowed_tables=KNOWN_PRESTADOR_LINK_TABLES,
        )

        if not args.execute:
            print_dry_run_report(
                db=db,
                current_database=current_database,
                clinic=clinic,
                users=users,
                prestador=prestador,
                assinatura=assinatura,
                etiqueta_modelo_report=etiqueta_modelo_report,
                counts=counts,
                email_audit_records=email_audit_records,
                unknown_links=unknown_links,
                user_link_issues=user_link_issues,
                prestador_link_issues=prestador_link_issues,
            )
            return

        execute_delete_plan(
            db=db,
            current_database=current_database,
            clinic=clinic,
            users=users,
            prestador=prestador,
            assinatura=assinatura,
            etiqueta_modelo_report=etiqueta_modelo_report,
            counts=counts,
            unknown_links=unknown_links,
            email_audit_records=email_audit_records,
        )


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, SQLAlchemyError) as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
