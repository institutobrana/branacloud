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


FIXED_CLINICA_ID = 15
FIXED_EXPECTED_EMAIL = "institutobrana@gmail.com"
EXPECTED_DATABASE = "brana_saas"
EXPECTED_CLINICA_NAME = "Tel"
EXPECTED_USER_IDS = {34, 35}
EXPECTED_SYSTEM_USER_ID = 34
EXPECTED_ADMIN_USER_ID = 35
EXPECTED_PRESTADOR_ID = 21
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

EXPECTED_ZERO_DATA_TABLES = [
    "pacientes",
    "tratamento",
    "lancamento",
    "agenda_legado_evento",
    "agenda_legado_bloqueio",
    "anamnese_respostas",
]

CLINICA_COUNT_TABLES = [
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
    "etiqueta_modelo",
    "grupo_financeiro",
    "indice_cotacao",
    "indice_financeiro",
    "item_auxiliar",
    "lancamento",
    "lista_material",
    "medicamento",
    "modelos_documento",
    "pacientes",
    "plano_odonto",
    "plataforma_assinaturas",
    "plataforma_cobrancas",
    "prestador",
    "prestador_comissao",
    "prestador_comissao_odonto",
    "prestador_credenciamento",
    "prestador_credenciamento_odonto",
    "prestador_odonto",
    "procedimento",
    "procedimento_fase",
    "procedimento_generico",
    "procedimento_generico_fase",
    "procedimento_generico_material",
    "procedimento_material",
    "procedimento_tabela",
    "protetico",
    "relatorio_config",
    "restricao_terapeutica",
    "servico_protetico",
    "simbolo_grafico_catalogo",
    "tratamento",
    "unidade_atendimento",
    "usuario_perfil_acesso",
    "usuarios",
]

