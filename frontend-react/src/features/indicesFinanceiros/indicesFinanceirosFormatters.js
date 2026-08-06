export function formatIndiceFinanceiroValorAtual(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return '—';
  }

  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

export function formatIndiceFinanceiroCotacaoData(value) {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return '—';
  }

  const parts = raw.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return raw;
}

export function formatIndiceFinanceiroCotacaoValor(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return '—';
  }

  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}
