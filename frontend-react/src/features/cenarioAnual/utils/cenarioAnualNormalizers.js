import { CENARIO_ANUAL_DEFAULTS, CENARIO_ANUAL_DAY_INDEXES, CENARIO_ANUAL_PROFILE_FIXED } from '../constants/cenarioAnualDefaults.js';

export function toNumber(value) {
  return parseBrazilianNumber(value, 0);
}

export function parseBrazilianNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;

  const text = String(value).trim().replace(/\s+/g, '');
  if (!text) return fallback;

  let normalized = text;
  const hasComma = normalized.includes(',');
  const hasDot = normalized.includes('.');

  if (hasComma && hasDot) {
    normalized = normalized.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    normalized = normalized.replace(',', '.');
  } else if (hasDot && /^\d{1,3}(\.\d{3})+$/.test(normalized)) {
    normalized = normalized.replace(/\./g, '');
  }

  const next = Number(normalized);
  return Number.isFinite(next) ? next : fallback;
}

export function formatBrazilianNumber(value, options = {}) {
  if (value === null || value === undefined || value === '') return '';
  const number = typeof value === 'number' ? value : parseBrazilianNumber(value, NaN);
  if (!Number.isFinite(number)) return '';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
    ...options,
  }).format(number);
}

export function normalizeConsultorios(value) {
  if (value === null || value === undefined || value === '') return 1;
  if (value === 0 || value === '0') return 0;
  const next = parseBrazilianNumber(value, NaN);
  if (!Number.isFinite(next)) return 1;
  return Math.trunc(next);
}

export function normalizeTurnosFlex(turnos) {
  const source = turnos && typeof turnos === 'object' ? turnos : {};
  const normalized = {};
  for (const index of CENARIO_ANUAL_DAY_INDEXES) {
    const raw = source[String(index)] || source[index] || {};
    normalized[String(index)] = {
      manha: toNumber(raw.manha),
      tarde: toNumber(raw.tarde),
      noite: toNumber(raw.noite),
      dias: toNumber(raw.dias),
    };
  }
  return normalized;
}

export function normalizeCenarioAnualResponse(data) {
  const safe = data && typeof data === 'object' ? data : {};
  return {
    meses_trabalhados: toNumber(safe.meses_trabalhados ?? CENARIO_ANUAL_DEFAULTS.meses_trabalhados),
    dias_uteis_mes: toNumber(safe.dias_uteis_mes ?? CENARIO_ANUAL_DEFAULTS.dias_uteis_mes),
    dias_uteis_ano: toNumber(safe.dias_uteis_ano ?? CENARIO_ANUAL_DEFAULTS.dias_uteis_ano),
    horas_atendimento_dia: toNumber(safe.horas_atendimento_dia ?? CENARIO_ANUAL_DEFAULTS.horas_atendimento_dia),
    num_consultorios: normalizeConsultorios(safe.num_consultorios ?? CENARIO_ANUAL_DEFAULTS.num_consultorios),
    num_consultorios_flex: normalizeConsultorios(safe.num_consultorios_flex ?? CENARIO_ANUAL_DEFAULTS.num_consultorios_flex),
    horas_ano: toNumber(safe.horas_ano ?? CENARIO_ANUAL_DEFAULTS.horas_ano),
    modo_horas: String(safe.modo_horas || CENARIO_ANUAL_PROFILE_FIXED).trim() || CENARIO_ANUAL_PROFILE_FIXED,
    gasto_anual_particular: toNumber(safe.gasto_anual_particular),
    gasto_anual_empresa: toNumber(safe.gasto_anual_empresa),
    cartao: toNumber(safe.cartao),
    ir: toNumber(safe.ir),
    cd: toNumber(safe.cd),
    custo_ano: toNumber(safe.custo_ano),
    cfph: toNumber(safe.cfph),
    cfpm: toNumber(safe.cfpm),
    total_horas_fixo: toNumber(safe.total_horas_fixo),
    total_minutos_fixo: toNumber(safe.total_minutos_fixo),
    total_turnos_fixo: toNumber(safe.total_turnos_fixo),
    total_horas_flex: toNumber(safe.total_horas_flex),
    total_minutos_flex: toNumber(safe.total_minutos_flex),
    total_turnos_flex: toNumber(safe.total_turnos_flex),
    turnos_flex: normalizeTurnosFlex(safe.turnos_flex),
  };
}
