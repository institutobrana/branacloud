export function agendaClickDetail(event) {
  return Number(event?.detail || 0);
}

export function isAgendaDoubleClick(event) {
  return agendaClickDetail(event) === 2;
}
