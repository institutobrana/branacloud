import {
  formatAdminBillingDate,
  formatAdminBillingMoney,
  formatAdminBillingPlan,
  formatAdminBillingStatus,
  normalizeAdminBillingText,
} from '../utils/adminBillingFormatters.js';

export const ADMIN_BILLING_TABLE_SCROLL_Y = 480;

export const ADMIN_BILLING_FILTER_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'clinica', label: 'Clínica' },
  { key: 'plano', label: 'Plano' },
  { key: 'status', label: 'Status' },
  { key: 'valor', label: 'Valor' },
  { key: 'origem', label: 'Origem' },
  { key: 'criadoEm', label: 'Data' },
];

export const ADMIN_BILLING_EMPTY_FILTERS = Object.fromEntries(
  ADMIN_BILLING_FILTER_COLUMNS.map((column) => [column.key, '']),
);

export const ADMIN_BILLING_VISIBLE_COLUMNS = {
  id: true,
  clinica: true,
  plano: true,
  status: true,
  valor: true,
  origem: true,
  criadoEm: true,
};

export function getAdminBillingFilterValue(row, key) {
  const values = {
    id: row?.id,
    clinica: row?.clinicaNome || row?.clinicaId,
    plano: formatAdminBillingPlan(row?.plano),
    status: `${formatAdminBillingStatus(row?.status)} ${row?.status || ''}`,
    valor: formatAdminBillingMoney(row?.valor, row?.moeda),
    origem: row?.origem,
    criadoEm: formatAdminBillingDate(row?.criadoEm),
  };
  return normalizeAdminBillingText(values[key]);
}

export function getAdminBillingSearchValue(row) {
  return normalizeAdminBillingText(
    [
      row?.id,
      row?.clinicaId,
      row?.clinicaNome,
      row?.paymentId,
      row?.externalReference,
      formatAdminBillingPlan(row?.plano),
      formatAdminBillingStatus(row?.status),
      row?.status,
      formatAdminBillingMoney(row?.valor, row?.moeda),
      row?.origem,
      formatAdminBillingDate(row?.criadoEm),
    ].join(' '),
  );
}

function getAdminBillingSortValue(row, key) {
  if (key === 'valor') return Number(row?.valor || 0);
  if (key === 'criadoEm') {
    const date = row?.criadoEm ? new Date(row.criadoEm).getTime() : 0;
    return Number.isFinite(date) ? date : 0;
  }
  return getAdminBillingFilterValue(row, key);
}

export function processAdminBillingRows(
  rows = [],
  filters = ADMIN_BILLING_EMPTY_FILTERS,
  sortState = {},
  globalSearch = '',
) {
  const normalizedSearch = normalizeAdminBillingText(globalSearch);
  const activeFilters = Object.entries(filters || {}).filter(([, value]) => normalizeAdminBillingText(value));
  const filteredRows = rows.filter((row) => {
    if (normalizedSearch && !getAdminBillingSearchValue(row).includes(normalizedSearch)) return false;
    return activeFilters.every(([key, value]) =>
      getAdminBillingFilterValue(row, key).includes(normalizeAdminBillingText(value)),
    );
  });

  if (!sortState?.key || !sortState?.order) return filteredRows;

  return [...filteredRows].sort((left, right) => {
    const leftValue = getAdminBillingSortValue(left, sortState.key);
    const rightValue = getAdminBillingSortValue(right, sortState.key);
    if (leftValue === rightValue) return 0;

    const result =
      typeof leftValue === 'number' && typeof rightValue === 'number'
        ? leftValue > rightValue
          ? 1
          : -1
        : String(leftValue).localeCompare(String(rightValue), 'pt-BR', { numeric: true, sensitivity: 'base' });

    return sortState.order === 'desc' ? -result : result;
  });
}

export function toggleAdminBillingVisibleColumn(current = ADMIN_BILLING_VISIBLE_COLUMNS, key) {
  if (!(key in current)) return current;
  const visibleCount = Object.values(current).filter((value) => value !== false).length;
  if (current[key] !== false && visibleCount <= 1) return current;
  return { ...current, [key]: current[key] === false };
}

export function formatAdminBillingFooterLabel(visibleCount, totalCount, selectedId = null) {
  const visible = Number(visibleCount || 0);
  const total = Number(totalCount || 0);
  const base = visible === total ? `${total} cobrança(s)` : `${visible} de ${total} cobrança(s)`;
  return selectedId === null || selectedId === undefined ? base : `${base} - Selecionada #${selectedId}`;
}
