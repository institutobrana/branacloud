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

function withUserQuery(path, userId) {
  const id = Number(userId || 0);
  return id > 0 ? `${path}?user_id=${encodeURIComponent(String(id))}` : path;
}

function withUserPayload(payload, userId) {
  const id = Number(userId || 0);
  return id > 0 ? { ...payload, user_id: id } : payload;
}

export function getGeneralPreferences(userId) {
  return requestJson(withUserQuery('/preferences/general', userId));
}

export function updateGeneralPreferences(payload, userId) {
  return requestJson('/preferences/general', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(withUserPayload(payload, userId)),
  });
}

export function getModelPreferences(userId) {
  return requestJson(withUserQuery('/preferences/models', userId));
}

export function updateModelPreferences(payload, userId) {
  return requestJson('/preferences/models', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(withUserPayload(payload, userId)),
  });
}

export function getEnvironmentPreferences(userId) { return requestJson(withUserQuery('/preferences/environment', userId)); }
export function updateEnvironmentPreferences(payload, userId) {
  return requestJson('/preferences/environment', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(withUserPayload(payload, userId)) });
}
export function getUserDataPreferences(userId) { return requestJson(withUserQuery('/preferences/user-data', userId)); }
export function updateUserDataPreferences(payload, userId) {
  return requestJson('/preferences/user-data', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(withUserPayload(payload, userId)) });
}
export function getOdontogramPreferences(userId) { return requestJson(withUserQuery('/preferences/odontogram', userId)); }
export function updateOdontogramPreferences(payload, userId) {
  return requestJson('/preferences/odontogram', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(withUserPayload(payload, userId)) });
}
