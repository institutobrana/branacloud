const BILLING_STATUS_LABELS = {
  approved: 'Aprovado',
  authorized: 'Autorizado',
  cancelled: 'Cancelado',
  canceled: 'Cancelado',
  checkout_open: 'Checkout aberto',
  in_process: 'Em processamento',
  paid: 'Pago',
  pending: 'Pendente',
  rejected: 'Rejeitado',
  refunded: 'Estornado',
};

const BILLING_PLAN_LABELS = {
  ANUAL: 'Anual',
  DEMO: 'Demo',
  MENSAL: 'Mensal',
  SUPERADMIN: 'Super Admin',
};

const BILLING_STATUS_COLORS = {
  approved: 'green',
  authorized: 'green',
  paid: 'green',
  checkout_open: 'blue',
  pending: 'gold',
  in_process: 'gold',
  rejected: 'red',
  cancelled: 'default',
  canceled: 'default',
  refunded: 'default',
};

export function normalizeAdminBillingText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function formatAdminBillingPlan(value) {
  const normalized = String(value || '').trim().toUpperCase();
  return BILLING_PLAN_LABELS[normalized] || value || 'Nao informado';
}

export function formatAdminBillingStatus(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return BILLING_STATUS_LABELS[normalized] || value || 'Nao informado';
}

export function adminBillingStatusTagColor(value) {
  return BILLING_STATUS_COLORS[String(value || '').trim().toLowerCase()] || 'default';
}

export function formatAdminBillingMoney(value, currency = 'BRL') {
  const amount = Number(value || 0);
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: String(currency || 'BRL').toUpperCase(),
  });
  return formatter.format(Number.isFinite(amount) ? amount : 0);
}

export function formatAdminBillingDate(value) {
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
