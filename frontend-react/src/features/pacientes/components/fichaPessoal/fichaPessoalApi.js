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

export function listarAuxiliarFicha(tipo) {
  return requestJson(`/cadastros/auxiliares?tipo=${encodeURIComponent(tipo)}`).then((data) => (
    Array.isArray(data)
      ? data
        .map((item) => String(typeof item === 'string' ? item : item?.descricao || '').trim())
        .filter(Boolean)
      : []
  ));
}

export function listarUnidadesFicha() {
  return requestJson('/cadastros/unidades-atendimento/combos');
}

export function listarPrestadoresFicha() {
  return requestJson('/cadastros/prestadores');
}

export function listarConveniosPlanosCombos() {
  return requestJson('/cadastros/convenios-planos/combos');
}

export function obterPreferenciasGerais() {
  return requestJson('/preferences/general');
}

export function listarTiposIndicacao() {
  return requestJson('/cadastros/auxiliares?tipo=Tipos%20de%20indicação');
}

export function lookupCep(cep) {
  return requestJson(`/cadastros/cep/${encodeURIComponent(String(cep || ''))}`);
}

export function buscarPacientesIndicacao(q) {
  return requestJson(`/cadastros/pacientes?q=${encodeURIComponent(String(q || ''))}&limit=20`);
}

export function buscarSugestoesPorSobrenome(sobrenome) {
  const params = new URLSearchParams({ sobrenome: String(sobrenome || '').trim(), limit: '15' });
  return requestJson(`/cadastros/pacientes/sugestoes-sobrenome?${params.toString()}`);
}

export function buscarContatosIndicacao(q) {
  return requestJson(`/agenda-contatos?q=${encodeURIComponent(String(q || ''))}&limit=20`);
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
