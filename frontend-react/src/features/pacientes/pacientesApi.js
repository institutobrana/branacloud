import { buildApiUrl } from '../../services/api.js';
import { getToken } from '../auth/authStorage.js';

async function requestJson(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(buildApiUrl(path), {
      ...options,
      headers,
    });
  } catch (err) {
    const error = new Error('Falha de conexão ao consultar pacientes.');
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
    const error = new Error(data?.detail || data?.message || 'Falha ao consultar pacientes.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function listarPacientes(query = '') {
  const params = new URLSearchParams();
  if (String(query || '').trim()) {
    params.set('q', String(query).trim());
  }
  params.set('limit', '80');
  return requestJson(`/cadastros/pacientes?${params.toString()}`, {
    method: 'GET',
  });
}

export async function obterPaciente(pacienteId) {
  const id = Number(pacienteId || 0) || 0;
  if (!id) {
    throw new Error('Paciente inválido.');
  }
  return requestJson(`/cadastros/pacientes/${encodeURIComponent(String(id))}`, {
    method: 'GET',
  });
}

export async function listarPacientesMenu(query = '', preferences = {}, pagination = {}) {
  const params = new URLSearchParams();
  const term = String(query || '').trim();
  if (term) {
    params.set('q', term);
  }
  const prefEntries = {
    cir_menu_pac: 0,
    status_menu_pac: 0,
    visualizacao_menu_pac: 1,
    pesquisa_menu_pac: 1,
    active_ord_menu_pac: 0,
    ...preferences,
  };
  Object.entries(prefEntries).forEach(([key, value]) => {
    params.set(key, String(value ?? ''));
  });
  params.set('offset', String(Math.max(0, Number(pagination?.offset || 0) || 0)));
  params.set('limit', String(Math.max(1, Math.min(Number(pagination?.limit || 5000) || 5000, 5000))));
  return requestJson(`/cadastros/pacientes/menu?${params.toString()}`, {
    method: 'GET',
  });
}

export async function listarPacientesMenuOptions() {
  return requestJson('/cadastros/pacientes/menu-options', {
    method: 'GET',
  });
}

export async function obterPacientesMenuPreferences() {
  return requestJson('/cadastros/pacientes/menu-preferences', {
    method: 'GET',
  });
}

export async function atualizarPacientesMenuPreferences(values) {
  return requestJson('/cadastros/pacientes/menu-preferences', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values || {}),
  });
}

export async function navegarPacientes(atualId, sentido) {
  const params = new URLSearchParams();
  if (atualId != null && atualId !== '') {
    params.set('atual_id', String(atualId));
  }
  params.set('sentido', sentido);
  return requestJson(`/cadastros/pacientes/navegar?${params.toString()}`, {
    method: 'GET',
  });
}
