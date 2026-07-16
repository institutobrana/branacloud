export function normalizeProtetico(item) {
  return {
    id: Number(item?.id || 0) || 0,
    nome: String(item?.nome || '').trim(),
  };
}

export function normalizeServico(item) {
  const codigo = String(item?.codigo ?? '').trim();
  return {
    id: Number(item?.id || 0) || 0,
    protetico_id: Number(item?.protetico_id || 0) || 0,
    codigo,
    nome: String(item?.nome || '').trim(),
    descricao: String(item?.descricao ?? '').trim() || '',
    indice: String(item?.indice ?? '').trim(),
    preco: Number(item?.preco || 0) || 0,
    prazo: Number(item?.prazo || 0) || 0,
  };
}
