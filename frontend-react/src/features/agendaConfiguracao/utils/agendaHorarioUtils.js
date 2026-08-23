const HORA_PADRAO_REGEX = /^([01]?\d|2[0-3]):([0-5]\d)$/;
const HORA_DIGITOS_REGEX = /^(\d{1,2})(\d{2})$/;

function pad2(value) {
  return String(value).padStart(2, '0');
}

function coerceLegacyHoraTexto(value, { forInput = false, forBlur = false } = {}) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (forInput && /^\d{1,4}$/.test(raw)) {
    if (digits.length === 1) return digits;
    if (digits.length === 2) return `${digits}:`;
    if (digits.length === 3) return `${digits.slice(0, 1)}:${digits.slice(1)}`;
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  }

  let base = raw;
  if (/^\d{4}$/.test(base)) base = `${base.slice(0, 2)}:${base.slice(2)}`;
  else if (/^\d{3}$/.test(base)) base = `0${base.slice(0, 1)}:${base.slice(1)}`;
  else if (/^(\d{1,2}):$/.test(base) && forBlur) {
    const hhTxt = (/^(\d{1,2}):$/.exec(base)?.[1] || '').padStart(2, '0');
    base = `${hhTxt}:00`;
  } else if (/^\d{1,2}$/.test(base) && forBlur) {
    base = `${base.padStart(2, '0')}:00`;
  }

  const match = /^(\d{1,2}):(\d{1,2})$/.exec(base);
  if (!match) return '';

  const hh = Number(match[1]);
  const mm = Number(match[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return '';
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return '';
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function normalizeAgendaHoraInput(value, options = {}) {
  const result = coerceLegacyHoraTexto(value, options);
  return result || (String(value ?? '').trim() ? null : '');
}

export function isValidAgendaHoraInput(value) {
  return normalizeAgendaHoraInput(value) !== null;
}

export function agendaHoraBlurValue(value) {
  return coerceLegacyHoraTexto(value, { forBlur: true });
}

export function agendaHoraInputValue(value) {
  return coerceLegacyHoraTexto(value, { forInput: true });
}
