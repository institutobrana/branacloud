import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const toolbar = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosFormatToolbar.jsx', import.meta.url), 'utf8');
const dialog = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosMergeFieldDialog.jsx', import.meta.url), 'utf8');

test('F5 captures a ProseMirror selection before opening the dialog', () => {
  assert.match(toolbar, /selection\.from/);
  assert.match(toolbar, /selection\.to/);
  assert.match(toolbar, /isNodeSelection/);
  assert.match(toolbar, /onClick=\{openMergeDialog\}/);
});

test('F5 builds and inserts a plain text token at the saved selection', () => {
  assert.match(toolbar, /const token = `<<\$\{category\}\.\$\{fieldName\}>>`/);
  assert.match(toolbar, /setTextSelection\(\{ from, to \}\)\.insertContent\(token\)\.run\(\)/);
  assert.match(toolbar, /editor\.commands\.focus\(\)/);
});

test('F5 blocks non-text node selections and has no resolver call', () => {
  assert.match(toolbar, /selection\.isNodeSelection/);
  assert.match(toolbar, /if \(!editor \|\| !selection \|\| selection\.isNodeSelection \|\| !fieldName\) return/);
  assert.doesNotMatch(toolbar, /editor-textos\/mesclar/);
  assert.doesNotMatch(dialog, /editor-textos\/mesclar/);
});
