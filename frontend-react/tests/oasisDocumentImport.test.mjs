import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { getImportedDocumentName, getSupportedImportFormat, importDocumentIntoOasis, UNIFIED_IMPORT_ACCEPT } from '../src/features/editorTextos/oasis/oasisDocumentImport.js';
import { decodeImportedTextBytes, decodeImportedTextFile } from '../src/features/editorTextos/oasis/importedTextDecoder.js';
import { decodeOasisEnvelope, encodeOasisEnvelope } from '../src/features/editorTextos/persistence/oasisDocumentEnvelope.js';
import { convertRtfHtmlToOasis } from '../src/features/editorTextos/adapters/editorLegacyToOasisAdapter.js';
import { normalizePageConfig } from '../src/features/editorTextos/models/pageConfig.js';
import { buildRulerGeometry } from '../src/features/editorTextos/oasis/oasisRulerAdapter.js';
import { makeOoxmlDocxBytes } from './helpers/ooxmlZipFixture.mjs';

globalThis.DOMParser = new JSDOM('').window.DOMParser;

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, 'src/features/editorTextos', file), 'utf8');

function createMockClient(initial = { id: 'previous', blocks: ['old'] }) {
  const client = {
    current: initial,
    setCalls: [],
    historyClears: 0,
    focuses: 0,
    getDocument() { return this.current; },
    import: { async docx(file) { this.owner.current = { id: 'imported-docx', filename: file.name, blocks: ['docx'] }; } },
    document: { set(document) { client.setCalls.push(document); client.current = document; } },
    history: { clear() { client.historyClears += 1; } },
    focus: { focus() { client.focuses += 1; } },
  };
  client.import.owner = client;
  return client;
}

const toArrayBuffer = (bytes) => Uint8Array.from(bytes).buffer;
const utf8File = (name, text, bom = false) => {
  const content = new TextEncoder().encode(text);
  const bytes = bom ? Uint8Array.from([0xef, 0xbb, 0xbf, ...content]) : content;
  return { name, async arrayBuffer() { return bytes.slice().buffer; } };
};

test('TXT decoder preserves valid UTF-8 Portuguese text, punctuation, symbols, and merge tokens', () => {
  const expected = 'á à ã â é ê í ó ô õ ú ç Á É Í Ó Ú Ç\n“Paciente” ‘São José’ – — … º ª ° ®\nR$ 150,00 % §\nClínica Odontológica — Ação — Observação — Prescrição\nPaciente Nº 123\n<<Paciente.NomeCompleto>> <<Paciente.Telefone>>';
  const decoded = decodeImportedTextBytes(new TextEncoder().encode(expected));
  assert.deepEqual(decoded, { text: expected, encoding: 'utf-8', warning: null });
});

test('RTF HTML adapter maps paragraph typography, spacing, tab stops, and simple borders to Oasis styles', () => {
  const createParagraph = (text = '') => ({ text, runs: text ? [{ kind: 'text', text }] : [], style: {} });
  const result = convertRtfHtmlToOasis(
    '<p style="text-align:center" data-rtf-indent-left-pt="36" data-rtf-indent-right-pt="18" data-rtf-indent-first-pt="-12" data-rtf-spacing-before-pt="6" data-rtf-spacing-after-pt="12" data-rtf-line-spacing="18" data-rtf-line-rule="exact" data-rtf-tabs="[{&quot;positionPt&quot;:72,&quot;type&quot;:&quot;center&quot;}]" data-rtf-borders="{&quot;top&quot;:{&quot;style&quot;:&quot;solid&quot;,&quot;widthPt&quot;:1}}"><span data-rtf-font-family="Arial" data-rtf-font-size-pt="11">Exemplo</span></p>',
    { createDocument: ({ blocks }) => ({ blocks }), createParagraph },
  );
  const paragraph = result.document.blocks[0];
  assert.deepEqual(paragraph.style, {
    align: 'center', indentLeft: 48, indentRight: 24, indentFirstLine: -16,
    spacingBefore: 8, spacingAfter: 16, lineRule: 'exact', lineHeight: 24,
    tabs: [{ position: 96, type: 'center' }],
    borderTop: { width: 1.3333333333333333, type: 'solid', color: '#000000' },
  });
  assert.deepEqual(paragraph.runs[0].styles, { fontFamily: 'Arial', fontSize: 14.666666666666666 });
});

