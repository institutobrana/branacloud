export function createEditorEngineAdapter(editor) {
  if (!editor) return null;
  return {
    loadContent(content = '<p></p>', options = {}) {
      editor.chain().setMeta('addToHistory', false).setContent(content, { emitUpdate: options.emitUpdate ?? false }).run();
    },
    getContent() {
      return editor.getHTML();
    },
    focus() {
      editor.commands.focus();
    },
    executeCommand(command, attrs) {
      const chain = editor.chain().focus();
      if (command === 'setFontFamily' || command === 'setFontSize') {
        return chain.setMark('textStyle', { [command === 'setFontFamily' ? 'fontFamily' : 'fontSize']: attrs }).run();
      }
      if (typeof chain[command] !== 'function') return false;
      return chain[command](attrs).run();
    },
    getSelectionState() {
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
    subscribeToChanges(callback) {
      editor.on('update', callback);
      return () => editor.off('update', callback);
    },
    subscribeToSelectionChanges(callback) {
      editor.on('selectionUpdate', callback);
      return () => editor.off('selectionUpdate', callback);
    },
    destroy() {
      editor.destroy();
    },
  };
}
