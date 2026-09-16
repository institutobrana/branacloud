import { buildApiUrl } from '../../../services/api.js';
import { getAuthToken } from '../../auth/authStorage.js';

function dateOnly(value) {
  if (typeof value === 'string') return value.slice(0, 10);
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

export async function fetchAgendaSemanalEvents({ start, end, prestadorId, unidadeId, signal } = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Sessão autenticada não encontrada.');

  const params = new URLSearchParams({
    start: dateOnly(start),
    end: dateOnly(end),
    limit: '2000',
  });
  if (prestadorId) params.set('prestador_id', String(prestadorId));
  if (unidadeId) params.set('unidade_id', String(unidadeId));

  const response = await fetch(buildApiUrl(`/agenda-legado?${params.toString()}`), {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.detail || `Falha ao carregar a Agenda (${response.status}).`);
  }
  if (!Array.isArray(payload)) throw new Error('Resposta inválida da Agenda.');
  return payload;
}

export async function fetchAgendaSearchEvents({ query = '', signal } = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Sessão autenticada não encontrada.');
  const params = new URLSearchParams({ nome: String(query).trim(), limit: '10000' });
  const response = await fetch(buildApiUrl(`/agenda-legado?${params.toString()}`), {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.detail || `Falha ao pesquisar agendamentos (${response.status}).`);
  if (!Array.isArray(payload)) throw new Error('Resposta inválida da pesquisa de agendamentos.');
  return payload;
}

export async function createAgendaEvent(payload, { signal } = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Sessão autenticada não encontrada.');
  const requestId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const log = (stage, details = {}) => {
    const entry = { timestamp: new Date().toISOString(), stage, requestId, ...details };
    console.info?.(`[AGENDA_CREATE] ${JSON.stringify(entry)}`);
  };
  const redactBody = (body) => {
    if (!body || typeof body !== 'object') return body;
    if (Array.isArray(body)) return body.map(redactBody);
    return Object.fromEntries(Object.entries(body).map(([key, value]) => (
      ['nome', 'name', 'fone1', 'fone2', 'fone3', 'telefone1', 'telefone2', 'telefone3', 'observ'].includes(key)
        ? [key, '[REDACTED]']
        : [key, redactBody(value)]
    )));
  };
  log('request_started', { url: buildApiUrl('/agenda-legado'), method: 'POST' });
  try {
    const response = await fetch(buildApiUrl('/agenda-legado'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Brana-Debug-Request-Id': requestId,
      },
      body: JSON.stringify(payload),
      signal,
    });
    log('fetch_resolved', { status: response.status, ok: response.ok });
    log('body_parse_started');
    const rawBody = await response.text();
    let result = null;
    try {
      result = rawBody ? JSON.parse(rawBody) : null;
    } catch (error) {
      log('body_parse_error', { error: error?.message, body: rawBody });
    }
    log('body_parse_finished', { body: redactBody(result ?? (rawBody || null)) });
    if (!response.ok) {
      const detail = typeof result === 'object' && result ? result.detail : rawBody;
      throw new Error(detail || `Falha ao criar o agendamento (${response.status}).`);
    }
    return result;
  } catch (error) {
    log('error_caught', { error: error?.message, errorType: error?.name });
    throw error;
  }
}

export async function updateAgendaEvent(itemId, payload, { signal } = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Sessão autenticada não encontrada.');
  const response = await fetch(buildApiUrl(`/agenda-legado/${encodeURIComponent(String(itemId))}`), {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });
  const rawBody = await response.text();
  let result = null;
  try { result = rawBody ? JSON.parse(rawBody) : null; } catch { result = rawBody || null; }
  if (!response.ok) {
    const detail = result && typeof result === 'object' ? result.detail : result;
    const error = new Error(detail || `Falha ao alterar o agendamento (${response.status}).`);
    error.status = response.status;
    error.body = result;
    throw error;
  }
  return result;
}

export async function deleteAgendaEvent(itemId, { signal } = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Sessão autenticada não encontrada.');
  const response = await fetch(buildApiUrl(`/agenda-legado/${encodeURIComponent(String(itemId))}`), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  const rawBody = await response.text();
  let result = null;
  try { result = rawBody ? JSON.parse(rawBody) : null; } catch { result = rawBody || null; }
  if (!response.ok) {
    const detail = result && typeof result === 'object' ? result.detail : result;
    const error = new Error(detail || `Falha ao eliminar o agendamento (${response.status}).`);
    error.status = response.status;
    error.body = result;
    throw error;
  }
  return result;
}

export async function repeatAgendaEvent(itemId, repeatConfig, { signal } = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Sessão autenticada não encontrada.');
  const payload = { ...repeatConfig, item_id: Number(itemId) };
  const response = await fetch(buildApiUrl('/agenda-legado/repetir'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });
  const rawBody = await response.text();
  let result = null;
  try { result = rawBody ? JSON.parse(rawBody) : null; } catch { result = rawBody || null; }
  if (!response.ok) {
    const detail = result && typeof result === 'object' ? result.detail : result;
    const error = new Error(detail || `Falha ao repetir o agendamento (${response.status}).`);
    error.status = response.status;
    error.body = result;
    throw error;
  }
  return result;
}

export async function fetchAgendaStatusCatalog({ signal } = {}) {
  return fetchAgendaCatalog('status-agendamento', signal);
}

export async function fetchAgendaCompromissoSubjects({ signal } = {}) {
  return fetchAgendaCatalog('assuntos-compromisso', signal);
}

async function fetchAgendaCatalog(path, signal) {
  const token = getAuthToken();
  if (!token) throw new Error('Sessão autenticada não encontrada.');
  const response = await fetch(buildApiUrl(`/agenda-legado/${path}`), {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(payload)) {
    throw new Error(payload?.detail || `Falha ao carregar catálogo (${response.status}).`);
  }
  return payload;
}

export async function fetchAgendaSemanalCatalogs({ signal } = {}) {
  const [especialidades, prestadores, unidades] = await Promise.all([
    fetchAgendaCatalog('especialidades', signal),
    fetchAgendaCatalog('prestadores', signal),
    fetchAgendaCatalog('unidades', signal),
  ]);
  return { especialidades, prestadores, unidades };
}
