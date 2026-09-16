from __future__ import annotations

import argparse
import importlib
import json
import os
import pkgutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from sqlalchemy import delete, select


BACKEND_DIR = Path(__file__).resolve().parents[1]
SCRIPTS_DIR = BACKEND_DIR / "scripts"
TMP_DIR = BACKEND_DIR / "tmp"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

load_dotenv(BACKEND_DIR / ".env")

from database import SessionLocal  # noqa: E402
from models.odontograma_model import (  # noqa: E402
    OdontogramaArcadaSlot,
    OdontogramaDente,
    OdontogramaFace,
    OdontogramaIntervencao,
)
from models.paciente import Paciente  # noqa: E402
from models.prestador_odonto import PrestadorOdonto  # noqa: E402
from models.tratamento import Tratamento  # noqa: E402


DEFAULT_PILOT_PATIENT = 214
DEFAULT_PILOT_TREATMENT = 239
DEFAULT_FALLBACK_PATIENT = 646
DEFAULT_FALLBACK_TREATMENT = 2620
DEFAULT_BH_CLINICA_ID = 1
DEFAULT_JSON_OUT = TMP_DIR / "importacao_piloto_tratamento.json"


def _load_model_registry() -> None:
    models_dir = BACKEND_DIR / "models"
    for mod in pkgutil.iter_modules([str(models_dir)]):
        if mod.name.startswith("_"):
            continue
        try:
            importlib.import_module(f"models.{mod.name}")
        except Exception:
            continue


def _set_source_env_from_args(args: argparse.Namespace) -> None:
    if args.source_server:
        os.environ["EDS70_SOURCE_SERVER"] = str(args.source_server)
    if args.source_database:
        os.environ["EDS70_SOURCE_DATABASE"] = str(args.source_database)
    if args.source_uid:
        os.environ["EDS70_SOURCE_UID"] = str(args.source_uid)
    if args.source_pwd:
        os.environ["EDS70_SOURCE_PWD"] = str(args.source_pwd)
    if args.source_driver:
        os.environ["EDS70_ODBC_DRIVER"] = str(args.source_driver)


def _clean_text(value: Any) -> str:
    if value is None:
        return ""
    return " ".join(str(value).replace("\x00", " ").split()).strip()


def _to_int(value: Any, default: int = 0) -> int:
    try:
        text = _clean_text(value)
        if not text:
            return default
        return int(float(text.replace(",", ".")))
    except Exception:
        return default


def _date_only(value: Any) -> str | None:
    text = _clean_text(value)
    if not text:
        return None
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d/%m/%Y"):
        try:
            if fmt == "%Y-%m-%d %H:%M:%S":
                parsed = datetime.strptime(text[:19], fmt)
            else:
                parsed = datetime.strptime(text[:10], fmt)
            return parsed.date().isoformat()
        except Exception:
            continue
    return None


def _face_flags_from_legacy(row: dict[str, Any]) -> dict[str, bool]:
    return {
        "face_mesial": _to_int(row.get("FACE1"), 0) != 0,
        "face_distal": _to_int(row.get("FACE2"), 0) != 0,
        "face_oclusal": _to_int(row.get("FACE3"), 0) != 0,
        "face_vestibular": _to_int(row.get("FACE4"), 0) != 0,
        "face_lingual": _to_int(row.get("FACE5"), 0) != 0,
    }


def _summary_to_lookup(summary: dict[str, Any]) -> dict[int, int | None]:
    lookup: dict[int, int | None] = {}
    for item in summary["source"]["arcada"]:
        slot_ordem = _to_int(item.get("slot_ordem"), 0)
        fdi = _to_int(item.get("numero_dente_fdi"), 0) or None
        if slot_ordem > 0:
            lookup[slot_ordem] = fdi
    return lookup


def _resolve_prestador_id(db, legacy_source_id: int, clinica_id: int) -> int | None:
    row = (
        db.query(PrestadorOdonto)
        .filter(
            PrestadorOdonto.clinica_id == int(clinica_id),
            PrestadorOdonto.source_id == int(legacy_source_id),
        )
        .first()
    )
    return int(row.id) if row else None


def _resolve_prestador_nome(db, legacy_source_id: int, clinica_id: int) -> str | None:
    row = (
        db.query(PrestadorOdonto)
        .filter(
            PrestadorOdonto.clinica_id == int(clinica_id),
            PrestadorOdonto.source_id == int(legacy_source_id),
        )
        .first()
    )
    if not row:
        return None
    nome = _clean_text(row.apelido or row.nome)
    return nome or None


