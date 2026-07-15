import { buildApiUrl } from '../../services/api.js';
import { getToken } from '../auth/authStorage.js';
import { normalizePlanoContasResponse } from './planoContasMappers.js';
import { sanitizePlanoContasGroupPayload } from './planoContasValidators.js';
import { sanitizePlanoContasCategoryPayload } from './planoContasCategoryValidators.js';
import {
  buildPlanoContasCategoryMigrationPayload,
  classifyPlanoContasCategoryError,
  normalizePlanoContasCategoryDeletionResult,
  toPlanoContasPositiveInteger,
} from './planoContasCategoryDeletion.js';

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
  } catch (error) {
    const networkError = new Error('Falha de conexão ao consultar o plano de contas.');
    networkError.cause = error;
    throw networkError;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const apiError = new Error(data?.detail || data?.message || 'Falha ao carregar o plano de contas.');
    apiError.status = response.status;
    apiError.data = data;
    throw apiError;
  }

  return data;
}

async function requestJsonWithResponse(path, options = {}) {
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
  } catch (error) {
    const networkError = new Error('Falha de conexão ao consultar o plano de contas.');
    networkError.cause = error;
    throw networkError;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { response, data };
}

export async function listarPlanoContasGrupos() {
  const data = await requestJson('/cadastros/grupos', { method: 'GET' });
  return normalizePlanoContasResponse(data);
}

export async function criarPlanoContasGrupo(payload) {
  const body = sanitizePlanoContasGroupPayload(payload);
  return requestJson('/cadastros/grupos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function atualizarPlanoContasGrupo(grupoId, payload) {
  const body = sanitizePlanoContasGroupPayload(payload);
  return requestJson(`/cadastros/grupos/${encodeURIComponent(String(grupoId))}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function criarPlanoContasCategoria(payload) {
  const body = sanitizePlanoContasCategoryPayload(payload);
  return requestJson('/cadastros/categorias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function atualizarPlanoContasCategoria(categoriaId, payload) {
  const body = sanitizePlanoContasCategoryPayload(payload);
  return requestJson(`/cadastros/categorias/${encodeURIComponent(String(categoriaId))}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function excluirPlanoContasCategoria(categoriaId) {
  const id = toPlanoContasPositiveInteger(categoriaId);
  if (id == null) {
    throw new Error('Informe um ID válido para a categoria.');
  }

  const { response, data } = await requestJsonWithResponse(`/cadastros/categorias/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = new Error(data?.detail || data?.message || 'Falha ao excluir a categoria.');
    error.status = response.status;
    error.data = data;
    throw classifyPlanoContasCategoryError(error);
  }

  return normalizePlanoContasCategoryDeletionResult(data);
}

export async function migrarEExcluirPlanoContasCategoria(categoriaId, categoriaDestinoId) {
  const id = toPlanoContasPositiveInteger(categoriaId);
  if (id == null) {
    throw new Error('Informe um ID válido para a categoria de origem.');
  }

  const payload = buildPlanoContasCategoryMigrationPayload(categoriaDestinoId);
  const { response, data } = await requestJsonWithResponse(`/cadastros/categorias/${encodeURIComponent(String(id))}/migrar-e-excluir`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = new Error(data?.detail || data?.message || 'Falha ao migrar a categoria.');
    error.status = response.status;
    error.data = data;
    throw classifyPlanoContasCategoryError(error);
  }

  return {
    ok: true,
    data,
  };
}
