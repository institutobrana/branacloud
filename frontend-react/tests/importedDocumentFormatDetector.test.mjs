import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { detectImportedDocumentFormat, IMPORTED_CONTENT_FORMATS } from '../src/features/editorTextos/oasis/importedDocumentFormatDetector.js';
import { makeOoxmlDocxBytes } from './helpers/ooxmlZipFixture.mjs';

globalThis.DOMParser = new JSDOM('').window.DOMParser;

function file(name, bytes, type = '') {
  const data = Uint8Array.from(bytes);
  return { name, type, size: data.length, async arrayBuffer() { return data.slice().buffer; } };
}

test('plain text requires safely decodable printable content, not an extension or MIME type', async () => {
  const utf8 = await detectImportedDocumentFormat(file('note.txt', new TextEncoder().encode('São José\nAção\n<<Paciente.NomeCompleto>>'), 'text/plain'));
  assert.equal(utf8.detectedFormat, IMPORTED_CONTENT_FORMATS.PLAIN_TEXT);
  assert.equal(utf8.confidence, 'HIGH');
  assert.equal(utf8.safeToImport, true);
  const cp1252 = await detectImportedDocumentFormat(file('legacy.TXT', [0x53, 0xe3, 0x6f, 0x20, 0x4a, 0x6f, 0x73, 0xe9]));
  assert.equal(cp1252.detectedFormat, IMPORTED_CONTENT_FORMATS.PLAIN_TEXT);
  assert.equal(cp1252.safeToImport, true);
  assert.match(cp1252.evidence, /windows-1252/);
  const binary = await detectImportedDocumentFormat(file('looks.txt', [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
  assert.equal(binary.detectedFormat, IMPORTED_CONTENT_FORMATS.OLE_COMPOUND);
  assert.equal(binary.safeToImport, false);
});

test('UTF-8 BOM is inspected but removed from the plain-text classification evidence', async () => {
  const body = new TextEncoder().encode('Clínica odontológica');
  const result = await detectImportedDocumentFormat(file('utf8.txt', [0xef, 0xbb, 0xbf, ...body]));
  assert.equal(result.detectedFormat, IMPORTED_CONTENT_FORMATS.PLAIN_TEXT);
  assert.match(result.evidence, /BOM UTF-8 removido/);
  const corrupt = await detectImportedDocumentFormat(file('corrupt.txt', [0xef, 0xbb, 0xbf, 0x41, 0xff]));
  assert.equal(corrupt.detectedFormat, IMPORTED_CONTENT_FORMATS.UNKNOWN);
  assert.equal(corrupt.safeToImport, false);
});

test('RTF signature takes precedence over extension; .txt/.rtf/.mod RTF imports, while non-RTF MOD is rejected', async () => {
  for (const [name, source] of [
    ['sample.rtf', '{\\rtf1\\ansi\\ansicpg1252 conteúdo}'],
    ['sample.txt', '\ufeff  {\\rtf1\\ansi conteúdo}'],
    ['sample.mod', '{\\rtf1\\ansi conteúdo}'],
  ]) {
    const result = await detectImportedDocumentFormat(file(name, new TextEncoder().encode(source)));
    assert.equal(result.detectedFormat, IMPORTED_CONTENT_FORMATS.RTF);
    assert.equal(result.confidence, 'HIGH');
    assert.equal(result.safeToImport, true);
    if (name === 'sample.rtf') assert.match(result.evidence, /1252/);
  }
  const plainMod = await detectImportedDocumentFormat(file('label.mod', new TextEncoder().encode('Etiqueta: texto simples')));
  assert.equal(plainMod.detectedFormat, IMPORTED_CONTENT_FORMATS.PLAIN_TEXT);
  assert.equal(plainMod.safeToImport, false);
  assert.match(plainMod.reason, /MOD não contém um documento RTF reconhecível/);
  const upperCase = await detectImportedDocumentFormat(file('upper.txt', new TextEncoder().encode('{\\RTF1 text}')));
  assert.equal(upperCase.detectedFormat, IMPORTED_CONTENT_FORMATS.UNKNOWN);
});

test('DOCX requires ZIP directory, local entries, valid CRC, required OOXML parts and Word content type', async () => {
  for (const compression of ['stored', 'deflate']) {
    const valid = await detectImportedDocumentFormat(file('valid.docx', makeOoxmlDocxBytes({ compression }), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'));
    assert.equal(valid.detectedFormat, IMPORTED_CONTENT_FORMATS.DOCX);
    assert.equal(valid.confidence, 'HIGH');
    assert.equal(valid.safeToImport, true);
  }
  const invalid = await detectImportedDocumentFormat(file('renamed.docx', [0x50, 0x4b, 0x03, 0x04, 0, 1, 2]));
  assert.equal(invalid.detectedFormat, IMPORTED_CONTENT_FORMATS.UNKNOWN);
  assert.equal(invalid.safeToImport, false);
});

test('content format and source extension are distinct and mismatches are never importable', async () => {
  const txtWithDocx = await detectImportedDocumentFormat(file('renamed.txt', makeOoxmlDocxBytes()));
  assert.equal(txtWithDocx.extension, '.txt');
  assert.equal(txtWithDocx.detectedFormat, IMPORTED_CONTENT_FORMATS.DOCX);
  assert.equal(txtWithDocx.safeToImport, false);
  const docxWithText = await detectImportedDocumentFormat(file('renamed.docx', new TextEncoder().encode('plain words')));
  assert.equal(docxWithText.extension, '.docx');
  assert.equal(docxWithText.detectedFormat, IMPORTED_CONTENT_FORMATS.PLAIN_TEXT);
  assert.equal(docxWithText.safeToImport, false);
  const classicDocWithText = await detectImportedDocumentFormat(file('renamed.doc', new TextEncoder().encode('plain words')));
  assert.equal(classicDocWithText.detectedFormat, IMPORTED_CONTENT_FORMATS.PLAIN_TEXT);
  assert.equal(classicDocWithText.safeToImport, false);
});

test('OLE is identified as a container, not asserted as classic Word DOC; unknown remains blocked', async () => {
  const ole = await detectImportedDocumentFormat(file('word.doc', [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
  assert.equal(ole.detectedFormat, IMPORTED_CONTENT_FORMATS.OLE_COMPOUND);
  assert.equal(ole.confidence, 'HIGH');
  assert.equal(ole.safeToImport, false);
  assert.match(ole.reason, /não comprova sozinho/);
  const unknown = await detectImportedDocumentFormat(file('unknown.txt', [0xff, 0xfe, 0x00, 0x01, 0x02]));
  assert.equal(unknown.detectedFormat, IMPORTED_CONTENT_FORMATS.UNKNOWN);
  assert.equal(unknown.confidence, 'UNKNOWN');
  assert.equal(unknown.safeToImport, false);
  const htmlText = await detectImportedDocumentFormat(file('html.txt', new TextEncoder().encode('<!doctype html><html><body>não é texto simples</body></html>')));
  assert.equal(htmlText.detectedFormat, IMPORTED_CONTENT_FORMATS.UNKNOWN);
  assert.equal(htmlText.safeToImport, false);
  const embeddedLegacyContent = await detectImportedDocumentFormat(file('embedded.txt', new TextEncoder().encode('Texto\n[[IMGDATA:data:image/bmp;base64,AAAA]]')));
  assert.equal(embeddedLegacyContent.detectedFormat, IMPORTED_CONTENT_FORMATS.UNKNOWN);
  assert.equal(embeddedLegacyContent.safeToImport, false);
  const oasisEnvelope = await detectImportedDocumentFormat(file('brana-export.txt', new TextEncoder().encode('{"format":"oasis","document":{}}')));
  assert.equal(oasisEnvelope.detectedFormat, IMPORTED_CONTENT_FORMATS.UNKNOWN);
  assert.equal(oasisEnvelope.safeToImport, false);
});
