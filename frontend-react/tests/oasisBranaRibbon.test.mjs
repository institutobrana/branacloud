import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { registerOasisBranaRibbonItems, OASIS_BRANA_RIBBON_EVENT, OASIS_NEW_DOCUMENT_ITEM_ID, OASIS_UNIFIED_IMPORT_ITEM_ID } from '../src/features/editorTextos/oasis/oasisBranaRibbon.js';

const source = (relative) => fs.readFileSync(path.resolve(import.meta.dirname, '../src/features/editorTextos', relative), 'utf8');

test('Brana ribbon commands are registered in Oasis native tabs and removed on teardown', () => {
  const items = new Map();
  const insertions = [];
  const beforeInsertions = [];
  const removed = [];
  const originalImportItem = { id: OASIS_UNIFIED_IMPORT_ITEM_ID, type: 'button', label: 'Importar DOCX' };
  const originalNewItem = { id: OASIS_NEW_DOCUMENT_ITEM_ID, type: 'button', label: 'Novo Documento nativo' };
  items.set(originalImportItem.id, originalImportItem);
  items.set(originalNewItem.id, originalNewItem);
  const client = { ui: { toolbar: { items: {
    get(id) { return items.get(id); },
    replace(id, item) { assert.ok([OASIS_UNIFIED_IMPORT_ITEM_ID, OASIS_NEW_DOCUMENT_ITEM_ID].includes(id)); items.set(item.id, item); },
    insertAfter(target, item) { insertions.push(target); items.set(item.id, item); },
    insertBefore(target, item) { beforeInsertions.push(target); items.set(item.id, item); },
    remove(id) { removed.push(id); items.delete(id); },
  } } } };

  const dispose = registerOasisBranaRibbonItems(client);
  const registered = [...items.values()].filter((item) => ![OASIS_UNIFIED_IMPORT_ITEM_ID, OASIS_NEW_DOCUMENT_ITEM_ID].includes(item.id));
  assert.deepEqual(beforeInsertions, ['editor-toolbar-new-document', 'editor-toolbar-new-document']);
  assert.deepEqual(insertions, ['editor-toolbar-new-document', 'editor-toolbar-print', 'editor-toolbar-insert-table']);
  assert.deepEqual(registered.map(({ label, tab, type }) => [label, tab, type]), [
    ['Salvar', 'file', 'custom'],
    ['Salvar como', 'file', 'custom'],
    ['Abrir', 'file', 'custom'],
    ['Assinar PDF', 'file', 'custom'],
    ['Campo de mesclagem', 'insert', 'custom'],
  ]);
  assert.deepEqual([items.get(OASIS_UNIFIED_IMPORT_ITEM_ID).label, items.get(OASIS_UNIFIED_IMPORT_ITEM_ID).tab], ['Importar documento', 'file']);
  assert.deepEqual([items.get(OASIS_NEW_DOCUMENT_ITEM_ID).label, items.get(OASIS_NEW_DOCUMENT_ITEM_ID).tab], ['Novo Documento', 'file']);
  assert.ok(registered.every((item) => item.ribbonSize === 'large' && typeof item.render === 'function'));

  dispose();
  assert.equal(items.size, 2);
  assert.equal(items.get(OASIS_UNIFIED_IMPORT_ITEM_ID), originalImportItem);
  assert.equal(items.get(OASIS_NEW_DOCUMENT_ITEM_ID), originalNewItem);
  assert.equal(removed.length, 5);
});

test('the unified import item dispatches the Brana import action', () => {
  const oldDocument = globalThis.document;
  const oldWindow = globalThis.window;
  const oldCustomEvent = globalThis.CustomEvent;
  const dispatched = [];
  const native = { id: OASIS_UNIFIED_IMPORT_ITEM_ID, type: 'button', label: 'Importar DOCX' };
  const newNative = { id: OASIS_NEW_DOCUMENT_ITEM_ID, type: 'button', label: 'Novo Documento nativo' };
  const items = new Map([[native.id, native], [newNative.id, newNative]]);
  class Element {
    constructor(tag) { this.tagName = tag; this.attributes = {}; this.dataset = {}; this.children = []; this.listeners = {}; }
    setAttribute(name, value) { this.attributes[name] = value; }
    append(...nodes) { this.children.push(...nodes); }
    addEventListener(name, callback) { this.listeners[name] = callback; }
  }
  globalThis.document = { createElement: (tag) => new Element(tag) };
  globalThis.window = { dispatchEvent: (event) => dispatched.push(event) };
  globalThis.CustomEvent = class { constructor(type, options) { this.type = type; this.detail = options.detail; } };
  try {
    const registry = { get: (id) => items.get(id), replace: (_id, item) => items.set(item.id, item), insertBefore() {}, insertAfter() {}, remove() {} };
    registerOasisBranaRibbonItems({ ui: { toolbar: { items: registry } } });
    const button = items.get(OASIS_UNIFIED_IMPORT_ITEM_ID).render();
    assert.equal(button.attributes['aria-label'], 'Importar documento');
    button.listeners.click();
    assert.deepEqual(dispatched[0].detail, { action: 'import-document' });
  } finally {
    globalThis.document = oldDocument;
    globalThis.window = oldWindow;
    globalThis.CustomEvent = oldCustomEvent;
  }
});

