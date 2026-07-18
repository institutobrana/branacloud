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

function normalizeLista(item) {
  return {
    id: Number(item?.id || 0) || 0,
    nome: String(item?.nome || '').trim(),
    nro_indice: Number(item?.nro_indice ?? item?.indice_id ?? 255) || 255,
    indice_id: Number(item?.indice_id ?? item?.indice ?? item?.nro_indice ?? 255) || 255,
    indice_sigla: String(item?.indice_sigla || '').trim(),
    indice_nome: String(item?.indice_nome || '').trim(),
  };
}

function normalizeMaterial(item) {
  return {
    id: Number(item?.id || 0) || 0,
    codigo: String(item?.codigo || '').trim(),
    nome: String(item?.nome || '').trim(),
    preco: Number(item?.preco || 0) || 0,
    relacao: Number(item?.relacao || 0) || 0,
    custo: Number(item?.custo || 0) || 0,
    unidade_compra: String(item?.unidade_compra || '').trim(),
    unidade_consumo: String(item?.unidade_consumo || '').trim(),
    validade_dias: Number(item?.validade_dias || 0) || 0,
    preferido: Boolean(item?.preferido),
    classificacao: String(item?.classificacao || '').trim(),
    lista_id: Number(item?.lista_id || 0) || 0,
  };
}

function normalizeIndice(item) {
  return {
    id: Number(item?.id ?? item?.numero ?? item?.indice ?? 0) || 0,
    sigla: String(item?.sigla || '').trim(),
    nome: String(item?.nome || '').trim(),
  };
}

function normalizeAuxiliar(item) {
  return String(item?.descricao || item?.nome || '').trim();
}

export async function listarMateriaisListas() {
  const data = await requestJson('/materiais/listas', {
    headers: getAuthHeaders(),
  });
  return Array.isArray(data) ? data.map(normalizeLista) : [];
}

export async function criarTabelaMateriais(payload) {
  const data = await requestJson('/materiais/listas', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return normalizeLista(data);
}

export async function alterarTabelaMateriais(listaId, payload) {
  const data = await requestJson(`/materiais/listas/${listaId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return normalizeLista(data);
}

export async function excluirTabelaMateriais(listaId) {
  return requestJson(`/materiais/listas/${listaId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

export async function obterProximoCodigoMaterial(listaId) {
  const data = await requestJson(`/materiais/listas/${listaId}/proximo-codigo`, {
    headers: getAuthHeaders(),
  });
  return String(data?.codigo || '').trim();
}

export async function listarMateriais({ listaId, q = '', classificacao = '__todos__' }) {
  const search = new URLSearchParams();
  search.set('lista_id', String(listaId || 0));
  search.set('q', String(q || ''));
  search.set('classificacao', String(classificacao || '__todos__'));
  const data = await requestJson(`/materiais?${search.toString()}`, {
    headers: getAuthHeaders(),
  });
  return Array.isArray(data) ? data.map(normalizeMaterial) : [];
}

export async function criarMaterial(payload) {
  const data = await requestJson('/materiais', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return normalizeMaterial(data);
}

export async function alterarMaterial(materialId, payload) {
  const data = await requestJson(`/materiais/${materialId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return normalizeMaterial(data);
}

export async function excluirMaterial(materialId) {
  return requestJson(`/materiais/${materialId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

export async function listarIndicesMateriais() {
  const data = await requestJson('/materiais/indices', {
    headers: getAuthHeaders(),
  });
  return Array.isArray(data) ? data.map(normalizeIndice) : [];
}

export async function listarAuxiliaresPorTipo(tipo) {
  const data = await requestJson(`/cadastros/auxiliares?tipo=${encodeURIComponent(String(tipo || '').trim())}`, {
    headers: getAuthHeaders(),
  });
  return Array.isArray(data) ? data.map(normalizeAuxiliar).filter(Boolean) : [];
}
