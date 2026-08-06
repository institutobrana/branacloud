export function resolveSimbolosGraficosSelection(selectedId, rows = []) {
  const selected = Number(selectedId || 0) || null;
  if (!selected) return null;
  return Array.isArray(rows) && rows.some((row) => Number(row?.id || 0) === selected) ? selected : null;
}

export function countSimbolosGraficosRows(rows = []) {
  const totalCount = Array.isArray(rows) ? rows.length : 0;
  return { totalCount };
}
