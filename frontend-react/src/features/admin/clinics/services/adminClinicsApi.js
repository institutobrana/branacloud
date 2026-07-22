import { buildApiUrl } from '../../../../services/api.js';
import { getToken } from '../../../auth/authStorage.js';

export const ADMIN_CLINICS_ENDPOINT = '/superadmin/clinicas';
const ADMIN_CLINICS_DEFAULT_LIMIT = 1000;

export function buildAdminClinicsQuery({ q = '', limit = ADMIN_CLINICS_DEFAULT_LIMIT } = {}) {
  const params = new URLSearchParams();
  const search = String(q || '').trim();
  const resolvedLimit = Number(limit || ADMIN_CLINICS_DEFAULT_LIMIT);

  if (search) params.set('q', search);
  params.set('limit', String(Number.isFinite(resolvedLimit) ? resolvedLimit : ADMIN_CLINICS_DEFAULT_LIMIT));
  return params;
}

export async function getAdminClinics(query = {}) {
  const token = getToken();
  if (!token) {
    const error = new Error('Sessão expirada.');
    error.status = 401;
    throw error;
  }

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${buildApiUrl(ADMIN_CLINICS_ENDPOINT)}?${buildAdminClinicsQuery(query).toString()}`, {
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
    const error = new Error((data && (data.detail || data.message)) || 'Falha ao carregar clínicas do ADM.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
