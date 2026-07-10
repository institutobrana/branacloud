import { buildApiUrl } from '../../services/api.js';

async function requestJson(path, options = {}) {
  const response = await fetch(buildApiUrl(path), options);
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error((data && (data.detail || data.message)) || 'Falha ao processar a requisicao.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function getAuthHeaders() {
  const token = window.localStorage.getItem('brana_token') || '';
  if (!token) {
    const error = new Error('Sessao expirada.');
    error.status = 401;
    throw error;
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function normalizeProcedimentoGenerico(item) {
  return {
    id: Number(item?.id || 0) || 0,
    codigo: String(item?.codigo || '').trim(),
    descricao: String(item?.descricao || '').trim(),
    especialidade: String(item?.especialidade || '').trim(),
    status: String(item?.status || (item?.inativo ? 'Inativo' : 'Ativo')).trim(),
    inativo: Boolean(item?.inativo),
    instrucao_direta: String(item?.instrucao_direta || item?.observacoes || '').trim(),
    total_fases: Number(item?.total_fases || 0) || 0,
    total_materiais: Number(item?.total_materiais || 0) || 0,
  };
}

export async function listarProcedimentosGenericos(params = {}) {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.especialidade) search.set('especialidade', params.especialidade);

  const data = await requestJson(`/cadastros/procedimentos-genericos${search.toString() ? `?${search.toString()}` : ''}`, {
    headers: getAuthHeaders(),
  });
  return Array.isArray(data) ? data.map(normalizeProcedimentoGenerico) : [];
}
