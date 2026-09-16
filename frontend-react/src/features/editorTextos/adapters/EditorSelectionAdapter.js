export function createEditorSelectionAdapter(editor) {
  if (!editor) return null;
  return {
    getSelection() {
      const { from, to } = editor.state.selection;
      return { from, to, text: editor.state.doc.textBetween(from, to, '\n') };
    },
    getActiveFormats() {
      return {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        list: editor.isActive('bulletList'),
        textStyle: editor.getAttributes('textStyle'),
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
