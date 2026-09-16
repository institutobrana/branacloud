import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const pagePath = new URL('../src/features/editorTextos/EditorTextosPage.jsx', import.meta.url);
const source = fs.readFileSync(pagePath, 'utf8');

test('T3A registers only official table nodes in the real editor registry', () => {
  assert.match(source, /import\s+\{\s*Table,\s*TableRow,\s*TableHeader,\s*TableCell\s*\}\s+from\s+'@tiptap\/extension-table'/);
  assert.match(source, /Table\.configure\(\{\s*resizable:\s*false,\s*allowTableNodeSelection:\s*true\s*\}\)/s);
  for (const node of ['TableRow', 'TableHeader', 'TableCell']) assert.match(source, new RegExp(`\\b${node}\\b`));
  assert.doesNotMatch(source, /(?:Table|TableRow|TableHeader|TableCell)\.extend\(/);
  assert.match(source, /Table\.configure[\s\S]*TableRow[\s\S]*TableHeader[\s\S]*TableCell[\s\S]*UndoRedo/);
});
