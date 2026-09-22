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
  const raw = String(value || '').trim();
  const digits = raw.replace(/\D/g, '');
  const match = raw.match(/^(\d{1,2})[:hH]?(\d{2})$/);
  if (digits.length !== 4 && !match) return '';
  const hourText = match ? match[1].padStart(2, '0') : digits.slice(0, 2);
  const minuteText = match ? match[2] : digits.slice(2);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  return hour <= 23 && minute <= 59 ? `${hourText}:${minuteText}` : '';
}
