const AGENDA_FONT_FALLBACK_FAMILIES = [
  'MS Sans Serif',
  'MS Serif',
  'Arial',
  'Tahoma',
  'Verdana',
  'Times New Roman',
  'Courier New',
  'Segoe UI',
];

const AGENDA_FONT_CANDIDATE_FAMILIES = [
  'Arial',
  'Arial Black',
  'Bahnschrift',
  'Book Antiqua',
  'Calibri',
  'Cambria',
  'Candara',
  'Comic Sans MS',
  'Consolas',
  'Constantia',
  'Corbel',
  'Courier New',
  'Franklin Gothic Medium',
  'Gadugi',
  'Georgia',
  'Impact',
  'Lucida Console',
  'Lucida Sans Unicode',
  'Microsoft Sans Serif',
  'Palatino Linotype',
  'Segoe Print',
  'Segoe Script',
  'Segoe UI',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
];

let familyResolverPromise = null;
let familyResolverCache = null;

function uniqueFamilies(values) {
  const seen = new Set();
  const result = [];
  for (const raw of values || []) {
    const family = String(raw || '').trim();
    if (!family) continue;
    const key = family.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(family);
  }
  return result;
}

function sortFamilies(values) {
  return [...values].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function familiesFromLocalFonts(fonts) {
  if (!Array.isArray(fonts)) return [];
  return uniqueFamilies(
    fonts.map((item) => {
      if (!item || typeof item !== 'object') return '';
      return item.family || item.postscriptName || '';
    }),
  );
}

async function tryQueryLocalFonts() {
  if (typeof window === 'undefined' || typeof window.queryLocalFonts !== 'function') {
    return null;
  }
  try {
    const fonts = await window.queryLocalFonts();
    const families = familiesFromLocalFonts(fonts);
    return families.length ? sortFamilies(families) : null;
  } catch {
    return null;
  }
}

function tryCanvasDetection() {
  if (typeof document === 'undefined') {
    return null;
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  const probeText = 'mmmmmmmmmmlliOO00AaBbYyZz';
  const baseFamilies = ['monospace', 'serif', 'sans-serif'];
  const baseWidths = {};
  baseFamilies.forEach((baseFamily) => {
    ctx.font = `32px ${baseFamily}`;
    baseWidths[baseFamily] = ctx.measureText(probeText).width;
  });

  const available = AGENDA_FONT_CANDIDATE_FAMILIES.filter((family) =>
    baseFamilies.some((baseFamily) => {
      ctx.font = `32px '${family}', ${baseFamily}`;
      const width = ctx.measureText(probeText).width;
      return Math.abs(width - baseWidths[baseFamily]) > 0.1;
    }),
  );

  return available.length ? sortFamilies(uniqueFamilies(available)) : null;
}

export async function resolveAgendaFontFamilies() {
  if (familyResolverCache) {
    return familyResolverCache.slice();
  }
  if (!familyResolverPromise) {
    familyResolverPromise = (async () => {
      const localFonts = await tryQueryLocalFonts();
      if (localFonts && localFonts.length) {
        return localFonts;
      }

      const detected = tryCanvasDetection();
      if (detected && detected.length) {
        return detected;
      }

      return AGENDA_FONT_FALLBACK_FAMILIES.slice();
    })()
      .then((families) => {
        familyResolverCache = uniqueFamilies(families).length ? uniqueFamilies(families) : AGENDA_FONT_FALLBACK_FAMILIES.slice();
        return familyResolverCache.slice();
      })
      .catch(() => {
        familyResolverCache = AGENDA_FONT_FALLBACK_FAMILIES.slice();
        return familyResolverCache.slice();
      });
  }

  return familyResolverPromise.then((families) => families.slice());
}

export function getAgendaFontFallbackFamilies() {
  return AGENDA_FONT_FALLBACK_FAMILIES.slice();
}

export function resolveAgendaFontFamilyFromQuery(query, families, fallbackFamily = AGENDA_FONT_FALLBACK_FAMILIES[0]) {
  const normalized = String(query || '').trim().toLowerCase();
  const sourceFamilies = Array.isArray(families) && families.length ? families : AGENDA_FONT_FALLBACK_FAMILIES;
  if (!normalized) {
    return fallbackFamily || sourceFamilies[0] || AGENDA_FONT_FALLBACK_FAMILIES[0];
  }
  return (
    sourceFamilies.find((family) => String(family).toLowerCase().startsWith(normalized)) ||
    sourceFamilies.find((family) => String(family).toLowerCase().includes(normalized)) ||
    fallbackFamily ||
    sourceFamilies[0] ||
    AGENDA_FONT_FALLBACK_FAMILIES[0]
  );
}

export function filterAgendaFontFamilies(query, families) {
  const normalized = String(query || '').trim().toLowerCase();
  const sourceFamilies = Array.isArray(families) && families.length ? families : AGENDA_FONT_FALLBACK_FAMILIES;
  if (!normalized) {
    return sourceFamilies.slice();
  }
  return sourceFamilies.filter((family) => String(family).toLowerCase().includes(normalized));
}
