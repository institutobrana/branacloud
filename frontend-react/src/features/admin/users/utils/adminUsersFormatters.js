export function normalizeAdminUserText(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('pt-BR');
}

export function normalizeAdminUserPlanLabel(value) {
  const normalized = String(value || '').trim().toUpperCase();
  if (!normalized) return '-';
  const labels = {
    DEMO: 'Demo',
    MENSAL: 'Mensal',
    ANUAL: 'Anual',
    MASTER: 'Master',
    SUPERADMIN: 'Super Admin',
  };
  return labels[normalized] || normalized;
}

export function formatAdminUserProfile(row) {
  if (row?.isAdmin === true) return 'Administrador';
  if (row?.isAdmin === false) return 'Usuário';
  return 'Não informado';
}

export function formatAdminUserStatus(value) {
  if (value === true) return 'Ativo';
  if (value === false) return 'Inativo';
  return 'Não informado';
}

export function adminUserStatusTagColor(value) {
  if (value === true) return 'green';
  if (value === false) return 'red';
  return 'default';
}

export function formatAdminUserSetupStatus(value) {
  if (value === true) return 'Concluído';
  if (value === false) return 'Pendente';
  return 'Não disponível';
}

export function formatAdminUserProtection(row) {
  if (row?.isSystemUser) return 'Sistema';
  if (row?.isOwnerAccount) return 'Proprietário';
  return 'Padrão';
}

export function getAdminUserPresenceState(row) {
  if (row?.isSystemUser) return 'not_applicable';
  if (!row?.lastSeenAt) return 'never';
  return row?.isOnline === true ? 'online' : 'offline';
}

export function formatAdminUserPresence(row) {
  const labels = {
    online: 'Online',
    offline: 'Offline',
    never: 'Nunca acessou',
    not_applicable: 'Não aplicável',
  };
  return labels[getAdminUserPresenceState(row)] || 'Não informado';
}

export function adminUserPresenceTagColor(row) {
  return getAdminUserPresenceState(row) === 'online' ? 'green' : 'default';
}

export function formatAdminUserDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function formatAdminUserPresenceTooltip(row) {
  const state = getAdminUserPresenceState(row);
  if (state === 'not_applicable') return 'Usuário sistêmico sem sessão interativa';
  if (state === 'never') return 'Sem atividade registrada';
  return `Última atividade: ${formatAdminUserDateTime(row?.lastSeenAt)}`;
}

export function formatAdminUserDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(date);
}
