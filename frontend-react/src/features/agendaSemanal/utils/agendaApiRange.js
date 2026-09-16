function dateOnly(value) {
  return String(value ?? '').slice(0, 10);
}

function subtractOneDay(dateValue) {
  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function resolveAgendaApiRange({ startStr, endStr } = {}) {
  const start = dateOnly(startStr);
  const calendarEndExclusive = dateOnly(endStr);
  return { start, end: subtractOneDay(calendarEndExclusive) };
}
