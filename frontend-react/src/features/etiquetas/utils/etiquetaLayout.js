export function normalizeGeometry(padrao) {
  return padrao ? { margem_esq: Number(padrao.margem_esq ?? 0), margem_sup: Number(padrao.margem_sup ?? 0), esp_horizontal: Number(padrao.esp_horizontal ?? 0), esp_vertical: Number(padrao.esp_vertical ?? 0), nro_colunas: Number(padrao.nro_colunas ?? 1), nro_linhas: Number(padrao.nro_linhas ?? 1) } : {};
}
