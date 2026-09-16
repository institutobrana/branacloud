function parseDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date, withYear = false) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    ...(withYear ? { year: 'numeric' } : {}),
  }).format(date);
}

function startOfWeek(date) {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
  result.setHours(0, 0, 0, 0);
  return result;
}

export function AgendaTemporalStrip({ date, weekDisplayDate = date, activeMode = 'semana', onSelect }) {
  const focusDate = parseDate(date);
  const weekFocusDate = parseDate(weekDisplayDate);
  if (!focusDate) return null;
  const weekStart = startOfWeek(weekFocusDate || focusDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 5);
  return (
    <div className="agenda-view-tabs" role="tablist" aria-label="Visualização da Agenda">
      <button
        type="button"
        role="tab"
        aria-selected={activeMode === 'dia'}
        aria-disabled="false"
        data-testid="agenda-view-day"
        onPointerDown={() => onSelect?.('dia')}
        onClick={() => onSelect?.('dia')}
        className={`agenda-view-tab${activeMode === 'dia' ? ' agenda-view-tab--active' : ''}`}
      >
        Dia {formatDate(focusDate, true)}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeMode === 'semana'}
        data-testid="agenda-view-week"
        onPointerDown={() => onSelect?.('semana')}
        onClick={() => onSelect?.('semana')}
        className={`agenda-view-tab${activeMode === 'semana' ? ' agenda-view-tab--active' : ''}`}
      >
        Semana {formatDate(weekStart)} a {formatDate(weekEnd)}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeMode === 'clinica'}
        aria-disabled="false"
        data-testid="agenda-view-clinica"
        className={`agenda-view-tab${activeMode === 'clinica' ? ' agenda-view-tab--active' : ''}`}
        onPointerDown={() => onSelect?.('clinica')}
        onClick={() => onSelect?.('clinica')}
      >
        Clínica {formatDate(focusDate, true)}
      </button>
    </div>
  );
}
