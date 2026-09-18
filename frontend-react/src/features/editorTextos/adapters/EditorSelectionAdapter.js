function getTextStyleMark(node) {
  return node.marks?.find((mark) => mark.type.name === 'textStyle');
}

export function getFormattingValuesInSelection(state, from, to) {
  const values = { fontFamily: [], fontSize: [], color: [] };
  if (from === to) return values;
  state.doc.nodesBetween(from, to, (node, position) => {
    if (!node.isText || !node.text?.trim()) return;
    const mark = getTextStyleMark(node)?.attrs || {};
    const start = Math.max(from, position);
    const end = Math.min(to, position + node.nodeSize);
    if (start >= end) return;
    for (const key of Object.keys(values)) {
      const value = mark[key] ?? null;
      if (!values[key].some((current) => current === value)) values[key].push(value);
    }
  });
  return values;
}

function mixedFormatting(values) {
  return Object.fromEntries(Object.entries(values).map(([key, items]) => [key, items.length > 1]));
}

export function createEditorSelectionAdapter(editor) {
  if (!editor) return null;
  return {
    getSelection() {
      const { from, to } = editor.state.selection;
      return { from, to, text: editor.state.doc.textBetween(from, to, '\n') };
    },
    getActiveFormats() {
      const { from, to } = editor.state.selection;
      const selectionValues = getFormattingValuesInSelection(editor.state, from, to);
      return {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        list: editor.isActive('bulletList'),
        textStyle: editor.getAttributes('textStyle'),
        mixedTextStyle: mixedFormatting(selectionValues),
        textAlign: editor.getAttributes('paragraph').textAlign || null,
      };
    },
    getCurrentBlock() {
      return editor.state.selection.$from.parent.type.name;
    },
    applyFormatting(command, attrs) {
      const chain = editor.chain().focus();
      if (typeof chain[command] !== 'function') return false;
      return chain[command](attrs).run();
    },
    restoreFocus() {
      editor.commands.focus();
    },
  };
}
