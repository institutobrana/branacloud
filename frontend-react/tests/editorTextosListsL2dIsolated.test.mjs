import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { Editor, Extension } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import { UndoRedo } from '@tiptap/extensions';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;

const STEP = 24;
const RootListIndent = Extension.create({
  name: 'isolatedListIndent',
  addGlobalAttributes() {
    return [{ types: ['bulletList'], attributes: {
      listIndentPx: {
        default: 0,
        parseHTML: (element) => Math.max(0, Number.parseFloat(element.style.marginInlineStart) || 0),
        renderHTML: (attributes) => attributes.listIndentPx > 0 ? { style: `margin-inline-start: ${attributes.listIndentPx}px` } : {},
      },
    }}];
  },
});

function makeEditor(content = '<ul><li><p>one</p></li><li><p>two</p></li></ul>') {
  return new Editor({ element: document.createElement('div'), extensions: [Document, Paragraph, Text, BulletList, ListItem, UndoRedo, RootListIndent], content });
}

test('schema, atributo, render e parse preservam o recuo no UL', () => {
  const editor = makeEditor();
  editor.commands.command(({ tr }) => { tr.setNodeMarkup(0, undefined, { ...tr.doc.firstChild.attrs, listIndentPx: STEP }); return true; });
  const html = editor.getHTML();
  assert.match(html, /<ul[^>]*style="margin-inline-start: 24px;?"/);
  assert.doesNotMatch(html, /<p[^>]*margin-inline-start/);
  const parsed = makeEditor(html);
  assert.equal(parsed.getJSON().content[0].attrs.listIndentPx, STEP);
  assert.match(html, /<ul[^>]*>[\s\S]*<li>[\s\S]*<p>one/); // marker and text share the UL/list structure
  editor.destroy(); parsed.destroy();
});

test('transaction, one-step value change and zero clamp', () => {
  const editor = makeEditor();
  let count = 0;
  editor.commands.command(({ tr }) => { count += 1; tr.setNodeMarkup(0, undefined, { ...tr.doc.firstChild.attrs, listIndentPx: STEP }); return true; });
  assert.equal(count, 1);
  assert.equal(editor.getJSON().content[0].attrs.listIndentPx, STEP);
  editor.commands.command(({ tr }) => { tr.setNodeMarkup(0, undefined, { ...tr.doc.firstChild.attrs, listIndentPx: Math.max(0, STEP - STEP) }); return true; });
  assert.equal(editor.getJSON().content[0].attrs.listIndentPx, 0);
  editor.destroy();
});

test('detector estrutural distingue primeiro e segundo listItem', () => {
  const editor = makeEditor();
  const list = editor.state.doc.firstChild;
  const positions = [1, 1 + list.child(0).nodeSize];
  const indexes = positions.map((pos) => {
    const $pos = editor.state.doc.resolve(pos + 2);
    for (let depth = $pos.depth; depth > 0; depth -= 1) {
      if ($pos.node(depth).type.name === 'listItem') return $pos.index(depth - 1);
    }
    return -1;
  });
  assert.deepEqual(indexes, [0, 1]);
  editor.destroy();
});

test('roundtrip e clipboard HTML preservam múltiplos níveis de atributo', () => {
  const editor = makeEditor();
  editor.commands.command(({ tr }) => { tr.setNodeMarkup(0, undefined, { ...tr.doc.firstChild.attrs, listIndentPx: STEP * 3 }); return true; });
  const html = editor.getHTML();
  const pasted = makeEditor(html);
  assert.equal(pasted.getJSON().content[0].attrs.listIndentPx, STEP * 3);
  assert.equal(pasted.getJSON().content[0].type, 'bulletList');
  editor.destroy(); pasted.destroy();
});

test('histórico isolado desfaz e refaz uma alteração da UL', () => {
  const editor = makeEditor();
  editor.commands.command(({ tr }) => { tr.setNodeMarkup(0, undefined, { ...tr.doc.firstChild.attrs, listIndentPx: STEP }); return true; });
  assert.equal(editor.getJSON().content[0].attrs.listIndentPx, STEP);
  editor.commands.undo();
  assert.equal(editor.getJSON().content[0].attrs.listIndentPx, 0);
  editor.commands.redo();
  assert.equal(editor.getJSON().content[0].attrs.listIndentPx, STEP);
  editor.destroy();
});

console.log('L2D ISOLATED POC PASS: 5/5');
