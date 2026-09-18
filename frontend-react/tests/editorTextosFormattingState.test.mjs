import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const adapter = fs.readFileSync(new URL('../src/features/editorTextos/adapters/EditorSelectionAdapter.js', import.meta.url), 'utf8');
const toolbar = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosFormatToolbar.jsx', import.meta.url), 'utf8');

test('F6 coleta formatting values somente no intervalo e por atributo', () => {
  assert.match(adapter, /state\.doc\.nodesBetween\(from, to/);
  assert.match(adapter, /fontFamily: \[\], fontSize: \[\], color: \[\]/);
  assert.match(adapter, /mixedFormatting\(selectionValues\)/);
  assert.match(adapter, /mixedTextStyle/);
  assert.match(adapter, /!node\.text\?\.trim\(\)/);
});

test('F6 publica política Misto independente para Fonte, Tamanho e Cor', () => {
  assert.match(toolbar, /mixed\.fontFamily \? ''/);
  assert.match(toolbar, /mixed\.fontSize \? ''/);
  assert.match(toolbar, /mixed\.color \? null/);
  assert.match(toolbar, /<option value="">Misto<\/option>/);
  assert.match(toolbar, /mixed = false/);
});

test('F6 preserva comandos e valores customizados dos três controles', () => {
  assert.match(toolbar, /execute\('setFontFamily', event\.target\.value\)/);
  assert.match(toolbar, /execute\('setFontSize', event\.target\.value\)/);
  assert.match(toolbar, /execute\('setColor', color\)/);
  assert.match(toolbar, /Cor personalizada/);
});
