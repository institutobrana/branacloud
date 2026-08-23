import {
  AGENDA_FONTE_DEFAULTS,
  normalizeAgendaFonteValue,
} from './agendaConfiguracaoFonte.js';
import {
  AGENDA_VISUALIZACAO_FIELDS,
  createAgendaConfiguracaoDraft,
} from './agendaConfiguracaoState.js';
import { buildApiUrl } from '../../services/api.js';

async function requestJson(path, options = {}) {
  const token = window.localStorage.getItem('brana_token') || '';
  if (!token) {
    const error = new Error('Sessao expirada.');
    error.status = 401;
    throw error;
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

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

const PRESTADOR_PAYLOAD_KEYS = [
  'codigo',
  'nome',
  'apelido',
  'tipo_prestador',
  'inicio',
  'termino',
  'ativo',
  'executa_procedimento',
  'cro',
  'uf_cro',
  'cpf',
  'rg',
  'inss',
  'ccm',
  'contrato',
  'cnes',
  'cbos',
  'nascimento',
  'sexo',
  'estado_civil',
  'prefixo',
  'inclusao',
  'alteracao',
  'id_interno',
  'fone1_tipo',
  'fone1',
  'fone2_tipo',
  'fone2',
  'email',
  'homepage',
  'logradouro_tipo',
  'endereco',
  'numero',
  'complemento',
  'bairro',
  'cidade',
  'cep',
  'uf',
  'banco',
  'agencia',
  'conta',
  'nome_conta',
  'modo_pagamento',
  'faculdade',
  'formatura',
  'alerta_agendamentos',
  'especialidade',
  'especialidades_exec',
  'agenda_config',
  'observacoes',
];

function cloneArray(value, fallback = []) {
  return Array.isArray(value) ? value.map((item) => (typeof item === 'object' && item !== null ? { ...item } : item)) : fallback.slice();
}

function normalizeAgendaBloqueioItem(item = {}) {
  const record = item && typeof item === 'object' ? item : {};
  return {
    id: Number(record.id || 0) || null,
    id_bloqueio: Number(record.id_bloqueio || 0) || null,
    id_prestador: Number(record.id_prestador || 0) || null,
    id_unidade: Number(record.id_unidade || 0) || null,
    unidade: String(record.unidade || record.unidade_nome || '').trim(),
    dia_sem: Number(record.dia_sem || 0) || 1,
    data_ini: String(record.data_ini || '').trim(),
    data_fin: record.data_fin == null ? null : String(record.data_fin || '').trim(),
    hora_ini: Number(record.hora_ini || 0) || 0,
    hora_fin: Number(record.hora_fin || 0) || 0,
    msg_agenda: record.msg_agenda == null ? null : String(record.msg_agenda).trim(),
  };
}

const AGENDA_VISUALIZACAO_KEY_BY_LABEL = new Map(
  AGENDA_VISUALIZACAO_FIELDS.map((field) => [field.label, field.key]),
);
const AGENDA_VISUALIZACAO_LABEL_BY_KEY = new Map(
  AGENDA_VISUALIZACAO_FIELDS.map((field) => [field.key, field.label]),
);

function normalizeVisualizacaoDraft(value) {
  const source = Array.isArray(value) ? value : [];
  const knownKeys = new Set(AGENDA_VISUALIZACAO_FIELDS.map((field) => field.key));
  const result = [];
  for (const item of source) {
    const raw = String(item || '').trim();
    const key = AGENDA_VISUALIZACAO_KEY_BY_LABEL.get(raw) || raw;
    if (key && knownKeys.has(key) && !result.includes(key)) {
      result.push(key);
    }
  }
  return result;
}

function normalizeVisualizacaoBackend(value, fallback = []) {
  const source = Array.isArray(value) ? value : [];
  const result = [];
  for (const item of source) {
    const raw = String(item || '').trim();
    const label = AGENDA_VISUALIZACAO_LABEL_BY_KEY.get(raw) || raw;
    if (label && !result.includes(label)) {
      result.push(label);
    }
  }
  return result.length > 0 ? result : fallback.slice();
}

export function mapAgendaDraftFromBackend(backendConfig = {}) {
  const source = backendConfig && typeof backendConfig === 'object' ? backendConfig : {};
  const fonte = normalizeAgendaFonteValue(source.apresentacao_fonte || AGENDA_FONTE_DEFAULTS);
  const draft = createAgendaConfiguracaoDraft();
  return {
    ...draft,
    manhaInicio: String(source.manha_inicio || draft.manhaInicio || '').trim() || draft.manhaInicio,
    manhaFim: String(source.manha_fim || draft.manhaFim || '').trim() || draft.manhaFim,
    tardeInicio: String(source.tarde_inicio || draft.tardeInicio || '').trim() || draft.tardeInicio,
    tardeFim: String(source.tarde_fim || draft.tardeFim || '').trim() || draft.tardeFim,
    duracao: Number(source.duracao || draft.duracao || 5) || draft.duracao,
    semanaHorarios: Number(source.semana_horarios || draft.semanaHorarios || 12) || draft.semanaHorarios,
    diaHorarios: Number(source.dia_horarios || draft.diaHorarios || 12) || draft.diaHorarios,
    corParticular: String(source.apresentacao_particular_cor || draft.corParticular || '').trim().toLowerCase() || draft.corParticular,
    corConvenio: String(source.apresentacao_convenio_cor || draft.corConvenio || '').trim().toLowerCase() || draft.corConvenio,
    corCompromisso: String(source.apresentacao_compromisso_cor || draft.corCompromisso || '').trim().toLowerCase() || draft.corCompromisso,
    apresentacaoFonte: fonte,
    visualizacaoCampos: normalizeVisualizacaoDraft(source.visualizacao_campos || draft.visualizacaoCampos),
  };
}

export function mapAgendaDraftToBackendConfig(draft = {}, existingConfig = {}) {
  const current = existingConfig && typeof existingConfig === 'object' ? { ...existingConfig } : {};
  const fonte = normalizeAgendaFonteValue(draft.apresentacaoFonte || existingConfig.apresentacao_fonte || AGENDA_FONTE_DEFAULTS);

  return {
    ...current,
    manha_inicio: String(draft.manhaInicio || current.manha_inicio || '07:00').trim() || '07:00',
    manha_fim: String(draft.manhaFim || current.manha_fim || '13:00').trim() || '13:00',
    tarde_inicio: String(draft.tardeInicio || current.tarde_inicio || '13:00').trim() || '13:00',
    tarde_fim: String(draft.tardeFim || current.tarde_fim || '20:00').trim() || '20:00',
    duracao: String(Number(draft.duracao || current.duracao || 5) || 5),
    semana_horarios: String(Number(draft.semanaHorarios || current.semana_horarios || 12) || 12),
    dia_horarios: String(Number(draft.diaHorarios || current.dia_horarios || 12) || 12),
    apresentacao_particular_cor: String(draft.corParticular || current.apresentacao_particular_cor || '#ffff00').trim().toLowerCase(),
    apresentacao_convenio_cor: String(draft.corConvenio || current.apresentacao_convenio_cor || '#0000ff').trim().toLowerCase(),
    apresentacao_compromisso_cor: String(draft.corCompromisso || current.apresentacao_compromisso_cor || '#00e5ef').trim().toLowerCase(),
    apresentacao_fonte: fonte,
    visualizacao_campos: normalizeVisualizacaoBackend(
      draft.visualizacaoCampos,
      cloneArray(current.visualizacao_campos),
    ),
    bloqueios_itens: cloneArray(current.bloqueios_itens),
  };
}

export function buildAgendaPrestadorPayload(prestadorRecord, draft) {
  const base = prestadorRecord && typeof prestadorRecord === 'object' ? prestadorRecord : {};
  const agendaConfig = mapAgendaDraftToBackendConfig(draft, base.agenda_config || {});
  const payload = {};
  for (const key of PRESTADOR_PAYLOAD_KEYS) {
    if (key === 'agenda_config') continue;
    if (Object.prototype.hasOwnProperty.call(base, key)) {
      payload[key] = base[key];
    }
  }
  payload.codigo = String(base.codigo || '').trim();
  payload.nome = String(base.nome || '').trim();
  payload.ativo = Boolean(base.ativo ?? true);
  payload.executa_procedimento = Boolean(base.executa_procedimento ?? true);
  payload.especialidades_exec = cloneArray(base.especialidades_exec);
  payload.agenda_config = agendaConfig;
  return payload;
}

export async function loadAgendaPrestadorRecord(prestadorId) {
  const rowId = Number(prestadorId || 0);
  if (!rowId) {
    const error = new Error('Prestador nao informado para a agenda.');
    error.status = 400;
    throw error;
  }
  return requestJson(`/agenda-legado/prestadores/${rowId}/agenda-config`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function loadAgendaBloqueios(prestadorId) {
  const rowId = Number(prestadorId || 0);
  if (!rowId) {
    const error = new Error('Prestador nao informado para os bloqueios da agenda.');
    error.status = 400;
    throw error;
  }
  const data = await requestJson(`/agenda-legado/prestadores/${rowId}/bloqueios`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return Array.isArray(data) ? data.map(normalizeAgendaBloqueioItem) : [];
}

export async function createAgendaBloqueio(prestadorId, payload) {
  const rowId = Number(prestadorId || 0);
  if (!rowId) {
    const error = new Error('Prestador nao informado para os bloqueios da agenda.');
    error.status = 400;
    throw error;
  }
  const data = await requestJson(`/agenda-legado/prestadores/${rowId}/bloqueios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });
  return normalizeAgendaBloqueioItem(data || {});
}

export async function updateAgendaBloqueio(prestadorId, bloqueioId, payload) {
  const rowId = Number(prestadorId || 0);
  const itemId = Number(bloqueioId || 0);
  if (!rowId) {
    const error = new Error('Prestador nao informado para os bloqueios da agenda.');
    error.status = 400;
    throw error;
  }
  if (!itemId) {
    const error = new Error('Bloqueio nao informado para a agenda.');
    error.status = 400;
    throw error;
  }
  const data = await requestJson(`/agenda-legado/prestadores/${rowId}/bloqueios/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload || {}),
  });
  return normalizeAgendaBloqueioItem(data || {});
}

export async function deleteAgendaBloqueio(prestadorId, bloqueioId) {
  const rowId = Number(prestadorId || 0);
  const itemId = Number(bloqueioId || 0);
  if (!rowId) {
    const error = new Error('Prestador nao informado para os bloqueios da agenda.');
    error.status = 400;
    throw error;
  }
  if (!itemId) {
    const error = new Error('Bloqueio nao informado para a agenda.');
    error.status = 400;
    throw error;
  }
  const data = await requestJson(`/agenda-legado/prestadores/${rowId}/bloqueios/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return data;
}

export async function saveAgendaPrestadorDraft(prestadorId, draft, originalRecord = null) {
  const rowId = Number(prestadorId || 0) || Number(originalRecord?.row_id || originalRecord?.id || 0);
  if (!rowId) {
    const error = new Error('Prestador nao informado para a agenda.');
    error.status = 400;
    throw error;
  }
  const record = originalRecord || (await loadAgendaPrestadorRecord(rowId));
  const payload = buildAgendaPrestadorPayload(record, draft);
  return requestJson(`/agenda-legado/prestadores/${rowId}/agenda-config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ agenda_config: payload.agenda_config }),
  });
}
