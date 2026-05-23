from __future__ import annotations

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

import export_test_clinic_backup as base
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from database import SessionLocal


FIXED_CLINICA_ID = 9
FIXED_EXPECTED_EMAIL = "institutobrana@gmail.com"
EXPECTED_DATABASE = "brana_saas"
BACKUP_DIR = PROJECT_ROOT / "backups" / "clinica_9_pre_exclusao"


base.FIXED_CLINICA_ID = FIXED_CLINICA_ID
base.FIXED_EXPECTED_EMAIL = FIXED_EXPECTED_EMAIL
base.EXPECTED_DATABASE = EXPECTED_DATABASE
base.BACKUP_DIR = BACKUP_DIR


def export_backup_bundle(db, clinica_id: int) -> tuple[OrderedDict[str, int], list[str]]:
    exported_files: list[str] = []
    counts: OrderedDict[str, int] = OrderedDict()

    def write_dataset(filename: str, payload: Any, count_key: str | None = None) -> None:
        base.dump_json(BACKUP_DIR / filename, payload)
        exported_files.append(filename)
        if count_key is not None:
            if isinstance(payload, list):
                counts[count_key] = len(payload)
            elif isinstance(payload, dict) and "count" in payload:
                counts[count_key] = int(payload["count"])

    clinic = base.export_query(
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
    write_dataset("clinica_9_core.json", clinic, "clinicas")

    users = base.export_query(
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
    write_dataset("usuarios_21_22.json", users, "usuarios")

    prestador = base.export_query(
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
    write_dataset("prestador_14.json", prestador, "prestador_odonto")

    assinatura = base.export_query(
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
    write_dataset("plataforma_assinaturas_clinica_9.json", assinatura, "plataforma_assinaturas")

    access_profile = base.export_query(
        db,
        """
        select id, clinica_id, source_id, nome, reservado, criado_em, atualizado_em
        from access_profile
        where clinica_id = :clinica_id
        order by source_id, id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("access_profile_clinica_9.json", access_profile, "access_profile")

    etiqueta_modelo = base.load_etiqueta_modelo(db, clinica_id)
    write_dataset("etiqueta_modelo_clinica_9.json", etiqueta_modelo, "etiqueta_modelo")

    email_codes = base.export_query(
        db,
        """
        select id, email, purpose, code_hash, expires_at, used
        from email_codes
        where email = :expected_email
        order by id
        """,
        {"expected_email": FIXED_EXPECTED_EMAIL},
    )
    write_dataset("email_codes_institutobrana.json", email_codes, "email_codes")

    convenio = base.export_query(
        db,
        """
        select *
        from convenio_odonto
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("convenio_odonto_clinica_9.json", convenio, "convenio_odonto")

    plano = base.export_query(
        db,
        """
        select *
        from plano_odonto
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("plano_odonto_clinica_9.json", plano, "plano_odonto")

    proc_tabela = base.export_query(
        db,
        """
        select *
        from procedimento_tabela
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("procedimento_tabela_clinica_9.json", proc_tabela, "procedimento_tabela")

    procedimento_generico = base.export_query(
        db,
        """
        select *
        from procedimento_generico
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("procedimento_generico_clinica_9.json", procedimento_generico, "procedimento_generico")

    procedimento = base.export_query(
        db,
        """
        select *
        from procedimento
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("procedimento_clinica_9.json", procedimento, "procedimento")

    lista_material = base.export_query(
        db,
        """
        select *
        from lista_material
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("lista_material_clinica_9.json", lista_material, "lista_material")

    material = base.export_query(
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
    write_dataset("material_lista_26.json", material, "material")

    questionarios = base.export_query(
        db,
        """
        select *
        from anamnese_questionarios
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("anamnese_questionarios_clinica_9.json", questionarios, "anamnese_questionarios")

    perguntas = base.export_query(
        db,
        """
        select *
        from anamnese_perguntas
        where clinica_id = :clinica_id
        order by questionario_id, numero, id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("anamnese_perguntas_clinica_9.json", perguntas, "anamnese_perguntas")

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
                ("email_codes", len(email_codes)),
            ]
        )
    )

    category_financeira = base.export_query(
        db,
        """
        select *
        from categoria_financeira
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("categoria_financeira_clinica_9.json", category_financeira, "categoria_financeira")

    grupo_financeiro = base.export_query(
        db,
        """
        select *
        from grupo_financeiro
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("grupo_financeiro_clinica_9.json", grupo_financeiro, "grupo_financeiro")

    indice_financeiro = base.export_query(
        db,
        """
        select *
        from indice_financeiro
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("indice_financeiro_clinica_9.json", indice_financeiro, "indice_financeiro")

    item_auxiliar = base.export_query(
        db,
        """
        select *
        from item_auxiliar
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("item_auxiliar_clinica_9.json", item_auxiliar, "item_auxiliar")

    simbolo_grafico = base.export_query(
        db,
        """
        select *
        from simbolo_grafico_catalogo
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("simbolo_grafico_catalogo_clinica_9.json", simbolo_grafico, "simbolo_grafico_catalogo")

    doenca_cid = base.export_query(
        db,
        """
        select *
        from doenca_cid
        where clinica_id = :clinica_id
        order by id
        """,
        {"clinica_id": clinica_id},
    )
    write_dataset("doenca_cid_clinica_9.json", doenca_cid, "doenca_cid")

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
            "email_codes foi exportado para rastreabilidade e reversibilidade do e-mail reutilizavel",
            "doenca_cid foi exportada integralmente por ser reversibilidade util e ainda segura no volume atual",
            "etiqueta_modelo foi exportada integralmente por ser exclusivo da clinica 9 e necessitar reversibilidade adicional",
            "Nenhuma escrita foi feita no banco",
        ],
    }


base.export_backup_bundle = export_backup_bundle
base.build_manifest = build_manifest


def main() -> None:
    try:
        base.main()
    except (ValueError, RuntimeError, SQLAlchemyError) as exc:
        print(f"ERRO: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
