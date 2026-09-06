import { useEffect, useState } from 'react';

function formatMonth(date) {
  return new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date).replace(/^./, (c) => c.toUpperCase());
}

export function AgendaTemporalNavigation({ unit, testId, label, onPrevious, onNext, onLabel }) {
  return (
    <div className="agenda-temporal-group" aria-label={`Navegação ${unit}`}>
      <button type="button" data-testid={`agenda-${testId}-previous`} className="agenda-toolbar-icon-button" aria-label={`${unit} anterior`} onClick={onPrevious}>‹</button>
      {onLabel ? <button type="button" className="agenda-temporal-label" onClick={onLabel}>{label}</button> : <span className="agenda-temporal-label">{label}</span>}
      <button type="button" data-testid={`agenda-${testId}-next`} className="agenda-toolbar-icon-button" aria-label={`${unit} seguinte`} onClick={onNext}>›</button>
    </div>
  );
}

export function useAgendaTemporalLabel() {
  const [date, setDate] = useState(() => new Date());
  useEffect(() => {
    const onState = (event) => {
      if (event.detail?.date) setDate(new Date(event.detail.date));
    };
    window.addEventListener('brana-agenda-calendar-state', onState);
    return () => window.removeEventListener('brana-agenda-calendar-state', onState);
  }, []);
  return formatMonth(date);
}
