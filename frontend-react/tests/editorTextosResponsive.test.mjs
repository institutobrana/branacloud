import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../src/features/editorTextos/', import.meta.url);
const ruler = fs.readFileSync(new URL('components/EditorTextosRuler.jsx', root), 'utf8');
const workspace = fs.readFileSync(new URL('components/EditorTextosWorkspace.jsx', root), 'utf8');
const styles = fs.readFileSync(new URL('styles/editorTextos.css', root), 'utf8');

test('workspace preserves logical page geometry and scrolls instead of using viewport as source of truth', () => {
  assert.match(styles, /\.editor-textos-workspace[^}]*overflow:\s*auto/);
  assert.match(workspace, /config\.largura_mm\s*\*\s*MM_TO_PX/);
  assert.match(workspace, /config\.altura_mm\s*\*\s*MM_TO_PX/);
  assert.doesNotMatch(workspace, /window\.inner(?:Width|Height)/);
});

test('ruler derives width from PageConfig in document pixels', () => {
  assert.match(ruler, /config\.largura_mm\s*\*\s*\(96\s*\/\s*25\.4\)/);
  assert.match(ruler, /width:\s*`max\(360px,/);
  assert.doesNotMatch(ruler, /window\.inner(?:Width|Height)/);
});

test('ruler uses document-pixel geometry and minimum text width', () => {
  assert.match(ruler, /const MIN_TEXT_WIDTH_PX\s*=\s*24/);
  assert.match(ruler, /usefulPx\s*=\s*Math\.max\(MIN_TEXT_WIDTH_PX/);
  assert.match(ruler, /clientX\s*-\s*rect\.left/);
});

test('viewport changes do not dispatch document mutations', () => {
  assert.doesNotMatch(ruler, /addEventListener\(['"]resize/);
  assert.doesNotMatch(workspace, /addEventListener\(['"]resize/);
  assert.doesNotMatch(ruler, /setIndentValue|setRulerIndent/);
  assert.doesNotMatch(workspace, /setIndentValue|setRulerIndent/);
});

test('both handles remain semantic sliders with dynamic values', () => {
  assert.match(ruler, /role="slider"/g);
  assert.match(ruler, /aria-label="Recuo esquerdo"/);
  assert.match(ruler, /aria-label="Recuo direito"/);
  assert.match(ruler, /aria-valuemin=/g);
  assert.match(ruler, /aria-valuemax=/g);
  assert.match(ruler, /aria-valuenow=/g);
});

test('responsive layout does not introduce a second list architecture', () => {
  assert.doesNotMatch(ruler, /rootIndentPx|BulletList\.extend|OrderedList\.extend/);
  assert.doesNotMatch(workspace, /rootIndentPx|BulletList\.extend|OrderedList\.extend/);
});
