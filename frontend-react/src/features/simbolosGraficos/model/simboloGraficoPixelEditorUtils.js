export const PIXEL_EDITOR_SIZE = 15;

export function createEmptyPixelMatrix(size = PIXEL_EDITOR_SIZE) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => false));
}

export function clonePixelMatrix(matrix) {
  return Array.isArray(matrix) ? matrix.map((row) => (Array.isArray(row) ? row.map(Boolean) : [])) : createEmptyPixelMatrix();
}

export function togglePixel(matrix, row, col, active) {
  const next = clonePixelMatrix(matrix);
  if (!next[row] || typeof next[row][col] === 'undefined') return next;
  next[row][col] = Boolean(active);
  return next;
}

export function clearPixelMatrix(size = PIXEL_EDITOR_SIZE) {
  return createEmptyPixelMatrix(size);
}

export function countActivePixels(matrix) {
  return (Array.isArray(matrix) ? matrix : []).reduce((acc, row) => acc + (Array.isArray(row) ? row.filter(Boolean).length : 0), 0);
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
      const on = Boolean(cells[row]?.[col]);
      data[idx] = 0;
      data[idx + 1] = 0;
      data[idx + 2] = 0;
      data[idx + 3] = on ? 255 : 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

export async function dataUrlToPixelMatrix(dataUrl, size = PIXEL_EDITOR_SIZE, alphaThreshold = 16) {
  const raw = String(dataUrl || '').trim();
  if (!raw) return createEmptyPixelMatrix(size);

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Imagem invalida.'));
    img.src = raw;
  });

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return createEmptyPixelMatrix(size);
  ctx.clearRect(0, 0, size, size);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0, size, size);
  const imageData = ctx.getImageData(0, 0, size, size).data;
  const matrix = createEmptyPixelMatrix(size);

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const idx = (row * size + col) * 4;
      matrix[row][col] = imageData[idx + 3] > alphaThreshold;
    }
  }

  return matrix;
}
