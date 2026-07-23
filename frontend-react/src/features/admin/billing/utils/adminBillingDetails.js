import {
  formatAdminBillingDate,
  formatAdminBillingMoney,
} from './adminBillingFormatters.js';

export const ADMIN_BILLING_UNAVAILABLE_LABEL = 'Não disponível';

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

export function formatAdminBillingDetailValue(value) {
  return hasValue(value) ? String(value).trim() : ADMIN_BILLING_UNAVAILABLE_LABEL;
}

function formatDateDetail(value) {
  const formatted = formatAdminBillingDate(value);
  return formatted === '-' ? ADMIN_BILLING_UNAVAILABLE_LABEL : formatted;
}

function formatMoneyDetail(row) {
  if (row?.valor === null || row?.valor === undefined) return ADMIN_BILLING_UNAVAILABLE_LABEL;
  return formatAdminBillingMoney(row.valor, row.moeda);
}

export function buildAdminBillingDetailsSections(billing = null) {
  if (!billing) return [];

  return [
    {
      title: 'Identificação',
      items: [
        { label: 'ID', value: formatAdminBillingDetailValue(billing.id) },
        { label: 'Status', value: formatAdminBillingDetailValue(billing.status) },
        { label: 'Origem', value: formatAdminBillingDetailValue(billing.origem) },
      ],
    },
    {
      title: 'Conta',
      items: [
        { label: 'Clínica', value: formatAdminBillingDetailValue(billing.clinicaNome) },
        { label: 'ID da clínica', value: formatAdminBillingDetailValue(billing.clinicaId) },
        { label: 'Plano', value: formatAdminBillingDetailValue(billing.plano) },
      ],
    },
    {
      title: 'Pagamento',
      items: [
        { label: 'Payment ID', value: formatAdminBillingDetailValue(billing.paymentId) },
        { label: 'Referência externa', value: formatAdminBillingDetailValue(billing.externalReference) },
        { label: 'Valor', value: formatMoneyDetail(billing) },
        { label: 'Moeda', value: formatAdminBillingDetailValue(billing.moeda) },
      ],
    },
    {
      title: 'Datas',
      items: [
        { label: 'Data de criação', value: formatDateDetail(billing.criadoEm) },
        { label: 'Data de alteração', value: formatDateDetail(billing.atualizadoEm) },
      ],
    },
  ];
}