test('Oasis custom ribbon button dispatches its Brana command through the supported custom-item renderer', () => {
  const oldDocument = globalThis.document;
  const oldWindow = globalThis.window;
  const oldCustomEvent = globalThis.CustomEvent;
  const dispatched = [];
  class Element {
    constructor(tag) { this.tagName = tag; this.attributes = {}; this.dataset = {}; this.children = []; this.listeners = {}; }
    setAttribute(name, value) { this.attributes[name] = value; }
    append(...nodes) { this.children.push(...nodes); }
    addEventListener(name, callback) { this.listeners[name] = callback; }
  }
  globalThis.document = { createElement: (tag) => new Element(tag) };
  globalThis.window = { dispatchEvent: (event) => dispatched.push(event) };
  globalThis.CustomEvent = class { constructor(type, options) { this.type = type; this.detail = options.detail; } };
  try {
    let openItem;
    let newDocumentItem;
    const native = { id: OASIS_UNIFIED_IMPORT_ITEM_ID, type: 'button', label: 'Importar DOCX' };
    const newNative = { id: OASIS_NEW_DOCUMENT_ITEM_ID, type: 'button', label: 'Novo Documento nativo' };
    registerOasisBranaRibbonItems({ ui: { toolbar: { items: { get(id) { return id === native.id ? native : id === newNative.id ? newNative : undefined; }, replace(_id, item) { if (item.id === newNative.id) newDocumentItem = item; }, insertBefore() {}, insertAfter(_target, item) { if (item.label === 'Abrir') openItem = item; }, remove() {} } } } });
    const button = openItem.render();
    assert.equal(button.tagName, 'button');
    assert.equal(button.attributes['aria-label'], 'Abrir');
    button.listeners.click();
    assert.equal(dispatched[0].type, OASIS_BRANA_RIBBON_EVENT);
    assert.deepEqual(dispatched[0].detail, { action: 'open' });
    assert.equal(newDocumentItem.label, 'Novo Documento');
    newDocumentItem.render().listeners.click();
    assert.deepEqual(dispatched[1].detail, { action: 'new-document' });
  } finally {
    globalThis.document = oldDocument;
    globalThis.window = oldWindow;
    globalThis.CustomEvent = oldCustomEvent;
  }
});

test('Save commands in the Oasis File ribbon reuse the existing Brana action handlers', () => {
  const pilot = source('oasis/OasisEditorPilot.jsx');
  const tabBar = source('oasis/EditorTextosOasisTabBar.jsx');
  assert.match(pilot, /action === 'save'\) window\.dispatchEvent\(new CustomEvent\('brana-editor-textos-action',[\s\S]*?action: 'salvar'/);
  assert.match(pilot, /action === 'save-as'\) window\.dispatchEvent\(new CustomEvent\('brana-editor-textos-action',[\s\S]*?action: 'salvar-como'/);
  assert.doesNotMatch(tabBar, /Salvar|salvar-como|preserved-actions/);
});

test('Oasis Open uses the existing Brana model endpoint and preserves the Oasis envelope and page configuration', () => {
  const pilot = source('oasis/OasisEditorPilot.jsx');
  assert.match(pilot, /editorTextosApi\.listDocuments\(\)/);
  assert.match(pilot, /editorTextosApi\.getDocument\(id\)/);
  assert.match(pilot, /decodeOasisEnvelope\(dto\?\.conteudo\)/);
  assert.match(pilot, /document = envelope\.document/);
  assert.match(pilot, /client\.document\.load\(document\)/);
  assert.match(pilot, /documentIdRef\.current = dto\?\.id/);
  assert.match(pilot, /pageConfigRef\.current = normalizePageConfig\(dto\?\.pagina_config/);
  assert.match(pilot, /savedSnapshotRef\.current = getPersistableDocumentSnapshot/);
  assert.match(pilot, /document\.load\(createOasisNewDocument\(\)\)/);
});

test('Merge field inserts the literal API token through Oasis selection and insertText command', () => {
  const pilot = source('oasis/OasisEditorPilot.jsx');
  const api = source('api/editorTextosApi.js');
  assert.match(pilot, /mergeSelectionRef\.current = selection/);
  assert.match(pilot, /client\.selection\.set\(mergeSelectionRef\.current\)/);
  assert.match(pilot, /client\.commands\.execute\('insertText', token\)/);
  assert.match(pilot, /EditorTextosMergeFieldDialog/);
  assert.match(api, /listMergeFields\(\)\s*\{\s*return requestJson\('\/editor-textos\/campos'\)/);
  assert.match(api, /\/editor-textos\/mesclar/);
});

test('PDF signing exports the current Oasis document and submits the Brana PAdES contract without mutating the source', () => {
  const pilot = source('oasis/OasisEditorPilot.jsx');
  const api = source('api/editorTextosApi.js');
  const dialog = source('components/EditorTextosSignPdfDialog.jsx');
  assert.match(pilot, /client\.io\.export\(\{ format: 'pdf'/);
  assert.match(pilot, /editorTextosApi\.signPdf\(/);
  assert.match(pilot, /signed\.blob/);
  assert.match(api, /form\.append\('pfx_file'/);
  assert.match(api, /form\.append\('signature_profile', 'pades'\)/);
  assert.match(api, /\/editor-textos\/assinar-pdf/);
  assert.match(dialog, /accept="\.pfx,\.p12/);
  assert.match(dialog, /Input\.Password/);
  assert.doesNotMatch(pilot.slice(pilot.indexOf('const signCurrentDocument'), pilot.indexOf('\n\n  return')), /document\.load|document\.update|document\.markClean/);
});
