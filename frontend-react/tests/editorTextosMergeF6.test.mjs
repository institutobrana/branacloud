import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const api = fs.readFileSync(new URL('../src/features/editorTextos/api/editorTextosApi.js', import.meta.url), 'utf8');

test('F6 exposes the authenticated resolver with the backend payload contract', () => {
  assert.match(api, /mergeEditorTextContent\(\{ content, patientId = null, surgeonId = null, extras = \{\}, preserveUnresolved = true, mode = 'html' \}\)/);
  assert.match(api, /method: 'POST'/);
  assert.match(api, /'\/editor-textos\/mesclar'/);
  assert.match(api, /conteudo_formato: mode/);
  assert.match(api, /paciente_id: patientId/);
  assert.match(api, /cirurgiao_id: surgeonId/);
  assert.match(api, /preservar_nao_resolvido: preserveUnresolved/);
});

test('F6 sends a copy value and does not edit the Tiptap instance', () => {
  assert.match(api, /String\(content \?\? ''\)/);
  assert.doesNotMatch(api, /setContent|insertContent|deleteSelection|dispatch\(/);
  assert.doesNotMatch(api, /editor-textos-format-command/);
});
