import { formatAdminAuditAction, formatAdminAuditActor, formatAdminAuditDate, formatAdminAuditTarget, normalizeAdminAuditText } from '../utils/adminAuditFormatters.js';

export const ADMIN_AUDIT_TABLE_SCROLL_Y = 480;

export const ADMIN_AUDIT_FILTER_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'criadoEm', label: 'Data' },
  { key: 'acao', label: 'Ação' },
  { key: 'actorEmail', label: 'Autor' },
  { key: 'alvo', label: 'Alvo' },
];

export const ADMIN_AUDIT_EMPTY_FILTERS = Object.fromEntries(
  ADMIN_AUDIT_FILTER_COLUMNS.map((column) => [column.key, '']),
);

export const ADMIN_AUDIT_VISIBLE_COLUMNS = {
  id: true,
  criadoEm: true,
  acao: true,
  actorEmail: true,
  alvo: true,
};

export function getAdminAuditFilterValue(row, key) {
  const values = {
    id: row?.id,
    criadoEm: formatAdminAuditDate(row?.criadoEm),
    acao: formatAdminAuditAction(row?.acao),
    actorEmail: formatAdminAuditActor(row?.actorEmail),
    alvo: formatAdminAuditTarget(row?.alvoTipo, row?.alvoId),
  };
  return normalizeAdminAuditText(values[key]);
}

export function getAdminAuditSearchValue(row) {
  return normalizeAdminAuditText(
    [
      row?.id,
      row?.actorUserId,
      row?.actorEmail,
      row?.acao,
      row?.alvoTipo,
      row?.alvoId,
      row?.ip,
      formatAdminAuditDate(row?.criadoEm),
      formatAdminAuditTarget(row?.alvoTipo, row?.alvoId),
      typeof row?.detalhesJson === 'string' ? row.detalhesJson : JSON.stringify(row?.detalhesJson ?? ''),
    ].join(' '),
  );
}

function getAdminAuditSortValue(row, key) {
  if (key === 'id') return Number(row?.id || 0);
  if (key === 'criadoEm') {
    const date = row?.criadoEm ? new Date(row.criadoEm).getTime() : 0;
    return Number.isFinite(date) ? date : 0;
  }
  return getAdminAuditFilterValue(row, key);
}

export function processAdminAuditRows(rows = [], filters = ADMIN_AUDIT_EMPTY_FILTERS, sortState = {}, globalSearch = '') {
  const normalizedSearch = normalizeAdminAuditText(globalSearch);
  const activeFilters = Object.entries(filters || {}).filter(([, value]) => normalizeAdminAuditText(value));
  const filteredRows = rows.filter((row) => {
    if (normalizedSearch && !getAdminAuditSearchValue(row).includes(normalizedSearch)) return false;
    return activeFilters.every(([key, value]) =>
      getAdminAuditFilterValue(row, key).includes(normalizeAdminAuditText(value)),
    );
  });

  if (!sortState?.key || !sortState?.order) return filteredRows;

  return [...filteredRows].sort((left, right) => {
    const leftValue = getAdminAuditSortValue(left, sortState.key);
    const rightValue = getAdminAuditSortValue(right, sortState.key);
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

export function toggleAdminAuditVisibleColumn(current = ADMIN_AUDIT_VISIBLE_COLUMNS, key) {
  if (!(key in current)) return current;
  const visibleCount = Object.values(current).filter((value) => value !== false).length;
  if (current[key] !== false && visibleCount <= 1) return current;
  return { ...current, [key]: current[key] === false };
}

export function formatAdminAuditFooterLabel(visibleCount, totalCount, selectedId = null) {
  const visible = Number(visibleCount || 0);
  const total = Number(totalCount || 0);
  const base = visible === total ? `${total} evento(s)` : `${visible} de ${total} evento(s)`;
  return selectedId === null || selectedId === undefined ? base : `${base} - Selecionado #${selectedId}`;
}
