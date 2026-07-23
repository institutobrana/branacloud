import { buildApiUrl } from '../../../../services/api.js';
import { getToken } from '../../../auth/authStorage.js';

export const ADMIN_AUDIT_ENDPOINT = '/superadmin/auditoria';
export const ADMIN_AUDIT_DEFAULT_LIMIT = 80;

export function buildAdminAuditQuery({ limit = ADMIN_AUDIT_DEFAULT_LIMIT } = {}) {
  const params = new URLSearchParams();
  const resolvedLimit = Number(limit || ADMIN_AUDIT_DEFAULT_LIMIT);
  params.set('limit', String(Number.isFinite(resolvedLimit) ? resolvedLimit : ADMIN_AUDIT_DEFAULT_LIMIT));
  return params;
}

export async function getAdminAudit(query = {}) {
  const token = getToken();
  if (!token) {
    const error = new Error('Sessao expirada.');
    error.status = 401;
    throw error;
  }

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${buildApiUrl(ADMIN_AUDIT_ENDPOINT)}?${buildAdminAuditQuery(query).toString()}`, {
    method: 'GET',
    headers,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error((data && (data.detail || data.message)) || 'Falha ao carregar auditoria do ADM.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  if (!Array.isArray(data)) {
    const error = new Error('Resposta invalida ao carregar auditoria do ADM.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
