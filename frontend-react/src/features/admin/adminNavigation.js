export const ADMIN_ROUTE_SUFFIX = 'adm';

export const ADMIN_SECTIONS = [
  { key: 'overview', label: 'Visão geral', available: true, status: null },
  { key: 'clinics', label: 'Clínicas', available: true, status: null },
  { key: 'users', label: 'Usuários', available: true, status: null },
  { key: 'billing', label: 'Cobranças', available: false, status: 'Em migração' },
  { key: 'audit', label: 'Auditoria', available: false, status: 'Em migração' },
];

export function getAdminSectionByKey(key) {
  return ADMIN_SECTIONS.find((section) => section.key === key) || ADMIN_SECTIONS[0];
}
