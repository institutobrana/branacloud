from __future__ import annotations

import argparse
import json
import os
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path
from typing import Any

import pyodbc
from dotenv import load_dotenv
from sqlalchemy import text


BACKEND_DIR = Path(__file__).resolve().parents[1]

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

load_dotenv(BACKEND_DIR / ".env")

from database import engine  # noqa: E402


DEFAULT_PILOT_PATIENT = 214
DEFAULT_PILOT_TREATMENT = 239
DEFAULT_FALLBACK_PATIENT = 646
DEFAULT_FALLBACK_TREATMENT = 2620
DEFAULT_BH_CLINICA_ID = 1

SOURCE_SERVER = os.getenv("EDS70_SOURCE_SERVER", r"DELL_SERVIDOR\EDS70")
SOURCE_DATABASE = os.getenv("EDS70_SOURCE_DATABASE", "eds70")
SOURCE_UID = os.getenv("EDS70_SOURCE_UID")
SOURCE_PWD = os.getenv("EDS70_SOURCE_PWD")
SOURCE_DRIVER = os.getenv("EDS70_ODBC_DRIVER", "SQL Server Native Client 10.0")

SOURCE_TO_BRANA_PROCEDURE_CODE = {
    90: 4220,   # Tratamento de Canal - (Incisivos)
    29: 6280,   # Exodontia simples - (Posteriores)
    116: 7020,  # Implante ósseo integrável - Standard
    105: 2090,  # Curativo
    104: 2080,  # Consulta Inicial para Exame clínico
    180: 8140,  # Coroa metalo-cerâmica
}


def _stdout_utf8() -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def _clean_text(value: Any) -> str:
    text_value = "" if value is None else str(value)
    text_value = text_value.replace("\x00", "").strip()
    return " ".join(text_value.split())


def _norm(value: Any) -> str:
    base = _clean_text(value).casefold()
    decomposed = unicodedata.normalize("NFKD", base)
    return "".join(ch for ch in decomposed if unicodedata.category(ch) != "Mn")


def _to_int(value: Any, default: int = 0) -> int:
    text_value = _clean_text(value)
    if not text_value:
        return default
    try:
        return int(float(text_value.replace(",", ".")))
    except Exception:
        return default


def _dict_rows(cursor) -> list[dict[str, Any]]:
    cols = [col[0] for col in cursor.description]
    out = []
    for row in cursor.fetchall():
        out.append({cols[idx]: row[idx] for idx in range(len(cols))})
    return out


def _source_connect():
    if not SOURCE_UID or not SOURCE_PWD:
        raise RuntimeError(
            "Missing EDS70 source credentials. Set EDS70_SOURCE_UID and EDS70_SOURCE_PWD "
            "in the environment before running this dry-run."
        )
    conn_str = (
        f"Driver={{{SOURCE_DRIVER}}};"
        f"Server={SOURCE_SERVER};"
        f"Database={SOURCE_DATABASE};"
        f"Uid={SOURCE_UID};"
        f"Pwd={SOURCE_PWD};"
        "Connection Timeout=15;"
    )
    return pyodbc.connect(conn_str)


def _source_query(conn, sql: str, params: tuple[Any, ...] = ()) -> list[dict[str, Any]]:
    cursor = conn.cursor()
    cursor.execute(sql, params)
    return _dict_rows(cursor)


