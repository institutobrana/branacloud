export function formatCredenciamentoDate(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) return raw;
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : raw;
}

export function formatCredenciamentoPrestador(item = {}) {
  if (item.prestador_sistemico || Number(item.prestador_row_id) === 0) return '001 - Clínica';
  return String(item.prestador_nome || '').trim();
}

export function formatCredenciamentoValue(value) {
  return String(value || '').trim();
}
