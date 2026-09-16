export function formatHistoricoDate(value) {
  const match = String(value || '').slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : (value || '');
}

export function historicoRowColor(value) {
  return historicoIntegerToCss(value);
}

export function historicoHexToInteger(value) {
  const normalized = String(value || '').trim().replace(/^#/, '');
  return /^[0-9a-f]{6}$/i.test(normalized) ? parseInt(normalized, 16) : 16777215;
}

export function historicoIntegerToCss(value) {
  const integer = Number(value);
  if (!Number.isInteger(integer) || integer < 0) return undefined;
  const match = AGENDA_APRESENTACAO_COLORS.find((item) => historicoHexToInteger(item.value) === integer);
  return match?.value;
}

export function historicoIntegerToPaletteValue(value) {
  return historicoIntegerToCss(value) || '#ffffff';
}

export function handleHistoricoEditorKeyDown(event, { onEnter, onEscape }) {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    onEscape?.();
    return 'escape';
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();
    onEnter?.();
    return 'enter';
  }
  return null;
}

export function resolveCurrentPrestador(user, prestadores) {
  const id = Number(user?.prestador_id ?? user?.prestadorId ?? user?.prestador?.id ?? 0);
  if (!id || !Array.isArray(prestadores)) return null;
  return prestadores.find((prestador) => Number(prestador?.id) === id) || null;
}
import { AGENDA_APRESENTACAO_COLORS } from '../agendaConfiguracao/agendaConfiguracaoColors.js';
