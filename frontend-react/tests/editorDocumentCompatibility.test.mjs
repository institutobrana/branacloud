import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { detectEditorDocumentFormat, EDITOR_DOCUMENT_FORMATS } from '../src/features/editorTextos/models/editorDocumentFormatDetector.js';
import { convertLegacyHtmlToOasis, convertPlainTextToOasis, createUnsupportedFormatDiagnostic } from '../src/features/editorTextos/adapters/editorLegacyToOasisAdapter.js';
import { decodeOasisEnvelope, encodeOasisEnvelope } from '../src/features/editorTextos/persistence/oasisDocumentEnvelope.js';
import fs from 'node:fs';
import path from 'node:path';

const oasisPilotSource = fs.readFileSync(path.resolve(import.meta.dirname, '../src/features/editorTextos/oasis/OasisEditorPilot.jsx'), 'utf8');

const createParagraph = (text) => ({ type: 'paragraph', text });
const createDocument = ({ title, blocks }) => ({ title, sections: [{ blocks }] });

test('format detector trusts Oasis envelope/metadata before extension and content hints', () => {
  const oasis = encodeOasisEnvelope({ id: 'o1', sections: [] });
  assert.equal(detectEditorDocumentFormat({ conteudo: JSON.stringify(oasis), conteudo_formato: 'oasis_json', extensao: '.txt' }).format, EDITOR_DOCUMENT_FORMATS.OASIS);
  assert.equal(decodeOasisEnvelope(JSON.stringify(oasis)).source.format, 'oasis');
  assert.equal(detectEditorDocumentFormat({ conteudo: '<p>Texto</p>', conteudo_formato: 'html', extensao: '.rtf' }).sourceFormat, 'rtf');
});

test('inventory formats are explicit: plain/RTF supported by adapter path; Office binaries diagnostic-only', () => {
  assert.equal(detectEditorDocumentFormat({ conteudo: 'Linha 1\nLinha 2', conteudo_formato: 'text', extensao: '.txt' }).format, EDITOR_DOCUMENT_FORMATS.PLAIN_TEXT);
  assert.equal(detectEditorDocumentFormat({ conteudo: '{\\rtf1 texto}', conteudo_formato: 'text', extensao: '.rtf' }).format, EDITOR_DOCUMENT_FORMATS.RTF);
  assert.equal(detectEditorDocumentFormat({ conteudo: '&lt;p&gt;texto&lt;/p&gt;', conteudo_formato: 'text', extensao: '.txt' }).format, EDITOR_DOCUMENT_FORMATS.HTML);
  assert.equal(detectEditorDocumentFormat({ conteudo: '{broken', conteudo_formato: 'oasis_json', extensao: '.txt' }).format, EDITOR_DOCUMENT_FORMATS.UNKNOWN);
  for (const extensao of ['.bmp', '.doc', '.docx', '.dot', '.dotm', '.tmp']) {
    assert.equal(detectEditorDocumentFormat({ conteudo: 'PK\u0000binary', conteudo_formato: 'text', extensao }).format, EDITOR_DOCUMENT_FORMATS.UNKNOWN);
  }
});

test('plain-text converter preserves line breaks, Portuguese accents, and literal merge tokens', () => {
  const source = 'Ação clínica\n<<Paciente.NomeCompleto>>\n  linha final  ';
  const converted = convertPlainTextToOasis(source, { createDocument, createParagraph });
  assert.deepEqual(converted.document.sections[0].blocks.map((block) => block.text), ['Ação clínica', '<<Paciente.NomeCompleto>>', '  linha final  ']);
});

test('inert HTML converter strips executable/embedded markup and reports dropped presentation features', () => {
  const html = '<p>Clínica <strong>Brána</strong> &lt;&lt;Paciente.NomeCompleto&gt;&gt;</p><table><tr><td>Coluna A</td><td>Coluna B</td></tr></table><img src="https://invalid.example/a.png"><script>globalThis.__r39Executed = true</script>';
  const converted = convertLegacyHtmlToOasis(html, { createDocument, createParagraph, Parser: new JSDOM('').window.DOMParser });
  assert.deepEqual(converted.document.sections[0].blocks.map((block) => block.text), ['Clínica Brána <<Paciente.NomeCompleto>>', 'Coluna A Coluna B']);
  assert.ok(converted.warnings.some((warning) => warning.includes('tabelas')));
  assert.ok(converted.warnings.some((warning) => warning.includes('imagens')));
  assert.ok(converted.warnings.some((warning) => warning.includes('formatação')));
  assert.ok(converted.warnings.some((warning) => warning.includes('conteúdo ativo')));
  assert.equal(globalThis.__r39Executed, undefined);
});

