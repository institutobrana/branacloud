export const EMPTY_UNIDADE_ATENDIMENTO_FORM = {
  id: null,
  codigo: '',
  nome: '',
  inativo: false,
  logradouro_tipo: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  cep: '',
  uf: '',
  fone1_tipo: '',
  fone1: '',
  contato1: '',
  fone2_tipo: '',
  fone2: '',
  contato2: '',
  fone3_tipo: '',
  fone3: '',
  contato3: '',
  fone4_tipo: '',
  fone4: '',
  contato4: '',
  qtd_sala: '',
  inclusao: '',
  alteracao: '',
  criado_em: '',
  atualizado_em: '',
};

export function mapUnidadeAtendimentoToForm(item) {
  const record = item || {};
  const resolvedInativo =
    typeof record.inativo === 'boolean'
      ? record.inativo
      : typeof record.ativo === 'boolean'
        ? !record.ativo
        : false;
  return {
    ...EMPTY_UNIDADE_ATENDIMENTO_FORM,
    id: record.id ?? null,
    codigo: String(record.codigo ?? '').trim(),
    nome: String(record.nome ?? '').trim(),
    inativo: resolvedInativo,
    logradouro_tipo: String(record.logradouro_tipo ?? '').trim(),
    endereco: String(record.endereco ?? '').trim(),
    numero: String(record.numero ?? '').trim(),
    complemento: String(record.complemento ?? '').trim(),
    bairro: String(record.bairro ?? '').trim(),
    cidade: String(record.cidade ?? '').trim(),
    cep: String(record.cep ?? '').trim(),
    uf: String(record.uf ?? '').trim(),
    fone1_tipo: String(record.fone1_tipo ?? '').trim(),
    fone1: String(record.fone1 ?? '').trim(),
    contato1: String(record.contato1 ?? '').trim(),
    fone2_tipo: String(record.fone2_tipo ?? '').trim(),
    fone2: String(record.fone2 ?? '').trim(),
    contato2: String(record.contato2 ?? '').trim(),
    fone3_tipo: String(record.fone3_tipo ?? '').trim(),
    fone3: String(record.fone3 ?? '').trim(),
    contato3: String(record.contato3 ?? '').trim(),
    fone4_tipo: String(record.fone4_tipo ?? '').trim(),
    fone4: String(record.fone4 ?? '').trim(),
    contato4: String(record.contato4 ?? '').trim(),
    qtd_sala: String(record.qtd_sala ?? '').trim(),
    inclusao: String(record.inclusao ?? '').trim(),
    alteracao: String(record.alteracao ?? '').trim(),
    criado_em: String(record.criado_em ?? '').trim(),
    atualizado_em: String(record.atualizado_em ?? '').trim(),
  };
}

export function buildUnidadeAtendimentoPayload(values, options = {}) {
  const data = values || {};
  const payload = {
    codigo: String(data.codigo ?? '').trim(),
    nome: String(data.nome ?? '').trim(),
    logradouro_tipo: String(data.logradouro_tipo ?? '').trim(),
    endereco: String(data.endereco ?? '').trim(),
    numero: String(data.numero ?? '').trim(),
    complemento: String(data.complemento ?? '').trim(),
    bairro: String(data.bairro ?? '').trim(),
    cidade: String(data.cidade ?? '').trim(),
    cep: String(data.cep ?? '').trim(),
    uf: String(data.uf ?? '').trim(),
    fone1_tipo: String(data.fone1_tipo ?? '').trim(),
    fone1: String(data.fone1 ?? '').trim(),
    contato1: String(data.contato1 ?? '').trim(),
    fone2_tipo: String(data.fone2_tipo ?? '').trim(),
    fone2: String(data.fone2 ?? '').trim(),
    contato2: String(data.contato2 ?? '').trim(),
    fone3_tipo: String(data.fone3_tipo ?? '').trim(),
    fone3: String(data.fone3 ?? '').trim(),
    contato3: String(data.contato3 ?? '').trim(),
    fone4_tipo: String(data.fone4_tipo ?? '').trim(),
    fone4: String(data.fone4 ?? '').trim(),
    contato4: String(data.contato4 ?? '').trim(),
    ativo: !Boolean(data.inativo),
    inclusao: String(data.inclusao ?? '').trim(),
    alteracao: String(data.alteracao ?? '').trim(),
  };

  const qtdSala = options.qtdSala ?? data.qtd_sala;
  if (qtdSala !== undefined && qtdSala !== null && String(qtdSala).trim() !== '') {
    payload.qtd_sala = Number(qtdSala) || 0;
  }

  return payload;
}

export function formatUnidadeStatus(item) {
  return item?.inativo ? 'Inativo' : 'Ativo';
}
