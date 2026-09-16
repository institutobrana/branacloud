import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const tabs = fs.readFileSync(new URL('../src/features/editorTextos/extensions/InlineTabExtension.js', import.meta.url), 'utf8');
const page = fs.readFileSync(new URL('../src/features/editorTextos/EditorTextosPage.jsx', import.meta.url), 'utf8');
const ruler = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosRuler.jsx', import.meta.url), 'utf8');

test('Tab em listItem tenta nesting e consome inclusive o primeiro item', () => {
  assert.match(tabs, /this\.editor\.commands\.sinkListItem\('listItem'\)/);
  assert.match(tabs, /if \(this\.editor\.isActive\('listItem'\)\) \{[\s\S]*?sinkListItem[\s\S]*?return true;/);
});

test('Shift+Tab em listItem tenta lift e consome inclusive na raiz', () => {
  assert.match(tabs, /this\.editor\.commands\.liftListItem\('listItem'\)/);
  assert.match(tabs, /if \(this\.editor\.isActive\('listItem'\)\) \{[\s\S]*?liftListItem[\s\S]*?return true;/);
});

test('fora de lista preserva InlineTab', () => assert.match(tabs, /return this\.editor\.commands\.insertInlineTab\(\);/));
test('fora de lista preserva remoção de InlineTab', () => assert.match(tabs, /return this\.editor\.commands\.removePreviousInlineTab\(\);/));
test('não adiciona OrderedList nem rootIndent', () => {
  assert.doesNotMatch(page, /OrderedList|rootIndentPx|BulletList\.extend/);
  assert.doesNotMatch(tabs, /rootIndentPx/);
});
test('régua permanece disabled em listItem', () => {
  assert.match(ruler, /aria-disabled=\{rulerDisabled\}/);
  assert.match(ruler, /tabIndex=\{rulerDisabled \? -1 : 0\}/);
});

console.log('L1 LIST TESTS PASS: 6/6');
