import assert from 'node:assert/strict';
import test from 'node:test';
import { decodeLegacyDocumentForEditor, detectLegacyDocumentFormat, getImportSafety, safeRoundtripCheck, LEGACY_DOCUMENT_FORMATS } from '../src/features/editorTextos/models/LegacyDocumentFormatDetector.js';

test('detecta HTML, HTML escaped e token legado', async () => {
  assert.equal(detectLegacyDocumentFormat({ content: '<p>ok</p>' }).format, LEGACY_DOCUMENT_FORMATS.HTML);
  const escaped = detectLegacyDocumentFormat({ content: '&lt;p&gt;ok&lt;/p&gt;' });
  assert.equal(escaped.format, LEGACY_DOCUMENT_FORMATS.ESCAPED_HTML);
  assert.equal(decodeLegacyDocumentForEditor('&lt;p&gt;ok&lt;/p&gt;', escaped), '<p>ok</p>');
  assert.equal(detectLegacyDocumentFormat({ content: '[[IMGDATA:data:image/png;base64,abc=|w=10|h=10]]' }).format, LEGACY_DOCUMENT_FORMATS.LEGACY_TOKENIZED_HTML);
});

test('protege RTF e desconhecido, sem enviar conteúdo cru ao Tiptap', () => {
  for (const content of ['{\\rtf1\\ansi texto}', `${String.fromCharCode(0)}${String.fromCharCode(1)}conteudo`]) {
    const detection = detectLegacyDocumentFormat({ content });
    const safety = getImportSafety(detection);
    assert.equal(safety.editable, false);
    assert.equal(safety.resaveAllowed, false);
  }
});

test('converte texto simples preservando quebras como parágrafos', () => {
  const detection = detectLegacyDocumentFormat({ content: 'Linha 1\nLinha 2', fileExtension: '.txt' });
  assert.equal(detection.format, LEGACY_DOCUMENT_FORMATS.PLAIN_TEXT);
  assert.equal(decodeLegacyDocumentForEditor('Linha 1\nLinha 2', detection), '<p>Linha 1</p><p>Linha 2</p>');
});

test('classifica roundtrip semântico e detecta perda de schema material', () => {
  assert.equal(safeRoundtripCheck({ sourceHtml: '<p>Texto <strong>forte</strong></p>', exportedHtml: '<p>Texto <strong>forte</strong></p>' }).safe, true);
  assert.equal(safeRoundtripCheck({ sourceHtml: '[[IMGDATA:data:image/png;base64,abc=|w=10|h=10]]', exportedHtml: '<img src="data:image/png;base64,abc=" width="10" height="10">', serializedLegacyHtml: '[[IMGDATA:data:image/png;base64,abc=|w=10|h=10]]' }).safe, true);
  const unsafe = safeRoundtripCheck({ sourceHtml: '<h1>Título</h1><table><tr><td>Valor</td></tr></table>', exportedHtml: '<p>Título</p><p>Valor</p>' });
  assert.equal(unsafe.safe, false);
  assert.deepEqual(unsafe.lostFeatures.sort(), ['h1: 1 → 0', 'table: 1 → 0']);
});

test('compara quebras de linha por semântica editorial', () => {
  assert.equal(safeRoundtripCheck({ sourceHtml: '<p>Linha 1<br>Linha 2</p>', exportedHtml: '<p>Linha 1</p><p>Linha 2</p>' }).safe, true);
  assert.equal(safeRoundtripCheck({ sourceHtml: '<p>Linha 1<br><br>Linha 3</p>', exportedHtml: '<p>Linha 1</p><p></p><p>Linha 3</p>' }).safe, true);
  assert.equal(safeRoundtripCheck({ sourceHtml: '<p>Linha 1<br>Linha 2</p>', exportedHtml: '<p>Linha 1Linha 2</p>' }).safe, false);
  assert.equal(safeRoundtripCheck({ sourceHtml: '<p>Linha<br></p>', exportedHtml: '<p>Linha</p>' }).safe, true);
});
