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

function normalizeCid(item) {
  return {
    id: Number(item?.id || 0) || 0,
    legacy_registro: Number(item?.legacy_registro || 0) || 0,
    codigo: String(item?.codigo || '').trim(),
    descricao: String(item?.descricao || '').trim(),
    observacoes: String(item?.observacoes || '').trim(),
    preferido: Boolean(item?.preferido),
  };
}

function cleanPayload(payload = {}) {
  return {
    codigo: String(payload.codigo || '').trim(),
    descricao: String(payload.descricao || '').trim(),
    observacoes: String(payload.observacoes || '').trim(),
    preferido: Boolean(payload.preferido),
  };
}

export async function listarDoencasCid() {
  const data = await requestJson('/cid', {
    method: 'GET',
  });
  return Array.isArray(data) ? data.map(normalizeCid) : [];
}

export async function criarDoencaCid(payload) {
  const data = await requestJson('/cid', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cleanPayload(payload)),
  });
  return normalizeCid(data);
}

export async function atualizarDoencaCid(id, payload) {
  const data = await requestJson(`/cid/${encodeURIComponent(String(id || ''))}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cleanPayload(payload)),
  });
  return normalizeCid(data);
}

export async function excluirDoencaCid(id) {
  const cidId = Number(id || 0) || 0;
  if (!cidId) {
    const error = new Error('Informe um CID valido.');
    error.status = 400;
    throw error;
  }

  const data = await requestJson(`/cid/${encodeURIComponent(String(cidId))}`, {
    method: 'DELETE',
  });
  return data && typeof data === 'object' ? data : { detail: 'CID excluido.' };
}
