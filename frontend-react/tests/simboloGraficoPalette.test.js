import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SIMBOLO_GRAFICO_PALETTE,
  SIMBOLO_GRAFICO_PALETTE_LIGHT_COLORS,
} from '../src/features/simbolosGraficos/model/simboloGraficoPalette.js';

test('Paleta do editor de simbolos graficos replica a referencia de 44 cores', () => {
  assert.equal(SIMBOLO_GRAFICO_PALETTE.length, 44);
  assert.deepEqual(SIMBOLO_GRAFICO_PALETTE.slice(0, 10), [
    '#FFFF00',
    '#FFFF99',
    '#0000FF',
    '#666699',
    '#3366FF',
    '#000078',
    '#000080',
    '#99CCFF',
    '#003366',
    '#00CCFF',
  ]);
  assert.equal(SIMBOLO_GRAFICO_PALETTE.at(-1), '#800000');
  assert.equal(SIMBOLO_GRAFICO_PALETTE.at(-2), '#FF0000');
  assert.deepEqual([...SIMBOLO_GRAFICO_PALETTE_LIGHT_COLORS], [
    '#FFFFFF',
    '#FFFF99',
    '#CCFFFF',
    '#CC99FF',
    '#C0C0C0',
    '#FFCC99',
    '#FF99CC',
    '#99CCFF',
    '#FFCC00',
    '#33CCCC',
  ]);
});
