import { buildApiUrl } from '../../services/api.js';

function authHeaders() {
  const token = window.localStorage.getItem('brana_token') || '';
  if (!token) throw new Error('Sessão expirada.');
  return { Authorization: `Bearer ${token}` };
}

export function formatApiError(detail, fallback) {
  if (typeof detail === 'string' && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => {
      if (typeof item === 'string') return item;
      if (!item || typeof item !== 'object') return String(item);
      const location = Array.isArray(item.loc) ? item.loc.filter((part) => part !== 'body').join('.') : '';
      return [location, item.msg || item.message || item.type].filter(Boolean).join(': ');
    }).filter(Boolean).join('; ') || fallback;
  }
  if (detail && typeof detail === 'object') return detail.msg || detail.message || JSON.stringify(detail);
  return fallback;
}

export async function listarConveniosPlanos() {
  const response = await fetch(buildApiUrl('/cadastros/convenios-planos/combos'), { headers: authHeaders() });
  let data = null;
  try { data = await response.json(); } catch { /* resposta sem JSON */ }
  if (!response.ok) {
    const error = new Error(data?.detail || data?.message || 'Falha ao carregar convênios e planos.');
    error.status = response.status;
    throw error;
  }
  return { convenios: Array.isArray(data?.convenios) ? data.convenios : [], planos: Array.isArray(data?.planos) ? data.planos : [] };
}

export async function lookupCep(cep) {
  const response = await fetch(buildApiUrl(`/cadastros/cep/${encodeURIComponent(String(cep || ''))}`), { headers: authHeaders() });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) throw new Error(data?.detail || 'CEP não encontrado.');
  return data;
}

export async function criarConvenio(payload) {
  const response = await fetch(buildApiUrl('/cadastros/convenios-planos/convenios'), {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const error = new Error(formatApiError(data?.detail ?? data?.message, 'Falha ao criar convênio.'));
    error.status = response.status;
    error.responseBody = data;
    throw error;
  }
  return data;
}

export async function alterarConvenio(rowId, payload) {
  const response = await fetch(buildApiUrl(`/cadastros/convenios-planos/convenios/${encodeURIComponent(rowId)}`), {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const error = new Error(formatApiError(data?.detail ?? data?.message, 'Falha ao alterar convênio.'));
    error.status = response.status;
    error.responseBody = data;
    throw error;
  }
  return data;
}

export async function eliminarConvenio(rowId) {
  const response = await fetch(buildApiUrl(`/cadastros/convenios-planos/convenios/${encodeURIComponent(rowId)}`), { method: 'DELETE', headers: authHeaders() });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const error = new Error(formatApiError(data?.detail ?? data?.message, 'Falha ao eliminar convênio.'));
    error.status = response.status;
    error.responseBody = data;
    throw error;
  }
  return data;
}

export async function criarPlano(payload) {
  const response = await fetch(buildApiUrl('/cadastros/convenios-planos/planos'), {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const error = new Error(formatApiError(data?.detail ?? data?.message, 'Falha ao criar plano.'));
    error.status = response.status;
    error.responseBody = data;
    throw error;
  }
  return data;
}

export async function alterarPlano(rowId, payload) {
  const response = await fetch(buildApiUrl(`/cadastros/convenios-planos/planos/${encodeURIComponent(rowId)}`), {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const error = new Error(formatApiError(data?.detail ?? data?.message, 'Falha ao alterar plano.'));
    error.status = response.status;
    error.responseBody = data;
    throw error;
  }
  return data;
}

export async function eliminarPlano(rowId) {
  const response = await fetch(buildApiUrl(`/cadastros/convenios-planos/planos/${encodeURIComponent(rowId)}`), { method: 'DELETE', headers: authHeaders() });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const error = new Error(formatApiError(data?.detail ?? data?.message, 'Falha ao eliminar plano.'));
    error.status = response.status;
    error.responseBody = data;
    throw error;
  }
  return data;
}

export async function listarCalendarioFaturamento(convenioRowId) {
  const response = await fetch(buildApiUrl(`/cadastros/convenios-planos/calendario-faturamento?convenio_row_id=${encodeURIComponent(convenioRowId)}`), { headers: authHeaders() });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) throw new Error(formatApiError(data?.detail ?? data?.message, 'Falha ao carregar calendário de faturamento.'));
  return Array.isArray(data?.itens) ? data.itens : [];
}

export async function criarCalendarioFaturamento(payload) {
  const response = await fetch(buildApiUrl('/cadastros/convenios-planos/calendario-faturamento'), {
    method: 'POST', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const error = new Error(formatApiError(data?.detail ?? data?.message, 'Falha ao criar data de faturamento.'));
    error.status = response.status; error.responseBody = data; throw error;
  }
  return data;
}

export async function alterarCalendarioFaturamento(rowId, payload) {
  const response = await fetch(buildApiUrl(`/cadastros/convenios-planos/calendario-faturamento/${encodeURIComponent(rowId)}`), {
    method: 'PUT', headers: { ...authHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  let data = null; try { data = await response.json(); } catch { data = null; }
  if (!response.ok) { const error = new Error(formatApiError(data?.detail ?? data?.message, 'Falha ao alterar data de faturamento.')); error.status = response.status; error.responseBody = data; throw error; }
  return data;
}

export async function eliminarCalendarioFaturamento(rowId) {
  const response = await fetch(buildApiUrl(`/cadastros/convenios-planos/calendario-faturamento/${encodeURIComponent(rowId)}`), { method: 'DELETE', headers: authHeaders() });
  let data = null; try { data = await response.json(); } catch { data = null; }
  if (!response.ok) { const error = new Error(formatApiError(data?.detail ?? data?.message, 'Falha ao eliminar data de faturamento.')); error.status = response.status; error.responseBody = data; throw error; }
  return data;
}
