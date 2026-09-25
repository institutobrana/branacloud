export function normalizeAttestadoDate(value) {
  const raw = String(value || '').trim();
  const digits = raw.replace(/\D/g, '');
  const match = raw.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})$/);
  if (digits.length !== 8 && !match) return '';
  const dayText = match ? match[1].padStart(2, '0') : digits.slice(0, 2);
  const monthText = match ? match[2].padStart(2, '0') : digits.slice(2, 4);
  const rawYear = match ? match[3] : digits.slice(4);
  const yearText = rawYear.length === 2 ? `20${rawYear}` : rawYear;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return '';
  return `${dayText}/${monthText}/${yearText}`;
}

export function normalizeAttestadoTime(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  let hour;
  let minute;
  const colonMatch = raw.match(/^(\d{1,2}):(\d{1,2})$/);

  if (colonMatch) {
    hour = Number(colonMatch[1]);
    minute = Number(colonMatch[2]);
  } else {
    if (!/^\d{1,4}$/.test(raw)) return '';
    if (raw.length <= 2) {
      hour = Number(raw);
      minute = 0;
    } else if (raw.length === 3) {
      hour = Number(raw.slice(0, 1));
      minute = Number(raw.slice(1));
    } else {
      hour = Number(raw.slice(0, 2));
      minute = Number(raw.slice(2));
    }
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return '';
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function buildAttestadoBody({ patientName = '', reason = '', cid = '', observations = '', startDate = '', endDate = '', startTime = '', endTime = '' } = {}) {
  const nomePaciente = String(patientName || '').trim();
  const motivo = String(reason || '').trim();
  const cidValue = String(cid || '').trim();
  const obs = String(observations || '').trim();
  const inicio = normalizeAttestadoDate(startDate);
  const fim = normalizeAttestadoDate(endDate);
  const horaInicio = normalizeAttestadoTime(startTime);
  const horaFim = normalizeAttestadoTime(endTime);
  let linha = 'Atesto para os devidos fins de direito,';
  linha += nomePaciente ? ` que o(a) Sr(a). ${nomePaciente}` : ' que o(a) paciente';
  linha += ' esteve sob meus cuidados profissionais';
  if (inicio && fim) linha += ` no período de ${inicio} a ${fim}`;
  else if (inicio) linha += ` no período de ${inicio}`;
  else if (fim) linha += ` até ${fim}`;
  if (horaInicio && horaFim) linha += `, no horário de ${horaInicio} as ${horaFim}`;
  else if (horaInicio) linha += `, a partir das ${horaInicio}`;
  else if (horaFim) linha += `, até as ${horaFim}`;
  if (motivo) linha += ` por motivo de ${motivo}`;
  linha += ', estando sob minha responsabilidade.';
  const parts = [`${'\u00A0'.repeat(7)}${linha}`];
  if (obs) parts.push(obs);
  if (cidValue) parts.push('', `CID: ${cidValue}`);
  return parts.join('\n');
}
