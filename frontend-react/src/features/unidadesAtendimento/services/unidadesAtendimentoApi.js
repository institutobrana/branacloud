import { buildApiUrl } from '../../../services/api.js';

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

function normalizeString(value) {
  return String(value ?? '').trim();
}

function resolveInativo(record) {
  if (typeof record?.inativo === 'boolean') return record.inativo;
  if (typeof record?.ativo === 'boolean') return !record.ativo;
  return false;
}

export function normalizeUnidadeAtendimento(item) {
  const record = item || {};
  return {
    id: Number(record.id ?? record.row_id ?? 0) || null,
    row_id: Number(record.row_id ?? record.id ?? 0) || null,
    source_id: Number(record.source_id ?? 0) || 0,
    codigo: normalizeString(record.codigo),
    nome: normalizeString(record.nome),
    logradouro_tipo: normalizeString(record.logradouro_tipo),
    endereco: normalizeString(record.endereco),
    numero: normalizeString(record.numero),
    complemento: normalizeString(record.complemento),
    bairro: normalizeString(record.bairro),
    cidade: normalizeString(record.cidade),
    cep: normalizeString(record.cep),
    uf: normalizeString(record.uf),
    fone1_tipo: normalizeString(record.fone1_tipo),
    fone1: normalizeString(record.fone1),
    contato1: normalizeString(record.contato1),
    fone2_tipo: normalizeString(record.fone2_tipo),
    fone2: normalizeString(record.fone2),
    contato2: normalizeString(record.contato2),
    fone3_tipo: normalizeString(record.fone3_tipo),
    fone3: normalizeString(record.fone3),
    contato3: normalizeString(record.contato3),
    fone4_tipo: normalizeString(record.fone4_tipo),
    fone4: normalizeString(record.fone4),
    contato4: normalizeString(record.contato4),
    qtd_sala: Number(record.qtd_sala ?? 0) || 0,
    inativo: resolveInativo(record),
    inclusao: normalizeString(record.inclusao || record.data_inclusao),
    alteracao: normalizeString(record.alteracao || record.data_alteracao),
    criado_em: normalizeString(record.criado_em),
    atualizado_em: normalizeString(record.atualizado_em),
  };
}

export async function listarUnidadesAtendimento() {
  const data = await requestJson('/cadastros/unidades-atendimento', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return Array.isArray(data?.itens) ? data.itens.map(normalizeUnidadeAtendimento) : [];
}

export async function listarUnidadesAtendimentoCombos() {
  const data = await requestJson('/cadastros/unidades-atendimento/combos', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return Array.isArray(data) ? data : [];
}

export async function obterProximoCodigoUnidadeAtendimento() {
  const data = await requestJson('/cadastros/unidades-atendimento/proximo-codigo', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return normalizeString(data?.codigo);
}

export async function criarUnidadeAtendimento(payload) {
  const data = await requestJson('/cadastros/unidades-atendimento', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });
  return data ? normalizeUnidadeAtendimento(data) : null;
}

export async function atualizarUnidadeAtendimento(rowId, payload) {
  const id = Number(rowId || 0) || 0;
  if (!id) {
    const error = new Error('Selecione uma unidade valida.');
    error.status = 400;
    throw error;
  }

  const data = await requestJson(`/cadastros/unidades-atendimento/${encodeURIComponent(String(id))}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });
  return data ? normalizeUnidadeAtendimento(data) : null;
}

export async function listarAuxiliaresPorTipo(tipo) {
  const value = String(tipo ?? '').trim();
  if (!value) return [];
  const data = await requestJson(`/cadastros/auxiliares?tipo=${encodeURIComponent(value)}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return Array.isArray(data) ? data : [];
}
