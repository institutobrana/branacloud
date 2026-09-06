export function mapConvenio(item) {
  return { ...item, id: Number(item?.row_id || item?.id || 0) || 0, nome: String(item?.nome || ''), codigo: String(item?.codigo || ''), telefone: String(item?.telefone || ''), telefone2: String(item?.telefone2 || ''), inativo: Boolean(item?.inativo) };
}

export function mapPlano(item) {
  return { ...item, id: Number(item?.row_id || item?.id || 0) || 0, convenioId: Number(item?.convenio_row_id || item?.convenio_id || 0) || 0, nome: String(item?.nome || ''), cobertura: String(item?.cobertura || ''), inativo: Boolean(item?.inativo) };
}

export function statusLabel(inativo) { return inativo ? 'Inativo' : 'Ativo'; }
export function pluralize(count, singular, plural) { return `${count} ${count === 1 ? singular : plural}`; }
