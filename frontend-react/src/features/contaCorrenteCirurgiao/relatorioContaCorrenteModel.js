function normalizeText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function formatMoneyContaCorrente(value) {
  const number = Number(value ?? 0) || 0;
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDateContaCorrente(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [year, month, day] = text.split('-');
    return `${day}/${month}/${year}`;
  }
  return text;
}

export function getRelatorioContaCorrenteColumns(selectedItems = []) {
  const fallback = ['Data', 'Histórico', 'Débito'];
  return Array.isArray(selectedItems) && selectedItems.length ? selectedItems : fallback;
}

export function getRelatorioContaCorrenteCellValue(row, column) {
  const normalized = normalizeText(column);
  if (normalized === 'data') return formatDateContaCorrente(row.data_lancamento || row.data_vencimento || row.data_pagamento);
  if (normalized === 'lançamento' || normalized === 'lancamento') return formatDateContaCorrente(row.data_lancamento);
  if (normalized === 'histórico' || normalized === 'historico') return row.historico || '';
  if (normalized === 'débito' || normalized === 'debito') return Number(row.debito ?? 0) ? formatMoneyContaCorrente(row.debito) : '-';
  if (normalized === 'crédito' || normalized === 'credito') return Number(row.credito ?? 0) ? formatMoneyContaCorrente(row.credito) : '-';
  if (normalized === 'categoria') return row.categoria_nome || '';
  if (normalized === 'grupo') return row.grupo_nome || '';
  if (normalized === 'complemento') return row.complemento || '';
  if (normalized === 'pagamento') return row.forma_pagamento || '';
  if (normalized === 'referência' || normalized === 'referencia') return row.referencia || '';
  if (normalized === 'saldo') return formatMoneyContaCorrente(row.saldo);
  if (normalized === 'conta corrente' || normalized === 'conta corrente do cirurgião' || normalized === 'conta corrente do cirurgiao') return row.conta || '';
  if (normalized === 'nº documento' || normalized === 'n° documento' || normalized === 'no documento' || normalized === 'numero documento' || normalized === 'n documento') return row.documento || '';
  return row[column] ?? '';
}

export function getRelatorioContaCorrenteTotals(reportData = {}) {
  return {
    totalCredito: Number(reportData?.total_credito ?? 0) || 0,
    totalDebito: Number(reportData?.total_debito ?? 0) || 0,
    saldoFinal: Number(reportData?.saldo_final ?? 0) || 0,
  };
}

export function getRelatorioContaCorrenteOrientationConfig(orientation) {
  return String(orientation || '').trim().toLowerCase() === 'paisagem'
    ? { width: 1123, height: 794, className: 'landscape' }
    : { width: 794, height: 1123, className: 'portrait' };
}
