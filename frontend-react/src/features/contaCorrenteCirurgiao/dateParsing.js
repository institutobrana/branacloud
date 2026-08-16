import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

const FULL_DATE_FORMAT = 'DD/MM/YYYY';
const COMPACT_SIX_DIGIT_FORMAT = 'DDMMYY';

function getReferenceParts(referenceDate = dayjs()) {
  const reference = dayjs(referenceDate);
  return {
    month: reference.format('MM'),
    year: reference.format('YYYY'),
  };
}

function parseStrictDate(value, formats) {
  return dayjs(value, formats, true);
}

export function normalizeContaCorrenteDateInput(value, referenceDate = dayjs()) {
  if (dayjs.isDayjs(value)) {
    return value.isValid() ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const rawValue = value.trim();
  if (!rawValue) {
    return null;
  }

  const compact = rawValue.replace(/[^\d]/g, '');
  const directParsed = parseStrictDate(rawValue, [FULL_DATE_FORMAT, COMPACT_SIX_DIGIT_FORMAT]);
  if (directParsed.isValid()) {
    return directParsed;
  }

  if (compact.length === 2) {
    const { month, year } = getReferenceParts(referenceDate);
    const parsedWithReference = parseStrictDate(`${compact}/${month}/${year}`, FULL_DATE_FORMAT);
    if (parsedWithReference.isValid()) {
      return parsedWithReference;
    }
  }

  if (compact.length === 4) {
    const { year } = getReferenceParts(referenceDate);
    const parsedWithReference = parseStrictDate(`${compact}/${year}`, 'DDMM/YYYY');
    if (parsedWithReference.isValid()) {
      return parsedWithReference;
    }
  }

  return null;
}

export function formatContaCorrenteDate(value) {
  const normalized = normalizeContaCorrenteDateInput(value);
  return normalized ? normalized.format(FULL_DATE_FORMAT) : null;
}

export const CONTA_CORRENTE_DATE_FORMATS = Object.freeze([FULL_DATE_FORMAT, COMPACT_SIX_DIGIT_FORMAT]);
