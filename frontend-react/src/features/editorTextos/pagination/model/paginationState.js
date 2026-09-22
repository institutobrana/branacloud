export const PAGINATION_AWARENESS_ENABLED = true;
export const MM_TO_PX = 96 / 25.4;

export function toLayoutConfig(pageConfig = {}) {
  const width = Math.max(50, Number(pageConfig.largura_mm) || 215.9) * MM_TO_PX;
  const height = Math.max(50, Number(pageConfig.altura_mm) || 279.4) * MM_TO_PX;
  return {
    width,
    height,
    marginTop: Math.max(0, Number(pageConfig.margem_superior_mm) || 0) * MM_TO_PX,
    marginBottom: Math.max(0, Number(pageConfig.margem_inferior_mm ?? pageConfig.margem_superior_mm) || 0) * MM_TO_PX,
    marginLeft: Math.max(0, Number(pageConfig.margem_esquerda_mm) || 0) * MM_TO_PX,
    marginRight: Math.max(0, Number(pageConfig.margem_direita_mm) || 0) * MM_TO_PX,
    gap: Math.max(0, Number(pageConfig.pageGapPx) || 14),
  };
}

export function emptyPaginationState() {
  return { documentVersion: 0, configVersion: 0, layoutVersion: 0, pageConfig: null, pageCount: 0, pages: [], breaks: [], pmPositionMap: [], currentPage: 1, selectionPageRange: [1, 1], accuracy: 'EXACT', metrics: {}, diagnostics: [] };
}
