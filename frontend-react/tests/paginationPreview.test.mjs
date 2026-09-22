import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const preview = fs.readFileSync(new URL('../src/features/editorTextos/pagination/preview/PaginatedPreview.jsx', import.meta.url), 'utf8');
const workspace = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosWorkspace.jsx', import.meta.url), 'utf8');

test('preview consumes layout pages and stays read-only', () => {
  assert.match(preview, /layout\.pages\.map/);
  assert.match(preview, /aria-label=\{`Página/);
  assert.match(preview, /contentEditable=\{false\}/);
  assert.doesNotMatch(preview, /dispatchTransaction|insertContent|setContent/);
});

test('workspace has one preview toggle and uses the shared layout', () => {
  assert.match(workspace, /usePaginationAwareness/);
  assert.match(workspace, /<PaginatedPreview layout=\{layout\}/);
  assert.match(workspace, /Visualizar páginas/);
});
