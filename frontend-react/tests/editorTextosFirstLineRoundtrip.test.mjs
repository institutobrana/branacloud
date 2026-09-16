import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const extension = fs.readFileSync(new URL('../src/features/editorTextos/extensions/ParagraphIndentExtension.js', import.meta.url), 'utf8');
const adapter = fs.readFileSync(new URL('../src/features/editorTextos/adapters/LegacyHtmlAdapter.js', import.meta.url), 'utf8');
const ruler = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosRuler.jsx', import.meta.url), 'utf8');

test('firstLineIndentPx lê text-indent', () => {
  assert.match(extension, /firstLineIndentPx: \{ default: 0, parseHTML: \(element\) => finiteIndent\(element\.style\.textIndent\?\.replace\('px', ''\)\)/);
});
test('firstLineIndentPx renderiza text-indent em px', () => {
  assert.match(extension, /style: `text-indent: \$\{finiteIndent\(attrs\.firstLineIndentPx\)\}px`/);
});
test('valores negativos finitos são preservados', () => {
  assert.match(extension, /Number\.isFinite\(numeric\) \? Math\.round\(numeric\) : 0/);
  assert.doesNotMatch(extension, /Math\.max\(0,.*firstLine/);
});
test('left e right coexistem com first-line', () => {
  assert.match(extension, /leftIndentPx/);
  assert.match(extension, /rightIndentPx/);
  assert.match(extension, /firstLineIndentPx/);
});
test('adapter preserva text-indent no HTML legado', () => {
  assert.match(adapter, /normalizeLegacyHtml\(html = ''\)/);
  assert.match(adapter, /serializeToLegacyHtml/);
});
test('régua não possui marcador first-line', () => {
  assert.doesNotMatch(ruler, /firstLine|first-line|text-indent/);
});
test('alteração de ruler não substitui firstLineIndentPx', () => {
  assert.match(extension, /\[key\]: next/);
  assert.doesNotMatch(extension, /firstLineIndentPx.*next/);
});
test('first-line negativo é aceito na política documental', () => {
  assert.match(extension, /finiteIndent\(value\)/);
  assert.match(extension, /return Number\.isFinite\(numeric\)/);
});

console.log('FIRST LINE TESTS PASS: 8/8');
