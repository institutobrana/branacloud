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

function unwrapCollection(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export async function listarProcedimentoMateriais(procedimentoId, { signal } = {}) {
  if (!Number(procedimentoId || 0)) return { itens: [], total_materiais: 0, total_custo_und: 0, total_custo: 0 };
  const data = await requestJson(`/procedimentos/${procedimentoId}`, {
    headers: getAuthHeaders(),
    signal,
  });
  return data?.materiais_vinculados && typeof data.materiais_vinculados === 'object'
    ? data.materiais_vinculados
    : { itens: [], total_materiais: 0, total_custo_und: 0, total_custo: 0 };
}

export async function listarMateriaisListas() {
  const data = await requestJson('/materiais/listas', {
    headers: getAuthHeaders(),
  });
  return unwrapCollection(data);
}

export async function listarMateriaisDaLista({ listaId, q = '', classificacao = '__todos__' }) {
  if (!Number(listaId || 0)) return [];
  const search = new URLSearchParams();
  search.set('lista_id', String(listaId));
  if (q) search.set('q', q);
  if (classificacao) search.set('classificacao', classificacao);
  const data = await requestJson(`/materiais?${search.toString()}`, {
    headers: getAuthHeaders(),
  });
  return Array.isArray(data) ? data : unwrapCollection(data);
}

export async function vincularMaterialProcedimento({ procedimentoId, materialId, quantidade }) {
  const data = await requestJson(`/procedimentos/${procedimentoId}/materiais-vinculados`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      material_id: Number(materialId || 0) || 0,
      quantidade: Number(quantidade || 0) || 0,
    }),
  });
  return data;
}

export async function atualizarVinculoMaterialProcedimento({ procedimentoId, codigo, quantidade }) {
  const data = await requestJson(`/procedimentos/${procedimentoId}/materiais-vinculados/por-codigo/${encodeURIComponent(String(codigo || '').trim())}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      quantidade: Number(quantidade || 0) || 0,
    }),
  });
  return data;
}

export async function desvincularMaterialProcedimento({ procedimentoId, codigo }) {
  const data = await requestJson(`/procedimentos/${procedimentoId}/materiais-vinculados/por-codigo/${encodeURIComponent(String(codigo || '').trim())}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return data;
}