test('unsupported diagnostic is read-only text, bounded, and never interpreted as markup', () => {
  const diagnostic = createUnsupportedFormatDiagnostic({ sourceFormat: 'doc', size: 15000, reason: 'sem conversor', content: '<script>unsafe</script>'.repeat(1000) });
  assert.equal(diagnostic.format, 'doc');
  assert.equal(diagnostic.preview.length, 12000);
  assert.equal(diagnostic.truncated, true);
  assert.equal(diagnostic.reason, 'sem conversor');
});

test('backend diagnostic metadata wins over extension/content and exposes read-only file facts', () => {
  const detection = detectEditorDocumentFormat({
    id: 8,
    nome: 'Documento binário',
    extensao: '.doc',
    conteudo: '<script>must-not-be-consumed()</script>',
    conteudo_formato: 'diagnostic',
    diagnostico: { read_only: true, file_exists: true, size_bytes: 4096, detected_format: 'doc', reason: 'sem conversor seguro', preview: '', metadata: { conteudo_formato: '' } },
  });
  assert.equal(detection.format, EDITOR_DOCUMENT_FORMATS.UNKNOWN);
  assert.equal(detection.fileExists, true);
  assert.equal(detection.size, 4096);
  assert.equal(detection.content, '');
  assert.equal(createUnsupportedFormatDiagnostic(detection).readOnly, true);
  assert.equal(createUnsupportedFormatDiagnostic(detection).name, 'Documento binário');
});

test('backend diagnostic UI reports extension, physical presence, byte size and safe preview', () => {
  assert.match(oasisPilotSource, /compatibilityStatus\.fileExists === false \? 'ausente' : 'presente'/);
  assert.match(oasisPilotSource, /compatibilityStatus\.size \|\| 0\).*bytes/);
  assert.match(oasisPilotSource, /prévia textual segura/);
});

test('Oasis envelope keeps provenance from a legacy conversion for safe Save As', () => {
  const envelope = encodeOasisEnvelope({ id: 'converted' }, { format: 'rtf', legacyDocumentId: 47, conversionVersion: 'html-text-blocks-v1' });
  assert.deepEqual(decodeOasisEnvelope(envelope).source, { format: 'rtf', legacyDocumentId: 47, conversionVersion: 'html-text-blocks-v1', legacySourceProtected: true });
  assert.deepEqual(decodeOasisEnvelope(encodeOasisEnvelope({ id: 'native' })).source, { format: 'oasis', legacyDocumentId: null, conversionVersion: null, legacySourceProtected: false });
});

test('Oasis open converts only detected supported formats and opens unsupported sources in read-only diagnostics', () => {
  assert.match(oasisPilotSource, /detectEditorDocumentFormat\(dto\)/);
  assert.match(oasisPilotSource, /convertLegacyHtmlToOasis\(detection\.content/);
  assert.match(oasisPilotSource, /convertPlainTextToOasis\(detection\.content/);
  assert.match(oasisPilotSource, /createUnsupportedFormatDiagnostic\(detection\)/);
  assert.match(oasisPilotSource, /client\.ui\.setReadOnly\(detection\.format === EDITOR_DOCUMENT_FORMATS\.UNKNOWN/);
  assert.match(oasisPilotSource, /decodeOasisEnvelope\(dto\?\.conteudo\)/);
  assert.match(oasisPilotSource, /sourceRef\.current\.legacyDocumentId && !sourceRef\.current\.conversionVersion/);
});

test('compatibility UI renders unsupported preview only as React text and presents conversion warnings', () => {
  assert.match(oasisPilotSource, /compatibilityStatus\.warnings\.map/);
  assert.match(oasisPilotSource, /<pre>\{compatibilityStatus\.preview\}/);
  assert.match(oasisPilotSource, /somente leitura/);
  assert.match(oasisPilotSource, /Documento aberto em modo de compatibilidade/);
});
