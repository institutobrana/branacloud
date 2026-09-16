import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const clipboard = fs.readFileSync(new URL('../src/features/editorTextos/adapters/EditorClipboardAdapter.js', import.meta.url), 'utf8');
const indent = fs.readFileSync(new URL('../src/features/editorTextos/extensions/ParagraphIndentExtension.js', import.meta.url), 'utf8');
const tab = fs.readFileSync(new URL('../src/features/editorTextos/extensions/InlineTabExtension.js', import.meta.url), 'utf8');

test('clipboard interno captura HTML serializado pelo schema', () => {
  assert.match(clipboard, /DOMSerializer\.fromSchema\(editor\.schema\)/);
  assert.match(clipboard, /internalClipboard = \{ html, text \}/);
});
test('paste interno reinsere o HTML preservando attrs', () => {
  assert.match(clipboard, /if \(internalClipboard\)/);
  assert.match(clipboard, /insertContent\(internalClipboard\.html\)/);
});
test('schema renderiza margin-left', () => assert.match(indent, /margin-left: \$\{finiteIndent\(attrs\.leftIndentPx\)\}px/));
test('schema renderiza margin-right', () => assert.match(indent, /margin-right: \$\{finiteIndent\(attrs\.rightIndentPx\)\}px/));
test('schema renderiza text-indent', () => assert.match(indent, /text-indent: \$\{finiteIndent\(attrs\.firstLineIndentPx\)\}px/));
test('first-line negativo não é zerado', () => assert.match(indent, /Number\.isFinite\(numeric\) \? Math\.round\(numeric\) : 0/));
test('os três attrs são parseados do CSS', () => {
  assert.match(indent, /element\.style\.marginLeft/);
  assert.match(indent, /element\.style\.marginRight/);
  assert.match(indent, /element\.style\.textIndent/);
});
test('cut usa copy antes de remover seleção', () => {
  assert.match(clipboard, /await this\.copy\(\);[\s\S]*deleteSelection/);
});
test('InlineTab permanece serializável no clipboard HTML', () => assert.match(tab, /DOMSerializer|renderHTML|editor-textos-inline-tab/));
test('clipboard não possui tratamento específico de listas experimentais', () => assert.doesNotMatch(clipboard, /rootIndentPx|sinkListItem|liftListItem/));

console.log('CLIPBOARD INDENT TESTS PASS: 10/10');
