from __future__ import annotations

import json
import sys
from collections import OrderedDict
from pathlib import Path
from typing import Any, Iterable


PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = PROJECT_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import delete_test_clinic_runner as base
from sqlalchemy import bindparam, text
from sqlalchemy.exc import SQLAlchemyError

from database import SessionLocal


FIXED_CLINICA_ID = 9
FIXED_EXPECTED_EMAIL = "institutobrana@gmail.com"
EXPECTED_DATABASE = "brana_saas"
EXPECTED_USER_IDS = {21, 22}
EXPECTED_PRESTADOR_ID = 14
EXPECTED_ASSINATURA_ID = 12
EXPECTED_LISTA_MATERIAL_IDS = {26}
EXPECTED_ETIQUETA_MODELO_COUNT = 8
EXPECTED_ETIQUETA_MODELO_IDS = [83, 84, 85, 86, 87, 88, 89, 90]


# Patch the base runner constants so its helpers can be reused safely for clinic 9.
base.FIXED_CLINICA_ID = FIXED_CLINICA_ID
base.FIXED_EXPECTED_EMAIL = FIXED_EXPECTED_EMAIL
base.EXPECTED_DATABASE = EXPECTED_DATABASE
base.EXPECTED_USER_IDS = EXPECTED_USER_IDS
base.EXPECTED_PRESTADOR_ID = EXPECTED_PRESTADOR_ID
base.EXPECTED_ASSINATURA_ID = EXPECTED_ASSINATURA_ID
base.EXPECTED_LISTA_MATERIAL_IDS = EXPECTED_LISTA_MATERIAL_IDS
base.EXPECTED_ETIQUETA_MODELO_COUNT = EXPECTED_ETIQUETA_MODELO_COUNT


def planned_delete_order() -> list[str]:
    return [
        "1. email_codes relacionados a institutobrana@gmail.com",
        "2. procedimento_material / procedimento_fase / procedimento_generico_fase / procedimento_generico_material",
        "3. material por lista_material relacionada",
        "4. lista_material",
        "5. anamnese_perguntas",
        "6. anamnese_questionarios",
        "7. plano_odonto",
        "8. convenio_odonto",
        "9. procedimento",
        "10. procedimento_generico",
        "11. procedimento_tabela",
        "12. categoria_financeira",
        "13. grupo_financeiro",
        "14. indice_financeiro",
        "15. item_auxiliar",
        "16. simbolo_grafico_catalogo",
        "17. doenca_cid",
        "18. usuario_perfil_acesso",
        "19. access_profile",
        "20. etiqueta_modelo",
        "21. plataforma_assinaturas",
        "22. prestador_odonto",
        "23. usuarios.id 21 e 22",
        "24. clinicas.id 9 por ultimo (DELETE por id/email)",
    ]


def validate_etiqueta_modelo(records: list[dict[str, Any]], *, strict: bool) -> dict[str, Any]:
    ids = [int(record["id"]) for record in records]
    report = {
        "count": len(records),
        "ids": ids,
        "expected_count": EXPECTED_ETIQUETA_MODELO_COUNT,
        "expected_ids": EXPECTED_ETIQUETA_MODELO_IDS,
        "matches_expected": len(records) == EXPECTED_ETIQUETA_MODELO_COUNT and ids == EXPECTED_ETIQUETA_MODELO_IDS,
    }
    if strict and not report["matches_expected"]:
        raise RuntimeError(
            "execucao real bloqueada: etiqueta_modelo divergente do esperado "
            f"{json.dumps(report, ensure_ascii=False)}"
        )
    return report


def load_email_codes(db, expected_email: str) -> list[dict[str, Any]]:
    if not base.table_exists(db, "email_codes") or not base.table_has_column(db, "email_codes", "email"):
        return []
    rows = db.execute(
        text(
            """
            select id, email, purpose, used, expires_at
            from email_codes
            where email = :expected_email
            order by id
            """
        ),
        {"expected_email": expected_email},
    ).mappings().all()
    return [dict(row) for row in rows]