test('TXT decoder removes UTF-8 BOM without changing otherwise valid text', () => {
  const expected = 'São José\r\n\r\n<<Paciente.NomeCompleto>>';
  const content = new TextEncoder().encode(expected);
  const decoded = decodeImportedTextBytes(Uint8Array.from([0xef, 0xbb, 0xbf, ...content]));
  assert.deepEqual(decoded, { text: expected, encoding: 'utf-8-bom', warning: null });
  assert.equal(decoded.text.startsWith('\uFEFF'), false);
});

test('TXT decoder recognizes Windows-1252 bytes including accents and smart quotes', () => {
  const cp1252 = [
    0x53, 0xe3, 0x6f, 0x20, 0x4a, 0x6f, 0x73, 0xe9, 0x0d, 0x0a,
    0x43, 0x6c, 0xed, 0x6e, 0x69, 0x63, 0x61, 0x0d, 0x0a,
    0x41, 0xe7, 0xe3, 0x6f, 0x0d, 0x0a,
    0x93, 0x50, 0x61, 0x63, 0x69, 0x65, 0x6e, 0x74, 0x65, 0x94, 0x0d, 0x0a,
    0x52, 0x24, 0x20, 0x31, 0x35, 0x30, 0x2c, 0x30, 0x30,
  ];
  const decoded = decodeImportedTextBytes(Uint8Array.from(cp1252));
  assert.deepEqual(decoded, {
    text: 'São José\r\nClínica\r\nAção\r\n“Paciente”\r\nR$ 150,00',
    encoding: 'windows-1252',
    warning: null,
  });
});

test('TXT decoder preserves undefined Windows-1252 bytes and reports uncertain source mapping', () => {
  const decoded = decodeImportedTextBytes(Uint8Array.from([0x41, 0x81, 0x42]));
  assert.equal(decoded.encoding, 'windows-1252');
  assert.equal(decoded.text, 'A\u0081B');
  assert.match(decoded.warning, /sem mapeamento definido/);
});

test('file decoder reads arrayBuffer and does not require File.text()', async () => {
  const file = utf8File('teste.txt', 'Ação');
  assert.deepEqual(await decodeImportedTextFile(file), { text: 'Ação', encoding: 'utf-8', warning: null });
  await assert.rejects(decodeImportedTextFile({ name: 'sem-bytes.txt', text: async () => 'texto' }), /como bytes/);
});

test('unified file picker allows DOCX/TXT/RTF/MOD extensions, case-insensitively', () => {
  assert.equal(UNIFIED_IMPORT_ACCEPT, '.docx,.txt,.rtf,.mod');
  for (const [name, expected] of [['file.docx', 'docx'], ['ARQUIVO.DOCX', 'docx'], ['modelo.txt', 'txt'], ['MODELO.TXT', 'txt'], ['arquivo.rtf', 'rtf'], ['arquivo.mod', 'mod'], ['MODELO.MOD', 'mod']]) {
    assert.equal(getSupportedImportFormat(name), expected);
  }
  for (const name of ['file.doc', 'file', 'file.txt.exe', '.rtf']) {
    assert.equal(getSupportedImportFormat(name), null);
  }
  assert.equal(getSupportedImportFormat('file.rtf'), 'rtf');
  assert.equal(getImportedDocumentName('D:\\entrada\\Receita paciente.txt'), 'Receita paciente');
  assert.equal(getImportedDocumentName('Atestado.mod'), 'Atestado');
});

