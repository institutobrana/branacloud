import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { convertRtfHtmlToOasis } from '../src/features/editorTextos/adapters/editorLegacyToOasisAdapter.js';
import { decodeOasisEnvelope, encodeOasisEnvelope } from '../src/features/editorTextos/persistence/oasisDocumentEnvelope.js';

const root = path.resolve(import.meta.dirname, '../src/features/editorTextos');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const Parser = new JSDOM('').window.DOMParser;

function createParagraph(text) {
  return { id: `p-${Math.random()}`, type: 'paragraph', style: {}, runs: [{ id: `r-${Math.random()}`, kind: 'text', text, styles: {} }] };
}

function createDocument({ title, blocks }) {
  return { id: 'bold-fixture', title, sections: [{ id: 'section-1', blocks }] };
}

test('Oasis bold command is a boolean toggle and renders normal/bold with increasing CSS/canvas weight', () => {
  const commands = fs.readFileSync(path.resolve(import.meta.dirname, '../node_modules/oasis-editor/dist/core/commands/builtinCommands.d.ts'), 'utf8');
  assert.match(commands, /"bold"/);
  const toolbar = read('components/EditorTextosPrimaryToolbar.jsx');
  assert.match(toolbar, /negrito: 'toggleBold'/);
  assert.match(toolbar, /activeFormats\[\{ negrito: 'bold'/);
  const renderer = fs.readFileSync(path.resolve(import.meta.dirname, '../node_modules/oasis-editor/dist/index-K-7FcXvb.js'), 'utf8');
  assert.match(renderer, /styles\s*==\s*null\s*\?\s*void 0\s*:\s*styles\.bold\)\s*\?\s*"700"\s*:\s*"400"/);
});

test('explicit Arial remains first in the renderer stack for both normal and bold weights', () => {
  const renderer = fs.readFileSync(path.resolve(import.meta.dirname, '../node_modules/oasis-editor/dist/index-K-7FcXvb.js'), 'utf8');
  const rendererPatch = fs.readFileSync(path.resolve(import.meta.dirname, '../patches/oasis-editor@0.0.191.patch'), 'utf8');
  assert.match(`${renderer}\n${rendererPatch}`, /explicitArial/);
  assert.match(`${renderer}\n${rendererPatch}`, /requested, metric/);
  assert.match(renderer, /styles\s*==\s*null\s*\?\s*void 0\s*:\s*styles\.bold\)\s*\?\s*"700"\s*:\s*"400"/);
});

test('native Oasis run style and RTF import keep Arial normal/bold semantics through Save/Open envelope', () => {
  const converted = convertRtfHtmlToOasis(
    '<p><span data-rtf-font-family="Arial" style="font-family: Arial">Normal</span> <strong><span data-rtf-font-family="Arial" style="font-family: Arial">Bold</span></strong></p>',
    { createDocument, createParagraph, Parser },
  ).document;
  const runs = converted.sections[0].blocks[0].runs;
  const normal = runs.find((run) => run.text === 'Normal');
  const bold = runs.find((run) => run.text === 'Bold');
  assert.equal(normal.styles?.fontFamily, 'Arial');
  assert.notEqual(normal.styles?.bold, true);
  assert.equal(bold.styles?.fontFamily, 'Arial');
  assert.equal(bold.styles?.bold, true);

  const reopened = decodeOasisEnvelope(JSON.stringify(encodeOasisEnvelope(converted))).document;
  const reopenedRuns = reopened.sections[0].blocks[0].runs;
  assert.notEqual(reopenedRuns.find((run) => run.text === 'Normal').styles?.bold, true);
  assert.equal(reopenedRuns.find((run) => run.text === 'Bold').styles?.bold, true);
  assert.equal(reopenedRuns.find((run) => run.text === 'Bold').styles?.fontFamily, 'Arial');
});

test('adapter recognizes semantic strong/bold and does not leak formatting to neighboring normal runs', () => {
  const converted = convertRtfHtmlToOasis(
    '<p>Before <b>Bold</b> After</p>',
    { createDocument, createParagraph, Parser },
  ).document;
  const stylesByText = Object.fromEntries(converted.sections[0].blocks[0].runs.map((run) => [run.text, run.styles?.bold === true]));
  assert.deepEqual(stylesByText, { 'Before ': false, Bold: true, ' After': false });
});

test('R46A exposes opt-in Local Font Access audit without changing renderer resolution', () => {
  const toolbar = read('components/EditorTextosFormatToolbar.jsx');
  const candidates = fs.readFileSync(path.resolve(import.meta.dirname, '../src/features/relatoriosConfiguracao/constants/localFontCandidates.js'), 'utf8');
  assert.match(toolbar, /Carregar fontes do computador/);
  assert.match(candidates, /LEGACY_FONT_FAMILIES/);
  assert.match(candidates, /loadLocalFontFamilies/);
});

test('R46B loads local font families only from an explicit toolbar action and preserves fallback', () => {
  const toolbar = fs.readFileSync(path.resolve(import.meta.dirname, '../src/features/editorTextos/components/EditorTextosFormatToolbar.jsx'), 'utf8');
  const candidates = fs.readFileSync(path.resolve(import.meta.dirname, '../src/features/relatoriosConfiguracao/constants/localFontCandidates.js'), 'utf8');
  assert.match(toolbar, /Carregar fontes do computador/);
  assert.match(toolbar, /onClick=\{ensureFontsLoaded\}/);
  assert.doesNotMatch(toolbar, /onFocus=\{ensureFontsLoaded\}/);
  assert.match(candidates, /queryLocalFonts/);
  assert.match(candidates, /LEGACY_FONT_FAMILIES/);
});
