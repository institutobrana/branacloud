import { buildApiUrl } from '../../../services/api.js';
import { getAuthToken } from '../../auth/authStorage.js';

async function requestJson(path, { signal } = {}) {
  const token = getAuthToken();
  if (!token) throw new Error('Sessão autenticada não encontrada.');
  const response = await fetch(buildApiUrl(path), { method: 'GET', headers: { Authorization: `Bearer ${token}` }, signal });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.detail || `Falha ao consultar pacientes (${response.status}).`);
  return payload;
}

export function menuPacientesDefaults() {
  return { cir_menu_pac: 0, status_menu_pac: 0, visualizacao_menu_pac: 1, pesquisa_menu_pac: 1, active_ord_menu_pac: 0 };
}

export async function listarMenuPacientesOptions({ signal } = {}) {
  return requestJson('/cadastros/pacientes/menu-options', { signal });
}

export async function listarMenuPacientes({ signal, ...input } = {}) {
  const values = { ...menuPacientesDefaults(), ...input };
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (!['q', 'offset', 'limit'].includes(key)) params.set(key, String(value ?? ''));
  });
  if (String(values.q || '').trim()) params.set('q', String(values.q).trim());
  params.set('offset', String(Math.max(0, Number(values.offset || 0) || 0)));
  params.set('limit', String(Math.max(1, Math.min(Number(values.limit || 5000) || 5000, 5000))));
  return requestJson(`/cadastros/pacientes/menu?${params.toString()}`, { signal });
}

export async function obterMenuPaciente(pacienteId, { signal } = {}) {
  const id = Number(pacienteId || 0) || 0;
  if (!id) throw new Error('Paciente inválido.');
  return requestJson(`/cadastros/pacientes/${encodeURIComponent(String(id))}`, { signal });
}

export async function fetchAgendaPatients({ signal } = {}) {
  const result = await listarMenuPacientes({ signal });
  return Array.isArray(result?.items) ? result.items : [];
}
