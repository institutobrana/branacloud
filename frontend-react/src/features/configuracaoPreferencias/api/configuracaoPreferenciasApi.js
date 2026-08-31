import { buildApiUrl } from '../../../services/api.js';
import { getToken } from '../../auth/authStorage.js';

async function requestJson(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(buildApiUrl(path), { ...options, headers });
  let data = null;
  try { data = await response.json(); } catch { /* empty response */ }
  if (!response.ok) throw new Error(data?.detail || 'Falha ao consultar preferências.');
  return data;
}

export function getGeneralPreferences() {
  return requestJson('/preferences/general');
}

export function updateGeneralPreferences(payload) {
  return requestJson('/preferences/general', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function getModelPreferences() {
  return requestJson('/preferences/models');
}

export function updateModelPreferences(payload) {
  return requestJson('/preferences/models', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function getEnvironmentPreferences() { return requestJson('/preferences/environment'); }
export function updateEnvironmentPreferences(payload) {
  return requestJson('/preferences/environment', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}
export function getUserDataPreferences() { return requestJson('/preferences/user-data'); }
export function updateUserDataPreferences(payload) {
  return requestJson('/preferences/user-data', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}
export function getOdontogramPreferences() { return requestJson('/preferences/odontogram'); }
export function updateOdontogramPreferences(payload) {
  return requestJson('/preferences/odontogram', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}
