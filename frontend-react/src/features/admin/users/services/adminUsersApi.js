import { buildApiUrl } from '../../../../services/api.js';
import { getToken } from '../../../auth/authStorage.js';

export const ADMIN_USERS_ENDPOINT = '/superadmin/usuarios';
export const ADMIN_USERS_EXPORT_ENDPOINT = '/superadmin/usuarios/export.csv';
export const ADMIN_USERS_DEFAULT_LIMIT = 500;
export const ADMIN_USERS_EXPORT_DEFAULT_LIMIT = 5000;
const ADMIN_USERS_CSV_CONTENT_TYPES = new Set(['text/csv', 'application/csv', 'application/vnd.ms-excel']);

export function buildAdminUsersQuery({ q = '', limit = ADMIN_USERS_DEFAULT_LIMIT } = {}) {
  const params = new URLSearchParams();
  const search = String(q || '').trim();
  const resolvedLimit = Number(limit || ADMIN_USERS_DEFAULT_LIMIT);

  if (search) params.set('q', search);
  params.set('limit', String(Number.isFinite(resolvedLimit) ? resolvedLimit : ADMIN_USERS_DEFAULT_LIMIT));
  return params;
}

export async function getAdminUsers(query = {}) {
  const token = getToken();
  if (!token) {
    const error = new Error('Sessão expirada.');
    error.status = 401;
    throw error;
  }

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${buildApiUrl(ADMIN_USERS_ENDPOINT)}?${buildAdminUsersQuery(query).toString()}`, {
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
    const error = new Error((data && (data.detail || data.message)) || 'Falha ao carregar usuários do ADM.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  if (!Array.isArray(data)) {
    const error = new Error('Resposta inválida ao carregar usuários do ADM.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function getAdminUsersCsvFileName(contentDisposition = '') {
  const header = String(contentDisposition || '');
  const encodedMatch = header.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (encodedMatch?.[1]) {
    try {
      return decodeURIComponent(encodedMatch[1].trim().replace(/^"|"$/g, ''));
    } catch {
      return encodedMatch[1].trim().replace(/^"|"$/g, '');
    }
  }

  const plainMatch = header.match(/filename\s*=\s*("?)([^";]+)\1/i);
  return plainMatch?.[2]?.trim() || '';
}

export function isAdminUsersCsvContentType(contentType = '') {
  const normalized = String(contentType || '').split(';')[0].trim().toLowerCase();
  return ADMIN_USERS_CSV_CONTENT_TYPES.has(normalized);
}

async function readAdminUsersExportError(response) {
  const contentType = response.headers?.get('content-type') || '';
  if (contentType.toLowerCase().includes('application/json')) {
    try {
      const data = await response.json();
      return data?.detail || data?.message || null;
    } catch {
      return null;
    }
  }

  return null;
}

export async function exportAdminUsersCsv(query = {}) {
  const token = getToken();
  if (!token) {
    const error = new Error('Sessao expirada.');
    error.status = 401;
    throw error;
  }

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);

  const params = buildAdminUsersQuery({
    ...query,
    limit: query.limit || ADMIN_USERS_EXPORT_DEFAULT_LIMIT,
  });

  const response = await fetch(`${buildApiUrl(ADMIN_USERS_EXPORT_ENDPOINT)}?${params.toString()}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorMessage = await readAdminUsersExportError(response);
    const error = new Error(errorMessage || 'Falha ao exportar CSV de usuarios.');
    error.status = response.status;
    throw error;
  }

  const contentType = response.headers?.get('content-type') || '';
  if (!isAdminUsersCsvContentType(contentType)) {
    const error = new Error('Resposta invalida ao exportar CSV de usuarios.');
    error.status = response.status;
    throw error;
  }

  const blob = await response.blob();
  if (!blob || Number(blob.size || 0) <= 0) {
    const error = new Error('Arquivo CSV de usuarios vazio.');
    error.status = response.status;
    throw error;
  }

  return {
    blob,
    contentType,
    fileName: getAdminUsersCsvFileName(response.headers?.get('content-disposition') || ''),
  };
}
