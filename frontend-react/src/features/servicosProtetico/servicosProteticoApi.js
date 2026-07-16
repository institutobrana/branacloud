import { buildApiUrl } from '../../services/api.js';
import { normalizeProtetico, normalizeServico } from './utils/servicosProteticoMappers.js';

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

export async function listarProteticos() {
  const data = await requestJson('/proteticos', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return Array.isArray(data) ? data.map(normalizeProtetico) : [];
}

export async function listarServicosProtetico(proteticoId) {
  const id = Number(proteticoId || 0) || 0;
  if (!id) return [];
  const data = await requestJson(`/proteticos/${encodeURIComponent(String(id))}/servicos`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return Array.isArray(data) ? data.map(normalizeServico) : [];
}

export async function criarServicoProtetico(proteticoId, payload) {
  const id = Number(proteticoId || 0) || 0;
  if (!id) {
    const error = new Error('Selecione um protetico valido.');
    error.status = 400;
    throw error;
  }

  const data = await requestJson(`/proteticos/${encodeURIComponent(String(id))}/servicos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });

  return data ? normalizeServico(data) : null;
}

export async function alterarServicoProtetico(servicoId, payload) {
  const id = Number(servicoId || 0) || 0;
  if (!id) {
    const error = new Error('Selecione um servico valido.');
    error.status = 400;
    throw error;
  }

  const data = await requestJson(`/proteticos/servicos/${encodeURIComponent(String(id))}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });

  return data ? normalizeServico(data) : null;
}
