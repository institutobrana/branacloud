export function buildAdminUsersCsvFallbackFileName(date = new Date()) {
  const safeDate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
  return `usuarios-adm-${safeDate.toISOString().slice(0, 10)}.csv`;
}

export function sanitizeAdminUsersCsvFileName(fileName, date = new Date()) {
  const fallback = buildAdminUsersCsvFallbackFileName(date);
  let safeName = String(fileName || '').trim();

  try {
    safeName = decodeURIComponent(safeName);
  } catch {
    safeName = String(fileName || '').trim();
  }

  safeName = safeName
    .split(/[/\\]/)
    .pop()
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[?%*:|"<>]/g, '-')
    .replace(/^\.+/, '')
    .trim();

  if (!safeName || !/\.csv$/i.test(safeName)) {
    return fallback;
  }

  return safeName;
}

export function downloadAdminUsersCsv({ blob, fileName, documentRef = document, urlRef = URL, date = new Date() } = {}) {
  if (!blob || Number(blob.size || 0) <= 0) {
    throw new Error('Arquivo CSV de usuarios vazio.');
  }

  if (!documentRef?.createElement || !urlRef?.createObjectURL || !urlRef?.revokeObjectURL) {
    throw new Error('Download indisponivel neste navegador.');
  }

  const safeName = sanitizeAdminUsersCsvFileName(fileName, date);
  const objectUrl = urlRef.createObjectURL(blob);
  const link = documentRef.createElement('a');
  link.href = objectUrl;
  link.download = safeName;
  link.style.display = 'none';

  try {
    documentRef.body?.appendChild(link);
    link.click();
  } finally {
    link.remove?.();
    urlRef.revokeObjectURL(objectUrl);
  }

  return safeName;
}