test('DOCX routes to the native public Oasis importer, marks a new state, and resets history', async () => {
  const client = createMockClient();
  const bytes = makeOoxmlDocxBytes();
  const result = await importDocumentIntoOasis({ file: { name: 'Seguro.DOCX', async arrayBuffer() { return bytes.slice().buffer; } }, client });
  assert.equal(result.format, 'docx');
  assert.equal(result.sourceExtension, '.docx');
  assert.equal(result.detectedContentFormat, 'docx');
  assert.equal(result.detectionConfidence, 'HIGH');
  assert.equal(result.suggestedName, 'Seguro');
  assert.equal(client.current.id, 'imported-docx');
  assert.equal(client.setCalls.length, 1);
  assert.equal(client.historyClears, 1);
  assert.equal(client.focuses, 1);
});

test('RTF bytes in .rtf, .txt, and .mod route through the temporary Brana converter and become Oasis documents', async () => {
  const html = '<p>São José</p><p>&lt;&lt;Paciente.NomeCompleto&gt;&gt;</p>';
  for (const filename of ['EasyDental.rtf', 'EasyDental.txt', 'Atestado.mod']) {
    const client = createMockClient();
    let conversions = 0;
    let counter = 0;
    const bytes = new TextEncoder().encode('{\\rtf1\\ansi São José\\par <<Paciente.NomeCompleto>>}');
    const result = await importDocumentIntoOasis({
      file: { name: filename, async arrayBuffer() { return bytes.slice().buffer; } },
      client,
      convertRtf: async () => { conversions += 1; return { html, warnings: ['RTF parcial'], persisted: false }; },
      createParagraphFactory: (text) => ({ type: 'paragraph', text }),
      createDocumentFactory: ({ title, blocks }) => ({ id: `rtf-${++counter}`, title, blocks }),
    });
    assert.equal(conversions, 1);
    assert.equal(result.format, 'rtf');
    assert.equal(result.sourceExtension, filename.endsWith('.txt') ? '.txt' : filename.endsWith('.mod') ? '.mod' : '.rtf');
    assert.equal(result.detectedContentFormat, 'rtf');
    assert.deepEqual(client.current.blocks.map((block) => block.text), ['São José', '<<Paciente.NomeCompleto>>']);
    assert.ok(result.warnings.includes('RTF parcial'));
    assert.equal(client.historyClears, 1);
    assert.equal(client.focuses, 1);
  }
});

