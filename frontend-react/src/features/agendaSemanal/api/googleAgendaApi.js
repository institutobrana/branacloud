import { buildApiUrl } from '../../../services/api.js';
import { getAuthToken } from '../../auth/authStorage.js';

async function authenticatedGet(path) {
  const token = getAuthToken();
  const response = await fetch(buildApiUrl(path), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const error = new Error(data?.detail || 'Falha na comunicação com o Google Agenda.');
    error.status = response.status;
    throw error;
  }
  return data;
}

async function authenticatedPost(path) {
  const token = getAuthToken();
  const response = await fetch(buildApiUrl(path), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const error = new Error(data?.detail || 'Falha ao desconectar o Google Agenda.');
    error.status = response.status;
    throw error;
  }
  return data;
}

export function fetchGoogleCalendarStatus() {
  return authenticatedGet('/agenda-legado/google-agenda/status');
}

export function startGoogleCalendarOAuth() {
  return authenticatedGet('/agenda-legado/google-agenda/oauth/start');
}

export function disconnectGoogleCalendar() {
  return authenticatedPost('/agenda-legado/google-agenda/disconnect');
}

export function fetchGoogleCalendarPreview({ start, end, providerId = '', unitId = '' } = {}) {
  const params = new URLSearchParams({ data_ini: start, data_fim: end, limit: '10000' });
  if (providerId) params.set('id_prestador', String(providerId));
  if (unitId) params.set('id_unidade', String(unitId));
  return authenticatedGet(`/agenda-legado/google-agenda/preview?${params.toString()}`);
}
