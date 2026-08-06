const RESERVED_NUMEROS = new Set([1, 2, 3, 255]);

export function isIndiceFinanceiroReservado(indice) {
  const numero = Number(indice?.numero ?? indice?.id);
  return Number.isFinite(numero) && RESERVED_NUMEROS.has(numero);
}

export function isIndiceFinanceiroReservadoNumero(numero) {
  const resolved = Number(numero);
  return Number.isFinite(resolved) && RESERVED_NUMEROS.has(resolved);
}

export function canEditIndiceFinanceiro(indice) {
  return Boolean(indice && Number.isFinite(Number(indice.numero ?? indice.id)));
}

export function canDeleteIndiceFinanceiro(indice) {
  return Boolean(indice) && !isIndiceFinanceiroReservado(indice);
}

export function canMigrateAndDeleteIndiceFinanceiro(indice) {
  return Boolean(indice) && !isIndiceFinanceiroReservado(indice);
}

export function canCreateQuotationIndiceFinanceiro(indice) {
  return Boolean(indice && Number.isFinite(Number(indice.numero ?? indice.id)));
}

export const canEditIndex = canEditIndiceFinanceiro;
export const canDeleteIndex = canDeleteIndiceFinanceiro;
export const canMigrateAndDeleteIndex = canMigrateAndDeleteIndiceFinanceiro;
export const canCreateQuotation = canCreateQuotationIndiceFinanceiro;
