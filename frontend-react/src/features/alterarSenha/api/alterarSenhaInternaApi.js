import { buildApiUrl } from '../../../services/api.js';
import { getToken } from '../../auth/authStorage.js';

export async function alterarSenhaInterna(payload) {
  const token = getToken();
  if (!token) throw new Error('Sessão expirada.');
  const response = await fetch(buildApiUrl('/auth/internal-password/change'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.detail || data?.message || 'Falha ao alterar senha interna.');
    error.status = response.status;
    error.code = data?.code;
    throw error;
  }
  return data || {};
}
