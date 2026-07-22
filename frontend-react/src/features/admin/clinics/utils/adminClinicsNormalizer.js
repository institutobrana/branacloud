import { normalizePlanValue } from './adminClinicsFormatters.js';

export function normalizeAdminClinic(item = {}) {
  const id = Number(item.id || 0) || 0;
  return {
    id,
    key: String(id || item.email || item.nome || 'clinica'),
    nome: String(item.nome || '').trim(),
    email: String(item.email || '').trim(),
    ativo: item.ativo === undefined || item.ativo === null ? true : Boolean(item.ativo),
    tipoConta: item.tipo_conta ?? null,
    plano: normalizePlanValue(item.tipo_conta),
    trialAte: item.trial_ate ?? null,
    assinaturaStatus: String(item.assinatura_status || '').trim().toLowerCase(),
    usuariosTotal: Number(item.usuarios_total || 0) || 0,
    usuariosAtivos: Number(item.usuarios_ativos || 0) || 0,
  };
}

export function normalizeAdminClinics(payload) {
  const rows = Array.isArray(payload) ? payload.map(normalizeAdminClinic) : [];
  return {
    rows,
    totalFromBackend: rows.length,
  };
}
