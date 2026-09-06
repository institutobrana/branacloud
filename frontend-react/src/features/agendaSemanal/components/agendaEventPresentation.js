export function agendaEventDurationMinutes(eventInfo) {
  const start = eventInfo?.event?.start ? new Date(eventInfo.event.start).getTime() : NaN;
  const end = eventInfo?.event?.end ? new Date(eventInfo.event.end).getTime() : NaN;
  return Number.isFinite(start) && Number.isFinite(end) ? Math.max(0, Math.round((end - start) / 60000)) : 0;
}

export function agendaEventPresentationForDuration(durationMinutes) {
  if (durationMinutes <= 5) return 'short';
  if (durationMinutes <= 15) return 'compact';
  if (durationMinutes <= 30) return 'medium';
  return 'long';
}

function eventType(event) {
  const type = Number(event?.type ?? event?.metadata?.tipo);
  if (type === 1) return 'particular';
  if (type === 2) return 'compromisso';
  if (type === 0) return Number(event?.patientId ?? event?.metadata?.nro_pac ?? 0) > 0 ? 'particular' : 'compromisso';
  const motivo = String(event?.metadata?.motivo || '').toLowerCase();
  if (motivo.includes('convênio') || motivo.includes('convenio')) return 'convenio';
  return Number(event?.patientId ?? event?.metadata?.nro_pac ?? 0) > 0 ? 'particular' : 'compromisso';
}

function statusColor(event, statusCatalog) {
  if (!statusCatalog) return '';
  const status = event?.status ?? event?.metadata?.status;
  const candidates = Array.isArray(statusCatalog) ? statusCatalog : Object.values(statusCatalog);
  const item = candidates.find((entry) => [entry?.id, entry?.codigo, entry?.valor_int].some((value) => String(value) === String(status)));
  return String(item?.cor_apresentacao || '').trim();
}

export function resolveAgendaEventPresentation(event, providerConfig = {}, statusCatalog = []) {
  const type = eventType(event);
  const colors = {
    particular: providerConfig.apresentacao_particular_cor || '#ffff00',
    convenio: providerConfig.apresentacao_convenio_cor || '#0000ff',
    compromisso: providerConfig.apresentacao_compromisso_cor || '#00e5ef',
  };
  const fonte = providerConfig.apresentacao_fonte || {};
  const explicitColor = statusColor(event, statusCatalog) || String(event?.backgroundColor || '').trim();
  return {
    backgroundColor: explicitColor || colors[type],
    borderColor: explicitColor || colors[type],
    color: event?.textColor || fonte.color || '#000000',
    fontFamily: fonte.family || 'MS Sans Serif',
    fontSize: `${Number(fonte.size || 8) || 8}pt`,
    fontWeight: fonte.bold ? '700' : '400',
    fontStyle: fonte.italic ? 'italic' : 'normal',
    textDecoration: [fonte.underline ? 'underline' : '', fonte.strike ? 'line-through' : ''].filter(Boolean).join(' ') || 'none',
  };
}
