import {
  formatAdminUserPresence,
  formatAdminUserProfile,
  formatAdminUserSetupStatus,
  normalizeAdminUserPlanLabel,
  normalizeAdminUserText,
} from '../utils/adminUsersFormatters.js';

export const ADMIN_USERS_TABLE_SCROLL_Y = 480;

export const ADMIN_USERS_FILTER_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'nome', label: 'Nome' },
  { key: 'email', label: 'E-mail' },
  { key: 'clinica', label: 'Clínica' },
  { key: 'clinicaEmail', label: 'E-mail clínica' },
  { key: 'plano', label: 'Plano' },
  { key: 'perfil', label: 'Perfil' },
  { key: 'status', label: 'Status' },
  { key: 'online', label: 'Online' },
  { key: 'setup', label: 'Primeiro acesso' },
  { key: 'trialAte', label: 'Trial até' },
];

export const ADMIN_USERS_EMPTY_FILTERS = Object.fromEntries(ADMIN_USERS_FILTER_COLUMNS.map((column) => [column.key, '']));

export const ADMIN_USERS_VISIBLE_COLUMNS = {
  id: true,
  nome: true,
  email: true,
  clinica: true,
  clinicaEmail: false,
  plano: true,
  perfil: true,
  status: true,
  online: true,
  setup: false,
  trialAte: false,
};

export function getAdminUserFilterValue(row, key) {
  const values = {
    id: row?.id,
    nome: row?.nome,
    email: row?.email,
    clinica: row?.clinicaNome || row?.clinicaId,
    clinicaEmail: row?.clinicaEmail,
    plano: normalizeAdminUserPlanLabel(row?.clinicaPlano),
    perfil: formatAdminUserProfile(row),
    status: formatAdminUserStatusValue(row?.ativo),
    online: formatAdminUserPresence(row),
    setup: formatAdminUserSetupStatus(row?.setupCompleted),
    trialAte: row?.clinicaTrialAte,
  };
  return normalizeAdminUserText(values[key]);
}

function formatAdminUserStatusValue(value) {
  if (value === true) return 'Ativo';
  if (value === false) return 'Inativo';
  return 'Não informado';
}

export function processAdminUsersRows(rows = [], filters = ADMIN_USERS_EMPTY_FILTERS, sortState = {}) {
  const activeFilters = Object.entries(filters || {}).filter(([, value]) => normalizeAdminUserText(value));
  const filteredRows = rows.filter((row) =>
    activeFilters.every(([key, value]) => getAdminUserFilterValue(row, key).includes(normalizeAdminUserText(value))),
  );

  if (!sortState?.key || !sortState?.order) return filteredRows;

  return [...filteredRows].sort((left, right) => {
    if (sortState.key === 'online') {
      const leftValue = left?.lastSeenAt ? new Date(left.lastSeenAt).getTime() : 0;
      const rightValue = right?.lastSeenAt ? new Date(right.lastSeenAt).getTime() : 0;
      if (leftValue === rightValue) return 0;
      const result = leftValue > rightValue ? 1 : -1;
      return sortState.order === 'desc' ? -result : result;
    }

    const leftValue = getAdminUserFilterValue(left, sortState.key);
    const rightValue = getAdminUserFilterValue(right, sortState.key);
    if (leftValue === rightValue) return 0;
    const result = leftValue.localeCompare(rightValue, 'pt-BR', { numeric: true, sensitivity: 'base' });
    return sortState.order === 'desc' ? -result : result;
  });
}

export function toggleAdminUserVisibleColumn(current = ADMIN_USERS_VISIBLE_COLUMNS, key) {
  if (!(key in current)) return current;
  const visibleCount = Object.values(current).filter((value) => value !== false).length;
  if (current[key] !== false && visibleCount <= 1) return current;
  return { ...current, [key]: current[key] === false };
}

export function formatAdminUsersFooterLabel(visibleCount, totalCount, selectedId = null) {
  const visible = Number(visibleCount || 0);
  const total = Number(totalCount || 0);
  const base = visible === total ? `${total} usuário(s)` : `${visible} de ${total} usuário(s)`;
  return selectedId === null || selectedId === undefined ? base : `${base} · Selecionado #${selectedId}`;
}
