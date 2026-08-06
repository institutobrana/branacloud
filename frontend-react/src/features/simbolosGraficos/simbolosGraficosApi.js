import { buildApiUrl } from '../../services/api.js';

async function requestJson(path, options = {}) {
  const response = await fetch(buildApiUrl(path), options);
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

function getAuthHeaders() {
  const token = window.localStorage.getItem('brana_token') || '';
  if (!token) {
    const error = new Error('Sessao expirada.');
    error.status = 401;
    throw error;
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function listSimbolosGraficos({ q = '', scope = '' } = {}) {
  const search = new URLSearchParams();
  const qValue = String(q || '').trim();
  const scopeValue = String(scope || '').trim();

  if (qValue) {
    search.set('q', qValue);
  }
  if (scopeValue) {
    search.set('scope', scopeValue);
  }

  const query = search.toString();
  const data = await requestJson(`/cadastros/simbolos-graficos${query ? `?${query}` : ''}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return data;
}

export async function listSimbolosGraficosEspecialidades() {
  const data = await requestJson('/cadastros/auxiliares/especialidades-ativas', {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return Array.isArray(data)
    ? data.map((item) => ({
        id: Number(item?.id || 0) || 0,
        codigo: String(item?.codigo || '').trim(),
        nome: String(item?.nome || '').trim(),
        ordem: item?.ordem == null ? null : Number(item?.ordem || 0) || null,
        imagem_indice: item?.imagem_indice == null ? null : Number(item?.imagem_indice || 0) || null,
      }))
    : [];
}

export async function listSimbolosGraficosLibrary() {
  const data = await requestJson('/cadastros/simbolos-graficos?scope=catalogo', {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return Array.isArray(data) ? data : [];
}

export async function createSimboloGrafico(payload, options = {}) {
  const data = await requestJson('/cadastros/simbolos-graficos', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    signal: options.signal,
  });

  return data;
}

export async function updateSimboloGrafico(id, payload, options = {}) {
  const data = await requestJson(`/cadastros/simbolos-graficos/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
    signal: options.signal,
  });

  return data;
}

export async function deleteSimboloGrafico(id, options = {}) {
  const data = await requestJson(`/cadastros/simbolos-graficos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    signal: options.signal,
  });

  return data && typeof data === 'object' ? data : { detail: 'Simbolo excluido.' };
}

export async function listSimbolosGraficosEspecialidadesProcedimentos() {
  const data = await requestJson('/procedimentos/filtros', {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return Array.isArray(data?.especialidades)
    ? data.especialidades.map((item) => ({
        codigo: String(item?.codigo || '').trim(),
        nome: String(item?.nome || '').trim(),
      }))
    : [];
}
