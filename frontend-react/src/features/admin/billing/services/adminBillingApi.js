import { buildApiUrl } from '../../../../services/api.js';
import { getToken } from '../../../auth/authStorage.js';

export const ADMIN_BILLING_ENDPOINT = '/superadmin/cobrancas';
export const ADMIN_BILLING_DEFAULT_LIMIT = 200;

export function buildAdminBillingQuery({ status = '', limit = ADMIN_BILLING_DEFAULT_LIMIT } = {}) {
  const params = new URLSearchParams();
  const normalizedStatus = String(status || '').trim();
  const resolvedLimit = Number(limit || ADMIN_BILLING_DEFAULT_LIMIT);

  if (normalizedStatus) params.set('status', normalizedStatus);
  params.set('limit', String(Number.isFinite(resolvedLimit) ? resolvedLimit : ADMIN_BILLING_DEFAULT_LIMIT));
  return params;
}

export async function getAdminBilling(query = {}) {
  const token = getToken();
  if (!token) {
    const error = new Error('Sessao expirada.');
    error.status = 401;
    throw error;
  }

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${buildApiUrl(ADMIN_BILLING_ENDPOINT)}?${buildAdminBillingQuery(query).toString()}`, {
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
    const error = new Error((data && (data.detail || data.message)) || 'Falha ao carregar cobranças do ADM.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  if (!Array.isArray(data)) {
    const error = new Error('Resposta invalida ao carregar cobranças do ADM.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
