export function shiftAgendaDate(date, unit, direction) {
  const next = new Date(date);
  const amount = Number(direction) < 0 ? -1 : 1;
  if (unit === 'month') next.setMonth(next.getMonth() + amount);
  else if (unit === 'week') next.setDate(next.getDate() + (7 * amount));
  else next.setDate(next.getDate() + amount);
  return next;
}

const listeners = new Set();

export function subscribeAgendaTemporalNavigation(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitAgendaTemporalNavigation(unit, direction) {
  listeners.forEach((listener) => listener({ unit, direction }));
}
