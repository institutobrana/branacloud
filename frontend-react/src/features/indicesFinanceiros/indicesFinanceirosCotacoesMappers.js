export function normalizeIndiceCotacao(item, indiceNumero) {
  const id = Number(item?.id);
  const normalizedId = Number.isFinite(id) ? id : String(item?.id ?? '');

  return {
    id: normalizedId,
    cotacaoId: normalizedId,
    indiceNumero: Number(indiceNumero) || null,
    data: String(item?.data ?? '').trim(),
    valor: Number(item?.valor ?? 0) || 0,
  };
}
