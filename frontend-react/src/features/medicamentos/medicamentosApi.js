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

function normalizeGrupo(item) {
  return {
    id: Number(item?.id || 0) || 0,
    codigo: String(item?.codigo || '').trim(),
    descricao: String(item?.descricao || '').trim(),
  };
}

function normalizeMedicamento(item) {
  return {
    id: Number(item?.id || 0) || 0,
    nome: String(item?.nome || '').trim(),
    grupo: String(item?.grupo || '').trim(),
    apresentacao: String(item?.apresentacao || '').trim(),
  };
}

export async function listarMedicamentos({ grupo = '', nome = '', limit = 1000, skip = 0, incluirInativos = false } = {}, { signal } = {}) {
  const search = new URLSearchParams();
  if (grupo !== '' && grupo != null) {
    search.set('grupo', String(grupo).trim());
  }
  if (nome !== '' && nome != null) {
    search.set('nome', String(nome).trim());
  }
  search.set('limit', String(limit));
  search.set('skip', String(skip));
  if (incluirInativos) {
    search.set('incluir_inativos', 'true');
  }

  const data = await requestJson(`/medicamentos?${search.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    signal,
  });

  return {
    itens: Array.isArray(data?.itens) ? data.itens.map(normalizeMedicamento) : [],
    total: Number(data?.total ?? 0) || 0,
  };
}

export async function listarGruposMedicamento({ signal } = {}) {
  const data = await requestJson('/medicamentos/opcoes/grupos', {
    method: 'GET',
    headers: getAuthHeaders(),
    signal,
  });

  return Array.isArray(data?.itens) ? data.itens.map(normalizeGrupo) : [];
}
