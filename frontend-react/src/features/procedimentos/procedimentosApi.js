import { buildApiUrl } from '../../services/api.js';
import { buildProcedimentoSymbolCombo, normalizeProcedimento } from './procedimentosEditorMappers.js';
import { normalizeProcedimentosFinanceiroResponse } from './procedimentosFinanceiroMappers.js';

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

function normalizeTabela(item) {
  // This API's id is the public table code, not the database-local PK.
  const codigo = Number(item?.codigo ?? item?.id ?? 0) || 0;
  return {
    id: codigo,
    codigo,
    nome: String(item?.nome || '').trim(),
    nro_indice: Number(item?.nro_indice ?? item?.indice ?? item?.indice_id ?? 255),
    indice_sigla: String(item?.indice_sigla || '').trim(),
    fonte_pagadora: String(item?.fonte_pagadora || '').trim(),
    nro_credenciamento: String(item?.nro_credenciamento || '').trim(),
    tipo_tiss_id: Number(item?.tipo_tiss_id ?? 1),
    inativo: Boolean(item?.inativo),
  };
}

function normalizeEspecialidade(item) {
  return {
    codigo: String(item?.codigo || '').trim(),
    nome: String(item?.nome || '').trim(),
  };
}

function unwrapCollection(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export async function listarProcedimentosFiltros() {
  const data = await requestJson('/procedimentos/filtros', {
    headers: getAuthHeaders(),
  });

  return {
    tabelas: Array.isArray(data?.tabelas) ? data.tabelas.map(normalizeTabela) : [],
    especialidades: Array.isArray(data?.especialidades) ? data.especialidades.map(normalizeEspecialidade) : [],
    indices: Array.isArray(data?.indices) ? data.indices.map((item) => ({ ...item, id: Number(item.numero ?? item.id) })) : [],
    tiposTiss: Array.isArray(data?.tipos_tiss) ? data.tipos_tiss.map((item) => ({ ...item, id: Number(item.id) })) : [],
  };
}

export async function excluirProcedimento(id) {
  return requestJson(`/procedimentos/${encodeURIComponent(id)}`, { method: 'DELETE', headers: getAuthHeaders() });
}

export async function criarTabelaProcedimentos(payload) {
  const data = await requestJson('/procedimentos/tabelas', {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload),
  });
  return normalizeTabela(data);
}

export async function atualizarTabelaProcedimentos(codigo, payload) {
  const data = await requestJson(`/procedimentos/tabelas/${encodeURIComponent(codigo)}`, {
    method: 'PATCH', headers: getAuthHeaders(), body: JSON.stringify(payload),
  });
  return normalizeTabela(data);
}

export async function excluirTabelaProcedimentos(codigo) {
  return requestJson(`/procedimentos/tabelas/${encodeURIComponent(codigo)}`, { method: 'DELETE', headers: getAuthHeaders() });
}

export async function previewReajusteTabela({ tabela_id, modo, percentual }) {
  const search = new URLSearchParams({ tabela_id: String(tabela_id), modo, percentual: String(percentual), limit: '20' });
  return requestJson(`/procedimentos/tabelas/reajuste-preview?${search}`, { headers: getAuthHeaders() });
}

export async function aplicarReajusteTabela(payload) {
  return requestJson('/procedimentos/tabelas/reajuste-aplicar', {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload),
  });
}

export async function listarProcedimentos({ tabelaId, especialidade = '', q = '' }) {
  const search = new URLSearchParams();
  search.set('tabela_id', String(tabelaId || 1));
  if (especialidade) search.set('especialidade', especialidade);
  if (q) search.set('q', q);

  const data = await requestJson(`/procedimentos?${search.toString()}`, {
    headers: getAuthHeaders(),
  });

  return Array.isArray(data) ? data.map(normalizeProcedimento) : [];
}

export async function obterProximoCodigoProcedimento(tabelaId) {
  const search = new URLSearchParams();
  search.set('tabela_id', String(tabelaId || 1));
  const data = await requestJson(`/procedimentos/proximo-codigo?${search.toString()}`, {
    headers: getAuthHeaders(),
  });
  return Number(data?.codigo || 0) || 0;
}

export async function obterProcedimentoDetalhe(id) {
  const data = await requestJson(`/procedimentos/${id}`, {
    headers: getAuthHeaders(),
  });
  return normalizeProcedimento(data);
}

export async function salvarProcedimento({ id, payload }) {
  const method = id ? 'PUT' : 'POST';
  const path = id ? `/procedimentos/${id}` : '/procedimentos';
  const data = await requestJson(path, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return normalizeProcedimento(data);
}

export async function listarProcedimentosGenericosCombos(q = '') {
  const search = new URLSearchParams();
  if (q) search.set('q', q);
  const data = await requestJson(`/cadastros/procedimentos-genericos${search.toString() ? `?${search.toString()}` : ''}`, {
    headers: getAuthHeaders(),
  });
  return unwrapCollection(data).map((item) => ({
    value: Number(item?.id || 0) || 0,
    label: `${String(item?.codigo || '').trim()} - ${String(item?.descricao || '').trim()}`.trim(),
    codigo: String(item?.codigo || '').trim(),
    descricao: String(item?.descricao || '').trim(),
    especialidade: String(item?.especialidade || '').trim(),
    tempo: Number(item?.tempo || 0) || 0,
    custo_lab: Number(item?.custo_lab || 0) || 0,
    simbolo_grafico: String(item?.simbolo_grafico || '').trim(),
    simbolo_grafico_legacy_id: Number(item?.simbolo_grafico_legacy_id || 0) || null,
    mostrar_simbolo: Boolean(item?.mostrar_simbolo),
    observacoes: String(item?.observacoes || '').trim(),
  }));
}

export async function listarSimbolosGraficoProcedimentos() {
  const data = await requestJson('/cadastros/simbolos-graficos?scope=procedimentos-combo', {
    headers: getAuthHeaders(),
  });
  return buildProcedimentoSymbolCombo(unwrapCollection(data));
}

export async function obterProcedimentosDashboard({ signal } = {}) {
  const data = await requestJson('/procedimentos/dashboard', {
    headers: getAuthHeaders(),
    signal,
  });
  return normalizeProcedimentosFinanceiroResponse(data);
}

export async function obterProcedimentosDashboardPreview(payload, { signal } = {}) {
  const data = await requestJson('/procedimentos/dashboard-preview', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload || {}),
    signal,
  });
  return normalizeProcedimentosFinanceiroResponse(data);
}
