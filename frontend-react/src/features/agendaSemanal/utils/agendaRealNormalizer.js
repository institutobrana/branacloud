const DEFAULT_SLOT_MINUTES = 5;

function firstNonEmpty(...values) {
  return values.map((value) => String(value ?? '').trim()).find(Boolean) || '';
}

export function agendaEventDisplayLabel({ type, subject, patientName, name, patientId } = {}) {
  if (Number(type) === 2) return firstNonEmpty(subject);
  return firstNonEmpty(patientName, name, patientId ? `Paciente #${patientId}` : '', 'Agendamento sem paciente');
}

function dateAtMinutes(dateValue, milliseconds) {
  const date = new Date(`${String(dateValue).slice(0, 10)}T00:00:00`);
  date.setMinutes(Math.floor(Number(milliseconds || 0) / 60000));
  return date;
}

export function normalizeAgendaEvent(dto, { slotMinutes = DEFAULT_SLOT_MINUTES } = {}) {
  const start = dateAtMinutes(dto.data, dto.hora_inicio);
  const rawEnd = Number(dto.hora_fim || 0);
  const end = rawEnd > Number(dto.hora_inicio || 0)
    ? dateAtMinutes(dto.data, rawEnd)
    : new Date(start.getTime() + slotMinutes * 60000);
  const patientName = agendaEventDisplayLabel({
    type: dto.tipo,
    subject: dto.motivo,
    name: dto.nome,
    patientId: dto.nro_pac,
  });
  const phone = firstNonEmpty(dto.fone1, dto.fone2, dto.fone3);

  return {
    id: String(dto.id),
    start,
    end,
    patientName,
    phone,
    providerId: dto.id_prestador ?? null,
    unitId: dto.id_unidade ?? null,
    status: dto.status ?? null,
    type: dto.tipo ?? null,
    patientId: dto.nro_pac ?? null,
    metadata: dto,
    // O endpoint legado não devolve a configuração de cor por evento.
    // A aparência neutra abaixo não representa status e será substituída
    // quando a configuração visual real for integrada.
    backgroundColor: null,
    textColor: null,
  };
}

export function normalizeAgendaEvents(payload, options) {
  return payload.map((item) => normalizeAgendaEvent(item, options));
}
