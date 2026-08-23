import dayjs from 'dayjs';

import {
  agendaHoraBlurValue,
  agendaHoraInputValue,
  isValidAgendaHoraInput,
} from './utils/agendaHorarioUtils.js';
import {
  formatContaCorrenteDate,
  normalizeContaCorrenteDateInput,
} from '../contaCorrenteCirurgiao/dateParsing.js';

export const AGENDA_BLOQUEIO_DIA_OPTIONS = [
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
];

export function agendaBloqueioDiaLabel(value) {
  const codigo = Number(value || 0) || 1;
  return AGENDA_BLOQUEIO_DIA_OPTIONS.find((item) => item.value === codigo)?.label || 'Segunda';
}

export function agendaBloqueioDiaValue(value) {
  const codigo = Number(value || 0) || 1;
  return AGENDA_BLOQUEIO_DIA_OPTIONS.some((item) => item.value === codigo) ? codigo : 1;
}

export function agendaBloqueioMaskDateInput(value) {
  const digits = String(value ?? '').replace(/\D+/g, '').slice(0, 8);
  if (!digits) return '';
  if (digits.length >= 5) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export function agendaBloqueioNormalizeDateInput(value, referenceDate = dayjs()) {
  const normalized = agendaBloqueioParseDateInput(value, referenceDate);
  if (!normalized) return '';
  return formatContaCorrenteDate(normalized) || '';
}

export function agendaBloqueioFormatDateForDisplay(value) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  const normalized = agendaBloqueioParseDateInput(text) || (dayjs(text).isValid() ? dayjs(text) : null);
  return normalized ? dayjs(normalized).format('DD/MM/YYYY') : text;
}

export function agendaBloqueioFormatTimeForDisplay(value) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  return agendaBloqueioNormalizeTimeInput(text);
}

export function agendaBloqueioMaskTimeInput(value) {
  return agendaHoraInputValue(value);
}

export function agendaBloqueioNormalizeTimeInput(value) {
  const normalized = agendaHoraBlurValue(value);
  return normalized || '';
}

export function agendaBloqueioIsValidTime(value) {
  return isValidAgendaHoraInput(value);
}

export function buildAgendaBloqueioDraft(source = null) {
  const record = source && typeof source === 'object' ? source : null;
  const now = dayjs().format('DD/MM/YYYY');
  return {
    id: Number(record?.id || 0) || Date.now(),
    unidade: String(record?.unidade || '').trim(),
    unidade_id: Number(record?.unidade_id || 0) || null,
    unidade_row_id: Number(record?.unidade_row_id || record?.row_id || 0) || null,
    dia_sem: agendaBloqueioDiaValue(record?.dia_sem || record?.dia || 1),
    vigencia_inicio: agendaBloqueioFormatDateForDisplay(record?.vigencia_inicio || record?.data_ini || now) || now,
    vigencia_fim: agendaBloqueioFormatDateForDisplay(record?.vigencia_fim || record?.data_fin || '') || '',
    hora_ini: agendaBloqueioNormalizeTimeInput(record?.hora_ini || record?.inicio || ''),
    hora_fin: agendaBloqueioNormalizeTimeInput(record?.hora_fin || record?.final || ''),
    msg_agenda: String(record?.msg_agenda || record?.mensagem || '').trim(),
  };
}

export function buildAgendaBloqueioPayload(draft, unidade = {}) {
  const src = draft || {};
  const unidadeLabel = String(unidade?.nome || src.unidade || '').trim();
  const vigenciaInicio = agendaBloqueioNormalizeDateInput(src.vigencia_inicio || '');
  const vigenciaFim = agendaBloqueioNormalizeDateInput(src.vigencia_fim || '');
  const horaIni = agendaBloqueioNormalizeTimeInput(src.hora_ini || '');
  const horaFim = agendaBloqueioNormalizeTimeInput(src.hora_fin || '');
  const diaSem = agendaBloqueioDiaValue(src.dia_sem || 1);

  return {
    id: Number(src.id || 0) || Date.now(),
    unidade: unidadeLabel,
    unidade_id: unidade?.source_id != null ? Number(unidade.source_id) || null : Number(src.unidade_id || 0) || null,
    unidade_row_id: unidade?.row_id != null ? Number(unidade.row_id) || null : Number(src.unidade_row_id || 0) || null,
    dia: agendaBloqueioDiaLabel(diaSem),
    dia_sem: diaSem,
    vigencia_inicio: vigenciaInicio,
    vigencia_fim: vigenciaFim,
    data_ini: vigenciaInicio,
    data_fin: vigenciaFim,
    inicio: horaIni,
    final: horaFim,
    hora_ini: horaIni,
    hora_fin: horaFim,
    hora_ini_ms: horaIni ? timeToMs(horaIni) : null,
    hora_fin_ms: horaFim ? timeToMs(horaFim) : null,
    mensagem: String(src.msg_agenda || '').trim(),
    msg_agenda: String(src.msg_agenda || '').trim(),
  };
}

export function timeToMs(value) {
  const normalized = agendaBloqueioNormalizeTimeInput(value);
  if (!normalized) return null;
  const [hh, mm] = normalized.split(':').map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  return ((hh * 60) + mm) * 60000;
}

export function agendaBloqueioTimeToLegacyInt(value) {
  const normalized = agendaBloqueioNormalizeTimeInput(value);
  if (!normalized) return null;
  const [hh, mm] = normalized.split(':').map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  return (hh * 100) + mm;
}

export function agendaBloqueioParseDateInput(value, referenceDate = dayjs()) {
  return normalizeContaCorrenteDateInput(value, referenceDate);
}
