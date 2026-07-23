export function normalizeAdminAuditText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function formatAdminAuditAction(value) {
  return String(value || '').trim() || 'Nao informado';
}

export function formatAdminAuditActor(value) {
  return String(value || '').trim() || 'Nao disponivel';
}

export function formatAdminAuditTarget(value, id) {
  const type = String(value || '').trim();
  const resolvedId = id === null || id === undefined ? '' : String(id).trim();
  if (!type && !resolvedId) return 'Nao disponivel';
  if (!type) return resolvedId;
  if (!resolvedId) return type;
  return `${type} #${resolvedId}`;
}

export function formatAdminAuditDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
