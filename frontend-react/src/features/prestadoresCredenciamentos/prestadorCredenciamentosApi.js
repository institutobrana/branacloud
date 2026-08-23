import { buildApiUrl } from '../../services/api.js';

const ALL_FILTER = '__all__';

async function requestJson(path, options = {}) {
  const token = window.localStorage.getItem('brana_token') || '';
  if (!token) throw new Error('Sessao expirada.');
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.detail || 'Falha ao carregar credenciamentos.');
    error.status = response.status;
    throw error;
  }
  return data;
}

function normalizeCredenciamento(item = {}) {
  const system = Boolean(item.prestador_sistemico) || item.prestador_row_id == null;
  return {
    ...item,
    id: Number(item.id || item.row_id || 0) || null,
    codigo: String(item.codigo ?? '').trim(),
    prestador_row_id: system ? 0 : Number(item.prestador_row_id || item.prestador_id || 0) || null,
    prestador_sistemico: system,
    prestador_nome: system ? '001 - Clínica' : String(item.prestador_nome ?? '').trim(),
    convenio_nome: String(item.convenio_nome ?? '').trim(),
    inicio: String(item.inicio ?? '').trim(),
    fim: String(item.fim ?? '').trim(),
    valor_us: String(item.valor_us ?? '').trim(),
    aviso: String(item.aviso ?? item.alerta ?? '').trim(),
    observacoes: String(item.observacoes ?? item.obs ?? '').trim(),
    inclusao: String(item.inclusao ?? item.data_inclusao ?? '').trim(),
    alteracao: String(item.alteracao ?? item.data_alteracao ?? '').trim(),
  };
}

export async function listarCredenciamentos({ convenioRowId = ALL_FILTER, prestadorRowId = ALL_FILTER } = {}) {
  const params = new URLSearchParams();
  if (convenioRowId !== ALL_FILTER && Number(convenioRowId) > 0) params.set('convenio_row_id', String(convenioRowId));
  if (prestadorRowId !== ALL_FILTER) params.set('prestador_row_id', String(Number(prestadorRowId) === 0 ? 0 : prestadorRowId));
  const query = params.toString();
  const data = await requestJson(`/cadastros/prestadores/credenciamentos${query ? `?${query}` : ''}`);
  return Array.isArray(data?.itens) ? data.itens.map(normalizeCredenciamento) : [];
}

export async function listarCredenciamentoCombos() {
  const data = await requestJson('/cadastros/convenios-planos/combos');
  return Array.isArray(data?.convenios) ? data.convenios : [];
}

export async function criarCredenciamento(payload) {
  const data = await requestJson('/cadastros/prestadores/credenciamentos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });
  return normalizeCredenciamento(data);
}

export async function atualizarCredenciamento(rowId, payload) {
  const id = Number(rowId || 0);
  if (!id) throw new Error('Credenciamento invalido.');
  const data = await requestJson(`/cadastros/prestadores/credenciamentos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });
  return normalizeCredenciamento(data);
}

export async function excluirCredenciamento(rowId) {
  const id = Number(rowId || 0);
  if (!id) throw new Error('Credenciamento invalido.');
  await requestJson(`/cadastros/prestadores/credenciamentos/${id}`, { method: 'DELETE' });
}

export { ALL_FILTER };
