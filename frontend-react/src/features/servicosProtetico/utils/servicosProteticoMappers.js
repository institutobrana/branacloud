export function normalizeProtetico(item) {
  return {
    id: Number(item?.id || 0) || 0,
    nome: String(item?.nome || '').trim(),
  };
}

export function normalizeServico(item) {
  return {
    id: Number(item?.id || 0) || 0,
    protetico_id: Number(item?.protetico_id || 0) || 0,
    codigo: Number(item?.id || 0) || 0,
    nome: String(item?.nome || '').trim(),
    indice: Number(item?.indice || 0) || 0,
    preco: Number(item?.preco || 0) || 0,
    prazo: Number(item?.prazo || 0) || 0,
  };
}