def _resolve_procedimento_id(mapped: dict[str, Any] | None) -> int | None:
    if not mapped:
        return None
    try:
        return int(mapped["id"])
    except Exception:
        return None


def _resolve_status_id(summary_item: dict[str, Any]) -> int | None:
    return _to_int(summary_item.get("mapped_status_id"), 0) or None


def _extract_fdi_from_bitmap(bitmap: str | None) -> int | None:
    text = _clean_text(bitmap)
    if not text:
        return None
    parts = [part for part in text.replace("-", "_").split("_") if part]
    if not parts:
        return None
    candidate = parts[-1]
    if candidate.isdigit():
        value = int(candidate)
        return value if 11 <= value <= 48 else None
    return None


def _build_source_payload(summary: dict[str, Any]) -> dict[str, Any]:
    return {
        "migracao": {
            "sistema_origem": "EasyDental",
            "versao": "piloto_tratamento_v1",
            "gerado_em": datetime.now().isoformat(timespec="seconds"),
        },
        "selected_case": summary["selected_case"],
        "source": summary["source"],
        "validation": summary["validation"],
        "blockers": summary["blockers"],
        "warnings": summary["warnings"],
    }


def _source_counts(summary: dict[str, Any]) -> dict[str, int]:
    interventions = summary["source"]["interventions"]
    return {
        "arcada": len(summary["source"]["arcada"]),
        "interventions": len(interventions),
        "dentes": sum(len(item.get("dente_rows", [])) for item in interventions),
        "faces": sum(len(item.get("face_rows", [])) for item in interventions),
        "historico": sum(len(item.get("historico_rows", [])) for item in interventions),
    }


def _ensure_patient(db, clinica_id: int, paciente_codigo: int) -> Paciente:
    paciente = (
        db.query(Paciente)
        .filter(
            Paciente.clinica_id == int(clinica_id),
            Paciente.codigo == int(paciente_codigo),
        )
        .first()
    )
    if not paciente:
        raise RuntimeError(f"Paciente Brana nao encontrado para codigo {paciente_codigo}.")
    return paciente


def _build_tratamento_payload(summary: dict[str, Any]) -> dict[str, Any]:
    treatment = summary["source"]["treatment"] or {}
    status = _to_int(treatment.get("STATTRA"), 0)
    return {
        "nrotra": _to_int(treatment.get("NROTRA"), 0),
        "data_inicio": _date_only(treatment.get("DATINI")),
        "data_finalizacao": _date_only(treatment.get("DATVAL")) if status == 2 else None,
        "situacao": {1: "Aberto", 2: "Finalizado", 3: "Cancelado"}.get(status, "Aberto"),
        "tabela_codigo": _to_int(treatment.get("NROTAB"), 1) or 1,
        "indice": _to_int(treatment.get("NROIND"), 255) or 255,
        "cirurgiao_responsavel_source_id": _to_int(treatment.get("ID_PRESTADOR"), 0) or None,
        "source_payload": _build_source_payload(summary),
    }


def _upsert_tratamento(db, clinica_id: int, paciente: Paciente, summary: dict[str, Any]) -> dict[str, Any]:
    treatment = summary["source"]["treatment"] or {}
    nrotra = _to_int(treatment.get("NROTRA"), 0)
    if nrotra <= 0:
        raise RuntimeError("Tratamento de origem sem NROTRA valido.")

    existing = (
        db.query(Tratamento)
        .filter(
            Tratamento.clinica_id == int(clinica_id),
            Tratamento.paciente_id == int(paciente.id),
            Tratamento.nrotra == int(nrotra),
        )
        .first()
    )

    payload = _build_tratamento_payload(summary)
    prestador_id = None
    prestador_nome = None
    if payload["cirurgiao_responsavel_source_id"] is not None:
        prestador_id = _resolve_prestador_id(db, int(payload["cirurgiao_responsavel_source_id"]), int(clinica_id))
        prestador_nome = _resolve_prestador_nome(db, int(payload["cirurgiao_responsavel_source_id"]), int(clinica_id))

    item = existing or Tratamento(
        clinica_id=int(clinica_id),
        paciente_id=int(paciente.id),
        nrotra=int(payload["nrotra"]),
    )
    if existing is None:
        db.add(item)

    item.data_inicio = payload["data_inicio"]
    item.data_finalizacao = payload["data_finalizacao"]
    item.situacao = payload["situacao"]
    item.tabela_codigo = int(payload["tabela_codigo"])
    item.indice = int(payload["indice"])
    item.cirurgiao_responsavel_id = prestador_id
    item.cirurgiao_responsavel_nome = prestador_nome
    item.unidade_atendimento = None
    item.observacoes = (
        f"Migrado de EasyDental paciente={int(summary['selected_case']['legacy_patient_code'])} "
        f"tratamento={int(summary['selected_case']['legacy_treatment_nrotra'])}"
    )
    item.arcada_predominante = None
    item.copiar_de = None
    item.copiar_intervencoes = False
    item.convenio_nome = None
    item.id_convenio = None
    item.tipo_atendimento_tiss_id = None
    item.tipo_atendimento_tiss_nome = None
    item.cirurgiao_contratado_id = None
    item.cirurgiao_contratado_nome = None
    item.cirurgiao_solicitante_id = None
    item.cirurgiao_solicitante_nome = None
    item.cirurgiao_executante_id = None
    item.cirurgiao_executante_nome = None
    item.sinais_doenca_periodontal = 3
    item.alteracao_tecidos = 3
    item.numero_guia = None
    item.data_autorizacao = None
    item.senha_autorizacao = None
    item.validade_senha = None
    item.source_payload = payload["source_payload"]

    db.flush()
    return {
        "tratamento_id": int(item.id),
        "created": existing is None,
        "payload": payload,
    }


