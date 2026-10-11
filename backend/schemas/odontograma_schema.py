from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, StrictInt, StrictStr, field_validator


class OdontogramaIntervencaoStatusSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    codigo: str
    descricao: str
    ordem: int
    ativo: bool


class OdontogramaArcadaSlotSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    clinica_id: int
    paciente_id: int
    tratamento_id: int
    slot_ordem: int
    numero_dente_fdi: int | None = None
    tipo_slot: str
    observacao: str | None = None


class OdontogramaDenteSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    clinica_id: int
    intervencao_id: int
    numero_dente_fdi: int
    observacao: str | None = None


class OdontogramaFaceSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    clinica_id: int
    intervencao_id: int
    numero_dente_fdi: int
    face_mesial: bool
    face_distal: bool
    face_oclusal: bool
    face_vestibular: bool
    face_lingual: bool
    observacao: str | None = None


class OdontogramaIntervencaoSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    clinica_id: int
    paciente_id: int
    tratamento_id: int
    prestador_id: int | None = None
    procedimento_id: int
    status: OdontogramaIntervencaoStatusSchema
    data_planejada: date | None = None
    data_execucao: date | None = None
    observacao_resumida: str | None = None
    dentes: list[OdontogramaDenteSchema] = Field(default_factory=list)
    faces: list[OdontogramaFaceSchema] = Field(default_factory=list)


class OdontogramaResumoSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    paciente_id: int
    tratamento_id: int
    contagem_intervencoes: int = 0
    arcada_slots: list[OdontogramaArcadaSlotSchema] = Field(default_factory=list)
    status_lookup: list[OdontogramaIntervencaoStatusSchema] = Field(default_factory=list)
    intervencoes: list[OdontogramaIntervencaoSchema] = Field(default_factory=list)


class OdontogramaListaStatusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    itens: list[OdontogramaIntervencaoStatusSchema] = Field(default_factory=list)


class OdontogramaArcadaSlotsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    itens: list[OdontogramaArcadaSlotSchema] = Field(default_factory=list)


class OdontogramaIntervencoesResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    itens: list[OdontogramaIntervencaoSchema] = Field(default_factory=list)


class OdontogramaResumoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    resumo: OdontogramaResumoSchema


class OcorrenciaTargetPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")
    type: Literal["FACE", "DENTE", "GRUPO", "ARCADA", "GERAL", "SEGMENTO"]
    slots: list[StrictInt] | None = None
    # Semantic areas, never FDI/bitmap labels. I/O and P/L belong to presentation.
    faces: list[Literal["M", "D", "CENTRAL", "V", "INTERNA"]] = Field(default_factory=list)

    @field_validator("faces")
    @classmethod
    def no_duplicate_faces(cls, values):
        if len(values) != len(set(values)):
            raise ValueError("Repeated face")
        return values


class OcorrenciaCommandPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")
    command_id: StrictStr = Field(min_length=1, max_length=128)
    mode: Literal["GRAVA_ESTA", "GRAVA_TODAS"]
    paciente_id: StrictInt
    tratamento_id: StrictInt
    procedimento_id: StrictInt
    prestador_id: StrictInt | None = None
    targets: list[OcorrenciaTargetPayload] = Field(min_length=1)
    status: Literal["observada", "realizar"] = "realizar"
    data_clinica: datetime | None = None
    valor_proprio: StrictStr | None = None
    repasse_proprio: StrictStr | None = None
    contexto: StrictStr | None = None
