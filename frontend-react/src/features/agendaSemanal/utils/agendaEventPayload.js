const PHONE_TYPE_CODES = { Residencial: 1, Comercial: 2, Celular: 4, Recado: 5 };

export function buildAgendaPayload(draft, { mode = 'new', providerId = '', unitId = null } = {}) {
  const [hours, minutes] = String(draft?.startTime || '').split(':').map(Number);
  const start = ((Number(hours) || 0) * 60 + (Number(minutes) || 0)) * 60000;
  const end = start + Math.max(5, Number(draft?.duration) || 5) * 60000;
  const phoneType = (value) => PHONE_TYPE_CODES[value] ?? null;
  return {
    data: draft?.date || '', hora_inicio: start, hora_fim: end,
    sala: draft?.room === '' ? null : Number(draft?.room), tipo: Number(draft?.type),
    nro_pac: draft?.patientId ? Number(draft.patientId) : null,
    patient_id: (mode === 'new' || draft?.patientIdExplicit) && draft?.patientId ? Number(draft.patientId) : null,
    nome: draft?.name || null,
    motivo: draft?.subject || null, status: draft?.status === '' ? null : Number(draft?.status),
    observ: draft?.observations || null,
    tip_fone1: phoneType(draft?.phoneTypes?.[0]), fone1: draft?.phones?.[0] || null,
    tip_fone2: phoneType(draft?.phoneTypes?.[1]), fone2: draft?.phones?.[1] || null,
    tip_fone3: phoneType(draft?.phoneTypes?.[2]), fone3: draft?.phones?.[2] || null,
    id_prestador: providerId ? Number(providerId) : null,
    id_unidade: (mode === 'edit' ? draft?.unitId : unitId) ? Number(mode === 'edit' ? draft.unitId : unitId) : null,
  };
}

export function validateAgendaEditPayload(payload, eventId) {
  const start = Number(payload?.hora_inicio);
  const end = Number(payload?.hora_fim);
  return Boolean(eventId && /^\d{4}-\d{2}-\d{2}$/.test(String(payload?.data))
    && start > 0 && end > start && Number(payload?.id_prestador) > 0
    && Number(payload?.id_unidade) > 0 && [1, 2].includes(Number(payload?.tipo)));
}
