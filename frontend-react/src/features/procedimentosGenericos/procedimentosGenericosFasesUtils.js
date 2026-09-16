function normalizeQuantidade(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return 0;
  const normalized = raw.replace(/\s+/g, '').replace(',', '.');
  const next = Number(normalized);
  return Number.isFinite(next) ? next : 0;
}

export function buildProcedimentoGenericoPayload(state) {
  return {
    codigo: String(state?.codigo || '').trim(),
    descricao: String(state?.descricao || '').trim(),
    especialidade: String(state?.especialidade || '').trim(),
    tempo: Math.max(0, Number(state?.tempo || 0)),
    custo_lab: Number(state?.custo_lab || 0),
    peso: Number(state?.peso || 0),
    simbolo_grafico: String(state?.simbolo_grafico || '').trim(),
    simbolo_grafico_legacy_id: Number(state?.simbolo_grafico_legacy_id || 0) || null,
    mostrar_simbolo: !!String(state?.simbolo_grafico || '').trim(),
    inativo: !!state?.inativo,
    observacoes: String(state?.observacoes || '').trim(),
    fases: Array.isArray(state?.fases)
      ? state.fases
          .map((fase, index) => ({
            codigo: String(fase?.codigo || '').trim(),
            descricao: String(fase?.descricao || '').trim(),
            sequencia: Math.max(1, Number(fase?.sequencia || index + 1)),
            tempo: Number(fase?.tempo || 0),
          }))
          .filter((fase) => fase.descricao)
      : [],
    materiais: Array.isArray(state?.materiais)
      ? state.materiais
          .map((material) => ({
            material_id: Number(material?.material_id || 0),
            quantidade: normalizeQuantidade(material?.quantidade || 0),
          }))
          .filter((material) => material.material_id > 0 && material.quantidade > 0)
      : [],
  };
}

export function normalizeProcedimentoGenericoDetalhe(item) {
  return {
    id: Number(item?.id || 0) || 0,
    codigo: String(item?.codigo || '').trim(),
    descricao: String(item?.descricao || '').trim(),
    especialidade: String(item?.especialidade || '').trim(),
    tempo: Number(item?.tempo || 0) || 0,
    custo_lab: Number(item?.custo_lab || 0) || 0,
    peso: Number(item?.peso || 0) || 0,
    simbolo_grafico: String(item?.simbolo_grafico || '').trim(),
    simbolo_grafico_legacy_id: Number(item?.simbolo_grafico_legacy_id || 0) || null,
    mostrar_simbolo: Boolean(item?.mostrar_simbolo),
    inativo: Boolean(item?.inativo),
    observacoes: String(item?.observacoes || '').trim(),
    data_inclusao: String(item?.data_inclusao || '').trim(),
    data_alteracao: String(item?.data_alteracao || '').trim(),
    fases: Array.isArray(item?.fases)
      ? item.fases.map((fase, index) => ({
          id: Number(fase?.id || 0) || null,
          procedimento_generico_id: Number(fase?.procedimento_generico_id || item?.id || 0) || null,
          clinica_id: Number(fase?.clinica_id || 0) || null,
          codigo: String(fase?.codigo || '').trim(),
          descricao: String(fase?.descricao || '').trim(),
          sequencia: Number(fase?.sequencia || index + 1) || index + 1,
          tempo: Number(fase?.tempo || 0) || 0,
        }))
      : [],
    materiais: Array.isArray(item?.materiais)
      ? item.materiais.map((material) => ({
          material_id: Number(material?.material_id || 0) || 0,
          codigo: String(material?.codigo || '').trim(),
          nome: String(material?.nome || '').trim(),
          quantidade: Number(material?.quantidade || 0) || 0,
          custo_und: Number(material?.custo_und || 0) || 0,
        }))
      : [],
    vinculos: Array.isArray(item?.vinculos)
      ? item.vinculos.map((vinculo) => ({
          id: Number(vinculo?.id || 0) || 0,
          tabela_id: Number(vinculo?.tabela_id || 0) || 0,
          tabela_nome: String(vinculo?.tabela_nome || '').trim(),
          codigo: String(vinculo?.codigo || '').trim(),
          nome: String(vinculo?.nome || '').trim(),
        }))
      : [],
  };
}

export function buildEmptyProcedimentoGenericoState(codigo = '') {
  return {
    id: null,
    codigo: String(codigo || ''),
    descricao: '',
    especialidade: '',
    tempo: 0,
    custo_lab: 0,
    peso: 0,
    simbolo_grafico: '',
    simbolo_grafico_legacy_id: null,
    mostrar_simbolo: false,
    inativo: false,
    observacoes: '',
    data_inclusao: '',
    data_alteracao: '',
    fases: [],
    materiais: [],
    vinculos: [],
  };
}

export function normalizeFaseSequenceValue(value, fallback = 1) {
  return Math.max(1, Number(value || fallback || 1));
}
