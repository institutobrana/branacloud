from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import delete_test_clinic_10_runner as base
from database import SessionLocal


FIXED_CLINICA_ID = 12
FIXED_EXPECTED_EMAIL = "institutobrana@gmail.com"
EXPECTED_DATABASE = "brana_saas"
EXPECTED_USER_IDS = {27, 28, 29}
EXPECTED_PRESTADOR_IDS = {17, 18}
EXPECTED_ACCESS_PROFILE_COUNT = 10
EXPECTED_ACCESS_PROFILE_NAMES = [
    "Agenda de horarios",
    "Controle de estoque",
    "Controle de protetico",
    "Controle de recibos",
    "Creditos na conta corrente",
    "Debitos na conta corrente",
    "Intervencoes",
    "Pacientes",
    "Relatorios estatisticos",
    "Relatorios financeiros",
]
EXPECTED_ETIQUETA_MODELO_IDS = [107, 108, 109, 110, 111, 112, 113, 114]
DELETE_ORDER = [
    "1. email_codes relacionados a institutobrana@gmail.com",
    "2. usuario_perfil_acesso",
    "3. access_profile",
    "4. etiqueta_modelo",
    "5. anamnese_perguntas",
    "6. anamnese_questionarios",
    "7. procedimento_material / procedimento_fase / procedimento_generico_fase / procedimento_generico_material",
    "8. material por lista_material relacionada",
    "9. lista_material",
    "10. procedimento",
    "11. procedimento_generico",
    "12. procedimento_tabela",
    "13. plano_odonto",
    "14. convenio_odonto",
    "15. categoria_financeira",
    "16. grupo_financeiro",
    "17. indice_financeiro",
    "18. item_auxiliar",
    "19. simbolo_grafico_catalogo",
    "20. doenca_cid",
    "21. assinaturas",
    "22. plataforma_assinaturas",
    "23. plataforma_cobrancas",
    "24. prestador_odonto 17 e 18",
    "25. usuarios 27, 28 e 29",
    "26. unidade_atendimento 7",
    "27. relatorio_config",
    "28. clinicas.id 12 por ultimo (DELETE por id/email)",
]


base.FIXED_CLINICA_ID = FIXED_CLINICA_ID
base.FIXED_EXPECTED_EMAIL = FIXED_EXPECTED_EMAIL
base.EXPECTED_USER_IDS = EXPECTED_USER_IDS
base.EXPECTED_PRESTADOR_IDS = EXPECTED_PRESTADOR_IDS
base.EXPECTED_ACCESS_PROFILE_COUNT = EXPECTED_ACCESS_PROFILE_COUNT
base.EXPECTED_ACCESS_PROFILE_NAMES = EXPECTED_ACCESS_PROFILE_NAMES
base.EXPECTED_ETIQUETA_MODELO_IDS = EXPECTED_ETIQUETA_MODELO_IDS


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Runner controlado para diagnostico e exclusao segura da clinica 12."
    )
    parser.add_argument("--clinica-id", type=int, required=True)
    parser.add_argument("--expected-email", required=True)
    parser.add_argument("--execute", action="store_true")
    return parser.parse_args()


def validate_fixed_safety_args(args: argparse.Namespace) -> None:
    if args.clinica_id != FIXED_CLINICA_ID:
        raise ValueError(f"runner travado para clinica_id={FIXED_CLINICA_ID}, recebido={args.clinica_id}")
    if args.expected_email != FIXED_EXPECTED_EMAIL:
        raise ValueError(
            "runner travado para expected_email="
            f"{FIXED_EXPECTED_EMAIL}, recebido={args.expected_email}"
        )


def planned_delete_order() -> list[str]:
    return list(DELETE_ORDER)


