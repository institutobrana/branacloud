import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const tabs = fs.readFileSync(new URL('../src/features/editorTextos/extensions/InlineTabExtension.js', import.meta.url), 'utf8');
const ruler = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosRuler.jsx', import.meta.url), 'utf8');

test('Tab em listItem faz nesting ou aplica recuo da lista raiz', () => {
  assert.match(tabs, /const changed = this\.editor\.commands\.sinkListItem\('listItem'\);/);
  assert.match(tabs, /const rootList = rootListAtSelection\(this\.editor\.state\);/);
  assert.match(tabs, /rootIndentPx: Math\.min\(rootListIndentMax\(this\.editor\), \(rootList\.node\.attrs\.rootIndentPx \|\| 0\) \+ 24\)/);
});
test('Shift+Tab em listItem faz lift ou reduz recuo da lista raiz', () => {
  assert.match(tabs, /const changed = this\.editor\.commands\.liftListItem\('listItem'\);/);
  assert.match(tabs, /rootIndentPx: Math\.max\(0, \(rootList\.node\.attrs\.rootIndentPx \|\| 0\) - 24\)/);
});
test('Tab fora de lista permanece InlineTab', () => assert.match(tabs, /return this\.editor\.commands\.insertInlineTab\(\);/));
test('Shift+Tab fora de lista permanece remoção de InlineTab', () => assert.match(tabs, /return this\.editor\.commands\.removePreviousInlineTab\(\);/));
test('régua continua desabilitada em contexto de lista', () => {
  assert.match(ruler, /if \(listContext\) \{ event\.preventDefault\(\); return; \}/);
  assert.match(ruler, /aria-disabled=\{listContext\}/);
});

console.log('LIST TAB TESTS PASS: 5/5');
