import {
  formatAdminBillingDate,
  formatAdminBillingMoney,
  formatAdminBillingPlan,
  formatAdminBillingStatus,
} from './adminBillingFormatters.js';

export const ADMIN_BILLING_CSV_FILENAME = 'brana-cobrancas.csv';

export const ADMIN_BILLING_CSV_HEADERS = [
  'ID',
  'Clinica',
  'Plano',
  'Status',
  'Valor',
  'Origem',
  'Data',
  'Clinica ID',
  'Payment ID',
  'External Reference',
  'Moeda',
  'Atualizado em',
];

function escapeCsvCell(value) {
  const text = String(value ?? '');
  if (!/[",;\r\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

export function buildAdminBillingCsv(rows = []) {
  const lines = [
    ADMIN_BILLING_CSV_HEADERS,
    ...rows.map((row) => [
      row.id || '',
      row.clinicaNome || '',
      formatAdminBillingPlan(row.plano),
      formatAdminBillingStatus(row.status),
      formatAdminBillingMoney(row.valor, row.moeda),
      row.origem || '',
      formatAdminBillingDate(row.criadoEm),
      row.clinicaId || '',
      row.paymentId || '',
      row.externalReference || '',
      row.moeda || '',
      formatAdminBillingDate(row.atualizadoEm),
    ]),
  ];

  return lines.map((line) => line.map(escapeCsvCell).join(';')).join('\r\n');
}

export function downloadAdminBillingCsv(rows = [], filename = ADMIN_BILLING_CSV_FILENAME) {
  if (typeof document === 'undefined' || typeof URL === 'undefined' || typeof Blob === 'undefined') {
    return false;
  }

  const csv = buildAdminBillingCsv(rows);
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
