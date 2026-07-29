function normalizeString(value) {
  return String(value ?? '').trim();
}

function normalizeNullableNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizeAdminBillingItem(item = {}) {
  const id = normalizeNullableNumber(item.id) || 0;
  const clinicaId = normalizeNullableNumber(item.clinica_id);

  return {
    id,
    key: String(id || item.payment_id || item.external_reference || `cobranca-${clinicaId || 'sem-clinica'}`),
    clinicaId,
    clinicaNome: normalizeString(item.clinica_nome),
    paymentId: normalizeString(item.payment_id),
    externalReference: normalizeString(item.external_reference),
    plano: normalizeString(item.plano),
    status: normalizeString(item.status),
    valor: normalizeNullableNumber(item.valor),
    moeda: normalizeString(item.moeda || item.currency || 'BRL') || 'BRL',
    origem: normalizeString(item.origem),
    criadoEm: item.criado_em ?? item.created_at ?? null,
    atualizadoEm: item.atualizado_em ?? item.updated_at ?? null,
  };
}

export function normalizeAdminBilling(payload) {
  const rows = Array.isArray(payload) ? payload.map((item) => normalizeAdminBillingItem(item)) : [];
  return {
    rows,
    totalFromBackend: rows.length,
  };
}
