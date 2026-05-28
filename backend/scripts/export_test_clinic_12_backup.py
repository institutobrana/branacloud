from __future__ import annotations

import sys
from collections import OrderedDict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parents[1]
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import export_test_clinic_10_backup as base


base.FIXED_CLINICA_ID = 12
base.FIXED_EXPECTED_EMAIL = "institutobrana@gmail.com"
base.BACKUP_DIR = PROJECT_ROOT / "backups" / "clinica_12_pre_exclusao"


def export_backup_bundle(db, clinica_id: int) -> tuple[OrderedDict[str, int], list[str]]:
    exported_files: list[str] = []
    counts: OrderedDict[str, int] = OrderedDict()

    def write_dataset(filename: str, payload: Any, count_key: str | None = None) -> None:
        base.dump_json(base.BACKUP_DIR / filename, payload)
        exported_files.append(filename)
        if count_key is not None:
            counts[count_key] = len(payload) if isinstance(payload, list) else int(payload.get("count", 0))

    write_dataset("clinica_12_core.json", base.export_clinica_core(db, clinica_id), "clinicas")
    write_dataset("usuarios_27_28_29.json", base.export_users(db, clinica_id, base.FIXED_EXPECTED_EMAIL), "usuarios")
    write_dataset("prestadores_17_18.json", base.export_single_table(db, "prestador_odonto", clinica_id), "prestador_odonto")
    write_dataset("access_profile_clinica_12.json", base.export_single_table(db, "access_profile", clinica_id), "access_profile")
    write_dataset("etiqueta_modelo_clinica_12.json", base.export_single_table(db, "etiqueta_modelo", clinica_id), "etiqueta_modelo")
    write_dataset("email_codes_institutobrana.json", base.export_email_codes(db, base.FIXED_EXPECTED_EMAIL), "email_codes")
    write_dataset("convenio_odonto_clinica_12.json", base.export_single_table(db, "convenio_odonto", clinica_id), "convenio_odonto")
    write_dataset("plano_odonto_clinica_12.json", base.export_single_table(db, "plano_odonto", clinica_id), "plano_odonto")
    write_dataset("procedimento_tabela_clinica_12.json", base.export_single_table(db, "procedimento_tabela", clinica_id), "procedimento_tabela")
    write_dataset("procedimento_generico_clinica_12.json", base.export_single_table(db, "procedimento_generico", clinica_id), "procedimento_generico")
    write_dataset("procedimento_clinica_12.json", base.export_single_table(db, "procedimento", clinica_id), "procedimento")
    write_dataset("lista_material_clinica_12.json", base.export_single_table(db, "lista_material", clinica_id), "lista_material")
    write_dataset("material_lista_clinica_12.json", base.export_material_by_lista_material(db, clinica_id), "material")
    write_dataset("anamnese_questionarios_clinica_12.json", base.export_single_table(db, "anamnese_questionarios", clinica_id), "anamnese_questionarios")
    write_dataset("anamnese_perguntas_clinica_12.json", base.export_single_table(db, "anamnese_perguntas", clinica_id), "anamnese_perguntas")
    write_dataset("categoria_financeira_clinica_12.json", base.export_single_table(db, "categoria_financeira", clinica_id), "categoria_financeira")
    write_dataset("grupo_financeiro_clinica_12.json", base.export_single_table(db, "grupo_financeiro", clinica_id), "grupo_financeiro")
    write_dataset("indice_financeiro_clinica_12.json", base.export_single_table(db, "indice_financeiro", clinica_id), "indice_financeiro")
    write_dataset("item_auxiliar_clinica_12.json", base.export_single_table(db, "item_auxiliar", clinica_id), "item_auxiliar")
    write_dataset("simbolo_grafico_catalogo_clinica_12.json", base.export_single_table(db, "simbolo_grafico_catalogo", clinica_id), "simbolo_grafico_catalogo")
    write_dataset("doenca_cid_clinica_12.json", base.export_single_table(db, "doenca_cid", clinica_id), "doenca_cid")
    write_dataset("assinaturas_clinica_12.json", base.export_single_table(db, "assinaturas", clinica_id), "assinaturas")
    write_dataset("plataforma_assinaturas_clinica_12.json", base.export_single_table(db, "plataforma_assinaturas", clinica_id), "plataforma_assinaturas")
    write_dataset("plataforma_cobrancas_clinica_12.json", base.export_single_table(db, "plataforma_cobrancas", clinica_id), "plataforma_cobrancas")
    write_dataset("unidade_atendimento_clinica_12.json", base.export_single_table(db, "unidade_atendimento", clinica_id), "unidade_atendimento")

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
        "clinica_id": base.FIXED_CLINICA_ID,
        "expected_email": base.FIXED_EXPECTED_EMAIL,
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
            "Os arquivos exportados sao destinados a reversibilidade da exclusao segura da clinica 12",
        ],
    }


base.export_backup_bundle = export_backup_bundle
base.build_manifest = build_manifest


if __name__ == "__main__":
    base.main()