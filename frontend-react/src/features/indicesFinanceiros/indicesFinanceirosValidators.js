export function normalizeIndiceFinanceiroFormValues(values = {}) {
  const nome = String(values?.nome ?? '').trim();
  const sigla = String(values?.sigla ?? '').trim().toUpperCase();

  return {
    nome,
    sigla,
  };
}

export function validateIndiceFinanceiroFormValues(values = {}) {
  const normalized = normalizeIndiceFinanceiroFormValues(values);

  if (!normalized.nome) {
    return 'Informe o nome do índice.';
  }

  if (!normalized.sigla) {
    return 'Informe a sigla do índice.';
  }

  return '';
}
