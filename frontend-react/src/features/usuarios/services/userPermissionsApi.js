import { buildApiUrl } from '../../../services/api.js';
import { getToken } from '../../auth/authStorage.js';

async function permissionRequest(path, password = '') {
  const token = getToken();
  if (!token) throw new Error('Sessão expirada.');
  const headers = { Authorization: `Bearer ${token}` };
  if (password) headers['X-Protected-Password'] = password;
  const response = await fetch(buildApiUrl(path), { headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(typeof data?.detail === 'string' ? data.detail : 'Falha ao carregar permissões.');
  return data;
}

async function updatePermissionRequest(path, payload, password = '') {
  const token = getToken();
  if (!token) throw new Error('Sessão expirada.');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  if (password) headers['X-Protected-Password'] = password;
  const response = await fetch(buildApiUrl(path), { method: 'PATCH', headers, body: JSON.stringify(payload) });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail;
    const message = typeof detail === 'string' ? detail : 'Falha ao atualizar permissões.';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const obterSchemaPermissoes = (password = '') => permissionRequest('/admin/users/permissions/schema', password);
export const obterPermissoesUsuario = (id, password = '') => permissionRequest(`/admin/users/${encodeURIComponent(String(id))}/permissions`, password);
export const obterPerfisUsuario = (id, password = '') => permissionRequest(`/admin/users/${encodeURIComponent(String(id))}/profiles`, password);
export const atualizarPerfisUsuario = (id, perfilId, prestadorIds, password = '') => updatePermissionRequest(`/admin/users/${encodeURIComponent(String(id))}/profiles`, { perfil_id: perfilId, prestador_ids: prestadorIds }, password);
export const atualizarPermissoesUsuario = (id, permissoes, password = '') => updatePermissionRequest(`/admin/users/${encodeURIComponent(String(id))}/permissions`, { permissoes }, password);
export const atualizarFuncaoPermissaoUsuario = (id, functions, password = '') => updatePermissionRequest(`/admin/users/${encodeURIComponent(String(id))}/permissions`, { functions }, password);
