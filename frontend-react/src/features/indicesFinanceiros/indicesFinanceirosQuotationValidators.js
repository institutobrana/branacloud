export function normalizeIndiceFinanceiroQuotationFormValues(values = {}) {
  const data = String(values?.data ?? '').trim();
  const valorRaw = String(values?.valor ?? '').trim().replace(/\s+/g, '');

  return {
    data,
    valorRaw,
  };
}

export function parseIndiceFinanceiroQuotationValue(valorRaw) {
  const raw = String(valorRaw ?? '').trim();
  if (!raw) {
    return null;
  }

  const normalized = raw.replace(',', '.');
  if (!/^[-+]?\d*(?:\.\d+)?$/.test(normalized)) {
    return null;
  }

  const numeric = Number(normalized);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  return numeric;
}

export function validateIndiceFinanceiroQuotationFormValues(values = {}) {
  const normalized = normalizeIndiceFinanceiroQuotationFormValues(values);

  if (!normalized.data) {
    return 'Informe a data.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized.data)) {
    return 'Informe uma data válida.';
  }

  const valor = parseIndiceFinanceiroQuotationValue(normalized.valorRaw);
  if (valor == null) {
    return 'Informe uma cotação válida.';
  }

  if (valor <= 0) {
    return 'Informe um valor válido.';
  }

  return '';
}

export function formatIndiceFinanceiroQuotationDate(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const [year, month, day] = raw.split('-');
  if (year && month && day) {
    return `${day}/${month}/${year}`;
  }
  return raw;
}
