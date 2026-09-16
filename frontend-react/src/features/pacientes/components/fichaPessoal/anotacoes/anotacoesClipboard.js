function selectionPayload(editor) {
  const { from, to } = editor.state.selection;
  if (from === to) return null;
  const slice = editor.state.doc.slice(from, to);
  const text = slice.content.textBetween(0, slice.content.size, '\n');
  const container = document.createElement('div');
  const fragment = editor.schema
    ? editor.view.serializeForClipboard(slice).dom
    : null;
  if (fragment) container.appendChild(fragment.cloneNode(true));
  return { text, html: container.innerHTML || text };
}

function legacyCopySelection() {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false;
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  }
}

function insertClipboardContent(editor, from, to, value) {
  const currentParent = editor.state.doc.resolve(from).parent;
  const container = document.createElement('div');
  container.innerHTML = value;
  const parsed = ProseMirrorDOMParser.fromSchema(editor.schema).parseSlice(container, { preserveWhitespace: 'full' });
  const first = parsed.content.firstChild;
  const isSingleInlineBlock = parsed.content.childCount === 1
    && first?.type?.name === 'paragraph'
    && currentParent?.type?.isTextblock;
  const slice = isSingleInlineBlock ? new Slice(first.content, 0, 0) : parsed;
  editor.commands.setTextSelection({ from, to });
  return editor.view.dispatch(editor.state.tr.replaceSelection(slice));
}

export function clipboardCapabilities() {
  const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : null;
  return {
    clipboard: Boolean(clipboard),
    write: Boolean(clipboard?.write && typeof ClipboardItem !== 'undefined'),
    writeText: Boolean(clipboard?.writeText),
    read: Boolean(clipboard?.read),
    readText: Boolean(clipboard?.readText),
    secureContext: typeof window !== 'undefined' && Boolean(window.isSecureContext),
  };
}

export async function copySelection(editor) {
  const payload = selectionPayload(editor);
  if (!payload || typeof navigator === 'undefined' || !navigator.clipboard) return false;
  if (navigator.clipboard.write && typeof ClipboardItem !== 'undefined') {
    try {
      await navigator.clipboard.write([new ClipboardItem({
        'text/plain': new Blob([payload.text], { type: 'text/plain' }),
        'text/html': new Blob([payload.html], { type: 'text/html' }),
      })]);
      return true;
    } catch (error) {
      if (!navigator.clipboard.writeText) return legacyCopySelection();
    }
  }
  if (navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(payload.text); return true;
    } catch (error) {
      return legacyCopySelection();
    }
  }
  return legacyCopySelection();
}

export async function cutSelection(editor) {
  const { from, to } = editor.state.selection;
  const copied = await copySelection(editor);
  if (copied) {
    editor.commands.setTextSelection({ from, to });
    editor.commands.deleteSelection();
  }
  return copied;
}

export async function pasteClipboard(editor) {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  const { from, to } = editor.state.selection;
  const insert = (value) => {
    insertClipboardContent(editor, from, to, value);
  };
  if (navigator.clipboard.read) {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      if (item.types.includes('text/html')) {
        const blob = await item.getType('text/html');
        const text = await blob.text(); insert(text);
        return true;
      }
      if (item.types.includes('text/plain')) {
        const blob = await item.getType('text/plain');
        const text = await blob.text(); insert(text);
        return true;
      }
    }
    return false;
  }
  if (navigator.clipboard.readText) {
    const text = await navigator.clipboard.readText(); insert(text);
    return true;
  }
  return false;
}
import { DOMParser as ProseMirrorDOMParser, Slice } from '@tiptap/pm/model';
