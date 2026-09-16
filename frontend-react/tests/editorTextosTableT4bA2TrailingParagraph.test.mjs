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
import { insertTable, isInTable } from '../src/features/editorTextos/table/tableCommands.js';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.requestAnimationFrame = callback => callback();
globalThis.HTMLElement.prototype.getClientRects = () => [{ left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 }];
globalThis.HTMLElement.prototype.getBoundingClientRect = () => ({ left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 });
globalThis.Node.prototype.getClientRects = () => [{ left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 }];

const extensions = [Document, Paragraph, Text, Table.configure({ resizable: false, allowTableNodeSelection: true }), TableRow, TableHeader, TableCell, EditorTableBorderExtension, UndoRedo];

function makeEditor(content = '<p></p>') {
  const element = document.createElement('div');
  document.body.appendChild(element);
  const editor = new Editor({ element, extensions, content, immediatelyRender: false });
  editor.view.scrollToSelection = () => {};
  return editor;
}

function insert(editor, options = {}) {
  return insertTable(editor, { rows: 1, cols: 1, borderVisible: true, ...options });
}

function tableAndTrailing(editor) {
  return editor.state.doc.childCount === 2 && editor.state.doc.firstChild.type.name === 'table' && editor.state.doc.lastChild.type.name === 'paragraph';
}

test('final table gets one trailing paragraph and caret stays in first cell', () => {
  const editor = makeEditor();
  assert.equal(insert(editor), true);
  assert.equal(tableAndTrailing(editor), true);
  assert.equal(editor.state.selection.constructor.name, 'TextSelection');
  assert.equal(isInTable(editor), true);
  editor.destroy();
});

test('1x1 and 2x2 inserts preserve trailing paragraph and border', () => {
  for (const [rows, cols] of [[1, 1], [2, 2]]) {
    const editor = makeEditor();
    assert.equal(insert(editor, { rows, cols }), true);
    assert.equal(tableAndTrailing(editor), true);
    assert.equal(editor.state.doc.firstChild.attrs.borderVisible, true);
    assert.match(editor.getHTML(), /<p><\/p>$/);
    editor.destroy();
  }
});

test('false border survives with trailing paragraph', () => {
  const editor = makeEditor();
  assert.equal(insert(editor, { borderVisible: false }), true);
  assert.equal(editor.state.doc.firstChild.attrs.borderVisible, false);
  assert.match(editor.getHTML(), /data-et-border-visible="false"/);
  assert.equal(tableAndTrailing(editor), true);
  editor.destroy();
});

test('trailing paragraph is imported and round-tripped without changing border', () => {
  const editor = makeEditor();
  insert(editor, { borderVisible: false });
  const html = editor.getHTML();
  const reopened = makeEditor(html);
  assert.equal(reopened.state.doc.firstChild.type.name, 'table');
  assert.equal(reopened.state.doc.firstChild.attrs.borderVisible, false);
  assert.equal(reopened.state.doc.lastChild.type.name, 'paragraph');
  assert.match(reopened.getHTML(), /data-et-border-visible="false"/);
  editor.destroy();
  reopened.destroy();
});

test('typing in the trailing paragraph is a real normal-text position', () => {
  const editor = makeEditor();
  insert(editor);
  editor.commands.setTextSelection(editor.state.doc.content.size);
  editor.commands.insertContent('DEPOIS');
  assert.equal(editor.state.doc.lastChild.textContent, 'DEPOIS');
  assert.equal(isInTable(editor), false);
  editor.destroy();
});

test('undo and redo restore table plus trailing paragraph together', () => {
  const editor = makeEditor('<p>ANTES</p>');
  const before = editor.getJSON();
  insert(editor, { rows: 2, cols: 2 });
  assert.equal(editor.commands.undo(), true);
  assert.deepEqual(editor.getJSON(), before);
  assert.equal(editor.commands.redo(), true);
  assert.equal(editor.state.doc.firstChild.type.name, 'table');
  assert.equal(editor.state.doc.childCount, 2);
  assert.equal(editor.state.doc.lastChild.type.name, 'paragraph');
  editor.destroy();
});

test('no extra trailing paragraph is created when a paragraph already follows', () => {
  const editor = makeEditor();
  insert(editor);
  const before = editor.state.doc.childCount;
  const table = editor.state.doc.firstChild;
  assert.equal(table.type.name, 'table');
  assert.equal(editor.state.doc.lastChild.type.name, 'paragraph');
  assert.equal(editor.state.doc.childCount, before);
  editor.destroy();
});

test('non-final block content is not changed by the trailing policy', () => {
  const editor = makeEditor('<p>ANTES</p><p>DEPOIS</p>');
  editor.commands.setTextSelection(6);
  const before = editor.state.doc.childCount;
  assert.equal(insert(editor), true);
  assert.equal(editor.state.doc.childCount, before + 1);
  assert.equal(editor.state.doc.lastChild.textContent, 'DEPOIS');
  editor.destroy();
});
