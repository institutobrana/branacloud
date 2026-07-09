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

function normalizeItem(item) {
  return {
    id: Number(item?.id || 0) || 0,
    tipo: String(item?.tipo || '').trim(),
    codigo: String(item?.codigo || '').trim(),
    name: String(item?.name || item?.descricao || '').trim(),
    descricao: String(item?.descricao || '').trim(),
    inativo: Boolean(item?.inativo),
    ordem: item?.ordem ?? null,
    imagem_indice: item?.imagem_indice ?? null,
    cor_apresentacao: String(item?.cor_apresentacao || '').trim(),
    exibir_anotacao_historico: Boolean(item?.exibir_anotacao_historico),
    mensagem_alerta: String(item?.mensagem_alerta || '').trim(),
    desativar_paciente_sistema: Boolean(item?.desativar_paciente_sistema),
  };
}

export async function listarAuxiliares(tipo) {
  const data = await requestJson(`/cadastros/auxiliares?tipo=${encodeURIComponent(tipo)}`, {
    headers: getAuthHeaders(),
  });
  return Array.isArray(data) ? data.map(normalizeItem) : [];
}

export async function criarAuxiliar(payload) {
  const data = await requestJson('/cadastros/auxiliares', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return normalizeItem(data);
}

export async function atualizarAuxiliar(id, payload) {
  const data = await requestJson(`/cadastros/auxiliares/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return normalizeItem(data);
}

export async function excluirAuxiliar(id) {
  return requestJson(`/cadastros/auxiliares/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

function normalizeMotivoAgendamento(item) {
  return {
    id: Number(item?.id || 0) || 0,
    codigo: String(item?.codigo || '').trim(),
    nome: String(item?.nome || '').trim(),
    name: String(item?.nome || '').trim(),
    descricao: String(item?.descricao || '').trim(),
    tipo: String(item?.tipo || '').trim().toLowerCase(),
    cor: String(item?.cor || '').trim(),
    compromisso_produtivo: Boolean(item?.compromisso_produtivo),
    inativo: Boolean(item?.inativo),
    is_active: item?.is_active === undefined ? !Boolean(item?.inativo) : Boolean(item?.is_active),
    status: String(item?.status || (item?.inativo ? 'Inativo' : 'Ativo')).trim(),
    criado_em: String(item?.criado_em || '').trim(),
    atualizado_em: String(item?.atualizado_em || '').trim(),
  };
}

export async function listarMotivosAgendamento() {
  const data = await requestJson('/cadastros/motivos-agendamento', {
    headers: getAuthHeaders(),
  });
  const itens = Array.isArray(data)
    ? data
    : Array.isArray(data?.motivos_agendamento)
      ? data.motivos_agendamento
      : Array.isArray(data?.items)
        ? data.items
        : [];
  return itens.map(normalizeMotivoAgendamento);
}

export async function criarMotivoAgendamento(payload) {
  const data = await requestJson('/cadastros/motivos-agendamento', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return normalizeMotivoAgendamento(data);
}

export async function atualizarMotivoAgendamento(id, payload) {
  const data = await requestJson(`/cadastros/motivos-agendamento/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return normalizeMotivoAgendamento(data);
}

export async function atualizarStatusMotivoAgendamento(id, isActive) {
  const data = await requestJson(`/cadastros/motivos-agendamento/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ isActive }),
  });
  return normalizeMotivoAgendamento(data);
}

export async function verificarExclusaoMotivoAgendamento(id) {
  return requestJson(`/cadastros/motivos-agendamento/${id}/delete-check`, {
    headers: getAuthHeaders(),
  });
}

export async function excluirMotivoAgendamento(id) {
  return requestJson(`/cadastros/motivos-agendamento/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

export async function substituirEExcluirMotivoAgendamento(id, replacementId) {
  return requestJson(`/cadastros/motivos-agendamento/${id}/replace-and-delete`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ replacementId }),
  });
}
