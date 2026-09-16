import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { UndoRedo } from '@tiptap/extensions';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { EditorTableBorderExtension } from '../src/features/editorTextos/table/EditorTableBorderExtension.js';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;

const extensions = [Document, Paragraph, Text, Table.configure({ resizable: false, allowTableNodeSelection: true }), TableRow, TableHeader, TableCell, EditorTableBorderExtension, UndoRedo];

function makeEditor(content = '<p></p>') {
  const element = document.createElement('div');
  document.body.appendChild(element);
  return new Editor({ element, extensions, content, immediatelyRender: false });
}

function table(editor) { return editor.state.doc.firstChild; }

test('T3B real registry borderVisible proof', () => {
  const editor = makeEditor('<table data-et-border-visible="true"><tbody><tr><td><p>x</p></td></tr></tbody></table>');
  assert.ok(editor.schema.nodes.table);
  assert.equal(table(editor).attrs.borderVisible, true);
  assert.match(editor.getHTML(), /data-et-border-visible="true"/);
  assert.equal(editor.commands.updateAttributes('table', { borderVisible: false }), true);
  assert.equal(table(editor).attrs.borderVisible, false);
  assert.match(editor.getHTML(), /data-et-border-visible="false"/);
  assert.equal(editor.commands.undo(), true);
  assert.equal(table(editor).attrs.borderVisible, true);
  assert.equal(editor.commands.redo(), true);
  assert.equal(table(editor).attrs.borderVisible, false);
  editor.destroy();
});

test('T3B parses true, false and absent attributes', () => {
  for (const [html, expected] of [
    ['<table data-et-border-visible="true"><tbody><tr><td><p>x</p></td></tr></tbody></table>', true],
    ['<table data-et-border-visible="false"><tbody><tr><td><p>x</p></td></tr></tbody></table>', false],
    ['<table><tbody><tr><td><p>x</p></td></tr></tbody></table>', true],
  ]) {
    const editor = makeEditor(html);
    assert.equal(table(editor).attrs.borderVisible, expected);
    editor.destroy();
  }
});
