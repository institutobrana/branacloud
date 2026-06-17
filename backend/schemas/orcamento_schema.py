from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class OrcamentoIntervencaoSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    procedimento_id: int
    codigo: int
    regiao: str
    cirurgiao: str
    intervencao: str
    paciente_rs: float
    convenio_rs: float
    incluir: bool = True
    status: str = ""
    marcacao: date | None = None
    finalizacao: date | None = None
    observacoes: str | None = None


class OrcamentoParcelaSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    numero: int
    dia: str
    data: date | None = None
    valor: float = 0.0
    credito: float = 0.0
    valor_ja_pago: float = 0.0


class OrcamentoComissaoSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    numero: int
    valor: float = 0.0
    cirurgiao: str = ""
    percentual: float = 0.0
    comissao: float = 0.0


class OrcamentoPrincipalSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    valor_total: float = 0.0
    desconto_percentual: float = 0.0
    valor_corrigido: float = 0.0
    total_ja_pago: float = 0.0
    total_a_pagar: float = 0.0
    indice: str = "R$"
    parcelas: int = 1
    valor_diferenca: float = 0.0


class OrcamentoDetalhesSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nro_tratamento: str = ""
    validade: str = ""
    criacao_tratamento: str = ""
    ultima_alteracao: str = ""
    ultima_aprovacao: str = ""


class OrcamentoConvenioSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    numero_guia_tratamento: str = ""
    senha_autorizacao: str = ""
    total_repasse_previsto: float = 0.0
    data_prevista_pagamento: str = ""


class OrcamentoOrtodontiaSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    valor_manutencao_moeda: str = "R$"
    valor_manutencao: float = 0.0
    vencimento_dia: int = 0
    termino_previsto: str = ""
    ativar_manutencao: bool = False


class OrcamentoTratamentoSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    paciente_id: int
    paciente_nome: str
    paciente_codigo: int
    nrotra: int
    situacao: str
    data_inicio: str = ""
    data_finalizacao: str = ""
    tabela_codigo: int = 1
    indice: int = 255
    cirurgiao_responsavel_id: int | None = None
    cirurgiao_responsavel_nome: str = ""
    unidade_atendimento: str = ""
    observacoes: str = ""
    convenio_nome: str = ""
    id_convenio: int | None = None
    tipo_atendimento_tiss_id: int | None = None
    tipo_atendimento_tiss_nome: str = ""
    sinais_doenca_periodontal: int = 3
    alteracao_tecidos: int = 3
    numero_guia: str = ""
    data_autorizacao: str = ""
    senha_autorizacao: str = ""
    validade_senha: str = ""
    aprovado: bool = False
    aprovado_em: str = ""
    criado_em: str = ""
    atualizado_em: str = ""


class OrcamentoViewSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    tratamento: OrcamentoTratamentoSchema
    principal: OrcamentoPrincipalSchema
    detalhes: OrcamentoDetalhesSchema
    convenio: OrcamentoConvenioSchema
    ortodontia: OrcamentoOrtodontiaSchema
    intervencoes: list[OrcamentoIntervencaoSchema] = Field(default_factory=list)
    parcelas: list[OrcamentoParcelaSchema] = Field(default_factory=list)
    comissoes: list[OrcamentoComissaoSchema] = Field(default_factory=list)
    status_lookup: list[dict[str, Any]] = Field(default_factory=list)


class OrcamentoListaTratamentoSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nrotra: int
    data_inicio: str = ""
    data_finalizacao: str = ""
    situacao: str = ""
    tabela_codigo: int = 1
    cirurgiao_responsavel_nome: str = ""
    valor_total: float = 0.0
    valor_corrigido: float = 0.0
    total_ja_pago: float = 0.0
    total_a_pagar: float = 0.0
    aprovado: bool = False
    paciente_id: int
    paciente_nome: str


class OrcamentoIntervencaoUpdatePayload(BaseModel):
    tabela_codigo: int | None = None
    cirurgiao_id: int | None = None
    situacao: str | None = None
    marcacao: str | None = None
    finalizacao: str | None = None
    observacoes: str | None = None
    receber_paciente: float | None = None
    receber_convenio: float | None = None
    nao_incluir_no_orcamento: bool | None = None
    codigo_glosa: str | None = None
    mensagem_autorizacao: str | None = None


class OrcamentoParcelaUpdatePayload(BaseModel):
    data: str | None = None
    valor_parcela: float | None = None
    valor_ja_pago: float | None = None


class OrcamentoAprovacaoPayload(BaseModel):
    gerar_conta_corrente: bool = True


class OrcamentoImpressaoPayload(BaseModel):
    modelo_orcamento: str = "Resumido"
    saida: str = "Impressora"
    endereco: str | None = None
    imprimir_odontograma: bool = True
    imprimir_valores_intervencoes: bool = True
    titulo_relatorio: str = "Previsao de honorarios"
    mensagem_para_impressao: str | None = None
    imprimir_observacoes_do_tratamento: bool = False


class OrcamentoAprovacaoResultadoSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    detail: str
    conta_corrente_aberta: bool = False
    lancamentos_ids: list[int] = Field(default_factory=list)
    orcamento: OrcamentoViewSchema


class OrcamentoImpressaoResultadoSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    detail: str
    orcamento: OrcamentoViewSchema
    impressao: dict[str, Any]
