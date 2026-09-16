export function resolveWeeklyDisplayDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return date;
  if (date.getDay() === 0) date.setDate(date.getDate() + 1);
  return date;
}
