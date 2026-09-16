export const PAGE_PAPER_PRESETS = {
  A4: { altura_mm: 297, largura_mm: 210 },
  Carta: { altura_mm: 279.4, largura_mm: 215.9 },
  Receituário: { altura_mm: 210, largura_mm: 148 },
  'Definido pelo usuário': { altura_mm: 279.4, largura_mm: 215.9 },
};

export const DEFAULT_PAGE_CONFIG = Object.freeze({ tipo_papel: 'Definido pelo usuário', orientacao: 'Retrato', altura_mm: 279.4, largura_mm: 215.9, margem_superior_mm: 25.4, margem_esquerda_mm: 33.16, margem_direita_mm: 33.16 });

export function normalizePageConfig(value = {}) {
  const source = { ...DEFAULT_PAGE_CONFIG, ...(value || {}) };
  const tipo_papel = PAGE_PAPER_PRESETS[source.tipo_papel] ? source.tipo_papel : DEFAULT_PAGE_CONFIG.tipo_papel;
  const orientacao = source.orientacao === 'Paisagem' ? 'Paisagem' : 'Retrato';
  const number = (input, fallback, minimum) => { const parsed = typeof input === 'number' ? input : Number(String(input ?? '').replace(/\./g, '').replace(',', '.')); return Number.isFinite(parsed) ? Math.max(minimum, parsed) : fallback; };
  return { tipo_papel, orientacao, altura_mm: number(source.altura_mm, DEFAULT_PAGE_CONFIG.altura_mm, 50), largura_mm: number(source.largura_mm, DEFAULT_PAGE_CONFIG.largura_mm, 50), margem_superior_mm: number(source.margem_superior_mm, DEFAULT_PAGE_CONFIG.margem_superior_mm, 0), margem_esquerda_mm: number(source.margem_esquerda_mm, DEFAULT_PAGE_CONFIG.margem_esquerda_mm, 0), margem_direita_mm: number(source.margem_direita_mm, DEFAULT_PAGE_CONFIG.margem_direita_mm, 0) };
}

export function formatPageMm(value) { return Number(value).toFixed(2).replace('.', ','); }
export function parsePageMm(value, fallback) { const parsed = typeof value === 'number' ? value : Number(String(value ?? '').replace(/\./g, '').replace(',', '.')); return Number.isFinite(parsed) ? parsed : fallback; }
export function applyPagePreset(config, tipo_papel) { const preset = PAGE_PAPER_PRESETS[tipo_papel] || PAGE_PAPER_PRESETS['Definido pelo usuário']; const next = { ...config, tipo_papel, altura_mm: preset.altura_mm, largura_mm: preset.largura_mm }; return config.orientacao === 'Paisagem' ? { ...next, altura_mm: preset.largura_mm, largura_mm: preset.altura_mm } : next; }
export function togglePageOrientation(config, orientacao) { return config.orientacao === orientacao ? config : { ...config, orientacao, altura_mm: config.largura_mm, largura_mm: config.altura_mm }; }
export function validatePageConfig(config) { return config.margem_esquerda_mm + config.margem_direita_mm >= config.largura_mm - 10 ? 'As margens esquerda e direita excedem a largura da página.' : ''; }
