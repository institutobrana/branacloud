export function formatClinicDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-BR');
}

export function formatClinicUsers(active, total) {
  const activeNumber = Number(active || 0);
  const totalNumber = Number(total || 0);
  return `${activeNumber}/${totalNumber}`;
}

export function formatClinicStatus(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'ativa') return 'Ativa';
  if (normalized === 'trial') return 'Trial';
  if (normalized === 'expirada') return 'Expirada';
  if (normalized === 'suspensa') return 'Suspensa';
  return 'Indisponível';
}

export function statusTagColor(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'ativa') return 'green';
  if (normalized === 'trial') return 'blue';
  if (normalized === 'expirada') return 'orange';
  if (normalized === 'suspensa') return 'red';
  return 'default';
}

export function normalizePlanLabel(plan) {
  const normalized = String(plan || '').trim().toUpperCase();
  if (normalized === 'DEMO' || normalized.includes('DEMO')) return 'Demo';
  if (normalized === 'MENSAL' || normalized.includes('MENSAL')) return 'Mensal';
  if (normalized === 'ANUAL' || normalized.includes('ANUAL')) return 'Anual';
  if (normalized === 'SUPERADMIN' || normalized.includes('SUPER ADMIN')) return 'Super Admin';
  if (normalized === 'MASTER' || normalized === 'OWNER') return 'Master';
  return plan || '-';
}

export function normalizePlanValue(plan) {
  const normalized = String(plan || '').trim().toUpperCase();
  if (!normalized) return '';
  if (normalized === 'MASTER' || normalized === 'OWNER') return 'MASTER';
  if (normalized.includes('SUPER')) return 'SUPERADMIN';
  if (normalized.includes('MENSAL')) return 'MENSAL';
  if (normalized.includes('ANUAL')) return 'ANUAL';
  if (normalized.includes('DEMO') || normalized.includes('TRIAL')) return 'DEMO';
  return normalized;
}
