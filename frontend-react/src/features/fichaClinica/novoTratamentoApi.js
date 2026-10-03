import { buildApiUrl } from '../../services/api.js';
import { getToken } from '../auth/authStorage.js';

async function requestJson(path, options = {}) {
  const token = getToken();
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || 'Falha ao processar o tratamento.');
  return data;
}

export function loadNovoTratamentoCombos(patientId) {
  return requestJson(`/tratamentos/novo/combos?paciente_id=${encodeURIComponent(patientId)}`);
}

export function loadGeneralPreferences() {
  return requestJson('/preferences/general');
}

export function loadSystemOptions() {
  return requestJson('/system-options');
}

export function createNovoTratamento(payload, { instanceId, leaseToken } = {}) {
  return requestJson('/tratamentos/novo', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Session-Instance-Id': instanceId || '', 'X-Clinical-Lease-Token': leaseToken || '' }, body: JSON.stringify(payload) });
}
