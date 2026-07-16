function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

export const SYSTEM_PROTECTED_GROUP_NAMES = Object.freeze([
  'CUSTO FIXO PESSOAL',
  'CUSTO FIXO PROFISSIONAL',
  'CUSTO VARIAVEL PESSOAL',
  'CUSTO VARIAVEL PROFISSIONAL',
  'INVESTIMENTO - EMPRESA',
  'INVESTIMENTO - PESSOAL',
]);

export const SYSTEM_PROTECTED_GROUP_ALIASES = Object.freeze([
  'CUSTO VARIVAVEL PROFISSIONAL',
  'INVESTIMENTOS - EMPRESA',
  'INVESTIMENTOS - PESSOAL',
]);

export function normalizeFinancialGroupName(value) {
  return normalizeText(value);
}

export function normalizePlanoContasSystemGroupName(name) {
  return normalizeText(name);
}

export function isSystemProtectedGroupName(value) {
  const normalized = normalizeFinancialGroupName(value);
  return SYSTEM_PROTECTED_GROUP_NAMES.includes(normalized) || SYSTEM_PROTECTED_GROUP_ALIASES.includes(normalized);
}

export function isSystemProtectedGroup(group) {
  return isSystemProtectedGroupName(group?.nome);
}

export function isPlanoContasSystemProtectedGroup(groupOrName) {
  if (typeof groupOrName === 'string') {
    return isSystemProtectedGroupName(groupOrName);
  }
  return isSystemProtectedGroup(groupOrName);
}
