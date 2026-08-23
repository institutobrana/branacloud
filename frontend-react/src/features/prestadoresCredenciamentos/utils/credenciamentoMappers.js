export function buildCredenciamentoCreatePayload(draft = {}) {
  const prestador = Number(draft.prestador_row_id);
  const payload = {
    convenio_row_id: Number(draft.convenio_row_id),
    prestador_row_id: prestador === 0 ? 0 : prestador,
    inicio: draft.inicio || null,
    fim: draft.fim || null,
    valor_us: draft.valor_us || null,
    aviso: draft.aviso || null,
    observacoes: draft.observacoes || null,
  };
  const codigo = String(draft.codigo || '').trim();
  if (codigo) payload.codigo = codigo;
  return payload;
}
