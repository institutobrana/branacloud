import { buildApiUrl } from '../../../services/api.js';
import { getToken } from '../../auth/authStorage.js';

export function normalizeOpcoesSistemaError(error, fallback = 'Falha ao carregar opções do sistema.') {
  if (typeof error === 'string' && error.trim()) return error;
  if (error && typeof error.message === 'string' && error.message.trim()) return error.message;
  if (error && typeof error.detail === 'string' && error.detail.trim()) return error.detail;
  if (error?.detail && typeof error.detail === 'object') {
    if (typeof error.detail.message === 'string') return error.detail.message;
    if (typeof error.detail.error === 'string') return error.detail.error;
  }
  return fallback;
}

export async function getOpcoesSistema(protectedPassword = '') {
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (protectedPassword) headers.set('X-Protected-Password', protectedPassword);
  const response = await fetch(buildApiUrl('/system-options'), { headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(normalizeOpcoesSistemaError(data));
    error.status = response.status;
    error.data = data;
    error.code = data?.detail?.error || data?.error;
    throw error;
  }
  return data;
}

export async function patchOpcoesSistema(values, protectedPassword = '') {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (protectedPassword) headers.set('X-Protected-Password', protectedPassword);
  const response = await fetch(buildApiUrl('/system-options'), {
    method: 'PATCH', headers, body: JSON.stringify({ values }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(normalizeOpcoesSistemaError(data));
  return data;
}
