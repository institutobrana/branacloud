import { buildApiUrl } from '../../services/api.js';
import { getToken } from '../auth/authStorage.js';
import { normalizeCenarioAnualResponse } from './utils/cenarioAnualNormalizers.js';

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
    const error = new Error('Falha de conexão ao consultar o cenário anual.');
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
    const error = new Error(data?.detail || data?.message || 'Falha ao processar o cenário anual.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function carregarCenarioAnual() {
  const data = await requestJson('/cenario', { method: 'GET' });
  return normalizeCenarioAnualResponse(data);
}

export async function salvarCenarioAnual(payload) {
  const data = await requestJson('/cenario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (data && typeof data === 'object' && !Array.isArray(data) && (
    Object.prototype.hasOwnProperty.call(data, 'meses_trabalhados')
    || Object.prototype.hasOwnProperty.call(data, 'turnos_flex')
    || Object.prototype.hasOwnProperty.call(data, 'custo_ano')
  )) {
    return normalizeCenarioAnualResponse(data);
  }

  return data;
}

export async function calcularFixosAnuais(payload) {
  const data = await requestJson('/cenario/calcular-fixos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ano: Number(payload?.ano || 0),
    }),
  });

  return {
    fixo_pessoal: Number(data?.fixo_pessoal || 0),
    fixo_empresa: Number(data?.fixo_empresa || 0),
    custo_anual: Number(data?.custo_anual || 0),
  };
}
