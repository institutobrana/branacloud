const DEFAULT_METRICS = [
  { key: 'total_clinicas', label: 'Total de clínicas' },
  { key: 'total_usuarios', label: 'Total de usuários' },
  { key: 'mrr_estimado', label: 'Receita Recorrente Mensal' },
  { key: 'arr_estimado', label: 'Receita Recorrente Anual' },
  { key: 'clinicas_ativas', label: 'Ativas' },
  { key: 'clinicas_trial', label: 'Trial' },
  { key: 'clinicas_expiradas', label: 'Expiradas' },
  { key: 'clinicas_suspensas', label: 'Suspensas' },
  { key: 'clinicas_sem_usuario', label: 'Sem usuário' },
  { key: 'clinicas_arquivadas', label: 'Arquivadas' },
];

function normalizeMetricValue(value) {
  if (value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : value;
}

export function normalizeAdminOverview(payload = {}) {
  const metrics = DEFAULT_METRICS.map((metric) => ({
    ...metric,
    value: normalizeMetricValue(payload[metric.key]),
  }));

  const acessosClinicas = Array.isArray(payload.acessos_clinicas)
    ? payload.acessos_clinicas.map((item) => ({
        clinicaId: item?.clinica_id ?? null,
        clinicaNome: item?.clinica_nome ?? null,
        responsavelNome: item?.responsavel_nome ?? null,
        responsavelEmail: item?.responsavel_email ?? null,
        hasUltimoAcesso: Boolean(item && Object.prototype.hasOwnProperty.call(item, 'ultimo_acesso')),
        ultimoAcesso: item?.ultimo_acesso ?? null,
        status: item?.status ?? 'indisponivel',
        statusLabel: item?.status_label ?? 'Indisponível',
      }))
    : [];

  return {
    metrics,
    acessosClinicas,
    raw: payload,
  };
}

export const ADMIN_OVERVIEW_METRICS = DEFAULT_METRICS;
