import { buildApiUrl } from '../../services/api.js';

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildFirstAccessError(response, data) {
  const fallbackByStatus = {
    400: 'Verifique os dados informados.',
    401: 'Sessao expirada. Entre novamente.',
    403: 'Nao foi possivel concluir o primeiro acesso com esta conta.',
    404: 'Usuario nao encontrado.',
    409: 'Configuracao inicial ja processada.',
    422: 'Payload invalido para concluir o primeiro acesso.',
    500: 'Falha inesperada ao concluir o primeiro acesso.',
  };
  const fallback = fallbackByStatus[response.status] || 'Falha ao concluir o primeiro acesso.';
  const error = new Error((data && (data.detail || data.message)) || fallback);
  error.status = response.status;
  error.data = data;
  throw error;
}

export async function completeFirstAccess(payload, token, { signal } = {}) {
  const response = await fetch(buildApiUrl('/auth/setup/complete'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`,
    },
    body: JSON.stringify(payload || {}),
    signal,
  });
  const data = await parseJsonSafe(response);

  if (!response.ok) {
    buildFirstAccessError(response, data);
  }

  return data || {};
}
