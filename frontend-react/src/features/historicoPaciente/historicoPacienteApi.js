import { buildApiUrl } from '../../services/api.js';
import { getToken } from '../auth/authStorage.js';

export async function listarHistoricoPaciente(pacienteId, { order = 'asc', signal } = {}) {
  const id = Number(pacienteId);
  if (!Number.isInteger(id) || id <= 0) throw new Error('Paciente inválido.');

  const params = new URLSearchParams({ order: order === 'desc' ? 'desc' : 'asc' });
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(buildApiUrl(`/cadastros/pacientes/${encodeURIComponent(id)}/historico?${params}`), { signal, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || 'Falha ao carregar o histórico.');
  return Array.isArray(data) ? data : [];
}

async function historicoRequest(path, method, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(buildApiUrl(path), { method, headers, body: JSON.stringify(body) });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || 'Falha ao salvar o histórico.');
  return data;
}

function historyPath(pacienteId, suffix = '') {
  const id = Number(pacienteId);
  if (!Number.isInteger(id) || id <= 0) throw new Error('Paciente inválido.');
  return `/cadastros/pacientes/${encodeURIComponent(id)}/historico${suffix}`;
}

export function criarHistoricoPaciente(pacienteId, payload) {
  return historicoRequest(historyPath(pacienteId), 'POST', payload);
}

export function atualizarHistoricoInline(pacienteId, itemId, payload) {
  return historicoRequest(historyPath(pacienteId, `/${encodeURIComponent(itemId)}`), 'PATCH', payload);
}

export function atualizarHistoricoPropriedades(pacienteId, itemId, payload) {
  return historicoRequest(historyPath(pacienteId, `/${encodeURIComponent(itemId)}/propriedades`), 'PUT', payload);
}

export async function eliminarHistoricoPaciente(pacienteId, itemId) {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(buildApiUrl(historyPath(pacienteId, `/${encodeURIComponent(itemId)}`)), { method: 'DELETE', headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || 'Falha ao eliminar o histórico.');
  return data;
}
