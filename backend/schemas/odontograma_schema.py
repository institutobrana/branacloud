from datetime import date

from pydantic import BaseModel, ConfigDict, Field


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


class OdontogramaResumoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    resumo: OdontogramaResumoSchema
