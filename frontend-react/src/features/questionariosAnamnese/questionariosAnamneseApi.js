import { buildApiUrl } from '../../services/api.js';

async function requestJson(path, options = {}) {
  const token = window.localStorage.getItem('brana_token');
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: 'application/json',
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === 'string' ? body : body?.detail || body?.message || 'Falha ao consultar anamnese.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return body;
}

export async function listarQuestionariosAnamnese() {
  const data = await requestJson('/anamnese/questionarios');
  return Array.isArray(data) ? data : [];
}

export async function listarPerguntasQuestionarioAnamnese(questionarioId) {
  if (!questionarioId) return [];
  const data = await requestJson(`/anamnese/questionarios/${questionarioId}/perguntas`);
  return Array.isArray(data) ? data : [];
}

export async function criarQuestionarioAnamnese(payload) {
  return requestJson('/anamnese/questionarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });
}

export async function criarPerguntaQuestionarioAnamnese(questionarioId, payload) {
  return requestJson(`/anamnese/questionarios/${questionarioId}/perguntas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });
}

export async function atualizarPerguntaQuestionarioAnamnese(perguntaId, payload) {
  return requestJson(`/anamnese/perguntas/${perguntaId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });
}

export async function excluirPerguntaQuestionarioAnamnese(perguntaId) {
  return requestJson(`/anamnese/perguntas/${perguntaId}`, {
    method: 'DELETE',
  });
}

export async function atualizarQuestionarioAnamnese(questionarioId, payload) {
  return requestJson(`/anamnese/questionarios/${questionarioId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });
}

export async function excluirQuestionarioAnamnese(questionarioId) {
  return requestJson(`/anamnese/questionarios/${questionarioId}`, {
    method: 'DELETE',
  });
}
