import { DOMSerializer } from 'prosemirror-model';

function selectedHtml(editor) {
  const { from, to } = editor.state.selection;
  const fragment = DOMSerializer.fromSchema(editor.schema).serializeFragment(editor.state.doc.slice(from, to).content);
  const container = document.createElement('div');
  container.appendChild(fragment);
  return container.innerHTML;
}

function selectedText(editor) {
  const { from, to } = editor.state.selection;
  return editor.state.doc.textBetween(from, to, '\n');
}

function hasSelection(editor) {
  const { from, to } = editor.state.selection;
  return from !== to;
}

export function createEditorClipboardAdapter(editor) {
  if (!editor) return null;

  let internalClipboard = null;

  const restoreSelection = () => {
    editor.commands.focus(undefined, { preventScroll: true });
  };

  return {
    async copy() {
      if (!hasSelection(editor)) return false;
      const text = selectedText(editor);
      const html = selectedHtml(editor);
      if (navigator.clipboard?.write && typeof window.ClipboardItem === 'function') {
        await navigator.clipboard.write([new ClipboardItem({ 'text/plain': new Blob([text], { type: 'text/plain' }), 'text/html': new Blob([html], { type: 'text/html' }) })]);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard indisponível neste navegador.');
      }
      internalClipboard = { html, text };
      restoreSelection();
      return true;
    },
    async cut() {
      if (!hasSelection(editor)) return false;
      await this.copy();
      restoreSelection();
      return editor.commands.deleteSelection();
    },
    async paste() {
      restoreSelection();
      if (internalClipboard) {
        if (internalClipboard.html) return editor.commands.insertContent(internalClipboard.html);
        return internalClipboard.text ? editor.commands.insertContent(internalClipboard.text) : false;
      }
      if (navigator.clipboard?.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          if (item.types.includes('text/html')) {
            const blob = await item.getType('text/html');
            const html = await blob.text();
            if (html) return editor.commands.insertContent(html);
          }
          if (item.types.includes('text/plain')) {
            const blob = await item.getType('text/plain');
            const text = await blob.text();
            if (text) return editor.commands.insertContent(text);
          }
        }
        return false;
      }
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        return text ? editor.commands.insertContent(text) : false;
      }
      throw new Error('Clipboard indisponível neste navegador.');
    },
  };
}
