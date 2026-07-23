export const ADMIN_ROUTE_SUFFIX = 'adm';

export const ADMIN_SECTIONS = [
  { key: 'overview', label: 'Vis\u00e3o geral', available: true, status: null },
  { key: 'clinics', label: 'Cl\u00ednicas', available: true, status: null },
  { key: 'users', label: 'Usu\u00e1rios', available: true, status: null },
  { key: 'billing', label: 'Cobran\u00e7as', available: true, status: null },
  { key: 'audit', label: 'Auditoria', available: true, status: null },
];

export function getAdminSectionByKey(key) {
  return ADMIN_SECTIONS.find((section) => section.key === key) || ADMIN_SECTIONS[0];
}
