export function normalizeAssetUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^(data:|blob:|https?:\/\/)/i.test(raw)) return raw;
  if (raw.startsWith('/api/desktop-assets/Icones/') || raw.startsWith('/api/assets/fichaClinica/')) return raw;
  if (raw.startsWith('/desktop-assets/easy/')) {
    return `/app/assets/easy/${raw.split('/').filter(Boolean).pop() || ''}`;
  }
  if (raw.startsWith('/desktop-assets/Icones/')) {
    return `/api/desktop-assets/Icones/${raw.split('/').filter(Boolean).pop() || ''}`;
  }
  return raw;
}

function resolveImageUrl(item) {
  const imagemUrl = normalizeAssetUrl(item?.imagem_url);
  if (imagemUrl) return imagemUrl;

  const imagemCustom = normalizeAssetUrl(item?.imagem_custom);
  if (imagemCustom) return imagemCustom;

  const icon = String(item?.icone || '').trim();
  if (icon) return normalizeAssetUrl(`/api/desktop-assets/Icones/${icon}`);

  const bitmap1 = String(item?.bitmap1 || '').trim();
  if (bitmap1) return normalizeAssetUrl(`/api/desktop-assets/Icones/${bitmap1}`);

  const bitmap2 = String(item?.bitmap2 || '').trim();
  if (bitmap2) return normalizeAssetUrl(`/api/desktop-assets/Icones/${bitmap2}`);

  const bitmap3 = String(item?.bitmap3 || '').trim();
  if (bitmap3) return normalizeAssetUrl(`/api/desktop-assets/Icones/${bitmap3}`);

  return '';
}

export function mapSimboloGraficoLibraryCatalog(payload) {
  if (!Array.isArray(payload)) return [];

  const seen = new Set();
  const items = [];

  for (const item of payload) {
    const id = Number(item?.id || 0) || 0;
    const codigo = String(item?.codigo || '').trim();
    const nome = String(item?.descricao || item?.nome || '').trim();
    const imageUrl = resolveImageUrl(item);
    if (!id || !codigo || !nome) continue;
    if (seen.has(codigo)) continue;
    seen.add(codigo);
    items.push({
      id,
      codigo,
      nome,
      imageUrl,
      imageAlt: nome,
      source: String(item?.tipo_simbolo === 1 ? 'sistema' : 'usuario'),
    });
  }

  return items;
}
