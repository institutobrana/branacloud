import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { UndoRedo } from '@tiptap/extensions';
import { NodeSelection } from 'prosemirror-state';
import { EditorTableBorderExtension } from '../src/features/editorTextos/table/EditorTableBorderExtension.js';
import { EditorTableSelectionExtension, selectTable } from '../src/features/editorTextos/table/tableSelection.js';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.requestAnimationFrame = callback => callback();
globalThis.HTMLElement.prototype.getClientRects = () => [{ left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 }];
globalThis.Node.prototype.getClientRects = () => [{ left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 }];

const extensions = [Document, Paragraph, Text, Table.configure({ resizable: false, allowTableNodeSelection: true }), TableRow, TableHeader, TableCell, EditorTableBorderExtension, EditorTableSelectionExtension, UndoRedo];

function makeEditor(content = '<table data-et-border-visible="true"><tbody><tr><td><p></p></td></tr></tbody></table><p></p>') {
  const element = document.createElement('div');
  document.body.appendChild(element);
  const editor = new Editor({ element, extensions, content, immediatelyRender: false });
  editor.view.scrollToSelection = () => {};
  return editor;
}

function selectFirstTable(editor) {
  assert.equal(selectTable(editor, 1), true);
  assert.equal(editor.state.selection instanceof NodeSelection, true);
}

function dispatchKey(editor, key) {
  const event = new window.KeyboardEvent('keydown', { key });
  return Boolean(editor.view.someProp('handleKeyDown', handler => handler(editor.view, event)));
}

for (const key of ['Delete', 'Backspace']) {
  test(`${key} removes selected table and preserves trailing paragraph`, () => {
    const editor = makeEditor();
    selectFirstTable(editor);
    assert.equal(dispatchKey(editor, key), true);
    assert.equal(editor.state.doc.childCount, 1);
    assert.equal(editor.state.doc.firstChild.type.name, 'paragraph');
    assert.equal(editor.state.selection.$from.parent.type.name, 'paragraph');
    assert.equal(editor.getHTML().includes('<table'), false);
    assert.equal(editor.view.dom.querySelector('.editor-table-selection-handle'), null);
    editor.destroy();
  });
}

test('native deleteSelection removes the table between blocks and selects the following paragraph', () => {
  const editor = makeEditor('<p>ANTES</p><table><tbody><tr><td><p></p></td></tr></tbody></table><p>DEPOIS</p>');
  const tablePos = editor.state.doc.child(0).nodeSize;
  editor.view.dispatch(editor.state.tr.setSelection(NodeSelection.create(editor.state.doc, tablePos)));
  assert.equal(editor.commands.deleteSelection(), true);
  assert.deepEqual(editor.getJSON().content.map(node => node.type), ['paragraph', 'paragraph']);
  assert.equal(editor.state.selection.$from.parent.textContent, 'DEPOIS');
  editor.destroy();
});

test('native deleteSelection keeps a valid paragraph when table is the only node', () => {
  const editor = makeEditor('<table><tbody><tr><td><p></p></td></tr></tbody></table>');
  editor.view.dispatch(editor.state.tr.setSelection(NodeSelection.create(editor.state.doc, 0)));
  assert.equal(editor.commands.deleteSelection(), true);
  assert.equal(editor.state.doc.childCount, 1);
  assert.equal(editor.state.doc.firstChild.type.name, 'paragraph');
  editor.destroy();
});

test('table deletion preserves border semantics before removal for both values', () => {
  for (const borderVisible of [true, false]) {
    const editor = makeEditor(`<table data-et-border-visible="${borderVisible}"><tbody><tr><td><p></p></td></tr></tbody></table><p></p>`);
    selectFirstTable(editor);
    assert.equal(editor.state.selection.node.attrs.borderVisible, borderVisible);
    assert.equal(editor.commands.deleteSelection(), true);
    assert.equal(editor.getHTML().includes('data-et-border-visible'), false);
    editor.destroy();
  }
});

test('undo and redo restore and remove the whole table in one history step', () => {
  const editor = makeEditor();
  selectFirstTable(editor);
  assert.equal(editor.commands.deleteSelection(), true);
  assert.equal(editor.state.doc.childCount, 1);
  assert.equal(editor.commands.undo(), true);
  assert.equal(editor.state.doc.firstChild.type.name, 'table');
  assert.equal(editor.commands.redo(), true);
  assert.equal(editor.state.doc.firstChild.type.name, 'paragraph');
  editor.destroy();
});

test('Delete and Backspace handlers do not consume normal cell or paragraph editing', () => {
  const editor = makeEditor('<table><tbody><tr><td><p>ABC</p></td></tr></tbody></table><p>DEPOIS</p>');
  assert.equal(editor.commands.setTextSelection(6), true);
  assert.equal(dispatchKey(editor, 'Backspace'), false);
  assert.equal(dispatchKey(editor, 'Delete'), false);
  assert.equal(editor.state.doc.firstChild.type.name, 'table');
  assert.equal(editor.commands.setTextSelection(editor.state.doc.content.size), true);
  assert.equal(dispatchKey(editor, 'Backspace'), false);
  assert.equal(dispatchKey(editor, 'Delete'), false);
  assert.equal(editor.state.doc.childCount, 2);
  editor.destroy();
});

test('deleted table is absent after HTML roundtrip', () => {
  const editor = makeEditor();
  selectFirstTable(editor);
  editor.commands.deleteSelection();
  const html = editor.getHTML();
  const roundtrip = makeEditor(html);
  assert.equal(roundtrip.getJSON().content.some(node => node.type === 'table'), false);
  editor.destroy();
  roundtrip.destroy();
});
