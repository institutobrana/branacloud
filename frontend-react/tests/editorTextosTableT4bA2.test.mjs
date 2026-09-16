import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { Editor, Extension } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { UndoRedo } from '@tiptap/extensions';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { insertTable } from '../src/features/editorTextos/table/tableCommands.js';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = handle => clearTimeout(handle);

const Border = Extension.create({
  name: 'editorTableBorder',
  addGlobalAttributes() {
    return [{ types: ['table'], attributes: {
      borderVisible: {
        default: true,
        parseHTML: element => element.getAttribute('data-et-border-visible') !== 'false',
        renderHTML: attributes => ({ 'data-et-border-visible': String(attributes.borderVisible !== false) }),
      },
    } }];
  },
});

const extensions = [Document, Paragraph, Text, Table.configure({ resizable: false }), TableRow, TableHeader, TableCell, Border, UndoRedo];

function makeEditor(content = '<p></p>') {
  const element = document.createElement('div');
  document.body.appendChild(element);
  return new Editor({ element, extensions, content, immediatelyRender: false });
}

function topTypes(editor) { return editor.state.doc.content.content.map(node => node.type.name); }
function selectionInFirstCell(editor) {
  const { $from } = editor.state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    if ($from.node(depth).type.name === 'tableCell') return true;
  }
  return false;
}

test('T4B-A2 trailing paragraph contract', async t => {
  await t.test('final table gets one paragraph and caret stays in first cell', () => {
    const editor = makeEditor('<p>ANTES</p>');
    assert.equal(insertTable(editor, { rows: 1, cols: 1 }), true);
    assert.deepEqual(topTypes(editor), ['table', 'paragraph']);
    assert.equal(selectionInFirstCell(editor), true);
    assert.equal(editor.state.selection.constructor.name, 'TextSelection');
    assert.equal(editor.state.doc.lastChild.type.name, 'paragraph');
    editor.destroy();
  });

  await t.test('empty document, non-final table and existing paragraph do not duplicate', () => {
    const empty = makeEditor('<p></p>');
    insertTable(empty, { rows: 1, cols: 1 });
    assert.deepEqual(topTypes(empty), ['table', 'paragraph']);
    assert.equal(selectionInFirstCell(empty), true);

    const nonFinal = makeEditor('<p></p><p>DEPOIS</p>');
    insertTable(nonFinal, { rows: 1, cols: 1 });
    assert.deepEqual(topTypes(nonFinal), ['table', 'paragraph']);

    const existing = makeEditor('<p></p><table><tbody><tr><td><p>x</p></td></tr></tbody></table><p></p>');
    existing.commands.setTextSelection(1);
    insertTable(existing, { rows: 1, cols: 1 });
    assert.deepEqual(topTypes(existing), ['table', 'table', 'paragraph']);
    empty.destroy(); nonFinal.destroy(); existing.destroy();
  });

  await t.test('single logical history, undo/redo, border and roundtrip', () => {
    const editor = makeEditor();
    insertTable(editor, { rows: 1, cols: 1, borderVisible: true });
    const html = editor.getHTML();
    assert.match(html, /data-et-border-visible="true"/);
    assert.match(html, /<table[\s\S]*<\/table>[\s\S]*<p><\/p>/);
    assert.equal(editor.commands.undo(), true);
    assert.deepEqual(topTypes(editor), ['paragraph']);
    assert.equal(editor.commands.redo(), true);
    assert.deepEqual(topTypes(editor), ['table', 'paragraph']);
    const reopened = makeEditor(editor.getHTML());
    assert.deepEqual(topTypes(reopened), ['table', 'paragraph']);
    assert.match(reopened.getHTML(), /data-et-border-visible="true"/);
    editor.destroy(); reopened.destroy();
  });
});
