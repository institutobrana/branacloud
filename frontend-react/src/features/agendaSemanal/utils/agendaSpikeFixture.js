const date = (dayOffset, hour, minute = 0) => new Date(2026, 7, 31 + dayOffset, hour, minute);

export const agendaSpikeConfig = {
  initialDate: date(0, 7),
  slotDuration: '00:05:00',
  slotMinTime: '07:00:00',
  slotMaxTime: '18:00:00',
  validStart: date(0, 0),
  validEnd: date(6, 0),
};

export const agendaSpikeFixture = [
  { id: 'spike-1', start: date(0, 8), end: date(0, 8, 20), patientName: 'Paciente curto', phone: '(00) 0000-0001', providerId: 'provider-1', backgroundColor: '#1677ff', textColor: '#ffffff' },
  { id: 'spike-2', start: date(1, 10), end: date(1, 10, 40), patientName: 'Paciente longo', phone: '(00) 0000-0002', providerId: 'provider-1', backgroundColor: '#13c2c2', textColor: '#ffffff' },
  { id: 'spike-3', start: date(2, 14), end: date(2, 15), patientName: 'Paciente sessenta', phone: '(00) 0000-0003', providerId: 'provider-1', backgroundColor: '#722ed1', textColor: '#ffffff' },
  { id: 'spike-4', start: date(3, 9), end: date(3, 9, 40), patientName: 'Conflito controlado', phone: '(00) 0000-0004', providerId: 'provider-1', backgroundColor: '#fa8c16', textColor: '#ffffff' },
];

export function hasTemporalConflict(candidate, events) {
  return events.some((event) => {
    if (String(event.id) === String(candidate.id)) return false;
    return candidate.start < event.end && candidate.end > event.start;
  });
}
