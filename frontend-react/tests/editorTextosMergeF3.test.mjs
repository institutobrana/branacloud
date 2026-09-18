import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const toolbar = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosFormatToolbar.jsx', import.meta.url), 'utf8');
const dialog = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosMergeFieldDialog.jsx', import.meta.url), 'utf8');
const api = fs.readFileSync(new URL('../src/features/editorTextos/api/editorTextosApi.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/features/editorTextos/styles/editorTextos.css', import.meta.url), 'utf8');

test('F3 removes placeholder and adds the merge button/dialog', () => {
  assert.match(toolbar, /EditorTextosMergeFieldDialog/);
  assert.match(toolbar, /Campo de mesclagem/);
  assert.doesNotMatch(toolbar, /aria-label="Campo de mesclagem"[^>]*disabled/);
  assert.match(dialog, /Insere campo de mesclagem/);
});

test('F3 consumes the real catalog and renders API-driven categories/table', () => {
  assert.match(api, /\/editor-textos\/campos/);
  assert.match(dialog, /listMergeFields/);
  assert.match(dialog, /categoria_padrao/);
  assert.match(dialog, /<th>Campo<\/th>/);
  assert.match(dialog, /<th>Descrição<\/th>/);
  assert.match(dialog, /Carregando campos/);
  assert.match(dialog, /role="alert"/);
  assert.match(dialog, /disabled=\{!rows\.length\}[^>]*>Ok/);
  assert.match(css, /max-height:280px;overflow:auto/);
});

test('F3 does not insert tokens or call the resolver', () => {
  assert.doesNotMatch(dialog, /editor-textos\/mesclar|insertContent|insertText/);
});
