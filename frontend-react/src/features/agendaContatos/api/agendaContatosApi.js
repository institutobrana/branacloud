import { buildApiUrl } from '../../../services/api.js';

async function requestJson(path, options = {}) {
  const token = window.localStorage.getItem('brana_token') || '';
  if (!token) throw new Error('Sessão expirada.');
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  let data = null;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const error = new Error(data?.detail || 'Falha ao carregar Agenda de contatos.');
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function listarAgendaContatos() {
  const data = await requestJson('/agenda-contatos');
  return Array.isArray(data) ? data : [];
}

export async function listarTiposContato() {
  const data = await requestJson('/cadastros/auxiliares?tipo=Tipos%20de%20contato');
  return Array.isArray(data) ? data : [];
}

export async function listarAuxiliares(tipo) {
  const data = await requestJson(`/cadastros/auxiliares?tipo=${encodeURIComponent(tipo)}`);
  return Array.isArray(data) ? data : [];
}

export async function listarEspecialidades() {
  const data = await requestJson('/procedimentos/filtros');
  return Array.isArray(data?.especialidades) ? data.especialidades : [];
}

export async function createAgendaContato(payload) {
  return requestJson('/agenda-contatos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateAgendaContato(contatoId, payload) {
  return requestJson(`/agenda-contatos/${encodeURIComponent(String(contatoId))}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteAgendaContato(contatoId) {
  return requestJson(`/agenda-contatos/${encodeURIComponent(String(contatoId))}`, {
    method: 'DELETE',
  });
}
