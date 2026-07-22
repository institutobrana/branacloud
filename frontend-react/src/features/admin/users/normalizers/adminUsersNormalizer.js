function normalizeString(value) {
  return String(value ?? '').trim();
}

function normalizeNullableNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeNullableBoolean(value) {
  if (value === null || value === undefined) return null;
  return Boolean(value);
}

export function normalizeAdminUser(item = {}) {
  const id = normalizeNullableNumber(item.id) || 0;
  const clinicaId = normalizeNullableNumber(item.clinica_id);
  const setupCompleted = normalizeNullableBoolean(item.setup_completed);
  const isSystemUser = Boolean(item.is_system_user);

  return {
    id,
    key: String(id || item.email || `usuario-${item.clinica_id || 'sem-clinica'}`),
    nome: normalizeString(item.nome),
    email: normalizeString(item.email),
    ativo: normalizeNullableBoolean(item.ativo),
    isAdmin: normalizeNullableBoolean(item.is_admin),
    isOwnerAccount: Boolean(item.is_owner_account),
    isSystemUser,
    lastSeenAt: isSystemUser ? null : item.last_seen_at ?? null,
    isOnline: isSystemUser ? false : normalizeNullableBoolean(item.is_online),
    setupCompleted,
    clinicaId,
    clinicaNome: normalizeString(item.clinica_nome),
    clinicaEmail: normalizeString(item.clinica_email),
    clinicaAtiva: normalizeNullableBoolean(item.clinica_ativa),
    clinicaTipoConta: item.clinica_tipo_conta ?? null,
    clinicaStatus: item.clinica_status ?? null,
    clinicaPlano: item.clinica_plano ?? item.clinica_tipo_conta ?? null,
    clinicaTrialAte: item.clinica_trial_ate ?? null,
    clinicaDataAtivacao: item.clinica_data_ativacao ?? null,
    clinicaCnpj: normalizeString(item.clinica_cnpj),
  };
}

export function normalizeAdminUsers(payload) {
  const rows = Array.isArray(payload) ? payload.map((item) => normalizeAdminUser(item)) : [];
  return {
    rows,
    totalFromBackend: rows.length,
  };
}
