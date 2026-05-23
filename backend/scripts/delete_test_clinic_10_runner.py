from __future__ import annotations

import argparse
import json
import sys
from collections import OrderedDict
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = PROJECT_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from sqlalchemy import bindparam, inspect, text
from sqlalchemy.exc import SQLAlchemyError

from database import SessionLocal


FIXED_CLINICA_ID = 10
FIXED_EXPECTED_EMAIL = "institutobrana@gmail.com"
EXPECTED_DATABASE = "brana_saas"
EXPECTED_USER_IDS = {23, 24, 25}
EXPECTED_PRESTADOR_IDS = {15, 16}
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
EXPECTED_ETIQUETA_MODELO_IDS = [91, 92, 93, 94, 95, 96, 97, 98]

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

EMAIL_AUDIT_TABLES = {
    "email_codes": "email",
    "plataforma_auditoria": "actor_email",
}

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
    "24. prestador_odonto 15 e 16",
    "25. usuarios 23, 24 e 25",
    "26. clinicas.id 10 por ultimo (DELETE por id/email)",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Runner controlado para diagnostico e futura exclusao segura da clinica 10."
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


def get_current_database(db) -> str:
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
        text(f"""
            select {', '.join(columns)}
            from clinicas
            where id = :clinica_id
        """),
        {"clinica_id": clinica_id},
    ).mappings().first()
    return dict(row) if row else None


def load_expected_users(db, clinica_id: int, expected_email: str) -> list[dict[str, Any]]:
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


def load_expected_prestadores(db, clinica_id: int) -> list[dict[str, Any]]:
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


def load_assinatura(db, clinica_id: int) -> list[dict[str, Any]]:
    if not table_exists(db, "plataforma_assinaturas"):
        return []
    columns = [c for c in [
        "id",
        "clinica_id",
        "plano",
        "status",
        "inicio_em",
        "fim_em",
        "proxima_cobranca_em",
        "bloqueada",
        "atualizado_em",
    ] if c in table_columns(db, "plataforma_assinaturas")]
    rows = db.execute(
        text(f"""
            select {', '.join(columns)}
            from plataforma_assinaturas
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
            order by id
        """),
        {"clinica_id": clinica_id},
    ).mappings().all()
    return [dict(row) for row in rows]


def load_etiqueta_modelo(db, clinica_id: int) -> list[dict[str, Any]]:
    if not table_exists(db, "etiqueta_modelo"):
        return []
    columns = [c for c in [
        "id",
        "clinica_id",
        "padrao_id",
        "nome",
        "reservado",
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
    ] if c in table_columns(db, "etiqueta_modelo")]
    rows = db.execute(
        text(f"""
            select {', '.join(columns)}
            from etiqueta_modelo
            where clinica_id = :clinica_id
            order by id
        """),
        {"clinica_id": clinica_id},
    ).mappings().all()
    return [dict(row) for row in rows]


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


def load_related_counts(db, clinica_id: int) -> OrderedDict[str, int]:
    counts: OrderedDict[str, int] = OrderedDict()
    for table in KNOWN_CLINICA_SCOPED_TABLES:
        if not table_exists(db, table) or not table_has_column(db, table, "clinica_id"):
            counts[table] = 0
            continue
        count = db.execute(
            text(f"select count(*) from {table} where clinica_id = :clinica_id"),
            {"clinica_id": clinica_id},
        ).scalar_one()
        counts[table] = int(count)
    return counts


def load_unknown_links(db, clinica_id: int) -> list[dict[str, Any]]:
    unknown: list[dict[str, Any]] = []
    allowed = set(KNOWN_CLINICA_SCOPED_TABLES)
    for table_name in inspector(db).get_table_names():
        if table_name in allowed:
            continue
        if not table_has_column(db, table_name, "clinica_id"):
            continue
        count = db.execute(
            text(f"select count(*) from {table_name} where clinica_id = :clinica_id"),
            {"clinica_id": clinica_id},
        ).scalar_one()
        if int(count):
            unknown.append({"table_name": table_name, "column_name": "clinica_id", "qtd": int(count)})
    return unknown


