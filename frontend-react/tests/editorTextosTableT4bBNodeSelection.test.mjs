import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { UndoRedo } from '@tiptap/extensions';
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

function makeEditor(borderVisible = true) {
  const element = document.createElement('div');
  document.body.appendChild(element);
  const editor = new Editor({ element, extensions, content: `<table data-et-border-visible="${borderVisible}"><tbody><tr><td><p></p></td><td><p></p></td></tr></tbody></table><p></p>`, immediatelyRender: false });
  editor.view.scrollToSelection = () => {};
  return editor;
}

test('selectTable creates native NodeSelection targeting table without document mutation', () => {
  const editor = makeEditor();
  const before = editor.getJSON();
  assert.equal(selectTable(editor, 1), true);
  assert.equal(editor.state.selection.constructor.name, 'NodeSelection');
  assert.equal(editor.state.selection.node.type.name, 'table');
  assert.deepEqual(editor.getJSON(), before);
  editor.destroy();
});

test('selected table keeps border false and exits to cell or trailing paragraph', () => {
  const editor = makeEditor(false);
  assert.equal(selectTable(editor, 1), true);
  assert.equal(editor.state.selection.node.attrs.borderVisible, false);
  const tableEnd = editor.state.doc.firstChild.nodeSize;
  assert.equal(editor.commands.setTextSelection(4), true);
  assert.equal(editor.state.selection.$from.node(-1).type.name, 'tableCell');
  assert.equal(editor.commands.setTextSelection(editor.state.doc.content.size), true);
  assert.equal(editor.state.selection.$from.parent.type.name, 'paragraph');
  assert.equal(editor.state.doc.childCount, 2);
  editor.destroy();
});

test('selection extension mounts with a stable explicit plugin key', () => {
  const first = makeEditor();
  const second = makeEditor();
  assert.equal(first.state.plugins.some(plugin => plugin.key !== 'plugin$'), true);
  assert.doesNotThrow(() => second.view.updateState(second.state));
  first.destroy();
  second.destroy();
});

test('selection handle is a non-persisted ProseMirror widget anchored to the table', () => {
  const editor = makeEditor();
  const handle = editor.view.dom.querySelector('.editor-table-selection-handle');
  assert.ok(handle);
  assert.equal(handle.dataset.tablePosition, '0');
  assert.doesNotMatch(editor.getHTML(), /editor-table-selection-handle/);
  editor.destroy();
});

test('Delete and Backspace remove only a selected table', () => {
  for (const key of ['Delete', 'Backspace']) {
    const editor = makeEditor();
    assert.equal(selectTable(editor, 1), true);
    const handled = editor.view.someProp('handleKeyDown', handler => handler(editor.view, new window.KeyboardEvent('keydown', { key })));
    assert.equal(handled, true);
    assert.equal(editor.state.doc.firstChild.type.name, 'paragraph');
    assert.equal(editor.state.doc.childCount, 1);
    editor.destroy();
  }
});
