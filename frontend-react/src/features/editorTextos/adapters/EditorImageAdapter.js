const MAX_BYTES = 4 * 1024 * 1024;
const MIME_TYPES = new Set(['image/bmp', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const EXTENSIONS = new Set(['bmp', 'jpg', 'jpeg', 'png', 'gif', 'webp']);

export function validateImageFile(file) {
  const extension = String(file?.name || '').split('.').pop().toLowerCase();
  if (!file || (!MIME_TYPES.has(String(file.type || '').toLowerCase()) && !EXTENSIONS.has(extension))) throw new Error('Selecione uma imagem BMP, JPG, PNG, GIF ou WEBP.');
  if (Number(file.size || 0) > MAX_BYTES) throw new Error('A imagem excede o limite de 4 MB.');
  return true;
}
export function readFileAsDataUrl(file) {
  validateImageFile(file);
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result || '')); reader.onerror = () => reject(new Error('Não foi possível carregar a imagem.')); reader.readAsDataURL(file); });
}
export function readImageDimensions(src) {
  return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight }); image.onerror = () => reject(new Error('Não foi possível obter as dimensões da imagem.')); image.src = src; });
}
export function calculateInitialSize({ width, height, contentWidth, fitPage = true }) {
  const targetWidth = fitPage ? Math.min(width, Math.max(24, contentWidth)) : width;
  return { width: Math.round(targetWidth), height: Math.round(targetWidth * height / Math.max(1, width)) };
}
