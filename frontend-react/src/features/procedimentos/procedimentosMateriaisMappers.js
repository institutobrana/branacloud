export function normalizeProcedimentoMaterial(item) {
  return {
    vinculo_id: Number(item?.vinculo_id || item?.id || 0) || 0,
    material_id: Number(item?.material_id || 0) || 0,
    codigo: String(item?.codigo || '').trim(),
    nome: String(item?.nome || '').trim(),
    relacao: Number(item?.relacao || 0) || 0,
    preco: Number(item?.preco || 0) || 0,
    custo_und: Number(item?.custo_und || 0) || 0,
    quantidade: Number(item?.quantidade || 0) || 0,
    custo_total: Number(item?.custo_total || 0) || 0,
    origem: String(item?.origem || '').trim(),
    herdado: Boolean(item?.herdado),
  };
}

export function normalizeProcedimentoMateriaisState(payload) {
  const items = Array.isArray(payload?.itens) ? payload.itens.map(normalizeProcedimentoMaterial) : [];
  return {
    itens: items,
    total_materiais: Number(payload?.total_materiais || items.length || 0) || 0,
    total_custo_und: Number(payload?.total_custo_und || 0) || 0,
    total_custo: Number(payload?.total_custo || 0) || 0,
  };
}

export function normalizeMaterialListItem(item) {
  return {
    id: Number(item?.id || 0) || 0,
    codigo: String(item?.codigo || '').trim(),
    nome: String(item?.nome || '').trim(),
    relacao: Number(item?.relacao || 0) || 0,
    custo: Number(item?.custo || 0) || 0,
    preco: Number(item?.preco || 0) || 0,
    classificacao: String(item?.classificacao || '').trim(),
    lista_id: Number(item?.lista_id || 0) || 0,
  };
}

export function normalizeMaterialList(item) {
  return {
    id: Number(item?.id || 0) || 0,
    nome: String(item?.nome || '').trim(),
    nro_indice: Number(item?.nro_indice || 0) || 0,
  };
}

export function formatMaterialMoney(value) {
  const next = Number(value || 0);
  return Number.isFinite(next) ? next.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00';
}