def _sync_arcada(db, tratamento_id: int, clinica_id: int, paciente_id: int, summary: dict[str, Any]) -> int:
    db.execute(delete(OdontogramaArcadaSlot).where(OdontogramaArcadaSlot.tratamento_id == int(tratamento_id)))
    total = 0
    for slot in summary["source"]["arcada"]:
        db.add(
            OdontogramaArcadaSlot(
                clinica_id=int(clinica_id),
                paciente_id=int(paciente_id),
                tratamento_id=int(tratamento_id),
                slot_ordem=_to_int(slot.get("slot_ordem"), 0),
                numero_dente_fdi=_to_int(slot.get("numero_dente_fdi"), 0) or None,
                tipo_slot="dente",
                observacao=_clean_text(slot.get("observacao")) or None,
            )
        )
        total += 1
    return total


def _sync_intervencoes(db, tratamento_id: int, clinica_id: int, paciente_id: int, summary: dict[str, Any]) -> dict[str, int]:
    arcada_lookup = _summary_to_lookup(summary)
    treatment = summary["source"]["treatment"] or {}
    legacy_prestador_id = _to_int(treatment.get("ID_PRESTADOR"), 0) or None
    prestador_id = _resolve_prestador_id(db, legacy_prestador_id, int(clinica_id)) if legacy_prestador_id else None

    slot_to_fdi: dict[int, int] = {}
    for item in summary["source"]["interventions"]:
        for legacy_dente in item.get("dente_rows", []):
            slot_ordem = _to_int(legacy_dente.get("legacy_nroden"), 0)
            bitmap_fdi = _extract_fdi_from_bitmap(legacy_dente.get("legacy_bitmap"))
            if slot_ordem > 0 and bitmap_fdi:
                slot_to_fdi.setdefault(slot_ordem, int(bitmap_fdi))

    for slot_ordem, fdi in arcada_lookup.items():
        if slot_ordem > 0 and fdi:
            slot_to_fdi.setdefault(slot_ordem, int(fdi))

    intervencao_ids = select(OdontogramaIntervencao.id).where(OdontogramaIntervencao.tratamento_id == int(tratamento_id))
    db.execute(delete(OdontogramaDente).where(OdontogramaDente.intervencao_id.in_(intervencao_ids)))
    db.execute(delete(OdontogramaFace).where(OdontogramaFace.intervencao_id.in_(intervencao_ids)))
    db.execute(delete(OdontogramaIntervencao).where(OdontogramaIntervencao.tratamento_id == int(tratamento_id)))

    inserted = {"intervencoes": 0, "dentes": 0, "faces": 0}
    for item in summary["source"]["interventions"]:
        procedimento_id = _resolve_procedimento_id(item.get("mapped_procedure"))
        status_id = _resolve_status_id(item)
        if not procedimento_id or not status_id:
            raise RuntimeError(
                f"Intervencao legacy {item.get('legacy_nrointpac')} sem procedimento/status mapeado."
            )
        interv = OdontogramaIntervencao(
            clinica_id=int(clinica_id),
            paciente_id=int(paciente_id),
            tratamento_id=int(tratamento_id),
            prestador_id=prestador_id,
            procedimento_id=int(procedimento_id),
            status_id=int(status_id),
            data_planejada=_date_only(item.get("legacy_datcad")),
            data_execucao=_date_only(item.get("legacy_datfin")),
            observacao_resumida=_clean_text(item.get("legacy_description")) or None,
        )
        db.add(interv)
        db.flush()
        inserted["intervencoes"] += 1

        for legacy_dente in item.get("dente_rows", []):
            slot_ordem = _to_int(legacy_dente.get("legacy_nroden"), 0)
            numero_fdi = _extract_fdi_from_bitmap(legacy_dente.get("legacy_bitmap"))
            if not numero_fdi:
                numero_fdi = slot_to_fdi.get(slot_ordem)
            if not numero_fdi:
                raise RuntimeError(
                    f"Intervencao legacy {item.get('legacy_nrointpac')} possui dente {slot_ordem} sem mapeamento FDI."
                )
            db.add(
                OdontogramaDente(
                    clinica_id=int(clinica_id),
                    intervencao_id=int(interv.id),
                    numero_dente_fdi=int(numero_fdi),
                    observacao=_clean_text(legacy_dente.get("legacy_bitmap")) or None,
                )
            )
            inserted["dentes"] += 1

        for legacy_face in item.get("face_rows", []):
            slot_ordem = _to_int(legacy_face.get("legacy_nroden"), 0)
            numero_fdi = arcada_lookup.get(slot_ordem)
            if not numero_fdi:
                raise RuntimeError(
                    f"Intervencao legacy {item.get('legacy_nrointpac')} possui face {slot_ordem} sem mapeamento FDI."
                )
            flags = _face_flags_from_legacy(legacy_face)
            db.add(
                OdontogramaFace(
                    clinica_id=int(clinica_id),
                    intervencao_id=int(interv.id),
                    numero_dente_fdi=int(numero_fdi),
                    face_mesial=flags["face_mesial"],
                    face_distal=flags["face_distal"],
                    face_oclusal=flags["face_oclusal"],
                    face_vestibular=flags["face_vestibular"],
                    face_lingual=flags["face_lingual"],
                    observacao=None,
                )
            )
            inserted["faces"] += 1

    return inserted


