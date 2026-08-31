import { ODONTOGRAM_DEFAULTS, ODONTOGRAM_FILTERS } from '../constants/odontogramaConstants.js';

export function normalizeOdontogram(values = {}) {
  const source = values || {};
  const normalized = { ...ODONTOGRAM_DEFAULTS, ...source };
  if (normalized.filtro_mais_utilizado === 'todos') normalized.filtro_mais_utilizado = 'todas_tratamento';
  return Object.keys(ODONTOGRAM_DEFAULTS).reduce((out, key) => {
    if (key.startsWith('exibir_')) out[key] = Boolean(normalized[key]);
    else if (key.startsWith('cor_')) out[key] = String(normalized[key] ?? ODONTOGRAM_DEFAULTS[key]).trim().toLowerCase();
    else out[key] = normalized[key];
    return out;
  }, {});
}

export function buildOdontogramPayload(values = {}) {
  const normalized = normalizeOdontogram(values);
  const payload = { ...normalized };
  if (!ODONTOGRAM_FILTERS.some((item) => item.value === payload.filtro_mais_utilizado)) payload.filtro_mais_utilizado = 'todas_tratamento';
  return payload;
}
