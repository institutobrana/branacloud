import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const pilot = fs.readFileSync(new URL('../src/features/editorTextos/oasis/OasisEditorPilot.jsx', import.meta.url), 'utf8');

test('signature merge command uses a persistent inline textbox and keeps legacy tokens textual', () => {
  assert.match(pilot, /token === '<<Cirurgião\.AssinaturaDigital>>'/);
  assert.match(pilot, /op: 'insertInlineTextBox'/);
  assert.match(pilot, /target: \{ nodeId: position\.paragraphId \}/);
  assert.match(pilot, /width: 293\.333333/);
  assert.match(pilot, /height: 96/);
  assert.match(pilot, /textBox: \{/);
  assert.match(pilot, /blocks: \[createParagraph\('\'\)\]/);
  assert.match(pilot, /shape: \{/);
  assert.match(pilot, /preset: 'rect'/);
  assert.match(pilot, /borderWidthPt: 0\.75/);
  assert.match(pilot, /brana-signature-\$\{crypto\.randomUUID\(\)\}/);
  assert.match(pilot, /client\.commands\.execute\('insertText', token\)/);
});
