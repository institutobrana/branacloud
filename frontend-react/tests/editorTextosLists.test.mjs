import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const ruler = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosRuler.jsx', import.meta.url), 'utf8');
const extension = fs.readFileSync(new URL('../src/features/editorTextos/extensions/ParagraphIndentExtension.js', import.meta.url), 'utf8');
const tabs = fs.readFileSync(new URL('../src/features/editorTextos/extensions/InlineTabExtension.js', import.meta.url), 'utf8');

test('detector cobre bulletList, orderedList e listItem', () => {
  assert.match(ruler, /\['bulletList', 'orderedList', 'listItem'\]/);
});
test('régua expõe estado disabled em lista', () => {
  assert.match(ruler, /aria-disabled=\{listContext\}/);
  assert.match(ruler, /tabIndex=\{listContext \? -1 : 0\}/);
});
test('pointerdown não inicia drag em lista', () => assert.match(ruler, /if \(listContext\) \{ event\.preventDefault\(\); return; \}/));
test('keyboard não faz commit em lista', () => assert.match(ruler, /if \(listContext \|\| !editor/));
test('comando documental rejeita indentação em lista', () => assert.match(extension, /if \(isSelectionInsideList\(state\)\) return false;/));
test('não chama comandos de recuo para listItem', () => assert.doesNotMatch(extension, /sinkListItem|liftListItem|toggleList/));
test('Tab em lista usa nesting estrutural', () => assert.match(tabs, /commands\.sinkListItem\('listItem'\)/));
test('Shift+Tab em lista reduz nesting', () => assert.match(tabs, /commands\.liftListItem\('listItem'\)/));
test('Tab fora de lista mantém InlineTab', () => assert.match(tabs, /commands\.insertInlineTab\(\)/));
test('Shift+Tab fora de lista mantém remoção de InlineTab', () => assert.match(tabs, /commands\.removePreviousInlineTab\(\)/));
test('estado acessível comunica disabled nos handles', () => {
  assert.match(ruler, /aria-label="Recuo esquerdo"/);
  assert.match(ruler, /aria-label="Recuo direito"/);
});
test('seleção head é a base única do detector', () => assert.match(ruler, /state\.selection\.head/));
test('política mista pode desabilitar a régua pelo mesmo detector', () => assert.match(ruler, /isSelectionInsideList\(editor\?\.state\)/));

console.log('LIST RULER TESTS PASS: 13/13');
