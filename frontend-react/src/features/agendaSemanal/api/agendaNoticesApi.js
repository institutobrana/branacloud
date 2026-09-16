import { buildApiUrl } from '../../../services/api.js';
import { getAuthToken } from '../../auth/authStorage.js';

async function request(path, options = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Sessão autenticada não encontrada.');
  const response = await fetch(buildApiUrl(path), { ...options, headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) } });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.detail || `Falha na operação (${response.status}).`);
  return payload;
}

export function fetchAgendaNoticeOptions({ signal } = {}) {
  return request('/agenda-legado/avisos-agendamento/opcoes', { method: 'GET', signal });
}

export function fetchAgendaNotices({ startDate, endDate, sendType, allProviders, providerId, signal } = {}) {
  const params = new URLSearchParams({ data_ini: startDate, data_fim: endDate, tipo_envio: sendType, todos_cirurgioes: allProviders ? '1' : '0', limit: '5000' });
  if (!allProviders && providerId) params.set('id_prestador', String(providerId));
  return request(`/agenda-legado/avisos-agendamento?${params.toString()}`, { method: 'GET', signal });
}

export function sendAgendaNotices({ sendType, modelId, items, subject } = {}) {
  return request('/agenda-legado/avisos-agendamento/enviar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo_envio: sendType, modelo_id: modelId || null, itens: items, assunto: subject || undefined }) });
}