def _brana_query(sql: str, params: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    with engine.connect() as conn:
        result = conn.execute(text(sql), params or {})
        return [dict(row._mapping) for row in result.fetchall()]


def _resolve_case(paciente_code: int, nrotra: int) -> dict[str, Any]:
    with _source_connect() as conn:
        patient = _source_query(
            conn,
            """
            SELECT TOP 1 NROPAC, PRINOM, SEGNOM, STATUS, NROTAB, COD_PRONTUARIO
            FROM PESSOAL
            WHERE NROPAC = ?
            """,
            (paciente_code,),
        )
        treatment = _source_query(
            conn,
            """
            SELECT TOP 1 NROPAC, NROTRA, NROTAB, NROIND, STATTRA, STATORC,
                   CONVERT(varchar(19), DATINI, 120) AS DATINI,
                   CONVERT(varchar(19), DATVAL, 120) AS DATVAL,
                   CONVERT(varchar(19), DATCONV, 120) AS DATCONV,
                   ID_PRESTADOR
            FROM TRATAMENTO
            WHERE NROPAC = ? AND NROTRA = ?
            """,
            (paciente_code, nrotra),
        )
        arcada = _source_query(
            conn,
            """
            SELECT NRODEN, NROODONTO, ANOMALIAS, OBSERV
            FROM ARCADA
            WHERE NROPAC = ? AND NROTRA = ?
            ORDER BY NRODEN
            """,
            (paciente_code, nrotra),
        )
        interventions = _source_query(
            conn,
            """
            SELECT i.NROPAC, i.NROINTPAC, i.NROINT, i.NROTAB, i.STATUS, i.ORCAMENTO,
                   i.S_DENTES, i.S_FACES,
                   CONVERT(varchar(19), i.DATCAD, 120) AS DATCAD,
                   CONVERT(varchar(19), i.DATFIN, 120) AS DATFIN,
                   p.DESCRICAO AS DESCRICAO
            FROM INTERVENCAO i
            LEFT JOIN TAB_PRC_ITEM p
              ON p.NROTAB = i.NROTAB AND p.NROPROCTAB = i.NROINT
            WHERE i.NROPAC = ? AND i.NROTRA = ?
            ORDER BY i.NROINTPAC
            """,
            (paciente_code, nrotra),
        )

        intervention_ids = [int(row["NROINTPAC"]) for row in interventions]
        if intervention_ids:
            placeholders = ",".join("?" for _ in intervention_ids)
            dentes = _source_query(
                conn,
                f"""
                SELECT NROPAC, NROINTPAC, NRODEN, BITMAP
                FROM DENTE
                WHERE NROPAC = ? AND NROINTPAC IN ({placeholders})
                ORDER BY NROINTPAC, NRODEN
                """,
                (paciente_code, *intervention_ids),
            )
            faces = _source_query(
                conn,
                f"""
                SELECT NROPAC, NROINTPAC, NRODEN, FACE1, FACE2, FACE3, FACE4, FACE5
                FROM FACE
                WHERE NROPAC = ? AND NROINTPAC IN ({placeholders})
                ORDER BY NROINTPAC, NRODEN
                """,
                (paciente_code, *intervention_ids),
            )
            historico = _source_query(
                conn,
                f"""
                SELECT NROPAC, NROINTPAC,
                       CONVERT(varchar(19), DATA, 120) AS DATA,
                       NRODENTE, ID_PRESTADOR, COR,
                       LEFT(CAST(DESCRICAO AS varchar(4000)), 4000) AS DESCRICAO
                FROM HISTORICO
                WHERE NROPAC = ? AND NROINTPAC IN ({placeholders})
                ORDER BY DATA, NROINTPAC
                """,
                (paciente_code, *intervention_ids),
            )
        else:
            dentes = []
            faces = []
            historico = []

    return {
        "patient": patient[0] if patient else None,
        "treatment": treatment[0] if treatment else None,
        "arcada": arcada,
        "interventions": interventions,
        "dentes": dentes,
        "faces": faces,
        "historico": historico,
    }


def _load_brana_context(clinica_id: int, paciente_codigo: int, source_treatment_table_code: int) -> dict[str, Any]:
    patient = _brana_query(
        """
        SELECT id, clinica_id, codigo, nome, sobrenome, cod_prontuario
        FROM pacientes
        WHERE clinica_id = :clinica_id AND codigo = :codigo
        """,
        {"clinica_id": clinica_id, "codigo": paciente_codigo},
    )
    procedures = _brana_query(
        """
        SELECT p.id, p.codigo, p.nome, p.tabela_id, t.codigo AS tabela_codigo, t.nome AS tabela_nome
        FROM procedimento p
        JOIN procedimento_tabela t ON t.id = p.tabela_id
        WHERE p.clinica_id = :clinica_id AND t.clinica_id = :clinica_id
        ORDER BY t.codigo, p.codigo, p.id
        """,
        {"clinica_id": clinica_id},
    )
    status_rows = _brana_query(
        """
        SELECT id, codigo, descricao, ordem, ativo
        FROM odontograma_intervencao_status
        ORDER BY ordem, id
        """
    )
    treatment = _brana_query(
        """
        SELECT id, clinica_id, paciente_id, nrotra, data_inicio, data_finalizacao, situacao, tabela_codigo, indice
        FROM tratamento
        WHERE clinica_id = :clinica_id AND nrotra = :nrotra
        """,
        {"clinica_id": clinica_id, "nrotra": source_treatment_table_code},
    )
    tables = _brana_query(
        """
        SELECT id, clinica_id, codigo, nome, nro_indice
        FROM procedimento_tabela
        WHERE clinica_id = :clinica_id
        ORDER BY codigo
        """,
        {"clinica_id": clinica_id},
    )
    return {
        "patient": patient[0] if patient else None,
        "procedures": procedures,
        "status_rows": status_rows,
        "treatment": treatment[0] if treatment else None,
        "tables": tables,
    }


def _build_procedure_index(procedures: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    by_norm: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for row in procedures:
        by_norm[_norm(row["nome"])].append(row)
    return by_norm


def _match_procedure(
    procedure_index: dict[str, list[dict[str, Any]]],
    description: str,
    preferred_table_code: int | None,
    source_procedure_code: int | None = None,
) -> dict[str, Any]:
    normalized = _norm(description)
    candidates = procedure_index.get(normalized, [])
    if not candidates:
        alias_code = SOURCE_TO_BRANA_PROCEDURE_CODE.get(int(source_procedure_code or 0))
        if alias_code is not None:
            for rows in procedure_index.values():
                for row in rows:
                    if int(row["codigo"]) == int(alias_code):
                        chosen = row
                        reason = "source_code_alias"
                        return {
                            "matched": True,
                            "reason": reason,
                            "description": description,
                            "normalized": normalized,
                            "candidate": {
                                "id": int(chosen["id"]),
                                "codigo": int(chosen["codigo"]),
                                "nome": chosen["nome"],
                                "tabela_id": int(chosen["tabela_id"]),
                                "tabela_codigo": int(chosen["tabela_codigo"]),
                                "tabela_nome": chosen["tabela_nome"],
                            },
                        }
        return {
            "matched": False,
            "reason": "missing",
            "description": description,
            "normalized": normalized,
            "candidate": None,
        }

    chosen = None
    if preferred_table_code is not None:
        same_table = [row for row in candidates if int(row["tabela_codigo"]) == int(preferred_table_code)]
        if same_table:
            chosen = sorted(same_table, key=lambda row: (int(row["codigo"]), int(row["id"])))[0]
    if chosen is None:
        chosen = sorted(candidates, key=lambda row: (abs(int(row["tabela_codigo"]) - int(preferred_table_code or row["tabela_codigo"])), int(row["codigo"]), int(row["id"])))[0]

    reason = "exact_same_table" if preferred_table_code is not None and int(chosen["tabela_codigo"]) == int(preferred_table_code) else "exact_other_table"
    return {
        "matched": True,
        "reason": reason,
        "description": description,
        "normalized": normalized,
        "candidate": {
            "id": int(chosen["id"]),
            "codigo": int(chosen["codigo"]),
            "nome": chosen["nome"],
            "tabela_id": int(chosen["tabela_id"]),
            "tabela_codigo": int(chosen["tabela_codigo"]),
            "tabela_nome": chosen["tabela_nome"],
        },
    }


def _resolve_status_lookup(rows: list[dict[str, Any]]) -> dict[int, dict[str, Any]]:
    lookup: dict[int, dict[str, Any]] = {}
    for row in rows:
        lookup[int(row["id"])] = {
            "id": int(row["id"]),
            "codigo": str(row["codigo"]),
            "descricao": str(row["descricao"]),
            "ordem": int(row["ordem"]),
            "ativo": bool(row["ativo"]),
        }
    return lookup


def _source_status_to_brana_status_id(status_lookup: dict[int, dict[str, Any]], source_status: Any) -> int | None:
    status_num = _to_int(source_status, 0)
    desired = {1: "observada", 2: "realizada", 3: "realizar"}.get(status_num)
    if not desired:
        return None
    for status_id, payload in status_lookup.items():
        if _norm(payload["codigo"]) == desired or _norm(payload["descricao"]) == desired:
            return status_id
    return None


def _summarize_case(
    selected: dict[str, Any],
    brana: dict[str, Any],
    patient_code: int,
    nrotra: int,
    clinica_id: int,
) -> dict[str, Any]:
    source_interventions = selected["interventions"]
    source_dentes = selected["dentes"]
    source_faces = selected["faces"]
    source_hist = selected["historico"]
    source_arcada = selected["arcada"]

    status_lookup = _resolve_status_lookup(brana["status_rows"])
    procedure_index = _build_procedure_index(brana["procedures"])

    mapped_interventions = []
    blockers: list[str] = []
    warnings: list[str] = []

    source_table_code = _to_int(selected["treatment"]["NROTAB"], 0) if selected["treatment"] else None

    for row in source_interventions:
        description = _clean_text(row.get("DESCRICAO"))
        if not description:
            blockers.append(f"Intervention {row.get('NROINTPAC')} has no description.")
            continue
        match = _match_procedure(procedure_index, description, preferred_table_code=source_table_code)
        source_code = _to_int(row.get("NROINT"), 0)
        if not match["matched"]:
            match = _match_procedure(
                procedure_index,
                description,
                preferred_table_code=source_table_code,
                source_procedure_code=source_code,
            )
        status_id = _source_status_to_brana_status_id(status_lookup, row.get("STATUS"))
        if status_id is None:
            blockers.append(
                f"Intervention {row.get('NROINTPAC')} status {row.get('STATUS')} could not be mapped to Brana status."
            )
        if not match["matched"]:
            blockers.append(
                f"Procedure mapping missing for intervention {row.get('NROINTPAC')} description '{description}'."
            )
        mapped_interventions.append(
            {
                "legacy_nropac": int(row.get("NROPAC")),
                "legacy_nrointpac": int(row.get("NROINTPAC")),
                "legacy_nroint": int(row.get("NROINT")),
                "legacy_nrotab": int(row.get("NROTAB")),
                "legacy_status": int(row.get("STATUS") or 0),
                "legacy_orcamento": int(row.get("ORCAMENTO") or 0),
                "legacy_datcad": row.get("DATCAD"),
                "legacy_datfin": row.get("DATFIN"),
                "legacy_description": description,
                "mapped_status_id": status_id,
                "mapped_procedure": match["candidate"],
                "mapping_reason": match["reason"],
            }
        )

    dente_by_interv = defaultdict(list)
    for row in source_dentes:
        dente_by_interv[int(row["NROINTPAC"])].append(row)
    face_by_interv = defaultdict(list)
    for row in source_faces:
        face_by_interv[int(row["NROINTPAC"])].append(row)
    hist_by_interv = defaultdict(list)
    for row in source_hist:
        hist_by_interv[int(row["NROINTPAC"])].append(row)

    for item in mapped_interventions:
        nropac = item["legacy_nropac"]
        nrointpac = item["legacy_nrointpac"]
        item["dente_rows"] = [
            {
                "legacy_nropac": nropac,
                "legacy_nrointpac": nrointpac,
                "legacy_nroden": _to_int(row.get("NRODEN"), 0),
                "legacy_bitmap": row.get("BITMAP"),
            }
            for row in dente_by_interv.get(nrointpac, [])
        ]
        item["face_rows"] = [
            {
                "legacy_nropac": nropac,
                "legacy_nrointpac": nrointpac,
                "legacy_nroden": _to_int(row.get("NRODEN"), 0),
                "face1": int(row.get("FACE1") or 0),
                "face2": int(row.get("FACE2") or 0),
                "face3": int(row.get("FACE3") or 0),
                "face4": int(row.get("FACE4") or 0),
                "face5": int(row.get("FACE5") or 0),
            }
            for row in face_by_interv.get(nrointpac, [])
        ]
        item["historico_rows"] = [
            {
                "legacy_nropac": nropac,
                "legacy_nrointpac": nrointpac,
                "legacy_data": row.get("DATA"),
                "legacy_nrodente": row.get("NRODENTE"),
                "legacy_id_prestador": row.get("ID_PRESTADOR"),
                "legacy_cor": row.get("COR"),
                "legacy_descricao": _clean_text(row.get("DESCRICAO")),
            }
            for row in hist_by_interv.get(nrointpac, [])
        ]

    arcada_slots = []
    arcada_positions = []
    for slot in source_arcada:
        slot_ordem = _to_int(slot.get("NRODEN"), 0)
        arcada_slots.append(
            {
                "slot_ordem": slot_ordem,
                "numero_dente_fdi": _to_int(slot.get("NROODONTO"), 0) or None,
                "anomalias": _to_int(slot.get("ANOMALIAS"), 0),
                "observacao": _clean_text(slot.get("OBSERV")),
            }
        )
        arcada_positions.append(
            {
                "slot_ordem": slot_ordem,
                "numero_dente_fdi": _to_int(slot.get("NROODONTO"), 0),
            }
        )

    patient_brana = brana["patient"]
    treatment_brana = brana["treatment"]
    brana_treatments = _brana_query(
        """
        SELECT id, nrotra, paciente_id
        FROM tratamento
        WHERE clinica_id = :clinica_id AND paciente_id = :paciente_id
        ORDER BY nrotra
        """,
        {"clinica_id": clinica_id, "paciente_id": patient_brana["id"] if patient_brana else -1},
    )

    report = {
        "selected_case": {
            "legacy_patient_code": patient_code,
            "legacy_treatment_nrotra": nrotra,
            "clinica_id": clinica_id,
            "fallback_patient_code": DEFAULT_FALLBACK_PATIENT,
            "fallback_treatment_nrotra": DEFAULT_FALLBACK_TREATMENT,
        },
        "source": {
            "patient": selected["patient"],
            "treatment": selected["treatment"],
            "arcada_count": len(source_arcada),
            "intervention_count": len(source_interventions),
            "dente_count": len(source_dentes),
            "face_count": len(source_faces),
            "historico_count": len(source_hist),
            "arcada": arcada_slots,
            "interventions": mapped_interventions,
        },
        "brana": {
            "patient": patient_brana,
            "existing_treatments_for_patient": brana_treatments,
            "treatment_by_nrotra": treatment_brana,
            "procedure_tables": brana["tables"],
            "procedure_count": len(brana["procedures"]),
        },
        "status_lookup": list(status_lookup.values()),
        "validation": {
            "mapped_interventions": sum(1 for item in mapped_interventions if item["mapped_procedure"] is not None),
            "missing_mappings": [
                {
                    "legacy_nrointpac": item["legacy_nrointpac"],
                    "description": item["legacy_description"],
                }
                for item in mapped_interventions
                if item["mapped_procedure"] is None
            ],
            "mapped_statuses": sum(1 for item in mapped_interventions if item["mapped_status_id"] is not None),
            "status_blockers": [
                item["legacy_nrointpac"]
                for item in mapped_interventions
                if item["mapped_status_id"] is None
            ],
            "dente_linked_interventions": len(dente_by_interv),
            "face_linked_interventions": len(face_by_interv),
            "historico_linked_interventions": len(hist_by_interv),
            "arcada_slots_ok": len(source_arcada) == 32,
            "history_destination": "tratamento.source_payload",
        },
        "blockers": blockers,
        "warnings": warnings,
        "ready_for_commit": not blockers,
        "legacy_payload_plan": {
            "tratamento": [
                "NROPAC",
                "NROTRA",
                "NROTAB",
                "NROIND",
                "STATTRA",
                "STATORC",
                "DATINI",
                "DATVAL",
                "DATCONV",
                "ID_PRESTADOR",
            ],
            "arcada": ["NRODEN", "NROODONTO", "ANOMALIAS", "OBSERV"],
            "intervencao": [
                "NROPAC",
                "NROINTPAC",
                "NROINT",
                "NROTAB",
                "STATUS",
                "ORCAMENTO",
                "S_DENTES",
                "S_FACES",
                "DATCAD",
                "DATFIN",
                "DESCRICAO",
            ],
            "dente": ["NROPAC", "NROINTPAC", "NRODEN", "BITMAP"],
            "face": ["NROPAC", "NROINTPAC", "NRODEN", "FACE1", "FACE2", "FACE3", "FACE4", "FACE5"],
            "historico": ["NROPAC", "NROINTPAC", "DATA", "NRODENTE", "ID_PRESTADOR", "COR", "DESCRICAO"],
        },
    }

    if len(source_arcada) != 32:
        blockers.append(f"Arcada count is {len(source_arcada)}; expected 32.")
    if not selected["patient"]:
        blockers.append(f"Legacy patient {patient_code} not found.")
    if not selected["treatment"]:
        blockers.append(f"Legacy treatment {nrotra} not found for patient {patient_code}.")
    if not patient_brana:
        blockers.append(f"Brana patient {patient_code} not found in clinica {clinica_id}.")
    if treatment_brana:
        warnings.append(
            f"Brana already has treatment nrotra={nrotra} for patient {patient_code}; migration would need duplicate handling."
        )
    if report["validation"]["mapped_interventions"] != len(source_interventions):
        blockers.append(
            f"Mapped interventions {report['validation']['mapped_interventions']} do not cover all source interventions {len(source_interventions)}."
        )
    if report["validation"]["mapped_statuses"] != len(source_interventions):
        blockers.append(
            f"Mapped statuses {report['validation']['mapped_statuses']} do not cover all source interventions {len(source_interventions)}."
        )

    report["ready_for_commit"] = not blockers

    return report


def _print_report(report: dict[str, Any]) -> None:
    print("== Dry-run piloto de tratamento ==")
    print(
        f"Legacy case: patient={report['selected_case']['legacy_patient_code']} "
        f"treatment={report['selected_case']['legacy_treatment_nrotra']}"
    )
    print(f"Brana clinic: {report['selected_case']['clinica_id']}")
    print("")
    src = report["source"]
    print("Source counts:")
    print(f"  Arcada: {src['arcada_count']}")
    print(f"  Interventions: {src['intervention_count']}")
    print(f"  Dentes: {src['dente_count']}")
    print(f"  Faces: {src['face_count']}")
    print(f"  Historico: {src['historico_count']}")
    print("")
    brana = report["brana"]
    print("Brana context:")
    print(f"  Patient found: {'yes' if brana['patient'] else 'no'}")
    print(f"  Existing treatments for patient: {len(brana['existing_treatments_for_patient'])}")
    print(f"  Treatment by nrotra found: {'yes' if brana['treatment_by_nrotra'] else 'no'}")
    print(f"  Procedure tables: {len(brana['procedure_tables'])}")
    print(f"  Procedures loaded: {brana['procedure_count']}")
    print("")
    print("Validation:")
    print(f"  Arcada has 32 slots: {'yes' if report['validation']['arcada_slots_ok'] else 'no'}")
    print(f"  Interventions mapped: {report['validation']['mapped_interventions']}/{src['intervention_count']}")
    print(f"  Statuses mapped: {report['validation']['mapped_statuses']}/{src['intervention_count']}")
    print(f"  Dente-linked interventions: {report['validation']['dente_linked_interventions']}")
    print(f"  Face-linked interventions: {report['validation']['face_linked_interventions']}")
    print(f"  Historico-linked interventions: {report['validation']['historico_linked_interventions']}")
    print(f"  History destination: {report['validation']['history_destination']}")
    print("")
    print("Procedure mappings:")
    for item in report["source"]["interventions"]:
        mapped = item["mapped_procedure"]
        if mapped:
            print(
                f"  {item['legacy_nrointpac']}: {item['legacy_description']} -> "
                f"{mapped['codigo']} / {mapped['nome']} (table {mapped['tabela_codigo']} - {mapped['tabela_nome']})"
            )
        else:
            print(f"  {item['legacy_nrointpac']}: {item['legacy_description']} -> MISSING")
    print("")
    if report["blockers"]:
        print("Blockers:")
        for item in report["blockers"]:
            print(f"  - {item}")
    else:
        print("Blockers: none")
    if report["warnings"]:
        print("Warnings:")
        for item in report["warnings"]:
            print(f"  - {item}")
    else:
        print("Warnings: none")
    print("")
    print(f"Ready for commit: {'yes' if report['ready_for_commit'] else 'no'}")


def _resolve_case_with_fallback(primary_patient: int, primary_treatment: int, fallback_patient: int, fallback_treatment: int) -> tuple[dict[str, Any], int, int]:
    primary = _resolve_case(primary_patient, primary_treatment)
    if primary["patient"] and primary["treatment"]:
        return primary, primary_patient, primary_treatment
    fallback = _resolve_case(fallback_patient, fallback_treatment)
    return fallback, fallback_patient, fallback_treatment


def main() -> int:
    _stdout_utf8()
    parser = argparse.ArgumentParser(
        description="Dry-run de auditoria para migracao de tratamento odontologico do EasyDental para o Brana Cloud."
    )
    parser.add_argument("--clinica-id", type=int, default=DEFAULT_BH_CLINICA_ID)
    parser.add_argument("--paciente-codigo", type=int, default=DEFAULT_PILOT_PATIENT)
    parser.add_argument("--tratamento-nrotra", type=int, default=DEFAULT_PILOT_TREATMENT)
    parser.add_argument("--fallback-paciente-codigo", type=int, default=DEFAULT_FALLBACK_PATIENT)
    parser.add_argument("--fallback-tratamento-nrotra", type=int, default=DEFAULT_FALLBACK_TREATMENT)
    parser.add_argument("--json-out", type=Path, default=None)
    args = parser.parse_args()

    report, selected_patient, selected_treatment = _resolve_case_with_fallback(
        args.paciente_codigo,
        args.tratamento_nrotra,
        args.fallback_paciente_codigo,
        args.fallback_tratamento_nrotra,
    )
    report = _summarize_case(report, _load_brana_context(args.clinica_id, selected_patient, selected_treatment), selected_patient, selected_treatment, args.clinica_id)

    # Re-read after summarization so the final report can reflect the selected case
    # even if the fallback was used.
    if report["selected_case"]["legacy_patient_code"] != selected_patient:
        report["selected_case"]["legacy_patient_code"] = selected_patient
        report["selected_case"]["legacy_treatment_nrotra"] = selected_treatment

    _print_report(report)

    if args.json_out:
        args.json_out.parent.mkdir(parents=True, exist_ok=True)
        args.json_out.write_text(json.dumps(report, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
        print(f"JSON written to: {args.json_out}")

    return 0 if report["ready_for_commit"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
