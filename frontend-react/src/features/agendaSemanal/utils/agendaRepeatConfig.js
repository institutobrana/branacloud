const MIN_DAYS = 1;
const MAX_DAYS = 60;
const MIN_WEEKS = 1;
const MAX_WEEKS = 60;
const MIN_WEEKDAY = 1;
const MAX_WEEKDAY = 6;
const MIN_MONTH_DAY = 1;
const MAX_MONTH_DAY = 31;
const MIN_MONTHS = 1;
const MAX_MONTHS = 60;

function clampInteger(value, minimum, maximum, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(minimum, Math.min(maximum, parsed));
}

export function repeatMonthDayFromDate(dateValue) {
  const day = Number.parseInt(String(dateValue || '').slice(8, 10), 10);
  return clampInteger(day, MIN_MONTH_DAY, MAX_MONTH_DAY, MIN_MONTH_DAY);
}

export function createRepeatState(dateValue = '') {
  return {
    enabled: false,
    mode: 'dias',
    days: 1,
    weeks: 1,
    weekday: 1,
    monthDay: repeatMonthDayFromDate(dateValue),
    months: 1,
    overwrite: false,
  };
}

export function buildRepeatConfig(state, itemId) {
  if (!state?.enabled) return null;
  const mode = ['dias', 'semanas', 'meses'].includes(state.mode) ? state.mode : 'dias';
  const config = {
    item_id: Number(itemId),
    modo: mode,
    sobrepor: Boolean(state.overwrite),
  };
  if (mode === 'dias') config.qtd_dias = clampInteger(state.days, MIN_DAYS, MAX_DAYS, MIN_DAYS);
  if (mode === 'semanas') {
    config.qtd_semanas = clampInteger(state.weeks, MIN_WEEKS, MAX_WEEKS, MIN_WEEKS);
    config.dia_semana = clampInteger(state.weekday, MIN_WEEKDAY, MAX_WEEKDAY, MIN_WEEKDAY);
  }
  if (mode === 'meses') {
    config.dia_mes = clampInteger(state.monthDay, MIN_MONTH_DAY, MAX_MONTH_DAY, MIN_MONTH_DAY);
    config.qtd_meses = clampInteger(state.months, MIN_MONTHS, MAX_MONTHS, MIN_MONTHS);
  }
  return config;
}

export async function saveBaseThenRepeat({ saveBase, repeat, repeatState, itemId }) {
  const saved = await saveBase();
  const resolvedItemId = itemId ?? saved?.id;
  const repeatConfig = buildRepeatConfig(repeatState, resolvedItemId);
  if (repeatConfig) await repeat(resolvedItemId, repeatConfig);
  return saved;
}