DELETE_ORDER = [
    "1. email_codes relacionados a institutobrana@gmail.com",
    "2. procedimento_material",
    "3. procedimento_fase",
    "4. procedimento_generico_material",
    "5. procedimento_generico_fase",
    "6. material por lista_material relacionada",
    "7. lista_material",
    "8. anamnese_perguntas",
    "9. anamnese_questionarios",
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
    "21. anamnese_respostas",
    "22. assinaturas",
    "23. plataforma_assinaturas",
    "24. plataforma_cobrancas",
    "25. usuario_perfil_acesso",
    "26. access_profile",
    "27. etiqueta_modelo",
    "28. prestador_odonto",
    "29. usuarios",
    "30. clinicas.id 15 por ultimo (DELETE por id/email)",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Runner controlado para diagnostico e futura exclusao segura da clinica 15."
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


def inspector(db):
    return inspect(db.get_bind())


def table_exists(db, table_name: str) -> bool:
    return table_name in inspector(db).get_table_names()


def table_columns(db, table_name: str) -> set[str]:
    if not table_exists(db, table_name):
        return set()
    return {column["name"] for column in inspector(db).get_columns(table_name)}


def table_has_column(db, table_name: str, column_name: str) -> bool:
    return column_name in table_columns(db, table_name)


def current_database(db) -> str:
    return db.execute(text("select current_database()")).scalar_one()


def load_clinic(db, clinica_id: int) -> dict[str, Any] | None:
    columns = [c for c in [
        "id",
        "nome",
        "email",
        "cnpj",
        "tipo_conta",
        "licenca_usuario",
        "chave_licenca",
        "data_ativacao",
        "nome_tabela_procedimentos",
        "opcoes_sistema_json",
        "trial_ate",
        "ativo",
        "criado_em",
    ] if c in table_columns(db, "clinicas")]
    row = db.execute(
        text(f"select {', '.join(columns)} from clinicas where id = :clinica_id"),
        {"clinica_id": clinica_id},
    ).mappings().first()
    return dict(row) if row else None


def load_users(db, clinica_id: int, expected_email: str) -> list[dict[str, Any]]:
    columns = [c for c in [
        "id",
        "codigo",
        "nome",
        "apelido",
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
        "clinica_id",
        "senha_hash",
        "senha_interna_hash",
        "permissoes_json",
    ] if c in table_columns(db, "usuarios")]
    rows = db.execute(
        text(f"""
            select {', '.join(columns)}
            from usuarios
            where clinica_id = :clinica_id or email = :expected_email
            order by id
        """),
        {"clinica_id": clinica_id, "expected_email": expected_email},
    ).mappings().all()
    return [dict(row) for row in rows]


def load_prestadores(db, clinica_id: int) -> list[dict[str, Any]]:
    columns = [c for c in [
        "id",
        "clinica_id",
        "source_id",
        "usuario_id",
        "codigo",
        "nome",
        "apelido",
        "tipo_prestador",
        "data_inicio",
        "data_termino",
        "inativo",
        "executa_procedimento",
        "is_system_prestador",
        "cro",
        "uf_cro",
        "cpf",
        "rg",
        "inss",
        "ccm",
        "contrato",
        "cnes",
        "cbos",
        "nascimento",
        "sexo",
        "estado_civil",
        "prefixo",
        "data_inclusao",
        "data_alteracao",
        "id_interno",
        "email",
        "homepage",
        "observacoes",
    ] if c in table_columns(db, "prestador_odonto")]
    rows = db.execute(
        text(f"""
            select {', '.join(columns)}
            from prestador_odonto
            where clinica_id = :clinica_id
            order by id
        """),
        {"clinica_id": clinica_id},
    ).mappings().all()
    return [dict(row) for row in rows]


def load_access_profile(db, clinica_id: int) -> list[dict[str, Any]]:
    if not table_exists(db, "access_profile"):
        return []
    columns = [c for c in ["id", "clinica_id", "source_id", "nome", "reservado", "criado_em", "atualizado_em"] if c in table_columns(db, "access_profile")]
    rows = db.execute(
        text(f"""
            select {', '.join(columns)}
            from access_profile
            where clinica_id = :clinica_id
            order by source_id, id
        """),
        {"clinica_id": clinica_id},
    ).mappings().all()
    return [dict(row) for row in rows]


def load_usuario_perfil_acesso(db, clinica_id: int) -> list[dict[str, Any]]:
    if not table_exists(db, "usuario_perfil_acesso"):
        return []
    columns = [c for c in ["id", "clinica_id", "usuario_id", "prestador_id", "perfil_id"] if c in table_columns(db, "usuario_perfil_acesso")]
    rows = db.execute(
        text(f"""
            select {', '.join(columns)}
            from usuario_perfil_acesso
            where clinica_id = :clinica_id
            order by id
        """),
        {"clinica_id": clinica_id},
    ).mappings().all()
    return [dict(row) for row in rows]


def load_procedure_tables(db, clinica_id: int) -> list[dict[str, Any]]:
    if not table_exists(db, "procedimento_tabela"):
        return []
    columns = [c for c in ["id", "clinica_id", "codigo", "nome", "nro_indice", "fonte_pagadora", "nro_credenciamento", "inativo", "tipo_tiss_id"] if c in table_columns(db, "procedimento_tabela")]
    rows = db.execute(
        text(f"""
            select {', '.join(columns)}
            from procedimento_tabela
            where clinica_id = :clinica_id
            order by codigo, id
        """),
        {"clinica_id": clinica_id},
    ).mappings().all()
    return [dict(row) for row in rows]


def load_email_codes(db, expected_email: str) -> list[dict[str, Any]]:
    if not table_exists(db, "email_codes") or "email" not in table_columns(db, "email_codes"):
        return []
    columns = [c for c in ["id", "email", "purpose", "code_hash", "expires_at", "used", "created_at"] if c in table_columns(db, "email_codes")]
    rows = db.execute(
        text(f"""
            select {', '.join(columns)}
            from email_codes
            where email = :expected_email
            order by id
        """),
        {"expected_email": expected_email},
    ).mappings().all()
    return [dict(row) for row in rows]


def load_audit_records(db, clinica_id: int, expected_email: str) -> list[dict[str, Any]]:
    if not table_exists(db, "plataforma_auditoria"):
        return []
    columns = [c for c in ["id", "actor_user_id", "actor_email", "acao", "alvo_tipo", "alvo_id", "detalhes_json", "ip", "criado_em"] if c in table_columns(db, "plataforma_auditoria")]
    if not columns:
        return []
    rows = db.execute(
        text(f"""
            select {', '.join(columns)}
            from plataforma_auditoria
            where lower(actor_email) = lower(:expected_email)
               or alvo_id = :clinica_id_text
               or (alvo_tipo in ('clinica', 'clinicas') and alvo_id = :clinica_id_text)
            order by id desc
        """),
        {"expected_email": expected_email, "clinica_id_text": str(clinica_id)},
    ).mappings().all()
    return [dict(row) for row in rows]


def load_related_counts(db, clinica_id: int) -> OrderedDict[str, int]:
    inspector_obj = inspector(db)
    counts: OrderedDict[str, int] = OrderedDict()
    for table_name in sorted(inspector_obj.get_table_names()):
        columns = {column["name"] for column in inspector_obj.get_columns(table_name)}
        if "clinica_id" not in columns:
            continue
        try:
            count = db.execute(
                text(f"select count(*) from {table_name} where clinica_id = :clinica_id"),
                {"clinica_id": clinica_id},
            ).scalar_one()
            counts[table_name] = int(count)
        except Exception:
            counts[table_name] = 0
    return counts


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


def delete_material_by_lista_material(db, clinica_id: int) -> int:
    if not table_exists(db, "material") or not table_exists(db, "lista_material"):
        return 0
    result = db.execute(
        text(
            """
            delete from material
            where lista_id in (
                select id
                from lista_material
                where clinica_id = :clinica_id
            )
            """
        ),
        {"clinica_id": clinica_id},
    )
    return int(result.rowcount or 0)


def delete_email_codes(db, expected_email: str) -> int:
    if not table_exists(db, "email_codes") or not table_has_column(db, "email_codes", "email"):
        return 0
    result = db.execute(
        text("delete from email_codes where email = :expected_email"),
        {"expected_email": expected_email},
    )
    return int(result.rowcount or 0)


def validate_clinic(clinic: dict[str, Any] | None) -> None:
    if not clinic:
        raise RuntimeError("execucao bloqueada: clinica nao encontrada")
    if int(clinic.get("id") or 0) != FIXED_CLINICA_ID:
        raise RuntimeError("execucao bloqueada: clinica_id divergente")
    if str(clinic.get("email", "")) != FIXED_EXPECTED_EMAIL:
        raise RuntimeError("execucao bloqueada: e-mail da clinica nao confere")
    if str(clinic.get("nome", "")) != EXPECTED_CLINICA_NAME:
        raise RuntimeError("execucao bloqueada: nome da clinica nao confere")


def validate_users(users: list[dict[str, Any]]) -> None:
    ids = {int(user["id"]) for user in users}
    if ids != EXPECTED_USER_IDS:
        raise RuntimeError(f"execucao bloqueada: usuarios inesperados={sorted(ids)}")
    by_id = {int(user["id"]): user for user in users}
    sys_user = by_id.get(EXPECTED_SYSTEM_USER_ID)
    admin_user = by_id.get(EXPECTED_ADMIN_USER_ID)
    if not sys_user or not admin_user:
        raise RuntimeError("execucao bloqueada: usuarios esperados nao encontrados")
    if str(sys_user.get("email", "")).lower() != "clinica.255.c15@system.brana.local":
        raise RuntimeError("execucao bloqueada: usuario sistema divergente")
    if str(admin_user.get("email", "")).lower() != FIXED_EXPECTED_EMAIL.lower():
        raise RuntimeError("execucao bloqueada: usuario admin divergente")
    if not bool(sys_user.get("is_system_user")) or bool(sys_user.get("is_admin")):
        raise RuntimeError("execucao bloqueada: flags do usuario sistema divergentes")
    if not bool(admin_user.get("is_admin")) or bool(admin_user.get("is_system_user")):
        raise RuntimeError("execucao bloqueada: flags do usuario admin divergentes")


def validate_prestadores(prestadores: list[dict[str, Any]]) -> None:
    ids = {int(item["id"]) for item in prestadores}
    if ids != {EXPECTED_PRESTADOR_ID}:
        raise RuntimeError(f"execucao bloqueada: prestadores inesperados={sorted(ids)}")
    prestador = prestadores[0]
    if int(prestador.get("usuario_id") or 0) != EXPECTED_SYSTEM_USER_ID:
        raise RuntimeError("execucao bloqueada: prestador sistema divergente")
    if int(prestador.get("clinica_id") or 0) != FIXED_CLINICA_ID:
        raise RuntimeError("execucao bloqueada: prestador fora da clinica 15")


def validate_access_profile(access_profile: list[dict[str, Any]]) -> dict[str, Any]:
    names = [str(item.get("nome", "")) for item in access_profile]
    report = {
        "count": len(access_profile),
        "names": names,
        "expected_count": EXPECTED_ACCESS_PROFILE_COUNT,
        "expected_names": EXPECTED_ACCESS_PROFILE_NAMES,
        "matches_expected": len(access_profile) == EXPECTED_ACCESS_PROFILE_COUNT and names == EXPECTED_ACCESS_PROFILE_NAMES,
    }
    if not report["matches_expected"]:
        raise RuntimeError(f"execucao bloqueada: access_profile divergente {json.dumps(report, ensure_ascii=False)}")
    return report


def load_procedure_cross_links(db, clinica_id: int) -> list[dict[str, Any]]:
    if not table_exists(db, "procedimento") or not table_exists(db, "procedimento_tabela"):
        return []
    rows = db.execute(
        text(
            """
            select p.id, p.codigo, p.nome, p.tabela_id, pt.clinica_id as tabela_clinica_id
            from procedimento p
            left join procedimento_tabela pt on pt.id = p.tabela_id
            where p.clinica_id = :clinica_id
              and (pt.clinica_id is null or pt.clinica_id <> p.clinica_id)
            order by p.id
            """
        ),
        {"clinica_id": clinica_id},
    ).mappings().all()
    return [dict(row) for row in rows]


def load_user_link_issues(db, clinica_id: int) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    if table_exists(db, "usuario_perfil_acesso"):
        rows = db.execute(
            text(
                """
                select id, clinica_id, usuario_id, prestador_id, perfil_id
                from usuario_perfil_acesso
                where clinica_id = :clinica_id
                order by id
                """
            ),
            {"clinica_id": clinica_id},
        ).mappings().all()
        if rows:
            issues.extend(dict(row) for row in rows)
    return issues


def load_prestador_link_issues(db, clinica_id: int) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    if table_exists(db, "prestador_odonto"):
        rows = db.execute(
            text(
                """
                select id, clinica_id, source_id, usuario_id
                from prestador_odonto
                where clinica_id = :clinica_id
                order by id
                """
            ),
            {"clinica_id": clinica_id},
        ).mappings().all()
        for row in rows:
            row_dict = dict(row)
            if int(row_dict.get("id") or 0) != EXPECTED_PRESTADOR_ID or int(row_dict.get("usuario_id") or 0) != EXPECTED_SYSTEM_USER_ID:
                issues.append(row_dict)
    return issues


def planned_delete_order() -> list[str]:
    return DELETE_ORDER


def print_dry_run_report(
    *,
    current_db: str,
    clinic: dict[str, Any],
    users: list[dict[str, Any]],
    prestadores: list[dict[str, Any]],
    access_profile: list[dict[str, Any]],
    usuario_perfil_acesso: list[dict[str, Any]],
    procedure_tables: list[dict[str, Any]],
    counts: OrderedDict[str, int],
    email_codes: list[dict[str, Any]],
    audit_records: list[dict[str, Any]],
    procedure_cross_links: list[dict[str, Any]],
    user_link_issues: list[dict[str, Any]],
    prestador_link_issues: list[dict[str, Any]],
) -> None:
    print("MODO: DRY-RUN")
    print(f"DATABASE_ATUAL: {current_db}")
    print(f"CLINICA_ENCONTRADA: {json.dumps(clinic, ensure_ascii=False, default=str)}")
    print(f"USUARIOS_ENCONTRADOS: {json.dumps(users, ensure_ascii=False, default=str)}")
    print(f"PRESTADORES_ENCONTRADOS: {json.dumps(prestadores, ensure_ascii=False, default=str)}")
    print(f"ACCESS_PROFILE_RELATORIO: {json.dumps(access_profile, ensure_ascii=False, default=str)}")
    print(f"USUARIO_PERFIL_ACESSO: {json.dumps(usuario_perfil_acesso, ensure_ascii=False, default=str)}")
    print(f"PROCEDIMENTO_TABELA_RELATORIO: {json.dumps(procedure_tables, ensure_ascii=False, default=str)}")
    print(f"EMAIL_CODES_ENCONTRADOS: {json.dumps(email_codes, ensure_ascii=False, default=str)}")
    print(f"PLATAFORMA_AUDITORIA_ENCONTRADA: {json.dumps(audit_records, ensure_ascii=False, default=str)}")
    print(f"PROCEDIMENTO_MIX_ESTRANHO: {json.dumps(procedure_cross_links, ensure_ascii=False, default=str)}")
    print(f"VINCULOS_USUARIO_EXTRA: {json.dumps(user_link_issues, ensure_ascii=False, default=str)}")
    print(f"VINCULOS_PRESTADOR_EXTRA: {json.dumps(prestador_link_issues, ensure_ascii=False, default=str)}")
    print(f"CONTAGENS_POR_TABELA: {json.dumps(counts, ensure_ascii=False, default=str)}")
    print(f"ORDEM_PLANEJADA_DE_EXCLUSAO: {json.dumps(planned_delete_order(), ensure_ascii=False)}")
    print("PLANO_EMAIL_CODES: liberar o e-mail na execucao real futura")
    print("AVISO: dry-run somente leitura; nada foi alterado.")


def execute_delete_plan(
    *,
    db,
    current_db: str,
    clinic: dict[str, Any],
    users: list[dict[str, Any]],
    prestadores: list[dict[str, Any]],
    access_profile: list[dict[str, Any]],
    usuario_perfil_acesso: list[dict[str, Any]],
    procedure_tables: list[dict[str, Any]],
    counts: OrderedDict[str, int],
    email_codes: list[dict[str, Any]],
    audit_records: list[dict[str, Any]],
    procedure_cross_links: list[dict[str, Any]],
    user_link_issues: list[dict[str, Any]],
    prestador_link_issues: list[dict[str, Any]],
) -> None:
    if current_db != EXPECTED_DATABASE:
        raise RuntimeError(f"execucao bloqueada: database incorreto esperado={EXPECTED_DATABASE} recebido={current_db}")
    validate_clinic(clinic)
    validate_users(users)
    validate_prestadores(prestadores)
    access_profile_report = validate_access_profile(access_profile)
    if usuario_perfil_acesso:
        raise RuntimeError("execucao bloqueada: usuario_perfil_acesso ainda possui registros")
    if procedure_cross_links:
        raise RuntimeError("execucao bloqueada: procedimento possui links cruzados inesperados")
    if user_link_issues:
        raise RuntimeError("execucao bloqueada: existem vinculos inesperados de usuario")
    if prestador_link_issues:
        raise RuntimeError("execucao bloqueada: existem vinculos inesperados de prestador")
    if not email_codes:
        raise RuntimeError("execucao bloqueada: email_codes nao encontrado para liberar o e-mail")
    for table_name in EXPECTED_ZERO_DATA_TABLES:
        if counts.get(table_name, 0):
            raise RuntimeError(f"execucao bloqueada: dados reais nao esperados em {table_name}={counts[table_name]}")

    db.rollback()
    print("MODO: EXECUTE")
    print(f"DATABASE_ATUAL: {current_db}")
    print(f"ACCESS_PROFILE_RELATORIO: {json.dumps(access_profile_report, ensure_ascii=False, default=str)}")
    print(f"EMAIL_CODES_ENCONTRADOS: {json.dumps(email_codes, ensure_ascii=False, default=str)}")
    print(f"ORDEM_EXECUCAO: {json.dumps(planned_delete_order(), ensure_ascii=False)}")

    with db.begin():
        deleted_email_codes = delete_email_codes(db, FIXED_EXPECTED_EMAIL)
        print(f"- DELETE email_codes por email: {deleted_email_codes}")

        deleted_proc_material = delete_where_clinica(db, "procedimento_material", FIXED_CLINICA_ID)
        deleted_proc_fase = delete_where_clinica(db, "procedimento_fase", FIXED_CLINICA_ID)
        deleted_proc_gen_material = delete_where_clinica(db, "procedimento_generico_material", FIXED_CLINICA_ID)
        deleted_proc_gen_fase = delete_where_clinica(db, "procedimento_generico_fase", FIXED_CLINICA_ID)
        print(f"- DELETE procedimento_material: {deleted_proc_material}")
        print(f"- DELETE procedimento_fase: {deleted_proc_fase}")
        print(f"- DELETE procedimento_generico_material: {deleted_proc_gen_material}")
        print(f"- DELETE procedimento_generico_fase: {deleted_proc_gen_fase}")

        deleted_material = delete_material_by_lista_material(db, FIXED_CLINICA_ID)
        deleted_lista_material = delete_where_clinica(db, "lista_material", FIXED_CLINICA_ID)
        print(f"- DELETE material por lista_material: {deleted_material}")
        print(f"- DELETE lista_material: {deleted_lista_material}")

        for table_name in [
            "anamnese_perguntas",
            "anamnese_questionarios",
            "procedimento",
            "procedimento_generico",
            "procedimento_tabela",
            "plano_odonto",
            "convenio_odonto",
            "categoria_financeira",
            "grupo_financeiro",
            "indice_financeiro",
            "item_auxiliar",
            "simbolo_grafico_catalogo",
            "doenca_cid",
            "anamnese_respostas",
            "assinaturas",
            "plataforma_assinaturas",
            "plataforma_cobrancas",
            "usuario_perfil_acesso",
            "access_profile",
            "etiqueta_modelo",
            "prestador_odonto",
            "usuarios",
            "prestador",
            "prestador_comissao",
            "prestador_comissao_odonto",
            "prestador_credenciamento",
            "prestador_credenciamento_odonto",
            "agenda_legado_evento",
            "agenda_legado_bloqueio",
            "controle_protetico",
            "calendario_faturamento_odonto",
            "medicamento",
            "restricao_terapeutica",
            "cenario",
            "contato",
            "unidade_atendimento",
            "relatorio_config",
        ]:
            if not table_exists(db, table_name):
                print(f"- tabela ausente ignorada: {table_name}")
                continue
            if table_name == "usuarios":
                deleted = delete_where_in(db, table_name, "id", sorted(EXPECTED_USER_IDS))
            elif table_name == "prestador_odonto":
                deleted = delete_where_in(db, table_name, "id", [EXPECTED_PRESTADOR_ID])
            else:
                deleted = delete_where_clinica(db, table_name, FIXED_CLINICA_ID)
            print(f"- DELETE {table_name}: {deleted}")

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
            raise RuntimeError("execucao bloqueada: delete final da clinica nao afetou exatamente 1 linha")

    counts_after = load_related_counts(db, FIXED_CLINICA_ID)
    print("CONTAGENS_DEPOIS:")
    for table, count in counts_after.items():
        print(f"- {table}: {count}")
    print(f"EMAIL_CODES_DEPOIS: {json.dumps(load_email_codes(db, FIXED_EXPECTED_EMAIL), ensure_ascii=False, default=str)}")
    print(f"CLINICA_DEPOIS: {json.dumps(load_clinic(db, FIXED_CLINICA_ID), ensure_ascii=False, default=str)}")
    print("AVISO: execute controlado concluido em transacao; commit ocorreu somente ao final da rotina.")


def main() -> None:
    args = parse_args()
    validate_fixed_safety_args(args)

    with SessionLocal() as db:
        current_db = current_database(db)
        clinic = load_clinic(db, args.clinica_id)
        users = load_users(db, args.clinica_id, args.expected_email)
        prestadores = load_prestadores(db, args.clinica_id)
        access_profile = load_access_profile(db, args.clinica_id)
        usuario_perfil_acesso = load_usuario_perfil_acesso(db, args.clinica_id)
        procedure_tables = load_procedure_tables(db, args.clinica_id)
        email_codes = load_email_codes(db, args.expected_email)
        audit_records = load_audit_records(db, args.clinica_id, args.expected_email)
        counts = load_related_counts(db, args.clinica_id)
        procedure_cross_links = load_procedure_cross_links(db, args.clinica_id)
        user_link_issues = load_user_link_issues(db, args.clinica_id)
        prestador_link_issues = load_prestador_link_issues(db, args.clinica_id)

        validate_clinic(clinic)
        validate_users(users)
        validate_prestadores(prestadores)
        access_profile_report = validate_access_profile(access_profile)

        if args.execute:
            execute_delete_plan(
                db=db,
                current_db=current_db,
                clinic=clinic,
                users=users,
                prestadores=prestadores,
                access_profile=access_profile,
                usuario_perfil_acesso=usuario_perfil_acesso,
                procedure_tables=procedure_tables,
                counts=counts,
                email_codes=email_codes,
                audit_records=audit_records,
                procedure_cross_links=procedure_cross_links,
                user_link_issues=user_link_issues,
                prestador_link_issues=prestador_link_issues,
            )
            return

        print_dry_run_report(
            current_db=current_db,
            clinic=clinic,
            users=users,
            prestadores=prestadores,
            access_profile=access_profile_report,
            usuario_perfil_acesso=usuario_perfil_acesso,
            procedure_tables=procedure_tables,
            counts=counts,
            email_codes=email_codes,
            audit_records=audit_records,
            procedure_cross_links=procedure_cross_links,
            user_link_issues=user_link_issues,
            prestador_link_issues=prestador_link_issues,
        )


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, SQLAlchemyError) as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        sys.exit(1)
