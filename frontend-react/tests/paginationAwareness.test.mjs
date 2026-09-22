import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPaginationLayoutState } from '../src/features/editorTextos/pagination/engine/paginationEngine.js';
import { pageForPosition, selectionPageRange } from '../src/features/editorTextos/pagination/mapping/positionMapping.js';

function fakeDoc(text) { return { descendants(callback) { callback({ type: { name: 'paragraph' }, textContent: text }, 0); } }; }

test('pagination layout is derived and maps positions to pages', () => {
  global.document = { createElement: () => ({ getContext: () => ({ font: '', measureText: (value) => ({ width: value.length * 8 }) }) }) };
  const layout = buildPaginationLayoutState({ doc: fakeDoc('alpha '.repeat(200)), pageConfig: { largura_mm: 100, altura_mm: 100, margem_superior_mm: 10, margem_esquerda_mm: 10, margem_direita_mm: 10 }, documentVersion: 1, configVersion: 1, layoutVersion: 1 });
  assert.ok(layout.pageCount > 1);
  assert.equal(layout.accuracy, 'EXACT');
  assert.equal(pageForPosition(layout, layout.pmPositionMap.at(-1).from), layout.pageCount);
  assert.deepEqual(selectionPageRange(layout, { from: 1, to: layout.pmPositionMap.at(-1).to }), [1, layout.pageCount]);
});

test('unsupported nodes produce diagnostics without throwing', () => {
  global.document = { createElement: () => ({ getContext: () => ({ font: '', measureText: (value) => ({ width: value.length * 8 }) }) }) };
  const layout = buildPaginationLayoutState({ doc: { descendants(callback) { callback({ type: { name: 'image' }, isText: false, textContent: '' }, 0); } }, pageConfig: {}, documentVersion: 1, configVersion: 1, layoutVersion: 1 });
  assert.equal(layout.accuracy, 'ESTIMATED');
  assert.deepEqual(layout.diagnostics, ['unsupported-node']);
});