def collect_snapshot() -> dict[str, Any]:
    with SessionLocal() as db:
        current_database = base.get_current_database(db)
        clinic = base.load_clinic(db, FIXED_CLINICA_ID)
        users = base.load_expected_users(db, FIXED_CLINICA_ID, FIXED_EXPECTED_EMAIL)
        prestadores = base.load_expected_prestadores(db, FIXED_CLINICA_ID)
        assinatura = base.load_assinatura(db, FIXED_CLINICA_ID)
        access_profile = base.load_access_profile(db, FIXED_CLINICA_ID)
        etiqueta_modelo = base.load_etiqueta_modelo(db, FIXED_CLINICA_ID)
        counts = base.load_related_counts(db, FIXED_CLINICA_ID)
        unknown_links = base.load_unknown_links(db, FIXED_CLINICA_ID)
        email_audit_records = base.load_email_audit_records(db, FIXED_EXPECTED_EMAIL)
        user_link_issues = base.load_user_link_issues(db, FIXED_CLINICA_ID)
        prestador_link_issues = base.load_prestador_link_issues(db, FIXED_CLINICA_ID)
        access_profile_report = base.validate_access_profile(access_profile)
        etiqueta_modelo_report = base.validate_etiqueta_modelo(etiqueta_modelo)
        return {
            "current_database": current_database,
            "clinic": clinic,
            "users": users,
            "prestadores": prestadores,
            "assinatura": assinatura,
            "access_profile_report": access_profile_report,
            "etiqueta_modelo_report": etiqueta_modelo_report,
            "counts": counts,
            "unknown_links": unknown_links,
            "email_audit_records": email_audit_records,
            "user_link_issues": user_link_issues,
            "prestador_link_issues": prestador_link_issues,
        }


def validate_snapshot(snapshot: dict[str, Any]) -> None:
    if snapshot["current_database"] != EXPECTED_DATABASE:
        raise RuntimeError(
            f"database incorreto: esperado={EXPECTED_DATABASE} recebido={snapshot['current_database']}"
        )
    clinic = snapshot["clinic"]
    if not clinic or int(clinic.get("id") or 0) != FIXED_CLINICA_ID:
        raise RuntimeError("clinica nao encontrada")
    if str(clinic.get("email", "")) != FIXED_EXPECTED_EMAIL:
        raise RuntimeError(
            f"email da clinica nao confere: esperado={FIXED_EXPECTED_EMAIL} recebido={clinic.get('email')}"
        )
    base.validate_expected_user_rows(snapshot["users"])
    base.validate_expected_prestadores(snapshot["prestadores"])
    if len(snapshot["access_profile_report"]["ids"]) != EXPECTED_ACCESS_PROFILE_COUNT:
        raise RuntimeError("access_profile divergente do esperado")
    if snapshot["etiqueta_modelo_report"]["ids"] != EXPECTED_ETIQUETA_MODELO_IDS:
        raise RuntimeError("etiqueta_modelo divergente do esperado")
    if not snapshot["assinatura"]:
        raise RuntimeError("assinatura/plataforma_assinaturas nao encontrada")
    if snapshot["unknown_links"]:
        raise RuntimeError(f"vinculos nao mapeados encontrados: {json.dumps(snapshot['unknown_links'], ensure_ascii=False)}")
    if snapshot["user_link_issues"]:
        raise RuntimeError(f"vinculos de usuario inesperados: {json.dumps(snapshot['user_link_issues'], ensure_ascii=False)}")
    if snapshot["prestador_link_issues"]:
        raise RuntimeError(f"vinculos de prestador inesperados: {json.dumps(snapshot['prestador_link_issues'], ensure_ascii=False)}")
    if not snapshot["email_audit_records"]:
        raise RuntimeError("email_codes nao encontrado para liberar o e-mail")


