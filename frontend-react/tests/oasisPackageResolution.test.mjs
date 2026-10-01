import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

test('Brana package resolution exposes the inline textbox operation', async () => {
  globalThis.window = { document: { addEventListener() {}, removeEventListener() {} } };
  const oasis = await import('oasis-editor');
  assert.equal(typeof oasis.createDocument, 'function');
  assert.equal(typeof oasis.createParagraph, 'function');
  const entry = fileURLToPath(import.meta.resolve('oasis-editor'));
  const bundle = fs.readFileSync(path.resolve(path.dirname(entry), 'index-2l6TvXM9.js'), 'utf8');
  assert.match(bundle, /insertInlineTextBox/);
});
