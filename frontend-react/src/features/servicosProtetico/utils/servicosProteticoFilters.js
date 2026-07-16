import { formatMoney, normalizeText } from './servicosProteticoFormatters.js';

export function filterServicos(items, filters = {}) {
  const codigoTermo = normalizeText(filters.codigo);
  const nomeTermo = normalizeText(filters.nome);
  const indiceTermo = normalizeText(filters.indice);
  const precoTermo = normalizeText(filters.preco);
  const prazoTermo = normalizeText(filters.prazo);

  return (Array.isArray(items) ? items : []).filter((item) => {
    const codigo = normalizeText(item?.codigo);
    const nome = normalizeText(item?.nome);
    const indice = normalizeText(formatMoney(item?.indice));
    const preco = normalizeText(formatMoney(item?.preco));
    const prazo = normalizeText(String(item?.prazo ?? ''));

    return (
      (!codigoTermo || codigo.includes(codigoTermo)) &&
      (!nomeTermo || nome.includes(nomeTermo)) &&
      (!indiceTermo || indice.includes(indiceTermo)) &&
      (!precoTermo || preco.includes(precoTermo)) &&
      (!prazoTermo || prazo.includes(prazoTermo))
    );
  });
}

export function sortServicos(items, sortState = {}) {
  const next = [...(Array.isArray(items) ? items : [])];
  const { key, order } = sortState;
  if (!key || !order) return next;

  next.sort((left, right) => {
    const leftValue = key === 'preco' || key === 'indice' ? Number(left?.[key] || 0) : normalizeText(left?.[key] ?? '');
    const rightValue = key === 'preco' || key === 'indice' ? Number(right?.[key] || 0) : normalizeText(right?.[key] ?? '');
    const comparison =
      typeof leftValue === 'number' && typeof rightValue === 'number'
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue), 'pt-BR', { sensitivity: 'base' });
    return order === 'asc' ? comparison : -comparison;
  });

  return next;
}
