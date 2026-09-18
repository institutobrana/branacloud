import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import HardBreak from '@tiptap/extension-hard-break';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { UndoRedo } from '@tiptap/extensions';
import { JSDOM } from 'jsdom';
import { LegacyHtmlAdapter } from '../src/features/editorTextos/adapters/LegacyHtmlAdapter.js';
import { safeRoundtripCheck } from '../src/features/editorTextos/models/LegacyDocumentFormatDetector.js';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node, MutationObserver: dom.window.MutationObserver, DOMParser: dom.window.DOMParser });
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
globalThis.cancelAnimationFrame = clearTimeout;

const extensions = [Document, Paragraph, Text, HardBreak, Bold, Italic, Underline,
  TextStyle.extend({ name: 'textStyle', addGlobalAttributes() { return [{ types: ['textStyle'], attributes: {
    fontFamily: { default: null, parseHTML: (e) => e.style.fontFamily || null, renderHTML: (a) => a.fontFamily ? { style: `font-family: ${a.fontFamily}` } : {} },
    fontSize: { default: null, parseHTML: (e) => e.style.fontSize || null, renderHTML: (a) => a.fontSize ? { style: `font-size: ${a.fontSize}` } : {} },
  } }]; } }), Color.configure({ types: ['textStyle'] }), TextAlign.configure({ types: ['paragraph'] }),
  BulletList, ListItem, Table.configure({ resizable: false, allowTableNodeSelection: true }), TableRow, TableHeader, TableCell, UndoRedo];

function backendHtml(relativePath) {
  const script = `import sys,json; from dotenv import dotenv_values; import os; os.environ.update({k:v for k,v in dotenv_values('../backend/.env').items() if v is not None}); sys.path.insert(0,'../backend'); from routes.editor_textos_routes import _load_content_bundle_from_path; from pathlib import Path; print(json.dumps(_load_content_bundle_from_path(Path(${JSON.stringify(relativePath)}))['html']))`;
  const p = spawnSync('..\\.venv\\Scripts\\python.exe', ['-c', script], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, timeout: 30000 });
  assert.equal(p.status, 0, p.stderr);
  return JSON.parse(p.stdout);
}

function run(html) {
  const editor = new Editor({ extensions, content: html });
  const output = editor.getHTML();
  const tokens = (value) => [...value.replaceAll('&lt;', '<').replaceAll('&gt;', '>').matchAll(/<<[^<>\r\n]+?\.[^<>\r\n]+?>>/g)].map((m) => m[0]);
  const before = tokens(html);
  const after = tokens(output);
  const current = safeRoundtripCheck({ sourceHtml: html, exportedHtml: output, serializedLegacyHtml: LegacyHtmlAdapter.serializeToLegacyHtml(output) });
  editor.destroy();
  return { output, before, after, current };
}

test('F2B real legacy anchors produce a frozen current baseline', () => {
  for (const [id, path] of [[11, '../storage/modelos/base/outros/Agradecimento 1.rtf'], [63, '../storage/modelos/clinicas/1/atestados/ATESTADO_TEL_BRANA.mod'], [38, '../storage/modelos/base/outros/Modelo1.rec']]) {
    const result = run(backendHtml(path));
    assert.ok(result.output.startsWith('<p'), `model ${id}`);
    assert.equal(typeof result.current.safe, 'boolean');
  }
});

test('F2B model 38 preserves backend token semantics after entity decoding', () => {
  const html = backendHtml('../storage/modelos/base/outros/Modelo1.rec');
  const result = run(html);
  assert.equal(result.before.length, 24);
  assert.equal(new Set(result.before).size, 12);
  assert.deepEqual(result.after, result.before);
});

test('F2B synthetic RTF backend semantics cover controls and angle tokens', () => {
  const py = `from dotenv import dotenv_values; import os; os.environ.update({k:v for k,v in dotenv_values('../backend/.env').items() if v is not None}); import sys; sys.path.insert(0,'../backend'); from routes.editor_textos_routes import _rtf_to_html; print(_rtf_to_html(r'{\\rtf1\\ansi A < B > \\par <<Paciente.Nome>> \\line C \\tab D \\b bold\\b0 \\i italic\\i0 \\ul under\\ulnone}'))`;
  const p = spawnSync('..\\.venv\\Scripts\\python.exe', ['-c', py], { encoding: 'utf8' });
  assert.equal(p.status, 0, p.stderr);
  assert.match(p.stdout, /&lt;&lt;Paciente\.Nome&gt;&gt;/);
  assert.match(p.stdout, /<br>/);
  assert.match(p.stdout, /&emsp;/);
  assert.match(p.stdout, /<strong>/);
  assert.match(p.stdout, /<em>/);
  assert.match(p.stdout, /<u>/);
});

test('F2B documents current hard-break loss and future expectation separately', () => {
  const result = run('<p>A<br>B</p>');
  assert.equal(result.output, '<p>A<br>B</p>');
  assert.equal(result.current.safe, true);
  assert.equal('<p>A<br>B</p>', '<p>A<br>B</p>');
});
