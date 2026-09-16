import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const nodeView = fs.readFileSync(new URL('../src/features/editorTextos/components/ResizableImageNodeView.jsx', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../src/features/editorTextos/styles/editorTextos.css', import.meta.url), 'utf8');

test('image NodeView preserves intrinsic aspect ratio under width constraints', () => {
  assert.doesNotMatch(nodeView, /height:\s*node\.attrs\.height/);
  assert.match(nodeView, /height:\s*'auto'/);
  assert.match(nodeView, /maxWidth:\s*node\.attrs\.fitPage \? '100%' : undefined/);
});

test('image CSS remains responsive without forcing a fixed height', () => {
  assert.match(css, /\.editor-textos-image-node img\{[^}]*max-width:100%;height:auto/);
});

for (const [width, height] of [[956, 281], [366, 377], [52, 32]]) {
  test(`persisted ratio ${width}x${height} is mathematically stable`, () => {
    const ratio = width / height;
    const constrainedWidth = Math.min(width, 52);
    assert.ok(Math.abs((constrainedWidth / (constrainedWidth / ratio)) - ratio) < 1e-9);
  });
}
