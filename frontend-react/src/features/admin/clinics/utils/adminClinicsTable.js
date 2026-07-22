import { formatClinicDate, formatClinicStatus, formatClinicUsers, normalizePlanLabel } from './adminClinicsFormatters.js';

export const ADMIN_CLINICS_TABLE_SCROLL_Y = 480;

export const ADMIN_CLINICS_VISIBLE_COLUMNS = {
  id: true,
  clinica: true,
  usuarios: true,
  plano: true,
  trialAte: true,
  status: true,
};

export const ADMIN_CLINICS_EMPTY_FILTERS = {
  id: '',
  clinica: '',
  usuarios: '',
  plano: '',
  trialAte: '',
  status: '',
};

export const ADMIN_CLINICS_FILTER_COLUMNS = [
  { key: 'id', label: 'ID', visible: true },
  { key: 'clinica', label: 'Clínica', visible: true },
  { key: 'usuarios', label: 'Usuários', visible: true },
  { key: 'plano', label: 'Plano', visible: true },
  { key: 'trialAte', label: 'Trial até', visible: true },
  { key: 'status', label: 'Status', visible: true },
];

export function normalizeClinicSearchText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function getClinicColumnValue(row, key) {
  if (key === 'id') return String(row?.id ?? '');
  if (key === 'clinica') return `${row?.nome ?? ''} ${row?.email ?? ''}`;
  if (key === 'status') return formatClinicStatus(row?.assinaturaStatus);
  if (key === 'plano') return normalizePlanLabel(row?.plano || row?.tipoConta);
  if (key === 'trialAte') return formatClinicDate(row?.trialAte);
  if (key === 'usuarios') return formatClinicUsers(row?.usuariosAtivos, row?.usuariosTotal);
  return '';
}

export function filterAdminClinics(rows, filters = {}) {
  return (Array.isArray(rows) ? rows : []).filter((row) =>
    ADMIN_CLINICS_FILTER_COLUMNS.every((column) => {
      const filter = normalizeClinicSearchText(filters[column.key]);
      if (!filter) return true;
      return normalizeClinicSearchText(getClinicColumnValue(row, column.key)).includes(filter);
    }),
  );
}

export function compareAdminClinicsByColumn(left, right, key) {
  if (key === 'id') {
    return (Number(left?.id || 0) || 0) - (Number(right?.id || 0) || 0);
  }
  if (key === 'trialAte') {
    const leftTime = left?.trialAte ? new Date(left.trialAte).getTime() : Number.POSITIVE_INFINITY;
    const rightTime = right?.trialAte ? new Date(right.trialAte).getTime() : Number.POSITIVE_INFINITY;
    return (Number.isFinite(leftTime) ? leftTime : Number.POSITIVE_INFINITY) -
      (Number.isFinite(rightTime) ? rightTime : Number.POSITIVE_INFINITY);
  }
  if (key === 'usuarios') {
    const leftUsers = Number(left?.usuariosAtivos || 0) || 0;
    const rightUsers = Number(right?.usuariosAtivos || 0) || 0;
    if (leftUsers !== rightUsers) return leftUsers - rightUsers;
    return (Number(left?.usuariosTotal || 0) || 0) - (Number(right?.usuariosTotal || 0) || 0);
  }

  return normalizeClinicSearchText(getClinicColumnValue(left, key)).localeCompare(
    normalizeClinicSearchText(getClinicColumnValue(right, key)),
    'pt-BR',
    { sensitivity: 'base' },
  );
}

export function sortAdminClinics(rows, sortState = {}) {
  const next = [...(Array.isArray(rows) ? rows : [])];
  const { key, order } = sortState;
  if (!key || !order) return next;
  next.sort((left, right) => {
    const comparison = compareAdminClinicsByColumn(left, right, key);
    return order === 'desc' ? -comparison : comparison;
  });
  return next;
}

export function processAdminClinicsRows(rows, filters = {}, sortState = {}) {
  return sortAdminClinics(filterAdminClinics(rows, filters), sortState);
}

export function toggleAdminClinicVisibleColumn(current, key) {
  const next = { ...(current || ADMIN_CLINICS_VISIBLE_COLUMNS) };
  const activeKeys = Object.entries(next).filter(([, value]) => value !== false);
  const isCurrentlyVisible = next[key] !== false;
  if (isCurrentlyVisible && activeKeys.length <= 1) {
    return current || ADMIN_CLINICS_VISIBLE_COLUMNS;
  }
  next[key] = !isCurrentlyVisible;
  return next;
}

export function formatAdminClinicsFooterLabel(filteredCount, totalCount) {
  const filtered = Number(filteredCount || 0) || 0;
  const total = Number(totalCount || 0) || 0;
  const filteredNoun = filtered === 1 ? 'clínica' : 'clínicas';
  const totalNoun = total === 1 ? 'clínica' : 'clínicas';
  if (total && total !== filtered) return `${filtered} de ${total} ${totalNoun}`;
  return `${filtered} ${filteredNoun}`;
}
