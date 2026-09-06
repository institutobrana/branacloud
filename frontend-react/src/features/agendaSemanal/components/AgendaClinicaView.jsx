import { useEffect, useMemo } from 'react';
import { resolveAgendaEventPresentation } from './agendaEventPresentation.js';
import { agendaEventContentLines } from '../utils/agendaEventContent.js';
function minutes(value, fallback) {
  const [hours, mins] = String(value || '').split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : fallback;
}

function providerConfig(provider) {
  const config = provider?.agenda_config || {};
  const start = minutes(config.manha_inicio, 7 * 60);
  const end = minutes(config.tarde_fim, 20 * 60);
  const step = Math.max(5, Number(config.duracao || 5));
  return { start, end: Math.max(start + step, end), step };
}

function formatTime(value) {
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function AgendaClinicaView({ date, providers = [], events = [], statusCatalog = [], onVisibleRangeChange, onSlotClick, onEventClick }) {
  const columns = useMemo(() => providers.map((provider) => {
    const config = providerConfig(provider);
    const slots = [];
    for (let value = config.start; value < config.end; value += config.step) slots.push(value);
    return { provider, config, slots };
  }), [providers]);

  useEffect(() => {
    if (!date) return;
    const day = new Date(date);
    const iso = day.toISOString().slice(0, 10);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    onVisibleRangeChange?.({ startStr: `${iso}T00:00:00`, endStr: `${next.toISOString().slice(0, 10)}T00:00:00` });
  }, [date, onVisibleRangeChange]);

  const eventMap = useMemo(() => {
    const map = new Map();
    events.forEach((event) => {
      const providerId = String(event.providerId ?? event.metadata?.id_prestador ?? '');
      if (!map.has(providerId)) map.set(providerId, []);
      map.get(providerId).push(event);
    });
    return map;
  }, [events]);

  return (
    <div className="agenda-clinica-grid" data-testid="agenda-clinica-grid">
      {columns.length === 0 && <div className="agenda-clinica-empty">Sem prestadores elegíveis.</div>}
      {columns.map(({ provider, config, slots }) => {
        const providerEvents = eventMap.get(String(provider.id)) || [];
        return (
          <section className="agenda-clinica-column" key={provider.id} data-provider-id={provider.id}>
            <header
              className="agenda-clinica-column__header"
              data-testid={`agenda-clinica-header-${provider.id}`}
              aria-label={`Agenda de ${provider.nome}`}
            >
              {provider.nome}
            </header>
            <div className="agenda-clinica-column__body">
              <div className="agenda-clinica-column__times">
                {slots.map((slot) => <div className="agenda-clinica-time" key={slot}>{formatTime(slot)}</div>)}
              </div>
              <div className="agenda-clinica-column__events">
                {slots.map((slot) => <div className="agenda-clinica-slot" key={slot} onClick={(jsEvent) => onSlotClick?.({ date, slot, provider, jsEvent })} />)}
                {providerEvents.map((event) => {
                  const start = event.start.getHours() * 60 + event.start.getMinutes();
                  const end = event.end.getHours() * 60 + event.end.getMinutes();
                  const slotHeight = 22;
                  const top = Math.max(0, (start - config.start) / config.step) * slotHeight;
                  const height = Math.max(slotHeight, (Math.max(end, start + config.step) - start) / config.step * slotHeight);
                  const lines = agendaEventContentLines(event, provider.agenda_config || {}, 'week');
                  return <div className="agenda-clinica-event" key={event.id} onClick={(jsEvent) => onEventClick?.({ event, provider, jsEvent })} style={{ top: `${top}px`, height: `${height}px`, ...(event.presentation || resolveAgendaEventPresentation(event, provider.agenda_config || {}, statusCatalog)) }}>
                    {lines.map((line) => <span className={line.className} key={line.key}>{line.text}</span>)}
                  </div>;
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