def delete_email_codes(db, expected_email: str) -> int:
    if not base.table_exists(db, "email_codes") or not base.table_has_column(db, "email_codes", "email"):
        return 0
    result = db.execute(
        text(
            """
            delete from email_codes
            where email = :expected_email
            """
        ),
        {"expected_email": expected_email},
    )
    return int(result.rowcount or 0)


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
    email_code_records = [record for record in email_audit_records if record.get("table") == "email_codes"]
    plataforma_auditoria_records = [
        record for record in email_audit_records if record.get("table") == "plataforma_auditoria"
    ]

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
    print(f"EMAIL_CODES_ENCONTRADOS: {json.dumps(email_code_records, ensure_ascii=False, default=str)}")
    print(f"PLATAFORMA_AUDITORIA_ENCONTRADA: {json.dumps(plataforma_auditoria_records, ensure_ascii=False, default=str)}")
    print("PLANO_EMAIL_CODES: remover para liberar o e-mail reutilizavel")
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
    if current_database != EXPECTED_DATABASE:
        raise RuntimeError(
            f"execucao real bloqueada: database incorreto esperado={EXPECTED_DATABASE} recebido={current_database}"
        )
    if not clinic:
        raise RuntimeError("execucao real bloqueada: clinica nao encontrada")
    if str(clinic.get("email", "")) != FIXED_EXPECTED_EMAIL:
        raise RuntimeError("execucao real bloqueada: e-mail da clinica nao confere")
    if not users or {int(user["id"]) for user in users} != EXPECTED_USER_IDS:
        raise RuntimeError("execucao real bloqueada: usuarios inesperados ou ausentes")
    if any(int(user.get("clinica_id") or 0) != FIXED_CLINICA_ID for user in users):
        raise RuntimeError("execucao real bloqueada: usuario vinculado fora da clinica 9")
    if not prestador or int(prestador.get("id") or 0) != EXPECTED_PRESTADOR_ID:
        raise RuntimeError("execucao real bloqueada: prestador esperado nao encontrado")
    if int(prestador.get("clinica_id") or 0) != FIXED_CLINICA_ID:
        raise RuntimeError("execucao real bloqueada: prestador nao pertence a clinica 9")
    if int(prestador.get("usuario_id") or 0) not in EXPECTED_USER_IDS:
        raise RuntimeError("execucao real bloqueada: usuario vinculado ao prestador nao confere")
    if not assinatura or int(assinatura.get("id") or 0) != EXPECTED_ASSINATURA_ID:
        raise RuntimeError("execucao real bloqueada: assinatura/plataforma esperada nao encontrada")
    if int(assinatura.get("clinica_id") or 0) != FIXED_CLINICA_ID:
        raise RuntimeError("execucao real bloqueada: assinatura nao pertence a clinica 9")
    if str(assinatura.get("status", "")).lower() not in {"trial", "ativo", "active"}:
        raise RuntimeError("execucao real bloqueada: status da assinatura nao permitido")
    if counts.get("pacientes", 0) or counts.get("tratamento", 0) or counts.get("lancamento", 0):
        raise RuntimeError("execucao real bloqueada: existem pacientes/tratamentos/lancamentos")
    if counts.get("agenda_legado_evento", 0) or counts.get("agenda_legado_bloqueio", 0):
        raise RuntimeError("execucao real bloqueada: existem dados de agenda legada")
    if counts.get("plataforma_cobrancas", 0) or counts.get("anamnese_respostas", 0):
        raise RuntimeError("execucao real bloqueada: existem cobranças/anamneses reais")
    if counts.get("usuario_perfil_acesso", 0):
        raise RuntimeError("execucao real bloqueada: usuario_perfil_acesso ainda possui registros")
    if counts.get("access_profile", 0) != 10:
        raise RuntimeError("execucao real bloqueada: access_profile divergente do esperado")
    etiqueta_modelo_count = int(etiqueta_modelo_report.get("count", 0) or 0)
    if etiqueta_modelo_count != EXPECTED_ETIQUETA_MODELO_COUNT:
        raise RuntimeError(
            "execucao real bloqueada: etiqueta_modelo divergente do esperado "
            f"{json.dumps(etiqueta_modelo_report, ensure_ascii=False)}"
        )
    if unknown_links:
        raise RuntimeError("execucao real bloqueada: existem vinculos nao mapeados")

    email_code_records = [record for record in email_audit_records if record.get("table") == "email_codes"]
    plataforma_auditoria_records = [
        record for record in email_audit_records if record.get("table") == "plataforma_auditoria"
    ]
    if plataforma_auditoria_records:
        raise RuntimeError(
            "execucao real bloqueada: existem registros de plataforma_auditoria que exigem revisao manual"
        )
    if not email_code_records:
        raise RuntimeError("execucao real bloqueada: email_codes esperados nao foram encontrados")

    lista_material_ids = base.load_ids_by_clinica(db, "lista_material", FIXED_CLINICA_ID)
    if lista_material_ids and not set(lista_material_ids).issubset(EXPECTED_LISTA_MATERIAL_IDS):
        raise RuntimeError(
            f"execucao real bloqueada: lista_material inesperada encontrada ids={sorted(lista_material_ids)}"
        )

    ids_by_table = {
        table_name: base.load_ids_by_clinica(db, table_name, FIXED_CLINICA_ID)
        for table_name in base.KNOWN_CLINICA_SCOPED_TABLES
    }

    print("MODO: EXECUTE")
    print(f"DATABASE_ATUAL: {current_database}")
    print("CONTAGENS_ANTES:")
    for table, count in counts.items():
        print(f"- {table}: {count}")
    print(f"EMAIL_CODES_ENCONTRADOS: {json.dumps(email_code_records, ensure_ascii=False, default=str)}")
    print(f"LISTA_MATERIAL_IDS: {json.dumps(lista_material_ids, ensure_ascii=False)}")
    print(f"ETIQUETA_MODELO_RELATORIO: {json.dumps(etiqueta_modelo_report, ensure_ascii=False, default=str)}")
    print("ORDEM_EXECUCAO:")
    for step in planned_delete_order():
        print(f"- {step}")

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
            if not base.table_exists(db, table_name):
                print(f"- tabela ausente ignorada: {table_name}")
                continue
            if base.table_has_column(db, table_name, "clinica_id"):
                deleted = base.delete_where_clinica(db, table_name, FIXED_CLINICA_ID)
                print(f"- DELETE {table_name} por clinica_id: {deleted}")
                continue
            deleted = 0
            for column_name, values in candidates:
                if not values or not base.table_has_column(db, table_name, column_name):
                    continue
                deleted = base.delete_where_in(db, table_name, column_name, values)
                print(f"- DELETE {table_name} por {column_name}: {deleted}")
                if deleted:
                    break
            if deleted == 0:
                print(f"- nenhum registro elegivel em {table_name}")

    def delete_email_codes_step() -> None:
        deleted = delete_email_codes(db, FIXED_EXPECTED_EMAIL)
        print(f"- DELETE email_codes por email: {deleted}")

    with db.begin():
        delete_email_codes_step()
        _delete_special_children()

        if base.table_exists(db, "material"):
            if base.table_has_column(db, "material", "clinica_id"):
                deleted = base.delete_where_clinica(db, "material", FIXED_CLINICA_ID)
            elif base.table_has_column(db, "material", "lista_material_id"):
                deleted = base.delete_where_in(db, "material", "lista_material_id", lista_material_ids)
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
            if not base.table_exists(db, table_name):
                print(f"- tabela ausente ignorada: {table_name}")
                continue
            if table_name == "etiqueta_modelo":
                deleted = base.delete_where_clinica(db, table_name, FIXED_CLINICA_ID)
            elif table_name == "usuarios":
                deleted = base.delete_where_in(db, table_name, "id", sorted(EXPECTED_USER_IDS))
            elif table_name == "prestador_odonto":
                deleted = base.delete_where_in(db, table_name, "id", [EXPECTED_PRESTADOR_ID])
            elif table_name == "plataforma_assinaturas":
                deleted = base.delete_where_in(db, table_name, "id", [EXPECTED_ASSINATURA_ID])
            else:
                deleted = base.delete_where_clinica(db, table_name, FIXED_CLINICA_ID)
            print(f"- DELETE {table_name}: {deleted}")

        if base.table_exists(db, "clinicas"):
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

    counts_after = base.load_related_counts(db, FIXED_CLINICA_ID)
    print("CONTAGENS_DEPOIS:")
    for table, count in counts_after.items():
        print(f"- {table}: {count}")
    email_codes_after = load_email_codes(db, FIXED_EXPECTED_EMAIL)
    print(f"EMAIL_CODES_DEPOIS: {json.dumps(email_codes_after, ensure_ascii=False, default=str)}")
    clinic_after = base.load_clinic(db, FIXED_CLINICA_ID)
    print(f"CLINICA_DEPOIS: {json.dumps(clinic_after, ensure_ascii=False, default=str)}")
    if clinic_after is not None:
        raise RuntimeError("execucao real bloqueada: clinica 9 permaneceu apos o DELETE final")
    if email_codes_after:
        raise RuntimeError("execucao real bloqueada: email_codes permaneceram apos a limpeza")
    print("AVISO: execute controlado concluido em transacao; commit ocorreu somente ao final da rotina.")


def main() -> None:
    base.parse_args = base.parse_args
    base.validate_fixed_safety_args = base.validate_fixed_safety_args
    base.planned_delete_order = planned_delete_order
    base.validate_etiqueta_modelo = validate_etiqueta_modelo
    base.print_dry_run_report = print_dry_run_report
    base.execute_delete_plan = execute_delete_plan
    try:
        base.main()
    except (ValueError, RuntimeError, SQLAlchemyError) as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
