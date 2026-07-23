function normalizeString(value) {
  return String(value ?? '').trim();
}

function normalizeNullableNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizeAdminAuditItem(item = {}) {
  const id = normalizeNullableNumber(item.id) || 0;

  return {
    id,
    key: String(id || item.criado_em || `auditoria-${item.alvo_tipo || 'sem-alvo'}-${item.alvo_id || 'sem-id'}`),
    criadoEm: item.criado_em ?? item.created_at ?? null,
    acao: normalizeString(item.acao),
    actorEmail: normalizeString(item.actor_email),
    alvoTipo: normalizeString(item.alvo_tipo),
    alvoId: normalizeNullableNumber(item.alvo_id),
    detalhesJson: item.detalhes_json ?? null,
    ip: normalizeString(item.ip),
    actorUserId: normalizeNullableNumber(item.actor_user_id),
  };
}

export function normalizeAdminAudit(payload) {
  const rows = Array.isArray(payload) ? payload.map((item) => normalizeAdminAuditItem(item)) : [];
  return {
    rows,
    totalFromBackend: rows.length,
  };
}