def print_dry_run(snapshot: dict[str, Any]) -> None:
    print("MODO: DRY-RUN")
    print(f"DATABASE_ATUAL = {snapshot['current_database']}")
    print(f"CLINICA_ENCONTRADA = {json.dumps(snapshot['clinic'], ensure_ascii=False, default=str)}")
    print(f"E_MAIL_ESPERADO = {FIXED_EXPECTED_EMAIL}")
    print(f"USUARIOS_ENCONTRADOS = {json.dumps(snapshot['users'], ensure_ascii=False, default=str)}")
    print(f"PRESTADORES_ENCONTRADOS = {json.dumps(snapshot['prestadores'], ensure_ascii=False, default=str)}")
    print(f"ASSINATURA_ENCONTRADA = {json.dumps(snapshot['assinatura'], ensure_ascii=False, default=str)}")
    print(f"ACCESS_PROFILE_RELATORIO = {json.dumps(snapshot['access_profile_report'], ensure_ascii=False, default=str)}")
    print(f"ETIQUETA_MODELO_RELATORIO = {json.dumps(snapshot['etiqueta_modelo_report'], ensure_ascii=False, default=str)}")
    print(f"EMAIL_CODES_ENCONTRADOS = {json.dumps(snapshot['email_audit_records'], ensure_ascii=False, default=str)}")
    print(f"DADOS_IMPEDITIVOS = {json.dumps({k: snapshot['counts'].get(k, 0) for k in ['pacientes', 'tratamento', 'lancamento', 'agenda_legado_evento', 'agenda_legado_bloqueio', 'anamnese_respostas', 'plataforma_cobrancas']}, ensure_ascii=False)}")
    print(f"ORDEM_PLANEJADA_DE_EXCLUSAO = {json.dumps(planned_delete_order(), ensure_ascii=False)}")
    print(f"VINCULOS_NAO_MAPEADOS = {json.dumps(snapshot['unknown_links'], ensure_ascii=False, default=str)}")
    print(f"VINCULOS_USUARIO_EXTRA = {json.dumps(snapshot['user_link_issues'], ensure_ascii=False, default=str)}")
    print(f"VINCULOS_PRESTADOR_EXTRA = {json.dumps(snapshot['prestador_link_issues'], ensure_ascii=False, default=str)}")
    print(f"CONTAGENS = {json.dumps(snapshot['counts'], ensure_ascii=False, default=str)}")
    print("AVISO = dry-run somente leitura; nada foi alterado.")


