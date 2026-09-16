export function agendaSlotMinHeight(visibleScheduleCount) {
  const count = Math.max(1, Math.trunc(Number(visibleScheduleCount) || 12));
  return 504 / count;
}
