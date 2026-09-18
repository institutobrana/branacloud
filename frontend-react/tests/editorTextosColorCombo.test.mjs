import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const toolbar = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosFormatToolbar.jsx', import.meta.url), 'utf8');
const palette = fs.readFileSync(new URL('../src/features/editorTextos/constants/editorTextosColorPalette.js', import.meta.url), 'utf8');

test('paleta Cor contém exatamente as 18 cores na ordem legada', () => {
  const expected = ['Amarelo:#ffff00', 'Azul:#0000ff', 'Azul água:#00e5ef', 'Azul marinho:#000080', 'Branco:#ffffff', 'Cinza:#808080', 'Cinza claro:#d9d9d9', 'Cinza escuro:#666666', 'Lilás:#c61ad9', 'Marrom:#8b4513', 'Prata:#c0c0c0', 'Preto:#000000', 'Roxo:#800080', 'Verde:#008000', 'Verde escuro:#006400', 'Verde limão:#00ff00', 'Verde oliva:#808000', 'Vermelho:#ff0000'];
  const actual = [...palette.matchAll(/\{ label: '([^']+)', value: '(#[0-9a-f]+)' \}/g)].map((match) => `${match[1]}:${match[2]}`);
  assert.deepEqual(actual, expected);
});

test('combo Cor usa swatch, setColor e preserva cor customizada', () => {
  assert.match(toolbar, /ColorCombo/);
  assert.match(toolbar, /execute\('setColor', color\)/);
  assert.match(toolbar, /Cor personalizada/);
  assert.match(toolbar, /editor-textos-color-swatch/);
  assert.match(toolbar, /aria-haspopup="listbox"/);
  assert.match(toolbar, /createPortal/);
  assert.match(toolbar, /document\.body/);
});

test('popup Cor usa overlay fixo acima das superfícies do editor', () => {
  assert.match(toolbar, /className="editor-textos-color-options"[^>]*style=\{\{ left: popupPosition\.left, top: popupPosition\.top \}\}/);
});

test('normaliza rgb para reconhecer a cor ativa da paleta', () => {
  assert.match(toolbar, /normalizeColorValue/);
  assert.match(toolbar, /Number\(part\)\.toString\(16\)/);
});
