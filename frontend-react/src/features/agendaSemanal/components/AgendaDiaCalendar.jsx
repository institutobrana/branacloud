import { useMemo } from 'react';

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

function dateOnly(value) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function AgendaDiaCalendar({ value, onChange }) {
  const focusDate = dateOnly(value || new Date());
  const monthStart = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(1 - monthStart.getDay());
  const cells = useMemo(() => Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  }), [gridStart.getFullYear(), gridStart.getMonth()]);
  const selected = isoDate(focusDate);
  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(focusDate);

  return (
    <aside className="agenda-dia-calendar" aria-label="Calendário da Agenda Dia">
      <div className="agenda-dia-calendar__title">{monthLabel}</div>
      <div className="agenda-dia-calendar__weekdays">
        {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="agenda-dia-calendar__grid">
        {cells.map((date) => {
          const dateIso = isoDate(date);
          const otherMonth = date.getMonth() !== focusDate.getMonth();
          return (
            <button
              type="button"
              key={dateIso}
              className={`agenda-dia-calendar__day${otherMonth ? ' is-other-month' : ''}${dateIso === selected ? ' is-selected' : ''}`}
              aria-label={`Selecionar ${dateIso}`}
              aria-pressed={dateIso === selected}
              onClick={() => onChange?.(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