test('RTF import applies physical page geometry to Oasis document and section and preserves it in envelope roundtrip', async () => {
  const client = createMockClient();
  const pageConfig = { tipo_papel: 'Definido pelo usuário', orientacao: 'Paisagem', largura_mm: 66.69, altura_mm: 25.4, margem_esquerda_mm: 1.01, margem_direita_mm: 0, margem_superior_mm: 1.01, margem_inferior_mm: 0 };
  const pageSettings = { width: 252.17, height: 96, orientation: 'landscape', margins: { left: 3.82, right: 0, top: 3.82, bottom: 0, header: 0, footer: 0, gutter: 0 } };
  const result = await importDocumentIntoOasis({
    file: utf8File('Pimaco6080.mod', '{\\rtf1\\paperw3781\\paperh1440 texto}'),
    client,
    convertRtf: async () => ({ html: '<p>Etiqueta &lt;&lt;Paciente.NomeCompleto&gt;&gt;</p>', warnings: [], persisted: false, page_config: pageConfig, page_settings: pageSettings }),
    createParagraphFactory: (text) => ({ type: 'paragraph', text }),
    createDocumentFactory: ({ title, blocks }) => ({ id: 'label-document', title, blocks, pageSettings: { width: 816, height: 1056, orientation: 'portrait', margins: { top: 96, right: 96, bottom: 96, left: 96, header: 48, footer: 48, gutter: 0 } }, sections: [{ id: 'section:default', blocks, pageSettings: { width: 816, height: 1056, orientation: 'portrait', margins: { top: 96, right: 96, bottom: 96, left: 96, header: 48, footer: 48, gutter: 0 } } }] }),
  });
  assert.deepEqual(result.pageConfig, pageConfig);
  assert.equal(client.current.pageSettings.width, 252.17);
  assert.equal(client.current.pageSettings.height, 96);
  assert.equal(client.current.pageSettings.orientation, 'landscape');
  assert.equal(client.current.pageSettings.margins.header, 0);
  assert.equal(client.current.pageSettings.margins.footer, 0);
  assert.equal(buildRulerGeometry(client.current.pageSettings, {}, 1).pageWidth, 252.17);
  assert.equal(client.current.sections[0].pageSettings.width, 252.17);
  assert.equal(client.current.sections[0].pageSettings.margins.bottom, 0);
  assert.equal(client.current.sections[0].pageSettings.margins.header, 0);
  assert.equal(client.current.sections[0].pageSettings.margins.footer, 0);
  assert.deepEqual(normalizePageConfig(result.pageConfig, { minimumPageMm: 1 }), pageConfig);
  const saved = encodeOasisEnvelope(client.current, { format: 'rtf', origin: 'import', sourceExtension: '.mod', detectedContentFormat: 'rtf', detectionConfidence: 'HIGH' });
  const reopened = decodeOasisEnvelope(JSON.stringify(saved)).document;
  assert.deepEqual(reopened.pageSettings, client.current.pageSettings);
  assert.deepEqual(reopened.sections[0].pageSettings, client.current.sections[0].pageSettings);
});

test('RTF POC maps simple tables, inline formatting, paragraph styles, lists, and literal tokens into Oasis nodes', async () => {
  const client = createMockClient();
  let nodeId = 0;
  const paragraphFactory = (text) => ({ id: `p-${++nodeId}`, type: 'paragraph', runs: [{ id: `r-${nodeId}`, kind: 'text', text }] });
  const tableFactory = (rows) => ({
    id: `t-${++nodeId}`,
    type: 'table',
    rows: rows.map((values) => ({ cells: values.map((text) => ({ blocks: [paragraphFactory(text)] })) })),
  });
  const html = '<table><tbody><tr><td><p><strong>Clínica</strong></p></td><td><p>&lt;&lt;Paciente.NomeCompleto&gt;&gt;</p></td></tr><tr><td><p>São José</p></td><td><p>Telefone</p></td></tr></tbody></table><p data-rtf-list-kind="ordered" data-rtf-list-level="0" data-rtf-indent-left-pt="18" style="text-align:center"><em>Primeiro</em></p><p data-rtf-list-kind="ordered" data-rtf-list-level="0">Segundo</p>';
  const result = await importDocumentIntoOasis({
    file: utf8File('Tabela.rtf', '{\\rtf1 texto}'),
    client,
    convertRtf: async () => ({ html, warnings: [], persisted: false }),
    createParagraphFactory: paragraphFactory,
    createTableFactory: tableFactory,
    createDocumentFactory: ({ title, blocks }) => ({ id: `rtf-${++nodeId}`, title, blocks }),
  });
  const [table, first, second] = client.current.blocks;
  assert.equal(table.type, 'table');
  assert.equal(table.rows.length, 2);
  assert.deepEqual(table.rows.map((row) => row.cells.length), [2, 2]);
  assert.equal(table.rows[0].cells[0].blocks[0].runs[0].text, 'Clínica');
  assert.equal(table.rows[0].cells[0].blocks[0].runs[0].styles.bold, true);
  assert.equal(table.rows[0].cells[1].blocks[0].runs[0].text, '<<Paciente.NomeCompleto>>');
  assert.deepEqual(first.list, { kind: 'ordered', level: 0, instanceId: 'rtf-list-1' });
  assert.deepEqual(second.list, { kind: 'ordered', level: 0, instanceId: 'rtf-list-1' });
  assert.equal(first.style.align, 'center');
  assert.equal(first.style.indentLeft, 24);
  assert.equal(first.runs[0].styles.italic, true);
  assert.equal(result.document, client.current);
  assert.equal(client.historyClears, 1);
});