def execute_delete(snapshot: dict[str, Any]) -> None:
    with SessionLocal() as read_db:
        current_database = base.get_current_database(read_db)
        if current_database != EXPECTED_DATABASE:
            raise RuntimeError(f"execucao real bloqueada: database incorreto esperado={EXPECTED_DATABASE} recebido={current_database}")
        clinic = base.load_clinic(read_db, FIXED_CLINICA_ID)
        if not clinic or str(clinic.get("email", "")) != FIXED_EXPECTED_EMAIL:
            raise RuntimeError("execucao real bloqueada: clinica/email nao conferem no momento da execucao")
        email_codes_now = base.load_email_audit_records(read_db, FIXED_EXPECTED_EMAIL)
        if not email_codes_now:
            raise RuntimeError("execucao real bloqueada: email_codes nao encontrado no momento da execucao")

    print("MODO: EXECUTE")
    print(f"DATABASE_ATUAL = {current_database}")
    print(f"ORDEM_PLANEJADA_DE_EXCLUSAO = {json.dumps(planned_delete_order(), ensure_ascii=False)}")

    with SessionLocal() as write_db:
        with write_db.begin():
            deleted_email_codes = base.delete_email_codes(write_db, FIXED_EXPECTED_EMAIL)
            deleted_usuario_perfil = base.delete_where_clinica(write_db, "usuario_perfil_acesso", FIXED_CLINICA_ID)
            deleted_access_profile = base.delete_where_clinica(write_db, "access_profile", FIXED_CLINICA_ID)
            deleted_etiqueta_modelo = base.delete_where_clinica(write_db, "etiqueta_modelo", FIXED_CLINICA_ID)
            deleted_anamnese_perguntas = base.delete_where_clinica(write_db, "anamnese_perguntas", FIXED_CLINICA_ID)
            deleted_anamnese_questionarios = base.delete_where_clinica(write_db, "anamnese_questionarios", FIXED_CLINICA_ID)
            deleted_proc_material = base.delete_where_clinica(write_db, "procedimento_material", FIXED_CLINICA_ID)
            deleted_proc_fase = base.delete_where_clinica(write_db, "procedimento_fase", FIXED_CLINICA_ID)
            deleted_proc_gen_fase = base.delete_where_clinica(write_db, "procedimento_generico_fase", FIXED_CLINICA_ID)
            deleted_proc_gen_material = base.delete_where_clinica(write_db, "procedimento_generico_material", FIXED_CLINICA_ID)
            deleted_material = base.delete_material_by_lista_material(write_db, FIXED_CLINICA_ID)
            deleted_lista_material = base.delete_where_clinica(write_db, "lista_material", FIXED_CLINICA_ID)
            deleted_procedimento = base.delete_where_clinica(write_db, "procedimento", FIXED_CLINICA_ID)
            deleted_procedimento_generico = base.delete_where_clinica(write_db, "procedimento_generico", FIXED_CLINICA_ID)
            deleted_procedimento_tabela = base.delete_where_clinica(write_db, "procedimento_tabela", FIXED_CLINICA_ID)
            deleted_plano = base.delete_where_clinica(write_db, "plano_odonto", FIXED_CLINICA_ID)
            deleted_convenio = base.delete_where_clinica(write_db, "convenio_odonto", FIXED_CLINICA_ID)
            deleted_categoria = base.delete_where_clinica(write_db, "categoria_financeira", FIXED_CLINICA_ID)
            deleted_grupo = base.delete_where_clinica(write_db, "grupo_financeiro", FIXED_CLINICA_ID)
            deleted_indice = base.delete_where_clinica(write_db, "indice_financeiro", FIXED_CLINICA_ID)
            deleted_item = base.delete_where_clinica(write_db, "item_auxiliar", FIXED_CLINICA_ID)
            deleted_simbolo = base.delete_where_clinica(write_db, "simbolo_grafico_catalogo", FIXED_CLINICA_ID)
            deleted_doenca = base.delete_where_clinica(write_db, "doenca_cid", FIXED_CLINICA_ID)
            deleted_assinaturas = base.delete_where_clinica(write_db, "assinaturas", FIXED_CLINICA_ID)
            deleted_plataforma_assinaturas = base.delete_where_clinica(write_db, "plataforma_assinaturas", FIXED_CLINICA_ID)
            deleted_plataforma_cobrancas = base.delete_where_clinica(write_db, "plataforma_cobrancas", FIXED_CLINICA_ID)
            deleted_prestadores = base.delete_where_in(write_db, "prestador_odonto", "id", sorted(EXPECTED_PRESTADOR_IDS))
            deleted_usuarios = base.delete_where_in(write_db, "usuarios", "id", sorted(EXPECTED_USER_IDS))
            deleted_unidade = base.delete_where_clinica(write_db, "unidade_atendimento", FIXED_CLINICA_ID)
            deleted_relatorio_config = base.delete_where_clinica(write_db, "relatorio_config", FIXED_CLINICA_ID)
            result = write_db.execute(
                text("delete from clinicas where id = :clinica_id and email = :expected_email"),
                {"clinica_id": FIXED_CLINICA_ID, "expected_email": FIXED_EXPECTED_EMAIL},
            )
            if int(result.rowcount or 0) != 1:
                raise RuntimeError("execucao real bloqueada: delete final da clinica nao afetou exatamente 1 linha")

        print(f"- DELETE email_codes por email: {deleted_email_codes}")
        print(f"- DELETE usuario_perfil_acesso: {deleted_usuario_perfil}")
        print(f"- DELETE access_profile: {deleted_access_profile}")
        print(f"- DELETE etiqueta_modelo: {deleted_etiqueta_modelo}")
        print(f"- DELETE anamnese_perguntas: {deleted_anamnese_perguntas}")
        print(f"- DELETE anamnese_questionarios: {deleted_anamnese_questionarios}")
        print(f"- DELETE procedimento_material: {deleted_proc_material}")
        print(f"- DELETE procedimento_fase: {deleted_proc_fase}")
        print(f"- DELETE procedimento_generico_fase: {deleted_proc_gen_fase}")
        print(f"- DELETE procedimento_generico_material: {deleted_proc_gen_material}")
        print(f"- DELETE material por lista_material: {deleted_material}")
        print(f"- DELETE lista_material: {deleted_lista_material}")
        print(f"- DELETE procedimento: {deleted_procedimento}")
        print(f"- DELETE procedimento_generico: {deleted_procedimento_generico}")
        print(f"- DELETE procedimento_tabela: {deleted_procedimento_tabela}")
        print(f"- DELETE plano_odonto: {deleted_plano}")
        print(f"- DELETE convenio_odonto: {deleted_convenio}")
        print(f"- DELETE categoria_financeira: {deleted_categoria}")
        print(f"- DELETE grupo_financeiro: {deleted_grupo}")
        print(f"- DELETE indice_financeiro: {deleted_indice}")
        print(f"- DELETE item_auxiliar: {deleted_item}")
        print(f"- DELETE simbolo_grafico_catalogo: {deleted_simbolo}")
        print(f"- DELETE doenca_cid: {deleted_doenca}")
        print(f"- DELETE assinaturas: {deleted_assinaturas}")
        print(f"- DELETE plataforma_assinaturas: {deleted_plataforma_assinaturas}")
        print(f"- DELETE plataforma_cobrancas: {deleted_plataforma_cobrancas}")
        print(f"- DELETE prestador_odonto: {deleted_prestadores}")
        print(f"- DELETE usuarios: {deleted_usuarios}")
        print(f"- DELETE unidade_atendimento: {deleted_unidade}")
        print(f"- DELETE relatorio_config: {deleted_relatorio_config}")
        print("- DELETE clinicas: 1")

    with SessionLocal() as verify_db:
        clinic_after = base.load_clinic(verify_db, FIXED_CLINICA_ID)
        users_after = base.load_expected_users(verify_db, FIXED_CLINICA_ID, FIXED_EXPECTED_EMAIL)
        prestadores_after = base.load_expected_prestadores(verify_db, FIXED_CLINICA_ID)
        email_codes_after = base.load_email_audit_records(verify_db, FIXED_EXPECTED_EMAIL)
        unit_after = verify_db.execute(
            text("select count(*) from unidade_atendimento where clinica_id = :clinica_id"),
            {"clinica_id": FIXED_CLINICA_ID},
        ).scalar_one()
        print(f"CLINICA_DEPOIS = {json.dumps(clinic_after, ensure_ascii=False, default=str)}")
        print(f"USUARIOS_DEPOIS = {json.dumps(users_after, ensure_ascii=False, default=str)}")
        print(f"PRESTADORES_DEPOIS = {json.dumps(prestadores_after, ensure_ascii=False, default=str)}")
        print(f"EMAIL_CODES_DEPOIS = {json.dumps(email_codes_after, ensure_ascii=False, default=str)}")
        print(f"UNIDADE_ATENDIMENTO_DEPOIS = {unit_after}")
        if clinic_after is not None:
            raise RuntimeError("execucao real bloqueada: clinica 12 permaneceu apos o DELETE final")
        if users_after:
            raise RuntimeError("execucao real bloqueada: usuarios permaneceram apos o DELETE final")
        if prestadores_after:
            raise RuntimeError("execucao real bloqueada: prestadores permaneceram apos o DELETE final")
        if email_codes_after:
            raise RuntimeError("execucao real bloqueada: email_codes permaneceu apos o DELETE final")
        if int(unit_after or 0) != 0:
            raise RuntimeError("execucao real bloqueada: unidade_atendimento permaneceu apos o DELETE final")

    print("AVISO: execute controlado concluido em transacao; commit ocorreu somente ao final da rotina.")


def main() -> None:
    args = parse_args()
    validate_fixed_safety_args(args)
    snapshot = collect_snapshot()
    validate_snapshot(snapshot)

    if not args.execute:
        print_dry_run(snapshot)
        return

    execute_delete(snapshot)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, SQLAlchemyError) as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
