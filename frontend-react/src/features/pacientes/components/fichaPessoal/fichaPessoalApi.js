import { buildApiUrl } from '../../../../services/api.js';
import { getToken } from '../../../auth/authStorage.js';

async function requestJson(path, options = {}) {
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(buildApiUrl(path), { ...options, headers: { ...Object.fromEntries(headers.entries()), ...(options.headers || {}) } });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail || 'Falha ao carregar dados da ficha.');
  return data;
}

export function obterProximoCodigoPaciente() {
  return requestJson('/cadastros/pacientes/proximo-codigo');
}

export function listarOpcoesFichaPaciente() {
  return requestJson('/cadastros/pacientes/menu-options');
}

export function listarConveniosPlanosCombos() {
  return requestJson('/cadastros/convenios-planos/combos');
}

export function listarTiposIndicacao() {
  return requestJson('/cadastros/auxiliares?tipo=Tipos%20de%20indicação');
}

export function createPaciente(payload) {
  return requestJson('/cadastros/pacientes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function updatePaciente(pacienteId, payload) {
  return requestJson(`/cadastros/pacientes/${encodeURIComponent(String(pacienteId))}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function deletePaciente(pacienteId) {
  return requestJson(`/cadastros/pacientes/${encodeURIComponent(String(pacienteId))}`, {
    method: 'DELETE',
  });
}
