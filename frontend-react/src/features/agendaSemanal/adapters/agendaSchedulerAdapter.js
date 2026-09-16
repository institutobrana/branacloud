export function toSchedulerEvent(event, providerConfig = {}) {
  const presentation = event.presentation || {};
  return {
    id: String(event.id),
    title: event.patientName,
    start: event.start,
    end: event.end,
    providerId: event.providerId,
    patientName: event.patientName,
    backgroundColor: presentation.backgroundColor || event.backgroundColor,
    borderColor: presentation.borderColor || event.backgroundColor,
    textColor: presentation.color || event.textColor,
    extendedProps: {
      patientName: event.patientName,
      phone: event.phone,
      providerId: event.providerId,
      durationMinutes: event.durationMinutes,
      backgroundColor: event.backgroundColor,
      textColor: event.textColor,
      presentation,
      providerConfig: event.providerConfig || providerConfig,
      metadata: event.metadata,
      type: event.type,
      status: event.status,
      unitId: event.unitId,
      patientId: event.patientId,
      start: event.start,
      end: event.end,
    },
  };
}

export function fromSchedulerDrop(dropInfo) {
  const event = dropInfo.event;
  const start = new Date(event.start);
  const end = new Date(event.end);
  return {
    id: event.id,
    start,
    end,
    durationMinutes: Math.round((end.getTime() - start.getTime()) / 60000),
  };
}
