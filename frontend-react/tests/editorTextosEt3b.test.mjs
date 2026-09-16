import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://localhost/' });
for (const [key, value] of Object.entries({
  window: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  HTMLElement: dom.window.HTMLElement,
  Node: dom.window.Node,
  DOMParser: dom.window.DOMParser,
  getSelection: dom.window.getSelection.bind(dom.window),
})) {
  Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
}

const { Editor } = await import('@tiptap/core');
const Document = (await import('@tiptap/extension-document')).default;
const Paragraph = (await import('@tiptap/extension-paragraph')).default;
const Text = (await import('@tiptap/extension-text')).default;
const Bold = (await import('@tiptap/extension-bold')).default;
const Italic = (await import('@tiptap/extension-italic')).default;
const Underline = (await import('@tiptap/extension-underline')).default;
const { TextStyle } = await import('@tiptap/extension-text-style');
const Color = (await import('@tiptap/extension-color')).default;
const TextAlign = (await import('@tiptap/extension-text-align')).default;
const BulletList = (await import('@tiptap/extension-bullet-list')).default;
const ListItem = (await import('@tiptap/extension-list-item')).default;
const { createEditorEngineAdapter } = await import('../src/features/editorTextos/adapters/EditorEngineAdapter.js');
const { LegacyHtmlAdapter } = await import('../src/features/editorTextos/adapters/LegacyHtmlAdapter.js');
const { EDITOR_TEXTOS_FIXTURES } = await import('../src/features/editorTextos/fixtures/editorTextosFixtures.js');

const extensions = [Document, Paragraph, Text, Bold, Italic, Underline, TextStyle, Color.configure({ types: ['textStyle'] }), TextAlign.configure({ types: ['paragraph'] }), BulletList, ListItem];
const editor = new Editor({ element: document.body, extensions, content: '<p></p>', immediatelyRender: false });
const adapter = createEditorEngineAdapter(editor);
let updates = 0;
const unsubscribe = adapter.subscribeToChanges(() => { updates += 1; });

for (const fixture of EDITOR_TEXTOS_FIXTURES) {
  adapter.loadContent(LegacyHtmlAdapter.deserializeLegacyHtml(fixture.html));
  const exported = LegacyHtmlAdapter.serializeToLegacyHtml(adapter.getContent());
  assert.match(exported, /<p|<ul/);
  if (fixture.id.includes('MERGE_FIELD')) assert.match(exported, /\{\{nome\}\}/);
}

adapter.loadContent('<p>fixture A</p>');
assert.match(adapter.getContent(), /fixture A/);
adapter.loadContent('<p>fixture B</p>');
assert.match(adapter.getContent(), /fixture B/);
assert.equal(updates, 0, 'programmatic load must not mark dirty or emit update');
adapter.loadContent('<p>fixture C</p>', { emitUpdate: true });
assert.equal(updates, 1);
unsubscribe();
adapter.destroy();
console.log(`ET3B PASS: ${EDITOR_TEXTOS_FIXTURES.length} fixtures, reload, adapter and cleanup`);
