import { buildApiUrl } from '../../../services/api.js';
import { getToken } from '../../auth/authStorage.js';

async function requestJson(path, options = {}) {
  const token = getToken();
  if (!token) {
    const error = new Error('Sessao expirada.');
    error.status = 401;
    throw error;
  }

  const headers = new Headers(options.headers || {});
  if (!headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(buildApiUrl(path), {
      ...options,
      headers,
    });
  } catch (err) {
    const error = new Error(`Falha de conexao com o servidor administrativo em ${buildApiUrl('/superadmin/overview')}.`);
    error.cause = err;
    throw error;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const fallbackMessage =
      response.status === 401 || response.status === 403
        ? 'Acesso administrativo negado.'
        : 'Falha ao carregar a visao geral do ADM.';
    const error = new Error((data && (data.detail || data.message)) || fallbackMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function getAdminOverview() {
  return requestJson('/superadmin/overview', {
    method: 'GET',
  });
}
