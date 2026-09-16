export const LEGACY_FONT_FAMILIES = ['Arial', 'Arial Black', 'Bahnschrift', 'Book Antiqua', 'Calibri', 'Cambria', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Franklin Gothic Medium', 'Gadugi', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Microsoft Sans Serif', 'Palatino Linotype', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'MS Sans Serif', 'MS Serif'];

export function normalizeLocalFontFamilies(fonts) {
  return [...new Set(fonts.map((font) => typeof font === 'string' ? font : font?.family).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function detectCandidateFontFamilies(candidates = LEGACY_FONT_FAMILIES) {
  if (typeof document === 'undefined' || !document.fonts?.check) return null;
  return normalizeLocalFontFamilies(candidates.filter((family) => document.fonts.check(`12px "${family}"`)));
}

let localFontFamiliesCache;
let localFontFamiliesPromise;

export async function loadLocalFontFamilies() {
  if (localFontFamiliesCache) return localFontFamiliesCache;
  if (localFontFamiliesPromise) return localFontFamiliesPromise;

  localFontFamiliesPromise = (async () => {
    const fallback = normalizeLocalFontFamilies(LEGACY_FONT_FAMILIES);
    if (typeof window === 'undefined' || typeof window.queryLocalFonts !== 'function') {
      localFontFamiliesCache = { families: fallback, source: 'fallback', permissionState: 'unsupported' };
      return localFontFamiliesCache;
    }

    try {
      const fonts = await window.queryLocalFonts();
      const families = normalizeLocalFontFamilies(fonts || []);
      localFontFamiliesCache = families.length
        ? { families, source: 'local', permissionState: 'granted' }
        : { families: fallback, source: 'fallback', permissionState: 'granted' };
    } catch (error) {
      const permissionState = error?.name === 'NotAllowedError' ? 'denied' : 'unknown';
      localFontFamiliesCache = { families: fallback, source: 'fallback', permissionState };
    } finally {
      localFontFamiliesPromise = undefined;
    }
    return localFontFamiliesCache;
  })();

  return localFontFamiliesPromise;
}

export function resetLocalFontFamiliesCache() {
  localFontFamiliesCache = undefined;
  localFontFamiliesPromise = undefined;
}
