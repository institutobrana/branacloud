import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dialog = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosMergeFieldDialog.jsx', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/features/editorTextos/styles/editorTextos.css', import.meta.url), 'utf8');

test('F4 fixes dialog and table geometry independently of row count', () => {
  assert.match(css, /ant-modal-content\{height:520px/);
  assert.match(css, /height:280px;min-height:280px;max-height:280px;overflow:auto/);
  assert.doesNotMatch(dialog, /fields\.length.*height|height.*fields\.length/);
});

test('F4 implements focus, first-row selection, category reset and keyboard navigation', () => {
  assert.match(dialog, /requestAnimationFrame\(\(\) => categoryRef\.current\?\.focus\(\)\)/);
  assert.match(dialog, /setSelectedIndex\(0\)/);
  assert.match(dialog, /ArrowDown/);
  assert.match(dialog, /ArrowUp/);
  assert.match(dialog, /aria-selected/);
});

test('F4 enables Ok only with fields and still does not insert tokens', () => {
  assert.match(dialog, /disabled=\{!rows\.length\}/);
  assert.match(dialog, /onConfirm\?\.\(\{ category: selectedCategory\.name, field \}\)/);
});
