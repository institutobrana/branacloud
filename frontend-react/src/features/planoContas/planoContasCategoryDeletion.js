export function toPlanoContasPositiveInteger(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function normalizePlanoContasCategoryDestinationList(categories, originCategoryId) {
  const originId = toPlanoContasPositiveInteger(originCategoryId);
  const list = Array.isArray(categories) ? categories : [];

  return list
    .map((item) => ({
      ...item,
      id: toPlanoContasPositiveInteger(item?.id),
    }))
    .filter((item) => item.id != null)
    .filter((item) => item.id !== originId);
}

export function selectFirstPlanoContasCategoryDestination(categories, originCategoryId) {
  const list = normalizePlanoContasCategoryDestinationList(categories, originCategoryId);
  return list.length > 0 ? list[0] : null;
}

export function buildPlanoContasCategoryMigrationPayload(categoryDestinationId) {
  const id = toPlanoContasPositiveInteger(categoryDestinationId);
  if (id == null) {
    throw new Error('Selecione uma categoria destino válida.');
  }

  return {
    categoria_destino_id: id,
  };
}

export function normalizePlanoContasCategoryDeletionResult(result) {
  if (!result || typeof result !== 'object') {
    return { ok: false, data: null, error: 'Resposta inválida do servidor.' };
  }

  return {
    ok: true,
    data: result,
    error: '',
  };
}

export function classifyPlanoContasCategoryError(error) {
  const status = Number(error?.status ?? 0) || 0;
  const detail = String(error?.data?.detail || error?.message || '').trim();
  const inUse = status === 409 && /em uso/i.test(detail);

  return {
    kind: inUse ? 'category-in-use' : 'request-error',
    message: detail || 'Falha na operação de categoria.',
    status: status || null,
    details: error?.data ?? null,
    originalError: error || null,
  };
}
