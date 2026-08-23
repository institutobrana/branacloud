import { buildApiUrl } from '../../services/api.js';

async function requestJson(path, options = {}) {
  const token = window.localStorage.getItem('brana_token') || '';
  if (!token) {
    const error = new Error('Sessao expirada.');
    error.status = 401;
    throw error;
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error((data && (data.detail || data.message)) || 'Falha ao processar a requisicao.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function normalizePrestador(record) {
  const ativo = Boolean(record?.ativo ?? record?.status === 'Ativo' ?? true);
  return {
    id: Number(record?.id || record?.row_id || 0) || null,
    row_id: Number(record?.row_id || record?.id || 0) || null,
    source_id: Number(record?.source_id || 0) || null,
    is_system_prestador: Boolean(record?.is_system_prestador ?? false),
    codigo: String(record?.codigo || '').trim(),
    nome: String(record?.nome || '').trim(),
    apelido: String(record?.apelido || '').trim(),
    tipo_prestador: String(record?.tipo_prestador || '').trim(),
    inicio: String(record?.inicio || '').trim(),
    termino: String(record?.termino || '').trim(),
    inativo: Boolean(record?.inativo ?? !ativo),
    executa_procedimento: Boolean(record?.executa_procedimento ?? true),
    cro: String(record?.cro || '').trim(),
    uf_cro: String(record?.uf_cro || '').trim(),
    cpf: String(record?.cpf || '').trim(),
    rg: String(record?.rg || '').trim(),
    inss: String(record?.inss || '').trim(),
    ccm: String(record?.ccm || '').trim(),
    contrato: String(record?.contrato || '').trim(),
    cnes: String(record?.cnes || '').trim(),
    cbos: String(record?.cbos || '').trim(),
    nascimento: String(record?.nascimento || '').trim(),
    sexo: String(record?.sexo || '').trim(),
    estado_civil: String(record?.estado_civil || '').trim(),
    prefixo: String(record?.prefixo || '').trim(),
    inclusao: String(record?.inclusao || '').trim(),
    alteracao: String(record?.alteracao || '').trim(),
    id_interno: String(record?.id_interno || '').trim(),
    fone1: String(record?.fone1 || '').trim(),
    fone1_tipo: String(record?.fone1_tipo || '').trim(),
    fone2: String(record?.fone2 || '').trim(),
    fone2_tipo: String(record?.fone2_tipo || '').trim(),
    email: String(record?.email || '').trim(),
    homepage: String(record?.homepage || '').trim(),
    logradouro_tipo: String(record?.logradouro_tipo || '').trim(),
    endereco: String(record?.endereco || '').trim(),
    numero: String(record?.numero || '').trim(),
    complemento: String(record?.complemento || '').trim(),
    bairro: String(record?.bairro || '').trim(),
    cidade: String(record?.cidade || '').trim(),
    cep: String(record?.cep || '').trim(),
    uf: String(record?.uf || '').trim(),
    banco: String(record?.banco || '').trim(),
    agencia: String(record?.agencia || '').trim(),
    conta: String(record?.conta || '').trim(),
    nome_conta: String(record?.nome_conta || '').trim(),
    modo_pagamento: String(record?.modo_pagamento || '').trim(),
    faculdade: String(record?.faculdade || '').trim(),
    formatura: String(record?.formatura || '').trim(),
    alerta_agendamentos: String(record?.alerta_agendamentos || '').trim(),
    especialidades_exec: Array.isArray(record?.especialidades_exec) ? record.especialidades_exec : [],
    agenda_config: typeof record?.agenda_config === 'object' && record?.agenda_config !== null ? record.agenda_config : {},
    observacoes: String(record?.observacoes || '').trim(),
    especialidade: String(record?.especialidade || '').trim(),
    ativo,
    status: ativo ? 'Ativo' : 'Inativo',
  };
}

function normalizeAuxiliarItem(item) {
  return {
    id: Number(item?.id || 0) || 0,
    codigo: String(item?.codigo || '').trim(),
    descricao: String(item?.descricao || item?.name || '').trim(),
  };
}

export async function listarPrestadores() {
  const data = await requestJson('/cadastros/prestadores', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const items = Array.isArray(data?.itens) ? data.itens : [];
  return items.map(normalizePrestador);
}

export async function obterPrestador(rowId) {
  const normalizedRowId = Number(rowId || 0);
  if (!normalizedRowId) {
    const error = new Error('Prestador nao encontrado.');
    error.status = 404;
    throw error;
  }
  return requestJson(`/cadastros/prestadores/${normalizedRowId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function listarPrestadorTipos() {
  const data = await requestJson('/cadastros/prestadores/tipos', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return Array.isArray(data) ? data.map(normalizeAuxiliarItem).filter((item) => item.codigo || item.descricao) : [];
}

export async function listarPrestadorAuxiliares(tipo) {
  const normalizedTipo = String(tipo || '').trim();
  if (!normalizedTipo) return [];
  const data = await requestJson(`/cadastros/auxiliares?tipo=${encodeURIComponent(normalizedTipo)}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return Array.isArray(data) ? data.map(normalizeAuxiliarItem).filter((item) => item.descricao) : [];
}

export async function createPrestador(payload) {
  return requestJson('/cadastros/prestadores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });
}

export async function updatePrestador(rowId, payload) {
  const normalizedRowId = Number(rowId || 0);
  if (!normalizedRowId) {
    const error = new Error('Prestador invalido.');
    error.status = 400;
    throw error;
  }
  return requestJson(`/cadastros/prestadores/${normalizedRowId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });
}

export async function deletePrestador(rowId) {
  const normalizedRowId = Number(rowId || 0);
  if (!normalizedRowId) {
    const error = new Error('Prestador invalido.');
    error.status = 400;
    throw error;
  }
  return requestJson(`/cadastros/prestadores/${normalizedRowId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
