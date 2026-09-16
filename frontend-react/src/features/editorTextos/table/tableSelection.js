import { Extension } from '@tiptap/core';
import { NodeSelection, Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

const editorTableSelectionPluginKey = new PluginKey('editorTableSelection');

export function findTablePosition(state, position) {
  const $pos = state.doc.resolve(position);
  for (let depth = $pos.depth; depth > 0; depth -= 1) {
    if ($pos.node(depth).type.name === 'table') return $pos.before(depth);
  }
  return null;
}

export function selectTable(editor, position = editor?.state?.selection?.from) {
  if (!editor || !Number.isInteger(position)) return false;
  const tablePosition = findTablePosition(editor.state, position);
  if (tablePosition == null) return false;
  return editor.commands.setNodeSelection(tablePosition);
}

function deleteSelectedTable(editor) {
  const selection = editor?.state?.selection;
  if (!(selection instanceof NodeSelection) || selection.node?.type?.name !== 'table') return false;
  return editor.commands.deleteSelection();
}

export const EditorTableSelectionExtension = Extension.create({
  name: 'editorTableSelection',

  addKeyboardShortcuts() {
    return {
      Delete: () => deleteSelectedTable(this.editor),
      Backspace: () => deleteSelectedTable(this.editor),
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: editorTableSelectionPluginKey,
        props: {
          handleDOMEvents: {
            mousedown: (view, event) => {
              const handle = event.target?.closest?.('.editor-table-selection-handle');
              if (!handle) return false;
              const position = Number(handle.dataset.tablePosition);
              return Number.isInteger(position) && this.editor.commands.setNodeSelection(position);
            },
          },
          decorations: (state) => {
            const widgets = [];
            state.doc.descendants((node, pos) => {
              if (node.type.name !== 'table') return;
              const handle = document.createElement('button');
              handle.type = 'button';
              handle.className = 'editor-table-selection-handle';
              handle.setAttribute('aria-label', 'Selecionar tabela');
              handle.textContent = '▦';
              handle.dataset.tablePosition = String(pos);
              widgets.push(Decoration.widget(pos, handle, { side: -1, stopEvent: () => false }));
            });
            return DecorationSet.create(state.doc, widgets);
          },
        },
      }),
    ];
  },
});