test('plain text under .rtf and non-RTF MOD remain blocked without changing the current document', async () => {
  const initial = { id: 'previous', blocks: ['preserved'] };
  const client = createMockClient(initial);
  const bytes = new TextEncoder().encode('plain text is not RTF');
  await assert.rejects(importDocumentIntoOasis({ file: { name: 'not-rtf.rtf', async arrayBuffer() { return bytes.slice().buffer; } }, client }), /somente arquivos com extensão/);
  assert.equal(client.current, initial);
  assert.equal(client.setCalls.length, 0);
  assert.equal(client.historyClears, 0);
  await assert.rejects(importDocumentIntoOasis({ file: utf8File('legenda.mod', 'texto sem assinatura RTF'), client }), /MOD não contém um documento RTF reconhecível/);
  assert.equal(client.current, initial);
  assert.equal(client.setCalls.length, 0);
  assert.equal(client.historyClears, 0);
  assert.equal(getSupportedImportFormat('legacy.mod'), 'mod');
});

test('invalid DOCX package is rejected before calling the native Oasis importer', async () => {
  const initial = { id: 'previous', blocks: ['preserved'] };
  const client = createMockClient(initial);
  await assert.rejects(importDocumentIntoOasis({ file: { name: 'invalid.docx', async arrayBuffer() { return Uint8Array.from([0x50, 0x4b, 0x03, 0x04]).buffer; } }, client }), /não é um pacote DOCX válido/);
  assert.equal(client.current, initial);
  assert.equal(client.setCalls.length, 0);
  assert.equal(client.historyClears, 0);
});

test('TXT routes through Oasis adapter, decodes UTF-8, and preserves mixed line endings, blank lines, and merge tokens', async () => {
  const client = createMockClient();
  let counter = 0;
  const source = 'ação, clínica, São José\r\n\r\n<<Paciente.NomeCompleto>>\rOutra linha\n\nPaciente Nº 123';
  const result = await importDocumentIntoOasis({
    file: utf8File('Amostra.TXT', source),
    client,
    createParagraphFactory: (text) => ({ type: 'paragraph', text }),
    createDocumentFactory: ({ title, blocks }) => ({ id: `txt-${++counter}`, title, blocks }),
  });
  assert.equal(result.format, 'txt');
  assert.equal(result.textEncoding, 'utf-8');
  assert.equal(result.textEncodingWarning, null);
  assert.deepEqual(client.current.blocks.map((block) => block.text), ['ação, clínica, São José', '', '<<Paciente.NomeCompleto>>', 'Outra linha', '', 'Paciente Nº 123']);
  assert.equal(client.current.title, 'Amostra');
  assert.equal(client.historyClears, 1);
  assert.equal(client.focuses, 1);
});

test('TXT import applies Windows-1252 decoding before Oasis paragraph conversion', async () => {
  const client = createMockClient();
  let counter = 0;
  const result = await importDocumentIntoOasis({
    file: { name: 'Legado.txt', async arrayBuffer() { return toArrayBuffer([0x53, 0xe3, 0x6f, 0x20, 0x4a, 0x6f, 0x73, 0xe9, 0x0d, 0x0a, 0x93, 0x50, 0x61, 0x63, 0x69, 0x65, 0x6e, 0x74, 0x65, 0x94]); } },
    client,
    createParagraphFactory: (text) => ({ type: 'paragraph', text }),
    createDocumentFactory: ({ title, blocks }) => ({ id: `txt-${++counter}`, title, blocks }),
  });
  assert.equal(result.textEncoding, 'windows-1252');
  assert.deepEqual(client.current.blocks.map((block) => block.text), ['São José', '“Paciente”']);
});

