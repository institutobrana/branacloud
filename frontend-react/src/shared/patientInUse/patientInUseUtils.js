export function calculatePatientAge(dateValue, today = new Date()) {
  if (!dateValue) return '';
  const birth = new Date(`${String(dateValue).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return '';
  let totalMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  if (today.getDate() < birth.getDate()) totalMonths -= 1;
  if (totalMonths < 0) return '';
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return `${years} ${years === 1 ? 'ano' : 'anos'}, ${months} ${months === 1 ? 'mês' : 'meses'}`;
}
