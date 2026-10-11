"""Internal, unexposed transaction primitive for FC4 foundation proofs only.

NOT an API/writer authorization boundary. Future caller must enforce official
authentication, module/function permission, OWNER lease, lifecycle and revision
adapters before exposure. Caller owns commit. A savepoint prevents partial writes
even when a caller catches validation failures. No environment/engine/bootstrap.
"""
import hashlib
import json
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from sqlalchemy import text
from services.fc4_procedure_resolver import TARGETS, resolve_procedure_target

FACE_BITS = {"M": 1, "D": 2, "CENTRAL": 4, "V": 8, "INTERNA": 16}


class CommandConflict(ValueError):
    pass


def _id(value):
    if type(value) is not int or value <= 0:
        raise ValueError("Invalid scoped identifier")
    return value


def _money(value):
    if value is None:
        return None
    if not isinstance(value, (str, Decimal, int)) or isinstance(value, bool):
        raise ValueError("Money must be exact decimal, never float")
    try:
        amount = Decimal(value)
        if not amount.is_finite() or abs(amount) >= Decimal("1000000000000"):
            raise ValueError("Invalid money precision/range")
        rounded = amount.quantize(Decimal("0.01"))
        if amount != rounded:
            raise ValueError("Invalid money precision/range")
        return format(rounded, "f")
    except InvalidOperation as error:
        raise ValueError("Invalid decimal money") from error


def persist_normalized_command(conn, user, command_id, *, paciente_id, tratamento_id,
                               procedimento_id, targets, status="realizar",
                               prestador_id=None, data_clinica=None,
                               valor_proprio=None, repasse_proprio=None, contexto=None,
                               operation=None):
    """One procedure x normalized units, one caller-owned atomic transaction.

    Returns durable occurrence IDs, even if those occurrences were later deleted.
    Does not materialize phases/materials, touch finances or expose a new endpoint.
    """
    if not conn.in_transaction():
        raise ValueError("Explicit command transaction required")
    clinic, actor = _id(getattr(user, "clinica_id", None)), _id(getattr(user, "id", None))
    if not isinstance(command_id, str) or not command_id.strip() or len(command_id) > 128:
        raise ValueError("Invalid command identity")
    for value in (paciente_id, tratamento_id, procedimento_id):
        _id(value)
    if prestador_id is not None:
        _id(prestador_id)
    if status not in ("observada", "realizar", "realizada"):
        raise ValueError("Invalid status")
    if data_clinica is not None and (not isinstance(data_clinica, datetime)
                                     or data_clinica.utcoffset() is None):
        raise ValueError("Clinical datetime requires explicit timezone")
    if contexto is not None and not isinstance(contexto, str):
        raise ValueError("Invalid context")
    if not isinstance(targets, (list, tuple)) or not targets:
        raise ValueError("At least one normalized target unit required")
    units = []
    for target in targets:
        if not isinstance(target, dict) or set(target) - {"type", "slots", "faces_mask"}:
            raise ValueError("Invalid normalized target")
        slots = target.get("slots", [])
        mask = target.get("faces_mask", 0)
        if not isinstance(slots, list) or type(mask) is not int or not 0 <= mask <= 31:
            raise ValueError("Invalid face/slot representation")
        for slot in slots:
            _id(slot)
        if len(set(slots)) != len(slots) or target.get("type") not in TARGETS.values():
            raise ValueError("Repeated slot or unknown target")
        units.append({"type": target["type"], "slots": sorted(slots), "faces_mask": mask})
    payload = dict(paciente_id=paciente_id, tratamento_id=tratamento_id,
                   procedimento_id=procedimento_id, prestador_id=prestador_id,
                   status=status, targets=units,
                   data_clinica=data_clinica.isoformat() if data_clinica else None,
                   valor_proprio=_money(valor_proprio), repasse_proprio=_money(repasse_proprio),
                   contexto=contexto)
    if operation is not None:
        if operation not in ("GRAVA_ESTA", "GRAVA_TODAS"):
            raise ValueError("Invalid command operation")
        payload["operation"] = operation
    digest = hashlib.sha256(json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    with conn.begin_nested():
        if not conn.execute(text("SELECT 1 FROM usuarios WHERE id=:u AND clinica_id=:c"),
                            {"u": actor, "c": clinic}).first():
            raise ValueError("Invalid scoped actor")
        conn.execute(text("SELECT pg_advisory_xact_lock(hashtextextended(:key,0))"),
                     {"key": f"fc4:{clinic}:{command_id}"})
        previous = conn.execute(text("""
            SELECT usuario_id,payload_hash,resultado FROM odontograma_comandos
            WHERE clinica_id=:c AND command_id=:cmd
        """), {"c": clinic, "cmd": command_id}).mappings().first()
        if previous:
            if previous["usuario_id"] != actor or previous["payload_hash"] != digest:
                raise CommandConflict("Command identity reused with different actor/payload")
            if previous["resultado"] is None:
                raise CommandConflict("Incomplete receipt requires reconciliation")
            return list(previous["resultado"])  # No defaults/catalog recalculation.
        procedure, target_type = resolve_procedure_target(conn, clinic, procedimento_id)
        if any(unit["type"] != target_type for unit in units):
            raise ValueError("Applied target incompatible with live symbol metadata")
        if target_type == "GERAL" and len(units) != 1:
            raise ValueError("GENERAL is one context unit")
        provider = prestador_id if prestador_id is not None else getattr(user, "prestador_id", None)
        _id(provider)
        clinical_date = data_clinica or datetime.now(timezone.utc)
        status_id = conn.execute(text("""
            SELECT id FROM odontograma_intervencao_status WHERE codigo=:s AND ativo
        """), {"s": status}).scalar_one()
        if not procedure["forma_cobranca"]:
            raise ValueError("Missing applied billing type")
        conn.execute(text("""
            INSERT INTO odontograma_comandos(clinica_id,command_id,usuario_id,procedimento_id,payload_hash)
            VALUES (:c,:cmd,:u,:p,:hash)
        """), {"c": clinic, "cmd": command_id, "u": actor, "p": procedimento_id, "hash": digest})
        ids = []
        for ordinal, unit in enumerate(units, 1):
            ids.append(conn.execute(text("""
                INSERT INTO odontograma_intervencoes
                (clinica_id,paciente_id,tratamento_id,prestador_id,procedimento_id,status_id,
                 alvo_tipo,alvo_slots,faces_mask,contexto,forma_cobranca_aplicada,
                 valor_proprio,repasse_proprio,data_clinica,criado_por_id,
                 command_id,command_unidade)
                VALUES (:c,:patient,:t,:provider,:p,:s,:kind,CAST(:slots AS JSONB),:mask,:context,
                        :billing,:value,:share,:date,:u,:cmd,:ordinal) RETURNING id
            """), {"c": clinic, "patient": paciente_id, "t": tratamento_id, "provider": provider,
                   "p": procedimento_id, "s": status_id, "kind": unit["type"],
                   "slots": json.dumps(unit["slots"]), "mask": unit["faces_mask"], "context": contexto,
                   "billing": procedure["forma_cobranca"], "value": payload["valor_proprio"],
                   "share": payload["repasse_proprio"], "date": clinical_date, "u": actor,
                   "cmd": command_id, "ordinal": ordinal}).scalar_one())
        conn.execute(text("""
            UPDATE odontograma_comandos SET resultado=CAST(:result AS JSONB)
            WHERE clinica_id=:c AND command_id=:cmd
        """), {"c": clinic, "cmd": command_id, "result": json.dumps(ids)})
        return ids
