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
    const error = new Error('Falha de conexao ao consultar conta corrente do cirurgiao.');
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
    const error = new Error(data?.detail || data?.message || 'Falha ao consultar conta corrente do cirurgiao.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function normalizePrestador(item) {
  const record = item || {};
  return {
    id: Number(record.id ?? 0) || null,
    apelido: String(record.apelido ?? '').trim(),
    nome: String(record.nome ?? '').trim(),
  };
}

function normalizeLancamento(item) {
  const record = item || {};
  return {
    id: Number(record.id ?? 0) || null,
    categoria_id: Number(record.categoria_id ?? 0) || null,
    categoria_nome: String(record.categoria_nome ?? '').trim(),
    grupo_nome: String(record.grupo_nome ?? '').trim(),
    historico: String(record.historico ?? '').trim(),
    valor: Number(record.valor ?? 0) || 0,
    tipo: String(record.tipo ?? '').trim(),
    conta: String(record.conta ?? '').trim(),
    situacao: String(record.situacao ?? 'Aberto').trim(),
    forma_pagamento: record.forma_pagamento ?? null,
    documento: record.documento ?? null,
    referencia: record.referencia ?? null,
    complemento: record.complemento ?? null,
    tributavel: Number(record.tributavel ?? 0) || 0,
    data_lancamento: String(record.data_lancamento ?? '').trim(),
    data_vencimento: String(record.data_vencimento ?? '').trim(),
    data_pagamento: record.data_pagamento ?? null,
    prestador_id: record.prestador_id ?? null,
  };
}

export async function listarPrestadoresCirurgiao() {
  const data = await requestJson('/cadastros/prestadores', {
    method: 'GET',
  });
  const itens = Array.isArray(data?.itens) ? data.itens : [];
  return itens
    .map(normalizePrestador)
    .filter((item) => item.id != null && item.nome);
}

export async function listarLancamentosContaCirurgiao({ month, year, surgeonId, viewMode }) {
  const params = new URLSearchParams();
  params.set('mes', String(Number(month || 0) || new Date().getMonth() + 1));
  params.set('ano', String(Number(year || 0) || new Date().getFullYear()));
  params.set('conta', 'CIRURGIAO');
  params.set('prestador_id', String(Number(surgeonId || 0) || 0));

  const filtroMap = {
    todos: 'Todos os lancamentos',
    tributaveis: 'Apenas lancamentos tributaveis',
    debito: 'Apenas debitos (Saidas)',
    credito: 'Apenas creditos (Entradas)',
    pessoal: 'Apenas despesas pessoais',
  };
  params.set('filtro', filtroMap[viewMode] || filtroMap.todos);

  const data = await requestJson(`/financeiro/lancamentos?${params.toString()}`, {
    method: 'GET',
  });

  return {
    itens: Array.isArray(data?.itens) ? data.itens.map(normalizeLancamento) : [],
    totalEntrada: Number(data?.total_entrada ?? 0) || 0,
    totalSaida: Number(data?.total_saida ?? 0) || 0,
    saldo: Number(data?.saldo ?? 0) || 0,
  };
}
