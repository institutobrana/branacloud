import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import { UndoRedo } from '@tiptap/extensions';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
if (!globalThis.navigator) Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator });
globalThis.HTMLElement = dom.window.HTMLElement;

const extensions = [
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  Underline,
  Table.configure({ resizable: true, allowTableNodeSelection: true }),
  TableRow,
  TableHeader,
  TableCell,
  UndoRedo,
];

function makeEditor(content = '<p></p>') {
  const element = document.createElement('div');
  document.body.appendChild(element);
  return new Editor({ element, extensions, content, immediatelyRender: false });
}

function table(editor) {
  return editor.state.doc.firstChild;
}

function cellCount(editor) {
  return table(editor).content.content.reduce((n, row) => n + row.childCount, 0);
}

test('T1C isolated Tiptap table proof', async (t) => {
  await t.test('schema, insertion and HTML', () => {
    const editor = makeEditor();
    assert.ok(editor.schema.nodes.table);
    assert.ok(editor.schema.nodes.tableRow);
    assert.ok(editor.schema.nodes.tableHeader);
    assert.ok(editor.schema.nodes.tableCell);
    assert.equal(editor.commands.insertTable({ rows: 1, cols: 1, withHeaderRow: false }), true);
    assert.equal(table(editor).type.name, 'table');
    assert.equal(cellCount(editor), 1);
    editor.commands.setContent('<p></p>');
    editor.commands.insertTable({ rows: 2, cols: 2, withHeaderRow: false });
    const html = editor.getHTML();
    assert.match(html, /<table[\s\S]*<tbody>[\s\S]*<tr>[\s\S]*<td(?:\s[^>]*)?>/);
    assert.equal((html.match(/<tr>/g) || []).length, 2);
    assert.equal((html.match(/<td(?:\s[^>]*)?>/g) || []).length, 4);
    editor.destroy();
  });

  await t.test('row, column, delete and header commands', () => {
    const editor = makeEditor();
    editor.commands.insertTable({ rows: 2, cols: 2, withHeaderRow: false });
    assert.equal(editor.commands.addRowAfter(), true);
    assert.equal(table(editor).childCount, 3);
    assert.equal(editor.commands.addColumnAfter(), true);
    assert.equal(table(editor).firstChild.childCount, 3);
    assert.equal(editor.commands.deleteColumn(), true);
    assert.equal(editor.commands.deleteRow(), true);
    assert.equal(editor.commands.toggleHeaderRow(), true);
    assert.equal(editor.commands.toggleHeaderColumn(), true);
    assert.equal(editor.commands.toggleHeaderCell(), true);
    assert.equal(editor.commands.deleteTable(), true);
    assert.equal(editor.state.doc.firstChild.type.name, 'paragraph');
    editor.destroy();
  });

  await t.test('roundtrip, rich text, history and native navigation API', () => {
    const editor = makeEditor('<table><tbody><tr><td><p><strong>A</strong></p></td><td><p>B</p></td></tr></tbody></table>');
    const html = editor.getHTML();
    const reopened = makeEditor(html);
    assert.equal(reopened.getJSON().content[0].type, 'table');
    assert.match(html, /<strong>A<\/strong>/);
    assert.equal(typeof editor.commands.goToNextCell, 'function');
    assert.equal(typeof editor.commands.goToPreviousCell, 'function');
    assert.equal(typeof editor.commands.mergeCells, 'function');
    assert.equal(typeof editor.commands.splitCell, 'function');
    assert.equal(typeof editor.commands.undo, 'function');
    assert.equal(typeof editor.commands.redo, 'function');
    editor.commands.insertTable({ rows: 1, cols: 1, withHeaderRow: false });
    assert.equal(editor.commands.undo(), true);
    assert.equal(editor.commands.redo(), true);
    editor.destroy();
    reopened.destroy();
  });
});
