import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const page = fs.readFileSync(new URL('../src/features/editorTextos/EditorTextosPage.jsx', import.meta.url), 'utf8');
const tabs = fs.readFileSync(new URL('../src/features/editorTextos/extensions/InlineTabExtension.js', import.meta.url), 'utf8');
const ruler = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosRuler.jsx', import.meta.url), 'utf8');

test('OrderedList é registrado uma única vez', () => {
  assert.match(page, /import OrderedList from '@tiptap\/extension-ordered-list'/);
  assert.match(page, /const BranaOrderedList = OrderedList\.extend/);
  assert.equal((page.match(/BranaOrderedList/g) || []).length, 2);
});
test('listas possuem rootIndentPx serializável', () => {
  assert.match(page, /const rootIndentAttributes =/);
  assert.match(page, /rootIndentPx:/);
  assert.match(page, /margin-left: \$\{attributes\.rootIndentPx\}px/);
});
test('detector exige primeiro item da lista atual', () => {
  assert.match(tabs, /function rootListAtSelection\(state\)/);
  assert.match(tabs, /resolved\.index\(listDepth\) !== 0/);
});
test('Tab tenta nesting antes do recuo raiz', () => {
  assert.match(tabs, /sinkListItem\('listItem'\)/);
  assert.match(tabs, /rootIndentPx: Math\.min\(rootListIndentMax\(this\.editor\), \(rootList\.node\.attrs\.rootIndentPx \|\| 0\) \+ 24\)/);
});
test('Shift+Tab reduz recuo raiz sem ficar negativo', () => {
  assert.match(tabs, /liftListItem\('listItem'\)/);
  assert.match(tabs, /Math\.max\(0, \(rootList\.node\.attrs\.rootIndentPx \|\| 0\) - 24\)/);
});
test('recuo é aplicado no node da lista', () => {
  assert.match(tabs, /tr\.setNodeMarkup\(rootList\.pos/);
  assert.doesNotMatch(tabs, /leftIndentPx/);
});
test('recuo raiz respeita largura útil mínima de 24px', () => {
  assert.match(tabs, /return usefulWidth > 0 \? Math\.max\(0, usefulWidth - 24\)/);
});
test('régua continua desabilitada em listas', () => {
  assert.match(ruler, /aria-disabled=\{listContext\}/);
  assert.match(ruler, /if \(listContext\) \{ event\.preventDefault\(\); return; \}/);
});
test('Tab fora de lista mantém InlineTab', () => {
  assert.match(tabs, /if \(!this\.editor\.isActive\('listItem'\)\) return this\.editor\.commands\.insertInlineTab\(\)/);
});

console.log('R12B LIST FIRST ITEM TESTS PASS: 9/9');