def _validate_post_commit(db, tratamento_id: int, expected: dict[str, int]) -> dict[str, int]:
    counts = {
        "arcada": db.query(OdontogramaArcadaSlot).filter(OdontogramaArcadaSlot.tratamento_id == int(tratamento_id)).count(),
        "intervencoes": db.query(OdontogramaIntervencao).filter(OdontogramaIntervencao.tratamento_id == int(tratamento_id)).count(),
        "dentes": db.query(OdontogramaDente)
        .join(OdontogramaIntervencao, OdontogramaDente.intervencao_id == OdontogramaIntervencao.id)
        .filter(OdontogramaIntervencao.tratamento_id == int(tratamento_id))
        .count(),
        "faces": db.query(OdontogramaFace)
        .join(OdontogramaIntervencao, OdontogramaFace.intervencao_id == OdontogramaIntervencao.id)
        .filter(OdontogramaIntervencao.tratamento_id == int(tratamento_id))
        .count(),
    }
    for key, expected_value in expected.items():
        if counts.get(key) != expected_value:
            raise RuntimeError(f"Validacao pos-commit falhou para {key}: esperado {expected_value}, obtido {counts.get(key)}")
    return counts


def _print_summary(summary: dict[str, Any], treatment_result: dict[str, Any], sync_counts: dict[str, int] | None = None) -> None:
    treatment = summary["source"]["treatment"] or {}
    print("== Migracao piloto de tratamento ==")
    print(
        f"Legacy case: patient={summary['selected_case']['legacy_patient_code']} "
        f"treatment={summary['selected_case']['legacy_treatment_nrotra']}"
    )
    print(f"Patient legacy name: {summary['source']['patient']['PRINOM']} {summary['source']['patient']['SEGNOM']}")
    print(f"Treatment nrotra: {treatment.get('NROTRA')}")
    print(f"Source status STATTRA/STATORC: {treatment.get('STATTRA')} / {treatment.get('STATORC')}")
    print(f"Brana target treatment id: {treatment_result.get('tratamento_id')}")
    print(f"Treatment created: {'yes' if treatment_result.get('created') else 'no'}")
    print(f"Ready for commit: {'yes' if summary['ready_for_commit'] else 'no'}")
    print(f"Blockers: {len(summary['blockers'])}")
    for blocker in summary["blockers"]:
        print(f"  - {blocker}")
    if summary["warnings"]:
        print("Warnings:")
        for warning in summary["warnings"]:
            print(f"  - {warning}")
    if sync_counts is not None:
        print("Persisted counts:")
        print(f"  arcada={sync_counts['arcada']}")
        print(f"  intervencoes={sync_counts['intervencoes']}")
        print(f"  dentes={sync_counts['dentes']}")
        print(f"  faces={sync_counts['faces']}")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Importador piloto de tratamento odontologico do EasyDental para o Brana Cloud."
    )
    parser.add_argument("--clinica-id", type=int, default=DEFAULT_BH_CLINICA_ID)
    parser.add_argument("--paciente-codigo", type=int, default=DEFAULT_PILOT_PATIENT)
    parser.add_argument("--tratamento-nrotra", type=int, default=DEFAULT_PILOT_TREATMENT)
    parser.add_argument("--fallback-paciente-codigo", type=int, default=DEFAULT_FALLBACK_PATIENT)
    parser.add_argument("--fallback-tratamento-nrotra", type=int, default=DEFAULT_FALLBACK_TREATMENT)
    parser.add_argument("--source-server", default=None, help="Servidor SQL Server da origem EasyDental.")
    parser.add_argument("--source-database", default=None, help="Banco SQL Server da origem EasyDental.")
    parser.add_argument("--source-uid", default=None, help="Usuario SQL Server da origem EasyDental.")
    parser.add_argument("--source-pwd", default=None, help="Senha SQL Server da origem EasyDental.")
    parser.add_argument("--source-driver", default=None, help="Driver ODBC da origem EasyDental.")
    parser.add_argument("--commit", action="store_true", help="Grava a migracao no banco. Sem isso, roda em dry-run.")
    parser.add_argument("--json-out", type=Path, default=DEFAULT_JSON_OUT)
    args = parser.parse_args()

    _load_model_registry()
    _set_source_env_from_args(args)

    import auditar_migracao_piloto_tratamento as audit  # noqa: E402

    selected, selected_patient, selected_treatment = audit._resolve_case_with_fallback(
        args.paciente_codigo,
        args.tratamento_nrotra,
        args.fallback_paciente_codigo,
        args.fallback_tratamento_nrotra,
    )
    brana = audit._load_brana_context(args.clinica_id, selected_patient, selected_treatment)
    summary = audit._summarize_case(selected, brana, selected_patient, selected_treatment, args.clinica_id)

    db = SessionLocal()
    committed = False
    treatment_result: dict[str, Any] = {}
    sync_counts: dict[str, int] | None = None
    try:
        if not summary["ready_for_commit"]:
            _print_summary(summary, {"tratamento_id": None, "created": False})
            raise RuntimeError("Dry-run nao ficou pronto para commit. Corrija os blockers antes de escrever.")

        paciente = _ensure_patient(db, int(args.clinica_id), int(selected_patient))
        treatment_result = _upsert_tratamento(db, int(args.clinica_id), paciente, summary)
        tratamento_id = int(treatment_result["tratamento_id"])

        if args.commit:
            sync_counts = {
                "arcada": _sync_arcada(db, tratamento_id, int(args.clinica_id), int(paciente.id), summary)
            }
            sync_counts.update(_sync_intervencoes(db, tratamento_id, int(args.clinica_id), int(paciente.id), summary))
            db.commit()
            committed = True
            expected = {
                "arcada": _source_counts(summary)["arcada"],
                "intervencoes": _source_counts(summary)["interventions"],
                "dentes": _source_counts(summary)["dentes"],
                "faces": _source_counts(summary)["faces"],
            }
            sync_counts = _validate_post_commit(db, tratamento_id, expected)
        else:
            db.rollback()

        _print_summary(summary, treatment_result, sync_counts)

        counts = _source_counts(summary)
        out = {
            "committed": committed,
            "ready_for_commit": bool(summary["ready_for_commit"]),
            "selected_case": summary["selected_case"],
            "source_counts": counts,
            "brana": {
                "patient_id": int(paciente.id),
                "treatment_id": tratamento_id,
            },
            "sync_counts": sync_counts,
            "warnings": summary["warnings"],
            "blockers": summary["blockers"],
        }
        if args.json_out:
            args.json_out.parent.mkdir(parents=True, exist_ok=True)
            args.json_out.write_text(json.dumps(out, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
            print(f"JSON written to: {args.json_out}")
        return 0
    except Exception as exc:
        db.rollback()
        print(f"IMPORT_ABORTED: {exc}")
        return 1
    finally:
        db.close()


if __name__ == "__main__":
    raise SystemExit(main())
