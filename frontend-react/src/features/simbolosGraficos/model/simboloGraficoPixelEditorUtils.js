export const SIMBOLO_GRAFICO_EDITOR_SIZE = 24;
export const PIXEL_EDITOR_SIZE = SIMBOLO_GRAFICO_EDITOR_SIZE;

const BLACK_PIXEL = '#111111';

export function normalizePixelValue(value) {
  if (value === false || value === null || typeof value === 'undefined') return null;
  if (value === true) return BLACK_PIXEL;
  const normalized = String(value || '').trim();
  if (!normalized) return null;
  return normalized;
}

export function isPixelActive(value) {
  return normalizePixelValue(value) !== null;
}

export function createEmptyPixelMatrix(size = PIXEL_EDITOR_SIZE) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

export function clonePixelMatrix(matrix) {
  return Array.isArray(matrix)
    ? matrix.map((row) => (Array.isArray(row) ? row.map((cell) => normalizePixelValue(cell)) : []))
    : createEmptyPixelMatrix();
}

export function togglePixel(matrix, row, col, activeOrColor) {
  const next = clonePixelMatrix(matrix);
  if (!next[row] || typeof next[row][col] === 'undefined') return next;
  next[row][col] = normalizePixelValue(activeOrColor);
  return next;
}

export function clearPixelMatrix(size = PIXEL_EDITOR_SIZE) {
  return createEmptyPixelMatrix(size);
}

export function countActivePixels(matrix) {
  return (Array.isArray(matrix) ? matrix : []).reduce(
    (acc, row) => acc + (Array.isArray(row) ? row.filter((cell) => normalizePixelValue(cell) !== null).length : 0),
    0,
  );
}

export function isActiveSourcePixel(r, g, b, a, alphaThreshold = 16, whiteThreshold = 245, chromaThreshold = 12) {
  if (!Number.isFinite(a) || a <= alphaThreshold) return false;
  if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) return false;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const nearWhite = r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold;
  const lowChroma = max - min <= chromaThreshold;
  if (nearWhite && lowChroma) return false;

  return true;
}

function createImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Imagem invalida.'));
    img.src = src;
  });
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => Number(value).toString(16).padStart(2, '0')).join('')}`;
}

export function imageDataToBooleanMatrix(imageData, size = PIXEL_EDITOR_SIZE) {
  const matrix = createEmptyPixelMatrix(size);
  if (!imageData?.data || !Number.isFinite(imageData.width) || !Number.isFinite(imageData.height)) {
    return matrix;
  }

  const width = Math.max(0, Math.floor(Number(imageData.width)));
  const height = Math.max(0, Math.floor(Number(imageData.height)));
  if (!width || !height) return matrix;

  for (let row = 0; row < size; row += 1) {
    const sourceRow = Math.min(height - 1, Math.floor((row + 0.5) * height / size));
    for (let col = 0; col < size; col += 1) {
      const sourceCol = Math.min(width - 1, Math.floor((col + 0.5) * width / size));
      const idx = (sourceRow * width + sourceCol) * 4;
      if (idx + 3 >= imageData.data.length) continue;
      const r = imageData.data[idx];
      const g = imageData.data[idx + 1];
      const b = imageData.data[idx + 2];
      const a = imageData.data[idx + 3];
      matrix[row][col] = isActiveSourcePixel(r, g, b, a) ? BLACK_PIXEL : null;
    }
  }

  return matrix;
}

export async function loadImageSourceToPixelMatrix(source, size = PIXEL_EDITOR_SIZE) {
  if (!source) return createEmptyPixelMatrix(size);
  if (Array.isArray(source)) return clonePixelMatrix(source);

  const raw = String(source || '').trim();
  if (!raw) return createEmptyPixelMatrix(size);

  const image = await createImageElement(raw);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return createEmptyPixelMatrix(size);
  ctx.clearRect(0, 0, size, size);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0, size, size);
  const imageData = ctx.getImageData(0, 0, size, size);
  return imageDataToBooleanMatrix(imageData, size);
}

export function matrixToPngDataUrl(matrix, size = PIXEL_EDITOR_SIZE) {
  const cells = Array.isArray(matrix) ? matrix : createEmptyPixelMatrix(size);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  if (!ctx) return '';

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const idx = (row * size + col) * 4;
      const pixel = normalizePixelValue(cells[row]?.[col]);
      if (!pixel) {
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 0;
        continue;
      }

      let r = 0;
      let g = 0;
      let b = 0;
      if (pixel.startsWith('#') && pixel.length === 7) {
        r = Number.parseInt(pixel.slice(1, 3), 16);
        g = Number.parseInt(pixel.slice(3, 5), 16);
        b = Number.parseInt(pixel.slice(5, 7), 16);
      }
      data[idx] = Number.isFinite(r) ? r : 0;
      data[idx + 1] = Number.isFinite(g) ? g : 0;
      data[idx + 2] = Number.isFinite(b) ? b : 0;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

export async function dataUrlToPixelMatrix(dataUrl, size = PIXEL_EDITOR_SIZE, alphaThreshold = 16) {
  const matrix = await loadImageSourceToPixelMatrix(dataUrl, size);
  return Array.isArray(matrix) ? matrix : createEmptyPixelMatrix(size);
}
