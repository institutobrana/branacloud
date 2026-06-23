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
  return requestJson(`/pacientes?${params.toString()}`, {
    method: 'GET',
  });
}

export async function obterPaciente(pacienteId) {
  const id = Number(pacienteId || 0) || 0;
  if (!id) {
    throw new Error('Paciente inválido.');
  }
  return requestJson(`/pacientes/${encodeURIComponent(String(id))}`, {
    method: 'GET',
  });
}