def load_user_link_issues(db, clinica_id: int) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    for table_name in inspector(db).get_table_names():
        if not table_has_column(db, table_name, "usuario_id"):
            continue
        count = db.execute(
            text(f"select count(*) from {table_name} where usuario_id in :ids").bindparams(
                bindparam("ids", expanding=True)
            ),
            {"ids": sorted(EXPECTED_USER_IDS)},
        ).scalar_one()
        if int(count) and table_name not in {"prestador_odonto", "usuario_perfil_acesso"}:
            issues.append({"table_name": table_name, "column_name": "usuario_id", "qtd": int(count)})
    return issues


def load_prestador_link_issues(db, clinica_id: int) -> list[dict[str, Any]]:
    issues: list[dict[str, Any]] = []
    for table_name in inspector(db).get_table_names():
        if not table_has_column(db, table_name, "prestador_id"):
            continue
        count = db.execute(
            text(f"select count(*) from {table_name} where prestador_id in :ids").bindparams(
                bindparam("ids", expanding=True)
            ),
            {"ids": sorted(EXPECTED_PRESTADOR_IDS)},
        ).scalar_one()
        if int(count) and table_name not in {"usuarios", "usuario_perfil_acesso"}:
            issues.append({"table_name": table_name, "column_name": "prestador_id", "qtd": int(count)})
    return issues


def validate_expected_user_rows(users: list[dict[str, Any]]) -> None:
    user_ids = {int(user["id"]) for user in users}
    if user_ids != EXPECTED_USER_IDS:
        raise RuntimeError(
            f"dry-run bloqueado: usuarios inesperados encontrados={sorted(user_ids)} esperados={sorted(EXPECTED_USER_IDS)}"
        )
    for user in users:
        if int(user.get("clinica_id") or 0) != FIXED_CLINICA_ID:
            raise RuntimeError(
                "dry-run bloqueado: usuario vinculado fora da clinica 10 "
                f"({json.dumps(user, ensure_ascii=False, default=str)})"
            )


def validate_expected_prestadores(prestadores: list[dict[str, Any]]) -> None:
    prestador_ids = {int(prestador["id"]) for prestador in prestadores}
    if prestador_ids != EXPECTED_PRESTADOR_IDS:
        raise RuntimeError(
            f"dry-run bloqueado: prestadores inesperados encontrados={sorted(prestador_ids)} esperados={sorted(EXPECTED_PRESTADOR_IDS)}"
        )
    for prestador in prestadores:
        if int(prestador.get("clinica_id") or 0) != FIXED_CLINICA_ID:
            raise RuntimeError("dry-run bloqueado: prestador nao pertence a clinica 10")


def validate_access_profile(records: list[dict[str, Any]]) -> dict[str, Any]:
    ids = [int(record["id"]) for record in records]
    names = [str(record.get("nome", "")) for record in records]
    report = {
        "count": len(records),
        "ids": ids,
        "names": names,
        "matches_expected": len(records) == EXPECTED_ACCESS_PROFILE_COUNT and names == EXPECTED_ACCESS_PROFILE_NAMES,
    }
    if not report["matches_expected"]:
        raise RuntimeError(
            "dry-run bloqueado: access_profile divergente do esperado "
            f"{json.dumps(report, ensure_ascii=False)}"
        )
    return report


def validate_etiqueta_modelo(records: list[dict[str, Any]]) -> dict[str, Any]:
    ids = [int(record["id"]) for record in records]
    report = {
        "count": len(records),
        "ids": ids,
        "matches_expected": ids == EXPECTED_ETIQUETA_MODELO_IDS,
    }
    if not report["matches_expected"]:
        raise RuntimeError(
            "dry-run bloqueado: etiqueta_modelo divergente do esperado "
            f"{json.dumps(report, ensure_ascii=False)}"
        )
    return report


