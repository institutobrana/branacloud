import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { InlineTabExtension } from '../src/features/editorTextos/extensions/InlineTabExtension.js';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;

const extensions = [
  Document,
  Paragraph,
  Text,
  Table.configure({ resizable: false, allowTableNodeSelection: true }),
  TableRow,
  TableHeader,
  TableCell,
  InlineTabExtension,
];

function makeEditor() {
  const element = document.createElement('div');
  document.body.appendChild(element);
  return new Editor({ element, extensions, content: '<table><tbody><tr><td><p>A</p></td><td><p>B</p></td></tr><tr><td><p>C</p></td><td><p>D</p></td></tr></tbody></table>', immediatelyRender: false });
}

function cellCursor(editor, wantedIndex) {
  let index = 0;
  let cursor = null;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
      if (index === wantedIndex) cursor = pos + 2;
      index += 1;
    }
  });
  assert.notEqual(cursor, null);
  editor.commands.setTextSelection(cursor);
}

function key(editor, key, shiftKey = false) {
  editor.view.focus();
  editor.view.dom.dispatchEvent(new window.KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }));
}

function currentCellIndex(editor) {
  const { $from } = editor.state.selection;
  for (let depth = $from.depth; depth > 0; depth -= 1) {
    const node = $from.node(depth);
    if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') return $from.index(depth - 1);
  }
  return -1;
}

test('Table keymap wins over InlineTab inside cells', () => {
  const editor = makeEditor();
  cellCursor(editor, 0);
  key(editor, 'Tab');
  assert.equal(currentCellIndex(editor), 1);
  assert.equal(editor.getHTML().includes('inline-tab'), false);
  editor.destroy();
});

test('Table keymap handles forward and backward navigation', () => {
  const editor = makeEditor();
  cellCursor(editor, 1);
  const before = editor.state.selection.from;
  assert.equal(editor.commands.goToNextCell(), true);
  const after = editor.state.selection.from;
  assert.notEqual(after, before);
  assert.equal(editor.commands.goToPreviousCell(), true);
  assert.equal(editor.state.selection.from, before);
  editor.destroy();
});

test('InlineTab remains active outside tables and lists remain unaffected', () => {
  const editor = new Editor({ element: document.createElement('div'), extensions: [Document, Paragraph, Text, InlineTabExtension], content: '<p>x</p>', immediatelyRender: false });
  editor.view.coordsAtPos = () => ({ left: 0 });
  editor.view.dom.getBoundingClientRect = () => ({ left: 0 });
  editor.commands.setTextSelection(2);
  assert.equal(editor.commands.insertInlineTab(), true);
  assert.match(editor.getHTML(), /data-et-tab-op="tab"/);
  editor.destroy();
});
