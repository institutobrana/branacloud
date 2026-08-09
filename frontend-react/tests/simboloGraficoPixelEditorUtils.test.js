import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clearPixelMatrix,
  clonePixelMatrix,
  countActivePixels,
  createEmptyPixelMatrix,
  matrixToPngDataUrl,
  normalizePixelValue,
  isPixelActive,
  togglePixel,
} from '../src/features/simbolosGraficos/model/simboloGraficoPixelEditorUtils.js';

test('pixel editor utils normalizam compatibilidade antiga e criam uma matriz 24x24 vazia', () => {
  assert.equal(normalizePixelValue(true), '#111111');
  assert.equal(normalizePixelValue(false), null);
  assert.equal(normalizePixelValue(null), null);
  assert.equal(normalizePixelValue('#ff0000'), '#ff0000');
  assert.equal(isPixelActive(true), true);
  assert.equal(isPixelActive(false), false);
  const matrix = createEmptyPixelMatrix();
  assert.equal(matrix.length, 24);
  assert.equal(matrix.every((row) => Array.isArray(row) && row.length === 24 && row.every((cell) => cell === null)), true);
  assert.equal(countActivePixels(matrix), 0);
});

test('pixel editor utils alternam, clonam e limpam sem mutar a matriz original', () => {
  const base = createEmptyPixelMatrix();
  const filled = togglePixel(base, 2, 3, '#ff0000');
  assert.equal(base[2][3], null);
  assert.equal(filled[2][3], '#ff0000');
  assert.equal(countActivePixels(filled), 1);

  const cloned = clonePixelMatrix(filled);
  assert.deepEqual(cloned, filled);
  const cleared = clearPixelMatrix();
  assert.equal(countActivePixels(cleared), 0);
});

test('pixel editor utils serializam cores no PNG', () => {
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement: () => ({
      width: 0,
      height: 0,
      getContext: () => ({
        createImageData: (width, height) => ({ data: new Uint8ClampedArray(width * height * 4) }),
        putImageData: () => {},
      }),
      toDataURL: () => 'data:image/png;base64,stub',
    }),
  };

  try {
    const matrix = createEmptyPixelMatrix();
    matrix[0][0] = '#ff0000';
    matrix[0][1] = '#0000ff';
    const png = matrixToPngDataUrl(matrix);
    assert.equal(png, 'data:image/png;base64,stub');
  } finally {
    globalThis.document = originalDocument;
  }
});