def delete_where_in(db, table_name: str, column_name: str, values: list[int]) -> int:
    if not values or not table_exists(db, table_name) or not table_has_column(db, table_name, column_name):
        return 0
    result = db.execute(
        text(f"delete from {table_name} where {column_name} in :ids").bindparams(
            bindparam("ids", expanding=True)
        ),
        {"ids": values},
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


def print_dry_run_report(
    *,
    current_database: str,
    clinic: dict[str, Any] | None,
    users: list[dict[str, Any]],
    prestadores: list[dict[str, Any]],
    assinatura: list[dict[str, Any]],
    access_profile_report: dict[str, Any],
    etiqueta_modelo_report: dict[str, Any],
    counts: OrderedDict[str, int],
    email_audit_records: list[dict[str, Any]],
    unknown_links: list[dict[str, Any]],
    user_link_issues: list[dict[str, Any]],
    prestador_link_issues: list[dict[str, Any]],
) -> None:
    print("MODO: DRY-RUN")
    print(f"DATABASE_ATUAL = {current_database}")
    print(f"CLINICA_ENCONTRADA = {json.dumps(clinic, ensure_ascii=False, default=str)}")
    print(f"E_MAIL_ESPERADO = {FIXED_EXPECTED_EMAIL}")
    print(f"USUARIOS_ENCONTRADOS = {json.dumps(users, ensure_ascii=False, default=str)}")
    print(f"PRESTADORES_ENCONTRADOS = {json.dumps(prestadores, ensure_ascii=False, default=str)}")
    print(f"ASSINATURA_ENCONTRADA = {json.dumps(assinatura, ensure_ascii=False, default=str)}")
    print(f"ACCESS_PROFILE_RELATORIO = {json.dumps(access_profile_report, ensure_ascii=False, default=str)}")
    print(f"ETIQUETA_MODELO_RELATORIO = {json.dumps(etiqueta_modelo_report, ensure_ascii=False, default=str)}")
    print(f"EMAIL_CODES_ENCONTRADOS = {json.dumps(email_audit_records, ensure_ascii=False, default=str)}")
    print(f"DADOS_IMPEDITIVOS = {json.dumps({k: counts.get(k, 0) for k in ['pacientes','tratamento','lancamento','agenda_legado_evento','agenda_legado_bloqueio','anamnese_respostas','plataforma_cobrancas']}, ensure_ascii=False)}")
    print(f"ORDEM_PLANEJADA_DE_EXCLUSAO = {json.dumps(DELETE_ORDER, ensure_ascii=False)}")
    print(f"VINCULOS_NAO_MAPEADOS = {json.dumps(unknown_links, ensure_ascii=False, default=str)}")
    print(f"VINCULOS_USUARIO_EXTRA = {json.dumps(user_link_issues, ensure_ascii=False, default=str)}")
    print(f"VINCULOS_PRESTADOR_EXTRA = {json.dumps(prestador_link_issues, ensure_ascii=False, default=str)}")
    print(f"CONTAGENS = {json.dumps(counts, ensure_ascii=False, default=str)}")
    print("AVISO = dry-run somente leitura; nada foi alterado.")


def execute_delete_plan(
    *,
    db,
    current_database: str,
    clinic: dict[str, Any] | None,
    users: list[dict[str, Any]],
    prestadores: list[dict[str, Any]],
    assinatura: list[dict[str, Any]],
    access_profile_report: dict[str, Any],
    etiqueta_modelo_report: dict[str, Any],
    counts: OrderedDict[str, int],
    unknown_links: list[dict[str, Any]],
    email_audit_records: list[dict[str, Any]],
    user_link_issues: list[dict[str, Any]],
    prestador_link_issues: list[dict[str, Any]],
) -> None:
    if current_database != EXPECTED_DATABASE:
        raise RuntimeError(f"execucao real bloqueada: database incorreto esperado={EXPECTED_DATABASE} recebido={current_database}")
    if not clinic or int(clinic.get("id") or 0) != FIXED_CLINICA_ID:
        raise RuntimeError("execucao real bloqueada: clinica nao encontrada")
    if str(clinic.get("email", "")) != FIXED_EXPECTED_EMAIL:
        raise RuntimeError("execucao real bloqueada: e-mail da clinica nao confere")
    validate_expected_user_rows(users)
    validate_expected_prestadores(prestadores)
    if len(access_profile_report["ids"]) != EXPECTED_ACCESS_PROFILE_COUNT:
        raise RuntimeError("execucao real bloqueada: access_profile divergente do esperado")
    if etiqueta_modelo_report["ids"] != EXPECTED_ETIQUETA_MODELO_IDS:
        raise RuntimeError("execucao real bloqueada: etiqueta_modelo divergente do esperado")
    if counts.get("pacientes", 0) or counts.get("tratamento", 0) or counts.get("lancamento", 0):
        raise RuntimeError("execucao real bloqueada: existem pacientes/tratamentos/lancamentos")
    if counts.get("agenda_legado_evento", 0) or counts.get("agenda_legado_bloqueio", 0):
        raise RuntimeError("execucao real bloqueada: existem dados de agenda legada")
    if counts.get("anamnese_respostas", 0) or counts.get("plataforma_cobrancas", 0):
        raise RuntimeError("execucao real bloqueada: existem cobrancas/anamneses reais")
    if counts.get("usuario_perfil_acesso", 0):
        raise RuntimeError("execucao real bloqueada: usuario_perfil_acesso ainda possui registros")
    if unknown_links:
        raise RuntimeError("execucao real bloqueada: existem vinculos nao mapeados")
    if user_link_issues:
        raise RuntimeError("execucao real bloqueada: existem vinculos de usuario inesperados")
    if prestador_link_issues:
        raise RuntimeError("execucao real bloqueada: existem vinculos de prestador inesperados")
    if not email_audit_records:
        raise RuntimeError("execucao real bloqueada: email_codes nao encontrado para liberar o e-mail")

    # Queries de leitura anteriores abrem transacao implícita na Session.
    # Encerramos essa transacao antes de abrir a transacao explicita da exclusao.
    db.rollback()

    print("MODO: EXECUTE")
    print(f"DATABASE_ATUAL = {current_database}")
    print(f"ORDEM_PLANEJADA_DE_EXCLUSAO = {json.dumps(DELETE_ORDER, ensure_ascii=False)}")
    with db.begin():
        deleted_email_codes = delete_email_codes(db, FIXED_EXPECTED_EMAIL)
        deleted_usuario_perfil = delete_where_clinica(db, "usuario_perfil_acesso", FIXED_CLINICA_ID)
        deleted_access_profile = delete_where_clinica(db, "access_profile", FIXED_CLINICA_ID)
        deleted_etiqueta_modelo = delete_where_clinica(db, "etiqueta_modelo", FIXED_CLINICA_ID)
        deleted_anamnese_perguntas = delete_where_clinica(db, "anamnese_perguntas", FIXED_CLINICA_ID)
        deleted_anamnese_questionarios = delete_where_clinica(db, "anamnese_questionarios", FIXED_CLINICA_ID)
        deleted_proc_material = delete_where_clinica(db, "procedimento_material", FIXED_CLINICA_ID)
        deleted_proc_fase = delete_where_clinica(db, "procedimento_fase", FIXED_CLINICA_ID)
        deleted_proc_gen_fase = delete_where_clinica(db, "procedimento_generico_fase", FIXED_CLINICA_ID)
        deleted_proc_gen_material = delete_where_clinica(db, "procedimento_generico_material", FIXED_CLINICA_ID)
        deleted_material = delete_material_by_lista_material(db, FIXED_CLINICA_ID)
        deleted_lista_material = delete_where_clinica(db, "lista_material", FIXED_CLINICA_ID)
        deleted_procedimento = delete_where_clinica(db, "procedimento", FIXED_CLINICA_ID)
        deleted_procedimento_generico = delete_where_clinica(db, "procedimento_generico", FIXED_CLINICA_ID)
        deleted_procedimento_tabela = delete_where_clinica(db, "procedimento_tabela", FIXED_CLINICA_ID)
        deleted_plano = delete_where_clinica(db, "plano_odonto", FIXED_CLINICA_ID)
        deleted_convenio = delete_where_clinica(db, "convenio_odonto", FIXED_CLINICA_ID)
        deleted_categoria = delete_where_clinica(db, "categoria_financeira", FIXED_CLINICA_ID)
        deleted_grupo = delete_where_clinica(db, "grupo_financeiro", FIXED_CLINICA_ID)
        deleted_indice = delete_where_clinica(db, "indice_financeiro", FIXED_CLINICA_ID)
        deleted_item = delete_where_clinica(db, "item_auxiliar", FIXED_CLINICA_ID)
        deleted_simbolo = delete_where_clinica(db, "simbolo_grafico_catalogo", FIXED_CLINICA_ID)
        deleted_doenca = delete_where_clinica(db, "doenca_cid", FIXED_CLINICA_ID)
        deleted_assinaturas = delete_where_clinica(db, "assinaturas", FIXED_CLINICA_ID)
        deleted_plataforma_assinaturas = delete_where_clinica(db, "plataforma_assinaturas", FIXED_CLINICA_ID)
        deleted_plataforma_cobrancas = delete_where_clinica(db, "plataforma_cobrancas", FIXED_CLINICA_ID)
        deleted_prestadores = delete_where_in(db, "prestador_odonto", "id", sorted(EXPECTED_PRESTADOR_IDS))
        deleted_usuarios = delete_where_in(db, "usuarios", "id", sorted(EXPECTED_USER_IDS))
        result = db.execute(
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
        print(f"- DELETE clinicas: 1")


def main() -> None:
    args = parse_args()
    validate_fixed_safety_args(args)

    with SessionLocal() as db:
        current_database = get_current_database(db)
        clinic = load_clinic(db, args.clinica_id)
        users = load_expected_users(db, args.clinica_id, args.expected_email)
        prestadores = load_expected_prestadores(db, args.clinica_id)
        assinatura = load_assinatura(db, args.clinica_id)
        access_profile = load_access_profile(db, args.clinica_id)
        etiqueta_modelo = load_etiqueta_modelo(db, args.clinica_id)
        email_audit_records = load_email_audit_records(db, args.expected_email)
        counts = load_related_counts(db, args.clinica_id)
        counts["assinaturas"] = int(counts.get("assinaturas", 0))
        counts["plataforma_cobrancas"] = int(counts.get("plataforma_cobrancas", 0))
        counts["usuario_perfil_acesso"] = int(counts.get("usuario_perfil_acesso", 0))
        unknown_links = load_unknown_links(db, args.clinica_id)
        user_link_issues = load_user_link_issues(db, args.clinica_id)
        prestador_link_issues = load_prestador_link_issues(db, args.clinica_id)

        if current_database != EXPECTED_DATABASE:
            raise RuntimeError(
                f"database incorreto: esperado={EXPECTED_DATABASE} recebido={current_database}"
            )
        if not clinic:
            raise RuntimeError(f"clinica nao encontrada: {args.clinica_id}")
        if str(clinic.get("email", "")) != args.expected_email:
            raise RuntimeError(
                f"email da clinica nao confere: esperado={args.expected_email} recebido={clinic.get('email')}"
            )
        validate_expected_user_rows(users)
        validate_expected_prestadores(prestadores)
        access_profile_report = validate_access_profile(access_profile)
        etiqueta_modelo_report = validate_etiqueta_modelo(etiqueta_modelo)

        if args.execute:
            execute_delete_plan(
                db=db,
                current_database=current_database,
                clinic=clinic,
                users=users,
                prestadores=prestadores,
                assinatura=assinatura,
                access_profile_report=access_profile_report,
                etiqueta_modelo_report=etiqueta_modelo_report,
                counts=counts,
                unknown_links=unknown_links,
                email_audit_records=email_audit_records,
                user_link_issues=user_link_issues,
                prestador_link_issues=prestador_link_issues,
            )
            return

        print_dry_run_report(
            current_database=current_database,
            clinic=clinic,
            users=users,
            prestadores=prestadores,
            assinatura=assinatura,
            access_profile_report=access_profile_report,
            etiqueta_modelo_report=etiqueta_modelo_report,
            counts=counts,
            email_audit_records=email_audit_records,
            unknown_links=unknown_links,
            user_link_issues=user_link_issues,
            prestador_link_issues=prestador_link_issues,
        )


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, SQLAlchemyError) as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        sys.exit(1)
