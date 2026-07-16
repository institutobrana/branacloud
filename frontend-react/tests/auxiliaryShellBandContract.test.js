import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const globalsPath = path.resolve('src/styles/globals.css');
const globalsSource = fs.readFileSync(globalsPath, 'utf8');

test('auxiliary-shell-band nao recoloca o divisor inferior interno', () => {
  const blockMatch = globalsSource.match(/\.auxiliary-shell-band\s*\{[\s\S]*?\n\}/);
  assert.ok(blockMatch, 'bloco .auxiliary-shell-band nao encontrado');
  assert.match(blockMatch[0], /box-shadow:\s*none;/);
  assert.doesNotMatch(blockMatch[0], /inset 0 -1px 0 var\(--brana-divider\)/);
});
