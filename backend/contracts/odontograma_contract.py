"""Contracts de leitura do odontograma V1.

Camada documental e tipada para a futura leitura do odontograma Brana.
Sem regras de escrita e sem acoplamento com HTTP.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date


@dataclass(slots=True)
class OdontogramaIntervencaoStatusContract:
    id: int
    codigo: str
    descricao: str
    ordem: int
    ativo: bool


@dataclass(slots=True)
class OdontogramaArcadaSlotContract:
    id: int
    clinica_id: int
    paciente_id: int
    tratamento_id: int
    slot_ordem: int
    numero_dente_fdi: int | None
    tipo_slot: str
    observacao: str | None


@dataclass(slots=True)
class OdontogramaDenteContract:
    id: int
    clinica_id: int
    intervencao_id: int
    numero_dente_fdi: int
    observacao: str | None


@dataclass(slots=True)
class OdontogramaFaceContract:
    id: int
    clinica_id: int
    intervencao_id: int
    numero_dente_fdi: int
    face_mesial: bool
    face_distal: bool
    face_oclusal: bool
    face_vestibular: bool
    face_lingual: bool
    observacao: str | None


@dataclass(slots=True)
class OdontogramaIntervencaoContract:
    id: int
    clinica_id: int
    paciente_id: int
    tratamento_id: int
    prestador_id: int | None
    procedimento_id: int
    status: OdontogramaIntervencaoStatusContract
    data_planejada: date | None
    data_execucao: date | None
    observacao_resumida: str | None
    dentes: list[OdontogramaDenteContract] = field(default_factory=list)
    faces: list[OdontogramaFaceContract] = field(default_factory=list)


@dataclass(slots=True)
class OdontogramaResumoLeituraContract:
    paciente_id: int
    tratamento_id: int
    contagem_intervencoes: int
    arcada_slots: list[OdontogramaArcadaSlotContract] = field(default_factory=list)
    status_lookup: list[OdontogramaIntervencaoStatusContract] = field(default_factory=list)
    intervencoes: list[OdontogramaIntervencaoContract] = field(default_factory=list)
