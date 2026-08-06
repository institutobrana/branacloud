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
  } catch (error) {
    const networkError = new Error('Falha de conexao ao consultar indices financeiros.');
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
    const apiError = new Error(data?.detail || data?.message || 'Falha ao carregar indices financeiros.');
    apiError.status = response.status;
    apiError.data = data;
    throw apiError;
  }

  return data;
}

export async function listarIndicesFinanceiros({ signal } = {}) {
  const data = await requestJson('/indices-financeiros', {
    method: 'GET',
    signal,
  });

  return Array.isArray(data) ? data : [];
}

export async function listarIndicesCotacoes(numero, { signal } = {}) {
  const resolvedNumero = Number(numero);
  if (!Number.isFinite(resolvedNumero) || resolvedNumero <= 0) {
    return [];
  }

  const data = await requestJson(`/indices-financeiros/${encodeURIComponent(String(resolvedNumero))}/cotacoes`, {
    method: 'GET',
    signal,
  });

  return Array.isArray(data) ? data : [];
}

export async function criarIndiceFinanceiro(payload) {
  const data = await requestJson('/indices-financeiros', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: payload?.nome,
      sigla: payload?.sigla,
    }),
  });

  return data && typeof data === 'object' ? data : null;
}

export async function updateIndiceFinanceiro(numero, payload) {
  const resolvedNumero = Number(numero);
  const data = await requestJson(`/indices-financeiros/${encodeURIComponent(String(resolvedNumero))}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: payload?.nome,
      sigla: payload?.sigla,
    }),
  });

  return data && typeof data === 'object' ? data : null;
}

export async function checkIndiceFinanceiroEmUso(numero) {
  const resolvedNumero = Number(numero);
  if (!Number.isFinite(resolvedNumero) || resolvedNumero <= 0) {
    return { emUso: false };
  }

  const data = await requestJson(`/indices-financeiros/${encodeURIComponent(String(resolvedNumero))}/em-uso`, {
    method: 'GET',
  });

  if (typeof data === 'boolean') {
    return { emUso: Boolean(data) };
  }

  if (data && typeof data === 'object') {
    return {
      emUso: Boolean(data.em_uso ?? data.emUso ?? data.in_use ?? data.inUse),
      raw: data,
    };
  }

  return { emUso: false, raw: data };
}

export async function deleteIndiceFinanceiro(numero) {
  const resolvedNumero = Number(numero);
  const data = await requestJson(`/indices-financeiros/${encodeURIComponent(String(resolvedNumero))}`, {
    method: 'DELETE',
  });

  return data && typeof data === 'object' ? data : null;
}

export async function migrateAndDeleteIndiceFinanceiro(numeroOrigem, payload = {}) {
  const resolvedNumero = Number(numeroOrigem);
  const data = await requestJson(`/indices-financeiros/${encodeURIComponent(String(resolvedNumero))}/migrar-e-excluir`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      numero_destino: payload?.numero_destino,
    }),
  });

  return data && typeof data === 'object' ? data : null;
}

export async function createIndiceFinanceiroCotacao(numero, payload = {}) {
  const resolvedNumero = Number(numero);
  const data = await requestJson(`/indices-financeiros/${encodeURIComponent(String(resolvedNumero))}/cotacoes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: payload?.data,
      valor: payload?.valor,
    }),
  });

  return data && typeof data === 'object' ? data : null;
}

export async function updateIndiceFinanceiroCotacao(numero, cotacaoId, payload = {}) {
  const resolvedNumero = Number(numero);
  const resolvedCotacaoId = Number(cotacaoId);
  const data = await requestJson(
    `/indices-financeiros/${encodeURIComponent(String(resolvedNumero))}/cotacoes/${encodeURIComponent(String(resolvedCotacaoId))}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: payload?.data,
        valor: payload?.valor,
      }),
    },
  );

  return data && typeof data === 'object' ? data : null;
}

export async function deleteIndiceFinanceiroCotacao(numero, cotacaoId) {
  const resolvedNumero = Number(numero);
  const resolvedCotacaoId = Number(cotacaoId);
  const data = await requestJson(
    `/indices-financeiros/${encodeURIComponent(String(resolvedNumero))}/cotacoes/${encodeURIComponent(String(resolvedCotacaoId))}`,
    {
      method: 'DELETE',
    },
  );

  return data && typeof data === 'object' ? data : null;
}
