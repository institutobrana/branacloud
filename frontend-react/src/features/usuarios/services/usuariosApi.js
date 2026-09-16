import { buildApiUrl } from '../../../services/api.js';
import { getToken } from '../../auth/authStorage.js';

export async function listarUsuarios(password = '') {
  const token = getToken();
  if (!token) throw new Error('Sessão expirada.');
  const headers = { Authorization: `Bearer ${token}` };
  if (password) headers['X-Protected-Password'] = password;
  const response = await fetch(buildApiUrl('/admin/users'), { headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail;
    const message = typeof detail === 'string' ? detail : detail ? JSON.stringify(detail) : 'Falha ao carregar usuários.';
    const error = new Error(message); error.status = response.status; error.data = data; error.code = detail?.error || data?.error; throw error;
  }
  if (!Array.isArray(data)) throw new Error('Resposta inválida ao carregar usuários.');
  return data;
}

function authHeaders(password = '') {
  const token = getToken();
  if (!token) throw new Error('Sessão expirada.');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  if (password) headers['X-Protected-Password'] = password;
  return headers;
}

async function requestUser(path, options = {}, password = '') {
  const response = await fetch(buildApiUrl(path), { ...options, headers: { ...authHeaders(password), ...(options.headers || {}) } });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail;
    const message = typeof detail === 'string' ? detail : detail ? JSON.stringify(detail) : 'Falha ao processar usuário.';
    const error = new Error(message); error.status = response.status; error.data = data; error.code = data?.detail?.error || data?.error; throw error;
  }
  return data;
}

export async function obterProximoCodigoUsuario(password = '') {
  return requestUser('/admin/users/proximo-codigo', {}, password);
}

export async function criarUsuario(payload, password = '') {
  return requestUser('/admin/users', { method: 'POST', body: JSON.stringify(payload) }, password);
}

export async function atualizarUsuario(id, payload, password = '') {
  return requestUser(`/admin/users/${encodeURIComponent(String(id))}`, { method: 'PATCH', body: JSON.stringify(payload) }, password);
}

export async function atualizarAtivoUsuario(id, ativo, password = '') {
  return requestUser(`/admin/users/${encodeURIComponent(String(id))}/active`, { method: 'PATCH', body: JSON.stringify({ ativo: Boolean(ativo) }) }, password);
}

export async function excluirUsuario(id, password = '') {
  return requestUser(`/admin/users/${encodeURIComponent(String(id))}`, { method: 'DELETE' }, password);
}

export async function alterarSenhaUsuario(payload, password = '') {
  return requestUser('/admin/users/change-password', { method: 'POST', body: JSON.stringify(payload) }, password);
}



export async function listarTiposUsuario(password = '') {
  const data = await requestUser('/cadastros/auxiliares?tipo=Tipos%20de%20usu%C3%A1rio', {}, password);
  return Array.isArray(data) ? data.filter((item) => String(item?.descricao || '').trim()) : [];
}

export async function listarPrestadoresUsuario(password = '') {
  const data = await requestUser('/cadastros/prestadores', {}, password);
  return Array.isArray(data?.itens) ? data.itens : [];
}

export async function listarUnidadesUsuario(password = '') {
  const data = await requestUser('/cadastros/unidades-atendimento/combos', {}, password);
  return Array.isArray(data) ? data : [];
}
