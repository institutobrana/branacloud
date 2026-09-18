import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const toolbar = fs.readFileSync(new URL('../src/features/editorTextos/components/EditorTextosFormatToolbar.jsx', import.meta.url), 'utf8');
const helper = fs.readFileSync(new URL('../src/features/relatoriosConfiguracao/constants/localFontCandidates.js', import.meta.url), 'utf8');

test('combo Fonte usa a infraestrutura F2 e não consulta no mount', () => {
  assert.match(toolbar, /loadLocalFontFamilies/);
  assert.match(toolbar, /onFocus=\{ensureFontsLoaded\}/);
  const mountEffect = toolbar.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/)?.[0] || '';
  assert.doesNotMatch(mountEffect, /loadLocalFontFamilies/);
  assert.match(toolbar, /onChange=\{\(event\) => execute\('setFontFamily', event\.target\.value\)\}/);
  assert.doesNotMatch(toolbar, /FONT_OPTIONS = \['Tahoma'\]/);
});

test('combo preserva fonte ativa ausente na lista', () => {
  assert.match(toolbar, /active && !result\.families\.includes\(active\)/);
  assert.match(toolbar, /\[active, \.\.\.result\.families\]/);
});

test('combo Tamanho expõe os 12 valores em ordem e usa CSS pt', () => {
  const sizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '36'];
  assert.match(toolbar, /const FONT_SIZE_OPTIONS = \['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '36'\]/);
  assert.match(toolbar, /value=\{`\$\{size\}pt`\}/);
  assert.match(toolbar, /execute\('setFontSize', event\.target\.value\)/);
  assert.equal(sizes.length, 12);
  assert.equal(sizes[3], '11');
});

test('combo Tamanho normaliza active state e preserva tamanho customizado', () => {
  assert.match(toolbar, /normalizeFontSizeValue/);
  assert.match(toolbar, /activeFormats\.textStyle\?\.fontSize/);
  assert.match(toolbar, /\[activeFontSize\.replace\('pt', ''\), \.\.\.FONT_SIZE_OPTIONS\]/);
});

test('Fonte e Cor permanecem fora do escopo do F4', () => {
  assert.match(toolbar, /EDITOR_TEXTOS_COLOR_PALETTE/);
  assert.match(toolbar, /aria-label="Fonte"/);
  assert.match(toolbar, /aria-label="Cor"/);
  assert.match(toolbar, /execute\('setFontFamily', event\.target\.value\)/);
  assert.match(toolbar, /execute\('setColor', color\)/);
});

test('helper F2 mantém consulta por gesto, fallback e cache', () => {
  assert.match(helper, /window\.queryLocalFonts/);
  assert.match(helper, /permissionState = error\?\.name === 'NotAllowedError' \? 'denied'/);
  assert.match(helper, /localFontFamiliesCache/);
  assert.match(helper, /normalizeLocalFontFamilies/);
});
