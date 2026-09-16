from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


def _trim_required(value: str) -> str:
    value = value.strip()
    if not value:
        raise ValueError("Descrição é obrigatória.")
    return value


class HistoricoPacienteCreate(BaseModel):
    data: date | None = None
    regiao: str | None = Field(default=None, max_length=80)
    descricao: str
    cor: int = Field(default=16777215, ge=0)
    source_intervencao_id: int | None = Field(default=None, ge=1)

    _descricao = field_validator("descricao")(_trim_required)

    @field_validator("regiao")
    @classmethod
    def trim_regiao(cls, value: str | None) -> str | None:
        return value.strip() if value is not None else None


class HistoricoPacienteInlineUpdate(BaseModel):
    data: date
    regiao: str | None = Field(default=None, max_length=80)
    descricao: str

    _descricao = field_validator("descricao")(_trim_required)

    @field_validator("regiao")
    @classmethod
    def trim_regiao(cls, value: str | None) -> str | None:
        return value.strip() if value is not None else None


class HistoricoPacientePropertiesUpdate(HistoricoPacienteInlineUpdate):
    prestador_id: int = Field(ge=1)
    cor: int = Field(ge=0)


class HistoricoPacienteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    paciente_id: int
    data: date
    prestador_id: int
    prestador_apelido: str | None = None
    prestador_nome: str | None = None
    regiao: str | None = None
    descricao: str
    cor: int
    source_id: int | None = None
    source_intervencao_id: int | None = None
    criado_em: datetime
    criado_por_id: int
    criado_por_nome: str | None = None
    atualizado_em: datetime | None = None
    atualizado_por_id: int | None = None
    atualizado_por_nome: str | None = None
