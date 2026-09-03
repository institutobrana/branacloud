import { EMPTY_SYSTEM_OPTIONS } from '../constants/opcoesSistemaConstants.js';

export function normalizeOpcoesSistema(values = {}) {
  return Object.keys(EMPTY_SYSTEM_OPTIONS).reduce((result, key) => ({ ...result, [key]: { ...EMPTY_SYSTEM_OPTIONS[key], ...(values?.[key] || {}) } }), {});
}
