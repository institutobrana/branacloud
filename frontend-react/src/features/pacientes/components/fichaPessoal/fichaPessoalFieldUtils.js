import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { normalizeContaCorrenteDateInput } from '../../../contaCorrenteCirurgiao/dateParsing.js';

dayjs.extend(customParseFormat);

export function cpfDigits(value) {
  return String(value || '').replace(/\D+/g, '');
}

export function isValidCpf(value) {
  const cpf = cpfDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let index = 0; index < 9; index += 1) sum += Number(cpf[index]) * (10 - index);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(cpf[9])) return false;

  sum = 0;
  for (let index = 0; index < 10; index += 1) sum += Number(cpf[index]) * (11 - index);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === Number(cpf[10]);
}

export function formatCpfIfValid(value) {
  const digits = cpfDigits(value);
  if (!digits) return '';
  if (!isValidCpf(digits)) return digits;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function normalizeFichaDateInput(value) {
  return normalizeContaCorrenteDateInput(value);
}