test('unsupported formats are rejected before dispatch and leave the current Oasis document untouched', async () => {
  const initial = { id: 'previous', blocks: ['preserved'] };
  const client = createMockClient(initial);
  await assert.rejects(importDocumentIntoOasis({ file: { name: 'unsafe.doc' }, client }), /DOCX, TXT, RTF e MOD/);
  assert.equal(client.current, initial);
  assert.equal(client.setCalls.length, 0);
  assert.equal(client.historyClears, 0);
});

test('cancelled picker and dirty-guard choices preserve or protect the current document', () => {
  const pilot = read('oasis/OasisEditorPilot.jsx');
  assert.match(pilot, /onCancel=\{restoreImportPickerSelection\}/);
  assert.match(pilot, /if \(!file\) \{\s*restoreImportPickerSelection\(\);\s*return;/);
  assert.match(pilot, /pendingImportFileRef\.current = file;\s*if \(dirtyRef\.current\)\s*\{\s*setUnsavedVisible\(true\)/);
  assert.match(pilot, /onDiscard=\{discardAndImport\}/);
  assert.match(pilot, /onSave=\{saveAndImport\}/);
  assert.match(pilot, /onCancel=\{cancelImportAfterUnsavedPrompt\}/);
});

test('successful import becomes a new dirty Brana document and normal Save creates while Save As has its own route', () => {
  const pilot = read('oasis/OasisEditorPilot.jsx');
  assert.match(pilot, /documentIdRef\.current = null;[\s\S]*?sourceRef\.current = \{[\s\S]*?format: imported\.format,[\s\S]*?sourceExtension: imported\.sourceExtension,[\s\S]*?detectedContentFormat: imported\.detectedContentFormat/);
  assert.match(pilot, /savedSnapshotRef\.current = null;\s*dirtyRef\.current = true;\s*setDirty\(true\)/);
  assert.match(pilot, /const dto = replaceModel[\s\S]*?forceNew[\s\S]*?documentIdRef\.current\s*\? await editorTextosApi\.updateDocument[\s\S]*?: await editorTextosApi\.createDocument/);
  assert.match(pilot, /accept=\{UNIFIED_IMPORT_ACCEPT\}/);
});

test('import origin is persisted without local filesystem paths', () => {
  const envelope = fs.readFileSync(path.join(root, 'src/features/editorTextos/persistence/oasisDocumentEnvelope.js'), 'utf8');
  assert.match(envelope, /\.\.\.\(source\?\.origin \? \{ origin: String\(source\.origin\) \} : \{\}\)/);
  assert.doesNotMatch(envelope, /originalFilePath|absolutePath|filePath/);
  const source = decodeOasisEnvelope(encodeOasisEnvelope({ id: 'new-oasis' }, {
    format: 'rtf',
    origin: 'import',
    sourceExtension: '.txt',
    detectedContentFormat: 'rtf',
    detectionConfidence: 'HIGH',
  })).source;
  assert.equal(source.format, 'rtf');
  assert.equal(source.origin, 'import');
  assert.equal(source.sourceExtension, '.txt');
  assert.equal(source.detectedContentFormat, 'rtf');
  assert.equal(source.detectionConfidence, 'HIGH');
  assert.equal(Object.hasOwn(source, 'originalFilePath'), false);
  const invalidProvenance = decodeOasisEnvelope(encodeOasisEnvelope({ id: 'bad-source' }, {
    origin: 'import',
    sourceExtension: '.mod',
    detectedContentFormat: 'unknown',
    detectionConfidence: 'CERTAIN',
  })).source;
  assert.equal(Object.hasOwn(invalidProvenance, 'sourceExtension'), false);
  assert.equal(Object.hasOwn(invalidProvenance, 'detectedContentFormat'), false);
  assert.equal(Object.hasOwn(invalidProvenance, 'detectionConfidence'), false);
});
