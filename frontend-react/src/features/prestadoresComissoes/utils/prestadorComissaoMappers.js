export function formatPrestadorComissaoRepasse(item = {}) {
  const raw = String(item.repasse ?? '').trim();
  if (Number(item.tipo_repasse_codigo) !== 1 || raw === '') return raw;
  const numeric = Number(raw.replace(',', '.'));
  if (!Number.isFinite(numeric)) return raw;
  return `${numeric.toFixed(4).replace('.', ',')}%`;
}

export function formatPrestadorComissaoEditRepasse(item = {}) {
  const raw = String(item.repasse ?? '').trim();
  if (Number(item.tipo_repasse_codigo) !== 1 || raw === '') return raw;
  const numeric = Number(raw.replace(',', '.'));
  return Number.isFinite(numeric) ? numeric.toFixed(2).replace('.', ',') : raw;
}

export function buildPrestadorComissaoCreatePayload(draft = {}) {
  const vigencia = draft.vigencia?.format?.('DD/MM/YYYY') ?? String(draft.vigencia || '').trim();
  return {
    prestador_row_id: draft.prestador_row_id == null ? null : Number(draft.prestador_row_id),
    convenio_row_id: Number(draft.convenio_row_id),
    especialidade_row_id: draft.especialidade_row_id ? Number(draft.especialidade_row_id) : null,
    especialidade: draft.especialidade_row_id ? String(draft.especialidade || '').trim() : null,
    procedimento_generico_id: draft.procedimento_generico_id ? Number(draft.procedimento_generico_id) : null,
    vigencia: vigencia || null,
    tipo_repasse_codigo: Number(draft.tipo_repasse_codigo) === 2 ? 2 : 1,
    tipo_repasse: Number(draft.tipo_repasse_codigo) === 2 ? 'Valor fixo' : '% sobre valor',
    repasse: String(draft.repasse ?? ''),
  };
}
