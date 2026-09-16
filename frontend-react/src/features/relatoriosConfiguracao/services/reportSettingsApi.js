import { buildApiUrl } from '../../../services/api.js';
import { getToken } from '../../auth/authStorage.js';

async function requestJson(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(buildApiUrl(path), { ...options, headers });
  let data = null;
  try { data = await response.json(); } catch { /* empty */ }
  if (!response.ok) throw new Error(data?.detail || 'Falha ao consultar configuração de relatórios.');
  return data;
}

const withUser = (path, userId) => Number(userId || 0) > 0 ? `${path}?user_id=${encodeURIComponent(userId)}` : path;
export const getReportSettings = (userId) => requestJson(withUser('/preferences/report-config', userId));
export const updateReportSettings = (config, userId) => requestJson('/preferences/report-config', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: Number(userId || 0) || null, config }) });
