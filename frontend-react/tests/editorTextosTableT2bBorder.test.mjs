import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { Editor, Extension } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { UndoRedo } from '@tiptap/extensions';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;

const EditorTableBorderExtension = Extension.create({
  name: 'editorTableBorder',
  addGlobalAttributes() {
    return [{
      types: ['table'],
      attributes: {
        borderVisible: {
          default: true,
          parseHTML: element => element.getAttribute('data-et-border-visible') !== 'false',
          renderHTML: attributes => ({ 'data-et-border-visible': String(attributes.borderVisible !== false) }),
        },
      },
    }];
  },
});

const extensions = [Document, Paragraph, Text, Table.configure({ resizable: false }), TableRow, TableHeader, TableCell, EditorTableBorderExtension, UndoRedo];

function editorWith(content) {
  const element = document.createElement('div');
  document.body.appendChild(element);
  return new Editor({ element, extensions, content, immediatelyRender: false });
}

function tableNode(editor) { return editor.state.doc.firstChild; }

test('T2B isolated borderVisible proof', async t => {
  await t.test('schema, default and true/false render', () => {
    const editor = editorWith('<p></p>');
    editor.commands.insertTable({ rows: 1, cols: 1, withHeaderRow: false });
    assert.equal(tableNode(editor).attrs.borderVisible, true);
    assert.match(editor.getHTML(), /data-et-border-visible="true"/);
    editor.commands.updateAttributes('table', { borderVisible: false });
    assert.equal(tableNode(editor).attrs.borderVisible, false);
    assert.match(editor.getHTML(), /data-et-border-visible="false"/);
    assert.equal(editor.schema.nodes.table, tableNode(editor).type);
    editor.destroy();
  });

  await t.test('parse, transaction and history', () => {
    const editor = editorWith('<table data-et-border-visible="false"><tbody><tr><td><p>x</p></td></tr></tbody></table>');
    assert.equal(tableNode(editor).attrs.borderVisible, false);
    editor.commands.updateAttributes('table', { borderVisible: true });
    assert.equal(tableNode(editor).attrs.borderVisible, true);
    assert.equal(editor.commands.undo(), true);
    assert.equal(tableNode(editor).attrs.borderVisible, false);
    assert.equal(editor.commands.redo(), true);
    assert.equal(tableNode(editor).attrs.borderVisible, true);
    editor.destroy();
  });

  await t.test('true/false HTML roundtrip and clipboard fragment contract', () => {
    for (const value of [true, false]) {
      const source = editorWith('<p></p>');
      source.commands.insertTable({ rows: 1, cols: 1, withHeaderRow: false });
      source.commands.updateAttributes('table', { borderVisible: value });
      const html = source.getHTML();
      const reopened = editorWith(html);
      assert.equal(tableNode(reopened).attrs.borderVisible, value);
      assert.match(html, new RegExp(`data-et-border-visible="${value}"`));
      source.destroy();
      reopened.destroy();
    }
  });
});
