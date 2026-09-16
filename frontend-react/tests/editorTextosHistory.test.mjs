import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const page = fs.readFileSync(new URL('../src/features/editorTextos/EditorTextosPage.jsx', import.meta.url), 'utf8');
const adapter = fs.readFileSync(new URL('../src/features/editorTextos/adapters/EditorEngineAdapter.js', import.meta.url), 'utf8');

test('EditorTextos usa o histórico UndoRedo nativo do Tiptap 3', () => {
  assert.match(page, /import \{ UndoRedo \} from '@tiptap\/extensions'/);
  assert.match(page, /\bUndoRedo,[\s\S]*InlineTabExtension,[\s\S]*ParagraphIndentExtension,[\s\S]*ResizableImageExtension/);
});

test('carregamento de documento não entra no histórico', () => {
  assert.match(adapter, /setMeta\('addToHistory', false\)\.setContent/);
});

test('indentação de parágrafo usa transação, separada de Tab inline', () => {
  const extension = fs.readFileSync(new URL('../src/features/editorTextos/extensions/ParagraphIndentExtension.js', import.meta.url), 'utf8');
  assert.match(page, /ParagraphIndentExtension/);
  const inlineTab = fs.readFileSync(new URL('../src/features/editorTextos/extensions/InlineTabExtension.js', import.meta.url), 'utf8');
  assert.match(inlineTab, /name: 'inlineTab'/);
  assert.match(inlineTab, /insertInlineTab/);
  assert.match(inlineTab, /removePreviousInlineTab/);
  assert.match(inlineTab, /removeNextInlineTab/);
  assert.match(inlineTab, /nodeAfter/);
  assert.match(inlineTab, /node\.nodeSize/);
  assert.match(inlineTab, /if \(!this\.editor\.isFocused\) return false/);
  assert.match(inlineTab, /data-et-tab-op/);
  assert.match(inlineTab, /DEFAULT_TAB_STOP_INTERVAL = 32/);
  assert.match(inlineTab, /closeHistory/);
  assert.match(inlineTab, /dispatch\(closeHistory\(state\.tr\)\)/);
  assert.match(extension, /setNodeMarkup/);
  assert.match(extension, /margin-left/);
  assert.match(extension, /MAX_INDENT/);
});

test('imagem é atom inline no fluxo textual sem GapCursor ou boundaries artificiais', () => {
  const image = fs.readFileSync(new URL('../src/features/editorTextos/extensions/ResizableImageExtension.js', import.meta.url), 'utf8');
  assert.match(image, /group: 'inline'/);
  assert.match(image, /inline: true/);
  assert.match(image, /atom: true/);
  assert.match(page, /type: 'image',\s*attrs: \{ src, width, height, fitPage \}/);
  assert.doesNotMatch(page, /onlyEmptyParagraph|afterImage/);
  assert.doesNotMatch(page, /\bGapcursor\b|\bGapCursor\b/);
});

test('botão de imagem usa picker nativo único e mantém cancelamento inerte', () => {
  assert.match(page, /type="file" accept="image\/bmp,image\/jpeg,image\/png,image\/gif,image\/webp"/);
  assert.match(page, /imageInput\.current\?\.click\(\)/);
  assert.match(page, /if \(!file \|\| !editor\) return/);
  assert.doesNotMatch(page, /EditorTextosImageDialog/);
});

test('NodeView inline não amplia o hitbox lateral da imagem', () => {
  const nodeView = fs.readFileSync(new URL('../src/features/editorTextos/components/ResizableImageNodeView.jsx', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../src/features/editorTextos/styles/editorTextos.css', import.meta.url), 'utf8');
  assert.match(nodeView, /NodeViewWrapper as="span"/);
  assert.match(css, /\.editor-textos-image-node\{[^}]*display:inline-block/);
  assert.doesNotMatch(css, /\.editor-textos-image-node\{[^}]*display:block/);
});
